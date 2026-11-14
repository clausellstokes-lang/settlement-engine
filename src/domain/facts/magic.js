/**
 * domain/facts/magic.js — THE MAGIC HOME (CENSUS-1 wave 0, fact 7; the design's §1 row "magic
 * functions / level", Appendix A competing reading 9).
 *
 * ONE DEFAULT: a missing `config.magicExists` reads ON — the engine's (`magicLedger.js`:
 * `cfg.magicExists !== false`) — and "does magic function here" is
 * `worldPulse/magicWorksAt.js :: magicWorksAt`. The level is the ledger's folded band (it folds the
 * legacy vocabulary — moderate, common, pervasive — that a raw `magicLevel ===` compare misses).
 *
 * The raw reads that spell `magicExists !== false` or `=== false` already agree with this default
 * and are left where they stand; the reader that disagreed was the soak's feature table
 * (`features.mjs`, which printed a missing value as 'off'), retired here.
 *
 * Pure: no randomness, no clock.
 */
import { magicLedger } from '../magicLedger.js';
import { magicWorksAt } from '../worldPulse/magicWorksAt.js';

/** @typedef {import('../magicLedger.js').MagicLedgerSource} MagicSource */

/**
 * THE ONE READER.
 * @param {MagicSource & { settlement?: MagicSource | null } | null | undefined} record a settlement record (or a
 *   `{ settlement }` snapshot item)
 * @returns {Readonly<{ functions: boolean, level: string, priority: number }>}
 */
export function magicOf(record) {
  const settlement = record?.settlement || record || null;
  const ledger = magicLedger(settlement);
  return Object.freeze({
    functions: magicWorksAt({ settlement }),
    level: String(ledger.magicLevel ?? 'none'),
    priority: Number(ledger.priorityMagic ?? 0),
  });
}

/**
 * WHETHER THE DEFENCE ITSELF HOLDS AN ARCANE TRADITION (W2-C-LEAVES-3; the chair's ruling, record 369 G5): the stored
 * `defenseProfile.traditions.hasArcane`, the defence's own fact. The Defense tab's Arcane Support row is a claim about the
 * defence, so a practitioner on the Magic tab's census does not make it alone (`defenseDisplay.js ::
 * deriveSupportingCapabilities`). Read here, in the magic fact's home.
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function defenceHoldsArcane(record) {
  const profile = record && typeof record === 'object'
    ? /** @type {{ defenseProfile?: { traditions?: { hasArcane?: unknown } | null } | null }} */ (record).defenseProfile
    : null;
  return profile?.traditions?.hasArcane === true;
}


/** A person's role or title that names a mage (the cast's own words: "the council's archmage", "the wizard"). */
const MAGE_ROLE = /\b(?:arch)?mages?\b|\bwizards?\b|\bsorcer(?:er|ess)\b|\bmagus\b|\bwarlocks?\b|\benchant(?:er|ress)\b|\bnecromancer/i;

/**
 * WHETHER THE RECORD NAMES AN ARCANE POWER THAT GOVERNS, OR A MAGE AT WORK (W2-C-LEAVES-SIDE, 2026-11-13; the chair's
 * ruling on the increment's rww-town-calm-1: "Arcane Support · None · No arcane practitioners on the rolls" where an
 * Arcane Council rules, "Mages govern, and their magic is their claim to rule", and the council's archmage is named).
 * The power roster (`powerStructure.factions[]`, category magic, `isGoverning`) and the cast (`npcs[]`, an active person
 * whose role or title names a mage), read as stored. The Defense tab's Arcane Support row leaves "None" out where this
 * holds (`defenseDisplay.js :: deriveSupportingCapabilities`).
 * THE RECORD'S OWN DISAGREEMENT, NAMED for the seat after the merges: the practitioner census
 * (`magicReliance.js :: magicPractitioners`, people by `isPractisingNpc`) counts neither the governing Arcane Council nor
 * "the council's archmage" (13 towns of the census's 720 at 408c2e30c, 7 with the archmage named).
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function recordNamesAMage(record) {
  const r = record && typeof record === 'object'
    ? /** @type {{ powerStructure?: { factions?: unknown } | null, npcs?: unknown }} */ (record)
    : null;
  const factions = Array.isArray(r?.powerStructure?.factions) ? r.powerStructure.factions : [];
  if (factions.some((f) => f?.category === 'magic' && f?.isGoverning === true)) return true;
  const npcs = Array.isArray(r?.npcs) ? r.npcs : [];
  return npcs.some((n) => {
    const p = /** @type {{ role?: unknown, title?: unknown, status?: unknown } | null} */ (n);
    const status = typeof p?.status === 'string' ? p.status.toLowerCase() : '';
    return (!status || status === 'active') && MAGE_ROLE.test(`${typeof p?.role === 'string' ? p.role : ''} ${typeof p?.title === 'string' ? p.title : ''}`);
  });
}

/**
 * The defence profile's tradition flags, read as stored (`defenseProfile.traditions`, written by
 * `generators/defenseGenerator.js`: hasArcane, hasDivine, hasDruid, …).
 * @param {unknown} record the settlement record
 * @returns {{ hasDivine?: unknown, hasDruid?: unknown } | null}
 */
function defenceTraditionsOf(record) {
  const profile = record && typeof record === 'object'
    ? /** @type {{ defenseProfile?: { traditions?: { hasDivine?: unknown, hasDruid?: unknown } | null } | null }} */ (record).defenseProfile
    : null;
  return profile?.traditions ?? null;
}

/**
 * WHETHER THE DEFENCE HOLDS A DIVINE TRADITION: THE TOWN HAS CLERGY WITH POWERS (W2-C-LEAVES-SIDE, 2026-11-13; the chair's
 * word, record 387: one home for "the town has clergy with powers", the defence's tradition leaf): the stored
 * `defenseProfile.traditions.hasDivine`, the twin of `defenceHoldsArcane`. The Economics tab's "divine provision" and
 * its recovery chip ask this one home (the main seat's lines). Measured on the census's 720 at 408c2e30c: 339 hold it.
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function defenceHoldsDivine(record) {
  return defenceTraditionsOf(record)?.hasDivine === true;
}

/**
 * WHETHER THE DEFENCE HOLDS A DRUIDIC TRADITION (W2-C-LEAVES-SIDE, 2026-11-13; the chair's word): the defence profile
 * keeps the druid's tradition apart from the divine one (`defenseProfile.traditions.hasDruid`), so "+ N by druidic
 * provision" asks it here, not the divine flag. Measured on the census's 720 at 408c2e30c: 84 hold it.
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function defenceHoldsDruidic(record) {
  return defenceTraditionsOf(record)?.hasDruid === true;
}

/** The economy's words for magic's goods and income (the record's export and income names: "Alchemical trade (potions,
 * reagents)", "Potions and elixirs", "Alchemical reagents", "Arcane reagents", "Apothecary & Alchemy", "Arcane Industry",
 * "Spellcasting Services"). */
const MAGIC_ECONOMY = /alchem|\bmagic|\barcane|enchant|\bspell|potion|elixir|\bscroll/i;

/**
 * WHETHER THE ECONOMY SPEAKS OF MAGIC'S ECONOMIC ROLE (W2-C-LEAVES-SIDE item 7, 2026-11-13; the cut's #1086: "Economic
 * role: absent" on the Magic tab beside an alchemical export and an Alchemist quarter). The chair's ruling: a role row
 * reads the home that speaks of that role: the economy's exports (`economicState.primaryExports`) and income
 * (`economicState.incomeSources[].source`) for the economic role. Read as stored.
 * @param {unknown} record the settlement record
 * @returns {boolean}
 */
export function economyShowsMagic(record) {
  const es = record && typeof record === 'object'
    ? /** @type {{ economicState?: { primaryExports?: unknown, incomeSources?: unknown } | null }} */ (record).economicState
    : null;
  const sold = es?.primaryExports; // read, never written (tradeListWriters)
  const exportsOf = Array.isArray(sold) ? sold : [];
  const incomeOf = Array.isArray(es?.incomeSources) ? es.incomeSources : [];
  return exportsOf.some((x) => typeof x === 'string' && MAGIC_ECONOMY.test(x))
    || incomeOf.some((x) => {
      const source = /** @type {{ source?: unknown } | null} */ (x)?.source;
      return typeof source === 'string' && MAGIC_ECONOMY.test(source);
    });
}
