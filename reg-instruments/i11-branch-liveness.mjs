/**
 * i11-branch-liveness.mjs — REG-I0 · INSTRUMENT 11 · THE SYNTHETIC CONTROLS FOR THE TWO UNFIRED
 * BRANCHES (REG-4 receipt §6 item 2).
 *
 * ⭐⭐ THE PROBLEM THIS EXISTS FOR, IN REG-4's OWN WORDS: *"`triangular` FIRES ON NO CORPUS VOID
 * and `bridgehead` ON NO CORPUS FAUBOURG. Both branches are reachable by construction and both
 * thresholds are derived rather than chosen, but NEITHER HAS A LIVENESS CONTROL YET … Until it
 * exists, 'the branch is unfired' is honest and 'the branch works' is not claimed."*
 *
 * A branch nothing fires is indistinguishable, from the outside, from a branch that CANNOT fire.
 * This instrument tells them apart the only way that settles it: it builds the minimum world in
 * which each branch MUST fire, drives **the shipped selector itself** — no re-implementation, no
 * mock of the decision — and then walks the threshold until it stops firing, so the boundary is
 * measured rather than asserted.
 *
 * ⛔⛔ NO `src/` BYTE IS EDITED AND NOTHING IS MONKEY-PATCHED. Both modules are imported from the
 * worktree exactly as the fabric imports them. What is synthetic is the INPUT, and the input is
 * built to each module's own declared input shape (`deriveMarketRegister({squares, channels, …})`,
 * `deriveFaubourgOrigins({buildings, bridges, walls, frontage, …})`), read off the modules
 * themselves rather than guessed.
 *
 * ═══ ARM A · `triangular` — src/domain/townMap/fabric/marketRegister.js ═══
 *   THE LAW: `marketShapeFor` returns `triangular` when EXACTLY THREE mouths are MAJOR
 *   (`width ≥ 0.55 × the widest`) and the SMALLEST PAIRWISE BEARING SEPARATION clears
 *   `TRIANGLE_MIN_SEP = TRIG_N / 6`, i.e. 60°. The module derives that constant rather than
 *   picking it: *"a triangle's three edge-normals stand 120° apart, so two roads enter DIFFERENT
 *   sides of it exactly when their bearings differ by more than 60°."*
 *
 *   ⚠⚠ AND THE BOUNDARY IS NOT AT 60.000°, WHICH IS WHY IT IS WALKED INSTEAD OF ASSERTED.
 *   Bearings arrive as INTEGER trig indices (`bearingIndex` quantises to TRIG_N = 1024 steps),
 *   while the threshold is the NON-INTEGER `1024/6 = 170.667`. `minSep >= 170.667` is therefore
 *   satisfiable only from index **171**, and 171 is **60.117°**. The effective gate is "strictly
 *   more than 60°", and no reading of the source alone produces that number — the sweep does.
 *
 * ═══ ARM B · `bridgehead` — src/domain/townMap/fabric/faubourgOrigin.js ═══
 *   THE LAW: a faubourg building types `bridgehead` when
 *      `deck && dDeck <= knot && dDeck < dGate`,  `knot = max(span,width) × 1.5 + frontage`
 *   — a TWO-CLAUSE predicate, so a control that only proves the first clause proves half a
 *   branch. Both clauses get their own negative control: one building walked out past its knot,
 *   and one building INSIDE the knot with the gate moved NEARER than the deck.
 *
 * ⭐ EVERY FIRING CARRIES A NEGATIVE CONTROL, because a selector that returns `triangular` for
 * everything would pass a positive-only test. Each arm reports both the firing and the refusal.
 *
 * Usage: node i11-branch-liveness.mjs [--wt=<worktree>] [--json=out/i11-branch-liveness.json]
 */
import { writeFileSync } from 'node:fs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const WT = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG4-tree');

const MR = await import(`${WT}/src/domain/townMap/fabric/marketRegister.js`);
const FO = await import(`${WT}/src/domain/townMap/fabric/faubourgOrigin.js`);
const GEO = await import(`${WT}/src/domain/townMap/fabric/fabricGeometry.js`);
const { TRIG_N, cosI, sinI } = GEO;

const deg = (idx) => Math.round((idx * 360 / TRIG_N) * 1000) / 1000;
const idxOfDeg = (d) => Math.round((d / 360) * TRIG_N);

/* ════════════════════ ARM A · the synthetic market void ════════════════════ */

/**
 * A void is a REGULAR 24-GON of radius R about the origin — a real polygon, because
 * `radialProfileOf`/`radiusAt` walk polygon EDGES and a degenerate outline returns radius 0 for
 * every bearing, which produces ZERO mouths silently rather than throwing. (Measured hazard: the
 * failure mode of a lazy synthetic square here is a clean-looking `carved` with no mouths at all.)
 */
const R = 60;
const voidPolygon = (n = 24, r = R) => {
  const p = [];
  for (let i = 0; i < n; i++) { const k = Math.round((i * TRIG_N) / n); p.push([cosI(k) * r, sinI(k) * r]); }
  return p;
};
const SQ = () => ({ key: 'synthetic-green', kind: 'market', center: [0, 0], radius: R, polygon: voidPolygon() });

/**
 * One road per bearing, laid EXACTLY on the trig ray so the mouth's own `bearingIndex` comes back
 * as the index we asked for — the separations are then exact in the units the law compares in.
 * Each road runs from well outside the void to a point INSIDE it, so it makes exactly ONE mouth.
 */
const roadsAt = (bearings, { rank = 'lane', width = 8 } = {}) => bearings.map((k, i) => ({
  line: [[cosI(k) * R * 3.2, sinI(k) * R * 3.2], [cosI(k) * R * 0.30, sinI(k) * R * 0.30]],
  rank, width, key: `road-${i}`,
}));

/** three roads whose SMALLEST pairwise separation is exactly `sepIdx` trig indices */
const threeRoadsWithMinSep = (sepIdx, opts) => {
  const rest = Math.round((TRIG_N - sepIdx) / 2);
  return roadsAt([0, sepIdx, sepIdx + rest], opts);
};

const shapeAtSep = (sepIdx, opts) => {
  const sq = SQ();
  const mouths = MR.mouthsOf(sq, threeRoadsWithMinSep(sepIdx, opts));
  const major = MR.majorMouths(mouths);
  const res = MR.marketShapeFor(mouths);
  return { mouths: mouths.length, major: major.length, ...res };
};

const armA = { law: 'marketShapeFor → triangular', rows: [], sweep: [], boundary: null };

// A1 · THE CANONICAL FIRING — three roads at 120°, the reference's own three-road green.
{
  const sepIdx = Math.round(TRIG_N / 3);
  const lane = shapeAtSep(sepIdx, { rank: 'lane', width: 8 });
  const high = shapeAtSep(sepIdx, { rank: 'high', width: 8 });
  armA.rows.push({ id: 'A1-lane', sepIdx, sepDeg: deg(sepIdx), rank: 'lane', ...lane });
  armA.rows.push({ id: 'A1-high', sepIdx, sepDeg: deg(sepIdx), rank: 'high', ...high });
}
// A2 · THE CHAIR'S OWN BOUNDARY QUESTION — 60° fires, 59° does not.
{
  const at60 = shapeAtSep(idxOfDeg(60), { rank: 'lane', width: 8 });
  const at59 = shapeAtSep(idxOfDeg(59), { rank: 'lane', width: 8 });
  armA.rows.push({ id: 'A2-60deg', sepIdx: idxOfDeg(60), sepDeg: deg(idxOfDeg(60)), rank: 'lane', ...at60 });
  armA.rows.push({ id: 'A2-59deg', sepIdx: idxOfDeg(59), sepDeg: deg(idxOfDeg(59)), rank: 'lane', ...at59 });
}
// A3 · THE SWEEP — walk the threshold and let it name its own boundary index.
{
  let firstFire = null;
  for (let s = 160; s <= 182; s++) {
    const r = shapeAtSep(s, { rank: 'lane', width: 8 });
    armA.sweep.push({ sepIdx: s, sepDeg: deg(s), shape: r.shape, major: r.major, mouths: r.mouths });
    if (r.shape === 'triangular' && firstFire == null) firstFire = s;
  }
  armA.boundary = {
    firstFiringIndex: firstFire, firstFiringDeg: firstFire == null ? null : deg(firstFire),
    declaredConstant: MR.TRIANGLE_MIN_SEP, declaredConstantDeg: deg(MR.TRIANGLE_MIN_SEP),
    trigN: TRIG_N,
    note: 'the shipped constant is TRIG_N/6 = 170.667 and bearings are integers, so the smallest firing separation is 171 = 60.117° — the gate is strictly ABOVE 60°, not at it',
  };
}
// A4 · THE WHOLE ENTRY POINT, not just the selector — the register polygon must come out too.
{
  const sq = SQ();
  const reg = MR.deriveMarketRegister({
    squares: [sq], channels: threeRoadsWithMinSep(Math.round(TRIG_N / 3), { rank: 'high', width: 8 }),
    tier: 'town', seedKey: 'regI1-synthetic', frontage: 5,
    hasWater: false, lawfulness: 0.5, prosperityRank: 2, droveRoad: false, stateBodies: [], organisms: [],
  });
  const v = reg.voids[0];
  armA.entryPoint = {
    shape: v.shape, reason: v.reason, mouths: v.mouths.length, gaps: v.gaps.length,
    registerVertices: v.polygon.length, areaBlob: Math.round(v.areaBlob * 10) / 10,
    areaRegister: Math.round(v.areaRegister * 10) / 10,
    retention: Math.round((v.areaRegister / v.areaBlob) * 1000) / 1000,
    fixtures: v.fixtures.length, band: v.band, coverage: reg.coverage,
  };
}

/* ════════════════════ ARM B · the synthetic faubourg on a deck ════════════════════ */

const FRONTAGE = 5;
const DECK = { key: 'br-synth', kind: 'bridge', x: 300, y: 0, span: 24, width: 9 };
const KNOT = Math.max(DECK.span, DECK.width) * FO.BRIDGE_KNOT_SPANS + FRONTAGE;   // 24*1.5+5 = 41
const GATE_REACH = FO.GATE_REACH_FRONTAGES * FRONTAGE;                            // 40

/** one wall ring with one live gate, built to `gateRoster`'s own expectations */
const wallsWithGate = (gx, gy) => [{ kind: 'main', gates: [{ x: gx, y: gy, bricked: false }] }];
const gateIdFor = (gx, gy) => `0@${Math.round(gx)},${Math.round(gy)}`;

const faubourgRun = (buildings, walls) => FO.deriveFaubourgOrigins({
  walls: walls || [], buildings, leanTos: [], bridges: [DECK], frontage: FRONTAGE, partition: [],
});

const armB = { law: 'deriveFaubourgOrigins → bridgehead', knotUnits: KNOT, gateReachUnits: GATE_REACH, rows: [], sweep: [], boundary: null };

// B1 · THE FIRING — a building sited ON the deck, with a gate far off up the road.
{
  const gx = 900, gy = 0;
  const b = { key: 'fb-1', kind: 'house', x: DECK.x + 4, y: 0, gate: gateIdFor(gx, gy) };
  const r = faubourgRun([b], wallsWithGate(gx, gy));
  const rec = r.buildings['fb-1'];
  armB.rows.push({ id: 'B1-on-the-deck', origin: rec.origin, dDeck: Math.round(rec.dDeck * 100) / 100, dGate: Math.round(rec.dGate * 100) / 100, why: rec.why, byOrigin: r.coverage.byOrigin, districts: r.districts.length, districtOrigin: r.districts[0] ? r.districts[0].origin : null });
}
// B2 · NEGATIVE CONTROL ON CLAUSE ONE (`dDeck <= knot`) — walk it out past its own knot.
{
  const gx = 900, gy = 0;
  const inside = { key: 'fb-in', kind: 'house', x: DECK.x + (KNOT - 0.5), y: 0, gate: gateIdFor(gx, gy) };
  const outside = { key: 'fb-out', kind: 'house', x: DECK.x + (KNOT + 0.5), y: 0, gate: gateIdFor(gx, gy) };
  const r = faubourgRun([inside, outside], wallsWithGate(gx, gy));
  armB.rows.push({ id: 'B2-just-inside-knot', origin: r.buildings['fb-in'].origin, dDeck: Math.round(r.buildings['fb-in'].dDeck * 100) / 100, why: r.buildings['fb-in'].why });
  armB.rows.push({ id: 'B2-just-outside-knot', origin: r.buildings['fb-out'].origin, dDeck: Math.round(r.buildings['fb-out'].dDeck * 100) / 100, why: r.buildings['fb-out'].why });
}
// B3 · NEGATIVE CONTROL ON CLAUSE TWO (`dDeck < dGate`) — inside the knot, but the gate is NEARER.
{
  const gx = DECK.x + 2, gy = 0;                       // gate almost on the deck
  const b = { key: 'fb-g', kind: 'house', x: DECK.x + 3, y: 0, gate: gateIdFor(gx, gy) };
  const r = faubourgRun([b], wallsWithGate(gx, gy));
  const rec = r.buildings['fb-g'];
  armB.rows.push({ id: 'B3-gate-nearer-than-deck', origin: rec.origin, dDeck: Math.round(rec.dDeck * 100) / 100, dGate: Math.round(rec.dGate * 100) / 100, why: rec.why });
}
// B4 · THE SWEEP — walk the building out from the deck and watch the type change hands.
{
  let last = null;
  for (let d = 0; d <= 60; d += 2) {
    const gx = 900, gy = 0;
    const b = { key: 'fb-s', kind: 'house', x: DECK.x + d, y: 0, gate: gateIdFor(gx, gy) };
    const rec = faubourgRun([b], wallsWithGate(gx, gy)).buildings['fb-s'];
    armB.sweep.push({ dDeck: d, origin: rec.origin });
    if (last && last.origin === 'bridgehead' && rec.origin !== 'bridgehead') armB.boundary = { lastBridgeheadAt: last.dDeck, firstNonBridgeheadAt: d, declaredKnot: KNOT };
    last = { dDeck: d, origin: rec.origin };
  }
}

/* ════════════════════════════ THE REPORT ════════════════════════════ */

process.stdout.write(`── i11 · BRANCH LIVENESS FOR THE TWO UNFIRED REG-4 BRANCHES  (worktree ${WT})\n\n`);
process.stdout.write(`── ARM A · marketRegister.marketShapeFor → 'triangular'   (TRIG_N=${TRIG_N}, TRIANGLE_MIN_SEP=${MR.TRIANGLE_MIN_SEP} = ${deg(MR.TRIANGLE_MIN_SEP)}°, MAJOR_SHARE=${MR.MAJOR_SHARE})\n`);
for (const r of armA.rows) process.stdout.write(`   ${r.id.padEnd(24)} sep=${String(r.sepIdx).padStart(4)} (${String(r.sepDeg).padStart(7)}°) rank=${r.rank.padEnd(5)} mouths=${r.mouths} major=${r.major}  →  ${r.shape.toUpperCase()}\n        ${r.reason}\n`);
process.stdout.write(`\n   SWEEP (sepIdx : shape)  `);
process.stdout.write(armA.sweep.map((s) => `${s.sepIdx}:${s.shape[0]}`).join(' ') + '\n');
process.stdout.write(`   FIRST FIRING SEPARATION: index ${armA.boundary.firstFiringIndex} = ${armA.boundary.firstFiringDeg}°   (declared constant ${armA.boundary.declaredConstant} = ${armA.boundary.declaredConstantDeg}°)\n`);
process.stdout.write(`\n   ENTRY POINT (deriveMarketRegister, whole path): shape=${armA.entryPoint.shape} mouths=${armA.entryPoint.mouths} gaps=${armA.entryPoint.gaps} registerVerts=${armA.entryPoint.registerVertices} retention=${armA.entryPoint.retention} fixtures=${armA.entryPoint.fixtures} band=${JSON.stringify(armA.entryPoint.band)}\n     ${armA.entryPoint.reason}\n`);

process.stdout.write(`\n── ARM B · faubourgOrigin.deriveFaubourgOrigins → 'bridgehead'   (knot=${KNOT} u, gateReach=${GATE_REACH} u, frontage=${FRONTAGE})\n`);
for (const r of armB.rows) process.stdout.write(`   ${r.id.padEnd(26)} → ${String(r.origin).toUpperCase().padEnd(11)} dDeck=${r.dDeck} dGate=${r.dGate == null ? '—' : r.dGate}\n        ${r.why}\n`);
process.stdout.write(`\n   SWEEP (dDeck : origin)  ` + armB.sweep.map((s) => `${s.dDeck}:${s.origin[0]}`).join(' ') + '\n');
process.stdout.write(`   BOUNDARY: last bridgehead at dDeck=${armB.boundary && armB.boundary.lastBridgeheadAt}, first non-bridgehead at dDeck=${armB.boundary && armB.boundary.firstNonBridgeheadAt} (declared knot ${KNOT})\n`);

const g = (id) => armA.rows.find((r) => r.id === id);
const h = (id) => armB.rows.find((r) => r.id === id);
const live = [
  ['A · three major roads 120° apart select TRIANGULAR through the real selector', g('A1-lane').shape === 'triangular' && g('A1-high').shape === 'triangular'],
  ['A · at 60° the branch FIRES', g('A2-60deg').shape === 'triangular'],
  ['A · at 59° the branch does NOT fire (the gate is real, not decorative)', g('A2-59deg').shape !== 'triangular'],
  ['A · the sweep names a single crossing index and it is 171 (= 60.117°)', armA.boundary.firstFiringIndex === 171],
  ['A · below the boundary the fallthrough is CARVED, never a crash or a null', armA.sweep.filter((s) => s.sepIdx < 171).every((s) => s.shape === 'carved')],
  ['A · every swept case still finds exactly 3 mouths and 3 major (the sweep moves ONE thing)', armA.sweep.every((s) => s.mouths === 3 && s.major === 3)],
  ['A · the WHOLE entry point (not just the selector) yields a triangular register with an entry gap per mouth', armA.entryPoint.shape === 'triangular' && armA.entryPoint.gaps === armA.entryPoint.mouths],
  ['A · the register is INSCRIBED — its area does not exceed the reserved blob', armA.entryPoint.retention <= 1],
  ['B · a building sited on a bridge deck types BRIDGEHEAD through the real path', h('B1-on-the-deck').origin === 'bridgehead'],
  ['B · clause one is real: just inside the knot fires, just outside does not', h('B2-just-inside-knot').origin === 'bridgehead' && h('B2-just-outside-knot').origin !== 'bridgehead'],
  ['B · clause two is real: inside the knot but with the gate NEARER, the type is not bridgehead', h('B3-gate-nearer-than-deck').origin !== 'bridgehead'],
  ['B · the sweep crosses exactly at the declared knot', !!armB.boundary && armB.boundary.lastBridgeheadAt < KNOT && armB.boundary.firstNonBridgeheadAt > KNOT],
  ['B · the bridgehead building also raises a bridgehead DISTRICT (the drawn consequence)', h('B1-on-the-deck').districtOrigin === 'bridgehead'],
];
process.stdout.write('\n── LIVENESS\n');
for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
const json = arg('json', `${HERE}/out/i11-branch-liveness.json`);
writeFileSync(json, JSON.stringify({ worktree: WT, armA, armB, liveness: live }, null, 2));
process.stdout.write(`\nI11_${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}  json=${json}\n`);
