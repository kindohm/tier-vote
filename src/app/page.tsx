"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { SetStateAction, useState } from "react";
import { useUser } from "@/lib/useUser";
import { useTierListsByUser } from "@/lib/data";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

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
      <h2>home</h2>

      <p>
        Join a tier list. Enter code:{" "}
        <input
          className="form-control"
          type="text"
          value={code}
          onChange={codeChanged}
        ></input>{" "}
        <button className="btn btn-primary" onClick={goClicked}>
          go
        </button>
      </p>

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
    </div>
  );
}
