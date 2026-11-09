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

**A2·160, STOPPED and RULED (the chair: the default stands — "headline + landing line, one lane later"):** naming the institution in the capture *headline* breaks `tests/copy/landingProseGrounding`'s pair "captures an institution", which binds the landing's owner prose (realm.body2); `FACTION_VERB_PHRASES` is untouched. **Register through its door:** `src/components/home/landingFixture.js` re-emitted (`generate-landing-fixture.mjs --seed lf-033 --emit`) — one line moves, the capture beat's text. Struck: "has the numbers and the backing", "says the rulers have lost the right to rule".

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

**A2·74 and ·76 — 8100cc2f7, as the chair RULED on the STOP:** the pressure row's own reasons (printed raw: "active condition: …" 26, "… derived from causal state" 31, "military regional channel exists" 9, "a hostile neighbour relationship raises conflict pressure" 11) now read through `stressors.js :: readerPressureReasons`, evidence only — the ONE edit to the first seat's file is the `export` keyword on that function. A2·76's food-ceiling receipt `the settlement's own granary books do not carry a shortage this deep` → "The granary books show less of a shortage than the talk says." (carried through; the legibility pin `demographicsWorldsHand` P4 holds). All four raw frames → 0. Red-first: `conditionRefreshRecordMode.test.js :: a planted food pressure prints the reader sentence, never "active condition: …" nor "derived from causal state"`, red at 40df143b1. **Not fallen:** the reader's "X already burdens the settlement." carries the old per-condition frames one-for-one (top 11 = the old top); its variants are the reader's own (`stressors.js`), named in §6l.

### 6i-2. `warRecordMode.js` — c1bcd443d (A2·146)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·146 clearance summary | `The war scar no longer renews its grip on ${name}, though its aftereffects continue fading.` | four: "The worst of the war's weariness is over in ${name}; what is left will fade with time." · "${name} is still tired of the war, but the weariness no longer deepens." · "In ${name} the war still weighs, but a little less as time goes on." · "${name}'s war-weariness has begun to ease, though its marks will take time to fade." | 13 → 0 [2/5/1/5] |
| A2·146 clearance reason | `The war's weariness has fallen below the level at which it renews itself; what is left only fades.` | struck (restated the summary) | 13 → 0 |

Struck: "fewer homes mourn", "raise taxes and men again without riots", "the market is busier and the black armbands fewer", "the levy is filling".

### 6i-3. `mobilizationReactions.js` — 40df143b1 (A2·149–150)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·149 summaries | `Seeing ${mob} mobilize, the belligerent ${reactor} prepares a pre-emptive move.` · `${reactor} answers ${mob}'s mobilization by hardening its own defences.` | pre-empt, three: "${mob} is arming, and ${reactor} means to strike before it is ready." · "${reactor} will not wait for ${mob}'s army to be ready; it means to strike first." · "As ${mob} gathers its army, ${reactor} readies a blow of its own." · fortify: "With ${mob} arming, ${reactor} is looking to its own walls and watch." | 4 → 0 [2/1/1] |
| A2·150 reasons | `${reactor} is a ${relType} of the mobilizing ${mob}.` · `Its standing disposition leans ${lean}, and it chose to ${move}.` · `A bounded ${keys} nudge (${incident}).` | the tie in words (rival · hostile · cold war), three: "${reactor} ${tie} ${mob}, which is arming." · "${mob} is arming, and ${reactor} ${tie} it." · "${reactor} ${tie} ${mob}, and ${mob} is gathering its army." · the temper, three ("${reactor} is quick to answer force with force." · "… has never been slow to meet force with force." · "It is ${reactor}'s way to answer arms with arms."; slow: "${reactor} is slow to pick a fight.") · the nudge struck | 4 → 0 [1/2/1]; 4 → 0 [0/3/1] |

Struck: "repairing its walls and doubling the watch" (no works are read).

### 6j. Two lane hygiene commits

- **3ddbc6b56** — the first seat's two negative pins (`causeResolutionLifecycle`, `stressorResolutionReceipts`) take the walker's one-line `anchored:` marker: `negativeAssertionAnchor` was red at `b9a4a45fa` (6 over a ceiling of 5; 1 over 0).
- **7ba010c07** — the variant pools' slot bags typed (`TradeWarLineSlots`, `StrategyLineSlots`, `TierLineSlots`, `PopulationLineSlots`, then `OccupationLineSlots`, `WarDeploymentLineSlots`, `RealmLineSlots` in their causes; file-unique names, because `worldPulse/index.js` re-exports the modules and a shared typedef collides, TS2308), and the first seat's five helper casts in `stressors.js` given real types: `domainAnyCastBaseline` was red at `b9a4a45fa` (tradeWar 32/19, stressors 60/55); every touched file now sits exactly at its frozen allowance. No baseline moved.

### 6k. Pins, registers and golden surfaces (the second seat)

- **Golden surfaces (herald, gm /525, fence /360, prose /1,050, witness, pdf): none moved by these causes.**
- **Pins re-keyed by identity, never loosened:** `modeSpeedsWy1 :: BASE_PULSE_HASH` a55e7cd3 → 12ac14ad (population) → 1123201b (factionCompetition) → ed80ff1d (candidateEvents), each TEXT ONLY, leaf-diffed against its parent in a clean worktree (78 + 39; 121 + 25; 0 + 171 string leaves + array-tail keys; no id, tick, number or rumour seed moved); every other cause leaves the arm byte-identical (measured). `demographicsFloor :: 8. THE DARK FENCE` re-recorded twice, TEXT ONLY, by TE-HERALD-1's method (the trace with every summary / reasons / reason leaf neutralised is equal at parent and cause; the parent's live run reproduced the old values). `tierResourceDynamics` (the streak in words), `pantheon` (the lead).
- **Registers through their doors:** `landingFixture.js` (one line, 6d).
- **The news-family contracts, left for STYLE-2-MERGE as the chair RULED** (re-recorded in one act at the merged tip, the MERGE-CAR ffafe2a0e precedent; other lanes move the same registers). Each door run once locally, base `b9a4a45fa` → tip: the moves are COUNT-ONLY (distinct values and occurrences of prose scalars; no home, field, id or polarity added or lost). `newsHeadlineContract` A2 — address rows moved 2 → 4: `applied|stressor_residual` headline and summary distinct 3 → 9 (the first seat's), `applied|strategy_deploy` summary 2 → 4, `realm|realm_insurgency` summary 2 → 3; A3 — `selectedOutcomes` and the union distinct 96 → 102 (the same at base and tip). `proseFamilyContract` A1/A3/A5 — scalarRows frozen 37,103 → 36,797 at the base → 36,487 at the tip (struck receipts remove rows); family distinct and occurrence counts move with them (e.g. 64 → 65 → 61 distinct, 443 → 416 → 400 occurrences). `newsVoiceContract` green at both. `worldPulseFactionSeating` (2) red at `2053a809c`. The full-suite comparison base → tip is in the hand-back.

### 6l. What stays (the remainder, BY FILE, for a third seat)

**A2 lit rows not reached:** `stressorGates.js` A2·80 (3), ·83–84 (2) · `deploymentReturn.js` A2·139–140 (2) · `resourceTaxonomy.js` A2·101 (2) · `institutionLifecycle.js` A2·173–175 (1) · `moralInstitutionPressure.js` A2·179–180 (1) · `relationshipHierarchy.js` A2·184 (1) · `flows.js` A2·183 (1) · `factionCompetition.js` A2·160 — the capture headline + the landing line, one lane later (ruled, 6d) · `stressors.js :: readerPressureReasons` — the reader's per-condition sentence at one line ("X already burdens the settlement.", top frame 11; and a joined list such as "Dominant npc removed, corruption exposed already burdens …" reads the raw tokens) · `stressorsCore.js` A2·78 (the catalog labels; not in the first seat's list either).
**Not reached:** A1·105, A1·109 and A1·49 (the stressor reader vocabulary in `stressorsCore.js`, one cause); ledger D's sixty-nine map-word rows (less its three labels, SW-8's, and the succession-headline sites, SW-11's); `heraldGrammar`'s verbatim glance for the succession headline.

## 7. CONFIRMED against PLAUSIBLE

**CONFIRMED** (executed here): the base sha; the measure (4,496 / 24,209) and every before → after count above; identical entry ids after every cause; the WY-1 arm's per-cause hashes and their text-only leaf diffs; the reds named at the base. **PLAUSIBLE:** every new line is a proposal against the law, read against its writer's slots by this seat — not a measured reader outcome; the per-type birth signs are inferences from the crisis type alone, flagged for the owner's veto.

**The second seat — CONFIRMED** (executed here): the base sha; the measure reproduced (4,496 / 24,031) and every before → after count in §6; identical entry ids after every cause; the WY-1 arm's per-cause hashes and text-only leaf diffs; the dark fence's neutralised digests; the reds named at the base by a full suite at `b9a4a45fa`. **PLAUSIBLE:** every new line is a proposal against the law, read against its writer's slots by this seat (the printing regions and their slots, not every helper line of each file); "is marching home" (withdrawal) and "nearby" (migration) are read from the writers' names for the moves, not from the apply paths.

## 8. The third seat

**Seat:** SW-12 PULSE-LINES, third seat — an Opus 5.5 build seat, a child of the cloud chair, in session `session_01FbPLbfAoVLqZ5EzNhzAKrB`; the same lane, continued from the second seat's tip `aff902eb9` (verified with `git rev-parse`; nothing above rewritten). The checkout is a detached HEAD at the lane's tip and the classifier refused switching onto the local branch, so every push is the plain fast-forward `git push --no-verify origin HEAD:lane/style-2-pulse-lines-2026-11-09`. **The measure, reproduced first:** §0's harness rebuilt (a scratch copy of `scripts/audit/simulate-world.mjs` with absolute imports and one line that keeps each world's `wizardNews.entries`; every entry rendered through `entry.headline`, `newsBodyText`, `newsVoiceLine`, `newsReasonPhrases(…).slice(0, 3)`, `newsReaderSummary`), `WAR_ECON_ALL=1`, `--ticks 52 --reps 2 --scales 0`, `HEALTH: OK`: **4,496 entries, 23,842 printed lines — the prompt's figure at `aff902eb9` exactly.** Every cause was measured AT ITS COMMIT in a clean worktree (`git worktree` at the sha, nothing else in the tree); after every cause the 4,496 entry ids are identical, in order; the tip prints 23,841 lines (one struck odds pill). Counts are cards whose face or tooltip carries the frame, before → after (new lines in brackets).

### 8a. `stressorGates.js` — a5f185a1f (A2·80, ·83, ·84)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·80 :509 | `Legitimacy is in open crisis; every ruling claim is contestable.` | "Hardly anyone here still accepts the rulers' right to rule." | 0 → 0 (dark) |
| A2·83 :753 | `Bread and debt: the oldest fuel of uprisings.` | by the gate's own branch: "People here are going hungry." · "People here are deep in debt." · both: "People here are going hungry, and are deep in debt besides." | 0 → 0 |
| A2·83 :820 | `Leveraged ledgers amplify every tremor.` | "Debts already weigh on this place, so a fall in trade hits it all the harder." | 0 → 0 |
| A2·84 :891 | `Magic is load-bearing here: ${signals}.` | "This place leans on magic: ${signals}." | 0 → 0 |

The rows' LIT lines ("The purges are fresh…" 1, "Public patience…" 1, "The underworld already owns the night here." 1, "A practised watch…" 2, "A plural religious landscape…" 1) are the audit's PASS and stay. Struck: "they blame the rulers" (not read).

### 8b. `deploymentReturn.js` — e8549f5df (A2·139–140)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·139 siege_lifted summary | `${home}'s army returned to a besieged home and relieved it; the settlement begins to recover.` | four, seeded by the outcome id: "${home}'s army came home and drove the besiegers from its walls." · "The siege of ${home} is over: its own army came home and broke it." · "${home}'s gates are open again; its army came back and sent the besiegers off." · "The besiegers have gone from ${home}'s walls, driven off by its returning army." | 2 → 0 [1/1] |
| A2·140 relief + liberation reasons | `A host come home ${muster} relieved the siege / threw off the occupiers: ${odds}, and it came off.` | one pool of three, the deed in a slot: "${home}'s army came home ${muster} and ${deed}. It was ${odds}, and the day went its way." · "${home}'s army ${deed} on its return, ${muster}. It was ${odds}." · "It was ${odds}: ${home}'s army came home ${muster}, and ${deed}." | 2 → 0 [1/1] (a single line measured 2 → 2 first: the refusal line) |

Struck: "the settlement begins to recover" (not read on this branch); the besieger stays unnamed (only `isBesieged` is read). The TE-HERALD-1 ladders (muster, odds) are kept and their pins hold. The pools and their import sit at the file's FOOT: `wizardNewsAuthoring`'s ledger is line-bound and a pool above its rows moved two baselined lines by 15.

### 8c. `resourceTaxonomy.js` — 63f3fda3c (A2·101)

| row | OLD | NEW | before → after |
|---|---|---|---|
| natural recovery | `Renewable or managed resource can recover when pressure drops.` | three, seeded by the settlement and the resource (a drift outcome): "Given rest, it comes back on its own." · "Left in peace, it will come back." · "It recovers by itself once the taking slows." | 2 → 0 [1/1] |
| high magic | `High magic can re-stabilize this magical resource.` | "Strong magic can mend it." | dark |
| forced | `Recovery was explicitly forced.` | struck (an empty reason the caller filters) | dark |

### 8d. `institutionLifecycle.js` — eff5e88da (A2·173–175)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·173 build summary | `Good years have given ${name} the means to build what it lacked. ${gap.reason}` (the reason printed twice) | four, seeded by the town and the building: "Good years have given ${name} the coin to build a ${inst}." · "${name} has done well enough of late to afford a ${inst} of its own." · "Builders are at work in ${name}: the good years are paying for a ${inst}." · "With times good, ${name}'s rulers have found the money for a ${inst}." | 1 → 0 [1] |
| A2·174 :412 | `Local resources could support ${chain} at this tier.` | "The land nearby could supply ${chain} here." | dark |
| A2·175 streak | `Economy stably healthy / distressed for ${n} tick(s) (minimum ${m}).` | three each, in pulses, the minimum struck: "${name} has prospered for ${n} pulses running." · "Times have been good in ${name} for ${n} pulses in a row." · "For ${n} pulses now, ${name} has done well." / "… struggled …" · "… hard …" · "… done badly." | 1 → 0 [1] |
| A2·175 odds | `The building is possible, not yet likely.` (and three twins) | struck | 1 → 0 |

The file sits at its 800-line eslint ceiling with ZERO slack, so the pools are inline (braced tokens, a function replacer): net code lines 800 → 800, no ceiling raised.

### 8e. `moralInstitutionPressure.js` — 81fc1a2a0 (A2·179–180)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·179 summary | `Under ${patron}, ${inst} faces abolition: ${cause}.` + cause `it sits ill with the settlement's patron` | four, seeded by the town and the institution: "${name}'s rulers mean to shut the ${inst}, at the urging of ${patron}'s faithful: ${cause}." · "${Patron}'s faithful want the ${inst} in ${name} closed: ${cause}." · "${Patron}'s faithful have turned ${name} against its ${inst}: ${cause}." · "Those who keep ${name}'s ${inst} running have been told it must close: ${cause}." (nameless prescriber: "the faithful") | 1 → 0 [1] |
| A2·179 causes | `its cruelty and disorder offend the seat` · `the seat will no longer abide its cruelty / disorder` · `it sits ill with the settlement's patron` | "it is cruel, and it breeds disorder" · "it is thought too cruel" · "it is thought to breed disorder" · "it does not sit well with the faith" | — |
| A2·180 arc | `The case against it has been building for seasons rather than arriving in a single ruling: an arc, not a decree.` (also printed on the martial lapse) · founding `… for years …` | moral "The faithful have spoken against it for seasons." · martial "It has stood idle through seasons of peace." · founding "The faithful have asked for it for years." | 1 → 0 [1] |

Struck: "priests" (no clergy is read). Pin re-keyed: `sentenceOpeningFallbacks :: 6` — the summary arm to the exact seeded line.

### 8f. `relationshipHierarchy.js` — 53d6cc3a0 (A2·184) · `flows.js` — c3a5ee49d (A2·183)

| row | OLD | NEW | before → after |
|---|---|---|---|
| A2·184 | `The relationship is suspended under the overlord conflict posture.` | "Its overlord's quarrels now decide whom it may deal with, and this friendship is set aside." | 1 → 0 [1] |
| A2·183 :150 | `${supplier} is in a trade/supply crisis.` | "${supplier} is in trouble and cannot spare its goods." | 1 → 0 [1] |
| A2·183 :151 | `A confirmed trade-dependency channel makes ${dest} reliant on it.` | "${dest} depends on ${supplier} for its goods." (struck from the draft: "most of what it needs") | 1 → 0 [1] |

### 8g. `stressors.js :: readerPressureReasons` — 47e6807fc (§6l)

`${Label} already burdens the settlement.` (40 cards; top 11 "Corruption exposed"; a joined list read the raw tokens with a singular verb) → each archetype pressureModel matches (its closed sets, 22 ids) in its own words — "the famine", "the strain of war", "trouble on the roads", "the corruption that has come to light", "the loss of its leading figure", "the weight of cold-war sanctions", "what its overlord takes from it", "unrest among the region's rulers", "a shortage of goods from outside", … — joined "a, b and c", with the pressure row's own place, in three orders seeded by the place and the conditions (never the tick): "${Place} is already living with ${list}." · "${List} already weigh(s) on ${place}." · "In ${place}, ${list} is/are already a burden." **Frames: "already burdens" 40 → 0; the top frame (place masked) 11 → 8** (new: 14 / 15 / 11 cards over the three orders). The second seat's `export` and its pin stay; the pin's reasons re-keyed; a new red-first pin for the list's grammar.

### 8h. The stressor reader vocabulary, `stressorsCore.js` — 45773294d (A1·105, ·109, ·49)

`STRESSOR_READER_NOUN` by type ("the split between the faiths", "the betrayal", "the famine", "the rebellion", "the smugglers' road", … ; a type outside the map prints its label), and the residue words for the rebellion's three tokens ("old reprisals remembered", "rebel cells still meeting", "taxes no one pays"). The two print sites are `stressorAftermath.js`'s, the rows' own writer: its two headline lines and its `residualText` — three lines, nothing else there.

| row | OLD | NEW | before → after |
|---|---|---|---|
| A1·105 | `${label} has passed` | four, seeded by the stressor's id: "${Noun} is over" · "${Noun} has ended" · "${Noun} has run its course" · "The worst of ${noun} is past" | top frame 33 → 17 (all aftermath + history headlines, by headline) |
| A1·109 | `${label} passes into history` | "${Noun} passes into history" · "${Noun} is only a memory now" · "${Noun} belongs to the past now" · "Few still speak of ${noun}" | 47 → 15 on the old frame's words |
| A1·49 | `reprisal memory, autonomy cells, broken tax obligations` | "old reprisals remembered, rebel cells still meeting, taxes no one pays" | 4 → 0 |

The catalog labels themselves are not renamed (they persist on records and feed other surfaces; A2·78 stays listed). Pins re-keyed: `stressorAftermath` (two headlines); new red-first pin "a rebellion's aftermath is told in reader words".

### 8i. Pins, registers, golden surfaces (the third seat)

- **Golden surfaces (herald, gm /525, fence /360, prose /1,050, witness, pdf): none moved.** `demographicsFloor :: 8. THE DARK FENCE` green after every cause.
- **Pins re-keyed by identity, never loosened:** `modeSpeedsWy1 :: BASE_PULSE_HASH` 146027f8 → 60470ac9 (flows; 88 string leaves) → bd7c4e79 (readerPressureReasons; 61 string leaves), each TEXT ONLY, leaf-diffed against its parent in a clean worktree (0 keys added or lost; no id, tick, number or rumour seed); every other cause leaves the arm byte-identical (measured). `sentenceOpeningFallbacks :: 6`, `conditionRefreshRecordMode` (A2·74's reasons), `stressorAftermath` (two headlines). New red-first pins (red at their parents, green at the tip): the joined condition list's grammar; the rebellion's residue words.
- **Registers:** none moved (the any-cast baseline, the line-bound authoring ledger, the 800-line ceilings all held as they were).
- **The news-family contracts, count-only, for STYLE-2-MERGE** (each door run once, base `aff902eb9` → tip, the logs diffed): the only move is `newsHeadlineContract` A2's address row `applied|stressor_aftermath|headline|indicative`, distinct values 3 → 7, occurrences 9 → 9. `proseFamilyContract` (A1/A3/A5) and `newsHeadlineContract` A3 print identically at base and tip (red at both, as §6k records); `newsVoiceContract` green at both.

### 8j. Ledger D, the map's words — `heraldWanderers.js`, 583982874 (D·51–56)

| row | OLD | NEW |
|---|---|---|
| D·51 SCANDAL_LINE | `What is spoken of them is a matter of bought loyalty / betrayal / cruelty / conspiracy / heresy.` | "People say their loyalty can be bought." · "People say they betrayed those who trusted them." · "They are known for cruelty." · "People say they plot against those they serve." · "They are called a heretic." |
| D·52 notorious | `Their name carries badly wherever it is spoken.` | "Their name is known, and not kindly." |
| D·53 destruction_dispersal | `Their home was destroyed and scattered its people.` | "Their home was destroyed and its people scattered." |
| D·54 nameless | `A stranger` | "An unnamed traveller" |
| D·55 resting band; roaming top rung | `Their standing changed this / last turning.` · `… has held a few / some turnings.` · `… longer than most care to count.` · `On the road longer than most care to count.` | "They came to rest this / last turning." · "They have stayed put a few / some turnings." · "They have stayed put a long while." · "On the road a long while now." |
| D·56 held-abroad whyLine | `They are held abroad while carrying the realm's business.` | "They were stopped while carrying the realm's business." (the audit's blank whereaboutsLine NOT taken: the place-naming link is drawn for the owner's view only) |

Dark in the measure (the soak renders only NewsEntry). Pins re-keyed: `heraldWanderersRegister` (notoriety, when, whyLine).

**D·12–13 (`heraldFeed.js`'s two fallback headlines) — tried and REVERTED:** "A recorded pressure has lifted" → "A trouble in the realm has passed" and "A past pressure remains in living memory" → "An old trouble is still talked of" move `tests/property/heraldKnowledgeDeskGolden` ("THE REFILE MOVES NO CONTENT BYTE…", 9e5ddbdb → 258d28e3). Both seats moved no golden and this seat keeps it so; the two lines go to STYLE-2-MERGE as one UNSIGNED herald cause with that delta, or to the next seat.

### 8k. What stays (the remainder, BY FILE)

- **Ledger D (map words), not reached** — 61 REWRITE rows (69 less D·51–56 done, D·12–13 golden-bound above, and the exclusions): `WorldPulsePanel.jsx` D·18, ·19, ·20, ·22, ·24 (not its succession headline sites, SW-11's) · `AdvanceReport.jsx` D·43–47 · `WorldPulseData.js` D·29–31 (D·28 the label "Faction", SW-8's) · `SimulationRulesAxes.jsx` D·60–63 · `HeraldCommandBody.jsx` D·38–41 · `SimulationRulesDialog.jsx` D·65 (less "Factions", SW-8's), ·66, ·67 · `RelationshipChronicleSection.jsx` D·70–72 · `HeraldAdjudication.jsx` D·33–35 · `heraldFeed.js` D·12–13 (golden-bound) · `WorldMapToolbar.jsx` D·74–75 · `RealmDashboard.jsx` D·83–84 · `AutoplacementConsent.jsx` D·92–93 · `LiveWarStatus.jsx` D·5 · `ChroniclersLetterPanel.jsx` D·8 · `ChronicleScrollback.jsx` D·49 · `HeraldWanderers.jsx` D·57 · `RealmVerbComposer.jsx` D·77 · `RealmDocket.jsx` D·85 · `RealmForecast.jsx` D·86 · `RealmComparisons.jsx` D·87 · `NpcTrailSection.jsx` D·88 · `HeraldSceneContext.jsx` D·89 · `HeraldRemembrance.jsx` D·90 · `heraldRegister.js` D·91 · `RoadScenePanel.jsx` D·94 · `WorldMapStage.jsx` D·95 · `WorldMapTourSteps.js` D·96 · `SettlementPalette.jsx` D·98 · `LayersPanel.jsx` D·99 · `WhileYouWereAway.jsx` D·100 · `PerspectiveStandings.jsx` D·103 · `PantheonPanel.jsx` D·104. Excluded and not this lane's: D·1 (`warHomeCosts.js`, A1's), D·28 / D·69 / "Factions" (SW-8's labels), D·79 and D·81 (`WizardNewsPanel.jsx`, NewsEntry, SW-11's). Every D row is dark in the run (the soak renders NewsEntry alone), so none of them moves a measured frame.
- **`heraldGrammar`'s verbatim glance for the succession headline:** not reached.
- **`stressorsCore.js` A2·78** (the catalog labels as persisted names): not renamed; the reader noun (8h) now carries the plain word on the two aftermath headlines; the residual frames (the first seat's) and every other reader of `stressor.label` still print the engine label.
- **`factionCompetition.js` A2·160:** ruled one lane later (6d); untouched.

### 8l. Gates (the third seat)

Per cause, the writer's own suites plus `proseNumerics`, `couplingInclusion`, `newsSubjectVocabulary`, `modeSpeedsWy1`, `negativeAssertionAnchor`, `domainAnyCastBaseline` (each commit body lists them); eslint clean on every touched file; `tsc --noEmit` 167 at `aff902eb9` and 167 at 45773294d, text-equal (`diff` of the sorted error lines empty); the three record walkers green before every push. Reds named by cause, not this seat's (red at `aff902eb9`): `layerBoundaries` (the `generators/foodGenerator.js | generators/isolationSupport.js` cycle), `sovereigntyLightingContract` (the live test-title count 28,697 vs 28,695), `densityLaw` (4), the news-family contracts (§6k). **The full suite, base → tip** (both in clean worktrees, `--maxWorkers=2`, the JSON reporter): `aff902eb9` 24 non-passing files; `de29e734d` 26 — the two new were this seat's registers, not behaviour, and each is cured through its own door: `landingFixtureFreshness` (A1·105 moved one aftermath headline in the lf-033 town; re-emitted, 993eba27c) and `tuningRegister` (an unbanked win: institutionLifecycle's two bare 0.5s struck with the odds lines; refrozen, the next commit). Both green on an ordinary run after; no file red at the base went green or changed.

### 8m. CONFIRMED against PLAUSIBLE (the third seat)

**CONFIRMED** (executed here): the base sha; the measure reproduced (4,496 / 23,842) and every before → after count in §8; identical entry ids after every cause (each measured at its commit in a clean worktree); the WY-1 arm's two re-keys and their text-only leaf diffs; every cause but those two leaves the arm byte-identical; the new pins red at their parents; tsc text-equal; the herald golden's move by D·12–13 (and its revert). **PLAUSIBLE:** every new line is a proposal against the law, read against its writer's slots (the printing regions, not every helper line of each file); the reader nouns and condition words are read from the type and archetype ids alone; "came home" / "drove out" are read from the branch names, not the apply paths.

## 9. The fourth seat

**Seat:** SW-12 PULSE-LINES, FOURTH SEAT, an Opus 5.5 build seat, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`), in session `session_01FbPLbduTy8tPCGhoN8q1b4`. **Base:** `lane/style-2-pulse-lines-2026-11-09` at `96efb3b00` (verified with `git rev-parse`; the shared checkout detached there, pushed as a plain fast-forward to the lane). **Charge:** §8k's ledger D rows by file; `heraldFeed.js` D·12–13 as one UNSIGNED herald cause. **The measure, reproduced first** (a fresh scratch harness on the §0 recipe, run in a clean worktree at the base): **4,496 entries, 23,841 printed lines**, `HEALTH: OK (no flags)` — the brief's figures exactly. Every ledger D row is dark in that run (the soak renders NewsEntry alone), so each cause below is measured for NO movement: identical entry ids in identical order and an identical line count, each in a clean worktree at its commit. Every line is a PROPOSAL for the owner's veto; nothing here is signed.

### 9a. `WorldPulsePanel.jsx` (D·18, ·19, ·20, ·22, ·24)

| row | OLD | NEW |
|---|---|---|
| D·18 heading · empty state | `Active Stressors & Echoes` · `No active stressors. The realm is quiet, for now.` | "Troubles now, and troubles remembered" · "No trouble is stirring in the realm just now." |
| D·19 echo summary | `Resolved, not forgotten: this echo still colors new events and can re-ignite while warm.` | "It is over, but people still speak of it, and while the memory is fresh it can flare up again." (the audit's leading `{label}` STRUCK: the card's heading already names it, "{label}, in living memory") |
| D·20 echo chips | `memory {percent}` · `fading` (always) | one banded chip on `memoryStrength`: "memory: fresh" (≥ 0.6) / "memory: fading" (≥ 0.3) / "memory: faint"; the constant "fading" chip struck (it printed "fading" beside a fresh memory) |
| D·22 latest-pulse summary | `{n} drift item(s), {p} proposal(s), {c} candidate(s).` | "{n} change(s) took hold on its/their own, {p} wait(s) for your word, {c} was/were weighed this advance." — the same three counts, each plural agreed in code (no "(s)") |
| D·24 resolved card | `Resolution roll {r%} against {c%} chance.` · pill `time bounded stressor` | "It had a slim / about an even / a good chance to lift this advance, and it did." (banded on `resolutionChance` < 0.35 / < 0.65 / else; the audit's leading "{label} has lifted:" STRUCK, the heading "{label} resolved" says it) · pill "ran its course"; the exact roll stays in Roll Explanations |

Pins: `tests/components/worldPulsePanel.test.jsx` — the old heading and the `memory 34%` chip re-keyed to the new words, and five new assertions (the counts line, the chance line, the pill, the memory band, the echo line) plus two negatives (no "drift item" / "Resolution roll" / "time bounded stressor"; no `memory 34%` / "re-ignite while warm"); **red at the parent** (2 of 8 tests), green here. **Register, through its door:** `proseNumerics` — the debt fell by four (204 → 200: the echo chip's three rows, the roll sentence's one); the baseline re-emitted by the scanner's own walk (a scratch copy of the test's `scanLiveTree`; the parent's re-emission is byte-identical to the committed baseline), every other moved row a pure line move; the ceilings follow it down (137 → 134 floatInterpolation, 50 → 49 percentToken) and the +1 control re-keyed (201 / 135). A first draft named the helper `memoryBand(stressor.memoryStrength)` and the scanner still flagged the float argument; the helper takes the echo instead, so no row was banked.

### 9b. `AdvanceReport.jsx` (D·43–47)

| row | OLD | NEW |
|---|---|---|
| D·43 decree reach | `{n} downstream effect(s) (recorded / inferred cone)` | "{n} thing(s) followed from it (traced / likely)" — the same two fields (`coneSize`, `coneInferred`) |
| D·44 deputy verdict note | `standing read from the record, not decreed` | "worked out from what followed; you did not rule on it" |
| D·45 section heading | `Orders carried out this tick` | "Orders carried out this advance" (every sibling heading already says "advance") |
| D·46 empty state | `… set down what unfolded in the span: the headline, its chapters and threads, the receipts beneath them, …` | "… set down what happened in that time: the headline, its chapters and threads, the events beneath them, …" |
| D·47 footer (two variants) | `This report compresses, never truncates, what unfolded, scaled to the span.` + `Causal links are recorded from the engine's provenance ledger where marked, inferred from shared entities otherwise; click any receipt to find it on the map.` / `Causal links between events are inferred from what they touched; click any receipt …` | "This report shortens a long span but leaves nothing out." + "Where a link is marked, the realm saw one event cause another; the other links are guesses from the places and people the events share. Click any event to find it on the map." / "Links between events are guesses from the places and people they share. Click any event to find it on the map." |

Pins: `advanceReport.test.jsx` (the no-edge footer re-keyed; the decree cluster's reach words, with a one-line `anchored:` marker for the negative; a new empty-state test) and `advanceReportDecrees.test.jsx` (the D·45 heading); **red at the parent** (4 of 19), green here. D·44 has no rendered fixture (the deputy diary's inferred verdicts) and is unpinned: PLAUSIBLE. Registers: none moved (`proseNumerics` re-emission byte-identical).

### 9c. `WorldPulseData.js` (D·29–31; D·28 the label "Faction" left for SW-8)

| row | OLD | NEW |
|---|---|---|
| D·29 npc_action chip | `{dotRankBefore} dot → {dotRankAfter} dot` | "standing rises" / "standing falls" / "standing holds" (on `dotRankAfter` against `dotRankBefore`) |
| D·30 goals · digest chips | `short: {goal}` · `long: {goal}`; `human(scope)`, `human(kind)`, `human(impactKind)`, `human(channelType)` | "wants now: {goal}" · "wants in time: {goal}" (through `humanizeToken`); the digest chips through `humanizeToken`, and `entry.kind` (the lifecycle word "applied" / "queued") struck from the chips |
| D·31 live trouble chips | `resilience {n%}: recovering fast / wallowing / holding (a pillar is missing)` · `cannot lift while blocked` · `human(durationPolicy)` | "recovering fast" / "not recovering" / "holding" · "missing something it needs to recover" (its own chip) · "held in place by another trouble"; the duration-policy chip ("episodic" / "structural" / "transient") struck. **Census strike:** the audit's "held in place by {companion}" (companion = `synergy.companions[0]`) is NOT taken — `companions` lists every co-located trouble, and the synergy records no field saying which one blocks, so the line names none (the "entangled with …" chip beside it already names them) |

Pins: `worldPulseTranslation.test.jsx` (one new test over all three helpers) and `worldPulsePanel.test.jsx` (the siege card's `resilience 31%` / "a pillar is missing" re-keyed to "not recovering" / "missing something it needs to recover", with a negative); **red at the parent** (2 of 13), green here. Registers: none moved (`proseNumerics` re-emission byte-identical: the resilience chip was never in the baseline).

### 9d. `SimulationRulesAxes.jsx` (D·60–63)

| row | OLD | NEW |
|---|---|---|
| D·60 DRIFT_REASON | `Needs Diplomacy: war is a relationship dynamic, so a frozen web cannot raise fronts.` | "Needs Diplomacy: wars start from the ties between settlements, and with Diplomacy off those ties never change." |
| D·61 WAR_DM_DEFERRED | `War by-your-leave arrives with the war-layer rework. Off still lets you narrate wars yourself; the engine just never starts one.` | "War cannot ask your leave yet. With War off you can still narrate wars yourself; the realm simply never starts one." |
| D·62 SEASONS_DM | `The year turns of its own accord. There is no leave to ask of winter.` | "The seasons turn on their own; they cannot wait for your leave." |
| D·63 dm_only option | `The world computes consequences; every new move awaits your word.` | "The world works out what follows; every new move awaits your word." |

Pins: `simulationRulesDialog.test.jsx` — a new describe rendering `DomainRows` (the three reasons read from the chips' titles) and reading the `dm_only` option from `AXES`; **red at the parent** (2 of 8), green here. Registers: none moved. **A twin outside the manifest, not touched:** `src/components/settlements/LivingWorldGates.jsx:76` carries its own `DRIFT_REASON` ("Needs Relationship drift: war is a relationship dynamic, so a frozen web cannot raise fronts.") — not a ledger D file; listed in §9-what-stays for the chair to slot.

### 9e. `HeraldCommandBody.jsx` (D·38–41)

| row | OLD | NEW |
|---|---|---|
| D·38 briefing "Why here" fallback | `No promotion reason was recorded.` | "No reason was given for raising it." (the "Why here" label stays as the skeleton) |
| D·39 quiet briefing | `The realm asks nothing of you just now. No recorded condition has been promoted above the routine record.` | "The realm asks nothing of you just now. Nothing needs your attention ahead of the ordinary news." |
| D·40 story fallbacks | `Deeper provenance is unavailable for this recorded source.` · `{label}. The original route is no longer available.` | "The causes behind this story were not kept." · "{label} can no longer be opened from here." |
| D·41 story pills | `item.temporal.phase` · `item.resolution.state` printed raw | the two closed token sets of `realmItemReadModel.js` (`TemporalPhase`, `ResolutionState`) in words: historical → "past", current → "now", emerging → "rising", planned → "planned"; unresolved → "open", resolved → "settled", dismissed → "set aside", superseded → "overtaken"; an unknown token falls back to `humanizeToken` (the audit's bare `humanizeToken` leaves all eight unchanged — measured — so it would not have cured the row) |

Pins: `heraldCommandBrief.test.jsx` — the quiet briefing (D·39), the lost subject (D·40), a new bare-cause story (D·40), the pills "past" / "settled" with a negative on the raw tokens (D·41); **red at the parent** (4 of 13), green here. D·38's fallback has no fixture (every briefing item carries a reason): PLAUSIBLE. **Not this file's, listed:** the domain writes its own missing-cause reason, `realmItemReadModel.js:375` "No recorded cause receipt is available for this source.", which prints ahead of D·40's fallback on most stories — the same machinery words, outside the manifest.

### 9f. `SimulationRulesDialog.jsx` (D·65 less "Factions", ·66, ·67)

| row | OLD | NEW |
|---|---|---|
| D·65 detail switch labels | `Emergents` · `Stressors` · `Promotion/demotion` | "Surprise events" · "Lasting troubles" · "Towns rise and fall in size" (the label `Factions` left for SW-8; "NPC agency", "Population", "Resources", "Institution lifecycle" PASS as labels) |
| D·66 detail summary | `Propagation, intensity, migration, and the eight subsystem switches.` | "How far events spread, how eventful the realm is, migration, and eight finer switches." (the field labels "Propagation" / "Intensity" stay as the skeleton) |
| D·67 full_simulation preset | `The whole engine: war, faith, trade, and politics act on their own.` | "The whole living world: war, faith, trade, and politics act on their own." |

Pins: `simulationRulesDialog.test.jsx` — one new render test (the preset line, the summary, the three labels behind "Detail toggles", and a negative); **red at the parent** (1 of 9), green here. Registers: none moved.

### 9g. `RelationshipChronicleSection.jsx` (D·70–72)

| row | OLD | NEW |
|---|---|---|
| D·70 row span | `The record runs from {calendar}` / `The record does not date what it holds` | "First noted {calendar}" / "No dates were kept" |
| D·71 undated line · unnamed standing | `at a time the record does not fix` · `a standing the record does not name` | "undated" · "an unnamed standing" (the twin in `NpcTrailSection.jsx:76` is another writer file, cured with its own row, not here) |
| D·72 empty observer | `{name} has come through nothing the record kept. Other settlements have; pick one of them above.` | "Nothing has passed between {name} and its neighbours yet. Other settlements have a history; pick one of them above." |

Pins: `relationshipChronicleSection.test.jsx` — the empty observer re-keyed (D·72); the span "First noted …" with an anchored negative (D·70); **red at the parent** (2 of 9), green here. D·71 has no undated fixture: PLAUSIBLE. Registers: none moved.

### 9h. `HeraldAdjudication.jsx` (D·33–35)

| row | OLD | NEW |
|---|---|---|
| D·33 action receipts | `Dismissed "{h}". The authoritative proposal is recorded as dismissed.` · `"{h}" was not applied. The authoritative proposal is recorded as refused.` · `"{h}" was not applied. An upgrade made this proposal obsolete, so it is recorded as superseded.` · `Applied "{h}". The authoritative proposal is recorded as applied.` | "Dismissed "{h}". It will not happen." · ""{h}" was not carried out: the realm refused it." · ""{h}" was set aside: a newer version of it took its place." · "Applied "{h}". It is now part of the realm's story." (the status word drives the variant as before) |
| D·34 Apply/Dismiss tooltips | `This decision has ambiguous identity and cannot be invoked safely.` · `The canonical decision does not expose this action.` · `The decision action no longer targets this proposal.` | "This decision cannot be told apart from another, so it cannot be taken from here." · "This choice is not offered for this decision." · "This decision has changed since it was raised; close and reopen the desk." |
| D·35 resolved-log tags (two writers, one vocabulary) | `by autoresolve` · `superseded by upgrade` (the pulse log) beside `superseded` (the RealmItem log) | "settled by the realm itself" · "replaced by a newer version" — both writers now say "replaced by a newer version" for a superseded row, and the autoresolved row matches the other writer's "… by the realm itself" |

Pins: `heraldCommandDecisions.test.jsx` — the three receipts and the tombstone tag re-keyed; **red at the parent** (4 of 7), green here. D·34 has no fixture for the three refusals: PLAUSIBLE. Registers: none moved.

### 9i. `WorldMapToolbar.jsx` (D·74–75)

| row | OLD | NEW |
|---|---|---|
| D·74 Undo title (after the lead) | `Restores the pre-pulse world and every settlement. This undo is available for the current session only. The advance cannot be undone after the page reloads.` | "Puts the world and every settlement back as they stood before it. This undo lasts only for this session: after a page reload the advance stays." (the lead "Undo the last realm advance ({interval})." unchanged) |
| D·75 control help | `Advances the living world by the interval you choose above (a week through a year). Each advance runs a pulse whose changes wait for your review.` · `Opens the simulation rules: the dials and engine waves that shape how the realm evolves.` | "Moves the living world forward by the interval you choose above (a week through a year). What needs your word waits in the World Pulse panel." (the old line's no-evidence claim struck: under Full or Routine autonomy most changes do not wait) · "Opens the simulation rules: the settings that decide how the realm changes." |

Pins: `advanceMultiTickToolbar.test.jsx` ("the session-only caveat is preserved verbatim" re-keyed by identity to the new closing sentence, anchored at the title's end) and `mapToolbarControlHelp.test.jsx` (the Undo title; the two help lines, with an anchored negative); **red at the parent** (3 of 9), green here. The help panel's own Undo line ("Available for the current session only; …") is not a ledger D row and stays. Registers: none moved.

### 9j. `RealmDashboard.jsx` (D·83–84)

| row | OLD | NEW |
|---|---|---|
| D·83 conflict delta | `+{n} conflict event(s) this tick` / `Quiet last tick` | "+{n} clash / clashes this advance" / "Quiet last advance" |
| D·84 sphere stat's definition (title) | `A center holding three or more tributary, compelled, or puppet ties forms a sphere, an unnamed empire the topology exhibits. Its name is the DM's to give.` | "A settlement that holds three or more others as tributaries, subjects, or puppets forms a sphere: an empire in all but name. Its name is the DM's to give." (the stat's label and "No hegemony has formed" stay) |

Pins: `realmHub.test.jsx` — the sphere title (D·84) with a negative on "topology", and a new test over the delta's two states (D·83); **red at the parent** (2 of 8), green here. Registers: none moved (the tuning inventory names the file as a dependent only; its walker green).

### 9k. `AutoplacementConsent.jsx` (D·92–93)

| row | OLD | NEW |
|---|---|---|
| D·92 canonized lock | `This realm is canonized. Its settlements have taken their places for good, and the map no longer moves them. A seed is a world, and this one is written.` | "This realm is canonized. Its settlements have taken their places for good, and the map no longer moves them." (the closing aphorism struck: it carries no fact) |
| D·93 re-terrain note | `{label}. {warning} This is a separate decision and this button will not take it for you.` | "{label}. {warning} This button will not do it for you; choose it yourself." |

Pins: `autoplacementConsent.test.jsx` — the lock's last sentence (D·92) and the re-terrain note's close (D·93, re-keyed from `/separate decision/`); **red at the parent** (2 of 10), green here. Registers: none moved.

### 9l. `LiveWarStatus.jsx` (D·5)

| row | OLD | NEW |
|---|---|---|
| D·5 deployment row | `Deployed since tick {sinceTick}; home garrison thinned, war chest bleeding.` | "In the field since {tickCalendarDetailLabel(sinceTick)}. Fewer guards stand at home, and the war is costing {home} its savings." ({home} = `nameFor(nameById, dep.homeId)`, already read for the heading; the audit's `tickCalendarLabel` gives only the season, so the DETAIL label is taken — "week 5 of spring, year 1" — which keeps the week the in-file note said the DM counts forward from) |

**Register, through its door:** the §69.3 prose-leak allowance (`prose-leak-allowance: tick 1`) outlived its site and is struck (the in-file note now says why); `tests/copy/proseLeak.test.js`'s register ceilings follow it down — tick allowances 11 → 10, files carrying one 12 → 11 (measured after: tick 10, week 6, 9 files; the week and file ceilings were already slack and are not this cause's). Pins: a new `tests/components/liveWarStatusWords.test.jsx` (the row's words, and a negative on the raw tick); **red at the parent**, green here.

### 9m. `ChroniclersLetterPanel.jsx` (D·8)

| row | OLD | NEW |
|---|---|---|
| D·8 letter span header | `tick {sinceTick} → {throughTick}` | "{tickCalendarDetailLabel(sinceTick)} to {tickCalendarDetailLabel(throughTick)}" — e.g. "week 3 of spring, year 1 to week 7 of spring, year 1" (the DETAIL label, not the audit's season-level `tickCalendarLabel`: the in-file note called the window the DM's read-floor control, so it keeps the week) |

**Register, through its door:** the §69.3 allowance (`tick 1`) struck with its site; `proseLeak`'s register ceilings fall again — tick 10 → 9, files 11 → 10 (measured after: tick 9, week 6). D·9 (SW-3's line at :118) untouched. Pins: a new `tests/components/chroniclersLetterSpanWords.test.jsx`; **red at the parent**, green here. The letter's own text export (`chroniclersLetter.js`, already calendar-worded) and its golden do not move.
