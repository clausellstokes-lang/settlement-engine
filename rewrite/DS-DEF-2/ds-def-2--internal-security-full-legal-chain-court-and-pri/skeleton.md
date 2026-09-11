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
- What the two reads ENTAIL, per the ratified table (ADDENDUM 13 part A, item 6; the refuters read `ENTAILMENT-TABLE.draft.md` D-15/D-16 directly): court flag → "a process that runs" CONDITIONAL on a `Courthouse` / `Multiple courthouses` / `Multiple court buildings` row, which the pool cannot resolve (the flag may be a hall); NOT ENTAILED: judges, a code of law, sentencing, enforcement (the prison branch), impartiality. Prison flag → HOLDS: people can be held; public punishment CONDITIONAL on the town tier (unresolvable at the pool grain); NOT ENTAILED: capacity, conditions, sentences, a gaoler, anyone currently held.
- The referent layer of BOTH reads is BODY (a flag reaching an institution row): `REFERENT-TABLE.draft.md:58` "the court (body) only where a courthouse row resolves; otherwise the function word ('the town's law')"; `:59` "the gaol · a place of confinement" (BODY flag, no holder kind). No holder resolves (`holderTable.js:324-330`: the `court` kind is backed only by `Courthouse` / `Multiple court buildings`, and the card prints SOURCE-UNRESOLVED), so NO record word and NO citation (W24, arm A13).
- The civic class `law` = `court, prison, gaol, law, justice, magistrate, assize` (`wiringCensus.js:1311`). The card's bar "another civic object of the class `law`" leaves the key's own two objects (the court system; the place of confinement) and refuses a third (a magistrate, an assize, "justice" as a thing). NOTE for the chair: "the gaol" is in the class list but names the SAME object as `prison` and is the referent table's ratified safe word; the marker reads it as the prison read's own noun, not "another" object. Vetoable.
- Slots: `{settlement}` is the only FILLED slot; every face must carry it (a face whose slot set differs from its parent is refused, ARCH §2.5). ARCH §2.5's seam contract as read: a sentence face opening on a `proper`-typed slot of the block's bag is refused (T-F8), so the shipped V1 opener "{settlement} can ..." does not survive as a FACE opener; the token sits inside the sentence. `{band}` is RESERVED: no face names the row's `scoreBand` badge or `scores.internal` (label trap L-42). The pool is the row's SPINE (role spine): modifiers follow it by salience, so each face should close on a noun a modifier can carry forward (THE THREAD, MOVE-GRAMMAR §1.4.1).

---

## 1. VARIANT 1 `[ledger]` (checkpoint 2)

**(1) Number and angle.** Variant 1 · `[ledger]` · `[grammar: V1]` as the census counts it (grammars: 1 for the pool).

**(2) Shipped, verbatim.** `{settlement} can arrest, try and hold, and having all three means the town's law is a process rather than a threat.`

**(3) Every claim, one per line** (licence · law broken · REFERENT LAYER beside the read's layer, which is BODY for both `court` and `prison`).
- C1 "{settlement} can arrest" — UNLICENSED: an observable the fields do not hold (D-15 NOT ENTAILED: enforcement; arrest is the watch's act and no watch row is read). Layer: BODY (the arresting force, an imported body) ≠ the read's BODY (court flag, prison flag) — W20; the settlement as the agent of a body's act is the fused-agent shape, W23.
- C2 "{settlement} can ... try" — UNLICENSED: an observable the fields do not hold at this grain (D-15 CONDITIONAL: "try" only where a courthouse row stands; the flag is satisfied by a town hall on every town and city; label bar W14: "a criminal trial is not [recorded]"). Layer: BODY (court) matches the read's layer ONLY on a courthouse town; the pool cannot resolve which.
- C3 "{settlement} can ... hold" — LICENSED `prison` (D-16 HOLDS: people can be held; `Small prison/stocks` "Holding cells" p 1.0). Layer: BODY (the place of confinement) = the read's BODY.
- C4 "having all three" — UNLICENSED: a count (three) and a totality over the town's capacities, one of which is unlicensed; the card bars a count. Layer: NONE.
- C5 "means" — UNLICENSED: the MEANING move (the gloss; MOVE-GRAMMAR §1.3 "does not exist"; the register card "explains what a fact means"). Layer: NONE.
- C6 "the town's law" — LICENSED `court` as the referent table's function word for the flag (`REFERENT-TABLE.draft.md:58`): the record holds a court system. Layer: BODY (the court-system row, named by its function) = the read's BODY.
- C7 "[the town's law] is a process" — UNLICENSED: D-15 "a process that runs" is CONDITIONAL on a courthouse row, unresolvable here; a hall's recorded service is a civil arbitration at p 0.8, not a criminal process. Layer: BODY (court) conditional.
- C8 "rather than a threat" — UNLICENSED: a CONTRAST whose rejected alternative names no sibling pool key or band ("a threat" is not `no legal infrastructure` and not `detention without process`; R-DA-02, MOVE-GRAMMAR §1.4 wall 5); "threat" also imports the watch's conduct (a second fact; a standpoint). Layer: NONE.
- C9 (implicit) "the town" as the possessor of the law — LICENSED (the possessor is the settlement, W1's safe form). Layer: NONE (a possessor, not a body).
- C10 the opener "{settlement} ..." — lawful in the annex row (R-DA-17: one settlement-opener variant per pool; this is the pool's one) but NOT as a face opener (T-F8, ARCH §2.5; see §0.4).

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

## 2. VARIANT 2 `[street]` (pending)

## 3. VARIANT 3 `[visitor]` (pending)

## 4. THE POOL, WHOLE (pending)
