/**
 * domain/activeConditions.js — First-class persistent world conditions.
 *
 * Tier 2.3 of the roadmap. Plague, refugee waves, cut routes, sieges,
 * corruption scandals — these are not one-shot events. They linger,
 * accumulate effects, and eventually resolve or escalate. Today the
 * generator stamps them onto stressors and the time-progression layer
 * (Phase 15) takes them as an external array. This module promotes
 * them to canonical state on the settlement.
 *
 *   settlement.activeConditions = [
 *     {
 *       id,                    'condition.<archetype>.<short>'
 *       archetype,             matches factionRelationshipUpdate vocab
 *       label,                 display
 *       description,           single-line prose
 *       severity,              0..1 numeric (computation surface)
 *       severityBand,          'low' | 'medium' | 'high' | 'critical'
 *       status,                'worsening' | 'stable' | 'easing'
 *       triggeredAt: { tick, sourceEventType, sourceEventTargetId },
 *       duration:    { elapsedTicks, expiresAtTicks },
 *       affectedSystems: string[],
 *       causes:          Object[],
 *     }
 *   ]
 *
 * Pure read-only derivations + a small family of with* helpers that
 * return new settlements. No mutation. No imports from src/lib.
 *
 * Compounding fit:
 *   - advanceTime (Phase 15) reads archetypesFromSettlement() when the
 *     caller doesn't pass an external override; ages elapsed; drops
 *     expired conditions on its own. The simulator owns its conditions.
 *   - factionRelationshipUpdate (Phase 14) keyed by the same archetype
 *     vocabulary, so condition archetypes map 1:1 to delta templates.
 *   - hookEscalation (Phase 11) clocks already key off settlement state;
 *     a 'plague' condition can become the trigger for a healing-crisis
 *     clock once Tier 4.4 capacity modeling lands.
 *   - The AI overlay (Tier 6) reads conditions as grounded facts and
 *     narrates "the plague has lasted four months" from real state.
 */

// ── Archetype catalog ────────────────────────────────────────────────────
// Each entry maps a condition archetype to its presentation defaults plus
// the canonical subsystem labels the condition feeds into. The archetype
// keys match factionRelationshipUpdate.js so a condition's archetype is
// directly applicable to recalculateFactionRelationships.

const CONDITION_ARCHETYPE_TEMPLATES = Object.freeze({
  plague: {
    label: 'Plague',
    description: 'A virulent illness spreads through the settlement.',
    affectedSystems: ['food_security', 'healing_capacity', 'public_legitimacy', 'labor_capacity'],
    defaultExpiresAtTicks: 12,
    defaultStatus: 'worsening',
    defaultSeverity: 0.6,
  },
  trade_route_cut: {
    label: 'Trade route severed',
    description: 'A primary trade route is no longer passable.',
    affectedSystems: ['trade_connectivity', 'merchant_wealth', 'public_legitimacy'],
    defaultExpiresAtTicks: 9,
    defaultStatus: 'stable',
    defaultSeverity: 0.5,
  },
  corruption_exposed: {
    label: 'Corruption scandal',
    description: 'Public exposure of corruption at an institutional level.',
    affectedSystems: ['public_legitimacy', 'social_trust', 'criminal_opportunity'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'easing',
    defaultSeverity: 0.5,
  },
  food_anchor_lost: {
    label: 'Food anchor lost',
    description: 'A primary food institution (granary, mill, fishery) is gone.',
    affectedSystems: ['food_security', 'public_legitimacy', 'criminal_opportunity'],
    defaultExpiresAtTicks: 10,
    defaultStatus: 'worsening',
    defaultSeverity: 0.7,
  },
  dominant_npc_removed: {
    label: 'Leadership void',
    description: 'A dominant leader is gone; succession is unresolved.',
    affectedSystems: ['faction_power', 'public_legitimacy', 'social_trust'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
  },
  siege_lifted: {
    label: 'Siege lifted',
    description: 'A siege has ended; the settlement is recovering.',
    affectedSystems: ['defense_readiness', 'food_security', 'public_legitimacy', 'merchant_wealth'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'easing',
    defaultSeverity: 0.3,
  },
});

const VALID_STATUSES = new Set(['worsening', 'stable', 'easing']);
const SEVERITY_BANDS = ['low', 'medium', 'high', 'critical'];

// ── Severity / band helpers ──────────────────────────────────────────────

/**
 * Map a 0..1 severity score to a band. Anything <0 returns 'low',
 * >1 returns 'critical'. Boundaries: ≥0.75 critical, ≥0.5 high, ≥0.25
 * medium, else low.
 */
export function severityBand(severity) {
  const s = typeof severity === 'number' ? severity : 0;
  if (s >= 0.75) return 'critical';
  if (s >= 0.5)  return 'high';
  if (s >= 0.25) return 'medium';
  return 'low';
}

/** Returns the default severity for a band — symmetric to severityBand. */
export function defaultSeverityForBand(band) {
  switch (band) {
    case 'critical': return 0.85;
    case 'high':     return 0.6;
    case 'medium':   return 0.35;
    default:         return 0.15;
  }
}

// ── ID helpers ───────────────────────────────────────────────────────────
// Stable id format: 'condition.<archetype>.<short-suffix>'. Suffix is
// derived from the trigger event id when available (so re-deriving a
// condition twice produces the same id) — falls back to a hash of the
// archetype + label on first construction.

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function shortHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}

export function conditionIdFromArchetype(archetype, opts = {}) {
  const arche = snakeCase(archetype || 'unknown');
  if (opts.sourceEventId) {
    return `condition.${arche}.${shortHash(String(opts.sourceEventId))}`;
  }
  if (opts.suffix) {
    return `condition.${arche}.${snakeCase(opts.suffix)}`;
  }
  return `condition.${arche}.${shortHash(`${arche}.${opts.label || ''}.${opts.tick ?? 0}`)}`;
}

// ── Pure derivation ──────────────────────────────────────────────────────
// `deriveActiveCondition` enriches a partial condition with defaults from
// the catalog, computes the band, normalizes the trigger/duration sub-
// shapes, and inserts a stable id. Idempotent.

/**
 * @param {Object} condition  Partial or already-canonical condition.
 * @returns {Object | null}    Canonical-shape condition, or null on bad input.
 */
export function deriveActiveCondition(condition) {
  if (!condition || typeof condition !== 'object') return null;

  const archetype = typeof condition.archetype === 'string'
    ? condition.archetype
    : 'unknown';

  const tmpl = CONDITION_ARCHETYPE_TEMPLATES[archetype] || null;

  const severity = typeof condition.severity === 'number'
    ? Math.max(0, Math.min(1, condition.severity))
    : (tmpl ? tmpl.defaultSeverity : 0.25);

  const triggeredAt = {
    tick: condition.triggeredAt?.tick ?? 0,
    sourceEventType: condition.triggeredAt?.sourceEventType ?? null,
    sourceEventTargetId: condition.triggeredAt?.sourceEventTargetId ?? null,
  };

  const duration = {
    elapsedTicks: typeof condition.duration?.elapsedTicks === 'number'
      ? condition.duration.elapsedTicks
      : 0,
    expiresAtTicks: condition.duration?.expiresAtTicks === undefined
      ? (tmpl ? tmpl.defaultExpiresAtTicks : null)
      : condition.duration.expiresAtTicks,
  };

  const status = VALID_STATUSES.has(condition.status)
    ? condition.status
    : (tmpl ? tmpl.defaultStatus : 'stable');

  const id = typeof condition.id === 'string' && condition.id.startsWith('condition.')
    ? condition.id
    : conditionIdFromArchetype(archetype, {
        sourceEventId: triggeredAt.sourceEventType
          ? `${triggeredAt.sourceEventType}:${triggeredAt.sourceEventTargetId || ''}`
          : null,
        label: condition.label,
        tick: triggeredAt.tick,
      });

  return {
    id,
    archetype,
    label: condition.label || (tmpl ? tmpl.label : archetype),
    description: condition.description || (tmpl ? tmpl.description : ''),
    severity,
    severityBand: severityBand(severity),
    status,
    triggeredAt,
    duration,
    affectedSystems: Array.isArray(condition.affectedSystems) && condition.affectedSystems.length
      ? [...condition.affectedSystems]
      : (tmpl ? [...tmpl.affectedSystems] : []),
    causes: Array.isArray(condition.causes) ? [...condition.causes] : [],
  };
}

/** Derive every condition on a settlement. Returns []. for missing data. */
export function deriveAllActiveConditions(settlement) {
  if (!settlement) return [];
  const arr = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  return arr.map(deriveActiveCondition).filter(Boolean);
}

/** Flat archetype keys from canonical conditions. Used by Phase 15 advanceTime. */
export function activeArchetypes(settlement) {
  return deriveAllActiveConditions(settlement).map(c => c.archetype);
}

/** Lookup by id OR by archetype. Returns the first match or null. */
export function findActiveCondition(settlement, idOrArchetype) {
  if (!idOrArchetype) return null;
  const all = deriveAllActiveConditions(settlement);
  return all.find(c => c.id === idOrArchetype || c.archetype === idOrArchetype) || null;
}

// ── Pure with* helpers ───────────────────────────────────────────────────
// Return new settlements; never mutate the input. Each helper takes care
// of cloning the path it changes and leaves the rest of the settlement
// shared by reference.

/**
 * Add (or overwrite) an active condition. If a condition with the same
 * id already exists it is replaced. Returns a new settlement.
 */
export function withActiveCondition(settlement, partial) {
  if (!settlement) return settlement;
  const canonical = deriveActiveCondition(partial);
  if (!canonical) return settlement;

  const existing = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  const filtered = existing.filter(c => c?.id !== canonical.id);
  return { ...settlement, activeConditions: [...filtered, canonical] };
}

/** Remove a condition by id. No-op if not found. Returns a new settlement. */
export function withoutActiveCondition(settlement, conditionId) {
  if (!settlement) return settlement;
  const existing = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  const next = existing.filter(c => c?.id !== conditionId);
  if (next.length === existing.length) return settlement;
  return { ...settlement, activeConditions: next };
}

/**
 * Advance every condition's elapsedTicks by the interval-scaled amount.
 * Mirrors the Phase 15 INTERVAL_SCALES so a per-week tick adds 0.25 to
 * elapsed; per-month adds 1.0; per-year adds 6.0.
 *
 * @param {Object} settlement
 * @param {string} interval    'one_week' | 'one_month' | 'one_season' | 'one_year'
 * @returns {Object} new settlement
 */
const INTERVAL_TICK_INCREMENTS = Object.freeze({
  one_week:   0.25,
  one_month:  1.00,
  one_season: 2.25,
  one_year:   6.00,
});

export function withTickedConditionDurations(settlement, interval) {
  if (!settlement) return settlement;
  const existing = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  if (existing.length === 0) return settlement;

  const increment = INTERVAL_TICK_INCREMENTS[interval] ?? INTERVAL_TICK_INCREMENTS.one_month;

  const next = existing.map(c => {
    const canonical = deriveActiveCondition(c);
    if (!canonical) return c;
    return {
      ...canonical,
      duration: {
        ...canonical.duration,
        elapsedTicks: canonical.duration.elapsedTicks + increment,
      },
    };
  });

  return { ...settlement, activeConditions: next };
}

/**
 * Drop any condition whose elapsedTicks has reached its expiresAtTicks.
 * Conditions with `expiresAtTicks: null` persist indefinitely. Returns
 * `{ settlement, expired }`.
 *
 * @returns {{settlement: Object, expired: Array<Object>}}
 */
export function withExpiredConditionsRemoved(settlement) {
  if (!settlement) return { settlement, expired: [] };
  const existing = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];

  const expired = [];
  const keep = [];
  for (const c of existing) {
    const canonical = deriveActiveCondition(c);
    if (!canonical) continue;
    const cap = canonical.duration.expiresAtTicks;
    if (typeof cap === 'number' && canonical.duration.elapsedTicks >= cap) {
      expired.push(canonical);
    } else {
      keep.push(canonical);
    }
  }

  if (expired.length === 0) return { settlement, expired: [] };
  return {
    settlement: { ...settlement, activeConditions: keep },
    expired,
  };
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/**
 * High-level summary suitable for the AI overlay, the PDF, or any UI
 * surface that wants to render "what's going on right now."
 *
 *   {
 *     count,
 *     byArchetype: { plague: 1, trade_route_cut: 1 },
 *     bySeverityBand: { low: 0, medium: 1, high: 1, critical: 0 },
 *     summaryLines: [...],
 *   }
 */
export function summarizeActiveConditions(settlement) {
  const all = deriveAllActiveConditions(settlement);
  const byArchetype = {};
  const bySeverityBand = { low: 0, medium: 0, high: 0, critical: 0 };
  const summaryLines = [];

  for (const c of all) {
    byArchetype[c.archetype] = (byArchetype[c.archetype] || 0) + 1;
    if (bySeverityBand[c.severityBand] !== undefined) bySeverityBand[c.severityBand] += 1;
    summaryLines.push(`${c.label} — ${c.severityBand}, ${c.status} (elapsed ${c.duration.elapsedTicks.toFixed(2)} of ${c.duration.expiresAtTicks ?? '∞'})`);
  }

  return {
    count: all.length,
    byArchetype,
    bySeverityBand,
    summaryLines,
  };
}

/** Catalog keys. Useful for drift detection + Tier 4.16 custom content. */
export function supportedConditionArchetypes() {
  return Object.keys(CONDITION_ARCHETYPE_TEMPLATES);
}

/** Catalog access — exposes the per-archetype defaults for UI/help text. */
export function conditionArchetypeTemplate(archetype) {
  return CONDITION_ARCHETYPE_TEMPLATES[archetype] || null;
}

/** Canonical severity band list. */
export function severityBands() {
  return [...SEVERITY_BANDS];
}
