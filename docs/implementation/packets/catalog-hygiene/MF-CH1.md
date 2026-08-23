# Catalog hygiene / MF-CH1 — INFERENCE HONESTY: the ONE facet chokepoint stops reading words that are not there, and the proof is pinned at the DERIVED INTERIOR because the corpus digest cannot see it

- **Status:** DRAFT
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
| 10 | the new-family cost | the validator has **no family concept at all** — `family` is not a field it reads; a family is only the directory segment inside `packetPath`. Admitting `catalog-hygiene` costs exactly three things and no code change: the packet `.md` at the new path, its manifest entry, and its `INDEX.md` row (the validator cross-checks `packetPath` ↔ index link ↔ status cell). Read at `scripts/implementation-packets.mjs` `validatePacketManifest` / `parseIndexPacketStatuses` | CONFIRMED |

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

---

## §6 · EXECUTION LOG — to be completed at READY

## §7 · THE CENSUS — to be completed at READY

## §8 · THE EDGE BUNDLES — to be completed at READY

## §9 · JUDGMENTS AND DEFERRALS — to be completed at READY
