import { TierList } from "@/lib/types";

export const TierListDebugInfo = ({
  tierList,
}: {
  tierList: TierList | undefined;
}) => {
  return (
    <>
      <h4>Fancy Debug Data:</h4>
      <pre
        style={{
          border: "solid 1px #ccc",
          background: "#eee",
          overflow: "scroll",
        }}
      >
        <code>{JSON.stringify(tierList, null, 2)}</code>
      </pre>
    </>
  );
};
