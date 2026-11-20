// birth.mjs <tree> <out.jsonl> [n=100] — births seeds hxd-<size>-0..n-1 in <tree> (born.mjs's birth, its masker),
// writes one row per place: the stored recentConflict, its masked form, the stress kinds, the roster's names, and the
// vocabulary atoms answered (a) on the FINAL record and (b) at the power step's site (roster + tier [+ config]).
import { writeFileSync } from 'node:fs';
const [, , L, OUT, N = '100'] = process.argv;
const { SIZES, masker } = await import(`${L}/docs/chair/2026-11-20/content/depth/measure/born.mjs`);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { atomHolds, isKnownAtom, INSTITUTION_WORDS, TERRAIN_WORDS, ROUTE_WORDS } = await import(`${L}/src/domain/facts/factVocabulary.js`);
await loadGenerationLawPayloads();
export const ATOMS = [
  ...INSTITUTION_WORDS.map((k) => `institution: ${k}`),
  'walls', 'palisade', 'gate', 'watch', 'militia', 'garrison', 'guardPresence', 'court', 'market', 'guild', 'ruling body',
  'river', 'coast', 'navigable', 'port', ...TERRAIN_WORDS.map((k) => `terrain: ${k}`), ...ROUTE_WORDS.map((k) => `route: ${k}`),
  'grain', 'livestock', 'fish', 'game', 'own plots', 'food surplus', 'stores: ≥ 3', 'imports', 'exports',
  'church', 'priest', 'sacredHouse', 'trade at work: dairy', 'trade at work: cloth', 'iron at hand', 'timber at hand',
  'crisis: calm',
].filter((a) => isKnownAtom(a));
const NAME_RX = { 'name:well/water': /\bwell|water source|cistern|spring\b/i, 'name:bridge/ford': /bridge|ford\b/i, 'name:ferry': /ferry/i,
  'name:commons/pasture': /common|pasture|grazing|meadow/i, 'name:orchard/bees': /orchard|beekeep|apiar/i, 'name:smithy': /smith|forge/i,
  'name:mill': /\bmill/i, 'name:granary/stores': /granar|storehouse|store ?house|barn|tithe/i, 'name:walls': /wall|palisade|stockade|rampart/i,
  'name:farmland': /farmland|fields|farm\b/i, 'name:fishing': /fish/i, 'name:market': /market/i, 'name:council/hall': /council|hall|moot|reeve|headman|elder/i };
const rows = [];
for (const size of SIZES) for (let i = 0; i < Number(N); i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const mask = masker(t);
  const rc = t.powerStructure?.recentConflict ?? null;
  const names = (t.institutions || []).map((x) => x?.name).filter(Boolean);
  const finalF = factsOf(t);
  const siteF = factsOf({ institutions: names.map((name) => ({ name })), tier: t.tier });
  const siteCfgF = factsOf({ institutions: names.map((name) => ({ name })), tier: t.tier, config: t.config });
  const at = (f) => Object.fromEntries(ATOMS.map((a) => { const v = atomHolds(a, f); return [a, v === undefined ? null : v]; }));
  rows.push({ size, seed, rc, masked: mask(rc), stress: (t.stress || []).map?.((s) => s?.type ?? s) ?? t.stress, names,
    final: at(finalF), site: at(siteF), siteCfg: at(siteCfgF),
    nameRx: Object.fromEntries(Object.entries(NAME_RX).map(([k, re]) => [k, names.some((n) => re.test(n))])) });
}
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
console.log('rows', rows.length);
