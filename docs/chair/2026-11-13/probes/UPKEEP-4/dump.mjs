// Birth a corpus in one tree and dump: per birth, a summary line and the whole record.
//   node dump.mjs <tree-root> <corpus: 660|golden> <out-dir> [shard] [shards]
import { createWriteStream, mkdirSync } from 'node:fs';
import { createGzip } from 'node:zlib';
const [root, corpusName, out, shardArg = '0', shardsArg = '1'] = process.argv.slice(2);
const shard = Number(shardArg), shards = Number(shardsArg);
const imp = (p) => import(`${root}/${p}`);
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generateDefenseProfile } = await imp('src/generators/defenseGenerator.js');
const { getInstFlags } = await imp('src/generators/priorityHelpers.js');
const { keepOf } = await imp('src/domain/facts/keep.js').catch(() => ({ keepOf: null }));
const { deriveMagicProfile } = await imp('src/domain/magicProfile.js');
await loadGenerationLawPayloads();

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const HIRED = /mercenar|free company|adventurers'|hireling hall/i;
const WATCH_OF = { village: 'Village watch', town: 'Town watch', city: 'City watch', metropolis: 'City watch' };

/** @type {Array<{ key: string, cohort: string, stress: string, tier: string, make: () => any }>} */
const rows = [];
if (corpusName === '660') {
  const N360 = { village: 60, town: 160, city: 100, metropolis: 40 };
  for (const [tier, n] of Object.entries(N360)) for (let i = 0; i < n; i++) {
    const seed = `agree-${tier}-${i}`;
    rows.push({ key: seed, cohort: '360', stress: 'random', tier, make: () => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed }) });
  }
  for (const tier of ['thorp', 'hamlet']) for (let i = 0; i < 60; i++) {
    const seed = `agree-${tier}-${i}`;
    rows.push({ key: seed, cohort: 'small', stress: 'random', tier, make: () => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed }) });
  }
  for (const stress of ['famine', 'wartime', 'under_siege']) for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 10; i++) {
    const seed = `agree-force-${stress}-${tier}-${i}`;
    rows.push({ key: seed, cohort: 'forced', stress, tier, make: () => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier, selectedStresses: [stress], selectedStressesRandom: false }), null, { seed }) });
  }
} else if (corpusName === 'fence') {
  for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const route of ['road', 'isolated', 'port', 'crossroads']) for (let i = 0; i < 15; i++) {
    const seed = `SUBw4-fence1-${tier}-${route}-${String(i).padStart(3, '0')}`;
    rows.push({ key: seed, cohort: 'fence', stress: 'fence', tier, make: () => generateSettlementPipeline({ settType: tier, tier, tradeRouteAccess: route, culture: 'germanic' }, null, { seed }) });
  }
} else {
  const { goldenCorpus, keyOf } = await imp('tests/helpers/goldenMasterCorpus.js');
  for (const c of goldenCorpus()) {
    const { _seed, ...cfg } = c;
    rows.push({ key: keyOf(c), cohort: 'golden', stress: 'golden', tier: cfg.settType || cfg.tier || '?', make: () => generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }) });
  }
}

mkdirSync(out, { recursive: true });
const sumOut = createWriteStream(`${out}/${corpusName}.summary.${shard}.ndjson`);
const gz = createGzip(); gz.pipe(createWriteStream(`${out}/${corpusName}.records.${shard}.ndjson.gz`));
const label = (p) => (typeof p === 'string' ? p : p?.label ?? p?.tier ?? p?.level ?? null);
let n = 0;
for (let r = shard; r < rows.length; r += shards) {
  const row = rows[r];
  const s = row.make();
  const es = s.economicState || {};
  const fs = es.foodSecurity || {};
  const svc = s.availableServices || {};
  const svcRows = Object.entries(svc).flatMap(([cat, list]) => (Array.isArray(list) ? list : []).map((x) => [cat, x?.name, x?.institution]));
  const flags = getInstFlags(s.config, s.institutions).inst;
  const hiredOnly = (flags.hasCharterHall || flags.hasMercenary) && !(flags.hasGarrison || flags.hasWatch || flags.hasMilitia);
  let hired = null;
  if (hiredOnly) {
    const k = keepOf ? keepOf(es.prosperity) : undefined;
    const institutions = s.institutions.filter((i) => !HIRED.test(i.name));
    institutions.push({ name: WATCH_OF[s.tier] || 'Town watch', category: 'Defense' });
    hired = { hired: generateDefenseProfile(s, k).scores.military, watch: generateDefenseProfile({ ...s, institutions }, k).scores.military };
  }
  const ps = s.powerStructure || {};
  const summary = {
    key: row.key, cohort: row.cohort, stress: row.stress, tier: s.tier,
    prosperity: label(es.prosperity), food: fs.label ?? null, safety: es.safetyProfile?.safetyLabel ?? null,
    readiness: s.defenseProfile?.readiness?.label ?? null, readinessScore: s.defenseProfile?.readiness?.score ?? null,
    scores: s.defenseProfile?.scores ?? null, gates: s.defenseProfile?.economicGates ?? null,
    storageMonths: fs.storageMonths ?? null, storageNote: fs.storageNote ?? null,
    magic: deriveMagicProfile(s)?.availability ?? null,
    svcRows, institutions: (s.institutions || []).map((i) => i.name),
    guardDesc: es.safetyProfile?.guardEffectivenessDesc ?? null,
    hired,
    pl: ps.publicLegitimacy ?? null,
    governingName: ps.governingName ?? null, government: ps.government ?? null, stability: ps.stability ?? null,
    capture: ps.criminalCaptureState ?? null,
    factions: (ps.factions || []).map((f) => ({ name: f.name ?? f.faction, power: f.power, isGoverning: f.isGoverning, category: f.category })),
    npcs: (s.npcs || []).map((p) => ({ id: p.id, name: p.name, personality: p.personality, role: p.role, faction: p.faction ?? p.factionAffiliation, goals: p.goals ?? p.goal, rank: p.rank })),
    receipt: (s.generationCoherenceReceipt?.checks || s.generationCoherenceReceipt?.findings || []).map((c) => [c.id ?? c.check ?? c.kind, c.status ?? c.verdict ?? c.severity]),
    receiptStatus: s.generationCoherenceReceipt?.status ?? s.generationCoherenceReceipt?.verdict ?? null,
  };
  sumOut.write(`${JSON.stringify(summary)}\n`);
  gz.write(`${JSON.stringify({ key: row.key, record: s })}\n`);
  n++;
}
sumOut.end(); gz.end();
console.error(`dumped ${n} of ${rows.length} (${corpusName}, shard ${shard}/${shards}) from ${root}`);
