/**
 * probeMut.mjs — REG-1's CONVICTING MUTATIONS.
 *
 * A guard that cannot fail proves nothing. `frontageFusion.claimPenetration` must read ZERO on
 * the shipped predicate — a mass only ever closes a party residual lying strictly between two
 * plots §17 already cleared — so the number is worth nothing until something makes it fire.
 * These three mutations are what make it fire, and each is one of the charter's own:
 *
 *   M1 UN-FUSE ONE RANK      the largest mass's run is forced non-party. The mass disappears and
 *                            the RENDERED run metric drops — i6-frontage, run as-is, at a grid
 *                            whose cell resolves the leaf's own party gap.
 *   M2 FUSE ACROSS A STREET  the run key drops its ROW, so ranks in adjacent rows — separated by
 *                            `widths.blockLane`, a drawn street — fuse into one mass.
 *                            claimPenetration.byKind.street goes positive.
 *   M3 FUSE ACROSS THE BAND  the run key collapses to the ORGANISM, so a mass may span anything
 *                            the ward touches, the circuit included.
 *                            claimPenetration.byKind.circuit goes positive.
 *
 * Run from the tree root: node harness/laneREG1/probeMut.mjs [--leaf=city] [--grid=5000]
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { renderFolio } from '../renderFolio.mjs';
import { fuseFrontages, claimPenetration } from '../../src/domain/townMap/fabric/frontageFusion.js';
import { distToPolyline } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { circuitClaims } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { waterClaims } from '../../src/domain/townMap/fabric/waterWorks.js';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const LEAF = arg('leaf', 'city');
const GRID = arg('grid', '5000');
const OUT = arg('out', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/44d62321-a15e-46a1-ac9b-693c595fa7d9/scratchpad/mut');
const I6 = arg('i6', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments/i6-frontage.mjs');
mkdirSync(OUT, { recursive: true });

const spec = CORPUS.find((s) => s.key === LEAF);
const { fabric } = buildOne(spec, { frontageFusion: true });
const frontage = fabric.meta.plotFrontage;

/** The ground law's own claim set, by kind, so a penetration can name what it stood in. */
const claims = []
  .concat(fabric.channels.map((c) => ({ line: c.line, width: c.width, kind: 'street' })))
  .concat(circuitClaims(fabric.wallCircuit).map((c) => ({ line: c.line, width: c.width, kind: 'circuit' })))
  .concat(waterClaims(fabric.water).map((c) => ({ line: c.line, width: c.width, kind: 'water' })));

const drawn = fabric.parcels.filter((p) => p.fuse);
const frames = fabric.fusion.frames;
const merged = fabric.lod.mergedKeys;

/** Re-fuse from the published leaf with the run keys rewritten — no shipped byte is mutated. */
function refuse(rewriteKey, forceNonParty) {
  const seen = new Map();
  const ps = drawn.map((p) => {
    const nk = rewriteKey(p.fuse.runKey);
    return { ...p, fuse: { ...p.fuse, runKey: nk, party: forceNonParty && forceNonParty(p) ? false : p.fuse.party } };
  });
  const fr = [];
  for (const f of frames) {
    const nk = rewriteKey(f.runKey);
    if (seen.has(nk)) continue;                      // the first frame wins — the mutation's own lie
    seen.set(nk, 1);
    fr.push({ ...f, runKey: nk });
  }
  return fuseFrontages({ parcels: ps, frames: fr, merged, frontage });
}

const id = (k) => k;
const dropRow = (k) => { const s = k.split('|'); return [s[0], s[2], s[3], s[4]].join('|'); };
const toOrganism = (k) => k.split('|')[0];

// M1's subject: the largest mass's own run.
const biggest = fabric.fusion.masses.slice().sort((a, b) => b.members - a.members)[0];
const victimRun = biggest.key.slice('fuse.'.length).replace(/#\d+$/, '');
const victimKeys = new Set(biggest.memberKeys);

const CASES = [
  ['LAW (shipped)', () => fabric.fusion],
  ['M1 un-fuse one rank', () => refuse(id, (p) => victimKeys.has(p.key))],
  ['M2 fuse across a street (runKey drops ROW)', () => refuse(dropRow, null)],
  ['M3 fuse across the band (runKey → organism)', () => refuse(toOrganism, null)],
];

const P = (s, n) => String(s).padStart(n);
process.stdout.write(`leaf=${LEAF} tier=${fabric.meta.tier} frontage=${frontage} partyGap=${Math.round(frontage * 0.035 * 1000) / 1000}u grid=${GRID} (cell ${Math.round((1000 / Number(GRID)) * 1000) / 1000}u)\n`);
process.stdout.write(`M1 subject: run ${victimRun} — ${biggest.members} holdings\n\n`);
process.stdout.write(`${'case'.padEnd(44)}${P('masses', 8)}${P('fused', 7)}${P('penetr.', 9)}${P('street', 8)}${P('circuit', 8)}${P('water', 7)}${P('worstU', 8)}\n`);

const results = {};
for (const [name, make] of CASES) {
  const f = make();
  const pen = claimPenetration(f.masses, claims, distToPolyline);
  results[name] = { counts: f.counts, pen };
  process.stdout.write(`${name.padEnd(44)}${P(f.masses.length, 8)}${P(f.counts.fusedParcels, 7)}${P(pen.inClaim, 9)}${P(pen.byKind.street || 0, 8)}${P(pen.byKind.circuit || 0, 8)}${P(pen.byKind.water || 0, 7)}${P(pen.worstUnits, 8)}\n`);
}

// ── M1's rendered arm: the run metric, measured by the preserved instrument, run as-is.
//
// ⚠⚠ ONE RANK IS BELOW A LEAF-WIDE METRIC'S RESOLUTION, AND SAYING SO IS THE POINT. Un-fusing
// the largest single run (7 of 1,233 drawn plots) moved i6's city figures by LESS THAN THE
// SECOND DECIMAL — `meanRun 10.65 → 10.65`. That is not the mutation failing to bite; it is a
// whole-leaf mean being asked to resolve 0.6 % of its own population, and a mutation reported
// as "no change" at that scale would be a false acquittal. ⭐ THE CLASS: **a mutation must be
// scaled to the resolution of the instrument that judges it.** So the arm is a LADDER — 1, 20,
// 60, then ALL runs un-fused — and its bottom rung is the exact negative control the i6 header
// itself demands: with every run un-fused the leaf must return to the DORMANT bytes.
const LADDER = [0, 1, 20, 60, Infinity];
const ranked = fabric.fusion.masses.slice().sort((a, b) => b.members - a.members);
const rungCase = (n) => {
  if (n === 0) return ['LAW (shipped)', () => fabric.fusion];
  const kill = new Set();
  for (const m of ranked.slice(0, n === Infinity ? ranked.length : n)) for (const k of m.memberKeys) kill.add(k);
  return [`M1 un-fuse ${n === Infinity ? 'ALL' : n} run(s)`, () => refuse(id, (p) => kill.has(p.key))];
};
process.stdout.write('\n── M1 · THE RENDERED RUN METRIC (i6-frontage, as-is), AS A LADDER\n');
const renderRows = [];
for (const n of LADDER) {
  const [name, make] = rungCase(n);
  const f = make();
  const leaf = { ...fabric, fusion: f };
  Object.defineProperty(leaf, 'parcels', { value: fabric.parcels, enumerable: true });
  Object.defineProperty(leaf, 'water', { value: fabric.water, enumerable: true });
  Object.defineProperty(leaf, 'walls', { value: fabric.walls, enumerable: true });
  const { svg } = renderFolio(leaf, { lens: 'parchment' });
  const file = `${OUT}/${LEAF}-m1-${n === Infinity ? 'all' : n}.svg`;
  writeFileSync(file, svg);
  const j = `${OUT}/.i6.json`;
  execFileSync('node', ['--max-old-space-size=12000', I6, `--svg=${file}`, `--frontage=${frontage}`, `--grid=${GRID}`, `--json=${j}`], { stdio: ['ignore', 'ignore', 'inherit'] });
  const r = JSON.parse(readFileSync(j, 'utf8')).F1F2_base;
  renderRows.push([name, r, f.masses.length, file]);
  process.stdout.write(`${name.padEnd(28)} masses=${P(f.masses.length, 4)} runs=${P(r.runs, 6)} meanRun=${P(r.meanRunUnits, 7)} frontingMasses=${P(r.frontingMasses, 5)} ratio=${r.ratio}\n`);
}
const law = renderRows[0], all = renderRows[renderRows.length - 1];
let monotone = true;
for (let i = 1; i < renderRows.length; i++) {
  if (renderRows[i][1].meanRunUnits > renderRows[i - 1][1].meanRunUnits) monotone = false;
}
const drop = all[1].meanRunUnits < law[1].meanRunUnits;
const rise = all[1].frontingMasses > law[1].frontingMasses;
process.stdout.write(`\nM1 VERDICT: meanRun ${law[1].meanRunUnits} → ${all[1].meanRunUnits} (${drop ? 'DROPS' : 'DOES NOT DROP'}), `
  + `fronting masses ${law[1].frontingMasses} → ${all[1].frontingMasses} (${rise ? 'RISES' : 'does not rise'}); `
  + `monotone across the ladder: ${monotone}\n`);

// ⚠⚠ APPLICABILITY IS REPORTED, NEVER FOLDED INTO "BROKEN" — the instrument set's own discipline
//   ("applicable: true/false"), and the village proved why it is needed. M2 rewrites the run key
//   to drop the ROW, but a leaf whose ranks never carry adjacent `seq` across a row is one the
//   mutation cannot reach: it changed NOTHING, and a mutation that changed nothing is inert, not
//   refuted. M3's circuit arm needs a circuit: the village is UNWALLED, so "0 circuit
//   penetrations" there is an ABSENT SUBJECT. ⭐ THE CLASS: a control that reads zero because its
//   subject does not exist is not a failing control, and reporting it as one trains the reader to
//   ignore reds.
const M2 = results['M2 fuse across a street (runKey drops ROW)'];
const M3 = results['M3 fuse across the band (runKey → organism)'];
const LAW = results['LAW (shipped)'];
const m2Moved = M2.counts.fusedParcels !== LAW.counts.fusedParcels || M2.counts.groups !== LAW.counts.groups;
const walled = (fabric.walls || []).length > 0;
const live = [
  ['LAW penetrates no claim', LAW.pen.inClaim === 0, true],
  ['M1 un-fusing every run drops the rendered run metric', drop, true],
  ['M1 the ladder is monotone (more un-fused ⇒ shorter runs)', monotone, true],
  ['M1 un-fusing every run raises the fronting-mass count', rise, true],
  ['M2 street-crossing fusion penetrates a STREET claim', (M2.pen.byKind.street || 0) > 0, m2Moved],
  ['M3 street/band-crossing fusion penetrates a STREET claim', (M3.pen.byKind.street || 0) > 0, true],
  ['M3 band-crossing fusion penetrates the CIRCUIT claim', (M3.pen.byKind.circuit || 0) > 0, walled],
];
process.stdout.write('\n── LIVENESS\n');
for (const [n, ok, applicable] of live) {
  process.stdout.write(`   ${applicable ? (ok ? 'ok    ' : 'BROKEN') : 'n/a   '} ${n}`
    + `${applicable ? '' : (n.startsWith('M2') ? '  (the mutation changed no mass on this leaf — inert, not refuted)' : '  (this leaf is UNWALLED — absent subject)')}\n`);
}
writeFileSync(`${OUT}/${LEAF}-mutations.json`, JSON.stringify({ results, renderRows, live, walled, m2Moved }, null, 1));
const applicable = live.filter((l) => l[2]);
process.stdout.write(`\nPROBE_MUT ${applicable.every((l) => l[1]) ? 'LIVE' : 'BROKEN'} (${applicable.length} of ${live.length} arms applicable on ${LEAF})\n`);
