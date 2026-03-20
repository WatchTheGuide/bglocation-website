"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuickReplies } from "@/components/chat/quick-replies";

const MAX_MESSAGES = 10;
const WELCOME_MESSAGE =
  "Hi! I can help with questions about capacitor-bglocation. Ask me about features, pricing, or integration.";

function getTextContent(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, status, error, sendMessage, regenerate } =
    useChat({
      onError: () => {},
    });

  const isLoading = status === "submitted" || status === "streaming";
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userMessageCount >= MAX_MESSAGES;
  const hasMessages = messages.length > 0;
  const is429 = error?.message?.includes("429");

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = panel!.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  const handleQuickReply = useCallback(
    (question: string) => {
      sendMessage({ text: question });
    },
    [sendMessage],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading || limitReached) return;
      sendMessage({ text: input });
      setInput("");
    },
    [input, isLoading, limitReached, sendMessage],
  );

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className={cn(
            "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center",
            "rounded-full bg-primary text-primary-foreground shadow-lg",
            "transition-transform hover:scale-105 active:scale-95",
          )}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with AI assistant"
          className={cn(
            "fixed z-50 flex flex-col bg-card text-card-foreground shadow-2xl",
            "border border-border",
            // Mobile: fullscreen
            "inset-0",
            // Desktop: floating panel
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-135 sm:w-100",
            "sm:rounded-xl",
            "animate-in fade-in slide-in-from-bottom-4 duration-200",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Ask about bglocation</h2>
              <p className="text-xs text-muted-foreground">
                Powered by AI — answers may be imperfect
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Welcome message */}
            <div className="mb-3 rounded-lg bg-muted px-3 py-2 text-sm">
              {WELCOME_MESSAGE}
            </div>

            {/* Quick replies */}
            {!hasMessages && <QuickReplies onSelect={handleQuickReply} />}

            {/* Message list */}
            {messages.map((m) => {
              const text = getTextContent(m.parts);
              return (
                <div
                  key={m.id}
                  className={cn(
                    "mb-3 max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {m.role === "assistant" ? (
                    <Markdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 list-disc pl-4 last:mb-0">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-4 last:mb-0">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-background/50 px-1 py-0.5 font-mono text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded bg-background/50 p-2 font-mono text-xs last:mb-0">
                            {children}
                          </pre>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline underline-offset-2"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {text}
                    </Markdown>
                  ) : (
                    text
                  )}
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-3 max-w-[85%] rounded-lg bg-muted px-3 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* Error state */}
            {error && !is429 && (
              <div className="mb-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm">
                <p>
                  Something went wrong. Try again or email us at{" "}
                  <a
                    href="mailto:hello@bglocation.dev"
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    hello@bglocation.dev
                  </a>
                  .
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => regenerate()}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* 429 state */}
            {is429 && (
              <div className="mb-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm">
                Too many requests. Please try again later.
              </div>
            )}

            {/* Limit reached */}
            {limitReached && (
              <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
                <p>
                  You&apos;ve reached the message limit for this conversation.
                  For more help, email us at{" "}
                  <a
                    href="mailto:hello@bglocation.dev"
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    hello@bglocation.dev
                  </a>
                  .
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t px-4 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                limitReached ? "Message limit reached" : "Ask a question..."
              }
              disabled={limitReached || isLoading}
              className={cn(
                "flex-1 rounded-md border bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading || limitReached}
              aria-label="Send message"
              className="h-9 w-9 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
