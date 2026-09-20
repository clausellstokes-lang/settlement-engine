# FIX-C2b — RECEIPT

**Lane** Opus FIX-C2b · **Chair** Fable 5.1, session a9df403c · **2026-09-20** (stamped 09:19 EDT, `date` in the same call)
**Worktree** `$SP/lane-fix-c2b` · **Branch** `fix-citations-2b-2026-09-20` cut at `ee2406191`
**Ruling** ODQ §934.47 addenda 44, 63, 70, 72, 79 (+ addendum 84, the recorder hazard).
**Composition onto the integration branch is the chair's.**

## Outcome

Built as ruled, measured first, green at the end. **Four pathspec commits; `git status --porcelain` EMPTY.**

| sha | subject | files |
|---|---|---:|
| `0bc7503b8` | FIX-C2b: the war certification file's 42 citations re-addressed by symbol, including a nine-address block off by exactly 811 | 1 |
| `a7cd336bb` | FIX-C2b: the docs-live past-EOF baseline burned 47 rows to zero, and three false exactness claims corrected | 35 |
| `7330a89e9` | FIX-C2b: the town-map citations struck with the commit that deleted them, and MF-UC4's bare addresses re-cut to the lane the rows moved to | 2 |
| `b1c1ac182` | FIX-C2b: the citation walker could not see tests/build, and the bare :NNN form nothing had ever read | 2 |

`git show --stat` on each names only its own paths. None amended. The pre-commit hook rewrote nothing.

⚠ **THE CUT IS BY FILE, NOT BY THE BRIEF'S FOUR UNITS**, and that is a judgment call. Units 3
and 4 both edit `sourceCitationIntegrity.{shared.mjs,walker.test.js}`, and `git add -p` is
forbidden, so commit 3 carries the two *document* cures of units 3+4 and commit 4 carries the
*instrument* half of both. Each commit is still green standing alone: C2's roster move ships with
its baseline (else the roster test reds) and C4's skip-list cure adds zero ARM-1 findings.
*Reverse by* re-splitting at the hunk level, which needs an interactive stage.

---

## Every count line, in the order run

| gate | result |
|---|---|
| `tests/domain/subsystemRowsWar.test.js` | `Test Files 1 passed (1)` · `Tests 27 passed (27)` |
| `tests/domain/roadsParticipation.test.js` | `Test Files 1 passed (1)` · `Tests 8 passed (8)` |
| `npx eslint src/domain/certification/subsystemRowsWar.js` | exit 0, no output |
| `tests/data/dossierStateProseProjection.contract.test.js` | `Test Files 1 passed (1)` · `Tests 79 passed (79)` |
| `tests/build` (6 explicit files, one directory) | `Test Files 6 passed (6)` · `Tests 56 passed \| 42 skipped (98)` |
| `tests/scripts/implementationSession.test.js` | `Test Files 1 passed (1)` · `Tests 10 passed (10)` |
| `npx eslint vite.config.js + 2` | exit 0, no output |
| **`tests/lint` WHOLE** | **`Test Files 1 failed \| 173 passed (174)`** · **`Tests 1 failed \| 2793 passed (2794)`** |
| `tests/copy/voiceMechanics.test.js` | `Test Files 1 passed (1)` · `Tests 30 passed (30)` |
| `npx eslint` (both walker files) | exit 0, no output |
| `node scripts/implementation-packets.mjs validate` | `valid: 193 packets (1 READY)` (re-run after every packet edit) |
| `node scripts/wiring-census.mjs --check` | `verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files` |

Every vitest line ran through `gate-mutex.sh --run`, SHARED tier, `--maxWorkers=2`, both exports
spelled inline, ONE directory per invocation, DEFAULT reporter, and printed a count. eslint ran
BARE. `tests/property/dossierProseManifest.test.js` was **not** swept up by any run.

**THE ONE RED IS THE FROZEN LIGHTING CENSUS AND IT IS INHERITED.** Every other walker in
`tests/lint` is green, including this lane's own: its ARM 3 printed 3 findings and its new ARM 4
printed `666 bare \`:NNN\` address(es) read; 9 point past the end of the file their sentence names`.

---

## The lighting census — measured, NOT refrozen, and I report only what it EVALUATED

The walker ran ONCE, inside the `tests/lint` directory-whole run, and threw at the FIRST figure.
A second dedicated invocation would be byte-identical output for another turn of the shared seat,
so it was not run again. Its own assertion text, verbatim:

```
FAIL tests/lint/sovereigntyLightingContract.walker.test.js
AssertionError: the estate's file count moved — re-measure, do not re-word: expected 2656 to be 2653
- Expected 2653
+ Received 2656
  at tests/lint/sovereigntyLightingContract.walker.test.js:7460
```

| figure | frozen IN MY TREE | evaluated? | measured |
|---|---:|---|---:|
| `files` | 2653 | **YES** | **2656** |
| `parked` | 383 | NO — it threw first | — |
| `credited` | 2270 | NO | — |
| `titles` | 25052 | NO | — |
| `suiteTitles` | 6680 | NO | — |

My tree's baseline is `2653·383·2270·25052·6680`, provenance `7c233db55`. The tuple the chair
named — `2656·383·2273·25074·6684` at `c33446830` — is NOT in my history (my base is `ee2406191`),
which is why the walker here asserts the older one.

**MY DELTA, measured from the committed diff rather than predicted: 0 test files, +3 test titles,
0 suite titles, 0 lighting markers.**

```
test FILES created or renamed ee2406191..HEAD -- tests : (none)
test-file count  base 2656   HEAD 2656
+ test('CONTROL: a bare `:NNN` inherits the NEAREST PRECEDING path, and is convicted past EOF'
+ test('CONTROL: sentenceSpans splits on stops and cells, but not inside a number'
+ test('ARM 4 — REPORT-ONLY: bare `:NNN` addresses past the end of the file their sentence names'
test titles removed: 0   describe added: 0   removed: 0
tests/lint/.lighting-census-baseline.json changed ee2406191..HEAD : (none — NOT refrozen)
```

⭐ **THE RED THE WALKER SHOWED IS NOT MINE AT ALL.** The base already carried 2656 files against a
2653 baseline: **my contribution to the one figure it evaluated is ZERO.** Against the chair's
newer register the `files` figure PASSES, the walker proceeds, and my rows land on a figure it
never reached here — `titles` 25074 → **25077**. ⛔ Not refrozen; the refreeze is the train's
terminal act and the chair's.

---

## 1. The certification file — 42 citations, every one read (`0bc7503b8`)

22 stale addresses + 1 bare number cured, 18 left true with the reason recorded, **line count
unchanged at 771**, so no line-addressed baseline drifts behind it.

⭐ **THE NINE-ADDRESS BLOCK, OFF BY EXACTLY 811.** The war-depth flag reads cited at
`warDeployment.js:1285–1291` all live at `:474–:480`, every one 811 lines earlier, in unbroken
declaration order. FIX-C2 cured the only two whose addresses had crossed EOF (`:1281`→`:470`,
`:1280`→`:469`) and was structurally blind to the other seven, which land INSIDE a 1,339-line
file. **That is the measured proof that ARM 1's "100% coverage" is coverage of RESOLVABLE rot,
not of rot**: one decomposition moved nine addresses and the objective arm convicted two.

⛔ **AND THE FILE DID NOT MOVE BY ONE OFFSET.** The parent gate is at `:243`, cited as `1082` —
off **839**, not 811. An arithmetic cure would have written seven right answers and two wrong
ones. Every address was read.

**Three citations changed MODULE, which no line-shift can express:** `computeAllyRelief`
`warDeployment.js:240`→`warCapacityReads.js:74`; `computeLevySources` `:273`→`warHomeCosts.js:109`;
`capitulation: true` `:971`→`warSiegeVerdict.js:305`.

Also cured: the parent gate at `:20`/`:131` (the second inside a SHIPPED certification string);
`occupation.js:753`→`:1152`; `coup.js:113`→`:103` (×2); `settlementStrategy.js:498`→`:454` (×3);
the header's two malformed emitter LISTS, which named four literals against three addresses —
`deploymentReturn.js:202/334/360/396`→`:284/428/459/496` and `occupation.js:559/687/998`→
`:1426/1522/1086/1571`, now four-for-four in the order the sentence states; `warReasons.js:867`→
`:996`; `peaceReasons.js:505`→`:637`; `warReasons.js:408`→`:378`; `occupation.js:998`→`:1571`;
the bare "inside the gate at 1082"→"at 243".

**JUDGMENT CALL.** At `:171` the shipped string "warHomeCosts.js:365 stamps recordMode state_only"
is re-addressed to `:368`, the line that stamps it; `:365` stays at `:162`, where the sentence
names the EMITTER. One address, two sentences, two claims. *Alternative rejected:* leaving both at
`:365`, in-block and defensible but sending a reader hunting for a verb the line does not hold.
*Reverse by* writing `:365` back.

⛔ **THE CHAIR'S DISPATCH LEAD IS REFUTED BY READING.** `roadsParticipation.test.js:415`'s
`npcVerdictPulse.js:133` for `replacementSource` is **TRUE**: `:133` is the `replaceOustedNpcs(`
call whose base argument sits at `:134`, and its "(bound at :99)" is exact. It is the
`wiring-census.mjs:349` false-positive class verbatim. Untouched.

## 2. The docs-live baseline burned to zero (`a7cd336bb`)

**47 rows / 25 documents → `rows: []`.** ARM 2 measures 0 novel and 0 cleared against an empty
baseline: a pure ratchet at zero.

⛔ **Nine of the 47 were MODULE MOVES behind a barrel, not line drift** —
`advanceCampaignWorld.js` is 39 lines over pulseKernel/advanceInterval, `powerGenerator.js` 13,
`economicGenerator.js` 14, `mutate.js` 227 over `mutate{Entities,World,Helpers}.js`, and
`relationshipEvolution.js` shed its rules into `relationshipRules*.js`.

**THREE false exactness claims, not two** — the third found by re-measuring rather than trusting:
`WF-SUBSTRATE.md:192`'s "ALL EIGHT, EACH AT AN EXACT ANCHOR" is false in **three** of the eight
(`RELIGION_TUNING` :40→:45, `PANTHEON_TUNING` :405→:476, `CRISIS_CONVERSION_TUNING` :143→:149);
FIX-C2 flagged pantheon and left seven unverified — they are verified now. And
`DESIGN_FP_ARCH_INT.md:31`'s "(exact)" (`:45`→`:70`), whose companion had rotted **twice**
(`:306`, then `:339-345`) and is `:743`.

**THE ROSTER MOVED BY ONE, AND IT HID NOTHING.** `docs/GAME_GRADE_AUDIT.md` took the estate's own
HISTORICAL banner (`banner` 7→8, live 483→482, archival 29→30): a 2026-07-24 audit pinning
`composite-r4 @ 69b7a8d3`, untouched since, citing a surface deleted at `43c3ac3805`. **Proof it
buys no green: `pastEofCitationsExcluded` UNCHANGED at 377 and ARM 2 was 0 on both sides.**

## 3. The absent targets, measured against history (`7330a89e9`)

126 distinct / 396 citations at this tip. By corpus: **docs-archival 241 · docs-live 113 · code
42** — and all 42 in code are the walker's own synthetic fixtures and vendored targets.

| target | cites | git verdict |
|---|---:|---|
| `SettlementMapPane.jsx` | 31 (25 arch / 6 live) | **DELETED** at `43c3ac3805` (TE-STRIP-1, 2026-08-29), an ANCESTOR of this tip |
| `useTownMapPresentation.js` | 28 (25 / 3) | **DELETED**, same commit |
| `writers.js` | 27 (27 / 0) | **NEVER COMMITTED on this line** |

⛔ **`writers.js` is a FOURTH sub-class FIX-C2's recon did not separate.** Tested, not assumed: the
atlas's `writers.js:74` claims `validateNpcFacet` and `:20-25` claims `STASIS_REASONS`, while
`settlementPendingEditWriters.js` (the only surviving namesake) holds an id comparison and
`TABLE_AUTHORABLE_EVENT_TYPES` there. The atlas is sha-pinned and says in its own front matter
that several mapped systems "exist only as untracked files" — the target never entered history.

## 4. The instrument (`b1c1ac182`)

⛔ **DEFECT: `SKIP_DIRS` carried a bare `build`, matched at every depth, hiding all 59 files of
`tests/build/`** from the walk and the target index. Paid twice: 7 citations inside them read by
no arm, and 44 elsewhere that NAMED one of them skipped as unreadable — which is why they showed
up as "absent target paths" when the files were there all along (133→126, 438→396 on this cure).
The entry could never have earned its keep: root dirs are unreachable from both callers.

**RED-FIRST, EXECUTED**, plant removed, status clean:
```
pre-cure  skip list:  files=5208   ARM 1 findings=0   <- the mutant is INVISIBLE
post-cure skip list:  files=5268   ARM 1 findings=1
RED: tests/build/__fixc2b_plant.js:1 vendorPdfLazy.test.js:999999 -> tests/build/vendorPdfLazy.test.js (1730 lines)
```

⭐ **ARM 4 — the bare `:NNN` form: 666 read, 9 past-EOF.** 59 in live code, 602 in live docs —
four times ARM 1's whole live-code reach, and nothing had ever read it.

⛔ **It ships REPORT-ONLY for a MEASURED reason.** Two defects found in my own reader first:
(1) last-anchor vs nearest-preceding attribution convicted a TRUE citation (723→661, 53→14);
(2) the attribution is **still** unsound and no knob fixes it — `MF-UC1.md:178`'s bare numbers
inherit a `geographyData.js` named without a line, six of twelve findings are that one sentence,
and restricting to single-path sentences leaves all six (measured: 485 of 661). **The brief
allowed a shrink-only gating baseline; the measurement refused it**, because a ratchet over a set
that is half false positives freezes the heuristic and reds on correct behaviour. Chair decision
point, not built.

Guard-the-guard floors all satisfied and NOT lowered: codeFiles 5267 (≥5000), docs.all 512 (≥480),
docs.live 482 (≥450), seen 939 (≥700), resolvable 885 (≥600), ARM 4's new floor 666 (≥400).

---

## The recorder hazard (ODQ §934.47 addendum 84) — LEDGER: left, recorder file, CURE-J pending

**Vacuous at this tip, and that is measured.** `git status --porcelain` on the three is EMPTY; all
three are walked; **ARM 1 = 0, ARM 3 = 0, ARM 4 = 0 findings inside them.** My certification pass
and docs-live sweep named no citation in any of them.

**The break is at ONE of the three and pre-exists this branch:**
```
MATCH     tests/helpers/dossierManifest.js      5ee87f0b…
MATCH     tests/helpers/goldenMasterCorpus.js   7f09210e…
MISMATCH  scripts/prose-rate-corpus.mjs   live d97c3912…  recorded 0f0efb35…
```
HEAD's sha and the worktree's are both `d97c3912…`. Its whole cause is one hunk in `ee2406191`,
my own base — a **comment**: `` `EconomicsTab.jsx:251-257` `` → `` `:272` `` — against
`_provenance.rows = 1050` with the rowsSha untouched. **A raw-byte recorder pin cannot tell a
docblock from a decision.** A ⛔ refusal naming all of it is now in the walker's header (C4).

## Goldens — UNMOVED, before the first edit and after the last commit

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

## Registers this lane moves when composed (as DELTAS)

- **Lighting census:** 0 files, **+3 test titles**, 0 suites, 0 markers. ⛔ Not refrozen.
- **`.source-citation-baseline.json`:** 47 rows → **0**; `archivalExclusionAtFreeze.byRule.banner`
  7 → **8**; `docsLiveFiles` 481 → 483→482. `pastEofCitationsExcluded` UNCHANGED at 377.
- **The walker's corpus:** codeFiles 5208 → **5267** (`tests/build/` re-admitted); ARM 3 findings
  2 → **3**; ARM 4 is new (666 read / 9 printed).
- **Mutation-coverage manifest / sweep:** untouched — no new plant, no new row.
- **`docs/content/wiring-census.json`:** untouched; `--check` verified unchanged.

## ⛔ Noticed and not touched — each specific enough to slot

1. **ARM 3 is scoped to `CODE_TREES`, so an in-range stale address in a packet header is unseen.**
   Measured: 36 `scripts/**` citations from `docs/implementation/**`, all resolvable, none past
   EOF, but at least five stale in range — `implementation-packets.mjs:425` (claims the
   acceptanceCases cap 8; that arm is ~:663-669), `:429-455`/`:429-456` (claims validate:packets
   step 3), `:466-468` (claims the LANDED existence check; it is :718-719), `:574-581` (DCS-1's
   "unconditional"). All sit in LANDED packets (GR-3B-ORIENT, GR-4A, GR-4B, IN-0C, IN-1A,
   TC-5B-II, ES-DA, DCS-1) as their own frozen evidence. **Widening ARM 3 to docs-live is an
   instrument change with a documented coverage arithmetic → CHAIR DECISION POINT.**
2. **ARM 4's shrink-only baseline was refused by measurement → CHAIR DECISION POINT** (§4 above).
3. **`WC-PREAMBLE.md:70`'s `:1360` (and its correction `:1366`) are now both stale — true is
   `:1294`.** Left deliberately: the preamble's own sentence says "Every line number in the volume
   is an evidence anchor, not an address", and the line is a RECORD of a past sweep's corrections.
   Curing it would edit a measurement. → chair's call.
4. **`ES-5D.md:677`'s `:2031`/`:2563`** are a LANDED packet's DEVIATION D7 record (ratified, chair
   ruling H32) against a 424-line file. Frozen evidence; left, and ARM 4 will print them forever
   unless the chair rules the packet archival.
5. **`MF-UC1.md:178`'s six bare numbers** are ARM 4's documented false-positive family (they
   inherit `geographyData.js`). Curing them means spelling the path — a packet text edit for a
   reader's benefit only. → chair's call.
6. **`safetyProfile.js:234`** (cited by COHESION_REMEDIATION_PLAN.md:120) is in-range and
   unverified by this lane — outside the past-EOF set I was scoped to.
7. **`docs/DESIGN_FP_COUPLINGS.md:510` and `docs/DESIGN_FP_INTERIOR.md:187` cite `coup.js:113-114`**
   for `computeWarSentiment` — the same rot I cured in `src`, true at `:103-104`. In-range, so
   outside commit 2's past-EOF scope. DESIGN_FP_INTERIOR.md:187 also carries
   `warDeployment.js:~2038`, which the `~` hides from the walker entirely.
8. **170 citations resolve to an AMBIGUOUS basename** (29 distinct) and are silently skipped by
   every arm. Unmeasured for truth; the largest remaining blind spot after `build`.
9. **`writers.js` proves a fourth UNRESOLVED sub-class** — a target that existed only in a pinned
   UNCOMMITTED tree. FIX-C2's recon folded it into "absent"; it deserves its own rule if the
   walker ever reports unresolved targets.
10. **`tests/property/dossierProseManifest.test.js` is red at `ee2406191` and therefore at my tip**
    — inherited, owner-gated (§934.71), NOT re-recorded and not run by this lane.
