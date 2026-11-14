/**
 * domain/display/magicProvisionShown.js — THE PROVISION A PAGE CLAIMS IS OF A TRADITION THE TOWN HOLDS (W2-C-LEAVES-5
 * item 5, 2026-11-14; the round-three cut's #1153: "Blessed stores; divine provision fills the gap" and "40% recovery" on
 * a metropolis whose defence holds no divine tradition and whose Magic tab says "Economic role: absent").
 *
 * RULED (record 387): one home for "the town has clergy with powers", the defence's tradition facts (`facts/magic.js`:
 * `defenceHoldsDivine`, `defenceHoldsDruidic`, a separate tradition, and `defenceHoldsArcane`). Where the town does not
 * hold a tradition, no provision of that tradition is claimed in words: a chain card's magic note of it leaves, and the
 * food row and sentence name no kind of provision. The figures stand as the record's; the record is not touched (the
 * disagreement is named in the lane's hand-back with its count). A tradition with no home of its own (alchemy) is not
 * denied here.
 *
 * Pure: no randomness, no clock, no write.
 */
import { defenceHoldsArcane, defenceHoldsDivine, defenceHoldsDruidic } from '../facts/magic.js';
import { MAGIC_NOTE_TRADITION } from '../facts/magicSource.js';

/**
 * Whether the town holds the tradition a provision is of.
 * @param {unknown} record the settlement record
 * @param {unknown} tradition 'divine' | 'druid' | 'arcane' | 'alchemy' (`facts/magicSource.js :: MagicTradition`)
 * @returns {boolean}
 */
export function magicTraditionHolds(record, tradition) {
  return tradition === 'divine' ? defenceHoldsDivine(record)
    : tradition === 'druid' ? defenceHoldsDruidic(record)
      : tradition === 'arcane' ? defenceHoldsArcane(record)
        : true;
}

/**
 * The magic note a chain card prints: the record's note (`chain.magicNote`, written only by
 * `generators/chainMagicSubstitution.js`) where the town holds the tradition that wrote it (`MAGIC_NOTE_TRADITION`),
 * else '' (the card claims nothing).
 * @param {{ magicNote?: unknown } | null | undefined} chain
 * @param {unknown} record the settlement record
 * @returns {unknown} the note as the card prints it
 */
export function magicNoteShown(chain, record) {
  const note = chain?.magicNote;
  if (typeof note !== 'string' || !note) return note;
  return magicTraditionHolds(record, MAGIC_NOTE_TRADITION[note]) ? note : '';
}
