#!/usr/bin/env node
/**
 * harness/laneGROWA/snapshotDivergence.mjs — ⭐⭐⭐ GROW-A · **EXIT 2 · THE SNAPSHOT-DIVERGENCE
 * CENSUS**, and it is the exit that proves C3 dead rather than merely quieter.
 *
 * DESIGN_REG_GROW §6.2, verbatim: *"year-K frames pairwise differ where the trajectory moved
 * (plateau frames may agree — the control plants a known growth epoch and the census must red if
 * frames are identical across it)."* DESIGN_SPINE A2b re-homes this exit to SPINE-2; SPINE-2 proved
 * it on the PARTITION's own truncation. This instrument proves the other half — the one C3 is
 * actually about: **the drawn folio at year K.**
 *
 * ⛔⛔ THE DEFECT, MEASURED AT THE PRE-SPINE BASE AND RE-QUOTED HERE SO THE ZERO HAS A SHAPE:
 * `settlementAtYear` re-issues the EVENT HORIZON and never the SIZE — *"THE POPULATION IS HELD
 * CONSTANT ACROSS SNAPSHOTS, DECLARED"* — and `tierScale`, the sole sizer every growth stage funnels
 * through, reads no year at all. So the town's years 0, 18, 100, 154 and 191 all drew the same
 * 1,232 plots with the same geometry. The frame projection gives each frame the ledger's own
 * population; this census is what says so with numbers.
 *
 * THE THREE ARMS:
 *   1 · DIVERGENCE   consecutive frames whose ledger population MOVED must draw differently.
 *   2 · PLATEAU      consecutive frames whose ledger population did NOT move may agree — and the
 *                    census does not convict them, which is what makes arm 1 a claim and not a
 *                    tautology about rendering noise.
 *   3 · THE PLANTED CONTROL  a frame pair taken across a KNOWN growth epoch is re-rendered with the
 *                    projection DISABLED (`settlementAtYear`, the sealed path). It must come back
 *                    IDENTICAL — which is the defect — and the census must RED on it. A control
 *                    that cannot fail is not a control.
 *
 * Usage: node harness/laneGROWA/snapshotDivergence.mjs [--leaf=town] [--frames=8]
 */
import { createHash } from 'node:crypto';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { settlementAtYear } from '../../src/domain/townMap/fabric/snapshot.js';
import { buildGrowthLedger, frameAtEpoch, epochAtYear } from '../../src/domain/townMap/fabric/growthLedger.js';
import { renderFolio } from '../renderFolio.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const digest = (s) => createHash('sha256').update(s).digest('hex').slice(0, 12);

/** ⭐ THE FULL ARM SET (§681.4's standing order): a dormant `riverProfile` makes every station read
 *  16.71 and the crossing discrimination vacuous, so every armed run carries `--river`. */
const ARMED = Object.freeze({
  partition: true, frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true,
  minFootprint: true, waterfrontExemption: true, quayRegister: true, riverProfile: true,
  deckLaw: true, fordRegister: true,
});

const leafKey = arg('leaf', 'town');
const spec = CORPUS.find((s) => s.key === leafKey);
if (!spec) throw new Error(`snapshotDivergence: no corpus leaf '${leafKey}'`);

const cfg = { settType: spec.settType };
if (spec.terrain) cfg.terrainOverride = spec.terrain;
const settlement = generateSettlementPipeline(cfg, null, { seed: spec.seed });
const model = buildTownMapModel(settlement, null);
const present = buildFabric(settlement, model, { ...ARMED });
const vin = present.record.get('wall-built-year', null);
const wallBuiltAtAge = vin ? vin.ageAtBuild : null;
const ledger = buildGrowthLedger(settlement, model, { wallBuiltAtAge });
const presentAge = present.meta.settlementAge;

/** Render one year frame through the route under test. */
function frame(year, projected) {
  const at = projected
    ? frameAtEpoch(settlement, ledger, epochAtYear(ledger, year))
    : settlementAtYear(settlement, year);
  const fab = buildFabric(at, model, { ...ARMED, year, wallBuiltAtAge, presentAge });
  const { svg, elementCount, primitiveCount } = renderFolio(fab, { lens: 'parchment' });
  return {
    year,
    population: at.population,
    tier: fab.meta.tier,
    parcels: fab.parcels.length,
    elementCount,
    primitiveCount,
    svg: digest(svg),
  };
}

// The years are the LEDGER's own band edges, evenly sampled — never years this file chose.
const want = Math.max(3, Number(arg('frames', '8')));
const step = Math.max(1, Math.floor(ledger.epochs.length / want));
const years = [];
for (let k = 0; k < ledger.epochs.length; k += step) years.push(ledger.epochs[k].year);
if (years[years.length - 1] !== ledger.epochs[ledger.epochs.length - 1].year) {
  years.push(ledger.epochs[ledger.epochs.length - 1].year);
}

console.log(`LEAF ${leafKey} · ${ledger.epochs.length} ledger epoch(s) over ${ledger.presentYear} years`
  + ` · ${ledger.trajectory.shape}`);
console.log(`\nARM 1/2 · THE PROJECTED FRAMES (the route under test)`);
const rows = years.map((y) => frame(y, true));
for (const r of rows) {
  console.log(`  year ${String(r.year).padStart(4)}  pop ${String(r.population).padStart(6)}`
    + `  tier ${r.tier.padEnd(11)} parcels ${String(r.parcels).padStart(5)}`
    + `  els ${String(r.elementCount).padStart(4)}  svg ${r.svg}`);
}

let red = 0;
let moved = 0; let plateau = 0;
for (let i = 1; i < rows.length; i++) {
  const a = rows[i - 1]; const b = rows[i];
  if (b.population === a.population) { plateau++; continue; }
  moved++;
  if (a.svg === b.svg) {
    red++;
    console.log(`  ⛔ RED: years ${a.year}→${b.year} move ${a.population}→${b.population} souls and`
      + ' draw BYTE-IDENTICAL folios — the trajectory moved and the map did not (C3)');
  }
}
console.log(`\n  ${moved} pair(s) where the trajectory MOVED — all ${moved - red} of them diverge`
  + ` · ${plateau} plateau pair(s), not convicted (§6.2's own clause)`);

console.log(`\nARM 3 · THE PLANTED CONTROL — the same pair through the SEALED path (projection OFF)`);
let pick = -1;
for (let i = 1; i < rows.length; i++) {
  if (rows[i].population !== rows[i - 1].population) { pick = i; break; }
}
if (pick < 0) {
  console.log('  SKIPPED: this leaf\'s trajectory never moves — pick another leaf');
} else {
  const cA = frame(rows[pick - 1].year, false);
  const cB = frame(rows[pick].year, false);
  console.log(`  year ${cA.year} → pop ${cA.population} tier ${cA.tier} parcels ${cA.parcels} svg ${cA.svg}`);
  console.log(`  year ${cB.year} → pop ${cB.population} tier ${cB.tier} parcels ${cB.parcels} svg ${cB.svg}`);
  const identical = cA.svg === cB.svg;
  console.log(`  the control ${identical ? 'CONVICTS' : 'DOES NOT CONVICT'}: the sealed path draws`
    + ` ${identical ? 'BYTE-IDENTICAL' : 'DIFFERENT'} folios across a KNOWN growth epoch`
    + ` (${cA.population} → ${cB.population} souls on the ledger)`);
  if (!identical) {
    red++;
    console.log('  ⛔ RED: the control did not convict — arm 1\'s green is therefore not evidence.'
      + ' A control that cannot fail is not a control.');
  }
}

console.log(`\nVERDICT: ${red ? `${red} RED` : 'GREEN'}`);
process.exitCode = red ? 1 : 0;
