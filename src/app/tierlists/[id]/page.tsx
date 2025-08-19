"use client";

import { Title } from "@/components/Title";
import { Board } from "@/components/board/Board";
import { VotingResults } from "@/components/votingResults/VotingResults";
import { IMG_HOST } from "@/lib/constants";
import { TierItem } from "@/lib/data/types";
import { useTierList } from "@/lib/data/useTierList";
import { useUser } from "@/lib/data/useUser";
import { useParams } from "next/navigation";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);
  const user = useUser();

  return (
    <div>
      <Title tierList={tierList} user={user} />
      <div className="mt-3">
        {!tierList?.closed ? (
          <>
            <p>This is your tier list. Feed it regularly.</p>
            <p>
              <a href={`/lobby/${tierList?.id}`} className="btn btn-primary">
                Ready to vote? Go to lobby
              </a>
            </p>
            <p>Images:</p>
            <ul style={{ display: "flex", flexWrap: "wrap", padding: "0" }}>
              {tierList?.items.map((item: TierItem) => {
                return (
                  <li
                    key={item.id}
                    style={{
                      listStyleType: "none",
                      border: "solid 1px #cccccc",
                    }}
                    className="me-1"
                  >
                    <img
                      src={`${IMG_HOST}/${decodeURIComponent(
                        item.imageURL ?? ""
                      )}`}
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
            <div className="mt-5">
              <VotingResults tierList={tierList} />
            </div>
          </>
        )}
      </div>

      {/* <TierListDebugInfo tierList={tierList} /> */}

      {tierList?.id && <ChatPanel listId={tierList.id} />}
    </div>
  );
}
