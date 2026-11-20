// 画面の試験用：Firebase のまねをする（ログイン・切符・記録・ランキング）。ルールは本物と同じファイルを手元で評価する
import { write } from "./rules-sim.mjs";
export function mockFirebase(page, { uid = "userA", seedRows = {} } = {}) {
  const S = { db: { jumaime: { run: {}, b: { all: { ...seedRows }, d: {} } } }, skew: 0, log: [], uid };
  const now = () => Date.now() + S.skew, json = (route, body, status = 200) => route.fulfill({ status, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(body) });
  page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com|googletagmanager\.com|google-analytics\.com/, (r) => r.abort());
  page.route(/identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com/, (r) => json(r, { localId: S.uid, idToken: "tok-" + S.uid, refreshToken: "ref", expiresIn: "3600", user_id: S.uid, id_token: "tok-" + S.uid, refresh_token: "ref", expires_in: "3600" }));
  page.route(/ft-red-default-rtdb/, (r) => json(r, { ja: "https://x.com/nasubi_test/status/1234567890123456789" }));
  page.route(/ft-blue-default-rtdb/, (route) => {
    const req = route.request(), u = new URL(req.url()), path = decodeURIComponent(u.pathname).replace(/^\//, "").replace(/\.json$/, ""), parts = path.split("/");
    if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,PUT", "access-control-allow-headers": "content-type" } });
    const get = () => parts.reduce((o, k) => (o && typeof o === "object" ? o[k] : undefined), S.db);
    if (req.method() === "PUT") {
      const tok = u.searchParams.get("auth"), auth = tok ? { uid: tok.replace("tok-", "") } : null, res = write(S.db, path, JSON.parse(req.postData()), auth, now());
      S.log.push({ path, ok: res.ok, why: res.why }); if (!res.ok) return json(route, { error: "Permission denied" }, 401);
      S.db = res.db; return json(route, get());
    }
    let v = get(); const ob = u.searchParams.get("orderBy");
    if (ob && v && typeof v === "object") { const key = JSON.parse(ob), lo = u.searchParams.get("startAt"), hi = u.searchParams.get("endAt"), lim = +u.searchParams.get("limitToFirst") || 1e9;
      const rows = Object.entries(v).filter(([, x]) => typeof x[key] === "number" && (lo === null || x[key] >= +lo) && (hi === null || x[key] <= +hi)).sort((a, b) => a[1][key] - b[1][key]).slice(0, lim); v = Object.fromEntries(rows); }
    json(route, v === undefined ? null : v);
  });
  return S;
}
