import "./index.css";
import { Composition } from "remotion";
import { HolocaustVideo } from "./HolocaustVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HolocaustResilience"
        component={HolocaustVideo}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
