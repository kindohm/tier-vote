import { useAuthState } from "react-firebase-hooks/auth";
import { getAppAuth } from "./getAppAuth";

export const useUser = () => {
  const [user] = useAuthState(getAppAuth());
  return user;
};
