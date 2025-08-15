"use client";

export function CountdownOverlay({ seconds }: { seconds: number }) {
  const display = seconds < 0 ? 0 : seconds;
  return (
    <>
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
      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          35% {
            transform: scale(1.05);
            opacity: 1;
          }
          60% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
        }
      `}</style>
    </>
  );
}
