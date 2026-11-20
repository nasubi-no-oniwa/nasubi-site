import { build } from "esbuild"; import fs from "fs";
// 使い方: node build.mjs <入口.js> <ひな形.html> <出力.html> [dev]   （dev をつけると、調べるための入口 window.__g が入る。公開するものには入れない）
const [entry, html, out, dev] = process.argv.slice(2);
const r = await build({ entryPoints: [entry], bundle: true, format: "esm", minify: true, write: false, target: "es2020", legalComments: "none", define: { __DEV__: dev === "dev" ? "true" : "false" } });
const js = r.outputFiles[0].text.replace(/<\/script/g, "<\\/script");
fs.mkdirSync("dist", { recursive: true });
// 5つ目に ads をつけると、広告の部分（src/ads.html）を入れ、「次のゲーム」の中の広告も出す
const ads = process.argv[6] === "ads" || dev === "ads";
let page = fs.readFileSync(html, "utf8").replace("/*BUNDLE*/", () => js);
page = page.replace("<!--ADS-->\n", () => (ads ? fs.readFileSync("src/ads.html", "utf8") : "")).replace("/*NEXTAD*/0", ads ? "1" : "0");
fs.writeFileSync(out, page);
console.log(out, (fs.statSync(out).size / 1024 | 0) + "KB");
