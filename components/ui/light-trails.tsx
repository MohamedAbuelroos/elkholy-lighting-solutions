
type LightTrailsProps = {
  variant?: "flow" | "arc";
  className?: string;
};

const paths = {
  flow: [
    "M -100 340 C 180 70, 380 520, 700 270 S 1080 80, 1320 230",
    "M -100 390 C 200 120, 420 560, 730 320 S 1120 130, 1320 280",
  ],
  arc: [
    "M 480 560 C 520 180, 920 20, 1320 170",
    "M 560 580 C 610 250, 970 90, 1320 230",
  ],
} as const;

export function LightTrails({
  variant = "flow",
  className = "",
}: LightTrailsProps) {
  return (
    <div
      aria-hidden="true"
      className={`light-trails pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        className="h-full w-full"
        fill="none"
      >
        {/* Wide, soft light */}
        <g className="light-trails-glow">
          {paths[variant].map((path) => (
            <path
              key={path}
              d={path}
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Fine light lines */}
        <g className="light-trails-lines">
          {paths[variant].map((path) => (
            <path
              key={path}
              d={path}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
