import { collection, query, limit, where } from "firebase/firestore";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { getDb } from "../../../lib/getDb";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getTierList,
  updateTierList,
  useTierListsByUser,
} from "../../../lib/data";
import { useUser } from "../../../lib/useUser";

export const Home = () => {
  // const d = getDb();
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const user = useUser();
  const userTierLists = useTierListsByUser(user?.uid);
  // const messagesRef = collection(d, "messages");
  // const q = query(messagesRef, where("createdBy", "==", user?.uid), limit(25));

  // const [data] = useCollectionData(q);

  const codeChanged = (e) => {
    setCode(e.target.value);
  };

  const goClicked = async () => {
    if (!user) {
      throw new Error("no user");
    }
    const tierList = await getTierList(code);
    const { users } = tierList;
    const foundUser = users.find((u) => u.id === user?.uid);

    if (!foundUser) {
      const newUsers = users.concat({ id: user?.uid });
      await updateTierList(code, { ...tierList, users: newUsers });
    }

    navigate(`/tierlists/${code}`);
  };

  return (
    <div>
      <h2>home</h2>

      <p>
        Join a tier list. Enter code:{" "}
        <input type="text" value={code} onChange={codeChanged}></input>{" "}
        <button onClick={goClicked}>go</button>
      </p>

      <h3>Your Created Tier Lists</h3>
      <ul>
        {userTierLists?.map((l) => {
          return (
            <li key={l.id}>
              <Link to={`/tierlists/${l.id}`}>{l.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
