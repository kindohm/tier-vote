"use client";

import { Board } from "@/components/board/Board";
import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { useTierList } from "@/lib/useTierList";
import { useUser } from "@/lib/useUser";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();

  useInterval(() => {
    if (
      !tierList?.itemVotingEndsAt ||
      !tierList.currentVoteItemId ||
      secondsLeft <= 0
    ) {
      return;
    }

    const newSecondsLeft = differenceInSeconds(
      tierList?.itemVotingEndsAt,
      new Date()
    );

    setSecondsLeft(newSecondsLeft);

    if (newSecondsLeft <= 0) {
      forceEnd();
    }
  }, 250);

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

    const inProgress = !!newItems.find((i) => !i.tier);
    const closed = !inProgress;

    updateTierList(id as string, {
      ...tierList,
      inProgress,
      closed,
      items: newItems,
      lastVoteItemId: closed ? null : tierList.currentVoteItemId,
      currentVoteItemId: null,
      itemVotingEndsAt: null,
    });

    setSecondsLeft(0);
  };

  if (tierList && !tierList?.inProgress) {
    setTimeout(() => {
      router.push(`/tierlists/${tierList.id}`);
    }, 1000);
  }

  const startNext = async () => {
    const unvotedItems = tierList.items.filter((i) => !i.tier);
    const item = randItem(unvotedItems);
    const newEndDate = add(new Date(), { seconds: 21 });

    updateTierList(id as string, {
      ...tierList,
      currentVoteItemId: item.id,
      itemVotingEndsAt: newEndDate,
    });

    const newSecondsLeft = differenceInSeconds(newEndDate, new Date());

    setSecondsLeft(newSecondsLeft);
  };

  return (
    <div>
      {tierList && !tierList?.inProgress ? (
        <div className="alert alert-warning">
          this tier list is closed, redirecting...
        </div>
      ) : (
        <p>voting... {tierList?.title}</p>
      )}
      <p>
        Time left... {secondsLeft}{" "}
        {isOwner ? (
          <button
            onClick={forceEnd}
            className="btn btn-sm btn-secondary me-3"
            disabled={!tierList?.currentVoteItemId}
          >
            force end round
          </button>
        ) : null}
        {isOwner ? (
          <button
            onClick={startNext}
            className="btn btn-sm btn-secondary"
            disabled={!!tierList?.currentVoteItemId || !tierList.inProgress}
          >
            start next round
          </button>
        ) : null}
        {/* <input
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
        /> */}
      </p>
      <Board tierList={tierList} />
      <TierListDebugInfo tierList={tierList} />
    </div>
  );
}
