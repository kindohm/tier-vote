import { TierItem, TierList } from "@/lib/data/types";
import { TierLetter } from "./TierLetter";
import { RowItem } from "./RowItem";
import { useDrop } from "react-dnd";
import { useUser } from "@/lib/data/useUser";
import { castVote, useUserVoteForItem } from "@/lib/data/useVotes";

type Props = {
  tier?: string;
  tierList: TierList;
  unassigned?: boolean;
};

const style = {
  background: "#1f1f1f", // dark neutral background similar to reference image
  marginBottom: "4px",
  padding: "2px 4px 2px 2px",
  display: "flex",
  minHeight: "78px",
  border: "2px solid #0e0e0e",
};

export const Row = ({ tier, tierList, unassigned }: Props) => {
  const user = useUser();

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "item",
      drop: async (item: TierItem) => {
        if (!tierList?.currentVoteItemId) return; // no active round
        if (item.id !== tierList.currentVoteItemId) return; // only active item can be voted
        if (!user?.uid) return;
        if (!tier) return; // disallow dropping back to unassigned row during voting
        await castVote({
          listId: tierList.id,
          itemId: item.id,
          userId: user.uid,
          tier,
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
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

  const votedTier = userVote?.tier || "";
  // Show locked (cancel) overlay only after the user has placed the active item into a tier
  // i.e. once they have a vote recorded (votedTier truthy). Before first placement, keep row enabled.
  const showLocked = unassigned && voteInProgress && !!votedTier && isOver;
  return (
    <div
      ref={drop}
      style={{
        ...style,
        flexWrap: "wrap",
        opacity: showLocked ? 0.55 : 1,
        border: showLocked ? "2px dashed #999" : undefined,
        position: "relative",
        background: showLocked ? "#333" : style.background,
        transition: "all .15s",
      }}
      title={
        showLocked
          ? "You can't move the item back here during voting"
          : undefined
      }
    >
      {tier ? <TierLetter letter={tier} /> : null}
      {items?.map((item) => {
        return <RowItem key={item.id} item={item} tierList={tierList} />;
      })}
      {showLocked && (
        <span
          aria-label="Dropping here is disabled"
          title="Can't drop back here"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            opacity: 0.85,
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#dc3545" opacity="0.9" />
            <line
              x1="8"
              y1="8"
              x2="16"
              y2="16"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="8"
              x2="8"
              y2="16"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
};
