# C2B-REPORT (V41-C2B, VEIL-41 chain C, C2-BUILD (a'); N49, with N53 and N54/N57)

Brief: d3559c7cd:docs/chair/2026-11-20/veil/out/v41/c2/C2B-BRIEF.md. Tree /home/user/wt/c2, branch
lane/veil-41-2026-11-23-c2-wip from 23bb8b8ae. Logs: /var/tmp/v18/out/v41/c2b/.

## WHAT WAS DONE (commit 1, 2707d6829: edits 1, 2, 3, 5, 6; this report, commit 2)
- 212 :: public._gallery_veil_withhold_always: `s := s - 'publicProse';` immediately before its final `return s;`, after
  24 `-- registry: prose.*` lines and an N49 (a') comment. The dead prose lines (the four minus_at ids, prose.criminal's
  `- 'defense:criminal'`, the incomeMix/criminalLine strip in _gallery_veil_apply) are untouched (`git diff` removes no line of 212).
- galleryWithholdAlways.js :: withholdAlways: `delete s.publicProse;` before its final `return s;`, the same 24 lines in
  the same order. galleryVeil.js :: dropVeiledPublicProse untouched.
- rosterChoiceRegistry.js: a helper `proseWhole` (rule withhold, when always, built true, H.sAlways / H.tAlways, no
  `inputs`, no `compose`; `path`, `writer`, `house`, `drawn`, `vr14`, `crimeOnly` kept); the former inputs and compose
  answer written into `scope` ("(a'), N49: withheld whole with publicProse on every shared read; under (b) composed from
  [...], <answer>; before (a'): <old scope>"). The 23 composed rows moved, and prose.incomeWeight by N53 (a) (its
  scope keeps ruling 6's words and adds its old host, _gallery_veil_apply / withholdCriminalIncome, unbuilt, and that (b)
  returns it to its inputs; vr14 'ii' kept, as the 23 kept theirs). prose.criminal LEFT (N53 (b)): host, when, built and
  its 212 / twin lines byte-stable; one sentence added to its scope, N53's words.
- 212's header list: item (36), after (34), citing N49 and N53.
- registry.json / rulings.json re-made by their door (`node scripts/veil/rosterChoiceRegistry.mjs`; `--check` exit 0):
  registry.json +24 withhold rows; rulings.json loses 7 paths (6 diffuse prose, 1 rng prose.legacyLines.b).
- The mutation manifest pins nothing of 212's text or the twin's (grep of scripts/mutation-sweep.sh and
  scripts/mutation-coverage-manifest.json): no change.

## THE 24 ROWS AFTER THE EDIT (REGISTRY_ROWS: {id, rule, when, built, server, twin}; all 24: inputs [], compose null)
posture.posture, posture.prize, posture.terrain, state.firstSurvey, state.publicOrder.field, state.publicOrder.beside,
state.publicOrder.rung.sentence, state.publicOrder.rung.glance, threat.economic, wall.rationale, incomeWeight,
shadowEconomy, incomeMix, prosperityHeader.detail, prosperity.sentence, legacyLines.a, legacyLines.b, legitimacyBanner,
legitimacyLens, stabilityHeader, structureFlag, successionRisk, conditionSeverity, templeFraud (each `prose.<id>`):
withhold / always / true / public._gallery_veil_withhold_always / galleryWithholdAlways.js :: withholdAlways.
prose.criminal: withhold / house-hidden / true / public._gallery_veil_roster_choices / galleryRosterChoices.js :: applyRosterChoices.

## RECEIPTS
- Unbuilt rows (REGISTRY_ROWS, built false): 40 at the tip, 23 after (150 rows both). Composed rows: 28 -> 4.
- tests/lint/rosterChoiceComposedHosts.walker.test.js: tip 26 red (seat); after 4 red: power.desc, power.label,
  power.relation.dmNote (chain A's) AND the census pin "the census is not vacuous" (`COMPOSED.length >= 10`; now 4).
  A pin (a') turns red: NOT re-stated (the brief); the seat re-states it.
- tests/lint/rosterChoiceRegistry.walker.test.js green; tests/ops/migrationRehearsal.test.js and
  tests/security/galleryVeilCures.pglite.test.js green (proofs-2.log: 67 tests, the 4 above the only reds).
- tests/lint whole (mutex; two give-ups, exit 3, the seat's ppkey run held it): 26 failed of 3,280 (17 files) beside the
  tip's 48 of 3,304 (17 files): -24 tests (the composed walker's per-row tests), -22 reds; NEW red: the census pin
  only (the other 22 reds, 16 files, unchanged in count). lint-whole-r.log.
- tests/copy whole (mutex): 2 failed of 172 (1 of 15 files): voiceMechanics E2, galleryRosterChoices.js (em 1) and
  gallerySecondHomes.js (bang 18), files this unit does not touch (tip state); neither touched file is listed. copy-whole-r.log.
- Typecheck: `node scripts/check-full-typecheck.mjs` OK (167 errors, ceiling 167), none in a touched file; eslint on the
  two touched src files exit 0.
- No added line carries an em dash or a `!` (N54/N57); no test names a re-worded scope's old words (grep of tests/).
- 212 applied to a LOCAL database: `createdb -T v27x211 v41_c2b && psql -v ON_ERROR_STOP=1 -d v41_c2b -f <212>` exit 0
  (PGHOST=/var/tmp/rv7); `_gallery_veil_withhold_always('{"publicProse":{...},"name":"x"}')` = `{"name": "x"}`.
- sha256: 212 ff20ed89...6fdbf (tip) -> d71abc9e86139cd9ad8d8cd27067642e445b802fca8600a90483a989b7848ac5; rollback 212 down 8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0
  (unchanged).

## PREDICTED REDS OUTSIDE tests/lint (not run, not re-stated: the seat's)
- tests/security/rosterChoiceInversion.pglite.test.js MAIN: KNOWN_NOT_REDERIVABLE names six prose rows that are no
  longer diffuse, so `notRederivable` will be [] against six.
- tests/security/publicPayloadVeilTotality.test.js: an arm expects `general:overview` in the veiled publicProse text.
- publicProseEquality, publicProseVeilInvariance, publicProseVeilOnce (the brief's list).

## EDIT 4: STOP (the chair rules)
RED FIRST at the tip: C1's lookup (c1-an.mjs :: rowOf, verbatim, over REGISTRY_ROWS) names
`history.currentTensions[].factions[]` UNREGISTERED (its `(only in A|B)` forms resolve to history.tension.factions,
rng); the same after edits 1-3. NOT MEASURED ON THE 18 PLACES: their documents are not on this box (C1's dump is gone,
and /var/tmp/v18/t2/pool-r5c-1 was being re-made by another run since 05:29 UTC, no shard written). What the rule
tables say (read, not served): `factions` is on the tension card's FLOOR (galleryVeil.js, tension), so no eye takes it;
a string leaf can leave that path only by the hidden-house name sweep (212 (16)/(19), host _gallery_veil_second_homes /
sweepHiddenNames: a list loses the name), by the projection's hidden-power mask ('an unseen interest'), or by R3's
copy rule (_gallery_veil_roster_choices / applyRosterChoices: a tension naming a withheld power leaves WHOLE). C1's
value is "The garrison", no criminal power, so R3's rule is the least likely; the likeliest are the sweep and the mask,
neither in R3's host. The rule is NOT PLAINLY THE SIBLING'S: no row added. Under (a') the prose hit itself is gone
(publicProse is not served).

## DEPARTURES
- `proseWhole` helper in place of 24 hand-written row() calls (the same fields).
- The census pin above, and the predicted reds, left red (not re-stated).
- prose.incomeWeight moved by N53 (a); its `registry:` lines say "(N53 (a): re-hosted with the 23)".
