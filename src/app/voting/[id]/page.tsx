"use client";

import { Board } from "@/components/board/Board";
import { TierListDebugInfo } from "@/components/TierListDebugInfo";
import { useTierList } from "@/lib/useTierList";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);

  if (tierList && !tierList?.inProgress) {
    return (
      <div className="alert alert-warning">
        this tier list is not yet in progress
      </div>
    );
  }

  return (
    <div>
      <p>voting... {tierList?.title}</p> <Board tierList={tierList} />
      <TierListDebugInfo tierList={tierList} />
    </div>
  );
}
