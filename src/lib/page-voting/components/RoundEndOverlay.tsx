"use client";

import { TierItem } from "@/lib/data/types";
import { useEffect, useState } from "react";
import { IMG_HOST } from "@/lib/constants";

interface RoundEndOverlayProps {
  item: TierItem;
  winningTier: string;
  show: boolean;
}

export const RoundEndOverlay = ({
  item,
  winningTier,
  show,
}: RoundEndOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [show]);

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
      className={`position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${
        isVisible ? "fade-in" : "fade-out"
      }`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 1000,
        transition: "opacity 0.3s ease-in-out",
        opacity: isVisible ? 1 : 0,
        minHeight: "300px",
      }}
    >
      <div
        className="text-center text-white"
        style={{ maxWidth: "95%", maxHeight: "95%" }}
      >
        {/* "ROUND OVER" Header */}
        <h1
          className="mb-2 fw-bold"
          style={{
            fontSize: "2rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            letterSpacing: "0.1em",
          }}
        >
          ROUND OVER
        </h1>

        {/* Image Container */}
        <div className="position-relative mb-2">
          {item.imageURL && (
            <img
              src={`${IMG_HOST}/${decodeURIComponent(item.imageURL)}`}
              alt="Voted item"
              className="rounded shadow-lg"
              style={{
                maxWidth: "200px",
                maxHeight: "150px",
                objectFit: "contain",
                border: `6px solid ${getTierColor(winningTier)}`,
              }}
            />
          )}

          {/* Tier Badge Overlay */}
          <div
            className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
            style={{
              top: "-15px",
              right: "-15px",
              width: "60px",
              height: "60px",
              backgroundColor: getTierColor(winningTier),
              color: "white",
              fontSize: "2rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              border: "3px solid white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {winningTier.toUpperCase()}
          </div>
        </div>

        {/* Result Text */}
        <p
          className="text-light mb-1"
          style={{
            fontSize: "1.1rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          Voted to{" "}
          <strong style={{ color: getTierColor(winningTier) }}>
            {winningTier.toUpperCase()} Tier
          </strong>
        </p>

        {/* Waiting for next round hint */}
        <p
          className="text-muted mt-2"
          style={{
            fontSize: "0.8rem",
            opacity: 0.7,
          }}
        >
          Waiting for next round to start...
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
