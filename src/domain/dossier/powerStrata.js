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
 * @property {PowerRole | null} powerRole  'ruler' (holds the seat), 'contender' (contests it), or null.
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
  /** @type {Map<string, PowerRole>} */
  const powerNames = new Map();
  /** @param {PowerEntry} entry */
  const pushPower = (entry) => {
    if (!entry.name || powerNames.has(entry.name)) return;
    powerNames.set(entry.name, entry.role);
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
      // "Holds power" is the ruler's word alone; a contender contests the seat.
      powerRole: (name && powerNames.get(name)) || null,
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
 * THE SEAT IS READ BY ONE LEAF (lane RULERS, 2026-11-03). The chain used to guess
 * the seat from npcAgency's ruler labels, a list with no 'elder' and a substring
 * test ('chief' caught Chief Magistrate, 'lord' caught Crime Lord), and when the
 * guess found nobody it seated any lone ruler-titled person in the settlement:
 * 64 of 64 thorps read no seat-holder beside their Elder, and 12 of 63 hamlets
 * seated the Manor Household's unnamed "The Lord Mayor". seatHolder.js reads the
 * generator's own head titles instead, whole words, governing faction only, no
 * stand-ins, and the settlement-wide fallback is gone.
 */
import { seatCandidatesOf, isOfficeStandIn } from './seatHolder.js';
import { hasLadder, ladderRungsOf, ladderFactionKeyOf } from '../townMap/ladderRead.js';

/**
 * The seat's candidates, best first (seatHolder.js :: seatCandidatesOf), less anyone
 * ousted in play: the chain read `ousted` off the roster here from the day it landed,
 * and the seat's self-check reads the same list so the two never disagree.
 * @param {RulingChainSettlement | null | undefined} settlement
 * @returns {import('./seatHolder.js').SeatNpc[]}
 */
export function liveSeatCandidatesOf(settlement) {
  return seatCandidatesOf(settlement).filter((n) => !(/** @type {{ ousted?: unknown }} */ (n)).ousted);
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
 *             (2) the seat-holder (liveSeatCandidatesOf, through seatHolder.js): the governing
 *                 faction's named member whose role carries one of the
 *                 generator's head titles, in its precedence. Never another
 *                 faction's person, never an office stand-in.
 *             NEVER a merely-senior member: showing seniority as rulership
 *             would paper over the §810.3 seat-floor gap the view must record
 *             instead (the warSeatBooks law — no NPC identity is invented).
 *   absence — when npc is null: a MISSING-SEAT story when the vacancy is the
 *             stressor's (the seat stands empty — read from the governing
 *             faction's `vacant` modifier; the claimants the record names
 *             as such circle it), else the honest
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
  // THE MISSING-SEAT SIGNAL is the record's own VACANCY FACT: the succession_void
  // stressor writes 'vacant' onto the governing faction's `modifiers`
  // (stressFactions.js :: applyStressEventFactions), and that fact, never a name,
  // says the seat stands empty. This read keyed on claimant NAMES ('Claimant …')
  // until RUNG1-TRUTH unit D (6da7d3f64) gave a non-royal vacancy's claimants
  // pool names, after which it never fired: 20 of 1,000 thorps held a vacant seat
  // and none said so (LANDING-7 lane G, second seat, ruling R-G1, 2026-11-06).
  // The claimants are still listed only where the record names them as claimants
  // (the royal branch's 'Noble Claimant …'); a pool-named claimant carries no
  // claimant marker, so the line then says only that the succession is unsettled.
  // When R13's typed missing-seat stressor family lands, the view keys on THAT.
  const vacant = !!governing && Array.isArray(governing.modifiers) && governing.modifiers.includes('vacant');
  const claimants = vacant ? factions.map((f) => nameOf(f)).filter((n) => /claimant/i.test(n)) : [];
  const faction = governing
    ? { name: nameOf(governing), power: num(governing.power), powerLabel: governing.powerLabel || '', vacant }
    : null;

  // (1) The ladder-backed ruler — the governing faction's top rung.
  let npc = null;
  if (governing && hasLadder(settlement)) {
    const rungs = ladderRungsOf(settlement, ladderFactionKeyOf(governing));
    const roster = /** @type {unknown[]} */ (Array.isArray(settlement?.npcs) ? settlement.npcs : []);
    const top = rungs[0];
    const topRow = top ? roster.find((n) => !!n && typeof n === 'object' && /** @type {{ name?: unknown }} */ (n).name === top.name) : undefined;
    const standIn = !!topRow && isOfficeStandIn(/** @type {import('./seatHolder.js').SeatNpc} */ (topRow));
    if (top && !vacant && !standIn) {
      npc = { name: top.name, role: 'first of the governing house', via: /** @type {'ladder'} */ ('ladder') };
    }
  }
  // (2) The seat-holder (generation-time; never merely-senior, never a stand-in).
  if (!npc && governing && !vacant) {
    const chosen = liveSeatCandidatesOf(settlement)[0] || null;
    if (chosen) {
      npc = { name: String(chosen.name || ''), role: String(chosen.role || ''), via: /** @type {'roster'} */ ('roster') };
    }
  }

  // (3) Honest absence — the stressor's story, or the pre-density truth.
  let absence = null;
  if (!npc) {
    if (vacant) {
      // The row's own label is "The seat", so the line opens on the verb: the row
      // read "The seat The seat stands empty" while it opened on the noun.
      const line = claimants.length === 0
        ? 'Stands empty; the succession is unsettled.'
        : `Stands empty; ${claimants.length === 1 ? 'a claimant circles' : `${claimants.length} claimants circle`}: ${claimants.join(', ')}.`;
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

// ── WHO REALLY GOVERNS — the fracture note names the rival or goes ───────────

/**
 * The generator's fixed claim (factionDynamics.js :: applyLegitimacyMultipliers,
 * re-applied by the economy reconciliation) attached to the governing faction
 * whenever public legitimacy falls below the contested cut. It names nobody, and
 * on the audit's 389 no stronger rival existed in 18 of 110 cases.
 */
export const APPEARS_TO_GOVERN = 'Holds the title, but the decisions that matter are made elsewhere.';

/**
 * The faction that outranks the governing faction on the power figures: the
 * strongest non-governing faction whose power is strictly greater, first in the
 * settlement's own order on a tie. Null when the governing faction is strongest,
 * or when there is no governing faction.
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @returns {string | null}
 */
export function outrankingRivalOf(settlement) {
  const governing = governingFactionOf(settlement);
  if (!governing) return null;
  const factions = /** @type {StrataFaction[]} */ (Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : []);
  const floor = num(governing.power);
  /** @type {StrataFaction | null} */
  let best = null;
  for (const f of factions) {
    if (f === governing || nameOf(f) === nameOf(governing)) continue;
    if (num(f.power) > (best ? num(best.power) : floor)) best = f;
  }
  return best ? nameOf(best) || null : null;
}

/**
 * X-50 (BOILERPLATE ONCE): a note with every sentence the tab already prints elsewhere
 * dropped, so a sentence has one home per tab. Only whole sentences, matched verbatim.
 * @param {string} note
 * @param {ReadonlyArray<string>} shown sentences the tab prints in another block
 * @returns {string}
 */
export function withoutShownSentences(note, shown) {
  if (!note || !shown.length) return note;
  return note.split(/(?<=[.!?])\s+/)
    .filter((sentence) => !shown.includes(sentence.trim()))
    .join(' ').trim();
}

/**
 * A faction's crisis note as the dossier prints it. The "appears to govern" claim
 * stays only on the governing faction and only when a rival outranks it, and then
 * it names that rival; otherwise the sentence is dropped and the rest of the note
 * (the fracture reading) stands.
 * @param {RulingPowerSettlement | null | undefined} settlement
 * @param {{ crisisNote?: unknown } | null | undefined} faction
 * @returns {string}
 */
export function crisisNoteFor(settlement, faction) {
  const note = typeof faction?.crisisNote === 'string' ? faction.crisisNote : '';
  if (!note.includes(APPEARS_TO_GOVERN)) return note;
  const governing = governingFactionOf(settlement);
  const rival = governing && faction === governing ? outrankingRivalOf(settlement) : null;
  const said = rival ? `Holds the title; the decisions that matter are made by ${rival}.` : '';
  return note.replace(APPEARS_TO_GOVERN, said).replace(/\s{2,}/g, ' ').trim();
}
