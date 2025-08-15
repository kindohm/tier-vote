import React from "react";

export type VoteToast = { id: string; message: string };

interface Props {
  toasts: VoteToast[];
}

/**
 * Displays stacked transient vote notifications in the bottom-right corner.
 */
export const VoteToasts = ({ toasts }: Props) => {
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column-reverse",
        gap: "4px",
        maxWidth: "260px",
        alignItems: "flex-end",
      }}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast show"
          role="status"
          style={{
            position: "relative",
            opacity: 0.95,
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 4,
            fontSize: "0.8rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
