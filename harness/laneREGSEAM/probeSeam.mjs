/**
 * harness/laneREGSEAM/probeSeam.mjs — THE SEAM-WINDOW LIVENESS PROBE (ODQ §633.3).
 *
 * ⛔ WHY IT EXISTS. The 18-leaf exemplar corpus has NO leaf inside the two seam windows
 * (5001–8000 and 25001–40000), so the band-seam cure's corpus delta is expected to be ZERO —
 * and the fourth-stack law says identical readings are exactly what a DEAD INSTRUMENT returns.
 * A zero delta is only evidence if something in the same measurement DOES move. This probe is
 * that something: synthetic leaves placed INSIDE the windows, built through the real
 * pipeline → model → fabric path, so the cure has a subject it must visibly change.
 *
 * Three arms, and the third is the one that keeps the cure honest:
 *   (a) OCCUPANCY  — a healthy 6,500-soul city and a healthy 30,000-soul metropolis: the
 *       fabric's occupancy tier must FLIP town→city and city→metropolis across the cure.
 *   (b) THE FALSE ELEGY — the same two leaves' `deriveHighWater`: pre-cure it invents a peak
 *       (8001 / 40001) the settlement never had and reports demoted=true; post-cure it must
 *       report demoted=false, deficit=0.
 *   (c) THE REAL ELEGY — a stored-tier `city` holding 3,000 souls, which IS a demotion under
 *       BOTH tables. It must STAY demoted. Its deficit shrinks (the step-1 floor drops from
 *       the city band's 8001 to its 5001) and that shrink is the declared shift, not a loss of
 *       the instrument.
 *
 * Usage: node harness/laneREGSEAM/probeSeam.mjs
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');

const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));
const { tierForPopulation, deriveHighWater, tierScale, TIER_PROFILE } =
  await import(join(ROOT, 'src/domain/townMap/fabric/tierGrammar.js'));
const { popToTier, POPULATION_RANGES } = await import(join(ROOT, 'src/data/constants.js'));

/**
 * A synthetic leaf INSIDE a seam window, built through the real path.
 * The population is asserted the way a user's own world would assert it, and the stored tier
 * is the LANDED classifier's answer — which is what an engine-stamped settlement carries.
 */
function syntheticLeaf({ seed, settType, population, storedTier, terrain }) {
  const cfg = { settType };
  if (terrain) cfg.terrainOverride = terrain;
  const base = generateSettlementPipeline(cfg, null, { seed });
  const settlement = { ...base, population, tier: storedTier };
  const model = buildTownMapModel(settlement, null);
  const fabric = buildFabric(settlement, model, {});
  return { settlement, model, fabric };
}

const PROBES = [
  { name: 'healthy city @ 6,500', seed: 'seam-city-6500', settType: 'city', population: 6500, terrain: 'coastal' },
  { name: 'healthy metropolis @ 30,000', seed: 'seam-metro-30000', settType: 'metropolis', population: 30000 },
];

const out = [];
out.push('── THE TABLE UNDER MEASURE ──');
for (const t of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const r = POPULATION_RANGES[t];
  out.push(`  ${t.padEnd(11)} TIER_PROFILE.pop [${TIER_PROFILE[t].pop.join(', ')}]`
    + `   POPULATION_RANGES [${r.min}, ${r.max}]`
    + `   ${TIER_PROFILE[t].pop[0] === r.min && TIER_PROFILE[t].pop[1] === r.max ? 'AGREE' : '⛔ DISAGREE'}`);
}

out.push('\n── (a) OCCUPANCY TIER, THROUGH THE REAL FABRIC PATH ──');
for (const p of PROBES) {
  const storedTier = popToTier(p.population);
  const { fabric } = syntheticLeaf({ ...p, storedTier });
  out.push(`  ${p.name}`);
  out.push(`    stored tier (landed popToTier)  : ${storedTier}`);
  out.push(`    fabric occupancyTier (meta.tier): ${fabric.meta.tier}`);
  out.push(`    fabric extentTier               : ${fabric.meta.extentTier}`);
  out.push(`    tierForPopulation(${p.population})${' '.repeat(Math.max(0, 8 - String(p.population).length))}: ${tierForPopulation(p.population)}`);
  out.push(`    AGREEMENT                       : ${fabric.meta.tier === storedTier ? 'YES' : '⛔ NO — the seam'}`);
  out.push(`    squareKind / blockDepth         : ${tierScale({ population: p.population, tier: storedTier }).squareKind} / ${tierScale({ population: p.population, tier: storedTier }).blockDepth}`);
}

out.push('\n── (b) THE FALSE ELEGY — deriveHighWater on the two HEALTHY probes ──');
for (const p of PROBES) {
  const storedTier = popToTier(p.population);
  const hw = deriveHighWater({ population: p.population, tier: storedTier });
  out.push(`  ${p.name} (stored '${storedTier}', never shrank)`);
  out.push(`    peak population : ${hw.population}${hw.population === p.population ? '' : `  ⛔ INVENTED (the settlement never held ${hw.population})`}`);
  out.push(`    peak tier       : ${hw.tier}`);
  out.push(`    demoted         : ${hw.demoted}`);
  out.push(`    deficit         : ${hw.deficit.toFixed(4)}`);
  out.push(`    evidence        : ${JSON.stringify(hw.evidence)}`);
}

out.push('\n── (c) THE REAL ELEGY — a stored city holding 3,000 souls (a demotion under BOTH tables) ──');
{
  const hw = deriveHighWater({ population: 3000, tier: 'city' });
  out.push(`  stored 'city', population 3,000`);
  out.push(`    derived tier    : ${tierForPopulation(3000)}`);
  out.push(`    peak population : ${hw.population}   (= the city band's floor)`);
  out.push(`    demoted         : ${hw.demoted}${hw.demoted ? '' : '  ⛔ THE INSTRUMENT WENT BLIND'}`);
  out.push(`    deficit         : ${hw.deficit.toFixed(4)}`);
  out.push(`    evidence        : ${JSON.stringify(hw.evidence)}`);
}

out.push('\n── (c2) THE CONTROLS — a genuinely healthy town, and a history-peak demotion ──');
{
  const healthy = deriveHighWater({ population: 4900, tier: 'town' });
  out.push(`  healthy town @ 4,900 : demoted=${healthy.demoted} deficit=${healthy.deficit.toFixed(4)}`);
  const hist = deriveHighWater({
    population: 4000, tier: 'town',
    populationHistory: [{ population: 4000 }, { population: 12000 }, { population: 9000 }],
  });
  out.push(`  history-peak town @ 4,000 (ring holds 12,000) : peak=${hist.population} demoted=${hist.demoted} deficit=${hist.deficit.toFixed(4)}`);
}

out.push('\n── (e) THE MORPHOLOGY BREAK, ON A LEAF WITH NO STORED TIER ──');
{
  // ⚠ A REFINEMENT OF TE-SEAM's OWN NARRATIVE, and it matters for what the cure is credited
  // with. `squareKind` and `blockDepth` are read from the EXTENT tier's profile, not the
  // occupancy tier's — so on a leaf whose STORED tier is 'city', the seam's own false demotion
  // pushed the extent tier back up to 'city' and ACCIDENTALLY restored the city square. The
  // undressed break shows on a leaf carrying no stored tier at all, where nothing rescues it:
  // there the extent tier follows the derived tier straight down into 'town'.
  for (const [label, pop] of [['no-stored-tier @ 6,500', 6500], ['no-stored-tier @ 30,000', 30000]]) {
    const sc = tierScale({ population: pop });
    out.push(`  ${label}`);
    out.push(`    occupancyTier / extentTier : ${sc.tier} / ${sc.extentTier}`);
    out.push(`    squareKind                 : ${sc.squareKind}`);
    out.push(`    blockDepth                 : ${sc.blockDepth}`);
    out.push(`    accentBand                 : ${sc.accentBand}`);
    out.push(`    organismBand               : [${sc.organismBand.join(', ')}]`);
    out.push(`    monumentalBudget           : ${sc.monumentalBudget}`);
    out.push(`    roofs / cellsAcross        : ${sc.roofs} / ${sc.cellsAcross.toFixed(2)}`);
    out.push(`    footprint                  : ${sc.footprint.toFixed(4)}`);
  }
}

out.push('\n── (d) THE CLASSIFIER SWEEP — tierForPopulation vs the landed popToTier, 1..120000 ──');
{
  let disagreements = 0;
  const windows = [];
  let runStart = null;
  for (let p = 1; p <= 120000; p++) {
    const a = popToTier(p);
    const b = tierForPopulation(p);
    if (a !== b) {
      disagreements++;
      if (runStart === null) runStart = p;
    } else if (runStart !== null) {
      windows.push([runStart, p - 1]);
      runStart = null;
    }
  }
  if (runStart !== null) windows.push([runStart, 120000]);
  out.push(`  populations swept : 120,000`);
  out.push(`  DISAGREEMENTS     : ${disagreements}`);
  out.push(`  windows           : ${windows.length ? windows.map(([a, b]) => `${a}–${b}`).join(', ') : '(none)'}`);
}

process.stdout.write(`${out.join('\n')}\n`);
