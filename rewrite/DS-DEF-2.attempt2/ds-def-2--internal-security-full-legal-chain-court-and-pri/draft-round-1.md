# DS-DEF-2 · `Internal Security: full legal chain (court AND prison)` · REWRITE draft, round 1

Seat: Opus 5 (Fable-unvalidated) · block DS-DEF-2 · role spine · 3 variants, 12 wordings.
Paste the block below under the pool's bold heading, in place of its three numbered rows.
The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are untouched and not repeated here.

1. `[ledger]` {settlement} holds trials and holds prisoners.
   - `[face]` Offences at {settlement} are tried, and offenders are kept.
   - `[face]` A court sits at {settlement}, and the town can keep whom the court sentences.
   - `[face]` The law at {settlement} reaches from the hearing to the cell.
2. `[street]` A wrong done at {settlement} goes to a hearing, and the person who did it goes to a cell.
   - `[face]` Law at {settlement} can hear a case and hold the person the case names.
   - `[face]` What is done wrong at {settlement} is heard in a court and served out in a cell.
   - `[face]` The cell at {settlement} holds whom the court sends.
3. `[visitor]` A stranger with a complaint at {settlement} is given a hearing, and the town has a cell for whom the hearing names.
   - `[face]` Strangers at {settlement} take their complaints to a court, and the town can hold on the court's word.
   - `[face]` The complaint a stranger brings at {settlement} is heard by a court, and answered in a cell.
   - `[face]` Newcomers at {settlement} meet a court before they meet a cell.

--- NOTES

## The card this pool is written against (printed, not paraphrased)

`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: full legal chain (court AND prison)'`
returns one licensed claim and a closed refusal list:

- **reads:** `court` (not-produced) and `prison` (not-produced); **predicate:** `court` truthy AND `prison` truthy.
- **may claim:** that `court` (truthy AND truthy) holds, **as a STANDING fact of the record**.
- **may NOT:** a count · a cause · a season · a future · a standpoint · a second fact · another civic object of the class `law`.
- **REFUSED COLUMNS, always:** a totality over persons · an exemption from a duty · a named character and that character's fate · a theological claim.
- **bag:** `{band: RESERVED, route: proper, settlement: proper}`; **FILLED at this block's call sites: `{settlement}` only.**
- **source:** `(none)` · standing **SOURCE-UNRESOLVED**. **No citation is licensed:** a face naming a record holder here is refused by arm A13. No wording below names a holder.
- **seat/form:** a spine, sentence form, no relation, no declared move; **angle: ledger · street · visitor** (the three the pool carries).
- **audience:** player (no mark).

So the whole pool asserts ONE typed triple: `(PRESENT, internalSecurityChain, "court AND prison")`. The
predicate is a CONJUNCTION and the card states it as a single `may claim`, so naming the trying limb and
the holding limb is naming one composite value at full resolution, not asserting two facts. Every wording
below realises that triple and nothing else; the four wordings of a variant are therefore claim-equal to
each other (arm A6 read across the faces), and each variant's claim set is the licensed subset of what its
shipped sentence carried (arm C-pair).

## What each shipped variant carried, kept and dropped

**Variant 1, shipped:** *"{settlement} can arrest, try and hold, and having all three means the town's law is a process rather than a threat."*

- KEPT: the town can try; the town can hold. Both halves of the card's `may claim`, as a standing fact.
- DROPPED: **"can arrest"** — arrest is the watch's power, and the card reads `court` and `prison` and nothing else. Refused by the card's `may NOT: another civic object of the class law`, and by MOVE-GRAMMAR §1.2 row 5 (an INSTITUTION assertion needs the table row; none is read here). Dropping it also removes the triad `arrest, try and hold` (R-DA-10's "two items or four, never habitually three"; the tricolon is a listed machine signature, §16 (6)).
- DROPPED: **"having all three means the town's law is a process rather than a threat"** — three separate breaches in one clause: **"all three"** is a count (`may NOT: a count`); **"means"** is the MEANING non-move, MOVE-GRAMMAR §1.3, and the summarising second beat R-DA-03 caps at 0.000; **"a process rather than a threat"** is a CONTRAST whose rejected alternative names no sibling pool key and no band (R-DA-02, order wall 5) and is a standpoint on what the arrangement is worth (`may NOT: a standpoint`; the VERDICT non-move).
- `{band}` is RESERVED and unfilled at this block's call sites, so no band word licenses a rating here either. Recorded, not smuggled in.

**Variant 2, shipped:** *"A thing done wrong at {settlement} goes somewhere and takes time, and the town has come to rely on that rather than on the watch's temper."*

- KEPT: a wrong done here is tried and the person is held. The shipped "goes somewhere and takes time" is that composite in the street's idiom; the rewrite states the same composite in its own nouns rather than by indirection.
- DROPPED: **"the town has come to rely on that"** — a HISTORY move (a settled disposition arrived at over time) on a pool with no event-provenance field. Refused by R-DST-B (a standing configuration field licenses a structural clause and never a historical one), by R-DA-19, and by the card's `may NOT: a cause`.
- DROPPED: **"rather than on the watch's temper"** — names the watch, a second civic object of the class `law` the card does not read (`may NOT: another civic object of the class law`), inside a CONTRAST that R-DA-02 refuses, and attributes a temper to an office (the FEELING non-move; R-DA-14).
- The shipped row's slot set is `{settlement}`; all four wordings keep exactly `{settlement}` (ARCH §2.5, the face row's refusal on a face whose slot set differs from its parent's).

**Variant 3, shipped:** *"A stranger who brings a complaint at {settlement} is given a procedure rather than a favour, and the procedure runs."*

- KEPT: a complaint brought here is met by the town's legal chain. "A procedure" names the composite value whole rather than one of its halves, so the rewrite renders the composite at full resolution (the hearing and the cell). **Judgment call, recorded for the refuters:** the sibling packet's variant 2 kept one half only because its shipped sentence named one half only; here the shipped sentence names the chain, not a limb, so naming both limbs restates the same one claim and adds none. If the sitting reads "a procedure" as the court limb alone, faces 3.1, 3.2 and 3.3 each carry the holding limb and would be the rows to re-cut; face 3.4 would survive unchanged in shape.
- DROPPED: **"rather than a favour"** — a CONTRAST whose rejected alternative is neither a sibling key nor a band, and a standpoint on the town's conduct (R-DA-02; `may NOT: a standpoint`).
- DROPPED: **"and the procedure runs"** — a second assertion that the arrangement functions, which is a rating with no rating field behind it (the VERDICT non-move; CL-7's rule generalised: a rating word only where a typed rating field holds it) and the summarising second beat R-DA-03 caps at 0.000.
- The shipped `who brings` relative is kept in kind at 3.1 only (a restrictive identifying relative on a person, carrying no second fact); it is not a `, which` tail and does not touch R-DA-03's ceiling. No wording in the pool contains `which`.

## Per face, the clause that licenses each claim

Every row below makes exactly the claims listed. `MC` is the card's `may claim` line; `PRED` its predicate line.

| row | claims | licensing clause |
|---|---|---|
| 1 `[ledger]` | trials are held; prisoners are held | MC (the conjunction, both halves); PRED `court` truthy AND `prison` truthy |
| 1a | offences are tried; offenders are kept | MC, both halves; PRESENT (MOVE-GRAMMAR §1.2 row 1) on the standing configuration |
| 1b | a court sits; the town can keep whom it sentences | MC, both halves; the capacity form is the standing fact, not a forecast (R-DA-07) |
| 1c | the law runs from the hearing to the cell | MC, both halves stated as one extent; no cause, no order beyond the predicate's own conjunction |
| 2 `[street]` | a wrong is heard; the person is held | MC, both halves; PRESENT |
| 2a | a case can be heard; the person the case names can be held | MC, both halves; capacity form, R-DA-07 |
| 2b | what is done wrong is heard in a court; it is served out in a cell | MC, both halves |
| 2c | the cell holds whom the court sends | MC, both halves, seen from the holding end; the linkage is the pool key's own composite value, not a CAUSE |
| 3 `[visitor]` | a stranger's complaint is given a hearing; the town has a cell for whom the hearing names | MC, both halves (see the variant 3 judgment call above) |
| 3a | complaints go to a court; the town can hold on the court's word | MC, both halves; "the court's word" is the composite's internal joint, not a provenance citation (no holder is named; source is SOURCE-UNRESOLVED) |
| 3b | the complaint is heard by a court; it is answered in a cell | MC, both halves |
| 3c | a court is met before a cell | MC, both halves; the sequence is the composite's own shape, not a HISTORY move |

## The walls and bands each row was checked against

- **Walls, all clear:** no digit; no em dash; no exclamation; no question; no `which`; no citation (SOURCE-UNRESOLVED); no first or second person; no named character; no theology; no exemption; no totality over persons (`the person who did it`, `whom the hearing names`, `strangers`, `newcomers` are definite descriptions and classes, never `everyone` or `nobody`); no future indicative; no expletive opener (`There is` / `It is`); slots exactly `{settlement}` on all twelve wordings.
- **R-DA-17 / order wall 10:** the settlement token opens exactly ONE wording in the pool (row 1) and no other. Rows 2 and 3 open on `A wrong` and `A stranger`; the twelve openers are `{settlement}` · Offences · A court · The law · A wrong · Law · What · The cell · A stranger · Strangers · The complaint · Newcomers.
- **R-DA-05, spread:** word counts 6 · 9 · 14 · 11 · 19 · 14 · 17 · 9 · 22 · 18 · 17 · 11; mean 13.9, sd 4.6 (the floor is 4.0). The short line exists at row 1 (six words) and at 2c (nine).
- **R-DA-04, the close:** the closing move is a standing fact of a varied kind: object closes at 1, 1c, 2, 2b, 3b, 3c (prisoners, cell, cell, cell, cell, cell); condition closes at 1a, 1b, 2a, 2c, 3, 3a (offenders are kept, whom the court sentences, the case names, the court sends, the hearing names, the court's word). No wording closes on a pronoun (R-DA-04's `pronounRate` is 0 here).
- **R-DA-11:** no simile, no metaphor, no sense verb on an abstraction, no inanimate acting with intent. `the law reaches from the hearing to the cell` is a verb of extent on an institution, not a sense verb and not intent; `the cell holds whom the court sends` is the institution's own function.
- **R-DA-12:** no gnomic closer, no maxim, no life-general sentence. The shipped rows' three glosses are the ones dropped above.
- **THE THREAD (§1.4.1):** this pool is a SPINE, so every wording is the passage's first sentence and must hand a noun forward for the modifiers that follow by salience. Each of the twelve ends on or carries one of `court` / `cell` / `prisoners` / `offenders` / `hearing`, so a modifier can carry the noun forward from any face the roll picks.
- **Arms A1 and A11, the siblings:** the three sibling `Internal Security` pools (`court without detention`, `detention without process`, `no legal infrastructure`) are neither restated nor contradicted. No wording here denies a limb, and no wording borrows their vocabulary (`no legal machinery`, `money and exile`, `on what grounds`, `nowhere to take it`). The neighbouring rows in the block (`Invasion & War`, `Economic Survival`, `Disasters & Famine`) share no noun with these twelve beyond `the town`.
- **§16.1's three numbers:** the set is written at the ceiling (§21.1 to §21.3), not at the band's middle; position inside each band is information for the gate to print, and no wording was made plainer than its law requires (§21.4, the density law).

## Refusals

**None.** All three variants were made lawful under the card, and no face was banked as unwritable.

Two things this draft deliberately did NOT do, recorded so the refiner does not read them as oversights:

1. **No contrast was reintroduced under R-DA-02's permission.** The rule allows a contrast whose rejected alternative names a sibling pool key or band, and this pool has three sibling keys that would qualify on their face. It was refused anyway: a contrast is a second assertion about what the town is not, and the card's `may NOT` bars a second fact and a standpoint outright. If the sitting rules the sibling-key permission reaches a spine's `may NOT` line, one contrast face is available and would be the cheapest widening of this set.
2. **No provenance move was written.** Source is SOURCE-UNRESOLVED for both reads, so §24's ceiling of one citation per unit is unreachable here and arm A13 would refuse any holder this pool named.
