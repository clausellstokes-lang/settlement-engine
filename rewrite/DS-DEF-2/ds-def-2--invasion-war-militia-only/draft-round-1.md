Seat: Opus 5 (Fable-unvalidated) — WRITER, DS-DEF-2 · pool `Invasion & War: militia only` · draft round 1.
Written under ADDENDUM 14 (a face is lawful unless it contradicts the record; silence is permission) and the four floors of `rewrite/recut/CONTRADICTION-TABLE.md`.
Three variants, vids 1 to 3, angles `[ledger]` `[street]` `[visitor]`, order and vids unchanged; four faces each (the numbered line plus three `[face]` sub-rows). Ready to paste under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`.

**`Invasion & War`: militia only**
1. `[ledger]` The muster at {settlement} can be called, and the town keeps no works to call it to. That is an answer to a raiding band and a list of names to an army in order.
   - `[face]` A raiding party is the shape of trouble the arrangement at {settlement} answers, and the answer stops there. A force under orders would find no line standing at the edge of the town.
   - `[face]` Calling the muster at {settlement} stops the work of those called, and that stopped work is the whole cost of it. The trade is a good one against a band with no plan and no trade at all against a campaign.
   - `[face]` Against war the entry for {settlement} reads a body and no works, and nothing in the record reconciles the two. Raiders meet the body, and anything that arrives in order meets the gap.
2. `[street]` The town can raise its muster and knows what the muster is for. An army under a commander is not what it is for, and that is understood here without being said.
   - `[face]` On an ordinary day the muster is invisible and those on it are at their trades. It comes out of the houses when it is called, and a force that soldiers for a living is not stopped by a thing that lives in houses.
   - `[face]` Where the muster forms is settled on the day it forms, because the town has no line and nothing to gather behind. A raiding band meets the town as it finds it, and a force with a plan does the choosing.
   - `[face]` Planning here goes as far as a band on the road and no further, and the town does not call that a failing. What it plans with is a duty on its own people, and the duty comes with no place to put them.
3. `[visitor]` A stranger comes into {settlement} without being stopped and meets armed townspeople well inside it. An army would not have to break anything to stand where he is standing.
   - `[face]` Weapons at {settlement} turn up in the hands of people who have trades, and a stranger can see where those hands go the rest of the day. None of it looks like a company under orders.
   - `[face]` Nothing bars the way into {settlement}, and a stranger is among the houses before the town has any account of him. An army coming up behind him would be stopped by exactly as much.
   - `[face]` Directions to the defence of {settlement} end at people and never at a place, because the town keeps no works to point him at. Raiders are met by the people, and a campaign asks after the place.

--- NOTES

**REFUSALS: none.** All three variants are written lawful under ADDENDUM 14's four floors. No variant is banked as unsatisfiable.

**The three reads, named once; every face below cites them by these short names.**
- **R1** `standingDefenseForces(settlement).militia.present === true` — the licensed positive: one rostered `Citizen militia`, holder MUSTER (`holderTable.js:190`). The catalogue's own words are free vocabulary: drill, muster, able-bodied residents, part-time service, obligation, raids.
- **R2** `walls.present === false` — the measured negative over the closed keyword set `wall · citadel · palisade · earthwork · inner citadel · massive walls` (`defenseInstitutionBuckets.js:84-87`), which swallows `Gates (if walled)`. No line, no bank, no gatehouse, no controlled entry point.
- **R3** `garrison.present === false` — no garrison, barracks or professional (full-time) watch.
- **CARD "may claim"**: that `invasionRowSituation(walls, garrison, militia)` selects the row `no walls, citizen militia`, as a STANDING fact of the record. The threat class of the row (`Invasion & War`) is the desk's own: an army, a campaign, a force that arrives in order, against a raiding band. The desk's legacy strings for this branch — *effective against disorganized raiders*, *no counter to a disciplined military force* (`threatAssessment.js:121-123`) — license the capability contrast every face carries.
- **SILENCE IS PERMISSION** carries everything else below that is not a claim against a field: the trades, the houses, the day's work stopped, the stranger's passage, the directions he is given.

**VARIANT 1 · `[ledger]`**
- **1 (canonical).** *can be called* — R1 stated in the capability modal the block's own fence asks for (a capability clause, never a historical one). *the town keeps no works to call it to* — R2, the LACK move, stated flat and not as the opener. *an answer to a raiding band* / *a list of names to an army in order* — the card's threat class plus the desk's two-term rating; the second term stops at capability and asserts no outcome (floor 2b kept). *a list of names* is the muster read as the roll it is; R-8 of the table licenses mentioning the roll where the holder resolves, and it does here.
- **face 2.** *the shape of trouble the arrangement at {settlement} answers* — R1 + the threat class. *the answer stops there* — the desk's "no counter", stated at the body and not at the persons in it. *no line standing at the edge of the town* — R2. No blanket denial of built fabric: only the line.
- **face 3.** *stops the work of those called* — R1's `part-time` and the community baseline the generator's own comment marks unpaid and exempt (`defenseGenerator.js:186-188`); a cost in work not done, never a bill, never a purse, never a gate's shortfall (F4-02/F4-03/F4-04 kept clear). *those called* is a body, not a census of persons (the refused-columns totality kept clear). *a band with no plan* / *a campaign* — the threat class.
- **face 4.** *the entry reads a body and no works* — R1 and R2 as one ledger row; **a body**, never a count (F2-01), and never a count of the town's forces, which would collide with the watch, mercenary and charter buckets this key cannot see. *anything that arrives in order meets the gap* — the threat class with the absence as the landing noun.

**VARIANT 2 · `[street]`** — no slot in any face; the settlement is never named (`defense.generated.js:663`, `slots: []`).
- **1 (canonical).** *can raise its muster* — R1; possessor binding is struck (W1), so *its muster* is free. *knows what the muster is for* — the town's practical grasp of its own arrangement, which is the `[street]` stance; it is not local-terrain knowledge, so the triple collision with the Beasts row above and DS-DEF-5 below is avoided in all four faces. *an army under a commander* — the threat class, naming no actor, no neighbour, no faction, no besieger.
- **face 2.** *invisible on an ordinary day* / *those on it are at their trades* — R1's `part-time` at all three catalogue tiers, as a standing condition, not an elapsed course and not a rate (no "most days", no "seldom"). *comes out of the houses when it is called* — the simple habitual present, the surviving instrument. *a force that soldiers for a living* — the threat class against R3's absent professionals.
- **face 3.** *the town has no line and nothing to gather behind* — R2. *where the muster forms is settled on the day it forms* — the consequence of R2 on R1, and silence elsewhere: nothing in the record fixes a muster ground. *a force with a plan does the choosing* — the capability contrast, no outcome asserted.
- **face 4.** *plans against a band on the road and no further* — R1 and the threat class. *a duty on its own people* — the catalogue's word is obligation; written at the body, never quantified over persons. *the duty comes with no place to put them* — R2 and R3 together (no works, no billet) as the list-without-a-place asymmetry.

**VARIANT 3 · `[visitor]`**
- **1 (canonical).** *comes into {settlement} without being stopped* — R2 taken concretely: the walls bucket's closure reaches `Gates (if walled)`, so no gate, no bar, no controlled entry point. *meets armed townspeople well inside it* — R1; *townspeople* is the discriminating noun against the garrison sibling. *An army would not have to break anything to stand where he is standing* — the subjunctive edge (A2), the threat class, and R2 stated without a blanket denial of the town's fabric. **The shipped clause *have never stood in a line with anybody* is dropped entirely** and does not survive in any form in any face: it is an elapsed course over the town's past (F2-05) and a totality over persons, and the Veteran's lodge and Free company hall the key cannot see deny it. Its lawful core — these are the town's residents and not soldiers under orders — survives as a present reading of the militia bucket against the garrison bucket in faces 1 and 2.
- **face 2.** *weapons turn up in the hands of people who have trades* — existential, never universal, so no body the key cannot see is denied. *None of it looks like a company under orders* — scoped to what the stranger sees; a capability contrast, not a denial of anyone's experience.
- **face 3.** *Nothing bars the way in* — R2. *before the town has any account of him* — a fact about the record, not a quantifier over persons, and no office or body is denied. *would be stopped by exactly as much* — subjunctive, the threat class, no outcome.
- **face 4.** *end at people and never at a place* — R1 against R2, the pool's own asymmetry from the stranger's side. *no works to point him at* — R2. *a campaign asks after the place* — the threat class as the discriminator that makes this the Invasion row and not a roster note.

**What was deliberately kept out of all twelve faces, and why.**
- *their own ground* / *its own country* / *knows the ground* — lawful, but printed by the Beasts row above on a frontier and by DS-DEF-5 below on every town; zero faces carry it (skeleton §4's largest craft problem).
- Any headcount, roster size, muster strength, drill rate, readiness or training level (F2-01; ruling R-9 puts a count in DS-DEF-5's cell).
- Any word for the town's force other than *the muster* and *the militia*'s own body: never *the guard*, *the watch*, *the garrison* (F1-01, F1-02, F1-04, F1-26, F1-27).
- Any pay, purse, wage, arrears or funding clause (F4-02, F4-03, F4-04, and the wiring row that prints *garrison pay at NN%* beneath this very row).
- Any totality over persons or exemption from a duty, including the catalogue's own *all able-bodied citizens* (the card's refused columns).
- Any prediction the pulse adjudicates: no *falls*, *is taken*, *cannot hold*, *would be overrun*. Both attacker terms stop at capability or at the subjunctive edge.
- Any named actor, besieger, neighbour, faction or crown; any minted proper name (F1-126).
- Any terrain, route, pass, height or river claim: this key reads no geography field and the preimage spans every terrain (F1-102).
- Any north-European furniture: no thatch, churchyard, market green, hearth-smoke or snow (F3-05, the finding most likely to recur; twelve culture profiles ship and no defense pool reads the profile). *Houses*, *trades*, *the road*, *the street* are culture-neutral.
- Any act by the singular office the tier emits (one Guard Captain per village-plus with a generated personality and secret, F3-06): no gatekeeper, reeve or officer is given an act anywhere.
- Any intensity word attached to the town's readiness in general: every intensity is welded to the threat class, because the badge beside the prose is computed from terrain and four buckets this key cannot see (F1-40, wiring row W-10).

**Residual risk, recorded rather than dropped.**
- **F1-30 (custom content).** A DM's custom rampart reads `walls ABSENT` to the bucket while printing on the roster; the table's guidance is "write around an absence rather than asserting it". Every face here states the absence of a **line** rather than of the town's built fabric, which is the narrowest form the pool's own key allows — but the pool is keyed on the absence and cannot be written without it. Flagged for the chair, not curable at the face.
- **Sentence count.** All twelve faces are two sentences; the shipped three were one each. Two is the register's ceiling and the skeleton's regression list bars only a third sentence, so this is inside the law; it is recorded because it is a uniform change across the pool.
