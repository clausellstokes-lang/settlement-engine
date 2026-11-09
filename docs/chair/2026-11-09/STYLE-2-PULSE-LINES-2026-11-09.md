# STYLE-2-PULSE-LINES (SW-12) — the world pulse's lit lines cured under the owner's style law (2026-11-09)

**Seat:** SW-12 PULSE-LINES, an Opus 5.5 build seat, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`), in session `session_01FbPLbebSnQz5gSdc8bP7NB`. **Ruling:** STYLE-RULINGS-2 Part C, C2 (the LIT lines), on the chair's lane `lane/chair-2026-11-08`; the common discipline of BRIEF-STYLE-2-WAVE §0; the worklist STYLE-AUDIT-2-PULSE (`lane/style-2-pulse-r2-2026-11-09`), ledgers A2, B and D. **Base:** `lane/style-2-pulse-lines-2026-11-09` cut at `2053a809c` (verified with `git rev-parse`), as a separate git worktree — the in-place `git checkout -b` in the shared checkout was refused by the session's classifier, so the shared tree was never touched. Every line below is a PROPOSAL for the owner's veto; nothing here is signed.

## 0. The measure, reproduced first

The audit's §0 measure, re-run on this base before any edit: a scratch copy of `scripts/audit/simulate-world.mjs` (imports made absolute, one line to dump `wizardNews.entries` at each world's end; nothing in the repo touched), `WAR_ECON_ALL=1`, `--ticks 52 --reps 2 --scales 0`, two 14-town worlds, `HEALTH: OK (no flags)`; every entry rendered through exactly what `WizardNewsPanel.jsx :: NewsEntry` prints (`entry.headline`, `newsBody.js :: newsBodyText`, `newsVoice.js :: newsVoiceLine`, `newsReasonPhrases(…).slice(0, 3)`, `newsReaderSummary`). **4,496 entries, 24,209 printed lines — the audit's figures exactly.** Every count below is "cards whose printed face or tooltip carries the frame", base → this lane's tip, on the same harness. After the five causes the run still yields 4,496 entries with **identical entry ids in identical order** (no rng draw moved: every variant pick is `proseSelection.js :: pickLine` on a stable id), and 24,031 printed lines (the struck reasons).

## 1. The causes (one commit per writer file, in print order)

Excluded by the chair's measure against the train's cars and left untouched: `causeVocabulary.js`, `espionage/espionageGauntlet.js`, `npcAgency.js` (§4). A2·P1 (the proxy line) is SW-11's by the C2 fold.

### 1a. `src/domain/worldPulse/tradeWar.js` — 3ef335ef7 (A2·44–53, 9 rows)

| row | OLD | NEW | frame before → after |
|---|---|---|---|
| A2·44 realign summary | `${winner} has displaced ${defeated} as ${buyer}'s primary source of ${commodity}.` | four vantages: "${buyer}'s ${good} now comes from ${winner}; ${defeated} has lost the trade." · "${buyer}'s buyers have stopped dealing with ${defeated} and buy their ${good} from ${winner}." · "${buyer} has given its ${good} trade to ${winner}, and ${defeated} has lost a market." · "The ${good} on sale in ${buyer} now comes from ${winner}, not ${defeated}." (no defeated → "its old supplier") | "primary source of" 61 → 0 |
| A2·45 realign reason | `Primary ${commodity} supplier flipped to ${winner}.` | "${defeated} could not keep the trade against ${winner}." (no defeated → "${winner} has won the trade.") | "supplier flipped to" 61 → 0 |
| A2·46 conscience embargo | `Trade with ${defeated} curtailed: the plane objects to the ${worst}.` | "${buyer} will no longer buy from ${defeated} while it keeps a ${worst}." | "the plane objects" 44 → 0 |
| A2·47 war_pressure headline | `${defeated} answers lost trade with the sword` | "${defeated} turns hostile to ${winner} over the ${good} trade" | 13 → 0 |
| A2·48 war_pressure summary | `Defeated in the contest for ${buyer}'s ${commodity} trade, ${defeated} opens hostilities against ${winner}.` | "${defeated} has lost ${buyer}'s ${good} trade to ${winner} and means to take it back by force." | "opens hostilities against" 13 → 0 |
| A2·49 war_pressure reason | `The beaten incumbent was still strong enough to answer with arms rather than accounts.` | "${defeated} is still strong enough to fight for the trade." | "rather than accounts" 13 → 0 |
| A2·51 market_shock headline | `${defeated} absorbs the loss of ${buyer}'s market` | four: "${defeated} loses its ${good} trade with ${buyer}" · "${buyer} stops buying ${defeated}'s ${good}" · "${defeated} loses ${buyer}'s ${good} trade to ${winner}" · "${buyer} takes its ${good} trade away from ${defeated}" | 48 → 0 |
| A2·52 market_shock summary | `${defeated} loses ${buyer}'s ${commodity} market and adjusts. This is a sober economic wind-down, not war.` | four: "${defeated}'s ${good} no longer sells in ${buyer}; ${winner} has the trade now." · "${defeated}'s rulers have let ${buyer}'s ${good} market go without a fight." · "In ${defeated} the ${good} sellers have lost ${buyer}'s custom to ${winner}." · "${Good} from ${defeated} is no longer on sale in ${buyer}; ${winner}'s has taken its place." | "sober economic wind-down" 48 → 0 |
| A2·53 market_shock reason | `The beaten incumbent lacked the strength to answer with arms, so it answered with accounts.` | by the gate's own branch: "${defeated} is not strong enough to fight for the trade." / "${defeated} could fight for the trade, and has chosen not to." | "answered with accounts" 48 → 0 |

Struck under the census law: "cheaper or surer" (the contest compares supply × strength × standing, not price), "carts" / "wagons" / "stand idle in the yards" (no transport is read), "less work this season" (not read), "goes to war" (the war opener still judges the march next tick). The goods slot is lower-cased inside sentences; the PASS headline "${buyer} turns to ${winner} for ${Good}" is untouched.

### 1b. `src/domain/worldPulse/causeLifecycle.js` — 0ad288756 (A2·27–40, 10 rows)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·27 exposure summary | `${name}'s compromise (rooted in ${cause}) has become public. The quiet arrangement is now a scandal.` | four: "Everyone in ${town} now knows that ${name} has been corrupt, and why: it began with ${cause}." · "${name}'s secret dealings are out, and ${town}'s rulers must answer for them; it began with ${cause}." · "In ${town}'s taverns the talk is of ${name}, found out at last; it began with ${cause}." · "${name} is known to be corrupt now and can no longer work in secret; it began with ${cause}." | 139 → 0 |
| A2·28 exposure reason | `The compromise crossed covert → revealed; the public arc supersedes the quiet lifecycle.` | "Now that it is known, the matter is out of ${name}'s hands." | 139 → 0 |
| A2·33 re-cause headline | `${name}'s need becomes appetite` | "${name} finds a new reason to stay corrupt" | 6 → 0 |
| A2·34 re-cause summary | `${old} eased, but ${name} has quietly found a new reason: ${new}. The habit outlives its first cause.` | "${name} first turned corrupt because of ${old}; that has passed, and now it is ${new} that keeps them at it." | 6 → 0 |
| A2·35 re-cause reason | `${old} resolved; re-caused to ${new}: the character reached for it.` | struck (the summary carries both causes) | 6 → 0 |
| A2·36 reform summary | `${cause} has eased, and ${name}, who turned to graft only to get through it, has given it up.` | "${name} turned to graft only to get through ${cause}; that is over, and so is the graft." | 2 → 0 |
| A2·37 reform reason | `${cause} resolved; the sole-support corruption ended (reform).` | struck | 2 → 0 |
| A2·38 historicize headline | `${name}'s habit outlives its reason` | "${name} stays corrupt, though the need is gone" | 4 → 0 |
| A2·39 historicize summary | `${cause} eased, yet ${name} carries the compromise forward out of habit. Its origin is now past-tense.` · (years-past) `… but ${name}'s habit endures. The ledger never closed.` | "${name} first turned corrupt because of ${cause}; that has passed, and they are corrupt still." · (years-past) "It was ${cause} that first turned ${name}, back in the lean years; that is long past, and they are corrupt still." | 4 → 0 |
| A2·40 historicize reason | `${cause} resolved; the compromise persists with a historicized origin.` | struck | 4 → 0 |

Struck: "council" (no office held), "took money on the side" / "money" (the family is not keyed), "whoever paid for it" (a compromise need not have a payer); "he/his" never written (they/them). A2·34/36/39's lower-case-lead DEFECT (FIX-PULSE-DEFECTS' C3 rows) is gone with these lines — messaged to the chair as a STOP; RULED (the chair, 05:4x): one writer per line, this lane carries the rewrite AND the red-first pin, FIX-PULSE-DEFECTS skips the three lines. The pin: `tests/domain/causeResolutionLifecycle.test.js :: the three covert paths' news lead with the person's name, never a lower-cased cause label` — red at `2053a809c` ("reformed: funds run short has eased, and cap, who turned to graft…"), green at the tip. The re-adjudicate receipts (dark, pinned verbatim by existing tests) are untouched.

### 1c. `src/domain/worldPulse/stressorsCore.js` — 1e05cafba (A2·55–57)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·55 residual headline | `${label} leaves aftereffects` | four: "${label} is over, but not forgotten" · "${label} has passed; ${effect1} remains" · "${label} has ended, leaving ${effect1}" · "${label} is done, and ${effect1} is what it left" | 74 → 0 |
| A2·56 residual summary | `${label} is no longer the active crisis, but its consequences remain visible.` | four: "${label} is over, but people still live with ${effects}." · "${label} has ended; the rulers are left with ${effects} to mend." · "A visitor can still see what ${label} left behind: ${effects}." · "${label} has run its course; what remains is ${effects}." | 74 → 0 |
| A2·57 residual reason | `A time-bounded stressor resolved.` | struck; and the pill `Residual effects remain: …` struck too (the new summary names the effects — one block, one fact) | 74 → 0 |

Struck: "keep the watch busy" (no watch read); no place is named (only the target id is held here).

### 1d. `src/domain/worldPulse/stressors.js` — cb6c77832 (A2·59–72)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·59 recovery receipt | `Recovery led by ${source} (${value}), …` | "${Sources} did most to end it." (values stay on `leadingSources`) | 37 → 0 |
| A2·60 (despite) | `It ended despite the drag of ${companions}.` | "It ended even while ${companions} went on." | 0 → 0 (dark in the run) |
| A2·63 birth summary | `${label} is beginning to take root in ${place}.` | by TYPE: betrayal "In ${place}, people have begun to watch what they say, and to whom." · criminal corridor "Goods are moving through ${place} that no one admits to buying." · religious conversion fracture "In ${place}, neighbours who once prayed together now pray apart." · rebellion "In ${place}, the people have stopped waiting for the rulers to listen." · else "${label} has begun in ${place}." | 7 → 0 |
| A2·64 birth reason | `${label} has found enough ${pressure} to take root.` | struck | 7 → 0 |
| A2·65 pressure fallback | `The settlement's present condition makes ${x} plain to see.` · `… gives ${x} room to grow.` | "Nothing in ${place}'s present state stands in its way." (deduplicated) | 3 → 0 (new frame 3) |
| A2·71 escalation summary | `${label} has not broken, and the forces feeding it are still gathering.` | "${label} is getting worse in ${place}, and what started it is still there." (the place read from the snapshot's own row — a read added) | 16 → 0 |
| A2·72 escalation reasons | `${label} still grips the settlement.` · `The same forces that birthed the crisis continue to rise.` | the strongest pressure's own evidence sentences (`PRESSURE_REASON_SENTENCES`), else "The pressure behind it has not let up." | 16 / 16 → 0 / 0 (new 6) |

### 1e. `src/domain/worldPulse/mobilization.js` — 29e9f4737 (A2·91–92)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·91 ramp reason | `ramping toward war (the levy is better drilled than / still short of the peacetime standard)` | quick (readiness ≥ 1), four: "Its people are making ready for war, and quickly." · "The preparations for war are moving quickly." · "The call to arms is being answered fast." · "It is readying for war faster than most could." — slow, four: "…, but slowly." · "… moving slowly." · "… answered, but slowly." · "It is readying for war, though without much haste." | 137 → 0 (new frames 31 / 33 / 33 / 37; slow 3) |
| A2·92 cool reasons | `economic strain: the treasury cannot sustain a war economy` · `low legitimacy: the home front will not hold a war footing` · `food shortage: a mobilized army cannot be fed` · `the threat eased, so winding the war footing down` | "The treasury cannot pay for a war." · "The people will not stand behind a war." · "There is not food enough to feed an army in the field." · "The danger has passed, and the war footing is eased." | 3 / 14 / 10 / 4 → 0 |

Struck: "drills daily", "sharper" (no drill read; the multiplier blends will, money and backing), "the levy is sent home / stood down" (a cool steps one rung). The ramp line was first written as a single sentence and measured at 137 — exactly the old frame's rate, the refusal line's failure — so it carries four lines per branch.

## 2. Pins, registers and golden surfaces

- **Golden surfaces (herald, gm /525, fence /360, prose /1,050, witness, pdf): none moved.** `tests/property` (95 files, which hold the herald-desk golden and the generator golden master) ran green after the first cause except `editCorpusRatchet` A8, red at `2053a809c` too.
- **Pins re-keyed by identity, never loosened** (each in its cause's commit): `tests/domain/modeSpeedsWy1.test.js :: BASE_PULSE_HASH` 5b6a1e51 → b716843d (stressorsCore) → a55e7cd3 (stressors), TEXT ONLY — leaf-diffed in clean worktrees at each parent (70 + 56, then 110 + 35 string leaves / array-tail keys; no id, tick or number moved); tradeWar, causeLifecycle and mobilization leave the arm byte-identical (measured). `legitimacyUpheaval` (the escalation summary frame), `stressorOrigins` (the fallback, now "Nothing in Ashford's…"), `stressorResolutionReceipts` (the receipt in words, plus a no-digit arm).
- **The roster:** `tests/lint/.source-citation-baseline.json` `dated` 168 → 169 with `_rosterGrowth2026-11-09-style-2-pulse-lines`, and the walker's header line, for this record.
- **Reds named by cause, not this lane's** (red at `2053a809c` in a clean worktree): `editCorpusRatchet` A8 (4 tests), `densityLaw` (4), `tsc --noEmit` 15 errors in `warTermination.js`, `check-domain-strict` 8 files over baseline. The full-suite base/tip comparison is in §5.
- **One red caught and cured before the push:** `proseNumerics` read a nested template in `readerPressureReasons` as a float interpolation; the expression was simplified (same text) and folded into the stressors cause.

## 3. The retired word, left in place for SW-8 (listed, not edited)

`stressorsCore.js :: STRESSOR_CATALOG` residual tokens `faction_blame` (political_fracture) and `faction_purges` (succession_void), which now print inside the residual summary ("… faction blame …"); the catalog's `faction_stability` system keys (identifiers, never printed). `stressorGates.js`'s "Factions with the power to move: …" (seen in the WY-1 arm's gate notes; not this lane's file).

## 4. What stays (the remainder, BY FILE)

**A2 lit REWRITE rows not reached** (lit count in brackets), for a second seat in print order: `settlementStrategy.js` A2·2 (78), ·3 (78), ·24 (4), ·23 (1) · `tierResourceDynamics.js` A2·95–97 (37 each), ·104–105 (9), ·99–100 (2) · `populationDynamics.js` A2·107–110 (32 each) · `factionCompetition.js` A2·160–161 (23), ·163 (13), ·162 (8), ·165 (2) · `occupation.js` A2·113–114 (15), ·117–118 (12), ·125–126 (5), ·119 (3) · `warDeployment.js` A2·128–130 (16), ·136 (6), ·133 (3), ·135 (3) · `realmEvents.js` A2·157 (14), ·152–154 (12), ·156 (7) · `candidateEvents.js` A2·75 (52) · `pressureModel.js` A2·74 (26) · `warRecordMode.js` A2·146 (13) · `mobilizationReactions.js` A2·149–150 (4) · `stressorGates.js` A2·80 (3), ·83–84 (2) · `feasibilityGate.js` A2·137 (6) · `deploymentReturn.js` A2·139–140 (2) · `institutionLifecycle.js` A2·173–175 (1) · `resourceTaxonomy.js` A2·101 (2) · `moralInstitutionPressure.js` A2·179–180 (1) · `relationshipHierarchy.js` A2·184 (1) · `flows.js` A2·183 (1). Also the birth summary's intro pool (A2·63) sits at 1 of 4 vantages per type.

**The excluded files (car 3's; a follow-up after the train):** `npcAgency.js` A2·169–171 (206 cards each: "civic role favors reform.", "Pressure sat well clear of the gate…", "corrupted corrupted") AND ledger B's eight lit rows B·1–4, B·7–10 (`NPC_GOAL_NEWS`, the npc-goal culmination and rebranch pools, 4 + 1 cards — the only receipt pool the run lit; written by `npcAgency.js`); `causeVocabulary.js` A2's one row (dark-printing cause labels such as "funds run short", which the lifecycle lines above slot verbatim); `espionage/espionageGauntlet.js` (no lit A2 row).

**Ledger B's REWRITE pools through their annexes** (`docs/content/RECEIPT_POOLS_*.md`): not reached; every pool but `NPC_GOAL_NEWS` is dark in the run.

**Added by the chair from SW-11's hand-back (06:0x), not reached:** A1·105, A1·109 and A1·49 — the stressor reader vocabulary in `stressorsCore.js` (one cause, under the law); and the one-line follow-up of `heraldGrammar`'s verbatim glance for the succession headline. The succession-decision headline's two print sites (`WorldPulsePanel.jsx`'s proposal headline, `worldPulseFeedCuration`'s queued copy; C2·26) are SW-11's by the chair's ruling of 05:2x, and SW-11's `newsBody.js`, `wizardNews.js`, `WorldPulsePanel.jsx`'s four card kinds and NewsEntry are final on its lane — a second seat leaves them alone.

**Ledger D, the map's words (69 REWRITE rows; its 3 labels SW-8's; D·1 and the kind pill D·79 are NewsEntry's, SW-11's):** not reached.

## 5. Gates at the tip

Per cause, the writer's own suites, `proseNumerics`, `couplingInclusion`, `newsSubjectVocabulary` and `modeSpeedsWy1` green (listed in each commit body); eslint clean on every touched file; `tsc --noEmit` adds no error. The three record walkers and the full-suite comparison are recorded in the hand-back message.

## 6. The second seat

**Seat:** SW-12 PULSE-LINES, second seat — an Opus 5.5 build seat, a child of the cloud chair, in session `session_01FbPLbekNJoQvhbYjni4ao7`; the same lane, continued from the first seat's tip `b9a4a45fa` (verified with `git rev-parse`; nothing above rewritten). **The measure, reproduced first:** the same harness rebuilt from §0's description (a scratch copy of `scripts/audit/simulate-world.mjs`, absolute imports, the entries rendered through NewsEntry's own functions at each world's end), `WAR_ECON_ALL=1`, `--ticks 52 --reps 2 --scales 0`, `HEALTH: OK`: **4,496 entries, 24,031 printed lines — the first seat's tip figure exactly.** Each cause was measured in a clean worktree at its own staged tree (`git commit-tree` of the index; the shared checkout's other edits never in the run); after every cause the 4,496 entry ids are identical, in order. Counts are cards whose face or tooltip carries the frame, before → after (new lines' counts in brackets).

**Two laws learned on the way, both now in the lane's lines:** (1) *a drift outcome's reasons are the feed's metronome key* — `worldPulseFeedCuration.js :: isDriftOnlyOutcome` / `isMetronomeRepeat` suppress a repeat by headline + reasons, so a receipt varied by the tick defeats the suppression (a tick-seeded first draft of the population strain line added hidden rumour seeds on the WY-1 arm and was refused there); every receipt of a drift outcome is seeded by identity, never the tick. (2) *`fnv1a32 mod 2` is parity-bound* — a two-line pool sent all four recall cards to one line; variant pools are three or four.

### 6a. `settlementStrategy.js` — 78a425f6b, ee00c881a (A2·2–3, ·23–24)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·2 deploy summary | `${name} commits to an offensive posture against ${targetName}.` | four: "${name} is calling up its army to march on ${target}." · "${name}'s rulers mean to send the army against ${target}." · "In ${name} the army is mustering, and its road leads to ${target}." · "${target} has cause to watch its walls: ${name} means to march on it." | 78 → 0 [23/19/20/16] |
| A2·3 deploy reason | `${name}'s strategy chooser selected an offensive deployment.` | four: "${name} weighed its other courses and chose to march." · "Of all that ${name} could do, war looked best to its rulers." · "${name}'s rulers judged the march worth more than waiting." · "${name} could have waited; its rulers chose war." | 78 → 0 [20/19/23/16] |
| A2·23 vassal-recall reason | `${name} has an army abroad while a vassal is besieged (an emergency recall).` | struck (restated the summary; the vassal's id is not in scope) | 1 → 0 |
| A2·24 override reason | `Hard override: deterministic, bypasses the softmax sample (probability 1).` | three, seeded by the town (a drift outcome): "Bringing the army home comes before every other plan ${name} had." · "Nothing else ${name} might do is weighed until its army is home." · "${name} calls its army home ahead of anything else." | 4 → 0 [1/1/2] |

Struck: "columns are forming", "every household … is sending one", "before the season turns" (the deploy is the decision; the war opener judges the march). **Merge note:** FIX-PULSE-DEFECTS rewrites the line above A2·23 (the home-besieged reason's id → name); the resolution is both.

### 6b. `tierResourceDynamics.js` — 1aad33c36 (A2·95–97, ·99–100, ·104–105)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·95 depletion summary | `${name} is consuming ${resource} faster than it recovers.` | four: "${name} is taking more from its ${res} than the land can give back." · "Those who work ${name}'s ${res} come back with less than they used to." · "${name}'s rulers will soon need another source than its ${res}." · "There is less to take from ${name}'s ${res} than there was, and still ${name} takes." | 37 → 0 [5/7/13/12] |
| A2·96 draw reason | `The draw on it is heavy, and a settlement of this standing draws hard.` · (light) `… real but not yet heavy, though …` | heavy, three: "${name} is drawing heavily on its ${res}." · "${name} takes hard from its ${res}." · "Much is being taken from ${name}'s ${res}." · light: "${name} is drawing steadily, if not yet heavily, on its ${res}." | 37 → 0 [11/9/15; 2] |
| A2·97 tiers reason | `Higher settlement tiers consume local resources more aggressively.` | only for a city or larger (the gate's city floor), three: "A ${tier} takes a great deal from the land around it." · "A ${tier} the size of ${name} needs more than the land can easily give." · "${name} is a ${tier}, and a ${tier} uses a great deal." | 37 → 0 [8/12/13] |
| A2·99 recovery summary | `${name} consumes less ${res}, allowing it to become available again.` | "${name} is taking less from its ${res}, and the land is giving back." | 2 → 0 [2] |
| A2·100 demotion reason | `Demotion pressure implies reduced consumption.` | "With ${name} shrinking, less is taken from it." | 1 → 0 [1] |
| A2·104 eligibility | `${currentTier} is near ${nextTier} population and has sustained trade, defense, and legitimacy support.` · `${currentTier} is no longer supported by …` · `${currentTier} can no longer be fed or housed at its own scale: …` | "${name} has nearly the people of a ${next}, and the trade, walls and rule to keep them." · "${name} no longer has the people, trade, walls or rule a ${tier} needs." · "${name} can no longer be fed or housed as a ${tier}: …" (the lower-case-lead defect cured) | 4 / 5 → 0 [4 / 5] |
| A2·105 streak, odds | `Minimum streak ${m}; current streak ${s}.` · `The change is now likelier than not.` / `… possible, not yet likely.` | the streak stays (the Voice Program's pin), three: "This has held for ${n} pulses in a row, and the change needed ${m}." · "It has gone this way ${n} pulses running; ${m} were needed before the change." · "For ${n} pulses it has kept on this way, and the change needed ${m}." · the odds line struck | 9 → 0 [5/1/3]; 8 + 1 → 0 |

Struck: "they are spent", "buy what its resource used to supply" (no import read; a resource may be singular or plural, so no verb agrees with it).

### 6c. `populationDynamics.js` — 7bd8e0b8b (A2·107–110)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·107 summary | `${name} loses about ${n} people from cumulative pressure; about ${m} may migrate onward.` · `${name} gains about ${n} people from favorable conditions.` | loss, four: "${name} has lost about ${n} people[; about ${m} of them have moved on]." · "About ${n} people are gone from ${name}[…]." · "${name}'s rulers count about ${n} fewer people than before[…]." · "Fewer people live in ${name} now, about ${n} fewer[…]." (the onward clause only where migrants were credited) · growth, four of the same shape | 32 → 0 [8/7/8/9] |
| A2·108 strain | `Grain, safety and trade each pull on this: ${g} on the granary, ${w} on the walls, ${r} on the roads.` | only the pressures that bite, hardest first, by the same quarter bands: food "a little short / short / there is not enough food" · safety "people feel a little less safe / fear for their safety / fear for their lives" · trade "a little slow / poor / has all but stopped"; three lead-ins ("${List}." · "In ${name}, ${list}." · "In ${name} these days, ${list}."), seeded by the town for a drift outcome | top frame 20 → 11 |
| A2·109 interval | `Interval ${interval} with ${intensity} intensity.` | struck | 32 → 0 |
| A2·110 mode | `Migration mode resolved as ${mode}.` | concentrated, three: "They have all gone to the same place." · "The ones who left have made for a single place." · "Every one of them has settled in one place nearby." · distributed, three: "They have scattered to the places around." · "They have gone their separate ways to places nearby." · "They have spread out among the neighbouring places." · void: struck | 12 → 0 [5/3/4]; 12 → 0 [3/2/7]; 8 → 0 |

Struck: "taken the road", "families with their goods on their backs", "died this season"; "towns" as a tier noun.

### 6d. `factionCompetition.js` — 75ecda249 (A2·161–163, ·165; A2·160 STOPPED)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·161 summary (every kind) | `${name} sees an opening to press ${preference} interests.` | per kind — capture, four: "${name} means to put its own people in charge of ${town}'s ${target}." · "In ${town}, ${name}'s people are moving in on the ${target}." · "Control of ${town}'s ${target} is passing to ${name}." · "Whoever works at ${town}'s ${target} will soon answer to ${name}." · challenge, four: "${name} is challenging ${town}'s rulers, and wants ${pref} in their place." · "In ${town}, ${name} is gathering support to replace the rulers with ${pref}." · "${town}'s rulers face a challenge from ${name}, who want ${pref}." · "${name} has turned against the rulers of ${town} and is pressing for ${pref}." · rivalry, four (the rival's name read from its own state) · suppression, service, law push, exhaustion one each | 23 → 0 [capture 2/4/3/4; challenge 1/2/4/1; rival 1/1] |
| A2·162 challenge reasons | `Government legitimacy is ${band}.` · `${name} is one of the top three factions and prefers ${pref}.` · `Government changes preserve existing institutions unless …` | band, three each (crisis: "Few in ${town} still accept the rulers' right to rule." · "Most of ${town} no longer accepts its rulers." · "In ${town} the rulers have lost the people's trust."; contested: "… are only tolerated." · "… put up with, not trusted." · "The people of ${town} doubt their rulers.") · rank, three ("${name} is one of the three strongest powers in ${town}." · "Few powers in ${town} are stronger than ${name}." · "${name} stands among the three strongest powers in ${town}.") · the rule text struck | 8 → 0 [3/3/2]; 8 → 0 [6 over two lines, 2]; 8 → 0 |
| A2·163 capture reason | `${name} can convert pressure into institution control.` | three, seeded without the tick (an auto capture is a drift outcome): "${town}'s troubles have given ${name} its chance." · "${name} has seen its chance in ${town}'s troubles." · "With ${town} in trouble, ${name} has room to move." | 13 → 0 [4/4/5] |
| A2·165 rival / exhaustion | `${name} can contest a rival faction's influence basis.` · `Faction campaigning, aid, and crisis response create exhaustion …` | "With ${town} unsettled, ${name} sees its chance against ${rival}." · "${name}'s people are worn out from campaigning and handing out aid." | 2 → 0 [2] |

**A2·160, STOPPED to the chair:** naming the institution in the capture *headline* breaks `tests/copy/landingProseGrounding`'s pair "captures an institution", which binds the landing's owner prose (realm.body2); `FACTION_VERB_PHRASES` is untouched. **Register through its door:** `src/components/home/landingFixture.js` re-emitted (`generate-landing-fixture.mjs --seed lf-033 --emit`) — one line moves, the capture beat's text. Struck: "has the numbers and the backing", "says the rulers have lost the right to rule".

### 6e. `occupation.js` — 67b3f7451 (A2·113–114, ·117–119, ·125–126)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·113 burden summary | `Garrisons, administrators, and suppression tie down ${occ}'s strength across ${n} occupation(s).` | four, the held places named from the ledger: "${occ} has soldiers and clerks tied up holding ${held}, and fewer to spare at home." · "Holding ${held} keeps ${occ}'s soldiers and officials busy far from home." · "${occ}'s garrisons in ${held} need men, pay and food that home must find." · "Every soldier ${occ} keeps in ${held} is one it cannot use elsewhere." | 15 → 0 [4/4/3/4] |
| A2·114 burden reason | `${n} occupation(s) weigh ${word} on the occupier, and each one held makes the next dearer.` (the "1 … weigh" defect) | three: "Holding ${held} weighs ${word} on ${occ}[, and each one more costs dearer]." · "${held} weigh(s) ${word} on ${occ}[…]." · "The cost of holding ${held} bears ${word} on ${occ}[, and grows with each place held]." | 15 → 0 [6/≈5/4] |
| A2·117 spoils summary | `Tribute, levies, and materiel from stabilized occupations sustain ${occ}'s war effort.` | four: "Tribute, men and supplies from the places ${occ} holds keep its war going." · "What ${occ} takes from ${held} helps pay for its war." · "${held} now send(s) ${occ} tribute, men and supplies for the war." · "${occ}'s war is fed in part by what ${held} must hand over." | 12 → 0 [3/3/4/2] |
| A2·118 spoils reason | `… return ${word}, and what comes in eases the weariness of the war at home.` (top word "everything conquest can ever return") | three (the first kept); the top word "as much tribute as any conquest yields" | 12 → 5 [3/4] |
| A2·119 vassalage summary | `${occ}'s occupation of ${town} has stabilized into formal vassalage. The occupied settlement now serves as a client state.` | "${town} has accepted ${occ} as its overlord, and will pay and obey as its vassal." | 3 → 0 [3] |
| A2·125 resistance summary | `Sabotage, noncompliance, and an organizing resistance harry ${occ}'s grip on ${town}.` | four: "In ${town} people break tools, hide stores and will not do as ${occ}'s soldiers say." · "${occ}'s soldiers in ${town} find their orders ignored and their stores raided." · "${town} has not accepted ${occ}'s rule, and its people make every day of it hard." · "Those who hold ${town} for ${occ} cannot count on anyone there to obey." | 5 → 0 [1/2/1/1] |
| A2·126 resistance reason | `The town is ${word}, and the occupation stands at ${state}.` | three, the rung said as the hold ("still in dispute · shaky · firm enough to take from it · settled · that of an overlord") | 5 → 0 [1/4] |

Struck: "its soldiers are gone" (the vassal apply was not read), "burnt carts and broken gates", "cannot walk the streets alone at night".

### 6f. `warDeployment.js` — 34d80d56b (A2·128–130, ·133, ·135–136)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·128 march summary | `${from} commits its army to a siege of ${target}. The campaign is opened.` | four: "${from}'s army has marched to lay siege to ${target}." · "${from}'s soldiers are on the road to ${target}, to put it under siege." · "${target} will soon have ${from}'s army at its walls." · "${from} has sent its army against ${target}, and means to besiege it." | 16 → 0 [2/5/4/5] |
| A2·129 ready reason | `${from} is war-ready and ${target} is a feasible target.` | three, seeded without the tick: "${from}'s army is ready, and ${target} is within its reach." · "${from} has an army fit to march, and ${target} is a target it can hope to take." · "${from} is ready for war, and judges ${target} open to attack." | 16 → 0 [7/2/7] |
| A2·130 rusty command | `A rusty command over-/under-committed the force[, and not by a little].` | three leads ("Its commanders, out of practice," · "Out of practice, its captains" · "Its rusty captains") + "sent [far] more soldiers than the march needs." / "sent [far] too few soldiers for the march." | 12 / 4 → 0 [7/3/6] |
| A2·133 withdrawal | `${name}'s army can no longer plausibly take ${target}. It withdraws, the campaign abandoned.` | three: "… cannot take ${target} and is marching home." · "${name} has given up the siege of ${target}; its army is coming home." · "The siege of ${target} is over: …" | 3 → 0 [2/1] |
| A2·135 conquest | `The siege of ${target} broke. ${occ}'s army holds the walls; an occupation authority now rules in the conqueror's name.` | three: "${target} has fallen. ${occ}'s soldiers hold its walls, and ${occ}'s governors now give the orders." · "${occ}'s army has taken ${target}, and rules it now in ${occ}'s name." · "The walls of ${target} are ${occ}'s now; its people answer to ${occ}'s officers." | 3 → 0 [1/2] |
| A2·136 conquest reason lead | `Weighed against the walls, the besiegers were …` | "Against the walls of ${target}, the besiegers were …" (the clause words: 6g) | 3 → 0 [3] |

Left dark for PULSE-DARK: A2·131–132 (the coalition lines), the thin-supply line.

### 6g. `feasibilityGate.js` — 2fc55046f (A2·136 clauses, A2·137)

| row | OLD | NEW |
|---|---|---|
| verdict clauses | plausible `the matchup alone made a storm worth trying` · auto_fail `the gate judged a storm impossible` · harassment `the gate allowed no more than a raid on the approaches` · require_coalition `the gate would not open a storm to one attacker alone` · require_betrayal `the storm was opened by the rot inside the defender, not by weight of arms` · require_magic `… by a decisive war-magic edge, not by weight of arms` | "strong enough to try a storm" · "far too weak for any storm to succeed" · "able to do no more than raid the roads around the walls" · "too weak to storm the walls alone" · "the defenders were divided among themselves, and the gates opened from within" · "their war-magic broke what their numbers could not" |
| matchup receipt | `Weighed against the walls, the attacker is ${word}: the defender's home ground counted.` | three (keyed on the ratio; the gate holds no id): "Against these walls the attacker is ${word}; defenders fight hardest at home." · "Fighting on their own ground, the defenders make the attacker ${word}." · "The attacker is ${word} against walls whose defenders are fighting for their homes." |
| verdict receipts | `Within the plausible band: the contest is decided by the siege roll.` · `Defender is internally fractured (coup / rebellion / legitimacy crisis); …` · `Attacker holds a decisive war-magic advantage; …` · `Too weak to break the town alone, but a coalition could, so the solo siege is blocked.` · `Even the coalition falls short of a plausible storm; …` · `Hopelessly outmatched; a siege deterministically fails, …` | "It could go either way." · "The defenders are divided among themselves; the gates may open from within." · "The attacker has war-magic enough to break walls its numbers could not." · three: "Alone it cannot break these walls; with allies it could, so it will not try alone." · "With allies it might take these walls; alone it will not try." · "These walls are too strong for it alone, though not for it and its allies together." · "Even together the attackers fall short of a storm; they can only raid." · "Hopelessly outmatched, it cannot take the walls, though it can still raid the roads." |

Counts: "home ground counted" 3 → 0 [1/2]; "solo siege is blocked" 3 → 0 [1/2]; "matchup alone made" 2 → 0 [2]; "rot inside the defender" 1 → 0 [1].

### 6h. `realmEvents.js` — 39a46b04b (A2·152–154, ·156–157)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·152 fallback headline | `Realm-wide ${human} grips the realm` | "${Human} spreads across the realm" (the labelled headlines untouched) | 3 → 0 [3] |
| A2·153 summary | `${n} settlements are now caught in ${human}.` | four, the label leading, the count in words: "${Label} has taken hold in ${n} places at once." · "${Label} now reaches ${n} places across the realm." · "In ${n} places at once, people are living through ${label}." · "${Label} is no longer one place's trouble: ${n} places share it." | 12 → 0 [1/5/4/2] |
| A2·154 reasons | `${n} settlements share an active ${human} stressor.` · `Promoted from settlement scope to a realm-wide arc.` | struck (both restated the summary) | 12 / 12 → 0 |
| A2·156 last altar | `No settlement in the realm still keeps ${name}'s rite. … what survives of the faith is memory rather than practice.` · reason `… no tier remains for the creed to fall from.` | "No place in the realm still keeps ${name}'s rite. The last altar is cold, and its priests have gone to other temples." · "The last place that kept the rite has turned to another god." | dark in the run |
| A2·157 pantheon reasons | `${name} crossed into the major tier of the pantheon.` + `A decisive lead in seats held has been sustained past the hysteresis dwell.` · `${name} fell to the cult tier of the pantheon.` + `Its seats held collapsed past the hysteresis dwell.` | ascendancy, three: "More places keep ${name}'s rite than any other god's." · "No other god is kept in as many places as ${name}." · "${name}'s rite is kept in more places than any rival's, and has been for some time." · twilight, three: "Few places still keep ${name}'s rite." · "${name}'s rite is kept in only a few places now." · "The places that kept ${name}'s rite have mostly turned to other gods." · the dwell lines struck | 4 → 0 [2/2]; 3 → 0 [2/1]; 7 → 0 |

Struck: the audit's named list of towns (only ids are held here), "only the old folk remember the prayers". Pin re-keyed: `pantheon.test.js :: A1`'s lead ("No settlement …" → "No place …").

### 6i. `candidateEvents.js` — 23bcf212b (A2·75; A2·74 STOPPED)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·75 gate reason | `Organic settlement drift is conservative: pressure must pass a gate before it can roll.` | struck | 52 → 0 |

**A2·74, STOPPED to the chair:** the pressure row's own reasons still print raw ("active condition: …" 26, "… derived from causal state" 31, the raw pressureModel keys). The audit's cure is wiring through `stressors.js :: readerPressureReasons`, which is not exported, in a file the first seat finished; the default asked is one `export` keyword there and one call here, as its own cause.

### 6j. Two lane hygiene commits

- **3ddbc6b56** — the first seat's two negative pins (`causeResolutionLifecycle`, `stressorResolutionReceipts`) take the walker's one-line `anchored:` marker: `negativeAssertionAnchor` was red at `b9a4a45fa` (6 over a ceiling of 5; 1 over 0).
- **7ba010c07** — the variant pools' slot bags typed (`TradeWarLineSlots`, `StrategyLineSlots`, `TierLineSlots`, `PopulationLineSlots`, then `OccupationLineSlots`, `WarDeploymentLineSlots`, `RealmLineSlots` in their causes; file-unique names, because `worldPulse/index.js` re-exports the modules and a shared typedef collides, TS2308), and the first seat's five helper casts in `stressors.js` given real types: `domainAnyCastBaseline` was red at `b9a4a45fa` (tradeWar 32/19, stressors 60/55); every touched file now sits exactly at its frozen allowance. No baseline moved.

### 6k. Pins, registers and golden surfaces (the second seat)

- **Golden surfaces (herald, gm /525, fence /360, prose /1,050, witness, pdf): none moved by these causes.**
- **Pins re-keyed by identity, never loosened:** `modeSpeedsWy1 :: BASE_PULSE_HASH` a55e7cd3 → 12ac14ad (population) → 1123201b (factionCompetition) → ed80ff1d (candidateEvents), each TEXT ONLY, leaf-diffed against its parent in a clean worktree (78 + 39; 121 + 25; 0 + 171 string leaves + array-tail keys; no id, tick, number or rumour seed moved); every other cause leaves the arm byte-identical (measured). `demographicsFloor :: 8. THE DARK FENCE` re-recorded twice, TEXT ONLY, by TE-HERALD-1's method (the trace with every summary / reasons / reason leaf neutralised is equal at parent and cause; the parent's live run reproduced the old values). `tierResourceDynamics` (the streak in words), `pantheon` (the lead).
- **Registers through their doors:** `landingFixture.js` (one line, 6d).
- **Reds named by cause, not these causes:** `newsHeadlineContract` A2/A3 and `proseFamilyContract` (3) — red at `b9a4a45fa`: the news-family contracts count distinct headline and summary values, which the lane's variants raise; the precedent (MERGE-CAR ffafe2a0e, MERGE-WAVE 460b1b0d9) re-records the family **in one act at the merged tip**, so they are left for STYLE-2-MERGE. `worldPulseFactionSeating` (2) red at `2053a809c`. The full-suite comparison base → tip is in the hand-back.

### 6l. What stays (the remainder, BY FILE, for a third seat)

**A2 lit rows not reached:** `warRecordMode.js` A2·146 (13) · `mobilizationReactions.js` A2·149–150 (4) · `stressorGates.js` A2·80 (3), ·83–84 (2) · `deploymentReturn.js` A2·139–140 (2) · `resourceTaxonomy.js` A2·101 (2) · `institutionLifecycle.js` A2·173–175 (1) · `moralInstitutionPressure.js` A2·179–180 (1) · `relationshipHierarchy.js` A2·184 (1) · `flows.js` A2·183 (1) · `pressureModel.js` A2·74 (26 + 31; STOPPED, 6i) · `factionCompetition.js` A2·160 (the capture headline; STOPPED, 6d) · `stressorsCore.js` A2·78 (the catalog labels; not in the first seat's list either).
**Not reached:** A1·105, A1·109 and A1·49 (the stressor reader vocabulary in `stressorsCore.js`, one cause); ledger D's sixty-nine map-word rows (less its three labels, SW-8's, and the succession-headline sites, SW-11's); `heraldGrammar`'s verbatim glance for the succession headline.

## 7. CONFIRMED against PLAUSIBLE

**CONFIRMED** (executed here): the base sha; the measure (4,496 / 24,209) and every before → after count above; identical entry ids after every cause; the WY-1 arm's per-cause hashes and their text-only leaf diffs; the reds named at the base. **PLAUSIBLE:** every new line is a proposal against the law, read against its writer's slots by this seat — not a measured reader outcome; the per-type birth signs are inferences from the crisis type alone, flagged for the owner's veto.

**The second seat — CONFIRMED** (executed here): the base sha; the measure reproduced (4,496 / 24,031) and every before → after count in §6; identical entry ids after every cause; the WY-1 arm's per-cause hashes and text-only leaf diffs; the dark fence's neutralised digests; the reds named at the base by a full suite at `b9a4a45fa`. **PLAUSIBLE:** every new line is a proposal against the law, read against its writer's slots by this seat (the printing regions and their slots, not every helper line of each file); "is marching home" (withdrawal) and "nearby" (migration) are read from the writers' names for the moves, not from the apply paths.
