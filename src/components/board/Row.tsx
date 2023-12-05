import { TierList } from "@/lib/types";
import { TierLetter } from "./TierLetter";
import { RowItem } from "./RowItem";

type Props = {
  tier?: string;
  tierList: TierList;
  unassigned?: boolean;
};

const style = {
  background: "#cccccc",
  marginBottom: "2px",
  padding: "1px",
  display: "flex",
};

export const Row = ({ tier, tierList }: Props) => {
  const items = tierList?.items.filter((i) => {
    return (!tier && !i.tier) || i.tier === tier;
  });

  return (
    <div style={{ ...style, flexWrap: "wrap" }}>
      {tier ? <TierLetter letter={tier} /> : null}
      {items?.map((item) => {
        return <RowItem key={item.id} item={item} />;
      })}
    </div>
  );
};
