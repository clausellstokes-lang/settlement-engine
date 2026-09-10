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

/**
 * The settlement as the RULING CHAIN reads it (§815): the shared ruling-power
 * contract plus the two keys the chain alone consults — `npcLadder`, handed
 * STRAIGHT to ladderRead's own `{ npcLadder?: unknown }` readers, and `npcs`,
 * the roster the ruler-title fallback scans. Neither belongs to the shared
 * RulingPowerSettlement contract (which declares `powerStructure` and `tier`
 * and nothing else), so both are declared locally, exactly as StrataFaction
 * declares `powerLabel` above.
 *
 * ⚠ THIS IS A WIDENING OF THE PARAMETER, NOT OF A BASELINE. The chain read
 * `settlement.npcLadder` and `settlement.npcs` from the day it landed; the
 * declared parameter simply did not say so, and `RulingPowerSettlement` shares
 * no property at all with `{ npcLadder?: unknown }`, which is why the call was
 * a TS2559 rather than a quiet `any`. The cure names what the function reads —
 * the typecheck ratchet's own instruction (fix them; do not widen the baseline).
 * @typedef {RulingPowerSettlement & { npcLadder?: unknown, npcs?: unknown }} RulingChainSettlement
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

// ── §815 — THE RULING CHAIN: power → faction → named NPC ─────────────────────

/**
 * The finite ruler-role vocabulary is npcAgency's NPC_ROLE_ARCHETYPES — the ONE
 * spelling of what a ruler-titled NPC looks like (inferRoleArchetype's own
 * table). Imported rather than re-listed so the display chain can never drift
 * from the agency layer's classification. (powerStrata's only consumer is the
 * lazy Power tab chunk, so the worldPulse import costs no first-paint bytes.)
 */
import { NPC_ROLE_ARCHETYPES } from '../worldPulse/npcAgency.js';
import { npcInFaction } from '../worldPulse/npcLadderState.js';
import { hasLadder, ladderRungsOf, ladderFactionKeyOf } from '../townMap/ladderRead.js';

/** Does this NPC's text read as a RULER (the agency layer's own labels)?
 *  Reads name/role/title only — the generator writes no npc `label`, and the
 *  observed-shape ratchet holds this file to reads the corpus can ground.
 *  The parameter is declared as the three text keys it reads and nothing else:
 *  this file lives inside the domain kernel's STRICT scope, where an undeclared
 *  parameter is an implicit `any` and a ratchet red. Each key is optional and
 *  each read is `|| ''`-guarded, so a roster row missing any of them is answered
 *  `false` rather than throwing.
 *  @param {{ name?: string, role?: string, title?: string } | null | undefined} npc
 *  @returns {boolean} */
function isRulerTitled(npc) {
  const text = `${npc?.name || ''} ${npc?.role || ''} ${npc?.title || ''}`.toLowerCase();
  return (NPC_ROLE_ARCHETYPES.ruler?.labels || []).some((label) => text.includes(label));
}

/**
 * §815 — the full RULING CHAIN, three links of one answer ("Who runs this
 * place?"), with HONEST ABSENCE at each link:
 *
 *   power   — the governing POWER (the seat): the ruler entry of THE POWERS
 *             stratum + the settlement's government body. Null when no seat
 *             stands in the data (the chain then starts at its first honest
 *             absence).
 *   faction — the governing faction (governingFactionOf), with the
 *             missing-seat state surfaced (derived from the succession_void
 *             stressor's claimant blocs — see the signal note in the body).
 *   npc     — the named ruling NPC, resolved in the estate's own order:
 *             (1) the governing faction's TOP LADDER RUNG — warSeatBooks'
 *                 rulingSeatId convention (simulation-backed; tick-gated);
 *             (2) a ruler-titled roster NPC (NPC_ROLE_ARCHETYPES.ruler labels),
 *                 preferring one seated IN the governing faction (npcInFaction),
 *                 falling back to a settlement-wide unique ruler title.
 *             NEVER a merely-senior member: showing seniority as rulership
 *             would paper over the §810.3 seat-floor gap the view must record
 *             instead (the warSeatBooks law — no NPC identity is invented).
 *   absence — when npc is null: a MISSING-SEAT story when the vacancy is the
 *             stressor's (the seat stands empty; claimants circle — read from
 *             the claimant blocs the stressor injects), else the honest
 *             pre-density line (§810.3 R12/R15 are not yet generation law;
 *             TE-DENSITY-1 is censusing the gap).
 *
 * @param {RulingChainSettlement | null | undefined} settlement
 * @returns {{
 *   power: { name: string, archetype: string, powerLabel: string, government: string | null } | null,
 *   faction: { name: string, power: number, powerLabel: string, vacant: boolean } | null,
 *   npc: { name: string, role: string, via: 'ladder' | 'roster' } | null,
 *   absence: { kind: 'missing_seat' | 'unrecorded', claimants: string[], line: string } | null,
 * }}
 */
export function rulingChainOf(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const governing = /** @type {StrataFaction | null} */ (governingFactionOf(settlement));
  const government = typeof ps.government === 'string' && ps.government ? ps.government : null;

  const power = governing
    ? { name: nameOf(governing), archetype: factionArchetype(governing), powerLabel: governing.powerLabel || '', government }
    : null;
  // THE MISSING-SEAT SIGNAL: the succession_void stressor ALWAYS injects its
  // claimant blocs ('Claimant …' in the generator's own naming, both branches),
  // alongside the governing faction's 'vacant' modifier — so claimant-presence
  // is the same generation-time predicate, read through nameOf alone (the
  // observed-shape ratchet holds this file to corpus-groundable reads; the
  // `modifiers` marker has a writer the corpus never exercises). When R13's
  // typed missing-seat stressor family lands, the view keys on THAT — the gap
  // is recorded for TE-DENSITY-1, not papered over here.
  const claimants = factions.map((f) => nameOf(f)).filter((n) => /claimant/i.test(n));
  const vacant = claimants.length > 0;
  const faction = governing
    ? { name: nameOf(governing), power: num(governing.power), powerLabel: governing.powerLabel || '', vacant }
    : null;

  // (1) The ladder-backed ruler — the governing faction's top rung.
  let npc = null;
  if (governing && hasLadder(settlement)) {
    const rungs = ladderRungsOf(settlement, ladderFactionKeyOf(governing));
    if (rungs.length > 0 && !vacant) {
      npc = { name: rungs[0].name, role: 'first of the governing house', via: /** @type {'ladder'} */ ('ladder') };
    }
  }
  // (2) A ruler-titled roster NPC (generation-time; never merely-senior).
  if (!npc && governing && !vacant) {
    const roster = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
    const rulers = roster.filter((n) => n && !n.ousted && isRulerTitled(n));
    const fkey = ladderFactionKeyOf(governing);
    const seated = rulers.find((n) => npcInFaction(n, governing, fkey, factions));
    const chosen = seated || (rulers.length === 1 ? rulers[0] : null);
    if (chosen) {
      npc = { name: String(chosen.name || ''), role: String(chosen.role || chosen.title || 'ruler'), via: /** @type {'roster'} */ ('roster') };
    }
  }

  // (3) Honest absence — the stressor's story, or the pre-density truth.
  let absence = null;
  if (!npc) {
    if (vacant) {
      const line = `The seat stands empty; ${claimants.length === 1 ? 'a claimant circles' : `${claimants.length} claimants circle`}: ${claimants.join(', ')}.`;
      absence = { kind: /** @type {'missing_seat'} */ ('missing_seat'), claimants, line };
    } else if (governing) {
      absence = {
        kind: /** @type {'unrecorded'} */ ('unrecorded'),
        claimants: [],
        line: 'No named seat-holder stands in the record. The chain ends, honestly, at the faction.',
      };
    }
  }

  return { power, faction, npc, absence };
}
