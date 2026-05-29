import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
} from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { Vignette } from "../components/Vignette";
import { ScanLines } from "../components/ScanLines";
import { GlitchText } from "../components/GlitchText";
import { KineticCaption } from "../components/KineticCaption";
import { bebas, oswald } from "../fonts";
import { theme } from "../theme";

// Escalation: 38-50s — autonomous weapons
const CAPTIONS = [
  { text: "Autonomous weapons", startFrame: 10, durationInFrames: 65, accent: false },
  { text: "select and ELIMINATE targets", startFrame: 73, durationInFrames: 75, accent: true },
  { text: "without human approval.", startFrame: 146, durationInFrames: 65, accent: false },
  { text: "They call it 'efficiency.'", startFrame: 209, durationInFrames: 65, accent: false },
  { text: "Others call it murder by algorithm.", startFrame: 272, durationInFrames: 80, accent: true },
];

// Minimal SVG drone silhouette (no real faces/people)
const DroneSilhouette: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const hover = Math.sin(frame / 20) * 6;
  return (
    <g transform={`translate(0, ${hover})`} opacity={opacity}>
      {/* Body */}
      <ellipse cx={540} cy={580} rx={60} ry={22} fill={theme.redDim} />
      {/* Arms */}
      <rect x={400} y={576} width={140} height={8} rx={4} fill={theme.redDim} />
      <rect x={540} y={576} width={140} height={8} rx={4} fill={theme.redDim} />
      {/* Propellers */}
      {[420, 660].map((cx, i) => (
        <g key={i}>
          <ellipse cx={cx} cy={572} rx={36} ry={5} fill="none" stroke={theme.red} strokeWidth={2} opacity={0.6} />
          <circle cx={cx} cy={572} r={5} fill={theme.red} />
        </g>
      ))}
      {/* Camera eye */}
      <circle cx={540} cy={602} r={12} fill="none" stroke={theme.red} strokeWidth={2} />
      <circle cx={540} cy={602} r={5} fill={theme.red} opacity={0.8} />
      {/* Targeting reticle below */}
      <circle cx={540} cy={720} r={50} fill="none" stroke={theme.red} strokeWidth={1.5} opacity={0.4} />
      <line x1={540} y1={670} x2={540} y2={690} stroke={theme.red} strokeWidth={1.5} opacity={0.4} />
      <line x1={540} y1={750} x2={540} y2={770} stroke={theme.red} strokeWidth={1.5} opacity={0.4} />
      <line x1={490} y1={720} x2={510} y2={720} stroke={theme.red} strokeWidth={1.5} opacity={0.4} />
      <line x1={570} y1={720} x2={590} y2={720} stroke={theme.red} strokeWidth={1.5} opacity={0.4} />
    </g>
  );
};

export const EscalationScene: React.FC = () => {
  const frame = useCurrentFrame();

  const droneP = interpolate(frame, [20, 60], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Occasional red-screen pulse for "eliminate"
  const elimFlash = interpolate(frame, [73, 83], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const elimFadeOut = interpolate(frame, [83, 105], [0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0005", overflow: "hidden" }}>
      {/* Subtle red background glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%, rgba(139,0,0,0.25) 0%, transparent 65%)`,
        }}
      />

      {/* Red flash */}
      <AbsoluteFill
        style={{
          backgroundColor: theme.red,
          opacity: Math.max(elimFlash, elimFadeOut),
          pointerEvents: "none",
        }}
      />

      {/* Drone SVG */}
      <AbsoluteFill style={{ opacity: droneP }}>
        <svg
          viewBox="0 0 1080 1920"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", inset: 0 }}
        >
          <DroneSilhouette opacity={1} frame={frame} />
          {/* Grid lines behind drone for depth */}
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={0} y1={620 + i * 50}
              x2={1080} y2={620 + i * 50}
              stroke={theme.red}
              strokeWidth={0.5}
              opacity={0.06}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* "AUTONOMOUS" top label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 50,
          right: 50,
          opacity: droneP,
        }}
      >
        <div
          style={{
            fontFamily: oswald,
            color: theme.red,
            fontSize: 22,
            letterSpacing: 8,
          }}
        >
          LETHAL AUTONOMOUS WEAPONS
        </div>
        <div
          style={{
            width: 180,
            height: 1,
            backgroundColor: theme.red,
            marginTop: 8,
            opacity: 0.5,
          }}
        />
      </div>

      {/* "MURDER BY ALGORITHM" — big reveal */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 50,
          right: 50,
          opacity: interpolate(frame, [272, 300], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: bebas,
            fontSize: 72,
            color: theme.red,
            letterSpacing: 4,
            textShadow: `0 0 30px ${theme.red}`,
          }}
        >
          <GlitchText text="MURDER BY ALGORITHM" intensity={0.35} />
        </div>
      </div>

      <KineticCaption segments={CAPTIONS} />
      <ScanLines opacity={0.06} />
      <Vignette strength={0.9} />
      <FilmGrain opacity={0.07} />
    </AbsoluteFill>
  );
};
