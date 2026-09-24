// heraldFeed.js — THE HERALD FEED SELECTOR (THE REALM INSPECTOR = NEWSPAPER,
// owner doctrine 2026-07-22).
//
// Turns a campaign's recorded pulse + wizard-news records into ONE normalized,
// section-filed feed of HeraldItems the seven news doors render. The filing is the
// routing table (domain/realm/heraldRouting.js) — never a prose scan. This is a
// PURE display selector: no store, no React, no Date/rng. It reads the already-
// recorded shape and files it; it never mints, tunes, or reorders the engine's data.
//
// TWO TIME LENSES (history is a lens, not a door):
//   - 'advance'  — THIS advance: every beat recorded inside the SPAN of the advance
//                  just taken (a week, a month, a year: the span the DM chose), per
//                  advanceLensFloorTick below (FP-21), never only its final week.
//   - 'campaign' — the WHOLE campaign: every recorded pulse's outcomes + digest,
//                  filed the same way. The live stressors + forecast are lens-
//                  independent (they are the realm's present state, not history).
//
// The SUBJECT descriptor + affected ids reuse the canonical WorldPulseData helpers
// (outcomeSubjectDescriptor / collectSettlementIds), so a HeraldItem carries exactly
// what the AddressChain resolver needs — ids, never names.

import { heraldSectionOfRecord, HERALD_SECTIONS } from '../../domain/realm/heraldRouting.js';
import {
  ACTIVE_UI_STAGES,
  collectSettlementIds,
  outcomeSubjectDescriptor,
} from './WorldPulseData.js';

/**
 * @typedef {'war'|'faith'|'trade'|'knowledge'|'events'|'divination'|'adjudication'} HeraldSection
 * @typedef {Object} HeraldItem
 * @property {string} id
 * @property {HeraldSection} section
 * @property {string} headline
 * @property {string} summary
 * @property {number} severity        0..1
 * @property {boolean} major          significance/severity high
 * @property {number|null} tick
 * @property {string[]} reasons
 * @property {{ npcId: string|null, factionId: string|null, factionName: string|null, settlementId: string|number|null }} subject
 * @property {string[]} affectedIds
 * @property {string} kind            the routing token (impactKind/candidateType/type)
 * @property {string|null} rootId     the receipt id the ARTICLE (cause walk) opens on
 * @property {'canon'|'amendable'|'covert'} provenance
 * @property {Record<string, unknown>} record   the source record (for the article + actions)
 */

/** @param {unknown} v @returns {number} */
function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : 0; }

const FALLBACK_HEADLINE_BY_SECTION = Object.freeze({
  war: 'A military report from the realm',
  faith: 'A matter of faith in the realm',
  trade: 'A change in the realm’s trade',
  // FP IN-5: the knowledge desk (the seventh section) — a section-level truth like its siblings.
  knowledge: 'A matter of what the realm believes',
  events: 'A matter of the realm',
  divination: 'A possible turn ahead',
  adjudication: 'A decision awaits review',
});

/** A section-level truth, never a prettified implementation identifier. */
function fallbackHeadline(section) {
  return FALLBACK_HEADLINE_BY_SECTION[section] || FALLBACK_HEADLINE_BY_SECTION.events;
}

/** An authored display label when the source actually carries one. */
function labelOf(record) {
  const label = record?.label;
  return typeof label === 'string' && label.trim() ? label.trim() : null;
}

/**
 * The provenance chip a record carries (non-canonical only shows).
 *
 * ⚠ THE 'decreed' ARM WAS DELETED, NOT DISABLED. Its three disjuncts
 * (`o.decreed`, `record.decreed`, `o.source === 'dm'`) had ZERO writers between
 * them — not production, not test, not fixture. Stronger than unwritten:
 * `normalizeStressor` (domain/worldPulse/stressorsCore.js) is a closed
 * whitelist constructor that does not spread its input, so a stressor CANNOT
 * carry any of them; and no producer writes a top-level `source` on an outcome,
 * digest entry or news entry at all (every engine `source:` is nested inside a
 * causes[]/evidence[] receipt). The DM-authored stressor path does ship
 * (EventComposer APPLY_STRESSOR → crisisLifecycle twinDirectiveForEvent →
 * injectCampaignStressor) but deliberately mints provenance-free records, so
 * wiring a writer would mean widening the persisted stressor shape — a
 * golden-shifting change for a chip `needsAttention` (heraldFilter.js) does not
 * even consult. Reader-side deletion is the honest repair.
 *
 * `o.visibility === 'covert'` went with it for the same reason: the domain
 * spells covert as `covert: true` or `visibility: 'gm'`, never `'covert'`. Its
 * two siblings on that line DO have writers (pulseHelpers, warRulingsNews,
 * npcVerdictPulse, corruptionLeash) and are untouched.
 */
function provenanceOf(record) {
  const o = record?.outcome || record || {};
  if (o.applyMode === 'proposal' || record?.status === 'pending') return 'amendable';
  if (o.covert || record?.covert) return 'covert';
  return 'canon';
}

/** The receipt id an article opens on: the record's own recorded id. */
function rootIdOf(record) {
  const o = record?.outcome || record || {};
  return record?.id != null ? String(record.id) : (o.id != null ? String(o.id) : null);
}

/**
 * Normalize one recorded record into a HeraldItem filed under its section. `forced`
 * lets a caller pin the section (a pending proposal → adjudication) without re-deriving.
 * @param {Record<string, unknown>} record
 * @param {HeraldSection} [forced]
 * @returns {HeraldItem}
 */
export function toHeraldItem(record, forced) {
  const o = /** @type {Record<string, unknown>} */ (record.outcome && typeof record.outcome === 'object' ? record.outcome : record);
  const section = forced || heraldSectionOfRecord(record);
  const severity = num(record.severity ?? o.severity ?? (o.score != null ? Math.min(1, num(o.score) / 100) : 0));
  const major = record.significance === 'major' || o.significance === 'major' || severity >= 0.72;
  // `kind` falls to record.kind LAST: on ordinary wizard entries `kind` is a lifecycle
  // word ('applied'/'queued') and impactKind fires first, but the late-lane authors
  // (momentum/webwar/infowar) mint their routing token AS the kind with no impactKind —
  // without this tail their HeraldItem.kind would be ''.
  const kind = String(o.impactKind || o.candidateType || record.impactKind || record.candidateType
    || (o.stressor && o.stressor.type) || record.type || o.type || record.kind || o.kind || '');
  const authoredHeadline = record.headline || o.headline || labelOf(record) || labelOf(o);
  return {
    id: String(record.id ?? o.id ?? `${section}-${kind}-${record.tick ?? ''}`),
    section,
    headline: String(authoredHeadline || fallbackHeadline(section)),
    summary: String(record.summary || o.summary || ''),
    severity,
    major,
    tick: record.tick != null ? num(record.tick) : (o.tick != null ? num(o.tick) : null),
    reasons: Array.isArray(record.reasons) ? record.reasons : (Array.isArray(o.reasons) ? o.reasons : []),
    subject: outcomeSubjectDescriptor(record),
    affectedIds: collectSettlementIds(record),
    kind,
    rootId: rootIdOf(record),
    provenance: /** @type {HeraldItem['provenance']} */ (provenanceOf(record)),
    record,
  };
}

/** An empty section→items map (single no-narrowing source of truth). */
function emptyBySection() {
  /** @type {Record<HeraldSection, HeraldItem[]>} */
  const out = /** @type {any} */ ({});
  for (const s of HERALD_SECTIONS) out[s] = [];
  return out;
}

/**
 * FP-21 (the chair's ruling of 2026-09-24, on FP EXPERIENCE READ 1 §3 S1 and READ 2 §6:
 * under monthly advances this lens filed 134 of the 661 receipts minted, every one from
 * the month's final week). THE ADVANCE LENS FOLLOWS THE ADVANCE'S SPAN. This returns the
 * EXCLUSIVE floor of the advance just taken: the lens files a recorded beat exactly when
 * its tick is above it.
 *
 * WHY THE PREVIOUS RECORD MARKS THE START. The interval orchestrator collapses every
 * advance to ONE pulse record at its final tick (advanceInterval.js
 * `collapseIntervalHistory`, the Stage 5 ring policy), so the record before the latest is
 * the previous advance's end: the clock this advance began from. Read at display time
 * from the durable history; nothing is written, and the engine never reads it.
 *
 *   no record         → null: nothing has advanced, the whole feed is current (unchanged).
 *   a paused interval → `pausedAdvance.atTick − ticksDone`: its interior records have not
 *                       collapsed yet, and the Stage 3 cursor counts the weeks this
 *                       interval has run (a resumed segment counts from its start).
 *   two or more       → the previous record's tick (a completed advance of any grain).
 *   one record        → 0: the campaign's first advance ran from the birth clock
 *                       (ensureWorldState floors the tick at 0).
 * CLAMPED to the latest tick minus one, so the window is never narrower than the final
 * week the lens kept before this ruling, and a one-week advance reads byte-identically.
 *
 * @param {{ pulseHistory?: unknown, pausedAdvance?: { atTick?: unknown, ticksDone?: unknown } | null } | null | undefined} worldState
 * @returns {number|null}
 */
export function advanceLensFloorTick(worldState) {
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  if (!history.length) return null;
  const latestTick = num(history[history.length - 1]?.tick);
  const paused = worldState?.pausedAdvance;
  const atTick = paused ? paused.atTick : undefined;
  const ticksDone = paused ? paused.ticksDone : undefined;
  const pausedFloor = typeof atTick === 'number' && Number.isFinite(atTick)
    && typeof ticksDone === 'number' && Number.isFinite(ticksDone) && ticksDone >= 1
    ? atTick - ticksDone
    : null;
  const floor = pausedFloor != null
    ? pausedFloor
    : (history.length >= 2 ? num(history[history.length - 2]?.tick) : 0);
  return Math.min(floor, latestTick - 1);
}

/**
 * Build the section-filed feed for a campaign under a time lens.
 * @param {any} campaign
 * @param {{ lens?: 'advance'|'campaign' }} [opts]
 * @returns {{ bySection: Record<HeraldSection, HeraldItem[]>, counts: Record<HeraldSection, number> }}
 */
export function buildHeraldFeed(campaign, opts = {}) {
  const lens = opts.lens === 'campaign' ? 'campaign' : 'advance';
  const worldState = campaign?.worldState || {};
  const bySection = emptyBySection();
  const seen = new Set();

  const file = (item) => {
    if (!item || seen.has(item.id)) return;
    seen.add(item.id);
    (bySection[item.section] || bySection.events).push(item);
  };

  // The recorded pulses: the whole campaign under the campaign lens; under the
  // advance lens every record above the advance's floor (FP-21). A completed advance
  // of any grain has ONE record above it (the interval collapse); a paused interval
  // has one for each week it has run.
  const history = Array.isArray(worldState.pulseHistory) ? worldState.pulseHistory : [];
  const floorTick = lens === 'advance' ? advanceLensFloorTick(worldState) : null;
  const pulses = lens === 'campaign'
    ? history
    : history.filter((pulse) => floorTick == null || num(pulse?.tick) > floorTick);
  for (const pulse of pulses) {
    for (const outcome of (pulse?.selectedOutcomes || [])) file(toHeraldItem(outcome));
    for (const entry of (pulse?.impactDigest || [])) file(toHeraldItem(entry));
    for (const stressor of (pulse?.resolvedStressors || [])) {
      const label = labelOf(stressor);
      file(toHeraldItem({
        ...stressor,
        headline: label ? `${label} has lifted` : 'A recorded pressure has lifted',
      }));
    }
  }

  // The wizard-news feed — the module header's promised second source, wired
  // 2026-07-31. The impactDigest above is frozen from `applied.newsEntries` BEFORE the
  // kernel's late-lane appends (momentum cracks, supply-web campaigns, infowar,
  // treaties), so those beats exist ONLY here: without this read the Herald's doors
  // never showed them even after their receipts gained ids. Read-only on data the
  // campaign already carries; the `seen` set dedupes the digest twins by id, so an
  // entry recorded in both sources files once. Lens: a pulse's movers are handed
  // worldState.tick, the same value the pulse record stores, so a beat belongs to
  // this advance exactly when its tick is ABOVE the advance's floor. The retired rule,
  // `tick >= latestPulse.tick`, was that only for a one-week advance: on a composed
  // month or year it kept the final week alone (R-57 recorded it; FP-21 retired it on
  // the reads' evidence). With no recorded pulse the whole feed is current.
  for (const entry of (campaign?.wizardNews?.entries || [])) {
    if (!entry || entry.id == null) continue;
    if (floorTick != null && num(entry.tick) <= floorTick) continue;
    file(toHeraldItem(entry));
  }

  // Lens-independent operational substrate — the live stressors. Active
  // (non-emerging) file by content; emerging file to divination (the forecast);
  // residual echoes file by content as "in living memory".
  for (const stressor of (worldState.stressors || [])) {
    const stage = stressor.lifecycleStage || 'active';
    if (stressor.status === 'residual') {
      const label = labelOf(stressor);
      file(toHeraldItem({
        id: `echo-${stressor.id}`,
        ...stressor,
        stressor,
        headline: label
          ? `${label}, in living memory`
          : 'A past pressure remains in living memory',
      }));
    } else if (ACTIVE_UI_STAGES.has(stage)) {
      file(toHeraldItem({
        ...stressor,
        stressor,
        headline: labelOf(stressor) || 'A strain on the realm',
      }));
    }
  }

  /** @type {Record<HeraldSection, number>} */
  const counts = /** @type {any} */ ({});
  for (const s of HERALD_SECTIONS) counts[s] = bySection[s].length;
  return { bySection, counts };
}
