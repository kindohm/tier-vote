"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { SetStateAction, useState } from "react";
import { useUser } from "@/lib/useUser";
import { useTierListsByUser } from "@/lib/data";
import { useRouter } from "next/navigation";

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
      <ul>
        {userTierLists?.map((l) => {
          return (
            <li key={l.id}>
              <a href={`/tierlists/${l.id}`}>{l.title}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
