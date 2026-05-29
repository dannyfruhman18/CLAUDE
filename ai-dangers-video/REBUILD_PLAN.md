# REBUILD_PLAN.md — Make "The Dangers of AI" actually good

> **How to use this:** Open a new Claude Code web session on this repo with
> **full outbound network access**, then say: **"execute REBUILD_PLAN.md"**.

## Why the current version (commit history v1/v2) is weak
All three failings were caused by the previous session's network sandbox, which
blocked every good asset source. Fix the assets, fix the video:
1. **Robotic voice** — used old open-source Piper TTS + a muddy pitch-shift,
   because `api.elevenlabs.io` was firewall-blocked.
2. **No real footage** — only code-generated SVG/canvas graphics, because every
   stock/image host (Pexels, Pixabay, Wikimedia, Google) was blocked.
3. **Thin music** — synthesized sine drones, because no music host was reachable.

## The one architectural change that matters most
The old build **forced narration to fit fixed-length scenes** (slideshow feel).
The new build does the opposite: **derive ALL timing from the narration audio**
via Remotion `calculateMetadata`, and **sync captions to ElevenLabs word
timestamps**. This is the single biggest quality lever.

## Prerequisites (provide at session start)
1. **Full network access** on the environment (Allow all outbound).
2. **ElevenLabs API key** — paste or `export ELEVENLABS_API_KEY=...`.
3. **Free Pixabay API key** (https://pixabay.com/api/docs/) — one key covers
   images + video + music. (Optional: Pexels key `PEXELS_API_KEY` for higher-end
   video.)

## Build steps

### 0. Verify network (read-only)
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://api.elevenlabs.io/v1/models   # expect 401, not 403
curl -s -o /dev/null -w "%{http_code}\n" "https://pixabay.com/api/?key=KEY&q=test"  # expect 200
```

### 1. Narration first — ElevenLabs with word timestamps
`scripts/generate-vo.ts`:
- Endpoint: `POST /v1/text-to-speech/{voiceId}/with-timestamps`,
  `model_id: "eleven_multilingual_v2"`.
- Deep documentary voice — ask the user for a voiceId, or default to a deep male
  preset (e.g. "Bill" `pqHfZKP75CvOlQylNhV4`, "Daniel" `onwK4e9ZLuTAKqWW03F9`,
  "Adam" `pNInz6obpgDQGcFmaJgB`). Settings: stability 0.5, similarity_boost 0.8,
  style 0.3, speed ~0.95.
- One request per narration beat (~10–14 short sentences). Save
  `public/vo/beat-XX.mp3` and aggregate `public/vo/timings.json` containing, per
  beat: audio duration + the returned `alignment` character timestamps (collapse
  to word-level start/end).
- **No** pitch-shift, **no** reverb/compression — ElevenLabs is already clean.

Narration script (refine wording as desired; keep it punchy):
```
1  Right now, an algorithm is deciding your future.
2  Whether you get the job. The loan. The apartment.
3  And it never has to explain why.
4  Artificial intelligence isn't science fiction anymore.
5  It's in our courtrooms. Our hospitals. Our banks. Our weapons.
6  In 2023, one hiring system rejected over two hundred thousand people —
7  for patterns no human could even see.
8  No one reviewed it. No one was accountable.
9  Now, autonomous weapons can choose their own targets.
10 They call it efficiency. It's murder by algorithm.
11 The real danger was never that AI would turn on us.
12 It's that it already has — and we handed it the keys.
```

### 2. `calculateMetadata` drives the timeline
- `src/Root.tsx`: `AIDangers` composition gets `calculateMetadata` that imports
  `public/vo/timings.json`, sums beat durations (+ ~6–10 frame gaps between
  beats, longer pause before the final line), sets `durationInFrames` and `fps`
  (30). Pass parsed beats via `defaultProps`/`props`.
- Each beat → a `Sequence` of its audio length, holding its `<Audio>`.
- Captions: a reworked `KineticCaption` reads word timestamps and highlights the
  currently-spoken word (karaoke-style), perfectly synced.

### 3. Real footage backgrounds
`scripts/fetch-footage.ts` (Pixabay first; Pexels if key present):
- Per beat/scene, query dark cinematic terms: "artificial intelligence",
  "server room", "data center", "neural network", "surveillance camera",
  "circuit board macro", "courtroom", "military drone", "code screen",
  "city night aerial", "robot". Prefer vertical or large landscape (we crop).
- Download 1–2 best assets per scene → `public/footage/`. Save attribution to
  `public/footage/CREDITS.md` (Pixabay/Pexels are free; attribution courteous).
- New `src/components/FootageBackground.tsx`: full-bleed `<OffthreadVideo>` (for
  clips) or `<Img>` (photos), `object-fit: cover`, slow **Ken-Burns** scale
  (1.0→1.12) + slight pan via `interpolate(frame,…)`. Layer a dark gradient
  scrim + keep existing `FilmGrain` + `Vignette` + `ScanLines` on top for one
  cohesive grade.
- Use existing code VFX (`DataRain`, `GlitchText`, `NeuralNet`) as **accents over
  footage**, not the whole frame.

### 4. Real music
`scripts/fetch-music.ts`: pull one royalty-free dark-cinematic track from Pixabay
Music (or a CC0 source). Save `public/audio/bg-music.mp3`. In the composition,
trim/loop to total duration, fade in 1.5s / out 3s, volume ~0.10–0.14, optional
small swell in narration gaps.

### 5. Edit craft
- Cut scenes on narration beats; J-cuts (audio of next beat leads picture).
- Strong type hierarchy (Bebas titles, Oswald labels) + legibility scrims so
  captions read over any footage.
- Keep the good v2 bits: palette (`src/theme.ts`), vignette, the punchy close card.
- Render:
  ```bash
  REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell \
    npx remotion render AIDangers out/ai-dangers-of-ai.mp4 --codec=h264
  ```

## Files
- New: `scripts/generate-vo.ts`, `scripts/fetch-footage.ts`, `scripts/fetch-music.ts`,
  `src/components/FootageBackground.tsx`
- Modify: `src/Root.tsx` (calculateMetadata), `src/AIDangersVideo.tsx` (beats +
  footage layers), `src/components/KineticCaption.tsx` (word-timestamp sync)
- Reuse as-is: `FilmGrain`, `Vignette`, `ScanLines`, `GlitchText`, `DataRain`,
  `NeuralNet`, `Counter`, `theme.ts`, `fonts.ts`
- `.gitignore` already excludes `.venv`, `.voices`; add `public/footage/` only if
  assets are large — otherwise commit them so the render is reproducible.

## Verification
1. Network probe: ElevenLabs + Pixabay reachable (not 403).
2. `public/vo/*.mp3` + `timings.json` with word timestamps exist.
3. `public/footage/*` and `public/audio/bg-music.mp3` downloaded.
4. `npx tsc` clean; composition duration == summed VO length.
5. Render exits 0; `ffprobe out/ai-dangers-of-ai.mp4` shows an AAC stream.
6. Watch end-to-end: natural ElevenLabs voice, real footage backgrounds, captions
   snap to spoken words, music sits under narration.

## Fallback if network still can't be enabled
User records their own narration + supplies a licensed track + drops clips/images
into `public/footage/`. Same `calculateMetadata` + word-sync pipeline (word
timings can be derived locally with a forced-aligner, or captions fall back to
sentence-level timing). No blocked hosts required.
