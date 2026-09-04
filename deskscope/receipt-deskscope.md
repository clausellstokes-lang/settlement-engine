# RECEIPT — lane DESKSCOPE — **COMPLETE**

- Lane: DESKSCOPE. **Measurement and design only.** No file edited, staged, committed; no
  ref written anywhere; no `git` state-mutating command run at all.
- Seat: Opus 5. Date: 2026-09-04.
- Read dock: `…/58f0a8e2-…/scratchpad/laneKERNELMARK-tree`, HEAD
  **`c2f80ffc957a15ab18e756e0aae2b56ceb78fc9c`**
  (*"§891 cure: the capsule battery's runtime-tests fixture stops being a green with an
  expiry date"*).
- Ledger tree read: `/Users/cstokes/Desktop/settlement-engine`, branch
  `review-fixes-2026-07-08` (docs only).
- **Gate discipline honoured: ZERO test commands run.** No vitest, no `npm test`, no
  `npm run check`, no `npm run build`, not one file. All measurement is `cat`/`grep`/`sed`
  and read-only `node -e` parsing of generated data. No `node_modules` symlink touched.
- No subagents spawned.
- Deliverables: this file · `leaves.md` · `desk-plan.md` · two helper scripts
  (`load.cjs`, `census.cjs`) written to this scratch dir only.

**Method note.** The corpus leaves are ES modules, so I parsed them by slicing the
`Object.freeze(…)` argument and neutralising the generator's `LIVE_STRING_BINDINGS` bare
identifiers to a placeholder before `JSON.parse`. That substitution touches **value
identity only, never structure**, so every count below (blocks, pools, variants, slot
arrays, marks) is exact. The one place it could mislead — a variant's `text` — I never
counted a placeholder as a slot, because slot scans read `/\{slot\}/` and the placeholder
is `"<LIVE_STRING>"`.

---

## 1. THE UNIT AND THE DENOMINATOR — **CONFIRMED**

**A "corpus leaf" is one `*.generated.js` under `src/data/dossierStateProse/`, and it is
the same thing as a "desk".** Quoted, `dossierMounts.js:83`:

> `@property {string} desk the corpus leaf under src/data/dossierStateProse`

There are **six**. `dossierMounts.js:106` states the remainder in its own words:

> *"a mount needs a desk to turn live state into a pool key, and **five of the six desks are
> unwritten**."*

**⚠ THE BRIEF'S FRAMING NEEDED CORRECTING.** The brief carried *"six corpus leaves at 8 to
13 cars each"*. Six is the **total**, not the remainder, and `economy` is **partly lit** —
4 of its 15 blocks are mounted. The remainder is **five wholly dark leaves plus eleven dark
blocks inside the lit leaf**. I flag this because it is the same class of error the brief
warned me about (dividing by the wrong unit), one level up.

**Denominator — 68 blocks / 708 pools / 2,266 variants / 64 dark.** CONFIRMED four ways:
1. Per-leaf generator headers sum to 68 blocks and 2,266 variants (11+15+23+7+3+9;
   383+329+634+256+246+418).
2. `dossierMounts.js:11` — *"The corpus already carries a `sectionTarget` on **45 of its 68
   blocks**"*.
3. `DOSSIER_MOUNTS` holds 5 rows over **4 distinct blocks**; `UNMOUNTED_BLOCKS` holds **64**;
   4 + 64 = 68, which the walker's TOTALITY arm asserts is exactly the corpus.
4. `tests/lint/.dossier-mounts-baseline.json` reads `{"UNMOUNTED_BLOCKS":{"blocks":64}}`.

The 708-pool figure is independently corroborated by
`dossierMountRegistry.walker.test.js:20`: *"**687 of its 708 pools** carry exactly one
variant per angle"*.

**LIT: 5 mounts, 4 blocks, 27 pools** (DS-ECO-1 5 + DS-ECO-2 7 + DS-ECO-8 7 + DS-ECO-9 8).
**DARK: 64 blocks, 681 pools.**

Full enumeration in `leaves.md`.

## 2. DESK CAR 1 IS GENUINELY DRAWN — **CONFIRMED**

Not merely registered. `EconomicsGlance.jsx:70`:

> `const header = drawnAtMount('economics.prosperityHeader', headerRung);`

and lines 99–101 draw `economics.economyTile`, `economics.foodTile`,
`economics.seasonTile`; `EconomicsTab.jsx:320` draws `economics.foodSecurity`. All five
registry rows have a live JSX site, which is also what the walker's REACHABILITY arm
requires. **This matters because it converts §3 from a recorded deferral into a shipping
defect.**

## 3. THE `{complexity}` BLOCKER — **SURVIVES. CONFIRMED, three ways.**

**(a) The producer emits eleven values, all unusable.**
`src/generators/economy/prosperity.js:293-314` returns exactly eleven title-cased strings,
five carrying an em dash.

**(b) The desk refuses all eleven.** `economyStateProse.js:151-159` `bareCommonFill`.
Executed against the eleven producer values — output verbatim:

```
REFUSED "Highly diversified — multiple major revenue streams"
REFUSED "Diversified — broad institutional economic base"
REFUSED "Concentrated — fewer revenue streams than scale suggests"
REFUSED "Diversified market economy"
REFUSED "Specialized production and trade"
REFUSED "Limited — narrow economic base for this scale"
REFUSED "Mixed subsistence and market"
REFUSED "Agricultural surplus with trade links"
REFUSED "Subsistence with minor surplus"
REFUSED "Subsistence with surplus"
REFUSED "Subsistence — survival economy"
em-dashed: 5  FILLED: 0 / 11
```

**(c) The pools degrade.** `stateProseKernel.js:146-151` `variantIsAnchored` drops any
variant naming an unfilled slot. Measured over DS-ECO-1's five pools:

```
POOL "COMBINATION C1: a high rung on a working approach": 3 variants, 2 name {complexity}
POOL "COMBINATION C2: a high rung on a narrow approach": 3 variants, 1 name {complexity}
POOL "COMBINATION C3: the middle rungs":                 3 variants, 1 name {complexity}
POOL "COMBINATION C4: a low rung on a working approach": 3 variants, 0 name {complexity}
POOL "COMBINATION C5: a low rung on a narrow approach":  3 variants, 1 name {complexity}
```

⇒ eligible: **C1 1/3 · C2 2/3 · C3 2/3 · C4 3/3 · C5 2/3**. The annex records the identical
arithmetic at §0c-3, so my independent measurement **agrees with the annex exactly**:

> *"C1 **1 of 3** · C2 2 of 3 · C3 2 of 3 · C4 3 of 3 · C5 2 of 3. C1 at one variant means
> every high-rung, working-approach settlement in a world prints the SAME sentence, which
> is the one outcome the corpus exists to prevent."*

`drawVariant` on a one-element eligible list returns index 0 for every seed
(`stateProseKernel.js:304`), so the degradation is total, not probabilistic.

**WHAT IS NEW.** §0c-3 was written 2026-09-02 with no desk wired. §2 above shows the
prosperity header now draws as a `sentence` rung. **The blocker is no longer deferred
theory; it ships.** §0c-3 remains marked **OPEN, THE CHAIR'S**, and the annex says the lane
*"has deliberately NOT chosen"* the vocabulary because the values are reader-facing. **I
propose no vocabulary and rule nothing.** I record only that the cost is now live.

## 4. THE §0c-4 SHAPE RESIDUE — **RE-MEASURED; TWO OF THREE FIGURES ARE WRONG**

### 4.1 Sentence-initial lowercase — annex 20 sites; **measured 11** ❌

I classified every one of the 2,266 variants' leading slot by its §0c Shape row.

| slot | shape | annex | measured | verdict |
|---|---|---|---|---|
| `{good}` | bare-common | 5 | 5 | ✅ |
| `{reason}` | bare-common | 3 | 3 | ✅ |
| `{stakes}` | phrase | 2 | 2 | ✅ |
| `{issue}` | phrase | 1 | 1 | ✅ (after a stop, not index 0) |
| `{timeband_since}` | phrase | 8 | **0** | ❌ REFUTED |
| `{burden}` | — | 1 | **0** | ❌ REFUTED — not a slot |

- **`{timeband_since}` never begins a variant.** All 24 of its uses are mid-sentence, across
  all six leaves. The annex's example at line 250 —
  *"{timeband_since}, {settlement} is still living inside…" wants "Years on, Thornwall…"* —
  is a **constructed illustration**; grep finds no such variant in the corpus or the annex.
- **`{burden}` is not a slot.** `grep -c '{burden}'` over the six leaves returns
  `0 0 0 0 0 0`. It **is** a real slot in the **causal** corpus (1 use) — the likely source
  of the error, and a sign the §0c-4 figures were taken across both corpora.
- The annex **omits `{band}`**, which has **4** genuine index-0 sites and is `RESERVED`, so
  capitalisation cannot cure it.

The named cure is unchanged and still right (§0c-4: *"~3 lines: `fillSlots` capitalises a
fill whose slot sits at index 0"*), with one caveat the annex does not state: the `{issue}`
site sits **after a sentence stop**, so a literal index-0 rule leaves it uncured. The
ONE-CONSIST constraint stands and I did not touch the kernel.

### 4.2 `{band}` — annex *"37 uses across 26 blocks"*; the annex conflates two counts ❌

| measure | measured |
|---|---|
| blocks **declaring** `{band}` on a SLOTS line | **27** |
| blocks with a variant that **uses** `{band}` | **7** |
| variant **sites** using `{band}` | **16** |

Users: `DS-DEF-10`(1) · `DS-GEN-7`(2) · `DS-GEN-8`(5) · `DS-REL-2`(3) · `DS-GEN-9`(2) ·
`DS-GEN-11`(2) · `DS-STR-1`(1).

The 27/7 gap is legitimate under the annex's own rule (§0h V1-h: *"a slot used in a variant
MUST appear on its block's SLOTS line; **a slot declared need not be used**"*), so the "26
blocks" figure is a **declaration** count and the "37 uses" is neither. **This is the most
schedule-relevant correction in the report:** read as 26 blocks, `{band}` gates most of the
arc; read correctly, `economy`, `power` and `warFaith` have **zero** `{band}` use between
them and are not gated by it at all.

⚠ A hazard the annex does not name: a rename still edits **27 SLOTS lines** even though only
16 seams change, and it needs a projection regeneration — **a landing act, not a lane's**.

### 4.3 `{reason}` — annex *"31 seams"*; **12 in the state corpus, 19 in the causal** ⚠

12 + 19 = 31, so the annex figure is the **union of both corpora** while the §0c-4 heading
sits in the state annex. **I did not re-derive the 5-supply-their-own-determiner split and I
REFUSE to name it** — it needs all 31 seams read against their surrounding text, and a
guessed split is exactly the false-report shape. The annex's conclusion needs no correction:
*"It has no producer, so this is decidable at wiring and not before"* ⇒ `{reason}` gates no
car.

### 4.4 Inheritance per leaf (the brief's actual question) — **CONFIRMED**

| leaf | initial-lowercase | `{band}` use | `{reason}` | inherits |
|---|---|---|---|---|
| `power` | none | none | none | **NONE** |
| `warFaith` | none | none | none | **NONE** |
| `economy` | `{good}`×5 | none | none | 1 of 3 |
| `stressors` | `{reason}`×2 | 1 block | 3 blocks | all 3 |
| `defense` | `{reason}`×1 | 1 block | 1 block | all 3 |
| `general` | `{stakes}`×2 `{issue}`×1 | 4 blocks / 12 sites | 1 block | all 3, worst |

## 5. THE UNPRICED SIBLING SUBSYSTEM — **PRICED**

### 5.1 `dmFieldProjection.js` — **NOT a subsystem; a constraint on 8 blocks**

- 157 lines / 7,362 B; 15 DM-editable paths; `DM_FIELD_FRAMED_BY_BLOCK` maps **8 blocks**.
- **All 8 are dark** — DS-GEN-5, DS-GEN-6, DS-GEN-9, DS-GEN-11, DS-REL-2, DS-DEF-1,
  DS-DEF-3, DS-ECO-6, each checked against `UNMOUNTED_BLOCKS`.
- **`projectBesideDmField` has ZERO callers.** Its only apparent `src/` consumer,
  `settlementOriginProse.js:53`, is a **doc-comment citation**
  (`display/stateProse/dmFieldProjection.js:53`), not an import. **CONFIRMED** by reading
  the surrounding lines 50–58.

**⇒ +0 cars.** Cost is one extra call per DM-PEN mount, and the first such car owes the
byte-identity proof the module's own docblock names. Extends
`tests/domain/dmFieldProjection.test.js` (exists, 15,628 B).

### 5.2 `causalDossierProse.js` — **THE LARGEST UNMEASURED SURFACE IN THE ARC**

Measured from `src/data/dossierCausalProse.generated.js` by parse:

- **78 families · 468 variants · 210,260 B.** 57 two-armed, 21 one-armed.
- Sections: relations 32 · economy 27 · power 24 · faith 20 · population 16 · tensions 15 ·
  history 13 · defense 8.
- **21 slots**, five absent from the state corpus: `{house}` 41 · `{temple}` 32 ·
  `{third_party}` 7 · `{war}` 1 · `{wound}` 1 · `{burden}` 1.
- **Zero `src/` consumers** — nothing imports `causalDossierProse.js` but its own test.

It is **not** "a seventh desk", for four reasons taken from the code:
1. **No position layer, and it may not borrow one.** `dossierMounts.js:19-24` rules that
   causal routing by section is *"legitimate, because a join's section genuinely IS a
   property of the join"* — the **opposite** of the state register's design.
2. **It cannot select its own content, by design.** `causalDossierProse.js:14-18` — *"this
   module renders only the joins it is HANDED. The caller derives them from real records
   (`causes[]`, `sourceEventId`, the CW-0 `receiptField` map)."* **That caller does not
   exist.** The missing piece is a join-evidence deriver.
3. **R-DOS-A risk.** All 57 two-armed families can print the neighbour's condition on this
   town's page if the deriver picks the wrong arm — a **false statement about the world**,
   not a missing sentence.
4. **Five slots have no producer**, so 82+ seams degrade silently until wired.

**PRICING — PLAUSIBLE, and weaker than the state estimate.** 2 design cars + 2–4 deriver
cars + 6–8 content cars ⇒ **10–14 cars**. Basis: the design and deriver counts come from the
four obligations above; the content count divides 468 variants by DESK CAR 1's throughput.
**I refuse a point figure** — the causal corpus uses one `*` pool per family rather than
keyed pools, so the pool metric that sizes the state cars does not transfer.

## 6. THE CAR ESTIMATE — **PLAUSIBLE, n = 1**

DESK CAR 1 measured: 1 module (15,581 B) · 4 blocks · **27 pools** · 5 mounts · 2 components
· 1 test file. Cost is dominated by pools, because `economyStateProse.js:14` says a desk
*"maps LIVE STATE to a POOL KEY, and nothing else"*.

681 dark pools ÷ ~27 ⇒ **≈25 desk cars**, plus K1 (kernel), C1 (complexity) and B1 (`{band}`)
⇒ **≈29 for the state remainder**, **≈39–43 including the causal register**.

**I refuse a point estimate.** DESK CAR 1 was the easiest four blocks in the corpus — no
demoted dimension, no DM-pen field, no `{band}`, one tab, and a module that did not yet have
to share a test file with a second desk. Ordered consists are in `desk-plan.md` §6.

## 7. THE BIGGEST RISK — BYTES, AND IT IS NOT THE CAR COUNT

**Only one of the six leaves is reachable from any `src/` module.** Grep over `src/` returns
exactly one real import of a corpus leaf: `economyStateProse.js:40` →
`economy.generated.js`. ⇒ **761,458 B of authored content is on disk and in no build**
(five dark leaves 551,198 B + causal corpus 210,260 B).

Mitigating fact, **CONFIRMED**: `OutputContainer.jsx:62` — *"Lazy-loaded tabs (each loads
only when first viewed) … same per-tab dynamic imports"* — all 24 tabs come from
`./dossier/dossierLazyTabs.js`. So a leaf imported **only** by its tab's desk lands in that
tab's lazy chunk, not first-paint closure.

The margins leave no room if that stops being true. Carried from the HORIZON-DARK carlist §5
(measured at T13's `594c7521f` — **not re-measured by me; I ran no build**): engine
**675,339 / 676,000 = 661 B**; first-paint closure RAW **1,047,496 / 1,048,000 = 504 B**. I
did confirm both ceilings exist: `tests/build/vendorPdfLazy.test.js:565`
`CLOSURE_BUDGET_BYTES = 1_048_000` and `:768` `expect(size).toBeLessThan(676_000)`.

⚠ **A COUPLING NOBODY HAS FLAGGED.** `economy.generated.js:6` carries an **inbound** import —
`import { ECONOMY_FRESHNESS_SENTENCES } from '../../domain/display/economyFreshness.js';` —
because the generator's `LIVE_STRING_BINDINGS` refuses to inline a live engine string. So the
corpus leaf **drags a display module (and its `registryRerunKeys.js` dep) into whatever chunk
the leaf lands in**. The other five leaves have **zero** imports today, but
`LIVE_STRING_BINDINGS` is a growing list, and a future binding gives a dark leaf the same
edge. This is a chunk-placement hazard that no current test guards.

**STRUCTURAL PREVENTION (a design, not an act).** Every desk car should add one arm asserting
its leaf is **absent** from the first-paint source graph. The machinery exists and needs **no
new test file**: `tests/build/cultureProfilesLazy.test.js:76` `firstPaintSourceGraph()`
already walks `src/main.jsx`'s static closure and carries an `EAGER_ANCHOR` assertion so a
broken walk cannot pass vacuously. Extend that file, or the walker beside its reachability
arm.

## 8. TWO THINGS RAISED, NOT RULED

1. **PDF-path blocks may be unmountable.** `dossierMountRegistry.walker.test.js:72` —
   `const COMPONENTS = join(ROOT, 'src/components');` — so REACHABILITY scans only
   `src/components`. `DS-GEN-10` (*"PDF › overview / economics / defense / viability / power
   slices"*) and `DS-WAR-4` (*"PDF › liveWorld slice"*) name the PDF path, which lives under
   `src/pdf`. A row for either reds the arm. Either the arm widens (a walker change, chair
   class) or the two blocks stay dark **as a written deferral** rather than being re-found.
2. **The test-file ceiling blocks car 2 of the arc.** Five new desk modules want five new
   test files; the known-failure census is FULL at 10/10 with zero headroom and a new test
   file reds three censuses. So every desk after `power` either crowds into
   `economyStateProseDesk.test.js` — a file named for a different desk — or the census gains
   headroom. **I found this written down nowhere.** It is a chair decision and I have not
   made it.

⛔ **One owner-gated item flagged and not touched:** `DS-FTH-2` is *"War & Faith › Faith
teaser (free / anon; names no deity)"* — a **paid-surface** block. Mounting it is
paid-surface behaviour and belongs to the owner, not to a lane or the chair.

---

## RETROVALIDATION ROW

| # | claim | grade | basis / how to refute |
|---|---|---|---|
| 1 | A corpus leaf = one `*.generated.js` under `src/data/dossierStateProse/`; there are 6, one written | **CONFIRMED** | `dossierMounts.js:83`, `:106` quoted verbatim; `ls` of the directory |
| 2 | 68 blocks / 708 pools / 2,266 variants / 64 dark / 27 pools lit | **CONFIRMED** | four independent agreements (§1); re-run `census.cjs` in this dir |
| 3 | The brief's "six leaves remaining" is the total, not the remainder | **CONFIRMED** | `economy` has 4 of 15 blocks mounted |
| 4 | DESK CAR 1 is drawn, not merely registered | **CONFIRMED** | `EconomicsGlance.jsx:70,99-101`; `EconomicsTab.jsx:320` |
| 5 | `{complexity}` fills 0 of 11; DS-ECO-1 C1 degrades 3→1 | **CONFIRMED** | executed output quoted §3; agrees with annex §0c-3 independently |
| 6 | The `{complexity}` degradation ships today | **CONFIRMED** | claim 4 + claim 5 together |
| 7 | Sentence-initial residue is 11 sites, not 20 | **CONFIRMED** | full scan of 2,266 variants; `{timeband_since}` 0/24 at index 0; `{burden}` absent from all six leaves |
| 8 | `{band}`: 27 declaring / 7 using / 16 sites | **CONFIRMED** | block-level vs variant-level scans, both run |
| 9 | `power` and `warFaith` inherit none of the three residues | **CONFIRMED** | §4.4 table, derived from claims 7-8 |
| 10 | `{reason}`'s 31 seams = 12 state + 19 causal | **CONFIRMED** | both corpora scanned; 12+19=31 |
| 11 | The 5/26 determiner split within `{reason}` | **REFUSED** | not derived; needs 31 seams read in context — deliberately not guessed |
| 12 | `projectBesideDmField` has zero callers; all 8 DM-PEN blocks dark | **CONFIRMED** | `settlementOriginProse.js:50-58` is a doc comment; 8 ids checked against `UNMOUNTED_BLOCKS` |
| 13 | Causal corpus: 78 families / 468 variants / 210,260 B / 21 slots / zero consumers | **CONFIRMED** | parsed; consumer grep over `src/` |
| 14 | Causal register costs 10–14 cars | **PLAUSIBLE** | 4 code-derived obligations + a throughput divide; pool metric does not transfer |
| 15 | State remainder ≈29 cars; arc ≈39–43 | **PLAUSIBLE** | extrapolated from ONE landed car (27 pools), the easiest four blocks in the corpus |
| 16 | 761,458 B of corpus is in no build; leaves land in lazy tab chunks | **CONFIRMED** | one real leaf import in `src/`; `OutputContainer.jsx:62` quoted |
| 17 | Engine 661 B / first-paint 504 B of margin | **CARRIED, NOT MEASURED** | from HORIZON-DARK carlist §5 at `594c7521f`; **I ran no build**. Re-measure at boarding |
| 18 | `economy.generated.js` imports a display module; other five import nothing | **CONFIRMED** | `economy.generated.js:6`; `grep -c '^import'` = 0 on the other five |
| 19 | PDF-path blocks DS-GEN-10 / DS-WAR-4 cannot satisfy REACHABILITY | **CONFIRMED** | `dossierMountRegistry.walker.test.js:72` + both block titles |
| 20 | The test-file ceiling blocks desk 2 | **CONFIRMED as a constraint; UNRULED as a decision** | census FULL 10/10 (brief + carlist §5); no existing doc addresses per-desk test homes |

**WHAT WOULD FALSIFY THE CENTRAL ESTIMATE (claim 15).** Land the `power` desk and measure
its real car count against the ~3 predicted here. If a 79-pool leaf with zero residue takes
more than four cars, the 27-pools-per-car unit is wrong and every figure in `desk-plan.md`
§6 scales with it.

**NOT DONE, deliberately, and documented so it is not re-found as a gap:**
- No test executed, per the brief's hard rule — so every "the gate would red" statement is
  reasoning from the gate's source, never from a run, and is labelled as such.
- The `{reason}` determiner split (claim 11) — refused rather than guessed.
- Per-leaf writer-reach row predictions — refused; the grade is a measured grounding fact
  and `writer-reach-scan.mjs` was not run.
