import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// A slow-scrolling horizontal scan-line overlay — gives a CRT / surveillance camera feel.
export const ScanLines: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 2) % 4;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          rgba(0,0,0,0.6) 0px,
          rgba(0,0,0,0.6) 1px,
          transparent 1px,
          transparent 4px
        )`,
        backgroundPositionY: offset,
      }}
    />
  );
};

// A single scanner beam that sweeps top to bottom.
export const ScanBeam: React.FC<{ color?: string; opacity?: number }> = ({
  color = "#00d4ff",
  opacity = 0.12,
}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame % 60, [0, 60], [0, 100]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${y}%`,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
    </AbsoluteFill>
  );
};
