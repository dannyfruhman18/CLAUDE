import React from "react";
import { AbsoluteFill } from "remotion";

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.8 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
