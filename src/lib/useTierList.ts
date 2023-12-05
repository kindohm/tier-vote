import {
  useCollectionData,
  useCollectionDataOnce,
  useDocument,
} from "react-firebase-hooks/firestore";
import { getDb } from "./getDb";
import { collection, doc, limit, query, where } from "firebase/firestore";
import { COLLECTION_NAME } from "./constants";
import { converter } from "./data";
import { TierList } from "./types";

export const useTierList = (id: string) => {
  const db = getDb();
  const tierListsRef = collection(db, COLLECTION_NAME).withConverter(converter);

  const [value, loading, error] = useDocument(
    doc(tierListsRef, id).withConverter(converter),
    {
      snapshotListenOptions: { includeMetadataChanges: false },
    }
  );

  console.log("valueeeee", value, loading, error);

  return value?.data() as unknown as TierList;
};
