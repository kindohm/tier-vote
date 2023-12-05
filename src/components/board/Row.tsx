import { TierItem, TierList } from "@/lib/types";
import { TierLetter } from "./TierLetter";
import { RowItem } from "./RowItem";
import { useDrop } from "react-dnd";
import { updateTierList } from "@/lib/data";

type Props = {
  tier?: string;
  tierList: TierList;
  unassigned?: boolean;
};

const style = {
  background: "#cccccc",
  marginBottom: "2px",
  padding: "1px",
  display: "flex",
};

export const Row = ({ tier, tierList }: Props) => {
  const [, drop] = useDrop(
    () => ({
      accept: "item",
      drop: (item: TierItem) => {
        // update the tierlist
        const newItems = tierList.items.reduce((acc, i: TierItem) => {
          if (i.id === item.id) {
            return acc.concat([{ ...i, modifiedAt: new Date(), tier }]);
          }
          return acc.concat([i]);
        }, [] as TierItem[]);
        const newTierList = { ...tierList, items: newItems };
        updateTierList(tierList.id, newTierList);
      },
    }),
    [tierList]
  );

  const items = tierList?.items
    .filter((i) => {
      return (!tier && !i.tier) || i.tier === tier;
    })
    .sort((a, b) => (a.modifiedAt > b.modifiedAt ? 1 : -1));

  return (
    <div ref={drop} style={{ ...style, flexWrap: "wrap" }}>
      {tier ? <TierLetter letter={tier} /> : null}
      {items?.map((item) => {
        return <RowItem key={item.id} item={item} />;
      })}
    </div>
  );
};
