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
  magic_deadzone: 'The Great Silence',
});

const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

// War-shaped stressor types whose realm membership must count the BELLIGERENTS
// (instigators + supporters + the besieged), not just the besieged victim. A
// 4-attacker-vs-1 coalition siege touches ONE victim — so the old victim-only
// `affectedSettlementIds` count never crossed the realm threshold. The coalition
// (the besiegers) comes from the regional graph's confirmed war_front channels
// INTO each affected victim; the union of besiegers + victims is the war's true
// participant set.
const WAR_SHAPED_TYPES = new Set(['siege', 'wartime', 'occupation']);

/**
 * The confirmed war_front SOURCES (besiegers) pointing INTO any of the given
 * victim ids, from a regional graph. Codepoint-sorted, deduped. Tolerates an
 * absent graph / channels (returns []).
 * @param {any} regionalGraph
 * @param {Set<string>} victimIds
 * @returns {string[]}
 */
function besiegersInto(regionalGraph, victimIds) {
  const channels = Array.isArray(regionalGraph?.channels) ? regionalGraph.channels : [];
  /** @type {Set<string>} */
  const out = new Set();
  for (const channel of channels) {
    if (channel?.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (channel.from == null || channel.to == null) continue;
    if (!victimIds.has(String(channel.to))) continue;
    out.add(String(channel.from));
  }
  return [...out].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

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

// ── Pantheon realm arcs (R4) ────────────────────────────────────────────────
// A deity crossing INTO 'major' is the campaign-epic payoff — "The Ascendancy of
// X". A deity falling TO 'cult' (or losing its last seat — extinction) is "The
// Twilight of X". A minor↔minor drift is not realm news. These are synthesized
// from the per-tick tier CHANGES the pantheon ratchet emits, NOT re-derived from
// the ledger (so an Ascendancy fires ONCE, on the crossing tick, never re-emitted
// every tick the deity holds major). Gated by religion activity at the call site.

/**
 * A human display name for a deity ref, given the pre-tick snapshot to resolve it.
 * @param {any} snapshot
 * @param {any} deityId
 * @returns {string}
 */
function deityNameForRef(snapshot, deityId) {
  const items = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  for (const item of items) {
    const deity = item?.settlement?.config?.primaryDeitySnapshot;
    if (!deity) continue;
    const ref = deity._deityRef || deity.primaryDeityRef || (deity.name ? `deity:${deity.name}` : null);
    if (String(ref) === String(deityId) && deity.name) return String(deity.name);
  }
  // Fall back to a readable tail of the ref (e.g. 'custom:lu_vael' → 'Vael').
  const tail = String(deityId).split(/[:_]/).filter(Boolean).pop() || String(deityId);
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

/**
 * Synthesize "The Ascendancy of X" / "The Twilight of X" realm arcs from this
 * tick's pantheon tier changes. An ascendancy fires when a deity reaches 'major';
 * a twilight when a deity falls TO 'cult'. Codepoint-sorted by deity id (stable).
 *
 * @param {Object} [args]
 * @param {Array<{deityId:string, from:string, to:string}>} [args.changes]
 * @param {any} [args.snapshot]  the pre-tick snapshot, to resolve deity names.
 * @param {number} [args.tick]
 * @param {(string|null)} [args.now]
 * @returns {Array<Object>} Wizard-News-shaped realm entries (may be empty)
 */
export function synthesizePantheonArcs({ changes = [], snapshot = null, tick = 0, now = null } = {}) {
  if (!Array.isArray(changes) || !changes.length) return [];
  const entries = [];
  const ordered = [...changes].sort((a, b) => (String(a.deityId) < String(b.deityId) ? -1 : String(a.deityId) > String(b.deityId) ? 1 : 0));
  for (const change of ordered) {
    const ascendancy = change.to === 'major' && change.from !== 'major';
    const twilight = change.to === 'cult' && change.from !== 'cult';
    if (!ascendancy && !twilight) continue;
    const name = deityNameForRef(snapshot, change.deityId);
    if (ascendancy) {
      entries.push({
        id: `wizard_news.${tick}.pantheon.ascendancy.${stablePantheonPart(change.deityId)}`,
        tick,
        scope: 'realm',
        significance: 'major',
        score: 86,
        headline: `The Ascendancy of ${name}`,
        summary: `${name} has risen to a major power in the realm's pantheon — temples multiply, rivals bend the knee, and the faithful walk the roads in numbers.`,
        kind: 'pantheon',
        impactKind: 'pantheon_ascendancy',
        channelType: null,
        severity: 0.8,
        settlementIds: [],
        impactIds: [],
        channelIds: [],
        reasons: [
          `${name} crossed into the major tier of the pantheon.`,
          'A decisive lead in seats held has been sustained past the hysteresis dwell.',
        ],
        tags: ['world_pulse', 'pantheon', 'ascendancy', String(change.deityId)],
        createdAt: now,
      });
    } else {
      entries.push({
        id: `wizard_news.${tick}.pantheon.twilight.${stablePantheonPart(change.deityId)}`,
        tick,
        scope: 'realm',
        significance: 'major',
        score: 84,
        headline: `The Twilight of ${name}`,
        summary: `${name} has fallen to a cult — abandoned altars, scattered clergy, and a faith remembered more than practised.`,
        kind: 'pantheon',
        impactKind: 'pantheon_twilight',
        channelType: null,
        severity: 0.78,
        settlementIds: [],
        impactIds: [],
        channelIds: [],
        reasons: [
          `${name} fell to the cult tier of the pantheon.`,
          'Its seats held collapsed past the hysteresis dwell.',
        ],
        tags: ['world_pulse', 'pantheon', 'twilight', String(change.deityId)],
        createdAt: now,
      });
    }
  }
  return entries;
}

/**
 * A filesystem-safe, codepoint-stable id part for a deity ref.
 * @param {any} deityId
 * @returns {string}
 */
function stablePantheonPart(deityId) {
  return String(deityId || 'deity')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'deity';
}

/**
 * @param {Object} [args]
 * @param {any} [args.worldState]  post-tick world state (reads `stressors`)
 * @param {number} [args.tick]
 * @param {(string|null)} [args.now]
 * @param {any} [args.regionalGraph]  the live regional graph — its confirmed
 *   war_front channels name the besieging COALITION for war-shaped stressors, so
 *   "The War" counts instigators + supporters, not just the besieged victim
 *   (§S4). Absent ⇒ war-shaped stressors fall back to victim-count (legacy).
 * @returns {Array<Object>} Wizard-News-shaped realm entries (may be empty)
 */
export function synthesizeRealmEvents({ worldState, tick = 0, now = null, regionalGraph = null } = {}) {
  const compoundEntries = synthesizeCompoundSignatures({ worldState, tick, now });
  const stressors = worldState?.stressors || [];
  const byType = new Map();
  for (const s of stressors) {
    if (!ACTIVE_STAGES.has(s.lifecycleStage || 'active')) continue;
    const set = byType.get(s.type) || new Set();
    for (const id of s.affectedSettlementIds || []) set.add(String(id));
    byType.set(s.type, set);
  }
  // §S4 fix — count the COALITION for war-shaped types. The membership the realm
  // threshold tests is the union of the besieged victims AND the war_front
  // besiegers into them (instigators + supporters). This is what makes a
  // 4-vs-1 coalition siege promote to "The War" — the old victim-only count
  // saw a single besieged settlement and never crossed the threshold.
  for (const type of WAR_SHAPED_TYPES) {
    const victims = byType.get(type);
    if (!victims) continue;
    for (const besieger of besiegersInto(regionalGraph, victims)) victims.add(besieger);
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
