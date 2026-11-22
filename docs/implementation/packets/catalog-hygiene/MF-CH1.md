# Catalog hygiene / MF-CH1 — INFERENCE HONESTY: the ONE facet chokepoint stops reading words that are not there, and the proof is pinned at the DERIVED INTERIOR because the corpus digest cannot see it

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `00e7af612d428078634d52ea37054bd00b773ca6`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-1**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`**
  (owner directive **ODQ §484**). First car of the catalog-hygiene train.
- **Charter and rulings:** `draft-CATALOG-HYGIENE-PLAN.md` §1 (preserved at `3449e748e`,
  `charters/draft-CATALOG-HYGIENE-PLAN.md`), **as RE-SCOPED by the chair at ODQ §503.3.** The
  charter shipped CH-1 as two production files; the CH skeptic panel refuted that scoping by
  execution and the chair re-cut the car to **ONE** production file. Everything below is
  re-derived at THIS base by this lane; nothing is inherited from the charter except where a
  row says so and names the re-derivation. Three charter figures are CORRECTED here by
  measurement (§0 and §3).

---

## §0 · THE MEASUREMENT LAW THIS CAR RUNS UNDER (ODQ §503.2 — quoted, then re-executed)

**`facetOf` is called ZERO times in the generation pipeline.** The CH skeptic panel established
it with a live instrumented counter over a full corpus run. The consequence is the governing
law of this packet:

> **A whole-record corpus digest is STRUCTURALLY BLIND to every `FACET_INFERENCE` change. A
> digest that cannot fail proves nothing. A `FACET_INFERENCE` change is pinned at the DERIVED
> INTERIOR, never at the record digest.**

**RE-EXECUTED BY THIS LANE, not taken on report.** Breaking the `faith` pattern to `/./i` and
regenerating the whole corpus moves **15,101 interior cells across 504 of 504 settlements**
while the corpus digest stays **byte-identical** at
`479a7992568d5b802c0888e8bc852006afd164454fea3d4a1c7257f9dccde8ae`. The mutated file was
restored digest-exact afterwards (§6, control C3).

Everything in §4 that reads "unmoved" on the generation side is therefore a **NEGATIVE CLAIM
ONLY**, and it is stated with this law beside it so no successor reads it as evidence that the
change works. The evidence that the change works is §3 and §5.

---

## §1 · WHAT THE CAR IS

One production file: `src/domain/spatial/cohesionWeave.js`, the `FACET_INFERENCE` table behind
the ONE facet chokepoint. Every alternative in every pattern was a **bare substring**, so a name
asserted a nature it never claimed:

| row | the substring that fired | what the engine then drew |
|---|---|---|
| `Priest (resident)` (village/Religious) | `den` inside "resi**den**t" | `vice` ⇒ the **TAVERN** interior — common room, kitchen, cellar |
| `Warden's Lodge` (town/Magic) | `den` inside "War**den**'s" | `vice` ⇒ the tavern interior |
| `Dragon resident` (city/Exotic) | `den` inside "resi**den**t" | `vice` ⇒ the tavern interior |
| `Charlatan fortune tellers` (town/Adventuring) | `fort` inside "**fort**une" | `security` ⇒ the **BARRACKS** interior — muster, armory, cells |

`Priest (resident)` is `required: true, baseChance: 1` at village, so on a village world the
parish priest drew a tavern **every time**.

**The cure is an anchor on every alternative — but NOT a uniform leading `\b`.** That naive
reading is refuted by measurement in §3. The anchoring is per-keyword and evidence-driven:

* **default** — a LEADING `\b`;
* `smiths?\b` and `mills?\b` — a **TRAILING** boundary instead, because English closes these two
  stems into compounds the table means to catch;
* `\bdens?\b` and `\bcults?\b` — **BOTH** boundaries, because a leading one still admits
  "denizen" and "cultural";
* `\bforts?\b|\bfortif|\bfortress` — an explicit **stem set**, because "fortune" opens a word,
  so no boundary at all can separate a fortune-teller from a fortification. Anchoring alone
  cannot cure that row; the per-keyword table is what cures it.

**⛔ NOT IN THIS CAR (chair ruling §503.3).** The `facets: { institutionNature: 'faith' }`
override on `Priest (resident)` is **re-homed to CH-3a**, beside R-INST-6-1's two identical
`facets` keys. The panel proved by three-way control that the override lands on every village
record and reds `tests/property/generatorGoldenMaster.test.js` (base and anchoring-only both
digest `1a4a8d3f85e6…` with the golden green; anchoring+override digests `20f4c34915681e1c…`
with the golden RED), because `assembleInstitutions` SPREADS the catalog row onto the hashed
settlement. **This car adds no catalog-row key of any kind.**

---

## §2 · S0 — THE BASE, READ BEFORE THE FIRST EDIT

| # | instrument | reading at `00e7af612` | verdict |
|---|---|---|---|
| 1 | the observed-shape instrument, part 1 | `node scripts/check-observed-shape-readers.mjs` → TRUE_EXIT **1**, **159 B**, SHA-256 `c5b67844abe51226f4c6862ae485dc5d9fa1e51148c70b4bd021e661f1ae0854`. The SAME command in the chair's baseproof worktree `chair-baseproof-b10ed1a1` (HEAD `b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d`, its own `node_modules`, its own TMPDIR): TRUE_EXIT **1**, **159 B**, same digest, **`cmp` exit 0** | PRE-EXISTING BY LOOKUP (schema-10 mint class, not this car's) |
| 2 | the observed-shape instrument, part 2 | the reader walker `tests/lint/observedShapeReaders.walker.test.js:737` — `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }`, GREEN by execution at this member's tip (§6) | UNMOVED |
| 3 | the generator golden | `tests/fixtures/generator-golden-master.json` SHA-256 `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` before the first edit and after the last | UNMOVED |
| 4 | the census tuple | `tests/lint/sovereigntyLightingContract.walker.test.js:6049` — `files: 2515, parked: 366, credited: 2149, titles: 20854, suiteTitles: 5807` | walked at §7, reverted digest-exact, the row rides to the landing act (§417) |
| 5 | the ruin roster | `tests/lint/ruinFilterRoster.walker.test.js:376` reads **92** at this base. This car adds no `.institutions` reader in `src/domain` — it edits a data table inside a file already dispositioned — so **no exempt-or-route disposition and no count raise is owed** | UNMOVED, proved by execution (§6) |
| 6 | the size baseline | `scripts/.size-baseline.json` carries **no row** for `cohesionWeave.js`; `src/domain/**` is `max-lines` 800 with `skipComments: true`, and the file is **372 raw lines** after the edit (347 before; the whole delta is comment). No headroom problem | CLEAR |
| 7 | the edge-bundle rosters | `src/domain/spatial/cohesionWeave.js` is an input of **three** of the five: `aiCharterBundle`, `aiGroundingBundle`, `aiOutputSchemaBundle` (`grep -l` over `supabase/functions/_shared/*.meta.json`) ⇒ `npm run build:edge-shared` runs in this member's commit, all five `.meta.json` commit as a set, and `tests/edgeFunctions` joins the sweep (§475) | OWED, PAID (§8) |
| 8 | `validate:packets` at base | `[implementation-packets] valid: 168 packets (0 READY)`, TRUE_EXIT 0 | GREEN |
| 9 | change-path reservation (§471/§480) | **zero non-terminal packets** in the manifest at this base, so no path this car names is reserved by another | CLEAR |
| 10 | the mutation-coverage census | `scripts/mutation-coverage-manifest.json` enumerates every test file under the seven ENFORCER DIRS, and `tests/lint` is one. A new file there owes an entry. **GREEN at base, RED at this tip — attributed by execution (§6.2)** | OWED, PAID as a `rationale` (§6.3) |
| 11 | the new-family cost | the validator has **no family concept at all** — `family` is not a field it reads; a family is only the directory segment inside `packetPath`. Admitting `catalog-hygiene` costs exactly three things and no code change: the packet `.md` at the new path, its manifest entry, and its `INDEX.md` row (the validator cross-checks `packetPath` ↔ index link ↔ status cell). Read at `scripts/implementation-packets.mjs` `validatePacketManifest` / `parseIndexPacketStatuses` | CONFIRMED |

---

## §3 · THE 933-CELL TABLE, RE-DERIVED BY THIS LANE

The charter's table was NOT trusted. Every catalog row was re-measured through the real
chokepoint, before and after, by script (`facetOf` over `{ category, name, ...entry }` — the
exact shape the generator spreads onto a settlement).

    ROWS 311   FACET_KINDS 3   CELLS 933
    CHANGED_CELLS 4

| # | facet kind | before | after | tier / shelf / row |
|---|---|---|---|---|
| 1 | `institutionNature` | `vice` | *(null ⇒ `generic`)* | village / Religious / **Priest (resident)** |
| 2 | `institutionNature` | `vice` | *(null ⇒ `generic`)* | town / Magic / **Warden's Lodge** |
| 3 | `institutionNature` | `security` | *(null ⇒ `generic`)* | town / Adventuring / **Charlatan fortune tellers** |
| 4 | `institutionNature` | `vice` | *(null ⇒ `generic`)* | city / Exotic / **Dragon resident** |

**That is the complete moved list — every one of the other 929 cells reads exactly what it read
at `00e7af612`.** `institutionFunction` moves nothing. `institutionSubstructure` — the undercity
existence gate's seed kind — moves nothing, so the seed gate is untouched.

⚠ **A CHARTER FIGURE CORRECTED, AND IT IS THE ONE THE ACCEPTANCE MISSED (§503.3).** The
charter's §1(a) says a naive uniform leading `\b` would cost **four** cells over four rows.
**It costs SIX over four rows.** Executed here as control C1:

    naive uniform leading \b  →  CHANGED_CELLS 10  (4 cures + 6 regressions)

| regressed cell | row |
|---|---|
| `institutionNature: craft` → null | `Blacksmith` (village/Crafts) |
| **`institutionFunction: arms` → null** | `Blacksmith` (village/Crafts) |
| `institutionNature: craft` → null | `Blacksmiths (3-10)` (town/Crafts) |
| **`institutionFunction: arms` → null** | `Blacksmiths (3-10)` (town/Crafts) |
| `institutionNature: craft` → null | `Sawmill` (village/Crafts) |
| `institutionNature: craft` → null | `Sawmill (commercial)` (town/Crafts) |

`smith` appears in **two** rows — the `craft` nature row and the `arms` function row — and the
charter's acceptance arm A5 pinned only `craft`. **Acceptance arm A2 below pins both halves on
both Blacksmith rows**, and mutant M4 drives the arms row alone to convict it.

⚠ **A second charter figure corrected.** The charter's §1(c) arm 1 states that after the
anchoring there are ZERO multi-rule collisions. There is **one deliberate collision left, and it
predates CH-1**: `institutionSubstructure` opens with `^access to `, which exists precisely to
beat the later `crypt` rule for the two `Access to parish church` rows (the church is
ELSEWHERE, so the settlement holds no crypt). It is the one place where rule position carries a
verdict on purpose. Acceptance arm A6 declares it by name rather than scoping it away, and pins
that the ACCIDENTAL collision the charter measured — `Resident smith (part-time)` matching
`craft` and `vice` at once, right today only because `craft` is listed first — is gone.

---

## §4 · THE DECLARED SHIFT, MEASURED — AND WHAT THE NEGATIVE CLAIM IS AND IS NOT WORTH

Corpus: the generator golden master's own tier × culture × terrain grid at this base,
**6 × 12 × 7 = 504 settlements** (the charter and the panel report 420; that figure comes from a
10-culture list, and `CULTURE_PROFILE_KEYS` carries 11 plus the `mediterranean` alias at this
base — the denominator is restated rather than copied).

**THE NEGATIVE CLAIM (read §0 first).** The whole-record corpus digest is
`479a7992568d5b802c0888e8bc852006afd164454fea3d4a1c7257f9dccde8ae` **before and after**, and
**0 of 504** per-settlement record hashes move. The pipeline record is unchanged. ⚠ **This is
not evidence the change works and it is not evidence the change is inert** — control C3 proves
the instrument cannot see a `FACET_INFERENCE` change at all. It is recorded because a reader
needs to know no generation golden can move, and for no other purpose.

**THE POSITIVE CLAIM — the derived reads, every `facetOf` consumer enumerated:**

| consumer | read | measured shift |
|---|---|---|
| `interior/interiorTemplates.js:173` `interiorKindOf` | `institutionNature` | **150 of 504 settlements (29.8%)** change at least one institution's interior: `Priest (resident)` vice→generic in **84**, `Charlatan fortune tellers` security→generic in **66**, `Warden's Lodge` vice→generic in **2**, `Dragon resident` **0** (its row is magic-gated and does not reach this grid; the panel measured 11 at pm50) |
| `interior/interiorTemplates.js:180` `interiorFunctionOf` | `institutionFunction` | **UNMOVED** — zero function cells move, which is exactly what the naive anchoring would have broken |
| `spatial/cohesionWeave.js:344` `hasCharityFacet` (the generosity mover) | `institutionNature==='faith'` ∨ `institutionFunction==='heals'` | **UNMOVED — 432 → 432.** No moved cell touches `faith` or `heals`. (This also confirms the panel's refutation of the override's own argument: villages are already charity-capable through `Parish church`) |
| `worldPulse/institutionLifecycle.js:438` `hasVice` | `institutionNature==='vice'` | **flips true→false in 84 of 504** (336 → 252), every one a settlement losing `Priest (resident)` as its only vice institution. **DARK TODAY** — the read sits behind `underwaysOrganicFoundingEnabled`, absent from `DEFAULT_SIMULATION_RULES`. Read plainly: on the day that flag lights, the engine would have proposed smugglers' tunnels under those settlements **because the parish priest read as a tavern**. That is the car's best argument and it is measured |
| `undercity/sewerDerivation.js:386` CIVIC_CAPACITY | `institutionNature==='civic'` | **UNMOVED** — 695 → 695 civic institutions across the corpus |
| **`undercity/monotoneComponents.js:511-523`** | `institutionSubstructure`, `institutionNature==='faith'` (crypt zone), `institutionFunction` (vault) | **UNMOVED** — all three kinds it reads move zero cells. ⚠ This consumer landed with MF-UC2 inside the charter's own measurement window and is **absent from the charter's derived-read table and from its §4.5 grep list** (N−1 of N); it is added here by grep at this base, per the chair's widening |
| `spatial/navalLayer.js:174` | `institutionFunction==='naval'` | UNMOVED (no function cell moves; no row resolves `naval` by inference) |
| `worldPulse/convergence.js:898` | `institutionFunction==='mercenary'` | UNMOVED |
| `worldPulse/clandestineFacet.js:66-67`, `institutionLifecycle.js:441` | `clandestine` (no inference table) ∨ `institutionFunction` | UNMOVED |
| `undercity/strataExistence.js:191/215/218` | `institutionSubstructure`, `subterranean` | UNMOVED |
| `worldPulse/relationshipEvolution.js:160` | `memoryHorizon` (no inference table) | UNMOVED by construction |
| `npc/npcBank.js:150` | arbitrary NPC facet kinds | UNMOVED for catalog institutions; see the accepted cost below |

**ACCEPTED COST, DECLARED (J-TECH1-2).** A keyword must now open a word (or, for the two stem
exceptions, close one). A closed compound that buries the keyword in second position — a custom
"Nightwatch", a "Bodyguard lodge" — stops inferring and falls to the kind default. Zero live
catalog rows are in that shape (measured: every keyword's mid-word-only hit list is empty except
`smith`, `mill` and `den`, all three handled explicitly). Custom content declares its facet
instead, which is the affordance the chokepoint exists for and a truer answer than a guess made
from a name.

**Goldens to re-record: none.** No generation golden can move; the interior fixtures
(`tests/fixtures/interiorFixtures.js`) choose names with leading word boundaries and are
unaffected, proved by running `tests/interior/**` green (§6).

---

## §5 · ACCEPTANCE — 9 arms in `tests/lint/facetInferenceHonesty.walker.test.js`, each with a mutant that convicts it

| # | arm | convicting mutant (all executed, §6) |
|---|---|---|
| A0 | the table parsed out of the shipped source reproduces `facetOf` on all 933 cells — the non-vacuity floor for A3/A6/A7 | M8 (break the parser) |
| A1 | the four rows stop asserting a nature AND the **DERIVED INTERIOR** each draws moves to `generic`; the pre-CH-1 half pins what each read before | M1 (bare `den`), M2 (bare `fort`) |
| A2 | **the A5 gap:** both Blacksmith rows keep `craft` AND `institutionFunction: arms`; 13-row non-regression roster | M3, **M4 (arms row alone)**, M5 |
| A3 | the whole-catalog differential against the frozen pre-CH-1 table is EXACTLY the declared 4-cell delta | every source mutant |
| A4 | the undercity seed gate is still: `institutionSubstructure` moves zero of 311 | M9 |
| A5 | ANCHOR DISCIPLINE — every alternative carries `\b` or `^` (source scan over the shipped bytes) | M6 (add a bare alternative) |
| A6 | no accidental multi-rule collision; the one deliberate `^access to ` override is declared by name | M1, M9 |
| A7 | every declared catalog facet names a real value, with a live-scan count and a synthetic negative | M8 |
| A8 | what the reader sees: the village parish priest's room set moves `common/kitchen/cellar` → `main/back` | M1 |

⚠ **NINE TEST ARMS, EIGHT MANIFEST CASES.** `implementation-packets.mjs` caps `acceptanceCases`
at 8, so **A0 is carried inside A3's manifest case** — it is literally A3's non-vacuity floor and
reads as one claim. The test file keeps the nine `it(` arms, which is what the census counted.

---

## §6 · EXECUTION LOG

Every battery on one command line with the lock dir exported inline (§440.2) and the exit
captured unpiped. `npm run check*` was never wrapped in the mutex (§460.1).

### §6.1 · The batteries

| battery | result |
|---|---|
| the acceptance, `tests/lint/facetInferenceHonesty.walker.test.js` | `Test Files 1 passed (1)` · `Tests 9 passed (9)` · **TRUE_EXIT 0**, re-run AT the committed tip (`b2a3b463d`) after the blob proof, not only before it |
| **the §489.3 grep arm — 52 files**, `git grep -l` over 21 tokens (`FACET_INFERENCE · facetOf · inferFacet · declaredFacet · interiorKindOf · interiorFunctionOf · INTERIOR_KINDS · hasCharityFacet · resolveRoomSet · templateOf · institutionNature · institutionFunction · institutionSubstructure · Priest (resident) · Warden's Lodge · Charlatan fortune tellers · Dragon resident · Blacksmith · Sawmill · cohesionWeave · interiorTemplates`) across **all** of `tests/`, not the charter's 16-file list | `Test Files 1 failed \| 51 passed (52)` · `Tests 1 failed \| 902 passed (903)` · TRUE_EXIT 1, the one red being the deferred census row |
| the three `interiorFixtures` consumers (`interiorModel` was in the grep arm; `interiorExport` and `interiorLens` reach the fixture only through it) | `Test Files 2 passed (2)` · `Tests 14 passed (14)` · TRUE_EXIT 0 |
| `tests/property` with the golden blob compared on both sides | `Test Files 101 passed (101)` · `Tests 643 passed (643)` · TRUE_EXIT 0. `tests/fixtures/generator-golden-master.json` SHA-256 `29c6cc8f…` **before and after**, `git status --porcelain` empty |
| `npm run typecheck:ratchet` | `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` TRUE_EXIT 0 |
| `npm run typecheck:domain:strict` | `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` TRUE_EXIT 0 |
| `npx eslint` on both touched JS files | TRUE_EXIT 0, no output |
| `npx eslint --fix-dry-run` on both | TRUE_EXIT 0, no output |
| `npm run validate:packets` | `[implementation-packets] valid: 169 packets` — TRUE_EXIT 0 at DRAFT and at READY |
| C0 scan (`grep -c -P '[\x00-\x08\x0B\x0C\x0E-\x1F]'`) over every authored file | **0** on all five, re-run before each commit |
| `CLAIM_RE` (the exact regex from `tests/docs/enforcement-claims.test.js:40`) over every added line, `src` comments included | **0 hits** |

### §6.2 · The mutants — nine drives, each restored digest-exact

Every drive ran the acceptance alone, mutexed, exit captured. The file's SHA-256 was recorded
before the drive and re-compared after the restore; every restore was exact, and a clean re-run
was green after the last.

| # | mutation | arms it convicted |
|---|---|---|
| M1 | `\bdens?\b` → `den` | A1 · A3 · A5 · A6 · A8 |
| M2 | `\bforts?\b\|\bfortif\|\bfortress` → `fort` | A1 · A3 · A5 |
| M3 | `smiths?\b` → `\bsmith` in the `craft` row | A2 · A3 |
| M4 | **`smiths?\b` → `\bsmith` in the `arms` row ALONE — the A5-gap drive** | A2 · A3 |
| M5 | `mills?\b` → `\bmill` | A2 · A3 |
| M6 | append an unanchored `\|lodge` to the `vice` row | A1 · A3 · A5 |
| M7 | drop the `^` from `^access to ` | **A5 only** |
| M8 | break the walker's own source parser (`.slice(1)` on the row scan) | A0 · A6 · A7 |
| M9 | append `\|\bgranar` to the `sewer` pattern | A3 · A4 · A6 |

⚠ **M7 CORRECTED A CLAIM THIS PACKET WAS ABOUT TO MAKE.** A4's first draft named "drop the `^`
from `^access to `" as its convicting mutant. Driven, it convicts A5 and **not A4** — the phrase
only ever occurs at the start of a name, so no verdict moves. The comment in the test file was
rewritten to name M9, which does convict it, and to say plainly that M7 does not. A mutant that
was described rather than driven would have shipped that as a lie.

Two further controls, both outside the acceptance:

* **C1 — the naive-anchoring control.** Uniform leading `\b` on the two stem exceptions:
  `CHANGED_CELLS 10` (4 cures + the 6 regressions tabled in §3). Restored digest-exact.
* **C3 — the blindness control (§0).** `faith` pattern → `/./i`: **15,101 interior cells move
  across 504 of 504 settlements; the corpus digest does not move at all.** Restored digest-exact.

### §6.3 · The sweep — two drives, and the one member-caused red

**FIRST DRIVE**, mutexed, over `tests/lint tests/build tests/docs tests/ops tests/domain
tests/property tests/edgeFunctions tests/scripts tests/ui tests/data`:
`Test Files 7 failed | 1477 passed | 7 skipped (1491)` · `Tests 9 failed | 19519 passed |
114 skipped (19642)` · 330.06 s · **SWEEP_TRUE_EXIT 1**.

| # | failing title | class |
|---|---|---|
| 1 | `sovereigntyLightingContract.walker` — THE CENSUS IS AN ASSERTION, NOT A SENTENCE | **THIS MEMBER'S ONE AUTHORIZED INTERIOR RED** — the deferred census row (§417, §7) |
| 2 | `mutationCoverageManifest` — TOTALITY: every enumerated invariant file has a manifest entry | ⚠ **MEMBER-CAUSED. CURED IN-MEMBER** at `c4d7d753f` |
| 3 | `enforcement-claims` — every completeness claim carries an `@enforced-by` tag | BANKED. Six naked claims, in `FABLE_VALIDATION_QUEUE.md` ×4, `GOLDEN_SHIFT_LEDGER.md` and `IN-0C.md` — **none of them a file this member touches** |
| 4 | `metronomeCooldownLint` — the non-cooldown emitter set may only SHRINK | BANKED |
| 5–7 | `warCostKindPools.walker` ×3 — `war_trajectory_winning` / `war_trajectory_losing` / `trajectory_misread` | BANKED |
| 8 | `warRulingKindPools.walker` — `succession_demand_inherited` | BANKED |
| 9 | `clampPrimitiveBaseline` — baseline matches the files that still define a local clamp | BANKED. This member defines no local clamp |

**NO STRAY.** All nine are accounted for, so no re-run was owed (§355) and no §432 escalation is
open.

⭐ **THE BANKED SET AT THIS BASE IS SEVEN, NOT THE EIGHT THE LAST LANDING SAW — and that is proved
by execution rather than read off a commit subject.** A detached baseproof worktree at the clean
base `00e7af612` (`git status --porcelain` empty apart from the linked `node_modules`; the same
`package-lock` because this member changes no `package.json` byte) ran the seven candidate files:
`Test Files 5 failed | 2 passed (7)` · `Tests 7 failed | 140 passed (147)` · TRUE_EXIT 1, the
seven titles being rows 3–9 above **exactly**. The eighth title the last landing banked — the
PER-CLAIM naked-claim pin — is GREEN at this base, because the base commit itself is the MF-UC2
landing that paid it. The same run also proves the two attributions this member owes:
`mutationCoverageManifest` **8/8 GREEN at base** and `sovereigntyLightingContract` **33/33 GREEN
at base**, so both reds at the tip are this member's and are dispositioned above.

**§469, discharged by INPUT PROVENANCE** (the MF-UC2 method, J-TEUC2-11) **and by the base run
above.** The five banked test FILES — `enforcement-claims`, `warCostKindPools`,
`warRulingKindPools`, `metronomeCooldownLint`, `clampPrimitiveBaseline` — are `cmp`-IDENTICAL
between this tree and the chair baseproof `chair-baseproof-b10ed1a1` (HEAD
`b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d`, porcelain empty), so their assertion blocks cannot
differ for anything this member caused. The one banked red whose INPUT this member does move is
`enforcement-claims`, which scans `docs/**.md`: settled by measurement, `CLAIM_RE` counts **0**
over every line this member adds to `MF-CH1.md`, `INDEX.md` and the manifest.

**THE CURE, and its non-vacuity.** `uncovered` is refused twice — by the manifest test's own
header and by the SHRINK-ONLY arm that pins the uncovered count EXACTLY at `uncoveredBaseline`
198 — so the entry is a `rationale` that names the nine drives in §6.2. Perturbing the new key to
a file that does not exist reds BOTH the TOTALITY arm and the stale-entry arm; restored
digest-exact. At the cured bytes: `mutationCoverageManifest` 8/8, the acceptance 9/9.

**SECOND DRIVE** at the final tip: §6.4.

---

## §7 · THE CENSUS — WALKED, THEN REVERTED (§417)

Walked at this member's own base, figure by figure, each read from its own failure message in
assertion order and never computed:

* `files` — "expected 2516 to be 2515"
* `parked` — **PASSED UNMOVED** at 366
* `credited` — "expected 2150 to be 2149"
* `titles` — "expected 20863 to be 20854"
* `suiteTitles` — "expected 5808 to be 5807"

**DELTA `+1 / +0 / +1 / +9 / +1`** → `files: 2516, parked: 366, credited: 2150, titles: 20863,
suiteTitles: 5808`. The walked tuple is GREEN by execution: `Test Files 1 passed (1)` ·
`Tests 33 passed (33)` · TRUE_EXIT 0.

⭐ **THE DELTA EQUALS THE TITLES THIS MEMBER WROTE**, so no title was swallowed by a parked file:
the walker holds 9 `it(` and 1 `describe(`, and the census moved by exactly 9 and 1. **NEGATIVE
CONTROL:** `suiteTitles` alone put back to 5,807 reds at `suiteTitles` — the member's one new
describe. The walker file was then **restored digest-exact** (SHA-256
`811b044a8d6527d5216eec9434f097be06a5e7b0bfbed7bec79194272d9b8399` before and after, porcelain
empty), and **the row rides this packet into the landing act** rather than being carried across a
rebase.

⛔ **THE RATCHET CEILING IS NOT TOUCHED.** The recorded hazard ("just census it" is unavailable)
governs `scripts/.test-ratchet-baseline.json`, whose `CEILING` is a literal 17 and whose entry
count is 11. This member adds **no** failing row there — its walker passes — so no ceiling moves
and no walker ledger entry is owed (`WALKER_ROWS_ADMITTED` / `WALKER_ROWS_OWED` govern census
rows, and this walker has none).

---

## §8 · THE EDGE BUNDLES (§475)

`src/domain/spatial/cohesionWeave.js` is an input of **three** of the five rosters — proved by
`grep -l` over `supabase/functions/_shared/*.meta.json`, not from memory:
`aiCharterBundle.meta.json`, `aiGroundingBundle.meta.json`, `aiOutputSchemaBundle.meta.json`.
(`src/domain/interior/interiorTemplates.js` is in **none**, and this member does not modify it.)

`npm run build:edge-shared` ran **inside the member commit** (`BUILD_EXIT 0`). The regenerated
artifacts split exactly as the law predicts:

* the **three** bundle `.js` files carry real content movement — the inlined table;
* their three `.meta.json` files move `generatedAt` **and** `sourceHash`
  (`a8ae453f07314002 → d10dc5a1753bb224`, `5ccae1a97b7a9c45 → 74c1e8a2d91b00ea`,
  `313a31ab0e5a9aec → 8ac93ac85a31f5c0`);
* `analyticsEventsBundle.meta.json` and `intentAtlasBundle.meta.json` move the **`generatedAt`
  stamp and nothing else** — verified line by line on the diff.

**All five metas are committed as a set**, following the landed precedent for this exact file:
`6ecac22a4` ("chore(MF-UC0): re-bundle edge-shared — cohesionWeave.js is a real bundle input, ODQ
§475") committed the two stamp-only metas alongside the three real ones, as did `b325fc07f`
(MF-UC4) and `2d1e09ceb`. `tests/edgeFunctions` joined the sweep and is green in both drives.

---

## §9 · JUDGMENTS (each vetoable by a word) AND DEFERRALS

| id | judgment |
|---|---|
| **J-TECH1-1** | **Decided:** `\bcults?\b` and `\bforts?\b` carry the optional plural, where the charter wrote `\bcult\b` and `\bfort\b`. **Why:** the same table already needs `\bdens?\b`, `smiths?\b` and `mills?\b`; a stem that admits its own plural everywhere else should not silently refuse it in two rows. **Rejected:** the charter's literal spelling — it would drop a future "Blood cults" or "Hill forts" for no measured gain. **Reversal:** delete the two `s?`. **Blast radius:** ZERO — measured, both forms move the same 4 cells of 933 |
| **J-TECH1-2** | **Decided:** the accepted cost of the leading-`\b` default is DECLARED in the source header and in §4 rather than engineered away. A closed compound burying the keyword second (a custom "Nightwatch", a "Bodyguard lodge") stops inferring. **Why:** the owner's finite-semantics law makes a declared facet the right answer for custom content, and the chokepoint already reads one. **Rejected:** widening every keyword to a two-sided stem set — that invents claims about words the catalog never uses, which is the same unearned-claim failure this car exists to remove. **Reversal:** add the compound as its own anchored alternative. **Blast radius:** ZERO live catalog rows — every keyword's mid-word-only hit list is empty except `smith`, `mill` and `den`, all three handled explicitly |
| **J-TECH1-3** | **Decided:** acceptance A3 is a DIFFERENTIAL against a frozen copy of the pre-CH-1 table, read on a declaration-stripped entity — not a frozen inventory of every row's verdict. **Why:** an exact inventory would red on CH-3's chartered DELETION of the village `Smuggling network` row (§503.5) and on CH-3a's `facets` key, foreclosing later cars of its own train — the recorded hazard. The differential still convicts every anchor change, and `DECLARED_INFERENCE_DELTA` makes the next author declare what they moved. **Rejected:** a frozen `name → value` map. **Reversal:** replace the differential with that map. **Blast radius:** A3 survives catalog rows being added or deleted and survives declarations being added |
| **J-TECH1-4** | **Decided:** A6 DECLARES the one surviving multi-rule collision (`^access to ` beating `crypt` on the two `Access to parish church` rows) by name, instead of scoping the arm to the two kinds where zero collisions remain. **Why:** scoping would hide a live ordering dependency inside the undercity's own seed kind. The charter's §1(c) arm 1 claimed ZERO collisions after the change; that is corrected here. **Rejected:** scoping the arm. **Reversal:** scope it. **Blast radius:** none — the arm is stricter, not looser |
| **J-TECH1-5** | **Decided:** A1 pins the LIVE derived interior (declarations honoured) as well as the inference-only verdict, and the CH-3a re-record is SIGNPOSTED in the test-file header rather than engineered around. **Why:** the chair's brief requires the interior the engine actually derives to be pinned; making the arm immune to a declaration would pin something the engine does not produce. **Rejected:** pinning only the declaration-stripped read. **Reversal:** drop the `liveInteriorKind` half. **Blast radius:** CH-3a moves ONE cell of this arm, `generic` → `faith`, and the header says so by name |
| **J-TECH1-6** | **Decided:** the corpus denominator is restated as **504** (6 tiers × 12 cultures × 7 terrains, the generator golden master's own grid at this base) rather than copied as the charter's and the panel's 420. **Why:** `CULTURE_PROFILE_KEYS` holds 11 keys plus the `mediterranean` alias at `00e7af612`; a figure that does not re-derive is a figure that will be re-quoted wrongly. **Rejected:** reproducing 420 by trimming the culture list to match a prior lane. **Blast radius:** every per-settlement figure in §4 is on the 504 grid and is labelled as such; the ratios agree with the panel's |
| **J-TECH1-7** | **Decided:** the mutation-coverage entry is a `rationale`, not a planted sweep regression. **Why:** planting would have to add `src/domain/spatial/cohesionWeave.js` to the sweep's `MUTATED_FILES` refusal list — a second file and a widened `git checkout --` blast radius — for a walker whose nine mutants are already enumerated and executed (§6.2). **Rejected:** the plant (the manifest header's stated preference) and `uncovered` (refused by the header and by the SHRINK-ONLY arm). **Reversal:** plant the mutation and flip the entry to `kind: "mutation"` with its label. **Blast radius:** the uncovered count stays exactly 198 |

**DEFERRALS — deliberately deferred, documented, not bugs to re-find:**

1. **The `facets: { institutionNature: 'faith' }` override on `Priest (resident)` → CH-3a**, by the
   chair's ruling §503.3. Until it lands, those settlements draw the `generic` interior rather
   than the `faith` one. That is *less wrong* than a tavern, and it is not this car's call.
2. **`Warden's Lodge`, `Charlatan fortune tellers` and `Dragon resident` now fall to `generic`**
   and no existing `INTERIOR_KINDS` member is right for any of them (R-INST-5: a moated lodge
   compound, a temporary booth with NO_BUILDING, and an occupation of an existing structure).
   A real `hospitality` / `lodge` / `site` vocabulary is **DW-1's** work (§491.2). Assigning one
   of them a near-enough kind would replace one unearned claim with another.
3. **The `hasVice` shift is DARK** until `underwaysOrganicFoundingEnabled` is lit — the owner's
   R-5 — and it is recorded in §4 so the lighting regen does not discover it as a surprise.
4. **`tests/generation.test.js`** (the repo's one root-level test file) sits outside both the ten
   sweep trees and the grep arm's token set; it is run explicitly in §6.4 rather than left unstated.
5. **The charter's `catalog-hygiene` family is admitted here** with the three artefacts §2 row 11
   names. No validator change was needed, and none was made.

---

## §6.4 · THE SECOND DRIVE, AT THE FINAL TIP

Run at the shipped bytes of `3c4b283f2` (the READY docs commit), mutexed, over the same ten
trees. `git rev-parse HEAD` and `git status --porcelain` identical before and after (the tip
unmoved, the tree clean).

`Test Files 6 failed | 1478 passed | 7 skipped (1491)` · `Tests 8 failed | 19520 passed | 114 skipped (19642)` · 345.32 s · **SWEEP2_TRUE_EXIT 1**.

**EIGHT failing titles, and the member-caused one is GONE:** `mutationCoverageManifest` no
longer appears. What remains is **exactly the seven banked reds** proved at the clean base in
§6.3 **plus this member's one authorized interior red** (the deferred census row). **NO STRAY**
in either drive, so no re-run was owed (§355) and no §432 escalation is open.

⚠ **ONE NEAR-MISCLASSIFICATION, RECORDED SO THE NEXT READER DOES NOT REPEAT IT.** This drive's
log carries four alarming lines that are **not failures**: `vendored lib …__exact_set_probe__.js
… NOT pinned in VENDOR-MANIFEST.json`, `pinned in manifest is missing on disk: flatqueue.js`, and
two `VENDOR-MANIFEST.json has no libs to verify`. They are the **child-process stdout of
`scripts/validate-map-fork.mjs`**, which `tests/build/vendorManifestExactSet.test.js` runs on
purpose and asserts on — the test plants the probe, moves `flatqueue.js` aside, and restores
both in a `finally`. The file appears in NEITHER drive's failing list and the worktree porcelain
was empty throughout. A sweep log line is not a verdict; only the `×` list and the summary are.

**§6.5 · TWO INSTRUMENTS OUTSIDE THE TEN TREES, run explicitly rather than left unstated:**

* `tests/generation.test.js` — the repo's one root-level test file, outside both the sweep trees
  and the grep arm's token set: `Test Files 1 passed (1)` · `Tests 21 passed (21)` · TRUE_EXIT 0,
  with the golden blob still `29c6cc8f…`.
* `tests/interior/interiorExport.test.js` and `tests/interior/interiorLens.test.js` — the two
  `interiorFixtures` consumers the grep arm's tokens do not reach: 14/14 green (§6.1).

Both S0 walkers rode the sweep and are green in both drives: `observedShapeReaders.walker`
(the reader literals at `:737` unmoved) and `ruinFilterRoster.walker` (the reader count still 92,
no disposition owed — this car adds no `.institutions` reader).


## §10 · THE LANDING SLOT (TE-CH1-LANDING, 2026-08-23 — slot `00e7af61`, the MF-UC2 landing)

Landed by lane **TE-CH1-LANDING**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`** (ODQ §484). The lane
moved no ref; the chair executes the CAS `00e7af61 → this tip`.

- **NO REBASE WAS OWED, and that is a measurement rather than an assumption.** The slot ref
  `claude/composite-r4` was re-read in-shell at GO and returned
  `00e7af612d428078634d52ea37054bd00b773ca6`; `git merge-base 00e7af612 fe88c28c7` returns that
  same commit, so the member's BUILD base and the LANDING SLOT are one commit and the four member
  commits (`b2a3b463d`, `c4d7d753f`, `3c4b283f2`, `fe88c28c7`) are a pure fast-forward. Nothing
  landed under this member while it held. The `verifiedBase` rows in the manifest and in the header
  above therefore already name the slot and needed no re-stamp — verified by reading them back
  through `parsePacketHeader`, not by inspection.
- **Carry-proof-by-absence at blob level, eighteen rows** (braced `${sha}:path` throughout with
  `git rev-parse --verify --quiet`, because a BARE `git rev-parse` echoes its own argument on
  failure and zsh reads an unbraced `$sha:path` as a history modifier). All **14** member paths are
  blob-identical to the holding tip. **Two are CREATED by this member** — this packet and
  `tests/lint/facetInferenceHonesty.walker.test.js` — and both read ABSENT at the slot; the other
  twelve MOVED. Controls: `package.json` (`2b5ec2014c`) and `package-lock.json` (`1a8a80b12b`) are
  IDENTICAL at slot and tip, so no mint trigger was crossed; a deliberately nonexistent path under
  `tests/lint/` reads ABSENT at slot, tip and holding alike, which is what makes the two genuine
  ABSENT readings evidence rather than a silent success; and
  `tests/lint/sovereigntyLightingContract.walker.test.js` is UNMOVED across all four member commits
  (`0303493ea2` at both ends), which is exactly why the census row below is the landing act's to
  pay.
- **§475 THE EDGE BUNDLES, RE-PROVED AT THE LANDING TREE.** `npm run build:edge-shared` was re-run
  here and exited 0. All five `supabase/functions/_shared/*Bundle.js` artifacts regenerate
  **byte-identical** (`cmp` 0) to the bytes the member committed — aiCharter `5735d354…`, aiGrounding
  `ef94bd48…`, aiOutputSchema `c4dff941…`, analyticsEvents `c64ee7ef…`, intentAtlas `04427854…` —
  and every `sourceHash` is unchanged (`d10dc5a1753bb224`, `74c1e8a2d91b00ea`, `8ac93ac85a31f5c0`,
  `9416e4995620b37a`, `9860939aa2829e62`). The ONLY movement in any of the five metas is
  `generatedAt`, one diff line each, so all five were restored to their committed blobs per the UC-4
  precedent and the tree returned to a clean status. `cohesionWeave.js` sits in THREE of the five
  input rosters (aiCharter, aiGrounding, aiOutputSchema), which is why all five metas commit as a
  set.
- **The census row, WALKED here rather than carried (§417/§420/§457/§469/§480.2):** the slot read
  `2515/366/2149/20854/5807`; the delta `+1/+0/+1/+9/+1` re-derives to
  **`2516/366/2150/20863/5808`**, each moved figure read from the arm's own failure message in
  assertion order and never computed (`expected 2516 to be 2515` → `expected 2150 to be 2149` →
  `expected 20863 to be 20854` → `expected 5808 to be 5807`), with the whole arm green at the end
  (33/33, TRUE_EXIT 0). ⭐ `parked` PASSED unmoved at **366** on the iteration between `files` and
  `credited`, which is the receipt that the new walker is CREDITED rather than an inference from its
  shape. Two negative controls — the slot tuple back, and `suiteTitles` alone back at 5,807 — both
  red as predicted, and the file restored `cmp` 0 each time.
- **THE THREE CENSUSES A NEW `tests/lint` FILE OWES, all three green and all three EXECUTED.** The
  lighting census (paid above); `tests/lint/mutationCoverageManifest.test.js` TOTALITY, which the
  member cured in-train at `c4d7d753f` as a rationale row; and
  `tests/lint/negativeAssertionAnchor.walker.test.js`, which does NOT red for a `tests/lint` file
  because it is scoped to generation-facing roots — proved by running it rather than reasoned from
  its scope. With `tests/lint/controlBytes.test.js` beside them: `Test Files 4 passed (4)` /
  `Tests 54 passed (54)`. The authored census block carries 0 control bytes and 0 tabs (detector
  proved live on a synthetic U+001F).
- **The status walk — THREE places, not one (§486.2),** each read back through the validator's own
  parser rather than by eye: the manifest row (`status` READY → LANDED; `verifiedBase` already the
  slot sha; `requiredSymbols` **11**, every one of them a symbol or an import marker and not one of
  them a count or a migration head), this packet's own Markdown header, and the **INDEX STATUS
  column**, which the validator reaches through the manifest's `indexPath`.
  `[implementation-packets] valid: 169 packets (0 READY)`. THREE non-vacuity controls: the INDEX
  column alone put back to READY is refused with `status disagrees with index`; this header alone
  put back is refused with `status disagrees with packet Markdown`; and the new `catalog-hygiene`
  directory segment owes NOTHING extra, because `packetPathProblem` returns `null` for an invented
  family directory and the only failure mode is path EXISTENCE — the validator has no family
  concept, established against its source AND by perturbation. All three restores `cmp` 0.
- **S0, both parts.** Part 1: the pre-existing schema-10 red is IDENTICAL here and at the chair
  baseproof `chair-baseproof-b10ed1a1` — both streams 159 bytes, `cmp` 0, sha256
  `c5b67844abe51226…`, with that worktree's status clean before and after and a one-byte probe
  proving the comparison live. Part 2: the reader-walker literals
  `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }` stand verbatim at
  `:737` with the walker 27/27 green, and the OSR inventory blob
  `scripts/.observed-shape-readers-baseline.json` (`8d91fdfa14`) is unmoved at slot, tip and
  worktree.
- **The re-proofs at the landing bytes, every one mutexed on the shared lock.** The §489.3 grep arm
  re-run at its full **52 files** — the width this member's build lane widened it to from the
  charter's 16 — together with the two `interiorFixtures` consumers and the four validator suites
  and the ruin-filter walker: `Test Files 59 passed (59)` / `Tests 976 passed (976)`. The arm's one
  red at the build was the deferred census row and it is gone, paid. `tests/property` +
  `tests/edgeFunctions`: `Test Files 139 passed (139)` / `Tests 1596 passed (1596)`, with the
  generator golden `29c6cc8f…` identical at slot, tip and after the run. `ruinFilterRoster` reads
  **92** and its file is the same blob at slot and tip, so this car owes it no disposition. eslint
  over the three touched JS paths exits 0 with empty output, and `--fix-dry-run` changes nothing.
  `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` ·
  `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).`
- ⚠ **TWO VACUITY TRAPS THIS LANE WALKED INTO AND CAUGHT,** recorded because both print a reassuring
  line: a mis-spelled test path is DROPPED by vitest, which then reports a green run over the files
  it did find (`Test Files 3 passed (3)` where four were named) — the file-count line is the only
  tell; and in zsh an unquoted `$FILES` holding a space-separated list does NOT word-split, so the
  whole list arrives as ONE filter (`${=FILES}` is the fix). Cross-check the printed file count
  against the count you passed, every time.
