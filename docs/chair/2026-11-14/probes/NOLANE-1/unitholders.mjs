// node unitholders.mjs <file> <anchor-substring> [more anchors...]
// For each of the nine lanes: does the lane's diff (merge-base with integration .. lane tip) touch the unit
// that begins at the anchor line (in the lane's own copy)? Unit = anchor line .. next line at <= its indent that closes (} ] )).
import { execSync } from 'node:child_process';
const sh = (c) => execSync(c, { cwd: '/home/user/settlement-engine', encoding: 'utf8', maxBuffer: 1 << 28 });
const L = ['coherence-upkeep-2026-11-12','powers-follow-up-2026-11-13','r2-code-a-2026-11-13','r2-code-b-2026-11-13','r3-code-c-2026-11-13','r3-tabs-2026-11-13','w2-c-leaves-2026-11-13','w2-fix-data-2026-11-13','w2-write-2026-11-13'];
const [file, ...anchors] = process.argv.slice(2);
function unitRange(lines, anchor) {
  const i = lines.findIndex((l) => l.includes(anchor));
  if (i < 0) return null;
  const ind = lines[i].match(/^\s*/)[0].length;
  for (let j = i + 1; j < lines.length; j++) {
    const m = lines[j].match(/^(\s*)([}\])])/);
    if (m && m[1].length <= ind && !/=>\s*\{?\s*$|\)\s*\{\s*$/.test(lines[j])) return [i + 1, j + 1];
    if (lines[j].trim() && lines[j].match(/^\s*/)[0].length < ind) return [i + 1, j];
  }
  return [i + 1, lines.length];
}
for (const a of anchors) {
  const out = [];
  for (const l of L) {
    const tip = `origin/lane/${l}`;
    const mb = sh(`git merge-base origin/lane/integration-2026-11-07 ${tip}`).trim();
    let txt; try { txt = sh(`git show ${tip}:${file}`); } catch { continue; }
    const r = unitRange(txt.split('\n'), a);
    if (!r) { out.push(`${l.split('-2026')[0]}:noanchor`); continue; }
    const d = sh(`git diff -U0 ${mb} ${tip} -- ${file}`);
    let hit = 0;
    for (const m of d.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
      const s = +m[1], n = m[2] === undefined ? 1 : +m[2];
      const e = n === 0 ? s : s + n - 1;
      if (e >= r[0] && s <= r[1]) hit++;
    }
    if (hit) out.push(`${l.split('-2026')[0]}(${hit})`);
  }
  console.log(`${file} :: ${a.slice(0, 60)} :: ${out.length ? out.join(' ') : 'none'}`);
}
