import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { SceneFrame } from "../components/SceneFrame";
import { SmokeField, Embers } from "../components/Backdrops";
import { FadeUp } from "../components/AnimatedText";
import { cinzel, oswald, garamond } from "../fonts";
import { theme } from "../theme";

const items = [
  { label: "Machine Guns", note: "Fire that mowed down advancing infantry" },
  { label: "Poison Gas", note: "Chlorine & mustard — terror on the wind" },
  { label: "Tanks", note: "Armoured steel to cross the trenches" },
  { label: "Aircraft", note: "The skies became a battlefield" },
  { label: "Submarines", note: "U-boats hunting beneath the seas" },
];

const Row: React.FC<{
  label: string;
  note: string;
  index: number;
}> = ({ label, note, index }) => {
  const frame = useCurrentFrame();
  const delay = 24 + index * 12;
  const p = interpolate(frame, [delay, delay + 22], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 28,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-50, 0])}px)`,
        marginBottom: 22,
      }}
    >
      <div
        style={{
          fontFamily: oswald,
          color: theme.poppy,
          fontWeight: 700,
          fontSize: 30,
          width: 56,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          fontFamily: cinzel,
          color: theme.paper,
          fontWeight: 700,
          fontSize: 44,
          minWidth: 360,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: garamond,
          color: theme.faded,
          fontSize: 30,
          fontStyle: "italic",
        }}
      >
        {note}
      </div>
    </div>
  );
};

export const NewWeaponsScene: React.FC = () => {
  return (
    <SceneFrame
      vignette={0.82}
      background={
        <>
          <SmokeField tint="#26201a" />
          <Embers count={22} color={theme.steel} />
        </>
      }
    >
      <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
        <FadeUp delay={6}>
          <div
            style={{
              fontFamily: oswald,
              color: theme.sepia,
              letterSpacing: 8,
              fontSize: 26,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Industrial Warfare
          </div>
        </FadeUp>
        <FadeUp delay={14}>
          <div
            style={{
              fontFamily: cinzel,
              color: theme.paper,
              fontWeight: 900,
              fontSize: 58,
              marginBottom: 40,
            }}
          >
            New Weapons of a New Age
          </div>
        </FadeUp>
        {items.map((it, i) => (
          <Row key={it.label} label={it.label} note={it.note} index={i} />
        ))}
      </AbsoluteFill>
    </SceneFrame>
  );
};
