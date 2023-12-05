import { TierItem, TierList } from "@/lib/types";
import { TierLetter } from "./TierLetter";
import { RowItem } from "./RowItem";
import { useDrop } from "react-dnd";
import { updateTierList } from "@/lib/data";
import { useUser } from "@/lib/useUser";

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
  const user = useUser();

  const [, drop] = useDrop(
    () => ({
      accept: "item",
      drop: (item: TierItem) => {
        // update the tierlist
        const newItems = tierList.items.reduce((acc, i: TierItem) => {
          if (i.id === item.id) {
            const votes = i.votes.concat([
              { userId: user?.uid as string, tier: tier as string },
            ]);

            return acc.concat([{ ...i, modifiedAt: new Date(), votes }]);
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
    .filter((i) => {
      if (tierList.inProgress && tierList.currentVoteItemId) {
        return i.id === tierList.currentVoteItemId;
      }
      return true;
    })
    .sort((a, b) => (a.modifiedAt > b.modifiedAt ? 1 : -1));

  return (
    <div ref={drop} style={{ ...style, flexWrap: "wrap" }}>
      {tier ? <TierLetter letter={tier} /> : null}
      {items?.map((item) => {
        return <RowItem key={item.id} item={item} tierList={tierList} />;
      })}
    </div>
  );
};
