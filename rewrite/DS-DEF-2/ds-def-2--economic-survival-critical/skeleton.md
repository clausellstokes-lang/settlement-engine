Seat: MARKER (opus), DS-DEF-2 · pool `Economic Survival: CRITICAL` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Economic Survival: CRITICAL` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[unfolding]` `[street]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2695-2698`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:872-894`; the pool's manifest row at `:1338-1352` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:884`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusal line: *a face whose `{slot}` set differs from the parent's* is refused at projection), so **vid 2's four faces never name the town**, and vid 1's and vid 3's four faces each carry `{settlement}` exactly once.

⚠ **AND T-F8 BITES VID 1 HARDER THAN IT BITES ANY OTHER ROW IN THIS POOL.** A sentence-form face may not OPEN on a `proper`-typed slot of the block's bag (ARCH §2.5's same row; §4.2 step 8; the risk register's row 34). The shipped vid 1 opens on `{settlement}` — the PARENT row is grandfathered, **its four faces are not.** Every one of vid 1's faces must put `{settlement}` inside the sentence and never first. Vid 3 already does this correctly and its faces must keep doing it.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

⭐⭐ **THE ONE THING THE WRITER MUST TAKE FROM THIS PACKET BEFORE ANYTHING ELSE.** All three shipped rows read this band as **an empty purse** — *cannot fund*, *nothing to spend*, *could not pay*, *the people who would have to be paid*, *cheaper to happen*. The block's own contradiction set rules the opposite in as many words: **the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity** (`rewrite/rulings-DEF2-v14.txt`), and the generator says the same thing in its own comment (`defenseGenerator.js:260-264`, `:281-290`). Worse, the arithmetic puts a large share of this pool's range on towns whose economy is *fine* and whose score was driven under twenty by a **stress penalty subtracted after the gate** (§0.9). On those towns the purse reading is not merely tired, it is false, and the row's own funding note is absent to prove it. **The writer should expect to keep the shipped SPINE — a town that cannot mount a response to a pressure — and to lose nearly all of the shipped vocabulary.** This pool is the one in the block whose shipped rows carry real contradictions rather than tired constructions, and it carries more of them than its `STRONG` sibling does.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: CRITICAL'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Economic Survival: CRITICAL`)
  reads:      scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js) === CRITICAL
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation; the
              relation is the MODIFIER's property, fixed at its freeze (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
              n/a
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
  may claim:  that the reader `scoreBand(economicScore)` selects the row `CRITICAL` of
              `ECONOMIC_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
```

⚠ **Four card lines are load-bearing here and each is stricter than it looks.**

1. **`source: (none) · SOURCE-UNRESOLVED` is the hardest line in the packet.** This pool has NO holder. The holder table maps the defence institution buckets and `economicGates` to the MUSTER (`src/domain/prose/holderTable.js:195`) and the food stockpile's blockade fields to the TOLL BAR (`:184-185`), but `defenseProfile.scores` appears in it nowhere. So **no face may name a record or its keeper** — not the treasury's books, not the muster roll, not the market's returns, not the granary's tally, not "the books", not "the roll", not "the count", not "the accounts". Arm A13 refuses the face outright. This bars the one move the `[ledger]` angle reaches for first, and the writer must find the ledger's voice in the ORDER and the FLATNESS of the sentence rather than in a named record. The exemplar registers with raw text cite at zero per 786 sentences (Part B §24), so zero is also the norm.
2. **`may NOT: a magnitude outside the read's own band word`.** The band word is the whole quantity. `CRITICAL` is `economicScore < 20` on a 0 to 100 ladder (`src/domain/display/defenseScoreBands.js:38-39`). ⚠ **CRITICAL is the one band of the four that is a CEILING rather than a floor** — nineteen and zero print the same face — and this cuts the opposite way from its siblings. `STRONG` had to avoid over-claiming upward; **`CRITICAL` must avoid over-claiming downward.** *Nothing at all*, *empty*, *bare*, *not a penny*, *stripped*, *destitute* are magnitudes at the floor, and the record refuses the floor in its own comment (§0.5 note 5: the gate is never zeroed because physical grain retains value when the treasury is empty). The safe reading is an INCAPACITY, never an emptiness.
3. **`may NOT: an elapsed course`.** This bites the `[unfolding]` variant at its hinge — see §2.2 — and `[unfolding]` is the hardest of the three angles to write on this card, because the angle reaches for exactly the move the card refuses.
4. **`audience: player (no mark)`.** Every face here is read by the player. There is no DM twin on this pool and nothing may be said that would be an audience breach on the player's page.

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat`, the institution presence flags and `compound.inst`. This pool is **row 4's `CRITICAL` branch** and it is the ONE row of the five keyed on a NUMBER rather than on booleans.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at this block's call sites. See the wall above: this pool's three parents are NOT uniform and each face inherits its own parent's set.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job here is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses and never HISTORICAL ones** unless the history surface supplies the ancestry. It does not here. ⚠ This fence is written about institutions, and it binds this row harder than any other, because this row's number is the only one on the desk that LOOKS like it has a history in it. It does not. It is a birth-time reading (§0.9's clock row).
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `ECONOMIC_ROW_POOL` (`STRONG`, `ADEQUATE`, `WEAK`) and never a second print of this one.
- **PDF PARITY:** parity (`viewModel.js` defense slice) — every face prints in the PDF as well as on the tab.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges; every answerable plant answered, and some left open.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical (§16). No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows — **and here the card licenses none.**

⚠ **The no-digit rule is sharper on this pool than on any other in the block.** The read is a NUMBER banded into a word, and every neighbouring surface prints figures: the bar is drawn at `width: ${sc}%` (`DefenseTab.jsx:333`), the badge prints the band word, and this row's funding note prints a percentage (`defenseDisplay.js:319-321`). The prose is the one place on that row where the reader gets the word and never the digit (`defenseScoreBands.js:15-19`, the legibility note in the module's own docblock). **No face may carry a number in any form** — not a figure, not a spelled count, not "a month", not "a week", not "a third of", not "twice".

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first in its own composed unit, and the tab stacks the five rows' prose as ONE italic block of paragraphs above the five bars (`DefenseTab.jsx:317-321`). **This row is NEVER the first paragraph and NEVER the last** — see §0.7.1, which fixes its neighbours exactly. Every face must read well immediately after an `Internal Security` paragraph and must hand a noun forward that a `Disasters & Famine` paragraph can pick up. Adjacent sentences of a composed unit must connect: an added sentence carries a noun forward, or its change of subject is the passage's one turn outward and sits last.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness. **THE CEILING, NOT THE MIDDLE (§21.1).** The band is a licence, not a target; the refinement pushes toward the sharpest licensed fact, never toward the estate median.

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

The caller hands it `dp.scores?.economic` (`defenseStateProse.js:660`), and the ladder is `scoreBand` (`defenseScoreBands.js:38-39`): **STRONG at sixty-five and above, ADEQUATE at forty, WEAK at twenty, CRITICAL below twenty.** ⚠ **An absent or non-finite score is SILENCE and NOT CRITICAL** — the key function says so on its own docblock line (`defenseStateProse.js:544-546`: *an absent or non-finite score is SILENCE, never CRITICAL*), and `avgScore` gives the reasoning at `defenseScoreBands.js:63-64` (*an absent score is not a zero, and a consumer that banded 0 would report CRITICAL for a settlement that simply has no defence profile*). **So a face here always speaks of a town whose score was actually computed and actually landed under twenty. There is no "the record does not say" reading available on this key, and an ABSENCE move on the score itself would be false.**

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `defenseProfile.scores.economic` banded to **CRITICAL** | the bottom rung of the frozen four, on the economic arm of the five-arm defence assessment | **NONE. `SOURCE-UNRESOLVED`** (`holderTable.js` carries no `scores` row; the sibling `economicGates` resolves to the MUSTER at `:195`) | the one thing the band means in the desk's own framing: **the town cannot mount a response to a sustained pressure.** The desk's legacy string for this exact branch is *"Economic base cannot support crisis response. Any sustained threat quickly overwhelms the capacity to respond."* (`threatAssessment.js:173`), so the incapacity, the word "crisis response" and the "sustained" framing are all the estate's already | **what the score is MADE OF may not be asserted from the band word.** It is a five-term sum damped by a gate and then cut by stress penalties, so **no single term is licensed by the total** — and on this band in particular, no single term is licensed as the thing that FAILED |

**WHAT THE NUMBER IS ACTUALLY BUILT FROM (`src/generators/defenseGenerator.js:262-291`, then the stress block `:336-424`, then `:604-624`) — read this before writing a word, because every shipped error in this pool comes from guessing it wrong:**

1. **Months of stored food, and this is the dominant term** — `storageScore` is capped at seventy of the hundred (`:265-269`), from `config._foodSecurity.storageMonths`, which is itself set by which granary row the town holds and whether it has a mill (`foodGenerator.js:160-165`: a state granary gives eight or twelve months, a city granary five or seven, a plain granary two and a half to five, and nothing at all one to one and a half, all times one and a quarter with a mill).
2. **A market** (+10), **a hospital** (+10), and the route: a **port** with maritime world law (+10) or a **crossroads** (+8) (`:270-276`).
3. **The economy's output**, one fifth of it, added and capped (`:277`).
4. **An alchemy bonus** where the town has both alchemy and a granary (+8, `:279`).
5. **The economic-health gate**, a MULTIPLIER from `0.45` to `1.0`, identity at `economyOutput >= 50` (`:289-290`). ⭐ **The generator's own comment is the most important sentence in this packet:** the additive stack above is almost entirely wealth-independent, and the gate is *"linear down to ×0.45 at 0 (physical grain in a granary retains value even when the treasury is empty — **never zero it**)"*. **The record refuses, in as many words, to say this town has nothing.**
6. **Then the stress penalties, subtracted AFTER the gate** (so their absolute magnitudes keep their meaning, by the comment at `:287-288`): siege minus twenty-five (`:350`, mitigable to minus ten or minus eighteen by arcane or druid), famine minus twenty (`:379-380`, mitigable to minus eight, minus twelve or minus fifteen; alchemy takes three more off), plague onset minus fifteen (`:398`, mitigable to minus eight or minus ten), indebted minus fifteen (`:424`).
7. **Then the food-processing chain bonus**, plus five when healthy and minus eight when impaired (`:604-606`, applied at `:624`), and the sum is clamped into nought to a hundred at `:625`.

**Five consequences the writer must hold, and the first two are the whole packet:**

- ⛔ **THE BAND IS NOT A PURSE.** It is mostly a measure of how many months of food the town is standing on, damped by how well its economy runs, then cut by whatever is currently pressing on it. The block's own set states it flatly: *the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity.* A face that makes an empty treasury the subject is writing a different field.
- ⛔ **THE BAND IS NOT THE PAY GATE, and it is certainly not garrison wages.** The funding note under this very row is the SEPARATE multiplier `economicGates.economic` (`:471`), whose expense is named **"crisis logistics"** (`defenseDisplay.js:283`). **Garrison pay is the MILITARY gate's expense** (`:280`) and belongs to the `Invasion & War` row three lines above. Shipped vid 3's *"the people who would have to be paid"* is that row's subject, on this row.
- **The band is a composite and none of its terms is licensed alone.** A face that says the granary is empty asserts one of five terms. A face that says the market has failed asserts another. The band says the SUM landed under twenty and nothing whatever about which term did it.
- ⭐ **THE BAND HAS TWO DISJOINT CAUSES AND THE FACE MUST BE TRUE UNDER BOTH.** A town reaches CRITICAL either by never having had capacity (a thin store, no market, no route, a low output, the gate at its floor) or by having had a good deal of it and losing the use of it to a pressure that is on the page right now (§0.9's arithmetic). **No face may describe HOW the town got the band**, because two towns in this pool got it from opposite halves of the sum — and one of them is standing on a full granary while its badge reads CRITICAL.
- **The lowest reading the record will sign is "cannot mobilise", never "has nothing".** The gate floor and its comment are the record's own refusal of the floor.

**The reads the desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- **No institution at all.** This key reads no walls, no garrison, no militia, no watch, no court, no prison, no granary flag, no market flag and no hospital flag. The other four rows of this same desk read exactly those (`defenseStateProse.js:655-663`). **Whatever body a face here names, this key cannot resolve it.**
- **No stress.** `config.stressTypes` is read by NO key function of this block (the block's own set says so). This pool prints under `under_siege`, `occupied`, `famine`, `plague_onset`, `indebted`, `monster_pressure` and `wartime`, each of which renders its own banner on the same tab (`DefenseTab.jsx:240-245`) — **and yet the stress penalties are a main route INTO this band.** That asymmetry is the pool's central hazard: the writer knows a stress is probably there and the key cannot say so.
- **No country, no tier, no route, no terrain, no culture, no population.** The route contributes to the SCORE (a port or a crossroads) but is invisible to the key.
- **The funding note printed under this row can contradict a careless face in either direction.** `READINESS_GATE_FOR['Economic Survival']` is `['economic', 'crisis logistics']` (`defenseDisplay.js:283`), and the note renders whenever the gate is below one: *"Upkeep underfunded: crisis logistics at NN%"* (`:317-321`; rendered at `DefenseTab.jsx:343`, inside the expanded row). On most of this pool's range the note is there; on the stress-driven part of the range **it is absent, because the gate is one** — and a face that asserts underfunding on those towns is denied by the row's own note being silent. See the contradiction table.

### 0.6 The provenance move, priced for this pool: ZERO, and it is a wall rather than a recommendation

The card prints `source: (none) · standing SOURCE-UNRESOLVED` and says in its own line that **no citation is licensed and a face naming a record holder is refused by arm A13.** That is not the budget speaking (Part B §24's ceiling of one citation per unit for one of S3's three reasons); it is the holder table having no row for `defenseProfile.scores`. So:

- **No named keeper, no named record, in any face.** Not the treasury, the market, the granary, the muster, the toll bar, the elders, the road.
- **Record VOCABULARY is a separate question and the writer should be careful with it here.** On a pool WITH a holder, words like the roll and the return are free vocabulary. Here the absence of a holder makes any such noun read as the citation the card refuses, and the `[ledger]` angle is the one that will reach for it. **The `[ledger]` face must sound like the record without naming one** — flat order, the fact first, the qualification in its own sentence (R-DA-03).
- MOVE-GRAMMAR §4.4.3's own closing clause is worth keeping in view: *a citation on a fact whose holder is the office itself is a finding — the office does not cite its own books.*

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE — the neighbours here are FIXED rather than variable

#### 0.7.1 This row's two neighbours in the prose block are the same two on every town that reaches it

The block renders `['beasts','invasion','internal','economic','disaster']` in that order, filtering out silent rows (`DefenseTab.jsx:113-114`). Of those five keys:

- `beastsRowPoolKey` **can be silent** — `beastsRowSituation` returns `''` for a plagued or settled country with a force and no perimeter, and for a frontier country with a perimeter and no force (`defenseStateProse.js:429-440`).
- `invasionRowPoolKey` is **TOTAL over six situations** (`:443-492`, the docblock says so).
- `internalRowPoolKey` is **TOTAL over four** (`:493-508`).
- `disasterRowPoolKey` is **TOTAL over five** (`:546-599`).

**Therefore this paragraph is never first and never last. It is always preceded by an `Internal Security` paragraph and always followed by a `Disasters & Famine` paragraph, on every town in the range.** That is the most precise thread fact any pool in this block has, and the writer should use it:

- **The sentence before it** is one of four: the full legal chain, the court without detention, the detention without process, or no legal machinery at all. Each closes on law, process, enforcement, the watch's temper, or force alone.
- **The sentence after it** is one of five and every one of them is about **FOOD and the SICK**: holding food against a bad year, a full store and a modest infirmary, feeding through a failed harvest with nothing against disease, no reserves with a hospital, or neither.

#### 0.7.2 ⛔ THE SHARPEST HAZARD IN THE PACKET: the paragraph immediately BELOW is made of this row's own biggest term

The economic score is up to seventy per cent food storage. The `Disasters & Famine` paragraph that follows it is about the granary. **So the single most natural thing to write here is the next paragraph's subject, printed one line early.** A face that reaches for grain, stores, a full or empty granary, a bad harvest, months of buffer, or a store drawn down is writing the sentence the reader is about to read.

This row's discriminating job, against that neighbour, is the **DURATION and the MOBILISATION of a RESPONSE**: the Disasters row says what the town HOLDS against hunger and sickness; this row says what the town can DO, and keep doing, while a pressure of any kind runs long. The desk's own two strings draw exactly that line (`threatAssessment.js:173` against `:181-188`).

⭐ **AND ON THIS BAND THE TWO ROWS CAN OPENLY DISAGREE, which is a gift rather than a problem.** `disasterRowPoolKey` reads `compound.inst.hasGranary × hasHospital × hasChurch`, three booleans that are blind to the economic score; this row reads a number that a siege or a famine can have cut in half after the fact. **So the record can print, in two consecutive paragraphs, that the town holds food against a bad year and has somewhere to put the sick, and that its economic survival is CRITICAL.** (Arithmetic from the cited lines: a town granary gives five storage months → `storageScore` 38; plus a hospital 48; plus a fifth of a low output, say 50; the gate at an output of ten is `0.56` → 28, which is WEAK; a siege takes twenty-five off → 3, CRITICAL. The `Disasters & Famine` row is unmoved.) That is the register card's *carry two accounts and settle neither* standing right there on the page, unused by all three shipped rows.

#### 0.7.3 The same number speaks again on the Overview tab, in its own sentences

`DS-GEN-3` bands the SAME field through the SAME ladder and speaks it beside the Systems Health score bars (`generalStateProse.js:294`, the key `scores.${axis}: ${scoreBand(score)}`). Its shipped `scores.economic: CRITICAL` rows are at `general.generated.js:2366-2390`:

> vid 1 `[ledger]`: *"…holds no reserve at all; what comes in is spent before it is counted."* · vid 2 `[visitor]`: *"…is not poor the way a small place is poor. It is poor the way a place is poor when nothing is holding it up."* · vid 3 `[street]`: *"Everything in {settlement} depends on the next thing arriving, and everyone here knows which thing."*

**That is the same fact, banded the same way, in the same dossier, on another tab** — and note that all three reach for poverty, which is the reading the block's set rules out here. DS-GEN-3 has its own lane and its own four faces coming. ⚠ **A face here that turns on poverty, on what comes in, on what is spent, or on the next thing arriving is that pool's sentence and not this one.** The two pools fire on exactly the same towns, so the collision is guaranteed rather than possible.

#### 0.7.4 On the defense tab itself, DS-DEF-6's `Economic Backing` pools are SILENCED because this row speaks

The desk's own docblock names this pool by its key function (`defenseStateProse.js:1473-1475`): *ECONOMIC BACKING ⇄ `defense.threatAssessment` (DS-DEF-2 row 4, `economicRowPoolKey`). Both band `defenseProfile.scores.economic`;* and it cites **this pool's STRONG sibling's garrison-pay clause** as the reason. The four `Economic Backing` pools sit in `DEF6_C3_BLOCKED_POOLS` (`:1496-1499`) and never print.

**Three consequences.** First, there is no same-tab collision to avoid with those words: they are not on the page. Second, for the chair rather than the writer: **the C3 block was justified on the ground that this row already speaks the funding reading**, so a rewrite that drops funding entirely from all twelve faces weakens that justification, and the packet records it here rather than leaving it to be re-found. **The lawful funding subject on this row is `crisis logistics` — this row's own gate expense — and never garrison wages.** Third, the blocked `Economic Backing: Critical` rows (`RECEIPT_POOLS_DOSSIER_STATE.md:2976-2979`) are worth reading once and then setting aside: they are the pure wage reading (*cannot sustain armed forces at all* · *stopped being able to pay for its own defense* · *nobody is being paid to defend it*), and the shipped rows of THIS pool are drifting toward them.

#### 0.7.5 ⚠ A live same-tab neighbour that DOES print, and that owns the reserve vocabulary outright

`DS-DEF-6`'s `Logistics & Supply` pools render on this same tab through `supportingLines` (`DefenseTab.jsx:165-171`), keyed on `granary × port × isolation` (`defenseStateProse.js:1528-1532`). Their shipped rows (`RECEIPT_POOLS_DOSSIER_STATE.md:3026-3049`) include *"holds no food buffer at all. Any interruption to supply becomes a survival question within days rather than seasons"*, *"eats what arrives, and has nothing put by"*, and *"is one interrupted week from a genuine crisis"*. **Every one of those is a plausible mis-write of this pool's face, and every one of them is already on the page, lower down, in a pool that actually reads the granary flag and the route.** The reserve, the buffer, the interruption and the days-rather-than-seasons frame all belong to that lens. This row's own subject is narrower and is named in §0.8's flavour rows.

#### 0.7.6 The legacy assessment string and the funding note both sit behind a click, on the same row

`buildThreatAssessment`'s `assess` text and the `fundingNote` render only when the reader expands the row (`DefenseTab.jsx:342-344`). The prose paragraph is always visible; those two are one click away. ⚠ **The ladders do not agree.** `scoreBand` cuts CRITICAL at twenty; `buildThreatAssessment` cuts its bottom branch at twenty-five (`threatAssessment.js:170-173`). So the *"Economic base cannot support crisis response"* string is the expanded text for every town in this pool **and also for the top of the `WEAK` pool** (scores twenty to twenty-four), whose badge reads WEAK. That window is a wiring row for the chair, not a licence — but it does mean the writer may rely on the legacy string being present under every face of this pool without exception. The bar colour and the badge colour are both the deep red on this whole range (`threatAssessment.js:160-164` cuts its colour at thirty-five; `defenseScoreBands.js:31-32` at twenty).

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into

The block's own set is `rewrite/rulings-DEF2-v14.txt`. The rows below are the ones this key can actually reach.

| the claim that would be false | the field that denies it, and which of the two is the record |
|---|---|
| ⛔ **AN EMPTY PURSE AS WHAT THE BAND MEASURES — poverty, destitution, no money, nothing to spend, no revenue, an empty treasury, no coffers, a failed market, "the town is poor"** | **the block's own set, verbatim: the economic-survival arm is FOOD-STORAGE-driven resilience and never prosperity.** The generator agrees in its own comment: the additive stack is almost entirely wealth-independent, and the gate exists precisely so that *a destitute famine port could still score ~70 "Strong economic base"* — the gate DAMPS the stack, it does not define it (`defenseGenerator.js:260-264`, `:281-290`). **The generator is the record.** ⚠ And DS-GEN-3 owns the poverty reading on the Overview tab for the very same field and band (§0.7.3), so this is a collision as well as a contradiction. Note how far it reaches: *cannot fund*, *nothing to spend*, *could not pay*, *cheaper to happen* are all this row, and all three shipped variants carry one |
| ⛔ **A GARRISON, SOLDIERS, PAID MEN, WAGES, "the people who would have to be paid"** | three denials at once. (a) The alias rule of the block's set: *"the garrison" only where a Garrison or Multiple garrisons row resolves* (city tier) — **and this key reads no institution at all**, so it can resolve nothing. (b) The preimage: the same face prints on a town whose `Invasion & War` paragraph three lines above reads *"{settlement} has no line and no force"*. (c) The pay gate is a DIFFERENT multiplier: garrison wages are `economicGates.military` (`defenseDisplay.js:280`), this row's gate is `economicGates.economic` and its expense is **crisis logistics** (`:283`). **The roster and the gate table are the record.** ⚠ This is also the exact clause the desk cited when it blocked DS-DEF-6's `Economic Backing` pools (`defenseStateProse.js:1473-1475`) |
| ⛔ **"there is nothing left" / "nothing at all" / "the town has been stripped" / "not a thing in hand" — the FLOOR asserted** | the gate's own floor and its comment: `econHealthMult` is `min(1, 0.45 + econOutput/50 × 0.55)` and the comment says *physical grain in a granary retains value even when the treasury is empty — **never zero it*** (`defenseGenerator.js:283-290`). Further, `CRITICAL` is a CEILING at twenty and the same face prints at nineteen and at zero, so the floor is a magnitude the band does not hold (floor 2a). **The lawful extreme is an incapacity to mobilise, never an emptiness** |
| ⛔ **UNDERFUNDING asserted as the reason — "the purse is short", "the upkeep is not paid", "there is no money for it"** | on the STRESS-DRIVEN part of the range **the gate is exactly one and the funding note is ABSENT**, because `econHealthMult` is identity at `economyOutput >= 50` (`defenseGenerator.js:289`) while a siege, a famine and a plague onset can take sixty points off afterwards (`:350`, `:379`, `:398`). On those towns the record's own attribution line says nothing about funding and the badge still reads CRITICAL. **The absent note is the record.** ⚠ The inverse row is also live: on the OTHER part of the range the note IS printed, so a face asserting that everything is paid for is denied too. The safe course is to assert neither |
| ⛔ **A STRESS NAMED OR IMPLIED — a siege, a famine, a plague, a blockade, a war, a debt, "the trouble", "what is happening here"** | no key function of this block reads `config.stressTypes` (the block's set says so), and this pool fires on towns with NO stress at all: a thin-store, low-output town reaches CRITICAL on the arithmetic alone (§0.9). A face presupposing a live crisis is contradicted on every quiet town in the range. ⚠ Shipped vid 2's *"not spending its way out of trouble"* presupposes exactly that |
| **A GRANARY, A STORE, A BUFFER, MONTHS OF FOOD, GRAIN, A FAILED HARVEST** | three grounds. (a) It is one of five terms and the band licenses only the sum. (b) The `Disasters & Famine` paragraph immediately below owns the reserve reading on its own flags, and the block's set warns that `hasGranary` is a TIER PROXY that says nothing whatever about the stock inside it. (c) **On this band the two rows can be outright opposed** — a town with a full granary and a hospital can read CRITICAL after a siege penalty (§0.7.2's arithmetic), so a face asserting an empty store is contradicted by the paragraph one line down. And `Logistics & Supply` owns the buffer vocabulary lower on the same tab (§0.7.5) |
| **A MAGNITUDE: how soon, how long, how little, "immediately", "within days", "a bad month", "a single week"** | floor 2a. `CRITICAL` is a ceiling at twenty on a hundred-point ladder and the same face prints at nought and at nineteen. *Sustained* is the desk's own word (`threatAssessment.js:173`) and is safe; *almost immediately*, *a bad month* and *one interrupted week* are quantities the band does not hold — and the last of those is `Logistics & Supply`'s shipped line |
| **A COUNT, A FIGURE, A SPELLED NUMBER, A SEASON, A NUMBER OF MONTHS** | no digits in prose (A4); the band word is the reader's quantity by the legibility law (`defenseScoreBands.js:15-19`); the months belong to the food-security ladder; and this row's own bar and note print the figures one click away |
| **A CAUSE, A DATE, A DECLINE, A COLLAPSE NARRATED, "it has come to this", "since", "no longer", "used to", "each season"** | FLOOR-2b (an elapsed course) and the block's own fence: these are CAPABILITY clauses and never HISTORICAL ones. **This score is judged once at generation and never re-judged** (§0.9's clock row), so there is no history in it to narrate. ⚠ This is the `[unfolding]` variant's whole shipped hinge (*each thing that goes wrong makes the next thing cheaper to happen*) and it must be rebuilt rather than rephrased |
| **A PREDICTION the simulation adjudicates: "will be overwhelmed", "cannot survive", "the next thing will finish it", "will not last"** | FLOOR-2b. The world pulse adjudicates sieges, famine and the food stockpile (`src/domain/worldPulse/foodStockpile.js`), and the block's set already strikes one shipped clause of this shape elsewhere (*takes this town with ladders*). The lawful form is the capability clause in the present and the subjunctive edge (A2, MOVE-GRAMMAR §1.4 constraint 2), never the outcome |
| **A TOTALITY OVER PERSONS: "nobody here has anything", "everyone is hungry", "the whole town is destitute"** | the REFUSED COLUMNS line, and an exemption from a duty (`whoIsExempt` is null everywhere). The town is a civic body; its people counted or quantified are not this row's subject. ⚠ A BOUNDED class is a different thing and is not this row — but see §3.2 on the third variant's closing clause, which three of the four band siblings share |
| **"the guard", "the watch", "the militia"** as the body that goes unpaid or unfed | the block's alias set: *the guard* is the power generator's FALLBACK label on a town whose safety profile prints that there is no meaningful guard presence (`safetyProfile.js:300`); *the watch* as a NAME only on a resolved watch row; *the militia* only where the militia row resolves. **This key resolves none of them** |
| **`plagued` read as disease, `settled` read as "no live threat"** | the engine meanings from the block's set. This key does not read the country at all, so neither word belongs in a face here in any reading |
| **A MINTED PROPER NAME** borne by the face (a person, a family, a market, a lane, a road) | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The town's NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **AN UNNAMED PERSON'S ACT on an office the tier emits as a NAMED NPC** | `TIER_MANDATORY_ROLES` seats named office-holders per tier with generated personality and disposition (`npcGenerator.js`). A reeve, a mayor, a steward or a treasurer written as an actor is the trap. Use a plural, a bystander, or an office the roster does not seat |
| **CULTURAL FURNITURE the town's own culture profile denies** — a market green, a churchyard, thatch, a harvest fair — on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` profile | `cultureProfiles.js`, rendered at `dailyLifeLogic.js`. **The product is setting-agnostic and no defense pool reads the profile.** The recut names this the finding most likely to recur in every block |
| **EXPLAINING OR OUTRUNNING THE BADGE** | here the band word IS the badge (`DefenseTab.jsx:324-326` bands the same `scores.economic`), so unlike the other four rows the prose and the bar cannot disagree — but the prose may not become a gloss of the bar either (MOVE-GRAMMAR §1.3: there is no MEANING move). Saying the town scores badly on the economic arm is the label read aloud, not a sentence |
| **AN ABSENCE MOVE ON THE READ ITSELF — "the record does not say what the town could do"** | the key function's own docblock: *an absent or non-finite score is SILENCE, never CRITICAL* (`defenseStateProse.js:544-546`). The score on every town in this pool was computed and did land. There is no typed gap here, and R-DA-08 bars an absence written where the world holds a fact |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these do not carry may not be asserted: the institution roster read through the LIVE ruin-filtered roster (`institutionRoster.js`, `liveInstitutions`); the seven defence buckets (`defenseInstitutionBuckets.js:83-110`), **none of which this key reads, so none of which may be asserted**; the faction list; the faith entries; the NPC office roster; **and the holder table (`holderTable.js`), which for this pool is EMPTY — no keeper of this fact exists in the record at all.** Everything else the record is silent about is the writer's, and silence is permission.

**Not a faith pool.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the `suppressed` flag do not arise here and no face may reach for them.

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

`Economic Survival: CRITICAL` fires on **every town whose `defenseProfile.scores.economic` is a finite number below twenty**, and on NOTHING ELSE about the town. That is a single numeric threshold on a composite that has already been damped by a gate and cut by stress penalties, and it is the widest preimage in the block.

- **Every tier.** The score reads no tier. In practice the storage term leans the range toward towns without a granary row (`foodGenerator.js:160-163`: nothing at all gives one to one and a half months, which is a `storageScore` of ten to fifteen), so the untouched part of the range leans village-and-below — **but it is not fenced there, and the stress route puts cities in it.**
- **Every country tier, every route, every terrain, every culture, every population band.** None is read. A port contributes ten to the SCORE and is invisible to the key.
- ⭐ **TWO DISJOINT POPULATIONS, and this is the fact that governs every face.**
  - **(a) The never-had-it town.** No granary, so one to one and a half storage months (`storageScore` ten to fifteen); no market, no hospital, no port, no crossroads; a low `economyOutput`, so the gate sits near its floor of `0.45`. Arithmetic from the cited lines: a `storageScore` of ten plus a fifth of an output of twenty is fourteen, times a gate of `0.67`, is nine. **CRITICAL, with no stress anywhere on the page, no banner, and the funding note printed.**
  - **(b) The had-it-and-cannot-use-it town.** A town granary (five storage months → thirty-eight), a hospital (ten), an output of ten (two): fifty, times a gate of `0.56`, is twenty-eight — WEAK. Then a siege takes twenty-five: **three. CRITICAL, with a full granary, a hospital, a siege banner on the same tab, and the `Disasters & Famine` paragraph one line below saying the town holds food against a bad year.** Add a famine and the score is nought.
  - **(c) And the corner that kills the underfunding reading.** With `economyOutput` at fifty the gate is exactly one and the funding note is ABSENT. A pre-stress score of forty-two (a plain granary, a market, a middling output) minus a siege's twenty-five and a plague onset's fifteen is two. **CRITICAL, fully funded by the record's own attribution line, with no note under the row at all.**
  - **A face must be true on (a), (b) and (c) at once.** That is the wall the three shipped rows walk into: each of them is written for (a) alone.
- **Every stress state, and the stress states are a main route in rather than an edge.** No key function of this block reads `config.stressTypes`, and the penalties are subtracted after the gate. **A face here prints beneath a siege banner, a famine banner, an occupation banner, a plague banner and an `indebted` flag** — and on much of the range one of those is the reason the badge reads CRITICAL at all. ⚠ `indebted` deserves its own line for the opposite reason it deserved one on the `STRONG` packet: **the record CAN flag this town as in debt, and it frequently will not.** Debt is a fifteen-point penalty on a separate flag, not a reading of this band, so a face that calls the town indebted is asserting a flag the key cannot see.
- **The mitigations mean magic can be the difference.** An arcane teleportation town takes ten from a siege instead of twenty-five; a druid town takes eight from a famine instead of twenty; alchemy takes three more off. So two towns in identical material circumstances sit in different bands, and **nothing about the town's magical provision may be read off this band either way.**
- **ONE CLOCK, AND IT IS THE BIRTH CLOCK.** `defenseProfile.scores.economic` is written at generation and never re-judged: the world pulse touches only `scores.disaster` (`src/domain/worldPulse/foodStockpile.js:389`, the disaster writeback, and the module touches no other `scores.` key), and the tab's own caption says the bars are *as judged at the first survey* and that Disasters and Famine alone is re-judged as the campaign advances (`DefenseTab.jsx:313`). **So this sentence and its badge agree with each other forever, and both may disagree with the LIVE food stockpile, the LIVE blockade state and everything the campaign has done since.** A face written as a report of how things stand today is safe; a face written as a claim about how things are GOING is not, and a face that implies the reading is current is quietly asserting a clock the record does not run.

A face must contradict no state in that range, not merely the town on this skeleton.

---

<!-- VARIANTS 1 TO 3 FOLLOW; written and rewritten section by section under the checkpoint law -->
