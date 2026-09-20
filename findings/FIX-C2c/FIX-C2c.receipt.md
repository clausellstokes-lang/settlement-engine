# FIX-C2c — CLOSING RECEIPT

**Lane** Opus FIX-C2c · **Chair** Fable 5.1, session a9df403c · **2026-09-20**, closed 13:39 EDT
(`date` in the same call as every measurement and every gate).
**Worktree** `$SP/lane-fix-c2c` · **Branch** `fix-citations-2c-2026-09-20` cut at `578272a99`
**Ruling** ODQ §934.47 addendum 91 (FIX-C2b's hand-off) + addendum 101 (the chair's four inputs and
the two rulings cited in §7).
**Composition onto the integration branch is the chair's.**

Base verified to carry FIX-C2b's four composed commits as ancestors (`4d4535795`, `cbb4fc4f2`,
`12f5812dc`, `92626a345`), so ARM 4 and the `tests/build` cure are present.

---

## Outcome

Built as ruled, measured first, green at the end. **Three pathspec commits;
`git status --short` EMPTY; none amended; each `git show --stat` names only its own paths.**

| sha | subject | files |
|---|---|---:|
| `808837904` | FIX-C2c: the symbol arm reaches the docs scope behind the manifest's LANDED rule, and the ambiguous basename stops being a silence | 2 |
| `1f3029ffc` | FIX-C2c: the fourth UNRESOLVED sub-class's only live instance struck, and the abbreviated schema address re-addressed by symbol | 1 |
| `2b03bc421` | FIX-C2c: nineteen live-document citations re-addressed by symbol, each read against live source | 15 |

`git diff --stat 578272a99..HEAD` → **18 files changed, 565 insertions(+), 36 deletions(-)**.
All three carry `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (the 2026-09-20 trailer
ruling). The pre-commit hook rewrote nothing.

⚠ **THREE COMMITS, NOT THE BRIEF'S FOUR — a declared judgment call.** Units 1, 2 and 3's header all
edit the same two instrument files and `git add -p` is forbidden; unit 3's only live document and
unit 4's cure inside that same document are one reading pass over one file. Each commit is green
standing alone. *Alternative rejected:* holding the shared gate seat while authoring units 2 and 3
between gate runs. *Reverse by* re-splitting at the hunk level, which needs an interactive stage.

---

## Every count line, in the order run

| gate | result |
|---|---|
| `npx eslint` (both walker files, BARE) | exit 0, no output — **re-run after the memory cures, because the first green predated them** |
| **`tests/lint` WHOLE** | **`Test Files 1 failed \| 174 passed (175)`** · **`Tests 1 failed \| 2820 passed (2821)`** · `Duration 353.03s` |
| `tests/docs` WHOLE | `Test Files 19 passed (19)` · `Tests 146 passed (146)` |
| `tests/domain/treatyLifecycleVoice.test.js` + `brokeragePlantHandoffPins.test.js` | `Test Files 2 passed (2)` · `Tests 40 passed (40)` |
| `tests/property/beliefMapGolden.test.js` + `momentumDormancyGolden.test.js` | `Test Files 2 passed (2)` · `Tests 11 passed (11)` |
| `tests/copy/voiceMechanics.test.js` | `Test Files 1 passed (1)` · `Tests 30 passed (30)` |
| `node scripts/implementation-packets.mjs validate` | `[implementation-packets] valid: 194 packets (0 READY)` |
| `node scripts/wiring-census.mjs --check` | `verified 708 pools / 2266 variants / 165 relation rows against 7 stamped files` |

Every vitest line ran through `gate-mutex.sh --run`, SHARED tier, `--maxWorkers=2`, both exports
spelled inline, ONE directory per invocation, DEFAULT reporter, and printed a count. eslint ran
BARE. ⛔ `tests/property` was NEVER run whole — `dossierProseManifest.test.js` is the inherited
recorder red (§934.71) and is not this lane's.

**THE ONE RED IS THE FROZEN LIGHTING CENSUS AND IT IS EXACTLY THIS LANE'S DECLARED DELTA.** Every
other walker in `tests/lint` is green, including this lane's own five arms.

## ⛔ THE GATE CAUGHT TWO DEFECTS OF MINE, BY PRINTING NO COUNT LINE

The first `tests/lint` run **aborted**: `FATAL ERROR: Zone Allocation failed - process out of
memory`, `Abort trap: 6`, **no count line**. Under the standing law that run DID NOT RUN, so
nothing was claimed from it. Reading my own diff found two real defects, both mine, both cured:

1. **A quadratic join.** `disambiguateToken` re-evaluated `citing.join('\n')` INSIDE the match
   loop — a fresh copy of a million-byte document per match, once per ambiguous citation in it.
   The import rule is now code-files-only (a prose document has no module graph to consult), the
   join is hoisted, and the result is memoised per file.
2. **Sentence-spanning the whole estate.** `ambiguousFindings` computed `sentenceSpans` for every
   line carrying a code extension — **measured: 91,823 lines and 11.5 MB of substring slicing**,
   of which only 9,477 hold any citation and ~169 hold an ambiguous one. The cheap `citationsIn`
   test now gates it.

**Both cures are behaviour-identical, and that is measured, not assumed:** ARM 5 reads `169`,
resolves `98`, opens `71`, by-rule `{extent 86, directory 7, symbol 5}` before AND after; ARM 5's
own time fell 2537ms → 1524ms. The same command that aborted now completes in 353s with a count.

## The lighting census — measured, NOT refrozen

Baseline read from the file rather than quoted: `2664 · 359 · 2305 · 25501 · 6812`,
`measuredAtSha d279d13ebe718f07…`. The walker's own assertion text, verbatim:

```
FAIL tests/lint/sovereigntyLightingContract.walker.test.js
AssertionError: the live TEST-title count moved from SP-C's measured 18,471 … expected 25504 to be 25501
- Expected  25501
+ Received  25504
  at tests/lint/sovereigntyLightingContract.walker.test.js:7469
```

| figure | frozen | evaluated? | measured |
|---|---:|---|---:|
| `files` | 2664 | **YES — PASSED** | 2664 |
| `titles` | 25501 | **YES — threw here** | **25504** |
| `parked` / `credited` / `suiteTitles` | 359 / 2305 / 6812 | NO — it threw first | — |

**MY DELTA, from the committed diff rather than predicted: 0 test files, 0 suites, NET +3 test
titles** (4 added, 1 removed — ARM 3's title was renamed to say it now reads docs). The red is
mine, it is exactly +3, and it is the only figure the walker reached.
⛔ **NOT refrozen** — `git diff --name-only 578272a99..HEAD` names neither
`.lighting-census-baseline.json` nor `.source-citation-baseline.json`.

## Goldens — UNMOVED, before the first edit and at the tip

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```
⛔ The three prose-manifest recorder files are untouched across the whole lane
(`git diff --name-only 578272a99..HEAD` on them is empty).

---

## 1. ARM 3's docs population and its sampled false-positive rate

```
ARM 3 over codeFiles (as shipped):                4
ARM 3 over docs.live (widened, no exclusion):   443
ARM 3 over docs.live MINUS LANDED packets:      223   <- the rule suppresses 220
after this lane's own cures:                    213   (code 4, docs 209)
```
223 findings over 46 documents. Roster: `$SP/lane-fix-c2c-scratch/ARM3-REMAINING-ROSTER.txt`.

**Sample of twenty, systematic (every 11.15th, reproducible not cherry-picked), each read against
live source.** Two rates, because they answer different questions:

| measure | result |
|---|---|
| **LEAD VALIDITY** — does the line lead to a citation that needs re-addressing? | **19/20 · one false positive · 5%** |
| **SYMBOL ATTRIBUTION** — is the named symbol the one the sentence attaches to that address? | **16/20 · four mis-attributed · 20%** |

The one clean false positive is `docs/FABLE_VALIDATION_QUEUE.md:637` — the address belongs to the
first clause; `normalizeEdge` is the second clause's subject and carries no address of its own.

⭐ **THE ASYMMETRY IS THE FINDING, AND IT INVERTS THE ARM'S REPUTATION.** ARM 3's live-CODE half is
almost all false positives; its widened DOCS half is almost all valid leads. Code writes citations
inside dense, backtick-rich comments where a neighbour steals the attribution; docs write
"`symbol` at `path:line`" in prose and tables, where the adjacent backtick IS the subject. Both
rates now print in the arm's own output and header, so no reader can treat a line as a cure.

## 2. The chair's four inputs (addendum 101) — all four measured

| input | verdict |
|---|---|
| `tests/domain/roadsParticipation.test.js:415` | **FALSE POSITIVE**, used as the fixture the chair directed. At this tip the row has moved to **`:480`** (same citation; the file grew). ⛔ Untouched. |
| `tests/lint/dossierMountRegistry.walker.test.js:1287` | **FALSE POSITIVE, newly proved against live source.** `Primitives.jsx:120` is literally `{open && <div style={…}>{children}</div>}` — exactly the construct the sentence names. The sentence attaches `Collapsible` to the BARE `:89`, and `:89` is the SAME construct inside `Collapsible` (declared 67). **Both addresses TRUE.** ⛔ Untouched. |
| `scripts/wiring-census.mjs:349` | **FALSE POSITIVE**, the documented class. ⛔ Recorded, untouched. |
| `[A3s]` 18-row COMPARAND DISAGREEMENT | **NOT ARM 3's, NOT a documents' defect, and NOT a defect** — below. |

**The `[A3s]` answer, measured.** Printed by `tests/lint/generationForkRegistry.contract.test.js:173`
— EM-P2's static arms, a DIFFERENT walker — and it carries no citation at all.
*What it compares:* two LANDING COMPARANDS on each of `GENERATION_TIER1`'s 75 rows.
`onRecordClass` classifies the key's FINAL value against the finished record;
`producedOnRecordClass` classifies **the value that step left in the context**. Both are filled by
EXECUTION in `classify()` (`tests/helpers/generationForkCensus.js`) — one baseline run plus one
perturbed run per registered step over the 63-row census corpus. Different claims (design §22,
chair ruling Q-6), which is why the register carries both.
*Why 18 disagree:* §6.2b says every disagreeing row is a key a LATER step rewrites. **MEASURED FROM
THE LIVE REGISTRY, not transcribed: 18 of 18 have at least one later step that provides-or-mutates
the same key.** Class-pair tally `same vs absent` 7 · `same vs varies` 10 · `varies vs absent` 1;
the seven are exactly the `effectiveConfig` family the test itself pins at its lines 175-177.
*Verdict:* `expect(disagreeing.length).toBe(18)` is a PASSING assertion — 18 is an asserted,
derived design figure and the print exists so a reader can audit the set. No symbol was re-homed,
no index is stale, no citation is involved, nothing here is mine to cure.

⚠ **A FOURTH CODE FINDING THE CHAIR DID NOT NAME — a TRUE positive whose `declaredAt` would cure it
WRONG.** `tests/components/handbookVoice.test.jsx:145` says "AppViews.jsx:46 renders `<HowToUse />`".
`:46` is `CompendiumPanel`'s lazy(); `:47` is `HowToUse`'s lazy() — a DECLARATION, not a render; the
render is at **`:182`**. ARM 3 points at `:47`. Left untouched — commit 4's scope is LIVE DOCUMENTS
and the chair enumerated which code findings to touch (none). → FINDING 3 below.

## 3. The ambiguous-basename ledger — the brief's figure had MOVED

⚠ **THE DISPATCH SAYS "170 ambiguous (29 distinct)"; AT `578272a99` IT IS 166 ACROSS 12.** 170/29 is
FIX-C2's recon figure at `63e40fe57`; `tests/build/` has since been re-admitted to the index and 21
lane commits have composed. I report the measurement.

`citations seen 14834 · resolved 14244 · ambiguous 166 (12 distinct) · absent 424 (143 distinct)`

The shipped arm reads **169** — the extra three are this walker's and the shared module's own
illustrative citations, which are TRUE and which the arm resolves (ARM 4's idiom).
**98 resolved · 71 open. By rule: `extent` 86 · `directory` 7 · `symbol` 5.**

| basename | cites | resolved | candidates |
|---|---:|---:|---:|
| `en.js` | 68 | 62 | 2 |
| `index.js` | 21 | 3 | 13 |
| `institutionServices.js` | 16 | 9 | 2 |
| `index.ts` | 13 | 5 | 32 |
| `chronicle.js` | 12 | 4 | 2 |
| `helpers.js` | 11 | 3 | 3 |
| `Timeline.jsx` | 10 | 3 | 2 |
| `theme.js` | 6 | 0 | 2 |
| `customCategories.js` | 5 | 2 | 2 |
| `customContent.js` | 4 | 4 | 2 |
| `IconButton.jsx` | 1 | 1 | 2 |
| `index.test.ts` | 1 | 1 | 23 |

⛔ **THE RESOLUTION DELIBERATELY DOES NOT FEED ARMS 1 AND 2.** `buildTargetIndex`'s null for an
ambiguous token is the only thing keeping those addresses out of the gating arms; resolving inside
it would hand ARM 1 (live code, NO baseline) and ARM 2 (live docs, a ratchet AT ZERO) a set nobody
has ever checked. `buildTargetIndex` is behaviourally byte-identical — ARM 1 measured 0 and ARM 2
`novel 0 / cleared 0` after.

## 4. The absent-target taxonomy, and PINNED-UNCOMMITTED

⛔ **MY FIRST PASS MIS-CLASSIFIED FOUR TARGETS AND THE SECOND CAUGHT IT.** A per-token
`git log --all -- '<spec>'` anchors the glob on the token's own leading segment:
`fog/SettlementMapFogControls.jsx` came back "never in history" while
`*SettlementMapFogControls.jsx` finds nine commits. Re-measured against the WHOLE history path set
in ONE pass (69,042 paths → 208,705 suffix keys).

`424 citations / 143 tokens` — DELETED-or-RENAMED **307** (dominated by TE-STRIP-1…4) · SYNTHETIC
**32** · MISPATHED **13** · VENDORED · ABBREVIATED · **PINNED-UNCOMMITTED** (no suffix match
anywhere in history AND a citing document that records a tree hash or a date).

⭐ **THE MEASURED CONSEQUENCE IS WHY THE CLASS NEEDS NAMING RATHER THAN CURING: every
PINNED-UNCOMMITTED citation already sits inside an archival document or a LANDED packet, EXCEPT
ONE** — `docs/DESIGN_REALM_MAGIC_TOGGLE.md`'s `WorldMap.js:758-770`, struck in `1f3029ffc` with its
reason. There is nothing to re-address, because there is no file to re-address to.
`gitWorkflow.js` was reclassified OUT of the class on reading: it is lint-staged's own source.

## 5. The twenty cures — before/after, each read against live source

Applied through `$SP/lane-fix-c2c-scratch/cure-citations.mjs`, which refuses a row that does not
match EXACTLY ONCE and refuses a row that changes a file's line count. **`git diff --numstat` shows
every document at +N/−N with equal counts — no line-addressed anchor below any edit moved**
(FIX-C2b's second law). Every new address was checked in range against its target's length, so ARM
2 gained nothing.

The full table is in the commit bodies of `1f3029ffc` (2) and `2b03bc421` (19). The four that carry
a finding beyond the address:

- `DESIGN_FP_COUPLINGS.md:512` / `DESIGN_FP_INTERIOR.md:187` — `warDeployment ~:2038` →
  `warHomeCosts.js:517-520`. ⛔ **THE TILDE HID IT FROM EVERY ARM**: `warDeployment.js` is 1,338
  lines, so `~2038` is past EOF, and it holds no `public_legitimacy` at all.
- `FABLE_VALIDATION_QUEUE.md:7487` — `userEdits.js:307-310` → `:314-325`. **ARM 3 pointed at `:374`
  and would have cured it WRONG**: `['plotHooks']` is an array ELEMENT `declarationLines` cannot see.
- `PHASE4_FAITH_DELTA.md:312` — `religionState.js:491-513` → `:614`. ARM 3 named `faithProfile` (a
  local const at `:641`) out of the property path `config.faithProfile.piety`; the sentence names
  `projectReligionStateOntoSettlement`.
- `DESIGN_REALM_MAGIC_TOGGLE.md:546` — `schema.js:1569` → `settlement.schema.js:1655-1668`.
  ABBREVIATED **and** stale, which is why no arm could see it: `schema.js` matches no file.

## 6. A hazard this lane tripped inside its own control

⛔ **A CONTROL'S SYNTHETIC LITERALS WERE READ AS REAL CITATIONS BY THE ARM THE CONTROL PROVES.** The
first draft named its fixtures `en.js` and `theme.js` — both REAL ambiguous basenames here — and
ARM 5's population jumped 168 → 174 on six of the control's own string literals. Renamed to
`__c2cCopy.js` / `__c2cTheme.js`, which name no file in this tree, with a
`synthetic-citation-names:` declaration above them. The run-19 fixture law arriving in a new
directory — and here the walker reading the fixture was the one in the same file.

---

## 7. THE TWO FINDINGS THE CHAIR RULED ON (addendum 101), written as findings

**FINDING 1 — 209 ARM 3 leads remain over 45 documents.** Roster with per-document counts and every
line: `$SP/lane-fix-c2c-scratch/ARM3-REMAINING-ROSTER.txt` (top: GEOPOLITICAL_WAR_LAYER 18,
DESIGN_FP_ARCH_GR 16, FABLE_VALIDATION_QUEUE 13, DESIGN_FP_ARCH_SP 12, DESIGN_FP_ARCH_TR 12,
EP-SUBSTRATE 11, DESIGN_FP_ARCH_INT 9, PHASE4_FAITH_DELTA 9, TEMPORAL_AUDIT 9).
**CHAIR RULING: these are FIX-C2d, a lane of its own chartered this sitting, with this lane's cure
harness (`cure-citations.mjs` — single-match, line-count-invariant) as its instrument.** Not a
deferral. The measured reason a cure lane is required rather than a sweep: at 5% lead-invalidity,
curing 209 unread leads writes ~10 WRONG addresses over correct ones, and at 20% attribution error
a cure driven by `declaredAt` rather than by the sentence writes more.

**FINDING 2 — the RECORD CLASS, named.** Four of the twenty sampled findings sit in rows that are
RECORDS of a past measurement:
`DESIGN_FP_ARCH_CW.md:44` (a survey REFUTATION row — "REFUTED AT THE SURVEY … CW-0w WIDENED the
pin"), `DESIGN_FP_ARCH_SP.md:142` (a survey refutation — "NO exported `alignmentOf` exists
anywhere"), `TEMPORAL_AUDIT.md:99` (an audit PASS row quoting `updatedAt: stressor.updatedAt ||
stressor.createdAt`, an expression that no longer exists — `grep createdAt
src/domain/worldPulse/stressors.js` returns nothing), and `COHESION_REMEDIATION_PLAN.md:114` (a
range naming a catalog rather than a line).
**CHAIR RULING: a survey/audit/review row is a historical record — it is ANNOTATED, never
re-addressed; a landed record is annotated, never rewritten, the same law as a landed packet.
FIX-C2d's brief gives the walker an explicit records roster plus an inline as-of mark the walker
honours. Nothing changes for it now**, and nothing was changed: all four are untouched at this tip.

## ⛔ Noticed and not touched — each specific enough to slot

1. **FINDING 1 above — FIX-C2d** (chair-chartered this sitting).
2. **FINDING 2 above — the record class** (chair-ruled: annotate, never re-address; FIX-C2d's brief
   carries the roster and the as-of mark).
3. **`tests/components/handbookVoice.test.jsx:145`'s `AppViews.jsx:46` → `:182`.** A one-token cure
   in live test-comment text, outside this lane's documents scope, and a standing example that
   ARM 3's `declaredAt` (`:47`) is not the cure. → a slot.
4. **`theme.js`'s six citations resolve to nothing and never will under the current rules** — two
   candidates, both long enough, no directory fragment, no import, no declared symbol. Only a
   fourth rule (nearest-import-in-the-same-DOCUMENT, or a heading-scope rule) would move them.
   → measurement, not a bug.
5. **The ABBREVIATED class is unrepaired and is a real reader trap**: `packets.mjs`, `session.mjs`
   and `test.js` inside LANDED packets read as true prose and false addresses. They are frozen
   evidence, so they stay — but an ARM could suffix-match a token against live basenames and print
   "did you mean `scripts/implementation-packets.mjs`?". → a slot, instrument-only.
6. **MISPATHED, 13 citations**, led by `src/domain/spatialSubstrateRead.js` (live at
   `src/domain/spatial/spatialSubstrateRead.js`, cited by `docs/FABLE_VALIDATION_QUEUE.md:7487` and
   `docs/SITE_COHERENCE_AUDIT.md`). Curable by a one-segment path fix; not in this lane's scope.
7. **ARM 4's nine past-EOF findings are unchanged and none is this lane's** — `ES-5D.md:677` and
   `MF-UC1.md:178` remain the chair's, exactly as FIX-C2b left them; `WC-PREAMBLE.md:70` likewise.
8. **`tests/property/dossierProseManifest.test.js` is the inherited recorder red** (§934.71) — not
   run, not cured; `tests/property` was never run whole, for that reason.
9. **`docs/DESIGN_REALM_MAGIC_TOGGLE.md:114` carries one more ARM 3 lead**
   (`composeInstantWorld.js:180` / `settType` declared at `:139`) which I did NOT cure — it was
   outside the twenty I sampled and needs reading against the instant-world composer. → FIX-C2d.
10. **The brief's two population figures were both stale at my tip and I report the measurement:**
    ambiguous 170/29 → **166/12**; absent 357 → **424/143**. Neither is a defect; both are what a
    figure quoted from an older base does.

## Registers this lane moves when composed (as DELTAS)

- **Lighting census:** 0 files, **+3 test titles**, 0 suites, 0 markers. ⛔ Not refrozen.
- **`.source-citation-baseline.json`:** UNTOUCHED — still `rows: []`, `archivalExclusionAtFreeze`
  unmoved; the measured `byRule` `{banner 8, dated 5, sha-pin 1, tree 16}` still matches it exactly.
- **The walker's corpus:** ARM 3 `codeFiles`-only → `codeFiles + docs.live − LANDED packets`
  (4 → 213 findings, 5,278 → 5,569 files); ARM 5 is new (169 read / 98 resolved / 71 printed).
- **`tests/lint` file count:** 175 (was 174 at FIX-C2b) — the extra file is another lane's; this
  lane created and renamed ZERO test files.
- **Mutation-coverage manifest / sweep:** untouched — no new plant, no new row.
- **`docs/content/wiring-census.json`:** untouched; `--check` verified unchanged.
