import { ExternalLink } from "lucide-react";

type Props = {
  /** Resume URL or Supabase storage path (legacy). */
  path: string;
};

/**
 * Renders a link to view/download a resume.
 * Supports both direct URLs (new) and legacy Supabase storage paths.
 */
const ResumeDownloadButton = ({ path }: Props) => {
  if (!path) return null;

  const isUrl = path.startsWith("http://") || path.startsWith("https://");
  const href = isUrl ? path : "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-primary hover:underline"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      View Resume
    </a>
  );
};

export default ResumeDownloadButton;
