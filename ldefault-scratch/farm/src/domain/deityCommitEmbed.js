/**
 * domain/deityCommitEmbed.js — THE EMBED ROSTER AND THE COMMIT-TIME BUILDER, split out
 * of `deitySnapshot.js` so the eager mutation router can persist an embed without
 * loading the read side (SUBSTRATE coupling wave 6, REC-2; the same WAVE-D idiom
 * `faithChannelBindings.js` carries one directory over).
 *
 * ⭐⭐ WHY THIS FILE EXISTS, AND IT IS A MEASUREMENT RATHER THAN A PREFERENCE.
 * `events/mutateEntities.js` is EAGER — `events/mutate.js`'s MUTATION_HANDLERS table is
 * reached statically from the store — and it imports exactly ONE name from
 * `deitySnapshot.js`: `commitDeityEmbed`. That edge put the whole snapshot module in the
 * first-paint closure, including `deitySnapshotFrom` and `worldFaithsForSave`, which are
 * the AUTHORING and RESTORE paths and are reached only from lazy surfaces (the deity
 * assignment panel, the event composer, the store's settlement helpers).
 *
 * ⛔ AND NO CHUNK PIN CAN CURE THAT — wave 5 measured the attempt on the sibling seam
 * and it made the closure 291 B WORSE, because an eager importer re-parents its own
 * "lazy" chunk (FP-G17). The only cure for a genuinely-eager static edge is to MOVE THE
 * FUNCTION, NOT THE CHUNK PIN. Measured on this split alone: 1,047,050 → 1,046,397 B.
 *
 * ⛔⛔ THE INVARIANT IS **ZERO IMPORTS**, exactly as for the faith binding leaf: the
 * moment this file imports anything, that thing becomes first-paint weight again and the
 * cure unwinds with every test still green.
 *
 * NOTHING HERE IS NEW — the three declarations moved verbatim, same bodies, same
 * comments. `deitySnapshot.js` imports the picker back for `deitySnapshotFrom`, which is
 * the direction that costs nothing: the read side may load the commit side, the eager
 * commit side must never load the read side.
 *
 * ⚠ THE THREE NAMES ARE **NOT** RE-EXPORTED FROM `deitySnapshot.js`, deliberately and
 * unlike REC-1's faith leaf. `deityTemperConsumerCensus.walker.test.js` asserts that
 * EXACTLY ONE src module names `DEITY_AUTHORED_CHARACTER_KEYS` — the drift habitat F3c
 * removed — and a re-export line would be a second naming. So the consumers follow the
 * symbol to its one home (the §870.4 law: the packet pin follows the symbol), and this
 * file is now the address the census means.
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
