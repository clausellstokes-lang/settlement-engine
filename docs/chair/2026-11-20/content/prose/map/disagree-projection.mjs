// DISAGREE STEP B1 (PROSE-6's builder): the RE-PROJECTION of the final lines (DISAGREE-LINES.md at 18a9791b3) on the
// UNCURED tree, before any pool is touched. Read-only. Run: TREE=<tree> node <script> [N=150].
// Phase 1's method: each cell's pool is taken from the generated leaf and CURED IN MEMORY as the lines say (the flat rows
// gain their mark; the new lines go at the END with the next vids); the key through the desk's own key function; the
// eligible set through `stateProseKernel.js :: eligibleVariants` with the desk's own entry answers
// (factsAnswered ∘ crisisAnswered ∘ wallsAnswered) and the print's own audience and seed (`printProse.js`: 'dm',
// String(_seed ?? id ?? '')); the line drawn through the kernel's own `drawVariant(eligible, blockId, poolKey, seed)`.
// SANITY: the same draw on the UNCURED pool is checked against the variant the page printed (the tooth helper's
// matchers, one vid a side), where the page printed one.
// Grounds: `atomHolds('food: ≥ secure')` and `atomHolds('stores: < 12')` on factsOf (undefined = unknown).
const T = process.env.TREE || '/home/user/wt-disagree';
const R = T + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { eligibleVariants, drawVariant } = await import(R + 'domain/display/stateProse/stateProseKernel.js');
const { economicRowPoolKey, foodTradesPoolKey } = await import(R + 'domain/display/stateProse/defenseStateProse.js');
const { institutionsPoolKey } = await import(R + 'domain/display/stateProse/generalStateProse.js');
const { factsAnswered } = await import(R + 'domain/facts/factsAnswered.js');
const { wallsAnswered } = await import(R + 'domain/defense/defenseFacts.js');
const { crisisAnswered } = await import(R + 'domain/crisis/crisisFacts.js');
const { atomHolds } = await import(R + 'domain/facts/factVocabulary.js');
const { matchersOf, pageTextsOf, sidePrinted } = await import(T + '/tests/helpers/oppositeSentencePairs.mjs');
const D = Object.values(await import(R + 'data/dossierStateProse/defense.generated.js'))[0];
const G = Object.values(await import(R + 'data/dossierStateProse/general.generated.js'))[0];
await loadGenerationLawPayloads();

// The cure, in memory: [flat vids, the mark they gain], then the new lines [name, angle, marks, text].
const cured = (pool, flat, gain, lines) => {
  const out = pool.map((v) => (flat.includes(v.vid) ? { ...v, marks: [...(v.marks || []), gain] } : v));
  let vid = Math.max(...pool.map((v) => v.vid));
  const added = lines.map(([name, angle, marks, text]) => ({ name, angle, marks, text, slots: ['settlement'], vid: ++vid }));
  return { pool: [...out, ...added], added };
};
const NS = 'no crisis: under_siege';
const CELLS = {
  CHAIN: { block: 'DS-DEF-2', key: 'CHAIN: food trades failing', old: D['DS-DEF-2'].pools['CHAIN: food trades failing'],
    ...cured(D['DS-DEF-2'].pools['CHAIN: food trades failing'], [1, 2, 3, 4], 'food: ≤ pressured', [
      ['F1', 'ledger', [NS, 'food: ≥ secure', 'stores: < 12'], "{settlement} eats well enough today, but its food trades are failing, and less is being put by than it would need if it were cut off."],
      ['F2', 'street', [NS, 'food: ≥ secure', 'stores: < 12'], 'There is food enough on the tables at {settlement}, though its food trades are failing and its stores are thinner for it.'],
      ['F3', 'unfolding', [NS, 'food: ≥ secure', 'stores: < 12'], "{settlement}'s tables are full for now, but its food trades are failing, and what they fail to put by would be missed only if it were cut off."],
      ['F4', 'visitor', [NS, 'food: ≥ secure'], 'The tables at {settlement} are full, but the trades that put food by against hard times are failing.'],
      ['F5', 'ledger', [NS, 'food: ≥ secure', 'stores: ≥ 12'], '{settlement} eats well and has stores laid by, though the trades that should go on putting food by are failing.'],
      ['F6', 'street', [NS, 'food: ≥ secure', 'stores: ≥ 12'], 'There is enough on the tables at {settlement} and stores laid by besides, but its food trades are failing.'],
    ]) },
  WEAK: { block: 'DS-DEF-2', key: 'Economic Survival: WEAK', old: D['DS-DEF-2'].pools['Economic Survival: WEAK'],
    ...cured(D['DS-DEF-2'].pools['Economic Survival: WEAK'], [1, 2], 'no force: paid', [
      ['W1', 'ledger', ['guardPresence', 'force: paid', 'prosperity: ≤ comfortable'], '{settlement} keeps paid guards, but nothing is laid by to pay them through a long defence.'],
      ['W2', 'street', ['guardPresence', 'force: paid', 'prosperity: ≤ comfortable'], 'Those who guard {settlement} draw wages, and they know nothing is laid by to go on paying them through a long defence.'],
      ['W3', 'threshold', ['guardPresence', 'force: paid', 'prosperity: ≤ comfortable'], '{settlement} has paid guards and little to pay them with: a long defence would find the money gone.'],
    ]) },
  GARR: { block: 'DS-GEN-17', key: 'GARRISONED', old: G['DS-GEN-17'].pools.GARRISONED,
    ...cured(G['DS-GEN-17'].pools.GARRISONED, [2], 'force: paid', []) },
};
const NEW = [...CELLS.CHAIN.added, ...CELLS.WEAK.added].map((v) => v.name);
const N = Number(process.argv[2] || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const share = Object.fromEntries(SIZES.map((z) => [z, Object.fromEntries(NEW.map((n) => [n, 0]))]));
const empty = {}; // `${cell} ${ground}` → { held, emptyBefore, emptyAfter }
const sanity = { agree: 0, disagree: 0, list: [] };
const beside = {}; // new line → { 'ECO9 v…' | 'G17 v…' : count }
const F6ground = { held: 0, eligible: 0, drawn: 0 };
const side = (desk, position, pool, vid) => ({ desk, position, pool, vids: [vid] });
const SECURE = Array.from({ length: 10 }, (_, i) => side('economy', 'DS-ECO-9', 'SECURE', i + 1));
const GARRS = [1, 2].map((v) => side('general', 'DS-GEN-17', 'GARRISONED', v));
for (const settType of SIZES) {
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const texts = pageTextsOf(buildPrintProse(s, {}));
    const pseed = String(s._seed ?? s.id ?? '');
    const read = { ...factsAnswered(s, crisisAnswered(s, wallsAnswered(s, { slots: { settlement: s.name } }))), audience: 'dm' };
    const food = atomHolds('food: ≥ secure', read.facts); const lt12 = atomHolds('stores: < 12', read.facts);
    const g = `${food === undefined ? 'food?' : food ? 'food≥secure' : 'food<secure'} × ${lt12 === undefined ? 'stores?' : lt12 ? 'stores<12' : 'stores≥12'}`;
    const keys = {
      WEAK: economicRowPoolKey(s?.defenseProfile?.scores?.economic) === CELLS.WEAK.key,
      CHAIN: foodTradesPoolKey(s?.defenseProfile?.chainModifiers) === CELLS.CHAIN.key,
      GARR: institutionsPoolKey(s?.economicState?.compound?.inst, s) === CELLS.GARR.key,
    };
    const drawn = {};
    for (const [cell, c] of Object.entries(CELLS)) {
      if (!keys[cell]) continue;
      const before = eligibleVariants(c.old, read); const after = eligibleVariants(c.pool, read);
      const e = (empty[`${cell} | ${g}`] ||= { held: 0, emptyBefore: 0, emptyAfter: 0 });
      e.held++; if (!before.length) e.emptyBefore++; if (!after.length) e.emptyAfter++;
      drawn[cell] = drawVariant(after, c.block, c.key, pseed);
      const was = drawVariant(before, c.block, c.key, pseed);
      if (cell !== 'CHAIN' && was) { // sanity: the uncured draw against the page
        const desk = cell === 'GARR' ? 'general' : 'defense';
        const hit = c.old.filter((v) => sidePrinted(matchersOf(side(desk, c.block, c.key, v.vid)), texts)).map((v) => v.vid);
        if (hit.length) { if (hit.includes(was.vid)) sanity.agree++; else { sanity.disagree++; if (sanity.list.length < 5) sanity.list.push(`${seed} ${cell} drew v${was.vid} page v${hit}`); } }
      }
    }
    // the supply clause composes only beside its row's own spine (`rungWith`): the economic row must draw.
    const econKey = economicRowPoolKey(s?.defenseProfile?.scores?.economic);
    const econPool = econKey === CELLS.WEAK.key ? CELLS.WEAK.pool : D['DS-DEF-2'].pools[econKey];
    const econDraws = !!(econKey && econPool && eligibleVariants(econPool, read).length);
    const printedNew = [];
    if (drawn.WEAK?.name) printedNew.push(drawn.WEAK.name);
    if (econDraws && drawn.CHAIN?.name) printedNew.push(drawn.CHAIN.name);
    if (keys.CHAIN && food === true && lt12 === false && atomHolds('crisis: under_siege', read.facts) !== true) {
      F6ground.held++;
      if (eligibleVariants(CELLS.CHAIN.pool, read).some((v) => v.name === 'F6')) F6ground.eligible++;
      if (econDraws && drawn.CHAIN?.name === 'F6') F6ground.drawn++;
    }
    for (const n of printedNew) {
      share[settType][n]++;
      const b = (beside[n] ||= {});
      for (const sd of n.startsWith('F') ? SECURE : GARRS) if (sidePrinted(matchersOf(sd), texts)) { const k = `${sd.position === 'DS-ECO-9' ? 'ECO9' : 'G17'} v${sd.vids[0]}`; b[k] = (b[k] || 0) + 1; }
      if (n.startsWith('W') && drawn.GARR) { const k = `G17 drawn-after v${drawn.GARR.vid}`; b[k] = (b[k] || 0) + 1; }
    }
  }
}
console.log('SHARE of places of a size (count/' + N + ')');
console.log(['size', ...NEW].join('\t'));
for (const z of SIZES) console.log([z, ...NEW.map((n) => `${share[z][n]} (${(100 * share[z][n] / N).toFixed(1)}%)`)].join('\t'));
console.log('\nNO CELL LEFT EMPTY: cell | ground\theld\temptyBefore\temptyAfter');
for (const k of Object.keys(empty).sort()) console.log(`${k}\t${empty[k].held}\t${empty[k].emptyBefore}\t${empty[k].emptyAfter}`);
console.log('\nF6 ground (CHAIN key, food≥secure, stores≥12, no siege):', JSON.stringify(F6ground));
console.log('BESIDE:', JSON.stringify(beside));
console.log('SANITY (uncured draw vs page, WEAK and GARR):', JSON.stringify(sanity));
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${N * SIZES.length} births`);
