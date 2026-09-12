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
