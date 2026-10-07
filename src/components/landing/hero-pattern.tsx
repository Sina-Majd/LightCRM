import React from "react";

/**
 * Hero background: concentric "orbit" rings radiating from a light source
 * above the page, with fine dial ticks, rays and a small constellation of
 * customer nodes joined by curved edges. Fully deterministic (SSR safe).
 */

const CX = 720;
const CY = -70;

const RINGS = [150, 235, 330, 440, 560, 690, 830, 980, 1140, 1310];

// [ringIndex, angleDeg (0 = right, 90 = straight down), size, tone]
type NodeSpec = [number, number, number, "blue" | "gold" | "navy"];
const NODES: NodeSpec[] = [
  [1, 62, 5, "blue"],
  [1, 128, 4, "navy"],
  [2, 44, 4, "navy"],
  [2, 102, 6, "gold"],
  [3, 28, 5, "blue"],
  [3, 76, 4, "navy"],
  [3, 150, 5, "blue"],
  [4, 52, 6, "blue"],
  [4, 118, 4, "gold"],
  [5, 36, 4, "navy"],
  [5, 92, 5, "blue"],
  [5, 140, 6, "blue"],
  [6, 22, 5, "gold"],
  [6, 66, 4, "navy"],
  [6, 112, 5, "blue"],
  [6, 158, 4, "navy"],
  [7, 48, 5, "blue"],
  [7, 84, 4, "navy"],
  [7, 132, 6, "blue"],
  [8, 30, 4, "navy"],
  [8, 100, 5, "gold"],
  [8, 148, 5, "blue"],
];

// Pairs of node indices joined by a curved edge.
const EDGES: [number, number][] = [
  [0, 3],
  [3, 7],
  [7, 10],
  [10, 14],
  [2, 5],
  [5, 9],
  [4, 8],
  [8, 11],
  [11, 15],
  [6, 12],
  [14, 18],
  [10, 17],
  [13, 17],
  [17, 20],
];

const TONES = {
  blue: { fill: "#3b6be0", halo: "rgba(59,107,224,0.28)" },
  navy: { fill: "#16275c", halo: "rgba(22,39,92,0.07)" },
  gold: { fill: "#ffc94a", halo: "rgba(255,201,74,0.45)" },
} as const;

function pos([ring, angle]: NodeSpec) {
  const r = RINGS[ring];
  const a = (angle * Math.PI) / 180;
  return { x: +(CX + r * Math.cos(a)).toFixed(1), y: +(CY + r * Math.sin(a)).toFixed(1) };
}

const POINTS = NODES.map(pos);

const RAYS = Array.from({ length: 25 }, (_, i) => 12 + i * 6.25); // degrees

export function HeroPattern() {
  return (
    <div aria-hidden="true" className="lp-hero-pattern pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 1500"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <radialGradient id="lp-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#ffc94a" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#ffc94a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lp-fade" cx="720" cy="-70" r="1450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="lp-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="1500">
            <rect width="1440" height="1500" fill="url(#lp-fade)" />
          </mask>
          <linearGradient id="lp-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b6be0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffc94a" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* light source */}
        <circle cx={CX} cy={CY} r="560" fill="url(#lp-sun)" />

        <g mask="url(#lp-mask)">
          {/* rays */}
          <g stroke="#2149a8" strokeWidth="1" opacity="0.1">
            {RAYS.map((deg) => {
              const a = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={CX + 90 * Math.cos(a)}
                  y1={CY + 90 * Math.sin(a)}
                  x2={CX + 1500 * Math.cos(a)}
                  y2={CY + 1500 * Math.sin(a)}
                />
              );
            })}
          </g>

          {/* solid rings */}
          <g stroke="#2149a8" fill="none">
            {RINGS.map((r, i) => (
              <circle key={r} cx={CX} cy={CY} r={r} strokeWidth="1" opacity={0.2 - i * 0.012} />
            ))}
          </g>

          {/* dial ticks */}
          <g className="lp-orbit lp-orbit-slow" stroke="#16275c" fill="none">
            <circle cx={CX} cy={CY} r="392" strokeWidth="9" strokeDasharray="1.2 11" opacity="0.28" />
            <circle cx={CX} cy={CY} r="760" strokeWidth="9" strokeDasharray="1.2 15" opacity="0.2" />
            <circle cx={CX} cy={CY} r="1070" strokeWidth="9" strokeDasharray="1.2 20" opacity="0.14" />
          </g>

          {/* dashed orbiting rings */}
          <g className="lp-orbit" stroke="#3b6be0" fill="none" strokeLinecap="round">
            <circle cx={CX} cy={CY} r="285" strokeWidth="1.6" strokeDasharray="46 22" opacity="0.5" />
            <circle cx={CX} cy={CY} r="625" strokeWidth="1.6" strokeDasharray="90 40 10 40" opacity="0.4" />
          </g>
          <g className="lp-orbit lp-orbit-reverse" stroke="#ffc94a" fill="none" strokeLinecap="round">
            <circle cx={CX} cy={CY} r="500" strokeWidth="2" strokeDasharray="6 26" opacity="0.8" />
            <circle cx={CX} cy={CY} r="905" strokeWidth="2" strokeDasharray="4 34" opacity="0.7" />
          </g>

          {/* edges */}
          <g stroke="url(#lp-edge)" strokeWidth="1.3" fill="none" opacity="0.7">
            {EDGES.map(([a, b]) => {
              const p = POINTS[a];
              const q = POINTS[b];
              const mx = (p.x + q.x) / 2;
              const my = (p.y + q.y) / 2;
              // pull the control point toward the light source for a gentle arc
              const cx = mx + (CX - mx) * 0.22;
              const cy = my + (CY - my) * 0.22;
              return <path key={`${a}-${b}`} d={`M${p.x} ${p.y} Q${cx} ${cy} ${q.x} ${q.y}`} />;
            })}
          </g>

          {/* nodes */}
          <g>
            {NODES.map((n, i) => {
              const p = POINTS[i];
              const t = TONES[n[3]];
              return (
                <g key={i} className="lp-node" style={{ animationDelay: `${(i % 7) * 0.45}s` }}>
                  <circle cx={p.x} cy={p.y} r={n[2] * 3.2} fill={t.halo} />
                  <circle cx={p.x} cy={p.y} r={n[2]} fill={t.fill} />
                  <circle cx={p.x} cy={p.y} r={n[2] * 0.4} fill="#fff" opacity="0.85" />
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* fine grain of crosses for depth */}
      <div className="lp-crosses absolute inset-0" />
    </div>
  );
}
