# DRAFT ROUND 1 — DS-DEF-2 · pool `Invasion & War: force with NO walls`

Writer: **Opus 5** (Fable-unvalidated seat), for the Fable chair. REWRITE car 8b, block DS-DEF-2. 2026-09-12.
Written under **ADDENDUM 14** (a face is lawful unless it CONTRADICTS the record; silence is permission) and the four floors of `rewrite/recut/CONTRADICTION-TABLE.md`. Dock read only.

Three shipped variants in, three out, in order, each keeping its vid and its angle tag. Four wordings per variant (the numbered line plus three `[face]` sub-rows) = **twelve renderings**. Nothing trimmed.

---

## THE ROWS — ready to paste under the pool's heading

**`Invasion & War`: force with NO walls**
1. `[ledger]` Against invasion {settlement} enters a paid force and no works. The force turns back a raid and cannot hold a siege, and the town's defense is paid out in wages rather than in stone.
   - `[face]` The town's defense account at {settlement} carries a garrison and no work standing round the place. A garrison is good against a raid and not a thing that holds a siege.
   - `[face]` No work at {settlement} stands to be held, so a siege is past the town's power. What answers a raid instead is a force on the town's wage.
   - `[face]` A raid the force at {settlement} can meet, and a siege it cannot. The same purse answers for works and for wages, and with no works standing it answers for the men.
2. `[street]` What holds {settlement} is men, with nothing built around the town. Stone would have to be broken; men would only have to be missed.
   - `[face]` At {settlement} the defense is men and no works. The complaint in the town is that men have to be somewhere, and a wall does not.
   - `[face]` Asked what {settlement} would do about an army, the town names men and no works. Asked what an army would do, it names the roads that go round the men.
   - `[face]` Men rather than works defend {settlement}, and men can be walked around. The town says so and says no more.
3. `[visitor]` A stranger meets no edge coming into {settlement}, only country giving way to houses with armed men somewhere among them. A fight here would be decided among the houses.
   - `[face]` The garrison at {settlement} is quartered among houses, and a stranger goes by it without knowing. No work stands round the town to keep a fight off those streets.
   - `[face]` What a stranger cannot find at {settlement} is a wall, a palisade or an earthwork for the men to be set behind. A fight would go where the men went, and men can go the wrong way.
   - `[face]` Roads bring a stranger into {settlement} and stop at doors, with no wall or earthwork between. The men under arms are behind those doors, and a fight here would find them at home.

---

## --- NOTES

### 0. Counts, and the mechanical ratchets

- **Variants: 3** (vids 1, 2, 3; tags `[ledger]`, `[street]`, `[visitor]` unchanged, in order). **Wordings: 12** (3 lead lines + 9 `[face]` sub-rows). No variant added, removed, merged or reordered; no `[plain]` marker anywhere; one bracketed tag per spine row.
- **Word counts.** v1: 34 · 31 · 28 · 32. v2: 24 · 26 · 30 · 20. v3: 29 · 29 · 37 · 33. (Shipped baseline: 28 · 14 · 26.)
- **Hard walls, checked face by face:** no em dash, no exclamation mark, no question mark, no digit or percent, no `which`-clause, no expletive opener (`there is` / `there are`), at most two sentences per face, no face opening on `{settlement}` (T-F8) and none opening on a comma or a clause-list word. Every face's slot set is exactly `{settlement}`, the parent's (the bag's `{band}` is RESERVED and `{route}` unfilled at this block's call sites).
- **Openers, all twelve distinct in their first two words** (A11 / A5 sibling distance): *Against invasion · The town's · No work · A raid · What holds · At {settlement} · Asked what · Men rather · A stranger · The garrison · What a · Roads bring*.
- **Landing nouns, deliberately spread:** stone · siege · wage · men · missed · not · men · more · houses · streets · way · home.

### 1. Refusals

**None.** All three variants are written lawfully under the four floors; no variant needed a refusal row. Two *turns* named in the skeleton were dropped rather than kept, and the grounds are in §5 below.

### 2. What licenses each claim, face by face

The card's `may claim` is the whole of the read: the key `invasionRowSituation(walls, garrison, militia) === 'no walls, professional garrison'` (`defenseStateProse.js:476-484`), i.e. **(a)** the `walls` bucket is empty on the live roster (`defenseInstitutionBuckets.js:84-87`, `:169-182`) and **(b)** the `garrison` bucket is filled (`:88-91`). Under ADDENDUM 14 the card bounds nothing; every further particular below is either the engine's own positive model or silence, and each is named.

**VARIANT 1 · `[ledger]` — claim set carried by all four faces:** (i) a paid/professional force stands; (ii) no works stand round the town; (iii) it answers a raid; (iv) it cannot hold a siege.

| face | claim | licence |
|---|---|---|
| 1 (lead) | "a paid force" | read (b); `Garrison` "Professional soldiers" (`institutionalCatalog.js:1925-1930`), `Barracks` "housing for guards or small garrison" (`:1363-1369`) |
| | "and no works" | read (a) — the bucket's own nouns. NOT "nothing built": the barracks IS built, and `hasGates` is a separate flag this key never reads (F1-08), so no face denies a gate |
| | "turns back a raid / cannot hold a siege" | the block's own FENCE (capability clauses, never historical); the engine's string at `threatAssessment.js:121` |
| | "paid out in wages rather than in stone" | `milUpkeepMult` gates garrison wages AND wall maintenance through ONE multiplier (`defenseGenerator.js:182`, `:189-192`). Stated as ONE purse with nothing to spend on works — never as two purses split (F4-02/F4-03) |
| 2 | "the town's defense account" | W24 (the record-word bar) is struck; accounts, returns, ledgers are available nouns. It is a MENTION, not a citation to a keeper (F1-24 / §R-8 untouched) |
| | "a garrison" | read (b); the bucket's own name, and the `Barracks` row's own description says "small garrison". The word does not import the city rung (no "noble", "royal", "full-time", "soldiers of the crown") |
| | "no work standing round the place" | read (a); a perimeter claim only |
| 3 | "No work … stands to be held" | read (a) |
| | "a siege is past the town's power" | the fence's capability clause; the engine's "cannot hold against a siege". Not sharpened into "no siege can reach here" (F1-79: walls are a probability modifier on the siege roll, not a precondition — `stressGenerator.js:107`, `:123`) |
| | "a force on the town's wage" | read (b) + the upkeep model |
| 4 | "The same purse answers for works and for wages" | `defenseGenerator.js:182`, `:189-192` verbatim in substance: one multiplier, both lines |
| | "with no works standing it answers for the men" | read (a) + the same model. No total collapse of pay is asserted (F4-04: every gate has a floor; the licensed extreme is short, late or thin, never none) |

**VARIANT 2 · `[street]` — claim set carried by all four faces:** (i) the defense is men, not works; (ii) no works stand; (iii) men can be gone around.

| face | claim | licence |
|---|---|---|
| 1 (lead) | "What holds {settlement} is men" | read (b); the shipped row's own SAFE claim 1 |
| | "nothing built around the town" | read (a). "Around the town" is the perimeter, so a gate (a point) and the barracks (a building) are untouched |
| | "Stone would have to be broken; men would only have to be missed" | the contrast names a SIBLING pool key of this same table (`walls, professional garrison` · `walls with citizen militia` · `walls with NO force`), which is the licence R-DA-02 asks for. Subjunctive throughout; asserts no event and no rate |
| 2 | "the defense is men and no works" | reads (a) + (b) |
| | "The complaint in the town is that men have to be somewhere, and a wall does not" | the complaint move; the claim is a standing capability of a force without a perimeter. It is NOT sharpened into "nothing here argues about the ground" (F4-07: the engine multiplies the military score for terrain on five of seven — mountain 1.28, hills 1.18, forest 1.12, riverside 1.06, coastal 1.02, `defenseGenerator.js:129-135`) |
| 3 | "the town names men and no works" | reads (a) + (b), in the town's own voice |
| | "the roads that go round the men" | the same capability, landed on a civic object. Declarative, no interrogative (the OPEN QUESTION move's form), no event asserted |
| 4 | "Men rather than works defend {settlement}, and men can be walked around" | the shipped turn kept, the construction changed; both halves are the shipped row's SAFE claims 1, 2 and 3 |
| | "The town says so and says no more" | the withholding close. Not a totality over persons (the subject is the town, never "everybody" or "nobody") |

**VARIANT 3 · `[visitor]` — claim set carried by all four faces:** (i) a stranger meets the armed men; (ii) no works stand round the town; (iii) that settles where a fight would fall.

| face | claim | licence |
|---|---|---|
| 1 (lead) | "meets no edge coming into {settlement}" | read (a). An edge is a line AROUND the town — exactly the empty bucket; a GATE is a point and a CITADEL is inner (`defenseInstitutionBuckets.js:169-182`), so neither is denied |
| | "armed men somewhere among them" | read (b), plus the `Barracks` row's own description ("housing for guards"). Deliberately indefinite: at metropolis the row is `Multiple garrisons`, "distributed across quarters. No single barracks can secure a metropolis" (`institutionalCatalog.js:2355-2360`), so no face asserts ONE building |
| | "A fight here would be decided among the houses" | subjunctive; the capability fence. No prediction the pulse adjudicates |
| 2 | "The garrison … is quartered among houses" | read (b) + the catalogue row's own words; no count, no size |
| | "a stranger goes by it without knowing" | the visitor stance; W27's stance rules struck — a stranger may act. Habitual present, no rate |
| | "No work stands round the town to keep a fight off those streets" | read (a); the perimeter only |
| 3 | "a wall, a palisade or an earthwork" | read (a) stated in the bucket's own vocabulary (`['wall','citadel','palisade','earthwork', …]`) |
| | "A fight would go where the men went, and men can go the wrong way" | the licensed core of "people can be gone around", told as a civic fact rather than a maxim: a force must be in the right place and a work need not. Modal `can`, not a rate |
| 4 | "Roads bring a stranger into {settlement} and stop at doors, with no wall or earthwork between" | read (a). Only the walls bucket is denied; no checkpoint, toll bar or gate is denied (F1-08), and no claim is made about terrain or route that `config.terrainType` / `tradeRouteAccess` could contradict (F1-102) |
| | "The men under arms are behind those doors" | read (b) + the barracks' description |
| | "a fight here would find them at home" | subjunctive; the dry note. Asserts no event |

### 3. The floors, walked

- **Floor 1 (no self-contradiction; the five closed rosters).** No face asserts a body, building, record-keeper, force or faith-house the rosters do not carry. No face DENIES one either — the reverse-facing trap this key invites (F1-25). There is no "nothing but its people", "no watch worth the name", "nobody meets a cart", "no gate to shut", "no order here". Every negation in all twelve renderings is confined to the **walls bucket** (wall, palisade, earthwork, citadel; "works"; "an edge"; "round the town"), which is precisely read (a). The town watch is never swept into the professionals (F1-27): the words *professional*, *full-time* and *soldiers* appear nowhere; the faces say *a paid force*, *a garrison*, *men*, *men under arms*, *the armed*. The garrison and a watch are never contrasted as two bodies (F1-29). No tier or band word is spelled (F1-31). No totality of safety (F1-34) and no "nothing gets in or out" (F1-79). No minted proper name (F1-126).
- **Floor 2 (magnitude, tense, mutability).** No digit and no magnitude word anywhere: no count, share, size, distance, duration, frequency or age; "a handful", "most nights", "for years", "every season", "a few" appear nowhere; **"one purse" was deliberately rewritten to "the same purse"** so that no numeral word carries a count. No perfect, no durative, no *still / no longer / since / to this day*; no comparative against an earlier state; no ordinal over events. Every edge is subjunctive (`would`), every standing fact is the simple habitual present. No face reads `settlement.history` or any field the composed-prose layer does not observe (F2-09).
- **Floor 3 (scope).** No named character. Unnamed persons appear and act — a stranger goes past unknowing, the town complains, people say a thing — and none of them is the singular office the tier emits (F3-06: no captain, no "the officer who commands", no "the one who keeps the muster"). Nothing is predicated of a deity. Furniture is culture-neutral: houses, doors, roads, streets, stone, wages, an account, a purse — no thatch, hearth-smoke, churchyard, market green or snow (F3-05). "Streets" and "houses" hold across all twelve culture profiles at town tier and above, which is this key's whole native domain.
- **Floor 4 (the engine's model).** No decay and no permanence is asserted of any row (F4-01). The two upkeep lines are never split into two purses (F4-02/F4-03) — where the purse appears it is explicitly ONE answering for both, with nothing standing to spend on. No total collapse of pay (F4-04). The readiness band is never explained by the works (F4-06). **The ground is never said to do nothing** (F4-07) — the temptation "nothing here is to make a stand behind" is absent from all twelve; where the fight is spoken of, it is placed by where the MEN are, never by an absence of usable ground. No magic (F4-08). No covert fact on a player face (F4-13).
- **The preimage quantifier (A.2).** Checked against town (the native majority, `Barracks` + required part-time `Town watch`), metropolis (`Multiple garrisons`, distributed), the ruined-wall CITY (live-roster filter; `Garrison` + `Professional city watch` as ONE deduped row), all three `config.monsterThreat` families, all four badges, all seven terrains, all twelve culture profiles and the stress states. The three constructions that would have failed one member and were rewritten: a single barracks building (fails metropolis), "soldiers" as the town's whole armed strength (fails town), and "nothing built" bare (fails every member, because the barracks is built).

### 4. The craft answer — why these twelve are not one sentence twelve times

- **Twelve constructions, not twelve vocabularies.** v1 runs: an entry with its spend · a record naming what it carries · a siege fronted with the answer supplied second · a fronted-object capability pair closing on the purse. v2 runs: a wh-cleft with a subjunctive reversal on a semicolon · a complaint · a paired question-and-answer said twice in the town's own voice (declarative both times) · the short flat line with a withholding close. v3 runs: the absent arrival · the building passed unknowing · what a stranger cannot find · the roads that end at doors.
- **The craft lexicon is the keeping itself** (works, wage, account, purse, roll of trades) set against the visitor's furniture (edge, country, houses, streets, doors, home). `raid` and `siege` recur because they are the key's own content and claim-equality requires them in every face; every other noun is spread.
- **The short line exists**: v2 face 4 is twenty words and v2's lead is twenty-four, against v3 face 3's thirty-seven. Length follows load.
- **Something is left standing open** in each variant: what the wage buys and what it does not (v1), where the men have to be (v2), where a fight would fall and that the men can go the wrong way (v3). Nothing is closed with a reassurance, a summary or a verdict.
- **A person appears** in eight of the twelve — the stranger, the complainers, the town speaking unprompted — and not one is named.

### 5. The two turns the skeleton flagged, and what became of them

- **"keeps a professional force and no perimeter"** (§1.5, "carry this compression whole if it can be carried"). **Kept in substance, not in letter.** The compression survives as *a paid force and no works* (lead), *a garrison and no work standing round the place*, *a force on the town's wage*. The word *perimeter* was dropped because three sibling `Invasion & War` pools and four `Beasts & Monsters` pools already spend *perimeter* and *line* on the same tab; *works* is this pool's own shipped word and reads clean beside them.
- **"no line for them to stand behind"** (§3.5, "keep verbatim if it survives the sibling check in §4.3"). **It does not survive, and is dropped.** §4.3 is decisive: on every `frontier` town the pool `Beasts & Monsters: frontier, force without a perimeter` renders one paragraph higher with *"A stranger finds soldiers at {settlement} and no wall for them to stand on"*, and no lead of this pool may be that sentence again. The nearest surviving form is v3 face 3's *a wall, a palisade or an earthwork for the men to be set behind*, which sits third in the draw, names the absence in the record's own three nouns rather than as one image, and does not open the passage.
- **"because there is nothing here to hold"** (§1.5, "the one clause worth replacing"). **Replaced** in all four v1 faces — by the spend (lead), by the account (face 2), by the wage (face 3) and by the purse (face 4). The restatement is gone from the pool.

### 6. Composition (§4.1 / §4.2), checked

Every face is written to open a passage cold, because on `plagued` and `settled` towns the Beasts row is silent and this line is the lead paragraph in the larger type (`DefenseTab.jsx:317-319`). Every face ends on a noun a later modifier can pick up — stone, siege, wage, men, houses, streets, doors/home, roads — and none ends on a turn outward that a sibling modifier would have to follow. No face restates or contradicts the sibling spines on the same tab (arms A1 / A11): DS-DEF-11's UNWALLED pool owns the missing wall in its own right and is not restated here; this pool's subject throughout is **a town with no edge and what that decides about war**, which is the divergence §4.3 asked for.

Seat: **Opus 5** — writer packet, complete.
