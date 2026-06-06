import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getResumeSignedUrl, resumeDisplayName } from "@/lib/resumeUpload";

type Props = {
  path: string;
};

const ResumeDownloadButton = ({ path }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const url = await getResumeSignedUrl(path);
    setLoading(false);

    if (!url) {
      toast.error("Could not open resume", { description: "Please try again or contact support." });
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={loading}
      className="inline-flex items-center gap-2 text-primary hover:underline disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      Download resume ({resumeDisplayName(path)})
    </button>
  );
};

export default ResumeDownloadButton;
