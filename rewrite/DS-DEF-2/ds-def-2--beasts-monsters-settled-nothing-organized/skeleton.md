Seat: MARKER (opus), DS-DEF-2 · pool `Beasts & Monsters: settled, nothing organized` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Beasts & Monsters: settled, nothing organized` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in that order. The rows below are the annex's at the dock tip `f20532e18` (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` lines 2625 to 2628) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:530-552`; the pool's manifest row at `:1114-1128` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:542`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A face that adds the town's name to vid 2, or drops it from vid 1 or vid 3, is refused by the projector before any reader sees it.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: settled, nothing organized'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: settled, nothing organized`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  beastsRowSituation(family, perimeter, force) === settled country, neither
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading, so every pool
              that selects a row of `BEASTS_ROW_POOL` shares ONE echo key: a mount counted
              there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
  may claim:  that the reader selects the row `settled country, neither` of `BEASTS_ROW_POOL`,
              as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
              and that character's fate; a theological claim about a deity
```

⚠ **One card line is narrower than the code, and the writer should know it.** The card prints `source: muster` as a single-source row. The predicate joins TWO holders: the perimeter, the garrison and the militia are the MUSTER's records (`holderTable.js:188`, `:189`, `:190`), and the country's threat tier is the ROAD's (`holderTable.js:234`, "the look of the country, which anyone travelling it can see"). That is a wiring row for the chair, not a wording row. What it gives the writer is this: **the country is a thing anybody on the road can see; the three absences are three empty buckets on a roll.** The muster is not marked interested (`holderTable.js:105-115` — only the office, the court, the treasury and the watch are state organs at birth).

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) rendered beside the prose, read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags and `compound.inst`. This pool is row 1's `settled country, neither` branch.
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`. See the wall above: this pool's three parents are NOT uniform and each face inherits its own parent's set.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch's lowercase sentence lead, and a presence check on `institutions.walls` in place of the predicate. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses and never HISTORICAL ones** unless the history surface supplies the ancestry. It does not here.
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is therefore FIRST in its composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `BEASTS_ROW_POOL` (one of the other six situations) and never a second print of this one.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is a SPINE and sits first. Every face must hand a noun forward that a later modifier could pick up (the country, the road, the roll, the town's edge, the watch's round) and must close on a standing fact rather than a set-up. There are zero modifier mounts on this pool today, so no sibling text is guaranteed to follow; the face must read as a complete unit alone AND as an opener.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness.

### 0.5 The reads this pool reaches, resolved — MATERIAL A WRITER MAY USE, never a bound on what may be written

The predicate is one function of three inputs (`src/domain/display/stateProse/defenseStateProse.js:429-441`), and this key is its LAST line:

```
function beastsRowSituation(family, perimeter, force) {
  ...
  if (perimeter) return 'settled country, perimeter';
  return force ? '' : 'settled country, neither';
}
```

The caller fixes what the three arguments are (`defenseStateProse.js:623-626`, `:654`):

```
const forces = standingDefenseForces(settlement);
const walls = forces.walls.present;
const garrison = forces.garrison.present;
const militia = forces.militia.present;
...
beasts: rung(beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia)),
```

So **all three of this key's reads are consulted, and two of them are measured NEGATIVES.** That is the difference between this pool and its `settled, perimeter` sibling, where the force is never read at all.

| read | what it holds on this key | holder | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|---|
| `measuredMonsterFamily(config.monsterThreat)` → `settled` | the country's monster tier is the calm baseline. The producer's word is `heartland`; the corpus word is `settled`; `low` is a legacy alias (`monsterThreat.js:41-61`, `defenseStateProse.js:279-284`). MEASURED, never defaulted: `normalizeMonsterThreat(undefined)` returns `'frontier'`, so the desk refuses to normalise an absent value and returns null instead (`:312-334`) | the ROAD (`holderTable.js:234`) — the look of the country, which anyone travelling it can see | the country is the quiet end of a ladder of three; creature activity is the lowest band; the tier is a thing visible from the road and not a thing on anybody's books | **a TOTALITY of safety.** `heartland` only MULTIPLIES threat DOWN (monster and siege ×0.3 at `stressGenerator.js:121`; occupation ×0.4 at `:168`; wartime ×0.4 at `:231`) and `monsterThreat.js:22-27` calls it "the calm baseline". A `monster_pressure` or `under_siege` stress can and does stand on a heartland town, and `config.stressTypes` can force one outright |
| `standingDefenseForces(settlement).walls.present` === **false** | NO standing member of the walls bucket is on the town's LIVE roster. The bucket keywords are `wall` · `citadel` · `palisade` · `earthwork` · `inner citadel` · `massive walls` (`defenseInstitutionBuckets.js:84-89`), matched as SUBSTRINGS over the institution's native semantic name | the MUSTER (`holderTable.js:188`) | **the absence is total over that closed keyword set, and it is wider than "no wall".** `Gates (if walled)` carries `wall` inside `walled` and would match, so on this key the roster carries no gatehouse row either. No wall, no citadel, no palisade, no earth bank, no gate | the reading is ruin-filtered and LIVE (`:162-182`), so it is a fact about today and not about what was ever built. It says nothing about whether anything ever stood |
| `garrison.present \|\| militia.present` (the `force` argument) === **false** | no standing member of the `garrison` bucket (`garrison` · `barracks` · `professional guard` · `professional city watch` · `multiple garrison`) and none of the `militia` bucket (`citizen militia` · `militia`) — `defenseInstitutionBuckets.js:88-93` | the MUSTER (`holderTable.js:189`, `:190`) | no paid soldiers, no barracks, no mustering citizenry. The muster's books on this town hold three empty buckets | **it is NOT the whole roll.** `watch`, `mercenary`, `charter` and `magicDef` are four further buckets of the same partition (`:94-107`) and this key reads NONE of them. See §1.2 and §3 — this is the sharpest row in the packet |

**The reads the desk performs and this key does NOT reach, listed so the writer knows the page around the sentence:**

- **`scoreBand(scores.monster)` renders the badge beside this very prose** (`DefenseTab.jsx:322-341`; the ladder at `defenseScoreBands.js:31-38`, `STRONG` ≥ 65, `ADEQUATE` ≥ 40, `WEAK` ≥ 20, else `CRITICAL`). On this key the monster score starts at ZERO — `heartland` adds nothing (`defenseGenerator.js:197-199`) and the walls, garrison and militia bonuses are all unearned. What can lift it is exactly what the key cannot see: a charter hall adds thirty-five, a hospital five, and the arcane, divine and druidic bonuses up to thirty-five more (`:200-211`). **So the badge beside this sentence is usually CRITICAL and is sometimes ADEQUATE, and when it is not CRITICAL the reason is a body this pool's key never consulted.**
- **The `Invasion & War` row on the same page is FIXED by this key.** It reads the same three locals (`defenseStateProse.js:655`), so whenever this pool fires, `invasionRowPoolKey(false, false, false)` returns `Invasion & War: neither walls nor force`, whose shipped vid 1 already says "has no line and no force" and whose vid 2 already says "nothing about the town would stop it". **A face here that spends its whole sentence on the bare absence is claim-identical to the row printed directly beneath it.** The discriminating claim of THIS pool is the COUNTRY, not the absence.
- `config.stressTypes` is read by NO key function of this block.

### 0.6 The provenance move, priced for this pool

The card licenses a citation of the muster where the budget allows. The ceiling is ONE per unit (Part B §24) and only for one of S3's three reasons: two accounts that disagree; a count from an interested party; a record whose keeper is a power. **None obtains here.** The muster and the road hold two DIFFERENT facts (the roll, the country), not two accounts of one; no count is stated; the muster is not marked interested (`holderTable.js:105-115`). The exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool.** A13's blanket citation ban is struck and the record-word bar W24 is struck entire, so the `[ledger]` face may reach for the roll, the returns, the entry, the books; that is vocabulary, not a citation, and it is free.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}`

### 1.1 The shipped sentence, verbatim

> {settlement} keeps no organized defense against the country, and in a heartland this quiet the arrangement is a reasonable one rather than a gap.

### 1.2 Every claim it makes, on the new test

- **The town keeps NO ORGANIZED DEFENSE.** — **CONTRADICTED** by the live roster on a large part of this key's range. The key reads three buckets of a seven-bucket partition: `walls`, `garrison`, `militia` (`defenseStateProse.js:654`). It never consults `watch`, `mercenary`, `charter` or `magicDef` (`defenseInstitutionBuckets.js:84-107`). At TOWN tier `Town watch` is `required: true` with `baseChance: 1` inside the `civilianDefense` exclusive group (`institutionalCatalog.js:1348-1355`), and its own printed description is "Part-time guards. Night patrol and gate duty." — a standing, rostered, organized body, present on every town-tier settlement this pool selects. An `Adventurers' charter hall` is likewise invisible to the key and adds thirty-five points to the badge printed beside this very sentence (`defenseGenerator.js:200`). **The record is the live roster; the face is the thing that must move.** The safe form is the one the key actually holds: no perimeter work, no garrison, no militia — three named absences, never a totality over every organized body. Row **F1-01/F1-06** in the table at §1.4.
- **The defense that is absent is directed AGAINST THE COUNTRY.** — **SAFE.** The key's own reading is row 1 of the assessment, the beasts row, and nothing in the record denies the direction.
- **The country is a HEARTLAND.** — **SAFE**, and it is the key's own measured read. `MONSTER_FAMILY_OF` maps the producer's `heartland` to the corpus word `settled` (`defenseStateProse.js:279-284`); `low` is the legacy alias (`monsterThreat.js:41-47`). Either word is available to a face. `frontier` and `plagued` are the other two rungs and naming the ladder is free.
- **The heartland is "THIS QUIET".** — **SAFE as a restatement of the band word**, and one step from a contradiction. `heartland` is the engine's "calm baseline" (`monsterThreat.js:22-27`) and is the low rung of three, so an intensity word that stays INSIDE the rung is the read's own. What crosses the line is a TOTALITY: `heartland` multiplies the monster and siege roll by three tenths and never to zero (`stressGenerator.js:121`), and `config.stressTypes` forces a stress outright at `:110` onward with no probability consulted. Row **F1-34**.
- **The arrangement is A REASONABLE ONE.** — **SAFE**, and better founded than it looks. `threatDefensePlan` plants a fortification only where the threat is `plagued`, or `frontier` at town scale and above, and plants a force only under `plagued` (`threatDefensePolicy.js:74-98`). **A heartland town is in neither branch: the engine itself requires nothing of it.** The shipped desk's own word for this exact branch is "Acceptable given the threat environment." (`threatAssessment.js:100`). The rating is the desk's, not the writer's, and a face may carry it.
- **The alternative rejected is A GAP.** — **SAFE, and the contrast is licensed.** R-DA-02 keeps a contrast only where the rejected alternative names a sibling pool key or a sibling band; "a gap" is precisely the reading of the sibling row `Beasts & Monsters: plagued, NO perimeter and NO force`, three rows up the same table. This is one of the few licensed contrasts in the block and it is worth keeping.
- **Implicitly: the absence is a CHOICE the town made.** — the face does not assert it and must not. Institution presence is a STANDING fact with no recorded history (the block's own fence). A face saying the town DECIDED, DECLINED, NEVER BUILT or SPENT ELSEWHERE is asserting an event-provenance the record does not hold. **FLOOR-2b** if written (an elapsed course). The lawful form is the capability clause: what the arrangement IS, never how it came to be.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

- `measuredMonsterFamily(config.monsterThreat)` → `settled`: the calm END OF A LADDER OF THREE, stated as a band and never as an emptiness. The word is the road's, not the roll's.
- `forces.walls.present === false`: no wall, no citadel, no palisade, no earth bank and no gatehouse row, measured over the live ruin-filtered roster.
- `garrison.present === false` and `militia.present === false`: no paid soldiers, no barracks, no mustering citizenry. **Both are measured negatives, not silences** — the branch consults `force` before it returns.
- The key's own comparison: an unfortified, unmustered town in the quiet band. That the two agree is the pool, not an inference.
- REACHED BY THE ENGINE AND NOT BY THE KEY, and therefore the writer's boundary: the watch, the mercenary company, the charter hall, the magical defences, the readiness badge, every stress on the page.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE

**Contradiction-table rows this pool's key can actually walk into** (the block's own set is `rewrite/rulings-DEF2-v14.txt`; the rows below are the ones THIS key can reach):

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-34** | a totality of safety — "nothing out there", "no danger", "meets nothing", "never troubled" | `stressGenerator.js:121` (heartland ×0.3 on monster and siege), `:168`, `:231`; `monsterThreat.js:22-27` ("the calm baseline"); `config.stressTypes` forces a stress with no roll (`stressGenerator.js:110` onward); `threatAssessment.js:113-130` builds an `Invasion & War` row for EVERY town and `DefenseTab.jsx:323-345` renders it beside this sentence |
| **F1-01 / F1-06** | "no organized defense", "no guard", "nobody stands for it", "no one is charged with it" as a TOTALITY | `defenseInstitutionBuckets.js:94-107` (`watch`, `mercenary`, `charter`, `magicDef` are four buckets the key never reads); `institutionalCatalog.js:1348-1355` (`Town watch` `required: true` at town tier). **The roster is the record** |
| **F1-02 / F1-05** | naming "the watch", "the guard", "the garrison", "the militia" as a body that IS or IS NOT here | the alias rule of the block's set: "the garrison" only where a `Garrison` or `Multiple garrisons` row resolves; "the watch" as a NAME only on a resolved watch row (town-plus); "the militia" only where the militia row resolves. Two of those are denied by the key and the third is invisible to it, so **every one of the three is a trap from a different direction** |
| **F1-07 / F1-32** | a perimeter thing of any kind standing here — a wall, a bank, a stockade, a gate, a gatehouse, a bar, a ditch counted as works | `defenseInstitutionBuckets.js:84-89` (the closed keyword set) and the key's own `perimeter === false`. `Gates (if walled)` matches `wall` as a substring, so even the gate row cannot stand on this key |
| **F1-40 / W-10** | outrunning the readiness BADGE printed beside the prose, or borrowing another arm's | `defenseGenerator.js:195-227`; `defenseScoreBands.js:31-38`. ⚠ this pool's key and the badge are computed from DIFFERENT inputs (the badge can read ADEQUATE off a charter hall the key cannot see), so an intensity word here is INSTRUMENT-HELD and not yet refutable either way — and a face that EXPLAINS the badge is refutable at once |
| **F4-02 / F4-03 / F4-04** | a purse split (the wall kept and the muster not); the four economic gates split in DIRECTION; a TOTAL collapse of pay | ONE military multiplier over "garrison wages, wall maintenance" together (`defenseGenerator.js:182`, `:189-192`); every gate has a floor, so the licensed extreme is short, late or thin and NEVER none. **On this key there is nothing to pay for, so a pay clause here is doubly wrong** |
| **F4-06** | the readiness band explained by what the town has or lacks | `defenseGenerator.js:197-211`: on this key the band moves on the charter hall, the hospital and the magical bonuses, none of which the key reads |
| **F2-01 … F2-09** | any magnitude, date, season, duration, founding, elapsed course, rate, trend, prediction, or dependency on a field the key cannot see — "never needed", "has not been troubled in years", "no one alive remembers", "will not need one" | the band vocabularies are closed; `history.age` is frozen at birth and rerollable; `ageBands.js`'s `HISTORICIZE_BAND = 'years-past'`; NO state-prose pool key reads a history field; A2 and THE PROMISE refuse the future indicative |
| **F1-126** | a minted PROPER NAME borne by the face (a person, an inn, a lane, a family, a road) | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. The town's NPC roster and the `{npc}` slots are the name authority; this pool has neither |
| **the DS-DEF-5 collision** | a HEADCOUNT, a roster size, a number of anybody | a count of the town's forces is DS-DEF-5's cell and stating one here collides with that surface (the block's own set, ruling R-9) |
| **the sibling collision** | spending the whole sentence on the bare absence of a line and a force | `defenseStateProse.js:655` — the `Invasion & War` row directly beneath reads the SAME three locals and is therefore ALWAYS `neither walls nor force`, whose own vid 1 says "has no line and no force". A face must carry the COUNTRY, which is the only thing this row holds that that one does not |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** Five rosters are closed, and a body, building, record-keeper, force or faith-house they do not carry may not be asserted: the institution roster read through the LIVE roster (`institutionRoster.js`, `liveInstitutions`); **the seven defence buckets — `walls`, `garrison`, `militia`, `watch`, `mercenary`, `charter`, `magicDef`** (`defenseInstitutionBuckets.js:84-107`); the faction list; the faith entries; the NPC office roster. Everything else is silence, and silence is permission. In particular the walls bucket's closed keyword set is `wall · citadel · palisade · earthwork · inner citadel · massive walls`, and **this key asserts that NONE of them stands** — which is a fact about that closed set and not about every possible thing at the edge of a town.

**Not a faith pool.** The deity's four axes, the derived temper (`deityTemper()`, never the inert stored `temperamentAxis`), the pantheon rank, the settlement standing and the suppressed flag do not arise here and no face may reach for them.

### 1.5 ⭐ THE PREIMAGE — the range of towns this key selects

`settled country, neither` fires on **every town whose measured monster family is `settled` and whose live roster carries no walls-bucket member, no garrison-bucket member and no militia-bucket member**, and on NOTHING ELSE about the town. That is:

- **Chiefly the small tiers.** At hamlet the whole Defense section is `Citizen militia` at `baseChance: 0.15` and `Palisade or earthworks` at `0.12` (`institutionalCatalog.js:334-349`); at village they are `0.22` and `0.18` (`:866-889`). **So the overwhelming majority of heartland thorps, hamlets and villages land in this pool** — it is the largest preimage of the seven beasts rows.
- **And a large share of towns.** At town tier `Town walls` is `baseChance: 0.5` and `Barracks` is `0.3` (`:1332-1339` and `:1363-1369`), so a heartland town with neither reads this pool — **and it carries a `required: true` Town watch while doing so** (`:1348-1355`). That is the range's sharpest corner and §1.2's first row.
- **City and metropolis, only through the ruin path or custom content.** At city both `City walls and gates` and `Garrison` are `required: true` (`:1910-1929`), so a generated city cannot reach this key at birth; but `standingDefenseForces` reads `liveInstitutions` and is ruin-filtered (`defenseInstitutionBuckets.js:162-182`), so **a city whose walls and garrison rows have been ruined reads this pool with a metropolis's population standing in it.**
- **With bodies the key cannot see.** A charter hall, a mercenary company, a `Free company hall` ("a billet and contracting office for a band of professional soldiers", `:1370-1376`, in NO bucket), a `Veteran's lodge` at village (`:881-888`, in no bucket), a `Warden's Lodge` that keeps tabs on beast migrations (`:1409-1418`, in no bucket), a wizard's tower, a healer. **Any of these may stand on a town this pool selects.**
- **Every stress state.** No key function of this block reads `config.stressTypes`. This pool prints under `monster_pressure`, `under_siege`, `occupied`, `famine`, `plague_onset` and `wartime`, each of which renders its own banner on the same dossier. **A face about an untroubled country is absurd under an ACTIVE SIEGE banner, and the siege is the record.**
- **Every route, culture, prosperity rung and population band**, none of which the key reads.
- **Both clocks, and they disagree here.** The PROSE key reads the LIVE ruin-filtered roster (`defenseStateProse.js:623`); the BADGE beside it is `defenseProfile.scores.monster`, judged at generation and never re-judged — the tab's own caption says so in as many words ("as judged at the first survey", `DefenseTab.jsx:313`). **After a ruin the sentence moves and the badge does not.**

A face must contradict no state in that range, not merely the town on this skeleton.

### 1.6 The angle's stance in one sentence

`[ledger]` is the compiled entry: the office setting down what its own records hold, in the order a clerk would, so here it may state the three empty columns of the muster's return and the country's measured band beside them, flatly and as standing facts, without explaining either by the other and without reaching for a body, a count, a course or a cause the roll does not carry.

### 1.7 The turns worth keeping

- *rather than a gap* — the CONTRAST is licensed by a named sibling (R-DA-02) and it is the pool's whole point: the absence is the fitted answer, not the missing one. Carry the move; vary the noun.
- *in a heartland this quiet* — the conditional frame that makes the absence a reading rather than a verdict is the right shape; the intensity must stay inside the rung, and the phrase must not grow into a totality.
- *keeps no ... against the country* — the DIRECTION is the discriminating half and must survive into every face, because without it the face is claim-identical to the `Invasion & War` row printed directly beneath.
- The comma-and-word joint between a state and its assessment is lawful and rationed; keep at most one face of the pool on it so the three variants do not collapse onto one punctuation.

### 1.8 What would make the rewrite of vid 1 a regression

Vid 1 not first, or not `[ledger]`, or its slot set not `{settlement}` alone, or fewer than four faces, or no longer the pool's canonical index-zero line. Any face that loses the COUNTRY — the quiet band is the pool's discriminating claim and without it the face is the `Invasion & War` row again. Any face carrying a totality over every organized body (§1.2 row one), a headcount, a purse, a date, a course, or an explanation of the badge. A face that opens on the `{settlement}` proper slot (T-F8) or closes on a set-up rather than a standing fact.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **The town has no edge, and that is a concrete thing rather than an abstraction.** This key denies the whole walls keyword set, and `Gates (if walled)` carries `wall` inside its own name, so it is denied too. There is no gatehouse, no bar, no leaf to close, no controlled entry point, no place where the town begins. **The edge of the town is where the buildings stop and the road simply runs in.** A stranger is not admitted; he arrives. Nothing on the way in decides anything about him. That is free, particular, visible, and no shipped row has ever used it.
- **The muster's return on this town is three empty columns, and the ledger angle owns that.** The walls, the garrison and the militia are all the muster's records (`holderTable.js:188-190`), and all three are measured negatives here rather than silences. What the office holds on this town is a roll with nothing written in the three places a roll would carry a defence — and a country measured from the road, by a different holder, which agrees with it. **Two records that agree is a shape the register has almost never used**, and it needs no citation to be visible.
- **The thing the badge is made of is somewhere else entirely.** On this key the monster score begins at zero and the only things that can lift it are a chartered company, a hospital, a wizard, a priest or a druid (`defenseGenerator.js:200-211`). So where a heartland town has any answer at all to the country, that answer is **a hall, a shop, a tower or a lodge, and not a line** — old soldiers drinking at a village lodge with no muster to join, a ranger's waypost keeping tabs on beast migrations for a town with nothing standing against them, a contracting office for soldiers who are between campaigns and not employed here. The record is silent about far more than it denies, and every one of those is a rostered row the key cannot see.
- **The absence has a shape and it is not emptiness.** Nothing here is ARRANGED as defence. The fields run to the treeline. What is kept against the country is kept by households, not by an office. None of that is a count, a date or an elapsed course; all of it is a standing condition, and a standing condition opens a question where a date closes one.

---

## VARIANT 2 · vid 2 · `[street]` · slots **NONE**

⛔ **This variant names no town.** Its slot set is `[]` (`defense.generated.js:539-544`) and its four faces must each carry no slot at all. It is the one row of the pool that a reader meets with the town's name nowhere in it, which is also the register's own preference (R-DA-17: the town's name is not the default opener) and which makes the pool's opener histogram healthy. Keep it slotless.

### 2.1 The shipped sentence, verbatim

> The town has never needed to think about what is outside it, and does not.

### 2.2 Every claim it makes, on the new test

- **The town has NEVER needed to.** — **FLOOR-2b** (an elapsed course). "Never" ranges over the town's whole past. The key is a standing boolean over today's live roster joined to a birth configuration; `history.age` is frozen at birth and rerollable, `ageBands.js`'s `HISTORICIZE_BAND` is `'years-past'`, and NO state-prose pool key reads a history field. The lawful form of the same idea is a STANDING one: what the town is arranged for now, not what it has been spared.
- **It has never NEEDED to** — i.e. the country has never made it necessary. — **CONTRADICTED** where a stress stands. `config.stressTypes` forces `monster_pressure` or `under_siege` outright with no roll consulted (`stressGenerator.js:110` onward), the heartland multiplier is three tenths and not zero (`:121`), and `monster_pressure` deducts up to twenty from the monster score on this very page (`defenseGenerator.js:432-441`). **The stress roster is the record.** Row **F1-34**.
- **The town does NOT THINK about what is outside it.** — **CONTRADICTED** on the same ground as vid 1's first row, and more sharply, because this clause names the activity rather than the body. At town tier the roster's required civilian-defence row is "Part-time guards. Night patrol and gate duty." (`institutionalCatalog.js:1348-1355`) — a nightly round is exactly a standing arrangement about what is outside, and it is `required: true`. A `Warden's Lodge` keeps tabs on beast migrations (`:1409-1418`). **The record is the roster.**
- **What the town thinks, as a body, about anything.** — **FLOOR-2** (a dependence on an unobserved field), and it stands beside a REFUSED COLUMN. No field carries what a settlement has considered, assumed or taken for granted, and a clause that puts one mind behind every resident is a totality over persons, which the card refuses always. MOVE-GRAMMAR §1.3 holds no FEELING move and no MEANING move for the same reason. The lawful conversion is the one the register already knows: **an act, an arrangement or an absence of one, never an interior.** What a town DOES is free; what a town THINKS is not a field.
- **The two halves join on "and does not", carrying the verb forward.** — **SAFE as a form.** The elision is a rhythm and the register spends rhythm freely. It is the only shipped row of the pool that is short, and the short line exists (R-DA-05: rhythm follows load). Keep at least one face of this variant short.

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

The same three as §1.3, read from the street rather than from the roll: the country's band is the thing anyone on the road can see, and the three absences are the things a resident would notice by their absence — no line to stand on, nobody paid to stand, nobody mustering. The watch, the lodge, the charter hall and the badge remain outside the key and are the writer's boundary.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE

Every row of the table at §1.4 applies. The rows this variant walks into by its own shape:

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F2-06** | "never", "has not had to", "has not been troubled", "no one here has seen", "not in living memory" — any elapsed course | no history field is read by any state-prose key; `history.age` is frozen at birth and rerollable |
| **F1-34** | the same course written as a totality about the country | `stressGenerator.js:110-125`; `config.stressTypes` |
| **the refused column** | a state of mind, an assumption, a habit of thought, a complacency, an expectation, held by "the town" as one body | no field; and a totality over persons is refused on the card always. **Also**: the register assigns no reaction (R-DA-01, R-DA-14) |
| **F1-01 / F1-02** | "nobody watches", "no one keeps an eye out", "nobody is charged with it" | `defenseInstitutionBuckets.js:94-107`; `institutionalCatalog.js:1348-1355` — the watch bucket is unread by the key and required at town tier |
| **A2 / THE PROMISE** | "will not need to", "would not know what to do", "if something came, the town would" as a FATE rather than a subjunctive edge | no move has a future indicative; the edge is subjunctive and the pulse adjudicates predictions |

The closed rosters and the not-a-faith-pool line at §1.4 bind here unchanged.

### 2.5 ⭐ THE PREIMAGE

As §1.5, with one emphasis this variant makes acute: **the slotless row prints identically in every town the key selects**, from a heartland thorp of a few dozen to a ruined city with a metropolis's population still living in it. There is no `{settlement}` to anchor it and no tier word in the bag, so a face here must be true of ALL of them at once. A clause that fits a hamlet and reads absurd in a town of thousands has no name in it to blame.

### 2.6 The angle's stance in one sentence

`[street]` is the town's own ordinary practice seen at ground level: what is done and not done here as a matter of course, stated flatly as a standing arrangement that everybody in it lives inside, never as what anybody thinks, feels, assumes or has learned, and never as a history of how it came to be that way.

### 2.7 The turns worth keeping

- The SHORTNESS. It is the pool's only short line and the register's own rule is that the short line exists. At least one face of this variant should stay under a dozen words.
- The elided second clause (*and does not*) is a clean, plain, unmannered joint that spends rhythm and buys no claim. The move is reusable even where the words are not.
- The refusal to name the town. Keep it, in every face.

### 2.8 What would make the rewrite of vid 2 a regression

Vid 2 not second, or not `[street]`, or gaining a slot, or fewer than four faces. Any face that carries a town-wide interior, an elapsed course, a "never", a future, or a totality about the country. Any face in which all four wordings are long — the variant's one structural asset is that it is the short one. A face that reads as a hamlet's alone, since the same bytes print in a ruined city.

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **At town tier there is a nightly round and no gate to do duty at.** The required row's own words are "Night patrol and gate duty" (`institutionalCatalog.js:1352`), and this key denies the entire walls keyword set, gatehouse row included. **A duty on the books whose object does not exist** is a genuinely dossier-shaped particular: the record holds the duty; the world holds no gate. It is available to a face as a standing condition and needs no count, date or cause.
- **Nothing here is anybody's job.** The three empty buckets are exactly the three that would put a person on a roll for the country. Whatever is done about what is outside is done by whoever is out there — a household, a herd, a field's edge — and not by an office with a name. The street angle owns that distinction and the record holds it without a word of interiority.
- **The ordinary thing is the direction of attention.** Everything the town has built is arranged toward itself and the road, not against the country: a village's lodge full of retired soldiers and no muster for them to join, a town's contracting office for soldiers between campaigns who are not employed here, a warden's waypost whose business is the country but whose town has nothing standing in it. Those are rostered rows the key cannot see, they are visible from the street, and the shipped line never reached for one of them.
- **The absence to write is the absence of an occasion, not of a feeling.** There is no muster ground, no roll to be on, no night the town is called out for, no arrangement that would need to be stood down. Write what does not happen here, which the record holds, rather than what nobody thinks, which it does not.

---

## VARIANT 3 · vid 3 · `[visitor]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> A stranger walks out of {settlement} in any direction at any hour and meets nothing that would justify a watch.

### 3.2 Every claim it makes, on the new test

- **A stranger may walk out IN ANY DIRECTION AT ANY HOUR.** — **CONTRADICTED**: a totality over the country and the clock. `heartland` multiplies the monster and siege roll by three tenths and never to zero (`stressGenerator.js:121`), and `config.stressTypes` can force `monster_pressure` or `under_siege` outright (`:110` onward). None of this block's five key functions reads a stress field, so **this sentence prints under an ACTIVE SIEGE banner on the same dossier**. Row **F1-34**; and the block's own set says it in terms — `settled` is the LOW monster-and-raider tier and never "no live threat".
- **He MEETS NOTHING.** — **CONTRADICTED** on the same field, and it is the harder half: "nothing" is an absolute over the whole country and every hour of it, where the record holds a multiplier and a band word.
- **Nothing out there WOULD JUSTIFY A WATCH.** — **CONTRADICTED TWICE, and this is the sharpest row in the packet.** First on the totality above. Second, and independently: **the key does not read the watch bucket at all** (`defenseStateProse.js:654` passes `garrison || militia`; the `watch` bucket is `defenseInstitutionBuckets.js:94-97`), and at TOWN tier `Town watch` is `required: true` with `baseChance: 1` (`institutionalCatalog.js:1348-1355`). So on every town-tier settlement this pool selects, **the face says the country would not justify a watch while the town's roster carries one.** The record is the roster. The word `watch` is also the block's own alias trap: it may NAME a body only on a resolved watch row, and this key cannot tell whether one resolved.
- **A STRANGER is the subject, and he walks.** — **SAFE.** He bears no proper name, no office and no fate, so F1-126 and the product-scope column are untouched. A visitor-angle face may put a person on the page as long as he stays a role and takes at most one act.
- **The town is a place one walks OUT OF.** — **SAFE**, and it is the variant's best structural asset: it puts the reader at the boundary, which is exactly where this key's three absences live.
- **Implicitly: what the stranger sees is what is the case.** — **SAFE** as long as the sentence lands on a standing condition. A visitor face that reports an IMPRESSION ("seems", "feels", "looks like a place where") is hedging on behalf of a person, which the register refuses (the vague-authority floor of R-DA-13, executable now). **Say what is there.**

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

The same three as §1.3, met at the town's edge: a country in the low band that anyone on the road can see; no wall, no bank, no palisade and no gatehouse to pass; nobody paid to stand and no citizenry mustering. What is NOT reached and is the boundary of this face in particular: **the watch**, the mercenary company, the charter hall, the magical defences, the readiness badge, every stress on the page.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE

Every row of the table at §1.4 applies. The rows this variant walks into by its own shape:

| row | the claim that would be false | the field that denies it |
|---|---|---|
| **F1-34** | "meets nothing", "in any direction", "at any hour", "unbothered", "a country that sends nothing at it" | `stressGenerator.js:110-125`; `monsterThreat.js:22-27`; `config.stressTypes` unread by every key of this block |
| **F1-02** | naming a watch at all — asserting one, denying one, or saying the country would or would not warrant one | `defenseInstitutionBuckets.js:94-97` (the `watch` bucket is not an argument to this key); `institutionalCatalog.js:1348-1355` (`required: true` at town tier). **This is the shipped clause that must not be carried forward** |
| **F1-07 / F1-32** | anything the stranger PASSES on the way out — a gate, a bar, a gatehouse, a stockade, a ditch read as works | the key's `perimeter === false` over the closed keyword set, gatehouse row included |
| **R-DA-13** | "seems", "feels", "has the look of", "you would not know", "it is said" — a hedge or a vague authority on a visitor's behalf | the vague-authority floor is EXECUTABLE now and stands at zero; the register hedges by distance and by a named roll, never by an impression |
| **F1-126** | naming the road he takes, the inn he left, the house at the edge, anybody he meets | no `{npc}` slot and no name authority on this pool; the same bytes print in every matching town |
| **A5 / R-DA-01** | addressing the reader as the stranger ("you walk out"), or assigning him a reaction | no "you" in this register; the compiler shows only through what the record holds |

The closed rosters and the not-a-faith-pool line at §1.4 bind here unchanged.

### 3.5 ⭐ THE PREIMAGE

As §1.5. The corner this variant must survive: **the town-tier town with a required watch** (the sentence's own noun), **the ruined city** (a stranger walking out of a place with a metropolis's population and a collapsed wall line), and **the town under an active `monster_pressure` or `under_siege` banner** (where walking out in any direction at any hour is the one thing the dossier's other panels say he must not do). A face that is true in a heartland hamlet and false in those three has not cleared the preimage.

### 3.6 The angle's stance in one sentence

`[visitor]` is the outside eye on a standing arrangement: what a person arriving or leaving actually encounters, reported as fact and not as impression, landing on the civic thing that is or is not there — so here it may put the reader at a town edge that has nothing in it, and must not name what the country would or would not warrant, nor hedge, nor total the country, nor be addressed.

### 3.7 The turns worth keeping

- *A stranger walks OUT of* — the direction is the asset. Coming in is the sibling row's move; going out is this one's, and it is where the three absences are.
- The two-part shape (a person does a plain thing; the plain thing meets a standing condition) is the visitor angle's own grammar and reusable across four faces with different nouns.
- Nothing else. The clause *meets nothing that would justify a watch* is named in the block's contradiction set as a clause that must not be carried forward, on both of its halves.

### 3.8 What would make the rewrite of vid 3 a regression

Vid 3 not third, or not `[visitor]`, or its slot set not `{settlement}` alone, or fewer than four faces. Any face that keeps the word `watch`, or any face that keeps a totality of safety in a new vocabulary ("meets nothing", "sees no reason", "is troubled by nothing"). Any face that hedges on the stranger's behalf, addresses the reader, or names a road, a house or a person. Any face that has the stranger PASS a perimeter thing on the way out. A face that opens on the `{settlement}` proper slot (T-F8).

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **He is not admitted anywhere; he simply stops being in the town.** With the whole walls keyword set denied and the gatehouse row denied with it, **there is no moment of leaving** — no leaf, no bar, no arch, no one to pass, nothing that marks the difference between inside and out except the last building. A visitor face can put the reader at a boundary that is not a boundary, which is a concrete, particular, entirely licensed thing and which no shipped row in this pool has used.
- **Nobody counts him, either way.** The three empty buckets are the three that would put a person at the edge with a reason to ask his business. So arriving costs him nothing, leaving is unremarked, and whatever record this town keeps of strangers is kept by whoever happened to be looking. The absence of an accounting is as concrete as an accounting and the record holds it as three measured negatives.
- **What he would actually notice is what the town spent on instead.** On this key the town's only possible answers to the country are a lodge, a hall, a shop or a tower (`defenseGenerator.js:200-211`) — a drinking hall of retired soldiers with no muster to join, a warden's waypost that tracks beast migrations for a town with nothing standing against them, a contracting office for soldiers who are between campaigns and not hired here. A stranger walking out past one of those, on a road with nothing at its end to stop him, is the pool's best unused picture.
- **The country itself is a visible thing and the road is the holder of that fact.** The tier is the ROAD's record (`holderTable.js:234`, "the look of the country, which anyone travelling it can see"), so the one thing this angle may honestly say about what is out there is what the country LOOKS like at the low rung of a ladder of three — worked ground, a treeline that nobody has cleared back, tracks that go somewhere. Never what it holds, never what it sends, never nothing.

---

## 4. WHAT THE POOL OWES ACROSS ITS THREE VARIANTS

- **Twelve faces, four per variant**, each a different vocabulary or rhythm inside the voice and never a paraphrase of its sibling. The counts only rise (Part B §22); a face that fails the gate stays in the annex as a refusal row with its measurement.
- **Slot sets per parent, not per pool:** `{settlement}` · none · `{settlement}`. See the wall at the head of this file.
- **Distinct level-1 grammars.** A pool of three carries three distinct members of MOVE-GRAMMAR §2.1's V1–V8, filtered to what this block licenses. V2 (`PRESENT → CONSEQUENCE(structural)`), V3 (`PRESENT → LACK`) and V1 (`PRESENT` alone) are all drawable here; V7 is not (no event provenance) and V8 is not (no typed `not-held` field). ⚠ **V3's LACK may not open a sentence and may not sit beside another ABSENCE** (order wall 3), which is a real constraint in a pool whose whole subject is an absence: at most one variant may lead with the lack, and the other two must open on the country, on the road, on an act or on a thing that is there.
- **A11's spread:** no two variants of this pool share their first two words, and the shipped three already differ (`{settlement}` · `The town` · `A stranger`). Four faces per variant multiplies that, so the spread is measured over all twelve.
- **The settlement token opens at most one variant per pool** (R-DA-17; T-F8 refuses a sentence face opening on a `proper`-typed slot outright), so no face of vid 1 or vid 3 may begin on the town's name.
- **The pool's one discriminating claim is the COUNTRY.** The `Invasion & War` row printed directly beneath is FIXED to `neither walls nor force` whenever this pool fires (`defenseStateProse.js:654-655`), and it already carries the bare absence. Every one of the twelve faces must hold the quiet band, or the reader meets the same fact twice in two panels.
- **Leave one matter standing open.** The register's own constraint (fault 7's licence, the OPEN QUESTION move as a declarative) is easy to honour here and hard to honour anywhere else in the block: the record holds a town with nothing arranged against a country it has measured, and says nothing whatever about why. A face that declines to supply the reason — as vid 1's *whatever ... is for* sibling does one pool over — is doing the register's own work.

---

**Marked by:** MARKER (opus), 2026-09-12, against the dock `laneRW-DEF2` at `f20532e18`. Nothing in this file is a face; every line above is material, a refusal, or a boundary.
