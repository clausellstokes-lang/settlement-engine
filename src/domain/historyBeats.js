/**
 * domain/historyBeats.js — Structured causal beats over settlement history.
 *
 * Today's history fields are descriptive prose:
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

// ── Helpers ─────────────────────────────────────────────────────────────

/** @param {...any} candidates */
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
 * @param {any} s
 */
function severityScore(s) {
  return /** @type {Record<string, number>} */ (SEVERITY_RANK)[(s || '').toLowerCase()] || 0;
}

/**
 * @param {any[]} arr
 * @param {(x: any) => number} scoreFn
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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
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
    ? `${top.name} (${top.yearsAgo ?? '–'} years ago): ${top.description}`
    : `${top.name} (${top.yearsAgo ?? '–'} years ago).`;

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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
function deriveInstitutionalLegacy(settlement) {
  // Events whose lastingEffects mention 'institution' or that have an
  // institutional effect listed in some form. These are the events that
  // built the present-day structural character.
  const events = settlement?.history?.historicalEvents || [];
  const carriers = events.filter(/** @param {any} e */ e => {
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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
function deriveRecentDisruption(settlement) {
  // Most recent significant disruption — within the last 30 years AND
  // severity ≥ major. Falls back to legacyAnnotations[0] if no recent
  // major events. Falls back to null if neither is present.
  const events = settlement?.history?.historicalEvents || [];
  // Number.isFinite, not truthiness: campaign-era events carry yearsAgo 0
  // (they ARE the recent disruption) and `0 || Infinity` silently excluded
  // every one of them.
  const recent = events
    .filter(/** @param {any} e */ e => severityScore(e.severity) >= SEVERITY_RANK.major)
    .filter(/** @param {any} e */ e => (Number.isFinite(e.yearsAgo) ? e.yearsAgo : Infinity) <= 30)
    .sort(/** @param {any} a @param {any} b */ (a, b) => (Number.isFinite(a.yearsAgo) ? a.yearsAgo : 0) - (Number.isFinite(b.yearsAgo) ? b.yearsAgo : 0));

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
  const anns = settlement?.history?.legacyAnnotations || [];
  const recentAnn = anns
    .filter(/** @param {any} a */ a => (Number.isFinite(a.yearsAgo) ? a.yearsAgo : Infinity) <= 50)
    .sort(/** @param {any} a @param {any} b */ (a, b) => (Number.isFinite(a.yearsAgo) ? a.yearsAgo : Infinity) - (Number.isFinite(b.yearsAgo) ? b.yearsAgo : Infinity))[0];
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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
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

/** @param {import('./settlement.schema.js').SimSettlement} settlement */
function deriveLikelyFuture(settlement) {
  // Pull from history.currentTensions trajectory if available, else
  // power-structure stability. Mirrors the simulationSpine logic so the
  // two derivations stay consistent — but produces a structured beat.
  const tensions = settlement?.history?.currentTensions;
  if (Array.isArray(tensions) && tensions.length) {
    const first = tensions[0];
    const text = typeof first === 'string' ? first : firstNonEmpty(first?.label, first?.name);
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
 * Build the seven structured causal beats. Returns an object keyed by
 * beat name, with null for any beat that has no source data.
 *
 * @param {Object} settlement
 * @returns {Object}
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
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function historyBeatRows(settlement) {
  const beats = /** @type {Record<string, any>} */ (deriveHistoryBeats(settlement));
  const order = [
    'foundingCause',
    'firstProsperitySource',
    'definingCrisis',
    'institutionalLegacy',
    'recentDisruption',
    'unresolvedWound',
    'likelyFuture',
  ];
  return order
    .map(k => beats[k])
    .filter(Boolean)
    .map(b => [b.label, b.text, b.key]);
}

/**
 * Diagnostic: which beats produced non-null output? Used by
 * distribution tests and future tuning to spot under-supplied
 * history fields.
 * @param {import('./settlement.schema.js').SimSettlement} settlement
 */
export function historyBeatPresence(settlement) {
  const beats = deriveHistoryBeats(settlement);
  /** @type {Record<string, boolean>} */
  const out = {};
  for (const [k, v] of Object.entries(beats)) out[k] = v != null;
  return out;
}
