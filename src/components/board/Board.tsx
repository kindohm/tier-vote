import { TierList } from "@/lib/types";
import { Row } from "./Row";

type Props = {
  tierList: TierList;
};

export const Board = ({ tierList }: Props) => {
  return (
    <div>
      {tierList?.tiers.map((tier) => {
        return <Row tier={tier} tierList={tierList} key={tier} />;
      })}
      <Row tierList={tierList} unassigned />
    </div>
  );
};
