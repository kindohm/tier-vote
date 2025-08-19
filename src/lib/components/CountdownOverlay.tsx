"use client";
import React from "react";

// Backward-compatible props: original component accepted { seconds }; new usage can pass { secondsLeft, roundSeconds }.
type Props =
  | { seconds: number; secondsLeft?: undefined; roundSeconds?: undefined }
  | { secondsLeft: number; roundSeconds: number | null; seconds?: undefined };

export function CountdownOverlay(props: Props) {
  const secondsLeft =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (props as any).seconds === "number"
      ? (props as { seconds: number }).seconds
      : (props as { secondsLeft: number }).secondsLeft;
  const roundSeconds =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (props as any).roundSeconds !== "undefined"
      ? (props as { roundSeconds: number | null }).roundSeconds
      : null;

  if (roundSeconds === null) {
    // Original lobby/voting pre-start countdown style
    const display = secondsLeft < 0 ? 0 : secondsLeft;
    return (
      <div
        className="countdown-overlay d-flex align-items-center justify-content-center"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 10,
          color: "#fff",
          flexDirection: "column",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          key={display}
          className="countdown-number"
          style={{
            fontSize: display >= 10 ? 160 : 200,
            fontWeight: 700,
            lineHeight: 1,
            animation: "pop 1000ms ease-in-out",
            textShadow:
              "0 0 8px rgba(255,255,255,0.8), 0 0 32px rgba(255,255,255,0.4)",
          }}
        >
          {display}
        </div>
        <div style={{ letterSpacing: 2, fontSize: 18, opacity: 0.85 }}>
          Round starts in
        </div>
      </div>
    );
  }

  const pctRaw = ((secondsLeft - 1) / (roundSeconds || 1)) * 100;
  const pct = pctRaw < 0 ? 0 : pctRaw > 100 ? 100 : pctRaw;
  const className =
    secondsLeft <= 5
      ? "bg-danger"
      : secondsLeft <= 10
      ? "bg-warning"
      : "bg-success";
  if (secondsLeft <= 1) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 32,
        color: "white",
        fontWeight: 600,
        fontSize: 30,
      }}
    >
      {secondsLeft > 1 && (
        <div style={{ width: "50%" }}>
          <div className="progress" style={{ height: 40 }}>
            <div
              className={`progress-bar ${className}`}
              role="progressbar"
              style={{
                width: `${pct}%`,
                transition: "width 1.0s linear",
                fontWeight: 600,
                fontSize: 24,
              }}
              aria-valuenow={secondsLeft}
              aria-valuemin={0}
              aria-valuemax={roundSeconds || 0}
            >
              {secondsLeft - 1}s until voting closes
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CountdownOverlay;
