"use client";

import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { Board } from "@/components/board/Board";
import { IMG_HOST } from "@/lib/constants";
import { TierItem, TierList } from "@/lib/types";
import { useTierList } from "@/lib/useTierList";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);

  return (
    <div>
      <h2>{tierList?.title}</h2>
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
        <Board tierList={tierList} />
      )}

      <TierListDebugInfo tierList={tierList} />
    </div>
  );
}
