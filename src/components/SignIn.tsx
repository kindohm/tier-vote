import * as fbAuth from "firebase/auth";
import { getAppAuth } from "../lib/getAppAuth";

export const SignIn = () => {
  const signInGoogle = async () => {
    try {
      const auth = getAppAuth();
      const provider = new fbAuth.GoogleAuthProvider();
      console.log("got auth", auth);
      const result = await fbAuth.signInWithPopup(auth, provider);
      console.log("google result", result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button onClick={signInGoogle}>Sign in</button>
    </>
  );
};
