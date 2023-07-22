import useCopyToClipboard from "../../hooks/useCopyToClipboard";

const CopyUrlButton = ({ url }: { url: string }) => {
  const [copyUrlStatus, copyUrl] = useCopyToClipboard(url);
  let buttonText = "Copy URL";

  if (copyUrlStatus === "copied") {
    buttonText = "Copied";
  } else if (copyUrlStatus === "failed") {
    buttonText = "Copy failed!";
  }

  if (!url) return null;

  return (
    <button
      onClick={copyUrl}
      style={{
        cursor: "pointer",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "1rem",
        marginBottom: "1rem",
        background: "#009fbf",
        color: "white",
      }}
    >
      {buttonText}
    </button>
  );
};

export default CopyUrlButton;
