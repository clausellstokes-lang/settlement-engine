/**
 * tests/lint/loadingNarrationRatchet.test.js — the WITNESSED-WAIT ratchet
 * (C3-experience findings 4 + 6, bar-5 "waiting becomes witnessing" / bar-18
 * fiction continuity).
 *
 * The main generation wait is a narrated film, but secondary waits can still
 * ship as bare "Loading…" confessions or silent `fallback={null}` boundaries —
 * and before this ratchet NOTHING reddened when a new one appeared: witnessing
 * survived only by author vigilance. This pins the two debts and makes them
 * monotone, sizeBaseline-style:
 *
 *   • ABOVE the pin fails — a new bare "Loading…" literal (narrate the wait in
 *     the world's voice instead: "Opening the settlement archive…", "Unfurling
 *     the shared maps…", "Catching the realm up…") or a new silent Suspense
 *     boundary (give perceptible boundaries a narrated fallback; only genuinely
 *     imperceptible overlay seams may stay null — and those should not be
 *     multiplying).
 *   • BELOW the pin fails too — lower the pin to the printed count so the win
 *     is locked (a stale higher pin would let the debt quietly regrow).
 *
 * Counting rules (deepCraftKillList precedent): occurrence counts over source
 * text, COMMENT lines included by design — the pin is a debt meter, not a
 * semantic analyzer; lower it when a comment edit drops a match.
 *
 * CANNOT-CATCH: un-narrated awaits with no Suspense boundary at all; spinner-
 * only fallbacks with no text; synonym confessions ("Please wait…",
 * "Fetching…"); fallback elements hoisted into variables before being passed.
 * Residual: the bar-5/bar-18 experience review cadence owns those shapes.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Bare loading confessions in user-facing component source (src/components):
// a string/JSX text beginning with the word "Loading".
const BARE_LOADING_PIN = 34;
// Silent Suspense boundaries across src/ — each renders NOTHING while a lazy
// chunk loads. Existing ones are deliberate imperceptible overlay seams;
// new perceptible boundaries must narrate instead.
const NULL_FALLBACK_PIN = 40;

const bareLoadingRe = () => /['"`>]Loading\b/g;
const nullFallbackRe = () => /fallback=\{null\}/g;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

const count = (files, mkRe) => files.reduce((n, p) => {
  const m = readFileSync(p, 'utf-8').match(mkRe());
  return n + (m ? m.length : 0);
}, 0);

describe('witnessed-wait ratchet — bare loading + silent boundaries are pinned debts', () => {
  test(`bare "Loading" literals in src/components stay at exactly ${BARE_LOADING_PIN}`, () => {
    const files = walk(join(ROOT, 'src/components'));
    const n = count(files, bareLoadingRe);
    expect(
      n,
      n > BARE_LOADING_PIN
        ? `a NEW bare "Loading…" confession appeared (${n} > ${BARE_LOADING_PIN}) — narrate the wait in the world's voice instead`
        : `bare-loading debt fell to ${n} — lower BARE_LOADING_PIN to lock the win`,
    ).toBe(BARE_LOADING_PIN);
  });

  test(`silent fallback={null} boundaries across src/ stay at exactly ${NULL_FALLBACK_PIN}`, () => {
    const files = walk(join(ROOT, 'src'));
    const n = count(files, nullFallbackRe);
    expect(
      n,
      n > NULL_FALLBACK_PIN
        ? `a NEW silent Suspense boundary appeared (${n} > ${NULL_FALLBACK_PIN}) — narrate it, or justify byte-for-byte why it is imperceptible`
        : `silent-boundary debt fell to ${n} — lower NULL_FALLBACK_PIN to lock the win`,
    ).toBe(NULL_FALLBACK_PIN);
  });
});
