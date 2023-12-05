import { getAppAuth } from "../lib/getAppAuth";

export const SignOut = () => {
  const auth = getAppAuth();
  const { currentUser } = auth;

  return (
    currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out ({currentUser.displayName})
      </button>
    )
  );
};
