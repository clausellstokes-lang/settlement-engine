/**
 * domain/worldPulse/realmEvents.js — realm-scope arc synthesis.
 *
 * Most pulse outcomes are settlement- or relationship-scoped. This recognizes
 * when the SAME stressor grips several settlements at once and promotes it to a
 * named, realm-scope Wizard News arc ("The Great Hunger", "The War") — the
 * payoff a DM wants from a *regional* engine. Deterministic + explainable; it
 * reads the post-tick world state and emits Wizard-News-shaped entries.
 */

import { settlementCaptureState } from './factionCapture.js';

const REALM_STRESSOR_THRESHOLD = 3;

// ── Compound signatures ───────────────────────────────────────────────────
// Named CROSS-TYPE combos: when one settlement is gripped by all the listed
// stressor types at once, the combination is a story of its own, not two
// independent headlines. Longest match wins per settlement — a town under
// God's Abandonment is not ALSO separately under The Wasting.
// `requiresCapture` additionally gates on the settlement's criminal capture
// ladder (corrupted or worse): the guild has to actually hold something
// before the combination reads as a shadow government.

const COMPOUND_SIGNATURES = Object.freeze([
  {
    key: 'gods_abandonment',
    label: "God's Abandonment",
    types: ['famine', 'disease_outbreak', 'religious_conversion_fracture'],
    summary: 'Hunger, plague, and a fracturing faith feed one another — flagellants in the streets, scapegoats named from pulpits, and prophets nobody ordained.',
    hooks: [
      'A flagellant movement marches between the afflicted settlements.',
      'A minority faction is being blamed from the pulpits.',
      'A false prophet is gathering the desperate.',
    ],
  },
  {
    key: 'the_wasting',
    label: 'The Wasting',
    types: ['famine', 'disease_outbreak'],
    summary: 'The hungry sicken faster and the sick cannot work the fields — each crisis lengthens the other.',
    hooks: [
      'Healers are rationing care by who can still work.',
      'Grain wagons need armed escorts past the quarantine lines.',
    ],
  },
  {
    key: 'starving_city',
    label: 'The Starving City',
    types: ['siege', 'famine'],
    summary: 'The blockade holds and the granaries empty — surrender pressure mounts with every meal that does not come.',
    hooks: [
      'A surrender faction is counting the remaining stores aloud.',
      'Smugglers name their price for a way through the lines.',
    ],
  },
  {
    key: 'calling_of_debts',
    label: 'The Calling of Debts',
    types: ['market_shock', 'indebtedness'],
    summary: 'The crash makes every debt unpayable, and the creditors are calling them anyway.',
    hooks: [
      'Creditors are seizing pledged property ahead of rivals.',
      'A debtors’ league is forming with nothing left to lose.',
    ],
  },
  {
    key: 'shadow_court',
    label: 'The Shadow Court',
    types: ['criminal_corridor', 'infiltration'],
    requiresCapture: true,
    summary: 'The corridor moves the goods, the agents hold the offices, and the captured factions sign whatever is put in front of them.',
    hooks: [
      'Petitions to the council are answered faster through the guild.',
      'An honest clerk has a ledger that maps the whole arrangement.',
    ],
  },
]);

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
 * Detect named cross-type stressor combinations per settlement.
 * Pure + deterministic; reads worldState.stressors (+ factionStates for the
 * capture-gated signatures). Returns Wizard-News-shaped entries.
 *
 * @param {Object} [args]
 * @param {any} [args.worldState]
 * @param {number} [args.tick]
 * @param {(string|null)} [args.now]
 */
export function synthesizeCompoundSignatures({ worldState, tick = 0, now = null } = {}) {
  const stressors = worldState?.stressors || [];
  const typesBySettlement = new Map();
  const severityByKey = new Map();
  for (const s of stressors) {
    if (!ACTIVE_STAGES.has(s.lifecycleStage || 'active')) continue;
    for (const id of s.affectedSettlementIds || []) {
      const sid = String(id);
      const set = typesBySettlement.get(sid) || new Set();
      set.add(s.type);
      typesBySettlement.set(sid, set);
      const key = `${sid}:${s.type}`;
      severityByKey.set(key, Math.max(severityByKey.get(key) || 0, s.severity || 0));
    }
  }

  // Longest signature first; once a settlement matches, its member types are
  // consumed so subset signatures don't double-report the same crisis.
  const ordered = [...COMPOUND_SIGNATURES].sort((a, b) => b.types.length - a.types.length);
  const matchedBySignature = new Map();
  const consumed = new Map(); // settlementId -> Set of consumed types
  for (const signature of ordered) {
    for (const [sid, typeSet] of typesBySettlement) {
      const used = consumed.get(sid) || new Set();
      const allPresent = signature.types.every(t => typeSet.has(t) && !used.has(t));
      if (!allPresent) continue;
      if (signature.requiresCapture) {
        const capture = settlementCaptureState(worldState?.factionStates, sid);
        if (!['corrupted', 'capture'].includes(capture)) continue;
      }
      const list = matchedBySignature.get(signature.key) || [];
      list.push(sid);
      matchedBySignature.set(signature.key, list);
      const nextUsed = consumed.get(sid) || new Set();
      for (const t of signature.types) nextUsed.add(t);
      consumed.set(sid, nextUsed);
    }
  }

  const entries = [];
  for (const signature of ordered) {
    const settlementIds = matchedBySignature.get(signature.key);
    if (!settlementIds?.length) continue;
    const ids = [...settlementIds].sort();
    const severity = Math.min(1, ids.reduce((max, sid) => {
      const memberAvg = signature.types
        .reduce((sum, t) => sum + (severityByKey.get(`${sid}:${t}`) || 0), 0) / signature.types.length;
      return Math.max(max, memberAvg);
    }, 0) + 0.1); // the combination is worse than its average member
    entries.push({
      id: `wizard_news.${tick}.compound.${signature.key}`,
      tick,
      scope: ids.length >= REALM_STRESSOR_THRESHOLD ? 'realm' : 'regional',
      significance: 'major',
      score: 78 + ids.length * 2,
      headline: `${signature.label}: ${signature.types.map(t => t.replace(/_/g, ' ')).join(' + ')}`,
      summary: signature.summary,
      kind: 'compound',
      impactKind: `compound_${signature.key}`,
      channelType: null,
      severity,
      settlementIds: ids,
      impactIds: [],
      channelIds: [],
      reasons: [
        `All of ${signature.types.join(', ')} grip the same settlement${ids.length > 1 ? 's' : ''}.`,
        ...signature.hooks,
      ],
      tags: ['world_pulse', 'compound', signature.key, ...signature.types],
      createdAt: now,
    });
  }
  return entries;
}

/**
 * @param {Object} [args]
 * @param {any} [args.worldState]  post-tick world state (reads `stressors`)
 * @param {number} [args.tick]
 * @param {(string|null)} [args.now]
 * @returns {Array<Object>} Wizard-News-shaped realm entries (may be empty)
 */
export function synthesizeRealmEvents({ worldState, tick = 0, now = null } = {}) {
  const compoundEntries = synthesizeCompoundSignatures({ worldState, tick, now });
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
  return [...compoundEntries, ...entries];
}
