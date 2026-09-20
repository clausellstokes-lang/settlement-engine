# FIX-D1 — the dangling institution references a generated town ALREADY carries, and one name spelled two ways

Opus RECON lane, 2026-09-19 ~20:0x–20:4x EDT, session 7d3418f8.
**Read tree** `$SP/read-tip-e5bdfd031`, HEAD `e5bdfd031`; `git status --short` **EMPTY at the start and at the end**.
Nothing written outside `$SP/lane-fix-d1-scratch/`. No vitest, eslint, npm script or build; plain `node`, one process at a time.
**ONE** 525-row generation (`gen.mjs`, 9 s, 525 rows / 0 fails / 17,361 institutions) cached to `corpus-525.json` + nine full blobs; every later pass re-read the cache.
Artefacts: `gen.mjs`, `classify.mjs`, `analysis2.mjs`, `analysis3.mjs`, `analysis4.mjs`, `analysis5.mjs`, `blobcheck.mjs`, `blobcheck2.mjs`, `corpus-525.json`, `full-*.json`, `classify.json`, `analysis2.json`, `analysis3.json`, `analysis4.json`.

---

## OUTCOME FIRST

**Of the 7,399: ZERO are real stale references.** Every one is a value that was never a reference, or a reference that still resolves.

| | count | |
|---:|---|---|
| **0** | **REAL stale references** | nothing on the five paths names a house the town once had and lost. CONFIRMED by execution on all 525 rows |
| **4,453** | **catalogue lists mis-read as references** (`rc` 2,885 + `ex.full` 869 + `ex.part` 699) | ⚠ **of which 1,568 are the SAME VALUES COUNTED TWICE.** The three exploitation buckets **partition** `resourceChains[]` (525/525 rows), so the distinct population is **2,885** |
| **2,525** | **matched catalogue PATTERNS whose label differs from the matching house's name** | not a join at all: `computeActiveChains` stores the *pattern* it matched, and **10,507 of 10,507 still match a present institution** under the producer's own matcher |
| **421** | **parenthetical sentinels that are not names** | `(arcane underground)` 246 · `(smuggling)` 173 · `(covert)` 2 |
| **0** | **near-miss joins on the five paths** | the normalised-collision scan over all five is **empty** |

`2,885 + 869 + 699 + 2,525 + 421 = 7,399` ✓ — the census's own arithmetic, re-derived.
**Distinct values: 5,831** (7,399 minus the 1,568 double-count).

**And the census could not see the two things that ARE defects.** Its path set was built by walking for strings that *equal* a roster name, so a path whose values **never** equal one is invisible:

- ⭐ **`economicState.safetyProfile.criminalInstitutions[]` — 1,164 values, 0 exact matches, 1,164 normalised near-misses.** This, not `Thieves' Guild`, is the real "one name spelled two ways": **twelve** names, Title-Case copies of roster institutions, on 273 of 525 rows. **It is on neither of EM-R6's two lists.**
- **Three more 0 %-matching paths** carrying catalogue institution names: `exploitation.unexploited[].processingInstitutions[]` (1,317), `resourceAnalysis.gaps[].missing[]` (2,016), `economicState.activeChains[].upstreamMissing[]` (636).

⭐ **And the launch's premise about the case near-miss is refuted.** `"Thieves' Guild"` is **not** a mis-spelling of a catalogue institution. There is **no** catalogue institution named `"Thieves' guild"` — the catalogue has `"Thieves' guild chapter"` and `"Thieves' guild (powerful)"`. `"Thieves' Guild"` is a **power-structure FACTION name** (`rulingStructure.js:671`). §4.

---

## 1. WHAT the dangling value IS, per path

```
$ node classify.mjs
== rc: total=3212 match=327 (10.2%) nonMatch=2885
    {"CATALOGUE-LABEL-town-has-no-such-house":2701,"EXACT-ROSTER-MATCH":327,"CATALOGUE-LABEL-town-has-a-matching-house":184}
== ex.full: total=1040 match=171 (16.4%) nonMatch=869
    {"CATALOGUE-LABEL-town-has-no-such-house":713,"EXACT-ROSTER-MATCH":171,"CATALOGUE-LABEL-town-has-a-matching-house":156}
== ex.part: total=855 match=156 (18.2%) nonMatch=699
    {"CATALOGUE-LABEL-town-has-no-such-house":699,"EXACT-ROSTER-MATCH":156}
== ex.unex: total=1317 match=0 (0%) nonMatch=1317
    {"CATALOGUE-LABEL-town-has-no-such-house":1289,"CATALOGUE-LABEL-town-has-a-matching-house":28}
== ac: total=10507 match=7982 (76%) nonMatch=2525
    {"EXACT-ROSTER-MATCH":7982,"MATCHED-PATTERN-DIFFERENT-LABEL":2525}
== crim: total=1282 match=861 (67.2%) nonMatch=421
    {"EXACT-ROSTER-MATCH":861,"SENTINEL-PARENTHETICAL":421}

partition(resourceChains == full∪part∪unex): {"ok":525,"bad":0}
rcVerbatim: {"verbatim":1327,"notVerbatim":0,"noCatalogRow":0}
acProbe: {"stillMatches":10507,"noLongerMatches":0,"exact":7982}
nearMiss: {}          globalCollisions: []          catCollisions: []
vocabSizes: {"catalogNames":280,"rcProc":42,"scProc":166,"emittedNames":231}
```

### Paths 1, 3, 4 — `resourceAnalysis.resourceChains[]` and `exploitation.{fullyExploited,partiallyExploited}[]` · **A CATALOGUE LIST. "Dangling" is the wrong word.**

**Producer:** `src/generators/resourceGenerator.js` — `generateResourceAnalysis` (`:404`) writes `resourceChains: activeChains` (`:493`), where `activeChains = evaluateEconomicActivity(terrainType, nearbyResources)` and the push is `active.push({ ...chain, chainKey })` (`:140`) over `RESOURCE_CHAINS`. **The institutions are not an input.** `exploitation` is `evaluateInstitutions(nativeInstitutions, activeChains)` (`:165-180`), which pushes *the same chain objects* into three buckets by supporter count.

Two executed proofs:

- **Verbatim:** `rcVerbatim: {verbatim: 1327, notVerbatim: 0}` — every one of the 1,327 stored `processingInstitutions` arrays is **byte-identical to the static `RESOURCE_CHAINS[chainKey].processingInstitutions`**. It is never filtered, never written from the roster.
- **Partition:** `{ok: 525, bad: 0}` — `resourceChains[]` equals `fullyExploited ∪ partiallyExploited ∪ unexploited` on every row. `3,212 = 1,040 + 855 + 1,317`; `2,885 = 869 + 699 + 1,317`.

The field's own header says so (`src/data/resourceChains.js:31-35`): *"`processingInstitutions` stays the human-readable gap-row vocabulary."* The mechanical join is `processingTags`, and `institutionSupportsChain` (`resourceGenerator.js:157`) is tag-first with exact name as *"the transitional fallback for chains with no distinct catalog capability tag"*.

⇒ **the field is a statement of what COULD process the resource.** `1,568` of the 2,885 are simply the same values re-listed under the bucket the chain landed in.

### Path 2 — `economicState.activeChains[].processingInstitutions[]` · **A MATCHED CATALOGUE PATTERN, and every one still resolves**

**Producer:** `src/generators/computeActiveChains.js:381` `processingInstitutions: matchedInsts`, where
```js
const matchedInsts = processingPatterns.filter(pattern =>
  insts.some(institution => institutionMatchesProcessor(institution, pattern)));
if (matchedInsts.length === 0) return;                                   // :292-297
```
`matchedInsts` is the **surviving subset of the static patterns**, not the matched institutions' names. `institutionMatchesProcessor` (`:76`) is **catalogId-first, 12-char-prefix fuzzy fallback** — deliberately not exact-name (`:27-36`).

```
acProbe: {"stillMatches":10507,"noLongerMatches":0,"exact":7982}
```
**All 10,507 — including all 2,525 non-exact — still match a present institution.** Step order corroborates: `generateEconomy` is step 11, after `subsumptionPass` (7), `cascadePass` (8) and `isolationPass` (9); nothing after 11 removes an institution.

### Path 5 — `availableServices.criminal[].institution` · **A PROVENANCE SENTINEL, never a name**

**Producer:** `src/generators/servicesGenerator.js`. The non-matching values are literals written by the synthetic-crime blocks: `'(lawless)'` `'(informal)'` `'(covert)'` (`:103-164`), `'(state apparatus)'` (`:188`), `'(criminal governance)'` (`:211`), `'(arcane underground)'` (`:234`), `'(religious fraud)'` (`:257`), `'(commercial crime)'` (`:280`), `'(street gang)'` `'(smuggling)'` `'(thieves guild)'` (`:300-350`). §3.

---

## 2. WHO READS each path, and what a DM SEES

| path | reader | what a DM meets |
|---|---|---|
| `resourceAnalysis.exploitation.unexploited[].processingInstitutions[]` | `ResourcesTab.jsx:114-116` | **"Needs: Weavers' guild, Dyers' guild, Fulling mill"** — ⭐ the ONE place the catalogue list reaches the page, and it is **CORRECT**: it is labelled *Needs*, on the UNEXPLOITED card, and it is telling the DM which houses are missing |
| `…exploitation.{fullyExploited,partiallyExploited}[].processingInstitutions[]` | `ResourcesTab` PARTIAL/FULL cards, `EconomicsTab.jsx:656-690` | **not rendered.** `EconomicsTab:682` reads `r.processingInstitutions?.length` only as a truthiness test; the pills print `rawResource`. The PDF (`viewModelBodySlices.js:120-123`) maps these buckets to resource names only |
| `resourceAnalysis.resourceChains[].processingInstitutions[]` | **no UI reader found** | dead display-wise; it is the partition's parent record |
| `economicState.activeChains[].processingInstitutions[]` | `EconomicsTab.jsx:175` **"Via"**; `SupplyChainsPanel.jsx:125-128`; `ServicesTab.jsx:91-97` (chain-depth keying) | **"Via  Street gang · Thieves' guild (powerful)"** — ⭐ **this is where the falsehood lives** |
| `availableServices.criminal[].institution` | `serviceComponents.jsx:69` via `InstitutionLink` | an italic attribution line reading **"(arcane underground)"**. `InstitutionLink.jsx:79-81` degrades to plain text when the name resolves to nothing — no broken link, no throw |
| ⭐ `economicState.safetyProfile.criminalInstitutions[]` | `DefenseTab.jsx:487-497` "Active criminal operations"; `EconomicsTab.jsx:756-768` "Economic operations"; `powerStateProse.js:982` (DS-POW-6); `viewModelBodySlices.js:107` (PDF "operations") | **"Thieves' Guild Chapter"** on four surfaces, beside a roster that reads **"Thieves' guild chapter"** |

### The 2,525, sorted by what a DM actually sees (`analysis4.mjs`)

```
=== THE 2525 NON-EXACT activeChains LABELS, BY WHAT A DM SEES ===
 "E. A DIFFERENT (broader/narrower) HOUSE the 12-char prefix accepted": 1870,
 "C. SAME HOUSE, DIFFERENT MAGNITUDE/QUALIFIER": 559,
 "B. THE TOWN ONLY HAS *ACCESS TO* IT — the label names the building itself": 96
 (class A, "NO MATCH AT ALL (a true stale reference)": absent)
```

The sharpest pairs (`"stored label" ← what the town actually has`):

```
"Thieves' guild (powerful)" ← Thieves' guild chapter : 312
"Parish church"             ← Access to parish church:  96
"Merchant guilds (3-8)"     ← Merchant guilds (50-100+): 84
"Cartographer's guild"      ← Cartographer's workshop :  17
"Boatyard"                  ← River boatyard
"Craft guilds (5-15)"       ← Craft guilds (100-150+) :  60
"Cathedral"                 ← Great cathedral         :  60
"Apothecary"                ← Apothecary district      : 48
```

**The three reader-visible falsehoods, in a DM's words:**

1. **A town is credited with a criminal power it does not have.** Any city/metropolis whose roster holds `Thieves' guild chapter` — e.g. `city|germanic|plains|road|civilized` (*Schwarzwalde*) — shows on **Economics › Economic Flows**: `Via  Street gang · Thieves' guild (powerful)`. The roster says *chapter*; the tab says *powerful*. 312 occurrences. `supplyChainData.js:1376` already records the mechanism in a comment: *"guild's 12-char prefix also matches the city's 'Thieves' guild chapter'."*
2. **A thorp is credited with a church it does not contain.** `thorp|germanic|riverside|river|civilized`: the roster holds **`Access to parish church`** (an access note, not a building); the Faith & Worship chain shows `Via  Parish church`. 96 occurrences, every one a thorp.
3. **A house's scale is mis-stated in both directions.** `hamlet|germanic|coastal|port`: roster `Carpenter (part-time)`, tab `Via  Carpenter`. Elsewhere the roster holds `Merchant guilds (50-100+)` and the tab says `Merchant guilds (3-8)`.

**Where the catalogue list is FINE:** `ResourcesTab`'s UNEXPLOITED card. `hamlet|germanic|plains|road|civilized` shows `Needs: Weavers' guild, Dyers' guild, Fulling mill` against a roster holding none of the three — which is exactly the sentence a needs-list should print. **This path is not a defect and must not be "fixed".**

---

## 3. `availableServices.criminal[].institution`, separately

**1,282 values; 861 name a roster institution; 421 are parenthetical sentinels; 0 dangle.**

```
criminal: {"sentinel":421,"exact":861,"other":0,
           "kinds":{"(arcane underground)":246,"(smuggling)":173,"(covert)":2}}
criminal STALE (non-sentinel, non-matching): {}
```

**Which generator, and from what.** `servicesGenerator.js`. Not a faction and not an absent guild — **a stress flag or a crime type**:
- `(arcane underground)` 246 — `stressFlags.arcaneBlackMarket` (`:222-247`) and `crimeTypes.has('Magical crime')` (`:325-331`)
- `(smuggling)` 173 — `crimeTypes.has('Smuggling')` (`:318-324`)
- `(covert)` 2 — the securityRatio fallback (`:110-122`) / `'Background crime'` (`:345-351`)

`crimeTypes` come from `generateSafetyProfile(config, tier, institutions)` (`:284`), a stress/flag derivation, and the name is a **provenance word for a service with no house behind it** — the point of the block is *"a lawless-enough settlement offers criminal services even when no criminal institution was rolled"* (`:74-76`).

**What the Services tab shows.** Under **Criminal Services**, a dark row: the service name (`Arcane services (illicit)`), its description, and an italic attribution reading `(arcane underground)`. Because `InstitutionLink` finds nothing to resolve it returns plain text (`InstitutionLink.jsx:79-81`), so the sentinel rows are un-clickable while the 861 real ones open an institution card. **The visual distinction is already correct and the register is already honest.** ⇒ **not a defect.**

⭐ **Nine of the twelve sentinel spellings are DARK over the whole golden corpus** — `(lawless)`, `(informal)`, `(state apparatus)`, `(criminal governance)`, `(religious fraud)`, `(commercial crime)`, `(street gang)`, `(thieves guild)` never fire, and `(covert)` fires twice in 525 rows. Noticed item 6.

---

## 4. The case near-miss, and the collision scan

### 4a. ⛔ THE PREMISE IS REFUTED — `"Thieves' Guild"` IS A FACTION, NOT A MIS-SPELLED INSTITUTION

```
$ git grep -n "Thieves' guild" -- src/data/institutionalCatalog.js
src/data/institutionalCatalog.js:1998:      "Thieves' guild chapter": {
src/data/institutionalCatalog.js:2435:      "Thieves' guild (powerful)": {
```
**There is no catalogue institution named `"Thieves' guild"`.** The producer of the 88-row claim's string is:
```
$ git grep -n "Thieves' Guild" -- src/generators
src/generators/npcGenerator.js:1337:            ? "Thieves' Guild"
src/generators/power/rulingStructure.js:671:      faction: "Thieves' Guild",
```
`npcGenerator.js:1333-1339` writes `enriched.secondaryAffiliation = crimeFaction ? crimeFaction.faction : (…'thieves' ? "Thieves' Guild" : 'criminal network')`, and `rulingStructure.js:671` mints the criminal **power faction** as exactly `"Thieves' Guild"`. Both branches emit the faction's spelling.

**Measured (`analysis2.mjs`):**

| fact | value |
|---|---:|
| `npcs[].secondaryAffiliation === "Thieves' Guild"` | **488** |
| `factions[].members[].secondaryAffiliation === "Thieves' Guild"` | **488** (the member mirror) |
| rows carrying it | **327 of 525** |
| rows where it is an **institution** name | **0 of 525** |
| rows where a `Thieves' guild chapter` institution also exists | **156** |
| the only thieves-institution spelling the generator emits | `Thieves' guild chapter` (156 rows) |
| per home, occurrences where a live `Thieves' Guild` FACTION exists | **329** |
| per home, occurrences where **nothing** of that name exists | **159** |

⚠ **DISCREPANCY WITH EM-R6, FOR THE CHAIR.** EM-R6 states 88; re-measured at the same tip I get **488 per home (976 across both), on 327 rows**. Neither figure is 88, and EM-R6's own disjointness arm agrees with mine (`658 faction-only` = my `329 × 2`).

**The faction proxy is validated** (`blobcheck2.mjs`, 9 full blobs, one per tier plus three controls): `powerStructure.factions[]` membership and "some NPC carries that `factionAffiliation`" **agree 9 of 9**.

**So what a rename or removal would leave behind:**
- Rename the **institution** `Thieves' guild chapter` → the 976 `secondaryAffiliation` values are untouched, **correctly**: they were never about it. EM-R6's exact-match rule (`isSameName`, not case-folded) is right here, and a case-folding cure would be a **BUG**: it would rewrite a faction handle on an institution rename.
- Rename the **faction** `Thieves' Guild` → `factionRename.js`'s `NPC_FACTION_FIELDS` already cascades `secondaryAffiliation` at both homes; the 329-per-home live handles follow. **Already total.**
- The **159 per home that name nothing** (318 across both homes) are a small free-vocabulary orphan: on `blobcheck.mjs` rows `168` (village), `252`/`300`/`504` (town) the value is present while `powerStructure.factions[]` holds no `Thieves' Guild` and the roster holds no thieves institution. Noticed item 3.

### 4b. ⭐ THE REAL "SPELLED TWO WAYS": `safetyProfile.criminalInstitutions[]`, TWELVE NAMES, 1,164 OCCURRENCES

```
=== handle near-miss (normalised, not exact) ===
 "safetyProfile.criminalInstitutions[] :: \"Front Businesses\" ⇄ \"Front businesses\"":        245
 "safetyProfile.criminalInstitutions[] :: \"Thieves' Guild Chapter\" ⇄ \"Thieves' guild chapter\"": 156
 "safetyProfile.criminalInstitutions[] :: \"Black Market\" ⇄ \"Black market\"":                144
 "safetyProfile.criminalInstitutions[] :: \"Smuggling Network\" ⇄ \"Smuggling network\"":      144
 "safetyProfile.criminalInstitutions[] :: \"Gambling Halls\" ⇄ \"Gambling halls\"":            102
 "safetyProfile.criminalInstitutions[] :: \"Smuggling Operation\" ⇄ \"Smuggling operation\"":  100
 "safetyProfile.criminalInstitutions[] :: \"Street Gang\" ⇄ \"Street gang\"":                   90
 "safetyProfile.criminalInstitutions[] :: \"Black Market Bazaar\" ⇄ \"Black market bazaar\"":   72
 "safetyProfile.criminalInstitutions[] :: \"Gambling District\" ⇄ \"Gambling district\"":       66
 "safetyProfile.criminalInstitutions[] :: \"Red Light District\" ⇄ \"Red light district\"":     18
 "safetyProfile.criminalInstitutions[] :: \"Gambling Den\" ⇄ \"Gambling den\"":                 15
 "safetyProfile.criminalInstitutions[] :: \"Underground City\" ⇄ \"Underground city\"":         12
```
`safetyProfile.criminalInstitutions[] total=1164 exact=0 near=1164 facExact=0 neither=0`

**Producer:** `src/generators/safetyProfile.js:589-616`. A frozen `CRIMINAL_INST_LABELS` map turns each matched institution into a **Title-Cased display label**; the stored value is `…find(([canonicalName]) => institutionMatchesNativeName(institution, canonicalName))?.[1]`, i.e. **the label, never the institution's own name**. The matcher (`institutionClassify.js:110-118`) is catalogId-first, so the label survives a DM rename — and therefore **freezes the OLD display name forever**.

**This path is on NEITHER of EM-R6's two lists.** It is cited in the packet only as a precedent (`EM-R6.md:415`), because the 42-path census walks for strings *equal* to a roster name and this path has **zero** of those. `factionRename.js:289` rules it non-cascaded **for factions**, with the reason *"naming an INSTITUTION rather than referring to the faction … an institution owns its own name"* — which is precisely the argument for it being an **institution** surface.

**What a DM sees.** Rename `Thieves' guild chapter` → `The Silent Hand`. The roster and the institution card change. **Defense › Active criminal operations** still reads **"Thieves' Guild Chapter"**; **Economics › Economic operations** still reads **"Thieves' Guild Chapter · protection + extraction"**; the **PDF's Shadow Economy "operations"** still prints it; and **DS-POW-6** still narrates the operation by that name. Four surfaces, one dead name, no link to click and nothing logged.

### 4c. The corpus-wide normalised collision scan

```
globalCollisions: []      # 231 distinct institution names the generator emitted, 525 rows
catCollisions:    []      # 280 institutionalCatalog names
nearMiss:         {}      # the five dangle paths
```
**No two institution names the generator can emit collide under normalisation** (lowercase, apostrophes stripped, non-alphanumerics collapsed). The collision axis is **not institution-vs-institution** — it is **a derived display label vs its own institution** (4b), and **a faction vs an institution** (4a).

### 4d. Every handle path, measured

```
npcs[].institution                     total=  297 exact=  297 near=0 facExact=  0 neither=   0
npcs[].secondaryAffiliation            total=  914 exact=  354 near=0 facExact=329 neither= 231
npcs[].corruptTies.thievesGuild        total=  354 exact=  354 near=0 facExact=  0 neither=   0
npcs[].corruptTies.criminalInstitution total=  354 exact=  354 near=0 facExact=  0 neither=   0
npcs[].linkedInstitutionIds[]          total=   25 exact=   25 near=0 facExact=  0 neither=   0
members[].institution                  total=  297 exact=  297 near=0 facExact=  0 neither=   0
members[].secondaryAffiliation         total=  914 exact=  354 near=0 facExact=329 neither= 231
quarters[].landmarks[]                 total= 4214 exact= 1664 near=0 facExact=  0 neither=2550
defenseProfile.institutions.*[].name   total= 1690 exact= 1690 near=0 facExact=  0 neither=   0
tradeDependencies[].institution        total= 2444 exact= 2444 near=0 facExact=  0 neither=   0
gaps[].institution                     total= 2059 exact= 2059 near=0 facExact=  0 neither=   0
gaps[].missing[]                       total= 2016 exact=    0 near=0 facExact=  0 neither=2016
activeChains[].dependency.institution  total= 1161 exact= 1161 near=0 facExact=  0 neither=   0
activeChains[].upstreamMissing[]       total=  636 exact=    0 near=0 facExact=  0 neither= 636
activeChains[].label                   total= 6676 exact=  168 near=0 facExact=  0 neither=6508
services.*[].institution               total=25628 exact=25207 near=0 facExact=  0 neither= 421
safetyProfile.criminalInstitutions[]   total= 1164 exact=    0 near=1164 facExact=0 neither=   0
```
Every strict EM-R6 row that *is* a reference is **100 % clean** (297/297, 354/354, 2,444/2,444, 2,059/2,059, 1,161/1,161, 1,690/1,690, 25/25). The estate's institution joins are in better shape than the headline suggested.

---

## 5. What each cure would MOVE

Every figure below is executed (`analysis3.mjs`, `analysis5.mjs`). **Persistence:** all five paths sit inside the settlement blob, which `saves.js:266,280` stores whole (`settlement.schema.js:410,413`) ⇒ **every cure leaves old saves carrying the old value**; the population becomes mixed until a regeneration.

```
=== ROWS MOVED (of 525) ===
 rowsWithCriminalInstLabels          273   (thorp 0, hamlet 0, village 0, town 105/105, city 84/84, metropolis 84/84)
 rowsWhereLabelDiffersFromRosterName 273   ⇒ 100% of rows that carry any label
 rowsWithAcPatternNotEqualRosterName 382   (thorp 12, hamlet 84, village 13, town 105, city 84, metropolis 84)
 rowsWithCatalogueNonMatching        508   (thorp 84, hamlet 84, village 84, town 100, city 84, metropolis 72)
 rowsWithCriminalSentinel            260
```

| cure | golden rows moved | prose | saved worlds |
|---|---:|---|---|
| **C-1 — `safetyProfile.criminalInstitutions[]` stores the institution's own name** (`safetyProfile.js:610-616`) | **273 of 525** | **NONE.** `operationRolePoolKey` → `criminalOpEcon` is a lowercase-substring classifier (`criminalOpRole.js:38-47`); measured **12 of 12 labels keep the identical role** (`"Thieves' Guild Chapter" → "Thieves' guild chapter" :: protection + extraction → protection + extraction (SAME)`). DS-POW-6's pool key is unchanged | old saves keep Title Case |
| **C-2 — `computeActiveChains` stores the MATCHED INSTITUTION'S name instead of the pattern** (`computeActiveChains.js:381`) | **382 of 525** | ⚠ **YES.** DS-GEN-18's `{institution}` fill changes on **1,306 chain rows across 370 of 525 settlements** (`craftInstitutionFill`); the **pool KEY is unchanged on 525 of 525** (`craftReasonPoolKey`) ⇒ same variant, different printed word. Sample: `Parish church → Access to parish church` | old saves keep the pattern |
| **C-3 — `resourceChains`/`exploitation` store the filtered roster subset** | **508 of 525** | not measured — ⛔ **and it should not be built**: it destroys the *Needs* list (§2) | — |
| **C-4 — `availableServices.criminal` sentinels** | **0** | — | **no cure owed** |
| **C-5 — EM-R6 list/ledger edits only** (reclassifications) | **0 generated bytes** | none | none |

⭐ **C-2 carries a hazard the chair must weigh:** the cured value is the *roster* name, so `SupplyChainsPanel.jsx:126` (`instNames.some(n => n.includes(name.split(/[\s(]/)[0]))`) starts matching exactly instead of fuzzily, and the `Via` line for a thorp would read **"Access to parish church"** — honest, but reading as a location rather than a workshop. The chair may prefer C-2′: keep the pattern **and** carry the matched name beside it.

---

## THE PROPOSAL

### (A) Cures that move NO golden — buildable by a parallel fix lane at once

| # | act | price |
|---|---|---|
| **A1** | ⭐ **Add `economicState.safetyProfile.criminalInstitutions[]` to EM-R6 — as a `NON_CASCADED` row with a written ruling, or as a cascade row under a NORMALISED match.** Today it is on neither list, and the packet's own denominator pin (an exact-name whole-blob walk) can **never** find it. | EM-R6 list only; 0 generated bytes. ⚠ **It changes EM-R6's ledger from 5 rows to 6, or its cascade from 38 declared rows to 39 with the estate's FIRST non-exact match rule.** The chair rules which |
| **A2** | ⭐ **Add `resourceAnalysis.exploitation.unexploited[].processingInstitutions[]` to whichever list rows 24–26 land on.** The three buckets **partition** `resourceChains[]` (525/525), so EM-R6 as written would rewrite the same chain row in two of its three homes and leave the third stating the old name — an internal contradiction inside one record. | EM-R6 list only; 0 bytes |
| **A3** | **Add `resourceAnalysis.gaps[].missing[]` (2,016) and `economicState.activeChains[].upstreamMissing[]` (636) as declared rows.** Both hold catalogue institution names, both are 0 %-matching, both are invisible to the census. | EM-R6 list only; 0 bytes |
| **A4** | ⛔ **Replace EM-R6's denominator pin with one that cannot be vacuous.** Its current form — *"walk the blob for strings equal to a roster institution name; require every path found to be on one of the two lists"* — is **blind by construction to every path in A1–A3**. Add a second arm: walk for strings equal to a **catalogue institution name** (280 of them) or **normalised-equal to a roster name**, and require the same. This arm alone would have found all four. | test-side; 0 bytes. This is the structural prevention for the whole finding |
| **A5** | **Record the sentinel vocabulary.** Declare in `servicesGenerator.js`'s header that `availableServices.*[].institution` may hold a parenthetical provenance sentinel, and pin the closed list of twelve, so a future removal rule does not treat `(covert)` as a name. | comment + one test; 0 bytes |

### (B) Cures that move goldens — for the OWNER's door

**B-1 — `safetyProfile.criminalInstitutions[]` should store the house's own name.** *(273 of 525 golden rows; 0 prose rows; town/city/metropolis only)*

> **Today:** a DM renames their **Thieves' guild chapter** to **The Silent Hand**. The roster changes. Then the Defense tab's *Active criminal operations* still lists **"Thieves' Guild Chapter"**, the Economics tab's *Economic operations* still lists **"Thieves' Guild Chapter · protection + extraction"**, and the printed dossier's Shadow Economy still names it. The DM has two names for one gang and no way to tell which is live.
> **After:** those surfaces read **"The Silent Hand"**. Nothing else changes — the role word (*protection + extraction*), the counts and the percentages are identical, measured on all twelve labels.
> **The price:** 273 of the 525 golden rows must be re-signed, because the stored spelling goes from Title Case to the roster's own case (`"Street Gang"` → `"Street gang"`). Every settlement a DM has already saved keeps the old Title Case until it is regenerated.

**B-2 — `activeChains[].processingInstitutions[]` should name the house that matched, not the pattern.** *(382 of 525 golden rows; 1,306 prose FILLS across 370 rows; 0 prose pool keys)*

> **Today:** a thorp whose only religious presence is **"Access to parish church"** shows, on Economics › Economic Flows: **`Via  Parish church`**. A city holding a **Thieves' guild chapter** shows **`Via  Street gang · Thieves' guild (powerful)`** — it is credited with a *powerful* guild it does not have (312 occurrences). A hamlet with a **Carpenter (part-time)** shows **`Via  Carpenter`**.
> **After:** the thorp reads `Via  Access to parish church`; the city reads `Via  Street gang · Thieves' guild chapter`; the hamlet reads `Via  Carpenter (part-time)`. Every line names a house on the roster.
> **The price:** 382 of 525 golden rows re-signed. The **DS-GEN-18 sentence's `{institution}` word** changes on 1,306 chain rows across 370 settlements — the *same* sentence variant, a different house named in it. The dossier prose corpus is not re-selected (pool key identical on 525/525), so no prose-manifest row is added or removed; the drawn text moves.
> ⚠ **The owner should be asked the narrower question too:** the thorp line becomes *"Via Access to parish church"*, which is true and slightly odd. The alternative (**B-2′**) keeps the pattern as the label and adds the matched house beside it, at the cost of a new persisted key.

**B-3 — leave `resourceChains`/`exploitation` alone.** *(508 of 525 rows if built)* — recorded so the option is on the table and refused with a reason, not forgotten: filtering the catalogue list to the roster would **delete the ResourcesTab *Needs* list**, which is the one place the field reaches a reader and the one place it is already correct.

### (C) Reclassifications — a path that is a catalogue list should be DECLARED one

| # | path | declare it | why, measured |
|---|---|---|---|
| **C-a** | `resourceAnalysis.resourceChains[].processingInstitutions[]` · `…exploitation.{fullyExploited,partiallyExploited,unexploited}[].processingInstitutions[]` (**EM-R6 rows 24, 25–26, + the missing unexploited arm**) | **a CATALOGUE VOCABULARY, not a reference** | 1,327 of 1,327 arrays byte-identical to `RESOURCE_CHAINS`; the roster is not an input to the producer (`resourceGenerator.js:493, :140`); the field's own header calls it *"the human-readable gap-row vocabulary"*. **The institution cascade's totality walker and the merge's referential invariants must stop counting these 2,885 as joins.** ⚠ Cascading them (EM-R6 as written) rewrites a generic vocabulary word into a town-specific one and, because the buckets partition the parent, leaves the record disagreeing with itself |
| **C-b** | `economicState.activeChains[].processingInstitutions[]` (**EM-R6 row 13**) | **a MATCHED PATTERN, joined by `institutionMatchesProcessor`, not by name** | 10,507 of 10,507 still match; 2,525 do not match by name and **0** fail the real matcher. A rename cascade keyed on exact name touches 7,982 of 10,507 and silently leaves the other 2,525 — ⛔ **splitting one chain's `Via` line into renamed and un-renamed halves.** The correct rule for this row is the producer's own matcher, or a declared ruling that the label is vocabulary |
| **C-c** | `availableServices.criminal[].institution` (**EM-R6 rows 2–12**) | **may hold a closed-vocabulary SENTINEL** | 421 of 1,282 are parentheticals; 0 dangle. The removal rule *DROP THE ENTRY* is safe (a sentinel never equals a name) but the vocabulary should be written down so a future normalised or fuzzy match rule cannot reach it |
| **C-d** | `economicState.safetyProfile.criminalInstitutions[]` | **a DERIVED DISPLAY LABEL of an institution** — the estate's only 100 % near-miss surface | 1,164 of 1,164; 12 spellings; on neither EM-R6 list |
| **C-e** | `npcs[]`/`members[].secondaryAffiliation === "Thieves' Guild"` | **a FACTION handle, correctly spelled** — ⛔ **not a mis-spelled institution** | `rulingStructure.js:671` mints the faction with that exact string; **0 of 525 rows** carry it as an institution name; the catalogue has no bare `"Thieves' guild"`. ⭐ **EM-R6's exact-match rule is CORRECT here and a case-folding cure would be a live bug** — it would rewrite a faction handle on an institution rename |

---

## NOTICED, NOT TOUCHED (nothing is deferred — each item slot-ready)

1. ⛔ **EM-R6's `"Thieves' Guild"` sentence (§6 "THE MATCH RULE", `EM-R6.md:375-377`) rests on a catalogue institution that does not exist**, and its figure of **88** does not reproduce (measured **488 per home / 976 / 327 rows** at the same tip). **Slot: a one-line amendment to EM-R6 §6 before the chair rules R6′, replacing "beside the catalogue institution `Thieves' guild`" with the faction fact.**
2. ⛔ **EM-R6's cascade would make a record disagree with itself.** Rows 24 and 25–26 cascade `resourceChains[]` and two exploitation arms; the third arm (`unexploited`, 1,317 values) is undeclared, and the three **partition** the parent (525/525). **Slot: EM-R6's surface table, this sitting — it changes the declared-row count.**
3. **318 orphan `"Thieves' Guild"` literals** (159 per home) sit in towns where no such faction and no thieves institution exists — `npcGenerator.js:1337`'s free-vocabulary fallback firing when `crimeFaction` is null. On no cascade's reach and naming nothing. **Slot: a small guard in `npcGenerator.js` (use `'criminal network'` when no criminal faction exists), or a written ruling that the literal is intentional colour.**
4. ⛔ **EM-R6's denominator pin is vacuous for four paths** (A4). An exact-name whole-blob walk cannot see a path whose values never equal a roster name, and four such paths hold catalogue institution names: `criminalInstitutions[]` 1,164, `gaps[].missing[]` 2,016, `unexploited[]` 1,317, `upstreamMissing[]` 636. **Slot: EM-R6's A1 test arm — this is the structural prevention for the whole class.**
5. ⚠ **The 12-char-prefix processor matcher is the engine of every reader-visible falsehood in §2** (`computeActiveChains.js:39` `lowerName.includes(pattern.slice(0,12))`). Its header already freezes one known false match (`'Mill' → 'Access to external mill'`); measurement finds the family is larger — `"Thieves' guild (powerful)"` accepting `Thieves' guild chapter` (312), `"Parish church"` accepting `Access to parish church` (96), `"Cathedral"` accepting `Great cathedral` (60). **Slot: its own recon or a row in EM-P1b's class; a prefix change is a golden-moving generation act.**
6. **Nine of the twelve criminal-service sentinels are DARK** over 525 rows (`(lawless)`, `(informal)`, `(state apparatus)`, `(criminal governance)`, `(religious fraud)`, `(commercial crime)`, `(street gang)`, `(thieves guild)` never; `(covert)` twice). `servicesGenerator.js:124-152` contains a block whose own comment says *"The village fallback's own conditions can never hold here"* — preserved deliberately. **Slot: a coverage note, or a ratchet pinning the live-vs-dark split so a future edit cannot silently light one.**
7. **`activeChains[].label` (EM-R6 row 38) collides with an institution name on 168 of 6,676 chains** — it is a chain's *display label* (`computeActiveChains.js:375`), taken from `SUPPLY_CHAIN_NEEDS`, that happens to equal a roster house. Cascading it under exact match rewrites a chain's title on a rename. EM-R6 already rules it report-only for removal; the RENAME arm still sets it. **Slot: EM-R6's R3(iii) ruling — the rename half was not separately justified.**
8. **`quarters[].landmarks[]` (EM-R6 row 35) carries 2,550 non-roster values** against 1,664 roster copies — the fixed literal tables in `spatialGenerator.js`. EM-R6's §5 records 60 fixed-table entries *among the matches*; the un-matched residue is 60 % of the path. Harmless for a cascade (it is exact-match) but the row's `why` under-states its population. **Slot: one figure correction in EM-R6 §5.**
9. **`corruption.js:596` and `safetyProfile.js:610` compute the same fact twice with different spellings** — `readCorruptionClimate` reads LIVE roster names, `safetyProfile.criminalInstitutions` stores FROZEN Title-Case labels, and both are read at runtime (`affordanceManifest.js:231` live; `DefenseTab.jsx:272` frozen). A DM can meet both spellings of one gang on two surfaces without any edit. **Slot: whichever packet takes B-1; it is the same defect from the other end.**
10. **`institutionMatchesNativeName` is catalogId-first** (`institutionClassify.js:110-118`), so the Title-Case label *survives* a rename for the 88 % of stamped institutions and *vanishes* for the 12 % anchored `name:` — i.e. B-1 left undone interacts with the `catalogId` re-stamp question (ODQ §934.59): under "NO", renaming a cascade-added criminal house silently **drops** it from the operations list instead of showing a stale name. **Slot: a sharpener on the owner's §934.59 question.**
11. **`resourceAnalysis.resourceChains[]` has no UI reader** found anywhere in `src/components` or `src/pdf`; it is read only as the exploitation partition's parent. 3,212 stored values, 2,885 of them non-roster, that no reader meets. **Slot: a dead-surface note for DEAD_CODE_DISPOSITION, or an EM-R6 `why` row explaining the cascade cost buys no reader.**
12. **The generator emits only 231 distinct institution names** against a 280-name catalogue over the full 525-row corpus — 49 catalogue institutions are never produced by any golden row. Not a defect; relevant to any coverage claim made from the corpus. **Slot: one line wherever corpus coverage is asserted.**
