import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { TrenchHorizon, SmokeField, SideGlow, Embers } from "../components/Backdrops";
import { FadeUp, WordReveal } from "../components/AnimatedText";
import { cinzel, oswald, garamond } from "../fonts";
import { theme } from "../theme";

export const TrenchScene: React.FC = () => {
  const frame = useCurrentFrame();
  // faint flashes of distant artillery
  const flash = Math.max(
    0,
    Math.sin(frame / 7) * Math.sin(frame / 13),
  );
  const flashO = interpolate(flash, [0.4, 1], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame
      vignette={0.9}
      grain={0.09}
      background={
        <>
          <SmokeField tint="#2a221b" />
          <TrenchHorizon />
          <SideGlow color="rgba(124,31,31,0.5)" from="left" />
          <Embers count={34} color={theme.sepia} />
          <AbsoluteFill style={{ backgroundColor: "#ff9a3c", opacity: flashO }} />
        </>
      }
    >
      <AbsoluteFill style={{ padding: 90, justifyContent: "flex-start", paddingTop: 90 }}>
        <FadeUp delay={6}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.sepia,
              letterSpacing: 8,
              fontSize: 26,
              textTransform: "uppercase",
            }}
          >
            The Western Front
          </div>
        </FadeUp>

        <WordReveal
          text="Trench Warfare"
          delay={22}
          perWord={8}
          style={{ marginTop: 12 }}
          wordStyle={{
            fontFamily: cinzel,
            color: theme.paper,
            fontWeight: 700,
            fontSize: 76,
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        />

        <FadeUp delay={50}>
          <div
            style={{
              fontFamily: garamond,
              color: theme.paperDark,
              fontSize: 37,
              lineHeight: 1.4,
              marginTop: 24,
              maxWidth: 880,
            }}
          >
            Soldiers dug in along 700 kilometres of trenches. Mud, machine guns
            and barbed wire turned movement into slaughter — sometimes for a few
            metres of ground.
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneFrame>
  );
};
