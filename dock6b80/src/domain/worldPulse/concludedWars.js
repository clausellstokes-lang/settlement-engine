/**
 * domain/worldPulse/concludedWars.js — W-MEM's ONE WRITER (DESIGN_W_MEM §2.4).
 *
 * The war layer deletes a deployment on seven roads and the record is gone. This is
 * the only thing in the estate that writes a war down before that happens.
 *
 * ── WHY IT RUNS WHERE IT RUNS ───────────────────────────────────────────────────
 * The kernel calls this from its consequence_fold stage, the stage that owns
 * secondary ledgers, and LATE within it. Every clause of that placement was measured
 * rather than chosen:
 *   · AFTER the verdicts. A conquest can be DM-dismissed after the war layer
 *     evaluated it, and the estate then strips the takeover's residue. Writing
 *     earlier would immortalize conquests that never happened.
 *   · AFTER the engagement movers. Field-class engagements are minted by movers that
 *     run past the apply pass and are appended straight to the display feed, so a
 *     writer placed earlier cannot see this tick's engagements at all.
 *   · AFTER the treaty fold, so a treaty minted this tick is visible.
 *   · Reading peace reasons from the PRE-consequence world, because the peace-reason
 *     mover enumerates pairs from the live deployment ledger and therefore DROPS the
 *     concluding pair's entry on the very tick it concludes.
 *
 * ── THE DISMISSAL INVERSION, WHICH THIS FILE EXISTS TO GET RIGHT ────────────────
 * A dismissed conquest STILL CONCLUDES ITS WAR — the kernel's own semantics: the
 * takeover is rolled back but the war-layer resolution is intentionally kept, "the
 * takeover didn't stick; the armies disperse". So the writer ALWAYS writes a record
 * for a concluded war, and the dismissal shapes the FACT BLOCK, never the record's
 * existence: a dismissed conquest contributes no applied conquest row, so the
 * read-side classifier honestly yields a non-conquest ending. Writing nothing would
 * reproduce the failure this whole ledger exists to cure, on exactly the strangest
 * ending.
 *
 * ── IT NEVER FIRES ON A PAUSED TICK ─────────────────────────────────────────────
 * Under deferred majors every major is parked and no verdict exists yet. Gating the
 * write on that makes the record write EXACTLY ONCE, with real verdicts, and makes
 * the pause-path double-fire structurally impossible rather than patched — which is
 * also why this layer's residue strip is trivially byte-neutral: a paused tick banks
 * nothing to strip.
 *
 * ── THE SEAL, AND ITS GRACE WINDOW ──────────────────────────────────────────────
 * A record STAGES when its first belligerent edge concludes and SEALS when no live
 * edge folds onto it any more — coalition joiners' edges terminate independently, so
 * a joiner can outlive the origin pair.
 *
 * ⭐ THE GRACE WINDOW (chair ruling, ODQ §763 omnibus, vetoable). Sealing the instant
 * the last edge resolves would seal BEFORE the war's negotiated facts exist: the
 * treaty mint is not triggered by the recall but by a relationship incident inside
 * the peace-mint window, and the coalition-fracture writers run later still. A record
 * sealed at conclusion would therefore report "no treaty" for a war that was about to
 * get one, and the ending classifier — where `terms` is the last precedence key and
 * needs its own positive evidence — would return no_terminal_evidence for what is
 * plausibly the commonest ending a war has. So a record waits out the SAME window the
 * mint uses, and seals with what it has. Records seal LATE rather than lie EARLY.
 * The window is a parameter (tuning-signature class, like its siblings); the
 * semantics is the ruling.
 *
 * ── DORMANCY ───────────────────────────────────────────────────────────────────
 * Everything here is gated on `warMemoryEnabled === true`, read BY NAME. Dark ⇒ zero
 * new writes anywhere ⇒ byte-identical. The by-name spelling is load-bearing rather
 * than stylistic: a frozen-list conjunction is a computed member access, attributes
 * to no key, and would hide a fully wired flag from the engine-gated-key census.
 *
 * @see src/domain/worldPulse/concludedWarRecord.js — the shape and its normalizer.
 */

import { PEACE_TERMS_TUNING } from './peaceTermsCatalog.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { joinAnchorOf } from './warCoalitionLedger.js';
import { remainingStrengthBandKey } from '../display/armyStrength.js';
import { warExhaustionBandKey } from '../display/warStatus.js';
// The register is IMPORTED rather than re-spelled. A local copy would be a second
// vocabulary for one quantity — the exact fork this record's own design refuses — and
// the classifier that reads the field is where the register is declared.
import { RULER_CHANGE_ENDING_FAMILIES } from '../certification/warEndingClassifier.js';
import {
  NOTABLE_ENGAGEMENT_CAP,
  isKnownCloseRoad,
  normalizeConcludedWarRecord,
  originPairOf,
  terminalOutcomeFrom,
  warIdFor,
} from './concludedWarRecord.js';

/**
 * THE GATE. Read BY NAME with the strict identity idiom, and the receiver is spelled
 * `rules` deliberately — the observed-shape corpus discovers a flag by matching a
 * `simulationRules.<x>Enabled` receiver, and a key discovered there would be treated
 * as one the corpus can light, which it cannot.
 * @param {{ warMemoryEnabled?: unknown } | null | undefined} rules
 * @returns {boolean}
 */
export function warMemoryActive(rules) {
  return rules?.warMemoryEnabled === true;
}

/** @param {unknown} value @returns {Record<string, unknown>} */
const recordOf = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {string} */
const text = (value) => (typeof value === 'string' ? value.trim() : '');

/** @param {unknown} a @param {unknown} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/** @param {unknown} value @returns {number|null} */
const wholeTick = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

/** The war's two principals, off a record already in the ledger.
 * @param {Record<string, unknown>} record @returns {string[]} */
const pairOf = (record) => (Array.isArray(record.originPair) ? record.originPair : []).map(String);

/**
 * THE ANNIHILATION CHANNEL, which had a reader and no producer anywhere.
 *
 * `fact.loserDied` is the sole evidence for the `annihilation` ending
 * (`warEndingClassifier.js` — "the losing belligerent died in the closing window"), and
 * nothing in the estate ever wrote it. The one census that CLAIMED to fill it read
 * `settlement.died`, a field no source file sets; the soak harness beside that census
 * reads the engine's real stamp, `config.lifecycleDiedAtTick`, which the lifecycle mover
 * dual-writes onto the regen-surviving `_config` twin. This is that stamp, threaded.
 *
 * ⭐ DEATH IS THE EVIDENCE OF LOSING, so no victor has to be resolved first: a principal
 * that ceased to exist is the losing belligerent, whichever side of the war it stood on.
 * Only the ORIGIN PAIR counts — an ally's death is not this war's annihilation — and a
 * stamp older than the war's own opening is refused, because a settlement that was
 * already gone cannot have been a belligerent in it.
 *
 * ⭐ THE WINDOW IS THE SEAL, not a second constant and not a second spelling of one. The
 * record is re-read on every pass while it is staged, so a death landing on the closing
 * tick or inside the grace window is seen; after the seal the record is append-closed.
 * A razing is deliberately NOT this: the classifier holds the two disjoint by
 * construction, because a razed town becomes a remnant and a remnant has not died.
 *
 * @param {string[]} pair @param {number} openedTick
 * @param {(id: string) => unknown} diedAtOf
 * @returns {boolean}
 */
function principalDied(pair, openedTick, diedAtOf) {
  return pair.some((id) => {
    const diedAt = wholeTick(diedAtOf(id));
    return diedAt != null && diedAt >= openedTick;
  });
}

/**
 * THE SEAT-TRANSITION CHANNEL, which had a reader and no producer either.
 *
 * WR-5's composers already mint a typed `kind` for all four governed families. Until
 * this car every one of them was spent on the news projection and dropped at that
 * boundary, so `fact.seatTransitionFamily` — the sole evidence for the `ruler_change`
 * ending — was never written by anything, not even the one family whose facts already
 * reached the kernel. Reading the rendered sentence back out is what the record's own
 * no-prose law forbids, so the kind is carried as a token from the seam that mints it.
 *
 * ⭐ THE MATCH IS BY ADDRESS, NEVER BY PROSE. An evidence row carries `settlementId` and
 * `counterpartId`; a row belongs to this war when those two ARE its origin pair, in
 * either orientation, because the court that changed hands can sit on either side.
 * `successor_escalates_war` is the same machinery producing the OPPOSITE fact — a court
 * that changed hands and widened the war — and it is refused by the register itself
 * rather than by a substring test, which is why the register is imported and not retyped.
 *
 * @param {Array<Record<string, unknown>>} evidence @param {string[]} pair
 * @returns {string}
 */
function seatTransitionFor(evidence, pair) {
  if (pair.length !== 2) return '';
  for (const raw of evidence) {
    const row = recordOf(raw);
    const kind = text(row.kind);
    if (!RULER_CHANGE_ENDING_FAMILIES.includes(kind)) continue;
    const here = text(row.settlementId);
    const there = text(row.counterpartId);
    if ((here === pair[0] && there === pair[1]) || (here === pair[1] && there === pair[0])) return kind;
  }
  return '';
}

/**
 * THE MECHANICAL CLOSE ROAD. The war layer's carrier collapses four of its seven
 * roads onto one withdrawal token, so the road is recovered here from inputs the
 * writer provably holds — never guessed, and an unmapped strategic-recall cause is
 * reported as unknown rather than filed under a road it did not take.
 *
 * @param {{ outcome?: unknown, deployment?: unknown, targetId?: unknown }} row
 * @param {{ targetGone?: boolean, abandonedIds?: Set<string>, windDown?: boolean }} ctx
 * @returns {string}
 */
export function closeRoadFor(row, ctx = {}) {
  const outcome = text(row.outcome);
  // Roads 5 and 6 are the only ones the carrier names outright.
  if (outcome === 'conquest' || outcome === 'razing') return outcome;
  const deployment = recordOf(row.deployment);
  const recalled = recordOf(deployment.recalled);
  const cause = text(recalled.cause);
  // Road 1 — a strategic recall, discriminated by the cause the stamp carries. The
  // seven-token census is the register's own; an unrecognised cause is a FINDING.
  if (cause) return isKnownCloseRoad(cause) ? cause : '';
  // Road 7 — the war layer was switched off mid-campaign and resolved everything.
  if (ctx.windDown === true) return 'wind_down';
  // Road 4 — a feasibility collapse, matched by its sibling outcome id.
  if (ctx.abandonedIds && ctx.abandonedIds.has(String(row.targetId ?? ''))) return 'siege_abandoned';
  // Road 3 — the target left the canon. (Road 2, the attacker leaving, pushes no
  // carrier row at all and so cannot arrive here; it is recorded at its own seam.)
  if (ctx.targetGone === true) return 'target_lost';
  return '';
}

/**
 * The war a deployment edge belongs to: the ORIGIN pair and its opening tick.
 *
 * A coalition joiner opened its OWN bilateral deployment, and keyed naively that
 * would mint a second war the day an ally marched. The join anchor folds the joiner
 * onto the origin — and the fold key is the sorted caller/enemy pair, NOT the
 * anchor's orientation field, which is constrained to equal one of the two and
 * therefore carries orientation rather than identity.
 *
 * @param {string} attackerId @param {string} targetId @param {Record<string, unknown>} deployment
 * @returns {{ pair: [string, string], openedTick: number, side: string, joinedTick: number|null, viaCallId: string }}
 */
function warAddressOf(attackerId, targetId, deployment) {
  const anchor = joinAnchorOf(deployment, attackerId);
  if (anchor) {
    const pair = originPairOf(anchor.callerId, anchor.enemyId);
    return {
      pair,
      openedTick: wholeTick(anchor.originSinceTick) ?? 0,
      // The joiner stands on whichever side its own enemy is NOT on: it marched
      // against `enemyId`, so it fights beside the caller.
      side: anchor.originAttackerId === anchor.callerId ? 'attacker_ally' : 'defender_ally',
      joinedTick: wholeTick(anchor.joinedTick),
      viaCallId: String(anchor.callId),
    };
  }
  return {
    pair: originPairOf(attackerId, targetId),
    openedTick: wholeTick(deployment.sinceTick) ?? 0,
    side: 'attacker',
    joinedTick: null,
    viaCallId: '',
  };
}

/**
 * The banded cost of one edge. Capacity is NOT headcount and no headcount is
 * invented, so nothing here can leak a casualty count the estate refused to model.
 * Bands are KEYS into the estate's own ladders, never their rendered phrases.
 *
 * @param {Record<string, unknown>} deployment
 * @param {Record<string, unknown>} exhaustion
 * @param {string[]} homeIds
 * @returns {Record<string, unknown>}
 */
function costOf(deployment, exhaustion, homeIds) {
  const max = Number(deployment.maxStartStrength);
  const now = Number(deployment.currentEffectiveStrength);
  /** @type {Record<string, string>} */
  const exhaustionBands = {};
  for (const id of [...homeIds].sort(codepoint)) {
    const scar = Number(exhaustion[id]);
    if (Number.isFinite(scar) && scar > 0) exhaustionBands[id] = warExhaustionBandKey(scar);
  }
  return {
    ...(Number.isFinite(max) && max > 0 && Number.isFinite(now)
      ? { attackerRemainingBand: remainingStrengthBandKey(now / max) }
      : {}),
    exhaustionBands,
  };
}

/**
 * The engagement epitomes for one war, from this tick's feed. A TYPED copy, never
 * prose: the receipts these ids address live in bounded buffers, so a bare reference
 * dies within eighty advances — on a three-century world, essentially the whole
 * timeline. The source id is kept as a SOFT pointer so the chronicle can be
 * deep-linked while the referent lives.
 *
 * @param {Array<Record<string, unknown>>} entries @param {[string, string]} pair
 * @returns {Array<Record<string, unknown>>}
 */
function engagementsFor(entries, pair) {
  /** @type {Array<Record<string, unknown>>} */
  const rows = [];
  for (const raw of entries) {
    const entry = recordOf(raw);
    const kind = text(entry.impactKind);
    const ids = (Array.isArray(entry.settlementIds) ? entry.settlementIds : []).map((id) => String(id));
    if (!kind || !ids.includes(pair[0]) || !ids.includes(pair[1])) continue;
    const region = text(entry.region);
    rows.push({
      kind,
      ...(wholeTick(entry.tick) != null ? { tick: wholeTick(entry.tick) } : {}),
      settlementIds: ids,
      ...(text(entry.sourceEventId) ? { sourceEventId: text(entry.sourceEventId) } : {}),
      ...(region ? { region } : {}),
    });
  }
  return rows.slice(0, NOTABLE_ENGAGEMENT_CAP);
}

/**
 * THE WRITER. Returns the next ledger, or null when nothing changed — so a dark or
 * quiet tick costs the caller a single null check and the world a single reference.
 *
 * @param {object} args
 * @param {Record<string, unknown>} args.worldState the running consequence-fold world
 * @param {Array<Record<string, unknown>>} args.resolvedDeployments the war layer's carrier
 * @param {Array<Record<string, unknown>>} args.appliedOutcomes APPLIED outcomes, post-verdict
 * @param {Array<Record<string, unknown>>} args.newsEntries this tick's feed rows
 * @param {number} args.tick
 * @param {{ warMemoryEnabled?: unknown } | null} args.rules
 * @param {boolean} args.deferred true on a paused tick — the writer stands down
 * @param {(id: string) => boolean} [args.inCanon] canon membership of the tick snapshot
 * @param {(id: string) => unknown} [args.diedAtOf] the engine's settlement death stamp
 * @param {Array<Record<string, unknown>>} [args.rulingEvidence] this tick's WR-5 facts
 * @param {boolean} [args.windDown] the war layer resolved everything this tick
 * @returns {Record<string, unknown>|null}
 */
export function recordConcludedWars({
  worldState, resolvedDeployments, appliedOutcomes, newsEntries, tick, rules, deferred,
  inCanon = () => true, diedAtOf = () => null, rulingEvidence = [], windDown = false,
}) {
  if (!warMemoryActive(rules)) return null;
  // A paused tick parks every major and knows no verdict. Standing down here is what
  // makes the write happen exactly once, with real verdicts, and what makes this
  // layer's residue strip byte-neutral by construction rather than by care.
  if (deferred) return null;

  const state = recordOf(worldState);
  const prior = recordOf(state.concludedWars);
  const rows = (Array.isArray(resolvedDeployments) ? resolvedDeployments : []).map(recordOf);
  const staged = Object.keys(prior).filter((key) => recordOf(prior[key]).sealed === false);
  if (!rows.length && !staged.length) return null;

  const exhaustion = recordOf(state.warExhaustion);
  const outcomes = (Array.isArray(appliedOutcomes) ? appliedOutcomes : []).map(recordOf);
  const feed = (Array.isArray(newsEntries) ? newsEntries : []).map(recordOf);
  const rulings = Array.isArray(rulingEvidence) ? rulingEvidence : [];
  // ⚠ THE TREATY LEDGER IS NOT A TOP-LEVEL KEY — it is a SPATIAL ledger, reached only
  // through its one entry point. Reading `worldState.treatyLedger` would have compiled,
  // typechecked and silently answered "no treaty" for every war ever recorded. And the
  // match is by PARTIES rather than by key: treaties are keyed by relationship edge id,
  // which is graph-derived, so a writer that re-minted that key would be inventing a
  // second spelling of an address the graph already owns. Both estate readers of this
  // ledger match on `parties`; so does this one.
  const treaties = Object.values(treatyLedgerOf(state) || {}).map(recordOf);
  /** @param {[string, string]} pair @returns {boolean} */
  const treatyStandsFor = (pair) => treaties.some((treaty) => {
    const parties = (Array.isArray(treaty.parties) ? treaty.parties : []).map(String);
    return parties.includes(pair[0]) && parties.includes(pair[1]);
  });
  // The sibling outcome ids that name a feasibility collapse — the road-4 discriminator.
  /** @type {Set<string>} */
  const abandonedIds = new Set();
  for (const outcome of outcomes) {
    const id = text(outcome.id);
    if (id.startsWith('world_outcome.siege_abandoned.')) abandonedIds.add(text(outcome.targetSaveId));
  }

  /** @type {Record<string, unknown>} */
  const next = { ...prior };
  let changed = false;

  for (const row of [...rows].sort((a, b) => codepoint(a.attackerId, b.attackerId))) {
    const attackerId = text(row.attackerId);
    const targetId = text(row.targetId);
    if (!attackerId || !targetId || attackerId === targetId) continue;
    const deployment = recordOf(row.deployment);
    const address = warAddressOf(attackerId, targetId, deployment);
    const warId = warIdFor({
      lowId: address.pair[0], highId: address.pair[1], openedTick: address.openedTick,
    });
    const existing = recordOf(next[warId]);
    // ⛔ A SEALED RECORD IS APPEND-CLOSED FOREVER. A re-fired stale front cannot
    // re-open history, and idempotency is structural: the write is keyed by war id.
    if (existing.sealed === true) continue;

    const road = closeRoadFor(row, {
      targetGone: !inCanon(targetId), abandonedIds, windDown,
    });
    // APPLIED outcomes only. A dismissed conquest contributes NO row here, which is
    // exactly how the classifier comes to yield a non-conquest ending for it.
    const converted = outcomes
      .map((outcome) => terminalOutcomeFrom(outcome, tick))
      .filter(/** @returns {c is {row: Record<string, unknown>, razed: boolean}} */ (c) => c != null)
      .filter((c) => {
        const target = String(c.row.targetSaveId);
        return target === targetId || target === attackerId;
      });
    const terminal = converted.map((c) => c.row);

    const participants = [...(Array.isArray(existing.participants) ? existing.participants : []).map(recordOf)];
    const already = participants.some((p) => text(p.id) === attackerId);
    if (!already) {
      participants.push({
        id: attackerId, side: address.side, leftTick: tick,
        ...(address.joinedTick != null ? { joinedTick: address.joinedTick } : {}),
        ...(address.viaCallId ? { viaCallId: address.viaCallId } : {}),
      });
    }
    if (!participants.some((p) => text(p.id) === targetId)) {
      participants.push({ id: targetId, side: 'defender' });
    }

    // VICTOR POLICY: the occupier on a conquest or a razing; the successful defender
    // on a feasibility collapse, whose banked win is the evidence; ABSENT on every
    // negotiated, dissolved or canon road — never '' , because an empty victor asserts
    // a defeat the war did not have.
    const victor = terminal.length
      ? (terminal[0].targetSaveId === targetId ? attackerId : targetId)
      : road === 'siege_abandoned' ? targetId : text(existing.victorId);
    const seatFamily = seatTransitionFor(rulings, address.pair);

    next[warId] = normalizeConcludedWarRecord({
      ...existing,
      warId,
      originPair: address.pair,
      originAttackerId: text(existing.originAttackerId) || attackerId,
      openedTick: address.openedTick,
      concludedTick: tick,
      // STAGED, not sealed: the negotiated facts may still be minting, and a joiner's
      // edge may still be afield. The seal pass below closes it when both are settled.
      sealed: false,
      form: 'full',
      participants,
      casusReasons: Array.isArray(existing.casusReasons) && existing.casusReasons.length
        ? existing.casusReasons
        : (Array.isArray(deployment.casusReasons) ? deployment.casusReasons : []),
      ...(recordOf(deployment.sacredAnchors) && Object.keys(recordOf(deployment.sacredAnchors)).length
        ? { sacredAnchors: deployment.sacredAnchors } : {}),
      fact: {
        ...recordOf(existing.fact),
        closed: true,
        ...(road ? { closeRoad: road } : {}),
        terminalOutcomes: [
          ...(Array.isArray(recordOf(existing.fact).terminalOutcomes)
            ? /** @type {unknown[]} */ (recordOf(existing.fact).terminalOutcomes) : []),
          ...terminal,
        ],
        ...(principalDied(address.pair, address.openedTick, diedAtOf) ? { loserDied: true } : {}),
        ...(seatFamily ? { seatTransitionFamily: seatFamily } : {}),
        ...(treatyStandsFor(address.pair) ? { treatyWritten: true } : {}),
      },
      ...(victor ? { victorId: victor } : {}),
      territorialOutcomes: [
        ...(Array.isArray(existing.territorialOutcomes) ? existing.territorialOutcomes : []),
        ...converted.map((c) => ({
          settlementId: c.row.targetSaveId,
          kind: c.razed ? 'razed' : 'occupied',
          occupierId: attackerId,
          tick: c.row.tick,
        })),
      ],
      cost: costOf(deployment, exhaustion, [attackerId, targetId]),
      notableEngagements: engagementsFor(feed, address.pair),
    }, warId);
    changed = true;
  }

  // ── THE SEAL PASS ─────────────────────────────────────────────────────────────
  // A staged record seals when no live deployment still folds onto it AND the grace
  // window has run out. The window is the peace-mint window, because that is the
  // interval a treaty for this pair can still arrive in — sealing sooner would
  // record "no treaty" for a war about to acquire one.
  const live = new Set();
  for (const [homeId, raw] of Object.entries(recordOf(state.deployments))) {
    const dep = recordOf(raw);
    const target = text(dep.targetId);
    if (!target) continue;
    const address = warAddressOf(homeId, target, dep);
    live.add(warIdFor({ lowId: address.pair[0], highId: address.pair[1], openedTick: address.openedTick }));
  }
  for (const key of Object.keys(next).sort(codepoint)) {
    const record = recordOf(next[key]);
    if (record.sealed !== false) continue;
    // ⭐ A STAGED RECORD IS ALSO A WATCH, and the watch is what makes the grace window
    // mean something on the fact channels as well as on the treaty. A principal can die
    // on the closing tick itself or inside the window, and while the record is staged it
    // is the only thing still looking. The read is MONOTONE — once true the fact never
    // goes back — so a resettlement, the one path that deletes the death stamp and only
    // after a fallow far longer than this window, cannot unmake a death the war saw.
    const fact = recordOf(record.fact);
    const pair = pairOf(record);
    const died = fact.loserDied === true
      || principalDied(pair, wholeTick(record.openedTick) ?? 0, diedAtOf);
    // The court can change hands AFTER the front is recalled — the succession that ends
    // a war and the war's last carrier row are different ticks — so this channel needs
    // the window as much as the treaty does.
    const family = text(fact.seatTransitionFamily) || seatTransitionFor(rulings, pair);
    const closedAt = wholeTick(record.concludedTick) ?? tick;
    const holds = live.has(key) || tick - closedAt < PEACE_TERMS_TUNING.PEACE_MINT_WINDOW;
    const learned = died !== (fact.loserDied === true) || family !== text(fact.seatTransitionFamily);
    // Nothing learned and nothing ready ⇒ no ledger churn, which is what keeps a quiet
    // tick free of bytes it did not earn.
    if (holds && !learned) continue;
    // Sealed with what it has. An absence stays typed and absent — a channel the
    // estate never produced is never invented to fill a field.
    next[key] = {
      ...record,
      ...(learned
        ? { fact: {
          ...fact,
          ...(died ? { loserDied: true } : {}),
          ...(family ? { seatTransitionFamily: family } : {}),
        } }
        : {}),
      ...(holds ? {} : { sealed: true }),
    };
    changed = true;
  }

  return changed ? next : null;
}
