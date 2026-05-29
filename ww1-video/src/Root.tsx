import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { WW1Video, WW1_DURATION } from "./WW1Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WW1"
        component={WW1Video}
        durationInFrames={WW1_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
