/**
 * Pure deity-snapshot authority.
 *
 * Assignment resolves authored content outside the simulation, then embeds this
 * bounded record so headless event, generation, and pulse consumers never read
 * the account library. Keeping the builder in domain lets both UI/store intent
 * paths and deterministic preview fixtures share one source without reversing
 * the engine's dependency direction.
 */

/**
 * Build the self-contained deity snapshot from an authored deity record.
 *
 * @param {{
 *   name?:unknown,
 *   alignmentAxis?:unknown,
 *   temperamentAxis?:unknown,
 *   rankAxis?:unknown,
 *   lawAxis?:unknown,
 *   domain?:unknown,
 * }} raw
 */
export function deitySnapshotFrom(raw) {
  return {
    name: raw.name,
    alignmentAxis: raw.alignmentAxis,
    temperamentAxis: raw.temperamentAxis,
    rankAxis: raw.rankAxis,
    // A legacy three-axis deity has no law axis. The event embed path defaults
    // the absent value to neutral, so old definitions remain deterministic.
    lawAxis: raw.lawAxis,
    ...(raw.domain ? { domain: raw.domain } : {}),
  };
}

/**
 * The bounded record `deitySnapshotFrom` builds and the living world persists.
 * Every field is `unknown` because the builder copies the authored record's own
 * fields verbatim — the same read-back shape worldPulse/martialReadiness.js
 * declares for a religion state.
 * @typedef {{ name?: unknown, alignmentAxis?: unknown, temperamentAxis?: unknown, rankAxis?: unknown, lawAxis?: unknown, domain?: unknown }} DeitySnapshot
 */
/** @typedef {{ worldState?: { religionStates?: Record<string, { deities?: Record<string, { snapshot?: DeitySnapshot, share?: unknown }> }> } }} CampaignLike */

/**
 * The faiths a settlement's own campaign world record still carries, newest
 * standing first. This is the read half of the RESTORE-FROM-WORLD lane (R-5b
 * item 13b): a patron the living world converted away is no longer reachable
 * through the authoring pickers, because those list custom-authored deities
 * only, and the ousted god may be a pool-seeded or foreign-account deity that
 * this account's registry cannot resolve. Its surviving record is the campaign's
 * own `worldState.religionStates[saveId].deities` entry, which the pulse
 * materializes and persists.
 *
 * Returns each entry's STATE KEY verbatim alongside its snapshot. The key is the
 * deity's established identity — the pantheon ledger and the religion state both
 * key by it — so a restore must dispatch it as-is and never re-mint, or the
 * deity forks into a duplicate pantheon entry.
 *
 * Pure and store-blind: it takes the plain campaigns array and a save id, so the
 * store intent path and the assignment panel share one reading. A standalone
 * (non-campaign) settlement has no record and yields an empty list.
 *
 * @param {unknown} campaigns  the store's campaigns array
 * @param {unknown} saveId     the settlement's save id (the religionStates key)
 * @returns {Array<{ deityRef: string, snapshot: DeitySnapshot }>}
 */
export function worldFaithsForSave(campaigns, saveId) {
  const sid = saveId == null ? '' : String(saveId);
  if (!sid || !Array.isArray(campaigns)) return [];
  for (const campaign of campaigns) {
    const record = /** @type {CampaignLike} */ (campaign)?.worldState?.religionStates?.[sid];
    const deities = record && typeof record.deities === 'object' && record.deities ? record.deities : null;
    if (!deities) continue;
    return Object.keys(deities)
      .filter((ref) => ref && deities[ref]?.snapshot?.name)
      .map((ref) => ({ deityRef: String(ref), snapshot: /** @type {DeitySnapshot} */ (deities[ref].snapshot), share: Number(deities[ref].share) || 0 }))
      // Strongest standing first, then codepoint on the key — a total order, so
      // the offered list is identical for the same world every time.
      .sort((a, b) => (b.share - a.share) || (a.deityRef < b.deityRef ? -1 : a.deityRef > b.deityRef ? 1 : 0))
      .map(({ deityRef, snapshot }) => ({ deityRef, snapshot }));
  }
  return [];
}
