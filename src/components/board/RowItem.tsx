import { IMG_HOST } from "@/lib/constants";
import { TierItem, TierList } from "@/lib/types";
import { useDrag } from "react-dnd";

type Props = {
  item: TierItem;
  tierList: TierList;
};

export const RowItem = ({ item, tierList }: Props) => {
  const [, drag] = useDrag(() => ({
    type: "item",
    item,
    canDrag: tierList?.currentVoteItemId === item.id,
  }));

  return (
    <span ref={drag}>
      <img src={`${IMG_HOST}/${item.imageURL}`} width="75" height="75" />
    </span>
  );
};
