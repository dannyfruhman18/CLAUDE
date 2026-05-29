import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { SmokeField } from "../components/Backdrops";
import { FadeUp } from "../components/AnimatedText";
import { cinzel, oswald, garamond, typewriter } from "../fonts";
import { theme } from "../theme";

export const ArmisticeScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Dawn breaks: background brightens as peace arrives.
  const dawn = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame
      vignette={interpolate(dawn, [0, 1], [0.85, 0.6])}
      grain={interpolate(dawn, [0, 1], [0.09, 0.05])}
      background={
        <>
          <SmokeField tint="#2a2a22" />
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 50% 120%, rgba(201,162,39,0.4) 0%, rgba(0,0,0,0) 60%)",
              opacity: dawn,
            }}
          />
        </>
      }
    >
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
      >
        <FadeUp delay={6}>
          <div
            style={{
              fontFamily: typewriter,
              color: theme.sepia,
              fontSize: 30,
              letterSpacing: 2,
              textAlign: "center",
            }}
          >
            11ᵗʰ hour · 11ᵗʰ day · 11ᵗʰ month
          </div>
        </FadeUp>

        <FadeUp delay={26}>
          <div
            style={{
              fontFamily: cinzel,
              color: theme.paper,
              fontWeight: 900,
              fontSize: 120,
              marginTop: 18,
              textShadow: "0 6px 30px rgba(0,0,0,0.6)",
            }}
          >
            ARMISTICE
          </div>
        </FadeUp>

        <FadeUp delay={48}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.faded,
              fontSize: 32,
              letterSpacing: 6,
              marginTop: 10,
              textTransform: "uppercase",
            }}
          >
            11 November 1918
          </div>
        </FadeUp>

        <FadeUp delay={68}>
          <div
            style={{
              fontFamily: garamond,
              color: theme.paperDark,
              fontSize: 38,
              fontStyle: "italic",
              marginTop: 40,
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            After four years, the guns fell silent on the Western Front.
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneFrame>
  );
};
