"use client";

import { Board } from "@/components/board/Board";
import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { useTierList } from "@/lib/useTierList";
import { useUser } from "@/lib/useUser";
import { useParams } from "next/navigation";
import { useInterval, useTimeout } from "usehooks-ts";
import { add, differenceInSeconds } from "date-fns";
import { useState } from "react";
import { updateTierList } from "@/lib/data";
import { randItem } from "@/lib/util";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);
  const user = useUser();
  const [secondsLeft, setSecondsLeft] = useState(20);

  const isOwner = user?.uid === tierList?.createdBy;

  const forceEnd = () => {
    console.log("forcing end");
    // tally....
    const item = tierList.items.find(
      (i) => i.id === tierList.currentVoteItemId
    );

    const totals = tierList.tiers
      .map((tier) => {
        const votesFor = item?.votes.filter((v) => v.tier === tier) ?? [];
        return { tier, votesFor: votesFor.length };
      })
      .sort((a, b) => {
        return a.votesFor > b.votesFor ? -1 : 1;
      })[0];

    const newItems = tierList.items.map((i) => {
      if (i.id !== item?.id) {
        return i;
      }
      return { ...item, tier: totals.tier };
    });

    updateTierList(id as string, {
      ...tierList,
      items: newItems,
      currentVoteItemId: null,
      itemVotingEndsAt: null,
    });
  };

  if (tierList && !tierList?.inProgress) {
    return (
      <div className="alert alert-warning">
        this tier list is not yet in progress
      </div>
    );
  }

  const startNext = async () => {
    const unvotedItems = tierList.items.filter((i) => !i.tier);
    const item = randItem(unvotedItems);

    updateTierList(id as string, {
      ...tierList,
      currentVoteItemId: item.id,
      itemVotingEndsAt: add(new Date(), { seconds: 20 }),
    });
  };

  return (
    <div>
      <p>voting... {tierList?.title}</p>
      <p>
        Time left... {secondsLeft}{" "}
        <button
          onClick={forceEnd}
          className="btn btn-sm btn-secondary"
          disabled={!tierList?.currentVoteItemId}
        >
          force end round
        </button>
        <button
          onClick={startNext}
          className="btn btn-sm btn-secondary"
          disabled={!!tierList?.currentVoteItemId}
        >
          start next round
        </button>
        <input
          type="number"
          value={secondsLeft}
          min={0}
          max={100}
          onChange={(e) => {
            const x = parseInt(e.target.value);
            setSecondsLeft(x);

            if (x <= 0) {
              forceEnd();
            }
          }}
        />
      </p>
      <Board tierList={tierList} />
      <TierListDebugInfo tierList={tierList} />
    </div>
  );
}
