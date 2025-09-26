import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/data/getDb";
import { COLLECTION_NAME } from "@/lib/constants";
import type { Reaction, ReactionDoc, EmojiType } from "./types";

function mapReactionDoc(doc: ReactionDoc): Reaction {
  return {
    id: doc.id,
    userId: doc.userId,
    userName: doc.userName,
    emoji: doc.emoji,
    createdAt:
      typeof doc.createdAt === "object" && doc.createdAt?.toMillis
        ? doc.createdAt.toMillis()
        : (doc.createdAt as number) || Date.now(),
    roundNumber: doc.roundNumber,
  };
}

export function useReactions(listId?: string) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId) {
      setReactions([]);
      setLoading(false);
      return;
    }

    const db = getDb();
    const reactionsRef = collection(db, COLLECTION_NAME, listId, "reactions");

    // Only show reactions from the last 10 seconds to avoid spam
    const cutoffTime = new Date(Date.now() - 10000);
    const q = query(
      reactionsRef,
      where("createdAt", ">", Timestamp.fromDate(cutoffTime)),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReactions: Reaction[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<ReactionDoc, "id">;
        newReactions.push(mapReactionDoc({ id: doc.id, ...data }));
      });

      setReactions(newReactions);
      setLoading(false);
    });

    return unsubscribe;
  }, [listId]);

  const sendReaction = async (
    emoji: EmojiType,
    userId: string,
    userName?: string,
    roundNumber?: number
  ) => {
    if (!listId) return;

    const db = getDb();
    const reactionsRef = collection(db, COLLECTION_NAME, listId, "reactions");

    await addDoc(reactionsRef, {
      userId,
      userName: userName || null,
      emoji,
      createdAt: serverTimestamp(),
      roundNumber: roundNumber || null,
    });
  };

  return { reactions, loading, sendReaction };
}
