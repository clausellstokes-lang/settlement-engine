# FIX-C2 — the `<path>:<line>` citation estate, measured

**Lane** Opus RECON (read-only, measure-first) · **Chair** Fable 5.1, session a9df403c · **2026-09-20**
**Tree** `$SP/read-tip-32602dc60` @ `32602dc607b7423838249cf57d73baf08feb047d`, `git status --short` EMPTY at start and end (CONFIRMED, both ends).
**Nothing cured, no gate run, no file touched outside `$SP/lane-fix-c2-scratch/`.**

Tooling written for this lane (all in this scratch dir, all read-only):
`census.py` (extract + resolve), `strict.py` (adjacency-bound symbol oracle), `refine.py` (in-block demotion + corpus split), `proto_walker.py` (a shippable cure-(b) prototype), `citations.jsonl` / `strict.jsonl` / `refined.jsonl` (the per-citation records).

---

## 0. Headline

**Nothing in the estate checks whether a `path:line` citation is true.** Not one of the four named instruments verifies a line number; the three that *hold* line numbers regenerate them rather than assert them. The population is **14,604 citations across 471 files**, and the two the chair found tonight are not outliers — they are two members of a class of which **at least 1,090 are high-confidence stale and 438 are provably past end-of-file**.

Two findings sharpen the case beyond the raw count:

- **`src/domain/certification/subsystemRowsWar.js` carries seven citations past the end of `warDeployment.js`** (cited to :1539–:2133; the file is 1,338 lines). Two of the seven sit in **executable strings**, not comments — they are the `other:` evidence prose of shipped certification rows.
- **The tuning inventory's own hand-written addresses have rotted.** Of the three `realHome` addresses in `scripts/count-tuning-inventory.mjs`, one is exact, one is off by 11, and one is off by 1 *into the wrong semantic arm* (`populationDynamics.js:306` is the **disease** crisis arm; `WAR_CRISIS_ARCHETYPES` is at :307). An instrument that measures the estate cannot keep its own citations true.

---

## A. The census

`git grep -nIE '[A-Za-z0-9_][A-Za-z0-9_./\-]*\.(js|jsx|mjs|ts|tsx):[0-9]+' -- tests docs scripts src` → 9,412 matching **lines**; parsing every match on every line (`census.py`) → **14,604 citations**. Forms found and handled: `file.js:123`, `file.js:1-17` (range), `file.js:211,229,244,260` (list), bare-basename and full-path spellings.

### By corpus

| corpus | citations | distinct lines | distinct files |
|---|---:|---:|---:|
| `docs/` **live** | 8,590 | 5,533 | 185 |
| `docs/` **archival** (dated audits, `review-r2/`, `shift-records/`, surveys, `COMPREHENSIVE_REVIEW*`, `*_AUDIT*`) | 5,132 | 2,960 | 18 |
| `src/` | 489 | 429 | 112 |
| `tests/` | 319 | 298 | 130 |
| `scripts/` | 74 | 71 | 26 |
| **total** | **14,604** | **9,291** | **471** |

### Prose comments vs executable code

Of the 859 citations that live in `.js/.jsx/.mjs/.cjs/.ts/.tsx` files (block-comment state machine + line-comment test, `census.py`):

| context | count |
|---|---:|
| prose **comment** (`//`, `/* */`, JSDoc) | 643 |
| **executable code** (string literals, typed `cite:` fields) | 216 |
| citations in `.md` / `.json` files | 13,745 |

The 216 code-context citations are the load-bearing ones: they ship in the bundle and several are read by tests. **85 typed `cite:` fields** live in `src/domain/institutions/institutionTable.js` (22), `src/domain/prose/holderTable.js` (62) and `tests/lint/proseWiringCensus.walker.test.js` (1); **64 of the 85 carry a `:line`**.

### Classification (the full population)

Oracle: a citation is *checkable* only when a symbol-shaped token is named **adjacent** to it (same backtick span, or within 48 chars) **and** that symbol is **declared** in the resolved target. Verdict = does the cited span hold it?

| class | count | meaning |
|---|---:|---|
| `UNCHECKABLE` | 10,630 | 5,151 name no symbol at all beside the number; 5,479 name one the target does not declare |
| `STALE` | 1,942 | named symbol lives elsewhere |
| `EXACT_DECL` | 631 | cited line holds the declaration |
| `UNRESOLVED` | 549 | cited path resolves to no tracked file |
| `OUT_OF_RANGE` | 438 | cited line is past end-of-file — **objective, zero false positives** |
| `EXACT_BLOCK` | 248 | cited line falls inside the named symbol's own block (benign) |
| `EXACT_USE` | 166 | cited line holds a use of the symbol |

### By corpus × class

| corpus | EXACT_DECL | EXACT_USE | EXACT_BLOCK | STALE | OUT_OF_RANGE | UNRESOLVED | UNCHECKABLE |
|---|---:|---:|---:|---:|---:|---:|---:|
| src | 16 | 8 | 5 | 52 | 7 | 7 | 394 |
| tests | 8 | 3 | 2 | 18 | 0 | 21 | 267 |
| scripts | 7 | 0 | 2 | 7 | 0 | 0 | 58 |
| docs-live | 443 | 118 | 94 | 1,191 | 135 | 358 | 6,251 |
| docs-archival | 157 | 37 | 145 | 674 | 296 | 163 | 3,660 |

**High-confidence stale** (rank-0: backticked, adjacent, declared, not in-block) = **1,090** — docs-live 868, docs-archival 191, src 14, tests 11, scripts 6.
Drift distribution: 1–2 lines **71** · 3–10 **152** · 11–50 **321** · 51–200 **324** · >200 **222**.

### Precision, measured by hand

I hand-verified **17 rank-0 STALE** against the real target lines (9 live-code, 3 walker-only, 5 ambiguous docs). **17/17 were true stale** — the cited line does not hold the named thing. One further case (`pendingEdits.js:71` for `COMMITTABLE_EDIT_KINDS`, declared :70) was a genuine false positive of the naive pass and is why `refine.py` demotes in-block citations to `EXACT_BLOCK`; after that demotion it no longer appears. Symbol *attribution* is occasionally wrong (a neighbouring backtick wins) but the *verdict* survived every check.

### `UNRESOLVED`, sub-classified

| sub-class | count |
|---|---:|
| target file **absent from the tree** (113 distinct paths) | 357 |
| ambiguous basename (2+ tracked files share it) | 170 |
| vendor target (`jspdf.es.js`, `vitest/**.d.ts`, `react-pdf.js`) — real but unguardable from git | 12 |
| synthetic fixture path inside a test assertion (`fixture.ts:1`, `probe.test.ts:4`) — regex false positive | 10 |

The absent-target head is a **whole feature's documentation citing files that do not exist at this tip**: `SettlementMapPane.jsx` ×31, `useTownMapPresentation.js` ×28, `writers.js` ×27, `SettlementScene3D.jsx` ×11, `MapTabShell.jsx` ×11, `WarFaithTab.jsx` ×10 (+`src/components/new/tabs/WarFaithTab.jsx` ×10), `SettlementMapExportMenu.jsx` ×8. `find` confirms none of them exists anywhere in the tree, tracked or not.

### Scope boundary

The charter named `tests/ docs/ scripts/ src/`. **225 further citations live outside it**, unclassified: `CODEBASE_REVIEW.md` (198, repo root — not under `docs/`), `DESIGN_STRESSOR_DYNAMICS.md` (11, root), `public/map/sf-bridge.js` (7), `supabase/**` (8), `e2e/` (1).

---

## B. The STALE list — live code (`src/`, `tests/`, `scripts/`), complete

38 citations across 25 files. Every row is `OUT_OF_RANGE` (objective) or rank-0 `STALE`. "off" = lines between the cited address and the symbol's true home.

| citation | ctx | cites | truth | off |
|---|---|---|---|---:|
| `scripts/mutation-sweep.sh:1122` | prose | `wiringCensus.js:699-702` | `fieldsRead` is at :719 | 17 |
| `scripts/probe-ej-family2.mjs:25` | comment | `applyWorldPulse.js:290` | `sourceEventId` is at :900 | 610 |
| `scripts/probe-ej-family2.mjs:28` | comment | `pulseKernel.js:2497` | `worldState` is at :2487 | 10 |
| `scripts/prose-rate-corpus.mjs:195` | comment | `EconomicsTab.jsx:251-257` | `flowDrift` is at :272 | 15 |
| `scripts/review/readerCorpus.mjs:31` | comment | `soakRules.mjs:159` | `composeSoakRules` is at :160 | 1 |
| `scripts/wiring-census.mjs:349` | comment | `defenseGenerator.js:189-191` | `economicGates` is at :467 | 276 |
| `src/domain/certification/subsystemRowsBaseline.js:17` | comment | `npcAgency.js:896` | `candidateType` is at :909 | 13 |
| `src/domain/certification/subsystemRowsBaseline.js:81` | comment | `settlementStrategy.js:498` | `candidateType` is at :454 | 44 |
| `src/domain/certification/subsystemRowsGrowth.js:43` | comment | `candidateEvents.js:243` | `candidateType` is at :252 | 9 |
| `src/domain/certification/subsystemRowsWar.js:68` | comment | `warDeployment.js:1539` | **past EOF** — target has 1338 lines | +201 beyond EOF |
| `src/domain/certification/subsystemRowsWar.js:79` | comment | `warDeployment.js:1492` | **past EOF** — target has 1338 lines | +154 beyond EOF |
| `src/domain/certification/subsystemRowsWar.js:162` | comment | `warDeployment.js:1877` | **past EOF** — target has 1338 lines | +539 beyond EOF |
| `src/domain/certification/subsystemRowsWar.js:171` | code | `warDeployment.js:1877` | **past EOF** — target has 1338 lines | +539 beyond EOF |
| `src/domain/certification/subsystemRowsWar.js:195` | comment | `warDeployment.js:1970` | **past EOF** — target has 1338 lines | +632 beyond EOF |
| `src/domain/certification/subsystemRowsWar.js:229` | comment | `warDeployment.js:1518` | **past EOF** — target has 1338 lines | +180 beyond EOF |
| `src/domain/certification/subsystemRowsWar.js:292` | code | `warDeployment.js:2133` | **past EOF** — target has 1338 lines | +795 beyond EOF |
| `src/domain/display/stateProse/generalStateProse.js:784` | comment | `npcGenerator.js:1694` | `flagDriven` is at :1700 | 6 |
| `src/domain/display/stateProse/printProse.js:238` | comment | `OverviewTab.jsx:120-134` | `worldStressorFor` is at :155 | 21 |
| `src/domain/display/stateProse/printProse.js:376` | comment | `EconomicsTab.jsx:251-257` | `flowDrift` is at :272 | 15 |
| `src/domain/display/viabilityVerdict.js:66` | comment | `pdf/lib/viewModel.js:586-587` | `verdictTone` is at :588 | 1 |
| `src/domain/institutions/institutionTable.js:440` | comment | `worldPulse/treasury.js:1253` | `economicState` is at :1257 | 4 |
| `src/domain/prose/holderTable.js:779` | comment | `institutionTable.js:582` | `columnCensus` is at :596 | 14 |
| `src/domain/prose/wiringCensus.js:580` | comment | `economyStateProse.js:393` | `foodSecurityPoolKey` is at :394 | 1 |
| `src/domain/prose/wiringCensus.js:580` | comment | `generalStateProse.js:353` | `foodSecurityPoolKey` is at :354 | 1 |
| `src/domain/undercity/colonization.js:56` | comment | `causalState.js:306` | `defenseProfileHasWalls` is at :380 | 74 |
| `src/domain/undercity/monotoneComponents.js:426` | comment | `causalState.js:306` | `defenseProfileHasWalls` is at :380 | 74 |
| `src/domain/worldPulse/seatIntervention.js:19` | comment | `occupation.js:471` | `stabilizationSuitability` is at :645 | 174 |
| `tests/components/handbookVoice.test.jsx:145` | comment | `AppViews.jsx:133` | `HowToUse` is at :46 | 87 |
| `tests/domain/convergence.test.js:513` | comment | `convergence.js:822` | `neighborsOf` is at :781 | 41 |
| `tests/fixtures/wiringFixtures.js:40` | comment | `economyStateProse.js:557` | `shadowEconomyPoolKey` is at :558 | 1 |
| `tests/fixtures/wiringFixtures.js:102` | comment | `powerStateProse.js:304` | `STABILITY_LADDER` is at :305 | 1 |
| `tests/fixtures/wiringFixtures.js:343` | comment | `defenseStateProse.js:747` | `wallRationalePoolKey` is at :962 | 215 |
| `tests/lint/dossierMountRegistry.walker.test.js:1287` | comment | `Primitives.jsx:114` | `Collapsible` is at :67 | 47 |
| `tests/lint/institutionTable.walker.test.js:358` | comment | `src/domain/worldPulse/treasury.js:1253` | `economicState` is at :1257 | 4 |
| `tests/lint/observedShapeReaders.walker.test.js:63` | comment | `lineageMemberBirth.js:178` | `foundingTier` is at :194 | 16 |
| `tests/lint/siteCoherenceRatchet.test.js:69` | comment | `vite.config.js:801` | `testTimeout` is at :912 | 111 |
| `tests/lint/siteCoherenceRatchet.test.js:456` | comment | `resolveConfig.js:107` | `terrainOverride` is at :207 | 100 |
| `tests/scripts/implementationSession.test.js:187` | comment | `vite.config.js:810` | `testTimeout` is at :912 | 102 |

Add 28 live-corpus `UNRESOLVED` rows (targets absent or ambiguous); 10 of those are synthetic fixture paths and 12 are vendor targets, leaving **6 genuine**.

### The propagation story — one edit, eleven stale citations

`Primitives.jsx:114` is cited in **10 files**, and its companion `Collapsible … at :83` in 5 more. Both are wrong by **exactly 6**:

- `Section`'s `{open && children}` is at **:120** (declared :96) — cited as `:114`
- `Collapsible`'s is at **:89** (declared :67) — cited as `:83`

A single six-line insertion above line 83 of `src/components/new/Primitives.jsx` rotted the whole cluster at once. The citers span shipped code (`DefenseTab.jsx:602`, `EconomicsTab.jsx:522` and `:734`, `OverviewTab.jsx:546`, `dossierMounts.js:91` and `:156`) and tests (`warFaithSurfacing.test.jsx:373`, `dossierMountRegistry.walker.test.js:1287` and `:2092`, `mountFirstPaint.test.jsx:6`). Estate-wide, **60 distinct stale addresses are cited by 2+ files, carrying 145 citations** — so ~13% of high-confidence stale is propagation, curable at one address each.

### Docs — the sharp ones

Two documents **assert exactness about addresses that are false**:

- `docs/DESIGN_FP_ARCH_INT.md:31` — "`factionCompetitionEnabled` default TRUE … simulationRules.js:45 **(exact)**". Line 45 is an unrelated comment; the default is at **:70** (off 25). The same row already carries a manual rot note, "(was :306 — rot)".
- `docs/implementation/preverification/WF-SUBSTRATE.md:192` — "F-5's EIGHT named tuning homes exist … **ALL EIGHT, EACH AT AN EXACT ANCHOR**". `PANTHEON_TUNING` is cited `pantheon.js:405`; line 405 is a bare `*` inside a comment and the constant is at **:476** (off 71).

Other verified docs-live examples: `espionageGauntlet.js:398`→:421 (`gatherOrGovernRead`), `peaceTerms.js:348`→:372 (`mintedThisPair`), `spatial/migration.js:296`→:285 (`splitTravellers`), `simulationRules.js:528`→:976 (`routeLifecycleEnabled`, off 448), `beliefMap.js:915`→:1041 (`applyAllyIntelSharing`, off 126).

### The charter's own example is invisible to a line-scoped walker

`tests/domain/causeConjunctionContent.test.js:29` cites `causeLifecycle.js:165`; `bearerSituation` is at **:176** (off 11) and line 165 holds `bearerRevealed` — CONFIRMED stale. But the naming symbol sits on **line 28**, one line above the citation:

```
// DERIVED from the engine vocabularies. bearerSituation is a closed two-value
// vocabulary (causeLifecycle.js:165).
```

My oracle classifies it `UNCHECKABLE`, and so would any line-scoped walker. **This is the single most important constraint on cure (b).** The second charter example, `roadsKernel.js:395` for `const fullRoster`, **is not present at this tip** — `git grep 'roadsKernel.js:395'` returns nothing tracked or untracked; `fullRoster` is at `roadsKernel.js:425`. That packet lives on another lane's branch, so my population is bounded by this tip.

---

## C. Instrument coverage

| instrument | what it actually guards | scope | reaches this population? |
|---|---|---|---|
| `tests/lint/ledgerCitationIntegrity.test.js` + `scripts/audit/ledger-citations.mjs` + `.ledger-citation-baseline.json` | dangling **`§N` ledger-section** citations; only-shrinks set, six negative controls | `docs/**.md` **at a git ref** | **0 of 14,604.** Wrong citation grammar entirely. It is the right *template*, not a guard. |
| `tests/lint/proseWiringCensus.walker.test.js` via `holderTable.sourcesAllCited()` | that a `cite:` string **contains a colon** — `r.cite.includes(':')` at `src/domain/prose/holderTable.js:386` | the 85 typed `cite:` fields | **64 reached for FORM, 0 for TRUTH.** It proves an address was written, never that it is right. |
| `scripts/count-tuning-inventory.mjs` + `.tuning-inventory.json` | 237 line fields, **machine-written** by the refreeze ritual; plus **3 hand-written `realHome` addresses** | tuning leaves | **0 guarded.** And 2 of its own 3 hand-written addresses are stale (see §0). |
| `tests/lint/proseNumerics.test.js` + `.prose-numerics-baseline.json` | 218 rows of `{path, line, category, snippet}`; the debt set only shrinks | authored prose numerics under `src/` | **0 of this population.** Its line numbers **self-heal** — the scanner rewrites them. Its own header records "88 pure line moves", "re-addresses 238 → 373", "252 → 318" as routine address rot. |
| `.wizard-news-authoring-baseline.json` | 19 machine-written line fields | wizard news authoring | 0 |
| "pre-proof step 16" | **not located.** The only "step 16" in the tree is `docs/implementation/packets/town-cartography/MF-T2A.md:455`, describing a build step that produces `dist/`. `scripts/implementation-gate.mjs` exposes 6 named steps, none a citation check. | — | 0 — see question 1 |

**Summary: 14,604 citations, 0 truth-guarded, 64 form-guarded.** The estate's three line-carrying baselines total **474 machine-maintained addresses** and every one of them is regenerated rather than asserted — which is the estate's own, already-chosen answer to line drift.

---

## D. The three cures, priced

### (a) One-time re-address

| scope | citations | citing files | source lines to edit |
|---|---:|---:|---:|
| live code only (`src`/`tests`/`scripts`) | **38** | **25** | **37** |
| + `docs-live` | 1,041 | 127 | 938 |
| everything incl. archival and rank-2 | 2,380 | 172 | 2,048 |

Wall-clock is dominated by re-verification, not editing: the walker already prints the true line for every one of the 38. **Decays immediately** — the `Primitives.jsx` cluster shows a single unrelated commit can re-rot eleven at once.

### (b) A `tests/lint` citation walker

**CONFIRMED, not estimated** — I built and ran the prototype (`proto_walker.py`):

```
WALKER PROTOTYPE: 5140 files scanned, 48 citations symbol-checked, 38 RED in 4.84s
```

- **Wall-clock 4.84 s** over the whole live code corpus (raw scan alone: 4.32 s / 5,140 files). Negligible against any gate.
- **Two arms with utterly different coverage.** The **EOF arm** (cited line > target line count) needs no symbol, has **zero false positives**, and covers **100% of resolvable citations** — 854/882 in live code, 13,201/13,722 in docs. The **symbol arm** covers only **48 of 855 live-code citations (5.6%)**; estate-wide, symbol-checkable is 16.6% (src), 9.7% (tests), 21.6% (scripts), 21.5% (docs-live).
- **False-positive classes, all observed:** (i) a neighbouring backtick wins the attribution (`Collapsible` claimed for a `Section` address — verdict still right); (ii) the citation points *inside* the named symbol's block rather than at its declaration (`pendingEdits.js:71`) — cured by the in-block demotion, 248 demotions estate-wide; (iii) synthetic fixture paths in test assertions (`fixture.ts:1`) — 10 cases, cured by a path allowlist; (iv) vendor targets — 12 cases, cured by skipping unresolvable paths.
- **The ceiling is structural.** The symbol arm cannot see the charter's own example, because the symbol and the number sit on different lines. Widening to a sentence or paragraph window is what pushed my first, looser pass to 8,120 STALE — an implausible number driven by common nouns (`tabs`, `source`, `settlement`) picked up as symbols. **Precision and coverage trade directly here, and 5.6% is the price of 17/17.**

### (c) Convention change — cite by symbol, never by line

**14,604 citations on 9,291 lines across 471 files** would need re-spelling. Live code alone is 882 citations on 798 lines in 268 files.

Two concrete blockers:
- `src/domain/prose/holderTable.js:386` — `sourcesAllCited()` **requires** `r.cite.includes(':')`, so 64 typed `cite:` fields are contractually line-addressed. The convention change must amend a shipped invariant.
- A symbol-only citation is **not checkable either** unless the symbol is unique; and it cannot express the citations that name no symbol — 5,151 of the population point at a line precisely because there is nothing there to name (a bare literal, a preset row, an arm of a conditional). The tuning inventory's `realHome` phantoms exist for exactly that reason: "a bare literal with no name".

---

## E. Recommendation

**Ship cure (b) as its EOF arm only, gate-wired, plus a scoped one-time re-address (a) of the 38 live-code rows. Do not adopt (c). Do not mass-re-address docs.**

The reason is the coverage arithmetic, and it points the opposite way to the charter's framing. The symbol arm — the part that would have caught tonight's two findings — reaches **5.6%** of live-code citations and cannot see the charter's own example at all. The EOF arm reaches **100%**, costs nothing, cannot false-positive, and already convicts the sharpest defect in the estate (the seven `subsystemRowsWar.js` rows, two of them in shipped executable strings). A guard that catches 438 real defects with zero false positives and no judgment calls is worth more than one that catches a superset with a hand-tuned symbol heuristic the estate would have to keep tuning.

Keep the symbol arm, but **report-only and scoped to `src`/`tests`/`scripts`** — 48 checks, 4.8 s, and it is how the 38 rows above get re-verified after the cure lands. The precedent is `proseWiringCensus.walker.test.js`, which gates three structural identities and reports everything else as a finding for the chair.

Against (c): the estate has already answered line drift three times — `.prose-numerics-baseline.json`, `.tuning-inventory.json`, `.wizard-news-authoring-baseline.json` all carry line numbers and all **regenerate** them. That is the working pattern, and it argues for machine-maintained addresses over a prose convention that 5,151 citations structurally cannot adopt.

Against mass docs re-address: **5,132 of the citations are archival** — dated audits, `review-r2/`, surveys, shift records. `docs/review-r2/VERIFY_SUBSYSTEMS_RESULTS.json:556` pins a sha and states that all cited lines matched *at that sha*. Re-addressing those to today's tree would falsify a record rather than repair it. That is a chair ruling, not a lane's (question 3).

---

## F. Questions only the chair can answer

1. **"Pre-proof step 16" — I could not locate it.** No step-16 citation check exists in `scripts/preproof-train.mjs`, `scripts/implementation-gate.mjs` (6 named steps) or `package.json`. The only "step 16" in the tree describes a `dist/` build (`MF-T2A.md:455`). Did the charter mean a different instrument, or one that lives on another branch?
2. **Is the EOF arm gate-wired or report-only on first landing?** Wired, it reds today on 438 citations — 7 in `src/`, 431 in `docs/` — so it needs an only-shrinks baseline like `ledgerCitationIntegrity`'s, and that baseline's initial size is a ruling.
3. **Archival docs: frozen record or live address?** 5,132 citations, 18 files, 674 STALE + 296 OUT_OF_RANGE. My reading is that their staleness is *correct* and they should be excluded from every arm by path rule. Confirm, and confirm the path rule itself (`refine.py`'s `ARCHIVAL` list is my proposal, not a ruling).
4. **`subsystemRowsWar.js`'s two executable-string citations** (`:171`, `:292`) are certification-row evidence prose asserting `warDeployment.js:1877` and `:2133` on a 1,338-line file. Is a false evidence address in a shipped certification row a FIX-C2 row or a certification-lane row?
5. **113 target paths absent from the tree** (`SettlementMapPane.jsx` ×31, `useTownMapPresentation.js` ×28, `writers.js` ×27, `WarFaithTab.jsx` ×20, …). Is the town-map/war-faith surface deleted, renamed, or resident on another branch? This changes 357 citations from "stale address" to "documentation of a tree that no longer exists".
6. **Does the walker's scope include the 225 out-of-scope citations** — chiefly root `CODEBASE_REVIEW.md` (198)? The charter named four directories and the repo root is not among them.
7. **The `cite:` form invariant.** `holderTable.js:386` requires a colon in every `cite:`. If the chair wants symbol-addressing anywhere, this shipped predicate is the first thing that must change.

---

## G. Noticed and not touched — each specific enough to slot

1. **`src/domain/certification/subsystemRowsWar.js` — 7 citations past EOF** (`:68 :79 :162 :171 :195 :229 :292` → `warDeployment.js:1492…:2133`, file is 1,338 lines). `:171` and `:292` are in executable strings. Sharpest live defect found.
2. **The `Primitives.jsx` cluster — 11 citations wrong by exactly 6.** `:114`→`:120`, `:83`→`:89`. One address fix each, ten citing files.
3. **`scripts/count-tuning-inventory.mjs` — 2 of its 3 `realHome` addresses are stale.** `populationDynamics.js:306` should be `:307` **and points at the disease arm instead of the war arm**; `coup.js:134` should be `:123` (the `/400` divisor). `populationDynamics.js:327` is exact.
4. **`docs/DESIGN_FP_ARCH_INT.md:31` claims "(exact)" for an address off by 25**, in a row that already carries a manual rot annotation.
5. **`docs/implementation/preverification/WF-SUBSTRATE.md:192` claims "ALL EIGHT, EACH AT AN EXACT ANCHOR"**; `pantheon.js:405` is off by 71. The other seven anchors in that row are unverified by this lane.
6. **113 absent target paths / 357 citations** — see question 5.
7. **`tests/fixtures/wiringFixtures.js:343`** cites `defenseStateProse.js:747` for `wallRationalePoolKey`, which is at `:962` — **off by 215**, and the comment calls it "THE SHIPPED LADDER, WHOLE".
8. **The bare `:NNN` citation form is not in this population.** Forms like `(:383-394)` (`SETTLEMENT_CAPABILITY_ATLAS.md:7707`) and `Collapsible at :83` inherit their path from earlier in the sentence. Unmeasured; a walker would need a path-carrying parser to see them.
9. **Line-range and line-list forms** (`:409-413`, `:211,229,244,260`, `:1-17`) are ~common and any walker must handle them; `census.py` does, a naive `split(':')` would not.
10. **12 vendor-target citations** (`jspdf.es.js:22047-22067`, `vitest/**/tasks.d-*.d.ts:1310`) cannot be guarded from git — they address `node_modules`. Needs an explicit skip rule, not a fix.
11. **10 synthetic fixture paths in test assertions** (`tests/security/byokNeverLogged.test.js:166`, `tests/lint/controlBytes.test.js:147`, …) are regex false positives, not citations. Any walker needs the allowlist.
12. **`docs/review-r2/VERIFY_SUBSYSTEMS_RESULTS.json:556`** records "HEAD moved 91a0c409→53627b78; all cited lines still match" — evidence that a past lane hand-verified citations against a pinned sha. That practice is unautomated and unrepeated.
13. **`git grep` without a rev reads the index** (MEMORY hazard). Status was empty at both ends here so index == HEAD == worktree, but a walker shipped into `tests/lint` must read from disk deliberately, as `ledger-citations.mjs` does from a git ref.
14. **5,479 citations name an adjacent symbol the target does not declare.** I classified these `UNCHECKABLE` because my declaration detector is conservative (it misses string-literal event types, cross-file names, and destructured bindings). Some fraction are genuinely stale — the symbol is gone from the file entirely, a *stronger* signal than line drift. Unquantified; the largest single unmeasured block in this census.
