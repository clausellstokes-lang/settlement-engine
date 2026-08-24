# CH-4 — RULING BRIEF

Lane **TE-CH-4-PREP**, read-only, 2026-08-24. Slot `claude/composite-r4` =
**`510c51b766a4ef329a697d61f3006e23d4fb2325`** (`TE-STACK-5: the census row`), verified live
with `git rev-parse`. No worktree, no vitest, no gate, no commit, no file touched outside this
brief and the receipt.

> ⚠ **LANE-LAW.md is stale on one line.** Its `SLOT BASE` still names
> `79b78881ca86612ec312602c2e3dc6d06aa34df8`. The live ref is `510c51b76`. Recorded, not edited.

---

## 1 · THE RECOMMENDATION, FIRST

**Adopt Shape D: a declared quarter-category registry inside `src/domain/districtProfile.js`,
consulted before the keyword table, plus a walker that proves every quarter literal
`spatialGenerator.js` authors has a row in it — and anchor the one substring token
(`den` → `\bdens?\b`) in the demoted fallback table. Do NOT reorder the table.**

Concretely, three edits and one new test file:

1. `src/domain/districtProfile.js` — add `const QUARTER_CATEGORY = Object.freeze({ … })`
   **immediately after** `CATEGORY_PATTERNS` (i.e. starting at line 118, so line 112 does not
   move — see §6.3), and make `inferCategory` read
   `QUARTER_CATEGORY[quarter.name] ?? <the existing keyword inference>`.
   This is the estate's own landed idiom, `declared ?? inferred` — `cohesionWeave.js:328-334`
   `facetOf`, and `arcaneInstitutionIdentity.js:13-18`'s ruling *"the tag is the authored
   semantics, the bucket is a shelf."*
2. `src/domain/districtProfile.js:113` — `den` → `\bdens?\b` in the criminal row. One token,
   same line number, and it is the identical cure CH-1 applied to the identical token.
3. **No change to `spatialGenerator.js`** and **no new key on the persisted record.**
4. `tests/lint/quarterCategoryDeclaration.walker.test.js` — parses `spatialGenerator.js`'s
   `quarters.push({ name: … })` literals and asserts the name set equals `QUARTER_CATEGORY`'s
   key set, and that every value is in `DISTRICT_CATEGORIES`.

**Why this and not the others.** The keyword table cannot be repaired into correctness, because
the token that wins is frequently inside a **landmark drawn from the institution roster** — text
the quarter's author never wrote. `Mages' Quarter` is the proof: it resolves `arcane` on 115
instances and `craft` on 44, and the only difference is whether the seeded draw put a *guild* in
its landmark list. A category that flickers with the institution draw is not a classification
problem; it is a **missing declaration**. Every table variant I measured (§4) either leaves a
residual, kills a live category, or regresses a quarter that is right today. The declaration has
no residual by construction and cannot be defeated by drawn text.

**Verdict: this is REPAIR — the chair's to rule.** Two riders inside it are not; see §7.

**The one live judgment inside the recommendation** — `Wealthy Residential` declares **`noble`**,
not `residential`. This is decided by measurement, not taste: `inferWealth`'s base for
`residential` is `1` → band **`poor`**, so declaring the wealthy stone-townhouse quarter
`residential` renders it *poor* on 168 of 168 instances. `noble` (base `5` → `opulent`) is the
honest reading, and `"Noble's Row"` is the quarter's own first landmark. Splitting the quarter
into a noble ward *and* a wealthy-residential ward is the better world-model and is **NEW
CAPABILITY** (a generator change) — it belongs to the estate wave, not to CH-4.

---

## 2 · GROUND TRUTH, WITH METHOD AND DENOMINATORS

### 2.1 · What CH-4 actually is

CH-4 is `inferCategory` in **`src/domain/districtProfile.js`** — `CATEGORY_PATTERNS` at
**:105-117**, the function at **:123-129** — an eleven-row ordered regex table, first-match-wins,
run against
`` `${name} ${desc} ${landmarks.join(' ')}` ``. It is the **ONE** classifier that turns
`settlement.spatialLayout.quarters[]` into the town-map district 12-enum. Its consumers are
`townLayoutV2.js`, `townMapModel.js`, `glyphAssign.js`, `institutionAssignment.js`,
`aiGrounding.js`, `causalViews.js`, `explanation.js`, `qualitativeBands.js` and
`SettlementMapPane.jsx`.

`spatialGenerator.js` is the **sole producer** of quarters (confirmed: the only `quarters:`
writer in `src/`; `customContentSchema.js` contains no quarter surface at all, so custom content
cannot author one).

### 2.2 · The instrument, and its calibration

* **Harness:** `git archive` of the slot's `src/`, `tests/fixtures/`, `package.json` into a
  scratch directory. No worktree, no checkout. `node_modules` = **two symlinks only**
  (`seedrandom`, `immer`); those are the only bare specifiers in the whole import closure
  (`src/utils/*` pulls jsPDF/React but nothing in this chain imports them). Plain
  `node v24.12.0`.
* **Corpus:** the repo's OWN published instrument — `tests/fixtures/cartographyCalibrationCorpus.js`
  `calibrationRows()` = **504 rows** (6 tiers × 12 cultures × 7 terrains, threat and seed rotated
  by row index), driven through the real `generateSettlementPipeline`.
* **CALIBRATION — this is what makes every reading below trustworthy.** Per-tier
  `settlement.institutions.length` maxima measured:

      {"thorp":11,"hamlet":24,"village":41,"town":62,"city":55,"metropolis":63}

  The repo publishes exactly `11 / 24 / 41 / 62 / 55 / 63` at
  `tests/domain/townCartographyCalibration.test.js:218-223`, re-measured by the estate at the
  MF-CG2-on-MF-CH3 tip — **which is this slot**. Exact agreement on all six. The harness is
  generating the same settlements the estate's own frozen instrument sees.
* **Two further controls on the lifted table** (§4 needs a lift to run variants):
  * **LIFT CONTROL** — the lifted `CATEGORY_PATTERNS` reproduces the shipped
    `deriveAllDistricts` verdict on **1803 of 1803 cells, 0 disagreements**.
  * **MUTATION CONTROL** — striking the `merchant` row moves **595 of 1803** cells. The
    instrument can fail, so its agreement means something.

### 2.3 · The measured ground truth

**1,803 quarters over 504 settlements** (502 settlements produce ≥1 quarter; 2 produce none).
Twelve distinct quarter shapes fire. Live category histogram:

| category | live count | of 1803 |
|---|---:|---:|
| merchant | 595 | 33.0% |
| religious | 500 | 27.7% |
| civic | 222 | 12.3% |
| criminal | 168 | 9.3% |
| arcane | 115 | 6.4% |
| other | 88 | 4.9% |
| industrial | 71 | 3.9% |
| craft | 44 | 2.4% |
| **noble** | **0** | **0%** |
| **military** | **0** | **0%** |
| **residential** | **0** | **0%** |
| **foreign** | **0** | **0%** |

**FOUR of twelve categories are unreachable, not one.** And per-shape attribution — the exact
token that wins, in the exact text it wins on:

| n | quarter shape | live verdict | wins on | honest verdict | wrong? |
|---:|---|---|---|---|---|
| 500 | Religious Quarter | religious | `religious` | religious | ✓ |
| 222 | Government Quarter | civic | `government` | civic | ✓ |
| 168 | **Wealthy Residential** | **merchant** | `merchant`, inside the landmark **"Merchant Estates"** | noble | ✗ |
| 168 | **Common Residential** | **criminal** | `den`, inside **"Resi·den·tial"** | residential | ✗ |
| 167 | **Shadows District** | **merchant** | `market`, inside the desc **"hidden markets"** | criminal | ✗ |
| 159 | **Mages' Quarter** | arcane ×115 / **craft ×44** | `tower` / `guild` (a *drawn* landmark) | arcane | ✗ on 44 |
| 155 | **Noxious Trades Quarter** | **merchant** | `trade`, inside its own name **"Noxious Trades"** | industrial | ✗ |
| 95 | Market Quarter | merchant | `market` | merchant | ✓ |
| 71 | Waterfront District | industrial | `warehouse` | industrial | ✓ |
| 64 | Alehouse & Common | other | *(no match)* | other | ✓ |
| 24 | Fishing Landing | other | *(no match)* | industrial | ✗ (judgment) |
| 10 | **Artisan Quarter** | **merchant** | `trade`, inside the desc **"learning trades"** | craft | ✗ |

**712 of 1,803 quarters (39.5%) carry a demonstrably wrong category** (168+168+167+44+155+10).
Scored against the honest column the shipped classifier is right on **1,067 of 1,803 = 59.2%**.

### 2.4 · The two sentences that describe the defect honestly

* **The only criminal district in the product is a false positive.** `criminal` is reached by
  exactly one shape — `Common Residential`, on the substring `den` inside "Resi**den**tial". The
  actual criminal quarter, `Shadows District`, reads **merchant**. Anchor `den` and the
  `criminal` category becomes unreachable outright (measured: V1 in §4).
* **The only craft district in the product is a false positive.** `craft` is reached by exactly
  one shape — `Mages' Quarter`, on a drawn `guild` landmark. The actual craft quarter,
  `Artisan Quarter`, reads **merchant** on 10 of 10 instances.

---

## 3 · WHERE MY MEASUREMENT DISAGREES WITH THE PHRASE I WAS GIVEN

The queue carries CH-4 as **"`noble` unclassifiable"**. The fuller source is ODQ §517.2, which
states: *"0 of 10 quarters can ever classify `noble`; the histogram is
`{merchant:5, criminal:1, civic:1, religious:1, arcane:1, industrial:1}`"*, that
`Wealthy Residential → merchant` and `Common Residential → criminal` because "Resi(DEN)tial"
contains `den`, and that this is "a SECOND, unexamined inference table".

| §517.2 claim | verdict at `510c51b76` |
|---|---|
| `noble` is never produced by `districtProfile.inferCategory` | **CONFIRMED — 0 of 1,803.** |
| `Wealthy Residential → merchant`, `noble` matches but is tested later | **CONFIRMED**, and sharpened: the winning token is `merchant` inside the *landmark* "Merchant Estates", and `noble` would have matched the *first* landmark "Noble's Row". |
| `Common Residential → criminal` via "Resi(DEN)tial" | **CONFIRMED — 168 of 168.** |
| the shape-level histogram `{merchant:5, criminal:1, civic:1, religious:1, arcane:1, industrial:1}` | **CONFIRMED as far as it goes** — those ten shapes and those ten verdicts reproduce exactly. |
| "**0 of 10** quarters" | **CORRECTED — the live shape count is 12, not 10.** `Alehouse & Common` (64 instances) and `Fishing Landing` (24) both resolve to `other` and are absent from the probe. Two further authored shapes, `Roadside Shrine` and `Woodcutters' Ground`, fire **0 times in 504 settlements** and are in neither count. |
| the defect is `noble` | **REFUTED AS A DESCRIPTION — the defect is four times larger.** `military`, `residential` and `foreign` are *also* 0 of 1,803, and 712 of 1,803 quarters (39.5%) are mis-typed. `noble` is one symptom, and not the largest one: `Shadows District → merchant` (167) and `Noxious Trades → merchant` (155) are worse, because they are semantic inversions rather than absences. |
| `Mages' Quarter → arcane` | **CORRECTED — it is not a single verdict.** 115 arcane / **44 craft**, split by whether the seeded institution draw put a *guild* in its landmarks. A shape-level probe structurally cannot see this; it is the single strongest argument against any table-only repair. |
| "a SECOND … table" (a third sighting of the substring defect) | **CORRECTED — there are FOUR homes, and two are still live and uncured.** See §8.1. |

---

## 4 · CANDIDATE SHAPES AND THEIR MEASURED BLAST RADIUS

All figures over the same 1,803 cells. "moved" = cells whose category changes from the shipped
verdict. "honest" = agreement with the honest column of §2.3. "reached" = distinct categories
produced, of 12.

| # | shape | moved | honest | reached | missing |
|---|---|---:|---:|---:|---|
| V0 | **BASE** (control) | 0 | 1067 (59.2%) | 8 | military, noble, foreign, residential |
| V1 | **A — anchor only** (`\bdens?\b`, the CH-1 idiom) | 168 | 1235 (68.5%) | 8 | military, noble, **criminal**, foreign |
| V2 | **B1 — reorder only** (specificity order) | 583 | 1404 (77.9%) | 8 | military, noble, foreign, residential |
| V3 | **B2 — anchor + reorder** | 751 | 1740 (96.5%) | 10 | military, foreign |
| V4 | **C — name-first haystack**, base table | 460 | 1050 (58.2%) | 8 | military, noble, foreign, **industrial** |
| V5 | **C+ — anchor + reorder + name-first** | 628 | 1218 (67.6%) | 7 | military, noble, criminal, foreign, industrial |
| **D** | **DECLARED registry (RECOMMENDED)** | **736** | **1803 (100%)** | **10** | military, foreign |
| D′ | DECLARED, `Wealthy Residential` → `residential` | 736 | 1635 (90.7%) | 9 | military, **noble**, foreign |

**Shape A (V1) — REJECT.** It cures `Common Residential` and nothing else, and it **removes the
`criminal` category from the product** (168 → 0), because that false positive is `criminal`'s
only source. A cure that deletes a live category while leaving the real criminal quarter reading
*merchant* is worse than the disease.

**Shape B1 (V2) — REJECT.** Two measured regressions, both of the H5 shape CH-1 already
documented: `Market Quarter` **merchant → craft on 39 of 95** rows (a drawn "Guild governance"
landmark, once `craft` outranks `merchant`), and `Wealthy Residential` **merchant → criminal on
168** (unanchored `den` inside "gar·den·s", once `criminal` outranks `noble`). Reordering without
anchoring makes the wealthy quarter a slum.

**Shape B2 (V3) — the strongest table-only option, still REJECT as primary.** 96.5% honest and
it does light `noble` (168) and `residential` (168). Its residual is 63 cells: `Market Quarter`
still flips to `craft` on 39, and `Fishing Landing` stays `other` on 24. It also **rots the
arcane-classifier census** (§6.3) and it cannot ever fix the `Mages' Quarter` split, because that
split is caused by drawn text. Keep it in reserve as the fallback's shape if the chair rejects
declaration.

**Shape C (V4/V5) — REJECT, measured worse than base.** Classifying on the name first is the
intuitive move and it is refuted: `"Shadows District"` and `"Waterfront District"` both match
`district` → `residential`, so V4 scores 58.2% (below base) and loses the `industrial` category
entirely; V5 collapses to 7 of 12 reached.

**Shape D — RECOMMENDED.** 736 of 1,803 cells move (40.8%). Exact by construction — which I state
plainly rather than claim as a score: D agrees with the honest column *because D is the honest
column*. The non-circular claims for D are the ones that matter: it removes inference entirely for
every quarter the generator authors; it is immune to landmark text, so the `Mages' Quarter` split
disappears; it reaches 10 of 12 categories; it changes no persisted record shape; it does not move
`districtProfile.js:112`; and a new quarter shape either declares or reds the walker.

**Shape E — do nothing / defer to DW-1.** Cost: the B8/estate displacement loop cannot fire once
(§517.2's own finding), 39.5% of drawn districts stay mis-typed, three shipped glyphs and several
palette entries stay dead, and the wall-embrace rule keeps walling in the slums. Not recommended.

### 4.1 · Downstream blast radius of Shape D (all measured over the same corpus)

| reader | effect |
|---|---|
| `inferWealth` baseline | **544 cells move band**: `wealthy→opulent` 168 · `wealthy→poor` 167 · `wealthy→modest` 165 · `modest→wealthy` 44 |
| `inferSafety` baseline | **726 cells move band**: `watched→orderly` 212 · `watched→unsafe` 179 · `watched→lawless` 167 · `lawless→watched` 168 |
| `townLayoutV2.CATEGORY_CENTRALITY` | **692 cells change ring**: `2→6` 322 · `2→1` 168 · `6→4` 168 · `4→6` 24 · `2→3` 10. The drawn map moves. |
| `townLayoutV2.buildWall` VALUED set | **332 quarters LOSE wall-embrace, 0 gain it** — the wall stops kinking outward to enclose the Shadows District (167) and the Noxious Trades Quarter (155). |
| `institutionAssignment.CATEGORY_AFFINITY` | **303 of 504 settlements** change the district some `priorityCategory` class lands in. |
| `glyphAssign.CATEGORY_GLYPH_DEFAULT` | **`manor-hall` lights** (dead today). `towered-keep` (military) and `caravan-house` (foreign) stay dead — see §7.2. |
| `inferServices` / `inferCurrentTension` / `inferHook` | 736 cells change their district card copy. |
| `inferDominantFaction` | 736 cells re-resolve; see §7.3 for the §519 flag. |
| `fogSessions` reveal sets | **UNAFFECTED** — district ids are `district.<snake(name)>`, keyed on the NAME, not the category. A saved fog session survives intact. |
| `urbanFabricKernel` | dark behind `ONE_REGEN`; lights with the estate wave (§517.3). |

**Constitutional read.** Shape D changes the *derived* category of quarters in **already-saved**
worlds — the map redraws. That is not a new shift to declare: **§496.4 R7 already declares it**
("this wave changes the drawn map of every settlement — a declared one-time same-seed shift"), and
§517.2 rules that CH-4's shift **rides R7's rather than minting a second**. Lived history — events,
chronicle, seeds, ids — is untouched; `spatialLayout.quarters` itself is untouched byte-for-byte.
THE PROMISE holds. The **only** hard constraint this inherits is R7's: **CH-4 must land before the
ONE REGEN**, or it forces a second one.

---

## 5 · WHY NOT PUT THE DECLARATION ON THE QUARTER OBJECT

The obvious alternative — `spatialGenerator.js` writes `category: 'criminal'` onto each quarter
literal, and `inferCategory` reads `quarter.category ?? inference` — measures identically (the
same 736 cells) and is closer to CH-1's `facetOf`. **I rejected it, for three reasons:**

1. `spatialLayout.quarters[]` is **persisted**. Adding a key is a persistence-record shape change,
   which is owner-gated by nature (judgment-ledger §3), and it would turn a chair-rulable repair
   into an owner-gated one for no measured gain.
2. Saved worlds have no `category` key, so they would keep today's wrong verdicts **until the
   regen** — which means B8's loop still cannot fire on any existing save, the very thing CH-4
   exists to unblock.
3. It requires the domain layer's correctness to depend on a generator write, in a codebase whose
   stated rule is the opposite: `urbanFabricKernel.js:163-172` — *"PINNED equal by the vocabulary
   pin, never imported (engine decoupling)"*. A pinned registry plus a walker **is** the house
   idiom.

---

## 6 · COSTS AND HAZARDS OF THE RECOMMENDED SHAPE

**6.1 · Size ceilings — clear.** Neither file is in `scripts/.size-baseline.json` (ten rows, none
of them these). `districtProfile.js` is 476 raw lines, `spatialGenerator.js` 274, both far under
the 800 `src/domain` / `src/generators` layer ceiling. The exact-ceiling hazard does not bite.

**6.2 · A new test file reds THREE ratchets.** `tests/lint/quarterCategoryDeclaration.walker.test.js`
is a **CREATE**, so it costs the two census arms plus `mutationCoverageManifest`'s E-A TOTALITY arm
(TE-STACK-3). Budget the census delta as a SUM OF DELTAS from the post-edit hash, and re-read the
slot at every proof boundary.

**6.3 · ⚠ THE ARCANE-CLASSIFIER CENSUS IS KEYED BY `path:line`, AND `districtProfile.js:112` IS A
LIVE ROW.** `tests/lint/arcaneClassifierCensus.walker.test.js:157-159` carries
`'src/domain/districtProfile.js:112': 'TRUE MEMBER. District name → category: a "Tower District"
or "College Row" is masonry and teaching, and reads arcane.'` The file's own comment at :154 says
the line number is *deliberately* part of the key, and :171-172 records a prior address-rot
incident from a single added import. Line 112 is the `arcane` row of `CATEGORY_PATTERNS`.
* The **recommended** shape adds its registry **after** line 117 and edits **only line 113**, so
  line 112 does not move and the census does not rot. This is a real reason to prefer it.
* **Shape B2 (reorder) MOVES line 112 and REDS this walker.** Any reorder must update that roster
  key in the same commit, with a stated reason — the walker is SHRINK-ONLY and adding a line needs
  one.

**6.4 · `tests/domain/districtProfile.test.js` should stay green, but it must be RUN.** Its three
fixture quarters (`:45-50`) are `Religious Quarter`, `Merchant Quarter` and `Slums`. `Merchant
Quarter` and `Slums` are not generator quarter names, so they keep falling through to the keyword
table and resolve `merchant` / `criminal` as before (`slum` still outranks the anchored `den`).
`Religious Quarter` **does** collide with the registry and would resolve `religious` by
declaration instead of by inference — the same verdict the test asserts, reached by a different
route, which is worth a word in the commit body. This must be **executed**, not assumed — I could
not run it under this lane's prohibition.

**6.5 · Not verified by execution (the lane may not run the gate).** Every downstream figure in
§4.1 is computed from the shipped tables applied to measured category deltas, not from running
`townLayoutV2` / `compileTownSceneManifest`. They are **CONFIRMED** as category deltas and
**PLAUSIBLE** as rendered-map deltas. The building lane owes an executed re-measurement through
`compileTownSceneManifest` before it declares the shift, because the cartography ratchets
(`FROZEN.maxBuildings`, `DUPLICATES.*.permille`, the throw census) read that path and 692 ring
moves will not leave them all where they are.

---

## 7 · REPAIR OR NEW CAPABILITY

**CH-4 as scoped — REPAIR. The chair's to rule.** The twelve-category vocabulary, the centrality
table, the affinity table, the glyph defaults, the palettes, the wall-embrace set and the wealth /
safety baselines all already exist and all already ship. Nothing new is built. A correct
vocabulary is being fed a wrong answer by a classifier that reads drawn text; correcting it is
repair, and it is the same species of repair CH-1 already landed one layer over.

**Three riders are NOT the chair's, and I flag rather than resolve them:**

**7.1 · A `category` key on the persisted quarter record would be a persistence-shape change** —
owner-gated by nature. The recommended shape avoids it entirely (§5).

**7.2 · `military` and `foreign` stay unreachable after ANY classifier repair — that is a
GENERATOR gap, and closing it is NEW CAPABILITY.** `spatialGenerator.js` authors **no military
quarter and no foreign quarter at all**; there is nothing for a classifier to classify. Meanwhile
the estate ships `CATEGORY_GLYPH_DEFAULT.military = 'towered-keep'` and `.foreign =
'caravan-house'`, `CATEGORY_CENTRALITY` rows for both, `CATEGORY_AFFINITY.military` ranking
`military` **first**, and a `buildWall` VALUED set that includes `foreign`. Two shipped glyphs are
drawn zero times in 504 settlements. Authoring a garrison quarter and a foreign quarter is a
generator change, is owner-gated, and belongs to the estate wave.

**7.3 · ⚠ §519 FLAG — lighting `noble` attaches a POWER-scoped entity to 168 district cards.**
`districtProfile.CATEGORY_TO_ARCHETYPE.noble = 'government'`, so a `noble` district's
`dominantFaction` is drawn from **government-archetype** factions, and the governing faction is
the ruler. Measured over the corpus: **498 of 504 settlements carry ≥1 government-archetype
faction**, so this will resolve on nearly every city and metropolis. It is not a slip to "fix" by
mapping `noble → noble`, because — measured — **0 of 504 settlements carry a noble-archetype
faction at all** (§8.2); the `government` mapping is the only thing that gives a noble district
any dominant faction. **§519 says ownership is POWER-scoped — THE POWERS are the ruler's seat plus
the coup contenders. Putting the ruler's faction on the "who dominates this quarter" line of 168
district cards is a power-adjacent claim, and it is the chair's to route, not mine.** It does not
block CH-4; it blocks *asserting the district card's dominant-faction line* without a ruling.

---

## 8 · NOT CH-4 — FOUND IN PASSING, RECORDED SO IT IS NOT RE-FOUND

**8.1 · ⚠⚠ CH-1's `den` CURE DID NOT TRAVEL — TWO LIVE COPIES REMAIN, AND THEY MISS THE SAME FOUR
ROWS.** Repo-wide sweep for a bare `den` inside a classifier alternation returns three homes:
`districtProfile.js:113` (CH-4's, cured by the recommendation) and **`npcProfile.js:332` and
`npcProfile.js:373`** — two copies of the same table in one file, both
`criminal: /tavern|den|gang|black\s+market/i`, both matched against **institution names**.
Measured over the 276 distinct catalog institution names: 5 bare-`den` matches, of which
**4 are mid-word false positives** — `Resident smith (part-time)`, `Priest (resident)`,
`Warden's Lodge`, `Dragon resident`. **Those are the identical four rows CH-1 anchored in
`cohesionWeave.js`.** So the substring defect has four homes, CH-1 cured one, CH-4 cures the
second, and the third and fourth are live and shipping — a criminal NPC's `institutionLink` can
resolve to a parish priest. Both are already on the arcane census's `KNOWN_UNCONVERTED` roster
(`:160-163`), which describes them as "TRUE MEMBER" and "a fork of a fork". **Recommend a CH-7.**

**8.2 · SIX OF TWELVE FACTION ARCHETYPES ARE NEVER PRODUCED.** Over 504 settlements and 3,272
faction instances the archetype histogram is `merchant 948 · government 836 · military 538 ·
religious 397 · criminal 213 · other 171 · arcane 169`. **`noble`, `craft`, `labor`, `outsider`,
`occupation` and `civic` are 0.** `urbanFabricKernel.ARCHETYPE_TO_DISTRICT` maps all six onto
district classes (`noble`, `craft`, `industrial`, `foreign`, `military`, `civic`), so those
deposits can never fire from the archetype route — only from `FABRIC_NAME_RULES`. **`noble` is
therefore unreachable in THREE places, not one**: the district classifier, the faction archetype
detector, and the fabric ledger's archetype route. This is the finding most likely to matter to
B8 and it is bigger than CH-4.

**8.3 · TWO AUTHORED QUARTER SHAPES NEVER FIRE.** `Roadside Shrine` and `Woodcutters' Ground`:
**0 instances in 504 settlements.** `Roadside Shrine` is the `else` branch of a religious gate
whose `if` fires on 500 of 504, so it is nearly dead by construction. `Woodcutter's camp` and
`Wayside shrine` both exist in the catalog, so neither shape is unreachable in principle — they
are unreached on the golden grid. Not measured beyond that.

**8.4 · TWO OF 504 SETTLEMENTS PRODUCE ZERO QUARTERS**, and fall to
`institutionAssignment`'s `HAMLET_CLUSTER_ID` floor.

**8.5 · `districtProfile.inferInstitutions` is the same defect class, unmeasured.** It matches an
institution to a quarter by taking the first name word longer than 4 characters and asking whether
the quarter's name+landmarks `includes()` it — an unanchored substring match over the same
roster-polluted haystack. **PLAUSIBLE**, not measured; worth a probe when someone is in this file.

**8.6 · `Fishing Landing` and `Alehouse & Common` have no honest home in the 12-enum.** Both fall
to `other` (88 cells). I declare `Fishing Landing → industrial` in the recommendation, which is a
judgment against the CH-1 J-CH-1 precedent (which preferred leaving a row generic over asserting a
nearest kind). Reversal is one registry line. `Alehouse & Common` I deliberately leave `other`.

---

## 9 · WHAT I DID NOT DO

No worktree, no `npm ci`, no vitest, no `npm run check*`, no commit, no packet, no pin, no push.
No file written outside `CH4-RULING-BRIEF.md` and `laneCH4PREP-receipt.md`. Scratch artefacts
(`ch4src/`, `CH4-*.mjs`, `CH4-quarters.json`) live only in the session scratchpad and touch
nothing in the repo.

**Executed evidence backing every figure above** — CONFIRMED: the calibration, the 1,803-cell
histogram, the per-shape attribution, all eight variant blast radii, the wealth/safety/centrality/
wall/affinity deltas, the faction-archetype histogram, and the `den` catalog sweep. **PLAUSIBLE,
not confirmed** — the rendered-map consequences of the 692 ring moves (§6.5), and §8.5.
