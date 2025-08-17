import { useAuthState } from "react-firebase-hooks/auth";
import { getAppAuth } from "./getAppAuth";

export const useUser = () => {
  const [user, loading, error] = useAuthState(getAppAuth());

  if (typeof window !== 'undefined') {
    console.debug('useUser:', { user: !!user, loading, error });
  }

  return user;
};
