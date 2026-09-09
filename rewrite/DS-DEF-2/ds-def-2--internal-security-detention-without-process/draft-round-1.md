Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2, pool `Internal Security: detention without process`, DRAFT ROUND 1.
The rows below are the COMPLETE REPLACEMENT for the pool's three variant rows, ready to paste under the pool's
bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Three variants in, three variants out; the same vids,
the same order, the same angle tags; four faces each (the numbered line plus three `[face]` sub-rows).

1. `[ledger]` {settlement} keeps cells and no court.
   - `[face]` Detention is provided for at {settlement}; prosecution is not.
   - `[face]` A person may be held at {settlement} and may not be tried.
   - `[face]` A place of confinement stands at {settlement}. No court does.
2. `[visitor]` A stranger's complaint at {settlement} goes to no court.
   - `[face]` The grievance a stranger carries into {settlement} comes to a town where no court sits.
   - `[face]` A wrong reported at {settlement} is reported in a town with no court.
   - `[face]` The court a stranger would ask for at {settlement} does not exist.
3. `[street]` The town can take a person up at {settlement} and cannot take that person to court.
   - `[face]` The cells at {settlement} can be filled without a court sitting.
   - `[face]` Someone can be held at {settlement} and no court is held.
   - `[face]` A person put away at {settlement} is put away by a town with no court.

--- NOTES

**THE CARD THIS PACKET IS WRITTEN AGAINST** (printed by `node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: detention without process'`).
Clause names used below are the card's own line names.

- `reads: court (not-produced) · prison (not-produced)` — the pool's whole selecting branch. The census row confirms
  the branch is `hasPrison && !hasCourtSystem` (`branchReads: [court, prison]`, `predicate: []` because the pool is an
  `else if` limb and no key-function branch is recovered). So the branch licenses TWO standing facts and no more:
  **(P)** `prison` holds — the town has a place of confinement; **(L)** `court` does not hold — ABSENCE class (a) LACK,
  a `none-exists` world field (MOVE-GRAMMAR §1.2 row 11; R-DA-02's LACK limb).
- `may claim: that \`court\` holds, as a STANDING fact of the record` — the card's generated line names `reads[0]` only,
  the predicate being empty. It is read here as the STANDING-FACT clause over the branch's own two reads, not as a
  licence for `court` alone; every claim below cites the read it comes from.
- `bag: {band: RESERVED, route: proper, settlement: proper}` · `FILLED at this block's call sites: {settlement}` —
  every face uses `{settlement}` and no other slot.
- `source: (none) · standing SOURCE-UNRESOLVED` · `NO citation is licensed` — no face names a holder of any record.
- `may NOT: a count, a cause, a season, a future, a standpoint, a second fact`, plus the always-refused columns
  (a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim).
- `echo: spine mounts 1 (tabs: defense) · modifier mounts 0` — this pool is the DEFENSE tab's Internal Security spine.
  A1/A11: nothing below restates or contradicts the four sibling threat rows (their nouns are walls, gates, rotations,
  garrison, militia, revenue, granary, medical provision; none of those nouns appears here).

**WHAT EACH OLD SENTENCE CLAIMED, WHAT IS KEPT, WHAT IS DROPPED.**

- **Variant 1 `[ledger]`** — old: *can hold people · has no settled way of deciding whether it should · **which makes
  enforcement here a matter of who is doing it***. KEPT: (P) and (L). DROPPED: the closing clause — it is a CAUSE
  (`may NOT: a cause`), it is a second, unlicensed fact about who enforces (`may NOT: a second fact`; no role or office
  field is read here), and it is a `, which` tail (R-DA-03 / MOVE-GRAMMAR §1.4 wall 6, a hard wall of the register card).
- **Variant 2 `[visitor]`** — old: *a stranger is careful in a way he would not need to be in a town with courts · and
  cannot say precisely why*. KEPT: (L) only — the contrast names a sibling pool key (`full legal chain`,
  `court without detention`), which is the one licensed CONTRAST (R-DA-02 / wall 5). DROPPED: the stranger's carefulness
  (an assigned reaction — the register card's "no persona, no assigned reaction"; `may NOT: a standpoint`) and his not
  being able to say why (an interior state; the FEELING non-move, MOVE-GRAMMAR §1.3). **The old sentence never claimed
  (P), so no face adds it** ("never ADD a claim").
- **Variant 3 `[street]`** — old: *can put a person away · cannot say on what grounds · **and has learned not to ask on
  whose***. KEPT: (P) and (L) — "cannot say on what grounds" is (L) said as the absence of a charge. DROPPED: "has
  learned not to ask on whose" — it is a HISTORY move with no event provenance (the block's own PROVENANCE + FENCE:
  institution presence is a STANDING fact with no recorded history; R-DST-B/A6), it asserts an unrecorded civic habit
  (`may NOT: a second fact`), and "on whose" plants an interested actor no field holds.

**PER FACE — WHICH CARD CLAUSE LICENSES WHICH CLAIM.**

Variant 1 `[ledger]` (grammar V3, PRESENT → LACK; the close kind varies: absence · absence · prohibition · absence):
- v1 f1 `{settlement} keeps cells and no court.` — "keeps cells" ← `reads: prison` (P, standing). "and no court" ←
  `reads: court` (L, ABSENCE class (a)). `{settlement}` ← `bag` FILLED. This is the pool's ONE token-opening face
  (wall 10 / R-DA-17: the settlement token opens at most one variant per pool).
- v1 f2 `Detention is provided for at {settlement}; prosecution is not.` — "detention is provided for" ← `reads: prison`.
  "prosecution is not" ← `reads: court` (L; the ellipsis carries the LACK, no completing "but", R-DA-02).
- v1 f3 `A person may be held at {settlement} and may not be tried.` — "may be held" ← `reads: prison`. "may not be
  tried" ← `reads: court` (L, stated as the prohibition close, R-DA-04's close-kind set). The modal pair is a modality
  kept, never added (B-CLAIM / MOVE-GRAMMAR §3.4).
- v1 f4 `A place of confinement stands at {settlement}. No court does.` — sentence 1 ← `reads: prison`; sentence 2 ←
  `reads: court` (L). THE THREAD (§1.4.1): sentence 2 carries the verb `stands` forward and its change of subject is the
  unit's one turn outward, placed last. Two sentences, A1's ceiling.

Variant 2 `[visitor]` (one claim only; the CONTRAST is licensed by the sibling pool key, R-DA-02 / wall 5):
- v2 g1 `A stranger's complaint at {settlement} goes to no court.` — the single claim "no court" ← `reads: court` (L).
  No claim is made about the stranger beyond his arrival at the town (no assigned reaction).
- v2 g2 `The grievance a stranger carries into {settlement} comes to a town where no court sits.` — "no court sits"
  ← `reads: court` (L). "where" is not a `which` tail (wall 6 untouched).
- v2 g3 `A wrong reported at {settlement} is reported in a town with no court.` — "with no court" ← `reads: court` (L).
- v2 g4 `The court a stranger would ask for at {settlement} does not exist.` — "does not exist" ← `reads: court` (L).
  "would" is the subjunctive edge (A2), never a future indicative.

Variant 3 `[street]` (grammar V3, PRESENT → LACK; the close kind varies: prohibition · absence · absence · absence):
- v3 h1 `The town can take a person up at {settlement} and cannot take that person to court.` — "can take a person up"
  ← `reads: prison` (P, a capability clause, never a historical one — the block's PROVENANCE + FENCE). "cannot take that
  person to court" ← `reads: court` (L). THE THREAD: "a person" is carried forward as "that person".
- v3 h2 `The cells at {settlement} can be filled without a court sitting.` — "the cells can be filled" ← `reads: prison`
  (P, capability). "without a court sitting" ← `reads: court` (L).
- v3 h3 `Someone can be held at {settlement} and no court is held.` — "can be held" ← `reads: prison` (P).
  "no court is held" ← `reads: court` (L). "Someone" is an indefinite, not a quantifier over persons (the C4 arm keys on
  every / only / all / none), so the always-refused totality column is untouched.
- v3 h4 `A person put away at {settlement} is put away by a town with no court.` — "put away" ← `reads: prison` (P).
  "a town with no court" ← `reads: court` (L). THE THREAD: "put away" is carried forward inside the one sentence.

**WALLS CHECKED ACROSS ALL TWELVE FACES.** No em dash · no exclamation · no digit or percent anywhere, so none in a
connective · no `which`-clause · no question · no first or second person · no bare future indicative · no contraction ·
no citation and no named record holder (SOURCE-UNRESOLVED) · no count · no cause · no season · no forecast · no
standpoint · no exemption from a duty · no named character · no theology · no figure, no sense verb on an abstraction,
no intent given to an inanimate thing · no expletive opener (`There is` / `It is`) · no pronoun closer · no tricolon ·
slots exactly `{settlement}`. Openers are spread (twelve faces, no opener used more than twice) and only ONE face opens
with the settlement token. Sentence counts are one, except v1 f4 which is two.

**REFUSALS (a refusal is a result).**

- **R1 — variant 2 cannot be assigned a member of the closed level-1 grammar set (MOVE-GRAMMAR §2.1, V1–V8).** Its
  licensed claim set after the drop is a single LACK. The closed set carries V1 (PRESENT alone) and V3 (PRESENT → LACK)
  but no LACK-alone member, and the only way to reach V3 would be to ADD the `prison` claim the old sentence never made,
  which the rewrite forbids. The variant is written and it breaks no wall (ABSENCE class (a) LACK may stand first — the
  "never the opener" clause of MOVE-GRAMMAR §1.4 wall 3 is cited to R-DA-08, whose Grammar clause fences it to class (b)
  GAP; R-DA-02 positively contemplates the LACK as a variant's first half). What it cannot meet is grammar-set
  MEMBERSHIP. Chair act owed: either admit a LACK-alone member to the level-1 set, or rule that variant 2 may take the
  `prison` claim (an added claim, and therefore the chair's, not a writer's).
- **R2 — the pool cannot reach the two-distinct-grammars floor (MOVE-GRAMMAR §2.1, "at least two in every pool of two or
  more").** Variants 1 and 3 carry IDENTICAL licensed claim sets ((P) and (L)); they differ only in angle and register,
  so both realise V3. Giving one of them a second grammar (V2's structural consequence, V6's standing-open, V8's gap)
  would require a claim the card does not license. The pool ships at one grammar plus variant 2's unlisted shape,
  against a census that today reads `grammars: 1`. Not a wall; recorded so the floor is not read as met.

**ONE OBSERVATION FOR THE CHAIR (not a refusal, not acted on).** Variant 2 is claim-equal to itself across its four
faces, and its claim set is the LACK alone. A town that draws variant 2 therefore reads an Internal Security row that
never says the town can detain, although that is exactly the branch it was selected by. The hole is the shipped
corpus's, not the rewrite's, and closing it means adding a claim to a variant — an act above a writer's seat.
