#!/usr/bin/env node
/**
 * scripts/stable-pick-ids-door.mjs — THE DOOR of the id guard of point 120 (`tests/lint/stablePickIds.shared.mjs`).
 *
 *   node scripts/stable-pick-ids-door.mjs           read the tree; print whether the baseline matches it; exit 0 only
 *                                                   when it does (1 when `--write` would change it, 2 when it refuses)
 *   node scripts/stable-pick-ids-door.mjs --write   change `tests/lint/stablePickIds.baseline.json`, and ONLY by:
 *                                                   adding a new id; moving a vanished id to `retired`; re-banking a
 *                                                   re-wording in place (printed `re-worded: <id>`)
 *
 * It never renumbers, never frees a retired id, and never makes a baseline. IT REFUSES (exit 2, nothing written) when:
 * the baseline file is absent or not JSON ("restore it from git; the baseline is never re-made"); a scope's `present`
 * AND `retired` are both empty where the tree holds ids (an emptied skeleton), or the baseline banks no id at all
 * ("restore the baseline from git; it is never refilled"); a wholly retired scope takes new ids as any scope does;
 * a banked fingerprint is found under a DIFFERENT present id (an id moved between lines: a shifted insertion, a swap);
 * a retired id is in the tree again; an id is written twice in its scope; the baseline is malformed; the reader cannot
 * read the tree. A move is matched against PRESENT ids only: a sentence whose id is retired may come back under a NEW
 * id (the door adds it), never under its retired id. A line moved AND re-worded at once is not seen as a move: it reads
 * as a re-wording or an addition, and is banked; the reviewer of the baseline's diff is the control.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASELINE_REL, ROOT, baselineText, doorPlan, findings, readBaseline, readTree } from '../tests/lint/stablePickIds.shared.mjs';

const write = process.argv.includes('--write');
const tree = await readTree(ROOT);
/** @type {import('../tests/lint/stablePickIds.shared.mjs').Baseline | null} */ let baseline;
try {
  baseline = readBaseline(ROOT);
} catch (e) {
  console.log(`REFUSED  ${/** @type {Error} */ (e).message}`);
  console.log('stable-pick-ids door: REFUSED (1); nothing written.');
  process.exit(2);
}
const plan = doorPlan(tree, baseline);

if (plan.refusals.length) {
  for (const r of plan.refusals) console.log(`REFUSED  ${r}`);
  console.log(`stable-pick-ids door: REFUSED (${plan.refusals.length}); nothing written.`);
  process.exit(2);
}
for (const a of plan.added) console.log(`added: ${a}`);
for (const r of plan.retired) console.log(`retired: ${r}`);
for (const w of plan.reworded) console.log(`re-worded: ${w}`);
const changes = plan.added.length + plan.retired.length + plan.reworded.length;
const ids = [...tree.scopes.values()].reduce((n, l) => n + l.length, 0);
if (changes === 0 && baseline && findings(tree, baseline).length === 0) {
  console.log(`stable-pick-ids door: the baseline matches the tree (${tree.scopes.size} scopes, ${ids} ids).`);
  process.exit(0);
}
console.log(`stable-pick-ids door: +${plan.added.length} added | ${plan.retired.length} retired | ${plan.reworded.length} re-worded`);
if (!write) {
  console.log('the baseline does NOT match the tree: run with --write to bank these.');
  process.exit(1);
}
writeFileSync(join(ROOT, BASELINE_REL), baselineText(/** @type {import('../tests/lint/stablePickIds.shared.mjs').Baseline} */ (plan.next)));
console.log(`written: ${BASELINE_REL}`);
