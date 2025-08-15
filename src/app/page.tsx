"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { SetStateAction, useState } from "react";
import { useUser } from "@/lib/useUser";
import { useAdmins, useTierListsByUser } from "@/lib/data";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { NotSignedIn } from "@/components/NotSignedIn";
import { getDb } from "@/lib/getDb";
import { collection, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const admins = useAdmins();
  const user = useUser();
  const isAdmin = admins?.includes(user?.uid);
  const userTierLists = useTierListsByUser(user?.uid);

  const codeChanged = (e: { target: { value: SetStateAction<string> } }) => {
    setCode(e.target.value);
  };

  const goClicked = async () => {
    router.push(`/lobby/${code}`);
  };

  const handleDelete = async (id: string) => {
    const db = getDb();
    const tierListRef = collection(db, "tierlists");
    const document = doc(tierListRef, id);
    deleteDoc(document);
  };

  return (
    <div>
      <h1>Tier Vote</h1>

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

          {isAdmin ? (
            <>
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
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(l.id)}
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : null}
        </>
      ) : (
        <NotSignedIn />
      )}
    </div>
  );
}
