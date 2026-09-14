# MARKER PACKET — DS-DEF-2 · pool `Disasters & Famine: NO reserves, NO medical provision`

Seat: opus (marker), for the Fable chair. Block `DS-DEF-2` (`Defense › Threat assessment`), **row 5 of five**. **Three shipped variants; three to rewrite, four faces each.**

Status: COMPLETE — all three variants marked.

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
- ⛔ **THE WORD "TOWN" IS THIS POOL'S BIGGEST SINGLE CRAFT DEBT.** The shipped vid 2 opens on it and repeats it as a possessive, and the four sibling pools of this row use it in nine of their twelve lines, so a rewriter working across the row will import it. §0.8 shows the preimage is overwhelmingly thorp, hamlet and village. **F1-31** bars naming a tier the identity strip does not print, and `{r.tier}` prints verbatim beside the name (`OverviewTab.jsx:247`). Write around it: *the place*, *here*, *a settlement this size* is barred too as a spelled band (F1-31 / W3), so reach for the town's own name through the slot, for *the houses*, *the households*, *the people who live here*, or for no subject noun at all.

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
- ⛔ **THE WRITING CONSEQUENCE, and it governs all twelve faces:** the reader of this sentence is almost always looking at a dossier whose identity strip prints `thorp`, `hamlet` or `village` beside the name and population (`OverviewTab.jsx:247`). **Shipped vid 2 opens on the word; vids 1 and 3 are clean, and that is a property to protect rather than an accident.** **F1-31** bars naming a tier the strip does not print, and bars spelling the band as well (`W3` → F1-31: never write "village size or under"). The safe subjects are the settlement's own name through `{settlement}`, *the houses*, *the households*, *the people here*, *here*, or no subject noun at all.
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

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · opens on the settlement token

### 1.1 The shipped sentence, verbatim

> {settlement} holds no food against a bad year and has nobody to treat the sick; a failed harvest is immediate hardship here and a plague runs until it burns out.

### 1.2 Every claim it makes, on the new test

- **No reserve is held against a bad year.** — **SAFE, and it is the pool's first discriminating claim.** `hasGranary === false` is half the predicate; `defenseDisplay.js:241` prints the status `No reserves` beside it and `threatAssessment.js:177` prints *No food reserves* inside it. The construction **against a bad year** is the best thing in the shipped set: a reserve is a thing held FOR a case, and the case is not asserted to have happened.
- **"HOLDS NO FOOD" — read as the settlement having no food.** — ⚠ **CONTRADICTED as spelled, on a large part of the range. Rows F1-76 and F1-107.** Without a granary row `storageMonths` falls to **1.5 at thorp and hamlet, 1.0 elsewhere**, times 1.25 with a mill (`foodGenerator.js:158-164`), and the defense generator's own fallback is `hasGranary ? 4 : 1` (`defenseGenerator.js:265`) — a printed number of months, not nothing. The five food chains are unread by this key and the Overview tab can print **Food Security: `Surplus`** on the same dossier (`foodGenerator.js:354`; `OverviewTab.jsx:384-390`), which is **F1-107's own worked example**. And **F1-76** names *"there is no food at all"* as false by the engine's own famine model. **The record denies a STORE. It does not deny FOOD.** The rewrite must keep the first and drop the second, in every face.
- **NOBODY TREATS THE SICK.** — ⭐⭐ **CONTRADICTED on the church slice, and this is the variant's central fault. See §0.5a.** `hasChurch` is not read by the key and is ordinarily SET at thorp and hamlet; on that slice the Defense tab prints the status **`Clergy care`** with the note *Parish care. Basic wound and disease management.* (`defenseDisplay.js:237-239`) and the expandable row under this very label prints *Parish clergy provide basic wound care* (`threatAssessment.js:182`), while `stressGenerator.js:173` reduces plague probability by half where religion is high and a church stands. **The record is a printed status label and a positive model.** What `hasHospital === false` actually denies is a HOUSE and a TRADE: no room for the sick, no bed apart, nobody whose work it is, and no rostered healer — the grep covers the person as well as the building (`priorityHelpers.js:64`). **The licensed cure is in §0.5a and it is sharper writing than the shipped clause.**
- **A FAILED HARVEST IS IMMEDIATE HARDSHIP HERE.** — **SAFE, and DULL.** It is the engine's own sentence at one remove: `threatAssessment.js:177` reads *A crop failure or supply disruption causes immediate hardship*, and the reader opens that panel by clicking this row. A face that paraphrases the string underneath it has spent its best position on a restatement. ⚠ note also that the engine's version carries **or supply disruption**, which is the half the shipped row drops and the half that is true on an `isolated` route.
- **A PLAGUE RUNS UNTIL IT BURNS OUT.** — ⭐ **THREE FAULTS AT ONCE, and every face must replace it.** (i) **CONTRADICTED on the church slice**: the engine prints *Plague spreads until it burns out* ONLY where `hasChurch` is false (`threatAssessment.js:184`), and prints parish care instead where it is true; `stressGenerator.js:173`'s `×0.5` is the positive model (floor 4). (ii) **FLOOR-2**: *runs until it burns out* is a prediction the pulse adjudicates — the card prints that refusal in terms, and `calamityKernel` / `foodStockpile` are the adjudicators (F2-05's modal limb). (iii) **DULL**: on the slice where it IS true it is the panel's own wording, verbatim in sense and nearly in words.
- **A HARVEST HAPPENS HERE AT ALL — the place farms.** — **SAFE.** Nothing in the record denies it; the food chains are unread. ⚠ but the FURNITURE of a harvest is **F3-05** territory: a barn, a field of wheat, a threshing floor, a hay-loft are north-European by construction and `foodways` is a `cultureProfiles.js` field no defense pool reads.
- **The semicolon joint and the second "and".** — craft, not claims. **S2 licenses ONE computed consequence to ride as a clause**; this row spends its joint on two further independent facts and runs four beats through one sentence. The lawful rewrite either splits, or makes the rider a genuine consequence of the absence.
- ⭐ **What vid 1 gets RIGHT and the other two do not: it never says "the town".** It carries `{settlement}` and *here*, and is therefore the only shipped row of the three that is clean on **F1-31** across the preimage. **Keep that property in all four faces.**

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `hasGranary === false`: no common bin, no public stock, no measured reserve, no keeper of a total. The denied rows' own printed words are the richest material here — *Communal grain storage. Buffers harvests, prevents famine.* (`institutionalCatalog.js:928`) — and the operative word in them is **communal**.
- `hasHospital === false`: no house for the sick and no rostered healer. The denied village row prints *Basic healing spells. A closed wound costs 10 in gold.* (`institutionalCatalog.js:860`) — **what is absent is a thing that would have been BOUGHT**, which is a ledger fact and nobody has used it.
- **The whole RECORD VOCABULARY**, struck free by the recut (W24 entire): the entry, the return, the tally, the account, the roll, the copy. ⚠ **and the pool's own irony, unused: the absent object is the one civic thing whose entire content is a figure.** No store, no total, nobody charged with knowing.
- **The relief purse, in the engine's own English:** one gate over disaster and famine RESPONSE — *relief purchases, granary logistics, work crews* — floor **0.55**, the lowest of the four (`defenseGenerator.js:608-614`), and the row prints `Upkeep underfunded: relief funding at 55%` directly beneath this prose when it bites (`defenseDisplay.js:283`; `DefenseTab.jsx:344`). ⚠ **F4-03** bars splitting the gates' direction; what is licensed is that the standing charge has a head called relief and this place has nothing for it to be spent through.
- **The engine's positive model of the absence, which runs the SAME WAY as the prose:** famine probability takes its `×0.5` only where a granary stands and takes `×1.3` at a small tier and `×2.0` on an isolated route (`stressGenerator.js:130-136`). **So the direction is model-true; only the magnitude and the totality are not.**
- **An unnamed person may act.** W22's person bar is struck by name: a household, a neighbour, a woman who is sent for, a carter, a miller, a plural of any of them may appear, act, refuse, be avoided, be resented. ⚠ the one bar that survives is **F3-06** — no act on the tier's singular office.
- NOT reached and deliberately unread: the tier, the route, the market, the mill, the walls, any force, the safety label, the stress banner, the culture profile, the terrain, the badge, **and the faith house in both directions**.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**The master table at §0.9 binds this variant unchanged.** The rows a `[ledger]` face walks into HARDEST, because ledger prose reaches for a total and a category:

| row | the trap this variant specifically invites |
|---|---|
| **F1-11 / F1-23** ⭐⭐ | the medical absence written as an absence of CARE or of PEOPLE rather than of a house and a trade. This is the shipped row's fault and the likeliest FAIL in the pool |
| **F1-76 / F1-107** ⭐⭐ | the store's absence written as the absence of food, over a dossier that can print `Surplus` and a storage figure in months |
| **F2-01** ⭐ | the ledger's own instinct for a quantity — months, a share of the harvest, a count of houses, "enough for", "not enough to". **The storage months ARE printed on the food surface and are still not the writer's** |
| **F2-05** ⭐ | the forecast — *until it burns out*, *would not last a winter*, *will be hardship*. The pulse adjudicates every prediction; the edge is subjunctive at most |
| **F2-02** | *immediate*, *within days*, *the same season*, *through the winter*. The engine writes a duration in the Logistics note (`defenseDisplay.js:245`); the writer may not |
| **F1-09** | the ledger reaching for the store as a thing that COULD be entered — a bin, a stock, a reserve, a public measure |
| **F1-24** | the record cited to a keeper — *the reeve's tally*, *the parish book*. The record WORDS are free; the keeper is not |
| **F3-05** ⭐ | the harvest furnished from the exemplar pack — a barn, a threshing floor, thatch, a hay-loft — on a profile whose `foodways` say otherwise |
| **F1-31** ⭐ | "the town", or the band spelled out. Vid 1 is currently clean; do not lose it |
| **F4-13** | the ledger asserting what the place knows about its own holdings. ⚠ **the positive move: the record may say the total is not known, and the not-knowing is the hook** |

### 1.5 ⭐ THE PREIMAGE, as it bites vid 1

As §0.8, unchanged. The three lines that bite a `[ledger]` face hardest: **the key never reads the food surface**, so this sentence prints over `Surplus` and over `Deficit — Active Famine` alike; **the key never reads the faith flag**, so it prints where the tab says `Clergy care` and where the tab says `None`; **the key never reads the tier**, so it prints on a thorp of a few households and on a DM's metropolis whose required granary was toggled away. The one thing the key guarantees on every settlement in that range is this: **nothing here is held in common against a bad case, and there is no house and no trade for the sick.**

### 1.6 The angle's stance in one sentence

`[ledger]` is the clerk's view — what the entries, returns and duties show — so here it may set down the two absences as two standing facts of one record, in the office's own vocabulary, and may make the missing total itself the entry; and it may NOT count the months, price the loss, date the case, name the keeper, deny that anyone tends the sick, deny or assert the faith house, forecast the course of a sickness, rate the place against a live badge computed from other inputs, or widen a missing store into missing food.

### 1.7 The turns worth keeping

- **"against a bad year"** — the pool's best construction and its cheapest. A reserve is held FOR a case; naming the case without asserting it has happened is exactly how floor 2 wants this written. **Carry the *against* shape into at least two faces and vary the case-noun** (a bad year, a hard season, a case of need, the year that goes wrong).
- **"{settlement} … here"** — vid 1's clean subject handling. **Keep it: no tier word in any of the four faces.**
- ⛔ **"holds no food"** — must go in every face. It is the store that is missing.
- ⛔ **"nobody to treat the sick"** — must go in every face. Replace with the house and the trade (§0.5a).
- ⛔ **"a plague runs until it burns out"** and **"a failed harvest is immediate hardship"** — both are the panel's own strings and one of them is also a forecast. Neither survives.
- ⛔ The semicolon is the shipped joint; keep at most one face on it so the pool does not collapse onto one punctuation.

### 1.8 ⭐ WHERE THE FLAVOUR IS (vid 1)

- ⭐⭐ **THE MISSING THING IS THE ONE CIVIC OBJECT WHOSE WHOLE CONTENT IS A NUMBER, AND ITS ABSENCE IS THEREFORE A HOLE IN THE RECORD ITSELF.** The denied row's own words are *Communal grain storage* (`institutionalCatalog.js:928`): what a granary does is POOL, and what pooling produces is a total and a keeper of the total. Without it every house holds its own and **nobody is charged with knowing how much there is** — so the ledger's honest entry is that the figure does not exist, not that the figure is low. Nothing in the record denies a bin under a floor, a sack kept back, a loft, a neighbour who is known to have more than she says, a household that will not be asked. **This is the licensed and unused form of "not knowing" that F4-13's own note asks for, and it is a plot hook rather than a receipt.**
- ⭐ **BOTH MISSING BUILDINGS ARE ROOMS THAT WOULD STAND EMPTY MOST OF THE TIME.** A store against a bad year and a room for the sick are the two civic objects that exist to be unused: their value is that they are there when they are wanted. **A place of this size keeps no room it does not use every day** — and that is a single standing condition that explains both halves of the key at once, in the record's own terms, without a count, a date or a course. No shipped row noticed that the two absences are the same absence.
- ⭐ **THE CHARGE HAS A HEAD CALLED RELIEF AND NOTHING TO SPEND IT THROUGH.** The disaster gate is the engine's own *relief purchases, granary logistics, work crews*, floor 0.55, and the row can print `relief funding at 55%` under this very sentence (`defenseGenerator.js:608-614`; `defenseDisplay.js:283`). **F4-03** bars splitting the purse; what is licensed and unwritten is that the standing charge is written for a chain this place does not have, so the money, such as it is, arrives as a thing carried rather than a thing opened.
- **WHAT IS ABSENT WOULD HAVE HAD A PRICE.** The village healer row the flag denies prints *A closed wound costs 10 in gold* (`institutionalCatalog.js:860`). The writer may never state the figure (**F2-01**), but a ledger may know that the missing provision is a purchase and not a charity — and that where it is absent, help is a neighbour and a debt rather than a service and a fee. **That is a ledger fact about a thing the ledger does not hold, which is exactly this angle's best register.**

### 1.9 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` exactly once, or fewer than four faces, or no longer the pool's canonical index-zero line. Any face that loses the ABSENCE OF A HELD RESERVE, because without it the face is claim-identical to `NO reserves, hospital present`. Any face that keeps the medical absence as an absence of care or of people rather than of a house and a trade. Any face that asserts or denies a church, a temple, a shrine or the clergy. Any face that turns the missing store into missing food, or that outruns a `Surplus` tile. Any face carrying a which-clause, an em dash, a digit, a count, a rate, a date, a duration, a forecast, an elapsed course or a named keeper. Any face that mints a proper name, or puts an act on a singular office. Any face that furnishes its harvest or its sickroom from the north-European exemplar pack. **Any face that says "the town".** A face that shares its first two words with a sibling (A11), or that merely re-spells the shipped clause four times.

---

## VARIANT 2 · vid 2 · `[street]` · ⛔ **NO SLOT** — the pool's one slot-free variant

### 2.1 The shipped sentence, verbatim

> The town's answer to a bad season is the same as its answer to a sickness, which is to endure it and count afterwards.

### 2.2 Every claim it makes, on the new test

- ⛔ **"THE TOWN'S" — the settlement is a town.** — ⭐ **CONTRADICTED across most of the preimage. Row F1-31.** §0.8 establishes that in default content this pool fires at thorp, hamlet and village and reaches town-and-up only through a toggle or custom content; `{r.tier}` prints verbatim beside the name (`OverviewTab.jsx:247`). **This variant opens on the word and repeats it as a possessive, so the fault is structural rather than incidental, and it must go from all four faces.** The slot-free rule forbids reaching for `{settlement}` to cure it, so the four faces must find four different subjectless or non-tier subjects: *the houses*, *the households*, *what people do here*, *the answer here*, or no subject noun at all.
- **THE TWO CASES GET THE SAME ANSWER — the hunger and the sickness are one arrangement.** — ⭐ **SAFE, and it is the best idea in the whole shipped pool.** The predicate is two absences joined by an `&&`, and naming the SHARED SHAPE rather than reciting each half is the only shipped row that treats the key as one fact. Nothing in the record denies it; the two flags fall together by the branch. **Carry the idea; do not carry the words (A11).**
- **THE ANSWER IS TO ENDURE IT.** — ⚠ **PARTIALLY CONTRADICTED on the church slice, and the exposure is real though weaker than vid 1's.** Where `hasChurch` is set the Defense tab prints the status `Clergy care` and the note *Parish care. Basic wound and disease management.* (`defenseDisplay.js:237-239`), and `stressGenerator.js:173` halves plague probability where religion is high and a church stands. **Endurance as the WHOLE answer to a sickness is denied there.** ⚠ note the craft difference against vid 1 and preserve it: *endure* is a statement about what people DO, not a denial that anyone acts, so it is one short step from lawful. **The licensed step is to say what is not there — no room, no bed apart, no trade — and let the endurance be the reader's inference rather than the record's claim.**
- **A BAD SEASON.** — **SAFE as a CASE, and one word away from FLOOR-2.** `F2-02` bars a date, a season, a month or a duration; *a bad season* names no date and asserts no occurrence, exactly as vid 1's *a bad year* does. ⚠ **the moment it acquires an article of occurrence — *the bad season*, *last season*, *the season they had* — it is a dated event the record did not run (F2-04) and an elapsed course (F2-05).**
- ⛔ **"WHICH IS TO ENDURE IT" — the which-clause.** — **A HARD WALL BREACH, not a claim.** The register card's walls list it in terms and Part B repeats it; **S2** further requires that a rider be a computed CONSEQUENCE of the sentence's own fact, with one joint and a word from the connectives list. This rider is a gloss, not a consequence. **Every face must be free of it, and at most one face should reach for a rider at all.**
- ⭐ **"AND COUNT AFTERWARDS."** — **SAFE, and it is the single best clause in the pool.** It speaks NO magnitude, so **F2-01** does not reach it; it is a standing practice rather than an event, so **F2-04** does not reach it; and it is the licensed form of the thing the other two variants keep trying to say with a forecast. It also quietly establishes that there IS an afterwards, which defuses **F1-34**'s totality. **Carry its SHAPE — a practice named in place of an outcome — into more than one face, in different words.**
- **THERE IS AN AFTERWARDS; the place comes through.** — **SAFE and model-true.** `threatAssessment.js:176-184` builds this row for every settlement, the resilience score can read STRONG (§0.5b), and famine is a probability rather than a state (`stressGenerator.js:128-136`). **This is the claim that keeps the pool clear of F1-34, and it is worth keeping deliberately rather than by accident.**
- **An unnamed collective acts — "the town" as a doer.** — **SAFE.** W22's person bar and W23's fused-agent bar are both struck by name; an unnamed person or a plural may act, refuse, be sent for, be resented. ⚠ **F3-06** still bars an act on the tier's singular office (the Mayor, the Guard Captain, the High Priest, the Chief Magistrate).

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

- The two absences **at street level**: no place to take a sick person and no place to draw on when the food runs short. The record leaves entirely open what stands in their place — who is asked, who is not asked, what is fetched from where, what a household will and will not admit to holding.
- `hasHospital === false` felt on the ground: a person who falls ill stays in the room they already sleep in. **There is no door that shuts on it, nothing is carried anywhere, and there is no one whose trade it is** — the grep covers `healer`, so the absence is of the person as much as the building (`priorityHelpers.js:64`).
- `hasGranary === false` felt on the ground: **what is put by is put by in the houses.** No common measure, no keeper of a total, nothing anyone is entitled to draw on. `storageMonths` is still a printed figure (§0.5b) — the grain exists; the CLAIM on it does not.
- **The silence that is this angle's whole estate.** The record says nothing about: who is sent for and who is not, which houses are known to hold more than they say, what is asked for and what is simply taken round, who is owed afterwards, whether the debt is spoken of, what people stop mentioning. **All of it is the writer's, and none of it costs a claim.**
- Free to the `[street]` stance and not reached by the key: **W27's stance rules are struck entire.** The street may reach for its own nouns and rhythm, and a stranger may act, be turned away, be told the wrong thing, be sent to a house rather than a place.
- NOT reached: the tier, the route, the market, the mill, the badge, the food label, the safety label, the stress banner, the walls, any force, the culture profile, **and the faith house in both directions**.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE

**The master table at §0.9 binds this variant unchanged.** The rows a `[street]` face walks into HARDEST, because street-level prose reaches for a scene, a body and a place:

| row | the trap this variant specifically invites |
|---|---|
| **F1-31** ⭐⭐ | **"the town"** and every tier word after it. This is the shipped row's own fault and the likeliest FAIL on this variant by a wide margin, because street prose wants a collective subject and *the town* is the nearest one |
| **F3-05** ⭐⭐ | the street furnished from the exemplar pack — a barn, thatch, a churchyard, a village green, a hearth, a lane, snow, a winter road — on a profile whose `foodways`, `builtForm` and `sacredLife` say otherwise (`cultureProfiles.js:50-600`). **A pool about food and sickness is the most exposed pool in the block to this row**, and a `[street]` face is its most exposed face |
| **F1-11 / F1-23** ⭐ | the street reaching for the obvious body — *they pray*, *the priest comes*, *they carry them to the church* — where the key reads no faith flag at all, or conversely *there is nobody to pray over them*, where the tab prints `Clergy care` |
| **F3-06** ⭐ | the person the street sends for — **"the headman", "the priest", "the elder"**, singular. The tier seats a Mayor, a Guard Captain and a High Priest, each with a generated disposition and a secret (`npcGenerator.js:1511-1537`). **A plural, a trade, a neighbour or a household is safe; the singular office is not** |
| **F1-76 / F1-107** ⭐ | the street's instinct for hunger as a condition — *a hungry place*, *nobody eats well here* — over a dossier that can print **Food Security: `Surplus`**. The record denies a claim on a store, never a full stomach |
| **F2-01 / F2-06** ⭐ | the street's instinct for quantity and frequency — *half the houses*, *a few sacks*, *most winters*, *every spring*, *it happens often enough*. Both are grammar-decidable and both are the commonest street-register failure |
| **F2-04 / F2-05** | an event the record did not run — *the last bad year*, *the one they lost*, *the winter they remember* — and the perfect tense that carries it (*has been*, *since*, *no longer*, *again*) |
| **F1-34** | the street's fatalism widened into a totality — *nobody survives it*, *it always takes somebody*. The engine's model runs the other way and the badge can read STRONG |
| **F1-36 / F4-05** | the sickness spoken of as hypothetical while the safety panel prints `Quarantined` or `Plague Conditions`; or the word *plagued* borrowed off a `plagued` monster country |
| **F1-126** | a minted proper name — a house, a family, a lane, a woman who is always sent for |
| ⛔ **slot discipline** | **any face carrying a slot at all.** The row is slot-free and the projector refuses a face whose slot set differs from its parent's |

### 2.5 ⭐ THE PREIMAGE, as it bites vid 2

As §0.8, unchanged, with the three lines that bite this variant restated. **The key never reads the tier**, and the preimage is overwhelmingly thorp, hamlet and village — a `[street]` face implies a street, and the smallest settlements in the product may not have one; write the HOUSES rather than the street. **The key never reads the culture profile**, so the same face prints on a settlement whose `builtForm` and `foodways` are steppe, south Asian or Mesoamerican; reach for a shape (a door, a room, a wait, a name passed on) rather than for a material. **The key never reads the faith flag**, so the same face prints where the tab says `Clergy care` and where it says `None`. A `[street]` face is the most exposed of the three, because street prose implies a place with a size, a look and a temperature, and the only thing the key guarantees is this: **nothing here is held in common against a bad case, and there is nowhere to take a person who cannot be looked after where they are.**

### 2.6 The angle's stance in one sentence

`[street]` is what the place knows about itself without being asked — so here it may say plainly what happens when the food runs short and what happens when somebody falls ill, in the flat idiom of people who have arranged it between themselves, and it may NOT count, date, rate, name a tier, stage a scene from furniture the culture profile denies, send for a singular office the NPC roster seats, assert or deny the faith house, make hunger a condition of the place, or widen endurance into a totality the engine's own model refuses.

### 2.7 The turns worth keeping

- ⭐ **"count afterwards"** — the pool's best clause. A practice named in place of an outcome, carrying no magnitude and no tense. **Carry the shape into at least two faces; vary the practice** (what is counted, what is settled up, what is put back, what is asked for later).
- ⭐ **the SAME ANSWER to both cases** — the only shipped row that reads the key as one fact instead of two. **Carry the idea into at least one other variant's faces; do not carry the wording.**
- **"a bad season"** as a case-noun rather than an event. Pairs with vid 1's *a bad year* — **vary the case-noun across the twelve faces so the pool does not print one phrase in four spellings.**
- ⛔ **"The town's"** — must go from all four faces, and it is the single most important deletion in the variant.
- ⛔ **"which is to endure it"** — a hard-wall which-clause and a gloss rather than a consequence. Must go.
- ⛔ The row carries NO `{settlement}` slot and **all four faces must carry none**. It is also the one variant that can open on a noun other than the settlement's name without competing with vid 1 (order constraint 10).

### 2.8 ⭐ WHERE THE FLAVOUR IS (vid 2)

- ⭐⭐ **YOU ASK WHERE TO TAKE SOMEBODY AND YOU ARE GIVEN A NAME, NOT A PLACE.** `hasHospital === false` denies the building AND the trade (`priorityHelpers.js:64` greps `healer`), so there is no door, no sign, no bed set apart and nobody whose work this is. **What that looks like on the ground: the sick person stays in the room they already sleep in, the household goes on around them, and whatever is done is done by people who have something else to be doing.** Nothing in the record denies a woman who is sent for, a neighbour who knows what to do with a burn, a plural of people who come and sit. **What a stranger would notice is the absence of a destination** — everything here is somebody's house, including the answer.
- ⭐⭐ **WHAT IS PUT BY IS PUT BY IN THE HOUSES, AND THAT MAKES IT A MATTER OF ASKING RATHER THAN DRAWING.** The denied row's own word is **communal** (`institutionalCatalog.js:928`). Without the pool there is no measure, no keeper and no entitlement: the food exists (§0.5b) and the CLAIM on it does not. **The street's version of that is the whole unwritten estate here** — who is asked and who is not, which households are known to hold back, what is carried round quietly and what is refused out loud, who is owed afterwards and whether anyone says so. **That is a plot hook in every direction and it costs no claim at all**, because the record is silent on all of it.
- ⭐ **THE HELP THAT COMES IS A NEIGHBOUR, AND A NEIGHBOUR IS A DEBT.** The denied village healer row prices its own service — *A closed wound costs 10 in gold* (`institutionalCatalog.js:860`) — so where the provision exists it is bought. Where it does not, the same service is still rendered and is paid for in something that is not money and is not settled at the time. **That is the concrete, particular difference this pool makes to a person's life, and no shipped row went near it.** ⚠ keep it clear of a figure (**F2-01**) and of a rate (**F2-06**).
- **NOTHING HERE IS KEPT FOR A DAY THAT HAS NOT COME.** Both denied buildings are rooms whose whole purpose is to stand ready and mostly empty. A settlement of this size uses every room it has. **The street's reading of that is not poverty but economy** — and it is the licensed alternative to the fatalism the shipped row reaches for, because it explains both halves of the key with one observation and asserts no outcome whatever.

---

## VARIANT 3 · vid 3 · `[visitor]` · slots `{settlement}` (mid-sentence, not the opener)

### 3.1 The shipped sentence, verbatim

> A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither.

### 3.2 Every claim it makes, on the new test

- **A STRANGER ARRIVES AND ASKS.** — **SAFE.** **W27's stance rules are struck entire** and **W22's person bar is struck by name**: a stranger may act, ask, be turned away, be told the wrong thing, be sent to the wrong door. The visitor is not a named character and carries no fate (**F3-01** untouched).
- **SOMEBODY DIRECTS HIM.** — **SAFE.** An unnamed person acts, which the recut licenses outright. ⚠ **F3-06** only bars placing the act on the tier's singular office — the Mayor, the Guard Captain, the High Priest. *Whoever he asks*, *the house he asks at*, a plural, a trade are all free.
- **THERE IS NO GRANARY.** — **SAFE**, and it is half the predicate. `hasGranary === false`; the Logistics row prints the status `No reserves` on the same tab (`defenseDisplay.js:241`).
- **THERE IS NO SICK-HOUSE.** — **SAFE as a BUILDING, and this is the variant's quiet advantage over its two siblings.** `hasHospital === false` denies the house and the trade; **vid 3 is the only shipped row of the three that writes the medical absence as a missing BUILDING rather than as missing care**, and it is therefore the only one that survives the church slice intact (§0.5a). ⚠ the word *sick-house* is free vocabulary (**W15's spelling list is struck entire**) and names no roster row, so it asserts nothing the flag does not.
- ⭐ **"THERE IS NEITHER" — a global assertion of absence.** — ⚠ **CONTRADICTED wherever CUSTOM CONTENT stands. Row F1-30, and it is this variant's real fault.** A DM's roster row is authoritative and prints on the page (`customContentSemanticAuthority.js:22-32`; FOLD 59's custom-content parity), and a custom row whose native semantic name carries neither the stem `granar` nor any of `hospital` / `monastery` / `healer` / `friary` is **invisible to both flags and visible to the reader** — a Grain Pit, a Herb-Woman's House, a Fever Room. **W-03** records exactly this shape for a custom "Night Watch". The recut's instruction is one line: ***write around an absence rather than asserting a global one.*** The face may say what he is not directed to; it may not say what the settlement does not contain.
- **THE TAIL "BECAUSE THERE IS NEITHER."** — **craft, not a claim, and it is a fault twice over.** (i) The register card: *a qualification is a sentence, never a tail*, and *an effect is never bought with a fact*. (ii) **S2** licenses a rider only where it is a computed CONSEQUENCE of the sentence's own fact; this rider is the CAUSE, and it is the same fact stated a second time in the same breath. **The row says one thing twice and spends its joint doing it.**
- ⚠ **THE ABSENCE OPENS THE UNIT.** — craft. The register card's absence rule: *write an absence when the record holds a typed gap — in the record, never in the world; flat; **never as the opener**; replacing a sentence, never added.* This row is an absence in the world, stated as the whole sentence, in the opening position of a five-line panel. **At most one of the four faces should open on the gap; the others should arrive at it.**
- **NO TIER WORD.** — **SAFE, and worth protecting.** Vid 3 carries `{settlement}` and no tier noun, so with vid 1 it is clean on **F1-31**. **Keep that in all four faces.**

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

- The two denied buildings **as a stranger meets them**: two things a place of any size is expected to have, and the expectation is the visitor angle's whole instrument. The denied rows print their own words for what he is looking for — *Communal grain storage. Buffers harvests, prevents famine.* (`institutionalCatalog.js:928`) and *Care for sick poor. Usually religious-run.* (`:1278`).
- ⭐ **What the two absences have in common from OUTSIDE:** both are civic objects that serve a person who has no household here. **A claim on a common store is something you have by belonging; a bed in a sick-house is a bed for somebody who has no bed.** A stranger has neither, so this pool's two absences fall hardest on precisely the person the `[visitor]` angle is written from. **No shipped row noticed this and it is the strongest material in the packet for this variant.**
- **The absence of a DESTINATION**, which is what a visitor actually experiences: there is no building to be pointed at, so every answer is a direction to somebody's door.
- **The whole record vocabulary and the free spelling**: W15's always-safe list and W24's record-word bar are both struck, so *store*, *stock*, *bins*, *the sick*, *a bed*, *a room*, *the door*, *a name* are all ordinary words and cost nothing.
- **The silence that is this angle's estate:** what he is told instead, whose house he is sent to, whether he is asked why he wants to know, what he is expected to have brought with him, what happens to a traveller who falls ill under a roof that is not his.
- NOT reached: the tier, the route, the market, the mill, the badge, the food label, the safety label, the stress banner, the walls, any force, the culture profile, **and the faith house in both directions**.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE

**The master table at §0.9 binds this variant unchanged.** The rows a `[visitor]` face walks into HARDEST, because visitor prose reaches for what is and is not there:

| row | the trap this variant specifically invites |
|---|---|
| **F1-30** ⭐⭐ | **the global absence.** *There is neither*, *the place has no such thing*, *nothing of the kind stands here*. A custom roster row the greps cannot see prints on the same page (`customContentSemanticAuthority.js:22-32`; **W-03**). **Write what he is not directed to, never what the settlement does not contain.** This is the likeliest FAIL on this variant |
| **F1-19** | the inverse slip — a warehouse, a yard, a bonded store offered as what he finds instead. `hasWarehouse` is a separate flag the key never reads: the record neither supplies one nor denies one (`priorityHelpers.js:60`; **F1-19**) |
| **F1-11 / F1-23** ⭐ | the stranger sent to the church, the temple or the priest instead. The key reads no faith flag: **he may be sent to a house, a name or a trade, but never to the faith house in either direction** |
| **F3-06** ⭐ | the person he asks, or is sent to, being the tier's singular office — *the headman*, *the priest*, *the captain*. Use whoever answers the door, a plural, a trade |
| **F3-05** ⭐⭐ | the visitor's eye furnished from the exemplar pack — a lane, a green, thatch, a market cross, a churchyard, a winter road — on a profile whose `builtForm` and `foodways` say otherwise (`cultureProfiles.js:50-600`). **The visitor angle is an angle of DESCRIPTION and description is where this row lives** |
| **F1-31** ⭐ | the stranger's impression spelled as a size — *a place too small for either*, *no bigger than needs a store*. **F1-31** bars the spelled band as well as the tier word. Vid 3 is currently clean; do not lose it |
| **F1-126** | a minted proper name — the house he is sent to, the woman he is told to ask for, the lane he is directed down |
| **F2-01 / F2-06** | the visitor's instinct for a count and a frequency — *the second house*, *two doors down*, *as strangers usually are* |
| **F2-02 / F2-04 / F2-05** | the arrival narrated as an event with a time, or the absence given a past — *there used to be one*, *no longer stands*, *since*. **F2-03** in particular bars a founding or an unbuilding |
| **F1-76 / F1-107** | the stranger's reading widened into the place being hungry, over a dossier that can print **Food Security: `Surplus`** |
| **F1-34 / F4-13** | the visitor's verdict — *nobody here is prepared for anything*. ⚠ **the licensed and better move is what he is NOT told**: the record may say he is given an answer that is not an address, and the not-knowing is the hook |
| **the craft walls** | the absence as the opener in more than one face; the tail that restates the fact; the which-clause; the em dash |

### 3.5 ⭐ THE PREIMAGE, as it bites vid 3

As §0.8, unchanged, with the three lines that bite this variant restated. **The key never reads custom content's own rows**, so the settlement he is walking through may carry a DM's grain pit and a DM's fever room, both printed on the roster and both invisible to the two greps — which is why the global denial is the one shape that cannot be written here. **The key never reads the tier**, so he is as likely to be in a thorp of a few households as in a village, and a `[visitor]` face must not imply a street, a square or a distance. **The key never reads the culture profile**, so what he sees as he asks is the writer's riskiest sentence in the whole pool. The one thing the key guarantees on every settlement in that range is this: **whatever he is told, he is not told the name of a building.**

### 3.6 The angle's stance in one sentence

`[visitor]` is the place as it meets somebody who does not live in it — so here it may show a stranger arriving at two expectations and meeting neither of them as a building, and may make the answer he is given the fact of the sentence; and it may NOT assert what the settlement contains or does not contain in the round, name a tier or spell a size, send him to the faith house or deny him one, mint a name for the house he is sent to, count, date or rate anything, furnish what he sees from the exemplar pack's north-European kit, or close on a verdict about the place.

### 3.7 The turns worth keeping

- ⭐ **"is directed to neither"** — the best construction in the variant and one of the three best in the pool. It states the absence as the answer a person is given rather than as a fact about the world, which is **exactly what F1-30 requires and what the register card's absence rule asks for**. **Carry the shape into at least two faces and vary the answer he gets.**
- **"A stranger looking for …"** — the visitor's arrival as a subordinate clause rather than an event. It carries no time, no distance and no scene, which is why it survives F2 and F3-05 untouched. **A good default for one face; do not spend all four on it.**
- **the medical absence written as a BUILDING** (*the sick-house*) rather than as care. **This is the packet's cure and vid 3 already has it. Carry it into vid 1's and vid 2's faces as well.**
- **`{settlement}` buried mid-sentence, with no tier word.** Keep both properties (order constraint 10 and F1-31).
- ⛔ **"because there is neither"** — must go from all four faces: it is a global absence (F1-30) AND a restating tail (the register card) AND a mis-spent S2 joint, all in four words.

### 3.8 ⭐ WHERE THE FLAVOUR IS (vid 3)

- ⭐⭐ **THE TWO MISSING BUILDINGS ARE THE TWO THAT EXIST FOR PEOPLE WITH NO HOUSEHOLD HERE, WHICH IS THE VISITOR HIMSELF.** A common store is a claim you hold by belonging to the place; a room for the sick is a bed for somebody who has no bed of their own. **The stranger who is asking about them is the one person in the settlement who can draw on neither.** So the sentence's own frame contains the reason it matters, and no shipped row reached for it. **What that looks like on the ground:** a traveller who falls ill here becomes the problem of whoever's roof he is under, and there is no door he can be taken to instead. Nothing in the record denies any of that; it is silence all the way down and it is the best plot hook in the pool.
- ⭐ **HE IS NOT GIVEN AN ADDRESS. HE IS GIVEN A NAME.** `hasHospital === false` denies the trade as well as the house (`priorityHelpers.js:64` greps `healer`), so there is nobody whose door has a reason to be known. **What a stranger would notice is that the answer to a public question here is a private one** — who to ask, not where to go — and that everyone answering assumes he already knows which house is which.
- ⭐ **EVERY ROOM IN THIS PLACE IS IN USE.** Both denied buildings are rooms whose value is that they stand ready and mostly empty. **A settlement of this size keeps nothing for a day that has not come** — which is the one observation that explains both halves of the key at once, reads as economy rather than as poverty, asserts no outcome, and is invisible to every floor. **It is also the honest thing a visitor sees before anyone tells him anything.**
- **WHAT HE IS EXPECTED TO HAVE BROUGHT.** The record says nothing about what a place with no reserve and no sick-house assumes of the people who arrive in it. A stranger who wants a bed, a meal or a poultice is asking a household for it, not an institution — **and a household may ask him what he has, may put him where there is room, may not want him under the roof at all**. All of that is licensed (W22 and W27 struck), costs no claim, and is precisely the concrete particularity the record's silence exists to be filled with.

### 3.9 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[visitor]`, or its slot set not `{settlement}` exactly once, or `{settlement}` promoted to the opener (order constraint 10 gives that position to vid 1), or fewer than four faces. Any face asserting what the settlement does or does not contain in the round rather than what the stranger is told (**F1-30**). Any face that loses either absence, because the pair is the key. Any face that sends him to a church, a temple, a shrine or a priest, or that denies him one. Any face that offers a warehouse, a yard or a store of another class as what he finds instead. Any face carrying a which-clause, an em dash, a digit, a count, a rate, a date, a duration, a forecast, an elapsed course, a minted proper name or a named keeper. Any face that spells the tier or the size. Any face that furnishes what he sees from the north-European exemplar pack. More than one face opening on the gap. A face that shares its first two words with a sibling (A11), or that merely re-spells the shipped clause four times.

---

## 4. THE POOL AT A GLANCE, for the writer about to start

| | vid 1 `[ledger]` | vid 2 `[street]` | vid 3 `[visitor]` |
|---|---|---|---|
| slots | `{settlement}` ×1, **opener** | ⛔ **none** | `{settlement}` ×1, **not the opener** |
| the fault to cure | *nobody to treat the sick* · *holds no food* · the forecast | *the town's* · the which-clause | *because there is neither* |
| the turn to keep | *against a bad year* | *count afterwards* · the two cases as one answer | *is directed to neither* · the sick-house as a BUILDING |
| the row most likely to fail it | **F1-11 / F1-23** (the church slice) | **F1-31** (the tier word) · **F3-05** | **F1-30** (the global absence) |

**THE THREE FACTS THE WHOLE POOL TURNS ON, in one place:**

1. ⭐⭐ **The faith flag is passed to the key and thrown away**, so `Clergy care` prints beside this sentence on a large part of the range. **Deny the HOUSE and the TRADE; never the CARE.**
2. ⭐⭐ **The catalogue makes this a small-place pool** — every thorp, every hamlet, most villages — so the tier word is live falsity and the reader's identity strip says so.
3. ⭐⭐ **The record denies a held RESERVE, not FOOD.** Storage months still print, the chains still run, and the Overview tab can read `Surplus`.

**Everything else the record is silent about, and that silence is the writer's.**

---

*Packet complete. Three variants marked, twelve faces owed. Status: DONE.*
