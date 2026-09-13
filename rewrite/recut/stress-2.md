# STRESS-2 — THE PROMISE HUNT against ADDENDUM 14 (and 15)

**Seat:** adversary of the new law. **Read whole:** ADDENDUM 14, 15, 12, 12-AMENDMENT, 13 PART A, 13 PART B.
**Engine read in the dock** `.../scratchpad/laneRW-DEF2` (read-only; no git write, no test run, no build).
**Every finding below names a field, a file and a line.** Labels: **CONFIRMED** = I executed the read and quote the code. **PLAUSIBLE** = reasoned from code I read but not exercised.

---

## 0. THE ONE-LINE VERDICT

The re-cut is right that the licence test produced receipt prose. It is wrong about *where the danger moved*. Under the licence test a face could only be **thin**; under non-contradiction a face can be **early** — true at tick 0 and false at tick N, with no instrument anywhere in the programme that looks at tick N. The four floors are stated as predicates over **the record**; the engine's record is not one thing. It is (a) fields frozen at generation forever, (b) fields the pulse rewrites every tick, (c) fields the *user* can reroll at will, and (d) a generation-time snapshot that the pulse's own ruin and demotion stamps can never reach. Floors 1 and 4 are drawn across (a)–(d) as if they were one surface. They are not, and the seams are where the promise breaks.

**And the premise that carries the whole re-cut does not hold in this build.** The owner's warrant is *"plot hooks and descriptions for the author to be immersed **and to change as they see fit**."* An author cannot change these sentences. `DM_EDITABLE_SETTLEMENT_PROSE_PATHS` reaches **eight** blocks in the whole estate (`src/domain/display/stateProse/dmFieldProjection.js:85-94` — DS-GEN-5, -6, -9, -11, DS-REL-2, DS-DEF-1, DS-DEF-3, DS-ECO-6), and the editor for even those rides `QUEUE_WIRED_PROSE_PATHS` — sixteen paths, in a panel its own header calls **"(R-2, flag-off)"** (`src/components/dossier/WorkbenchProseEditor.jsx:1-14`). The composed state-prose faces are **not stored on the settlement at all** — `stateProseKernel.js:11-12`: *"nothing here is persisted"* — so there is no path, edited or otherwise, by which an author revises one. **The re-cut licenses unauditable prose on the ground that the author will edit it, in a product where the author cannot edit it.** That is not an argument against the re-cut; it is a wiring row the re-cut assumes has landed and which has not. **CONFIRMED.**

---

## PART I — THE PROMISE HUNT

### P-0 (structural). The test is evaluated on ONE town at ONE tick; the face renders over a BAND × 768 towns × every tick, forever.

A face is not written against a town. It is written against a **pool key**, which is a predicate over states. `stateProseKernel.js:62` states the contract exactly: *"THE PROMISE holds: same seed + same state ⇒ same sentence, forever. Eligibility is a function of the state alone."* And the seed the product passes is **time-invariant** — `src/components/new/tabs/DefenseTab.jsx:93` `seed: String(r?._seed ?? r?.id ?? '')`. So the *wording* never varies with the world; only the *pool* re-keys.

Under the licence test this was safe by construction: a face stated the key's own reads, and the key's own reads are true of every state in the preimage. **Non-contradiction destroys that guarantee**, because *silence* is not a property of the band — it is a property of the **sample the marker put on the skeleton**. The refuter reads one town's record at tick 0, finds the record silent on sieges, and grants permission. The same silence is not silence on the other 767 towns of the manifest, and it is not silence at tick 300.

> **The quantifier the re-cut needs and does not have:** a face is lawful iff it contradicts **no state in the pool's preimage**, not "no field of the skeleton's sample". Everything in Part I is an instance of this one error.

**CONFIRMED** (kernel law text, the seed call site, and each instance below).

---

### P-1. `economicGates.military` is written ONCE, at generation, and NEVER AGAIN — so WALLED-STRAINED never stops firing.

`wallRationalePoolKey` (`src/domain/display/stateProse/defenseStateProse.js:1052-1069`) keys DS-DEF-11 on four inputs, and the first branch is:

```js
if (typeof militaryGate === 'number' && Number.isFinite(militaryGate) && militaryGate < 1) return 'WALLED-STRAINED';
```

The gate is `settlement.defenseProfile.economicGates.military`. I grepped every writer of `economicGates` in `src/`: **`src/generators/defenseGenerator.js:467` and `:647` are the only two, both at generation.** `src/domain/worldPulse/` reads it exactly once — `foodStockpile.js:398`, and only the `.disaster` member.

So: a town generated during a bad harvest carries `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` (`defenseGenerator.js:189`) below 1, and **carries it for the rest of the campaign**. The pulse can run fifty years, `treasury.js` / `upswingKernel.js` / `resourceDynamicsKernel.js` / `entrepotKernel.js` can triple the town's economy, and DS-DEF-11 still prints the shortfall.

Under the licence test that was a thin staleness: one sentence saying the upkeep gate reads short. **Under ADDENDUM 14 the writer is invited to *paint* it** — an unpaid muster, a purse that will not stretch, men who look at the pay-table. Every one of those is silence-licensed at tick 0 and every one of them is flatly denied by the Economy tab at tick N, on the same dossier.

**The engine itself shows this is a bug, not a design.** `foodStockpile.js:388-400` writes back exactly this class of staleness for the *disaster* gate, with the reason in the comment: *"the live re-grade must move it too or the 'Disasters & Famine' row stays frozen at the generation value while a siege eats the granary."* There is no equivalent writeback for `.military`. **CONFIRMED.**

---

### P-2. `config.monsterThreat` is frozen too — the country's quiet outlives the country.

The same key's second and third branches read `settlement.config.monsterThreat` through `measuredMonsterFamily` (`defenseStateProse.js:331-335`), producing `WALLED-QUIET` (`heartland`) or `WALLED-THREATENED`. Grepping `src/domain/worldPulse/` for `monsterThreat`: **two reads** (`stressorGates.js:438`, `:639`) and **zero writes**.

So the country's threat tier is a birth constant. ADDENDUM 13 A item 4 already ruled `settled` = the *low tier* and not "no live threat" — that ruling survives as a **CONTRADICTION** class. But the ruling bars only the *totality* ("nothing threatens {settlement}"). It does not bar the **mood**: a road nobody watches, a quiet that has not been tested, an ease about the gate. That mood is now licensed by silence and is a claim about a **country that the pulse moves** (`armyTransitKernel.js`, `conquestIntent.js`, `warDeployment.js`, `demographicsWar.js`) while the token that keys the pool does not. **CONFIRMED.**

---

### P-3. DS-DEF-11's key reads NO crisis — and the chair's own worked example fails on a real town, on the same tab.

ADDENDUM 14 floor 2 offers this as the model of a lawful hook:

> *"The gate stands open more often than not" is a hook.*

`wallRationalePoolKey` takes `(walls, monsterThreat, militaryGate, tier)`. It does not read the stress array, the occupation record, the siege record, the safety label, or the criminal capture state. Meanwhile **the same `DefenseTab` renders, from the same settlement**:

- **DS-DEF-8**, the Active Military Status banner, off `DEFENSE_STRESS_STATUS` — fifteen postures including `under_siege → 'ACTIVE SIEGE'`, `occupied → 'UNDER OCCUPATION'`, `insurgency → 'INSURGENCY ACTIVE'`, `plague_onset → 'QUARANTINE ACTIVE'` (`src/domain/display/defenseDisplay.js:25-41`).
- **DS-DEF-3**, the safety banner, which under a crisis is **rewritten into a compound label** — `src/generators/safetyProfile.js:100-105` builds `{ strain: 'Controlled', condition: 'Occupation Curfew' }` with the desc *"Movement is restricted and monitored. … curfew and checkpoint protocols."* The defense desk's own header names the three compound forms: `Controlled — Occupation Curfew`, `Tense — Active Siege`, `Desperate — Famine Conditions` (`defenseStateProse.js:78-84`).

A walled town with `monsterThreat: 'heartland'`, `economicGates.military === 1`, and an occupation stressor keys **WALLED-QUIET** and prints *"the gate stands open more often than not"* directly above a banner reading **UNDER OCCUPATION** and a safety label reading **Controlled — Occupation Curfew**. That is floor 1 — *"it may not say what another surface on the same screen denies"* — and **the chair's own exemplar breaches it**. It is not a marginal case: `safetyProfile.js:100` only fires the curfew form when the occupation is real, so the contradiction is exactly as common as occupation is.

The fault is not the sentence. It is that **floor 1 is stated over "the WHOLE town's record" while the marker builds the skeleton from the pool's card**, and the pool's card is four fields. A refuter given that skeleton *cannot* find this. **CONFIRMED.**

---

### P-4. The force cards and the `{defwork}` slot read DIFFERENT rosters, and the pulse moves one of them.

`defworkFill` (`defenseStateProse.js:1026-1035`) fills from `standingDefenseForces(settlement)`, which — per `src/domain/institutions/defenseInstitutionBuckets.js:41-52` — re-derives from `liveInstitutions(settlement)`, ruin-filtered. But the same header records, in terms:

> *"`generateDefenseProfile` has exactly ONE caller … so `defenseProfile.institutions` is a GENERATION-TIME SNAPSHOT that is never rebuilt. Every ruin path (calamityKernel, institutionLifecycle, tierOutcomeApply, settlementLifecycleFirstClass, magicRegimeLifecycle) stamps its row IMMUTABLY … The buckets therefore hold the PRE-RUIN objects by reference, and the ruin stamp can never reach them."*

and it says what still consumes the snapshot: *"the force cards on DefenseTab still list what the town built."*

So after a calamity the **force card** prints `City Walls and Gates` while `{defwork}` in the prose beneath it fills **`town walls`** — see P-5 for the mechanism. Under the licence test the face named the slot and stopped; under ADDENDUM 14 the writer may build the sentence's weight on the wall's scale, and the card beside it will be naming a different work. Floor 1, arriving at tick N, invisible at tick 0. **CONFIRMED** (by code reading; the drift itself is **PLAUSIBLE** — I did not run it).

---

### P-5. ⛔ **FLOOR 4 IS FALSE AS WRITTEN.** "Walls never decay" is a *generator* rule; the simulation demotes, ruins and razes them.

Floor 4 says: *"walls never decay, so a rotting palisade is a contradiction."* As a **birth** rule that is right — ADDENDUM 13 A item 3 sourced it correctly (no material decay clock; the only clock over built fabric is the calamity-scar half-life). But stated as **"the engine's own positive model"** it reads as *permanence*, and permanence is exactly what the simulation denies:

- `src/domain/worldPulse/calamityKernel.js:96-121`, `UPGRADE_CHAIN_PAIRS`, carries `['Palisade or earthworks', 'Town walls']` and `['Town walls', 'City walls and gates']`; `DEMOTES_TO` (`:128-151`) inverts them; and `:259-275` **applies the fate to the roster**, rewriting the row in place: `name: plan.demotedTo`, `id: 'institution.' + stablePart(...)`, `worldPulseFate: 'demoted_by_disaster'`, `demotedFrom: name`.
- `:251` is the harder fate: `{ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true }`.
- `razingExecution.js` and `settlementLifecycleFirstClass.js` are named by the buckets header as further ruin paths.

**So a town's walls go `City walls and gates` → `Town walls` → `Palisade or earthworks` → ruined, under a disaster.** A face that reaches — now lawfully, under silence — for the wall's permanence ("what the town raised outlasts the raising", "stone is the one thing here that will not be argued with") is contradicted by the engine's own kernel at tick N. Floor 4 as worded does not merely fail to bar this; **it invites it**, by telling the writer that permanence is the engine's model.

**Proposed correction, and it is a one-line change:** floor 4 should read *"no material DECAY CLOCK exists (no rot, no weathering, no erosion)"* — never *"walls never decay"* — and should add the positive counterpart: *"built fabric is demoted, ruined and razed by the calamity, razing and lifecycle kernels, so no face asserts the permanence of any institution row."* **CONFIRMED.**

---

### P-6. `history.age` is a NUMBER OF YEARS, persisted, printed, and frozen — the town never gets older.

`src/generators/historyGenerator.js:34-41` mints `getSettlementAge(tier)` from `AGE_BY_TIER` (`src/data/historyData.js:1111`), and `:883` persists it as `history.age`. The PDF reads it (`src/pdf/lib/viewModel.js:269`, `src/pdf/lib/headlines.js:182`); the Foundry journal reads it (`src/foundry/journalPages.js:302`). The user can set it by hand (`src/components/ConfigurationPanel.jsx:419-431`, `settlementAgeMode` / `settlementAgeYears`). **No writer under `src/domain/worldPulse/` touches it.**

Worse, the age is the **zero point of a dated timeline**: `historyGenerator.js:889-890` emits `eventsTimeline: timeline.map(e => ({ year: age - e.yearsAgo, … }))` — every historical event's absolute year is computed *from the frozen age*. So the town has a dated past whose origin never advances while the pulse's own `campaignEra` entries accumulate against a live calendar (`historyPreservation.js:14-20`). Two clocks, one timeline, and the seam is invisible on the page.

So the world advances and the town's recorded age does not. Any face whose atmosphere leans on the town's age — old, young, long-settled, still raw — is anchored to a number that (a) the user may have typed, and (b) will be wrong by exactly the campaign's length. `historyGenerator.js:848` even branches on it: `age <= 0 ? 'newly founded and still becoming itself' : 'stable and prosperous'`, so age **0** is a real generated state. **CONFIRMED.**

---

### P-7. History is REROLLABLE by the user, and no state-prose pool key reads it — so a historical allusion desyncs on a button press, not only on advance.

`src/domain/historyPreservation.js:1-30`: *"'Reroll history' replaces `settlement.history` wholesale."* The module exists to carry two things across that wipe — campaign-era events and authored prose — and explicitly *"Most of what that discards is generation output and SHOULD be discarded — that is the reroll."* The product exposes it: `src/store/operationRegistry.js:311` (`setLock`, *"A locked section refuses to reroll … A full regenerate also keeps the locked name, terrain and history"*).

No defense, economy or power pool key reads a history field. **So the composed face does not re-key when the history under it is replaced.** A face whose atmosphere gestures at the town's past — *even a past the record genuinely held at authoring time* — keeps printing over a history that now says something else.

This is the sharpest reason floor 2 cannot be drawn as *"cite only recorded history"*: the recorded history is **user-mutable state that the prose layer is not wired to observe**. **CONFIRMED.**

---

### P-8. The "first survey" framing pool is licensed by a MEASURED ABSENCE OF WRITERS — a warrant that decays.

`defenseStateProse.js:85-92`, on DS-DEF-3's framing pool:

> *"its basis is a measurement: `safetyLabel` has ZERO writers under `src/domain/worldPulse/`, so the reading is never re-judged once generated. The qualification is therefore always true of it."*

This is honest and it is exactly the shape of warrant ADDENDUM 14 multiplies. The desk's own header carries the lesson two screens earlier, about a different claim: *"⭐⭐ A BLOCKER IS A CLAIM, AND A CLAIM DECAYS … The blocker was true when written and false by the time anybody re-read it."* A silence-licence is a blocker of the same kind: **a fact about the code at a commit, spent as a permission that lives in a data leaf forever.** Nothing in the re-cut re-derives these. **CONFIRMED.**

---

### P-9. `tier` moves — and the UNWALLED pools are keyed on tier ALONE, so an explanation of a choice appears at the moment of a crossing.

`wallRationalePoolKey`'s fallback is `SMALL_TIERS.includes(size)` → `UNWALLED-SMALL`, else `TOWN_PLUS_TIERS` → `UNWALLED-LARGE`. Tier is written by the pulse: `src/domain/worldPulse/tierOutcomeApply.js:257, 279, 291, 358, 375` all assign `tier: toTier`, and `calamityKernel.js:441` computes `demotedTier = popToTier(afterDeaths - loss.exodus)`.

The block is literally titled *"Why the wall, and why not."* Under non-contradiction the UNWALLED-LARGE face may now supply a **reason** — nobody has thought it worth the stone, the town outgrew the argument, the money went elsewhere. On the tick a village crosses to town, that sentence appears **for the first time** and asserts a deliberation that never occurred, about a decision the engine never modelled. Nothing in the record contradicts it — which is precisely the problem: a reason is a fact about the past, arriving as a consequence of a population threshold. **CONFIRMED** (the key and the tier writers; the narrative consequence is the reading).

---

### P-10. ADDENDUM 15: conduct proportionate to `standing` is a DURATIVE claim rendered across a hysteresis band and across suppression.

ADDENDUM 15 licenses *"an ascendant creed's people set the calendar the town keeps"*, *"a cult's people have a door and no street"*. Both are habitual claims. In `src/domain/worldPulse/religionState.js`:

- `:151-154` — standing is computed with a **4-point hysteresis** (`STANDING_HYSTERESIS: 4`, `:53`), so a creed sitting at share 27 reads `ascendant` if it came down from ascendant and `established` if it came up. **The same share yields two different pools by path.** A face that grounds habitual conduct in standing is grounding it in a value that is partly a function of history, and the addendum's own floor-1 rule ("the two ranks are different facts") does not reach this.
- `:276` — `suppressDeity` writes `{ ...rec, suppressed: true, share: 0, standing: 'cult' }`. A creed that was ascendant last tick is a suppressed cult this tick, and the "cult's people have a door and no street" face now describes a congregation that was running the calendar a week ago. ADDENDUM 15 bars *"a creed acting where `suppressed` is set"* — good — but it licenses the cult face, and suppression **sets standing to cult**, so the bar and the licence collide on the same record unless the marker surfaces `suppressed` alongside `standing`.
- `:432-436` — suppressed entries are **pruned** after a dormancy window, so the evidence that a cult was once the patron is deleted from the state the prose reads.

And the temper trap ADDENDUM 15 itself names is real and sharper than stated: `deityTemper` (`src/domain/worldPulse/deityAxes.js:148-152`) honours `authoredTemper` and otherwise derives from `evil01`/`chaos01`. `authoredTemper` is a **custom-content authored field** — so a creed's licensed conduct changes when the *user edits the deity*, with no pulse tick at all. **CONFIRMED.**

---

### P-11. The two purses are frozen together, and R-viii′ is now the *only* thing standing between a licensed shortfall and a contradicted one.

`defenseGenerator.js:189` `milUpkeepMult = Math.min(1, 0.6 + (econOutput / 50) * 0.4)` and `:251` `internalUpkeepMult = Math.min(1, 0.65 + (econOutput / 50) * 0.35)` are ADDENDUM 12's two purses, both deterministic in the **same** birth `econOutput`. Neither is ever recomputed (P-1). R-viii′ correctly bars "the wall kept and the muster not". But R-viii′ was written under the licence test, where the face said little. Under ADDENDUM 14 a writer may render the shortfall's **texture** — and every texture of a shortfall is a claim about a purse the pulse refills (`worldPulse/treasury.js`) behind a gate that never re-reads it. R-viii′ needs a second clause: **the shortfall may be stated as a standing condition and never as a trajectory** (never worsening, never easing, never "still", never "yet"). **CONFIRMED** (the constants; the clause is a proposal).

---

### P-12. The refuter cannot see any of this, because the skeleton is built from the card.

ADDENDUM 14 requires a refuter to *"name the field, the row, the label or the model rule the face contradicts."* Every finding P-1…P-11 is nameable — but only by someone holding **the whole town's field set and the frozen/live partition of it**. The marker builds the skeleton from the pool's licence card (ADDENDUM 7's MARK phase). A refuter working from that skeleton has four fields for DS-DEF-11 and cannot reach `DEFENSE_STRESS_STATUS`, `safetyProfile.safetyLabel`, `calamityKernel`'s demotion lattice or the writer census.

**The re-cut moves the burden from "is it licensed?" (answerable from the card) to "does it contradict?" (answerable only from the whole record and its clocks), and does not move the instrument.** That is the single operational gap. **CONFIRMED** against ADDENDUM 7's MARK phase text and ADDENDUM 14's refuter duty.

---

## PART II — IS FLOOR 2 DRAWABLE?

**Answer: not as worded.** "No invented history, no invented numbers" fails in three separate ways, and each failure is demonstrable on this engine.

### Failure 1 — the engine HAS history and numbers, so "invented" is doing all the work and is undefined.

The town carries `history.age` in years (P-6), `historicalEvents[]` each with a `yearsAgo` (`historyGenerator.js:573-582`), a founding paragraph, and after a pulse, `campaignEra: true` entries with stable ids (`historyPreservation.js:14-20`). It carries `foodSecurity.storageMonths`, `share` 0..100, `legitimacy` 0..1, `tenure`, `standingHeld`, `inst.foundedAt = { year, tick }`. A writer can truthfully say *"the town is ninety years old"* and be citing the record. Floor 2 does not say that is barred — and it must, for the reason in P-6/P-7: the number is frozen, user-settable and rerollable.

> **So the real rule is not "don't invent". It is "don't SPEAK a magnitude", including a recorded one, unless the read hands you the engine's own band word for it.**

### Failure 2 — the hard cases are not digits. They are grammar.

These are the constructions where atmosphere and fact are genuinely inseparable, with what each one actually asserts:

| # | The phrase-shape | What it quantifies | The engine field it collides with |
|---|---|---|---|
| F-1 | **Frequency** — "more often than not", "most nights", "rarely", "seldom closed" | a **rate** | nothing bands a rate anywhere in the engine; and `safetyProfile.js:103` puts a curfew on the same tab (P-3) |
| F-2 | **Duration / persistence** — "still", "as ever", "long since", "no longer", "these days", "to this day" | an **elapsed time** | `ageBands.js` — and see the pin below |
| F-3 | **Habitual aspect** — "the gate stands open", "the watch drinks at the third bell", "they keep to the hour" | a **repeated past** | same as F-2: a habit is a duration claim in disguise |
| F-4 | **Count words** — "a handful", "a few", "no more than a dozen", "the men on the wall" | a **cardinality** | `standingDefenseForces(...).count` and `src/domain/display/forceComposition.js` both compute one |
| F-5 | **Comparatives against a past** — "thinner than it was", "busier than the year before", "what is left of" | a **delta over time** | the pulse computes deltas; the birth record has none |
| F-6 | **Age of fabric** — "the old wall", "new-cut timber", "weathered" | an **age** | `institutionFounding.js` — see below; plus floor 4 / P-5 |
| F-7 | **Ordinal / sequence** — "the second time", "again", "not for the first time" | a **count of events** | `historicalEvents[]`, rerollable (P-7) |
| F-8 | **Causal-historical** — "since the tolls went up", "after the bad year", "ever since" | a **dated cause** | the cause lifecycle stamps origin ticks; the birth state stamps none |
| F-9 | **Modal-future** — "will hold", "would not last a season", "the first hard winter will settle it" | a **prediction the pulse will adjudicate** | `calamityKernel`, `foodStockpile`, `warCosts` — the pulse *answers* these |

**None of F-1…F-9 contains a digit.** Every one of them is licensed by ADDENDUM 14 as written, and the chair's own exemplar is F-1 + F-3 together.

### Failure 3 — the engine already ruled on this, twice, and floor 2 does not cite either ruling.

This is the strongest material available for a re-draft, and it is the engine's own:

**(a) `src/domain/ageBands.js` — the constitution's age-band pin.**

```
AGE_BANDS = [this-week ≤1wk, this-month ≤4wk, this-season ≤13wk, this-year ≤52wk, years-past >52wk]
HISTORICIZE_BAND = 'years-past'   // "The ONLY band whose register permits historicizing
                                  //  'the lean years' language — the constitution's PIN."
```
and the module note: *"PIN (the constitution's age-band rule): historicizing language ('the lean years') is impossible below the YEARS threshold … a freshly-resolved cause reads fresh ('the pay came through just last month' = `this-month`). The lifecycle + W2 both gate their register on this."*

**The engine already forbids F-2/F-3/F-8 for any subject that carries no elapsed count.** A birth-time state — a wall's presence, an upkeep gate, a safety label — carries **no origin stamp at all**, so no register is derivable for it, and a durative register is not "unlicensed" but *ungrounded in the engine's own instrument*. This is floor 4 material, not floor 2, and it is enforceable by field name.

**(b) `src/domain/institutionFounding.js` — the worked precedent for exactly floor 2's question.**

> *"ABSENCE IS THE TYPED VALUE. Nothing is written at generation, ever, so a founding-era institution carries no stamp and reads `PRE_SEED` — it has stood since the founding. That is the cathedral case in its honest form: the year-18 leaf's pulse-founded institutions carry years, and the founding-era cathedral carries the typed bucket rather than an invented date."*
> *"The closed vocabulary (FINITE-SEMANTICS: typed buckets, no free numbers)"* — `FOUNDED` / `FOUNDED_UNDATED` / `PRE_SEED`, and *"No arm ever invents a year."*

And the same discipline again in `src/domain/worldPulse/treatyLifecycleVoice.js:126-128`: `treatyAgeBandWord` — *"The band WORD for a whole-year count (**never a digit**)."*

**The engine's settled answer to "how do you speak a magnitude?" is: through the closed band vocabulary the read hands you, and if the read hands you none, you say nothing about that magnitude.** Floor 2 should be that sentence.

---

## PART III — THE SHARPEST WORDING I CAN GIVE FLOOR 2

Floor 2's current text conflates three different rules and states the weakest of them. I propose it be split, with the second and third clauses newly explicit:

> **FLOOR 2 — THE MAGNITUDE AND TENSE FLOOR (the PROMISE, constitutional).**
>
> **2a. THE BAND RULE (magnitude).** A face may speak a magnitude — a count, a share, a size, a distance, a duration, a frequency, a proportion, an age — **only in the band word the read itself hands it**, and the engine's band vocabularies are closed (`shareBandLabel`, `scoreBand`, `AGE_BANDS`, `treatyAgeBandWord`, `bandedStock`, `INSTITUTION_FOUNDING_KINDS`, `SMALL_TIERS`/`TOWN_PLUS_TIERS`). **A magnitude the read does not carry is not spoken at all — not as a digit, and not as a word.** "A handful", "most nights", "a dozen", "more often than not", "for years" are magnitudes; refusing digits while licensing these refuses nothing. *The record's silence about a magnitude is not permission to supply one: it is the absence of the instrument that would make one sayable.*
>
> **2b. THE TENSE RULE (history, and the reason it is constitutional).** The dossier describes a **starting world**. A face may use the **present state** and no other tense: no past, no habitual or iterative present ("stands open more often than not", "they keep to the hour"), no perfect or durative ("has stood", "still", "no longer", "as ever", "since"), no comparative against an earlier state ("thinner than it was"), no ordinal over events ("again", "the second time"), and **no prediction the pulse will adjudicate** ("will hold", "would not last a winter"). The engine's own pin is the authority: `ageBands.js` refuses historicizing language below `years-past`, and a birth-time **state** carries no elapsed stamp at all, so it can bear no temporal register whatever. **Where the record *does* hand a dated or elapsed reading — `inst.foundedAt`, a cause's origin tick, a treaty's age — the face speaks it in that reading's own kind or band word (`PRE_SEED`, `FOUNDED_UNDATED`, `years-past`) and never as a year, a season or a count of them.**
>
> **2c. THE MUTABILITY RULE (and this is the clause the current floor is missing entirely).** A face may not depend on any field the composed-prose layer is **not wired to observe**. `settlement.history` is replaced wholesale by a user reroll (`historyPreservation.js:1-30`, `operationRegistry.js:311`) and **no state-prose pool key reads a history field**, so a face that alludes to the town's past desyncs on a button press even when the allusion was true of the record it was written against. Atmosphere is free **in the present tense, over fields the key reads**; it is never free over a field the key cannot see.

**Why this is drawable where "no invented history/numbers" is not.** 2a and 2b are decidable **by inspecting the face's grammar alone** — a refuter needs no world model to see a frequency adverb, a perfect tense, or a count word — and they are anchored to named engine instruments rather than to taste. 2c is decidable from the pool key's own read list, which the census already prints. None of the three requires the refuter to hold the whole record, which is the capability P-12 shows the programme does not have.

**What it costs the re-cut, honestly.** 2b bans the chair's exemplar. It also bans a great deal of what makes a place feel inhabited, because inhabitation *is* habituality — "the gate stands open" is vivid precisely because it is iterative. The re-cut's diagnosis was right that the old test made twelve renderings of one fact impossible; 2b narrows the recovered ground. **The honest trade is: buy the vividness back in the PRESENT and the PARTICULAR** — the sensory, the spatial, the momentary, the unnamed person doing one thing now (floor 3 now permits exactly this) — rather than in the habitual and the historical, which is where the promise actually lives. *"A gate open, and nobody at it"* is present, particular, vivid, and survives every tick and every reroll. *"A gate that stands open more often than not"* is the same image with a rate welded to it, and the rate is the part the engine will contradict.

---

## PART IV — WHAT I COULD NOT BREAK (stated so the chair can weigh the rest)

- **The draw is not persisted and re-keys live.** `stateProseKernel.js:11-12` and `DefenseTab.jsx:93-95` — the prose is recomputed from the current settlement on every render. Where a pool key *does* read a live field (`standingDefenseForces` is live and ruin-filtered; `tier` is live), the sentence genuinely follows the world. The failures in Part I are all failures of *which* fields the keys read, not of the architecture.
- **Anchored liveness (kernel law 1) is sound.** A slot with no fill drops the variant; `defworkFill` refuses a non-wall-class name rather than lowercasing a proper noun (`defenseStateProse.js:991-1000`). Nothing in ADDENDUM 14 weakens this.
- **Floor 3's relaxation is the safest part of the re-cut.** An unnamed person acting *now* carries no magnitude and no tense — it is exactly the shape 2b would preserve. `W22`'s strike is right.
- **The label traps really are contradictions** and survive re-pointing intact, as the chair pre-read. `priorityHelpers.js:53` — `hasGates` matches `'palisade'`, so a palisade town's `hasGates` is true; a face denying gates there contradicts the flag, and a face *naming* a gate is licensed by it. The pre-read on W14 holds.
- **ADDENDUM 15's core split is correct and the record does support it.** The four axes, the derived temper and the standing/rank distinction are all real fields, exactly as the addendum states them. My P-10 is about hysteresis, suppression and pruning — the *dynamics* of those fields — not about the licence.

---

## THE FIVE ROWS I WOULD PUT TO THE CHAIR

1. **Correct floor 4** (P-5): *no decay clock*, not *walls never decay*; add the demotion/ruin/razing counterpart. As written, floor 4 licenses an assertion of permanence the calamity kernel denies at `calamityKernel.js:259-275`.
2. **Adopt floor 2 as 2a/2b/2c** (Part III), anchored to `ageBands.js`'s `HISTORICIZE_BAND` and `institutionFounding.js`'s closed-kind precedent.
3. **Give the marker a FROZEN/LIVE column.** Every read on every skeleton is tagged with whether any writer under `src/domain/worldPulse/` moves it. It is a grep, it is mechanical, and it is the only thing that lets a refuter see P-1, P-2, P-6 and P-8. Without it floor 1's "the WHOLE town's record" is unenforceable.
4. **Give the marker the SAME-PAGE set.** For each pool, the other blocks mounted on the same tab (`dossierMounts.js` already holds the mount registry) plus the banners that render there — `DEFENSE_STRESS_STATUS` and the compound `safetyLabel` for the defense tab. P-3 is otherwise undetectable.
5. **Record the editability gap** (§0). Either the wiring row that makes composed faces author-editable is chartered, or the re-cut's warrant is written down as *not yet true* — because *"the author changes it as they see fit"* is currently false for every block except the eight at `dmFieldProjection.js:85-94`, and those only through a flag-off panel.

---
*Adversarial pass, stress-2. Written against the dock at `laneRW-DEF2`; no git write, no test run, no build. Every file:line above was read in this session.*
