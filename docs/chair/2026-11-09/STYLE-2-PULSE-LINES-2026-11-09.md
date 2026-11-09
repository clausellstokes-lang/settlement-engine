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

Struck: "council" (no office held), "took money on the side" / "money" (the family is not keyed), "whoever paid for it" (a compromise need not have a payer); "he/his" never written (they/them). A2·34/36/39's lower-case-lead DEFECT (FIX-PULSE-DEFECTS' C3 rows) is gone with these lines — messaged to the chair as a STOP with the default that FIX-PULSE-DEFECTS skips those three lines. The re-adjudicate receipts (dark, pinned verbatim by existing tests) are untouched.

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

**Ledger D, the map's words (69 REWRITE rows; its 3 labels SW-8's; D·1 and the kind pill D·79 are NewsEntry's, SW-11's):** not reached.

## 5. Gates at the tip

Per cause, the writer's own suites, `proseNumerics`, `couplingInclusion`, `newsSubjectVocabulary` and `modeSpeedsWy1` green (listed in each commit body); eslint clean on every touched file; `tsc --noEmit` adds no error. The three record walkers and the full-suite comparison are recorded in the hand-back message.

## 6. CONFIRMED against PLAUSIBLE

**CONFIRMED** (executed here): the base sha; the measure (4,496 / 24,209) and every before → after count above; identical entry ids after every cause; the WY-1 arm's per-cause hashes and their text-only leaf diffs; the reds named at the base. **PLAUSIBLE:** every new line is a proposal against the law, read against its writer's slots by this seat — not a measured reader outcome; the per-type birth signs are inferences from the crisis type alone, flagged for the owner's veto.
