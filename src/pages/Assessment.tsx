import { useEffect } from "react";

const FORM_ID = "J9BrXd";
const PAGE_TITLE = "The ClickBox Cybersecurity Fellowship 2026 Applicant Assessment";

const Assessment = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const robotsMeta = document.createElement("meta");
    robotsMeta.name = "robots";
    robotsMeta.content = "noindex, nofollow";
    document.head.appendChild(robotsMeta);

    const previousOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    const w = window as unknown as { Tally?: { loadEmbeds: () => void } };
    if (typeof window !== "undefined" && w.Tally) {
      w.Tally.loadEmbeds();
    }

    return () => {
      document.title = previousTitle;
      document.head.removeChild(robotsMeta);
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-background">
      <iframe
        data-tally-src={`https://tally.so/embed/${FORM_ID}?alignLeft=1&dynamicHeight=1`}
        loading="eager"
        width="100%"
        height={1200}
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title={PAGE_TITLE}
        style={{
          border: "none",
          width: "100%",
          display: "block",
          minHeight: "100dvh",
        }}
      />
    </div>
  );
};

export default Assessment;
