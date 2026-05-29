import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";

// A line of text that rises and fades in. `delay` offsets the start.
export const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, duration = 25, distance = 30, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Reveals each word one after another (good for headlines / quotes).
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  perWord?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}> = ({ text, delay = 0, perWord = 6, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
      {words.map((w, i) => {
        const start = delay + i * perWord;
        const p = interpolate(frame, [start, start + 18], [0, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.28em",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
              ...wordStyle,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
