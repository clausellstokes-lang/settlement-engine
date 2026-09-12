# MARKER PACKET — DS-DEF-2 · pool `Disasters & Famine: NO reserves, NO medical provision`

Seat: opus (marker), for the Fable chair. Block `DS-DEF-2` (`Defense › Threat assessment`), **row 5 of five**. **Three shipped variants; three to rewrite, four faces each.**

Written under **ADDENDUM 14** (the owner, 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record; **silence in the record is permission**; "the card does not license it" is not a finding and never will be again.

---

## 0.1 THE LICENCE CARD, verbatim

Printed from `node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: NO reserves, NO medical provision'` in the DEF2 dock.

```
LICENCE (block DS-DEF-2 · role spine · key `Disasters & Famine: NO reserves, NO medical provision`)
  reads:      disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)
              (absent => no candidate; a modifier is silent, never "false")
  predicate:  disasterRowSituation(granary, hospital, church) === no reserves, no medical provision
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) - modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the
              file's first dot) and NOT on a producer-token root, so every pool that selects a row
              of `DISASTER_ROW_POOL` shares ONE echo key: a mount counted there may be a sibling ROW
              of the same table
  covert:     no
  source:     (none) - standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. This card says what the read REACHES, never the
              bounds of what may be written.
  may claim:  that the reader selects the row `no reserves, no medical provision` of
              `DISASTER_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b), another
              civic object of the class `store`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and
              that character's fate (product scope); a theological claim about a deity
```

### ⚠ SIX CARD LINES ARE NARROWER OR LOOSER THAN THE CODE, AND THE WRITER MUST KNOW ALL SIX

1. ⭐⭐ **THE THIRD PARAMETER IS PASSED AND NOT READ, AND THAT IS THE GOVERNING FACT OF THE PACKET.** The key function takes `(granary, hospital, church)` but on this branch the church is never consulted (`defenseStateProse.js:580-591`), and the composer's own docblock says why in its own words: the corpus wrote `granary AND parish care only` but no matching "no reserves, parish care" pool, *"so for a town with no reserves the split is hospital-or-nothing, and the church is not consulted there — which is why the situation set is five and not six."* **Consequence: `hasChurch` is TRUE on a large part of this pool's range, and on that slice the same Defense tab prints `Medical Readiness: Clergy care` with the note *Parish care. Basic wound and disease management.* (`defenseDisplay.js:237-239`), and the expandable row under this very label prints *Parish clergy provide basic wound care: better than nothing, worse than a hospital.* (`threatAssessment.js:180-184`).** Two of the three shipped rows deny exactly that. See §0.6 and §1.2.
2. ⭐⭐ **`reads: granary, hospital` IS TWO SUBSTRING GREPS OVER FIVE KEYWORDS, AND THE CATALOGUE MAKES THEM A TIER GATE.** `hasGranary` greps the single stem **`granar`**; `hasHospital` greps **`hospital` · `monastery` · `healer` · `friary`** (`priorityHelpers.js:63-64`). The default catalogue seats **no granary row at all below town** and makes the granary **`required: true`** at town (`institutionalCatalog.js:925-930`) and at city (`:1590-1596`), and metropolis merges the city catalogue (`assembleInstitutions.js:244`). So in default content **this pool is a thorp / hamlet / village pool**. See §0.8, the preimage — it is the most consequential line in this packet after the church.
3. **`source: (none) · SOURCE-UNRESOLVED` — but the citation ban it cites is STRUCK.** The recut strikes **A13's citation ban entire** and **W24 the record-word bar entire**. What survives is **F1-24** only: a record CITED to a keeper the card cannot resolve. For this pool: **the record WORDS are free everywhere; a named keeper is not.** ⚠ and this pool is poorer in record words than its siblings, because the thing that is missing is precisely the thing that would have kept a record.
4. ⚠ **THE CLOCK IS SPLIT INSIDE THIS ONE ROW, AND ONLY THIS ROW.** The pool KEY reads the frozen generation-time snapshot `settlement.economicState.compound.inst` (`defenseStateProse.js:657-659`; **W-11**: rows 3 to 5 of the block are on the snapshot). But the tab's own eyebrow says: *"Bars show the settlement's defense readiness against each threat, as judged at the first survey; **Disasters & Famine is re-judged as the campaign advances.**"* (`DefenseTab.jsx:313`). So the BADGE beside this sentence is the one live band in the block while the sentence's key is frozen. **R-2** rules that a frozen reading disagreeing with a live one is NOT a contradiction, so a refuter may not fail a face on this seam; a writer should still not reach for a live posture word.
5. **`may NOT: another civic object of the class `store`` is the card's own narrowing and T-F12 is STRUCK.** The recut's struck list names it: *"T-F12's one-civic-object-per-class restatement guard. Put the granary and the stores in one breath."* The store and the grain may sit in one sentence.
6. **`angle: ledger street visitor` is alphabetical and the CORPUS ORDER is the same** — ledger (vid 1), street (vid 2), visitor (vid 3). Rewrite one for one against the vids at §1, §2, §3.

---

## 0.2 THE BLOCK'S HEADER LINES (annex `### DS-DEF-2`, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` and `:310-350` · the pool key `src/domain/display/stateProse/defenseStateProse.js:550-594` (`DISASTER_ROW_POOL`, `disasterRowSituation`, `disasterRowPoolKey`).
- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose. **This pool is row 5's `!granary && !hospital` branch.**
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at the call site. **In this pool vids 1 and 3 carry `{settlement}`; vid 2 carries NO SLOT AT ALL.** A face whose `{slot}` set differs from its parent variant's is refused by the projector (ARCH §2.5, the face sub-row rule) — so **all four faces of vid 2 must be slot-free**, and all four faces of vids 1 and 3 must name `{settlement}` exactly once.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE.** The `buildThreatAssessment` lattice is dossier-native and this pool EXTENDS it; each branch holds exactly ONE string today, so every settlement in the branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are *capability* clauses (a place with no store cannot ration) and never *historical* ones (the granary burned) unless the history surface supplies the ancestry.**
- **PDF PARITY:** parity (`viewModel.js` defense slice), through `deriveDefenseReadiness`.
- ⚠ **ALL FIVE POOL SENTENCES PRINT IN ONE PANEL, ABOVE THE FIVE BARS** (`DefenseTab.jsx:316-321`): a single bordered block of five italic lines, the first at `FS.sm` and the rest at `FS.xs`. **This row is the LAST of the five.** So this face is read immediately after the Economic Survival line, in a five-sentence paragraph about one town. That is the composition fact behind THE THREAD here.

## 0.3 THE REGISTER CARD'S SIX ONE-LINE REGISTERS (the writer aims at the first)

- **The dossier:** the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- **The NPC ladder:** read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- **The Herald:** the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- **The chronicle:** a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- **The DM page:** candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- **Chrome and the docent:** never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing.

**THIS POOL IS DOSSIER-ARCHIVIST (R1 STATE).** The other five are named to fence it, not to license it.

## 0.4 THE WRITING LAWS THAT BITE HARDEST HERE

- **FOUR FACES PER VARIANT**, each a different vocabulary or rhythm inside the voice, never a paraphrase of a sibling. An unweighted seeded roll picks the face at render, so **every face stands alone**. NEVER TRIM (Part B §22): the variant count and face count are ratchets; a face that fails stays in the annex as a refusal row.
- **THE THREAD (MOVE-GRAMMAR §1.4.1, an owner wall).** This pool is a SPINE and sits FIRST in its unit. Every face must hand a noun forward that a later modifier could pick up — *the store, the grain, the house, the season, the sick, the road* — and must close on a standing fact rather than a set-up. **Zero modifiers attach here today**, so no sibling text is guaranteed to follow: the face must read as a complete unit alone AND as an opener. The composer places the spine first and modifiers by salience; write so the face survives either.
- **S2, THE CLAUSE SEAT.** One computed CONSEQUENCE of the sentence's own fact may ride as a clause, with one joint, the joint's own comma and a word from the connectives list, **never "which"**, the whole unit two sentences at most. Every other second fact takes its own sentence. ⚠ **the shipped vid 2 carries a which-clause and breaks a hard wall.**
- **THE HARD WALLS:** no em dash, no exclamation, no digit or percent in a connective, **no which-clause**, no question, no second person, no forecast (the edge is subjunctive), no figure on an abstraction.
- **THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Never trade density for plainness.
- **THE CEILING, NOT THE MIDDLE (§21.1).** The band is a licence, not a target. Aim at the sharpest licensed fact, the strongest rhythm, the widest sibling distance.
- **ORDER CONSTRAINT 10:** the `{settlement}` token opens at most ONE variant per pool and never two adjacent. Vid 1 opens on it today; vid 3 buries it. Keep that distribution or improve it.
- **A11's SPREAD:** no two variants of one pool share their first two words, and where they differed in sentence count and grammar they keep differing. ⚠ shipped vids 2 and 3 both open on a bare article plus noun; vid 1 opens on the token.
- ⛔ **THE WORD "TOWN" IS THIS POOL'S BIGGEST SINGLE CRAFT DEBT.** All three shipped rows use it, and §0.8 shows the preimage is overwhelmingly thorp, hamlet and village. **F1-31** bars naming a tier the identity strip does not print, and `{r.tier}` prints verbatim beside the name (`OverviewTab.jsx:247`). Write around it: *the place*, *here*, *a settlement this size* is barred too as a spelled band (F1-31 / W3), so reach for the town's own name through the slot, for *the houses*, *the households*, *the people who live here*, or for no subject noun at all.

---

## 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL A WRITER MAY USE, never a bound on what may be written

The predicate is one function of three booleans of which **two are read** (`defenseStateProse.js:580-591`):

```
function disasterRowSituation(granary, hospital, church) {
  if (granary) {
    if (hospital) return 'granary, hospital';
    return church ? 'granary, parish care' : 'granary, no medical provision';
  }
  return hospital ? 'no reserves, hospital' : 'no reserves, no medical provision';
}
```

Called as `disasterRowPoolKey(civicFlag(compound.hasGranary), civicFlag(compound.hasHospital), civicFlag(compound.hasChurch))` with `compound = settlement.economicState.compound.inst` (`:657-659`, `:672-674`); `civicFlag` is a strict `=== true`.

| read | what it holds on this key | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|
| `compound.inst.hasGranary === false` | **no** roster row whose lowercased native semantic name contains the stem **`granar`** (`priorityHelpers.js:63`) | no communal store of any size. The denied rows print their own words: `Town granary` = *Communal grain storage. Buffers harvests, prevents famine.* (`institutionalCatalog.js:925-930`), `City granaries` = *Multiple large grain stores distribute food across the city. State managed.* (`:1590-1596`), `State granary complex` = *State-administered granary network holding strategic reserves.* (`:2505-2511`). **What is absent is the POOLING and the office that keeps it, not the grain** | the inverse direction only (**F1-09**): a face asserting a granary, a grain store, a common bin, a public stock, a reserve held against the year is contradicted by the flag the pool key itself reads. ⚠ and **W-07**: a granary READING still prints with no row (capacity falls through), which is a WIRING row and not the writer's |
| `compound.inst.hasHospital === false` | **no** roster row containing `hospital` OR `monastery` OR **`healer`** OR `friary` (`priorityHelpers.js:64`) | no house for the sick **and no rostered healer either**, because the grep covers a PERSON: `Healer (divine, 1st level)` (`institutionalCatalog.js:845-865`, village, `baseChance: 0.4`, `magicLicense: 'low'`, printed as *Basic healing spells. A closed wound costs 10 in gold.*). Also denied: `Small hospital` = *Care for sick poor. Usually religious-run.* (`:1275-1281`), `Monastery or friary` = *Religious community. May operate hospital/school.* (`:1267-1273`), `Major hospital` = *Large facility for sick poor. 50-100 beds.* (`:1814-1820`), `Hospital network` (`:2385-2391`) | the inverse direction only (**F1-14**): an infirmary, a sick-house, a bed set apart, a physician, a healer, a nursing order, a man who does this for money |
| `compound.inst.hasChurch` | ⭐ **PASSED AND NOT READ ON THIS BRANCH.** True or false across the pool's whole range | ⛔ **nothing, in either direction.** The pool cannot assert a church and cannot deny one. The faith house is off the table both ways | **F1-11** if asserted (the flag fires on `Access to parish church` — *Walk 2-5km to village church*, `institutionalCatalog.js:50-54`, `:300-305` — and on a `Wayside shrine` with no clergy, `:42`); **F1-23** if the clergy are asserted as a body; **and the CLERGY-CARE surfaces below if denied** |

### 0.5a ⭐⭐ THE CHURCH SLICE — the finding that governs two of the three shipped rows

`hasChurch` greps `church` · `cathedral` · `temple` · `monastery` · `friary` · `shrine` · `priest` · `abbey` (`priorityHelpers.js:65`). Two of those (`monastery`, `friary`) also set `hasHospital` and therefore leave this pool. **The six that remain — `church`, `cathedral`, `temple`, `shrine`, `priest`, `abbey` — all sit inside this pool's range**, and at thorp and hamlet they are the ordinary case (`Access to parish church` is a thorp/hamlet row; `Wayside shrine` is a thorp row).

On that slice the reader's own Defense tab prints, beside and beneath this prose:

| surface | what it says on the church slice | what it says on the no-church slice |
|---|---|---|
| `threatAssessment.js:176-184`, the expandable row **under this very label** | *No food reserves. A crop failure or supply disruption causes immediate hardship.* + ***Parish clergy provide basic wound care: better than nothing, worse than a hospital.*** | + *No medical infrastructure. Plague spreads until it burns out.* |
| `defenseDisplay.js:236-239`, the **Medical Readiness** capability row | status **`Clergy care`**, note *Parish care. Basic wound and disease management.* | status `None`, note *No dedicated healers. Plague burns unchecked.* |
| `stressGenerator.js:173` | `if (religion > 60 && hasChurch) prob *= 0.5; // religious healing suppresses plague` | no reduction |

⭐ **The consequence a writer must hold in one hand:** a face that says nobody here treats the sick, or that a sickness meets no answer of any kind, or that there is nothing between the ill and the outcome, is **CONTRADICTED on the church slice by a status label and a positive model on the same tab** (floor 1 via **F1-107**, floor 4 via the plague coefficient). Under the tie-break **R-1** the engine PROSE half of that (the two assess strings) is a WIRING row and cannot fail a face — but `Clergy care` is a printed **status label** in the capability grid, and the `×0.5` is the engine's own **positive model**, and neither is prose.

**THE LICENSED CURE, and it is better writing anyway: deny the HOUSE and the TRADE, never the CARE.** *No room kept for the sick* · *nobody whose work it is* · *no bed that is not somebody's own* · *no door that shuts on it* · *nowhere to take a person who cannot be looked after where they are*. Every one of those is true on both slices, and every one is more particular than "nobody to treat the sick".

### 0.5b THE READS THE DESK PERFORMS THAT THIS KEY DOES NOT REACH

- ⭐ **The badge beside this prose is not bound to the key at all.** `DefenseTab.jsx:185`: `scores.disaster ?? foodSecurity.resilienceScore ?? round((econ×0.4 + (granary?60:20) + (hospital?70: church?40:10))/2)`. `scores.disaster = round(clamp(resilienceScore) × disasterGate)` with `disasterGate = min(1, 0.55 + econOutput/50 × 0.45)` (`defenseGenerator.js:608-618`), and `resilienceScore = storageMonths/12×35 + diversityScore×30 + (importDependency < 0.2 ? 15 : …) + (deficitPct < 5 ? 20 : …)` (`foodGenerator.js:464-469`). **A no-granary village with three food chains and no deficit scores in the high sixties, which is ADEQUATE or STRONG.** So **STRONG, ADEQUATE, WEAK and CRITICAL all print beside this sentence** (**W-10**: the card must print the band spread before any intensity word here is refutable either way).
- ⭐ **THE STORE IS ABSENT; THE FOOD IS NOT.** `storageMonths` without a granary row falls to **1.5 months at thorp and hamlet, 1.0 elsewhere**, and a mill multiplies it by 1.25 (`foodGenerator.js:158-164`); the defense generator's own fallback is `inst.hasGranary ? 4 : 1` (`defenseGenerator.js:265`). **So a face asserting that nothing whatever is put by is contradicted by a printed number of months on the food surface.** The five food CHAINS — grain and agriculture, pastoral and livestock, fishing and water, hunting and foraging, trade and imports (`foodGenerator.js:148-156`) — are all unread by this key, and a settlement on this pool may run every one of them.
- ⭐⭐ **THE OVERVIEW TAB CAN PRINT `Surplus` BESIDE THIS SENTENCE.** `foodGenerator.js:342-357` bands the label `Deficit — Active Famine` / `Import-Dependent` / `Surplus` / `Secure`, and `OverviewTab.jsx:384-390` prints it as **Food Security** with a bar. **F1-107's own named example is "a famine face over a `Surplus` tile."** A face that makes this a hungry place, rather than an unprovided one, walks straight into it.
- **The Logistics & Supply capability row prints directly beneath, in plain English** (`defenseDisplay.js:240-245`): status **`No reserves`**, note *No food buffer. Any supply disruption becomes a survival crisis within days.* — or, on a port, **`No reserves, but sea supply continues while port is open.`** ⚠ the engine writes a duration there; the writer still may not (**F2-02**).
- **The funding note prints under the expanded row** when the gate bites: `READINESS_GATE_FOR['Disasters & Famine'] = ['disaster', 'relief funding']` (`defenseDisplay.js:283`), rendered `DefenseTab.jsx:344`. **Floor 0.55, the lowest of the four gates** (`defenseGenerator.js:614`). So the page can say the relief money is short right under the sentence.
- **The engine models the absence as RAISING the risk, which supports the prose's direction:** famine probability takes `×0.5` only where a granary stands, `×1.3` at a small tier and `×2.0` on an isolated route (`stressGenerator.js:130-136`); plague takes `×0.6` only where a healer stands (`:174`).
- **Unread by this key, therefore not the pool's material:** the tier, the route, `config.monsterThreat`, `config.stressTypes`, the safety label, the criminal structure, the walls, any force bucket, the culture profile, the terrain, the prosperity rung, the population band, and **`history` — unread by every state-prose pool key in the estate** (F2-09).

## 0.6 THE PROVENANCE MOVE, PRICED FOR THIS POOL

The card resolves **no holder** and prints SOURCE-UNRESOLVED. A cited keeper lands on **F1-24**, and the exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool.**

The RECORD VOCABULARY is free (**W24 struck entire**) — the account, the return, the entry, the roll, the tally. ⚠ **But this pool is the poorest in the block for it**, because the office that would have kept the account is exactly what the key denies: a granary is the thing with a keeper and a measure. **The licensed and unused move is the absence of the record itself as a standing condition** — nothing is added up, no one is charged with knowing the total, what each house holds is that house's own business. That is floor 2's own conversion note applied to this pool: not a count, a condition.

## 0.7 THE SHIPPED ROWS, verbatim, one for one — annex `RECEIPT_POOLS_DOSSIER_STATE.md:2720-2723`

1. `[ledger]` {settlement} holds no food against a bad year and has nobody to treat the sick; a failed harvest is immediate hardship here and a plague runs until it burns out.
2. `[street]` The town's answer to a bad season is the same as its answer to a sickness, which is to endure it and count afterwards.
3. `[visitor]` A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither.

## 0.8 ⭐⭐ THE PREIMAGE — the range of towns this key selects

`!granary && !hospital` fires on **every settlement whose FROZEN `economicState.compound.inst` snapshot carries no roster row with the stem `granar` and no row containing `hospital`, `monastery`, `healer` or `friary`**, and on nothing else about the place. Walked against the default catalogue, that is:

- ⭐⭐ **THORP, HAMLET AND MOST VILLAGES — and this pool is alone in the block in being a SMALL-PLACE pool.** There is **no granary row anywhere below town** in the catalogue: the only three are `Town granary` (`institutionalCatalog.js:925-930`, `required: true`, `baseChance: 1`), `City granaries` (`:1590-1596`, `required: true`) and `State granary complex` (`:2505-2511`, metropolis, 0.7) — and metropolis merges the city catalogue (`assembleInstitutions.js:244`), so it inherits the required row. **So at town, city and metropolis `hasGranary` is true by construction**, and this pool reaches them only where a DM toggle force-excludes the required row (`assembleInstitutions.js:279`, `:652`) or where custom content displaces it (**F1-30**).
- **The medical half narrows it again, in the same direction.** At **thorp and hamlet the catalogue holds NO row matching any of `hospital` / `monastery` / `healer` / `friary` at all** — the first such row in the file is village's `Healer (divine, 1st level)` at `:845`. So **every thorp and every hamlet in default content reads `hasHospital: false`**, and this pool is the ONLY disaster pool those two tiers can draw. At **village** the sole setter is that `Healer` row, `baseChance: 0.4` and `magicLicense: 'low'` — so roughly three villages in five read this pool, and **in a magic-free world every village does**, because the licence gate cannot seat the row (`magicWorksAt.js`; the row's own docblock says a world where spells do not work genuinely cannot hold it).
- ⛔ **THE WRITING CONSEQUENCE, and it governs all twelve faces:** the reader of this sentence is almost always looking at a dossier whose identity strip prints `thorp`, `hamlet` or `village` beside the name and population (`OverviewTab.jsx:247`). **The shipped rows call it "the town" nine times between them.** **F1-31** bars naming a tier the strip does not print, and bars spelling the band as well (`W3` → F1-31: never write "village size or under"). The safe subjects are the settlement's own name through `{settlement}`, *the houses*, *the households*, *the people here*, *here*, or no subject noun at all.
- **With a church and without one.** See §0.5a. At thorp and hamlet the church flag is ordinarily SET, by `Access to parish church` (a church **2 to 5 km away in another place**) or by a `Wayside shrine` with no clergy. **The same sentence prints on both slices and must be true of both.**
- **With a mill, fields, a fishing water, grazing and a market, and with none of them.** None is read by the key. A village on this pool may run all five food chains and print **Food Security: `Surplus`** on the Overview tab (`foodGenerator.js:354`; `OverviewTab.jsx:384-390`).
- **On every route**, including `isolated` (famine `×2.0`, `stressGenerator.js:131`) and `port` (where the Logistics row itself prints *No reserves, but sea supply continues while port is open*, `defenseDisplay.js:244`).
- **Every monster country, every stress state.** `config.monsterThreat` and `config.stressTypes` are unread. This pool prints under `famine` and under `plague_onset` — and under `plague_onset` the safety panel on the same dossier prints `Quarantined` / `Restricted` / `Dangerous — Plague Unrest` with the condition `Plague Conditions` (**F1-36**), so the sickness may be **happening now** while this sentence speaks of it as a thing that would happen.
- **Every disaster band.** The badge is live and computed from storage, chain diversity, import dependency and deficit, then gated on economy — **STRONG, ADEQUATE, WEAK and CRITICAL all print beside this sentence** (**W-10**).
- **The FROZEN clock on the key, the LIVE clock on the badge.** A granary raised or razed after the first survey does not reach this key (**W-11**), while the bar beside it is explicitly re-judged (`DefenseTab.jsx:313`). **R-2**: not a contradiction, and no refuter may fail a face on it.

**A face must contradict no state in that range, not merely the settlement on this skeleton.**

## 0.9 ⭐ WHAT WOULD BE FALSE HERE — the master table for this pool (all three variants inherit it)

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-09** ⭐ | a GRANARY, a grain store, a common bin, a public stock, a reserve held against the year, a store-house of any kind | `inst.hasGranary` false, `priorityHelpers.js:63` — the pool key reads this flag itself; the denied rows and their printed words at `institutionalCatalog.js:925-930`, `:1590-1596`, `:2505-2511`. ⚠ **W-07**: a granary READING still prints with no row (capacity falls through to 1.5/2.0 months, `foodStockpile.js:190-193`) — a WIRING row, not the writer's |
| **F1-14** ⭐ | an infirmary, a sick-house, a hospital, a bed set apart, a nursing order, a physician, **a healer** — as a building OR as a person | `inst.hasHospital` false, `priorityHelpers.js:64` — the grep covers `healer`, so the absence includes the PERSON (`Healer (divine, 1st level)`, `institutionalCatalog.js:845-865`). The pool key reads this flag itself |
| **F1-11 / F1-23** ⭐⭐ | a CHURCH, temple, cathedral or shrine standing IN the settlement, or THE CLERGY as a body — **and equally the DENIAL of either** | the key does not read `hasChurch` at all (`defenseStateProse.js:589`). Asserting it: the flag fires on `Access to parish church` (*Walk 2-5km to village church*, `institutionalCatalog.js:50-54`, `:300-305`) and on a `Wayside shrine` with no clergy (`:42`); `governanceNarrative.js:128-130` conditions the engine's own "the clergy" on a church row. Denying it: `defenseDisplay.js:237-239` prints the status **`Clergy care`** and `threatAssessment.js:182` prints *Parish clergy provide basic wound care* on the same tab. **The faith house is off the table in BOTH directions** |
| **F1-31** ⭐⭐ | naming a TIER the identity strip does not print — **"the town" on a thorp, a hamlet or a village**; and spelling the band ("a place too small for a store of its own") | `{r.tier}` prints verbatim beside the name and population, `OverviewTab.jsx:247`; `W3` → F1-31 bars the spelled band. **§0.8 makes this the pool's commonest live falsity, and all three shipped rows carry it** |
| **F1-76** ⭐ | **"there is no food at all"**, "nothing to eat", rationing by rule rather than by price, a harvest blamed for a supply famine | `stressorDynamics.js:469` (*this famine is not a failure of harvest*); `stressFactions.js:137-142` (Grain Holders; *the wealthy are hoarding*); `stressTypes.js:27-28` (*a grain merchant has food, enough to matter*). **The absence is of a COMMON store, never of food** |
| **F1-107** ⭐⭐ | one band denying another printed on the same screen — **a famine face over a `Surplus` tile**, an intensity word outrunning the badge | the printed band, whichever it is. `foodGenerator.js:342-357` bands `Deficit — Active Famine` / `Import-Dependent` / `Surplus` / `Secure`, printed at `OverviewTab.jsx:384-390`; the row's own badge is `scoreBand` over a live resilience score (`DefenseTab.jsx:185`, `:337`). **F1-107's own worked example is this pool's exact shape** |
| **F1-36** | a sickness spoken of as hypothetical **while the panel names the plague** — or `Quarantined` / `Restricted` read as a curfew | `safetyProfile.js:133-143` under `plague_onset`; `strainLabel ∈ {Quarantined, Restricted, Dangerous — Plague Unrest}`, condition `'Plague Conditions'`. The key never reads stress, so the collision is live across the preimage |
| **F1-44** | reading the food labels at their English — `Secure` as "feeds itself", `Import-Dependent` as "bought from outside", `Active Famine` as "nothing is getting through"; or reading `farm surplus` / `subsistence living` as food readings | `foodGenerator.js:293-296`, `:308-309`, `:318-330` (the residual is POST-import); `prosperity.js:304-315` and `labelBands.js:130-161` never read `foodSecurity`, so a `Deficit` village prints *surplus farm trade* |
| **F1-25** | the negation direction pushed past the two flags — "nothing is kept anywhere", "no one here knows anything about sickness", "there is no help of any kind" | the same flags read the other way, plus §0.5a's clergy surfaces and §0.5b's storage months. The two flags deny a STORE and a HOUSE-plus-TRADE, and nothing wider |
| **F1-30** | denying anything a CUSTOM roster row supplies — a DM's grain pit, a DM's sick-house, a DM's herb-woman | `customContentSemanticAuthority.js:22-32`; FOLD 59's custom-content parity. **Write around an absence rather than asserting a global one** |
| **F1-34** | a TOTALITY — "nothing ever survives a bad year here", "no one has ever recovered", "everyone who falls ill dies" | the engine's model runs the other way: `threatAssessment.js:176-184` builds this row for EVERY settlement; the resilience score can read STRONG (§0.5b); `stressGenerator.js` makes famine a PROBABILITY, never a state |
| **F1-126** | a minted PROPER NAME borne by the face — a family, a lane, a house, a person | a pooled face is authored once and drawn by every matching settlement, so the name prints identically across a region. `{settlement}` is this pool's only slot |
| **F1-24** | a record cited to a NAMED KEEPER — *the reeve's tally*, *the parish book has it* | the card prints SOURCE-UNRESOLVED; `holderTable.js:243-247`; `composedWalker.js:1071-1073`. **The record WORDS are free (W24 struck); the CITATION needs a holder this card cannot resolve** |
| **F2-01** ⭐ | ANY magnitude, digit or word — months of food, a headcount of the sick, a share of a harvest, a number of houses, "a handful", "most", "half the place" | the band vocabularies are closed; `demographicsHerald.js:70-80` is the trap in miniature. ⚠ **the storage months are a printed figure on the food surface and are still not the writer's**. *More of them than the houses can carry* is the hook |
| **F2-02 / F2-03 / F2-04 / F2-05 / F2-07 / F2-08** ⭐ | a date, a season, a duration (*within days*, *through the winter*), a founding, an event the record did not run (*the store burned*, *the healer left*), an ELAPSED COURSE (*has been*, *still*, *no longer*, *again*, *since*, *thinner than it was*), an age of fabric against the printed age, a TREND | `ageBands.js`'s `HISTORICIZE_BAND`; `institutionFounding.js` (*absence is the typed value*); `OverviewTab.jsx:251`. ⚠ **a bad year, a bad season and a failed harvest are all SEASONS or COURSES if written as having happened; written as a case they are lawful.** age-FLAVOUR is free where the printed age does not deny it |
| **F2-06** | a RATE — "most years", "seldom", "every harvest", "more often than not" | nothing bands a rate anywhere in the engine; the chair's own ADDENDUM 14 example is withdrawn in its rate form (§S-3) |
| **F2-09** | a dependency on a field the key cannot see — the route, the tier, the walls, the safety label, the stress banner, the market, **the history** | no key function of this block reads any of them; `historyPreservation.js:1-30` (a reroll replaces history wholesale) |
| **F3-05** ⭐⭐ | cultural furniture the culture profile denies — a barn, a thatched roof, a churchyard, a village green, a hearth, snow on the road, a north-European lane — on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` profile | `cultureProfiles.js:50-600` carries twelve profiles with `builtForm`, `foodways`, `sacredLife`, rendered `dailyLifeLogic.js:14`. **No defense pool reads the profile**, and `foodways` is a profile field, so **a pool about food and sickness is the most exposed pool in the block to this row.** The recut names it the finding most likely to recur everywhere |
| **F3-06** ⭐ | an UNNAMED person's act on an office the tier or the stress emits as a NAMED NPC — "the headman", "the priest", singular | `TIER_MANDATORY_ROLES` seats a Mayor and a Guard Captain at village-plus and a High Priest; `STRESS_MANDATORY_ROLES` adds a Chief Magistrate and a mandated Corrupt Official (`npcGenerator.js:1511-1537`), each with a generated personality, disposition and secret. **A plural, a trade, a neighbour, a household is safe; the singular office is not** |
| **F4-03 / F4-04** | splitting the four gates' direction, or a TOTAL failure of relief money | all four gates are `min(1, floor + econOutput/50 × (1−floor))` on ONE input and differ in degree only; the disaster gate's floor is **0.55**, the lowest of the four (`defenseGenerator.js:614`). The licensed extreme is short, late, thin, never none |
| **F4-05** | `plagued` read as DISEASE | `monsterThreat.js:28`; `SummaryTab.jsx:28`, `:37` print "plagued by MONSTER activity"; disease is the separate `plague_onset` stress. ⚠ **this pool's subject matter makes the word a live trap on a `plagued` town** |
| **F4-09** | a blockade closing supply outright | `blockadeTransport.js:19-28` — *impaired, never inoperable* |
| **F4-13** | a PLAYER face naming a fact the engine flags COVERT | `corruption.js:670-689`; `settlementPolitics.js:423-436`. **The positive move nobody used: the player face may say the place DOES NOT KNOW what it holds, and the not-knowing is the hook** |
| **W-10 / W-11 / R-2** | outrunning the live badge, or reaching for a live posture word off a frozen key | `DefenseTab.jsx:185`, `:313`, `:317-321`. **A refuter may NOT fail a face for disagreeing with a band on the other clock** (R-2); a writer should not reach for one either |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house the roster does not carry may not be asserted. Three sets bind here, and two of them are greps rather than lists:

- **the store set** — a roster name containing the stem **`granar`** (`priorityHelpers.js:63`). FALSE here. ⚠ **a `Warehouse` is NOT in this set** (`hasWarehouse` is its own flag, `priorityHelpers.js:60`), so a settlement on this pool may hold a warehouse, a yard or a bonded store and still read *no reserves* — but asserting one is **F1-19**, so the honest position is that the key says nothing about them.
- **the medical set** — `hospital` · `monastery` · `healer` · `friary` (`:64`). **All four false.** This is the widest of the two absences and it includes a person.
- **the faith set** — `church` · `cathedral` · `temple` · `monastery` · `friary` · `shrine` · `priest` · `abbey` (`:65`). **Neither asserted nor denied** (§0.5a). ⛔ Every face must be true whether it is set or not.
- Also closed and touched in passing: the NPC office roster (F3-06), the live institution roster over the frozen snapshot (W-11), the food-label ladder and the `scoreBand` ladder (F1-107).

**Not a faith pool.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the `suppressed` flag do not arise here and no face may reach for any of them. ⚠ **but note the near miss:** this is the one pool in the block whose key function is handed the faith flag and throws it away, so a writer who reasons from the parameter list rather than from the branch will reach for parish care and be wrong in both directions at once.
