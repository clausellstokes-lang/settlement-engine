/**
 * domain/worldPulse/magicFormsPractitioner.js — W-K slice K2: THE PRACTITIONER RUNG
 * AS A TIED ROSTER CHARACTER (binding law docs/DESIGN_MAGIC_ECONOMY.md §3b; companion
 * DESIGN_NPC_CONSEQUENCES.md, "the practitioner is a person").
 *
 * §3b: "The practitioner rung is A TIED ROSTER CHARACTER as much as an institution
 * row (structural-NPC pattern): the hedge wizard has a name, facets, and full
 * reachability by the consequence economy: the thorp's whole magic is someone you can
 * lose."
 *
 * ── WHY THIS RUNG AND NO OTHER ──────────────────────────────────────────────
 * A circle is a group, a tower is a building, a guild is an institution, a foundry is
 * a works. Only the bottom rung is small enough that the institution and the person
 * are the same object, and the catalog says so in its own prose: 'Traveling hedge
 * wizard' is "Occasional visits" and 'Hedge wizard' is a "Low-level resident caster".
 * Those are descriptions of a PERSON that happen to occupy an institution slot.
 *
 * THE THORP IS THE PROOF. institutionalCatalog authors NO Magic category at thorp at
 * all. So the design's "a thorp holds one practitioner however magical the wood"
 * cannot be satisfied by a building under any generation outcome, and the only
 * reading that makes the sentence true is the one §3b states: at this rung the form
 * IS the character. magicForms.heldMagicForms therefore accepts a tied practitioner
 * as realizing the rung with no institution row behind it.
 *
 * ── THE TIE IS THE ESTATE'S EXISTING ONE ────────────────────────────────────
 * `linkedInstitutionIds` is the structural-NPC link every pipeline NPC already
 * carries and the impairment engine already reads (entities/npcs.js), and the
 * importance tier is `key` for the reason that file states in its own tier rules:
 * "solo role-holders in their institution : key". Nothing new is invented; a tied
 * practitioner is an ordinary structural NPC that this lane knows how to find.
 *
 * BECAUSE IT IS ORDINARY, THE CONSEQUENCE ECONOMY REACHES IT FOR FREE. W-H can
 * corrupt, expose, banish or kill this person through the paths it already owns, and
 * `practitionerLoss` is the read that turns that into a magic-side fact: the rung
 * stops being held, and a thorp whose only practitioner died has no magic at all.
 *
 * ── NO MINT AT GENERATION TIME, DELIBERATELY ────────────────────────────────
 * Everything here is a PURE derivation plus a pure fold the caller applies. This
 * file does not run in the generator and does not draw. That is the golden law made
 * structural: a lit world and a dark world generate identically, because generation
 * never calls this at all. `mintTiedPractitioner` takes the name as an argument (with
 * a deterministic fallback) rather than drawing one, so the leaf stays free of the
 * RNG entirely and a seeded fork belongs to whichever slice wires it.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no mutation of inputs.
 *
 * @enforced-by tests/domain/magicFormsPractitioner.test.js
 */

import { createNpc } from '../entities/npcs.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { stablePart } from './stablePart.js';
import { classifyMagicForm, FORM_PRACTITIONER, magicFormInstitutions } from './magicForms.js';

/**
 * The role string a tied practitioner carries. Matches the catalog's own authored
 * name so a surface listing the roster and a surface listing the skyline use one
 * word, and so `inferImportance` (entities/npcs.js) reads it the same way it reads
 * every other authored magic role.
 * @type {string}
 */
export const PRACTITIONER_ROLE = 'Hedge wizard';

/**
 * The provenance marker, in the `generatedAs` slot the estate already uses for
 * synthesized structural NPCs ('faction_structural'). A distinct value rather than a
 * reused one, so a census can tell a magic-lane practitioner from a faction seat
 * filler without guessing from the role string.
 * @type {string}
 */
export const PRACTITIONER_PROVENANCE = 'magic_practitioner';

/**
 * NPC statuses that mean the person is no longer available to hold the rung. Mirrors
 * entities/npcs.js's own successor-inference reading (dead / removed / exiled are
 * ineligible) and adds 'missing' and 'retired', because a practitioner who has
 * vanished or hung up their staff is equally not casting.
 */
const LOST_NPC_STATUS = new Set(['dead', 'removed', 'exiled', 'missing', 'retired']);

/** @param {unknown} value @returns {string} */
const text = (value) => String(value == null ? '' : value).trim().toLowerCase();

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {ReadonlyArray<unknown>} */
const asArray = (value) => (Array.isArray(value) ? value : []);

/**
 * @typedef {Object} PractitionerLike
 * The loosely-shaped roster person this leaf reads. Deliberately narrower than
 * entities/npcs.js's NpcStructural, because a save's NPC rows predate several of
 * those fields and every read here normalizes.
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {unknown} [role]
 * @property {unknown} [status]
 * @property {unknown} [linkedInstitutionIds]
 * @property {unknown} [generatedAs]
 */

/**
 * Does this person read as a magic practitioner? TWO WAYS, and both are needed.
 *
 *   BY TIE       they link to an institution the ladder classifies as a practitioner
 *                or a circle. The tie is the strong signal and it survives a rename.
 *   BY ROLE      their role classifies onto the practitioner rung. This is what
 *                catches the thorp's wizard, who has no institution to link to.
 *
 * A person minted by this lane is caught by both, which is why the mint is idempotent.
 *
 * @param {{ npc?: PractitionerLike, settlement?: { institutions?: unknown }|null }} input
 * @returns {boolean}
 */
export function isMagicPractitioner({ npc = {}, settlement = null }) {
  const person = asRecord(npc);
  if (text(person.generatedAs) === PRACTITIONER_PROVENANCE) return true;
  if (classifyMagicForm({ name: String(person.role || '') }) === FORM_PRACTITIONER) return true;

  const linked = new Set(asArray(person.linkedInstitutionIds).map((id) => String(id)));
  if (linked.size === 0) return false;
  for (const entry of magicFormInstitutions(settlement)) {
    const id = entry.institution.id;
    if (id != null && linked.has(String(id)) && entry.rank <= 1) return true;
  }
  return false;
}

/**
 * THE TIED PRACTITIONER a settlement currently holds, or null.
 *
 * Only a LIVING one counts: a dead or exiled practitioner is exactly the loss §3b
 * describes, and reporting them as held would make "someone you can lose" unlosable.
 * Deterministic: the roster is scanned in order and the first living match wins.
 *
 * @param {{ npcs?: unknown, institutions?: unknown }|null|undefined} settlement
 * @returns {Record<string, unknown>|null}
 */
export function tiedPractitionerOf(settlement) {
  for (const raw of asArray(asRecord(settlement).npcs)) {
    const npc = asRecord(raw);
    if (LOST_NPC_STATUS.has(text(npc.status))) continue;
    if (isMagicPractitioner({ npc, settlement })) return npc;
  }
  return null;
}

/**
 * THE LOSS READ (§3b, and the seam the consequence economy reaches this lane
 * through). True when the settlement HAD a practitioner and no longer has a living
 * one: the person is on the roster, and they are dead, exiled, missing, retired or
 * removed.
 *
 * Stated as "had one and lost them" rather than "has none", because those are
 * different worlds: a settlement that never had a practitioner is quiet, and a
 * settlement whose practitioner was killed is a story. A surface that could not tell
 * them apart would narrate the wrong one.
 *
 * @param {{ npcs?: unknown, institutions?: unknown }|null|undefined} settlement
 * @returns {{ lost: boolean, person: Record<string, unknown>|null, status: string }}
 */
export function practitionerLoss(settlement) {
  if (tiedPractitionerOf(settlement)) return { lost: false, person: null, status: '' };
  for (const raw of asArray(asRecord(settlement).npcs)) {
    const npc = asRecord(raw);
    const status = text(npc.status);
    if (!LOST_NPC_STATUS.has(status)) continue;
    if (isMagicPractitioner({ npc, settlement })) return { lost: true, person: npc, status };
  }
  return { lost: false, person: null, status: '' };
}

/**
 * The deterministic fallback name for a minted practitioner. Follows factionRoles'
 * `nameTemplateFor` idiom ("The <role>") rather than inventing a second placeholder
 * convention, and appends the settlement's stable slug so two settlements in one
 * realm do not both hold "The Hedge wizard".
 *
 * A CALLER WITH A SEEDED NAME DRAW SHOULD PASS ONE. This exists so the leaf can stay
 * RNG-free and still be total, not because a placeholder is the intended end state.
 *
 * @param {string|number} cid
 * @returns {string}
 */
export function defaultPractitionerName(cid) {
  const slug = stablePart(String(cid == null ? '' : cid));
  return slug ? `The ${PRACTITIONER_ROLE} of ${slug}` : `The ${PRACTITIONER_ROLE}`;
}

/**
 * MINT a tied practitioner. Pure: returns the row, writes nothing.
 *
 * Goes through `createNpc` (entities/npcs.js) so the row carries every structural
 * field the estate's consumers expect, with a deterministic id derived from the
 * supplied `_idSeed` rather than from a draw.
 *
 * `importance: 'key'` is entities/npcs.js's own rule for this shape, quoted in that
 * file's tier table: "solo role-holders in their institution : key". A key NPC's
 * removal IMPAIRS the linked entity, which is precisely the consequence §3b wants
 * reachable.
 *
 * @param {{ cid: string|number, name?: string, institutionId?: string|null }} input
 * @returns {Record<string, unknown>}
 */
export function mintTiedPractitioner({ cid, name = '', institutionId = null }) {
  const person = createNpc({
    name: String(name || defaultPractitionerName(cid)),
    role: PRACTITIONER_ROLE,
    importance: 'key',
    status: 'active',
    linkedInstitutionIds: institutionId ? [String(institutionId)] : [],
    _idSeed: `magicPractitioner:${String(cid)}`,
  });
  return { ...person, generatedAs: PRACTITIONER_PROVENANCE };
}

/**
 * FOLD a minted practitioner onto a settlement, IDEMPOTENTLY.
 *
 * Returns the SAME REFERENCE when the settlement already holds a living practitioner,
 * so a caller that runs this every advance writes nothing after the first, and a
 * lit-then-idle world stays byte-identical.
 *
 * DOES NOT RESURRECT. A settlement whose practitioner died gets a NEW person with a
 * new id, never the old row revived, because the consequence economy's verdict on the
 * old one is not this lane's to overturn.
 *
 * @param {{ settlement: { npcs?: unknown, institutions?: unknown }, cid: string|number, name?: string }} input
 * @returns {Record<string, unknown>}
 */
export function ensureTiedPractitioner({ settlement, cid, name = '' }) {
  const record = asRecord(settlement);
  if (tiedPractitionerOf(record)) return record;

  // Tie to a practitioner-class row when one stands, so the person and the building
  // are the same fact rather than two. A thorp has neither, and that is legal.
  const seat = magicFormInstitutions(record).find((entry) => entry.rank === 0);
  const institutionId = seat && seat.institution.id != null ? String(seat.institution.id) : null;
  const minted = mintTiedPractitioner({ cid, name, institutionId });
  return { ...record, npcs: [...asArray(record.npcs), minted] };
}

/**
 * The practitioner's display name, or the empty string. A tiny accessor so a receipt
 * never reaches into the row itself and cannot drift from `nativeSemanticName`'s
 * custom-content rule.
 *
 * @param {Record<string, unknown>|null|undefined} person
 * @returns {string}
 */
export function practitionerName(person) {
  return String(nativeSemanticName(person || {}) || '').trim();
}
