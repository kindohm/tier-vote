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
  createdAt: number; // epoch ms
  text: string;
  clientId?: string | null;
};

// Subscribe to messages for a tier list (ordered ascending)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = d.data() as any;
        data.push({
          id: d.id,
          userId: doc.userId,
          userName: doc.userName || null,
          photoURL: doc.photoURL || null,
          createdAt: doc.createdAt?.toMillis
            ? doc.createdAt.toMillis()
            : doc.createdAt || Date.now(),
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

// Send a message to a specific list. Returns the new document id.
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
