import { TierList } from "@/lib/types";
import { Row } from "./Row";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Props = {
  tierList: TierList;
};

export const Board = ({ tierList }: Props) => {
  return (
    <DndProvider debugMode={true} backend={HTML5Backend}>
      <div>
        {tierList?.tiers.map((tier) => {
          return <Row tier={tier} tierList={tierList} key={tier} />;
        })}
        <Row tierList={tierList} unassigned />
      </div>
    </DndProvider>
  );
};
