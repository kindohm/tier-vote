import { getAuth } from "firebase/auth";
import { getApp } from "./getApp";

export const getAppAuth = () => {
  return getAuth(getApp());
};
