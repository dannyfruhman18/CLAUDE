import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { EuropeMap, SmokeField } from "../components/Backdrops";
import { FadeUp } from "../components/AnimatedText";
import { cinzel, oswald, garamond } from "../fonts";
import { theme } from "../theme";

export const OutbreakScene: React.FC = () => {
  const frame = useCurrentFrame();
  const mapP = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame
      vignette={0.8}
      background={
        <>
          <SmokeField tint="#241d18" />
          <EuropeMap progress={mapP} />
        </>
      }
    >
      <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
        <FadeUp delay={8}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.sepia,
              letterSpacing: 8,
              fontSize: 26,
              textTransform: "uppercase",
            }}
          >
            28 June 1914 · Sarajevo
          </div>
        </FadeUp>

        <FadeUp delay={20}>
          <div
            style={{
              fontFamily: cinzel,
              color: theme.paper,
              fontWeight: 700,
              fontSize: 70,
              lineHeight: 1.05,
              marginTop: 14,
              maxWidth: 1000,
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
            }}
          >
            A Single Shot
          </div>
        </FadeUp>

        <FadeUp delay={40}>
          <div
            style={{
              fontFamily: garamond,
              color: theme.paperDark,
              fontSize: 38,
              lineHeight: 1.4,
              marginTop: 26,
              maxWidth: 920,
            }}
          >
            The assassination of Archduke Franz Ferdinand of Austria-Hungary
            lit a fuse beneath a Europe already bound by rival alliances.
          </div>
        </FadeUp>

        <FadeUp delay={64}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.poppy,
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: 3,
              marginTop: 34,
            }}
          >
            Within weeks, the continent was at war.
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneFrame>
  );
};
