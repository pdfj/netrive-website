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

export function AdminChatBox({
  projectId,
  adminUserId,
  clientId,
}: {
  projectId: string;
  adminUserId: string;
  clientId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Stable reference — not re-created on each render
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;

    supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    const channel = supabase
      .channel(`chat-admin-${projectId}`)
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

    return () => {
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
      setSendError(json.error ?? "Message failed to send. Try again.");
    } else {
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
    <div className="flex h-[450px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="py-4 text-center text-sm text-haze">
            No messages yet — start the conversation.
          </p>
        ) : (
          messages.map((m) => {
            const isAdmin = m.sender_id === adminUserId;
            return (
              <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-[16px] px-4 py-2.5 text-sm leading-[1.6] ${
                    isAdmin
                      ? "rounded-br-sm bg-electric text-white"
                      : "rounded-bl-sm bg-white/[0.07] text-white"
                  }`}
                >
                  {!isAdmin && m.sender_id !== clientId && (
                    <span className="mb-1 block text-[10px] text-sky">System</span>
                  )}
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {sendError && (
        <p className="mt-2 text-xs text-red-400">{sendError}</p>
      )}

      <div className="mt-3 flex gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Reply to client… (Enter to send)"
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
