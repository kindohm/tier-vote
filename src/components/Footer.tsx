export const Footer = () => {
  return (
    <footer className="mt-5 mb-5" style={{ fontSize: "75%" }}>
      <small>
        Made by{" "}
        <a href="https://kindohm.com" target="_blank">
          Mike Hodnick
        </a>
        . Unauthorized duplication may result in sudden death or dismemberment.{" "}
        <a
          href="https://github.com/kindohm/tier-vote/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit a bug or idea.
        </a>{" "}
        <a href="https://github.com/kindohm/tier-vote/pulls">
          Awaiting your PR
        </a>
        .
      </small>
    </footer>
  );
};
