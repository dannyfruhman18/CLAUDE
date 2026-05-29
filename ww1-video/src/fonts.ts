import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Self-hosted fonts (woff2 in public/fonts). We host them locally because the
// headless renderer in this environment can't fetch from Google's CDN.

export const cinzel = "Cinzel";
export const oswald = "Oswald";
export const garamond = "EB Garamond";
export const typewriter = "Special Elite";

const f = (name: string) => staticFile(`fonts/${name}`);

// Kick off loading at module import time. Remotion's font loader registers a
// delayRender internally so frames wait until the faces are ready.
void Promise.all([
  loadFont({ family: cinzel, url: f("Cinzel-400.woff2"), weight: "400" }),
  loadFont({ family: cinzel, url: f("Cinzel-700.woff2"), weight: "700" }),
  loadFont({ family: cinzel, url: f("Cinzel-900.woff2"), weight: "900" }),

  loadFont({ family: oswald, url: f("Oswald-300.woff2"), weight: "300" }),
  loadFont({ family: oswald, url: f("Oswald-400.woff2"), weight: "400" }),
  loadFont({ family: oswald, url: f("Oswald-500.woff2"), weight: "500" }),
  loadFont({ family: oswald, url: f("Oswald-700.woff2"), weight: "700" }),

  loadFont({ family: garamond, url: f("EBGaramond-400.woff2"), weight: "400" }),
  loadFont({ family: garamond, url: f("EBGaramond-500.woff2"), weight: "500" }),
  loadFont({
    family: garamond,
    url: f("EBGaramond-400i.woff2"),
    weight: "400",
    style: "italic",
  }),

  loadFont({
    family: typewriter,
    url: f("SpecialElite-400.woff2"),
    weight: "400",
  }),
]);
