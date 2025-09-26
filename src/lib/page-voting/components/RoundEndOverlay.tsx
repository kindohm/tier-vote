"use client";

import { TierItem } from "@/lib/data/types";
import { useEffect, useState } from "react";

interface RoundEndOverlayProps {
  item: TierItem;
  winningTier: string;
  onClose: () => void;
  show: boolean;
}

export const RoundEndOverlay = ({
  item,
  winningTier,
  onClose,
  show,
}: RoundEndOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "S":
        return "#ff4757"; // Red
      case "A":
        return "#ff6b35"; // Orange
      case "B":
        return "#f39c12"; // Yellow
      case "C":
        return "#2ed573"; // Green
      case "D":
        return "#3742fa"; // Blue
      default:
        return "#2f3542"; // Gray
    }
  };

  return (
    <div
      className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${
        isVisible ? "fade-in" : "fade-out"
      }`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 9999,
        transition: "opacity 0.3s ease-in-out",
        opacity: isVisible ? 1 : 0,
      }}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <div
        className="text-center text-white"
        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
      >
        {/* "ROUND OVER" Header */}
        <h1
          className="mb-4 fw-bold"
          style={{
            fontSize: "3.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            letterSpacing: "0.1em",
          }}
        >
          ROUND OVER
        </h1>

        {/* Image Container */}
        <div className="position-relative mb-3">
          {item.imageURL && (
            <img
              src={item.imageURL}
              alt="Voted item"
              className="rounded shadow-lg"
              style={{
                maxWidth: "60vw",
                maxHeight: "50vh",
                objectFit: "contain",
                border: `6px solid ${getTierColor(winningTier)}`,
              }}
            />
          )}

          {/* Tier Badge Overlay */}
          <div
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              top: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              backgroundColor: getTierColor(winningTier),
              color: "white",
              fontSize: "4rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {winningTier.toUpperCase()}
          </div>
        </div>

        {/* Result Text */}
        <p
          className="text-light mb-0"
          style={{
            fontSize: "1.5rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          Voted to{" "}
          <strong style={{ color: getTierColor(winningTier) }}>
            {winningTier.toUpperCase()} Tier
          </strong>
        </p>

        {/* Click to close hint */}
        <p
          className="text-muted mt-3"
          style={{
            fontSize: "0.9rem",
            opacity: 0.7,
          }}
        >
          Click anywhere to continue
        </p>
      </div>

      <style jsx>{`
        .fade-in {
          opacity: 1;
        }
        .fade-out {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
