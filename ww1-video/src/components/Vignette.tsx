import React from "react";
import { AbsoluteFill } from "remotion";

// Radial vignette to darken the edges and focus the centre.
export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.7,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
  );
};
