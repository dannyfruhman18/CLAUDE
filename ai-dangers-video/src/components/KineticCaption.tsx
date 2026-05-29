import React from "react";
import { interpolate, Easing, useCurrentFrame } from "remotion";
import { oswald } from "../fonts";
import { theme } from "../theme";

export interface CaptionSegment {
  text: string;
  startFrame: number;
  durationInFrames: number;
  accent?: boolean; // if true, first word is highlighted red
}

// Renders one caption segment: words pop in one-by-one, then the segment holds.
const Segment: React.FC<CaptionSegment> = ({ text, startFrame, durationInFrames, accent }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const perWord = Math.min(8, Math.floor((durationInFrames * 0.6) / words.length));

  const segFade = interpolate(
    frame,
    [startFrame + durationInFrames - 10, startFrame + durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (frame < startFrame || frame >= startFrame + durationInFrames) return null;

  return (
    <div style={{ opacity: segFade, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.2em" }}>
      {words.map((word, i) => {
        const wStart = startFrame + i * perWord;
        const p = interpolate(frame, [wStart, wStart + 12], [0, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isAccented = accent && i === 0;
        return (
          <span
            key={i}
            style={{
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
              display: "inline-block",
              color: isAccented ? theme.red : theme.white,
              textShadow: isAccented ? `0 0 20px ${theme.red}` : "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Container that shows one segment at a time over an absolute-fill area.
export const KineticCaption: React.FC<{
  segments: CaptionSegment[];
  style?: React.CSSProperties;
}> = ({ segments, style }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        bottom: 160,
        textAlign: "center",
        fontFamily: oswald,
        fontWeight: 400,
        fontSize: 52,
        lineHeight: 1.15,
        letterSpacing: 1,
        ...style,
      }}
    >
      {segments.map((seg, i) => (
        <Segment key={i} {...seg} />
      ))}
    </div>
  );
};
