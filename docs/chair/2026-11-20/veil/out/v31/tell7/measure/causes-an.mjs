// R3-TELL-7 steps 1-2: THE CAUSES of every strict-part case, by THE RECORD (the chair's 04:23 ruling (3)), and the arm's cost.
//   node causes-an.mjs <tell7 dir> <worktree>
// Inputs: m0/lists-shard*.json (step 1: every gated page, both engines, A and the twin B); ref.json / ref-controls.json
// (ref.probe.jsx: the served page's own facts re-run through the engine's writer, safetyProfile.js :: generateSafetyProfile(served
// config, served tier, served houses), at the own setting, Reveal off and DM). An entry the twin shows and the page lacks is the
// VEIL'S where the record reference writes it (the engine, given only what the page serves, writes it); else the DRAW'S. Each
// veil entry is then given its MECHANISM (why the veil took it), by the stored list, the hidden names and the map:
//   name-sweep        a crisis's type (map []) the stored list holds, whose text holds a hidden house's name (VR39: by name)
//   threshold-attr    a type the stored list holds that the engine writes on criminalEffective's thresholds (Survival crime,
//                     Magical crime, Background crime, Lawlessness), the map attributing it to hasCriminalInst
//   map-attr          any other type the stored list holds, withheld by the map
//   fallback          'Background crime' / 'Lawlessness', not stored (the withheld rows held the list), the engine's fallback
//   settled-away      'desperation theft', not stored: settleCrimeLinesToSignal took it beside the Survival crime line a network
//                     printed, and the veil then took the Survival crime line
//   sibling-suppressed  'Magical crime', not stored: the engine writes it only where 'Arcane black market' is not raised; that
//                     type was stored and withheld
//   hook-map-attr     a plot hook the stored list holds, withheld by the hook map
import { readFileSync, readdirSync } from 'node:fs';
const D = process.argv[2]; const W = process.argv[3];
const { CRIME_TYPE_RAISERS } = await import(`${W}/src/domain/display/galleryRosterChoices.js`);
const m0 = readdirSync(`${D}/m0`).filter((f) => /^lists-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${D}/m0/${f}`, 'utf8')).towns);
const ref = new Map(JSON.parse(readFileSync(`${D}/ref.json`, 'utf8')).map((r) => [r.seed, r]));
const refC = JSON.parse(readFileSync(`${D}/ref-controls.json`, 'utf8'));
const bag = (xs) => { const m = new Map(); for (const x of xs) m.set(x, (m.get(x) || 0) + 1); return m; };
const minus = (a, b) => { const mb = bag(b); const o = []; for (const x of a) { const k = mb.get(x) || 0; if (k > 0) mb.set(x, k - 1); else o.push(x); } return o; };
const THRESH = new Set(['Survival crime', 'Magical crime', 'Background crime', 'Lawlessness']);
const lc = (s) => String(s).toLowerCase();
const mech = (t, fam, e) => {
  const stored = t.storedA[fam];
  if (fam === 'plotHooks') return stored.includes(e) ? 'hook-map-attr' : 'hook-other';
  if (stored.includes(e)) {
    const r = CRIME_TYPE_RAISERS[e];
    if (Array.isArray(r) && !r.length && t.hidden.some((h) => lc(e).includes(lc(h)))) return 'name-sweep';
    if (THRESH.has(e)) return 'threshold-attr';
    return 'map-attr';
  }
  if (e === 'Background crime' || e === 'Lawlessness') return 'fallback';
  if (e === 'desperation theft') return 'settled-away';
  if (e === 'Magical crime' && stored.includes('Arcane black market')) return 'sibling-suppressed';
  return 'other';
};
const P = []; const say = (s = '') => P.push(s);
const FAM = ['crimeTypes', 'plotHooks', 'ops'];
const perTown = []; const byMech = {}; const drawEntries = []; const refNotTwin = [];
for (const t of m0) {
  const r = ref.get(t.seed);
  for (const fam of FAM) {
    const lines = {};
    for (const dm of ['off', 'dm']) {
      const rp = r.pages[dm]; const pg = t.pages[`${dm}|own`];
      const served = pg.twA[fam]; const twin = pg.twB[fam]; const rf = rp.ref?.[fam];
      if (!Array.isArray(served) || !Array.isArray(twin) || !Array.isArray(rf)) continue;
      const lack = minus(twin, served); const owed = minus(rf, served);
      for (const e of lack) { if (!rf.includes(e)) drawEntries.push(`${t.seed} ${fam} ${dm}: ${e}`); }
      for (const e of owed) { if (!twin.includes(e)) refNotTwin.push(`${t.seed} ${fam} ${dm}: ${e}`); }
      if (owed.length || lack.length) lines[dm] = { lack, owed };
    }
    if (!Object.keys(lines).length) continue;
    // the gated settings that show the shortfall (step 1's pages, either engine)
    const sets = Object.entries(t.pages).filter(([, p]) => Array.isArray(p.twA[fam]) && Array.isArray(p.twB[fam]) && minus(p.twB[fam], p.twA[fam]).length).map(([k]) => k);
    const ent = [...new Set(Object.values(lines).flatMap((x) => x.owed))];
    const ms = ent.map((e) => `${e.length > 60 ? `${e.slice(0, 57)}...` : e} [${mech(t, fam, e)}]`);
    for (const e of ent) { const m = mech(t, fam, e); ((byMech[m] ||= { towns: new Set(), items: {} }).towns.add(t.seed)); byMech[m].items[e.slice(0, 60)] = (byMech[m].items[e.slice(0, 60)] || 0) + 1; }
    perTown.push(`  ${t.seed} (${t.size}, ${t.crisis}) | ${fam} | hidden ${t.hidden.length} | owed by the record: ${ms.join('; ')} | twin lacks-by-page: ${lines.off ? `off ${lines.off.lack.length}` : 'off 0'}, ${lines.dm ? `dm ${lines.dm.lack.length}` : 'dm 0'} | settings ${sets.length}: ${[...new Set(sets.map((k) => k.split('|')[1]))].join(' ')} (${[...new Set(sets.map((k) => k.split('|')[0]))].join('+')})`);
  }
}
say('R3-TELL-7: THE CAUSES BY THE RECORD (ref.probe.jsx: generateSafetyProfile(served config, served tier, served houses), the own setting)');
say(`Hidden-house towns: ${m0.length}. The record reference faithful: the engine re-run on the STORED config and ALL stored houses gives the stored crimeTypes and criminalInstitutions on every page (ref.json refStoredAllHouses; plotHooks only with the birth's seed active: the smuggling hook draws by seed)`);
say('');
say('PER TOWN (each strict-part town and family; what the record owes the page, each entry with its MECHANISM; the gated settings that show it)');
for (const l of perTown.sort()) say(l);
say('');
say('BY MECHANISM (distinct towns; entries)');
for (const [m, x] of Object.entries(byMech)) say(`  ${m}: ${x.towns.size} town(s) [${[...x.towns].join(', ')}]; entries ${JSON.stringify(x.items)}`);
say('');
say(`DRAW: entries the twin shows that the page lacks and the record does NOT owe: ${drawEntries.length}${drawEntries.length ? `: ${drawEntries.join('; ')}` : ''}`);
say(`THE RECORD OWES WHAT THE TWIN LACKS (the twin's draw the other way): ${refNotTwin.length}${refNotTwin.length ? `: ${refNotTwin.join('; ')}` : ''}`);
let cBad = 0; const cList = [];
for (const r of refC) for (const dm of ['off', 'dm']) for (const fam of ['crimeTypes', 'ops']) { const p = r.pages[dm]; const s = p.served?.[fam]; const rf = p.ref?.[fam]; if (Array.isArray(s) && Array.isArray(rf) && (minus(rf, s).length || minus(s, rf).length)) { cBad += 1; cList.push(`${r.seed} ${dm} ${fam}`); } }
say(`THE CONTROLS (the gate's ${refC.length} nothing-hidden births, own, off and DM): pages where the record reference differs from the served list (crimeTypes, ops): ${cBad}${cBad ? `: ${cList.join('; ')}` : ''}`);
console.log(P.join('\n'));
