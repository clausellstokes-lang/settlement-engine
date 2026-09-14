# SKELETON — DS-DEF-2 · pool `Internal Security: full legal chain (court AND prison)`

Marker: Fable 5.1, for the Fable chair (REWRITE car 8b, block DS-DEF-2). Dock read at `laneRW-DEF2` = f2da5a3ee. Packet written section by section under the checkpoint law; a section marked (pending) is not yet written. Resumed by a second marker seat at checkpoint 2 (the first seat was cut off after checkpoint 1; §0.1 to §0.3 verified byte for byte against the card and annex re-read at f2da5a3ee and kept). Read only; nothing in the dock was edited or run beyond the licence-card script.

## 0. THE CARD AND THE SHIPPED ROWS (checkpoint 1)

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: full legal chain (court AND prison)'`)
```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: full legal chain (court AND prison)`)
  reads:      court   (not-produced)
              prison   (not-produced)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  court truthy (no literal)  AND  prison truthy (no literal)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation; the relation is the MODIFIER's property, fixed at its freeze (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
              n/a
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on the PRODUCER-TOKEN ROOT `court`, which is coarser than this pool's own read `court`: a mount counted there may be reading a sibling field of the same root
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  may claim:  that `court` (truthy (no literal) AND truthy (no literal)) holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `law`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```
The census row (`docs/content/wiring-census.json:1413-1482`): `status: RESOLVED` · `keyFunction: internalRowPoolKey` · `rung: literal` · `reads: ["court", "prison"]` · `readsGrain: branch` · `predicate: court truthy AND prison truthy` · `absent: {court: not-produced, prison: not-produced}` · `variants: 3` · `grammars: 1` · `objectClasses: ["law"]` (so the card prints the bar "another civic object of the class `law`": the class list is `court, prison, gaol, law, justice, magistrate, assize`, `wiringCensus.js:1311`) · `covert: false` · `sites: ["defense.threatAssessment"]` · `k: 1` · `rateBp: 3932` · `source.kind: ""`, `kinds: []`, `holder: null`, `holderReason: "no mapping row resolves any field this pool reads"`, `standing: SOURCE-UNRESOLVED`, `twoSource: false`.

### 0.2 The block's header lines (annex `### DS-DEF-2`, `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`)
- RECEIPT: `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `DefenseTab.jsx:150-183` · the walls predicate `causalState.js` (`defenseProfileHasWalls`).
- STATE-KEY: five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags, and `compound.inst`.
- SLOTS: `{settlement}` `{band}` `{route}` (the card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` proper but unfilled here).
- SECTION-TARGET: `defense`.
- PROVENANCE + FENCE: each branch holds exactly ONE string, so every settlement in a branch says the same words; the walls read must ride `defenseProfileHasWalls` (a fence on the Invasion and Beasts rows, not on this one); "Institution presence is a STANDING fact with no recorded history; the causal clauses here are capability clauses (walls without people cannot be held) and never historical ones (walls built after a siege) unless the history surface supplies the ancestry." That sentence DESCRIBES the shipped text and licenses nothing (ADDENDUM 8 ruling 2: the card binds on cause). On THIS row the fence's "capability clause" allowance is narrower than the shipped text takes it: the card's `may NOT` bars a cause and a second fact outright, and the ENTAILMENT table lists "enforcement" and "sentencing" as NOT ENTAILED by the court flag.
- The register card's six one-line registers: the dossier (the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener) · the NPC ladder · the Herald · the chronicle · the DM page · chrome and the docent. This pool is DOSSIER (R1 STATE, a spine, the player face, no mark).

### 0.3 The shipped rows, verbatim (annex `:2660-2663`)
1. `[ledger]` {settlement} can arrest, try and hold, and having all three means the town's law is a process rather than a threat.
2. `[street]` A thing done wrong at {settlement} goes somewhere and takes time, and the town has come to rely on that rather than on the watch's temper.
3. `[visitor]` A stranger who brings a complaint at {settlement} is given a procedure rather than a favour, and the procedure runs.

Three shipped variants; the card's angle set (ledger · street · visitor) matches the three tags one for one.

### 0.4 WHAT THE KEY READS, IN THE ENGINE'S OWN TERMS (checkpoint 2; read from code at f2da5a3ee)
- The key: `internalRowPoolKey(civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison))` (`defenseStateProse.js:657-659`); `civicFlag(v)` is `v === true` (`:309-311`); the key returns this pool's literal only when BOTH are true (`:506-510`). The census reads the branch's own fields `court` and `prison` on rung 1 (the ROW 3 docblock at `:369-376`: deliberately not tabled; "this block's only fact pair").
- `court` = `compound.inst.hasCourtSystem`, minted at generation by a lower-cased SUBSTRING match over the native institution names against `['courthouse','court buildings','democratic assembly','city hall','town hall']` (`priorityHelpers.js:55`). `Town hall` and `City hall` are required rows at their tiers, so every generated town and city sets it from a meeting hall (entailment L-16, D-15; label bar W14: "a civil arbitration is recorded, a criminal trial is not").
- `prison` = `compound.inst.hasPrison`, the same match against `['prison','stocks','large prison','massive prison']` (`:54`); the shipped town row `Small prison/stocks` holds cells (D-16 HOLDS: people can be held; L-17: "stocks are not a prison" is itself a label read).
- Both flags are FROZEN booleans minted over the raw roster at generation and never re-read (entailment G-13): a calamity later in the run does not clear them. The prose therefore states the RECORD's standing fact, never the present building.
- What the two reads ENTAIL, per the ratified table (ADDENDUM 13 part A, item 6; the refuters read `ENTAILMENT-TABLE.draft.md` D-15/D-16 directly): court flag → "a process that runs" CONDITIONAL on a `Courthouse` / `Multiple courthouses` / `Multiple court buildings` row; the pool cannot resolve it (the flag may be a hall); NOT ENTAILED: judges, a code of law, sentencing, enforcement (the prison branch), impartiality. Prison flag → HOLDS: people can be held; public punishment CONDITIONAL on the town tier (unresolvable at the pool grain); NOT ENTAILED: capacity, conditions, sentences, a gaoler, anyone currently held.
- The referent layer of BOTH reads is BODY (a flag reaching an institution row): `REFERENT-TABLE.draft.md:58` "the court (body) only where a courthouse row resolves; otherwise the function word ('the town's law')"; `:59` "the gaol · a place of confinement" (BODY flag, no holder kind). No holder resolves (`holderTable.js:324-330`: the `court` kind is backed only by `Courthouse` / `Multiple court buildings`, and the card prints SOURCE-UNRESOLVED), so NO record word and NO citation (W24, arm A13).
- The civic class `law` = `court, prison, gaol, law, justice, magistrate, assize` (`wiringCensus.js:1311`). The card's bar "another civic object of the class `law`" leaves the key's own two objects (the court system; the place of confinement) and refuses a third (a magistrate, an assize, "justice" as a thing). NOTE for the chair: "the gaol" is in the class list but names the SAME object as `prison` and is the referent table's ratified safe word; the marker reads it as the prison read's own noun, not "another" object. Vetoable.
- Slots: `{settlement}` is the only FILLED slot; every face must carry it (a face whose slot set differs from its parent is refused, ARCH §2.5). ARCH §2.5's seam contract as read: a sentence face opening on a `proper`-typed slot of the block's bag is refused (T-F8), so the shipped V1 opener "{settlement} can ..." does not survive as a FACE opener; the token sits inside the sentence. `{band}` is RESERVED: no face names the row's `scoreBand` badge or `scores.internal` (label trap L-42). The pool is the row's SPINE (role spine): modifiers follow it by salience, so each face should close on a noun a modifier can carry forward (THE THREAD, MOVE-GRAMMAR §1.4.1).

---

## 1. VARIANT 1 `[ledger]` (checkpoint 2)

**(1) Number and angle.** Variant 1 · `[ledger]` · `[grammar: V1]` as the census counts it (grammars: 1 for the pool).

**(2) Shipped, verbatim.** `{settlement} can arrest, try and hold, and having all three means the town's law is a process rather than a threat.`

**(3) Every claim, one per line** (licence · law broken · REFERENT LAYER beside the read's layer, BODY for both `court` and `prison`).
- C1 "{settlement} can arrest" · UNLICENSED: an observable the fields do not hold (D-15 NOT ENTAILED: enforcement; arrest is the watch's act and no watch row is read). Layer: BODY (the arresting force, an imported body) ≠ the read's BODY (court flag, prison flag) · W20; the settlement as the agent of a body's act is the fused-agent shape, W23.
- C2 "{settlement} can ... try" · UNLICENSED: an observable the fields do not hold at this grain (D-15 CONDITIONAL: "try" only where a courthouse row stands; the flag is satisfied by a town hall on every town and city; label bar W14: "a criminal trial is not [recorded]"). Layer: BODY (court) matches the read's layer ONLY on a courthouse town; the pool cannot resolve which.
- C3 "{settlement} can ... hold" · LICENSED `prison` (D-16 HOLDS: people can be held; `Small prison/stocks` "Holding cells" p 1.0). Layer: BODY (the place of confinement) = the read's BODY.
- C4 "having all three" · UNLICENSED: a count (three) and a totality over the town's capacities, one of which is unlicensed; the card bars a count. Layer: NONE.
- C5 "means" · UNLICENSED: the MEANING move (the gloss; MOVE-GRAMMAR §1.3 "does not exist"; the register card "explains what a fact means"). Layer: NONE.
- C6 "the town's law" · LICENSED `court` as the referent table's function word for the flag (`REFERENT-TABLE.draft.md:58`): the record holds a court system. Layer: BODY (the court-system row, named by its function) = the read's BODY.
- C7 "[the town's law] is a process" · UNLICENSED: D-15 "a process that runs" is CONDITIONAL on a courthouse row, unresolvable here; a hall's recorded service is a civil arbitration at p 0.8, not a criminal process. Layer: BODY (court) conditional.
- C8 "rather than a threat" · UNLICENSED: a CONTRAST whose rejected alternative names no sibling pool key or band ("a threat" is not `no legal infrastructure` and not `detention without process`; R-DA-02, MOVE-GRAMMAR §1.4 wall 5); "threat" also imports the watch's conduct (a second fact; a standpoint). Layer: NONE.
- C9 (implicit) "the town" as the possessor of the law · LICENSED (the possessor is the settlement, W1's safe form). Layer: NONE (a possessor, not a body).
- C10 the opener "{settlement} ..." · lawful in the annex row (R-DA-17: one settlement-opener variant per pool; this is the pool's one) but NOT as a face opener (T-F8, ARCH §2.5; see §0.4).

**(4) THE READS THE REWRITE MUST STATE.** (i) `court` truthy: the record holds a court system, stated through the function word "the town's law" (or "a court system on the record"; never "the court" as a body, never "the hall"). (ii) `prison` truthy: the record holds a place of confinement, stated as "people can be held" / "a place of confinement" / "the gaol" (the ratified safe words). Both as STANDING facts of the record, present tense, no cause, no count, no second fact. Plus the shipped sentence's licensed claims, carried: C3 (can hold), C6 (the town's law), C9 (the town as possessor).

**(5) THE ANGLE'S STANCE.** `[ledger]` is a STANDPOINT, not a holder (W24, W27): the clerk states the two flags as entered on the record, in the office's formula ("entered as standing", "on the record", "the record holds"), and may set the two facts side by side as a compiled pair; it may NOT cite any roll, book or record (SOURCE-UNRESOLVED; arm A13; W24 "no record word at all"), may NOT count ("all three"), may NOT gloss what the pair means, may NOT name the watch, a magistrate, a trial, a sentence, or the hall, and may NOT contrast the town with a state no sibling key names. The block's PROVENANCE fence licenses capability clauses only where the entailment holds: "can be held" is the one capability licensed; "can try" is not.

**(6) THE TURNS WORTH KEEPING (verbatim, lawful as they stand).**
- "the town's law" (C6): the function word for the court flag; a face may carry it as the court read's noun.
- "hold" (C3): the prison read's own verb; "{settlement} can ... hold" survives as "the town can hold" / "people can be held at {settlement}" (the verb is the turn; the settlement-opener form does not survive as a face opener).
- The PAIRED shape of the ledger line (two capacities set side by side and read as one record) is the lawful construction; the count "all three" and the gloss are what fall out of it.

**(7) WHAT WOULD MAKE THE REWRITE A REGRESSION HERE.**
- An inventory line: "{settlement} has a court and a prison." (the key fact with no angle and no construction; ADDENDUM 7 rule 3).
- Losing the prison read's licensed capability (people can be held) or the court read's function word (the town's law), so that a face states one flag and not both.
- Keeping "try", "arrest", "all three", "means", or "rather than a threat" as a density floor: each is UNLICENSED and its weight must be replaced with licensed specificity (the record's two standing facts, the pair stated as a pair), never with nothing.
- Adding a body word the read does not reach (the watch, the court as a building, the hall, a magistrate, a gaoler), a citation, a duration, a history ("has come to"), or the band word.
- Dropping the `[ledger]` angle into a street or visitor construction, or opening the face on `{settlement}`.

## 2. VARIANT 2 `[street]` (checkpoint 3)

**(1) Number and angle.** Variant 2 · `[street]`.

**(2) Shipped, verbatim.** `A thing done wrong at {settlement} goes somewhere and takes time, and the town has come to rely on that rather than on the watch's temper.`

**(3) Every claim, one per line** (licence · law · REFERENT LAYER beside the read's BODY).
- C1 "A thing done wrong at {settlement}" · a FRAME, not a claim: it names no body, count, cause or person; it presupposes only that offences are a category the record knows, and the `law`-class key itself asserts that much. LICENSED as a frame whose predicate must be a licensed read. Layer: NONE.
- C2 "goes somewhere" · UNLICENSED as written: a PROCESS claim (the wrong is taken up and moved along) is D-15's "a process that runs", CONDITIONAL on a courthouse row the pool cannot resolve (W14: a hall records a civil arbitration, never a criminal process). The licensed CORE under it (the record holds a court system and a place of confinement, so there IS a somewhere) survives only when the somewhere is named as the licensed thing. Layer: BODY (court) conditional; the place of confinement, BODY = the read, if the face lands there.
- C3 "and takes time" · UNLICENSED: a duration (a season-class claim the card bars) and an observable no field holds (D-15 NOT ENTAILED covers the procedure's conduct). Layer: NONE.
- C4 "the town has come to rely on that" · UNLICENSED three ways: a HISTORY ("has come to") from a standing flag (R-DST-B: a configuration field licenses a structural clause, never a historical one; the block's own fence says presence has no recorded history); a BELIEF FRAME / FEELING ("rely on": a disposition of the town, no field holds it; MOVE-GRAMMAR §1.3 FEELING); the town as a deciding collective is the fused-agent shape (W23) and, at its edge, a person-class subject (W22). Layer: AGGREGATE stood in for a mind; refused.
- C5 "rather than on the watch's temper" · UNLICENSED four ways: a BODY imported on a `court ; prison` flag read (referent finding D-F4 HOLDS, `REFERENT-TABLE.draft.md:524`; W20); "the watch" as a NAME licensed only where `Town watch` / `Professional city watch` resolves, unread here (W13, ADDENDUM 13 A item 5); "temper" is a character adjective on a body (seen not meant, R-DA-14; NL-5); a CONTRAST naming no sibling key (R-DA-02). Layer: BODY (watch) ≠ the read's BODY.
- C6 (implicit) "the town" as the possessor · LICENSED (W1's safe possessor). Layer: NONE.
- Note: the `prison` read is present only by implication inside "goes somewhere"; the variant states neither flag by name.

**(4) THE READS THE REWRITE MUST STATE.** (i) `court` truthy: the town's law is on the record (the function word; never "the court" as a building, never "the hall"). (ii) `prison` truthy: a place of confinement / people can be held / the gaol. Plus the licensed residue of the shipped line: the street's frame C1 (a thing done wrong at {settlement}) and the possessor C6; C2's licensed core (there is a somewhere, named as the licensed place) may be carried only in that named form.

**(5) THE ANGLE'S STANCE.** `[street]` is the town's own day-to-day eye (a STANDPOINT, W27): it may state the two recorded facts as what the town has to hand when a wrong is done (a place a wrong goes; a place it is held), in plain nouns, from the offence's side rather than the record's. It may NOT name the watch or any force (no force row is read), may NOT give the procedure a duration, a temper, a habit or a history, may NOT say what the town relies on, thinks or has learned, and may NOT contrast the town's law with a state no sibling key names. The PROVENANCE fence's "capability clause" allowance reaches only "can be held".

**(6) THE TURNS WORTH KEEPING (verbatim, lawful as they stand).**
- "A thing done wrong at {settlement}" (C1): the street's opener frame, lawful, with `{settlement}` carried inside rather than first; it is the construction that makes this face a street face and not a ledger line.
- "goes somewhere" (C2): keepable ONLY with the somewhere named as the licensed place (to the town's law; to a place of confinement); as a bare process clause it is a conditional the pool cannot resolve.
- Nothing after the first comma is lawful.

**(7) WHAT WOULD MAKE THE REWRITE A REGRESSION HERE.**
- An inventory line ("{settlement} has a court and a gaol") or a ledger construction under a street tag (W4 the construction contract: the street's offence-side frame is this variant's declared shape).
- Keeping "the watch", "temper", "takes time" or "has come to rely" as a density floor; each is UNLICENSED and its weight is replaced with licensed specificity (the two places the wrong goes, from the street's side), never with nothing.
- Losing the second read: a face that states only where a wrong goes and never that it can be held (or the reverse) has dropped a card read.
- Adding a duration, a queue, a habit, a body word, a citation, or the band word; a face whose subject changes mid-passage and hands nothing back to the spine's nouns (THE THREAD).

## 3. VARIANT 3 `[visitor]` (checkpoint 3)

**(1) Number and angle.** Variant 3 · `[visitor]`.

**(2) Shipped, verbatim.** `A stranger who brings a complaint at {settlement} is given a procedure rather than a favour, and the procedure runs.`

**(3) Every claim, one per line** (licence · law · REFERENT LAYER beside the read's BODY).
- C1 "A stranger" · the visitor's eye, lawful as a STANDPOINT (W27) so long as it only sees. Layer: NONE (a stance word, never a referent).
- C2 "who brings a complaint" · UNLICENSED: the stranger ACTS (W27: "it may see, never act, decide, be told or be given a name"); and "a complaint" as a thing the town receives is the watch's `Crime reporting` record or the court's docket, neither read (referent G-F10 / G-F18 class: a complaint is a body's record). Layer: PERSON as agent; refused by product scope (W22).
- C3 "is given a procedure" · UNLICENSED twice: the stranger is GIVEN something (W27); the giving implies an office that gives (a ROLE act the read does not record, W22); and "a procedure" is D-15's CONDITIONAL entailment (a courthouse row, unresolvable; on a hall the recorded service is a civil arbitration for commercial and civil disputes at p 0.8, never a stranger's complaint at large). Layer: BODY (court) conditional, with a PERSON recipient.
- C4 "rather than a favour" · UNLICENSED: a CONTRAST naming no sibling key (R-DA-02); "favour" imports IMPARTIALITY, listed NOT ENTAILED at D-15; a standpoint on the office's conduct. Layer: NONE.
- C5 "and the procedure runs" · UNLICENSED: D-15's "a process that runs" verbatim, CONDITIONAL on a courthouse row; and a DOUBLED BEAT restating C3 (W6). Layer: BODY (court) conditional.
- C6 the `prison` read · ABSENT from the variant entirely: the shipped visitor line states one flag (conditionally) and never the second. Not a claim; an omission the skeleton rule refuses in the rewrite.
- Nothing in this variant is LICENSED beyond the stance word "a stranger" and the slot `{settlement}`.

**(4) THE READS THE REWRITE MUST STATE.** (i) `court` truthy: the town's law is on the record, as a thing a stranger finds standing (the function word; never the court as a building, never the hall, never a magistrate). (ii) `prison` truthy: a place of confinement / a gaol, as a thing a stranger finds. No shipped claim of this variant is licensed to carry, so the density floor is the two reads themselves, stated from the visitor's eye.

**(5) THE ANGLE'S STANCE.** `[visitor]` is a stranger's eye (W27): it may FIND or SEE that the town keeps its law on the record and keeps a place of confinement, stated as what stands at {settlement} to any newcomer; it may NOT act (bring, ask, complain), be given or told anything, be named, meet an office, receive a procedure, or judge the office's fairness ("a favour"); it may NOT say the procedure runs, takes time, or is impartial; and it may NOT name the building the flag rides on (a hall or a courthouse: the pool cannot tell which; W21 and A-18 bar "the hall" besides). The visitor carries the gate only as a standing state, never as the town's act (W8's principle applied to this row).

**(6) THE TURNS WORTH KEEPING (verbatim, lawful as they stand).**
- "A stranger" (C1) as the opener's stance word, and "at {settlement}" as its placing: the visitor construction (a newcomer's finding) is this variant's declared shape.
- No clause of the shipped line is lawful verbatim beyond those two fragments; there is no density floor to carry from the text, only from the card's two reads.

**(7) WHAT WOULD MAKE THE REWRITE A REGRESSION HERE.**
- Keeping the stranger as an actor or a recipient ("brings", "is given", "is told"), or keeping "procedure", "runs", "favour": each is UNLICENSED and its weight is replaced by the two reads stated from the stranger's eye, never by nothing.
- A face that states only the court read (as the shipped line does) has dropped the prison read; a face that states both as a bare list ("a stranger finds a court and a prison at {settlement}") is an inventory line.
- Collapsing the visitor construction onto the ledger's pair or the street's offence-side frame (W4).
- Naming the hall, a magistrate, a trial, a clerk, a gaoler, a queue, a wait, a fee, or the band word; citing any record; a first- or second-person address to the stranger.

## 4. THE POOL, WHOLE (checkpoint 4; the packet is complete)

**4.1 The count.** Three shipped variants, three angles (`ledger` · `street` · `visitor`), matching the card's angle set one for one. Never trim: three semantic variants stay three; each grows to four faces (twelve faces in all). Grammars today: 1 (all three are V1 PRESENT with unlicensed tails); the rewrite writes the three in distinct constructions (the ledger's compiled pair; the street's offence-side frame; the visitor's finding) so the pool carries min(k, 8) = 3 distinct level-1 grammars as MOVE-GRAMMAR §2.1 requires of a pool of three.

**4.2 The density floor for every face.** Two reads, both stated, in the angle's construction: (a) the town's law is on the record (the `court` flag, through the function word; never a body word for a building the pool cannot resolve); (b) people can be held / a place of confinement / the gaol (the `prison` flag). Plus, per variant, the licensed turns of §1(6), §2(6), §3(6). Anything below that is an inventory line (ADDENDUM 7 rule 3). Anything above that is one of the barred classes and is refused.

**4.3 The whole-pool claim inventory, by verdict.**
- LICENSED (carry): the two flags as standing facts; "the town's law"; "hold" / "can be held"; the possessor "the town"; the street frame "A thing done wrong at {settlement}"; the stance word "a stranger" with "at {settlement}".
- UNLICENSED (drop, replace with licensed specificity): "arrest" (enforcement, an imported body's act); "try", "a process", "a procedure", "the procedure runs" (D-15 CONDITIONAL on a courthouse row, unresolvable; W14); "all three" (a count); "means" (the gloss); "rather than a threat" / "rather than on the watch's temper" / "rather than a favour" (contrasts naming no sibling key; R-DA-02); "takes time" (a duration); "has come to rely on" (a history plus a belief frame plus a fused agent); "the watch's temper" (BODY on a flag read, D-F4; W13; W20; a character adjective); "brings a complaint" / "is given" (the stranger acts or receives, W27; a role act, W22); "a favour" (impartiality, NOT ENTAILED).
- WRONG-LAYER FINDINGS on this pool in the ratified table: D-F4 (`:2662`, "the watch's temper", BODY imported on a `court ; prison` flag read, HOLDS). The rewrite drops it.

**4.4 The pool-level walls a drafter must hold.**
- Every face carries `{settlement}` inside the sentence; no face opens on it (T-F8 as read at ARCH §2.5); the annex row's one settlement-opener licence (R-DA-17) is spent by V1's ROW, not its faces.
- No citation of any kind (SOURCE-UNRESOLVED; arm A13; W24 "no record word at all" on an unresolved read): no rolls, books, record, docket, the court's record.
- No body word beyond the two the reads reach, and those only in their safe forms: "the town's law" (never "the court" as a building, never "the hall", never "the courthouse"); "a place of confinement" / "the gaol" (never a gaoler, cells counted, a keeper). No watch, no muster, no guard, no magistrate, no assize.
- No count, cause, season, duration, future, standpoint on the office's conduct, second fact, band word (`{band}` RESERVED; `scores.internal` unread), history, belief, feeling, maxim, or gloss.
- No em dash, no exclamation mark, no digit, no which-clause; the present stands; the copula kept.
- THE THREAD: this pool is the Internal Security row's SPINE, so each face is the sentence a modifier follows. Close each face on a carriable noun (the town's law · the gaol · the place of confinement · the record) so a modifier can pick it up; the visitor's turn outward (the stranger) is the passage's one turn and sits where the composer puts it, so the face must also read well FIRST.
- The `law` civic-class bar: the key's two objects may be named; a third law-class object (magistrate · assize · justice as a thing) may not. The marker's reading that "the gaol" is the prison object's own word, not "another", is recorded at §0.4 for the chair, vetoable.

**4.5 What would make the REWRITE of this pool a regression, whole.**
- Any face that is an inventory line ("{settlement} has a court and a prison").
- Any face stating one read and not the other (the shipped V3 already does; the rewrite must not repeat it).
- Any face keeping an UNLICENSED shipped clause as a density floor (the list at 4.3), or replacing a dropped clause with nothing rather than with the second read stated in the angle's construction.
- Any two of the three variants collapsed onto one construction (W4), or the four faces of one variant differing in vocabulary alone (ADDENDUM 7 rule 4).
- Losing "the town's law", "hold", the street's offence-side frame, or the visitor's finding.
- A face that names the building (hall or courthouse), the watch, a magistrate, a trial, a sentence, a wait, a fee, a queue, a keeper, a count, a band, or cites a record.

**4.6 Open notes for the chair (recorded, not acted).**
- The `law`-class bar and "the gaol" (§0.4): the marker reads gaol as the prison read's own noun; if the chair reads the class bar strictly, "a place of confinement" is the only safe prison noun and the drafter should prefer it.
- The court flag on this pool is a hall on nearly every town and city (L-16); the shipped "full legal chain" wording over-reads the record on those towns. That is the KEY's naming, not the marker's to change; the faces state only what the flag records.
- The shipped V3 states one read only; under never-trim its slot and angle survive, its text does not.

Marker: Fable 5.1. Read only; nothing in the dock was edited or run beyond the licence-card script. The packet is complete at checkpoint 4.
