import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "./getDb";
import { Vote } from "./types";

// Firestore vote document shape
export interface VoteDoc extends Vote {
  listId: string; // parent tier list id
  itemId: string; // tier item id
  createdAt?: any; // server timestamp
}

// Subscribe to all votes for one item
export function useVotesForItem(listId?: string, itemId?: string) {
  const [votes, setVotes] = useState<VoteDoc[]>([]);
  useEffect(() => {
    if (!listId || !itemId) {
      setVotes([]);
      return;
    }
    const db = getDb();
    const votesCol = collection(db, "tierLists", listId, "votes");
    const q = query(votesCol, where("itemId", "==", itemId));
    const unsub = onSnapshot(q, (snap) => {
      const data: VoteDoc[] = [];
      snap.forEach((d) => data.push(d.data() as VoteDoc));
      setVotes(data);
    });
    return () => unsub();
  }, [listId, itemId]);
  return votes;
}

// Subscribe to all votes across list
export function useAllVotesForList(listId?: string) {
  const [votes, setVotes] = useState<VoteDoc[]>([]);
  useEffect(() => {
    if (!listId) {
      setVotes([]);
      return;
    }
    const db = getDb();
    const votesCol = collection(db, "tierLists", listId, "votes");
    const q = query(votesCol);
    const unsub = onSnapshot(q, (snap) => {
      const data: VoteDoc[] = [];
      snap.forEach((d) => data.push(d.data() as VoteDoc));
      setVotes(data);
    });
    return () => unsub();
  }, [listId]);
  return votes;
}

// Get the current user's vote for an item (derived in-memory)
export function useUserVoteForItem(
  listId?: string,
  itemId?: string,
  userId?: string
) {
  const votes = useVotesForItem(listId, itemId);
  return useMemo(() => votes.find((v) => v.userId === userId), [votes, userId]);
}

// Cast / replace a vote (idempotent per user+item)
export async function castVote(params: {
  listId: string;
  itemId: string;
  userId: string;
  tier: string;
}) {
  const { listId, itemId, userId, tier } = params;
  const db = getDb();
  const votesCol = collection(db, "tierLists", listId, "votes");
  // Use deterministic doc id to allow overwriting (userId+itemId)
  const voteId = `${itemId}__${userId}`;
  const voteRef = doc(votesCol, voteId);
  await setDoc(voteRef, {
    listId,
    itemId,
    userId,
    tier,
    createdAt: serverTimestamp(),
  });
}
