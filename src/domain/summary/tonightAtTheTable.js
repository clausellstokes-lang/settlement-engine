/**
 * domain/summary/tonightAtTheTable.js — Pure composer for the right
 * column of the magazine-spread Summary tab.
 *
 * Pulls the highest-leverage table-night entries from a settlement:
 *   - Top NPC          (governing faction's primary or most-corrupt)
 *   - Top hook         (Tier-A plot hook, or the first hook)
 *   - Twist            (a legacyAnnotation linking past to present,
 *                       or the secret on a major NPC)
 *   - Red flag         (a "don't mention" beat derived from a
 *                       failing supply chain)
 *
 * Pure — same input always yields the same output. The Summary tab
 * calls this once per settlement and renders the cards.
 *
 * Returns an array of `{ kind, title, body }` entries, capped at 6 so
 * the right column doesn't outgrow the left.
 */

import { collectPlotHooks } from '../dossier/plotHooks.js';
import { deriveAllSupplyChainStates } from '../supplyChainState.js';

const MAX_ENTRIES = 6;

// Supply-chain statuses that represent a genuine, table-visible disruption
// (vs. merely 'strained'/'substituted', which still function).
const DISRUPTED_STATUSES = new Set(['blocked', 'collapsing', 'scarce', 'captured']);

/** @type {Record<string, number>} */
const INFLUENCE_RANK = { high: 0, moderate: 1, low: 2 };

/**
 * Read an NPC secret regardless of shape — generators emit { what, stakes }.
 * @param {import('../settlement.schema.js').SimNpc} npc
 */
function npcSecretText(npc) {
  if (!npc?.secret) return '';
  return typeof npc.secret === 'string' ? npc.secret : (npc.secret.what || '');
}

/** @typedef {{ kind: 'NPC'|'HOOK'|'TWIST'|'RED', title: string, body: string }} TableEntry */

/**
 * @param {any} settlement
 * @returns {TableEntry[]}
 */
export function tonightAtTheTable(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];

  /** @type {TableEntry[]} */
  const out = [];

  // ── Top NPCs ─────────────────────────────────────────────────────────
  // Rank by the fields generators actually emit: power (desc), then
  // influence band. The old `importance` vocabulary matched nothing.
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  const ranked = [...npcs].sort((a, b) => {
    const pw = (b.power || 0) - (a.power || 0);
    if (pw !== 0) return pw;
    return (INFLUENCE_RANK[a.influence] ?? 3) - (INFLUENCE_RANK[b.influence] ?? 3);
  });
  for (const npc of ranked.slice(0, 2)) {
    const role = (npc.role || npc.title || '').toLowerCase();
    const secret = npcSecretText(npc);
    const want = npc.goal?.short || npc.want || '';
    const trait = secret
      ? `secret: ${truncate(secret, 200)}`
      : (want ? `wants: ${truncate(want, 200)}` : (role || 'major NPC'));
    out.push({
      kind: 'NPC',
      title: npc.name || 'Unnamed NPC',
      body:  `${role}${role && trait ? ' · ' : ''}${trait}`,
    });
  }

  // ── Top hooks ────────────────────────────────────────────────────────
  // Source from the canonical plot-hook collector (the settlement carries no
  // plotHooks/hooks array of its own) and rank by numeric priority desc.
  const hooks = collectPlotHooks(settlement);
  const rankedHooks = [...hooks].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  for (const hook of rankedHooks.slice(0, 2)) {
    out.push({
      kind: 'HOOK',
      title: hook.source || hook.role || 'Plot hook',
      body:  truncate(hook.text || '', 280),
    });
  }

  // ── Twist ────────────────────────────────────────────────────────────
  // A legacyAnnotation tying past to present, OR the secret on a major
  // NPC we haven't already surfaced.
  const annotations = settlement.history?.legacyAnnotations || [];
  const annotation = annotations[0];
  if (annotation?.annotation) {
    out.push({
      kind: 'TWIST',
      title: annotation.eventName || 'The hidden thread',
      body:  truncate(annotation.annotation, 280),
    });
  } else if (ranked.length > 2 && npcSecretText(ranked[2])) {
    out.push({
      kind: 'TWIST',
      title: ranked[2].name,
      body:  truncate(npcSecretText(ranked[2]), 280),
    });
  }

  // ── Red flag ─────────────────────────────────────────────────────────
  // A "don't mention" derived live from a disrupted supply chain — the
  // settlement carries no supplyChainState.failures array of its own.
  const disrupted = deriveAllSupplyChainStates(settlement)
    .filter((/** @type {any} */ c) => DISRUPTED_STATUSES.has(c.status));
  if (disrupted.length > 0) {
    const f = disrupted[0];
    const good = f.needLabel || f.name || 'the supply';
    const reason = f.failureConsequences || 'broken supply chain.';
    out.push({
      kind: 'RED',
      title: `Don't mention ${good}`,
      body:  truncate(`NPCs go cold mid-sentence. Reason: ${reason}`, 280),
    });
  }

  return out.slice(0, MAX_ENTRIES);
}

/**
 * @param {any} s
 * @param {number} n
 */
function truncate(s, n) {
  const str = String(s || '');
  if (str.length <= n) return str;
  return str.slice(0, Math.max(0, n - 1)).trimEnd() + '…';
}
