import { useEffect } from "react";
import { ClipboardList } from "lucide-react";

interface TallyEmbedProps {
  /** Full Tally embed URL, e.g. https://tally.so/embed/xxxxx?... */
  url?: string;
  /** Iframe title for accessibility */
  title: string;
  /** Minimum iframe height in px on desktop */
  minHeight?: number;
  /** Internal name used in placeholder copy when url is not yet supplied */
  formName?: string;
  /** Short hint shown in the placeholder (required fields, etc.) */
  placeholderHint?: string;
}

/**
 * Reusable Tally form container. When `url` is provided it renders the live
 * Tally iframe; otherwise it shows a branded placeholder so the layout is
 * production-ready and ready to swap in the embed URL without any redesign.
 */
const TallyEmbed = ({
  url,
  title,
  minHeight = 720,
  formName,
  placeholderHint,
}: TallyEmbedProps) => {
  useEffect(() => {
    if (!url) return;
    // Load Tally's official embed script once for auto-resize support.
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://tally.so/widgets/embed.js"]'
    );
    if (existing) {
      // @ts-expect-error - Tally global
      window.Tally?.loadEmbeds?.();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://tally.so/widgets/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, [url]);

  if (!url) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-primary/30 bg-card p-10 text-center"
        style={{ minHeight: Math.min(minHeight, 420) }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
          <ClipboardList className="h-6 w-6 text-primary" strokeWidth={1.5} />
        </div>
        <div className="max-w-md">
          <p className="font-heading text-base font-semibold text-foreground">
            {formName ?? title} — Tally Embed
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This section is reserved for the live Tally form. Once the embed URL
            is provided, it will render here without any design changes.
          </p>
          {placeholderHint && (
            <p className="mt-3 text-xs text-muted-foreground/80">{placeholderHint}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <iframe
        data-tally-src={url}
        src={url}
        loading="lazy"
        title={title}
        width="100%"
        height={minHeight}
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        className="block w-full"
        style={{ minHeight }}
      />
    </div>
  );
};

export default TallyEmbed;
