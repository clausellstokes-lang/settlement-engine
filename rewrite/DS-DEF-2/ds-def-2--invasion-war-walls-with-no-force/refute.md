# REFUTE — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Seat: opus (refuter / verifier), for the Fable chair.
Test: brief ADDENDUM 14/18 + `../recut/CONTRADICTION-TABLE.md` §V (which governs where it and an
earlier row disagree). A face is lawful UNLESS IT CONTRADICTS THE RECORD. Silence is permission.
"The card does not license it" names no fault. Burden on the refuter: PASS where I cannot name
the field.

Instruments read whole: `card.md` (775 lines), `speakers.md`, `draft.md`,
`../recut/CONTRADICTION-TABLE.md` §V + floors 2 and 4, and — in the dock, READ ONLY —
`src/data/institutionalCatalog.js`, `src/data/institutionServices.js`,
`src/domain/display/defenseDisplay.js`, `src/generators/safetyProfile.js`,
`scripts/lib/dossier-annex-grammar.mjs`. No dock file was edited, staged, committed or run.

TWELVE RENDERINGS: 3 spine rows (face 0) + 9 `[face]` rows. All twelve judged.

---

## Per-face verdicts

| v | face | source | verdict | floor | the field / row / line | quote (≤12 w) | finding | cure |
|---|---|---|---|---|---|---|---|---|
| 1 | 0 | survey `[ledger]` | PASS | — | `threatAssessment.js:119` "Walls present but no organized military force to man them" FIRES ON EVERY PREIMAGE TOWN; key fixes walls=true/garrison=false/militia=false | "The survey finds the walls at {settlement} kept and no force" | No denier. "no force under arms" is V-27's exact grain (an ORGANISED/STANDING manning) and is the card's own named safe absence. `{settlement}` in one unit only, and not in a `[face]` sub-row (ruling 12). "the walls" is the key's own word, not a material word, so V-06 is not reached | none on the floor. Craft only: see CRAFT |
| 1 | 1 | elders | PASS | — | `Record of custom` p 0.7–0.8 on `Household elder`/`Village elder`/`Village headman`; `communityMilBase` exempt from the upkeep gate, `defenseGenerator.js:182`, `:186-192` | "The custom the elders keep says which households owe work" | Record cited to a holder that resolves below town, so F1-24 is not reached. The unpaid household baseline is the engine's own model. Second sentence is an absence over an unmodelled thing — silence is permission | none |
| 1 | 2 | hall · pair 1 · disagree | PASS | — | `defenseGenerator.js:182`, `:189-192` — ONE `milUpkeepMult` over "garrison wages, wall maintenance" together; `Town hall` required at town | "the walls are kept out of the military purse" | One purse asserted, not two. Model-true. Hall seated (town only) and the pair's partner is also town only, so no tier crossing | none on the floor. Craft: frame twinned with 1·3 — see CRAFT |
| 1 | 3 | guild · pair 1 · disagree | PASS | — | key fixes garrison=false; card §(9) "the guilds pay into the purse and want it elsewhere"; F4-02 `defenseGenerator.js:182`, `:189-192` | "and that no garrison came of it" | PASSES: the absence asserted is the ROSTER FACT (garrison=false), which §(8) names as this pool's lawful spine, and the grievance is the guilds' own stake. "came of it" leans toward F4-02's barred CHOICE framing ("the wall was kept and the men were not") without reaching it — the sentence never says the purse chose | optional hardening: "and that no garrison stands behind them" puts it beyond the F4-02 reading at no cost |
| 2 | 0 | stranger + survey `[visitor]` | PASS | — | as spine 1 | "The stranger reports the walls kept and no force under arms" | No denier. Lawful | none on the floor. Craft: predicate is spine 1 verbatim — see CRAFT |
| 2 | 1 | stranger | PASS | — | card §(9) names the picture: the stair to the parapet with someone's stores on it. No field models wall fabric geometry | "A traveller found a stair up to the walk" | No denier. Not a material word (V-06 bars "the stone ring"/"the timber line"/"the bank of earth"; a stair and a walk are neither). The pool's one object with an owner | none. Best face in the pool |
| 2 | 2 | tavern | PASS | — | `Taverns (5-20)` required at town; no field models what is said in a tavern | "one account of what the walls are for, and then another" | No denier. Two accounts reported, neither asserted | none on the floor. Craft: the face carries no content of its own — see CRAFT |
| 2 | 3 | gate | **FAIL** | **1** | `institutionalCatalog.js:1348-1354` `Town watch` **required: true**, baseChance 1, desc "Part-time guards. **Night patrol and gate duty**" · `institutionServices.js:1324` `Town watch` → **"Gate duty": on: true, p 0.8**, "Check travelers entering and leaving" · `defenseDisplay.js:346-355` `deriveArmedForces` files `inst.watch` under **`standing`**, beside garrison and militia — and `defenseProfile.institutions.watch` is IN THIS TAB'S SAME-PAGE READ SET (card §3) | "Nobody who asked him was under arms." | **THE RECORD IS THE ROW, AND THE FACE YIELDS.** Sentence 1 stands and is well seated (`Town walls`→Gate control p 1.0; `Palisade or earthworks`→Gated entry p 1.0; `Town watch`→Gate duty p 0.8). Sentence 2 is the NEGATION DIRECTION, F1-25: on the 51/128 preimage towns at town tier the body that checks travelers entering IS the required Town watch, which the engine's own armed-forces derivation groups as **standing force**. Denying arms OF THOSE PERSONS infers the key's silence onto a body a `required: true` row seats — the precise shape §V's ONE SENTENCE names ("do not infer a body into a key's silence that a `required: true` row or a same-tab sentence denies"), and the fourth member of the card §(8) family "nobody is paid to stand on it" / "nobody walks it after dark" / "no one would answer". ⚠ THE DISTINCTION FROM THE SPINES, which stand: the spines deny an ORGANISED FORCE TO MAN THE WALLS at V-27's grain, which `threatAssessment.js:119` prints on every preimage town; this face denies ARMS OF THE INDIVIDUALS ON GATE DUTY, which no sentence supports and a required row denies. Neither denier is engine prose nor a generation-time projection, so no WIRING row is available | **Cut sentence 2.** The face stands lawful and stronger as one sentence: "The stranger was stopped at the bar and asked his business before he was let through." (Between two lawful candidates the shorter one that stops sooner wins.) The drafter's own fallback — writer 2's "asked for the toll and never for anything else" — is NOT safe as a straight swap: `Palisade or earthworks` seats Gated entry and **no toll service**, so a toll is false on the palisade towns the `gate` source also seats (F1-08 cuts both ways) |
| 3 | 0 | households + survey `[street]` | PASS | — | `communityMilBase` exempt entirely, `defenseGenerator.js:186-192`; card §(7) "the wall is work they do and are not paid for" | "The households hold that keeping the walls up is their own work" | No denier. The households' unpaid baseline is the engine's own model and the card calls it this pool's richest vein. Does not collide with 1·2 (they render in different variants, and the baseline sits BELOW the funded portion, so both are model-true) | none on the floor. Craft: third carriage of the same survey clause — see CRAFT |
| 3 | 1 | elders | PASS | — | **F2-07 as re-cut**: "Age-flavour is now FREE where it does not contradict the printed age — 'older than the road', 'older than the arrangement that pays for it'"; `Record of custom` = the memory of boundaries | "where the line runs is the older argument" | Considered and REFUSED as a finding: "the older" is not F2-01 (no count, share or band restated), not F2-02 (no date or duration), and F2-07 grants this exact comparative shape by name. No printed age is contradicted | none |
| 3 | 2 | watch | **WITHHELD** | 4 (F4-02) | `defenseGenerator.js:182`, `:189-192` — ONE multiplier over "garrison wages, wall maintenance" TOGETHER · `F4-19`/`V-07`: the pay gate **does** reach the watch (`defenseGenerator.js:177-178`, `:189-191`; `fieldSynonyms.js:51` "the town's pay for its watch") · V-17 charged the identical shape ("spending on repair rather than on holding") | "the keeping the hall enters is not the same thing" | **The finding is nameable but the face does not fix the reading, so I withhold rather than fail.** Under the PURSE reading — and this pool's own face 1·2 fixes "kept/keeping" as the purse word ("the walls are kept out of the military purse") — the sentence says the hall's funded wall-keeping does not cover the watch's walk and the watch bears the difference. That is F4-02's split purse and V-17's charge. Under the RECORD reading ("the keeping the hall **enters**" = `Town hall` Record filing p 0.6) it is an administrative complaint, which is the card's own theme and lawful. Both readings are live; a contradiction that depends on the reader picking one is not a contradiction. **A CRAFT FAULT IS CHARGED AT THE FACE regardless** (ruling 20, plain language): two stacked bare relative clauses with "keeping"/"keep" repeated inside them — a game master does not read this line once | **Fix the reading, do not delete the face.** Make it plainly the RECORD, not the purse: say what the hall wrote down against what the walk costs, in one clause each, without the word that 1·2 has already spent on the purse. The watch's grievance itself is fully licensed (F4-19/V-07) and is worth keeping |
| 3 | 3 | court | PASS | — | `hasCourtSystem` keyword list includes 'town hall'; `Town hall` required at town seats the court (card §5 ⚠); `Town hall` "Dispute arbitration" p 0.8; the engine records a civil arbitration and not a criminal trial | "None of them are about who would hold them." | No denier. Wall-work obligation is civil arbitration; the court's caseload CONTENT is unmodelled, so silence is permission. "None of them" is an absence over an unmodelled set, the archiver's licensed "it is not recorded that", not an F2-01 count. Does not predicate on the Guard Captain: it says the court holds no such case, never that a person does or does not hold the wall | none |

**Source checks (rulings 13 and 15).** Every tag is in the kernel's closed `FACE_SOURCES`
— verified: `stranger · elders · hall · tavern · guild · register · muster · watch · garrison ·
gate · market · court` (`.packets/car-18c-notes.md`; `stateProseKernel.js`, refused by
`dossier-annex-grammar.mjs:234`). **`court` is in the vocabulary**, so the draft's tag is not a
projector refusal. Conditional sources (`elders` below town; `hall`, `tavern`, `guild`, `watch`,
`court` at town; `gate` where `hasGates` fires) are lawful under car 18c — the town's draw
filters faces by source. No speaker is a tier-named NPC: no Mayor, no Guard Captain, no High
Priest, no Parish Priest, no singular "the clerk", no "the elder". The Guard Captain trap is
not sprung anywhere, including 3·3, which negates a CASE rather than predicating on a person.
No source asserts a field's opposite except 2·3, charged above.

**Pair check.** One pair (V1, hall + guild, `disagree`): two different sources, one kind, both
town-only, no tier crossing. **But the kind misdescribes them** — see CRAFT.

**Floor 3.** Clean throughout: no named character's fate, nothing predicated of a deity, no
culture furniture across the eleven profiles (no thatch, no churchyard, no market green), no
tier word, no minted proper name.

**Floor 2 mechanical sweep.** No digit, no date, no season, no duration, no rate, no headcount,
no length of wall, no "a handful", no "most nights", no trend, no raising narrated, no event the
record did not run. Elapsed forms used ("came of it", "was stopped", "found") sit over the key's
own reads or over the stranger's own arrival, both licensed (ruling 11a). No em dash, no
exclamation mark, no question mark, no digit.

**Build-red claim verified.** The draft asserts 1·1's "says which households" survives the
projector's `which` wall. CONFIRMED: `dossier-annex-grammar.mjs:937` scans only the backticked
`joints` of the joint-list table, never a face row. The face is not reached by it.

---

## CRAFT — pool grain

**VERDICT: DULL.** Distinct speakers heard across the twelve renderings: **10** (survey ·
households · elders · hall · guild · stranger · tavern · gate · watch · court), so the
three-speaker floor is passed comfortably, and the pool has real stake in it — the hall defends
a line of spending, the guilds want the purse elsewhere, the watch carries a grievance, the
elders argue a boundary, the court hears who owes the work. The material is good. The
**assembly** collapses in three measurable places.

**THE COLLAPSE, NAMED:**

1. **THE SPINE TRIAD IS ONE SENTENCE.** All three spine rows carry the survey stating the same
   clause, and spines 1 and 2 are VERBATIM on the predicate — "the walls kept and no force under
   arms behind them" — differing only in who is credited and in a trailing entry move
   ("Entered here as kept" / "The survey finds the same and enters it" / "The survey finds the
   walls kept and no force under arms"). Three of twelve renderings are one sentence with the
   attribution swapped. Spine 2 is spine 1 permuted.

2. **ONE ATTRIBUTION FRAME CARRIES FOUR OF TWELVE.** "…holds / hold / says that X … and that Y"
   runs spine 3, 1·2, 1·3 and 3·2 — and 1·2 and 1·3 are ADJACENT SIBLINGS inside V1 on the
   identical frame ("The hall holds that … and that …" / "The guilds hold that … and that …"),
   against the mechanical rule that four faces in a variant are each a different sentence in
   subject, order and landing noun.

3. **V2 IS FOUR RENDERINGS ON ONE GRAMMATICAL SUBJECT.** The stranger is the subject of all
   four — "The stranger reports", "A traveller found", "the stranger was given", "The stranger
   was stopped" — two of them consecutive passives. V2 carries the pool's best image (2·1) and
   still reads as one person's afternoon rather than four things a person could notice.

**AND A CRAFT FINDING AT THE PAIR (kind misdescribes).** V1's pair is marked `disagree`, but
1·3 does not contradict 1·2: the hall says the keeping is not in dispute, and the guilds do not
dispute the keeping — they grant it and change the subject to what the purse did not buy. It is
a grievance laid beside a defence, which is `aside` or `view`, not `disagree`. A "disagree" that
agrees is a craft finding at the pool.

**THE CURE IS NARROW — this pool does not need re-writing, it needs re-cutting.**
(a) Re-cut spine 2 so the stranger reports something the survey does not already say in spine 1,
and let the survey's entry appear in ONE spine, not three. (b) Re-frame one of 1·2 / 1·3 off the
"…that X and that Y" frame — the hall's line is the one to move, since the guilds' grievance
needs its two clauses. (c) Move one V2 face off the stranger as subject: 2·2 is the candidate
(the tavern, not the stranger, can be the subject of what is said at the tavern), and doing so
also cures that face's contentlessness. (d) Re-tag the V1 pair, or give 1·3 a clause that
actually meets 1·2's "not in dispute". (e) Apply the 2·3 cut and the 3·2 re-reading above.

Against the shipped rows this replaces: the pool is NOT duller than the shipped corpus — it
drops all four of the still-false shipped clauses ("substantial works", "how relaxed the people
on it are", "takes this town with ladders", "clergy who tend the sick") and puts ten sourced
speakers with stakes where the shipped rows had a camera. The DULL verdict is about the
assembly's repetition, not about the writing's reach.

---

## WIRING rows

**None.** Both deniers behind the 2·3 FAIL are the record itself — a `required: true` catalog row
with its own service entry, and a derivation over a field in this tab's same-page read set —
not engine prose and not a generation-time projection, so the frozen-versus-live seam offers the
face no escape. The `court` source resolves inside `FACE_SOURCES`, so there is nothing to wire.
The card's own ⚠ SEAM note (machine rows read `defenseProfile.institutions.*` SNAPSHOT while a
force key reads the LIVE roster) does not bear on any finding here: the two agree at generation,
which is when the draw runs.
