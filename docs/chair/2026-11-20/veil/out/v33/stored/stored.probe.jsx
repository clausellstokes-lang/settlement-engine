// V33-C1 (STORED-UNIVERSE) PIECE 1: THE STORED DUMP. Every birth of the lane's pool (LP_POOL: part A pool-shard*.json, part B
// poolb-shard*.json, all of them) and the gate's 140 towns (tell-common.mjs :: pool, N=2), born by THIS tree (RV6_SRC) with the
// SAME seeds and configs as dump.probe.jsx (cfgOf, birthConfig), then carried down the app's own path to the row and STORED BY
// saves.js ITSELF (its exported `saves.save`, the call SaveToLibraryButton makes), against a mocked supabase that captures the
// inserted row: no network, no credential. The path, each step this tree's own export:
//   fresh   = generateSettlementPipeline(...)                              (workers/generationRequest.js :: runSettlementOp)
//           → carryLockedRosterThroughGenerate(null, fresh, null)          (no previous settlement, no locks: identity)
//           → carryLockedSections(null, null, ·) → reconcileSettlementChange(·, null)   (store/settlementGenerateAction.js; identity)
//           → activateFaithIfEntitled(·)                                   (the store's premium key, since V5 ungated)
//   minted  = settlement.mapEdits ? · : { ...·, mapEdits: newSettlementMapEdits() }      (SaveToLibraryButton.jsx, create chokepoint)
//   row     = saves.save({ name, tier, settlement: minted, config: minted._config || null })  → supabaseSave → row.data
// Out: LP_OUT/docs/<seed>.json (row.data after the jsonb round trip, the STORED document), LP_OUT/births/<seed>.json (the bare
// pipeline result, the same round trip), LP_OUT/docs/index-shard<s>.json (the read-stored mode's index) and
// LP_OUT/diff-shard<s>.json: per document the key paths (array indices as []) the stored form carries that the birth does not,
// the reverse, and the leaves whose value differs (same exact path), against TWO births: `bare` (the pipeline's own result)
// and `lane` (tell-common.mjs :: birth: the bare result with publicProse composed on it, what the lane's proofs read).
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({
  isConfigured: true,
  supabase: {
    rpc: async () => ({ data: null, error: null }),
    auth: { getUser: async () => ({ data: { user: { id: '11111111-1111-1111-1111-111111111111' } } }) },
    from: () => ({ insert: (row) => { globalThis.__C1_ROW = row; return { select: () => ({ single: async () => ({ data: { id: 'c1' }, error: null }) }) }; } }),
  },
}));
const SRC = process.env.RV6_SRC;
const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const CRISES = 'none,infiltrated,none,insurgency,occupied,indebted,none,under_siege,wartime,politically_fractured'.split(',');
const TSIZES = 'village,town,town,city,city,metropolis,metropolis'.split(',');
const SIZES = ['village', 'town', 'city', 'metropolis'];
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
/** Every key path (generalized, [] for an index) and every leaf (exact path -> JSON value). */
const shape = (v) => {
  const keys = new Set(); const leaf = new Map();
  const go = (x, p, g) => {
    if (Array.isArray(x)) { if (!x.length) leaf.set(p, '[]'); x.forEach((y, i) => { keys.add(`${g}[]`); go(y, `${p}[${i}]`, `${g}[]`); }); }
    else if (isRec(x)) { const ks = Object.keys(x); if (!ks.length) leaf.set(p, '{}'); for (const k of ks) { const q = g ? `${g}.${k}` : k; keys.add(q); go(x[k], p ? `${p}.${k}` : k, q); } }
    else leaf.set(p, JSON.stringify(x));
  };
  go(v, '', ''); return { keys, leaf };
};
const gen = (p) => p.replace(/\[\d+\]/g, '[]');
const diffOf = (birth, stored) => {
  const a = shape(birth); const b = shape(stored);
  const storedOnly = [...b.keys].filter((k) => !a.keys.has(k)).sort();
  const birthOnly = [...a.keys].filter((k) => !b.keys.has(k)).sort();
  const vd = new Map();
  for (const [p, v] of b.leaf) if (a.leaf.has(p) && a.leaf.get(p) !== v) { const g = gen(p); if (!vd.has(g)) vd.set(g, `${p}: birth ${a.leaf.get(p).slice(0, 90)} | stored ${v.slice(0, 90)}`); }
  return { storedOnly, birthOnly, valueDiff: Object.fromEntries(vd) };
};

it('V33-C1 stored dump', async () => {
  const { generateSettlementPipeline, carryLockedRosterThroughGenerate } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { carryLockedSections } = await import(`${SRC}/src/domain/locksPreservation.js`);
  const { reconcileSettlementChange } = await import(`${SRC}/src/domain/settlementReconciliation.js`);
  const { activateFaithIfEntitled } = await import(`${SRC}/src/store/settlementLifecycleHelpers.js`);
  const { newSettlementMapEdits } = await import(`${SRC}/src/domain/townMap/mapEdits.js`);
  const { saves } = await import(`${SRC}/src/lib/saves.js`);
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${SRC}/src/domain/display/publicProse.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  const POOL = process.env.LP_POOL || '/var/tmp/v18/t2/pool-r5c-1';
  const all = (re) => readdirSync(POOL).filter((f) => re.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${POOL}/${f}`, 'utf8')).births);
  const jobs = [
    ...all(/^pool-shard\d+\.json$/).map((b) => ({ role: 'A', seed: b.seed, size: b.size, crisis: b.crisis, k: b.k })),
    ...all(/^poolb-shard\d+\.json$/).map((b) => ({ role: 'B', seed: b.seed, size: b.size, crisis: b.crisis, k: b.k })),
  ];
  let idx = 0;
  for (let k = 0; k < 2; k += 1) for (const size of TSIZES) for (const crisis of CRISES) { idx += 1; jobs.push({ role: 'T', seed: `r3m-${size}-${crisis}-${k}-${idx}`, size, crisis, k }); }
  const OUT = process.env.LP_OUT; mkdirSync(`${OUT}/docs`, { recursive: true }); mkdirSync(`${OUT}/births`, { recursive: true });
  const index = []; const diffs = [];
  for (const [i, j] of jobs.entries()) {
    if (process.env.LP_LIMIT && i >= Number(process.env.LP_LIMIT)) break;
    if (i % SHARD[1] !== SHARD[0]) continue;
    let dial = null;
    const fresh = generateSettlementPipeline(birthConfig(cfgOf(j.size, j.crisis)), null, { seed: j.seed, customContent: {}, onStep: (_n, ctx) => {
      if (typeof ctx?.effectiveConfig?.priorityCriminal === 'number') dial = ctx.effectiveConfig.priorityCriminal;
    } });
    const bare = clone(fresh);
    const lane = (() => { const t = { ...clone(fresh) }; delete t.publicProse; return clone(withPublicProse(t, composePublicProse(t))); })();
    const { settlement: withRoster } = carryLockedRosterThroughGenerate(null, fresh, null);
    const locked = carryLockedSections(null, null, withRoster);
    const reconciled = reconcileSettlementChange(locked, null, { source: 'regenerate', changeType: 'GENERATE_SETTLEMENT', changeLabel: locked?.name });
    const withFaith = activateFaithIfEntitled(reconciled, () => ({}));
    const minted = withFaith.mapEdits ? withFaith : { ...withFaith, mapEdits: newSettlementMapEdits() };
    globalThis.__C1_ROW = null;
    await saves.save({ name: minted.name || 'Untitled Settlement', tier: minted.tier || 'unknown', settlement: minted, config: minted._config || null });
    if (!globalThis.__C1_ROW) throw new Error(`saves.save inserted no row: ${j.seed}`);
    const doc = clone(globalThis.__C1_ROW.data);
    writeFileSync(`${OUT}/docs/${j.seed}.json`, JSON.stringify(doc));
    writeFileSync(`${OUT}/births/${j.seed}.json`, JSON.stringify(bare));
    index.push({ ...j, dial, hasPublicProse: 'publicProse' in doc, rowCols: Object.keys(globalThis.__C1_ROW).sort() });
    diffs.push({ seed: j.seed, role: j.role, size: j.size, bare: diffOf(bare, doc), lane: diffOf(lane, doc), faithChanged: withFaith !== reconciled, identity: withRoster === fresh && locked === withRoster && reconciled === locked });
  }
  writeFileSync(`${OUT}/docs/index-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, ended: new Date().toISOString(), index }));
  writeFileSync(`${OUT}/diff-shard${SHARD[0]}.json`, JSON.stringify({ src: SRC, diffs }));
}, 14_400_000);
