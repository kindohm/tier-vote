import { Firestore, getFirestore } from "firebase/firestore";
import { getApp } from "./getApp";

let db: Firestore;

export const getDb = () => {
  if (!db) {
    db = getFirestore(getApp());
  }

  return db;
};
