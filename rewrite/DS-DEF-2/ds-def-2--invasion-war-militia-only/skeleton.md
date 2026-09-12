Seat: MARKER (opus), DS-DEF-2 · pool `Invasion & War: militia only` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Invasion & War: militia only` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2650-2653`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:650-673`; the pool's manifest row at `:1194-1208` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:663`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A face that adds the town's name to vid 2, or drops it from vid 1 or vid 3, is refused by the projector before any reader sees it. A sentence-form face may not OPEN on a `proper`-typed slot either (T-F8), so `{settlement}` sits inside the sentence, never first.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: militia only'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Invasion & War: militia only`)
  reads:      invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  invasionRowSituation(walls, garrison, militia) === no walls, citizen militia
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading, so every pool
              that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted
              there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row
              `no walls, citizen militia` of `INVASION_ROW_POOL` in `defenseStateProse.js`, as a
              STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b),
              another civic object of the class `force`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null
              everywhere); a named character and that character's fate (product scope); a
              theological claim about a deity (the deity doctrine)
```

⚠ **Two card lines are narrower than the code, and the writer should know both.**

1. `source: muster` prints as one holder, and on this key it genuinely is one: the walls, the garrison and the militia are all the MUSTER's records (`holderTable.js:188`, `:189`, `:190`). Unlike the beasts rows, **no second holder joins this reading** — the country's tier is not consulted by this key at all. Everything this pool knows, it knows off one roll. The muster is NOT marked interested (`holderTable.js:105-115`: only the office, the court, the treasury and the watch are state organs at birth), so nothing here is an interested fact.
2. `may NOT: another civic object of the class force` is the T-F12 attach fence, written for modifiers. This pool is a SPINE with an empty attach set, so the line binds the writer only in its plain reading: the face states THIS reading of the force buckets and does not go shopping in the four buckets the key never touched.

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags and `compound.inst`. This pool is row 2's `no walls, citizen militia` branch.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at this block's call sites. See the wall above: this pool's three parents are NOT uniform and each face inherits its own parent's set.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job here is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch's lowercase sentence lead, and a presence check on `institutions.walls` in place of `defenseProfileHasWalls`. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses (walls without people cannot be held) and never HISTORICAL ones (walls built after a siege)** unless the history surface supplies the ancestry. It does not here.
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `INVASION_ROW_POOL` (one of the other five situations) and never a second print of this one.
- **PDF PARITY:** parity (`viewModel.js` defense slice) — every face prints in the PDF as well as on the tab.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows.

⚠ **The which-clause bar bites vid 1 immediately.** The shipped `[ledger]` line is built on `…, which counts for something…`. That construction leaves with the rewrite (R-DA-03: the qualification gets its own sentence, never a tail). The CLAIM it carries survives; the tail does not.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first in its own composed unit — and the tab stacks the five rows' prose as ONE italic block of paragraphs, the first at a larger size, above the five bars (`DefenseTab.jsx:113-114`, `:316-320`). So the reader meets this sentence as part of a passage, and on most of this key's range it is the FIRST paragraph in that block (see §0.7). Every face must hand a noun forward that the next row could pick up (the muster, the ground, the road in, the town's own people, the line that is not there) and must close on a standing fact rather than a set-up.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

### 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

The predicate is one function of three booleans (`src/domain/display/stateProse/defenseStateProse.js:476-485`), and this key is its LAST line:

```
function invasionRowSituation(walls, garrison, militia) {
  if (walls) { ... }
  if (garrison) return 'no walls, professional garrison';
  return militia ? 'no walls, citizen militia' : 'no walls, no force';
}
```

The caller fixes what the three arguments are (`defenseStateProse.js:622-625`, `:656`):

```
const forces = standingDefenseForces(settlement);
const walls = forces.walls.present;
const garrison = forces.garrison.present;
const militia = forces.militia.present;
...
invasion: rung(invasionRowPoolKey(walls, garrison, militia)),
```

**All three reads are consulted on this key and two of them are measured NEGATIVES.** The desk's own docblock states the rank explicitly: *a garrison outranks a militia*, which is why eight boolean combinations collapse into six situations — so a town holding both is read as garrisoned, and reaching THIS key means the garrison bucket is provably empty, not merely unmentioned.

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `standingDefenseForces(settlement).walls.present` === **false** | NO standing member of the walls bucket is on the town's LIVE roster. The closed keyword set is `wall` · `citadel` · `palisade` · `earthwork` · `inner citadel` · `massive walls` (`defenseInstitutionBuckets.js:84-87`), matched as SUBSTRINGS over the institution's native semantic name | the MUSTER (`holderTable.js:188`) | **the absence is total over that closed set and wider than "no stone wall".** `Gates (if walled)` carries `wall` inside `walled` and would match, so on this key the roster carries no gatehouse row either, and `Palisade or earthworks` — the timber-and-earth option at hamlet and village — is denied too. No wall, no bank, no stockade, no ditch counted as works, no controlled entry point | the reading is ruin-filtered and LIVE (`defenseInstitutionBuckets.js:155-182`), so it is a fact about TODAY and not about what was ever built. It says nothing about whether anything ever stood, and nothing about the ground itself |
| `garrison.present` === **false** | no standing member of the garrison bucket: `garrison` · `barracks` · `professional guard` · `professional city watch` · `multiple garrison` (`:88-91`) | the MUSTER (`holderTable.js:189`) | no paid soldiers, no barracks, no professional watch. Note the fourth keyword: **a `Professional city watch` sits in the GARRISON bucket**, so denying the garrison here also denies the full-time city watch | it does not deny the PART-TIME `Town watch`, which is a different bucket (`:95-97`) — see the row below |
| `militia.present` === **true** | at least one standing member of the militia bucket: the closed set is just `citizen militia` · `militia` (`:92-94`). In the shipped catalogue exactly one row fills it — **`Citizen militia`**, authored at three tiers with three different descriptions | the MUSTER (`holderTable.js:190`) | the catalogue's own words for the thing, which are free to a writer: at hamlet, *"Able-bodied residents drill and muster against local threats. Part-time service."* (`institutionalCatalog.js:335-341`); at village, *"Organised community defense. Musters for raids and monster incursions. More reliable than hamlet levies."* (`:867-873`); at town, *"All able-bodied citizens obligated to defend town. Part-time service. Present only when no professional watch exists."* (`:1340-1347`). **Drill, muster, obligation, part-time, other work** are all on the record | it is a PRESENCE and a bucket, never a headcount, never a readiness, never a training level. `count` and `names` exist on the projection (`defenseInstitutionBuckets.js:168-181`) but THIS key reads only `present` |

**The reads the desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- **The four other defence buckets are invisible here.** `watch` (`town watch` · `city watch` · `professional city watch`), `mercenary` (`mercenary company` · `mercenary quarter` · `hired muscle`), `charter` (the adventurers' halls) and `magicDef` (`wizard` · `mages' guild` · `mage` · `academy of magic` · `golem workforce` · `alchemist`) are four buckets of the same seven-bucket partition (`defenseInstitutionBuckets.js:95-109`) and **this key reads none of them.** A town this pool selects may hold a part-time Town watch, a mercenary company, a charter hall, a wizard's tower and an alchemist, all at once.
- **The country is not read at all.** `config.monsterThreat` reaches row 1 of the assessment and never this row. This pool fires on a plagued country, a frontier and a heartland alike.
- **The badge beside this very sentence is `defenseProfile.scores.military`** (`DefenseTab.jsx:180-190`; the ladder `defenseScoreBands.js:38-39`, STRONG ≥ 65, ADEQUATE ≥ 40, WEAK ≥ 20, else CRITICAL). On this key the walls' +30 and the garrison's +28 are both unearned and the militia contributes **+10** (`defenseGenerator.js:162`). What can still lift the bar is exactly what the key cannot see: the watch +7, a mercenary company +14, a charter hall +10, arcane deterrence ten to twenty-five with a further +5 for a wizard's tower and +8 for an arcane guild, a divine martial blessing +6 (`:163-175`), all multiplied by a terrain bonus up to 1.28 for mountain ground (`:130-136`), and at thorp, hamlet and village a whole COMMUNITY BASELINE before any of it — isolation two to eight, communal arms six to ten, a church +3, a reeve or elder +3 (`:138-155`). **So the badge beside this sentence is usually WEAK or CRITICAL, is sometimes ADEQUATE, and when it is higher the reason is terrain or a body this pool's key never consulted.**
- **`config.stressTypes` is read by NO key function of this block.**
- **The funding note printed under this row names an institution the key denies.** `READINESS_GATE_FOR['Invasion & War']` is `['military', 'garrison pay']` (`defenseDisplay.js:280`), so an underfunded military gate renders *"Upkeep underfunded: garrison pay at NN%"* directly beneath a row whose key asserts there is no garrison. That is a WIRING row for the chair, not a wording row — but it is a reason for a face here to keep well away from pay.

### 0.6 The provenance move, priced for this pool

The card licenses a citation of the muster where the budget allows. The ceiling is ONE per unit (Part B §24) and only for one of S3's three reasons: two accounts that disagree; a count from an interested party; a record whose keeper is a power. **None obtains here.** There is only ONE holder on this key — the muster — so there are no two accounts; no count is stated; the muster is not a state organ (`holderTable.js:105-115`). The exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool.** The record-vocabulary bar is struck, so a `[ledger]` face may reach freely for the roll, the muster, the return, the entry, the books; that is vocabulary, not a citation, and it is free.

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE — three sibling surfaces this key FIXES, and they are the sharpest hazard in the packet

This pool's three booleans are the SAME three locals that fix two other prose rows on the same tab. A face that does not know this will be claim-identical to a paragraph printed inches away.

1. **The Beasts & Monsters row above is either SILENT or says exactly what a naive face here would say.** Row 1 reads `beastsRowPoolKey(family, walls, garrison || militia)` (`defenseStateProse.js:655`), so on this key perimeter is false and force is TRUE. Walk `beastsRowSituation` (`:429-441`): a **plagued** country with a force and no perimeter returns `''`; a **settled** country with a force and no perimeter returns `''`. Both are nulls the desk deliberately keeps (its own docblock: *the corpus did not write those readings and the desk says nothing rather than rounding them into a neighbour*). Only **frontier** returns a pool — `frontier country, force without a perimeter`. Therefore:
   - on a **plagued or settled** country this Invasion row is **THE FIRST PARAGRAPH** in the prose block and carries the larger type (`DefenseTab.jsx:318`). It opens the passage, and the thread starts here.
   - on a **frontier** country the paragraph immediately above it is `Beasts & Monsters: frontier, force without a perimeter`, whose shipped rows already say *"keeps armed people on an open frontier"*, *"finds soldiers … and no wall for them to stand on"*, *"can answer trouble and cannot prevent it"*. **A face here that spends itself on "armed people, no wall" is the paragraph above, rewritten.** The discriminating claim of THIS row is the THREAT CLASS: organised war, an army, a siege — not the country.
2. **DS-DEF-5 prints TWO of its pools on this same tab from these same booleans.** `walls ABSENT` fires (*"{settlement} is unfortified… cannot control entry and cannot make a chokepoint of anything"*; *"A stranger arrives … from whichever direction suits him"*) and `militia PRESENT (no garrison)` fires (*"{settlement}'s defense is its own people under arms. They know the ground, they can be raised, and raising them stops everything else the town was doing"*). **The shipped vid 1 and vid 3 of this pool are already very close to that second row.** DS-DEF-5 states presence and absence as facts about the roster; DS-DEF-2 row 2 states what the COMBINATION means against organised aggression. That difference is this pool's whole job.
3. **A headcount belongs to DS-DEF-5, not here** (the block's own ruling R-9). A slowly thinning muster is model-true and is no longer barred; a NUMBER of anybody collides with that surface.

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into

The block's own set is `rewrite/rulings-DEF2-v14.txt`. The rows below are the ones this key can actually reach.

| the claim that would be false | the field that denies it, and which of the two is the record |
|---|---|
| **"no defense", "nothing organized", "nobody stands for it", "undefended"** as a TOTALITY | this key's own `militia === true` denies it from inside — there IS an organised body — and `defenseInstitutionBuckets.js:95-109` denies it from outside: `watch`, `mercenary`, `charter` and `magicDef` are four buckets the key never reads. **The roster is the record.** This is the `neither walls nor force` row's claim, one line down the same table, and it is not this one's |
| **naming "the garrison" or "the watch"** as a body here | the alias rule of the block's set. "The garrison" only where a `Garrison` or `Multiple garrisons` row resolves — denied outright by this key. "The watch" as a NAME only on a resolved watch row, **and never both a watch and a militia on one town** — so the word is barred here twice over, once by the alias rule and once because at town tier the `Town watch` and the `Citizen militia` share the `civilianDefense` exclusive group (`institutionalCatalog.js:1340-1355`). "The militia" IS licensed here, and it is the one of the three that is |
| **"the guard"** as the town's force | the rulings' own row: `the guard` is the power generator's FALLBACK label on a town whose safety profile prints *"There is no meaningful guard presence."* (`safetyProfile.js:300`). The safe words are **the militia**, **the muster**, **the town's own people**, **the community** |
| **a perimeter thing of any kind standing here** — a wall, a bank, a stockade, a palisade, a gate, a gatehouse, a ditch counted as works | `defenseInstitutionBuckets.js:84-87` (the closed keyword set) and this key's own `walls === false`. `Gates (if walled)` matches `wall` as a substring, so even a gate row cannot stand |
| **a HEADCOUNT, a roster size, a muster strength, a number of anybody** | the block's ruling R-9: a count of the town's forces is DS-DEF-5's cell. This key reads `present`, never `count` |
| **a training level, a readiness, a drill schedule, a rate of turnout** | the militia bucket carries presence only. The catalogue's `desc` is available as VOCABULARY (drill, muster, part-time, obligation) and is not a measurement |
| **a magnitude, a season, a date, a founding, an elapsed course, a rate, a trend** — "has held for years", "has not been called out since", "will be called out again" | FLOOR-2b. No state-prose pool key reads a history field; `history.age` is frozen at birth and rerollable; A2 and THE PROMISE refuse the future indicative |
| **a PREDICTION the simulation adjudicates** — "takes this town", "would fall", "cannot hold", "will be overrun" stated as outcome | FLOOR-2b, and the rulings name one of the four shipped clauses still false on exactly this ground (*"takes this town with ladders"*, on the sibling row). The lawful form is the CAPABILITY clause and the subjunctive edge, never the result |
| **explaining or outrunning the BADGE** beside the prose | `defenseGenerator.js:159-192`; `defenseScoreBands.js:38-39`. This pool's key and the badge are computed from DIFFERENT inputs — the badge moves on terrain, the watch, a mercenary company, a charter hall and arcane deterrence, none of which the key reads — so an intensity word here is instrument-held and a face that EXPLAINS the bar is refutable at once |
| **a purse split, or a total collapse of pay** — "the wall kept and the muster not", "nobody is paid at all" | ONE military multiplier over garrison wages and wall maintenance together, with a floor of 0.6 (`defenseGenerator.js:182-192`). The licensed extreme is short, late or thin and never none — **and on this key there is no wall and no garrison to pay, so a pay clause here is doubly wrong.** The generator's own comment names the community baseline (armed households, terrain alarm) as unpaid and exempt |
| **`plagued` read as disease, or `settled` read as "no live threat"** | the engine meanings. This key does not read the country at all, so neither word belongs in a face here in any reading |
| **a minted PROPER NAME** borne by the face (a person, an inn, a lane, a family, a road) | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The town's NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **a totality over persons** — "every man", "all the able-bodied", "the whole town turns out", "nobody is excused" | the REFUSED COLUMNS line: a totality over persons, and an exemption from a duty (`whoIsExempt` is null everywhere). ⚠ **This is the trap this pool is most likely to walk into**, because the catalogue's own `desc` says *"All able-bodied citizens obligated to defend town."* That string is the CATALOGUE's, on the town-tier row only, and it is not a licence for the prose to quantify over the town's people. Write the militia as a body, never as a census of who is in it |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these do not carry may not be asserted: the institution roster read through the LIVE ruin-filtered roster (`institutionRoster.js`, `liveInstitutions`); **the seven defence buckets** — `walls`, `garrison`, `militia`, `watch`, `mercenary`, `charter`, `magicDef` (`defenseInstitutionBuckets.js:83-110`); the faction list; the faith entries; the NPC office roster. Everything else is silence, and silence is permission. In particular the militia bucket's closed keyword set is `citizen militia` · `militia`, filled in the shipped catalogue by the single row `Citizen militia` — so **the thing this pool asserts is one rostered row, not a category of martial life.**

**Not a faith pool.** The deity's four axes, the derived temper (`deityTemper()`, never the inert stored `temperamentAxis`), the pantheon rank, the settlement standing and the suppressed flag do not arise here and no face may reach for them.

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects

`no walls, citizen militia` fires on **every town whose live roster carries a militia-bucket member and no walls-bucket member and no garrison-bucket member**, and on NOTHING ELSE about the town. That is:

- **Chiefly hamlet and village.** These are the two tiers whose catalogue puts `Citizen militia` beside `Palisade or earthworks` with no exclusive group between them: at hamlet 0.15 against 0.12 (`institutionalCatalog.js:335-349`), at village 0.22 against 0.18 (`:867-881`). A militia that rolls in while the palisade does not lands exactly here. **The village row is the more capable body by the catalogue's own words** (*"Organised community defense … More reliable than hamlet levies"*), so the same sentence prints over two genuinely different musters.
- **THORP essentially never, natively.** The thorp catalogue has no Defense section at all (the five Defense blocks sit at `:334`, `:866`, `:1331`, `:1909`, `:2346` — hamlet upward). A thorp reaches this key only through the cascade's one-tier reach, custom content, or the world pulse.
- **TOWN essentially never, natively — and this is the range's sharpest corner.** At town tier `Citizen militia` (0.6) and `Town watch` (required, baseChance 1) share the `civilianDefense` exclusive group, and `assembleInstitutions` runs one pass in catalogue order: the militia is processed first and may take the group, then the required watch EVICTS it by splice and takes the group itself (`assembleInstitutions.js:282-293`). The catalogue row says so in as many words: *"Present only when no professional watch exists."* The cascade cannot restore it at town tier either, because the group is taken (`cascadeGenerator.js:167`) — **unless** the cascade seats the VILLAGE row instead, which carries no `exclusiveGroup` at all (`:867-873`) and so passes that gate. So a town in this pool is rare and, where it exists, is likely carrying a part-time watch beside the militia that the key cannot see.
- **CITY and METROPOLIS only through ruin or custom content.** Neither catalogue holds a `Citizen militia` row (`:1909-1937`, `:2346-2363`), and at city `City walls and gates`, `Professional city watch` and `Garrison` are all `required: true`. But `standingDefenseForces` reads `liveInstitutions` and is ruin-filtered, so a city whose walls and garrison rows have been ruined, carrying a militia from the cascade's one-tier reach, reads this pool with a city's population standing in it.
- **Every country tier.** `config.monsterThreat` is not read by this key. The one thing it changes is the paragraph above: see §0.7. Note that `threatDefensePlan` plants a fortification wherever the threat is `plagued` (at every tier) and a force under `plagued` only (`threatDefensePolicy.js:74-98`), so a **plagued** town that reaches this key has had its planted perimeter fail, be excluded, or be ruined — which is a real corner of the range and not a hypothetical.
- **Every stress state.** No key function of this block reads `config.stressTypes`. This pool prints under `monster_pressure`, `under_siege`, `occupied`, `famine`, `plague_onset` and `wartime`, each of which renders its own banner on the same dossier. **A face about a town that has never had to test the arrangement is absurd under an ACTIVE SIEGE or OCCUPATION banner, and the siege is the record.**
- **Every route, terrain, culture, prosperity rung and population band**, none of which the key reads — though terrain moves the badge beside the prose by up to 28 %.
- **Both clocks, and they disagree here.** The PROSE key reads the LIVE ruin-filtered roster (`defenseStateProse.js:622`); the BADGE beside it is `defenseProfile.scores.military`, judged at generation and never re-judged — the tab's own caption says so in as many words (*"as judged at the first survey"*, `DefenseTab.jsx:313`). **After a wall is ruined the sentence moves and the bar does not.**

A face must contradict no state in that range, not merely the town on this skeleton.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> {settlement} can put armed citizens on their own ground, which counts for something against a disorganized raid and for nothing at all against a disciplined force.

### 1.2 Every claim it makes, on the new test

- **The town CAN PUT ARMED CITIZENS on its ground — a capability, in the modal.** — **SAFE**, and it is the key's own read stated in exactly the lawful form. `militia.present === true` is a standing capability fact; "can put" is the capability clause the block's fence asks for and not a historical one. The catalogue's words back every part of it: *drill*, *muster*, *able-bodied residents*, *part-time service*.
- **The citizens are ARMED.** — **SAFE.** The militia row is a Defense-category institution tagged `['defense','military']` and the generator counts it as martial capability (+10 military, +12 monster). Nothing in the record says a militia is unarmed.
- **The ground is THEIR OWN.** — **SAFE**, and it is free: the militia is by construction the town's own residents, and a town standing on its own land is not a claim any field denies. ⚠ but see §0.7: DS-DEF-5's `militia PRESENT (no garrison)` row already says *"They know the ground"* a few inches below, so this exact phrase is the pool's weakest half, not its strongest.
- **It counts FOR SOMETHING against a DISORGANIZED RAID.** — **SAFE.** A raid is the invasion row's own threat class, "disorganized" is the discriminating contrast with the professional force in the same sentence, and "counts for something" is a hedge on effectiveness rather than a magnitude. The legacy desk's own string for this branch reads *"Effective against disorganized raiders"* (`threatAssessment.js:122`), so the rating is the desk's and a face may carry it.
- **It counts for NOTHING AT ALL against a DISCIPLINED FORCE.** — **SAFE as a capability contrast, and one step from a prediction.** The contrast is licensed: R-DA-02 keeps a contrast where the rejected alternative names a sibling pool key or band, and "a disciplined force" is precisely the reading of the sibling rows `walls AND professional garrison` and `force with NO walls` in the same table. The legacy string is *"No counter to a disciplined military force."* What would cross into FLOOR-2b is any version that follows it to an OUTCOME — the town falls, the town is taken, the town could not hold. State the capability; never the result.
- **"for nothing AT ALL"** — **SAFE but at the edge.** It is a totality over CAPABILITY, not over persons, and the desk's own word is "no counter". It is lawful as written; a face that reaches further (the militia is useless, worthless, pointless) is asserting a magnitude the read does not hold.
- **The `, which` tail.** — not a claim, but it LEAVES with the rewrite. R-DA-03 bars the which-clause; the qualification takes its own sentence. The claim is kept, the construction is not.
- **Implicitly: the town CHOSE this arrangement.** — the face does not assert it and must not. Institution presence is a STANDING fact with no recorded history (the block's own fence). A face saying the town DECIDED, DECLINED, NEVER BUILT, or SPENT ELSEWHERE is asserting an event-provenance the record does not hold. **FLOOR-2b** if written. (Note that DS-DEF-5's own `[counterforce]` row does exactly this — *"could keep soldiers and does not; the town has decided…"* — which is that pool's problem and not a precedent for this one.)

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `militia.present === true`: one rostered body, `Citizen militia`, in a two-word closed bucket. Available as vocabulary from the catalogue's own descriptions: **drill, muster, able-bodied residents, part-time service, obligation, raids, monster incursions, levies**.
- `walls.present === false`: no wall, no citadel, no palisade, no earth bank, no gatehouse row. Measured over the live ruin-filtered roster.
- `garrison.present === false`: no soldiers on a wage, no barracks, and no full-time professional watch (it sits in this bucket).
- The key's own comparison, which is the pool and not an inference: **a force that belongs to the town, and no line for it to stand behind.**
- REACHED BY THE ENGINE AND NOT BY THE KEY, and therefore the writer's boundary: the part-time watch, the mercenary company, the charter hall, the wizard, the terrain multiplier, the readiness badge, the funding note, the country, every stress on the page.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

Every row of §0.8 is reachable from this variant. The four it is most likely to walk into:

| row | why this variant, specifically |
|---|---|
| **the totality over persons** | vid 1 already has the town as grammatical subject "putting" its citizens somewhere; one step further ("every household", "all the able-bodied", "the whole town") crosses into the refused column, and the catalogue's own town-tier string invites exactly that step |
| **the prediction** | the second half is a comparative capability. A face that turns "counts for nothing against" into "falls to" or "cannot hold against" is FLOOR-2b, and the rulings already strike a shipped clause of that shape elsewhere in the block |
| **the sibling collision with DS-DEF-5** | "their own ground" is nearly the words of `militia PRESENT (no garrison)` on the same tab. At least three of this variant's four faces should reach for something other than the ground |
| **the badge** | "counts for something" is an intensity word, and the bar beside it is computed from terrain and four buckets this key cannot see. Keep the intensity attached to the THREAT CLASS ("against a raid", "against an army") and never to the town's readiness in general |

### 1.5 The preimage, as it bites vid 1

See §0.9 whole. For this variant in particular: the face prints over a hamlet levy and a village's organised community defense with the same words, over a plagued country and a heartland alike, and under an active siege banner. **"Can put armed citizens on their own ground" survives all of that**, which is why the shipped claim is sound and only the construction needs to move.

### 1.6 The angle's stance in one sentence

`[ledger]` is the compiled entry: the office setting down what its own records hold, in the order a clerk would — so here it may state the muster's one filled column and its two empty ones flatly, as standing facts, and may carry the desk's own rating of what that combination answers and what it does not, without explaining either by the other and without reaching for a count, a course, a cause or a body the roll does not carry.

### 1.7 The turns worth keeping

- **The two-term capability contrast** (*counts for something against X · for nothing against Y*) is the variant's whole architecture and is licensed twice over: by R-DA-02's sibling rule and by the desk's own string. Keep the MOVE; vary the nouns and the joint. It must not become a "X, not Y" antithesis fronted as the subject.
- ***can put*** — the modal capability verb is exactly right for a standing-fact reading that must not become an event. Worth carrying verbatim into one face and finding three other verbs of the same grammatical weight for the rest.
- ***a disorganized raid*** / ***a disciplined force*** — the discriminating pair. The distinction the record actually holds is between a thing that arrives without a plan and a thing that arrives with one, and the pool's job is that distinction.
- What to drop: the `, which` joint (barred); *on their own ground* in at least three faces (the DS-DEF-5 collision).

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. A face that opens on the `{settlement}` proper slot (T-F8). A face carrying a which-tail, an em dash, a digit, a third sentence, or a summarising second sentence that says what the first one MEANT. Any face that drops the THREAT CLASS and becomes a statement about the roster — that is DS-DEF-5's sentence, not this one. Any face that follows the second term to an outcome.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **The muster's return on this town is one column filled and two empty, and the ledger angle owns that shape.** All three reads are the MUSTER's own records (`holderTable.js:188-190`) — this is the rare pool where every fact comes off one roll and there is no second holder to disagree with it. What the office holds is a list of names that can be called, and two headings with nothing under them. **A roll that can be read out but has no wall to send anyone to** is a concrete, particular, visible thing, and no shipped row has used it.
- **The thing this town has is a LIST, and the thing it lacks is a PLACE.** That asymmetry is the whole reading and it is free. A garrison is a building and a wage; a militia is an obligation and a name on a roll. The town's defence has an address only in the sense that everybody lives somewhere. Where the muster forms up is not recorded anywhere, because there is no gate to form up at — so it forms up where somebody decides, and that is a different kind of arrangement from one that has a wall to stand on.
- **What a stranger would notice, and what is free to say:** that the men who could be called are doing something else today. The catalogue's own word is *part-time*, three times over. The blacksmith is at the forge. The obligation is real and dormant at once, which is a standing condition and not an elapsed course. **The absence has a shape and it is not emptiness: nothing is ARRANGED against an army, and the arrangement against a raid is people, not works.**
- **What somebody would complain about, and it is on the record:** raising the militia *stops everything else the town was doing* (DS-DEF-5's own row says so, so it is the estate's claim already). A muster costs the town its working day. Nobody pays for that and nobody is compensated for it — the generator's own comment calls the community baseline *unpaid and exempt* (`defenseGenerator.js:187-188`). The cost of this defence is measured in work not done, which is a standing fact, never a bill.

---

## VARIANT 2 · vid 2 · `[street]` · **NO SLOT** — this variant never names the town

### 2.1 The shipped sentence, verbatim

> The town knows its own country and knows that knowing it is not an answer to a professional army.

### 2.2 Every claim it makes, on the new test

- **THE TOWN — the definite bare noun, no name.** — **SAFE and REQUIRED.** `slots: []` at `defense.generated.js:663`. Every face of this variant must refer to the settlement without naming it; "the town" is the estate's term and is the one used across the block's `[street]` rows.
- **The town KNOWS ITS OWN COUNTRY.** — **SAFE.** Local knowledge is not a typed field, and nothing in the record denies it; a militia is by construction residents, and residents knowing where they live is silence, which is permission. ⚠ but it is ALSO the neighbouring paragraph's claim on a frontier country (§0.7) and DS-DEF-5's *"They know the ground"* on every country. **This is the single most-repeated clause on the page and at most one face should carry it.**
- **Implicitly: knowing the country is a DEFENSIVE ASSET.** — **SAFE**, and better founded than it looks. The generator scores exactly this at the small tiers: terrain alarm and flight feasibility as an isolation bonus of two to eight, and communal arms and coordination of six to ten (`defenseGenerator.js:141-145`), with a terrain multiplier of up to 1.28 over the whole military score (`:130-136`). **Ground and knowledge of it are scored facts at hamlet and village**, which is where most of this pool's range lives.
- **Knowing it is NOT AN ANSWER TO a professional army.** — **SAFE as a capability contrast.** Same licence as vid 1's second term: the rejected alternative names the sibling rows that hold a garrison, and the desk's own string is *"No counter to a disciplined military force."* The face states what the arrangement does not answer; it does not state what happens instead.
- **A PROFESSIONAL ARMY.** — **SAFE as a threat class.** It is the invasion row's own class and names no actor, no neighbour, no faction and no war. ⚠ A face must not name a WHO: no neighbouring settlement, no faction, no crown, no besieger. The address law governs named neighbours and this key holds none; `warStatus.besiegedBy` is DS-DEF-7's field, not this pool's.
- **The town KNOWS that it is not an answer — the town's self-knowledge.** — **SAFE.** This is the `[street]` angle's own move: the town's understanding of its own arrangement, stated as a standing condition. It asserts no feeling, no motive and no interior of any person; it is the community's practical grasp of a fact the record also holds. It is NOT a forecast and must never become one.
- **The doubled "knows … knows".** — not a claim; a rhythm, and a good one. It is the variant's one figure of construction and the rewrite may keep the DEVICE in one face while three faces find other shapes (A11: no two variants of one pool share their first two words, and four faces of one variant should not share a construction either).

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

As §1.3. What vid 2 uses that vid 1 does not: the militia read taken as a fact about the town's PEOPLE rather than about the roll, and the walls read taken as the reason the knowledge has to do the work a line would otherwise do. Nothing here reads the country or the terrain — the terrain bonus is the badge's input, not this key's, so a face may say the town knows its ground and may not say the ground is a chokepoint, a height, a river or a forest.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

Every row of §0.8 is reachable. The five this variant walks toward:

| row | why this variant, specifically |
|---|---|
| **the triple collision** | *knows its own country* is the beasts row's claim above it on a frontier, DS-DEF-5's claim below it always, and this variant's opener. It is the most-repeated sentence on the defense tab. **At most one of this variant's four faces should turn on local knowledge; the other three must find the pool's other halves** |
| **the terrain claim** | this key reads no terrain field. "Knows its own country" is silence-is-permission; "knows the passes", "holds the high ground", "the river does half the work" are assertions about a geography field the key never touched, and the range spans plains, desert, coastal, riverside, forest, hills and mountain |
| **the prediction** | *not an answer to* is lawful; *would be overrun by*, *would not last*, *falls to* are FLOOR-2b |
| **naming a WHO** | "a professional army" is a class. Any neighbour, faction, crown, lord or besieger is a named actor the key does not hold and the address law governs |
| **a totality over persons** | "everybody here knows", "every man in the place" crosses into the refused column. "The town knows" is the town as a civic body and is safe; the people, counted or quantified, are not |

### 2.5 The preimage, as it bites vid 2

See §0.9 whole. For this variant: the face must be true of a hamlet of a few dozen and, through the ruin path, of a city; of a plagued country and a heartland; and **under an occupation banner**, where a claim that the town understands its own position reads very differently. "The town knows what its arrangement answers and what it does not" survives that; "the town has never had to find out" does not.

### 2.6 The angle's stance in one sentence

`[street]` is the town's own practical understanding of its arrangement, in the clerk's third person and never in anybody's mouth: it may say what the town treats as ordinary, what it organises its week around, what it does not pretend about itself — the deed and the standing habit, never a feeling, never a named person, never a quoted voice, and never a forecast.

### 2.7 The turns worth keeping

- **The self-knowledge move without pretence** — *knows that knowing it is not an answer* is the `[street]` register at its best in this block: the town holding two facts at once and settling neither into a boast or a lament. The sibling row `walls with citizen militia` uses the same move (*"does not pretend that turning out is the same as being defended"*) and the pool's own best face should keep the shape while finding its own object.
- **The threat class as the discriminator** — *a professional army* is what makes this the INVASION row rather than a roster note. Every face must carry an organised-war term: an army, a siege, a campaign, a force that arrives in order.
- **Bare "the town" as subject** — the slotless parent makes this the pool's most portable sentence. It is the one variant that can open on a plain civic noun with no proper name in it at all, which is what R-DA-17 asks for.
- What to drop from three of four faces: *its own country* and any near-synonym of local knowledge.

### 2.8 What would make the rewrite of vid 2 a regression

Any slot at all. Vid 2 not second, or not `[street]`, or fewer than four faces. A face that names a settlement, a person, a faction or an army's owner. A second sentence that summarises the first. A face that keeps local knowledge as its engine in more than one of the four. A face that reads as the town's feeling rather than its practice.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **This town's defence has NO BUILDING, and that is a street-level fact with a shape.** A garrison has barracks; a watch has a round and a gate to stand at. A militia has neither on this key — no walls bucket, no garrison bucket. So there is no place in this town that IS the defence. **The muster happens where the town decides it happens, and the rest of the year that place is a market square, a green, a threshing floor, somebody's yard.** A stranger cannot find the defence by walking to it. That is free, concrete, and no shipped row has used it.
- **The obligation is the thing, and the obligation is dormant.** The catalogue's word is *part-time*, at all three tiers. What this town holds is not a force but a claim on its own people — a list of who can be called and an understanding of when. **It is a standing arrangement that is invisible on an ordinary day and total on the day it is not**, and that is a standing condition rather than an elapsed course, so it is lawful.
- **What the town does not pretend, stated as practice rather than as mood.** The distinction between answering a raid and answering an army is one the record itself draws (`threatAssessment.js:121-123`), so a town that draws it is not being characterised — it is agreeing with its own file. The `[street]` angle may say what the town organises around, what it does not plan for, and what it has decided is not worth planning for, provided none of that becomes a date or a decision.
- **The cost of the arrangement is a working day, and the street is where that lands.** The engine counts the community baseline as unpaid (`defenseGenerator.js:187-188`) and DS-DEF-5 already says that raising the militia stops everything else the town was doing. **Nobody is compensated. The defence is paid for in hours, by the same people who would be defended**, and that is a fact about the town's week, not a bill and not a purse.

---

## VARIANT 3 · vid 3 · `[visitor]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.

### 3.2 Every claim it makes, on the new test

- **A STRANGER is at the settlement and MEETS the armed townspeople.** — **SAFE**, and it is the `[visitor]` angle's licensed frame across the block. It names no person, asserts no reaction, and asks nothing of the reader. ⚠ note the range: on this key there is no gate, so the stranger is not ADMITTED anywhere — see §3.9.
- **The townspeople are ARMED.** — **SAFE**, as vid 1.
- **They are TOWNSPEOPLE — the town's own residents.** — **SAFE** and it is the discriminating half against the garrison sibling. A `Citizen militia` is by construction residents; the row's own descriptions say *able-bodied residents* and *community defense*.
- **They are ENTIRELY COMPETENT on their own ground.** — **SAFE as a capability reading, and at the edge on "entirely".** The record rates the militia as effective against disorganised raiders (`threatAssessment.js:122`) and scores communal arms and terrain alarm at the small tiers (`defenseGenerator.js:141-145`). "Entirely competent" is an intensity word on a capability the desk itself rates positively, which keeps it inside the reading; a face that turns it into a magnitude the record does not hold (*as good as soldiers*, *a match for anything*) crosses. ⚠ and *on their own ground* is the third print of that phrase on one tab: §0.7.
- **They have NEVER STOOD IN A LINE WITH ANYBODY.** — **CONTRADICTED as written, on two counts, and the record is what must be obeyed.**
  1. **"Never" is an elapsed course over the town's whole past.** No state-prose pool key reads a history field; `history.age` is frozen at birth and rerollable; institution presence is a STANDING fact with no recorded history (the block's own fence, in its own words). A sentence that says what these people have and have not done across their lives is FLOOR-2b, not a standing reading of `militia.present`.
  2. **It is a totality over persons.** "Never … with anybody" quantifies over every member of the militia and over everyone they might have stood beside. The REFUSED COLUMNS line bars a totality over persons outright, and the range makes it concrete: at village tier a `Veteran's lodge` sits in the same Defense block (`institutionalCatalog.js:882-888`) — *"A drinking hall where retired soldiers and mercenaries gather"* — and it is in NO defence bucket, so the key cannot see it. **A village this pool selects may hold a hall full of men who have stood in a line, and the sentence denies them.**
  The CLAIM the clause was reaching for is lawful and should survive in another form: **these are not soldiers, and formation fighting is not what they are.** That is a capability reading of the militia bucket against the garrison bucket, stated in the present, over the body and not over the persons in it.
- **Implicitly: the stranger is in a position to JUDGE.** — **SAFE.** The visitor angle licenses what a stranger can see; it does not license a verdict on the town.

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

As §1.3. What vid 3 uses: the militia read as a body a stranger encounters, and the walls read as the reason he encounters them at all rather than being stopped at a gate. **The walls absence is this variant's strongest unused material** — the `[visitor]` angle is the one that can make a denied bucket visible, because a perimeter is the thing a stranger meets first and here there is not one.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

| row | why this variant, specifically |
|---|---|
| **the elapsed course** | the shipped clause already breaks it. Any *never*, *has not since*, *for as long as*, *in living memory* is FLOOR-2b |
| **the totality over persons** | the shipped clause already breaks it. *Nobody here has*, *not one of them*, *none of them has ever* are the same fault reworded |
| **the bodies the key cannot see** | the Veteran's lodge at village, the Free company hall at town (*"professional soldiers available between campaigns"*, `:1370-1376`), a mercenary company, a charter hall — **none of them is in a bucket this key reads, and each of them puts men who HAVE stood in a line inside a town this pool selects.** Any face that denies experience denies them |
| **a prediction** | *would not last*, *would break*, *would run* — FLOOR-2b, and the more tempting because the variant's second half invites it |
| **the badge** | *entirely competent* reads as a readiness, and the bar beside it is computed from inputs the key does not hold. Keep the competence attached to the threat class |
| **naming "the watch" or "the guard"** | a stranger's natural word for people met at the edge of a town is the one word this key most firmly bars: see §0.8 |

### 3.5 The preimage, as it bites vid 3

See §0.9 whole. For this variant: a stranger arriving at a hamlet of forty and, through the ruin path, at a ruined-walled city; under a siege banner, where "meets armed townspeople" reads as a mobilisation rather than an ordinary encounter. **The lawful core — there is no line, and the people he meets belong to the place — is true across all of it.**

### 3.6 The angle's stance in one sentence

`[visitor]` is what an outsider can establish from the outside in one pass: what he meets, what he is not stopped by, what is and is not arranged where he can see it — stated in the clerk's third person about the stranger and never addressed to the reader, never a reaction assigned to him, never a judgment on the town, and never a fact he could not have obtained by arriving.

### 3.7 The turns worth keeping

- **The stranger as the instrument of the absence** — a visitor is the one angle for which "there is no perimeter" is an EVENT of arriving rather than a line in a return. The move is right; the object should move from the ground to the edge.
- **townspeople** — the exact discriminating noun against the garrison sibling's *men who belong to it*. Keep it or its close kin (residents, the town's own people, householders); never "the guard", never "the watch".
- **The two-term capability shape**, as in vid 1 and vid 2 — competent at one thing, not the other thing. It is the pool's spine and all three variants carry it lawfully.
- What to drop: *never stood in a line with anybody* (contradicted, §3.2) and *on their own ground* in at least three faces.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[visitor]`, or its slot set not `{settlement}` alone, or fewer than four faces. A face that opens on the `{settlement}` proper slot. A face that addresses the reader, asks a question, or assigns the stranger a feeling. **Any face that carries the shipped clause's elapsed course or its totality over persons forward in new words.** Any face that gives the stranger a name, a trade or a companion.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **NOBODY ADMITS THE STRANGER, and that is the sharpest unused fact in the pool.** The walls bucket is denied over its whole closed keyword set, and `Gates (if walled)` carries `wall` inside its own name and is therefore denied too. **There is no gatehouse, no bar, no leaf to close, no controlled entry point, no place where the town begins.** The edge of the town is where the buildings stop and the road runs in. A stranger is not admitted; he arrives. Nothing on the way in decides anything about him — and then he meets armed people anyway, inside, among houses. **That inversion is the whole reading of this pool from the outside and no shipped row has touched it.**
- **He can tell what they are by what they are carrying and where they are standing.** A garrison is told by its billet and its wage; a militia is told by the fact that the man with a weapon is also the man with a trade, and is standing in his own street rather than at a post. The catalogue's word is *part-time*. **What a stranger notices is not a body of soldiers but a town in which a certain number of ordinary people are armed**, which is a different impression and a more unsettling one.
- **What a stranger would avoid, or complain about:** there is nobody to present himself to. No gate means no gatekeeper, so there is no office that takes a stranger's name, no one to ask where the inn is and be answered officially, and no one who is answerable if he is treated badly. He is inside before anyone has decided he may be. That is the absence of a rostered thing and it needs no invention.
- **And the record is silent about far more than it denies.** A village lodge full of retired soldiers and mercenaries; a town's free company hall, a contracting office for men who fight in formation on salary; a warden's lodge; a wizard's tower; an alchemist. **Every one of those is a rostered row that may stand in a town this pool selects and that the key cannot see** — which is exactly why a face here must describe the militia and not the town's whole capacity for violence.

---

## 4. THE PACKET'S OWN VERDICT, for the writer's first pass

- The three shipped CLAIMS are sound in their spine: a capability the town has, a capability it does not have, and the threat class that separates them. **One clause is CONTRADICTED and must not survive in any form** (vid 3's *never stood in a line with anybody*: an elapsed course and a totality over persons, denied by the Veteran's lodge and the Free company hall the key cannot see).
- One construction leaves by law: vid 1's `, which` tail.
- **The largest craft problem is not licensing but REPETITION.** *Their own ground* / *its own country* / *know the ground* is one claim printed three times in one prose block and a fourth time in DS-DEF-5. A rewrite that keeps it in every variant will be lawful and will still be the worst version of this pool.
- **The largest unused material is the ABSENCE OF AN EDGE** — the denied walls bucket, taken concretely: no gate, no gatekeeper, no place where the town begins, and a stranger who is inside before anybody decides he may be — and the SHAPE OF THE OBLIGATION: a list rather than a building, a claim on a working day, dormant and total by turns.
