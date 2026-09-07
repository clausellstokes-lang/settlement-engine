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
 *   • incident           → a canon flavor chronicle line (no mechanical delta).
 *   • stressor-relief    → the RESOLVE_STRESSOR canon event (ease a live hardship).
 *   • obligation         → the APPLY_STRESSOR canon event (a new burden/debt).
 *   • exposure           → the EXPOSE_CORRUPTION canon event (a covert→revealed).
 *   • structure-harm     → the IMPAIR_INSTITUTION canon event (a place weakened).
 *   • structure-restored → the RESTORE_INSTITUTION canon event (a place mended).
 *   • supply-loss        → the DEPLETE_RESOURCE canon event (a worked resource gone).
 *   • supply-restored    → the RECOVERED_RESOURCE canon event (it flows again).
 * No new physics: no new event type, no registry row, no mutation handler.
 *
 * ── THE FOUR ECONOMY VERBS (atlas Part VII #11) ─────────────────────────────
 * WHY IMPAIR AND NOT DAMAGE: the composer folds DAMAGE_INSTITUTION into
 * IMPAIR_INSTITUTION ("the single weaken-it action", affordanceManifest
 * foldedInto). The table desk must not resurrect a verb the composer's
 * legibility law retired, so structure-harm rides IMPAIR.
 *
 * WHY ONLY structure-harm CARRIES A DIAL: a band is offered iff the engine
 * reads it in a way the DM can SEE. IMPAIR_INSTITUTION reads payload.severity
 * (registry sev01(…, 0.5)) and the handler writes an impairment whose severity
 * decides real consequences — at severity >= 0.6 with dimension 'capacity' a
 * food-anchor institution raises the settlement's food_anchor_lost crisis, so
 * 'major' (0.8) starves the town where 'moderate' (0.5) does not. That dial is
 * honest. RESTORE_INSTITUTION and DEPLETE_RESOURCE have flat stateDeltas that
 * never read severity, so a dial there would be a lie.
 *
 * supply-restored IS THE SUBTLE ONE (recorded because the obvious reading is
 * wrong): RECOVERED_RESOURCE's stateDeltas DOES read payload.severity —
 * sev01(payload?.severity, 0.7). We still send a BARE payload, so the engine
 * takes its own 0.7 default, deliberately: the part of a recovery a DM can see
 * is BINARY (the resource is back or it is not — the handler clears every
 * depletion format regardless), and the band vocabulary is a severity-of-harm
 * scale on which "a Grave recovery" means nothing. Offering it would be a dial
 * whose only effect is a hidden pressure nudge. The dial is withheld on
 * legibility grounds, not because the engine ignores it.
 *
 * dimension IS A FIXED WALL LITERAL ('capacity'), never user input: a
 * legitimacy scandal is the EXISTING 'exposure' kind, and letting the table
 * choose a dimension would let a scandal ride the physical-harm verb.
 *
 * CONSENT GATE: N/A, and that is decided rather than missed. None of the four
 * touches NPC identity, fate, or personhood — the targets are institutions and
 * resources only.
 *
 * DELIBERATELY DEFERRED (documented, not bugs to re-find):
 *   • Trade-good verbs (ADD_TRADE_GOOD / REMOVE_TRADE_GOOD): roster surgery is
 *     an AUTHORING act (the composer/editor desk), not a table moment. A looted
 *     caravan that is pure scarcity is already expressible as obligation.
 *   • Deterministic import-clerk keywords for the four new kinds: eager bytes
 *     in the import mirror, and the manual picker is unaffected (see
 *     domain/tableEvents.js KIND_KEYWORDS).
 *   • The 'table-clerk' EDGE FUNCTION vocabulary allowlist: a deploy seam, and
 *     OWNER-GATED. Safe while stale — the client re-validation wall means a
 *     stale edge can only fail to propose the new kinds, never smuggle one.
 *   • A Herald-side (campaign-scope) mount of this ledger: a separate G-2b
 *     product decision.
 *
 * Two design-listed kinds are deliberately NOT built here for
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

// The four economy verbs' target rosters. Re-exported from the ONE leaf both
// authoring desks share (events/targetRosters.js), so the ledger's pickers and
// the composer's pickers cannot disagree about what is nameable. Both this
// module and the manifest are lazy, so the shared leaf stays off first paint.
export {
  institutionTargets, impairedInstitutionTargets,
  depletableResourceTargets, depletedResourceTargets,
} from './events/targetRosters.js';

/** The provenance stamp on every table-authored effect. */
export const TABLE_EVENT_SOURCE = 'table';

/** The closed, finite vocabulary of table-authorable event kinds. */
export const TABLE_EVENT_KINDS = Object.freeze([
  'incident',
  'stressor-relief',
  'obligation',
  'exposure',
  'structure-harm',
  'structure-restored',
  'supply-loss',
  'supply-restored',
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
 * The FIXED impairment dimension every structure-harm carries. A wall literal,
 * never user input — see the header's dimension note.
 */
export const IMPAIR_DIMENSION = 'capacity';

/**
 * Per-kind spec: the existing engine effect each kind maps to, and whether it
 * needs a bounded magnitude / a typed target. The dispatch tag routes the store
 * committer (settlementRenameHelpers.applyTableEvent) to applyEvent vs the
 * flavor-line helper.
 *
 * payloadShape names the SHAPE of the engine event's payload, and it is the one
 * discriminator buildTableEffect and the admission wall both switch on:
 *   • 'none'     — no engine event at all (a flavor chronicle line).
 *   • 'stressor' — { stressorType, label, severity }.
 *   • 'severity' — { severity }.
 *   • 'impair'   — { severity, dimension } (dimension fixed to IMPAIR_DIMENSION).
 *   • 'bare'     — {} exactly: a typed target and no dial.
 */
export const KIND_SPEC = Object.freeze({
  incident: { needsMagnitude: false, needsTarget: false, dispatch: 'flavor', eventType: null, payloadShape: 'none' },
  'stressor-relief': { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'RESOLVE_STRESSOR', payloadShape: 'stressor' },
  obligation: { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'APPLY_STRESSOR', payloadShape: 'stressor' },
  exposure: { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'EXPOSE_CORRUPTION', payloadShape: 'severity' },
  'structure-harm': { needsMagnitude: true, needsTarget: true, dispatch: 'applyEvent', eventType: 'IMPAIR_INSTITUTION', payloadShape: 'impair' },
  'structure-restored': { needsMagnitude: false, needsTarget: true, dispatch: 'applyEvent', eventType: 'RESTORE_INSTITUTION', payloadShape: 'bare' },
  'supply-loss': { needsMagnitude: false, needsTarget: true, dispatch: 'applyEvent', eventType: 'DEPLETE_RESOURCE', payloadShape: 'bare' },
  'supply-restored': { needsMagnitude: false, needsTarget: true, dispatch: 'applyEvent', eventType: 'RECOVERED_RESOURCE', payloadShape: 'bare' },
});

/** Clamp any value to a finite string; empty for non-strings.
 * @param {unknown} v @returns {string} */
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
 * @param {unknown} input  { kind, targets?: { ref, label? }, magnitude?, flavor? }
 * @returns {{ ok: boolean, errors: string[], record: null | {
 *   kind: string, targetRef: string, targetLabel: string,
 *   band: string|null, severity: number|null, flavor: string } }}
 */
export function validateTableEvent(input) {
  const errors = [];
  const src = /** @type {Record<string, unknown>} */ (input && typeof input === 'object' ? input : {});
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
  const targets = /** @type {Record<string, unknown>} */ (src.targets && typeof src.targets === 'object' ? src.targets : {});
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
 * @returns {{ dispatch: 'flavor', entry: Record<string, unknown> } | { dispatch: 'applyEvent', event: Record<string, unknown> }}
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
  // target + the banded severity; the verbatim flavor rides tableFlavor. The
  // payload shape is the kind's declared one — a 'bare' kind sends {} and lets
  // the engine's own default stand (see the header on supply-restored).
  const shape = spec.payloadShape;
  let payload;
  if (shape === 'bare') payload = {};
  else if (shape === 'impair') payload = { severity: record.severity, dimension: IMPAIR_DIMENSION };
  else if (shape === 'severity') payload = { severity: record.severity };
  else payload = { stressorType: record.targetRef, label: record.targetLabel, severity: record.severity };
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
 * THE EXPOSURE ROSTER — the entities EXPOSE_CORRUPTION can actually act on:
 * corrupt NPCs (the rich path), plus institutions/factions carrying a
 * corruption-typed impairment (the scandal path). MIRRORS the §3 current-state
 * filter `compromisedTargets` in events/affordanceManifest.js — the manifest is
 * a LAZY LEAF pinned to the composer chunk, and importing it from the Session
 * Ledger's chunk would share it across two lazy chunks (the recorded
 * chunk-rebalance hazard), so the ledger reads this mirror instead; parity with
 * the manifest is pinned in tests/domain/tableLedger.test.js so the two rosters
 * cannot drift. Refs use the SAME id-or-name key the engine's findNpc /
 * findInstitution / findFaction resolve, so a picked target always resolves —
 * never the index-keyed ghost ref that vetoes to target_not_found.
 * @param {{ npcs?: unknown, institutions?: unknown,
 *   powerStructure?: { factions?: unknown }, factions?: unknown } | null | undefined} settlement
 * @returns {Array<{ ref: string, label: string }>}
 */
export function exposureTargets(settlement) {
  const s = settlement || {};
  /** @type {Array<{ ref: string, label: string }>} */
  const out = [];
  const marked = (/** @type {Record<string, unknown>} */ e) =>
    Array.isArray(e?.impairments) && e.impairments.some((i) => !!i && i.type === 'corruption');
  const npcs = Array.isArray(s.npcs) ? s.npcs : [];
  for (const n of npcs) {
    if (n?.corrupt) out.push({ ref: String(n.id || n.name), label: String(n.name || n.id) });
  }
  const institutions = Array.isArray(s.institutions) ? s.institutions : [];
  for (const i of institutions) {
    if (marked(i)) out.push({ ref: String(i.id || i.name), label: String(i.name || i.id) });
  }
  const factions = s.powerStructure?.factions || s.factions || [];
  for (const f of Array.isArray(factions) ? factions : []) {
    if (marked(f)) out.push({ ref: String(f.id || f.faction || f.name), label: String(f.faction || f.name || f.id) });
  }
  return out;
}

/**
 * THE CLERK REVIEW (the bucketing-clerk contract). Take a list of RAW proposals
 * (from the AI clerk's free-text → {kind, targets, magnitude} pass) and run each
 * through the schema wall, partitioning into accepted (normalized records) and
 * rejected (with reasons). The clerk NEVER writes: this returns proposals for a
 * human to confirm, and only a validated record can ever proceed. A hallucinated
 * off-vocabulary bucket lands in `rejected`, never in `accepted`.
 *
 * @param {unknown[]} rawProposals
 * @returns {{ accepted: Array<{ index: number, record: ReturnType<typeof validateTableEvent>['record'], proposal: unknown }>,
 *            rejected: Array<{ index: number, errors: string[], proposal: unknown }> }}
 */
export function reviewClerkProposals(rawProposals) {
  /** @type {Array<{ index: number, record: ReturnType<typeof validateTableEvent>['record'], proposal: unknown }>} */
  const accepted = [];
  /** @type {Array<{ index: number, errors: string[], proposal: unknown }>} */
  const rejected = [];
  const list = Array.isArray(rawProposals) ? rawProposals : [];
  list.forEach((proposal, index) => {
    const { ok, errors, record } = validateTableEvent(proposal);
    if (ok) accepted.push({ index, record, proposal });
    else rejected.push({ index, errors, proposal });
  });
  return { accepted, rejected };
}
