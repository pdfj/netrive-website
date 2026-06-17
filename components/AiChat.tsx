"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Headphones, Check } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: "Hey there, thanks for stopping by. What can I help you with today?",
};

function useProjectId() {
  const [projectId, setProjectId] = useState<string | null>(null);
  useEffect(() => {
    const m = window.location.pathname.match(
      /\/dashboard\/projects\/([0-9a-fA-F-]{8,})/
    );
    setProjectId(m ? m[1] : null);
  }, []);
  return projectId;
}

export function AiChat() {
  const projectId = useProjectId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [liveRequested, setLiveRequested] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, liveRequested]);

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
        body: JSON.stringify({
          messages: next.filter((m) => m !== GREETING),
          projectId,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "..." }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection hiccup. Mind trying that again?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const requestLive = async () => {
    if (liveRequested) return;
    setLiveRequested(true);
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content:
          "No problem, I've let the team know you'd like to chat with a real person. They'll jump in shortly. You can keep talking to me in the meantime.",
      },
    ]);
    try {
      await fetch("/api/chat/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          transcript: messages.filter((m) => m !== GREETING),
        }),
      });
    } catch {
      /* best-effort */
    }
  };

  return (
    <>
      {/* Launcher (bottom-left; WhatsApp lives bottom-right) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Chat with us"
          className="gradient-bg group fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-pill px-4 py-3 font-semibold text-white shadow-glow transition-transform duration-200 hover:scale-[1.04] sm:bottom-6 sm:left-6 sm:px-5"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden text-sm sm:inline">Chat with us</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 flex h-[min(560px,80vh)] w-[min(380px,92vw)] flex-col overflow-hidden rounded-card border border-white/10 bg-night shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="gradient-bg flex h-8 w-8 items-center justify-center rounded-full text-white">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">NetRive</p>
                <p className="text-[11px] text-haze">We usually reply in a moment</p>
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
                  className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "gradient-bg text-white"
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Typing…
                </div>
              </div>
            )}
          </div>

          {/* Talk to the team */}
          <div className="border-t border-white/10 px-3 pt-2">
            <button
              type="button"
              onClick={requestLive}
              disabled={liveRequested}
              className="flex w-full items-center justify-center gap-2 rounded-input border border-sky/25 bg-sky/[0.06] py-2 text-xs font-medium text-sky transition hover:bg-sky/[0.12] disabled:opacity-60"
            >
              {liveRequested ? (
                <><Check className="h-3.5 w-3.5" /> The team has been notified</>
              ) : (
                <><Headphones className="h-3.5 w-3.5" /> Talk to the team</>
              )}
            </button>
          </div>

          {/* Input */}
          <div className="bg-white/[0.02] p-3">
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
                placeholder="Type a message…"
                className="max-h-28 flex-1 resize-none rounded-input border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-sky focus:outline-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="gradient-bg inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
