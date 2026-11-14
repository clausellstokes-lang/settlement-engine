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
  if (!magicTraditionHolds(record, MAGIC_NOTE_TRADITION[note])) return '';
  if (MAGIC_FOOD_NOTES.has(note) && !(foodMagicShare(record) > 0)) return '';
  return foodNoteAsWorded(note, chain, record);
}

/** The step's notes OUTSIDE its food branch (its timber, healing and extraction branches): every other note it writes claims food. */
const NOT_FOOD_NOTES = new Set([
  'Druidic forest management accelerates regrowth and sustainable yield',
  'Divine healing supplements mundane medicine',
  'Alchemical remedies supplement treatment',
  'Arcane fabrication provides processed goods from alternative sources',
  'Arcane fabrication and stone-shaping partially offset depleted extraction',
]);

/**
 * THE NOTES THAT CLAIM FOOD MADE BY MAGIC (TAIL-DISPLAY-ECON, the chair's ruling X3, 2026-11-14): every note the food
 * branch of `generators/chainMagicSubstitution.js` writes (its FOOD_CHAIN_IDS). The step writes them on a food chain
 * that is impaired or short of its ground, before the food model credits any provision; the food record's own share
 * (`foodMagicShare`) is the one home of whether magic feeds the town, and a card claims no food by magic where it is none.
 */
export const MAGIC_FOOD_NOTES = Object.freeze(new Set(Object.keys(MAGIC_NOTE_TRADITION).filter((note) => !NOT_FOOD_NOTES.has(note))));

/**
 * THE FOOD RECORD'S MAGIC SHARE, ONE READER (X3): the share of the day's need the food record's own provision makes up
 * (`economicState.foodSecurity.magicOffset` over `.dailyNeed`, the figures the Economics tab's food row prints); 0 where
 * the record holds none. The chain cards' food notes, the Magic tab's dependence line and its chain notes read it here.
 * @param {unknown} record the settlement record
 * @returns {number}
 */
export function foodMagicShare(record) {
  const fs = /** @type {{ economicState?: { foodSecurity?: { magicOffset?: unknown, dailyNeed?: unknown } | null } | null } | null} */ (record)?.economicState?.foodSecurity;
  const magic = Number(fs?.magicOffset), need = Number(fs?.dailyNeed);
  return Number.isFinite(magic) && magic > 0 && Number.isFinite(need) && need > 0 ? magic / need : 0;
}


/** The grounds a farmland is (the food record's grain ground, `chainStateShown.js :: FOOD_SOURCE_GROUND.grain`). */
const FARMLAND = new Set(['grain_fields', 'fertile_floodplain']);

/**
 * A food note in the words the record bears (X3): "fills the gap" only where the food record leaves no shortfall, else
 * the provision eases it; "depleted farmland" only on a chain whose ground is farmland, else the depleted ground.
 * @param {string} note @param {unknown} chain @param {unknown} record
 * @returns {string}
 */
function foodNoteAsWorded(note, chain, record) {
  if (note === 'Blessed stores; divine provision fills the gap') {
    const deficit = Number(/** @type {{ economicState?: { foodSecurity?: { deficit?: unknown } | null } | null } | null} */ (record)?.economicState?.foodSecurity?.deficit);
    return deficit > 0 ? 'Blessed stores; divine provision eases the shortfall' : note;
  }
  if (note === 'Druidic cultivation supplements depleted farmland') {
    const ground = /** @type {{ resourceInputKey?: unknown } | null} */ (chain)?.resourceInputKey;
    return FARMLAND.has(String(ground)) ? note : 'Druidic cultivation supplements the depleted ground';
  }
  return note;
}
