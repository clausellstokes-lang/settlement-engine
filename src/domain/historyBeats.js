/**
 * domain/historyBeats.js — Structured causal beats over settlement history.
 *
 * Tier 4.7 of the roadmap. Today's history fields are descriptive prose:
 *
 *   settlement.history.age
 *   settlement.history.founding             { age, reason, foundedBy, … }
 *   settlement.history.historicalEvents[]   { name, yearsAgo, severity, lastingEffects, … }
 *   settlement.history.currentTensions[]
 *   settlement.history.historicalCharacter
 *   settlement.history.eventsTimeline[]
 *   settlement.history.legacyAnnotations[]
 *   settlement.history.siegeNarrative
 *
 * The roadmap's target promotes these into seven canonical causal beats:
 *
 *   founding_cause           — why the settlement exists at all
 *   first_prosperity_source  — what made it economically viable
 *   defining_crisis          — the single event that shapes present character
 *   institutional_legacy     — which institutions trace to historical pressure
 *   recent_disruption        — what's still being felt
 *   unresolved_wound         — what hasn't healed
 *   likely_future            — where this is going (delegated to simulationSpine)
 *
 * Each beat is structured:
 *   { key, label, text, source, references? }
 *
 * Pure read-only derivation; no generator changes; tolerant of missing
 * fields. The legacy text is preserved; the canonical shape is layered.
 *
 * No imports from src/lib — domain tsconfig include stays self-contained.
 */

// ── The read shape ──────────────────────────────────────────────────────
// These derivations are READERS: they never construct history, they only
// interrogate it. The typedefs below are the fields this file actually
// touches, gathered from the accesses in the derivations themselves. Every
// field is optional because tolerance of missing history is the contract
// stated at the top of this file, not an accident.

/**
 * One entry of `settlement.history.historicalEvents[]`.
 * @typedef {{
 *   name?: string,
 *   type?: string,
 *   description?: string,
 *   yearsAgo?: number,
 *   severity?: string,
 *   lastingEffects?: Array<string|{ type?: string }>
 * }} HistoricalEvent
 */

/**
 * One entry of `settlement.history.legacyAnnotations[]` — the generator's own
 * structured commentary on what an event left behind.
 * @typedef {{ annotation?: string, eventName?: string, yearsAgo?: number }} LegacyAnnotation
 */

/**
 * One entry of `settlement.history.currentTensions[]`. The generator emits
 * bare strings from one path and objects from another; both are handled.
 *
 * `type` is the shape the CURRENT generator writes — a snake_case token beside
 * a `description` sentence — and it was missing from this typedef for as long
 * as the likely-future mirror was failing to read it. `label`/`name`/`text`
 * are authored-import spellings, retained for tolerance.
 * @typedef {string|{ type?: string, text?: string, description?: string, name?: string, label?: string }} CurrentTension
 */

/**
 * `settlement.history.founding` — the founding arc.
 * @typedef {{
 *   age?: number|string,
 *   reason?: string,
 *   foundedBy?: string,
 *   initialChallenge?: string,
 *   overcoming?: string
 * }} FoundingRecord
 */

/**
 * The slice of a settlement the beat derivations read.
 * @typedef {{
 *   history?: {
 *     founding?: FoundingRecord,
 *     historicalEvents?: HistoricalEvent[],
 *     currentTensions?: CurrentTension[],
 *     legacyAnnotations?: LegacyAnnotation[]
 *   },
 *   economicState?: { topExport?: string, primaryExport?: string },
 *   economy?: { topExport?: string, primaryExport?: string },
 *   powerStructure?: { stability?: unknown }
 * }} HistoryBeatSource
 */

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * @param {...unknown} candidates
 * @returns {string|null}
 */
function firstNonEmpty(...candidates) {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}

const SEVERITY_RANK = Object.freeze({
  catastrophic: 4,
  major:        3,
  moderate:     2,
  minor:        1,
});

/**
 * Total order on severity. Unknown values rank below 'minor'.
 * @param {string | null | undefined} s
 * @returns {number}
 */
function severityScore(s) {
  return SEVERITY_RANK[/** @type {keyof typeof SEVERITY_RANK} */ ((s || '').toLowerCase())] || 0;
}

/**
 * @template T
 * @param {T[]} arr
 * @param {(item: T) => number} scoreFn
 * @returns {T|null}
 */
function _topBy(arr, scoreFn) {
  if (!Array.isArray(arr) || !arr.length) return null;
  let best = arr[0];
  let bestScore = scoreFn(best);
  for (let i = 1; i < arr.length; i++) {
    const s = scoreFn(arr[i]);
    if (s > bestScore) {
      best = arr[i];
      bestScore = s;
    }
  }
  return best;
}

// ── Per-beat derivations ────────────────────────────────────────────────

/** @param {HistoryBeatSource} settlement */
function deriveFoundingCause(settlement) {
  const founding = settlement?.history?.founding;
  if (!founding) return null;

  // Compose a single-line explanation from the parts available. Each
  // founding event has 'reason', 'foundedBy', and an 'overcoming' arc.
  const reason     = firstNonEmpty(founding.reason);
  const foundedBy  = firstNonEmpty(founding.foundedBy);
  const challenge  = firstNonEmpty(founding.initialChallenge);

  if (!reason && !foundedBy) return null;

  const parts = [];
  if (reason) parts.push(reason);
  if (foundedBy) parts.push(`founded by ${foundedBy}`);
  if (challenge) parts.push(`survived early on by overcoming ${challenge}`);

  return {
    key: 'foundingCause',
    label: 'Founding cause',
    text: parts.join('; ') + '.',
    source: 'history.founding',
    references: {
      yearsAgo: founding.age,
    },
  };
}

/** @param {HistoryBeatSource} settlement */
function deriveFirstProsperitySource(settlement) {
  // Strongest signal today: the topExport on the economic state — that's
  // what the settlement currently trades on. We hedge with the founding
  // arc when no export is reported.
  const eco = settlement?.economicState || settlement?.economy || {};
  const topExport = firstNonEmpty(eco.topExport, eco.primaryExport);
  const overcoming = firstNonEmpty(settlement?.history?.founding?.overcoming);

  let text;
  if (topExport) {
    text = `Its first prosperity came from ${topExport.toLowerCase()}; the settlement grew around that flow.`;
  } else if (overcoming) {
    text = `Prosperity came slowly, ${overcoming.toLowerCase()}.`;
  } else {
    return null;
  }

  return {
    key: 'firstProsperitySource',
    label: 'First prosperity source',
    text,
    source: topExport ? 'economy.topExport' : 'history.founding.overcoming',
  };
}

/** @param {HistoryBeatSource} settlement */
function deriveDefiningCrisis(settlement) {
  // The defining crisis is the most severe historical event. Among
  // events of equal severity, prefer the older one — those leave deeper
  // institutional grooves.
  const events = settlement?.history?.historicalEvents;
  if (!Array.isArray(events) || events.length === 0) return null;

  const ranked = [...events].sort((a, b) => {
    const ds = severityScore(b.severity) - severityScore(a.severity);
    if (ds !== 0) return ds;
    return (b.yearsAgo || 0) - (a.yearsAgo || 0);
  });
  const top = ranked[0];
  if (severityScore(top.severity) < SEVERITY_RANK.major) return null;

  const text = top.description
    ? `${top.name} (${top.yearsAgo ?? '—'} years ago): ${top.description}`
    : `${top.name} (${top.yearsAgo ?? '—'} years ago).`;

  return {
    key: 'definingCrisis',
    label: 'Defining crisis',
    text,
    source: 'history.historicalEvents',
    references: {
      eventName: top.name,
      eventType: top.type,
      yearsAgo:  top.yearsAgo,
      severity:  top.severity,
    },
  };
}

/** @param {HistoryBeatSource} settlement */
function deriveInstitutionalLegacy(settlement) {
  // Events whose lastingEffects mention 'institution' or that have an
  // institutional effect listed in some form. These are the events that
  // built the present-day structural character.
  const events = (settlement?.history?.historicalEvents || []);
  const carriers = events.filter(e => {
    const effects = e?.lastingEffects;
    if (!Array.isArray(effects) || !effects.length) return false;
    return effects.some(ef =>
      (typeof ef === 'string' && /institution|guild|temple|watch|council|mill|hospital/i.test(ef))
      || (typeof ef === 'object' && (ef.type === 'institutional' || /institution/i.test(JSON.stringify(ef))))
    );
  });

  // Fall back to legacyAnnotations[0] — the generator's own structured
  // commentary on what an event left behind.
  if (carriers.length === 0) {
    const ann = settlement?.history?.legacyAnnotations?.[0];
    if (ann && ann.annotation) {
      return {
        key: 'institutionalLegacy',
        label: 'Institutional legacy',
        text: ann.annotation,
        source: 'history.legacyAnnotations',
        references: {
          eventName: ann.eventName,
          yearsAgo:  ann.yearsAgo,
        },
      };
    }
    return null;
  }

  // Combine names of carriers into a single sentence; cite the oldest
  // first since older crises shape deeper structural legacy.
  const sorted = [...carriers].sort((a, b) => (b.yearsAgo || 0) - (a.yearsAgo || 0));
  const names = sorted.slice(0, 3).map(e => e.name).filter(Boolean);
  if (!names.length) return null;

  return {
    key: 'institutionalLegacy',
    label: 'Institutional legacy',
    text: `Present-day institutions still bear the marks of ${names.join(', ')}.`,
    source: 'history.historicalEvents.lastingEffects',
    references: {
      eventNames: names,
    },
  };
}

/**
 * The one deriver that stays untyped, for two reasons the checker cannot see
 * past and this lane may not fix with a runtime edit:
 *   1. `Number.isFinite(e.yearsAgo) ? e.yearsAgo : Infinity` — Number.isFinite
 *      is not a type predicate, so with `yearsAgo?: number` the ternary is
 *      still `number|undefined` and the `<= 30` reds (TS2532);
 *   2. the legacyAnnotations fallback returns `recentAnn.annotation` straight
 *      into a beat's `text`, and `annotation` is optional — typing it honestly
 *      makes the beat `text: string|undefined`, which HistoryBeat refuses.
 * (2) is a latent hole worth a look on its own: a beat with an undefined text
 * would render blank. Recorded, not fixed here — this lane changes types only.
 *
 * @param {any} settlement
 */
function deriveRecentDisruption(settlement) {
  // Most recent significant disruption — within the last 30 years AND
  // severity ≥ major. Falls back to legacyAnnotations[0] if no recent
  // major events. Falls back to null if neither is present.
  const events = /** @type {any[]} */ (settlement?.history?.historicalEvents || []);
  // Number.isFinite, not truthiness: campaign-era events carry yearsAgo 0
  // (they ARE the recent disruption) and `0 || Infinity` silently excluded
  // every one of them.
  const recent = events
    .filter(e => severityScore(e.severity) >= SEVERITY_RANK.major)
    .filter(e => (Number.isFinite(e.yearsAgo) ? e.yearsAgo : Infinity) <= 30)
    .sort((a, b) => (Number.isFinite(a.yearsAgo) ? a.yearsAgo : 0) - (Number.isFinite(b.yearsAgo) ? b.yearsAgo : 0));

  if (recent.length > 0) {
    const top = recent[0];
    return {
      key: 'recentDisruption',
      label: 'Recent disruption',
      text: top.description
        ? `${top.name} (${top.yearsAgo} years ago) is still being felt: ${top.description}`
        : `${top.name} (${top.yearsAgo} years ago) is still being felt.`,
      source: 'history.historicalEvents',
      references: { eventName: top.name, yearsAgo: top.yearsAgo },
    };
  }

  // Fall back to a legacy annotation about a more recent moderate event,
  // since some settlements have nothing major in the last 30 years.
  const anns = /** @type {any[]} */ (settlement?.history?.legacyAnnotations || []);
  const recentAnn = anns
    .filter(a => (a.yearsAgo || Infinity) <= 50)
    .sort((a, b) => (a.yearsAgo || 0) - (b.yearsAgo || 0))[0];
  if (recentAnn) {
    return {
      key: 'recentDisruption',
      label: 'Recent disruption',
      text: recentAnn.annotation,
      source: 'history.legacyAnnotations',
      references: { eventName: recentAnn.eventName, yearsAgo: recentAnn.yearsAgo },
    };
  }

  return null;
}

/** @param {HistoryBeatSource} settlement */
function deriveUnresolvedWound(settlement) {
  // Pulled from currentTensions. The generator produces tensions as
  // strings OR objects depending on the source — handle both.
  const tensions = settlement?.history?.currentTensions;
  if (!Array.isArray(tensions) || !tensions.length) return null;

  const first = tensions[0];
  const text = typeof first === 'string'
    ? first
    : firstNonEmpty(first?.text, first?.description, first?.name, first?.label);
  if (!text) return null;

  return {
    key: 'unresolvedWound',
    label: 'Unresolved wound',
    text,
    source: 'history.currentTensions',
    references: tensions.length > 1 ? { othersCount: tensions.length - 1 } : null,
  };
}

/**
 * The humanized name of a tension, read the way the generator actually writes
 * one. THIS IS THE MIRRORED RULE — `deriveLikelyFuture` in simulationSpine.js
 * reads a tension by the same three-step ladder, and the lockstep pin in
 * tests/domain/historyBeats.test.js reds if the two ever disagree about which
 * tension a settlement is bound to.
 *
 * The ladder exists because a tension arrives in three shapes and only one of
 * them is common. Generated tensions carry `.type` (a snake_case token) and
 * `.description` (a whole sentence) and NOTHING ELSE — the keys are
 * type/description/severity/factions/plotHooks. `.label` and `.name` are
 * authored-import shapes, kept for tolerance.
 *
 * The `.description` is deliberately NOT a rung here: it is a full sentence,
 * and "Tensions point toward The population changed faster than the settlement
 * could absorb.." is the splice defect the spine was rebuilt to retire.
 *
 * @param {CurrentTension|undefined} tension
 * @returns {string|null}
 */
function tensionName(tension) {
  if (typeof tension === 'string') return firstNonEmpty(tension);
  const labelled = firstNonEmpty(tension?.label, tension?.name);
  if (labelled) return labelled;
  const type = firstNonEmpty(tension?.type);
  return type ? type.replace(/_/g, ' ') : null;
}

/** @param {HistoryBeatSource} settlement */
function deriveLikelyFuture(settlement) {
  // Pull from history.currentTensions trajectory if available, else
  // power-structure stability. Mirrors the simulationSpine logic so the
  // two derivations stay consistent — but produces a structured beat.
  //
  // THE MIRROR HAD DIVERGED. This read was `firstNonEmpty(first?.label,
  // first?.name)`, and a generated tension carries neither: it carries `.type`
  // and `.description`. So the tension arm was DEAD — measured over six real
  // settlements that between them carried eleven tensions, it fired zero
  // times, and all six printed the same fallback line ("Continuity, with the
  // usual slow erosion of any settlement.") while the spine beside them named
  // the actual tension. The docstring above claimed a mirror the code had
  // stopped being; `tensionName` is now the shared rule, spelled once here and
  // pinned in lockstep against the spine's.
  const tensions = settlement?.history?.currentTensions;
  if (Array.isArray(tensions) && tensions.length) {
    const text = tensionName(tensions[0]);
    if (text) {
      return {
        key: 'likelyFuture',
        label: 'Likely future',
        text: `Tensions point toward ${text.toLowerCase()}.`,
        source: 'history.currentTensions',
      };
    }
  }

  const stability = settlement?.powerStructure?.stability;
  if (typeof stability === 'string' && stability) {
    const lower = stability.toLowerCase();
    if (lower.includes('critical') || lower.includes('desperate') || lower.includes('siege')) {
      return {
        key: 'likelyFuture',
        label: 'Likely future',
        text: 'A crisis is imminent if no one intervenes.',
        source: 'powerStructure.stability',
      };
    }
    if (lower.includes('unstable') || lower.includes('volatile')) {
      return {
        key: 'likelyFuture',
        label: 'Likely future',
        text: 'The next year will test whoever holds the chair.',
        source: 'powerStructure.stability',
      };
    }
    if (lower.includes('stable')) {
      return {
        key: 'likelyFuture',
        label: 'Likely future',
        text: 'Continuity, with the usual slow erosion of any settlement.',
        source: 'powerStructure.stability',
      };
    }
  }

  return null;
}

// ── Composer ────────────────────────────────────────────────────────────

/**
 * One structured causal beat. Every sub-deriver emits this uniform shape
 * (see the builders above); `references` is an optional provenance bag.
 * @typedef {{ key: string, label: string, text: string, source: string, references?: (Record<string, unknown>|null) }} HistoryBeat
 */

/**
 * Build the seven structured causal beats. Returns an object keyed by
 * beat name, with null for any beat that has no source data.
 *
 * @param {unknown} settlement
 * @returns {Record<string, HistoryBeat|null>}
 */
export function deriveHistoryBeats(settlement) {
  if (!settlement || typeof settlement !== 'object') {
    return {
      foundingCause:          null,
      firstProsperitySource:  null,
      definingCrisis:         null,
      institutionalLegacy:    null,
      recentDisruption:       null,
      unresolvedWound:        null,
      likelyFuture:           null,
    };
  }

  return {
    foundingCause:         deriveFoundingCause(settlement),
    firstProsperitySource: deriveFirstProsperitySource(settlement),
    definingCrisis:        deriveDefiningCrisis(settlement),
    institutionalLegacy:   deriveInstitutionalLegacy(settlement),
    recentDisruption:      deriveRecentDisruption(settlement),
    unresolvedWound:       deriveUnresolvedWound(settlement),
    likelyFuture:          deriveLikelyFuture(settlement),
  };
}

/**
 * Render the beats as an ordered array of [label, text, key] tuples,
 * ready for the rail or PDF. Skips null beats so the consumer never
 * sees a hole.
 * @param {unknown} settlement
 * @returns {string[][]}
 */
export function historyBeatRows(settlement) {
  const beats = deriveHistoryBeats(settlement);
  const order = [
    'foundingCause',
    'firstProsperitySource',
    'definingCrisis',
    'institutionalLegacy',
    'recentDisruption',
    'unresolvedWound',
    'likelyFuture',
  ];
  /** @type {string[][]} */
  const rows = [];
  for (const k of order) {
    const b = beats[k];
    if (b) rows.push([b.label, b.text, b.key]);
  }
  return rows;
}

/**
 * Diagnostic: which beats produced non-null output? Used by
 * distribution tests and future tuning to spot under-supplied
 * history fields.
 * @param {unknown} settlement
 * @returns {Record<string, boolean>}
 */
export function historyBeatPresence(settlement) {
  const beats = deriveHistoryBeats(settlement);
  /** @type {Record<string, boolean>} */
  const out = {};
  for (const [k, v] of Object.entries(beats)) out[k] = v != null;
  return out;
}
