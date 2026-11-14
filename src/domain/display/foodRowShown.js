/**
 * domain/display/foodRowShown.js — THE FOOD SECURITY ROW, ITS BAR AND ITS SENTENCE READ ONE HOME (W2-C-LEAVES-5 item 4,
 * 2026-11-13; the round-three cut's #442, #785, #1040, #1366 and the increment's rww-metropolis-famine-1).
 *
 * The Economics tab's stat row ("Production: N lbs/day + N imported + N by … provision · Need · Short") printed the
 * viability view (`economicViability.metrics.foodBalance`), while the sentence beside it read the food record
 * (`economicState.foodSecurity`, whose `foodRecord` says whether food comes in at all and how long the stores last).
 * The two homes disagree in most towns: the view re-splits the record's gap and rounds its own way, so the row printed
 * "+ 7,040 imported" beside a record of 7,025, "Short: 177" beside 237, and "+ 1 imported" under a siege whose record
 * imports nothing (the remainder of rounding 1,294 − 413, printed as an import).
 *
 * RULED (the chair, item 4): the row and the sentence read ONE home, the food record; the row's figures add up as
 * printed; a remainder of rounding is never printed as an import. So:
 *   · production, need, the import and the provision are the food record's own pounds (`foodSecurity.dailyProduction`,
 *     `.dailyNeed`, `.importCoverage`, `.magicOffset`);
 *   · the import is printed only where the sentence names a carrier that brings food in (`tradeOpen`, the caller's:
 *     the carriers the siege leaves, a port's own ships apart): under a siege the record can keep an import share in a
 *     town that is no port, and the row follows the sentence (the disagreement is the record's, named in the hand-back
 *     with its count). WHETHER food comes in is these pounds (W2-C-LEAVES item 4(a) read the record's rounded share,
 *     `foodRecord.normalImportPct`, which is 0% beside a few pounds in 2 of 720 towns and 1–2% beside none in 11);
 *   · the shortfall is what the printed figures leave of the need, so the row adds up as printed; it differs from the
 *     record's own `deficit` only by the rounding of its separately rounded parts, or by the import the siege took.
 *     Where the record has no shortfall at all, a pound of rounding is not printed as one.
 * A town with no food record keeps the view (an older save; the caller falls back). Pure: no randomness, no write.
 */

import { magicFoodChannelWord } from './foodBalanceBar.js';
import { magicTraditionHolds } from './magicProvisionShown.js';

/** The tradition each kind word of the view's provision note is of. */
const KIND_TRADITION = Object.freeze({ druidic: 'druid', divine: 'divine', arcane: 'arcane' });
/** @param {unknown} town @param {unknown} note @returns {boolean} whether the note's kind of provision is the town's */
const kindHeld = (town, note) => {
  const kind = /** @type {keyof typeof KIND_TRADITION | 'magical'} */ (magicFoodChannelWord(note));
  return kind === 'magical' || magicTraditionHolds(town, KIND_TRADITION[kind]);
};

/** @param {unknown} v @returns {number} a finite number, or 0 */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/**
 * @typedef {{ dailyProduction: number, dailyNeed: number, importCoverage: number, magicFoodOffset: number,
 *   magicFoodNote: unknown, deficit: number, surplus: number, rawDeficit: number }} FoodRowView
 */

/**
 * @typedef {{ dailyNeed?: unknown, dailyProduction?: unknown, importCoverage?: unknown, magicOffset?: unknown,
 *   deficit?: unknown, deficitPct?: unknown, foodRecord?: unknown }} FoodSecurityRead the food record's fields this leaf reads
 * @typedef {{ economicState?: { foodSecurity?: FoodSecurityRead | null } | null,
 *   economicViability?: { metrics?: { foodBalance?: { magicFoodNote?: unknown } | null } | null } | null }} TownRead
 */

/**
 * The food row as it prints, from the food record.
 * @param {TownRead | null | undefined} town the settlement record
 * @param {boolean} tradeOpen whether the sentence beside the row names a carrier that brings food in
 * @returns {{ fb: FoodRowView, deficitPct: number } | null} null where the town has no food record
 */
export function foodRowShown(town, tradeOpen) {
  const t = town;
  const fs = t?.economicState?.foodSecurity;
  if (!fs || typeof fs !== 'object' || !fs.foodRecord || !(num(fs.dailyNeed) > 0)) return null;
  const need = num(fs.dailyNeed);
  const production = Math.max(0, num(fs.dailyProduction));
  const imported = tradeOpen ? Math.max(0, num(fs.importCoverage)) : 0;
  const magic = Math.max(0, num(fs.magicOffset));
  const remainder = need - production - imported - magic;
  const deficit = num(fs.deficit) > 0 || imported < Math.max(0, num(fs.importCoverage)) ? Math.max(0, remainder) : 0;
  const recordPct = Math.round(num(fs.deficitPct));
  const deficitPct = deficit <= 0 ? 0 : Math.max(1, deficit === num(fs.deficit) ? recordPct : Math.round((deficit / need) * 100));
  return {
    fb: {
      dailyProduction: production,
      dailyNeed: need,
      importCoverage: imported,
      magicFoodOffset: magic,
      // the provision's kind (druidic, divine, arcane) is the view's note, named only where the town holds that tradition
      // (W2-C-LEAVES-5 item 5: `magicProvisionShown.js :: magicTraditionHolds`, the defence's tradition facts); else no kind
      // is named and the figure stands ("magical", the bar's own word for a provision of no named kind)
      magicFoodNote: kindHeld(town, t?.economicViability?.metrics?.foodBalance?.magicFoodNote) ? t?.economicViability?.metrics?.foodBalance?.magicFoodNote ?? null : null,
      deficit,
      surplus: Math.max(0, production - need),
      rawDeficit: Math.max(0, need - production),
    },
    deficitPct,
  };
}
