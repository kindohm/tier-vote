import { TierItem, TierList, Vote } from "@/lib/types";
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
  minHeight: "75px",
};

export const Row = ({ tier, tierList }: Props) => {
  const user = useUser();

  const [, drop] = useDrop(
    () => ({
      accept: "item",
      drop: (item: TierItem) => {
        // update the tierlist
        // I am so sorry to my future self for this logic.
        const newItems = tierList.items.reduce((acc, i: TierItem) => {
          if (i.id === item.id) {
            const votes: Vote[] = i.votes.reduce(
              (newVotes: Vote[], v: Vote) => {
                if (v.userId === user?.uid) return newVotes;
                return newVotes.concat(v);
              },
              tier ? [{ userId: user?.uid, tier } as Vote] : []
            );

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
      const voteInProgress = !!tierList.currentVoteItemId;
      const isVotingItem = tierList.currentVoteItemId === i.id;

      const votedTier = i.votes.find((v) => v.userId === user?.uid)?.tier;

      if (!voteInProgress) {
        return i.tier === tier || (!i.tier && !tier);
      }

      if (!isVotingItem) {
        return false;
      }

      return (!!tier && votedTier === tier) || (!tier && !votedTier);
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
