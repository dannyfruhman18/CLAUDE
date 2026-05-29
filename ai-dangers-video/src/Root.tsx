import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { AIDangersVideo, AI_DURATION } from "./AIDangersVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AIDangers"
        component={AIDangersVideo}
        durationInFrames={AI_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
