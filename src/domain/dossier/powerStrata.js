/**
 * domain/dossier/powerStrata.js — the Power tab's three-strata read-model.
 *
 * Owner order (2026-07-22): "factions and powers need to be organized better
 * because it looks weighted equally when in fact there are powers, there are
 * factions, and there are the relationships between several. so it needs a
 * rework." The flat "Power Distribution" list is replaced by three semantically
 * distinct strata; this module derives them, READ-ONLY in the display layer:
 *
 *   1. THE POWERS   — the entities that hold or contest rule: the governing
 *                     faction (the ruler) plus the coup contenders (the rival
 *                     blocs the data marks as able to move on the seat).
 *   2. THE FACTIONS — the full roster, one entry per faction, each flagged
 *                     `isPower` when it appears in stratum 1 (so the roster row
 *                     can carry a "holds power" marker instead of duplicating
 *                     the power card).
 *   3. THE WEB      — the typed relationships BETWEEN factions, grouped by their
 *                     finite `type` kind (never a composed label — the
 *                     finite-semantics law).
 *
 * No generation change; no store write; pure and deterministic over the
 * settlement it is handed. Every faction-identity read goes through the
 * canonical helpers (governingFactionOf / coupContenders / factionArchetype /
 * nameOf) — never a hand-rolled `.name || .faction`.
 *
 * KEYING. Factions are keyed by DISPLAY NAME throughout the power domain
 * (coupContenders keys challengers by name; factionRelationships pair names are
 * display names). This module keys the same way, so the powers-set membership
 * that flags `isPower` on the roster is name-identity, matching the domain.
 */

import { coupContenders } from '../rulingPowerCoup.js';
import { governingFactionOf, nameOf, num } from '../rulingPower.js';
import { factionArchetype } from '../factionArchetypes.js';

/** @typedef {import('../rulingPower.js').RulingPowerSettlement} RulingPowerSettlement */
/** @typedef {import('../rulingPower.js').RulingFaction} RulingFaction */

/**
 * A ruling faction as the dossier reads it: the canonical RulingFaction plus the
 * display-only power-band label the generator stamps on it (not part of the
 * shared RulingFaction contract, so declared locally here).
 * @typedef {RulingFaction & { powerLabel?: string }} StrataFaction
 */

/** @typedef {'ruler'|'contender'} PowerRole */

/**
 * A power entry — an entity that holds or contests rule.
 * @typedef {Object} PowerEntry
 * @property {string}    name          Faction display name.
 * @property {string}    archetype     Canonical faction archetype.
 * @property {number}    power          Base power (0..100).
 * @property {string}    powerLabel     The faction's power-band label ('', 'Dominant', ...).
 * @property {PowerRole} role           'ruler' (the seat) or 'contender' (a rival bloc).
 * @property {number}    [weight]       Coup weight (contenders only).
 * @property {boolean}   [gated]        Whether the ruler's amplified case re-enters the field (ruler only).
 * @property {number}    [contenderCount]  How many contenders press the seat (ruler only).
 */

/**
 * A roster entry — one per faction present.
 * @typedef {Object} RosterEntry
 * @property {StrataFaction} faction    The raw settlement faction object.
 * @property {string}  name             Faction display name.
 * @property {string}  archetype        Canonical faction archetype.
 * @property {number}  power             Base power (0..100).
 * @property {string}  powerLabel        The faction's power-band label.
 * @property {boolean} isPower           True when this faction appears in THE POWERS.
 */

/**
 * Derive THE POWERS and THE FACTIONS strata from a settlement.
 *
 * THE POWERS = the governing faction (role 'ruler', when a seat exists) followed
 * by the coup contenders in the derivation's own order (role 'contender'),
 * de-duplicated by name — coupContenders already excludes the governing seat and
 * criminal factions, so the ruler never double-lists and the set stays small
 * (a seat + up to three challengers). THE FACTIONS = every faction in the
 * settlement's own order, each flagged `isPower` by membership in THE POWERS.
 *
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @returns {{ powers: PowerEntry[], roster: RosterEntry[] }}
 */
export function derivePowerStrata(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = /** @type {StrataFaction[]} */ (Array.isArray(ps.factions) ? ps.factions : []);
  const governing = /** @type {StrataFaction | null} */ (governingFactionOf(settlement));
  const { challengers, incumbent } = coupContenders(settlement);

  // Display-name -> raw faction, for enriching contenders (which carry no
  // powerLabel) back to their roster object. First spelling wins (deterministic).
  /** @type {Map<string, StrataFaction>} */
  const byName = new Map();
  for (const f of factions) {
    const n = nameOf(f);
    if (n && !byName.has(n)) byName.set(n, f);
  }

  /** @type {PowerEntry[]} */
  const powers = [];
  /** @type {Set<string>} */
  const powerNames = new Set();
  /** @param {PowerEntry} entry */
  const pushPower = (entry) => {
    if (!entry.name || powerNames.has(entry.name)) return;
    powerNames.add(entry.name);
    powers.push(entry);
  };

  if (governing) {
    const name = nameOf(governing);
    pushPower({
      name,
      archetype: factionArchetype(governing),
      power: num(governing.power),
      powerLabel: governing.powerLabel || '',
      role: 'ruler',
      gated: incumbent.gated,
      contenderCount: challengers.length,
    });
  }
  for (const c of challengers) {
    const f = byName.get(c.name) || null;
    pushPower({
      name: c.name,
      archetype: c.archetype,
      power: c.power,
      powerLabel: f ? (f.powerLabel || '') : '',
      role: 'contender',
      weight: c.weight,
    });
  }

  /** @type {RosterEntry[]} */
  const roster = factions.map((f) => {
    const name = nameOf(f);
    return {
      faction: f,
      name,
      archetype: factionArchetype(f),
      power: num(f.power),
      powerLabel: f.powerLabel || '',
      isPower: !!name && powerNames.has(name),
    };
  });

  return { powers, roster };
}

// ── THE WEB — typed relationship grouping ────────────────────────────────────

/**
 * The order THE WEB presents relationship kinds in: the frictional kinds first
 * (a DM scans for where the settlement is about to break), the cooperative kinds
 * last. Any unrecognised `type` falls after these in codepoint order. This is a
 * PRESENTATION order only — the label of each group is always the typed kind
 * (the finite-semantics law: never a composed phrase).
 */
export const RELATIONSHIP_KIND_ORDER = Object.freeze([
  'corrupted',
  'competitive',
  'tense',
  'subordinate',
  'dependent',
  'symbiotic',
]);

/**
 * A rendered relationship edge (structurally reduced to what the tab shows).
 * @typedef {Object} WebEdge
 * @property {[string, string]} pair   The two faction display names.
 * @property {string} type             The finite relationship kind.
 * @property {string} direction        The typed trajectory ('stable'|'escalating'|'declining'|'').
 * @property {string} narrative        The generator's flavor line (may be '').
 */

/** @typedef {{ kind: string, edges: WebEdge[] }} WebGroup */

/**
 * Group a settlement's factionRelationships by their typed `type` kind.
 *
 * Edges are read-model-reduced (pair / type / direction / narrative) and grouped
 * by kind in RELATIONSHIP_KIND_ORDER; unknown kinds follow in codepoint order.
 * An edge without a two-name `pair` is dropped (nothing to link). Empty in ⇒
 * empty out, so a settlement whose generator emitted no relationships renders no
 * web (self-gated by the caller).
 *
 * @param {unknown} relationships   powerStructure.factionRelationships
 * @returns {WebGroup[]}
 */
export function groupRelationships(relationships) {
  const rels = Array.isArray(relationships) ? relationships : [];
  /** @type {Map<string, WebEdge[]>} */
  const byKind = new Map();
  for (const r of rels) {
    const rel = /** @type {{ pair?: unknown, type?: unknown, direction?: unknown, narrative?: unknown }} */ (r);
    const pair = rel?.pair;
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const a = String(pair[0] || '');
    const b = String(pair[1] || '');
    if (!a || !b) continue;
    const kind = typeof rel.type === 'string' && rel.type ? rel.type : 'other';
    if (!byKind.has(kind)) byKind.set(kind, []);
    /** @type {WebEdge[]} */ (byKind.get(kind)).push({
      pair: [a, b],
      type: kind,
      direction: typeof rel.direction === 'string' ? rel.direction : '',
      narrative: typeof rel.narrative === 'string' ? rel.narrative : '',
    });
  }

  /** @type {WebGroup[]} */
  const groups = [];
  for (const kind of RELATIONSHIP_KIND_ORDER) {
    const edges = byKind.get(kind);
    if (edges) {
      groups.push({ kind, edges });
      byKind.delete(kind);
    }
  }
  for (const kind of [...byKind.keys()].sort()) {
    groups.push({ kind, edges: /** @type {WebEdge[]} */ (byKind.get(kind)) });
  }
  return groups;
}
