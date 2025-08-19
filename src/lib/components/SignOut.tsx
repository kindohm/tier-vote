import { getAppAuth } from "@/lib/data/getAppAuth";
export const SignOut = () => {
  const auth = getAppAuth();
  const { currentUser } = auth;
  return (
    currentUser && (
      <button className="btn btn-link" onClick={() => auth.signOut()}>
        Sign Out ({currentUser.displayName})
      </button>
    )
  );
};
export default SignOut;
