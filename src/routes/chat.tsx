import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { runAiChat } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Assistant — Aurelio" },
      {
        name: "description",
        content:
          "Chat with your workplace AI assistant for drafting, planning, analysis and day-to-day problem solving.",
      },
      { property: "og:title", content: "AI Chat Assistant — Aurelio" },
      { property: "og:description", content: "Your always-on workplace AI assistant." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prepare for a difficult performance review",
  "Rewrite this update so it sounds more confident",
  "What should I delegate this week?",
];

function ChatPage() {
  const call = useServerFn(runAiChat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await call({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Chat" description="Ask anything about your work — drafting, planning, analysis.">
      <Card
        className="flex h-[calc(100vh-11rem)] flex-col overflow-hidden p-0"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span
                className="flex size-12 items-center justify-center rounded-2xl text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                <Sparkles className="size-6" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground">
                Start a conversation with AI_Workplace_productivity_Assistant.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-foreground"
                  }
                >
                  {m.role === "assistant" ? (
                    <div className="md-body">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          ) : null}
          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-card p-3 md:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask AI_Workplace_productivity_Assistant anything…"
              className="max-h-40 min-h-12 flex-1 resize-none"
            />
            <Button
              size="icon"
              onClick={() => void send(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
