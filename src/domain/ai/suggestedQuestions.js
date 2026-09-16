/**
 * domain/ai/suggestedQuestions.js — THE ZERO-COST EMPTY STATE (Surveyor Shell,
 * DESIGN_AI_CONTROL_SURFACE §2c point 4).
 *
 * The panel's empty state offers 3-4 suggested questions DERIVED FROM READ-MODELS — with
 * ZERO AI cost until the DM actually asks. This module is PURE: it inspects the anchor + the
 * in-scope read-model data (which settlement is in view, whether it has factions / NPCs /
 * treaties) and picks the most relevant prompts. It opens NO network and calls NO provider —
 * "zero cost" is STRUCTURAL, not a promise (the pin proves the module imports no transport).
 *
 * Lazy-only (rides the panel chunk) — zero eager bytes. Emits only question strings.
 */

/** Tailor a settlement question to its name (or a generic subject).
 *  @param {string} [name] @returns {string} */
function forName(name) { return name || 'this settlement'; }

/**
 * Build 3-4 suggested questions for the current anchor + data. Pure. The questions are
 * read-model-derived: a settlement with factions gets a faction question, one with NPCs gets
 * a people question, etc. Always returns between 3 and 4 questions (padding from a scope
 * default so the empty state is never bare), never more.
 *
 * @param {{ scope?: string, entityId?: string|null }} [anchor]
 * @param {{
 *   settlement?: { name?: string, factions?: unknown[], powerStructure?: { factions?: unknown[] }, npcs?: unknown[] }|null,
 *   worldState?: { spatialLedgers?: { treaties?: Record<string, unknown> } }|null,
 * }} [data]
 * @returns {string[]} 3-4 question strings
 */
export function suggestedQuestions(anchor = {}, { settlement = null, worldState = null } = {}) {
  const scope = anchor && anchor.scope ? anchor.scope : 'none';
  /** @type {string[]} */
  const out = [];
  /** @param {string} q */
  const push = (q) => { if (q && !out.includes(q)) out.push(q); };

  if ((scope === 'settlement' || scope === 'map') && settlement) {
    const name = forName(settlement.name);
    const factionList = settlement.factions || (settlement.powerStructure && settlement.powerStructure.factions);
    const hasFactions = Array.isArray(factionList) && factionList.length > 0;
    const hasNpcs = Array.isArray(settlement.npcs) && settlement.npcs.length > 0;
    if (hasFactions) push(`What factions hold sway in ${name}?`);
    push(`What is the state of ${name} this week?`);
    if (hasNpcs) push(`Who are the key figures in ${name}?`);
    push(`What can I tell the players about ${name}?`);
    push(`What tensions are building in ${name}?`);
  } else if (scope === 'realm' || scope === 'chronicle') {
    const hasTreaties = !!(worldState && worldState.spatialLedgers && worldState.spatialLedgers.treaties && Object.keys(worldState.spatialLedgers.treaties).length);
    push('What has changed across the realm this week?');
    if (hasTreaties) push('Which powers dominate the region right now?');
    push('Where is conflict most likely to break out?');
    push('What should I prepare for the next session?');
  } else {
    push('What is happening in my world right now?');
    push('Which settlements are under the most pressure?');
    push('What can I share with my players?');
    push('What should I prepare for next session?');
  }

  // never bare (3 minimum), never a dump (4 maximum)
  const pad = ['What is happening in my world right now?', 'What should I prepare for next session?', 'What can I share with my players?'];
  for (const p of pad) { if (out.length >= 3) break; push(p); }
  return out.slice(0, 4);
}
