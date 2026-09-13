Seat: MARKER (opus), DS-DEF-2 · pool `Economic Survival: STRONG` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Economic Survival: STRONG` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[counterforce]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2680-2683`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:798-821`; the pool's manifest row at `:1290-1305` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:810`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A face that adds the town's name to vid 2, or drops it from vid 1 or vid 3, is refused by the projector before any reader sees it. A sentence-form face may not OPEN on a `proper`-typed slot either (T-F8), so `{settlement}` sits inside the sentence, never first.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

⭐ **THIS POOL IS THE ONE IN THE BLOCK WHOSE SHIPPED ROWS CARRY REAL CONTRADICTIONS, not merely tired constructions.** Two of the three shipped variants assert the town's MONEY as the thing the band measures, and the block's own contradiction set rules the opposite in as many words: *the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity* (`rewrite/rulings-DEF2-v14.txt`). A third shipped clause names a GARRISON the key cannot resolve and the range mostly lacks. The writer should expect to keep the shipped SPINE (a town that can carry a long pressure) and to lose most of the shipped vocabulary.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: STRONG'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Economic Survival: STRONG`)
  reads:      scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js) === STRONG
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: counterforce ledger street
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the
              file's first dot) and NOT on a producer-token root, so every pool that selects a
              row of `ECONOMIC_ROW_POOL` shares ONE echo key: a mount counted there may be a
              sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `scoreBand(economicScore)` selects the row `STRONG` of
              `ECONOMIC_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
```

⚠ **Three card lines are load-bearing here and each is stricter than it looks.**

1. **`source: (none) · SOURCE-UNRESOLVED` is the hardest line in the packet.** Unlike every other row of this desk, this pool has NO holder. The holder table maps the defence institution buckets and `economicGates` to the MUSTER (`src/domain/prose/holderTable.js:188-195`) and the food stockpile to the TOLL BAR (`:185`), but `defenseProfile.scores` appears nowhere in it. So **no face may name a record or its keeper** — not the treasury's books, not the muster roll, not the market's returns, not the granary's tally, not "the books", not "the roll", not "the count". Arm A13 refuses the face outright. This bars the one move the `[ledger]` angle reaches for first, and the writer must find the ledger's voice in the ORDER and the FLATNESS of the sentence rather than in a named record.
2. **`may NOT: a magnitude outside the read's own band word`.** The band word is the whole quantity. `STRONG` is `economicScore >= 65` on a 0 to 100 ladder (`src/domain/display/defenseScoreBands.js:38-39`). A face may say the town can carry a sustained pressure; it may not say for how long, by how much, how deep the reserve is, how many months, or that the capacity is limitless. **"Sustained" is the desk's own word and is safe; "indefinite", "however long it takes", "whatever comes" are magnitudes the band does not hold** — STRONG is a floor at sixty-five, not a ceiling of a hundred, and the same face prints on a town scoring sixty-six.
3. **`may NOT: an elapsed course`.** This bites the `[counterforce]` variant at its hinge: see §3.2.

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. This pool is **row 4's `STRONG` branch** and it is the ONE row of the five keyed on a NUMBER rather than on booleans.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at this block's call sites. See the wall above: this pool's three parents are NOT uniform and each face inherits its own parent's set.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job here is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses and never HISTORICAL ones** unless the history surface supplies the ancestry. It does not here. ⚠ This fence is written about institutions, and it binds this row harder than any other, because this row's number is the only one on the desk that LOOKS like it has a history in it. It does not. It is a birth-time reading (see §0.9's clock row).
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `ECONOMIC_ROW_POOL` (`ADEQUATE`, `WEAK`, `CRITICAL`) and never a second print of this one.
- **PDF PARITY:** parity (`viewModel.js` defense slice) — every face prints in the PDF as well as on the tab.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows — **and here the card licenses none.**

⚠ **The no-digit rule is sharper on this pool than on any other in the block.** The read is a NUMBER banded into a word, and every neighbouring surface prints figures: the bar is drawn at `width: ${sc}%` (`DefenseTab.jsx:340`), the badge prints the band word, and the funding note prints a percentage (`defenseDisplay.js:321`). The prose is the one place on that row where the reader gets the word and never the digit (`defenseScoreBands.js`'s own legibility note). **No face may carry a number in any form** — not a figure, not a spelled count, not "two months", not "a third of", not "twice".

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first in its own composed unit, and the tab stacks the five rows' prose as ONE italic block of paragraphs above the five bars (`DefenseTab.jsx:313-320`). **This row is NEVER the first paragraph** — see §0.7.1, which fixes its neighbours exactly. Every face must read well immediately after an `Internal Security` paragraph and must hand a noun forward that a `Disasters & Famine` paragraph can pick up.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

### 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

The predicate is ONE number banded through ONE ladder (`src/domain/display/stateProse/defenseStateProse.js:529-543`):

```
const ECONOMIC_ROW_POOL = Object.freeze({
  STRONG: 'Economic Survival: STRONG', ADEQUATE: ..., WEAK: ..., CRITICAL: ...,
});
export function economicRowPoolKey(economicScore) {
  if (typeof economicScore !== 'number' || !Number.isFinite(economicScore)) return null;
  return ECONOMIC_ROW_POOL[scoreBand(economicScore)] || null;
}
```

The caller hands it `dp.scores?.economic` (`defenseStateProse.js:660`), and the ladder is `scoreBand` (`defenseScoreBands.js:38-39`): **STRONG at sixty-five and above, then ADEQUATE, WEAK, CRITICAL.** An absent or non-finite score is SILENCE and not CRITICAL — the desk's own docblock says so, and `avgScore` gives the reasoning at `defenseScoreBands.js:61-62`.

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `defenseProfile.scores.economic` banded to **STRONG** | the top rung of the frozen four, on the economic arm of the five-arm defence assessment | **NONE. `SOURCE-UNRESOLVED`** (`holderTable.js` carries no `scores` row; the sibling `economicGates` resolves to the MUSTER at `:195`) | the one thing the band means in the desk's own framing: **the town can carry a sustained crisis rather than a short one.** The desk's legacy string for this exact branch is *"Strong economic base can absorb a sustained crisis"* (`threatAssessment.js:165`), so the reading, the word "sustained", and the crisis framing are all the estate's already | **what the score is MADE OF may not be asserted from the band word.** It is a five-term sum (below), so no single term is licensed by the total |

**WHAT THE NUMBER IS ACTUALLY BUILT FROM (`src/generators/defenseGenerator.js:257-290`, then `:624`) — read this before writing a word, because every shipped error in this pool comes from guessing it wrong:**

1. **Months of stored food, and this is the dominant term** — `storageScore` is capped at seventy of the hundred (`:265-269`), from `config._foodSecurity.storageMonths`, which is itself set by which granary row the town holds and whether it has a mill (`foodGenerator.js:160-165`).
2. **A market** (+10), **a hospital** (+10), and the route: a **port** with maritime world law (+10) or a **crossroads** (+8) (`:271-276`).
3. **The economy's output**, one fifth of it, added and capped (`:277`).
4. **An alchemy bonus** where the town has both alchemy and a granary (+8, `:279`).
5. **The economic-health gate**, a MULTIPLIER from `0.45` to `1.0`, identity at `economyOutput >= 50` (`:289-290`). The generator's own comment says the additive stack above is almost entirely wealth-independent and that grain keeps its value when the treasury does not.
6. **Then the stress penalties**, subtracted AFTER the gate: siege minus twenty-five, famine minus twenty, plague onset minus fifteen, indebted minus fifteen (`:337-338`, `:355-359`, `:398`, `:424`).
7. **Then the food-processing chain bonus**, plus five when healthy and minus eight when impaired (`:604-606`, applied at `:624`).

**Three consequences the writer must hold:**

- **The band is not a purse.** It is mostly a measure of how many months of food the town is standing on, damped by how well its economy runs. The block's own set states this flatly: *the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity.*
- **The band is not the pay gate.** The funding note under this very row is the SEPARATE multiplier `economicGates.economic` (`:471`), whose expense is named **"crisis logistics"** (`defenseDisplay.js:282`). Garrison wages are the MILITARY gate's subject (`:280`) and belong to the Invasion row.
- **The band is a composite and none of its terms is licensed alone.** A face that says the granary is full asserts one of five terms. A face that says the market is busy asserts another. The band says the SUM cleared sixty-five and nothing about which term did the work.

**The reads the desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- **No institution at all.** This key reads no walls, no garrison, no militia, no watch, no court, no prison, no granary flag and no hospital flag. The other four rows of this same desk read exactly those (`defenseStateProse.js:655-663`). **Whatever body a face here names, this key cannot resolve it.**
- **No stress.** `config.stressTypes` is read by NO key function of this block. This pool prints under `under_siege`, `occupied`, `famine`, `plague_onset`, `indebted`, `monster_pressure` and `wartime`, each of which renders its own banner on the same tab (`DefenseTab.jsx:240-245`).
- **No country, no tier, no route, no terrain, no population.**
- **The funding note printed under this row can contradict a careless face outright.** `READINESS_GATE_FOR['Economic Survival']` is `['economic', 'crisis logistics']` (`defenseDisplay.js:282`), and the note renders whenever the gate is below one: *"Upkeep underfunded: crisis logistics at NN%"* (`:319-321`). The gate is below one whenever `economyOutput < 50`, and **the band can be STRONG while it is** (§0.9). See the contradiction table.

### 0.6 The provenance move, priced for this pool: ZERO, and it is a wall rather than a recommendation

The card prints `source: (none) · standing SOURCE-UNRESOLVED` and says in its own line that **no citation is licensed and a face naming a record holder is refused by arm A13.** That is not the budget speaking (Part B §24's ceiling of one per unit for one of S3's three reasons); it is the holder table having no row for `defenseProfile.scores`. So:

- **No named keeper, no named record, in any face.** Not the treasury, the market, the granary, the muster, the toll bar, the elders, the road.
- **Record VOCABULARY is a separate question and the writer should be careful with it here.** On a pool WITH a holder, words like the roll and the return are free vocabulary. Here the absence of a holder makes any such noun read as the citation the card refuses, and the `[ledger]` angle is the one that will reach for it. **The `[ledger]` face must sound like the record without naming one** — flat order, the fact first, the qualification in its own sentence.
- The exemplar registers with raw text cite at zero per 786 sentences, so zero is also the norm.

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE — four sibling surfaces, and the neighbours here are FIXED rather than variable

#### 0.7.1 This row's two neighbours in the prose block are the same two on every town that reaches it

The block renders `['beasts','invasion','internal','economic','disaster']` in that order, filtering out silent rows (`DefenseTab.jsx:112-114`). Of those five keys:

- `beastsRowPoolKey` **can be silent** — `beastsRowSituation` returns `''` for a plagued or settled country with a force and no perimeter, and for a frontier country with a perimeter and no force (`defenseStateProse.js:429-440`, and the docblock says the silences are the corpus's and are preserved).
- `invasionRowPoolKey` is **TOTAL over six situations** (`:443-492`, the docblock says so).
- `internalRowPoolKey` is **TOTAL over four** (`:493-508`).
- `disasterRowPoolKey` is **TOTAL over five** (`:546-599`).

**Therefore this paragraph is never first and never last. It is always preceded by an `Internal Security` paragraph and always followed by a `Disasters & Famine` paragraph, on every town in the range.** That is the most precise thread fact any pool in this block has, and the writer should use it:

- **The sentence before it** is one of four: the full legal chain, the court without detention, the detention without process, or no legal machinery at all. Each of those closes on law, process, enforcement, the watch's temper, or force alone.
- **The sentence after it** is one of five and every one of them is about **FOOD and the SICK**: holding food against a bad year, a full store and a modest infirmary, feeding through a failed harvest with nothing against disease, no reserves with a hospital, or neither.

#### 0.7.2 ⛔ THE SHARPEST HAZARD IN THE PACKET: the paragraph immediately BELOW is made of this row's own biggest term

The economic score is up to seventy per cent food storage. The `Disasters & Famine` paragraph that follows it is about the granary. **So the single most natural thing to write here is the next paragraph's subject, printed one line early.** A face that reaches for grain, stores, a full granary, a bad harvest, months of buffer or a store to draw down is writing the sentence the reader is about to read.

This row's discriminating job, against that neighbour, is the **DURATION and the FUNDING of a RESPONSE**: the Disasters row says what the town HOLDS against hunger and sickness; this row says what the town can KEEP DOING while a pressure of any kind runs long. The desk's own two strings draw exactly that line (`threatAssessment.js:165` against `:181-188`).

#### 0.7.3 The same number speaks again on the Overview tab, in its own sentences

`DS-GEN-3` bands the SAME field through the SAME ladder and speaks it beside the Systems Health score bars (`generalStateProse.js:291-295`, mounted at `:1731`; the annex's mount roster rows 22 and 23). Its shipped `scores.economic: STRONG` rows are:

> *"…could lose a season's trade and go on paying its people; there is enough behind the market to absorb it."* · *"Prices in {settlement} are steady in a way that suggests the town is not living on the last thing that sold."* · *"A bad year in {settlement} is a bad year and not a crisis, and the town budgets for one."*

**That is the same fact, banded the same way, in the same dossier, on another tab** — and note that two of the three reach for money and trade, which is the reading the block's set rules out. DS-GEN-3 has its own lane and its own four faces coming. A face here that turns on prices, trade, the market or the town's budget is that pool's sentence.

#### 0.7.4 On the defense tab itself, DS-DEF-6's `Economic Backing` pools are SILENCED because this row speaks

The desk's own docblock names this pool by its key function (`defenseStateProse.js:1473-1476`): *ECONOMIC BACKING ⇄ DS-DEF-2 row 4, `economicRowPoolKey`. Both band `defenseProfile.scores.economic`;* and it cites this pool's shipped garrison-pay clause as the reason. The four `Economic Backing` pools sit in `DEF6_C3_BLOCKED_POOLS` (`:1498-1500`) and never print.

**Two consequences.** First, there is no same-tab collision to avoid: those words are not on the page. Second, and for the chair rather than the writer: **the C3 block was justified on the ground that this row already speaks the funding reading.** A rewrite that drops funding entirely from all twelve faces weakens that justification, and the packet records it here rather than leaving it to be re-found. The lawful funding subject here is **crisis logistics** (this row's own gate name), never garrison wages.

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into

The block's own set is `rewrite/rulings-DEF2-v14.txt`. The rows below are the ones this key can actually reach.

| the claim that would be false | the field that denies it, and which of the two is the record |
|---|---|
| ⛔ **PROSPERITY, WEALTH, MONEY, REVENUE, A TREASURY, COFFERS, TAX, A BUDGET, RICHES** as what the band measures | **the block's own set, verbatim: the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity.** The generator agrees in its own comment: the additive stack is almost entirely wealth-independent and a destitute town is not given a strong economic base for owning a granary (`defenseGenerator.js:260-262`, `:281-290`). **The generator is the record.** Note how far this reaches: *its own revenue*, *the reason is money*, *tax revenue*, *deep coffers*, *a full treasury*, *the town is rich* are all this row |
| ⛔ **A GARRISON, SOLDIERS ON A WAGE, PAID MEN, KEEPING ANYONE PAID** | three denials at once. (a) The alias rule of the block's set: *"the garrison" only where a Garrison or Multiple garrisons row resolves* (city tier) — **and this key reads no institution at all**, so it can resolve nothing. (b) The preimage: the same face prints on a town whose `Invasion & War` paragraph three lines above reads *"{settlement} has no line and no force"*. (c) The pay gate is a DIFFERENT multiplier: garrison wages are `economicGates.military` (`defenseDisplay.js:280`), this row's gate is `economicGates.economic` and its expense is **crisis logistics** (`:282`). **The roster and the gate table are the record** |
| ⛔ **"the town can pay for everything" / "nothing here is short of funding"** while the row's OWN funding note says otherwise | `economicGates.economic` is `econHealthMult`, floor `0.45` (`defenseGenerator.js:289`, persisted at `:471`), and `deriveDefenseReadiness` renders *"Upkeep underfunded: crisis logistics at NN%"* under this exact row whenever it is below one (`defenseDisplay.js:319-321`; rendered `DefenseTab.jsx:343`). The gate is below one whenever `economyOutput < 50`, **and the band clears sixty-five inside that range** (§0.9). **The note is the record, and it is one click below the sentence** |
| ⛔ **"nothing has gone wrong here" / "the town has never been tested" / "trouble has not turned into a collapse"** | FLOOR-2b (an elapsed course) AND the stress preimage. Stress penalties are applied after the gate, so a base of one hundred survives a siege at seventy-five and a famine at eighty (`:337-338`, `:355-359`). **A STRONG town can be under an active siege, an active famine, a plague onset or an `indebted` flag, with the banner printed on the same tab.** The banner is the record |
| **A GRANARY, A FULL STORE, MONTHS OF BUFFER, GRAIN** named as the thing the band holds | two grounds. (a) It is one of five terms and the band licenses only the sum (`defenseGenerator.js:265-291`). (b) The `Disasters & Famine` paragraph immediately below owns the reserve reading on its own flags, and the block's set warns that `hasGranary` says nothing whatever about the stock inside it. Arithmetically the two rows can even disagree: the score reads `foodSecurity.storageMonths` while the row below reads `compound.inst.hasGranary`, which are two different facts about grain |
| **A MAGNITUDE: how long, how deep, how much, "indefinitely", "whatever comes", "without limit"** | floor 2a. `STRONG` is a floor at sixty-five on a hundred-point ladder and the same face prints at sixty-six and at a hundred. *Sustained* is the desk's own word and is safe; *endless* is not |
| **A COUNT, A FIGURE, A SPELLED NUMBER, A SEASON'S LENGTH, A NUMBER OF MONTHS** | no digits in prose (A4); the band word is the reader's quantity by the legibility law (`defenseScoreBands.js:15-19`); and the months belong to DS-ECO-9's food-security ladder |
| **A CAUSE, A DATE, A FOUNDING, A DECISION, "the town built up its reserves after…"** | FLOOR-2b and the block's own fence: these are CAPABILITY clauses and never HISTORICAL ones. **This score is judged once at generation and never re-judged** (§0.9's clock row), so there is no history in it to narrate |
| **A PREDICTION the simulation adjudicates: "will hold", "would survive", "cannot be starved out", "will outlast a siege"** | FLOOR-2b. The world pulse adjudicates sieges, famine and the food stockpile (`src/domain/worldPulse/foodStockpile.js`), and the block's set already strikes one shipped clause of this shape elsewhere. The lawful form is the capability clause in the present and the subjunctive edge, never the outcome |
| **A TOTALITY OVER PERSONS: "everyone here is paid", "nobody goes hungry", "the whole town is provided for"** | the REFUSED COLUMNS line, and an exemption from a duty (`whoIsExempt` is null everywhere). The town is a civic body; its people counted or quantified are not this row's subject |
| **"the guard", "the watch", "the militia"** as the body carried through a crisis | the block's alias set: *the guard* is the power generator's FALLBACK label on a town whose safety profile prints that there is no meaningful guard presence (`safetyProfile.js:300`); *the watch* as a NAME only on a resolved watch row; *the militia* only where the militia row resolves. **This key resolves none of them** |
| **`plagued` read as disease, `settled` read as "no live threat"** | the engine meanings from the block's set. This key does not read the country at all, so neither word belongs in a face here in any reading |
| **A MINTED PROPER NAME** borne by the face (a person, a family, an inn, a lane, a road) | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The town's NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **EXPLAINING OR OUTRUNNING THE BADGE** | here the band word IS the badge (`DefenseTab.jsx:324` bands the same `scores.economic`), so unlike the other four rows the prose and the bar cannot disagree — but the prose may not become a gloss of the bar either (MOVE-GRAMMAR §1.3: no MEANING move). Saying the town scores well on the economic arm is the label read aloud, not a sentence |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these do not carry may not be asserted: the institution roster read through the LIVE ruin-filtered roster (`institutionRoster.js`, `liveInstitutions`); the seven defence buckets (`defenseInstitutionBuckets.js:83-110`); the faction list; the faith entries; the NPC office roster; **and the holder table (`holderTable.js`), which for this pool is EMPTY — no keeper of this fact exists in the record at all.** Everything else is silence, and silence is permission.

**Not a faith pool.** The deity's four axes, the derived temper (`deityTemper()`, never the inert stored `temperamentAxis`), the pantheon rank, the settlement standing and the suppressed flag do not arise here and no face may reach for them.

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

`Economic Survival: STRONG` fires on **every town whose `defenseProfile.scores.economic` is sixty-five or more**, and on NOTHING ELSE about the town. That is a single numeric threshold on a composite, and it is the widest preimage in the block.

- **Every tier.** The score reads no tier. A thorp with a mill and a long buffer and a hamlet with none reach it or miss it on the arithmetic alone. In practice the storage term favours towns with a granary row (`foodGenerator.js:160-164`: a state granary gives eight or twelve months, a city granary five or seven, a plain granary two and a half to five, and nothing at all gives one to one and a half), so the range leans town-and-above — but it is not fenced there.
- **Every country tier, every route, every terrain, every culture, every population band.** None is read. The route contributes to the SCORE (a port or a crossroads) but is invisible to the key.
- **Every stress state, including the ones that make a complacent face absurd.** No key function of this block reads `config.stressTypes`, and the stress penalties are subtracted AFTER the gate, so the band survives them. Arithmetic from the cited lines: a base of one hundred under an active siege lands at seventy-five (STRONG); under an active famine at eighty (STRONG); under a plague onset at eighty-five (STRONG); under `indebted` at eighty-five (STRONG). **A face here prints beneath a siege banner, a famine banner, an occupation banner and an `indebted` flag.** ⚠ `indebted` deserves its own line: **the record can flag this town as in debt while this row reads STRONG**, which is a second, independent reason no face may call the town solvent, rich or unencumbered.
- **A large part of the range carries this row's own UNDERFUNDED note.** The gate `econHealthMult` is identity only at `economyOutput >= 50`. Arithmetic from `defenseGenerator.js:265-290`: the additive stack caps at one hundred, so the band still clears sixty-five with the gate as low as about `0.65`, which is `economyOutput` near twenty; with the healthy food-processing chain's plus five it clears lower still. **So a town in this pool may be printing *"Upkeep underfunded: crisis logistics at 67%"* directly under the sentence.** (This is arithmetic from the cited lines, not a measured town; the wave's own corpus sample would settle the share.) The same low output also pulls the military gate (floor `0.6`), the monster gate (floor `0.7`) and the internal gate (floor `0.65`) below one, so the sibling rows carry their own underfunded notes at the same time.
- **The composite can be reached by very different towns.** A long-storage inland town with a crossroads and a middling economy, and a port city with a market, a hospital and a strong economy but a thin store, both land here. **No face may describe HOW the town got the band**, because two towns in this pool got it from opposite halves of the sum.
- **ONE CLOCK, AND IT IS THE BIRTH CLOCK.** `defenseProfile.scores.economic` is written at generation and never re-judged: the world pulse touches only `scores.disaster` (`src/domain/worldPulse/foodStockpile.js:397-473`), and the tab's own caption says the bars are *as judged at the first survey* and that Disasters and Famine alone is re-judged as the campaign advances (`DefenseTab.jsx:313`). **So this sentence and its badge agree with each other forever, and both may disagree with the LIVE food stockpile, the LIVE blockade state and everything the campaign has done since.** A face written as a report of how things stand today is safe; a face written as a claim about how things are GOING is not, and a face that implies the reading is current is quietly asserting a clock the record does not run.

A face must contradict no state in that range, not merely the town on this skeleton.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> {settlement} can absorb a sustained crisis out of its own revenue: emergency measures can be paid for and the garrison can be kept paid while they last.

⚠ This sentence is the desk's legacy string rewritten close to the bone. `threatAssessment.js:165` reads *"Strong economic base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains garrison pay during prolonged engagement."* **Both of the shipped variant's two errors are inherited from it**, which is why they must be named and not merely edited: the legacy string is the reason the error looks authoritative.

### 1.2 Every claim it makes, on the new test

- **The town CAN ABSORB a SUSTAINED CRISIS — a capability, in the modal.** — **SAFE**, and it is the band's own reading in the desk's own words. *Absorb* and *sustained* are both `threatAssessment.js:165`'s. The modal is the capability clause the block's fence asks for and not a historical one. This is the claim the whole pool exists to carry and it should survive in all four faces in some form.
- **OUT OF ITS OWN REVENUE.** — ⛔ **CONTRADICTED, and this is the packet's principal finding.** The block's contradiction set rules that *the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity* (`rewrite/rulings-DEF2-v14.txt`), and the generator says the same thing in its own comment at `src/generators/defenseGenerator.js:260-262` and `:281-290`: the additive stack is almost entirely wealth-independent, and the health gate exists precisely so that a destitute town is not handed a strong economic base for owning a granary. **The generator and the block set are the record; the sentence is wrong.** Two further denials sit on the same three words. *Revenue* names a treasury the holder table cannot resolve for this read (`holderTable.js` has no `scores` row; `source: (none)`). And **ITS OWN** is denied by the score's own arithmetic: two of the five terms are about supply arriving from outside (a port with maritime law, or a crossroads, `defenseGenerator.js:273-276`), so a town can reach this band precisely because it is NOT self-contained.
- **EMERGENCY MEASURES CAN BE PAID FOR.** — **SAFE as a capability, and it is the row's own subject.** This row's gate is named *crisis logistics* (`defenseDisplay.js:282`), so the expenditure framing is the estate's for this arm specifically. ⚠ **It is one adjective from a contradiction**: *fully funded*, *nothing is short*, *no shortfall anywhere* collide with the row's own underfunded note, which prints beneath the sentence across a large part of the range (§0.9). Keep the capability; never claim the funding is complete.
- **THE GARRISON CAN BE KEPT PAID.** — ⛔ **CONTRADICTED three times over, and it must not survive in any form.**
  1. **No institution is read by this key.** The five key functions are split across the desk and this one takes a number alone (`defenseStateProse.js:540-543`). The block's alias set permits *the garrison* only where a `Garrison` or `Multiple garrisons` row resolves, which is city tier. **The roster is the record and this key cannot consult it.**
  2. **The preimage denies it on most towns.** The band reads no institution, so the same face prints on a town whose `Invasion & War` paragraph three lines above says there is no line and no force, and on a town whose only body is a citizen militia, which is unpaid by construction (`defenseGenerator.js:187-188` calls the community baseline unpaid and exempt).
  3. **Garrison pay is a different gate.** `READINESS_GATE_FOR['Invasion & War']` is `['military','garrison pay']` (`defenseDisplay.js:280`) and `economicGates.military` is a separate multiplier with a separate floor (`defenseGenerator.js:189`). **This row's number does not measure garrison pay, and the row that does is a different paragraph.** The CLAIM worth keeping is the one underneath: *a response costs money for as long as it runs, and this town can go on spending on one.* That is the arm, stated without a body.
- **WHILE THEY LAST.** — **SAFE as a hedge and DEFECTIVE as grammar.** As a hedge it is exactly right: it refuses the magnitude the band does not hold and refuses the prediction the pulse adjudicates. As grammar its plural pronoun has no antecedent (the measures? the crisis? the garrison?). **Keep the move, lose the pronoun** — the pool needs a bounded ending of this kind in at least two faces, written so the thing that ends is named.
- **The colon and the coordinated tail.** — not a claim, but it LEAVES with the rewrite. The colon is licensed as one chosen joint (R-DA-06), but what rides behind it is TWO further facts joined by *and*, which is a qualification tail rather than the single computed consequence amendment S2 allows. R-DA-03: the qualification gets its own sentence, never a tail, never a third.
- **Implicitly: the town CHOSE to build this depth, or has been prudent.** — the face does not assert it and must not. There is no history in this number and no decision field behind it; **FLOOR-2b** if written.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- The band word STRONG on the economic arm, and its one licensed reading: **the town can carry a crisis that runs long, not merely one that is short.** The contrast class is the sibling rows of the same table (ADEQUATE funds a short crisis; WEAK is chronic shortfall; CRITICAL cannot fund a response at all), and R-DA-02 licenses a contrast where the rejected alternative names a sibling band. **That is this variant's strongest licensed move and the shipped line does not use it.**
- The row's own expenditure vocabulary: **crisis logistics**, the gate's own expense name, and *emergency measures*, the desk's own.
- The desk's own rating words for this branch: *strong*, *absorb*, *sustained*, *prolonged*.
- REACHED BY THE ENGINE AND NOT BY THE KEY, and therefore the writer's boundary: the store, the market, the route, the economy's output, the health gate, every institution, every stress, the country, the tier, the funding note, the bar.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

Every row of §0.8 is reachable from this variant. The five it walks into hardest:

| row | why this variant, specifically |
|---|---|
| **prosperity as the subject** | the shipped line already breaks it, and the `[ledger]` angle is the one that will reach for a purse by reflex. **Money, revenue, tax, a treasury, coffers, a budget are all the same finding** |
| **a body that is paid** | the shipped line already breaks it. No garrison, no soldiers, no watch, no militia, nobody on a wage. The lawful subject of the spending is the RESPONSE, never the people |
| **the underfunded note** | *paid for* is one step from *fully funded*, and the note that says otherwise renders under this row |
| **a magnitude** | *sustained* is safe because it is the desk's; *indefinitely*, *however long*, *without limit*, *deep reserves* are magnitudes the band word does not hold |
| **the granary below** | the storage term is seventy per cent of this number and the next paragraph is about the store. A `[ledger]` face that reaches for what the town HOLDS has written the Disasters row; this row is about what the town can KEEP DOING |

### 1.5 The preimage, as it bites vid 1

See §0.9 whole. For this variant in particular: the face prints on a port city and on an inland town with a long buffer, over an `indebted` flag, under a siege banner, and above its own *crisis logistics underfunded* note. **"Can absorb a sustained crisis" survives every one of those**; *out of its own revenue* survives none of them, and *the garrison can be kept paid* survives least of all.

### 1.6 The angle's stance in one sentence

`[ledger]` is the clerk's view, what the books, rolls and counts show (the annex's own gloss at `RECEIPT_POOLS_DOSSIER_STATE.md:122`) — so here it may set the arm's reading down flatly, in the order a clerk would, state the qualification in its own sentence, and place the reading against the neighbouring bands of the same ladder; **but on this pool alone it may not name a book, a roll or a keeper**, because the card resolves no holder, so its ledger quality must come from the ORDER and the FLATNESS of the sentence and never from a cited record.

### 1.7 The turns worth keeping

- ***can absorb a sustained crisis*** — the desk's own words and the band's exact reading. Worth carrying close to verbatim into ONE face and finding three other constructions of the same weight for the rest. The verb *absorb* is the estate's for this arm.
- **The bounded ending** (*while they last*) — the move that refuses both the magnitude and the forecast. Keep it in two faces with a named subject.
- **The two-clause shape: a capability, then what the capability costs to exercise.** That is the arm's own structure and it is licensed.
- What to drop: *out of its own revenue* (contradicted), *the garrison can be kept paid* (contradicted), the coordinated colon tail (barred), the antecedentless *they*.

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. A face that opens on the `{settlement}` proper slot (T-F8). A face carrying a which-tail, an em dash, a digit, a spelled count, a third sentence, or a summarising second sentence that says what the first one MEANT. **Any face that carries the revenue reading or the garrison forward in new words.** Any face that names a record or its keeper. Any face that becomes a gloss of the badge beside it.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **What this band actually measures is ENDURANCE OF EXPENDITURE, and no shipped row in the block has said so.** A crisis is not one purchase. It is a standing outgoing that runs every week the crisis runs: relief bought and bought again, carts hired and kept hired, work crews kept at it, the same things paid for a second and a third time. **The difference between this town and the rung below it is not that it can begin a response; it is that it can still be paying for the same response after the interesting part is over.** That is concrete, particular, entirely inside the reading, and free.
- **A strong economic arm is the one arm on this desk with NOTHING TO SEE.** A wall is visible; a court is a building; a militia is a body of people. This is the row where a stranger walking the town would notice nothing at all, and the record still holds the fact. **The absence here is an absence of evidence rather than of the thing** — there is no structure the capacity lives in, no office that administers it, no day on which it is exercised. A `[ledger]` face may say what the record holds about a town where nothing is on display, and that is a genuinely different sentence from the four other rows of the block.
- **What is held against a crisis is not doing anything else.** Depth that is kept is depth that is idle, and that is a standing condition rather than an elapsed course. ⚠ Handle with care: written as a general truth about reserves it trips the generalisation test (R-DA-12), so it must land on THIS town's arrangement and not on the nature of reserves.
- **The reading is made once and never made again.** The number is written at generation and the pulse never revisits it (`foodStockpile.js:397-473` touches `scores.disaster` alone; `DefenseTab.jsx:313` says the bars are as judged at the first survey). **So the honest register here is the entry rather than the bulletin** — what the record holds, not what is the case this morning. ⚠ but the card resolves no holder, so a face may take that flatness of tone and may NOT name the survey, the entry or whoever made it.

---

## VARIANT 2 · vid 2 · `[street]` · **NO SLOT** — this variant never names the town

### 2.1 The shipped sentence, verbatim

> The town could go through a bad season with its arrangements intact, and the people who would have to be paid through one know it.

### 2.2 Every claim it makes, on the new test

- **THE TOWN — the definite bare noun, no name.** — **SAFE and REQUIRED.** `slots: []` at `defense.generated.js:810`. Every face of this variant must refer to the settlement without naming it; *the town* is the estate's term and is the one used across this block's `[street]` rows.
- **The town COULD GO THROUGH a bad season — the subjunctive capability.** — **SAFE**, and it is the lawful shape: A2 and R-DA-07 make the edge subjunctive, so *could* is the form a capability edge takes and not a forecast. This is the band's reading in the street's grammar.
- **A BAD SEASON.** — **SAFE as written, and a refuter magnet worth naming.** The card's own `may NOT` line reads *a dated cause or a season (floor 2b)*, and a refuter reading that line literally will flag any calendrical noun. The bar is aimed at DATING a cause, which this does not do — it names a hypothetical stretch of adversity, in the subjunctive, with no date, no year and no cause. It stands. ⚠ **But at most one of this variant's four faces should use a calendrical word at all**, and the other three should reach for a duration that is not a unit of the year: a long pressure, a bad stretch, a run of trouble, something that goes on. That also widens the sibling distance from the Disasters paragraph below, whose whole subject is the bad YEAR.
- **WITH ITS ARRANGEMENTS INTACT.** — **SAFE, and one word from a roster claim.** As written it is an abstraction that names no institution and asserts none, which keeps it inside the reading; *arrangements* is vague in the way the register permits and the shipped block uses the word elsewhere. ⚠ The moment it becomes concrete — the watch still stands, the court still sits, the wall is still kept, the gates still close — it asserts a body this key cannot resolve and collides with the rows above it. **The safe object of the clause is the town's ordinary working, not the town's named arrangements.**
- **THE PEOPLE WHO WOULD HAVE TO BE PAID THROUGH ONE.** — **FLOOR-2 (a dependence on an unobserved field), and at the edge of the refused columns.**
  1. Whether this town has anyone on a wage at all is not read here. The generator records a military gate only where there is a paid stack to bite (`defenseGenerator.js:463-468`: `hasAnyDefense`), and calls the community baseline unpaid and exempt (`:187-188`). **On much of this pool's range there is nobody who would have to be paid**, and the paragraph three lines above may be saying so.
  2. *The people who would have to be paid ... know it* asserts a state of knowledge of an entire class of persons. The REFUSED COLUMNS line bars a totality over persons, and this is that shape with a restrictive clause in front of it. It is not the clearest breach in the pool, and it is the one a refuter will reach for.
  The CLAIM underneath is lawful and worth keeping in another form: **what this town can do is keep spending on a thing after it stops being interesting.** State it about the response, not about a class of people and what is in their heads.
- ⛔ **AND THE CONSTRUCTION IS THE POOL FAMILY'S FORMULA.** The same shape runs through three of the four bands of this very table: the WEAK row's *"The people who would have to hold {settlement} through something are already owed, and they have not forgotten it"* and the CRITICAL row's *"…and the people who would have to be paid know it"* (annex `:2692`, `:2698`). A reader meets exactly one band per town, so this is not a reading-order repeat (MOVE-GRAMMAR §0's caveat) — **it is an authoring-time signature of precisely the kind arm E and A11 measure, and the echo key is shared across the whole table** (the card's own echo line). The rewrite of this variant should not hand the formula back.
- **Implicitly: the town is confident, or complacent.** — the face does not assert it and must not. No feeling, no mood, no interior (MOVE-GRAMMAR §1.3's FEELING non-move). The street angle carries the town's PRACTICE, never its temper.

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

As §1.3. What vid 2 uses that vid 1 does not: the band taken as a fact about the town's ORDINARY WEEK rather than about its capacity on paper — what does not stop, what is not cancelled, what goes on being done while something is going wrong. ⚠ Nothing here reads an institution, so the street's natural nouns (the market day, the watch's round, the court's sitting) are all bodies this key cannot resolve.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

| row | why this variant, specifically |
|---|---|
| **a body that is paid** | the shipped clause already walks into it, and the street angle reaches for people by instinct. The lawful subject is the WORK that continues, never the wage or the person drawing it |
| **prosperity** | *the town can afford it*, *there is money behind it*, *the town is comfortable* are the principal finding of §0.8 in street clothes |
| **the roster** | *the watch still stands*, *the gates still close*, *the court still sits* name bodies this key cannot see and that the paragraphs above may deny |
| **a totality over persons** | *everybody here knows*, *nobody goes short*, *the whole town can tell* cross the refused column. *The town* as a civic body is safe; its people quantified are not |
| **the pool family's formula** | see §2.2's last row. A face that runs *the people who would have to be X* is the WEAK row and the CRITICAL row with the polarity flipped |
| **the register already spent on this tab** | the Beasts rows on the same tab already own *"not an emergency arrangement, it is the week's work"* and *"ordinary rather than anxious"* (annex `:2597`, `:2612`). **The street register's best line for an untroubled arrangement is already printed a paragraph or two above**, so this variant must find a different way to say that a thing is unremarkable |
| **the elapsed course** | *the town has never had to find out*, *it has not been tested*, *it came through the last one* are FLOOR-2b, and the siege banner makes them absurd besides |

### 2.5 The preimage, as it bites vid 2

See §0.9 whole. For this variant: the face prints on a town with no paid defence of any kind, under an `indebted` flag, under an active famine banner, and above its own underfunded note. **"The town can go on doing what it does while something is going wrong" survives all of that. "The town has never had to find out" survives none of it, and "the people who would have to be paid" survives only where a wage bill exists, which this key cannot check.**

### 2.6 The angle's stance in one sentence

`[street]` is the town's own talk about its condition (the annex's gloss at `RECEIPT_POOLS_DOSSIER_STATE.md:123`), rendered in the clerk's third person and never in anybody's mouth: it may say what the town treats as ordinary, what it organises its week around, what it does not pretend about itself, and what does not stop when something goes wrong — the practice and the standing habit, never a feeling, never a named person, never a quoted voice, and never a forecast.

### 2.7 The turns worth keeping

- **The subjunctive capability** (*could go through*) — the lawful edge form, and the one that refuses both the magnitude and the prediction. Worth carrying into two faces with two different verbs.
- **The two-part shape: what the town can do, and how that shows** — the variant's architecture is sound even though its second half is not. Keep the shape; change what the second half is ABOUT, from a class of people to the work that goes on.
- **Bare *the town* as subject** — the slotless parent makes this the pool's most portable sentence and the one variant that can open on a plain civic noun with no proper name in it at all, which is what R-DA-17 asks for.
- What to drop: *the people who would have to be paid* in all four faces (the formula and the wage), and a calendrical noun in three of the four.

### 2.8 What would make the rewrite of vid 2 a regression

Any slot at all. Vid 2 not second, or not `[street]`, or fewer than four faces. A face that names a settlement, a person, a body or a record. A second sentence that summarises the first. A face that reads as the town's feeling rather than its practice. **A face that carries the pool family's *the people who would have to be…* construction forward in new words.** Any face reaching for the money reading.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **What the street actually sees is that NOTHING GETS CANCELLED.** This is the row's most concrete unused reading and it is entirely inside the band. The difference between this town and the rung below is not visible in a crisis's first week — it is visible in what else is still happening during it. **The market day is not called off. The building that was being built goes on being built. The thing that goes wrong is one thing going wrong rather than the only thing happening.** That is a standing condition of the town's week, it asserts no institution, and no shipped row in the block has said it.
- **A crisis here becomes ROUTINE rather than an emergency, and routine has a texture.** What the town can pay for is the second month of a thing, and the third. So the response outlasts the alarm: the carts still go out after people have stopped watching them go, and the arrangement stops being news long before it stops being necessary. ⚠ This is the sharpest street reading available, and it must be written about the response and not about anybody's attention span, which would be a feeling.
- **What somebody would complain about, and it is available:** capacity held is capacity not spent. The town is not poorer for it and nobody is better off for it today. **Depth is the one civic possession that does nothing at all until the day it does everything** — and the street's complaint about a town like this is that being told the place could carry a bad stretch is not the same as anything arriving at your door. ⚠ Written generally that is a maxim and trips R-DA-12; it must land on this town's arrangement.
- **The absence of a thing to point at is itself street-level.** Every other row of this desk has an object the town can gesture at: a wall, a gaol, a granary, a body of armed men. This one has none. **There is no building where the town's endurance is kept**, so the town's own talk about it can only be talk about what has not had to stop — which is, precisely, a conversation about ordinary things.

---

## VARIANT 3 · vid 3 · `[counterforce]` · slots `{settlement}` · **the most damaged of the three**

### 3.1 The shipped sentence, verbatim

> Trouble at {settlement} has not turned into a collapse, and the reason is money. A town that can pay through a crisis mostly does.

### 3.2 Every claim it makes, on the new test

- **TROUBLE AT THE TOWN HAS NOT TURNED INTO A COLLAPSE.** — ⛔ **FLOOR-2b on three separate grounds, and it cannot survive in this tense.**
  1. **An elapsed course.** The perfect tense makes a claim about the whole span of the town's past. The card's `may NOT` line bars it outright, no state-prose key reads a history field, and the block's own fence says these are CAPABILITY clauses and never HISTORICAL ones.
  2. **It presupposes an EVENT.** *Trouble … has not turned into* asserts that trouble arrived. There is no event-provenance field here (R-DA-19 bars the event move in R1 STATE; MOVE-GRAMMAR §1.2 row 2 says HISTORY may not exist in R1 STATE at all), and this key reads one number.
  3. **A collapse is an outcome the pulse adjudicates.** The world pulse runs sieges, famine and the food stockpile; declaring that no collapse has occurred is a claim about the campaign's own state, made by a number written at generation and never revisited (§0.9). **Under an active siege or famine banner the sentence is not merely unlicensed, it is contradicted by the page it prints on.**
  The CLAIM worth keeping is the angle's own and it is licensed: **a pressure here does not become a second, different problem.** Stated in the present, as a standing cap, that is the counterforce reading and the block's own ladder supports it by contrast.
- **AND THE REASON IS MONEY.** — ⛔ **CONTRADICTED.** The block's contradiction set: *the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity* (`rewrite/rulings-DEF2-v14.txt`), with the generator's own comment behind it (`defenseGenerator.js:260-262`, `:281-290`). **The set and the generator are the record.** The attribution MOVE is fine — the estate's own counterforce rows attribute a cap to a standing fact, and the Disasters row on this same desk does it in the present habitual — but the thing attributed here is the one reading this arm does not carry.
- **A TOWN THAT CAN PAY THROUGH A CRISIS MOSTLY DOES.** — ⛔ **Three faults in nine words, and it is the worst clause in the pool.**
  1. **A generalisation about towns in general**, which is the gnomic closer R-DA-12 exists to catch and MOVE-GRAMMAR §1.3 lists as a non-move (no MEANING, no VERDICT). It is a life-general sentence no field holds.
  2. **A RATE.** *Mostly* is a frequency over a class of towns. No field carries it, and it is a magnitude of exactly the kind floor 2a refuses.
  3. **A summarising second sentence** — fault 1, the gloss: it says what the first sentence MEANT. R-DA-03 puts the second-sentence summary at zero, and the register card bars closing on a moral or a maxim.
  Nothing of this clause survives. What it was reaching for — that the capacity is the reason rather than the luck — belongs inside the first sentence or nowhere.
- **THE TOWN IS NAMED TWICE in effect** (once by the slot, once by *a town that*). — not a claim; a craft defect. One `{settlement}` per face, inside the sentence and never opening it (T-F8).
- **Implicitly: the town is fortunate, or well governed.** — the face does not assert it and must not. No verdict, no rating word, no praise (`threatAssessment.js` holds the rating and the prose does not restate it).

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

As §1.3, plus the one move this angle owns:

- **THE SIBLING BAND AS THE REJECTED ALTERNATIVE.** R-DA-02 licenses a contrast where the rejected alternative names a sibling pool key or sibling band, and this table's other three rows ARE those bands: ADEQUATE funds a short crisis and begins eating reserves; WEAK is chronic shortfall; CRITICAL cannot fund a response at all and, in its own shipped words, *"each thing that goes wrong makes the next thing cheaper to happen"* (annex `:2697`). **So the cascade this row prevents is a reading the estate already holds on the ladder**, and stating it as the cap is licensed twice over — by the band and by the sibling.
- **THE LAWFUL COUNTERFORCE TENSE IS ALREADY PROVEN ON THIS DESK.** The Disasters row's counterforce line is *"Neither a failed harvest nor an outbreak turns into a catastrophe at {settlement}, and the reason is in the two buildings rather than in the luck"* (annex `:2703`). **Present habitual, not the perfect** — that is the shape that states a cap without an elapsed course, and it is the model for this variant. ⚠ It is also the paragraph immediately BELOW this one on a granary-and-hospital town, so the construction is proof of the tense and not a phrase to borrow.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

| row | why this variant, specifically |
|---|---|
| **the elapsed course** | the shipped clause already breaks it, and the angle invites it: *the thing that did NOT happen* is one tense away from a history. **Every one of the four faces must state the cap in the present, or as a subjunctive edge, and never in the perfect.** *Has not*, *has never*, *did not*, *came through* are all the same finding |
| **prosperity as the cap** | the shipped clause already breaks it. The cap is the arm, and the arm is not the purse |
| **the maxim** | the shipped closer already breaks it. No sentence about towns in general, no rate, no *mostly*, no *usually*, no *always* |
| **the gloss** | a second sentence that restates the first. If a face has two sentences, the second carries a SECOND fact of a different kind (R-DA-03), never the first one's meaning |
| **a prediction** | *nothing will*, *it would take more than*, *no crisis could* are FLOOR-2b. The subjunctive edge is lawful; the outcome is not |
| **an event presupposed** | *the trouble that came*, *what happened here*, *when it arrived* all assert an event with no provenance behind it |
| **the stress banners** | this variant more than the others prints beside a siege, famine, occupation or `indebted` banner. **A face saying nothing has gone wrong here is refuted by the banner six inches above it** |

### 3.5 The preimage, as it bites vid 3

See §0.9 whole. For this variant the range is the whole finding: the same face prints on a quiet inland town and on a town under an active famine with an `indebted` flag and an underfunded-logistics note. **A standing cap survives that range; a claim about what has and has not happened does not survive any of it.**

### 3.6 The angle's stance in one sentence

`[counterforce]` is the thing that did NOT happen, stated plainly as the cap, the prop or the restraint (the annex's gloss at `RECEIPT_POOLS_DOSSIER_STATE.md:127`) — so here it may name what a pressure does not become in this town and attribute that cap to the town's standing capacity rather than to luck, **provided both halves are standing facts in the present tense**: the restraint is a condition, never a record of a non-event, and the thing restrained is a class of pressure, never a thing that arrived.

### 3.7 The turns worth keeping

- **The attribution move** (*the cap, and what the cap is*) — the angle's whole architecture, licensed by the estate's own counterforce rows on this desk. Keep the MOVE; change the tense to the present habitual and change what is attributed from money to the arm.
- **The cascade contrast** — that a pressure here stays one pressure instead of becoming the next one. It is the sibling ladder's own reading turned to this band's polarity, and it is the single sharpest thing this variant can say.
- ***turned into*** as the verb of the cap — the right verb in the wrong tense. *Turns into* is lawful; *has turned into* is not.
- What to drop: the perfect tense in every face, *the reason is money*, and the whole second sentence.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[counterforce]`, or its slot set not `{settlement}` alone, or fewer than four faces. A face that opens on the `{settlement}` proper slot, or names the town twice. **Any face in the perfect tense, and any face that carries the maxim or the rate forward in new words.** Any face whose second sentence summarises its first. Any face that keeps money as the cap.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- ⭐ **NOTHING HAS TO BE STOPPED TO PAY FOR WHAT IS HAPPENING. That is the counterforce reading of this band and it is both concrete and unused.** On the rungs below, a crisis is paid for by not doing something else: a work halted, a wage deferred, a purchase put off, a thing taken from one arrangement to prop up another. Here the response and the ordinary week run at the same time. **The restraint this row names is not on the crisis at all; it is on what the crisis is allowed to cost the rest of the town.** No shipped row in the block has touched it.
- **A pressure here stays ONE pressure.** The ladder's own bottom rung says that on a poor town each thing that goes wrong makes the next thing cheaper to happen. The cap at this band is exactly the refusal of that arithmetic: the first problem does not buy the second one. **That is a standing condition, stated in the present, with the sibling band as its licensed contrast** — and it is the most precise thing this angle can say about a number.
- **What is NOT collected, and a stranger would notice its absence.** There is no extraordinary appeal, no emergency collection, no requisition, no list of who must contribute what. The record is silent about all of that and silence is permission, so the absence is available. **A town at this band handles a crisis without asking the town for anything it was not already giving**, which is a visible fact about an invisible capacity, and it is the one thing on this row that a person standing in the street could actually observe.
- **The cap is not luck, and saying so is licensed if it is said about the arrangement.** The estate's own Disasters counterforce row draws exactly that line between an arrangement and a run of good fortune. ⚠ That row prints immediately below this one on a granary-and-hospital town, so the DISTINCTION is available and the WORDING is spent: this face must find its own way to say that what holds here is a capacity rather than an accident.

---

## 4. THE PACKET'S OWN VERDICT, for the writer's first pass

- **This pool's shipped spine is sound and its shipped vocabulary is mostly not.** The one claim that survives untouched across all three variants is the band's own reading: **a town that can carry a pressure which runs long, and go on paying for the response while it runs.** Everything else needs to move.
- **Three CONTRADICTED clauses, all in the same family, and none may survive in any form:** *out of its own revenue* (vid 1), *the garrison can be kept paid* (vid 1), *the reason is money* (vid 3). The first and third are the same finding — the block's set rules that this arm is food-storage-driven resilience and never prosperity — and the second names a body this key cannot resolve and a pay gate that belongs to a different row.
- **Two FLOOR-2 clauses:** vid 3's *has not turned into a collapse* (an elapsed course, an event presupposed, and an outcome the pulse adjudicates) and vid 2's *the people who would have to be paid* (a dependence on a wage bill this key does not read, plus a totality over a class of persons).
- **One whole sentence leaves:** vid 3's *A town that can pay through a crisis mostly does* — a maxim, a rate and a gloss in nine words.
- **Two constructions leave by law:** vid 1's coordinated colon tail (R-DA-03) and, in three of four faces, the pool family's *the people who would have to be…* formula that runs across three of this table's four bands.
- ⛔ **The trap that is easiest to fall into is not a law but the PAGE.** The score is up to seventy per cent months of stored food, and the paragraph printed immediately below it on every town in the range is about the granary. **A face that reaches for grain, stores or a bad harvest has written the next paragraph early.** The discriminating dimension of this row is DURATION and EXPENDITURE: not what the town holds, but what it can go on doing while something runs long.
- **The largest unused material is the three readings §1.9, §2.9 and §3.9 open:** that the band measures the endurance of a spending rather than the size of a store; that what the street sees is the things that are NOT cancelled; and that at this band nothing has to be stopped to pay for what is happening, so a pressure stays one pressure instead of buying the next.
- **One hard constraint the writer will not expect:** this pool resolves NO holder. No record and no keeper may be named in any of the twelve faces, and the `[ledger]` angle must sound like the record without citing one.
