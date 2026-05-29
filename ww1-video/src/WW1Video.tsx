import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { TitleScene } from "./scenes/TitleScene";
import { OutbreakScene } from "./scenes/OutbreakScene";
import { AlliancesScene } from "./scenes/AlliancesScene";
import { TrenchScene } from "./scenes/TrenchScene";
import { NewWeaponsScene } from "./scenes/NewWeaponsScene";
import { TollScene } from "./scenes/TollScene";
import { ArmisticeScene } from "./scenes/ArmisticeScene";
import { RemembranceScene } from "./scenes/RemembranceScene";
import { darkBg } from "./theme";

// Per-scene durations (frames @ 30fps). Transitions overlap and shorten
// the timeline — see WW1_DURATION below.
export const SCENE = {
  title: 130,
  outbreak: 150,
  alliances: 165,
  trench: 160,
  weapons: 180,
  toll: 175,
  armistice: 160,
  remembrance: 180,
};

const T = 18; // transition length in frames

// Total = sum(scenes) - sum(transitions). 7 transitions between 8 scenes.
export const WW1_DURATION =
  Object.values(SCENE).reduce((a, b) => a + b, 0) - 7 * T;

export const WW1Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: darkBg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE.title}>
          <TitleScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.outbreak}>
          <OutbreakScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.alliances}>
          <AlliancesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.trench}>
          <TrenchScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.weapons}>
          <NewWeaponsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.toll}>
          <TollScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.armistice}>
          <ArmisticeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE.remembrance}>
          <RemembranceScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
