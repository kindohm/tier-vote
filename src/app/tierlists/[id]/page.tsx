"use client";

import { IMG_HOST } from "@/lib/constants";
import { getTierList } from "@/lib/data";
import { TierList } from "@/lib/types";
import { useUser } from "@/lib/useUser";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [tierList, setTierList] = useState<TierList | null>(null);
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

    if (id && user?.uid) getDoc(id as string);
  }, [id, user?.uid]);

  return (
    <div>
      <h2>{tierList?.title}</h2>
      <ul style={{ display: "flex", flexWrap: "wrap" }}>
        {tierList?.items.map((item) => {
          return (
            <li key={item.id} style={{ listStyleType: "none" }}>
              <img
                src={`${IMG_HOST}/${item.imageURL}`}
                width="100"
                height="100"
              />
            </li>
          );
        })}
      </ul>
      <h4>Fancy Debug Data:</h4>
      <pre
        style={{
          border: "solid 1px #ccc",
          background: "#eee",
          maxHeight: "200px",
          overflow: "scroll",
        }}
      >
        <code>{JSON.stringify(tierList, null, 2)}</code>
      </pre>
    </div>
  );
}
