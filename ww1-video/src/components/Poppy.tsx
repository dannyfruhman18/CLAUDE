import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

// A single stylised poppy flower (the WW1 remembrance symbol), drawn with SVG.
// `delay` staggers the bloom; `grow` animates from bud to full flower.
export const Poppy: React.FC<{
  size?: number;
  delay?: number;
  sway?: boolean;
}> = ({ size = 120, delay = 0, sway = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bloom = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.8 },
  });

  const swayDeg = sway
    ? Math.sin((frame - delay) / 18) * 3
    : 0;

  const petalOpen = interpolate(bloom, [0, 1], [0.2, 1]);

  const petals = [0, 72, 144, 216, 288];

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${bloom}) rotate(${swayDeg}deg)`,
        transformOrigin: "center",
      }}
    >
      <svg viewBox="-50 -50 100 100" width={size} height={size}>
        {petals.map((deg, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={-20}
            rx={18 * petalOpen}
            ry={24}
            fill={i % 2 === 0 ? theme.poppy : theme.blood}
            transform={`rotate(${deg})`}
            opacity={0.95}
          />
        ))}
        <circle cx={0} cy={0} r={9} fill={theme.ink} />
        <circle cx={0} cy={0} r={9} fill="none" stroke={theme.smoke} strokeWidth={1} />
      </svg>
    </div>
  );
};
