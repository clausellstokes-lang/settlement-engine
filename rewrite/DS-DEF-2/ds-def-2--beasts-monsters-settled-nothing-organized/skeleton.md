# SKELETON: DS-DEF-2 · pool `Beasts & Monsters: settled, nothing organized`

Marker: Fable 5.1 (a MARKER seat under the Fable chair; 2026-09-11). Packet written under the CHECKPOINT LAW: sections land as they are finished; a later reader continues from what stands here.

STATUS: COMPLETE (see the closing STATUS line at the foot of the file).

Read whole before marking: REGISTER-CARD.md (with S2, S3); RULES-V2-PART-B §1, §16 to §16.2, §18, §20 to §23 (with §21.1 to §21.4); MOVE-GRAMMAR §1 to §3, §4.4.1 to §4.4.3, §1.4.1 (THE THREAD); CLERK-LAWS §2.4.1, §2.6.1; ARCH-COMPOSED-PROSE-v2 §2.5, §8.3; the brief's ADDENDUM 13 parts A and B whole (W1 to W27); the ENTAILMENT table §2.1 (defense), §3.1, §3.4, §4.1, §4.2; the REFERENT table §2.1, §2.1-R, §5.1; the dossier annex under `### DS-DEF-2`; the licence card printed in laneRW-DEF2; `defenseStateProse.js` (`MONSTER_FAMILY_OF`, `BEASTS_ROW_POOL`, `beastsRowSituation`, `defenseThreatProse`); `defenseInstitutionBuckets.js` (`standingDefenseForces`); the wiring census row for this pool.

## 0. THE CARD, THE READ, AND THE BLOCK HEADER (as printed 2026-09-11 in laneRW-DEF2)

- role: spine · key `Beasts & Monsters: settled, nothing organized` · rung table · keyFunction `BEASTS_ROW_POOL` · status RESOLVED
- reads: `beastsRowSituation(family, perimeter, force)` via `BEASTS_ROW_POOL` in `defenseStateProse.js`; predicate `=== settled country, neither`; readsGrain branch
- bag: {band: RESERVED, route: proper, settlement: proper}; FILLED at this block's call sites: {settlement} ONLY. `{route}` has no provider on this block and `{band}` is reserved: a face naming either is refused (a face whose slot set differs from its parent's is refused, ARCH §2.5).
- move: none declared · angle: ledger street visitor · covert: no · audience: player (no mark) · dm-only marks: none on this pool
- echo: spine mounts 1 (tab: defense, site `defense.threatAssessment`) · modifier mounts 0 · attach: empty (a spine). The echo key is shared by every row of `BEASTS_ROW_POOL`.
- source (card): muster · standing LICENSED, "a citation of this holder is licensed where the provenance budget allows". Source (census row): `kind: muster`, `fields: {family: "", perimeter: "", force: "muster"}`, `holder: null`, `holderReason: town-resolved`. See §0.2: on every town this pool fires on, the holder resolves to NOTHING.
- may claim: that the reader selects the row `settled country, neither` of `BEASTS_ROW_POOL`, as a STANDING fact of the record
- may NOT: a count, a cause, a season, a future, a standpoint, a second fact
- refused columns always: a totality over persons; an exemption from a duty; a named character and its fate; a theological claim
- Block STATE-KEY: five fixed rows, each with a `scoreBand` badge, read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags, and `compound.inst`. SLOTS: {settlement} {band} {route}. SECTION-TARGET: defense.
- Block PROVENANCE + FENCE: institution presence is a STANDING fact with no recorded history; causal clauses here are CAPABILITY clauses, never historical ones; the walls read rides `defenseProfileHasWalls` / `standingDefenseForces`, never a presence check on the array.
- The register card's six one-line registers were read; this pool is the DOSSIER (the record itself; the clerk's third person; the town's name is not the default opener). The three tags on it are STANCES inside that register (W27), not registers of their own.

## 0.1 WHAT THE READ MEANS, FROM THE CODE (the licensed claim set of the key, exactly)

`defenseThreatProse` (`defenseStateProse.js:611-660`) computes
`beasts = beastsRowPoolKey(settlement.config.monsterThreat, walls, garrison || militia)` where
`forces = standingDefenseForces(settlement)` (the LIVE, ruin-filtered roster, `defenseInstitutionBuckets.js:169`), `walls = forces.walls.present`, `garrison = forces.garrison.present`, `militia = forces.militia.present`.

`beastsRowSituation(family, perimeter, force)` (`:429-440`) returns `'settled country, neither'` only when: `family === 'settled'` AND `perimeter === false` AND `force === false`. `family === 'settled'` is produced by the config value `heartland` through `MONSTER_FAMILY_OF` (`:280-284`); `measuredMonsterFamily` requires the RAW value, so an unmeasured town (the `frontier` default) never reaches this row.

So the key's licensed claim set, and NOTHING wider, is these three parts of ONE keyed condition (R-v: the reads of a key are one keyed condition, never a second fact):
1. THE COUNTRY'S TIER IS `settled` = the producer token `heartland` = the LOW monster-and-raider tier of the country (ADDENDUM 13 part A item 4; entailment L-2: the stress roll multiplies siege and monster by 0.3 and occupation by 0.4). LOW, never NONE: "never 'no live threat', never 'the centre of a realm', never founded". Stated over the COUNTRY, never as a totality over the town (W2).
2. NO MEMBER OF THE WALLS BUCKET STANDS (`Palisade`, `Palisade or earthworks`, `Town walls`, `Gates (if walled)`, `Citadel`, `City walls and gates`, `Massive walls and fortifications`): the town has no works. Safe spelling for the class: "the works", "what the town has built" (A-7); its absence: no works, nothing built against the country. Never a material (W11), never "the line" as a manned front.
3. NO MEMBER OF THE GARRISON BUCKET AND NO MEMBER OF THE MILITIA BUCKET STANDS (`Garrison`, `Multiple garrisons`, `Barracks`, `Professional city watch`; `Citizen militia`): the town keeps no muster. Safe class word for the paid military: "the muster", "the town's force" (ADDENDUM 13 item 5); its absence: no muster, no force under arms, nobody under arms for it.

WHAT THE READ DOES NOT CONSULT (and so no face may assert or deny): the WATCH bucket (`Town watch`, `Professional city watch` as a watch), the MERCENARY bucket, the CHARTER bucket, the `magicDef` bucket, the `Household levy` (in no bucket), the `communityMilBase` baseline, the readiness badge, the safety label, the terrain, the route, the hour, any count. Contrast the refuter's ruling on DS-DEF-5 `NO organized force at all`, whose selector consults SIX buckets and is therefore "licensed to say no contracted, chartered or arcane body stands" (REFERENT §2.1-R): THIS selector consults THREE, so "nothing organized" / "no organized defense" as a totality over defense bodies is NOT licensed here; the licensed absence is of the works and of the muster.

## 0.2 THE TIERS THIS POOL FIRES AT, AND THE WATCH FINDING (binds every face)

- CITY and above: never. `Professional city watch` is REQUIRED at city (R-A) and sits in the GARRISON bucket (`defenseInstitutionBuckets.js:89`; OV-1), so `force` is true on every city; `City walls and gates` is required at city besides.
- TOWN: fires on a town with no `Town walls` (bc 0.5), no `Gates (if walled)`, no `Barracks` (0.3) and no militia (`Citizen militia` never generates natively at town: the required `Town watch` shares its exclusive group and splices it, R-A). EVERY such town HAS A `Town watch` STANDING (required at town). Therefore on every town-tier instance of this pool the town keeps a watch, and a face saying the town has no watch, needs no watch, or that nothing outside would justify a watch CONTRADICTS THE RECORD (W13; W20; the D-F3 pattern in REFERENT §5.1: a body word the read never consulted on a branch that asserts force is false).
- HAMLET / VILLAGE: fires where no `Palisade or earthworks` and no `Citizen militia` stand. No watch row exists below town (`hasWatch` is town-plus), so a face may not name a watch here either.
- THORP: fires where no `Palisade` and no militia stand. A `Household levy` may stand (in no bucket, M-5); the face may neither name it nor deny it.
- So every face must be TRUE AT ONCE on a thorp with a levy, a village with nothing, and a town with a required watch. The only absences true on all of them are the two the read holds: no works, no muster (garrison-or-militia). "Nothing organized", "no defense", "no watch", "nobody armed", "no one under arms at all" are false on at least one of those towns and are refused (a totality; W20).

## 0.3 THE SOURCE: NO CITATION AND NO RECORD NOUN ON ANY FACE OF THIS POOL

The card prints `source: muster · standing LICENSED` at the KIND grain. At the TOWN grain the muster kind's only roster holder is a `Citizen militia` with an instantiated `Muster training` service (`holderTable.js:279-288`; OV-5; ADDENDUM 13 item 5: "the muster roll" as a citation only where that resolves). On this row `force === false`, so NO militia stands on any town this pool fires on, and the holder resolves to null (the census row prints `holder: null`). Under W24 (a read that resolves NO holder carries no record word at all) and rule 5 (neither "the watch" nor "the muster roll" as an institution NAME on an unwired read), every face of this pool: cites nothing; uses no record noun (no roll, rolls, books, count, register); states the fact on the read's own nouns (the country, the works, the muster, the town). The `[ledger]` tag is a STANDPOINT and licenses no citation (W24); "entered as standing" / "stands on the record as" is the office's own formula and is permitted (R-vi/W7). "The muster" as the CLASS WORD for the absent force is licensed (a class word asserts no roll); "the muster roll" is not.

## 0.4 THE WORDS, RULED FOR THIS POOL (from the two tables; each with its bar)

- `settled` / `heartland`: the ENGINE meaning is the LOW tier of beast-and-raider exposure over the country. "Heartland" read as English asserts the centre of a realm (item 4, W14): refused as a face word. "Settled country" is the selector's own row name and is safe only as the tier, never as "founded" or "populated". Lawful renderings of LOW: "quiet" (the corpus's band word for this tier; DS-DEF-11's own key word), "little comes out of the country", "very little in the country" (the sibling pool's phrase, which the defense refuter's over-knowledge list did NOT strike, ENTAILMENT §2.1 tail), "low", "the country runs low in beasts". NEVER "nothing", "no threat", "safe", "empty", "at peace".
- the country / the country outside / the country around {settlement} / the approach: NONE layer (a region token); the safe frame for the threat read (A-12; W2). Never a direction, a distance, a named feature, a terrain word (no terrain read here).
- beasts / creatures / monsters / what the country sends out: the row's own class (`Beasts & Monsters`). Never "raiders" or "war" on this row (the war row sits on the same page, C7), never disease (`plagued` is monsters; not this row anyway).
- the works / what the town has built: the walls class, safe of every member (A-7). Never "the wall", "the palisade", "the line", "stone", "timber" (W11), never "the gate".
- the muster / the town's force / nobody under arms for it: the force class (item 5; `force = garrison || militia`). Never "the garrison" (W12), never "the militia" (a body word on an absence; and at town the militia never generates anyway), never "the soldiers" as a presence, never "the guard" (struck, item 5), never "the community" (an engine baseline the read does not hold; false at town).
- the watch: BODY of the watch bucket, NOT read by this key; at town it STANDS. Refused on every face, present or denied (W13, W20, §0.2).
- a stranger: the visitor's EYE (W27), never a PERSON referent: it may see and find; it is never told, never named, never acts on the town, never decides; it never reports an hour, a direction, a count, or "nothing".
- the town: the record's subject through {settlement} or "the town"; never a thinking, needing, deciding, fearing or knowing agent (W23; the belief-frame floor of R-DA-13; the D-F16/D-F18 pattern).

---

# VARIANT 1

## 1.1 Number and angle tag
Variant 1 · `[ledger]` · index 0 (canonical at zero: the line a falsy seed draws; its grammar is the pool's default grammar).

## 1.2 The shipped sentence, verbatim
{settlement} keeps no organized defense against the country, and in a heartland this quiet the arrangement is a reasonable one rather than a gap.

## 1.3 Every claim, tagged (licence · law · referent layer; the read's layer is BODY-ABSENCE over the walls, garrison and militia buckets plus a NONE country token)
1. `{settlement}` opens the sentence. LICENSED (the bag's one filled slot). Layer NONE (the town as the record's subject). Note: the settlement token may open at most ONE variant of the pool and never two adjacent (wall 10; R-DA-17); this is the one.
2. "keeps no ... defense" as the absence of works and of a muster. LICENSED by the key (perimeter false, force false), as the LACK written as a negated surface on a present read (W10; one per variant). Layer: an absence of BODIES the read reaches (walls · garrison · militia buckets), tagged NONE (an absence is NONE; the bodies it denies are the three the read consults).
3. "organized defense" as a TOTALITY over every defense body. UNLICENSED: a totality (the read consults three of seven buckets; at every town-tier instance a required `Town watch` stands, §0.2; at thorp a levy may stand). Layer mismatch under W20: a class-of-bodies noun wider than the read's rows. The licensed forms name the two absences the read holds (no works; no muster).
4. "keeps" as the town's act of keeping. LICENSED as the record's formula for a standing arrangement (an absence stated on the town; not an act, decision or cause). Layer NONE. Caution: never "has never kept", "has not raised" with a totality over time (history from a standing field, R-DST-B).
5. "against the country" as the scope of the threat read. LICENSED (the monsterThreat read is over the surrounding region; W2 country-scoped). Layer NONE (a region token).
6. "in a heartland". UNLICENSED as worded: the producer token rendered at its DICTIONARY sense (the centre of a realm, an interior, a founded country), W14 and ADDENDUM 13 item 4 ("never 'the centre of a realm', never founded"). The licensed content underneath it (the country's tier is LOW) is READ 1 of §0.1 and MUST be carried in other words. Layer NONE.
7. "this quiet" as the band word for the LOW tier. LICENSED (the engine meaning of `settled`, rendered as a measurement in words; the corpus's own word for this tier). Layer NONE. Bounded: quiet, never silent, never empty, never safe.
8. "the arrangement is a reasonable one". UNLICENSED: a VERDICT / standpoint (the record rates nothing; the card's may NOT a standpoint; MOVE-GRAMMAR §1.3 VERDICT does not exist), and a CAUSE by implication (the absence is explained by the tier, which no field joins: the selector reads the tier and the absences side by side and computes no "because"). Layer NONE.
9. "rather than a gap". UNLICENSED: a CONTRAST whose rejected alternative names no sibling pool key and no sibling band (R-DA-02: "a bare X, not Y" goes); also a second verdict word ("gap" rates the absence). Layer NONE.
10. The sentence as a whole joins two facts with ", and": the absence AND the tier. LICENSED as ONE keyed condition (R-v), not a second fact; but the joint here carries the verdict (claim 8), which is the part that goes.

## 1.4 THE READS THE REWRITE MUST STATE (every card read + every licensed claim of the shipped sentence)
- READ 1: the country around {settlement} sits at the LOW beast tier (`settled` = `heartland`), stated over the country and as LOW, never as none. (The shipped "this quiet" carries it lawfully.)
- READ 2: no works stand (no member of the walls bucket). (The shipped sentence folds this into "no organized defense"; the rewrite names it.)
- READ 3: no muster stands (no garrison, no militia; `force` false). (Same.)
- Licensed shipped claims to carry forward: the country-scoped frame ("against the country"); the LOW tier as "quiet"; {settlement} as the opener on this one variant; the absence written as a negated present read (W10), one per face.
- The three reads are ONE keyed condition and may sit in one sentence or two (S2: two sentences at most per unit); no third sentence; no "which"; no em dash.

## 1.5 THE ANGLE'S STANCE on this pool: `[ledger]`
The ledger is the clerk's way of stating the fact: it ENTERS the condition as the record holds it and MEASURES it in words (the low tier; the two absences), lands on the civic thing the fact names (the country, the works, the muster), and stops. It may use the office's own formula ("stands entered as", "is entered with"). It CITES NOTHING and uses NO record noun on this pool (§0.3: the muster holder resolves to nothing here; W24). It may NOT rate the arrangement, explain it, contrast it with an alternative that is no sibling key, forecast, or assert what the town keeps beyond the two absences the read holds. The block's PROVENANCE line allows a CAPABILITY clause, never a historical one; here no capability clause is licensed beyond the condition itself (nothing in the engine joins the tier to the absence).

## 1.6 THE TURNS WORTH KEEPING (lawful shipped clauses a face may carry as they stand)
- "against the country" (the frame; the country as the civic noun a modifier could pick up under THE THREAD).
- "this quiet" (the band word; lawful as "a country this quiet" / "in a country as quiet as this" without "heartland").
- "{settlement} keeps no" as an opener shape on ONE variant only (the negated present read), completed with the licensed absences: "no works and no muster".
- The two-part shape (absence, then the tier as the one joint) is a lawful construction once the verdict is cut; the joint's own comma and a connectives-list word, never "which".

## 1.7 WHAT WOULD MAKE THE REWRITE A REGRESSION here
- An INVENTORY LINE: "{settlement} has no walls and no militia." (no tier, no stance, no civic close).
- A LOST LICENSED READ: a face that drops the tier (says only the absences), or that drops one absence (says "no defense" or "no works" alone), or that states the tier as none rather than low.
- A LOST LAWFUL TURN: the country-scoped frame gone (the absences stated with nothing they are absences against), or "quiet" replaced by a wider word ("safe", "empty", "peaceful").
- A DROPPED ANGLE: the ledger's measuring stance replaced by the street's plain speech or the visitor's eye (W4: the construction contract; the three variants stay three stances).
- A NEW BREACH: "heartland" kept; "organized" kept as a totality; any watch word; a citation ("the muster roll shows"); a verdict word (reasonable, sensible, enough, prudent); a cause ("because the country is quiet"); "never" over time; a wall material; a count of anything; a second {settlement} opener in the pool.

---

# VARIANT 2

## 2.1 Number and angle tag
Variant 2 · `[street]` · index 1.

## 2.2 The shipped sentence, verbatim
The town has never needed to think about what is outside it, and does not.

## 2.3 Every claim, tagged (the read's layer as in §1.3)
1. "The town" as the subject. LICENSED as the record's subject (the naming form's alternative to {settlement}; W5). Layer NONE. But see claims 3 and 5: here it is made a thinking agent, which is the breach.
2. "has never needed". UNLICENSED: HISTORY from a standing configuration field (R-DST-B: a standing field licenses a structural clause, never a historical one; "never" is a totality over the town's past that no event-provenance field holds), and a CAUSE/necessity judgment (the record explains nothing). Layer NONE.
3. "to think about". UNLICENSED: a BELIEF FRAME / FEELING (no field carries the town's attention, mood or thought; MOVE-GRAMMAR §1.3 FEELING does not exist; the D-F18 pattern "the town has not yet had to think about" HOLDS as a breach in REFERENT §5.1); a FUSED AGENT (W23: the town as a mind). Layer NONE.
4. "what is outside it". LICENSED as the frame: the country outside the town is what the threat read is over (W2; A-12 "the country outside" is a ratified safe spelling). Layer NONE.
5. "and does not" (does not think about it, now). UNLICENSED: the same belief frame in the present; and the summarising second beat that restates the first (W6, R-DA-03/R-DA-12: the summarising close). Layer NONE.
6. What the sentence does NOT say: it states none of the three parts of the read. No tier word (READ 1), no absence of works (READ 2), no absence of a muster (READ 3). As shipped it is a mood line over an unstated fact; the rewrite's street variant must carry the whole keyed condition.

## 2.4 THE READS THE REWRITE MUST STATE
- READ 1 (the LOW beast tier of the country), READ 2 (no works), READ 3 (no muster): all three, in the street's plain words.
- Licensed shipped claim to carry forward: the country OUTSIDE the town as the frame ("what is outside it" / "the country outside").
- Nothing else of the shipped sentence survives the card.

## 2.5 THE ANGLE'S STANCE on this pool: `[street]`
The street is the town's own condition stated in the plain speech of the town, as the fact is lived and would be said aloud: what the town has and has not (no works raised against the country; nobody under arms for it; a country that sends little out). It may be short. It may state the two absences and the tier in the town's own plain nouns and land on one of them. It may NOT: assert what the town thinks, needs, fears, knows, remembers or has decided (W23; the belief-frame floor); say "everybody", "nobody", "no one here" (a totality over persons is a REFUSED COLUMN on the card); reach into the town's past ("has never", "long since"); name a watch, a levy, "the community" or anyone as the thing that stands in for a muster (§0.2); rate the arrangement; quote anyone (no saying row; no citation). The street register carries no record noun and no holder (W24, W27).

## 2.6 THE TURNS WORTH KEEPING
- "what is outside it" as the street's word for the country (plain; lawful; a noun a modifier could carry forward).
- The short line: the register card licenses the short sentence, and this variant is the pool's natural place for it (rhythm follows load; R-DA-05's spread across the pool). Keep the variant's BREVITY as a construction (W4), not its content.
- No other clause of the shipped sentence is lawful.

## 2.7 WHAT WOULD MAKE THE REWRITE A REGRESSION here
- An INVENTORY LINE: "The town has no walls and no militia." with no stance (the street's plain speech must still be a way of saying it, not a list).
- A LOST LICENSED READ: any of the three parts missing (the shipped line has none; the rewrite that states only one or two is still short of the floor).
- A LOST LAWFUL TURN: "what is outside it" replaced by a direction, a terrain or a named feature (none is read); the short construction abandoned so that all three variants run long.
- A DROPPED ANGLE: the street's plain speech replaced by the ledger's formula ("is entered with") or the visitor's eye ("a stranger").
- A NEW BREACH: "never", "has not needed", "does not think", "knows", "everyone", "nobody minds", "the watch", "the levy", a quoted saying, a cause ("so it keeps none"), a verdict ("and that is enough"), a forecast ("will not need"), a totality over the country ("nothing out there").

---

# VARIANT 3

## 3.1 Number and angle tag
Variant 3 · `[visitor]` · index 2.

## 3.2 The shipped sentence, verbatim
A stranger walks out of {settlement} in any direction at any hour and meets nothing that would justify a watch.

## 3.3 Every claim, tagged (the read's layer as in §1.3)
1. "A stranger" as the eye of the sentence. LICENSED as the visitor STANCE (W27: the stranger is the visitor's eye; it may see). Layer NONE (a stance; never a PERSON referent: it is not named, told, or given a fate).
2. "walks out of {settlement}". LICENSED, narrowly, as the eye's movement to the country outside (the stance sees from the approach). Layer NONE. Caution for the drafter: W27 says the eye "may see, never act, decide, be told or be given a name"; the safest verbs are perceptual ("finds", "sees", "meets"); the stranger never does anything to or for the town, is never admitted, questioned, stopped, or counted.
3. "in any direction". UNLICENSED: a TOTALITY over the country's directions and a GEOGRAPHY observable no field holds (the read consults no terrain, no route; `{route}` is unfilled on this block). Layer NONE.
4. "at any hour". UNLICENSED: a TIME observable no field holds, and a totality over the day (no patrol, hour, or night field is read; the `Town watch`'s Night patrol is a service the read does not consult). Layer NONE.
5. "meets nothing". UNLICENSED: the LOW tier rendered as NONE (ADDENDUM 13 item 4: never "no live threat"; W14: the label at its engine meaning); a totality over the country. The licensed content underneath (the country sends little out) is READ 1 and must be carried as LOW. Layer NONE.
6. "that would justify a watch": the word "a watch". UNLICENSED: a BODY noun of the watch bucket on a read that never consults it (W20; the D-F3 pattern), and FALSE ON THE RECORD at every town-tier instance, where a `Town watch` is a required row and stands (§0.2; W13: a corpus row that asserts a watch off a key that reads no watch row is a breach the rewrite cures). Layer BODY (watch) against a read of walls · garrison · militia: a layer mismatch.
7. "would justify" as a judgment. UNLICENSED: a CAUSE/justification (the record explains nothing; may NOT a cause), a STANDPOINT on what the country warrants, and a summarising beat over the whole sentence. The subjunctive "would" is a lawful modality but its content is not licensed. Layer NONE.
8. What the sentence does NOT say: the absence of works (READ 2) and of a muster (READ 3) are absent; the tier (READ 1) is present only as the overstated "nothing".

## 3.4 THE READS THE REWRITE MUST STATE
- READ 1 (the LOW beast tier of the country, seen from the approach as: little in the country, a quiet country), READ 2 (no works: nothing built between the town and the country), READ 3 (no muster: nobody under arms for it): all three, as what a stranger FINDS.
- Licensed shipped claim to carry forward: the stranger as the eye at the country outside {settlement}.
- Nothing else of the shipped sentence survives the card.

## 3.5 THE ANGLE'S STANCE on this pool: `[visitor]`
The visitor is the eye of a stranger at the approach: it reports what stands and what does not as a thing seen (no works between the town and the country; nobody under arms; a country that sends little out). It sees; it does not act on the town, decide, get told, get a name, or count (W27). It may carry the two absences as what is not there to be seen and the tier as what the country shows (little). It may NOT: name a watch, a levy, a garrison or "the community" as what stands instead (§0.2); give an hour, a direction, a distance, a season or a terrain (no field); say "nothing" or "safe"; judge what the country would justify or warrant; be greeted, questioned or admitted; report the town's mood. W8 for the visitor on this desk: it carries a fact only as the thing's standing state, never as the town's act or an accounts fact. No citation, no record noun (W24, W27: the stance's nouns are never a holder's record).

## 3.6 THE TURNS WORTH KEEPING
- "A stranger" as the opener of the visitor variant (the corpus's visitor form across the desk; lawful as the eye).
- "out of {settlement}" as the eye's direction of regard (the country outside), with {settlement} mid-sentence so that this variant does not become a second settlement opener (wall 10).
- The verb "meets" as a perceptual verb for what the stranger finds in the country, completed lawfully ("meets little", "meets no works and nobody under arms"), never "meets nothing".
- No other clause of the shipped sentence is lawful.

## 3.7 WHAT WOULD MAKE THE REWRITE A REGRESSION here
- An INVENTORY LINE: "A stranger sees no walls and no militia at {settlement}." with the tier missing and no close on a civic noun.
- A LOST LICENSED READ: the tier dropped (the stranger sees only absences), or one absence dropped, or the tier rendered as none.
- A LOST LAWFUL TURN: the stranger's eye replaced by an unmarked third person (the visitor construction is this variant's contract, W4); "out of {settlement}" replaced by an arrival that puts the eye inside the town's affairs (admitted, questioned, told).
- A DROPPED ANGLE: the visitor folded into the ledger or the street.
- A NEW BREACH: "a watch" (present or denied), "any direction", "any hour", "nothing", "safe", "would justify", "needs no", a road or terrain word, a distance, a count, the stranger given a name, a fate, an act on the town, or a quotation; "the guard"; a wall material.

---

# CLOSING LINES FOR THE DRAFTER (the pool as one set)

- Three variants, three stances, three CONSTRUCTIONS (W4); four faces per variant, each a different construction and rhythm, never a paraphrase of a sibling; every face stands alone at render.
- Every face states the ONE keyed condition whole: LOW beast tier over the country + no works + no muster. Two sentences at most; one joint at most (S2); no "which"; no em dash; no digit; no percent.
- At most one variant opens on {settlement} (variant 1 as shipped); never two adjacent.
- No citation and no record noun anywhere in the pool (§0.3). No watch word anywhere in the pool (§0.2).
- THE THREAD: this pool is a SPINE with zero modifier mounts today, so each face must read well alone AND leave a civic noun standing (the country, the works, the muster, the town) for any modifier a later car attaches; land on that noun and stop. Vary the close kind across the faces (a condition · an absence · an object).
- The density floor is the card's three parts (W9: entailments are may, never must); a face richer than the shipped line in truth and no poorer in stance is the target; the ceiling, not the middle (§21.1).

STATUS: COMPLETE: three variants marked (1 `[ledger]`, 2 `[street]`, 3 `[visitor]`), each with parts 1 to 7; preamble §0 to §0.4; closing lines. Nothing outside this file was written.
