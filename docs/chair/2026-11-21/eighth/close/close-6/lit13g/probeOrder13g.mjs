// LIT-13G: the ORDER on one birth. Run ONLY against an instrumented scratch copy of a tree (log lines in
// factionStanding.js :: annotateFactionStanding, narrativeGenerator.js :: withHallCapture, factionDynamics.js ::
// govCriminalRelation / criminalMilitaryRelation, each calling globalThis.__lit13g), never a worktree.
// usage: TREE=<instrumented copy> node probeOrder13g.mjs <seed> <force: none|seat1|fortune1>
// The birth is bar8Powers.test.js's (its configOf, over DEFAULT_CONFIG, through birthConfig); the pipeline's own onStep
// callback marks each step, so every log line reads in the step it ran in.
const TREE = process.env.TREE; const R = TREE + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + 'store/configSlice.js');
await loadGenerationLawPayloads();
const [seed = 'r2r-city-5', force = 'none'] = process.argv.slice(2);
const FORCE = { none: {}, seat1: { _seatLawVersion: 1 }, fortune1: { _fortuneLawVersion: 1 } }[force];
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
const cfg = m ? { ...birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), ...FORCE } : { ...birthConfig({ settType: seed.split('-')[1] }), ...FORCE };
let step = '(before the first step)'; let n = 0;
globalThis.__lit13g = (what, data) => console.log(`${String(++n).padStart(3)} [${step}] ${what} ${JSON.stringify(data)}`);
const town = generateSettlementPipeline(cfg, null, { seed, customContent: {}, onStep: (name) => { console.log(`--- step done: ${name}`); step = `after ${name}`; } });
step = 'final record';
const WAR = /\bA slow war with the guild\b|\bthe guild can make every investigation costly\b|\bcan arrest their people\b|\benough to keep it down but not to stamp it out\b/i;
const ps = town.powerStructure;
console.log('FINAL laws', JSON.stringify(Object.fromEntries(Object.entries(town.config || {}).filter(([k]) => /LawVersion/.test(k)))));
console.log('FINAL governing', JSON.stringify(ps.factions.filter((f) => f.isGoverning).map((f) => `${f.faction} [${f.category}]`)), 'criminalCaptureState', ps.criminalCaptureState, 'legitimacy', ps.publicLegitimacy?.label);
console.log('FINAL rows', JSON.stringify(ps.factionRelationships.filter((r) => r.captureState !== undefined).map((r) => `${r.pair.join(' ~ ')}: ${r.type}/${r.captureState}`)));
console.log('FINAL war cards', JSON.stringify(ps.factions.filter((f) => WAR.test(String(f.desc || ''))).map((f) => `${f.faction} [${f.category}]: ${f.desc}`)));
const gov = ps.factions.find((f) => f.isGoverning)?.faction;
console.log('FINAL ruling three of', gov, JSON.stringify((town.npcs || []).flatMap((c) => (c.memberships || []).filter((x) => x.power === gov && x.rank <= 3).map((x) => `${x.rank}:${c.name}${c.allegiance ? ' allegiance=' + JSON.stringify(c.allegiance) : ''}`))));
