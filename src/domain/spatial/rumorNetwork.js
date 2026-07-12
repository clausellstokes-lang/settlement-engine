/**
 * rumorNetwork.js — STEP 3.5: RUMORS & NEWS, the TRADE-carrier information layer
 * (design §4f + PART III + PART V §V.3 + PART VI §VI.2-1; playbook PART 3).
 *
 * News stops being omniscient: a significant event enters the rumor network at
 * the settlements that WITNESSED it and travels HOP-BY-HOP over the confirmed
 * TRADE edges of the regional graph, arriving hopWeeks() later (the same frozen
 * distance law 5.5-M's arrival queue rides — a rumor IS a delayed arrival with
 * a payload). Each settlement keeps a bounded ledger of what it has heard:
 *
 *   worldState.rumorLedgers = { [settlementId]: { [eventKey]: ArrivalRecord } }
 *
 * a NEW conditionally-materialized worldState key (NEVER a WizardNewsEntry
 * schema change — campaign.wizardNews is written for every campaign; touching
 * its schema breaks dormancy, PART III §III.2-3). Object-keyed at both levels
 * so deepCloneConditionalLedger accepts it; codepoint-sorted keys so the
 * serialized bytes are order-independent.
 *
 * THE TWO INFO MODES (simulationRules.infoMode — the §11 control):
 *   • 'perfect_delayed' — PERFECT-BUT-DELAYED, the §11 sleeper: latency ONLY.
 *     No rolls, no vector decay — completeness/accuracy stay 1.0 and NOTHING
 *     forks rng (timeliness is deterministic arithmetic). The strategic payoff
 *     (staleness→risk) without the misinformation burden.
 *   • 'unreliable'      — UNRELIABLE NEWS: the §4f CONTENT+TRUST vector with
 *     round-13 ORGANIC degradation — a seeded PRNG roll per hop, a DISTRIBUTION
 *     with tails (rare perfect preservation, rare severe garble), forked
 *     `rumor-organic:${eventId}:${carrierId}:${edgeId}:${hop}` off the pulse
 *     rng confluence (pulseKernel.js). Completeness decay hides low-salience
 *     FIELDS (the read model derives field visibility from completeness01);
 *     accuracy mutation is BOUNDED (magnitude band shifts; name-swaps only to
 *     REAL in-world settlement ids from the frozen digest).
 *   • 'omniscient' (default) / no spatial-canon marker ⇒ DORMANT: this module
 *     returns unchanged state, forks nothing, and materializes ZERO new keys —
 *     an untouched campaign stays byte-identical. Flipping BACK to omniscient
 *     PRESERVES an existing ledger (§11: turning a layer off never deletes).
 *
 * LINEAGE — THE NON-DEFERRABLE FIELD (PART VI §VI.2-1). Every arrival record
 * carries `lineageIds[]` rooted at the CANONICAL event id (the wizardNews
 * sourceEventId → graph.eventLog sourceEvent.id substrate); every relay appends
 * its telling. Corroboration counts INDEPENDENT LINEAGES, never arrivals
 * (PART V §V.3, the false-corroboration fix): five relays of one origin all
 * share one origin telling ⇒ independence 1; only a telling descending from a
 * DIFFERENT witness raises it. A relayed packet carries ONLY its own telling's
 * origin root (never the relayer's merged corroboration), so echo chains can
 * never inflate confidence.
 *
 * DETERMINISM DISCIPLINES (PART III §III.2-5/6): CONTINUATION guard
 * per-(event,carrier,settlement) — the persisted `relayedTick` stamp, a
 * settlement re-emits a telling exactly once; RECORDING per-(event,settlement,
 * carrier) — the ledger key `trade:${eventRef}`, later arrivals field-MERGE
 * deterministically; total-order folds before every top-K; tick-age expiry,
 * NEVER createdAt (records carry no wall-clock field at all); codepoint sorts
 * before every draw and every rebuild. PROSPECTIVE application (§11): on an
 * infoMode change the rulesetLog receipt tick is the seeding floor — historical
 * reports never gain lineage retroactively.
 *
 * PURE + lazy: imported only by the dynamically-loaded sim (pulseKernel), and
 * pulls only the light distanceRead reader + the eager rules accessor — zero
 * first-paint bytes. No Date, no Math.random, no tier/auth reads.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { activeSpatialDigest, hopWeeks } from './distanceRead.js';
import { infoModeOf } from '../worldPulse/simulationRules.js';

// ── The tuning constants (documented here; retuned in the checkpoint soak) ───

/** The one carrier this wave ships (armies/refugees/faith/courier/criminal/
 *  magic ship WITH their movers, post-checkpoint — scope law §3.1). */
export const RUMOR_CARRIER_TRADE = 'trade';

/** The regional-graph channel types merchant traffic rides (the P0 economic
 *  set): a confirmed channel of any of these types carries news BOTH ways
 *  (caravans come and go over a directed commercial edge). */
export const RUMOR_TRADE_CHANNEL_TYPES = Object.freeze([
  'export_market', 'trade_dependency', 'trade_route',
]);

/** Per-settlement information budget (PART V §V.3): a settlement holds only its
 *  top-K live rumors. K=24 initial; tune in soak. */
export const RUMOR_TOP_K = 24;

/** Tick-age expiry — a telling lives this many ticks in the LOCAL rumor mill
 *  from the tick it ARRIVED (major news entrenches ~half a year; notable news
 *  fades within a season). NEVER wall-clock. */
export const RUMOR_TTL_TICKS = Object.freeze({ major: 26, notable: 13 });

/** The significance gate (§3.2-3): every 'major' enters the network; a
 *  'notable' needs this salience score (the wizardNews scoreImpact scale).
 *  Routine ticks ("+3 residents") never leave town. */
export const RUMOR_NOTABLE_SCORE_FLOOR = 60;

/** Seeding looks back this many ticks over the composed feed so events applied
 *  BETWEEN pulses (an approved proposal lands mid-interval) still enter the
 *  network at the next pulse. Idempotent: an already-seeded event key at its
 *  witness is never re-seeded. */
export const RUMOR_SEED_LOOKBACK_TICKS = 4;

/** How far a telling travels before fading (score modulates hop budget):
 *  major 4 hops (5 for a realm-shaking score), notable 2.
 *  @param {{ significance?: string, score?: number } | null | undefined} record */
export function maxHopsFor(record) {
  if (record && record.significance === 'major') {
    return Number(record.score) >= 95 ? 5 : 4;
  }
  return 2;
}

/** The fidelity floor — a telling never degrades below this (a garbled rumor
 *  is still "something happened near X", never zero information). */
export const RUMOR_FIDELITY_FLOOR = 0.05;

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * The degradable STRUCTURED content of a telling (§4f: who/what/where/when/
 * magnitude/cause as FIELDS — free prose is NEVER copied into a packet, so a
 * headline can never leak through the projection). `deityName`/`causeClass`
 * are captured only from explicit structured fields on the feed entry;
 * the player projection value-scrubs both (settlementRumors.js).
 * @typedef {Object} RumorContent
 * @property {string} what          impact-kind token (e.g. 'import_shortage')
 * @property {string} whereId       primary settlement id
 * @property {string} scope         'settlement' | 'regional' | 'realm'
 * @property {number} magnitude     severity band 0..3 (mutable ±1 per garble)
 * @property {string[]} partyIds    involved settlement ids (swap-mutable)
 * @property {string | null} causeClass  DM-only; dropped from player views
 * @property {string | null} deityName   gated to ACTIVATED public snapshots
 */

/**
 * One settlement's knowledge of one event via one carrier (the RECORDING key
 * is per-(event,settlement,carrier) — §III.2-6). A record with
 * arrivalTick > current tick is IN TRANSIT (parked in its destination ledger,
 * the arrival-queue idiom): invisible to the read model until it arrives.
 * @typedef {Object} RumorArrivalRecord
 * @property {string} eventRef      the canonical event id (lineage ROOT)
 * @property {number} eventTick     when the event happened (timeliness axis)
 * @property {string} carrier       'trade'
 * @property {number} arrivalTick   when this telling arrives/arrived here
 * @property {number} hopCount      0 = witnessed firsthand
 * @property {string[]} lineageIds  [eventRef, originTelling, ...relayTellings]
 * @property {string[]} corroborationRoots  sorted INDEPENDENT origin tellings
 * @property {{originId: string, relayIds: string[]}} provenance
 * @property {number} completeness01
 * @property {number} accuracy01
 * @property {string[]} framing     carrier-bias tags ('merchant' for trade)
 * @property {string} significance  'major' | 'notable'
 * @property {number} score
 * @property {RumorContent} content
 * @property {number | null} relayedTick  the continuation-guard stamp
 */

/** @typedef {Record<string, RumorArrivalRecord>} RumorLedger */
/** @typedef {Record<string, RumorLedger>} RumorLedgers */

/**
 * A feed entry as the seeder tolerantly reads it (the committed
 * WizardNewsEntry shape plus the two forward structured fields).
 * @typedef {{ id?: string, tick?: number, significance?: string, score?: number,
 *   severity?: number, scope?: string, kind?: string, impactKind?: string | null,
 *   settlementIds?: Array<string | number>, sourceEventId?: string | null,
 *   tags?: string[], causeClass?: string, deityName?: string }} RumorSeedEntry
 */

/** The rng surface this module consumes (the kernel PRNG's fork/draw subset). */
/** @typedef {{ fork: (label: string) => RumorRng, random: () => number,
 *   chance: (p: number) => boolean, randInt: (min: number, max: number) => number }} RumorRng */

/** One rulesetLog receipt as the prospective floor reads it. */
/** @typedef {{ tick?: number, changedKeys?: string[], to?: Record<string, unknown> }} RulesetReceiptRead */

/**
 * The worldState members this module reads (tolerant projection — the kernel
 * hands the full ensured worldState).
 * @typedef {{ rumorLedgers?: unknown, simulationRules?: Record<string, unknown>,
 *   rulesetLog?: Record<string, RulesetReceiptRead>, spatialCanonVersion?: number,
 *   spatialDigest?: import('./distanceRead.js').SpatialDigest }} RumorWorldStateRead
 */

/** The regional-graph slice the relay fan-out reads. */
/** @typedef {{ channels?: Array<{ id?: string | number, type?: string, from?: string | number,
 *   to?: string | number, status?: string }> } | null | undefined} RumorGraphRead */

// ── Small helpers ─────────────────────────────────────────────────────────────

/** @param {unknown} v @returns {RumorLedgers} */
function asLedgers(v) {
  return /** @type {RumorLedgers} */ (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
}

/** @param {unknown} v @returns {RumorLedger} the ONE-settlement inner ledger */
function asLedger(v) {
  return /** @type {RumorLedger} */ (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/** @param {number} band @returns {number} clamp to the 0..3 magnitude bands */
function clampBand(band) {
  return Math.max(0, Math.min(3, Math.round(band)));
}

/** Severity 0..1 → magnitude band 0..3 (faint / notable / serious / grave).
 *  @param {unknown} severity */
export function magnitudeBandOf(severity) {
  const s = finiteNumber(severity, 0);
  if (s >= 0.8) return 3;
  if (s >= 0.55) return 2;
  if (s >= 0.3) return 1;
  return 0;
}

/** The ledger key — RECORDING per-(event,carrier): `trade:${eventRef}`.
 *  @param {string | number} eventRef */
export function rumorEventKey(eventRef) {
  return `${RUMOR_CARRIER_TRADE}:${String(eventRef)}`;
}

/** The hop-0 telling id — one per (event, witness): the independence ROOT.
 *  @param {string} eventRef @param {string} settlementId */
function originTellingId(eventRef, settlementId) {
  return `t0:${eventRef}@${settlementId}`;
}

/**
 * PROSPECTIVE floor (§11, binding): the latest rulesetLog receipt that turned
 * infoMode to a LIVE (non-omniscient) mode. Feed entries older than that tick
 * never seed — historical reports cannot gain lineage retroactively. A world
 * with no such receipt (fixtures, seeds authored directly) floors at 0.
 * @param {RumorWorldStateRead | null | undefined} worldState
 * @returns {number}
 */
export function prospectiveFloorTick(worldState) {
  const log = worldState?.rulesetLog;
  if (!log || typeof log !== 'object' || Array.isArray(log)) return 0;
  let floor = 0;
  for (const key of Object.keys(log)) {
    const rec = log[key];
    if (!rec || !Array.isArray(rec.changedKeys) || !rec.changedKeys.includes('infoMode')) continue;
    const to = rec.to && typeof rec.to === 'object' ? rec.to.infoMode : null;
    const t = Number(rec.tick);
    if (typeof to === 'string' && to !== 'omniscient' && Number.isFinite(t) && t > floor) floor = t;
  }
  return floor;
}

/**
 * The trade neighbours of a settlement over the regional graph: CONFIRMED
 * channels of the trade types, read in BOTH directions (a caravan route
 * carries news both ways), deduped one edge per neighbour (codepoint-first
 * edge id), codepoint-sorted — the deterministic hop fan-out.
 * @param {RumorGraphRead} graph
 * @param {string} settlementId
 * @returns {Array<{ neighbourId: string, edgeId: string }>}
 */
export function tradeNeighbours(graph, settlementId) {
  const channels = Array.isArray(graph?.channels) ? graph.channels : [];
  const sid = String(settlementId);
  /** @type {Map<string, string>} */
  const byNeighbour = new Map();
  for (const channel of channels) {
    if (!channel || channel.status !== 'confirmed') continue;
    if (!RUMOR_TRADE_CHANNEL_TYPES.includes(String(channel.type))) continue;
    const from = String(channel.from);
    const to = String(channel.to);
    const neighbour = from === sid && to !== sid ? to : (to === sid && from !== sid ? from : null);
    if (neighbour == null) continue;
    const edgeId = String(channel.id ?? `edge.${from}.${to}`);
    const prior = byNeighbour.get(neighbour);
    if (prior === undefined || compareCodepoint(edgeId, prior) < 0) byNeighbour.set(neighbour, edgeId);
  }
  return [...byNeighbour.entries()]
    .map(([neighbourId, edgeId]) => ({ neighbourId, edgeId }))
    .sort((a, b) => compareCodepoint(a.neighbourId, b.neighbourId));
}

/**
 * Capture-time content whitelist (§III.2-4's first layer): ONLY structured
 * fields are copied off a feed entry — never headline/summary/tags/reasons
 * prose — so an arrival record cannot carry a latent deity name or covert tag
 * unless the entry declared it in a structured, scrub-gated field.
 * @param {RumorSeedEntry} entry
 * @returns {RumorContent}
 */
function captureContent(entry) {
  const ids = [...new Set((entry.settlementIds || []).filter((v) => v != null && v !== '').map(String))].sort(compareCodepoint);
  return {
    what: String(entry.impactKind || entry.kind || 'stirring'),
    whereId: ids.length ? ids[0] : '',
    scope: String(entry.scope || 'regional'),
    magnitude: magnitudeBandOf(entry.severity),
    partyIds: ids,
    causeClass: typeof entry.causeClass === 'string' && entry.causeClass ? entry.causeClass : null,
    deityName: typeof entry.deityName === 'string' && entry.deityName ? entry.deityName : null,
  };
}

/** The seed-side significance gate. @param {RumorSeedEntry} entry */
export function passesSignificanceGate(entry) {
  if (!entry) return false;
  if (entry.significance === 'major') return true;
  return finiteNumber(entry.score, 0) >= RUMOR_NOTABLE_SCORE_FLOOR;
}

/**
 * Deterministic field-merge when a second telling of an event reaches a
 * settlement that already holds one (RECORDING is per-(event,settlement,
 * carrier), so arrivals CONSOLIDATE — §III.2-6): corroboration roots UNION
 * (the independence signal accrues), and the BETTER telling supersedes
 * (§4f: a later, more complete arrival corrects an earlier one) under a total
 * order — completeness, then accuracy, then fewer hops, then earlier arrival,
 * then codepoint of the telling chain. The continuation-guard stamp is
 * preserved: a settlement never re-relays a corrected telling (the front
 * stays bounded).
 * @param {RumorArrivalRecord} existing
 * @param {RumorArrivalRecord} incoming
 * @returns {RumorArrivalRecord}
 */
export function mergeArrival(existing, incoming) {
  const roots = [...new Set([...(existing.corroborationRoots || []), ...(incoming.corroborationRoots || [])])]
    .sort(compareCodepoint);
  const better = pickBetterTelling(existing, incoming);
  return {
    ...better,
    corroborationRoots: roots,
    relayedTick: existing.relayedTick ?? null,
  };
}

/** @param {RumorArrivalRecord} a @param {RumorArrivalRecord} b @returns {RumorArrivalRecord} */
function pickBetterTelling(a, b) {
  if (a.completeness01 !== b.completeness01) return a.completeness01 > b.completeness01 ? a : b;
  if (a.accuracy01 !== b.accuracy01) return a.accuracy01 > b.accuracy01 ? a : b;
  if (a.hopCount !== b.hopCount) return a.hopCount < b.hopCount ? a : b;
  if (a.arrivalTick !== b.arrivalTick) return a.arrivalTick < b.arrivalTick ? a : b;
  return compareCodepoint(a.lineageIds.join('|'), b.lineageIds.join('|')) <= 0 ? a : b;
}

/**
 * The ORGANIC per-hop weathering roll (Unreliable mode ONLY — round 13): a
 * DISTRIBUTION with tails. One fork per (event,carrier,edge,hop) — NEVER per
 * settlement (§III.2-5: per-settlement forking defeats cross-confirmation
 * independence). All mutations are BOUNDED and structural:
 *   • u < 0.08  — the rare PERFECT hop: the telephone preserves everything.
 *   • u ≥ 0.97  — the rare SEVERE garble: heavy completeness/accuracy loss +
 *                 a magnitude band jump.
 *   • otherwise — normal weathering: completeness ×[0.80..0.95]; a 30% chance
 *                 the magnitude band drifts ±1; a 12% chance one involved name
 *                 SWAPS — only to a REAL in-world settlement id drawn from the
 *                 frozen digest (never an invented name).
 * accuracy01 is the DERIVED summary of the mutations applied (not stored
 * prose). Perfect-but-Delayed never calls this.
 * @param {RumorArrivalRecord} record  the outgoing telling (pre-hop)
 * @param {RumorRng} fork              the rumor-organic fork for this hop
 * @param {{ settlementIds?: Array<string | number> }} digest
 * @returns {{ completeness01: number, accuracy01: number, content: RumorContent }}
 */
export function degradeTelling(record, fork, digest) {
  let completeness = record.completeness01;
  let accuracy = record.accuracy01;
  /** @type {RumorContent} */
  const content = { ...record.content, partyIds: [...record.content.partyIds] };
  const u = fork.random();
  if (u < 0.08) {
    // Perfectly preserved across this hop — the rare long-range truth.
  } else if (u >= 0.97) {
    completeness *= 0.55;
    accuracy *= 0.65;
    content.magnitude = clampBand(content.magnitude + (fork.chance(0.5) ? 1 : -1));
  } else {
    completeness *= 0.8 + 0.15 * fork.random();
    if (fork.chance(0.3)) {
      content.magnitude = clampBand(content.magnitude + (fork.chance(0.5) ? 1 : -1));
      accuracy *= 0.82;
    }
    if (fork.chance(0.12) && content.partyIds.length > 0) {
      const pool = [...new Set((digest.settlementIds || []).map(String))]
        .filter((id) => !content.partyIds.includes(id) && id !== content.whereId)
        .sort(compareCodepoint);
      if (pool.length > 0) {
        const swapOut = fork.randInt(0, content.partyIds.length - 1);
        content.partyIds[swapOut] = pool[fork.randInt(0, pool.length - 1)];
        content.partyIds = [...new Set(content.partyIds)].sort(compareCodepoint);
        accuracy *= 0.85;
      }
    }
  }
  return {
    completeness01: round4(Math.max(RUMOR_FIDELITY_FLOOR, completeness)),
    accuracy01: round4(Math.max(RUMOR_FIDELITY_FLOOR, accuracy)),
    content,
  };
}

// ── The advance (one pure step per pulse tick) ────────────────────────────────

/**
 * Advance the rumor network one tick: expire, seed, relay, bound, rebuild.
 * Called by the pulse kernel AFTER the tick's wizard-news feed is composed.
 *
 * DORMANT (no spatial digest, or infoMode 'omniscient') ⇒ `{ next: prior,
 * changed: false }` — zero forks, zero new keys, byte-identical; an existing
 * ledger is PRESERVED untouched (never deleted) when the mode is dialled back.
 *
 * @param {Object} args
 * @param {RumorWorldStateRead} args.worldState  the ensured worldState (reads
 *   rumorLedgers / simulationRules / rulesetLog / the spatial marker+digest).
 * @param {RumorSeedEntry[]} args.feedEntries  the COMPOSED wizard-news entries
 *   for this campaign (this tick's news included) — the seed substrate.
 * @param {RumorGraphRead} args.graph
 *   the post-apply regional graph (the trade edges).
 * @param {number} args.tick  the current pulse tick (integer weeks).
 * @param {RumorRng | null} [args.rng]  the pulse rng confluence. Required only
 *   by Unreliable relays; Perfect-but-Delayed and dormant paths never touch it.
 * @returns {{ next: RumorLedgers | null, changed: boolean }}  next=null ⇒ the
 *   key should be absent (empty ledger drops, the conditional-ledger idiom).
 */
export function advanceRumorLedgers({ worldState, feedEntries, graph, tick, rng = null }) {
  const prior = /** @type {RumorLedgers | null} */ (
    worldState && typeof worldState === 'object' && 'rumorLedgers' in worldState
      ? asLedgers(worldState.rumorLedgers)
      : null
  );
  const digest = activeSpatialDigest(worldState);
  const mode = infoModeOf(/** @type {Record<string, unknown> | undefined} */ (worldState?.simulationRules));
  if (!digest || mode === 'omniscient') {
    return { next: prior, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const floor = prospectiveFloorTick(worldState);

  // Working copy: { sid → Map(eventKey → record) } for cheap merge/evict.
  let mutated = false;
  /** @type {Map<string, Map<string, RumorArrivalRecord>>} */
  const working = new Map();
  for (const sid of Object.keys(asLedgers(prior)).sort(compareCodepoint)) {
    const ledger = asLedger(/** @type {RumorLedgers} */ (prior)[sid]);
    /** @type {Map<string, RumorArrivalRecord>} */
    const records = new Map();
    for (const key of Object.keys(ledger).sort(compareCodepoint)) {
      const record = ledger[key];
      if (!record || typeof record !== 'object') continue;
      // EXPIRY — tick-age since ARRIVAL, never createdAt (records carry no
      // wall-clock field). In-transit records (arrivalTick > now) never age.
      const ttl = RUMOR_TTL_TICKS[record.significance === 'major' ? 'major' : 'notable'];
      if (now - finiteNumber(record.arrivalTick, now) > ttl) {
        mutated = true; // an expired record must fall out of the persisted ledger
        continue;
      }
      records.set(key, record);
    }
    if (records.size) working.set(sid, records);
  }

  // SEED — the significance-gated entry of this window's events at their
  // WITNESS settlements (hop 0). Total-order scan (tick desc, score desc,
  // codepoint id) so a same-event transition collision resolves newest-first;
  // idempotent per (witness, eventKey) — the recording guard.
  const eligible = (Array.isArray(feedEntries) ? feedEntries : [])
    .filter((entry) => entry && entry.id
      && finiteNumber(entry.tick, -1) >= Math.max(floor, now - RUMOR_SEED_LOOKBACK_TICKS)
      && finiteNumber(entry.tick, -1) <= now
      && passesSignificanceGate(entry)
      && Array.isArray(entry.settlementIds) && entry.settlementIds.length > 0
      && !(entry.tags || []).includes('proposal'))
    .sort((a, b) => (finiteNumber(b.tick, 0) - finiteNumber(a.tick, 0))
      || (finiteNumber(b.score, 0) - finiteNumber(a.score, 0))
      || compareCodepoint(String(a.id), String(b.id)));
  /** @type {Set<string>} */
  const seededThisPass = new Set();
  for (const entry of eligible) {
    const eventRef = String(entry.sourceEventId || entry.id);
    const key = rumorEventKey(eventRef);
    const content = captureContent(entry);
    const witnesses = content.partyIds;
    for (const sid of witnesses) {
      const passKey = `${sid} ${key}`;
      if (seededThisPass.has(passKey)) continue; // newest transition won
      seededThisPass.add(passKey);
      const records = working.get(sid) || new Map();
      const root = originTellingId(eventRef, sid);
      /** @type {RumorArrivalRecord} */
      const seed = {
        eventRef,
        eventTick: Math.max(0, Math.floor(finiteNumber(entry.tick, now))),
        carrier: RUMOR_CARRIER_TRADE,
        arrivalTick: Math.max(0, Math.floor(finiteNumber(entry.tick, now))),
        hopCount: 0,
        lineageIds: [eventRef, root],
        corroborationRoots: [root],
        provenance: { originId: sid, relayIds: [] },
        completeness01: 1,
        accuracy01: 1,
        framing: [],
        significance: entry.significance === 'major' ? 'major' : 'notable',
        score: Math.max(0, Math.round(finiteNumber(entry.score, 0))),
        content,
        relayedTick: null,
      };
      const existing = records.get(key);
      if (existing) {
        // The witness both saw it and (maybe) heard it: firsthand truth wins
        // the telling; the heard root still corroborates.
        const merged = mergeArrival(existing, seed);
        if (merged !== existing) {
          records.set(key, merged);
          mutated = true;
        }
      } else {
        records.set(key, seed);
        working.set(sid, records);
        mutated = true;
      }
    }
  }

  // RELAY — two-phase (scan the frozen snapshot, then deliver) so mid-scan
  // deliveries can never reorder this tick's work. hopWeeks ≥ 1 for distinct
  // pairs, so a delivered packet is never due the same tick it was emitted.
  /** @type {Array<{ targetId: string, key: string, packet: RumorArrivalRecord }>} */
  const deliveries = [];
  for (const sid of [...working.keys()].sort(compareCodepoint)) {
    const records = /** @type {Map<string, RumorArrivalRecord>} */ (working.get(sid));
    for (const key of [...records.keys()].sort(compareCodepoint)) {
      const record = /** @type {RumorArrivalRecord} */ (records.get(key));
      if (record.relayedTick != null) continue;             // continuation guard
      if (finiteNumber(record.arrivalTick, Infinity) > now) continue; // in transit
      records.set(key, { ...record, relayedTick: now });    // stamp even at a dead end
      mutated = true;
      if (record.hopCount >= maxHopsFor(record)) continue;  // hop budget spent
      const hop = record.hopCount + 1;
      const relayTelling = `t${hop}:${record.eventRef}@${sid}`;
      for (const { neighbourId, edgeId } of tradeNeighbours(graph, sid)) {
        const weeks = hopWeeks(digest, sid, neighbourId);
        const travelTicks = Math.max(1, finiteNumber(weeks, 1));
        let fidelity = {
          completeness01: record.completeness01,
          accuracy01: record.accuracy01,
          content: record.content,
        };
        if (mode === 'unreliable') {
          // THE fork law (§III.2-5): per event+carrier+edge+hop, NEVER per
          // settlement, off the pulse confluence. Perfect-but-Delayed forks
          // NOTHING (this branch is the only rng touch in the module).
          if (!rng) continue; // no confluence threaded ⇒ no distorted relay
          const fork = rng.fork(`rumor-organic:${record.eventRef}:${RUMOR_CARRIER_TRADE}:${edgeId}:${hop}`);
          fidelity = degradeTelling(record, fork, digest);
        }
        deliveries.push({
          targetId: neighbourId,
          key,
          packet: {
            eventRef: record.eventRef,
            eventTick: record.eventTick,
            carrier: RUMOR_CARRIER_TRADE,
            arrivalTick: now + travelTicks,
            hopCount: hop,
            lineageIds: [...record.lineageIds, relayTelling],
            // The packet's independence root is ITS OWN telling's origin
            // (lineageIds[1]) — never the relayer's merged corroboration, so
            // an echo chain stays independence-1 (the V.3 pin).
            corroborationRoots: [record.lineageIds[1]],
            provenance: {
              originId: record.provenance.originId,
              relayIds: [...record.provenance.relayIds, sid],
            },
            completeness01: fidelity.completeness01,
            accuracy01: fidelity.accuracy01,
            framing: [...new Set([...record.framing, 'merchant'])].sort(compareCodepoint),
            significance: record.significance,
            score: record.score,
            content: fidelity.content,
            relayedTick: null,
          },
        });
      }
    }
  }
  for (const { targetId, key, packet } of deliveries) {
    const records = working.get(targetId) || new Map();
    const existing = records.get(key);
    records.set(key, existing ? mergeArrival(existing, packet) : packet);
    working.set(targetId, records);
    mutated = true;
  }

  // TOP-K + byte-stable rebuild: per settlement, the III.2-5 total order
  // (event tick desc, score desc, fidelity desc, codepoint key) THEN the cap;
  // codepoint-sorted keys at both levels so serialization is order-free.
  /** @type {RumorLedgers} */
  const next = {};
  for (const sid of [...working.keys()].sort(compareCodepoint)) {
    const records = /** @type {Map<string, RumorArrivalRecord>} */ (working.get(sid));
    const kept = [...records.entries()]
      .sort(([ka, a], [kb, b]) => (b.eventTick - a.eventTick)
        || (b.score - a.score)
        || (b.completeness01 - a.completeness01)
        || compareCodepoint(ka, kb))
      .slice(0, RUMOR_TOP_K)
      .sort(([ka], [kb]) => compareCodepoint(ka, kb));
    if (kept.length < records.size) mutated = true;
    if (!kept.length) continue;
    /** @type {RumorLedger} */
    const ledger = {};
    for (const [key, record] of kept) ledger[key] = record;
    next[sid] = ledger;
  }

  const nextOrNull = Object.keys(next).length ? next : null;
  if (!mutated && prior !== null) {
    // Nothing seeded/relayed/expired: keep the PRIOR reference (byte-identical).
    return { next: prior, changed: false };
  }
  const changed = JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : prior, changed };
}
