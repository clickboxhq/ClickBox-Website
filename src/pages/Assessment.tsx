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

    if (typeof window !== "undefined" && (window as Record<string, unknown>).Tally) {
      (window as Record<string, unknown> & { Tally: { loadEmbeds: () => void } }).Tally.loadEmbeds();
    }

    return () => {
      document.title = previousTitle;
      document.head.removeChild(robotsMeta);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      <iframe
        data-tally-src={`https://tally.so/embed/${FORM_ID}?dynamicHeight=1`}
        loading="eager"
        width="100%"
        height="100%"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title={PAGE_TITLE}
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default Assessment;
