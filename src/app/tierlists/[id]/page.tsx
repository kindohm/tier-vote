"use client";

import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { Title } from "@/components/Title";
import { Board } from "@/components/board/Board";
import { VotingResults } from "@/components/votingResults/VotingResults";
import { IMG_HOST } from "@/lib/constants";
import { updateTierList } from "@/lib/data";
import { TierItem, TierList } from "@/lib/types";
import { useTierList } from "@/lib/useTierList";
import { useUser } from "@/lib/useUser";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);
  const user = useUser();

  return (
    <div>
      <Title tierList={tierList} user={user} />
      {!tierList?.closed ? (
        <>
          <p>
            <a href={`/lobby/${tierList?.id}`} className="btn btn-primary">
              Go to lobby
            </a>
          </p>
          <ul style={{ display: "flex", flexWrap: "wrap" }}>
            {tierList?.items.map((item: TierItem) => {
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
        </>
      ) : (
        <>
          <Board tierList={tierList} />
          <VotingResults tierList={tierList} />
        </>
      )}

      {/* <TierListDebugInfo tierList={tierList} /> */}
    </div>
  );
}
