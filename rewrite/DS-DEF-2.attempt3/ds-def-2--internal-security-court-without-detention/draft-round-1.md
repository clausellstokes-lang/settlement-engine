Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool key `Internal Security: court without detention` · role spine · draft round 1.
Three variants in, three variants out; same vids, same order, same angle tags; none added, none removed, none merged. Twelve wordings (three parents plus nine faces). No corpus byte was written; this file is a packet, not an edit.

## THE POOL'S REWRITTEN ROWS (paste under the pool's bold heading, replacing rows 1 to 3)

**`Internal Security`: court without detention**
1. `[ledger]` {settlement} holds a court and no prison.
   - `[face]` The court at {settlement} sits, and no prison stands.
   - `[face]` Offences at {settlement} come to a court. The town stands without a prison.
   - `[face]` A wrong done at {settlement} is heard by a court, and the town has no prison.
2. `[street]` The town has a court. It has no prison.
   - `[face]` Wrongs are tried in this town, and no prison is kept.
   - `[face]` The law in this town has a court and no prison to it.
   - `[face]` This town judges and does not imprison.
3. `[unfolding]` Trials are going forward at {settlement}, and detention is nowhere in the town.
   - `[face]` A court is at work in {settlement}, and no prison stands anywhere in it.
   - `[face]` Judgment goes forward at {settlement} without a prison.
   - `[face]` Hearings go on at {settlement}, and the town holds no prison.

--- NOTES

### 0. The licence card this pool was written against (printed, verbatim in substance)

```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: court without detention`)
  reads:      court   (not-produced)
              prison   (not-produced)
  predicate:  court truthy (no literal)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence   move: (none declared)   angle: ledger street unfolding
  source:     (none) · standing SOURCE-UNRESOLVED · NO citation is licensed (arm A13)
  covert:     no
  may claim:  that `court` (truthy (no literal)) holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact,
              another civic object of the class `law`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named
              character and that character's fate; a theological claim about a deity
```

The pool's licensed claim set is exactly two limbs, and every one of the twelve wordings carries both and nothing else:

- **C1 — a court holds at this settlement.** Licensed by the card's `predicate: court truthy (no literal)` and by `reads: court`; asserted as a STANDING fact of the record, per the `may claim` line.
- **C2 — no prison holds at this settlement.** Licensed by the card's `reads: prison` under the branch this pool keys on — see §1, which is the one licensing question this packet puts to the chair.

### 1. THE ONE OPEN LICENSING QUESTION — C2, the prison limb (chair's, not the writer's)

The card lists `prison` in `reads` but recovers only one predicate limb, `court truthy`. Its `may claim` line therefore names the court alone. Two facts sit against a literal reading of that line:

- The card's `may claim` renderer is coarse on the token. For the sibling key `Internal Security: full legal chain (court AND prison)` it prints `that court (truthy (no literal) AND truthy (no literal)) holds` — two limbs collapsed under the single head token `court`. The line summarises the predicate; it does not enumerate the reads.
- The key function is an `if / else if` chain (`src/domain/display/threatAssessment.js:144-151`): this pool's branch is the `else if (f.hasCourtSystem)` arm, reached only after `f.hasCourtSystem && f.hasPrison` has failed. Reaching it means `court` truthy AND `prison` falsy. `prison` is a declared read of this pool, so its falsity on this branch is a `none-exists` field in the sense of MOVE-GRAMMAR §1.2 row 11 class (a) — the LACK.

**The writer's call, recorded for veto:** C2 is kept, as a LACK licensed by `reads: prison` plus the branch's position in the chain. Dropping it would leave three variants asserting only "a court holds", which is the shipped `full legal chain` sibling's first limb and nothing else — the pool would lose the entire fact it exists to carry, and arm A11's sibling distance would collapse toward the full-chain pool.

**If the chair rules C2 unlicensed**, this pool becomes a refusal set: the lawful residue is a court-only statement (`{settlement} holds a court.` and three faces of it), the pool's own distinction from its siblings is gone, and the correct cure is a card fix — the predicate's second limb printed from the chain position — not a text cut. That fallback is stated here so the refusal is banked, never trimmed.

### 2. WHAT EACH OLD VARIANT CARRIED, AND WHAT WAS DROPPED

**Old 1 `[ledger]`** — "{settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly."

| claim in the old sentence | disposition | ground |
|---|---|---|
| a court tries offences | KEPT (C1) | `predicate: court truthy` |
| it cannot hold anyone | KEPT as C2, RESHAPED | the claim is licensed; the FORM "cannot hold anyone" is a totality over persons, a REFUSED COLUMN on every card. Restated institutionally ("and no prison"), never quantified over persons. |
| the sentences available here are money and exile | DROPPED | a SECOND FACT and another civic object of the class `law` (a penal schedule); no field holds it. `may NOT: a second fact`. |
| both of them fall unevenly | DROPPED | a standpoint, and a totality over persons in its incidence. `may NOT: a standpoint`; REFUSED COLUMNS. |

**Old 2 `[street]`** — "The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road."

| claim | disposition | ground |
|---|---|---|
| the law can name a wrong | KEPT (C1) | `predicate: court truthy` |
| cannot keep the person who did it | KEPT as C2 | the LACK; restated without the person as its object |
| so it reaches for the purse or the road | DROPPED | a CAUSE (`so`) and a second fact (the same unlicensed penal schedule). `may NOT: a cause`, `a second fact`. |

**Old 3 `[unfolding]`** — "Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace."

| claim | disposition | ground |
|---|---|---|
| judgments are given (a court holds) | KEPT (C1) | `predicate: court truthy` |
| the town cannot enforce them | KEPT as C2 | the LACK |
| each judgment costs the next one its weight | DROPPED | a CAUSE and a trend over time. `may NOT: a cause`, `a season`. |
| the courts are spending down a reputation they cannot replace | DROPPED | a second fact (a reputation state no field holds), a standpoint, and a forecast in all but tense — the FORECAST non-move (MOVE-GRAMMAR §1.3). `courts` plural is also a soft COUNT on a `no literal` predicate. |
| — | — | the `[unfolding]` angle survives as DURATIVE ASPECT only (progressive verbs, "going forward", "at work", "go on"), because every trend content the angle usually carries is unlicensed here. Recorded so a refuter does not read the flattened angle as a lost feature. |

No claim was added anywhere. The four faces of each variant are claim-equal to each other (arm A6 reads across the faces): every face asserts C1 then C2, in that order, and asserts nothing else.

### 3. PER-FACE LICENCE — every claim, with the card clause that licenses it

Every row below carries exactly C1 + C2. `S` = the `{settlement}` slot, which is the only member of the card's bag FILLED at this block's call sites; `band` and `route` are RESERVED and appear nowhere.

| id | wording | C1 licensed by | C2 licensed by | slots | words | sentences |
|---|---|---|---|---|---|---|
| 1.parent | {settlement} holds a court and no prison. | `predicate: court truthy` · `reads: court` | `reads: prison`, LACK (§1) | {settlement} | 7 | 1 |
| 1.face a | The court at {settlement} sits, and no prison stands. | same | same | {settlement} | 9 | 1 |
| 1.face b | Offences at {settlement} come to a court. The town stands without a prison. | same | same | {settlement} | 13 | 2 |
| 1.face c | A wrong done at {settlement} is heard by a court, and the town has no prison. | same | same | {settlement} | 16 | 1 |
| 2.parent | The town has a court. It has no prison. | same | same | (none) | 9 | 2 |
| 2.face a | Wrongs are tried in this town, and no prison is kept. | same | same | (none) | 11 | 1 |
| 2.face b | The law in this town has a court and no prison to it. | same | same | (none) | 13 | 1 |
| 2.face c | This town judges and does not imprison. | same | same | (none) | 7 | 1 |
| 3.parent | Trials are going forward at {settlement}, and detention is nowhere in the town. | same | same | {settlement} | 13 | 1 |
| 3.face a | A court is at work in {settlement}, and no prison stands anywhere in it. | same | same | {settlement} | 14 | 1 |
| 3.face b | Judgment goes forward at {settlement} without a prison. | same | same | {settlement} | 8 | 1 |
| 3.face c | Hearings go on at {settlement}, and the town holds no prison. | same | same | {settlement} | 11 | 1 |

Slot-set parity (ARCH §2.5: a face whose `{slot}` set differs from its parent's is refused): variant 1 carries `{settlement}` in all four wordings; variant 2 carries no slot in all four; variant 3 carries `{settlement}` in all four. Old variant 2 shipped slotless and stays slotless.

### 4. THE WALLS, WALKED

| wall | how the twelve stand |
|---|---|
| every sentence licensed by a typed field (§9, ruling 5) | C1 by the predicate, C2 by the `prison` read; nothing else asserted |
| B-CLAIM — a grammar never spends a claim | all twelve carry one claim set; the variation is order, vocabulary, rhythm and aspect only |
| sibling coherence in structural fact (arm C, C-sibling) | the three variants' typed claim sets are IDENTICAL, which is the arm's requirement, not its red |
| no em dash · no digit · no percent | zero of each across the twelve |
| no `which`-clause (R-DA-03) | zero; no relative tail of any kind |
| no exclamation, no question (B0.8) | zero |
| no citation, no record holder named (S3 / arm A13) | zero; `source: (none)`, SOURCE-UNRESOLVED |
| no second person, no persona, no "I" (R-DA-01, A5) | zero |
| STATE precedes CAUSE (wall 1) | no CAUSE move is made anywhere |
| no future indicative; the edge subjunctive (A2, R-DA-07) | zero futures; zero subjunctives |
| the expletive struck (R-DA-07) | no "there is" / "it is" opener in any of the twelve |
| ABSENCE never opens, never sits beside another (wall 3) | C2 is second in every wording; one absence per wording |
| CONTRAST never fronted, never the closing move of more than one variant (wall 5) | no `X, not Y` antithesis is used at all; the LACK is stated flat, first-half-only per R-DA-02, with no completing "but" |
| never a third sentence (R-DA-03) | maximum two |
| a totality over persons (REFUSED COLUMN) | the old "cannot hold anyone" shape is gone; no "anyone", "everyone", "nobody", "all" appears |
| an office, count or exemption without an institution-table row (R-DA-15) | no office-holder, no count, no exemption is named; only the two read objects, `court` and `prison` |
| a figure, a sense verb on an abstraction, an inanimate intent (R-DA-11) | none; "sits", "stands", "at work", "goes forward" are the literal idioms of a court and a building |
| a named character or a fate; a theological claim | none |
| THE THREAD (§1.4.1) — the spine hands a noun forward | every wording closes on `prison`, `town` or `detention`, and names `court` earlier, so a modifier can pick up either the court or the lack; the spine opens the passage and takes no turn outward |

### 5. THE BANDS — the soft rules this pool sits outside, declared with their distance (§16.1 / §16.2 BUDGET and DEPTH)

Reported, not cured; each is a consequence of a two-limb licence, not of the wording.

1. **Close-kind spread (R-DA-04).** Every one of the twelve closes on the LACK, because wall 3 forbids an absence opening and the licence holds exactly two limbs, so C2 can only ever be last. A second sentence returning to the court after the lack would be either the summarising gloss (fault 1) or an unlicensed second fact. The close-kind variety this rule wants must come from the register's other pools; inside this pool it is unavailable by construction. **One exceedance; the depth is not measurable on a pool of one close-kind.**
2. **Within-pool word-count sd (R-DA-05, target ≥ 4.0).** Measured over the twelve: variant 1 spans 7 to 16, variant 2 spans 7 to 13, variant 3 spans 8 to 14; the pool's parents are 7, 9 and 13. Variant 3's own spread is the narrowest of the three. A two-limb claim caps how long a lawful wording can honestly run without buying a fact. **Reported as one soft exceedance on variant 3.**
3. **Level-1 grammar count (§2.1, arm E).** The drawable-and-claim-complete level-1 set here is `{V3: PRESENT → LACK}` alone: V1 drops C2 and would red arm C against its siblings; V2, V5, V6, V8 each need a field the card does not hold (a structural-consequence field, an institution row, an unresolved state field, a `not-held` provenance field). So `min(k, |licensed set|) = 1` and one grammar across three variants is lawful here by the licensing filter, not by neglect. **Declared, not an exceedance.**
4. **Cross-variant construction reuse.** No two faces of ONE variant share a lack construction (variant 1: compound object · intransitive · own sentence · possession; variant 2: own short sentence · passive · idiom · verbal negation; variant 3: abstract locative · intransitive locative · prepositional · possession). Across variants, `no prison stands` recurs once (1.face a, 3.face a, with different continuations) and the possession form recurs once (1.face c "has", 3.face c "holds"). Twelve distinct constructions on a two-limb licence were not available without reaching for the reverse thesaurus that R-DA-22 refuses. **Reported.**
5. **The settlement-token opener (wall 10, ≤ one variant per pool).** Exactly one of the twelve wordings opens on `{settlement}` — the variant 1 parent, where the shipped row already had it. One in twelve is 0.083 against the register ceiling of 0.167. **Inside the band.**
6. **Distinct openers (arm E).** All twelve first-two-word openers differ: `{settlement} holds` · `The court` · `Offences at` · `A wrong` · `The town` · `Wrongs are` · `The law` · `This town` · `Trials are` · `A court` · `Judgment goes` · `Hearings go`. **Inside the band.**

Six measurable soft rules touched, two exceeded (rows 1 and 2). The ENTRY budget is two thirds of the soft rules measurable on it (§16.2). **Inside the budget.**

### 6. SIBLING POOLS — neither restated nor contradicted (arms A1 and A11)

The block's three sibling `Internal Security` pools and their claim sets:

- `full legal chain (court AND prison)` — court holds, prison holds. This pool asserts court holds, prison does not: a different branch of one `if / else if` chain, so no contradiction, and no wording here reuses the siblings' distinctive vocabulary (`arrest, try and hold`, `a procedure rather than a favour`).
- `detention without process` — prison holds, court does not. The exact mirror; nothing here restates it.
- `no legal infrastructure` — neither holds. Nothing here restates it.

The spine sits beside DS-DEF-2's other four rows (`Beasts & Monsters`, `Invasion & War`, `Economic Survival`, `Disasters & Famine`), whose subject matter this pool never touches. No wording here names walls, a garrison, a militia, a granary, a hospital, money or a season.

### 7. REFUSALS

**None.** All three variants are written and all three are lawful under the card as read in §1. The single conditional refusal is recorded in §1: if the chair rules the `prison` limb unlicensed, all three variants become a refusal set with the court-only residue named there — banked with their faces, never trimmed.
