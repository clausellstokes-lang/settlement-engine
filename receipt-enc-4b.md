# RECEIPT — LANE ENC-4b — **PARTIAL: BUILT, PROVEN AND GREEN ON EVERY INSTRUMENT REACHABLE WITHOUT VITEST**

⚠ **STATUS: PARTIAL, AND THE PARTIAL IS EXACTLY ONE THING — NO VITEST RAN.** The chair's gate held
this machine for the whole lane; the quiet window never opened once (log and its own measured
defect below). Every other proof was executed and is quoted.

⛔ **THE HEADLINE: THE BRIEF'S DERIVATION FOR THE APPROACHER WAS MEASURED FALSE, IN BOTH
DIRECTIONS, BEFORE ANYTHING WAS BUILT.** Complying with it would have shipped the exact wrong-ROLE
defect the R1 ruling exists to prevent. The ruling stands; its mechanism was replaced with one
derived from the receipt itself.

⛔ **AND A SECOND, UNASKED FINDING: ENC-4's TRAIN WAS ALREADY RED AT ITS OWN TIP** — four arms of
`tests/domain/pantheon.test.js` A5, in an instrument neither the ruling nor ENC-4's receipt named,
invisible because no vitest ran in that lane either. Measured at `7be568047` and cured in car 4.

- Lane: ENC-4b (Opus 5 under Fable 5.1 chair)
- Dock: `$SC/laneENC4B` — verified on arrival: HEAD `7be568047a7e368573dab14652ff3d6adaeda6dc`,
  porcelain **0**, detached, node_modules symlinked (untouched, never materialised).
- Base: ENC-4's nine cars. Final HEAD **`9d9686c12`**, porcelain **0**.
- Sealed words re-read: `refs/preserve/enc5-words-2026-09-04` §B; the seal's own sha256 is
  `ca6b8608387ffcdb7742f4b562502e11952c998d6eecee895fddd6832d5b7347`, matching ENC-4's record.

## Progress
- [x] Dock verified
- [x] Sealed words §B read; the approacher derivation established BY MEASUREMENT, not by the brief
- [x] Bill re-derived and predicted in writing before any instrument ran
- [x] Car 1: `approacherNid` on the seed
- [x] Car 2: §B registered, written, routed, phrased; every instrument figure moved
- [x] Car 3: the annex's one-sentence rule, and the walker claim it falsified
- [x] Car 4: the seventh instrument, red since ENC-4, cured
- [x] Lit arm + ROLE MIRROR; dark arm byte-identical; walker dry-run 21/21 with four mutants
- [ ] **vitest — OWED, the window never opened**
- [x] RETROVALIDATION ROW

---

## ⛔⛔ THE BRIEF'S DERIVATION IS WRONG, AND THE MEASUREMENT IS THE FIRST THING THIS LANE DID

The brief and the ruling both say the approacher is known "because the traveller approaches the
resident's venue". **The engine does not work that way.** `envoyChanceMeeting.js:895-902` picks the
approach direction by the COMPROMISE CHANCE ON THE TARGET, ties by the target's nid:

```js
const directions = [{ approacher: one, target: two }, { approacher: two, target: one }]
  .map((pair) => { const terms = compromiseTerms(...); return { ...pair, terms, chance: compromiseChance(pair.target, terms) }; });
directions.sort((x, y) => (y.chance - x.chance) || codepoint(text(x.target.nid), text(y.target.nid)));
const lead = directions[0];
```

`compromiseChance` reads the TARGET's corruptibility and ambition (`compromiseFastPath` 7 when the
target is corruptible and 'ambitious'). Nothing in it knows which party travelled. Measured, both
directions, 4000 meetings each, real `resolveChanceMeeting`:

```
CONFIG A (the TRAVELLER is corruptible+ambitious, so the RESIDENT leads)
outcomes: {"nothing":2772,"bond":376,"compromised":660,"exposed":23,"rivalry":93,"rejected":76}
EXPOSED receipts     : 23  approacher by grievance.toSid: {"RESIDENT":23}
COMPROMISED receipts : 660 approacher by mark.otherNid  : {"RESIDENT":660}

CONFIG B (the RESIDENT is corruptible+ambitious, so the TRAVELLER leads)
EXPOSED: 23 {"TRAVELLER":23}   COMPROMISED: 660 {"TRAVELLER":660}
```

**In a traveller × resident meeting the RESIDENT is the approacher whenever the traveller is the
softer target.** Had this lane taken the brief's derivation it would have shipped the exact
wrong-ROLE bug the whole ruling exists to prevent — naming the refuser as the offerer.

Drivers: `$SC/enc4b-tmp/approacher-probe.mjs`, `$SC/enc4b-tmp/approacher-probe2.mjs`.

## HOW THE APPROACHER IS ACTUALLY KNOWN (the derivation this lane took)

The exposed branch writes the direction onto the receipt itself:
`receipt.grievance = { fromSid: lead.target.homeSid, toSid: lead.approacher.homeSid, incidentType: 'approach_exposed' }`.
So `grievance.toSid` IS the approacher's home. It identifies a PERSON because the two parties'
home settlements can never coincide, and that is guaranteed twice over at the census:

| guarantee | site | text |
|---|---|---|
| a traveller is never at his own home | `envoyChanceMeetingStage.js#projectTravellers` | `if (!homeSid \|\| !nodeId \|\| nodeId === homeSid) continue;` |
| the resident's home IS the host node | `envoyChanceMeeting.js` rule 4 | `homeSid: nodeId` |
| two travellers never share a home | `envoyChanceMeeting.js` rule 5 | `if (text(a.homeSid) === text(b.homeSid)) continue;` |

⇒ `approacherNid` = the nid of the UNIQUE party whose `homeSid === grievance.toSid`. Exact, total,
derived from the stage's own data, and never from census order.

## THE BILL, RE-DERIVED AND PREDICTED IN WRITING BEFORE ANY INSTRUMENT RAN

| # | file | figure | frozen | PREDICTED | basis |
|---|---|---|---|---|---|
| 1 | `tests/lint/kindPoolFloors.walker.test.js` | `ROUTED_TOKENS` | 380 | **381** | one new `EXACT_SECTION` row, desk-bearing |
| 2 | " | `REGISTERED_KIND_COUNT` | 114 | **115** | one new registry row |
| 3 | " | `REGISTRIES` length | 12 | **12 UNMOVED** | no new family; CHANCE_MEETING gains a row |
| 4 | " | small-family exact list | `['INFORMATION','FAITH','CHANCE_MEETING']` | **UNMOVED** | 2 rows is still `< 5` |
| 5 | " | registered-minus-routed | 8 | **8 UNMOVED** | the row carries a desk, so both censuses move together |
| 6 | " | `LEGACY_UNVOICED_TOKENS` | 274 | **274 UNMOVED** | the new routed token IS registered |
| 7 | " | `LEGACY_UNDER_FLOOR` | 23 rows | **UNMOVED** | `major` floor is **4** (measured) and §B is authored at **5** |
| 8 | `tests/lint/chooserTotality.walker.test.js` | `DEFER_CEILING` | 36 | **36 UNMOVED — the brief is REFUSED here** | see F2 below |
| 9 | `src/domain/worldPulse/habitForkRegistry.js` | rows | 42 | **42 UNMOVED** | no new `hash01(` site: the §B builder calls the SAME `chanceMeetingLine` |
| 10 | `tests/lint/.lighting-census-baseline.json` | `titles` | 23198 | **+N** (REGISTER ACT — the chair's) | tests added to an EXISTING file |
| 11 | " | `files` / `credited` / `suiteTitles` / `parked` | — | **UNMOVED** | no new test file, one `describe` kept |
| 12 | `.news-headline-contract-baseline.json`, `.news-voice-baseline.json` | — | **0** | corpus is generated worlds; the car is dark in every preset |
| 13 | `tests/lint/.wizard-news-authoring-baseline.json` | debt rows | 19 | **UNMOVED** | the new governed site carries `id`+`settlementIds`+`severity` and a LITERAL `impactKind` |

Measured input to row 7: `FREQUENCY_FLOORS {"routine":8,"notable":6,"major":4}` (executed from
`tests/helpers/kindPoolWalker.js`). §B is authored at five variants, so it clears its floor by
margin and may NOT join the shrink-only backlog.

---

## THE CARS AS LANDED

| car | sha | what |
|---|---|---|
| 1 | `977b4a746` | `approacherNid` on the stage's seed, derived from the receipt's own exposure grievance |
| 2 | `ecae3eab0` | the §B pool, the second registry row, the exact desk row, the §C phrase, the writer, one dispatch door, and every instrument figure |
| 3 | `cf3068694` | the annex's one-sentence rule, and the walker docblock sentence it made false |

Files EDITED (no file added, renamed or deleted anywhere in the train):
`src/domain/worldPulse/envoyChanceMeetingStage.js` · `…/envoyChanceMeetingNews.js` ·
`…/envoyChanceMeetingReceiptPools.js` · `…/envoyPulse.js` · `src/domain/realm/heraldRouting.js` ·
`src/domain/display/settlementRumors.js` · `tests/lint/kindPoolFloors.walker.test.js` ·
`tests/lint/chanceMeetingKindPools.walker.test.js` · `docs/content/RECEIPT_POOLS_CHANCE_MEETING.md`

## THE BILL AS MEASURED, AGAINST THE PREDICTION ABOVE

Every predicted figure was executed and every one matched:

```
ROUTED_TOKENS            381   (predicted 380 -> 381)   ✓
REGISTERED_KIND_COUNT    115   (predicted 114 -> 115)   ✓
REGISTRIES length         12   (predicted UNMOVED)      ✓
small families           ["INFORMATION","FAITH","CHANCE_MEETING"]  (predicted UNMOVED)  ✓
registered-minus-routed    8   (predicted UNMOVED)      ✓
LEGACY_UNVOICED_TOKENS   274   (predicted UNMOVED)      ✓
floor violations          23   (predicted UNMOVED; 0 of them CHANCE_MEETING)  ✓
significance classes     ['major','n/a','notable','routine']  (predicted UNMOVED)  ✓
authoring wall  files 1101 · candidateSites 110 · sites 109 · paths 63
                candidateSites === sites + 1 : true      (110 === 109 + 1)
   MY SITES  envoyChanceMeetingNews.js:378  ["chance_meeting_recorded"]  issues []
             envoyChanceMeetingNews.js:501  ["chance_meeting_exposed"]   issues []
```

### ⛔ THE ONE ROW OF THE BRIEF THIS LANE REFUSES, WITH THE MEASUREMENT

The brief instructs: *"`chooserTotality` DEFER → the kind is now ROUTED (re-derive `DEFER_CEILING`
— it may drop back 36 → 35); `HBF-42` from DEFER to its routed state per the registry's own
vocabulary."* **The row's own accounting says no, and so does the vocabulary.**

1. **There is no "routed state" in that vocabulary.** `habitForkRegistry` dispositions are
   `STAY` / `DEFER` / `LEARN` (measured: 36 DEFER, 6 STAY, 0 LEARN across 42 rows). "Routed" is
   the HERALD's word for an `EXACT_SECTION` row — a different instrument entirely. The brief
   crosses two vocabularies.
2. **HBF-42 is not about §B.** It asks whether a receipt-pool prose pick is a decision at all, and
   its own `closeOwed` says so in terms: *"ALL FOUR rows close together or not at all: one answer
   about prose picks cannot be true for GRAMMAR, INFORMATION and FAITH and false for
   CHANCE_MEETING."* Registering a second kind in one family answers nothing for the other three.
3. **The scan input did not move, and that is measured directly** rather than through a
   replication I could get wrong:

```
idiom-signature occurrences under src/domain     BASE 7be568047   NOW
  hash01(                                             33           33
  softmaxWeights(                                      3            3
  stableSampleByWeight(                                5            5
lines this train ADDED to src/ : 294   of which carrying any idiom signature : 0
habitForkRegistry.js / chooserTotality.walker.test.js : UNTOUCHED by this train
```

⇒ the discovery set cannot have moved. `DEFER_CEILING` stays **36**, HBF-42 stays **DEFER**,
`HABIT_FORK_REGISTRY` stays **42 rows**. Lowering the ceiling would have banked a win that was
never won and disarmed a row the volume says only a chair may move.

⚠ I first attempted to replicate the walker's whole partition in node; my hand-written string
strip over-blanked (6 discoveries against ~30 real) and I discarded it rather than report its
numbers. The direct measurement above is what this refusal stands on.

---

## THE ROLE-MIRROR PROOF (the wrong-ROLE law), END TO END ON REAL MINTED WORLDS

Driver `$SC/enc4b-tmp/role-mirror.mjs` — the real stage, the real pulse callback, real minted
errand worlds, the flag forced on. The two arms differ in ONE thing: which party is the softer
target, which is what makes the approach run the opposite way.

```
### MIRROR A — the TRAVELLER is the softer target, so the RESIDENT (of the host town) offered
  seed.beat  approach_exposed   npcIds ["ashford:npc.envoy.1","irontown:npc.host.1"]
  hostId irontown               seed.approacherNid "irontown:npc.host.1"
  ENTRY      NULL — WITHHELD

### MIRROR B — the RESIDENT is the softer target, so the TRAVELLER (passing through) offered
  seed.beat  approach_exposed   seed.approacherNid "ashford:npc.envoy.1"
  ENTRY      BUILT
  headline   Neither court announced it, and Irontown has it anyway: Host Notable refused
             A Named Legate of Ashford.
  summary    A refusal that did not stay private.
  impactKind chance_meeting_exposed   significance major   severity 0.76   score 78
  familyId   chance_meeting_exposed.5
```

`{npc}` (the offerer) is A Named Legate of Ashford — the approacher. `{counterpart}` (the
refuser) is Host Notable — the approached. **The sentence follows the receipt's direction, not the
array order.** Mirror A is the half whose words would be false, and it is silent.

The same pair is pinned in the walker as a fixture and its mirror
(`§B — the roles are the APPROACH's, and the mirror proves the sentence names them right`), which
asserts `headline` contains `Sera Vane of Kesthorne` and NOT `Aldo Rell of Kesthorne`, then flips
one field and requires null — with the un-flipped seed re-asserted truthy so the null is the role
gate and not a broken fixture.

## THE DARK ARM — BYTE-IDENTICAL, NOT HOPED

Driver `$SC/enc4b-tmp/dark-arm.mjs` (ENC-4's harness, re-pointed at this dock), ten pulses of a
really-moving dark run against hashes frozen at `6c49ecbbf`, a commit predating ENC-3:

```
ticks hashed 10   distinct 3   errands really moved: true
BYTE-IDENTICAL TO PARENT: YES
  refusal spelling explicit false / the number one / the string "true" / an empty object /
  the string "yes"  →  identical: YES (all five)
ALL DARK ARMS IDENTICAL: YES     exit 0
```

## THE WALKER, DRY-RUN IN PLAIN NODE — 21 OF 21, WITH ITS OWN NEGATIVE CONTROLS

`tests/lint/chanceMeetingKindPools.walker.test.js` re-executed outside vitest through a shim
(`$SC/enc4b-tmp/dry/`), path-rewritten so **nothing was written into the dock**:

```
PASS 21  FAIL 0   exit 0
```

⛔ A dry run that cannot fail is not a proof, so the shim was convicted four ways:

| mutant | result |
|---|---|
| the §B fixture names the WRONG approacher | **FAIL 4** — the role arm, the address arm, the fail-closed arm and the dispatch arm all red |
| the registry census figure moved 2 → 3 | **FAIL 1** — `expected length 2 to be 3` |
| the annex §B corpus forked by one word (`said no` → `said nay`) | **FAIL 1** — the document join reds with both sides printed |
| the annex's added rule line reworded | **FAIL 1** — the rule pin reds |

## FILE-SET AND SCANNER-FAMILY FACTS

```
git ls-tree -r --name-only 7be568047  vs  HEAD   →  IDENTICAL
```

**This train adds, renames and deletes NOTHING anywhere in the tree.** Therefore, by construction
rather than by hope: the coupling census cannot re-layer a module, the lighting census's `files`,
`credited`, `parked` and `suiteTitles` cannot move, and the "a new test file reds three censuses"
family is not triggered. The one census figure that DOES move is `titles`: the single edited test
file goes **14 → 20** literal `test(` calls (later **21** with car 3's arm), one literal `describe`
throughout. Every `test(` is straight-line and literal, so the file stays credited, not parked.

`mechanism-lit-coverage-baseline.json`: zero occurrences of `envoyChanceMeeting`, and the train
names **no `*Enabled` flag anywhere in its diff** (measured over all added lines in `src`, `tests`
and `docs`), so the flag-name-in-a-comment denominator hazard is not reachable from here.

---

## FINDINGS BACK TO THE CHAIR

### F1 — ⛔⛔ THE RULING'S CURE NAMED THE WRONG MECHANISM, AND TAKING IT WOULD HAVE SHIPPED THE BUG
R1 says `approacherNid` "is determinable for traveller × resident (the traveller approaches)".
The brief repeats it. It is false: the leaf leads with whichever direction has the higher
compromise chance ON THE TARGET, and that chance reads corruptibility and ambition, never who
travelled. Measured in both directions, twice — 4000 synthetic resolutions per arm and 600 minted
worlds per arm. Had the lane complied, §B would have named the refuser as the offerer on one whole
arm. **The RULING is right (§B is wireable for that kind, and the direction IS on the receipt);
its MECHANISM was wrong.** That is now the EIGHTH instance of charter-the-permission-measure-the-
mechanism in this arc, and the first where the wrong mechanism would have produced the exact
defect the ruling was written to prevent.

### F2 — ⛔ THE §B WORDS ARE HONEST ON ONLY HALF OF THE KIND THE RULING AUTHORIZED
Variant 1 reads `{counterpart} of {settlement}` — it asserts the refuser is of the town the
refusal became known in. That is true when the traveller offered and FALSE when the host's own
notable did. The ruling authorized the kind believing kind and case were the same set; they are
not, and the case is the smaller. The writer therefore ships the case, not the kind, and withholds
the rest. **The withheld half is real news with no authored words** — an exposed offer made BY a
host court's own notable — and giving it words is a chair annex act. It is the second, smaller row
ENC-4's F2 already predicted ("Variant 1's `{counterpart} of {settlement}` also strains…"),
arriving one kind earlier than expected.

### F3 — ⛔ THE RULING'S REASON FOR EXCLUDING traveller × traveller IS WRONG; THE EXCLUSION IS RIGHT
R1 excludes that kind as "symmetric" and not determinable. It IS determinable: rule 5 refuses a
pair sharing a home (`if (text(a.homeSid) === text(b.homeSid)) continue;`), so `grievance.toSid`
identifies a unique party there too. The exclusion survives on the PROSE ground only — in a
traveller × traveller meeting neither party is of the host town, so `{counterpart} of {settlement}`
has no honest fill. This lane held the fence and did not widen it.

### F4 — ⛔ §B AUTHORS NO REASON CLAUSE WHERE §A DOES
The sealed §A block carries `**REASON, riding every variant**`; the sealed §B block carries none,
and the NEWS ADDRESS LAW still owes a reason limb. Rather than author reader prose, the limb is
filled from the chair's own §C row for the same kind (`a refusal that did not stay private`,
marked KEPT), joined to the document by the walker and pinned equal to
`WHAT_PHRASES['chance_meeting_exposed']`. **This is a judgment and it is R3 below.**

### F5 — ⛔⛔ ENC-4's TRAIN LANDED A RED IT NEVER SAW, IN AN INSTRUMENT NOBODY NAMED
`tests/domain/pantheon.test.js` A5 freezes six figures re-derived from the live kind roster. At
`7be568047` — ENC-4's own tip, before this lane touched anything — **four of its six arms were
RED** (registries 11 vs 12, the small-family list, allRows 113 vs 114, routedTokens 379 vs 380).
It was invisible because no vitest ran in ENC-4 either. Cured in car 4 with the attribution split.
⚠ The paragraph immediately above those lines already records this exact failure at WF-8a and
declares the structural repair DONE. It is not done: the repair removed the duplicated LIST and
left the freezes literal by ruling, so a hand move in the registering commit is still the contract
— missed twice now. Lifting the six into the shared roster helper beside `KIND_REGISTRIES` is the
cure and it is a **chair act**, so it is reported, not taken. Swept: exactly two files in the tree
hold these figures.

### F6 — ⚠ A DOCBLOCK MOVED BETWEEN A FUNCTION AND ITS OWN JSDOC COSTS SIX STRICT ERRORS
Inserting `approacherNidOf` between `heraldSeedsOf`'s docblock and `heraldSeedsOf` detached the
docblock: `+6 strict errors` on a file whose baseline is 0 (`TS7006` on both parameters, `TS2339`
four times on `names`). Nothing about the code was wrong; the JSDoc simply stopped being attached.
Cured by moving the helper ABOVE the seam docblock. Recorded because the failure mode is silent in
review and the ratchet is the only thing that sees it.

### F7 — ⚠ A TWO-LINE `// anchored:` COMMENT DOES NOT ANCHOR
`negativeAssertionAnchor.walker.test.js` accepts the annotation on the matcher's own line or the
line IMMEDIATELY above (`if (i > 0 && ANNOTATION_RE.test(lines[i - 1]))`). An `// anchored:` note
that wraps onto a second line leaves the continuation adjacent to the assertion and the site reads
as UN-anchored. Caught by replicating the scan rather than by a red: 18 negative matchers in the
file, 0 un-anchored after the fix.

---

## RETROVALIDATION ROW — ⟦Seat: Opus 5 — Fable-unvalidated · Lane: ENC-4b⟧

Opus judgments taken inside the delegation, recorded so the Fable chair can veto them.

| # | what was JUDGED | what the chair must re-derive | receipts (absolute paths) | priority |
|---|---|---|---|---|
| R1 | **THE BRIEF'S DERIVATION WAS REFUSED AND REPLACED.** `approacherNid` is derived from `receipt.grievance.toSid` matched against the two parties' home ids, not from "the traveller approaches". | That the replacement is right, and that the three census guarantees really make a home id name a person (they are quoted with their sites). ⚠ If the chair intended the traveller rule as a RULING rather than a mechanism, it must be re-issued knowing it names the wrong party on one whole arm. | `…/laneENC4B/src/domain/worldPulse/envoyChanceMeetingStage.js#approacherNidOf` · `$SC/enc4b-tmp/approacher-probe.mjs` · `…/approacher-probe2.mjs` · `…/exposed-arm.mjs` · commit `977b4a746` | **HIGH** — it is the difference between §B shipping and §B lying |
| R2 | **§B SHIPS THE CASE, NOT THE KIND.** The writer withholds the line when the counterpart is not of the host town, because variant 1 asserts they are. | Whether narrowing inside the authorization is the right answer, or whether the chair would rather AMEND variant 1 so the whole kind can speak. The withheld half is real news with no words. | `…/src/domain/worldPulse/envoyChanceMeetingNews.js#chanceMeetingExposedEntry` (the gate and its docblock) · `$SC/enc4b-tmp/role-mirror.mjs` | **HIGH** — it is a content decision wearing a code gate |
| R3 | **THE §B REASON LIMB IS THE §C NOUN PHRASE.** §B authors no reason clause; rather than write one, the limb cites the chair's own §C row for the same kind, joined to the document. | That re-purposing a phrase authored as the R1 rumor noun phrase into the Herald reason limb is acceptable, or that §B should gain its own `**REASON, riding every variant**` clause — a chair annex act. | `…/src/domain/worldPulse/envoyChanceMeetingNews.js#CHANCE_MEETING_EXPOSED_REASON` · the walker's `annexWhatPhrase` join | **HIGH** |
| R4 | **THE ANNEX WAS EDITED.** One line added to a sealed document; the walker docblock's "byte-identical copy of that seal" was corrected in the same commit. The rule is spelled `⛔ **§B speaks only where the approach is known.**` — the chair's sentence with a terminal period and a ⛔ marker, matching the block's other rule lines. | That adding the marker and the period to the chair's sentence is acceptable, and that the placement (between `AUDIENCE:` and variant 1) is where "beside the pool" meant. | diff vs seal in this receipt · commit `cf3068694` | **MEDIUM** |
| R5 | **`DEFER_CEILING` WAS NOT LOWERED and HBF-42 WAS NOT MOVED**, against the brief's instruction. | That the refusal is right: the vocabulary has no "routed" disposition, HBF-42's own `closeOwed` binds all four prose-pick rows to close together, and the scan input is measured unmoved. | measurement table in this receipt · `…/src/domain/worldPulse/habitForkRegistry.js` (HBF-42, untouched) | **HIGH** — a ceiling only a chair may move, in either direction |
| R6 | **`CHANCE_MEETING_PRESENTATION` BECAME A TWO-KEY TABLE** with a guarded lookup, because the strict ratchet convicted an unguarded index into a two-key literal from a four-word significance union. | That widening by exactly one class (and refusing `routine`, which no row claims) is the right shape, and that the walker pinning the key set to the registry's own significances is the right guard. ⚠ It edits a constant ENC-4 landed under GR-4B §6.2. | `…/src/domain/worldPulse/envoyChanceMeetingNews.js#CHANCE_MEETING_PRESENTATION` | **MEDIUM** |
| R7 | **THE PANTHEON A5 FIGURES WERE MOVED BY THIS LANE**, curing a red ENC-4 landed. | That curing another lane's unpaid instrument bill inside this train is right rather than a separate car, and the attribution split is faithful. ⛔ AND THE CHAIR ROW IT OPENS: lift the six freezes into the shared roster helper, because a hand move in the registering commit has now been missed twice (WF-8a, ENC-4). | `…/tests/domain/pantheon.test.js` A5 · commit `9d9686c12` | **HIGH** |
| R8 | **THE PULSE NOW CALLS A DISPATCHER** (`chanceMeetingHeraldEntry`) instead of `chanceMeetingEntry`, so beat dispatch lives beside the rows. | That the family, not the pulse, is the right home for the dispatch, and that `a ?? b` over two fail-closed builders is the right shape rather than an explicit beat switch. | `…/src/domain/worldPulse/envoyPulse.js` · `…/envoyChanceMeetingNews.js#chanceMeetingHeraldEntry` | **LOW** |

---

## NON-VITEST GATE STEPS AT FINAL HEAD `9d9686c12` — EVERY EXIT CAPTURED IN-SHELL

| step | exit | note |
|---|---|---|
| `node scripts/check-domain-strict.mjs` | **0** | `✓ no strict-type regressions (1120 errors, ceiling 1120)` — total unmoved |
| `npx eslint src/ tests/ scripts/` | **0** | `✖ 31 problems (0 errors, 31 warnings)` — the identical 31 ENC-4 measured; this train adds none |
| `node scripts/check-hazard-registry.mjs` | **0** | |
| `node scripts/premortem.mjs --self-check` | **0** | |
| `node scripts/implementation-packets.mjs validate` | **0** | |
| `node scripts/check-tuning-bands.mjs` | **0** | ⛔ this lane moved no tuning value |
| `node scripts/check-migration-head.mjs` | **0** | |
| `node scripts/check-observed-shape-readers.mjs` | **0** | |

### Instruments measured NOT to move, each by execution

| instrument | verdict | how measured |
|---|---|---|
| `tests/lint/chooserTotality.walker.test.js` `DEFER_CEILING` | **UNMOVED at 36** | the three idiom-signature counts under `src/domain` are identical to the base (33/3/5) and 0 of 294 added src lines carries one |
| `src/domain/worldPulse/habitForkRegistry.js` | **UNMOVED at 42 rows** | file untouched by the train |
| `tests/lint/couplingInclusion.walker.test.js` | **UNMOVED** | `git ls-tree` file set identical to base — no module can change layer |
| `tests/lint/.lighting-census-baseline.json` `files`/`credited`/`parked`/`suiteTitles` | **UNMOVED** | no file added, renamed or deleted anywhere; one literal `describe` throughout |
| `tests/lint/.news-headline-contract-baseline.json`, `.news-voice-baseline.json` | **UNMOVED** | generated-world corpora; the car is dark in every preset, and the dark arm is byte-identical |
| `tests/fixtures/mechanism-lit-coverage-baseline.json` | **UNMOVED** | zero `envoyChanceMeeting` occurrences in it; the train names no `*Enabled` flag in any added line |
| `scripts/.size-baseline.json` | **UNMOVED** | none of the six touched src files is baselined |
| `tests/lint/.wizard-news-authoring-baseline.json` (19-row debt ledger) | **UNMOVED** | both governed sites measured `issues: []`; `candidateSites === sites + 1` holds at `110 === 109 + 1` |
| `tests/lint/heraldRouting.walker.test.js` minter totality | **UNMOVED** | that predicate runs over `KIND_SECTION` keys, and §B claims no letter row (pinned) |
| `tests/lint/negativeAssertionAnchor.walker.test.js` frozen list | **UNMOVED** | 18 negative matchers in the edited walker, **0 un-anchored** (scan replicated); the file is not on the frozen list in either direction |
| `tests/lint/newsSubjectVocabulary.walker.test.js` | **UNMOVED** | it pins `WHAT_PHRASES` size `> 200`; live is 246 |
| `src/domain/display/chroniclersLetter.js#KIND_SECTION` | **UNMOVED** | no letter row claimed by either kind |

### The new reader string against the eight reader rules (executed)

```
the refusal phrase        : "a matter of some moment"
chance_meeting_recorded   "a meeting no court arranged"          clean on all eight checks
chance_meeting_exposed    "a refusal that did not stay private"  clean on all eight checks
   (not the refusal · no terminal punctuation · no digit · no underscore · no brace/dollar ·
    no em dash · no leading capital · no §886 "chance"/"meeting" adjacency)
```

## ⛔ VITEST — OWED, AND THE FENCE IS WHY

The chair's gate held this machine for the whole lane. The quiet-window law (load-1 < 4.0 AND
zero vitest/dist-worker processes for three consecutive 60-second probes) was armed at 09:06 and
probed continuously:

```
09:06:33 probe=1 load1=20.96 workers=14 streak=0
09:07:33 probe=2 load1=11.05 workers=5  streak=0
09:08:33 probe=3 load1=5.58  workers=1  streak=0
09:09:33 probe=4 load1=4.35  workers=6  streak=0
09:10:33 probe=5 load1=3.20  workers=1  streak=0
09:11:33 probe=6 load1=4.67  workers=13 streak=0
09:12:34 probe=7 load1=14.94 workers=13 streak=0
09:13:34 probe=8 load1=14.70 workers=4  streak=0
09:14:34 probe=9 load1=7.55  workers=1  streak=0
```

**Best streak: 0.**

⚠ **AND MY OWN PROBE WAS WRONG IN THE SAFE DIRECTION, WHICH I FOUND BY CHECKING IT RATHER THAN
TRUSTING IT.** The worker count `ps aux | grep -E '[v]itest|dist/workers'` also matches a SIBLING
LANE'S `ugrep`/`grep` process whose own arguments contain the pattern. At 09:15 the raw count read
1 and the corrected count (greps excluded) read **0** — so some of the non-zero worker readings
above were another lane searching, not the gate running. The verdict does not change, because the
LOAD arm was independently over 4.0 on those probes (4.31 at that same moment, against a 15-minute
average of 15.11), and probe 7 measured a genuine 13 workers. A corrected waiter was re-armed at
09:16 (`$SC/enc4b-tmp/quiet-window2.log`). I am reporting the raw log AND its defect rather than a
clean-looking number I would have to defend.

Every proof above was chosen and built to be executable WITHOUT vitest for that reason, including
a 21-assertion re-execution of the walker in plain node with four mutants.

**WHAT IS OWED, and it must run before the registers:**
`sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/` (whole directory — the
seven-member scanner family a single-file green is structurally blind to), plus
`tests/lint/chanceMeetingKindPools.walker.test.js`, `tests/lint/kindPoolFloors.walker.test.js`,
`tests/domain/pantheon.test.js`, `tests/domain/envoyChanceMeetingStage.test.js` and
`tests/copy/`.

**THE ONE REGISTER FIGURE THE CHAIR MUST BANK** (this lane takes no register act):
`tests/lint/.lighting-census-baseline.json` → `titles` **23198 → 23205** (+7: the one edited test
file goes 14 → 21 literal `test(` calls). `files`, `credited`, `parked` and `suiteTitles` are all
UNMOVED — no file was added and the file keeps its single literal `describe`.

---

## WHAT THIS LANE STOPPED ON

1. **VITEST.** The one proof class not run, because the quiet window never opened and running
   under a live gate risks the recorded DOOR-3 under-load FALSE RED and would disturb the chair's
   own act. The exact commands and the one register figure are named above.
2. **THE WORDS FOR THE OTHER HALF OF §B.** An exposed offer made BY a host court's own notable is
   real news and has no authored sentence that can carry it, because variant 1 fixes the refuser
   as being of the host town. The writer is silent there. **Giving it words is a chair annex act
   and this lane did not take it.**
3. **THE traveller × traveller KIND.** Determinable (measured), fenced by the ruling on a prose
   ground that is genuinely the chair's. Not widened.
4. **HBF-42 AND `DEFER_CEILING`.** The brief instructed a move; the row's own accounting and the
   measured scan input both refuse it. **Not moved, in either direction** — a ceiling the volume
   says only a chair may touch.
5. **THE PANTHEON A5 STRUCTURAL CURE.** The figures were moved (a landing cannot be red); lifting
   the six freezes into the shared roster helper — so this cannot be missed a third time — is a
   change to a ruled shape and is left as a chair row.
6. **NO REGISTER ACT of any kind** was taken: no `--update`, `--write`, `--genesis`, `--rebank`,
   no `*_REFREEZE`/`UPDATE_*` env var, no baseline JSON edited, no `npm run build`, no
   `npm install`, no `node_modules` touched, no `git stash`, no `git add -A`, no `--amend`, no
   push, no ref write.

---

## TWO OPERATIONAL NOTES FOR THE CHAIR

1. **A CORRECTED QUIET-WINDOW WAITER IS STILL ARMED** at `$SC/enc4b-tmp/quiet-window2.log` (40
   probes from 09:16). At its last reading the gate was genuinely live — 4 to 6 real vitest
   workers, load-1 between 3.79 and 4.52. If it prints `WINDOW OPEN`, the OWED commands above can
   run immediately.
2. **⛔ THE DOCK IS NOT SEALED, AND THIS LANE'S FENCE FORBADE SEALING IT.** The brief bars ref
   writes, so `refs/preserve/enc4b-*` was NOT created. Four cars exist ONLY as the working HEAD of
   `$SC/laneENC4B` at `9d9686c12ee0eb8385156067985d10cd0a3099ed`, inside a scratch directory — the
   exact exposure the recorded "a scratch-dir death takes every dock with it" hazard describes.
   **Recommend the chair seal this HEAD before anything else.**

## DRIVERS AND LOGS BY ABSOLUTE PATH

| what | path |
|---|---|
| the two synthetic approacher probes | `$SC/enc4b-tmp/approacher-probe.mjs` · `$SC/enc4b-tmp/approacher-probe2.mjs` |
| the real-world exposed sweep, both arms | `$SC/enc4b-tmp/exposed-arm.mjs` |
| the ROLE MIRROR, end to end through the pulse callback | `$SC/enc4b-tmp/role-mirror.mjs` |
| the §A lit arm | `$SC/enc4b-tmp/lit-arm.mjs` |
| the dark-arm byte identity | `$SC/enc4b-tmp/dark-arm.mjs` |
| the walker dry run, its shim, its generator and its four mutants | `$SC/enc4b-tmp/dry/` |
| pantheon A5 re-derivation (base and head) | `$SC/enc4b-tmp/pantheon-a5.mjs` |
| the seal, extracted for the diff | `$SC/enc4b-tmp/seal.md` |
| quiet-window logs (raw, then corrected) | `$SC/enc4b-tmp/quiet-window.log` · `$SC/enc4b-tmp/quiet-window2.log` |
