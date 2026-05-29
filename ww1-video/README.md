# The Great War — a WW1 video (Remotion)

A ~39-second documentary-style motion graphic about World War I (1914–1918),
built with [Remotion](https://www.remotion.dev) and created using the repo's
`remotion` Claude Code skill.

## Scenes

1. **Title** — "The Great War, 1914–1918"
2. **Outbreak** — the assassination in Sarajevo
3. **Alliances** — the Allies vs. the Central Powers
4. **Trench warfare** — the Western Front
5. **New weapons** — machine guns, gas, tanks, aircraft, submarines
6. **The human cost** — animated casualty statistics
7. **Armistice** — 11 November 1918
8. **Remembrance** — "Lest We Forget" with a field of poppies

Each scene is frame-driven (no CSS animation), with an aged-film look (grain,
scratches, vignette, drifting smoke and embers) and `TransitionSeries`
fade/slide transitions between scenes.

- Composition id: `WW1` — 1920×1080, 30fps, 1174 frames.
- Duration is computed in `src/WW1Video.tsx` from the per-scene lengths minus
  the overlapping transitions.

## Fonts

Period-appropriate Google Fonts (Cinzel, Oswald, EB Garamond, Special Elite)
are **self-hosted** in `public/fonts/` and loaded via `@remotion/fonts`, so the
project renders without runtime access to Google's font CDN. Only the `latin`
subset of each weight is included.

## Develop / preview

```bash
npm i
npm run dev        # opens Remotion Studio
```

## Render

```bash
npx remotion render WW1 out/the-great-war-ww1.mp4 --codec=h264
```

If the renderer can't download its own Chromium (e.g. a restricted network),
point it at an existing Chrome/Chromium build:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome \
  npx remotion render WW1 out/the-great-war-ww1.mp4 --codec=h264
```

`remotion.config.ts` reads `REMOTION_BROWSER_EXECUTABLE` and applies it via
`Config.setBrowserExecutable` when set.

## Content note

Figures (e.g. ~65M mobilised, ~20M deaths, ~21M wounded) are widely cited
round-number estimates for a short overview, not precise scholarly counts.
