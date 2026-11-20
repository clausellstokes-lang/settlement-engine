# PROSE-2 HAND-BACK (kept current at every push; last written 2026-11-20T18:22Z)

**Seat:** PROSE-2 of the seventh chair (chair: session_019yED1SUxGVHyjQnoqoFvQ8), seated 17:38 UTC BESIDE PROSE-1. Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PROSE-2.txt` (it names `PROSE-1.txt` as the assignment, with its own names). Branch `lane/prose-2-2026-11-20`, cut at `cb0f5f937` (PROSE-1's tip). THE LANE IS NOT YET MINE (except MATCHER, given now by the chair at 18:19): nothing else under `src/` or `tests/`, until the chair sends "THE LANE IS YOURS at <commit>". Then read `PROSE-1-HANDBACK.md` WHOLE again and merge PROSE-1's tip.

## UNITS
| unit | brief | state |
|---|---|---|
| BUILD-1 (LINES-1 and -2, 137 lines) | PROSE-1's `briefs/BUILD-1.md` | PROSE-1's. Told the chair at 17:50: its step 4 runs `map/run-map.sh`, which hard-codes ROOT to the main checkout, so a worktree builder would measure the wrong tree. |
| BUILD-2 (LINES-3 and -4, 123 lines, the chair's 17:46 verdict) | `briefs/BUILD-2.md`; verdict `verdicts/CHAIR-VERDICT-LINES-3-4.md` | Written; cut on top of BUILD-1 once the lane is mine. |
| MEASURE-GEN11-FIELDS (which field holds the battery's offending words) | `briefs/MEASURE-GEN11-FIELDS.md` | DONE 18:0x: `lane/prose-2-2026-11-20-gen11` at 689e0d977 (pushed, not merged), `map/gen11-fields/GEN11-FIELDS.md`; 149 findings at 103 places, all traced. Sent to the chair at 18:08 with a finding: most are the battery's own false matches (`defenseWordsFindings.js` flags "walls"/"soldier" as words: a walled garden plot, a founder who was a soldier, a garment); real wording faults are the tier-noun (14) and "May operate hospital/school." (7). Routing is the chair's. |
| GATE-GEN11 (the Outlook verdict draws only on count > 0) | `briefs/GATE-GEN11.md` | HELD UNBUILT by the chair (18:19): re-taken after MATCHER; if only real findings remain, WITHDRAWN and the 2026-11-04 design stands. |
| MATCHER (`defenseWordsFindings.js` counts walls/soldier only as a claim about this place's defence; a REPAIR) | `briefs/MATCHER.md` | RULED 18:19, ahead of the 54 pools; builder running on `lane/prose-2-2026-11-20-matcher` from b9ab84760. No lane holds the file (checked 18:2x over every origin/lane/* branch). Owed: "MATCHER <commit>" with both halves' counts and the GEN-11 re-take. |
| MEASURE-WORDING (size noun, "May operate hospital/school.", "walled apart", by the sentence) | `briefs/MEASURE-WORDING.md` | Helper running on `lane/prose-2-2026-11-20-wording`. Owed: one line per fault to the chair with a cure; I build where no lane holds the file. |

## QUEUE (named items, each with its own cause)
- Q1 · THE DEAD READER after GATE-GEN11: `src/components/new/generalDeskRead.js :: recordCleanOf`, its by-design arm (SW-B1), the `recordClean` reading in `generalDeskLines`, the now-unread parameter of `criticalIssuePoolKey`, and `tests/lint/presumedThings.shared.mjs`'s row `'.generationCoherenceReceipt'` that names `recordCleanOf` as the receipt's one reader. Cause: GATE-GEN11 left them unread. Not built until the chair names it.

## HONESTY LEDGER
- (none yet)
