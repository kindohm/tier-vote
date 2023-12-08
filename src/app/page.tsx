"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { SetStateAction, useState } from "react";
import { useUser } from "@/lib/useUser";
import { useTierListsByUser } from "@/lib/data";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { NotSignedIn } from "@/components/NotSignedIn";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const user = useUser();
  const userTierLists = useTierListsByUser(user?.uid);

  const codeChanged = (e: { target: { value: SetStateAction<string> } }) => {
    setCode(e.target.value);
  };

  const goClicked = async () => {
    router.push(`/lobby/${code}`);
  };

  return (
    <div>
      <h1>Amazing Tier List Thing</h1>

      {user ? (
        <>
          <div className="row mt-5 mb-5">
            <div className="col-auto">
              <label className="col-form-label">
                Join a tier list. Enter code:
              </label>
            </div>

            <div className="col-auto">
              <input
                className="form-control"
                type="text"
                value={code}
                onChange={codeChanged}
              ></input>
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" onClick={goClicked}>
                go
              </button>
            </div>
          </div>

          <h3>Your Created Tier Lists</h3>
          <table className="table table-compact">
            <tbody>
              {userTierLists?.map((l) => {
                return (
                  <tr key={l.id}>
                    <td>
                      <a href={`/tierlists/${l.id}`}>{l.title}</a>
                    </td>
                    <td>
                      <span>{formatDistanceToNow(l.createdAt)} ago</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      ) : (
        <NotSignedIn />
      )}
    </div>
  );
}
