import {
  DocumentSnapshot,
  SnapshotOptions,
  collection,
  doc,
  getDoc,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDb } from "./getDb";
import { TierList } from "./types";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { COLLECTION_NAME } from "./constants";

// // consider using a converter
// // // from:
// // https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945
// export const getTierList = async (id: string) => {
//   const db = getDb();
//   const snap = await getDoc(
//     doc(db, COLLECTION_NAME, id).withConverter(converter)
//   );
//   return snap.data() as TierList;
// };

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
  const x = useCollectionData(q);
  return x[0]?.sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  ) as TierList[];
};

export const useAdmins = () => {
  const db = getDb();

  const messagesRef = collection(db, "admins");
  const q = query(messagesRef, limit(25));

  const x = useCollectionData(q);
  return x[0]?.map((a) => a?.userId);
};
