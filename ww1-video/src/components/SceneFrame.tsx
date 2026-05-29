import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmGrain, FilmScratches } from "./FilmGrain";
import { Vignette } from "./Vignette";
import { darkBg } from "../theme";

// Wraps a scene with the consistent aged-film look: dark base, optional
// background, grain, scratches and a vignette. Children render on top.
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  background?: React.ReactNode;
  grain?: number;
  vignette?: number;
}> = ({ children, background, grain = 0.07, vignette = 0.7 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: darkBg, overflow: "hidden" }}>
      {background}
      {children}
      <Vignette strength={vignette} />
      <FilmGrain opacity={grain} />
      <FilmScratches />
    </AbsoluteFill>
  );
};
