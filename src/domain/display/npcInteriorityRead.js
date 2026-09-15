/**
 * domain/display/npcInteriorityRead.js — INTERIORITY-LITE (DESIGN_VISION_WAVE V-24c).
 *
 * A PURE derived "disposition & wants" projection per named NPC, composed ENTIRELY from state
 * that already exists — goals, traits, and standing (player-safe), plus, for the DM, bonds,
 * grudges, and credibility drawn from the engine sidecar. It is a READ-MODEL, never new state:
 * the DM sees who wants what and how they are disposed; the engine stores NOTHING new. (This is
 * the ratified honest form of the old "inner lives" seed — a full inner-life simulation would
 * violate the world-only / simplicity boundary; this composes a display projection instead.)
 *
 * SECRETS-SEAM-SAFE: the DM-truth block (bonds / grudges / credibility / covert marks) is gated
 * behind `includeGroundTruth`. A non-DM audience receives ONLY the player-safe disposition &
 * wants — never a covert mark, a hidden bond, or a private grudge. Callers on a shared/gallery
 * surface pass includeGroundTruth=false (or omit it — it defaults to hidden, fail-closed).
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; ZERO persisted writes (it only
 * reads); inert-not-crash on absent/garbage inputs; every list codepoint-stable. Lazy display
 * leaf — byte-inert to the engine and its goldens.
 *
 * ── ⛔ LT39 car 5: THE LADDER LEDGER IS KEYED BY SETTLEMENT, AND THIS FILE DID NOT KNOW IT ─
 * `standingsOf` below used to read `ladder.npcs[nid]` — one level short. The engine's own
 * writer persists `spatialLedgers.npcLadder` as `{ [settlementId]: LadderRecord }`, and a
 * LadderRecord is `{ factions, npcs, contests?, seatTransitions? }`
 * (npcLadderKernel.appendNpcLadderSeatTransition and its PERSIST fold; every engine reader —
 * warSeatBooks `ladder[actorId].npcs[rulerId]`, treatySuccession `ladder[settlementId]`,
 * thirdPartyRansom, regenIdentityFold — walks that shape). So against a REAL world the DM
 * bonds/grudges block resolved nothing at all. Its unit test did not catch it because the
 * fixture had been written to the READER'S assumption rather than to the WRITER'S shape, which
 * is the assertion-that-cannot-fail family: the arm was green and the block was dead.
 *
 * The reader now walks the settlement records, and still accepts the flat `{ npcs: … }` shape so
 * the legacy fixture and any hand-made ledger keep resolving. NOTHING RENDERED DIFFERENTLY THE
 * DAY THIS LANDED: `npcComponents.jsx` calls `npcInteriority({ npc })` with no worldState and no
 * includeGroundTruth, so the whole DM block was unmounted anyway — the repair is what makes the
 * new trail below able to find anything, and it is recorded rather than slipped in.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { strongestBond, bondedPeersAbove } from '../worldPulse/npcLadderState.js';
import { npcCredibilityScoreOf, hasNpcCredibilityLedger } from '../worldPulse/npcCredibility.js';

/** The display NPC's own coarse standing signal → a stance word. */
const INFLUENCE_WORD = Object.freeze({ high: 'commanding', moderate: 'established', low: 'marginal' });

/** @param {unknown} v @returns {boolean} */
function nonEmpty(v) { return typeof v === 'string' && v.trim().length > 0; }

/** @param {unknown} v @returns {Record<string, unknown>} */
function asRecord(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {number|null} */
function weekOrNull(v) {
  return Number.isFinite(v) ? Math.max(0, Math.floor(Number(v))) : null;
}

/**
 * THE LADDER RECORDS in a persisted ledger, in codepoint order of their settlement key.
 *
 * TWO SHAPES ARE ADMITTED, DELIBERATELY. The engine persists
 * `{ [settlementId]: { factions, npcs, contests?, seatTransitions? } }`; a hand-made or legacy
 * ledger may carry the record FLAT (`{ npcs: … }`) with no settlement key above it. A record is
 * recognised by carrying any of the record's own sub-keys, so neither shape has to be declared
 * by the caller.
 * @param {unknown} ledger
 * @returns {Array<Record<string, unknown>>}
 */
function ladderRecordsOf(ledger) {
  const root = asRecord(ledger);
  const isRecord = (/** @type {Record<string, unknown>} */ r) => (
    'npcs' in r || 'factions' in r || 'contests' in r || 'seatTransitions' in r
  );
  if (isRecord(root)) return [root];
  return Object.keys(root).sort(compareCodepoint).map((k) => asRecord(root[k])).filter(isRecord);
}

/** First non-empty string among the candidates (unwrapping a { short } goal object). Pure.
 *  @param {...unknown} vals @returns {string|null} */
function firstText(...vals) {
  for (const v of vals) {
    if (nonEmpty(v)) return /** @type {string} */ (v).trim();
    if (v && typeof v === 'object' && nonEmpty(/** @type {{ short?: unknown }} */ (v).short)) {
      return String(/** @type {{ short: unknown }} */ (v).short).trim();
    }
  }
  return null;
}

/** Dedupe (case-insensitive) while preserving first-seen order. @param {(string|null)[]} xs @returns {string[]} */
function dedupe(xs) {
  const seen = new Set();
  /** @type {string[]} */
  const out = [];
  for (const x of xs) {
    if (!nonEmpty(x)) continue;
    const k = /** @type {string} */ (x).toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(/** @type {string} */ (x));
  }
  return out;
}

/** A credibility band word from a signed score (0 = neutral). Pure. @param {number} score @returns {string} */
export function npcCredibilityWord(score) {
  const s = typeof score === 'number' && Number.isFinite(score) ? score : 0;
  if (s >= 4) return 'trusted';
  if (s <= -4) return 'doubted';
  return 'even';
}

/**
 * ⭐ THE NPC TRAIL (LT39 car 5) — "who this NPC betrayed", from the archive that already
 * holds the answer and had no reader outside the engine.
 *
 * npcStates carry NO history array at all (npcAgency.ensureNpcStates), which is exactly what
 * the roadmap means by "NPCs have a thinner trail". SO NO TRAIL IS MINTED HERE. What IS
 * persisted is the LADDER'S: `contests` (a head-to-head goal contest, with its opened week,
 * its resolved week, its outcome and the nid that lost) and `seatTransitions` (a real
 * governing-seat change, with its cause and its tick). Both were read by the engine alone
 * — treatySuccession walks seatTransitions and nothing walks contests — so a DM could never
 * see the dated record of a rivalry the simulation had been keeping all along.
 *
 * DATED AND SIDED. A contest row says which side this NPC stood on and, once resolved,
 * whether it lost; a seat row says whether the NPC took the seat or left it. An UNRESOLVED
 * contest is reported as still open rather than given an ending the record does not have.
 *
 * ⛔ NO LADDER KEY REACHES A READER. A ladder nid is the composite `<settlementId>:<npc id
 * or slug>`, which is an engine key, not a name. The caller may hand in `resolveNpcName` (the
 * settlement's own persisted `npcLadder` mirror already pairs npcId with name); when it
 * resolves nothing the sentence simply says "a rival" or "another" and the raw nid stays on
 * the row as `otherNid` for a surface that CAN resolve it. Printing the key was never an
 * option.
 *
 * Deterministic: oldest first by week, then by the row's own stable id. Pure; reads only.
 * @param {Array<Record<string, unknown>>} records  the ladder records (see ladderRecordsOf)
 * @param {string} nid
 * @param {(nid: string) => (string|null)} resolveNpcName
 * @returns {Array<{ week: number|null, kind: 'contest'|'seat', text: string, id: string, otherNid: string|null }>}
 */
function ladderTrailOf(records, nid, resolveNpcName) {
  const nameOf = (/** @type {unknown} */ other) => {
    if (!nonEmpty(other)) return null;
    const resolved = resolveNpcName(String(other));
    return nonEmpty(resolved) ? String(resolved).trim() : null;
  };
  /** @type {Array<{ week: number|null, kind: 'contest'|'seat', text: string, id: string, otherNid: string|null }>} */
  const rows = [];
  for (const record of records) {
    const contests = asRecord(record.contests);
    for (const key of Object.keys(contests).sort(compareCodepoint)) {
      const c = asRecord(contests[key]);
      const a = asRecord(c.a);
      const b = asRecord(c.b);
      const mine = String(a.nid) === nid ? a : String(b.nid) === nid ? b : null;
      if (!mine) continue;
      const rivalNid = mine === a ? b.nid : a.nid;
      const rivalName = nameOf(rivalNid);
      const opposed = c.kind === 'opposed';
      const resolved = weekOrNull(c.resolvedWeek);
      const lost = nonEmpty(c.loserNid) && String(c.loserNid) === nid;
      const id = nonEmpty(c.id) ? String(c.id) : key;
      const opening = opposed
        ? `Contested ${rivalName || 'a rival'}`
        : `Pushed the same end as ${rivalName || 'another'}`;
      const ending = resolved == null
        ? ', and it is not settled yet'
        : lost ? ', and lost' : ', and did not lose';
      rows.push({
        week: weekOrNull(c.openedWeek),
        kind: 'contest',
        id: `contest:${id}`,
        otherNid: nonEmpty(rivalNid) ? String(rivalNid) : null,
        text: `${opening}${ending}.`,
      });
    }
    const transitions = Array.isArray(record.seatTransitions) ? record.seatTransitions : [];
    for (const raw of transitions) {
      const t = asRecord(raw);
      const took = String(t.toRulerId) === nid;
      const left = String(t.fromRulerId) === nid;
      if (!took && !left) continue;
      const cause = nonEmpty(t.cause) ? String(t.cause).replace(/_/g, ' ') : 'a change nobody recorded a reason for';
      const other = took ? t.fromRulerId : t.toRulerId;
      const otherName = nameOf(other);
      const counterpart = otherName
        ? `${took ? 'from' : 'to'} ${otherName}`
        : nonEmpty(other)
          ? `${took ? 'from whoever held it before' : 'to whoever holds it now'}`
          : (took ? 'from a vacant seat' : 'and the seat stood empty');
      rows.push({
        week: weekOrNull(t.tick),
        kind: 'seat',
        id: `seat:${nonEmpty(t.id) ? String(t.id) : `${t.tick}:${t.cause}`}`,
        otherNid: nonEmpty(other) ? String(other) : null,
        text: `${took ? 'Took the governing seat' : 'Left the governing seat'} ${counterpart} — ${cause}.`,
      });
    }
  }
  return rows.sort((x, y) => (x.week ?? -1) - (y.week ?? -1) || compareCodepoint(x.id, y.id));
}

/**
 * The DM-truth relational block for one NPC, read from the engine sidecar. Bonds/grudges/
 * credibility live in worldState.spatialLedgers (npcLadder / npcCredibility) — DM truth by
 * construction (the display mirror deliberately drops them). Returns null when there is no
 * sidecar or no record for `nid`. Pure; read-only.
 * @param {unknown} worldState @param {string} nid @param {number} tick
 * @param {(nid: string) => (string|null)} resolveNpcName
 * @returns {{ bonds: Array<{ nid: string, kind: string, sev: number }>, grudges: Array<{ nid: string, kind: string, sev: number }>, credibility: { score: number, band: string } | null, trail?: Array<{ week: number|null, kind: 'contest'|'seat', text: string, id: string, otherNid: string|null }> } | null}
 */
function relationalGroundTruth(worldState, nid, tick, resolveNpcName) {
  if (!nid) return null;
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  /** @type {Array<{ nid: string, kind: string, sev: number }>} */
  let bonds = [];
  /** @type {Array<{ nid: string, kind: string, sev: number }>} */
  let grudges = [];
  /** @type {Array<{ week: number|null, kind: 'contest'|'seat', text: string, id: string, otherNid: string|null }>} */
  let trail = [];
  if (hasSpatialLedger(ws, 'npcLadder')) {
    const records = ladderRecordsOf(getSpatialLedger(ws, 'npcLadder'));
    const st = /** @type {import('../worldPulse/npcLadderKernel.js').LadderStanding|null} */ (
      records.map((r) => asRecord(r.npcs)[nid]).find(Boolean) || null);
    trail = ladderTrailOf(records, nid, resolveNpcName);
    if (st) {
      const strongest = strongestBond(st);
      // The full bonded set (strongest-first); strongestBond is the headline, kept in the list.
      bonds = bondedPeersAbove(st, 0);
      if (strongest && !bonds.length) bonds = [strongest];
      const g = /** @type {Record<string, { sev?: number, kind?: string }>} */ (/** @type {{ grudges?: unknown }} */ (st).grudges || {});
      grudges = Object.keys(g).sort(compareCodepoint).map((to) => ({
        nid: to, kind: typeof g[to]?.kind === 'string' ? String(g[to].kind) : 'grudge',
        sev: typeof g[to]?.sev === 'number' && Number.isFinite(g[to].sev) ? Number(g[to].sev) : 0,
      }));
    }
  }
  /** @type {{ score: number, band: string } | null} */
  let credibility = null;
  if (hasNpcCredibilityLedger(ws)) {
    const score = npcCredibilityScoreOf(ws, nid, Number(tick) || 0);
    if (typeof score === 'number' && Number.isFinite(score) && score !== 0) {
      credibility = { score, band: npcCredibilityWord(score) };
    }
  }
  if (!bonds.length && !grudges.length && !credibility && !trail.length) return null;
  return { bonds, grudges, credibility, ...(trail.length ? { trail } : {}) };
}

/**
 * The "disposition & wants" projection for ONE named NPC. Player-safe by default; the DM-truth
 * block is added only when includeGroundTruth is true (secrets-seam-safe). Returns null when the
 * NPC yields nothing to show. Pure; read-only; inert on garbage.
 * @param {Object} args
 * @param {Record<string, unknown>} args.npc  the display NPC object
 * @param {unknown} [args.worldState]  the engine sidecar source (DM-truth bonds/grudges/credibility)
 * @param {string} [args.nid]  the NPC's ladder id (needed for the sidecar reads)
 * @param {number} [args.tick]  current tick (credibility decay)
 * @param {boolean} [args.includeGroundTruth]  DM view ⇒ true (covert + relational truth)
 * @param {(nid: string) => (string|null)} [args.resolveNpcName]  ladder nid → a person's NAME, so
 *   the trail never prints an engine key; unresolved ⇒ the sentence names nobody
 * @returns {{ present: boolean, wants: string[], disposition: string[], groundTruth?: Record<string, unknown> } | null}
 */
export function npcInteriority({
  npc, worldState, nid, tick = 0, includeGroundTruth = false, resolveNpcName = () => null,
} = /** @type {never} */ ({})) {
  const n = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc) : null;
  if (!n) return null;
  const p = /** @type {Record<string, unknown>} */ (n.personality && typeof n.personality === 'object' && !Array.isArray(n.personality) ? n.personality : {});

  // WANTS (player-safe): the NPC's visible ambition — its goal, ambition, and ideal.
  const wants = dedupe([
    firstText(n.goal, n.goals),
    firstText(p.ambition, p.ambitions, n.ambition, n.ambitions),
    firstText(p.ideal, p.ideals, n.ideal, n.ideals),
  ]);

  // DISPOSITION (player-safe): the NPC's visible stance — temperament, standing, loyalty, fear.
  const disposition = dedupe([
    firstText(p.dominant, n.temperament),
    (/** @type {Record<string, string>} */ (INFLUENCE_WORD))[String(n.influence)] || null,
    firstText(n.loyalty, n.loyalties),
    firstText(n.fear, n.fears),
  ]);

  /** @type {{ present: boolean, wants: string[], disposition: string[], groundTruth?: Record<string, unknown> }} */
  const out = { present: wants.length > 0 || disposition.length > 0, wants, disposition };

  if (includeGroundTruth) {
    // COVERT / DM-only marks (never surfaced to a non-DM audience): the compromise stance + the
    // gm secret, plus the relational truth (bonds / grudges / credibility) from the sidecar.
    const compromised = n.corrupt ? 'compromised' : (n.ousted ? 'exposed' : null);
    const secretRaw = typeof n.secret === 'string' ? n.secret : firstText(/** @type {{ what?: unknown }} */ (n.secret || {}).what);
    const relational = relationalGroundTruth(worldState, String(nid || ''), tick, resolveNpcName);
    /** @type {Record<string, unknown>} */
    const gt = {};
    if (compromised) gt.compromised = compromised;
    if (nonEmpty(secretRaw)) gt.secret = /** @type {string} */ (secretRaw).trim();
    if (relational) Object.assign(gt, relational);
    if (Object.keys(gt).length) { out.groundTruth = gt; out.present = true; }
  }

  return out.present ? out : null;
}
