# Remotion rendering reference

Ways to turn a composition into output: the **CLI**, **Node.js SSR**
(`@remotion/renderer`), and **AWS Lambda** (`@remotion/lambda`).

## CLI

```bash
# Studio (interactive preview & prop editing)
npx remotion studio

# Render video. Entry point is auto-detected; pass it explicitly if needed.
npx remotion render <comp-id> <output>
npx remotion render src/index.ts MyVideo out/video.mp4

# Single still image
npx remotion still <comp-id> out/frame.png --frame=30

# Image sequence (one file per frame)
npx remotion render MyVideo out/frames --sequence
```

Useful flags:

| Flag | Effect |
|---|---|
| `--codec=h264\|h265\|vp8\|vp9\|prores\|gif\|mp3\|aac\|wav` | output codec |
| `--props='{"k":"v"}'` or `--props=./props.json` | input props for the composition |
| `--frames=0-100` | render a frame range only |
| `--frame=30` | (for `still`) which frame |
| `--scale=2` | render at 2× resolution |
| `--crf=18` | quality (lower = better/larger, h264 default 18) |
| `--image-format=jpeg\|png` | per-frame capture format |
| `--concurrency=4` | parallel rendering threads |
| `--muted` | drop audio |
| `--log=verbose` | debugging |
| `--gl=angle\|swiftshader\|...` | OpenGL backend (use for 3D/WebGL or headless servers) |

Audio-only (e.g. extract a podcast track): `--codec=mp3` with a `.mp3` output.

## Node.js / server-side rendering

```ts
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";

const serveUrl = await bundle({
  entryPoint: path.join(process.cwd(), "src/index.ts"),
  // webpackOverride: (config) => config,
});

const inputProps = { title: "From Node" };

const composition = await selectComposition({
  serveUrl,
  id: "MyVideo",
  inputProps,
});

await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: "out/video.mp4",
  inputProps,
  onProgress: ({ progress }) => console.log(`${Math.round(progress * 100)}%`),
});
```

Single still in Node: `renderStill({ composition, serveUrl, output, frame, inputProps })`.

`renderMedia` notable options: `crf`, `imageFormat`, `concurrency`, `scale`,
`frameRange`, `muted`, `audioCodec`, `chromiumOptions`, `envVariables`,
`overwrite`.

Reuse the bundle across many renders — `bundle()` is the expensive step.

## AWS Lambda (scale / cloud rendering)

```bash
npm i @remotion/lambda
npx remotion lambda functions deploy
npx remotion lambda sites create src/index.ts --site-name=my-video
npx remotion lambda render <serve-url> MyVideo --codec=h264
```
Programmatically: `renderMediaOnLambda({ region, functionName, serveUrl, composition, codec, inputProps })`, then poll with `getRenderProgress`.

## remotion.config.ts (Studio + CLI defaults)

```ts
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer("angle");
```
Note: this file configures the renderer/studio. It does **not** set input
props — pass those via `--props`, `defaultProps`, or the SSR `inputProps`.

## Choosing output settings

- **MP4 (H.264)** — default, widely compatible web/social video.
- **WebM (VP8/VP9)** — open format, transparency with VP9 + `pixelFormat`.
- **ProRes** — editing/transparency (`--codec=prores --prores-profile=4444`).
- **GIF** — short loops; large files, prefer short + small dimensions.
- **PNG sequence** — when you need per-frame images or alpha for compositing.
- **Transparent video** — `--codec=vp9` (WebM) or `prores` 4444, plus a
  transparent composition background and `--pixel-format=yuva420p`.

## Performance tips

- Increase `--concurrency` on multi-core machines.
- Prefer `--image-format=jpeg` unless you need alpha (then `png`).
- Use `<OffthreadVideo>` instead of `<Video>` when embedding video — far more
  reliable and faster during rendering.
- Keep DOM light per frame; heavy layouts slow every single frame.
- Reuse a single `bundle()` for batch renders.
