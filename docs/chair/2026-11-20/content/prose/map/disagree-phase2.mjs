// DISAGREE PHASE 2 PROOFS (b), (c), (c2) (PROSE-6's builder): run on a tree, read-only. TREE=<tree> node <script> [N=150].
// Pages are `buildPrintProse(s, {})`; a line is found on the page by the tooth's own matchers
// (`tests/helpers/oppositeSentencePairs.mjs`, the worktree's: one vid a side, templates with their clause-cut forms).
// (b) each branch's reach by size and each new line's share; (c) the 900 through OPPOSITE_PAIRS, and which ECO-9 SECURE and
// GEN-17 GARRISONED variants print beside each new line; (c2) the pages where a cell's key holds over an empty eligible set
// (the tree's own kernel, leaves and desk entry answers). Also: the pinned tail's pages, and seeds for the tooth's controls.
const T = process.env.TREE || '/home/user/wt-disagree';
const R = T + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { eligibleVariants } = await import(R + 'domain/display/stateProse/stateProseKernel.js');
const { economicRowPoolKey, foodTradesPoolKey } = await import(R + 'domain/display/stateProse/defenseStateProse.js');
const { institutionsPoolKey } = await import(R + 'domain/display/stateProse/generalStateProse.js');
const { factsAnswered } = await import(R + 'domain/facts/factsAnswered.js');
const { wallsAnswered } = await import(R + 'domain/defense/defenseFacts.js');
const { crisisAnswered } = await import(R + 'domain/crisis/crisisFacts.js');
const H = await import('/home/user/wt-disagree/tests/helpers/oppositeSentencePairs.mjs');
const D = Object.values(await import(R + 'data/dossierStateProse/defense.generated.js'))[0];
const G = Object.values(await import(R + 'data/dossierStateProse/general.generated.js'))[0];
await loadGenerationLawPayloads();

const side = (desk, position, pool, vid) => ({ desk, position, pool, vids: [vid] });
const NEWLINES = [
  ...['F1', 'F2', 'F3', 'F4', 'F5', 'F6'].map((n, i) => [n, side('defense', 'DS-DEF-2', 'CHAIN: food trades failing', 7 + i)]),
  ...['W1', 'W2', 'W3'].map((n, i) => [n, side('defense', 'DS-DEF-2', 'Economic Survival: WEAK', 7 + i)]),
];
const SECURE = Array.from({ length: 10 }, (_, i) => side('economy', 'DS-ECO-9', 'SECURE', i + 1));
const GARRS = [1, 2].map((v) => side('general', 'DS-GEN-17', 'GARRISONED', v));
const CELLS = [
  ['CHAIN', D['DS-DEF-2'].pools['CHAIN: food trades failing'], 'CHAIN: food trades failing', (s) => foodTradesPoolKey(s?.defenseProfile?.chainModifiers)],
  ['WEAK', D['DS-DEF-2'].pools['Economic Survival: WEAK'], 'Economic Survival: WEAK', (s) => economicRowPoolKey(s?.defenseProfile?.scores?.economic)],
  ['GARR', G['DS-GEN-17'].pools.GARRISONED, 'GARRISONED', (s) => institutionsPoolKey(s?.economicState?.compound?.inst, s)],
];
const N = Number(process.argv[2] || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const NAMES = NEWLINES.map(([n]) => n);
const by = Object.fromEntries(SIZES.map((z) => [z, { FOOD: 0, WAGES: 0, ...Object.fromEntries(NAMES.map((n) => [n, 0])) }]));
const pairs = {}; const beside = {}; const empty = {}; const tail = []; const ctl = {};
// Real installed (pre-cure leaves hold no v7+): a side that names a vid the tree's pool lacks prints nowhere.
const has = (sd) => { try { H.textsOf(sd); return true; } catch { return false; } };
for (const settType of SIZES) {
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const texts = H.pageTextsOf(buildPrintProse(s, {}));
    const printed = NEWLINES.filter(([, sd]) => {
      const pool = (sd.pool === 'GARRISONED' ? G['DS-GEN-17'] : D['DS-DEF-2']).pools[sd.pool];
      return pool.some((v) => v.vid === sd.vids[0]) && has(sd) && H.sidePrinted(H.matchersOf(sd), texts);
    }).map(([n]) => n);
    for (const n of printed) {
      by[settType][n]++;
      const b = (beside[n] ||= {});
      for (const sd of n.startsWith('F') ? SECURE : GARRS) if (H.sidePrinted(H.matchersOf(sd), texts)) { const k = `${sd.position === 'DS-ECO-9' ? 'SECURE' : 'GARRISONED'} v${sd.vids[0]}`; b[k] = (b[k] || 0) + 1; }
    }
    if (printed.some((n) => n.startsWith('F'))) by[settType].FOOD++;
    if (printed.some((n) => n.startsWith('W'))) by[settType].WAGES++;
    for (const id of H.oppositePairsOnPage(texts)) (pairs[id] ||= []).push(seed);
    for (const pin of H.PINNED_TAILS) if (H.sidePrinted(H.tailMatchersOf(pin.side), texts)) tail.push(`${seed}: ${pin.id}`);
    for (const p of H.OPPOSITE_PAIRS) for (const k of ['a', 'b']) if (H.sidePrinted(H.matchersOf(p[k]), texts)) { const c = (ctl[`${p.id} ${k}`] ||= []); if (c.length < 6) c.push(seed); }
    const read = { ...factsAnswered(s, crisisAnswered(s, wallsAnswered(s, { slots: { settlement: s.name } }))), audience: 'dm' };
    for (const [cell, pool, key, keyOf] of CELLS) {
      if (keyOf(s) !== key) continue;
      const e = (empty[cell] ||= { held: 0, empty: [] });
      e.held++;
      if (!eligibleVariants(pool, read).length) e.empty.push(seed);
    }
  }
}
console.log(`(b) REACH AND SHARE (count of ${N} a size)`);
console.log(['size', 'FOOD', 'WAGES', ...NAMES].join('\t'));
for (const z of SIZES) console.log([z, by[z].FOOD, by[z].WAGES, ...NAMES.map((n) => `${by[z][n]} (${(100 * by[z][n] / N).toFixed(1)}%)`)].join('\t'));
console.log('(c) OPPOSITE_PAIRS pages:', JSON.stringify(Object.fromEntries(Object.entries(pairs).map(([k, v]) => [k, `${v.length}: ${v.slice(0, 8).join(' ')}`]))) || '{}');
console.log('(c) BESIDE:', JSON.stringify(beside));
console.log('(c2) NO CELL LEFT EMPTY:', JSON.stringify(empty));
console.log('PINNED TAIL pages:', tail.length, tail.slice(0, 5).join(' '));
console.log('CONTROL seeds:', JSON.stringify(ctl));
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${N * SIZES.length} births`);
