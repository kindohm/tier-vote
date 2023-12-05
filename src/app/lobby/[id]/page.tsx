"use client";

import { useTierList } from "@/lib/useTierList";
import { useUser } from "@/lib/useUser";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const user = useUser();
  const router = useRouter();
  const tierList = useTierList(id as string);

  if (tierList?.inProgress) {
    router.push(`/voting/${tierList.id}`);
    return <div>redirecting...</div>;
  }

  return (
    <div>
      <h2>Lobby</h2>
      <h3>{tierList?.title}</h3>
      <div>Lobby code: {tierList?.id}</div>
      <h4>Voters:</h4>
      <ul>
        {tierList?.users.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>
    </div>
  );
}
