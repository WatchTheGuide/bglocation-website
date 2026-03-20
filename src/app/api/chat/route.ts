import { openai } from "@ai-sdk/openai";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { checkRateLimit } from "@/lib/chat/rate-limiter";
import { MAX_MESSAGES } from "@/lib/chat/constants";

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!appUrl) {
    return new Response("Server misconfiguration", { status: 500 });
  }

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(appUrl).origin;
  } catch {
    return new Response("Server misconfiguration", { status: 500 });
  }

  const originHeader = req.headers.get("origin");
  let requestOrigin: string | null = null;
  if (originHeader) {
    try {
      requestOrigin = new URL(originHeader).origin;
    } catch {
      requestOrigin = null;
    }
  }

  if (!requestOrigin || requestOrigin !== allowedOrigin) {
    return new Response("Forbidden", { status: 403 });
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  let ip: string | null = null;
  if (forwardedFor && forwardedFor.length > 0) {
    ip = forwardedFor.split(",")[0].trim();
  } else if (realIp && realIp.length > 0) {
    ip = realIp;
  }

  if (ip && !checkRateLimit(ip)) {
    return new Response("Too many requests", { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages: UIMessage[] =
    (body as Record<string, unknown>).messages as UIMessage[] ?? [];

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Invalid request body", { status: 400 });
  }

  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length > MAX_MESSAGES) {
    return new Response("Conversation limit reached", { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Chat is not configured", { status: 503 });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse();
}
