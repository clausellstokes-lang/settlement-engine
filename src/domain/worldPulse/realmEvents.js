/**
 * domain/worldPulse/realmEvents.js — realm-scope arc synthesis.
 *
 * Most pulse outcomes are settlement- or relationship-scoped. This recognizes
 * when the SAME stressor grips several settlements at once and promotes it to a
 * named, realm-scope Wizard News arc ("The Great Hunger", "The War") — the
 * payoff a DM wants from a *regional* engine. Deterministic + explainable; it
 * reads the post-tick world state and emits Wizard-News-shaped entries.
 */

const REALM_STRESSOR_THRESHOLD = 3;

const REALM_LABELS = Object.freeze({
  famine: 'The Great Hunger',
  siege: 'The War',
  wartime: 'The War',
  occupation: 'The Occupation',
  insurgency: 'The Uprising',
  slave_revolt: 'The Uprising',
  disease_outbreak: 'The Plague',
  mass_migration: 'The Great Migration',
  political_fracture: 'The Succession Crisis',
  succession_void: 'The Succession Crisis',
  market_shock: 'The Great Depression',
  indebtedness: 'The Debt Crisis',
  monster_raider_pressure: 'The Raids',
  criminal_corridor: 'The Crime Wave',
  religious_conversion_fracture: 'The Schism',
  magical_instability: 'The Arcane Turmoil',
});

const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

/**
 * @param {Object} [args]
 * @param {any} [args.worldState]  post-tick world state (reads `stressors`)
 * @param {number} [args.tick]
 * @param {(string|null)} [args.now]
 * @returns {Array<Object>} Wizard-News-shaped realm entries (may be empty)
 */
export function synthesizeRealmEvents({ worldState, tick = 0, now = null } = {}) {
  const stressors = worldState?.stressors || [];
  const byType = new Map();
  for (const s of stressors) {
    if (!ACTIVE_STAGES.has(s.lifecycleStage || 'active')) continue;
    const set = byType.get(s.type) || new Set();
    for (const id of s.affectedSettlementIds || []) set.add(String(id));
    byType.set(s.type, set);
  }

  const entries = [];
  for (const [type, settlements] of byType) {
    if (settlements.size < REALM_STRESSOR_THRESHOLD) continue;
    const human = String(type).replace(/_/g, ' ');
    const label = REALM_LABELS[type] || `Realm-wide ${human}`;
    const ids = [...settlements].sort();
    entries.push({
      id: `wizard_news.${tick}.realm.${type}`,
      tick,
      scope: 'realm',
      significance: 'major',
      score: 80 + settlements.size,
      headline: `${label} grips the realm`,
      summary: `${settlements.size} settlements are now caught in ${human}.`,
      kind: 'realm',
      impactKind: `realm_${type}`,
      channelType: null,
      severity: Math.min(1, 0.6 + settlements.size * 0.08),
      settlementIds: ids,
      impactIds: [],
      channelIds: [],
      reasons: [
        `${settlements.size} settlements share an active ${human} stressor.`,
        'Promoted from settlement scope to a realm-wide arc.',
      ],
      tags: ['world_pulse', 'realm', type],
      createdAt: now,
    });
  }
  return entries;
}
