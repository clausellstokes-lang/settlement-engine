#!/usr/bin/env node
/**
 * harness/laneGROWA/ledgerDifferential.mjs — ⭐⭐⭐ GROW-A · **EXIT 1 · THE REG-4 DIFFERENTIAL,
 * RE-EXPRESSED ON THE PARTITION AND DRIVEN BY THE LEDGER.**
 *
 * DESIGN_REG_GROW §6.1: *"the REG-4 differential, re-run, MUST PASS: circuit stands still across the
 * sub-threshold band (C2), infill rises, through-wall = 0, sprawl = 0, typed faubourgs counted
 * separately; `--break` still fails it."*
 *
 * ⛔⛔ **WHY THE SEALED INSTRUMENT CANNOT ANSWER THIS AND THIS ONE CAN.** `harness/laneREG4/
 * densification.mjs` measures the LEGACY fabric (`parcels`, `wallCircuit.rings`), which the spine
 * has not yet cut over to; run at this seal it FAILS every arm, and it fails them for the reason
 * REG-4 recorded — the legacy circuit re-derives per population and the legacy packer sprawls. That
 * red is the CONVICTION the whole program answers, not a regression, and it is quoted in the lane
 * receipt rather than hidden. This instrument asks the same four questions of the PARTITION, whose
 * circuit is a dated object the ledger froze.
 *
 * ⭐ THE LADDER IS THE LEDGER'S OWN EPOCHS, walked by `epochCap` — the same truncation §3g's
 * prefix-closure rests on — so no population is written down here and no rung is invented. A2.2's
 * band-agnostic rule from REG-4 carries: not one boundary population appears in this file.
 *
 * THE FIVE MEASURED QUANTITIES, each a predicate over the partition's own PLOT faces:
 *   frozenRadius    the standing wrap's extent — MUST NOT MOVE once raised (C2)
 *   intramural      a plot whose centroid is inside the standing wrap's inner ring
 *   typedFaubourg   a plot the constructor recorded against a ledger EMISSION act — lawful, apart
 *   mooredQuay      a plot the constructor recorded against a §3e QUAY act — lawful, apart
 *   sprawl          extramural and NOT covered by a typed act — the thing that must be zero
 *
 * ⭐⭐ **WHY A QUAY IS COUNTED APART (GFOLD, §684.3).** A moored quay piece (`partitionWater.
 * mintQuays`) is a PLOT face the constructor mints on the water, outside the circuit by
 * construction — A1.3 S2-M1 says the wall TERMINATES at the bank and does not dam the channel, so
 * a waterfront work can never be enclosed. It is a TYPED act with its own published record
 * (`P.quays`), exactly as a faubourg is. Crediting it is therefore the same sentence the arm
 * already speaks about emissions, not a widening of it, and the attribution is by EXACT FACE ID
 * from that record — the arm cannot credit a face no quay act minted.
 * ⚠ THE GAP WAS LATENT, NOT NEW: at the GROW-A seal no corpus leaf put a quay outside its circuit
 * (town 1 · year-100 3, all intramural; the fjord's 1 sits on a leaf with no circuit at all), so
 * the arm passed 13/13 without the case ever arising. Once the raise moved ahead of the epoch's
 * growth the `city`/`migration` fixture reached its waterfront and minted 4, and the arm convicted
 * them as sprawl — MEASURED as exactly the 4 faces in `P.quays`, at rung 9, and nothing else.
 *
 * `--break` holds the ledger's population CONSTANT across every epoch. The rising arm must then
 * fail; a differential that passes on a flat ledger is measuring nothing.
 * `--plant-sprawl=N` mints N UNTYPED extramural plots per walled rung out of open frontier field —
 * the sprawl arm's own liveness control, and the reason the quay credit above can be trusted: an
 * arm that credits too much is indistinguishable from an arm that measures nothing unless a
 * planted violation still convicts it.
 *
 * Usage: node harness/laneGROWA/ledgerDifferential.mjs [--leaf=town] [--break] [--plant-sprawl=N]
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { faceCentroid, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const BREAK = process.argv.includes('--break');
/** ⛔ THE SPRAWL ARM'S PLANTED VIOLATION: N more untyped extramural plots at EVERY rung, so the
 *  arm sees a per-rung DELTA it cannot attribute. A flat plant would be invisible to a differential
 *  — the same vacuity `--break` exists to prevent one arm up. */
const PLANT = Math.max(0, Number(arg('plant-sprawl', '0')) || 0);

const key = arg('leaf', 'town');
const spec = CORPUS.find((s) => s.key === key);
if (!spec) throw new Error(`ledgerDifferential: no corpus leaf '${key}'`);
const { settlement, model, fabric } = buildOne(spec);
const base = partitionInputs(settlement, model, fabric);

/** ⛔ THE CONVICTING MUTATION: every epoch holds the PRESENT population, so nothing grows. */
function flatten(ledger) {
  const pop = ledger.epochs[ledger.epochs.length - 1].population;
  return Object.freeze({
    ...ledger,
    epochs: Object.freeze(ledger.epochs.map((e) => Object.freeze({
      ...e, population: pop, peakSoFar: pop, plotSetDelta: 0, intramuralDelta: 0, extramuralDelta: 0,
    }))),
  });
}
const input = BREAK ? { ...base, ledger: flatten(base.ledger) } : base;

/** Even-odd point-in-ring in world units — the wrap's own test. */
function inRing(ring, p) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; const [xj, yj] = ring[j];
    if ((yi > p[1]) !== (yj > p[1])
      && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function measure(P) {
  const arr = P.arrangement;
  const wrap = P.wraps.length ? P.wraps[P.wraps.length - 1] : null;
  // ⚠ **TWO RINGS, TWO QUESTIONS, AND CONFLATING THEM IS A PREDICATE BUG.** `inner` answers *"is
  // this plot inside the walled town"* — the infill count. `outer` answers *"has this plot LEFT the
  // circuit"* — the sprawl count — and it is the ring `emitLot`'s own §3d guard tests, so the
  // instrument and the law read the same line. Measuring sprawl against `inner` counts the wall's
  // own band as open country and convicts lawful ground.
  let intra = 0; let extra = 0;
  for (const f of liveFaces(arr)) {
    if (f.cls !== 'PLOT') continue;
    if (!wrap) { extra++; continue; }
    if (inRing(wrap.inner, faceCentroid(arr, f.id))) intra++;
    if (!wrap || !inRing(wrap.outer, faceCentroid(arr, f.id))) extra++;
  }
  const typed = P.emissions.reduce((n, e) => n + e.plots, 0);
  // ⭐ THE §3e CREDIT, BY EXACT FACE ID and counted with the SAME predicate the extramural column
  //   uses, so the two can never disagree about one face: a quay's PLOT face that lies outside the
  //   circuit is a typed act's ground, not sprawl.
  let quay = 0;
  for (const q of P.quays) {
    const f = arr.faces[q.face];
    if (!f || !f.alive || f.cls !== 'PLOT') continue;
    if (wrap && inRing(wrap.outer, faceCentroid(arr, q.face))) continue;
    quay++;
  }
  return {
    plots: P.plots,
    rings: P.wraps.length,
    frozenRadius: wrap ? wrap.frozenRadius : null,
    intramural: intra,
    extramural: extra,
    typedFaubourg: typed,
    mooredQuay: quay,
    /** ⛔ THE PREDICATE THAT MUST BE ZERO: extramural ground no typed act paid for. */
    sprawl: Math.max(0, extra - typed - quay),
    sprawlRefusals: P.sprawlRefusals,
    emissionRefusals: P.emissionRefusals,
  };
}

/** ⛔ THE PLANT. Open frontier FIELD becomes PLOT with NO emission act and NO quay record behind
 *  it — untyped extramural ground, which is precisely what the arm must refuse. Returns how many
 *  it managed to plant, so a rung that could not host the violation says so instead of passing. */
function plantSprawl(P, n) {
  const arr = P.arrangement;
  const wrap = P.wraps.length ? P.wraps[P.wraps.length - 1] : null;
  if (!wrap || n <= 0) return 0;
  let made = 0;
  for (const f of liveFaces(arr)) {
    if (made >= n) break;
    if (f.cls !== 'FIELD') continue;
    if (f.attrs && f.attrs.inBand) continue;
    if (inRing(wrap.outer, faceCentroid(arr, f.id))) continue;
    f.cls = 'PLOT';
    made++;
  }
  return made;
}

const nEpochs = input.ledger.epochs.length;
const rungs = [];
let planted = 0;
for (let k = 1; k <= nEpochs; k++) {
  const P = buildSettledPartition({ ...input, epochCap: k });
  // ⚠ THE PLANT GROWS WITH THE RUNG. A constant plant is invisible to a DELTA predicate — the arm
  //   would read zero untyped growth and pass, which is the vacuity `--break` already guards one
  //   arm against and this guards the other.
  if (PLANT) planted += plantSprawl(P, PLANT * k);
  rungs.push({ k, year: input.ledger.epochs[k - 1].year, pop: input.ledger.epochs[k - 1].population, ...measure(P) });
}
if (PLANT) console.log(`⛔ PLANTED SPRAWL: ${PLANT} untyped extramural plot(s) per rung`
  + ` (${planted} planted in total) — the arm MUST convict`);

console.log(`LEAF ${key}${BREAK ? '  ⛔ --break (population HELD CONSTANT)' : ''}`
  + ` · ${nEpochs} ledger epoch(s) · ${input.ledger.trajectory.shape}`);
console.log('rung  year   pop     rings  frozenR    intramural  extramural  typedFaubourg  quay  SPRAWL');
for (const r of rungs) {
  console.log(`${String(r.k).padStart(4)} ${String(r.year).padStart(5)} ${String(r.pop).padStart(7)}`
    + `   ${String(r.rings).padStart(3)}   ${r.frozenRadius === null ? '    —   ' : r.frozenRadius.toFixed(2).padStart(8)}`
    + `    ${String(r.intramural).padStart(8)}    ${String(r.extramural).padStart(8)}`
    + `       ${String(r.typedFaubourg).padStart(6)}${String(r.mooredQuay).padStart(6)}  ${String(r.sprawl).padStart(6)}`);
}

// ── THE ARMS ────────────────────────────────────────────────────────────────────────────────
const walled = rungs.filter((r) => r.rings > 0 && r.frozenRadius !== null);
const arms = [];

// C2 · the circuit STANDS: while the ring count is unchanged, its frozen extent may not move.
let stands = true; let movedAt = null;
for (let i = 1; i < walled.length; i++) {
  if (walled[i].rings !== walled[i - 1].rings) continue;
  if (Math.abs(walled[i].frozenRadius - walled[i - 1].frozenRadius) > 1e-9) {
    stands = false; movedAt = walled[i].k;
  }
}
arms.push(['circuit STANDS STILL while the ring count holds (C2)', stands,
  stands ? `${walled.length} walled rung(s), extent unmoved` : `moved at rung ${movedAt}`]);

// infill RISES with population, under a standing circuit
// ⛔⛔ **AND THE ARM CARRIES ITS OWN VACUITY GUARD, WHICH IS WHAT MAKES `--break` CONVICT.** The
// first spelling skipped every rung where the population did not rise — so on a FLAT ledger it
// skipped all of them and returned a green with ZERO observations behind it. `--break`'s whole job
// is to fail, and it passed. An arm with no observations is not a pass; it is an arm that did not
// run, and the two are indistinguishable in a boolean.
let rises = true; let fellAt = null; let observed = 0;
for (let i = 1; i < walled.length; i++) {
  if (walled[i].rings !== walled[i - 1].rings) continue;
  if (walled[i].pop <= walled[i - 1].pop) continue;
  observed++;
  if (walled[i].intramural < walled[i - 1].intramural) { rises = false; fellAt = walled[i].k; }
}
// ⚠ AND ONE NARROW N/A, WHICH THE `--break` CONTROL PROVES IS NOT A LOOPHOLE: a leaf whose RECORD
// speaks a decline (`highwater`, SACKED-NEVER-RECOVERED) has no rising rung under its wrap to
// measure, and that is a fact about the settlement, not a failure of the law. `--break` flattens the
// POPULATION and leaves `trajectory.shape` at MONOTONE-GROWTH, so a broken run can never reach this
// branch — it still reds with "ZERO rising rungs observed", which is exactly what it must do.
const declining = input.ledger.trajectory.shape !== 'MONOTONE-GROWTH';
const risingNA = observed === 0 && declining;
arms.push(['intramural infill RISES with population', risingNA ? null : (rises && observed > 0),
  risingNA ? `the record speaks a ${input.ledger.trajectory.shape} — no rising rung under a standing wrap to measure`
    : observed === 0 ? '⛔ ZERO rising rungs observed — the arm did not run'
    : (rises ? `monotone across all ${observed} sub-threshold rung(s)` : `fell at rung ${fellAt}`)]);

// ⭐⭐ SPRAWL = 0 · AND THE PREDICATE IS A **DELTA UNDER A STANDING WRAP**, WHICH IS WHAT §3b
// ACTUALLY SAYS. A1.5 is explicit that *"the circuit law binds only where a circuit exists"*, and
// §3d's law is about what happens UNDER a standing wrap. ⚠ THE FIRST SPELLING HERE TOOK THE STOCK
// — every plot outside the ring — and convicted 1,965 on the town, of which every one was either
// built BEFORE the wall was raised (rungs 1–11 have no ring at all) or left outside it AT the
// raise. Calling a pre-wall hamlet "sprawl" is REG-4's own arm-1 error read backwards: a body count
// taken across two different regimes is not a differential.
let sprawl = 0; const sprawlRungs = [];
for (let i = 1; i < rungs.length; i++) {
  const a = rungs[i - 1]; const b = rungs[i];
  if (!(a.rings > 0) || b.rings !== a.rings) continue;   // no standing wrap, or a NEW ring was raised
  const grew = b.extramural - a.extramural;
  const paid = (b.typedFaubourg - a.typedFaubourg) + (b.mooredQuay - a.mooredQuay);
  const untyped = Math.max(0, grew - paid);
  if (untyped > 0) { sprawl += untyped; sprawlRungs.push(`rung ${b.k} (+${grew} extramural, ${paid} typed)`); }
}
arms.push(['SPRAWL (untyped extramural growth under a standing wrap) = 0', sprawl === 0,
  sprawl === 0 ? 'every extramural plot added under a standing wrap is paid for by a typed act'
    : `${sprawl} untyped plot(s) at ${sprawlRungs.join(', ')}`]);

// typed faubourgs counted SEPARATELY and non-zero where the ledger emitted
const emitted = input.ledger.emissions.length;
const typedTotal = rungs.length ? rungs[rungs.length - 1].typedFaubourg : 0;
arms.push(['typed faubourgs counted apart, and drawn where the ledger emits',
  emitted === 0 || typedTotal > 0,
  `${emitted} ledger act(s) → ${typedTotal} drawn plot(s)`]);

console.log('\n── THE DIFFERENTIAL, ARM BY ARM ──');
// ⭐⭐ **NOT APPLICABLE IS NOT A PASS AND IT IS NOT A FAIL — IT IS A MISSING PRECONDITION, SAID.**
// A1.5: *"the circuit law binds only where a circuit exists."* A thorp has no wrap, so there is no
// standing circuit for anything to stand still across, and a leaf whose trajectory only FALLS has no
// rising rung for infill to rise on. Scoring either as RED would make the corpus verdict a tier
// census; scoring either as GREEN would let a leaf pass by having nothing measured. ⚠ THE N/A IS
// STRUCTURAL AND NARROW: it fires on the ABSENCE OF A CIRCUIT or of a rising walled rung, never on a
// zero the arm actually measured — and `--break` still convicts, because a flat ledger HAS a
// standing circuit and simply never rises under it.
const applicable = walled.length >= 2;
let red = 0; let na = 0;
for (const [name, ok, note] of arms) {
  if (!applicable) { na++; console.log(`  ${name.padEnd(56)}: N/A  (no standing circuit on this leaf — ${note})`); continue; }
  if (ok === null) { na++; console.log(`  ${name.padEnd(56)}: N/A  (${note})`); continue; }
  if (!ok) red++;
  console.log(`  ${name.padEnd(56)}: ${ok ? 'YES' : '⛔ NO '}  (${note})`);
}
const pass = red === 0;
if (na) console.log(`\n  ${na} arm(s) NOT APPLICABLE: this leaf never raises a circuit, so §3b/§3d have nothing to bind.`);
console.log(`\nVERDICT: ${!applicable ? 'NOT APPLICABLE (no circuit)' : (pass ? `DIFFERENTIAL PASSES${na ? ` (${na} arm N/A)` : ''}` : '⛔ DIFFERENTIAL FAILS')}`);
if (BREAK) {
  console.log(pass
    ? '⛔ THE BREAK ARM DID NOT CONVICT — a differential that passes on a FLAT ledger measures nothing.'
    : '✔ THE BREAK ARM CONVICTS, which is what makes the un-broken run evidence.');
  process.exitCode = pass ? 1 : 0;
} else {
  process.exitCode = pass ? 0 : 1;
}
