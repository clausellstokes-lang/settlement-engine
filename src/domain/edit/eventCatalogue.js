/**
 * domain/edit/eventCatalogue.js — THE EVENT CATALOGUE READER, AND THE PARTY'S HAND
 * (EM-E6, wave 3; design §16 "Events, predetermined or shaped by the party", §18, §19
 * ruling 2; the charter's wave-3 EM-E6 row).
 *
 * WHAT THIS IS. The one place a DECREE meets the two surfaces the simulation already
 * built for the same two ideas. A predetermined event is a decree with `when` drawn from
 * THE catalogue that exists, and an event the party shaped is the same decree with
 * `cause: 'party'` naming a kind from THE party vocabulary that exists. Design §19 ruling
 * 2 is one sentence long and it is this module's whole brief: bind to what is built,
 * never mint a second surface.
 *
 * ── THE TWO CATALOGUES, AND WHY NEITHER IS COPIED HERE ──────────────────────────────
 *
 * 1. THE EVENTS are `affordanceManifest.js`'s forty-one typed settlement events minus
 *    `NON_AUTHORABLE_EVENTS`, which is thirty-two (measured, not assumed). The manifest
 *    carries each verb's `family`, its `targetsFrom` roster and, for the nine it folds,
 *    the carrying verb the fold is legible through. A refusal here therefore NAMES the
 *    type it refused AND the verb that type folds into, both read off the manifest, so a
 *    DM who asks for a plague is told where a plague is actually authored rather than
 *    that plagues do not exist.
 *
 * 2. THE PARTY'S HAND is `PARTY_IMPACT_KINDS`: twelve kinds, each with the `targets` the
 *    DM must supply and the `defaultMagnitude` that stands when they supply none. A
 *    party-caused decree is converted to that catalogue's own action shape and applied
 *    through `applyPartyImpact`, which is the ONE write path: the same function the
 *    campaign's own party-action surface calls, so a decree and a direct party action
 *    reach the world through one door and cannot disagree about what the party did.
 *
 * NOT ONE WORD OF EITHER CATALOGUE IS SPELLED IN THIS FILE, and that is a walker arm
 * rather than a promise. `tests/lint/decreeCause.walker.test.js` parses this source and
 * reds if any string literal here is an event type or an impact kind. A second catalogue
 * is exactly the failure that arm exists for, and a copied catalogue is the shape it
 * takes: never a declared one, always a helpful literal somebody pasted.
 *
 * ── WHY THE CHRONICLE CLAUSES ARE DRAWN HERE ────────────────────────────────────────
 * The charter gives EM-E6 two files, the pools and this reader. The chronicle's own leaf
 * (`decreeProse.js`) belongs to EM-E2, so the two clauses this member adds are drawn
 * HERE, from EM-E6's two blocks of that corpus, in the very shape `decreeLineParts`
 * returns. THE SPLICE HAS LANDED (U5, on that leaf's own branch): `decreeLineParts` takes
 * `partyDeed` and `scheduledEvent` on its options bag and seats them between how the decree
 * stands and the warnings set aside — what the party already did, then what is set for a
 * turn still to come — re-proving each clause against the corpus before it joins the line,
 * so a clause nobody authored cannot ride in on this shape. The clauses are still drawn and
 * proven HERE, and the cause walker drives THIS reader for its reachability law so no
 * sentence of the new blocks can sit in the corpus unread.
 *
 * ⛔ THE VOCABULARY COMES FROM THE LEAF, THE PIPELINE FROM THE MODULE. `PARTY_IMPACT_KINDS`
 * is taken from `partyImpactKinds.js`, the dependency-free leaf that exists because
 * importing the vocabulary from `partyImpact.js` drags the whole apply pipeline with it
 * (a measured 152 kB, per that leaf's own docblock), while `applyPartyImpact` is taken
 * from the module that owns it. Two import sites for one family, on purpose: the
 * vocabulary bind survives the day the application half goes dynamic.
 *
 * ⛔ NO CLAMP ON `when`. The charter's `schedule-event` row says so in those words. This
 * reader holds a `when` to being a real tick and nothing further: a decree set for a turn
 * the campaign has already passed is a registry and guard question (design §2.7, where
 * guards suggest and never refuse), not a catalogue question, and clamping it here would
 * be this leaf quietly overruling the DM about their own calendar.
 *
 * PURE HEADLESS READER. No React, no store, no clock, no locale, no PRNG: the draw is
 * the prose kernel's seeded argmax (`createPRNG` site count 0). Dark at this wave by
 * having zero importers, which is stronger than a flag.
 *
 * @enforced-by tests/domain/decreeProse.test.js + tests/lint/decreeCause.walker.test.js
 */
import { AFFORDANCE_MANIFEST, NON_AUTHORABLE_EVENTS, VERB_FAMILIES } from '../events/affordanceManifest.js';
import { PARTY_IMPACT_KINDS } from '../worldPulse/partyImpactKinds.js';
import { applyPartyImpact } from '../worldPulse/partyImpact.js';
import {
  DECREE_EVENT_POOLS, DECREE_PARTY_DEED_POOLS,
} from '../display/stateProse/decreeProsePools.js';
import {
  drawVariant, eligibleVariants, fillSlots, stableVid,
} from '../display/stateProse/stateProseKernel.js';

/** @typedef {import('../display/stateProse/decreeProsePools.js').DecreeProseVariant} DecreeProseVariant */

/** The corpus blocks EM-E6 added, addressed the way the kernel keys its draw. */
const BLOCK_EVENT = 'DEC-EVENT';
const BLOCK_PARTY = 'DEC-PARTY';

/** The clause names, in the shape `decreeLineParts` returns its parts. */
const PART_EVENT = 'event';
const PART_PARTY = 'party-deed';

/** The cause a party-shaped decree speaks under (design §16's second hand). */
const CAUSE_PARTY = 'party';

/**
 * THE REFUSAL VOCABULARY, closed at three and deliberately WORDLESS. A refusal carries a
 * token and the names it refused; the sentence a DM reads is the surface's to draw, from
 * the manifest's own fold note or from the herald's pools, because a reason spelled here
 * would be prose no corpus governs (the free-text law of the cause walker).
 * @type {ReadonlyArray<string>}
 */
export const EVENT_REFUSALS = Object.freeze(['folded', 'unknown-type', 'when-missing']);

/** @param {unknown} value @returns {value is string} */
const isText = (value) => typeof value === 'string' && value.trim() !== '';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * ONE ROW OF THE EVENT CATALOGUE, as this reader needs it. `foldedInto` is the carrying
 * verb of the manifest's legible fold, and it is `null` exactly for the authorable rows.
 * @typedef {object} EventCatalogueRow
 * @property {string} type the manifest's own type word
 * @property {string} family the manifest's own family, which is a pool key of the corpus
 * @property {string|null} targetsFrom the roster the verb's target comes from, if any
 * @property {string|null} foldedInto the verb this one folds into, or null when authorable
 */

/**
 * ONE ROW OF THE PARTY VOCABULARY, as this reader needs it.
 * @typedef {object} PartyCauseSpec
 * @property {string} kind the impact kind's own word, which is a pool key of the corpus
 * @property {ReadonlyArray<string>} targets the fields the DM must supply for this kind
 * @property {number} defaultMagnitude the decisiveness that stands when none is given
 */

/**
 * ONE DRAWN CLAUSE, in `decreeLineParts`' own part shape so the later splice is a concat.
 * @typedef {object} DecreeCataloguePart
 * @property {string} part the clause name
 * @property {string} blockId the corpus block it was drawn from
 * @property {string} poolKey the pool inside that block
 * @property {number|null} vid the drawn variant's stable id
 * @property {string} angle the drawn variant's standpoint tag
 * @property {string} text the filled sentence
 */

/**
 * Read one manifest entry into this reader's own row, or nothing when the manifest holds
 * something it cannot type. NARROWED RATHER THAN CAST: the manifest's entries are the
 * events layer's declared open objects, and a reader that took them on trust would carry
 * that looseness into the registry (the any-cast floor on new domain lines is zero).
 * @param {string} type @param {unknown} entry @returns {EventCatalogueRow|null}
 */
function rowFrom(type, entry) {
  if (!isText(type) || !isPlainObject(entry)) return null;
  const family = entry.family;
  if (!isText(family)) return null;
  const fold = entry.foldedInto;
  const via = isPlainObject(fold) ? fold.via : undefined;
  const targets = entry.targetsFrom;
  /** @type {EventCatalogueRow} */
  const row = {
    type,
    family,
    targetsFrom: isText(targets) ? targets : null,
    foldedInto: isText(via) ? via : null,
  };
  return Object.freeze(row);
}

/**
 * Read one impact kind into this reader's own spec, or nothing when it carries neither of
 * the two things a decree needs from it.
 * @param {string} kind @param {unknown} spec @returns {PartyCauseSpec|null}
 */
function specFrom(kind, spec) {
  if (!isText(kind) || !isPlainObject(spec)) return null;
  const targets = spec.targets;
  const magnitude = spec.defaultMagnitude;
  if (!Array.isArray(targets)) return null;
  if (typeof magnitude !== 'number' || !Number.isFinite(magnitude)) return null;
  /** @type {PartyCauseSpec} */
  const row = {
    kind,
    targets: Object.freeze(targets.filter(isText)),
    defaultMagnitude: magnitude,
  };
  return Object.freeze(row);
}

/**
 * THE CATALOGUE, read once. A Map rather than an object because the keys are the
 * manifest's, not this module's, and a lookup by a word the DM supplied must not be able
 * to reach a prototype member.
 * @type {Map<string, EventCatalogueRow>}
 */
const CATALOGUE = new Map();
for (const [type, entry] of Object.entries(AFFORDANCE_MANIFEST)) {
  const row = rowFrom(type, entry);
  if (row) CATALOGUE.set(type, row);
}

/**
 * THE PARTY VOCABULARY, read once, in the same shape and for the same reason.
 * @type {Map<string, PartyCauseSpec>}
 */
const PARTY_CAUSES = new Map();
for (const [kind, spec] of Object.entries(PARTY_IMPACT_KINDS)) {
  const row = specFrom(kind, spec);
  if (row) PARTY_CAUSES.set(kind, row);
}

/**
 * EVERY EVENT A DECREE MAY SCHEDULE: the catalogue minus `NON_AUTHORABLE_EVENTS`, in the
 * manifest's own order. Derived on every read from the imported catalogue, so a verb that
 * arrives or folds moves this roster the same day and no list here can go stale.
 * @returns {ReadonlyArray<string>}
 */
export function authorableEventTypes() {
  return Object.freeze([...CATALOGUE.keys()].filter((type) => !NON_AUTHORABLE_EVENTS.has(type)));
}

/**
 * THE CATALOGUE'S OWN FAMILIES, which are also the pool keys of the chronicle's event
 * block. Handed on by derivation rather than re-spelled, for the one reason this whole
 * module exists.
 * @returns {ReadonlyArray<string>}
 */
export function eventFamilies() {
  return Object.freeze([...VERB_FAMILIES]);
}

/**
 * The catalogue row for one type, or `null` for a word the catalogue does not hold.
 * @param {unknown} type @returns {EventCatalogueRow|null}
 */
export function eventCatalogueRow(type) {
  if (!isText(type)) return null;
  return CATALOGUE.get(type) ?? null;
}

/**
 * The party vocabulary's spec for one kind, or `null` for a word it does not hold.
 * @param {unknown} kind @returns {PartyCauseSpec|null}
 */
export function partyCauseSpec(kind) {
  if (!isText(kind)) return null;
  return PARTY_CAUSES.get(kind) ?? null;
}

/**
 * THE STAGED EVENT, or the refusal that names what was refused.
 * @typedef {object} StagedEvent
 * @property {true} ok
 * @property {string} type the authorable event type
 * @property {string} family its family, which is the pool key the chronicle draws on
 * @property {string|null} targetsFrom the roster its target comes from, if any
 * @property {number} tick the turn the decree is set for
 */

/**
 * A REFUSAL, which always names the type it refused.
 * @typedef {object} RefusedEvent
 * @property {false} ok
 * @property {string} type the type as the caller spelled it
 * @property {string} refusal a member of `EVENT_REFUSALS`
 * @property {string|null} foldedInto the carrying verb, for a folded type; null otherwise
 */

/**
 * @param {string} type @param {string} refusal @param {string|null} foldedInto
 * @returns {RefusedEvent}
 */
function refuse(type, refusal, foldedInto) {
  /** @type {RefusedEvent} */
  const row = { ok: false, type, refusal, foldedInto };
  return Object.freeze(row);
}

/**
 * STAGE ONE PREDETERMINED EVENT (design §16). An authorable type with a real `when`
 * stages; a folded type is refused BY NAME and told which verb carries it; a word outside
 * the catalogue is refused by name with nothing to point at, because inventing a fold for
 * it would be this reader answering for a catalogue it does not own.
 *
 * ⛔ THE FOLD IS READ, NEVER RE-DECIDED. The nine folded types are exactly
 * `NON_AUTHORABLE_EVENTS`, and the carrying verb is the manifest's own fold note. This
 * reader re-derives neither: a tenth fold added upstream refuses here the same day.
 *
 * @param {unknown} type @param {unknown} when the decree's `when`, whose `tick` is read
 * @returns {StagedEvent|RefusedEvent}
 */
export function stageScheduledEvent(type, when) {
  const spelled = isText(type) ? type : '';
  const row = eventCatalogueRow(type);
  if (!row) return refuse(spelled, EVENT_REFUSALS[1], null);
  if (NON_AUTHORABLE_EVENTS.has(row.type)) return refuse(row.type, EVENT_REFUSALS[0], row.foldedInto);
  const tick = isPlainObject(when) ? when.tick : undefined;
  if (typeof tick !== 'number' || !Number.isFinite(tick)) return refuse(row.type, EVENT_REFUSALS[2], null);
  /** @type {StagedEvent} */
  const staged = { ok: true, type: row.type, family: row.family, targetsFrom: row.targetsFrom, tick };
  return Object.freeze(staged);
}

/**
 * THE PARTY ACTION a party-caused decree becomes, in `applyPartyImpact`'s own argument
 * shape, or `null` when the decree names no kind the vocabulary holds or omits a field
 * that kind's `targets` declares.
 *
 * ⛔ THE MAGNITUDE IS THE CATALOGUE'S, NOT A NUMBER CHOSEN HERE. A decree that states one
 * keeps it; a decree that states none takes `defaultMagnitude` off the kind. There is no
 * third source, and there is no tuning constant in this file to become one.
 *
 * @param {unknown} payload the decree op's payload: the kind, an optional magnitude and
 *   the fields that kind's `targets` names
 * @returns {Readonly<Record<string, unknown>>|null}
 */
export function partyActionFor(payload) {
  if (!isPlainObject(payload)) return null;
  const spec = partyCauseSpec(payload.kind);
  if (!spec) return null;
  /** @type {Record<string, unknown>} */
  const action = { kind: spec.kind };
  for (const field of spec.targets) {
    const value = payload[field];
    if (value === undefined || value === null) return null;
    action[field] = value;
  }
  const stated = payload.magnitude;
  action.magnitude = typeof stated === 'number' && Number.isFinite(stated)
    ? stated
    : spec.defaultMagnitude;
  const label = payload.label;
  if (isText(label)) action.label = label;
  return Object.freeze(action);
}

/**
 * APPLY A PARTY-CAUSED DECREE THROUGH THE ONE WRITE PATH (design §19 ruling 2). Returns
 * whatever `applyPartyImpact` returns, and `null` WITHOUT CALLING IT when the decree
 * names no kind the vocabulary holds: a decree the party vocabulary cannot type is a
 * decree that must not reach the world, and silence is how this estate says so.
 *
 * @param {object} [args]
 * @param {unknown} [args.campaign]
 * @param {ReadonlyArray<unknown>} [args.saves]
 * @param {unknown} [args.payload] the decree op's payload
 * @param {string|null} [args.now]
 * @returns {unknown}
 */
export function applyPartyDecree(args = {}) {
  const { campaign, saves = [], payload, now = null } = args;
  const action = partyActionFor(payload);
  if (!action) return null;
  return applyPartyImpact({ campaign, saves: [...saves], action, now });
}

/**
 * Draw ONE clause from one pool of EM-E6's blocks, or nothing at all. Mirrors the private
 * helper of `decreeProse.js` deliberately rather than reaching for it: that helper is not
 * exported, the leaf belongs to another member, and the two are held to ONE corpus by the
 * cause walker, which is a stronger join than a shared function would be.
 * @param {Readonly<Record<string, ReadonlyArray<DecreeProseVariant>>>} block
 * @param {string} part @param {string} blockId @param {string} poolKey @param {string} cause
 * @param {string} seed @param {string|undefined} audience @param {Record<string, unknown>} slots
 * @returns {DecreeCataloguePart|null}
 */
function drawClause(block, part, blockId, poolKey, cause, seed, audience, slots) {
  const pool = block[poolKey];
  if (!pool || pool.length === 0) return null;
  const spoken = pool.filter((variant) => variant.causes.includes(cause));
  const eligible = eligibleVariants(spoken, { slots, audience });
  const variant = drawVariant(eligible, blockId, poolKey, seed);
  if (!variant) return null;
  const text = fillSlots(variant.text, slots);
  if (text === null) return null;
  /** @type {DecreeCataloguePart} */
  const drawn = {
    part, blockId, poolKey, vid: stableVid(variant), angle: variant.angle || '', text,
  };
  return Object.freeze(drawn);
}

/**
 * The options the two clauses take. Every key is optional and an absent one is an absence
 * rather than a default with an opinion, exactly as `decreeChronicleLine`'s bag is.
 * @typedef {object} CatalogueClauseOptions
 * @property {string} [seed] the settlement seed; absent means canonical-at-zero
 * @property {string} [audience] the kernel's audience; an unknown one reads as the player's
 * @property {string} [cause] a decree line cause; the event clause speaks for both
 * @property {string} [settlement] the town's own name, for the one slotted variant
 */

/**
 * THE CLAUSE FOR A SCHEDULED EVENT, drawn on the FAMILY the catalogue gives its type.
 * Returns `null` for a type the catalogue refuses, which is the same silence the rest of
 * this corpus keeps about a fact it cannot type.
 * @param {unknown} type @param {CatalogueClauseOptions} [options]
 * @returns {DecreeCataloguePart|null}
 */
export function scheduledEventClause(type, options = {}) {
  const row = eventCatalogueRow(type);
  if (!row || NON_AUTHORABLE_EVENTS.has(row.type)) return null;
  /** @type {Record<string, unknown>} */
  const slots = {};
  if (isText(options.settlement)) slots.settlement = options.settlement;
  const cause = isText(options.cause) ? options.cause : '';
  const seed = isText(options.seed) ? options.seed : '';
  const audience = isText(options.audience) ? options.audience : undefined;
  return drawClause(DECREE_EVENT_POOLS, PART_EVENT, BLOCK_EVENT, row.family, cause, seed, audience, slots);
}

/**
 * THE CLAUSE FOR WHAT THE PARTY DID, drawn on the impact KIND. It speaks only under the
 * party's cause, because under the table's there is no deed to name (the block's own
 * docblock carries the argument, and the cause walker enforces it on the corpus).
 * @param {unknown} kind @param {CatalogueClauseOptions} [options]
 * @returns {DecreeCataloguePart|null}
 */
export function partyDeedClause(kind, options = {}) {
  const spec = partyCauseSpec(kind);
  if (!spec) return null;
  /** @type {Record<string, unknown>} */
  const slots = {};
  if (isText(options.settlement)) slots.settlement = options.settlement;
  const seed = isText(options.seed) ? options.seed : '';
  const audience = isText(options.audience) ? options.audience : undefined;
  return drawClause(DECREE_PARTY_DEED_POOLS, PART_PARTY, BLOCK_PARTY, spec.kind, CAUSE_PARTY, seed, audience, slots);
}
