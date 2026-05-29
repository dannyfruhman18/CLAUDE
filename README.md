# Claude skills

Claude Code skills for this repository.

## Skills

### `remotion`

The **official** [Remotion](https://www.remotion.dev) Agent Skill, copied from
[`remotion-dev/skills`](https://github.com/remotion-dev/skills) (the same content
installed by `npx skills@latest add remotion-dev/skills`).

It gives coding agents the domain knowledge to write correct Remotion code —
scaffolding projects, building compositions and components, animating with
`useCurrentFrame()`/`interpolate()`/springs, working with audio, video, images,
captions/subtitles, transitions, fonts, and rendering. Claude Code picks it up
automatically from `.claude/skills/`.

Layout:

- `.claude/skills/remotion/SKILL.md` — entry point with core best practices and
  a router to the detailed rule files.
- `.claude/skills/remotion/rules/*.md` — focused rules (compositions,
  sequencing, timing, audio, videos, images, captions/subtitles, transitions,
  text animations, fonts, transparent videos, ffmpeg, 3D, Tailwind, maplibre,
  and more).
- `.claude/skills/remotion/rules/assets/*.tsx` — example components referenced
  by the rules.

License: see the [Remotion license](https://remotion.dev/license).
