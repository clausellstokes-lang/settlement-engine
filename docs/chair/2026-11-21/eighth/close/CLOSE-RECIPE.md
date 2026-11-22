# THE CLOSE'S RECIPE (CLOSE-1 unit 5; IN PROGRESS; started 2026-11-22 09:07 UTC, read from `date -u`)

Every step of the worklist's items (3), (4), (5) and (8), as exact commands in order, each REHEARSED on the lit scratch
(`lane/close-1-lit-scratch-2026-11-22`) with what it printed. Steps not yet rehearsed say so.

## 0. BEFORE THE FLIP (what must be on the line first)
- Both laws landed (who rules, point 97; fortune, point 98) and their register commits.
- CLOSE-FIXTURE (E55): `scripts/generate-landing-fixture.mjs` births through `birthConfig`. Without it, step 5c freezes
  a town the button cannot forge (`measures/LANDING-FIXTURE-PROBE.md`).
- JOIN (unit 3, E61): the one saved-place test over `GENERATION_LAWS` and the one pin of `birthConfig(null)`.
- DEPENDENCY (E61 (6)): the atom `seat contested` and its pin to the page's risk word are the state-sentence lane's
  SEAT-TOWN (PROSE-5), which lands AFTER who rules' U6 (SEAT-B) cures law 1's `contestedBy`. Not a step of the flip.

## 1. THE FLIP (item (3); the chair's one unit): the three dials (REHEARSED: lit scratch 5c4419815)
```
sed -i 's/^export const NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION;$/export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;/' src/domain/seat/seatLaw.js
sed -i 's/^export const SEAT_CONTEST_LIT = false;$/export const SEAT_CONTEST_LIT = true;/' src/domain/seat/seatCircumstances.js
sed -i 's/^export const NEW_SETTLEMENT_FORTUNE_LAW_VERSION = DEFAULT_FORTUNE_LAW_VERSION;$/export const NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION;/' src/domain/fortune/fortuneLaw.js
git diff --stat   # exactly 3 files, 3 lines
```
Printed: 3 files changed, 3 insertions(+), 3 deletions(-). Proof: `birthConfig({settType:'town'})` mints
`_seatLawVersion: 2` and `_fortuneLawVersion: 2`; both saved-place tests 15/15 on the lit tree.

### 1a. THE TEXTS OF DARKNESS THAT MOVE WITH THE FLIP (E61 (7); every one met so far)
| where | what says "dark" | at the flip |
|---|---|---|
| `src/domain/density/densityCreateBoundary.js :: GENERATION_LAWS.seat.why` | "THE DIAL IS DARK, and that is the chair's ruling (a) of 2026-11-20 …" | rewritten to say lit, with the day (the living-content row's precedent: "This row read … until that day") |
| `… GENERATION_LAWS.fortune.why` | "THE DIAL IS DARK, and that is the chair's ruling of 2026-11-20 10:33 UTC …" | the same |
| `tests/domain/seatLawWiring.test.js` arm 4 "GENERATION_LAWS.seat is a WIRED row that says the dial is dark, and why" | pins the why's darkness | re-pinned to the lit why |
| `tests/domain/fortuneLawWiring.test.js` arm 4 (the same for fortune) | the same | the same |
| `tests/domain/seat/seatContest.test.js` (5) "the dial lands dark: every factor 1 …" / "the dial is dark and every factor of the registered table reads 1" | pins `SEAT_CONTEST_LIT === false` | re-pinned (the factors stay 1: the table is untouched) |
| `tests/domain/seatLawWiring.test.js` "the vocabulary: one key, two versions, the dial at the default" | pins `NEW_SETTLEMENT_SEAT_LAW_VERSION === DEFAULT` | re-pinned to the holder version |
| `tests/domain/fortuneLawWiring.test.js` "the vocabulary: one key, two versions, the dial at the default" | pins `NEW_SETTLEMENT_FORTUNE_LAW_VERSION === DEFAULT` and the mint `{}` | re-pinned to the size-relative version |
| `tests/domain/seatLawWiring.test.js` 1 and `fortuneLawWiring.test.js` 1 "CREATE (dark): birthConfig carries no _<law>LawVersion …" | pins the absent marker | after JOIN, each arm keeps only its own key: re-pinned present |
| `tests/domain/fortuneLawWiring.test.js` 7 "the leaf's header says the fortune law is never lit before the seat's law" | an ORDER pin, not darkness | holds: both dials flip in ONE unit |
| comments: `densityCreateBoundary.js` (the clamp's two paragraphs, "a build whose dial is dark"), `fortuneLaw.js` header property 3, `seatLaw.js` header | prose only | read once at the flip; the flipped run (unit 4) names every test that pins one |
(The flipped run's class (a) list is the complete set: see `FLIP-CENSUS.md` when written.)

## 2. THE FLIPPED RUN (item (3)) — see `FLIP-CENSUS.md` (unit 4)
## 3. REGISTERS BY THEIR DOORS (item (4)) — not yet rehearsed lit
## 4. THE EDGE BUNDLES (item (5)) — not yet rehearsed
## 5. FOR THE OWNER'S HAND AND EYE (item (5)) — partly rehearsed

### 5c. THE HOME PAGE'S SAMPLE TOWN (the chair's step; its stock narration for the owner's eye)
Needs CLOSE-FIXTURE (landed) first. The command, ON THE FLIPPED TREE, never before the flip:
```
node scripts/generate-landing-fixture.mjs --check         # exit 1 = stale (expected)
node scripts/generate-landing-fixture.mjs --seed lf-033 --emit
node scripts/generate-landing-fixture.mjs --check         # exit 0
```
THE EXPECTED DIFF, DARK (rendered without --emit at f6d764473 = point 97 + the cure; CLOSE-1, 13:33 UTC 2026-11-22):

| what | committed module | cut script | cured script |
|---|---|---|---|
| bytes | 8,337 | 8,362 | 8,394 (+57) |
| lines differing from the committed module | — | 1 (`town.prose`, stale already) | 16 |
| the town's own brief (name, population, config, arrival, pressure, hooks) | — | unchanged | unchanged |
| `realm.whyTrace` | — | — | one reason: "Public legitimacy 14 colors trust" becomes 12 |
| `realm.advance` | — | — | five entries move (weeks, headlines, texts reorder: the four neighbours are births through `birthConfig` now) |
| `realm.chronicle` | — | — | one entry (week, text) |

THE EXPECTED DIFF, LIT (the cured script rendered on a copy of the lit scratch e987c3e36, no --emit; 13:3x UTC):
8,361 bytes (+24), 15 lines from the committed module. FOR THE OWNER'S EYE, the sample town's own readings move:
`town.prose` (the arrival's opening line, stale already); `realm.whyTrace`: "Religious Authorities carries power 30"
becomes 24, and the trust band "strained to critical (danger), public legitimacy 14" becomes "adequate to strained
(warning), public legitimacy 33" (the fortune law's size-relative standing lifts the village's legitimacy); and
`realm.advance` entries reorder ("Cnocby turns to the faith of Vael" now leads at week 1). These replace the dark
expected diff above once the flip is made: the close emits on the flipped tree only. The two
freshness rows (`tests/build/landingFixtureFreshness.test.js`: "a fresh derivation reproduces the committed module BYTE
FOR BYTE", "the script's own --check arm agrees, and is wired to say how to fix it") go green by the emit.
## 6. THE CHECK AND CI (item (8)) — not yet rehearsed
