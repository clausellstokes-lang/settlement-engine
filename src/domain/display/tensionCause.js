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
 * THE DECLARED DRAW (addendum 3, item 1: the chair's ruling of 16:30). Every wording declares the atoms its cause's
 * predicate implies (`needs`, `excludes`, `crisis` on its row in the data file), and the wording is drawn through the one
 * door (`facts/drawDeclared.js :: drawDeclared`), the keyed hash as its `draw`: an admitted line is the hash's own pick,
 * byte for byte; a refused one resolves as the door resolves it, and a cause with no admitted line falls to plain.
 *
 * `{power}` (rule 6; addendum 3, item 4; addendum 4): a cause carrying `power` holds only where the ONE helper beside the
 * sides table (`data/tensionSidePower.js :: solePowerNameOf`) names that power, and its slot takes the name as a sentence
 * takes it; never a second fill. outside_debt's `merchants_rule` carries 'ruler': the governing power (the chair's 17:32);
 * every other kind would keep the exactly-one test.
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/display/tensionCause.test.js
 */
import { pickVariant } from '../../kernel/proseHash.js';
import { factsOf } from '../facts/factsOf.js';
import { drawDeclared } from '../facts/drawDeclared.js';
import { TENSION_CAUSES } from '../../data/tensionCauses.js';
import { solePowerNameOf } from '../../data/tensionSidePower.js';
import { TENSION_CAUSE_HOLDS } from './tensionCauseHolds.js';

/** The power's slot. */
export const POWER_SLOT = '{power}';

/** @typedef {import('../../data/tensionCauses.js').TensionCause} TensionCause */
/** @typedef {import('../../data/tensionCauses.js').CauseLine} CauseLine */

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
  const town = townKeyOf(record);
  // the town's identity (its name) and the kind: the wording's key, and the door's tie-break key
  const identity = `${town}::cause::${kind}`;
  const poolId = `tensionCauses.${kind}`;
  /** the keyed hash, the door's draw @param {ReadonlyArray<Readonly<CauseLine>>} p */
  const pick = (p) => pickVariant(p, identity);
  // addendum 2 (the chair's 15:35): the guild quarrel where the guild's home answers no takes its one sentence, before the ranks
  if (table.withoutItsHouse && facts.guild === false) {
    const alone = [table.withoutItsHouse];
    return drawDeclared(alone, { facts, draw: pick, key: identity, poolId }).text ?? null;
  }
  const holding = (/** @type {1 | 2} */ rank) => table.causes.filter((c) => c.rank === rank
    && TENSION_CAUSE_HOLDS[c.holds](/** @type {import('./tensionCauseHolds.js').CauseRecord} */ (record), facts)
    && (!c.power || solePowerNameOf(record, c.power) !== null));
  const first = holding(1);
  const tier = first.length ? first : holding(2);
  const cause = tier.length ? pickVariant(tier, `${town}::held::${kind}`) : undefined;
  const line = (cause ? drawDeclared(cause.wordings, { facts, draw: pick, key: identity, poolId }).text : null)
    ?? drawDeclared(table.plain, { facts, draw: pick, key: identity, poolId }).text;
  if (!line) return null;
  if (!cause?.power || !line.includes(POWER_SLOT)) return line;
  const power = cause.power;
  return line.split(POWER_SLOT).map((part, i) => (i === 0 ? part : `${solePowerNameOf(record, power, i === 1 && line.startsWith(POWER_SLOT))}${part}`)).join('');
}
