import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";

// Counts up to `to` between frames [from, from+duration], with thousands
// separators. Used for casualty / scale statistics.
export const Counter: React.FC<{
  to: number;
  from?: number;
  duration?: number;
  style?: React.CSSProperties;
  prefix?: string;
  suffix?: string;
}> = ({ to, from = 0, duration = 50, style, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [from, from + duration], [0, to], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString("en-US");
  return (
    <span style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
