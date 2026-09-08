# Brief — §913 car 12 (lane L-MAT-FIX): three em dashes leave three string literals in densityCreateBoundary.js

Seat: Opus 5 — implementer. The chair (Fable) rules; you measure and build. Receipt first, then the car. Receipt path: `$SC/receipt-913-car12.md` where `$SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad`.

## Where
- Dock: `$SC/laneLMAT` (detached-HEAD worktree; tip 908665aaf = sixteen cars over the product 3b1c0eaa5; porcelain 0). `git log --format='%h %s' -3` first and record the tip. Never touch `/Users/cstokes/Desktop/settlement-engine` (its src is frozen) and never enter any other dock.

## The red you are curing (measured by the chair; `$SC/gate-913.log` line 402–409 and `$SC/voice-913.log`)
The composed-tip gate `npm run check` reds at `test:ratchet`: "BANKED-ROW MAGNITUDE REFUSED — a permitted red may not GROW". The banked row is `tests/copy/voiceMechanics.test.js :: E2 … per-file debt exactly matches the baseline`; its measure `[files-over-baseline]` reads 3 against a frozen ceiling of 2. The focused run names the third file: `src/domain/density/densityCreateBoundary.js: baseline em:0 bang:0 → current em:3 bang:0`. The two others (labelBands.js +5, generalStateProse.js +3) are pre-existing and banked; yours is the consist's. The E2 walker scans STRING LITERALS in src/data and src/domain (comments are not counted) for em dashes (—) and exclamation marks. THE CEILING CANNOT BE RAISED; the cure is to cut the population: the three em dashes inside string literals that the consist added to that file.

## What to change
1. Read `src/domain/density/densityCreateBoundary.js` whole at the tip. Find every em dash (—) inside a string literal (the consist added three, in the concatenated `why`-style strings — around the lines that read `'state.config — the Library\'s "Apply Saved Configuration & Regenerate" runs '`, `'updateConfig admits the whole underscore family by prefix — so what keeps this '`, and `'emitted dist file changing SIZE (658 of 1,377 changed BYTES — the entry chunk\'s hash '`). Verify by measurement, not by this list: `node -e` a small scan or read the test's `stringLiteralContents` in `tests/copy/voiceMechanics.test.js` and reuse its idiom; count must be 3 before and 0 after.
2. Rewrite each string WITHOUT the em dash and without changing its meaning or any figure: a colon, a comma, a semicolon, a full stop and a new sentence, or a parenthesis — whichever reads best. Do not add an exclamation mark, do not add digits, do not shorten a factual claim. Comments may keep their dashes (not counted) — leave comments alone.
3. Measure (paste every tail verbatim into the receipt; before EVERY vitest run: `ls $SC/HOLD-VITEST` may exist — you are EXEMPT for the focused runs below only — and the split-pattern runner count must be 0: `V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l`):
   a. `npx vitest run tests/copy/voiceMechanics.test.js` → the E2 per-file arm STILL fails (it is banked — labelBands.js and generalStateProse.js remain), but its message must list exactly TWO files over baseline and no longer name densityCreateBoundary.js. Paste the three "baseline em… → current em…" lines.
   b. Every test that imports or reads `densityCreateBoundary.js` — find them: `grep -rlE "densityCreateBoundary" tests/ | sort` — run each ONE AT A TIME; all green. If any arm asserts the exact text of a `why` string you changed, update THAT ASSERTION to the new text in the same car and say so (the receipt for the L-MAT consist recorded that the create-boundary walker length-checks `why` and does not read its content; verify that claim on the arm and record what you found).
   c. `node scripts/check-test-ratchet.mjs` is NOT yours to run (it holds the gate mutex); the chair re-runs the ratchet and the gate.
4. Fences: change ONLY `src/domain/density/densityCreateBoundary.js` and, if 3b demands it, the one test file asserting the changed text. No comment edits, no other file, no register, no baseline, no `--update`, no `--write`.
5. Commit ONE car: explicit staging (`git add src/domain/density/densityCreateBoundary.js [the test]`), porcelain 0 and zero untracked after; no push, stash, rebase, amend. Subject: `§913 car 12: three em dashes leave three why-strings in densityCreateBoundary.js — the Tier-2 voice ratchet's per-file debt returns to its banked ceiling`. Body: the red (measure 3 > ceiling 2; the file's em 0 → 3), what changed (the three strings, quoted before and after), the measurements (a and b, verbatim), the receipt path. Trailers exactly:
```
Seat: Opus 5 — Fable-unvalidated
Lane: L-MAT-FIX
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
6. Return: the car sha, the three strings before/after, the E2 arm's three per-file lines after, the list of tests run with their pass counts, the receipt path, anything you could not do.
