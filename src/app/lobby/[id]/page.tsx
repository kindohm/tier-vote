"use client";

import { updateTierList } from "@/lib/data/data";
import { useTierList } from "@/lib/data/useTierList";
import { useUser } from "@/lib/data/useUser";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Title } from "@/components/Title";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const tierList = useTierList(id as string);
  const user = useUser();

  // Only the user who originally created the tier list (createdBy) is the creator.
  const isCreator = !!(user && tierList && tierList.createdBy === user.uid);

  useEffect(() => {
    if (!user || !tierList) return;
    if (!tierList.users.find((u) => u.id === user.uid)) {
      const newUsers = tierList.users.concat({
        id: user.uid,
        name: user.displayName ?? "unknown",
      });
      updateTierList(id as string, { ...tierList, users: newUsers });
    }
  }, [user, tierList, id]);

  useEffect(() => {
    if (tierList?.inProgress) {
      router.push(`/voting/${tierList.id}`);
    }
  }, [tierList?.inProgress, router, tierList?.id]);

  const beginVotingClick = async () => {
    await updateTierList(id as string, {
      ...tierList,
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
      <h1>Lobby</h1>
      <Title tierList={tierList} user={user} />
      <p className="mt-3">Lobby code: {tierList?.id}</p>
      {isCreator ? (
        <div>
          <button className="btn btn-primary" onClick={beginVotingClick}>
            Begin Voting
          </button>
        </div>
      ) : (
        <div>Waiting for the admin to start the voting.</div>
      )}
      <h4 className="mt-4">Guests:</h4>
      <ul>
        {tierList?.users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
      {/* <TierListDebugInfo tierList={tierList} /> */}

      {tierList?.id && <ChatPanel listId={tierList.id} />}
    </div>
  );
}
