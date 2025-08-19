"use client";
import React from "react";
export function VoteToasts({ toasts }: { toasts: string[] }) {
  return (
    <div
      style={{ position: "fixed", left: 0, top: 0, width: "100%", zIndex: 3 }}
    >
      {toasts.map((toast, i) => (
        <div
          key={`${toast}_${i}`}
          className="toast show m-4 bg-black text-white"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-body">{toast}</div>
        </div>
      ))}
    </div>
  );
}
export default VoteToasts;
