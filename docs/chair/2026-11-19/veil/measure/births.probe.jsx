// V8-9 (VEIL-17's builder) MEASURE FIRST: THE LARGEST SEARCH ANY BORN TOWN MAKES, AS AN UPPER BOUND. The 240 born towns of
// REVIEW-VEIL-13's probe (seed prefix 'v11-ties', six sizes, calm and infiltrated, twenty each; Langengrund among the 40
// metropolises), each with EVERY house hidden whole (no veil hides more): every house's name (its label where it has none),
// its catalogue identity, and every processing name in the chains. The search as the twin builds it (buildNameSearch: the
// same pattern string as 212's _gallery_veil_name_search, held equal by the guard), its length in code points; and THE
// CUT-OUTS' upper bound: every open name a veil could leave (a house's name, label or identity; a power's faction or
// name) that holds another house's name, counted, with their total length. L x D: a pattern's code points times its
// distinct code points (the compile's memory grows as the states times the colours). Writes one line per town (BIRTHS_OUT) and
// prints the maxima.
//   RV6_SRC=<tree> RV6_PROBE=births.probe.jsx BIRTHS_OUT=<file> npx vitest run --config <this dir>/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v) => (typeof v === 'string' ? v : '');
const cp = (t) => [...t].length;
const ld = (t) => [...t].length * new Set([...t]).size;
it('births: the largest search', async () => {
  const { generateSettlementPipeline: gen } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const density = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await density.loadGenerationLawPayloads();
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { composePublicProse: compose } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { buildNameSearch } = await import(`${SRC}/src/domain/display/gallerySecondHomes.js`);
  const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const N = Number(process.env.R5_N || 20);
  const lines = []; const max = { p: 0, ld: 0, names: 0, needle: 0, held: 0, heldCp: 0, heldLd: 0, len: 0 }; let towns = 0;
  for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const stress of [null, 'infiltrated']) for (let i = 0; i < N; i += 1) {
    const cfg = { ...DEFAULT_CONFIG, ...BROWSER, settType, ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) };
    let born; try { born = gen(density.birthConfig(cfg), null, { seed: `v11-ties-${settType}-${stress || 'calm'}-${i}`, customContent: {} }); } catch { continue; }
    towns += 1;
    const len = JSON.stringify({ ...born, publicProse: compose(born) }).length;
    const houses = (Array.isArray(born.institutions) ? born.institutions : []).filter(isRec);
    const own = (h) => [str(h.name) !== '' ? str(h.name) : str(h.label), str(h.catalogId)].filter(x => x !== '');
    const procs = (Array.isArray(born.economicState?.activeChains) ? born.economicState.activeChains : []).filter(isRec)
      .flatMap(c => (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).filter(x => typeof x === 'string'));
    const names = [...houses.flatMap(own), ...procs];
    const s = buildNameSearch(names, []);
    const p = s?.pattern ?? '';
    const needle = Math.max(0, ...houses.flatMap(own).map(n => cp(buildNameSearch([n], [])?.pattern ?? '')));
    // the cut-outs' upper bound: an open name that holds another house's name (that house hidden, this one open)
    const powers = (Array.isArray(born.powerStructure?.factions) ? born.powerStructure.factions : []).filter(isRec).flatMap(f => [str(f.faction), str(f.name)]).filter(x => x !== '');
    const opens = [...new Set([...houses.flatMap(own), ...powers])];
    let held = 0; let heldCp = 0; let heldLd = 0;
    for (const o of opens) {
      const others = houses.filter(h => !own(h).includes(o)).flatMap(own);
      const so = buildNameSearch(others, [o]);
      if (so && so.blank.length) { held += 1; heldCp += cp(so.blank[0]); heldLd += ld(so.blank[0]); }
    }
    const town = `${settType}/${stress || 'calm'}/${i}`;
    lines.push(`${town} ${born.name} len ${len} houses ${houses.length} names ${names.length} p ${cp(p)} cp, L x D ${ld(p)}, longest needle ${needle} cp, cut-outs <= ${held} (${heldCp} cp, L x D ${heldLd})`);
    if (cp(p) > max.p) max.p = cp(p);
    if (ld(p) > max.ld) max.ld = ld(p);
    if (heldLd > max.heldLd) max.heldLd = heldLd;
    if (names.length > max.names) max.names = names.length;
    if (needle > max.needle) max.needle = needle;
    if (held > max.held) max.held = held;
    if (heldCp > max.heldCp) max.heldCp = heldCp;
    if (len > max.len) max.len = len;
  }
  const summary = `births ${towns}: largest pattern ${max.p} cp, largest L x D ${max.ld}; most names ${max.names}; longest one needle ${max.needle} cp; most cut-outs ${max.held}, longest cut-outs in all ${max.heldCp} cp, L x D ${max.heldLd}; largest town ${max.len} chars`;
  writeFileSync(process.env.BIRTHS_OUT, `${lines.join('\n')}\n${summary}\n`);
  console.log(summary);
}, 14_400_000);
