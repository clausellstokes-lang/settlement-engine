#!/usr/bin/env node
/**
 * harness/laneSPINE1/partitionPerf.mjs — ⭐⭐⭐ SPINE-1 · **A1.6's PERF HARNESS, WITH ITS PROTOCOL
 * PINNED IN THE FILE** (S4-M1: *"a perf harness with a PINNED protocol (warm process, three
 * samples, per tier) lands IN SPINE-1"*).
 *
 * ⛔⛔ WHY THE PROTOCOL IS PART OF THE INSTRUMENT AND NOT PART OF THE README. The panel measured
 * that §6's original budget — *"the page frame ≤ 1.3× today's build"* — is UNFALSIFIABLE as
 * written: "today's build" is 4.6 s cold-process, ~1.0 s warm and 1.29 s panel-measured at city, a
 * 4.6× spread with tier, cold/warm and protocol all unpinned. An executed grep at the seal for
 * `performance.now|hrtime|BUDGET_MS|timeBudget|TIME_GATE` over `tests/`, `src/` and `harness/`
 * returned ZERO hits: there was no time gate anywhere in the tree. So the protocol is here, in the
 * only place that cannot drift from the number it produces.
 *
 *   WARM      — one untimed warm-up build per leaf before any sample is kept (module load, JIT and
 *               the first allocation of every pool are not the subject).
 *   SAMPLES   — three timed samples per leaf; the MEDIAN is the figure, and all three are printed
 *               so a reader can see the spread rather than trust the middle.
 *   SEPARATE  — the CONSTRUCTOR and the PAGE PROJECTION are timed apart, because A1.6's two budgets
 *               are different numbers about different stages and the panel's M2 showed the frame's
 *               dominant cost is the projection, not the paint.
 *
 * BUDGETS (A1.6): constructor ≤ 2.5 s at metropolis, warm · page frame ≤ 1.5× the pinned warm city
 * baseline of 1.29 s.
 *
 * Usage:  node harness/laneSPINE1/partitionPerf.mjs [--leaves=a,b,c] [--samples=3]
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildGrowthLedger } from '../../src/domain/townMap/fabric/growthLedger.js';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';

/** ⭐ THE PINNED PROTOCOL. Changing any of these changes what the numbers mean. */
export const PERF_PROTOCOL = Object.freeze({
  warmups: 1,
  samples: 3,
  statistic: 'median',
  process: 'warm (one untimed build per leaf first)',
});

/** ⭐ THE BUDGETS A1.6 SIGNS. */
export const PERF_BUDGET = Object.freeze({
  constructorMsMetropolis: 2500,
  pageBaselineMsCity: 1290,
  pageMultiple: 1.5,
});

export function partitionInputs(settlement, model, fabric) {
  const m = fabric.meta;
  const rw = (m.streetWidths && m.streetWidths.organism) || 5;
  return {
    seed: String(m.seed),
    ledger: buildGrowthLedger(settlement, model, {}),
    // ⭐ BOTH RADII — see buildFabric.js's note. These two producers must agree, and this is
    //   the pair they must agree on.
    extent: { cx: m.centre.x, cy: m.centre.y, radius: m.builtRadius * 1.45, settlementRadius: m.builtRadius },
    originForm: m.polycentric === true ? 'POLYFOCAL'
      : (m.tier === 'thorp' || m.tier === 'hamlet' || m.tier === 'village' ? 'STREET_VILLAGE' : 'NUCLEATED_CROSSROADS'),
    planMode: m.morphology === 'planned' ? 'PLANTED_GRID'
      : (m.morphology === 'regularized' ? 'COMPOSITE' : 'ORGANIC_PLAN_UNIT_QUILT'),
    roadWidth: rw,
    bodyTarget: fabric.parcels.length,
    // ⭐⭐ SPINE-2 · THE WHOLE WATER RELATIONSHIP, CARRIED ACROSS BY NAME. §3e's banks read
    // `stationAt`, whose local width comes from `widthProfile`; the bank SIDE and the water KIND
    // decide whether the body has two banks or one. ⛔ A REBUILD-INTO-A-NEW-OBJECT IS A WHITELIST
    // (`deriveWaterMode`'s own recorded lesson: `scales`/`coarse`/`detail`/`worked` were silently
    // dropped on their first run and the census printed an EMPTY section with nothing failing), so
    // every row §3e consumes is listed here and the census prints what it got.
    water: fabric.water && fabric.water.line && fabric.water.line.length > 1
      ? {
        line: fabric.water.line,
        width: fabric.water.width,
        kind: fabric.water.kind || 'river',
        mode: fabric.water.mode || null,
        bankSide: fabric.water.bankSide,
        crossing: fabric.water.crossing || null,
        ...(fabric.water.widthProfile ? { widthProfile: fabric.water.widthProfile } : {}),
      } : null,
    wallForm: model.meta.hasWalls ? { facets: 26, width: rw * 0.42 } : null,
  };
}

const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

export function timeLeaf(key, samples = PERF_PROTOCOL.samples) {
  const spec = CORPUS.find((s) => s.key === key);
  if (!spec) throw new Error(`partitionPerf: no corpus leaf '${key}'`);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  // WARM-UP — untimed, and its result is discarded on purpose.
  for (let i = 0; i < PERF_PROTOCOL.warmups; i++) projectPage(buildSettledPartition(input), { roadWidth: input.roadWidth });
  const build = []; const page = [];
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now();
    const P = buildSettledPartition(input);
    const t1 = performance.now();
    projectPage(P, { roadWidth: input.roadWidth });
    const t2 = performance.now();
    build.push(t1 - t0); page.push(t2 - t1);
  }
  return {
    key,
    tier: fabric.meta.tier,
    buildMs: build.map((v) => Math.round(v * 10) / 10),
    pageMs: page.map((v) => Math.round(v * 10) / 10),
    buildMedian: Math.round(median(build) * 10) / 10,
    pageMedian: Math.round(median(page) * 10) / 10,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (n, d) => {
    const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
    return hit ? hit.slice(n.length + 3) : d;
  };
  const leaves = arg('leaves', 'village,town,city,metropolis').split(',');
  const samples = Number(arg('samples', String(PERF_PROTOCOL.samples)));
  console.log(`PROTOCOL ${JSON.stringify(PERF_PROTOCOL)}`);
  console.log(`BUDGET   ${JSON.stringify(PERF_BUDGET)}`);
  const rows = leaves.map((k) => timeLeaf(k, samples));
  let red = 0;
  for (const r of rows) {
    // ⛔⛔ **THE BUDGET USED TO BIND ON ONE TIER AND PRINT GREEN ON EVERY OTHER.** Spelled
    // `r.tier === 'metropolis' ? … : null`, a `town`-tier leaf had NO cap at all — and the fjord
    // came back **`build 3169.6 ms … WITHIN BUDGET`**, 27 % over the metropolis budget it was never
    // measured against, on an instrument whose whole job is to say so. That is §681.2's own class
    // (*"a planted control had died and was still printing"*) arriving in the perf harness.
    // ⭐ THE CURE MINTS NO CONSTANT: the metropolis is the LARGEST leaf, so its signed budget is a
    // valid upper bound for every smaller one. A tier-by-tier table would be four new numbers this
    // lane measured rather than chose, so it is not minted here.
    const capBuild = PERF_BUDGET.constructorMsMetropolis;
    const capPage = PERF_BUDGET.pageBaselineMsCity * PERF_BUDGET.pageMultiple;
    const bOk = r.buildMedian <= capBuild;
    const pOk = r.pageMedian <= capPage;
    if (!bOk || !pOk) red++;
    console.log(`${r.key.padEnd(12)} ${r.tier.padEnd(11)} build ${String(r.buildMedian).padStart(8)} ms  [${r.buildMs.join(', ')}]`
      + `   page ${String(r.pageMedian).padStart(7)} ms  [${r.pageMs.join(', ')}]`
      + `   ${bOk && pOk ? 'WITHIN BUDGET' : 'OVER BUDGET'}`);
  }
  console.log(`OVER BUDGET: ${red} of ${rows.length}`);
  process.exitCode = red ? 1 : 0;
}
