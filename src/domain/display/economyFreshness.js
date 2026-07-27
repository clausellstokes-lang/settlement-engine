/**
 * domain/display/economyFreshness.js — the honest declaration of the
 * post-applyEvent economy stale-derivation window (Wave R-3 Lane C; atlas
 * economy-family gap 2).
 *
 * THE WINDOW: applyEvent mutates institutions / resources / trade config,
 * but reconcileSettlementChange runs NO economy pass — the derived economy
 * read-models (economicState.activeChains, availableServices, prosperity,
 * resourceAnalysis) keep their generation-time values until the next full
 * rebuild. The tabs partially compensate with live impairment overlays
 * (computeChainSets), but membership-level changes (a new granary's
 * services, a depleted resource's chain) are not re-derived.
 *
 * WHY DECLARE INSTEAD OF RE-DERIVE (the R-3 cure decision, recorded):
 *   - Re-deriving at the applyEvent seam would REWRITE PERSISTED FIELDS
 *     (the store persists nextSettlement to the save) — a persisted-output
 *     change, forbidden without an owner-signed shift.
 *   - The generation economy pass consumes rng (custom-service admission
 *     rolls), so re-running it post-event draws different numbers — the
 *     same-seed drift class THE PROMISE forbids.
 *   - The step-level partial-rerun engine was deliberately retired
 *     (registryRerunKeys.js header); rebuilding one is R-5/owner-gated
 *     architecture, queued there by the remediation plan.
 * So the display sites say what is true instead: the tallies are as judged
 * at the last survey, and events since then may not be counted yet.
 *
 * THE CLASSIFICATION STORY (Wave R-4 structural cure). Every economy
 * read-model reader under src/components and src/pdf is classified into
 * exactly one of four buckets, and the census walker
 * tests/lint/economyReadModelCoverage.walker.test.js FAILS CLOSED on any
 * reader it cannot place. That walker's four frozen lists are the single
 * authority; this docblock is the prose of the same taxonomy, and the walker
 * pins the two against each other so they cannot drift apart.
 *
 *   1. COVERED — renders the shared note leaf
 *      (components/new/EconomyFreshnessNote.jsx, the ONE rendering home) fed
 *      by economyFreshnessNote() below:
 *        - tabs/EconomicsTab.jsx   — the 'tallies' sentence
 *        - tabs/ServicesTab.jsx    — the 'catalog' sentence
 *        - new/SummaryTab.jsx      — 'tallies', anchored under the SITUATION
 *          ROW so it qualifies the Economy tile, not the whole dossier
 *        - new/SummaryTabV2.jsx    — 'tallies' (the DEFAULT summary tab,
 *          flag summaryMagazineV2=true), under the defining truths whose
 *          "How it lives" fact carries the stale read
 *        - TableView.jsx           — 'tallies' (LIVE: flag tableView=true)
 *        - session/SessionMode.jsx — 'tallies' (LIVE: flag sessionMode=true)
 *      All six render the SAME sentence bytes; the copy is one vetoable unit.
 *
 *   2. FRAMED — carries the standing first-survey framing sentence instead
 *      (a whole-tab caveat that already says the numbers are as judged at the
 *      survey): tabs/OverviewTab.jsx, tabs/ViabilityTab.jsx,
 *      tabs/DefenseTab.jsx. Adding the event note there would double-caveat
 *      one tab.
 *
 *   3. PRINT-DEFERRED — every economy reader under src/pdf. A printed dossier
 *      is a snapshot by nature and the print voice is owner-parked; the
 *      standing print deferral covers the chapters and their view-model
 *      helpers, plus the document roots SettlementPDF.jsx and variants.js,
 *      which reach the models through the tonightAtTheTable composer.
 *
 *   4. FROZEN-DEFERRED — a reader that reaches an economy read-model but owns
 *      no user-facing freshness claim, each with its recorded reason in the
 *      walker's list (routing-only props, children of a covered surface, pure
 *      helpers, gallery/share facets, authored-prose editors, dead code).
 *
 * NOT COVERED BY DESIGN (recorded so it is deferred-and-visible, never
 * silently rediscovered):
 *   - The COPYABLE markdown SummaryTab emits carries the prosperity line with
 *     no caveat — an owner call, see HONEST LIMITS below.
 *   - DailyLifeTab reads prosperity + activeChains only through
 *     new/dailyLifeLogic.js, and only to SELECT descriptive prose (never to
 *     print a tally). The walker classifies the helper, not the tab, so the
 *     tab itself is a known blind spot of the pattern scan.
 *
 * DETECTOR: walks settlement.reconciliationLog (the unified draft+canon
 * trail appended by reconcileSettlementChange; capped at 20 entries)
 * newest-first. A 'regenerate' entry is a full-rebuild boundary — the
 * economy pass ran there, so the walk stops. Event entries ('canon_event'
 * or 'draft_event') count when their changeType's declared
 * RERUN_KEYS_FOR_EVENT intersect the economy read-model keys — the
 * registry's own event→subsystem declaration, so a NEW event type is
 * covered by construction the moment it declares an economy key.
 *
 * HONEST LIMITS (each deliberate, none silent):
 *   - undoLastEvent scrubs the event's artifacts but does NOT remove its
 *     reconciliationLog entry, so the note can linger after an undo until
 *     the next rebuild. The display copy says "may" for exactly this
 *     reason — it never claims a specific uncounted change.
 *   - A world-pulse advance rewrites activeChains surgically (calamity /
 *     resourceDynamics kernels) but re-derives neither availableServices
 *     nor resourceAnalysis, so an advance is deliberately NOT credited as
 *     a boundary.
 *   - The trail cap (20) can age out the 'regenerate' boundary; every
 *     surviving entry is then an event entry, which keeps the answer
 *     correct (still stale).
 *   - The pendingEdits commit lane (G-1 spine) appends no trail entries;
 *     its staleness story belongs to that seam, not this detector.
 *   - The COPYABLE markdown SummaryTab emits (its Copy button) carries the
 *     prosperity line WITHOUT the caveat. Deliberate for now: whether exported
 *     or pasted text should carry staleness caveats is a product call, parked
 *     for the owner rather than decided here.
 *
 * Pure functions, no store, no React (the headless-engine spine forbids it —
 * that is why the rendering half lives in components/new/EconomyFreshnessNote
 * and only the SENTENCES live here). Lazy display leaf — imported only by lazy
 * dossier / takeover surfaces (EconomicsTab, ServicesTab, SummaryTab,
 * SummaryTabV2, TableView, SessionMode chunks); never from the eager pipeline.
 * MEASURED 2026-07-27 against a real vite build: none of the eager
 * entry-closure chunks carries this module's fingerprints, so every consumer
 * edge is lazy-to-lazy and a static import is correct here.
 * @enforced-by tests/domain/economyFreshness.test.js
 * @enforced-by tests/components/economyFreshnessNote.test.jsx
 * @enforced-by tests/lint/economyReadModelCoverage.walker.test.js
 */

import { RERUN_KEYS_FOR_EVENT } from '../events/registryRerunKeys.js';

/** The derived economy read-models the stale window leaves ungrown. */
const ECONOMY_READMODEL_KEYS = ['services', 'activeChains', 'economicState'];

/** Trail sources written by the event lanes (store applyEvent, the queued
 *  drain, the authoritative canon command path). */
const EVENT_SOURCES = new Set(['canon_event', 'draft_event']);

/** Trail sources that mark a full re-derivation of the economy pass. */
const REBUILD_SOURCES = new Set(['regenerate']);

/**
 * Does an event of this type touch any derived economy read-model,
 * per the registry's own subsystem declaration?
 * @param {unknown} type
 * @returns {boolean}
 */
export function eventTypeShiftsEconomy(type) {
  const keys = RERUN_KEYS_FOR_EVENT[/** @type {string} */ (type)];
  return Array.isArray(keys) && keys.some(k => ECONOMY_READMODEL_KEYS.includes(k));
}

/**
 * Has this settlement had economy-touching events applied since its last
 * full survey (generation/regeneration)?
 *
 * @param {{ reconciliationLog?: Array<{ source?: unknown, changeType?: unknown }> } | null | undefined} settlement
 * @returns {{ shifted: boolean, eventCount: number }}
 */
export function economyShiftSinceSurvey(settlement) {
  const trail = settlement?.reconciliationLog;
  if (!Array.isArray(trail) || trail.length === 0) {
    return { shifted: false, eventCount: 0 };
  }
  let eventCount = 0;
  for (let i = trail.length - 1; i >= 0; i--) {
    const entry = trail[i];
    const source = String(entry?.source || '');
    if (REBUILD_SOURCES.has(source)) break;
    if (EVENT_SOURCES.has(source) && eventTypeShiftsEconomy(String(entry?.changeType || ''))) {
      eventCount++;
    }
  }
  return { shifted: eventCount > 0, eventCount };
}

/**
 * THE SENTENCE, in its only home. Every covered surface renders one of these
 * two bytes-for-bytes; the pair is ONE vetoable copy decision (re-word one and
 * you are re-wording the freshness voice everywhere it appears).
 *
 * 'tallies'  — surfaces that show counted/derived economy figures
 *              (EconomicsTab, SummaryTab, SummaryTabV2, TableView, SessionMode).
 * 'catalog'  — the service catalog (ServicesTab), where "tallies" would name
 *              the wrong object.
 *
 * VOICE: no em dash, no exclamation, "may" not "will" — the detector proves an
 * economy-touching event landed, never that a specific figure is now wrong.
 * @type {Readonly<Record<'tallies'|'catalog', string>>}
 */
export const ECONOMY_FRESHNESS_SENTENCES = Object.freeze({
  tallies: "Events recorded after this settlement's last survey may not be fully counted in these tallies yet.",
  catalog: "Events recorded after this settlement's last survey may not be fully counted in this catalog yet.",
});

/**
 * The one place the detector and the copy meet: the sentence a surface should
 * show, or null when the settlement is fresh (no note, byte-identical render).
 *
 * @param {Parameters<typeof economyShiftSinceSurvey>[0]} settlement
 * @param {'tallies'|'catalog'} [variant]
 * @returns {string | null}
 */
export function economyFreshnessNote(settlement, variant = 'tallies') {
  if (!economyShiftSinceSurvey(settlement).shifted) return null;
  return ECONOMY_FRESHNESS_SENTENCES[variant] || ECONOMY_FRESHNESS_SENTENCES.tallies;
}
