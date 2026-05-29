import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

// A static-but-animated film grain / dust overlay built from deterministic
// noise. Re-seeded each frame so it shimmers like old film stock.
export const FilmGrain: React.FC<{ opacity?: number; count?: number }> = ({
  opacity = 0.06,
  count = 90,
}) => {
  const frame = useCurrentFrame();
  const specks = new Array(count).fill(0).map((_, i) => {
    const seed = `${i}-${frame % 6}`;
    return {
      left: random(`x${seed}`) * 100,
      top: random(`y${seed}`) * 100,
      size: 0.5 + random(`s${seed}`) * 1.8,
      o: 0.2 + random(`o${seed}`) * 0.8,
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
            backgroundColor: i % 7 === 0 ? "#000" : "#fff",
            opacity: s.o,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Vertical scratch lines that occasionally appear, like a worn film print.
export const FilmScratches: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = new Array(3).fill(0).map((_, i) => {
    const bucket = Math.floor(frame / 8);
    const seed = `${i}-${bucket}`;
    return {
      left: random(`sx${seed}`) * 100,
      o: random(`so${seed}`) > 0.6 ? 0.12 : 0,
      w: random(`sw${seed}`) > 0.5 ? 1 : 2,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${l.left}%`,
            width: l.w,
            backgroundColor: "#000",
            opacity: l.o,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
