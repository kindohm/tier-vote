"use client";

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
      <h3>this is a tier list {id}</h3>
      <pre>
        <code>{JSON.stringify(tierList, null, 2)}</code>
      </pre>
    </div>
  );
}
