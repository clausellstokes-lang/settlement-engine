/**
 * domain/display/tensionCause.js — WHY THE TROUBLE IS HERE, IN ONE SENTENCE (PAGE-7, the brief CAUSES-DATA at 9e4ba24b6;
 * the chair's shape of 15:10, rules 3, 4 and 6). The display seat only calls it; nothing here writes the record.
 *
 *   tensionCauseSentenceOf(record, tension)   the sentence for one live tension of the document in hand, or null where
 *                                             the tension's kind has no table in `data/tensionCauses.js`.
 *
 * THE PICK, WHOLE, AS MEASURED (`measures/page-5/sim.mjs`): the rank-1 causes whose predicate holds
 * (`tensionCauseHolds.js`), one picked by keyed hash (`kernel/proseHash.js :: pickVariant`); only if none holds, the same
 * among rank 2; else the kind's plain wordings. Then the wording, by keyed hash.
 * BEFORE THE RANKS (the chair's ruling of 15:35, addendum 2): a table that carries `withoutItsHouse` (guild_conflict) prints
 * that one sentence where the guild's home (`facts/guild.js :: guildOf`, factsOf's `guild`) answers no on the document in
 * hand; no cause and no plain line is used there.
 *
 * ⛔ THE KEY IS THE TOWN'S NAME AND THE TROUBLE'S KIND, NEVER THE SEED (a security rule, the brief's rule 4). A shared or
 * served document does not carry the seed: `_seed` and `_config` are secret on every shared projection
 * (`display/publicSafe.js`, SEED POSTURE 099/121, and its full-mode strip), so a pick keyed on it would print one sentence
 * to the DM and another to the player for the same document. The keys are `<name>::held::<kind>` (the cause) and
 * `<name>::cause::<kind>` (the wording); the same document with its seed deleted prints the same sentences.
 *
 * `{power}` (rule 6): filled only by the sides table's own fill (`data/tensionSideMeanings.js`, rule 0: the governing
 * power's name for 'ruler'), never a second fill here. THAT FILL IS NOT BUILT at 9e4ba24b6: the table carries `named` and
 * no module reads it. Until the display seat builds it and this module calls it, a cause whose wordings hold `{power}`
 * DOES NOT HOLD (its test cannot pass), so no slot is ever printed raw.
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/display/tensionCause.test.js
 */
import { pickVariant } from '../../kernel/proseHash.js';
import { factsOf } from '../facts/factsOf.js';
import { TENSION_CAUSES } from '../../data/tensionCauses.js';
import { TENSION_CAUSE_HOLDS } from './tensionCauseHolds.js';

/** The power's slot. */
export const POWER_SLOT = '{power}';

/** @typedef {import('../../data/tensionCauses.js').TensionCause} TensionCause */

/**
 * The sides table's fill of `{power}` for this cause in this document: NOT BUILT (see the header), so none.
 * @param {unknown} record @param {Readonly<TensionCause>} cause @returns {string | null}
 */
// eslint-disable-next-line no-unused-vars
const powerFillOf = (record, cause) => null;

/** The cause's wordings hold the power's slot. @param {Readonly<TensionCause>} cause */
const needsPower = (cause) => cause.wordings.some((w) => w.includes(POWER_SLOT));

/**
 * The town's own key: its name, which every document the town is shown in carries.
 * @param {unknown} record @returns {string}
 */
const townKeyOf = (record) => {
  const name = /** @type {{ name?: unknown } | null | undefined} */ (record)?.name;
  return typeof name === 'string' ? name : '';
};

/**
 * THE ONE READER.
 * @param {unknown} record the document in hand (the DM's record, or the shared document)
 * @param {{ type?: unknown } | null | undefined} tension one of `history.currentTensions`
 * @returns {string | null}
 */
export function tensionCauseSentenceOf(record, tension) {
  const kind = typeof tension?.type === 'string' ? tension.type : '';
  const table = Object.hasOwn(TENSION_CAUSES, kind) ? TENSION_CAUSES[kind] : null;
  if (!table) return null;
  const facts = factsOf(/** @type {{}} */ (record));
  // addendum 2 (the chair's 15:35): the guild quarrel where the guild's home answers no takes its one sentence, before the ranks
  if (typeof table.withoutItsHouse === 'string' && facts.guild === false) return table.withoutItsHouse;
  const holding = (/** @type {1 | 2} */ rank) => table.causes.filter((c) => c.rank === rank
    && TENSION_CAUSE_HOLDS[c.holds](/** @type {import('./tensionCauseHolds.js').CauseRecord} */ (record), facts)
    && (!needsPower(c) || powerFillOf(record, c) !== null));
  const first = holding(1);
  const tier = first.length ? first : holding(2);
  const town = townKeyOf(record);
  const cause = tier.length ? pickVariant(tier, `${town}::held::${kind}`) : undefined;
  const wording = /** @type {string} */ (pickVariant(cause ? cause.wordings : table.plain, `${town}::cause::${kind}`));
  if (!cause || !needsPower(cause)) return wording;
  return wording.split(POWER_SLOT).join(/** @type {string} */ (powerFillOf(record, cause)));
}
