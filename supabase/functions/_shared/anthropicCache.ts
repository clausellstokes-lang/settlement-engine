/**
 * _shared/anthropicCache.ts - the Anthropic prompt-cache seam for the SURVEYOR family
 * (wave L-4 of docs/DESIGN_AI_CAPABILITY_LADDER.md).
 *
 * ORIGIN: generate-narrative/promptCache.ts is the one working cache implementation in
 * this repo, and this module is its generalization. That module stays where it is: it
 * carries an OpenAI arm (stripCacheBreakpoint) that the Surveyor surfaces have no
 * provider for, and it is pinned by its own Deno test. UNIFYING the two into one seam
 * (this file re-exported by generate-narrative) is a DELIBERATE DEFERRAL, recorded here
 * rather than half-done: it would touch the narrative money path, which is a separate
 * lane. The two marker literals are intentionally the SAME string, so a future
 * unification is a delete-and-re-export, never a prompt-bytes change.
 *
 * WHAT THIS IS FOR. Each Surveyor surface builds a documented BYTE-STABLE static prefix
 * (its charter, its vocabulary, its output contract) and then appends a per-request tail.
 * Anthropic prices a repeated prefix once when the request marks it with cache_control,
 * so the split is worth real money on a surface a user hits repeatedly.
 *
 * THE FLOOR IS REAL, AND FALLING BELOW IT IS SILENT. Anthropic caches a prefix only when
 * it meets the model's minimum cacheable size: 4096 tokens on the Opus and Haiku classes
 * this repo talks to (2048 on Sonnet - we size against the HIGHER floor so one prefix is
 * correct for every model the ladder may resolve). A prefix under that floor is not an
 * error: the request succeeds, cache_control is accepted and IGNORED, and full input is
 * billed on every call. This repo has been bitten by exactly that (the pricing lane's
 * prompt cache was a no-op under the 4096-token prefix floor until it was padded), which
 * is why padPrefixToFloor exists and why the floor is an EXECUTED assertion in the pins
 * rather than a comment anyone can drift away from.
 *
 * THE TOKEN ESTIMATE is chars/4, the same heuristic the narrative lane and the charter
 * builder use. It UNDER-counts vocabulary-dense text (JSON-ish key lists tokenize denser
 * than prose), so the true token count is at or above the estimate - the error runs in
 * the safe direction for a floor test. It is a SIZING number, never a billing number.
 *
 * Pure: no Deno globals, no network, no remote imports, no clock, no rng. Imported by
 * BOTH the edge shells and the vitest/Deno pins.
 */

/**
 * The cache breakpoint marker. Prefix builders (and ONLY prefix builders) inject it at
 * the static/dynamic boundary; splitForAnthropic consumes it. Byte-identical to
 * generate-narrative/promptCache.ts's CACHE_BREAKPOINT by design (see ORIGIN above).
 */
export const CACHE_MARKER = '<<CACHE>>';

/** The provider's minimum cacheable prefix size, in estimated tokens. Below this,
 *  cache_control is accepted and silently does nothing. */
export const CACHE_MIN_PREFIX_TOKENS = 4096;

/** What padPrefixToFloor pads UP TO: margin above the floor, so the chars/4 estimate
 *  being a few percent off cannot drop a padded prefix back under 4096. */
export const CACHE_PAD_TARGET_TOKENS = 4400;

/** The filler sentence. DETERMINISTIC and content-neutral: it carries no world data, so
 *  it cannot touch the finite-semantics truth surface, and it is clearly labelled so the
 *  model reads it as furniture. Byte-stable across requests, which is the whole point -
 *  a filler that varied per request would break the prefix match it exists to enable. */
const CACHE_PAD_SENTENCE =
  'Ignore this line; it is content-neutral filler present only to keep the cached prompt prefix at a stable, cacheable size. ';
const CACHE_PAD_OPEN = '\n\n[CACHE-STABILIZER: ignore this block; it carries no world data]\n';
const CACHE_PAD_CLOSE = '\n[END CACHE-STABILIZER]';

/** One Anthropic content block. The leading block carries cache_control; the tail does not. */
export type AnthropicTextBlock = {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
};

/** Estimate a text's token cost (chars/4). A SIZING number, never a billing number. */
export function estimateTokens(text: string): number {
  return Math.ceil(String(text ?? '').length / 4);
}

/**
 * Remove every marker occurrence, to a FIXPOINT. A single split/join pass can reconstruct
 * a live marker out of the fragments around a removed one, so the loop runs until the text
 * stops changing (the same discipline the cores' fence strippers use). Applied to any text
 * that reaches a prefix builder from outside, so the ONE marker in a built prompt is always
 * the one the prefix builder injected.
 */
export function stripCacheMarker(text: string): string {
  let out = String(text ?? '');
  let prev: string;
  do {
    prev = out;
    out = out.split(CACHE_MARKER).join('');
  } while (out !== prev);
  return out;
}

/**
 * Pad a static prefix up to the cacheable floor, deterministically. Returns the prefix
 * UNCHANGED when it already clears CACHE_MIN_PREFIX_TOKENS - which is the point of the
 * charter: a surface whose charter is big enough pays no padding at all. Pure: the same
 * prefix yields the same bytes in every process.
 */
export function padPrefixToFloor(prefix: string): string {
  const text = String(prefix ?? '');
  const estTokens = estimateTokens(text);
  if (estTokens >= CACHE_MIN_PREFIX_TOKENS) return text;
  const neededChars = (CACHE_PAD_TARGET_TOKENS - estTokens) * 4;
  const reps = Math.max(1, Math.ceil(neededChars / CACHE_PAD_SENTENCE.length));
  return `${text}${CACHE_PAD_OPEN}${CACHE_PAD_SENTENCE.repeat(reps)}${CACHE_PAD_CLOSE}`;
}

/** What may ride BEHIND the padding, between the padded body and the marker. */
export interface SealOptions {
  /**
   * Text placed AFTER the stabilizer padding and IMMEDIATELY before the marker. For the
   * per-user part of a prefix - today, the coaching block - which must be the last thing
   * the model reads before the cached region ends.
   */
  tail?: string;
}

/**
 * SEAL a static prefix: strip any marker that arrived inside client-posted vocabulary
 * text, pad to the cacheable floor, append the optional tail, then append the marker. The
 * single entry point every Surveyor static-prefix builder ends with, so "the prefix carries
 * exactly one marker, at its very end" is true by construction rather than by convention.
 *
 * WHY THE TAIL IS A PARAMETER RATHER THAN JUST MORE BODY. Padding is APPENDED, so anything
 * folded into `prefix` sits AHEAD of the filler. A caller that concatenated its coaching
 * onto the body got, on every padded surface, coaching followed by several thousand
 * characters of "[CACHE-STABILIZER: ignore this block]" and only then the boundary -
 * measured at 7,409 / 7,897 / 8,629 / 9,605 / 1,797 characters of filler on construct,
 * construct-realm, interpret, style-overhaul and a small-vocabulary autonomy respectively.
 * The block was still present and still after the output contract, so an ordering assertion
 * saw nothing; the model, reading the most recently mentioned instructions last, saw
 * furniture. The tail parameter makes "last before the marker" a property of the seal
 * instead of a hope about the caller's concatenation order.
 *
 * THE FLOOR IS MEASURED ON THE BODY, NOT ON BODY-PLUS-TAIL, deliberately. The tail is
 * OPTIONAL and per-user: the same surface serves managed-key users whose tail is ''. Sizing
 * the padding against a tail that is usually absent would drop precisely those users' sealed
 * prefixes back under the 4096-token floor, where cache_control is accepted and silently
 * ignored. Padding the body alone means every user clears the floor and a coached user
 * simply clears it by a little more.
 *
 * The tail is marker-stripped like the body, so exactly-one-marker survives a tail that
 * somehow carried one.
 */
export function sealStaticPrefix(prefix: string, options: SealOptions = {}): string {
  const body = padPrefixToFloor(stripCacheMarker(prefix));
  const tail = stripCacheMarker(options?.tail ?? '');
  return `${body}${tail}${CACHE_MARKER}`;
}

/**
 * Build the Anthropic user-message content from a prompt that MAY carry a marker. With
 * the marker: two text blocks, the leading (stable) one flagged cache_control. Without
 * it: the bare string. In BOTH cases the text the model sees equals the prompt with the
 * FIRST marker removed - no content is added or dropped.
 *
 * The split takes the FIRST occurrence, matching promptCache.ts. That is what makes a
 * marker literal inside USER content harmless: the prefix builder's marker always comes
 * first, so user text can never move the breakpoint earlier and shrink the cached prefix.
 * The cores strip the marker out of user text as well (belt and suspenders), so in
 * practice the built prompt carries exactly one.
 */
export function splitForAnthropic(prompt: string): string | AnthropicTextBlock[] {
  const text = String(prompt ?? '');
  const idx = text.indexOf(CACHE_MARKER);
  if (idx === -1) return text;
  const prefix = text.slice(0, idx);
  const rest = text.slice(idx + CACHE_MARKER.length);
  // A degenerate empty prefix cannot be cached and is not a valid block - fall back.
  if (!prefix) return rest;
  return [
    { type: 'text', text: prefix, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: rest },
  ];
}
