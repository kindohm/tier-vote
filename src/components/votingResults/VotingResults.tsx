import { IMG_HOST } from "@/lib/constants";
import { TierList } from "@/lib/types";
import Image from "next/image";

type Props = {
  tierList: TierList;
};

export const VotingResults = ({ tierList }: Props) => {
  return (
    <div>
      <h3>voting results</h3>
      <ul>
        {tierList.items.map((item) => {
          return (
            <li key={item.id}>
              <Image
                src={`${IMG_HOST}/${decodeURIComponent(item.imageURL ?? "")}`}
                alt="image"
                width="75"
                height="75"
              />
              <span>
                {item.votes
                  .map((v) => {
                    return `${v.userName}: ${v.tier}`;
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
