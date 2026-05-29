import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

const CHARS = "01アイウエオカキクケコABCDEF0123456789";

// Matrix-style cascading character columns — fully deterministic via random(seed).
export const DataRain: React.FC<{
  columns?: number;
  opacity?: number;
  color?: string;
  speed?: number;
}> = ({ columns = 18, opacity = 0.22, color = "#00d4ff", speed = 0.6 }) => {
  const frame = useCurrentFrame();
  const cols = new Array(columns).fill(0).map((_, ci) => {
    const x = (ci / columns) * 100;
    const startOffset = random(`rs-${ci}`) * 80;
    const length = 5 + Math.floor(random(`rl-${ci}`) * 10);
    const charSpeed = speed * (0.7 + random(`rspd-${ci}`) * 0.6);
    return { x, startOffset, length, charSpeed };
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, overflow: "hidden" }}>
      {cols.map((col, ci) => {
        return new Array(col.length).fill(0).map((_, ri) => {
          const pos = ((frame * col.charSpeed + col.startOffset + ri * 22) % 110) - 10;
          const charIdx = Math.floor(random(`rc-${ci}-${ri}-${Math.floor(frame / 4)}`) * CHARS.length);
          const charOpacity = 1 - ri / col.length;
          return (
            <div
              key={`${ci}-${ri}`}
              style={{
                position: "absolute",
                left: `${col.x}%`,
                top: `${pos}%`,
                color: ri === 0 ? "#ffffff" : color,
                fontSize: 14,
                fontFamily: "monospace",
                opacity: charOpacity,
                textShadow: `0 0 6px ${color}`,
                lineHeight: 1,
              }}
            >
              {CHARS[charIdx]}
            </div>
          );
        });
      })}
    </AbsoluteFill>
  );
};
