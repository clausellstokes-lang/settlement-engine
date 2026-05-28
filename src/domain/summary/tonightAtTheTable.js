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
 * (P129) calls this once per settlement and renders the cards.
 *
 * Returns an array of `{ kind, title, body }` entries, capped at 6 so
 * the right column doesn't outgrow the left.
 */

const MAX_ENTRIES = 6;

/** @typedef {{ kind: 'NPC'|'HOOK'|'TWIST'|'RED', title: string, body: string }} TableEntry */

/**
 * @param {Object} settlement
 * @returns {TableEntry[]}
 */
export function tonightAtTheTable(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];

  /** @type {TableEntry[]} */
  const out = [];

  // ── Top NPCs ─────────────────────────────────────────────────────────
  // Prefer the governing NPC + one with a secret. Fall back to the
  // first two NPCs by importance.
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  const ranked = [...npcs].sort((a, b) => {
    const order = { major: 0, primary: 0, minor: 1, supporting: 1 };
    return (order[a.importance] ?? 2) - (order[b.importance] ?? 2);
  });
  for (const npc of ranked.slice(0, 2)) {
    const role = (npc.role || npc.title || '').toLowerCase();
    const trait = npc.secret
      ? `secret: ${truncate(npc.secret, 80)}`
      : (npc.want ? `wants: ${truncate(npc.want, 80)}` : (role || 'major NPC'));
    out.push({
      kind: 'NPC',
      title: npc.name || 'Unnamed NPC',
      body:  `${role}${role && trait ? ' · ' : ''}${trait}`,
    });
  }

  // ── Top hooks ────────────────────────────────────────────────────────
  // Take Tier-A hooks first (most urgent), then fill from the rest.
  const hooks = Array.isArray(settlement.plotHooks)
    ? settlement.plotHooks
    : Array.isArray(settlement.hooks) ? settlement.hooks : [];
  const rankedHooks = [...hooks].sort((a, b) => {
    const order = { A: 0, B: 1, C: 2 };
    return (order[a.tier] ?? 3) - (order[b.tier] ?? 3);
  });
  for (const hook of rankedHooks.slice(0, 2)) {
    out.push({
      kind: 'HOOK',
      title: hook.title || hook.headline || 'Unnamed hook',
      body:  truncate(hook.body || hook.summary || '', 120),
    });
  }

  // ── Twist ────────────────────────────────────────────────────────────
  // A legacyAnnotation tying past to present, OR the secret on a major
  // NPC we haven't already surfaced (typically the canonical "the
  // librarian breaks first" beat).
  const annotations = settlement.history?.legacyAnnotations || [];
  if (annotations.length > 0) {
    const a = annotations[0];
    out.push({
      kind: 'TWIST',
      title: a.title || a.label || 'The hidden thread',
      body:  truncate(a.body || a.summary || '', 120),
    });
  } else if (ranked.length > 2 && ranked[2]?.secret) {
    out.push({
      kind: 'TWIST',
      title: ranked[2].name,
      body:  truncate(ranked[2].secret, 120),
    });
  }

  // ── Red flag ─────────────────────────────────────────────────────────
  // A "don't mention" derived from a failing supply chain. The
  // critique's canonical example: "Don't mention salt — NPCs go cold.
  // Reason: routes broken."
  const failures = settlement.supplyChainState?.failures || [];
  if (failures.length > 0) {
    const f = failures[0];
    out.push({
      kind: 'RED',
      title: `Don't mention ${f.good || 'the supply'}`,
      body:  `NPCs go cold mid-sentence. Reason: ${f.reason || 'broken supply chain.'}`,
    });
  }

  return out.slice(0, MAX_ENTRIES);
}

function truncate(s, n) {
  const str = String(s || '');
  if (str.length <= n) return str;
  return str.slice(0, n - 1).trimEnd() + '…';
}
