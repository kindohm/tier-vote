import { useUser } from "@/lib/data/useUser";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";
import { useAdmins } from "@/lib/data/data";
import LogoTierList from "./LogoTierList";
export const Nav = () => {
  const admins = useAdmins();
  const user = useUser();
  const isAdmin = admins?.includes(user?.uid);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-2">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2" href="/">
          <LogoTierList />
          <span>Tier Vote</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            {isAdmin ? (
              <li className="nav-item">
                <a href="/create" className="nav-link">
                  Create
                </a>
              </li>
            ) : null}
            <li className="nav-item">{user ? <SignOut /> : <SignIn />}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
