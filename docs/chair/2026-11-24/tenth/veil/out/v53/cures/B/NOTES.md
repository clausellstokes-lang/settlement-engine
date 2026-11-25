# V53 cures UNIT B (RULING V3 (3)) — builder notes (partial, as I go)

- Base: /home/user/cures53, lane/veil-53-2026-11-24-cures-wip @ 6b674eb36.
- RED (before any edit): `tests/domain/display/tensionCause.test.js` 1 failed | 17 passed (18).
  "(CAUSES-PARITY-2 F) hxd-city-138: served == the house-free twin; the owner keeps the black market's wording":
  `AssertionError: expected null to be 'Crime is on the rise here.'` at tensionCause.test.js:305 (log /var/tmp/v53/cures/B/red.log).
- Cause (REDSCAUSE (3)): the served read lacks crime_wave (dropped by `applyRosterChoices`, row `history.tension.crimeWave`), so t2 is undefined.
- Edit (test only): the CAUSES-PARITY-2 F describe re-stated; owner arms (black-market wording; the twin's owner read prints the
  plain crime sentence, computed by `expectedOf`; the twin's served read keeps the tension and prints it), absence arm
  `expectServedSilent` (served doc lacks crime_wave via `expectPresentThenAbsent`; no black-market or plain sentence), and a
  control `it` that plants the tension, asserts the arm reds (/REMOVAL/), restores in `finally`, and asserts it holds again.
- GREEN: tensionCause.test.js 19 passed (19) (log /var/tmp/v53/cures/B/green1.log).
- Stale prose (not touched, out of manifest): tests/lint/samenessHideable.walker.test.js EXEMPT reason still says "hxd-city-138 (served == the house-free twin)".
- COMMIT 5d04aaf9a (hooks ran: lint-staged eslint --fix, clean).
- tests/lint whole: running (log /var/tmp/v53/cures/B/lint.log).
