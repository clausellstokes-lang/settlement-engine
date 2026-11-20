# FRAME-5 · brief C1 — the dealer's reason is never said to the DM (STORED, plus a render strip)

Written 2026-11-20T11:14Z (`date -u`) by FRAME-5 on `lane/frame-5-2026-11-20`. The chair's ruling (2026-11-20 10:58 UTC, FRAME-4-HANDBACK ruling 22; vetoable by the owner). Your prompt names this unit. Build it and nothing else.

**Read whole first, and it binds you:** the COMMON section of `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md`. That means its law 1 to 6, measure first, the proofs (a) to (d), gates, commit and final message, with every `frame4/` results path read as `frame5/` and the trailer's session line as your prompt gives it. Also read whole: `src/domain/crisis/crisisCast.js`, `crisisPage.js`, `crisisHooks.js`, `src/domain/summary/tonightSheet.js`, and every file you change.

## Why

The chair read a town forged in the running app. Its Crisis tab, and a hook on the Open Tonight sheet, printed "...; next in line, the first choice already holding a role that contradicts this one". That text is the DEALER'S reason: how the cast was dealt, not a fact of the town. The DM must never read it.

## What to build

1. **STORED.** `crisisCast.js :: take` no longer appends `; ${CAST_REASONS.nextInLine}`. The stored reason is the candidate's own reason, the fact alone. If the `nextInLine` entry has no other reader, it is deleted. If it does have one, say which.

   CONDITION, measured first: list every reader of the dealing today. That includes tests (`crisisCast.test.js` "…endsWith(CAST_REASONS.nextInLine)", `crisisCastReaderRows.test.js`), "How this was simulated", `castReasonSentence`'s kept tail, and any other you find by grep. Where a reader needs to know that the first choice was passed over, say what it reads and stop before deleting it. Otherwise the tail goes.

2. **RENDER STRIP.** A town saved before C1 keeps its stored string. So every surface that prints a cast reason strips the dealer's tail at render, by ONE exported function beside `castReasonSentence` (never a second copy of the string). Those surfaces are: the crisis page composition (Crisis tab, PDF via `crisisPrint`, Foundry journal), the crisis hooks, and the session sheet.

3. **THE CENSUS AND ITS GUARD.** Build a census of every cast-reason string a surface can print: the closed sets in `crisisCast.js`, `CAST_ABSENCES`, and any composed tail. Add a guard test that no printable reason carries a dealer's clause. It must be RED FIRST BY A PLANT: plant the tail in a stored row, record the red, then restore.

## Measure first (figures in your results file before any edit)

1. On B7's pool (`frame2/B7-CF10-PROPOSAL-RESULTS.md`'s `gen.mjs`) and the 525-row golden master: how many stored reasons carry the tail, by kind and role.
2. Every reader of the stored reason, by file and symbol.

## Proofs, beyond the common list

- A test on a STORED OLD ROW (a reason carrying the tail): every surface prints it without the tail.
- Every town whose cast took no second choice is byte-identical, both stored and composed, and so is every calm town.
- Every row that moves is named with before and after: the golden rows, `institutionBudgetPromise`, pinned-mode arms. Each is UNSIGNED. The line's known reds are listed in `FRAME4-BRIEFS-STORED.md` law 3; name any red of yours apart from them.
- For the security reader: a shared page withholds a cast entry whole (FRAME-3 ruling 16). Say whether that stays true.

Unit name: `C1`. Results: `docs/chair/2026-11-20/content/frame5/C1-DEALER-REASON-RESULTS.md`.
