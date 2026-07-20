/**
 * domain/tableLedger.js — R-1 THE SESSION LEDGER (the finite-semantics law).
 *
 * THE FINITE-SEMANTICS LAW (owner doctrine, binding): players have unlimited
 * freedom; the world's MEMORY of that freedom is FINITE. Every effect that
 * touches the engine is a TYPED record from a CLOSED vocabulary with BOUNDED
 * magnitude. Free text is FLAVOR ONLY — stored verbatim on the receipt (the
 * DM's own words) and fuel for AI polish — and NEVER reaches a mechanical field.
 *
 * This module is the SCHEMA WALL: the pure, store-agnostic, React-free heart of
 * the table ledger. Both the MANUAL bucket picker and the optional AI CLERK feed
 * their proposals through validateTableEvent() → a normalized record → the typed
 * engine directive from buildTableEffect(). The clerk is a BUCKETING CLERK, never
 * a writer: it proposes {kind, targets, magnitude}; the human confirms; only the
 * confirmed, validated, typed record reaches the engine (the store dispatcher).
 *
 * EXISTING-EFFECTS-ONLY: every kind maps to an effect the engine already has —
 *   • incident        → a canon flavor chronicle line (no mechanical delta).
 *   • stressor-relief → the RESOLVE_STRESSOR canon event (ease a live hardship).
 *   • obligation      → the APPLY_STRESSOR canon event (a new burden/debt).
 *   • exposure        → the EXPOSE_CORRUPTION canon event (a covert→revealed).
 * No new physics. Two design-listed kinds are deliberately NOT built here for
 * lack of a clean existing settlement-blob effect (documented deferrals, not
 * bugs to re-find):
 *   • legitimacy-nudge — no standalone legitimacy event type exists; the field
 *     effect lives coupled inside FORCE_RELIEF. A dedicated LEGITIMACY_NUDGE
 *     event is the clean seam; deferred.
 *   • bond — no settlement-blob NPC/party bond field exists; its natural home is
 *     the campaign-layer broker_relationship party impact (partyImpactKinds.js);
 *     deferred to a party-impact seam.
 *
 * PROVENANCE: every committed table effect carries source: TABLE_EVENT_SOURCE so
 * receipts distinguish table-authored from world-authored history (the soak
 * excludes 'table'). The verbatim free text rides a DEDICATED, non-mechanical
 * field — tableFlavor on an engine event, or narrativeSummary on a pure flavor
 * line — so a source scan of the built directive proves free text can never
 * reach targetId / payload.severity / any stateDeltas-read field.
 */

/** The provenance stamp on every table-authored effect. */
export const TABLE_EVENT_SOURCE = 'table';

/** The closed, finite vocabulary of table-authorable event kinds. */
export const TABLE_EVENT_KINDS = Object.freeze([
  'incident',
  'stressor-relief',
  'obligation',
  'exposure',
]);
const _kindSet = new Set(TABLE_EVENT_KINDS);

/**
 * The bounded magnitude bands (the "bounded magnitude" law). A band id → a
 * clamped 0..1 severity the existing engine effects already read (sev01). A
 * table event may NEVER supply a raw number — only one of these named bands,
 * so magnitude is finite by construction.
 */
export const MAGNITUDE_BANDS = Object.freeze({ minor: 0.25, moderate: 0.5, major: 0.8 });
export const MAGNITUDE_BAND_IDS = Object.freeze(Object.keys(MAGNITUDE_BANDS));

/**
 * The closed set of burden types an `obligation` may impose. Each is a stressor
 * TYPE string the APPLY_STRESSOR classifier already recognizes (scarcity /
 * external limbs), so the target is always a typed selection, never free text.
 */
export const OBLIGATION_TYPES = Object.freeze([
  'debt', 'famine', 'scarcity', 'unrest', 'siege', 'plague',
]);
const _obligationSet = new Set(OBLIGATION_TYPES);

/**
 * Per-kind spec: the existing engine effect each kind maps to, and whether it
 * needs a bounded magnitude / a typed target. The dispatch tag routes the store
 * committer (settlementRenameHelpers.applyTableEvent) to applyEvent vs the
 * flavor-line helper.
 */
export const KIND_SPEC = Object.freeze({
  incident: { needsMagnitude: false, needsTarget: false, dispatch: 'flavor', eventType: null },
  'stressor-relief': { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'RESOLVE_STRESSOR' },
  obligation: { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'APPLY_STRESSOR' },
  exposure: { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'EXPOSE_CORRUPTION' },
});

/** Clamp any value to a finite string; empty for non-strings.
 * @param {any} v @returns {string} */
function asText(v) {
  return typeof v === 'string' ? v : '';
}

/**
 * THE SCHEMA WALL. Validate a proposed table-event bucket ({ kind, targets,
 * magnitude, flavor }) against the closed vocabulary + bounded bands. Pure; no
 * side effects. Returns { ok, errors, record } — a normalized record when ok,
 * or the list of reasons it was refused. This is the ONLY gate a manual pick or
 * a clerk proposal passes before anything can commit.
 *
 * @param {any} input  { kind, targets?: { ref, label? }, magnitude?, flavor? }
 * @returns {{ ok: boolean, errors: string[], record: null | {
 *   kind: string, targetRef: string, targetLabel: string,
 *   band: string|null, severity: number|null, flavor: string } }}
 */
export function validateTableEvent(input) {
  const errors = [];
  const src = input && typeof input === 'object' ? input : {};
  const kind = asText(src.kind);
  if (!_kindSet.has(kind)) {
    errors.push(`kind must be one of: ${TABLE_EVENT_KINDS.join(', ')}.`);
    return { ok: false, errors, record: null };
  }
  const spec = KIND_SPEC[/** @type {keyof typeof KIND_SPEC} */ (kind)];

  // Magnitude — a named band only, never a raw number.
  let band = null;
  let severity = null;
  if (spec.needsMagnitude) {
    band = asText(src.magnitude);
    if (!MAGNITUDE_BAND_IDS.includes(band)) {
      errors.push(`magnitude must be one of: ${MAGNITUDE_BAND_IDS.join(', ')}.`);
    } else {
      severity = MAGNITUDE_BANDS[/** @type {keyof typeof MAGNITUDE_BANDS} */ (band)];
    }
  }

  // Target — a typed reference; the closed obligation vocab for obligation.
  const targets = src.targets && typeof src.targets === 'object' ? src.targets : {};
  const targetRef = asText(targets.ref).trim();
  const targetLabel = asText(targets.label).trim() || targetRef;
  if (spec.needsTarget) {
    if (!targetRef) {
      errors.push('a target is required for this kind.');
    } else if (kind === 'obligation' && !_obligationSet.has(targetRef)) {
      errors.push(`obligation target must be one of: ${OBLIGATION_TYPES.join(', ')}.`);
    }
  }

  // Free text — flavor only, verbatim, unbounded in content but capped in size
  // so a receipt can never carry a runaway blob. It is NEVER read for meaning.
  const flavor = asText(src.flavor).slice(0, 2000);

  if (errors.length) return { ok: false, errors, record: null };
  return {
    ok: true,
    errors: [],
    record: { kind, targetRef, targetLabel, band, severity, flavor },
  };
}

/**
 * Build the typed engine directive from a VALIDATED record. Free text (flavor)
 * is placed ONLY on a dedicated, non-mechanical field: `tableFlavor` on an
 * engine event (never read by any stateDeltas/narrate), or `narrativeSummary`
 * on a pure flavor line (an incident carries no mechanics at all). No mechanical
 * field (targetId, payload.severity, payload.stressorType) ever receives flavor
 * — this is the structural guarantee the source-scan pin enforces.
 *
 * @param {ReturnType<typeof validateTableEvent>['record']} record
 * @returns {{ dispatch: 'flavor', entry: any } | { dispatch: 'applyEvent', event: any }}
 */
export function buildTableEffect(record) {
  if (!record) throw new Error('tableLedger.buildTableEffect: null record');
  const spec = KIND_SPEC[/** @type {keyof typeof KIND_SPEC} */ (record.kind)];
  if (spec.dispatch === 'flavor') {
    // A pure chronicle line — the DM's words ARE the history (no delta).
    return {
      dispatch: 'flavor',
      entry: {
        type: 'TABLE_INCIDENT',
        source: TABLE_EVENT_SOURCE,
        narrativeSummary: record.flavor || 'A moment at the table was recorded.',
      },
    };
  }
  // A typed, bounded engine event. Mechanical fields come ONLY from the typed
  // target + the banded severity; the verbatim flavor rides tableFlavor.
  const payload = spec.eventType === 'EXPOSE_CORRUPTION'
    ? { severity: record.severity }
    : { stressorType: record.targetRef, label: record.targetLabel, severity: record.severity };
  return {
    dispatch: 'applyEvent',
    event: {
      type: spec.eventType,
      targetId: record.targetRef,
      payload,
      source: TABLE_EVENT_SOURCE,
      tableFlavor: record.flavor,
    },
  };
}

/**
 * THE CLERK REVIEW (the bucketing-clerk contract). Take a list of RAW proposals
 * (from the AI clerk's free-text → {kind, targets, magnitude} pass) and run each
 * through the schema wall, partitioning into accepted (normalized records) and
 * rejected (with reasons). The clerk NEVER writes: this returns proposals for a
 * human to confirm, and only a validated record can ever proceed. A hallucinated
 * off-vocabulary bucket lands in `rejected`, never in `accepted`.
 *
 * @param {any[]} rawProposals
 * @returns {{ accepted: Array<{ index: number, record: any, proposal: any }>,
 *            rejected: Array<{ index: number, errors: string[], proposal: any }> }}
 */
export function reviewClerkProposals(rawProposals) {
  /** @type {Array<{ index: number, record: any, proposal: any }>} */
  const accepted = [];
  /** @type {Array<{ index: number, errors: string[], proposal: any }>} */
  const rejected = [];
  const list = Array.isArray(rawProposals) ? rawProposals : [];
  list.forEach((proposal, index) => {
    const { ok, errors, record } = validateTableEvent(proposal);
    if (ok) accepted.push({ index, record, proposal });
    else rejected.push({ index, errors, proposal });
  });
  return { accepted, rejected };
}
