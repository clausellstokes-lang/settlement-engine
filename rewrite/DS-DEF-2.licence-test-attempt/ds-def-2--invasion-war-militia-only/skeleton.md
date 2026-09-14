# SKELETON — DS-DEF-2 · pool `Invasion & War: militia only`

Marker: Fable 5.1 (MARKER role, for the Fable chair) · 2026-09-11. Status: COMPLETE (sections 0 to 5 written; the checkpoint law was followed: this file was created at the start and rewritten as sections landed).

Read before marking, whole: REGISTER-CARD.md (with S2, S3); RULES-V2-PART-B.md §1 (R-DA-00 to R-DA-24), §16 to 16.2, §18, §20 to §24; MOVE-GRAMMAR.md §1 to §3, §4.4.1 to 4.4.3, §1.4.1 (THE THREAD); CLERK-LAWS.md §2.4.1, §2.6.1; ARCH-COMPOSED-PROSE-v2.md §2.5, §8.3; brief-REWRITE-car8b-defense.md ADDENDA 6 to 13 (part A and part B: W1 to W27); REFERENT-TABLE.draft.md §2.1, §3, §4, §5.1; ENTAILMENT-TABLE.draft.md §2.1, §3.2, §3.4, §4.1, §4.2; the census row (`wiring-census.json` rows/19); the read code (`defenseStateProse.js:454-492`, `:600-660`); the receipt (`threatAssessment.js:28-195`); the buckets (`defenseInstitutionBuckets.js:83-110`); the holder rows (`holderTable.js:188-196`, `:279-288`); the three `Citizen militia` rows (`institutionalCatalog.js:335`, `:867`, `:1340`), their desc variants and services (`institutionServices.js:835-838`).

## 0. The licence card (printed 2026-09-11 in laneRW-DEF2: `node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: militia only'`)

- reads: `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js` (absent ⇒ no candidate; a modifier is silent, never "false")
- predicate: `invasionRowSituation(walls, garrison, militia) === no walls, citizen militia`
- bag: `{band: RESERVED, route: proper, settlement: proper}`; FILLED at this block's call sites: `{settlement}` only
- relation: none (a spine takes no relation); seat/form: not a seat-taker / sentence; move: none declared
- angle: ledger · street · visitor
- attach: empty (a spine takes no attach set)
- echo: spine mounts 1 (tabs: defense) · modifier mounts 0; the echo key is the WHOLE table-rung reading, shared by every row of `INVASION_ROW_POOL`
- covert: no
- source: muster · standing LICENSED; "a citation of this holder is licensed where the provenance budget allows"
- may claim: that the reader selects the row `no walls, citizen militia` of `INVASION_ROW_POOL`, as a STANDING fact of the record
- may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force`
- audience: player (no mark)
- REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity

The census row (`wiring-census.json` rows/19): status RESOLVED; keyFunction `INVASION_ROW_POOL`; rung `table`; readsGrain `branch`; objectClass `force`; sites `defense.threatAssessment`; slotsFilled `[settlement]`; variants 3; grammars 2; k 2; rateBp 352; source kind `muster`, fields `{walls: muster, garrison: muster, militia: muster}`, holder null with reason "town-resolved: the holder is named by holdersOf(kind, settlement)", standing LICENSED, twoSource false.

The block's header lines (annex `### DS-DEF-2`): STATE-KEY five fixed rows with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags and `compound.inst`; SLOTS `{settlement}` `{band}` `{route}`; SECTION-TARGET `defense`; PROVENANCE + FENCE: institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses ("walls without people cannot be held") and never HISTORICAL ones; the walls read rides `defenseProfileHasWalls`, never a presence check on `institutions.walls`; PDF PARITY: parity.

The register card's six one-line registers: the dossier (the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener) · the NPC ladder · the Herald · the chronicle · the DM page · chrome and the docent. This pool is the DOSSIER register; the angle tags are STANCES inside it (W27), not registers.

### 0.1 What the key reads, exactly (the marker's own trace, CONFIRMED in the dock's code)

`invasionRowSituation(walls, garrison, militia)` (`defenseStateProse.js:476-483`) returns `'no walls, citizen militia'` only when `walls === false`, `garrison === false` and `militia === true`. The three booleans are `standingDefenseForces(settlement).{walls,garrison,militia}.present` (`:623-626`), read from the LIVE roster through the bucket keywords: walls = `wall · citadel · palisade · earthwork · inner citadel · massive walls`; garrison = `garrison · barracks · professional guard · professional city watch · multiple garrison`; militia = `citizen militia · militia` (`defenseInstitutionBuckets.js:84-94`). So the ONE read is a keyed condition of THREE standing facts (ADDENDUM 8 ruling 1: the reads of a key are one keyed condition, never "a second fact"):

- R1 walls ABSENT: no wall-bucket row stands (a `none-exists` value; a LACK).
- R2 militia PRESENT: a `Citizen militia` row stands (the bucket's only shipped member; hamlet `:335`, village `:867`, town `:1340`). Layer BODY; the muster HOLDER kind's own roster holder (OV-5).
- R3 garrison ABSENT: no garrison-bucket row stands (a LACK; carried by the key's branch: a garrison outranks a militia, so this row fires only when the garrison is false).

The layer of the READ is BODY (institution rows through the buckets), with the muster holder beside it. Every noun in a face is judged against BODY (W20).

Where the pool fires (CONFIRMED from the catalogue and R-A): natively at HAMLET and VILLAGE only. At city the required `Professional city watch` sits in the garrison bucket, so garrison is always true and this row never fires; at town the required `Town watch` splices the `Citizen militia` out of the roster (same `exclusiveGroup`, R-A), so the town row generates only by a `forceExclude` toggle or an import. No tier is READ by this pool, so no face names one (W3; no band read). A hamlet or village can hold a charter hall beside its militia (`Adventurers' charter hall` at `:325`, `:837`), so the militia is NOT provably the town's only force (see §1 v1 claim 5 and §5).

The muster holder and the citation budget: `holdersOf('muster', settlement)` resolves the `Citizen militia` by the `Muster training` service (`on: false, p: 0.5`, `institutionServices.js:837`), so "the roll" as a RECORD exists on about half the towns that fire this row (OV-5; W24). The provenance budget is a CEILING of one citation per unit for one of S3's three reasons only (two accounts that disagree; a count from an interested party; a keeper who is a power; Part B §24). None of the three holds here: the militia is not a power, no count is read, no second account exists. So although the card prints the holder LICENSED, a face CITES NOTHING ("the roll shows", "on the muster roll" as a source are refused at R-vi/W7); the office's own formula ("entered as standing") remains the ledger's surface (R-vi). The `[ledger]` angle licenses no record noun and no citation (W24).

## 1. The shipped rows (verbatim, from RECEIPT_POOLS_DOSSIER_STATE.md `**\`Invasion & War\`: militia only**`)

1. `[ledger]` {settlement} can put armed citizens on their own ground, which counts for something against a disorganized raid and for nothing at all against a disciplined force.
2. `[street]` The town knows its own country and knows that knowing it is not an answer to a professional army.
3. `[visitor]` A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.

Note the receipt's own strings for this branch (`threatAssessment.js:145-146`): "Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force." The shipped rows paraphrase the engine's chrome. The engine's own strings are product code outside the REWRITE's corpus (OW-20) and license NOTHING for a face: the licence is the card and the recorded row, not the receipt's prose.

---

## Variant 1 `[ledger]`

**(2) Shipped, verbatim:** {settlement} can put armed citizens on their own ground, which counts for something against a disorganized raid and for nothing at all against a disciplined force.

**(3) Every claim, one per line, with licence and referent layer (the read's layer is BODY):**

1. `{settlement}` has a citizen militia that can be raised (the capability of "can put ... citizens" ...). LICENSED: R2 (`forces.militia.present`; the recorded row's own desc on every tier: "drill and muster", "Musters for raids", "obligated to defend"; the entailment law item 1: a militia MEANS a body of townspeople that musters). Layer BODY (the militia; its members at the person-plural grain: "townspeople, part-time" HOLDS, ENTAILMENT D-8). Matches the read. The AGENT of the clause as shipped is `{settlement}` ("{settlement} can put"), the town deploying people: a collective agent one step from D-F16's "the town has decided" (W23); the licensed agent is the militia or its members ("residents turn out"; "the militia musters"), not the town placing them.
2. "citizens": LICENSED as the recorded NAME's own word (`Citizen militia` on all three tiers; constant across the class, so it may be baked: entailment item 2). Layer BODY at the person-plural grain. Matches.
3. "armed": UNLICENSED under the ratified ENTAILMENT-TABLE D-8, NOT ENTAILED: "numbers; ARMS; ever mustered; competence; who calls them out; enforcement". An observable the fields do not hold. Layer BODY (an attribute of the body). RECORDED FENCE FOR THE CHAIR (§5 F-1): the row's always-instantiated service `Emergency defense` (`on: true, p: 1.0`, `institutionServices.js:836`) reads "Armed citizen response to external threats and raids", so the word is on the engine's own row; the table as ratified still lists arms NOT ENTAILED and the refuters read the table. Until the chair rules, no face says "armed" or "under arms".
4. "on their own ground": TWO readings. As LOCATION (the militia turns out at home, for the town's own defence): LICENSED as definitional (every row: "against local threats", "community defense", "defend town"). As TERRAIN ADVANTAGE (they know the ground; the ground favours them): UNLICENSED, a competence claim (D-8 NOT ENTAILED: competence) and a terrain read this pool does not carry (no `terrainType`/`terrainKey` on the card). Layer NONE (the place; no institution noun). The shipped pairing with "counts for something" forces the advantage reading.
5. "which counts for something against a disorganized raid": (a) the which-clause itself is REFUSED (R-DA-03; no which-clause; wall 6). (b) "counts for something" is a RATING of effectiveness: UNLICENSED, a verdict with no rating field (MOVE-GRAMMAR §1.3 VERDICT; D-8 NOT ENTAILED: competence) and a standpoint the card refuses. (c) "a raid" as what the militia musters against: LICENSED as the row's recorded purpose (village desc "Musters for raids and monster incursions"; the service "external threats and raids", `p: 1.0`; hamlet "against local threats"). Layer NONE (an event class the row names; no external body is named by "a raid"). (d) "disorganized": UNLICENSED, an attribute of the raider no field holds.
6. "and for nothing at all against a disciplined force": UNLICENSED on four grounds. A TOTALITY ("nothing at all"); a FORECAST of an engagement the record never runs (state never fate; the edge is subjunctive at most); a SECOND CIVIC OBJECT OF THE CLASS `force` (the card's may-NOT line): "a disciplined force" is an EXTERNAL BODY with no field (`{counterpart}` unfilled on this desk; W25), so its layer (EXTERNAL BODY) does not match the read (BODY, the town's own); and a CONTRAST whose rejected alternative names no sibling key or band (R-DA-02: the siblings are the town's OWN garrison or walls, never an enemy army). Layer EXTERNAL BODY, mismatched.

**(4) The reads the rewrite MUST state (all of them), plus every LICENSED claim of the shipped sentence:**

- R1 walls ABSENT: no wall stands around `{settlement}`. Stated FLAT as a LACK (R-DA-02: the first half only, no completing "but"); NEVER the opener of the unit (wall 3; the spine is first in the passage, so never the first clause of a face); NEVER adjacent to R3's absence (wall 3: no two ABSENCE moves side by side). Safe spellings: "no wall", "nothing built around it", "has built nothing around itself" (A-7: "what the town has built" is true of every member, so its negation is exact); NOT "no perimeter"/"no line" as the generic (E-6/A-7: perimeter is false of a citadel, and "the line" is a force word on this desk where the pool reads a force).
- R2 militia PRESENT: a citizen militia stands at `{settlement}`. Safe spellings: "the militia", "a citizen militia", "the town's own people who turn out", "townspeople, part-time", "the militia turns out / musters" (definitional). NOT "the watch" (not read; W13), NOT "the guard" (struck), NOT "the muster roll"/"the roll" as a source (R-vi; the budget is zero here), NOT "soldiers" (D-7: soldiers are the garrison's word; here none).
- R3 garrison ABSENT: no professional garrison. LICENSED by the key's branch; recommended in at least one face of each variant, in one of two lawful forms: (i) a LACK, flat, separated from R1 by R2 ("There is no garrison" never beside "no wall"); or (ii) a SIBLING-LICENSED CONTRAST, since the sibling key `force with NO walls` = `'no walls, professional garrison'` names the rejected alternative ("a citizen militia, not a professional garrison"; "no professionals" via the sibling's own word), never fronted as the subject, and the closing move of at most ONE variant in the pool (wall 5). NEVER "the only force" / "its force is the militia" (a totality over an OPEN column: the key reads garrison and militia, not the watch, mercenary, charter or magicDef buckets; a charter hall may stand at hamlet/village; C4).
- The shipped sentence's LICENSED claims to carry forward: the militia can be raised / turns out (claim 1); "citizens" (claim 2); on its own ground as the PLACE it turns out (claim 4, location reading); a raid as what it musters against (claim 5c).
- Entailments a face MAY add without a second field (W9: may, never must; the density floor counts R1 to R3, not these): townspeople; part-time (constant across the three rows: bake-able); raising them takes them off other work (D-8 HOLDS); "not full-time soldiery" as a condition of the service (never "nobody does it full-time", a totality over persons). NOT bake-able: "drill" (hamlet row only; tier-conditional; the town row lacks it); "an obligation" (town row only); "the roll" (conditional on `Muster training`, and uncitable anyway).

**(5) The angle's stance (ledger, this pool):** the office states the three standing facts as entered and MEASURES nothing here, because the card carries no count, band, gate or score: it may use the office's formula ("entered as standing", "carried on the record as ...", R-vi) and the plain civic noun, and it CITES NOTHING (W8: the ledger enters and measures, and cites nothing; W24: the angle licenses no record noun). From the block's PROVENANCE line it may write a CAPABILITY clause on presence ("a militia turns out; there is no wall for it to stand behind") and never a historical one ("has turned raids away"). It may NOT rate the militia against a raid or an army, compare it with a professional force except through the sibling key's word, forecast an engagement, or name a tier, a count, a season, pay or wages (no gate is read: W16 does not apply, and "wages" would be a second fact).

**(6) Turns worth keeping (lawful under the card, verbatim, the density floor):**

- "on their own ground" — lawful ONLY on the location reading (the militia turns out on the town's own ground); a face may carry it as it stands if the surrounding clause makes the place, not the advantage, its sense (e.g. "turns out on its own ground"). If the drafter cannot hold the location reading, drop it: the advantage reading is a competence claim.
- "citizens" — lawful (the recorded name's word).
- No other clause of v1 is lawful as it stands: "armed" (F-1 pending), "which counts for something", "disorganized", "for nothing at all against a disciplined force" all fall.

**(7) What would make the rewrite a REGRESSION here:**

- An INVENTORY LINE ("{settlement} has a militia and no walls."): R1 and R2 stated with no angle, no capability clause, no third read (ADDENDUM 7 rule 3).
- Losing R1 or R2 from any face; losing R3 from every face of the variant (the "only" of the pool key is the key's, not the town's: but the garrison's absence is what the key means and a variant that never says it has dropped a licensed read).
- Keeping the rating ("counts for something", "effective", "credible"), the totality ("nothing at all", "the only force", "nobody"), the external army, or the which-clause: each a refuter FAIL.
- Keeping "armed" while F-1 is unruled.
- A face that opens on the walls' absence (wall 3) or on `{settlement}` (T-F8: a sentence face may not open on a proper-typed slot; the parent row may, the faces may not).
- "no wall" and "no garrison" side by side (wall 3), or a lack completed with "but" (R-DA-02).
- The ledger citing the roll or "the books" (R-vi, W24; the budget is zero on this key).
- A tier word, a count of the militia, pay or wages, a season, "the watch", "the guard", "soldiers", "the line" as the wall word, terrain or "the country" as a read (none is on the card).
- The four faces as synonym swaps of one construction (ADDENDUM 7 rule 4; A5), or a second face borrowing the street's or the visitor's construction (W4).

---

## Variant 2 `[street]`

**(2) Shipped, verbatim:** The town knows its own country and knows that knowing it is not an answer to a professional army.

**(3) Every claim, one per line, with licence and referent layer (the read's layer is BODY):**

1. "The town knows its own country": UNLICENSED. A BELIEF FRAME (R-DA-13's belief-frame floor is zero; the register card: no assigned reaction, no persona); "the town" as a knowing collective agent is the fused-agent shape of D-F16/D-F18 (W23); "its own country" is a terrain or country read this pool does not carry (no `terrainType`, no `monsterThreat`; W2 scopes the threat read to the country, but there is no threat read here at all). Layer NONE (the town as agent; the country as a place): no institution noun, and an agent the read does not license. The only licensed residue is the militia's LOCAL character (R2: "against local threats", "community defense"), which the sentence never states.
2. "and knows that knowing it is not an answer to a professional army": UNLICENSED. A second BELIEF FRAME; a MAXIM in the maxim's form (R-DA-12, the generalisation test); a RATING (no rating field); an EXTERNAL BODY ("a professional army") with no field (W25; the card's "another civic object of the class `force`"); a FORECAST of an engagement. Layer EXTERNAL BODY, mismatched with the read. The contrast is not sibling-licensed (the sibling keys name the town's own garrison, not an enemy army).
3. Implicit in the whole: the town's defence is its own people rather than professionals. LICENSED only in the sibling-contrast form (R3 via the sibling key's word "professional garrison"), which the shipped sentence never reaches; as written it is carried by an army the fields do not hold.

Nothing in v2 is licensed as it stands. R1 (no wall) and R2 (the militia) are ABSENT from the shipped sentence altogether: it fails the skeleton rule twice before its unlicensed claims are counted.

**(4) The reads the rewrite MUST state:** R1 walls ABSENT; R2 militia PRESENT; R3 garrison ABSENT (licensed; recommended; the two lawful forms of v1 §4). Plus the licensed claims of the shipped sentence: none. The weight of the two dropped belief frames is replaced with LICENSED SPECIFICITY (ADDENDUM 7 rule 2), from the row and the entailment table: the militia is the town's own people (townspeople; "citizens"); it is part-time; raising it takes people off their other work (D-8 HOLDS: the street's own material, since the street sees the work the militia comes from); it turns out when trouble comes near (the hamlet variant's own phrase, definitional: the militia musters); there is no wall for it to stand behind (R1 as a capability clause under the block's PROVENANCE fence). Entailments MAY, never must (W9).

**(5) The angle's stance (street, this pool):** the street states the fact in the plain terms of the town's own people and in what the street can SEE: who turns out (townspeople, not professionals), what they leave to do it (their own work), what there is to stand behind (nothing built), and that the service is part-time. It may NOT put a belief, a knowledge or an opinion in "the town's" mouth ("the town knows", "the town does not pretend", "everybody here can state the plan"): those are belief frames and totalities over persons; it may NOT rate the militia, name an enemy army, state a plan or a policy (a cause), or generalise into a maxim. A street face is still the clerk's third person: no "you", no "we", no quoted voice (R-DA-01).

**(6) Turns worth keeping (lawful, verbatim):** NONE. No clause of the shipped v2 is lawful under the card. The density floor therefore counts the row's reads (R1, R2, R3) and the licensed entailments above, not the shipped wording (ADDENDUM 6: only the unlicensed part of a shipped sentence is dropped; here that is the whole of it).

**(7) What would make the rewrite a REGRESSION here:**

- Any belief or knowledge frame on "the town" or its people ("knows", "understands", "does not pretend", "has learned"), any maxim, any rating, any army.
- An inventory line in the street's tag (the street tag realised by order alone: R-iv's principle, applied to the street: the stance must be visible in what the sentence sees, not in its tag).
- The street collapsing onto the ledger's construction or the visitor's (W4; the construction contract).
- A totality over persons ("everybody", "nobody does it full-time", "all the able-bodied": the town row's "All able-bodied citizens" is that row's own text, not a licence for a face at hamlet/village).
- "the community" as the body word at a town-tier import (the engine's generic is below town only); prefer "the town's own people" / "townspeople".
- Losing R1 or R2; both absences adjacent; a face opening on an absence or on `{settlement}`.
- A cause for the arrangement ("because it is cheap", "because nobody has come"): the card refuses a cause; D-F16/D-F17 are the shipped breaches of this shape on the same desk.

---

## Variant 3 `[visitor]`

**(2) Shipped, verbatim:** A stranger at {settlement} meets armed townspeople who are entirely competent on their own ground and have never stood in a line with anybody.

**(3) Every claim, one per line, with licence and referent layer (the read's layer is BODY):**

1. "A stranger at {settlement}": the visitor's eye (W27: a stance, never a referent; it may SEE, never act, decide, be told or be given a name). Layer NONE (a stance marker). Lawful as a frame.
2. "meets": CONDITIONAL. As an encounter that is a SEEING ("finds", "comes upon", "sees"), lawful under W27; as an interaction (is met, is spoken to, is stopped), the stranger ACTS and is acted on, which W27 refuses. The safe verbs are "sees", "finds", "passes". A drafter keeping "meets" must make it the eye's word.
3. "armed": UNLICENSED (as v1 claim 3: ENTAILMENT D-8 NOT ENTAILED arms; F-1 recorded for the chair). Layer BODY attribute.
4. "townspeople": LICENSED (D-8 HOLDS: townspeople, part-time). Layer BODY at the person-plural grain. Matches the read. This is the one always-safe plural for this key (the referent table's "the soldiers / the men" are the paid military's words and do not fit a militia; "the town's own people" is the other).
5. "who are entirely competent on their own ground": UNLICENSED. "competent" is D-8 NOT ENTAILED (competence); "entirely" is a totality; "on their own ground" is here the advantage reading (v1 claim 4). Also a which/who-tail carrying a second, unlicensed fact (R-DA-03's shape). Layer BODY attribute, unlicensed.
6. "and have never stood in a line with anybody": UNLICENSED. A HISTORY claim on a standing field (R-DST-B: a standing configuration field licenses a structural clause, never a historical one; D-8 NOT ENTAILED: "ever mustered", and its negation is the same read); "never" a totality over time; "anybody" a TOTALITY OVER PERSONS (a REFUSED COLUMN on the card); "a line" a military formation no field holds. Layer NONE (a formation) with a person-totality inside it. The licensed KERNEL the clause was reaching for is the militia's part-time, non-professional character: "the service is part-time" (constant across the class) and "no professional garrison" (R3, the sibling's word), both structural, neither historical.

**(4) The reads the rewrite MUST state:** R1 walls ABSENT (the visitor's strongest licensed sight: a wall is visible and there is none; "nothing built around the town"; the stranger comes in past no wall); R2 militia PRESENT (what the stranger can SEE of a militia: the town's own people at their ordinary work, who would turn out, part-time; NOT a body drawn up, NOT arms, NOT drill, which is tier-conditional and an activity the eye is not licensed to have witnessed); R3 garrison ABSENT (no soldiers' quarters to see: the garrison bucket includes `barracks`, so "no barracks" is exact as a LACK; or the sibling contrast "no professionals"; never beside R1's absence). Plus the shipped sentence's LICENSED claims: the visitor frame (claim 1); "townspeople" (claim 4); and, as the licensed kernel of claim 6, "part-time" / "not full-time soldiery" as a condition of the service. Entailments MAY: raising them takes them off other work (this is what a stranger's eye can hold: the defenders are at their work).

**(5) The angle's stance (visitor, this pool):** a stranger's eye on the town as it stands: it sees no wall and no soldiers' quarters, and sees the town's own people at their work; it may carry the standing state ("what stands at {settlement} against a raid is its own people, part-time") and never the town's act, a judgment of competence, an encounter as an interaction, a name, a count, or anything told to it (W27, W8's visitor clause by analogy: the visitor carries the state only as the thing's standing state, never as an accounts fact or the town's act). It may NOT say what would happen in a fight (a forecast), nor that the people are or are not soldierly (competence), nor that they have or have not fought (history).

**(6) Turns worth keeping (lawful, verbatim):**

- "A stranger at {settlement}" — the frame is lawful (a face may open on "A stranger", which is not a proper-typed slot; T-F8 is satisfied) and is the visitor's own opener in five of this block's pools; keep it in at most ONE face of this variant so the family is not four synonym swaps (A5), and vary the eye's verb across the others ("finds", "sees", "passes").
- "townspeople" — lawful; the safe plural for this key.
- "on their own ground" — lawful only on the location reading (as v1); here the shipped clause is the advantage reading, so it is NOT kept as it stands in v3.

**(7) What would make the rewrite a REGRESSION here:**

- "armed", "competent", "entirely", "never", "anybody", "a line": any kept.
- The stranger acting or being acted on ("is met", "is told", "is stopped at the gate": there is no gate, and the visitor is an eye).
- A visitor face with no sight in it (an inventory line under the visitor tag; R-iv's principle: the tag is realised by what the eye holds, not by the label).
- Losing R1 (the one thing a stranger most plainly sees here) or R2.
- Seeing what is not visible: a militia drawn up, drilling (tier-conditional), a roll, a count.
- The visitor borrowing the ledger's formula ("entered as standing") or the street's work-clause construction wholesale (W4).
- A face opening on `{settlement}` (T-F8) or on the absence (wall 3); the two absences adjacent.
- "the gate", "the walls" as a place the stranger is at (the walls are ABSENT on this key; D-F7's imported gate is the same desk's shipped breach).

---

## 5. Pool-level notes and fences (for the drafter, the refuters and the chair)

- F-1 (RECORDED FOR THE CHAIR, vetoable; not acted): "armed" on a `Citizen militia`. The ratified ENTAILMENT-TABLE D-8 lists arms NOT ENTAILED; the row's always-instantiated service `Emergency defense` (`on: true, p: 1.0`, `institutionServices.js:836`) reads "Armed citizen response to external threats and raids". The marker tags "armed" UNLICENSED per the table and asks the chair whether the `p: 1.0` service desc licenses the bare word on this key (it would license "armed" only, never "arms" as objects, a count, or a kind of weapon). Until ruled, no face says it; the drafter loses nothing that R2 does not carry.
- F-2 THE TOTALITY IN THE POOL KEY: "militia only" is the annex's key, not a licence. The key reads garrison and militia; the watch, mercenary, charter and magicDef buckets are not read; a hamlet or village may hold a charter hall beside its militia. "The only force", "its force is its militia", "no other force" are totalities over an open column (C4) and FAIL. The lawful forms of R3 are the flat LACK ("no garrison", "no barracks": the garrison bucket's own rows) and the sibling-key CONTRAST ("a citizen militia, not a professional garrison").
- F-3 TWO ABSENCES ON ONE KEY (wall 3): R1 and R3 are both LACK moves. Never adjacent; never the opener; never completed with "but". The natural order is R2 first (the militia stands), then one absence, with the other carried in the sibling-contrast form or in a later face. The spine is first in the composed unit, so a face's FIRST clause is the unit's opener.
- F-4 THE THREAD (MOVE-GRAMMAR §1.4.1; R-i): where a face runs to two sentences, the second carries a noun forward from the first (the militia, the wall that is not there, the town's own people). Modifier mounts are 0 on this key today, so the passage is the spine alone; write each face so it reads well followed by any sibling modifier the census later attaches (the composer orders by salience, the writer cannot see the place).
- F-5 FACES DO NOT OPEN ON `{settlement}` (ARCH §2.5, T-F8: a sentence face opening on a proper-typed slot of the block's bag is refused). The shipped v1 and v3 parent rows open on or near the slot; the four faces of each variant must not. "A stranger at {settlement}" is lawful (opens on "A").
- F-6 THE SLOTS: `{settlement}` is the only filled slot; a face naming `{band}` or `{route}` drops (the bag: FILLED `{settlement}` only). No `{defwork}` on this key (no wall).
- F-7 NO TIER, NO GATE, NO SCORE: the card carries no band, no `economicGates.military`, no `scores.military`. "Village", "a small place", "cannot pay", "wages", "underfunded", "WEAK" are all second facts on this key. The military score band is DS-DEF-1's cell and the pay gate DS-DEF-11's; DS-DEF-5's `militia PRESENT (no garrison)` cell composes BESIDE this row on the same tab (R-DST-A: never the same cell twice; this row's job is the invasion assessment's keyed state, DS-DEF-5's the force lens).
- F-8 SAME-PAGE COHERENCE (C7): on any town that fires this row, the Beasts row of the same page reads `force = garrison || militia` TRUE with no perimeter (its "force without a perimeter" or plagued no-perimeter branch), and DS-DEF-5 reads `militia PRESENT (no garrison)`. A face here must not say "no force", "nothing organized", "no defence" (contradicts R2 and both siblings) nor assert a wall or a gate anywhere. The `Internal Security` row on the same page may name a court or gaol; this row names neither.
- F-9 THE RECEIPT'S OWN STRING is not a licence: `threatAssessment.js:145-146` ("Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force.") is the engine's chrome for the same branch and is outside the corpus (OW-20). Every one of its three claims beyond the row's presence is a rating, a competence or an external body; the rewrite does not inherit them.
- F-10 CUSTOM CONTENT: a custom-content militia or wall never reaches a bucket (R-E; C-12), so a town with a custom wall reads "no walls" here. A wiring row (OW-22, owner-adjacent), not a writer's fault; the writer writes R1 as the desk reads it.
- F-11 WORDS REFUSED ON THIS KEY, listed once: the watch (W13; not read; at town via import a `Town watch` may even stand beside the militia, and the pool does not know), the guard (struck, ADDENDUM 13 A.5), soldiers / the men (the garrison's plural; D-7), the line / the perimeter as the wall generic (E-6, A-7), the muster roll / the roll / the books as a source (R-vi; W24; the budget is zero here), the country / the ground as terrain (no read), stone / timber (W11; no wall at all), the community at a town-tier import (the engine's generic is below town), "the town" as a knower, decider or actor (W22, W23), any enemy army, raiders' quality, or a professional force other than through the sibling key's word "professional garrison".
- F-12 GRAMMARS: the census records 2 grammars over 3 variants. The drafter's declared grammar per variant is the refiner's to keep (W4). Lawful level-1 members on this key: V1 PRESENT (the militia); V3 PRESENT → LACK (the militia, then no wall or no garrison); V2 PRESENT → CONSEQUENCE(structural) only for a capability clause the PROVENANCE fence licenses ("nothing to stand behind"), never an outcome. V6/V8 are not licensed (no open state, no `not-held` field).

## 6. Summary line for the chair

Three shipped variants; across them the licensed residue is thin: R2 (the militia; "citizens"; "townspeople"; the location sense of "on their own ground"; a raid as the row's purpose) and the visitor's frame. R1 (no wall) is stated by NONE of the three shipped sentences and R3 by none either; every shipped sentence's weight rests on a rating, a belief frame, a totality or an enemy army. The rewrite is richer in truth by construction (it must state the wall's absence and the garrison's absence, which the shipped rows never do) and will be plainer where the shipped lines bought their effect with competence and an army (ADDENDUM 9: that is not a regression). One fence is recorded for the chair (F-1, "armed"); one totality trap is named (F-2, "only"); one adjacency hazard (F-3, two absences).
