"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hey! \u{1F44B} I'm NetRive's AI assistant. Ask me about our web design, pricing, or how we build a free preview before you pay.",
};

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "..." }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection hiccup — please try again or use the WhatsApp button." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher button (bottom-left to avoid the WhatsApp button) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="group fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-pill bg-electric px-4 py-3 font-semibold text-white shadow-[0_8px_30px_rgba(44,95,255,0.4)] transition-transform duration-200 hover:scale-[1.04] sm:px-5"
        >
          <Sparkles className="h-5 w-5" />
          <span className="hidden text-sm sm:inline">Ask AI</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 flex h-[min(560px,80vh)] w-[min(380px,92vw)] flex-col overflow-hidden rounded-card border border-white/10 bg-night shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/15">
                <Sparkles className="h-4 w-4 text-electric" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">NetRive Assistant</p>
                <p className="text-[11px] text-haze">Usually replies instantly</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-haze transition hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-electric text-white"
                      : "border border-white/10 bg-white/[0.04] text-white/90"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-haze">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about your website…"
                className="max-h-28 flex-1 resize-none rounded-input border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric text-white transition hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-haze">AI can make mistakes — for a quote, start a project.</p>
          </div>
        </div>
      )}
    </>
  );
}
