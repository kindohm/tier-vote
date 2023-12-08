const getTierColor = (tier: string) => {
  return tier === "S"
    ? "#FF7F7E"
    : tier === "A"
    ? "#FFBF7F"
    : tier === "B"
    ? "#FEFE7F"
    : tier === "C"
    ? "#7EFF80"
    : tier === "D"
    ? "#7FFFFF"
    : tier === "E"
    ? "#807FFF"
    : tier === "F"
    ? "#FF7FFE"
    : "#CCCCCC";
};

export const TierLetter = ({ letter }: { letter: string }) => {
  return (
    <span
      className="me-1"
      style={{
        background: getTierColor(letter),
        width: "75px",
        fontSize: "48px",
        textAlign: "center",
      }}
    >
      {letter}
    </span>
  );
};
