# TAIL-CLOSE-SWEEP-D — hand-back (2026-11-15)

Base: the doors' branch `lane/tail-close-doors-2026-11-15` at **73090ee9e** (read at seat start).
Branch: `lane/tail-close-sweep-d-2026-11-15`, one commit an item, plus this hand-back. Merges nothing.
All work in a plain scratch clone with its own `npm ci`; every run to a file.

## The items

| # | Test (red arm) | Cause | Cure | Files | Commit | Tests |
|---|---|---|---|---|---|---|
| 1 | `tests/copy/landingProseGrounding.test.js`: "no longer carries a "restore order" beat" | The landing fixture was re-emitted at the close; the round re-drew the cast, so the advance's six beats changed (the priest's "restore order" and the reforms out; Uathach O'Neill shielding their people and the broken trade routes in). A reading keyed to a declared move. | `realm.body2` re-grounded on the fixture's six beats in week order (4, 5, 9, 10, 10, 12), its opening and closing kept; the test's pairs re-keyed one a beat (six) with a dated note; the comment's week list brought current. The spoken weeks (nine, twelve) still stand in the fixture and are unchanged. | `src/copy/landing.js`, `tests/copy/landingProseGrounding.test.js` | f187d378 | `tests/copy/` and every test file naming `landing.js` or `landingFixture`: 28 files, 327 tests green |
| 2 | `tests/generators/payOneHome.test.js`: "rv2-famine-city-0 reads the clause beside the hunger line" | The close's record cure R1 (**b8a82cf4f**, the Economic Survival rating capped by the prosperity word). Verified on the birth: prosperity **Struggling**; `scores.economic` **77** before the cap, **64** after (strong cut 65). With the cap alone switched off at the same tip, the line reads the STRONG clause again and nothing else in the threat assessment moves. | Expected sentence re-keyed to the ADEQUATE clause the town prints ("Money enough for a short crisis, laid by before the famine; a long one would start eating the reserves within months."), with a dated note naming R1 and its commit. The anchor (the two prosperity words differ) stays. | `tests/generators/payOneHome.test.js` | 675914a2 | 6/6 green |
| 3 | `tests/generators/powerStructure.test.js`: packed lines, `stressFactions.js: 3` (ceiling 2) | A regression of form: three import lines carried two statements each. | Each split into one statement a line; the statements byte-identical (asserted while editing), only the trailing comments shortened. The module now packs 0; the ceiling is not touched. | `src/generators/power/stressFactions.js` | 1570baf2 | the 17 files naming `stressFactions`: 1 red / 226 green before (the packed arm), 227/227 green after; sixty-birth sha256 identical |
| 4 | `tests/lint/domainAnyCastBaseline.test.js`: `candidateEvents.js: 28 any-holes (allowance 24)` | The close's landing-line cure (805452e8, the trade fact names the market's stalls only where a market stands) added four `any`s. | The four typed: `conditionFactOf`'s voice (`{ fact: (n: string) => string }`, its CONDITION_DEEDS row), pressure (the fields it reads), and snapshot, plus `pressureConditionCandidate`'s snapshot, as `ConditionFactSnapshot`, the `byId` shape the file's own `ledgerCorroboratedPressure` already reads. 28 → 24. Allowance not widened, no DECLARED_OVERRUN row added. No other file's count fell, so the baseline's shrink-only door was not needed. | `src/domain/worldPulse/candidateEvents.js` | 85618655f | the 24 files naming `candidateEvents` green; `domainAnyCastBaseline` 19/19; `typecheck:domain:strict` 1113 (ceiling 1113), `typecheck:ratchet` 167 (ceiling 167); sixty-birth sha256 identical |
| 5 | `tests/lint/mutationCoverageManifest.test.js`: totality, three files with no entry | Three law tests of the close landed with no manifest entry. | A `kind:'rationale'` entry each, in the form its neighbours carry. Each was shown red with its cure reverted in its own commit (b8a82cf4f R1, 7ac689418 R4, 0b140b40c cure 4). I re-showed it here: with the three cures' `src/` hunks reverse-applied at the doors' tip, 5 arms red (2, 2, 1); restored, all green. Gap list not grown. | `scripts/mutation-coverage-manifest.json` | cde231c8d | manifest test 10/10; the three law tests green |
| 6 | three files that timed out in the rehearsal | — | Each run alone, to a file, at the tip. | — | — | GREEN, each alone: `urbanBandInstitutions` 20/20 (155 s), `distribution` 32/32 (230 s), `livingContentPromiseBytes` 5/5 (91 s) |

**The sixty births** (`sha256` of the JSON records; six tiers × ten fixed seeds `sweepd-<tier>-<i>`; famine, under_siege, wartime and plague_onset among them; deterministic across two runs): `f001cb9ce873fced09d2fe0ef31d60536f027a04f8260a05f1b1839c11584e62` at base and after items 3 and 4.

**A note on the scratch clone (no repository change).** A plain clone of this checkout is shallow, so `domainAnyCastBaseline`'s "every declared overrun is attributed" arm at first read the `introducedAt` commits of `commercialReasons.js` and `envoyPulse.js` (d7ea69a4b, e0c8646ee) as missing. Both resolve on origin. Fetched into the clone, the arm is green. The cause is the shallow checkout, not the tree.

## The registers (last lines, base 73090ee9e → tip)

Same last line at base and tip, all three exit 0:

- `node scripts/presumed-things-door.mjs --check`: `fresh 0 · stale 0 · first-register stale 0 · banked 4689 · strips fresh 0 stale 0 banked 107` (read again after item 1: the new paragraph adds no hit)
- `node scripts/check-writer-reach.mjs`: `WRWALKER HOLD — judged 12661 · LIT 691 · LIT-NAME 10563 · DARK 1407 (reviewable 389) · pending-surface debt: none`
- `node scripts/check-observed-shape-readers.mjs`: `CR-OSR-FREEZE-7 UNREVIEWED-UI cohort (src/components/): 49 file(s) / 131 identit(ies) / 195 read(s), …` (unchanged)

No register, golden or census was re-taken.

## The receipt

Each file run alone at the tip, green: `landingProseGrounding` 12/12 · `payOneHome` 6/6 · `powerStructure` 5/5 · `domainAnyCastBaseline` 19/19 · `mutationCoverageManifest` 10/10 · `economicRatingCappedByProsperity` 4/4 · `foodMagicShareOfPublishedPounds` 2/2 · `wartimeForgesSmith` 1/1 · item 6's three as above.
`npx eslint` on every touched JS file: clean (the manifest JSON is outside eslint's config). `typecheck:domain:strict` 1113 (ceiling 1113), `typecheck:ratchet` 167 (ceiling 167): both green.

## For the owner, in plain words

The landing page's "advance time" paragraph had drifted from the sample village it describes. The sample was regenerated at the close, and its twelve weeks now tell a different story. I rewrote the paragraph to tell the story the sample now holds. You can veto it (revert f187d378 and the old paragraph returns, though its test then reds again).

**Old:**

> Then advance time. In Cnocby’s first twelve weeks Étaín Sullivan set out to restore order and the village went onto a war footing; the split between the faiths ended, leaving its sectarian memory behind; by week nine control of the village’s water was passing to the Elder Council; and by week twelve Caoilfhinn Gallagher was pushing through reforms as crime took hold of its streets. Every one of those is a record the engine wrote, and every one carries its cause.

**New:**

> Then advance time. In Cnocby’s first twelve weeks the split between the faiths ended, leaving its sectarian memory behind, and the village went onto a war footing; by week nine control of the village’s water was passing to the Elder Council; then Uathach O'Neill set out to shield their people as crime took hold of its streets; and by week twelve its trade routes had broken down, its traders with little to sell. Every one of those is a record the engine wrote, and every one carries its cause.

Nothing else a reader sees has changed. Items 2–5 change a test's expected sentence, the layout of import lines, type annotations and a coverage manifest. None of them changes what the generator writes: the sixty-birth hash is identical. Item 2's sentence was already what the app prints, because of the close's earlier R1 cure; the test now agrees with it. No other landing sentence names Étaín Sullivan, Caoilfhinn Gallagher or the reforms.
