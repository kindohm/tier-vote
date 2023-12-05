import { IMG_HOST } from "@/lib/constants";
import { TierItem } from "@/lib/types";

type Props = {
  item: TierItem;
};

export const RowItem = ({ item }: Props) => {
  return (
    <span>
      <img src={`${IMG_HOST}/${item.imageURL}`} width="75" height="75" />
    </span>
  );
};
