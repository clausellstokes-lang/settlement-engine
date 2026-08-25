/** pickCrops.mjs <leaf> — print crop boxes for the judging round: a land wall stretch with a
 *  gate, a water/terminus stretch, and a joint-dense corner. Chosen by a STATED RULE. */
import { CORPUS, buildOne } from '../instruments/leaf.mjs';
// ⭐ ODQ §634.3 — the crop-box helper and the rule-first discipline now live in the kit.
import { box } from '../instruments/crops.mjs';
const leaf = process.argv[2] || 'city';
const spec = CORPUS.find((s) => s.key === leaf);
const { fabric } = buildOne(spec, { rampart: true });
const ring = fabric.walls[0];
const R = ring.rampart;
// RULE 1 — the LAND wall crop: centred on the gatehouse whose run is NOT a water termination,
// at 150 units (about two curtain bays at city scale).
const landGate = R.gatehouses[0];
console.log(`LAND ${box(landGate.x, landGate.y, 150)}`);
// RULE 2 — the TERMINUS crop: centred on the class-1 joint furthest from the ring centroid,
// or, where the circuit has none, on the water gate.
const t1 = R.joints.filter((j) => j.cls === 1);
const wg = (ring.waterGates || [])[0];
const term = t1.length ? t1[0] : (wg ? { x: wg.x, y: wg.y } : R.joints[0]);
console.log(`TERM ${box(term.x, term.y, 150)} src=${t1.length ? 'class-1 joint' : wg ? 'water gate' : 'fallback'}`);
// RULE 3 — the CORNER crop: the joint with the largest radius that is not a gatehouse.
const corner = R.joints.slice().sort((a, b) => b.r - a.r)[0];
console.log(`CORNER ${box(corner.x, corner.y, 110)} kind=${corner.kind}`);
console.log(`RINGS=${fabric.walls.length} joints=${R.joints.length} gh=${R.gatehouses.length} rung=${R.rung} regime=${R.regime}`);
