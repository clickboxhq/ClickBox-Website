import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Bespoke "network core" visual — abstract enterprise security infrastructure.
// Built entirely in SVG/CSS (no raster asset) so it stays crisp at any size,
// loads instantly, and never needs cropping across breakpoints.
const NODES = [
  { x: 400, y: 90, r: 3.5 },
  { x: 620, y: 180, r: 2.5 },
  { x: 690, y: 400, r: 3 },
  { x: 610, y: 630, r: 2.5 },
  { x: 400, y: 710, r: 3.5 },
  { x: 190, y: 630, r: 2.5 },
  { x: 110, y: 400, r: 3 },
  { x: 190, y: 180, r: 2.5 },
];

const SecurityCoreVisual = () => {
  const reduced = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden"
      aria-hidden
    >
      {/* Fine schematic grid — reinforces "engineering" without competing with text */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="cb-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#BDC4C6" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cb-grid)" />
      </svg>

      {/* Core — offset toward the right/upper area, same "large focal object" role the photo used to play */}
      <div className="relative -mr-[10%] h-[130%] w-[90%] shrink-0 translate-y-[2%] opacity-90 sm:w-[75%] md:mr-[2%] md:w-[62%] lg:w-[54%]">
        <svg viewBox="0 0 800 800" className="h-full w-full">
          <defs>
            <radialGradient id="cb-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#53B5E0" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#234F66" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0D2028" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cb-ring-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#53B5E0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#BDC4C6" stopOpacity="0.15" />
            </linearGradient>
            <filter id="cb-soft-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {/* Ambient glow behind everything */}
          <circle cx="400" cy="400" r="340" fill="url(#cb-core-glow)" />

          {/* Node network — connective lines */}
          <g stroke="#BDC4C6" strokeOpacity="0.18" strokeWidth="1">
            {NODES.map((n, i) => {
              const next = NODES[(i + 1) % NODES.length];
              return <line key={`e-${n.x}-${n.y}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y} />;
            })}
            {NODES.map((n) => (
              <line key={`c-${n.x}-${n.y}`} x1={n.x} y1={n.y} x2={400} y2={400} />
            ))}
          </g>

          {/* Concentric rings */}
          <circle cx="400" cy="400" r="330" fill="none" stroke="url(#cb-ring-stroke)" strokeOpacity="0.28" strokeWidth="1" />
          <circle cx="400" cy="400" r="260" fill="none" stroke="#BDC4C6" strokeOpacity="0.16" strokeWidth="1" />
          <g className={reduced ? "" : "animate-[spin_120s_linear_infinite]"} style={{ transformOrigin: "400px 400px" }}>
            <circle
              cx="400"
              cy="400"
              r="200"
              fill="none"
              stroke="#53B5E0"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeDasharray="2 14"
            />
          </g>
          <g className={reduced ? "" : "animate-[spin_90s_linear_infinite_reverse]"} style={{ transformOrigin: "400px 400px" }}>
            <circle
              cx="400"
              cy="400"
              r="150"
              fill="none"
              stroke="#F7F3F2"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="1 10"
            />
          </g>

          {/* Rotated hex — "core infrastructure" mark */}
          <polygon
            points="400,300 486.6,350 486.6,450 400,500 313.4,450 313.4,350"
            fill="rgba(21,49,64,0.35)"
            stroke="#53B5E0"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          <polygon
            points="400,340 452,370 452,430 400,460 348,430 348,370"
            fill="rgba(83,181,224,0.12)"
            stroke="#F7F3F2"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Nodes */}
          {NODES.map((n) => (
            <circle key={`n-${n.x}-${n.y}`} cx={n.x} cy={n.y} r={n.r} fill="#F7F3F2" fillOpacity="0.65" />
          ))}
          <circle cx="400" cy="400" r="5" fill="#53B5E0" filter="url(#cb-soft-blur)" />
          <circle cx="400" cy="400" r="3" fill="#F7F3F2" />
        </svg>
      </div>
    </div>
  );
};

export default SecurityCoreVisual;
