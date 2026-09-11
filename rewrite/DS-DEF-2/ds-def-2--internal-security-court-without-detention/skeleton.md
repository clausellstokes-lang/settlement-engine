# SKELETON — DS-DEF-2 · pool `Internal Security: court without detention`

Marker: Fable 5.1 (MARKER role, for the Fable chair; REWRITE car 8b, block DS-DEF-2). Dock read at `laneRW-DEF2` (read only; nothing edited, committed or run beyond the licence-card script). Written under the checkpoint law: sections land one at a time; a section headed (pending) is not yet written and a cut-off successor continues from the last section present.

Sections: 0 the card, the census row, the header lines, the reads in the engine's own terms · 1 VARIANT 1 `[ledger]` · 2 VARIANT 2 `[street]` · 3 VARIANT 3 `[unfolding]` · 4 THE POOL WHOLE (the reads every face must state; the composition hazards; the fences for the chair) · 5 the count.

---

## 0. THE CARD AND THE SHIPPED ROWS

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: court without detention'`, run in `laneRW-DEF2`)
```
LICENCE (block DS-DEF-2 · role spine · key `Internal Security: court without detention`)
  reads:      court   (not-produced)
              prison   (not-produced)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  court truthy (no literal)
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation; the relation is the MODIFIER's property, fixed at its freeze (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
              n/a
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on the PRODUCER-TOKEN ROOT `court`, which is coarser than this pool's own read `court`: a mount counted there may be reading a sibling field of the same root
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  may claim:  that `court` (truthy (no literal)) holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `law`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```

### 0.2 The census row (`docs/content/wiring-census.json:1486-1550`)
`status: RESOLVED` · `keyFunction: internalRowPoolKey` · `rung: literal` · `reads: ["court", "prison"]` · `readsGrain: branch` · `predicate: [{field: court, op: truthy}]` (ONE predicate row) · `absent: {court: not-produced, prison: not-produced}` · `variants: 3` · `grammars: 2` · `objectClasses: ["law"]` · `covert: false` · `sites: ["defense.threatAssessment"]` · `k: 1` · `rateBp: 1042` · `source.kind: ""`, `holder: null`, `holderReason: "no mapping row resolves any field this pool reads"`, `standing: SOURCE-UNRESOLVED`, `twoSource: false` · `slotsFilled: [settlement]`.

A CARD READING FOR THE CHAIR (recorded, not acted): the card's predicate line prints `court truthy` alone, but the key function's branch for this pool is the `else if (f.hasCourtSystem)` arm that is reached ONLY after `f.hasCourtSystem && f.hasPrison` has failed (`src/domain/display/threatAssessment.js:144-147`), so the pool fires on `court truthy AND prison falsy`. The `prison` read is on the card's `reads:` line, so the lack is a READ of this pool and the rewrite must state it; the census's one-row predicate under-prints the branch (the full-chain sibling's card prints both conjuncts). The marker treats the discriminator as a read the card carries, not as a second fact (ADDENDUM 8 ruling 1 / R-v: the reads of a key are one keyed condition).

### 0.3 The block's header lines (annex `### DS-DEF-2`, `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2593`)
- RECEIPT: `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `DefenseTab.jsx:150-183` · the walls predicate `causalState.js:300-315` (`defenseProfileHasWalls`).
- STATE-KEY: five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags, and `compound.inst`.
- SLOTS: `{settlement}` `{band}` `{route}` — the card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` proper but unfilled here. A face names `{settlement}` and nothing else in braces.
- SECTION-TARGET: `defense`.
- PROVENANCE + FENCE: each branch holds exactly ONE string so every settlement in a branch says the same words; the walls read must ride `defenseProfileHasWalls` (a fence on the Beasts and Invasion rows, not this one); "Institution presence is a STANDING fact with no recorded history; the causal clauses here are capability clauses (walls without people cannot be held) and never historical ones". That sentence DESCRIBES the shipped text and licenses nothing (ADDENDUM 8 ruling 2: the card binds on cause; the card's `may NOT` bars a cause and a second fact outright). On THIS row the "capability clause" allowance is narrower still: the ENTAILMENT table (D-15) lists a running process as CONDITIONAL and sentencing, enforcement, judges, a code of law and impartiality as NOT ENTAILED by the court flag.
- PDF PARITY: parity (`viewModel.js` defense slice).
- The register card's six one-line registers: the dossier (the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener) · the NPC ladder (read aloud; role-bound; never a named interior) · the Herald (report mode; flattest where hottest) · the chronicle (borrowed headlines; the quiet year one sentence) · the DM page (candid; second person to the referee alone) · chrome and the docent (never the archivist). THIS POOL IS DOSSIER: R1 STATE, a spine, the player face, no mark, no citation (SOURCE-UNRESOLVED).

### 0.4 The shipped rows, verbatim (annex `:2665-2668`)
```
**`Internal Security`: court without detention**
1. `[ledger]` {settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly.
2. `[street]` The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road.
3. `[unfolding]` Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace.
```
Three shipped variants; the card's angle set (ledger · street · unfolding) matches the three tags one for one. The engine's own string on this branch (the receipt, `threatAssessment.js:147`): `'Courts prosecute but limited detention.'`, prefixed by `'Internal security: ' + safetyLabel + '. '` (and the violence line under a `Dangerous` label) — the prefix reads the safety label, which THIS pool does not read (DS-DEF-3's cell).

### 0.5 WHAT THE TWO READS ARE, IN THE ENGINE'S OWN TERMS (the marker's ground for every tag below)
- **`court` = `compound.inst.hasCourtSystem`** (`src/generators/priorityHelpers.js:55`): `hasAny(names, ['courthouse','court buildings','democratic assembly','city hall','town hall'])` — a FLAG over recorded institution NAMES. Members on the shipped catalogue: `Courthouse` @ town (`required: false, baseChance: 0.6`, desc "Borough court for local justice.", `institutionalCatalog.js:1557`); **`Town hall` @ town (`required: true, baseChance: 1`, desc "Meeting place and administrative center.", `:1550`)**; **`City hall` @ city (`required: true`, `:2268`)**; `Multiple courthouses` @ city (`required: true`, `:2275`); `Democratic assembly` @ city; `Multiple court buildings` @ metropolis (`:2338`). So the flag is TRUE ON EVERY GENERATED TOWN AND CITY from a required hall, and false below town (no member row exists at thorp, hamlet or village). The engine's own name for the pair of flags is FORMAL law: `const hasFormatLaw = inst.hasCourtSystem || inst.hasPrison` with the comment "settlements with criminal orgs but formal courts" (`safetyProfile.js:65-66`); the flag adds +20 to the internal score (`defenseGenerator.js:232`) and floors the safety label at town and city (`safetyProfile.js:67-71`).
  - ENTAILMENT table D-15 (ratified): ENTAILS "a process that runs" — CONDITIONAL: "try" / "arrest, try and hold" only where a `Courthouse` / `Multiple courthouses` / `Multiple court buildings` row stands; "a dispute goes before a magistrate" only where the Town hall's `Dispute arbitration` service (`on: true, p: 0.8`, `institutionServices.js:1625`) is instantiated. NOT ENTAILED: judges; a code of law; sentencing; enforcement (the prison branch); impartiality. ENGINE CONTRADICTS: "`hasCourtSystem` means a court". Label trap W14: `hasCourtSystem` = every town and city, from a meeting hall; a civil arbitration is recorded, a criminal trial is not.
  - REFERENT table row 20 (ratified): BODY by the flag (satisfied by a hall); HOLDER: the `court` kind, a STATE ORGAN, backed only by `Courthouse` and `Multiple court buildings` (`holderTable.js:325-333`) — but THIS pool's card resolves NO holder (`holder: null`, SOURCE-UNRESOLVED), so the HOLDER layer is not reached and W24 bars every record word (no "roll", "rolls", "record", "books"). Safe class word: **"the court" (body) ONLY where a courthouse row resolves; otherwise the FUNCTION word "the town's law" / "the law" (function, never agent)** — alias trap A-16 says the same. Since this pool reads the flag and cannot see which member satisfied it, **"the court" / "courts" as a body noun is UNLICENSED on this pool** (W20: a body word only where the read reaches the row; W15: the alias only where the row it names resolves). The refused class objects on the card (`another civic object of the class law`: court · prison · gaol · law · justice · magistrate · assize, `wiringCensus.js:1311`) bar "a magistrate" (also W22: a ROLE only on a read that records it — the arbitration service is not read), "justice", "an assize". "The town's law" names the READ's own object at its safe spelling and is not "another" object: the marker reads the bar that way and records it.
  - The licensed kernel of the court read, in words a face may use: **{settlement} keeps formal law** · **the town's law is formal** · **law at {settlement} has a formal standing** · **the town's law stands** — the engine's own adjective ("formal", `hasFormatLaw`) and the table's function word; never "tries", "prosecutes", "sentences", "judges", "hears", "convicts" (a process: CONDITIONAL unresolved on this read), never "the court" / "the courthouse" / "the bench" / "the magistrate" (body or role words the flag does not reach), never "the hall" (W21 baked power), never "the watch" (W13; D-F4 on the sibling pool).
- **`prison` = `compound.inst.hasPrison`** (`priorityHelpers.js:54`): `hasAny(names, ['prison','stocks','large prison','massive prison'])`. Members: `Small prison/stocks` @ town (`required: false, baseChance: 0.7`, desc "Holding cells and public punishment.", `:1564`); `Large prison` @ city (`required: false, 0.7`, `:2282`); `Massive prison` @ metropolis (`0.5`, `:2514`). On THIS pool the flag is FALSE: no prison-class row on the roster. A LACK — MOVE-GRAMMAR row 11 class (a), a `none-exists` world field; V3 `PRESENT → LACK` is the grammar the pool's two reads license (the census counts `grammars: 2`).
  - REFERENT table row 21: BODY by the flag only — no holder kind. Safe class word: **"the gaol" · "a place of confinement"** (A-17: holds on the shipped rows). The lack licenses ONLY the class's absence: never what a gaol would hold, whom, for how long, "holding cells", "public punishment", "stocks and pillory" (those are the MISSING row's service rows, not a read); never "cannot hold anyone" as a totality over persons (a REFUSED COLUMN); state the lack on the THING: **no place of confinement** · **no gaol** · **nothing to hold under** · **the law's second half stands wanting** (the engine's own word on this branch is "limited detention").
  - MOVE-GRAMMAR wall 3: the LACK never OPENS a variant and never sits beside another ABSENCE; R-DA-02: the lack is stated FLAT, the first half only, no completing "but"; the contrast it makes with the full-chain sibling is licensed because the rejected alternative (detention) names the sibling pool key's fact, but a contrast is never fronted as the subject and is the closing move of at most ONE variant in the pool.
- **What the two reads do NOT give:** the tier (the flag is true only at town and above, but tier is not a read on this card — W3's band marker is for pools that READ a band; a face states no tier here); the safety label (DS-DEF-3); the capture state (DS-DEF-4); the watch, garrison or militia (DS-DEF-5 / W13 / D-F4); crime, offences, wrongs occurring (no crime read: DS-DEF-3 and DS-DEF-4 carry those cells on the SAME page — C7); any sentence kind (fines · money · exile · the road · the purse · summary violence — sentencing is NOT ENTAILED, and the engine's own display note for the `Court only` status on DS-DEF-6, `defenseDisplay.js:233` "Courts without detention. Fines and exile only.", is product code outside the REWRITE's corpus, OW-20, and the DS-DEF-6 sibling pool's card licenses NOTHING — its census row recovered no reading); any process (trial, judgment, prosecution, arbitration — CONDITIONAL on a row or a service this read does not reach); any person (W22); any reputation, weight, temper, reliance, learning or belief (a standpoint / a belief frame / a FEELING non-move); any decline, widening, spending-down or "each time" (a history or a forecast on a standing configuration field: STATE NEVER FATE, R-DST-B).

### 0.6 The tier fact, recorded for the composition (not a claim): this pool can fire ONLY at town and above (the court flag has no member below town), on the roughly three towns in ten that draw no `Small prison/stocks` and the cities that draw no `Large prison`; the full-chain sibling takes the rest. Every face is therefore read on a town or a city with a REQUIRED hall on its roster and, four times in five, an instantiated `Dispute arbitration` service it cannot cite.

---
### 0.7 The key and the leaf (CONFIRMED at f2da5a3ee)
- The key: `internalRowPoolKey(civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison))` (`defenseStateProse.js:657-659`); the function (`:506-510`): `if (court && prison) → full legal chain; if (court) → court without detention; …`. ROW 3 is DELIBERATELY NOT TABLED (the docblock `:369-378`: the four pools resolve on rung 1 with the block's only real fact pair; "detention without process is a different town from court without detention"). Both flags are frozen booleans minted over the raw roster at generation and never re-read: the prose states the RECORD's standing fact, never the present building.
- The leaf (`src/data/dossierStateProse/defense.generated.js:724-746`): vid 1 `ledger`, `slots: ["settlement"]`; vid 2 `street`, **`slots: []`**; vid 3 `unfolding`, `slots: ["settlement"]`. Every face of a variant carries its parent's slot set EXACTLY (ARCH §2.5): the three faces under variant 2 name NO slot; the faces under variants 1 and 3 each name `{settlement}` once. `{band}` and `{route}` are never named.
- The layer of the READ this pool carries (ADDENDUM 13 part B rule 1; the referent table rows 20 and 21): **BODY, at the FLAG grain** — two presence flags over recorded institution rows; no HOLDER resolves (SOURCE-UNRESOLVED); no POWER, ROLE or AGGREGATE read. Every noun in a face is tagged against that layer below. A noun at HOLDER (a roll, a record, the books, the purse, the road), at ROLE (a magistrate, a judge, a gaoler), at POWER (the hall, the seat, the council), at PERSON (anyone, nobody, the person who, whoever) or at a BODY the flag does not reach (the court as a courthouse; the watch; the cells) is UNLICENSED under W20 to W27.
- Earlier attempts of this pool (`rewrite/DS-DEF-2.attempt1..3/…/draft-round-1.md`, read as DATA for hazards, never as a draft): all three wrote "the court" as a body, "tries" / "hears" / "judges" as a process, "nobody is held" / "anyone" / "the person who did it" as persons, "cell(s)" as the missing thing, and attempt 3 opened on the inventory line "{settlement} holds a court and no prison." — every one a breach under the tables ratified after them (W20, W22, A-16, D-15) or under ADDENDUM 7 rule 3. They show the pool's gravity: the safest sentence is an inventory line, and the richest is a courtroom the flag does not hold.

---

## 1. VARIANT 1 `[ledger]` (vid 1; slots `{settlement}`)

### 1.2 The shipped sentence, verbatim
> {settlement} tries offences it cannot hold anyone for; the sentences available here are money and exile, and both of them fall unevenly.

### 1.3 Every claim it makes, one per line — licence · law broken · REFERENT LAYER beside the read's layer (BODY at the flag grain)
1. "{settlement} tries …" — the town has formal law (the court flag) — **LICENSED** `reads: court` / `predicate: court truthy` / `may claim` — layer BODY (the flag) ✓ matches the read. NOTE the surface: "tries" = a criminal trial runs — see claim 2.
2. "tries offences" — a trial of criminal matters runs here — **UNLICENSED**: an observable the fields do not hold (ENTAILMENT D-15: "a process that runs" is CONDITIONAL on a `Courthouse` / court-buildings row, which this flag read cannot see; W14: `hasCourtSystem` = every town from a meeting hall, "a criminal trial is not [recorded]"; "offences" names crime, which DS-DEF-3 / DS-DEF-4 carry on the same page — C7) — layer BODY-as-process (a courthouse's act) ✗ the flag reaches no courthouse row. Also the town as a collective agent doing the court's act (W23 hazard).
3. "it cannot hold … for" — no detention: the prison flag falsy — **LICENSED** `reads: prison` (the branch's falsy limb; a LACK, MOVE-GRAMMAR row 11 class (a)) — layer BODY-lack (no prison-class row) ✓ matches the read.
4. "anyone" — the lack quantified over persons ("cannot hold ANYONE") — **UNLICENSED**: a totality over persons (a REFUSED COLUMN on the card); W22 (a person as the load-bearing referent) — layer PERSON ✗ never a referent.
5. "the sentences available here are money and exile" — sentencing powers exist and are of two kinds — **UNLICENSED**: a second fact (the card's `may NOT`); sentencing NOT ENTAILED by the court flag (D-15); an observable the fields do not hold (no sentence field anywhere on the record; the engine's own display note for `Court only` on DS-DEF-6, "Fines and exile only.", is product code outside the corpus, OW-20, and that sibling pool's card licenses nothing) — layer NONE (a sentence kind is no institution) but it presupposes a sentencing BODY ✗.
6. "both of them fall unevenly" — the sentences bear unequally on persons — **UNLICENSED**: a standpoint / a verdict (the record rates nothing; VERDICT is a non-move); a generalisation over persons (R-DA-12; a totality over persons by implication); a second fact — layer PERSON/AGGREGATE over persons ✗.
7. The semicolon joint — S2 allows one joint only for a CONSEQUENCE the engine computed of the sentence's own fact; a spine carries no relation row, and claim 5 is a second fact, not a computed consequence — the JOINT is unlicensed as it stands (the two reads may share ONE sentence as one keyed condition, R-v; nothing else may ride on it).

Licensed claim set of this sentence: {court flag holds (formal law) · prison flag falsy (no place of confinement)}. Nothing else survives.

### 1.4 THE READS THE REWRITE MUST STATE (every card read + every licensed claim above)
- READ 1 `court` truthy: **{settlement} keeps formal law** — stated as a PRESENT move on the flag at its engine meaning (the engine's own adjective "formal", `safetyProfile.js:66`; the referent table's function word "the town's law"). Never "tries", "prosecutes", "hears", "judges", "convicts", "sentences"; never "the court" / "courts" / "the courthouse" / "the bench" as a noun (CONDITIONAL on a courthouse row: A-16, referent row 20); never "the hall" (W21); never "a magistrate" (W22 + the card's class bar).
- READ 2 `prison` falsy: **{settlement} has no place of confinement** — stated FLAT as a LACK on the THING, after the court read (wall 3: never the opener), the first half only (R-DA-02: no completing "but"), never quantified over persons ("anyone", "nobody", "no one"), never "cells" / "holding cells" / "stocks" (the missing row's service rows; L-11/L-17 label trap). Lawful nouns: "a place of confinement", "a gaol", "a prison" (the flag's own keyword and the recorded rows' own word); the engine's own phrase for the branch is "limited detention".
- LICENSED shipped claims to carry: claim 1 (the court read) and claim 3 (the lack). The two are ONE keyed condition (R-v) and may sit in one sentence with one joint or in two sentences with the thread carried (R-i: the second sentence carries "the law" / "the town" forward).

### 1.5 THE ANGLE'S STANCE — `[ledger]` on this pool (one sentence)
The ledger enters the two flags as the office sets them down — formal law stands at {settlement}; no place of confinement is entered beside it — in the office's own formula ("entered", "stands", "carried standing", R-vi/W7) and cites NOTHING (SOURCE-UNRESOLVED; W24: no "roll", "record", "books"; W8: "the ledger enters and measures, and cites nothing"); it may NOT invent a process (a trial, a sentence), a sentence kind (money, exile, the purse, the road), a count, a distribution over persons, or a verdict on fairness.

### 1.6 THE TURNS WORTH KEEPING (lawful under the card, verbatim; the density floor)
- No whole clause of this sentence is lawful as it stands: every clause carries "tries", "anyone", the sentences or the verdict. The lawful FRAGMENTS: "**{settlement} tries offences it cannot hold anyone for**" reduces to its SHAPE — the town's law stated and its missing half stated in the same breath ("… and cannot hold under it") — which a face may carry at the licensed grain; and "**cannot hold**" (two words) as the lack's verb, re-seated on the thing, never on "anyone". The compression the shipped line bought with sentencing and unfairness is NOT a floor (ADDENDUM 6: only a clause LAWFUL under the card stands as a floor; ADDENDUM 9: a memorable unlicensed line is evidence the old system bought effect with unsupported information).

### 1.7 WHAT WOULD MAKE THE REWRITE A REGRESSION here
- An INVENTORY LINE (ADDENDUM 7 rule 3): "{settlement} has a court and no prison." — the two reads with no angle and no office formula (attempt 3's exact shape).
- A LOST READ: a face that states formal law and drops the lack, or states the lack and drops the law (both reads are the key; the lack is the sibling discriminator).
- A LOST ANGLE: the ledger written as the street's practice or as a citation ("the court roll shows", "entered on the rolls" — W24 refuses every record word on a SOURCE-UNRESOLVED read; "entered as standing" without a record noun is the lawful formula).
- A RESTORED BREACH: "tries" / "sentences" / "money and exile" / "fall unevenly" / "anyone" kept as a floor; "the court" as a body noun; "the watch" imported (D-F4 on the sibling; W13).
- The LACK as the opener (wall 3), or "but"-completed (R-DA-02), or fronted as a contrast subject; two variants of the pool closing on the contrast (wall 5).
- A form fault: a digit, an em dash, a which-tail, a third sentence; "There is formal law at {settlement}" as the opener beyond the register's ≤ 0.020 expletive rate (R-DA-07) — permitted once in the pool at most, never as the canonical index-0 line's habit.

---

## 2. VARIANT 2 `[street]` (vid 2; slots NONE — no `{settlement}` on this variant or its faces)

### 2.2 The shipped sentence, verbatim
> The town's law can name a wrong and cannot keep the person who did it, so it reaches for the purse or the road.

### 2.3 Every claim it makes, one per line — licence · law broken · REFERENT LAYER beside the read's layer (BODY at the flag grain)
1. "The town's law" — the town has formal law — **LICENSED** `reads: court` at the referent table's SAFE spelling ("the town's law · the law: a FUNCTION word, safe; never an agent") — layer BODY (the flag) stated through its function word ✓ matches the read. THIS IS THE ONE LAWFUL NOUN PHRASE IN THE POOL.
2. "can name a wrong" — the law adjudicates (a judgment of wrongs runs) — **UNLICENSED**: an observable the fields do not hold (D-15: a running process is CONDITIONAL on a courthouse row or the arbitration service, neither of which this read reaches; judges and a code of law NOT ENTAILED); "a wrong" names an offence occurring — layer BODY-as-process ✗ (the flag reaches no courthouse row; the town hall's `Dispute arbitration` service is instantiated on four town halls in five, but the pool does not read services).
3. "cannot keep …" — no detention (the prison flag falsy) — **LICENSED** `reads: prison` (the LACK) — layer BODY-lack ✓.
4. "the person who did it" — the lack's object is a PERSON (an offender) — **UNLICENSED**: W22 verbatim ("the person who" is in the bar's own list); a person as the load-bearing referent — layer PERSON ✗ never a referent. Re-seat the lack on the thing (no place of confinement).
5. "so …" — a CAUSE joins the lack to what follows — **UNLICENSED**: the card's `may NOT: a cause`; no relation row on a spine (S2's clause seat needs a computed consequence) — the JOINT falls with the clause.
6. "it reaches for" — the law as an AGENT with intent — **UNLICENSED**: R-DA-11 (no intent for an inanimate or abstract thing; a figure); the referent table names this very clause as the fault ("sometimes made an agent ('reaches for the purse')"); W23 — layer the function word turned agent ✗.
7. "the purse" — a fine is levied; the treasury named — **UNLICENSED**: a treasury ORGAN word on a court/prison read (referent table row 49, `holderTable.js:166-169`; W24: an organ's ratified noun only on ITS kind's read; this read resolves NO holder, so no record word at all); sentencing NOT ENTAILED (D-15) — layer HOLDER (treasury) ✗ the read reaches no holder.
8. "or the road" — exile is a sentence; the road named — **UNLICENSED**: sentencing NOT ENTAILED; "the road" is a HOLDER kind of this desk (`holderTable.js:349-355`, tokens `terrainType` / `monsterThreat`) and a record word on a read that resolves no holder (W24) — layer HOLDER (road) ✗; as an English metonym for exile it is also a FIGURE (R-DA-11).

Licensed claim set of this sentence: {the town's law is formal (court) · the town cannot hold under it (prison falsy)}.

### 2.4 THE READS THE REWRITE MUST STATE
- READ 1 `court` truthy through the street's eye: **the town's law is formal** / **this town keeps its law formally** (the shipped "The town's law" carried; no `{settlement}` on this variant — the town is "the town" / "this town" / "here").
- READ 2 `prison` falsy: **and has nowhere to hold under it** / **keeps no gaol** / **has no place of confinement** — stated flat on the thing, after the law, never on a person.
- LICENSED shipped claims to carry: claim 1 (verbatim "The town's law") and claim 3 (the lack, re-seated).

### 2.5 THE ANGLE'S STANCE — `[street]` on this pool (one sentence)
The street states the same two flags as the town meets them in use — its law is formal and it has nowhere to hold under it — in the town's own plain terms and the present tense, without a slot; it may NOT invent what the town does instead (fines, exile, the purse, the road: sentencing is no read), a person the law acts on (W22), a reliance, a habit, a learning or a belief (a FEELING / belief frame: "has learned", "relies on", "knows" — the sibling's D-F4 shape), a cause ("so"), or the law as an agent that reaches, chooses or settles.

### 2.6 THE TURNS WORTH KEEPING (verbatim; the density floor)
- "**The town's law**" — the read's lawful spelling; a face may open on it as it stands (the subject noun phrase of the shipped line).
- "**can … and cannot keep**" — the paired construction (the law's standing stated, its missing half stated) is the lawful SHAPE of this variant once "name a wrong" and "the person who did it" fall: the pair's second verb "cannot keep" survives with the thing as its object ("cannot keep anyone" does NOT: a totality over persons). The tail "so it reaches for the purse or the road" is the corpus's known breach on this pool (the referent table names it) and is dropped, never kept as a floor.

### 2.7 WHAT WOULD MAKE THE REWRITE A REGRESSION here
- An inventory line without the street's eye: "The town has a court. It has no prison." (attempt 3's variant 2, verbatim shape).
- Losing "The town's law" (the one noun phrase the tables call safe) for "the court" (W20/A-16) or "the hall" (W21).
- Any person as the lack's object ("the person who did it", "nobody is held", "no one is put away", "whoever") — W22 and the totality column.
- A cause ("so", "because"), an agent verb on the law ("reaches", "settles", "turns to"), a sentence kind (fine · money · exile · the purse · the road · summary violence), a belief frame ("the town knows / has learned / relies").
- A slot on this variant or any face under it (the leaf's `slots: []` for vid 2 binds every face).
- Construction collapse (W4): a face built on variant 1's ledger formula ("entered", "stands entered") under the street tag is a dropped angle; the street's construction is the town's own plain statement.

---
## 3. VARIANT 3 `[unfolding]` (vid 3; slots `{settlement}`)

### 3.2 The shipped sentence, verbatim
> Each judgment {settlement} cannot enforce costs the next one a little of its weight, and the town's courts are spending down a reputation they cannot replace.

### 3.3 Every claim it makes, one per line — licence · law broken · REFERENT LAYER beside the read's layer (BODY at the flag grain)
1. "judgment … {settlement}" (judgments are given here) — the town has formal law — the licensed KERNEL is the court flag — **LICENSED as to the flag** `reads: court`; **UNLICENSED as to the surface** "judgment" (a process that runs and produces rulings: D-15 CONDITIONAL, unresolved on this read; "judges" NOT ENTAILED) — layer BODY (the flag) ✓ for the kernel; BODY-as-process ✗ for the word.
2. "Each judgment" — every judgment, habitually — **UNLICENSED**: a count / a totality ("each") over an observable the fields do not hold; a habitual claim on a standing configuration field — layer AGGREGATE over events the record does not hold ✗.
3. "{settlement} cannot enforce" — no enforcement — **partly LICENSED**: the kernel is the prison flag falsy (no place of confinement); **UNLICENSED as stated**: "enforce" is broader than detention (a fine is enforced without a gaol) and enforcement is NOT ENTAILED either way by the court flag (D-15); the town as the enforcing agent (W23 hazard) — layer BODY-lack ✓ for the kernel; a FUNCTION (enforcement) the read does not measure ✗ for the word.
4. "costs the next one a little of its weight" — an unenforced judgment lessens the next — **UNLICENSED**: a CAUSE (the card's `may NOT`); a CONSEQUENCE with no event provenance and no relation row (R-DST-B: a standing field licenses no historical clause; MOVE-GRAMMAR row 7 is double-licensed and forbidden in R1 STATE); a FIGURE ("weight" of a judgment; a measure of an abstraction, R-DA-11); "a little" a quantity no field holds — layer NONE (an unmodelled quantity) ✗.
5. "the town's courts" — courts, plural, as buildings — **UNLICENSED**: D-F21 HOLDS ("'courts' plural asserts buildings where a town hall satisfies the flag"); "the court" as a body noun CONDITIONAL on a courthouse row (A-16, referent row 20); W20 — layer BODY the flag does not reach ✗.
6. "are spending down a reputation" — the courts as an economic agent consuming an unmodelled stock — **UNLICENSED**: D-F21 HOLDS ("a body as an economic agent spending an unmodelled quantity"); a FIGURE (R-DA-11); "a reputation" is a belief frame / a standpoint no field holds (R-DA-13's belief-frame floor; the card's `may NOT: a standpoint`); a progressive aspect on a standing fact (an unfolding process the record does not run) — layer BODY as agent + NONE ✗.
7. "they cannot replace" — the loss is irrecoverable — **UNLICENSED**: a FORECAST / a fate (STATE NEVER FATE; the edge is subjunctive at most); a second fact — layer NONE ✗.
8. The "and" joint — two independent unlicensed facts joined; the S2 clause seat is not engaged (no computed consequence on a spine).

Licensed claim set of this sentence: {court flag holds (formal law) · prison flag falsy (no place of confinement)} — the same two reads as its siblings; every other word of the shipped line is the decline it narrates, and the decline is invented.

### 3.4 THE READS THE REWRITE MUST STATE
- READ 1 `court` truthy: **formal law stands at {settlement}** (PRESENT, first).
- READ 2 `prison` falsy, realised as the `[unfolding]` angle's OPEN move (R-iv / W8: the unfolding realises OPEN — the matter standing open NOW — after the presence, never the ledger's measure and never a trend): **the holding half of the town's law stands wanting** / **detention stands unmet at {settlement}** / **the law's second half is not in place** — the engine's own word for this branch is "limited detention"; the matter is stated as standing open in the present, declarative (never a question), never as widening, spending, costing or losing (a history or a forecast).
- LICENSED shipped claims to carry: the two kernels of claims 1 and 3. No shipped word beyond `{settlement}` and the bare verb "cannot" is lawful as it stands.

### 3.5 THE ANGLE'S STANCE — `[unfolding]` on this pool (one sentence)
The unfolding states the presence (formal law) and then names the matter that stands open in this town now — the holding half of its law is wanting — as a present, declarative OPEN move (V6 PRESENT → OPEN; the register card's "leave one matter standing open in every town, stated, never asked"); it may NOT narrate a decline, a widening, a cost to the next judgment, a reputation spent, a habit ("each time", "goes on"), a future ("cannot replace"), or a cause, because a standing configuration field licenses no history and the record holds no clock on this fact.
- A FENCE FOR THE CHAIR (recorded, not ruled here): the OPEN move's licence is "a state field whose value is unresolved / contested / pending / UNMET" (MOVE-GRAMMAR row 10). This pool's open matter is a `none-exists` LACK (the prison flag false), not an unmet value. The marker reads the lack of the chain's second half as "unmet" in the engine's own sense ("limited detention", "Court only" against "Court + Prison") and licenses the OPEN framing on that reading; if the chair refuses it, the unfolding variant realises V3 (PRESENT → LACK) with its angle carried by the lack stated as the matter left standing (R-DA-02: flat, the first half only), never by a trend.

### 3.6 THE TURNS WORTH KEEPING (verbatim; the density floor)
- NONE. No clause of the shipped sentence is lawful under the card as it stands; the two-word fragment "**cannot enforce**" fails on "enforce" (NOT ENTAILED), so not even the verb survives. The density floor for this variant is the two reads stated in the OPEN construction with the unfolding's ear; the shipped line's compression ("spending down a reputation") is the pool's known breach (D-F21) and is dropped, never kept.

### 3.7 WHAT WOULD MAKE THE REWRITE A REGRESSION here
- The unfolding written as ORDER ALONE (R-iv): the ledger's two-flag entry under the unfolding tag, with no OPEN move ("Trials are going forward at {settlement}, and detention is nowhere in the town." — attempt 3's shape, which also carries "trials" and "nowhere in the town" as an observable).
- The unfolding written as a TREND: "goes on", "each time", "widens", "spends", "costs", "a little more" — a history or a forecast on a standing field.
- A lost read: OPEN stated with no presence before it (the lack as the opener, wall 3), or the presence stated with no open matter (the angle dropped).
- "the court(s)" restored (D-F21; W20); a person restored ("anyone", "whoever walks away", "somebody"); a reputation, a weight, a belief frame; a cause.
- A construction collapse onto variant 1's or 2's grammar (W4): the OPEN construction is this variant's own.
- A slot fault: a face under this variant that omits `{settlement}` or names `{band}` / `{route}`.

---

## 4. THE POOL, WHOLE

### 4.1 The reads every face of every variant must state (the card's complete read set + the licensed shipped claims)
| read | value on this pool | the licensed statement (engine meaning) | lawful nouns | refused nouns / frames |
|---|---|---|---|---|
| `court` (`compound.inst.hasCourtSystem`) | truthy | the town has FORMAL law (the engine's own `hasFormatLaw`); the court-class flag holds as a standing fact of the record | "the town's law" · "formal law" · "its law" · "the law" (function, never agent) | "the court" / "courts" / "the courthouse" / "the bench" (body: CONDITIONAL on a courthouse row the flag cannot see, A-16, row 20, W20); "the hall" / "the council" / "the seat" (W21); "a magistrate" / "a judge" / "an assize" / "justice" (W22 + the card's `law`-class bar); "tries" / "hears" / "judges" / "prosecutes" / "sentences" / "convicts" / "arbitrates" (a process: CONDITIONAL, D-15); "the watch" (W13, D-F4) |
| `prison` (`compound.inst.hasPrison`) | falsy (the branch's discriminator; on the card's `reads:` line; the census predicate under-prints it — §0.2) | the town has NO place of confinement; the holding half of its law is wanting ("limited detention") | "a place of confinement" · "a gaol" · "a prison" · "nowhere to hold under [its law]" · "no gaol" | "cell(s)" / "holding cells" / "the stocks" / "public punishment" (the missing row's service rows; L-11/L-17); "anyone" / "nobody" / "no one" / "the person who" / "whoever" (a totality over persons; W22); "cannot enforce" (enforcement NOT ENTAILED); "keeps nobody" |

Both reads are ONE keyed condition (R-v): a face states both, in one sentence with at most one joint or in two sentences with the thread carried (R-i). The LACK never opens (wall 3), is stated flat (R-DA-02), and closes at most one variant of the pool as a contrast (wall 5).

### 4.2 What NO face may add (the pool's claim ceiling)
A sentence kind (fine · money · exile · the purse · the road · summary violence); a process (trial · judgment · hearing · prosecution · arbitration · complaint); a person (anyone · nobody · the person · whoever · somebody); an office (magistrate · judge · gaoler · clerk); a body the flag does not reach (the court as a courthouse · the hall · the watch · the cells); a record word (roll · record · books · register — SOURCE-UNRESOLVED, W24); a cause ("so", "because", "which means"); a history or forecast ("goes on", "each time", "widens", "cannot replace"); a standpoint or verdict ("unevenly", "a reputation", "a threat", "arbitrary"); crime occurring ("offences", "wrongs are done" — DS-DEF-3 / DS-DEF-4 hold those cells on the same page, C7); the tier ("a town or larger" — true of every town this pool fires on, but not a read); the safety label or the internal score band (DS-DEF-3); a totality over the town ("nothing is punished at {settlement}" — W2's shape).

### 4.3 The composition this spine sits in (THE THREAD; the modifiers it cannot see)
- Site `defense.threatAssessment`, the `Internal Security` row; `k: 1` — ONE modifier position may follow the spine on the tab. Every face is written to read well alone AND immediately before one unknown modifier: it lands on a civic noun of the read (the law · the place of confinement), never on a pronoun, never on a set-up clause (wall 7: the last move is a standing fact).
- The same page carries DS-DEF-3 (the safety label), DS-DEF-4 (the capture rungs) and DS-DEF-5 (the forces) — a face here says nothing about order, crime, the watch or the seat, so no same-page contradiction can arise (C7).
- The settlement token: at most ONE variant of the pool opens on `{settlement}` (wall 10; R-DA-17). Variant 2 carries no slot at all. Variants 1 and 3 name `{settlement}` once each; only one of them may open on it.
- Sibling distance (A11 / A5): no two variants share their first two words; the three variants realise three DISTINCT constructions (the ledger's entry · the street's plain statement · the unfolding's PRESENT → OPEN), and the four faces of each variant differ in CONSTRUCTION, not vocabulary alone (ADDENDUM 7 rule 4; W4 keeps each variant on its own grammar through refinement).
- Possessor binding (W1): "its law" after a `{settlement}` subject binds to the town (lawful); "its" after "the law" as subject binds to the law — a face that needs the town as possessor seats "the town's".

### 4.4 The fences for the chair (recorded vetoably; the drafter writes under the marker's reading until ruled)
1. THE PRISON LIMB IS A READ (§0.2): the card's one-row predicate under-prints the `else if` branch; the marker takes `prison falsy` as the pool's second read (it is on the `reads:` line) and requires it in every face. A card fix (print both limbs, as the full-chain card does) is a CAR 8b-W-2 row.
2. "THE COURT" IS CONDITIONAL ON THIS FLAG (§0.5): the ratified tables (A-16; referent row 20) make the body noun lawful only where a courthouse row resolves, which the flag read cannot see; the marker refuses it and licenses the function word. The engine's own strings on this branch and its siblings bake "court(s)" (`threatAssessment.js:147`; `defenseDisplay.js:233`; `safetyProfile.js:329`) — a register-car scope row under OW-20, not a licence. A derived `{courtname}`-style fill from the resolved court-class row (the `{watchname}` shape, OW-1) would make the noun safe; recorded for CAR 8b-W-2's list, not acted.
3. "THE TOWN'S LAW" IS NOT "ANOTHER civic object of the class `law`": the card's bar names objects OTHER than the reads; the referent table lists "the town's law" as the court read's own safe function word. The marker reads the bar so; a refuter who reads "law" in the class list as barred would strike the only lawful noun the tables give this pool — the chair is asked to say which reading binds.
4. THE OPEN MOVE ON A LACK (§3.5): whether a `none-exists` flag may seat OPEN as "unmet" under the engine's own "limited detention" reading; the fallback is V3 with the lack as the matter left standing.
5. THE DS-DEF-6 SIBLING (`Legal Infrastructure: Court only`, annex `:2996-2999`) says "fines and exile" on a card that recovered NO reading; that pool is WIRING-UNRESOLVED and not this block's, but the two rows will sit in one dossier — the chair may want the sentencing claim struck there too when DS-DEF-6's rewrite comes, so the two surfaces do not disagree about what the town can do.

---

## 5. THE COUNT
Three shipped variants marked (vid 1 `[ledger]` · vid 2 `[street]` · vid 3 `[unfolding]`), each with every claim tagged and layered; the reads the rewrite must state are two (`court` truthy · `prison` falsy), identical for every variant; lawful shipped turns: one noun phrase ("The town's law", variant 2) and one construction shape (the paired "can … and cannot keep", variant 2; the same shape in variant 1) — no whole shipped clause stands verbatim; the pool's three known breaches from the ratified tables (the purse and the road on a court/prison read; "courts spending down a reputation", D-F21; the "law … reaches" agent) are dropped, never floors.

STATUS: COMPLETE (every section written; nothing pending). Read-only on the dock; the only execution was the licence-card script.
