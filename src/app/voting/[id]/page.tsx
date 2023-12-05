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
  const [secondsLeft, setSecondsLeft] = useState(0);

  const isOwner = user?.uid === tierList?.createdBy;

  const forceEnd = () => {
    // tally....
    const item = tierList.items.find(
      (i) => i.id === tierList.currentVoteItemId
    );
    const totals = item?.votes.reduce((acc, v) => {
      if (!acc[v.tier]) {
        acc[v.tier] = 0;
      }
      acc[v.tier]++;
    }, {});

    console.log("totals", totals);

    updateTierList(id as string, {
      ...tierList,
      currentVoteItemId: null,
      itemVotingEndsAt: null,
    });
  };

  useInterval(() => {
    // console.log(tierList?.currentVoteItemId);
    if (!tierList?.currentVoteItemId) return;

    const now = new Date();

    const diff = tierList.itemVotingEndsAt
      ? Math.max(differenceInSeconds(tierList?.itemVotingEndsAt, now), 0)
      : 0;
    setSecondsLeft(diff);

    if (tierList?.itemVotingEndsAt && tierList.itemVotingEndsAt < now) {
      console.log("forcing end", tierList);
      // forceEnd();
    }
  }, 250);

  if (tierList && !tierList?.inProgress) {
    return (
      <div className="alert alert-warning">
        this tier list is not yet in progress
      </div>
    );
  }

  const startNext = async () => {
    const item = randItem(tierList.items.filter((i) => !i.tier));
    await updateTierList(id as string, {
      ...tierList,
      currentVoteItemId: item.id,
      itemVotingEndsAt: add(new Date(), { seconds: 20 }),
      inProgress: true,
    });
  };

  return (
    <div>
      <p>voting... {tierList?.title}</p>
      <p>
        Time left... {secondsLeft}{" "}
        <button onClick={forceEnd} className="btn btn-sm btn-secondary">
          force end round
        </button>
        <button
          onClick={startNext}
          className="btn btn-sm btn-secondary"
          disabled={secondsLeft > 0}
        >
          start next round
        </button>
      </p>
      <Board tierList={tierList} />
      <TierListDebugInfo tierList={tierList} />
    </div>
  );
}
