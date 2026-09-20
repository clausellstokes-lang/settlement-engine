# TOOL-13 — the observed-shape scanner resolves 7.6 % of reads: WHY, WHICH MATTER, WHAT A RESOLUTION PASS COSTS

**Lane:** TOOL-13, Opus RECON, read-only. **Chair:** Fable 5.1, session a9df403c.
**Stamp (from `date`):** 2026-09-20 08:05 EDT.
**Read tip:** `$SP/read-tip-141a1d775`, detached at `141a1d7752e8d9199c0bf347ea99808121733b0b`; `git status --short` EMPTY at start and at end (CONFIRMED, 0 lines both times). Nothing under `src/`, `tests/` or `scripts/` was written. All apparatus lives in `$SP/lane-tool-13-scratch/`. No gated run; no `git` mutation.

---

## THE VERDICT, FIRST

**The 7.6 % is overwhelmingly a DENOMINATOR ARTEFACT, not a coverage hole — but it hides one real, cheap, bounded defect.**

1. The denominator is not "128,176 reads of generated records". It is *every property access in `src/` whose key is outside a 90-name builtin list*. **20,103 of them (15.7 %) are rooted at a host/runtime global** — `Object.freeze` alone is 7,473 reads, `Array.isArray` 3,709, `Math.*` ~4,900, `Number.isFinite` 1,400. These are structurally incapable of being domain reads. (CONFIRMED)
2. The resolver is anchored on **two bare identifier names, 337 container names and 84 single-home names**. Against 128,203 reads. Raising every lever I could measure — including deleting the row threshold entirely — caps the rate at **11.74 %**. The architecture cannot reach a high number. (CONFIRMED)
3. **The one real defect: the root name prior is two-thirds dark.** The detector's own header says it binds "`settlement`, `worldState`, `save`, `campaign`". Measured, it binds **`save` and `settlement` only** — `campaign` (1 row), `worldState` (25), `pulseResult` (12) and `wizardNews` (13) are filtered out by `rows >= minRows` (40), because a *walk root* is thin by construction. Admitting all six roots lifts resolution **9,780 → 12,368 (+26.5 % relative)** for **+45 new identity rows** and **zero measurable wall-clock**. (CONFIRMED)
4. **Recommendation: do not build a resolution pass. Do two cheap things instead** — §7.

⚠ One governance hazard found that binds ANY future resolution work: **more resolution can DELETE frozen findings.** Every arm that widened the vocabulary erased banked rows (13 under the root arm, 15 under `minRows=8`), because a receiver that resolves to *two* shapes is killed by the detector's `objects.length === 1` guard. A resolution pass is not monotone and must be measured for erasure, not only for growth. (CONFIRMED, §6.4)

---

## 1. THE REPRODUCED FIGURE

```
$ cd $SP/read-tip-141a1d775
$ node scripts/check-observed-shape-readers.mjs --report > $SP/lane-tool-13-scratch/osr-report.txt 2> …err.txt
EXIT=0        16.39s user 1.64s system 117% cpu 15.392 total
```

Tail of `osr-report.txt`, verbatim:

```
1964 finding(s); scan reached 9780/128203 reads across 2231 files
scan scope: the WHOLE scanned tree (no declared exclusion).
…
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
```

**Live at the read tip: 9,780 / 128,203 reads across 2,231 files = 7.628 %.** (CONFIRMED)

The brief's `9,766 / 128,176 / 2,228` is the **frozen** `scanStats` in `scripts/.observed-shape-readers-baseline.json` (schema 22), read directly:

```
scanStats: {"files":2228,"reads":128176,"resolved":9766,"unresolved":118410}
sentinel:  {"resolvedReads":9766,"totalKeys":6537,"usableShapes":337}
```

The +3 files / +27 reads / +14 resolved is drift since the schema-22 freeze (EM-B1k2's landing and CURE-I). The gate is still green because the anti-vacuity sentinel is a **90 % FLOOR only** (`sentinelFailures`, `['resolvedReads', 0.9]`) — it reds on collapse, never on growth. (CONFIRMED)

### What "read" and "resolved" mean

From `scripts/lib/legacy-reader-shape-scan.mjs`, `scanReaders` (the byte-frozen gate authority, blob 0310fa9f):

- A **read** is a `ts.PropertyAccessExpression` with an identifier name, where the key is **not** in the 90-entry `BUILTIN_MEMBERS` set and **not** a write target. Nothing narrows it to domain data. `Object.freeze`, `window.location` and `/re/.test` are all reads.
- **Resolved** means `resolve(node.expression)` returned a non-empty shape-token set — the receiver was bound to at least one observed corpus shape.
- A **finding** additionally needs exactly one non-array token in `known` whose key set omits the key (`objects.length === 1 && !shapes[objects[0]].keys.includes(key)`).

**The resolver's entire anchor set, measured at the read tip** (`$S/corpus.json`):

| anchor | size | note |
|---|---|---|
| `known` (usable shapes, `rows >= 40`) | **337** of 1,299 observed | the container-name vocabulary |
| `roots` (root name prior) | **2** of 6 walk roots | `save`, `settlement` — see §7.1 |
| `unique` (ungrounded single-home rule) | **84** of 1,031 single-home names | also cut by `rows >= 40` |
| `arrayShapes` | 117 | arrayness tokens |

---

## 2. THE INSTRUMENT, AND ITS FAITHFULNESS PROOF

`$S/classify.mjs` re-walks the tree with the detector's read predicate copied **verbatim** (`BUILTIN_MEMBERS`, `isWriteTarget`, the `PropertyAccessExpression && isIdentifier` test) and **imports `buildIndex` / `makeResolver` unmodified** from the read tip. The corpus is executed once and cached (`$S/dump-corpus.mjs`, 11,108 ms, 1,299 shapes).

```
files=2231 reads=128203 resolved=9780 unresolved=118423
class rows sum=118423 (must equal unresolved)
index 3611 ms; scan 987 ms
```

**It reproduces `reads` and `resolved` exactly against the live `--report` line.** The classes sum to the total with no residue. (CONFIRMED)

---

## 3. THE CAUSE TABLE — 118,423 unresolved reads, partitioned by RESOLVER EXIT

Every class is the exact `return EMPTY` the resolver took. Shares are of 118,423. **Sum = 118,423.**

### B2 — alias binding (`const x = <expr>`) whose initializer resolved to nothing — **33,333 (28.15 %)**
```
src/App.jsx:218                                   .status        `result.status`
src/App.jsx:219                                   .product       `result.product`
src/App.jsx:227                                   .dossierToken  `result.dossierToken`
```

### B1 — bare identifier with no binding in the index and not a corpus root — **33,253 (28.08 %)**
```
src/App.jsx:107   .key        `localStorage.key`
src/App.jsx:192   .location   `window.location`
src/App.jsx:234   .getState   `useStore.getState`
```

### B3 — element binding (`for-of` / array-callback param) whose container resolved to nothing — **16,371 (13.82 %)**
```
src/application/commands/adapters/pendingEditCommit.js:80   .status     `receipt?.status`
src/application/commands/commandRegistry.js:83              .surveyor   `spec.surveyor`
src/components/AccountPage.jsx:86                           .id         `row.id`
```

### B5 — parameter whose call-site arguments all resolved to nothing — **15,354 (12.97 %)**
```
src/application/commands/adapters/canonEventApply.js:28    .reason          `result?.reason`
src/application/commands/adapters/canonEventApply.js:30    .veto            `result?.veto`
src/application/commands/adapters/canonEventApply.js:147   .proposalIndex   `intent.proposalIndex`
```

### B4 — parameter with NO call site in `src/` (entry point, export, callback arg) — **11,026 (9.31 %)**
```
src/App.jsx:138   .authModalOpen      `s.authModalOpen`
src/App.jsx:139   .setAuthModalOpen   `s.setAuthModalOpen`
src/App.jsx:141   .auth               `s.auth`
```

### A1 — chain-link name is not a usable corpus container (`!known.has(p)`, the vocabulary wall) — **4,556 (3.85 %)**
```
src/App.jsx:141   .tier          `s.auth.tier`
src/App.jsx:142   .displayName   `s.auth.displayName`
src/App.jsx:143   .id            `s.auth.user?.id`
```

### D1 — receiver is a call to a function DECLARED in `src/` whose returns resolved to nothing — **1,430 (1.21 %)**
```
src/components/AccountPage.jsx:153        .blocked        `checkCivility(nameInput.trim()).blocked`
src/components/PricingPage.jsx:109        .kind           `ctaFor(TIERS.cartographer).kind`
src/components/ServicesTogglePanel.jsx:159 .forceExclude  `getToggle(catName,svcKey,n,d).forceExclude`
```

### C2 — element access by a COMPUTED key (`obj[expr]`) — **690 (0.58 %)**
```
src/App.jsx:572                                             .id            `mobileNav[i - 1].id`
src/application/commands/adapters/customContentApply.js:162 .definitionId  `plan.entries?.[0]?.definitionId`
src/application/commands/adapters/pendingEditCommit.js:76   .reason        `result?.failed?.[0]?.reason`
```

### A3 — chain link known, receiver ungrounded, name has many homes — **660 (0.56 %)**
```
src/application/commands/adapters/customContentApply.js:41  .kind    `command.params.plan.kind`
src/components/ChroniclePanel.jsx:252                       .short   `n?.goal?.short`
src/components/SettlementDetail.jsx:169                     .name    `s.settlement?.name`
```

### D2 — receiver is a METHOD call whose return the resolver does not model — **479 (0.40 %)**
```
src/components/map/AdvanceReport.jsx:230              .dramaClass  `threadsById.get(l.id)?.dramaClass`
src/components/map/RealmDocket.jsx:117                .name        `settlementById.get(String(id))?.name`
src/components/settlements/SettlementCard.jsx:320     .sources     `allModifiers.get(s.id)?.sources`
```

### F2 — unmodelled node kind: RegularExpressionLiteral — **413 (0.35 %)**
```
src/application/commands/adapters/customContentApply.js:28  .test  `/^[0-9a-f]{64}$/.test`
src/application/commands/commandEnvelope.js:161             .test  `/^[a-z][a-z0-9.-]*$/.test`
src/components/OutputContainer.jsx:770                      .test  `/credit/i.test`
```

### D3 — receiver is a call to a function NOT declared in `src/` — **408 (0.34 %)**
```
src/domain/worldPulse/reframeKernel.js:353        .score        `fearFn(o, s)?.score`
src/domain/worldPulse/warCapacityReads.js:94      .homeDefense  `capacityFor(ally)?.homeDefense`
src/domain/worldPulse/warDeployment.js:526        .homeDefense  `capacityFor(targetId).homeDefense`
```

### F2 — unmodelled node kind: NewExpression — **192 (0.16 %)**
```
src/application/commands/pendingEditCommitRuntime.js:32  .toISOString      `new Date().toISOString`
src/components/ChroniclePanel.jsx:47                     .getTime          `new Date(iso).getTime`
src/components/SingleDossierSuccessPage.jsx:391          .format           `new Intl.DateTimeFormat(…).format`
```

### F2 — unmodelled node kind: MetaProperty — **70 (0.06 %)**
```
src/App.jsx:950                 .env  `import.meta.env`
src/components/AccountMenu.jsx:107  .env  `import.meta.env`
```

### E1 — composite (`||` / `&&` / `??` / ternary) whose arms all resolved to nothing — **61 (0.05 %)**
```
src/components/AccountMenu.jsx:326                       .focus                  `(which === 'last' ? rows[rows.length - 1] : rows[0])?.focus`
src/components/account/AiUsageDashboard.jsx:17           .toLocaleString         `(Number(n) || 0).toLocaleString`
src/components/map/KeyboardPlacementControl.jsx:108      .getBoundingClientRect  `(iframeRef?.current || containerRef?.current)?.getBoundingClientRect`
```

### C1 — element access by a string literal that is not a usable container — **51 (0.04 %)**
```
src/domain/display/stateProse/defenseStateProse.js:178  .pools  `CORPUS['DS-DEF-3'].pools`
src/domain/display/stateProse/defenseStateProse.js:701  .pools  `CORPUS['DS-DEF-1'].pools`
src/domain/display/stateProse/economyStateProse.js:400  .pools  `CORPUS['DS-ECO-9'].pools`
```

### A2 — chain link known but no bound shape carries it — **35 (0.03 %)**
```
src/components/dossier/SettlementWorkbench.jsx:91  .cause            `raw.provenance?.cause`
src/components/map/PlacementsLayer.jsx:106         .lifecycleStatus  `settlement?.settlement?.lifecycleStatus`
```

### F1 — `this` — **31 (0.03 %)**
```
src/components/FeatureErrorBoundary.jsx:46  .handleRetry  `this.handleRetry`
src/components/FeatureErrorBoundary.jsx:54  .props        `this.props`
```

### F2 — unmodelled node kind: AwaitExpression — **10 (0.01 %)**
```
src/lib/accountImport.js:91  .normalizeSettlement  `(await import('../domain/normalizeSettlement.js')).normalizeSettlement`
src/lib/auth.js:415          .data                 `(await supabase.auth.getUser()).data`
```

**118,423 total. No "other". No residue.** (CONFIRMED — `$S/classes.json`, `$S/classify.out.txt`)

---

## 4. THE SUB-CAUSES OF THE TWO LARGEST CLASSES

`$S/deep.mjs` → `$S/deep.out.txt`. (CONFIRMED)

### B1 (33,253) — why the identifier has no binding
| n | share of B1 | sub-cause |
|---|---|---|
| **19,827** | 59.62 % | **host/runtime global** (`window`, `Object`, `Math`, `localStorage`, `React`, `Number`, `Array` …) |
| 9,857 | 29.64 % | **imported name (named)** — the index uses `imports` only for `lookupFn` (calls), never as a value binding |
| 2,863 | 8.61 % | **destructured at a variable declaration** — `buildIndex` binds only `ts.isIdentifier(node.name)`, so every `const { a } = …` local is invisible |
| 265 | 0.80 % | `let x;` with no initializer, assigned later |
| 206 | 0.62 % | catch parameter |
| 192 | 0.58 % | free identifier with no declaration in the file |
| 43 | 0.13 % | imported default / namespace |

### B2 (33,333) — what the alias initializer was
| n | share of B2 | sub-cause |
|---|---|---|
| **14,182** | 42.55 % | calls a function **declared in `src/`** whose returns resolved to nothing (recursive cascade) |
| 5,070 | 15.21 % | composite (ternary / `||`) |
| 2,400 | 7.20 % | another identifier that resolved to nothing |
| 2,082 | 6.25 % | element access |
| 2,074 | 6.22 % | property access that resolved to nothing |
| 1,442 | 4.33 % | calls a function **not** declared in `src/` (import, builtin, React hook) |
| 1,294 | 3.88 % | **object literal** — a fresh record the corpus never named |
| ~3,050 | ~9.2 % | method calls, in a long tail (`.freeze` 1,342, `.get` 787, `.find` 664, `.getState` 84, `.fork` 51, …) |
| 622 | 1.87 % | `null` initializer |
| 564 | 1.69 % | `await` |

**Reading:** B2 is not an independent cause. It is the *cascade* of the base failure — 42.6 % of it is "the function I called returned something the resolver could not name". B1's mass is 59.6 % language/host surface that should never have entered the denominator.

---

## 5. THE UNRESOLVED READS THAT MATTER

**The brief's measure — unresolved reads whose key is written on some usable (`rows >= 40`) shape: 38,959 of 118,423 (32.90 %).** (CONFIRMED)

Sharpened by dropping host-global receivers: **38,843**; of those **22,463 sit under `src/domain/`**, spread over **821 distinct domain files**. The guard's blind surface is estate-wide, not localised. (CONFIRMED)

Ten, one per file, sampled across the whole domain tree:

```
src/domain/activeConditions.js:594                 .sourceEventId  `opts.sourceEventId`
src/domain/advanceEpochLedger.js:114               .tick           `world.tick`
src/domain/ageBands.js:48                          .id             `b.id`
src/domain/ai/contextAnchor.js:30                  .id             `s?.id`
src/domain/ai/personaSlicer.js:69                  .blocs          `settlement?.politicsLedgers?.[String(settlement?.id)]?.blocs`
src/domain/customContentMigrations.js:40           .category       `next.category`
src/domain/display/trendLens.js:36                 .population     `(entry).population`
src/domain/npc/knownCharacter.js:242               .kind           `row.kind`
src/domain/spatial/distanceRead.js:173             .version        `overlay.version`
src/domain/worldPulse/convergenceReactive.js:104   .target         `r.target`
```

⚠ **38,843 is an UPPER BOUND and must be reported as one.** A key-name test cannot separate a domain key from a colliding language member: two of the ten rows the sampler produced were `Float32Array.from` and `CONTROL_CHARACTERS.test` — `from` and `test` *are* keys on usable shapes. Naming the exact overlap needs precisely the resolution the instrument lacks, so the number is honest only as a ceiling. (CONFIRMED as a ceiling; the true figure is PLAUSIBLE-lower and not measurable without the pass this lane is pricing.)

### The denominator anatomy (`$S/anatomy.mjs` → `$S/anatomy.out.txt`, CONFIRMED)

| measure | value |
|---|---|
| reads | 128,203 |
| resolved | 9,780 — **7.63 %** |
| rooted at a host/runtime global | **20,103** (15.7 %); 20,067 of them unresolved |
| receiver with no identifier root at all | 866 |
| key present in the corpus vocabulary (1,492 keys) | 51,095 |
| resolved *among* those | 8,562 — **16.76 %** |
| rate excluding host-global-rooted reads | **9.05 %** |
| `src/domain/` | 5,743 / 72,334 — **7.94 %** |
| `src/components/` | 1,353 / 26,108 — **5.18 %** |
| everything else | 2,684 / 29,761 — **9.02 %** |

Top unresolved keys, with a plain-grep cross-check:

| key | AST reads | `git grep -Poh` occurrences |
|---|---|---|
| `.freeze` | 7,473 | `Object.freeze` → 7,527 |
| `.isArray` | 3,709 | `Array.isArray` → 3,718 |
| `.max` / `.round` / `.min` / `.floor` | 2,184 / 1,030 / 983 / 728 | `Math.` → 5,541 |
| `.isFinite` | 1,400 | — |
| `.sm` / `.xs` / `.md` / `.xxs` | 1,807 / 1,481 / 731 / 697 | design breakpoint tokens |
| `.id` | 4,274 | *(a usable-shape key — real domain mass)* |

**`Object.freeze` alone is 5.8 % of the entire denominator.** (CONFIRMED)

---

## 6. THE PRICED PASS, PER CLASS

Prototypes are a **scratch copy** of the byte-frozen detector (`$S/proto-detector.mjs`), with arms behind env switches. **Nothing in `scripts/` was touched.**

### 6.1 The control proves the copy is faithful
```
[control-shipped] 6732 ms  files=2231 reads=128203 resolved=9780 (7.63%)
                  RAW findings=2105; rows live=1459 frozen=1390; MISSING=0 SHRUNK=0; NEW rows=69 (141 reads)
[control-copy]    6853 ms  files=2231 reads=128203 resolved=9780 (7.63%)
                  RAW findings=2105; rows live=1459 frozen=1390; MISSING=0 SHRUNK=0; NEW rows=69 (141 reads)
```
Identical on every figure. The control's 2,105 raw findings vs the gate's 1,964 is exactly the declared post-filter chain: M6 cleared 124 + M11 cleared 11 + M13 cleared 6 = 141. The 69 "new rows" at control are those same filtered rows. **All deltas below are measured against the CONTROL, never against the frozen 1,390.** (CONFIRMED)

### 6.2 The arms
| arm | resolved | rate | Δ resolved | wall-clock | raw findings | NEW rows vs control | **frozen rows ERASED** |
|---|---|---|---|---|---|---|---|
| control | 9,780 | 7.63 % | — | 4.1–6.9 s | 2,105 | — | 0 |
| **P1a** bind destructuring at variable declarations | 9,987 | 7.79 % | **+207** | 4.4–6.6 s | 2,121 | **+9** | **0** |
| **P1b** bind imported names to the exporting module | 9,780 | 7.63 % | **+0** | 6.7 s | 2,105 | +0 | 0 |
| **P5** admit all six corpus walk roots to the root prior | 12,368 | **9.65 %** | **+2,588** | 4.2 s | 2,124 | **+45** | **13** |
| **P6** P5 + P1a | 12,575 | **9.81 %** | **+2,795** | 4.5 s | 2,140 | +54 | 13 |
| **P2** `minRows` 40 → 8 | 14,204 | **11.08 %** | **+4,424** | 4.5–6.6 s | 3,802 | **+1,092** | **15** |
| **P3** P2 + P1a + P1b | 14,411 | 11.24 % | +4,631 | 6.9 s | 3,818 | +1,101 | — |
| **P4** `minRows` → 1 (threshold deleted) | 15,057 | **11.74 %** | +5,277 | 6.4 s | 4,019 | +1,200 | — |

**No arm costs measurable wall-clock.** The scan is 4–7 s over 2,231 files either way; the variance is cache warmth, not the arms. **The cost of a resolution pass is triage, never compute.** (CONFIRMED)

### 6.3 What each class would actually need
| class | n | what a pass needs | measured verdict |
|---|---|---|---|
| B1c host globals | 19,827 | *nothing* — exclude from the denominator, not resolve | **not a resolution target at all** |
| B1b imports | 9,899 | bind imported names to the exporting declaration | **P1b: +0. Dead lever** — these are module-level frozen tables and store handles that no generator produces, so the terminus is unresolvable anyway |
| B1a destructuring | 2,863 | one binding rule in `buildIndex` + one grounded-property rule | **P1a: +207, 0 erasure. Cheapest clean win, tiny** |
| A1 vocabulary wall | 4,556 | lower `minRows`, or widen the corpus walk | **P2/P4: caps at 11.74 %, +1,092 rows to triage, 15 rows erased** |
| B2/B3/B5/D1 cascade | 76,413 | true interprocedural dataflow with a value lattice | **not measured; PLAUSIBLE that only a real type/flow analysis reaches it — and CR-OSR-FREEZE-1/2/3-R1 already records four measured walls where exactly that was attempted and retired** |
| C2 computed, F1/F2 unmodelled, E1 | 1,467 | per-form rules | ~1.2 % of unresolved; not worth a governed migration |
| type-directed pass (JSDoc) | — | a typedef→shape name bridge | **measured DEAD, §6.5** |

### 6.4 ⚠ THE NON-MONOTONICITY HAZARD — the finding that binds any future pass
Resolution is **not** monotone in findings. Every arm that widened the vocabulary **erased frozen rows**:

```
[P5-all-roots] RAW findings=2124; rows live=1491 frozen=1390; MISSING=13 SHRUNK=0; NEW rows=114
[P2-minrows8]  RAW findings=3802; rows live=2536 frozen=1390; MISSING=15 SHRUNK=0; NEW rows=1161
[P1a]          RAW findings=2121; rows live=1468 frozen=1390; MISSING=0  SHRUNK=0; NEW rows=78
```

**Mechanism:** more shapes in `known` means a receiver that used to bind to exactly one shape now binds to two, and `scanReaders`'s `objects.length === 1` guard *suppresses the finding entirely*. So a "better" resolver silently deletes banked debt. Under the shrink-only ratchet an erased row surfaces as a **STALE ROW** red — a red for the right reason with the wrong diagnosis, and the lane that hits it will read it as "the fix landed" rather than "the instrument stopped seeing it". If any erased row is a `CLASS_A_PROTECTED_IDENTITIES` true positive, that is real debt loss with no guard against it: `assertClassADebtPreserved` covers the post-FILTERS, not the detector's own ambiguity guard. **P1a is the only arm measured at zero erasure.** (CONFIRMED)

### 6.5 The type-directed pass is measured dead
The estate carries real JSDoc: **2,683 `@typedef` across 760 files, 19,305 typed `@param`, 7,788 typed `@returns`, 10,369 `@type`** — more annotation sites than the resolver's 9,780 resolved reads. But a type-directed pass needs a bridge from a typedef NAME to an OBSERVED SHAPE name, and there is none:

```
distinct typedef names: 1247
exact match to an observed shape name: 0
case-insensitive match to ANY observed shape name: 10
case-insensitive match to a USABLE (rows>=40) shape: 6
sample bridges: CulturalIdentity -> culturalIdentity | Locks -> locks | Settlement -> settlement | …
```

Typedefs are PascalCase type names (`SimSettlement`, `PulseOutcome`, `SpatialDigest`); corpus shapes are camelCase *container key* names (`settlement`, `npcs`). **0 of 1,247 match exactly; 6 usable bridges total.** Building the bridge is a hand-maintained 1,247-row mapping — precisely the hand-keyed-address rot this program is already bitten by. And the detector's own header records the prior: types "were wrong or silent on all three" ground-truth defects. (CONFIRMED)

### 6.6 Does the frozen inventory move?
**Yes, in both directions, and the brief's expectation is refuted.** A newly-resolved read is a *candidate finding*: P1a mints 16 raw findings / 9 identity rows; P2 mints 1,697 / 1,092. Existing rows never *grew* (0 under P1a, +1 read under P2), but rows *vanished* under every vocabulary-widening arm (§6.4). Any pass is a `--write` re-freeze, and because `EXPLAINED_WRITER_EXEMPTIONS` and the detector source are content-addressed, a detector change goes through the **migration-bundle door** (`--write --migrate-schema --migration-review=<bundle>`), executed on a branch cut at **exactly** the consist tip — never cherry-picked. (CONFIRMED against the recorded hazard `the-observed-shape-register-is-content-addressed-and-history-bound…`)

---

## 7. THE VERDICT AND THE RECOMMENDATION

**It is a mix, and the mix is lopsided: ~85 % structural limit, ~15 % denominator hygiene, plus one real bounded defect.**

- **Structural.** The detector grounds a receiver only by *name* — 337 container names, 84 single-home names, 2 roots. 76,413 unresolved reads (64.5 %) are the alias/param/element cascade, which needs interprocedural dataflow. CR-OSR-FREEZE-1/2/3-R1 already records **four measured walls** where full-tree exact resolution was attempted and retired, including a hard `16,385 > 16,384` abstract-state budget failure. Re-attempting it is a fifth wall, not a fix. Deleting the row threshold entirely still stops at **11.74 %**.
- **Hygiene.** 20,103 reads (15.7 %) can never be domain reads. Reporting one number over that denominator is what makes the guard look like it covers 8 % of its surface when it covers ~17 % of the surface it is actually about (8,562 / 51,095 on corpus-vocabulary reads).
- **The real defect.** The root prior is two-thirds dark, and its own header says otherwise.

### The cheapest honest step — two acts, in this order

**7.1 — FIRST: rule on the dark root prior.** This is a genuine instrument defect with a written-down contradiction: `legacy-reader-shape-scan.mjs` states the prior binds "`settlement`, `worldState`, `save`, `campaign`"; measured, `campaign` (1 row), `worldState` (25), `pulseResult` (12) and `wizardNews` (13) are all below `minRows = 40` and dark. A *walk root* is thin **by construction** — it is observed once per walk, not once per record — so filtering roots through a row threshold designed for records is a category error. Admitting all six is **+2,588 resolved (+26.5 % relative), +45 identity rows, zero wall-clock**. ⚠ It also erases **13** frozen rows (§6.4), so it is a governed migration with a bundle, and the 13 must be individually triaged before the write, not absorbed. **This is the one item I would charter.**

**7.2 — SECOND, and cheaper still: make the rate REPORT ITS DENOMINATOR.** Do not change resolution at all. Have the `--report` line say what it is measuring:

> `scan reached 9,780/128,203 reads (7.63 %); 20,103 reads are host-global-rooted; on the 51,095 reads of the corpus vocabulary the rate is 16.76 %.`

This answers the chair's original worry — "a guard whose verdict rests on 8 % of the surface" — with a measured, non-misleading figure, mints **zero** findings, erases **zero** rows and needs **no** migration. ⚠ Two pins constrain the spelling: `assertHealthyScanProvenance` throws unless `stats.reads === stats.resolved + stats.unresolved`, so a narrowed denominator must be an **additional** stats field, never a narrowed `reads`; and any new field moves the artifact digest, so it is a `--write` re-freeze — and if the count is taken inside the byte-frozen detector, it is the migration-bundle door. Computing it in `check-observed-shape-readers.mjs` as a post-scan derivation over the detector's findings/corpus keeps it out of the frozen blob. (PLAUSIBLE that a post-scan spelling suffices; I did not build it.)

**Do NOT build:** the import binding arm (+0, measured dead), the type-directed pass (no name bridge, measured dead), the `minRows` lowering (+1,092 rows to triage and 15 erased for +3.45 points), or a general dataflow resolver (five walls).

**P1a (destructuring bindings) is a clean, zero-erasure +207.** It is not worth a migration bundle on its own; it is worth **carrying as a second car** if 7.1 is chartered, since both are one detector change and one bundle.

---

## 8. ⛔ EVERYTHING NOTICED AND NOT TOUCHED

Each item is specific enough to slot. Owner law: there is never deferred work.

1. **The root prior is two-thirds dark and the header says otherwise.** `scripts/lib/legacy-reader-shape-scan.mjs`, the comment at the `roots.has(n.text)` return, names `settlement`, `worldState`, `save`, `campaign`; `makeResolver`'s `rootShapes.filter((n) => known.has(n))` admits only `save` (208 rows) and `settlement` (420). → **charter slot (this is §7.1).**
2. **A wider vocabulary ERASES frozen rows** via the `objects.length === 1` ambiguity guard (13 rows under the root arm, 15 under `minRows=8`), and `assertClassADebtPreserved` does not cover it — it guards the post-filters, not the detector's own guard. → **chair ruling: any register migration that changes resolution must report MISSING rows, and a class-(a) identity among them is a STOP.**
3. **`stats.reads` counts host/runtime surface.** 20,103 reads (15.7 %) are host-global-rooted; `Object.freeze` alone is 7,473 (5.8 % of the whole denominator), `Array.isArray` 3,709, `Math.*` ~4,900, `Number.isFinite` 1,400. → **§7.2's reported split.**
4. **The M12 language-surface filter is currently vacuous.** `--report` prints "M12 language-surface filter (toLocaleString): cleared 0 read(s) across 0 identit(ies)". A declared filter clearing nothing is either dead machinery or a filter whose roster never grew past its first entry — and it cannot help §7.2 regardless, because it clears FINDINGS, not READS. → **chair: retire, or grow its roster and say which.**
5. **`src/components/` is the worst-resolved slice at 5.18 %** (vs 7.94 % domain), and it is exactly the CR-OSR-FREEZE-7 UNREVIEWED-UI cohort — 50 files / 128 identities / 192 reads enforced on the frozen inventory. The cohort's enforcement rests on the thinnest resolution in the estate. → **owner/chair note beside CR-OSR-FREEZE-7.**
6. **The frozen `scanStats` is already stale against the tree:** `2228/128176/9766` frozen vs `2231/128203/9780` live (EM-B1k2 + CURE-I landings). Not a gate failure — the sentinel is a 90 % floor — but the register's recorded telemetry drifts silently until the next `--write`. → **expected to self-correct at the refreeze; worth one line in the refreeze note so nobody reads the delta as a defect.**
7. **`.sm` / `.xs` / `.md` / `.xxs` are 4,716 unresolved reads** — a design breakpoint-token constant read across the UI. Structurally unreachable by any corpus-grounded resolver and pure denominator weight. → **fold into §7.2's split as a named example.**
8. **265 reads sit on `let x;` declared with no initializer** and assigned later (`src/application/commands/canonEventCommandRecovery.js:158,163,166`, `authority.receipt` / `.phase` / `.status`). No arm here reaches them; they need assignment-flow tracking. → **record as a known evasion beside the detector's existing "KNOWN EVASIONS" list, which does not currently name it.**
9. **The 38,843 "reads that matter" figure is a CEILING, not a count** — `Float32Array.from` and `CONTROL_CHARACTERS.test` both scored as "mattering" because `from` and `test` are usable-shape keys. Any future use of this number must carry the ceiling caveat. → **record with the figure wherever it is cited.**
10. **821 distinct `src/domain/` files carry at least one mattering unresolved read.** The blind surface is estate-wide; there is no small subtree to fix first. → **relevant to any future "resolve the important files first" proposal: there isn't one.**
11. **1,247 distinct JSDoc typedef names, 0 exact matches to an observed shape name.** If the estate ever wants type-directed resolution, the bridge is the work, and a hand-maintained 1,247-row mapping is the hand-keyed rot this program already recorded. → **closed-with-reason unless the owner wants typed shapes as a product-level decision.**
12. **`scripts/lib/reader-shape-scan.mjs` (8,613 lines, the EXACT instrument) is reachable only via `--scan-only --scan-mode=exact-origin`** and is retired for full-tree use by CR-OSR-FREEZE-1. I did not exercise it; its targeted per-file mode is the existing escape hatch for any single read this lane's classes leave ambiguous. → **noted as available, not evaluated.**

---

## 9. PROVENANCE

All apparatus in `$SP/lane-tool-13-scratch/`, all read-only against the tip:

| file | what it is |
|---|---|
| `osr-report.txt` / `.err.txt` | the reproduced `--report` run (exit 0, stderr empty) |
| `dump-corpus.mjs` → `corpus.json` | the executed corpus, cached once (11,108 ms) |
| `classify.mjs` → `classes.json`, `classify.out.txt` | the cause partition; reproduces `reads`/`resolved` exactly |
| `deep.mjs` → `deep.json`, `deep.out.txt` | B1/B2 sub-causes |
| `anatomy.mjs` / `anatomy2.mjs` → `anatomy*.json`, `.out.txt` | denominator anatomy, reads-that-matter, per-file sampling |
| `proto-detector.mjs` | scratch COPY of the byte-frozen detector + three env-gated arms |
| `proto-run.mjs` → `p-*.json`, `p2-*.json`, `p3-*.json`, `proto-runs*.txt` | the priced arms |
| `typedef-names.txt` | 1,247 distinct JSDoc typedef names |

`git -C $SP/read-tip-141a1d775 status --short` → **0 lines**, before and after. `node_modules` in scratch is a symlink to `$SP/slot-2/node_modules`. No gated run, no vitest, no `npm run check`, no `git` mutation, no write outside this scratch directory.
