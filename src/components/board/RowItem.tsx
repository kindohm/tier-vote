import { IMG_HOST } from "@/lib/constants";
import { TierItem, TierList } from "@/lib/types";
import { useDrag } from "react-dnd";

type Props = {
  item: TierItem;
  tierList: TierList;
};

export const RowItem = ({ item, tierList }: Props) => {
  const current = tierList?.currentVoteItemId === item.id;
  const previous = tierList?.lastVoteItemId === item.id;
  const [, drag, dragPreview] = useDrag(
    () => ({
      type: "item",
      item,
      canDrag: current,
    }),
    [tierList, item]
  );

  const style =
    previous || current
      ? {
          border: "solid 5px orange",
        }
      : {};

  return (
    <span ref={drag} className="me-1">
      <img
        src={`${IMG_HOST}/${item.imageURL}`}
        width="75"
        height="75"
        style={style}
      />
    </span>
  );
};
