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

function textForHook(hook) {
  if (typeof hook === 'string') return hook;
  if (!hook) return '';
  if (typeof hook.hook === 'string') return hook.hook;
  if (typeof hook.text === 'string') return hook.text;
  return String(hook);
}

function cleanHook(text) {
  return String(text || '').replace(/^\s*PLOT HOOK:\s*/i, '').trim();
}

function push(out, hook) {
  const text = cleanHook(hook.text);
  if (!text) return;
  out.push({
    ...hook,
    text,
    category: hook.category || 'tension',
    priority: Number.isFinite(hook.priority) ? hook.priority : 5,
    accent: Boolean(hook.accent),
  });
}

export function collectPlotHooks(settlement = {}) {
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
    const label = TENSION_LABELS[tension.type] || tension.type || 'Tension';
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
    const h = typeof hook === 'object' && hook ? hook : { hook };
    push(hooks, {
      text: textForHook(h),
      source: h.category || 'Economy',
      role: '',
      sub: ['high', 'critical'].includes(h.severity) ? `${h.severity} severity` : null,
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
    const label = EVENT_LABELS[event.type] || EVENT_LABELS.political;
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

  return hooks.sort((a, b) => b.priority - a.priority || a.category.localeCompare(b.category));
}

export function countPlotHookCategories(hooks = []) {
  return hooks.reduce((acc, hook) => {
    acc[hook.category] = (acc[hook.category] || 0) + 1;
    return acc;
  }, {});
}
