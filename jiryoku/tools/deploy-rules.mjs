// database.rules.json を otokonoji に反映する（字力のルールはこのファイルのとおり。同じデータベースに置いている「矢は壊れない」の ya は消さずに残す）
// admin/req.json に {"wipe":"合図"} があり、まだその合図で消していなければ、字力（jr〜）と相手さがし（qm・pres）以外の古いデータを消す
import fs from 'fs';
import { token, api } from './fb.mjs';
const tk = await token();
// 同じデータベースに置いている、字力ではないゲームの場所（ルールもデータも消さずに残す）
const KEEP = ['ya'];
const mine = JSON.parse(fs.readFileSync('database.rules.json', 'utf8'));
const before = await api('GET', '/.settings/rules.json', undefined, tk);
fs.writeFileSync(process.env.RUNNER_TEMP + '/before.json', before);
let cur = null; try { cur = JSON.parse(before); } catch (e) { throw new Error('いまのルールが読めないので、何も変えずに止めます'); }
for (const k of KEEP) if (cur && cur.rules && cur.rules[k] !== undefined && mine.rules[k] === undefined) { mine.rules[k] = cur.rules[k]; console.log('残しました：', k); }
const rules = JSON.stringify(mine, null, 2);
await api('PUT', '/.settings/rules.json', rules, tk);
const after = JSON.parse(await api('GET', '/.settings/rules.json', undefined, tk));
const ok = JSON.stringify(after) === JSON.stringify(mine);
console.log(ok ? 'ルールを反映しました：' + Object.keys(after.rules).join(' ') : '反映のあとの確認が合いません');
if (!ok) process.exit(1);
// 古いデータの片づけ
let req = {}; try { req = JSON.parse(fs.readFileSync('admin/req.json', 'utf8')); } catch (e) { }
const top = JSON.parse(await api('GET', '/.json?shallow=true', undefined, tk)) || {};
console.log('いまある場所：', Object.keys(top).join(' ') || '（なし）');
if (req.wipe) {
  const done = JSON.parse(await api('GET', '/jr_meta/wiped.json', undefined, tk));
  if (done === req.wipe) console.log('片づけは済んでいます（' + req.wipe + '）');
  else {
    const del = Object.keys(top).filter(k => !/^jr(_|$)/.test(k) && k !== 'qm' && k !== 'pres' && !KEEP.includes(k));
    for (const k of del) { await api('DELETE', '/' + encodeURIComponent(k) + '.json', undefined, tk); console.log('消しました：', k); }
    if (req.wipeJr) { for (const k of Object.keys(top).filter(k => /^jr(_|$)/.test(k) && k !== 'jr_meta')) { await api('DELETE', '/' + encodeURIComponent(k) + '.json', undefined, tk); console.log('消しました：', k); } }
    await api('PUT', '/jr_meta/wiped.json', JSON.stringify(req.wipe), tk);
    console.log('片づけました（' + req.wipe + '）：' + del.length + ' か所');
  }
}
