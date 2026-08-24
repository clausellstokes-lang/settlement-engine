# TE-DW-PREP — DISPATCH BRIEF FOR DW-1

**Lane TE-DW-PREP (read-only prep). Chair: Fable 5.**
**Slot measured: `claude/composite-r4` = `c3289244d58b7259205d80594856e8e0cc520817` (60 cars, packets 179).**
**Charter under reconciliation: `review-fixes-2026-07-08:docs/DW0-CHARTER-COMPILED.md`, 129,030 B / 1,102 lines.**
**Zero repo writes. No vitest, no `npm run check*`, no worktree, no packet, no commit.**

> ### THE FRAME
> The charter declares its own base as **`79b78881ca86612ec312602c2e3dc6d06aa34df8` (54 landings)**.
> `git rev-list --count 79b78881c..c3289244d` = **32 commits**. Both `79b78881c` and `510c51b76`
> are ancestors of the slot (`--is-ancestor`, status not string). **Six of those 32 commits are
> cars the charter files as OUTSTANDING.** Every figure below was re-derived at `c3289244d`;
> where mine differs from the charter's I say so, **in both directions**.

---

## §1 · THE 53 — HOW THEY LAND, AND WHICH CARS OWN THEM

### 1.1 The arithmetic, independently reproduced (denominators named)

I recomputed the fixture gate's whole tally from its own TSVs rather than inheriting it.

| Figure | Value | Denominator |
|---|---|---|
| adjudication ROWS | **481** | the NONE set (keys matching no member at exact / head-noun / any-word level) |
| — (a) genuine miss, ROWS | **43** | of 481 |
| — (b) belongs elsewhere, ROWS | **147** | of 481 |
| — (c) fairly consolidated, ROWS | **277** | of 481 |
| — (n) parse noise, ROWS | **14** | of 481 |
| **(a) genuine miss, MEMBERS** | **53** | 43 A rows **+ 10 family heads that are not rows at all** |
| `FINAL-A.txt` | **53** | graphic lines (`grep -c .`); `wc -l` reports 52 — no terminal newline, confirmed this lane |
| **THE UNION** | **135** | 22 landed `FURNISHING_KINDS` + **113** add-list members (was 60) |

`43 + 147 + 277 + 14 = 481` ✓ · `43 + 10 = 53` ✓ · `53 = FINAL-A.txt` ✓ · `22 + 113 = 135` ✓
**Every figure in the fixture gate's receipt is CONFIRMED by independent recomputation. 135 stands.**

The ten head-only members — the ones that are members without being rows, because no tranche ever
writes them as a bare token: **basin · bath · die/stamp · furnace · hanging · hoist · mill · mould ·
scales · vessel**.

### 1.2 Where the 53 land in the charter's structure

**One owning car: `DW-1b`.** The charter is unambiguous — §H G8 absorbs the fixture gap into
"DW-1b (fixtures 22 → 82)", and §I C-25 rules the re-derivation "a named pre-DW-1b gate, and its
EXECUTION belongs to DW-1b's dispatch". All 53 are `FIXTURE_KINDS` members and DW-1b mints every one.

**Four charter sites carry the number and must move together** (a partial edit leaves two truths):

| # | Site | Reads today | Must read |
|---|---|---|---|
| 1 | §D taxonomy table, FIXTURE KINDS row | `**82**, ⚠ pending one open item` · `22 + 60` | `135` · `22 + 113` |
| 2 | §G DW-1 EXIT | `48 partis · 83 cells · **82 fixtures** · 9 circulation classes` | `… · 135 fixtures · …` |
| 3 | §H G8 disposition | `DW-1b (fixtures 22 → 82)` | `DW-1b (fixtures 22 → 135)` |
| 4 | §I C-25 | `treat 82 as PROVISIONAL until it runs` | **the gate HAS run — discharge the provisional flag** |

§I C-14 ("82. The 81 is the pre-amendment figure") and §I C-17 ("do NOT add `ring table` alone and
restate 22 + 61 = 83") both stand as correct history and are now superseded by the gate's result.
C-17's refusal was vindicated: `ring table` folds into `table`+shape under the granularity rule and
never was a member of its own.

### 1.3 The 53 by seam obligation — which OTHER cars owe an arm

These are **overlapping lenses over one set of 53**, not a partition. Distinct union = **23 of 53**;
the remaining **30** are clean single-vocabulary adds that create no obligation outside DW-1b.

| Lens | N | Members | The car that owes something, and what |
|---|---|---|---|
| **L1 · heads that need an ATTRIBUTE DOMAIN** | **10** | basin · bath · die/stamp · furnace · hanging · hoist · mill · mould · scales · vessel | ⛔ **DW-1b — and the charter does not budget it.** See §1.4. |
| **L2 · joint-closure family** | **6** | barred grille · drawbar · drawbridge · hatch · iron sheeted door · portcullis | **DW-1d** owes an agreement arm that a fixture-closure and a joint attribute do not both encode one closure. `hatch` is the sharp one: `cell.approach: HATCH_ONLY` already exists in §D as a DW-1a/1d concept. |
| **L3 · a paired CELL kind G8 also asks for** | **5** (4 new) | furnace · bread ovens · sawpit · garderobe · immersion pool | **DW-1a** owes the B11 ownership declaration. G8's own missing-cell list names "a **furnace room**" while the 53 supply `furnace` the fixture — two vocabularies, one name, and B11's rule says the charter states which OWNS it. Same for `bread ovens` vs landed `ROOM_KINDS.kiln`, and `sawpit` vs the `pit` the adjudication routes to a zone. |
| **L4 · the DW-5d unblocker** | **1** | furnace | **DW-5d** — see §2. |
| **L5 · B11's only new collision** | **1** | cistern | **DW-1e** — already a CELL × STORAGE collision in the known 20; becomes **three-way**. |
| **L6 · storage seam** | **2** | chest · key board | **DW-1e** — lockable-store fixtures against `StorageCell` and the six polarities. |
| **clean adds, no seam** | **30** | the remainder | DW-1b only. |

### 1.4 ⛔ THE ONE STRUCTURAL CONSEQUENCE THE CHARTER CANNOT ABSORB AS WRITTEN

The revised granularity rule is `table`+shape, `vessel`+kind, `furnace`+`flued`. **Every one of those
is a member PLUS AN ATTRIBUTE. The charter has no fixture-attribute mechanism anywhere.**

Measured: §D lists five *joint* attributes (`severable`, `schedule`, `refused`, `mandatoryOpen`,
`OBJECT_ONLY`) and `cell.approach`. It lists **zero** fixture attributes. The only fixture attribute
in the whole charter is DW-3a's wear **grade**, and that is a different car in a later wave.

The architecture confirms the shape: DW-1b creates `fixtureVocabulary.js` and its acceptance arm 1 is
*"frozen+unique"* — **an array of strings**. An array of strings cannot carry `flued: bool`.

**Consequence, stated plainly:** the ten L1 heads cannot land as bare members. Without a declared
attribute domain per head, nothing records that `vessel` was supposed to absorb `aludel`, `blowpipe`,
`crucible`, `cucurbit`, `drug jar`, `pots`, `pots set` and `receiver` — so a later author re-adds
`crucible` as its own member and the consolidation silently unwinds. **The consolidation is
unenforceable unless DW-1b's deliverable shape changes from `string[]` to a record map.**

That is a contract change, not an addition, and it is the largest single consequence of the 53.
**It is the chair's call, and I have not taken it.** The two branches:

- **(A) Record map now.** `FIXTURE_KINDS` becomes `{ kind, attrs: {...} }`. DW-1b gains a totality
  arm (every head declares its domain) and a consolidation arm (every folded spelling maps to its
  head). Cost: DW-1b's arm count rises from 4, and its census delta with it (§4.4).
- **(B) Land 53 bare members now, attributes in DW-3a.** Cheaper at DW-1b; leaves the ten heads
  meaningless for one wave, and DW-5d's arm 4 stays held for two more waves rather than one.

I recommend **(A)**, because (B) ships ten members that name nothing a reader can distinguish, and
the charter's own §G rule is that a criterion must name what it counts.

---

## §2 · THE `portableFurnaces` ARM — THE REWRITE'S SHAPE, AND WHERE THE RULING BREAKS

### 2.1 The engine facts, re-measured at the slot

Walked all **2,185** tracked files under `src/` at `c3289244d` with **node**, word-anchored — not
`git grep -E`, which does not honour `\b`, and not `grep`, which is ugrep here and prints a
complexity error rather than zero on a bounded-repetition pattern.

| Symbol | Occurrences | Files | Denominator |
|---|---|---|---|
| `portableFurnace(s)` | **0** | 0 | 2,185 src files |
| `flueCount` | **0** | 0 | 2,185 src files |
| `\bflues?\b` | **0** | 0 | 2,185 src files |
| `\bfurnaces?\b` | **7** | 3 | 2,185 src files — `institutionDescVariants.js`, `institutionalCatalog.js`, `institutionVocabulary.js`, **all prose** |

**The lane's independent measurement CONFIRMS the fixture gate's and the brief's: the arm names three
quantities and the engine types none of them.**

### 2.2 ⛔ THE RULING AS GIVEN DOES NOT EXECUTE — reported, not routed around

Ruled: *mint `furnace` as a fixture kind carrying `flued: bool` and rewrite the arm as
`count(furnace where flued) ≤ flueCount`.* Taking it apart term by term:

```
count( furnace where flued )  ≤  flueCount
       ^^^^^^^      ^^^^^        ^^^^^^^^^
       (1) SUPPLIED (2) NEEDS    (3) ⛔ STILL UNDEFINED —
       by the 53    a fixture-   nothing in the 53 supplies it,
       ✓            attribute    and nothing in src types it
                    map (§1.4)
```

1. **`furnace` — discharged.** It is member #21 of the 53 and DW-1b mints it. ✓
2. **`flued` — half-discharged.** It requires the record-map contract change of §1.4, which is not
   chartered. Executable under branch (A), not under (B).
3. **`flueCount` — NOT discharged. The rewrite replaces one undefined symbol with a different
   undefined symbol.** `flue` is not among the 53; `\bflues?\b` is 0 of 2,185 src files. **The arm as
   rewritten is exactly as unexecutable as the arm it replaces.**

**Where `flueCount` would have to come from, and why that is the real blocker.** A flue count is a
property of the **envelope** — chimneys and stacks on a building. The fixture gate's own (b) set puts
`chimney row` in the **ENVELOPE** class, and the envelope is a surface **no charter vocabulary owns
at all** (§5.2, 73 tokens). So `flueCount` is blocked on the same gap.

### 2.3 The shape I recommend — offered, not taken

**Split the arm into the part DW-1 can prove and the part the envelope owes.**

**Arm 4a — the VOCABULARY assertion. Executable at DW-1b under branch (A), no envelope dependency:**

```
(i)  TOTALITY : ∀ f ∈ fixtures where f.kind === 'furnace' :  f.attrs.flued ∈ {true, false}
(ii) EXISTENCE: count(f where f.kind === 'furnace' && f.attrs.flued === false) > 0  over the corpus
```

Clause (ii) is what actually encodes the finding. Boerhaave's room *"only had one chimney, whereas he
wanted to perform various chemical experiments simultaneously"* — **the portable furnace exists
precisely to defeat the flue constraint**, and R-INST-5 calls it "the one measured fixture in the
family". An arm that asserts unflued furnaces EXIST convicts the same error `furnaces ≤ flues` would
have caused, from the other side, and it convicts nothing that is true.

**Convicting mutant (a control that cannot fail proves nothing):** set every `flued` to `true` and
(ii) reds. Set one to a non-boolean and (i) reds. Both mutants are cheap and both are real.

**Arm 4b — the GEOMETRIC inequality. Deferred with a NAMED home, not HELD with none:**

```
count(furnace where flued) ≤ envelope.flueCount
```

goes to **DW-2b** (the vertical partition — the car that already owns storeys and the envelope
accounting), blocked on the envelope gaining a flue count.

**Why this is better than the status quo.** DW-5d currently ships four arms with arm 4 HELD and its
blocker stated as *"the vocabulary does not contain `portable furnace`"*. Under the recommendation
DW-5d ships **five** arms, arm 4a live with a convicting mutant, and the one genuinely blocked half
carries a named owner and a named precondition instead of an open hold. **That is a strictly smaller
blocker than the one the charter records, and it is the reason to say the ruling breaks rather than
absorb it.**

---

## §3 · §F.0 REFRESHED AT `c3289244d` — WHICH ROWS MOVED

### 3.1 The table, re-measured row by row

Ancestry tested per-sha with `--is-ancestor` (a status, which cannot echo a false positive the way a
bare `git rev-parse` can). Sizes with `git cat-file -s` on a **braced** `${SHA}:path`.

| Car | Charter row at `79b78881c` | Measured at `c3289244d` | Verdict |
|---|---|---|---|
| **CG-1** | LANDED `d78011665` | ancestor ✓ | **HOLDS** |
| **CG-1b** | LANDED `3e9d2d888` | ancestor ✓ | **HOLDS** |
| **CH-1** | LANDED `b2852ccc3`, narrower than the draft said | ancestor ✓ · `\binteriorKind\b` = **0 of 2,185 src files** | **HOLDS** — C-24's correction survives re-measurement |
| **CH-2A** | LANDED `17fe89763` | ancestor ✓ | **HOLDS** |
| **UC-5** | LANDED `f4df874ce`, `connectivity.js` = 28,261 B | ancestor ✓ · **28,261 B** exact | **HOLDS** |
| **MP-1** | LANDED `9e5059cec`, `cartographyProperty.js` = 9,141 B | ancestor ✓ · **9,141 B** exact | **HOLDS** |
| **CH-2** | HALF — CH-2B at DRAFT | `MF-CH2B` present in the manifest, not LANDED | **HOLDS** |
| **CH-4** | OUTSTANDING | `CATEGORY_PATTERNS` unchanged at `districtProfile.js:105-117`; criminal's `/den/` still tests before residential | **HOLDS** |
| **CH-6** | OUTSTANDING | `ARCANE_INST_KW` still carries `'healer (divine'`, `'divine healer'`, `'warden'`, `'great library'` — the deity-doctrine violation is live | **HOLDS** |
| ⛔ **CG-2** | **OUTSTANDING** — *"`MF-CG2` has no landing at any ref"* | **DECAYED.** `MF-CG2` exists (DRAFT) and **four TE-CG-2 code commits are ancestors**; `TC4_ROW_BYTES_BAND` is no longer the authored `400` but `DERIVED_CAPS.rowBytes` (`cartographyTuning.js:495`); `cartographyBuildings.js` +224 lines | ⛔ **MOVED** |
| ⛔ **CH-3** | **OUTSTANDING** — "in flight" | **DECAYED.** **Fourteen CH-3 commits are ancestors.** `minTier` declarations in `institutionalCatalog.js`: **36 → 10 = exactly −26** | ⛔ **MOVED — the §3.1 prediction EXECUTED** |
| ⛔ **CH-5** | **OUTSTANDING** — "chair §541: ships Shape F" | **DECAYED.** `MF-CH5` = **LANDED**. `ARCANE_INST_TAGS = ['arcane', 'planar', 'enchanting']` — **`alchemy` is gone**, moved to a sibling `TRADE_INST_TAGS` imported by `institutionalCatalog.js`, `arcaneInstitutionVocabulary.js`, `npcProfile.js` | ⛔ **MOVED — LANDED. §H's G3 is DISCHARGED at the slot.** |

### 3.2 ⛔ The decayed "Today:" integer — and it decayed in a direction nobody predicted

**§B's headline row is wrong in both its mechanism and its magnitude.**

The charter: *"`exclusiveGroup: 'religiousCenter'` deleted from the two **city** rows | re-rolls the
whole city/metropolis institutional roster — **81 of 420 settlements change, ~130 institution names
move**"*, and builds the entire PROVISIONAL-ON-CH3 clause on it.

Measured at the slot, and in CH-3's own landed commit body (`501122493`):

| | Charter (predicted) | Landed (measured) |
|---|---|---|
| mechanism | delete `exclusiveGroup` from two city rows | ⛔ **NOT deleted.** `religiousCenter` is still **7 occurrences** in the catalog, unchanged from `79b78881c`. A forked-stream `exclusiveGroupCoexists: true` flag was used instead, drawn from `rng.fork('exclusiveCoexist::…')` so the main sequence does not shift |
| settlements changed | **81 of 420** | ⛔ **30 of 420** |
| institution names moved | **~130** | ⛔ **123 distinct new name strings** |
| records | — | 87 (was 113 under the deletion form) |

The chair revised J-CH-3-2 on the measurement: the 81-roster reshuffle was *"an ARTIFACT of where the
exclusivity check sits"*, and the deletion also freed `coherenceRepairPass`'s refusal, dragging a
TOWN-tier `Monastery or friary` into 21 cities and 5 metropolises — a content change nobody asked for.

**This is the decay class §A was written for, in its third form.** §A names two directions — an
absence since filled (UC-5) and a presence that never arrived (CH-1). This is a third: **a prediction
that landed by a different mechanism at a different magnitude.** The number did not vanish and did not
fail to arrive; it was superseded by a better ruling. Nothing signalled it either.

### 3.3 Consequential rows that move with the above

- **§B's PROVISIONAL-ON-CH3 clause — its premise is gone.** CH-3 has landed. Every item on its
  "exhaustive list" (DW-R2's row count and denominator, the per-shelf B2 split, the DW-S soak corpus,
  DW-1's consumption of CH-1/CH-2) is now **measurable at the slot rather than provisional**. The
  clause should be re-headed *PROVISIONAL-ON-CH6* and re-scoped, not deleted — CH-4 and CH-6 remain.
- **§F.2 "What a build lane actually dispatches: 46 commits"** — CG-2's code has landed; only its
  packet flip remains. If the chair rules CG-2 done, **45**.
- **§F.4's line `CH-3 · CH-5 · CH-6 · WEB-8b`** → **`CH-6 · WEB-8b`**.
- **§F.0's own instrument note** still holds: `git merge-base 029268fe5 c3289244d` — the research
  bundle remains an orphan and remains ground truth for RESEARCH, never for ENGINE STATE.
- ⚠ **`LANE-LAW.md` itself is stale** and lanes read it: its census tuple says
  `titles 21017 / suiteTitles 5847`; measured at the slot the live row is
  **`files: 2525, parked: 366, credited: 2159, titles: 21026, suiteTitles: 5848`**
  (`sovereigntyLightingContract.walker.test.js:6499`). Files, parked and credited are unchanged —
  the +9 titles / +1 suiteTitle landed in existing files, which is why no census file count moved.

### 3.4 Rows that did NOT decay — reported because a review that only finds defects is advocating

Every one re-measured at `c3289244d`, not inherited:

`ROOM_KINDS` = **28** at `interiorTemplates.js:35`, containing **both `stall` and `dais`** ✓ ·
`FURNISHING_KINDS` = **22** at `:50` ✓ · `INTERIOR_KINDS` = **8** at `:29` ✓ ·
`interiorKindOf` at `:172` ✓ · `interiorTemplates.js` = **10,471 B** ✓ ·
`compendiumData.generated.js:409` `roomKinds` = 28 incl. both ✓ ·
`CatalogHubs.jsx:66` renders `Room kinds: ${facets.roomKinds.length}` ✓ ·
`testRatchet.test.js:181` `CEILING = 17` with **11** banked entries ✓ (4 of them in
`tests/copy/voiceMechanics.test.js`) · `VIEWING_PAYWALLS_PENDING_514` length **3** at
`entitlementLadder.js:135-139` ✓ · `JOINT_KINDS` = **5** (`grate · stair · sealed_door · sluice ·
breach`) ✓ · `constants.js` = 4,725 B ✓.

⚠ **But three path citations in the charter are wrong and will hand a lane a false absence.** The
charter writes `interiorTemplates.js:35`, `interiorModel.js:79-87` and `interiorEdits.js` with no
directory. The real paths at the slot are **`src/domain/interior/…`**, not `src/domain/…`. A lane
grepping the charter's literal path gets zero hits and reads it as decay. This is the same instrument
class §A exists to guard.

---

## §4 · DW-1 — THE DISPATCH BRIEF

### 4.1 Cars, order, and dependencies

**6 cars, INERT** (they land frozen arrays and a membership walker; no producer reads the new members).

```
[PRE-DW-1] B11 cross-vocabulary uniqueness check     — RESIZED, see §5
[PRE-DW-1b] C-25 fixture re-derivation gate          — ⭐ RUN AND DISCHARGED (union 135)
[PRE-DW-1d/1e] C-19 sub-form recount                 — ⛔ NEVER RUN, see §4.5

DW-1a  ──►  DW-1b            SERIALIZE (charter D6: both touch interiorTemplates.js)
DW-1c, DW-1d, DW-1e  ──►  DW-1f      (charter §F.4)
```

⚠ **Charter/architecture divergence on DW-1f.** Architecture `:1568` puts `DW-1c, DW-1d, DW-1e, DW-1f`
all in parallel ("no shared file"); charter §F.4 serializes DW-1f after the other three. **The charter
is the ruled layer and governs** — but the divergence is unrecorded in §I's conflict list and should
be, or a lane reading the architecture dispatches four in parallel.

**Dependencies at the slot:** DW-1a's architecture row requires *"CH-1 LANDED and CG-1, CG-2 LANDED"*.
Measured: CH-1 ✓, CG-1 ✓, CG-2's **code** ✓ (packet at DRAFT). **DW-1a's stated preconditions are met
except for CG-2's packet flip.**

### 4.2 File set

| Car | changeManifest | New test file |
|---|---|---|
| **DW-1a** | `CREATE src/domain/dwellings/vocabulary/cellVocabulary.js` (+120 eff) · `MODIFY src/domain/interior/interiorTemplates.js` — `ROOM_KINDS` re-points at `CELL_KINDS`, retire **both** `'stall'` and `'dais'`, `FURNISHING_KINDS.dais` STAYS · **+ `INTERIOR_KINDS` folds in here (charter C-22 ruling)** · **+ the regenerated `src/domain/compendium/generated/compendiumData.generated.js` and `npm run gen:compendium-data`** | `tests/domain/dwellingsCellVocabulary.test.js` |
| **DW-1b** | `CREATE …/vocabulary/fixtureVocabulary.js` (+120 eff) · `MODIFY interiorTemplates.js` (`FURNISHING_KINDS`) · **+ the regenerated compendium artifact** | `tests/domain/dwellingsFixtureVocabulary.test.js` |
| **DW-1c** | `CREATE …/vocabulary/partiCatalog.js` (+160 eff) | `tests/domain/dwellingsPartiCatalog.test.js` |
| **DW-1d** | `CREATE …/vocabulary/circulationVocabulary.js` (+190 eff) · **+ `SURFACE_JOINT_KINDS` (charter C-20 ruling)** | its test |
| **DW-1e** | `CREATE …/vocabulary/storageVocabulary.js` (+180 eff) | its test |
| **DW-1f** | `CREATE …/vocabulary/relations.js` (+100 eff) | its test |

⚠ **DW-1b's `+6 eff` budget on `interiorTemplates.js` was sized for 60 added members. At 113 it is
wrong**; the array roughly doubles. The estimate should be re-cut, not inherited.

### 4.3 Exit criteria — integers and differentials only

| # | Criterion | Value | Status |
|---|---|---|---|
| E1 | `CELL_KINDS` count, **all three intermediates** | `28 − 2 + 57 = **83**` | **FIRM** |
| E2 | `FIXTURE_KINDS` count | ⛔ **135** = `22 + 113` (was 82) | **PROVISIONAL — chair ratification** |
| E3 | `PARTIS` count | **48** | **FIRM** |
| E4 | circulation **classes** | **9** | **FIRM** |
| E5 | circulation **sub-forms** | ⛔ **no integer exists** ("~55") | **PROVISIONAL — gate never run** |
| E6 | storage **sub-forms** | ⛔ **no integer exists** ("~35") | **PROVISIONAL — gate never run** |
| E7 | storage polarities / prohibitions | **6 / 3** | **FIRM** |
| E8 | `RELATION_KINDS` | exactly `owns\|occupies\|hostedIn\|NO_BUILDING` (4) | **PROVISIONAL — owner-gated O2/R1** |
| E9 | `NO_BUILDING_REASONS` | **6** members | **FIRM** |
| E10 | producers of `room('stall'` / `room('dais'` under `src/` | **0** | **FIRM** — already 0 at the slot |
| E11 | `FURNISHING_KINDS.dais` survives | present, 2 live producers | **FIRM** |
| E12 | regenerated `roomKinds` | **83**, containing **neither** `stall` nor `dais` | **FIRM** |
| E13 | public Compendium card | `Room kinds: 28` → `Room kinds: 83` | **FIRM — declared shift** |
| E14 | banked-failure ratchet | unchanged at **11** of `CEILING = 17` | **FIRM** |
| E15 | census delta, attributed **per test file** | `1a +6 · 1b +4 · 1c +5 · 1d +5 · 1e +5 · 1f +5 = **30**` | ⛔ **DW-1b's +4 is now WRONG — see §4.4** |

**The differential that matters most (E12/E13):** the charter is right and the architecture is wrong.
The architecture says DW-1a and DW-1b carry **"DECLARED SHIFT: NONE"**. Measured at the slot,
`scripts/generate-compendium-data.mjs:59` imports `INTERIOR_KINDS, ROOM_KINDS, FURNISHING_KINDS` and
`:603` emits `roomKinds: [...ROOM_KINDS]`, and `tests/docs/compendiumDataFreshness.test.js` asserts
the committed artifact is **byte-identical to a fresh generation**. **DW-1a and DW-1b move a shipped
public count and a shipped public enumerable.** The wave declares the shift; the architecture's
"NONE" must not be inherited.

### 4.4 ⛔ DW-1b's census budget no longer closes

The charter ruled the architecture's `6/4/5/5/5/5 = 30`, *"where each figure equals that car's
declared acceptance-arm count"*. DW-1b's four arms are: frozen+unique · every template `furnish`
member is a `FIXTURE_KINDS` member · `RECESS_STATES` is exactly `OPEN|BLOCKED` · the count is 82.

Under the union, DW-1b needs at minimum **three more**: the count arm moves 82 → 135, plus an
attribute-**totality** arm and a **consolidation** arm (§1.4), plus arm 4a of the furnace rewrite (§2.3).
**DW-1b is a 7-arm car, not a 4-arm car, and its census delta is +7, not +4.** Wave total **30 → 33**.

Three further mechanical bills, each banked and each invisible to the arm count:
- **A new test file reds THREE ratchets**, not two — the two censuses plus `mutationCoverageManifest`'s
  E-A TOTALITY arm. DW-1 creates **six** new test files.
- **A template-literal `it()` title inflates the census by its PARTS.** With 113 fixture members the
  temptation to write `it(\`\${kind} is frozen\`)` is high and the delta will not close.
- **`test.each()` / loop-registered titles are INVISIBLE to the census** — check `credited`, not
  `titles`, or a real addition reads as zero.

### 4.5 ⛔ Which figures are PROVISIONAL — and the answer is not the one the dispatch assumed

The dispatch's premise is that DW cannot build because *"CH-6 changes what worlds contain, so any
catalog-derived figure taken now would decay."* **I tested that and it does not hold for DW-1.**

**Measured, decisively:**

| Test | Result |
|---|---|
| Did the generated compendium artifact move across the 32-commit gap in which **CH-3, CH-5 and CG-2 all landed**? | ⛔ **NO.** Blob `3b1bf2c254abd4cb33db47e97e64e2ee8ae85d7c`, **98,359 B**, byte-identical at `79b78881c` and at `c3289244d`. |
| Does CH-6's chartered file (`arcaneInstitutionVocabulary.js`, holding `ARCANE_INST_KW`) feed the generator? | **NO — 0 imports.** |
| Did CH-5 change the catalog's tier/category/**name** key set — the only catalog surface the generator reads? | **NO — 0 name-key differences.** |

**Therefore: DW-1's five vocabulary counts are properties of frozen arrays derived from a frozen
research corpus at `029268fe5`, which cannot move. None of them is catalog-derived. CH-6 as chartered
cannot move any figure DW-1 states.** DW-1 is dispatchable ahead of CH-6 **on measurement**.

I flagged the opposite risk first — that CH-6 and DW-1a/1b would collide on the same byte-pinned
generated artifact — and the measurement **refuted it**. Recording the refutation because an
unrefuted speculation is worth less than a tested one.

**The ordering rule still stands as POLICY.** The chair ruled for the pickup card at C-13 ("all CH
cars land before DW's BUILD waves"). Nothing here asks to overturn that. **What it does say is that
for DW-1 specifically the rule is a programme choice, not a technical constraint** — and the car that
genuinely is catalog-gated is **DW-R2**, whose row set is keyed to "every catalog row that can fire at
a tier". The ordering rule earns its keep at DW-R, not at DW-1.

**The DW-1 figures that ARE provisional, with the real dependency named:**

| Figure | Provisional on | Not on |
|---|---|---|
| **E2 — 135 fixtures** | the chair ratifying the gate's result into the charter's four sites (§1.2). Until then a lane reading the charter builds **82**. | CH-6 |
| **E5 / E6 — circulation and storage sub-forms** | ⛔ **C-19's mechanical recount, which has never been run.** The charter RULED it ("recount `~55` and `~35` mechanically and pin both as integers with mutants") and no lane has. **These two integers do not exist.** DW-1d and DW-1e cannot state an exit criterion. | CH-6 |
| **E8 / DW-1f's contract and its +5** | ⛔ **owner-gated O2/R1** — §C.7 orders `occupies`' sizing re-read and the charter itself marks the budget "provisional on R1". | CH-6 |
| **E15 — the wave census delta** | §4.4's re-count, and the L1 attribute ruling of §1.4. | CH-6 |
| everything else (E1, E3, E4, E7, E9–E14) | **nothing — FIRM at the slot.** | — |

**⭐ The single most useful thing this brief can hand the chair: C-19's sub-form recount is the exact
sibling of the fixture gate that just ran, it is ruled, it is unrun, and it blocks two of DW-1's six
cars.** It should be the next prep lane, and it is cheap — the same extraction method the fixture gate
already proved, pointed at §2.4 and §2.5 instead of §2.3.

---

## §5 · B11 RESIZED — AND IT IS A DIFFERENT SHAPE, NOT JUST A BIGGER NUMBER

### 5.1 What B11 is chartered as

A cross-vocabulary uniqueness check across **five** vocabularies — {PARTIS, CELL_KINDS, CIRCULATION
sub-forms, STORAGE sub-forms, FIXTURE_KINDS} — with **20** measured name collisions (15 CELL × STORAGE,
5 CELL × CIRCULATION), each assigned an owning vocabulary. It gates **all of DW-1**.

### 5.2 ⛔ My measurement disagrees with the dispatch's framing — the 147 are not one class

The dispatch states the gate found *"147 tokens belonging to OTHER vocabularies (`CELL_KINDS`, STORAGE,
CIRCULATION, declared `RECESS`/`SUBDIVISION`)"*. **Adjudicated by class, only 55 of the 147 fit that
description.** Denominator: the 147 (b) rows of the 481-key NONE set.

| Class | N | What it actually is |
|---|---|---|
| **BR** | **39** | belongs to another **existing** DW vocabulary — room, yard/zone, circulation, storage bay, water zone. ✓ the dispatch's description |
| **BX** | **16** | declared **RECESS / SUBDIVISION** third terms. ✓ the dispatch's description |
| ⛔ **BE** | **73** | **ENVELOPE** — floors, windows, walls, vaults, ceilings, stairs, chimney rows, earthworks, buried services. **No charter vocabulary owns this surface.** |
| **BS** | **19** | not a fitting in **any** vocabulary — commodities (`wool`, `hemp`, `manure`), activities (`processions`), states (`siege`), movables (`sledge`, `post bag`), a payment, a rule, a prohibition. |

`39 + 16 + 73 + 19 = 147` ✓. **The "other vocabularies" class is 55, not 147 — the framing over-counts
it by 92.** And the 92 split into the two most interesting findings in the set.

### 5.3 The three corrections that change what the gate must DO

**(i) 16 of the 147 are already owned — B11 is cheaper here than stated.** The architecture titles
DW-1b *"fixtures, `RECESS`, `SUBDIVISION`"* and its acceptance arm 3 is *"`RECESS_STATES` is exactly
`OPEN|BLOCKED`"*. **The RECESS/SUBDIVISION vocabularies already have a chartered car.** B11's *name set*
omits them; its *owner* does not. The gate must cross them; nobody needs to mint them.

**(ii) 73 of the 147 name a surface the DW program has no vocabulary for — B11 is more expensive here
than stated, and this is the larger finding.** The ENVELOPE is touched by three signed bands (B5 walls
→ separation → duplication, B7 storey heights, B12 party walls) and by DW-2b's whole geometry, but
**no vocabulary owns floors, apertures, roofs or wall finishes**. Two independent confirmations that
this is a real gap and not an extraction artefact:
- **R10 is UNCARRIED.** §H.2 records `apertureUse: LIGHT|VENT|PROCESS_LOOP` and `lightDemand` as
  0/0 in both frozen sources, routed to DW-1a "whose row is cell kinds", and marked **"Owed."**
  The 73 BE rows are largely the aperture surface R10 asked for.
- **`flueCount` (§2.2) is an envelope quantity with no producer.** The arm the chair tried to repair
  is blocked on precisely this gap.

**(iii) `JOINT_KINDS` is not in B11's crossed set, and it collides.** Measured over the 147:
`stair`, `external stair`, `stair turret`, `cage under stair` — **4 tokens against the landed
`JOINT_KINDS` member `stair`**, an exact match on the bare token. **Eleven more collide with landed
`ROOM_KINDS`**: `store` ×5, `kiln` ×2, `stall` ×2, `main`, `study` — and `clamp` from the (c) set is
routed to `ROOM_KINDS.kiln` as well. B11 crosses five vocabularies and **JOINT_KINDS is a sixth that
is landed, closed, and already in conflict.**

### 5.4 ⭐ The 53 cost B11 almost nothing — the good-news direction

Crossed mechanically, denominator 53:

| Cross | Collisions |
|---|---|
| 53 × landed `ROOM_KINDS` (28) | **0** |
| 53 × landed `FURNISHING_KINDS` (22) | **0** |
| 53 × landed `JOINT_KINDS` (5) | **0** |
| 53 × B11's known 20 | **1** — `cistern` |

**Adding 53 fixture members costs B11 exactly ONE new collision, not 53.** `cistern` is already a
CELL × STORAGE collision in the known 20 and becomes **three-way** (CELL × STORAGE × FIXTURE). It is
a deliberate member — the fixture gate's Checkpoint 3 records that a naive vessel-family sweep nearly
struck it on a prose mention of "stored-water vessel", and it survived by being re-derived by
consolidation target rather than word occurrence.

⚠ **Two substring hazards, which are not set collisions but will make a naive arm vacuous:**
`grep "bar"` matches landed `barrel` **and** new `drawbar` **and** new `barred grille`. R-INST-6
flagged the `drawbar`/`bar` collision independently. **This is the `dais` trap exactly** — the charter
already records that a bare `grep "'dais'"` arm "would be red forever and would then be widened until
it proved nothing". Every B11 arm must match the member spelling, never the bare substring.

### 5.5 What the resized gate costs

| | Chartered | Resized |
|---|---|---|
| vocabularies crossed | **5** | **8** — add `JOINT_KINDS` (landed, closed, already colliding), `RECESS`, `SUBDIVISION` |
| name collisions to assign an owner | **20** | **21** (`+cistern`, now three-way) **+ 15** landed-vocabulary collisions inside the 147 (`stair` ×4, `store` ×5, `kiln` ×2, `stall` ×2, `main`, `study`) = **36** |
| arms | one uniqueness arm | **two** — uniqueness (a name in two vocabularies) **and homing** (a token in none). They are the same defect class from opposite sides and one arm cannot see both. |
| substring-hazard arms | not chartered | **2** (`bar`-family), on the `dais`-trap discipline |
| ⛔ blocked-on | — | **a chair ruling on the ENVELOPE**: 73 tokens want a vocabulary that does not exist. Mint it, route it to the massing train with D-10, or record the deferral in §K with a reason. **It cannot be assigned an owning vocabulary because there is no vocabulary to assign.** |

**The honest cost statement.** B11 does not go from 20 to 147. It goes from *one arm over 20 names in
5 vocabularies* to **two arms over 36 names in 8 vocabularies, plus one open chair ruling that no
amount of measurement can close.** The gate is roughly twice the work; the ENVELOPE ruling is the
long pole, and it is a decision, not a measurement.

---

## §6 · EVERY PLACE MY MEASUREMENT DISAGREES WITH THE CHARTER OR THE DISPATCH

| # | Source | Says | Measured at `c3289244d` | Direction |
|---|---|---|---|---|
| 1 | charter §F.0 | CH-3 **OUTSTANDING** | **LANDED** — 14 commits, `minTier` 36 → 10 | charter understates progress |
| 2 | charter §F.0 | CH-5 **OUTSTANDING** | **LANDED** — `MF-CH5` LANDED, `alchemy` out of `ARCANE_INST_TAGS`; **G3 discharged** | charter understates progress |
| 3 | charter §F.0 | CG-2 "has no landing at any ref" | code **LANDED**, packet DRAFT; `TC4_ROW_BYTES_BAND` now derived | charter understates progress |
| 4 | charter §B | `exclusiveGroup` **deleted**; **81 of 420**; **~130** names | **not deleted** (7 occurrences unchanged); **30 of 420**; **123** names | charter **overstates** the blast radius |
| 5 | charter §D/§G/§H/§I | fixtures **82** | **135** | charter understates |
| 6 | charter §I C-25 | "treat 82 as PROVISIONAL until it runs" | the gate **has run** | discharged |
| 7 | charter §G DW-5d | rewrite to `count(furnace where flued) ≤ flueCount` | ⛔ `flueCount` is **0 of 2,185 src files** — still unexecutable | **the ruling breaks; reported, not routed around** |
| 8 | charter §G / architecture | DW-1b acceptance **4 arms / +4 titles** | **7 arms / +7**; wave 30 → **33** | charter understates |
| 9 | architecture | DW-1a/1b **"DECLARED SHIFT: NONE"** | they move a byte-pinned public artifact — **charter's B10 correction is right** | architecture wrong, charter right |
| 10 | architecture `:1568` | DW-1c/1d/1e/**1f** parallel | charter §F.4 serializes 1f — divergence **unrecorded in §I** | unlogged conflict |
| 11 | charter paths | `interiorTemplates.js` / `interiorModel.js` / `interiorEdits.js` | real paths are `src/domain/**interior/**…` | false-absence hazard |
| 12 | dispatch | 147 tokens belong to **other vocabularies** | only **55** do; **73** are ENVELOPE (no vocabulary exists) and **19** belong nowhere | dispatch **overstates** by 92 |
| 13 | dispatch | resize B11 by the 147 | the 53 add exactly **1** collision; the resize is 20 → **36** names across **8** vocabularies, in **2** arms | **cheaper in names, dearer in shape** |
| 14 | dispatch | DW-1 can't build — CH-6 moves catalog-derived figures | ⛔ **REFUTED.** The generated artifact is **byte-identical** across a 32-commit gap in which CH-3, CH-5 and CG-2 all landed; CH-6's file is **not a generator input**; CH-5 moved **0** name keys. **No DW-1 figure is CH-6-derived.** | **dispatch premise does not hold for DW-1** |
| 15 | dispatch / my own first hypothesis | CH-6 and DW-1a/1b would collide on the compendium artifact | **REFUTED by the same measurement.** Recorded because a tested refutation beats an untested worry. | my hypothesis wrong |
| 16 | `LANE-LAW.md` | census `titles 21017 / suiteTitles 5847` | **21026 / 5848** at the slot | lane law stale |
| 17 | charter §I | 25 conflicts, C-21 closed | C-17 and C-25 are now **discharged** by the gate; the DW-1f parallelism divergence (#10) is **unlogged** | ledger drift |

---

## §7 · WHAT I DID NOT DO

1. **No repo writes, no worktree, no vitest, no `npm run check*`, no packet, no commit, no pin.**
   Two build lanes are live and the gate is serial.
2. **I did not amend the charter.** The four sites carrying `82` (§1.2) are named, not edited.
3. **I did not take the L1 attribute ruling (§1.4).** Two branches costed, one recommended.
4. **I did not extend the granularity rule further.** The fixture gate's Reading B (striking `bier`,
   `touchstone`, `die/stamp`, `mould`, `scrutiny urns`) was offered and refused by the chair;
   I have not revived it.
5. **I did not rule on the ENVELOPE.** 73 tokens want a vocabulary that does not exist; minting one,
   routing it to the massing train, or deferring it in §K is a chair decision, not a measurement.
6. **I did not re-run the fixture gate.** I re-derived its arithmetic from its own artifacts and
   confirmed every figure; the extraction itself I did not repeat.
