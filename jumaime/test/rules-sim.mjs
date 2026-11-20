// データベースのルールを手元でまねる道具（本物のサーバーにはつながない）
import fs from "fs";
const RULES = { jumaime: JSON.parse(fs.readFileSync(new URL("../database.rules.jumaime.json", import.meta.url), "utf8")) };
const get = (o, path) => path.reduce((x, k) => (x && typeof x === "object" && k in x ? x[k] : undefined), o);
class Snap {
  constructor(root, path) { this.r = root; this.p = path; }
  val() { const v = get(this.r, this.p); return v === undefined ? null : v; }
  exists() { return this.val() !== null; }
  child(s) { return new Snap(this.r, this.p.concat(String(s).split("/").filter(Boolean))); }
  parent() { return new Snap(this.r, this.p.slice(0, -1)); }
  isString() { return typeof this.val() === "string"; }
  isNumber() { return typeof this.val() === "number"; }
  hasChildren(a) { const v = this.val(); return !!v && typeof v === "object" && a.every((k) => k in v); }
}
const clone = (x) => JSON.parse(JSON.stringify(x));
function setAt(root, path, v) { let o = root; for (let i = 0; i < path.length - 1; i++) { if (typeof o[path[i]] !== "object" || o[path[i]] === null) o[path[i]] = {}; o = o[path[i]]; } if (v === null) delete o[path[path.length - 1]]; else o[path[path.length - 1]] = v; }
const ev = (expr, ctx) => { if (typeof expr === "boolean") return expr; const names = Object.keys(ctx); return !!new Function(...names, "return (" + expr + ");")(...names.map((k) => ctx[k])); };
function matchChild(rule, key) { if (rule && typeof rule === "object") { if (key in rule && !key.startsWith(".")) return [rule[key], null]; const w = Object.keys(rule).find((k) => k.startsWith("$")); if (w) return [rule[w], w]; } return [null, null]; }
export function write(db, pathStr, value, auth, now) {
  const path = pathStr.split("/").filter(Boolean), after = clone(db);
  const fill = (v) => (v && typeof v === "object" ? (v[".sv"] === "timestamp" ? now : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]))) : v);
  setAt(after, path, value === null ? null : fill(value));
  let rule = RULES, vars = {}, allowed = false; const ctxAt = (p) => ({ auth, now, root: new Snap(db, []), data: new Snap(db, p), newData: new Snap(after, p), ...vars });
  const validates = [];
  for (let i = 0; i <= path.length; i++) { // 上から順に .write を見る（どこかで許されればよい）。.validate は通り道も全部見る
    const p = path.slice(0, i);
    if (rule && rule[".write"] !== undefined && ev(rule[".write"], ctxAt(p))) allowed = true;
    if (rule && rule[".validate"] !== undefined && new Snap(after, p).exists()) validates.push([rule[".validate"], ctxAt(p), p.join("/")]);
    if (i < path.length) { const [r, w] = matchChild(rule, path[i]); rule = r; if (w) vars = { ...vars, [w]: path[i] }; }
  }
  const walk = (rule, p, vars) => { const v = get(after, p); if (v && typeof v === "object") for (const k of Object.keys(v)) { const [r, w] = matchChild(rule, k), vs = w ? { ...vars, [w]: k } : vars, cp = p.concat(k); if (r && r[".validate"] !== undefined) validates.push([r[".validate"], { auth, now, root: new Snap(db, []), data: new Snap(db, cp), newData: new Snap(after, cp), ...vs }, cp.join("/")]); walk(r, cp, vs); } };
  walk(rule, path, vars);
  if (!allowed) return { ok: false, why: "write" };
  for (const [e, c, at] of validates) if (!ev(e, c)) return { ok: false, why: "validate " + at };
  return { ok: true, db: after };
}
