/**
 * domain/display/worldSnapshotPublic.js — the PUBLIC-SAFE world-snapshot
 * serializer (SECURITY-CRITICAL). The realm-scoped sibling of publicSafe.js's
 * per-settlement `toPublicSafe`: where that strips ONE settlement to player-safe
 * form, this projects a whole campaign's live `worldState` + `regionalGraph` to a
 * versioned, public-safe, plain-JSON snapshot for the gallery / shared-realm /
 * anonymous Realm surfaces.
 *
 * SECURITY MODEL — ALLOWLIST, NEVER SPREAD. The worldState carries the DM-private
 * heart of the simulation: per-NPC goals/secrets, per-faction scheming, the
 * pending-event / proposal queue (un-surfaced plot the DM has not revealed), the
 * raw stressor objects + prose, the paused-advance cursor (which embeds a full
 * pre-tick world snapshot), the per-settlement tick states, and the rng seed
 * (which would let anyone REPLAY the private simulation forward). NONE of that may
 * ever reach a public surface. So this serializer NEVER spreads raw worldState —
 * it copies ONLY an explicit allowlist of fields, each reduced to its public
 * subset, and runs every value through a final recursive scrub (publicSafe's
 * PRIVATE_KEY_RE + an explicit covert/seed/prose key set) as defense-in-depth.
 *
 * The HARD-DENY list below is ABSOLUTE: those keys are never serialized
 * regardless of any opt-in in `opts` (there is no `full`/`includeCovert` escape
 * hatch here — covert is force-OFF). `opts` only gates which ALLOWED sections are
 * included; it can never widen what a section may expose.
 *
 * Mirrors the read-side display projections (warStatus / pantheonDepth /
 * chronicleTimeline / realmArcSummary) — it derives the SAME public aggregates the
 * Realm Inspector renders, but as a flat serializable object, with the covert /
 * gm / hidden tiers filtered out.
 *
 * PURE + DETERMINISTIC. Domain-kernel rules: no Date.now / Math.random / new Date,
 * no store, no React, no mutation of the inputs. Every list is codepoint-sorted so
 * the output is byte-stable regardless of Map/Object iteration order. A dormant
 * realm (no war, no deities, no chronicle) serializes to its empty shape.
 */

import { sanitizePublicValue } from './publicSafe.js';

/** The snapshot schema version — bumped on any breaking shape change so a stored
 *  public snapshot can be migrated/rejected by version, independent of the
 *  internal worldState schema. */
export const WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION = 1;

/**
 * HARD-DENY — worldState keys that must NEVER appear in a public snapshot, under
 * any opt-in. Listed for documentation + the defensive final-scrub assertion; the
 * allowlist construction below already omits them by never reading them. Kept as a
 * frozen set so the test can assert each is absent.
 */
export const WORLD_SNAPSHOT_HARD_DENY = Object.freeze([
  'npcStates',
  'factionStates',
  'relationshipStates',
  'pendingEvents',
  'proposals',
  'stressors',
  'pausedAdvance',
  'settlementTickStates',
  'rngSeed',
  'deferredImpacts',
  'deferredWarFronts',
  'deferredPartyImpacts',
]);

/** simulationRules keys safe to surface publicly (coarse world-shape toggles the
 *  player already infers from play). EXCLUDES nothing secret — these are all
 *  difficulty/flavour switches — but we still allowlist rather than spread so a
 *  future private rule key can't leak by default. */
const PUBLIC_SIMULATION_RULE_KEYS = Object.freeze([
  'presetId',
  'propagationMode',
  'intensity',
  'migrationMode',
]);

/** Covert / seed / prose key names scrubbed from every serialized value as a final
 *  defense-in-depth pass (on top of publicSafe's PRIVATE_KEY_RE). These catch any
 *  field that rode in on an allowed aggregate. */
// Exported so the server-side mirror (089 gallery-snapshot sanitizer SQL) can be
// drift-guarded against it — see tests/security/snapshotDenylistDrift.test.js.
export const COVERT_KEY_RE = /(covert|rngSeed|seed|rollExplanation|rollExplanations|diceDetail|explanation|preSnapshot|preWorldState|preRegionalGraph|preSaves)/i;

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/** @param {any} value @param {number} [fallback] @returns {number} */
function finiteNum(value, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

/**
 * Final defensive scrub: run a value through publicSafe's recursive denylist, then
 * drop any covert/seed/prose key this module names. Belt-and-suspenders over the
 * allowlist construction — a value that should be clean by construction is scrubbed
 * again so a missed field can never leak.
 * @param {any} value
 * @returns {any}
 */
function scrub(value) {
  return dropCovertKeys(sanitizePublicValue(value));
}

/**
 * Recursively drop COVERT_KEY_RE keys from a plain value (post-sanitize). Pure;
 * returns a new structure, never mutates the input.
 * @param {any} value
 * @returns {any}
 */
function dropCovertKeys(value) {
  if (Array.isArray(value)) return value.map(dropCovertKeys);
  if (!value || typeof value !== 'object') return value;
  /** @type {Record<string, any>} */
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (COVERT_KEY_RE.test(key)) continue;
    out[key] = dropCovertKeys(child);
  }
  return out;
}

/**
 * The public worldClock block: in-world tick + calendar/era/season. Scalar only —
 * no ledger ever rides here.
 * @param {any} worldState
 * @returns {{ tick: number, calendar: { elapsedMonths: number, month: number, year: number, season: string } }}
 */
function publicWorldClock(worldState) {
  const calendar = worldState?.calendar && typeof worldState.calendar === 'object' ? worldState.calendar : {};
  return {
    tick: Math.max(0, Math.floor(finiteNum(worldState?.tick, 0))),
    calendar: {
      elapsedMonths: Math.max(0, finiteNum(calendar.elapsedMonths, 0)),
      month: Math.max(1, Math.floor(finiteNum(calendar.month, 1))),
      year: Math.max(1, Math.floor(finiteNum(calendar.year, 1))),
      season: typeof calendar.season === 'string' ? calendar.season : 'spring',
    },
  };
}

/**
 * The public simulationRules subset — allowlisted coarse toggles only.
 * @param {any} worldState
 * @returns {Record<string, any>}
 */
function publicSimulationRules(worldState) {
  const rules = worldState?.simulationRules && typeof worldState.simulationRules === 'object'
    ? worldState.simulationRules
    : {};
  /** @type {Record<string, any>} */
  const out = {};
  for (const key of PUBLIC_SIMULATION_RULE_KEYS) {
    if (rules[key] !== undefined) out[key] = rules[key];
  }
  return out;
}

/**
 * The public pantheon: per-deity PUBLIC fields only (display name + tier + seats +
 * the cumulative conversion record). The pantheon ledger carries no covert field,
 * but we still allowlist per-entry so a future private field can't leak. Empty when
 * the realm is deity-free (no pantheon key).
 * @param {any} worldState
 * @returns {Array<{ deityId: string, name: string, tier: string, seats: number, wins: number, losses: number }>}
 */
function publicPantheon(worldState) {
  const pantheon = worldState?.pantheon && typeof worldState.pantheon === 'object' && !Array.isArray(worldState.pantheon)
    ? worldState.pantheon
    : {};
  /** @type {Array<{ deityId: string, name: string, tier: string, seats: number, wins: number, losses: number }>} */
  const out = [];
  for (const deityId of Object.keys(pantheon).sort(codepoint)) {
    const entry = pantheon[deityId] && typeof pantheon[deityId] === 'object' ? pantheon[deityId] : {};
    const tail = String(deityId).split(/[:_]/).filter(Boolean).pop() || String(deityId);
    out.push({
      deityId: String(deityId),
      name: tail.charAt(0).toUpperCase() + tail.slice(1),
      tier: typeof entry.tier === 'string' ? entry.tier : 'cult',
      seats: Math.max(0, Math.floor(finiteNum(entry.seats, 0))),
      wins: Math.max(0, Math.floor(finiteNum(entry.wins, 0))),
      losses: Math.max(0, Math.floor(finiteNum(entry.losses, 0))),
    });
  }
  return out;
}

/**
 * Derived war / trade / disposition AGGREGATES — public-visibility only. Sieges and
 * trade wars are filtered to those whose visibility is `public`; a gm/hidden siege
 * is dropped entirely (not just un-named). Disposition standings carry no covert
 * tier. These are COUNTS + ids/names, never the raw ledgers.
 * @param {any} worldState
 * @param {any} regionalGraph
 * @param {Map<string, string>} nameById
 * @returns {{ sieges: Array<any>, tradeWars: Array<any>, dispositions: Array<any> }}
 */
function publicWarNetwork(worldState, regionalGraph, nameById) {
  const sieges = publicSieges(worldState, regionalGraph, nameById);
  const tradeWars = publicTradeWars(worldState, regionalGraph, nameById);
  const dispositions = publicDispositions(worldState, nameById);
  return { sieges, tradeWars, dispositions };
}

/**
 * Public sieges aggregate — one entry per besieged target whose siege is PUBLIC.
 * Built only from CONFIRMED, PUBLIC war_front channels (a gm/hidden front is never
 * read), so a covert mobilization can never surface. Deployments are NOT folded in
 * here (unlike the gm-facing liveSieges) because a just-marched army with no minted
 * front is not yet public.
 * @param {any} worldState
 * @param {any} regionalGraph
 * @param {Map<string, string>} nameById
 * @returns {Array<{ targetId: string, targetName: string, coalition: string[], coalitionNames: string[], frontCount: number }>}
 */
function publicSieges(worldState, regionalGraph, nameById) {
  const channels = Array.isArray(regionalGraph?.channels) ? regionalGraph.channels : [];
  /** @type {Map<string, Set<string>>} */
  const besiegersByTarget = new Map();
  for (const channel of channels) {
    if (channel?.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (channel.visibility !== 'public') continue; // PUBLIC-ONLY: drop gm/hidden fronts
    if (channel.from == null || channel.to == null) continue;
    const set = besiegersByTarget.get(String(channel.to)) || new Set();
    set.add(String(channel.from));
    besiegersByTarget.set(String(channel.to), set);
  }
  return [...besiegersByTarget.keys()].sort(codepoint).map(targetId => {
    const coalition = [...(besiegersByTarget.get(targetId) || new Set())].sort(codepoint);
    return {
      targetId,
      targetName: nameById.get(targetId) || targetId,
      coalition,
      coalitionNames: coalition.map(id => nameById.get(id) || id),
      frontCount: coalition.length,
    };
  });
}

/**
 * Public trade-war aggregate — one entry per FLIPPED commodity prize. The
 * tradeWarState ledger carries no visibility/covert field (a flipped supplier crown
 * is public-by-nature: it is the observable market outcome), so every flipped prize
 * is surfaced, but as ids/names + the commodity label only.
 * @param {any} worldState
 * @param {any} regionalGraph
 * @param {Map<string, string>} nameById
 * @returns {Array<{ prizeId: string, buyerId: string, buyerName: string, commodityId: string, commodityLabel: string, winnerId: string, winnerName: string }>}
 */
function publicTradeWars(worldState, regionalGraph, nameById) {
  const state = worldState?.tradeWarState && typeof worldState.tradeWarState === 'object'
    ? worldState.tradeWarState
    : {};
  const labels = commodityLabelsByPair(regionalGraph);
  /** @type {Array<{ prizeId: string, buyerId: string, buyerName: string, commodityId: string, commodityLabel: string, winnerId: string, winnerName: string }>} */
  const out = [];
  for (const prizeId of Object.keys(state).sort(codepoint)) {
    const entry = state[prizeId] && typeof state[prizeId] === 'object' ? state[prizeId] : {};
    if (entry.lastFlipTick == null) continue; // never contested → not a trade war
    // Prefer the REAL ids the ledger now persists (buyerId/commodityId). The prizeId
    // key is the SLUG form (stablePart-lowercased, non-alnum to underscore), so
    // splitting it on ':' recovers slugs, not the real ids nameById is keyed by,
    // which rendered names as slugs. Fall back to the slug-split only for a legacy
    // ledger entry written before the ids were persisted.
    const idx = String(prizeId).indexOf(':');
    const buyerId = entry.buyerId != null
      ? String(entry.buyerId)
      : (idx >= 0 ? String(prizeId).slice(0, idx) : String(prizeId));
    const commodityId = entry.commodityId != null
      ? String(entry.commodityId)
      : (idx >= 0 ? String(prizeId).slice(idx + 1) : '');
    const winnerId = entry.winnerId != null ? String(entry.winnerId) : '';
    out.push({
      prizeId: String(prizeId),
      buyerId,
      buyerName: nameById.get(buyerId) || buyerId,
      commodityId,
      commodityLabel: labels.get(`${winnerId}->${buyerId}`) || labels.get(commodityId) || humanize(commodityId),
      winnerId,
      winnerName: nameById.get(winnerId) || winnerId,
    });
  }
  return out;
}

/**
 * Public disposition standings — the cross-settlement win/loss aggregate (no covert
 * tier). Net-zero/absent ledgers yield []. Ids + names + coarse counts only.
 * @param {any} worldState
 * @param {Map<string, string>} nameById
 * @returns {Array<{ id: string, name: string, wins: number, losses: number, score: number }>}
 */
function publicDispositions(worldState, nameById) {
  const stats = worldState?.dispositionStats && typeof worldState.dispositionStats === 'object'
    ? worldState.dispositionStats
    : {};
  /** @type {Array<{ id: string, name: string, wins: number, losses: number, score: number }>} */
  const out = [];
  for (const id of Object.keys(stats).sort(codepoint)) {
    const entry = stats[id] && typeof stats[id] === 'object' ? stats[id] : {};
    const wins = Math.max(0, Math.floor(finiteNum(entry.wins, 0)));
    const losses = Math.max(0, Math.floor(finiteNum(entry.losses, 0)));
    if (!wins && !losses) continue;
    out.push({ id: String(id), name: nameById.get(String(id)) || String(id), wins, losses, score: finiteNum(entry.score, wins - losses) });
  }
  return out;
}

/**
 * `<from>-><to>` (and bare commodityId) → label lookup from trade_dependency goods.
 * @param {any} graph
 * @returns {Map<string, string>}
 */
function commodityLabelsByPair(graph) {
  /** @type {Map<string, string>} */
  const labels = new Map();
  const channels = Array.isArray(graph?.channels) ? graph.channels : [];
  for (const channel of channels) {
    if (channel?.type !== 'trade_dependency') continue;
    const goods = Array.isArray(channel.goods) ? channel.goods : [];
    for (const good of goods) {
      const id = good?.id != null ? String(good.id) : null;
      const label = good?.label || (id ? humanize(id) : null);
      if (!id || !label) continue;
      labels.set(id, label);
      if (channel.from != null && channel.to != null) labels.set(`${String(channel.from)}->${String(channel.to)}`, label);
    }
  }
  return labels;
}

/** @param {any} value @returns {string} */
function humanize(value) {
  return String(value || '').replace(/_/g, ' ');
}

/**
 * The public chronicle: tick-indexed HEADLINES + affected-settlement ids/names.
 * STRIPS every rollExplanation / dice-detail / prose seed field — only the headline
 * + summary + the affected ids survive. Newest tick first, capped.
 * @param {any} worldState
 * @param {Map<string, string>} nameById
 * @param {number} maxTicks
 * @param {number} maxHeadlines
 * @returns {Array<{ tick: number, headlines: Array<{ headline: string, summary: string }>, affectedSettlementIds: string[], affectedSettlementNames: string[] }>}
 */
function publicChronicle(worldState, nameById, maxTicks, maxHeadlines) {
  const pulses = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  // DM-APPROVED proposals: applyWorldPulseProposal flips the PROPOSAL ROW to
  // status === 'applied' but never rewrites the original selectedOutcomes entry,
  // which keeps applyMode === 'proposal' forever. So an outcome that is now a real,
  // surfaced incident (government changes, conquests-via-label, diplomatic relabels —
  // the realm's most significant events) would be permanently hidden by an
  // applyMode-only gate. Recover the surfaced ids from the applied proposal rows.
  // Mirrors relationshipMemory.js's appliedMarkers rule.
  const appliedIds = new Set(
    (worldState?.proposals || [])
      .filter((/** @type {any} */ p) => p?.status === 'applied' && p?.outcome?.id)
      .map((/** @type {any} */ p) => p.outcome.id),
  );
  /** @type {Map<number, { tick: number, headlines: Array<{ headline: string, summary: string }>, affected: Set<string> }>} */
  const byTick = new Map();
  for (const pulse of pulses) {
    const tick = Math.max(0, Math.floor(finiteNum(pulse?.tick, 0)));
    let slot = byTick.get(tick);
    if (!slot) { slot = { tick, headlines: [], affected: new Set() }; byTick.set(tick, slot); }
    const outcomes = Array.isArray(pulse?.selectedOutcomes) ? pulse.selectedOutcomes : [];
    for (const o of outcomes) {
      // PLAYER-VISIBILITY GATE: a pulse's selectedOutcomes carries BOTH auto-applied
      // outcomes AND proposal outcomes (the un-surfaced plot the DM has not yet
      // approved, plus the NPC goals/scheming those proposals carry). Only an
      // auto-applied outcome was actually surfaced to players, so the public
      // chronicle surfaces ONLY applyMode === 'auto' OR a proposal the DM has since
      // APPROVED (its id is in the applied-proposal set); an un-approved proposal
      // (DM-private) is dropped. Mirrors relationshipMemory's rule that an un-applied
      // proposal is not a real, surfaced incident.
      if (o?.applyMode !== 'auto' && !appliedIds.has(o?.id)) continue;
      // Headline + summary ONLY — never the outcome object (which carries
      // rollExplanations, candidateId, raw deltas). Strings are coerced + bounded.
      slot.headlines.push({
        headline: String(o?.headline || 'World pulse outcome').slice(0, 200),
        summary: String(o?.summary || '').slice(0, 400),
      });
      collectAffectedIds(o).forEach(id => slot.affected.add(id));
    }
    const digest = Array.isArray(pulse?.impactDigest) ? pulse.impactDigest : [];
    for (const d of digest) {
      // Player-visibility gate for the digest. A digest entry IS a news row whose
      // `kind` tracks surfaced state: newsEntryForOutcome stamps kind='applied' for an
      // auto-applied outcome and kind='queued' for a proposal (applyWorldPulse.js:125).
      // Gate on that real field: keep 'applied', drop 'queued' so a pending proposal's
      // affected ids never leak. An APPROVED proposal's affected ids still surface, via
      // the outcome-loop appliedIds reconciliation above (its digest row keeps 'queued'
      // since approval does not mint a fresh digest entry), so dropping 'queued' here
      // costs no fidelity. (The prior applyMode/bare-id gate matched NO real entry:
      // digests carry no applyMode and a compound id.)
      if (d?.kind !== 'applied') continue;
      const ids = Array.isArray(d?.settlementIds) ? d.settlementIds : [];
      ids.forEach((/** @type {any} */ x) => slot.affected.add(String(x)));
    }
  }
  return [...byTick.values()]
    .sort((a, b) => b.tick - a.tick)
    .slice(0, maxTicks)
    .map(slot => {
      const affectedSettlementIds = [...slot.affected].sort(codepoint);
      return {
        tick: slot.tick,
        headlines: slot.headlines.slice(0, maxHeadlines),
        affectedSettlementIds,
        affectedSettlementNames: affectedSettlementIds.map(id => nameById.get(id) || id),
      };
    });
}

/**
 * The settlement ids one pulse outcome touched — direct target + population-delta
 * keys. Deduped, string-typed. Deliberately does NOT source ids from
 * `powerTransfer.losers`: those entries are display NAMES, not save ids, so folding
 * them in poisoned affectedSettlementIds (and the name lookup, which then failed and
 * echoed the raw name as an "id"). Only `targetSaveId` + `populationDeltas` keys are
 * genuine save ids.
 * @param {any} outcome
 * @returns {string[]}
 */
function collectAffectedIds(outcome) {
  /** @type {Set<string>} */
  const ids = new Set();
  if (outcome?.targetSaveId != null) ids.add(String(outcome.targetSaveId));
  const popDeltas = outcome?.populationDeltas;
  if (popDeltas && typeof popDeltas === 'object') for (const key of Object.keys(popDeltas)) ids.add(String(key));
  return [...ids];
}

/**
 * Build a settlementId → display name lookup from member settlements (snapshot
 * `{ id, name }` or save `{ id, settlement: { name } }` shape). Tolerant of either.
 * @param {Array<any>} memberSettlements
 * @returns {Map<string, string>}
 */
function buildNameById(memberSettlements) {
  /** @type {Map<string, string>} */
  const map = new Map();
  const items = Array.isArray(memberSettlements) ? memberSettlements : [];
  for (const item of items) {
    const id = item?.id != null ? String(item.id)
      : (item?.settlement?.id != null ? String(item.settlement.id) : null);
    const name = item?.name || item?.settlement?.name;
    if (id && name) map.set(id, String(name));
  }
  return map;
}

/**
 * The public realm-arc summary lines (pantheon ascendancies + named wars + trade
 * wars). Derived ONLY from the public ledgers (public pantheon + public sieges +
 * public trade wars) so it carries no private detail. Each line is plain text.
 * @param {Array<{ deityId: string, name: string, tier: string, seats: number }>} pantheon
 * @param {Array<{ targetName: string, coalitionNames: string[] }>} sieges
 * @param {Array<{ commodityLabel: string, winnerName: string, buyerName: string }>} tradeWars
 * @param {number} maxArcs
 * @returns {string[]}
 */
function publicRealmArcLines(pantheon, sieges, tradeWars, maxArcs) {
  /** @type {string[]} */
  const lines = [];
  const majors = pantheon.filter(d => d.tier === 'major' && d.seats > 0)
    .sort((a, b) => (b.seats - a.seats) || codepoint(a.deityId, b.deityId));
  for (const major of majors) {
    lines.push(`The Ascendancy of ${major.name} (${major.seats} settlement${major.seats === 1 ? ' holds' : 's hold'} the faith).`);
  }
  for (const cult of pantheon.filter(d => d.tier === 'cult' && d.seats === 0)) {
    lines.push(`The Twilight of ${cult.name} (its altars stand abandoned).`);
  }
  for (const siege of sieges) {
    if (siege.coalitionNames.length >= 2) {
      const named = siege.coalitionNames.length > 2
        ? `${siege.coalitionNames.slice(0, 2).join(', ')} +${siege.coalitionNames.length - 2}`
        : siege.coalitionNames.join(' and ');
      lines.push(`The War of ${siege.targetName}, where a coalition of ${named} besiege the walls.`);
    } else {
      lines.push(`The War of ${siege.targetName}, where ${siege.coalitionNames[0] || 'an army'} lays siege.`);
    }
  }
  for (const war of tradeWars) {
    lines.push(`The ${war.commodityLabel} Trade War, where ${war.winnerName} seizes ${war.buyerName}'s market.`);
  }
  return lines.slice(0, maxArcs);
}

/**
 * The public-safe regionalGraph channels — FILTERED to visibility === 'public' only
 * (gm/hidden dropped), reduced to a public field subset. NEVER spreads the raw
 * channel (which can carry evidence/explanation/relationshipKey prose). Codepoint-
 * sorted by id for determinism.
 * @param {any} regionalGraph
 * @returns {Array<{ id: string, type: string, from: string, to: string, status: string, strength: number, goods: Array<{ id: string, label: string }> }>}
 */
function publicChannels(regionalGraph) {
  const channels = Array.isArray(regionalGraph?.channels) ? regionalGraph.channels : [];
  /** @type {Array<{ id: string, type: string, from: string, to: string, status: string, strength: number, goods: Array<{ id: string, label: string }> }>} */
  const out = [];
  for (const channel of channels) {
    if (channel?.visibility !== 'public') continue; // PUBLIC-ONLY filter (drops gm + hidden)
    if (channel.from == null || channel.to == null || !channel.type) continue;
    out.push({
      id: String(channel.id || `${channel.type}:${channel.from}->${channel.to}`),
      type: String(channel.type),
      from: String(channel.from),
      to: String(channel.to),
      status: String(channel.status || 'confirmed'),
      strength: finiteNum(channel.strength, 0.5),
      goods: (Array.isArray(channel.goods) ? channel.goods : [])
        .map((/** @type {any} */ g) => ({ id: String(g?.id || ''), label: String(g?.label || (g?.id ? humanize(g.id) : '')) }))
        .filter((/** @type {{ id: string, label: string }} */ g) => g.id || g.label),
    });
  }
  return out.sort((a, b) => codepoint(a.id, b.id));
}

/**
 * @typedef {Object} WorldSnapshotPublicOpts
 * @property {boolean} [worldClock]   include the in-world clock (tick + calendar/era/season).
 * @property {boolean} [chronicle]    include the tick-indexed headline chronicle.
 * @property {boolean} [pantheon]     include the public pantheon (deities/faiths).
 * @property {boolean} [warNetwork]   include the war/trade/disposition aggregates + public channels.
 * @property {boolean} [dashboard]    include the simulationRules subset + realm-arc summary.
 * @property {number}  [maxChronicleTicks]    cap on chronicle ticks (default 40).
 * @property {number}  [maxHeadlinesPerTick]  cap on headlines per tick (default 12).
 * @property {number}  [maxArcs]              cap on realm-arc lines (default 6).
 */

/**
 * Serialize a campaign world to its PUBLIC-SAFE, versioned, plain-JSON snapshot.
 *
 * ALLOWLIST ONLY — the result is assembled field-by-field from the explicit public
 * subset of `worldState` + `regionalGraph`; the raw worldState is never spread. The
 * HARD-DENY list (npcStates, factionStates, pendingEvents, proposals, stressors,
 * pausedAdvance, settlementTickStates, rngSeed, ...) is absent by construction and
 * re-scrubbed defensively. `opts` gates WHICH allowed sections appear; it can never
 * widen what a section exposes, and there is no covert opt-in (covert is force-OFF).
 *
 * @param {any} worldState                 the campaign's live worldState (any shape; tolerated).
 * @param {any} regionalGraph              the campaign's live regional graph (channels source).
 * @param {Array<any>} [memberSettlements] member settlements for id→name resolution
 *                                         (snapshot or save shape). Optional.
 * @param {WorldSnapshotPublicOpts} [opts] the enabled section keys + caps.
 * @returns {Record<string, any>} a versioned, public-safe, plain-JSON snapshot.
 */
export function serializeWorldSnapshotPublic(worldState, regionalGraph, memberSettlements = [], opts = {}) {
  const options = opts && typeof opts === 'object' ? opts : {};
  const ws = worldState && typeof worldState === 'object' ? worldState : {};
  const graph = regionalGraph && typeof regionalGraph === 'object' ? regionalGraph : {};
  const nameById = buildNameById(memberSettlements);

  const maxTicks = Math.max(0, Math.floor(finiteNum(options.maxChronicleTicks, 40)));
  const maxHeadlines = Math.max(0, Math.floor(finiteNum(options.maxHeadlinesPerTick, 12)));
  const maxArcs = Math.max(0, Math.floor(finiteNum(options.maxArcs, 6)));

  /** @type {Record<string, any>} */
  const snapshot = {
    schemaVersion: WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION,
    // Echo the source worldState schema so a consumer can reason about provenance.
    sourceWorldStateSchemaVersion: Math.max(0, Math.floor(finiteNum(ws.schemaVersion, 0))),
  };

  // Pantheon + war network are computed up front when EITHER they or the dashboard
  // (which derives the realm-arc summary from them) is enabled — never serialized
  // unless their own section asks for them.
  const pantheon = publicPantheon(ws);
  const war = publicWarNetwork(ws, graph, nameById);

  // Each SECTION VALUE is run through the final defense-in-depth scrub before it is
  // assigned to its (intentional, allowlisted) top-level key. We scrub the VALUES —
  // not the whole envelope — so the section keys this module deliberately names
  // survive (e.g. `chronicle`, which would itself match publicSafe's /chronicle/i
  // denylist), while every field WITHIN a section is still passed through
  // publicSafe's recursive denylist + the covert/seed/prose key drop. So a field
  // that slipped through an allowed aggregate can never leak; the HARD-DENY keys are
  // absent by construction and this guarantees it.
  if (options.worldClock) {
    snapshot.worldClock = scrub(publicWorldClock(ws));
  }

  if (options.pantheon) {
    snapshot.pantheon = scrub(pantheon);
  }

  if (options.warNetwork) {
    snapshot.warNetwork = scrub({
      sieges: war.sieges,
      tradeWars: war.tradeWars,
      dispositions: war.dispositions,
      channels: publicChannels(graph),
    });
  }

  if (options.chronicle) {
    snapshot.chronicle = scrub(publicChronicle(ws, nameById, maxTicks, maxHeadlines));
  }

  if (options.dashboard) {
    snapshot.dashboard = scrub({
      simulationRules: publicSimulationRules(ws),
      realmArcLines: publicRealmArcLines(pantheon, war.sieges, war.tradeWars, maxArcs),
    });
  }

  return snapshot;
}

export default serializeWorldSnapshotPublic;
