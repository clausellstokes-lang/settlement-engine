// REVIEW-VEIL-11 — ONE ATTACK on VEIL-V102 (cabdfaa69, VR34): the switch now writes only addresses the screen offers, and drops
// deltas on family candidates the screen does not offer, on the claim that such an address governs nothing on that record.
// Executed with the tree's own client: born towns (RV10_GEN for master's shape), each projection (Reveal DM off and on), the
// family's CANDIDATES (81dd06d7e's criminalPartsOf, imported from RV11_OLD) minus the screen's offered addresses. For each such
// address X: under "Hide everything criminal" (the new switch with the model), is X hidden? And does flipping X alone change
// what applyVeil serves? A candidate that is SHOWN after Hide-all and governs something is a criminal part the switch leaves
// shown with no eye to hide it.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC; const GEN = process.env.RV10_GEN || SRC; const OLD = process.env.RV11_OLD;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('v102a', async () => {
  const V = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const SW = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const OLDSW = await import(`${OLD}/src/domain/display/criminalVeilSwitch.js`);
  const { generateSettlementPipeline } = await import(`${GEN}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${GEN}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${GEN}/src/store/configSlice.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = { copies: 0, unoffered: 0, unofferedGoverns: 0, shownAfterHideAndGoverns: 0, offeredHiddenAfterHide: 0, offeredNotHiddenAfterHide: 0, ex: [], kinds: {} };
  let n = 0; const N = Number(process.env.RV10_N || 1);
  for (let k = 0; k < N; k += 1) for (const size of ['village', 'town', 'city', 'metropolis']) for (const crisis of ['none', 'infiltrated', 'insurgency', 'politically_fractured', 'occupied', 'none']) {
    n += 1; const seed = `rv11-v102-${size}-${crisis}-${k}-${n}`;
    const A = JSON.parse(JSON.stringify(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} })));
    for (const shareDm of [false, true]) {
      const pub = V.galleryPayloadFor(A, { shareDm, memberOverrides: null }); out.copies += 1;
      const defaults = V.defaultVeilFor(pub); const present = SW.presentCriminalGroupings(pub); const model = V.curateModelFor(pub, []);
      const offered = SW.offeredAddressesOf(model);
      const cand = OLDSW.criminalPartsOf(defaults, [], present);
      const hide = SW.setCriminalVeil([], defaults, true, present, model); const nowHide = V.resolveVeil(defaults, hide);
      for (const a of SW.criminalPartsOf(defaults, [], present, model)) { if (SW.isPartHidden(nowHide, a)) out.offeredHiddenAfterHide += 1; else out.offeredNotHiddenAfterHide += 1; }
      // everything the screen offers opened (show all), the base for asking whether an unoffered address governs anything
      const show = SW.setCriminalVeil([], defaults, false, present, model);
      for (const x of cand.filter((a) => !offered.has(a))) {
        out.unoffered += 1; const kind = x.replace(/:[^:]*:/, ':<id>:').replace(/^(field:[a-z]+):<id>:/, '$1:<id>:'); out.kinds[kind] = (out.kinds[kind] || 0) + 1;
        const served = (deltas) => JSON.stringify(V.applyVeil(pub, V.resolveVeil(defaults, deltas)));
        const governsOpen = served([...show, { address: x, hidden: false }]) !== served([...show, { address: x, hidden: true }]);
        const governsHide = served([...hide, { address: x, hidden: false }]) !== served([...hide, { address: x, hidden: true }]);
        if (governsOpen || governsHide) { out.unofferedGoverns += 1; if (out.ex.length < 8) out.ex.push(`${seed} dm=${shareDm}: ${x} governs (open ${governsOpen}, under hide ${governsHide}); hidden after Hide-all: ${SW.isPartHidden(nowHide, x)}`); }
        if (governsHide && !SW.isPartHidden(nowHide, x)) out.shownAfterHideAndGoverns += 1;
      }
    }
  }
  writeFileSync(process.env.RV10_OUT, JSON.stringify(out, null, 1));
}, 14_400_000);
