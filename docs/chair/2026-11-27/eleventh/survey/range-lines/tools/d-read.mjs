import { readFileSync, readdirSync } from 'node:fs';
const T = '/home/user/settlement-engine';
const { pickRendezvous } = await import(`${T}/src/kernel/proseHash.js`);
const C = readFileSync('/home/user/range-lines/docs/chair/2026-11-27/eleventh/survey/range-lines/C-range-lines.tsv', 'utf8').replace(/\n+$/, '').split('\n').slice(1).map((r) => r.split('\t'));
const byKey = new Map(); for (const r of C) { const k = r[1]; if (!byKey.has(k)) byKey.set(k, { existing: r[7].split(' ‖ '), news: [] }); byKey.get(k).news.push(r[8]); }
const L = readFileSync('d10.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
const FD = '/home/user/chair/docs/chair/2026-11-27/eleventh/survey/voices/F-towns';
const norm = (s) => s.replace(/\{[^}]*\}|…/g, '\u0000');
const frag = (line) => norm(line).split('\u0000').map((x) => x.trim()).filter((x) => x.length >= 12);
for (const o of L) {
  const page = readFileSync(`${FD}/${o.seed}.md`, 'utf8');
  const asPrints = page.split(/\n## /).filter((s) => /AS IT PRINTS TODAY/.test(s.split('\n')[0])).join('\n');
  console.log(`\n### ${o.seed} (${o.tier}) ${o.name}`);
  const ok = (key, i) => { // my lines' own marks, read against this town (the old lines' branch is today's printed line)
    if (key.includes('POSTURE: established')) return !o.crises.some((c) => ['under_siege', 'famine', 'plague_onset'].includes(c));
    if (key.includes('MODERATE_WALLS')) return i !== 2; // [palisade]: neither walled town here stands a palisade
    if (key.includes('FOOD SOURCES')) return !/holdings its families till|what each family grows/.test(today.get(key) || '');
    return true; };
  const today = new Map();
  const choose = (key, ident, now) => { const e = byKey.get(key); const pool = [{ id: 'today', t: now }, ...e.news.map((t, i) => ({ id: `n${i}`, t, i })).filter((l) => ok(key, l.i))]; return pickRendezvous(pool, `${o.seedKey}::${ident}`, (l) => l.id); };
  for (const inst of o.insts) {
    const key = [...byKey.keys()].find((k) => k.endsWith(`[joined] ${o.tier}|${inst.category}|${inst.name}`));
    if (!key) continue; const c = choose(key, inst.name, inst.desc);
    console.log(`HOUSE ${inst.name} | today: ${inst.desc} | -> ${c.id === 'today' ? '(today\'s stays)' : c.t}`);
  }
  for (const [key, e] of byKey) { if (key.includes('[joined]')) continue; const hits = e.existing.filter((t) => { const f = frag(t); return f.length && f.every((x) => asPrints.includes(x)); }); if (hits.length) { today.set(key, hits[0]); const c = choose(key, key, hits[0]); console.log(`VIEW ${key.split(' :: ')[1].slice(0, 60)} | today: ${hits[0]} | -> ${c.id === 'today' ? '(today\'s stays)' : c.t}`); } }
  if (o.gov) { const seatKey = 'src/domain/display/governanceAccount.js :: governanceAccountOf()'; const now = o.gov.split('. ').slice(0, 2).join('. ') + '.'; const c = choose(seatKey, 'seat', now); console.log(`SEAT today: ${now} | -> ${c.id === 'today' ? "(today's stays)" : c.t}`); }
  if (o.hall?.rung === 'none') { const c = choose('src/data/people/dmPowerLines.js :: CAPTURE_LINES.none', 'hall', o.hall.line); console.log(`HALL(DM) -> ${c.id === 'today' ? "(today's stays)" : c.t}`); }
  for (const l of o.lends) { const c = choose('src/data/people/dmPowerLines.js :: PATRONAGE_LINES.open', l.name + l.power, l.line); console.log(`LENDS(DM) today: ${l.line} | -> ${c.id === 'today' ? "(today's stays)" : c.t}`); }
  if (o.legacy?.key === 'LEGACY-UNRESOLVED') { const c = choose('src/data/dossierStateProse/general.generated.js :: DOSSIER_STATE_PROSE_GENERAL.DS-GEN-16.pools.LEGACY-UNRESOLVED', 'legacy', '(today: one of the two)'); console.log(`LEGACY ${o.legacy.calamity} ${o.legacy.yearsAgo}y -> ${c.t}`); }
  for (const k of o.crises) { const m = { under_siege: 0, plague_onset: 1, famine: 2, wartime: 3 }[k]; const now = { under_siege: 'Stopped by the siege.', plague_onset: 'Curtailed by the outbreak.', famine: 'Scarce in the famine.', wartime: 'Curtailed by the war.' }[k]; const mine = byKey.get('src/domain/display/crisisStoppedRow.js :: MARK_LINES').news[m]; const c = pickRendezvous([{ id: 'today', t: now }, { id: 'n', t: mine }], `${o.seedKey}::mark:${k}`, (l) => l.id); console.log(`MARK ${k}: ${c.t}`); }
    console.log(`charter ${o.charter} crises ${o.crises.join(',')} lends ${o.lends.length}`);
  const tabs = page.split(/\n## /).filter((s) => /AS IT PRINTS TODAY/.test(s.split('\n')[0])).map((s) => s.split(':')[0]); console.log('F-town tabs printed:', tabs.join(', '));
}
