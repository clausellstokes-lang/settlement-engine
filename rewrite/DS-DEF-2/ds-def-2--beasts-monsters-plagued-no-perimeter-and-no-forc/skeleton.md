# SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force`

Seat: MARKER (opus), for the Fable chair. Test applied throughout: **ADDENDUM 14 (owner, 2026-09-12)** — a face is LAWFUL unless it CONTRADICTS the record; silence in the record is permission; "the card does not license it" is not a finding. The tag `unlicensed` is not used anywhere in this file.

**Variant count: 3** (1 `[ledger]` · 2 `[street]` · 3 `[visitor]`).

---

## THE CARD, AS PRINTED

```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: plagued, NO perimeter and NO force`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
  predicate:  beastsRowSituation(family, perimeter, force) === 'plagued country, neither'
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0
  covert:     no
  source:     muster · standing LICENSED (a citation is licensed where the provenance budget allows)
  may NOT:    a magnitude outside the read's own band word (floor 2a); an elapsed course, a dated
              cause or a season (floor 2b); a prediction the pulse adjudicates (floor 2b);
              another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
              and that character's fate; a theological claim about a deity
```

**Annex header lines for the block** (`RECEIPT_POOLS_DOSSIER_STATE.md` `### DS-DEF-2`):
- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge (`STRONG`/`ADEQUATE`/`WEAK`/`CRITICAL`), read against `config.monsterThreat` (`plagued`/`frontier`/`settled`), the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — **only `{settlement}` is filled at this block's call sites.** A face written on `{band}` or `{route}` renders a raw marker. Write on `{settlement}` alone.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE:** institution presence is a **STANDING** fact with no recorded history; the causal clauses here are *capability* clauses (walls without people cannot be held) and **never** *historical* ones (walls built after a siege) unless the history surface supplies the ancestry. Two standing defects must not be reintroduced: the lowercase sentence lead on this very branch, and a presence check on `institutions.walls` instead of the predicate.
- **Composition fences:** spine, sentence form, one mount on the defense tab, no modifier mounts, no relation, no attach set. The composer orders modifiers by salience with the spine first — but this pool has **zero modifier mounts today**, so a face here is read first and may be read alone. It must still stand if a modifier lands beside it later.

---

## POOL-LEVEL SECTIONS (4), (6) and (9)

These three are properties of the pool KEY, not of any one variant, so they are written once here. Sections (1), (2), (3), (5) and (7), (8) follow per variant.

### (4) THE READS THIS POOL REACHES — material, not a bound

The card names exactly one read, and it resolves to three settlement facts:

| the read | what it resolves to | anchor |
|---|---|---|
| `beastsRowSituation(family, perimeter, force)` | the situation string `'plagued country, neither'` | `src/domain/display/stateProse/defenseStateProse.js:429-441` |
| `family` | `measuredMonsterFamily(config.monsterThreat) === 'plagued'` via `MONSTER_FAMILY_OF` | `defenseStateProse.js:279-284`, `:331-335` |
| `perimeter` | `standingDefenseForces(settlement).walls.present === false` | `defenseStateProse.js:624`, call site `:655` |
| `force` | `(garrison.present \|\| militia.present) === false` | `defenseStateProse.js:625-626`, call site `:655` |
| the pool key | `BEASTS_ROW_POOL['plagued country, neither']` | `defenseStateProse.js:400-421` |

Three further facts the reads carry with them, which a writer may use because they are the read's own substance:

- **The roster is LIVE, not the generation snapshot.** `standingDefenseForces` re-derives from `liveInstitutions(settlement)` — the ruin-filtered roster (`src/domain/institutions/defenseInstitutionBuckets.js:169-186`; `institutionRoster.js:53-56`). `defenseProfile.institutions` is a generation-time snapshot the ruin stamp can never reach (the header at `defenseInstitutionBuckets.js:28-46`). **So this pool fires on a town whose walls were thrown down as readily as on a town that never built any.** The record distinguishes them nowhere in this read; a face may therefore describe an absent perimeter but may NOT assert the town never had one, and may not assert it lost one either.
- **The perimeter class is a closed keyword list.** `walls` = `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`defenseInstitutionBuckets.js:84-88`). The card's "may NOT: another civic object of the class `wall`" is exactly this list. A ditch, a bank, a rampart or a stockade written into a face asserts a member of a bucket the read says is empty.
- **`plagued` is per settlement, not per world.** `resolveConfig.js:148-156` rolls `random_threat` per settlement from a weighted pool of six (`monsterThreat.js:37-39`, one `plagued` in six), then normalises. A plagued town can stand next to a heartland town. "The country around **this town**" is the licensed reading; "the world" is not.

### (6) THE PREIMAGE — the range of towns this key selects

The key is three booleans over one config token, and it reads **nothing else**. It therefore fires across:

- **every tier**, hamlet through city — no tier gate exists on this branch;
- **every culture, terrain, era, route state and stress state** — none is read;
- **every economic and score state** — `defenseProfile.scores.monster` is in the block's STATE-KEY but is NOT in this row's predicate;
- **towns that never fortified and towns whose fortifications were ruined** (the live-roster read above);
- **towns holding a town watch, a mercenary company, an adventurers' charter hall, a mages' guild or an alchemist** — four standing defence buckets this key never consults (see §5).

A face must contradict no state in that range. The single strongest consequence: **this pool is not the "defenceless town" pool.** It is the "no wall and no garrison or militia" pool, and the two are different towns.

One asymmetry worth holding: `institutionProbability.js:196-207` multiplies the charter hall's chance by **5** in a plagued country and any adventurer/hireling institution by a further **1.5**, while `resolveConfig.js:181-183` raises a plagued town's `priorityMilitary` to a floor of 25. So the silent bucket most likely to be occupied in this pool's preimage is precisely the **charter hall** — the one the shipped `[ledger]` face denies by name.

### (9) ⭐ WHERE THE FLAVOUR IS

The record is silent about far more than it denies, and the three shipped rows spend that silence on abstractions ("survival", "the pressure", "the danger", "the arrangements"). What the states actually make available, and what the shipped rows never touched:

- **The town has no edge.** A perimeter is the thing that makes arriving an event: a place where you are stopped, counted, let in, shut out. This town has no such place, so a stranger is simply *in it* at some point without having crossed anything — and nobody can name the moment. That is a concrete, particular, wholly licensed fact about the ground, and no shipped row uses it. Its inverse is equally available: the town has no *outside* either, so there is no stretch of ground that belongs to the defence, nothing kept clear, nothing that must be walked.
- **What gets built instead of a wall is the household.** The record denies the wall class and the two force buckets and denies nothing else: shutters, bars, a stout door, where the animals are put at night, what is carried on a walk to the next field, which outbuildings stand empty because nobody will sleep in them, a ladder pulled up. The town's defence, if the reader is to see one, is a thousand private ones the record does not enumerate and does not deny.
- **What a stranger would notice is the absence of a routine, not the presence of fear.** No rotation to be on, no gate hour, no horn, no muster day, no one to report to, no list your name goes on. A visitor from a walled town would be looking for the office and not find it. The shipped `[visitor]` row gestures at this ("nothing about the place is arranged") and then spends the sentence on the abstraction instead of on the thing.
- **What someone would complain about** is also untouched and unforbidden: that it is other people's animals in the road at night, that nobody agrees whose job anything is, that the argument recurs and is never settled — the record holds no council resolution on defence here and denies none of it. `[street]` had the whole of this available and wrote a mood instead.
- **The one thing that is NOT free:** the charter hall, the mercenary company, the town watch and the mages' guild. Those four are in the roster, they have their own voices on the same tab, and a face that sweeps them away with "nothing" is the pool's live defect (§5). Any face that wants to say "there is nothing here" must say it about **the wall and the two forces the key actually reads**, and let the rest stand.

---

## (5) ⭐ WHAT WOULD BE FALSE HERE — the contradiction table for this desk

### 5a. THE CLOSED ROSTER this pool touches, and the four buckets the key does not read

`DEFENSE_BUCKET_KEYWORDS` (`src/domain/institutions/defenseInstitutionBuckets.js:84-108`) is the closed roster of standing defence. **A body the roster does not carry may not be asserted; a body it DOES carry may not be denied.** Seven buckets:

| bucket | keywords (closed) | read by THIS key? | its own voice on the same tab |
|---|---|---|---|
| `walls` | wall · citadel · palisade · earthwork · inner citadel · massive walls | **YES** — `perimeter`, asserted ABSENT | DS-DEF-5 lens 1 `fortificationPoolKey` → `walls ABSENT` (`defenseStateProse.js:1251-1253`) |
| `garrison` | garrison · barracks · professional guard · professional city watch · multiple garrison | **YES** — half of `force`, ABSENT | DS-DEF-5 lens 2 `forceCorePoolKey` (`:1269-1275`) |
| `militia` | citizen militia · militia | **YES** — half of `force`, ABSENT | DS-DEF-5 lens 2 |
| `watch` | town watch · city watch · professional city watch | **NO** | DS-DEF-5 lens 2 → `watch PRESENT` (`:1270-1271`) |
| `mercenary` | mercenary company · mercenary quarter · hired muscle | **NO** | DS-DEF-5 lens 3 `contractedForcePoolKey` → `mercenary / contracted forces PRESENT` (`:1283-1285`) |
| `charter` | adventurers' charter hall · adventurers' guild hall · multiple adventurers' | **NO** | DS-DEF-5 lens 4 `charterPoolKey` → `charter hall PRESENT (specialist monster response)` (`:1294-1298`) |
| `magicDef` | wizard · mages' guild · mage · academy of magic · golem workforce · alchemist | **NO** | DS-DEF-5 lens 5 `arcaneDefensePoolKey` (`:1319`) |

The four "NO" rows are the whole of this pool's contradiction surface, and all four render **on the same tab, in the same reading**. Not a faraway surface — the paragraph next door.

### 5b. THE ROWS THIS POOL'S KEY CAN ACTUALLY WALK INTO

| # | the row | the FIELD that denies it | which is the record |
|---|---|---|---|
| **C-1** | **"no specialist recourse" / "no specialists" / "nobody to call"** | `standingDefenseForces(settlement).charter.present === true` (`defenseInstitutionBuckets.js:169-186`, keywords `:103-107`) | **the roster is the record.** The pool key never asks about the charter hall (`defenseStateProse.js:429-441` reads only family, perimeter, force), so a charter-holding plagued town lands in this pool and reads "charter hall PRESENT (specialist monster response)" four paragraphs down. Sharpened by `institutionProbability.js:197-199`: ×5 chance in a plagued country. **This row is walked by shipped variant 1 today.** |
| **C-2** | **"nothing organized" / "no organized defence" / "the town does not defend itself"** | `forces.mercenary.present` · `forces.charter.present` · `forces.watch.present` · `forces.magicDef.present` — any one `true` | **the roster is the record**, and the estate has already ruled this exact wording false: DS-DEF-5 lens 2's own docblock (`defenseStateProse.js:1260-1265`) says `NO organized force at all` "is false of a town that retains a mercenary company or a charter hall — those are commands, merely bought ones", and that lens therefore **refuses to fire** when any of them stands. This pool fires anyway. **Walked by variants 1 and 2 today.** |
| **C-3** | **"no force" unqualified** | `forces.watch.present` · `forces.mercenary.present` | **the roster.** `force` in this key is `garrison \|\| militia` only (`:655`). The English word reaches two further buckets. |
| **C-4** | **"nothing is arranged to meet danger" / "no arrangement" / "no provision"** | any of the four silent buckets; a charter hall IS an arrangement for meeting exactly this danger | **the roster.** **Walked by variant 3 today.** |
| **C-5** | **any assertion of a barrier, ditch, bank, rampart, stockade, gate or earthwork** | `forces.walls.present === false` over the closed keyword list (`defenseInstitutionBuckets.js:84-88`) | **the read.** `earthwork` and `palisade` are IN the walls bucket, so a face that supplies one as a substitute for the wall asserts the bucket the key says is empty. The card states this as "another civic object of the class `wall`". Not walked today. |
| **C-6** | **"survival rests on terrain" / "the ground protects it"** | `TERRAIN_DEFENCE_OF[resourceAnalysis.terrain] === 'terrain EXPOSED'` for `Plains` and `Desert/Arid` (`defenseStateProse.js:693-701`, reader `:779`) | **the terrain map is the record** where it speaks. It is deliberately SILENT on Coastal and Riverside (the note at `:686-692`), so on those towns the claim is not contradicted but is a FLOOR-2 dependence on a field this pool does not read. On Plains it is flatly denied. **Walked by variant 1 today.** |
| **C-7** | **a town that "never" built / "has never" needed / lost its walls** | the live-roster read (`defenseInstitutionBuckets.js:28-46`): a ruined citadel filters out and reads as no perimeter | **the read.** The record cannot tell a town that never built from a town whose walls were thrown down, so a face asserting either walks C-7. Also floor-2b (an elapsed course). Not walked today. |
| **C-8** | **a totality over persons** ("everyone", "nobody", "all of them", "anybody") | the card's REFUSED COLUMNS, always | **the card.** No column in this read is `closed` over persons; CLERK-LAWS §1.3 licenses a quantifier only where `closed` is true. **Walked by variants 2 and 3 today.** |
| **C-9** | **a score, band or magnitude word** ("extreme danger", "critical", "the worst", "constant") | the block's `{band}` slot is RESERVED and **unfilled at this call site**; `defenseProfile.scores.monster` is not in this row's predicate | **the card** (floor 2a: a magnitude outside the read's own band word — and this read carries no band word at all). The shipped ENGINE string on this branch says "This settlement is in extreme danger" (`threatAssessment.js:71`); that is the defect the corpus is replacing, not a precedent. |
| **C-10** | **a season, a date, a cause, an elapsed course, or a prediction** ("each season", "since the raids", "will be overrun") | floor 2b on the card; the block's PROVENANCE fence — institution presence is a STANDING fact with no recorded history; capability clauses only, never historical ones | **the card and the annex fence.** Note: the pool's sibling `plagued, perimeter but NO force` variant 3 already breaches this ("doing less each season as the watch thins"); it is not this pool's to fix, but it is not a model either. |

### 5c. SIBLING COHERENCE — the same block, the same reading

DS-DEF-2 renders five rows at once. In this pool's state the other four are fixed:

- `invasion` → `invasionRowPoolKey(false, false, false)` = **`Invasion & War: neither walls nor force`**. Its shipped variant 2 reads "Nothing has come for {settlement} and nothing about the town would stop it." A face of MY pool must not restate the no-wall/no-force fact in the same terms the invasion row will use two lines later — the fact is licensed twice but the WORDS are read as one passage (THE THREAD). The invasion row owns the army; **this row owns the country and the creatures.** Keep the pools apart by their subject, not by synonym.
- `internal` / `economic` / `disaster` → keyed on `compound.inst` and `scores.economic`; independent, but they are the reading's neighbours and a face that opens on the town's name competes with them for the settlement-opener budget (R-DA-17: at most one settlement-opener variant per pool, never two adjacent).

**Not a faith pool** — the deity axes, `deityTemper()`, the pantheon rank, the settlement standing and the suppressed flag do not apply to this desk and are not in the card.

---

# VARIANT 1

### (1) Number and angle tag
**1** · `[ledger]`

### (2) The shipped sentence, verbatim
> An embattled country and nothing organized standing in it: {settlement} has no line, no force and no specialist recourse, and survival here rests on terrain, distance and the ability to leave.

### (3) EVERY claim it makes, one per line

| # | the claim | tag |
|---|---|---|
| 1.a | The country around the settlement is pressed by creatures. | **SAFE** — this is the read itself (`family === 'plagued'`, `defenseStateProse.js:429`). |
| 1.b | The country is "embattled". | **SAFE** as prose. ⚠ WATCH, not a finding: `embattled` is a dead producer token — `src/data/monsterThreat.js:24` records that no producer has ever emitted it and the vocabularyTotality walker forbids it as a display ARM. A walker binding is a key read, not a word ban, so prose use contradicts nothing; but a refuter may reach for it, and a face that avoids the word costs nothing. |
| 1.c | Nothing organized stands in that country. | **CONTRADICTED** — `standingDefenseForces(settlement).{watch,mercenary,charter,magicDef}.present` (`defenseInstitutionBuckets.js:169-186`; keywords `:89-108`). **The roster is the record.** Row C-2. The estate's own DS-DEF-5 lens 2 refuses to make this claim in exactly this state (`defenseStateProse.js:1260-1265`). |
| 1.d | The settlement has no line (no perimeter). | **SAFE** — `perimeter === false` is the read (`:624`, `:655`). |
| 1.e | The settlement has no force. | **CONTRADICTED on the unqualified reading** — `force` in the key is `garrison \|\| militia` ONLY (`:655`); `forces.watch.present` and `forces.mercenary.present` are untouched by it. Row C-3. **The roster is the record.** Qualified ("no garrison and no militia", "nobody under arms who belongs to the town") it is SAFE. |
| 1.f | The settlement has no specialist recourse. | **CONTRADICTED** — `forces.charter.present` (`charterPoolKey`, `defenseStateProse.js:1294-1298`, whose own pool is named "specialist monster response"). Row C-1, and the pool's **likeliest** live breach: `institutionProbability.js:197-199` gives the charter hall a ×5 chance in a plagued country. **The roster is the record.** |
| 1.g | Survival here rests on terrain. | **CONTRADICTED** on `Plains` and `Desert/Arid` — `TERRAIN_DEFENCE_OF` reads `terrain EXPOSED` (`defenseStateProse.js:693-701`, reader `:779`); **the terrain map is the record** where it speaks. On Coastal/Riverside the map is deliberately silent, and there the same clause is **FLOOR-2** (a dependence on a field this pool does not read). Row C-6. |
| 1.h | Survival here rests on distance. | **FLOOR-2** — a dependence on an unobserved field. This pool reads no neighbour, route or distance fact; `{route}` is in the bag and is UNFILLED at this call site. |
| 1.i | Survival here rests on the ability to leave. | **SAFE** — nothing in the record denies it; a standing capacity with no magnitude and no course. |
| 1.j | The clause "An embattled country and nothing organized standing in it:" is a fronted contrast-shaped opener followed by a colon, then a three-item list, then a second three-item list. | **SAFE** as claim; a FORM note for the writer: two tricolons in one sentence is the machine signature R-DA-10 caps at 0.020 and the register card's "never reach for three of anything by habit". |

### (5) Which contradiction rows THIS variant walks into
**C-1** (by name: "no specialist recourse") · **C-2** ("nothing organized") · **C-3** ("no force") · **C-6** ("rests on terrain"). Four of the ten. This is the most contradicted of the three shipped rows.

### (7) THE ANGLE'S STANCE, in one sentence
A **ledger** may set down what the record holds about the country and about the roster, in the clerk's flat third person, landing on the civic thing the read names — the wall that is not there, the roll that has nobody on it — and it may carry one computed consequence of that fact as a clause (S2); it may not rate the town, total over its people, or reach for a cause.

### (8) THE TURNS WORTH KEEPING
- **"has no line"** — `line` is the sharpest available word for the absent perimeter because it names the *function* (a place to stand) rather than the *fabric*, and so it does not assert a member of the closed `wall` keyword list. Worth carrying verbatim.
- **"the ability to leave"** — plain, licensed, and the only concrete thing in the sentence. Worth carrying.
- Everything between the colon and "and survival" is the breach; nothing there is worth carrying as written.

---

# VARIANT 2

### (1) Number and angle tag
**2** · `[street]`

### (2) The shipped sentence, verbatim
> The town does not defend itself. What it does is watch, and move, and hope the pressure goes around it, and that is understood by everyone in it.

### (3) EVERY claim it makes, one per line

| # | the claim | tag |
|---|---|---|
| 2.a | The town does not defend itself. | **CONTRADICTED** — `forces.{watch,mercenary,charter,magicDef}.present`. Row C-2. **The roster is the record**, and DS-DEF-5 lens 2's docblock (`defenseStateProse.js:1260-1265`) names this exact sentence-shape as false of a town retaining a mercenary company or a charter hall: "those are commands, merely bought ones." The lens refuses to fire; this pool does not. |
| 2.b | What the town does is watch. | **SAFE** — an unorganised watching is not the `watch` bucket, and nothing denies it. ⚠ NAMING HAZARD, not a finding: `watch` is a live roster bucket (`town watch · city watch · professional city watch`, `defenseInstitutionBuckets.js:97-99`) with its own pool key `watch PRESENT`. A face using the noun "the watch" here asserts the institution; the verb does not. Keep it a verb or drop the word. |
| 2.c | What the town does is move. | **SAFE**. |
| 2.d | The town hopes the pressure goes around it. | **FLOOR-2** — a dependence on an unobserved field: no field in this read (or in the block) carries motive, belief or mood. MOVE-GRAMMAR §1.3 lists FEELING among the moves that do not exist anywhere in the estate. |
| 2.e | That is understood by **everyone** in the town. | **FLOOR-2**, and a REFUSED COLUMN on the card — a totality over persons. No column of this read is `closed` over persons (CLERK-LAWS §1.3 licenses a quantifier only on a `closed` column). Row C-8. |
| 2.f | The town's non-defence is a settled, understood arrangement rather than a crisis. | **SAFE** — institution presence is a STANDING fact (the annex fence), so a standing arrangement is the right tense; nothing denies that it is ordinary. This is the variant's one genuinely good instinct. |

### (5) Which contradiction rows THIS variant walks into
**C-2** (the opening sentence, flatly) · **C-8** ("everyone"). Plus one FLOOR-2 on a mood.

### (7) THE ANGLE'S STANCE, in one sentence
A **street** angle may report what the town's ordinary working day looks like under this arrangement — what is done, what is not done, what is nobody's job — as a standing habit in the present, without entering a head, without totalling the townspeople, and without rating the arrangement.

### (8) THE TURNS WORTH KEEPING
- **"and that is understood"** — the *shape* is right (the arrangement is settled, not an emergency) and only the totality "by everyone in it" breaks it. A face may keep the settled-ness and drop the count.
- **"The town does not defend itself"** — worth keeping ONLY if re-cut to the two buckets the key actually reads; as written it is the pool's second-worst breach.
- "watch, and move, and hope" — the tricolon and the mood both go; the *movement* is the licensed half and is worth rebuilding on.

---

# VARIANT 3

### (1) Number and angle tag
**3** · `[visitor]`

### (2) The shipped sentence, verbatim
> A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met.

### (3) EVERY claim it makes, one per line

| # | the claim | tag |
|---|---|---|
| 3.a | A stranger arrives at the settlement. | **SAFE** — the visitor angle's standing device; nothing denies that strangers arrive. |
| 3.b | There is danger at the settlement. | **SAFE** — `family === 'plagued'` is the read. |
| 3.c | The stranger understands the danger. | **FLOOR-2** — a dependence on an unobserved field; no field carries a person's understanding. R-DA-14 / NL-5's "seen, not meant": the deed, never the interior. What a stranger *sees* is licensed; what a stranger *understands* is not. |
| 3.d | Nobody explains the danger to the stranger first. | **FLOOR-2**, and a negative totality over persons (row C-8, softer form — "anybody"). |
| 3.e | **Nothing** about the place is arranged as though danger were expected to be met. | **CONTRADICTED** — `forces.charter.present` (an adventurers' charter hall is precisely an arrangement for meeting this danger), `forces.mercenary.present`, `forces.watch.present`, `forces.magicDef.present`. Row C-4. **The roster is the record.** The totality "nothing about the place" also reaches every non-defence institution the roster carries. |
| 3.f | The absence of arrangement is the CAUSE of the stranger's understanding ("because"). | **SAFE as a joint** under amendment S2 only if the consequence is the engine's own; here the consequent (3.c) is itself FLOOR-2, so the joint carries a claim the record does not hold. Treat as inheriting 3.c's tag. |

### (5) Which contradiction rows THIS variant walks into
**C-4** ("nothing is arranged") · **C-8** (the negative totality "anybody"). Two FLOOR-2 rows on the stranger's interior.

### (7) THE ANGLE'S STANCE, in one sentence
A **visitor** angle may report what a stranger *meets* — what is there to be walked past, asked, looked for and not found — as things seen on the ground, never as what the stranger concludes, feels or is told.

### (8) THE TURNS WORTH KEEPING
- **"arranged as though danger were expected to be met"** — the *subjunctive* is exactly right (R-DA-07: the edge is subjunctive, never a fate) and the phrase names a capability rather than a history, which is the annex fence's own requirement. Worth carrying, re-scoped from "nothing about the place" to the wall and the two forces.
- **"A stranger arriving at {settlement}"** — a clean opener that is not the settlement token in first position (R-DA-17's budget). Worth carrying.
- "understands the danger before anybody explains it" — the whole clause goes; it is an interior plus a totality.

---

## THE MARKER'S CLOSING NOTE FOR THE WRITER

Three things decide every face of this pool.

1. **The pool's one live defect is a SWEEP.** All three shipped rows say some form of "there is nothing here", and the key reads only three of the seven standing-defence buckets. Every face must scope its absence to **the perimeter and the town's own force** and leave the charter hall, the mercenary company, the watch and the mages' guild standing — because they have their own paragraphs on the same tab, four rows down.
2. **The absence is the subject, and the record is silent about the ground it leaves.** The wall class is denied, the garrison and militia are denied, and *nothing else is*. §9 is where the faces should be built: the town with no edge, the arriving that is not an event, the private door that does the work the wall does not, the office a visitor looks for and cannot find.
3. **Four faces per variant, each a different vocabulary or rhythm, never a paraphrase of a sibling; no em dash, no exclamation mark, no digit or percent in a connective, no which-clause; `{settlement}` is the only filled slot; the settlement token opens at most one variant of the pool and never two adjacent.** Each face must read well immediately after the spine and after any sibling modifier, because the composer chooses its place and this pool has no modifier mounts today.
