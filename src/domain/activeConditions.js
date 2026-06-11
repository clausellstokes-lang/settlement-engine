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
  famine: {
    label: 'Famine pressure',
    description: 'Food scarcity has become a public crisis rather than a private hardship.',
    affectedSystems: ['food_security', 'labor_capacity', 'public_legitimacy', 'criminal_opportunity'],
    defaultExpiresAtTicks: 10,
    defaultStatus: 'worsening',
    defaultSeverity: 0.65,
  },
  war_pressure: {
    label: 'Wartime pressure',
    description: 'Conflict is reshaping defenses, trade, and public expectations.',
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'public_legitimacy', 'labor_capacity'],
    defaultExpiresAtTicks: 9,
    defaultStatus: 'worsening',
    defaultSeverity: 0.6,
  },
  alliance_burden: {
    label: 'Alliance burden',
    description: 'Aid to an ally is straining local capacity.',
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'public_legitimacy'],
    defaultExpiresAtTicks: 5,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
  },
  vassal_extraction: {
    label: 'Vassal extraction',
    description: 'A superior settlement is drawing wealth, troops, or legal authority from this settlement.',
    affectedSystems: ['trade_connectivity', 'public_legitimacy', 'faction_power', 'defense_readiness'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'stable',
    defaultSeverity: 0.55,
  },
  rebellion: {
    label: 'Rebellion',
    description: 'Local resistance is organizing against an overlord or coercive patron.',
    affectedSystems: ['public_legitimacy', 'faction_power', 'defense_readiness', 'social_trust'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'worsening',
    defaultSeverity: 0.65,
  },
  faction_challenge: {
    label: 'Faction challenge',
    description: 'A major faction is maneuvering to alter the settlement power balance.',
    affectedSystems: ['public_legitimacy', 'faction_power', 'social_trust'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'worsening',
    defaultSeverity: 0.55,
  },
  government_overthrown: {
    label: 'Government overthrown',
    description: 'The ruling power has just changed hands; authority is being rebuilt under new masters.',
    affectedSystems: ['ruling_authority', 'public_legitimacy', 'social_trust'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'easing',
    defaultSeverity: 0.55,
  },
  coup_suppressed: {
    label: 'Coup suppressed',
    description: 'An attempted seizure of power failed; purges, loyalty tests, and settling of scores follow.',
    affectedSystems: ['social_trust', 'faction_power', 'public_legitimacy'],
    defaultExpiresAtTicks: 5,
    defaultStatus: 'easing',
    defaultSeverity: 0.45,
  },
  stressor_residual: {
    label: 'Stressor aftereffects',
    description: 'A resolved crisis still leaves social, economic, or institutional scars.',
    affectedSystems: ['labor_capacity', 'public_legitimacy', 'social_trust'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'easing',
    defaultSeverity: 0.3,
  },
  // The ONSET counterpart of stressor_residual: an authored crisis (custom or
  // otherwise unmapped stressor type from the APPLY_STRESSOR event) that has
  // no richer archetype to promote into. Callers override label / description
  // / affectedSystems from the stressor itself.
  custom_crisis: {
    label: 'Crisis',
    description: 'An authored crisis grips the settlement.',
    affectedSystems: ['public_legitimacy', 'social_trust'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'worsening',
    defaultSeverity: 0.5,
  },
  // Note (merchant_wealth retirement): 'merchant_wealth' was tagged across these
  // templates but was never a SYSTEM_VARIABLE and no deriver read it — the tag
  // implied an economic consequence that never landed. Economic bite now routes
  // through trade_connectivity (a real variable); tolerant matchers elsewhere still
  // accept legacy saved conditions that carry the old tag.
  trade_route_cut: {
    label: 'Trade route severed',
    description: 'A primary trade route is no longer passable.',
    affectedSystems: ['trade_connectivity', 'public_legitimacy'],
    defaultExpiresAtTicks: 9,
    defaultStatus: 'stable',
    defaultSeverity: 0.5,
  },
  regional_import_shortage: {
    label: 'Regional import shortage',
    description: 'A regional supplier can no longer meet an important import need.',
    affectedSystems: ['trade_connectivity', 'food_security', 'public_legitimacy', 'labor_capacity'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'worsening',
    defaultSeverity: 0.55,
  },
  regional_export_market_loss: {
    label: 'Export market weakened',
    description: 'A connected market is no longer buying at normal volume.',
    affectedSystems: ['trade_connectivity', 'faction_power', 'public_legitimacy'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
  },
  regional_route_disruption: {
    label: 'Regional route disruption',
    description: 'A connected trade route is transmitting regional disruption.',
    affectedSystems: ['trade_connectivity', 'public_legitimacy'],
    defaultExpiresAtTicks: 7,
    defaultStatus: 'stable',
    defaultSeverity: 0.5,
  },
  regional_authority_instability: {
    label: 'Regional authority instability',
    description: 'A governing or patron settlement is transmitting political instability.',
    affectedSystems: ['public_legitimacy', 'faction_power', 'social_trust'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'worsening',
    defaultSeverity: 0.55,
  },
  regional_tax_revenue_disruption: {
    label: 'Regional revenue disruption',
    description: 'A tributary or client settlement can no longer reliably meet obligations.',
    affectedSystems: ['trade_connectivity', 'faction_power', 'public_legitimacy'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
  },
  regional_protection_gap: {
    label: 'Regional protection gap',
    description: 'A protector or ally is less able to project military support.',
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'public_legitimacy'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'worsening',
    defaultSeverity: 0.55,
  },
  regional_service_disruption: {
    label: 'Regional service disruption',
    description: 'A settlement that provides regional services is under strain.',
    affectedSystems: ['healing_capacity', 'trade_connectivity', 'public_legitimacy'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
  },
  cold_war_sanctions: {
    label: 'Cold-war sanctions',
    description: 'Inspections, sanctions, or informal embargoes are tightening daily trade.',
    affectedSystems: ['trade_connectivity', 'public_legitimacy', 'criminal_opportunity'],
    // Was the lone template-less (and therefore IMMORTAL) condition: with no
    // defaultExpiresAtTicks it pressured trade/legitimacy/crime forever, even after
    // the cold war thawed. Eight ticks matches its regional siblings.
    defaultExpiresAtTicks: 8,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
  },
  regional_conflict_pressure: {
    label: 'Regional conflict pressure',
    description: 'Conflict pressure is spilling across a confirmed regional channel.',
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'public_legitimacy'],
    defaultExpiresAtTicks: 7,
    defaultStatus: 'worsening',
    defaultSeverity: 0.55,
  },
  regional_migration_pressure: {
    label: 'Regional migration pressure',
    description: 'A nearby shock is pushing people across the regional network.',
    affectedSystems: ['food_security', 'labor_capacity', 'public_legitimacy'],
    defaultExpiresAtTicks: 8,
    defaultStatus: 'worsening',
    defaultSeverity: 0.5,
  },
  regional_information_shock: {
    label: 'Regional information shock',
    description: 'News, rumor, or panic from a connected settlement is shaping local politics.',
    affectedSystems: ['public_legitimacy', 'social_trust', 'faction_power'],
    defaultExpiresAtTicks: 5,
    defaultStatus: 'stable',
    defaultSeverity: 0.4,
  },
  regional_criminal_pressure: {
    label: 'Regional criminal pressure',
    description: 'A criminal corridor is transmitting opportunism or instability.',
    affectedSystems: ['criminal_opportunity', 'social_trust', 'trade_connectivity'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'worsening',
    defaultSeverity: 0.45,
  },
  regional_religious_pressure: {
    label: 'Regional religious pressure',
    description: 'Religious authority or crisis is echoing through connected institutions.',
    affectedSystems: ['public_legitimacy', 'social_trust', 'healing_capacity'],
    defaultExpiresAtTicks: 6,
    defaultStatus: 'stable',
    defaultSeverity: 0.45,
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
    affectedSystems: ['defense_readiness', 'food_security', 'public_legitimacy', 'trade_connectivity'],
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
 * Also applies the W5#5 severity dynamics: the status written on the
 * condition nudges severity per tick (worsening climbs toward 1, easing
 * falls toward the 0.05 floor, anything else holds flat), and a condition
 * inside the pre-expiry window ramps toward easing instead of
 * flat-then-cliff. The severityBand is recomputed to match the nudged
 * severity.
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

// Severity dynamics (W5#5): the status written on the condition drives a
// small, bounded, deterministic per-tick severity drift — a written
// 'worsening' climbs, a written 'easing' falls, anything else ('stable',
// legacy 'active', or no status at all) holds flat. The drift reads the
// raw status on purpose: canonical defaulting must not invent motion for
// a condition that never claimed a direction. Worsening clamps at 1;
// easing floors at 0.05. Every consumer re-reads conditions on
// derivation, so the drift flows to the causal scan, capacities, and AI
// grounding without further wiring.
// Exported so pins derive expectations from the live values — these are
// TUNING numbers (owner-adjustable); tests must follow them, not freeze them.
export const SEVERITY_DRIFT_PER_TICK = Object.freeze({
  worsening: +0.04,
  easing:    -0.06,
});
const WORSENING_SEVERITY_CEILING = 1;
const EASING_SEVERITY_FLOOR = 0.05;

// Within this many ticks of expiresAtTicks a condition winds down — its
// status is forced to 'easing' for the nudge, so severity ramps down —
// instead of holding severity flat until the removal cliff. Expiry itself
// is untouched: duration-based removal in withExpiredConditionsRemoved
// drops it exactly as before, and the ramp never extends (or resurrects)
// a condition's life.
const EXPIRY_EASING_WINDOW_TICKS = 2;

export function withTickedConditionDurations(settlement, interval) {
  if (!settlement) return settlement;
  const existing = Array.isArray(settlement.activeConditions) ? settlement.activeConditions : [];
  if (existing.length === 0) return settlement;

  const increment = INTERVAL_TICK_INCREMENTS[interval] ?? INTERVAL_TICK_INCREMENTS.one_month;

  const next = existing.map(c => {
    const canonical = deriveActiveCondition(c);
    if (!canonical) return c;
    const elapsedTicks = canonical.duration.elapsedTicks + increment;

    const cap = canonical.duration.expiresAtTicks;
    const windingDown = typeof cap === 'number'
      && (cap - elapsedTicks) <= EXPIRY_EASING_WINDOW_TICKS;
    const driftStatus = windingDown ? 'easing' : c.status;
    const driftPerTick = SEVERITY_DRIFT_PER_TICK[driftStatus] ?? 0;
    let severity = canonical.severity;
    if (driftPerTick > 0) {
      severity = Math.min(WORSENING_SEVERITY_CEILING, severity + driftPerTick * increment);
    } else if (driftPerTick < 0) {
      severity = Math.max(EASING_SEVERITY_FLOOR, severity + driftPerTick * increment);
    }

    return {
      ...canonical,
      severity,
      severityBand: severityBand(severity),
      status: windingDown ? 'easing' : canonical.status,
      duration: {
        ...canonical.duration,
        elapsedTicks,
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
