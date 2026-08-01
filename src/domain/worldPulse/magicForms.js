/**
 * domain/worldPulse/magicForms.js — W-K slice K2: THE FORMS LADDER and THE TWO-SIDED
 * BAND (binding law docs/DESIGN_MAGIC_ECONOMY.md §3a, §3b, §4, §12; constitutional
 * laws 2 PRESENCE IS MAGIC-GATED EXPLOITATION ECONOMY-GATED, 7 FINITE SEMANTICS).
 *
 * magicRegimeModel.js owns the economy axis and THE ONE GATE. This file owns the
 * other axis and the place the two meet: what shapes magic actually takes in a
 * settlement, and which of them the world's magic guarantees versus which the
 * treasury permits.
 *
 * ── THE LADDER IS GRADUATED FROM THE CATALOG, NOT INVENTED OVER IT ──────────
 * §2 is explicit that the institution catalog ALREADY speaks this design in prose,
 * and that W-K's job is to graduate those words into bands. Every rung below names
 * the authored entries that realize it and the tier the catalog authors them at, so
 * the ladder is a reading of existing content rather than a second content system:
 *
 *   practitioner  hamlet   'Traveling hedge wizard' ("Occasional visits. 1st level
 *                 village  spells only."), 'Hedge wizard' ("Low-level resident
 *                          caster."). One person, no institution worth the name.
 *   circle        village  'Druid Circle', and at town 'Elder Grove Council' and
 *                 town     'Teleportation circle' ("Rare permanent circle. EXTREMELY
 *                          EXPENSIVE to construct and maintain. Requires magical
 *                          expertise BEYOND TYPICAL TOWN RESOURCES") which is §2's
 *                          own example of the economy ceiling stated in prose.
 *   tower         town     "Wizard's tower" ("Individual wizard residence. 1,000+
 *                 city     population viable" — and town begins at 901, so the
 *                          catalog's own number IS this rung's tier floor).
 *   guild         city     "Mages' guild" ("Organization of magic users"),
 *                 metro    'Alchemist quarter' ("Guild organization"), and at
 *                          metropolis 'Academy of magic' and "Mages' district".
 *   foundry       city     'Golem workforce' ("Constructed servants if magic
 *                          permits"), 'Undead labor' ("Animated corpses WORKING"),
 *                          'Airship docking (high magic)', 'Message network (high
 *                          magic)', 'Dream parlors (high magic)'. Magic doing
 *                          LABOUR and priced per station: the catalog authored the
 *                          industrial rung before the design named it.
 *
 * NO CATALOG ENTRY IS ADDED, RENAMED OR RE-WEIGHTED HERE. This file only reads. That
 * is the golden law made structural: a band is a derivation over the roster, so a
 * dark or a lit world draws exactly the same institutions.
 *
 * ── THE PRACTITIONER RUNG IS A PERSON (§3b) ─────────────────────────────────
 * "The practitioner rung is A TIED ROSTER CHARACTER as much as an institution row."
 * That is not decoration, and the thorp proves it: the catalog authors NO Magic
 * category at thorp at all, so a thorp's magic cannot be a building. It is somebody.
 * `heldMagicForms` therefore counts the practitioner rung as held when EITHER a
 * practitioner-class institution stands OR a tied practitioner character lives there,
 * and magicFormsPractitioner.js owns the tie. The thorp's whole magic is someone you
 * can lose, and the consequence economy can reach them.
 *
 * ── THE TWO-SIDED BAND (§3a) ────────────────────────────────────────────────
 * `AVAILABLE FORMS = [ floor(tier x magic), ceiling(economy regime) ]`, and both ends
 * are real:
 *
 *   THE FLOOR is what the world's magic PUTS THERE, and it is ECONOMY-BLIND. That is
 *      law 2's presence half, and it is the amendment's own claim made falsifiable:
 *      `magicFormFloor` does not take a regime, a gate or an economy reading, so the
 *      presence-independence pin is a statement about this function's SIGNATURE
 *      before it is a statement about its output.
 *   THE CEILING is what the treasury SUSTAINS, and it is MAGIC-BLIND. That is law 2's
 *      exploitation half; `magicFormCeiling` takes a regime and nothing else.
 *   THE TIER CAPS what the ceiling can add, because a thorp with a full treasury is
 *      still a thorp. Without this the two design sentences contradict: money alone
 *      would buy a foundry in a hamlet.
 *
 *   availableTop = max( floor , min( ceiling , tierCap ) )
 *
 * The floor is a GUARANTEE the economy cannot take away and the ceiling only ever
 * ADDS above it, which is exactly why a high-magic metropolis with a weak treasury
 * "holds circles but no foundry" while a thorp "holds one practitioner however
 * magical the wood". Both design sentences are pinned as literal test cases.
 *
 * A RICH LOW-MAGIC TOWN AND A POOR HIGH-MAGIC ONE THEREFORE HOLD DIFFERENT SETS, and
 * neither set is a prefix of the other by accident: the first is short because its
 * floor is low, the second because its ceiling is. The skyline is a DIAGNOSIS (§3a).
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation, no store.
 *
 * The two-sided band (§3a) is not enforced by a file of its own: its pins live in the
 * `THE TWO-SIDED BAND (§3a)` / `PRESENCE-INDEPENDENCE` / `EXPLOITATION ORDERING (§12)`
 * blocks of magicForms.test.js, and the practitioner rung — the one rung a settlement
 * can hold with no institution at all — is enforced next door in the practitioner suite.
 *
 * @enforced-by tests/domain/magicForms.test.js, tests/domain/magicFormsPractitioner.test.js
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { TIER_ORDER } from '../../data/constants.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { institutionHasTag, TAG } from '../../lib/entities.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { magicLedger } from '../magicLedger.js';
import { isShellInstitution } from './institutionStatusModel.js';
import {
  BASE_MAGIC_REGIME,
  MAGIC_REGIMES,
  magicExploitationGate,
  regimeRank,
} from './magicRegimeModel.js';

/**
 * THE CLOSED FORMS LADDER (§3b, law 7). Ordered from the bottom rung up; the index in
 * this array IS the rung, and every comparison goes through `formRank`.
 * @type {ReadonlyArray<string>}
 */
export const MAGIC_FORMS = Object.freeze([
  'practitioner', 'circle', 'tower', 'guild', 'foundry',
]);

export const FORM_PRACTITIONER = 'practitioner';
export const FORM_CIRCLE = 'circle';
export const FORM_TOWER = 'tower';
export const FORM_GUILD = 'guild';
export const FORM_FOUNDRY = 'foundry';

/**
 * A terse in-world label per rung, for receipts and headlines. Total over MAGIC_FORMS.
 * @type {Readonly<Record<string, string>>}
 */
export const MAGIC_FORM_LABELS = Object.freeze({
  practitioner: 'a practitioner',
  circle: 'a circle',
  tower: 'a tower',
  guild: 'a guild',
  foundry: 'a foundry',
});

/**
 * THE CATALOG GRADUATION (§2). The authored institution names that realize each rung,
 * lowercased for matching. Read-only over src/data/institutionalCatalog.js; nothing
 * here is authored, renamed or re-weighted.
 *
 * A settlement's roster row is classified by EXACT authored name first (this table)
 * and by pattern second (MAGIC_FORM_PATTERNS), so a custom or renamed row still lands
 * on a rung rather than falling out of the ladder silently.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const MAGIC_FORM_CATALOG = Object.freeze({
  practitioner: Object.freeze([
    'traveling hedge wizard', 'hedge wizard', "enchanter's shop", 'alchemist shop',
  ]),
  circle: Object.freeze(['druid circle', 'elder grove council', 'teleportation circle', "warden's lodge"]),
  tower: Object.freeze(["wizard's tower"]),
  guild: Object.freeze([
    "mages' guild", 'alchemist quarter', 'academy of magic', "mages' district",
  ]),
  foundry: Object.freeze([
    'golem workforce', 'undead labor', 'airship docking (high magic)',
    'message network (high magic)', 'dream parlors (high magic)',
  ]),
});

/**
 * ⚠⚠ THE ARCANE GATE, AND WHY IT IS NOT OPTIONAL.
 *
 * The pattern fallback below is a NAME matcher, and a name matcher over an
 * institution roster over-matches catastrophically: 'guild' catches the cobbler's
 * guild, the carriers' guild and the thieves' guild; 'council' catches the town
 * council; 'lodge' catches the hunter's lodge. MEASURED, not feared: an ungated
 * version of this file classified 16 magic guilds and 13 magic circles into worlds
 * whose magic level was `none`, which would have made every pin in this slice
 * measure the mundane guild economy instead of magic.
 *
 * The cure is the catalog's own AUTHORED marker rather than a cleverer regex. Every
 * Magic-category entry carries the `arcane` tag ('Golem workforce' and 'Undead labor'
 * declare it bare; the shops and quarters declare it beside 'alchemy' or 'guild'),
 * and no mundane guild, council or lodge does. So a row must read ARCANE before any
 * rung question is asked of it.
 *
 * IT GOES THROUGH `institutionHasTag`, THE CANONICAL ACCESSOR, never a hand-rolled
 * `.tags.includes`. That buys three things the hand-rolled read would not: the
 * keyword BACKFILL (a renamed "Sorcerer's workshop" still reads arcane), the
 * custom-content rule (a materialized custom row reports NO tags, so the ladder does
 * not annex the owner's content), and one spelling shared with every other tag
 * consumer in the estate.
 */
const ARCANE_GATE_TAG = TAG.ARCANE;

/**
 * The pattern fallback, checked in ladder order from the TOP down so the most
 * specific rung wins: a "Grand Mages' Guild Tower" is a guild, not a tower.
 *
 * ONLY CONSULTED FOR A ROW THAT ALREADY PASSED THE ARCANE GATE, and only when the
 * exact-name table missed. The words are therefore chosen to separate rungs from each
 * other, not magic from mundanity: `guild` here means an arcane guild, because
 * nothing else reaches this list.
 *
 * The rung words are ORGANIZATION-SCALE words, which is what §3b's ladder grades: a
 * quarter or an academy is an institution, a shop is a person with a counter. That is
 * why `alchemist` and `enchanter` sit on the practitioner line and not the guild one.
 * @type {ReadonlyArray<{ form: string, pattern: RegExp }>}
 */
export const MAGIC_FORM_PATTERNS = Object.freeze([
  { form: FORM_FOUNDRY, pattern: /golem|undead labor|airship|message network|dream parlor|foundry|manufactor/i },
  { form: FORM_GUILD, pattern: /guild|academy|quarter|district|conclave|atheneum|college/i },
  { form: FORM_TOWER, pattern: /tower|sanctum|spire/i },
  { form: FORM_CIRCLE, pattern: /circle|grove|council|lodge|enclave/i },
  { form: FORM_PRACTITIONER, pattern: /wizard|witch|sorcer|mage|warlock|hedge|alchemist|enchanter|apothec/i },
]);

/**
 * TUNING (§11: "form availability bands"). Every entry is PROPOSED and soak-vetoable
 * per the R-15 shape.
 *
 * `tierCap` is the highest rung a settlement of each tier can hold AT ALL, and it is
 * read straight off the catalog's own authoring: the tier a rung's entries are
 * authored at is the tier that rung becomes possible at. thorp is the exception, and
 * a deliberate one: the catalog authors NO Magic category at thorp, so the thorp's
 * practitioner exists only as a tied character (§3b), which is precisely the design's
 * "a thorp holds one practitioner however magical the wood".
 *
 * `magicFloor` is how far up the ladder the world's MAGIC alone guarantees presence,
 * before any money is spent. It is deliberately short: magic without money staffs
 * bodies and rings of stones, never foundries. `high` reaching the circle rung is what
 * makes "a high-magic metropolis with a weak treasury holds circles" true.
 *
 * `regimeCeiling` is how far up the ladder the ECONOMY sustains. One rung per regime,
 * except that the top regime opens the last TWO: a guild is magic organizing itself
 * as a trade and a foundry is magic sold by the unit, and both mean the work has
 * begun paying for itself, which is what `industrial` names. The two-rung jump is
 * also what gives §9's industrialization stage a crossing worth announcing.
 *
 * `rungCapacity` is the output weight of a rung, and `baseYield` the share of it that
 * happens anyway when nobody is paying: an unpaid hedge wizard still sets bones.
 */
export const MAGIC_FORMS_TUNING = Object.freeze({
  tierCap: Object.freeze({
    thorp: FORM_PRACTITIONER,
    hamlet: FORM_PRACTITIONER,
    village: FORM_CIRCLE,
    town: FORM_TOWER,
    city: FORM_FOUNDRY,
    metropolis: FORM_FOUNDRY,
  }),
  magicFloor: Object.freeze({
    none: null,
    low: FORM_PRACTITIONER,
    medium: FORM_PRACTITIONER,
    high: FORM_CIRCLE,
  }),
  regimeCeiling: Object.freeze({
    subsistence: FORM_PRACTITIONER,
    funded: FORM_CIRCLE,
    patronized: FORM_TOWER,
    industrial: FORM_FOUNDRY,
  }),
  rungCapacity: Object.freeze({
    practitioner: 0.1,
    circle: 0.25,
    tower: 0.45,
    guild: 0.7,
    foundry: 1,
  }),
  baseYield: 0.2,
});

/**
 * @typedef {Object} MagicFormsBand
 * The two-sided band for one settlement, with BOTH ENDS reported rather than only
 * their resolution, so a surface can say why a skyline is short: a low floor is a
 * quiet world, a low ceiling is a poor one, and those are different diagnoses.
 * @property {ReadonlyArray<string>} available  the rungs in ladder order, possibly empty
 * @property {string|null} floor    the rung magic alone guarantees, null in a magicless world
 * @property {string|null} ceiling  the rung the economy sustains, capped by tier
 * @property {string|null} top      the highest available rung
 * @property {string} tierCap       the highest rung this tier can hold at all
 * @property {boolean} magicExists
 * @property {string} magicLevel    the canonical band from magicLedger
 */

/** @param {unknown} value @returns {string} */
const text = (value) => String(value == null ? '' : value).trim().toLowerCase();

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/**
 * The rung index of a form, or -1 for anything outside the closed ladder. Unlike
 * `regimeRank`, an unknown form answers -1 rather than the floor, because a form is
 * a CLASSIFICATION of a roster row and "I could not classify this" must not be
 * indistinguishable from "this is a hedge wizard".
 *
 * @param {string|null|undefined} form
 * @returns {number}
 */
export function formRank(form) {
  return MAGIC_FORMS.indexOf(String(form));
}

/**
 * The settlement's tier, folded to a member of TIER_ORDER. An unknown tier answers
 * 'village', which is what the institution lifecycle's own `settlementTier` does, so
 * a malformed row is graded the same way in both lanes.
 *
 * @param {{ tier?: unknown }|null|undefined} settlement
 * @returns {string}
 */
export function magicFormsTier(settlement) {
  const tier = text(asRecord(settlement).tier);
  return TIER_ORDER.includes(tier) ? tier : 'village';
}

/**
 * CLASSIFY ONE ROSTER ROW onto the ladder, or null when it is not a magic form at
 * all. THE ARCANE GATE FIRST, then exact authored name, then pattern top rung down.
 *
 * Reads through `nativeSemanticName`, so a MATERIALIZED CUSTOM institution answers
 * the empty string and is classified null: custom content is the owner's, and the
 * ladder does not silently annex it. `institutionHasTag` refuses custom rows for the
 * same reason, so the two guards agree.
 *
 * @param {unknown} institution
 * @returns {string|null}
 */
export function classifyMagicForm(institution) {
  const name = text(nativeSemanticName(institution));
  if (!name) return null;
  // THE ARCANE GATE. A row that does not read arcane is not on this ladder at any
  // rung, however guild-shaped or circle-shaped its name is. See ARCANE_GATE_TAG.
  if (!institutionHasTag(institution, ARCANE_GATE_TAG)) return null;
  for (const form of MAGIC_FORMS) {
    if (MAGIC_FORM_CATALOG[form].includes(name)) return form;
  }
  for (const { form, pattern } of MAGIC_FORM_PATTERNS) {
    if (pattern.test(name)) return form;
  }
  return null;
}

/**
 * THE LIVE magic-form rows of a settlement, each with the rung it realizes.
 *
 * Goes through `liveInstitutions` (the census law): a calamity-ruined tower confers
 * no form, exactly as it confers no magic capability in magicProfile.js.
 *
 * A SHELL IS EXCLUDED TOO, and the reason is worth stating because it is not
 * obvious. `isLiveInstitution` counts 'remnant' as inactive, and a shell IS a
 * remnant. That is the right answer for this function: a shelled foundry produces
 * nothing, so it is not part of the WORKING skyline, and it must not be re-closed by
 * the demotion path either. The shell's memory is read by `shelledMagicForms` below,
 * which is the one reader in this lane that deliberately looks past the ruin filter.
 *
 * @param {{ institutions?: unknown }|null|undefined} settlement
 * @returns {Array<{ institution: Record<string, unknown>, form: string, rank: number }>}
 */
export function magicFormInstitutions(settlement) {
  /** @type {Array<{ institution: Record<string, unknown>, form: string, rank: number }>} */
  const out = [];
  for (const raw of liveInstitutions(settlement)) {
    const form = classifyMagicForm(raw);
    if (!form) continue;
    out.push({ institution: asRecord(raw), form, rank: formRank(form) });
  }
  return out;
}

/**
 * THE SHELLED magic-form rows of a settlement: intact, closed, and remembered.
 *
 * ⚠ THIS IS THE ONE READER IN THIS LANE THAT LOOKS PAST THE RUIN FILTER, and the
 * census law asks for the reason in source, so here it is. `liveInstitutions` counts
 * 'remnant' as inactive, which is correct for every FUNCTIONAL aggregation. But law 6
 * (INFRASTRUCTURE REMEMBERS) is precisely the claim that a closed foundry is still
 * THERE, and a recovery has to be able to find it to warm-start it. A reader that
 * respected the ruin filter here would make the shell unreachable and turn every
 * warm start into a cold rebuild, which is the exact defect §3c names.
 *
 * The predicate is K1's `isShellInstitution`, not a second spelling of it, so a ruin
 * (which also carries `_worldPulseEconomyClosed`) and a moral abolition are both
 * excluded here by the layer that owns that distinction.
 *
 * @param {{ institutions?: unknown }|null|undefined} settlement
 * @returns {Array<{ institution: Record<string, unknown>, form: string, rank: number }>}
 */
export function shelledMagicForms(settlement) {
  /** @type {Array<{ institution: Record<string, unknown>, form: string, rank: number }>} */
  const out = [];
  const roster = Array.isArray(asRecord(settlement).institutions)
    ? /** @type {ReadonlyArray<unknown>} */ (asRecord(settlement).institutions)
    : [];
  for (const raw of roster) {
    if (!isShellInstitution(/** @type {{ status?: unknown }} */ (raw))) continue;
    const form = classifyMagicForm(raw);
    if (!form) continue;
    out.push({ institution: asRecord(raw), form, rank: formRank(form) });
  }
  return out;
}

/**
 * THE FLOOR: the highest rung the world's MAGIC guarantees, before any money.
 *
 * TAKES NO ECONOMY ARGUMENT, AND THAT IS THE POINT (law 2). The presence-independence
 * claim is enforced by this signature: there is no regime to read, so no future edit
 * can make presence quietly economy-dependent without changing the call sites and
 * reding the pin.
 *
 * Answers null in a magicless world: the economy cannot conjure a practitioner where
 * magic does not function, which is the other half of law 2.
 *
 * @param {{ tier?: unknown, config?: unknown }|null|undefined} settlement
 * @returns {string|null}
 */
export function magicFormFloor(settlement) {
  const ledger = magicLedger(/** @type {{ config?: { magicLevel?: string, priorityMagic?: number, magicExists?: boolean }|null }} */ (
    asRecord(settlement)
  ));
  if (!ledger.magicExists) return null;
  const guaranteed = MAGIC_FORMS_TUNING.magicFloor[
    /** @type {keyof typeof MAGIC_FORMS_TUNING.magicFloor} */ (ledger.magicLevel)
  ];
  if (!guaranteed) return null;
  const cap = MAGIC_FORMS_TUNING.tierCap[
    /** @type {keyof typeof MAGIC_FORMS_TUNING.tierCap} */ (magicFormsTier(settlement))
  ];
  // The tier caps the guarantee, which is what keeps "a thorp holds one practitioner
  // however magical the wood" true against a pervasively magical wood.
  return MAGIC_FORMS[Math.min(formRank(guaranteed), formRank(cap))];
}

/**
 * THE CEILING: the highest rung the ECONOMY REGIME sustains.
 *
 * TAKES NO MAGIC ARGUMENT, AND THAT IS THE POINT (law 2). The exploitation half of
 * the split is likewise enforced by the signature.
 *
 * @param {string} regime  a member of MAGIC_REGIMES
 * @returns {string}
 */
export function magicFormCeiling(regime) {
  const word = MAGIC_REGIMES.includes(String(regime)) ? String(regime) : BASE_MAGIC_REGIME;
  return MAGIC_FORMS_TUNING.regimeCeiling[
    /** @type {keyof typeof MAGIC_FORMS_TUNING.regimeCeiling} */ (word)
  ];
}

/**
 * ⭐ THE TWO-SIDED BAND (§3a). `availableTop = max(floor, min(ceiling, tierCap))`.
 *
 * @param {{ settlement?: { tier?: unknown, config?: unknown }|null, regime?: string }} input
 * @returns {MagicFormsBand}
 */
export function availableMagicForms({ settlement = null, regime = BASE_MAGIC_REGIME } = {}) {
  const tier = magicFormsTier(settlement);
  const tierCap = MAGIC_FORMS_TUNING.tierCap[
    /** @type {keyof typeof MAGIC_FORMS_TUNING.tierCap} */ (tier)
  ];
  const ledger = magicLedger(/** @type {{ config?: { magicLevel?: string, priorityMagic?: number, magicExists?: boolean }|null }} */ (
    asRecord(settlement)
  ));
  const floor = magicFormFloor(settlement);

  // PRESENCE IS MAGIC-GATED: with no magic there is no band at all, however rich the
  // treasury. A null floor is the magicless world, and the economy never overrides it.
  if (floor == null) {
    return Object.freeze({
      available: Object.freeze([]),
      floor: null,
      ceiling: null,
      top: null,
      tierCap,
      magicExists: ledger.magicExists,
      magicLevel: ledger.magicLevel,
    });
  }

  const ceilingRank = Math.min(formRank(magicFormCeiling(regime)), formRank(tierCap));
  const topRank = clamp(
    Math.max(formRank(floor), ceilingRank), 0, MAGIC_FORMS.length - 1,
  );
  return Object.freeze({
    available: Object.freeze(MAGIC_FORMS.slice(0, topRank + 1)),
    floor,
    ceiling: MAGIC_FORMS[Math.max(0, ceilingRank)],
    top: MAGIC_FORMS[topRank],
    tierCap,
    magicExists: ledger.magicExists,
    magicLevel: ledger.magicLevel,
  });
}

/**
 * THE OUTPUT SCALE (§4's first consumer of the one gate): how much a settlement's
 * magic actually contributes, 0..1.
 *
 * READS THE ONE GATE AND NOTHING ELSE ECONOMIC. There is no second economy term here;
 * the whole economic content of this number arrives through `magicExploitationGate`,
 * which is what law 3 requires of a consumer.
 *
 * MONOTONE IN THE GATE BY CONSTRUCTION: the rung capacity is fixed by the band and the
 * gate scales it between `baseYield` and 1. The unpaid share is why a poor high-magic
 * town still produces something: its practitioners work anyway, and that is the
 * difference between a subsistence regime and no magic at all.
 *
 * @param {{ band?: MagicFormsBand|null, regime?: string, economy01?: number }} input
 * @returns {number} 0..1
 */
export function magicOutputScale({ band = null, regime = BASE_MAGIC_REGIME, economy01 = 0 } = {}) {
  if (!band || band.top == null) return 0;
  const capacity = MAGIC_FORMS_TUNING.rungCapacity[
    /** @type {keyof typeof MAGIC_FORMS_TUNING.rungCapacity} */ (band.top)
  ] || 0;
  const gate01 = magicExploitationGate({ regime, economy01 });
  const { baseYield } = MAGIC_FORMS_TUNING;
  return clamp01(capacity * (baseYield + (1 - baseYield) * gate01));
}

/**
 * THE ROWS A DEMOTION MUST CLOSE (§3c's shell path, law 6). Every live magic-form row
 * whose rung sits ABOVE the settlement's available top: the foundry a fallen city can
 * no longer run.
 *
 * Returns the rows, never a mutation. The caller folds the close, because the estate
 * has exactly ONE spelling of "closed for want of money" and this file is not it.
 *
 * @param {{ settlement?: { institutions?: unknown }|null, band?: MagicFormsBand|null }} input
 * @returns {Array<{ institution: Record<string, unknown>, form: string, rank: number }>}
 */
export function magicFormsAboveCeiling({ settlement = null, band = null }) {
  if (!band) return [];
  const topRank = band.top == null ? -1 : formRank(band.top);
  return magicFormInstitutions(settlement).filter((entry) => entry.rank > topRank);
}

/**
 * The rungs a settlement's LIVE roster actually realizes, in ladder order. The
 * skyline as read rather than as permitted, which is the other half of the diagnosis:
 * a band with room the roster never filled is a different story from a band that is
 * full to its ceiling.
 *
 * `tiedPractitioner` lets the caller report the practitioner rung as held by a PERSON
 * rather than a building (§3b), which is the only way a thorp can hold any rung at
 * all: the catalog authors no Magic category at thorp.
 *
 * @param {{ settlement?: { institutions?: unknown }|null, tiedPractitioner?: boolean }} input
 * @returns {ReadonlyArray<string>}
 */
export function heldMagicForms({ settlement = null, tiedPractitioner = false }) {
  /** @type {Set<string>} */
  const held = new Set(magicFormInstitutions(settlement).map((entry) => entry.form));
  if (tiedPractitioner) held.add(FORM_PRACTITIONER);
  return Object.freeze(MAGIC_FORMS.filter((form) => held.has(form)));
}

/**
 * Compare two bands and report what OPENED and what CLOSED between them, in ladder
 * order. The material half of a crossing receipt (§3a: every crossing is a Herald
 * event with material receipts) stated as forms rather than as numbers.
 *
 * @param {MagicFormsBand|null|undefined} before
 * @param {MagicFormsBand|null|undefined} after
 * @returns {{ opened: ReadonlyArray<string>, closed: ReadonlyArray<string> }}
 */
export function magicFormsDelta(before, after) {
  const priorTop = before?.top == null ? -1 : formRank(before.top);
  const nextTop = after?.top == null ? -1 : formRank(after.top);
  if (nextTop > priorTop) {
    return {
      opened: Object.freeze(MAGIC_FORMS.slice(priorTop + 1, nextTop + 1)),
      closed: Object.freeze([]),
    };
  }
  if (nextTop < priorTop) {
    return {
      opened: Object.freeze([]),
      closed: Object.freeze(MAGIC_FORMS.slice(nextTop + 1, priorTop + 1)),
    };
  }
  return { opened: Object.freeze([]), closed: Object.freeze([]) };
}

/** Re-exported so a consumer reads one ladder ordering, never its own. */
export { regimeRank };
