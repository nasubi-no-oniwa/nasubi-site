// ランキングの管理（GitHub の上でだけ動く。鍵は FT_BLUE_SERVICE_ACCOUNT）
// admin/req.json の中身にしたがって、記録を調べる（dump）・バンする（ban）
import fs from 'fs';
import { token, api } from '../tools/fb.mjs';
const req = JSON.parse(fs.readFileSync('admin/req.json', 'utf8'));
const tk = await token();
const get = async p => JSON.parse(await api('GET', p, undefined, tk) || 'null');
const t = ms => new Date(ms + 9 * 3600e3).toISOString().slice(5, 19).replace('T', ' ');
if (req.dump) {
  for (const pf of ['m', 'p']) for (const w of ['all', 'd']) {
    const o = await get('/battery1/b/' + pf + '/' + w + '.json') || {};
    const rows = Object.entries(o).map(([id, r]) => ({ id, ...r })).sort((a, b) => b.sk - a.sk).slice(0, req.top || 15);
    console.log(`\n== ${pf === 'm' ? 'スマホ' : 'PC'} ${w === 'd' ? '今日' : '全期間'}（全${Object.keys(o).length}件）`);
    for (const r of rows) {
      const dur = r.at && r.st ? ((r.at - r.st) / 1000).toFixed(1) : '?';
      console.log(`${String(r.k).padStart(4)}個 誤${String(r.e).padStart(3)}  ${JSON.stringify(r.n)}  uid=${r.id}  開始${t(r.st)}  記録${t(r.at)}  開始から${dur}秒  ${Object.keys(r).filter(k => !['id','n','k','e','sk','st','v','at','dk','ds'].includes(k)).join(',')}`);
    }
  }
  const ban = await get('/battery1/ban.json'); console.log('\n== バン済み', JSON.stringify(ban));
}
for (const uid of req.ban || []) {
  if (!/^[A-Za-z0-9]{20,40}$/.test(uid)) { console.log('uid の形がちがう', uid); continue; }
  const keep = {};
  for (const pf of ['m', 'p']) for (const w of ['all', 'd']) { const r = await get(`/battery1/b/${pf}/${w}/${uid}.json`); if (r) keep[pf + '_' + w] = r; }
  await api('PUT', `/battery1/ban/${uid}.json`, { at: Date.now(), why: req.why || '', rec: keep }, tk);
  for (const pf of ['m', 'p']) for (const w of ['all', 'd']) await api('DELETE', `/battery1/b/${pf}/${w}/${uid}.json`, undefined, tk);
  console.log('バンしました', uid, JSON.stringify(Object.fromEntries(Object.entries(keep).map(([k, r]) => [k, r.n + ' ' + r.k + '個']))));
}
