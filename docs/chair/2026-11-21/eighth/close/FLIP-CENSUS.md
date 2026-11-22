# THE FLIP'S CENSUS (CLOSE-1 unit 4; IN PROGRESS; last written 2026-11-22 14:28 UTC, read from `date -u`)

THE RUN (the chair's cut, 13:07 UTC): ONLY THE LIT HALF, on the lit scratch `lane/close-1-lit-scratch-2026-11-22` at
e987c3e36 (the trial join of point 97 and fortune f13f31820, its doors, and the three dials). THE DARK LIST IS
`ci/RED-AT-LINE.tsv` (64 rows at the line 1ec3e81d1, point 97). Every lit red is read BY NAME against it
(`census/match.mjs`); a red not on it is the flip's (or the trial fortune's), and is classed:
(a) a pin, born row or census its door or the test re-records at the flip; (b) a golden or reference, the owner's;
(c) a size figure; (d) A TRUE FAULT. The classing of a part's reds is a read-only helper's from each test's source,
every (d) and (d?) VERIFIED BY CLOSE-1 by run. Per-part lists: `census/lit-<part>-match.tsv` (ON/NEW) and
`census/lit-<part>-classed.tsv` (class, lane list, cause). The runner: `census/run-parts.sh`.

"Lane list" says whether a lane's OWN flip census already named the red: SEAT (SEAT-10's `recut/CENSUS-LISTS.md`),
FORTUNE (FORTUNE-3/6's `LIGHTING-WORKLIST.md` B1), or JOIN: named by neither (the two laws' interaction, or a test
neither lane ran). JOIN is what this census adds.

## PART 1: tests/generators, tests/data, tests/property (lit, ended 14:17 UTC)
633 files, 4,692 tests: 99 red; 20 on RED-AT-LINE; 79 NEW, classed:

| class | SEAT | FORTUNE | JOIN | all |
|---|---|---|---|---|
| (a) pin / born anchor / premise | 9 | 22 | 46 | 77 |
| (a*) a guard that predates a ruled design (re-cut) | 0 | 1 | 0 | 1 |
| (d) TRUE FAULT | 0 | 0 | 1 | 1 |
| (b), (c) | 0 | 0 | 0 | 0 |

### (d) TRUE FAULT 1: FORTUNE LIT CUTS THE CRISIS'S OWN POWER IN A THORP (sent to the chair at once)
`tests/generators/people/dualHatPoliticalMass.test.js` › "a small place keeps the power the fold of the office's face
into the leader's house cut". CONFIRMED by `census/dualhat-probe.mjs` on four trees: dark 8/8 hold; SEAT ALONE 8/8;
FORTUNE ALONE and BOTH: 3 misses (rvf-slave_revolt-thorp-5 no Revolt Leadership; rvf-wartime-thorp-2 no War Council;
rvw-thorp-86 no Highborn Circle; each roster "Elder Council*" alone). On the slave-revolt thorp (`census/dualhat-one.mjs`):
prosperity Poor → Comfortable, legitimacy 19 "Legitimacy Crisis" → 38 "Contested", factions [Revolt Leadership 59,
Elder Council 41] → [Elder Council 100], the revolt's leader gone from the cast, and stability STILL "Unstable (revolt
not contained)": the record states a revolt with no power and no leader. THE LANE: fortune.

### (a*) `tests/generators/defenceParts.test.js` › "R13: where something is built or standing, the will counts no more than the armed bodies that carry it"
"v3build-village-3: expected 6.9 to be less than or equal to 6.8". NOT a product fault: `defenseGenerator.js`'s own
X4 rule (UPKEEP-MEASURE-2, ruled after R13) holds the will at or above the place's unheld base rate ("so a wall never
lowers the will"), which may sit above the armed bodies; the test's R13 bound does not include that floor and held on
the dark corpus only. FOR THE CHAIR: the guard re-cut with the X4 floor (the upkeep lane's), not re-pinned.

### (a) the 77 pins: see `census/lit-gen-classed.tsv` (one row each, its cause). No test names a refreeze door
except `tests/fixtures/goalHashes.mjs` (the goal sentences' hashes).
