// R5C3: the refinement of R5C3-copies.probe.mjs: (1) how many births store pressureSentence EQUAL to recentConflict, by
// size, and served so (twin, Reveal DM off and on); (2) on a HIDING read (a hideable house, or an owner-hidden power), how
// many serve a pressureSentence equal to the stored sentence; (3) what the other 24-run overlaps are (examples).
const W = '/home/user/wt/r5c/src';
const { generateSettlementPipeline } = await import(`${W}/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${W}/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${W}/store/configSlice.js`);
const { isHideableHouse } = await import(`${W}/domain/people/cardVeil.js`);
const veil = await import(`${W}/domain/display/galleryVeil.js`);
const BIRTH_DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
await loadGenerationLawPayloads();
const clone = (v) => JSON.parse(JSON.stringify(v));
const T = {}; const add = (k) => { T[k] = (T[k] || 0) + 1; }; const ex = [];
for (const prefix of ['r5c2-m3', 'r5c2-m3b']) for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 40; i += 1) {
  const seed = `${prefix}-${size}-${i}`;
  const t = clone(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size }), null, { seed, customContent: {} }));
  const S = t.powerStructure?.recentConflict;
  const hides = (t.institutions || []).some((h) => h && isHideableHouse(h)) || (t.powerStructure?.factions || []).some((f) => f?.hidden === true);
  add(`${size} births`);
  if (t.pressureSentence !== S) continue;
  add(`${size} stored pressureSentence === recentConflict`);
  add('ALL stored pressureSentence === recentConflict');
  for (const dm of [false, true]) {
    const d = veil.projectShareVeil(veil.galleryPayloadFor(clone(t), { shareDm: dm, memberOverrides: null }), null);
    if (d.pressureSentence === S) add(`ALL served (twin, unmarked) dm=${dm} pressureSentence === stored recentConflict${hides ? ' [a HIDING place]' : ''}`);
  }
  if (hides && ex.length < 6) ex.push(`${seed}: ${JSON.stringify(S).slice(0, 160)}`);
}
console.log(JSON.stringify(T, null, 1));
for (const e of ex) console.log(' ', e);
