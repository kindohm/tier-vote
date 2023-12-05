export const TierLetter = ({ letter }: { letter: string }) => {
  return (
    <span
      style={{
        background: "#ffcccc",
        width: "75px",
        fontSize: "48px",
        textAlign: "center",
      }}
    >
      {letter}
    </span>
  );
};
