# Catalog hygiene / MF-CH2A — THE MAGIC LICENCE, DECLARED: 28 arcane rows stop being classified by the shelf an author filed them on, and the four tokens the magic dial already emits become one vocabulary

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `5055990a38a281b5a5f63648c74e65c0837de7ef`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-2**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`**
  (owner directive **ODQ §484**). Second car of the catalog-hygiene train, and the first of a
  **serial pair** — `MF-CH2B` makes the five gates read what this car declares.
- **Charter and rulings:** `draft-CATALOG-HYGIENE-PLAN.md` §2 (CH-2), as re-shaped by the CH
  skeptic panel and the chair at **ODQ §501.4, §503.2 and §505**. Everything below is
  re-derived by this lane at its BUILD base `b2852ccc3cc4753499996da6582dd672e90499d0`, which is
  what every figure below was executed at; the **Verified base** above was RE-STAMPED to the
  landing slot `5055990a` by lane TE-STACK-1 at the act (§410), which re-based this member and
  carry-proved every one of its blobs identical. Where a charter figure is carried it says so and names
  the re-derivation; **four charter/panel figures are CORRECTED here by execution** (§0.2).

---

## §0 · THE THREE THINGS THAT DECIDE THIS CAR'S SHAPE

### §0.1 · The measurement law it runs under (ODQ §503.2, second law)

> **Any catalog-row key addition reds `generatorGoldenMaster` because `assembleInstitutions`
> SPREADS the row onto the record.**

This car adds a key to 28 catalog rows. It is therefore a **DECLARED golden-re-record car**,
priced before the first edit rather than met as a surprise at the first battery. §4 states the
shift, proves it is a key ADDITION and nothing else by a whole-corpus path-template diff, and
§6 records it in the golden's own SHIFT RECORD as that file's docstring law requires.

### §0.2 · Four figures corrected at this base, each by execution

| # | the claim as it reached this lane | measured here | where |
|---|---|---|---|
| C1 | H21/V18: `nativeInstitutionRequiresMagic` (P5) strikes **26** catalog rows, by unanchored NAME substring | **26 is the keyword arm alone. P5 is a SHELF gate at its live call shape** — every `allowsInstitution` call site spreads `category` onto the record (`assembleInstitutions.js:268/410/484`, `cascadeGenerator.js:180`, `cascadePass`, `coherenceRepairPass`, `factionCorrelationPass`), and `carriesExplicitMagicMetadata` reads `entity.category === 'magic'`. Measured with the real record shape, the world law strikes **all 28** Magic/Exotic rows at `magicExists:false`, not 26 | §2 arm A7, executed |
| C2 | H16/V24/G4: the `Adventurers' charter hall` "appears 16 times at `magicExists:false` and is INVISIBLE in the grid" — the estate's one measured generation-versus-UI divergence | **REFUTED at row level on this grid.** The 23 halls generated at `magicExists:false` are the **town/Adventuring** row (`institutionalCatalog.js:1394`), which `filterCatalogForMagic` does not touch. Traced by provenance: `source: 'generated'`, `category: 'Adventuring'`, all 23. Row by row over all 311 entries the UI grid and the world law **already agree on every Magic/Exotic row**; the only 5 disagreements are content-profile denials (`Slave market` ×2, `Slave market district`, `Kidnapping ring`, `Human trafficking network`) and have nothing to do with magic | §0.3 |
| C3 | §2(a): the licence is declared on 28 rows | **CONFIRMED — 28 (Magic 21 + Exotic 7) of 311, 25 distinct names.** And a measurement the charter did not make: the 28 are **exactly** the set that ANY of the six magic surfaces treats as magic. Rows outside the two shelves that some magic gate nonetheless catches: **ZERO** | §1.2 |
| C4 | §2(e): the working model moved **361 of 2,100** magic cases (273 without the P2 arm) | not reproducible as stated — that model bundled the declaration and all four probability gates. Re-derived over **this** lane's grid (the golden master's own **504** = 6 tiers × 12 cultures × 7 terrains, × 5 magic cases = **2,520**) and **split across the serial pair**: MF-CH2A moves **0 rosters**; MF-CH2B moves **1,025** | §4, and MF-CH2B §4 |

### §0.3 · G4, re-measured — the divergence is not where the charter put it

The charter's G4 says generation and the UI disagree about the charter hall. Executed at this
base with `magicEnabled=false` and maritime supported (so the maritime denial cannot
contaminate the reading), over all 311 rows:

```
ROWS 311   DISAGREEMENTS 5
  town/Economy/Slave market            UI=true  LAW=false
  city/Economy/Slave market            UI=true  LAW=false
  city/Economy/Slave market district   UI=true  LAW=false
  city/Criminal/Kidnapping ring        UI=true  LAW=false
  city/Criminal/Human trafficking network  UI=true  LAW=false
```

**No Magic or Exotic row disagrees.** The two surfaces are already in lockstep — because both
read the same shelf. What is wrong is not that they disagree; it is that they agree on the
wrong thing, and the divergence the charter reached for is a TIER divergence rather than a
surface one: the same institution NAME is offered at town (Adventuring shelf) and refused at
hamlet and village (Magic shelf) in the same magic-free world.

That correction does not weaken the car — it sharpens what MF-CH2B has to prove. The
invariant worth pinning is not "the two surfaces will now agree", which they already do; it is
**"they still agree, row by row, after both of them stop reading the shelf"** — one read, two
surfaces, and the agreement count unmoved at 5 while both sides move by 9 rows. That is
MF-CH2B's arm B4.

---

## §1 · WHAT THIS CAR IS

### §1.1 · Three production files, and the seam

| file | what changes |
|---|---|
| `src/data/constants.js` | the licence LADDER — `MAGIC_LICENCE_LEVELS`, `normaliseMagicLicence`, `magicLicenceAtLeast` — beside `getMagicLevel`, whose four tokens they are |
| `src/data/institutionalCatalog.js` | `magicLicense: '…'` on the 28 Magic/Exotic rows |
| `src/domain/arcaneInstitutionIdentity.js` | the name index `MAGIC_LICENCE_BY_CATALOG_NAME`, the reader `institutionCatalogMagicLicence`, and the ONE routing edit: `isArcaneInstitution` consults the declared licence before the authored tag |

**THE SEAM, and why it falls here.** The charter measured CH-2 at five production files and
proposed splitting after `institutionProbability`. This lane re-measured at **six** — the
charter's five plus a home for the ladder — and cut the train differently, because the
validator's change-path reservation makes the seam a hard constraint rather than a preference:
**two non-terminal packets may not name the same path**, so a shared file forecloses minting
the second car until the first has LANDED (§471). The cut below is path-disjoint, so both
packets can sit READY at once:

* **MF-CH2A — the declaration.** Data and the reader. Zero rosters move.
* **MF-CH2B — the gates.** `institutionProbability.js` · `generationContext.js` ·
  `magicFilter.js`. Every behavioural change in the car lives here.

Three files each. The split also separates the two shifts so each is attributable on its own:
this car's is a key spread onto the record and nothing else, and MF-CH2B's is the roster
delta with no key in it.

### §1.2 · The 28 rows are exactly the live surface

Executed over all 311 catalog rows against every magic surface (`P1` the multiplier, `P2`
`hiMagicInsts`, `P3` the exotic scaler, `P4` `isArcaneInstitution`, `P5` the world law, and
`filterCatalogForMagic`):

```
ROWS 311   TOUCHED_BY_SOME_MAGIC_GATE 28
NON-Magic/Exotic shelf rows that some magic gate treats as magic: 0
```

So the charter's question — "plus any other row a gate treats by shelf, find them" — has the
answer **none**, and it is a measurement rather than an assumption. The eight name substrings
in `P1` and the 39 keywords in `ARCANE_INST_KW` reach nothing outside the two shelves, and
`priorityCategory: 'magic'` appears on 13 rows, all of them already Magic-shelf. The licence
on 28 rows therefore covers the entire live surface with nothing left over.

---

## §2 · S0 — THE BASE, READ BEFORE THE FIRST EDIT

| # | instrument | reading at `b2852ccc3` | verdict |
|---|---|---|---|
| 1 | the observed-shape instrument, part 1 | `node scripts/check-observed-shape-readers.mjs` → TRUE_EXIT **1**, **159 B**, SHA-256 `c5b67844abe51226f4c6862ae485dc5d9fa1e51148c70b4bd021e661f1ae0854`. The SAME command in the chair's baseproof worktree `chair-baseproof-b10ed1a1` (HEAD `b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d`, its own `node_modules`, its own TMPDIR): TRUE_EXIT **1**, **159 B**, the same digest, **`cmp` exit 0**; that worktree's porcelain read 0 lines before and after | PRE-EXISTING BY LOOKUP (schema-10 mint class, not this car's) |
| 2 | the observed-shape instrument, part 2 | the reader walker `tests/lint/observedShapeReaders.walker.test.js:737` — `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }`, GREEN by execution at this member's tip (§6) | UNMOVED |
| 3 | the generator golden | `tests/fixtures/generator-golden-master.json` SHA-256 `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` before the first edit | **DELIBERATELY RE-RECORDED** — §4, §6 |
| 4 | the census tuple | `tests/lint/sovereigntyLightingContract.walker.test.js:6109` — `files: 2516, parked: 366, credited: 2150, titles: 20863, suiteTitles: 5808` | walked at §6, reverted digest-exact, the row rides to the landing act (§417) |
| 5 | the ruin roster | `tests/lint/ruinFilterRoster.walker.test.js:376` reads **92** at this base. This car adds no `.institutions` reader in `src/domain` — `arcaneInstitutionIdentity.js` walks the catalog table, not a settlement roster — so no exempt-or-route disposition and no count raise is owed | UNMOVED, proved by execution (§6) |
| 6 | the size baseline | `scripts/.size-baseline.json` carries **no row** for any of the three files. `src/data/**` has no `max-lines` rule at all; `src/domain/**` is `max-lines` 800 with `skipComments`, and `arcaneInstitutionIdentity.js` is **92 effective lines** after the edit (242 raw, the delta almost entirely comment) | CLEAR |
| 7 | the edge-bundle rosters | **BOTH** `src/data/institutionalCatalog.js` and `src/data/constants.js` are inputs of the same three of the five: `aiCharterBundle`, `aiGroundingBundle`, `aiOutputSchemaBundle` (`grep -l` over `supabase/functions/_shared/*.meta.json`) ⇒ `npm run build:edge-shared` runs in this member's commit, all five `.meta.json` commit as a set, and `tests/edgeFunctions` joins the sweep (§475) | OWED, PAID (§6) |
| 8 | `validate:packets` at base | `[implementation-packets] valid: 169 packets (0 READY)`, TRUE_EXIT 0, run in a clean detached worktree at this base | GREEN |
| 9 | change-path reservation (§471/§480) | **zero non-terminal packets** in the manifest at this base (169 = 168 LANDED + 1 SUPERSEDED), so nothing this car names is reserved. **What this car RESERVES:** the three production files above, `tests/lint/magicLicenceCensus.walker.test.js`, `scripts/mutation-coverage-manifest.json`, `tests/fixtures/generator-golden-master.json`, `tests/property/generatorGoldenMaster.test.js`, its own packet, and the five edge artifacts. MF-CH2B reserves a DISJOINT set — checked path by path | CLEAR |
| 10 | the mutation-coverage census | `scripts/mutation-coverage-manifest.json`'s TOTALITY arm enumerates every test file under the seven ENFORCER DIRS, and `tests/lint` is one. The new walker owes an entry. **GREEN at the clean base, RED at this member's tip — attributed by execution, not assumed** | OWED, PAID as a `rationale` (§6) |
| 11 | the family cost | `catalog-hygiene` already exists — MF-CH1 admitted it at ODQ §507. This car costs the packet `.md`, its manifest entry and its INDEX row, and no code change | NIL |
| 12 | the banked failing set | **SEVEN**, cited from **ODQ §507.3 / §509.1** rather than re-derived (chair throttle, ODQ §511.2). This lane classifies its OWN reds by assertion-block sha against the chair baseproof; it does not re-count the seven | CITED, NOT RE-PROVED |

---

## §3 · THE 28-ROW LICENCE TABLE, AND WHERE EACH VALUE COMES FROM

`magicLicense` is **the weakest world the entry is licensed for**, in the four tokens
`getMagicLevel(priority)` emits for a world. That reading is what makes one comparison
(`magicLicenceAtLeast(rowLicence, getMagicLevel(dial))`) answer the whole question, and it is
also the reading R-INST-6 uses when it writes "where a world's `magicLicense` is HIGH" — a
sentence that only parses if the field names a world level. The field's four values are
lower-case because `constants.js:37-41` emits them lower-case; §491's uppercase spelling is
corrected here, as the charter already ruled.

**Source: R-INST-5 §Σ.3's 32-entry verdict table, restricted to the two gated shelves.** The
four rows it rules that this car does NOT carry a field on — `Adventurers' charter hall` at
town, `Charlatan fortune tellers`, `Beast trainers`, `Multiple adventurers' guilds` — sit on
the Adventuring shelf, which §1.2 measured no magic gate reads. All four are ruled NONE, which
is why the dossier's `NONE 11` becomes `none 7` here and the arithmetic closes: 11 − 4 = 7.

| # | tier | shelf | row | licence | source | corroboration |
|---:|---|---|---|---|---|---|
| 1 | hamlet | Magic | Traveling hedge wizard | `low` | R-INST-5 §Σ.3 row 1 | — |
| 2 | hamlet | Magic | Adventurers' charter hall | **`none`** | row 2 | R-INST-5 §sec-I: "the second `NONE` in the tranche" |
| 3 | village | Magic | Hedge wizard | `low` | row 3 | — |
| 4 | village | Magic | Druid Circle | `low` | row 4 | R-INST-5 §sec-E: "the lowest in the tranche, a grove needs no infrastructure" |
| 5 | village | Magic | Adventurers' charter hall | **`none`** | row 5 | as row 2 |
| 6 | village | Magic | Healer (divine, 1st level) | `low` | row 6 | — |
| 7 | town | Magic | Wizard's tower | `medium` | row 7 | — |
| 8 | town | Magic | Elder Grove Council | `low` | row 8 | — |
| 9 | town | Magic | Alchemist shop | **`none`** | row 9 | R-INST-5 §sec-B: "the family's most consequential licensing finding" |
| 10 | town | Magic | Warden's Lodge | **`none`** | row 10 | R-INST-5 §sec-I: "`magicLicense: NONE` for the lodge and the charter hall" |
| 11 | town | Magic | Teleportation circle | `high` | row 11 | R-INST-6 §5 fantasy note treats a teleportation circle as HIGH-world content |
| 12 | city | Magic | Wizard's tower | `medium` | row 15 | agrees with row 7 |
| 13 | city | Magic | Mages' guild | `medium` | row 16 | R-INST-5 §sec-C: "MEDIUM for the chapter hall, HIGH for the academy and the district" |
| 14 | city | Magic | Alchemist quarter | **`none`** | row 17 | as row 9 |
| 15 | city | Magic | Enchanter's shop | `high` | row 18 | R-INST-5 §sec-D |
| 16 | city | Magic | Scroll scribe | `medium` | row 19 | R-INST-5 §sec-D |
| 17 | city | Magic | Teleportation circle | `high` | row 20 | agrees with row 11 |
| 18 | city | Exotic | Planar traders | `high` | row 22 | R-INST-5 §sec-J: "both planar rows … in the engine's hard-zero list" |
| 19 | city | Exotic | Dragon resident | **`none`** | row 23 | R-INST-5 §sec-K: "`NONE` for `Dragon resident` too"; the engine's own `NON_MAGIC_EXOTICS` agreed |
| 20 | city | Exotic | Golem workforce | `high` | row 24 | R-INST-5 §sec-G: "both are in the engine's own hard-zero list below `priorityMagic` 66" |
| 21 | city | Exotic | Undead labor | `high` | row 25 | as row 20 |
| 22 | city | Exotic | Dream parlors (high magic) | `high` | row 26 | the name says so |
| 23 | city | Exotic | Airship docking (high magic) | `high` | row 27 | the name says so |
| 24 | city | Exotic | Message network (high magic) | `high` | row 28 | **R-INST-6 §8 fantasy note**, the one place the criminal tranche speaks to this row: the mundane `Rookery` survives beside it only at the bottom of the market "where a world's `magicLicense` is HIGH" |
| 25 | metropolis | Magic | Academy of magic | `high` | row 29 | R-INST-5 §sec-C |
| 26 | metropolis | Magic | Mages' district | `high` | row 30 | R-INST-5 §sec-C |
| 27 | metropolis | Magic | Great library | **`none`** | row 31 | R-INST-5 §sec-J: "`NONE` for the `Great library`, which is authored `education`" |
| 28 | metropolis | Magic | Planar embassy | `high` | row 32 | R-INST-5 §sec-J |

**Distribution, counted off the CATALOG:** `none 7 · low 5 · medium 4 · high 12` = 28.

### §3.1 · The R-INST-6 cross-check, executed rather than asserted

The charter says the two tranches share zero rows and that the cross-check therefore has no
subject. Re-run here: R-INST-5's 32 names and R-INST-6's 28 names intersect in **nothing**, so
no licence value is contradicted. But the charter stopped one step early — R-INST-6 speaks to
the licence **three times**, and two of the three name a row on this table:

* §sec-A(i): "if a world's `magicLicense` is HIGH, the Goldsmiths'-warning countermeasure gets
  stronger" — a WORLD-level reading, no per-entry verdict;
* §sec-C(i): "in a HIGH world the bypass problem changes character … a teleportation circle
  beside a toll" — corroborates rows 11 and 17 as HIGH;
* §sec-G(i): the `Rookery`/`Whisper market` boundary against `Message network (high magic)`
  (city L2187) — corroborates row 24 as HIGH.

**Zero contradictions, two corroborations, and one finding the charter missed:** R-INST-6 reads
`magicLicense` as a property of the WORLD while R-INST-5 declares it per ENTRY. Both readings
are satisfied by the definition this packet adopts — the entry's value is the weakest world
level it is licensed for — and stating that reconciliation is what stops a later author from
putting a world dial in a catalog row.

---

## §4 · THE DECLARED SHIFT

### §4.1 · Rosters: ZERO. Record hashes: 657 of 2,520

Measured over the golden master's own grid × the five magic cases: 6 tiers × 12 cultures × 7
terrains = **504**, × {`magicExists:false`, `priorityMagic` 0 / 20 / 50 / 80} = **2,520**
settlements, generated through `generateSettlementPipeline(cfg, null, { seed, customContent })`
with each terrain paired to its terrain-honest route.

| magic case | settlements | rosters changed | record hashes moved |
|---|---:|---:|---:|
| `magicExists:false` | 504 | **0** | 0 |
| `priorityMagic:0` | 504 | **0** | 0 |
| `priorityMagic:20` | 504 | **0** | 57 |
| `priorityMagic:50` | 504 | **0** | 276 |
| `priorityMagic:80` | 504 | **0** | 324 |
| **total** | **2,520** | **0** | **657** |

⚠ **The denominator is 504, not the charter's 420.** The charter's grid used a 10-culture list;
`CULTURE_PROFILE_KEYS` plus the `mediterranean` compatibility alias is **12**, which is the
golden master's own grid and therefore the one a golden re-record has to be reasoned about on.

### §4.2 · Proven to be a key ADDITION and nothing else

All 504 grid settlements were regenerated as OBJECTS at the clean base (a separate detached
worktree at `b2852ccc3`, its own `node_modules`, its own TMPDIR) and at this member, then
deep-diffed field by field with array indices collapsed to `[*]`. The complete census of
differing path templates is **TWO**, and every one of them is an ADDITION:

```
ROWS 504   ROWS_MOVED 276
DIFFERING PATH TEMPLATES: 2
  $.institutions[*].magicLicense                             added=573  rows=276
  $.defenseProfile.institutions.magicDef[*].magicLicense     added=350  rows=252
```

Zero `changed`, zero `removed`, zero array-length moves, zero key-order moves. No name, count,
id or rng draw moved — which is the same shape ODQ §503.2's second law predicts and the reason
the roster column above is all zeros.

### §4.3 · The golden re-record

`tests/property/generatorGoldenMaster.test.js` — **297 of 525 keys move; 0 added, 0 removed.**
Re-recorded deliberately with `UPDATE_GOLDEN=1` in this lane's detached worktree, and a SHIFT
RECORD entry added to that file's docstring, which its own law requires ("Re-recording without
adding a row is a deleted alarm"). The 297 is the 276 grid rows above plus 21 of the corpus's
one-dimension sweep rows.

### §4.4 · The one behavioural edit, and the measurement that shows it is inert here

`isArcaneInstitution` now consults the declared licence before the authored tag. Over all 311
rows the two disagree on exactly **FOUR**, in **both** directions:

| row | tag | licence | `isArcaneInstitution` |
|---|---|---|---|
| `Healer (divine, 1st level)` | mundane (`divine`, `healing` are not on `ARCANE_INST_TAGS`) | `low` | **true** |
| `Alchemist shop` | arcane | `none` | **false** |
| `Warden's Lodge` | arcane | `none` | **false** |
| `Alchemist quarter` | arcane | `none` | **false** |

The healer is the interesting one and it was not predicted: the licence does not only relax,
it also CLOSES a split that already existed, because the world law's own keyword list has
always carried `'healer (divine'` while the tag read mundane.

**None of the four moves a roster, and that is measured rather than argued.**
`isArcaneInstitution` is reached only at `institutionProbability.js:302`, which runs at
`magicExists === false` — and in a dead-magic world the world law (P5) strikes all four rows
before the probability path is entered at all. The four flips become live in **MF-CH2B**, where
P5 starts reading the licence too. Arm A7 pins exactly that, and mutant M11 (making P5
licence-aware, i.e. MF-CH2B) reds it.

---

## §5 · ACCEPTANCE — NINE ARMS, ELEVEN MUTANTS DRIVEN

`tests/lint/magicLicenceCensus.walker.test.js`, a **CREATE** row. Nine test arms against the
eight manifest cases below; A0 is the non-vacuity floor the other arms stand on and is folded
into case A1's text, as MF-CH1 did with its own A0.

Every mutant was **DRIVEN**, not described: applied to the shipped bytes, the acceptance run
alone and mutexed with the exit captured unpiped, then restored and `cmp`-proved. A clean
control ran green immediately before the first mutant and immediately after the last.

| mutant | the edit | arms it reds |
|---|---|---|
| M1 | `Great library` licence `none` → `high` | A1, A2, A5 |
| M2 | delete `Dragon resident`'s `magicLicense` line | A1 |
| M3 | `magicLicenceAtLeast` uses `>` instead of `>=` | A4, A5 |
| M4 | `normaliseMagicLicence` accepts any string | A4 |
| M5 | `MAGIC_LICENCE_LEVELS` reordered to `none, medium, low, high` | A4, A5 |
| M6 | remove the licence read from `isArcaneInstitution` | A5 |
| M7 | `institutionCatalogMagicLicence` returns `'none'` instead of `null` for an unknown name | A0 |
| M8 | `getMagicLevel`'s `'none'` token renamed | A6 |
| M9 | route `institutionCatalogArcaneTag` through the licence | A5, A8 |
| M10 | village `Adventurers' charter hall` → `low`, so a repeated name disagrees across tiers | A3 |
| M11 | make the world law licence-aware — literally MF-CH2B | A7 |

⚠ **A2 WAS VACUOUS WHEN FIRST WRITTEN, AND THE MUTANT IS WHAT SAID SO.** It counted the
distribution off the frozen table in the test file — a list compared with itself, the
pin-vacuity shape this estate has been bitten by — and M1 moved a catalog value without
reddening it. It now counts off the CATALOG, and M1 reds it.

---

## §6 · THE CENSUSES, THE BUNDLES AND THE GATES

*Every exit below was captured with **no pipe**, and every battery ran under the shared gate
mutex with workers capped (`--pool=threads --maxWorkers=2`, ODQ §511.1 as corrected — see
§7's J-TECH2-9).*

- **The acceptance:** `tests/lint/magicLicenceCensus.walker.test.js` — `Test Files 1 passed (1)`
  / `Tests 9 passed (9)` / **TRUE_EXIT 0**.
- **Eleven mutants, all DRIVEN** (§5), each restored and `cmp`-proved, with a clean control
  green immediately before the first and immediately after the last in both drives.
- **The census row, WALKED here rather than carried (§417/§420/§457/§469/§480.2):** the base
  read `2516/366/2150/20863/5808`; the delta **`+1/+0/+1/+9/+1`** re-derives to
  **`2517/366/2151/20872/5809`**, every moved figure read off the arm's own failure message in
  assertion order and never computed (`expected 2517 to be 2516` → `expected 2151 to be 2150` →
  `expected 20872 to be 20863` → `expected 5809 to be 5808`), with the arm GREEN at step 5.
  ⭐ `parked` **PASSED UNMOVED at 366** on the iteration between `files` and `credited`, which
  is the receipt that the new walker is CREDITED rather than an inference from its shape. The
  file is then reverted `cmp`-exact and **the row rides this packet to the landing act**; the
  revert itself is the negative control, because the arm reds again at `expected 2517 to be
  2516`.
- **THE THREE CENSUSES A NEW `tests/lint` FILE OWES, all three executed.** The lighting census
  (walked above); `tests/lint/mutationCoverageManifest.test.js` TOTALITY, which this member
  cures in-train as a `rationale` row — **GREEN at the clean base and RED at this tip before
  the cure, attributed by execution rather than assumed**; and
  `tests/lint/negativeAssertionAnchor.walker.test.js`, which does not red for a `tests/lint`
  file because it is scoped to generation-facing roots — proved by running it, not reasoned
  from its scope. `tests/lint/controlBytes.test.js` rides beside them.
- **C0.** Every file this lane authored or edited scanned for control bytes and tabs: **0 and
  0** on all nine, with the detector proved live on a synthetic U+001F.
- **The generator golden.** `29c6cc8fd0573a37…` → **`0a2309f573fc1f4cd6377d1ee1d370bf87226887810d8f5cdcb15282cbebabc7`**,
  re-recorded with `UPDATE_GOLDEN=1` in this detached worktree. `tests/property` at the
  re-recorded fixture: **`Test Files 101 passed (101)` / `Tests 643 passed (643)` / TRUE_EXIT 0**.
- **`build:edge-shared` (§475).** Run in the member commit, TRUE_EXIT 0. Three `sourceHash`
  values moved (`aiCharterBundle` `d10dc5a1753bb224` → `e35312f704bfe73e`, `aiGroundingBundle`
  `74c1e8a2d91b00ea` → `2313ad5f7ea40070`, `aiOutputSchemaBundle` `8ac93ac85a31f5c0` →
  `bf750f7c04356204`) and two moved only `generatedAt` (`analyticsEvents`, `intentAtlas`); all
  five `.meta.json` commit as a set per the `6ecac22a4` precedent, and `tests/edgeFunctions`
  joins the sweep.
- **Both typecheckers, verbatim.**
  `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` TRUE_EXIT 0
  `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` TRUE_EXIT 0
- **eslint** over the four authored/edited source and test files: **empty output, exit 0**;
  `--fix-dry-run` likewise **empty output, exit 0**.
- **`validate:packets`:** `[implementation-packets] valid: 170 packets (1 READY)`, TRUE_EXIT 0.
- **CLAIM_RE** (`tests/docs/enforcement-claims.test.js`'s exact regex) over every ADDED
  `docs/**` line (261 of them), over the whole new packet, over every ADDED `src/**` line and
  over the new test file: **0 matches on all four**, with the regex proved live on a synthetic
  claim sentence.
- **The banked failing set is SEVEN**, cited from **ODQ §507.3 / §509.1** rather than
  re-derived (chair throttle §511.2). This lane classifies only its OWN reds.

---

## §7 · JUDGMENTS AND DEFERRALS

**J-TECH2-1 — THE SEAM, cut differently from the charter's.** *Decided:* MF-CH2A =
`constants.js` + `institutionalCatalog.js` + `arcaneInstitutionIdentity.js` (declaration and
reader); MF-CH2B = `institutionProbability.js` + `generationContext.js` + `magicFilter.js`
(the gates). *Why:* re-measured at **six** production files, not the charter's five — the
charter had no home for the ladder — so a split is still owed. This cut is path-disjoint on
the SOURCE side and, more importantly, it separates the two shifts so each is attributable on
its own: this car's is a key spread with **zero** rosters moved, and MF-CH2B's is a roster
delta with no key in it. The charter's seam (J-CH-2-2) put a behavioural gate inside the
declaration car and would have made one blur of both. *Rejected:* the charter's seam; and a
single six-file car, which doubles the ≤3 ceiling. *Reversal:* merge the two packets before
minting. *Blast radius:* two golden re-records instead of one, which is what forces
J-TECH2-6.

**J-TECH2-2 — THE LADDER LIVES IN `src/data/constants.js`.** *Decided:* beside `getMagicLevel`.
*Why:* it is the definition site of the four tokens, so "never re-typed" is literally true; it
is a **zero-import** data leaf, so the lazily-bundled `magicFilter` can read it with no chunk
risk at all — the eager/lazy edge that made `dist` un-bootable in lane BT is the reason this
mattered; and it is already an input to the same three edge bundles as the catalog, so it adds
no new bundle obligation. *Rejected:* `arcaneInstitutionVocabulary.js` (works, but puts a
comparison ladder in a vocabulary leaf) and a new leaf (a seventh file and a new chunk node).
*Reversal:* move three exports.

**J-TECH2-3 — THE DECLARED LICENCE OUTRANKS THE AUTHORED TAG, IN `isArcaneInstitution` ONLY.**
*Decided:* the licence answers where it exists; `institutionCatalogArcaneTag` keeps reading the
tag. *Why:* R-BLD-5 ruled the tag the authored semantics, and a licence is the same authored
semantics at four rungs instead of one bit, so it is a refinement rather than a contradiction —
but `customContent.js` classifies USER-authored names through the tag reader, where a catalog
licence has no standing over a name a player typed. Keeping the two apart is also what keeps
`tests/domain/arcaneIdentity.test.js`'s whole-catalog arm ("the tag reading matches the authored
tags for every catalogued institution") honest rather than amended. *Rejected:* routing the tag
reader through the licence too, which reds that arm on three rows and silently re-classifies
custom content. *Reversal:* two lines. *Blast radius:* four rows, measured, both directions.

**J-TECH2-4 — THE P2 ARM IS SPLIT OUT OF THE TRAIN AND CARRIED TO THE CHAIR.** *Decided:*
MF-CH2B ships G7's literal cure only (three keywords out of `hiMagicInsts`, each measured at 0
catalog matches) and leaves the list a NAME list. *Why:* the licence form
(`magicLicenceAtLeast(name,'high')`) hard-zeroes the enchanter, the academy and the mages'
district below `priorityMagic` 66 — a decision about what a low-magic city CONTAINS, which is
content work and not hygiene, and the biggest single same-seed term in the charter's own model.
The CH skeptic panel flagged it and the lane brief ordered it split. *Reversal:* one line in
P2. *This is a chair item, not a lane one.*

**J-TECH2-5 — MF-CH2B SHIPS THE FULL LICENCE AT P5 (1,025 of 2,520), WITH THE ALTERNATIVE
PRICED.** Recorded here because it is the pair's largest consequence. *Rejected:* Design B,
keeping the unanchored keyword veto inside the world law — measured at **545 of 2,520**, and
refused because it leaves the world law deciding by an unanchored substring and leaves an
alchemist's shop banned from a world with no magic in it. *Reversal:* one hunk in
`nativeInstitutionRequiresMagic`.

**J-TECH2-6 — THE PAIR IS SERIAL-MINTED, AND THAT IS FORCED RATHER THAN CHOSEN.** Both cars
re-record the generator golden (297 keys here, then a further **92** between this tip and
MF-CH2B's), so both name `tests/fixtures/generator-golden-master.json` and
`tests/property/generatorGoldenMaster.test.js`, and two non-terminal packets may not name one
path (§471). **Any** split of CH-2 produces two golden-moving cars, so this is a property of
the work and not of the seam. *Decided:* MF-CH2A mints READY now; MF-CH2B's packet ships in
its own commit with its manifest entry and INDEX row **written out for the landing lane to
apply once this car is LANDED**. *Proved by execution, not assumed:* an orphan packet `.md`
with no manifest entry does **not** break `validate:packets` — run in a tree holding
`MF-CH2B.md` unregistered, `valid: 169 packets (0 READY)`, exit 0.

**J-TECH2-7 — THE ELEVEN-TREE SWEEP RUNS ONCE, AT THE PAIR'S TIP.** *Why:* chair throttle
§511.3, on a box whose load average reached 44 with four lanes contending. *What covers this
car's own tip instead:* its acceptance, all three censuses, `tests/property` whole, both
typecheckers, eslint, and the §489.3 consumer arm widened by shape to **121 test files** —
which includes every direct reader of the three files this car edits. *The risk, named:* a
test that THIS tip reds and MF-CH2B un-reds would not be visible in a sweep taken only at the
pair's tip. The consumer arm is the mitigation and it is where such a test would live.

**J-TECH2-8 — `filterServicesForMagic` STAYS ON THE KEYWORD VOCABULARY** (MF-CH2B's file, ruled
here because it is the same decision). *Why:* it is handed service names rather than catalog
rows, no shelf read has ever reached it (it passes `''` as the category), and it has **zero**
production callers in `src/` — measured. A name lookup would pull the 2,500-line catalog into
the lazy bundle's chunk to change a function nothing calls. *Reversal:* pass the row and take
the fourth argument.

**J-TECH2-9 — THE CHAIR'S THROTTLE FLAG WAS INVALID AND THIS LANE SUBSTITUTED THE WORKING ONE.**
`--poolOptions.threads.maxThreads=2` and `--minWorkers` do not exist in vitest 4.1.8; both
raise `CACError: Unknown option` and exit **1 with zero tests collected** — the §507.5
false-signal family with the sign flipped, and a shape a lane could easily read as a red in its
own member. Every battery here and every `checks` row in the manifest uses
`--pool=threads --maxWorkers=2`, which is the only worker-count flag vitest 4.1.8's own
`--help` lists and which this lane verified by execution (`Test Files 1 passed (1)`, exit 0).

**DEFERRALS — written down so nobody re-finds them as bugs.**

* **D-1.** The P2 licence form (J-TECH2-4). Chair item, measured, not built.
* **D-2.** `Dragon resident` returns **0 instances at every one of the five magic cases on this
  grid, including `priorityMagic:80`**, so this lane has NO positive control for that row. The
  CH skeptic panel's control stands (0 at dead-magic, **11 at pm50**) on its own five-seed grid.
  A lane that needs to pin that row must widen the seed axis; the single-seed golden grid cannot
  see it.
* **D-3.** The four Adventuring-shelf rows R-INST-5 also rules NONE carry no field, because no
  magic gate reads their shelf. One of them — the town `Adventurers' charter hall` — inherits
  `none` through the name index anyway, which A3 declares. Giving the other three
  (`Charlatan fortune tellers`, `Beast trainers`, `Multiple adventurers' guilds`) an explicit
  field is a data-only addition a later car can make.
* **D-4.** Five shelf reads survive across the four gate files, each marked
  `@non-catalog-fallback MF-CH2` and counted by MF-CH2B's arm B2. They exist because a player
  filing their own institution under `Magic` has declared something. Removing them would mean
  giving custom content its own licence field — recorded, not done.
* **D-5.** `magicLicense` now rides onto every settlement record (573 + 350 key additions) and
  **nothing downstream reads it**. It is not stripped in `assembleInstitutions`, because
  special-casing the spread is precisely the kind of divergence this train exists to remove.

---

## §8 · THE LANDING SLOT (TE-STACK-1, 2026-08-24 — slot `5055990a`, the MF-CG1 landing; CAR 1 of 2)

**THIS IS THE FIRST STACKED LANDING SINCE #40.** Landings 41–48 were eight singletons in eight
gates (ODQ §516). This member and `MF-UC5` land through ONE gate, in one act, because their change
paths are disjoint: `comm -12` over the two members' path lists returns exactly
`docs/implementation/INDEX.md` and `docs/implementation/PACKET_MANIFEST.json` and nothing else.
The lighting census walker is in NEITHER member's diff — both deferred their row under §417 — so
the overlap is a strict subset of what the stack law allows.

**A REBASE WAS OWED AND WAS PERFORMED.** This member built on `b2852ccc` (the MF-CH1 landing) and
held at `90a12cd1b09278319c38324280d3fadc118006a3`; the slot ref had moved to `5055990a` (MF-CG1,
the 48th landing). `git rebase --onto 5055990a b2852ccc 90a12cd1` — the packet commit CONFLICTED in
`INDEX.md` and `PACKET_MANIFEST.json`, both keep-both appends against CG-1's own rows. Resolved by
taking the slot side (proved equal to the slot blobs `edc9dfb8f1` and `08f7e1bd48`, not assumed) and
splicing this member's row and entry back programmatically; the spliced manifest entry deep-equals
the holding blob's, and all 170 slot entries are preserved in order.

**CARRY-PROOF AT BLOB LEVEL.** Every one of this member's SIXTEEN non-shared paths is
blob-identical at the stacked tip to its holding: the packet, `scripts/mutation-coverage-manifest.json`,
the three production files, the eight edge artifacts, the golden fixture, the declaration walker and
`tests/property/generatorGoldenMaster.test.js`. Only `INDEX.md` and the manifest moved. The
instrument was controlled, not trusted: `git rev-parse "${sha}:${path}"` ECHOES an unresolvable
argument and exits 0, so every reading used `--verify -q` and a nonexistent path was read at every
hop and returned ABSENT. `package.json` `2b5ec2014c` and `package-lock.json` `1a8a80b12b` are
identical at slot and tip, so NO MINT TRIGGER was crossed.

**⚠ THE HOLDING RECEIPT NAMED A SHA THAT DOES NOT EXIST.** `laneTECH2-receipt.md`'s FINAL STATE line
gives this member's tip as `90a12cd1b0dc47b1b3fbf24bfd47ef27b9c39e30`; `git rev-parse --verify -q`
REFUSES that object. The real tip is `90a12cd1b09278319c38324280d3fadc118006a3`. The two agree to ten
hex characters, which is why a short-sha eye-check would have passed it — a transcription error, not
a collision, and the landing used the pinned ref rather than the receipt's prose.

**THE §410 THREE-PLACE FLIP**, each place read back through the validator's own parser: the manifest
row (`status` READY → LANDED and `verifiedBase` RE-STAMPED to the slot), this packet's Markdown
header, and the INDEX STATUS column reached through the manifest's `indexPath`. Twelve
`requiredSymbols` rows, every one a symbol or an export marker — no count, no figure, no migration
head — so nothing in them needed re-stamping and the validator asserts them status-blind.
`[implementation-packets] valid: 172 packets (0 READY)`, exit 0. FOUR non-vacuity controls on this
member, each with its own distinct refusal and each restore `cmp` 0: the manifest status back to
READY ("status disagrees with index" AND "with packet Markdown"), the Markdown header back
("disagrees with packet Markdown"), the INDEX marker back ("disagrees with index"), and
`verifiedBase` back to the build base ("verifiedBase disagrees with packet Markdown").

**⚠ THE INDEX-CELL HAZARD IS SHARPER THAN §513.2 STATES.** `parseIndexPacketStatuses` does not take
the first status word by POSITION in the cell — it iterates `PACKET_STATUSES` in the ARRAY's own
order, `['BLOCKED','DRAFT','LANDED','READY','STALE','SUPERSEDED']`, and returns the first member
found ANYWHERE in the cell. So a stray `READY` in prose cannot beat `LANDED`, but a stray `DRAFT` or
`BLOCKED` silently WOULD. This cell was written so the bold marker is the only status word in it,
and both cells were verified by EXECUTING the parser.

**TWO CLAIMS THIS ACT FALSIFIED AND CORRECTED RATHER THAN CARRIED.** (i) §0's "everything below is
re-derived at THIS base by this lane" became false the moment `verifiedBase` was re-stamped; it now
names the BUILD base `b2852ccc` explicitly and says the header was re-stamped at the act. (ii) The
INDEX cell said `MF-CH2B` "is minted at this car's landing" — it is NOT. Under ODQ §520.5 the
sibling is held by the chair, is not minted here, and has no manifest entry, no INDEX row and no
packet file at this tip; the token appears in six files as PROSE only. A LANDED row must not carry a
promise the act did not keep.

**THE GOLDEN RE-RECORD IS THIS STACK'S ONE DECLARED SAME-SEED SHIFT, AND IT IS THIS CAR'S ALONE.**
`tests/fixtures/generator-golden-master.json` moves from blob `cd8d125ef8` / sha256 `29c6cc8f…` at
the slot to blob `4bdd69f201` / sha256
`0a2309f573fc1f4cd6377d1ee1d370bf87226887810d8f5cdcb15282cbebabc7` at the tip — 297 of 525 fixtures,
caused by a catalog-row key spreading onto the record (§503.2), with the deep path-template diff
showing TWO templates and both pure ADDITIONS of `magicLicense`. Stated here because a same-seed
movement is never allowed to ride silently.

**THE CENSUS IS A SUM OF DELTAS, NEVER A TUPLE (§420).** Slot `2517/366/2151/20882/5814` → tip
`2519/366/2153/20899/5816`, of which this car's share is `+1/+0/+1/+9/+1`. Every figure was READ FROM
THE ARM'S OWN FAILURE MESSAGE in assertion order and never computed. This car's `+9` titles and `+1`
suite title are attributed BY EXECUTION, not by arithmetic: a deliberately-red probe arm read the
walker's own `parkReasonsFor` / `liveTitlesIn` / `liveSuiteTitlesIn` for
`tests/lint/magicLicenceCensus.walker.test.js` and returned
`{"inTestFiles":true,"inCredited":true,"titles":9,"suiteTitles":1,"parkReasons":[]}` — so the file is
COUNTED rather than parked, and the split against `MF-UC5`'s eight is measured rather than assumed.
The walker was restored `cmp` 0 after the probe.

**THE GATES AT THE STACKED TIP.** `[typecheck-ratchet] OK — no type regressions (173 error(s),
ceiling 173)`. `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134)`. eslint over
the touched JS exits 0 with empty output, and `--fix-dry-run` changes nothing. `build:edge-shared`
exits 0 and every one of the five `sourceHash` values is UNCHANGED, so this member's committed
bundles are still correct at the slot; only `generatedAt` churned and that churn was reverted rather
than committed. S0 part 1: `check-observed-shape-readers` exit 1, 159 B, sha256 `c5b67844abe51226…`,
`cmp` 0 against `chair-baseproof-b10ed1a1` (its porcelain empty before and after), with a one-byte
probe making the same `cmp` exit non-zero — so the comparison is live and the red is pre-existing.
CLAIM_RE counts 0 over every line this act adds, with the regex proved live on a positive control;
the C0 control-character scan reads 0 on all four touched documents with its own live probe.
