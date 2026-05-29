import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { Vignette } from "../components/Vignette";
import { ScanLines, ScanBeam } from "../components/ScanLines";
import { GlitchText } from "../components/GlitchText";
import { KineticCaption } from "../components/KineticCaption";
import { bebas, oswald } from "../fonts";
import { theme } from "../theme";

// Hook: 0-9s — "RIGHT NOW, AN ALGORITHM IS DECIDING..."
// Segment durations at 30fps, starting at local frame 0.
const CAPTIONS = [
  { text: "Right now,", startFrame: 15, durationInFrames: 55, accent: false },
  { text: "an ALGORITHM is deciding", startFrame: 68, durationInFrames: 75, accent: true },
  { text: "whether you get a job...", startFrame: 140, durationInFrames: 70, accent: false },
  { text: "a loan... or a prison sentence.", startFrame: 208, durationInFrames: 80, accent: false },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const bgGlow = interpolate(frame, [0, 60], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "AND IT DOESN'T HAVE TO EXPLAIN WHY" — big reveal at end of hook
  const revealP = interpolate(frame, [220, 260], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outFade = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Subtle radial blue glow in centre */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, rgba(0,212,255,${0.06 * bgGlow}) 0%, transparent 65%)`,
        }}
      />

      {/* Surveillance-camera corner brackets */}
      <AbsoluteFill style={{ opacity: 0.4 * bgGlow, pointerEvents: "none" }}>
        {(
          [
            { pos: { top: 30, left: 30 }, bt: 2, bb: 0, bl: 2, br: 0 },
            { pos: { top: 30, right: 30 }, bt: 2, bb: 0, bl: 0, br: 2 },
            { pos: { bottom: 30, left: 30 }, bt: 0, bb: 2, bl: 2, br: 0 },
            { pos: { bottom: 30, right: 30 }, bt: 0, bb: 2, bl: 0, br: 2 },
          ] as const
        ).map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...c.pos,
              width: 40,
              height: 40,
              borderColor: theme.blue,
              borderStyle: "solid",
              borderTopWidth: c.bt,
              borderBottomWidth: c.bb,
              borderLeftWidth: c.bl,
              borderRightWidth: c.br,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* REC indicator */}
      <div
        style={{
          position: "absolute",
          top: 46,
          left: 85,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: bgGlow,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: frame % 50 < 25 ? theme.red : "transparent",
            boxShadow: frame % 50 < 25 ? `0 0 8px ${theme.red}` : "none",
          }}
        />
        <span style={{ fontFamily: oswald, color: theme.faded, fontSize: 18, letterSpacing: 3 }}>REC</span>
      </div>

      {/* Giant "AI" background watermark */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.03,
          pointerEvents: "none",
        }}
      >
        <div style={{ fontFamily: bebas, fontSize: 680, color: theme.blue, lineHeight: 1 }}>AI</div>
      </AbsoluteFill>

      {/* Main text — "AND IT DOESN'T HAVE TO EXPLAIN WHY" */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "0 50px",
          opacity: outFade,
        }}
      >
        <div
          style={{
            opacity: revealP,
            transform: `scale(${interpolate(revealP, [0, 1], [0.9, 1])})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: bebas,
              fontSize: 96,
              color: theme.white,
              letterSpacing: 6,
              lineHeight: 1.1,
              textShadow: `0 0 40px rgba(0,212,255,0.3)`,
            }}
          >
            <GlitchText
              text="AND IT DOESN'T"
              intensity={0.2}
              style={{ display: "block" }}
            />
            <GlitchText
              text="HAVE TO EXPLAIN"
              intensity={0.2}
              style={{ display: "block" }}
            />
          </div>
          <div
            style={{
              fontFamily: bebas,
              fontSize: 96,
              color: theme.red,
              letterSpacing: 6,
              textShadow: `0 0 30px ${theme.red}`,
            }}
          >
            WHY.
          </div>
        </div>
      </AbsoluteFill>

      <KineticCaption segments={CAPTIONS} />

      <ScanLines opacity={0.05} />
      <ScanBeam color={theme.blue} opacity={0.08} />
      <Vignette strength={0.85} />
      <FilmGrain opacity={0.06} />
    </AbsoluteFill>
  );
};
