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
import { Title } from "@/components/Title";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);
  const user = useUser();
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [secondsUntilStart, setSecondsUntilStart] = useState<number | null>(
    null
  );
  const isOwner = user?.uid === tierList?.createdBy;
  const router = useRouter();

  useInterval(() => {
    // Pending (pre-round) countdown logic
    if (
      tierList?.pendingVoteItemId &&
      tierList.pendingVoteStartsAt &&
      !tierList.currentVoteItemId
    ) {
      const until = differenceInSeconds(
        tierList.pendingVoteStartsAt,
        new Date()
      );
      setSecondsUntilStart(until >= 0 ? until : 0);
      if (until <= 0) {
        // Promote pending to active round. (Multiple clients may attempt; last write wins.)
        const newEndDate = add(new Date(), { seconds: 21 });
        updateTierList(id as string, {
          ...tierList,
          currentVoteItemId: tierList.pendingVoteItemId,
          itemVotingEndsAt: newEndDate,
          pendingVoteItemId: null,
          pendingVoteStartsAt: null,
        });
        const left = differenceInSeconds(newEndDate, new Date());
        setSecondsLeft(left);
        setSecondsUntilStart(null);
        return; // skip active logic this tick
      }
    } else if (!tierList?.pendingVoteItemId) {
      setSecondsUntilStart(null);
    }

    // Active round countdown
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
    const countdownEnd = add(new Date(), { seconds: 6 });

    updateTierList(id as string, {
      ...tierList,
      pendingVoteItemId: item.id,
      pendingVoteStartsAt: countdownEnd,
    });
  };

  return (
    <div>
      {tierList && !tierList?.inProgress ? (
        <div className="alert alert-warning">
          this tier list is closed, redirecting...
        </div>
      ) : (
        <Title tierList={tierList} user={user} />
      )}
      <div className="mb-2 mt-2">
        {tierList?.pendingVoteItemId && secondsUntilStart !== null ? (
          <p>Starting in: {secondsUntilStart}</p>
        ) : null}
        {tierList?.currentVoteItemId ? (
          <p>Time left to vote: {secondsLeft}</p>
        ) : null}
        {!tierList?.pendingVoteItemId && !tierList?.currentVoteItemId ? (
          <p>Waiting for admin to start the next round.</p>
        ) : null}
        {isOwner ? (
          <p>
            <button
              onClick={forceEnd}
              className="btn btn-sm btn-secondary me-3"
              disabled={!tierList?.currentVoteItemId}
            >
              force end round
            </button>

            <button
              onClick={startNext}
              className="btn btn-sm btn-secondary"
              disabled={
                !!tierList?.currentVoteItemId ||
                !!tierList?.pendingVoteItemId ||
                !tierList?.inProgress
              }
            >
              start next round
            </button>
          </p>
        ) : null}
      </div>

      <Board tierList={tierList} />
      {/* <TierListDebugInfo tierList={tierList} /> */}
    </div>
  );
}
