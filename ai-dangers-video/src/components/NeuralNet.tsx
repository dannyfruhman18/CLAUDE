import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { theme } from "../theme";

// An animated SVG neural network diagram — nodes and pulsing edges.
// Fully code-generated, no external assets.
export const NeuralNet: React.FC<{ opacity?: number }> = ({ opacity = 0.7 }) => {
  const frame = useCurrentFrame();

  // 3 layers: input(4), hidden(5), output(3)
  const layers = [
    [{ x: 80, y: 160 }, { x: 80, y: 300 }, { x: 80, y: 440 }, { x: 80, y: 580 }],
    [{ x: 260, y: 120 }, { x: 260, y: 240 }, { x: 260, y: 360 }, { x: 260, y: 480 }, { x: 260, y: 600 }],
    [{ x: 440, y: 200 }, { x: 440, y: 370 }, { x: 440, y: 540 }],
    [{ x: 600, y: 285 }, { x: 600, y: 455 }],
  ];

  const edges: { x1: number; y1: number; x2: number; y2: number; seed: string }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].forEach((a, ai) => {
      layers[l + 1].forEach((b, bi) => {
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, seed: `e${l}${ai}${bi}` });
      });
    });
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg
        viewBox="0 0 700 740"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0 }}
      >
        {edges.map((e, i) => {
          const phase = random(`ep${e.seed}`) * Math.PI * 2;
          const pulse = (Math.sin(frame / 18 + phase) + 1) / 2;
          const baseOpacity = 0.08 + random(`eo${e.seed}`) * 0.15;
          return (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke={pulse > 0.7 ? theme.blue : theme.blueDim}
              strokeWidth={pulse > 0.7 ? 1.5 : 0.8}
              opacity={baseOpacity + pulse * 0.25}
            />
          );
        })}
        {layers.flat().map((node, i) => {
          const phase = random(`np${i}`) * Math.PI * 2;
          const pulse = (Math.sin(frame / 22 + phase) + 1) / 2;
          return (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={10 + pulse * 3}
                fill="none"
                stroke={theme.blue}
                strokeWidth={1}
                opacity={0.15 + pulse * 0.3}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={6}
                fill={theme.bg}
                stroke={theme.blue}
                strokeWidth={1.5}
                opacity={0.6 + pulse * 0.4}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
