# Remotion examples

Copy-paste starting points. All are deterministic (frame-driven).

## Animated title card (fade + spring scale)

```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TitleCard: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0b0f",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center" }}>
        <h1 style={{ fontSize: 120, margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 48, opacity: 0.7 }}>{subtitle}</p>}
      </div>
    </AbsoluteFill>
  );
};
```

## Multi-scene video with Series

```tsx
import { Series } from "remotion";
import { TitleCard } from "./TitleCard";

export const Promo: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={60}>
      <TitleCard title="Welcome" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={90}>
      <TitleCard title="Our Product" subtitle="Now 2x faster" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={60} offset={-15}>
      <TitleCard title="Get Started" />
    </Series.Sequence>
  </Series>
);
```

Register it (total = 60 + 90 + (60-15) = 195 frames):
```tsx
<Composition id="Promo" component={Promo} durationInFrames={195} fps={30} width={1920} height={1080} />
```

## Image + audio + caption, scheduled with Sequence

```tsx
import { AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";

const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame(); // relative to the Sequence's `from`
  const y = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 80 }}>
      <div style={{ transform: `translateY(${y}px)`, opacity, fontSize: 64, color: "white", background: "rgba(0,0,0,.5)", padding: "12px 32px", borderRadius: 12 }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Audio src={staticFile("music.mp3")} />
    <Sequence durationInFrames={90}>
      <Img src={staticFile("photo1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <Caption text="First moment" />
    </Sequence>
    <Sequence from={90} durationInFrames={90}>
      <Img src={staticFile("photo2.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <Caption text="Second moment" />
    </Sequence>
  </AbsoluteFill>
);
```
(Put `music.mp3`, `photo1.jpg`, `photo2.jpg` in the `public/` folder.)

## Embedding a video clip (render-safe)

```tsx
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence } from "remotion";

export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={120}>
      {/* OffthreadVideo is preferred over <Video> for rendering */}
      <OffthreadVideo src={staticFile("clip.mp4")} />
    </Sequence>
  </AbsoluteFill>
);
```
Trim a clip with `startFrom` / `endAt` (in frames). Use `volume` (can be a
function of frame) to fade audio.

## Data-driven bar chart

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...data.map((d) => d.value));
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "flex-end", gap: 24, padding: 80, background: "white" }}>
      {data.map((d, i) => {
        const grow = interpolate(frame, [i * 6, i * 6 + 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={d.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: `${(d.value / max) * 600 * grow}px`, background: "#4f46e5", borderRadius: 8 }} />
            <div style={{ marginTop: 8, fontSize: 28 }}>{d.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

Pass `data` via `defaultProps` and override at render time with
`--props='{"data":[...]}'`.
