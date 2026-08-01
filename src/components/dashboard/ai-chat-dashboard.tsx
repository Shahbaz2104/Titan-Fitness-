"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiPost } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Give me a beginner workout plan",
  "How much protein do I need?",
  "Tips for better sleep and recovery",
  "How can I get stronger on bench press?",
];

export function AiChatDashboard() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm your Titan AI coach. Ask me anything about workouts, nutrition, form, or recovery — I'm here to help you train harder and live stronger. 💪",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content }]);
    setLoading(true);
    try {
      const { reply } = await apiPost<{ reply: string }>("/api/ai/chat", { message: content });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I hit a snag. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col space-y-4">
      <DashboardPageHeader
        title="AI Coach"
        description="Your personal training assistant"
        icon={<Sparkles className="h-5 w-5" />}
      />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    message.role === "assistant"
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-2 text-muted-foreground"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </span>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "assistant"
                      ? "border-border bg-surface text-foreground border"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-xl">
                <Bot className="h-5 w-5" />
              </span>
              <div className="border-border bg-surface flex gap-1.5 rounded-2xl border px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="bg-primary h-2 w-2 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => send(suggestion)}
                className="border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground rounded-full border px-4 py-2 text-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="border-border border-t p-4">
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about workouts, nutrition, recovery…"
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
