"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { SetStateAction, useState } from "react";
import { useUser } from "@/lib/useUser";
import { useAdmins, useAdminsInfo, useTierListsByUser } from "@/lib/data";
import { useParticipatedTierLists } from "@/hooks/useParticipatedTierListCount";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { NotSignedIn } from "@/components/NotSignedIn";
import { getDb } from "@/lib/getDb";
import { collection, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const admins = useAdmins();
  const adminsInfo = useAdminsInfo();
  const user = useUser();
  const isAdmin = admins?.includes(user?.uid);
  const userTierLists = useTierListsByUser(user?.uid);
  const participatedLists = useParticipatedTierLists(user?.uid);

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

          <div className="row mb-4">
            <div className={isAdmin ? "col-lg-7" : "col-12"}>
              <h3>Tier Lists You Participated In</h3>
              <table className="table table-compact">
                <tbody>
                  {participatedLists.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <a href={`/tierlists/${l.id}`}>{l.title}</a>
                      </td>
                      <td>
                        <span>{formatDistanceToNow(l.createdAt)} ago</span>
                      </td>
                      <td>
                        {l.closed ? (
                          <span className="badge bg-success">closed</span>
                        ) : l.inProgress ? (
                          <span className="badge bg-info text-dark">
                            in progress
                          </span>
                        ) : (
                          <span className="badge bg-secondary">pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {participatedLists.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-muted">
                        No participation yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isAdmin && (
              <div className="col-lg-5 mt-4 mt-lg-0">
                {adminsInfo && (
                  <div className="mb-4">
                    <h4>Admin Users</h4>
                    <ul className="small" style={{ paddingLeft: "1rem" }}>
                      {adminsInfo.map((a) => (
                        <li key={a.id}>
                          {a.id === user?.uid ? `${a.name} (you)` : a.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <h3>Your Created Tier Lists</h3>
                <table className="table table-compact">
                  <tbody>
                    {userTierLists?.map((l) => (
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
                    ))}
                    {(!userTierLists || userTierLists.length === 0) && (
                      <tr>
                        <td colSpan={3} className="text-muted">
                          You haven't created any tier lists yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <NotSignedIn />
      )}
    </div>
  );
}
