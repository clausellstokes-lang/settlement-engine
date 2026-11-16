# BAR6-AUDIT-F · LAW 10 · STORY LINES DRAWN TOGETHER · HAND-BACK

Seat F of BAR6-AUDIT (mechanism M3, kinds K6 and K8). Tip read: `lane/join-2026-11-14` at **600b7683a**. This branch (`lane/bar6-audit-f-2026-11-16`) merges `lane/bar5-audit-a-2026-11-16` (c0ea05497) and `lane/bar5-audit-b-2026-11-16` (d40d6ab28), once. NOTHING IS CURED: no line under `src/` changes, no test file is added, and no file of another seat or of an earlier auditor is touched (the readers `page.mjs`, `pageB.mjs`, `law1.mjs`–`law4.mjs` and `law5-inventory.mjs` are read, never edited; nothing needed mending in them).

FILES OF THIS SEAT
- `tests/helpers/pageLaws/law10.mjs`: the detector, eight pair rules (`law10a` … `law10h`), pure, `{ record, tabs, town }` → `{ law, rule, town, tab, line, against, why }`.
- `docs/chair/2026-11-16/bar6/AUDIT/runF.mjs`: THE RUNNER FOR THE CHAIR, over any PAGE-COPY render: `node docs/chair/2026-11-16/bar6/AUDIT/runF.mjs <render-dir> <out.json> [<final221.json> [<final72.json>]]`. It prints the counts by rule (towns, instances, distinct lines; printed vs record only), the 10h label census, and with the evidence files the controls (`controlsF.json`). It exits non-zero if a detector throws.
- `sampleF.mjs` (the seeded precision draw), `tablesF.mjs` (the tables), `ref525-F.mjs` (the 525 reference configurations).
- `tablesF/`: `F.150.json`, `F.720.json`, `F.300.json` (every instance; the thirty commonest distinct lines of every rule with their towns, per population), `F.*.log.txt` (the runner's own print), `TABLES-F.md` (counts by rule and population, the writer files, the 720's top lines), `PRECISION-F.720.seed1016.md` and `PRECISION-F.720.seed1017.md` (the draws, judged), `F.ref525.json`.

Renders: PAGE-COPY (`docs/chair/2026-11-16/probes/PAGE-COPY`, `census3.sh --count-only`) at 600b7683a in a scratch worktree with its own `npm ci`: the 150 wide-read towns (`bar0-<shape>-rand-27..41`), the census's 720 (`seeds.txt`) and the fresh 300 (`packets11/seeds.fresh300.txt`), all born and rendered without error.

THE RULES, AS COUNTED (and four forms reported apart, never as law: `10e-temper-manner`, `10f-backs-wide`, `10g-legacy-answer`, `10g-legacy-ruin`)
- **10a** a head (rank 1 of a power) whose hidden allegiance is the power he heads: every line that prints it ("Head · … · answers to P", "The head of P answers to P.", his card's "Hidden allegiance answers to P").
- **10b** a gendered pronoun in a hook, a tie or a secret bound to a definite role ("the commander") whose every roster holder (narrowed by the hook's own qualifier, "garrison") is of the other sex; roster names struck first ("Fujio He"); a person's own secret never makes its owner the antecedent.
- **10c** a printed title ("Connection: <Title> <Name>", the person's card title line) that is another person's roster title, and no looser name for the person's own.
- **10d-seat** a tie's "has asked for a seat on the council" whose asker sits, unveiled, on the governing power. **10d-purse** "the treasury borrowed … every year since" on a page that prints a yearly surplus.
- **10e-temper** "incorruptible" against a secret of being paid to betray a duty; **10e-temper-honest** "honest" or "plain-dealing" against a lie or a forgery of the person's own. **10e-house** a secret of drawn pay against "Nobody is paid". **10e-pay** "well paid" forces against a line that their own pay is cut.
- **10f-kind** a governing religious power given a secular council's description; **10f-tier** a power's card naming a tier two steps off, or the market-day traders' blurb in a city or a metropolis; **10f-weight** "X have more say" where X weighs no more than the card's own power; **10f-backs** the ruler's own seat (a Government house, or its connection heads the ruler) backing the ruler and the ruler's rival in a high quarrel.
- **10g-span** one event (one template) told twice on the History tab with two lengths; **10g-legacy** "Much of what stands … was built after the X" where X destroyed nothing (not a fire, a siege, a war, a raid, a flood, a plague or an occupation; a crash or a trade collapse is apart).
- **10h** a roster label with a slash or a bracket (`PROSE_FORMS`) inside a prose sentence or beside a verb or a possessive.

## 1 · THE CONTROLS

Every control of LAW 10 in the wide read's 221 (`review-wide-6/SECOND-CHECK.final221.json`): run on the 150 at 600b7683a (`tablesF/F.150.log`). A rule is counted only because every STANDS control of it is found and no EXPLAINED control is.

| id | verdict | rule | found | the line |
|---|---|---|---|---|
| C179090 | STANDS | 10a | FOUND | Head · Sabir al-Ghazali, the council's fixer · answers to Corrupt Council through Rania al-Basri |
| C179117 | STANDS | 10a | FOUND | The head of Corrupt Council answers to Corrupt Council. |
| C179288 | STANDS | 10a | FOUND | Hidden allegiance answers to Corrupt Council, through Rania al-Basri (his own card) |
| C130353 | STANDS | 10b | FOUND | The garrison chaplain and the commander are the same man. |
| C130354 | STANDS | 10b | FOUND | He's authorizing military action … (the same hook's second sentence; one printed line) |
| C75413 | EXPLAINED | – | none (correct) | Secret: Prints whatever pays, including lies about a rival merchant that ruined him |
| C196525 | STANDS | 10c | FOUND | Connection: Wharfinger Madhuri Rao |
| C66115 | STANDS | 10d-seat | FOUND | Tlachtga O'Meara has asked for a seat on the council as a condition of the next loan. |
| C66113 | STANDS | 10d-purse | FOUND | Clíodhna O'Dwyer's treasury borrowed … and has borrowed every year since. |
| C31450 | STANDS | 10e-temper | FOUND | Temperament: incorruptible (against "… has been paid to lose it") |
| C200774 | STANDS | 10e-house | FOUND | Secret: Keeps the night roster short and draws pay for names that never walk it |
| C51048 | STANDS | 10e-pay | FOUND | The garrison and city watch are well paid, well equipped and patrol properly. |
| C121364 | STANDS | 10f-kind | FOUND | A grand council of senior officials, guild masters, and appointed magnates governs the metropolis … |
| C128237 | STANDS | 10f-tier | FOUND | A small group of traders who come on market days … |
| C110252 | STANDS | 10f-weight | FOUND | The merchant guilds now have more say: the noble families keep their titles … |
| C102099 | STANDS | 10f-backs | FOUND | Backs · Craft Guilds · Grand Guild Consortium |
| C133674 | STANDS | 10g-span | FOUND | For 2 seasons a sickness worked through the settlement … |
| C55011 | STANDS | 10g-legacy | FOUND | Much of what stands in Kaltenturm now was built after the economic divide … |
| C24588 | EXPLAINED | – | none (correct) | The siege left a legacy of trouble in Haian … a generation old. |
| C181033 | EXPLAINED | – | none (correct) | A previous occupation ended, but collaborators and resisters … |
| C184829 | EXPLAINED | – | none (correct) | An occupation had ended years before … |
| C1980 | STANDS | 10h | FOUND | Military/Guard has posted guards on what it says is its own … |
| C76763 | STANDS | 10h | FOUND | A ruling on … went Military/Guard's way … |

23 of 23: 19 STANDS found, 4 EXPLAINED untouched. (The 221 holds no WEAK row of these kinds.)

THE BAR'S LAST READ (`review-bar-5/SECOND-CHECK.final72.json`, thirty towns `rand-24` to `rand-26`): those towns are not in my renders, so its rows are not run here. Its rows of my kinds and where they belong: C30295 (a hook's patron against the house card "Nobody named them to it") and C2000 (a secret's "three weeks ago" against a siege in its second week) are LAW 4's `4n-patron` and `4n-weeks` (seat A's `law4.mjs`) and BAR5-THINGS's facts (c) and (b); C33631 (a card's "meaningful civic influence" under Suppressed), C35627 (a position line against "Standing marginal") and C43925 (a military card sized for the tier) are LAW 1's 1c and 1d (seat A) and BAR5-POWERS's facts (a), (b) and (c). LAW 10 does not count them again.

## 2 · THE COUNTS

Towns / instances / distinct lines (`TABLES-F.md`; each population's thirty commonest distinct lines with their towns in its json):

| rule | the 150 | the 720 | the fresh 300 | wrote the false line | holds the fact it should have read |
|---|---|---|---|---|---|
| 10a | 1 / 3 / 3 | 0 | 1 / 3 / 3 | `src/domain/people/allegiance.js` | `npcs[].memberships` (`castPowers.js :: rankPowers`) |
| 10b | 1 / 1 / 1 | 2 / 2 / 1 | 4 / 4 / 1 | `src/generators/safetyProfile.js` | the roster's sex |
| 10c | 7 / 14 / 8 | 36 / 72 / 37 | 11 / 22 / 13 | `src/data/faceHonorifics.js` | the roster's titles |
| 10d-seat | 2 / 2 / 2 | 6 / 6 / 6 | 2 / 2 / 2 | `src/data/npcData.js` | `npcs[].memberships` |
| 10d-purse | 1 / 1 / 1 | 2 / 2 / 2 | 0 | `src/data/npcData.js` | DS-ECO-8 (the prosperity band) |
| 10e-temper | 4 / 4 / 3 | 15 / 15 / 10 | 12 / 13 / 9 | `src/data/stressInstitutionEffects.js`, `src/data/people/titleSecretsPresentations.js` | `npcs[].personality.dominant` |
| 10e-temper-honest | 4 / 4 / 4 | 11 / 11 / 8 | 8 / 8 / 5 | the same | the same |
| 10e-house | 2 / 2 / 1 | 0 | 0 | `src/data/people/titleSecretsPresentations.js` | `src/domain/facts/guardPay.js` |
| 10e-pay | 1 / 1 / 1 | 0 | 0 | `src/generators/safetyProfile.js` | `guardPay.js`, the commander's constraint |
| 10f-kind | 3 / 3 / 2 | 8 / 8 / 2 | 0 | `src/generators/power/rulingStructure.js` | the governing category |
| 10f-tier | 1 / 1 / 1 | 2 / 2 / 1 | 1 / 1 / 1 | `src/generators/power/rulingStructure.js` | `record.tier` |
| 10f-weight | 1 / 1 / 1 | 1 / 1 / 1 | 0 | `src/generators/power/factionStanding.js` | the named power's weight |
| 10f-backs | 5 / 5 / 4 | 28 / 28 / 10 | 15 / 15 / 7 | `src/domain/dossier/powerSupport.js` | `powerStructure.conflicts` |
| 10g-span | 1 / 1 / 1 | 0 | 0 | `src/generators/historyTemplate.js` | the event's own duration |
| 10g-legacy | 6 / 6 / 6 | 24 / 24 / 24 | 6 / 6 / 6 | `src/data/dossierStateProse/general.generated.js` (DS-GEN-16) | the calamity's type |
| 10h | 2 / 2 / 2 | 5 / 5 / 5 | 4 / 4 / 4 | `src/domain/dossier/hookLines.js` (4 of the 720's 5); `src/generators/narrativeText.js` (1: the Overview's `r.topFaction`) | `src/data/people/powerSentenceName.js` |
| **LAW 10 (the rules above)** | **29 towns · 51 · 41** | **122 towns · 176 · 107** | **56 towns · 78 · 51** | | |
| apart: 10e-temper-manner | 5 / 5 / 3 | 14 / 14 / 11 | 8 / 8 / 8 | | |
| apart: 10f-backs-wide | 20 / 37 / 35 | 115 / 195 / 112 | 45 / 87 / 62 | | |
| apart: 10g-legacy-answer · -ruin | 1 · 0 | 4 · 6 | 1 · 3 | | |

Every instance of the law is printed on a dossier tab (record only: 0). The commonest lines of the 720 (the rest in `TABLES-F.md`): 10c "Wharfinger" (the harbour master's own card title) in 36 towns, and "Connection: Wharfinger <the harbour master>" in each of them; 10f-backs "Backs · Craft Guilds · Grand Guild Consortium" in 8, "Backs · Merchant Guilds · Merchant oligarchy" in 5, "Backs · Merchant Guild Council · Merchant Guilds" in 4; 10e-temper the incorruptible temperament line (with or without a flaw beside it) in 15; 10b the one crusader hook ("The garrison chaplain and the commander are the same man. He's authorizing …") in every town it prints in; 10g-legacy one line a town (24 distinct: "Much of what stands in <town> now was built after the economic divide / the shortage / the guild war / the succession crisis / the purge …").

10h CENSUS (every label a template can print as a name): `PROSE_FORMS` (`src/data/people/powerSentenceName.js`) holds six: Military/Guard (prose form "The Guard"), Monster Hunters / Adventurers, Noble Claimant (Senior Line), Noble Claimant (Reform Line), Third Bloc (Neutrals), Crown Creditors (Noble Coalition). In the 720, Military/Guard is held by 248 towns and prints as a row or a chip on 3,208 lines; inside a sentence on 5: four plot hooks drawn by `hookLines.js :: hookPartyOf` from the raw conflict party, one Overview line of `narrativeText.js` ("The last thing ${r.topFaction} and its rivals agreed on …"); its plain name "The Guard" is printed on every one of the 248 pages (`powerSentenceName` serves `conflicts.js` and the Institutions tab already). The five bracket labels hold 9 towns and print in no sentence.

## 3 · PRECISION

Twenty instances of each rule drawn from the 720 (seed 1016, `sampleF.mjs`), each judged as the second check judges (`PRECISION-F.720.seed1016.md`, every verdict on its row). Rules under seventeen in twenty were narrowed, counted again and drawn again (seed 1017, `PRECISION-F.720.seed1017.md`). A rule with twenty or fewer instances is judged whole.

| rule | first draw (seed 1016) | what was off | narrowed to | second draw (seed 1017) |
|---|---|---|---|---|
| 10b | 2 / 2 STANDS | (in the 300, "Fujio He" read as a pronoun: names are now struck) | | 2 / 2; the 300's 4 / 4 |
| 10c | 20 / 20 STANDS (of 72) | | | |
| 10d (one rule then) | 8 / 19 | the purse side: "the treasury will not cover" an interest bill, a debt of "two years of taxes", "money in hand" at a crisis's start: 11 WEAK | 10d-seat (the 6 seat rows: 6 / 6) and 10d-purse (yearly borrowing against a YEARLY surplus only) | 10d-seat 6 / 6 · 10d-purse 2 / 2 |
| 10e-temper | 15 / 19 | a rigged table ("the people who win big are paid to play") ×3 and a person who paid others ("the family was paid to say") ×1: WEAK | the two phrases struck | 15 / 15 |
| 10e-temper-honest (with candid, forthright) | 8 / 20 | "candid" and "forthright" are words of manner, not of truth: 12 WEAK | "honest" and "plain-dealing" only (the other two apart: 10e-temper-manner) | 11 / 11 |
| 10e-pay | 0 / 1 | "unpaid wages" of an old commission is no pay of the watch: EXPLAINED | the forces' own pay only | 0 in the 720; the 150's 1 / 1 is the control C51048 |
| 10f-backs | 20 / 20 STANDS (of 28) | | | |
| 10f-backs-wide | 0 / 20 | a trade house of many members may lean to both sides of a quarrel: WEAK | apart, never law | |
| 10f-kind | 8 / 8 STANDS | | | |
| 10f-tier | 2 / 2 STANDS | | | |
| 10f-weight | 1 / 5 | a "Suppressed" label on the power named is no proof it weighs less (the clergy and the arcane orders did weigh more): 4 EXPLAINED | weights only | 1 / 1 |
| 10g-legacy | 16 / 20 | a crash or a trade collapse: ruin after which rebuilding is plausible: 4 WEAK | those two templates apart (10g-legacy-ruin) | 20 / 20 (of 24) |
| 10g-legacy-answer | 0 / 4 | "what the town built in answer" may be an institution: WEAK | apart, never law | |
| 10h | 4 / 4 STANDS | ("Military/Guard and its rivals agreed …" found by the census, missed: the rule now reads any prose sentence) | | 5 / 5 |

Rules with NO instance in the 720, judged whole where they print: 10a (the 150's 3 = the controls; the 300's 3, bar0-town-occupied-rand-106, the same shape: STANDS), 10e-house (the 150's 2: the control C200774 and bar0-village-calm-rand-34, the same secret under its own watch's card "A rota of unpaid householders who walk the lanes by night …": STANDS), 10g-span (the control only). As counted, every rule of the law holds at or above seventeen in twenty on its last draw.


## 4 · THE CURE'S FORM, BY RULE (proposed, not made)

Where each side is drawn (traced at 600b7683a; the pipeline's order is `src/generators/steps/index.js`: generateEconomy → generatePower → generatePopulation → generateNarratives → assembleSettlement, and inside assembleSettlement's `generateCoherence` (`narrativeGenerator.js`): the secret overlay, `landMemberships`, `dealAllegiances`, `rankPowers`, `assignHandlers`, then `drawTies`, `dealGoals`). "Moves the record" means an exclusion at the draw; "display only" a reading at print. THE 525 REFERENCE CONFIGURATIONS (`tests/helpers/goldenMasterCorpus.js`, born as the golden master births them, `ref525-F.mjs`, `tablesF/F.ref525.json`): the count of configurations that HOLD the rule's condition, the floor of what an exclusion at the draw moves (a re-draw that consumes the shared stream can move more; a reading at print moves none).

| rule | THE ONE FACT | the later draw: file, step | can it read the earlier one there? | the cure's form | record fields it moves | 525 holding it |
|---|---|---|---|---|---|---|
| 10a | an agent never answers to a power whose seat (rank 1) it holds | `src/domain/people/allegiance.js :: dealAllegiances` (`allegiancePowerFor`: the house face's largest criminal-power membership, a governing criminal power included); ranks come AFTER, from `rankPowers` (`generators/people/castPowers.js`) | the memberships have landed; the ranks have not (dealAllegiances runs before rankPowers) | exclusion: dealAllegiances skips a power the card sits on and `rankPowers` never seats an allegiance's agent at rank 1 of that power (or dealAllegiances moves after rankPowers) | `npcs[].allegiance`, its handler (`assignHandlers`), the hall-capture lines (`hallCapture.js`) | 0 |
| 10b | a hook's pronoun is its holder's sex | `src/generators/safetyProfile.js :: generateSafetyProfile` (the crusader hook), at generateEconomy, before any person is born | no: no person exists at that step | the pool's line says it without a sex ("the same person", "They are"), or the hook carries the holder's slot and prints the pronoun from the roster (the render token `⟦pronoun:id|he⟧` of `lib/entityRefTokenizer.js` exists and no generator emits it) | the neutral line: `economicState.safetyProfile.plotHooks` where the hook is drawn; the slot: display only | 0 |
| 10c | a face's honorific is never another house's title held by another person of the town (the owner's pin M-1b) | `src/data/faceHonorifics.js :: FACE_HONORIFICS_INLAND["the harbour master"] = ["Dockmaster", "Wharfinger"]` through `honorificOfTitle` (`connectionOf`, `seatKeeperDisplay.js`; the NPC card's title line) | yes, at print: the roster's titles are on the record | data: "Wharfinger" leaves the harbour master's pool (the docks keep it), or the honorific reads the roster and refuses a title another holds | display only (the honorific is chosen at print) | 0 |
| 10d-seat | a tie never asks for a seat its asker holds | `src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence` (the line), chosen by `generators/power/relationshipArchetypes.js :: computeRelTension`, drawn by `generators/people/ties.js :: createTieProseDraw` | yes: the pair's memberships are on `ctx.pair` at the draw | exclusion: the line declares that its lender holds no unveiled seat on the governing power, and a twin | `relationships[].tension` | 0 |
| 10d-purse | the treasury's yearly balance has one reading | the same pool ("borrowed … every year since"); the page's balance is the economy desk's DS-ECO-8 MODERATE ("takes in a little more than it pays out each year"; "With a little left over each year") | no: `drawTies` is not passed `economicState` (`narrativeGenerator.js`) | exclusion: drawTies reads the prosperity band and draws no yearly-borrowing line where the desk prints a yearly surplus | `relationships[].description` | 0 |
| 10e-temper | a secret never denies its holder's temperament (incorruptible ↔ paid to betray a duty; honest, plain-dealing ↔ a lie or a forgery of one's own) | the secret overlay (`src/data/stressInstitutionEffects.js`, the title secrets `src/data/people/titleSecretsPresentations.js`, via `npcGenerator.js`), drawn AFTER the temperament (`npcData.js :: NPC_PERSONALITY_TRAITS`) | yes: the temperament is settled | exclusion: a table `SECRETS_DENIED_BY_TEMPERAMENT` beside the existing `FLAWS_DENIED_BY_TEMPERAMENT` (`npcData.js`), read by the secret draw | `npcs[].secret` | 1 |
| 10e-house | a secret of drawn pay needs a paid house | `TITLE_SECRETS["the watch sergeant"]` (`titleSecretsPresentations.js`) | yes: the watch's pay is a fact (`src/domain/facts/guardPay.js :: watchIsUnpaidRota`) but has no atom | the title line declares it (`TITLE_LINE_DECLARATIONS`, `settleTitleLines`: `poolMap.js`) with a new atom `guardPaid`, and a twin | `npcs[].secret` | 0 |
| 10e-pay | the forces' pay has one reading | `src/generators/safetyProfile.js` (the guard line, keyed on `militaryEffective` and the economy priority), re-read by `keptGuardLine` | the pay-cut constraint is the watch commander's (npc structure), drawn later | a reading at print: the guard line reads `guardPayOf` and the constraint (seat E's 9a holds the same line: C51048) | display only if read at print | 0 |
| 10f-kind | a governing power's card is drawn for its own kind | `src/generators/power/rulingStructure.js :: generatePowerStructure` (`govDescByLabel[govBody]`, govBody from house names, wins over the faction's label) | yes: the governing category is settled at that step | exclusion: the religious governing power takes the theocratic description | `powerStructure.factions[].desc` | 0 |
| 10f-tier | a power's card is drawn for the town's tier | the same file (the merchant description keyed on power thresholds, never the tier) | yes | the key gains the tier (the market-day line for a hamlet, a village, a town) | `powerStructure.factions[].desc` | 0 |
| 10f-weight | a card that says another power "has more say" names one that weighs more | `src/generators/power/factionStanding.js :: annotateFactionStanding` (keyed on the merchant CATEGORY's power, names "the merchant guilds") | yes: every power's weight is on the record | the clause names the power that weighs more, or reads the one it names | `powerStructure.factions[].desc` | 0 |
| 10f-backs | the ruler's own seat backs the ruler only | `src/domain/dossier/powerSupport.js :: houseBacksOf` (catalogue shares, `data/institutionBacking.js`), at print | yes | a reading at print: the Government house of the ruler lists the ruler alone | display only | 0 |
| 10g-span | one event has one length | `src/generators/historyTemplate.js :: buildCurrentTensionTokens` (`'{duration}': 'three'`, fixed); the event's own is `randInt(1,5)` (`historyGenerator.js`); `placedTensionTokens` (`historyData.js`) copies the quarter and the place, not the length | yes: the own event is placed before the tension | the tension copies its own event's duration | `history.currentTensions[].description` | 0 |
| 10g-legacy | a line of rebuilding needs a calamity that destroyed something | DS-GEN-16 LEGACY-RECOVERED v2 (`src/data/dossierStateProse/general.generated.js`; key `legacyPoolKey`, `generalStateProse.js`; it names `legacyAnnotations[0]`) | yes, at print | the variant declares a destructive calamity (fire, siege, war, raid, flood, plague, occupation) and the pool keeps v1 or a twin otherwise | display only (the annex's line is chosen at print) | 0 |
| 10h | a power inside a sentence takes its prose form | `src/domain/dossier/hookLines.js :: hookPartyOf` (the raw `conflict.parties` name), at print from `collectPlotHooks` | yes | `hookPartyOf` reads `powerSentenceName` (`src/data/people/powerSentenceName.js`, PROSE_FORMS: 'Military/Guard' → 'The Guard'), as `conflicts.js` and `InstitutionsTab.jsx` already do | display only | 0 |

THE 525 STAND STILL UNDER ALL BUT ONE: the reference configurations are the calm grid, and LAW 10's pairs live in crisis, criminal and large towns. Of the record-side cures only 10e-temper's exclusion finds a configuration holding its condition (1 of 525); the display-only cures (10c, 10f-backs, 10g-legacy, 10h, the 10b slot) move none by construction.

## 5 · THE OVERLAP WITH THE ROUND IN FLIGHT

No instance of LAW 10 sits on a fact a BAR5 seat's section names: all of it is the next wave's. Several sit in a FILE a BAR5 seat holds, and the cure must be sequenced with that seat:

| rule | BAR5 seat whose file it sits in | that seat's named fact | the same line? |
|---|---|---|---|
| 10b, 10e-pay | BAR5-SAFETY (`src/generators/safetyProfile.js`) | the safety lines read the law band | no (the crusader hook; the guard's pay line) |
| 10d-seat, 10d-purse, 10e-temper (the personality pool) | BAR5-THINGS (`src/data/npcData.js`; `src/data/stressInstitutionEffects.js` holds "has been paid to lose it") | the notary, the weeks, the patron, the kilns | no |
| 10f-kind, 10f-tier | BAR5-POWERS (`src/generators/power/rulingStructure.js`) | (a) the description drawn from the raw power, the standing word from the final | no: the kind and the tier are other keys of the same draw |
| 10g-legacy | BAR5-THINGS (the general desk's annex blocks DS-GEN) | as above | no (DS-GEN-16) |
| 10g-span | BAR5-WORLD (`src/data/historyData.js`, `placedTensionTokens`) | the founding; LAW 5's undeclared lines | no |
| 10h (1 of 5) | BAR5-MAGIC (`src/generators/narrativeText.js`) | the reliance lines | no |
| 10d-purse (the fact side) | BAR5-FOOD (the economy desk DS-ECO, DS-ECO-8's treasury line) | the food word and its band | no |

Rows of the bar's last read that look like LAW 10 but are held by the round in flight: C30295 (`4n-patron`, BAR5-THINGS (c)), C2000 (`4n-weeks`, BAR5-THINGS (b)), C33631, C35627, C43925 (LAW 1's 1c/1d, BAR5-POWERS (a), (b), (c)). BESIDE OTHER SEATS OF THIS ROUND: C51048 (10e-pay) is also in seat E's 9a list; C128237 (10f-tier) is also in seat C's 6d list.

## 6 · FOR THE OWNER, IN PLAIN WORDS

When two parts of a town's story are written separately, they sometimes contradict each other. A town leader "answers to" the council he runs. A hook calls the garrison's commander "he" when the roster's commander is a woman. A harbour master is titled "Wharfinger", which is another man's job in the same town. A theocracy's card describes a guild council. A noble house's card says the merchant guilds have more say than the page's own weights allow. A town is said to have been rebuilt after a quarrel about money that destroyed nothing.

HOW DEEP: 122 of the 720 census towns (one in six) and 56 of the fresh 300 (one in five) print at least one such line. That is 107 distinct lines in the 720. These are not 107 separate faults. Each rule here is one writer that does not read a fact the record already holds, so ONE FACT CURES A RULE IN EVERY TOWN AT ONCE, including towns no reader has opened.

WHAT ONE FACT CLEARS (the 720):
- The harbour master's honorific (one data line in `faceHonorifics.js`) clears 36 towns.
- "The ruler's own house backs only the ruler", one reading at print, clears 28.
- "A line about rebuilding needs a calamity that destroyed something", one declaration in one pool, clears 24.
- "A secret never denies the temperament", one exclusion table beside the one that exists for flaws, clears 26.
- The other rules are small, between 1 and 8 towns each, and each is one line of code or data.

The display-only cures (the title, the backing, the legacy line, the label's plain name) move nothing in the stored record. The cures at the draw (the allegiance, the tie, the secret, the power card, the plague's length) move the stored record only in the towns that hold the fault. Of the 525 reference configurations, 1 holds any of them.
