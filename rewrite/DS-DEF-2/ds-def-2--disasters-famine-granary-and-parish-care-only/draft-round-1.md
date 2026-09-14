Seat: WRITER (Opus 5 — Fable-unvalidated), DS-DEF-2 · pool `Disasters & Famine: granary AND parish care only` · draft round 1 · written under brief ADDENDUM 14 (a face is lawful unless it CONTRADICTS the record; silence is permission) with the four floors and `rewrite/recut/CONTRADICTION-TABLE.md` as the only refusal instrument.

# DS-DEF-2 · `Disasters & Famine: granary AND parish care only` · DRAFT ROUND 1

Three variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]` in that order and unchanged. Each variant's numbered line is its rewritten canonical sentence; each carries three `- [face]` sub-rows beneath it. Twelve renderings. Nothing added, nothing removed, nothing merged. Slot sets inherited exactly: vid 1 and vid 3 carry `{settlement}` once and never as the opening token; **vid 2 carries no slot at all and none of its four renderings names the town by slot.**

---

## THE ROWS, ready to paste under the pool's heading

1. `[ledger]` The granary at {settlement} is for grain and the parishes are for the faith. For sickness the town keeps no house at all.
   - `[face]` Parish churches at {settlement} are in the town and so is the granary. No monastery is here, and no friary, and no hospital.
   - `[face]` Against hunger {settlement} has a building; against sickness it has parishes, and a parish is no hospital.
   - `[face]` Somebody at {settlement} holds the granary key and somebody else the parish doors, and no key in the town opens a house for the sick.
2. `[street]` Here the granary is not thought about and neither are the parishes. Where a sick household is to go is thought about, and it is not settled.
   - `[face]` Ask for the granary and it is pointed out, and the same for any of the parishes. Ask where the sick are taken and the pointing stops.
   - `[face]` People here take the granary for granted and do not take the parishes for a hospital. When a sickness comes the town prays, and the sick keep to their own beds.
   - `[face]` The town has somewhere for its grain, parishes for its faith, and no quarter anybody keeps clear of, because nothing here gathers the sick together.
3. `[visitor]` A stranger at {settlement} finds the granary without asking and the parishes without looking. What is looked for next and not found is anywhere the sick are taken.
   - `[face]` From the street at {settlement} the granary reads as one thing and the parishes as another. Neither reads as a place for the ill.
   - `[face]` Whoever comes new into {settlement} is shown the granary and sees the parish churches on the way. Of a hospital there is nothing to show.
   - `[face]` The parishes at {settlement} keep their own burial grounds, and a stranger bound for the granary passes them without remark. Nothing else in the town is set aside for what a sickness leaves.

---

## --- NOTES

### REFUSALS

**None.** All three variants are written lawful. No variant was banked as unmeetable, and no rendering was trimmed.

### WHAT WAS DROPPED FROM THE SHIPPED ROWS, AND WHY (the marker's findings, carried)

- **The care reading, in all three of its shipped vocabularies** — *clergy who tend the sick* (vid 1), *nurse* (vid 2), *a modest infirmary* (vid 3). `hasChurch` records parishes, not care; the block's set names the vid 1 clause by name as still false, and vid 3's infirmary additionally asserts a building of the very class `hasHospital` FALSE denies (F1-14 read the other way; `priorityHelpers.js:64` matches `hospital`, `monastery`, `healer`, `friary`). **No rendering above says anybody tends, nurses, treats, sees to, takes in or looks after anybody.**
- **The stock, in all three of its shipped forms** — *food stored* / *reserves against hunger* (vid 1), *can eat through a bad year* (vid 2), *a full store* (vid 3). `hasGranary` is a tier proxy and says nothing about what is inside; the live quantity is `economicState.foodSecurity.storageMonths`, which the pulse moves every tick and which the badge beside this sentence reads. **Every rendering above speaks the building's PURPOSE (`is for grain`, `somewhere for its grain`) and never its contents.** The verb `keeps` was deliberately kept off the grain in every face for this reason.
- **The predictions the pulse adjudicates** — *can eat through a bad year*, *absorb a bad harvest*. Nothing above says what the town will manage.
- **The decision** — *which of the two the town has spent its thinking on* (vid 3). The granary is `required: true, baseChance: 1` at town and city; nobody chose it. Replaced, in vid 2, by its opposite and its true form: the granary is not thought about at all.
- **The magnitudes** — *well short of*, *something better than nothing*, *a full store*, *a modest infirmary*. The read is three booleans and hands no band word. No face above carries a count, a share, a size, a fullness or a comparison of degree.
- **The colon's coordinated third fact** in vid 1. Every qualification above takes its own sentence.

### WHAT WAS KEPT

- **Vid 1's two-part shape** (what stands against hunger, then what stands against sickness) — the key's own structure.
- **Vid 1's `short of a hospital`** — kept as the claim, stripped of its magnitude, and given three further constructions of the same absence (`no monastery … no friary … no hospital`; `a parish is not a hospital`; `no key opens a house for the sick`).
- **Vid 2's two-sentence shape with the turn at the second sentence** — the pool's best structure.
- **Vid 2's prayer** — the shipped line's one wholly safe content word, kept once only (face 2c) and kept as a practice, never as an efficacy.
- **Vid 3's stranger frame and the two-leg comparison** — kept as a position, never as an appraisal, and the entry varied across the four so no two open the same way.

### LICENSING, FACE BY FACE

The card's `may claim` line licenses the reading itself: *that `disasterRowSituation(granary, hospital, church)` selects the row `granary, parish care`, as a STANDING fact of the record.* Under ADDENDUM 14 the card bounds nothing further; the clauses below are named so the chair can see which leg each claim rides on, and which claims rest on silence.

**1 · `[ledger]` · "The granary at {settlement} is for grain and the parishes are for the faith. For sickness the town keeps no house at all."** — *the granary stands*: the `hasGranary` TRUE leg (`compound.inst.hasGranary`, `priorityHelpers.js:63`). *It is for grain*: the catalog's own purpose strings for the three granary rows (`institutionalCatalog.js:925`, `:1590`, `:2505`; `economicData.js:50-88` — `grain storage`, `emergency reserves`). Purpose, not contents. *The parishes stand and are for the faith*: the `hasChurch` TRUE leg (`priorityHelpers.js:65`), whose matching rows at this pool's tiers are parish and cathedral rows with religious services (`economicData.js:390-400`). *No house for sickness*: the `hasHospital` FALSE leg, a four-name absence (hospital, monastery, friary, healer). The almshouse, which may be on the roster, is a house for the destitute, aged and disabled and not for the sick (`institutionalCatalog.js:1285`), so the claim stands across the preimage. *Silence:* nothing else.

**1 · face · "Parish churches at {settlement} are in the town and so is the granary. No monastery is here, and no friary, and no hospital."** — *the parishes are IN the town*: the tier floor (§0.5.1 of the skeleton — the granary leg puts the preimage at town, city or metropolis, so the walk-to-the-next-village church rows at thorp and hamlet cannot select this pool); `Parish churches (2-5)` and `(10-30)` are `required: true` (`institutionalCatalog.js:1260`, `:1828`). *The granary is in the town*: the TRUE leg. *No monastery, no friary, no hospital*: the FALSE leg names all three explicitly (`priorityHelpers.js:64`). This face spends the pool's most specific licensed fact as a flat list at its true count.

**1 · face · "Against hunger {settlement} has a building; against sickness it has parishes, and a parish is no hospital."** — the two TRUE legs, fronted as a contrast; the closing clause is the FALSE leg stated as the discrimination the key itself makes. The pool sits between two named sibling branches of one table (`granary, NO medical provision` and `granary AND hospital`), so the position is a fact of the record and not an appraisal.

**1 · face · "Somebody at {settlement} holds the granary key and somebody else the parish doors, and no key in the town opens a house for the sick."** — the two TRUE legs, met through an unnamed person (floor 3 as ADDENDUM 14 relaxes it; the keeper is not the singular office the tier emits, so F3-06 is not touched). The close is the FALSE leg. *Silence:* that anybody holds a key at all — the record neither carries nor denies it.

**2 · `[street]` · "Here the granary is not thought about and neither are the parishes. Where a sick household is to go is thought about, and it is not settled."** — *the ordinariness*: `required: true, baseChance: 1` on both the granary and the parish rows at town and city means neither is an acquisition, which is what the street angle actually holds. *The open matter*: the FALSE leg, written as the question the town does not close. This is the block's last paragraph on every town that reaches it, so this face is the one that leaves the whole block standing open. No slot. *Silence:* what people talk about.

**2 · face · "Ask for the granary and it is pointed out, and the same for any of the parishes. Ask where the sick are taken and the pointing stops."** — the two TRUE legs as things with an address; the FALSE leg as the question with none. No slot. No named person and no named record.

**2 · face · "People here take the granary for granted and do not take the parishes for a hospital. When a sickness comes the town prays, and the sick keep to their own beds."** — *taken for granted*: the required-row reading again. *Not a hospital*: the FALSE leg. *Prays*: a recorded civic practice, culture and not theology; the estate's own register carries it from another field (`institutionalCatalog.js:1285`, the almshouse's residents pray for their benefactors). The grammatical subject is the town, never a god, and nothing is claimed for the praying. *The sick keep to their own beds*: silence — a town of this size with no house of the medical class has nowhere to move anyone to, and no field denies it. The frame is a general conditional, so no outbreak is narrated and no outcome is predicted. No slot.

**2 · face · "The town has somewhere for its grain, parishes for its faith, and no quarter anybody keeps clear of, because nothing here gathers the sick together."** — the two TRUE legs and the FALSE leg, the third item breaking the shape of the first two. *No quarter kept clear*: silence, and the sharper reading of the same absence — a town with no house for the sick has no district a sickness is known to be in. `somewhere for its grain` is written so that it holds at city and metropolis, where the granary rows are plural (`City granaries`, `State granary complex`). No slot.

**3 · `[visitor]` · "A stranger at {settlement} finds the granary without asking and the parishes without looking. What is looked for next and not found is anywhere the sick are taken."** — the two TRUE legs as public, sited buildings a stranger meets without being told; the FALSE leg as the thing discovered by looking for it. The absence does not open the variant and no second absence sits beside it.

**3 · face · "From the street at {settlement} the granary reads as one thing and the parishes as another. Neither reads as a place for the ill."** — the two TRUE legs; the closing clause is the FALSE leg. Nothing is sized, counted or appraised, so the face holds at the town end of the preimage and at the metropolis end alike.

**3 · face · "Whoever comes new into {settlement} is shown the granary and sees the parish churches on the way. Of a hospital there is nothing to show."** — the two TRUE legs met on arrival; the FALSE leg inverted into the close. The route, the port and the carts are DS-DEF-6's surviving `Logistics & Supply` lens and are deliberately untouched here — the arrival is inside the town, never on the road to it.

**3 · face · "The parishes at {settlement} keep their own burial grounds, and a stranger bound for the granary passes them without remark. Nothing else in the town is set aside for what a sickness leaves."** — *the burial grounds*: a roster row, `required: true` at every tier in the preimage (`Parish burial grounds` at town `institutionalCatalog.js:1289`, `Burial grounds and charnel house` at city `:1835`, `Cemetery network` at metropolis `:2392`), and written as an ownership rather than a siting so it holds at all three. **This is the true shape of the parishes' recorded work where a sickness is concerned: the ground, and not the sickbed.** *Nothing else set aside*: the FALSE leg. *Silence:* that a stranger passes without remark. The face asserts no elapsed course — the grounds are kept, never filled, and no outbreak is narrated.

### THE POOL READ AS A WHOLE (the DULL check, answered before it is asked)

- **Twelve distinct openings**, no two sharing their first two words: *The granary at* · *Parish churches at* · *Against hunger* · *Somebody at* · *Here the granary* · *Ask for* · *People here* · *The town has* · *A stranger at* · *From the street* · *Whoever comes* · *The parishes at*.
- **Twelve distinct subjects and grammars**: a purpose-copula pair; a compound subject with `so is`; a fronted prepositional contrast across a semicolon; an unnamed keeper; a fronted `here` carrying its negated verb over to a second subject; a doubled imperative frame; a people-subject with a conditional turn; a three-item list whose third item breaks it and takes a `because` joint; a stranger finding; a fronted `from the street` reading; a `whoever` arrival; a parish-subject with a passing stranger.
- **One `A stranger` opener across the whole pool**, against the shipped `[visitor]` row and its siblings in this block, which open that way repeatedly.
- **The second clause does a job in every rendering** — contrast (1b, 1c, 2c, 3b), consequence (1d, 2d), a withheld direction (2b, 3a, 3c), a standing-open matter (2a), a turn outward (3d). No rendering restates its first clause, and none closes on a reassurance or a summary.
- **The nouns are spread**: granary, grain, parishes, parish churches, clergy, faith, hospital, monastery, friary, house, key, doors, quarter, beds, burial grounds, street, stranger, household. `hospital` carries four of the twelve, and it is the pool's defining absence rather than a safe-word tic.
- **The sentence count varies inside the pool** — nine renderings in two sentences and three in one, from seventeen words to thirty-three. The shipped pool was uniform at one, one and two, and uniformity of segment count inside a pool is the measured fault this rewrite exists to remove.
- **A person appears in four of the twelve** (a keeper, the people, the sick, a stranger) and not one is named.
- **One matter is left standing open** at the block's own last line (2a), which is the one place in DS-DEF-2 where that can land.

### THE THREAD

This pool is a spine at k = 0 with no modifiers, so each rendering is the whole paragraph. It is also always the block's LAST paragraph, its neighbour above being `Economic Survival` (what the town can go on paying for) or `Internal Security` (law, process and force). Every rendering therefore opens on a concrete civic thing of its own rather than on a connective or an anaphor, so none dangles off whichever paragraph precedes it; and none reaches for endurance, months, paying through or holding out, which would write the paragraph above it instead of this one.

### CARRIED FOR THE CHAIR

- The prose paragraph and the expandable row one click beneath it will now disagree about whether anybody is cared for: `threatAssessment.js:186` prints *Parish clergy provide basic wound care* and `defenseDisplay.js:237-239` prints status `Clergy care`. Those are legacy display strings, not typed fields; the block's contradiction set is the record. Recorded, not re-found. Not this lane's to fix.
- After this rewrite the row speaks the medical half as an ABSENCE rather than a provision, which widens the wording of the DS-DEF-6 C3 justification (`defenseStateProse.js:1476-1479`) against the row's actual content. The C3 block still holds on the reserve half and on the absence.
