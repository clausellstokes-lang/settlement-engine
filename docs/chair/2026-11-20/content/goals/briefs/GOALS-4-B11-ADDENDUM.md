# GOALS-4 · builder 11 · addendum: the chair's rulings of 21:30 UTC on the three STOPs

Written by GOALS-4 on 2026-11-20. You go on from `7b670cd8b` on `lane/goals-4-2026-11-20-b11`, in `/home/user/wt-b11`. The brief `GOALS-4-B11-CURE-BRIEF.md` stands where this file is silent. Its rules on worktree, mutex, commits, NOT YOUR FILES and never pushing all stand.

## (A) The temper is read from today's resolved index (APPROVED)

`drawTieProse` (`src/generators/power/relationshipArchetypes.js :: createTieProseDraw`) hands out, beside `proseVariant`, the index TODAY'S resolution chose, before any replacement. `src/generators/people/ties.js :: temperOfTie` reads that index, never the printed line's declaration.

Every stored field except the prose and the variant stays byte-equal: this is condition (a). If the resolved index is stored anywhere on the tie, that is a new field and a STOP. Hand it out only to the caller.

## (A2) THE REAL CURE, in the same unit: TIES-HOLD

THE LAW: within one place, no tie prints a tension or a description whose template (names masked) another tie of that place has already printed.

HOW:
- One ledger of printed templates per place, kept in the ties' own stable order.
- Where the drawn line is taken, the pick walks the archetype's pool in its keyed order from the drawn index. It takes the first line not yet taken that the trust clause and the line's own declarations allow. The trust clause is the corrected law: the same declared trust, or none.
- Then the reserve's lines, in the same way.
- Where everything is taken, the least printed line.

NO DRAW IS ADDED OR REMOVED. The two-tree proof (`docs/chair/2026-11-20/content/tools/confinement/trees.mjs`, base d874c81e9) shows 0 non-string differences. Strings may differ only in `relationships[]`'s description and tension, `proseVariant`, and their printed copies (name each).

Red first: a test of the law on a real corpus (150 a size, or the narrativeQualityCorpus cities and metropolises), red at 7b670cd8b. The existing "same-page repeats" test must go green with it.

MEASURE AND REPORT, at 150 a size, before (d874c81e9) and after:
- the places printing one tie template twice, by size; the target is 0 at every size;
- how often, by archetype and size, the pool AND the reserve are both exhausted. That list goes to the depth lane, whose 157 new pairs land after this, so write it as a file beside your report;
- every pin that moves, with its cause.

`tieReserveHead`'s trust pins move only by cause, under the corrected law (a no-trust replacement stands in for any trust). Condition (b) stands: a planted arm proves that a DIFFERENT declared trust is still refused, shown red with the clause removed.

## (B) The ledger with no door

The 26 reserve rows go into `docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json` BY A SCRIPT THAT READS THE DATA'S OWN DECLARATIONS for exactly those rows. No hand copying.

Keep the script beside your report, under `docs/chair/2026-11-20/content/goals/measures/b11/`, never under `src/`. The colourMarks4h test stays as written and goes green. List the 26 rows in your report, one line each: pool, index, declaration.

## (C) Both wordings APPROVED as offered (in `src/data/npcData.js`)

- mil_crim_corruption.tension#7: "Someone has started counting the coin in ${r.name}'s house against the household's known earnings. ${s.name} is watching the count."
- gov_econ_dependence.desc#1: "${s.name} holds the debts ${r.name} has run up, and so decides what may be spent."

Keep each line's object shape and its marks. The pronoun test goes green.

## Then

Green, each in its own log through the mutex:
- the named files of the brief, and the tie tests;
- tests/generators/people;
- typecheck:ratchet, typecheck:domain:strict, lint.

Update `GOALS-4-B11-REPORT.md` (≤300 words) and commit it. Return the same as your final message. Never push.
