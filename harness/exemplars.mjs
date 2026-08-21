/**
 * harness/exemplars.mjs — the lane's exemplar corpus driver (§109 acceptance input).
 * Usage: node harness/exemplars.mjs <outDir>
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));
const { settlementAtYear } = await import(join(ROOT, 'src/domain/townMap/fabric/snapshot.js'));
const { renderFolio } = await import(join(HERE, 'renderFolio.mjs'));

export const CORPUS = [
  { key: 'thorp',        settType: 'thorp',      seed: 'mf-thorp-01',  note: 'tier ladder: an incident in the countryside' },
  { key: 'hamlet',       settType: 'hamlet',     seed: 'mf-hamlet-01', note: 'tier ladder: lane and fork' },
  { key: 'village',      settType: 'village',    seed: 'mf-village-01', note: 'tier ladder: strip-furrow country' },
  { key: 'town',         settType: 'town',       seed: 'mf-town-01', terrain: 'riverside', note: 'tier ladder: river, walls, market hole' },
  // ⭐⭐⭐ ⟦§303.9⟧ **A SECOND WALLED RIVERSIDE TOWN, ON A DIFFERENT WORLD — the cheapest
  //   multiplier in the corpus, and it is additive only.**
  // ⛔⛔ THE DEFECT IT EXISTS FOR, MEASURED AND STANDING FOR FOUR WAVES: of the corpus's leaves,
  //   **SIX are seed `mf-town-01` + riverside** (town · siege · plague · famine · year-018 ·
  //   year-100) and a SEVENTH is that same site demoted (highwater). Every riverside figure the
  //   programme has ever published is ONE GEOMETRIC CONFIGURATION COUNTED SEVEN TIMES —
  //   `bothTotals`' own header says so, MF-D1's Euler arm hit it (six failures, one site), and
  //   §255.2d made it a standing caveat. **A caveat divides the number; it cannot supply the
  //   missing subject.** This does.
  // ⭐ IT IS A NEW SEED AND THEREFORE A NEW WORLD — a different valley axis, different nuclei,
  //   a different institution roster and **2,497 souls against `mf-town-01`'s 3,502** — NOT
  //   another state or year of the same site, which is exactly the replication the corpus
  //   already has too much of. `siteKey` counts it as its own site, so every distinct-site
  //   denominator in the programme grows by one from this row alone.
  // ⚠⚠ AND THE SEED WAS CHOSEN AGAINST THE §217 OP CEILING, NOT FOR PRETTINESS. The corpus's
  //   largest natural town-tier riverside (`mf-town-02`, 4,780 souls) renders **4,609 primitives
  //   against the town ceiling of 4,600 — OVER by 9**, and a ceiling raise is a chair decision.
  //   `thornbeck-4` measures 4,526 with 74 of headroom, so a diversification row does not spend
  //   a gated decision. ⚠ The overrun is REPORTED rather than worked around: the next wave that
  //   wants a big walled riverside town owes the raise.
  // ⚠ ADDITIVE ONLY: no existing row is edited, and `siteRepresentatives` takes the FIRST leaf
  //   per site, so no existing leaf's representative status moves.
  { key: 'town-2',       settType: 'town',       seed: 'thornbeck-4', terrain: 'riverside', note: '⭐ the SECOND riverside town, on its own world — the corpus\'s riverside family stops being one site counted seven times' },
  { key: 'city',         settType: 'city',       seed: 'mf-city-01', terrain: 'coastal', note: 'tier ladder: coast, port, plural squares' },
  { key: 'metropolis',   settType: 'metropolis', seed: 'mf-metro-01',  note: 'tier ladder: two circuits, old core' },
  { key: 'polycentric',  settType: 'town',       seed: 'poly-7', terrain: 'hills', note: '§5.-1.3 the polycentric dumbbell: two sites, a road, ribbon growth' },
  { key: 'highwater',    settType: 'town',       seed: 'mf-town-01', terrain: 'riverside', demote: true, note: '§161f/§161g the high-water case: city extent, town life, bricked gates' },
  { key: 'mountain',     settType: 'village',    seed: 'mf-village-01', terrain: 'mountain', note: '§161a consistency: mountain relief, terraced siting' },
  // ⭐ §5.-1c THE FORCED-FACT CASE the chair named: mountainside + ocean + port. The solver
  //   must not discard a fact to keep a family tidy — it must find the FJORD.
  { key: 'fjord', settType: 'town', seed: 'fjord-3', terrain: 'mountain', forcePort: true, note: '§5.-1c forced reconciliation: mountain + ocean + port = a fjord (terraced town above, deep cove below)' },
  // ⭐⭐ §10 THE STATE EXPRESSIONS, on SYNTHESIZED STATE FIXTURES. The generator does not put a
  //   stressor on a settlement by default (MEASURED: `settlement.stressors` is null on all ten
  //   exemplars above), so the §10.B markers have no live corpus. These four assert ONE
  //   catalog key each, the way a besieged world would, so the marker and its refusals can be
  //   SEEN rather than asserted — the same discipline as the §5.-1c forced-fact fixture.
  { key: 'siege', settType: 'town', seed: 'mf-town-01', terrain: 'riverside', stressors: ['under_siege'], note: '§10.12 the besieger camps on the road it came by; the gate it invests is barred' },
  { key: 'plague', settType: 'town', seed: 'mf-town-01', terrain: 'riverside', stressors: ['plague_onset'], note: '§10.13 every gate barred, a lazar house beyond the last of them' },
  { key: 'famine', settType: 'town', seed: 'mf-town-01', terrain: 'riverside', stressors: ['famine'], note: '§10.A2 the market place with its stall rows marked out and nothing on them' },
  { key: 'migration', settType: 'city', seed: 'mf-city-01', terrain: 'coastal', stressors: ['mass_migration', 'monster_pressure'], note: '§10.A11 a camp at the busiest gate; watch-fires where the roads come in' },
  // ⭐⭐ §11 THE SNAPSHOTS. The same town at two years, either side of its own circuit's
  //   vintage — the inertia law's own claim made visible on a page rather than in a hash.
  { key: 'year-018', settType: 'town', seed: 'mf-town-01', terrain: 'riverside', year: 18, note: '§11.11 the town in year 18: NO CIRCUIT — it was raised in year 49' },
  // ⚠ YEAR 100, NOT 155, AND THE FIRST CHOICE WAS A LESSON. The year-155 leaf came back
  //   BYTE-IDENTICAL to the present-day town — sha for sha — because every event had already
  //   happened by 155 and every note was still inside its lifespan, so the two years have the
  //   SAME HORIZON. That is the inertia law working perfectly and a redundant PICTURE, so the
  //   corpus takes a year that genuinely differs: after the circuit, before the market's
  //   middle rows hardened in year 128.
  { key: 'year-100', settType: 'town', seed: 'mf-town-01', terrain: 'riverside', year: 100, note: '§11.11 the town in year 100: the wall stands, the market place is still open — the middle rows harden in year 128' },
  // ⭐⭐⭐ §273.6 · THE **THROUGH-RIVER** LEAF, AND IT IS MINTED BECAUSE THE CORPUS HAD NONE.
  //   MEASURED at MF-W1b: the sixteen leaves are **6 dry / 10 bankside / ZERO through**, while
  //   §5.0b puts a crossed river at ~12% — and zero is not 12%. The consequence was concrete:
  //   §5 W1 exit 6's bank-asymmetry arm had NO SUBJECT and was reported NOT APPLICABLE, and
  //   every wall arm about a wall CROSSING water (§161m.3's water gates, the chain across the
  //   channel, the bridge as a street continuation) had nothing to fire on.
  //   ⭐ IT IS A FORCED FACT COMBINATION, ASSERTED THE WAY A USER WOULD ASSERT IT — the same
  //   discipline as the fjord's `forcePort`, and NOT a change to `waterMode`'s derivation.
  //   `CROSSING_BUDGET` earns a crossing at ≥900 souls on a route weight ≥0.55 at a bridgeable
  //   reach; this town has 3,502 souls and the fixture states the crossroads its dossier could
  //   have carried all along.
  { key: 'crossing', settType: 'town', seed: 'mf-town-01', terrain: 'riverside', forceCrossing: true, note: '§5.0b/§273.6 the THROUGH-river case: the bridge is the reason the town is here and the streets continue across it' },
];

/**
 * ⚠⚠ §0.3b · THE SIXTEEN LEAVES ARE TEN WORLDS, AND EVERY CORPUS-WIDE FIGURE OWES BOTH TOTALS.
 *
 * ⛔ THE DEFECT THIS EXISTS TO PREVENT, MEASURED (`laneMFW1-receipt.md` §0, §2.1): SIX leaves
 * are seed `mf-town-01` + riverside (town · siege · plague · famine · year-018 · year-100),
 * a SEVENTH is that same site demoted (highwater), and TWO are `mf-city-01` + coastal (city ·
 * migration). So a corpus §205A total publishes a ONE-RIVER move up to SIX TIMES: the `+51`
 * that read as a corpus regression is really *+10 on one river town (×6), +5 on that same town
 * demoted, −7 on one coastal city (×2)*. ⭐ **A CORPUS TOTAL OVER A REPLICATED CORPUS IS A
 * MULTIPLIED SAMPLE WEARING A POPULATION'S CLOTHES**, and the cure is one line: never publish
 * the 16-leaf total without the 10-world total beside it.
 *
 * ⭐ THE KEY IS `seed | terrain | demoted`, and it is chosen because it REPRODUCES MF-W1's
 * published distinct-site figures to the unit (114 → 55 corpus→distinct at MF-ARCH's tip;
 * 165 → 63 at MF-ARCH-2's). A demotion is a DIFFERENT SETTLEMENT on the same site — it
 * measures 6 where the undemoted town measures 3 — while a stressor or a snapshot year is the
 * SAME world in another state, which is exactly the replication this denominator divides out.
 */
// ⭐ §273.6 · `forceCrossing` JOINS `demote` IN THE KEY, ON THIS FUNCTION'S OWN ARGUMENT. The
// rule it states is that a DIFFERENT SETTLEMENT on the same site counts separately while the
// same world in another state does not. A crossed river is not a state of the bankside town: it
// changes the water relationship, the bridge set, the wall's flank grammar and the water gates —
// six of the figures this denominator exists to divide. A stressor or a snapshot year still does
// not, and neither does a lens.
export const siteKey = (spec) => `${spec.seed}|${spec.terrain || '-'}${spec.demote ? '|demoted' : ''}${spec.forceCrossing ? '|crossing' : ''}`;

/** The FIRST leaf of each distinct site, in CORPUS order — the representative a total takes. */
export function siteRepresentatives(corpus = CORPUS) {
  /** @type {Map<string,string>} */ const seen = new Map();
  for (const spec of corpus) if (!seen.has(siteKey(spec))) seen.set(siteKey(spec), spec.key);
  return seen;
}

/**
 * ⭐ THE ONE HARNESS LINE §5 W0 ASKS FOR: a corpus total never travels alone.
 * @param {Record<string, number>} byLeaf the figure, per leaf key
 * @param {Array<any>} [corpus]
 * @returns {{ corpus:number, distinct:number, sites:number, leaves:number, text:string }}
 */
export function bothTotals(byLeaf, corpus = CORPUS) {
  const reps = siteRepresentatives(corpus);
  let all = 0, distinct = 0;
  for (const spec of corpus) all += byLeaf[spec.key] || 0;
  for (const rep of reps.values()) distinct += byLeaf[rep] || 0;
  return {
    corpus: all, distinct, sites: reps.size, leaves: corpus.length,
    text: `${all} over ${corpus.length} leaves / ${distinct} over ${reps.size} distinct sites`,
  };
}

export function buildOne(spec) {
  const cfg = { settType: spec.settType };
  if (spec.terrain) cfg.terrainOverride = spec.terrain;
  let settlement = generateSettlementPipeline(cfg, null, { seed: spec.seed });
  if (spec.forceCrossing) {
    // §273.6: the ONE fact `CROSSING_BUDGET` reads that this dossier left unstated.
    settlement.config = { ...(settlement.config || {}), tradeRouteAccess: 'crossroads' };
  }
  if (spec.forcePort) {
    // A FORCED FACT COMBINATION, asserted the way a user would assert it.
    settlement.config = { ...(settlement.config || {}), tradeRouteAccess: 'port' };
    settlement.economicState = { ...(settlement.economicState || {}), tradeCommodity: 'fish' };
  }
  if (spec.demote) {
    // A DECLARED demotion fixture: the stored tier outranks the population's own tier,
    // which is the recorded-demotion signal that needs no population history at all.
    settlement.tier = 'city';
  }
  // ⭐ A SYNTHESIZED STATE FIXTURE, asserted the way a besieged world would assert it.
  if (spec.stressors) settlement = { ...settlement, stressors: spec.stressors.slice() };
  const model = buildTownMapModel(settlement, null);
  // ⭐⭐ §11.11 THE SNAPSHOT. The vintage and the present age are stamped from the PRESENT-DAY
  // record and held fixed — see snapshot.js's standing rule on why a threshold derived as a
  // fraction of "now" is not a date.
  if (Number.isFinite(spec.year)) {
    const present = buildFabric(settlement, model, {});
    const vin = present.record.get('wall-built-year', null);
    const at = settlementAtYear(settlement, spec.year);
    const fabric2 = buildFabric(at, model, {
      year: spec.year,
      wallBuiltAtAge: vin ? vin.ageAtBuild : null,
      presentAge: present.meta.settlementAge,
    });
    return { settlement: at, model, fabric: fabric2 };
  }
  const fabric = buildFabric(settlement, model, {});
  return { settlement, model, fabric };
}

async function main() {
  const outDir = process.argv[2] || join(ROOT, 'out');
  mkdirSync(outDir, { recursive: true });
  const manifest = [];
  for (const spec of CORPUS) {
    const { settlement, fabric } = buildOne(spec);
    const { svg, elementCount, primitiveCount } = renderFolio(fabric, { lens: 'parchment' });
    const file = `${spec.key}-${fabric.meta.tier}-parchment.svg`;
    writeFileSync(join(outDir, file), svg);
    // ⭐ THE SIX LENSES OVER ONE GEOMETRY (§9.7). The town carries the whole family so the
    // chair can judge the reskin claim on a leaf that has everything on it; every other
    // exemplar ships parchment, which is what the corpus is for.
    if (spec.key === 'town' || spec.key === 'city') {
      for (const lens of ['watercolor', 'darkFantasy', 'vtt', 'accessible', 'illustrated']) {
        const r = renderFolio(fabric, { lens });
        writeFileSync(join(outDir, `${spec.key}-${fabric.meta.tier}-${lens}.svg`), r.svg);
      }
    }
    let inside = 0;
    for (let k = 0; k < fabric.partition.inside.length; k++) inside += fabric.partition.inside[k];
    manifest.push({
      key: spec.key, note: spec.note, seed: spec.seed, settType: spec.settType,
      terrain: spec.terrain || null, name: settlement.name, tier: fabric.meta.tier,
      landform: fabric.meta.landform, declaredTerrain: fabric.meta.declaredTerrain,
      forcedReconciliation: fabric.meta.forcedReconciliation, strain: fabric.meta.strain,
      strainedFacts: fabric.meta.strainedFacts, reconciliation: fabric.meta.reconciliation,
      extentTier: fabric.meta.extentTier, population: fabric.meta.population,
      prosperity: fabric.meta.prosperity, morphology: fabric.meta.morphology,
      foundingKind: fabric.meta.foundingKind, morphologyOrder: fabric.meta.morphologyOrder,
      waterMode: fabric.meta.waterMode, nuclei: fabric.meta.nucleusCount,
      polycentric: fabric.meta.polycentric, relief: Math.round(fabric.meta.relief * 1000) / 1000,
      organisms: fabric.organisms.length, parcels: fabric.parcels.length,
      roofTarget: fabric.meta.roofs, yards: fabric.parcels.filter((p) => p.yard).length,
      gables: fabric.parcels.filter((p) => p.gable).length,
      characters: [...new Set(fabric.parcels.map((p) => p.character))].sort(),
      components: fabric.umbrella.components.length, greens: fabric.umbrella.greens.length,
      seams: fabric.umbrella.seams.length, partitionCells: fabric.umbrella.partition.length,
      builtAreaPct: Math.round((1000 * inside) / fabric.partition.inside.length) / 10,
      circularity: Math.round(fabric.meta.circularity * 1000) / 1000,
      landmarks: fabric.landmarks.length,
      monumentals: fabric.landmarks.filter((l) => l.monumental).length,
      nonBuilding: fabric.nonBuilding.length,
      atlasSourced: fabric.landmarks.filter((l) => l.atlasSourced).length,
      rungSourced: fabric.landmarks.filter((l) => l.rungSourced).length,
      wallRings: fabric.walls.length,
      // ⭐ THE §200/§202/§17.3 RECORD, so the manifest carries the laws' own figures.
      wallBands: fabric.walls.map((w) => Math.round(w.band * 100) / 100),
      groundLawDemoted: fabric.meta.groundLawDemoted,
      groundLawDemotedBy: fabric.meta.groundLawDemotedBy,
      groundLawDropped: fabric.meta.groundLawDropped,
      landlocked: fabric.meta.landlocked,
      orphanStreets: fabric.meta.orphanStreets,
      accessShrunk: fabric.meta.accessShrunk,
      accessDropped: fabric.meta.accessDropped,
      circuitStreetComponents: fabric.meta.circuitStreetComponents,
      circuitMainShare: fabric.meta.circuitMainShare,
      gates: fabric.walls.reduce((n, w) => n + w.gates.length, 0),
      brickedGates: fabric.walls.reduce((n, w) => n + w.gates.filter((g) => g.bricked).length, 0),
      seatingSatisfaction: Math.round(fabric.meta.seatingSatisfaction * 1000) / 1000,
      physicalViolations: fabric.meta.physicalViolations,
      foundedDistricts: fabric.meta.foundedDistricts,
      highWater: fabric.meta.highWater,
      plotFrontage: Math.round(fabric.meta.plotFrontage * 100) / 100,
      elementCount, primitiveCount, greens: fabric.umbrella.greens.length, commons: fabric.commons.length,
      enclosure: fabric.enclosure.map((e) => Math.round(e.enclosure * 100) / 100),
      seaShare: fabric.meta.seaShare, reliefReason: fabric.meta.reliefReason,
      blocks: fabric.blocks.length, wings: fabric.parcels.filter((p) => p.wing).length,
      bytes: Buffer.byteLength(svg), file,
    });
    process.stdout.write(`${spec.key.padEnd(13)} ${fabric.meta.tier.padEnd(11)} ${String(settlement.name).padEnd(14)} morph=${fabric.meta.morphology.padEnd(12)} parc=${String(fabric.parcels.length).padStart(5)} els=${String(elementCount).padStart(5)} prim=${String(primitiveCount).padStart(5)}\n`);
  }
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  process.stdout.write(`\n${manifest.length} SVG + manifest.json -> ${outDir}\n`);
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
