# DW-0 — THE DWELLINGS CHARTER, COMPILED

**Lane DW-0 (compile). Chair: Fable 5. Owner-ordered under ODQ §482 — the DW program lands before `/code-review ultra`.**
Base: `claude/composite-r4` = `79b78881ca86612ec312602c2e3dc6d06aa34df8` (54 landings).
Research frozen at **`refs/preserve/research-dossiers-2026-08-23`** = `029268fe579b2cbd64e9941b66e77639133f072e`.
This compiled charter's first pass is held at **`refs/preserve/holding-dw0`**; **this repaired pass is
held at `refs/preserve/holding-dw0-repaired` = `96e021b0b`.** The AD charter it seams to is at
**`refs/preserve/ad-charter-2026-08-24`** = `f23e7978e`.
⚠ **The packet count is 176, not 175** — CG-2 minted `MF-CG2` and its landing is imminent. **175 is
hardened nowhere in this document and must not be.** **Both are named refs, not loose shas —
`029268fe5` is an ORPHAN preserve commit reachable from no branch, and the chair must confirm both refs
are protected before anything cites them.**

> ### ⛔ THE STANDING COMPILE RULE THIS CHARTER LEARNED THE HARD WAY
> **An absence claim inherited from a frozen dossier is RE-MEASURED AT THE SLOT, because absence is the
> one claim that decays silently.** A "does not exist" becomes false the moment somebody creates the
> thing, and nothing signals it. The first compile of this charter asserted three times, in the present
> tense, that UC-5 `connectivity.js` "does not exist at any ref" — it is **28,261 bytes** at this base —
> and chartered a car to ship that sentence into every plan and pin it with a passing test. The root
> cause was structural: **the compile reconciled against `029268fe5`, which `git merge-base` shows is
> NOT an ancestor of the declared base** (exit 1, no output). Six cars landed in the gap. See §F.0.
> Every "Today" integer in this document is now base-stamped or re-measured.
>
> ### ⭐ AND THE DECAY RUNS IN BOTH DIRECTIONS — the rule as amended on this charter's own evidence
>
> ODQ §543's first form named only the vanishing absence. **A third pass found the inverse and the
> rule now names both:**
>
> | Direction | The dossier said | What was true at the slot | Instance |
> |---|---|---|---|
> | **An absence that has since been FILLED** | "UC-5 does not exist at any ref" | 28,261 B, landed | B2 |
> | **A presence that never ARRIVED** | "CH-1 adds a per-entry `interiorKind` override" | zero occurrences; CH-1 shipped the anchoring only | C-24 |
>
> **Both are the same mistake — trusting a frozen dossier as ground truth for ENGINE STATE when it
> is only ground truth for RESEARCH.** A dossier describes the world on the day it was written: it
> can be overtaken by work that lands, and it can describe work that never lands. **Re-measure at
> the slot in both directions, and never restate a dossier's engine claim in the present tense.**
Owner signature of record: `SIGNED-BANDS-2026-08-23` (signed in chat 2026-08-23 21:32 CDT; ODQ §514/§515).

> **THE FIRST LINE OF THIS CHARTER, UNCHANGED FROM THE DRAFT AND RE-EARNED BY EVERY TRANCHE.**
> **MOST CATALOG ENTRIES ARE NOT BUILDINGS.** A catalog row is not a structure. Six literatures
> agree: 3 of 28 criminal rows get a building of their own and 11 get no cell anywhere; roughly
> 30 of 124 trade rows have no building at the floor, four of them REQUIRED; 14 of 40 hospitality
> rows are hosted-or-nothing. The engine resolves every institution to a template and draws a box.
> That gap is what this program exists to close, and §E's three relations are the answer.

---

## §A · WHAT THIS DOCUMENT IS, AND HOW IT LAYERS

This is the **ruled layer** over the ratified draft. It does not restate the draft's evidence.

| Instrument | Where it lives | What it is | Status after this compile |
|---|---|---|---|
| `charters/draft-DWELLINGS-CHARTER.md` (237,547 B) | preserve ref `029268fe5` | the evidence body: 31 measured engine claims, the nine laws against the research, the vocabularies, the contracts, the wave plan, the band sitting as QUESTIONS, the amendment record AR-1..AR-13 (**AR-13 is the row that fixes the band count to 20 with BAND ZERO**) | **STANDS as the evidence of record.** Every measured figure below is its figure, cited not copied. |
| `charters/draft-DWELLINGS-ARCHITECTURE.md` (141,659 B) | preserve ref `029268fe5` | the module tree, the concrete contract shapes, the per-car `changeManifest` and acceptance arms with their convicting mutants | **STANDS — but it covers only 17 of the 41 DW cars.** ⛔ **DW-R, DW-3, DW-4, DW-5, DW-6, DW-7 and DW-S — 24 cars, more than half the program — are owed a `changeManifest` and named mutants BEFORE their wave dispatches.** That is a hard gate, not a note (ruling R4). |
| `docs/DESIGN_DWELLINGS_PROGRAM.md` (31,733 B) | branch `review-fixes-2026-07-08` only | the PARENT design doc — thesis, nine laws, pipeline, §9's rough wave scale | **STANDS as the parent.** Superseded on wave sizing by the draft and by §F. |
| **this document** | — | the SIGNED bands turned from questions into rulings; the wave/car reconciliation; **an observable exit criterion for every wave**; the G-defect disposition; the conflict list | the layer the chair rules from |

**Why a layer and not a rewrite.** Restating 237 KB of measured evidence would create a second
truth about every figure and would risk a transcription error on numbers the estate spent six
research lanes producing. The draft is frozen at a ref and is citable. This layer changes what is
RULED; it does not re-derive what was MEASURED. *(Judgment call J-DW0-1, §J.)*

**⚠ Where the dispatch's file map and the repository disagree — measured, this lane.**
The dispatch named `docs/DESIGN_DWELLINGS_PROGRAM.md` (~237 KB) and "the dwellings architecture
doc alongside it" (~141 KB) on branch `review-fixes-2026-07-08`. Measured with `git cat-file -s`:
on that branch `docs/DESIGN_DWELLINGS_PROGRAM.md` is **31,733 B** and **no dwellings architecture
doc exists there at all**. The ~237 KB and ~141 KB documents are `charters/draft-DWELLINGS-CHARTER.md`
and `charters/draft-DWELLINGS-ARCHITECTURE.md` in the preserve ref. **Neither charter nor
architecture exists at the build slot `79b78881c`, nor on `master`.** All three documents were
read. The landing path for this compile is the chair's to set; it is written here to the build
slot's tree as a new file precisely because nothing it would overwrite is present. *(Conflict C-12.)*

---

## §F.0 · WHAT IS ALREADY LANDED AT THIS BASE

**This table is the repair for the root cause.** The first compile reconciled against an orphan
research ref and billed landed work as pending. Every row was re-measured at `79b78881c` by this
lane with `git merge-base --is-ancestor` and `git cat-file -s`.

| Car | Status at `79b78881c` | sha | Measured evidence | What the charter must therefore NOT do |
|---|---|---|---|---|
| **CG-1** | **LANDED** | `d78011665` | ancestor of the base | Never bill CG-1 as pending. Its throw-rate criterion is **DISCHARGED**. |
| **CG-1b** | **LANDED** | `3e9d2d888` | ancestor; the derived caps — `CARTOGRAPHY_HEADROOM_PERMILLE = 1600` at `cartographyTuning.js:95` under a header reading "THE DECLARED HEADROOM (BAND 21, owner-signed 2026-08-23)" | Never quote "16 of 48 / 32 throw". CG-1b took it to **0 of 504** *before this base commit was written*. **CG-1b is signed band B21's consumer.** |
| **CH-1** | **LANDED — but NARROWER than the draft said** | `b2852ccc3` | ancestor. ⛔ **Measured this lane: CH-1 shipped the `\b`-ANCHORING and NOT the per-entry `interiorKind` override.** `FACET_INFERENCE` is fully anchored at the slot (`\btemple`, `\bdens?\b`, `smiths?\b` …), but **`interiorKind` occurs in ZERO catalog rows and ZERO in `cohesionWeave.js`** — the only override channel that exists is a declared `facets` key on a catalog row. | Never hand CH-1 a work order — **and never claim DW "reads `interiorKind` where declared".** There is nothing declared to read. The draft's §0.6 described a CH-1 scope that did not land, and the first pass of this charter repeated it. See §I C-24. |
| **CH-2A** | **LANDED** | `17fe89763` | ancestor — 28 arcane rows carry a declared licence | `magicLicense` is a **consumable input today** for the CH-2A half. |
| **UC-5** | ⭐ **LANDED** | `f4df874ce` | `src/domain/undercity/connectivity.js` = **28,261 B**; `CONNECTION_CLASSES = ['NATIVE','ADJACENCY_BREACH','FUNDED_LINK']` at `:128`; header law **"ONE PRODUCER PER JOIN"** at `:13-14` | **Never say UC-5 does not exist.** DW-4 draws components *and* may consume routes. See §G's DW-4 row. |
| **MP-1** | ⭐ **LANDED — inside this very base commit** | `9e5059cec` | `src/domain/townCartography/cartographyProperty.js` = **9,141 B**, exporting `buildPropertyLineIndex` / `propertyLineForAnchor` / `membersOf` / `openGroundOf`; `@enforced-by tests/domain/townCartographyProperty.test.js`; mounted at `SettlementMapPane.jsx:601` | **DW-6d is a CONSUMER, not a producer** (ruling R7). Its header already states the DW contract verbatim: when typed `CompoundMember` rows land, `membersOf` reads them **instead** and *"the RETURN SHAPES below do not move"*. |
| **CH-2** | ⚠ **HALF** | — | CH-2B holds at DRAFT (ODQ §520.5) | Treat only the CH-2A half as available. |
| **CG-2** | **OUTSTANDING** | — | `MF-CG2` has no landing at any ref | The **only** live CG car. Its identical-footprint criterion is the only live half of the old CG exit. |
| **CH-3** | **OUTSTANDING** | — | in flight | §B. |
| **CH-4** | **OUTSTANDING** | — | ODQ §517 ruled the B8 `noble`-unreachability repair into it | ⛔ **EST-5's real prerequisite.** |
| **CH-5** | **OUTSTANDING** | — | chair §541: ships **Shape F** — move `alchemy` alone into a sibling `TRADE_INST_TAGS` and de-tag the three `none`-licensed rows | The cure for G3. |
| **CH-6** | **OUTSTANDING** | — | chair §541: takes the `ARCANE_INST_KW` keyword list, which **carries a live deity-doctrine violation** | Not DW's, and DW must not touch the keyword list. |

**⚠ The one instrument note that makes this table trustworthy.** `git merge-base 029268fe5 79b78881c`
exits **1 with no output** — the research bundle is an orphan, so *nothing* in it can be read as a
statement about this base. Ancestry was tested per-sha with `--is-ancestor`, which returns a status
rather than a string and therefore cannot echo a false positive the way a bare `git rev-parse` can.

---

## §B · THE PROVISIONAL-DATA CLAUSE — CH-3 IS RUNNING UNDER THIS COMPILE

**Chair ruling received mid-lane and recorded here so it is not re-litigated.**
`charters/draft-CATALOG-HYGIENE-PLAN.md` line 5 states its three repair cars land "before DW-0".
The pickup card orders all CH cars before DW's BUILD waves and orders this compile now.
**The chair has ruled in favour of the pickup card.** The plan doc's line 5 is stale and should be
corrected at CH's next touch, or a later reader will re-open a settled question. *(Conflict C-13.)*

**The consequence, which is binding on every figure in this charter.**
CH-3 has **not landed** and will change live catalog data. Confirmed incoming:

| CH-3 change | What it moves | What this charter may therefore not harden |
|---|---|---|
| `exclusiveGroup: 'religiousCenter'` deleted from the two **city** rows | re-rolls the whole city/metropolis institutional roster — **81 of 420 settlements change, ~130 institution names move** | any institution frequency, any per-tier roster count, and above all **DW-R2's row set**, which is keyed to "every catalog row that can fire at a tier" |
| **26 redundant `minTier` declarations deleted** | ⛔ **CORRECTED: NOT tier-eligibility.** The plan measures that deleting a *redundant* `minTier` **cannot change the gate's verdict** — that is what "redundant" means. The two real effects: the key is spread by `assembleInstitutions`, so **the record and the corpus digest move**; and CH-3's reader fix **will red `tests/generators/metropolisCatalogReachable.test.js`'s ratchet arm** | Do not claim this row moves tier-eligibility. **Name that test as a known CH-3 red DW must NOT attempt to fix.** |
| UI catalog readers gain a `minTier` filter | the UI-visible set becomes equal to the generator-eligible set at every tier; **10 city rows the generator could never produce disappear from the UI** | any claim about what a user currently sees in the catalog |

**THE STANDING RULE.** No live-catalog roster count, institution frequency, or UI-visible set is
hardened anywhere in this charter. Each is marked **PROVISIONAL-ON-CH3** with its dependency named.
Where a figure can be reasoned from the frozen dossiers instead of from live catalog state, the
dossier is preferred, because the dossiers cannot move under us.

**⛔ THE CLASS SPLIT — the first compile filed five rows in the wrong class and built a false
disposition on it.** `draft-CATALOG-HYGIENE-PLAN.md` §3.1 measures: *"311 rows, 36 carry `minTier`,
**26 REDUNDANT** … **10 ABOVE-BLOCK**, **0 BELOW-BLOCK**"* — and the classes are **disjoint by
definition**. R-INST-6 **D6-1** and R-INST-5 **G2**'s four rows are **ABOVE-BLOCK rows #1–#5, not
members of the 26.** J-CH-3-1 (approved at ODQ §538.5) **KEEPS** them and legitimises "author here,
gate there", deleting only the 26 no-ops.

The first compile said they "are members of CH-3's 26 redundant class … both may be wholly absorbed",
added that it was "not measurable until CH-3 lands", and then two sentences later put the same rows
among "the 10 city rows that vanish from the UI" — contradicting itself. **All three statements are
struck.** The "not measurable" clause was false at the same frozen ref, where `CH-mintier-audit.mjs`
had already measured it.

**The affirmative rule this hands DW-R2, and it is load-bearing:** *for an above-block row the firing
tier is the `minTier`, permanently.* DW-R2's (a) denominator **excludes them at the authoring block**.
Without this rule DW-R2 authors up to ten phantom city-tier `ProgramMinimum` rows, reds its own
(a)=(b) equality, and the standard repair — widening (a) — destroys the no-tier-holes guarantee that
signed band B1 exists to give. **This is permanent, not provisional.**

⚠ **And the "four `high magic` rows" phrasing is wrong.** Measured at the slot, `(high magic)` returns
**three** rows (`institutionalCatalog.js:2192, 2201, 2210`); the fourth row in G2 is `Dragon resident`
(`:2167`), which carries `tags: []` and `magicLicense: 'none'`. R-INST-5's own header says only "FOUR
ROWS" — the "high magic" qualifier was the compile's addition.

**Stale in the draft.** The draft's §0.6 CH-3 row says CH-3 changes "the **five** `minTier:'metropolis'`
rows authored in the CITY block". R-INST-5 G2 names **four**. The chair's live word says **26**
redundant `minTier` declarations plus the `religiousCenter` deletion plus the UI filter. **The draft's
§0.6 CH-3 row is stale and must be re-written from CH-3's own landed packet, not from memory.**
*(Conflict C-7.)*

**PROVISIONAL-ON-CH3, the exhaustive list of what in this charter depends on it:**
DW-R2's row count and its per-tier coverage · the DW-R2 walker's own denominator · every
`ProgramMinimum` row for a religious institution at city or metropolis tier · the B2 verdict split
restated per shelf · DW-1's consumption of `interiorKind` (CH-1) and `magicLicense` (CH-2) ·
the DW-S soak corpus, which must be regenerated post-CH-3 or its baseline is a different world.

---

## §C · THE SIGNED BANDS AS RULINGS

The draft's §7 asked eighteen bands plus BAND ZERO as QUESTIONS. The owner has signed. **These are
now rulings, not recommendations, and where a draft recommendation survives it survives because it
was not struck — not because it was re-ratified.**

### C.1 · B1 — SCALE. Every tier carries a minimum program; nothing is exempt.

> *"this is scaled, everything should be credible but what is credible is scaled by the tier and
> other factors. A hamlet inn may just have two rooms plus a kitchen, not a full multi-story
> building. but always everything is bite"*

**RULED.** No tier is exempt. Every tier carries a **MINIMUM PROGRAM**; small tiers carry small
ones. **HOSTED and NO_BUILDING are programs in their own right, never exemptions from the gate.**
This supersedes the chair's "bite from village up".

**The scale primitive already exists and DW must not mint a second.**
`PLAN_UNIT_CM_BY_TIER = { thorp:10, hamlet:14, village:20, town:30, city:50, metropolis:80 }` at
`src/domain/townScene/compileTownSceneManifest.js:99-108`, read at `:286` into `planUnitCm`,
shipped as `space.planUnitCm`, validated at `manifestContract.js:216`, and **already read inside
the cartography stage** at `cartographyBuildings.js:333`. *(Re-verified by direct read this lane;
the line numbers hold at the build slot.)* Every DW figure in feet is
`slotFaceLength × planUnitCm[tier] ÷ 30.48`. **A DW-minted scale is refused by this charter.**

**⛔ THE DEPTH POLICY IS RULED HERE, NOT LEFT IN §I (ruling R5): POLICY TIER = `HONEST`** — unstruck by
the signature and **marked TASTE** — **and COVERAGE = no tier holes**, which is signed. The two answer
different questions and both are now in force. **The tier joins DW-R's exit**, so a row authored at
SPARE or GENEROUS is a detectable defect. The first compile left `HONEST` on exactly one line of the
whole document — inside a conflict row — while §C.1 ruled B1 without it, and unlike EST-5 the long-pole
table was not marked gated on the question. A lane could have sized roughly 311×N minimum cell sets on
its own taste.

**What B1 costs DW-R2, and it is the program's long pole.** "No tier is exempt" means the
`ProgramMinimum` table has **no tier holes**: for every catalog row and every tier at which it can
fire, exactly one row, carrying a verdict (BUILDING / HOSTED / NO_BUILDING), a minimum cell set,
and a citation. The draft's §3.2 carries 16 worked exemplars. The table under them is
PROVISIONAL-ON-CH3 in its row count, because CH-3 changes which rows fire at which tier.

**The signed-knowingly caveat carries forward unchanged.** Our towns read ~244 m across and
metropolises ~646 m — two to three times small in absolute metres. Pre-existing property of the
map, not introduced by DW; correcting it moves every 3D scene. Deferred as **D-10** to the massing
train. It is recorded here so that no DW lane "fixes" it inside a dwellings car.

### C.2 · B8 — PLOTS MERGE AND DISMERGE. A two-way demographic loop, not a rate.

> *"plots merge and dismerge appropriately according to prosperity and wealth placement… it is not
> a percentage idea, it is dependent literally on the makeup of the cities demographics… the
> opposite is true too"*

**RULED, and it strikes the draft's own recommendation.** The draft's B8 recommended acquisition
from the `prosperous` rung upward at a base rate tuned so that "over 300 years 5–15% of a town's
plots have been amalgamated at least once, concentrated on the plots with the longest frontage."
**That is a percentage, and the owner has ruled that this is not a percentage idea.** The draft's
B8 recommendation is **STRUCK**, not softened. *(Conflict C-3.)*

**What replaces it, in the owner's own terms, stated as two limbs that must BOTH exist:**

| Limb | Driver | What it does to the map |
|---|---|---|
| **CONCENTRATION** | wealth arrives — the settlement's demographic makeup shifts toward prosperity, and wealth is PLACED somewhere in particular | poor plots merge into estates; the residents of those plots are **displaced**; new building is pushed **down-chain to the outskirts** |
| **DISPERSAL** | the rich leave or fall — prosperity declines | estates **split back apart** and sell; the displaced move **back in**; the core re-densifies |

**Three engineering consequences the chair should see before ruling the car shape.**
1. The driver is **demographic makeup and wealth placement**, both of which the engine already
   derives. This satisfies law 4 (derive, don't store) with no new stored byte — but it means the
   loop reads the demography layer, which is a seam the draft's EST-5 did not name.
2. **Displacement is a population motion, not only a parcel motion.** "Residents are displaced" and
   "the displaced move back in" are statements about where people are, and the map's dwellings are
   population-derived filler with no parallel identity (`cartographyBuildings.js:9-10`). The loop can
   therefore move *counts and placement*, and must not be read as tracking *households* — which
   §C.7's `ownerRef` ruling independently refuses.
3. **This replaces §500.5's arbitrary partition rate as the counter-force.** The draft's §4.6
   counter-force table stands as the list of *mechanisms* (partible inheritance, decline and debt
   sale, institutional dissolution, forfeiture, fire and abandonment); what changes is that the
   *balance* between concentration and dispersal is no longer a tuned rate but a reading of the
   settlement's own demographics.

**HELD.** The signature marks B8 **"Under measurement (TC-B8-RECON) before further specification."**
This charter therefore **specifies the loop's shape and refuses to specify its numbers.**
`EST-5` is **BLOCKED on TC-B8-RECON** — see §F.4.

**B9 is unaffected and remains as the draft left it:** 9a (culture is the axis) YES; 9b (where the
balance is set) DEFERRED to the soak, deliberately, with soak arm A7 as the instrument.

### C.3 · B15 — ABSTRACT NOW, ILLUSTRATED BEFORE LAUNCH.

> *"abstract now but illustrated before launch"*

**RULED, and it is a scope ADDITION the draft did not carry.** The draft's B15 recommended
"abstract at the player tier; abstract-but-labelled at the DM tier; **illustrated as a later style
wave**" — i.e. after launch. The signature moves it **before the push**. *(Conflict C-4.)*

**The disposition.** Abstract ships with DW. **Illustrated art direction becomes its own program,
chartered as AD, landing at the DW-6 projection seam.** It is the first scope addition to the
pre-push arc since §482.

**What DW owes AD, and it is the only thing DW owes it.** DW-6's projection cars must expose an
**art-direction slot** — the projection names the shape it is drawing and the grade it is drawing
it at, abstractly, so AD can fill the slot without re-cutting DW-6. **AD is not a DW car and does
not count in DW's 41**, exactly as CH and CG do not. If the seam is not built into DW-6a and DW-6c,
AD becomes a re-cut of DW-6 rather than a consumer of it, and that is the failure mode to avoid.

### C.4 · B16 / B16b — THE MAP SHIPS WITH THE DOSSIER; AUTHORING IS THE ONLY PAID AXIS.

> B16: *"full plan free (every free and anonymous user, no matter how they generate a settlement,
> gets the map included with the dossier. they are also blocked by the same way everything else in
> the dossier is blocked dependent on their account type."*
> B16b: *"editing the map is paywall gated at all levels of hte map. but viewing and interacting
> with it is not."*

**RULED, and it REFUTES the draft's own B16 recommendation.** The draft recommended *"the full
lawful plan free; **secrets premium** — concealed chambers, undercity links, the reasons behind an
absence, and the DM-tier fixture naming."* **That is a CONTENT-DEPTH paywall, and the signature
puts the paywall on the AUTHORING axis instead.** Under B16b, viewing a concealed chamber is
viewing. The draft's B16 recommendation is **STRUCK.** *(Conflict C-1 — the sharpest conflict in
this compile, because the draft's version is a paid-surface decision and would have shipped a
gate the owner did not sign.)*

**The ruling, stated so a build lane can apply it:**

| Act | Free? | Why |
|---|---|---|
| View the plan, hover, select, inspect, pan, zoom, open a building, read a plan, follow an address chain | **FREE at every level, anonymous included** | B16b: viewing and interacting are not gated |
| A concealed chamber, an undercity link, the reason behind an absence, DM-tier fixture naming | **gated exactly as the dossier already gates DM-tier content by account type — and by nothing else** | B16: "blocked the same way everything else in the dossier is blocked dependent on their account type". **The dossier's existing account-type gate is the one truth. No map-specific gate. No map SKU.** |
| Edit, annotate, move, redraw, override | **PAID at every level** | B16b, and it converges with `viewerCanAuthor` |
| The map export | **INCLUDED in the existing $2.99 single-dossier purchase** | §523/§524: TAKE AWAY is paid, but this one is already bought |

**The §523/§524 trichotomy, adopted as the charter's test:**
**VIEW** (reads) and **INTERACT** (transient local state that dies with the session) are FREE.
**AUTHOR** — a write that outlives the session and that others consume — is PAID.
**TAKE AWAY** — a durable artefact leaving the product — is PAID, *except* the map export, which
the single-dossier purchase already covers.

**⚠ THE LIVE COLLISION, MEASURED THIS LANE, AND IT IS ALREADY IN THE CODE'S OWN WORDS.**
`src/config/entitlementLadder.js` carries an `axis` field on every entitlement row and exports:

```
export const VIEWING_PAYWALLS_PENDING_514 = Object.freeze([
  { id: 'map-chains',  reason: 'a region-map view layer behind TIER_GATE.mapChains' },
  { id: 'change-view', reason: 'history READING depth capped behind the authoring predicate' },
  { id: 'fog-table',   reason: 'table-session reveal reads as interaction; its persistence may not — owner call' },
]);
```

Its header states the ruling verbatim and says the three rows are reported rather than silently
corrected **because paid-surface behaviour is the owner's call, not a build lane's** — and that
**the ledger is shrink-only by test: a fourth viewing row that starts claiming a paywall reds the
walker.** Recorded at ODQ §514.1b.

⛔ **CORRECTED — THE THREE ARE ALREADY RULED, AND CARRYING THEM AS OPEN WAS A PARTIAL READ.**
ODQ **§523.1** records the owner's contemporaneous delegation of exactly this class ("i leave all
judgements to you"), and **§523.3 ruled all three at 2026-08-23 22:42 CDT** — `change-view` **FREE**,
`map-chains` **FREE**, `fog-table` **PAID** — roughly four hours *before* this compile committed.
The first compile cited §523/§524 for the export trichotomy and then carried the three as unresolved
in three separate places. **They are struck from §K's open list and are not the owner's to re-decide.**
**WEB-8b** is the car that shrinks the ledger; it joins §F.4's prerequisite line.

**DW's obligation is therefore exact and testable: DW MUST NOT GROW THE LEDGER.** No DW car may
introduce an entitlement row whose `axis` is `viewing` and whose `free` is anything but true. The arm
is written as **no-growth / shrink-only**, deliberately **not** as a literal length — so it stays green
when WEB-8b shrinks the ledger to 1.

**One further measured fact DW-7a must be told.** The ladder's de-advertised-rows ledger records
that the `interiors` row is **UNGATED and UNSHIPPED**: `src/components/interior/InteriorView.jsx`
is prop-mounted and store-free and nothing in product imports it; no enter-interior affordance
exists. **A paying Cartographer receives nothing for this row today.** DW-7a is the car that makes
that row real, which is exactly why it is the program's only LIGHT car and its only flag.

### C.5 · §452 / §453 — HALLWAYS, LONG-HALLWAY CHAMBERS, CLOSETS AND PANTRIES ARE FIRST-CLASS ROOMS.

**RULED and already absorbed by the draft**, which is worth stating so nobody re-opens it. The
CIRC addendum's convergence table (§5) reduces three dossiers' spellings to one closed set: the
§452 circulation classes SURVIVE as the top level — **seven, not six** (the draft's §2.4 enumerates seven, and 7 + 2 = the 9 this charter pins) — with **two new top-level classes** — `VERTICAL`
(non-human: `HOIST · CHUTE · SHAFT · HATCH · WINDLASS`) and `EXTERIOR_WALK` (`COURT_RING · YARD ·
PARADE · WALL_WALK · PALISADE_WALK · RANGE · STREET · ROAD · GROUND`) — giving **9 classes with
~55 sub-forms**; the §453 storage classes SURVIVE with **~35 sub-forms and six adjacency
polarities, of which three are PROHIBITIONS**. A circulation cell and a storage cell are cells:
they are licensed, sized, reached, validated and shed like any other. **A hallway is not leftover
space** — the CIRC addendum's own consequence 1: *"Nothing is 'leftover space' — but equally
nothing is added without a licence."*

**Three spelling corrections the convergence forces, carried into DW-1d/1e** (each vetoable):
R-INST-2's `LONG_GALLERY` for Hampton Court's ground-floor quay arcade becomes `GALLERY{QUAY_ARCADE}`;
R-INST-1's `STRONG_ROOM` function is demoted to a fixture-bundle; the §453 text's "cellar under the
buttery" becomes "cellar under the SERVICE END". **One licence correction:** R-INST-2's
"`CORRIDOR` ≥ 1650" is the *plan's* licence; the *cell's* licence is by program from the 12th
century. Both are true at different levels and DW-1d must carry both rows.

### C.6 · §494 — THE HOVER HALO, INCLUDING DETACHED YARDS AND COURTS.

**RULED.** Hovering a building highlights its property line as a **yellow halo, including detached
yards and courts belonging to the same property.**

**Two tiers, and they have different dependencies — the draft conflates them slightly and this
compile separates them.**

| Tier | What lights | Depends on |
|---|---|---|
| **Tier 1 — §494 as signed** | the hovered building's own property line, **plus every detached yard or court belonging to the same PROPERTY** | the compound member polygons — `DW-2c` (placement) and `EST-3` (the draft on assembled ground). **Not** on ownership. |
| **Tier 2 — the §498 R8c extra** | the estate's OTHER holdings, faintly: hover one holding and **a power's other holdings** light up across the town | **`EST-4`**, because "the same estate" is an ownership fact |

`DW-6d` therefore depends on **EST-3 and EST-4**, not on EST-3 alone. That is a dependency edit to
the draft's §5.10 graph, recorded in §F.4.

> ⛔ **AND DW-6d IS A CONSUMER, NOT A PRODUCER — MP-1 ALREADY SHIPPED THE HALO** (ruling R7, blocker
> B3). `src/domain/townCartography/cartographyProperty.js` (**9,141 B**, `9e5059cec` — landed inside
> this charter's own base commit) exports `buildPropertyLineIndex`, `propertyLineForAnchor`,
> `membersOf` and `openGroundOf`; it is `@enforced-by tests/domain/townCartographyProperty.test.js`
> and mounted at `SettlementMapPane.jsx:601`. **Its header states the DW integration contract
> verbatim:** open ground is not yet typed, an enclosed COURT and an open YARD are the same
> subtraction, and a detached outbuilding does not exist in the model at all — *"Both are DW-1/DW-2's
> typed `CompoundMember`. When they land, `membersOf` reads the typed member rows INSTEAD … and the
> RETURN SHAPES below do not move, so the overlay that consumes them is re-pointed at a new INPUT
> rather than rebuilt."*
>
> **The first compile named MP-1 zero times** and pointed DW-6d at work a mounted single-writer leaf
> already owns. The correction: **DW-6d's deliverable is the typed member polygons plus the tier-2
> overlay, not a halo.** And a new exit criterion no car currently carries falls out of it —
> **DW-1f/EST-3 must emit typed `CompoundMember` rows with `membersOf`/`openGroundOf` return shapes
> unchanged** (§G). Two producers of "what a property line is" would let the hover halo and the DW
> projection disagree about the same property.

### C.7 · §498 / §519 — AN ESTATE IS AN OWNERSHIP SET, AND `ownerRef` IS POWER-SCOPED.

**§498 RULED:** an **ESTATE** is *"the combination of multiple, not necessarily connected,
buildings belonging to one singular institution or individual."* An estate is an OWNERSHIP SET,
not a geometric merge. Merging makes a bigger PARCEL; owning makes an ESTATE. The draft's §3.4
split is correct and stands.

**§519 RULED, and it NARROWS the draft** (the anchor/relation split below is the chair's 2026-08-24 ruling). *(Conflict C-2.)*

| | Draft §3.4 / EST-4 | Signed §519 |
|---|---|---|
| `Estate.ownerRef` → ⭐ **`Estate.heldBy`** | an **institution anchor** (`anchorForInstitution(inst)`) or `ANONYMOUS_FABRIC` | **the RELATION is POWER-scoped; the ANCHOR is not** — `heldBy` may be a POWER, a non-power institution, or `ANONYMOUS_FABRIC` (chair, 2026-08-24) |

**THE POWERS are defined in code, not in this charter.** `src/domain/dossier/powerStrata.js`, whose
own doc comment reads: *"THE POWERS = the governing faction (role 'ruler', when a seat exists)
followed by the coup contenders in the derivation's own order (role 'contender'), de-duplicated by
name — coupContenders already excludes the governing seat **and criminal factions**, so the ruler
never double-lists and the set stays small (a seat + up to three challengers)."* Every roster entry
is already flagged `isPower`. **Use that definition. Do not reintroduce "faction" — the
faction-scoped reading at §518 is superseded by §519.**

**The consequence the draft did not anticipate, and it is the largest single effect of the
signature on the build.** THE POWERS is a set of at most four. Every institution that is not a
POWER — which is nearly all of them, including every guild, every inn, every church, and every
criminal front — **cannot `own`**. Its building claim is carried by **`occupies`** instead.

> **`occupies` is therefore the COMMON relation, not the rare one.** The draft's §3.3 introduces
> `occupies` with five witnesses (the druid circle on a ring it did not raise, the dragon in a
> cistern, the planar embassy in a lent palace, the undead-labour institution pointing at an existing
> charnel, the criminal front over a merchant's undercroft). Under §519 it also carries the ordinary
> case: a guildhall used by its guild. **DW-1f's and EST-4's sizing must be re-read on that basis,
> and `occupies` must be as cheap as `owns`** — which means §G may **not** freeze DW-1f at "+3 titles
> unchanged" while §C orders its sizing re-read. That contradiction is resolved in §G under R3.

> ### ⛔ R1 — THE FORK THE FIRST COMPILE CLOSED TOO FAST, AND IT IS OWNER-GATED
>
> The literal reading — `Estate.ownerRef` is POWER-typed, full stop — has a measured cost the first
> compile did not state. **All three of the owner's own §498.2 worked examples become unbuildable as
> estates:** "the abbey with an outlying grange, the merchant with a house on one street and a
> warehouse on the quay, the innkeeper with the stable-block across the lane". **None is a POWER.**
> THE POWERS is bounded at four (`rulingPowerCoup.js:106` — `.slice(0, 3)` plus the seat), so estates
> per settlement **cap at four regardless of tier**, and B8's concentration limb has at most four
> beneficiaries in a metropolis. Worse, §C.6's own tier-2 worked example was "hover the merchant's
> house" — unbuildable 27 lines before §C.7 ruled merchants cannot own, which would leave DW-6d's arm
> passing on a ruling-seat fixture while the feature is dead for the case that justified it. **That is
> the vacuous arm §G's own rule exists to forbid.**
>
> ## ⭐ R1 — RULED BY THE CHAIR, 2026-08-24: THE ANCHOR IS APPROVED
>
> **Estate membership rides an ANCHOR, not `owns`.** §519's relation rule stands **verbatim** and is
> not reopened — the owner ruled it. The anchor is what makes §498's "institution **or individual**"
> buildable without widening who may `own`. The chair's reason of record: *a reading that makes the
> author's own examples impossible is the wrong reading of the author's intent, not a constraint
> discovered in it.*
>
> ⚠ **What is approved and what is NOT.** The anchor may be **built**. `Estate.heldBy`'s **persisted
> TYPE remains owner-gated (O2)** — neither the chair nor a build lane may fix it.
>
> ## ⭐ THE RENAME — RULED, AND MANDATORY, NOT COSMETIC
>
> **`ownerRef` becomes `heldBy` on the Estate contract.** The chair verified the collision
> independently: `ownerRef` occurs in **17 `src/` files and 11 test files** at this base and already
> means *"the paying account that owns a saved record"* — `ownerRef: { accountId }` at
> `canonEventApply.js:171`, guarded at `customContentApply.js:23`. **A DW field of that name would
> collide a WORLD-FICTION concept with a BILLING concept inside one record** — the kind of collision
> that reads as a bug forever after.
>
> **Every packet touching the Estate contract must state, in these terms, that the rename is a
> COLLISION AVOIDANCE with the account-ownership field.** Without that sentence the next reader
> "helpfully" unifies the two, which is the whole failure the rename exists to prevent.
>
> ```
> Estate {
>   estateId,
>   heldBy,          // the ANCHOR: a POWER · a non-power institution · or ANONYMOUS_FABRIC.
>                    // NOT `ownerRef` — that name is the paying account (17 src / 11 test files).
>   members: { parcelId, relation: 'owns' | 'occupies' }[],
>                    // relation stays §519-scoped: `owns` iff heldBy is a POWER; else `occupies`.
>   since, cause
> }
> ```
>
> `ANONYMOUS_FABRIC` gets a **first-class arm with acceptance, not residual status** — it is where
> §498's "or individual" lives and what B8's wealth placement needs.
>
> **The reasoning the chair ruled on, kept for the record.** Keeping §519's relation rule verbatim
> while ruling that estate membership is not carried by `owns` preserves **both** owner sentences:
> §498's "one singular institution **or individual**" (the individual is exactly what
> `ANONYMOUS_FABRIC` is for, and exactly what B8's wealth placement needs), and §519's POWER scoping,
> which §519.5's own wording frames as a statement about *who drives consolidation and whose holdings
> the tier-2 halo lights*. Give `ANONYMOUS_FABRIC` a **first-class arm with acceptance**, not residual
> status.
>
> ⚠ **This is O2 — persistence shape, and NOT the chair's under any delegation.** It is the single
> largest contract change in the program and it goes to the owner as one question.
>
> **Two things to fix regardless of which branch wins.** (i) Drop the "unrecordable occupant" worry
> entirely: `buildingRef` → `building.anchorKey` → institution is **already shipped** at
> `hoverModel.js:31-36`. (ii) ⛔ **Rename the field.** `ownerRef` already means "the paying account
> that owns a saved record" in **17 `src/` files and 11 test files** (measured this lane;
> e.g. `canonEventApply.js:171`, `commandContext.js:50-54`), so a lane grepping the name lands in
> command-envelope owner scoping. **Recommend `heldBy` or `anchorRef`.** Say in the contract which
> `ownerRef` this is *not*.

**Criminal fronts are excluded from POWERS by construction** — `coupContenders` already excludes
criminal factions, verified by reading the module this lane — **so the signature's carve-out is
true in the code and needs no new predicate.** They are carried by `occupies`.

**EST-4's household refusal STANDS, and it is the draft's best-evidenced measurement.**
`householdId` greps to zero rows against positive controls at 27 and 153; dwellings are anonymous
by design (`cartographyBuildings.js:9-10`). **DW does not mint a household.** Household-owned
estates are deferred (§9 D-3) because minting a household identity is persistence shape and an
owner gate. **Note that §519 makes this refusal stronger, not weaker:** the owner has independently
ruled the owner axis to a set that contains no households at all.

**Powers already change hands on dated caused events** (`RULING_POWER_CAUSES`), which is the
acquisition/dissolution driver the §C.2 loop needs. EST-5 reads it; it does not mint a second one.

### C.8 · B0, B2–B7, B10–B14, B17, B18 — RATIFIED UNDER THE SAME SIGNATURE.

Carried unchanged from the signature's own ratification list, each vetoable by a word:
**B0** adopt `PLAN_UNIT_CM_BY_TIER` unchanged; a frontage is the SLOT's face (median 41.8 ft, 77%
admitted), not the plot edge (83.5 ft, 98.8%, which gates nothing) · **B2** the verdict split
follows the research exactly and is not softened · **B3** five frontage buckets as a FUNCTION of B0,
two sourced and three interpolated and marked as such · **B4** the seven-rung prosperity ladder,
which repairs a live defect (the emitted label `Moderate` matches no arm of `interiorModel.js:83-86`
and reaches the interior through a fall-through default, on roughly a quarter of settlements) ·
**B5** walls → separation → duplication · **B6** shedding order perishables → fixtures → plant ·
**B7** storey heights descending by default · **B10** owner cessation read from the existing closure
machinery · **B11** occasional non-contiguous holdings, higher in ports, institutions only ·
**B12** party walls common urban, rare rural · **B13** working density: enough to read as lived-in,
not cluttered — vocabulary sourced, density is the chair's and is flagged as the chair's ·
**B14** the 3 × 3 wear grid with the six-to-three mapping written out · **B17** ownership events are
news · **B18** parti↔massing emits the claim; the massing side consumes it later.

⛔ **PLUS A NINTH SIGNED ROW THE FIRST COMPILE COULD NOT REACH: `B21`.** It is one of the eight
owner-signed rows on the signature sheet, appears **0 times** in all three DW documents, and its
constant is **live** at `cartographyTuning.js:95` — `CARTOGRAPHY_HEADROOM_PERMILLE = 1600`, under a
header reading *"THE DECLARED HEADROOM (BAND 21, owner-signed 2026-08-23)"*. §C's framing ("the
draft's §7 asked eighteen bands as QUESTIONS") **structurally cannot reach it, because B21 is not a
draft band.** **Its consumer is CG-1b, it is LANDED, and its value is tuning-pass-only.**

### ⛔ C.8b · THE BAND CLOSURE TABLE (blocker B14) — no ratified band may be car-less

**Three owner-signed bands had no car and no exit criterion, so all 41 cars could land green without
them.** A band with no carrier is the §441 J7 phantom home wearing a signature.

| Band | Carrier | The integer or differential that proves it |
|---|---|---|
| **B0** scale | DW-2a | frontage converted through `manifest.space.planUnitCm`; **0** DW-minted scales |
| **B2** verdict split | DW-R2 | the three named predicates (§G) |
| **B3** frontage buckets | DW-2a | all five buckets fire over 1,098 parcels |
| ⛔ **B4** seven-rung prosperity ladder | **NO CAR — and the repair is architecturally BARRED** | **OWNER-GATED (O4).** Measured at the slot: `interiorModel.js:79-87`'s `prosperityScore` has three regexes and a `return 0.5` fall-through, and `PROSPERITY_TIERS` (`src/data/constants.js:92`) has seven rungs. **TWO fall through — `Subsistence` AND `Moderate`** — both scoring **0.5, identical to `Comfortable`.** *(The first compile named only `Moderate`; the poorest rung on the ladder scoring as `Comfortable` is the sharper half.)* The architecture separately declares `interiorModel.js` "not grown" and restricts every DW car touching it to composition calls, **so the repair is unassigned AND barred.** It becomes user-visible at exactly DW-7a. **This is a tuning constant under THE PROMISE: is the repair owner-signed now, or deferred to the tuning pass and recorded in §K?** |
| **B5** what prosperity buys | DW-2b/DW-3a | order asserted |
| ⛔ **B6** shedding order | **NO CAR** | perishables → fixtures → plant. Needs a carrier and a differential (a declining settlement sheds in order). |
| **B7** storey heights descend | DW-2b (draft `:1931`) | ✓ carried |
| **B8** the two-way loop | EST-5 | both direction counts > 0 |
| **B9a/9b** culture axis / deferral | DW-S A7 | §517.5's two measures |
| **B10** owner cessation | EST-5 | read from existing closure machinery |
| ⛔ **B11** non-contiguous holdings | **NO CAR** | occasional, higher in ports, institutions only. Needs a carrier and a rate. |
| **B12** party walls | DW-1f (draft `:1906`) | ✓ carried |
| **B13** density | EST-6 | yard-fixture count per prosperity rung |
| **B14** 3×3 wear grid | DW-3a | fixtures outside the grid = 0 |
| **B15** abstract now | DW-6a/6c + AD | the art slot |
| **B16/B16b** paywall | DW-6, DW-7a | five entitlement cases; ledger no-growth |
| **B17** ownership news | DW-7c | four typed events emit, renovation does not |
| **B18** parti↔massing | DW-2b | the claim is emitted |
| **B21** map headroom | **CG-1b — LANDED** | `CARTOGRAPHY_HEADROOM_PERMILLE = 1600` |

**Three empty rows — B4, B6, B11 — are either a car or a deferral recorded in §K with a reason.
They are listed here precisely because no lane will ever red on them.**

---

## §D · THE TAXONOMY — PARTIS, CELLS, FIXTURES, CIRCULATION, STORAGE

**Reconciled against the dispatch's figures. All three match the draft. None changes in this compile.**

| Vocabulary | Count | Arithmetic that must pin, not just the total |
|---|---|---|
| **PARTIS** | **48** | after merging fifteen proposals into one `GATED_COURT_RING` with four attributes |
| **CELL KINDS** | **83** | `28 − 2 + 57`. **All three intermediates pin.** Two dead members retire: `stall` (no producer) **and `dais`** (`room('dais'` returns 0 producers against a control of 2 for `room('hall'`). `FURNISHING_KINDS.dais` **survives** — it has two live producers at `interiorTemplates.js:140` and `:166`. |
| **FIXTURE KINDS** | **82**, ⚠ **pending one open item** | `22 + 60`. ⛔ **`ring table` is named in §H's own missing list, is absent from the 60-member add list (0 hits in both frozen sources, 8 in R-INST-5 inside what the dossier calls its best-sourced passage — Uraniborg's circular working table), and would make it `22 + 61 = 83`.** Either add it and declare the one-time figure move as AR-7 did for 81 → 82, or record a reasoned refusal; check `LEDGE` and `WINDOW_SILL_BENCH` from the same line while there. Open item §I C-17. ⚠ **The dispatch says 81. The draft's own amendment AR-7 corrected 81 → 82 by mechanical recount.** 82 is the figure. *(Conflict C-14.)* |
| **CIRCULATION** | **9 classes**, ~55 sub-forms | the §452 six plus `VERTICAL` and `EXTERIOR_WALK`; five measured width buckets |
| **STORAGE** | ~35 sub-forms | six adjacency polarities, three of them PROHIBITIONS |
| **JOINT KINDS** | **5, and DW adds none** | `grate · stair · sealed_door · sluice · breach`, imported unchanged from `jointVocabulary.js` |

**The `dais` retirement carries a trap that the acceptance arm must dodge, and it is worth
repeating here because it is the exact shape that hid the dead member.** After DW-1a, `'dais'` still
occurs four times in `src/` — twice as the surviving `FURNISHING_KINDS` member and twice in furnish
lists. **A bare `grep "'dais'"` arm would be red forever and would then be widened until it proved
nothing.** The arm must match the ROOM-PRODUCER spelling `room('dais'`, not the bare string.

> ### ⛔ B11 — THE COLLISION CHECK WAS RUN AGAINST THE WRONG SET, AND IT MUST RUN BEFORE DW-1a
>
> The draft's own sentence is *"57 distinct backticked names …, zero duplicates, zero collisions
> **with the existing 28**."* That check never crossed the vocabularies against **each other**.
> **Measured by this lane over the draft's own §2.2 / §2.4 / §2.5 spans — 20 distinct names live in
> two vocabularies at once:**
>
> **15 CELL × STORAGE** — `arsenal_floor`, `buttery`, `cistern`, `coach_house`, `dairy`,
> `drying_loft`, `dungeon`, `garret`, `larder`, `loft`, **`muniment`**, `pantry`, `scullery`,
> `still_room`, `undercroft`.
> **5 CELL × CIRCULATION** — `ground`, `lobby`, `parade`, `porch`, `yard`.
>
> *(The panel's docket named 15 and placed `porch` among the storage collisions; measured, `porch` is
> a circulation collision and **`muniment` is a 16th storage one the docket missed** — so the true
> figure is 20, not 15.)*
>
> **This is precisely the shape the draft says hid the dead `dais` member** — "a second dead member
> hidden by a cross-vocabulary name collision" — and `pantry` now has two homes, giving the validator
> two ways to size, reach and shed the same room. It is sharper than the `dais` case, because the
> owner personally made closets and pantries first-class at §453.
>
> **The fix, and it gates the whole of DW-1:** run a cross-vocabulary uniqueness check **before
> DW-1a**, across {PARTIS, CELL_KINDS, CIRCULATION sub-forms, STORAGE sub-forms, FIXTURE_KINDS}.
> Where a name deliberately lives in two, **the charter states which vocabulary OWNS it and the other
> is a reference.** The check lands as a DW-1d/DW-1e arm.

**On the joint vocabulary, a distinction the draft draws correctly and this compile protects.**
R-INST-6 flags **E13** (no ROOF joint) and **E16** (no WATER-LANDING joint). The draft's answer is
that **DW adds no member to the closed five-kind enum**; it adds a `joint.target` ATTRIBUTE whose
values include `ROOF` and `WATER`. The new *kinds* remain deferred as **D-6**, because a new member
of a closed enum belongs to the train that owns it. **These are two different things and they must
not be collapsed** — a later reader seeing `ROOF` in `joint.target` may conclude E13 is discharged.
It is not: the attribute lets DW say *where* a joint points; the missing kind is *what* it is.

**The five joint attributes DW does add:** `severable` (a joint the occupant can close — a
siege/news state), `schedule` (a time window), `refused` (a licensed non-joint, so S9 proves
ABSENCE and not only reachability), `mandatoryOpen`, and `OBJECT_ONLY` (the foundling wheel — a
joint that passes objects and never people). Plus `cell.approach: NORMAL · SINGLE · HATCH_ONLY ·
NONE`, because the anchorhold is a cell with no door and the validator must accept it.

---

## §E · THE RELATIONS, AND THE SINGLE FLAG

### E.1 · The three relations — DW's answer to its own first line

Unchanged from the draft's §3.3 in substance; two edits from the signature.

**`hostedIn`** — a function occupying another institution's interior. The host is chosen
deterministically by a ranked candidate rule per institution family, forked on
`(worldSeed, inst.anchorKey, 'host')`. The guest contributes a FIXTURE SET and sometimes an added
or refused joint; **its circulation is INHERITED from the host.** Three refusal cases: no candidate
host → the verdict falls to `NO_BUILDING`, never to an invented building; the host has no spare
cell of the required kind → the guest's cells COMPRESS and surplus stations collapse, **lawfully
and recorded, not as a failure**; **the host DIES** — dated and real (the chantry school 1547, the
healer's monastery 1536–40) — so `hostedIn` carries a `fallbackOrder[]` and a `killedBy` event.
Stable key: `(hostBuildingId, functionKind, ordinal)`. **The guest's own id never keys a cell.**

**`NO_BUILDING`** — a reasoned, projectable verdict with a fixture set on ground. **DECLARED on the
`ProgramMinimum` row for that institution at that tier — it is the tier's truth, never a fallback
reached when geometry runs out.** Carries a `ground`, a `fixtures[]`, and a `reason` from the closed
enum `ITINERANT · SEASONAL · HOURS_ARE_THE_SECURITY · NO_PREMISES_BY_NATURE · ON_ANOTHER'S_GROUND ·
THE_GROUND_IS_THE_INSTITUTION`. **This is the highest-severity gap in the whole research corpus** —
R-INST-6 ranks it E1, asked by 7 of its 9 families. **Six catalog REQUIRED rows depend on it**
(Market square, Weekly market, Town granary, Craft guilds, and thorp/hamlet Water source). A
REQUIRED row that cannot be drawn honestly is the strongest argument in the charter.
**Under B1 this is a program, not an exemption:** a `NO_BUILDING` verdict still has a minimum —
its ground and its fixture set — and DW-5 must certify a zero-cell plan LAWFUL, with a reason.

**`occupies`** — a whole-building claim on a structure whose builder is gone or is another party.
**Re-scoped by §519 from rare to common (§C.7).** Produces: the occupied building's plan, PLUS a
few added cells, a CHANGED CONTROL (which joints are severable and by whom), and dated
modifications that are law-5 fossils running FORWARD. Two refusals: it **may not MINT** the occupied
structure — if no suitable structure exists, the verdict degrades to `NO_BUILDING` with reason
`ON_ANOTHER'S_GROUND`; and it may not occupy a structure another institution owns and occupies.

### E.1b · ⛔ `PlanDelta` CARRIES ONE OF THE THREE LAWS ITS SHIPPED SIBLING CARRIES (blocker B4)

`src/domain/interior/interiorEdits.js` (**10,238 B**, read at the slot this lane) states **three**
laws in its own header. DW's `PlanDelta` was chartered with one.

| Law | `interiorEdits.js` | DW as first chartered |
|---|---|---|
| **DORMANCY** — absent ⇒ byte-identical; read never writes | `:11` | ✓ carried (DW-7b's strict no-op test) |
| **KEY-NAMING TRAP** — every schema key is denylist-safe (∉ `PRIVATE_KEY_RE`) | `:14` | ✗ **absent** |
| **EDITS-DELTA (survive re-derivation)** — pins key on the model's **stable id**; a freshly-derived model re-applies every pin whose anchor still resolves and **"DROPS the dangling ones (never a throw, never a ghost)"** | `:18-20`, `:151` | ✗ **absent** |

**Why the third one is the blocker.** DW's contract was `{ buildingId, path, op, value, editedAt }`
with **`path` nowhere defined**, and **DW-S re-derives every plan at every soak epoch**. A structural
path into a re-derived plan is exactly the anchor that stops resolving. As chartered, this **silently
corrupts a paying user's authored map** — the one place in the program where DW touches durable
user-authored writes.

**RULED into the sidecar family.** `PlanDelta` keys on a **stable cell/fixture anchor id, never a
structural path**; a dangling anchor **drops**; DW-7's exit carries that case with its mutant (§G).

**The KEY-NAMING TRAP is a live hazard for DW specifically.** `chronicle` and `seed` are both
`PRIVATE_KEY_RE` tokens **and DW emits both**, so a matching key is **silently stripped from every
public projection with no arm to see it.** DW-7b owes an arm that every `PlanDelta` schema key is
denylist-safe.

⚠ **And `undo` is 0 occurrences across all three DW documents**, while the map pane sitting beside
DW-7a ships `canUndoEdits` / `editHistory.undo` (`useTownMapPresentation.js:237`). **A paying
Cartographer would get edit-without-undo on the plan.** Recorded as §I C-18.

*(Two limbs of the original finding are struck, and this charter records the strike rather than
quietly keeping the wider claim: the leak narrative — the allowlist is fail-closed — and the
migration limb — `MIGRATIONS` holds one no-op entry and both shipped sidecars landed additively at
`SCHEMA_VERSION = 1`.)*

⚠ **O3 — whether `PlanDelta`, `EstateEvent` and EST-5's persisted ownership ledger EXIST, and in what
shape, is PERSISTENCE SHAPE and therefore the OWNER'S.** The chair may rule the laws they must carry;
the chair may not rule them into existence.

### E.2 · The single flag — DW-7a, and the bill is six surfaces

**RULED: the DW program mints exactly ONE flag, at DW-7a, and no other wave mints any.**

The justification is the measurable one, not the draft's struck circular citation: *name the
surface, grep its gate; if a gate exists you inherit it, if none exists you mint one.*

| Wave group | Surface | Gate today | New flag? |
|---|---|---|---|
| DW-1 … DW-6, **and ESTATE cars EST-1..EST-4, EST-6** | the town-cartography block of the `TownSceneManifest` | **`townCartographyEnabled` already gates it** — a VIRTUAL rule declared `false` at `simulationRules.js:783` and set `true` nowhere in `src/` | **NO — inherits** |
| ⛔ **EST-5 alone** (the B8 loop) | ⛔ **NOT the cartography block.** The loop's measured home is `urbanFabricKernel.js` (884 lines) behind **`urbanFabricEnabled`** — a different, preset-gated ONE_REGEN flag | a different flag, which the first compile never named | **NO — but it inherits a DIFFERENT gate, and a lane applying the grep-the-gate rule to the wrong one is a step away from minting a persistence shape it has no authority to mint (O3)** |
| **DW-7a** | the on-click interior pane | **none.** `buildInteriorModel`'s one external consumer, `InteriorView.jsx:58`, is ungated | **YES — one, here, only here** |

**The bill is SIX test-visible surfaces, paid once at DW-7a**: the `ENGINE_GATED_VIRTUAL_RULE_KEYS`
row at its alphabetical position (which drags `npm run build:edge-shared` into the same commit —
2 bundle `.js` plus all 5 metas — and pulls `tests/edgeFunctions` into the sweep); the authored
`subsystemRowsVirtual.js` row; three module-scope edits in its test with zero new titles; the
literal `<flag>: true` in the acceptance file; two `toHaveLength(N)` literals in
`contributionLedgerShape.test.js` with the `it` title **renamed, never added**; and three flag-registry
figures in `coveringArrayCoverage.test.js` moving in lockstep while four others must not.

---

## §F · THE WAVE AND CAR RECONCILIATION

### F.1 · Reconciled against the dispatch's figures

The dispatch states the existing plan is **10 waves / 41 cars**. **Both confirmed by recount**
against the draft's §5.0 table: DW-R 3 · DW-1 6 · DW-2 5 · ESTATE 6 · DW-3 3 · DW-4 2 · DW-5 4 ·
DW-6 5 · DW-7 4 · DW-S 3 = **41 cars in 10 waves.**

### F.2 · The commit arithmetic, and a conflict inside the draft

| Figure | Value | Source |
|---|---|---|
| DW cars, as planned | **41** | recount, confirmed |
| DW dispatchable commits | **45** | 41 + 3 (EST-1 splits four ways) + 1 (EST-2 splits two ways) |
| Prerequisite cars outside DW's total, **re-derived at the slot** | ⛔ **1** — CG-2 only. **CG-1 and CG-1b are LANDED** (`d78011665`, `3e9d2d888`; §F.0) | §F.0 |
| What a build lane actually dispatches | ⛔ **46 commits** (was 47) | 45 + 1 |
| Outstanding catalog-train cars (never in DW's total) | **CH-3, CH-4, CH-5, CH-6** — CH-1 and CH-2A are LANDED, CH-2B holds at DRAFT | §F.0 |

**⚠ The draft contradicts itself and this compile rules the arithmetic.** The draft's §Σ says
*"41 DW cars in 10 waves, **44** dispatchable commits"*; its §5.0 says *"Total: 41 DW cars, **45**
dispatchable commits"* and then *"the arc a build lane actually dispatches is 47 commits."*
`41 + 3 + 1 = 45`, and `45 + 2 = 47` closes. **45 is right; the §Σ "44" is the error.**
*(Conflict C-6.)*

### F.3 · Where this compile DIVERGES from the existing plan, and why

**No new DW wave is added and no DW car is added.** The signature changed POLICY, not SCOPE, with
one exception. **Seven divergences** — five from the signature, two from the second pass against the slot:

| # | Divergence | Why |
|---|---|---|
| **D1** | **The AD program is chartered OUTSIDE DW's 41, landing at the DW-6 projection seam.** DW-6a and DW-6c gain an art-direction slot as an acceptance requirement. | Signed B15 moves illustration from "a later style wave" to *before the push*. Making it a DW car would put an art program inside an engine program; making it a consumer of a DW seam keeps both single-writer. *(§C.3.)* |
| **D2** | ⛔ **REPLACED — TC-B8-RECON ALREADY REPORTED.** ODQ **§517** (2026-08-23 21:52 CDT, ~5 h *before* the first compile ran) is the verdict: **the loop is buildable**, but `noble` is **unreachable** — 0 of 10 quarters can classify it, because `CATEGORY_PATTERNS` (`districtProfile.js:105-117`) tests merchant at index 2 and criminal at index 8 (matching `Resi`**`den`**`tial`) before residential at 11, and `inferCategory` returns on first match. §517 RULED the repair into **CH-4**. So **EST-5 is UNBLOCKED on measurement and BLOCKED on CH-4** — a car the first compile never named. §517.1's three named pieces go into EST-5's contract: **per-district-instance resolution · a persisted ownership ledger the cartography READS but never WRITES · a displacement pool.** | The first compile held EST-5 on a measurement that had already reported and missed its real prerequisite entirely. |
| **D3** | **`EST-4`'s contract narrows to POWER-scoped, and `occupies` is re-sized from rare to common.** EST-4 gains an acceptance arm that `owns` is REFUSED for a non-power and that the POWERS set is a seat plus at most three challengers. | Signed §519 supersedes §518. This is a narrowing of a contract, not a new car — but it materially changes what EST-4 must test. *(§C.7.)* |
| **D4** | **`DW-6d` depends on EST-4 as well as EST-3.** | §494's halo has two tiers with different dependencies; the draft's §5.10 graph gives DW-6d only the geometry dependency. *(§C.6.)* |
| **D5** | **`DW-R2` has no tier holes, and it is the car most exposed to CH-3.** Its row set is PROVISIONAL-ON-CH3 and its walker's denominator must be recomputed at its own base, not inherited from this document. | Signed B1: no tier is exempt; HOSTED and NO_BUILDING are programs, not exemptions. CH-3 re-rolls 81 of 420 settlements. *(§C.1, §B.)* |

| **D6** | ⛔ **DW-1a and DW-1b SERIALIZE; they do not dispatch in parallel.** Adopt the architecture's dispatch list verbatim, and gate **DW-2c on EST-1a..1d** as the architecture does. | Architecture `:1567`: *"DW-1a -> DW-1b (both touch `interiorTemplates.js`: serialize them)"*. The first compile reproduced the draft's uncorrected "DW-1a,b,c,d,e (parallel)" graph. At the slot, DW-1a's `ROOM_KINDS` is at `interiorTemplates.js:35` and DW-1b's `FURNISHING_KINDS` at `:50` — **two lanes in a shared tree collide on the file, and their member-count tuples conflict on rebase, resolving to the wrong side.** That is the banked TE-STACK-3 shape. |
| **D7** | ⛔ **DW-6d is a CONSUMER of MP-1's shipped property-line leaf** (§C.6, ruling R7), and **DW-4 is a CONSUMER of UC-5's joins** under its ONE PRODUCER PER JOIN law (§F.0). | Both leaves are landed at this base and both state their integration contract in their own headers. Building a second producer of either fact would let two surfaces disagree about the same property or the same join. |

**Everything else in the draft's §5.0–§5.10 stands**, with the ordering rules **re-derived at the
slot**: ⛔ **CG-1 is LANDED, so only CG-2 remains before DW-1a** · **CH-1 is LANDED; CH-3 and CH-4
remain** (CH-4 blocks EST-5, not DW-1a) · **DW-1a serializes before DW-1b** (D6) · **DW-7a lands
LAST.**

### F.4 · The landing order, with this compile's edits marked

```
LANDED AT THIS BASE, NOT DISPATCHABLE:  CG-1 d78011665 · CG-1b 3e9d2d888 · CH-1 b2852ccc3
                                        CH-2A 17fe89763 · UC-5 f4df874ce · MP-1 9e5059cec
CG-2                                    (the ONLY remaining CG car; blocks EST-2b)
CH-3 · CH-5 · CH-6 · WEB-8b             (catalog/web trains; outside DW's 41)
CH-4                                    (blocks EST-5 — §517)
[PRE-DW-1] the cross-vocabulary uniqueness check      [B11 — gates all of DW-1]
DW-R1 → DW-R2 → DW-R3                   (D5: no tier holes; above-block rows fire at minTier)
DW-1a → DW-1b                           [D6: SERIALIZE — both touch interiorTemplates.js]
DW-1c, DW-1d, DW-1e (parallel) → DW-1f
DW-2a (needs 1c) → DW-2b (1a) → DW-2c (2a, R2, EST-1a..1d) → DW-2d (1d, 2c) → DW-2e (1e, 2c)
EST-1a → EST-1b → EST-1c → EST-1d (R2, 1f)
  → EST-2a (1d, 2a) → EST-2b (2a, CG-2) → EST-3 (2b, 2c)
  → EST-4 (1f)          [D3: relation POWER-scoped; ANCHOR is owner-gated O2/R1]
  → EST-5 (4, 2b)       [D2: BLOCKED on CH-4; flag home is urbanFabricEnabled, not townCartography]
  → EST-6 (1b, 3)
DW-3a,b,c  →  DW-4a → DW-4b             [D7: DW-4 CONSUMES UC-5's joins; no honesty clause]
DW-5a → DW-5b,c,d
DW-6a..e   →  DW-7b,c,d  →  DW-7a       (LAST; the only light car)
     DW-6a, DW-6c carry the AD seam [D1]
     DW-6d CONSUMES MP-1's leaf; depends on EST-3 AND EST-4 [D4, D7]
DW-S1,2,3 after DW-5                    (arms A1–A9; A4/A8/A9 are BLOCKING)
```

⛔ **24 of the 41 cars have no architecture packet** — DW-R, DW-3, DW-4, DW-5, DW-6, DW-7 and DW-S.
Each is owed a `changeManifest` and named mutants **before its wave dispatches** (ruling R4).

---

## §G · THE EXIT CRITERION FOR EVERY WAVE

**The rule this section is written to.** An exit criterion must be *observable* — a number, a set
membership, or a differential that a person can read off a run. "The wave is done", "the tests
pass" and "the behaviour is correct" are not exit criteria. **Every criterion below names what is
counted and what value it must take**, and where a control is required the control must be capable
of failing: *a control that cannot fail proves nothing.*

### CG (prerequisite, outside DW's 41)

| | |
|---|---|
| ⛔ **HALF DISCHARGED — the row splits** | **CG-1/CG-1b's throw-rate criterion is DISCHARGED at `3e9d2d888`** with its own receipt: **287/504 → 0/504**. The first compile's "Today: 16 of 48 (32 throw)" was a baseline cured **before its own base commit was written**. ⛔ **Struck.** |
| **EXIT (CG-2, the only live half)** | The identical-footprint group count is **0**. Base-stamped: **183 groups covering 369 of 2,839 rows (13.0%)** — ⚠ **measured at `00e7af61`, NOT re-measured after CG-1b changed the caps. Whether 183/369/2,839 still hold is unmeasured by anyone**, and CG-2's lane owes the re-measurement at its own base before it can claim a delta. |
| **Observable** | one integer: identical-footprint groups (must be 0), against a denominator the lane re-measures rather than inherits. |
| **The control** | the per-tier cap ladder must still refuse a deliberately over-bound settlement. A cap that admits everything is not a cap. |
| **Naming correction** | the constant is **`TC4_ROW_BYTES_BAND`**, not "the TC-3 byte band" as the first compile called it. |

### DW-R — the corpus (3 cars)

| | |
|---|---|
| **EXIT** | The DW-R2 walker prints **three integers that must agree**: (a) the number of (catalog row × tier-it-can-fire-at) pairs, computed independently from the catalog at the walker's own base; (b) the number of `ProgramMinimum` rows; (c) the number of those rows carrying a non-empty citation string. **(a) = (b) = (c).** **No tier holes** — B1: a HOSTED or NO_BUILDING verdict is a row, not an absence. DW-R1's doc-agreement pin **slices the SECTION on both sides and compares ordered `name@version` lists** — never a whole-document `includes()`, which goes vacuous on the doc's own prose. |
| **Observable** | three integers and their equality; plus ⛔ **THREE SEPARATELY-NAMED predicates, because the first compile compared three different research measures as one NO_BUILDING count.** Only the criminal figure is a NO_BUILDING count. **(i) criminal: NO_BUILDING at every tier = 11 of 28.** **(ii) hospitality: NO_BUILDING = 11 of 40** — ⛔ *not* 14; the 14 is NO_BUILDING-**or-HOSTED** at every tier. **(iii) trade: "~30 of 124 have no building AT THE FLOOR"** — R-INST-2 publishes **no verdict census at all** (the token "verdict" occurs once in 581,595 B), so this can **never** be matched by any ProgramMinimum verdict total and must be carried in the tranche's own wording as a floor statement, not as an exit equality. |
| **⚠ PROVISIONAL-ON-CH3** | (a) moves when CH-3 lands. The walker must recompute it at its own base and must not inherit a number from this charter. |

### DW-1 — vocabularies and rosters (6 cars, INERT)

| | |
|---|---|
| **EXIT** | Five frozen vocabulary modules plus the relations module exist, and the counts pin at **48 partis · 83 cells · 82 fixtures · 9 circulation classes** — and ⛔ **the storage and circulation SUB-FORM counts must be recounted mechanically and pinned as INTEGERS with mutants.** "~35 storage sub-forms" and "~55 circulation sub-forms" are approximations, so **the two vocabularies the owner personally made first-class at §453 — closets and pantries — are currently the only ones with no ratchet** (open item §I C-19). **All three cell intermediates pin, not only the total: 28 retired-2 added-57 = 83.** No file under `src/` produces `room('stall'` or `room('dais'` — matched on the room-producer spelling, never the bare string. `FURNISHING_KINDS.dais` **survives**. The relations module exports the three record shapes. |
| **Observable** | ⛔ **CORRECTED (blocker B8, ruling R3). The first compile spliced two disagreeing sources** — it took the architecture's post-AR-7 figure for 1a/1b and the **stale draft figure** for 1c, 1d, 1e and 1f, leaving **twelve unbudgeted titles across four cars**. Three sources exist: charter `6/4/2/2/2/3` = 19 · draft `1/1/2/2/2/3` = 11 · **architecture `6/4/5/5/5/5` = 30, where each figure equals that car's declared acceptance-arm count.** **RULED: the architecture. 30.** §A already rules the architecture STANDS, so a DW-1c lane building its five arms would otherwise measure +5 against a stated +2. Per-car, attributed per test file: **1a +6 · 1b +4 · 1c +5 · 1d +5 · 1e +5 · 1f +5.** ⚠ **DW-1f's +5 is provisional on R1** — §C.7 orders its sizing re-read for `occupies`, and freezing it while ordering a re-read is the contradiction B8 exposed. A delta smaller than the titles added is not arithmetic to accept: a parked test file swallows its titles. The banked-failure ratchet is **unchanged at 11 entries against `CEILING = 17`** (`tests/lint/testRatchet.test.js:181`, verified) — **that headroom is for banked failures, never a title budget.** |
| ⛔ **Declared shift — CORRECTED from "none"** | **DW-1a and DW-1b MOVE A SHIPPED PUBLIC COUNT** (blocker B10). `src/domain/compendium/generated/compendiumData.generated.js` is a GENERATED artifact under **THE REGISTRY-RENDER LAW**, whose source of truth includes `interiorTemplates`, pinned **byte-identical** by `tests/docs/compendiumDataFreshness.test.js:33`. Measured at the slot: `roomKinds` at `:409` has **exactly 28 members and contains BOTH `stall` and `dais`**; the public render is `src/components/compendium/CatalogHubs.jsx:66-67` — a **"Room kinds: N"** card plus the joined list. So `28 − 2 + 57 = 83` **moves a shipped public count from 28 to 83 and rewrites a shipped public enumerable.** DW-1a/1b's changeManifest must add the artifact and `npm run gen:compendium-data`; the wave declares the shift; and an arm asserts the regenerated `roomKinds` contains **neither** `stall` nor `dais`. ⚠ **Neither frozen source mentions the Compendium — this is a claim the first compile volunteered, not one it inherited.** Ruling R6: **REPLACE `ROOM_KINDS`, do not shadow it** — a shadow leaves two disagreeing room vocabularies with the public Compendium under-reporting by 55. |
| ⛔ **Blocking pre-condition** | **the cross-vocabulary uniqueness check of §D (B11) runs BEFORE DW-1a** and its 20 measured collisions are each assigned an owning vocabulary. |
| **Restored mutant** | the producer arm ("no file under `src/` produces `room('stall'`/`room('dais'`") is **already green at the base** — 0 producers measured — and was the one arm of the five whose convicting mutant was missing. The architecture's is **"add a `room('dais', …)` call anywhere."** |
| **Declared shift** | **none.** Every car adds a frozen array and a typedef that nothing on the generation path reads. |
| **The control** | each acceptance arm names the mutant that convicts it (duplicate a member; rename a template room; re-add `stall` or `dais`; retire `FURNISHING_KINDS.dais`; move any one of the three cell intermediates). |

### DW-2 — the geometry core (5 cars, INERT)

| | |
|---|---|
| **EXIT** | Over the real pipeline corpus **post-CG-1** (so it compiles at all): the frontage reader returns an **ORDERED** frontage list for **1,098 of 1,098** parcels; **every one of the five buckets fires**, and the bucket ladder tracks the settlement ladder (thorp SHOP+NARROW → metropolis WIDE+GRAND). The vertical partition emits `Storey[]` for every building with the cell areas summing to the envelope ⛔ **EXACTLY — recommended tolerance: ZERO, and the recommendation is to need none** (§I C-19). Every parcel vertex is already an integer lattice point (`cartographyParcels.js:100-104` rounds), and the shoelace of an integer polygon yields an exact integer for twice the area. **If DW-2b is required to place cell vertices on the same lattice, the accounting `Σ cellArea + Σ wallArea + Σ voidArea = envelopeArea` closes in exact integer plan-units² with no epsilon at all.** A declared tolerance is a place for drift to hide; a lattice constraint is not. Parti placement leaves **zero** buildings without a parti and **zero** partis outside their eligible set. `OPEN_SHOPFRONT` and `GATE_PASSAGE` are derived from the STREET layer explicitly and recorded `refused` where no street is within reach. |
| **Observable** | five integers: parcels read (1,098), buckets fired (5), buildings partitioned, partis-outside-eligible-set (0), frontages recorded `refused`. **The last is expected to be LARGE** — only **14.8%** of parcels sit within 8 plan units of any street — and a small number there means the street clause was not actually checked. |
| **Declared shift** | none; all five run only in tests. |
| **The control** | a parcel whose slot face is deliberately set below the SHOP floor must be refused a parallel-hall parti. |

### THE ESTATE WAVE (6 cars / 10 commits, **DARK — not inert**)

| | |
|---|---|
| **EXIT** | **The merge arm's SUBJECT passes 1,056 of 1,056 and its CONTROL fails 528 of 528.** Subject: the chord triangle's maximum squared deviation is **0.4999** against the suite's constant of **1**, zero exceedances, symmetric difference at most **1.403%** of the parcel, **1,056 of 1,056** merged parcels three-vertex, **0 of 4,224** subcell pack failures, **3,168 of 3,168** chord vertices passing `withinWard`. Control: the vertex-crossing merge's shared ward vertex sits at squared distance **291.3 min / 3,183.6 max** from the chord, and **0 of 528 pass**. Allocation writes `binding.parcelId` and **nothing else**. The cross-ward merge is refused. |
| **Observable** | the subject/control pair as two fractions — **1,056/1,056 pass and 528/528 fail.** If the control ever passes, the tolerance has been widened until it proves nothing, and the wave stops. |
| ⛔ **A NEAR-THRESHOLD CONTROL IS REQUIRED** | The subject's max squared deviation is **0.4999** and the control's **minimum** is **291.30** — a gap of nearly three orders of magnitude. **So the tolerance could be widened from 1 to anything below 291.3 and both fractions would still read 1,056/1,056 and 0/528**, while the lattice bound the arm rests on (0.5) is already void. The far control cannot detect the failure it exists to detect. **Add `max < 0.51`, or plant a perturbed chord at ≈1.2 that MUST fail.** Keep the vertex-crossing quad as a structural control — it is a legitimate synthetic negative, just not a near one. |
| **Declared shift** | ⛔ **RE-DERIVED AT THE SLOT — the first compile's fence had BOTH a phantom AND a miss.** `git grep -ln townCartographyEnabled 79b78881c -- tests` returns **11 paths / 9 `.test.js`**. `townCartographyDeterminism.test.js`, which the first compile named, **does NOT reference the flag**; `townCartographyProperty.test.js` — MP-1's own test, which lights the stage via `LIT_RULES` and proves parcel membership against a real manifest — **was omitted, and EST-2a/2b/EST-3 move it by construction.** The count 8 survived by coincidence; the membership was wrong in both directions. **The base-stamped set at `79b78881c`:** `townCartographyParcels`, `…Buildings`, `…Wards`, `…Paint`, `…Property`, `townSceneCartography`, `lib/townCartographyBlock`, `hooks/useTownCartographyBlock` — **eight movers**, plus `townCartographyDormancyGolden`, which does NOT move by construction. ⚠ **A probable ninth mover: `townCartographyCalibration.test.js`, via the lit fixture `tests/fixtures/cartographyCalibrationCorpus.js`; and `tests/soak-harness/soakRulesBaseline.json` also names the rule.** ⛔ **The "a ninth moving file is a STOP" rule is SOFTENED, because the first compile hardened a PLAUSIBLE architectural reading into a hard stop that would have fired on a lawful landing.** It now reads: **a mover outside the base-stamped set is a STOP pending re-derivation at the car's own base** — the lane re-runs the grep rather than inheriting this list. |
| **EST-4's added arm (D3)** | `ownerRef` resolves only to a member of THE POWERS or to `ANONYMOUS_FABRIC`; **`owns` is REFUSED for a non-power institution**, which falls to `occupies`. The POWERS set size is asserted small (a seat plus at most three challengers). Mutant: give a guild `relation: 'owns'`. |
| **EST-5 (D2)** | **BLOCKED. Its exit criterion cannot be written until TC-B8-RECON reports**, because the owner has ruled the mechanism demographic and held it under measurement. What can be written now: **both limbs must fire.** Over the soak corpus, concentration events **> 0** AND dispersal events **> 0**. A loop that only concentrates is the runaway; a loop that only disperses is not what was signed. |

### DW-3 — fixtures and dressing (3 cars, INERT)

| | |
|---|---|
| **EXIT** | Every emitted fixture carries a grade drawn from the **3 × 3 wear grid with the six-to-three mapping written out** (B14 — the engine's ladder has six rungs, the band asks for three, and the mapping was never stated before the signature). The supply-state variant is proved by a **DIFFERENTIAL, not an assertion**: the same building at a **stalled** supply chain emits the COLD FORGE and at a **live** chain emits the hot one. |
| **Observable** | the differential's two outputs, byte-compared and shown to differ in exactly the fixture set and nowhere else; and the count of fixtures whose grade falls outside the 3 × 3 grid, which must be 0. |

### DW-4 — the undercity seam (2 cars, INERT)

| | |
|---|---|
| **EXIT** | For every building whose seed resolves through `frontFor(seed).anchor`, **exactly one** surface joint is drawn, and its kind is a member of the closed five. The count of `stair`-at-anchor-"cellar door" joints over the criminal roster is printed and is **11 of 28** rows, matching R-INST-6 §Σ.5. ⛔ **THE HONESTY CLAUSE AND ITS GREP ARM ARE DELETED** — they asserted UC-5 was unbuilt, which is false at this base, so the car would have shipped a literal false statement into every plan and pinned it with a passing test. **What replaces it:** DW-4 resolves each edge against UC-5's shipped `CONNECTION_CLASSES`, and emits **no** join UC-5 has not published, per its ONE PRODUCER PER JOIN law. The two rows that point AWAY from the seam are still NOT dragged into it: the Rookery's loft (E13) and the Whisper market's transcription cell. |
| **Observable** | three integers: joints drawn; joints whose kind is outside the closed five (**must be 0**); and **joins DW emitted that UC-5 did not publish (must be 0)** — the arm that replaces the deleted clause and the one that enforces single-producer. |
| ⛔ **CORRECTED AT THE SLOT** | **UC-5 IS LANDED** — `f4df874ce`, `src/domain/undercity/connectivity.js` = **28,261 B** (§F.0). The first compile inherited R-INST-6 §Σ.5's absence claim and restated it three times in the present tense. **It was true when the dossier was written and false at this base**, which is the whole reason for the standing rule in §A. DW-4 therefore **consumes routes as well as components**, and it consumes them under UC-5's own header law — **"ONE PRODUCER PER JOIN": where no endpoint publishes a portal, no edge is emitted.** DW-4 is a CONSUMER of joins, never a second producer. |

### DW-5 — the validator suite and continuity (4 cars, INERT)

| | |
|---|---|
| **EXIT** | ⛔ **FOUR live arms plus one HELD** (was five — arm 4 is blocked, see below), **each live arm with a deliberate mutation that reds it**: (1) the walker certifies a **ZERO-CELL plan and a ZERO-STORAGE plan as LAWFUL with a reason** — the `NO_BUILDING` verdict must survive validation, which is R-INST-5 §Σ.1's explicit requirement; (2) reachability accepts `approach: NONE` (the anchorhold, a cell with no door) and `HATCH_ONLY` (the prison pit); (3) the **ABSENCE** arm proves a `refused` joint is not there; (4) ⛔ **BLOCKED, AND IT MUST NOT BE "FIXED" BY DELETING THE TERM.** The arm reads `furnaces ≤ flues + portableFurnaces`, and **`portableFurnaces` has ZERO occurrences anywhere in `src`** while `portable furnace` is not a member of the fixture vocabulary — so as written **the arm can never mean what it says** (C-25). ⚠ **The obvious repair is wrong:** dropping the term to `furnaces ≤ flues` would INVERT the finding it encodes. Boerhaave's room *"only had one chimney, whereas he wanted to perform various chemical experiments simultaneously"* — the portable furnace exists precisely to defeat the flue constraint, and R-INST-5 calls it *"the one measured fixture in the family"*. A `furnaces ≤ flues` arm would convict the best-attested laboratory in the corpus. **The arm is therefore HELD, blocked on the pre-DW-1b re-derivation gate delivering `portable furnace` as a fixture kind, and DW-5d ships with FOUR arms until it does;** (5) **every concealed cell debits its host's area and the sum checks** — a hide is subtracted from a declared volume and never added, because the priest hunters measured ceilings. |
| **Observable** | ⛔ **four live arms × two runs each (subject green, mutant red) = EIGHT results, all eight required** — plus arm 4 recorded as HELD with its blocker named, never counted as passing. An arm with no red mutant is struck from the count, **and an arm naming a symbol the vocabulary does not contain is HELD, not counted.** |

### DW-6 — projections (5 cars, INERT until 7a)

| | |
|---|---|
| **EXIT** | The pane renders for a building at each of the **six tiers** × each of the **three verdicts** (BUILDING / HOSTED / NO_BUILDING) = **eighteen cases, all eighteen producing a non-empty projection.** A `NO_BUILDING` case must read as a sentence about where the function happens, not as an error or a blank. The PDF chapter paginates multi-floor. The Foundry export carries wall data. The halo (DW-6d) returns a polygon set for a hovered member **including detached yards and courts** (tier 1, §494) and the estate's other holdings (tier 2, §498 R8c). |
| ⛔ **DW-6d is a CONSUMER (R7)** | its deliverable is **the typed member polygons plus the tier-2 overlay, not a halo.** MP-1's `membersOf`/`openGroundOf` are re-pointed at a new **input** and **their return shapes do not move** — that invariance is the arm. **And a criterion no car currently carries: DW-1f/EST-3 emit typed `CompoundMember` rows with `membersOf`/`openGroundOf` return shapes unchanged.** |
| ⛔ **Counted values, replacing three uncounted clauses** | the first compile wrote "the PDF chapter paginates multi-floor / the Foundry export carries wall data / the halo returns a polygon set" with **no counted value**, in a section whose own rule is that every criterion names what it counts. Restate as integers: **pages emitted for an N-storey building = N** (plus the chapter frontispiece); **walls exported = walls in the model**, a differential against the model's own count; **polygons returned for a hovered member = its compound-member count, and 0 for a `NO_BUILDING` verdict.** |
| **The AD seam (D1)** | DW-6a and DW-6c each expose an art-direction slot: the projection names the shape and the grade abstractly. **Observable: the slot is present and empty, and a fixture is rendered through it rather than beside it** — the identity-pass-through pattern, which is why it is not self-contradictory. ⭐ **C-21 CLOSED (chair, 2026-08-24).** `draft-AD-CHARTER.md` (122,346 B, 1,377 lines, 5 waves / 17 cars, naming `cartographyPaint.js` as the DW-6 seam) existed **only** in the dead `6298872d` session's scratchpad under `/private/tmp` — reapable without warning. It is now preserved at **`refs/preserve/ad-charter-2026-08-24`** = `f23e7978e`, proved byte-identical with `cmp`. ⛔ **Build DW-6's seam against the PRESERVE REF, never the scratchpad path.** |
| ⛔ **The anonymous case (signed B16)** | the first compile ruled the anonymous tier correctly and then gave it **no observable**. `anon` is a distinct resolved tier with a distinct gate row (`maxTier:'town', maxSaves:0` against free's `capital`/3, `authSlice.js:48`). **Add an arm: the map block is present in the dossier payload at tier `anon`.** |
| **The paywall arm (C.4)** | **`VIEWING_PAYWALLS_PENDING_514` has not grown.** Its length is still **3** and no DW-introduced entitlement row carries `axis: 'viewing'` with `free` anything but true. The ledger is shrink-only by test; DW must not add a fourth. Mutant: add a viewing-axis row with `free: false`. |

### DW-7 — deltas, news, activation (4 cars; **7a is the only LIGHT car**)

| | |
|---|---|
| **EXIT** | The flag's **six** surfaces are all edited in ONE commit and the acceptance file contains the literal `<flag>: true`. The **strict no-op test**: an empty `PlanDelta` produces **byte-identical** output and consumes **zero** rng. `viewerCanAuthor` gates **AUTHOR and only AUTHOR** — a VIEW case and an INTERACT case both pass with `viewerCanAuthor === false`, and an AUTHOR case is refused with it false and admitted with it true. News hooks emit under the NEWS ADDRESS LAW (address chain + typed action + names + reason) for amalgamation, partition, dissolution and change of use, and **not** for a plain renovation. |
| **Observable** | the six-surface bill as six diffs in one commit; the no-op test's byte comparison and rng counter (both must be exactly zero-delta); ⛔ **FIVE entitlement cases, not four** — view-free, interact-free, **anon-free**, author-refused, author-admitted. |
| ⛔ **The EDITS-DELTA arm (B4)** | a `PlanDelta` whose anchor no longer resolves in a re-derived plan **DROPS** — never throws, never ghosts — **with its convicting mutant** (make the dangling case throw, or make it re-appear). Plus: **every `PlanDelta` schema key is denylist-safe** (∉ `PRIVATE_KEY_RE`) — `chronicle` and `seed` are both denylist tokens and DW emits both. |
| ⚠ **Undo** | `undo` is **0 occurrences across all three DW documents**, while the map pane beside DW-7a ships `canUndoEdits`/`editHistory.undo` (`useTownMapPresentation.js:237`). **As chartered, a paying Cartographer gets edit-without-undo on the plan.** §I C-18. |
| **⚠ What DW-7a changes for a paying user** | the ladder's de-advertised ledger records `interiors` as **UNGATED and UNSHIPPED** — nothing in product imports `InteriorView.jsx` and no enter-interior affordance exists, so a paying Cartographer receives nothing for that row today. **DW-7a is the car that makes the row real.** The before/after sitting is the owner's; there is no legacy to cut. |

### DW-S — the soak leg (3 cars, INERT, findings only)

| | |
|---|---|
| ⛔ **EXIT — ARMS A1–A9 RESTORED; THE FIRST COMPILE DROPPED THE CONSTITUTIONAL ONES** | The draft's §6.1 lists **A1–A9**; the first compile named only A7 and reduced the Observable to "four numbers and a boolean". **Three of the dropped arms are constitutional and are hereby the leg's BLOCKING arms:** **A4** — *same epoch, same seed ⇒ byte-identical plan* — **THE PROMISE, and the precondition of every other arm**; **A8** — *no reverse motion rewrites what an earlier year recorded*; **A9** — *the mechanical statement of "lived history is immutable"*. **A leg that certifies green with same-seed determinism and lived-history immutability unmeasured is not a soak leg.** |
| ⛔ **A7 RE-SPECIFIED (ODQ §517.5)** | §517.5 states *"DW-S's ownership arm is re-specified accordingly"* and names the **discriminating** measures: **saturation year** and **residential floor** — **0.376 vs 2.066, a 5.5× separation, against only 2× on ownership share.** The first compile's ownership-share observable is the *weakest* of the three. **Report saturation year and residential floor as primary; ownership share secondary.** A7 must still **announce itself as "not exercised" when no amalgamation ever fired** — a green arm over an empty corpus is not a pass. |
| **The B8 loop** | both directions fire over 300 years: concentration count **> 0** AND dispersal count **> 0**; otherwise the leg reports the loop as one-directional and the finding goes to the tuning pass. A timing series is kept for drift. |
| **Observable** | per epoch: **A4/A8/A9 as pass-or-stop booleans**; A7's saturation year and residential floor with ownership share beside them; the two direction counts; the exercised/not-exercised flag. |
| ⚠ **Owner-gated (O5)** | restoring the arms is the chair's; **deciding to certify the soak leg green with THE PROMISE unmeasured is not.** |
| **⚠ PROVISIONAL-ON-CH3** | the soak corpus must be regenerated after CH-3, or its baseline is a different world (81 of 420 settlements change). |

---

## §H · THE R-INST-5 ENGINE DEFECTS — WHERE EACH ONE GOES

**⚠ First, the count.** The dispatch says **seven** defects, G1–G7. R-INST-5 §Σ.2's own header says
**"six DEFECTS"**. **The list under that header runs G1 to G8 — eight items.** Three different
counts for one list. **Eight is what the dossier carries, and all eight are dispositioned below.**
*(Conflict C-9.)*

**The headline, and it is a clean result: exactly ONE of the eight is DW's. Seven belong to CH or
to the content train.**

| # | Defect | Absorbed by | Reasoning |
|---|---|---|---|
| **G1** | Three unanchored-substring mis-inferences in `FACET_INFERENCE` — `Warden's Lodge`→vice (the `/den/` in "War**den**'s"), `Dragon resident`→vice, `Charlatan fortune tellers`→security (the `/fort/` in "**fort**une") | ⛔ **CH-1 IS LANDED (`b2852ccc3`) — do NOT hand it a work order.** But it landed NARROWER than the draft said, and it leaves DW a **residual**. | ⛔ **The `\b`-anchored chokepoint landed; the per-entry `interiorKind` override DID NOT** (measured: 0 occurrences in the catalog and in `cohesionWeave.js`). The override channel that exists is a catalog `facets` key. ⛔ **J-CH-1 hands `Warden's Lodge` BACK to DW in writing — "DW-1 assigns the real kind" — and the first compile recorded neither the return nor an owning car.** The gap is the **interior KIND**, not the parti (`MOATED_PLATFORM` is already a DW-1 member): **DW-1's five chartered vocabularies contain no kind vocabulary**, and the draft makes `interiorKind` a *consumed input* to S2, so **nothing in the program mints it.** Owed a car (§I C-22). ⚠ G1's membership is far larger than three: R-INST-6 §Σ.3 adds **six** on the Criminal shelf from `guild\|market\|bazaar` plus **five** from `smuggl`; R-INST-4 E-1 adds every inn row → `generic`, `Gladiatorial school` → `learning`, `Hireling hall` → `civic`. |
| **G2** | Four `high magic` rows carry `minTier:'metropolis'` while authored in the `city` block, so they can never fire at their own tier | **CH-3, both halves. Out of DW scope.** | The generation half is CH-3's `minTier` deletion (26 declarations); the visible half is CH-3's new UI `minTier` filter. **PROVISIONAL: whether all four are in the 26 is not measurable until CH-3 lands.** Sibling on a second shelf: R-INST-6 **D6-1** (`Smuggling network` village L865 with `minTier:'city'`), which promotes the shape from a magic-shelf quirk to a catalog-wide audit item. |
| **G3** | A mundane chemical trade is deleted by a dead-magic world — `Alchemist shop` and `Alchemist quarter` carry `tags:['arcane','alchemy']`, both in `ARCANE_INST_TAGS` | ⛔ **CH-5, and the chair has RULED ITS SHAPE (§541). Out of DW scope.** | **CH-5 ships Shape F: move `alchemy` ALONE into a sibling `TRADE_INST_TAGS`, and de-tag the three `none`-licensed rows.** That is the cure, and it is the right one because **`ARCANE_INST_TAGS` is a TRADE vocabulary doing a MAGIC-DEPENDENCE job** — `alchemy` is a member, so **deleting `arcane` does not de-arcane an alchemist.** A lane that edits only the `arcane` tag would believe it had cured G3 and would not have. ⛔ **Separately, §541 gives `ARCANE_INST_KW` to CH-6, because the keyword list carries a live DEITY-DOCTRINE VIOLATION. DW must not touch either list.** |
| **G4** | The Adventurers' charter hall's shelf artefact, with **two** live behaviours: the hamlet and village halls vanish at `magicExists === false` while the town hall survives; and the hamlet and village rows are multiplied by `priorityMagic/50` and a tier penalty while the town row is not | **SPLIT: the behaviour half is CH; the shelf placement is the CONTENT train. Out of DW scope.** | The row sits on the **Magic** shelf at hamlet and village and on the **Adventuring** shelf at town. Which shelf is right is a content decision. The behaviour — `institutionProbability`'s multiplier firing on `cat.includes('magic')` — is a shelf-as-gate path, the same class as G5. **DW's only obligation: DW-R2 must not key a `ProgramMinimum` row off the SHELF.** ⛔ **And the assignment must be written into the draft's §8.3 scope list — the one surface a content lane actually reads.** §8.3 sits *outside* the "§5.0–§5.10 stands" range and currently has 0 occurrences in this charter, so the content half of G4 is assigned in a place no content lane will look. |
| **G5** | The Great library's shelf reaches the generation multiplier — authored `tags:['education','education']` but shelf `Magic` | ⛔ **REFUTED BY EXECUTION. Not a defect to route.** | CH's own H18 refuted G5's dead-magic half by running it, and **CH §2(b) states "CH-2 should not 'fix' either".** The first compile referenced `draft-CATALOG-HYGIENE-PLAN.md` exactly twice and **never read its measured home table**, restating R-INST-5's prose instead. **Take CH's measurement over the dossier's prose.** |
| **G6** | `Dragon resident` diverges between the generation gate and the UI gate | ⛔ **REFUTED BY EXECUTION on the gate half; DW's relation stake SURVIVES.** | CH's **H19** ran it: `Dragon resident` appears **0 times at `magicExists:false` and 0 at `pm0` across 840 settlements.** The divergence the dossier inferred does not occur. **DW's stake is untouched and real:** the row's verdict is `O` — OCCUPATION of a ruin, cistern, amphitheatre, quarry or undercity void — so **`occupies` (DW-1f, EST-4) is what makes the row drawable at all.** |
| **G7** | Three of eleven hard-zero keywords match no catalog row (`magical banking`, `magic item consignment`, `enchanting quarter`, proved by awk over all 311 rows), and one is a member of `magicFilter`'s `ARCANE_GOODS` — a GOODS vocabulary has leaked into an INSTITUTION gate | **CH-2. Out of DW scope.** | Harmless today, a trap tomorrow: a future row named "Enchanting quarter" would be hard-zeroed below `priorityMagic` 66 while "Alchemist quarter" and "Enchanter's shop" are not. **DW's obligation: DW-R2 may not create or assume a row whose name matches one of the three without telling the chair, because such a row would arrive pre-hard-zeroed.** |
| **G8** | **The interior vocabulary cannot express this tranche.** Eight `INTERIOR_KINDS`, 28 `ROOM_KINDS`, 22 `FURNISHING_KINDS`, and no home for a furnace room, laboratory, preparation room, yard, courtyard, gallery, gatehouse, stable, mews, service passage, charnel or observing platform; no fixture for an athanor, niche, ring table, alembic, cupel tray, pigeonhole rack, shutter-counter, perch, manger, trough, tether ring, standing stone, well, signal mount or mooring ring. Across eleven families the dossier records a typed home for roughly a third of its functions and **none for the rest**; family E scores **zero of seven**, because the interior grammar has no concept of a building-less institution | **⭐ DW. This is the one. Absorbed by DW-1a (cells 28 → 83) and DW-1b (fixtures 22 → 82), with the building-less half absorbed by DW-1f's `NO_BUILDING`.** | G8 is not a catalog defect and not a gate defect — it is the vocabulary gap the DW program was chartered to close. Family E's zero-of-seven is the clearest statement in the corpus of why `NO_BUILDING` had to become a first-class verdict rather than a fallback. |

### ⛔ H.2 · THE "ALREADY DISPOSITIONED" PARAGRAPH WAS FALSE FOR TEN ITEMS (blocker B5)

The first compile wrote that R1–R14 "are already dispositioned by the draft … and are not
re-litigated here", and said the same of E1–E16. **Measured by substring count over both frozen
sources, ten of those items appear NOWHERE in either document** — and the sentence then forbade
re-opening them. **This is the §441 J7 phantom home applied to ten items at once, and it is the
largest loss-of-item finding on the docket.** "Already dispositioned" with no citation is not a
disposition.

| Request | Carried in the draft? | Disposition |
|---|---|---|
| **R1** OCCUPATION | ✓ §3.3 | DW-1f / EST-4 |
| **R2** `zoning` · **R3** `precinct` | ✓ | DW-2c |
| **R4** `Site`/`Structure` + zero-cell certifier | ✓ | DW-5b |
| **R5** `flueCount` | ✓ | DW-5d |
| **R6** `RECESS` | ✓ | DW-1b |
| ⛔ **R7** `apertureFor`, `strengthFor`, the TWO-DOOR rule | ✗ **UNCARRIED** — `apertureFor` 0/0, `strengthFor` 0/0, `two-door` 0/0 | routed to DW-1e, whose draft row is **StorageCell + polarities** — a different subject. **Owed a contract or a recorded deferral.** |
| **R8** frontage kinds | ✓ | DW-2a |
| **R9** `joint.refused` + store prohibition | ✓ | DW-1e |
| ⛔ **R10** `apertureUse: LIGHT\|VENT\|PROCESS_LOOP`, `lightDemand` that can say LESS | ✗ **UNCARRIED** — `apertureUse` 0/0, `PROCESS_LOOP` 0/0 | routed to DW-1a, whose row is **cell kinds**. **Owed.** |
| ⛔ **R11** `sightLine{sky\|terrestrial}`, `prospect` | ✗ **UNCARRIED** — `prospect` 0/0 | routed to DW-2c, whose row is **parti placement**. **Owed.** |
| ⛔ **R12** `permanence`, `seasonalOccupancy` | ✗ **UNCARRIED** — both 0/0 | routed to DW-1c, whose row is **the parti enum**. **Owed.** |
| **R13** `magicLicense` | — | **CH-2, NOT DW.** DW consumes, never mints; DW-2's `clearSpan: EXTREME` reads it. **CH-2A is LANDED** (§F.0), so it is consumable today. |
| **R14** `socialTolerance` | ✓ | read from existing faction/stressor machinery |

**And six of the sixteen engine gaps are likewise uncarried** — anchored counts in the draft:
**E6 0 · E7 0 · E8 0 · E9 0 · E10 0 · E12 0**, and 0 in the architecture. *(E7 is separately
DISCHARGED by UC-5 — see below — but it was never carried, which is a different defect from being
wrongly parked.)* **Each uncarried item gets a car with a contract, or a deferral in §K with a
reason. None may be closed by assertion.**

**R-INST-6's sixteen engine gaps E1–E16 map the same way** and the draft already carries them.
Two are worth restating because the first compile got both wrong. **E7** (no inter-building
circulation edge — the cellar-to-cellar breach across a party wall) was recorded as
"ACCEPTED-PARKED on UC-5, whose module does not exist at any ref". ⛔ **Both halves were false.**
UC-5 is landed, and it ships exactly the edge E7 asked for: `CONNECTION_CLASSES` includes
**`ADJACENCY_BREACH`**, returned with cause `SHARED_QUARTER_WITH_MOTIVE` at `connectivity.js:397`.
**E7 is DISCHARGED by UC-5, not parked** — and DW consumes the edge rather than minting one.
**E13 and E16** want new members of a **closed** joint-kind enum; DW answers them with the
`joint.target` attribute and defers the kinds as **D-6**. ⛔ **D-6 must be RE-HOMED: UC-5 was the
undercity train's sixth and last car, so the train those kinds were deferred to has no remaining
dispatch vehicle.** Recorded as an open item for the chair (§I C-20).

---

## §I · CONFLICTS FOUND — WITH A RECOMMENDATION FOR EACH. THE CHAIR RULES.

**Nothing below was silently resolved.** Each row states both sides. **Twenty-five rows: C-1..C-15 from the
first pass against the signature, C-16..C-23 from the second pass against the slot, and C-24..C-25
from measuring the chair's own four questions — both of which turned out bigger than the question.**
**C-21 is CLOSED.**

| # | Conflict | Side A | Side B | **Recommendation** |
|---|---|---|---|---|
| **C-1** ⭐ | **The paywall axis.** | Draft B16: "the full lawful plan free; **secrets premium** — concealed chambers, undercity links, the reasons behind an absence, DM-tier fixture naming." | Signed B16b: "viewing and interacting with it is not [paywalled]" — at ALL levels. | **Adopt the signature; strike the draft's B16 recommendation entirely.** The axis is AUTHOR, not depth. Secrets follow the dossier's existing account-type gate and get no map-specific gate. **This is the sharpest conflict in the compile: the draft's version is paid-surface behaviour the owner did not sign.** And DW must not grow `VIEWING_PAYWALLS_PENDING_514` past its current length of 3 (§C.4). |
| **C-2** ⭐ | **`Estate.ownerRef` scope.** | Draft §3.4/EST-4: an **institution anchor** or `ANONYMOUS_FABRIC`. | Signed §519: **POWER-scoped** — THE POWERS (`powerStrata.js`) or `ANONYMOUS_FABRIC`; §518's faction reading superseded. | **Adopt §519.** Consequence the chair should rule on explicitly: `owns` is refused for every non-power institution, so **`occupies` becomes the common relation and must be as cheap as `owns`.** EST-4's arms change accordingly (§F.3 D3). |
| **C-3** ⭐ | **B8's mechanism.** | Draft B8: acquisition from the `prosperous` rung upward; a rate tuned so 5–15% of plots amalgamate over 300 years, concentrated on longest-frontage plots. | Signed B8: "**it is not a percentage idea**" — a two-way demographic loop driven by prosperity and wealth placement, both directions required. | **Strike the draft's B8 recommendation. Adopt the loop, specify its shape, refuse to specify its numbers, and hold EST-5 on TC-B8-RECON.** Do not pre-split the car (§F.3 D2). |
| **C-4** | **When illustration lands.** | Draft B15: "illustrated as **a later style wave**" — after launch. | Signed B15: "abstract now but **illustrated before launch**"; chartered as AD at the DW-6 seam. | **Adopt the signature.** AD is a new pre-push train outside DW's 41; **DW-6a and DW-6c owe it a seam** or AD becomes a re-cut of DW-6 (§F.3 D1). |
| **C-5** | **B1 coverage vs B1 policy — these are two questions and the draft ran them together.** | Draft B1: a three-way policy tier SPARE / HONEST / GENEROUS, recommending HONEST, with the chair's "bite from village up". | Signed B1: "**no tier is exempt**"; every tier carries a minimum program; HOSTED and NO_BUILDING are programs, not exemptions. | **Both survive, because they answer different questions.** Keep **HONEST** as the policy tier — the owner did not strike it, and the draft is honest that the tier is taste while the per-institution minimums are measured. Adopt the signature on **coverage**: DW-R2 has no tier holes. |
| **C-6** | **Commit arithmetic inside the draft.** | Draft §Σ: "41 DW cars in 10 waves, **44** dispatchable commits". | Draft §5.0: "41 DW cars, **45** dispatchable commits", and "the arc a build lane actually dispatches is **47**". | **45 DW commits is right; the §Σ 44 is an error** — `41 + 3 (EST-1) + 1 (EST-2) = 45`. ⛔ **But the dispatched total is 46, not 47**: re-derived at the slot, **CG-1 and CG-1b are LANDED and only CG-2 remains**, so `45 + 1 = 46` (§F.0, §F.2). Correct both figures at the ruling. |
| **C-7** | **CH-3's scope has grown since §0.6 was written.** | Draft §0.6: CH-3 changes "the **five** `minTier:'metropolis'` rows authored in the CITY block"; R-INST-5 G2 names **four**. | Chair, live: **26** redundant `minTier` declarations, plus `religiousCenter` deleted from two city rows (81/420 settlements re-roll), plus a UI `minTier` filter (10 city rows vanish from the UI). | **The draft's §0.6 CH-3 row is stale. Re-write it from CH-3's own landed packet, not from memory**, and mark every DW figure that reads catalog tier-eligibility PROVISIONAL-ON-CH3 (§B). |
| **C-8** | **R-INST-6 contradicts itself on the NO_BUILDING count.** | §Σ.1 law 3: "**Sixteen** of the 28 rows are NO_BUILDING at every tier they exist at (see §Σ.4)." | §Σ.4's own performed audit: "**NO_BUILDING 11** (rows 1, 2, 3, 4, 5, 9, 15, 18, 20, 21, 28)", and 3 + 1 + 13 + 11 = 28 closes. | **Take 11.** The audit is per-row, enumerated, and closes to 28; the "sixteen" cites §Σ.4 and §Σ.4 does not support it. **The draft charter already uses 11 and is right.** Recommend the chair have the dossier's law-3 sentence corrected, or a later reader re-imports 16. |
| **C-9** | **How many G-defects there are.** | Dispatch: **seven**, G1–G7. R-INST-5 §Σ.2 header: "**six** DEFECTS". | The list under that header runs **G1 to G8**. | **Eight.** All eight dispositioned in §H. The header and the dispatch are both undercounts, and the undercount matters because **G8 is the only one that is DW's** — a lane reading "G1–G7" would disposition away every defect and never notice it had been handed its own wave. |
| **C-10** | **R-INST-5's finding count.** | Dispatch: "five charter findings". | R-INST-5 §1: "**the seven anchor findings** this tranche stands on". | **Seven.** Not load-bearing — recorded so the counts in the ledger agree. |
| **C-11** | **`religiousCenter` at town tier.** | R-INST-3 §Σ.2 item 3: lift the exclusivity at CITY tier; "**At town the placement is correct.**" | CH-3 deletes the `exclusiveGroup` from the **two city rows**. | **No conflict — they agree.** Recorded as a **dependency, not a conflict**: the 81/420-settlement re-roll is a DW-R2 input, and the DW-S soak corpus must be regenerated after it. |
| **C-12** | **Where the DW documents actually live.** | Dispatch: `docs/DESIGN_DWELLINGS_PROGRAM.md` (~237 KB) + an architecture doc alongside it, on `review-fixes-2026-07-08`. | Measured: that path on that branch is **31,733 B**; **no architecture doc exists there**; the ~237 KB and ~141 KB documents are in the preserve ref; **neither exists at the build slot or on master**. | **All three were read.** The chair sets the landing path. This compile writes to the build slot's tree as a new file because nothing it would overwrite is present. |
| **C-13** | **The CH/DW ordering, in writing, in two places.** | `draft-CATALOG-HYGIENE-PLAN.md` line 5: the three repair cars land "**before DW-0**". | The pickup card: all CH cars land before DW's **BUILD waves**; the compile is ordered now. | **The chair has already ruled for the pickup card and this compile proceeds under it.** Recommend the plan doc's line 5 be corrected at CH's next touch, or the question re-opens. |
| **C-14** | **Fixture-kind count.** | Dispatch: **81** fixture kinds. | Draft §2.3 as amended by AR-7: **82** (`22 + 60`), by mechanical recount, zero duplicates, zero collisions. | **82.** The 81 is the pre-amendment figure. |
| **C-15** | **`joint.target: ROOF/WATER` vs the deferred ROOF/WATER joint KINDS.** | §2.8: DW adds `ROOF` and `WATER` as `joint.target` values, "DW adds NOTHING to that enum". | §8.8 / D-6: the ROOF joint KIND and the WATER-LANDING joint KIND are **deferred**, because both need a new member of a closed enum another train owns. | **No conflict — the draft is right and the distinction is load-bearing.** Recorded here only so a later reader seeing `ROOF` in `joint.target` does not conclude E13 is discharged. The attribute says where a joint points; the missing kind says what it is. |
| **C-16** ⭐ | **DW-1's per-car census deltas.** | Charter `6/4/2/2/2/3` = 19 (a splice); draft `1/1/2/2/2/3` = 11. | Architecture `6/4/5/5/5/5` = **30**, each figure equal to that car's declared acceptance-arm count. | **The architecture (ruling R3).** §A already rules it STANDS. The alternative forces four cars' packets down from five arms to two, discarding named convicting mutants §G's own rule requires. |
| **C-17** | **Is `ring table` a fixture kind?** | §H's own missing list names it; R-INST-5 carries it 8 times in the corpus's best-sourced passage (Uraniborg's circular working table). | The 60-member add list omits it. | ⛔ **SUPERSEDED BY C-25 — it is not one fixture.** Measuring the question turned it into a bigger one: **13 of that passage's 21 fixtures are missing**, and the list's own claim to be "the tranches' union" does not hold. **Do NOT add `ring table` alone and restate 22 + 61 = 83** — that would repair one symptom and leave twelve, and would spend a declared figure move on an incomplete count. **RULED BY THE CHAIR, 2026-08-24: do NOT add `ring table`.** Re-derive the 60 mechanically first (C-25), then move the figure ONCE. |
| **C-18** | **Undo on an authored plan.** | The map pane beside DW-7a ships `canUndoEdits`/`editHistory.undo` (`useTownMapPresentation.js:237`). | `undo` is **0 occurrences across all three DW documents**. | **A paying Cartographer must not get edit-without-undo.** Either DW-7b carries undo or §K records the deferral with a reason. Owner-adjacent, because it is paid-surface capability. |
| **C-19** | **Two exit criteria cannot be executed as written.** | §G requires every criterion to name what it counts and what value it must take. | DW-2b's "within the declared tolerance" declares no tolerance anywhere; DW-1's "~35 storage / ~55 circulation sub-forms" are approximations, so §453's closets and pantries are the only vocabularies with no ratchet. | ⭐ **RULED BY THE CHAIR, 2026-08-24 — ZERO. Require the lattice, not an epsilon.** The engine offers only two precedents and neither fits: the suite's `withinWard` accepts a **squared distance ≤ 1** (a *containment* test on a point, not an area reconciliation, `townCartographyParcels.test.js:164-172`), and `SURFACE_DEPTH_TOLERANCE_CM = 600` (`scenePortraitExport.js:32`) is a 3-D depth band. **Borrowing either would import a number that governs something else.** Since parcel vertices are already integer lattice points and an integer polygon's shoelace is an exact integer, **constrain DW-2b to place cell vertices on that lattice and the area accounting closes exactly.** ⛔ **THE FALLBACK IS STRUCK BY THE CHAIR.** There is no epsilon to spend: **if DW-2b cannot place cell vertices on the lattice, that is a FINDING to bring the chair, not a tolerance to invent.** The law of record: ***a tolerance is a place for drift to hide.*** **Recount `~55` and `~35` mechanically and pin both as integers with mutants.** |
| **C-20** ⭐ | **D-6 has no owning train.** | The ROOF and WATER-LANDING joint kinds were deferred "to the train that owns the closed enum". | **UC-5 was the undercity train's sixth and LAST car**, and it is landed — the train has no remaining dispatch vehicle. | ⭐ **RULED BY THE CHAIR, 2026-08-24 — DW-1d, and the chair's own leaning toward DW-1a was withdrawn on this evidence.** Measured: `jointVocabulary.js` lives in `src/domain/undercity/`, its header says it is *"minted by UC-0, the first car of the train"*, and its six consumers are **all** undercity files. Growing `JOINT_KINDS` would (i) make a DW car a writer inside a **closed** train's data module, and (ii) widen an *underground portal* vocabulary — its own words — to carry a **sky aperture** and a **water landing**, forcing six undercity consumers to handle two members no undercity producer will ever emit. **RULED: DW-1d mints `SURFACE_JOINT_KINDS` (`roof_aperture`, `water_landing`), imports the undercity's five unchanged, and carries an arm asserting the two sets are DISJOINT.** DW-1d rather than DW-1a because **a joint is a circulation primitive, not a cell** — DW-1a owns `CELL_KINDS`. **The law of record, in the chair's words: *two enums with an asserted disjointness aren't two truths; one enum spanning two strata with no producer for half of it is.*** |
| ~~**C-21**~~ ✅ **CLOSED 2026-08-24** — preserved at `refs/preserve/ad-charter-2026-08-24` (`f23e7978e`), byte-identical by `cmp`. Build the seam against the ref. | **The AD charter was unreachable.** | ODQ §526 records `draft-AD-CHARTER.md` at 122,346 B / 1,377 lines, 5 waves / 17 cars, naming `cartographyPaint.js` as the DW-6 seam. | The file is **absent from every ref and from disk**, so AD's 17 cars could not be walked for a reverse dependency on DW. | **Get it into a preserve ref before DW-6a/6c build an unnamed art slot.** Ordering is sound either way (§514.4 puts AD strictly downstream of DW-S), but an unreachable charter cannot be a seam contract. |
| **C-22** | **Who mints `interiorKind`?** | J-CH-1 hands `Warden's Lodge` back to DW in writing: "DW-1 assigns the real kind". | DW-1's five chartered vocabularies contain **no kind vocabulary**, and the draft makes `interiorKind` a *consumed* input to S2. | ⭐ **RULED BY THE CHAIR, 2026-08-24 — SPLIT AS FRAMED. The VOCABULARY is DW's; the per-row DECLARATION is CH's.** `INTERIOR_KINDS` is at `interiorTemplates.js:29` and `interiorKindOf()` at `:172` — **the same file DW-1a and DW-1b already modify**, so DW mints the kind today and no new car is strictly needed; **fold `INTERIOR_KINDS` into DW-1a's changeManifest** (it is the file's own enum, beside `ROOM_KINDS` at `:35`) rather than minting a sixth vocabulary car for one 8-member array. **But `Warden's Lodge` specifically cannot be fixed by a vocabulary at all** — its kind is mis-*derived* from its NAME, and the only per-entry override channel that exists is a catalog `facets` key, which is a **golden-shifting catalog byte change** and therefore CH's or the content train's. ⛔ **RULED: J-CH-1's hand-back is recorded as HALF-EXECUTABLE. DW supplies the kind — `INTERIOR_KINDS` folds into DW-1a's changeManifest. The `Warden's Lodge` half is ROUTED BACK TO THE CH TRAIN**, which already owns catalog rows and already carries declared shifts. See C-24: the override CH-1 was expected to ship never landed. |
| **C-23** | **Three namespace hazards, inherited not introduced.** | — | `C-5` is a substring of `UC-5`; three D-namespaces run at once (divergences D1–D7, deferrals D-3/D-6/D-10, R-INST-6's D6-1); §F.4's EST block reuses `2a`/`2b` ambiguously. | **Recorded, not renamed** — renaming inherited ids across three documents would break more cross-references than it fixes. A grep for `C-5` must be written `\bC-5\b`. |
| **C-24** ⭐ | **CH-1's landed scope is narrower than every DW document says.** | The draft's §0.6 and the first pass of this charter both state CH-1 "adds an explicit per-entry `interiorKind` override so a NAME is never the only evidence", and route DW to read it. | ⛔ **Measured at the slot: `interiorKind` occurs in ZERO catalog rows and ZERO in `cohesionWeave.js`.** CH-1's landing commit touched four files, all docs and one walker test; its member commits shipped the `\b`-anchoring only. The one override channel that exists is a declared `facets` key. | **Strike "DW reads `interiorKind` where declared" wherever it appears.** DW's kind derivation is `interiorKindOf()` at `interiorTemplates.js:172` — **already in DW's own file** — and it reads `facetOf(inst,'institutionNature')`. **This is the same decay class as UC-5, inverted:** the dossier described work that had not landed yet, rather than an absence that had since been filled. **Both are cured by the same standing rule — re-measure at the slot.** |
| **C-25** ⭐ | **The 60-member fixture add list claims to be "the tranches' union, de-duplicated" and is not.** | §2.3's own words: *"22 today. **The tranches' union, de-duplicated**"*, then a flat list of 60 lowercase names, pinned at 82. | ⛔ **Measured this lane.** On R-INST-5's single best-sourced passage — the Uraniborg/Boerhaave laboratory `fixtures[]` line, which §1.1 calls the only itemised magical-practice interior in the European record — **8 of its 21 fixtures are carried and 13 are not**: `BALNEUM`, `SAND_BATH`, `ASH_BATH`, `LAMP_FURNACE`, `PORTABLE_FURNACE`, `RING_TABLE`, `WINDOW_SILL_BENCH`, `CRUCIBLE_RACK`, `CUCURBIT`, `ALUDEL`, `RECEIVER`, `LOCKED_PRESS`. A broader mechanical sweep over every `fixtures[]` block in five tranches finds **57 of 363 tokens carried** — ⚠ **that 84% figure is a SIGNAL, not 306 defects**: some tokens are structural buckets, some are variants the list may fairly consolidate, and I sampled rather than adjudicated each. | ⭐ **RULED BY THE CHAIR, 2026-08-24 — A NAMED PRE-DW-1b GATE, and its EXECUTION belongs to DW-1b's dispatch, not to this compile.** Re-derive the 60 mechanically from the tranches' own `fixtures[]` blocks before DW-1b; **treat 82 as PROVISIONAL until it runs** — exactly as B11's collision check became a pre-DW-1 gate. **The gate's method, recorded so the lane can re-run it rather than re-invent it:** extract every backticked `UPPER_SNAKE` token from each `fixtures[]` block across the six tranches, case-fold, and diff against §2.3's 60-name list. **Its evidence: 8 of 21 carried on R-INST-5's best-sourced passage; 57 of 363 tokens carried across five tranches.** ⚠ **The 84% is a SIGNAL, not 306 defects — the chair has directed that it NOT be upgraded into false precision.** Some tokens are structural buckets, some are variants §2.3 may fairly consolidate, and this lane sampled rather than adjudicated each one. ⛔ **One non-arguable defect proves the list is unsafe as it stands: DW-5d's acceptance arm is literally `furnaces ≤ flues + portableFurnaces`, and `portable furnace` is NOT a member** — the dossier calls it "the one measured fixture in the family, and the one that DEFEATS the flue constraint". **An acceptance arm names a fixture the vocabulary does not contain.** |

---

## §J · JUDGMENT CALLS — EACH VETOABLE BY A WORD

| # | Call | Rejected alternative | How to reverse |
|---|---|---|---|
| **J-DW0-1** | **This compile is a LAYER over the frozen draft, not a rewrite of it.** | Re-emitting a single ~250 KB charter with the rulings folded in. | Rejected because it would create a second truth about every measured figure and would risk transcription error on numbers six research lanes produced. Reverse by merging this document into the draft at the chair's ruling, once the figures are stable — i.e. after CH-3. |
| **J-DW0-2** | **No new DW wave and no new DW car.** 10 waves / 41 cars stands. | Minting a B8 wave, an AD wave, and a §519 ownership car. | The signature changed policy, not scope. AD is placed outside DW's 41 (like CH and CG) because an art program inside an engine program forks single-writer. Reverse by chartering AD as DW-8 if the chair prefers one train. |
| **J-DW0-3** | **EST-5 is held, not pre-split.** | Splitting into EST-5a/5b now, taking the program to 42 cars. | The owner explicitly held B8 "under measurement before further specification". Spending a car against an unmeasured mechanism is the substitution the CG train exists to punish. Reverse the moment TC-B8-RECON reports a two-limb mechanism. |
| **J-DW0-4** | **`occupies` is re-sized from rare to common as a consequence of §519**, and this is reported as a build-affecting consequence rather than absorbed quietly. | Reading §519 as touching only `ownerRef`'s type. | §519 says `ownerRef` is POWER-scoped and THE POWERS is a seat plus at most three challengers. Every other institution's building claim must go somewhere, and `occupies` is the only relation that takes it. If the chair intends non-power institutions to keep `owns`, say so — it is a one-word reversal and it changes EST-4's arms. |
| **J-DW0-5** | **Exit criteria are stated as integers and differentials, and every control is required to be capable of failing.** | Per-wave prose acceptance, as the draft's §5 tables carry. | The dispatch asked for observable exit criteria. Where the draft already supplies a measured figure, that figure is the criterion; where it does not, the criterion is a count the acceptance prints. **The ESTATE wave's criterion is deliberately a SUBJECT/CONTROL pair** — if the control ever passes, the tolerance has been widened until it proves nothing. |
| **J-DW0-6** | **The paywall collision is reported against live code and named as owner-gated, not fixed.** | Recommending DW repair the three pending viewing paywalls. | `entitlementLadder.js`'s own header says these are reported rather than corrected because paid-surface behaviour is the owner's call. DW's obligation is the negative one: do not add a fourth. |
| **J-DW0-7** | **G4 is split between CH and the content train rather than assigned to one.** | Assigning the whole of G4 to CH-3. | G4 has two live behaviours with different owners: the multiplier firing on `cat.includes('magic')` is a code path (CH); which shelf a row belongs on is a content decision (content train). Assigning both to CH would put a content ruling inside a hygiene car. |
| **J-DW0-8** | **The `docs/**.md` claim vocabulary is avoided throughout this document rather than tagged.** | Using the natural phrasing and adding `@enforced-by` tags. | `tests/docs/enforcement-claims.test.js:40`'s `CLAIM_RE` requires a co-located `@enforced-by` naming a live enforcer within ±3 lines of any claim-vocabulary hit. This is a charter, not an enforcement claim; every enforcer it names is unbuilt by definition. Avoiding the vocabulary is the honest option. |
| **J-DW0-9** ⭐ | **Every absence claim inherited from the dossiers is re-measured at the slot, and the rule is written into §A as standing law.** | Trusting a frozen dossier's "does not exist", which is what the first compile did. | This is the correction that matters most. Absence is the one claim that decays silently: UC-5's non-existence was **true when R-INST-6 was written and false at this base**, and nothing signalled it. The structural cause was reconciling against an orphan ref. Reverse only by showing a dossier absence that cannot decay — there is no such thing. |
| **J-DW0-10** | **The panel's docket was independently re-measured rather than adopted.** | Applying the fourteen blockers as written. | Two came back **understated** — B10's artifact path is `src/domain/compendium/generated/`, not `src/data/` (the blocker is sound; the citation was not), and B11 is **20 collisions, not 15**, including a `muniment` the docket missed and a `porch` it filed under the wrong vocabulary. And I found an error **neither** the panel nor I had caught: my ESTATE lit fence named a phantom file *and* omitted MP-1's test. A docket is evidence, not authority. |
| **J-DW0-11** | **EST-5 is unblocked on measurement and re-blocked on CH-4, rather than being pre-split.** | Keeping J-DW0-3's "hold the split". | J-DW0-3 was reasoning from a measurement I believed was pending. **§517 had already reported ~5 h before the first compile ran.** The hold was right for the wrong reason; the split stays unspent, but the blocker is now CH-4, a named car. |
| **J-DW0-12** | **The R1 anchor/relation split is RECOMMENDED but not ruled — it goes to the owner as O2.** | Ruling it myself, either way. | `ownerRef`'s type is persistence shape, which is owner-gated by the standing list. The first compile adopted the literal POWER reading silently and thereby made all three of the owner's own worked examples unbuildable. **Recording the cost of each branch is within my authority; choosing is not.** |
| **J-DW0-13** | **Inherited namespace collisions are recorded, not renamed** (C-23). | Renaming `C-5`, the three D-namespaces, and EST's `2a`/`2b`. | Renaming ids across three documents breaks more cross-references than it fixes, and two of the three namespaces are the draft's, not mine. Reverse if the chair wants a single renumbering pass across all three at once. |

---

## §K · WHAT THIS COMPILE DELIBERATELY DID NOT DO

**Deferred and documented — not bugs to re-find.**

1. **No engine code changed.** This is a compile lane. Every engine fact quoted was read, not edited.
2. **No packet minted.** The chair mints after the charter is ruled.
3. **No numbers hardened that CH-3 can move** (§B). The temptation was DW-R2's row count, and it is
   the one figure a build lane will most want; it is left provisional on purpose.
4. **B8's numbers are not specified**, by the owner's own hold (§C.2).
5. **The absolute-metre scale defect is not touched** — towns read ~244 m and metropolises ~646 m,
   two to three times small. Signed knowingly, deferred as **D-10** to the massing train, because
   correcting it moves every 3D scene.
6. ⛔ **STRUCK — the three viewing paywalls ARE resolved.** ODQ **§523.3** ruled all three at
   2026-08-23 22:42 CDT (`change-view` FREE, `map-chains` FREE, `fog-table` PAID), under the owner's
   §523.1 delegation, ~4 h before the first compile committed. Carrying them as open was a **partial
   read** of an ODQ this charter cites for something else. **Do not put them back on the owner.**
   DW's only duty is the no-growth arm.
7. ⛔ **CORRECTED: E7 is DISCHARGED, not parked.** UC-5 is landed (`f4df874ce`) and ships
   `ADJACENCY_BREACH` — the very edge E7 asked for. **E13 and E16** are still deferred as **D-6**,
   but D-6 now has **no owning train**, because UC-5 was the undercity train's last car. Re-homing
   D-6 is an open item for the chair (§I C-20).
8. ⛔ **D-EXPORT-1 lost one of its two carriers and it is restored here.** ODQ §524.5 assigned the
   pin to **both** WEB-8b's arm **and DW-6's acceptance**; `D-EXPORT`, `hasDrawableMap`,
   `townMapPlate` and `SettlementPDF` are **0 across all three documents**. No mapless-PDF failure
   follows today — no DW car modifies `src/pdf/**`, and CG-1b took the throw rate to 0 of 504 — **but
   if WEB-8b slips, the pin has no home.** DW-6's acceptance carries it.
9. **The dossiers' own internal errors are reported, not edited** — C-8's sixteen-versus-eleven and
   C-9's six-versus-eight are corrections the chair should push back into the frozen dossiers, and
   a compile lane editing a preserved research ref would destroy the thing that makes it citable.

---

## AMENDMENT RECORD

**Lane DW-0 (this compile), ODQ §482. Base `79b78881c`. Zero engine bytes written.**
Inputs read in the dispatched order: R-INST-6 §Σ.1–§Σ.5 · R-INST-5 §Σ.2 (the §488.2 defects), §1.4,
§15.2, §Σ.3 · the seven ledgers (R-INST-1 §Σ + 18 items · R-INST-2 §Σ + 106 · R-INST-3 §Σ.1–§Σ.6 +
27 · R-INST-4 §Σ.1–§Σ.3 + 46 · R-INST-5 §L 54 · R-INST-6 §L 45 · CIRC §4–§6, §Σ + 24) ·
`draft-DWELLINGS-CHARTER.md` · `draft-DWELLINGS-ARCHITECTURE.md` · the branch parent doc ·
`SIGNED-BANDS-2026-08-23`.

**⛔ SECOND PASS (skeptic panel §441 J7, docket of 14 blockers / 7 rulings / 6 owner-gated / 18
amendments).** The first pass reconciled against `029268fe5`, which `git merge-base` proves is **not
an ancestor** of the declared base (exit 1). Six cars landed in the gap. **All fourteen blockers were
independently re-measured by this lane before being applied** — two came back understated (B10's path,
B11's count) and one error was found that the panel had not caught (the ESTATE lit fence's phantom
`townCartographyDeterminism` and its missing `townCartographyProperty`). The worktree was rebuilt with
`npm ci`; the shared `node_modules` symlink is gone.

**Second-pass measurements, all executed at `79b78881c` by this lane:**
`git merge-base 029268fe5 79b78881c` → exit 1, no output (ORPHAN) ·
six cars ANCESTOR via `--is-ancestor`: `d78011665` `3e9d2d888` `b2852ccc3` `17fe89763` `f4df874ce`
`9e5059cec` · `connectivity.js` **28,261 B** with `CONNECTION_CLASSES` and the ONE-PRODUCER-PER-JOIN
law · `cartographyProperty.js` **9,141 B** with the DW contract in its header ·
`interiorEdits.js` **10,238 B**, three laws at `:11`/`:14`/`:18-20` ·
`compendiumData.generated.js:409` `roomKinds` = **28 members incl. `stall` AND `dais`**, byte-pinned at
`compendiumDataFreshness.test.js:33`, rendered at `CatalogHubs.jsx:66-67` ·
`prosperityScore` 3 regexes + fall-through vs 7 authored rungs ⇒ **`Subsistence` and `Moderate` both
fall through to 0.5** · `ownerRef` in **17 src / 11 test** files · `(high magic)` = **3** rows ·
`CLAIM_RE` at `enforcement-claims.test.js:`**`40`** · lit-flag grep = **11 paths / 9 test files** ·
cross-vocabulary collisions = **20** (15 cell×storage, 5 cell×circulation).

**Engine facts re-verified by direct read at the build slot this lane** (not inherited from the draft):
`PLAN_UNIT_CM_BY_TIER` at `compileTownSceneManifest.js:99-108`, read at `:286` ·
`powerStrata.js`'s POWERS definition, including that `coupContenders` excludes the governing seat
**and criminal factions** ·
`entitlementLadder.js`'s `axis` field and its `VIEWING_PAYWALLS_PENDING_514` ledger of three ·
the de-advertised `interiors` row's UNGATED-and-UNSHIPPED status ·
`tests/docs/enforcement-claims.test.js`'s `CLAIM_RE` and its corpus rule (every root and `docs/**`
`.md` is in-corpus by default) ·
`tests/docs/docCounts.test.js` pins no doc-file count, so a new `docs/*.md` adds no debt there ·
that no `docs/DESIGN_DWELLINGS_PROGRAM.md` and no dwellings architecture doc exist at
`79b78881c`, `claude/composite-r4` or `master`.

---

## ADDENDUM A2 · THE FABLE REVIEW SITTING (ODQ §567, 2026-08-24; slot `c3289244d`, 60 cars)

**Owner-ordered: a Fable review-and-refine pass over the DW architecture, much of whose evidence
body (the draft charter, the architecture doc, the six research tranches) was Opus-lane-built.
Verdict: the compiled charter is RATIFIED as the operative layer** — the layering law (J-DW0-1),
the three relations, derive-don't-store with dropped-anchor deltas, the single-flag rule, the
exit-criterion discipline, and the re-measure-at-the-slot standing law were each re-derived and
held. The rows below are the delta: what moved after this compile's base, and seven refinements.
Where this addendum and the body disagree, the addendum wins; the ledger outranks both.

### A2.1 · Figures that moved since the base (fold-in, not conflict)
- **41 cars → 42.** §560.6/§562.6 minted **DW-1g (ENVELOPE)** and amended J-DW0-2. Commit
  arithmetic: 45 → **46** DW commits; 46 → **47** dispatched. §F.1/§F.2/§F.4 read through this row.
- **The §I C-19 recount this charter ordered has RUN** (TE-C19-RECOUNT, ODQ §566.2):
  **CIRCULATION 61 (floor 59 / ceiling 62) · STORAGE 54 (floor 49 / ceiling 58)** — twice-derived
  by independent parsers, all three controls fired, the naive 86/69 reproduced and decomposed.
  **Every "~55"/"~35" in this document and the draft now reads 61/54; DW-1d/1e pin the INTEGERS
  with mutants.** The draft's five claim sites move by the preserved edit spec
  (`31585ce2` scratchpad, `c19/claim-site-edits.md`); the corrected re-preserve of the draft is a
  chair act OWED (§567.6) — until it lands, THIS addendum is the figure of record.
- **Catalog-train state at the slot:** CH-5 LANDED (Shape F, in the six-car stack) · CH-4 and CH-7
  are `wip-` cars under cure (§564) · CH-6 undispatched per §555.9. EST-5's blocker CH-4 is
  near-landing.

### A2.2 · RULED — the LADDER orphan (C-19 finding i): **a ladder is a FIXTURE; circulation stays 61.**
The vocabulary's own press/aumbry law decides it: a thing too small to be a cell is a FIXTURE of
its host cell. A ladder occupies no floor area; it is the attached artifact serving a `HATCH` or
trap — exactly the §453 shape. S6's stair grammar ("ladder → winder → spiral → grand") selects
stair TYPE and may lawfully reference a fixture at its poorest rung. ⛔ **But `ladder` is NOT added
as a lone member** — C-25 bars single-symptom adds. It joins the C-25 mechanical re-derivation's
expected findings (charter L822's own "(fixture)" annotation is its evidence), and the fixture
figure moves ONCE, after that gate runs.

### A2.3 · RULED — DW-1g's authoring debt (C-19 finding ii)
**ENVELOPE has ZERO token occurrences in the frozen charter** — the vocabulary is minted law
(§558.5) with no charter text behind it. Before DW-1g dispatches it owes: **(a)** the per-key
adjudication of the 73 BE tokens (the DW-PREP §6 count is sample-grade, flagged PARTIAL — never to
be quoted as measured); **(b)** a §D row and a §G exit criterion — integer pinned with mutants, the
C-19 pattern; **(c)** membership in the pre-DW-1 uniqueness/homing gate as the NINTH vocabulary;
**(d)** an architecture packet — **R4's owed-changeManifest count is 25 of 42, not 24 of 41.**
Ordering: DW-1g lands after DW-1b and **before DW-2b** (its `service{flue}` is the producer §560.5
found arm 4b needs); it serializes with 1a/1b only if it touches `interiorTemplates.js`.

### A2.4 · RULED — the pre-DW-1 gate consumes C-19's crosses
Beyond §D's 20 collisions, C-19 measured **28 sub-form × chartered CELL_KINDS · 8 × landed
ROOM_KINDS · 2 × PARTIS (`BARBICAN`, `LONGHOUSE`) · 2 × fixtures (`CHUTE`, `GATE`)**
(`c19/cross-collisions.txt`). The gate's owning-vocabulary table covers the DEDUPED union of both
sets; the HOMING arm's first specimen is `ladder` — a token in no vocabulary, exactly the defect
class that arm exists for. Whether the 28 CELL crosses are deliberate design (storage-as-cell
mirroring) is DW-1a/1e design authority: **the gate assigns owners; it does not delete members.**

### A2.5 · REFINEMENT — a named [PRE-DW-2b] gate: **the P1d benchmark registers BEFORE the weights**
§15's P1d row says pre-registration precedes any tuning of weights, but no §G row binds it.
New gate: the DW benchmark's refutation rules (room-size / adjacency / parti-frequency
distributions vs the corpus) are REGISTERED at a preserve ref, dated before DW-2b's dispatch.
The G-39/G-43 lesson is the reason: a benchmark authored after the weights is a rationalization,
not a test.

### A2.6 · REFINEMENT — DW-S owes a PRICED compute budget and a pre-registered sampling law
"Every building's plan is re-derived at every soak epoch" is unpriced: soak cells × epochs ×
buildings × a full derivation each. DW-S1's changeManifest must state the budget and the sampling
law explicitly — full-per-epoch, or a pre-registered deterministic sample, with the constitutional
arms (A4/A8/A9) still specified over a stated set. A soak leg that quietly samples is the vacuity
class; a soak leg that cannot finish is not a leg. **If full re-derivation is intractable at
measured cost, that is a FINDING for the chair, never a silent cut.**

### A2.7 · OPEN QUESTION added to §14 — **Q6: plan stability across ENGINE VERSIONS**
§6's re-derivation triggers are all world-state triggers. An engine update that changes S1's
snapshot shape or S2's draw re-derives every plan; anchors drop lawfully (E.1b) — but a paying
DM's annotated tavern re-deriving into a different parti after a product update is a
product-promise question, not a code question. The fork for the owner sitting: **accept**
(projections may evolve; deltas drop lawfully and visibly) or **grandfather** (the parti draw's
seed-path is version-pinned per building). Owner taste; neither is the chair's to pick silently.

### A2.8 · Checked and NOT changed
The nine founding laws · the three relations · S1–S9 · the single flag and its six-surface bill ·
C-19's zero-tolerance lattice ruling (re-derived: integer shoelace exactness holds; one watch-item
for DW-2b's dispatch — wall polygons must land on the same lattice or the accounting identity
needs a third term stated) · C-20's `SURFACE_JOINT_KINDS` disjointness · C-22's split · C-25's
gate. **All RATIFIED as compiled.**
