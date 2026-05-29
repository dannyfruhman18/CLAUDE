import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
  random,
} from "remotion";
import { theme } from "../theme";

// Slow-drifting smoke clouds for battlefield scenes.
export const SmokeField: React.FC<{ tint?: string }> = ({
  tint = "#3a322a",
}) => {
  const frame = useCurrentFrame();
  const blobs = new Array(6).fill(0).map((_, i) => ({
    x: random(`bx${i}`) * 100,
    y: 40 + random(`by${i}`) * 55,
    r: 220 + random(`br${i}`) * 260,
    drift: random(`bd${i}`) * 2 - 1,
    o: 0.18 + random(`bo${i}`) * 0.22,
  }));
  return (
    <AbsoluteFill>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${b.x + Math.sin(frame / 90 + i) * 3 * b.drift}%`,
            top: `${b.y}%`,
            width: b.r,
            height: b.r,
            marginLeft: -b.r / 2,
            marginTop: -b.r / 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tint} 0%, rgba(0,0,0,0) 70%)`,
            opacity: b.o,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// A bleak no-man's-land horizon: ground silhouette + barbed wire posts.
export const TrenchHorizon: React.FC = () => {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "38%",
          background: `linear-gradient(180deg, ${theme.smoke} 0%, #0d0a07 100%)`,
        }}
      />
      <svg
        viewBox="0 0 1280 720"
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="none"
      >
        {/* uneven ground line */}
        <path
          d="M0,470 C160,450 320,490 480,468 C640,446 800,492 960,470 C1120,452 1200,478 1280,466 L1280,720 L0,720 Z"
          fill="#0f0b08"
          opacity={0.9}
        />
        {/* barbed-wire posts */}
        {[120, 360, 640, 920, 1180].map((x, i) => (
          <g key={i} stroke="#0a0806" strokeWidth={4} opacity={0.85}>
            <line x1={x} y1={470} x2={x - 6} y2={360} />
            <line x1={x - 60} y1={400} x2={x + 60} y2={392} strokeWidth={2} />
            <line x1={x - 60} y1={420} x2={x + 60} y2={414} strokeWidth={2} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Subtle warm glow from one side, like distant fire / dawn.
export const SideGlow: React.FC<{ color?: string; from?: "left" | "right" }> = ({
  color = "rgba(124,31,31,0.35)",
  from = "right",
}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 25), [-1, 1], [0.6, 1]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at ${
          from === "right" ? "85%" : "15%"
        } 70%, ${color} 0%, rgba(0,0,0,0) 55%)`,
        opacity: pulse,
      }}
    />
  );
};

// Falling ember / ash particles drifting down.
export const Embers: React.FC<{ count?: number; color?: string }> = ({
  count = 30,
  color = theme.sepia,
}) => {
  const frame = useCurrentFrame();
  const parts = new Array(count).fill(0).map((_, i) => {
    const speed = 0.3 + random(`es${i}`) * 0.7;
    const x = random(`ex${i}`) * 100;
    const drift = Math.sin(frame / 30 + i) * 2;
    const y = (random(`ey${i}`) * 100 + frame * speed * 0.35) % 110;
    return {
      x: x + drift,
      y,
      s: 1 + random(`ez${i}`) * 2.5,
      o: 0.3 + random(`eo${i}`) * 0.5,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {parts.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: p.o,
            boxShadow: `0 0 ${p.s * 2}px ${color}`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// A faded map of Europe (very stylised) for the outbreak scene.
export const EuropeMap: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity: 0.5 }}
    >
      <svg viewBox="0 0 600 400" width="70%" height="70%">
        <g
          fill="none"
          stroke={theme.sepia}
          strokeWidth={1.5}
          opacity={interpolate(progress, [0, 1], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          })}
        >
          {/* abstract country blobs */}
          <path d="M120,150 q40,-40 90,-20 q30,30 10,70 q-50,30 -90,5 q-30,-30 -10,-55 Z" />
          <path d="M230,120 q60,-30 110,0 q20,50 -10,90 q-60,25 -100,-5 q-25,-45 0,-85 Z" />
          <path d="M350,160 q50,-20 90,10 q15,55 -25,85 q-55,15 -80,-20 q-15,-45 15,-75 Z" />
          <path d="M200,230 q50,-10 90,20 q10,45 -30,70 q-55,10 -75,-25 q-15,-40 15,-65 Z" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
