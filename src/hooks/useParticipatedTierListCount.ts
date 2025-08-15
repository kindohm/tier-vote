import { useEffect, useState } from "react";
import {
  collectionGroup,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/getDb";
import { TierList } from "@/lib/types";
import { converter } from "@/lib/data";

// Returns array of TierLists the user has votes in (distinct, newest first)
export function useParticipatedTierLists(userId?: string) {
  const [lists, setLists] = useState<TierList[]>([]);
  useEffect(() => {
    if (!userId) {
      setLists([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const db = getDb();
        const group = collectionGroup(db, "votes");
        const qVotes = query(group, where("userId", "==", userId));
        const snap = await getDocs(qVotes);
        if (cancelled) return;
        const ids = new Set<string>();
        snap.forEach((d) => {
          const data: any = d.data();
          if (data?.listId) ids.add(data.listId);
        });
        const fetched: TierList[] = [];
        for (const id of Array.from(ids.values())) {
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
        if (!cancelled) setLists(fetched);
      } catch (e) {
        console.error("participatedTierLists error", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);
  return lists;
}
