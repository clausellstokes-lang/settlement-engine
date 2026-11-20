/**
 * seatTable.js — THE ONE TABLE OF FORMS BY HOLDER KIND (CS6), AND THE ONE READER OF A POWER'S KIND
 * FOR THE CONTEST (CS4) (SEAT-1 train 1, unit U2).
 *
 * The owner's model of 2026-11-20 reads three things apart: the FORM of government
 * (`powerStructure.government`), the HOLDER (the power that holds the seat) and the PERSON in it.
 * This file is the one home of the first two's correlation: which forms a holder of each kind may
 * hold, at each size, with what weight; which unusual pair needs which recorded circumstance to be
 * licensed ("the merchant guilds who installed a king of their own on the throne"); which
 * competition-layer family a kind prefers, under the seat law and (`oldFamily`) under the old; and
 * the readers every unit of the train reads a kind through (`contestKindOf` for a power in the
 * contest, `ownKindOf` for a power's own kind, `formKindOf` for a form).
 *
 * ⭐ THE COMPETITION LAYER'S OLD TABLE LIVES HERE NOW TOO (the U2 cure, the chair's ruling of
 * 2026-11-20 09:26Z): `oldFamily` is the id `factionCompetition.js :: GOVERNMENT_BY_ARCHETYPE` held
 * for the archetype the competition layer folds each kind to (craft to merchant, occupation to
 * military, government/civic/other to civic), byte for byte, and `ensureFactionStates` reads it from
 * here under the old law. Under the seat law it reads `family`, of the power's OWN kind.
 *
 * ⭐ TODAY'S TRANSFER TABLE LIVES HERE NOW, BYTE FOR BYTE. The FIRST form of every kind and band is
 * the label `rulingPower.js :: governmentLabelFor` returned before this file existed, and `alt` is
 * the old `ALT_GOVERNMENT_LABELS` row; `rulingPower.js` reads both from here and from nowhere else,
 * so the transfer is byte-identical under every law. `civic`, `other` and any unknown kind read the
 * `government` row (they shared its labels, and had no alternate).
 *
 * ⭐ THE REST IS READ BY NOTHING THAT A STORED TOWN REACHES UNTIL A LATER UNIT, UNDER THE SEAT LAW.
 * The bands beyond the first form are the forms the BIRTH emits for that kind, placed in the band of
 * the tiers it emitted them at on the measure's two pools (`count-default.md`, `count-presets.md`,
 * "Ruling bodies born"), or, for a name the pools never reached, the band of the tier its own
 * chooser names (`rulingStructure.js :: generatePowerStructure`). The weights are integers and a
 * draft: 2 for the transfer's own form of the band, 1 for every other; read by no draw until train 2
 * (the leader's house by weight, U13), and the owner's to tune there.
 *
 * THE PAIR CHECK (`pairLicense`) answers one of five words: `own` (the kind's own rows hold the
 * form), `civic` (a civic form, held by a kind the dual hat draws a civic leader from:
 * `representatives.js :: CIVIC_HOUSE_KINDS`), `fallback` (a civic form, held by another open kind,
 * only as the dual hat's own fallback where no trade or landed house stands), `licensed` (an unusual
 * pair, with the closed circumstance that licenses it) and `none`. A criminal kind holds no civic
 * form. The guild-governance forms (Guild Council, Guild Authority, Grand Guild Council) are held as
 * OWN by both merchant and craft (the owner's "a guild council … led by the power of a merchant guild
 * or craft guild"); their form reads merchant, the first row that holds them, which is how every
 * reader reads them today.
 *
 * ⛔ DATA AND READS ONLY, AND ONE IMPORT. `rulingPower.js` imports this file and is in the
 * first-paint closure, so nothing here may close a cycle through it or pull a lazy module in: no
 * `people/cardVeil.js` (it imports `rulingPower.js`), no `dossier/powerSupport.js` (coherence-lazy),
 * no `seat/seatLaw.js` (its callers gate). `factionArchetypes.js` is already in `rulingPower.js`'s
 * graph. The veil and the craft name are read off the row itself, exactly as `cardVeil.js ::
 * isVeiledPower` and `powerSupport.js :: backingArchetypeOf` read them (a test pins each equal).
 *
 * Pure. No RNG, no store, no wall clock, no module state beyond the frozen table.
 *
 * @guarded-by tests/domain/seat/seatTable.test.js
 */

import { factionArchetype, FACTION_ARCHETYPES as A } from '../factionArchetypes.js';

/** @typedef {'small' | 'town' | 'large'} SeatBand */
/** @typedef {Readonly<Record<string, number>>} WeightedForms  form -> weight, in draw order */
/**
 * @typedef {Object} SeatRow
 * @property {string} family        the competition layer's government-preference id for the kind
 * @property {string} oldFamily     the id the competition layer gave the kind before the seat law
 * @property {string | null} alt    the transfer's alternate form when its own is taken
 * @property {Readonly<Record<SeatBand, WeightedForms>>} bands  the forms by size band, weighted;
 *   the first of each band is the transfer's own form
 * @property {Readonly<Record<string, string>>} licenses  an unusual form -> the circumstance that
 *   licenses this kind to hold it
 */
/** @typedef {'own' | 'civic' | 'fallback' | 'licensed' | 'none'} SeatPair */

/**
 * THE CIRCUMSTANCES A LICENSE MAY CITE (CS5's closed list). U2 owns the NAMES only; their reads
 * (each a pure read of what the town records, never a hidden fact) are U4's.
 * @type {ReadonlyArray<string>}
 */
export const SEAT_CIRCUMSTANCES = Object.freeze([
  'craft_led', 'trade_wealth', 'strong_faith', 'martial_pressure',
  'hunger', 'mandate', 'outside_debt', 'occupation',
]);

/** The size bands, in order. @type {ReadonlyArray<SeatBand>} */
export const SEAT_BANDS = Object.freeze(/** @type {SeatBand[]} */ (['small', 'town', 'large']));

/**
 * @param {string} family @param {string} oldFamily @param {string | null} alt
 * @param {Record<string, number>} small @param {Record<string, number>} town
 * @param {Record<string, number>} large @param {Record<string, string>} [licenses]
 * @returns {SeatRow}
 */
const row = (family, oldFamily, alt, small, town, large, licenses = {}) => Object.freeze({
  family,
  oldFamily,
  alt,
  bands: Object.freeze({ small: Object.freeze(small), town: Object.freeze(town), large: Object.freeze(large) }),
  licenses: Object.freeze(licenses),
});

/**
 * ⭐ THE ONE TABLE. Keyed by holder kind; the key order is the order a form shared by two rows is
 * read in (merchant before craft). Each band is a form -> weight map in draw order (a form is a key:
 * an identifier of the form, not a line; the lines that print a form are the birth's and the
 * transfer's, and they keep their own register rows).
 * @type {Readonly<Record<string, SeatRow>>}
 */
export const SEAT_TABLE = Object.freeze({
  [A.GOVERNMENT]: row('council_rule', 'council_rule', null,
    { 'Elder Council': 2, 'Household Council': 1, 'Free Elder Council': 1, 'Elder Consensus': 1, "Headman's Authority": 1, 'Elected Reeve': 1 },
    { 'Town Council': 2, 'Town Mayor': 1 },
    { 'City Council': 2, 'Grand Council': 1, 'Democratic assembly': 1, 'City-State Council': 1 }),
  [A.NOBLE]: row('noble_patronage', 'noble_patronage', 'Noble Regency',
    { 'Feudal Stewardship': 2 },
    { 'Ducal Governorship': 2, 'Feudal Appointee': 1 },
    { 'Royal Authority': 2, 'Noble Governorship': 1, 'Ducal Governorship': 1 }),
  [A.MILITARY]: row('military_order', 'military_order', 'Garrison Command',
    { 'Militia Command': 2 },
    { 'Military Council': 2 },
    { 'Grand Military Council': 2, 'Military City Council': 1 }),
  [A.MERCHANT]: row('merchant_charter', 'merchant_charter', 'Merchant oligarchy',
    { 'Merchant Council': 2 },
    { 'Merchant City Council': 2, 'Merchant Council': 1, 'Merchant oligarchy': 1, 'Guild Council': 1 },
    { 'Grand Merchant Senate': 2, 'Merchant City Council': 1, 'Merchant oligarchy': 1, 'Grand Merchant Oligarchy': 1,
      'Merchant Guild Council': 1, 'Grand Guild Consortium': 1, 'Guild Authority': 1, 'Grand Guild Council': 1 },
    { 'Royal Authority': 'trade_wealth', 'Ducal Governorship': 'trade_wealth' }),
  [A.RELIGIOUS]: row('temple_authority', 'temple_authority', 'Ecclesiastical Council',
    { 'Church Council': 2, 'Priestly Guidance': 1 },
    { 'Theocratic Council': 2, 'Church Council': 1 },
    { 'High Theocratic Council': 2, 'Ecclesiastical Council': 1 }),
  [A.ARCANE]: row('arcane_magocracy', 'arcane_magocracy', null,
    { 'Circle of Adepts': 2 },
    { 'Arcane Council': 2 },
    { 'Grand Arcane Council': 2, 'Arcane Council': 1, 'Arcane Senate': 1 }),
  [A.CRAFT]: row('guild_charter', 'merchant_charter', null,
    { "Guildmasters' Moot": 2 },
    { 'Guildhall Council': 2, 'Guild Council': 1 },
    { 'Grand Guild Assembly': 2, 'Guild Authority': 1, 'Grand Guild Council': 1 }),
  [A.LABOR]: row('communal_assembly', 'communal_assembly', null,
    { 'Commons Assembly': 2 },
    { "Workers' Assembly": 2 },
    { 'Grand Commons Assembly': 2 }),
  [A.OUTSIDER]: row('foreign_administration', 'noble_patronage', null,
    { 'Foreign Stewardship': 2 },
    { 'Foreign Administration': 2 },
    { 'Foreign Administration': 2 }),
  [A.OCCUPATION]: row('occupation_rule', 'military_order', 'Martial Administration',
    { 'Occupation Authority': 2 },
    { 'Occupation Authority': 2 },
    { 'Occupation Authority': 2 }),
  // Criminal rule is never reached by the coup path (excluded from the field), but the DM can
  // install it via CHANGE_RULING_POWER; the forms are the birth's corrupt-government vocabulary.
  [A.CRIMINAL]: row('criminal_shadow_rule', 'criminal_shadow_rule', null,
    { 'Corrupt Council': 2 },
    { 'Corrupt City Council': 2, 'Corrupt Council': 1 },
    { 'Shadow Senate': 2, 'Corrupt City Council': 1 }),
});

/** The kinds the dual hat draws a civic government's leader from (`representatives.js ::
 *  CIVIC_HOUSE_KINDS`, restated: that module is a generator, a test pins the two equal).
 *  @type {ReadonlyArray<string>} */
const CIVIC_HOLDER_KINDS = Object.freeze([A.CRAFT, A.MERCHANT, A.NOBLE]);

/**
 * The size band of a settlement tier (thorp, hamlet, village small; city, metropolis large; every
 * other value, absent included, town).
 * @param {string | null | undefined} tier @returns {SeatBand}
 */
export function seatBandOf(tier) {
  const t = String(tier || '').toLowerCase();
  if (t === 'thorp' || t === 'hamlet' || t === 'village') return 'small';
  if (t === 'city' || t === 'metropolis') return 'large';
  return 'town';
}

/**
 * The table's row for a holder kind: `civic`, `other` and any kind the table does not hold read
 * the `government` row.
 * @param {string} kind @returns {SeatRow}
 */
export function seatRowOf(kind) {
  return SEAT_TABLE[Object.hasOwn(SEAT_TABLE, kind) ? kind : A.GOVERNMENT];
}

/** The transfer's own form for a holder kind at a tier (the first form of its band).
 *  @param {string} kind @param {string | null | undefined} tier @returns {string} */
export function preferredFormOf(kind, tier) {
  return Object.keys(seatRowOf(kind).bands[seatBandOf(tier)])[0];
}

/** The old `rulingPower.js :: GOVERNMENT_PREFERENCES` rebuilt from this table: its kinds in its own
 *  key order (kinds, never forms), each band read through `preferredFormOf` at a tier of that band.
 *  Everything is held inside the call, so nothing of it stays in first paint.
 *  @returns {Readonly<Record<string, Readonly<Record<SeatBand, string>>>>} */
function transferFormsView() {
  const kinds = [A.MILITARY, A.RELIGIOUS, A.MERCHANT, A.NOBLE, A.ARCANE, A.CRAFT, A.LABOR,
    A.CIVIC, A.GOVERNMENT, A.OUTSIDER, A.OCCUPATION, A.CRIMINAL, A.OTHER];
  return Object.freeze(Object.fromEntries(kinds.map((kind) => [kind, Object.freeze({
    small: preferredFormOf(kind, 'village'), town: preferredFormOf(kind, 'town'), large: preferredFormOf(kind, 'city'),
  })])));
}

/**
 * ⭐ THE OLD TRANSFER TABLE, AS A VIEW OF THIS ONE (the U2-CURE2, SEAT-2's red at the merge: the
 * titles lane's test reads `rulingPower.js :: GOVERNMENT_PREFERENCES`). The old object's shape and
 * values byte for byte, keys in its own order, each `{ small, town, large }` the transfer's own form
 * of that kind and band; DERIVED, never a second spelling of a form, frozen to its leaves.
 * `rulingPower.js` re-exports it under the old name. No app code reads it, so it is marked pure
 * and leaves the first-paint closure.
 */
export const TRANSFER_FORMS_VIEW = /* @__PURE__ */ transferFormsView();

/** The transfer's alternate form for a holder kind, or null.
 *  @param {string} kind @returns {string | null} */
export function alternateFormOf(kind) {
  return seatRowOf(kind).alt;
}

/** The competition layer's government-preference family for a holder kind.
 *  @param {string} kind @returns {string} */
export function governmentFamilyOf(kind) {
  return seatRowOf(kind).family;
}

/** The id the competition layer gave a kind (or its own archetype) before the seat law: the old
 *  `factionCompetition.js :: GOVERNMENT_BY_ARCHETYPE`, byte for byte (a test pins each literal).
 *  @param {string} kind @returns {string} */
export function oldLawFamilyOf(kind) {
  return seatRowOf(kind).oldFamily;
}

/** A form's own name, without the transfer's " Ascendant" collision suffix.
 *  @param {unknown} form @returns {string} */
const bareForm = (form) => String(form ?? '').trim().replace(/ Ascendant$/, '');

/** Every form a row holds as its own: its bands and its alternate.
 *  @param {SeatRow} r @returns {string[]} */
const ownForms = (r) => [...(r.alt ? [r.alt] : []), ...SEAT_BANDS.flatMap((b) => Object.keys(r.bands[b]))];

/** form -> the first kind (in table order) whose own rows hold it. @type {ReadonlyMap<string, string>} */
const FORM_KIND = new Map(Object.entries(SEAT_TABLE).reverse()
  .flatMap(([kind, r]) => ownForms(r).map((form) => /** @type {[string, string]} */ ([form, kind]))));

/**
 * THE FORM READER: the kind whose own rows hold a form ("<form> Ascendant" reads as its form), or
 * null for a name the table does not hold.
 * @param {unknown} form @returns {string | null}
 */
export function formKindOf(form) {
  return FORM_KIND.get(bareForm(form)) ?? null;
}

/**
 * THE PAIR CHECK: may a holder of `kind` hold `form`, and on what footing.
 * @param {string} kind @param {unknown} form
 * @returns {{ pair: SeatPair, circumstance: string | null }}
 */
export function pairLicense(kind, form) {
  const f = bareForm(form);
  const r = seatRowOf(kind);
  if (ownForms(r).includes(f)) return { pair: 'own', circumstance: null };
  if (Object.hasOwn(r.licenses, f)) return { pair: 'licensed', circumstance: r.licenses[f] };
  if (formKindOf(f) !== A.GOVERNMENT || kind === A.CRIMINAL) return { pair: 'none', circumstance: null };
  return { pair: CIVIC_HOLDER_KINDS.includes(kind) ? 'civic' : 'fallback', circumstance: null };
}

/**
 * Is a power veiled — hidden (`hidden === true`, the stress infiltrator) or criminal by category?
 * Exactly `cardVeil.js :: isVeiledPower`'s test, read off the row (that module imports
 * `rulingPower.js`, so this one may not import it; a test pins the two equal).
 * @param {unknown} power @returns {boolean}
 */
export function isVeiledRow(power) {
  if (!power || typeof power !== 'object' || Array.isArray(power)) return false;
  const p = /** @type {Record<string, unknown>} */ (power);
  return p.hidden === true || (typeof p.category === 'string' && p.category.toLowerCase() === 'criminal');
}

/**
 * THE KIND READER for the contest: a veiled or criminal power reads criminal FIRST, whatever its
 * name says (an "Artisans' Syndicate" is criminal, never craft), which keeps a hidden power out of
 * the field; then the power's own kind (`ownKindOf`). The veil step is the contest's alone.
 * @param {unknown} power a power's row (or its name) @returns {string}
 */
export function contestKindOf(power) {
  return isVeiledRow(power) ? A.CRIMINAL : ownKindOf(power);
}

/**
 * A POWER'S OWN KIND, without the contest's veil step (the U2 cure, SEAT-2's): a criminal power
 * reads criminal (by its category or its name); then craft off the name, as `powerSupport.js ::
 * backingArchetypeOf` reads it (the Craft Guilds carry the generator's `economy` tag); then the
 * canonical archetype, with civic folded into government. A HIDDEN non-criminal power reads its own
 * kind here: what a power states it wants is not the contest, and a power that is not criminal is
 * never worded as one. `contestKindOf` is this read behind the veil step, and nothing else.
 * @param {unknown} power a power's row (or its name) @returns {string}
 */
export function ownKindOf(power) {
  const kind = factionArchetype(/** @type {Object | string | null | undefined} */ (power));
  if (kind === A.CRIMINAL) return kind;
  // The name is `.faction`, the one every writer stamps (the generator; `addFaction` mints the
  // legacy `.name` alias beside it): a `.name`-only read is dead on every generated world.
  const p = /** @type {{ faction?: unknown }} */ (power && typeof power === 'object' ? power : {});
  if (/craft|artisan/i.test(String(p.faction || ''))) return A.CRAFT;
  return kind === A.CIVIC ? A.GOVERNMENT : kind;
}
