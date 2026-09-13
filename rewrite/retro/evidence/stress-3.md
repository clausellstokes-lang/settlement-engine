# STRESS-3 — THE FLOOR-1 HUNT

**The question.** ADDENDUM 14 floor 1: *"NO SELF-CONTRADICTION ON THE PAGE. The record that binds is the WHOLE town's record and the engine's own model, never the pool's own read alone… it may not say what another surface on the same screen denies."* Is that checkable by a refuter who reads one pool?

**THE ANSWER: NO — and not by a margin.** Not one of the fourteen collisions below is reachable from what a refuter is handed today. The instrument is pool-local by construction: `kept.md`, `draft-round-N.md`, `skeleton.md`, the shipped rows, and the licence card. Every one of those describes the pool's own read. The licence card's only gesture at the page is one line — `echo: spine mounts 2 (tabs: defense) · modifier mounts 0` — and it is a **count**, not a roster, and the file's own text admits the count is keyed on a coarser token root than the pool's read (measured: `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-STRAINED'`, run read-only in the dock). The GROUNDS string already carries the right ground — *"a same-page contradiction with a sibling pool (C7)"* — and hands the refuter nothing with which to evaluate it. C7 has been a dead ground since it was written.

Worse: floor 1 is the one floor whose evidence is **not in the corpus at all**. Floors 2, 3 and 4 are judgeable from the face plus a law. Floor 1 requires the *product*.

---

## 1. WHAT "THE SAME SCREEN" ACTUALLY IS FOR A DEFENSE-DESK FACE

Two rosters, and only the first exists as data.

### 1a. The corpus siblings — `src/domain/display/stateProse/dossierMounts.js`

Eight defense-desk mounts share `tab: 'defense'` (lines 313–425):

| mount | block | render site in `DefenseTab.jsx` |
|---|---|---|
| `defense.postureHeader` | DS-DEF-1 | 288 |
| `defense.militaryStatus` | DS-DEF-8 | 304 |
| `defense.threatAssessment` | DS-DEF-2 | 317 |
| `defense.publicOrder` | DS-DEF-3 | 379 |
| `defense.criminalStructure` | DS-DEF-4 | 400 |
| `defense.armedForces` | DS-DEF-5 | 482 |
| `defense.wallRationale` | DS-DEF-11 | 494 |
| `defense.supportingCapabilities` | DS-DEF-6 | 533 |

DS-DEF-9 sits at `viability.magicDependency` (another tab). DS-DEF-7 and DS-DEF-10 are declared dark.

This roster is machine-readable **today** and is never handed to a refuter. The census (`docs/content/wiring-census.json`) carries the same fact per row in its `sites` column.

### 1b. The non-corpus siblings — no register anywhere

Every one of these renders on the defense tab beside a corpus face, and nothing in the programme enumerates them:

- **`readiness.label`** badge (`Fortress · Well-Defended · Defensible · Lightly Defended · Vulnerable · Undefended`) — `defenseGenerator.js:517-522`, rendered at `DefenseTab.jsx:275`.
- **`ra.terrain`** and **`ra.strategicValue`** chips — `DefenseTab.jsx:277-278`.
- **`guardEffectivenessDesc`** — the "Guard Assessment" paragraph, twelve authored branches, `safetyProfile.js:317-384`, rendered at `DefenseTab.jsx:283`, with the DS-DEF-1 face **directly beneath it** at 288.
- **`stressStatus.posture`**, **`stressObj.summary`**, **`stressObj.viabilityNote`** — `DefenseTab.jsx:297-302`, with the DS-DEF-8 face in the same `<div>` at 304.
- **Five bars + five `scoreBand` badges + five `assess` paragraphs + five `fundingNote` lines** — `buildThreatAssessment()` (`threatAssessment.js`), `deriveDefenseReadiness()` (`defenseDisplay.js:299-331`), rendered at `DefenseTab.jsx:323-352`, immediately below the DS-DEF-2 box.
- **`orderStatus` headline + `orderBadge`** — computed inline at `DefenseTab.jsx:359-363` from `scores.internal`.
- **`safetyLabel`** italic line — `DefenseTab.jsx:373`.
- **`sp.safetyDesc`** — the DM's pen field, eleven authored branches (`safetyProfile.js:96-315`), rendered at `DefenseTab.jsx:378` with the DS-DEF-3 face projected *beside* it at 379.
- **`csd.label` + `csd.note`** — `CRIM_STRUCTURE_DATA` (`defenseDisplay.js:158-175`), `DefenseTab.jsx:387-390`.
- **"No organized criminal infrastructure detected."** hardcoded — `DefenseTab.jsx:394`.
- **The capture notes**, hardcoded, two branches on `criminalCaptureState` — `DefenseTab.jsx:427-431`.
- **`crimInsts` + `criminalOpNote()`**, **`crimeTypes`**, **`sp.plotHooks`** — 435-458.
- **The force-count header** (`"2 walls  3 forces  1 mercenary"`) — `DefenseTab.jsx:466-471`.
- **`ForceCard` rows** — name + `desc` + `REQ`/`FORCED` badge, 488, 496, 501, 506, 511.
- **"Unfortified. No perimeter walls…"** hardcoded — `DefenseTab.jsx:491`.
- **"No organized force. Defense relies on individual armed citizens…"** hardcoded — `DefenseTab.jsx:512`.
- **`caps` rows** — six capability cards with `status`, `scoreBand`, `note` (`defenseDisplay.js:206-286`), 538-553.
- **`defViolations`** — the structural-validator receipts, 560-570.

**Roughly twenty non-corpus text producers on one tab.** A refuter judging floor 1 is being asked to hold all of them and is given none.

---

## 2. THE COLLISION ENGINE: **THE DEFENSE TAB IS TWO CLOCKS**

This is the single structural fact behind more than half the findings, and it is engine-specific.

`generateDefenseProfile` has **exactly one caller** — `src/generators/steps/assembleSettlement.js` — so `defenseProfile.{scores, readiness, institutions, economicGates, chainModifiers}` is a **generation-time snapshot that is never rebuilt**. `economicState.safetyProfile.*` is the same (the desk measured it: `safetyLabel` has *zero* writers under `src/domain/worldPulse/`). So is `economicState.compound.inst`.

Meanwhile every ruin path — `calamityKernel.js:251`, `settlementLifecycleFirstClass.js:601`, `magicRegimeLifecycle.js:355`, institutionLifecycle, tierOutcomeApply — stamps a roster row **immutably**: `{...inst, status:'ruined', _worldPulseInactive:true}`, replacing the object in `settlement.institutions`. The snapshot buckets hold the *pre-ruin objects by reference*, so the stamp can never reach them (`defenseInstitutionBuckets.js:35-50`).

The cure the estate chose was to make the **prose** truthful: `standingDefenseForces()` re-derives from `liveInstitutions(settlement)` (`institutionRoster.js:53`). It was applied to the desks and **not** to the surfaces beside them. The result:

| surface | clock | source |
|---|---|---|
| DS-DEF-5 five force lenses | **LIVE** | `standingDefenseForces` |
| DS-DEF-11 perimeter read | **LIVE** | `standingDefenseForces` |
| DS-DEF-2 beasts + invasion rows | **LIVE** | `standingDefenseForces` |
| DS-DEF-2 internal + disaster rows | SNAPSHOT | `economicState.compound.inst` |
| DS-DEF-2 economic row | SNAPSHOT | `defenseProfile.scores.economic` |
| DS-DEF-1 readiness lens | SNAPSHOT | `defenseProfile.readiness.score` |
| DS-DEF-3 | SNAPSHOT | `safetyProfile.safetyLabel` |
| DS-DEF-6 | SNAPSHOT (+ live `stockpile.blockaded`) | `compound.inst` |
| DS-DEF-11 upkeep gate | SNAPSHOT | `defenseProfile.economicGates.military` |
| **every ForceCard, every callout, every bar, every badge, `guardEffectivenessDesc`, `safetyDesc`, `buildThreatAssessment`, the town map's wall ring** | **SNAPSHOT** | `defenseProfile.institutions` / `getInstFlags` |

**DS-DEF-2 is two clocks inside one rendered `<div>`** (`DefenseTab.jsx:317-321`): rows 1–2 live, rows 3–5 frozen.
**DS-DEF-11's own pool key is two clocks inside one function** (`wallRationalePoolKey(walls=LIVE, monsterThreat=config, militaryGate=SNAPSHOT, tier)`).

And the ruin is **invisible to the reader**: no component in `src/components/**` renders a `ruined` / `inactive` status. So when the face (live) and the card (snapshot) disagree, the page offers the reader no way to reconcile them.

---

## 3. THE COLLISIONS — named, with the field, the file and the sibling

### CONFIRMED (mechanism read in code)

**C1 · DS-DEF-5 vs the force cards and the two hardcoded callouts.**
A ruined garrison leaves `standingDefenseForces(s).garrison.present === false`, so the desk draws `NO organized force at all`, whose vid-1 reads *"{settlement} has no organized force. Defense here is individual armed citizens, with no command, no training and no way to coordinate a response."* (`defense.generated.js:2733`). Twenty-six lines below, `DefenseTab.jsx:500-503` renders a **"Standing Forces"** heading and a `ForceCard` titled `Garrison Barracks`, because `mainForces` comes from `inst = d.institutions` (`DefenseTab.jsx:195`). And because `hasAnyForce` is computed from the same snapshot (`:199`), the "No organized force." callout at `:512` **does not print** — the page asserts a force by card and denies it by sentence, with nothing between them.
*The corpus face is the correct one. It is still a same-page contradiction, and a refuter reading DS-DEF-5 alone cannot see it.*

**C2 · DS-DEF-11 vs the Fortifications cards.**
`wallRationalePoolKey` reads `forces.walls.present` (live), so a town whose circuit has been thrown down draws `UNWALLED-SMALL` — *"{settlement} is too small to wall and knows it"* — or `UNWALLED-LARGE` — *"{settlement} has reached a size that usually buys stone, and has not bought it"*. The render order is exact and adjacent: **Fortifications header `:487` → `ForceCard` "Massive Walls" `:488` → `{!hasAnyFort && "Unfortified."}` `:491` (suppressed) → `{wallLine}` `:494`.** The face says the town never built a wall; the card one line above names the wall.
The same snapshot drives the **town map**: `townMapModel.js:372` and `townLayoutV2.js:263` call `defenseProfileHasWalls(s.defenseProfile)`, which reads `def.institutions.walls` (`causalState.js:380-389`) and draws a wall ring with gates. The dossier draws the wall and the dossier's prose says there is none.

**C3 · DS-DEF-2 vs `buildThreatAssessment`'s `assess` prose — the same facts, in words, from the other clock.**
The DS-DEF-2 box (`:317`) sits directly above five expandable rows whose `assess` paragraph is authored off `inst.walls / inst.garrison / inst.militia / inst.charter` — the **snapshot** (`threatAssessment.js:37-41`). On a ruined-walls town the corpus face fires `beastsRowPoolKey(family, perimeter=false, force=false)` → `plagued country, neither`, while `assess` renders *"Walls exist but no organized force to sustain a watch rotation. The palisade creates a chokepoint…"*. Two sentences about the same wall, ten pixels apart, from two clocks.
`assess` also names the wall's **material** ("Palisade and citizen militia…", `threatAssessment.js:59`, `:78`) off a boolean — the exact breach W11 bars the corpus from. A face written lawfully under W11 now reads as *denying* the sibling.

**C4 · DS-DEF-2 against itself, inside one box.**
The five lines render as one paragraph block (`:317-320`). Rows 1–2 are live-roster; rows 3–5 are the birth snapshot. A town whose prison was ruined prints `Internal Security: full legal chain (court AND prison)` beside an invasion row that already knows the roster has moved. No refuter of the internal row is told the beasts row reads a different roster — they are not even told the beasts row exists.

**C5 · DS-DEF-1 vs the Guard Assessment paragraph directly above it.**
`guardEffectivenessDesc` builds `lawRef` from `inst.hasGarrison / hasWatch / hasMilitia / hasMercenary / hasCharterHall` — `getInstFlags` over the **raw** institution list at birth (`safetyProfile.js:320-325`) — and can say *"The garrison and town watch is well-funded, properly equipped, and maintains meaningful patrol coverage"* (`:366`) or *"The garrison exists on paper. Chronically underpaid and poorly equipped"* (`:344`). It is rendered at `DefenseTab.jsx:283`; the DS-DEF-1 face is rendered at `:288`, five lines down, under a `borderTop`. The two are keyed on **different numbers** — the paragraph on `flags.militaryEffective` and `pri.economy`, the face on `defenseProfile.readiness.score` — and the desk's own docblock is explicit that the *badge* was made coherent with the face and says nothing about the paragraph.

**C6 · DS-DEF-3 vs the Internal-Security headline in its own banner.**
`orderStatus` / `orderBadge` are computed inline from `scores.internal` (`DefenseTab.jsx:359-363`: `>=65 STRONG`, `>=40 ADEQUATE`, `>=20 WEAK`, else `CRITICAL`). `safetyLabel`, which keys the DS-DEF-3 pool, is computed from `effectiveSafety = max(safetyRatio, communityOrderBonus, courtOrderFloor)` (`safetyProfile.js:44-74`) — a **wholly different formula over different inputs** (`militaryEffective / max(8, criminalEffective)` vs an institution-additive score minus `crimEffective*0.4`).
The overlap is not hypothetical, it is **designed**: the stress branches rewrite `safetyLabel` into a compound (`'Desperate — Famine Conditions'`, `'Controlled — Occupation Curfew'`, `safetyProfile.js:96-225`) and the DS-DEF-3 corpus carries a pool named *"COMPOUND override (a crisis stress has rewritten the label)"* for exactly that. Famine costs `internal` only −20 (`defenseGenerator.js:384`), so a town at internal 85 prints **"Strong Public Order" / STRONG** in the same banner as a COMPOUND face about order having broken down.

**C7 · DS-DEF-3 vs `safetyDesc` — the paragraph it is literally projected beside.**
`projectBesideDmField` puts the corpus line at `DefenseTab.jsx:379`, immediately after `sp.safetyDesc` at `:378`. `safetyDesc` names bodies off birth flags: *"Walls limit access and give the guard leverage over smuggling and movement"* (`:281`), *"There is no meaningful guard presence"* (`:299`), *"The thieves' guild provides order of a sort: its own"* (`:250`). A DS-DEF-3 face written under W13 (no watch unless a watch row resolves) and W15 sits one line under a paragraph that asserts the guard by name from a different roster. This is also the sharpest **CRAFT/dullness** surface: a face restating `safetyDesc`'s fact is a same-page repetition the new DULL verdict should catch, and cannot.

**C8 · DS-DEF-8 vs `stressObj.summary` — six pixels, and a coin flip.**
`DefenseTab.jsx:301` renders `stressObj.summary`; `:304` renders the DS-DEF-8 faces in the **same `<div>`**. For `wartime`, that summary is chosen by `rollStressSummary` = `{ profit: rng() < 0.45 }` (`stressNarrative.js:42`) — a seeded coin with **no field behind it** — and the heads branch reads *"Military contracts are flowing. The garrison is reinforced and well-supplied."* (`:145`). Forty-five per cent of wartime towns therefore assert a reinforced, well-supplied garrison directly above whatever DS-DEF-8 says, and further down the page beside a DS-DEF-11 `WALLED-STRAINED` face that must state a shortfall on the wall's keeping and the muster's wages alike (R-viii′).
`monster_pressure`'s summary (`:103`) asserts *"A farmstead burned last week"* — a dated event. The corpus is barred from that by floor 2; the sibling prints it.
**No card, no table and no census row can predict a coin.** This collision is uncheckable by any list-shaped instrument; it needs the render.

**C9 · DS-DEF-4 vs the hardcoded capture notes in its own section.**
`DefenseTab.jsx:427-431` prints, for `crimCapture === 'corrupted'`, *"Key enforcement officials have arrangements with criminal networks. Selective enforcement."* — the **same field** `powerStructure.criminalCaptureState` the DS-DEF-4 `capture corrupted` pool is keyed on, rendered 27 lines below the corpus face at `:400`. The engine's version makes a ROLE/person claim (W22) the corpus face may not make, so the lawful face reads as the weaker, and possibly contradicting, of the pair. It is also a straight duplication.

**C10 · DS-DEF-4 vs DS-POW-6, across tabs, on one field.**
`capturePoolKey(captureState, breakdown)` in `powerStateProse.js:436-447` reads `powerStructure.criminalCaptureState` and returns `capture reached a LEADER` / `capture reached an AGENT of a faction`, mounted at `power.criminalUnderside`. DS-DEF-4's `capture capture` / `capture corrupted` pools read the same token. Two desks, two lanes, one fact, one dossier.
The exact contradiction: when `captureState === 'none'`, DS-DEF-4 draws its `capture none` pool while DS-POW-6 falls through to the legitimacy breakdown and can draw **`capture pressure ADVANCING (weak security, poor prosperity)`** (`safety < 0 && prosperity < 0`). A DS-DEF-4 `none` face that says nothing has reached the seat and nothing is near it directly denies the power tab's face. **The co-fire is computable and nobody computes it.**

**C11 · The frozen band vs the live band — DS-DEF-1 vs SubstrateTab.**
DS-DEF-1 keys `scoreBand(defenseProfile.readiness.score)` — frozen at birth. `SubstrateTab.jsx:33` renders the live `defense_readiness` variable with the band vocabulary `surplus · adequate · strained · critical · collapsed` (`:46-52`). `defenseStateProse.js`'s own DS-DEF-7 docblock **measures the divergence**: *"a village read frozen 21 (`scoreBand` CRITICAL) and live `strained`; a metropolis read frozen 76 (STRONG) and live `adequate`."* Two tabs of one dossier, two bands, one subject.
This one needs a **ruling**, not a cure: if "frozen ≠ live" is a contradiction, every DS-DEF-1 face is refutable on every town. See §5.

**C12 · DS-DEF-11 `WALLED-STRAINED` vs every live economic surface.**
The pool fires on `defenseProfile.economicGates.military < 1`, i.e. `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4) < 1` ⟺ **`econOutput < 50` at birth** (`defenseGenerator.js:189`). `economicGates` is never recomputed. A town that recovered in the world-run still draws STRAINED and still says the purse falls short, while the substrate tab's live `economic_capacity` band and the economy desk's faces may read otherwise.
The same threshold produces a **cross-tab collision at birth**: `narrativeText.js:168` renders the wartime pressure sentence's profit branch at `militaryEffective >= 55 && economyOutput >= 45` — *"the garrison is reinforced, and the crown is paying"* — and `pressureSentence` is rendered on `OverviewTab.jsx:450`, `SummaryTab.jsx:206/350` and `pdf/sections/Overview.jsx:68`. **`econOutput ∈ [45, 50)` with `militaryEffective ≥ 55` puts "the crown is paying" on the overview and an upkeep shortfall on the defense tab of the same dossier.** In the PDF they are the same document.

**C13 · DS-DEF-5 / DS-DEF-11 vs DS-GEN-17, cross-desk.**
`generalStateProse.js` is the only other consumer of `liveInstitutions` in the display layer, and DS-GEN-17 mounts at `overview.institutions`. So the general desk speaks the **live** roster on the overview tab while the defense tab's force cards speak the **snapshot**. Two corpus desks and one product surface, three-way.

**C14 · The corpus block titles name the wrong producer for the two blocks whose read moved.**
`DS-DEF-5`'s title (`defense.generated.js:2593`) says it reads `defenseProfile.institutions{walls,garrison,militia,watch,mercenary,charter,magicDef}`. `DS-DEF-11`'s title (`:5633`) says `defenseProfileHasWalls`. **Both are false** — the desk reads `standingDefenseForces` for both. The census is correct (`reads: ['forces.walls.present']`); the **title is not**, and the title is the first line of the block a marker and a writer read. An instrument defect, not a face fault, and it poisons every skeleton written for those two blocks.

### FORWARD (not live today — flagged so it is not re-found)

**F1 · `DefenseWarFrontSection` will land C1 and C2 as a hardcoded string.**
`EngineSections.jsx:185` prints *"Besieged by {X}. **The garrison holds the walls.**"* off `warStatus.besiegedBy` alone — no roster read, asserting both a garrison and walls, which is exactly what W17 bars the corpus from. `:1051` of `causalState.js` adds the contributor *"Defensive walls in place."* from the **snapshot** `defenseProfileHasWalls`. The component currently has **no production call site** (measured and stated at `defenseStateProse.js:1826-1831`), so nothing collides today — but `defenseStateProse.js:1859` charters *"the one act that lights seven of the eleven pools: wire `DefenseWarFrontSection` into the defense tab."* The moment DS-DEF-7 is lit, C1/C2 land as product prose.

### Where the page is coherent BY CONSTRUCTION (so the findings above are not a blanket smear)

Three of the eight mounts cannot collide with their nearest sibling, and each was made so deliberately:
- **DS-DEF-1 vs the `readiness.label` badge** — both band the same `readiness.score`; the desk's docblock states this was the reason the lens does not key `avgScore`.
- **DS-DEF-4 vs the `csd` card** — `DefenseTab.jsx:222` hands `defenseCriminalProse` the *same* `crimStructure` key the card renders from.
- **DS-DEF-6 vs the `caps` rows** — both read `economicState.compound.inst` and the same live `stockpile.blockaded`.

That is the shape of a working floor-1 guarantee, and it is achieved at the **call site**, never by a refuter.

---

## 4. WHAT A REFUTER MUST BE GIVEN

Seven artifacts. Three already exist as data; four must be built. Nothing here needs a new engine capability.

**I1 · THE CO-RESIDENCY SHEET (exists — just hand it over).**
Per pool: every other mount on the same `tab`, from `dossierMounts.js` / the census `sites` column, with each sibling block's *pool list and key function*. For a DS-DEF-2 refuter that is seven sibling blocks and the four other rows of its own box.

**I2 · THE SIBLING STRING PACK (does not exist; must be built — this is the big one).**
The verbatim branch texts of every non-corpus producer that renders on the tab, each with its predicate. For defense that is a finite, enumerable set:
- `safetyProfile.js:96-315` (`safetyDesc`, 11 branches + the stress composites) and `:317-384` (`guardEffectivenessDesc`, 12 branches);
- `threatAssessment.js` (`assess`, five rows × their branch trees);
- `defenseDisplay.js:158-175` (`CRIM_STRUCTURE_DATA.note`), `:124-152` (`criminalOpNote`), `:206-286` (`caps[].note` + `status`), `:317-321` (`fundingNote`);
- `stressNarrative.js:78-168` (every `summary`) and `stressTypes` `viabilityNote`;
- the hardcoded strings in `DefenseTab.jsx` at `:394`, `:427-431`, `:491`, `:512`, `:571`;
- `narrativeText.js` `pressureSentence` branches (cross-tab, and same-document in the PDF).
Without this pack a refuter cannot evaluate floor 1 **at all**, because more than half of what the page says is not in the corpus.

**I3 · THE PROVENANCE COLUMN ON THE LICENCE CARD (must be added; one line per read).**
Tag every read `SNAPSHOT` / `LIVE-ROSTER` / `PULSE` / `CONFIG`, from a fixed table of roots:
`defenseProfile.*`, `economicState.safetyProfile.*`, `economicState.compound.inst.*`, `resourceAnalysis.*` → **SNAPSHOT** (single writer, `steps/assembleSettlement.js`, never rebuilt);
`standingDefenseForces` / `liveInstitutions` → **LIVE-ROSTER**;
`foodSecurity.stockpile.*`, `causalState.variables.*` → **PULSE**;
`config.*` → **CONFIG**.
Then print, per pool, **which of its siblings sit on the other clock**. That single column predicts C1, C2, C3, C4, C5, C11, C12 and C13 mechanically.

**I4 · THE CO-FIRE MATRIX (computable today).**
Every desk key function is pure and total (`beastsRowSituation`, `invasionRowSituation`, `internalRowPoolKey`, `disasterRowSituation`, `publicOrderSituation`, `wallRationalePoolKey`, `capturePoolKey`, `READINESS_ROW_POOL`, `supplyLogisticsSituation`). Cross-product them over the field domains and print, per pool, the set of sibling pools it **can** appear with. This is what lets a refuter *clear* a face as well as fail one: DS-DEF-11's `WALLED-*` pools share `forces.walls.present` with DS-DEF-5's `walls ABSENT`, so those can be **proved** never to co-fire — the only kind of floor-1 verdict available from a list. It also surfaces C10 (`captureState === 'none'` × `capture pressure ADVANCING`) as an arithmetic fact rather than a hunch.

**I5 · A RENDERED PAGE PER POOL (2–3 towns, the face substituted in).**
The only instrument that catches C8, because `rollStressSummary`'s coin is not a field and no list will ever hold it. Two or three towns per pool, with every corpus and non-corpus line rendered in render order. The estate already generates the 768-town RATE corpus and the 525-town manifest; this is a render of them, not a new measurement.

**I6 · THE RUIN CASE, EXPLICITLY.**
At least one world-run town per live-roster pool, because the entire snapshot/live seam is invisible on a birth town and every collision C1–C5 fires only after a ruin stamp. A birth-only sample will report floor 1 clean and be wrong.

**I7 · THE TIE-BREAK RULING (the chair's, before any of this can be enforced) — see §5.**

---

## 5. THREE RULINGS THE CHAIR OWES, OR FLOOR 1 EATS THE PROGRAMME

**R1 · WHEN THE FACE AND THE SIBLING DISAGREE, WHICH IS WRONG?**
In C1, C2, C3 and C5 the **corpus face is the truthful one** and the sibling is reading a stale snapshot. Floor 1 as drafted ("it may not say what another surface on the same screen denies") makes the lawful face the defendant and the stale card the record. That inverts the programme: it would force the rewrite to re-introduce ruin-blindness in order to agree with a defect.
Proposed cut: **a contradiction is a FACE fault only where the sibling is the RECORD** (a field, a label, a band, a roster row). Where the sibling is engine **prose** or a stale projection, it is a **WIRING ROW** — recorded, named, routed to the desk's wiring car — and the face stands. A refuter's floor-1 finding must therefore carry a third field beyond the face and the sibling: **which side is the record.**

**R2 · IS "FROZEN vs LIVE" A CONTRADICTION?**
C11 is not a defect; it is two different measurements with two different vocabularies. The product already carries the tie-break language — the threat-assessment caption says *"as judged at the first survey"*, the public-order banner's own eyebrow reads **"Internal Security · First Survey"**, and DS-DEF-3 has a `First-Survey qualification` pool for precisely this. **Ruling wanted:** a first-survey band and a live band are not contradictory, and a refuter may not fail a face for disagreeing with a band on the other clock. Without this ruling C11 makes every DS-DEF-1, DS-DEF-2-economic and DS-DEF-3 face refutable on every town, and the re-cut's whole gain is spent on false FAILs.

**R3 · DOES FLOOR 1 REACH ACROSS TABS?**
C10 (defense ↔ power) and C12 (defense ↔ overview) are not on one screen in the app and **are** on one page in the PDF (`src/pdf/`). Floor 1 says "the same screen" in one sentence and "the WHOLE town's record" in the one before it. **Ruling wanted:** the unit is the **DOSSIER**, not the tab — which is the honest reading of "the whole town's record" and the only one the PDF supports — with the consequence that the co-residency sheet (I1) must be built per-dossier and the two cross-desk twins (DS-DEF-4 / DS-POW-6; the pay-gate reads) get an explicit shared ruling before either desk is written.

---

## 6. WHAT THE CURRENT INSTRUMENT WOULD MISS — the explicit list

Given today's refuter packet (`kept.md` + `draft-round-N.md` + `skeleton.md` + the shipped rows + the licence card + tables 13A/13B + RULINGS), a refuter would miss:

| # | missed because |
|---|---|
| C1 | the force cards are not in the corpus; nothing tells the refuter `defenseProfile.institutions` exists, let alone that it disagrees with its own read |
| C2 | same, plus the render *order* (`:487→:494`) is nowhere in any artifact |
| C3 | `threatAssessment.js` is not in the corpus and is never named to any seat |
| C4 | the refuter is given one pool; it is not told its four box-mates exist or that two of them read a different roster |
| C5 | `guardEffectivenessDesc` is named in the desk's title string as a *read* of DS-DEF-1 and is never shown; its twelve branches are unread |
| C6 | `orderStatus` is computed **inline in the JSX** (`DefenseTab.jsx:359`) — it is not a producer, not a census field, not a holder, and appears in no register the programme owns |
| C7 | the card says `audience: player (no mark)` and nothing about the DM field the line is projected beside |
| C8 | uncheckable in principle from any list — the branch is `rng() < 0.45` |
| C9 | hardcoded JSX strings appear in no register |
| C10 | the card's `echo:` line counts mounts and does not name the other desk's block, and there is no co-fire matrix |
| C11 | SubstrateTab is a different tab and the live band is not in the census |
| C12 | the threshold identity (`gate < 1 ⟺ econOutput < 50`) is derivable only from `defenseGenerator.js:189`, which the card does not cite |
| C13 | cross-desk; the general desk's roster read is invisible from the defense card |
| C14 | the refuter reads the census row (correct) and the block title (wrong) and is given no reason to prefer either |

**Thirteen of fourteen are invisible. The fourteenth (C14) is visible only as an unexplained disagreement between two artifacts the refuter is handed.**

---

## 7. INSTRUMENT ROWS FOUND IN PASSING (not floor-1, but they bite the re-cut)

1. **The licence card still prints the struck licence test.** `may NOT: a count, a cause, a season, a future, a standpoint, **a second fact**, another civic object of the class 'wall'` — "a second fact" and "a standpoint" are precisely what ADDENDUM 14 struck. The card is the drafters' and refuters' most-read instrument and it currently teaches the old law. It needs a re-cut header before DEF-2 restarts, or every seat will re-derive the receipt test from it.
2. **`{defwork} NAMED BUT NEVER FILLED`** is still printed on the DS-DEF-11 card ("FILLED at this block's call sites: {settlement} · NAMED BUT NEVER FILLED: {defwork}"), while `defworkFill()` (`defenseStateProse.js:1027`) plainly computes it from `forces.walls.names`. Worth one grep before the block is re-drafted — a writer told the slot never fills will write around it.
3. **C14's stale titles** are a one-line fix in the projector's source doc and should land before the marker re-runs.
4. **`deriveCriminalStructure` (`defenseDisplay.js:183`) reads `r.institutions` raw**, not `liveInstitutions` — so DS-DEF-4 and its card are *jointly* ruin-blind. They agree with each other and with nothing else. That is a wiring row for the defense desk's car, and it is the reason C9's duplication is stable rather than intermittent.

---

## 8. THE ONE-PARAGRAPH VERDICT

Floor 1 is the only one of the four floors that is not a property of the face. It is a property of the **page**, and the page is assembled from twenty-odd producers on two different clocks, half of them hardcoded in JSX, one of them a coin flip. A refuter reading one pool cannot evaluate it; a refuter reading the whole corpus still cannot, because more than half the contradicting text is not corpus. Floor 1 is enforceable only with **I2 (the sibling string pack)** and **I5 (a rendered page)** in the refuter's hands, and it is *safe* only after **R1** — because on the evidence here the corpus face is the truthful party in four of the five sharpest collisions, and a floor that charges the truthful party will spend the re-cut's new freedom paying for the engine's stale snapshots.
