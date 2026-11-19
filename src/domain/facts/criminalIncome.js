/**
 * domain/facts/criminalIncome.js — THE CRIMINAL-INCOME HOME (BAR4-CORPUS-DEF, row C24893, left by BAR3-CORPUS-3; BRIEF-BAR4
 * amendment 5b: a new atom beside its family, vetoable by the owner, on the veto list as new vocabulary). ONE atom, the
 * record's fact: the town's income list carries a criminal revenue (`economicState.incomeSources[].source`: "Black Market
 * Revenue", "Smuggling Network Revenue", "Criminal Syndicate Revenue", the income writer's own labels). The criminal
 * structure's key (`criminalStructureKey.js`) reads the roster, the powers, the safety profile's operations and the
 * running criminal chains, and not the income list, so a town can read no structure and still earn from a black market:
 * "X's books record no gang, guild or racket" printed beside black-market income (4 of the 64 census towns that print it,
 * BAR3-CORPUS-3's measure). The line's GATE reads this home; its words stand.
 *
 *   criminalIncomeOf(record)   THE ONE READER: true where an income row carries the writer's own flag, `isCriminal: true`
 *                              (`economicState.js` sets it on every criminal revenue it writes; the world treasury's
 *                              `isCriminalIncome` reads the same flag), never a test of the label's words; or where a
 *                              service the record offers is a criminal house's (`availableServices[].institution`, "Sell
 *                              stolen goods" at a "Local fence"), read by the estate's ONE criminal detector
 *                              (`corruption.js :: isCriminalInstitution`). THE CHAIR, 08:12 UTC: the structure's key reads
 *                              neither today; BAR4-SAFETY widens the key on its own branch, and the gate's two readings
 *                              (this atom and `no organised crime`) become one at the join.
 *
 * Layer 2 (over the economy). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/bar4CorpusDefKinds.test.js
 */
import { isCriminalInstitution } from '../corruption.js';

/**
 * Does the town's income list carry a criminal revenue, or a criminal house offer a service?
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function criminalIncomeOf(record) {
  const r = /** @type {{ economicState?: { incomeSources?: unknown } | null, availableServices?: unknown } | null} */ (record);
  const sources = r?.economicState?.incomeSources;
  if (Array.isArray(sources) && sources.some((i) => !!i && typeof i === 'object' && /** @type {{ isCriminal?: unknown }} */ (i).isCriminal === true)) return true;
  const svc = r?.availableServices;
  const rows = Array.isArray(svc) ? svc : svc && typeof svc === 'object' ? Object.values(svc).flat() : [];
  return rows.some((x) => !!x && typeof x === 'object' && typeof /** @type {{ institution?: unknown }} */ (x).institution === 'string'
    && isCriminalInstitution({ name: /** @type {{ institution: string }} */ (x).institution }));
}
