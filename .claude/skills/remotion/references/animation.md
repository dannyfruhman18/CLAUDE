# Remotion animation & timing reference

All animation derives from `useCurrentFrame()`. Below are the primitives and
common patterns.

## interpolate

Map a number from an input range to an output range.

```tsx
import { interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

// Fade in over the first 30 frames, then hold.
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

// Multi-stop: in, hold, out (e.g. a 90-frame clip).
const o = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

Rules:
- `inputRange` must be **strictly increasing**.
- `inputRange.length === outputRange.length`.
- Without `extrapolate*: "clamp"`, values continue linearly past the ends.
- `easing` option accepts `Easing` from remotion, e.g. `easing: Easing.bezier(0.8, 0.22, 0.96, 0.65)` or `Easing.out(Easing.cubic)`.

## spring

Physics-based motion; returns ~0→1 by default. Always pass `fps`.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: { damping: 200 },   // higher damping = less bounce
  // durationInFrames: 20,     // optional: stretch the spring to N frames
});

// Map the 0→1 spring onto a real range with interpolate if needed:
const x = interpolate(spring({ frame, fps }), [0, 1], [-200, 0]);
```

Config knobs: `damping`, `mass`, `stiffness`, `overshootClamping`.

## Sequencing scenes

### `<Sequence>` — time-shift a subtree
Inside a `<Sequence from={f}>`, `useCurrentFrame()` restarts at 0 when the global
frame reaches `f`. This lets each scene animate "from zero".

```tsx
import { Sequence } from "remotion";

<>
  <Sequence durationInFrames={60}>
    <Intro />
  </Sequence>
  <Sequence from={60} durationInFrames={90}>
    <MainScene />   {/* its frame 0 == global frame 60 */}
  </Sequence>
</>
```

`<Sequence>` also accepts `layout="none"` to avoid wrapping children in an
absolute-fill div.

### `<Series>` — back-to-back scenes without manual offsets
```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={40}><SceneA /></Series.Sequence>
  <Series.Sequence durationInFrames={60} offset={-10}><SceneB /></Series.Sequence>
</Series>
```
`offset` overlaps/gaps adjacent scenes (negative = overlap).

## Loop & Freeze

```tsx
import { Loop, Freeze } from "remotion";

<Loop durationInFrames={30} times={3}><Spinner /></Loop>
<Freeze frame={45}><Animated /></Freeze>   {/* hold on frame 45 */}
```

## Determinism helpers

```tsx
import { random } from "remotion";

// Stable per-particle randomness — same every render.
const particles = new Array(50).fill(0).map((_, i) => ({
  x: random(`x-${i}`) * width,
  y: random(`y-${i}`) * height,
}));
```

## Async work inside a frame (fonts, fetched data, images)

```tsx
import { delayRender, continueRender } from "remotion";
import { useEffect, useState } from "react";

const [handle] = useState(() => delayRender("loading data"));
const [data, setData] = useState(null);

useEffect(() => {
  fetch("/api/data")
    .then((r) => r.json())
    .then((d) => { setData(d); continueRender(handle); })
    .catch((e) => { /* cancelRender(e) */ });
}, [handle]);
```
The renderer waits on each outstanding `delayRender` handle (with a timeout)
before capturing the frame.

For Google Fonts use `@remotion/google-fonts`, which handles `delayRender` for
you:
```tsx
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();
```

## Measuring time

```tsx
const { fps, durationInFrames } = useVideoConfig();
const seconds = frame / fps;
const progress = frame / (durationInFrames - 1); // 0→1 across the whole video
```
