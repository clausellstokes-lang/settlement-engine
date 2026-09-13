# SKELETON — DS-DEF-2 · pool `Economic Survival: WEAK`

Seat: MARKER (opus), for the Fable chair. Written under ADDENDUM 14 (the owner, 2026-09-12): **a face is LAWFUL unless it CONTRADICTS the record; silence in the record is permission; "the card does not license it" is not a finding.**

**Variants: 3 shipped** (vids 1, 2, 3 — `[ledger]`, `[street]`, `[unfolding]`). Each is rewritten ONE FOR ONE into FOUR faces. Never trim (Part B §22).

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: WEAK'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Economic Survival: WEAK`)
  reads:      scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js) === WEAK
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading and NOT on a
              producer-token root, so every pool that selects a row of `ECONOMIC_ROW_POOL`
              shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `scoreBand(economicScore)` selects the row `WEAK` of
              `ECONOMIC_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course,
              a dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is
              null everywhere); a named character and that character's fate (product scope);
              a theological claim about a deity (the deity doctrine)
```

Four things on the card bind harder here than on the block's other pools:

1. **`source: (none) · SOURCE-UNRESOLVED`, and the census says why in as many words:** *"no mapping row resolves any field this pool reads"* (`docs/content/wiring-census.json`, rows[27]). The holder table's own docblock explains the silence — a token whose producers are scattered (`label`, `key`, `status`, `severity`, `band`) names no record holder, and a row for one *"would be an inference wearing a citation"* (`src/domain/prose/holderTable.js:155-162`). **So this pool has NO holder at all.** Not the treasury, not the muster, not the market. A face here that says *the books show*, *the roll says*, *the treasury's own count*, *by the reeve's reckoning* is refused by arm A13. This is the one bar on the packet that has no workaround: the alias-and-holder vocabulary that is free on the force rows is closed here.
2. **`bag` offers three slots and the call site fills ONE.** `defenseStateProse.js:622` builds `slots = { settlement: properFill(text(settlement?.name)) }` and nothing else. `{band}` and `{route}` are RESERVED and unfilled at this block. A face may use `{settlement}` or no slot; it may not reach for `{band}` or `{route}`.
3. **`echo`: one spine mount, on the defense tab, and the echo key is the WHOLE table rung** — so all four `Economic Survival` pools (`STRONG` · `ADEQUATE` · `WEAK` · `CRITICAL`) share one echo key. A sibling BAND's wording counts against this one in the echo table.
4. **`angle: ledger street unfolding` is the card's alphabetical print; the CORPUS ORDER is ledger (vid 1), street (vid 2), unfolding (vid 3).** Rewrite one for one against the vids below; vid 1 stays canonical at index zero.

### 0.2 The block's header lines (annex `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2593`, the parts that bind this pool)

- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat`, the institution presence flags and `compound.inst`. **This row is the only one of the five keyed on a BAND rather than on booleans.**
- **SLOTS:** `{settlement}` `{band}` `{route}` · **SECTION-TARGET:** `defense` · **PDF PARITY:** parity (`viewModel.js` defense slice).
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` · rendered `src/components/new/tabs/DefenseTab.jsx:150-183`.
- **PROVENANCE + FENCE, verbatim force:** *"Institution presence is a STANDING fact with no recorded history; the causal clauses here are capability clauses (walls without people cannot be held) and never historical ones (walls built after a siege) unless the history surface supplies the ancestry."* The fence is written about institutions; **it binds this pool the same way and harder**, because a BAND is a snapshot of a number and carries even less history than a roster row does.
- The block's stated JOB for the corpus here: *"each branch currently holds exactly ONE string, so every settlement in a given branch says the same words."* This pool's one shipped branch string is `threatAssessment.js:171`.

### 0.3 The register card's six one-line registers (the DOSSIER line is this pool's)

- **The dossier:** the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing.

The dossier line's tail — **the town's name is not the default opener** — bites this pool immediately: two of the three shipped variants open on `{settlement}` or on a phrase with `{settlement}` in its second word. R-DA-17 caps the settlement token at ONE opener per pool and T-F8 refuses a sentence face that opens on a `proper`-typed slot outright.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, **so every face must stand alone.** The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source — **and here it licenses none.**

⚠ **The no-digit wall bites this pool harder than any other in the block.** Everything underneath the band is a NUMBER — months of storage, a percentage gate, a score between twenty and forty. None of it may reach the page as a figure, and R-DA-11's figure policy means a comparison is a measurement in words.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** The five threat rows render as ONE italic block of paragraphs, the first at a larger size (`DefenseTab.jsx:317-321`). The order is fixed in code — `['beasts','invasion','internal','economic','disaster']` (`DefenseTab.jsx:113-114`) — and nulls are filtered. `invasionRowPoolKey` and `internalRowPoolKey` are both TOTAL, so **this row is NEVER the opening paragraph; it is the third or the fourth of five, and the paragraph immediately above it is always an `Internal Security` row and the paragraph immediately below it is always a `Disasters & Famine` row.** See §0.7 — that fact is the sharpest hazard in this packet, because both neighbours are almost perfectly determined on this pool's dominant range.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Never trade density for plainness.

**THE CEILING, NOT THE MIDDLE (Part B §21.1).** The band is a licence, not a target. Measure against the best exemplar face, never the average.

### 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

The predicate is one table lookup on one band word (`src/domain/display/stateProse/defenseStateProse.js:529-543`):

```
const ECONOMIC_ROW_POOL = Object.freeze({
  STRONG: 'Economic Survival: STRONG',
  ADEQUATE: 'Economic Survival: ADEQUATE',
  WEAK: 'Economic Survival: WEAK',
  CRITICAL: 'Economic Survival: CRITICAL',
});
export function economicRowPoolKey(economicScore) {
  if (typeof economicScore !== 'number' || !Number.isFinite(economicScore)) return null;
  return ECONOMIC_ROW_POOL[scoreBand(economicScore)] || null;
}
```

and the caller hands it one field (`defenseStateProse.js:663`): `economic: rung(economicRowPoolKey(dp.scores?.economic))`.

**The ladder is exact** (`src/domain/display/defenseScoreBands.js:38-39`): `n >= 65 ? 'STRONG' : n >= 40 ? 'ADEQUATE' : n >= 20 ? 'WEAK' : 'CRITICAL'`. So **WEAK is the closed interval twenty up to but not including forty**, and the module's own docblock calls the four *"the frozen four; never extend"*.

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `defenseProfile.scores.economic` ∈ [20, 40) | the third rung of four on the one 0-100 defence-score ladder the PDF and every tab already print | **NONE — SOURCE-UNRESOLVED** | the BAND WORD and nothing else: the town's crisis-funding capacity is in the third rung. That is one fact, and the whole of what the key reads | it is a GENERATION-TIME number. `foodStockpile.js:473` is the only world-pulse write into `defenseProfile.scores`, and it writes `disaster` alone — **`scores.economic` is never re-judged** |

**What that number is MADE of, which is causal background a writer must understand and may not assert** (`src/generators/defenseGenerator.js:257-290, :350-424`, then `:600-625`). The dimension is documented in the generator's own header as *"economic — logistical resilience (food, medicine, trade access)"*:

- **storage months is the primary driver.** `storageScore` runs 0 at no months, ten at one month, twenty-five at three, forty-five at six, capped at seventy (`:266-268`). `storageMonths` comes from the food ledger, and its base is **1.5 months for a thorp or hamlet with no granary, 1.0 for a village with no granary**, against 2.5/3.5/5/7/12 where a granary, city granary or state granary stands (`src/generators/foodGenerator.js:160-165`); a mill multiplies it by a quarter again.
- **flat institution and route adders:** market +10, hospital +10, a maritime port +10, a crossroads +8 (`:271-277`), plus `round(econOutput × 0.2)` and +8 for alchemy beside a granary.
- **then the ECONOMIC-HEALTH GATE, which is this row's own funding note.** `econHealthMult = min(1, 0.45 + econOutput/50 × 0.55)`, identity at `econOutput ≥ 50`, **floored at 0.45 and never zero** — the generator's comment says why: *"physical grain in a granary retains value even when the treasury is empty — never zero it"* (`:283-290`).
- **then stress penalties, all of them subtractive and all floored at zero:** under siege (mitigable), famine −20, plague onset −15, indebted −15 (`:350-424`), and a food-processing chain bonus of +5 healthy or −8 impaired (`:603-606`).

**THE FOUR READS THIS POOL DOES NOT REACH, listed so the writer knows the page around the sentence:**

- **No institution, anywhere.** Unlike the block's four other rows, this key reads NO roster, NO bucket, NO `compound.inst` flag. It does not know whether the town has a wall, a garrison, a militia, a watch, a granary, a market, a hospital, a court or a gaol. **Everything institutional in a face here is an inference from a number.**
- **`config.monsterThreat` is not read.** This row prints on a plagued country, a frontier and a heartland alike.
- **`config.stressTypes` is read by NO key function of this block** — and this is the row where that bites hardest, because famine, plague onset, siege and debt are each an INPUT to the number the key reads. The score already carries the stress; the key cannot see which one.
- **`economicGates` is not read.** The funding note printed directly beneath this row — `READINESS_GATE_FOR['Economic Survival'] = ['economic', 'crisis logistics']`, rendered as *"Upkeep underfunded: crisis logistics at NN%"* whenever the gate sits below one (`src/domain/display/defenseDisplay.js:278-284, :317-321`) — is a SIBLING SURFACE, not a read.

**⭐ THE ONE CLOCK, AND IT IS THIS POOL'S SINGULAR ADVANTAGE.** The force rows of this block have a famous defect: their key reads the LIVE ruin-filtered roster while their badge is frozen at generation, so the sentence moves and the bar does not. **Here the key and the badge read the same frozen field**, so this row can never disagree with its own bar. The cost of that is the other half of the same fact: **the sentence never moves either.** Whatever happens to the town in play — a famine, a blockade, a granary burned — this paragraph says what it said at the first survey. A face must be true of the town on the day of the survey and must not be made absurd by a banner printed above it later.

### 0.6 The provenance move, priced for this pool

**Zero. Not budgeted, not rationed — barred.** The card's `source` line is `(none) · standing SOURCE-UNRESOLVED`, and its own note says a face naming a record holder here is refused by arm A13. The exemplar registers with raw text cite at zero per 786 sentences (Part B §24), so zero is also the norm and not a deprivation.

⚠ **The distinction that matters, because it is easy to lose:** *record VOCABULARY* is free — a `[ledger]` face may be written in the idiom of an office compiling an entry. What is barred is *attribution*: naming the keeper of the record the fact comes from. "The reckoning is thin" is vocabulary. "The treasury's reckoning is thin" is a citation, and there is no treasury row behind it on this key.

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE — the two paragraphs that always touch this one, and they are nearly determined

The threat rows render in a fixed order and this row is never first. Its neighbours, measured over the census's 768-town RATE sample (`docs/content/wiring-census.json`, `rate.rows`), are these:

| tier | this pool fires | the `Internal Security` row ABOVE | the `Disasters & Famine` row BELOW |
|---|---|---|---|
| thorp | **82.81 %** | `no legal infrastructure` — **100 %** | `NO reserves, NO medical provision` — **100 %** |
| hamlet | **74.22 %** | `no legal infrastructure` — **100 %** | `NO reserves, NO medical provision` — **100 %** |
| village | **42.97 %** | `no legal infrastructure` — **100 %** | `NO reserves, NO medical provision` — **75.78 %** |
| town | 0.78 % | `full legal chain` 73.44 % / `court without detention` 26.56 % | `granary AND hospital` 74.22 % / `granary AND parish care` 25.78 % |
| city | 1.56 % | `full legal chain` 71.88 % / `court without detention` 26.56 % (remainder elsewhere) | `granary AND hospital` 53.13 % / `granary AND parish care` 46.88 % |
| metropolis | 0 % | — | — |

**Read that table twice. On this pool's overwhelming range the paragraph immediately BELOW this one already says there is no food put by.** Its three shipped faces are: *"{settlement} holds no food against a bad year and has nobody to treat the sick…"*; *"The town's answer to a bad season is the same as its answer to a sickness, which is to endure it and count afterwards."*; *"A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither."*

And the paragraph immediately ABOVE says there is no law: *"There is no legal machinery at {settlement}; order here rests on force alone…"*; *"The town settles things itself, quickly, and does not always settle them well."*; *"A stranger wronged at {settlement} discovers there is nowhere to take it…"*

**The consequence for the writer, stated as a rule: the stores belong to the paragraph below.** This pool's score IS food-storage-driven — that is the ruling's own engine meaning — and a face that reaches for the granary, the store, the grain, the bad year or the failed harvest is writing the next paragraph two inches early, in a block the reader reads as one passage. The DISCRIMINATING claim of THIS row is not what is in the store. It is **what the town can MOUNT when something happens: the capacity to pay for a response, to keep something in the field, to buy its way through.** The row below is the larder; this row is the purse for the emergency.

**A third collision, one mount down the same tab.** DS-DEF-6's `Logistics & Supply` prints on this page from the granary and the route (`defenseStateProse.js:1528-1532`), and its `No reserves, landlocked` face reads *"{settlement} is one interrupted week from a genuine crisis and has been for as long as anybody has bothered to check."* That row owns the supply line and the endurance clock. This row must not own them too.

**The funding note is directly beneath this row and it is on this row's own side.** `Upkeep underfunded: crisis logistics at NN%` fires whenever `econHealthMult < 1` — which is whenever `econOutput < 50`, a very large share of this pool's range. **That phrase — crisis logistics — is the estate's own name for what this row is about, and it is printed inches away.** A face may live in that idiom freely; it may not quote the percentage and must not become a gloss on the note.

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into

The block's contradiction set is `rewrite/rulings-DEF2-v14.txt`. The rows below are the ones a WEAK face can actually reach, each with its field.

| the claim that would be false | the field that denies it, and which of the two is the record |
|---|---|
| **the band read as WEALTH or POVERTY** — "a poor town", "the town is broke", "there is no money here", "a prosperous place fallen off" | the rulings' own engine meaning, verbatim: **"the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity."** `defenseGenerator.js:257-290` is the record: `storageScore` reaches seventy and the whole wealth term is `round(econOutput × 0.2)` plus a multiplier floored at 0.45. **A well-off market town with nothing put by lands here, and a modest hamlet with a full loft does not.** The band is the town's capacity to carry and fund a crisis, never its purse |
| **A WAGE RELATION — "the pay is irregular", "they are already owed", "the wages are late", "nobody has been paid"** | `defenseProfile.economicGates.military` is the wage gate, and it EXISTS ONLY where `hasAnyDefense` is true — walls, garrison, militia, watch, mercenary or charter hall (`defenseGenerator.js:177-178`, emitted at `:468`). **This key reads no institution at all**, so it fires freely on towns where nothing is on a wage and nobody is owed anything. It is also the WRONG GATE: this row's gate is `economic` / *crisis logistics*, not `military` / *garrison pay* (`defenseDisplay.js:278-284`). ⚠ **This is the single largest fault in the shipped pool — two of the three variants are built on it** |
| **ARREARS or a DEBT — "already owed", "in arrears", "the town owes"** | the rulings' PAY GATE row: *"the shortfall is bounded and never total."* Both multipliers are floored — the military gate at 0.6 (`:189`) and the economic gate at 0.45 (`:289`) — and the generator's comment says *"built walls keep standing and unpaid soldiers desert slowly, never instantly."* A shortfall is short, thin or late; it is never nothing and never a debt. The `indebted` STRESS is a real field (`:421-424`) and **this key does not read `config.stressTypes`**, so a face may not assume it |
| **MORALE, resentment, memory, grievance — "they have not forgotten it", "morale suffers", "the men are sullen"** | **there is no morale field on `defenseProfile` anywhere.** The word appears in the estate only inside code comments and inside the legacy engine string this pool replaces (`threatAssessment.js:171`). FLOOR-2 on an unobserved field, and MOVE-GRAMMAR §1.3 names FEELING a non-move: *no field carries motive, belief or mood; the reaction is an ACT* |
| **an ELAPSED COURSE — "chronic rather than sudden", "each season", "has been so for years", "is getting worse"** | FLOOR-2b, and there is **no time term anywhere in the derivation**: `economic` is a pure function of storage, institutions, route, `econOutput` and the active stress list, computed once and never re-judged (`foodStockpile.js:473` writes `disaster` alone). A band is a snapshot. The fence of this very block: a standing configuration licenses a capability clause, never a historical one |
| **a RATE or a TREND — "removes a little more each season", "declining", "spending down"** | the same field and the same line. There is no decrement, no accumulator, no per-tick term. This is a magnitude AND an elapsed course at once |
| **a PREDICTION the pulse adjudicates — "will exhaust", "will collapse", "cannot survive", "exactly when it matters"** | FLOOR-2b and A2 (state never fate). ⚠ The legacy engine string this pool replaces is itself built on one — *"A sustained crisis **will** exhaust reserves and undermine garrison morale"* (`threatAssessment.js:171`) — so the future indicative is the inherited habit of this exact branch. The lawful form is the CAPABILITY clause and the subjunctive edge |
| **a MAGNITUDE outside the band word — "months", "weeks", "a season's worth", "half of what it needs", "barely a third"** | FLOOR-2a. The band word is the whole of the read. Every number under it is real and none of it is reached: `storageMonths`, `econOutput`, `econHealthMult`, the score itself |
| **a claim about the STORES, the GRANARY, the HARVEST or the LARDER** | not contradicted by a field — but see §0.7: `Disasters & Famine` is the next paragraph and owns it on 100 % of this pool's thorps and hamlets, and DS-DEF-6's logistics row owns the supply line one mount down. **The record's silence permits it; the page refuses it.** This is a PAGE row, not a field row, and it is the one the refuters will name |
| **naming an INSTITUTION — the garrison, the watch, the militia, the treasury, the granary, the court, the guard** | the alias contradictions of the block's set: *"the garrison"* only where a Garrison row resolves (city tier); *"the watch"* as a name only on a resolved watch row; *"the militia"* only where the militia row resolves; *"the guard"* is the power generator's FALLBACK label on a town whose safety profile prints *"There is no meaningful guard presence."* **This key resolves NONE of them**, and on its dominant range (thorp, hamlet) most do not exist at all. Safe collective nouns that assert no roster row: **the town**, **the town's own people**, **the community**, **the place**, **what the town has in hand** |
| **a TOTALITY OVER PERSONS — "everybody here", "nobody in the town", "every household", "all of them know it"** | the REFUSED COLUMNS line of the card. ⚠ The shipped `[street]` variants of the sibling BANDS all reach for it (*"the people who would have to be paid know it"*, *"everybody here can estimate it"*), so the pool's own neighbourhood invites the step |
| **an EXEMPTION from a duty** | `whoIsExempt` is null everywhere (CLERK-LAWS §1.2). Never assert that anyone is spared a levy, a call or a contribution |
| **a DATED CAUSE or a SEASON — "since the bad winter", "after the harvest failed", "three summers of it"** | FLOOR-2b. No event-provenance field reaches this key; no history surface supplies an ancestry here |
| **EXPLAINING or OUTRUNNING the BADGE beside the prose** | the badge is `scores.economic` read through `scoreBand` — **literally this pool's own key**. So a face that names the band word is not wrong, it is REDUNDANT: the reader sees `WEAK` in the badge and the percentage in the funding note. The face's job is the reading, not the rating |
| **a minted PROPER NAME** — a person, a family, an inn, a lane, a road | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **reading `plagued` as disease or `settled` as "no live threat"** | the engine meanings. This key does not read the country at all, so neither word belongs in a face here in any reading |
| **the four shipped clauses of this BLOCK that are still false** — *"substantial works"*, *"how relaxed the people on it are"*, *"takes this town with ladders"*, *"clergy who tend the sick"* — must not be carried forward in any form | the block's set names all four. None sits in THIS pool, but the last two are on the `Disasters & Famine` row a paragraph below and the vocabulary is adjacent |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these rosters do not carry may not be asserted: the **live institution roster** (`institutionRoster.js`, `liveInstitutions` — ruin-filtered); the **seven defence buckets** `walls` · `garrison` · `militia` · `watch` · `mercenary` · `charter` · `magicDef` (`defenseInstitutionBuckets.js:83-110`); the **`compound.inst` civic flags** `hasGranary` · `hasMarket` · `hasHospital` · `hasChurch` · `hasCourtSystem` · `hasPrison`; the faction list; the faith entries; the NPC office roster. **This pool reads none of them**, which is precisely why it must assert none of them. Everything else is silence, and silence is permission.

**Not a faith pool.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the suppressed flag beside it do not arise here and no face may reach for any of them.

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

**`Economic Survival: WEAK` fires on every settlement whose `defenseProfile.scores.economic` fell between twenty and forty at generation, and on nothing else about the town.** Measured over the census's balanced 768-town sample (`wiring-census.json`, `rate.rows`): **259 towns, 33.72 % of the sample** (95 % interval 30.47 % to 37.14 %), 32.81 % under the wizard-default weighting. It is the second most common of the four bands.

**⭐ IT IS A SMALL-SETTLEMENT POOL, and this is the fact that should shape every face:**

| tier | towns | rate |
|---|---|---|
| thorp | 106 of 128 | **82.81 %** |
| hamlet | 95 of 128 | **74.22 %** |
| village | 55 of 128 | **42.97 %** |
| town | **1** of 128 | 0.78 % |
| city | **2** of 128 | 1.56 % |
| metropolis | **0** of 128 | 0 % |

The reason is structural and is worth stating plainly: `Town granary` is `required: true, baseChance: 1` at town tier (`institutionalCatalog.js:925-930`) and there is **no granary row at all below town**, so `storageMonths` falls to its bare base of 1.5 months at thorp and hamlet and 1.0 at village (`foodGenerator.js:160-165`). Market and hospital are likewise town-plus adders. **So the WEAK band is very nearly the shape of a small settlement, and STRONG is very nearly the shape of a large one** (STRONG fires on 81 % of towns, 90 % of cities and 95 % of metropolises, and on ZERO thorps, hamlets or villages).

The consequences a face must survive:

- **The town in this pool is usually a thorp or a hamlet.** No wall. No garrison. No court. No gaol. No granary. No market square. No hospital. Often no watch. **A face written for a walled town with a paid force is wrong about four settlements in five here.**
- **But it is not ONLY that.** Three of the 259 are a town and two cities, and they got here the hard way — a famine, a plague onset, a blockade, a debt, an impaired food-processing chain, or a ruined granary. **On those three the neighbours flip completely**: the paragraph above becomes a full legal chain and the paragraph below becomes a granary and a hospital. A face that says *"nothing here is arranged for it"* is false of those towns, and they are the record too.
- **CRITICAL is only just below.** The ladder's WEAK floor is twenty and CRITICAL sits beneath it; the legacy engine string for this branch fired at twenty-five, so **the pool as now keyed has absorbed the slice from twenty to twenty-five that the shipped prose called "cannot support crisis response."** A face must be true at the bottom of the band as well as the top.
- **ADEQUATE is just above at forty,** and its shipped faces already own *"can fund a short crisis"* and *"a long one begins eating reserves within a few months."* A WEAK face must be distinguishable from that by more than an adverb.
- **Every country tier.** `config.monsterThreat` is not read. Plagued, frontier and heartland all print this row.
- **Every stress state, and the stress is INSIDE the number.** A famine town, a besieged town, a plague-onset town and an indebted town all reach this pool, each rendering its own banner on the same dossier — and the score already carries the penalty. **A face about a town that has never been tested is absurd under an ACTIVE FAMINE banner, and the famine is the record.**
- **Every route, terrain, culture, prosperity rung and population band**, none of which the key reads.
- **One clock only, and it is frozen.** The key and the badge read the same generation-time number, and no world-pulse path rewrites it. The sentence is true of the first survey and stays on the page forever.

A face must contradict no state in that range, not merely the town on this skeleton.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> Chronic shortfall at {settlement} limits what the town can do in an emergency before the emergency starts; the pay is irregular, and irregular pay shows up as morale exactly when it matters.

### 1.2 Every claim it makes, on the new test

- **There is a SHORTFALL — the town's capacity to meet a crisis falls short of what a crisis would ask.** — **SAFE**, and it is the band word said in the record's own terms. `scores.economic` in the third rung of four is exactly a deficiency of crisis capacity, and the funding note printed beneath this very row names the expense: *crisis logistics* (`defenseDisplay.js:282`).
- **The shortfall is CHRONIC.** — **FLOOR-2 (an elapsed course).** Read as *standing*, it is the same fact as the band and adds nothing; read as *long-established*, it asserts a duration no field holds. There is no time term in the derivation and the score is never re-judged. ⚠ The word carries the second reading by default and vid 3 makes the second reading explicit, so the pool asserts it twice.
- **The shortfall LIMITS WHAT THE TOWN CAN DO IN AN EMERGENCY.** — **SAFE**, and this is the variant's strongest claim and the one worth keeping. It is a capability clause in the present, which is exactly the form this block's fence asks for, and the generator's own comment states it almost word for word: *"a struggling economy cannot fund crisis logistics"* (`defenseGenerator.js:281-282`).
- **The limit is in place BEFORE THE EMERGENCY STARTS.** — **SAFE and excellent.** It is the standing-fact reading made explicit, it forecloses the future indicative, and it distinguishes this row from every event-driven row on the tab. Worth carrying.
- **THE PAY IS IRREGULAR — a wage relation exists, and its payments are intermittent.** — **CONTRADICTED.** `defenseProfile.economicGates.military` is the wage gate and it is EMITTED ONLY where `hasAnyDefense` is true, that is where a walls, garrison, militia, watch, mercenary or charter-hall row resolves (`src/generators/defenseGenerator.js:177-178`, emitted `:468`). **This key reads no institution**, and on 83 % of its thorps and 74 % of its hamlets nothing is on a wage at all — there is no purse, no wage roll and no payment to be irregular. **The roster is the record.** Two further denials stack on it: this row's gate is `economic` / *crisis logistics*, not `military` / *garrison pay* (`defenseDisplay.js:278-284`), so the clause reaches across to another row's instrument; and the rulings' PAY GATE row says *"the shortfall is bounded and never total"* — the military multiplier is floored at 0.6 and the generator's comment reads *"unpaid soldiers desert slowly, never instantly"* — so even where a wage exists, *irregular* asserts a gap in payment that the model does not produce.
- **IRREGULAR PAY SHOWS UP AS MORALE.** — **FLOOR-2 (a dependence on an unobserved field).** There is **no morale field on `defenseProfile` anywhere in the estate**; the word survives only inside code comments and inside the legacy engine string this pool replaces (`threatAssessment.js:171`). MOVE-GRAMMAR §1.3 names FEELING a non-move outright: *no field carries motive, belief or mood; the reaction is an ACT.*
- **EXACTLY WHEN IT MATTERS — the deficiency will manifest at the moment of crisis.** — **FLOOR-2 (a prediction the pulse adjudicates).** It is a claim about the timing of an unrealised event, and A2 is a wall: state never fate.
- **Implicitly: the town has DEFENDERS ON A WAGE.** — **CONTRADICTED** on the same field as the pay clause. The face does not name them and still asserts them.
- **Implicitly: the shortfall is the TOWN'S OWN, a fact of its treasury.** — the face does not assert it outright, and it must not. The rulings' engine meaning is flat: *"the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity."* **A rewrite that makes the shortfall a shortfall of MONEY crosses into a contradiction the shipped line only flirts with.**

**⛔ THE VARIANT'S STRUCTURAL PROBLEM, stated once.** Three of its eight claims fail, and the two failing hardest are the whole of its second clause. The sentence is built as *standing limit → SEMICOLON → the pay* , and the pay half cannot be repaired by wording: there is no wage on this key. **The rewrite must find a second fact somewhere other than the purse.** It has one ready to hand and the shipped line already contains it: the limit is in place *before the emergency starts*, which is a standing fact of a varied kind and is the lawful companion the semicolon was reaching for.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `scoreBand(scores.economic) === 'WEAK'` — the third rung of four on the frozen ladder, `[20, 40)`. **One fact, and the whole of the read.**
- The estate's own name for what the rung measures, free as vocabulary because it is printed inches below the sentence: **crisis logistics** (`defenseDisplay.js:282`), and the generator's own gloss, **logistical resilience — food, medicine, trade access** (`defenseGenerator.js:59`).
- The generator's own statement of the mechanism, available as a READING and not as a figure: *a struggling economy cannot fund crisis logistics*; the capacity is *almost entirely wealth-independent* in its stack and then *gated* by the economy's health; the gate is *never zeroed*.
- REACHED BY THE ENGINE AND NOT BY THE KEY, and therefore the writer's boundary: every institution, every roster, every civic flag, the country, every stress on the page, the storage months, the funding percentage, the score itself.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

Every row of §0.8 is reachable from this variant. The five it walks into most easily:

| row | why this variant, specifically |
|---|---|
| **the wage relation** | it is the shipped second clause. Any rewrite that keeps *pay*, *wages*, *the purse*, *what is owed*, *arrears* or *retainer* re-commits the fault. **There is no wage on this key** |
| **morale** | likewise shipped, and likewise unfielded. The lawful substitute is not a milder feeling word; it is an ACT or a standing condition |
| **the prediction** | *exactly when it matters* is a forecast wearing a qualifier. The lawful edge is subjunctive — what a crisis *would* find — never what will happen |
| **the band read as poverty** | *shortfall* is one step from *the town is poor*, and the `[ledger]` angle's clerkly idiom pulls toward the treasury. Keep the shortfall attached to the CAPACITY, never to the coin |
| **the stores** | ⚠ the trap that is invisible from inside the sentence. The paragraph below already says the town holds no food against a bad year, on 100 % of this pool's thorps and hamlets. A rewrite that reaches for the granary or the bad harvest is writing that paragraph early |

### 1.5 The preimage, as it bites vid 1

See §0.9 whole. For this variant specifically: the face prints on a thorp with no institution of any kind and on a besieged city with a full legal chain and a state granary, with the same words. **"Limits what the town can do in an emergency before the emergency starts" survives both** — which is why that clause is the sound half of the shipped sentence and the one the rewrite should build four faces around. The second clause survives neither.

### 1.6 The angle's stance in one sentence

`[ledger]` is the clerk's view — what the entries, the dockets and the arithmetic show — so here it may set down the standing limit on what the town could mount against a crisis as one plain fact of the record, and may give it a companion fact of a different kind in its own sentence; and it may NOT name the keeper of any book, price the shortfall, date it, chart its course, assert a wage or a debt, read the rung as the town's wealth, borrow the larder from the paragraph below, or restate the badge the reader can already see.

### 1.7 The turns worth keeping

- **"limits what the town can do in an emergency"** — the capability clause, in the present, attached to the right object. This is the pool's whole licensed claim and it is already well said. Keep the MOVE in all four faces; vary the verb, the object noun and the rhythm. The nouns available and unspent: what the town could *mount*, *raise*, *put in the field*, *carry*, *stand up*, *keep going*, *answer with*.
- **"before the emergency starts"** — the sharpest thing in the shipped pool and the one clause that does the most work for the least licence. It converts a rating into a standing condition and it forecloses the forecast at the same time. Worth carrying near-verbatim into ONE face and finding three other shapes of the same move for the rest.
- **the semicolon's ARCHITECTURE** — a standing limit, then a second standing fact of a different kind. The architecture is lawful (S2 permits one computed consequence to ride as a clause; R-DA-03 permits a qualification as its own sentence). Keep it and change what sits on the right of the joint.
- **What to drop entirely:** *the pay is irregular* · *irregular pay* · *morale* · *exactly when it matters* · *chronic* in its duration reading. That is the majority of the shipped sentence's second half, and it leaves.

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. A face that opens on the `{settlement}` proper slot (T-F8) — and note the shipped line opens two words before it, which is lawful but makes the settlement token this pool's opener; R-DA-17 caps that at ONE variant per pool, so vid 2 and vid 3 must not do it too. A face carrying a which-tail, an em dash, a digit, a percent, a third sentence, or a summarising second sentence that says what the first one MEANT. Any face that keeps a wage, a debt, a morale or a forecast. Any face that becomes a sentence about food — that is the paragraph below.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **This is the only row of the five whose subject is a CAPACITY rather than a THING, and no shipped row has used that.** The other four rows point at objects a clerk could walk to — a wall, a muster, a gaol, a granary. This one points at something that has no address: what the town could put behind a decision if it had to make one. **A clerk compiling this entry has nothing to visit.** The entry is a conclusion drawn from everything else in the book and from no single page of it, and that is a genuine, concrete, particular shape for a `[ledger]` face — a line in a record that rests on the whole record and cites nothing.
- **The estate's own phrase for the thing is sitting on the page, unused: `crisis logistics`.** Not money, not grain — *logistics*: carts, carriage, the getting of things to where the trouble is, the paying of people to stop their own work and do something else. The generator's comment lists them for the sibling gates in plain words — *relief purchases, granary logistics, work crews* (`defenseGenerator.js:608-611`). **Work crews.** None of that has ever reached this prose, and none of it is the granary.
- **What a stranger would notice, and what is free to say:** that the town is not arranged to DO anything sudden. Not that it is poor — many of these places are perfectly comfortable in an ordinary month — but that everything it has is committed to the ordinary month. There is no slack. Nothing is set aside for a purpose not yet named. The record holds this as a rung on a ladder; on the ground it is the difference between a place that could stop what it is doing and a place that could not.
- **What somebody would complain about, and it is on the record's own side:** the gate is *never zeroed* and the shortfall is *bounded* — so the honest complaint is not that nothing can be done but that **whatever is done comes out of something else.** The town can answer one thing at a time. That is a standing condition, it is true at the bottom of the band and at the top, it is true of the thorp and of the besieged city, and no shipped row in the block has said it.

---

## VARIANT 2 · vid 2 · `[street]` · slots `{settlement}`

### 2.1 The shipped sentence, verbatim

> The people who would have to hold {settlement} through something are already owed, and they have not forgotten it.

### 2.2 Every claim it makes, on the new test

- **There ARE people who would have to hold the town through a crisis.** — **SAFE in its subjunctive reading, CONTRADICTED in its institutional one.** As *whoever would have to carry the town through it* — the townspeople — nothing denies it; every settlement has inhabitants and the read is silent about them. But the sentence's second clause converts it: people who are *owed* are people on a wage, and `economicGates.military` — the only wage gate in the model — is emitted ONLY where `hasAnyDefense` resolves (`defenseGenerator.js:177-178`, `:468`). **This key reads no roster**, and on its dominant range there is no paid body to be the referent.
- **They are ALREADY OWED — the town is in arrears to them.** — **CONTRADICTED**, on two fields. (a) The wage gate does not exist where nothing is on a wage, which is most of this pool's range. (b) Where it does exist it is a MULTIPLIER floored at 0.6, not a ledger of arrears (`:189`), and the rulings' PAY GATE row is explicit: *"the shortfall is bounded and never total."* The model produces an underfunded stack, never an unpaid one and never a debt to a person. The `indebted` STRESS is the estate's only debt field (`:421-424`) and **no key function of this block reads `config.stressTypes`.**
- **"ALREADY" — the arrears predate the reading.** — **FLOOR-2 (an elapsed course).** There is no time term in the derivation and no event provenance reaches this key.
- **THEY HAVE NOT FORGOTTEN IT — a collective memory and an implied grievance.** — **FLOOR-2 (a dependence on an unobserved field), and a non-move.** No field carries memory, mood or grievance; MOVE-GRAMMAR §1.3 refuses FEELING outright and R-DA-14's *seen, not meant* refuses the interior. ⚠ It is also a hair from **a totality over persons** — *they* is unbounded — which is a REFUSED COLUMN, not a floor.
- **Implicitly: a crisis is a thing that would be HELD THROUGH, by bodies, in the manner of a siege.** — **SAFE but badly aimed.** Nothing denies it; but *hold through* is the `Invasion & War` row's verb and that row is one or two paragraphs above on every render. The claim this row owns is FUNDING a response, not manning one.
- **Implicitly: the shortfall is a shortfall of COIN.** — **CONTRADICTED if written any plainer.** The rulings' engine meaning: *"the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity."* The shipped line is already leaning on the treasury and the record does not hold one here.

**⛔ THE VARIANT'S STRUCTURAL PROBLEM, stated once.** This is the weakest of the three. **Both of its clauses fail**: the first asserts a paid body the key cannot resolve, the second asserts a feeling the estate does not model. Nothing in it survives as a claim. What survives is a POSTURE — the `[street]` angle's habit of saying the thing from inside the town, in the town's flat idiom, about what the arrangement means for the people in it. **The rewrite of vid 2 is a fresh sentence on a lawful claim, wearing the shipped variant's stance.** Its slot set and its angle are pinned; its content is not.

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

- `scoreBand(scores.economic) === 'WEAK'` — the one read, the third rung of four.
- The `[street]` licence: what the town knows about itself without being asked. The band is a fact about what the town could mount, and **a town knows its own slack better than it knows anything on this tab** — nobody has to be told whether their place could drop everything and answer something.
- The safe collective nouns, which assert no roster row: **the town**, **the town's own people**, **the community**, **the place**, **whoever would have to do it**, **what the town has in hand**.
- REACHED BY THE ENGINE AND NOT BY THE KEY: every institution, every wage, every stress, the stores, the country, the score.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

| row | why this variant, specifically |
|---|---|
| **the wage relation and the arrears** | the shipped sentence IS the fault. No rewrite may keep *owed*, *owing*, *pay*, *wages*, *purse*, *arrears*, *what is due*, *settling up* |
| **the interior and the grievance** | *have not forgotten* is the shipped close. The `[street]` angle wants the town's own knowingness, and the lawful form of that is what the town DOES or what the town would FIND, never what it feels or remembers |
| **the totality over persons** | ⚠ the sharpest trap for THIS angle. The sibling bands' `[street]` faces all reach for it — *"the people who would have to be paid know it"* (STRONG), *"the people who would have to be paid know it"* (CRITICAL) — so the neighbourhood teaches the move. **A face here must speak of the town, never of everybody in it** |
| **naming an institution** | *hold {settlement}* invites a garrison, a watch, a militia. None resolves on this key and most do not exist at this tier |
| **the stores** | the paragraph below owns them on 100 % of thorps and hamlets. `[street]` is the angle most likely to reach for the larder, because that is what a townsperson would talk about |
| **the band as poverty** | the plainest `[street]` wording of a shortfall is *there is no money*, and that is the contradiction the rulings name by name |

### 2.5 The preimage, as it bites vid 2

The `[street]` angle asserts a shared local understanding, and this pool's range makes that cheap in one direction and dangerous in the other. Cheap: on a thorp of a few households, whatever the town knows it knows in common, and no face need reach for a totality to say so. Dangerous: the same face prints on the two cities and the one town in the sample, where *the town knows* means something quite different and where the neighbours flip to a full legal chain and a granary. **A face built on smallness is false of three settlements in 259; a face built on the CONDITION rather than the size is true of all of them.**

### 2.6 The angle's stance in one sentence

`[street]` is what the town knows about itself without being asked — so here it may say plainly, in the town's own flat idiom, what the limit on answering a crisis actually means for the place and what it costs the place to answer anything; and it may NOT count, date, price, name a wage or a debt, seat an institution the key does not resolve, quantify over the people, report a mood or a memory, borrow the granary from the paragraph below, or turn its plainness into a verdict on the town.

### 2.7 The turns worth keeping

- **"through something"** — the unnamed crisis, hedged into indefiniteness. This is genuinely good and genuinely lawful: the key does not know which pressure the town will meet, so naming none is the honest form, and it survives the whole preimage. **Worth carrying near-verbatim into one face.**
- **The stance itself** — the town's own knowledge about its own arrangement, stated flat, with nothing explained. Keep the stance; replace the claim.
- **What to drop entirely:** *are already owed* · *they have not forgotten it* · *the people who would have to hold* in its manned reading. That is the whole of the shipped content.

### 2.8 What would make the rewrite of vid 2 a regression

Vid 2 not second, or not `[street]`, or its slot set not `{settlement}` alone, or fewer than four faces. A face opening on the `{settlement}` proper slot, or opening the pool's settlement token a second time (R-DA-17 caps it at one variant per pool and vid 1 already spends it). A face carrying a which-tail, an em dash, a digit, a percent, or a third sentence. Any face that keeps the wage, the debt or the memory. Any face that reaches for the granary, the harvest or the bad season. Any face that shares its first two words with a sibling (A11). **And the one this variant is most likely to commit: a face that says the same thing as vid 1 in plainer words.** The three variants must differ in claim shape, not only in register.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **What a small place actually has instead of a reserve is OTHER PEOPLE'S TIME, and nothing in the shipped pool has noticed it.** The generator's list of what crisis capacity buys is *relief purchases, granary logistics, work crews* (`defenseGenerator.js:608-611`), and in a place with no institution the work crew is whoever stops doing their own work. A town in this band can answer a thing, and the way it answers is by everybody's ordinary week stopping. That is concrete, visible, arguable-about, entirely standing, and not a totality if it is written as a condition of the arrangement rather than a census of who complies.
- **The honest local phrasing of a bounded shortfall is "one thing at a time."** The gate is floored, never zeroed: the town is not helpless and is not stocked. Whatever it puts behind a crisis comes out of something it was otherwise doing. **A town that can answer once is a different thing from a town that cannot answer**, and no row on this tab has drawn that line.
- **What somebody would avoid or complain about:** being the one asked. In a place with nothing set aside, the cost of any answer lands on named, visible individuals and everyone can see whose week it took — but the record holds no names, so the face must keep it at the level of the arrangement. The lawful shape is *the answer costs somebody their week*, never *the smith's week*.
- **What the ABSENCE looks like on the ground:** not emptiness — an ordinary, working, unremarkable place in which nothing at all is held back. There is no store-room with nothing in it; there is no store-room. The reason this is worth saying is that the rest of the tab is a catalogue of absent buildings, and this row's absence has no building to be absent. **The thing that is missing here is margin.**

---

## VARIANT 3 · vid 3 · `[unfolding]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> The shortfall at {settlement} is chronic rather than sudden, and each season of it removes a little more of what the town could do about a crisis when one comes.

### 3.2 Every claim it makes, on the new test

- **There is a SHORTFALL at the town.** — **SAFE**, as in vid 1: the band word in the record's own terms, attached to crisis capacity.
- **The shortfall is CHRONIC RATHER THAN SUDDEN — it did not arise recently.** — **FLOOR-2 (an elapsed course), and here it is asserted outright rather than implied.** `scores.economic` is computed once from storage, institutions, route, `econOutput` and the active stress list; there is no time term, no prior value and no provenance (`defenseGenerator.js:257-290`, `:600-625`). The band is a snapshot, and the snapshot cannot say whether it was ever different. ⚠ **It is worse than unfielded: it is contradicted in spirit by the derivation**, because famine (−20), plague onset (−15), indebted (−15) and an impaired food chain (−8) are exactly the SUDDEN ways a town lands in this band, and each of them is a live stress this key cannot see. A town that was ADEQUATE and is now WEAK because a famine banner is on the same page is denied by this clause.
- **EACH SEASON OF IT REMOVES A LITTLE MORE.** — **FLOOR-2 twice over: a magnitude outside the band word, and an elapsed course.** There is no seasonal term, no accumulator and no decrement anywhere in the derivation, and no world-pulse path rewrites `scores.economic` at all (`foodStockpile.js:473` writes `disaster` alone). The clause asserts a rate the model does not have.
- **What is removed is WHAT THE TOWN COULD DO ABOUT A CRISIS.** — **SAFE as an object**, and it is the same well-aimed noun vid 1 carries. The object is right; the verb around it is not.
- **WHEN ONE COMES — a crisis is coming.** — **FLOOR-2 (a prediction the pulse adjudicates).** *When* takes it as settled; A2 makes the edge subjunctive, so the lawful form is *if one came* or a capability clause with no event in it at all.
- **Implicitly: the town is ON A TRAJECTORY and the trajectory is downward.** — **FLOOR-2.** This is the compound of the two failing clauses and it is the variant's actual content.

**⛔ THE VARIANT'S STRUCTURAL PROBLEM, stated once.** Four of its six claims are floor-2 and the two that survive are vid 1's. **The `[unfolding]` angle wants motion, and floor 2 forbids elapsed motion outright** — no course, no rate, no season, no accumulation, no forecast. So this variant cannot be rewritten by softening its words; every softening of *each season removes a little more* is the same claim at a lower volume. **It must find its motion in a STANDING TENSION rather than in a course:** what the arrangement is doing to the town as a present condition, what it makes true every time rather than a little more true each time, what it leaves permanently open. That is the same cure the block's `court without detention` pool needed and it is available here in a sharper form, because this row's condition is genuinely a tension and not merely a lack — see §3.9.

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

- `scoreBand(scores.economic) === 'WEAK'` — the one read.
- The band's POSITION on the ladder, which is a standing structural fact and not a course: **WEAK is the third rung of four, with ADEQUATE above it at forty and CRITICAL below it at twenty** (`defenseScoreBands.js:38-39`). A face may state a standing relation to a neighbouring band under R-DA-02's sibling rule — the rejected alternative is a real sibling pool key — provided it does not turn the relation into a direction of travel.
- The generator's own shape of the thing, which is a TENSION and not a slope: the capacity stack is *almost entirely wealth-independent* and is then *multiplicatively gated*, with the gate *never zeroed* (`defenseGenerator.js:281-290`). The town HAS the capacity in some sense and cannot fully bring it to bear — that is a standing tension between having and mobilising, and it is stated in the code in as many words.
- REACHED BY THE ENGINE AND NOT BY THE KEY: every institution, every stress, every number, the stores, the country.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

| row | why this variant, specifically |
|---|---|
| **the elapsed course** | shipped twice in one sentence (*chronic rather than sudden*; *each season*). **Any rewrite retaining a duration, a rate, a trend, a direction, a drift, a decline, a "still", a "no longer", a "keeps", an "each", or a "little by little" re-commits it** |
| **the prediction** | *when one comes* is shipped. Every crisis on this row is subjunctive or absent |
| **the magnitude** | *a little more* is a quantity. So are *most of*, *half*, *what is left*, *barely*, *hardly any* |
| **the sudden-arrival denial** | ⚠ specific to this variant and easy to miss: famine, plague onset, debt and an impaired chain all drop a town into this band in one step, and all four render their own banner on the same dossier. **A face asserting the condition is long-standing is refuted by the banner above it** |
| **the stores** | `[unfolding]` reaching for motion will reach for the store going down. That is the paragraph below, and it is also a magnitude |
| **the band as poverty** | *shortfall* plus motion reads as *getting poorer*, which is both an elapsed course and the contradiction the rulings name |

### 3.5 The preimage, as it bites vid 3

This is the variant the preimage punishes hardest. The pool fires on a thorp that has been exactly this way since the seed was drawn and on a besieged city that arrived here this season, with the same words and no way to tell them apart. **The only claims that are true of both are claims with no time in them.** And because `scores.economic` is frozen at generation and never re-judged, a face written as a trajectory will still be asserting that trajectory a hundred ticks later, over a town whose circumstances have changed in every other way.

### 3.6 The angle's stance in one sentence

`[unfolding]` is the record noticing that an arrangement has a shape with a consequence inside it — so here it may state the standing tension between what the town has and what it can bring to bear, and may leave standing open the matter that tension never settles; and it may NOT date it, chart it, accumulate it, quantify its decrement, give it a direction, predict its end, name a wage or a store, or say that the arrangement is failing, because the model holds it as a bounded and permanent condition rather than a decline.

### 3.7 The turns worth keeping

- **"what the town could do about a crisis"** — the correct object, already well said, and shared with vid 1. Because it is shared, **the rewrite must give vid 1 and vid 3 different nouns for it**; A11 bars the two from sharing their first two words and the refuters read the pool whole.
- **the CONTRAST ARCHITECTURE** (*chronic rather than sudden*) — the move is lawful under R-DA-02 where the rejected alternative names a sibling; the alternative chosen here is a TIME word and there is no time field. **Keep the shape and change the axis**: the lawful contrast on this key is between what the town holds and what it can mobilise, or between this rung and the rung above it as a standing position.
- **What to drop entirely:** *chronic rather than sudden* · *each season of it* · *removes a little more* · *when one comes*. Four of the sentence's five clauses leave, and what remains is a noun phrase.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[unfolding]`, or its slot set not `{settlement}` alone, or fewer than four faces. A face opening on the `{settlement}` proper slot, or spending the pool's one settlement opener that vid 1 already holds. A face carrying a which-tail, an em dash, a digit, a percent, or a third sentence. **Any face that keeps motion in time** — including the disguised forms: a resultative perfect, a habitual "keeps", a comparative against an unstated past, an "already", a "still", a "by now". Any face that predicts. Any face that is vid 1's sentence with a slower verb: the two variants must differ in the SHAPE of their claim, and the shape available to vid 3 is the tension, not the limit.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **⭐ The tension the code states outright and no prose has ever used: this town HAS the means and cannot GET AT them.** The capacity stack — what is stored, what is built, what the road brings — is described in the generator's own comment as *almost entirely wealth-independent*, and then the whole of it is multiplied down by a gate on the economy's health. **The grain is really there. The road is really there. What is thin is the town's ability to turn any of it into a response.** That is a standing tension, it has no time in it, it is true at both ends of the band, it is true of the thorp and of the besieged city, and it is the single most interesting thing this pool's state makes available.
- **The shape of that on the ground is a decision, not a lack.** A town in this rung does not discover it has nothing; it discovers that answering one thing means not answering another. The generator's own line for the sibling gates is *relief purchases, granary logistics, work crews* — three things that all cost the same purse and cannot all be bought. **The permanently open matter this arrangement never settles is which one gets bought**, and OPEN QUESTION is a licensed move (MOVE-GRAMMAR §1.2 row 10) in exactly this form: a civic matter left standing and named, never asked.
- **What a stranger would notice:** nothing, until something happens. This is the row of the five with no visible sign — no wall to look at, no gaol, no granary, no soldiers. The condition is invisible on an ordinary day and total on an extraordinary one, and **that invisibility is itself concrete and is free to write**, because it is a fact about the arrangement and not about the future.
- **What is worth complaining about, and it is the record's own:** the gate is bounded and never zeroed, so the town is never excused and never equipped. It is always asked and always short. **Being asked is the constant; the shortfall is the constant; the only thing that varies is which thing gets left.**

---

## 4. THE PACKET'S OWN VERDICT, for the writer's first pass

**The pool's one licensed claim is small and it is sound:** the town's capacity to fund and mount a response to a crisis stands in the third rung of four, as a standing fact of the record, before any crisis. Everything the three shipped variants add to that fails.

**The claim tally across the pool, as marked:**

| variant | SAFE | CONTRADICTED | FLOOR-2 |
|---|---|---|---|
| vid 1 `[ledger]` | 3 | 2 (the wage; the implied paid body) | 3 (chronic; morale; the timing) |
| vid 2 `[street]` | 1 (the unnamed crisis) | 3 (the paid body; the arrears; the implied coin) | 2 (already; the memory) |
| vid 3 `[unfolding]` | 2 | 0 | 4 (chronic-not-sudden; the seasonal rate; the coming crisis; the trajectory) |

**The three things the writer must carry out of this packet:**

1. **There is no wage, no purse and no debt on this key.** It reads one number and no roster, and on four settlements in five there is no institution of any kind to pay. Two of the three shipped variants are built on a wage. That is the pool's largest fault and it must not survive into any of the twelve faces.
2. **The stores belong to the paragraph below.** This row's score is food-storage-driven and its neighbour is the food row, printing `NO reserves, NO medical provision` on 100 % of this pool's thorps and hamlets. The discriminating claim here is CRISIS LOGISTICS — what the town can mount, and what mounting it costs the town — never what is in the granary.
3. **There is no time in this read.** No course, no season, no rate, no trajectory, no forecast, no "already" and no "still". The band is a frozen snapshot that is never re-judged, and the `[unfolding]` variant must find its motion in a standing tension: **the town has the means and cannot fully get at them; it can answer one thing, and answering it costs the thing not answered.**

**What is free, and what the shipped rows never touched:** the estate's own phrase *crisis logistics*; work crews and relief carriage; the absence of margin in a place that is otherwise working perfectly well; the invisibility of this condition on an ordinary day; the permanently open question of which thing gets bought when only one can be; and the fact that this is the only row of the five whose subject a clerk cannot walk to.

---

*Packet complete. Three variants marked; four faces owed on each; twelve faces in total. Written under ADDENDUM 14 — silence is permission, and every tag above names either a field that denies the claim or the floor that bounds it.*
