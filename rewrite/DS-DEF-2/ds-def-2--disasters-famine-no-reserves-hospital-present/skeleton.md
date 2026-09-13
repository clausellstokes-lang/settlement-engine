# DS-DEF-2 · `Disasters & Famine: NO reserves, hospital present` · SKELETON

Seat: MARKER (opus), for the Fable chair.

Written under **ADDENDUM 14** (the owner, 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record; **silence in the record is permission**; "the card does not license it" is NOT a finding. No claim below is tagged `unlicensed` — that verdict no longer exists.

**Variants: 3 shipped** (vids 1, 2, 3 — `[ledger]`, `[street]`, `[unfolding]`). Each is rewritten ONE FOR ONE into FOUR faces. Never trim (Part B §22: counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement).

---

## THE SHIPPED ROWS, verbatim, one for one (annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2715-2718`)

1. `[ledger]` `{settlement}` can treat and contain an outbreak and keeps no food against a bad harvest; a crop failure here becomes hardship the same season it happens.
2. `[street]` The town is better prepared for the sickness than for the hunger, which is an unusual way round and does not comfort anyone.
3. `[unfolding]` `{settlement}` is arranged against the sickness it has seen and not against the hunger it has not, and nothing in hand is correcting the imbalance.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock

`node scripts/prose-licence-card.mjs DS-DEF-2 'Disasters & Famine: NO reserves, hospital present'`

```
LICENCE (block DS-DEF-2 · role spine · key `Disasters & Famine: NO reserves, hospital present`)
  reads:      disasterRowSituation(granary, hospital, church) (via DISASTER_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  disasterRowSituation(granary, hospital, church) === no reserves, hospital
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence   move: (none declared)   angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading and NOT on a
              producer-token root, so every pool that selects a row of `DISASTER_ROW_POOL`
              shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  THE TEST (ADDENDUM 14): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
  may claim:  that the reader `disasterRowSituation(granary, hospital, church)` selects the row
              `no reserves, hospital` of `DISASTER_ROW_POOL` in `defenseStateProse.js`,
              as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course,
              a dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b),
              another civic object of the class `store`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope);
              a theological claim about a deity (the deity doctrine)
```

**Six things on the card bind harder on this pool than on any sibling of the block.**

1. **`source: (none) · SOURCE-UNRESOLVED`, and the census says why in as many words.** The row's own `holderReason` is *"no mapping row resolves any field this pool reads"* (`docs/content/wiring-census.json`, the DS-DEF-2 row for this pool; `source.standing = "SOURCE-UNRESOLVED"`, `source.fields = {granary: "", hospital: "", church: ""}` — all three empty). **This pool has NO holder at all.** No parish register, no reeve's count, no granary book, no physician's list. A face that says *the register shows*, *by the priest's own count*, *the reeve's tally*, *the parish book* is refused by arm A13, and there is no workaround.
2. **`bag` offers three slots and the call site fills ONE.** `defenseStateProse.js:622` builds `slots = { settlement: properFill(text(settlement?.name)) }`. `{band}` and `{route}` are RESERVED and unfilled at this block. A face uses `{settlement}` or no slot, and never reaches for the other two.
3. **The predicate reads THREE arguments and consults only TWO.** `disasterRowSituation(granary, hospital, church)` takes `church` and, on the `!granary` branch, **never asks it** (`defenseStateProse.js:580-586`). The leaf says so in its own docblock: *a church counts as medical provision only in the granary branch* — the corpus wrote `granary AND parish care only` but no matching `no reserves, parish care`, so **for a town with no reserves the split is hospital-or-nothing and the church is not consulted**. That is why the situation set is five and not six. **CONSEQUENCE FOR THE WRITER: the state of the church is UNOBSERVED on this branch.** A face may not assert that there is a church, that there is none, or that the clergy do or do not help — in either direction it depends on a field this read does not take.
4. **`objectClasses: ["store", "care"]`, primary `store`.** This pool is the one row of the block whose key spans TWO civic object classes. Its `may NOT` bars another civic object of the class `store` — the granary the town does not have is the class, and a second store-class object (a warehouse, a loft, a cellar named as a civic thing) is refused.
5. **`echo`: one spine mount on the defense tab, and the echo key is the WHOLE table rung** — so all FIVE `Disasters & Famine` pools share one echo key. A sibling SITUATION's wording counts against this one in the echo table, and the four siblings are printed in §0.7.3 for exactly that reason.
6. **`angle: ledger street unfolding` is the card's alphabetical print; the CORPUS ORDER is ledger (vid 1), street (vid 2), unfolding (vid 3).** Rewrite one for one against the vids. Vid 1 stays canonical at index zero. The census records `variants: 3, grammars: 2` — **two distinct level-1 grammars across three variants today, which is at the floor of A11's rule and is itself a finding the rewrite should mend.**

### 0.2 The block's header lines (annex `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2593`, the parts that bind this pool)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags, and `compound.inst`. **This pool is row five, and it is the only row of the five whose badge is re-judged in play — see §0.7.2.**
- **SLOTS:** `{settlement}` `{band}` `{route}` · **SECTION-TARGET:** `defense` · **PDF PARITY:** parity (`viewModel.js` defense slice).
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183`.
- **THE BLOCK'S STATED JOB for the corpus here, verbatim:** *"each branch currently holds exactly ONE string, so every settlement in a given branch says the same words."* This pool's one shipped branch string is the `!hasGranary` + `hasHospital` concatenation at `threatAssessment.js:181-189`.
- **PROVENANCE + FENCE, verbatim, and it convicts vid 3 in as many words:** *"Institution presence is a STANDING fact with no recorded history; the causal clauses here are* capability *clauses (walls without people cannot be held) and never* historical *ones (walls built after a siege) unless the history surface supplies the ancestry."* **The history surface supplies no ancestry to this key.** Vid 3's *"the sickness it has seen"* and *"the hunger it has not"* are historical clauses on a standing configuration field, which is the fence's own example shape.

### 0.3 The register card's six one-line registers (the DOSSIER line is this pool's)

- **The dossier:** the record itself; the clerk's third person; the six shapes of its closed set; **the town's name is not the default opener.**
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges; every answerable plant answered, and some left open.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

The dossier line's tail bites at once: **two of the three shipped variants open on `{settlement}`.** R-DA-17 caps the settlement token at ONE opener per pool and T-F8 refuses a sentence face that opens on a `proper`-typed slot outright. Vid 2 already opens on *"The town"* and is the pool's compliant opener; **vids 1 and 3 cannot both keep their opening as written, and under T-F8 neither can.**

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim. An unweighted seeded roll picks the face at render, **so every face must stand alone** — no face may lean on a sibling for its sense. The exemplar, not the practical. **No em dash, no exclamation mark, no digit or percent in a connective, no which-clause.** The clerk who was there, compiling from records, citing a holder only where the card licenses a source — **and here it licenses none.**

⚠ **The no-which wall convicts vid 2 on its face:** *"...for the hunger, __which__ is an unusual way round..."* is the exact refused shape, and A9/R-DA-03 bar the qualification as a tail besides.

⚠ **The no-digit wall.** Everything under this key is a count — months of storage, a base chance, a score, a percentage gate. None of it reaches the page as a figure, and R-DA-11's figure policy means a comparison is a measurement in words.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** The five threat rows render as ONE italic block of paragraphs, the first at a larger size (`DefenseTab.jsx:317-321`). The order is fixed in code — `['beasts','invasion','internal','economic','disaster']` (`DefenseTab.jsx:113-114`) — and nulls are filtered. **This row is LAST. It is the closing paragraph of the passage on every town that reaches it**, and the paragraph immediately above it is always an `Economic Survival` row. A face here is the passage's last sentence: it carries a noun forward from what precedes it, or its change of subject is the passage's one turn outward and it sits last — which is exactly the position it holds. **This is the one pool of the block that is always allowed the turn outward, because it is always last.**

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Never trade density for plainness.

**THE CEILING, NOT THE MIDDLE (Part B §21.1).** The band is a licence, not a target. Measure against the best exemplar face, never the average.

### 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

The predicate is one function over three booleans (`src/domain/display/stateProse/defenseStateProse.js:580-595`):

```
function disasterRowSituation(granary, hospital, church) {
  if (granary) {
    if (hospital) return 'granary, hospital';
    return church ? 'granary, parish care' : 'granary, no medical provision';
  }
  return hospital ? 'no reserves, hospital' : 'no reserves, no medical provision';
}
```

and the caller hands it three civic flags (`defenseStateProse.js:661-663`):
`disasterRowPoolKey(civicFlag(compound.hasGranary), civicFlag(compound.hasHospital), civicFlag(compound.hasChurch))`.

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `economicState.compound.inst.hasGranary` === **false** | no institution on the roster whose name contains `granar` (`priorityHelpers.js:63`) | **NONE — SOURCE-UNRESOLVED** | the town keeps no communal grain. One fact, exactly | it is a **generation-time NAME MATCH** over the roster at assembly (`economicState.js:872` ← `getInstFlags(config, institutions)`), never re-derived and never ruin-filtered |
| `economicState.compound.inst.hasHospital` === **true** | an institution whose name contains `hospital`, `monastery`, `healer` **or** `friary` (`priorityHelpers.js:64`) | **NONE** | the town has SOMETHING that answers sickness. **Which thing, the flag does not say — and on this pool's measured range it is never a hospital.** See below | same frozen name-match; and the four-word vocabulary is the record, not the word "hospital" |
| `economicState.compound.inst.hasChurch` | **passed and NOT consulted on this branch** | — | nothing. It is an argument the function ignores here | asserting a church either way is a dependence on an unobserved field |

**⭐⭐ WHAT `hasHospital` ACTUALLY IS ON THIS POOL'S TOWNS, and it is the single sharpest fact in this packet.** Enumerated over the whole catalog (`src/data/institutionalCatalog.js`), the institutions whose names satisfy the four-word matcher, by tier:

| tier | every catalog row that sets `hasHospital` | every catalog row that sets `hasGranary` |
|---|---|---|
| thorp | **(none)** | **(none)** |
| hamlet | **(none)** | **(none)** |
| **village** | **`Magic / Healer (divine, 1st level)` — required `false`, baseChance `0.4`, `magicLicense: 'low'`** | **(none)** |
| town | `Religious / Monastery or friary` (0.4) · `Religious / Small hospital` (0.3) | `Economy / Town granary` — **required `true`, baseChance `1`** |
| city | `Religious / Major hospital` (0.5) | `Economy / City granaries` — **required `true`, baseChance `1`** |
| metropolis | `Religious / Hospital network` (0.55) | `Economy / State granary complex` (0.7) |

**And this pool fires only at village** (§0.9). So on every town the census sample puts in this pool, the "hospital present" flag is set by **one person**: a first-level divine healer, filed by the catalog under **Magic**, whose authored description is *basic healing spells*, with **a price in gold on closing a wound**. There is no ward. There is no infirmary. There is no staff. **A face that writes "the hospital", "the sick-house", "the infirmary" or "somewhere to put the sick" is naming a building this pool's towns do not have**, and the shipped `[ledger]` row of the sibling `granary AND hospital` pool uses exactly that phrase, one echo key away.

**⚠ AND THE PROVISION IS MAGICAL.** `magicLicense: 'low'` makes the row an arcane institution by the canonical detector (`arcaneInstitutionIdentity.js:218-219`, `magicLicenceAtLeast(licence, 'low')`), and `institutionProbability.js:302` returns a flat **zero** for an arcane institution when `config.magicExists === false`. **So in a world without magic there is no village row that can set `hasHospital`, and this pool cannot fire at village at all.** The care this key reports is spellcraft. That is the record's own shape, and no shipped row touches it.

**WHAT THE NUMBERS UNDER THE KEY ARE, which is causal background a writer must understand and may not assert.**

- **The missing granary is a missing MONTH, not a missing habit.** `foodGenerator.js:160-163`: `baseStorage` is 2.5/3.5/5/7/12 where a granary, city granary or state granary stands, and **1.0 for a village with none** (1.5 for thorp and hamlet); a mill multiplies by a quarter again. So a village in this pool has **about one month in hand**, and the catalog offers it no granary row to buy.
- **The missing granary doubles the famine roll.** `stressGenerator.js:134`: `if (hasGranary) prob *= 0.5`. This pool's towns take no such relief, and `isSmallTier(tier)` adds `prob *= 1.3` at village (`:131`, `SMALL_TIERS = ['thorp','hamlet','village']`).
- **The healer that put the town in this pool cuts the plague roll by two fifths.** `stressGenerator.js:174`: `if (hasHealer) prob *= 0.6`. **So the engine agrees with this row's shape — the town IS better set against the sickness than against the season — as a matter of what it HAS, never of what it has SEEN.** (⚠ note the vocabulary drift: the stress generator's `hasHealer` matches `healer` · `physician` · `hospital` and NOT `monastery`/`friary`, a different four words from the flag this key reads.)
- **The hospital flag is worth ten points of the economic score** (`defenseGenerator.js:272`, `if (inst.hasHospital) economic += 10; // medical resilience`) **and five of the monster score** (`:204`). It is the same flag speaking on the paragraph above.

**THE READS THIS POOL DOES NOT REACH, listed so the writer knows the page around the sentence.**

- **No score, anywhere.** Unlike rows 4 and 5's neighbours this key reads no band and no number. It cannot see `scores.disaster`, `foodSecurity.resilienceScore`, `storageMonths`, `econOutput` or `economicGates.disaster`.
- **`config.stressTypes` is read by NO key function of this block** — and it bites hardest here, because `famine` and `plague_onset` are the two stresses whose probabilities this pool's own flags move. **A famine town and a plague-onset town both reach this pool, each printing its own banner on the same dossier.**
- **`config.monsterThreat` is not read.** Plagued, frontier and settled all print this row.
- **`tradeAccess` and `hasPort` are not read** — and `defenseDisplay.js:245` prints, on a portless town with no granary, *"No food buffer. Any supply disruption becomes a survival crisis within days"*, but on a PORT town with no granary, *"No reserves, but sea supply continues while port is open."* **The estate itself holds that a portless reading of "no reserves" is wrong on a port town.** (On this pool's measured village-only range a port is rare, but the read is not taken and the face must survive it.)
- **The live institution roster is not read.** `compound.inst` is a generation-time snapshot; the force rows of this same block were explicitly re-plumbed through `standingDefenseForces` because of that, and **this row was not.**

### 0.6 The provenance move, priced for this pool: ZERO, and it is a wall rather than a recommendation

The card's `source` line is `(none) · standing SOURCE-UNRESOLVED`, the census's `holderReason` is *"no mapping row resolves any field this pool reads"*, and all three of `granary`, `hospital` and `church` carry an empty holder string. The exemplar registers with raw text cite at zero per 786 sentences (Part B §24), so zero is also the norm and not a deprivation.

⚠ **The distinction that matters, because it is easy to lose:** *record VOCABULARY* is free — a `[ledger]` face may be written in the idiom of an office setting down an entry. What is barred is *attribution*: naming the keeper of the record the fact comes from. "Nothing is put by" is vocabulary. "The parish book records nothing put by" is a citation, and there is no parish book behind this key.

⚠ **The trap specific to this pool:** the thing the flag names is a PERSON, and a person is the easiest holder in the estate to cite by accident. *"the healer says"*, *"by the healer's account"*, *"the one who tends the sick reckons"* are all arm-A13 citations on a source that does not resolve. Naming what the town HAS is lawful; naming it as the source of the claim is not.

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE

#### 0.7.1 This row is the LAST paragraph of the block, and the paragraph above it is always an `Economic Survival` row

`DefenseTab.jsx:113-114` fixes the order `['beasts','invasion','internal','economic','disaster']` and filters nulls. `economicRowPoolKey` is total on a finite number, so the economic row is effectively always present. Measured at VILLAGE tier, which is this pool's entire measured range (`wiring-census.json`, `rate.rows`):

| the paragraph | what it says on this pool's towns |
|---|---|
| `Internal Security` (two above) | `no legal infrastructure` — **100.00 % of villages.** There is no court, no gaol, no legal machinery |
| `Economic Survival` (immediately above) | `WEAK` 42.97 % · `ADEQUATE` 35.94 % · `CRITICAL` 21.09 % · **`STRONG` 0.00 %** |
| `Invasion & War` | `neither walls nor force` 50.00 % · `walls with citizen militia` 33.59 % · `militia only` 10.16 % · `walls with NO force` 6.25 % |
| `Beasts & Monsters` | `plagued, perimeter AND organized force` 31.25 % · `settled, nothing organized` 29.69 % · `plagued, NO perimeter and NO force` ≈ 28.13 % (by remainder) · `frontier, force without a perimeter` 7.81 % |

**Two consequences bind every face.**

1. ⛔ **"CONTAIN" IS REFUSED BY THE PARAGRAPH TWO ABOVE.** On 100 % of this pool's towns the `Internal Security` row says there is no legal machinery at all. **A town with no court and no gaol has nothing that can order a house shut, a road closed or a person kept indoors.** Vid 1's *"can treat and contain an outbreak"* is not merely beyond the read — it is contradicted by a sibling row of the same block, printed three paragraphs earlier in the same italic box. The estate's own shipped engine string carries the same fault (*"Hospital infrastructure enables disease containment and systematic quarantine"*, `threatAssessment.js:186`), which is where the corpus inherited it.
2. **This row is the passage's turn outward, by position.** The thread rule wants an added sentence either to carry a noun forward or to make its change of subject the passage's one turn outward, placed last. **This paragraph is always placed last.** It is therefore the one paragraph of the five that may legitimately widen — from what the town has standing to what the year does to it. A face that takes that licence is writing to the composed shape; a face that opens a new subject in its own middle is not.

#### 0.7.2 ⛔ THE SHARPEST HAZARD IN THE PACKET: this row's BAR MOVES IN PLAY AND ITS SENTENCE DOES NOT, AND THE TAB SAYS SO OUT LOUD

The five rows carry a badge and a bar. Four of them are frozen at generation. **This one is not.**

- **The badge's score** is `scores.disaster ?? foodSecurity.resilienceScore ?? <a computed fallback>` (`defenseDisplay.js:310-314`, `DefenseTab.jsx:185`).
- **`scores.disaster` is REWRITTEN EVERY PULSE.** `foodStockpile.js:389-402` re-grades resilience from the CURRENT granary and writes it back through the persisted gate, spreading `defenseProfile.scores` immutably when it moves (`:468-473`). The code's own comment says why: *the live re-grade must move it too or the 'Disasters & Famine' row stays frozen at the generation value while a siege eats the granary.*
- **This row's PROSE KEY is frozen.** `compound.inst` is `getInstFlags(config, institutions)` taken once at assembly (`economy/economicState.js:51, :872`) — a lowercase substring match over the roster names, never ruin-filtered, never re-derived. The force rows of this same block were explicitly re-plumbed through `standingDefenseForces` for exactly this reason; **row five was not.**
- **And the product tells the reader.** The tab's own subtitle, verbatim: *"Bars show the settlement's defense readiness against each threat, as judged at the first survey; Disasters & Famine is re-judged as the campaign advances."* (`DefenseTab.jsx:315`).

**THE RULE FOR THE WRITER:** the bar above this sentence can fall to nothing while the sentence keeps saying what it said at the first survey. **So a face must be true of the arrangement, which does not move, and must not be a reading of the situation, which does.** Anything about how things are going, what is left, what is running out or how bad it has got will be contradicted by the bar beside it within a season of play. Anything about what the town HAS and HAS NOT BUILT survives forever. **This single fact disqualifies the whole of vid 3's closing clause and the whole of vid 1's second sentence.**

#### 0.7.3 The four sibling situations share this pool's echo key, and two of them own vocabulary this face must not touch

All five rows of `DISASTER_ROW_POOL` share ONE echo key (the card's `echo` note). The shipped siblings:

- `granary AND hospital` — *"...holds food against a bad year and has somewhere to put the sick..."*, *"a place for grain and a place for the ill"*, *"the reason is in the two buildings rather than in the luck."*
- `granary AND parish care only` — *"...there are clergy who tend the sick: reserves against hunger, and against disease something better than nothing and well short of a hospital"*, *"pray and nurse, in that order"*, *"a full store and a modest infirmary."*
- `granary, NO medical provision` — *"can feed itself through a failed harvest and has nothing at all against disease"*, *"a sickness here spreads until it stops of its own accord."*
- `NO reserves, NO medical provision` — **this pool's nearest neighbour, and it fires on 75.78 % of villages against this pool's 24.22 %** — *"holds no food against a bad year and has nobody to treat the sick"*, *"endure it and count afterwards"*, *"A stranger looking for the granary or the sick-house at {settlement} is directed to neither, because there is neither."*

**Two bars fall out of that list.** *"Somewhere to put the sick"* and *"the sick-house"* belong to the granary-and-hospital and the no-provision siblings and are wrong here besides (§0.5: there is no building). And *"clergy who tend the sick"* is the parish-care sibling's own claim **and is one of the four clauses this block's contradiction set names as still false**; on this branch the church is not even consulted.

#### 0.7.4 Three more surfaces on the same page speak this row's own facts

- **`Medical Readiness`** (`defenseDisplay.js:237-239`) prints `status: 'Hospital present'` with the note *"Casualty treatment, outbreak containment, recovery capacity."* **That note is the estate's own overreach on one first-level healer, and it is printed inches from this paragraph.** A face must not become a gloss on it, and must not inherit it.
- **`Logistics & Supply`** (`:243-245`) prints `status: 'No reserves'` with *"No food buffer. Any supply disruption becomes a survival crisis within days"* — or, on a port, *"No reserves, but sea supply continues while port is open."* **DS-DEF-6's `Logistics & Supply` pools own the reserve against the SUPPLY ROUTE**, which this key cannot see; the leaf's own docblock says so (`defenseStateProse.js:1477-1487`) and adds that DS-DEF-6's `Medical Readiness` pools are BLOCKED because *"DS-DEF-2's row reads `hasGranary` × `hasHospital` × `hasChurch` and speaks BOTH the reserve and the medical halves"* — **this pool is the position of record for both halves on the whole tab.**
- **The funding note directly beneath this row.** `READINESS_GATE_FOR['Disasters & Famine'] = ['disaster', 'relief funding']` (`defenseDisplay.js:281`), rendered as *"Upkeep underfunded: relief funding at NN%"* whenever `economicGates.disaster < 1`, which is whenever `econOutput < 50` (`defenseGenerator.js:611-614`, the gate floored at 0.55). **`relief funding` is the estate's own name for this row's money half.** A face may live in that idiom; it may not quote the figure and must not gloss the note. The generator's own comment names the register: *"no purse for famine relief"* (`defenseGenerator.js:645-646`).

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into, each with its field

| the claim that would be false | the field that denies it, and which of the two is the record |
|---|---|
| **A HOSPITAL, an infirmary, a sick-house, a ward, "somewhere to put the sick"** | `institutionalCatalog.js` is the record: the ONLY village row matching `hasHospital`'s four words is `Healer (divine, 1st level)` — one person, `baseChance 0.4`. There is no building. `Small hospital` and `Monastery or friary` first appear at TOWN tier, where a granary is `required: true` and this pool cannot fire. ⚠ **The sibling pool one echo key away says "somewhere to put the sick" in its shipped `[ledger]` row** |
| **CONTAINMENT, quarantine, a cordon, houses shut, a road closed, the sick kept apart** | the block's own `Internal Security` row, `no legal infrastructure` at **100.00 %** of this pool's towns: no court, no gaol, no legal machinery. Nothing here can order anyone to stay anywhere. The shipped engine string this pool replaces asserts *"systematic quarantine"* (`threatAssessment.js:186`) and **the corpus inherited the fault verbatim in vid 1** |
| **CURING or answering an OUTBREAK as a capacity — "can treat an outbreak", "the town can meet a plague"** | the roster row is the record: a **first-level** divine caster whose authored description is basic healing spells and a fee. FLOOR-2a, a magnitude outside the read's own band word. The read is a BOOLEAN PRESENCE; the scale of what it can meet is not in it |
| **THE CARE AS MUNDANE MEDICINE — "a physician", "a surgeon", "someone who knows herbs", "learned medicine"** | `magicLicense: 'low'` files the row as an arcane institution (`arcaneInstitutionIdentity.js:218-219`) and `institutionProbability.js:302` zeroes it where `config.magicExists === false`. **The provision here is spellcraft.** A mundane framing is the record's opposite |
| **A CHURCH, a priest, clergy, the parish, prayer as the answer — in EITHER direction** | `church` is an argument `disasterRowSituation` **does not consult on this branch** (`defenseStateProse.js:580-586`, and the leaf's docblock explains why the situation set is five and not six). FLOOR-2, a dependence on an unobserved field. ⚠ *"clergy who tend the sick"* is additionally one of the four clauses this block's contradiction set names as still false |
| **A GRANARY that was lost, burned, emptied, sold or never finished** | there is **no village granary row in the catalog at all**. The thing absent was never present and is not a ruin; a granary is what a TOWN gets. FLOOR-2b besides (an elapsed course on a standing configuration field) |
| **A SECOND CIVIC STORE — a warehouse, a common loft, a tithe barn, a stock named as a civic thing** | the card's `may NOT`: *another civic object of the class `store`*. The census types this pool `objectClasses: ["store","care"]`, primary `store` |
| **THE TOWN HAS NOT SEEN HUNGER / HAS SEEN SICKNESS — any history at all** | the block's PROVENANCE FENCE verbatim: the causal clauses here are **capability** clauses and never **historical** ones unless the history surface supplies the ancestry, **and it supplies none**. No event-provenance field reaches this key. ⚠ **And it is inverted in fact:** the healer LOWERS the plague roll (`stressGenerator.js:174`, `prob *= 0.6`); it is a provision, not a response to something that happened. ⚠⚠ **And a famine town reaches this pool** — a village with no granary takes no `×0.5` relief (`:134`) and takes `×1.3` for small tier (`:131`), so it is the engine's own famine-prone shape. *"the hunger it has not [seen]"* is false under an ACTIVE FAMINE banner printed on the same dossier |
| **A SEASON or a DATED CAUSE — "the same season it happens", "since the bad winter", "before the next harvest", "each spring"** | FLOOR-2b, named on the card in as many words. ⚠ **vid 1 closes on one** |
| **A MAGNITUDE outside the read — "a month in hand", "weeks", "nothing put by past the turn of the year", "half a season"** | FLOOR-2a. Every number under the key is real and none of it is reached: `storageMonths` (1.0 at village with no granary, `foodGenerator.js:163`), `resilienceScore`, `scores.disaster`, `economicGates.disaster`, the 0.4 base chance |
| **A RATE, a TREND or a CORRECTION IN PROGRESS — "nothing in hand is correcting it", "it is getting worse", "they are putting something by now"** | no construction, project, plan or intent field reaches this key, and no decrement exists in the derivation. FLOOR-2, a dependence on an unobserved field. ⚠ **And §0.7.2 convicts it a second way:** the badge beside the sentence IS re-judged each pulse, so a face that reports a direction will be contradicted by its own bar |
| **A PREDICTION the pulse adjudicates — "will starve", "cannot survive a bad year", "the next failure ends it"** | FLOOR-2b and A2, state never fate. The lawful form is the capability clause and the subjunctive edge |
| **A TOTALITY OVER PERSONS — "does not comfort anyone", "everybody here knows it", "nobody has forgotten", "every household"** | the card's REFUSED COLUMNS line, first limb. ⚠ **vid 2 closes on one** |
| **A FEELING, a fear, a comfort, a resentment, a morale** | MOVE-GRAMMAR §1.3 names FEELING a non-move: *no field carries motive, belief or mood; the reaction is an ACT*. There is no morale field on `defenseProfile` anywhere. ⚠ **vid 2's close is a feeling AND a totality at once** |
| **A GENERALISATION ACROSS SETTLEMENTS — "an unusual way round", "rarer than the other way", "most towns have it the other way about"** | no field holds a cross-settlement frequency, and MOVE-GRAMMAR §1.3 names VERDICT a non-move while R-DA-12 applies the generalisation test. ⚠ **It happens to be measurably TRUE** — 4.04 % of the sample, the second rarest of the block's 23 pools — **which is exactly why it reads well and still cannot be asserted from a field** |
| **AN EXEMPTION from a duty — anyone spared a levy, a tithe, a call or a contribution** | `whoIsExempt` is null everywhere (CLERK-LAWS §1.2) |
| **NAMING A RECORD HOLDER — "the parish book", "the reeve's count", "by the healer's own reckoning", "the register shows"** | `source: (none) · SOURCE-UNRESOLVED`; census `holderReason`: *"no mapping row resolves any field this pool reads"*. Refused by arm A13 |
| **A MINTED PROPER NAME — a person, a family, a lane, an inn, a road** | a pooled face is authored once and drawn by every town whose key matches, so a name prints identically across a region. The NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **NAMING ANY OTHER INSTITUTION — the watch, the militia, the garrison, the market, the mill, the court, the gaol** | this key resolves none of them, and on its measured range most do not exist: no court and no gaol at 100 %, and half the towns have neither walls nor force. Safe collective nouns that assert no roster row: **the town**, **the place**, **the village**, **the town's own people**, **the households**, **what the town has in hand** |
| **THE FOUR CLAUSES OF THIS BLOCK THE CONTRADICTION SET STILL NAMES AS FALSE** — *"substantial works"*, *"how relaxed the people on it are"*, *"takes this town with ladders"*, *"clergy who tend the sick"* — in any form | the block's set names all four. **The fourth sits one pool away on this very lens and its vocabulary is the nearest temptation in the packet** |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these rosters do not carry may not be asserted: the **live institution roster** (`institutionRoster.js`, `liveInstitutions`, ruin-filtered — and note this key reads the FROZEN snapshot instead); the **`compound.inst` civic flags** `hasGranary` · `hasMarket` · `hasHospital` · `hasChurch` · `hasCourtSystem` · `hasPrison` · `hasPort` · `hasNavy` · `hasMagicInst`; the **seven defence buckets** `walls` · `garrison` · `militia` · `watch` · `mercenary` · `charter` · `magicDef`; the faction list; the faith entries; the NPC office roster. **This key reads exactly two flags of one of those rosters**, which is precisely why it may assert nothing else from any of them.

**NOT A FAITH POOL.** The deity's four axes, the DERIVED temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank, the SETTLEMENT standing and the suppressed flag beside that standing do not arise here, and no face may reach for any of them. ⚠ **The trap is real on this pool and nowhere else in the block:** the institution behind `hasHospital` is a DIVINE caster filed under Magic with `priorityCategory: 'religion'`, so the shortest road to naming the care runs straight at the deity doctrine. **The care may be named as care. It may never be named as a god's.**

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

**`Disasters & Famine: NO reserves, hospital present` fires on every settlement whose roster carries no institution named `granar` AND carries one named `hospital`, `monastery`, `healer` or `friary`, and on nothing else about the town.** Measured over the census's balanced 768-town sample (`docs/content/wiring-census.json`, `rate.rows`):

**31 towns, 4.04 % of the sample** (95 % interval 2.86 % to 5.67 %), 2.86 % under the wizard-default weighting. **It is the second rarest of the block's twenty-three pools** — only `Invasion & War: force with NO walls` (13) is rarer — and the rarest of the five `Disasters & Famine` situations by a factor of three.

**⭐⭐ IT IS A VILLAGE POOL, AND IT IS ONLY A VILLAGE POOL. This is the fact that should shape every face.**

| tier | towns | rate |
|---|---|---|
| thorp | **0** of 128 | 0.00 % |
| hamlet | **0** of 128 | 0.00 % |
| **village** | **31** of 128 | **24.22 %** |
| town | **0** of 128 | 0.00 % |
| city | **0** of 128 | 0.00 % |
| metropolis | **0** of 128 | 0.00 % |

**The reason is structural and is worth stating plainly, because it tells the writer what the town IS:**

- **No tier below town has a granary row at all.** The catalog's granary rows are `Town granary` (town, `required: true`, `baseChance: 1`), `City granaries` (city, `required: true`, `baseChance: 1`) and `State granary complex` (metropolis, 0.7). **So every thorp, hamlet and village in the product is in a `NO reserves` branch**, and town and city are effectively never in one.
- **No tier below village has a `hasHospital` row at all.** Thorp and hamlet have nothing matching the four words.
- **Therefore the two `NO reserves` situations partition the villages exactly**, and the census confirms it to the basis point: `NO reserves, NO medical provision` 75.78 % + `NO reserves, hospital present` **24.22 %** = 100.00 % of villages.

**⭐ SO THIS POOL HAS ONE SENTENCE OF IDENTITY AND IT IS THIS: *the village that has the healer*.** Its whole discriminating content against the 75.78 % majority next door is one first-level divine caster on the roster. That is the fact the four faces of each variant must be built from.

**The consequences a face must survive:**

- **The town is a village. Always, on every town in the measured sample.** Not a town, not a city, not a hamlet. So: **no walls on half of them, no organised force on half of them, no court and no gaol on ALL of them, no market square, no mill guaranteed, no granary anywhere in the tier.** But also: **a parish church and a resident priest, both `required: true` at village** — every village in the product has both, though this branch does not consult them.
- **The catalog leaves one door the sample never opened.** `State granary complex` is `required: false` at metropolis (0.7) and `Hospital network` is 0.55, so a metropolis with no granary and a hospital network is arithmetically reachable and the 768-town sample found **zero**. A face written only for a village would be wrong there. **Write to the SHAPE — no reserves, some answer to sickness — and the metropolis case survives; write to the tier and it does not.**
- **In a world without magic this pool cannot fire at village at all.** The only village row that sets the flag is arcane by the canonical detector and takes a flat zero probability when `config.magicExists === false` (`institutionProbability.js:302`). **A face that names the care mundanely is wrong in the only worlds where this pool exists at village.**
- **Every stress state, and two of them are this pool's own shape.** `config.stressTypes` is read by no key function of this block. A **famine** village reaches this pool and is twice as likely to than a granary town would be; a **plague-onset** village reaches it and is two fifths less likely to than a healer-less one. Both print their own banner on the same dossier. **A face that says the town has never been hungry is absurd under a famine banner, and the famine is the record.**
- **Every country tier.** `config.monsterThreat` is not read: plagued, frontier and settled all print this row. Roughly three villages in ten in this pool sit in a `plagued` country with a perimeter and a force.
- **Every route, terrain, culture, prosperity rung and population band**, none of which the key reads — including a **port**, on which the estate's own sibling surface says the no-reserves reading is different (`defenseDisplay.js:245`).
- **Every economic band except STRONG.** The paragraph above is `WEAK` on four villages in ten, `ADEQUATE` on three and a half, `CRITICAL` on two. **`STRONG` is 0.00 % at village**, so this row never follows a paragraph that says the town can fund a crisis.
- **TWO CLOCKS, and only one of them is this row's.** The key is frozen at generation; the badge beside it is re-judged every pulse (§0.7.2). **A face must be true of the arrangement on the day of the survey and must stay true when the bar beside it has fallen to nothing.**

**A face must contradict no state in that range, not merely the town on this skeleton.**

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> `{settlement}` can treat and contain an outbreak and keeps no food against a bad harvest; a crop failure here becomes hardship the same season it happens.

Level-1 grammar as written: PRESENT → PRESENT(LACK) ; CONSEQUENCE. Two sentences joined at a semicolon. Opens on a `proper`-typed slot.

### 1.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | the town has something that answers sickness | **SAFE.** This is the `hospital === true` half of the key, exactly |
| 2 | the town can **TREAT** an outbreak — a capacity at the scale of an epidemic | **FLOOR-2** — a magnitude outside the read's own band word. The read is a boolean presence; the roster row behind it at every town in this pool is `Healer (divine, 1st level)`, one person, catalog description *basic healing spells*, with a fee (`institutionalCatalog.js:845-864`) |
| 3 | the town can **CONTAIN** an outbreak | **CONTRADICTED** — `internalRowPoolKey(hasCourtSystem, hasPrison)`, `defenseStateProse.js`, keyed to the block's own `Internal Security` row, which reads `no legal infrastructure` on **100.00 %** of this pool's towns (census `rate.rows`, village tier). **The record is the internal-security key**: a town with no court and no gaol has nothing that can shut a house or close a road. The clause is also inherited from the shipped engine string `threatAssessment.js:186` (*"systematic quarantine"*), which is where the corpus got it |
| 4 | the care is medical rather than magical | **CONTRADICTED** — `institutionalCatalog.js:845` `magicLicense: 'low'`, read through `arcaneInstitutionIdentity.js:218-219` and gated at `institutionProbability.js:302`. **The record is the catalog row**: the provision is spellcraft, and in a magic-free world it does not exist at village at all. (*"treat"* is the softest possible carrier of this and survives better than *"tend"*, *"physic"* or *"dress"* would) |
| 5 | the town keeps no food against a bad harvest | **SAFE.** This is the `granary === false` half of the key, exactly. **The best clause in the pool** |
| 6 | a crop failure here becomes hardship | **SAFE** as a subjunctive capability reading; the missing granary is precisely the missing buffer (`foodGenerator.js:163`) |
| 7 | ...**the same season it happens** | **FLOOR-2** — a season, named on the card's `may NOT` line in as many words (floor 2b: *a dated cause or a season*). No calendar term reaches this key |
| 8 | the town has a harvest of its own to fail | **SAFE.** Not contradicted: village tier carries `Grain & agriculture` among the food chains (`foodGenerator.js:148`) and the key does not read it either way |

### 1.3 The reads this pool reaches, as material for vid 1

`hasGranary === false` · `hasHospital === true` · `hasChurch` unconsulted. The two true readings are the two halves of one sentence, and **vid 1 is the only variant of the three that states both plainly.** That is what a `[ledger]` is for and it should keep that job. The material the shipped row never used: **what the medical half actually is** (a person, not a place; paid, not provided; spellcraft, not physic) and **what the absent half actually is** (a thing no village in the product has ever had, not a thing this village lost).

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

The rows of §0.8 this variant can actually walk into, in order of how near it already stands to each: **containment** (it is in the sentence); **a hospital or a sick-house** (the nearest paraphrase of "can treat"); **a season** (it is in the sentence); **a magnitude** (the temptation when replacing "the same season" is "within weeks", "before the next harvest", "a month"); **a mundane physician**; **a granary that was lost**; **a record holder** (a `[ledger]` angle invites *"the count shows"* more than the other two).

### 1.5 The preimage, as it bites vid 1

It opens on `{settlement}`, and T-F8 refuses a sentence face opening on a `proper`-typed slot outright — **so no face of vid 1 may open as the shipped row does**, and R-DA-17 caps the settlement token at one opener per pool besides (vid 3 has the same problem, so at most one of the two may even try). The town is a village on every measured town: **no court, no gaol, and half of them with neither walls nor force.** And on the slice carrying an active famine the second sentence is not a capability reading at all but a description of what is already happening — **which the subjunctive survives and the indicative does not.**

### 1.6 The angle's stance in one sentence

A **`[ledger]`** may set down both standing facts in the clerk's own order, land on the civic thing each names, and stop — it states what the town has and has not, never what that means, never what a stranger would think of it, and its close is a standing fact of a varied kind rather than a consequence stamped on every entry.

### 1.7 The turns worth keeping

- **"keeps no food against a bad harvest"** — the best clause in the pool. It is exactly the read, it is concrete, it lands on the civic thing, it invents nothing, and *"against"* does the whole work of the buffer idea without a magnitude. **Carry it verbatim into at least one face.**
- **"a crop failure here becomes hardship"** — lawful in shape as a capability reading; the fault is only the season tail. The verb *"becomes"* is the right register.
- The two-halves-in-one-sentence architecture. It is the `[ledger]`'s proper job and the pool's own shape.

### 1.8 What would make the rewrite of vid 1 a regression

Dropping to one half of the key to be safe (the pool's whole identity is the pairing). Replacing the season with a different magnitude. Replacing *"contain"* with a synonym of the same claim (*"hold it in"*, *"keep it from spreading"*, *"stop it going house to house"* are all the same refused claim). Trading *"keeps no food against a bad harvest"* for something plainer — the density law names that as the regression by name. Naming the healer as a holder to sound like a record.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **The care is a door, not a building.** A stranger who asks in this village where the sick are taken is pointed at a person's house. The record holds one first-level divine caster and no ward, no beds, no staff — so what the town HAS is somewhere to *send* for, and what it has not is anywhere to *put* anyone. That distinction is the sharpest thing in the packet and no shipped row in any of the five sibling pools touches it.
- **The care has a price on it.** The catalog row's own description prices a closed wound in gold. The flavour is not the coin; it is that the town's answer to sickness is something bought at a door rather than something the town keeps — which is the exact mirror of the grain it also does not keep. **Both halves of this key are the same absence of a common store, and only one of them has a person standing in the gap.**
- **The missing granary is not a ruin.** No village in the product has ever had one; the catalog offers the tier no such row. So there is no empty barn to point at, nothing boarded, nothing that fell down. Grain here is kept house by house, under each floor, and the thing a stranger notices is that there is nowhere communal to go and ask.

---

## VARIANT 2 · vid 2 · `[street]` · **NO SLOT** — this variant never names the town

### 2.1 The shipped sentence, verbatim

> The town is better prepared for the sickness than for the hunger, which is an unusual way round and does not comfort anyone.

Level-1 grammar as written: PRESENT(comparison) + a `which`-tail carrying a VERDICT and a FEELING. One sentence. **T-F8: a face of this variant must carry NO slot**, since a face's `{slot}` set must equal its parent's.

### 2.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | the town is better prepared for sickness than for hunger | **SAFE** — and it is the pool's whole discriminating claim, stated more exactly than either sibling variant states it. The engine agrees with the direction as well as the fact: the healer cuts the plague roll by two fifths (`stressGenerator.js:174`) and the missing granary forgoes the halving of the famine roll (`:134`) |
| 2 | the comparison is between *the* sickness and *the* hunger, as definite things | **SAFE** — the definite articles read as the classes of pressure the row is named for, not as named events |
| 3 | this arrangement is **an unusual way round** — a claim about what is typical across settlements | **FLOOR-2** — a dependence on an unobserved field. **No field holds a cross-settlement frequency**, and MOVE-GRAMMAR §1.3 names VERDICT a non-move while R-DA-12 applies the generalisation test. ⚠ **It is measurably TRUE** (4.04 % of the sample; the second rarest of the block's 23 pools), which is why it reads so well, and it is still a claim no read reaches |
| 4 | it **does not comfort anyone** — a totality over persons | **CONTRADICTED** — the card's REFUSED COLUMNS line, first limb: *a totality over persons*, always refused |
| 5 | it **does not comfort** — a mood held by the town's people | **CONTRADICTED** — MOVE-GRAMMAR §1.3, FEELING is a non-move anywhere in the estate: *no field carries motive, belief or mood; the reaction is an ACT*. There is no morale or sentiment field on `defenseProfile` or `compound.inst` |
| 6 | (form, not a claim) the `which`-tail | a **hard wall**: no which-clause, estate-wide; and A9/R-DA-03 bar the qualification as a tail besides. **Two walls on one clause** |

### 2.3 The reads this pool reaches, as material for vid 2

The comparison itself, which is the whole of the key stated as a relation rather than as two facts. **Vid 2 is the variant that owns the RELATION**, and that is worth protecting: vid 1 owns the two halves plainly, vid 3 owns the shape of the provision, and vid 2 owns the fact that the two halves point opposite ways. Material the shipped row never used: **what the mismatch looks like at ground level** — that the thing the town can do something about is the rarer trouble, and the thing it can do nothing about is the one that comes round with the year.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

**A totality over persons is the standing hazard of the `[street]` angle across this whole block** — the shipped `[street]` rows of the sibling pools reach for it repeatedly (*"knows exactly what having both is worth"*, *"knows which of the two it fears"*, *"the people who would have to be paid know it"*). Every one of those is the same refused column. Then: **the generalisation** (any form of "unusual", "rare", "the other way about", "most places"); **a feeling** (comfort, fear, worry, relief, resignation); **a season** (the `[street]` angle's natural reach for "when the year turns"); **naming the hospital** as the thing that makes the town better prepared.

### 2.5 The preimage, as it bites vid 2

**Vid 2 carries no slot and must keep carrying none** — which is a gift, because it is the pool's one compliant opener (*"The town"*) and the only variant that can open the way a dossier row should. Note that *"the town"* is the register's safe collective noun and asserts no roster row, and that at village tier it is the right size of word. The comparison survives every state in the range: it is true on a famine town, on a plagued country, on a port, at every economic band, and it is exactly as true after the badge above it has moved, because **it is a statement about the arrangement and not about the situation** — the one variant of the three that is natively safe against the two-clock hazard of §0.7.2.

### 2.6 The angle's stance in one sentence

A **`[street]`** may say what the arrangement amounts to for a person standing in the place — the plain consequence met at ground level, as a standing fact — but it may not report what people feel, what they all know, or what they would say, because the record holds acts and offices and never an interior.

### 2.7 The turns worth keeping

- **"better prepared for the sickness than for the hunger"** — the exact relation, in plain words, with the two pressures named by the row's own subject matter and nothing invented. **Carry the structure, if not the phrase, into at least one face.**
- **The no-slot opening on "The town".** It is lawful, it is the pool's compliant opener, and it should stay the anchor of this variant.
- The *sickness / hunger* pairing as the two nouns. They are the pressures the row is named for, they are not institutions, and they assert no roster row.

### 2.8 What would make the rewrite of vid 2 a regression

Keeping the comparison and dropping the sharpness (the density law forbids plainer-for-plainness). Replacing the totality with a hedge (*"which is little comfort"* is the same feeling with the persons removed and is still a feeling; *"which few would call lucky"* is still a totality). Adding a slot. Trading the relation for two facts — that is vid 1's job, and A11's grammar rule already reads only TWO distinct level-1 grammars across this pool's three variants, so collapsing vid 2 into vid 1's shape makes a measured fault worse.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **The mismatch is between a trouble that comes and a trouble that returns.** Sickness arrives; hunger comes round with the year. The town has an answer to the one that arrives and none to the one that is on a calendar — and that is the concrete, particular shape of "an unusual way round" without the generalisation attached to it. Nothing in the record denies it and no shipped row has said it.
- **What a person would actually notice is a direction of travel.** A sick household here has somewhere to send; a hungry one has nowhere to go but its neighbours, because there is no common store and there is no office to apply to. The *absence* here is not an empty building — it is that there is no second place to ask.
- **What someone would complain about** is that the help that exists is the help you pay for at a door, and the help that does not exist is the help that would have cost nothing to draw on once it was built. The record holds a priced healer and no granary row at the tier at all; the complaint writes itself from those two facts and needs no feeling word to carry it.

---

## VARIANT 3 · vid 3 · `[unfolding]` · slots `{settlement}` · **the most damaged of the three**

### 3.1 The shipped sentence, verbatim

> `{settlement}` is arranged against the sickness it has seen and not against the hunger it has not, and nothing in hand is correcting the imbalance.

Level-1 grammar as written: PRESENT → HISTORY → HISTORY(negated) → a trend clause. One sentence, four claims, three of them outside the read. Opens on a `proper`-typed slot.

### 3.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | the town is arranged against sickness | **SAFE** — the `hospital === true` half, read as a standing arrangement, which is exactly the right tense for this key. *"Arranged"* is the best verb in the pool for what a boolean presence actually means |
| 2 | the town is not arranged against hunger | **SAFE** — the `granary === false` half |
| 3 | ...the sickness **it has seen** | **CONTRADICTED** — the block's own PROVENANCE FENCE (annex `RECEIPT_POOLS_DOSSIER_STATE.md` §DS-DEF-2), verbatim: *the causal clauses here are* **capability** *clauses and never* **historical** *ones unless the history surface supplies the ancestry.* **The record is the fence, and no event-provenance field reaches this key.** ⚠ And it is inverted in fact: the healer LOWERS the plague roll (`stressGenerator.js:174`, `prob *= 0.6`) — it is a provision, not a scar |
| 4 | ...the hunger **it has not** [seen] | **CONTRADICTED**, twice. By the same fence; and by `config.stressTypes`, which this key does not read and which carries `famine` on a real share of this pool's towns — a village with no granary takes no `×0.5` famine relief (`stressGenerator.js:134`) and takes `×1.3` for small tier (`:131`), so it is the engine's own famine-prone shape. **Under an ACTIVE FAMINE banner printed on the same dossier, this clause is flatly false and the famine is the record** |
| 5 | **nothing in hand is correcting** the arrangement — a claim about what is and is not being undertaken | **FLOOR-2** — a dependence on an unobserved field. No construction, project, plan or intent field reaches this key, and no village granary row exists for the town to be building. It also flirts with a forecast |
| 6 | there is an **imbalance**, as a named condition | **FLOOR-2 / MEANING** — an evaluative abstraction naming what the two facts amount to. MOVE-GRAMMAR §1.3 names MEANING a non-move: no field holds what a fact means |
| 7 | (page, not field) the sentence reports a **direction of travel** | ⛔ **the §0.7.2 hazard in its purest form.** This row's badge is the only one of the five re-judged every pulse (`foodStockpile.js:389-402, :468-473`), and the tab's own subtitle tells the reader so. **A sentence that reports a direction will be contradicted by the bar printed beside it.** This is the reason vid 3 is the most damaged of the three, and it is a fault no reading of the claim set alone would find |

### 3.3 The reads this pool reaches, as material for vid 3

The same two flags, read as a SHAPE rather than as two facts or as a comparison. **Vid 3 owns the shape** — that the town's provision points one way and its store points another, as a standing configuration. That is a genuine third grammar and worth keeping; everything that convicts this variant is in the history and the trend, not in the shape. Material the shipped row never used: **what the arrangement is made of** — one person against a whole class of trouble, and nothing at all against the other class.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

**History is this variant's standing hazard and it is in the sentence twice.** Any past tense, any *"has seen"*, *"has never had to"*, *"was built after"*, *"learned from"*, *"remembers"*, *"since"*. Then: **the trend** (*"is correcting"*, *"is closing"*, *"nothing is being done"*, *"no one has begun"*); **the forecast** (the `[unfolding]` angle's natural slope — *"will find"*, *"the next bad year decides it"*); **the gloss** (*"the imbalance"*, *"the mismatch"*, *"which is the whole of it"*); **a season**; **the record holder**. And the deity doctrine sits nearer this variant than the other two, because *"arranged against"* invites naming what does the arranging.

### 3.5 The preimage, as it bites vid 3

It opens on `{settlement}`, so T-F8 refuses its opening as written and R-DA-17 will not let both it and vid 1 keep a settlement opener. The town is a village; *"arranged"* must not imply an administration, because there is no court, no gaol and no legal machinery on **100 %** of these towns — the arrangement is a fact of what stands there, not of anyone's planning. And the whole slice carrying an active famine or an active plague onset reads this sentence beside a banner that names the very thing it says has or has not been seen.

### 3.6 The angle's stance in one sentence

An **`[unfolding]`** may read the standing arrangement as a situation with a shape — what the town is set up for and what it is not, and what would follow from that, in the subjunctive — but it may not follow the shape backwards into how it came about or forwards into where it is going, because the record holds the arrangement and neither end of its course.

### 3.7 The turns worth keeping

- **"is arranged against"** — the single best verb phrase in the pool. It is precisely what a boolean institution presence means, it carries no history, it carries no agent, and it holds the standing tense the block's fence demands. **Carry it verbatim into at least one face.**
- **The one-way-and-not-the-other shape.** Keep the architecture; strip the two histories out of it. The shape survives on its own and is the variant's reason to exist.
- The pairing of *sickness* and *hunger* as the two classes, which vid 2 also uses — note it and keep the faces of the two variants apart on vocabulary, since sibling distance is measured and these two variants start nearest.

### 3.8 What would make the rewrite of vid 3 a regression

Keeping the history in a softer form (*"arranged against the sickness rather than the season"* is lawful; *"arranged against the sickness it knows"* is the same refused claim with a quieter verb). Replacing the trend clause with a forecast. Replacing the trend clause with a gnomic closer — R-DA-12 measures that shape and it is the lowest-ceiling member of the close set. Collapsing into vid 2's comparison and leaving this pool with two grammars where the census already records only two across three variants.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **The asymmetry is between a person and a building.** What the town has against sickness is somebody; what it has against hunger is nowhere. One is a door you can knock on and the other is a thing that was never built. That is the concrete shape of the arrangement and it needs no history to carry it.
- **The care is spellcraft and the world may not have it.** The record files the row under Magic with a low licence, and in a world without magic the row is worth nothing and this pool does not exist at village. So the thing standing between the town and an outbreak is a first-level caster whose whole answer is what can be said over a wound — which is an enormous amount compared with nothing and a very small amount compared with a hospital. **The record holds exactly that gap and no shipped row has stood in it.**
- **What the absence looks like on the ground.** There is no barn to open and no office to apply to; there is no ruin either, because no village in the product has ever had a granary. A bad year here is not a store running down. It is every household's own loft running down at the same time, with a healer in the village and nobody to ask about grain. **The record is silent about the loft and the neighbours and the asking, and that silence is the writer's to use.**

---

## 4. THE PACKET'S OWN VERDICT, for the writer's first pass

**The pool's identity in one sentence: the village that has the healer and has never had a granary.** 31 towns, 4.04 % of the sample, all at village tier, the second rarest pool of the block's twenty-three. Its whole discriminating content against the 75.78 % of villages next door is one first-level divine caster on the roster.

**Two claims are SAFE and they are the pool** — no communal grain, and something that answers sickness. Everything else in the three shipped rows is outside the read.

**Four faults are structural and the rewrite must clear all four:**

1. ⛔ **"contain"** (vid 1) is contradicted by the block's own `Internal Security` row at 100 % of this pool's towns, and is inherited from the shipped engine string.
2. ⛔ **the history** (vid 3, twice) is refused by this block's own PROVENANCE FENCE in its own words, and is inverted in fact — the healer is why the plague is less likely, not evidence that one came.
3. ⛔ **the totality and the feeling** (vid 2's close) are two REFUSED COLUMNS in one clause, and the `which`-tail is a hard wall on top.
4. ⛔ **the trend** (vid 3's close) is contradicted by the page rather than the field: this is the ONE row of the five whose badge is re-judged every pulse while its prose key stays frozen, and the tab's own subtitle tells the reader so.

**Three turns are worth carrying verbatim:** *keeps no food against a bad harvest* (vid 1), *better prepared for the sickness than for the hunger* (vid 2, as structure), *is arranged against* (vid 3).

**The flavour the rewrite should reach for, in one line each:** the care is a door and not a building; it is paid for and it is spellcraft; the missing granary is not a ruin but a thing the tier has never been offered; and the two halves of this key are the same absence of a common store, with a person standing in one gap and nothing in the other.

**Two form debts the rewrite must also settle:** vids 1 and 3 both open on `{settlement}`, and T-F8 refuses a sentence face opening on a `proper`-typed slot while R-DA-17 caps the settlement token at one opener per pool — so **at most one of the twelve faces may carry a settlement opener, and strictly it may carry none in sentence form.** And the census records `variants: 3, grammars: 2` — **two distinct level-1 grammars across three variants**, at A11's floor; the twelve faces are the opportunity to mend it.

Status: **COMPLETE.**
