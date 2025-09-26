"use client";

import React, { useState, useRef, FormEvent, useEffect, useMemo } from "react";
import { useUser } from "@/lib/data/useUser";
import {
  sendMessageToList,
  useMessagesForList,
  ChatMessageDoc,
} from "./useChat";

type ChatMessage = {
  id: string;
  userId: string;
  userName?: string | null;
  photoURL?: string | null;
  createdAt: number;
  text: string;
  clientId?: string | null;
  failed?: boolean;
};

function isTimestampLike(value: unknown): boolean {
  if (!value) return false;
  const maybe = value as { toMillis?: () => number; toDate?: () => Date };
  return typeof maybe === "object" && (!!maybe.toMillis || !!maybe.toDate);
}

function coerceCreatedAt(raw: unknown): number {
  try {
    if (isTimestampLike(raw)) {
      const ts = raw as { toMillis?: () => number; toDate?: () => Date };
      if (ts.toMillis) return ts.toMillis();
      if (ts.toDate) return ts.toDate().getTime();
    }
    if (typeof raw === "number") return raw;
  } catch {
    /* ignore */
  }
  return Date.now();
}

function mapDoc(d: ChatMessageDoc): ChatMessage {
  return {
    id: d.id,
    userId: d.userId,
    userName: d.userName ?? null,
    photoURL: d.photoURL ?? null,
    createdAt: coerceCreatedAt(d.createdAt),
    text: d.text,
    clientId: d.clientId ?? null,
  };
}

export const ChatPanel = ({ listId }: { listId?: string }) => {
  const user = useUser();
  const rawMessages = useMessagesForList(listId);
  const serverMessages: ChatMessage[] = useMemo(
    () => rawMessages.map(mapDoc),
    [rawMessages]
  );

  const [isExpanded, setIsExpanded] = useState(true);
  const [input, setInput] = useState("");
  const [optimistic, setOptimistic] = useState<ChatMessage[]>([]);

  const merged: ChatMessage[] = useMemo(() => {
    const now = Date.now();
    const filtered = optimistic.filter((o) => {
      if (o.failed) return true;
      if (
        o.clientId &&
        serverMessages.some(
          (s) => s.clientId && o.clientId && s.clientId === o.clientId
        )
      )
        return false;
      return now - o.createdAt > 250; // delay to avoid flicker
    });
    const all = [...serverMessages, ...filtered];
    all.sort((a, b) => a.createdAt - b.createdAt);
    return all;
  }, [serverMessages, optimistic]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
    return () => clearTimeout(t);
  }, [merged.length]);

  const MAX_CHARS = 1000;

  function initials(nameOrId?: string | null): string {
    if (!nameOrId) return "??";
    const parts = nameOrId.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "??";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  async function sendMessage(text: string) {
    const t = text.trim();
    if (!t || !listId || !user) return;
    if (t.length > MAX_CHARS) return;
    const clientId = `c-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const temp: ChatMessage = {
      id: `tmp-${clientId}`,
      userId: user.uid,
      userName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: Date.now(),
      text: t,
      clientId,
    };
    setOptimistic((prev) => prev.concat(temp));
    setInput("");
    inputRef.current?.focus();
    try {
      await sendMessageToList(
        listId,
        {
          uid: user.uid,
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
        },
        t,
        clientId
      );
    } catch (err) {
      setOptimistic((prev) =>
        prev.map((m) => (m.clientId === clientId ? { ...m, failed: true } : m))
      );
      console.error("Failed to send chat message", err);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || input.length > MAX_CHARS) return;
    void sendMessage(input);
  }

  return (
    <div
      className={`position-fixed end-0 bg-light border-start shadow ${
        isExpanded ? "chat-panel-expanded" : "chat-panel-collapsed"
      }`}
      style={{
        transition: "width 0.3s ease-in-out",
        zIndex: 1000,
        width: isExpanded ? "300px" : "40px",
        top: 0,
        bottom: 0,
      }}
    >
      <button
        className="btn btn-sm btn-light border-bottom border-start rounded-0 d-flex align-items-center justify-content-center"
        onClick={() => setIsExpanded((p) => !p)}
        style={{
          width: 40,
          height: 40,
          position: "absolute",
          left: -40,
          top: 8,
        }}
        title={isExpanded ? "Collapse chat" : "Expand chat"}
        aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
      >
        <span
          className={`bi bi-chevron-${isExpanded ? "right" : "left"}`}
          aria-hidden="true"
        />
        <span className="visually-hidden">
          {isExpanded ? "Collapse chat" : "Expand chat"}
        </span>
      </button>
      {isExpanded && (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="p-3 border-bottom" style={{ flex: "0 0 auto" }}>
            <h6 className="mb-0">Chat</h6>
          </div>
          <div className="p-3" style={{ overflowY: "auto", flex: "1 1 auto" }}>
            {merged.length === 0 ? (
              <div className="text-muted small">No messages yet.</div>
            ) : (
              merged.map((m) => (
                <div key={m.id} className="d-flex mb-2">
                  <div className="me-2" style={{ width: 36 }}>
                    {m.photoURL ? (
                      <img
                        src={m.photoURL}
                        alt={m.userName || m.userId}
                        className="rounded-circle"
                        style={{ width: 36, height: 36, objectFit: "cover" }}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.log("error!");
                          // Hide the broken image and show initials instead
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                        style={{
                          width: 36,
                          height: 36,
                          fontSize: 12,
                          display: m.photoURL ? "none" : "flex",
                        }}
                      >
                        {initials(m.userName || m.userId)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: "1 1 auto" }}>
                    <div className="small text-muted mb-1">
                      {m.userName || m.userId} ·{" "}
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                    <div
                      className={`small bg-white border rounded px-2 py-1 ${
                        m.failed ? "border-danger bg-danger text-white" : ""
                      }`}
                    >
                      {m.text.split("\n").map((line, idx, arr) => (
                        <span key={idx}>
                          {line}
                          {idx < arr.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
          <form
            onSubmit={onSubmit}
            className="p-3 border-top"
            style={{ flex: "0 0 auto" }}
          >
            <div className="d-flex flex-column">
              <div className="d-flex">
                <textarea
                  ref={inputRef}
                  className="form-control"
                  placeholder={
                    user
                      ? "Write a message... (Shift+Enter for newline)"
                      : "Sign in to chat"
                  }
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const v = e.target.value;
                    setInput(v.length > MAX_CHARS ? v.slice(0, MAX_CHARS) : v);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.length <= MAX_CHARS) void sendMessage(input);
                      return;
                    }
                    const printable =
                      e.key.length === 1 &&
                      !e.ctrlKey &&
                      !e.metaKey &&
                      !e.altKey;
                    if (printable && input.length >= MAX_CHARS) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e: React.ClipboardEvent<HTMLTextAreaElement>) => {
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text") || "";
                    const el = e.currentTarget;
                    const start = el.selectionStart ?? input.length;
                    const end = el.selectionEnd ?? input.length;
                    const before = input.slice(0, start);
                    const after = input.slice(end);
                    const allowed = Math.max(
                      0,
                      MAX_CHARS - before.length - after.length
                    );
                    const toInsert = paste.slice(0, allowed);
                    const newVal = before + toInsert + after;
                    setInput(newVal);
                    requestAnimationFrame(() => {
                      const pos = start + toInsert.length;
                      el.setSelectionRange(pos, pos);
                    });
                  }}
                  aria-label="Chat message"
                  disabled={!user}
                  rows={2}
                  style={{ resize: "vertical" }}
                />
                <button
                  type="submit"
                  className="btn btn-primary ms-2"
                  disabled={!input.trim() || !user || input.length > MAX_CHARS}
                >
                  Send
                </button>
              </div>
              <div className="d-flex justify-content-end mt-1">
                {MAX_CHARS - input.length < 100 && (
                  <small
                    className={
                      input.length > MAX_CHARS ? "text-danger" : "text-muted"
                    }
                  >
                    {Math.max(0, MAX_CHARS - input.length)} chars left
                  </small>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
