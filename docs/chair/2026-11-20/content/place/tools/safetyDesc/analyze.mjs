// PLACE-1 MEASURE, safetyDesc: sections A and C's figures from out/births.jsonl (measure.mjs's output).
// Run from this directory:   node analyze.mjs > out/analyze.txt
import fs from 'node:fs';
const rows = fs.readFileSync(new URL('./out/births.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).filter(Boolean);
const pct = (a, b) => `${a}/${b} (${Math.round((100 * a) / b)}%)`;

/** The writer's branch (safetyProfile.js :: generateSafetyProfile), read off the label and the line it wrote. */
export function branchOf(label, desc, tier) {
  const l = String(label), d = String(desc);
  if (l === 'Controlled — Authoritarian') return 'stateCrime';
  if (l === 'Dangerous — Criminal Governance') return 'crimeIsGovt';
  if (l.includes(' — ')) return 'strain';
  if (l === 'Very Safe') return `verySafe:${/sees to that/.test(d) ? (d.match(/; the (.+?) sees to that/) || [])[1] : 'noForce'}`;
  if (l === 'Safe') return `safe:${(d.match(/^Crime (?:exists but is well-managed|is on the rise)\. (The \w+ is present|Neighbours notice)/) || [])[1] || '?'}`;
  if (l === 'Moderate') return d.startsWith('The neighbours keep an eye') ? 'moderate:tiny' : `moderate:${(d.match(/^A mix of safer and more exposed areas\. (The garrison patrols|The watch covers|Militia volunteers patrol|Locals watch over)/) || [])[1] || '?'}`;
  if (l === 'Unsafe') return 'unsafe';
  if (l === 'Dangerous') return 'dangerous';
  return `other:${l}`;
}
const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);

const out = [];
const say = (s = '') => out.push(s);
say('== A. branches by size (100 places a size), the branch the writer took (its label and its line)');
const allBranches = new Set();
const bySize = {};
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const m = new Map();
  for (const r of rs) { const b = branchOf(r.safetyLabel, r.safetyDesc, r.tier); m.set(b, (m.get(b) || 0) + 1); allBranches.add(b); }
  bySize[size] = m;
}
const bl = [...allBranches].sort();
say(`branch`.padEnd(34) + SIZES.map((s) => s.padStart(11)).join(''));
for (const b of bl) say(b.padEnd(34) + SIZES.map((s) => String(bySize[s].get(b) || 0).padStart(11)).join(''));

say('\n== A. top share by size: the WHOLE line, masked (the census mask), and the FIRST sentence');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size && r.masked != null);
  const whole = new Map(), first = new Map();
  for (const r of rs) { whole.set(r.masked, (whole.get(r.masked) || 0) + 1); const f = sentences(r.masked)[0]; first.set(f, (first.get(f) || 0) + 1); }
  const [w0, wn] = top(whole)[0], [f0, fn] = top(first)[0];
  say(`${size.padEnd(11)} whole ${pct(wn, rs.length).padEnd(12)} ${whole.size} distinct :: "${w0.slice(0, 90)}"`);
  say(`${''.padEnd(11)} first ${pct(fn, rs.length).padEnd(12)} ${first.size} distinct :: "${f0.slice(0, 90)}"`);
}

say('\n== A. the chair\'s figure reproduced (the first 50 a size, whole line masked): the tap moves no birth');
for (const size of ['thorp', 'town', 'city']) {
  const m = new Map();
  for (const r of rows.filter((x) => x.size === size && x.i < 50)) m.set(r.masked, (m.get(r.masked) || 0) + 1);
  const [s, c] = top(m)[0];
  say(`  ${size.padEnd(11)} ${c}/50 "${s.slice(0, 80)}"`);
}

say('\n== A. the commonest whole lines by size (top 5)');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const whole = new Map();
  for (const r of rs) whole.set(r.masked, (whole.get(r.masked) || 0) + 1);
  say(`-- ${size}`);
  for (const [s, c] of top(whole).slice(0, 5)) say(`  ${String(c).padStart(3)}  ${s}`);
}

say('\n== A. sentence SLOTS: for every sentence position, the top share among places whose line has that position (by size)');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const slot = new Map();
  for (const r of rs) {
    const ss = sentences(r.masked);
    ss.forEach((s, k) => { const m = slot.get(k) || new Map(); m.set(s, (m.get(s) || 0) + 1); slot.set(k, m); });
  }
  const parts = [];
  for (const [k, m] of [...slot.entries()].sort((a, b) => a[0] - b[0])) {
    const [s, c] = top(m)[0]; const held = [...m.values()].reduce((a, b) => a + b, 0);
    if (c >= 10) parts.push(`s${k + 1} ${c}/${rs.length} (held ${held}) "${s.slice(0, 60)}"`);
  }
  say(`-- ${size}: ${parts.join(' | ')}`);
}

say('\n== A. any sentence (anywhere in the line) printed in more than 15 of a size\'s places');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size);
  const m = new Map();
  for (const r of rs) for (const s of new Set(sentences(r.masked))) m.set(s, (m.get(s) || 0) + 1);
  for (const [s, c] of top(m).filter(([, c]) => c > 15)) say(`  ${size.padEnd(11)} ${String(c).padStart(3)}  ${s}`);
}

say('\n== C. the writer: calls a birth, which call the stored line equals, the seed in scope there');
const callN = new Map(); let storedEqLast = 0, storedEqFirst = 0, lastDiffersFirst = 0, storedEqNone = 0; const seedForms = new Map(); let cfgSeed = 0;
for (const r of rows) {
  callN.set(r.calls.length, (callN.get(r.calls.length) || 0) + 1);
  const last = r.calls[r.calls.length - 1], first = r.calls[0];
  if (last && last.safetyDesc === r.safetyDesc) storedEqLast++;
  if (first && first.safetyDesc === r.safetyDesc) storedEqFirst++;
  if (first && last && first.safetyDesc !== last.safetyDesc) lastDiffersFirst++;
  if (!r.calls.some((c) => c.safetyDesc === r.safetyDesc)) storedEqNone++;
  for (const c of r.calls) { const f = c.seed == null ? 'none' : String(c.seed).replace(r.seed, '<seed>'); seedForms.set(f, (seedForms.get(f) || 0) + 1); if (c.configSeed === r.seed) cfgSeed++; }
}
say(`calls a birth: ${top(callN).map(([k, v]) => `${k} calls × ${v}`).join(', ')}`);
say(`stored line = the LAST call's: ${storedEqLast}/600; = the first call's: ${storedEqFirst}/600; first and last calls differ: ${lastDiffersFirst}; stored equals no call: ${storedEqNone}`);
say(`the active stream's seed at the writer: ${top(seedForms).map(([k, v]) => `${k} × ${v}`).join(', ')}`);
say(`config._seed at the writer equals the birth's seed: ${cfgSeed} of ${rows.reduce((a, r) => a + r.calls.length, 0)} calls`);

say('\n== C. the stored line changed after the writer (a later pass): where the stored line equals no call, the pair');
for (const r of rows.filter((x) => !x.calls.some((c) => c.safetyDesc === x.safetyDesc)).slice(0, 8)) say(`  ${r.seed}: writer "${r.calls.at(-1)?.safetyDesc.slice(0, 70)}" → stored "${r.safetyDesc.slice(0, 70)}"`);

say('\n== C. the writer\'s facts (the last call\'s roster) against the FINAL record\'s, disagreements on the 600');
const keys = ['walls', 'wallKind', 'palisade', 'gate', 'watch', 'militia', 'garrison', 'mercenary', 'court', 'prison'];
for (const k of keys) {
  let dis = 0; const ex = [];
  for (const r of rows) { const w = r.calls.at(-1)?.facts.def[k], f = r.finalFacts.def[k]; if (w !== f) { dis++; if (ex.length < 3) ex.push(`${r.seed} ${w}→${f}`); } }
  say(`  defence.${k.padEnd(10)} ${dis} ${ex.join('; ')}`);
}
for (const k of ['forceWalksByDay', 'paidWatch', 'guardPresence', 'market', 'route', 'terrain', 'tier', 'courtSits', 'crime', 'sacredHouse', 'guild']) {
  let dis = 0; const ex = [];
  for (const r of rows) { const w = r.calls.at(-1)?.facts[k], f = r.finalFacts[k]; if (JSON.stringify(w) !== JSON.stringify(f)) { dis++; if (ex.length < 3) ex.push(`${r.seed} ${JSON.stringify(w)}→${JSON.stringify(f)}`); } }
  say(`  ${k.padEnd(18)} ${dis} ${ex.join('; ')}`);
}
{
  // the roster alone answers no route or terrain (the partial record carries no config); the writer's own `config` does
  let rd = 0, td = 0;
  for (const r of rows) { const c = r.calls.at(-1); if (c?.routeAtWriter !== r.finalFacts.route) rd++; if (String(c?.terrainAtWriter ?? '').toLowerCase() !== r.finalFacts.terrain) td++; }
  say(`  route   by the writer's config.tradeRouteAccess: ${rd} disagree; terrain by config.terrainType: ${td} disagree`);
}
for (const k of ['garrison', 'watch', 'militia', 'mercenary', 'walls']) {
  let dis = 0; const ex = [];
  for (const r of rows) { const w = JSON.stringify(r.calls.at(-1)?.facts.houses[k]), f = JSON.stringify(r.finalFacts.houses[k]); if (w !== f) { dis++; if (ex.length < 3) ex.push(`${r.seed} ${w}→${f}`); } }
  say(`  houses.${k.padEnd(10)} ${dis} ${ex.join('; ')}`);
}

say('\n== C. the force houses by name, by size, in the places of the repeated branches (moderate:*, safe:*, verySafe:*), FINAL roster');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size && /^(moderate|safe|verySafe)/.test(branchOf(r.safetyLabel, r.safetyDesc, r.tier)));
  const m = new Map();
  for (const r of rs) { const h = r.finalFacts.houses; const key = [...h.garrison, ...h.watch, ...h.militia].join(' + ') || '(none)'; m.set(key, (m.get(key) || 0) + 1); }
  say(`-- ${size} (${rs.length}): ${top(m).slice(0, 8).map(([k, v]) => `${k} ×${v}`).join(' | ')}`);
  const w = new Map();
  for (const r of rs) { const key = r.finalFacts.houses.walls.join(' + ') || '(no walls)'; w.set(key, (w.get(key) || 0) + 1); }
  say(`   walls: ${top(w).slice(0, 6).map(([k, v]) => `${k} ×${v}`).join(' | ')}`);
  const day = new Map();
  for (const r of rs) { const key = `day:${r.finalFacts.forceWalksByDay}`; day.set(key, (day.get(key) || 0) + 1); }
  const rt = new Map();
  for (const r of rs) { const key = `${r.finalFacts.route}`; rt.set(key, (rt.get(key) || 0) + 1); }
  const mk = rs.filter((r) => r.finalFacts.market === true).length;
  const ct = rs.filter((r) => r.finalFacts.courtSits === true).length;
  say(`   ${top(day).map(([k, v]) => `${k} ×${v}`).join(', ')} | route ${top(rt).map(([k, v]) => `${k} ×${v}`).join(', ')} | market ${mk} | court sits ${ct}`);
}

say('\n== C. the force houses\' own texts (the descriptions the force prints), commonest 12 across the 600');
const dm = new Map();
for (const r of rows) for (const d of r.finalFacts.forceDescs) dm.set(d, (dm.get(d) || 0) + 1);
for (const [d, c] of top(dm).slice(0, 12)) say(`  ${String(c).padStart(3)}  ${d}`);

say('\n== C. crime wave beside the Safe branch (CRIME_WAVE_TWINS rewrites its opening at assembly)');
for (const size of SIZES) {
  const rs = rows.filter((r) => r.size === size && r.safetyLabel === 'Safe');
  say(`  ${size.padEnd(11)} Safe ${rs.length}, opening "Crime is on the rise." ${rs.filter((r) => r.safetyDesc.startsWith('Crime is on the rise.')).length}`);
}
console.log(out.join('\n'));
