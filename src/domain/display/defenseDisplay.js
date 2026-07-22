/**
 * defenseDisplay — shared derivations for the Defense + Economics surfaces:
 * criminal-operation notes, criminal-structure classification, and supporting
 * capabilities. Single source consumed by BOTH the web tabs (DefenseTab,
 * EconomicsTab) and the PDF viewModel, so the printed dossier shows the same
 * full picture as the screen instead of a sparser subset.
 *
 * Pure functions of the settlement — no rendering, no side effects. Colors are
 * returned as hex object-values (not inline JSX style literals), which the
 * no-raw-color lint permits; PDF consumers feed them to react-pdf style props
 * as variables.
 */

import { buildThreatAssessment } from './threatAssessment.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

// The active-military-status POSTURE per stress type. This DISPLAY text lives in
// this lazy display module — NOT in data/stressTypes.js, which sits in the eager
// first-paint `data` chunk (the constitutional closure ratchet forbids growing it,
// prior art: galleryMapsFilters.js). The COLOUR stays single-sourced from the
// producer (each stress type's own `colour`). The two walkers below pin this map
// to the producer's exact stress vocabulary so it can never fall behind again.
/** @type {Readonly<Record<string, string>>} */
const MILITARY_POSTURE = Object.freeze({
  under_siege:           'ACTIVE SIEGE',
  famine:                'INTERNAL PRESSURE',
  occupied:              'UNDER OCCUPATION',
  politically_fractured: 'COMMAND SPLIT',
  indebted:              'UNDER TRIBUTE',
  recently_betrayed:     'SECURITY COMPROMISED',
  infiltrated:           'INFILTRATION ACTIVE',
  plague_onset:          'QUARANTINE ACTIVE',
  succession_void:       'SUCCESSION CONTESTED',
  monster_pressure:      'BEAST PRESSURE',
  insurgency:            'INSURGENCY ACTIVE',
  religious_conversion:  'RELIGIOUS UPHEAVAL',
  slave_revolt:          'REVOLT ACTIVE',
  wartime:               'WAR FOOTING',
  mass_migration:        'MIGRATION SURGE',
});

/**
 * The ACTIVE-MILITARY-STATUS stress set (pdf-4) — the single source of truth for
 * which stressor types raise a military-status callout, and the posture + colour
 * shown for each. Consumed by BOTH the web DefenseTab and the PDF defenseSlice so
 * the printed dossier and the screen can never drift.
 *
 * Cycle-3 H3: this used to be a hand-maintained literal covering only 6 of the 15
 * stress types the generator emits, so a settlement under insurgency/slave_revolt/
 * wartime/monster_pressure/mass_migration/religious_conversion/indebted/
 * succession_void/infiltrated raised NO callout. It is now DERIVED over the
 * producer table (data/stressTypes.js STRESS_TYPE_MAP) — one entry per registered
 * stress type, colour from the producer, posture from MILITARY_POSTURE above — so
 * it covers EVERY type. The vocabularyTotality walker
 * (tests/lint/vocabularyTotality.walker.test.js) pins the key-set correspondence
 * and non-empty postures; the stress-type registration walker asserts full
 * coverage. Keyed by the stressor TYPE the engine emits (not an icon/key sentinel).
 * @type {Readonly<Record<string, { posture: string, colour: string }>>}
 */
export const DEFENSE_STRESS_STATUS = Object.freeze(
  Object.fromEntries(
    Object.entries(STRESS_TYPE_MAP).map(([type, data]) => [
      type,
      { posture: MILITARY_POSTURE[type], colour: data.colour },
    ]),
  ),
);

/**
 * One named force entry from defenseProfile.institutions.
 * @typedef {{ name?: string, desc?: string, source?: string }} ForceEntry
 */

/**
 * The (legacy, generator-shaped) settlement slice these display derivations
 * read. Structural — NOT the canonical schema shape (defenseProfile /
 * economicState live outside CanonicalSettlement today).
 * @typedef {Object} DefenseDisplaySettlement
 * @property {Array<{ name?: string }>} [institutions]
 * @property {{ scores?: Record<string, number>, economicGates?: Record<string, number>, institutions?: Record<string, ForceEntry[]> }} [defenseProfile]
 * @property {{ compound?: { inst?: Record<string, boolean> }, foodSecurity?: { resilienceScore?: number, stockpile?: { blockaded?: unknown, blockadeBypass?: string | null } | null } }} [economicState]
 * @property {{ tradeRouteAccess?: string }} [config]
 */

/** @type {(n: number) => string} */
const scoreColor = (n) =>
  n >= 65 ? '#1a5a28' : n >= 40 ? '#a0762a' : n >= 20 ? '#8a4010' : '#8b1a1a';

/**
 * Per-criminal-operation enforcement note (Defense-tab voice), keyed off the
 * institution name.
 *
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function criminalOpNote(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes("thieves' guild") || n.includes('thieves guild'))
    return 'Controls the criminal hierarchy. Suppresses random crime in exchange for predictable extraction. Deeply embedded in civic life.';
  if (n.includes('black market'))
    return 'Operates a parallel marketplace for contraband, stolen goods, and unlicensed services. Competes directly with legitimate merchants.';
  if (n.includes('smuggling'))
    return 'Moves goods around customs and guild charters. Corrupt officials, unofficial landing points, and false manifests.';
  if (n.includes('front business'))
    return 'Legitimate-looking operations used to launder criminal revenue and provide cover for illegal activities.';
  if (n.includes('gang') || n.includes('street'))
    return 'Controls specific territory through violence. Extorts local businesses. Competes with the watch for street-level authority.';
  if (n.includes('gambling'))
    return 'Operates unlicensed gambling. Revenue funds broader criminal network. Attracts debt spirals and desperation crime.';
  if (n.includes('underground'))
    return 'An entire secondary economy operating below street level. Beyond enforcement reach without extraordinary effort.';
  if (n.includes('assassin'))
    return 'Professional killing for hire. The existence of this market reflects deeply embedded political violence.';
  if (n.includes('fence'))
    return 'Moves stolen goods into legitimate circulation. The fence is the clearinghouse that makes theft economically viable.';
  return 'Criminal infrastructure with local territorial or economic influence.';
}

/**
 * Per-criminal-operation economic role (Economics-tab voice). Short label.
 *
 * @param {string | null | undefined} name
 * @returns {string}
 */
export function criminalOpEcon(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('black market'))   return 'parallel marketplace';
  if (n.includes('smuggling'))      return 'duty evasion';
  if (n.includes('gambling'))       return 'unlicensed revenue';
  if (n.includes('front business')) return 'money laundering';
  if (n.includes('fence'))          return 'stolen goods market';
  if (n.includes('thieves'))        return 'protection + extraction';
  return 'criminal revenue stream';
}

const CRIM_STRUCTURE_DATA = Object.freeze({
  organized: {
    key: 'organized', label: 'Organized Syndicate', color: '#8b1a1a', bg: '#fdf4f4',
    note: 'A structured criminal hierarchy controls what crime is permitted. Predictable rules, a hierarchy to negotiate with. Or cross. Random violence is suppressed because it draws enforcement. The real danger is systematic: protection, extortion, corruption of officials.',
  },
  'semi-organized': {
    key: 'semi-organized', label: 'Semi-Organized Networks', color: '#8a3010', bg: '#fdf0e8',
    note: 'Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Multiple factions may be competing. Less predictable than a guild, more structured than street crime.',
  },
  diffuse: {
    key: 'diffuse', label: 'Diffuse Criminal Presence', color: '#7a5010', bg: '#faf8e0',
    note: 'Opportunistic crime without organizational infrastructure. Fences, bandits, and minor operators work independently. Less politically dangerous but harder to suppress. No single node to threaten or buy off.',
  },
});

/**
 * Classify the settlement's criminal structure from its institution names.
 * Returns { key, label, color, bg, note } or null when there is no organized
 * criminal infrastructure.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {{ key: string, label: string, color: string, bg: string, note: string } | null}
 */
export function deriveCriminalStructure(settlement) {
  const r = settlement || {};
  const names = (r.institutions || []).map((i) => (i?.name || '').toLowerCase());
  const hasGuild = names.some((n) => n.includes("thieves' guild") || n.includes('thieves guild'));
  const hasSyndicate = names.some((n) => n.includes('multiple criminal') || n.includes('underground city') || n.includes('front business'));
  const hasSemiOrg = names.some((n) => n.includes('smuggling') || n.includes('black market') || n.includes('gambling'));
  const hasDiffuse = names.some((n) => n.includes('fence') || n.includes('bandit') || n.includes('outlaw'));
  const key = hasGuild || hasSyndicate ? 'organized'
    : hasSemiOrg ? 'semi-organized'
      : hasDiffuse ? 'diffuse'
        : null;
  return key ? CRIM_STRUCTURE_DATA[key] : null;
}

/**
 * Supporting-capabilities cards (economic backing, magical, legal, medical,
 * logistics, and naval when coastal). Computed from defense scores + institution
 * presence flags (economicState.compound.inst). Returns an array of
 * { label, status, color, score|null, note }.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {Array<{ label: string, status: string, color: string, score: number | null, note: string }>}
 */
export function deriveSupportingCapabilities(settlement) {
  const r = settlement || {};
  const d = r.defenseProfile || {};
  const scores = d.scores || {};
  const inst = d.institutions || {};
  const f = r.economicState?.compound?.inst || {};
  const tradeAccess = r.config?.tradeRouteAccess || 'road';
  const magicDef = inst.magicDef || [];
  const econScore = Math.round(scores.economic || 0);

  const caps = [
    {
      label: 'Economic Backing',
      status: econScore >= 65 ? 'Well-funded' : econScore >= 40 ? 'Adequate' : econScore >= 25 ? 'Underfunded' : 'Critical',
      color: scoreColor(econScore), score: econScore,
      note: econScore >= 65 ? 'Full pay, maintained equipment, reserve capacity.' : econScore >= 40 ? 'Adequate upkeep, some shortfalls.' : econScore >= 25 ? 'Irregular pay, worn equipment, morale risk.' : 'Cannot sustain forces. Systemic breakdown.',
    },
    {
      label: 'Magical Capability',
      status: f.hasMagicInst ? 'Arcane support' : 'None',
      color: f.hasMagicInst ? '#5a2a8a' : '#9c8068', score: scores.magical || 0,
      note: f.hasMagicInst ? `${magicDef.slice(0, 2).map((m) => m.name).join(', ')}. Detection, wards, counterspell.` : 'Conventional defense only. Invisible threats go undetected and unanswered.',
    },
    {
      label: 'Legal Infrastructure',
      status: f.hasCourtSystem && f.hasPrison ? 'Court + Prison' : f.hasCourtSystem ? 'Court only' : f.hasPrison ? 'Prison only' : 'None',
      color: f.hasCourtSystem && f.hasPrison ? '#1a3a5a' : f.hasCourtSystem ? '#3a5a7a' : f.hasPrison ? '#7a5a3a' : '#9c8068', score: null,
      note: f.hasCourtSystem && f.hasPrison ? 'Full enforcement chain. Arrest, prosecute, detain.' : f.hasCourtSystem ? 'Courts without detention. Fines and exile only.' : f.hasPrison ? 'Detention without process. Arbitrary enforcement.' : 'No deterrence beyond force.',
    },
    {
      label: 'Medical Readiness',
      status: f.hasHospital ? 'Hospital present' : f.hasChurch ? 'Clergy care' : 'None',
      color: f.hasHospital ? '#1a5a28' : f.hasChurch ? '#7a5010' : '#8b1a1a', score: null,
      note: f.hasHospital ? 'Casualty treatment, outbreak containment, recovery capacity.' : f.hasChurch ? 'Parish care. Basic wound and disease management.' : 'No dedicated healers. Plague burns unchecked.',
    },
    {
      label: 'Logistics & Supply',
      status: f.hasGranary ? 'Granary present' : 'No reserves',
      color: f.hasGranary ? '#1a5a28' : '#8b1a1a', score: null,
      note: f.hasGranary ? (f.hasPort ? 'Granary + sea access. Historically the hardest siege posture to break.' : tradeAccess === 'isolated' ? 'Granary in isolation. Endurance depends entirely on stored reserves.' : 'Granary with road supply. Cut the roads, cut the supply.') : (tradeAccess === 'port' ? 'No reserves, but sea supply continues while port is open.' : 'No food buffer. Any supply disruption becomes a survival crisis within days.'),
    },
  ];
  if (f.hasNavy || f.hasPort) {
    // experience-product-fit-5: the STANDING naval reality, not just the static
    // institution boolean — when a hostile fleet blockades the port RIGHT NOW,
    // the note reflects it (the live `blockaded` flag is written each pulse and
    // is only set while the naval layer is lit, so this is dormant-off-safe). This
    // reuses the food-stockpile blockade-relief plumbing (deriveBlockadeRelief).
    const sp = r.economicState?.foodSecurity?.stockpile || null;
    const blockaded = !!(sp && sp.blockaded);
    const bypass = (sp && sp.blockadeBypass) || null;
    caps.push({
      label: 'Naval Defense',
      status: blockaded ? 'Under blockade' : f.hasNavy ? 'Naval force' : 'Port only',
      color: blockaded ? '#8b1a1a' : f.hasNavy ? '#1a3a6a' : '#3a5a7a', score: null,
      note: blockaded
        ? (bypass === 'teleport'
            ? 'A hostile fleet blockades the sea approaches — only a teleportation circle still runs supply past it.'
            : bypass === 'airship'
              ? 'A hostile fleet blockades the sea approaches — airships run the blockade, impaired by siege countermeasures.'
              : 'A hostile fleet blockades the sea approaches — the port is choked, and no magical channel runs the line.')
        : f.hasNavy
          ? 'Naval force controls sea approaches. Amphibious assault requires fleet superiority.'
          : 'Port facility but no naval force. Sea approaches are accessible to any vessel.',
    });
  }
  return caps;
}

/** @type {(n: number) => string} */
const readinessBadge = (n) =>
  n >= 65 ? 'STRONG' : n >= 40 ? 'ADEQUATE' : n >= 20 ? 'WEAK' : 'CRITICAL';

// Which defenseProfile.economicGates key funds each readiness row, and what
// the underfunded expense is called in the funding note.
/** @type {Readonly<Record<string, [string, string]>>} */
const READINESS_GATE_FOR = Object.freeze({
  'Beasts & Monsters': ['monster', 'patrol provisioning'],
  'Invasion & War': ['military', 'garrison pay'],
  'Internal Security': ['internal', 'watch and court funding'],
  'Economic Survival': ['economic', 'crisis logistics'],
  'Disasters & Famine': ['disaster', 'relief funding'],
});

/**
 * Defense-readiness rows — the threat assessment reframed as "how ready is the
 * settlement against each pressure" (higher = better defended). Wraps the
 * generator's buildThreatAssessment (the assessment prose) with the readiness
 * score + STRONG/ADEQUATE/WEAK/CRITICAL badge, exactly as the web Defense tab.
 * When the row's economic-upkeep gate (defenseProfile.economicGates) sits
 * below ×1.0, fundingNote attributes the shortfall ("Upkeep underfunded —
 * garrison pay at 60%") instead of leaving a silently lower bar.
 * Returns [{ label, score, status, statusColor, barColor, assess, fundingNote }].
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {Array<{ label: string, score: number, status: string, statusColor: string, barColor: string, assess: string, fundingNote: string | null }>}
 */
export function deriveDefenseReadiness(settlement) {
  const r = settlement || {};
  const scores = r.defenseProfile?.scores || {};
  const gates = r.defenseProfile?.economicGates || {};
  const f = r.economicState?.compound?.inst || {};
  /** @type {Record<string, number>} */
  const scoreFor = {
    'Beasts & Monsters': scores.monster || 0,
    'Invasion & War': scores.military || 0,
    'Internal Security': scores.internal || 0,
    'Economic Survival': scores.economic || 0,
    'Disasters & Famine':
      scores.disaster ??
      r.economicState?.foodSecurity?.resilienceScore ??
      Math.round((((scores.economic || 0) * 0.4) + (f.hasGranary ? 60 : 20) + (f.hasHospital ? 70 : f.hasChurch ? 40 : 10)) / 2),
  };
  return buildThreatAssessment(r).map((row) => {
    const score = scoreFor[row.label] ?? 0;
    const [gateKey, expense] = READINESS_GATE_FOR[row.label] || [];
    const gate = gateKey ? gates[gateKey] : undefined;
    const fundingNote = Number.isFinite(gate) && /** @type {number} */ (gate) < 1
      ? `Upkeep underfunded — ${expense} at ${Math.round(/** @type {number} */ (gate) * 100)}%`
      : null;
    return {
      label: row.label,
      score,
      status: readinessBadge(score),
      statusColor: scoreColor(score),
      barColor: row.color,
      assess: row.assess,
      fundingNote,
    };
  });
}

/** @type {(arr: ForceEntry[] | null | undefined) => ForceEntry[]} */
const dedupByName = (arr) => [...new Map((arr || []).map((m) => [m?.name, m])).values()];

/**
 * Armed forces grouped the way the web Defense tab presents them: fortifications,
 * standing forces (garrison + militia + watch, de-duplicated by name),
 * contracted (mercenary), monster-response charter, and arcane defense. Each
 * entry is a force object { name, desc, source } from defenseProfile.institutions.
 *
 * @param {DefenseDisplaySettlement | null | undefined} settlement
 * @returns {{ fortifications: ForceEntry[], standing: ForceEntry[], contracted: ForceEntry[], charter: ForceEntry[], arcane: ForceEntry[] }}
 */
export function deriveArmedForces(settlement) {
  const inst = settlement?.defenseProfile?.institutions || {};
  return {
    fortifications: inst.walls || [],
    standing: dedupByName([...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || [])]),
    contracted: inst.mercenary || [],
    charter: inst.charter || [],
    arcane: inst.magicDef || [],
  };
}
