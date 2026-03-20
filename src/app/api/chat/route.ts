import { openai } from "@ai-sdk/openai";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { checkRateLimit } from "@/lib/chat/rate-limiter";
import { MAX_MESSAGES } from "@/lib/chat/constants";

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!appUrl) {
    console.error("Missing required environment variable NEXT_PUBLIC_BASE_URL");
    return new Response("Server misconfiguration: missing NEXT_PUBLIC_BASE_URL", { status: 500 });
  }

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(appUrl).origin;
  } catch {
    console.error("Invalid value for NEXT_PUBLIC_BASE_URL:", appUrl);
    return new Response("Server misconfiguration: invalid NEXT_PUBLIC_BASE_URL", { status: 500 });
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

  if (!body || typeof body !== "object" || !("messages" in body)) {
    return new Response("Invalid request body", { status: 400 });
  }

  const rawMessages: unknown[] = (body as { messages: unknown[] }).messages ?? [];

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return new Response("Invalid request body", { status: 400 });
  }

  // Cap total messages (user + assistant) to prevent token abuse
  const MAX_TOTAL_MESSAGES = MAX_MESSAGES * 2 + 1;
  if (rawMessages.length > MAX_TOTAL_MESSAGES) {
    return new Response("Conversation limit reached", { status: 400 });
  }

  // Validate each message has the expected shape
  const messages = rawMessages.filter(
    (m): m is UIMessage =>
      m != null &&
      typeof m === "object" &&
      "role" in m &&
      typeof (m as Record<string, unknown>).role === "string",
  );

  if (messages.length === 0) {
    return new Response("Invalid request body", { status: 400 });
  }

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  if (userMessageCount > MAX_MESSAGES) {
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
