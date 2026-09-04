# DESK PLAN — the remainder, ordered into landable consists

Dock HEAD `c2f80ffc957a15ab18e756e0aae2b56ceb78fc9c`. **This is a lane's DESIGN, not a
ruling.** Register acts belong to the chair at the landing; nothing below is an instruction
to move one.

## 1. WHAT A CAR IS, DERIVED FROM THE ONLY CAR THAT EXISTS

DESK CAR 1 is the sole datum (n = 1), so every car figure below is **PLAUSIBLE**, and I say
so each time rather than dressing an extrapolation as a measurement.

**DESK CAR 1, measured:** 1 desk module (`economyStateProse.js`, 15,581 B) · 4 blocks ·
**27 pools** · 5 mount rows · 2 component files (`EconomicsGlance.jsx` 4 sites,
`EconomicsTab.jsx` 1 site) · 1 test file (`economyStateProseDesk.test.js`, 21,453 B).

A car's cost is dominated by **pools**, not blocks: `economyStateProse.js:14` —
*"A desk maps LIVE STATE to a POOL KEY, and nothing else"* — so each pool is one arm of a
key function, and a 42-pool block costs fourteen times a 3-pool block.

**The car unit I use below: ~25–30 dark pools.** DESK CAR 1 sat at 27.

### What every desk car must pay, from the walker's own header (CONFIRMED)
`dossierMountRegistry.walker.test.js:12-17`:

> `TOTALITY` every corpus block carrying a pool is either mounted or declared dark.
> `ONE SENTENCE` no block draws its SENTENCE rung at two positions (car C3).
> `REACHABILITY` every mount id resolves to exactly one site under src/components.
> `HONESTY` every mount over a dimension-bearing block declares that dimension…
> `SHRINK-ONLY` the dark half never grows.

So each car: adds N mount rows AND strikes the same N blocks from `UNMOUNTED_BLOCKS` **in
the same commit**; wires exactly one JSX site per mount id; declares `dimensions` on any
DIM block; and never lets the dark list grow.

## 2. ⚠ THE REACHABILITY RULE EXCLUDES TWO BLOCKS OUTRIGHT — CONFIRMED

`dossierMountRegistry.walker.test.js:72` — `const COMPONENTS = join(ROOT, 'src/components');`
The reachability arm scans **only** `src/components`. Two corpus blocks name the PDF path as
their surface:

- `DS-GEN-10` — *"PDF › overview / economics / defense / viability / power slices"* (5 pools)
- `DS-WAR-4` — *"PDF › liveWorld slice"* (5 pools)

The PDF renderer lives under `src/pdf`, not `src/components`. **These two blocks cannot be
mounted under the registry as it stands** — a row for either reds the reachability arm.
Either the arm widens to `src/pdf` (a walker change, and a chair call), or the two blocks
stay dark permanently and that should be written down as a deliberate deferral rather than
re-found by a later auditor. **I have not decided this; it is raised, not ruled.**

## 3. THE `{complexity}` BLOCKER — **SURVIVES, AND IT IS LIVE IN FRONT OF A READER**

**CONFIRMED, refuting nothing.** Three independent proofs:

1. **The producer.** `src/generators/economy/prosperity.js:293-314` returns exactly eleven
   strings, all title-cased, five carrying an em dash.
2. **The refusal.** `economyStateProse.js:151-159` `bareCommonFill` returns `undefined` on
   `/^[a-z]/.test(value)` failing, on any `[—–]`, and on sentence punctuation. Run over the
   eleven producer values: **0 of 11 fill, 5 refused on the em dash and all 11 on the
   capital.** Executed, output quoted in `receipt-deskscope.md` §3.
3. **The consequence.** `stateProseKernel.js:146-151` `variantIsAnchored` drops any variant
   naming an unfilled slot. Measured over DS-ECO-1: C1 has **3 variants, 2 of which name
   `{complexity}`** ⇒ **1 eligible**. `drawVariant` on a one-element list returns index 0
   for every seed.

The annex already records the same arithmetic (§0c-3): *"C1 **1 of 3** · C2 2 of 3 · C3 2
of 3 · C4 3 of 3 · C5 2 of 3"* and *"C1 at one variant means every high-rung,
working-approach settlement in a world prints the SAME sentence, which is the one outcome
the corpus exists to prevent."* **My independent measurement agrees with the annex exactly.**

**WHAT IS NEW SINCE THE ANNEX WROTE THAT ROW:** the annex was written 2026-09-02, when no
desk was wired. DESK CAR 1 has since wired `economics.prosperityHeader` as a **`sentence`**
rung, and `EconomicsGlance.jsx:70` draws it —
`const header = drawnAtMount('economics.prosperityHeader', headerRung);`. So the
one-sentence-for-every-town outcome is **no longer hypothetical; it ships today.** That
raises §0c-3 from a recorded deferral to a live product defect on a lit surface, and it is
the strongest argument for ruling §0c-3 before any further desk car lands.

§0c-3 is marked **OPEN, THE CHAIR'S** and the annex states the lane *"has deliberately NOT
chosen"* the vocabulary because *"the values are reader-facing words in the dossier's own
register"*. I keep that boundary: **I propose no vocabulary.** The decision needed is a
closed set of bare common-noun phrases plus a total map from the eleven producer values.

## 4. THE §0c-4 SHAPE RESIDUE — RE-MEASURED, AND TWO OF THE THREE FIGURES ARE WRONG

### 4.1 The sentence-initial lowercase seam — **annex says 20 sites; measured 11**

§0c-4 records *"A SENTENCE-INITIAL LOWERCASE SEAM, 20 sites over six slots
(`{timeband_since}` 8, `{good}` 5, `{reason}` 3, `{stakes}` 2, `{issue}` 1, `{burden}` 1)."*

Measured over all 2,266 shipped variants, classifying each slot by its §0c Shape row:

| slot | shape | annex | **measured** | verdict |
|---|---|---|---|---|
| `{good}` | bare-common | 5 | **5** | ✅ CONFIRMED |
| `{reason}` | bare-common | 3 | **3** | ✅ CONFIRMED |
| `{stakes}` | phrase | 2 | **2** | ✅ CONFIRMED |
| `{issue}` | phrase | 1 | **1** | ✅ CONFIRMED (after a stop, not at index 0) |
| `{timeband_since}` | phrase | 8 | **0** | ❌ **REFUTED** |
| `{burden}` | — | 1 | **0** | ❌ **REFUTED — `{burden}` is not a slot** |

- **`{timeband_since}` never begins a variant.** Zero of the 24 uses sit at index 0, in any
  of the six leaves. The annex's own illustration at line 250 —
  *"{timeband_since}, {settlement} is still living inside…" wants "Years on, Thornwall…"* —
  is a **constructed example**, and the annex has no such variant either.
- **`{burden}` does not exist as a slot.** `grep -c '{burden}'` over all six leaves returns
  **0/0/0/0/0/0**. The word "burden" appears only as ordinary prose and in DS-WAR-5's title.
  It *is* a real slot in the **causal** corpus (1 use) — which is a different corpus, and is
  the likeliest source of the error.
- The annex also **omits `{band}`**, which has **4** genuine index-0 sites and is
  `RESERVED`, so it cannot be cured by capitalisation at all.

**⇒ The real cure surface is 11 sites over four slots, not 20 over six.** The cure itself is
unchanged and still correct: §0c-4's *"~3 lines: `fillSlots` capitalises a fill whose slot
sits at index 0"*. One caveat the annex does not state — one of the 11 (`{issue}`) is **not**
at index 0 but after a sentence stop, so a literal index-0 rule leaves it uncured.

**The ONE-CONSIST constraint stands and I do not touch it.** §0c-4: *"three separate designs
each propose to edit `stateProseKernel.js`, and three serial edits by three lanes to one
77-line pure leaf is three chances to void the byte-identity guard."*

### 4.2 `{band}`'s six roles — **annex says 37 uses across 26 blocks; both halves need splitting**

The annex conflates two different counts, and the difference is the whole scheduling question:

| measure | count | what it means |
|---|---|---|
| blocks **declaring** `{band}` on their SLOTS line | **27** | the permitted palette (§0h V1-h: *"a slot declared need not be used"*) |
| blocks with a variant that **uses** `{band}` | **7** | the actual seams |
| variant **sites** using `{band}` | **16** | the actual rename surface |

The seven blocks that really use it: `DS-DEF-10`(1) · `DS-GEN-7`(2) · `DS-GEN-8`(5) ·
`DS-REL-2`(3) · `DS-GEN-9`(2) · `DS-GEN-11`(2) · `DS-STR-1`(1).

**This is the single most schedule-relevant correction in this report.** Read as "26 blocks",
the `{band}` split gates 27 of the 64 dark blocks across four leaves and looks like a
precondition for most of the arc. Read correctly, it touches **7 blocks and 16 seams**, and
**`economy` and `power` and `warFaith` have ZERO `{band}` variant use between them** — those
three leaves are not gated by it at all.

The "ONE WAVE OR NONE" rule still binds, and for the reason §0c-4 gives: *"under anchored
liveness a half-finished split degrades QUIETLY instead of failing loudly."* But the wave is
much smaller than recorded.

⚠ **A HAZARD THE ANNEX DOES NOT NAME.** The 27 declaring blocks each carry a `SLOTS:` line
in the annex, and memory records that annex headings are walker anchors matched by
`indexOf`. A `{band}` rename edits **27 SLOTS lines** even though only 16 seams change, and
the projection must be regenerated. **Regenerating a dossier-prose leaf is a landing act,
not a lane's** (FOLD 32).

### 4.3 `{reason}`'s determiner split — **annex says 31 seams; measured 12**

§0c-4: *"Of its 31 seams, five supply their own determiner… and the rest supply none."*
Measured in the state corpus: **12 uses across 4 blocks** (`DS-DEF-7` 4 · `DS-GEN-9` 2 ·
`DS-STR-2` 3 · `DS-CND-1` 3). The causal corpus adds **19** more, and 12 + 19 = **31** —
so the annex's figure is the **union of both corpora**, while the §0c-4 heading sits in the
state annex. I did not re-derive the 5/26 determiner split, and I **refuse to name it**
without reading all 31 seams against their surrounding text.

The annex's own conclusion stands untouched and is the right one: *"It has no producer, so
this is decidable at wiring and not before."* `{reason}` is therefore **not a gate on any
car**; it is a question each car answers when it writes its own fill.

### 4.4 Residue inheritance, per leaf — the answer to the brief's question

| leaf | initial-lowercase | `{band}` use | `{reason}` | inherits? |
|---|---|---|---|---|
| `economy` | `{good}`×5 (DS-ECO-4, DS-ECO-10) | **none** | none | **1 of 3** |
| `power` | none | **none** | none | **NONE — clean** |
| `warFaith` | none | **none** | none | **NONE — clean** |
| `stressors` | `{reason}`×2 (DS-STR-2, DS-CND-1) | 1 (DS-STR-1) | 3 blocks | **all 3** |
| `defense` | `{reason}`×1 (DS-DEF-7) | 1 (DS-DEF-10) | 1 block | **all 3** |
| `general` | `{stakes}`×2, `{issue}`×1 (DS-GEN-2) | **4 blocks, 12 sites** | 1 block | **all 3, worst** |

**`power` and `warFaith` inherit none of the three.** That is the finding that sets the order.

## 5. THE UNPRICED SIBLING SUBSYSTEM — WHAT IT ACTUALLY COSTS

### 5.1 `dmFieldProjection.js` — **CHEAP, and not a subsystem at all**

- 157 lines, 7,362 B. Pure, headless, no imports.
- Exports a frozen register of **15 DM-editable prose paths** across three entity kinds, and
  `DM_FIELD_FRAMED_BY_BLOCK` mapping **8 corpus blocks** to settlement paths.
- **All 8 are in `UNMOUNTED_BLOCKS`** — verified block by block: DS-GEN-5, DS-GEN-6,
  DS-GEN-9, DS-GEN-11, DS-REL-2, DS-DEF-1, DS-DEF-3, DS-ECO-6.
- **`projectBesideDmField` has ZERO runtime callers.** Its one apparent `src/` consumer,
  `src/generators/narrative/settlementOriginProse.js:53`, is a **doc-comment citation**
  (`display/stateProse/dmFieldProjection.js:53`), not an import.

**⇒ This is not an unmeasured surface. It is a CONSTRAINT on 8 of the 64 dark blocks**, and
its cost is one extra call per DM-PEN mount, not a car of its own. The right pricing:
**+0 cars, but the first car that mounts any of the 8 owes the first real call and a proof
of the DM's-pen law** — and the module's docblock says exactly what that proof is: *"a
DM-edited field renders the same bytes with the corpus fully wired as it does with the
corpus absent."* Extend `tests/domain/dmFieldProjection.test.js` (15,628 B, exists).

### 5.2 `causalDossierProse.js` — **THIS IS THE LARGE ONE, AND IT IS NOT A DESK ARC**

Measured from `src/data/dossierCausalProse.generated.js`:

- **78 join families · 468 variants · 210,260 B.** 57 families two-armed, 21 one-armed.
- Section spread: relations 32 · economy 27 · power 24 · faith 20 · population 16 ·
  tensions 15 · history 13 · defense 8.
- **21 slots**, five of which the state corpus never uses: `{house}` 41 · `{temple}` 32 ·
  `{third_party}` 7 · `{war}` 1 · `{wound}` 1 · `{burden}` 1.
- **Zero `src/` consumers.** `causalDossierProse.js` is imported by nothing but its own test.

**Why it is NOT six-more-desk-cars, and why the "just another leaf" reading is wrong:**

1. **It has no mount registry and cannot use the existing one.** `dossierMounts.js:19-24`
   rules explicitly that the causal register routes by section and that this is
   *legitimate, because a join's section genuinely IS a property of the join* — the exact
   opposite of the state register's design. A causal wiring needs its **own** position
   layer, or a ruled decision that section-routing suffices. That is a design car before
   any content car.
2. **It cannot select its own content, by design.** `causalDossierProse.js:12-18` — *"this
   module renders only the joins it is HANDED. The caller derives them from real records
   (`causes[]`, `sourceEventId`, the CW-0 `receiptField` map) and this module has no path to
   a settlement."* **That caller does not exist.** The missing piece is a *join-evidence
   deriver* that walks a settlement's causal records and emits `{familyId, arm, slots}`.
   That is engine-adjacent work with a truth-claim risk the desks do not carry: a wrong join
   makes the page **invent history**, which `dossierMounts.js` and the kernel's law 5 both
   exist to prevent.
3. **The arm is a required argument with no default** (R-DOS-A). Every one of the 57
   two-armed families can print **the neighbour's condition on this town's page** if the
   deriver picks the wrong end. That needs a per-family arm proof, not a spot check.
4. **Five slots have no producer anywhere in the tree** (`{house}`, `{temple}`,
   `{third_party}`, `{war}`, `{wound}`), so 82+ seams degrade silently until each is wired.

**PRICING — stated as a range with its basis, and refusing the parts I cannot derive.**
- **Design cars: 2** (the position layer; the join-evidence deriver's contract). PLAUSIBLE.
- **Deriver build: 2–4 cars.** PLAUSIBLE, basis: it must read `causes[]`, `sourceEventId`
  and the CW-0 `receiptField` map, and prove arm correctness over 57 two-armed families.
- **Content/wiring cars: 468 variants ÷ ~27-pool-equivalents ≈ 6–8 cars.** PLAUSIBLE, and
  weaker than the state estimate because the causal corpus has one `*` pool per family
  rather than keyed pools, so the pool metric does not transfer cleanly. **I refuse to name
  a point figure.**
- **⇒ 10–14 cars, PLAUSIBLE**, versus ~25 for the whole state remainder.

**⇒ The honest headline: `causalDossierProse` is roughly HALF AGAIN the state-desk arc, and
it is the largest unmeasured surface in the program.** It is also the one whose failure mode
is a false statement about the world rather than a missing sentence, which is why it should
not be scheduled as "the seventh desk".

## 6. THE ORDER — consists, with the registers each moves

**Naming discipline.** Every step below names the **existing** test file it extends. The
known-failure census is FULL at 10/10 with zero headroom and a new test file reds three
censuses, so **no consist below adds a test file.**

### Registers every desk car moves (CONFIRMED membership)

| register | why it moves | verified |
|---|---|---|
| `tests/lint/.dossier-mounts-baseline.json` | holds `{"UNMOUNTED_BLOCKS":{"blocks":64}}`; **shrink-only**, every car lowers it | read at HEAD |
| `scripts/.test-ratchet-baseline.json` | new test titles in an existing file | names `stateProseKernel` (4 hits) |
| `scripts/.observed-shape-readers-baseline.json` | every stateProse module is enrolled | 31 hits |
| `tests/lint/.tuning-inventory.json` | `economyStateProse` is enrolled; a new desk with a cut table joins it | 1 hit |
| `scripts/.writer-reach-baseline.json` | a mounted block changes a field's web-display grade | see below |
| `tests/lint/.lighting-census-baseline.json` | this arc **is** the LIGHTING WAVE | owner directive 09-02 |
| `mutation-coverage-manifest.json` | `scripts/mutation-sweep.sh` names `dossierMounts` | grep hit |

⚠ **THE WRITER-REACH ROW IS ALREADY OUTSTANDING.** At dock HEAD,
`scripts/.writer-reach-baseline.json` still carries
`"situationDesc on economicState": "dossier-pdf=R web-display=N web-transitive=R"` while
DESK CAR 1 has made that identity **reachable** from the web display. The ledger handoff
names this exact row as a §891 landing bill with the door
`node scripts/check-writer-reach.mjs --write` (plain `--write`, a shrink/absorb, **not**
`--genesis`). **Every subsequent desk car moves this same register**, one N→R per newly
reached identity. **I refuse to predict how many rows each leaf moves** — the grade is a
grounding fact derived by `writer-reach-scan.mjs` over the wired tree, and deriving it
without running the scanner would be guessing at a measurement.

### THE CONSISTS, in dependency order

**K1 — THE KERNEL CONSIST** *(1 car · no dependencies · must be first)*
The ~3-line `fillSlots` capitalisation, landed **alone**, per §0c-4's one-consist rule.
Cures **11 real sites** (not 20). Extends `tests/domain/stateProseKernel.test.js` (25,340 B).
Proof owed: byte-identity over all 2,266 variants in the same commit, plus the `{issue}`
after-a-stop case the index-0 rule alone misses. Registers: ratchet, observed-shape.
**Why first:** every later car that mounts a `{good}`/`{reason}`/`{stakes}` block inherits
the degradation until this lands, and the kernel cannot take three serial lane edits.

**C1 — THE `{complexity}` RULING** *(chair act + 1 wiring car)*
§0c-3 is **OPEN, THE CHAIR'S** and the words are reader-facing. The chair rules a closed
vocabulary and a total 11→N map; the car then adds the table to
`economyStateProse.js`'s `SLOT_FILL_TABLES` (which `economyStateProse.js:130` already
anticipates: *"the next desk cannot land a table the shape check has never seen"*).
Extends `tests/domain/economyStateProseDesk.test.js` (21,453 B) and
`tests/data/dossierStateProseProjection.contract.test.js` (37,577 B).
**Predicted figure, derivable and stated:** DS-ECO-1 eligibility rises **C1 1→3 · C2 2→3 ·
C3 2→3 · C4 3→3 · C5 2→3**, i.e. **10 → 15 eligible variants**, a **+50%** restoration on a
surface that ships today. **This is a legitimate same-seed output shift** on every
settlement whose header currently draws a `{complexity}`-free variant, and it must be
declared as a one-time shift, not allowed to ride silently.
**Why second:** it is the only item in the arc that fixes a defect already in front of a
reader, and it is cheap once ruled.

**P1–P3 — THE POWER DESK** *(≈3 cars · 79 pools · depends on K1 only)*
7 blocks, one tab, **zero residue inheritance, zero DIM, zero DM-PEN, zero `{band}` use.**
Mints `powerStateProse.js`. First car extends the walker's shipped-table arms in
`tests/lint/dossierMountRegistry.walker.test.js` (34,392 B); the desk's own arms need a
home — **the cheapest legal option is to extend `economyStateProseDesk.test.js` and rename
nothing**, because a `powerStateProseDesk.test.js` is a NEW FILE and reds three censuses.
**That is a real constraint the chair must rule on**: either the census gains headroom, or
every future desk's tests live in a file named for the economy desk. I raise it; I do not
rule it.
**Why third:** it is the only wholly clean leaf, so it proves the second-desk shape without
paying any residue.

**E1–E3 — THE ECONOMY REMAINDER** *(≈3 cars · 78 pools · depends on K1, C1)*
11 blocks extending an **existing** module and an **existing** test file — the cheapest
pools in the arc. Inherits `{good}`×5 only (cured by K1). One DM-PEN block (DS-ECO-6), which
is where `projectBesideDmField` gets its first real caller.
**Why fourth:** cheapest remaining pools, and it retires the DM-PEN pattern once for the
five DM-PEN blocks that follow.

**B1 — THE `{band}` SPLIT** *(1 wave, or none · depends on nothing; gates S/D/G)*
Rename over **27 SLOTS lines / 16 real seams / 7 blocks**, on the `{timeband_*}` precedent.
Includes a projection regeneration — **a landing act, not a lane's**.
Extends `tests/data/dossierStateProseProjection.contract.test.js`.
**Why here and not first:** it gates only `stressors`, `defense` and `general`, and doing it
after two desks have landed means the split is designed against real wiring rather than
against seams alone.

**S1–S3 — THE STRESSOR DESK** *(≈3 cars · 67 pools · depends on K1, B1)*
3 blocks but the densest pools in the corpus (22.3/block). Mints `stressorStateProse.js`.

**D1–D5 — THE DEFENSE DESK** *(≈5 cars · 126 pools · depends on K1, B1, E1-3 for the DM-PEN pattern)*
11 blocks, two DM-PEN. Mints `defenseStateProse.js`.

**W1–W5 — THE WAR/FAITH DESK** *(≈5 cars · 138 pools · depends on K1)*
9 blocks, no residue. ⛔ **DS-FTH-2 is a paid-surface block** (*"Faith teaser (free / anon;
names no deity)"*) — **owner-gated**, and it should be split out of its car rather than
riding one. ⚠ DS-WAR-4 is PDF-path and may be unmountable (§2).

**G1–G7 — THE GENERAL DESK** *(≈7 cars · 193 pools · depends on everything above)*
The largest and worst-shaped: all three DIM blocks, five DM-PEN, four `{band}` blocks, six
tabs. **DS-GEN-3 (42 pools / 128 variants) is a car by itself.** ⚠ DS-GEN-10 is PDF-path.
**Why last:** it is the only leaf that inherits every hazard, and every pattern it needs
(DIM declaration, DM-PEN projection, `{band}` post-split, multi-tab mounts) is proven by an
earlier consist.

### The arithmetic

| consist | cars | basis |
|---|---|---|
| K1 kernel | 1 | measured cure size (~3 lines, 11 sites) |
| C1 complexity | 1 (+ a chair ruling) | one fill table |
| Power | ~3 | 79 dark pools ÷ 27 |
| Economy remainder | ~3 | 78 ÷ 27 |
| B1 `{band}` | 1 | one wave or none |
| Stressors | ~3 | 67 ÷ 27 |
| Defense | ~5 | 126 ÷ 27 |
| War/Faith | ~5 | 138 ÷ 27 |
| General | ~7 | 193 ÷ 27 |
| **STATE-DESK TOTAL** | **≈29** | **PLAUSIBLE (n=1 datum)** |
| Causal register | 10–14 | §5.2, PLAUSIBLE and weaker |
| **ARC TOTAL** | **≈39–43** | **PLAUSIBLE** |

**I refuse to give a point estimate.** The extrapolation rests on one landed car, and
DESK CAR 1 was the easiest four blocks in the corpus — no DIM, no DM-PEN, no `{band}`, one
tab, and a module that did not yet have to share a test file.

## 7. THE BIGGEST RISK — AND IT IS NOT THE CAR COUNT

**Only ONE of the six corpus leaves is reachable from any `src/` module today.** Grep over
`src/` for importers of `src/data/dossierStateProse/` returns exactly one real import:
`economyStateProse.js` → `economy.generated.js`. (`economyFreshness.js` matches only in a
doc comment.)

**⇒ 761,458 B of authored content is on disk and in no build:**
- five dark state leaves: **551,198 B**
- the causal corpus: **210,260 B**

Every desk car moves its leaf's bytes **into the build**. The mitigating fact, CONFIRMED:
dossier tabs are lazily loaded — `OutputContainer.jsx:69-72` imports all 24 tabs from
`./dossier/dossierLazyTabs.js`, described in-file as *"Lazy-loaded tabs (each loads only when
first viewed) … same per-tab dynamic imports"*. So a leaf imported **only** by its tab's desk
lands in that tab's lazy chunk, not in first-paint closure.

**The risk is that this stops being true, silently, and the margins have no room for it.**
Carried from the HORIZON-DARK carlist §5 (measured at T13's `594c7521f` — **not re-measured
by me, and I did not run a build**): engine chunk **675,339 / 676,000 = 661 B**; first-paint
closure RAW **1,047,496 / 1,048,000 = 504 B**. I confirmed both ceilings exist in the tree:
`tests/build/vendorPdfLazy.test.js:565` `CLOSURE_BUDGET_BYTES = 1_048_000` and
`:768` `expect(size).toBeLessThan(676_000)`.

**A single eager importer of any desk module puts 60–180 KB into a closure with ~504 B of
headroom.** The paths where that happens by accident:
- a **PDF** consumer (DS-GEN-10, DS-WAR-4) — `src/pdf` is reached differently from tabs;
- `SummaryTab`/`ReadSystemStateBar`, which already import `economyFreshness`;
- any shared view-model or `src/domain/display` sibling that a desk is "helpfully" moved
  into.

**THE STRUCTURAL PREVENTION I RECOMMEND (a design, not an act):** every desk car adds one
arm asserting its leaf is **absent** from the first-paint source graph. The machinery already
exists and needs no new file — `tests/build/cultureProfilesLazy.test.js:76`
`firstPaintSourceGraph()` walks `src/main.jsx`'s static closure and already carries the
right shape, including an **EAGER_ANCHOR** assertion so a broken walk cannot pass vacuously.
Extend that existing file, or add the arm to
`tests/lint/dossierMountRegistry.walker.test.js` beside the reachability arm — **no new test
file, so no census cost.**

### Risks in order

1. **BYTES.** 761 KB of corpus entering a build with 504 B / 661 B of margin. Mitigated by
   lazy tabs; unmitigated by any test that would catch a regression. **Highest.**
2. **THE TEST-FILE CEILING.** Five new desk modules want five new test files; the census is
   FULL at 10/10 and a new test file reds three censuses. Every desk after `power` either
   crowds into `economyStateProseDesk.test.js` — a file named for a different desk — or the
   census gains headroom. **This is a chair decision that blocks car 2 of the arc**, and it
   is not currently written down anywhere I found.
3. **`{complexity}` shipping today.** One sentence for every high-rung working-approach
   settlement, live, on a lit surface.
4. **The causal register's truth risk.** 57 two-armed families with no evidence deriver; a
   wrong arm prints the neighbour's history as this town's.
5. **PDF-path unmountability.** DS-GEN-10 and DS-WAR-4 cannot satisfy the reachability arm.
