import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const bebas = "Bebas Neue";
export const oswald = "Oswald";
export const garamond = "EB Garamond";

const f = (name: string) => staticFile(`fonts/${name}`);

void Promise.all([
  loadFont({ family: bebas, url: f("BebasNeue-400.woff2"), weight: "400" }),
  loadFont({ family: oswald, url: f("Oswald-300.woff2"), weight: "300" }),
  loadFont({ family: oswald, url: f("Oswald-400.woff2"), weight: "400" }),
  loadFont({ family: oswald, url: f("Oswald-700.woff2"), weight: "700" }),
  loadFont({ family: garamond, url: f("EBGaramond-400i.woff2"), weight: "400", style: "italic" }),
]);
