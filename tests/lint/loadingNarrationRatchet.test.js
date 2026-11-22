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
 * ⛔ COUNTING RULES — AMENDED 2026-09-20 BY FIX-T2. THE COUNTERS READ CODE, NOT PROSE.
 * This file used to say the opposite: "occurrence counts over source text, COMMENT lines
 * included by design — the pin is a debt meter, not a semantic analyzer". That rule was
 * wrong in a way that cost a lane a whole cycle. What these two arms measure is a
 * RENDERED debt: a confession a reader actually sees, and a boundary that actually paints
 * nothing. A comment renders nothing, so a comment can neither add to the debt nor pay it
 * — yet under the old rule an author who merely NAMED `fallback={null}` while explaining
 * why a boundary was left silent pushed the count past the pin and reddened the gate
 * (FIX-P3, 2026-09-20). A debt meter that convicts the sentence describing the debt
 * teaches authors to stop writing the sentence, which is the opposite of the vigilance
 * this ratchet exists to replace.
 *
 * So both counters now read `commentsOnly(source)` from tests/helpers/codeOnlySource.js.
 * ⛔ IT MUST BE `commentsOnly`, NEVER THE SIBLING `codeOnly`: `codeOnly` blanks string and
 * template CONTENTS too, and BOTH of these patterns live inside literals — `['"`>]Loading`
 * matches a string or JSX-text prefix, and `fallback={null}` is JSX. Reaching for the more
 * familiar strip would blank exactly the evidence and leave both arms vacuously at zero,
 * which the BELOW arm would then invite you to bank as a win.
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

// `codeOnly` is imported ONLY for the guard-the-guard arm that pins it as the WRONG tool
// here; the live counters must never use it. See the COUNTING RULES above.
import { codeOnly, commentsOnly } from '../helpers/codeOnlySource.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Bare loading confessions in user-facing component source (src/components):
// a string/JSX text beginning with the word "Loading".
// LOWERED 34 → 33 on 2026-08-10 by the step-15 ratchet reconciliation: the debt
// had fallen to 33 and the pin's own BELOW arm demands the win be locked, or a
// stale higher ceiling would silently let the confession regrow.
// LOWERED 33 → 32 on 2026-08-29 by TE-STRIP-1: the legacy settlement map's UI left the
// product, and PublicDossierView's `Loading map...` Suspense fallback went with it. A
// removal is a win the BELOW arm exists to make you bank, so it is banked here.
// LOWERED 32 → 29 on 2026-09-20 by FIX-T2: 3 of the 32 lived in COMMENTS and rendered
// nothing — GalleryTopbar.jsx:81 (a header sentence describing the transition away from
// the confession), RealmUnfurlLoading.jsx:22 and WorldMapStage.jsx:285 (each naming the
// a11y floor it deliberately leaves alone). Three sentences ABOUT the debt were being
// counted AS the debt. The counter reads code only now, so 29 is the honest rendered
// figure and the BELOW arm banks it rather than leaving 3 units of phantom headroom a
// real new confession could hide in.
const BARE_LOADING_PIN = 29;
// Silent Suspense boundaries across src/ — each renders NOTHING while a lazy
// chunk loads. Existing ones are deliberate imperceptible overlay seams;
// new perceptible boundaries must narrate instead.
// LOWERED 40 → 38 on 2026-08-29 by TE-STRIP-1: two silent boundaries left with the legacy
// settlement map — SettlementDossierHero's LIVING BACKDROP boundary and the fog chrome's
// player-view boundary inside the removed src/components/townMap/ subtree.
// LOWERED 38 → 37 on 2026-09-20 by FIX-T2: 1 of the 38 lived in a COMMENT and painted
// nothing — TurnstileGate.jsx:12, whose header draws the very boundary it is explaining.
// This is the exact match that reddened FIX-P3's gate and cost that lane a cycle.
const NULL_FALLBACK_PIN = 37;

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

/** Comments blanked, every literal's text intact — see this file's COUNTING RULES. */
const readCode = (p) => commentsOnly(readFileSync(p, 'utf-8'));

const count = (files, mkRe) => files.reduce((n, p) => {
  const m = readCode(p).match(mkRe());
  return n + (m ? m.length : 0);
}, 0);

/**
 * ⭐ THE FIXTURE IS INLINE — a string constant in this file, not a new file anywhere. It is
 * one line per shape the strip has to get right, and the two arms below assert the RAW and
 * the CODE-ONLY count of each pattern over it. Read together they pin the cure in both
 * directions at once: comments must stop counting, and literals must keep counting. The
 * second direction is the one that matters most, because the cheapest wrong cure —
 * reaching for the sibling `codeOnly` — drives both live arms to 0 and looks like a
 * spectacular win right up until a real confession ships unseen.
 */
const STRIP_FIXTURE = [
  "// a line comment naming 'Loading' and fallback={null}",
  '/* a block comment naming "Loading" and fallback={null} */',
  'const jsx = <Suspense fallback={null}>{/* naming >Loading and fallback={null} */}</Suspense>;',
  "const s = 'Loading the archive';",
  'const t = `Loading ${name}`;',
  'const re = /x"Loading/.test(s);',
  "const url = 'https://example.test/x'; // >Loading here",
  'return <span>Loading…</span>;',
  'const el = <Foo {...props} />; // fallback={null} in prose',
  'const gt = />/.test(s); // >Loading in prose',
].join('\n');

const countIn = (text, mkRe) => (text.match(mkRe()) ?? []).length;

describe('witnessed-wait ratchet — the strip counts code, never prose', () => {
  test('the fixture carries every shape, and RAW text counts all of them', () => {
    // If these raw figures move, the fixture was edited and the arm below is measuring a
    // different question than the one it was written to answer.
    expect(countIn(STRIP_FIXTURE, bareLoadingRe)).toBe(9);
    expect(countIn(STRIP_FIXTURE, nullFallbackRe)).toBe(5);
  });

  test('comments stop counting and literals keep counting', () => {
    const code = commentsOnly(STRIP_FIXTURE);
    // Survivors, one per literal kind: a single-quoted string, a template, a REGEX body
    // (whose `"` must not be read as a string opener), and bare JSX text.
    expect(countIn(code, bareLoadingRe)).toBe(4);
    // The one real `fallback={null}` prop; its echo inside the JSX comment beside it goes.
    expect(countIn(code, nullFallbackRe)).toBe(1);
  });

  test('the strip preserves offsets, so a match is at its true address', () => {
    const code = commentsOnly(STRIP_FIXTURE);
    expect(code.length).toBe(STRIP_FIXTURE.length);
    expect(code.split('\n').length).toBe(STRIP_FIXTURE.split('\n').length);
    // The JSX prop on line 3 is untouched at its own offset; the comment after it is gone.
    const line3 = code.split('\n')[2];
    expect(line3.includes('<Suspense fallback={null}>')).toBe(true);
    expect(line3.includes('naming >Loading')).toBe(false);
  });

  test('the sibling strip would empty both arms — the wrong tool, pinned as wrong', () => {
    // codeOnly blanks string and template CONTENTS. This arm exists so that swapping the
    // import for the more familiar helper fails loudly here instead of silently at zero.
    const blanked = codeOnly(STRIP_FIXTURE);
    expect(countIn(blanked, bareLoadingRe)).toBe(1);
    expect(countIn(blanked, nullFallbackRe)).toBe(1);
  });
});

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
