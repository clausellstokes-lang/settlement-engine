# DRAFT ROUND 1 — DS-DEF-2 · pool `Internal Security: detention without process`

Writer: Opus 5 (Fable-unvalidated), for the Fable chair. REWRITE car 8b, block DS-DEF-2, draft round 1.
Written to `skeleton.md` (the Fable marker's analysis), the licence card printed this session, the annex rows at `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2670-2673`, the register card (S2, S3), Part B §1/§16–16.2/§18/§20–§23, MOVE-GRAMMAR §1–§3 and §4.4.1–4.4.3, CLERK-LAWS §2.4.1/§2.6.1, ARCH-COMPOSED-PROSE-v2 §2.5/§8.3, and brief ADDENDA 12 and 13 (W1–W27).
STATUS: COMPLETE — three variants, twelve faces, zero refusals.

Paste-ready rows follow: three numbered variant lines in the annex's order, vids unchanged, each with its own angle tag and exactly three `[face]` sub-rows. The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not repeated and are not touched.

---

1. `[ledger]` A person can be held at {settlement} and brought before no court.
   - `[face]` The town at {settlement} can hold people, and no court sits to try a person held.
   - `[face]` Cells at {settlement} are carried as standing, and the town keeps no court.
   - `[face]` A gaol at {settlement} can take a person in, and no court names the ground for keeping that person.
2. `[visitor]` A stranger at {settlement} finds cells to hold a person and no court to try that person.
   - `[face]` A traveller at {settlement} sees cells, and sees no court.
   - `[face]` At {settlement} a stranger comes upon cells, and finds this is not a town with a court.
   - `[face]` To a stranger at {settlement} the cells are plain, and no court is to be found.
3. `[street]` The town can put a person away at {settlement}, and no court says what for.
   - `[face]` The cells at {settlement} can keep a person, and no court can try that person.
   - `[face]` At {settlement} a person can be shut in the cells, and nothing goes before a court.
   - `[face]` People can be locked up at {settlement}, and no court has a say.

--- NOTES

**The two reads, once, with the card clause each face is licensed by.** The card prints `reads: court (not-produced)` and `reads: prison (not-produced)`, and its `may claim` line falls back to `reads[0]` because the predicate was not recovered (`predicate: []`; `internalRowPoolKey` is untabled). The engine's branch is the opposite way round and is the one every face is written to (`threatAssessment.js:144-151`; `defenseStateProse.js:506-510`; skeleton §0.2):

- **(P)** `prison` = TRUE — the card's `may claim: that <the read> holds, as a STANDING fact of the record`, taken on the read the branch asserts. Surfaces used: *can be held · can hold people · cells · a gaol · can take a person in · can keep a person · can be shut in the cells · can be locked up · put a person away*. Every one is the modal capacity D-16 ENTAILS ("people can be held"; `Small prison/stocks` `institutionalCatalog.js:1564` with `Holding cells` p 1.0, `institutionServices.js:1635`). Layer BODY, matching the read's layer (ADDENDUM 13 B rule 2).
- **(L)** `court` = FALSE — the same clause, on the second read, stated as a LACK (MOVE-GRAMMAR §1.2 row 11 class (a); R-DA-02's LACK limb). The class word is used in NEGATION ONLY, which is true of every member row the flag spans (courthouse, court buildings, democratic assembly, city hall, town hall — `priorityHelpers.js:55`). Surfaces used: *brought before no court · no court sits to try · the town keeps no court · no court names the ground · no court to try · sees no court · not a town with a court · no court is to be found · no court can try · nothing goes before a court · no court says what for · no court has a say*. Layer NONE-absence, matching. Never the opener of any face (wall 3), never twice in one face (W10), never a totality over the town's procedures (the shipped rows' 1c and 3c are dropped: see below).

The two reads are ONE keyed condition (`!hasCourtSystem && hasPrison`), so stating both is stating the key and not "a second fact" under the card's `may NOT: a second fact`. No face joins them by a cause (`may NOT: a cause`); the joint is always a bare comma-and.

**Per face — the claims it makes and the clause that licenses each.**

Variant 1 `[ledger]` (the stance: the clerk enters the fact as the record holds it; W24 — the angle licenses no record noun and no citation; the card's `source: (none) · SOURCE-UNRESOLVED` bars every citation under arm A13).

| face | claims | licence | words |
|---|---|---|---|
| line — *A person can be held at {settlement} and brought before no court.* | (P) capacity to confine; (L) no court | card `may claim` on (P); card `may claim` on (L) as a LACK; `bag: {settlement}` for the slot | 12 |
| f2 — *The town at {settlement} can hold people, and no court sits to try a person held.* | (P); (L) | as above; "can hold people" is the shipped clause kept verbatim under the density floor (§21.4; ADDENDUM 6) | 16 |
| f3 — *Cells at {settlement} are carried as standing, and the town keeps no court.* | (P); (L) | as above; "carried as standing" is the office's own formula (W7 / R-vi), not a record noun and not a citation | 13 |
| f4 — *A gaol at {settlement} can take a person in, and no court names the ground for keeping that person.* | (P); (L) | as above; "no court names the ground" is the court-bound re-cut the skeleton licenses (§1.5, §3.5) — the naming is refused of the absent court, never asserted of the town | 19 |

Variant 2 `[visitor]` (the stance: an eye passing through; W27 — the stranger may see, never act, decide, be told, or be given a name; W8 — the visitor carries a read only as a thing's standing state).

| face | claims | licence | words |
|---|---|---|---|
| line — *A stranger at {settlement} finds cells to hold a person and no court to try that person.* | the stance; (P); (L) | card `angle: … visitor` for the stance; `may claim` for both reads; the shipped opener "A stranger at {settlement}" kept verbatim (density floor) | 17 |
| f2 — *A traveller at {settlement} sees cells, and sees no court.* | the stance; (P); (L) | as above; the repeated verb is the office's licensed word-recurrence (register card: the WORD may recur, the FACT must not); the short line (R-DA-05) | 10 |
| f3 — *At {settlement} a stranger comes upon cells, and finds this is not a town with a court.* | the stance; (P); (L) | as above, plus the ONE licensed CONTRAST: the rejected alternative names the sibling pool keys `full legal chain` and `court without detention` (R-DA-02; wall 5), not fronted as the subject, and the closing move of ONE variant only in this pool. The contrast asserts nothing beyond (L) — "not a town with a court" is (L) in the sibling's frame — so the four faces stay claim-equal under arm A6 | 17 |
| f4 — *To a stranger at {settlement} the cells are plain, and no court is to be found.* | the stance; (P); (L) | as above; "to be found" is the absence SEEN, the visitor's lawful form of a LACK | 16 |

Variant 3 `[street]` (the stance: the fact in the town's own idiom; the town as subject, the plain verb, the short line).

| face | claims | licence | words |
|---|---|---|---|
| line — *The town can put a person away at {settlement}, and no court says what for.* | (P); (L) | card `may claim` on both reads; "The town can put a person away at {settlement}" is the shipped clause kept verbatim (the density floor of this variant, skeleton §3.5); "no court says what for" is the licensed court-bound re-cut of the shipped "cannot say on what grounds" | 15 |
| f2 — *The cells at {settlement} can keep a person, and no court can try that person.* | (P); (L) | as above | 15 |
| f3 — *At {settlement} a person can be shut in the cells, and nothing goes before a court.* | (P); (L) | as above; "nothing goes before a court" is a court-bound form the skeleton licenses (§0.4, §1.3, §4.1), not a totality over the town's procedures | 16 |
| f4 — *People can be locked up at {settlement}, and no court has a say.* | (P); (L) | as above; the shortest street line | 13 |

**The claims the shipped sentences made that are DROPPED (the rewrite's purpose; never re-entered by another door).**

| shipped row | dropped claim | why |
|---|---|---|
| v1 `[ledger]` | "no settled way of deciding whether it should" | a TOTALITY over the town's procedures; the flag records five building rows, not procedure (skeleton 1c). The licensed compression that replaces its weight is the court-bound lack |
| v1 | ", which makes enforcement here …" | a CAUSE (`may NOT: a cause`) and a `, which` tail (a hard wall: R-DA-03; MOVE-GRAMMAR wall 6) |
| v1 | "a matter of who is doing it" | a SECOND FACT, a STANDPOINT (`may NOT`), and a PERSON as the load-bearing referent (W22; the referent survey's D-F8/D-F9 shape) |
| v2 `[visitor]` | "is careful", "cannot say precisely why" | an assigned reaction and an interior state; the FEELING non-move (MOVE-GRAMMAR §1.3); W27 (the stranger sees, it does not feel or fail to speak) |
| v2 | "would not need to be in a town with courts" | a hypothetical conduct of a person in another town, and the belief frame "need"; the plural "courts" asserts buildings where a town hall satisfies the flag (D-F21). The CONTRAST's licensed kernel survives, singular, in v2 f3 |
| v2 | "he" | a particular no field holds (NL-4: a pronoun by `gender` only); a person invented |
| v3 `[street]` | "cannot say on what grounds" | a TOTALITY over the town's procedures (skeleton 3c); re-cut court-bound in the v3 line and kept |
| v3 | "has learned not to ask" | a HISTORY move with no event-provenance field (the block's own fence: presence is a standing fact with no recorded history; R-DST-B) and a belief frame over the town |
| v3 | "on whose" | a PERSON, or an unread POWER, as the determinant of an institutional fact (W22 / W21); no power slot and no capture read on this pool |
| v3 | the third clause | R-DA-03: a qualification is a sentence, never a tail, never a third |

**The bars checked, one line each.** W11 material — no wall or material word appears (no wall read here). W12 garrison / W13 watch / W20 layer — no watch, guard, garrison, soldier, hall, seat, council, magistrate, reeve or elder in any face; the only bodies named are the ones the two reads reach. W14 label — `hasPrison` is read at its engine meaning (the shipped row holds cells, label trap L-17), and `hasCourtSystem` is used in NEGATION ONLY, where the flag's falsity excludes every member row including the halls (label trap L-16). W15 alias — "cells", "a gaol", "a place of confinement" are the always-safe spellings (A-17); "the court" appears only inside a negation (A-16). W16 the gate's word — the upkeep gate is not a read here and no purse, wage, pay or keeping word appears. W22 person — every person noun is a patient ("a person", "people", "a person held", "that person"); no agent, decider, chooser or permission-holder; no "whoever", "somebody", "the person who", "on whose". W24 record word — none (SOURCE-UNRESOLVED); "carried as standing" is the office's formula, not a record noun. W25 external body — none. W26 visibility — `covert: no`, so every face is the player face with no mark. W27 angle tag — the stranger only sees; the ledger only enters; the street only states the town's doing. Hard walls: zero em dashes, zero exclamations, zero questions, zero digits, zero `which`-clauses, zero citations, zero future indicatives, zero totalities over persons, zero causes, zero second facts.

**Form.** Three variants, vids and order unchanged, one bracketed angle tag each, no `[plain]` marker anywhere. Twelve faces; each carries the parent's `{slot}` set exactly (`{settlement}`, once). No face opens on the slot (T-F8, taken at the skeleton's stricter reading: zero, not one in six). No two variant lines share their first two words ("A person" · "A stranger" · "The town"); no two faces of one variant open alike (ledger: A person · The town · Cells at · A gaol; visitor: A stranger · A traveller · At {settlement} · To a; street: The town · The cells · At {settlement} · People). The four faces of each variant differ in construction — the subject, the order of the reads and the landing noun — and not in vocabulary alone (W4). Close kinds vary across the pool (object · condition · absence · person); no face closes on a pronoun, a hook, a moral or a summary. Every face is one sentence, so THE THREAD at k = 0 (R-i) has nothing to bind and nothing to breach; each face reads whole after the spine's own position, which is the only mount this pool has (`sites: ["defense.threatAssessment"]`, modifier mounts 0). Word counts 10 to 19, mean 14.9, the short line present in each variant.

**REFUSALS: none.** All three variants are written and all twelve faces are lawful under the card as the writer reads it. Two rows are carried for the chair rather than acted on, both already recorded in the skeleton and neither a writer's task:
1. The card's `may claim` line prints `that court holds` on a cell the key function returns only when `court` is FALSE (skeleton §0.2). Every face here is written to the engine's branch, not to that line. A register-car row beside OW-21.
2. The shipped `[visitor]` row stated (L) alone. Under the SKELETON RULE (every variant states all of the card's licensed reads) and ADDENDUM 8 R-v (the two reads are one keyed condition), all four visitor faces state (P) as well. If the chair reads "never ADD a claim" the other way on a variant whose shipped sentence omitted one of its pool's reads, that is a ruling for the fold and this variant is the one it would move.
