import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/data/getDb";
export type ChatMessageDoc = {
  id: string;
  userId: string;
  userName?: string | null;
  photoURL?: string | null;
  createdAt: number;
  text: string;
  clientId?: string | null;
};
export function useMessagesForList(listId?: string) {
  const [messages, setMessages] = useState<ChatMessageDoc[]>([]);
  useEffect(() => {
    if (!listId) {
      setMessages([]);
      return;
    }
    const db = getDb();
    const msgsRef = collection(db, "tierLists", listId, "messages");
    const q = query(msgsRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const data: ChatMessageDoc[] = [];
      snap.forEach((d) => {
        const doc = d.data() as {
          userId: string;
          userName?: string | null;
          photoURL?: string | null;
          createdAt?: { toMillis?: () => number } | number;
          text: string;
          clientId?: string | null;
        };
        data.push({
          id: d.id,
          userId: doc.userId,
          userName: doc.userName || null,
          photoURL: doc.photoURL || null,
          createdAt:
            typeof doc.createdAt === "object" && doc.createdAt?.toMillis
              ? doc.createdAt.toMillis()
              : (doc.createdAt as number) || Date.now(),
          text: doc.text,
          clientId: doc.clientId || null,
        });
      });
      setMessages(data);
    });
    return () => unsub();
  }, [listId]);
  return messages;
}
export async function sendMessageToList(
  listId: string,
  user: {
    uid: string;
    displayName?: string | null;
    photoURL?: string | null;
  } | null,
  text: string,
  clientId?: string
) {
  if (!listId) throw new Error("listId required");
  if (!user) throw new Error("user required");
  if (!text || !text.trim()) throw new Error("text required");
  const db = getDb();
  const msgsRef = collection(db, "tierLists", listId, "messages");
  const docRef = await addDoc(msgsRef, {
    userId: user.uid,
    userName: user.displayName || null,
    photoURL: user.photoURL || null,
    text: text.trim(),
    createdAt: serverTimestamp(),
    clientId: clientId || null,
  });
  return docRef.id;
}
