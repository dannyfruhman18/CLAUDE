import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { SmokeField } from "../components/Backdrops";
import { FadeUp } from "../components/AnimatedText";
import { cinzel, oswald, garamond } from "../fonts";
import { theme } from "../theme";

const Side: React.FC<{
  title: string;
  members: string[];
  color: string;
  delay: number;
  align: "left" | "right";
}> = ({ title, members, color, delay, align }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 25], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dx = align === "left" ? -60 : 60;
  return (
    <div
      style={{
        flex: 1,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [dx, 0])}px)`,
        textAlign: align,
        padding: "0 50px",
      }}
    >
      <div
        style={{
          fontFamily: cinzel,
          color,
          fontWeight: 700,
          fontSize: 46,
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      {members.map((m, i) => (
        <div
          key={i}
          style={{
            fontFamily: garamond,
            color: theme.paperDark,
            fontSize: 34,
            lineHeight: 1.5,
          }}
        >
          {m}
        </div>
      ))}
    </div>
  );
};

export const AlliancesScene: React.FC = () => {
  return (
    <SceneFrame vignette={0.8} background={<SmokeField tint="#241d18" />}>
      <AbsoluteFill style={{ padding: 70, justifyContent: "center" }}>
        <FadeUp delay={6} style={{ textAlign: "center", marginBottom: 50 }}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.sepia,
              letterSpacing: 8,
              fontSize: 26,
              textTransform: "uppercase",
            }}
          >
            Two Armed Camps
          </div>
        </FadeUp>

        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Side
            title="The Allies"
            color={theme.paper}
            delay={24}
            align="left"
            members={[
              "France",
              "British Empire",
              "Russia",
              "Italy (1915)",
              "United States (1917)",
            ]}
          />
          <div
            style={{
              width: 2,
              alignSelf: "stretch",
              backgroundColor: theme.faded,
              opacity: 0.4,
            }}
          />
          <Side
            title="Central Powers"
            color={theme.poppy}
            delay={40}
            align="right"
            members={[
              "Germany",
              "Austria-Hungary",
              "Ottoman Empire",
              "Bulgaria",
            ]}
          />
        </div>

        <FadeUp delay={64} style={{ textAlign: "center", marginTop: 54 }}>
          <div
            style={{
              fontFamily: garamond,
              color: theme.paperDark,
              fontSize: 32,
              fontStyle: "italic",
            }}
          >
            Tangled treaties turned a regional crisis into a global catastrophe.
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneFrame>
  );
};
