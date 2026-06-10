"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

export function ChatBox({ projectId, userId }: { projectId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Stable client reference — not re-created on each render
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;

    const fetchMessages = () => {
      supabase
        .from("messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })
        .then(({ data }) => {
          if (!data) return;
          setMessages((prev) => {
            // Only update state when something actually changed (avoids re-render churn)
            if (prev.length === data.length && prev[prev.length - 1]?.id === data[data.length - 1]?.id) {
              return prev;
            }
            return data;
          });
        });
    };

    // Initial load
    fetchMessages();

    // Real-time subscription (instant delivery when enabled on the table)
    const channel = supabase
      .channel(`chat-client-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    // Polling fallback — guarantees delivery even if realtime isn't enabled
    const poll = setInterval(fetchMessages, 5000);

    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setSendError(null);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, content: text.trim() }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setSendError(json.error ?? "Failed to send. Try again.");
    } else {
      // Show the sent message immediately (poll/realtime will reconcile)
      const sent = await res.json().catch(() => null);
      if (sent?.id) {
        setMessages((prev) =>
          prev.find((m) => m.id === sent.id) ? prev : [...prev, sent as Message]
        );
      }
      setText("");
    }
    setSending(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-[420px] flex-col">
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="py-4 text-center text-sm text-haze">
            No messages yet. Say hi! 👋
          </p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === userId;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-[16px] px-4 py-2.5 text-sm leading-[1.6] ${
                    isMe
                      ? "rounded-br-sm bg-electric text-white"
                      : "rounded-bl-sm bg-white/[0.07] text-white"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {sendError && (
        <p className="mt-2 text-xs text-red-400">{sendError}</p>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type a message… (Enter to send)"
          className="flex-1 resize-none rounded-input border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-electric text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
