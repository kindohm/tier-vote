/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  collectionGroup,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/data/getDb";
import { TierList } from "@/lib/data/types";
import { converter } from "@/lib/data/data";

// Optimized version using participants subcollection
export function useParticipatedTierLists(userId?: string) {
  const [lists, setLists] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLists([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const db = getDb();
        // Query participants collection group to find all lists this user has participated in
        const participantsGroup = collectionGroup(db, "participants");
        const qParticipants = query(
          participantsGroup,
          where("userId", "==", userId)
        );
        const snap = await getDocs(qParticipants);

        if (cancelled) return;

        const listIds = new Set<string>();
        snap.forEach((d) => {
          // Extract list ID from the document path: tierLists/{listId}/participants/{userId}
          const pathParts = d.ref.path.split("/");
          if (pathParts.length >= 2 && pathParts[0] === "tierLists") {
            listIds.add(pathParts[1]);
          }
        });

        const fetched: TierList[] = [];
        for (const id of Array.from(listIds.values())) {
          // Try lowercase canonical path
          let ref = doc(getDb(), "tierlists", id).withConverter(
            converter as any
          );
          let ds = await getDoc(ref);
          if (!ds.exists()) {
            // try legacy path
            ref = doc(getDb(), "tierLists", id).withConverter(converter as any);
            ds = await getDoc(ref);
          }
          if (ds.exists()) {
            fetched.push(ds.data() as TierList);
          }
        }

        fetched.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        if (!cancelled) {
          setLists(fetched);
          setLoading(false);
        }
      } catch (e) {
        console.error("participatedTierLists error", e);
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return [lists, loading] as const;
}
