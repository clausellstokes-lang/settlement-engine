import { compareCodepoint } from '../deterministicSort.js';
import { traditionHook } from '../traditions/prose.js';
import { normalizePlotHook } from '../../lib/proseSeams.js';

const TENSION_LABELS = Object.freeze({
  crime_wave: 'Crime Wave',
  economic_disparity: 'Economic Disparity',
  guild_conflict: 'Guild Conflict',
  infiltration_fear: 'Infiltration Fear',
  leadership_vacuum: 'Leadership Vacuum',
  magical_controversy: 'Magical Controversy',
  occupation_legacy: 'Occupation Legacy',
  outside_debt: 'External Debt',
  resource_scarcity: 'Resource Scarcity',
  succession_crisis: 'Succession Crisis',
});

const EVENT_LABELS = Object.freeze({
  disaster: 'Disaster',
  political: 'Political',
  economic: 'Economic',
  religious: 'Religious',
  magical: 'Magical',
  demographic: 'Demographic',
  exile_return: 'Exile & Return',
  occupation_infiltration: 'Occupation',
});

export const PLOT_HOOK_CATEGORIES = Object.freeze({
  npc: { color: '#2a3a7a', label: 'NPCs' },
  faction: { color: '#8b1a1a', label: 'Factions' },
  tension: { color: '#b8860b', label: 'Tensions' },
  economics: { color: '#a0762a', label: 'Economy' },
  safety: { color: '#5a2a8a', label: 'Safety' },
  history: { color: '#1a4a2a', label: 'History' },
  relationship: { color: '#5a3a1a', label: 'Relationships' },
});

/**
 * A raw hook as produced by the generators: either a bare string, or an object
 * carrying the prose under `hook`/`text` (plus optional category/severity).
 * @typedef {string | { hook?: unknown, text?: unknown, category?: unknown, severity?: unknown }} PlotHookRaw
 */

/**
 * A normalized dossier plot hook.
 * @typedef {Object} PlotHook
 * @property {string} text
 * @property {string} [source]
 * @property {string} [role]
 * @property {(string|null)} [sub]
 * @property {string} category
 * @property {number} priority
 * @property {boolean} [accent]
 * @property {Array<{ kind: string, label: unknown, id: unknown }>} [links]
 */

/** @param {unknown} hook @returns {string} */
function textForHook(hook) {
  if (typeof hook === 'string') return hook;
  if (!hook) return '';
  if (typeof (/** @type {{ hook?: unknown }} */ (hook)).hook === 'string') return /** @type {string} */ ((/** @type {{ hook?: unknown }} */ (hook)).hook);
  if (typeof (/** @type {{ text?: unknown }} */ (hook)).text === 'string') return /** @type {string} */ ((/** @type {{ text?: unknown }} */ (hook)).text);
  return String(hook);
}

// Hook-prefix cleanup is the shared display chokepoint (src/lib/proseSeams.js);
// `normalizePlotHook` here is byte-identical to the local `cleanHook` it replaced.

// ── Anti-repetition: the aggregator owns final cross-tab uniqueness ───────────
// Generators keep their OWN source varied (the settlement-scoped draw registry in
// npcGenerator; see hookVariety.js). collectPlotHooks is the single point where
// every source converges, so it owns the guarantee that the DM never reads the
// same hook twice ACROSS tabs — by two layers of dedup on the priority-sorted
// list, keeping the first (highest-priority) occurrence.
//
// Echo prefixes: historyGenerator reframes older present-tense hooks as archival
// discoveries ("Old records suggest …"). Those are paraphrase VARIANTS of one hook
// family, so the family key strips them before comparing — otherwise the same beat
// reads once live and once reframed.
const ECHO_PREFIXES = [
  'old records suggest ',
  'a recently surfaced document implies ',
  'family accounts passed down from the time claim ',
  "an archivist's notes from that period reveal ",
  'evidence that survived the years indicates ',
];

/** Exact-text key: identical prose, modulo case/whitespace/edge punctuation.
 *  @param {unknown} text @returns {string} */
function normHookText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^["'\s]+|["'\s.!?]+$/g, '')
    .trim();
}

/** Family key: the exact-text key with known reframing prefixes stripped, so
 *  paraphrase variants of one authored hook collapse to a single family.
 *  @param {unknown} text @returns {string} */
function hookFamilyId(text) {
  let key = normHookText(text);
  for (const prefix of ECHO_PREFIXES) {
    if (key.startsWith(prefix)) { key = key.slice(prefix.length); break; }
  }
  return key.trim();
}

/**
 * Drop cross-tab repeats from a priority-sorted hook list, keeping the FIRST
 * (highest-priority) occurrence. A hook is dropped when either its exact text OR
 * its family id has already been kept — belt-and-suspenders: exact-text catches
 * identical prose emitted by two sources; the family layer additionally catches
 * reframed variants of the same authored beat.
 * @param {PlotHook[]} sorted
 * @returns {PlotHook[]}
 */
function dedupeHooks(sorted) {
  /** @type {Set<string>} */ const seenText = new Set();
  /** @type {Set<string>} */ const seenFamily = new Set();
  /** @type {PlotHook[]} */ const out = [];
  for (const hook of sorted) {
    const textKey = normHookText(hook.text);
    const familyKey = hookFamilyId(hook.text);
    if (!textKey) continue;
    if (seenText.has(textKey) || seenFamily.has(familyKey)) continue;
    seenText.add(textKey);
    seenFamily.add(familyKey);
    out.push(hook);
  }
  return out;
}

/**
 * @param {PlotHook[]} out
 * @param {Record<string, unknown>} hook
 */
function push(out, hook) {
  const text = normalizePlotHook(hook.text);
  if (!text) return;
  out.push(/** @type {PlotHook} */ ({
    ...hook,
    text,
    category: hook.category || 'tension',
    priority: Number.isFinite(hook.priority) ? hook.priority : 5,
    accent: Boolean(hook.accent),
  }));
}

/**
 * @typedef {Object} PlotHookNpc
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [name]
 * @property {string} [role]
 * @property {string} [title]
 * @property {string} [factionAffiliation]
 * @property {string} [influence]
 * @property {number} [power]
 * @property {string} [id]
 */
/**
 * @typedef {Object} PlotHookConflict
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [intensity]
 * @property {string[]} [parties]
 * @property {string} [issue]
 */
/**
 * @typedef {Object} PlotHookTension
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [type]
 * @property {string} [description]
 */
/**
 * @typedef {Object} PlotHookRelationship
 * @property {string} [tension]
 * @property {string} [npc1Name]
 * @property {string} [npc2Name]
 * @property {string} [npc1Id]
 * @property {string} [npc2Id]
 * @property {string} [npc1Role]
 * @property {string} [npc2Role]
 * @property {string} [typeName]
 * @property {string} [type]
 * @property {(string|number)} [strength]
 * @property {boolean} [flagDriven]
 */
/**
 * @typedef {Object} PlotHookEvent
 * @property {PlotHookRaw[]} [plotHooks]
 * @property {string} [type]
 * @property {number} [yearsAgo]
 * @property {boolean} [anchored]
 */
/**
 * @typedef {Object} PlotHookSettlement
 * @property {string} [name]
 * @property {PlotHookNpc[]} [npcs]
 * @property {PlotHookConflict[]} [conflicts]
 * @property {{ currentTensions?: PlotHookTension[], historicalEvents?: PlotHookEvent[], [key: string]: unknown }} [history]
 * @property {PlotHookRelationship[]} [relationships]
 * @property {{ plotHooks?: PlotHookRaw[] }} [economicViability]
 * @property {{ safetyProfile?: { plotHooks?: PlotHookRaw[] } }} [economicState]
 * @property {unknown[]} [traditions]  THE TRADITIONS mirror (T-5) — outcome/relation hooks
 */

/**
 * @param {PlotHookSettlement} [settlement]
 * @returns {PlotHook[]}
 */
export function collectPlotHooks(settlement = {}) {
  /** @type {PlotHook[]} */
  const hooks = [];

  (settlement.npcs || []).forEach((npc) => {
    (npc.plotHooks || []).forEach((hook) => push(hooks, {
      text: textForHook(hook),
      source: npc.name || 'NPC',
      role: npc.role || npc.title || '',
      sub: [
        npc.factionAffiliation,
        npc.influence === 'high' ? 'High influence' : npc.influence === 'moderate' ? 'Moderate influence' : null,
      ].filter(Boolean).join(' · '),
      category: 'npc',
      priority: npc.power || (npc.influence === 'high' ? 8 : 5),
      accent: npc.influence === 'high',
      links: [{ kind: 'npc', label: npc.name, id: npc.id || npc.name }],
    }));
  });

  (settlement.conflicts || []).forEach((conflict) => {
    const intensity = conflict.intensity || 'moderate';
    (conflict.plotHooks || []).forEach((hook) => push(hooks, {
      text: textForHook(hook),
      source: (conflict.parties || []).join(' vs ') || 'Conflict',
      role: conflict.issue || '',
      sub: `${intensity} tension`,
      category: 'faction',
      priority: intensity === 'high' ? 9 : intensity === 'low' ? 5 : 7,
      accent: intensity === 'high',
      links: (conflict.parties || []).filter(Boolean).map(party => ({ kind: 'faction', label: party, id: party })),
    }));
  });

  (settlement.history?.currentTensions || []).forEach((tension) => {
    const label = TENSION_LABELS[/** @type {keyof typeof TENSION_LABELS} */ (tension.type)] || tension.type || 'Tension';
    (tension.plotHooks || []).forEach((hook) => push(hooks, {
      text: textForHook(hook),
      source: label,
      // Full description — tension prose runs ~95 chars and the role renders
      // small/muted; a hard slice left mid-word fragments ('…resist investi').
      role: typeof tension.description === 'string' ? tension.description : '',
      category: 'tension',
      priority: 7,
    }));
  });

  (settlement.relationships || []).forEach((rel) => {
    if (!rel.tension) return;
    push(hooks, {
      text: rel.tension,
      source: `${rel.npc1Name || 'NPC'} & ${rel.npc2Name || 'NPC'}`,
      role: rel.typeName || rel.type || '',
      sub: [rel.npc1Role, rel.strength, rel.npc2Role].filter(Boolean).join(' · '),
      category: 'relationship',
      priority: rel.flagDriven ? 8 : 6,
      accent: rel.flagDriven,
      links: [
        rel.npc1Name ? { kind: 'npc', label: rel.npc1Name, id: rel.npc1Id || rel.npc1Name } : null,
        rel.npc2Name ? { kind: 'npc', label: rel.npc2Name, id: rel.npc2Id || rel.npc2Name } : null,
      ].filter(Boolean),
    });
  });

  (settlement.economicViability?.plotHooks || []).forEach((hook) => {
    const h = /** @type {{ hook?: unknown, text?: unknown, category?: unknown, severity?: unknown }} */ (typeof hook === 'object' && hook ? hook : { hook });
    push(hooks, {
      text: textForHook(h),
      source: h.category || 'Economy',
      role: '',
      sub: ['high', 'critical'].includes(/** @type {string} */ (h.severity)) ? `${h.severity} severity` : null,
      category: 'economics',
      priority: h.severity === 'critical' ? 9 : h.severity === 'high' ? 8 : 7,
      accent: h.severity === 'critical' || h.severity === 'high',
    });
  });

  (settlement.economicState?.safetyProfile?.plotHooks || []).forEach((hook) => push(hooks, {
    text: textForHook(hook),
    source: 'Safety & Crime',
    role: '',
    category: 'safety',
    priority: 8,
  }));

  (settlement.history?.historicalEvents || []).forEach((event) => {
    const label = EVENT_LABELS[/** @type {keyof typeof EVENT_LABELS} */ (event.type)] || EVENT_LABELS.political;
    (event.plotHooks || []).forEach((hook) => push(hooks, {
      text: textForHook(hook),
      source: `${label} Event`,
      role: event.yearsAgo ? `${event.yearsAgo}y ago` : '',
      sub: event.anchored ? 'Still affecting this settlement' : null,
      category: 'history',
      priority: event.anchored ? 7 : 5,
      accent: Boolean(event.anchored),
    }));
  });

  // THE TRADITIONS wave (T-5) — outcome/relation-conditioned hooks off the festival
  // register (settlement.traditions MIRROR). A failed/cancelled/triumphant festival, a
  // rite suppressed under an overlord / just liberated / carried in by settlers each raise
  // a seeded hook. Absent mirror (dark / draft) ⇒ nothing added, byte-identical.
  (settlement.traditions || []).forEach((rec) => {
    const hook = traditionHook(/** @type {Parameters<typeof traditionHook>[0]} */ (rec), { town: settlement.name });
    if (!hook) return;
    push(hooks, {
      text: hook.text,
      source: 'Traditions', // the source label marks these; they ride the existing 'tension' category
      role: hook.source, // the tradition's name
      category: 'tension',
      priority: hook.priority,
      accent: hook.priority >= 8,
    });
  });

  // Sort by priority (then category, for a stable tiebreak), THEN dedupe so the
  // kept instance of any repeated hook is always the highest-priority one.
  const sorted = hooks.sort((a, b) => b.priority - a.priority || compareCodepoint(a.category, b.category));
  return dedupeHooks(sorted);
}

/**
 * @param {PlotHook[]} [hooks]
 * @returns {Record<string, number>}
 */
export function countPlotHookCategories(hooks = []) {
  return hooks.reduce((/** @type {Record<string, number>} */ acc, hook) => {
    acc[hook.category] = (acc[hook.category] || 0) + 1;
    return acc;
  }, {});
}
