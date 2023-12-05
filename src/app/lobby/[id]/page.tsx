"use client";

import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { updateTierList } from "@/lib/data";
import { useTierList } from "@/lib/useTierList";
import { useUser } from "@/lib/useUser";
import { randItem } from "@/lib/util";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { add } from "date-fns";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const tierList = useTierList(id as string);
  const user = useUser();

  const isCreator = !!tierList?.users.find((u) => u.id === user?.uid);

  useEffect(() => {
    if (!user || !tierList) return;
    if (!tierList.users.find((u) => u.id === user.uid)) {
      const newUsers = tierList.users.concat({
        id: user.uid,
        name: user.displayName ?? "unknown",
      });
      updateTierList(id as string, { ...tierList, users: newUsers });
    }
  }, [user, tierList]);

  useEffect(() => {
    if (tierList?.inProgress) {
      router.push(`/voting/${tierList.id}`);
    }
  }, [tierList?.inProgress]);

  const beginVotingClick = async () => {
    const item = randItem(tierList.items.filter((i) => !i.tier));
    await updateTierList(id as string, {
      ...tierList,
      currentVoteItemId: item.id,
      itemVotingEndsAt: add(new Date(), { seconds: 20 }),
      inProgress: true,
    });
  };

  if (!tierList) {
    return null;
  }

  if (tierList?.inProgress) {
    return <div>redirecting...</div>;
  }

  return (
    <div>
      <h2>Lobby</h2>
      <h3>{tierList?.title}</h3>
      <div>Lobby code: {tierList?.id}</div>
      {isCreator ? (
        <div>
          <button className="btn btn-primary" onClick={beginVotingClick}>
            Begin Voting
          </button>
        </div>
      ) : null}
      <h4>Voters:</h4>
      <ul>
        {tierList?.users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      <TierListDebugInfo tierList={tierList} />
    </div>
  );
}
