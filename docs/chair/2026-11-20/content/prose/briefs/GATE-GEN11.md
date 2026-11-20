# GATE-GEN11 — the Outlook verdict draws only on a real critical count (PROSE-2's builder brief; ONE CONDITION)

Written by PROSE-2, 2026-11-20, on the chair's ruling of 17:59 UTC (a re-decision of a ruled design, made by the chair under the owner's standing deferral, vetoable by the owner). You build in YOUR OWN worktree on a branch of your own cut from `lane/prose-2-2026-11-20` at the commit PROSE-2 names in your prompt; run `npm ci` there first (dependencies and hooks); commit by explicit paths with the hooks; never push.

## THE GROUND (measured: `map/GEN11-108.md` at 1b5918ce2 on `lane/prose-1-2026-11-20`)
DS-GEN-11's contradiction pool ("A handful of things about this place cannot all be true at once…") draws at 108 of 300 places. 97 of them hold NO critical issue: they draw because the receipt's `record_coherence_battery` judgment is `needs_review`, and that battery's findings there are the page's own wording against its record ("walls" where there are none, "soldiers" with no garrison, a size noun for the wrong size). 11 hold a real critical count (food).

## THE CHANGE (files you own: `src/domain/display/stateProse/generalStateProse.js`, `tests/domain/generalStateProseDesk.test.js`; nothing else)
1. `generalStateProse.js :: criticalIssuePoolKey(count, recordClean)`: the contradiction pool is chosen ONLY when `count > 0`. A count of zero returns `null` WHATEVER `recordClean` reads. The non-number arm stays (`null`). The function's `CORPUS['DS-GEN-11'].pools[key] ? key : null` guard stays.
2. The parameter `recordClean` STAYS in the signature, documented in the function's note as NO LONGER ROUTING (the cause: the chair's ruling of 2026-11-20 17:59 UTC; the measure above; the battery's verdict stays on the receipt, only the page's verdict line goes quiet). Rewrite the note's paragraph "THE ZERO POOL VOUCHES…" so it no longer says a contradicted judgment takes the contradiction pool; keep its history (lane SELF-VOUCH, 2026-11-04; STYLE-2, 2026-11-09) as history. Cite by symbol, never by line.
3. NO DELETION this unit: `src/components/new/generalDeskRead.js :: recordCleanOf`, its by-design arm and `tests/lint/presumedThings.shared.mjs`'s row naming it are NOT touched (they are PROSE-2's queued item with its own cause). If eslint or a type config reds on the now-unread parameter, STOP and report the exact message: do not rename it, do not delete it, do not add a disable comment.

## RED FIRST
In the DS-GEN-11 test of `tests/domain/generalStateProseDesk.test.js`, BEFORE changing the source:
- flip the pin `expect(criticalIssuePoolKey(0, false)).toBe('criticalIssueCount: critical contradictions on the record')` to `.toBeNull()`, with the cause in the test's own comment (a judgment that found only the page's own wording is not a contradiction on the record; the chair, 2026-11-20 17:59 UTC; 97 of 108 places measured);
- add: `criticalIssuePoolKey(1, false)` and `criticalIssuePoolKey(1, undefined)` still give the contradiction pool (a real food contradiction still prints);
- run that test file alone: RED on exactly the flipped pin (record its title and failing assertion). Then the source change; the file GREEN.
Then one place-level proof in the same file, red first the same way: a record whose `economicViability.metrics.criticalIssueCount` is 0 and whose `generationCoherenceReceipt.judgments` holds `{ id: 'record_coherence_battery', status: 'needs_review' }` composes NO DS-GEN-11 line; the same record with a count of 1 composes the contradiction line. Use whatever composing entry the file already uses for DS-GEN-11 readings (find it in the file; do not invent a harness). If the file has no such entry, say so and keep only the key-level pins.

## THE GATES (each to a file through `sh scripts/gate-tail.sh <command>`, read by its count lines; never through a pipe; never the whole suite)
`npx vitest run tests/domain/generalStateProseDesk.test.js tests/display/coherenceLineByDesignRead.test.js`; every other test file that names `criticalIssuePoolKey`, `DS-GEN-11` or `criticalIssueCount` (find them with a search; list them); `npx vitest run tests/lint` WHOLE (in a fresh worktree first: `git fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08`); `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. A red that is not yours: report it by name with the same red at the base, never cure it.

## REPORT
`docs/chair/2026-11-20/content/prose/GATE-GEN11-REPORT.md`: the commit; the red (title, assertion) and the green; every gate's count line and exit; the test files found by the search; executed vs inferred. Final message at most 150 words.
