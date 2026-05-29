import React from "react";
import { useCurrentFrame, random } from "remotion";

const GLITCH_CHARS = "!@#$%^&*<>?/\\|[]{}01";

// Renders text with occasional character scrambles on specific frames.
// Fully deterministic — driven by frame number, no side effects.
export const GlitchText: React.FC<{
  text: string;
  intensity?: number; // 0-1: how often characters glitch
  style?: React.CSSProperties;
}> = ({ text, intensity = 0.3, style }) => {
  const frame = useCurrentFrame();
  const glitchActive = random(`gactive-${Math.floor(frame / 3)}`) < 0.35;

  const chars = text.split("").map((char, i) => {
    if (char === " ") return char;
    if (!glitchActive) return char;
    const r = random(`gc-${i}-${Math.floor(frame / 2)}`);
    if (r < intensity * 0.4) {
      const idx = Math.floor(random(`gi-${i}-${frame}`) * GLITCH_CHARS.length);
      return GLITCH_CHARS[idx];
    }
    return char;
  });

  return (
    <span style={{ display: "inline-block", ...style }}>
      {chars.map((c, i) => {
        const isGlitched = glitchActive && c !== text[i] && c !== " ";
        return (
          <span
            key={i}
            style={{
              color: isGlitched ? "#ff2d2d" : undefined,
              textShadow: isGlitched ? "0 0 8px #ff2d2d" : undefined,
              display: "inline-block",
              width: c === " " ? "0.3em" : undefined,
            }}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
};
