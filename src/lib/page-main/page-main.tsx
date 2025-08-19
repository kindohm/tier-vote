"use client";

import { SetStateAction, useState } from "react";
import { useUser } from "@/lib/data/useUser";
import { useAdmins, useAdminsInfo, useTierListsByUser } from "@/lib/data/data";
import { useParticipatedTierLists } from "@/hooks/useParticipatedTierListCount";
import { useRouter } from "next/navigation";
import { NotSignedIn } from "@/components/NotSignedIn";
import { getDb } from "@/lib/data/getDb";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { CreatedTierLists } from "./components/CreatedTierLists";
import { ParticipatedLists } from "./components/ParticipatedLists";

export const MainPage = () => {
  const [code, setCode] = useState("");
  const router = useRouter();
  const admins = useAdmins();
  const adminsInfo = useAdminsInfo();
  const user = useUser();
  const isAdmin = admins?.includes(user?.uid);
  const [userTierLists, userTierListsLoading] = useTierListsByUser(user?.uid);
  const [participatedLists, participatedLoading] = useParticipatedTierLists(
    user?.uid
  );

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
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-primary" onClick={goClicked}>
                go
              </button>
            </div>
          </div>
          <div className="row mb-4">
            <div className={isAdmin ? "col-lg-7" : "col-12"}>
              <ParticipatedLists
                lists={participatedLists}
                loading={participatedLoading}
              />
            </div>
            {isAdmin && (
              <div className="col-lg-5 mt-4 mt-lg-0">
                <CreatedTierLists
                  lists={userTierLists}
                  loading={userTierListsLoading}
                  onDelete={handleDelete}
                  adminsInfo={adminsInfo}
                  currentUserId={user?.uid}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <NotSignedIn />
      )}
    </div>
  );
};

export default MainPage;
