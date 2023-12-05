import { IMG_HOST } from "@/lib/constants";
import { TierItem } from "@/lib/types";
import { useDrag } from "react-dnd";

type Props = {
  item: TierItem;
};

export const RowItem = ({ item }: Props) => {
  const [, drag] = useDrag(() => ({
    type: "item",
    item,
  }));

  return (
    <span ref={drag}>
      <img src={`${IMG_HOST}/${item.imageURL}`} width="75" height="75" />
    </span>
  );
};
