# TE-DW-PREP — FINAL DW-1 DISPATCH BRIEF

**Lane TE-DW-PREP (read-only prep). Chair: Fable 5. Written 2026-08-24, session ending — successor handoff.**
**Slot measured: `claude/composite-r4` = `c3289244d58b7259205d80594856e8e0cc520817` (60 cars, packets 179).**
**Charter reconciled: `review-fixes-2026-07-08:docs/DW0-CHARTER-COMPILED.md`, 129,030 B / 1,102 lines.**
**Zero repo writes at any point. No vitest, no `npm run check*`, no worktree, no packet, no commit, no pin.**

---

## ⛔ §0 · WHERE THIS DOCUMENT STOPS — read this before trusting any section

A successor reading a document that does not say where it stops will trust all of it equally.
That is how the false-absence class starts. So:

| Section | State | What a successor can do with it |
|---|---|---|
| §1 the 53 → charter mapping, owning cars, the four `82` sites | **COMPLETE** | act on it |
| §2 Branch (A) record map, totality + consolidation arms, DW-1b's corrected budget | **COMPLETE** | act on it |
| §3 the 4a/4b arm split, 4b's home at DW-2b | **COMPLETE** | act on it |
| §4 §F.0 refresh, decayed figures | **COMPLETE** | act on it |
| §5 DW-1 dispatch — cars, file set, 15 exit criteria, census | **COMPLETE** | act on it |
| §6 ENVELOPE vocabulary | ⚠ **COSTED, NOT ADJUDICATED** — member estimate is mine at sample grade, floor/ruled/ceiling given. **The exact member count needs the fixture gate's method run over the envelope spans.** Do not quote my 20 as a measured figure. | dispatch the gate; do not build to the number |
| §7 C-19 sub-form recount lane | **SCOPED + FIRST-PASS MEASURED.** ⚠ The two integers I print are a **SIGNAL, not the ruled figures** — same discipline the chair imposed on the fixture gate's 84%. | dispatch the lane cold from this text |
| §8 B11 resize | **COMPLETE** | act on it |
| §9 the `interior/` path citations | **COMPLETE** — named by line | correct them |
| §10 the 17 disagreements | **COMPLETE** | act on it |

**Nothing in this brief is half-folded.** All four of the chair's rulings (record map · 4a/4b split ·
no CH-6 gate · ENVELOPE its own vocabulary) are folded in. The only sub-measured item is the
ENVELOPE **member count** (§6) and the C-19 **integers** (§7), both flagged in place.

**Companion files a successor needs, same directory:** `laneDWPREP-receipt.md` (the lane's audit
trail), `dwfix/FINAL-A.txt` (the 53, ⚠ no terminal newline — use `grep -c .`, `wc -l` says 52),
`dwfix/adjudication.tsv` + `dwfix/adjudication2.tsv` (the 481 rows), `laneDWFIX-receipt.md`.

---

## §1 · THE 53 — MAPPING, OWNING CARS, AND THE FOUR SITES THAT MOVE

### 1.1 The arithmetic, independently reproduced (denominators named)

Recomputed from the gate's own TSVs, not inherited.

| Figure | Value | Denominator |
|---|---|---|
| adjudication ROWS | **481** | the NONE set |
| (a) genuine miss, ROWS | **43** | of 481 |
| (b) belongs elsewhere, ROWS | **147** | of 481 |
| (c) fairly consolidated, ROWS | **277** | of 481 |
| (n) parse noise, ROWS | **14** | of 481 |
| **(a) genuine miss, MEMBERS** | **53** | 43 A rows **+ 10 family heads that are not rows** |
| **THE UNION** | **135** | 22 landed `FURNISHING_KINDS` + **113** add-list (was 60) |

`43+147+277+14 = 481` ✓ · `43+10 = 53` ✓ · `53 = FINAL-A.txt` ✓ · `22+113 = 135` ✓
**Every gate figure CONFIRMED by independent recomputation. 135 stands.**

The ten head-only members (members that are not rows, because no tranche writes them as a bare
token): **basin · bath · die/stamp · furnace · hanging · hoist · mill · mould · scales · vessel**.

### 1.2 ⭐ THE FOUR SITES CARRYING `82` — all move to `135` together

A partial edit leaves two truths in one document. **Move all four or none.**

| # | Charter site | Reads today | Must read |
|---|---|---|---|
| **1** | **§D taxonomy table, FIXTURE KINDS row** (charter L570) | `**82**, ⚠ pending one open item` · `22 + 60` | `**135**` · `22 + 113` |
| **2** | **§G DW-1 EXIT** (charter L107) | `48 partis · 83 cells · **82 fixtures** · 9 circulation classes` | `… · **135 fixtures** · …` |
| **3** | **§H G8 disposition** (charter L210) | `DW-1b (fixtures 22 → 82)` | `DW-1b (fixtures 22 → **135**)` |
| **4** | **§I C-25** (charter L79) | `treat 82 as PROVISIONAL until it runs` | **the gate HAS run — DISCHARGE the flag** |

§I C-14 ("82; the 81 is pre-amendment") and §I C-17 ("do NOT add `ring table` alone and restate
`22 + 61 = 83`") both stand as correct history, now superseded. **C-17's refusal was vindicated:**
`ring table` folds into `table`+shape under the granularity rule and never was a member of its own.

### 1.3 Owning car, and the seam obligations

**One owning car: `DW-1b`.** §H G8 absorbs the fixture gap into DW-1b; §I C-25 rules the
re-derivation's execution belongs to DW-1b's dispatch. All 53 are `FIXTURE_KINDS` members.

**Overlapping lenses over one set of 53** — not a partition. Distinct union **23 of 53**; the other
**30** are clean single-vocabulary adds creating no obligation outside DW-1b.

| Lens | N | Members | Car that owes an arm, and what |
|---|---|---|---|
| **L1 heads needing an ATTRIBUTE DOMAIN** | **10** | basin · bath · die/stamp · furnace · hanging · hoist · mill · mould · scales · vessel | **DW-1b** — the record map, §2 |
| **L2 joint-closure family** | **6** | barred grille · drawbar · drawbridge · hatch · iron sheeted door · portcullis | **DW-1d** — an agreement arm that a fixture-closure and a joint attribute do not both encode one closure. `hatch` is sharpest: `cell.approach: HATCH_ONLY` already exists in §D |
| **L3 a paired CELL kind G8 also asks for** | **5** (4 new) | furnace · bread ovens · sawpit · garderobe · immersion pool | **DW-1a** — B11 ownership declarations. G8's missing-cell list names "a **furnace room**" while the 53 supply `furnace` the fixture. Same for `bread ovens` vs landed `ROOM_KINDS.kiln`, `sawpit` vs the `pit` routed to a zone |
| **L4 the DW-5d unblocker** | **1** | furnace | **DW-5d** — §3 |
| **L5 B11's only new collision** | **1** | cistern | **DW-1e** — already CELL × STORAGE in the known 20; becomes **three-way** |
| **L6 storage seam** | **2** | chest · key board | **DW-1e** — lockable-store fixtures vs `StorageCell` + the six polarities |
| **clean adds** | **30** | remainder | DW-1b only |

⚠ **Two substring hazards, not set collisions:** `grep "bar"` matches landed `barrel` **and** new
`drawbar` **and** new `barred grille`. R-INST-6 flagged `drawbar`/`bar` independently. **This is the
`dais` trap** — the charter already records that a bare `grep "'dais'"` arm "would be red forever and
would then be widened until it proved nothing". Every arm matches the member spelling, never the bare
substring.

---

## §2 · RULING 1 FOLDED — BRANCH (A), THE RECORD MAP

**Chair ruled: `FIXTURE_KINDS` becomes `{ kind, attrs: {...} }`, DW-1b gains a totality arm and a
consolidation arm, and the arm-count/census cost is accepted because that cost IS the enforcement.**

### 2.1 Why the array could not carry the rule

The granularity rule is *"finer distinctions are ATTRIBUTES, not members"* — `table`+shape,
`vessel`+kind, `furnace`+`flued`. **Measured: the charter has ZERO fixture attributes.** §D lists five
*joint* attributes (`severable`, `schedule`, `refused`, `mandatoryOpen`, `OBJECT_ONLY`) and
`cell.approach`. The only fixture attribute anywhere is DW-3a's wear **grade** — a different car, a
later wave. The architecture confirms the shape: DW-1b creates `fixtureVocabulary.js` with acceptance
arm 1 *"frozen+unique"* — **an array of strings, which cannot carry `flued: bool`.**

### 2.2 The shape

```js
export const FIXTURE_KINDS = Object.freeze([
  Object.freeze({ kind: 'vessel',  attrs: Object.freeze({ kind: ['aludel','blowpipe','crucible',
      'cucurbit','drug jar','pots','pots set','receiver'] }) }),
  Object.freeze({ kind: 'furnace', attrs: Object.freeze({ flued: 'bool' }) }),
  Object.freeze({ kind: 'table',   attrs: Object.freeze({ shape: ['ring','trestle','long', …] }) }),
  …                                          // 135 records total
]);
export const FIXTURE_FOLD = Object.freeze({   // every folded spelling -> its head
  crucible: 'vessel', aludel: 'vessel', 'ring table': 'table', …
});
```

### 2.3 DW-1b's two new arms

| Arm | Assertion | Convicting mutant |
|---|---|---|
| **TOTALITY** | every one of the **10** head members declares a non-empty `attrs` domain; every non-head declares `attrs: {}` | delete one head's domain → reds |
| **CONSOLIDATION** | every key in `FIXTURE_FOLD` resolves to a `kind` present in `FIXTURE_KINDS`, and **no folded spelling is itself a `kind`** | re-add `crucible` as its own member → reds. **This is the arm that stops the consolidation silently unwinding** |

The consolidation arm is the *cure-that-did-not-travel* guard: without it a later author re-adds
`crucible` and nothing records that `vessel` was meant to absorb it.

### 2.4 ⛔ DW-1b's corrected budget

Chartered: **4 arms / +4 titles** (frozen+unique · every template `furnish` member is a member ·
`RECESS_STATES` is exactly `OPEN|BLOCKED` · the count is 82).

| Arm | Source |
|---|---|
| 1 frozen + unique | chartered |
| 2 every template `furnish` member is a `FIXTURE_KINDS` member | chartered |
| 3 `RECESS_STATES` is exactly `OPEN\|BLOCKED` | chartered |
| 4 **the count is 135** (was 82) | §1.2 |
| 5 **TOTALITY** | ⭐ ruling 1 |
| 6 **CONSOLIDATION** | ⭐ ruling 1 |
| 7 **furnace arm 4a** (totality + unflued-EXISTS) | ⭐ ruling 2, §3 |

**DW-1b is a 7-arm car, not 4. Census delta +7, not +4. Wave total 30 → 33** (`1a +6 · 1b +7 ·
1c +5 · 1d +5 · 1e +5 · 1f +5`).

⚠ **The `+6 eff` estimate on `interiorTemplates.js` was sized for 60 added members and is wrong at
113** — and the record map changes each entry from a string to an object, so the line count roughly
triples rather than doubles. **Re-cut the estimate; do not inherit it.**

### 2.5 Three mechanical bills, banked, invisible to the arm count

- **A new test file reds THREE ratchets** — the two censuses **plus** `mutationCoverageManifest`'s
  E-A TOTALITY arm. **DW-1 creates six new test files.**
- **A template-literal `it()` title inflates the census by its PARTS.** With 135 records the pull
  toward ``it(`${kind} is frozen`)`` is strong and the delta will not close.
- **`test.each()` / loop-registered titles are INVISIBLE to the census** — check `credited`, not
  `titles`, or a real addition reads as zero.

---

## §3 · RULING 2 FOLDED — THE 4a/4b ARM SPLIT

**Chair ruled: take the split. `flueCount` was verified 0 at §551.6 and the rewrite used it anyway.**

### 3.1 The engine facts, re-measured at the slot

Walked all **2,185** tracked `src/` files at `c3289244d` with **node**, word-anchored — not
`git grep -E` (does not honour `\b`), not `grep` (ugrep here; prints a complexity error, not zero).

| Symbol | Occurrences | Files | Denominator |
|---|---|---|---|
| `portableFurnace(s)` | **0** | 0 | 2,185 src files |
| `flueCount` | **0** | 0 | 2,185 src files |
| `\bflues?\b` | **0** | 0 | 2,185 src files |
| `\bfurnaces?\b` | **7** | 3 | `institutionDescVariants.js`, `institutionalCatalog.js`, `institutionVocabulary.js` — **all prose** |

### 3.2 The split, as ruled

**ARM 4a — LIVE at DW-1b** (arm 7 of §2.4). No envelope dependency.

```
(i)  TOTALITY : ∀ f where f.kind === 'furnace' :  f.attrs.flued ∈ {true, false}
(ii) EXISTENCE: count(f where f.kind === 'furnace' && f.attrs.flued === false) > 0
```

Clause (ii) is the finding itself. Boerhaave's room *"only had one chimney, whereas he wanted to
perform various chemical experiments simultaneously"* — the portable furnace exists **precisely to
defeat the flue constraint**; R-INST-5 calls it "the one measured fixture in the family".
⛔ **§546.3's trap stands: the naive `furnaces ≤ flues` would convict the best-attested laboratory in
the corpus.** Arm 4a convicts that same error from the other side and convicts nothing that is true.

**Convicting mutants:** set every `flued` to `true` → (ii) reds. Set one to a non-boolean → (i) reds.
Both cheap, both real. *A control that cannot fail proves nothing.*

**ARM 4b — DEFERRED to DW-2b with a NAMED home.**

```
count(furnace where flued) ≤ envelope.flueCount
```

**Home: DW-2b** — the vertical partition, the car that already owns storeys and the envelope area
accounting. **Blocker: `envelope.flueCount` has no producer**, and that is the ENVELOPE gap (§6) —
the gate's own (b) set files `chimney row` under ENVELOPE.

**Net:** DW-5d ships **five** arms (four live + 4b deferred with an owner) instead of four live and
one open hold. **A named smaller blocker beats an open hold.**

---

## §4 · §F.0 REFRESHED AT `c3289244d`

### 4.1 Rows that MOVED

| Car | Charter row at `79b78881c` | Measured at `c3289244d` |
|---|---|---|
| ⛔ **CH-3** | **OUTSTANDING**, "in flight" | **LANDED** — 14 commits are ancestors; `minTier` declarations in `institutionalCatalog.js` **36 → 10 = exactly −26** |
| ⛔ **CH-5** | **OUTSTANDING** | **LANDED** — `MF-CH5` = LANDED; `ARCANE_INST_TAGS = ['arcane','planar','enchanting']`, **`alchemy` gone** to a sibling `TRADE_INST_TAGS`. **§H's G3 is DISCHARGED at the slot** |
| ⛔ **CG-2** | **OUTSTANDING** — *"`MF-CG2` has no landing at any ref"* | **code LANDED**, packet DRAFT — 4 TE-CG-2 commits are ancestors; `TC4_ROW_BYTES_BAND` is now `DERIVED_CAPS.rowBytes` (`cartographyTuning.js:495`), not the authored `400` |

### 4.2 Rows that HOLD (re-measured, not inherited)

CG-1 `d78011665` ✓ · CG-1b `3e9d2d888` ✓ · CH-1 `b2852ccc3` ✓ (`\binteriorKind\b` = **0 of 2,185
src files** — C-24's correction survives) · CH-2A `17fe89763` ✓ · UC-5 `f4df874ce`,
`connectivity.js` = **28,261 B** exact ✓ · MP-1 `9e5059cec`, `cartographyProperty.js` = **9,141 B**
exact ✓ · CH-2B not landed ✓ · CH-4 `CATEGORY_PATTERNS` unchanged, criminal's `/den/` still tests
before residential ✓ · CH-6 `ARCANE_INST_KW` still carries `'healer (divine'`, `'divine healer'`,
`'warden'`, `'great library'` — the deity-doctrine violation is live ✓.

Ancestry by `--is-ancestor` (a status, which cannot echo a false positive the way a bare
`git rev-parse` can). Sizes by `git cat-file -s` on a **braced** `${SHA}:path`.

### 4.3 ⛔ The decayed integer — a THIRD decay direction

**§B's headline row is wrong in mechanism AND magnitude.**

| | Charter predicted | Landed (measured, and in CH-3's own commit `501122493`) |
|---|---|---|
| mechanism | delete `exclusiveGroup` from two city rows | ⛔ **never deleted** — `religiousCenter` still **7 occurrences**, unchanged. A forked-stream `exclusiveGroupCoexists: true` drawn from `rng.fork('exclusiveCoexist::…')` was used instead, so the main sequence does not shift |
| settlements changed | **81 of 420** | ⛔ **30 of 420** |
| names moved | **~130** | ⛔ **123** distinct new name strings |
| records | — | 87 (was 113 under the deletion form) |

§A names two decay directions — an absence since filled (UC-5), a presence that never arrived (CH-1).
**This is a third: a prediction that landed by a different mechanism at a different magnitude.**
Chair owns it: §544.7's revision to the rng-preserving variant is why the mechanism changed, and the
charter recorded the pre-revision prediction.

### 4.4 Consequential rows

- **§B's PROVISIONAL-ON-CH3 clause — premise gone.** CH-3 landed. Every item on its "exhaustive list"
  is now measurable at the slot. **Re-head it PROVISIONAL-ON-CH6 and re-scope** (CH-4, CH-6 remain).
- **§F.2 "46 commits dispatched"** → **45** if the chair rules CG-2 done.
- **§F.4's `CH-3 · CH-5 · CH-6 · WEB-8b`** → **`CH-6 · WEB-8b`**.
- **§F.0's instrument note holds:** `029268fe5` is still an orphan — ground truth for RESEARCH,
  never for ENGINE STATE.
- ✅ **`LANE-LAW.md` re-stamped by the chair** (`21026/5848`, packets 179, slot `c3289244d`). Closed.

### 4.5 Rows that did NOT decay — reported because a review that only finds defects is advocating

`ROOM_KINDS` = **28** at `:35` incl. **both `stall` and `dais`** · `FURNISHING_KINDS` = **22** at
`:50` · `INTERIOR_KINDS` = **8** at `:29` · `interiorKindOf` at `:172` · `interiorTemplates.js` =
**10,471 B** · `compendiumData.generated.js:409` `roomKinds` = 28 incl. both ·
`CatalogHubs.jsx:66` renders `Room kinds: ${facets.roomKinds.length}` · `testRatchet.test.js:181`
`CEILING = 17` with **11** banked entries (4 in `tests/copy/voiceMechanics.test.js`) ·
`VIEWING_PAYWALLS_PENDING_514` = **3** at `entitlementLadder.js:135-139` · `JOINT_KINDS` = **5**
(`grate · stair · sealed_door · sluice · breach`) · `constants.js` = 4,725 B.

---

## §5 · THE DW-1 DISPATCH

### 5.1 Cars and order

**6 cars, INERT** (frozen vocabularies + a membership walker; no producer reads the new members).
⚠ **7 cars if the chair mints DW-1g for ENVELOPE — see §6.3.**

```
[PRE-DW-1]   B11 cross-vocabulary uniqueness check   — RESIZED, §8
[PRE-DW-1b]  C-25 fixture re-derivation gate         — ⭐ RUN AND DISCHARGED (union 135)
[PRE-DW-1d/1e] C-19 sub-form recount                 — ⛔ NEVER RUN, §7 — BLOCKS 1d AND 1e

DW-1a  ──►  DW-1b                    SERIALIZE (D6: both touch interiorTemplates.js)
DW-1c, DW-1d, DW-1e  ──►  DW-1f      (charter §F.4)
```

⚠ **Unlogged charter/architecture divergence.** Architecture `:1568` puts `DW-1c, DW-1d, DW-1e, DW-1f`
all parallel ("no shared file"); charter §F.4 serializes DW-1f after the other three. **The charter is
the ruled layer and governs**, but the divergence is **absent from §I's conflict list** and should be
added, or a lane reading the architecture dispatches four in parallel.

**Preconditions at the slot:** DW-1a's architecture row requires *"CH-1 LANDED and CG-1, CG-2
LANDED"*. Measured: CH-1 ✓, CG-1 ✓, CG-2 **code** ✓ (packet DRAFT). **All met except CG-2's packet
flip.**

### 5.2 File set

| Car | changeManifest | New test file |
|---|---|---|
| **DW-1a** | `CREATE src/domain/dwellings/vocabulary/cellVocabulary.js` (+120 eff) · `MODIFY src/domain/interior/interiorTemplates.js` — `ROOM_KINDS` re-points at `CELL_KINDS`, retire **both** `'stall'` and `'dais'`, `FURNISHING_KINDS.dais` STAYS · **+ `INTERIOR_KINDS` folds in (C-22)** · **+ regenerated `src/domain/compendium/generated/compendiumData.generated.js` and `npm run gen:compendium-data`** | `tests/domain/dwellingsCellVocabulary.test.js` |
| **DW-1b** | `CREATE …/vocabulary/fixtureVocabulary.js` — ⭐ **the `{kind, attrs}` record map + `FIXTURE_FOLD`** · `MODIFY interiorTemplates.js` (`FURNISHING_KINDS`) · **+ regenerated compendium artifact** · ⚠ **eff estimate re-cut, not inherited** | `tests/domain/dwellingsFixtureVocabulary.test.js` |
| **DW-1c** | `CREATE …/vocabulary/partiCatalog.js` (+160 eff) | its test |
| **DW-1d** | `CREATE …/vocabulary/circulationVocabulary.js` (+190 eff) · **+ `SURFACE_JOINT_KINDS` (C-20)** | its test |
| **DW-1e** | `CREATE …/vocabulary/storageVocabulary.js` (+180 eff) | its test |
| **DW-1f** | `CREATE …/vocabulary/relations.js` (+100 eff) | its test |
| **DW-1g?** | `CREATE …/vocabulary/envelopeVocabulary.js` — ⭐ **if the chair mints it, §6.3** | its test |

### 5.3 The 15 exit criteria — which MOVE under the four rulings

| # | Criterion | Value | Moved by |
|---|---|---|---|
| E1 | `CELL_KINDS`, **all three intermediates** | `28 − 2 + 57 = **83**` | — FIRM |
| **E2** | `FIXTURE_KINDS` count | ⛔ **135** = `22 + 113` (was 82) | **ruling 1** |
| **E2b** | ⭐ **NEW — every member is a `{kind, attrs}` record; 10 heads carry a non-empty domain** | totality | **ruling 1** |
| **E2c** | ⭐ **NEW — `FIXTURE_FOLD` totality; no folded spelling is itself a `kind`** | consolidation | **ruling 1** |
| E3 | `PARTIS` | **48** | — FIRM |
| E4 | circulation **classes** | **9** | — FIRM |
| **E5** | circulation **sub-forms** | ⛔ **no integer exists** ("~55") | **§7 — blocks DW-1d** |
| **E6** | storage **sub-forms** | ⛔ **no integer exists** ("~35") | **§7 — blocks DW-1e** |
| E7 | storage polarities / prohibitions | **6 / 3** | — FIRM |
| E8 | `RELATION_KINDS` | exactly `owns\|occupies\|hostedIn\|NO_BUILDING` | **owner-gated O2/R1** |
| E9 | `NO_BUILDING_REASONS` | **6** | — FIRM |
| E10 | producers of `room('stall'` / `room('dais'` under `src/` | **0** | — FIRM, already 0 |
| E11 | `FURNISHING_KINDS.dais` survives | present, 2 live producers | — FIRM |
| E12 | regenerated `roomKinds` | **83**, containing **neither** `stall` nor `dais` | — FIRM |
| E13 | public Compendium card | `Room kinds: 28` → **`Room kinds: 83`** | — FIRM, **declared shift** |
| E14 | banked-failure ratchet | unchanged at **11** of `CEILING = 17` | — FIRM |
| **E15** | census delta, attributed **per test file** | ⛔ `1a +6 · **1b +7** · 1c +5 · 1d +5 · 1e +5 · 1f +5 = **33**` (was 30) | **ruling 1** |
| **E16** | ⭐ **NEW — ENVELOPE member count** | ⚠ **estimate only, §6** | **ruling 4** |

**E12/E13 — the charter is right and the architecture is wrong.** Architecture says DW-1a/1b carry
**"DECLARED SHIFT: NONE"**. Measured: `scripts/generate-compendium-data.mjs:59` imports
`INTERIOR_KINDS, ROOM_KINDS, FURNISHING_KINDS`; `:603` emits `roomKinds: [...ROOM_KINDS]`;
`tests/docs/compendiumDataFreshness.test.js` asserts the artifact is **byte-identical to a fresh
generation**. **DW-1a/1b move a shipped public count and enumerable. Do not inherit "NONE".**

### 5.4 ⭐ RULING 3 FOLDED — DW-1 IS NOT GATED ON CH-6

**Measured, three instruments, with a working control:**

| Test | Result |
|---|---|
| Did `compendiumData.generated.js` move across the 32-commit gap in which **CH-3, CH-5 and CG-2 all landed**? | ⛔ **NO** — blob `3b1bf2c254abd4cb33db47e97e64e2ee8ae85d7c`, **98,359 B**, identical at both ends; absent from `git diff --name-only`; absent from `git log -- <path>` |
| **CONTROL** — can those instruments show a change? | ✅ **YES** — all three report `src/data/institutionalCatalog.js` as moved over the **same** range. The instrument is live, not blind |
| Does CH-6's file (`arcaneInstitutionVocabulary.js`) feed the generator? | **NO — 0 imports** |
| Did CH-5 change the catalog's tier/category/**name** key set (the only catalog surface the generator reads)? | **NO — 0 name-key differences** |

**DW-1's counts are properties of frozen arrays from a frozen corpus at `029268fe5`, which cannot
move. No DW-1 figure is CH-6-derived.** The CH-before-DW ordering **stands as programme policy but is
not a technical constraint for DW-1**. **DW-R2 remains genuinely catalog-gated** and keeps the
dependency.

**The four DW-1 figures that ARE provisional, with the real dependency named:**

| Figure | Provisional on | Not on |
|---|---|---|
| E2 — 135 | the chair's edit landing in the four sites of §1.2. Until then a lane reading the charter builds **82** | CH-6 |
| E5 / E6 — sub-forms | ⛔ **C-19's recount, ruled and never run (§7)** | CH-6 |
| E8 / DW-1f's +5 | ⛔ **owner-gated O2/R1** — §C.7 orders `occupies`' sizing re-read | CH-6 |
| E16 — ENVELOPE | the ENVELOPE gate (§6) | CH-6 |

---

## §6 · RULING 4 FOLDED — ENVELOPE AS ITS OWN VOCABULARY

**Chair ruled: ENVELOPE is minted as its own named vocabulary, not folded into an existing one.**
Reasoning of record: 73 tokens is too many to fold without collision (`cistern` already three-way,
`stair` colliding four ways), and folding a **surface** concept into a room or fixture vocabulary is
the category error that left `ARCANE_INST_TAGS` a **trade** vocabulary doing a **magic-dependence**
job (§541). Reversal: fold it later; nothing else references it yet.

### 6.1 ⚠ COSTED AT SAMPLE GRADE — NOT ADJUDICATED

**I consolidated the 73 by head noun and by hand. The fixture gate adjudicated all 481 keys
individually with integrity checks; I did not repeat that for the envelope.** Treat the member count
as an **estimate with a stated range**, exactly as the chair required of the fixture gate's 84%.

Mechanical first pass: **73 tokens → 51 distinct last-word heads**; 10 heads carry >1 token
(covering 32 tokens), 41 heads are singletons.

| | Value | Basis |
|---|---|---|
| **CEILING** | **73** | every token its own member |
| **RULED (estimate)** | **~20** | consolidation below |
| **FLOOR** | **~18** | maximal consolidation |
| **routed OUT** | **~4 tokens** | `stair`, `footholes`, `portall`, `oriel landing` → **DW-1d circulation** |

**The ~20 consolidated members** (each a head + attribute domain, per the granularity rule):
`floor`{material, treatment, inlay} — absorbs 12 tokens · `window`{form, glazing, orientation} —
absorbs 13 · `wall`{role, finish} — 4 · `parapet` · `ceiling`{vaulted, ribbed, painted} — 3 ·
`cupola` · `turret`{use} — 2 · `gallery`{position} — 4 · `rail` — 2 · `arcade`{form} — 3 ·
`post`{material, base} — 5 · `frame` · `skin` · `bridge` — 2 · `causeway` · `earthwork`{form} — 3 ·
`service`{kind: water\|vent\|outfall\|**flue**} — 4 · `scenery` — 2 · `ground_setting` ·
`false floor` (a concealment void, R-INST-6 NO TYPED HOME — **not** a `floor` variant).

⭐ **`service{flue}` is where `flueCount` comes from.** `chimney row` sits in this family, and a count
of `service where kind === 'flue'` **is** `envelope.flueCount`. **That closes arm 4b's blocker with a
named producer** (§3.2) — the ENVELOPE vocabulary is what unblocks the furnace inequality.

### 6.2 Why this is a real gap, not an extraction artefact — two independent confirmations

- **R10 is UNCARRIED.** §H.2 records `apertureUse: LIGHT|VENT|PROCESS_LOOP` and `lightDemand` as
  **0/0 in both frozen sources**, routed to DW-1a "whose row is cell kinds", and marked **"Owed."**
  The 73 BE tokens are largely the aperture surface R10 asked for.
- **`flueCount` has no producer** (§3.1) — the arm the chair tried to repair is blocked on precisely
  this gap.

Three signed bands touch the envelope with no vocabulary owning it: **B5** (walls → separation →
duplication), **B7** (storey heights descend), **B12** (party walls).

### 6.3 ⛔ THE CAR QUESTION — a J-DW0-2 amendment, and it is the chair's

The chair ruled the **vocabulary**; the **car** is a separate call. **J-DW0-2 says "No new DW wave and
no new DW car. 10 waves / 41 cars stands."** Minting DW-1g breaks it.

| Option | Cost | Verdict |
|---|---|---|
| **(a) DW-1g inside DW-1** | wave 6 → **7 cars**, programme 41 → **42**; **amends J-DW0-2** | ⭐ **RECOMMENDED** — a surface vocabulary inside a fixture car repeats the exact category error the chair just ruled against, and DW-1b is already 4 → 7 arms |
| (b) fold into DW-1d | no car cost; but envelope ≠ circulation | rejected — same category error |
| (c) fold into DW-1b | no car cost; DW-1b would own 5 vocabularies and ~10 arms | rejected — DW-1b is already the heaviest car |
| (d) charter outside DW's 41, like AD/CG | preserves 41; adds a train | viable alternative if J-DW0-2 is to be held |

**I have not taken this.** (a) is recommended; **J-DW0-2 is named as the explicit cost** so the chair
amends it deliberately rather than discovering it.

### 6.4 What the ENVELOPE gate must do (dispatchable)

Same method as the fixture gate: extract every envelope token from the tranches' own blocks, adjudicate
each into (a) genuine member / (b) another vocabulary / (c) fairly consolidated, run the three controls
(accuracy on a hand-counted passage; can-OVER-count; can-MISS), and report floor/ruled/ceiling.
**Derive family membership by CONSOLIDATION TARGET, never by word occurrence** — the standing law the
`cistern`/`immersion pool` near-miss produced.

---

## §7 · C-19's SUB-FORM RECOUNT — SCOPED AS ITS OWN LANE

**Dispatchable cold from this section.** The cheapest high-value next lane: it is ruled, unrun, and
**blocks two of DW-1's six cars.**

### 7.1 The gate

C-19 (chair, 2026-08-24): *"Recount `~55` and `~35` mechanically and pin both as integers with
mutants."* **No lane has run it. The two integers do not exist.** DW-1d and DW-1e cannot state an
exit criterion (E5, E6).

### 7.2 Exact inputs

| | |
|---|---|
| **Source** | `refs/preserve/research-dossiers-2026-08-23` = `029268fe579b2cbd64e9941b66e77639133f072e`, path `charters/draft-DWELLINGS-CHARTER.md` (237,547 B / 3,070 lines) — ⚠ **ORPHAN ref: ground truth for RESEARCH, never for ENGINE STATE** |
| **CIRCULATION span** | **§2.4, lines 809–848** (3,827 B). Claim at **L826**: *"9 top-level classes; ~55 sub-forms"* |
| **STORAGE span** | **§2.5, lines 849–885** (3,004 B). Claim at **L851**: *"~35 sub-forms (CIRC §4.4)"* |
| **Other sites carrying the claims** | **L1047** (`subForm, // §2.4's ~55`), **L1894**, **L2992–2993**. **All must move together** — same discipline as §1.2's four `82` sites |
| **Token shape** | backticked `UPPER_SNAKE`, `·`-separated, nested inside `{...}`; a few carry `/` alternates (`TRESAUNCE/ALURE`, `RAW/PRODUCT`) |

### 7.3 ⚠ FIRST-PASS SIGNAL — not the ruled figures

Ran the naive extraction this lane. **This is a SIGNAL, not an answer** — the same caution the chair
imposed on the fixture gate's 84%.

| | Claim | Naive distinct | Minus classes/buckets/polarities | Signal |
|---|---|---|---|---|
| CIRCULATION | ~55 | **86** | ~**60** (less 9 classes, 2 alias halves, 5 width, 4 length, 6 licence rungs) | ⛔ **understated** |
| STORAGE | ~35 | **69** | ~**52** (less ~10 top-level classes, 7 polarity terms) | ⛔ **understated** |

**Both claims are understated, the same direction as the fixture list's 82 → 135.** The lane's job is
to turn the signal into a ruled figure by adjudicating each token.

⭐ **One B11 arm is already discharged by this pass: CIRCULATION × STORAGE collisions = 0.**

### 7.4 The lane's obligations

1. Adjudicate every token: **sub-form** vs **top-level class** vs **width/length bucket** vs
   **licence rung** vs **polarity**. The naive count conflates all five.
2. Report **floor / ruled / ceiling** with a stated rule, as the fixture gate did.
3. Run **three controls**: accuracy (hand-count one class, match it); can-OVER-count (remove a
   terminator, see it inflate); can-MISS (run a deliberately narrower rule, see it drop).
4. **Name the denominator on every count.**
5. Cross the two sets against each other and against `CELL_KINDS`, `FIXTURE_KINDS`, `PARTIS`,
   `JOINT_KINDS`, `RECESS`, `SUBDIVISION`, **ENVELOPE** — feeding §8's resized B11.
6. Move **all five** claim sites together (L826, L851, L1047, L1894, L2992–2993).
7. ⚠ `\b` is not honoured by `git grep -E`; `grep` here is ugrep and fails silently on bounded
   repetition. **Use node.**

**Estimated cost: one read-only lane, no worktree, no gate** — the same shape as TE-DW-FIX.

---

## §8 · B11 RESIZED

### 8.1 The (b) 147 by class — the framing corrected DOWNWARD

Chair's §551.9 said 147 tokens belong to other vocabularies. **Measured, only 55 do.**

| Class | N | What it is |
|---|---|---|
| **BR** | **39** | another **existing** DW vocabulary — room, yard/zone, circulation, storage bay, water zone ✓ |
| **BX** | **16** | declared **RECESS / SUBDIVISION** ✓ — ⭐ **and DW-1b already owns both** (architecture titles it *"fixtures, `RECESS`, `SUBDIVISION`"*) |
| ⛔ **BE** | **73** | **ENVELOPE** — no charter vocabulary owned it; **now ruled its own (§6)** |
| **BS** | **19** | not a fitting in **any** vocabulary — commodities, activities, states, movables |

`39+16+73+19 = 147` ✓. **The "other vocabularies" class is 55, not 147 — over-counted by 92.**

### 8.2 ⭐ The 53 cost B11 exactly ONE collision

| Cross | Collisions | Denominator |
|---|---|---|
| 53 × landed `ROOM_KINDS` (28) | **0** | 53 |
| 53 × landed `FURNISHING_KINDS` (22) | **0** | 53 |
| 53 × landed `JOINT_KINDS` (5) | **0** | 53 |
| 53 × B11's known 20 | **1** — `cistern` | 53 |

`cistern` becomes **three-way** (CELL × STORAGE × FIXTURE). It is a deliberate member: the gate's
Checkpoint 3 records a naive vessel-family sweep nearly striking it on the prose "stored-water vessel",
and it survived by consolidation-target derivation.

### 8.3 `JOINT_KINDS` is missing from B11's crossed set, and it collides

Measured over the 147: `stair`, `external stair`, `stair turret`, `cage under stair` — **4 tokens
against the landed `JOINT_KINDS` member `stair`**, exact match on the bare token. **Eleven more collide
with landed `ROOM_KINDS`**: `store` ×5, `kiln` ×2, `stall` ×2, `main`, `study` (plus `clamp` from the
(c) set routed to `ROOM_KINDS.kiln`).

### 8.4 The resized cost

| | Chartered | Resized |
|---|---|---|
| vocabularies crossed | **5** | **9** — add `JOINT_KINDS` (landed, closed, already colliding), `RECESS`, `SUBDIVISION`, **`ENVELOPE`** |
| names to assign an owner | **20** | **21** (`+cistern`, three-way) **+ 15** landed collisions in the 147 (`stair` ×4, `store` ×5, `kiln` ×2, `stall` ×2, `main`, `study`) = **36** |
| arms | one uniqueness arm | **two — uniqueness** (a name in two vocabularies) **and homing** (a token in none). Same defect class from opposite sides; one arm cannot see both |
| substring-hazard arms | not chartered | **2** (`bar` family), on the `dais`-trap discipline |
| blocked-on | — | ✅ **CLEARED by ruling 4** — the ENVELOPE now has a vocabulary to be assigned to |

**Honest statement: B11 does not go 20 → 147. It goes from one arm over 20 names in 5 vocabularies to
two arms over 36 names in 9 vocabularies.** Roughly twice the work, and **ruling 4 removed the one
part no measurement could close.**

---

## §9 · THE `interior/` PATH CITATIONS — NAMED BY LINE, SO THEY ARE CORRECTED NOT RE-FOUND

Real paths at the slot are **`src/domain/interior/…`**. The charter writes them without the
directory. A lane grepping the literal path gets **zero hits and reads it as decay** — the exact
instrument class §A exists to guard.

**Line-numbered citations (actionable, therefore dangerous) — FIVE, not three:**

| Charter line | Reads | Correct |
|---|---|---|
| **L512** | `interiorModel.js:83-86` | `src/domain/interior/interiorModel.js:83-86` |
| **L539** | `interiorModel.js:79-87` · `PROSPERITY_TIERS` (`src/data/constants.js:92`) ✓ | `src/domain/interior/interiorModel.js:79-87` |
| **L568** | `interiorTemplates.js:140` and `:166` | `src/domain/interior/interiorTemplates.js:140`, `:166` |
| **L754** | `interiorTemplates.js:35` … `:50` (D6) | `src/domain/interior/interiorTemplates.js:35`, `:50` |
| **L1003** | `interiorTemplates.js:29` … `:172` (C-22) | `src/domain/interior/interiorTemplates.js:29`, `:172` |

**Bare mentions, no line number (lower risk, fix while there):** L661, L772, L1084.
**Already correct:** L658 writes `src/domain/interior/interiorEdits.js` in full.

---

## §10 · THE 17 DISAGREEMENTS — BOTH DIRECTIONS

| # | Source | Says | Measured at `c3289244d` | Direction |
|---|---|---|---|---|
| 1 | charter §F.0 | CH-3 **OUTSTANDING** | **LANDED** — 14 commits, `minTier` 36 → 10 | charter understates progress |
| 2 | charter §F.0 | CH-5 **OUTSTANDING** | **LANDED**; `alchemy` out; **G3 discharged** | charter understates progress |
| 3 | charter §F.0 | CG-2 "no landing at any ref" | code **LANDED**, packet DRAFT | charter understates progress |
| 4 | charter §B | `exclusiveGroup` **deleted**; **81/420**; **~130** | **not deleted** (7 occurrences); **30/420**; **123** | charter **overstates** blast radius |
| 5 | charter §D/§G/§H/§I | fixtures **82** | **135** | charter understates |
| 6 | charter §I C-25 | "PROVISIONAL until it runs" | the gate **has run** | discharged |
| 7 | chair §552.4 | attributes carry the finer distinctions | ⛔ **no fixture-attribute mechanism exists** | **rule was unimplementable — ruling 1 fixes it** |
| 8 | chair §551.6 → the rewrite | `count(furnace where flued) ≤ flueCount` | ⛔ `flueCount` = **0 of 2,185 src files** | **ruling broke; ruling 2 fixes it** |
| 9 | charter / architecture | DW-1b **4 arms / +4** | **7 arms / +7**; wave 30 → **33** | charter understates |
| 10 | architecture | DW-1a/1b **"DECLARED SHIFT: NONE"** | they move a byte-pinned public artifact | architecture wrong, **charter right** |
| 11 | architecture `:1568` | DW-1c/1d/1e/**1f** parallel | charter §F.4 serializes 1f — **unlogged in §I** | unlogged conflict |
| 12 | charter paths | `interiorTemplates.js` etc. | `src/domain/**interior/**…` — **5 line-numbered sites** | false-absence hazard |
| 13 | chair §551.9 | 147 belong to other vocabularies | only **55**; 73 ENVELOPE, 19 nowhere | **chair over-counted by 92** |
| 14 | dispatch | resize B11 by the 147 | 53 add **1**; resize is 20 → **36** across **9** vocabularies in **2** arms | cheaper in names, dearer in shape |
| 15 | dispatch premise | DW-1 gated on CH-6 | ⛔ **REFUTED** — artifact byte-identical across the gap; CH-6's file not a generator input; CH-5 moved 0 name keys; **control fires** | **premise withdrawn by the chair** |
| 16 | my own first hypothesis | CH-6 and DW-1a/1b collide on the compendium artifact | **REFUTED by the same measurement** | **my hypothesis wrong — recorded** |
| 17 | draft L826 / L851 | `~55` circulation, `~35` storage sub-forms | naive distinct **86** / **69** — both **understated** ⚠ signal, not ruled | draft understates |

✅ **Closed since first report:** `LANE-LAW.md`'s stale census tuple — re-stamped by the chair to
`21026/5848`, packets 179, slot `c3289244d`.

---

## §11 · WHAT I DID NOT DO

1. **No repo writes, no worktree, no vitest, no `npm run check*`, no packet, no commit, no pin, no push.**
2. **I did not amend the charter.** All sites named by line, none edited.
3. **I did not adjudicate the ENVELOPE** (§6.1) — costed at sample grade with a stated range.
4. **I did not rule the ENVELOPE's CAR** (§6.3) — (a) recommended, J-DW0-2 named as the explicit cost.
5. **I did not rule C-19's integers** (§7.3) — first-pass signal only, marked as such.
6. **I did not extend the granularity rule further.** The gate's Reading B (striking `bier`,
   `touchstone`, `die/stamp`, `mould`, `scrutiny urns`) was offered and refused by the chair; not revived.
7. **I did not re-run the fixture gate** — re-derived its arithmetic from its own artifacts and
   confirmed every figure.
