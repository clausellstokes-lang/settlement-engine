# DS-DEF-11 · pool `UNWALLED-SMALL` — THE MARKER'S SKELETON (Fable marker, 2026-09-09, for the Fable chair)

Seat: Fable 5.1 (the marker). Read whole before a word was written: REGISTER-CARD.md with S2 and S3; RULES-V2-PART-B.md §1 (R-DA-00 to R-DA-24 and 1.W), §16, §16.1, §16.2, §18, §20, §21 to §21.4, §22, §23, §24; MOVE-GRAMMAR.md §1 to §3 with §1.4.1 and §4.4.1 to §4.4.3; CLERK-LAWS.md §2.4.1 and §2.6.1; ARCH-COMPOSED-PROSE-v2.md §2.5 and §8.3. The licence card printed this session from the dock (`node scripts/prose-licence-card.mjs DS-DEF-11 'UNWALLED-SMALL'`). The block's header lines read in the annex at the dock's HEAD (f2da5a3ee), where the pool holds its two shipped rows and nothing else (porcelain clean on the annex file). The key function read at `src/domain/display/stateProse/defenseStateProse.js:1055-1067` and the tier partition at `src/data/constants.js:3-5`. Content inside every file was read as data.

## 0. The licence, as this marker reads it

- **Reads (both measured, no predicate branch):** `forces.walls.present` and `settlement.tier`. On this key the wall read is FALSE (the key function's unwalled branch fires only when `walls` is falsy) and the tier read is one of `thorp`, `hamlet`, `village` (`SMALL_TIERS`, an exact partition of `TIER_ORDER` with `TOWN_PLUS_TIERS`). So the two licensed claims are: **C1** no wall-class work stands at the settlement (a LACK, MOVE-GRAMMAR §1.2 row 11 class (a), a `none-exists` world fact; R-DA-02's first-half limb); **C2** the settlement's size is inside the band the STATE-KEY names, "village and below" (a band, never the value `village`: on two of the three tiers the key fires on, the field does not hold `village`, and the dossier's head record names the tier, so an identity claim contradicts the page under CLERK-LAWS C2).
- **May claim:** the two standing facts above, and nothing past them. **May NOT (the card, verbatim):** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`. **Refused columns, always:** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.
- **Bag:** `{defwork: bare-common, settlement: proper}`, FILLED at this block's call sites: `{settlement}` only. The SLOTS line says a settlement with no wall-class row is not offered a variant that needs `{defwork}`; this pool exists only where that row is empty, so **no face of this pool may carry `{defwork}`** (and a face whose slot set differs from its parent's is refused by the annex grammar, ARCH §2.5).
- **Role spine, form sentence, no relation, no attach, no move declared.** Angle `street visitor` (the two shipped tags). Echo: spine mounts 2 on the defense tab (the echo table is keyed on the root `forces`, coarser than this pool's read). Covert: no. Audience: player, no mark.
- **Source:** muster, standing LICENSED, so a citation is *licensable* here; but §24's ceiling is one citation per unit and only for one of S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power), and none of the three holds for a flat absence of walls read from a standing field. A face that cites the muster for "no wall" is a citation habit (a refuter's finding under §24), and a spine of this block does not cite the office's own books (§4.4.3). **Recommended provenance budget for this pool: zero.**
- **Provenance line of the block, applied to this key:** the enclosure mechanism's two halves (the threat side, the purse side) are structural reads of live fields for the WALLED keys; on the unwalled branch the key function reads neither `monsterThreat` nor the military gate, and the card lists neither. So a face here may say nothing of threat, danger, safety, coin, upkeep, watch or muster. The one historical clause the block might want (WHEN the wall was raised, or was never raised) has no backing fact and is deliberately absent: R-DST-B forbids a standing field licensing a historical clause, so "never walled", "has never had", "was not built" are all refused; the lawful tense is the present standing condition ("no wall stands", "goes unwalled", "is not a walled place").
- **Two open rulings the chair carried from attempt 3 that bind the writer's caution here** (JUDGMENT.md §6 item 8, read as data): (i) whether MOVE-GRAMMAR wall 3 ("ABSENCE never opens") covers the world LACK of R-DA-02's first-half limb; the sibling-pool practice under that open question was to keep the LACK second in every row of this pool. (ii) a fronted nominal absolute that puts the tier before the subject and the absence in the predicate ("no bigger than a village, {settlement} is a place without a wall") was ruled to open a cause by implicature and fired rule 4. Both are recorded below as regression edges, not as new law.

## 1. Variant 1 — `[street]`

### 1.1 The shipped sentence, verbatim

`{settlement} is too small to wall and knows it; the town's safety is its neighbours, its distance, and its unimportance.`

### 1.2 Every claim it makes, one per line

- `{settlement}` is small (a size inside the low band) — **LICENSED** `settlement.tier` (as the band "village and below"; the word "small" is the band as a measurement in words, R-DA-11, and does not name the value).
- `{settlement}` has no wall (carried by "to wall", "unwalled" as the standing condition) — **LICENSED** `forces.walls.present` = false (C1, the LACK).
- The smallness is WHY there is no wall ("too small to wall") — **UNLICENSED: a cause** (the card's may NOT; the key holds two independent reads and no edge joins them; the RELATION TABLE has no row for a spine, ARCH §4.5).
- The settlement is too small to be *able* to wall (capacity, affordability) — **UNLICENSED: a second fact** (a capacity fact the field does not hold, MOVE-GRAMMAR row 1's may-NOT column; the purse side is not read on this key).
- The town knows it ("and knows it") — **UNLICENSED: a belief frame and a standpoint** (no field carries what the town knows; R-DA-13's belief-frame floor; the register card's "no assigned reaction"); also **a totality over persons** (the town as one knowing mind; a REFUSED COLUMN).
- The settlement is a town ("the town's safety") — **UNLICENSED: a value the band excludes** (`town` is a member of `TOWN_PLUS_TIERS`; on every tier this key fires on, the head record contradicts it; CLERK-LAWS C2 and R-DA-22 one term for one thing: in this pool the tier vocabulary makes "town" a value claim, not a generic noun).
- The settlement is safe ("the town's safety is") — **UNLICENSED: a second fact and a forecast in a noun** (no safety, threat or danger field is read on this key; "safety" asserts that harm does not come, which is the future taken as a fate, A2 and THE PROMISE).
- Its safety comes from its neighbours — **UNLICENSED: a cause and a second fact** (neighbours are a GEOGRAPHY move licensed only by a neighbour field, by name; none is read here).
- Its safety comes from its distance (remoteness) — **UNLICENSED: a second fact** (a geography or route read the card does not list; an observable the fields do not hold).
- Its safety comes from its unimportance — **UNLICENSED: a standpoint and a verdict** (the record rates nothing; "unimportant" is an evaluative adjective on a place, R-DA-10 at zero; no field holds a settlement's importance).
- (Form, not a claim, recorded for the refuter:) "its neighbours, its distance, and its unimportance" is the habitual triad (R-DA-10's "two items or four, never habitually three"); the semicolon joins two facts into one sentence where the register card says a second fact takes its own sentence (S2 excepted only for a computed consequence of the sentence's own fact, which this is not).

### 1.3 The reads the rewrite must state (every face of this variant)

1. `forces.walls.present` = false: no wall-class work stands at `{settlement}` (C1), stated flat, as a standing condition, in the present, as a LACK of the world in the clerk's third person; never as history ("never had", "was not built"), never with a completing "but", never beside another absence.
2. `settlement.tier` in `{thorp, hamlet, village}`: the size is inside the band "village and below" (C2), stated as the band or its ceiling ("no larger than a village", "village size", "at this size"), never as the value ("is a village"), never as the sibling value ("a town").
3. Both licensed claims of the shipped sentence are exactly C1 and C2; there is no third licensed claim in the row. Each face carries both; a face carrying one is a lost read (§4 below).

### 1.4 The angle's stance, in one sentence

`[street]` is "the town's own talk about its condition" (§0b): a face may put C1 and C2 in the plain shape a resident would state them, with the place as the subject and the record's formula allowed ("no wall closes the place"), and it may NOT give the town a knowing, a feeling, a reason, a reassurance about safety or a judgment of its own importance, may not speak of neighbours, roads, distance, threat, coin or the muster, and may not name the settlement "the town" or "a village" as a value; the standpoint is a SHAPE of the sentence, never a claim (NL-1's law carried to the dossier: the stage licenses the claim, never the shape).

### 1.5 The turns worth keeping (lawful clauses, verbatim)

- **None survives whole.** Every clause of the shipped row joins a licensed noun to an unlicensed claim: "too small to wall" (a cause), "and knows it" (a belief frame), "the town's safety is" (a value and a second fact), and the triad (three second facts). The licensed residue is two bare nouns of the record: the smallness and the absent wall.
- The density floor for this variant is therefore C1 + C2 in one sentence or two short ones, nothing added; a face that lands in eight words on both reads sits at the floor and is lawful, and the ceiling (§21.1) is reached by the sharper measurement of the band and the flatter LACK, not by any word of the old row.
- A turn the old row *gestures at* and a face may lawfully carry in its own words: the band stated as a stopping point or a ceiling (a measurement in words, R-DA-11), e.g. the size stops at a village, the size reaches no further than a village. This is not a verbatim keep; it is the one thing the old row's "small" was reaching for.

### 1.6 What would make the rewrite a regression here

- **Inventory:** variant 1 stays numbered 1, tagged `[street]`, at index 0 of the pool (canonical-at-zero); its slot set is `{settlement}` on the numbered row and on every `[face]` sub-row; three `[face]` sub-rows, no more, no fewer (four wording faces per semantic variant); a face carrying `{defwork}` is a refusal; a face opening on `{settlement}` is refused on a sub-row (T-F8; the numbered row may open on it, and wall 10 allows at most one such opener per pool, so if variant 1's numbered row keeps the settlement opener, variant 2's numbered row may not).
- **A lost licensed read:** a face that states the LACK without the band, or the band without the LACK (the four faces must be claim-equal, A6 and arm C).
- **A lost lawful turn:** there is no verbatim turn to lose; the loss to watch is the band collapsing to a value ("is a village", "a village is the whole of") or to the sibling's value ("the town"), which reads as a lost read AND an added claim.
- **A dropped angle:** the tag changing; or a face whose shape is a ledger's (a roll, a count, a citation of the muster) or a visitor's (what is seen on arrival), which duplicates variant 2's standpoint and collapses the pool's angle distinctness (§0b: two variants differing only in slot fills are one for the repetition envelope).
- **A cause re-entering by shape:** "too small to wall" in any paraphrase ("small enough to go without", "no size for a wall"), or a fronted absolute that puts the tier before the subject and the absence after it (attempt 3's rule-4 trigger); a bare juxtaposition with no connective is the lawful shape, and the joint, if any, must be a word from the connectives leaf that asserts addition only.
- **A belief or a standpoint re-entering:** "knows", "thinks", "does not mind", "is content", "simply", "of course", "as it should".
- **A history re-entering:** "never walled", "has never needed", "was never built" (R-DST-B; the block's PROVENANCE line says the WHEN has no backing fact).
- **A second civic object of the class wall:** "no palisade either", "no ditch", "no gate", "no earthwork" (the card's last may-NOT; the LACK is of the class, spoken once as "wall" or "unwalled").
- **Form walls:** an em dash, an exclamation, a digit or percent, a `which` tail, a question, "I" or "you", an expletive opener ("There is no wall"), a citation habit, a triad by habit, a summarising second sentence, a second sentence that names no second field (the gate's Q arm WITHHELD on exactly this shape in attempt 3; a second sentence here may only restate the LACK or the band, never gloss them).
- **The thread:** the spine is read first; its last noun should be the civic thing a modifier can pick up (the wall's absence, the place), so a face ending on an abstraction ("its size", "its condition") hands nothing forward.

## 2. Variant 2 — `[visitor]`

### 2.1 The shipped sentence, verbatim

`No wall marks where {settlement} ends; at this size the country and the town simply agree to differ.`

### 2.2 Every claim it makes, one per line

- `{settlement}` has no wall ("No wall") — **LICENSED** `forces.walls.present` = false (C1, the LACK).
- The settlement is at a small size ("at this size") — **LICENSED** `settlement.tier` (as the band; the deictic "this size" names the band without naming a value).
- The settlement has an edge, an extent, a place where it ends, and nothing marks it ("marks where {settlement} ends") — **UNLICENSED: an observable the fields do not hold** (a spatial fact; MOVE-GRAMMAR row 1's may-NOT column names "a spatial fact the field does not hold"; no boundary, footprint or fabric field is read on this key); also **a second fact** in the card's words.
- The size is WHY the settlement is open ("at this size ... agree to differ") — **UNLICENSED: a cause** (the card's may NOT; the two reads are independent on this key).
- The country and the town agree ("agree to differ") — **UNLICENSED: a figure** (inanimate intent, R-DA-11: land does not agree) and **a totality over persons** (the town as a single will, a REFUSED COLUMN).
- The settlement is a town ("the town") — **UNLICENSED: a value the band excludes** (as in variant 1; `town` is a tier value outside `SMALL_TIERS`; CLERK-LAWS C2; R-DA-22).
- There is a "country" around the settlement distinct from it — **UNLICENSED: a second fact** (a GEOGRAPHY move with no geography field read; the mildest item on this list and folded into the figure it serves).
- The matter is simple, unremarkable, not worth pressing ("simply") — **UNLICENSED: a standpoint** (the clerk's shrug; the register card's compiler shows only through what the record holds).
- "agree to differ" as an idiom — **UNLICENSED: a maxim-shaped closer** (a life-general phrase standing in for a fact; R-DA-12's generalisation test; the gnomic closer).
- (Form, not a claim:) the LACK is the OPENING move ("No wall ...") — MOVE-GRAMMAR wall 3 says ABSENCE never opens; whether that wall reaches the world LACK of R-DA-02's first half is the chair's open ruling (i); the semicolon again joins a second fact into one sentence outside S2's exception.

### 2.3 The reads the rewrite must state (every face of this variant)

1. `forces.walls.present` = false: no wall-class work stands (C1), flat, present, a LACK of the world; under open ruling (i) the writer keeps it SECOND in every face until the chair rules otherwise.
2. `settlement.tier` in the band "village and below" (C2), as the band or its ceiling, never the value, never "town".
3. The shipped row's licensed claims are exactly C1 and C2 (the "at this size" phrase and the "No wall" phrase); no third.

### 2.4 The angle's stance, in one sentence

`[visitor]` is "what a stranger notices first, without being told" (§0b): a face may state C1 and C2 as the two things met on arrival, the absent wall and the smallness of the place, in the shape of a thing seen rather than a thing recorded (no roll, no count, no citation), and it may NOT invent what else is seen (an edge, a road, a field, houses, a gate, a ditch), may not let the land or the town intend or agree, may not say why the wall is absent, may not grade the fact ("simply", "unremarkable"), and may not hedge it as a stranger's impression (R-DA-13: no belief frame, no vague authority); the visitor's standpoint is a syntax of noticing, never a claim about the noticer or the noticed beyond the two reads.

### 2.5 The turns worth keeping (lawful clauses, verbatim)

- `at this size` — lawful as it stands: the band as a measurement in words, deictic, naming no value; a face may carry it whole, placed where it is not the joint of a cause (never "at this size, no wall": the comma-fronted form is the implicature of variant 1's rule-4 trigger; lawful as a mid-sentence or trailing phrase, e.g. "... stands unwalled at this size").
- `No wall` — lawful as a two-word noun phrase (the flat LACK); its position is the open ruling (i), so a face carries it after the size, not before.
- Nothing else in the row survives verbatim: "marks where {settlement} ends" is a spatial fact, "the country and the town simply agree to differ" is a figure carrying a cause, a standpoint and a value.
- The density floor is again C1 + C2; the ceiling is the two reads inside one noun phrase or one short predicate with the LACK landing last as the close of kind *absence* (attempt 3's best-read line put both reads in a single predicate with no joint; that SHAPE, not its words, is the ceiling to aim at, and the writer must not reproduce it verbatim, since the refined rows are not shipped and this packet quotes nothing over twelve words from any exemplar).

### 2.6 What would make the rewrite a regression here

- **Inventory:** variant 2 stays numbered 2, tagged `[visitor]`, at index 1; three `[face]` sub-rows; slot set `{settlement}` throughout; no `{defwork}`; no sub-row opening on `{settlement}`; the pool's variant count stays two and the annex is append-only (§22: the old wording leaves the product when it fails the voice, its slot survives, its text stays in the annex history).
- **A lost licensed read:** a face that states the LACK alone (the visitor "sees no wall" and says nothing of size) or the size alone.
- **A lost lawful turn:** the band-as-size turn (`at this size` or its equal) vanishing from the whole variant; it need not sit in every face, but the visitor's variant is where the size is a thing seen, and losing it flattens the angle.
- **A dropped angle:** the tag changing; a face whose standpoint is the town's own talk (variant 1's) or a ledger's; the pool's two angles must stay distinct in shape (§0b).
- **The LACK opening a face** while ruling (i) stands open; a re-cut with the LACK second costs nothing and forecloses the finding.
- **A spatial or extent fact re-entering:** "where it ends", "its edge", "the last house", "open on every side", "the road runs straight in", "open fields to the ...": every one is an observable the fields do not hold; a stranger's eye is licensed to see only the two reads.
- **A figure re-entering:** land or town agreeing, deciding, minding, trusting; "the fields come up to the doors" (a spatial fact as a figure).
- **A cause re-entering:** "at this size no wall is wanted / needed / worth the stone", "too small for a wall", any purse or threat word (the unwalled branch reads neither).
- **A value re-entering:** "the town", "the village" as identity, "a hamlet" as identity; the head record names the tier and any of the three values contradicts it on the other two tiers.
- **A hedge re-entering:** "seems", "looks", "to a stranger", "on arrival it appears" (R-DA-13's belief-frame floor; the visitor angle is a standpoint of SHAPE, not a witness whose impression is recorded).
- **A citation re-entering:** the muster cited for an absence of walls is a citation habit under §24 (no S3 reason holds); zero citations recommended for the pool.
- **The ambiguity that opens a claim:** a verb of motion or extent with the place as object ("runs to", "reaches to", "stretches to") is first read spatially and then asserts a second civic object or an extent; attempt 3's refuter failed a face on exactly this ground; the writer chooses verbs that cannot be read as a road or a boundary.
- **Form walls** as in §1.6, and the thread: the spine's close should be the civic noun (the wall's absence, the place) so a following modifier about the muster or the watch has a noun to pick up.

## 3. Pool-level notes for the writer and the refuter

- **Variant count 2, faces 8** (two numbered rows, each with three `[face]` sub-rows). The order of vids never moves; index 0 is `[street]`, index 1 is `[visitor]`.
- **Claim set of the pool, whole:** {C1: `forces.walls.present` = false, LACK; C2: `settlement.tier` in the low band, PRESENT}. Every one of the eight wordings asserts exactly these two triples and no third; the four faces of a variant differ in vocabulary or rhythm inside the voice, never in a claim (A6, arm C, the owner's four-faces rule).
- **The level-1 grammars available on this block for this key:** V1 (PRESENT alone, the compound state in one predicate) and V3 (PRESENT then LACK). V2 (a structural consequence) is not licensed: the card names no consequence field on this key. V4 (OBJECT first) is not available: the only named object of the block is `{defwork}` and the pool has none. V5, V6, V7, V8 have no licensing field here. A pool of two carries two distinct grammars (MOVE-GRAMMAR §2.1's min(k, |set|) rule), so one variant's numbered row should realise V1 and the other's V3, and the faces may vary the shape inside the grammar without changing the claim.
- **Close kinds available:** absence (no wall) and condition (unwalled; village size); the object close (the place) is thin; vary the kind across the eight wordings so the pool is not "always end on the wall" (R-DA-04; Kay 30's guard).
- **Sibling distance:** no two of the eight wordings share their first two words (A11); "the place" as the settlement's generic noun is the safe term (never "the town", never "the village" as identity); the word "wall" may recur (the office's WORD may recur, the FACT must not), but the eight should not all close on it.
- **The thread (§1.4.1):** this pool is the SPINE of the wall-rationale block, so it is always first in its composed unit; the faces are written to hand a noun forward (the wall, the place) for a modifier about the muster, the watch or the roll to pick up, and never to end on an abstraction.
- **Provenance budget for the pool:** zero citations recommended (§0 above); a face citing the muster for the LACK is a §24 finding.
- **What the old rows leave standing open:** nothing lawful. The register card asks every town to leave one civic matter standing open, stated never asked; on this key no field carries an unresolved state, so the OPEN QUESTION move is not drawable and the pool is written without it (a member with a null field is not drawn and not written empty).
