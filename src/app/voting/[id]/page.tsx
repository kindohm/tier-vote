"use client";

import { Board } from "@/components/board/Board";
import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { useTierList } from "@/lib/useTierList";
import { useUser } from "@/lib/useUser";
import { useParams, useRouter } from "next/navigation";
import { useInterval, useTimeout } from "usehooks-ts";
import { add, differenceInSeconds } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { updateTierList } from "@/lib/data";
import { useVotesForItem, VoteDoc } from "../../../lib/useVotes";
import { randItem } from "@/lib/util";
import { Title } from "@/components/Title";
import { CountdownOverlay } from "@/components/CountdownOverlay";
// Progress bar extracted component (relative import fallback)
import { RoundProgressBar } from "../../../components/RoundProgressBar";
import { VoteToasts, VoteToast } from "@/components/VoteToasts";
import { VotingResults } from "@/components/votingResults/VotingResults";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);
  const votesForCurrentItem: VoteDoc[] = useVotesForItem(
    id as string,
    tierList?.currentVoteItemId || undefined
  );
  const user = useUser();
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [roundTotalSeconds, setRoundTotalSeconds] = useState<number | null>(
    null
  );
  const [secondsUntilStart, setSecondsUntilStart] = useState<number | null>(
    null
  );
  const isOwner = user?.uid === tierList?.createdBy;
  const router = useRouter();
  // Toast state for vote events (first vote or changed vote)
  const [voteToasts, setVoteToasts] = useState<VoteToast[]>([]);
  // Track last known tier per user for current item so we can emit toasts on changes
  const voteTiersRef = useRef<Map<string, string | null>>(new Map());

  // Reset tracking when a new round begins
  useEffect(() => {
    // New item: clear previous vote tier map
    voteTiersRef.current = new Map();
  }, [tierList?.currentVoteItemId]);

  // Detect new or changed votes for the active item and create toasts
  useEffect(() => {
    if (!tierList?.currentVoteItemId) return;
    const currentVotes = votesForCurrentItem;
    for (const v of currentVotes) {
      const prevTier = voteTiersRef.current.get(v.userId);
      // First time vote (prevTier undefined) OR tier changed
      if (prevTier === undefined || prevTier !== v.tier) {
        voteTiersRef.current.set(v.userId, v.tier || null);
        const id = `${v.userId}-${Date.now()}`;
        const voterName =
          tierList.users.find((u) => u.id === v.userId)?.name || "Someone";
        const message =
          prevTier === undefined
            ? `${voterName} voted${v.tier ? ` ${v.tier}` : ""}`
            : `${voterName} updated vote to${v.tier ? ` ${v.tier}` : ""}`;
        setVoteToasts((prev) => prev.concat({ id, message }));
        setTimeout(() => {
          setVoteToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
      }
    }
  }, [votesForCurrentItem, tierList?.currentVoteItemId, tierList?.users]);

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
        setRoundTotalSeconds(left);
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
    // Initialize total if we joined mid-round
    if (roundTotalSeconds === null && newSecondsLeft > 0) {
      setRoundTotalSeconds(newSecondsLeft);
    }

    setSecondsLeft(newSecondsLeft);

    if (newSecondsLeft <= 0) {
      forceEnd();
    }
  }, 250);

  const forceEnd = () => {
    // tally....
    const totals = tierList.tiers
      .map((tier) => {
        const votesFor = votesForCurrentItem.filter(
          (v: VoteDoc) => v.tier === tier
        );
        return { tier, votesFor: votesFor.length };
      })
      .sort((a, b) => (a.votesFor > b.votesFor ? -1 : 1))[0];

    const newItems = tierList.items.map((i) =>
      i.id === tierList.currentVoteItemId ? { ...i, tier: totals.tier } : i
    );

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
    setRoundTotalSeconds(null);
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
        {/* Removed inline countdown text; now using overlay */}
        {tierList?.currentVoteItemId
          ? (() => {
              // Distinct participant IDs
              const participantIds = Array.from(
                new Set(tierList.users.map((u) => u.id).filter(Boolean))
              );
              // Distinct voters for current item
              const voterIds = new Set(
                votesForCurrentItem.map((v: any) => v.userId).filter(Boolean)
              );
              const waitingCount = participantIds.filter(
                (id) => !voterIds.has(id)
              ).length;
              const missingIds = participantIds.filter(
                (id) => !voterIds.has(id)
              );
              const loneUserName =
                waitingCount === 1
                  ? tierList.users.find((u) => u.id === missingIds[0])?.name ||
                    "someone"
                  : null;
              return (
                <div className="mb-2">
                  <RoundProgressBar
                    secondsLeft={secondsLeft}
                    totalSeconds={roundTotalSeconds}
                  />
                  {waitingCount > 0 ? (
                    <p className="text-muted small mb-0">
                      {waitingCount === 1
                        ? `waiting on ${loneUserName} to vote...`
                        : `waiting for ${waitingCount} people to vote...`}
                    </p>
                  ) : (
                    <p className="text-success small mb-0">all votes in</p>
                  )}
                </div>
              );
            })()
          : null}
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

      {tierList?.currentVoteItemId ? (
        <div className="alert alert-info py-2">
          drag and drop the image on the bottom row to one of the tiers
        </div>
      ) : null}

      <div className="position-relative" style={{ minHeight: 300 }}>
        <Board tierList={tierList} />
        {tierList?.pendingVoteItemId && secondsUntilStart !== null && (
          <CountdownOverlay seconds={secondsUntilStart} />
        )}
      </div>
      {tierList && (
        <div className="mt-4">
          <VotingResults tierList={tierList} />
        </div>
      )}
      {/* Vote Toasts */}
      <VoteToasts toasts={voteToasts} />
      {/* <TierListDebugInfo tierList={tierList} /> */}
    </div>
  );
}
