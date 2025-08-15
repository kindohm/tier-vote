import React from "react";

type Props = {
  className?: string;
  size?: number; // target height in px
};

// SVG icon depicting an empty tier list (S through D) with placeholder cells.
export const LogoTierList: React.FC<Props> = ({
  className = "",
  size = 28,
}) => {
  const rows: { label: string; color: string; labelFill?: string }[] = [
    { label: "S", color: "#dc3545" }, // danger
    { label: "A", color: "#ffc107", labelFill: "#000" }, // warning (dark text)
    { label: "B", color: "#198754" }, // success
    { label: "C", color: "#0d6efd" }, // primary
    { label: "D", color: "#6c757d" }, // secondary
  ];
  const rowH = 16;
  const gap = 2;
  const labelW = 14;
  const cellSize = 10;
  const cellGap = 3;
  const cells = 3;
  const width = labelW + gap + cells * cellSize + (cells - 1) * cellGap + 2; // padding
  const height = rows.length * rowH + (rows.length - 1) * gap + 2;
  const scale = size / height;

  return (
    <svg
      className={`logo-tierlist ${className}`.trim()}
      width={Math.round(width * scale)}
      height={Math.round(height * scale)}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Tier Vote logo"
      focusable="false"
      style={{ display: "inline-block" }}
    >
      <defs>
        <linearGradient id="tl-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e2e6ea" />
          <stop offset="100%" stopColor="#f8f9fa" />
        </linearGradient>
        <linearGradient id="tl-cell" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9ecef" />
        </linearGradient>
      </defs>
      <rect
        x={0.25}
        y={0.25}
        width={width - 0.5}
        height={height - 0.5}
        rx={2.5}
        fill="url(#tl-bg)"
        stroke="#495057"
        strokeWidth={0.5}
      />
      {rows.map((row, i) => {
        const y = 1 + i * (rowH + gap);
        return (
          <g key={row.label}>
            <rect
              x={1}
              y={y}
              width={labelW}
              height={rowH}
              rx={2}
              fill={row.color}
            />
            <text
              x={1 + labelW / 2}
              y={y + rowH / 2 + 4}
              fontSize={10}
              fontWeight={700}
              textAnchor="middle"
              fill={row.labelFill || "#fff"}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {row.label}
            </text>
            {Array.from({ length: cells }).map((_, c) => {
              const cx = 1 + labelW + gap + c * (cellSize + cellGap);
              return (
                <rect
                  key={c}
                  x={cx}
                  y={y + 3}
                  width={cellSize}
                  height={rowH - 6}
                  rx={1.5}
                  fill="#333333"
                  stroke="#111"
                  strokeWidth={0.4}
                  opacity={1}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default LogoTierList;
