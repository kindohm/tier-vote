"use client";

import React, { useMemo } from "react";
import { TierList } from "@/lib/types";
import { VoteDoc } from "@/lib/useVotes";

interface WaitingStatusProps {
  tierList: TierList | undefined;
  votesForCurrentItem: VoteDoc[];
  className?: string;
}

export const WaitingStatus: React.FC<WaitingStatusProps> = ({
  tierList,
  votesForCurrentItem,
  className = "",
}) => {
  const { waitingCount, participants, voterSet } = useMemo(() => {
    if (!tierList?.currentVoteItemId) {
      return {
        waitingCount: 0,
        waitingUsers: [] as { id: string; name: string }[],
        participants: [] as { id: string; name: string }[],
        voterSet: new Set<string>(),
      };
    }
    const participantIds = Array.from(
      new Set(tierList.users.map((u) => u.id).filter(Boolean))
    );
    const voterIds = new Set(
      votesForCurrentItem.map((v: any) => v.userId).filter(Boolean)
    );
    const waitingIds = participantIds.filter((id) => !voterIds.has(id));
    const waitingUsers = waitingIds
      .map((id) => tierList.users.find((u) => u.id === id))
      .filter(Boolean) as { id: string; name: string }[];
    const waitingCount = waitingUsers.length;
    const participants = participantIds
      .map((id) => tierList.users.find((u) => u.id === id))
      .filter(Boolean) as { id: string; name: string }[];
    return { waitingCount, waitingUsers, participants, voterSet: voterIds };
  }, [tierList, votesForCurrentItem]);

  if (!tierList?.currentVoteItemId) return null;

  // Render all participant avatars; overlay a green check for those who have voted.
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <div className="d-flex flex-wrap gap-1">
        {participants.map((u) => {
          const initials = u.name
            .split(/\s+/)
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const hasVoted = voterSet.has(u.id);
          return (
            <span
              key={u.id}
              title={hasVoted ? `${u.name} voted` : `${u.name} pending`}
              aria-label={hasVoted ? `${u.name} voted` : `${u.name} pending`}
              className="position-relative rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: 32,
                height: 32,
                fontSize: 12,
                fontWeight: 600,
                background: hasVoted ? "#6c757d" : "#adb5bd",
                color: "#fff",
                userSelect: "none",
                transition: "background .2s",
              }}
            >
              {initials}
              {hasVoted && (
                <span
                  className="position-absolute bg-success d-flex align-items-center justify-content-center"
                  style={{
                    top: -2,
                    right: -2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    boxShadow: "0 0 0 2px #fff",
                    fontSize: 10,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "#fff",
                  }}
                >
                  ✓
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span
        className={`small ${
          waitingCount === 0 ? "text-success" : "text-muted"
        }`}
      >
        {waitingCount === 0
          ? "all votes in"
          : waitingCount === 1
          ? "waiting on 1 person"
          : `waiting on ${waitingCount} people`}
      </span>
    </div>
  );
};

export default WaitingStatus;
