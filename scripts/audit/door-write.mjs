#!/usr/bin/env node
/**
 * scripts/audit/door-write.mjs — HAND PRODUCED BYTES TO THE SIGNED DOOR, FOR A SURFACE WITH NO CAPTURE ARM OF ITS OWN.
 *
 * WHAT IT IS. Three registered surfaces have no capture arm that calls `recordGolden`: the espionage fence's in-file
 * corpus constant (the bytes are the fence FILE, produced by `scripts/audit/refence.mjs --produce`), the PDF golden
 * view-model snapshot (the register's note: "the writer is vitest itself ... the door cannot refuse it"), and the
 * preset lighting witness ("no capture arm exists"; produced by `scripts/audit/witness-stage.mjs`). Every window so far
 * wrote them through a scratch tool that died with its seat (the DOORS seats' fence-door.mjs, pdf-door.mjs and
 * witness-door.mjs). This is the one door-write for all three, on the tree.
 *
 * WHAT IT DOES. Reads the bytes from --from (a scratch file), names the surface's register path, and calls
 * tests/helpers/goldenRecordDoor.js :: recordGolden — so every refusal applies (no signature, a record that does not
 * name the surface, a dirty tree beyond the fixture/register/record, a prediction miss) and a successful write throws
 * by design. It adds no authority: the record is the authority.
 *
 * THE PDF SNAPSHOT'S BYTES, honestly sourced: run `npx vitest run tests/pdf/goldenViewModel.test.js --update` (vitest 4: a leading `-u` swallows the path as its value and runs every file) in a SCRATCH
 * stage, copy the snapshot it writes to a scratch path, restore the stage (`git checkout -- <snap>`), then hand the
 * copy here. The bytes are the matcher's own; the plain run after the write is the proof.
 *
 *   GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json \
 *     node scripts/audit/door-write.mjs --surface <register identity> --from <scratch bytes>
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { recordGolden, REGISTER_REL } from '../../tests/helpers/goldenRecordDoor.js';

const NO_CAPTURE_ARM = new Set([
  'espionage-dormancy-fence',
  'pdf-golden-view-model-snapshot',
  'preset-lighting-witness',
]);

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i === -1 ? null : args[i + 1]; };
const surface = flag('--surface');
const from = flag('--from');
if (!surface || !from) {
  console.error('usage: GOLDEN_SHIFT_SIGNED=<record> node scripts/audit/door-write.mjs --surface <id> --from <bytes>');
  process.exit(2);
}
if (!NO_CAPTURE_ARM.has(surface)) {
  console.error(`refused: '${surface}' has its own capture arm; write it through that arm, not here`);
  process.exit(2);
}
const root = process.cwd();
const register = JSON.parse(readFileSync(join(root, REGISTER_REL), 'utf8'));
const row = register.surfaces.find((s) => s.surface === surface);
if (!row) { console.error(`refused: no register row '${surface}'`); process.exit(2); }
const bytes = readFileSync(from, 'utf8');
try {
  recordGolden({ surface, path: join(root, row.path), produce: () => bytes, root });
} catch (error) {
  console.log(error.message);
  process.exit(/RE-RECORDED through the signed door/.test(error.message) ? 3 : 1);
}
