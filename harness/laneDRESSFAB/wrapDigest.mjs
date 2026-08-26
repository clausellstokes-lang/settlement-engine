/**
 * ⭐⭐ SPINE-3's WRAP DIGEST, MOVED INSIDE THE SEAL — §699.9's banked lesson executed.
 *
 * §699.9: *"the sole instrument discharging §699.1 lives loose in the lane's scratchpad, not under
 * `harness/` and not among the six new files in the sealed tree. A successor standing at the
 * preserve ref cannot reproduce the boundary proof from the seal."* It is the same file,
 * byte-for-byte in behaviour, with three import paths re-rooted; DRESS-FABRIC copies it in so the
 * boundary proof travels with the tree that has to satisfy it.
 *
 * A digest of every wrap's geometry — the proof that NO partition byte moved.
 */
import { createHash } from 'node:crypto';
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';
const h = createHash('sha256');
let wraps = 0; let verts = 0;
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const P = buildSettledPartition(partitionInputs(settlement, model, fabric));
  h.update(`${spec.key}|faces:${P.arrangement.faces.length}|edges:${P.arrangement.edges.length}|`);
  for (const w of P.wraps) {
    wraps++;
    verts += w.outer.length + w.inner.length;
    h.update(`E${w.index}|y${w.year}|${w.provenance}|r${w.frozenRadius}|b${w.bandWidth}|`);
    for (const p of w.outer) h.update(`${p[0]},${p[1]};`);
    for (const p of w.inner) h.update(`${p[0]},${p[1]};`);
    h.update(`g${(w.gates || []).join('.')}|wg${(w.waterGates || []).join('.')}|bf${(w.bandFaces || []).join('.')}|`);
  }
}
console.log(`WRAP_DIGEST wraps=${wraps} ringVerts=${verts} sha256=${h.digest('hex')}`);
