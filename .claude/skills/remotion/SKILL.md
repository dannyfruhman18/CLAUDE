---
name: remotion
description: Create, edit, preview, and render videos programmatically with Remotion (React-based video framework). Use when the user wants to build a video, animation, motion graphic, intro/outro, data-driven video, or render an MP4/WebM/GIF from React code; or asks about Compositions, Sequences, useCurrentFrame, interpolate, spring, the Remotion Studio, or rendering with the Remotion CLI / SSR / Lambda.
---

# Remotion

Remotion lets you create real videos (MP4, WebM, GIF, audio, image sequences,
stills) using React. You write components, parameterize them by the current
frame, and Remotion renders each frame to a video. This skill covers creating a
project, building Compositions, animating deterministically, and rendering.

## The one rule that makes everything work

**A video is a pure function of the frame number.** Everything you see at frame
`f` must be derivable from `f` (plus props). This is what makes renders
deterministic and parallelizable.

This means you must **NOT** use:
- CSS transitions / `@keyframes` animations
- `setTimeout`, `setInterval`, `requestAnimationFrame`
- `Date.now()` / `new Date()` for animation timing
- unseeded `Math.random()`

Instead, drive *all* motion from `useCurrentFrame()` and use Remotion's
`random()` for any randomness. If you find yourself reaching for any of the
banned APIs, that's the signal to recompute from the frame instead.

## Mental model

- **fps**: frames per second (commonly 30 or 60).
- **durationInFrames**: total length. A 5-second video at 30fps = 150 frames.
- A frame at time `t` seconds is `Math.round(t * fps)`.
- The component re-renders once per frame; `useCurrentFrame()` returns that frame
  (0-indexed). You compute styles/positions from it.

## Project structure

```
my-video/
├── package.json
├── remotion.config.ts        # studio/render config (NOT for input props)
├── tsconfig.json
└── src/
    ├── index.ts              # registerRoot(RemotionRoot)
    ├── Root.tsx              # lists every <Composition>
    └── MyVideo.tsx           # a composition's React component
```

`src/index.ts`:
```ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

`src/Root.tsx` — the registry of all compositions:
```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"                 // unique id, used by render CLI
      component={MyVideo}
      durationInFrames={150}       // 5s at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ title: "Hello" }}
    />
  );
};
```

A composition component:
```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ opacity, fontSize: 100 }}>{title}</h1>
    </AbsoluteFill>
  );
};
```

## Setup commands

Scaffold a new project (preferred):
```bash
npx create-video@latest         # interactive; pick a template (Hello World, etc.)
```

Add Remotion to an existing React app:
```bash
npm i remotion @remotion/cli
```

Open the visual editor (live preview, scrub timeline, edit props):
```bash
npx remotion studio
```

## Core building blocks

| API | Purpose |
|---|---|
| `useCurrentFrame()` | current frame number (0-indexed) |
| `useVideoConfig()` | `{ fps, width, height, durationInFrames, id, defaultProps }` |
| `<AbsoluteFill>` | a `position:absolute` div filling the canvas; great for layering |
| `<Sequence from={f} durationInFrames={n}>` | time-shift children; inside, `useCurrentFrame()` is relative to `from` |
| `<Series>` | play `<Series.Sequence>` children one after another automatically |
| `interpolate(input, inRange, outRange, opts)` | map a value (usually frame) from one range to another |
| `spring({ frame, fps, config })` | natural physics-based motion (0→1 by default) |
| `<Img>` / `<Video>` / `<OffthreadVideo>` / `<Audio>` | media; use `staticFile()` for assets in `public/` |
| `staticFile("name.png")` | reference a file in the `public/` folder |
| `<Loop durationInFrames={n}>` / `<Freeze frame={f}>` | repeat / hold content |
| `random(seed)` | deterministic pseudo-random in [0,1) — use instead of `Math.random()` |
| `delayRender()` / `continueRender(handle)` | block a frame until async work (fonts, data, images) is ready |

See `references/animation.md` for `interpolate`/`spring`/sequencing patterns and
`references/rendering.md` for every way to produce output.

## Rendering (quick reference)

```bash
# Render a composition to MP4
npx remotion render MyVideo out/video.mp4

# Explicit entry point, codec, and input props
npx remotion render src/index.ts MyVideo out/video.mp4 \
  --codec=h264 --props='{"title":"Custom"}'

# A single still frame (PNG/JPEG)
npx remotion still MyVideo out/thumb.png --frame=75

# GIF
npx remotion render MyVideo out/video.gif --codec=gif
```

Full programmatic/SSR/Lambda rendering is in `references/rendering.md`.

## Working checklist

When building or modifying a video:
1. Decide `fps`, `width`, `height`, and duration; convert seconds → frames with `fps`.
2. Register/adjust the `<Composition>` in `Root.tsx` (every renderable video must be listed there).
3. Drive every animated value from `useCurrentFrame()` via `interpolate`/`spring`.
4. Use `<Sequence>`/`<Series>` to schedule scenes on the timeline rather than conditionals on raw frames where possible.
5. Verify visually in `npx remotion studio`, then render with the CLI.
6. Keep components pure & deterministic — no wall-clock time, no unseeded randomness, no CSS animation.

## Common pitfalls

- **Blank/garbled video** → an animation used CSS transitions or `setTimeout`. Recompute from `frame`.
- **Flicker / inconsistent frames** → unseeded `Math.random()`; switch to `random(seed)`.
- **Composition "not found"** → the `id` passed to the CLI doesn't match the `<Composition id=...>` in `Root.tsx`.
- **Async data/images missing on render** → wrap loading in `delayRender()` / `continueRender()`.
- **Video assets choppy when rendering** → prefer `<OffthreadVideo>` over `<Video>` for rendering.
- **interpolate throws** → `inputRange` must be strictly monotonically increasing; add `extrapolateLeft/Right: "clamp"` to avoid values shooting past the range.
