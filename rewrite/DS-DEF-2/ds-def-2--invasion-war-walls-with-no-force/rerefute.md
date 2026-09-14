# RE-REFUTE — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Seat: opus (refuter / verifier of the CURE), for the Fable chair. Run by hand: the v3 workflow
applied the cure at dock HEAD `569e01793395b37d84af1082833ed8373187c85a` and skipped this
re-refutation on a script join bug.

Test: brief ADDENDUM 14/18 + `../recut/CONTRADICTION-TABLE.md` §V (which governs where it and an
earlier row disagree). A FACE IS LAWFUL UNLESS IT CONTRADICTS THE RECORD. Silence is permission.
"The card does not license it" names no fault. Burden on the refuter: PASS where I cannot name
the field.

Instruments read whole: the brief; `card.md` (775 lines); `speakers.md`; `cure.md`; `refute.md`
(the packet whose findings the cure answers); `../recut/CONTRADICTION-TABLE.md` §V, §R, floor 4
and the header's WHAT IS NO LONGER A FINDING. Read in the dock, READ ONLY (no dock file entered,
edited, staged, committed or run): `src/generators/defenseGenerator.js`,
`src/domain/display/defenseDisplay.js`, `src/domain/display/stateProse/defenseStateProse.js`,
`src/domain/display/stateProse/stateProseKernel.js`,
`src/domain/display/stateProse/faceSources.js`,
`src/domain/institutions/defenseInstitutionBuckets.js`, `src/data/institutionalCatalog.js`,
`src/data/institutionServices.js`, `src/pdf/lib/viewModelBodySlices.js`,
`src/foundry/journalPages.js`, `scripts/lib/dossier-annex-grammar.mjs`.

The rows judged are the ones standing in the dock at that HEAD
(`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, heading `### DS-DEF-2`, the bold pool line
`**\`Invasion & War\`: walls with NO force**`). They are byte-identical to `cure.md`'s block.

TWELVE RENDERINGS: 3 spine rows + 9 `[face]` rows. Seven were re-cut (spine 2, spine 3, 1·2,
1·3, 2·2, 2·3, 3·2); five were kept (spine 1, 1·1, 2·1, 3·1, 3·3). The pool carried a DULL
verdict, so every rendering is judged again and the craft verdict is returned again.

---

## 0. THE RULING THIS PACKET TURNS ON — WHAT "FORCE" MEANS ON THIS KEY

Three of the twelve renderings live or die on one word, and the prior packet's 2·3 FAIL,
the three spines and the new 3·2 cannot all be judged without fixing it. I fix it here and
record it for the chair, because it is the distinction that decides them.

**"Force", on this key, is the engine's own word and carries the engine's own meaning: a
garrison or a militia — never the watch.** The ground is the key function itself:
`defenseStateProse.js:473-479` `invasionRowSituation(walls, garrison, militia)` returns
`'walls, no force'`, and `:455-462` `INVASION_ROW_POOL` names that state
`'Invasion & War: walls with NO force'`. The key consults THREE buckets and the jsdoc at `:449`
reads "INVASION & WAR: walls against a professional garrison or a militia". The same-tab machine
sentence makes the identical distinction and fires on EVERY preimage town:
`threatAssessment.js:119` "Walls present but no organized military force to man them" — printed
on towns that carry a required `Town watch`.

Two consequences, and they are the whole of this packet's coherence:

1. **The spines' "no force under arms behind them" PASSES at town**, even though
   `deriveArmedForces` (`defenseDisplay.js:346-355`) files the required `Town watch` under
   `standing` and `journalPages.js:290-293` prints those groups under a literal heading
   `## Armed forces`. The spine denies the key's own "force", which the key defines as
   garrison-or-militia, and the tab's own sentence says the same thing on the same page.
   F4-18's principle read straight: a key licenses the denial of the buckets IT CONSULTS.
   This key consults walls, garrison and militia — so it licenses the denial of a garrison and a
   militia and licenses nothing about the watch. (Recorded as a WIRING NOTE below, not a
   finding: the seam is real and it is the engine's.)
2. **The prior packet's 2·3 FAIL was correct and the cure was the right cure.** "Nobody who
   asked him was under arms" did not deny the key's "force"; it denied the ARMS OF THE PERSONS
   the required `Town watch` puts on gate duty (`institutionalCatalog.js:1348-1354`;
   `institutionServices.js:1322-1326` "Gate duty" on, p 0.8, "Check travelers entering and
   leaving"), which `deriveArmedForces` files under a printed **Armed forces** heading. Two
   different claims; one is the key's and one is not.

Nothing in this packet reads "force" two ways.

---

## 1. Per-rendering verdicts

| v | face | source | cure | verdict | floor | the field / row / line that decides it | quote (≤12 w) | finding |
|---|---|---|---|---|---|---|---|---|
| 1 | 0 | survey `[ledger]` | kept | **PASS** | — | `defenseStateProse.js:473-479`, `:455-462` (the key's own word) · `threatAssessment.js:119` fires on every preimage town | "The survey finds the walls at {settlement} kept and no force" | No denier. §0 governs: "no force under arms" is the key's own denial at the key's own grain. `{settlement}` in one unit and in no `[face]` sub-row (ruling 12). Not a material word, so V-06 is not reached |
| 1 | 1 | elders | kept | **PASS** | — | `Record of custom` p 0.7–0.8 on `Household elder` / `Village elder` / `Village headman`; the wall-work obligation is modelled nowhere | "The custom the elders keep says which households owe work" | No denier. A record cited to a holder that resolves (F1-24 not reached). The second sentence is an absence over an unmodelled thing — silence is permission. `which` is a determiner inside the clause; `dossier-annex-grammar.mjs:932-938` scans only the backticked joints of the joint-list table, so the face is not reached by wall 6 (re-verified) |
| 1 | 2 | hall · pair 1 · disagree | **re-cut (b)** | **PASS** | — | `defenseGenerator.js:182`, `:189-191` — ONE `milUpkeepMult` over "garrison wages, wall maintenance" together; `Town hall` required at town, "Record filing" p 0.6 seats the filing verb | "puts the walls' keeping under the military purse" | No denier; the claim is the engine's model stated straight. One purse asserted, not two. The `…that X and that Y` frame is gone, as the cure claimed. Hall seated town-only and the pair's partner is town-only, so no tier crossing |
| 1 | 3 | guild · pair 1 · disagree | **re-cut (d)** | **FAIL** | **4** (F4-02 family; V-17 charges the same shape) | `defenseGenerator.js:182` "Economic-upkeep gate (**garrison wages, wall maintenance**)", `:189` `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)`, `:190-191` applied to `military`, whose wall term is `:160` `if (inst.hasWalls) military += 30`; `:138`+`:140` `communityMilBase` is built **only `if (isSmall)`** (`:124` `isSmall = ['thorp','hamlet','village']`) and carries **no wall term at all** (flight feasibility, terrain alarm, community weapons, church, elder coordination — `:141-153`); the recorded field is `defenseProfile.economicGates.military` (`:467`, recorded because `hasAnyDefense` is true **by the wall**), which is in this tab's SAME-PAGE READ SET (card §3) and prints on the same tab at `defenseDisplay.js:317-321` | "the walls are kept up by the households and not out of that purse" | **THE RECORD IS THE FIELD, AND THE FACE YIELDS.** The `guild` source seats TOWN ONLY (`Craft guilds (5-15)` required at town; `faceSources.js:124` GUILD_NAMES), and at town `communityMilBase` is **zero** — so on every town this face can draw there is no exempt portion whatever and the wall's +30 IS the funded stack the military gate bites. The face says the military purse does not keep the walls. That is F4-02's listed claim "the wall paid for itself" from the other side, and V-17 charges the identical shape ("spending on repair rather than on holding") at floor 4. ⚠ **The `disagree` tag closes the escape.** Read alone the sentence has a lawful second reading (the households do the LABOUR, unpaid — unmodelled, permitted). But the face is tagged `pair 1 · disagree` against 1·2, whose claim is exactly "the walls' keeping is under the military purse"; for the pair to disagree at all, 1·3 must deny 1·2's purse claim. The tag fixes the purse reading, so the 3·2-style WITHHELD ("both readings live") is not available. The denier is neither engine prose nor a generation-time projection — it is the generator's own arithmetic and a recorded same-page field — so no WIRING row is available |
| 2 | 0 | stranger + survey `[visitor]` | **re-cut (a)** | **PASS** | — | as spine 1 for the predicate; the households at work on the wall are modelled nowhere | "The people he saw at work on them were the town's own households" | No denier. The perfect/past sits over the stranger's own arrival (ruling 11a), as `refute.md` licensed for "found" and "was stopped". Who repairs a wall is unmodelled — silence is permission. The survey's entry move is gone from this spine, as the cure claimed. ⚠ craft residue: see §2 collapse (1) |
| 2 | 1 | stranger | kept | **PASS** | — | card §(9) names the image; no field models wall fabric geometry | "A traveller found a stair up to the walk" | No denier. Not a material word (V-06 bars "the stone ring" / "the timber line" / "the bank of earth"; a stair and a walk are neither). Still the best face in the pool |
| 2 | 2 | tavern | **re-cut (c)** | **PASS** | — | `Taverns (5-20)` / `Inn (multiple)` required at town (`faceSources.js:121-122`); the key fixes militia FALSE via `institutions[bucket=militia]`; `defenseGenerator.js:124`, `:140` — at town `communityMilBase` is 0, which is the score's construction and denies nothing | "they name who would turn out if the walls were ever wanted" | No denier. Considered and REFUSED as a finding: no militia, muster or body is seated (F1-03 not reached), no roll is cited (F1-24 / §R-8 not reached), no standing manning is asserted (V-27 bars the positive only where NO force row resolves, and the watch row resolves at town), no headcount (F2-01; DS-DEF-5's cell is not touched — names are named, never counted), and a counterfactual is not an event the record did not run (F2-04). The card's §(8) bars the NEGATION "no one would answer"; it bars nothing in this direction. The subject is now the tavern, and the face carries content of its own — the cure's item (c) landed |
| 2 | 3 | gate | **re-cut (e) — the FAIL's cure** | **PASS** | — | `Town walls` → "Gate control" on, p 1.0 · `Palisade or earthworks` → "Gated entry" on, p 1.0 (strangers state their business); the `gate` source seats only where GATE_NAMES resolve (`faceSources.js:130`), so F1-08 cannot be sprung in either direction | "stops a stranger and asks his business before letting him through" | **THE FAIL IS CLOSED.** The offending sentence ("Nobody who asked him was under arms.") is cut, and nothing took its place that denies the watch's arms, its seat or its duty. The surviving claim is the service row spoken straight and is seated on both wall shapes the key pools. The drafter's toll fallback was correctly NOT used (the palisade row seats no toll service). One craft note in §2 on the subject move |
| 3 | 0 | households + survey `[street]` | **re-cut (a)** | **PASS** | — | `defenseGenerator.js:182`, `:189-191` (the gate's scope) vs the wage claim: no field pays a household anything anywhere this desk reads; `communityMilBase` (`:141-153`) is a score baseline, not a payroll | "By their own account there is no wage in the work" | No denier, and the distinction from the 1·3 FAIL is exact and load-bearing: **1·3 denies that the PURSE SPENDS on the walls (modelled at `:182`/`:189-191`); spine 3 denies that the HOUSEHOLDS RECEIVE A WAGE (modelled nowhere).** A town may fund wall maintenance out of the military purse and pay the households who turn out nothing; no field denies that. F4-04 is not reached — nothing here says nothing has been paid. The survey no longer carries this spine; the households state their own claim and the key's absence follows from their account |
| 3 | 1 | elders | kept | **PASS** | — | F2-07 as re-cut grants the comparative by name ("older than the arrangement that pays for it"); `Record of custom` is the memory of boundaries | "where the line runs is the older argument" | No denier. Not F2-01 (no count, share or band), not F2-02 (no date or duration); no printed age is contradicted |
| 3 | 2 | watch | **re-cut (e) — the WITHHELD's cure** | **PASS** | — | `institutionalCatalog.js:1348-1354` `Town watch` required: true, "Part-time guards. Night patrol and gate duty." · `institutionServices.js:1323` "Night patrol" on, **p 1.0** · `Town hall` "Record filing" p 0.6 · the watch source seats only where `standingDefenseForces(settlement).watch.present` (`defenseInstitutionBuckets.js:169-181`, `faceSources.js:127`) | "the hall's record has the walls in it and not the walk" | **THE WITHHELD IS CLOSED.** The purse word is gone and the face is unambiguously the RECORD, so F4-02's split and V-17's charge are no longer available readings — the ambiguity that forced the withhold is removed, and the watch's grievance (fully licensed at F4-19 / V-07) is intact. The contents of the hall's record are modelled nowhere: silence. Sentence 2 confirms a p-1.0 service instead of drifting toward the F1-25 family. ⚠ Considered and REFUSED as findings, both under §0: (i) "on the walls after dark" is not a MANNING in `threatAssessment.js:119`'s sense — the watch is not the key's "force" — so it does not contradict the sentence its own spine restates; (ii) `institutionServices.js:1323`'s "Patrol the streets after dark" does not deny a wall-walk, it simply does not mention one, and silence is permission. Two craft notes in §2 |
| 3 | 3 | court | kept | **PASS** | — | `hasCourtSystem`'s keyword list includes 'town hall' and a required `Town hall` seats it (card §5 ⚠); `Town hall` "Dispute arbitration" p 0.8; a civil arbitration is recorded, a criminal trial is not (R-4) | "None of them are about who would hold them." | No denier. The caseload's CONTENT is unmodelled. "None of them" is an absence over an unmodelled set — the archiver's licensed "it is not recorded that", not an F2-01 count. No trial, gaoling or gallows, so R-4 / F1-12 is not reached. It negates a CASE and never predicates on the Guard Captain |

### Source checks (rulings 13 and 15) — re-run on the cured rows

Every tag is in the kernel's closed vocabulary, re-verified at
`stateProseKernel.js:461-464`: `stranger · elders · hall · tavern · guild · register · muster ·
watch · garrison · gate · market · court`. All nine face tags (`elders`, `hall`, `guild`,
`stranger`, `tavern`, `gate`, `elders`, `watch`, `court`) are in it. Conditional seating is
lawful under car 18c and is mechanical: `faceSources.js:114-138` `sourcesOf` resolves `elders`
by tier, `hall` / `tavern` / `guild` / `court` / `gate` by roster name, and `watch` by
`standingDefenseForces(settlement).watch.present` — so no face draws on a town that cannot seat
its speaker. No speaker is a tier-named NPC: no Mayor, no **Guard Captain**, no High Priest, no
Parish Priest, no singular "the clerk", no singular "the elder"; "a clerk in the hall",
"a factor for them" and "whoever holds the way in" are the card's own licensed forms. The
Guard-Captain trap (card §7 ⛔⛔) is not sprung anywhere, 3·3 included.

**Pair check (V1, hall + guild, `disagree`).** Two different sources, one kind, both town-only,
no tier crossing — mechanically sound. The KIND now matches the faces: 1·3 does contradict 1·2,
which is what the cure's item (d) set out to do. **But it buys the match with the field's
opposite**, and "no source asserts a field's opposite" is the rule that outranks the kind. See
§3 for the structural reading and the two lawful exits (the kinds are CLOSED and named at
`stateProseKernel.js:470-475`: `disagree` · `reinforce` · `aside` · `view`).

### Floor 3 — re-run, clean

No named character's fate; nothing predicated of a deity; no culture furniture across the eleven
profiles (no thatch, no churchyard, no market green); no tier word (F1-31); no minted proper
name (F1-126). The gendered pronouns in spine 2 and 2·3 are NOT a finding — V-27 strikes the
gendered word by name.

### Floor 2 — mechanical sweep of the cured rows

No digit, no date, no season, no duration, no rate, no headcount, no length of wall, no band
word, no "a handful", no "most nights", no trend, no raising narrated, no event the record did
not run. Elapsed forms in the cured rows ("he saw", "were", "found") sit over the stranger's own
arrival or the key's own reads (ruling 11a). "after dark" is a time of day, not a rate (F2-06 /
§S-3 not reached). No em dash, no exclamation mark, no question mark. No contraction. No
notebook device anywhere, correctly: the skeleton reads `covert: no` / `audience: player`, there
is no `dm-only` face in this pool, and F4-13 is not reachable.

---

## 2. CRAFT — pool grain

**VERDICT: PASS.** (Prior verdict: DULL, on three named assembly collapses plus a pair finding.)

Distinct speakers across the twelve renderings: **ten** — survey · households · elders · hall ·
guild · stranger · tavern · gate · watch · court. Stake in every variant. The three collapses
measured against the cure:

1. **THE SPINE TRIAD WAS ONE SENTENCE — HALF CURED.** The survey's entry move ("Entered here as
   kept") now appears in spine 1 alone, and each spine now lands on a different noun (kept /
   households / the walls) with a second sentence of its own content. **But the predicate is
   still verbatim in all three** — "no force under arms behind them" · "no force under arms
   behind them" · "no force under arms behind the walls" — and spine 2's FIRST sentence is still
   spine 1 with the attribution swapped and "up and" inserted. The cure's item (a) had two
   halves and only one landed. Not enough to hold DULL (twelve renderings no longer read as one
   sentence, and the neighbouring pools' spines vary their words where this one repeats them),
   but it is the one residue the chair may want bundled into the 1·3 re-cut. **The cheapest fix
   is the one §3 already recommends and it closes three things at once.**
2. **ONE ATTRIBUTION FRAME CARRIED FOUR OF TWELVE — CURED.** The twin-that frame
   ("…holds / hold / says that X … and that Y") survives nowhere in the pool. 1·2 is off it on a
   filing verb and a locative; 1·3 and 3·2 carry single-clause attributions; the adjacent-sibling
   collision inside V1 is gone. Attribution verbs in row order: finds · says · puts · holds ·
   reports · found · name · stops · say · (none) · says + finds · reach — no verb three times
   running, so the selector's veto is not tripped.
3. **V2 WAS FOUR RENDERINGS ON ONE GRAMMATICAL SUBJECT — CURED.** Subjects are now the stranger,
   the traveller, the tavern's table and whoever holds the way in. The two consecutive passives
   are gone, and 2·2 carries content of its own (who would turn out) instead of reporting that
   two accounts exist.

**Not duller than the shipped rows it replaces.** It still drops all four of the still-false
shipped clauses ("substantial works", "how relaxed the people on it are", "takes this town with
ladders", "clergy who tend the sick") and puts ten sourced speakers with stakes where the
shipped corpus had a camera.

**Craft notes at the face (reported, never floors).**

- **3·2** is a non-pair face carrying TWO sources: the watch speaks, then the survey answers it
  ("The survey finds them on the walls after dark all the same"). The office closing a source's
  grievance inside one face is the shape ruling 22 fences to a pair's third sentence, and it
  reads as the record scoring a point off its own speaker. The claim itself is lawful (Night
  patrol, p 1.0) — it is the ARRANGEMENT that is worth the chair's eye. The concessive tag "all
  the same" is on the exemplar pack's tells list (the clever last beat); per the brief that list
  is the SELECTOR'S veto and never a refuter's finding, so it is passed along and not charged.
- **2·3** is now a `[gate]`-sourced face in which the gate's holder is described rather than
  reported: no attribution verb, no stake voiced. The cure moved the subject (correctly, for
  collapse 3) and in doing so turned a stranger's report into the archiver's flat description.
  Lawful; one notch away from the bare assertion ruling 13 tells the selector to refuse.
- **1·2**'s second sentence ("At the hall it is not a thing in dispute") is a near-tautology
  beside a partner face that disputes it. It works as the hall's complacency; it is the thinnest
  sentence in the pool.

---

## 3. THE ASSEMBLY FAULTS — DID THE CURE CLOSE THEM?

| fault (from `refute.md`) | cure's item | closed? |
|---|---|---|
| the survey clause carried thrice; spine 2 = spine 1 permuted | (a) | **half.** The ENTRY move appears once; the PREDICATE is still verbatim in all three spines and spine 2's first sentence is still spine 1 with the attribution swapped |
| one attribution frame carried four of twelve, two adjacent siblings | (b) | **yes** |
| V2 four renderings on one grammatical subject | (c) | **yes** |
| a `disagree` that agreed | (d) | **NO — cured unlawfully.** The kind now matches the faces only because 1·3 asserts the field's opposite. See below |
| the 2·3 FAIL (floor 1, F1-25) | (e) | **yes — cut, cleanly** |
| the 3·2 WITHHELD (F4-02 / V-17 reading live) + its craft fault | (e) | **yes — the purse word is gone, the reading is fixed on the record, the stacked relative clauses are gone** |

### The structural finding under fault (d), for the chair

The pair had one fact worth disagreeing about and that fact is MODELLED. When two sources are
made to disagree about a modelled fact, one of them must state the negation of a field — which is
what happened. **On a pool whose dispute-worthy facts are the engine's own, a `disagree` pair
cannot disagree about a FACT.** The lawful forms are:

- disagree about an **unmodelled** fact (silence permits both accounts — who does the labour,
  who turns out, what the hall wrote down);
- disagree about the **worth or the meaning** of a modelled fact (the guilds may hold that what
  the purse buys is a wall and no men, and that this is a waste — a valuation, not a denial;
  the card's own §(9) gives them exactly this stake: "the guilds pay into the purse and want it
  elsewhere"); or
- re-tag the pair `aside` or `view` (both are in the CLOSED kind list,
  `stateProseKernel.js:470-475`) and let 1·3 keep the grievance it had.

The narrow cure for 1·3 is to keep sentence 1 ("The guilds pay into the military purse.") and
replace the denial with the grievance's lawful form — what the purse bought, not who paid for
the wall. That keeps the pair a real `disagree` (the hall defends the line of spending; the
guilds hold it bought nothing that stands on the wall) without any source denying a field.

### The one change that closes fault (1) as well

Bringing the spines' predicate to the engine's own words — "no organised force to man them",
or the roster fact plainly ("no garrison and no militia") — would, in one move: (i) vary the
verbatim clause the three spines still share, (ii) put the pool beyond the "Armed forces"
wiring seam recorded below rather than merely on the right side of it, and (iii) restate
`threatAssessment.js:119` in the engine's own grain, which is what the card names as the safe
absence. Recommended, not required: the spines PASS as they stand under §0.

---

## 4. WIRING rows

**W-a — ENGINE PROSE NAMES A GARRISON ON A KEY THAT DENIES ONE (new; chargeable to no face).**
`defenseDisplay.js:278-284` `READINESS_GATE_FOR` maps `'Invasion & War' → ['military', 'garrison
pay']`, and `:317-321` prints `Upkeep underfunded: garrison pay at N%` on the Invasion & War
readiness row whenever `economicGates.military < 1`. On THIS key the garrison bucket is FIXED
FALSE, and the gate is recorded at all only because `hasAnyDefense` is satisfied **by the wall**
(`defenseGenerator.js:177-178`, `:467`). So on every preimage town with `econOutput < 50` the
defense surface prints a funding note naming a garrison's pay on a town the key says has no
garrison. This is the §1.4 family and the twin of W-19 / W-22 (`governanceNarrative.js:506`
mints "The guard" where no force row exists). No face is charged: the corpus faces are the
truthful party (R-1). The chair may want it routed as a wiring car — the honest expense word on
this key is the wall's keeping.

**W-b — NOTE, not a row: the "Armed forces" seam.** `journalPages.js:290-293` prints a literal
heading `## Armed forces` over the groups `deriveArmedForces` returns
(`defenseDisplay.js:340-355`), whose `standing` group is `garrison + militia + watch`
de-duplicated — so on the 51 of 128 preimage towns at town tier the dossier prints
"Town watch: Part-time guards. Night patrol and gate duty." under **Armed forces** on the same
surface that prints `threatAssessment.js:119` "no organized military force to man them". Both
are correct in the engine's own vocabulary (§0) and no face is charged, but this is the exact
seam that produced the prior packet's 2·3 FAIL, and it is the reason a face on this key must
never reach for "under arms" as a claim about PERSONS rather than about the key's force.
Recorded so the chair can rule whether the corpus should be held to the engine's `:119` wording
on every `walls with NO force` spine.

**The card's own ⚠ SEAM** (machine rows read `defenseProfile.institutions.*` SNAPSHOT while a
force key reads the LIVE roster) bears on no finding here: the two agree at generation, which is
when the draw runs (R-2).

---

## 5. What this packet does NOT charge, by name

So a successor does not re-find them as bugs:

- The three spines' "no force under arms" — PASSED under §0, with the residue recorded at §3 and
  the seam at W-b. A refuter who reads `deriveArmedForces`'s "Armed forces" jsdoc and the printed
  heading without reading the KEY will charge these; do not.
- 3·2's "on the walls after dark" — PASSED. `institutionServices.js:1323` puts Night patrol on
  the streets; it does not deny a wall-walk, and silence is permission.
- 2·2's "who would turn out" — PASSED. No body, no roll, no count; the card bars the negation
  ("no one would answer"), not this.
- 3·1's "the older argument" — PASSED; F2-07 as re-cut grants the comparative by name.
- 1·1's "which" — PASSED; the grammar's wall 6 scans backticked joints only
  (`dossier-annex-grammar.mjs:932-938`), re-verified at this HEAD.
- The tells on 3·2 ("all the same") and the flat attribution on 2·3 — passed to the SELECTOR,
  which owns that veto list; a refuter may not charge them.

---

## 6. SUMMARY

- **Eleven of twelve renderings PASS. One FAILS: 1·3, floor 4.**
- Both prior findings are CLOSED by the cure: the 2·3 floor-1 FAIL (F1-25, the negation
  direction) and the 3·2 WITHHELD (F4-02 / V-17 ambiguity plus its craft fault).
- The pool-grain **DULL is lifted to PASS**: two of three assembly collapses fully cured, the
  third half cured, ten speakers with stakes, twelve renderings differing in subject and landing
  noun.
- **The cure's item (d) is the one that did not land lawfully.** It made the `disagree` pair
  genuinely disagree by having the guilds' factor deny a modelled field. The pool needs one more
  narrow cut at 1·3 — and the chair should take the spine-predicate variation (§3) with it,
  since it is one change that closes the last craft residue and the last wiring exposure.
