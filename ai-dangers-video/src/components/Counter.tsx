import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";

export const Counter: React.FC<{
  to: number;
  startFrame?: number;
  duration?: number;
  style?: React.CSSProperties;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
}> = ({ to, startFrame = 0, duration = 60, style, prefix = "", suffix = "", separator = true }) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, startFrame + duration], [0, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rounded = Math.round(value);
  const formatted = separator ? rounded.toLocaleString("en-US") : String(rounded);
  return (
    <span style={style}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
