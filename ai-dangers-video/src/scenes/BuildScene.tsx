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
import { NeuralNet } from "../components/NeuralNet";
import { KineticCaption } from "../components/KineticCaption";
import { bebas, oswald } from "../fonts";
import { theme } from "../theme";

// Build: 9-22s — AI is embedded everywhere
const CAPTIONS = [
  { text: "Artificial intelligence", startFrame: 10, durationInFrames: 60, accent: false },
  { text: "is no longer science fiction.", startFrame: 68, durationInFrames: 75, accent: false },
  { text: "It's in courtrooms.", startFrame: 145, durationInFrames: 55, accent: true },
  { text: "Hospitals. Banks. Militaries.", startFrame: 198, durationInFrames: 75, accent: true },
  { text: "Making decisions.", startFrame: 271, durationInFrames: 55, accent: false },
  { text: "At scale. Without oversight.", startFrame: 324, durationInFrames: 70, accent: false },
];

const locations = [
  "COURTS", "HOSPITALS", "BANKS", "MILITARY", "HIRING", "POLICING",
  "CREDIT", "BORDERS", "SCHOOLS", "PRISONS",
];

export const BuildScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleP = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Neural net background */}
      <NeuralNet opacity={0.5} />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 50,
          right: 50,
          opacity: titleP,
        }}
      >
        <div
          style={{
            fontFamily: oswald,
            color: theme.blue,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          CURRENT DEPLOYMENT
        </div>
        <div
          style={{
            width: 200,
            height: 1,
            backgroundColor: theme.blue,
            marginTop: 8,
            opacity: 0.5,
          }}
        />
      </div>

      {/* Location tags cascading in */}
      <AbsoluteFill
        style={{ padding: "180px 50px 300px", justifyContent: "center", alignItems: "flex-start" }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 16px", maxWidth: 980 }}>
          {locations.map((loc, i) => {
            const appear = interpolate(frame, [20 + i * 18, 40 + i * 18], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={loc}
                style={{
                  opacity: appear,
                  transform: `translateY(${interpolate(appear, [0, 1], [20, 0])}px)`,
                  fontFamily: bebas,
                  fontSize: 42,
                  color: i % 3 === 0 ? theme.blue : i % 3 === 1 ? theme.white : theme.faded,
                  letterSpacing: 4,
                  borderLeft: `2px solid ${i % 3 === 0 ? theme.blue : "transparent"}`,
                  paddingLeft: i % 3 === 0 ? 14 : 0,
                }}
              >
                {loc}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <KineticCaption segments={CAPTIONS} />
      <ScanLines opacity={0.04} />
      <Vignette strength={0.8} />
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
