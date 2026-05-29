import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { Vignette } from "../components/Vignette";
import { GlitchText } from "../components/GlitchText";
import { bebas, garamond, oswald } from "../fonts";
import { theme } from "../theme";

// Close: 50-61s — the punchline
export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const line1P = interpolate(frame, [10, 40], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2P = interpolate(frame, [50, 85], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3P = interpolate(frame, [105, 145], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineP = interpolate(frame, [180, 220], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalFade = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Subtle background pulse
  const bgPulse = Math.sin(frame / 40) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,212,255,${0.03 * bgPulse}) 0%, transparent 60%)`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "0 60px",
          gap: 0,
          opacity: finalFade,
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            opacity: line1P,
            transform: `translateY(${interpolate(line1P, [0, 1], [30, 0])}px)`,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: bebas,
              fontSize: 72,
              color: theme.white,
              letterSpacing: 5,
            }}
          >
            THE MOST DANGEROUS THING ABOUT AI
          </div>
        </div>

        {/* Line 2 */}
        <div
          style={{
            opacity: line2P,
            transform: `translateY(${interpolate(line2P, [0, 1], [30, 0])}px)`,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: bebas,
              fontSize: 72,
              color: theme.white,
              letterSpacing: 5,
            }}
          >
            ISN'T THAT IT WILL TURN ON US.
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: interpolate(line2P, [0, 1], [0, 600]),
            height: 2,
            backgroundColor: theme.red,
            marginBottom: 28,
            opacity: 0.8,
          }}
        />

        {/* Line 3 — the punchline */}
        <div
          style={{
            opacity: line3P,
            transform: `scale(${interpolate(line3P, [0, 1], [0.92, 1])})`,
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontFamily: bebas,
              fontSize: 88,
              letterSpacing: 4,
              lineHeight: 1.05,
            }}
          >
            <GlitchText
              text="IT ALREADY HAS —"
              intensity={0.25}
              style={{ color: theme.red, textShadow: `0 0 30px ${theme.red}` }}
            />
          </div>
          <div
            style={{
              fontFamily: bebas,
              fontSize: 88,
              color: theme.red,
              letterSpacing: 4,
              textShadow: `0 0 30px ${theme.red}`,
            }}
          >
            AND WE GAVE IT PERMISSION.
          </div>
        </div>

        {/* Quote attribution */}
        <div
          style={{
            opacity: taglineP,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: garamond,
              fontSize: 30,
              color: theme.faded,
              fontStyle: "italic",
            }}
          >
            AI is not coming for us. It's already here.
          </div>
          <div
            style={{
              fontFamily: oswald,
              fontSize: 20,
              color: theme.blue,
              letterSpacing: 6,
              marginTop: 16,
              textTransform: "uppercase",
            }}
          >
            Stay informed. Stay human.
          </div>
        </div>
      </AbsoluteFill>

      <Vignette strength={0.9} />
      <FilmGrain opacity={0.06} />
    </AbsoluteFill>
  );
};
