// BIRTH-2-COUNT, the owner's addendum (the causes ALIGN WITH THE IMPORTS). Over a rule's corpus, read by the rule's tree:
// (b) for every kept source house on no ground (the base's barren houses, still standing): kind · cause · route state
//     (connected, besieged, isolated) · the import line on `economicState.primaryImports` that pairs with the cause · the
//     mark the card prints (`housesShortOf`: "Short of <good>."; under a siege, `crisisStoppedRow.js ::
//     housesOnImportedInput`: "Curtailed by the siege."; else none) · what the Imports heading prints (`tradeListsAsPrinted`).
// (c) THE REVERSE, towns where it is false: c1 an import feeds a house the page calls exhausted (a kind (ii) house whose own
//     grounds on the record are every one spent, not marked short); c2 an export or Produced-locally pill AS PRINTED names
//     the good of such a house; c3 "Needed, and not brought in" names a material the imports list names (`needMetBy`).
//   BASE=<base root> TIP=<rule root> BIRTH_RULE=… node docs/chair/2026-11-17/birth/probes/b2align.mjs <base.gz> <rule.gz>
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
import { kindOf, groundsOf } from './kinds.mjs';
import { landOf } from './q2land.mjs';
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const arr = (x) => (Array.isArray(x) ? x : []);
const TIP = path.resolve(process.env.TIP);
const F = await import(TIP + '/src/domain/facts/houseInputAtHand.js');
const CS = await import(TIP + '/src/domain/display/crisisStoppedRow.js');
const TL = await import(TIP + '/src/domain/display/tradeListDisplay.js');
const { catalogIdForName } = await import(TIP + '/src/data/institutionalCatalog.js');
const { hasTradeRouteConnection } = await import(TIP + '/src/domain/tradeRouteSemantics.js');
const { resourceShortageImport } = await import(TIP + '/src/domain/resourceSemantics.js');
const GOOD = { stone_quarry: /\bstone\b/i, charcoal_burner: /charcoal/i, dairy_farmer: /dairy|cheese|butter|milk/i, salt_works: /\bsalt\b/i, mine: /\bore\b|\biron\b|\bcoal\b/i, mine_open_cast: /\bore\b|\biron\b|\bcoal\b/i, peat_cutter: /\bpeat\b/i, fisher_s_landing: /fish/i, fishing_community: /fish/i, hunter_s_lodge: /game|pelt|fur/i, shepherd: /wool/i, wildfowler: /fowl/i, woodcutter_s_camp: /timber|wood/i };
const BOUGHT = { charcoal_burner: 'Timber', salt_works: 'Salt', dairy_farmer: 'Fodder and hay' };
const BARREN = new Set(['stone_quarry', 'charcoal_burner', 'salt_works', 'dairy_farmer', 'mine', 'mine_open_cast', 'peat_cutter']);
const idOf = (i) => String(i?.catalogId || catalogIdForName(String(i?.name ?? '')) || '');
const coast = (s) => String(s?.config?.tradeRouteAccess) === 'port' || String(s?.config?.terrainOverride) === 'coastal';
const spentOwn = (s, id) => { if (id === 'salt_works' && coast(s)) return null; /* R5: on a coast the sea is its brine */ const g = groundsOf(id) || []; const near = arr(s?.config?.nearbyResources), dep = arr(s?.config?.nearbyResourcesDepleted); const have = g.filter((k) => near.includes(k)); return have.length && have.every((k) => dep.includes(k)) ? have[0] : null; };
const [fb, ft] = process.argv.slice(2); const B = load(fb), T = load(ft);
const table = {}; const ex = {}; const c = { c1: new Set(), c2: new Set(), c3: new Set() }; const cx = { c1: {}, c2: {}, c3: {} };
for (const [seed, sb] of B) {
  const st = T.get(seed); if (!st) continue;
  const route = String(st.config?.tradeRouteAccess ?? ''); const siege = arr(st.config?.stressTypes).includes('under_siege');
  const state = !hasTradeRouteConnection(route) ? 'isolated' : siege ? 'besieged' : 'connected';
  const short = F.housesShortOf(st), curtailed = CS.housesOnImportedInput(st);
  const imps = arr(st.economicState?.primaryImports).map(String);
  const lists = TL.tradeListsAsPrinted(st);
  // (b) the kept houses
  for (const inst of arr(sb.institutions)) {
    const id = idOf(inst); if (!BARREN.has(id) || landOf(sb, id).land !== 'absent') continue;
    if (!arr(st.institutions).some((i) => i?.name === inst.name)) continue;
    const g = spentOwn(st, id);
    const cause = g ? 'exhausted' : BOUGHT[id] && imps.includes(BOUGHT[id]) ? 'bought in' : 'no cause';
    const line = g ? (imps.find((x) => x === resourceShortageImport(g)) ?? `(none: ${resourceShortageImport(g)} not on the list)`) : cause === 'bought in' ? BOUGHT[id] : '(none)';
    const mark = short.has(inst.name) ? `Short of ${short.get(inst.name)}.` : siege && curtailed.has(inst.name) ? 'Curtailed by the siege.' : '(no mark)';
    const heading = lists.tradeStopped ? 'Imports heading left out (trade stopped)' : lists.imports.includes(line) ? 'Imports prints it' : 'Imports does not print it';
    const k = `${id} | ${cause} | ${state} | ${line.replace(/\(local [^)]*\)/, '(local …)')} | ${mark.replace(/Short of .*\./, 'Short of <good>.')} | ${heading}`;
    table[k] = (table[k] || 0) + 1; (ex[k] ||= []).length < 2 && ex[k].push(seed);
  }
  // (c) the reverse, over every kind (ii) house the page calls exhausted
  for (const inst of arr(st.institutions)) {
    if (!inst || typeof inst.name !== 'string' || inst.status === 'ruined') continue;
    const id = idOf(inst); if (kindOf(id) !== 'ii' || !GOOD[id]) continue;
    if (!spentOwn(st, id)) continue;
    if (!short.has(inst.name) && !(siege && curtailed.has(inst.name))) { c.c1.add(seed); cx.c1[id] = (cx.c1[id] || 0) + 1; }
    const pill = [...lists.exports, ...lists.local].find((x) => GOOD[id].test(String(x)));
    if (pill) { c.c2.add(seed); cx.c2[`${id}: ${pill}`] = (cx.c2[`${id}: ${pill}`] || 0) + 1; }
  }
  for (const n of lists.needed) { const hit = imps.find((imp) => TL.needMetBy(n, imp)); if (hit) { c.c3.add(seed); cx.c3[`${n} <- ${hit}`] = (cx.c3[`${n} <- ${hit}`] || 0) + 1; } }
}
console.log('| kind | cause | route | the import line | the card\'s mark | the Imports heading | houses | two towns |');
console.log('|---|---|---|---|---|---|---|---|');
for (const [k, v] of Object.entries(table).sort()) console.log(`| ${k} | ${v} | ${ex[k].join(', ')} |`);
for (const k of ['c1', 'c2', 'c3']) console.log(`${k}: towns ${c[k].size} · ${Object.entries(cx[k]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([x, n]) => `${x} ${n}`).join('; ')}`);
