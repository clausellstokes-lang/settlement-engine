/**
 * data/tensionSideMeanings.js — WHAT EACH TENSION SIDE MEANS (S7, second cut: data only).
 *
 * Brief: `docs/chair/2026-11-20/content/page/briefs/S7.md` (PAGE-2, 2026-11-20 12:09 UTC). The chair's two rulings:
 *   11:36 — a power is never cast in another party's part;
 *   11:58 — display, not stored: `history.currentTensions[*].factions` keeps EXACTLY the words it has today. The DISPLAY
 *           seat builds the one reader and the surfaces from this table; nothing here writes a side, and nothing reads it
 *           at birth. The plain-text copy for the chair is `docs/chair/2026-11-20/content/page/S7-TABLE.txt`, generated
 *           from this file (`TENSION_SIDE_TABLE_LINES`).
 *
 * KEYED BY A SIDE'S OWN WORDS: every distinct side string of `historyData.js :: HISTORICAL_EVENTS_DATA` (its `factions`
 * and each `byMemory` form's `factions`), plus the fixed words `historyGenerator.js :: buildHistoricalEvent` writes in
 * place of a template's words (`substituteNames`' fallbacks and `forceParty`). Each row:
 *   at        every `{ kind, form, slot }` that carries these words (a fixed generator side: the places of the template
 *             words it stands for, named in `standsFor`);
 *   means     the party the side means (`SIDE_MEANS`); 'none' is a crowd or a camp that is no power;
 *   presumes  the house or office the words presume and the record may LACK where the words stand, as fact-vocabulary
 *             atoms (`domain/facts/factVocabulary.js`). A house the side's own kind already needs at the tension
 *             (`historyGenerator.js :: HISTORY_TEMPLATE_RECORD_DECLARATIONS`: the guild war's guild, the divide's, the
 *             crash's and the trade dispute's market, the pilgrimage's temple) is not repeated, nor one the generator
 *             writes the words only where it stands ('The garrison', 'The watch', 'The militia');
 *   without   where `presumes` is set: the words to SHOW in a town that lacks it, an unnamed actor that presumes no
 *             house and is true of such a town, in the side's own register and case; null where even that would be
 *             false, and the side is dropped from the display. Also (the chair's addition, relayed by PAGE-2 after the
 *             second cut) on a template side the generator writes over whose `means` is a power: the words to show where
 *             the side written there is no power of that kind (rule 2 below);
 *   named     (S7 FOLLOW-UP, `briefs/S7-FOLLOWUP.md`: the chair's changes of 13:22 and ruling of 13:50) THE ONLY DOOR TO A
 *             NAME: the wording that shows a power's name, `{power}` filled by the names helper; no finite verb agrees
 *             with it. Only a row whose `means` is the ruler or a power carries one. A row without it is never named by
 *             the reader, whatever its `means` (a camp or a part of a power is no power: its `means` is 'none').
 *
 * BY SLOT (the chair's addition): where the generator writes a power's NAME at a slot (succession_crisis 0 and 2,
 * economic_disparity 0, religious_tension 0, crime_wave 0 and 2 in both forms, corruption_scandal 0) the stored words
 * cannot find their row, so `TENSION_SIDE_BY_SLOT[kind][form][slot]` gives the key of the template row at that place,
 * built from the rows' own `at` (never hand-copied). A form with no sides of its own (`byMemory.unanchored` with a
 * description only) carries its base sides: read it as `base`.
 *
 * THE RULE THE READER APPLIES (the display seat builds the one reader; nothing here reads a town):
 *   0. NAMING (the chair, 13:50). THE READER NEVER PUTS A NAME WHERE THE STORED SIDE IS THE TEMPLATE'S OWN WORDS unless
 *      that row carries `named`; then it shows `named` with `{power}` filled from the ROSTER by the row's `means`, never
 *      from the stored side: 'ruler' is the document's governing power; a power kind only where the document holds
 *      EXACTLY ONE power of that kind (two or none: the row's own words, under rule 1). That uniqueness is the reader's
 *      test; this table only carries `named`. A stored side that already IS a power's name (the seven slots
 *      `substituteNames` writes: "Legitimate heir", "Corrupt officials", "Official guards", "Power behind throne" carry
 *      no `named`) is shown AS STORED under rules 2 to 4, never un-named.
 *   1. The stored side is the template's own words at its slot (`TENSION_SIDE_BY_SLOT` names that very key): show it,
 *      unless the row `presumes` a house the town lacks; then show its `without`, and drop the side where that is null.
 *   2. Otherwise the generator wrote over the slot, with a power's name or one of its fixed words. Take the slot's row
 *      (`TENSION_SIDE_BY_SLOT`). If its `means` is a power (`POWER_MEANS`) and the side written there is not a power of
 *      that kind on the town's roster (a name of another kind of power: the military is not "the wealthy"; or a fixed
 *      word, written because the roster holds no such power), show the slot row's `without` (null: drop). Never show a
 *      power in another party's part (the chair's 11:36).
 *   3. Else, where the side is one of the generator's fixed words, read its own row: if its `means` is a power and the
 *      roster holds no power of that kind, or it `presumes` a house the town lacks, show the SLOT row's `without` first,
 *      and the fixed word's own only where the slot row has none (null: drop). So "the merchant class" at the divide's
 *      place with no merchant power shows "Those growing richer"; its own "those who pull the strings" is right only at
 *      the succession's (the second power's fallback, whose slot row carries none).
 *   4. Else show the stored words unchanged. No stored side is ever rewritten (the chair's 11:58).
 *
 * Pure data. No draw.
 */

/**
 * The parties a side can mean (the brief's closed set).
 * @typedef {'ruler' | 'merchant power' | 'craft power' | 'faith power' | 'military power' | 'criminal power' | 'watch'
 *   | 'outsider' | 'none'} SideMeans
 */

/**
 * A place that carries a side's words: the template's type, the form of its words, the side's index.
 * @typedef {{ kind: string, form: 'base' | 'unanchored' | 'dated', slot: number }} SidePlace
 */

/**
 * @typedef {{
 *   at: ReadonlyArray<Readonly<SidePlace>>,
 *   means: SideMeans,
 *   presumes: ReadonlyArray<string>,
 *   without?: string | null,
 *   named?: string,
 *   standsFor?: ReadonlyArray<string>,
 * }} SideMeaning
 */

/** @type {ReadonlyArray<SideMeans>} */
export const SIDE_MEANS = Object.freeze(/** @type {SideMeans[]} */ ([
  'ruler', 'merchant power', 'craft power', 'faith power', 'military power', 'criminal power', 'watch', 'outsider', 'none',
]));

/** The parties that are a POWER of the roster (rules 2 and 3 of the header): a side meaning one is checked against it. */
export const POWER_MEANS = Object.freeze(/** @type {SideMeans[]} */ ([
  'merchant power', 'craft power', 'faith power', 'military power', 'criminal power',
]));

/**
 * Places, written `kind/form/slot`.
 * @param {...string} keys
 * @returns {ReadonlyArray<Readonly<SidePlace>>}
 */
const at = (...keys) => Object.freeze(keys.map((k) => {
  const [kind, form, slot] = k.split('/');
  return Object.freeze({ kind, form: /** @type {SidePlace['form']} */ (form), slot: Number(slot) });
}));

/**
 * A row that presumes nothing.
 * @param {ReadonlyArray<Readonly<SidePlace>>} places @param {SideMeans} means
 * @returns {Readonly<SideMeaning>}
 */
const plain = (places, means) => Object.freeze({ at: places, means, presumes: Object.freeze([]) });

/**
 * A row that presumes a house, and its words where the house is missing.
 * @param {ReadonlyArray<Readonly<SidePlace>>} places @param {SideMeans} means @param {string[]} presumes
 * @param {string | null} without
 * @returns {Readonly<SideMeaning>}
 */
const presuming = (places, means, presumes, without) => Object.freeze({ at: places, means, presumes: Object.freeze(presumes), without });

/**
 * A fixed generator side: the template words it stands for, at their places.
 * @param {Readonly<SideMeaning>} row @param {string[]} standsFor
 * @returns {Readonly<SideMeaning>}
 */
const standing = (row, standsFor) => Object.freeze({ ...row, standsFor: Object.freeze(standsFor) });

/**
 * A row the reader may name (the S7 follow-up's change 1): `{power}` filled from the roster by its `means`.
 * @param {Readonly<SideMeaning>} row @param {string} wording
 * @returns {Readonly<SideMeaning>}
 */
const named = (row, wording) => Object.freeze({ ...row, named: wording });

/** @type {Readonly<Record<string, Readonly<SideMeaning>>>} */
export const TENSION_SIDE_MEANINGS = Object.freeze({
  // succession_crisis
  'Legitimate heir': plain(at('succession_crisis/base/0'), 'ruler'),
  'Popular candidate': plain(at('succession_crisis/base/1'), 'none'),
  'Power behind throne': plain(at('succession_crisis/base/2'), 'none'),
  // economic_disparity (needs a market: HISTORY_TEMPLATE_RECORD_DECLARATIONS)
  // written over with `merchantRef` (any first non-governing power, or "the merchant class"): rule 2's words
  'Wealthy merchants': named(presuming(at('economic_disparity/base/0'), 'merchant power', [], 'Those growing richer'), '{power}'),
  'Poor workers': plain(at('economic_disparity/base/1'), 'none'),
  'Moderate reformers': plain(at('economic_disparity/base/2'), 'none'),
  // religious_tension
  // written over with the religious power's name, or "the orthodox clergy": rule 2's words
  'Orthodox believers': named(presuming(at('religious_tension/base/0'), 'faith power', [], 'The orthodox faithful'), '{power}'),
  'Reformists': plain(at('religious_tension/base/1'), 'none'),
  'Secular camp': plain(at('religious_tension/base/2'), 'none'),
  // guild_conflict (needs a guild)
  'Established guilds': plain(at('guild_conflict/base/0'), 'none'),
  'Upstart guilds': plain(at('guild_conflict/base/1'), 'none'),
  'Non-guild workers': plain(at('guild_conflict/base/2', 'guild_conflict/unanchored/2'), 'none'),
  'Guild members': named(plain(at('guild_conflict/unanchored/0'), 'craft power'), '{power}'),
  'Those who would trade outside the guild': plain(at('guild_conflict/unanchored/1'), 'none'),
  // external_threat
  'Prepare for war': plain(at('external_threat/base/0'), 'none'),
  'Seek diplomacy': plain(at('external_threat/base/1'), 'none'),
  'Flee/hide': plain(at('external_threat/base/2'), 'none'),
  // resource_scarcity
  'Hoarders': plain(at('resource_scarcity/base/0'), 'none'),
  'Desperate poor': plain(at('resource_scarcity/base/1'), 'none'),
  // the S7 follow-up (changes 2, 3): a camp, no power; where no market stands, the kind's own unanchored words (three sides stay three)
  'Price regulators': presuming(at('resource_scarcity/base/2'), 'none', ['market'], 'Those who would fix a fair price'),
  'Those hoarding what they can': plain(at('resource_scarcity/unanchored/0'), 'none'),
  'Those who cannot pay the prices': plain(at('resource_scarcity/unanchored/1'), 'none'),
  'Those who would fix a fair price': plain(at('resource_scarcity/unanchored/2'), 'none'),
  // crime_wave
  'Official guards': presuming(at('crime_wave/base/0', 'crime_wave/unanchored/0'), 'watch', ['force: kept'], 'Those in charge'),
  'Vigilantes': plain(at('crime_wave/base/1'), 'none'),
  'Criminal organisations': named(presuming(at('crime_wave/base/2', 'crime_wave/unanchored/2'), 'criminal power', ['organised crime'], 'Lawbreakers'), '{power}'),
  'Those who would take the law into their own hands': plain(at('crime_wave/unanchored/1'), 'none'),
  // magical_controversy
  'Pro-magic': plain(at('magical_controversy/base/0'), 'none'),
  'Anti-magic': plain(at('magical_controversy/base/1'), 'none'),
  'Regulation advocates': plain(at('magical_controversy/base/2'), 'none'),
  // generational_divide
  'Traditionalists': plain(at('generational_divide/base/0'), 'none'),
  'Progressives': plain(at('generational_divide/base/1'), 'none'),
  'Pragmatic middle': plain(at('generational_divide/base/2'), 'none'),
  // corruption_scandal
  'Corrupt officials': plain(at('corruption_scandal/base/0'), 'ruler'),
  'Reformers': plain(at('corruption_scandal/base/1'), 'none'),
  'Complicit beneficiaries': plain(at('corruption_scandal/base/2'), 'none'),
  // outside_debt
  'Debtors who took the loans': plain(at('outside_debt/base/0'), 'none'),
  'Those who will bear the cost': plain(at('outside_debt/base/1', 'outside_debt/unanchored/1'), 'none'),
  'Those who profited and escaped': plain(at('outside_debt/base/2'), 'none'),
  'Those who took the loans': plain(at('outside_debt/unanchored/0'), 'none'),
  'Those who profited and want no questions asked': plain(at('outside_debt/unanchored/2'), 'none'),
  // occupation_legacy
  'Former collaborators': plain(at('occupation_legacy/base/0'), 'none'),
  'Former resistance': plain(at('occupation_legacy/base/1'), 'none'),
  'New generation wanting to move on': plain(at('occupation_legacy/base/2'), 'none'),
  'Collaborator families': plain(at('occupation_legacy/unanchored/0', 'occupation_legacy/dated/0'), 'none'),
  'Resistance families': plain(at('occupation_legacy/unanchored/1', 'occupation_legacy/dated/1'), 'none'),
  'Those who want it forgotten': plain(at('occupation_legacy/unanchored/2', 'occupation_legacy/dated/2'), 'none'),
  // infiltration_fear
  'Security hardliners': plain(at('infiltration_fear/base/0'), 'none'),
  'Civil libertarians': plain(at('infiltration_fear/base/1'), 'none'),
  'Actual agents exploiting the confusion': plain(at('infiltration_fear/base/2'), 'outsider'),
  // disputed_land
  'Original claimants': plain(at('disputed_land/base/0'), 'none'),
  'Current occupants': plain(at('disputed_land/base/1'), 'none'),
  'Legal class profiting from ambiguity': presuming(at('disputed_land/base/2'), 'none', ['legal house'], 'Those who profit from the muddle'),
  // population_friction
  'Old families': plain(at('population_friction/base/0'), 'none'),
  'Newcomers': plain(at('population_friction/base/1'), 'none'),
  'Merchants who benefit from cheap newcomer labour': named(presuming(at('population_friction/base/2'), 'merchant power', ['market'], 'Those who benefit from cheap newcomer labour'), '{power}, gaining from cheap newcomer labour'),
  // leadership_vacuum
  'Multiple weak claimants': plain(at('leadership_vacuum/base/0'), 'none'),
  'Pragmatists who want stability': plain(at('leadership_vacuum/base/1', 'leadership_vacuum/unanchored/1'), 'none'),
  'Those who prefer the vacuum': plain(at('leadership_vacuum/base/2'), 'none'),
  'Rival claimants, none strong enough to win': plain(at('leadership_vacuum/unanchored/0'), 'none'),
  'Those who prefer things unsettled': plain(at('leadership_vacuum/unanchored/2'), 'none'),
  // market_crash (needs a market)
  'Ruined speculators': plain(at('market_crash/base/0'), 'none'),
  'Creditors calling in debts': plain(at('market_crash/base/1', 'market_crash/unanchored/1'), 'none'),
  'Those who sold in time': plain(at('market_crash/base/2'), 'none'),
  'Those buying as if prices can only rise': plain(at('market_crash/unanchored/0'), 'none'),
  'Those who have sold and are waiting': plain(at('market_crash/unanchored/2'), 'none'),
  // trade_collapse
  'Displaced traders': plain(at('trade_collapse/base/0'), 'none'),
  'Workers left without wages': plain(at('trade_collapse/base/1'), 'none'),
  'Rivals who profited from the diversion': plain(at('trade_collapse/base/2'), 'none'),
  'Traders who fear the buyers are going elsewhere': plain(at('trade_collapse/unanchored/0'), 'none'),
  'Workers afraid for their wages': plain(at('trade_collapse/unanchored/1'), 'none'),
  'Rivals who would gain if the trade moved': plain(at('trade_collapse/unanchored/2'), 'none'),
  // great_fire
  'Survivors seeking someone to blame': plain(at('great_fire/base/0'), 'none'),
  'Rebuilders and profiteers': plain(at('great_fire/base/1', 'great_fire/dated/1'), 'none'),
  'Those accused of setting it': plain(at('great_fire/base/2', 'great_fire/dated/2'), 'none'),
  'Those who want timber and thatch forbidden': plain(at('great_fire/unanchored/0'), 'none'),
  'Households who cannot afford to build in anything else': plain(at('great_fire/unanchored/1'), 'none'),
  'Those who say the danger is overblown': plain(at('great_fire/unanchored/2'), 'none'),
  'Families still seeking someone to blame': plain(at('great_fire/dated/0'), 'none'),
  // plague_years
  'Quarantine hardliners': plain(at('plague_years/base/0'), 'none'),
  'The bereaved and the blamed': plain(at('plague_years/base/1'), 'none'),
  'Healers and charlatans alike': presuming(at('plague_years/base/2'), 'none', ['healer'], 'Those who sold cures, honest or not'),
  'Those who would shut the sick away': plain(at('plague_years/unanchored/0'), 'none'),
  'Families who refuse to be shut in': plain(at('plague_years/unanchored/1'), 'none'),
  'Those who trust to prayer and old remedies': plain(at('plague_years/unanchored/2'), 'none'),
  // great_flood
  'Displaced families': plain(at('great_flood/base/0'), 'none'),
  'Landowners pressing newly-convenient claims': plain(at('great_flood/base/1'), 'none'),
  'Those who profited from the redrawing': plain(at('great_flood/base/2'), 'none'),
  'Households on the low ground': plain(at('great_flood/unanchored/0'), 'none'),
  'Landowners on the high ground': plain(at('great_flood/unanchored/1'), 'none'),
  'Those who say the water will never come': plain(at('great_flood/unanchored/2'), 'none'),
  // heresy_trial
  'The accusers': plain(at('heresy_trial/base/0', 'heresy_trial/unanchored/0'), 'none'),
  'The accused and their sympathizers': plain(at('heresy_trial/base/1', 'heresy_trial/unanchored/1'), 'none'),
  'Authorities exploiting the rift': named(plain(at('heresy_trial/base/2'), 'ruler'), '{power}, exploiting the rift'),
  'Those in authority who would exploit the rift': named(plain(at('heresy_trial/unanchored/2'), 'ruler'), '{power}, who would exploit the rift'),
  // pilgrimage_surge (needs a temple)
  'Temple beneficiaries': plain(at('pilgrimage_surge/base/0'), 'none'),
  'Overwhelmed old residents': plain(at('pilgrimage_surge/base/1'), 'none'),
  'Sceptics who doubt the miracle': plain(at('pilgrimage_surge/base/2', 'pilgrimage_surge/unanchored/2'), 'none'),
  'Those who would proclaim the miracle': plain(at('pilgrimage_surge/unanchored/0'), 'none'),
  'Residents who want no crowds of strangers': plain(at('pilgrimage_surge/unanchored/1'), 'none'),
  // popular_uprising
  'Former rebels': plain(at('popular_uprising/base/0'), 'none'),
  'The restored order': named(plain(at('popular_uprising/base/1'), 'ruler'), '{power}'),
  'Those who changed sides at the right moment': plain(at('popular_uprising/base/2'), 'none'),
  'Those pressing their demands': plain(at('popular_uprising/unanchored/0'), 'none'),
  'Those in charge, who will not give way': named(plain(at('popular_uprising/unanchored/1'), 'ruler'), '{power}, who will not give way'),
  'Those waiting to see which side wins': plain(at('popular_uprising/unanchored/2'), 'none'),
  // tyranny
  'Old loyalists': plain(at('tyranny/base/0'), 'none'),
  'Those who suffered under the regime': plain(at('tyranny/base/1'), 'none'),
  'Beneficiaries who kept their gains': plain(at('tyranny/base/2'), 'none'),
  'Those who want a strong hand': plain(at('tyranny/unanchored/0'), 'none'),
  'Those who fear a tyrant in the making': plain(at('tyranny/unanchored/1'), 'none'),
  'Those who will serve whoever wins': plain(at('tyranny/unanchored/2'), 'none'),
  'Loyalist families': plain(at('tyranny/dated/0'), 'none'),
  'Families the regime wronged': plain(at('tyranny/dated/1'), 'none'),
  "Families who kept the regime's gains": plain(at('tyranny/dated/2'), 'none'),
  // wild_magic
  'The changed and their descendants': plain(at('wild_magic/base/0'), 'none'),
  'Those who fear them': plain(at('wild_magic/base/1', 'wild_magic/unanchored/1'), 'none'),
  'Scholars studying the residue': plain(at('wild_magic/base/2'), 'none'),
  'Those touched by the flares': plain(at('wild_magic/unanchored/0'), 'none'),
  'Those who would study the flares': plain(at('wild_magic/unanchored/2'), 'none'),
  // legitimacy_crisis
  'The sitting authority': named(plain(at('legitimacy_crisis/base/0'), 'ruler'), '{power}'),
  'Those who deny its mandate': plain(at('legitimacy_crisis/base/1'), 'none'),
  'Pragmatists who want any stable answer': plain(at('legitimacy_crisis/base/2'), 'none'),
  // demographic_pressure
  'Established residents': plain(at('demographic_pressure/base/0'), 'none'),
  'The newly arrived or departing': plain(at('demographic_pressure/base/1'), 'none'),
  'Those profiting from the churn': plain(at('demographic_pressure/base/2'), 'none'),
  // trade_dispute (needs a market)
  'Merchants tied to the old partner': plain(at('trade_dispute/base/0'), 'none'),
  'Those who want new partners': plain(at('trade_dispute/base/1', 'trade_dispute/unanchored/1'), 'none'),
  'Authorities caught between them': named(plain(at('trade_dispute/base/2', 'trade_dispute/unanchored/2'), 'ruler'), '{power}, caught between them'),
  'Merchants who trade with the partner': plain(at('trade_dispute/unanchored/0'), 'none'),

  // ── the fixed words the generator writes in a template's place (historyGenerator.js :: buildHistoricalEvent) ──
  // `crimeFaction || 'the criminal network'`: written where the roster holds no criminal power, so rule 2 always shows
  // the slot row's unnamed words ("Lawbreakers"); this row's own `without` is the same (the S7 follow-up's change 5).
  'the criminal network': standing(presuming(at('crime_wave/base/2', 'crime_wave/unanchored/2'), 'criminal power', ['organised crime'], 'Lawbreakers'), ['Criminal organisations']),
  // `merchantRef`'s fallback, which `Power behind throne` also takes where the roster holds no second power. At the
  // divide's place the slot row's `without` is read first ("Those growing richer"), so this row's own is read only at
  // the succession's, whose slot row carries none (rule 3: no merchant power, or no market).
  'the merchant class': standing(presuming(at('economic_disparity/base/0', 'succession_crisis/base/2'), 'merchant power', ['market'], 'those who pull the strings'), ['Wealthy merchants', 'Power behind throne']),
  // `relFaction || 'the orthodox clergy'`: written where the roster holds no religious power.
  'the orthodox clergy': standing(presuming(at('religious_tension/base/0'), 'faith power', ['clergy'], 'the orthodox faithful'), ['Orthodox believers']),
  // `forceParty`: the force the record holds, each written only where it stands; `Local enforcement` where none does.
  // At this slot the party meant is the force that keeps order (`watch`), whichever house it is: the garrison too, so
  // rule 3 never asks the roster for a military power the fallback was written for want of.
  'The garrison': standing(plain(at('crime_wave/base/0', 'crime_wave/unanchored/0'), 'watch'), ['Official guards']),
  'The watch': standing(plain(at('crime_wave/base/0', 'crime_wave/unanchored/0'), 'watch'), ['Official guards']),
  'The militia': standing(plain(at('crime_wave/base/0', 'crime_wave/unanchored/0'), 'watch'), ['Official guards']),
  'Local enforcement': standing(presuming(at('crime_wave/base/0', 'crime_wave/unanchored/0'), 'watch', ['force: kept'], 'Those in charge'), ['Official guards']),
  // `govFaction`'s fallback: written where the roster marks no governing power.
  'the governing authority': standing(plain(at('succession_crisis/base/0', 'corruption_scandal/base/0'), 'ruler'), ['Legitimate heir', 'Corrupt officials']),
});

/**
 * THE TABLE BY SLOT (the chair's addition): `[kind][form][slot]` → the key of the template row at that place. Built from
 * the rows' own `at`; a fixed generator side is reached through the template words it stands for, never indexed itself.
 * @type {Readonly<Record<string, Readonly<Record<string, Readonly<Record<number, string>>>>>>}
 */
export const TENSION_SIDE_BY_SLOT = (() => {
  /** @type {Record<string, Record<string, Record<number, string>>>} */
  const index = {};
  for (const [words, row] of Object.entries(TENSION_SIDE_MEANINGS)) {
    if (row.standsFor) continue;
    for (const p of row.at) {
      const forms = (index[p.kind] ??= {});
      const slots = (forms[p.form] ??= {});
      if (slots[p.slot] !== undefined) throw new Error(`tensionSideMeanings: two rows at ${p.kind}/${p.form}/${p.slot}`);
      slots[p.slot] = words;
    }
  }
  return Object.freeze(Object.fromEntries(Object.entries(index).map(([kind, forms]) => [kind, Object.freeze(
    Object.fromEntries(Object.entries(forms).map(([form, slots]) => [form, Object.freeze(slots)])),
  )])));
})();

/**
 * The table as plain text for the chair, one line a row: places · today's words · means · presumes · without · named. The
 * committed copy (`docs/chair/2026-11-20/content/page/S7-TABLE.txt`) is these lines, so the two cannot differ.
 * @returns {string[]}
 */
export const TENSION_SIDE_TABLE_LINES = () => Object.entries(TENSION_SIDE_MEANINGS).map(([words, r]) => [
  r.at.map((p) => `${p.kind}/${p.form}/${p.slot}`).join(', '),
  JSON.stringify(words) + (r.standsFor ? ` (generator, for ${r.standsFor.map((t) => JSON.stringify(t)).join(' / ')})` : ''),
  r.means,
  r.presumes.length ? r.presumes.join(', ') : '-',
  r.without === undefined ? '-' : r.without === null ? 'null (drop the side)' : JSON.stringify(r.without),
  r.named === undefined ? '-' : JSON.stringify(r.named),
].join(' · '));
