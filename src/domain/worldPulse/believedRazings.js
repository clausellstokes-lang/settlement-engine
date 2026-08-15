/**
 * believedRazings.js — WR-8 amendment R2 (CR-WR8-C): THE BELIEVED-RAZING READ MODEL.
 *
 * The atrocity casus `atrocity_answer` mints on what a court BELIEVES happened,
 * never on what did. `scoreAtrocityAnswer` has held that contract since W-PEACE-1
 * and has had no producer: it takes "the razings the observer believes occurred"
 * and nothing in the pulse assembled that list. This leaf is that list.
 *
 * ── THE THREE DISCIPLINES, EACH STRUCTURAL ──────────────────────────────────
 *
 * (1) IT READS THE PUBLIC FEED, AND ONLY THE PUBLIC FEED. The source is
 * `wizardNews` — the same surface a player reads. A razing the world never
 * reported raises no outrage anywhere, and a court that was lied to acquires it
 * anyway, because the feed is what courts have. THERE IS NO NEW PERSISTED
 * SURFACE: this module writes nothing, stores nothing, and adds no key to any
 * ledger. Every fact it uses was already being persisted by the news curator.
 *
 * (2) ATTRIBUTION IS BY PROOF. `newsEntryForOutcome` carries the emission's id
 * forward as `sourceEventId`, and the razing's id is minted by
 * `razingOutcomeIdFor`. So the reader RE-MINTS the id from its own candidate —
 * (accused, victim, tick, road) — and compares for EQUALITY. It never splits the
 * id on `.`: settlement ids may contain dots, and a mis-parse here would accuse
 * the wrong court of burning a town, which under R2's license machinery is a
 * warrant to burn another one. A candidate that does not reconstruct exactly is
 * not the razer, whatever its id happens to contain.
 *
 * (3) BELIEF ARRIVES AT NEWS SPEED. An entry is admitted only once
 * `entry.tick + routeAwareHopDelayTicks(victim → observer)` has arrived, off the
 * estate's ONE distance curve (`distancePricedNews`, the same one the belief
 * engine and the player-visible rumor staleness share). A court on the far side
 * of the map does not acquire outrage the tick the fire is lit. The curve is
 * gated exactly where every other consumer gates it — `distancePricedNewsEnabled`
 * — so an ungated world reads delay 0 and hears everything at once, which is the
 * pre-existing behaviour of every other news consumer rather than a rule invented
 * here.
 *
 * ── ⚠️⚠️ THE RECORDED LIMIT: THE WORLD FORGETS THE SMALLER FIRES ────────────
 * This reads a BOUNDED surface, and the bound is real. `wizardNews` caps at
 * MAX_ENTRIES (240) while `ATROCITY_DECAY_TICKS` is 260, so in a busy realm a
 * razing can scroll out of the feed BEFORE its outrage has finished decaying —
 * and when it does, the casus it was feeding vanishes early. `capEntries` rescues
 * one head per MAJOR arc, and `newsEntryForOutcome` grades an outcome major at
 * severity >= 0.72, so the biggest burnings persist for their full band and the
 * lesser ones may not.
 *
 * That asymmetry is CHARACTER, not a defect to paper over: a realm remembers the
 * atrocity that horrified it and loses the one that merely appalled it. It is
 * stated here, pinned as behaviour in believedRazingCasusWr8.test.js, and
 * recorded in the queue row, so nobody re-finds it as a bug.
 *
 * PURE: no rng, no wall clock, no mutation, no writes. Memoized per (observer,
 * accused) pair within one pass, in the `makeHegemonyFear` idiom.
 */

import { RAZING_ROADS, razingOutcomeIdFor } from './razing.js';
import { activeSpatialDigest } from '../spatial/distanceRead.js';
import { embattlementLevel } from '../spatial/embattlement.js';
import { routeAwareHopDelayTicks } from './distancePricedNews.js';

/** The `impactKind` a razing entry carries. `newsEntryForOutcome` sets impactKind
 *  from `outcome.candidateType`, and the razing emission's candidateType is
 *  'razing' — named here so the coupling has one spelling instead of a literal
 *  buried in a filter. */
export const RAZING_NEWS_IMPACT_KIND = 'razing';

/**
 * THE ONE FROZEN EMPTY, module-scoped rather than per-build. Every world that has
 * not burned a town — which is nearly every world — gets back THIS object by
 * reference from every reader, so "nothing is believed" is byte-neutral by
 * identity rather than merely by value.
 * @type {ReadonlyArray<{ razerId: string, victimName: string, tick: number }>}
 */
const NOTHING_BELIEVED = Object.freeze([]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** The feed's entry rows, whichever of the two shapes the caller holds (a bare
 *  array, or the `{ entries }` envelope the kernel threads).
 *  @param {unknown} wizardNews @returns {Array<Record<string, unknown>>} */
export function newsEntriesOf(wizardNews) {
  if (Array.isArray(wizardNews)) return wizardNews.map(recordOf);
  const entries = recordOf(wizardNews).entries;
  return Array.isArray(entries) ? entries.map(recordOf) : [];
}

/**
 * THE RAZING ENTRIES, NARROWED ONCE PER PASS. Everything that is a fact about the
 * ENTRY rather than about the observer is resolved here — the kind, the victim,
 * the stamped tick — so the per-observer walk below costs one reconstruction per
 * candidate rather than a re-scan of the feed.
 * @param {unknown} wizardNews
 * @returns {Array<{ sourceEventId: string, victimId: string, tick: number }>}
 */
export function razingNewsRows(wizardNews) {
  /** @type {Array<{ sourceEventId: string, victimId: string, tick: number }>} */
  const rows = [];
  for (const entry of newsEntriesOf(wizardNews)) {
    if (String(entry.impactKind ?? '') !== RAZING_NEWS_IMPACT_KIND) continue;
    const sourceEventId = String(entry.sourceEventId ?? '');
    if (!sourceEventId) continue;
    const ids = Array.isArray(entry.settlementIds) ? entry.settlementIds : [];
    const victimId = ids.length ? String(ids[0] ?? '') : '';
    const at = Number(entry.tick);
    if (!victimId || !Number.isFinite(at)) continue;
    rows.push({ sourceEventId, victimId, tick: Math.trunc(at) });
  }
  return rows;
}

/**
 * THE ROAD A GIVEN COURT TOOK ONTO A GIVEN ENTRY, recovered by reconstruction.
 * Walks the CLOSED `RAZING_ROADS` vocabulary, re-mints the id for each road, and
 * returns the one that matches exactly — or null, which means "this court did not
 * burn that town" and is the answer for every court but one.
 * @param {{ sourceEventId: string, victimId: string, tick: number }} row
 * @param {string} accusedId
 * @returns {string|null}
 */
export function roadForAccused(row, accusedId) {
  const accused = String(accusedId || '');
  if (!accused) return null;
  for (const road of RAZING_ROADS) {
    const rebuilt = razingOutcomeIdFor({
      road, razerId: accused, victimId: row.victimId, tick: row.tick,
    });
    if (rebuilt && rebuilt === row.sourceEventId) return road;
  }
  return null;
}

/**
 * Build the believed-razing reader for ONE pass of the war-reason mover, in the
 * `makeHegemonyFear` idiom: the feed is narrowed once, the distance digest and
 * the route-status reader are resolved once, and each (observer, accused) answer
 * is memoized. Absent feed / no razing entries ⇒ every call returns the SAME
 * frozen empty array, so the consumer's score is 0 and the world is
 * byte-identical — which is every world that has not burned a town.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, wizardNews?: unknown, tick?: unknown }} args
 * @returns {{ believedFor: (observerId: string, accusedId: string) =>
 *   ReadonlyArray<{ razerId: string, victimName: string, tick: number }> }}
 */
export function makeBelievedRazings({
  worldState = null, snapshot = null, wizardNews = null, tick = 0,
} = {}) {
  const rows = razingNewsRows(wizardNews);
  if (!rows.length) return { believedFor: () => NOTHING_BELIEVED };

  const now = Number(tick);
  if (!Number.isFinite(now)) return { believedFor: () => NOTHING_BELIEVED };

  // THE ESTATE'S ONE DISTANCE CURVE, gated where every other consumer gates it.
  // Dark ⇒ null digest ⇒ delay 0 ⇒ news is instantaneous, exactly as it is for
  // the rumor display and the belief engine in the same world.
  const rules = recordOf(recordOf(worldState).simulationRules);
  const digest = rules.distancePricedNewsEnabled === true
    ? activeSpatialDigest(/** @type {Parameters<typeof activeSpatialDigest>[0]} */ (worldState))
    : null;
  const embattlementOf = digest
    ? (/** @type {string} */ sid) => embattlementLevel(
      /** @type {Parameters<typeof embattlementLevel>[0]} */ (worldState), sid,
    )
    : null;

  // THE NEWS ADDRESS LAW reaches the casus receipt: `scoreAtrocityAnswer` puts
  // this string in a sentence a DM reads, so the burned town is named rather than
  // keyed. An unresolvable id falls back to itself — a receipt that says something
  // true and ugly beats one that says nothing.
  const byId = recordOf(snapshot).byId;
  /** @param {string} sid @returns {string} */
  const nameOf = (sid) => {
    const item = byId instanceof Map ? byId.get(sid) : null;
    const named = String(recordOf(recordOf(item).settlement).name ?? '').trim();
    return named || sid;
  };

  /** @type {Map<string, ReadonlyArray<{ razerId: string, victimName: string, tick: number }>>} */
  const memo = new Map();

  return {
    believedFor(observerId, accusedId) {
      const observer = String(observerId || '');
      const accused = String(accusedId || '');
      // A court does not accuse itself, and an unnamed one accuses nobody.
      if (!observer || !accused || observer === accused) return NOTHING_BELIEVED;
      const key = `${observer}\u0000${accused}`;
      const cached = memo.get(key);
      if (cached) return cached;
      /** @type {Array<{ razerId: string, victimName: string, tick: number }>} */
      const believed = [];
      for (const row of rows) {
        // ⚠️ AN OBSERVER IS NOT A WITNESS TO ITS OWN BURNING, and that is
        // J-WZ4-3's discipline applied a second time rather than a new rule.
        // The razed town's own cause against its razer is already carried by
        // the grievance / revanchism clocks (the emission writes a war_pressure
        // condition and a sack the wound set reads). Letting the victim ALSO
        // hold `atrocity_answer` would score one burning twice under two names.
        // This casus measures the THIRD-PARTY outrage — "someone must stop them."
        if (row.victimId === observer) continue;
        const road = roadForAccused(row, accused);
        if (!road) continue;
        // ⚠️ THE JUST RAZING RAISES NOTHING. A vengeance answer was already
        // licensed by an earlier atrocity (R2); letting it mint a fresh casus
        // against the avenger would make the moral ledger self-feeding — every
        // answer manufacturing the next grievance, forever.
        if (road === 'vengeance') continue;
        const delay = digest
          ? routeAwareHopDelayTicks(digest, row.victimId, observer, embattlementOf)
          : 0;
        if (row.tick + delay > now) continue; // the word has not arrived yet
        believed.push({ razerId: accused, victimName: nameOf(row.victimId), tick: row.tick });
      }
      const frozen = believed.length ? Object.freeze(believed) : NOTHING_BELIEVED;
      memo.set(key, frozen);
      return frozen;
    },
  };
}
