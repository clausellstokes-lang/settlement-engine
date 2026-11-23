// LIT-13G (CLOSE-6 unit (1b)): rule 13g counted over the census's 900 births and the control r2r-city-5, on one tree.
// usage: TREE=<tree root> node count13g.mjs <label> <force: none|seat1|fortune1> <out.jsonl>
// The births are the product's (births-sha.mjs's pattern, close-3): generateSettlementPipeline(birthConfig({ settType }), null,
// { seed, customContent: {} }) after loadGenerationLawPayloads(). `seat1`/`fortune1` set ONE law's key to 1 on the config
// birthConfig returned (birthConfig clamps an incoming marker off, so the force is applied after it, on the config passed).
// The control r2r-city-5 is born as tests/generators/bar8Powers.test.js births it (its configOf, over DEFAULT_CONFIG).
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const TREE = process.env.TREE; const R = TREE + '/src/';
const head = () => execFileSync('git', ['-C', TREE, 'rev-parse', '--short=9', 'HEAD']).toString().trim();
const headAtStart = head();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + 'store/configSlice.js');
await loadGenerationLawPayloads();
const [label, force = 'none', out] = process.argv.slice(2);
const FORCE = { none: {}, seat1: { _seatLawVersion: 1 }, fortune1: { _fortuneLawVersion: 1 } }[force];
if (!FORCE) throw new Error(`force: none|seat1|fortune1, not ${force}`);

// ── VERBATIM from tests/generators/bar8Powers.test.js (the same in both trees at 9b0ffaa97 and 8f882d0f0) ──
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** PAGE-COPY seedcfg.mjs's arms (the census's r2r-/r2s- and the bar's bar0-), verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return { ...dials, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
  }
  throw new Error(`a guard seed is a census or a read seed: ${seed}`);
}
const WAR_OF_ARRESTS = /\bA slow war with the guild\b|\bthe guild can make every investigation costly\b|\bcan arrest their people\b|\benough to keep it down but not to stamp it out\b/i;
/** @param {any} town @returns {any[]} */
const powersOf = (town) => (Array.isArray(town?.powerStructure?.factions) ? town.powerStructure.factions : []);
/** @param {any} town @returns {boolean} the record's relation rows say the guild has bought the seat or the force */
const tieBought = (town) => (town?.powerStructure?.factionRelationships || []).some((/** @type {any} */ r) => r?.captureState !== undefined && r?.type === 'corrupted');
// ── end verbatim ──

/** (B): a bought row whose pair is one power of category 'criminal' and one of category 'military' (the record's own
 * `category` field on powerStructure.factions), and a card of either of THOSE two powers matching WAR_OF_ARRESTS. */
function ruleB(town) {
  const fs = powersOf(town); const byName = (n) => fs.find((f) => f.faction === n);
  const hits = [];
  for (const r of town?.powerStructure?.factionRelationships || []) {
    if (!(r?.captureState !== undefined && r?.type === 'corrupted') || !Array.isArray(r.pair)) continue;
    const [a, b] = r.pair.map(byName); if (!a || !b) continue;
    const cats = [a.category, b.category];
    if (!(cats.includes('criminal') && cats.includes('military'))) continue;
    for (const f of [a, b]) if (WAR_OF_ARRESTS.test(String(f.desc || ''))) hits.push(`${f.faction} [${f.category}]`);
  }
  return hits;
}

function count(seed, size, town) {
  const bought = tieBought(town);
  const warCards = powersOf(town).filter((f) => WAR_OF_ARRESTS.test(String(f.desc || '')));
  const B = ruleB(town);
  const rows = (town?.powerStructure?.factionRelationships || []).filter((r) => r?.captureState !== undefined)
    .map((r) => ({ pair: r.pair, cats: (r.pair || []).map((n) => powersOf(town).find((f) => f.faction === n)?.category), type: r.type, captureState: r.captureState }));
  return {
    seed, size, bought, war: warCards.length > 0, A: bought && warCards.length > 0, B: B.length > 0,
    warCards: warCards.map((f) => ({ faction: f.faction, category: f.category, isGoverning: !!f.isGoverning, line: (String(f.desc).match(WAR_OF_ARRESTS) || [''])[0] })),
    Bcards: B, captureRows: rows, criminalCaptureState: town?.powerStructure?.criminalCaptureState,
    governing: powersOf(town).filter((f) => f.isGoverning).map((f) => `${f.faction} [${f.category}]`),
    laws: Object.fromEntries(Object.entries(town?.config || {}).filter(([k]) => /LawVersion/.test(k))),
  };
}

const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const lines = [];
const N = Number(process.env.N || 150);
for (const settType of sizes) for (let i = 0; i < N; i++) {
  const seed = `dp-${settType}-${i}`;
  const town = generateSettlementPipeline({ ...birthConfig({ settType }), ...FORCE }, null, { seed, customContent: {} });
  lines.push(count(seed, settType, town));
}
{
  const seed = 'r2r-city-5';
  const town = generateSettlementPipeline({ ...boundaryCfg(seed), ...FORCE }, null, { seed, customContent: {} });
  lines.push({ ...count(seed, 'control', town), control: true });
}
function boundaryCfg(seed) { return birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }); }
writeFileSync(out, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
const headAtEnd = head();
const tally = {};
for (const l of lines) {
  const t = (tally[l.size] ||= { births: 0, bought: 0, war: 0, A: 0, B: 0 });
  t.births++; t.bought += +l.bought; t.war += +l.war; t.A += +l.A; t.B += +l.B;
}
console.log(JSON.stringify({ label, force, tree: TREE, headAtStart, headAtEnd, laws: lines[0].laws, tally }));
