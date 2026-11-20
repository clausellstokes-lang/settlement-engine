// LASTCLOSE-DOORS (2026-11-18): pool dominance's three pools of the last small round banked BY THEIR OWN ROWS, through the
// door's own function `bankNew` (the higher of the two corpora's readings, its own rounding and reason), narrowed to the three
// named pools: the base's three unregistered pools are NOT banked (BRIEF-LASTCLOSE.md: "NOT `--bank-new`"). REFUSES unless the
// unregistered pools are exactly the six read at the base. Run from the tree root.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
const P = await import(join(process.cwd(), 'scripts/census/pool-dominance.mjs'));
const MINE = ['ledger:goalFamilies:SUPPLY.want.short', 'ledger:goalFamilies:SUPPLY.want.long', 'ledger:settlementOriginProse:ORIGIN_DECLARED'];
const BASE3 = ['ledger:institutionDescVariants:DESC_VARIANT_SIBLINGS', 'ledger:safetyProfile:STANDARD_PATROL', 'ledger:trade-list:imports'];
const register = P.readRegister();
const table = P.measureDominance({ seedPrefix: P.DEFAULT_SEED_PREFIX });
const second = P.measureDominance({ seedPrefix: P.CONFIRM_SEED_PREFIX });
const { next, banked } = P.bankNew(table, second, register);
if (banked.slice().sort().join() !== [...MINE, ...BASE3].sort().join()) { console.error(`REFUSED: unregistered ${banked.join(', ')}`); process.exit(3); }
const pools = { ...register.pools };
for (const p of MINE) pools[p] = { ...next.pools[p], reason: `${next.pools[p].reason}; banked BY ITS OWN ROW at the last close (LASTCLOSE-DOORS, 2026-11-18; BRIEF-LASTCLOSE.md: the last small round's pool, ${p.includes('SUPPLY') ? 'LAST-VARIETY point 70' : 'LAST-DECLARE point 69'}), not by --bank-new` };
// the census header re-taken as every door does (bankNew's own header)
writeFileSync(P.REGISTER_PATH, `${JSON.stringify({ ...register, census: next.census, pools }, null, 2)}\n`);
for (const p of MINE) console.log(`banked: ${p} ${JSON.stringify(pools[p])}`);
for (const p of BASE3) console.log(`LEFT for the chair: ${p} ${JSON.stringify(next.pools[p])}`);
