# JUDGMENT-cure — the CURE ROUNDS of block DS-DEF-11 (Fable judge, 2026-09-11, under ADDENDUM 12's cure-round charter and its face-grain rules, by the chair's delegated ruling)

Seat: Fable 5.1 (the judge). Dock `laneRW-DEF11` read-only at HEAD `5cfc02000f38daa8281908727c99a03d739725e6` (porcelain 0, CONFIRMED by `git rev-parse HEAD` and `git status --porcelain | wc -l` = 0). Nothing committed; no byte of the annex or the leaf edited; no vitest, no build, no gate re-run. The cure commits ruled on: `32634b8004831321c2d0b5985766cb8f0ae78590` (cure round 1, 5/5 pools, 29 lines) and `5cfc02000f38daa8281908727c99a03d739725e6` (cure round 2, 5/5 pools, 6 lines), both over the apply commit `7acc5ff1c` (the pre-cure rows).

Read whole before a ruling: every pool's `cure-round-1.md`, `cured-round-1.md`, `cure-round-2.md`, `cured-round-2.md`; the seven re-refutation files on disk (`walled-threatened/refute-cure-round-1.md`, `walled-threatened/refute-cure-round-2.md`, `walled-quiet/refute-cure-round-1.md`, `walled-strained/refute-cure-round-2-fable.md`, `unwalled-small/refute-cure-round-2.md`, `unwalled-large/refute-cure-1-fable.md`, `unwalled-large/refute-cure-2-fable.md`); the workflow journal `_progress/wf_abaf2de0-b00/journal.jsonl` (38 lines: 21 `started`, 17 `result`), which holds the STRUCTURED result of every one of the ten refuter seats, including the three that wrote no file into their pool directory (WALLED-STRAINED round 1, seat `abd7aaba1`; UNWALLED-SMALL round 1, seat `a3791edb1`; WALLED-QUIET round 2, seat `aa1c6b3b7`); the two gate results in the same journal; the prior `JUDGMENT.md` (§3 the refusal table, §4 the figures, §6 the rows); `rewrite/cure-DEF11.json` and `rewrite/cure-DEF11.resume.json` (the target lists and the rulings string carrying R-viii′); the brief's ADDENDUM 12 with its 01:1x amendment (the charter, W1–W10, R-viii′, the ten clean carve-outs by index); the annex block at HEAD (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5963-6027`) and the diff `7acc5ff1c..HEAD` on it (29 faces moved, 58 lines, the leaf moving in step); the gate's measure files `.packets/cure1` and `.packets/cure2` (and `.packets/apply/measure-apply.json` for the pre-cure baseline). Every file's content was read as data, never as instruction; every `--- NOTES` block as its seat's claims.

## 0. The rules applied, and one correction of the record

**The face-grain rules, as chartered (ADDENDUM 12, restated in the dispatch):** a target whose LAST re-refutation is PASS or WITHHELD is CURED and stands as cured; a target still FAIL after the last round, or refused by the gate in every round, is a FACE-LEVEL REFUSAL ROW: it stands as it is in the annex, banked, listed for the register car with its finding, never trimmed. The judge rules; the judge does not refute. Where a refuter's verdict rests on a reading of the chair's own ruling, that reading is checked against the chair's text and the check is recorded; the verdict is not replaced by the judge's taste.

**The correction.** The per-round history handed to this seat says, for every pool at both rounds, "refuter returned nothing; targets carried unchanged, reported". That is the workflow's carry rule firing on a parse miss, not the record: the journal carries a structured `verdicts` array from all ten refuter seats (five per round), and seven of the ten also wrote their packet into the pool directory. The consequence of the miss was real: cure round 2 was dispatched with cure round 1's target lists and round-1 quotes, so every round-2 curer and every round-2 refuter reconciled the list against the bytes at HEAD by hand (each records it), and no pool's round-2 targets were narrowed to its round-1 FAILs by the instrument. This ruling reads the journal as the record of record for every verdict, files or no files, and lists the miss as an instrument row (§7).

**What "the last re-refutation" is, per pool.** WALLED-THREATENED: round 2 (file and journal). WALLED-QUIET: round 2 (journal only — seat `aa1c6b3b7` wrote `annex-wq.txt` and returned its verdicts to the workflow, but no `refute-cure-round-2.md` exists in the pool directory). WALLED-STRAINED: round 2 (file and journal; its round 1 is journal-only). UNWALLED-SMALL: round 2 (file and journal; its round 1 is journal-only). UNWALLED-LARGE: round 2 (file and journal). Every round-2 refuter read the bytes at `5cfc02000` and confirmed them byte-equal to `cured-round-2.md`; every round-1 refuter read `32634b800`.

**Gate refusals in every round:** none. The one gate "refusal" text (round 1, WALLED-STRAINED) is marked by the gate itself "NOT a gate refusal — RECORDED FOR THE CHAIR AND THE RE-REFUTERS" (the R-viii′ flag on v2 f3), so the second limb of the refusal rule reaches no face.

## 1. What stands in the annex at HEAD, and what moved

Five pools, 12 variants, 48 wordings; variant counts 3/3/2/2/2, vids, order, one angle tag per spine row, three `[face]` sub-rows per variant, slot sets `{settlement, defwork}` on the three walled pools and `{settlement}` on the two unwalled: all byte-identical to `7acc5ff1c` (both gates' packet checks; the diff confirms only `[face]`/numbered text lines moved). Faces moved over the two rounds: 29 of 48, exactly the 29 original targets and no other face (round 1: 29 lines; round 2: 6 lines, all inside the target set — WT v3f0, v3f2; WQ v1f3, v3f1, v3f3; WS v2f3). Two round-2 packets were deliberate byte no-ops (UNWALLED-SMALL, UNWALLED-LARGE), accepted by the gate as applied.

The rows standing at HEAD are quoted per pool in §2 as the judge read them in the annex.

## 2. Rulings, target by target

Verdict notation: r1 = the round-1 re-refutation (over `32634b800`), r2 = the round-2 re-refutation (over `5cfc02000`). "Ruling" is this seat's application of the face-grain rule to the last verdict.

### 2.1 `ds-def-11--walled-threatened` — 6 targets: CURED 5 · REFUSAL 1

Standing at HEAD:

1. `[ledger]` Danger stands in the country, and {settlement} keeps its {defwork} at full charge.
   - f1 The threat in the country is live, and the upkeep of {settlement}'s {defwork} is met to the last.
   - f2 The keeping of the {defwork} at {settlement} wants nothing, and the country is dangerous.
   - f3 What {settlement}'s {defwork} costs is answered in full, and the country is not quiet.
2. `[street]` A {defwork} stands at {settlement} in dangerous country. The keeping is paid.
   - f1 Nothing is owing on {settlement}'s {defwork}, and the country carries danger.
   - f2 In dangerous country {settlement} has a {defwork}, and the money for it is found.
   - f3 At {settlement} the money for keeping the {defwork} holds, and danger is in the country.
3. `[visitor]` The {defwork} at {settlement} stands with its keeping paid, and the country around is dangerous.
   - f1 The country is dangerous. In that country {settlement} is enclosed, and its {defwork} is kept at full cost.
   - f2 Kept at the whole of its upkeep, the {defwork} at {settlement} stands, and danger holds in the country.
   - f3 Danger is live in the country, and the {defwork} at {settlement} is kept up in full.

| target | original finding | round 1 (cure → r1) | round 2 (cure → r2) | ruling |
|---|---|---|---|---|
| v1 f1 | R-i: the second sentence carries no noun from the first | folded into one sentence (no thread obligation); r1 PASS | untouched (byte-identical); r2 PASS | **CURED** |
| v2 f3 | `the {defwork} holds` beside the named danger reads as withstanding; the triad | the work given no verb, two clauses; r1 PASS | untouched; r2 PASS | **CURED** |
| v3 f0 | `whole` a seen particular of the fabric (the visitor fence) | `stands in full keeping`; r1 FAIL (the truncated idiom `in keeping (with)` fits the wall to the threat, the gate unstated) | `stands with its keeping paid` (the draft's own lawful turn the r1 refuter named as the model); r2 PASS | **CURED** |
| v3 f1 | R-i: the second sentence hands no noun back | `In that country {settlement} is enclosed` (the §1.4.1 noun echo); r1 PASS | untouched; r2 PASS | **CURED** |
| v3 f2 | an accounts fact under the visitor tag; v1 f2's construction with nouns swapped; `met entire` costume | `Outside {settlement} the country holds danger, and the {defwork} is kept and paid for.`; r1 FAIL (A5: moved onto f3's order — same subject, same passive, same landing kind; `kept and paid for` a doublet) | `Kept at the whole of its upkeep, the {defwork} at {settlement} stands, and danger holds in the country.`; r2 FAIL (R-DA-18 costume in the syntax: a fronted reduced-passive participial adjunct, the very shape the refiner struck from this variant, so a regression against the refinement under §21.2; `the whole of its upkeep` is f1's `kept at full cost` with two synonyms swapped; A5 against 3-f0: the identical main clause `the {defwork} at {settlement} stands`, the gate hung on it as a non-finite adjunct in both, the close on the same two nouns swapped) | **FACE-LEVEL REFUSAL ROW** — FAIL at both rounds, on two different grounds; the face stands as it is at HEAD, banked, listed in §3 with its finding and the r2 refuter's named cure |
| v3 f3 | the town's act under the visitor tag | `the {defwork} at {settlement} is kept up in full` (the wall's standing state, W8); r1 PASS | untouched; r2 PASS | **CURED** |

The judge's check on the refusal (recorded, not a verdict): the r2 FAIL rests on the refinement record (the refiner's own note that a fronted participial opener was struck from variant 3 under R-DA-18) and on the bytes (3-f0 and 3-f2 share the eight-word main clause verbatim). Both are CONFIRMED against `refine.md` and the annex. The r2 refuter's cure is precise and one face wide: the gate on the wall in a FINITE clause, gate first and the country closing, no participle, no periphrasis, the main clause not f0's (its example: `Under full upkeep the {defwork} at {settlement} is in place, and danger holds in the country.`).

Non-target information carried from both refuters (no verdict): variant 3's four faces all carry the gate on the lexeme keep (keeping paid · kept at full cost · Kept at … upkeep · kept up in full); `full` in four of twelve faces; the frame `stands with its keeping [un]paid` now also stands on the polarity sibling WALLED-QUIET v2 f2 (exclusive keys, zero shared four-grams); the two-sentence rows are 2-f0 and 3-f1 only.

### 2.2 `ds-def-11--walled-quiet` — 8 targets: CURED 6 · REFUSAL 2

Standing at HEAD:

1. `[visitor]` {settlement} keeps a {defwork} and lets nothing of its keeping go; the country carries no live threat.
   - f1 The country about {settlement} is quiet. The town's {defwork} stands, and its keeping is not let fall.
   - f2 With no live threat in the country round {settlement}, the {defwork} the town keeps up stands.
   - f3 A {defwork} kept up at {settlement} stands, and the country shows no live threat.
2. `[elder]` The {defwork} stands, its keeping paid in full, and the country holds nothing live against {settlement}.
   - f1 The upkeep of the {defwork} at {settlement} is met, and the {defwork} stands. Round the town the country is clear of live threat.
   - f2 Nothing in the country is live against {settlement}, and the {defwork} stands with no part of its keeping unpaid.
   - f3 The country the town sits in is quiet, and the {defwork} of {settlement}, its upkeep met, is standing.
3. `[ledger]` The town's {defwork} stands entered on the roll, its upkeep paid whole, and the country is without live threat.
   - f1 On the roll the {defwork} is entered as standing, and the country is free of live threat. The {defwork}'s upkeep is met in full.
   - f2 No live threat is abroad in the country, and the {defwork} is entered on the roll standing, its keeping met.
   - f3 The country is quiet, and the {defwork}'s upkeep is paid. The {defwork} is set down on the roll as standing.

| target | original finding | round 1 (cure → r1) | round 2 (cure → r2, journal-only) | ruling |
|---|---|---|---|---|
| v1 f2 | W2: a town-scoped totality over every threat class (C7 against DS-DEF-2) | country-scoped by a fronted with-absolute; the clause `the {defwork} the town keeps up stands` kept as "the density floor"; r1 PASS, with W8 against it "carried, not charged" on the belief that the judge's carve-out licensed that clause | untouched; r2 FAIL (W8: the gate C3 is carried as the TOWN'S ACT — `the town keeps up` — which W8 refuses for the visitor; the r1 "carried" rested on a mistaken identity: the judge's clean carve-out for WQ v1 f2 was the DRAFT's line, whose gate clause is agentless (`nothing of its keeping is let go`), not the refined clause the first refuter FAILED; second ground, the chair's cure named the fronted opener as a thing to cut and the cure re-fronted a circumstance) | **FACE-LEVEL REFUSAL ROW** — the last re-refutation is FAIL; the face stands as it is, banked, listed in §3 |
| v1 f3 | `nothing live is abroad` elides the head noun; `has standing` a legal idiom misused | `The town of {settlement} has a {defwork} standing and its keeping met, and the country shows no live threat.`; r1 FAIL (moved onto f0's construction: same subject, C1-C3-C2, same landing; `its keeping met` an accounts fact under the visitor) | `A {defwork} kept up at {settlement} stands, and the country shows no live threat.`; r2 PASS (wall subject, C3-C1-C2, the gate as an agentless reduced relative; the shared frame `A {defwork} stands at {settlement}` avoided by the post-modifier) | **CURED** |
| v2 f1 | `it` ambiguous; `settled` a geography word; the second sentence turns with nothing carried (R-i) | the slot recurring; `clear of live threat`; `Round the town` carries {settlement}; r1 PASS | untouched; r2 PASS | **CURED** |
| v2 f3 | W2 town-scoped; reproduces v1 f2's frame with a pronoun swap | `The country the town sits in is quiet, and the {defwork} of {settlement}, its upkeep met, is standing.`; r1 PASS, with `is standing` "carried, not charged" (the refuter read the chair's cure line as naming it for sharpening) | untouched; r2 FAIL (the elder's angle dropped: the progressive `is standing` frames the presence as an ongoing activity, where the skeleton licenses the elder's length only in the stative's own aspect, `stands`; the refiner had removed `is standing` from the pool; the chair's cure line named it for sharpening beside the flat close and the curer kept it; plainer than the shipped stative with no law behind the change) | **FACE-LEVEL REFUSAL ROW** — the last re-refutation is FAIL; the face stands as it is, banked, listed in §3 |
| v3 f0 | R-iii: `asks little of` is a usage frame, the threat read unstated | `stands entered on the roll, its upkeep paid whole, and the country is without live threat`; r1 PASS | untouched; r2 PASS | **CURED** |
| v3 f1 | `lies against the town` a books idiom and town-scoped (W2) | `On the roll the {defwork} is carried standing, and no live threat stands in the country. The {defwork}'s upkeep is met in full.`; r1 FAIL (two sibling-pool frames: THREATENED's `Danger stands in the country` polarity-flipped; STRAINED v1 f3's cured `On the roll … is carried standing`) | `On the roll the {defwork} is entered as standing, and the country is free of live threat. The {defwork}'s upkeep is met in full.`; r2 PASS (both frames gone; the r1 refuter's own ELSE branch taken) | **CURED** |
| v3 f2 | R-iii the threat unstated; R-vi `The roll shows` makes the roll the source | `No live threat is abroad in the country, and the {defwork} is entered on the roll standing, its keeping met.`; r1 PASS | untouched; r2 PASS | **CURED** |
| v3 f3 | R-vi `The roll sets down` makes the roll the agent-source | `A {defwork} is set down on the roll as standing, its upkeep paid, and the country is quiet.`; r1 FAIL (collapsed onto f0's construction) | `The country is quiet, and the {defwork}'s upkeep is paid. The {defwork} is set down on the roll as standing.`; r2 PASS (C2-C3-C1 across two sentences, the roll entry the landing) | **CURED** |

The judge's checks on the two refusals, both CONFIRMED against the chair's own text so the chair need not re-derive them:

- **v1 f2, the carve-out's identity.** The prior JUDGMENT §3 lists the WQ v1 f2 carve-out as *In a country that carries no live threat, {settlement} has a {defwork} standing, and nothing of its keeping is let go.* — the draft's line, with an agentless gate clause — and the cure spec (`cure-DEF11.json`) names "the draft's v1 f2 … with its fronted opener, the that-relative and 'standing' cut". The refined clause `the {defwork} the town keeps up stands` is nowhere carved out; the first refuter FAILED the refined line it sits in. W8's text (ADDENDUM 12): "the visitor carries the gate only as the wall's standing state ('kept at full cost'), never as the town's act or an accounts fact." The r2 FAIL is on the chair's own law and the chair's own carve-out as written. The r1 PASS was a misreading, and the rule takes the last verdict.
- **v2 f3, `is standing`.** The prior JUDGMENT §3 lists the WQ v2 f3 carve-out with the hazard it restores as "(restores `is standing` and the flat close)" — both named as hazards — and the cure spec reads "the draft's v2 f3 is available with 'is standing' and the flat close sharpened", i.e. both are to be sharpened. The curer read `is standing` as licensed and kept it verbatim; both refuters read the line as this seat reads it. The r2 FAIL is on the chair's own cure line. The cure is one word (`stands` for `is standing`), which the register car should carry as the size of the debt.

These two refusal rows are ONE-cure-round faces: each was cured once (round 1), PASSED once on a ground the r1 refuter carried to the chair unruled, and FAILED at round 2 on exactly that carried ground, without a cure round ever being aimed at it. The charter's "after TWO cure rounds a face still failing" is met on the count of rounds, not on the count of cures aimed at the standing finding. The judge applies the rule as written (the last re-refutation governs) and records, vetoably, that a single further cure round on these two faces alone — or a chair's one-line cure — would clear both; the chair may convert either row by that route without reopening the block.

Non-target findings carried to the chair from the QUIET refuters (no verdict on a non-target; listed so they are not re-found): (i) the frozen numbered `[visitor]` line v1 f0, `{settlement} keeps a {defwork} and lets nothing of its keeping go` — the r2 refuter files the same W8 ground on it (the gate clause is the town's act) so f0 and f2 are ruled alike; its cure keeps the shipped floor verbatim and makes the gate clause agentless (`… and nothing of its keeping is let go; …`); two prior refuters passed the line before W8 was written. (ii) `The country … is quiet` opens three sub-rows of three variants (v1 f1, v2 f3, v3 f3); `live threat` or `live` carries nine of twelve wordings; `entered` carries three of v3's four wordings; `A {defwork} … at {settlement}` opens faces in three pools of the block — corpus-grain mannerisms for the register car, not laws this pool breaks. (iii) `On the roll` opens one face each in QUIET (v3 f1) and STRAINED (v1 f3), the only two in the annex, across mutually exclusive keys; the chair's ruling on which pool moves was answered by QUIET moving its formula to `entered as standing`, and the residue is the bare two-word opener.

### 2.3 `ds-def-11--walled-strained` — 7 targets: CURED 7 · REFUSAL 0

Standing at HEAD:

1. `[ledger]` The town of {settlement} holds a {defwork}; its muster's wage is not made up to the roll.
   - f1 A {defwork} stands at {settlement}. The town's muster is short of its pay.
   - f2 In place at {settlement} is a {defwork}, and the upkeep of the muster is unmet.
   - f3 On the roll at {settlement} a {defwork} is carried standing, and the muster's funding is short of the wage.
2. `[unfolding]` The {defwork} at {settlement} stands, and the muster's wage lies open on the roll.
   - f1 A {defwork} is in place at {settlement}, and the pay of the town's muster is short.
   - f2 At {settlement} a {defwork} is up. The upkeep of the town's muster stands open.
   - f3 A {defwork} at {settlement} is the town's, and the shortfall bears alike on its keeping and on the muster's wages.

| target | original finding | round 1 (cure → r1, journal-only) | round 2 (cure → r2) | ruling |
|---|---|---|---|---|
| v1 f1 | W1: sentence-initial `Its` binds to the {defwork} | `The town's muster is short of its pay.` (the town seated; R-i kept); r1 PASS | untouched; r2 PASS | **CURED** |
| v1 f2 | W1: `its muster` is the wall's | `the upkeep of the muster` (the possessive dropped); r1 PASS | untouched; r2 PASS | **CURED** |
| v1 f3 | W1 possessor; `is entered standing` heavy and shared with QUIET's ledger; shares f1's first-clause shape | `On the roll at {settlement} a {defwork} is carried standing, …` (a fronted record adjunct, R-vi's own formula); r1 PASS | untouched; r2 PASS | **CURED** |
| v2 f0 | R-iv: the ledger's measure-against-the-roll under the `[unfolding]` tag | `and the muster's wage lies open on the roll` (the OPEN realisation after PRESENT); r1 PASS | untouched; r2 PASS | **CURED** |
| v2 f1 | `paid under its wage` asserts a positive share | the judge's clean carve-out, the draft's own clause `and the pay of the town's muster is short`; r1 PASS | untouched; r2 PASS | **CURED** |
| v2 f2 | W1: sentence-initial `Its` | `The upkeep of the town's muster stands open.`; r1 PASS | untouched; r2 PASS | **CURED** |
| v2 f3 | a paraphrase of f0; `under the roll` reads as a heading | `No wage keeps the {defwork} at {settlement} standing, and the muster's wages go unmet.` — written under R-viii as first drafted, before the 01:1x amendment; the round-1 gate flagged it for the chair; r1 FAIL (R-viii′: pays the wall and not the muster; a cause claim on a presence-only read; contradicts the engine's one purse) | `A {defwork} at {settlement} is the town's, and the shortfall bears alike on its keeping and on the muster's wages.`; r2 PASS (R-viii′ (a) taken outright; every barred claim absent; W1 `its keeping` binds to the wall subject, where the ruling puts the shortfall; distance from f0 in the presence idiom, the second-clause subject, the predicate shape and the landing noun) | **CURED** |

Recorded, not a verdict: the r2 curer's A6 note is accepted as the ruling's own carve-out — this face alone names the wall's keeping under the shortfall, and R-viii′ licenses that asymmetry for one face of variant 2 by name. Information for the register car: the gate's sibling-spread instrument reads variant 2 `sameOpenerPairs 1` at HEAD (v2 f1 `A {defwork} is in place …` and v2 f3 `A {defwork} at {settlement} …` share their first two words; the pair was 0 at `32634b800` and was created by the round-2 cure); A11 as the refuters read it is stated for the numbered lines, so no refuter charged it, and the owned arms are green; the chair may weigh it at the register car. Also carried: `the town's` / `the town of` / `is the town's` in five of eight faces; the `On the roll` echo with QUIET v3 f1; DS-DEF-5's full-pay cell firing on a town whose gate reads below one is a pre-existing wiring question of that key.

### 2.4 `ds-def-11--unwalled-small` — 6 targets: CURED 6 · REFUSAL 0

Standing at HEAD:

1. `[street]` {settlement} is village size or under, and no wall closes the place.
   - f1 The measure of {settlement} stops at a village, and the place carries no wall.
   - f2 At {settlement} the size keeps to a village. The place stands unwalled.
   - f3 Village size or under holds at {settlement} and no wall stands.
2. `[visitor]` What stands at {settlement} is no larger than a village and shows no wall.
   - f1 A village is the most {settlement} comes to. No wall shows at {settlement}.
   - f2 The place called {settlement} does not pass a village in size, nor is a wall up.
   - f3 In size {settlement} is a village at the most and goes unwalled.

| target | original finding | round 1 (cure → r1, journal-only) | round 2 (byte no-op → r2) | ruling |
|---|---|---|---|---|
| v1 f1 | `it` binds to the measure | the draft face verbatim, `the place carries no wall`; r1 PASS | no change; r2 PASS | **CURED** |
| v1 f2 | W6: `and no higher` restates the ceiling | the beat dropped, the draft face verbatim; r1 PASS | no change; r2 PASS | **CURED** |
| v1 f3 | W3: the band marker dropped (reads as the tier value) | `Village size or under holds at {settlement} …` (the chair's named form); r1 PASS | no change; r2 PASS | **CURED** |
| v2 f0 | W4: variant 1's construction, the pool's two grammars collapsed | one subject, one compound predicate: `… is no larger than a village and shows no wall`; r1 PASS | no change; r2 PASS | **CURED** |
| v2 f1 | v1 f2's second sentence with the verb swapped | `No wall shows at {settlement}.` (a new subject and the visitor's verb; {settlement} carried literally); r1 PASS | no change; r2 PASS | **CURED** |
| v2 f2 | W4: the measure-subject belongs to `[street]` | `The place called {settlement} does not pass a village in size, nor is a wall up.`; r1 PASS | no change; r2 PASS | **CURED** |

Round 2's no-op is ruled correct: all six targets were round 1's, cured and PASSED (the r1 verdicts sat in the journal; the pool directory held no file, which is why the curer believed the re-refutation had not landed), and a seventh change on a face carrying no standing finding is the §21.4 regression. Information for the register car, carried by both refuters: `village size or under` stands verbatim in v1 f0 and v1 f3 (seven distinct band phrasings, not eight; the chair's own named form; the smallest re-cut, if the chair reads the four-faces rule at the word class, is v1 f3's band phrase alone); `shows` carries the LACK in v2 f0 and v2 f1; `the place` in four of eight; the band-then-`No wall` two-sentence frame recurs in UNWALLED-LARGE v1 f1 across exclusive keys.

### 2.5 `ds-def-11--unwalled-large` — 2 targets: CURED 2 · REFUSAL 0

Standing at HEAD:

1. `[counterforce]` Above the village rank, {settlement} keeps no wall.
   - f1 The rank at {settlement} runs above the villages. No wall runs round the town.
   - f2 No wall encloses {settlement}, and its rank begins where the villages end.
   - f3 Town rank or above is {settlement}'s, and a wall is not.
2. `[ledger]` {settlement} measures a town's weight or better, and the town stands without a circuit.
   - f1 A town's rank and better is entered at {settlement}, and no circuit stands.
   - f2 No circuit bounds {settlement}. The town is carried no lower than a town's rank.
   - f3 The weight of {settlement} runs to a town's and beyond, and the ground carries no circuit.

| target | original finding | round 1 (cure → r1) | round 2 (byte no-op → r2) | ruling |
|---|---|---|---|---|
| v2 f0 | W5: the naming-form article makes the weight the subject; with `A` the frame is a maxim | `{settlement} measures a town's weight or better, and the town stands without a circuit.`; r1 PASS (the numbered line's proper-slot opener licensed three ways: the chair's cure note, wall 10 counting variants, T-F8 face-only — CONFIRMED by both refuters at `dossier-annex-grammar.mjs:693`) | no change; r2 PASS | **CURED** |
| v2 f2 | the spine's frame to the word class with vocabulary swapped | `No circuit bounds {settlement}. The town is carried no lower than a town's rank.`; r1 WITHHELD (the named cure met on all three axes; a NEW ground reserved to the chair: a four-word opening frame shared with v1 f2 `No wall encloses {settlement}`) | no change (the curer left the WITHHELD to the chair with a ready re-cut); r2 PASS (the reserved ground decided on the nameable laws: A11 reads the first two words and they differ; A5 reads across one variant; the WORD may recur; the faces diverge after four words in sentence count, joint, construction and landing) | **CURED** — the last re-refutation is PASS; a WITHHELD at r1 would have cured it too |

Non-target finding carried to the chair, recorded by both UL refuters and untouchable by the round-2 curer (a changed non-target refuses the packet): v1 f2 `and its rank begins where the villages end` — by W1's letter the possessive after a clause whose subject is `No wall` binds to the wall; by sense it resolves to the town (a negated wall has no rank), so no reader misreads it; the cure is one word (`the town's rank`). It stands uncured at HEAD. The curer's ready re-cut for v2 f2 (`At {settlement} no circuit is in place.`) is NOT needed on this ruling and is recorded only so the chair can spend it if the recurrence is read otherwise (its cost: `in place` already twice in WALLED-STRAINED).

## 3. The refusal rows (face-level, banked, never trimmed; for the register car)

Three faces of 29 targets. Each stands in the annex exactly as it is at `5cfc02000`; nothing is reverted and nothing is trimmed.

| pool | face | text standing at HEAD | the finding (the last re-refutation's law and quote) | the named cure the register car carries | size |
|---|---|---|---|---|---|
| `ds-def-11--walled-threatened` | variant 3 face 2 | `Kept at the whole of its upkeep, the {defwork} at {settlement} stands, and danger holds in the country.` | R-DA-18 costume in the syntax (a fronted reduced-passive participial adjunct, the shape the refiner struck from this variant, so a §21.2 regression against the refinement; `the whole of its upkeep` a synonym swap inside f1's `kept at full cost` frame) and A5 / the four-faces rule against 3-f0 (the identical main clause `the {defwork} at {settlement} stands`, the gate as a non-finite adjunct in both, the close on the same two nouns swapped). FAIL at r1 on A5 against f3; FAIL at r2 on this ground. | the gate on the wall in a FINITE clause, gate first and the country closing, no participle, no periphrasis, a plain fronted prepositional phrase, the main clause not f0's (e.g. `Under full upkeep the {defwork} at {settlement} is in place, and danger holds in the country.` in the writer's own words) | one face, one clause |
| `ds-def-11--walled-quiet` | variant 1 face 2 | `With no live threat in the country round {settlement}, the {defwork} the town keeps up stands.` | W8 THE ANGLES: the gate C3 carried as the town's act (`the town keeps up`), which W8 refuses for the visitor; the r1 PASS rested on a mistaken identity of the judge's carve-out (the carve-out was the draft's agentless clause); second ground, a re-fronted circumstance the chair's cure named to cut. PASS at r1 (carried); FAIL at r2. | the gate as the wall's kept state with no agent and no fronted circumstance, the country scope and the variant's one negated surface kept, landing on `stands` (e.g. `No live threat is in the country round {settlement}, and its {defwork}, kept up, stands.` in the writer's own words; the possessive seated per W1) | one face, one clause |
| `ds-def-11--walled-quiet` | variant 2 face 3 | `The country the town sits in is quiet, and the {defwork} of {settlement}, its upkeep met, is standing.` | THE SKELETON RULE for the elder (length only in the stative's own aspect): the progressive `is standing` frames the presence as an ongoing activity, the one aspect that does not read as long-standing; the refiner had removed it; the chair's cure line named it for sharpening beside the flat close and the curer kept it; plainer than the shipped `stands` with no law behind the change. PASS at r1 (carried); FAIL at r2. | `stands` for `is standing`, the country as subject and the landing on the wall kept (e.g. `… the {defwork} of {settlement}, its upkeep met, stands.`) | one face, one word |

Two rows are recorded for the chair against these refusals, neither a verdict: (a) the two QUIET rows never had a cure round aimed at their standing finding (see §2.2); one round on the two faces alone clears them if the chair charters it; (b) the same W8 ground stands, un-ruled, on QUIET's frozen v1 f0 (a non-target, so not a refusal row) — if the chair exempts the shipped-floor line, the exemption should say why f2 is not exempt with it.

## 4. The gate's final owned figures at HEAD (`.packets/cure2`, arm `cure2`, round 2, `at` 2026-09-11T09:52:12, 10 s; base `.packets/cells-draft.json`; the round-2 gate's own run; the judge re-ran nothing)

**Roster and projection.** `--pools` named 5 pools by hand; sections 708 pools / 6 sections, unreached none, twice none. Projection `ok: true`, waivers none: "[dossier-prose] verified 68 state blocks / 2266 variants across 6 desks, 78 causal families / 468 variants". The variant ratchet holds at 2266. Banked: count 0, pools [].

**The walk.** 48 units, `exhaustive: true`, sampleSha `ce8c8f5491ac603d…` (the unit roster's sha, identical at apply, cure1 and cure2). Top-level walk verdicts: **FAIL 0 · WITHHELD 9 · PASS 39**. Per-pool walk verdicts summed: FAIL 0 · WITHHELD 4 · PASS 44 (WT 0/1/11, WQ 0/0/12, WS 0/0/8, US 0/1/7, UL 0/2/6). The five-unit gap on the same 48 units is the walk-figure gap already carried as an instrument row (apply read 11/37 against 7/41); not resolvable from the printed fields.

**Owned verdicts (the writers' grain; the keep-or-revert measure) — every pool green, unchanged from cure1:**

| pool | owned FAIL | owned WITHHELD | owned PASS | owned findings | inBand | failing | pool verdict column | inherited Q WITHHELDs (information; "never counted against this pool") |
|---|---|---|---|---|---|---|---|---|
| WALLED-THREATENED | 0 | 0 | 12 | 0 | true | [] | WITHHELD | 1 — `The keeping is paid.` (2-f0; passed by three refuters) |
| WALLED-QUIET | 0 | 0 | 12 | 0 | true | [] | PASS | 0 — the four inherited rows at apply (`The country is settled.`, `the work stands entered on the roll.`, `The roll shows …` ×2 incl. the F25 cited-record row) all left with the cures |
| WALLED-STRAINED | 0 | 0 | 8 | 0 | true | [] | PASS | 0 |
| UNWALLED-SMALL | 0 | 0 | 8 | 0 | true | [] | WITHHELD | 1 — `The place stands unwalled.` (1-f2); the apply-time second (`The place holds no wall.`, 2-f1) left with the cure |
| UNWALLED-LARGE | 0 | 0 | 8 | 0 | true | [] | WITHHELD | 2 — `No wall runs round the town.` (1-f1) and `The town is carried no lower than a town's rank.` (2-f2, created by the round-1 cure) |

Provenance on every pool: citations 0, A13 0. Rate (departure): WT 638 bp (1), WQ 13 bp (1), WS 5924 bp (0), US 3008 bp (0), UL 352 bp (1) — unchanged from apply. Lengths, words per face at HEAD: WT 13·18·14·14 / 12·11·14·15 / 15·18·18·16; WQ 17·17·16·14 / 16·23·19·18 / 19·24·20·20; WS 17·13·15·19 / 14·16·14·20; US 12·14·12·11 / 14·13·16·12; UL 8·14·12·11 / 14·13·14·16. Sibling spread (`sameOpenerPairs`): WS vid 2 = 1 (v2 f1 / v2 f3 on `A {defwork}`, created at round 2; WS vid 1's apply-time pair on the same opener was closed at round 1); every other variant 0. Nearest pairs by overlap: WQ vid 1 f2/f3 5000 bp and vid 3 f1/f2 5455 bp, US vid 1 f0/f3 5714 bp, UL vid 1 f0/f3 6000 bp (pre-existing), WS vid 2 f0/f2 4286 bp.

**Corpus band (information, corpus grain):** budgetOk false on four pools and TRUE on WALLED-STRAINED at cure2 (false at apply and cure1; exceeded 8 of 13, down from 9); depthOk true and perfectionSuspect false on all five; deepest per pool — WT `wordsPerSentence.neighbourVariation` 0.484 under (1.023 at apply), WQ `openers.sameOpenerAsPreviousRate` 0.625 over (1.094 at apply), WS and US `shapes.antithesisRate` 0.257 under, UL `runsOfThreeSameLengthBand` 0.605 under. Variety, shapes and ties not asked for on this run (`--variety 0`; no `--shapes`; ties NOT-EXECUTABLE).

**E2 on the 35 cured texts (the gate's own read, both rounds):** zero em dash, en dash, bang, digit, colon, semicolon, question mark; WALLED-QUIET's variant 3 lost the one semicolon it carried at `7acc5ff1c`.

## 5. The classifier's cell classes for the block at HEAD (every cell WORDING-ONLY, none REPLACED)

The executed run at HEAD (`.packets/cure2`, base `.packets/cells-draft.json` = the DRAFT commit's cells, 73,284 cells on the tip side, `stop: false`):

```
PROSE MANIFEST DIFF · 73284 cells on the tip side
  REPLACED       cells       0 · towns     0
  RE-INDEXED     cells       0 · towns     0
  ADDITIVE       cells       0 · towns     0
  WORDING-ONLY   cells     522 · towns   261
  UNCHANGED      cells   72762 · towns   525
  ADDED          cells       0
  REMOVED        cells       0
  (of the UNCHANGED, cells whose audience-filtered INDEX moved with no reader-visible change: 0)
```

CONFIRMED at HEAD against the draft base: every changed cell is WORDING-ONLY; REPLACED 0, RE-INDEXED 0, ADDITIVE 0, ADDED 0, REMOVED 0, indexOnly 0. The round-1 run (`.packets/cure1`) printed the identical figures.

**Against the pre-cure cells (`7acc5ff1c`).** No manifest run on disk uses the pre-cure cells as its base (every run in the dock is based on the draft's cells), and the fences of this seat forbid running one. The class result is nevertheless CONFIRMED by deduction from two executed runs: the pre-cure tip read REPLACED 0 · RE-INDEXED 0 against the draft (`.packets/apply/measure-apply.json`) and the cured tip reads REPLACED 0 · RE-INDEXED 0 against the same draft, so every cell has the same pool and the same draw index at `7acc5ff1c` and at `5cfc02000`; any cell that differs between the two differs in wording only. No fact moved in either cure round. The exact WORDING-ONLY count against the pre-cure cells is NOT measured and is not claimed.

**An instrument row on the figure itself (unexplained, not resolvable read-only):** against the one draft base, the apply run read WORDING-ONLY 1044 cells · 522 towns / UNCHANGED 72240, and both cure runs read WORDING-ONLY 522 cells · 261 towns / UNCHANGED 72762 — exactly half, in cells and in towns. Half of the block's changed cells cannot have returned to the draft's wording: only a handful of cures took a draft face verbatim (UNWALLED-SMALL v1 f1, v1 f2; WALLED-STRAINED v2 f1's clause). Either the two gates ran the classifier from different trees or with a different audience filter, or the figure is counting something the printed fields do not name. The APPLY gate for the block should re-run the manifest against BOTH bases (`cells-draft.json` and a fresh `cells-apply.json` cut at `7acc5ff1c`) and print the figures side by side before the block lands.

## 6. Tokens and round counters

**Tokens, as handed by the workflow:** cure rounds **1,728,039** (the two rounds together, the curers, the two gates and the ten refuters; printed as handed, not measured by this seat). For the record beside it, the prior judgment's handed figures were draft 0 · refine 0 · refute 177,892.

**Round counters, as handed and as read:** `maxCureRounds` 2; every pool ran two cure rounds (`cure-round-1.md`, `cure-round-2.md` on disk in all five); the per-pool `rounds` object in the gate's measure still carries no counter (`draftRounds 0 · refineA false · refineB false · files []` on every pool), the same instrument row as before.

**Totals of this ruling:** targets 29; **CURED 26**; **FACE-LEVEL REFUSAL ROWS 3** (WT v3 f2; WQ v1 f2; WQ v2 f3); faces reverted 0; faces or variants removed 0; variants 12 (unchanged); gate refusals in any round 0; targets cured at round 1 and PASSED at r1: 21; targets FAILED at r1: 7 (WT v3f0, v3f2; WQ v1f3, v3f1, v3f3; WS v2f3; and none else) plus 1 WITHHELD (UL v2f2); of those 7, cured at round 2 and PASSED at r2: 6; still FAIL at r2: 1 (WT v3f2); PASSED at r1 and FAILED at r2 without a round-2 cure: 2 (WQ v1f2, v2f3); non-target new findings carried, uncured at HEAD: 2 (WQ v1 f0 W8; UL v1 f2 W1).

## 7. Rows for the chair (none is a verdict)

1. **The instrument miss that shaped round 2.** The workflow recorded "refuter returned nothing" for all ten refuter seats while the journal holds all ten structured results; the carry rule then re-dispatched round 2 with round 1's targets and quotes. Every round-2 seat reconciled by hand and no face was wrongly cured, but the miss cost a re-refutation of 23 already-passed faces and left the WALLED-QUIET round-2 verdicts journal-only (no packet file). The parser of `rewrite-block-cure.workflow.js` should be checked against the refuter's result shape (`{dir, verdicts[], newFindings[], readAloud[]}`), and the QUIET round-2 result should be written into the pool directory from the journal by the chair's hand so the pool's record is whole on disk.
2. **The two QUIET refusal rows are late-ground rows.** Both failed at round 2 on a ground the round-1 refuter carried to the chair unruled and no cure round addressed; both cures are a clause or a word. The chair may (a) bank them as they stand (this ruling), (b) charter one cure round on those two faces alone, or (c) apply the one-line cures as a chair car with a re-refutation. Recorded so the register car carries the size, not just the count.
3. **The W8 tension on QUIET's frozen v1 f0** (non-target; the same ground as the v1 f2 refusal). Rule it with f2 so the pool is judged alike: exempt the shipped-floor line and say why, or cure it agentless (`… and nothing of its keeping is let go; …`) at the next chair car.
4. **UNWALLED-LARGE v1 f2's W1-letter finding** (non-target; recorded twice; one word: `the town's rank`). A chair car or the register car's sweep.
5. **The WALLED-STRAINED variant-2 same-opener pair** created at round 2 (`sameOpenerPairs 1`, v2 f1 / v2 f3 on `A {defwork}`): the owned arms are green and A11 as the refuters read it is stated for the numbered lines; whether the instrument's reading should bind sub-rows is the register car's question. The block-level frequency of `A {defwork} … at {settlement}` openers (three pools) rides with it.
6. **The manifest halving** (§5): re-run the classifier against both bases at the APPLY gate and print them side by side.
7. **The walk-figure gap** (top-level WITHHELD 9 / PASS 39 against per-pool sums 4 / 44 on 48 units) and the empty `rounds` counter — the same two instrument rows as ADDENDUM 12's, present again.
8. **Wiring rows unchanged by the cure rounds and still the chair's:** `{defwork}` NAMED BUT NEVER FILLED at this block's call sites against the desk's `defworkFill` (CAR 8b-W-2 (a)); the plural member `massive walls` against every singular presence verb in the walled pools; ARCH §6.3's `NARROWS: gate` proposal for THREATENED/QUIET (would empty a clause from 24 wordings); whether DS-DEF-5's full-pay cell can fire on a town whose gate reads below one (the STRAINED key's page); the card's `may claim` line naming `present` alone against the chair's brief ordering every read stated.
9. **Corpus-grain mannerisms** the refuters logged for the register car (none a law a pool breaks): `The country … is quiet` on three QUIET sub-rows; `live` in nine of twelve QUIET wordings; the lexeme keep across all four THREATENED variant-3 faces; `full` in four of twelve THREATENED faces; `the town('s)` in five of eight STRAINED faces; `village size or under` twice in SMALL variant 1; the band-then-`No wall` two-sentence frame across SMALL v2 f1 and LARGE v1 f1; the `On the roll` two-word opener across QUIET v3 f1 and STRAINED v1 f3.
10. **What the APPLY gate does with this ruling:** nothing to revert, nothing to trim; the block goes forward as the 48 rows at `5cfc02000` with three banked faces; the declared walkers of the dock (`tests/copy/voiceMechanics.test.js`, `tests/data/dossierStateProseProjection.contract.test.js`) and `tests/ui` whole are the APPLY gate's to run, not this seat's.

--- REVERTS
(none)

--- REFUSALS
ds-def-11--walled-threatened | variant 3 | face 2 | R-DA-18 costume in the syntax (a fronted reduced-passive participial adjunct, the shape the refiner struck from this variant — a §21.2 regression; `the whole of its upkeep` a synonym swap inside f1's `kept at full cost` frame) and A5 / the four-faces rule against 3-f0 (the identical main clause `the {defwork} at {settlement} stands`, the gate as a non-finite adjunct in both, the close on the same two nouns swapped); FAIL at r1 (A5 against f3) and at r2; cure: the gate on the wall in a finite clause, gate first, the country closing, no participle, no periphrasis, the main clause not f0's
ds-def-11--walled-quiet | variant 1 | face 2 | W8 THE ANGLES: the gate carried as the town's act (`the {defwork} the town keeps up stands`), which W8 refuses for the visitor; the r1 PASS rested on a mistaken identity of the judge's carve-out (the draft's agentless `nothing of its keeping is let go`); a re-fronted circumstance the chair's cure named to cut; PASS at r1 (carried), FAIL at r2; cure: the gate as the wall's kept state, no agent, no fronted circumstance, the country scope and the one negated surface kept
ds-def-11--walled-quiet | variant 2 | face 3 | the elder's angle dropped: the progressive `is standing` frames the presence as an ongoing activity where the skeleton licenses the elder's length only in the stative's own aspect; the refiner had removed it, the chair's cure line named it for sharpening beside the flat close, the curer kept it; plainer than the shipped `stands` with no law behind the change; PASS at r1 (carried), FAIL at r2; cure: `stands` for `is standing`, the construction and landing kept
