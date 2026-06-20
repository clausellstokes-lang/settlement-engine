/**
 * domain/threatProfile.js — Structured threat modeling.
 *
 * Tier 4.6 of the roadmap. Today the generator implies threats
 * across several surfaces without ever materializing them as
 * canonical entities:
 *
 *   - `config.monsterThreat`: 'safe' | 'civilized' | 'frontier' | 'plagued'
 *   - `defenseProfile.scores.{military, monster, internal, economic, magical}`:
 *     low scores indicate vulnerability to the corresponding pressure
 *   - `stressors[]`: free-form, but commonly include siege/raid/plague/
 *     refugee/war tags
 *   - `neighbours[]` with relationshipType: 'hostile' | 'cold_war'
 *   - `activeConditions[]`: the canonical Phase 16 conditions, several
 *     of which are themselves threat-shaped (plague, siege_lifted's
 *     aftermath, food_anchor_lost's ongoing pressure)
 *
 * Phase 20 walks every surface and emits canonical ThreatProfile
 * entries with the roadmap-required fields:
 *
 *   {
 *     id, type, label, description,
 *     source, target, vector, visibility,
 *     severity, severityBand, trajectory, currentStage,
 *     beneficiaries[], victims[], affectedSystems[],
 *     originSurface,  // 'config' | 'defenseProfile' | 'stressors' |
 *                     // 'neighbours' | 'activeConditions'
 *   }
 *
 * Pure read-only derivation. No imports from src/lib. Composes
 * Phase 16 (activeConditions) so threats keyed off a canonical
 * condition share its provenance.
 *
 * Architectural payoff:
 *   - Phase 17 substrate variables (defense_readiness, social_trust,
 *     food_security, etc.) can quote threat profiles as contributors.
 *   - Phase 19's explainEntity gains a 'threat' explainer.
 *   - Tier 4.11 (player intervention events) gets a stable target
 *     vocabulary: events like 'removed_threat' reference threat ids.
 *   - Tier 6.1 (AI grounded-in-trace) — AI can ground "the settlement
 *     fears X" claims in real threat-profile state.
 */

import { deriveAllActiveConditions } from './activeConditions.js';
import { magicLedger } from './magicLedger.js';

// ── Canonical catalog ────────────────────────────────────────────────────

/**
 * Canonical threat type vocabulary. Each maps to a per-type template
 * with default affectedSystems / vector / beneficiaries. The 'other'
 * fallback catches anything we can't classify.
 */
export const THREAT_TYPES = Object.freeze([
  'monster_pressure',
  'bandit_raids',
  'siege',
  'rival_neighbor',
  'plague',
  'famine',
  'corruption',
  'unrest',
  'arcane_instability',
  'cult',
  'economic_collapse',
  'other',
]);

/**
 * Canonical stage vocabulary per the roadmap. Derived from severity.
 *   latent      — known but distant
 *   developing  — gathering momentum
 *   active      — currently exerting pressure
 *   imminent    — about to break
 *   realized    — the threat has materialized
 */
export const THREAT_STAGES = Object.freeze([
  'latent', 'developing', 'active', 'imminent', 'realized',
]);

const THREAT_TYPE_TEMPLATES = Object.freeze({
  monster_pressure: {
    label: 'Monster pressure',
    description: 'Beasts and wilderness predation surround the settlement.',
    vector: 'incursion',
    visibility: 'open',
    affectedSystems: ['defense_readiness', 'trade_connectivity', 'social_trust'],
    beneficiaries: ['mercenary companies', 'monster hunters'],
    victims: ['outlying farmers', 'travellers', 'small holdings'],
  },
  bandit_raids: {
    label: 'Bandit raids',
    description: 'Organised banditry on roads and isolated holdings.',
    vector: 'ambush',
    visibility: 'open',
    affectedSystems: ['trade_connectivity', 'defense_readiness'],
    beneficiaries: ['fences', 'smugglers', 'protection rackets'],
    victims: ['merchants', 'travellers', 'outlying farmers'],
  },
  siege: {
    label: 'Siege threat',
    description: 'External military force pressing or potentially pressing the walls.',
    vector: 'investment',
    visibility: 'open',
    affectedSystems: ['defense_readiness', 'food_security', 'public_legitimacy'],
    beneficiaries: ['the besieging power'],
    victims: ['all residents', 'merchants', 'outlying holdings'],
  },
  rival_neighbor: {
    label: 'Hostile neighbour',
    description: 'A nearby settlement hostile or in cold-war terms with this one.',
    vector: 'diplomatic / military pressure',
    visibility: 'open',
    affectedSystems: ['trade_connectivity', 'defense_readiness', 'social_trust'],
    beneficiaries: ['the rival\'s power structure'],
    victims: ['merchants who cross the border', 'border holdings'],
  },
  plague: {
    label: 'Plague',
    description: 'Illness spreads or risks spreading through the population.',
    vector: 'contagion',
    visibility: 'open',
    affectedSystems: ['healing_capacity', 'labor_capacity', 'public_legitimacy'],
    beneficiaries: ['black-market apothecaries'],
    victims: ['the poor', 'children', 'crowded districts'],
  },
  famine: {
    label: 'Famine pressure',
    description: 'Food supply is or risks becoming inadequate.',
    vector: 'shortage',
    visibility: 'open',
    affectedSystems: ['food_security', 'public_legitimacy', 'criminal_opportunity'],
    beneficiaries: ['grain speculators', 'smugglers'],
    victims: ['the poor', 'casual labor'],
  },
  corruption: {
    label: 'Corruption',
    description: 'Officials are or are alleged to be turning office to private benefit.',
    vector: 'institutional rot',
    visibility: 'rumored',
    affectedSystems: ['public_legitimacy', 'ruling_authority', 'social_trust'],
    beneficiaries: ['the corrupt officials', 'criminal patrons'],
    victims: ['common population', 'rivals of the corrupt'],
  },
  unrest: {
    label: 'Civil unrest',
    description: 'Public discontent is gathering or already breaking out.',
    vector: 'protest / riot',
    visibility: 'open',
    affectedSystems: ['public_legitimacy', 'criminal_opportunity', 'social_trust'],
    beneficiaries: ['the disaffected', 'rival factions'],
    victims: ['the watch', 'merchants', 'minorities'],
  },
  arcane_instability: {
    label: 'Arcane instability',
    description: 'Magical effects in or around the settlement are unreliable or dangerous.',
    vector: 'wild magic',
    visibility: 'rumored',
    affectedSystems: ['magical_stability', 'healing_capacity', 'social_trust'],
    beneficiaries: ['rogue practitioners', 'salvage hunters'],
    victims: ['the magically vulnerable', 'arcane institutions'],
  },
  cult: {
    label: 'Hidden cult',
    description: 'A secret religious or arcane group operates against the settlement\'s interests.',
    vector: 'subversion',
    visibility: 'hidden',
    affectedSystems: ['social_trust', 'religious_authority', 'public_legitimacy'],
    beneficiaries: ['the cult'],
    victims: ['the susceptible', 'isolated holdings'],
  },
  economic_collapse: {
    label: 'Economic collapse',
    description: 'Wealth, trade, or institutional finance is failing or about to fail.',
    vector: 'cascade',
    visibility: 'open',
    affectedSystems: ['trade_connectivity', 'public_legitimacy', 'criminal_opportunity'],
    beneficiaries: ['vulture buyers', 'rival markets'],
    victims: ['merchants', 'common population'],
  },
  other: {
    label: 'Unclassified threat',
    description: 'A pressure on the settlement that does not match a canonical type.',
    vector: 'unknown',
    visibility: 'rumored',
    affectedSystems: ['social_trust'],
    beneficiaries: [],
    victims: ['residents'],
  },
});

// ── Severity / stage helpers ─────────────────────────────────────────────

const SEVERITY_BANDS = Object.freeze(['low', 'medium', 'high', 'critical']);

// NOTE: severityBand (4-band) and currentStage (5-stage) measure DIFFERENT
// axes of the same threat — band is "how bad" (matching Phase 16 conditions'
// 4-band cut points) while stage is "how far along the progression." Their
// boundaries are intentionally offset (e.g. critical≥0.75 vs imminent≥0.6),
// so a high-band threat can read as 'active' rather than 'imminent'. This is by
// design, not an off-by error; do not "align" them — consumers that quote both
// rely on the two scales being independent.

/** 0..1 score → 4-band severity. Matches Phase 16 conditions. */
export function threatSeverityBand(severity) {
  const s = typeof severity === 'number' ? Math.max(0, Math.min(1, severity)) : 0;
  if (s >= 0.75) return 'critical';
  if (s >= 0.5)  return 'high';
  if (s >= 0.25) return 'medium';
  return 'low';
}

/** 0..1 score → 5-stage progression. */
export function severityToStage(severity) {
  const s = typeof severity === 'number' ? Math.max(0, Math.min(1, severity)) : 0;
  if (s >= 0.8) return 'realized';
  if (s >= 0.6) return 'imminent';
  if (s >= 0.4) return 'active';
  if (s >= 0.2) return 'developing';
  return 'latent';
}

// ── Type inference ───────────────────────────────────────────────────────

/** @type {ReadonlyArray<{pattern: RegExp, type: string}>} */
const TYPE_PATTERNS = Object.freeze([
  { pattern: /siege|invasion|war/i,                 type: 'siege' },
  { pattern: /bandit|highwayman|raider/i,           type: 'bandit_raids' },
  { pattern: /plague|pestilence|epidemic|disease/i, type: 'plague' },
  { pattern: /famine|hunger|food.*deficit/i,        type: 'famine' },
  { pattern: /refugee|displaced|migrant|influx/i,   type: 'unrest' },
  { pattern: /cult|conspiracy|hidden/i,             type: 'cult' },
  { pattern: /corruption|graft|bribe/i,             type: 'corruption' },
  { pattern: /riot|unrest|protest|sedition/i,       type: 'unrest' },
  { pattern: /monster|beast|wilderness|wild/i,      type: 'monster_pressure' },
  { pattern: /dragon|undead|fey|abyss/i,            type: 'monster_pressure' },
  { pattern: /arcane|magic|wild magic/i,            type: 'arcane_instability' },
  { pattern: /rival|neighbour|neighbor|hostile/i,   type: 'rival_neighbor' },
  { pattern: /economy|trade|market|wealth/i,        type: 'economic_collapse' },
]);

function inferThreatType(text) {
  if (!text) return 'other';
  const s = String(text);
  for (const { pattern, type } of TYPE_PATTERNS) {
    if (pattern.test(s)) return type;
  }
  return 'other';
}

// ── Id helper ────────────────────────────────────────────────────────────

function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function shortHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}

function threatIdFor(type, source, label) {
  const t = snakeCase(type || 'other');
  const suffix = shortHash(`${source || ''}.${label || ''}`);
  return `threat.${t}.${suffix}`;
}

// ── Surface collectors ───────────────────────────────────────────────────
// Each collector returns 0+ raw threats it spotted on a particular
// settlement surface. The composer normalizes them into ThreatProfile.

/** Walk every surface and return raw threat-shaped entries. */
export function collectThreatSources(settlement) {
  if (!settlement) return [];
  const out = [];

  // 1. config.monsterThreat — environmental wilderness pressure
  const monster = settlement.config?.monsterThreat;
  if (monster === 'plagued') {
    out.push({
      raw: { name: 'Region overrun with monsters', severity: 0.85 },
      inferredType: 'monster_pressure',
      originSurface: 'config',
    });
  } else if (monster === 'frontier') {
    out.push({
      raw: { name: 'Frontier monster pressure', severity: 0.45 },
      inferredType: 'monster_pressure',
      originSurface: 'config',
    });
  }

  // 2. defenseProfile.scores — low scores translate to threat pressure
  const scores = settlement.defenseProfile?.scores;
  if (scores) {
    if (typeof scores.internal === 'number' && scores.internal < 50) {
      out.push({
        raw: { name: 'Civic stability at risk', severity: clampInv(scores.internal) },
        inferredType: 'unrest',
        originSurface: 'defenseProfile',
      });
    }
    if (typeof scores.economic === 'number' && scores.economic < 40) {
      out.push({
        raw: { name: 'Economic fragility', severity: clampInv(scores.economic) },
        inferredType: 'economic_collapse',
        originSurface: 'defenseProfile',
      });
    }
    // Low magical DEFENSE only reads as wild-magic instability where magic is a
    // real force: in a dead-magic world or a mundane low-magic village, scores.magical
    // is legitimately ~0 and there is nothing arcane to destabilise. Without this gate
    // every no-magic campaign and most small towns reported a CRITICAL wild-magic threat.
    const magic = magicLedger(settlement);
    const magicIsLive = magic.magicExists && (magic.magicLevel === 'medium' || magic.magicLevel === 'high');
    if (magicIsLive && typeof scores.magical === 'number' && scores.magical > 0 && scores.magical < 40) {
      out.push({
        raw: { name: 'Magical instability', severity: clampInv(scores.magical) },
        inferredType: 'arcane_instability',
        originSurface: 'defenseProfile',
      });
    }
  }

  // 3. Explicit defenseProfile.threats[] (if the generator ever populates it)
  const explicit = settlement.defenseProfile?.threats;
  if (Array.isArray(explicit)) {
    for (const t of explicit) {
      if (!t) continue;
      const label = typeof t === 'string' ? t : (t.label || t.name || 'Unnamed threat');
      out.push({
        raw: t,
        inferredType: t?.type || inferThreatType(label),
        originSurface: 'defenseProfile',
      });
    }
  }

  // 4. Top-level threats[]
  if (Array.isArray(settlement.threats)) {
    for (const t of settlement.threats) {
      if (!t) continue;
      const label = typeof t === 'string' ? t : (t.label || t.name || 'Unnamed threat');
      out.push({
        raw: t,
        inferredType: t?.type || inferThreatType(label),
        originSurface: 'threats',
      });
    }
  }

  // 5. Stressors with threat-shaped tags / names
  const stressors = Array.isArray(settlement.stressors) ? settlement.stressors
                  : Array.isArray(settlement.stresses)  ? settlement.stresses
                  : [];
  for (const stressor of stressors) {
    if (!stressor) continue;
    const text = String(stressor.name || stressor.type || stressor.label || stressor || '');
    if (!text) continue;
    const type = inferThreatType(text);
    if (type === 'other') continue;  // skip neutral stressors
    out.push({
      raw: stressor,
      inferredType: type,
      originSurface: 'stressors',
    });
  }

  // 6. Hostile / cold-war neighbours
  const neighbours = Array.isArray(settlement.neighbours) ? settlement.neighbours
                   : Array.isArray(settlement.neighbourNetwork) ? settlement.neighbourNetwork
                   : [];
  for (const n of neighbours) {
    if (!n) continue;
    const rel = String(n.relationshipType || '').toLowerCase();
    if (rel === 'hostile' || rel === 'cold_war') {
      out.push({
        raw: {
          name: `Hostile neighbour: ${n.name || 'unknown'}`,
          severity: rel === 'hostile' ? 0.7 : 0.4,
          neighbour: n,
        },
        inferredType: 'rival_neighbor',
        originSurface: 'neighbours',
      });
    }
  }

  // 7. Active conditions — Phase 16 — that are themselves threats
  for (const cond of deriveAllActiveConditions(settlement)) {
    let inferredType;
    switch (cond.archetype) {
      case 'plague':              inferredType = 'plague'; break;
      case 'food_anchor_lost':    inferredType = 'famine'; break;
      case 'corruption_exposed':  inferredType = 'corruption'; break;
      case 'trade_route_cut':     inferredType = 'economic_collapse'; break;
      case 'dominant_npc_removed':inferredType = 'unrest'; break;
      case 'siege_lifted':        continue;  // post-threat, not a threat
      default:                    inferredType = null;
    }
    if (!inferredType) continue;
    out.push({
      raw: {
        name: cond.label,
        description: cond.description,
        severity: cond.severity,
        condition: cond,
      },
      inferredType,
      originSurface: 'activeConditions',
    });
  }

  return out;
}

// Map a 0..100 score to its inverse 0..1 threat severity (low score
// = high threat pressure).
function clampInv(score) {
  const s = Math.max(0, Math.min(100, score));
  return Math.max(0, Math.min(1, (60 - s) / 60));
}

// ── Composer ─────────────────────────────────────────────────────────────

/**
 * Enrich a single collected threat-source entry into a canonical
 * ThreatProfile. Pure; idempotent.
 *
 * @param {Object} source  { raw, inferredType, originSurface } from
 *                         collectThreatSources, or a structured threat
 *                         passed in directly.
 * @returns {Object | null}
 */
export function deriveThreatProfile(source, _settlement) {
  if (!source) return null;

  // Accept already-canonical threats by pass-through (idempotent contract).
  if (typeof source.id === 'string' && source.id.startsWith('threat.') && source.type) {
    return source;
  }

  const raw = source.raw || source;
  const type = source.inferredType || raw?.type || inferThreatType(
    raw?.name || raw?.label || ''
  );
  const tmpl = THREAT_TYPE_TEMPLATES[type] || THREAT_TYPE_TEMPLATES.other;

  // Severity: prefer explicit numeric, fall back to template-implied moderate.
  const severity = typeof raw?.severity === 'number'
    ? Math.max(0, Math.min(1, raw.severity))
    : 0.4;

  const label = raw?.label || raw?.name || tmpl.label;
  const description = raw?.description || tmpl.description;

  return {
    id: typeof raw?.id === 'string' && raw.id.startsWith('threat.')
      ? raw.id
      : threatIdFor(type, source.originSurface, label),
    type,
    label,
    description,

    source: raw?.source || source.originSurface || 'unknown',
    target: raw?.target || 'settlement',
    vector: raw?.vector || tmpl.vector,
    visibility: raw?.visibility || tmpl.visibility,

    severity,
    severityBand: threatSeverityBand(severity),
    trajectory: raw?.trajectory || 'stable',
    currentStage: raw?.currentStage || severityToStage(severity),

    beneficiaries: Array.isArray(raw?.beneficiaries) && raw.beneficiaries.length
      ? [...raw.beneficiaries] : [...tmpl.beneficiaries],
    victims: Array.isArray(raw?.victims) && raw.victims.length
      ? [...raw.victims] : [...tmpl.victims],
    affectedSystems: Array.isArray(raw?.affectedSystems) && raw.affectedSystems.length
      ? [...raw.affectedSystems] : [...tmpl.affectedSystems],

    originSurface: source.originSurface || 'unknown',

    // Carry the raw shape for reference (e.g. linked active condition).
    raw,
  };
}

/**
 * Collapse threats by (type, target), keeping the highest-severity instance.
 * This is the PRESSURE view: it answers "how many DISTINCT KINDS of pressure
 * (per target) press the settlement?", deliberately folding away both
 * cross-surface duplicates (e.g. config.monsterThreat AND a matching stressor)
 * AND legitimately-distinct same-type instances (e.g. two hostile neighbours).
 *
 * It exists ONLY for consumers that SUM threat contributions — most importantly
 * capacityModel's demand math, where charging the same kind of pressure once per
 * surface/neighbour would double-count it and tip capacity bands on phantom load.
 * It is NOT the enumeration view: deriveAllThreatProfiles below stays un-collapsed
 * so explanation / contradictions / map / AI-grounding see every distinct threat.
 *
 * Determinism: iterates input order (collectThreatSources is deterministic) and
 * keeps the first max-severity instance, so the per-(type,target) survivor and
 * the summed demand it drives are byte-stable across runs.
 *
 * @param {any[]} profiles
 * @returns {any[]} one profile per (type, target), max severity wins.
 */
export function dedupeThreatsByPressure(profiles) {
  const byKey = new Map();
  for (const p of profiles) {
    if (!p) continue;
    const key = `${p.type || 'other'}|${p.target || 'settlement'}`;
    const prior = byKey.get(key);
    if (!prior || (p.severity || 0) > (prior.severity || 0)) byKey.set(key, p);
  }
  return Array.from(byKey.values());
}

/**
 * Derive every threat across all surfaces, un-collapsed: each distinct threat
 * survives enumeration so consumers can address them individually (e.g. two
 * hostile neighbours both surface in explanations / contradictions / map /
 * AI-grounding). Note: the same underlying pressure expressed on more than one
 * surface CAN therefore appear more than once here — that is intentional for
 * enumeration. Summation consumers must collapse first via
 * dedupeThreatsByPressure (capacityModel does this in its demand math) so they
 * do not double-count a single pressure.
 *
 * @param {any} settlement
 * @returns {any[]} every derived ThreatProfile, un-collapsed.
 */
export function deriveAllThreatProfiles(settlement) {
  if (!settlement) return [];
  const sources = collectThreatSources(settlement);
  return /** @type {any[]} */ (sources.map(s => deriveThreatProfile(s, settlement)).filter(Boolean));
}

// ── Diagnostic helpers ───────────────────────────────────────────────────

/** Count threats by type / band / stage. */
export function threatBreakdown(settlement) {
  const profiles = deriveAllThreatProfiles(settlement);
  const byType = {};
  const byBand = { low: 0, medium: 0, high: 0, critical: 0 };
  const byStage = { latent: 0, developing: 0, active: 0, imminent: 0, realized: 0 };
  for (const t of profiles) {
    byType[t.type] = (byType[t.type] || 0) + 1;
    if (byBand[t.severityBand] !== undefined) byBand[t.severityBand] += 1;
    if (byStage[t.currentStage] !== undefined) byStage[t.currentStage] += 1;
  }
  return { count: profiles.length, byType, byBand, byStage };
}

/**
 * Flat list of system variables pressured by the active threats.
 * Useful for the Phase 17 substrate to cross-reference. Deduplicated.
 */
export function pressuresOnSubstrate(settlement) {
  const out = new Set();
  for (const t of deriveAllThreatProfiles(settlement)) {
    for (const s of t.affectedSystems || []) out.add(s);
  }
  return Array.from(out);
}

/** Human-readable lines suitable for AI / PDF / UI. */
export function summarizeThreats(settlement) {
  const profiles = deriveAllThreatProfiles(settlement);
  if (profiles.length === 0) return ['No threats currently pressing the settlement.'];
  return profiles.map(t =>
    `${t.label} — ${t.severityBand} (${t.currentStage}) via ${t.vector} on ${(t.affectedSystems || []).join(', ')}`
  );
}

/** Catalog for tests + drift detection. */
export function supportedThreatTypes() {
  return [...THREAT_TYPES];
}

/** Catalog template accessor for UI / help text. */
export function threatTypeTemplate(type) {
  return THREAT_TYPE_TEMPLATES[type] || null;
}

/** Severity bands list. */
export function threatSeverityBands() {
  return [...SEVERITY_BANDS];
}

/** Stage list. */
export function threatStages() {
  return [...THREAT_STAGES];
}
