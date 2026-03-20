import { openai } from "@ai-sdk/openai";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { checkRateLimit } from "@/lib/chat/rate-limiter";

const MAX_MESSAGES = 10;

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];
  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response("Too many requests", { status: 429 });
  }

  const body = await req.json();
  const messages: UIMessage[] = body.messages ?? [];

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Invalid request body", { status: 400 });
  }

  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length > MAX_MESSAGES) {
    return new Response("Conversation limit reached", { status: 400 });
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
