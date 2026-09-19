# WC_SEAM_TABLE — THE WAR-CIRCULATION VOLUME'S §8 SEAM APPARATUS

**DATE: 2026-08-07.**
**PREPARED UNDER OPUS 5, NOT FABLE 5.**
**⏳ OPUS-ERA — FABLE SURVEY OWED.**

> **THIS DOCUMENT IS VETOABLE.** It decides one thing — the GRANULARITY at
> which `WC_war-circulation_in-progress-snapshot.md`'s SECTION 4 becomes
> §8.1 rows — and that decision is the only thing a future session need
> disagree with. A veto costs one word today; a wrong seam count baked
> into the parent volume's §9 arithmetic costs the fold.

---

## ⭐⭐ WHAT THIS DOCUMENT IS — A TRANSCRIPTION, NOT NEW ARCHITECTURE

**Every row below already exists in the WC volume as prose.** This document
invents no seam, mints no contract, and adds no obligation. It takes
`WC_war-circulation_in-progress-snapshot.md` **SECTION 4 — THE COORDINATION
CONTRACTS** (L4552-4787), whose own opening states the seam contract exactly —

> "Explicit shared-vocabulary and shared-machinery contracts with the three
> sibling volumes and the built WR surfaces. Each contract names the OWNER
> of the shared thing, the CONSUMER, and the seam enforcement." (L4554-4556)

— and puts it in the house four-column shape that `EPOCH_living-futures_round7-snapshot.md`
§8.1 (TEN rows) and `HABIT_conditioning_round4-snapshot.md` §8.1 (THIRTEEN rows)
already carry. **Every row cites the WC line that is its source.** Where a
row's TRIPWIRE cell names a pin, that pin is quoted or paraphrased from WC's
own §7.E walker inventory, its wave PINS blocks, or its §2.4 stated fences —
never composed here.

**⛔ WHY A SEPARATE FILE RATHER THAN AN EDIT TO WC.** The volume is not
touched, so the transcription stays auditable against its source line by
line. The fold splices §8 / §8.1 in; until then a reader can diff this
document against SECTION 4 and see that nothing was added.

**⛔ WHAT THIS DOCUMENT DOES NOT DO.** It does not re-measure the volume, does
not rule any open chair question, and does not repair the three contracts
recorded in §8.2 as carrying no expressible tripwire. Those are named, not
fixed.

---

## THE COUNTING RULE THIS TABLE IS BUILT TO SATISFY

**MEASURED, by executing the instrument.** `HABIT_countsweep.py`'s `seams()`
(L327) is `table_by_header(self.text, ["#", "Neighbour", "The contract", "The tripwire"])`,
and its consumer (L644-650) is `Result("seam_rows", len(sm), "count data rows of §8.1")`.
**There is no filtering** — every data row of the single table matching that
exact four-cell header counts. (Its sibling `anticipation_seams()` DOES drop
struck rows; `seams()` deliberately does not.)

**CONFIRMED — the rule reproduces the two folded volumes exactly.** Executed
against the real parser at this revision:

    EPOCH_living-futures_round7-snapshot.md   -> 10 rows
    HABIT_conditioning_round4-snapshot.md     -> 13 rows
    WC_war-circulation_in-progress-snapshot.md -> LookupError: no table with
                                                  header ['#', 'Neighbour',
                                                  'The contract', 'The tripwire']

**⚠ HEADER SPELLING: `Neighbour`, the British spelling, is used.** This is
the load-bearing detail. `seams()` matches the header by EXACT cell equality,
so the folded ES/WY volumes' `Neighbor` spelling would return `LookupError`
and the count would read as ABSENT, not as zero. HB and EP both spell it
`Neighbour`; this table matches them.

**⚠⚠ THE PHRASE "seam row" IN WC IS A DIFFERENT CONCEPT AND MUST NOT BE
COUNTED.** MEASURED: it appears ELEVEN times in the volume (L1814, L1924,
L2192, L3859, L3897, L4141, L4162, L4294, L4317, L4644, L6400) and in every
one it means *a test pin inside a wave that reds when its counterpart volume
lands* — the TR-5 pre-pinning pattern — not a row of a fold-time seam table.
A count taken from that phrase would be a fabricated number.

---

## §8 SEAMS PINNED BOTH SIDES

### 8.1 The TWENTY-THREE seam rows (rows 1-22 transcribed from SECTION 4 at revision cbd348a5-base; ⭐ row 23 added by the 2026-08-07 chair ruling below)

| # | Neighbour | The contract | The tripwire |
|---|---|---|---|
| 1 | **HABIT / HB-1 — the strategist move vocabulary** (collision C1) | MEASURED at HEAD: `settlementStrategy.js` exports NO closed move vocabulary — `enumerateMoves` is module-private at `:634` with a bare re-export at `:1360`. Exactly ONE module exports the closed list; whichever volume builds its strategy wave FIRST mints it as a dependency-free leaf, the second AMENDS the same leaf. WC's three auxiliary moves (`send_reinforcements_to` / `send_supplies_to` / `recall_support`) register in WC-4 ONLY through that shared leaf. ⚠ Until the reciprocal clause is written INTO the habit directive's memory file and `FABLE_VALIDATION_QUEUE.md`, this is a RECOMMENDATION WITH A FENCE, not a contract — a contract written in one of two volumes has one signature | **THE MOVE VOCABULARY FENCE, WC-0** (the registration wave, so it exists BEFORE either volume's strategy wave): matches an exported const against `/^[A-Z0-9_]*(STRATEGIST\|SETTLEMENT)?_?MOVES?$/` plus the frozen alias list `['STRATEGY_MOVES','STRATEGIST_MOVES','MOVE_TYPES','SETTLEMENT_MOVES','MOVE_VOCABULARY']`; EXCLUDES `ENGAGEMENT_MOVES` (`convergence.js:185`) and `REACTIVE_MOVES` (`:743`) by exact identifier, and that exclusion is itself pinned. ASSERTS at-most-one tree-wide **with `toEqual` against a named list, never a bare `<= 1`**, so a signature gone blind reads as an empty list rather than a pass. NON-VACUITY arm: the scan must FIND the excluded pair. Red proof: a second exporter planted, caught, removed |
| 2 | **HABIT r16 / the law-band modulation table** (collision C3) — four consumer families: HABIT learning rate-decay, WC relay efficiency (1.3.2), WC block cohesion (1.5.2), WC drift expression (1.6.3) | ONE frozen zero-import leaf; same mint-first arbitration as row 1 and the same two repairs. Each consumer may carry its own CURVE ROW in the one table; none may carry a private table. ⛔ **AND THE ROW LANDS WITH ITS CONSUMER, NOT WITH THE TABLE**: WC-0 registers the table's SHAPE (closed key set, throw-on-unknown, totality export, registration entry point) and **NO VALUES**, because a curve is a constant and constants are owner-signature surface under THE PROMISE — landing four of them in the wave whose closing line reads "TUNING: none" is exactly the drift the versioned-tuning carve-out exists to stop. `lawWordFor`'s three words are the only vocabulary it may key on; no fourth word ever | **THE LAW-BAND TABLE FENCE, WC-0**: matches `/LAW_BAND[A-Z0-9_]*\|[A-Z0-9_]*MODULATION_TABLE$/` plus any module exporting `registerLawBandCurve`; EXCLUDES `LAW_WORDS` and `LAW_WORD_EDGES` (`lawWord.js`) — the fence guards the CURVE TABLE, not the words. ASSERTS at-most-one exporting module. NON-VACUITY arm: the scan must FIND `lawWord.js`'s excluded pair. Plus the table's TOTALITY pin, stated in the direction that survives a partly-filled table: **every REGISTERED key has a curve and every curve names a registered key — never that the table is full at WC-0** |
| 3 | **HABIT r5 — the believed-doctrine axis family** (collision C2), minted on SP-B's machinery | HABIT MINTS; **this volume CONSUMES and mints no axis** — R9's reliability page, clause (f)'s believed share, clause (h)'s comrade accuracy. ⚠ COMRADE ACCURACY IS ARCHITECTED AT 1.6.4, NOT IN THE COORDINATION NOTE: it is a bounded fidelity modifier on the existing belief reads (`comradeFidelity01`, capped by `COMRADE_FIDELITY_MAX < 1.0`), not a new channel, and it improves the ACCURACY of HABIT's level-one anticipation **without raising the LEVEL** — the composition with the habit directive's "anticipation bounded at level ONE" is stated in 1.6.4 | Until HABIT lands, PRE-PINNED SEAM ROWS: WC-5 for the reliability page and WC-9 for the fidelity term, **each with an executed red-capability proof** (WC-5's PINS block names "the two seam rows (SP-D, HABIT)"). At WC-9 the comrade-fidelity rider runs THREE mutants — **term-deleted, cap-removed, and depth-raised** — the last being the one that proves accuracy improves while the anticipation LEVEL never does |
| 4 | **HABIT r17's named-domain checklist — graded closes** | Every WC fork that should teach (the call-in answer, the block fork, the host rejection, the buy-off, the muster fork) emits a HABIT-shaped graded close where HABIT is lit, **and a deferred-with-reason row where it is not**. HABIT's checklist gains the auxiliary rows at ITS fold; this volume's closes are enumerated in WC-5, WC-8, WC-12, WC-13 and WC-16 for that checklist to consume | The buy-off-teaches pin at WC-12: a buy-off close writes the graded close the habit system will read, and **the no-close mutant reds the seam row** |
| 5 | **WAYFARE / WY-8a — carried supply (F9 `supplyCargo`)**, ONE writer `armySupply.js`, flag `armySupplyEnabled` | SUPPLY IS WY'S. F9 is owner-SIGNED under the blanket sign-off (2026-08-05) but **UNBUILT**. WC's carried-supply consumers (WC-10 envelopes, WC-11 starvation) HARD-GATE on WY-8a's build; the relay (WC-3) moves stores through `supplyShipments` and does not touch F9. ⭐ Auxiliary supply rides the `supplyShipments` link chain for settlement-to-army consignments and F9 for what the army CARRIES — **two different conservation identities, deliberately not merged** (carrier = shipments, cargo = F9) | The dependency graph's own gate: `WC-10 <- WC-3, WC-6 [HARD GATE: WY-8a built]`. WC-10 is undispatchable until WY-8a lands, so the seam cannot be crossed by a wave that merely assumes the field |
| 6 | **WY's THREE-EXHAUSTIONS law** (`accumulatedAttrition` vs realm `warExhaustion`) | Restated as this volume's ONE-CLAUSE VETO in §0.3: **every supply consequence writes the army's OWN `accumulatedAttrition`, never realm `warExhaustion`** | The envelope exhaustion WRITE-SET pin at WC-10, whose red proof is **the realm-exhaustion-write mutant — the one-clause veto, executed**. A write-set pin rather than a value pin is what makes the veto testable rather than aspirational |
| 7 | **WY's closed ENCOUNTER TABLE** (E14 exists; E16 brigand × settlement and E17 column × host are this volume's) | The table is WY's; the rows are this volume's. **Every new co-location resolver adds its row IN ITS OWN COMMIT**, moving the closed table's anti-vacuity count | Row and resolver land in the SAME COMMIT, and the table's existing ANTI-VACUITY COUNT moves with them — a row admitted without its resolver leaves the count unmoved. Graph: `WC-12 <- WC-11 [E16/E17 rows with resolvers]`. ⚠ Where the WY table does not yet exist, the arm falls back to pre-pinned seam rows on the WC-3 pattern |
| 8 | **WY-1 — `hopWeeks` / per-digest calibration, and `kmScale`** | `hopWeeks`/calibration is the ONLY distance law; every WC band derives from the published calibration at READ TIME or carries the WY-1 ordering note. ⚠ **MEASURED: `kmScale` does not exist at HEAD.** If WC bands land before WY-1's spectrum surface, each carries an in-file derivation note. ⚠⚠ Never an authored absolute week literal: a realm spans roughly 2..8 march weeks under per-digest calibration, so any authored band ≥ 9 refuses nothing (the dead-band class) | A SHRINK-ONLY CENSUS ROW per band (CR-WC-15), which reds if the population of un-calibrated bands GROWS, closed by WY-1 when it publishes; plus, when `kmScale` lights, a declared one-time behavior shift under the golden-shift law rather than a silent re-record |
| 9 | **`MigrationColumn`** — WY/POP's object (`spatial/migration.js`) | This volume WIDENS the class list and **adds no second column ledger**. `MILITARY_COLUMN_CLASSES` (3 members incl. `reinforcement_column`) plus the frozen union land ALL AT WC-0; the stamp and key predicates widen from the DEMOGRAPHIC list to the union in the same commit, byte-identical because no producer exists yet. **The `travelClass`-in-the-key discipline is preserved verbatim** | The column key-collision pin, FIRST at WC-6 (**the class-out-of-key mutant on a `reinforcement_column`**) and RE-RUN at WC-13 on a `shed_column` — ⚠ the re-run is NON-VACUOUS only because `reclass` is the first producer that ever stamps the class; before it, the re-run passed happily over a member nothing minted |
| 10 | **WY's LAW M — the movement manifest** (`tests/lint/namedPersonTransitTotality.walker.test.js`, `MOVEMENT_SITES`) | ⛔ **LAW M IS NOT WIDENED.** MEASURED at HEAD: `MOVEMENT_SITES` is a NAMED-PERSON leg-physics census by its own header and by its discovery signature; `armyTransit` is OUT OF ITS SCOPE, not exempt from it, because it moves COUNTS. WC-11 therefore mints a SECOND, counts-mover manifest with its own signature, **leaving WY's law and its header untouched**. WY seam 6's filed candidate is answered by the second manifest, not by an edit to WY's guard (CR-WC-10) | The counts-mover manifest at WC-11: **the stepper-without-row plant**, plus **the DISJOINTNESS PROOF — a planted named-person token does NOT enter this manifest, and law M is unedited**. The disjointness arm is the half that keeps the second manifest from quietly becoming a fork of the first |
| 11 | **WY-8a — the shared ARRIVAL EDGE detector** | The army-side arrival edge detector minted in WC-6 is **offered back to WY-8a as the shared edge — one detector, two consumers** — coordinated at the fold | Pre-pinned per §7.E's closing law: "WY-8a arrival sharing" is a seam row carrying **an executed proof that the pin CAN red (the planted-consumption test), per the TR-5 pattern** |
| 12 | **ESPIONAGE — the casus discipline** (ES §5 row 1) | A new casus is a war-surface change costing the full six surfaces + scorer + mirror. **This volume mints NO new casus** — the discipline is honored by SCALING EXISTING READS | §2.4's stated fence, a one-line veto surface: **"The casus taxonomy: zero new `WAR_REASON_TYPES` members."** MEASURED: `WAR_REASON_TYPES` is named exactly ONCE in the whole 6,492-line volume, and it is in that fence — so a WC diff introducing a member is visible by inspection against a surface with no competing mentions |
| 13 | **ESPIONAGE — the competence/porosity terms** (`COMP_CRIME_W`, `criminalStrength01Of`) | Clause (p)'s crime-eases-infiltration composes through the EXISTING competence terms; **no second spelling of the catch model**. The diaspora-ease term (1.13.3) enters the same composition as one more named term, and **the worse-of discipline for security reads is preserved** | The crime-composition pin at WC-12: **the worse-of discipline holds — no blended fourth spelling — enforced by source scan** |
| 14 | **`leviedPopulationBySource`** (writer `warHomeCosts.js:443/450`; readers `warCosts.js:367`, `warCoalitionExpenditure.js:159`, `deploymentReturn.js:284`; cert row `subsystemRowsWar.js:199`) | The people ledger **EXTENDS it — `blocks[]` reconciles to it exactly — and never forks it.** ⚠⚠ Attribution by RECONSTRUCTION from the banked map, **never by splitting an id on `.`** (the standing WR-8 law) | The blocks/levied reconciliation pin at WC-6, now DIRECTIONAL, with **THREE mutants**: headcount-skew; MISSING-SELF-BLOCK (reds clause (i)'s total identity); and ELECTED-ROW-WRITTEN-INTO-THE-LEVY-MAP (reds clause (ii)'s equality arm). ⚠ The old equality-everywhere form is recorded UNPASSABLE so no wave restores it as a "tightening". Plus the reconstruction-attribution scan at WC-6: **an id-split call planted and caught** |
| 15 | **`deploymentReturn`'s conservation identity** (`fell` the sole combat sink; largest-remainder apportionment; `:270-346` verified) | Every new branch this volume adds — defect, orphan, shed, and the tag arms of the census-debiting events — **preserves the identity by naming its event in the walker's closed list**. The identity's statement WIDENS and never weakens. `untag` moves no counts and is inert to this identity by construction | The conservation walker at WC-6: **a one-count-drop mutant PER BRANCH**, with per-event coverage growing at each wave's closed-list addition. ⚠⚠ Plus THE SOURCE BRANCH's **BIRTH-INFLATION mutant**, run beside the three sink-drop mutants — before round 3 `births` was a bare term and an invented birth was invisible by construction: **a walker that can see a stolen death and not an invented birth is a guard with one eye** |
| 16 | **WR-6 — `warCoalitionLedger.js:5-6`** | **No membership list, no stored expenditure total on deployments; `joinLedger` stays single-anchor.** Contribution is its own ledger; balances are DERIVED READS | §2.4's stated fence ("`joinLedger`: stays single-anchor; no second anchor kind") plus **THE ONE-BALANCE FENCE at WC-5**: a source scan asserting the answer fork, the breach grade and the K5 terms weight all call `contributionReads.js`'s ONE balance read and never reach into `warContributions` or the edge archive. ⭐ **THE PIN THAT PROVES THEY ARE ONE QUANTITY**: forgiving the obligation moves the answer fork AND the K5 terms weight in the SAME TICK — the forgiveness-invisible-to-the-fork mutant reds, and that mutant is exactly what a second reading of "the balance" would have shipped |
| 17 | **WR-10 — the sovereignty market** | WR-10 owns the debt-to-vassalage transaction shape; **this volume adds the intent road only.** ⚠⚠ Sale treaties keep `buyerId`/`sellerId` drop-when-absent and **NEVER victor fields** (the standing WR-10 law); the conveyance-value read the overshoot signaling feeds is the market's EXISTING read | The `TERM_FAMILIES` consumer census at WC-0: **a planted iteration over `TERM_FAMILIES` caught**; plus `WR10_FAMILIES_AT_LANDING` widened by the two families and `sovereigntyBundleWr10`'s PIN 1b consumed AS ITS OWN DOCSTRING INSTRUCTS, in the same commit with the reason quoted. ⚠ The family list is DERIVED (`peaceTermsCatalog.js:192`), so the no-producer recipe does not reach it |
| 18 | **`occupation.js`** — owner of the five-rung ladder (`STATE_LADDER :117`: contested / unstable / extractive / stabilized / vassalized) and of resistance | WC's R6 and resist-fork are **consumer inputs to existing advances, never new writers.** RELEASE STANDING composes into `stabilizationSuitability (:386)`, the existing input to `advanceOccupationState (:442)`, so a loyal over-deliverer climbs sooner to `vassalized` through `vassalizationOutcomes (:724)`. ⛔ **THE REGRESSION AND LIBERATION ARMS ARE NOT TOUCHED**: the collapse arm, the regress-below-contested arm and the `MAX_CONTESTED_DWELL` valve are RESISTANCE's, and routing loyalty standing into them would put loyalty and revolt on ONE LEVER WHERE THEY CANCEL | The three-deliverer coercion pin at WC-4: **the standing-deleted mutant (all three arms)** and **the STANDING-INTO-REGRESSION mutant — the neutral arm, in which a loyal town's occupation collapses.** The second mutant is the executable form of the "arms not touched" clause: it reds precisely when loyalty has been wired into the revolt lever |
| 19 | **`warTermination.js`** — frozen at 818 eff, BASELINED shrink-only | The close EVENT this volume folds on is `readWarTerminations`' EXISTING output; **the contribution fold is a CONSUMER. Zero edits to the frozen file.** Stance scaling reads happen in consumers | §2.4's stated fence ("`warTermination.js`: zero edits (frozen)") standing on the shrink-only size baseline at tolerance zero — **any diff to this file originating in a WC wave is the tripwire** (the `momentum.js` precedent from HB §8.1 row 8, applied to WC's own frozen surface) |
| 20 | **`traditions/relations.js`** — `advanceRelations` | The introduction attempt is a **FOURTH pass with its own `mutationLog` kind**. The influx-read TIMING LAW is inherited unchanged: **origin captured at `max(departTick, arrivalTick-1)` because release destroys origin** — the cohort tag banked in the column record is the same pattern. ⚠ `DESIGN_TRADITIONS.md` lives on the LEDGER BRANCH ONLY, so the WC-14 build brief must carry the pointer | The most-attempts-fail pin at WC-14: across the seeded corpus the introduction adoption rate lands inside an authored band, and **the always-adopt mutant reds**. Plus the double-effect single-call pin (one fixture, both effects, the SAME share value read from ONE call — the two-computations mutant reds) |
| 21 | **DEMOGRAPHICS** — cohort mortality and the two-lane double-answer hazard | Cohort mortality rides the settlement's REALIZED death fraction at the year fold. ⚠ The two-lane hazard (`populationDynamics` + `demographics` both moving people) is **NOT WORSENED: every WC outflow is a people-ledger event through the column machinery, NEITHER PRESSURE LANE**; the wave P4 reconciliation stays deferred and untouched | The mortality-decay fence at WC-15: **the calendar-decay mutant plus the zero-death-rate no-fade fixture** — ⚠ CARRIED IN BOTH VARIANTS until CR-WC-21 is ruled, so **the wave does not land on a coin flip.** The people-ledger half is held by WC-6's conservation walker, which admits no count that moves outside a named event |
| 22 | **`pressureModel` / `stressorDynamics`** | The embattled member joins `CRIME_ARCHETYPES`; **the stressor is CATALOG-ORDINARY** (the `pestilenceKernel` precedent), injected through `stressorsCore.normalizeStressor`. ⛔ Any counterforce row `stressorDynamics` needs **forces the leaf extraction FIRST — extract, never baseline-grow** | The ONE-STRESSOR pin at WC-12: the embattled stressor is the ordinary catalog stressor, deduped by canonical id, and **the parallel-stressor mutant reds.** The extraction half is held by the ceiling ledger: a WC wave that grows the baselined file fails the size ratchet at tolerance zero before it can add the row |
| 23 | ⭐ **SPINE / SP-D — the errand spine, and the CALL-IN CARRIAGE.** ⚠ **NOT A SECTION 4 CONTRACT.** Added by the 2026-08-07 chair ruling below, which held that a seam is a contract with a neighbour plus a tripwire, that SP-D has both, and that the absence from SECTION 4 is A GAP IN THE SECTION rather than an absence of the seam. Its three homes in the volume, each cited: §7.E names "SP-D call-ins" as the FIRST of four pre-pinned seam rows (L6400); §7.F gates the wave on it, `WC-5 <- WC-1, WC-2 [call-in slice gated: SP-D...]` (L6424); §2.3's attachment table rows it explicitly — "call-ins (the carriage) / SP-D errand purpose classes (`ENVOY_PURPOSES` closed at 2 today, `envoyErrandVocabulary.js:119`) / purpose class + registry row; pre-pinned seam until SP-D lands" (L3306-3308) | **THE RECORD AND THE CARRIAGE ARE SPLIT, AND ONLY THE CARRIAGE IS SEAMED.** §1.9.1: the `CALL_IN_REQUEST` record is ordinary bounded state on WC's own contribution ledger, drop-when-empty, capped at `CALL_IN_REQUESTS_CAP`, and **it needs no errand to exist** — "a call-in without the errand is a standing ask that lapses on its horizon; a call-in with the errand is an envoy at the gate", and nothing in the grading depends on which the world has. The CARRIAGE is the seam: a call-in rides SP-D's spine as a typed purpose, and **WC mints no second purposeful-travel substrate** (J-SP-2: there is exactly one). ⚠⚠ **AND THE COUNTERPART HAS LANDED, SO THIS IS A DISCHARGEABLE PRE-PIN, NOT A PENDING ONE.** MEASURED at build HEAD `eca65c8a` on `claude/composite-r4`, against §1.9.1's premise "the purpose-CLASS machinery is SP-D's mint — `errandMint.js` is ABSENT at HEAD", which is now REFUTED: `errandMint.js` exists and its gate `errandSpineEnabled === true` is read at `errandMint.js:76`, the only such read in the tree; the mint landed `ENVOY_PURPOSE_CLASSES` — six frozen classes (commercial, covert, diplomatic, factional, personal, religious) at `envoyErrandVocabulary.js:130` — plus `PURPOSE_CLASS_BY_PURPOSE` (`:147`) as DATA rather than inference, and `ERRAND_CONSUMERS` (`:276`), the consumer registry. ⭐ **WC's own cited address is STILL EXACT: `ENVOY_PURPOSES` is still `Object.freeze(['sue', 'self_parlay'])` at `envoyErrandVocabulary.js:119`** — closed at TWO, exactly as §2.3 and WC-5 state | ⛔ **THE PRE-PIN AS WORDED CANNOT FIRE, AND MUST BE REPLACED RATHER THAN CARRIED.** §7.E specifies "a pin that reds when SP-D lands without consuming it" (the TR-5 pattern). SP-D HAS LANDED. A pin authored now to red on that event is authored PAST its own trigger — it is green forever and certifies nothing, which is precisely the vacuity §8.4 item 3 warned of. **THE DISCHARGE, AND IT USES MACHINERY THAT ALREADY EXISTS AND ALREADY HAS FIVE USERS:** WC-5 takes its own row in `ERRAND_CONSUMERS` — `{ consumer, purposeClass, module, wave: 'WC-5', built: false }` — in the wave that mints the call-in record, and flips `built: true` in the SAME COMMIT as the carriage. `tests/lint/errandConsumerRegistry.walker.test.js` measures that row BOTH WAYS against the tree, continuously: DIRECTION 1 reds when a module mints through the spine with no registry row ("an unregistered minter is how a second purposeful-travel substrate gets built by accident"), DIRECTION 2 reds both when a `built:true` row does not reach `mintErrandSpine` AND when a `built:false` row does. Five rows already sit at `built:false` for unbuilt volumes (TR-8 factors, WF-2b legates, WF-2b pilgrims, IN-4 couriers, INT-3b ambitious), so the shape is established, not invented. ⚠⚠ **WC TAKES ITS OWN ROW AND NEVER SHARES ONE** — the registry's own ES-1 comment records that the shared `couriers … wave: 'ES-1/IN-4'` row had to be SPLIT because `built` is a single boolean and `module` a single address, so landing one program against a shared row "would have declared IN-4 built and pointed the registry at a file that does not exist". ⚠ TWO FURTHER LIVE PINS BIND WHATEVER WC-5 CHOOSES: the walker's class-TOTALITY arm asserts the set of claimed `purposeClass` values EQUALS `ENVOY_PURPOSE_CLASSES` with `toEqual` both ways, so a NEW class must arrive with a claiming consumer in the same commit; and `tests/domain/errandMint.test.js:51` asserts `Object.keys(PURPOSE_CLASS_BY_PURPOSE)` EQUALS `ENVOY_PURPOSES`, so a new call-in PURPOSE landing without its mapping row resolves to NO class rather than to a guess, and reds |

**⭐⭐ THE COUNT, DECLARED.** **TWENTY-THREE seam rows.** Applying `seams()` to
the table above returns **23** data rows, and this document contains exactly
ONE table carrying the four-cell header `# | Neighbour | The contract | The
tripwire`, so `table_by_header`'s first-match behavior is unambiguous.
**MEASURED, not hand-edited** — the number was re-derived by executing the
real parser against this file after row 23 landed, and the same run reproduces
EP at 10 and HB at 13 unchanged.

### 8.2 THE THREE CONTRACTS WITH NO EXPRESSIBLE TRIPWIRE — named, not invented

SECTION 4 carries **TWENTY-FIVE** coordination contracts (four numbered
subsections at §4.1.1-§4.1.4, plus twenty-one contract bullets; §4.1.1's two
remaining bullets are its STRUCTURAL and ARTIFACT *repairs*, not contracts).
**Twenty-two carry a contract-specific red** and are rowed above. **Three do
not**, and are recorded here rather than given manufactured tripwires — a row
without a real tripwire is decoration, and decoration in a seam table is worse
than an absence because it reads as coverage.

⚠ **THE 25 = 22 + 3 IDENTITY IS ABOUT SECTION 4 AND IS UNDISTURBED BY ROW 23.**
Row 23 is the ONE row in the table that is not a SECTION 4 contract; it was
added by chair ruling from §2.3, §7.E and §7.F. So the table's 23 rows are
22 SECTION 4 contracts plus one seam SECTION 4 omits. Do not "reconcile"
these two numbers — they count different things, and the row 23 cell says so
in its own first sentence.

The standard applied: **a tripwire must be a pin, fence, walker, mutant or
stated veto surface that WC names FOR THAT CONTRACT.** Volume-wide boilerplate
(§3's "EVERY WAVE CARRIES → LIT-MUTANT: every guard door pinned INDIVIDUALLY")
covers these three the way it covers everything, and therefore distinguishes
nothing.

- **§4.3 TAP PRODUCTS, NEVER TAP LEVELS** (L4699-4704). The contract is real
  and specific — `TAP_LEVELS` is closed at three; WC adds PRODUCTS
  (ally-reliability R9, army-composition intelligence (f), the WATCHED taint
  read (c)), each "a product row through ES's existing product registration,
  ranked by `TAP_DEPTH`, never by array index." **But WC names no pin for it.**
  The `TAP_DEPTH` lesson is cited as a lesson (L1142) and as an attachment note
  (L3311, "new PRODUCT, never a new tap level"); no walker, mutant or census is
  attached. ⭐ **The natural repair is inbound**: ES's own product-registration
  totality is the instrument that would red on an unregistered WC product, and
  a row asking ES to widen it is a one-line addition at the fold.
- **§4.3 KIND PREFIXES** (L4714-4716). "Every WC news/ledger kind is
  `wc_*`-prefixed; no `espionage_*` collision. Covert arms fail closed UPSTREAM
  (no covert fact reaches a public composer)." ⚠ **The two halves have
  different standing.** The covert half rides an existing discipline (ES §5
  row 7, L604-606) and the public-payload veil. **The PREFIX half has no named
  red anywhere in the volume**: §7.C asserts "Every beat is `wc_*`-prefixed"
  (L5933) as a property of the inventory, and §7.E's only kind-totality guard
  is `untag`'s (WC-15), which walks `RESIDENCY_TAGS` — a different set entirely.
- **§4.3 GATES** (L4717-4719). "Every ES-coupled WC read sits behind the
  existing `espionageActive` conjunction (`beliefsActive` first), fail-closed by
  name." ⚠⚠ **MEASURED: `espionageActive` appears EXACTLY ONCE in all 6,492
  lines — in this sentence.** No pin, no mutant, no walker, no wave PINS block
  mentions it. This is the thinnest of the three: the contract names a
  two-door conjunction, and the volume's own standing law says a conjunction
  over two doors is pinned PER DOOR, but no wave has been given that
  obligation for this gate.

**✅ ONE FURTHER STRUCTURAL ABSENCE — FLAGGED HERE, THEN RULED, AND NOW ROWED AS 23.**
SECTION 4 has **no SP-D subsection** — it contracts with HABIT, WAYFARE, ESPIONAGE, the
built WR surfaces, and traditions/demographics/interior, and SP-D appears nowhere in
L4552-4787. Yet §7.E's closing law names "SP-D call-ins" as one of four
pre-pinned seam rows (L6400), §7.F gates WC-5 on it ("call-in slice gated:
SP-D"), and §2.3 attaches the call-in CARRIAGE to "SP-D errand purpose classes
(`ENVOY_PURPOSES` closed at 2 today, `envoyErrandVocabulary.js:119`)".

**The transcription refused to write the row and flagged the absence instead**, because
writing one unasked would have been inventing a contract SECTION 4 does not contain —
precisely the thing a transcription may not do. **The chair ruled on the flag (below,
2026-08-07): the absence is a GAP IN SECTION 4, not an absence of the seam, and the count
is 23.** ⚠ The ruling is the licence for row 23 and is the ONLY reason the row is not a
violation of this document's own opening promise. It stays visible here, rather than
being tidied away, so a reader can see which row was authored under a ruling and which
twenty-two were transcribed. ⛔ **SECTION 4 still owes an SP-D subsection** — the row
discharges the SEAM MATRIX, not the volume's own section; a WC revision that adds the
subsection should point AT row 23 rather than restating it.

### 8.3 PROVENANCE — every row's source line, and which cells are reasoned

**All twenty-two SECTION 4 CONTRACT cells are TRANSCRIBED** — each is a
compression of its SECTION 4 paragraph, adding nothing. **Row 23 is the sole
exception and is marked as such in its own cells.** The TRIPWIRE cells divide:

| Rows | Tripwire provenance |
|---|---|
| 1, 2 | TRANSCRIBED — the two discovery signatures are authored verbatim in the volume at L3579-3618 and listed as separate §7.E guard rows at L6121-6122 |
| 3, 4, 6, 7, 9, 10, 13, 14, 15, 17, 18, 20, 21, 22 | TRANSCRIBED — each names a pin the volume already states in its §7.E inventory or its wave PINS block |
| 5, 8, 11 | TRANSCRIBED — the gate is stated structurally (§7.F's `[HARD GATE: WY-8a built]` edge for row 5; CR-WC-15's shrink-only census row for row 8; §7.E's closing pre-pinning law for row 11) rather than as a named mutant |
| 12, 16, 19 | TRANSCRIBED with a REASONED red mechanism — §2.4 states each as "a one-line veto surface"; the sentence "a WC diff touching it is the tripwire" is the house form (HB §8.1 row 8's `momentum.js`), not new architecture, but it is the transcriber's phrasing and is marked as such |
| ⭐ 23 | **NOT TRANSCRIBED FROM SECTION 4, AND NOT INVENTED EITHER — the contract half is transcribed from §2.3/§7.E/§7.F, and the TRIPWIRE half is MEASURED against live code at `eca65c8a` under a chair ruling.** This is the only row whose tripwire is not the pin WC names, and the reason is stated in the cell: WC's named pin is a pre-pin that reds "when SP-D lands", SP-D has landed, and a pin authored past its trigger cannot fire. The replacement is not new architecture — `ERRAND_CONSUMERS` and `tests/lint/errandConsumerRegistry.walker.test.js` are BUILT and already carry five `built:false` rows for unbuilt volumes, so WC-5 joins an existing mechanism at its existing shape |

⚠ **No row's tripwire is invented.** Where SECTION 4 gave none, the contract
is in §8.2, not in the table. **Row 23's tripwire is neither invented nor
transcribed but MEASURED**, and is the one row where a reader must check live
code rather than the volume to audit the cell.

### 8.4 STALE PREMISES WORTH RE-CHECKING AT THE FOLD

WC's round-3 re-measure was taken at `cbd348a5`; the build branch
(`claude/composite-r4`) is now **37 commits past it** at `52791876`. SECTION 4
is unusually line-address-dense, and hand-keyed line addresses rot silently.
**MEASURED at the current build HEAD, not assumed** — the news is mostly good:

**CONFIRMED STILL EXACT** (read at `52791876`; the address resolves to the
symbol WC names):

    settlementStrategy.js:634    function enumerateMoves({ sId, ctx, ... })
    settlementStrategy.js:1360   export { enumerateMoves };
    warHomeCosts.js:443/450      bankedBySource / leviedPopulationBySource
    warCosts.js:367              record.leviedPopulationBySource
    warCoalitionExpenditure:159  record.leviedPopulationBySource
    deploymentReturn.js:284      deployment?.leviedPopulationBySource
    deploymentReturn.js:270      const fell = deployedPopulation - survivors
    warCoalitionLedger.js:5      "No membership list and no stored ... total"
    occupation.js:117            STATE_LADDER = Object.freeze(['contested', ...
    occupation.js:386            export function stabilizationSuitability(
    occupation.js:442            export function advanceOccupationState(
    occupation.js:724            export function vassalizationOutcomes(
    sovereigntyAppraisal.js:105  'unknown','trifling','modest','substantial',...
    envoyNegotiationPictureBuilder.js:28   PRESSURE_BANDS, verified 4-rung

**CONFIRMED PREMISES STILL TRUE** (the three that would have invalidated whole
rows had they moved):

- **Row 1's C1 premise HOLDS.** `STRATEGY_MOVES`, `strategyMoveVocabulary` and
  `MOVE_VOCABULARY` return **ZERO hits across `src/` and `tests/`.** Neither
  volume has minted; "zero is the tree's legal state today" is still true and
  the AT-MOST-ONE fence is still the right pin rather than EXACTLY-ONE.
- **Row 5's premise HOLDS.** `supplyCargo` and `armySupplyEnabled` return
  **ZERO hits in `src/`.** F9 is still unbuilt; WC-10's hard gate still binds.
- **Row 8's premise HOLDS.** `kmScale` returns **ZERO hits in `src/`.**

**⚠ FIVE PREMISES WORTH RE-CHECKING AT THE FOLD**, with the reason each is
worth the minute:

1. **`stressorDynamics` "at ~759 eff" (row 22, L4783).** MEASURED now: the
   file is **998 raw lines.** The volume's figure is an EFFECTIVE-line count
   and raw lines are not comparable, so this is **not yet a refutation** — but
   row 22's whole force is that the file sits close enough to its ceiling to
   force a leaf extraction before any counterforce row. **That argument is a
   function of the current headroom**, and the headroom is what has moved. Re-read
   the ceiling ledger entry, not the raw count, before dispatching WC-12.
2. **§4.3's own header: "ES-0 landed, waves in flight" (L4697).** ES has
   advanced materially since `cbd348a5` — the memory estate records ES-1
   (covert mission) as landed in this window. Rows 12 and 13 and the whole of
   §8.2's ES trio are written against a moving neighbour, and §8.2's
   recommended inbound repair (ES widening its product-registration totality)
   should be checked against what ES has ALREADY landed rather than against
   the volume's snapshot of it.
3. ✅ **RESOLVED INTO ROW 23 — no longer a re-check, it is a discharge.**
   `errandSpineEnabled` is LIVE. **SP-D HAS LANDED.** When this item was
   written it said the pre-pin "may now be DISCHARGEABLE rather than pending,
   and a pre-pinned seam row whose counterpart has landed is exactly the pin
   that goes quietly vacuous if nobody consumes it." **The chair ruled it in
   and row 23 carries the discharge**, measured at `eca65c8a`: the gate is read
   once at `errandMint.js:76`; `ENVOY_PURPOSE_CLASSES` (six, `:130`),
   `PURPOSE_CLASS_BY_PURPOSE` (`:147`) and `ERRAND_CONSUMERS` (`:276`) all
   exist; and `ENVOY_PURPOSES` is STILL `['sue', 'self_parlay']` at
   `envoyErrandVocabulary.js:119`, so WC's own cited address has NOT rotted.
   ⚠ The one WC premise this REFUTES is §1.9.1's and WC-5's "`errandMint.js` is
   ABSENT at HEAD, verified" — true when written at `cbd348a5`, false now. It
   is recorded as refuted here rather than silently corrected in the volume.
4. **`commodityFlow.js:558` (§5.7's in-file proof of the reconstruction-loss
   class) and `subsystemRowsWar.js:199` (row 14's cert row).** Both addresses
   still land inside the right passage — `:558` is a comment about losing
   `smuggle:true` on reconstruction, `:199` a comment about the head-count
   landing at `deployments[id].leviedPopulationBySource` — but **both now point
   at COMMENTS rather than at the declarations the volume cites them as.** They
   have drifted within their file. Harmless today, exactly the shape that
   silently retargets later.
5. **`TAP_LEVELS` "closed at three" (§8.2's first entry, L4699).** CONFIRMED
   present at `espionageMath.js:96` as `export const TAP_LEVELS = ENVOY_COVERT_TAPS`
   — but the closure claim now rests on `ENVOY_COVERT_TAPS`, one indirection
   away, and `envoyErrandVocabulary.js:213` describes `TAP_LEVELS` as
   re-exposing a DTO-owned mint. **The arity is worth re-confirming at the
   source of truth rather than at the alias**, since row-less §8.2 entry one
   turns on it.

**⛔ THIS IS NOT A RE-MEASURE OF THE VOLUME.** Only SECTION 4's own premises
were checked, plus the three whose failure would have invalidated a row. The
volume's other measured claims — §1's model figures, §2.1's ceiling ledger,
§7.A's vocabularies — were NOT re-read and are NOT attested here.

---

END. **Seam count: TWENTY-THREE.** ⭐ **CONFIRMED BY EXECUTION, 2026-08-07** —
`seams()` from `HABIT_countsweep.py:327` applied to this file returns **23**,
in the same run that returns EP **10** and HB **13** unchanged; all 23 rows
carry exactly four cells. Header spelled `Neighbour`, matching HB and EP so
`seams()` resolves — **do not "fix" it to `Neighbor`, which returns
`LookupError` and reads as ABSENT rather than zero.** Three SECTION 4 contracts
carry no expressible tripwire and are named in §8.2 rather than rowed. The one
structural absence (SP-D) was flagged, RULED IN, and is row 23, which carries a
DISCHARGE obligation rather than a pre-pin because its counterpart has landed.

**⛔ THE PARENT'S §9 AMENDS BY +23**, and by the fold convention that a folded
volume contributes ONE physical row and +N logical seams, WC enters as a single
compressed range row.


---

# ⚖ CHAIR RULING — 2026-08-07. **THE COUNT IS 23, NOT 22.**

## ⏳ OPUS-ERA — FABLE SURVEY OWED. Ruled under Opus 5, not Fable 5. **VETOABLE.**

## RULING 1 — SECTION 4 OWES AN SP-D ROW. THE SEAM COUNT IS **23**.

The transcription correctly refused to invent a row SECTION 4 does not contain, and correctly
flagged the absence instead. That was the right act; this is the ruling it asked for.

**SECTION 4 has no SP-D subsection — but THREE other places in this volume treat SP-D as a
neighbour with a contract:** §7.E names "SP-D call-ins" as a pre-pinned seam row, §7.F gates
WC-5 on it, and §2.3 attaches the call-in carriage to SP-D's errand purpose classes.

**A seam is a contract with a neighbour plus a tripwire. SP-D has both.** The contract is that
call-in carriage rides SP-D's errand purpose classes; the tripwire is the pre-pinned seam row
§7.E already names. **The absence from SECTION 4 is a GAP IN THE SECTION, not an absence of
the seam** — and a seam matrix that omits a real coordination point is precisely the failure
it exists to prevent. Leaving it at 22 would make the parent's §9 under-count.

⚠⚠ **AND THE ROW MUST CARRY A DISCHARGE OBLIGATION, BECAUSE ITS COUNTERPART HAS LANDED.**
The transcription measured that `errandSpineEnabled` is now LIVE in at least five `src`
modules — **SP-D has landed.** So this is not a pending pre-pin; it is a DISCHARGEABLE one.
Its own warning is the reason the row matters more rather than less: *"a pre-pinned seam row
whose counterpart has landed goes quietly vacuous if nobody consumes it."* The row must state
that the counterpart exists and name what consumes it, or it will certify nothing while
looking green.

**ACTION: add the SP-D row, re-run `seams()`, and confirm it returns 23** before the fold
composes the parent's arithmetic. Do not hand-edit the count.

### ✅ RULING 1 DISCHARGED — 2026-08-07, the fold-prep slice. **CONFIRMED, EXECUTED.**

**The row is row 23 of §8.1.** The count was NOT hand-edited: `seams()` was re-derived by
importing `HABIT_countsweep.py`'s real parser and applying
`table_by_header(text, ["#", "Neighbour", "The contract", "The tripwire"])` to this file.

    WC_SEAM_TABLE.md   tables=2  matching-header-tables=1  seams()=23
    EPOCH_...round7-snapshot.md                            seams()=10
    HABIT_...round4-snapshot.md                            seams()=13

**23, with EP and HB unchanged in the same run**, one matching-header table only (so
`table_by_header`'s first-match is unambiguous), and all 23 rows carry exactly four cells —
the malformed-row shape that killed `coverage()` at round four is absent here.

⚠⚠ **AND THE DISCHARGE OBLIGATION IS SHARPER THAN "NAME A CONSUMER", BECAUSE THE PIN WC
NAMES CANNOT BE WRITTEN AT ALL.** §7.E specifies a pin "that reds when SP-D lands without
consuming it". **SP-D has landed.** Authored today, that pin is past its own trigger: green
forever, proving nothing — the exact vacuity the ruling warned of, arriving through the pin's
own wording rather than through neglect. Row 23 therefore REPLACES it rather than carrying
it, with a tripwire that is live right now: WC-5 takes its own `ERRAND_CONSUMERS` row at
`built:false`, and `tests/lint/errandConsumerRegistry.walker.test.js` measures it BOTH WAYS
against the tree every run — a minter with no row reds, a `built:true` row that does not mint
reds, and a `built:false` row that DOES mint reds. Five unbuilt volumes already sit in that
registry the same way, so this is joining an existing mechanism, not minting one.

## RULING 2 — THE THREE TRIPWIRE-LESS CONTRACTS ARE **OWED, NOT EXCLUDED**

The three §4.3 ESPIONAGE contracts stay out of the seam count — a row without a real tripwire
is decoration, and inventing one would have been the worse error. But they are recorded as
**OBLIGATIONS OWED**, not as contracts that do not exist:

⚠⚠ **The sharpest is `espionageActive`, which appears EXACTLY ONCE in all 6,492 lines — in
§4.3's own GATES sentence.** No pin, mutant, walker or wave PINS block mentions it. This
estate's standing law is that **a two-door conjunction is pinned PER DOOR**, and no wave has
been given that obligation for this gate. `TAP PRODUCTS` and the `wc_*`-prefix half of
`KIND PREFIXES` are likewise unpinned.

**RULED: these are WAVE obligations, not fold blockers.** Two of the three have a natural
inbound home — ES's own product-registration totality is the instrument that would red on an
unregistered WC product, so the repair belongs on the ES side rather than in WC. The gate
conjunction needs a per-door pin assigned to whichever WC wave first reads it. **Recorded so
they are discharged deliberately rather than re-found.**

## ⚠ THE HEADER SPELLING IS LOAD-BEARING, AND THE FAILURE MODE IS SILENT

`Neighbour`, matching EP and HB. **The folded ES and WY volumes spell it `Neighbor`, and
`table_by_header` compares header cells by EXACT EQUALITY** — so the American spelling returns
`LookupError` and the count reads as **ABSENT rather than zero**. A volume that spelled it the
other way would look like it had no seam table at all, which is exactly the state WC was in
before this transcription. Whoever splices this table must not "fix" the spelling.

## WHAT THIS UNBLOCKS

With E5 closed and the seam count derived, **the fold's chair-side blockers are cleared.**
⛔ It is NOT yet dispatched: the fold collides on `docs/FABLE_VALIDATION_QUEUE.md` and
`tests/domain/couplingRegistry.test.js`, both of which the running espionage lane touches, and
the recon's standing advice is to schedule the fold BETWEEN cycles, never across one.
**It dispatches at the next quiet slot**, with EP's rows composed LAST and the parent count
taken PRE-fold, per C3 of the E5 ruling.
