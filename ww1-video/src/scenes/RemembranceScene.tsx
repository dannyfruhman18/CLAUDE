import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { Poppy } from "../components/Poppy";
import { FadeUp } from "../components/AnimatedText";
import { cinzel, garamond, oswald } from "../fonts";
import { theme } from "../theme";

export const RemembranceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Field of poppies rising in a staggered row.
  const poppies = new Array(7).fill(0);

  const outFade = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <SceneFrame vignette={0.8} grain={0.05} background={null}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: outFade,
        }}
      >
        <FadeUp delay={10}>
          <div
            style={{
              fontFamily: cinzel,
              color: theme.paper,
              fontWeight: 700,
              fontSize: 64,
              textAlign: "center",
              textShadow: "0 4px 20px rgba(0,0,0,0.7)",
            }}
          >
            Lest We Forget
          </div>
        </FadeUp>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            marginTop: 50,
            marginBottom: 44,
          }}
        >
          {poppies.map((_, i) => (
            <Poppy key={i} size={90} delay={20 + i * 7} />
          ))}
        </div>

        <FadeUp delay={70}>
          <div
            style={{
              fontFamily: garamond,
              color: theme.paperDark,
              fontSize: 34,
              fontStyle: "italic",
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.5,
            }}
          >
            “In Flanders fields the poppies blow
            <br />
            Between the crosses, row on row…”
          </div>
        </FadeUp>

        <FadeUp delay={96}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.faded,
              fontSize: 22,
              letterSpacing: 4,
              marginTop: 30,
              textTransform: "uppercase",
            }}
          >
            In Memory of the Fallen · 1914 – 1918
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneFrame>
  );
};
