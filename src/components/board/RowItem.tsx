import { IMG_HOST } from "@/lib/constants";
import { TierItem, TierList } from "@/lib/types";
import Image from "next/image";
import { useDrag } from "react-dnd";
import { useState, useEffect } from "react";

type Props = {
  item: TierItem;
  tierList: TierList;
};

export const RowItem = ({ item, tierList }: Props) => {
  const current = tierList?.currentVoteItemId === item.id;
  const previous = tierList?.lastVoteItemId === item.id;
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
    : { cursor: "not-allowed", opacity: 0.55 };

  return (
    <span ref={drag} className="me-1" style={draggableStyles}>
      <Image
        src={`${IMG_HOST}/${decodeURIComponent(item.imageURL ?? "")}`}
        alt="tier image"
        width="75"
        height="75"
        style={style}
        priority={true}
        draggable={false}
      />
    </span>
  );
};
