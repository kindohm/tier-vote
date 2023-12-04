import { useAuthState } from "react-firebase-hooks/auth";
import { Link, Outlet } from "react-router-dom";
import { getAppAuth } from "../../lib/getAppAuth";
import { SignOut } from "../../components/SignOut";
import { SignIn } from "../../components/SignIn";

export const Root = () => {
  const [user] = useAuthState(getAppAuth());

  return (
    <div>
      <h1>root</h1>
      <ul>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/create">create</Link>
        </li>
        <li>{user ? <SignOut /> : <SignIn />}</li>
      </ul>
      <Outlet />
    </div>
  );
};
