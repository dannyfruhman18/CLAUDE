import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { HookScene } from "./scenes/HookScene";
import { BuildScene } from "./scenes/BuildScene";
import { TensionScene } from "./scenes/TensionScene";
import { EscalationScene } from "./scenes/EscalationScene";
import { CloseScene } from "./scenes/CloseScene";
import { theme } from "./theme";

// Scene durations in frames @ 30fps
export const SCENE = {
  hook: 300,       // 10s
  build: 390,      // 13s
  tension: 480,    // 16s
  escalation: 360, // 12s
  close: 360,      // 12s
};

const T = 15; // transition overlap in frames

// Total: sum - (4 transitions × 15) = 1890 - 60 = 1830 frames = 61s exactly
export const AI_DURATION =
  Object.values(SCENE).reduce((a, b) => a + b, 0) - 4 * T;

export const AIDangersVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Background music (silent placeholder — drop in real track) */}
      <Audio src={staticFile("audio/bg-music.mp3")} volume={0.12} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.hook}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE.build}>
          <BuildScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE.tension}>
          <TensionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE.escalation}>
          <EscalationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE.close}>
          <CloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
