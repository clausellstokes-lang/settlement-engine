// LASTCLOSE-DOORS follow-up (the chair's ruling of 2026-11-19 on the hand-back's §3 (1)): the base's three unregistered pools
// banked each BY ITS OWN ROW through the door's own `bankNew`, narrowed to exactly these three (never --bank-new at large),
// each row carrying the door's figures and the chair's reason. REFUSES unless the unregistered pools are exactly these three.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
const P = await import(join(process.cwd(), 'scripts/census/pool-dominance.mjs'));
const REASONS = {
  'ledger:institutionDescVariants:DESC_VARIANT_SIBLINGS': 'two-line sibling pool; the second line\'s declaration refuses it in most towns (a true line passed over, LR3), so one line prints 99%; no draw prints false; on the post-deploy variety list (the chair, last close)',
  'ledger:safetyProfile:STANDARD_PATROL': 'K-WATCH-2\'s pool, points 48/49/57, named at its landing; top1 0.30, not lopsided; registered at the last close',
  'ledger:trade-list:imports': 'point 68\'s imports list (FR24); 15 lines, top1 0.13, not lopsided; registered at the last close',
};
const register = P.readRegister();
const { next, banked } = P.bankNew(P.measureDominance({ seedPrefix: P.DEFAULT_SEED_PREFIX }), P.measureDominance({ seedPrefix: P.CONFIRM_SEED_PREFIX }), register);
if (banked.slice().sort().join() !== Object.keys(REASONS).sort().join()) { console.error(`REFUSED: unregistered ${banked.join(', ')}`); process.exit(3); }
const pools = { ...register.pools };
for (const p of Object.keys(REASONS)) pools[p] = { ...next.pools[p], reason: `banked BY ITS OWN ROW at the last close (LASTCLOSE-DOORS, 2026-11-19, the chair's ruling on its hand-back's §3 (1)), through the door's own bankNew narrowed to this pool (at the higher of the two corpora's readings), NOT --bank-new: ${REASONS[p]}` };
writeFileSync(P.REGISTER_PATH, `${JSON.stringify({ ...register, census: next.census, pools }, null, 2)}\n`);
for (const p of Object.keys(REASONS)) console.log(`banked: ${p} ${JSON.stringify({ ...pools[p], reason: undefined })}`);
