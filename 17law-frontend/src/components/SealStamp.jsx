import { useEffect, useState } from "react";

// A circular "official seal" that stamps down onto the page.
// color is driven by pass/fail so the same signature element carries meaning.
export default function SealStamp({ passed, label }) {
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLanded(true), 40);
    return () => clearTimeout(id);
  }, []);

  const ringColor = passed ? "var(--sage)" : "var(--wax)";

  return (
    <div
      style={{
        display: "inline-block",
        transform: landed
          ? "scale(1) rotate(-8deg)"
          : "scale(2.4) rotate(-20deg)",
        opacity: landed ? 1 : 0,
        transition:
          "transform 0.55s cubic-bezier(.2,1.4,.4,1), opacity 0.3s ease",
      }}
    >
      <svg width="148" height="148" viewBox="0 0 148 148" fill="none">
        <circle
          cx="74"
          cy="74"
          r="68"
          stroke={ringColor}
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="74"
          cy="74"
          r="58"
          stroke={ringColor}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path id="sealArcTop" d="M 20 74 A 54 54 0 0 1 128 74" fill="none" />
        <text
          fontFamily="IBM Plex Mono, monospace"
          fontSize="10.5"
          letterSpacing="3"
          fill={ringColor}
        >
          <textPath href="#sealArcTop" startOffset="50%" textAnchor="middle">
            17 LAW · CERTIFIED
          </textPath>
        </text>
        <text
          x="74"
          y="82"
          textAnchor="middle"
          fontFamily="Spectral, serif"
          fontWeight="600"
          fontSize="30"
          fill={ringColor}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
