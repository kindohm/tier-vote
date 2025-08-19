import {
  DocumentSnapshot,
  SnapshotOptions,
  collection,
  doc,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDb } from "./getDb";
import { TierList } from "./types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { COLLECTION_NAME } from "../constants";

export const updateTierList = async (id: string, newDoc: TierList) => {
  const db = getDb();
  const oldDoc = doc(db, COLLECTION_NAME, id);
  await setDoc(oldDoc, newDoc);
  return;
};

export const converter = {
  toFirestore(post: TierList) {
    return post;
  },
  fromFirestore(snapshot: DocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      createdAt: new Date(data?.createdAt.seconds * 1000),
      modifiedAt: new Date(data?.modifiedAt.seconds * 1000),
      itemVotingEndsAt: data?.itemVotingEndsAt
        ? new Date(data?.itemVotingEndsAt.seconds * 1000)
        : null,
      pendingVoteStartsAt: data?.pendingVoteStartsAt
        ? new Date(data?.pendingVoteStartsAt.seconds * 1000)
        : null,
    };
  },
};

export const useTierListsByUser = (userId?: string) => {
  const db = getDb();
  // @ts-expect-error it is ok
  const messagesRef = collection(db, COLLECTION_NAME).withConverter(converter);
  const q = query(
    messagesRef,
    where("createdBy", "==", userId ?? ""),
    limit(25)
  );
  const [data, loading] = useCollectionData(q);
  const sorted = (data as TierList[] | undefined)?.sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
  return [sorted, loading] as const;
};

export const useAdmins = () => {
  const db = getDb();

  const messagesRef = collection(db, "admins");
  const q = query(messagesRef, limit(25));

  const x = useCollectionData(q);
  return x[0]?.map((a) => a?.userId);
};

// Returns richer admin info including displayName if stored on admin doc.
// Each admin doc is expected to have (optional) fields: userId, displayName.
export const useAdminsInfo = () => {
  const db = getDb();
  const messagesRef = collection(db, "admins");
  const q = query(messagesRef, limit(50));
  // include idField so we can fallback to snapshot id
  // @ts-expect-error idField option not typed in our setup
  const x = useCollectionData(q, { idField: "id" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return x[0]?.map((a: any) => ({
    id: a.userId || a.id,
    name: a.displayName || a.userId || a.id,
  }));
};
