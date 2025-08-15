import { TierItem, TierList } from "@/lib/types";
import { TierLetter } from "./TierLetter";
import { RowItem } from "./RowItem";
import { useDrop } from "react-dnd";
import { useUser } from "@/lib/useUser";
import { castVote, useUserVoteForItem } from "../../lib/useVotes";

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
  minHeight: "78px",
};

export const Row = ({ tier, tierList }: Props) => {
  const user = useUser();

  const [, drop] = useDrop(
    () => ({
      accept: "item",
      drop: async (item: TierItem) => {
        if (!tierList?.currentVoteItemId) return; // no active round
        if (item.id !== tierList.currentVoteItemId) return; // only active item can be voted
        if (!user?.uid) return;
        // Cast / replace vote in subcollection
        await castVote({
          listId: tierList.id,
          itemId: item.id,
          userId: user.uid,
          tier: tier || "",
        });
      },
    }),
    [tierList, tier, user?.uid]
  );

  // Pre-compute active item & user's vote (hook at top level to obey rules of hooks)
  const activeItemId = tierList?.currentVoteItemId || undefined;
  const userVote = useUserVoteForItem(tierList?.id, activeItemId, user?.uid);

  let items: TierItem[] = [];
  const voteInProgress = !!activeItemId;
  if (!voteInProgress) {
    items = (tierList?.items || [])
      .filter((i) => i.tier === tier || (!i.tier && !tier))
      .sort((a, b) => (a.modifiedAt > b.modifiedAt ? 1 : -1));
  } else if (tierList) {
    const activeItem = tierList.items.find((i) => i.id === activeItemId);
    const votedTier = userVote?.tier || "";
    if (activeItem) {
      const shouldShow =
        (!!tier && votedTier === tier) || (!tier && !votedTier);
      if (shouldShow) items = [activeItem];
    }
  }

  return (
    <div ref={drop} style={{ ...style, flexWrap: "wrap" }}>
      {tier ? <TierLetter letter={tier} /> : null}
      {items?.map((item) => {
        return <RowItem key={item.id} item={item} tierList={tierList} />;
      })}
    </div>
  );
};
