# FABLE SKEPTIC — the four floors, the twelve code claims, the two wording calls

*2026-09-12. Read-only. Every file:line resolved in the dock at `f2da5a3ee` (`scratchpad/dock-f2da5a3ee`). CONFIRMED = executed or read verbatim at the cited line; PLAUSIBLE = reasoned from code without execution. The dock has no `node_modules` (`immer` missing), so only import-free leaves could be run; where that blocked execution it is said.*

---

## 1. CLAIM TABLE

| # | verdict | evidence (dock file:line) | consequence for the floor |
|---|---|---|---|
| 1 | **CONFIRMED** (first wording false) · **PARTLY** (the ground around the re-cut) | `calamityKernel.js:97-122` `UPGRADE_CHAIN_PAIRS` carries `['Palisade or earthworks','Town walls']`, `['Town walls','City walls and gates']`; `:250-253` `ruin()` stamps `status:'ruined'`; `:259-276` demotes in place, `worldPulseFate:'demoted_by_disaster'`. No tick-driven deterioration of fabric anywhere under `worldPulse/` (grep decay/weather/erode/rot/disrepair over calamityKernel, razingExecution, institutionLifecycle, institutionStatusModel, tierOutcomeApply: none over an institution row). The only clocks: scar HEALING half-lives (`urbanFabricKernel.js:305-312`, `siege_repairs: 260` "patched walls read for ~5y"; decayed at `:644-647`) and FORCE readiness/experience decay through peace (`martialReadiness.js:18-27`). **But a third removal path exists that the note does not name:** the economic-distress CLOSURE streak (`institutionLifecycle.js:792-848`, `requiredStreak: 4`) writes `status:'remnant', _worldPulseInactive:true` (`:1016-1017`), and `isClosableInstitution` (`:562-581`) has no defence exclusion — `Palisade or earthworks` and `Town walls` are `required:false` with no `essential` tag (`institutionalCatalog.js:342-347`, `:874-879`, `:1332-1337`); only `City walls and gates` is `required:true, essential` (`:1910-1915`). `isLiveInstitution` then drops the row (`institutionRoster.js:30`, `:38-42`) | Re-cut floor 4 ("no material DECAY CLOCK") is TRUE. Its rider "no face asserts the permanence of any institution row" is the load-bearing half, and it needs a third named path: **calamity · razing · the purse**. F4-02's "a built wall keeps standing (`:184-187`)" is the GENERATOR's word only; over ticks a village/town wall can be shut by economic distress (PLAUSIBLE — could not execute `isClosableInstitution`; the data flags and the predicate are read verbatim) |
| 2 | **CONFIRMED** | `ageBands.js:52` `HISTORICIZE_BAND = 'years-past'`; the refusal is enforced by its two consumers `causeLifecycle.js:505` and `causeLifecycleVocabulary.js:146` (the pin itself is a constant). Every condition is minted at `duration.elapsedTicks: 0` (`candidateEvents.js:279`, `stressorsCore.js:453`, `factionCompetition.js:842`, `resourceDynamicsKernel.js:897`); `activeConditions.js:876` increments it. ⚠ The table's cite `activeConditions.js:879-902` is the DRIFT, not the mint | Floor 2b sound. One wording nit: "a birth-time STATE carries no elapsed stamp" is true of CONDITIONS; the town itself carries `history.age` (printed) and `inst.foundedAt`, which 2b already carves out — say "no CONDITION" |
| 3 | **CONFIRMED (executed)** | `deityAxes.js:79-83` weights 0.7/0.3, dead band 0.15; `:95-102` strict `>`/`<`. Executed over 9 cells: good×{lawful,neutral,chaotic} → peacelike (−0.50/−0.35/−0.20); neutral×{…} → neutral (−0.15/0/+0.15 — the chaos term's whole range is exactly the dead band, and the comparisons are strict); evil×{…} → warlike (+0.20/+0.35/+0.50). **lawAxis is inert at every position** | ADDENDUM 15 amendment (a) is right on the derived temper. It is WRONG as worded for an authored one — see #4 |
| 4 | **REFUTED** (the E-4 gap) · **RETRO §5.5 CONFIRMED (executed)** | `deitySnapshotFrom` (`deitySnapshot.js:56-68`) spreads `authoredCharacterEmbedKeys(raw)`; `DEITY_AUTHORED_CHARACTER_KEYS` (`deityCommitEmbed.js:54-61`) lists `authoredTemper` first; `commitDeityEmbed` (`:129-`) carries it too. Executed on `{alignmentAxis:'evil', lawAxis:'chaotic', authoredTemper:'peacelike'}`: `deityTemper(deitySnapshotFrom(raw))` → **peacelike**; `deityTemper(commitDeityEmbed(…))` → **peacelike**; restore `deityTemper(deitySnapshotFrom(embed))` → **peacelike**. The adversary read the STALE header at `deityAxes.js:35-42` ("does not carry `authoredTemper` … deliberately NOT taken"), which is false at this commit. Path to the page: embed → `config.primaryDeitySnapshot` → `religionState.js:180` stores the whole snapshot → every reader routes `deityTemper()` (`disposition.js:209`, `relationshipRulesAdversarial.js:557`, `martialReadiness.js:139`, `deityEffects.js:190` → the "warlike creed raises the realm's aggression" line `:106`, `warResolve.js:191`, `pdf/lib/liveWorld.js:214`). ⚠ `projectReligionStateOntoSettlement` (`religionState.js:619-620`) projects name/niche/share/standing/legitimacy only — NO temper — so a faith row reading the projection has no temper at all; temper reaches the page only through `config.primaryDeitySnapshot` readers. "Quick to take offence" exists nowhere in `src/` — the adversary's example was a paraphrase | **CHAIR-NOTE §2.2 E-4(b) must be STRUCK** — it still records the carry gap "for the owner" while RETRO-VALIDATION §5.5 says the finding was wrong; the two documents disagree and the note is the one a successor reads. Amendment (a) must license conduct through **`deityTemper(snapshot)` — authored wins, else derived — as ONE fact**, not "the alignment alone". And table row **F4-12's third clause** ("temper and alignment as two independent choices … the temper is DERIVED from the alignment axes") would refute a TRUE authored pairing (an evil, peacelike creed) — re-word: "derived unless authored" |
| 5 | **CONFIRMED** on substance; line cites exact | `religionState.js:53` `STANDING_HYSTERESIS: 4`; `standingFor` `:150-154`. Replicated in node: share 28 → `ascendant` from ascendant, `established` from cult; share 13 → `established` from ascendant, `cult` from cult. `suppressDeity` `:271`, the write `:276` `{ suppressed: true, share: 0, standing: 'cult' }` verbatim; `pruneSuppressed` `:431-443` (`KEEP = 3`, `dropped = order.slice(KEEP)`). `:180` `share: 100, standing: 'ascendant'` (patron-only seed). ⚠ `:225` is the DM RE-ASSIGN path at `dominantShare = max(60, others+10)`, not 100; with imposed cults (`:201`, renorm `:207-210`) the patron is <100 at birth. `shareBandLabel(100)` = `'nearly the whole town'` (`faithPanelModel.js:60-62`, ≥75). `tenure: 0` at birth and never projected (`:619-620`) | P-10 and E-6 hold. Wording: "ascendant on every seed path; at share 100 only when no cult is imposed". F2-02's tenure ground holds |
| 6 | **CONFIRMED** | `economicGates.military` writers in all of `src/`: `defenseGenerator.js:467-468` (origin, conditional on `hasAnyDefense`) and `:647-650` (re-spread of the same object plus `disaster`); `holderTable.js:195` is a read-cite. `generateDefenseProfile` has ONE caller, `steps/assembleSettlement.js:199`. Under `worldPulse/`: zero `economicGates` writers — `foodStockpile.js:470-475` rewrites `defenseProfile` but touches only `scores.disaster`. `config.monsterThreat` under `worldPulse/`: reads `stressorGates.js:438`, `:639`; zero writes. `safetyLabel`: zero mentions under `worldPulse/`; `generateSafetyProfile` is called only at generation (`servicesGenerator.js:285`, `economy/economicState.js:53`); every `worldPulse` spread of `economicState` is foodSecurity / prosperity / treasury / inputStockpiles / activeChains, never `safetyProfile`. Bonus: no `worldPulse` writer of `scores.military` either | P-1, P-2, P-8 hold exactly as stated. The WALLED-STRAINED key's gate AND its score are both birth-frozen |
| 7 | **CONFIRMED** | `foodStockpile.js:389-400` verbatim: "the 'Disasters & Famine' row stays frozen at the generation value while a siege eats the granary" — the writeback `nextDisaster = round(resilience × gate)` | The engine's own precedent that gate staleness is a bug — the residual-risk-three argument is the engine's, not the chair's |
| 8 | **CONFIRMED** — and understated | `dmFieldProjection.js:85-94` eight blocks (DS-GEN-5/6/9/11, DS-REL-2, DS-DEF-1, DS-DEF-3, DS-ECO-6). Defense blocks: eleven (`defense.generated.js` titles DS-DEF-1…11). `stateProseKernel.js:10-11` "nothing here is persisted". `WorkbenchProseEditor.jsx:2` "(R-2, flag-off)". ⚠ The register lists DM FIELDS the machine sentence projects BESIDE: `projectBesideDmField` "RETURNS the DM's string by identity and offers the machine line as a SEPARATE, adjacent field. There is no third shape" (`:18-20`) | Nine of eleven is the count of blocks with an adjacent editable field. The count of composed defense FACES a GM can edit, replace or suppress is **zero of eleven**. Residual risk one is understated |
| 9 | **PARTLY** | `npcGenerator.js:1511-1518`: `'Guard Captain'` at village, town, city; **metropolis emits `'City Watch Chief'`**, not a Guard Captain. A stress list's second Guard Captain is deduped against the tier's (`:1541-1543`) → exactly one where present. `personality` `:135-141`, `secret` `:149` CONFIRMED; `disposition` rides `pickTitle` (`:687-693`) — its attach to the record not traced (PLAUSIBLE) | F3-06's rider is sound; "village-plus" should read "village/town/city (Guard Captain), metropolis (City Watch Chief)" so a refuter on a metropolis does not look for the wrong office |
| 10 | **PARTLY**, one roster **REFUTED** | (a) `priorityHelpers.js:41-79` and `DEFENSE_BUCKET_KEYWORDS` (`defenseInstitutionBuckets.js:83-109`) are closed substring lists over `nativeSemanticName` — which returns `''` for materialized custom content (`customContentSemanticAuthority.js:41-48`, `:22-30`). A GM-authored wall or watch is INVISIBLE to `hasWalls` and every bucket while rendering on the dossier's own roster (`OverviewTab.jsx` reads custom content) — PLAUSIBLE, not rendered. (b) Non-corpus producers print bodies outside the lists: `threatAssessment.js:59` "Palisade and citizen militia" on `hasWalls && hasMilitia` whatever the wall grade; `:66` "The palisade creates a chokepoint" on any wall; `:59` "Watch rotations are thin" with no watch consulted; `:57` "the garrison handles everything" — CONFIRMED read. (c) **The NPC office roster is NOT closed**: `institutionTable.js:370-373` "THE COLUMN IS OPEN AND STAYS OPEN. The structural NPC roster is a SAMPLE" — and the table's own §"no longer a finding" (the W22 strike) quotes exactly that. (d) faction list / faith entries: closed as lists; suppressed faiths are pruned (`:431-443`) so a vanished creed leaves no record — PLAUSIBLE | Floor 1 names FIVE closed worlds; one of them the engine and the fold both call open. The four that are closed are closed to the KEYS, not to the PAGE: custom rows and hardcoded producer strings print bodies the lists never see |
| 11 | **REFUTED on the count**; the finding is STRONGER than written | Executed: `CULTURE_PROFILE_KEYS.length` = **11** (germanic, latin, celtic, arabic, norse, slavic, east_asian, mesoamerican, south_asian, steppe, greek). `mixed` is a resolver token (`cultureProfiles.js:539-544`), `mediterranean` an alias to latin (`:527-529`). Each profile carries a **`defensePattern`** field (executed key list), rendered on the PDF at `pdf/sections/IdentityDailyLife.jsx:283` `['Defense', culture.defensePattern]`, typed at `settlement.schema.js:92`; `dailyLifeLogic.js:14` reads `socialTexture`; `ViabilityTab.jsx:190` prints `generationReceipt.cultureProfile`. No defense pool reads the profile (`defenseStateProse.js` names culture once, in a measurement comment `:1673`) | F3-05 stands and is stronger: the collision is not only furniture — the dossier prints the culture's OWN "Defense" line beside a defense tab that never read it. Fix the count |
| 12 | **CONFIRMED** | `defenseDisplay.js:185` `(r.institutions \|\| [])` raw; `liveInstitutions` (`institutionRoster.js:53-56`) exists and filters `ruined/removed/destroyed/remnant` (`:30`). `DefenseTab.jsx:217` and `pdf/lib/viewModelBodySlices.js:152` both call the raw one | DS-DEF-4 and its card are jointly ruin-blind, as §2.5 item 4 says. A wiring row, not a floor |

---

## 2. THE FLOORS

**FLOOR 1 — UNSOUND-AS-WORDED, two fixes.**
(i) Strike "the NPC office roster" from the five closed worlds; the engine's own comment and the fold's own W22 strike say the column is open. The only closed part is the tier's SINGULAR offices, which F3-06 already covers — say that.
(ii) "Closed world" is a property of the KEYS' view, not the DOSSIER's. Re-word: *"Four rosters are closed to every pool key. A refuter checks the PRINTED roster and the tab's other producers, not the flags: a custom-content row is record for floor 1 and invisible to every key, and a hardcoded producer string is engine PROSE, not record (a wiring row)."* The last sentence (the preimage quantifier) — see ruling 2; as worded it is not decidable.

**FLOOR 2 — SOUND, two nits.**
2a and 2b are grammar-decidable as claimed. Withdraw one of 2b's own examples: *"the market sits on the seventh"* is a calendar anchor on the committed 4-4-5 calendar (`ageBands.js:3-7`) — a DATE under 2a/F2-02, not a plain habitual. And "a birth-time STATE carries no elapsed stamp" → "no CONDITION carries one"; the town's `history.age` and `inst.foundedAt` are the record's own elapsed readings and 2b's last sentence already says how to speak them.

**FLOOR 3 — SOUND as amended, four corrections to the amendment.**
(a) ADDENDUM 15 (a) must license conduct through `deityTemper(snapshot)` — authored wins, else derived — as ONE fact, not "the alignment alone": an authored peacelike on an evil creed is lawful and the engine acts on it. (b) Strike E-4(b) from CHAIR-NOTE §2.2; RETRO §5.5 already says the finding was wrong and the note still carries it. (c) Re-word F4-12's third clause "derived UNLESS authored", or it refutes a true sentence. (d) Eleven profiles, not twelve, and the profile's own `defensePattern` line prints on the PDF.

**FLOOR 4 — SOUND as re-cut, one rider.**
"No material DECAY CLOCK" is true. The rider "no face asserts the permanence of any institution row" must name THREE removal paths, not two: calamity (the annual seeded draw), razing (war), and **the purse** — an economic-distress streak closes `Palisade or earthworks` and `Town walls` (`required:false`) to `remnant`; only `City walls and gates` is exempt. So *"the wall stands whatever the purse does"* is a floor-4 finding on a village or town. And scope the floor to FABRIC: forces DO carry a decay clock (`martialReadiness` readiness and experience decay through peace), so "the drill has gone slack" is model-true-able while "the timber has rotted" is not.

---

## 3. RULINGS

**Floor 2b — SIGN the chair's cut, narrowed once.** Mechanism (CONFIRMED): the composer's seed is `String(r._seed ?? r.id)` (`DefenseTab.jsx:95` and seven siblings) — no tick — and `drawVariant` (`stateProseKernel.js:395-398`) is a pure function of seed, block and pool key; DS-DEF-2's keys are `standingDefenseForces().present` booleans (`defenseStateProse.js:623-656`) and none reads `config.stressTypes`. A plain habitual asserts a STANDING CONDITION, which is exactly what a presence boolean holds; when the key flips the pool changes and the face is gone with it. A rate asserts a distribution over ticks the engine never samples — and "most nights" is a MAGNITUDE, so the rate ban is a 2a consequence anyway. **What flips me:** the moment any pool key reads a per-tick LIVE field (a score, a stressor) instead of a presence or a band, the habitual on THAT pool must go — the next tick can falsify it while the seed holds the face. Ban it per pool then, never globally.

**Floor 1's quantifier — decidable in principle, not with today's instruments; one cheap artifact fixes it.** The key functions are pure and total over small finite domains (DS-DEF-2's beasts key is 3×2×2 = 12 cells), so a key's preimage is enumerable. But "no state in the preimage" is ill-posed: the preimage is over the KEY's inputs, and a face can contradict a field the key never reads (the badge, the safety label, a custom row). The cheapest enforceable form: the census already iterates `row.reads` (`wiring-census.mjs:475`, `:550`); add per pool a SAME-PAGE READ SET (the union of reads of every producer `dossierMounts.js` mounts on that tab, corpus or not) and ask the refuter one mechanical question — *does the face predicate anything on a field in SAME-PAGE minus KEY-READS?* If yes, the key cannot hold it fixed and it is a floor-1 exposure. Re-word the sentence: *"a face is lawful iff no field in its tab's same-page read set, at any value the keys admit, denies it."*

---

## 4. THE RESIDUAL RISK

**One (a wrong hook cannot be edited out) — holds, and is UNDERSTATED.** The register is of fields the machine sentence projects BESIDE; the composed face itself is editable on zero of eleven defense blocks, not two.

**Two (floor 1 is a page property, the refuter reads one pool) — holds.** And the instrument gap includes the fold's own record: F4-12 would refute a true authored pairing, floor 1 names an open roster as closed, and custom content is record on the page and invisible to every key.

**Three (written once at tick 0, rendered forever) — holds, CONFIRMED at the mechanism:** seed without tick; zero `worldPulse` writers of the military gate, of `monsterThreat`, of `safetyLabel`, or of `scores.military`. Add: E-10's "walls do not decay on their own" is true but incomplete — the purse can shut a village/town wall over ticks, so a face keyed WALLED can become UNWALLED without any calamity, and the chronicle will not say why.

**Missed by the chair:** (4) CHAIR-NOTE §2.2 E-4(b) and RETRO §5.5 contradict each other, and the note is what a successor reads — a wrong paid-surface bug is still queued for the owner. (5) `deityAxes.js:35-42` is a code comment that decayed exactly as P-8 says claims decay; it will trap the next refuter too, and it lives in the dock every citation resolves against. (6) The culture count is eleven, and the profile's `defensePattern` is already a same-dossier "Defense" line. (7) One of floor 2b's own kept examples ("on the seventh") is a date.

---

## 5. THE ONE THING

The floors are sound; the RECORD around them is where the errors are — two of twelve code claims are wrong in the fold's favour (the culture count, the authored temper), floor 1 names an open roster as closed, and one table row (F4-12) would refute a true sentence. Correct the table and the chair-note before DEF-2 restarts; the floors themselves need only the riders above.

---

## APPENDIX — executed receipts (verbatim)

```
--- deriveTemper over 9 alignment x law combos
good     lawful   score  -0.500 -> peacelike
good     neutral  score  -0.350 -> peacelike
good     chaotic  score  -0.200 -> peacelike
neutral  lawful   score  -0.150 -> neutral
neutral  neutral  score   0.000 -> neutral
neutral  chaotic  score   0.150 -> neutral
evil     lawful   score   0.200 -> warlike
evil     neutral  score   0.350 -> warlike
evil     chaotic  score   0.500 -> warlike
--- deityTemper with authoredTemper on evil/chaotic
peacelike
warlike

KEYS [ 'authoredTemper', 'characterAxes', 'boonChannel', 'boonStrength', 'baneChannel', 'baneStrength' ]
snapshotFrom -> {"name":"Gorth","alignmentAxis":"evil","temperamentAxis":"warlike","rankAxis":"greater","lawAxis":"chaotic","authoredTemper":"peacelike"}
deityTemper(snapshotFrom) -> peacelike
commitDeityEmbed -> {"_deityRef":"d1","name":"Gorth","alignmentAxis":"evil","temperamentAxis":"warlike","rankAxis":"greater","lawAxis":"chaotic","authoredTemper":"peacelike"}
deityTemper(embed) -> peacelike
deityTemper(snapshotFrom(embed)) restore -> peacelike

--- standingFor by path (replicated from religionState.js:150-154, E=15 A=30 H=4)
share 28 from ascendant -> ascendant | from cult -> established
share 13 from ascendant -> established | from cult -> cult

--- culture profile count
11 germanic, latin, celtic, arabic, norse, slavic, east_asian, mesoamerican, south_asian, steppe, greek
key, label, scope, builtForm, civicPattern, exchangePattern, foodways, sacredLife, defensePattern, socialTexture, architecturalDetails, institutionBias

--- isClosableInstitution: NOT EXECUTED (dock has no node_modules: "Cannot find package 'immer'");
    verdict on wall closability is from institutionalCatalog.js required/tags flags + the predicate read at institutionLifecycle.js:562-581 (PLAUSIBLE)
```
