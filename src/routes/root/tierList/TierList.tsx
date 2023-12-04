import { useParams } from "react-router-dom";
import { getTierList } from "../../../lib/data";
import { useEffect, useState } from "react";
import { TierList as TierListType } from "./../../../lib/types";
import { useUser } from "../../../lib/useUser";

export const TierList = () => {
  const [tierList, setTierList] = useState<TierListType | null>(null);
  const params = useParams();
  const { id } = params;
  const user = useUser();

  useEffect(() => {
    const getDoc = async (docId: string) => {
      const data = await getTierList(docId);

      if (!data.users.find((u) => u.id === user?.uid)) {
        throw new Error("You cannot view this one");
      }

      setTierList(data);
    };

    if (id && user?.uid) getDoc(id);
  }, [id, user?.uid]);

  return (
    <div>
      <h3>this is a tier list {id}</h3>
      <pre>
        <code>{JSON.stringify(tierList, null, 2)}</code>
      </pre>
    </div>
  );
};
