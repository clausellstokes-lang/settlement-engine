Block DS-DEF-2 · pool key `Beasts & Monsters: frontier, force without a perimeter` · role spine · draft round 1 · Opus writer (Seat: Opus 5, Fable-unvalidated)

The rows below are the COMPLETE replacement for the pool's three variant rows, in order, under the pool's own bold heading. The typed lines of the pool are untouched and are not repeated here. Each variant keeps its vid, its order and its own single angle tag; no variant is added, removed or merged; no `[plain]` marker appears anywhere.

**`Beasts & Monsters`: `frontier`, force without a perimeter**
1. `[ledger]` The country around {settlement} is frontier, and the town meets it with armed people and no line.
   - `[face]` Where the country is frontier, {settlement}'s provision is people under arms and no perimeter.
   - `[face]` Armed people at {settlement} stand against a frontier country and stand behind no wall.
   - `[face]` In frontier country {settlement} keeps no works, and keeps instead its armed people.
2. `[visitor]` The outward standing of {settlement} is armed people and no wall for them to hold.
   - `[face]` Armed people are kept at {settlement}, and no line is drawn about the town.
   - `[face]` The defense {settlement} carries is people and not works.
   - `[face]` Arms at {settlement} are kept in the open.
3. `[street]` Armed people make the town's defense, and the town has no wall.
   - `[face]` At the town the defense is armed people and no line.
   - `[face]` The town, unwalled, keeps armed people.
   - `[face]` Defense at the town rests on no standing work, and on the people who carry arms.

--- NOTES

**The card, cited short.** The clauses referred to below are the printed licence card for (DS-DEF-2, `Beasts & Monsters: frontier, force without a perimeter`), from `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: frontier, force without a perimeter'`:
- **MAY** — "that the reader `beastsRowSituation(family, perimeter, force)` selects the row `frontier country, force without a perimeter` of `BEASTS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record".
- **PRED** — `beastsRowSituation(family, perimeter, force) === frontier country, force without a perimeter`.
- **BAG** — `{band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`.
- **ROLE/FORM** — role `spine`, form `sentence`, relation none (a spine takes no relation), attach empty, move none declared, angle set `ledger street visitor`.
- **NOT** — a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`.
- **SOURCE** — `muster`, standing LICENSED; a citation of this holder is licensed where the provenance budget allows.
- **ECHO** — spine mounts 1 (tab `defense`); the echo key is the whole table-rung reading, so every pool selecting a row of `BEASTS_ROW_POOL` shares it.
- **REFUSED COLUMNS** — a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

**The claim sets, and the fact that they differ by variant.** MAY/PRED is one row with three named halves: the family value (`frontier` country), the force (present), the perimeter (absent). The rewrite keeps exactly the halves each shipped variant already asserted and adds none:
- **V1** carries all three halves — the shipped V1 said "on an open frontier" (family + no perimeter) and "keeps armed people" (force). All four of its faces name frontier country, the armed people and the missing perimeter.
- **V2** carries two halves — force and no perimeter. The shipped V2 said "soldiers … and no wall"; it never named the country. None of its four faces names the frontier, because adding it would ADD a claim.
- **V3** carries the same two halves — force and no perimeter. The shipped V3 said "can answer trouble and cannot prevent it", which is the force and the missing perimeter read as capacity; the capacity reading itself is dropped (below). None of its faces names the frontier.
The four faces of each variant are claim-equal to each other, which is what arm A6 reads (across the faces, not back to the shipped sentence). Slots are exactly BAG's FILLED set: `{settlement}` in every face of V1 and V2, and in no face of V3, whose parent row carries no slot — the face slot set matches its parent's in all twelve (ARCH §2.5's refusal). `{band}` and `{route}` are never written.

**Face-by-face licence.**

*Variant 1 `[ledger]` — the record's own accounting: the country's value first, the arrangement against it second.*
- Numbered face ("The country around {settlement} is frontier, and the town meets it with armed people and no line"): the family half by MAY/PRED; the force half and the perimeter half by MAY/PRED; `{settlement}` by BAG. Grammar V1 (PRESENT), the lack riding inside the row's own value rather than as a separate ABSENCE move.
- Face 2 ("Where the country is frontier, {settlement}'s provision is people under arms and no perimeter"): the same three halves by MAY/PRED, fronted as a conditional frame on the family value. The frame is not a cause: it names the row's own predicate, not a reason for the arrangement.
- Face 3 ("Armed people at {settlement} stand against a frontier country and stand behind no wall"): three halves by MAY/PRED. The repeated verb is a deliberate rhythm; §1.4.1 makes a noun echo lawful and the register card licenses the recurring WORD where the FACT does not recur.
- Face 4 ("In frontier country {settlement} keeps no works, and keeps instead its armed people"): three halves by MAY/PRED. The rejected alternative ("works") is named by the sibling pool key `Beasts & Monsters: frontier, credible deterrence`, which is what MOVE-GRAMMAR §1.4 constraint 5 requires of a CONTRAST; it is not fronted as the subject, and it is not the closing move (the face closes on the armed people).

*Variant 2 `[visitor]` — the town's outward standing. The angle survives as stance and vocabulary; the observer does not.*
- Numbered face ("The outward standing of {settlement} is armed people and no wall for them to hold"): force and perimeter halves by MAY/PRED; `{settlement}` by BAG.
- Face 2 ("Armed people are kept at {settlement}, and no line is drawn about the town"): both halves by MAY/PRED; closes on the civic object (the town), not on a pronoun.
- Face 3 ("The defense {settlement} carries is people and not works"): both halves by MAY/PRED, with the sibling-named contrast; this is the pool's one contrast close (constraint 5's "never the closing move of more than one variant per pool" held).
- Face 4 ("Arms at {settlement} are kept in the open"): both halves by MAY/PRED, the perimeter half compressed into "in the open". The compression is the ceiling under §21.4, not a loss of the claim: the row's value IS the open state, and the shipped corpus already uses the term in this pool's own family ("on an open frontier").

*Variant 3 `[street]` — the town's plain working idiom, with no mind and no slot in it.*
- Numbered face ("Armed people make the town's defense, and the town has no wall"): both halves by MAY/PRED. "The town" is the corporate subject the block already renders, not a totality over persons (REFUSED COLUMNS held).
- Face 2 ("At the town the defense is armed people and no line"): both halves by MAY/PRED.
- Face 3 ("The town, unwalled, keeps armed people"): both halves by MAY/PRED, the perimeter half carried by the interrupting adjective. This is the pool's short line (six words), which R-DA-05 and NL-2 keep reachable.
- Face 4 ("Defense at the town rests on no standing work, and on the people who carry arms"): both halves by MAY/PRED, the absence placed inside the sentence rather than at either end, closing on the force. "who" is a relative on a person, not a `which`-tail (wall 6 / R-DA-03 held).

**Claims DROPPED from the shipped variants, each with the clause that refuses it.**
- V1's "which means the defense is reactive" — a `which`-tail (wall 6 / R-DA-03), a CAUSE (NOT) and a second fact (NOT); MOVE-GRAMMAR §1.3's MEANING non-move, the gloss on the fact just stated.
- V1's "whatever comes chooses where the fighting happens" — a second fact (NOT), an inanimate/unnamed actor with intent (R-DA-11), and an assertion about events the card holds no provenance field for (R-DST-B/A6: a standing configuration field licenses no historical or event clause).
- V1's "and the town arrives afterwards" — a FUTURE (NOT) and a FORECAST (MOVE-GRAMMAR §1.3; A2; THE PROMISE's state-never-fate).
- V2's "A stranger finds … at {settlement}" — a STANDPOINT (NOT) and a person the block holds no field for (R-DA-14). Ruled the same way in this wave's `DS-DEF-1 readiness ADEQUATE` packet; the `[visitor]` tag is kept because the card's angle set licenses it, and the angle is carried by the outward stance instead of by an observer.
- V2's "soldiers" — a claim about the KIND of force. The card's predicate holds `force`, not its kind; `DS-DEF-2`'s own `Invasion & War` rows are where professional-versus-militia is typed, and asserting it here is R-DA-15's unlicensed office (fault 24, hollow specificity). Replaced by the unqualified "armed people" / "arms".
- V2's "can see how that would go against anything that arrived in more than one place" — a standpoint (NOT), a COUNT ("more than one", NOT), and a subjunctive outcome that is a second fact.
- V3's "can answer trouble and cannot prevent it" — the capacity reading of the row, i.e. a second fact (NOT). The block's PROVENANCE FENCE does license *capability* clauses generally, but this card refuses a second fact outright and its MAY names the row's selection alone, so the capacity gloss is dropped rather than argued. It is also the closest thing in the shipped text to an implied threat claim, which the family value alone does not license in V3 (V3 never named the country).
- V3's "and the difference costs it something every season" — a SEASON (NOT), a CONSEQUENCE with no event provenance (double-licensing failed, MOVE-GRAMMAR §1.2 row 7), and a second fact.
Nothing was added. No face makes a claim its shipped variant did not already make, and every kept claim resolves to MAY/PRED.

**Refusals: NONE.** All three variants are lawful as written. Three law-tensions were resolved rather than refused, and each is declared here for the chair.

1. **Every face is one sentence, and that is the card, not a template.** Each shipped variant's extra material was unlicensed, and the card refuses a second fact, so no lawful second sentence exists for this pool: a second sentence could only restate the first, which is R-DA-03's summarising second sentence and best-ai's own signature (§16 row 6). §22's "cutting sentences is trimming" is read as §22(a) defines the ratcheted unit — the VARIANT and its slot — so the pool keeps three variants and gains nine faces, and the counts only rise. Under §21.3, where one effort must choose between the sharper wording and the licensed one, the licensed one wins. Chair's to veto.

2. **The pool is V1-only in grammar, and that is the licence filter, not a flattened pool.** MOVE-GRAMMAR §2.1 asks a pool of two or more for at least two distinct level-1 grammars, and its own filter clause removes every member whose licensing field is null. This card holds one reader, no relation, no attach, no move and no event provenance: V2 (structural-consequence field), V4 (named object), V5 (institution row), V6 (unresolved state value), V7 (event provenance) and V8 (`not-held` with provenance) are all filtered out. V3 (PRESENT → LACK) is arguably reachable, since the row's value carries the missing perimeter, but the lack here is half of one selected row rather than a separate `none-exists` field, so it is written inside the PRESENT and not tagged as a second move. The variation the pool carries is angle, vocabulary, word order and length. These are AUTHORED V1s, not the classifier's silent fallback, and should be excluded from any "nothing recognised" figure (§4.4.2).

3. **Zero citations, though the card licenses one.** SOURCE resolves to `muster`, standing LICENSED, so a provenance move is available under the §24 ceiling of one per unit. None is written. None of S3's three reasons obtains here: the record carries no two accounts that disagree, the pool states no count from an interested party, and nothing on this card makes the muster's keeper a power. The exemplar registers with raw text cite at 0 per 786 sentences, and a citation on twelve faces of one pool would be exactly the habit §24 names as a refuter's finding. Recorded as a deliberate refusal of an available licence, not an oversight.

**Sibling checks run (arms A1 and A11).**
- Against the co-family siblings in this block — `frontier, credible deterrence`, the three `plagued` rows and the two `settled` rows — no face restates or contradicts them. "Most of what comes out of the country will not press a defended perimeter" is the deterrence row's claim and appears nowhere here; no face says the country is quiet (`settled`) or thick with creatures (`plagued`); no face says the town has a line, which is what the deterrence row holds and this row denies.
- Against `Invasion & War`: force with NO walls, whose shipped text is structurally near-identical ("keeps a professional force and no perimeter"), the distance is deliberate. That row's claims are siege, raiders and profession; none of the twelve faces names a siege, a raid, an attacker, an army or a professional, and none names the force's kind.
- Against the block's other rows (`Internal Security`, `Economic Survival`, `Disasters & Famine`) — no court, prison, watch, revenue, reserve, granary or hospital is named anywhere in the twelve faces.
- The card's "another civic object of the class `wall`" is held: each face names the perimeter object once and once only, under exactly one name (line · perimeter · wall · works · standing work), and no gate, ditch, palisade, tower or rampart is introduced anywhere.
- The ECHO note is honoured by staying inside this row's own value: because the echo key is the whole table-rung reading, a face that reached for a neighbouring row's material would collide with a sibling ROW of the same table.

**The thread (owner, 2026-09-08 ~21:4x).** This pool is a SPINE, so each face is the passage's first sentence: it hands nouns forward rather than picking them up, and the composer places it first with modifiers following by salience. Every face plants at least two catchable nouns for whatever follows — the town or `{settlement}`, and the armed people (or the arms, or the defense) — and eight of the twelve also plant the perimeter noun. No face is a fragment, none opens on a comma or a clause-list word, none opens on the `proper`-typed `{settlement}` (ARCH §2.5's T-F8, held for the numbered rows as well as the face rows), and none closes on a clause that only sets up another. Because the card refuses a second fact, no face has an internal sentence junction for the thread to cross; the thread duty here is entirely the forward one.

**Mechanical floors checked over all twelve faces.** Zero digits · zero percent signs · zero em dashes · zero exclamation marks · zero question marks · zero `which` (the two relatives are `who`, on persons) · zero citations and zero named holders · zero second sentences · zero future indicatives · zero existential or `it is` openers (R-DA-07) · zero pronoun closers (R-DA-04) · zero ABSENCE openers and no two adjacent absences (constraint 3) · zero similes, sense verbs on abstractions and inanimate intent verbs (R-DA-11) · zero character adjectives, named persons and observers (R-DA-14) · zero belief frames (R-DA-13) · zero triads (R-DA-10) · zero totalities over persons · one CONTRAST close in the pool (constraint 5) · slots exactly `{settlement}` where the parent carries it and none where it does not (BAG; ARCH §2.5). Close kinds vary across the set: absence (line · perimeter · wall · standing work), object (the town · armed people · arms), condition (in the open), contrast (not works).

**Length spread as authored (words per face, `{settlement}` counted as one word).** V1: 17 · 14 · 14 · 13. V2: 15 · 14 · 9 · 8. V3: 12 · 11 · 6 · 16. Range 6 to 17, with the six-word line in V3 and the seventeen-word line in V1, which keeps the short-line floor and the within-pool spread reachable without a metronome.
