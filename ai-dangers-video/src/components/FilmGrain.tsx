import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

export const FilmGrain: React.FC<{ opacity?: number; count?: number }> = ({
  opacity = 0.05,
  count = 70,
}) => {
  const frame = useCurrentFrame();
  const specks = new Array(count).fill(0).map((_, i) => {
    const seed = `${i}-${frame % 5}`;
    return {
      left: random(`x${seed}`) * 100,
      top: random(`y${seed}`) * 100,
      size: 0.4 + random(`s${seed}`) * 1.5,
      o: 0.15 + random(`o${seed}`) * 0.7,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {specks.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            backgroundColor: i % 5 === 0 ? "#000" : "#fff",
            opacity: s.o,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
