/**
 * domain/worldPulse/brokeragePatronage.js — [W-I INFORMATION BROKERAGES] I3, WHO THE
 * HOUSE SERVES (docs/DESIGN_INFORMATION_BROKERAGES.md §7).
 *
 * WHAT A PATRON IS. Every information house answers to somebody. A listening post keeps
 * its register for the seat that licenses it; a rookery keeps its loft for the people who
 * protect it. §7 makes that binding a first-class fact: seeded at generation from the
 * settlement's own power structure, rebindable through the faction-competition machinery,
 * DM-visible and audience-projected.
 *
 * ── THE BINDING IS A DERIVATION, NOT A RECORD, AND THAT IS THE WHOLE DESIGN ──
 *
 * There is no `spatialLedgers.brokeragePatronage`. There is no key at all. A binding is
 * recomputed from state that already persists, every time it is asked for, and the two
 * halves come from two places that already exist:
 *
 *   GENESIS   a zero-draw deterministic pick over the settlement's eligible powers,
 *             keyed by the settlement id and the house's own institution id. Same world,
 *             same house, same patron, forever.
 *   CAPTURED  the faction that actually holds the house, read straight off
 *             `factionStates[*].controlledInstitutions` — the list the EXISTING
 *             faction_institution_capture candidate accretes when a power takes an
 *             institution. Capturing the listeners is a coup-adjacent prize precisely
 *             because the machinery for taking it was already there.
 *
 * Three consequences, all of them wanted. (1) NOTHING IS PERSISTED, so no dormancy
 * question can arise: a dark campaign has no key to be absent and no bytes to differ.
 * (2) REBINDING IS NOT A SECOND MECHANISM. There is no rebind verb to keep in step with
 * the capture verb, because the capture verb IS the rebind: the reader simply prefers the
 * captured answer. (3) THE BINDING CANNOT GO STALE against a world that moved, which a
 * stored binding certainly would the first time a faction was renamed or a house burned.
 *
 * WHY THE BINDING IS NOT MINTED AT GENERATION, despite §7 saying "at generation". Binding
 * at generation would mean a new field on a generated institution, and the golden master
 * hashes the settlement WHOLE: every brokerage row in the corpus would move for a fact
 * that can be derived instead. The seeded derivation is generation-time IN EFFECT (it
 * reads only generated state and never a tick), and it moves no golden.
 * [JUDGMENT: derived seeded binding over a generated field, because the generated field
 * would re-record the corpus for a fact with a closed-form answer. Say "veto" to mint it
 * at generation instead.]
 *
 * PURE, TOTAL, ZERO-DRAW: no rng (the genesis pick is fnv1a32 over a stable key, the
 * sanctioned zero-draw selector, so no forked stream can shift), no clock, no mutation, no
 * tier read, no store. Every accessor fails CLOSED: an unreadable roster, a settlement with
 * no powers, or a house nobody will own reads as NO patron rather than as a default one.
 */

import { pickVariant } from '../../kernel/proseHash.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { nameOf } from '../rulingPower.js';
import { stablePart } from './stablePart.js';
import { brokerageEffectsActive, brokerageHouseRosterIn } from './brokerageStamps.js';

/**
 * How a house came to serve who it serves. Closed vocabulary: a binding is either the one
 * the world was born with or the one a power took by force, and there is no third way for
 * a house to change hands.
 * @type {readonly string[]}
 */
export const BROKERAGE_PATRON_SOURCES = Object.freeze(['genesis', 'captured']);

/**
 * WHO MAY OWN A HOUSE, by family, in preference order (design §7: legal houses bind to
 * ruling and mercantile powers, illegal houses to criminal ones).
 *
 * The order is the tie-break, not a probability: the eligible roster is sorted by this
 * rank and the genesis pick then chooses inside it, so a settlement whose only merchant
 * power vanished binds to its seat instead of to nobody.
 *
 * ILLEGAL IS DELIBERATELY NARROW. A rookery needs a standing criminal organization behind
 * it (I1's `brokeragePowerPreconditionMet`, the same rule the catalog gate states), so the
 * outsider archetype is admitted only as the second rank: a smuggling ring that has not
 * yet been named a criminal power can shelter a loft, a temple cannot.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const PATRON_ELIGIBILITY = Object.freeze({
  legal: Object.freeze([
    FACTION_ARCHETYPES.GOVERNMENT,
    FACTION_ARCHETYPES.MERCHANT,
    FACTION_ARCHETYPES.NOBLE,
    FACTION_ARCHETYPES.CIVIC,
  ]),
  illegal: Object.freeze([
    FACTION_ARCHETYPES.CRIMINAL,
    FACTION_ARCHETYPES.OUTSIDER,
  ]),
});

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v : String(v == null ? '' : v);
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** Codepoint order, the estate's byte-stable comparator. @param {string} a @param {string} b @returns {number} */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * THE POWER ROSTER and THE FACTION-STATE KEY, re-spelled here rather than imported.
 *
 * factionCompetition.js imports beliefMap.js, and beliefMap.js imports the FEED half of
 * this slice, so importing the faction layer from this module would close a module cycle
 * straight through the belief advance. So the two readings are copied, on the same
 * precedent I2 set for HERALD_SECTION_CHANNEL and the rumour-ledger read: a local copy
 * whose equality with the canonical spelling is EXECUTED rather than asserted.
 * tests/domain/brokeragePatronage.test.js runs `ensureFactionStates` over a snapshot and
 * requires every key it mints to be a key this file would mint, so a rename upstream reds
 * here instead of silently binding houses to powers the capture machinery cannot address.
 * @param {Record<string, unknown>} host a snapshot item
 * @returns {readonly Record<string, unknown>[]}
 */
function powerFactionsOf(host) {
  const settlement = asObject(host.settlement);
  const structure = asObject(settlement.powerStructure);
  const politics = asObject(settlement.politics);
  const factions = structure.factions || settlement.factions || politics.factions;
  return Array.isArray(factions) ? factions.map(asObject) : [];
}

/** The `<settlementId>:<slug>` faction-state key (see `powerFactionsOf`).
 *  @param {string} saveId @param {Record<string, unknown>} faction @param {number} index @returns {string} */
function factionStateKey(saveId, faction, index) {
  const name = faction.id || faction.faction || faction.name || faction.label || `faction_${index}`;
  return `${saveId}:${stablePart(name)}`;
}

/**
 * @typedef {Object} PatronCandidate
 * @property {string} factionStateId  the `<settlementId>:<slug>` key the faction ledger uses
 * @property {string} name            the power's display name (canonical `nameOf`)
 * @property {string} archetype       the canonical faction archetype
 * @property {number} rank            index into this family's eligibility order
 */

/**
 * THE ELIGIBLE POWERS of one settlement for one family of house, in a deterministic order
 * (eligibility rank first, then the faction-state id by codepoint, so two equally-ranked
 * powers never depend on roster order).
 *
 * The roster read and the id spelling are the faction layer's own (copied, not imported,
 * for the cycle reason `powerFactionsOf` records), because a patron that did not address
 * the SAME `factionStates` key the capture machinery writes would be a patron the world
 * cannot act on. The parity is EXECUTED in tests/domain/brokeragePatronage.test.js against
 * `ensureFactionStates` itself, not asserted by a source scan.
 *
 * @param {unknown} item the snapshot item (or any `{ id, settlement }` pair)
 * @param {unknown} legality one of the I1 legalities
 * @returns {readonly PatronCandidate[]}
 */
export function eligiblePatrons(item, legality) {
  const family = /** @type {Record<string, readonly string[]>} */ (PATRON_ELIGIBILITY)[text(legality)];
  if (!family) return Object.freeze([]);
  const host = asObject(item);
  const settlementId = text(host.id);
  if (!settlementId) return Object.freeze([]);
  const factions = powerFactionsOf(host);
  /** @type {PatronCandidate[]} */
  const out = [];
  const seen = new Set();
  factions.forEach((faction, index) => {
    const archetype = factionArchetype(faction);
    const rank = family.indexOf(archetype);
    if (rank < 0) return;
    const factionStateId = factionStateKey(settlementId, faction, index);
    if (seen.has(factionStateId)) return;
    seen.add(factionStateId);
    // The canonical accessors take the estate's own faction shapes; the roster read above
    // narrows to a record, so each call is a TYPED narrowing rather than an any-cast.
    out.push({
      factionStateId,
      name: nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (faction)),
      archetype,
      rank,
    });
  });
  out.sort((a, b) => (a.rank - b.rank) || compareCodepoint(a.factionStateId, b.factionStateId));
  return Object.freeze(out);
}

/**
 * THE GENESIS BINDING. The power a house was born serving, or null when the settlement
 * holds no power that would own it (an illegal house in a town with no criminal
 * organization is exactly that case, and the honest answer is that it serves nobody
 * anybody can name).
 *
 * ZERO DRAWS. `pickVariant` selects by fnv1a32 over the key, so this consumes no PRNG and
 * cannot shift a forked step-stream. The key names the settlement and the house, so two
 * houses in one town can serve two different powers and the same house in the same world
 * serves the same power on every recomputation, forever (THE PROMISE).
 *
 * @param {unknown} item the snapshot item
 * @param {{ institutionId: string, legality: string }} house
 * @returns {PatronCandidate|null}
 */
export function genesisPatronOf(item, house) {
  const eligible = eligiblePatrons(item, house?.legality);
  if (!eligible.length) return null;
  const settlementId = text(asObject(item).id);
  const picked = pickVariant(eligible, `brokerage:patron:${settlementId}:${text(house?.institutionId)}`);
  return picked || eligible[0];
}

/**
 * THE CAPTURED BINDING. The power that actually holds the house right now, read off the
 * faction ledger the EXISTING capture candidate writes.
 *
 * This is the whole of §7's rebinding. `faction_institution_capture` already accretes the
 * taken institution's id into `factionStates[f].controlledInstitutions` through
 * `applyFactionPatch`, so a captured house changes hands the instant the capture applies,
 * with no second mechanism to keep in step and no ordering question between them.
 *
 * Ties (two powers both claiming the house, which the accreting union permits) resolve by
 * codepoint on the faction-state key: deterministic, and stable against the ledger's own
 * key order.
 *
 * @param {unknown} worldState
 * @param {string} settlementId
 * @param {string} institutionId
 * @returns {{ factionStateId: string, name: string, archetype: string }|null}
 */
export function capturedPatronOf(worldState, settlementId, institutionId) {
  const states = asObject(asObject(worldState).factionStates);
  const wantSettlement = text(settlementId);
  const wantInstitution = text(institutionId);
  if (!wantSettlement || !wantInstitution) return null;
  /** @type {{ factionStateId: string, name: string, archetype: string }|null} */
  let best = null;
  for (const key of Object.keys(states).sort(compareCodepoint)) {
    const state = asObject(states[key]);
    if (text(state.settlementId) !== wantSettlement) continue;
    const held = Array.isArray(state.controlledInstitutions) ? state.controlledInstitutions.map(text) : [];
    if (!held.includes(wantInstitution)) continue;
    if (best) continue; // codepoint-first wins; the scan is already sorted
    best = { factionStateId: key, name: text(state.name) || key, archetype: text(state.archetype) };
  }
  return best;
}

/**
 * @typedef {Object} PatronBinding
 * @property {string} institutionId   the house (the id the capture machinery addresses)
 * @property {string} houseName       the house's own name, for the legible line
 * @property {string} legality        'legal' or 'illegal'
 * @property {string} form            'minor' or 'major'
 * @property {string} patronId        the patron's faction-state key
 * @property {string} patronName      the patron's display name
 * @property {string} patronArchetype the canonical archetype
 * @property {string} source          one of BROKERAGE_PATRON_SOURCES
 * @property {boolean} covert         true when the binding is DM truth (an illegal house)
 */

/**
 * THE BINDINGS of one settlement's standing houses, in roster order.
 *
 * TOTAL and fail-closed on every axis: the layer dark, a ruined house, a settlement with
 * no eligible power — each reads as no binding rather than as an invented one. A house
 * nobody owns is simply absent from the result, which is the drop-when-empty idiom applied
 * to a derivation instead of to a key.
 *
 * @param {Object} args
 * @param {unknown} args.worldState the campaign world state (the gate + the capture ledger)
 * @param {unknown} args.item the snapshot item whose settlement hosts the houses
 * @returns {readonly PatronBinding[]}
 */
export function brokeragePatronBindings({ worldState, item }) {
  if (!brokerageEffectsActive(worldState)) return Object.freeze([]);
  const host = asObject(item);
  const settlementId = text(host.id);
  // The roster read is delegated to brokerageStamps, which owns the ruin filter; this
  // module therefore never touches a raw roster array at all, which satisfies the
  // ruin-filter ratchet structurally rather than by negotiating an exemption.
  const roster = brokerageHouseRosterIn(asObject(host.settlement));
  /** @type {PatronBinding[]} */
  const out = [];
  for (const house of roster) {
    const captured = capturedPatronOf(worldState, settlementId, house.institutionId);
    const genesis = captured ? null : genesisPatronOf(host, house);
    const patron = captured || genesis;
    if (!patron) continue;
    out.push({
      institutionId: house.institutionId,
      houseName: house.name,
      legality: house.legality,
      form: house.form,
      patronId: patron.factionStateId,
      patronName: patron.name,
      patronArchetype: patron.archetype,
      source: captured ? 'captured' : 'genesis',
      covert: house.legality === 'illegal',
    });
  }
  return Object.freeze(out);
}

/**
 * THE AUDIENCE PROJECTION (design §7, and the consequences doc's audience law extended).
 * Patronage is visible to the DM. A LEGAL house's patron is a public fact, licensed and
 * taxed, so a player sees it. A WHISPER MARKET's patron is covert until exposed, so the
 * player's projection carries the house and drops the name of who it serves rather than
 * dropping the house, because a covert patron is a QUESTION the table should be able to
 * ask and not a fact the table should never have met.
 *
 * `exposed` names the institution ids whose covert patronage the world has already turned
 * up (an exposed plant, a revealed capture); those project in full.
 *
 * @param {readonly PatronBinding[]|null|undefined} bindings
 * @param {Object} [options]
 * @param {string} [options.audience] 'dm' (default) or 'player'
 * @param {readonly string[]} [options.exposed] institution ids already exposed
 * @returns {readonly PatronBinding[]}
 */
export function projectPatronBindings(bindings, { audience = 'dm', exposed = [] } = {}) {
  const rows = Array.isArray(bindings) ? bindings : [];
  if (text(audience) !== 'player') return Object.freeze([...rows]);
  const open = new Set((Array.isArray(exposed) ? exposed : []).map(text));
  return Object.freeze(rows.map((row) => (
    !row.covert || open.has(row.institutionId)
      ? row
      : { ...row, patronId: '', patronName: 'unknown', patronArchetype: '', source: row.source }
  )));
}
