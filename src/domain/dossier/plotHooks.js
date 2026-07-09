import { compareCodepoint } from '../deterministicSort.js';

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

/** @param {unknown} text @returns {string} */
function cleanHook(text) {
  return String(text || '').replace(/^\s*PLOT HOOK:\s*/i, '').trim();
}

/**
 * @param {PlotHook[]} out
 * @param {Record<string, unknown>} hook
 */
function push(out, hook) {
  const text = cleanHook(hook.text);
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
 * @property {PlotHookNpc[]} [npcs]
 * @property {PlotHookConflict[]} [conflicts]
 * @property {{ currentTensions?: PlotHookTension[], historicalEvents?: PlotHookEvent[], [key: string]: unknown }} [history]
 * @property {PlotHookRelationship[]} [relationships]
 * @property {{ plotHooks?: PlotHookRaw[] }} [economicViability]
 * @property {{ safetyProfile?: { plotHooks?: PlotHookRaw[] } }} [economicState]
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

  return hooks.sort((a, b) => b.priority - a.priority || compareCodepoint(a.category, b.category));
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
