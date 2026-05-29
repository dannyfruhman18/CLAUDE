import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { SmokeField, Embers, SideGlow } from "../components/Backdrops";
import { cinzel, oswald } from "../fonts";
import { theme } from "../theme";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const titleP = interpolate(frame, [10, 55], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineW = interpolate(frame, [40, 75], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subP = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Slow push-in on the whole scene.
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.16]);
  const outFade = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 1],
  );

  return (
    <SceneFrame
      vignette={0.85}
      background={
        <>
          <SmokeField tint="#2e2620" />
          <SideGlow color="rgba(124,31,31,0.4)" from="right" />
          <Embers count={26} />
        </>
      }
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale})`,
          opacity: outFade,
        }}
      >
        <div
          style={{
            fontFamily: oswald,
            color: theme.sepia,
            letterSpacing: 14,
            fontSize: 30,
            fontWeight: 400,
            opacity: titleP,
            marginBottom: 18,
          }}
        >
          1914 — 1918
        </div>

        <div
          style={{
            fontFamily: cinzel,
            color: theme.paper,
            fontWeight: 900,
            fontSize: 130,
            lineHeight: 1,
            textAlign: "center",
            textShadow: "0 6px 30px rgba(0,0,0,0.7)",
            opacity: titleP,
            transform: `translateY(${interpolate(titleP, [0, 1], [40, 0])}px)`,
          }}
        >
          THE GREAT WAR
        </div>

        <div
          style={{
            width: interpolate(lineW, [0, 1], [0, 520]),
            height: 2,
            backgroundColor: theme.sepia,
            margin: "30px 0",
            opacity: 0.8,
          }}
        />

        <div
          style={{
            fontFamily: oswald,
            color: theme.faded,
            fontWeight: 300,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: subP,
          }}
        >
          A War That Reshaped the World
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
