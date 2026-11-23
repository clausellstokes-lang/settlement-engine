/**
 * domain/display/criminalVeilSwitch.js — "HIDE EVERYTHING CRIMINAL", the one switch of
 * "Curate for visitors" (the chair's ruling VS1, 2026-11-19, on the owner's word: "Make a
 * toggle for conscience sake when editing the shared document that automatically hides all
 * criminal related content that auto hides and unhides").
 *
 * THE CRIMINAL FAMILY is defined ONCE, here, by the DEFAULT CLASS each entry of
 * galleryVeil.js :: defaultVeilFor carries (`cls`). Every class defaultVeilFor can produce is
 * in CRIMINAL_VEIL_CLASSES or in NOT_CRIMINAL; the module's test walks the live tables
 * (STATIC_DEFAULT_GROUPINGS, read through defaultVeilFor of an empty town, and
 * DEFAULT_VEIL_RULES) and fails on a class in neither list, so a new default class is
 * classified on purpose.
 *
 * A TOWN'S CRIMINAL PARTS are defaultVeilFor's entries whose class is in the family, plus
 * what falls UNDER one of them:
 *   - under a criminal house's card (`card:institution:<id>`): every depth eye of that house,
 *     `field:institution:<id>:<eye>` for each eye of CARD_KINDS.institution (so a house whose
 *     default leaves an eye open, `people` on a covert brokerage, is still covered whole);
 *   - under a criminal faction's depth (`field:faction:<id>:*` defaults): every depth eye of
 *     that faction but `capture`, which Power's capture reading owns on every faction (no card
 *     eye is drawn for it, galleryVeil.js :: GROUPING_OWNED_FIELDS);
 *   - under the corruption class (`class:npc:corruption`): every person's
 *     `field:npc:<id>:corruption` delta already in the draft.
 * The eyes are enumerated from the table, not only from the draft, so hide, show, hide writes
 * the same list twice: a part never drops out of the family because a show removed its delta.
 *
 * A SWITCH SETS ONLY WHAT A HAND CAN SEE AND UNDO ON THAT RECORD (the seventh chair's ruling VR34,
 * 2026-11-20, from the security reader's V10-2; vetoable by the owner). The family above is the
 * CANDIDATE list; a part is a candidate the Curate screen DRAWS for that record: the list is
 * intersected with the addresses of the very model the screen draws (galleryVeil.js ::
 * curateModelFor, read here by offeredAddressesOf), so the switch and the screen cannot drift.
 * The model draws an eye exactly where the applier would remove something under it, by identity
 * in every stored shape (a house's People by the house each person belongs to; a power's depth on
 * every copy of the power), so an address the screen does not draw governs nothing on that record:
 * "Hide everything criminal" shuts nothing a hand cannot open again and "Show all" opens nothing a
 * hand cannot shut again. A candidate the screen does not draw is never written; a delta already
 * stored on one (an earlier Show-all's write before VR34) is dropped by the next click, either way.
 * Without the model the switch covers nothing (it reads 'none' and writes nothing): it never writes
 * an address it cannot show.
 *
 * THE THREE GROUPINGS ARE STATIC DEFAULTS (galleryVeil.js: "never betrays that a town had a
 * thieves' guild"), so every town's default carries them. Read literally, no town would ever have
 * "no criminal parts". With the town's projection given (`present`, from
 * presentCriminalGroupings), a family grouping counts as a part only where hiding it removes
 * something from that projection, measured by applyVeil itself; a grouping with nothing under it
 * is left as it stands. Without `present` every family grouping counts.
 *
 * An EXCEPTION to a class switch is not a stored address of its own: resolveVeil writes
 * `except:` + a field address (VEIL_EXCEPTION_PREFIX) into the resolved set when a field delta
 * says `hidden: false`. So a person's corruption exception IS their field delta, and is covered
 * by the third rule. Card-level deltas on other kinds (`card:npc:<id>`, the revealDm fold) are
 * the owner's hand on a whole person and are never touched.
 *
 * WHAT THE SWITCH WRITES: only what clicking each eye by hand would write. Hide all sets every
 * criminal part's wanted state to hidden, show all to shown; every delta on a criminal part is
 * first dropped, then a delta is written only where the wanted state differs from what the
 * defaults and the remaining deltas give (toggleVeilDelta's rule), and a written delta that
 * turns out redundant is dropped again. Deltas on every other address are never touched. No
 * stored field, no new address kind: galleryVeil.js and migration 212 read the result as any
 * hand-curated share.
 *
 * A RECORDED LIMIT (VS1 point 5): in a live share, a criminal part that appears AFTER the owner
 * chose "Shown" (a house founded later, a faction turned criminal) starts hidden, by the
 * automatic veil's default, and the switch then reads "Partly shown". Hiding is the safe
 * direction; no stored flag is added for this.
 *
 * Pure; never mutates its inputs.
 */

import { CARD_KINDS, applyVeil, clampVeilDeltas, defaultVeilFor, isAddressHidden, parseVeilAddress, resolveVeil } from './galleryVeil.js';
import { readSalt } from './galleryVeilPeople.js';

/** @typedef {import('./galleryVeil.js').VeilDelta} VeilDelta */
/** @typedef {import('./galleryVeil.js').VeilDefault} VeilDefault */

/**
 * The criminal family, by default class: the three groupings (criminal services, Defense's
 * criminal architecture, Power's capture reading — the last two carry the criminal and
 * black-market income rows, gallerySecondHomes.js :: withholdCriminalIncome), the three house
 * classes hidden whole (X-21e), criminal powers' depth and people's corruption.
 */
export const CRIMINAL_VEIL_CLASSES = Object.freeze([
  'criminal-services',
  'defense-criminal-architecture',
  'power-capture',
  'covert-brokerage',
  'clandestine-institution',
  'criminal-institution',
  'criminal-faction',
  'npc-corruption',
]);

/** The default classes that are NOT criminal, named so the walker can tell a new class from an old one. */
export const NOT_CRIMINAL = Object.freeze([
  'npc-secret',
  'plot-hooks',
  'defense-vulnerabilities',
  'rumor-truth',
  'war-truth',
  'housekeeping',
]);

const FAMILY = new Set(CRIMINAL_VEIL_CLASSES);

/** The faction eye Power's capture reading owns on every faction (galleryVeil.js :: GROUPING_OWNED_FIELDS). */
const GROUPING_OWNED_FACTION_EYE = 'capture';

/**
 * The switch's words: its label, the one line of what it covers, each state, and the notice
 * (`housesHidden`, CURATE-NOTICE, the seventh chair's ruling 38 (c); its words are the chair's to
 * approve) drawn where criminalHouseHiddenWhileShown holds.
 */
export const CRIMINAL_SWITCH_WORDS = Object.freeze({
  label: 'Hide everything criminal',
  covers: "Criminal houses and services, the criminal architecture, the capture reading and its black-market income, criminal powers' details, people's corruption.",
  hidden: 'Hidden from visitors',
  shown: 'Shown to visitors',
  partly: 'Partly shown, by you',
  none: 'This town has no criminal parts',
  housesHidden: "While a criminal house is hidden, the town's criminal powers stay off the shared page too, so they cannot give the house away. Show the house to show them, or leave it hidden and they stay off.",
});

/**
 * The family's groupings that remove something from this projection: each is applied alone and
 * the copy compared with the unveiled one (applyVeil, so the criminal income rows the two blocks
 * carry count with them). R4I-PAGE-2 S1 (the chair's E136 (b)): every copy is projected under ONE
 * salt (readSalt, drawn once here and passed to each applyVeil call), so two copies differ only
 * where the grouping removed something, never by the re-key's spelling of a person's id. This is
 * the owner's own page: no share read passes a salt.
 * @param {unknown} payload  galleryPayloadFor's output, the curate screen's own copy
 * @returns {Set<string>}
 */
export function presentCriminalGroupings(payload) {
  const salt = readSalt();
  const plain = JSON.stringify(applyVeil(payload, [], { salt }));
  /** @type {Set<string>} */
  const out = new Set();
  for (const d of defaultVeilFor(payload)) {
    const p = FAMILY.has(d.cls) ? parseVeilAddress(d.address) : null;
    if (!p || (p.type !== 'tab' && p.type !== 'block')) continue;
    if (JSON.stringify(applyVeil(payload, [d.address], { salt })) !== plain) out.add(d.address);
  }
  return out;
}

/**
 * @typedef {{ sections: ReadonlyArray<{
 *   groupings: ReadonlyArray<{ address: string }>, switches: ReadonlyArray<{ address: string }>,
 *   cards: ReadonlyArray<{ whole: { address: string } | null, eyes: ReadonlyArray<{ address: string }> }>,
 * }> }} CurateModel  galleryVeil.js :: curateModelFor's output (the part this module reads)
 */

/**
 * Every address the Curate screen draws an eye or a row for: each section's groupings, its master
 * switches, and each box's whole-house eye and depth eyes (CurateMode.jsx draws exactly these).
 * An eye under a house hidden whole is drawn once the house is opened, so it is counted: the
 * model's addresses do not depend on the draft.
 * @param {CurateModel|null|undefined} model  curateModelFor(payload, draft)
 * @returns {Set<string>}
 */
export function offeredAddressesOf(model) {
  /** @type {Set<string>} */
  const out = new Set();
  for (const sec of (model && Array.isArray(model.sections) ? model.sections : [])) {
    for (const e of [...sec.groupings, ...sec.switches]) out.add(e.address);
    for (const c of sec.cards) {
      if (c.whole) out.add(c.whole.address);
      for (const e of c.eyes) out.add(e.address);
    }
  }
  return out;
}

/**
 * The family's candidates, in order: the family's defaults (defaultVeilFor's order), then the
 * eyes under each criminal house and faction, then each person's corruption delta (the draft's
 * order). Not yet narrowed to what the screen draws.
 * @param {ReadonlyArray<VeilDefault>|null|undefined} defaults
 * @param {ReadonlyArray<VeilDelta>|null|undefined} deltas
 * @param {ReadonlySet<string>} [present]
 * @returns {string[]}
 */
function criminalCandidatesOf(defaults, deltas, present) {
  /** @type {Set<string>} */
  const parts = new Set();
  /** @type {Set<string>} institution ids whose card is a criminal part */
  const houses = new Set();
  /** @type {Set<string>} faction ids with a criminal depth default */
  const factions = new Set();
  let corruption = false;
  for (const d of defaults || []) {
    if (!d || !FAMILY.has(d.cls) || typeof d.address !== 'string') continue;
    const p = parseVeilAddress(d.address);
    if (!p) continue;
    if ((p.type === 'tab' || p.type === 'block') && present && !present.has(d.address)) continue;
    parts.add(d.address);
    if (p.type === 'card' && p.kind === 'institution') houses.add(p.id);
    if (p.type === 'field' && p.kind === 'faction') factions.add(p.id);
    if (p.type === 'class' && p.kind === 'npc' && p.field === 'corruption') corruption = true;
  }
  for (const id of houses) for (const eye of Object.keys(CARD_KINDS.institution.fields)) parts.add(`field:institution:${id}:${eye}`);
  for (const id of factions) {
    for (const eye of Object.keys(CARD_KINDS.faction.fields)) if (eye !== GROUPING_OWNED_FACTION_EYE) parts.add(`field:faction:${id}:${eye}`);
  }
  if (corruption) {
    for (const d of clampVeilDeltas(deltas)) {
      const p = parseVeilAddress(d.address);
      if (p && p.type === 'field' && p.kind === 'npc' && p.field === 'corruption') parts.add(d.address);
    }
  }
  return [...parts];
}

/**
 * Every criminal part of a town, in order (the candidates' order), each one an address the Curate
 * screen draws for this record (VR34).
 * @param {ReadonlyArray<VeilDefault>|null|undefined} defaults  defaultVeilFor(settlement)
 * @param {ReadonlyArray<VeilDelta>|null|undefined} deltas  the curate draft
 * @param {ReadonlySet<string>} [present]  presentCriminalGroupings(payload); omitted, every family grouping counts
 * @param {CurateModel|null} [model]  curateModelFor(payload, draft), the model the screen draws; omitted, no part
 * @returns {string[]}
 */
export function criminalPartsOf(defaults, deltas, present, model) {
  const offered = offeredAddressesOf(model);
  return criminalCandidatesOf(defaults, deltas, present).filter(a => offered.has(a));
}

/**
 * Is a criminal part hidden from visitors under a resolved set? Its own address (a field under
 * its class switch unless excepted, isAddressHidden), or, for an eye of a house, the house's
 * card: a house hidden whole takes every eye with it (applyVeil removes the card), so an eye
 * left open under it shows the visitor nothing.
 * @param {Set<string>} now  resolveVeil's output
 * @param {string} address
 * @returns {boolean}
 */
export function isPartHidden(now, address) {
  if (isAddressHidden(now, address)) return true;
  const p = parseVeilAddress(address);
  return !!p && p.type === 'field' && p.kind === 'institution' && now.has(`card:institution:${p.id}`);
}

/**
 * The switch's state, read from the draft: 'none' (no criminal part), 'hidden' (every part
 * hidden), 'shown' (none hidden) or 'partly'.
 * @param {ReadonlyArray<VeilDefault>|null|undefined} defaults
 * @param {ReadonlyArray<VeilDelta>|null|undefined} deltas
 * @param {ReadonlySet<string>} [present]  presentCriminalGroupings(payload)
 * @param {CurateModel|null} [model]  curateModelFor(payload, draft)
 * @returns {'none'|'hidden'|'shown'|'partly'}
 */
export function criminalSwitchStateOf(defaults, deltas, present, model) {
  const parts = criminalPartsOf(defaults, deltas, present, model);
  if (!parts.length) return 'none';
  const now = resolveVeil(defaults, deltas);
  const hiddenCount = parts.filter(a => isPartHidden(now, a)).length;
  if (hiddenCount === parts.length) return 'hidden';
  if (hiddenCount === 0) return 'shown';
  return 'partly';
}

/**
 * THE NOTICE'S CONDITION (CURATE-NOTICE; ruling 38 (c)): the switch reads 'shown' or 'partly' while a
 * house is hidden whole in the draft. That is the condition under which R3's power rule (VR11,
 * power.entry) keeps a criminal power's row off every non-owner read: it fires wherever ANY house of
 * the projection is missing from the veiled copy (gallerySecondHomes.js :: rosterHouses' `gone`), and
 * applyVeil removes a house exactly where its `card:institution:<id>` is resolved hidden and the house
 * is hideable (isHideableHouse, X-21e), which is exactly where curateModelFor draws a whole-house eye
 * and reads it hidden. Every hideable house is in the criminal family (its card's default class is
 * covert-brokerage, clandestine-institution or criminal-institution), so it is a criminal house.
 * AND (the chair's ruling on the notice) the town HAS a criminal power: a power whose `category` is
 * 'criminal' (any case, as cardVeil.js :: isVeiledPower and R3's power.entry read it) in
 * `powerStructure.factions` or in master's top-level `factions`, read from the screen's own copy.
 * Reads only the model and the payload the screen already holds; sets nothing.
 * @param {'none'|'hidden'|'shown'|'partly'} state  criminalSwitchStateOf(...)
 * @param {{ sections: ReadonlyArray<{ cards: ReadonlyArray<{ whole: { hidden: boolean } | null }> }> } | null | undefined} model  curateModelFor(payload, draft)
 * @param {unknown} payload  galleryPayloadFor's output, the curate screen's own copy
 * @returns {boolean}
 */
export function criminalHouseHiddenWhileShown(state, model, payload) {
  if (state !== 'shown' && state !== 'partly') return false;
  /** @type {ReadonlyArray<{ cards: ReadonlyArray<{ whole: { hidden: boolean } | null }> }>} */
  const sections = model && Array.isArray(model.sections) ? model.sections : [];
  if (!sections.some(sec => sec.cards.some(c => !!c.whole && c.whole.hidden === true))) return false;
  return hasCriminalPower(payload);
}

/**
 * Does the copy hold a criminal power: `category` 'criminal' (any case) in `powerStructure.factions`
 * or in the top-level `factions` (master's stored shape)?
 * @param {unknown} payload
 * @returns {boolean}
 */
function hasCriminalPower(payload) {
  /** @param {unknown} v @returns {Record<string, unknown> | null} */
  const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : null);
  /** @param {unknown} list @returns {boolean} */
  const anyCriminal = (list) => Array.isArray(list) && list.some((f) => {
    const r = rec(f);
    return !!r && typeof r.category === 'string' && r.category.toLowerCase() === 'criminal';
  });
  const p = rec(payload);
  if (!p) return false;
  const ps = rec(p.powerStructure);
  return anyCriminal(ps ? ps.factions : null) || anyCriminal(p.factions);
}

/**
 * Set every criminal part to one state: drop each delta on a part (and on a family candidate the
 * screen does not draw: a write no hand can see, VR34), write a delta only where the wanted state
 * differs from what the rest gives, then drop any written delta made redundant by a later one.
 * Every other delta is kept, in its order.
 * @param {ReadonlyArray<VeilDelta>|null|undefined} deltas
 * @param {ReadonlyArray<VeilDefault>} defaults
 * @param {boolean} hidden
 * @param {ReadonlySet<string>} [present]  presentCriminalGroupings(payload)
 * @param {CurateModel|null} [model]  curateModelFor(payload, draft)
 * @returns {VeilDelta[]}
 */
export function setCriminalVeil(deltas, defaults, hidden, present, model) {
  const all = clampVeilDeltas(deltas);
  const parts = criminalPartsOf(defaults, all, present, model);
  if (!parts.length) return all;
  const partSet = new Set(parts);
  const family = new Set(criminalCandidatesOf(defaults, all, present));
  const out = all.filter(d => !partSet.has(d.address) && !family.has(d.address));
  for (const address of parts) {
    if (isPartHidden(resolveVeil(defaults, out), address) !== hidden) out.push({ address, hidden });
  }
  // A delta written early (a person's corruption field) can be made redundant by a later one
  // (the class switch): drop each written delta whose absence leaves every part as wanted.
  for (let i = out.length - 1; i >= 0; i -= 1) {
    if (!partSet.has(out[i].address)) continue;
    const without = [...out.slice(0, i), ...out.slice(i + 1)];
    const now = resolveVeil(defaults, without);
    if (parts.every(a => isPartHidden(now, a) === hidden)) out.splice(i, 1);
  }
  return out;
}

/**
 * One click on the switch: "Shown" or "Partly" hides every criminal part; "Hidden" shows every one.
 * With no criminal part the draft comes back unchanged.
 * @param {ReadonlyArray<VeilDelta>|null|undefined} deltas
 * @param {ReadonlyArray<VeilDefault>} defaults
 * @param {ReadonlySet<string>} [present]  presentCriminalGroupings(payload)
 * @param {CurateModel|null} [model]  curateModelFor(payload, draft)
 * @returns {VeilDelta[]}
 */
export function flipCriminalVeil(deltas, defaults, present, model) {
  const state = criminalSwitchStateOf(defaults, deltas, present, model);
  if (state === 'none') return clampVeilDeltas(deltas);
  return setCriminalVeil(deltas, defaults, state !== 'hidden', present, model);
}
