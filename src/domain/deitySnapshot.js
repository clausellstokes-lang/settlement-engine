/**
 * Pure deity-snapshot authority.
 *
 * Assignment resolves authored content outside the simulation, then embeds this
 * bounded record so headless event, generation, and pulse consumers never read
 * the account library. Keeping the builder in domain lets both UI/store intent
 * paths and deterministic preview fixtures share one source without reversing
 * the engine's dependency direction.
 *
 * ⭐ THE EMBED IS WHAT THE ENGINE CAN SEE. F2c's provenance census measured that
 * TEN of the eleven `deityTemper` consumers read this record rather than a raw
 * authored definition, so a field the embed does not carry is structurally
 * invisible to the simulation however carefully it was authored. F3c carries
 * W-FAITH F1c's six authored-character fields across all FOUR writers in one act
 * (ODQ §866) — `DEITY_AUTHORED_CHARACTER_KEYS` below is that list, and
 * `tests/domain/deityEmbedWriterParity.test.js` holds the writers to it.
 */

/**
 * THE AUTHORED-CHARACTER KEYS (W-FAITH F1c's six fields, carried by F3c under
 * ODQ §866). Every one is CONDITIONAL, exactly as `domain` is: a deity that does
 * not carry the field mints no key, so every deity authored before F1c — which is
 * every deity that exists — produces a BYTE-IDENTICAL embed. That is the whole
 * safety argument for a persisted-shape change, and it is corpus-proven rather
 * than asserted.
 *
 * ⚠ `characterAxes` is `string-or-string-list` and is therefore the one key that
 * is NOT normalised through `String()` on the commit-time writers. Coercing a list
 * would silently join it (`['MERCY:virtue:marked','TRUST:vice:a_touch']` becomes
 * `'MERCY:virtue:marked,TRUST:vice:a_touch'`), and every downstream reader would
 * then split a token list out of one corrupt string. The write-time wall has
 * already closed the vocabulary, so the value travels verbatim.
 *
 * @type {readonly string[]}
 */
export const DEITY_AUTHORED_CHARACTER_KEYS = Object.freeze([
  'authoredTemper',
  'characterAxes',
  'boonChannel',
  'boonStrength',
  'baneChannel',
  'baneStrength',
]);

/**
 * THE ONE PICKER all four embed writers share.
 *
 * The writers' standing discipline is "re-pick the exact fields, never spread the
 * raw payload", and that is preserved here: this returns an object built from a
 * NAMED key list, so no wall-clock stamp or foreign field can ride in. What it
 * removes is the habitat of the bug the parity test was written for — four hand
 * copies of one growing key list, free to drift. A writer can now only be wrong by
 * failing to call this at all, which is a far louder mistake than omitting the
 * fourth of six keys.
 *
 * ⚠ VALUES TRAVEL VERBATIM — deliberately unlike `domain`'s `String()` on the
 * three commit-time writers. `characterAxes` may legally be a LIST, and `String()`
 * on a list joins it into one corrupt token; the five enum-valued siblings gain
 * nothing from coercion because their vocabularies are already closed at the
 * write-time wall, and every read-side seam is a set-membership test that refuses
 * a non-member rather than trusting its spelling. One rule for six keys beats five
 * coerced and one not.
 *
 * @param {Record<string, unknown> | null | undefined} raw an authored record or a
 *   persisted snapshot — both carry these keys under the same names
 * @returns {Record<string, unknown>} only the keys actually present, ready to spread
 */
export function authoredCharacterEmbedKeys(raw) {
  /** @type {Record<string, unknown>} */
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const key of DEITY_AUTHORED_CHARACTER_KEYS) {
    // Truthiness matches `domain`'s own long-standing guard: an absent field mints
    // no key, which is what keeps every legacy embed byte-identical.
    if (raw[key]) out[key] = raw[key];
  }
  return out;
}

/**
 * THE COMMIT-TIME EMBED, built once for all three writers that persist one.
 *
 * `setPrimaryDeity` (the DM assign), `imposeCult` (the DM cult) and
 * `reEmbedPrimaryDeity` (the organic conversion commit) previously each kept a hand
 * copy of this object literal. They had already drifted once — the conversion writer
 * silently dropped `lawAxis`, and T4 restored it — and F3c's six new keys would have
 * been three more chances to drift, so the copies are folded into one function here
 * instead. The writers keep their own ref RESOLUTION (they disagree about it
 * legitimately: the cult writer falls back through the snapshot's own identity), and
 * hand the resolved ref in.
 *
 * The discipline the writers were built on is unchanged and is the reason this takes
 * named fields rather than spreading `snapshot`: an unexpected field — especially a
 * wall-clock stamp — must never leak into a record a deriver reads.
 *
 * Defaults are the commit-time ones, and they differ from `deitySnapshotFrom`'s
 * deliberately: a persisted embed fills a legacy deity's absent axes with the
 * documented neutral values, so a stored record is always fully specified.
 *
 * `name` and `_deityRef` are typed as the STRINGS this function guarantees rather
 * than as `unknown`: both are coerced here, and callers legitimately hand them to
 * string-typed sinks (the cult writer's veto receipt is one). The authored axes stay
 * `unknown` because this builder copies them without inspecting them — the seams
 * that read them own their vocabularies.
 *
 * @param {string} ref  the resolved deity id — the writers own this decision
 * @param {Record<string, unknown>} snapshot  an authored record or a persisted one;
 *   every field is `unknown` because this builder copies rather than interprets
 * @returns {Readonly<{ _deityRef: string, name: string, alignmentAxis: unknown, temperamentAxis: unknown, rankAxis: unknown, lawAxis: unknown, domain?: unknown, authoredTemper?: unknown, characterAxes?: unknown, boonChannel?: unknown, boonStrength?: unknown, baneChannel?: unknown, baneStrength?: unknown }>} the frozen embed
 */
export function commitDeityEmbed(ref, snapshot) {
  return Object.freeze({
    _deityRef: ref,
    name: String(snapshot.name || ''),
    alignmentAxis: snapshot.alignmentAxis || 'neutral',
    temperamentAxis: snapshot.temperamentAxis || 'neutral',
    rankAxis: snapshot.rankAxis || 'minor',
    // lawAxis: a legacy 3-axis deity carries none ⇒ 'neutral', which reads chaos01
    // 0.5, the no-signal midpoint. This default is the one the conversion writer was
    // missing before T4 restored it; there is now one copy of it, so it cannot go
    // missing from one writer again.
    lawAxis: snapshot.lawAxis || 'neutral',
    ...(snapshot.domain ? { domain: String(snapshot.domain) } : {}),
    ...authoredCharacterEmbedKeys(snapshot),
  });
}

/**
 * Build the self-contained deity snapshot from an authored deity record.
 *
 * ⛔ THIS IS ALSO THE RESTORE PATH. `settlementDeityHelpers.js`'s
 * restore-from-world lane re-picks a persisted snapshot through this builder, so a
 * key carried by the three commit-time writers and NOT by this one is silently
 * stripped the moment a DM restores an ousted patron. That asymmetry is why the
 * carry lands atomically across all four writers, and why the sweep plants its
 * regression HERE rather than at a commit writer.
 *
 * @param {{
 *   name?:unknown,
 *   alignmentAxis?:unknown,
 *   temperamentAxis?:unknown,
 *   rankAxis?:unknown,
 *   lawAxis?:unknown,
 *   domain?:unknown,
 *   authoredTemper?:unknown,
 *   characterAxes?:unknown,
 *   boonChannel?:unknown,
 *   boonStrength?:unknown,
 *   baneChannel?:unknown,
 *   baneStrength?:unknown,
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
    ...authoredCharacterEmbedKeys(raw),
  };
}

/**
 * The bounded record `deitySnapshotFrom` builds and the living world persists.
 * Every field is `unknown` because the builder copies the authored record's own
 * fields verbatim — the same read-back shape worldPulse/martialReadiness.js
 * declares for a religion state.
 * @typedef {{ name?: unknown, alignmentAxis?: unknown, temperamentAxis?: unknown, rankAxis?: unknown, lawAxis?: unknown, domain?: unknown, authoredTemper?: unknown, characterAxes?: unknown, boonChannel?: unknown, boonStrength?: unknown, baneChannel?: unknown, baneStrength?: unknown }} DeitySnapshot
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
