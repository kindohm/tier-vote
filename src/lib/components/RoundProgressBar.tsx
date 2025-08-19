"use client";
import React from "react";
interface RoundProgressBarProps {
  secondsLeft: number;
  totalSeconds?: number | null;
  className?: string;
}
export const RoundProgressBar: React.FC<RoundProgressBarProps> = ({
  secondsLeft,
  totalSeconds,
  className = "mb-1",
}) => {
  const total = totalSeconds || secondsLeft || 1;
  const displaySeconds = Math.max(0, secondsLeft - 1);
  const pctRaw = (displaySeconds / total) * 100;
  const pct = pctRaw < 0 ? 0 : pctRaw > 100 ? 100 : pctRaw;
  const barColor =
    secondsLeft <= 5
      ? "bg-danger"
      : secondsLeft <= 10
      ? "bg-warning text-dark"
      : "bg-success";
  return (
    <div className={`progress ${className}`} style={{ height: 28 }}>
      <div
        className={`progress-bar ${barColor}`}
        role="progressbar"
        style={{ width: `${pct}%`, transition: "width 1.0s linear" }}
        aria-valuenow={displaySeconds}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <span style={{ fontWeight: 600 }}>{displaySeconds + 1}s left</span>
      </div>
    </div>
  );
};
export default RoundProgressBar;
