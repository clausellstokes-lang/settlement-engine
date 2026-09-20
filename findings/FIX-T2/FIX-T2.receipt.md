# FIX-T2 — RECEIPT (source-text ratchets that count their own literal in prose)

Lane: Opus FIX-T2. Chair: Fable 5.1, session a9df403c. Stamped 2026-09-20 09:17 EDT
(`date` read in the same call as the staging check).
Worktree `$SP/lane-fix-t2` · branch `fix-ratchet-comments-2026-09-20` · base `6a3e8089f`.

**STATUS: COMPLETE.** Two commits on `fix-ratchet-comments-2026-09-20`:
**`f2e2e54fa`** (the target cure) and **`6d7a73a12`** (the sweep). Working tree CLEAN,
no untracked survivor, goldens byte-identical, the lighting register untouched.
Every figure below is EXECUTED.

## 0. EVERY COUNT LINE, IN THE ORDER RUN

| # | command | result |
|---|---|---|
| 1 | `significanceMigration.census` UNEDITED at base | **Test Files 1 passed (1) · Tests 12 passed (12)** |
| 2 | `significanceMigration.census` CURED | **Test Files 1 passed (1) · Tests 12 passed (12)** |
| 3 | counterforce (a) PRE-CURE ratchet + planted comment | **Test Files 1 failed (1) · Tests 1 failed \| 1 passed (2)** — `a NEW silent Suspense boundary appeared (39 > 38)` |
| 4 | counterforce (a2) my own bug: `codeOnly is not defined` | **Tests 1 failed \| 5 passed (6)** — fixed by importing both |
| 5 | counterforce (b) CURED ratchet, SAME plant present | **Test Files 1 passed (1) · Tests 6 passed (6)** |
| 6 | `tests/lint` WHOLE | **Test Files 1 failed \| 173 passed (174) · Tests 1 failed \| 2794 passed (2795)** |
| 7 | `npx eslint` (6 touched files) | **exit 0** |
| 8 | `npx eslint src/components/pricing/PricingTierCards.jsx` | **exit 0** |
| 9 | `tests/copy` | **Test Files 12 passed (12) · Tests 151 passed (151)** |
| 10 | the 5 cured detectors, on the COMMITTED tree | **Test Files 5 passed (5) · Tests 24 passed (24)** |

⛔ `tests/lint` WHOLE's single red is the lighting census and nothing else. Its report-only
SYMBOL ARM printed 3 citation drifts — `tests/domain/roadsParticipation.test.js:415`,
`tests/lint/dossierMountRegistry.walker.test.js:1287`, `scripts/wiring-census.mjs:349` — and
an `[A3s]` 18-row comparand disagreement. **None is mine**; all are report-only and
pre-existing. Recorded here so they are not re-found as new.

⚠ **ROW 4 IS MY OWN DEFECT, KEPT IN THE RECORD.** The fourth guard-the-guard arm used
`codeOnly` while I had imported only `commentsOnly`. It was caught by the counterforce run
itself, one line changed to import both, and the arm now does its job. A red-first cycle
that surfaces the author's bug is the cycle working.

---

## 1. THE COMMENT-RESIDENT POPULATION, PER PIN (CONFIRMED, plain `node`)

Both arms measured over the ratchet's own corpora, with each match's offset classified
against `@babel/parser`'s comment ranges.

### `BARE_LOADING_PIN` — `/['"`>]Loading\b/g` over `src/components` (575 files)
RAW **32** · comment-resident **3** · code-only **29**

| address | the line |
|---|---|
| `src/components/gallery/GalleryTopbar.jsx:81` | `text transitions 'Loading <nouns>...' → 'N <qualifier> <noun(s)>'` |
| `src/components/loadingJourney/RealmUnfurlLoading.jsx:22` | `* "Loading…" status line remains the a11y floor and is left untouched.` |
| `src/components/map/WorldMapStage.jsx:285` | `skips the iframe). Decorative — the toolbar "Loading…" line is the a11y` |

### `NULL_FALLBACK_PIN` — `/fallback=\{null\}/g` over `src` (2,247 files)
RAW **38** · comment-resident **1** · code-only **37**

| address | the line |
|---|---|
| `src/components/perimeter/TurnstileGate.jsx:12` | `*     <Suspense fallback={null}>` |

That last one is the match that reddened FIX-P3's gate and cost that lane a cycle.

**Every one of the four is a sentence ABOUT the debt, counted AS the debt.** Two of them
(`RealmUnfurlLoading`, `WorldMapStage`) are notes explaining that an a11y floor is
deliberately left alone — the ratchet was charging authors for documenting a decision.

## 2. THE STRIP — `commentsOnly`, and why it is not a 44th copy

Added as a second named export to `tests/helpers/codeOnlySource.js`, the estate's declared
home for source strips. **Purely additive: `git diff` reports ZERO deleted lines**, so
`codeOnly` is byte-identical and its 22 importers are untouched.

`codeOnly` was the wrong tool and the header now says so at both ends: it blanks string and
template CONTENTS, and **both patterns live inside literals** — `['"`>]Loading` matches a
string or JSX-text prefix, `fallback={null}` is JSX. Measured on the fixture, `codeOnly`
drives the arms to 1 and 1 instead of 4 and 1.

### The fixture proof — INLINE, no new file
The fixture is a **string constant inside `tests/lint/loadingNarrationRatchet.test.js`**
(`STRIP_FIXTURE`). It is not a file under `tests/fixtures/` and it is not a new test file —
**this lane creates no file at all.** Ten lines, one per shape: a `//` comment, a `/* */`
comment, a JSX `{/* */}` comment beside a real `fallback={null}` prop, a single-quoted
string, a template literal with `${}`, a regex literal containing a `"`, a string containing
`//` followed by a real trailing comment, bare JSX text, a JSX self-close `/>` after a `}`,
and a genuine `/>/ ` regex followed by a comment.

Executed (ungated `node`, the arms' exact expectations):
```
RAW  bare=9 (arm expects 9)   null=5 (arm expects 5)
CODE bare=4 (arm expects 4)   null=1 (arm expects 1)
codeOnly bare=1 (arm expects 1)   null=1 (arm expects 1)
length preserved: true   lines: true
line3 keeps the prop: true   drops the comment: true
```

### The differential — the strip agrees with a real parser, byte for byte
Over **5,148 files** (`src` + `tests` + `scripts`), every character the parser calls a
comment must be blank and every other character must be identical:

```
variant                             comment KEPT   code BLANKED
SHIPPED                                        0              0
ABLATION A no-regex-tracking              112600           5771   (230 files)
ABLATION B no-JSX-guard                       24              0   (1 file)
ABLATION C interpolations-skipped            572              0   (11 files)
```

Each ablation is a piece of the scanner proved load-bearing by execution, not by argument:

* **A** — without regex-literal tracking the scanner blanks 5,771 characters of real CODE.
  This is TOOL-7 §5 class 2, measured here at its true size.
* **C** — the first cut of this function skipped `${…}` whole and I declared the comment
  inside one a cannot-catch. The differential refuted my own declaration in the tree's own
  source: `src/domain/display/defenseDisplay.js:379` writes
  `` `Upkeep underfunded: ${…Math.round(/** @type {number} */ (gate) * 100)}%` ``.
  I rewrote the scanner to re-enter interpolations rather than ship the false claim.
* **B** — `/>` is genuinely ambiguous. Six candidate rules were scored; `d !== '>'` alone
  leaves 26 characters standing in `tests/domain/amnestyJubileeRegistration.test.js` (a real
  `/>/ ` regex) and no gate at all leaves 24 in `tests/ui/CommandPalette.test.jsx` (JSX).
  Requiring the `>` to be closed immediately by `/`, AND abandoning a scan that runs into a
  `//`, each reach zero alone; **both ship**, each closing the other's only observed failure.

## 3. THE PINS — lowered, shrink-only, banked in the file's own idiom

| pin | before | after | why |
|---|---:|---:|---|
| `BARE_LOADING_PIN` | 32 | **29** | 3 matches lived in comments |
| `NULL_FALLBACK_PIN` | 38 | **37** | 1 match lived in a comment |
| `BUTTON_BUDGET` (rawButtonBaseline) | 39 | **36** | 3 matches lived in comments |

Nothing was raised. The file's header rule was **overturned, not left contradicting the
code**: `loadingNarrationRatchet.test.js` used to declare "COMMENT lines included by design",
and that sentence is now replaced by the amended rule with FIX-P3's cycle named as the cost.

## 4. THE COUNTERFORCE — EXECUTED

`// a silent boundary explained: fallback={null}` planted in
`src/components/HomeHero.jsx`; the tree-wide raw count moved **38 → 39**, verified by
`grep -ro` before and after the plant.

| body | result |
|---|---|
| PRE-CURE (`git show 6a3e8089f:…`), plant present | **Tests 1 failed \| 1 passed (2)** — `expected 39 to be 38`, message `a NEW silent Suspense boundary appeared (39 > 38)` |
| CURED (restored from the index), SAME plant present | **Tests 6 passed (6)** |

The pre-cure ratchet convicts a sentence; the cured one cannot see it. Plant withdrawn with
`git checkout --` on a file this lane itself dirtied, and the restore PROVED:
`src/components/HomeHero.jsx` =
`6a136dee0aecb656de8d74690743abde36f4a1195860f2a10bfa1f44f688780d` before and after, raw
count back to 38, and the lane's final diff touches **0 files under `src/`**.

## 5. THE SWEEP LEDGER — `tests/lint`

**Denominator.** The brief's grep (`readFileSync(...).match(`) finds exactly **1** file, which
is why I widened it: a structural scan of all **178** `tests/lint` files for (reads source)
AND (accumulates a match count) AND (compares to a number) yields **54 candidates**, which I
then dispositioned from each file's own code rather than from its name.

**FOUND 7 in the class proper** — a detector that walks a source tree and compares an
occurrence total or a file-membership list to a pin, over RAW text.
**CURED 5 · LEFT 2 (both with reasons).**

| # | instrument | verdict | measured |
|---|---|---|---|
| 1 | `loadingNarrationRatchet.test.js` | **CURED** | ⛔ LIVE: 3+1 comment-resident; pins 32→29, 38→37 |
| 2 | `rawButtonBaseline.test.js` | **CURED** | ⛔ LIVE: RAW 39 / code 36; budget 39→36; one baseline row struck |
| 3 | `significanceMigration.census.test.js` | **CURED (gated, hygiene)** | exposed, 0 live — my "LIVE" call was WRONG and is withdrawn in **§6**; raw == stripped in all three classes |
| 4 | `errorCopyBaseline.test.js` | **CURED** | exposed, 0 live: budget 0 unmoved |
| 5 | `forkedColorBaseline.test.js` | **CURED** | exposed, 0 live: ceiling 0 unmoved |
| 6 | `clampPrimitiveBaseline.test.js` | **LEFT** | already strips — but with a STRING-BLIND regex pair (§7) |
| 7 | `slugifyIdiomBaseline.test.js` | **LEFT** | same: already strips, string-blind pair (§7) |

**LEFT BY DESIGN, named as the brief asks.** `negativeAssertionAnchor.walker.test.js` counts
`// anchored:` markers — it counts COMMENTS ON PURPOSE and a strip would blank its entire
subject. It is the canonical member of the leave-alone class. `sizeBaseline.test.js` is
immune by construction rather than by care: it measures through eslint's own `Linter` under
`max-lines {skipComments: true}`, so no strip is owed.

**The 47 other candidates** are not the class: they are structural extractors that locate a
declaration and assert it once (`expect((src.match(/X:/g)||[]).length).toBe(1)`), or they
read `.md` / `.json` / SQL corpora that carry no JS comments. A comment can perturb some of
them, but a duplicate-in-a-comment there produces a *locatable* extraction failure, not a
silent drift in a debt meter. Widening the cure to all of them is a different lane; I name
the shape here rather than half-doing it.

## 6. ⛔ MY OWN "SECOND LIVE INSTANCE" WAS WRONG — WITHDRAWN AND RECONCILED

**I reported that `tests/lint/significanceMigration.census.test.js` was RED at `6a3e8089f`.
It is not. The claim was mine and it was an inference, not a reading.**

The chair asked for a reconciliation against run 21 (the full check at `c33446830`, one
commit before my base), which named exactly ONE red and it was not this file. The
reconciliation is in the test's own gating, three lines above where I had been reading:

```js
/** The one module allowed to speak the family's words as its own vocabulary. */
const FAMILY_HOME = 'src/domain/worldPulse/bandFamilies.js';          // :55
  .filter((f) => f.rel !== FAMILY_HOME)                              // :88
```

`FAMILY_HOME` **is** `bandFamilies.js` — the very file I named as the offender. The census
excludes it by name, because it is the family's own home and is entitled to speak the words.
I never read the constant; I assumed it was `src/domain/realm/significance.js` and built a
measurement on the assumption. Re-measured with the real exclusion:

| class | RAW | COMMENT-STRIPPED | pin | verdict |
|---|---|---|---|---|
| A | 40 occ / 20 files | 40 / 20 | 40 / 20 | **GREEN at base** |
| B | 5 occ / 3 files | 5 / 3 | 5 / 3 | **GREEN at base** |
| C | 2 occ / 2 files | 2 / 2 | 2 / 2 | **GREEN at base** |

`SRC_FILES` denominator 2,246 (the test asserts > 500). **Raw equals comment-stripped in
every class**, so this instrument has NO comment-resident match and never had one — its one
prose mention is inside the one file it already excludes. No env gate and no
`check-test-ratchet.mjs` exclusion is involved; the answer was the test's own constant.

**Disposition corrected: EXPOSED, NO LIVE INSTANCE** — the same class as `errorCopyBaseline`
and `forkedColorBaseline`, not a live defect. Per the chair's ruling it still lands as
hygiene: the cure moves no pin and no frozen list, and step 1 of the gated batch now runs it
UNEDITED to **confirm GREEN** (not, as I first wrote, to confirm red) before the edit goes in.

**The lesson, recorded rather than buried:** I navigated by assumption on a constant I had
not read, in a file I had only grepped. Every other figure in this receipt was measured
against the code or a parser; this one was measured against my own guess, and it is the only
one that was wrong.

## 7. THE LOCAL-COPY CENSUS — TOOL-20's input (the chair's ask)

**51** files under `tests/` + `scripts/` define their own comment stripper.
**27 are STRING-BLIND** — a `replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'')`
pair with no quote tracking, so a `/*` inside a string eats code. **11 of those 27 are also
TRAILING-BLIND**: their line arm is anchored `^\s*//`, so they never remove an end-of-line
comment at all — the exact shape that bit FIX-P3.

Two of the 27 are the baselines I dispositioned as "already strips" in §5
(`tests/lint/clampPrimitiveBaseline.test.js`, `tests/lint/slugifyIdiomBaseline.test.js`), so
those two are **partially** cured, not done — that is why they are LEFT rather than CLEAN.

Full marked ledger: **`$SP/lane-fix-t2-scratch/local-strippers.ledger.md`**, every one of the
51 tagged `[BLIND]`, `[BLIND +TRAILING-BLIND]` or `[ok/other]`. The 27 string-blind:

```
tests/build/contentIdentityLazy.test.js          tests/domain/townCartographyWards.test.js
tests/build/tableClerkLazy.test.js               tests/domain/treatyOrientationWr10g.test.js
tests/components/frozenTenseDefenseCopy.test.js  tests/generators/narrativeDeadCategory.test.js
tests/components/g5FirstSurveyCopy.test.js       tests/generators/neighbourRelDynamics.test.js
tests/components/g5FirstSurveyPdfTwins.test.js   tests/joins/crisisTripleSync.test.js
tests/components/versionsTabPitchHonesty.test.js tests/joins/labelJoins.test.js
tests/domain/dmFieldProjection.test.js           tests/lint/analyticsTrackPropsPrivacy.test.js
tests/domain/domainWallClock.test.js             tests/lint/clampPrimitiveBaseline.test.js
tests/domain/espionageProducts.test.js           tests/lint/deepCloneHotPath.test.js
tests/domain/events/predicateParity.walker.test.js  tests/lint/dialogExit.walker.test.js
tests/domain/events/realmCoverage.walker.test.js    tests/lint/factionNamePrecedenceScan.test.js
tests/domain/guidanceRegistry.walker.test.js        tests/lint/premiumGateSingleSource.test.js
tests/domain/temporalGates.w0.test.js               tests/lint/publicIdentitySingleRender.walker.test.js
                                                    tests/lint/slugifyIdiomBaseline.test.js
```

**TOOL-20 routing, per the chair's ruling:** a detector that COUNTS a literal or reports a
`file:line` takes `commentsOnly`; a pin asking "is this the same code?" takes CURE-J's
`stripComments`. Each conversion is an import plus a call site.

## 8. CURE-J — TWO INSTRUMENTS, ACCEPTED BY THE CHAIR (ODQ §934.47 addendum 90)

**RULED: not a duplicate.** CURE-J's `stripComments` is DIGEST-grade; `commentsOnly` is
COUNTER-grade. `tests/helpers/codeOnlySource.js`'s header now carries the one-sentence
cross-reference the ruling requires, naming CURE-J's file, its commit `c127cdfb2`, its
contract and when to reach for it instead.

⛔ **THE RECIPROCAL SENTENCE IS OWED AND IS NOT MINE TO WRITE.** CURE-J's header should name
`commentsOnly` the same way, but `tests/helpers/dossierManifest.js` is a prose-manifest
RECORDER file, and my base `6a3e8089f` does not even carry CURE-J's version of it. Writing
there would both breach the recorder rule and collide at composition. **SLOT: whoever holds
CURE-J adds the return reference at composition time.**

The measured basis for the ruling, restated here because the header cites it:

* `c127cdfb2` is reachable from the object store, but **`6a3e8089f` does not carry the
  export** — `git grep stripComments -- tests/helpers/dossierManifest.js` is EMPTY in my
  tree. Rebase and cherry-pick are forbidden, so an import cannot be proved green here.
* **The counts are identical**: BARE_LOADING 32 → 29 / 29, NULL_FALLBACK 38 → 37 / 37. The
  whitespace collapse moves neither counter, exactly as the chair predicted — now measured.
* **They diverge on interpolation comments, and the divergence runs against a counter.**
  CURE-J's header calls keeping them "the safe direction" for a digest. Executed on
  `src/domain/display/defenseDisplay.js:379`: `commentsOnly` blanks the comment, CURE-J's
  `stripComments` keeps it. A kept comment is a counted comment.
* CURE-J's also removes text and collapses whitespace, destroying offsets; mine blanks in
  place, so a match keeps its true `file:line` for any adopter that reports addresses.

**Reversal cost if vetoed:** delete `commentsOnly` and swap the import in all cured ratchets
after CURE-J composes. No pin changes — the numbers are the same either way.

## 9. JUDGMENT CALLS (each vetoable)

1. **`commentsOnly` lives in `tests/helpers/codeOnlySource.js`**, not in a new helper file
   and not inlined per ratchet. Alternative rejected: a new `tests/helpers/commentOnlySource.js`
   — a new file opts into every walker governing `tests/helpers` and splits the strip family
   across two homes for no gain. Reverse by moving the export; no call site changes shape.
2. **Both `/>` guards ship**, where one would reach zero. Alternative rejected: the single
   rule — with one guard each variant still has a measured failure shape; with both, none.
3. **The significance census is CURED as hygiene, not slotted** — per the chair's ruling,
   now that §6 has established it is green and the cure moves no pin and no frozen list. Had
   the numbers moved, I would have slotted it rather than re-base another program's census
   mid-migration. Reverse with one `git checkout --`.
4. **`PricingTierCards.jsx` is struck from `scripts/.raw-button-baseline.json`** rather than
   kept as a harmless row. Its only `<button` is the comment recording that the extraction
   already converted it — a stale entry preserved by the sentence announcing the migration,
   which is exactly what that ratchet's "no stale entry lingers" arm exists to catch. The
   cost is that it loses its `jsx-hygiene/no-raw-button` exemption, so **step 4 lints that
   file by name**; if it errors the row goes back and the budget is 37, not 36.
5. **The mutation-manifest rows are left at `{"kind":"uncovered"}`** for all four touched
   `tests/lint` files. `uncovered` is an admission, not a claim, so the new guard-the-guard
   arms do not falsify it. Upgrading `loadingNarrationRatchet.test.js` to a `rationale` /
   `self-proving-meta` row is defensible now that it plants its own fixtures — **SLOT for the
   chair**, not taken unilaterally, because a row upgrade is a claim about coverage.
6. **The sweep stops at the 7 members of the class proper.** Widening to the 47 structural
   extractors is named in §5 rather than half-done.

## 10. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **`tests/design/deepCraftKillList.test.js`** is the precedent
   `loadingNarrationRatchet.test.js` cited for the rule I just overturned, and it reads RAW
   lines (`readFileSync(f).split('\n')`) against `CEILINGS` at :39/:47. It is in
   `tests/design`, outside this brief's `tests/lint` scope. **SLOT:** same cure, one import.
2. **`rawButtonBaseline.test.js`'s header asked for this cure and was refused twice** ("TWICE
   NOW the detector has counted prose… the habitat cure… is chair-gated and reported, not
   taken here"). The gate has now been paid three times. The header's stated fear — that the
   cure "would move the measurement basis for 3 further files that carry prose mentions
   ALONGSIDE real raw buttons" — is **measured and true**: those files are `HomeHero.jsx` and
   `AuthPanel.jsx` (which stay in the baseline, only their counts drop) and
   `PricingTierCards.jsx` (which leaves it entirely).
3. **The 27 string-blind local strippers** (§7) — one hoist lane.
4. **`tests/helpers/sourceContract.js:245`** — `statementWindowAt`, the estate's declared
   fail-closed chokepoint, still brace-counts RAW source. TOOL-7 §9.6 raised it; it is still
   open and it is now the only shared extractor without a strip beside two that have one.
5. **`significanceMigration.census.test.js` calls `tally(CLASS_A)` with a shared `/g` regex
   object** rather than a factory. `String.prototype.match` resets `lastIndex`, so it is safe
   today — but the file beside it (`loadingNarrationRatchet.test.js`) uses a factory and says
   in a comment why. **SLOT:** make the idiom one idiom before someone switches to `exec`.
6. **This lane never ran `tests/design`, `tests/build` or `tests/application`**, which hold
   3 of the strippers named above. If the chair widens the sweep, those directories come with
   their own walker bills under the create/rename law.

## 11. GOLDENS — identical at base and at the pause

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```
No `UPDATE_GOLDEN`, no `GOLDEN_SHIFT_SIGNED`, no refreeze, no reset, no amend, no push, no
`--no-verify`. The three prose-manifest recorder files are unmodified — `git diff 6a3e8089f`
against all three is EMPTY; CURE-J's helper was only READ from the branch
(`git show c127cdfb2:…`) into scratch for measurement.

⚠ **The foreign stash, stated exactly:** I ran `git stash list` ONCE, read-only, in the final
state check; it printed the single expected entry. Never applied, dropped or cleared, and no
`git stash` appears in the gated batch. The addendum forbids listing, so I record the one
read rather than claim I made none.

## 12. REGISTERS THIS CHANGE MOVES WHEN COMPOSED (as DELTAS)

* **lighting census** — MEASURED `+0 files · +0 parked · +0 credited · +4 titles ·
  +1 suite title`; never refrozen. The walker evaluated **`expected 25078 to be 25074`**
  against the register `2656·383·2273·25074·6684` (measured at `f4c395e2d`). The files,
  parked and credited arms PASSED before it, so **the base's own distance is ZERO and the
  red is entirely this lane's** — contrary to the expectation that it would red by other
  hands. Per-file deltas confirm it: all +4 titles and +1 suite come from
  `loadingNarrationRatchet.test.js`; the other five touched files contribute 0.
  Tuple after this landing: **`2656·383·2273·25078·6685`**.
* **`scripts/.raw-button-baseline.json`** — one row REMOVED (31 → 30):
  `src/components/pricing/PricingTierCards.jsx`, migrated long ago, held by prose.
* **`tests/lint/rawButtonBaseline.test.js`** — `BUTTON_BUDGET` 39 → 36.
* **`tests/lint/loadingNarrationRatchet.test.js`** — two pins, 32 → 29 and 38 → 37.
* **mutation-coverage manifest** — NO ROW OWED and none changed: no test file created or
  renamed, so `enumerateInvariants` is unmoved, and all four rows stay `uncovered` (§9.5).
* **`tests/lint/significanceMigration.census.test.js`** — MOVED NOTHING, as predicted: 12
  passed before the cure and 12 passed after, no pin and no frozen list touched.
* **`scripts/.raw-button-baseline.json`'s removed row is a REAL eslint scope change** —
  `PricingTierCards.jsx` loses its `jsx-hygiene/no-raw-button` exemption. Linted by name:
  **exit 0**, so the row does NOT return and `BUTTON_BUDGET` is **36**, not 37.
