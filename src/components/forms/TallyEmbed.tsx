import { useEffect } from 'react';

interface TallyEmbedProps {
  formId: string;
  height?: number;
  className?: string;
  title?: string;
}

export function TallyEmbed({
  formId,
  height = 600,
  className = '',
  title = 'Form',
}: TallyEmbedProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).Tally) {
      (window as Record<string, unknown> & { Tally: { loadEmbeds: () => void } }).Tally.loadEmbeds();
    }
  }, [formId]);

  return (
    <div
      className={`w-full ${className}`}
      style={{ minHeight: `${Math.min(height, 400)}px` }}
    >
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height={height}
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title={title}
        style={{
          border: 'none',
          width: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
