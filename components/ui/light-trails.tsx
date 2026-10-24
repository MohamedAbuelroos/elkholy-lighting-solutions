import { useId } from "react";

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

const layers = [
  { width: 8, opacity: 0.035 },
  { width: 3, opacity: 0.08 },
  { width: 0.8, opacity: 0.2 },
] as const;

export function LightTrails({
  variant = "flow",
  className = "",
}: LightTrailsProps) {
  const gradientId = `trail-${useId().replace(/:/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ color: "var(--primary)" }}
    >
      <svg
        viewBox="0 0 1200 500"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        fill="none"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="1200"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />

            <stop offset="18%" stopColor="currentColor" stopOpacity="0.8" />

            <stop offset="75%" stopColor="currentColor" stopOpacity="1" />

            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {layers.map((layer) => (
          <g
            key={layer.width}
            opacity={layer.opacity}
            stroke={`url(#${gradientId})`}
            strokeWidth={layer.width}
            strokeLinecap="round"
          >
            {paths[variant].map((path) => (
              <path key={path} d={path} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
