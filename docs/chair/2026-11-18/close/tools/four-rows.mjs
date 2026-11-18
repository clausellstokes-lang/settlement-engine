// four-rows.mjs — the chair's own write of the four presumed-things rows, by the owner's words "record the four"
// (2026-11-18 04:41:48 UTC, in the chair's session). Run from the tree root: node <this file> [--write]
// Without --write it prints what it would do and writes nothing. It uses the register's own functions (scanTree, hitKey,
// bankedKeys, bankRow, literalHash) so a row has the door's own form; it refuses unless the fresh hits are EXACTLY the four.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const shared = await import(pathToFileURL(join(ROOT, 'tests/lint/presumedThings.shared.mjs')).href);
const { WIDENED_REGISTER_REL, REGISTER_REL, bankRow, bankedKeys, hitKey, scanTree, literalHash } = shared;
const REASON = 'after-base: owner-2026-11-18';
const REASON_TEXT = 'a line written after the instrument\'s base (BAR5-MARKS\'s three siege twins of institutionDescVariants.js; BAR5-SAFETY\'s court-and-prison twin of guardLineUnderTheLaw.js) that the chair read TRUE WHERE IT PRINTS by a guarantee this walker does not read (the twin\'s own `crisis: under_siege`: a besieged town has defenders; the hired company\'s own trade, "garrison work" and "garrison duty", in its original\'s words; a twin only of lines drawn under `inst.hasCourtSystem && courthouse && inst.hasPrison`, safetyProfile.js:369-370, the constant has no other reader), and that a seat\'s own permission check twice refused to bank on the chair\'s ruling CL23; RECORDED BY THE OWNER\'S OWN WORDS in the chair\'s session, 2026-11-18 04:41:48 UTC, verbatim: "record the four"; banked BY HAND by the chair, against the letter of the door\'s base rule, as record 405\'s seven and the tail close\'s PT1 rows; owed after the release: each line declares through a door what guarantees it, and the row leaves';
const WANT = new Map([
  ['c57566e5bfaaf1a1', 'armedForce'],
  ['743cc96b12b6c45b', 'garrison'],
  ['b50dee27dd04b260', 'garrison'],
  ['85fc61848472a7ad', 'prison'],
]);
const reg = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));
const main = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
const hits = scanTree(ROOT);
const banked = new Set([...bankedKeys(main), ...bankedKeys(reg)]);
const fresh = hits.filter((h) => !banked.has(hitKey(h.file, h.thing, h.text)));
console.log(`hits ${hits.length} · fresh ${fresh.length}`);
for (const h of fresh) console.log(`  FRESH ${h.file} · ${h.thing} · ${literalHash(h.text)} · ${JSON.stringify(h.text.slice(0, 90))}`);
const mine = fresh.filter((h) => WANT.get(literalHash(h.text)) === h.thing);
const others = fresh.filter((h) => !mine.includes(h));
console.log(`the four among the fresh: ${mine.length} · other fresh hits: ${others.length}`);
if (!process.argv.includes('--write')) { console.log('dry run: nothing written'); process.exit(0); }
if (mine.length !== 4 || others.length !== 0) { console.error('REFUSED: the fresh hits are not exactly the four'); process.exit(1); }
reg.reasons[REASON] = REASON_TEXT;
for (const h of mine) (reg.arm1[h.file] ||= []).push(bankRow(h, REASON)); // the door's own line (scripts/presumed-things-door.mjs:145)
const arm1 = {};
for (const f of Object.keys(reg.arm1).sort()) if (reg.arm1[f].length) arm1[f] = reg.arm1[f];
reg.arm1 = arm1;
writeFileSync(join(ROOT, WIDENED_REGISTER_REL), `${JSON.stringify(reg, null, 1)}\n`);
console.log('WRITTEN: four rows under', REASON);
