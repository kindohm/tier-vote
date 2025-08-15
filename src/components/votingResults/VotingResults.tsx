import { IMG_HOST } from "@/lib/constants";
import { TierList } from "@/lib/types";
import { useAllVotesForList, VoteDoc } from "../../lib/useVotes";
import Image from "next/image";

type Props = {
  tierList: TierList;
};

export const VotingResults = ({ tierList }: Props) => {
  const allVotes = useAllVotesForList(tierList.id);
  return (
    <div>
      <h3>voting results</h3>
      <ul>
        {tierList.items.map((item) => {
          const votesForItem: VoteDoc[] = allVotes.filter(
            (v) => v.itemId === item.id
          );
          return (
            <li key={item.id}>
              <Image
                src={`${IMG_HOST}/${decodeURIComponent(item.imageURL ?? "")}`}
                alt="image"
                width="75"
                height="75"
              />
              <span>
                {votesForItem
                  .map((v) => {
                    const u = tierList.users.find((u) => u.id === v.userId);
                    return `${u?.name ?? "unknown"}: ${v.tier}`;
                  })
                  .join(", ")}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
