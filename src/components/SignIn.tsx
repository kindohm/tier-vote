import * as fbAuth from "firebase/auth";
import { getAppAuth } from "../lib/getAppAuth";

export const SignIn = () => {
  const signInGoogle = async () => {
    try {
      const auth = getAppAuth();
      const provider = new fbAuth.GoogleAuthProvider();
      await fbAuth.signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button className="btn btn-sm btn-primary" onClick={signInGoogle}>
        Sign in
      </button>
    </>
  );
};
