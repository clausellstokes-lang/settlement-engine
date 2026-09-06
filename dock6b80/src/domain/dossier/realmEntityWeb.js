/**
 * domain/dossier/realmEntityWeb.js — THE REALM-SCOPED ENTITY RESOLVER.
 *
 * THE NEWS ADDRESS LAW, realm-wide (owner doctrine 2026-07-22). The per-dossier
 * entity index (entityLinks.js/buildDossierEntityIndex) knows exactly ONE
 * settlement; a Realm Inspector item names entities that live in ANY settlement
 * of the campaign. This module is the realm extension: given a typed entity
 * descriptor an inspector viewmodel carries — an npc id, a faction id, a faction
 * NAME scoped to a settlement, or a bare settlement save id — it resolves the
 * subject's FULL ADDRESS CHAIN:
 *
 *     settlement  ›  power (the ruling seat)  ›  faction (the subject's own)  ›  npc
 *
 * as deep as the record actually identifies. Every level is a REAL addressable
 * entity carrying the dossier-index id the cross-settlement navigator focuses,
 * so each renders as a live EntityLink. Nothing is composed from prose: the join
 * is by TYPED ID (the pulse `saveId:local` ids the sim mints) and the CANONICAL
 * derivation helpers (npcInFaction / governingFactionOf / nameOf /
 * factionArchetype), never a name-string match against a headline. The
 * faction-key defect class is this codebase's most-bitten bug; this module never
 * hand-rolls a `.name || .faction`.
 *
 * DEGRADE, NEVER FABRICATE. When a level is not derivable from what the record
 * carries — an opaque outcome that names only a settlement, an npc with no
 * resolvable faction — the missing level is DROPPED. A faction is never guessed,
 * a power is never invented. The caller renders the derivable levels and leaves
 * the rest as calm text.
 *
 * LAZY + PURE. No store, no React, no Date/Math.random. Per-settlement dossier
 * indexes are built on demand (a resolve for one npc indexes only that npc's
 * settlement) and cached, so the whole realm is never walked eagerly and this
 * module — imported only by the lazy inspector panels and the lazy dossier —
 * adds nothing to the first-paint closure.
 *
 * @enforced-by tests/domain/dossier/realmEntityWeb.test.js
 * @enforced-by tests/lint/realmEntityWebNoFabrication.walker.test.js
 */

import { buildDossierEntityIndex } from './entityLinks.js';
import { factionIdFromName } from '../../lib/entities.js';
import { stablePart } from '../worldPulse/stablePart.js';
import { npcInFaction, ladderFactionKey } from '../worldPulse/npcLadderState.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';

/**
 * The dossier-index entry shape this module reads (structurally reduced — only
 * the fields the address chain uses). Matches decorateEntry's contract.
 * @typedef {Object} IndexEntry
 * @property {string} id
 * @property {string} [anchor]
 * @property {string} type
 * @property {string} tab
 * @property {string} currentName
 * @property {Record<string, unknown>} [raw]
 */

/**
 * A resolved chain level. `linked` is true when the level carries a navigable
 * dossier target; a subjectless / prose-only level renders as calm text.
 * @typedef {Object} ChainLevel
 * @property {'settlement'|'power'|'faction'|'npc'} role
 * @property {string} label                 The display name.
 * @property {string|number} settlementSaveId  The dossier to open.
 * @property {string|null} entityId         The dossier-index id to focus (null = open the dossier only).
 * @property {boolean} linked               Whether this level resolves to a navigable card.
 */

/**
 * A saved-settlement entry (structurally reduced).
 * @typedef {Object} SavedSettlementLike
 * @property {string|number} [id]
 * @property {string} [name]
 * @property {Record<string, unknown>} [settlement]
 */

/** @param {unknown} v @returns {string} */
function str(v) { return v == null ? '' : String(v); }

/**
 * Recompute a settlement npc's canonical world-pulse id. Mirrors
 * worldPulse/npcAgency.js `npcId(saveId, npc, index)` byte-for-byte; kept local
 * (not imported) so this lazy resolver does not drag the npcAgency graph, and
 * pinned equal to the canonical helper by
 * tests/domain/dossier/realmEntityWeb.test.js so it can never drift.
 * @param {string|number} saveId @param {{ id?: unknown, name?: unknown, label?: unknown }} npc @param {number} index
 * @returns {string}
 */
export function realmNpcPulseId(saveId, npc, index) {
  const local = npc?.id || stablePart(npc?.name || npc?.label || `npc_${index}`);
  return `${saveId}:${local}`;
}

/**
 * Recompute a settlement faction's canonical world-pulse id. Mirrors
 * worldPulse/factionCompetition.js `factionId(saveId, faction, index)` (which is
 * module-private, so it MUST be replicated) and is pinned equal by the test.
 * @param {string|number} saveId @param {{ id?: unknown, faction?: unknown, name?: unknown, label?: unknown }} faction @param {number} index
 * @returns {string}
 */
export function realmFactionPulseId(saveId, faction, index) {
  const name = faction?.id || faction?.faction || faction?.name || faction?.label || `faction_${index}`;
  return `${saveId}:${stablePart(name)}`;
}

/** @param {string} v @returns {string} */
function nameKey(v) { return stablePart(v); }

/**
 * Build the realm entity web over a campaign's saved settlements.
 *
 * @param {SavedSettlementLike[]} [savedSettlements]
 */
export function buildRealmEntityWeb(savedSettlements = []) {
  /** @type {Map<string, SavedSettlementLike>} */
  const savesById = new Map();
  for (const s of Array.isArray(savedSettlements) ? savedSettlements : []) {
    const id = s?.id ?? s?.settlement?.id;
    if (id != null) savesById.set(str(id), s);
  }

  /**
   * Per-settlement resolution bundle: the dossier index plus the pulse-id → entry
   * maps that let an inspector id join to the dossier card with no name-matching.
   * @typedef {Object} SettlementBundle
   * @property {string} saveId
   * @property {string} name
   * @property {IndexEntry|null} settlementEntry
   * @property {IndexEntry|null} governing     The ruling-seat faction entry (the "power" level).
   * @property {Map<string, IndexEntry>} npcByPulseId
   * @property {Map<string, IndexEntry>} factionByPulseId
   * @property {Map<string, IndexEntry>} factionByNameKey
   * @property {Array<{ entry: IndexEntry, raw: Record<string, unknown>, fkey: string }>} factions
   */

  /** @type {Map<string, SettlementBundle|null>} */
  const bundleCache = new Map();

  /** @param {string|number} saveId @returns {SettlementBundle|null} */
  function bundleFor(saveId) {
    const key = str(saveId);
    if (bundleCache.has(key)) return bundleCache.get(key) || null;
    const save = savesById.get(key);
    const settlement = save?.settlement;
    if (!settlement || typeof settlement !== 'object') {
      bundleCache.set(key, null);
      return null;
    }
    const index = buildDossierEntityIndex(settlement);
    const name = save?.name || /** @type {{ name?: string }} */ (settlement).name || key;

    /** @type {Map<string, IndexEntry>} */
    const npcByPulseId = new Map();
    (index.npcs || []).forEach((/** @type {IndexEntry} */ entry, /** @type {number} */ i) => {
      npcByPulseId.set(realmNpcPulseId(key, entry.raw || {}, i), entry);
    });

    /** @type {Map<string, IndexEntry>} */
    const factionByPulseId = new Map();
    /** @type {Map<string, IndexEntry>} */
    const factionByNameKey = new Map();
    /** @type {Array<{ entry: IndexEntry, raw: Record<string, unknown>, fkey: string }>} */
    const factions = [];
    (index.factions || []).forEach((/** @type {IndexEntry} */ entry, /** @type {number} */ i) => {
      const raw = entry.raw || {};
      factionByPulseId.set(realmFactionPulseId(key, raw, i), entry);
      const nk = nameKey(entry.currentName);
      if (nk && !factionByNameKey.has(nk)) factionByNameKey.set(nk, entry);
      factions.push({ entry, raw, fkey: ladderFactionKey(raw) });
    });

    // The "power" level: the settlement's governing seat, resolved through the
    // canonical helper. Mapped to its dossier faction entry (same card) so it
    // renders as a live link. Null when no seat is derivable (degrade).
    const governingRaw = governingFactionOf(settlement);
    const governingName = governingRaw ? nameOf(governingRaw) : '';
    const governing = governingName
      ? (factionByNameKey.get(nameKey(governingName))
        || index.byId.get(factionIdFromName(governingName) || '')
        || null)
      : null;

    /** @type {SettlementBundle} */
    const bundle = {
      saveId: key,
      name,
      settlementEntry: /** @type {IndexEntry|null} */ (index.settlement || null),
      governing: /** @type {IndexEntry|null} */ (governing),
      npcByPulseId,
      factionByPulseId,
      factionByNameKey,
      factions,
    };
    bundleCache.set(key, bundle);
    return bundle;
  }

  /** @param {SettlementBundle} bundle @param {IndexEntry} factionEntry @returns {ChainLevel} */
  function factionLevel(bundle, factionEntry) {
    return { role: 'faction', label: factionEntry.currentName, settlementSaveId: bundle.saveId, entityId: factionEntry.id, linked: true };
  }

  /** @param {SettlementBundle} bundle @returns {ChainLevel} */
  function settlementLevel(bundle) {
    return {
      role: 'settlement',
      label: bundle.name,
      settlementSaveId: bundle.saveId,
      entityId: bundle.settlementEntry?.id || null,
      linked: true,
    };
  }

  /**
   * The power level (the settlement's ruling seat), COLLAPSED when it is the same
   * entity as the subject's own faction (presence-over-repetition). Null when no
   * governing seat is derivable.
   * @param {SettlementBundle} bundle @param {IndexEntry|null} subjectFaction @returns {ChainLevel|null}
   */
  function powerLevel(bundle, subjectFaction) {
    const g = bundle.governing;
    if (!g) return null;
    if (subjectFaction && subjectFaction.id === g.id) return null; // same entity — do not repeat
    return { role: 'power', label: g.currentName, settlementSaveId: bundle.saveId, entityId: g.id, linked: true };
  }

  /**
   * The subject's own faction, via the canonical npcInFaction over the
   * settlement's real factions (first match wins, deterministic index order).
   * Null when nothing matches — the record-gap, DROPPED not guessed.
   * @param {SettlementBundle} bundle @param {Record<string, unknown>} npcRaw @returns {IndexEntry|null}
   */
  function factionOfNpc(bundle, npcRaw) {
    for (const f of bundle.factions) {
      if (npcInFaction(npcRaw, f.raw, f.fkey)) return f.entry;
    }
    return null; // no-fabrication: an unmatched npc DROPS the faction level, never invents one
  }

  /**
   * Resolve an npc's pulse id to its full address chain.
   * @param {string} pulseId  `${saveId}:${local}`
   * @returns {ChainLevel[]|null}
   */
  function resolveNpc(pulseId) {
    const id = str(pulseId);
    const ci = id.indexOf(':');
    if (ci < 0) return null;
    const bundle = bundleFor(id.slice(0, ci));
    if (!bundle) return null;
    const npcEntry = bundle.npcByPulseId.get(id);
    if (!npcEntry) return null;
    const faction = factionOfNpc(bundle, npcEntry.raw || {});
    /** @type {ChainLevel[]} */
    const chain = [settlementLevel(bundle)];
    const power = powerLevel(bundle, faction);
    if (power) chain.push(power);
    if (faction) chain.push(factionLevel(bundle, faction));
    chain.push({ role: 'npc', label: npcEntry.currentName, settlementSaveId: bundle.saveId, entityId: npcEntry.id, linked: true });
    return chain;
  }

  /**
   * Resolve a faction — by its pulse id, or by a NAME scoped to a settlement (the
   * WorldPulse `factionName` case: a structured field, resolved within its
   * settlement, never a prose scan) — to `settlement › power › faction`.
   * @param {{ pulseFactionId?: string, settlementSaveId?: string|number, factionName?: string }} descriptor
   * @returns {ChainLevel[]|null}
   */
  function resolveFaction(descriptor = {}) {
    /** @type {SettlementBundle|null} */
    let bundle = null;
    /** @type {IndexEntry|null|undefined} */
    let entry = null;
    if (descriptor.pulseFactionId) {
      const id = str(descriptor.pulseFactionId);
      const ci = id.indexOf(':');
      if (ci < 0) return null;
      bundle = bundleFor(id.slice(0, ci));
      entry = bundle?.factionByPulseId.get(id);
    } else if (descriptor.settlementSaveId != null && descriptor.factionName) {
      bundle = bundleFor(descriptor.settlementSaveId);
      entry = bundle?.factionByNameKey.get(nameKey(descriptor.factionName))
        || bundle?.factionByPulseId.get(realmFactionPulseId(str(descriptor.settlementSaveId), { faction: descriptor.factionName }, 0));
    }
    if (!bundle || !entry) return null;
    /** @type {ChainLevel[]} */
    const chain = [settlementLevel(bundle)];
    const power = powerLevel(bundle, entry);
    if (power) chain.push(power);
    chain.push(factionLevel(bundle, entry));
    return chain;
  }

  /**
   * Resolve a bare settlement save id to a single-level (settlement) chain — the
   * affected-settlement link every surface can render.
   * @param {string|number} saveId
   * @returns {ChainLevel[]|null}
   */
  function resolveSettlement(saveId) {
    const bundle = bundleFor(saveId);
    if (bundle) return [settlementLevel(bundle)];
    // A save present in the list but without a parsed settlement blob still names
    // and opens (hydrateFromSave rehydrates on navigate); a save id absent from the
    // list entirely resolves to null (the caller degrades to whatever it had).
    const save = savesById.get(str(saveId));
    if (!save) return null;
    const nm = save.name || /** @type {{ name?: string }} */ (save.settlement || {}).name || str(saveId);
    return [{ role: 'settlement', label: nm, settlementSaveId: str(saveId), entityId: null, linked: true }];
  }

  /**
   * The unified entry point the AddressChain component calls. Picks the deepest
   * derivable chain from whatever typed ids the record carries. Returns null when
   * the record identifies no addressable subject (subjectless / prose-only).
   * @param {{ npcId?: string|null, factionId?: string|null, settlementId?: string|number|null, factionName?: string|null }} [descriptor]
   * @returns {ChainLevel[]|null}
   */
  function resolveSubject(descriptor = {}) {
    if (descriptor.npcId) {
      const chain = resolveNpc(str(descriptor.npcId));
      if (chain) return chain;
    }
    if (descriptor.factionId) {
      const chain = resolveFaction({ pulseFactionId: str(descriptor.factionId) });
      if (chain) return chain;
    }
    if (descriptor.settlementId != null && descriptor.factionName) {
      const chain = resolveFaction({ settlementSaveId: descriptor.settlementId, factionName: str(descriptor.factionName) });
      if (chain) return chain;
    }
    if (descriptor.settlementId != null) {
      return resolveSettlement(descriptor.settlementId);
    }
    return null;
  }

  return {
    resolveNpc,
    resolveFaction,
    resolveSettlement,
    resolveSubject,
    /** @param {string|number} saveId — expose for tests / advanced callers. */
    _bundleFor: bundleFor,
    /** The set of settlement save ids this web can resolve. */
    saveIds: () => [...savesById.keys()],
  };
}
