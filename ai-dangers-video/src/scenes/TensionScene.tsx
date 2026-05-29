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
import { DataRain } from "../components/DataRain";
import { KineticCaption } from "../components/KineticCaption";
import { Counter } from "../components/Counter";
import { bebas, oswald, garamond } from "../fonts";
import { theme } from "../theme";

// Tension: 22-38s — the hiring tool that rejected 200k candidates
const CAPTIONS = [
  { text: "In 2023,", startFrame: 10, durationInFrames: 50, accent: false },
  { text: "an AI hiring tool REJECTED", startFrame: 58, durationInFrames: 70, accent: true },
  { text: "200,000 qualified candidates.", startFrame: 126, durationInFrames: 80, accent: false },
  { text: "Not for their skills —", startFrame: 204, durationInFrames: 65, accent: false },
  { text: "but for patterns it couldn't explain.", startFrame: 267, durationInFrames: 80, accent: false },
  { text: "No human was accountable.", startFrame: 345, durationInFrames: 70, accent: true },
];

export const TensionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const statP = interpolate(frame, [80, 120], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const redFlash = interpolate(frame, [345, 360], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Data rain background */}
      <DataRain columns={20} opacity={0.18} color={theme.blue} />

      {/* Red flash overlay on "accountable" */}
      <AbsoluteFill style={{ backgroundColor: theme.red, opacity: redFlash, pointerEvents: "none" }} />

      {/* Central stat */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingBottom: 260,
          opacity: statP,
        }}
      >
        <div
          style={{
            fontFamily: oswald,
            color: theme.blue,
            fontSize: 22,
            letterSpacing: 8,
            marginBottom: 6,
          }}
        >
          CANDIDATES REJECTED BY ALGORITHM
        </div>

        <div
          style={{
            fontFamily: bebas,
            fontSize: 220,
            lineHeight: 0.9,
            color: theme.red,
            textShadow: `0 0 60px ${theme.red}55, 0 0 120px ${theme.red}22`,
            letterSpacing: -4,
          }}
        >
          <Counter to={200000} startFrame={100} duration={70} />
        </div>

        <div
          style={{
            fontFamily: garamond,
            fontSize: 34,
            color: theme.faded,
            fontStyle: "italic",
            marginTop: 16,
          }}
        >
          No human reviewed the decision.
        </div>
      </AbsoluteFill>

      {/* Horizontal rule */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 50,
          right: 50,
          height: 1,
          backgroundColor: theme.blue,
          opacity: 0.15 * statP,
          marginTop: -130,
        }}
      />

      <KineticCaption segments={CAPTIONS} />
      <ScanLines opacity={0.05} />
      <Vignette strength={0.88} />
      <FilmGrain opacity={0.06} />
    </AbsoluteFill>
  );
};
