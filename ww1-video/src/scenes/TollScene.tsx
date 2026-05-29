import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { SmokeField } from "../components/Backdrops";
import { Counter } from "../components/Counter";
import { FadeUp } from "../components/AnimatedText";
import { cinzel, oswald, garamond } from "../fonts";
import { theme } from "../theme";

const Stat: React.FC<{
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}> = ({ value, label, suffix, delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 20], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        textAlign: "center",
        flex: 1,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: oswald,
          color: theme.poppy,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1,
          textShadow: "0 4px 18px rgba(0,0,0,0.6)",
        }}
      >
        <Counter to={value} from={delay + 4} duration={48} suffix={suffix} />
      </div>
      <div
        style={{
          fontFamily: garamond,
          color: theme.paperDark,
          fontSize: 30,
          marginTop: 14,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const TollScene: React.FC = () => {
  return (
    <SceneFrame vignette={0.88} background={<SmokeField tint="#1f1813" />}>
      <AbsoluteFill style={{ padding: 80, justifyContent: "center" }}>
        <FadeUp delay={6} style={{ textAlign: "center", marginBottom: 70 }}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.sepia,
              letterSpacing: 8,
              fontSize: 26,
              textTransform: "uppercase",
            }}
          >
            The Human Cost
          </div>
          <div
            style={{
              fontFamily: cinzel,
              color: theme.paper,
              fontWeight: 900,
              fontSize: 58,
              marginTop: 10,
            }}
          >
            A Generation Lost
          </div>
        </FadeUp>

        <div style={{ display: "flex", gap: 30 }}>
          <Stat value={65} suffix="M" label="Soldiers mobilised" delay={30} />
          <Stat value={20} suffix="M" label="Lives lost" delay={48} />
          <Stat value={21} suffix="M" label="Wounded" delay={66} />
        </div>

        <FadeUp delay={92} style={{ textAlign: "center", marginTop: 70 }}>
          <div
            style={{
              fontFamily: garamond,
              color: theme.faded,
              fontSize: 30,
              fontStyle: "italic",
            }}
          >
            Soldiers and civilians alike — across every continent.
          </div>
        </FadeUp>
      </AbsoluteFill>
    </SceneFrame>
  );
};
