# DS-DEF-2 · pool `Beasts & Monsters: settled, nothing organized` · REWRITE draft, round 1

Writer: Opus 5 (Fable-unvalidated). Block DS-DEF-2, role **spine**, three variants in, three variants out.
Paste target: under the annex heading whose bold text reads **`Beasts & Monsters`: `settled`, nothing organized**.
The pool's typed lines (ROLE, READS, STATE-KEY, SLOTS, SECTION-TARGET, PROVENANCE + FENCE, and the bracketed angle tag on each variant) are untouched and are not repeated here. No variant is added, removed, merged or reordered; every vid and every angle tag stands as it stands.

---

## THE PASTE BLOCK (the complete replacement for the pool's variant rows)

1. `[ledger]` `[plain]` The town keeps no wall and no force under arms, and the country around {settlement} is settled.
   - `[face]` Nothing organized stands between {settlement} and the country, and nothing in that country stands against the town.
   - `[face]` Settled country lies around {settlement}. The town answers it with no wall and no muster.
   - `[face]` Against a settled country {settlement} holds no works and raises no force.
2. `[street]` `[plain]` Nothing stands at {settlement} against a settled country.
   - `[face]` The ordinary arrangement at {settlement} carries no muster, and the settled country outside carries nothing a muster would be raised against.
   - `[face]` Life at {settlement} goes on with no wall around it and no garrison in it. Beyond the town the country is settled.
   - `[face]` Neither a wall nor a militia stands at {settlement}, and the country outside holds nothing that either would meet.
3. `[visitor]` `[plain]` A stranger leaves {settlement} at any hour, past no wall and no muster, and meets nothing in the settled country beyond the town.
   - `[face]` The country beyond {settlement} is settled, and a stranger walking out into it passes neither a wall nor a garrison.
   - `[face]` Strangers come and go at {settlement} without meeting a militia, and find settled country open on every side.
   - `[face]` Between {settlement} and the settled country beyond it stands no wall, and the town keeps no force.

---

## --- NOTES

### N.0 The card, printed and read

`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: settled, nothing organized'`, run read-only in `laneRW-DEF2`:

- **role** `spine` · **reads** `beastsRowSituation(family, perimeter, force)` (via `BEASTS_ROW_POOL` in `defenseStateProse.js`) · **predicate** `=== settled country, neither`
- **bag** `{band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites `{settlement}`**
- **relation** *(a spine takes no relation)* · **seat/form** *(not a seat-taker)* / `sentence` · **move** *(none declared)* · **angle** `ledger street visitor`
- **attach** *(empty: a spine takes no attach set)* · **echo** spine mounts 1 (tabs: defense), modifier mounts 0 · **covert** `no`
- **source** `muster · standing LICENSED` — a citation of this holder is licensed where the provenance budget allows
- **may claim** that the predicate holds, as a STANDING fact of the record · **may NOT** a count, a cause, a season, a future, a standpoint, a second fact
- **audience** `player (no mark)` · **REFUSED COLUMNS, always** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim

**The predicate, read in the code rather than inferred** (`src/domain/display/stateProse/defenseStateProse.js`, read-only in the dock): `beastsRowSituation` returns `'settled country, neither'` from `:374-375` — the `settled` family with `perimeter` false and `force` false. The call site is `:591`, `beasts: rung(beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia))`. So the predicate resolves to exactly three typed facts and no fourth:

- **C1a — the country.** `measuredMonsterFamily(config.monsterThreat) === 'settled'`. The country around the town is settled: nothing comes out of it that a defence would be arranged against.
- **C1b — the perimeter.** `walls` false (`defenseProfileHasWalls`, the predicate the block's own FENCE insists on, never a presence check on `institutions.walls`). No wall, no works, no line.
- **C1c — the force.** `garrison || militia` false, so **both** are false. No garrison and no militia; nothing mustered; no force under arms.

**What is therefore NOT licensed here, and is not written.** The WATCH. `institutions.watch` is read nowhere in this key, so a town in this pool may hold a watch; the block's own fence assigns the guard shape to `DS-DEF-3` (`safetyProfile.guardEffectivenessDesc`). **The shipped variant 3 closed on "nothing that would justify a watch"** — subjunctive, so it asserted no watch's absence and was lawful by a hair; no face below reaches for the word at all, because a positive "no watch is kept" would be a fourth fact the read does not hold. The same bar removes gates, posts, pickets, roads, houses and any count of anything.

### N.1 The clauses each face is written against

- **C1a / C1b / C1c** as above. Every face asserts C1a and at least one of C1b, C1c; the four faces of a variant assert the same set as one another (arm A6) and the same set the shipped variant carried, less the two claims §N.4 records as dropped.
- **C2 — the bag.** `{settlement}` is the only filled slot. Every one of the twelve carries it exactly once, so each face's slot set equals its parent's (the T-F8 face rule, ARCH §2.5). **None opens on it** — a sentence face opening on a `proper`-typed slot is refused by the same table, and the shipped variant 1 did open on it. R-DA-17 wall 10 (at most one settlement-opener per pool) is therefore satisfied at zero, not at one.
- **C3 — the angles.** `ledger street visitor`, one per variant, kept exactly. The card's `may NOT: a standpoint` bars asserting that a party HOLDS a view; it does not bar the authored angle the same card licenses on the line above. No face states what anybody thinks, knows, believes, fears or has learned — the visitor faces carry acts (leaves, walks, passes, comes and goes, finds) and nothing interior. This is the correction the shipped variant 2 needed (§N.4).
- **C4 — the source, deliberately unspent.** The card licenses a citation of the muster. **Zero faces cite it**, and that is a decision, not an omission: §24 caps provenance at one citation per unit and only for one of S3's three reasons — two accounts that disagree, a count from an interested party, a record whose keeper is a power. None obtains. No count is claimed (the card refuses counts), no second account exists on this read, and the muster's keeper is not typed as a power here. MOVE-GRAMMAR §4.4.3 adds that a citation on a fact whose holder is the office itself is a finding, and the fact this pool states is precisely that the muster shows nothing. The exemplar registers with raw text cite at zero per 786 sentences; a citation here would be the habit the refuters are told to name.
- **C5 — the refused columns.** No totality over persons anywhere: the absences are stated of INSTITUTIONS (`no wall`, `no muster`, `no garrison`, `no militia`, `no force`), never of people ("nobody stands…", "everyone…"), which is why the first draft's `Nobody at {settlement}…` was struck before it reached this page.

### N.2 Per face — the clause that licenses each claim, with word counts (`{settlement}` counted as one word)

**Variant 1 `[ledger]` — the compiled entry. Claim set {C1a, C1b, C1c}.**

| face | claim | licensed by |
|---|---|---|
| plain [17] | "keeps no wall" | C1b |
| | "no force under arms" | C1c (the disjunction false ⇒ garrison false and militia false) |
| | "the country around {settlement} is settled" | C1a, in the field's own word |
| face 2 [17] | "Nothing organized stands between {settlement} and the country" | C1b + C1c together, at the key's own grain (`nothing organized`) |
| | "nothing in that country stands against the town" | C1a |
| face 3 [15] | "Settled country lies around {settlement}" | C1a |
| | "no wall" | C1b |
| | "no muster" | C1c (the raising of the militia, the one the read tests) |
| face 4 [12] | "Against a settled country" | C1a |
| | "holds no works" | C1b |
| | "raises no force" | C1c |

**Variant 2 `[street]` — the town's ordinary. Claim set {C1a, C1b, C1c}.**

| face | claim | licensed by |
|---|---|---|
| plain [8] | "Nothing stands at {settlement}" | C1b + C1c |
| | "against a settled country" | C1a |
| face 2 [21] | "carries no muster" | C1c |
| | "the settled country outside" | C1a |
| | "carries nothing a muster would be raised against" | C1a again, as the subjunctive edge A2 licenses (never an indicative future) |
| face 3 [22] | "no wall around it" | C1b |
| | "no garrison in it" | C1c |
| | "Beyond the town the country is settled" | C1a |
| face 4 [19] | "Neither a wall nor a militia stands at {settlement}" | C1b + C1c |
| | "the country outside holds nothing that either would meet" | C1a, subjunctive |

**Variant 3 `[visitor]` — the passage past the town. Claim set {C1a, C1b, C1c}.**

| face | claim | licensed by |
|---|---|---|
| plain [23] | "past no wall" | C1b |
| | "and no muster" | C1c |
| | "meets nothing in the settled country beyond the town" | C1a |
| | "at any hour" | C1a's universality (the settled family holds at every hour; the shipped line's "in any direction at any hour" is this same half said twice, and one intensifier is kept) |
| face 2 [20] | "The country beyond {settlement} is settled" | C1a |
| | "passes neither a wall nor a garrison" | C1b + C1c |
| face 3 [18] | "without meeting a militia" | C1c |
| | "find settled country open on every side" | C1a, and `open` is C1b (no line encloses the town) |
| face 4 [17] | "Between {settlement} and the settled country beyond it" | C1a |
| | "stands no wall" | C1b |
| | "the town keeps no force" | C1c |

**On the four force nouns (muster · garrison · militia · force), and why they are not a thesaurus.** R-DA-22 asks one term for one thing. The read is `garrison || militia`, so a garrison and a militia are two typed institutions and not two words for one; `muster` is the raising of the second; `force` is the class the disjunction names. Each face states the same false disjunction through a different member of it, which is the four-faces rule met with the field's own vocabulary rather than with synonyms.

### N.3 The laws checked on this set, each with its result

- **Walls.** No em dash · no exclamation · no question · no digit · no `which` (relative or otherwise) · no first or second person · no bare future indicative (two subjunctive edges, both `would`) · no expletive opener (`There is` / `It is` at zero) · no figure, no sense verb on an abstraction, nothing inanimate acting with intent · no named character, no fate, no theology, no totality over persons.
- **A11 / R-DA-05 spread.** The twelve first-two-word openers are all distinct: *The town · Nothing organized · Settled country · Against a · Nothing stands · The ordinary · Life at · Neither a · A stranger · The country · Strangers come · Between {settlement}*. Word counts run **17, 17, 15, 12 · 8, 21, 22, 19 · 23, 20, 18, 17**, mean 17.4, sd 4.07 (the within-pool floor is 4.0), with one line under nine words and none over thirty. Sentence counts vary (two faces of two sentences, ten of one).
- **R-DA-04 close kinds.** Conditions (*is settled*, *would meet*, *would be raised against*), objects (*against the town*, *beyond the town*, *a settled country*, *on every side*), absences (*no muster*, *raises no force*, *keeps no force*, *nor a garrison*). No pronoun closer; no two faces of one variant close in the same kind on the same noun.
- **R-DA-02.** No contrast move is used at all: no `rather than`, no bare *X, not Y*, nothing fronted as a rejected alternative. The shipped variant 1's contrast is the claim §N.4 drops.
- **R-DA-03.** No qualification rides as a tail; no face runs to three sentences; the two two-sentence faces each state one half of the predicate per sentence.
- **R-DA-10.** No triads (every list is a pair), no doubled adjective, no evaluative adjective on place or person, no invented particular.
- **THE THREAD (MOVE-GRAMMAR §1.4.1).** This pool is the SPINE, so it opens the composed unit and cannot be the turn outward; its job is to hand a noun forward. Every face lands on one of *the town · the country · a wall · a force / muster / garrison / militia*, which are the nouns this desk's modifiers pick up. The two two-sentence faces obey the law internally: face 1.3's second sentence carries the country forward as *it*; face 2.3's second sentence carries *the town* forward and takes its turn outward to the country last, where the law puts it.
- **Sibling distance (arms A1, A11).** The pool that renders in this slot when a wall stands (`settled, defenses beyond the need`) owns *the works, the perimeter, over-provision, the creatures* and the stranger who walks **in**; this pool's faces name no works standing, no proportion, no creatures, and its stranger walks **out**. The two never render together (the branches are exclusive) and neither restates nor contradicts the other. The `plagued` and `frontier` pools own the pressure this pool's C1a denies; no face borrows their words (*embattled, wild country, pressure, deterrence*).
- **The word `creatures` is refused throughout.** The row is Beasts & Monsters, but `settled` says the country is quiet, not that creatures are in it; a positive *the creatures in that country* would assert an existence the read does not hold. The sibling pool may deny that the creatures explain its wall because a wall is there to explain; this pool has nothing to hang the denial on.
- **Density (§21.4).** Nothing was made plainer than the law requires: face 2.2's doubled *carries*, face 1.2's balanced clauses and face 3.4's inversion are compressions kept deliberately, and a reader's question about any of them is not, by itself, a finding.

### N.4 REFUSALS AND CLAIM CHANGES — nothing spent silently

**No variant is refused: all three are written lawful.** Two claims the shipped rows carried are DROPPED because no field licenses them, under ruling 5 (Part B §9) and R-DA-15's obeys-(6) — an unlicensed claim is not one the pool was entitled to hold, and its removal does not engage B-CLAIM. Both are recorded here with their exact words so the C-pair instrument reads a declared change rather than an undeclared one. The variant's slot, number, order and angle survive in both cases, and the counts only rise (3 → 3 variants, 3 → 12 wordings), so §22 is obeyed.

1. **Variant 1, dropped: "and in a heartland this quiet the arrangement is a reasonable one rather than a gap."** A VERDICT on the arrangement (MOVE-GRAMMAR §1.3: the record rates nothing; a rating word only where a typed rating field holds it). No rating field is on this read; `{band}` is RESERVED in the bag and unfilled at this block's call sites, so even the badge word is out of reach. The card bars it twice over (`may NOT … a standpoint`). The clause also carried a contrast whose rejected alternative — *a gap* — is the same configuration under the `plagued` family, which R-DA-02 would license as a sibling-key contrast; it is the RATING, not the contrast, that cannot stand, and rewriting the contrast without the rating leaves it saying only what C1a already says. The slot is refilled by C1a stated flat.
2. **Variant 2, dropped: "has never needed to think about what is outside it, and does not."** Two faults in one clause. **(a)** *has never needed* is a HISTORICAL claim taken from a standing configuration field, which R-DST-B (A6) forbids — only an event-provenance field licenses history, and this desk holds none. **(b)** *think about* is an interior, which R-DA-14 and NL-5 refuse and the card's `may NOT … a standpoint` refuses again. Both are recast as the present standing fact the field does hold: the town keeps nothing organized, and the country is settled. No face below carries a perfect tense or a mental verb.
3. **The provenance move, refused pool-wide (a deliberate zero, not an omission).** Reasons at §N.1 C4.

**One flag for the walker, raised rather than assumed away.** Three of the twelve open on a negative subject (*Nothing organized…*, *Nothing stands…*, *Neither a wall nor a militia…*). These realise **PRESENT with a negative value** — the licensing field is the state read, whose value IS `neither` — and NOT the ABSENCE move, which MOVE-GRAMMAR §1.2 row 11 licenses only from a `none-exists` or `not-held` field. Order wall 3 (*ABSENCE never opens*) is therefore not engaged. If the walker's classifier types a negative-subject opener as ABSENCE by surface shape, those three faces will red and the classification, not the prose, is what needs the chair; the openers are recorded here so the question is asked before the gate rather than after it.
