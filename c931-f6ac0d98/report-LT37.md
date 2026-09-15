# LT37 — the quality tracks. FINAL LANE REPORT. All six cars sealed.

Dock `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-LT37-quality`, cut at `f73bdbf16`. NEVER rebased, NEVER merged. Porcelain 0 after every car. Nothing pushed, deployed, migrated or flag-flipped; no size or build ceiling raised; no dependency added; package.json untouched.

| car | sha | what landed |
|---|---|---|
| 1 | `2dac045b5` | the roadmap's item-#37 sections reconciled to the measured state, records only |
| 2 | `b54a510dc` | `e2e/flow-g-gallery-publish.spec.js`, both arms of the P0.7 publish gate |
| 3 | `4612ced3e` | the AI overlay output-eval corpus (Track J part 1) |
| bill | `aaefb480c` | lighting census re-frozen after car 3 |
| 4 | `ed5b90064` | STOPPED on its own hard stop; the measurement written into the record |
| 5 | `32eefe9cf` | the third food-deficit surface MEASURED; the cure REFUSED on that measurement |
| bill | `cc5c74db2` | lighting census re-frozen after car 5 |
| 6 | `aab26d4aa` | pdf.7's structural half: the parity SOURCE probe in the field manifest |

## THE FOUR THINGS THAT MATTER MOST

### 1. Two pre-existing reds at the slot. Neither is this lane's. Both proven by execution.
- **`tests/docs/enforcement-claims.test.js` — SIX naked completeness claims across THREE files:**
  `docs/FABLE_VALIDATION_QUEUE.md` :179 :3023 :3892 :5669, `docs/GOLDEN_SHIFT_LEDGER.md:2128`,
  `docs/implementation/packets/foreign-policy/IN-0C.md:484`. Proven pre-existing by restoring
  HEAD's `A_PLUS_ROADMAP.md` over car 1's copy and re-running: identical red, same six entries.
  `A_PLUS_ROADMAP.md` is on that pin's own EXEMPT_DOCS list, so no edit to it can move the arm,
  and car 5's new document adds none (`grep -c LT37-dailylife` over the failure list is 0).
  ⚠ **CORRECTION TO THE LANDED COMMIT BODIES OF CARS 1, 2 AND 4, WHICH SAY "TWO ENTRIES": the
  true figure is SIX.** A grep filter of mine hid the four FABLE rows. Car 5's and car 6's
  bodies carry the correction; the claim that none of the six is this lane's is unchanged and
  still proven.
- **`tests/copy/voiceMechanics.test.js` shrink-only per-file debt:**
  `src/domain/display/labelBands.js: baseline em:0 bang:0 -> current em:5 bang:0`
  `src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 -> current em:3 bang:0`
  The counts GREW, so the rule is rewrite-the-string, never raise a baseline. Those are
  reader-facing display strings this lane may not move. **ROUTED TO THE CHAIR, not fixed.**

### 2. The e2e suite is unrunnable on this box as installed.
`@playwright/test` is 1.63.0 and requires `chromium-1243` / `chromium_headless_shell-1243`; the
cache holds only `1223`, so EVERY spec dies at `browserType.launch: Executable doesn't exist`.
I did NOT run `npx playwright install` (a ~180 MB download is not an implementer's call) and
verified against the installed 1223 build through a scratch `PLAYWRIGHT_BROWSERS_PATH` whose
1243 entries are symlinks to it. Nothing in the repo was changed for this. **Car 2's green is on
chromium build 1223, not 1243.**

### 3. Four of the brief's premises are refuted by measurement.
- **THE LT36 CHERRY-PICK RISK IS NOT REAL.** Re-run over the whole lane:
  `git merge-file -p <lane tip> <f73bdbf16> <c8b319dda>` exits 0, **zero conflict markers**,
  LT36's row-6 amendment survives, and all 16 LT37 amendment markers are present. Line 56 is
  untouched by every car.
- **"A BLIND VERIFIER PASSES EVERY EXISTING AI TEST" IS FALSE.** Stubbing `verifyAiOverlay`
  always-clean reds **39 of the existing suite's 63 tests**.
- **THE DAILYLIFE FOOD-DEFICIT DIVERGENCE IS NOT LIVE.** 360 settlements, band word identical
  360 of 360. The cure is now REFUSED on that measurement.
- **pdf.7 WAS NOT WHOLLY UNIMPLEMENTED.** Its VALUE half was already registered in the manifest
  walker; only the SOURCE probe was missing. Car 6 adds only the missing half.

### 4. Two owner-desk items, each with a measurement attached.
- **The AI drift-rate readout (car 4).** Needs one metric branch in `report_trend`'s allowlist
  computing the rate from `analytics_events.props` for `event = 'ai_verifier_report'`. That is
  SQL, therefore a migration, therefore not an implementer's commit. It carries the
  AI-capability question the roadmap parks at :76.
- **Row 18's dashboard half** stays owner-gated and is now marked as such in the roadmap rather
  than reading as open work.

## PER CAR

### CAR 1 — `2dac045b5` — reconcile the roadmap's item-#37 sections (records only)
FILES: `docs/A_PLUS_ROADMAP.md` (+21 / -15).
Nine amendments in LT36 car 7's idiom: every stale status line rewritten to QUOTE ITSELF beside
the figure measured at `f73bdbf16`; not one `- **Change:**` block deleted. Rows 2/3/4 (Track K
landed in all three parts), row 9 (CI performance budgets landed), row 12 + the Track I bullet
(landed), row 13 (four of five journeys shipped; gallery publish named as the gap), row 16 + the
Track J bullet (split), row 18 (in-repo half done, the rest the owner's console), Track C's three
XL bullets, pdf.4's stale REMAINING note, and the DUPLICATE pdf.7 heading (a
`### pdf.7 … ✅ DONE` line sitting under `### pdf.5` carrying pdf.5's body while the real pdf.7
read as open: one file, two verdicts on one item).
MEASURED AND NEW TO THE RECORD: effective/raw lines by
`npx eslint --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}'` —
WorldMap 599/911, EventComposer 600/805, GenerateWizard 414/648, OutputContainer 600/1049,
SettlementsPanel 560/784. **TWO OF THEM HAVE ZERO HEADROOM** against eslint.config.js:664-669's
max-lines 600 ERROR and fail the gate on the next effective line added.
GATE: `tests/docs/` 140 passed / 1 failed (pre-existing). `tests/lint/` 2598 passed / 1 failed —
that one `Error: Test timed out in 20000ms` on the lighting walker at load 298.81, RE-MEASURED
ALONE at load 9.56: **34 passed (34), 5.94s**. `tests/copy/` 120 passed / 1 failed (pre-existing).
`check:quick` 3/3 exit 0 (typecheck-ratchet 173/173, domain-strict 1120/1120).
NEGATIVE CONTROL: a naked "machine-enforced" line appended to `docs/DEPLOY.md` moved the
enforcement-claims pin from six naked entries to seven and tripped a second frozen-count arm
("docs/DEPLOY.md :: machine-enforced: frozen 0, now 1"). Reverted by file copy.

### CAR 2 — `b54a510dc` — the gallery-publish E2E journey
FILES: `e2e/flow-g-gallery-publish.spec.js` (260 lines, new).
BLOCKED arm: a dossier carrying validateDossier's `impossible_food_math` is refused, the publish
RPC called ZERO times (counted at the route stub, not inferred from copy), the surface never
published. CLEAN arm: `publish_settlement` called EXACTLY ONCE, the surface flips to Public plus
copy-link. Runs against the CONFIGURED :5174 server because `src/lib/gallery.js:58` hard-guards
publish on `isConfigured`, so under the LOCAL server the clean arm cannot be observed at all.
TWO PRODUCT GATES THE SPEC HAD TO LEARN, both now recorded in it: the Actions rail COLLAPSES its
tail behind "Show N more" and Share is in that tail; and `saves.js migrateSaveToV2` STAMPS
`{ phase: 'draft', canonizedAt: null }` onto any row with no campaign state, so a null fixture
renders publish DISABLED behind "Start the World Clock before sharing the dossier publicly" and
neither arm is reached.
GATE: `2 passed (28.1s)` in isolation; `{'expected': 2, 'unexpected': 0}` with the JSON reporter
at load 174; static guard `chromium=41 spec(s) discovered` exit 0; runtime guard
`Playwright run executed 2 test(s)` exit 0; `tests/lint/ tests/copy/` 2718 passed / 2 failed
(the pre-existing voice debt, and an observedShapeReaders 20s TIMEOUT at load 116 RE-MEASURED
ALONE as 44 passed (44)); `check:quick` 4/4 exit 0 including eslint on the spec.
NEGATIVE CONTROL: `ShareToGallery.jsx:251` `if (blocking.length > 0)` made inert as
`if (false && ...)`. The BLOCKED arm reds on exactly its gate assertion
(`Locator: getByText(/Can.t publish yet: 1 consistency issue/i)`) while the CLEAN arm stays
green — the control convicts only the arm that guards the gate. Reverted by file copy; confirmed
byte-identical to HEAD.
COULD NOT BE SHOWN: a green WHOLE chromium suite. 28 of 41 failed, 18 of them
`page.goto: Timeout 15000ms` at load 217. **BOTH OF THIS SPEC'S TESTS PASSED INSIDE THAT RED RUN.**

### CAR 3 — `4612ced3e`, bill `aaefb480c` — the AI overlay output-eval corpus
FILES: `tests/domain/aiOverlayEvalFixtures.test.js` (166), `tests/fixtures/ai-overlay-eval-corpus.json` (360).
Eight (original, refined) pairs as deltas against one frozen base, scored on the EXACT
seven-counter vector plus `ok` plus the kind:field addresses. No src change.
GATE: focused 68 passed (68). `tests/lint/ tests/copy/` 2718 passed / 2 failed (the pre-existing
voice debt, and the lighting census move which is this car's bill). `check:quick` 4/4 exit 0.
NEGATIVE CONTROL A (the verifier made blind): my eval 7 of 12 red, **the existing suite 39 of 63
red** — that red IS the receipt refuting the brief's premise.
NEGATIVE CONTROL B (each dropped history beat reported twice): **THE ENTIRE 63-TEST EXISTING
SUITE STAYS GREEN** and only this eval reds, naming the case, on `historyDropped 2 -> 4`. That is
the executed justification for the car: the existing suite pins `historyDropped` only by LOWER
bounds at every site, so an over-report is invisible to it. Both controls reverted by file copy;
the verifier confirmed byte-identical to HEAD each time.
CENSUS BILLS, each measured rather than assumed. LIGHTING CENSUS owed and PAID by `aaefb480c`
(files 2563 -> 2564, parked 375 -> 375, credited 2188 -> 2189, titles 24169 -> 24174,
suiteTitles 6452 -> 6454; the plain re-run the register demands as proof: 34 passed (34)).
MUTATION-COVERAGE MANIFEST not owed and proven (its test passes with the file present;
`tests/domain` is not an ENFORCER_DIR and the basename carries no NAME_PATTERN token).
TEST RATCHET NOT OWED, against the brief: `totalTests`/`totalFiles` are FLOORS
(check-test-ratchet.mjs:1330-1334, :1350-1354), and `--dry` prints
`totalTests: 32584 - scope floor 29325` / `totalFiles: 2509 - scope floor 2258`. Adding passing
tests cannot breach a floor.
ALSO LEARNED THE HARD WAY: the first cut used `test.each` and raised the estate's shrink-only
each-family park ceiling from 111 to 112. Rewritten to the plain looping form the walker's own
message prescribes, BEFORE it landed.

### CAR 4 — `ed5b90064` — Track J part 2 STOPS on its hard stop
FILES: `docs/A_PLUS_ROADMAP.md` (+2 / -2). NO src byte.
THE MEASUREMENT. (1) The rows DO land: `ai_verifier_report` is in the shared EVENTS bundle
(analyticsEventsBundle.js:181), `ingest-events` admits any `KNOWN_EVENTS` name (index.ts:36,284)
and writes it to `public.analytics_events` WITH its props (:287-292). (2) NOTHING aggregates it
past a headcount: the only aggregate touching it is the generic `event_count` metric keyed by
event name in `rollup_analytics_daily` (038_analytics_rollups.sql:112-117), which reads nothing
from `props`; `grep -rln verifier supabase/migrations/` returns zero. (3) NOTHING can read it:
AdminTrendsPanel reaches the database only through `admin-actions`' fixed `report_*` map
(index.ts:651-854), `report_trend` RAISES `invalid metric: %` for anything outside
040_analytics_trends.sql:94-123's SQL case, and `report_ai_usage`'s view (038:57-63) counts only
started / completed / failed / credits_spent.
CONCLUSION: the read-only half has nothing to read. Every route to a drift RATE needs new SQL =
a MIGRATION = owner-gated. STOPPED with the measurement attached, which is what the hard stop
asked for.
GATE: `tests/docs/` 140 passed / 1 failed (pre-existing). `tests/lint/ tests/copy/` 2661 passed
/ 3 failed + 56 skipped, of which only ONE is real: `writerReach.walker` died in its beforeAll
("Hook timed out in 300000ms") taking 56 tests with it, and voiceMechanics' two tell-ban arms
each read "Error: Test timed out in 20000ms". RE-MEASURED ALONE at load 13.70: **74 passed (75)**,
writerReach green, both tell-ban arms green, only the pre-existing voice debt surviving.
`check:quick` 3/3 exit 0.

### CAR 5 — `32eefe9cf`, bill `cc5c74db2` — the third food-deficit surface, MEASURED; the cure REFUSED
FILES: `tests/pdf/screenParitySource.test.js` (+152, +4 tests),
`docs/implementation/LT37-dailylife-food-deficit-cure.md` (139, new). **No src byte.**
THE MEASUREMENT, over 360 generated settlements across six configs, 348 carrying a deficit:

    spread 0 points (exact agreement) ... 337
    spread 1 point ....................... 21
    spread 2 points ....................... 2
    spread above 2 points ................. 0
    DailyLife band words identical ....... 360 of 360   (zero flips)
    readings straddling a band cut ....... 0            (cuts at 10 / 20 / 35)

THE CAUSE, read out of the producer rather than guessed: foodBalance.js's canonical reconcile
(generators-domain-4, :281-294) makes both readings descend from ONE model. It writes
`dailyNeed = Math.round(dailyNeedFinal)` and RECONSTRUCTS the lbs figure from the percentage and
that same denominator, so `round(deficit / dailyNeed * 100)` recovers `deficitPercent` up to
DOUBLE ROUNDING. The roadmap's pdf.2/pdf.3 framing ("pre-import", "disagrees on every
import-dependent settlement") describes a tree that no longer exists; EconomicsTab.jsx:280-283
still carries the stale claim as a comment.
THE RULING: **REFUSED** by the chair on this measurement (2026-09-15). A cure that moves zero
band words buys no reader-visible correctness and spends a same-seed output risk (a 1-2 point
spread sitting exactly on a cut CAN move one band word, and one of the three rows it touches is
reader-facing prose). `docs/implementation/LT37-dailylife-food-deficit-cure.md` is therefore THE
RECORD OF A REFUSED CURE, not a pending one; it carries the patch, its diff, the three rows it
would have moved (the band word at DailyLifeTab.jsx:129-133, the colour at :135-138, one sentence
of the local narrative at :331-336) and the case both ways. WHAT RE-OPENS IT is the
characterizing pin going red and naming a seed, never a fresh reading of the same code.
WHAT LANDED: a characterizing pin over a PINNED corpus of eight (config, seed) pairs (the two
widest spreads in both directions, two 1-point cases, four exact agreements spanning
Tightening / Strained / Severe). It pins both readings exactly, asserts one band word, pins the
replicated band table against DailyLifeTab so the replica cannot rot, and carries a non-vacuity
arm requiring at least one pair to actually separate the readings while capping the spread at 2.
GATE: `tests/pdf/` 43 files / **416 passed**. `tests/lint/ tests/copy/ tests/docs/ tests/pdf/`
**3274 passed / 3 failed** — this car's census bill plus the two pre-existing.
`negativeAssertionAnchor.walker` + `screenParitySource`: **17 passed (17)**. `check:quick` 4/4.
NEGATIVE CONTROL 1 (deriveFoodBalance denominator doubled): `desert-thorp-46: the
CONVERGENCE-LAYER reading moved: expected 47 to be 94`.
NEGATIVE CONTROL 2 (DailyLifeTab's Severe cut moved 35 to 30): `DailyLifeTab no longer cuts
Severe at >35; the band table replicated above is stale`. Both reverted by file copy, both files
confirmed byte-identical.
ALSO LEARNED THE HARD WAY: the first cut's bare `.not.toContain` was convicted by
`negativeAssertionAnchor.walker` ("1 un-anchored negative assertion at line 189, frozen ceiling
0") and now carries a one-line `// anchored:` marker directly above the assertion, per THE
MARKER RULE.
CENSUS BILL PAID by `cc5c74db2`: titles 24174 -> 24178, suiteTitles 6454 -> 6455;
files / parked / credited all UNMOVED (four titles added to an existing file, no `each` call).
Plain re-run proof: 34 passed (34).

### CAR 6 — `aab26d4aa` — pdf.7's structural half
FILES: `src/domain/fieldManifest.js` (+64), `tests/joins/fieldManifest.test.js` (+38, +1 test).
THE FINDING THE BRIEF MISSED: `tests/joins/fieldManifest.test.js` ALREADY carried a
`screen<->PDF parity axis (A+ #6 - governed by SHARED_FIELDS)` describe registering the VALUE
half. Only pdf.7's Done-when, which is a SOURCE probe, was absent. Car 6 adds only that.
WHY A SNAPSHOT ROW AND NOT `consumerProbe`: that key shape does not exist in the module and
minting it would be a second idiom for an existing one. The manifest's real form for "derive the
live answer, never read the verdict" is a FROZEN_VS_LIVE snapshot row whose `guards` carry
mustMatch/mustNotMatch at the named display sites (the `magicTradeChannel` row is the precedent,
already enforced by an existing walker arm). The new row guards EconomicsTab.jsx and
SummaryTab.jsx with mustMatch `deriveFoodBalance`, mustNotMatch `\.deficitPercent`, each with
its `why`. dailyLifeLogic.js is DELIBERATELY excluded with the refusal recorded inline AND in
the row's own `displayRule`, so the exclusion is a documented deferral rather than a hole.
LIT ON AND OUTPUT: **no feature key** (`grep -n "flag(\|FLAGS\.\|featureFlag"` over both files
returns nothing), so nothing to light, and the car **moves no output** — no generated value, no
rendered string, no seed-visible byte.
VOICE: **zero em dashes and zero exclamation points** added to `src/domain/fieldManifest.js`,
measured on the diff. Load-bearing, not cosmetic: src/domain/** is inside voiceMechanics'
Tier-2 string-literal ratchet and this file's frozen debt is em 12 / bang 4, which may never
rise. The gate confirms fieldManifest.js does not appear in that arm's output at all.
GATE: focused `tests/joins/fieldManifest.test.js` **57 passed (57)** (55 before: +1 named arm,
+1 generated guard case). `tests/lint/ tests/copy/ tests/docs/ tests/pdf/ tests/joins/`
**3691 passed / 2 failed, and the only two reds are the two pre-existing ones.**
`check:quick` 4/4 exit 0.
NEGATIVE CONTROL 1 — pdf.7's DONE-WHEN, EXECUTED VERBATIM. A raw `.deficitPercent` read
reintroduced in EconomicsTab.jsx:
  `AssertionError: src/components/new/tabs/EconomicsTab.jsx: banned preference pattern is back
  (pdf.3 converged this tab onto the shared derivation; a raw engine read here is the exact
  regression that put the screen and the PDF on two numbers): expected true to be false`
It reds AND NAMES THE OFFENDING FILE. That is the Done-when, word for word.
NEGATIVE CONTROL 2 — the SummaryTab guard dropped from the row:
  `AssertionError: both tabs pdf.3 converged must stay guarded: expected [ Array(1) ] to deeply
  equal [ …(2) ]`
Both reverted by file copy, both files confirmed byte-identical to HEAD.
NO CENSUS BILL, and this was MEASURED not assumed: the lighting walker is GREEN inside car 6's
full gate, because `tests/joins/fieldManifest.test.js` is already PARKED by its own `each` usage,
so its titles are uncredited and adding one moves no figure.

## JUDGMENTS, each vetoable
- Chose to correct the roadmap's table cells IN PLACE quoting the stale text (LT36 car 7's
  idiom) over adding new rows, because a new row breaks the 18-point table's shape and
  quote-and-correct keeps the ask readable beside the finding.
- Chose NOT to run `test:ratchet:update` over running a full ~32,500-test `--update` that SHELLS
  OUT to an unfiltered `npx vitest run` and takes the EXCLUSIVE mutex on a box shared with three
  lanes and the chair's landing chain, because the register's totals are floors and cannot move
  in the failing direction. Receipts quoted.
- Chose to verify car 2 against the installed chromium 1223 through a scratch symlinked
  `PLAYWRIGHT_BROWSERS_PATH` over downloading a ~180 MB browser, because a download is not an
  implementer's call. The caveat is stated rather than hidden.
- Chose a FROZEN_VS_LIVE snapshot row with guards over an ENGINE_FIELD_REGISTRY entry for car 6,
  because a registry entry must list its consumers and `dailyLifeLogic.js` is the only live
  consumer of the raw field, so registering it would ENSHRINE the read the lane is reporting.
- Chose to report the two pre-existing reds rather than fix them, because both live in files
  other lanes own and the voice one would require moving reader-facing prose, which this lane is
  forbidden to do.
- Chose to correct the "two entries" error in cars 5 and 6's bodies and in this report rather
  than rewrite cars 1, 2 and 4, because the shas may already be read and a correction that is
  findable beats a history that is tidy.

## COULD NOT DO
- A green WHOLE chromium e2e suite, and therefore a green `--results` runtime guard over it:
  28 of 41 sibling tests time out under this box's load, and the browser build for this
  playwright version is not installed. My spec's own runtime guard IS green.
- Fix the two pre-existing reds: out of lane scope and, for the voice one, forbidden.

## ALSO FOUND, REPORTED NOT FIXED
`src/components/new/tabHelpers.js:60-70` exports `foodNarrative()`, which renders "a X% food
deficit" from the same engine `deficitPercent`. It has NO importer (`ServicesTab.jsx:8`, the only
`tabHelpers` consumer, takes `computeChainSets` and `computeChainDepthMap` only). It is dead, it
carries the same read, and `tests/lint/economyReadModelCoverage.walker.test.js:182` addresses
`tabHelpers.js` BY FILENAME, so deleting an export from it can red a walker. Recorded in car 5's
document; left alone deliberately.
