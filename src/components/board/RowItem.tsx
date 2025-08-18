/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMG_HOST } from "@/lib/constants";
import { TierItem, TierList } from "@/lib/types";
import Image from "next/image";
import { useDrag } from "react-dnd";
import { useState, useEffect } from "react";
import { useVotesForItem } from "../../lib/useVotes";

type Props = {
  item: TierItem;
  tierList: TierList;
};

export const RowItem = ({ item, tierList }: Props) => {
  const current = tierList?.currentVoteItemId === item.id;
  const previous = tierList?.lastVoteItemId === item.id;
  const loading = !item.imageURL; // crude heuristic (could expand with onLoad state)
  const decodedUrl = item.imageURL ? decodeURIComponent(item.imageURL) : "";
  const fileName = decodedUrl ? decodedUrl.split(/[/\\]/).pop() : "";
  // Always call hook (pass undefined when not current) to satisfy Rules of Hooks
  const votesForItem = useVotesForItem(
    tierList.id,
    current ? item.id : undefined
  );
  const [isDragging, setIsDragging] = useState(false);
  const [{ isDragging: dndDragging }, drag] = useDrag(
    () => ({
      type: "item",
      item,
      canDrag: current,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [tierList, item]
  );

  useEffect(() => {
    setIsDragging(dndDragging);
  }, [dndDragging]);

  const style =
    previous || current
      ? {
          border: "solid 5px orange",
        }
      : {};

  const isVoting = !!tierList.currentVoteItemId;
  const draggableStyles: React.CSSProperties = current
    ? {
        cursor: "grab",
        transition: "transform .15s, box-shadow .15s, opacity .15s",
        transform: isDragging ? "scale(1.08)" : undefined,
        boxShadow: isDragging
          ? "0 6px 18px -4px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.25)"
          : undefined,
        zIndex: isDragging ? 10 : undefined,
        position: "relative",
      }
    : isVoting
    ? { cursor: "not-allowed", opacity: 0.55, transition: "opacity .15s" }
    : { cursor: "default" };

  // Mini distribution bar (only if voting on this item & at least one vote)
  let miniBar: React.ReactNode = null;
  if (current && votesForItem.length > 0) {
    const total = votesForItem.length;
    const counts = tierList.tiers
      .map((t) => ({
        tier: t,
        count: votesForItem.filter((v: any) => v.tier === t).length,
      }))
      .filter((c) => c.count > 0);
    const colorFor = (tier: string) => {
      switch (tier) {
        case "S":
          return "#dc3545"; // bootstrap danger
        case "A":
          return "#ffc107"; // warning
        case "B":
          return "#198754"; // success
        case "C":
          return "#0d6efd"; // primary
        case "D":
          return "#6c757d"; // secondary
        default:
          return "#adb5bd";
      }
    };
    miniBar = (
      <div
        className="mt-1"
        aria-label="current vote distribution"
        style={{
          width: 75,
          height: 6,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
        }}
        title={counts
          .map(
            (c) =>
              `${c.tier}: ${c.count} (${Math.round((c.count / total) * 100)}%)`
          )
          .join(" | ")}
      >
        {tierList.tiers.map((t) => {
          const c = votesForItem.filter((v: any) => v.tier === t).length;
          return (
            <div
              key={t}
              style={{
                width: `${(c / total) * 100}%`,
                background: colorFor(t),
                transition: "width .25s",
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <span ref={drag} className="me-1" style={draggableStyles}>
      {loading ? (
        <span
          className="skeleton skeleton-img"
          style={{ width: 75, height: 75, display: "inline-block" }}
          title={fileName || undefined}
        />
      ) : (
        <Image
          src={`${IMG_HOST}/${decodedUrl}`}
          alt="tier image"
          width="75"
          height="75"
          style={style}
          priority={true}
          draggable={false}
          title={fileName || undefined}
        />
      )}
      {miniBar}
    </span>
  );
};
