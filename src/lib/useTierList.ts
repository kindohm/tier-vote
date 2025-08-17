import { useDocument } from "react-firebase-hooks/firestore";
import { getDb } from "./getDb";
import { collection, doc } from "firebase/firestore";
import { COLLECTION_NAME } from "./constants";
import { converter } from "./data";
import { TierList } from "./types";

export const useTierList = (id: string) => {
  const db = getDb();
  // @ts-expect-error it is ok
  const tierListsRef = collection(db, COLLECTION_NAME).withConverter(converter);

  // build a doc ref or null to avoid conditional hooks
  // @ts-expect-error it is ok
  const docRef = id ? doc(tierListsRef, id).withConverter(converter) : null;

  const [value, loading, error] = useDocument(docRef, {
    snapshotListenOptions: { includeMetadataChanges: false },
  });

  if (typeof window !== 'undefined') {
    console.debug('useTierList:', { id, hasValue: !!value, loading, error });
  }

  return value?.data() as unknown as TierList;
};
