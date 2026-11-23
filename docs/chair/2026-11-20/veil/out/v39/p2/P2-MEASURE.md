# V39-P2: the second red at the tip, measured (measure only, no cure), 2026-11-23 01:13 UTC

The test: `tests/lib/gallery.test.js` "a share marked with a veil renders through it: the defaults hide, a delta shows", red on line 620 (`availableServices.criminal` 0 rows, 1 wanted). Every run was that one file with `-t` on that title, in the detached scratch /home/user/wt/p2 (node_modules hardlinked from wt/lp; `package-lock.json` equal at every commit run). Logs: `logs/run-<commit>.txt`, 01:10 to 01:12 UTC.
History: the clone was shallow at 331f02749; `git fetch --deepen=150 origin lane/veil-33-2026-11-22` (01:11 UTC) reached past it. b983c16b6 is not in the fetched history; it was not run.

| commit | what | result |
|---|---|---|
| af708f2fd | the tip named by VEIL-38 | RED, line 620 |
| 331f02749 | shallow boundary, before the (viii) merge 929739889 | RED, line 620 |
| 66e43865d | merge of R3-TELL-5 units 0, 0b, (ii) | RED, line 620 |
| 334763133 | 66e43865d^1 | GREEN |
| 4ddf8c60c | R2 + R2-CURE (older) | GREEN |
| d6d8644b2 | side branch: unit (ii) RED test, before its cure | GREEN |
| 369331d72 | side branch: unit (ii) CURE | RED, line 620 |

(i) CONFIRMED. On the lane's first-parent history: last green 334763133, first red 66e43865d (the merge of R3-TELL-5 units 0, 0b and (ii)). Inside that merge: last green d6d8644b2, first red 369331d72, "fix(veil, R3-TELL-5 unit (ii) CURE): a criminal services row stays only by positive account, both engines".

(ii) CONFIRMED. The cause: `applyRosterChoices` in `src/domain/display/galleryRosterChoices.js` gained rule (e), BY POSITIVE ACCOUNT. A `svc.criminal` row now stays only when its `institution` names a house this read lists, or is a `SERVICE_TYPE_TAGS` tag of an accounted crime type. The fixture's one row has `institution: 'Black market'`. No house of that name is in the fixture (the read lists only 'Parish churches (10-30)'), and 'Black market' is not a tag, so the row leaves.

(iii) STALE PIN: CONFIRMED that the rule was moved on purpose, PLAUSIBLE that this is the whole story. The rule was moved by R3-TELL-5 unit (ii), under the chair's ruling 73 (2) and ruling 74 (ii) ("THE EMPTY ARRAYS TOGETHER: `svc.criminal`"). The fixture's row is exactly the class that cure removes: a criminal service that no served house or crisis accounts for. The delta still opens the block: the run shows `[]` (served, emptied), not an absent key. Only the unaccounted row is filtered out. The cure's only other change under src/ is two unread lines of the registry. The fixture predates the rule, and the merge message's re-runs name no run of this file. Not measured: a fixture whose 'Black market' house is listed. That probe would turn PLAUSIBLE into CONFIRMED, but it needs a test edit, which this unit does not permit.

The rivals:
- The chair's hypothesis, unit (viii) (c2625fb1f, in at 929739889): REFUTED, CONFIRMED. The test was already red at 331f02749 and at 66e43865d, both before 929739889. The fixture also carries no `crimeTypes`.
- R3-CURE-8's covert and keyless rows (merged at b9dc6c4e5): REFUTED, CONFIRMED. The test was green at 334763133, which is after b9dc6c4e5, and the fixture's row has an `institution` key that is not '(covert)'.
- R3-TELL-5 unit (ii): CONFIRMED as the cause.
- Units 0 and 0b: REFUTED, CONFIRMED. The test was green at d6d8644b2, which already contains them.

Not read: 212, the registry (the cure also changed 2 lines of `rosterChoiceRegistry.js`; unread, per the brief).
