"use client";

import { Board } from "@/lib/components/board/Board";
import { useTierList } from "@/lib/data/useTierList";
import { useUser } from "@/lib/data/useUser";
import { useParams, useRouter } from "next/navigation";
import { useInterval } from "usehooks-ts";
import { add, differenceInSeconds } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { updateTierList } from "@/lib/data/data";
import { useVotesForItem, VoteDoc } from "@/lib/data/useVotes";
import { randItem } from "@/lib/util";
import { TierItem } from "@/lib/data/types";
import { Title } from "@/lib/components/Title";
import { CountdownOverlay } from "@/lib/components/CountdownOverlay";
import { RoundProgressBar } from "@/lib/components/RoundProgressBar";
import { VoteToasts, VoteToast } from "./components/VoteToasts";
import { WaitingStatus } from "@/lib/components/WaitingStatus";
import { VotingResults } from "@/lib/components/votingResults/VotingResults";
import { ChatPanel } from "@/lib/components/chat/ChatPanel";
import { RoundEndOverlay } from "./components/RoundEndOverlay";
import { useReactions } from "@/lib/components/reactions/useReactions";
import { FloatingEmojis } from "@/lib/components/reactions/FloatingEmojis";
import type { EmojiType } from "@/lib/components/reactions/types";

export const VotingPage = () => {
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
  const [voteToasts, setVoteToasts] = useState<VoteToast[]>([]);
  const voteTiersRef = useRef<Map<string, string | null>>(new Map());
  const [showRoundEndOverlay, setShowRoundEndOverlay] = useState(false);
  const [lastCompletedItem, setLastCompletedItem] = useState<{
    item: TierItem;
    tier: string;
  } | null>(null);

  // Reactions system
  const { reactions, sendReaction } = useReactions(id as string);

  useEffect(() => {
    voteTiersRef.current = new Map();
  }, [tierList?.currentVoteItemId]);

  // Hide the round end overlay when a new round countdown starts
  useEffect(() => {
    if (tierList?.pendingVoteItemId && showRoundEndOverlay) {
      setShowRoundEndOverlay(false);
      setLastCompletedItem(null);
    }
  }, [tierList?.pendingVoteItemId, showRoundEndOverlay]);

  // Handle redirect when voting is complete
  useEffect(() => {
    if (tierList && !tierList.inProgress && tierList.closed) {
      const delay = showRoundEndOverlay ? 4000 : 1000;
      const timer = setTimeout(() => {
        console.log("Redirecting to /tierlists/" + tierList.id);
        router.push(`/tierlists/${tierList.id}`);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [tierList, showRoundEndOverlay, router]);

  useEffect(() => {
    if (!tierList?.currentVoteItemId) return;
    const currentVotes = votesForCurrentItem;
    for (const v of currentVotes) {
      const prevTier = voteTiersRef.current.get(v.userId);
      if (prevTier === undefined || prevTier !== v.tier) {
        voteTiersRef.current.set(v.userId, v.tier || null);
        const toastId = `${v.userId}-${Date.now()}`;
        const voterName =
          tierList.users.find((u) => u.id === v.userId)?.name || "Someone";
        const message =
          prevTier === undefined
            ? `${voterName} voted${v.tier ? ` ${v.tier}` : ""}`
            : `${voterName} updated vote to${v.tier ? ` ${v.tier}` : ""}`;
        setVoteToasts((prev) => prev.concat({ id: toastId, message }));
        setTimeout(() => {
          setVoteToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 4000);
      }
    }
  }, [votesForCurrentItem, tierList?.currentVoteItemId, tierList?.users]);

  useInterval(() => {
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
        return;
      }
    } else if (!tierList?.pendingVoteItemId) {
      setSecondsUntilStart(null);
    }

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
    if (roundTotalSeconds === null && newSecondsLeft > 0) {
      setRoundTotalSeconds(newSecondsLeft);
    }

    setSecondsLeft(newSecondsLeft);

    if (newSecondsLeft <= 0) {
      forceEnd();
    }
  }, 250);

  const forceEnd = () => {
    const totals = tierList.tiers
      .map((tier) => {
        const votesFor = votesForCurrentItem.filter(
          (v: VoteDoc) => v.tier === tier
        );
        return { tier, votesFor: votesFor.length };
      })
      .sort((a, b) => (a.votesFor > b.votesFor ? -1 : 1))[0];

    // Find the item that was just voted on
    const votedItem = tierList.items.find(
      (item) => item.id === tierList.currentVoteItemId
    );

    const newItems = tierList.items.map((i) =>
      i.id === tierList.currentVoteItemId ? { ...i, tier: totals.tier } : i
    );

    const inProgress = !!newItems.find((i) => !i.tier);
    const closed = !inProgress;

    // Show the overlay with the completed item and its tier
    if (votedItem) {
      setLastCompletedItem({
        item: votedItem,
        tier: totals.tier,
      });
      setShowRoundEndOverlay(true);
    }

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

  const handleReaction = async (emoji: EmojiType) => {
    if (!user || !id) return;
    
    try {
      await sendReaction(
        emoji,
        user.uid,
        user.displayName || undefined,
        // Could track round number here if needed
      );
    } catch (error) {
      console.error('Failed to send reaction:', error);
    }
  };

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
    <>
      <div className="position-relative">
        {tierList && !tierList?.inProgress ? (
          <div className="alert alert-warning">
            this tier list is closed, redirecting...
          </div>
        ) : (
          <Title tierList={tierList} user={user} />
        )}
        <div className="mb-2 mt-2">
          {tierList?.currentVoteItemId && (
            <div className="mb-2">
              <RoundProgressBar
                secondsLeft={secondsLeft}
                totalSeconds={roundTotalSeconds}
              />
              <WaitingStatus
                tierList={tierList}
                votesForCurrentItem={votesForCurrentItem}
              />
            </div>
          )}
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
          {/* Round End Overlay */}
          {showRoundEndOverlay && lastCompletedItem && (
            <RoundEndOverlay
              item={lastCompletedItem.item}
              winningTier={lastCompletedItem.tier}
              show={showRoundEndOverlay}
              onReaction={handleReaction}
            />
          )}
          {/* Floating Emoji Reactions */}
          {reactions.length > 0 && <FloatingEmojis reactions={reactions} />}
        </div>
        {tierList && (
          <div className="mt-4">
            <VotingResults tierList={tierList} />
          </div>
        )}
        <VoteToasts toasts={voteToasts} />
      </div>
      <ChatPanel listId={tierList?.id} />
    </>
  );
};

export default VotingPage;
