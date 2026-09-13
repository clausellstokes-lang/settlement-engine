Block DS-DEF-2 · pool key `Invasion & War: neither walls nor force` · role spine · draft round 1
Seat: Opus 5 — Fable-unvalidated. Writer's packet. The rows below replace the pool's three variant rows one for one; the typed lines of the pool are untouched and are not repeated here.

1. `[ledger]` No wall rings {settlement}, and the town keeps no force under arms.
   - `[face]` Neither garrison nor militia is kept at {settlement}, and no wall stands about the town.
   - `[face]` Works and soldiers are absent at {settlement}.
   - `[face]` The town does without a perimeter at {settlement} and without arms.
2. `[counterforce]` Against an army, {settlement} has neither wall nor force.
   - `[face]` No works oppose a force at {settlement}, and no soldiery stands in it.
   - `[face]` The way into {settlement} is barred by no wall and held by no arms.
   - `[face]` What stands against a force at {settlement} is neither works nor soldiery.
3. `[street]` The town lies open at {settlement} and keeps no soldiers.
   - `[face]` Wall and arms alike are missing from {settlement}.
   - `[face]` The place keeps no wall at {settlement} and nothing under arms.
   - `[face]` Nothing at {settlement} is walled, and nothing in it is armed.

--- NOTES

**The card's one licensed claim.** `may claim:` that the reader `invasionRowSituation(walls, garrison, militia)` selects the row `no walls, no force`, as a STANDING fact of the record. That row value is one compound fact with two limbs (no works; no armed force, professional or citizen), so a face that drops a limb under-claims and a face that adds anything over-claims. Every one of the twelve faces below asserts exactly those two limbs and nothing else, in the present, with no joint that carries a cause.

**Bag / slots.** `bag: {band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`. Every face carries `{settlement}` exactly once and no other slot, so the face set matches the parent's slot set (ARCH §2.5, the face-row refusal on a differing `{slot}` set). No face opens on `{settlement}`: T-F8 refuses a sentence face opening on a `proper`-typed slot, and R-DA-17's settlement-opener ceiling is met at zero for the pool.

**Provenance.** `source: muster · standing LICENSED`, but no face cites. Part B §24 caps provenance at one citation per unit and only for S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power); none of the three holds on a bare absence, MOVE-GRAMMAR §4.4.3 calls a citation on a fact whose holder is the office itself a finding, and the exemplar registers with raw text cite at 0 per 786 sentences. A citation here would be a habit, so the budget is spent at zero and the holder is named nowhere.

**Per face — the clause that licenses each claim.**

Variant 1 `[ledger]`
- `No wall rings {settlement}, and the town keeps no force under arms.` — "no wall" ← `may claim` (the row's walls limb); "no force under arms" ← `may claim` (the row's force limb, covering garrison and militia together); `{settlement}` ← the filled bag. One joint, comma and `and`, no cause carried (R-DA-06).
- `Neither garrison nor militia is kept at {settlement}, and no wall stands about the town.` — "garrison" and "militia" ← the reader's own parameters `invasionRowSituation(walls, garrison, militia)`, both at their zero value under the row; "no wall" ← the walls limb. Naming the two limbs of the force half keeps the face claim-equal to its siblings' "no force".
- `Works and soldiers are absent at {settlement}.` — "works" ← the walls limb; "soldiers" ← the force limb as a body, not as persons counted. Stated flat, no completing clause (R-DA-02's LACK form).
- `The town does without a perimeter at {settlement} and without arms.` — "perimeter" ← the walls limb; "arms" ← the force limb.

Variant 2 `[counterforce]`
- `Against an army, {settlement} has neither wall nor force.` — both absences ← `may claim`. The fronted phrase asserts no army, no event and no outcome; the threat class is the pool's own reader (`INVASION_ROW_POOL` under the `Invasion & War` key), not a fact added by the sentence. Present tense throughout; no `would`, so no edge and no forecast (`may NOT: a future`).
- `No works oppose a force at {settlement}, and no soldiery stands in it.` — "no works" ← walls limb; "no soldiery" ← force limb. "oppose" states what is absent, not what would happen.
- `The way into {settlement} is barred by no wall and held by no arms.` — "no wall" ← walls limb; "no arms" ← force limb. No route slot is named (the bag's `route` is RESERVED and unfilled), so "the way into" carries no geography claim beyond the town itself.
- `What stands against a force at {settlement} is neither works nor soldiery.` — both absences ← `may claim`, in a cleft that changes the rhythm without changing the claim set.

Variant 3 `[street]`
- `The town lies open at {settlement} and keeps no soldiers.` — "lies open" ← the walls limb (unwalled, stated as the town's standing condition, not as terrain); "no soldiers" ← the force limb.
- `Wall and arms alike are missing from {settlement}.` — walls limb and force limb, both ← `may claim`.
- `The place keeps no wall at {settlement} and nothing under arms.` — walls limb; force limb.
- `Nothing at {settlement} is walled, and nothing in it is armed.` — walls limb; force limb, as adjectives of the place rather than as nouns, for a fourth vocabulary.

**What each old sentence claimed, and what was dropped (the rewrite's purpose).**
- Variant 1 kept: "has no line and no force" (the row). DROPPED: "Organized aggression cannot be resisted here" (a second fact and a capability forecast — `may NOT: a second fact`, `a future`); "what preserves the town is distance, diplomacy, or being beneath notice" (a cause, and three particulars — distance, diplomacy, notice — that no field of this card holds).
- Variant 2 kept: the two absences, which the old second clause asserted obliquely. DROPPED: "Nothing has come for {settlement}" (a HISTORY claim with no event-provenance field — MOVE-GRAMMAR §1.2 row 2; `may NOT: a second fact`); "nothing about the town would stop it" (a subjunctive edge the card does not license); "The safety here is entirely a matter of nobody having wanted to" (a cause, a standpoint, and a totality over persons — the card's always-refused column).
- Variant 3 kept: the two absences, which the old sentence asserted through its "plan". DROPPED: "The town's plan for an army is to not be interesting to one" (a plan is an intent no field holds; `may NOT: a cause`, `a standpoint`); "everybody here can state the plan" (a totality over persons — always refused).
- Nothing was added to any variant. No claim in any face survives that the card does not name.

**The angle note (not a refusal).** `[counterforce]` survives as oppositional VOCABULARY only — opposing, barring, standing against — because every counterforce CLAIM the old sentence made (that no attempt has come; that an attempt would not be stopped) is a history claim or a forecast the card refuses. The three angles therefore differ in vantage and grammar, not in claim, which is what claim-equality across a rewritten pool requires; sibling distance is carried by vocabulary (works · line · perimeter · wall) and by shape (coordinate, cleft, passive, adjectival).

**Walls checked on every face.** No em dash; no exclamation; no question; no digit and no count word; no `which`-clause; no figure, no sense verb on an abstraction, no inanimate intent; no second sentence, so no summarising second beat; no belief frame, no "a stranger", no "the town knows"; no totality over persons; no future indicative and no `would` anywhere; one joint at most per face. `neither … nor` occurs in three of twelve faces and is a doubled LACK, not a CONTRAST — no alternative is rejected in favour of another, so R-DA-02's antithesis shape is not engaged.

**The thread.** These are spine rows and are read first in the composed passage, so no face picks a noun up from a predecessor. Each face is written to HAND ONE FORWARD: every face ends inside the wall/force pair (wall, arms, works, soldiery, perimeter, armed), which is the noun a `consequence` or `tension` modifier of this block attaches to, and no face closes on a pronoun (R-DA-04's pronoun-closer ceiling), so a modifier can carry the spine's own noun forward from any of the twelve without a subject jump.

**Word counts** (`{settlement}` counted as one word). Variant 1: 12 · 15 · 7 · 11. Variant 2: 9 · 13 · 14 · 12. Variant 3: 10 · 8 · 11 · 11. Range 7 to 15, one face under eight words (R-DA-06's short-line floor), none above thirty.

**Refusals: none.** All three variants are written lawful under the card; no variant is banked, and the pool's variant count, order and vids are unchanged (3 variants, vids as they stand, 12 faces).
