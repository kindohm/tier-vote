"use client";

import { useTierList } from "@/lib/useTierList";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params;
  const tierList = useTierList(id as string);

  return <div>voting... {tierList?.title}</div>;
}
