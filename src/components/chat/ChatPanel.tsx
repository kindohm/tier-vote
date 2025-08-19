import { useState, useRef, FormEvent, useEffect } from "react";

import { useUser } from "@/lib/data/useUser";
import { sendMessageToList, useMessagesForList } from "./useChat";

type ChatMessage = {
  id: string;
  userId: string;
  userName?: string;
  photoURL?: string | null;
  createdAt: number; // epoch ms
  text: string;
  clientId?: string | null;
  failed?: boolean;
};

export const ChatPanel = ({ listId }: { listId?: string }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [input, setInput] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    []
  );
  const messages = useMessagesForList(listId);

  // When a server message with the same clientId arrives, remove the corresponding optimistic message
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serverClientIds = new Set(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages.map((m: any) => m.clientId).filter((c: any) => !!c)
    );
    setOptimisticMessages((prev) =>
      prev.filter((opt) => !opt.clientId || !serverClientIds.has(opt.clientId))
    );
  }, [messages]);

  // Merge messages but deduplicate optimistic messages if a server message with the same clientId exists
  const mergedMessages = (() => {
    const server = messages as (ChatMessage & { clientId?: string | null })[];
    // only show optimistic messages that haven't been acknowledged AND have aged > 250ms, or failed ones
    const now = Date.now();
    const optimisticFiltered = optimisticMessages.filter((opt) => {
      if (opt.failed) return true; // show failed immediately so the user can retry
      if (
        opt.clientId &&
        server.some(
          (s) => s.clientId && opt.clientId && s.clientId === opt.clientId
        )
      )
        return false;
      return now - opt.createdAt > 250; // delay showing optimistic for 250ms to avoid flicker with server ack
    });
    const merged = [...server, ...optimisticFiltered];
    merged.sort((a, b) => a.createdAt - b.createdAt);
    return merged;
  })();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const user = useUser();

  // maximum allowed characters for a single chat message (client-side only)
  const MAX_CHARS = 1000;

  useEffect(() => {
    // scroll to bottom when messages change
    setTimeout(
      () =>
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
      50
    );
  }, [mergedMessages.length]);

  const initials = (nameOrId?: string) => {
    if (!nameOrId) return "??";
    const parts = nameOrId.split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const sendMessage = async (text: string) => {
    // client-side guard: enforce the character limit before attempting to send
    if (!text.trim() || !listId || !user) return;
    if (text.trim().length > MAX_CHARS) return;

    // optimistic message
    const clientId = `c-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const tempId = `tmp-${clientId}`;
    const optimistic: ChatMessage = {
      id: tempId,
      userId: user.uid,
      userName: user.displayName || undefined,
      photoURL: user.photoURL || null,
      createdAt: Date.now(),
      text: text.trim(),
      clientId,
    };

    setOptimisticMessages((m) => [...m, optimistic]);
    setInput("");
    inputRef.current?.focus();

    try {
      await sendMessageToList(
        listId,
        user
          ? {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            }
          : null,
        text,
        clientId
      );
      // remove optimistic message; the persisted message will include clientId and be visible via subscription
      setOptimisticMessages((prev) =>
        prev.filter((pm) => pm.clientId !== clientId)
      );
    } catch (err) {
      setOptimisticMessages((prev) =>
        prev.map((pm) =>
          pm.clientId === clientId ? { ...pm, failed: true } : pm
        )
      );
      console.error("Failed to send chat message", err);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // client-side validation: don't submit empty messages or messages over the limit
    if (!input.trim() || input.trim().length === 0 || input.length > MAX_CHARS)
      return;
    void sendMessage(input);
  };

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
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "40px",
          height: "40px",
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
        ></span>
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
            {mergedMessages.length === 0 ? (
              <div className="text-muted small">No messages yet.</div>
            ) : (
              mergedMessages.map((m) => (
                <div key={m.id} className="d-flex mb-2">
                  <div className="me-2" style={{ width: 36 }}>
                    {m.photoURL ? (
                      <img
                        src={m.photoURL}
                        alt={m.userName || m.userId}
                        className="rounded-circle"
                        style={{ width: 36, height: 36, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                        style={{ width: 36, height: 36, fontSize: 12 }}
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (m as any).failed
                          ? "border-danger bg-danger text-white"
                          : ""
                      }`}
                    >
                      {m.text.split("\n").map((line, idx) => (
                        <span key={idx}>
                          {line}
                          {idx < m.text.split("\n").length - 1 ? <br /> : null}
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ref={inputRef as any}
                  className="form-control"
                  placeholder={
                    user
                      ? "Write a message... (Shift+Enter for newline)"
                      : "Sign in to chat"
                  }
                  value={input}
                  onChange={(e) => {
                    // trim input to the client-side max immediately
                    const v = e.target.value || "";
                    if (v.length > MAX_CHARS) {
                      setInput(v.slice(0, MAX_CHARS));
                    } else {
                      setInput(v);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Submit on Enter (without Shift)
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.length <= MAX_CHARS) {
                        void sendMessage(input);
                      }
                      return;
                    }

                    // block additional printable characters when at the limit
                    const isPrintable =
                      e.key.length === 1 &&
                      !e.ctrlKey &&
                      !e.metaKey &&
                      !e.altKey;
                    if (isPrintable && input.length >= MAX_CHARS) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // insert only up to the allowed characters at the caret
                    e.preventDefault();
                    const paste = e.clipboardData?.getData("text") || "";
                    const el = e.target as HTMLTextAreaElement;
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
                    // move caret after inserted text
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
                    className={`${
                      input.length > MAX_CHARS ? "text-danger" : "text-muted"
                    }`}
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
