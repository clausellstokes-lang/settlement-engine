# NAMES-1 hand-back

Written 2026-11-20 05:47 UTC. Branch `lane/names-2026-11-20` at `d0549419b`, cut from `85fccf898` (origin/lane/join-2026-11-14). The census
before the build is `NAMES-1-CENSUS.md`, beside this file. Commits: 3b567e876 (census), 48c3c4dec (builder brief), e8304992a
(CN2 + CN1 helper + goals + rename cascade), 75d591812 (render, narratives, CN2 order), 760681e5a (strict-type fix), d0549419b
(power records, quarrels, the walker).

## The counts (EXECUTED; scratch measure over the census's 720, `censusPlan('r2')`, stored prose, sentences split on any capital)

| | before (85fccf898, an archive) | after (d0549419b's tree) |
|---|---|---|
| bare power label in a sentence | 20,449 (13,992 sentences, 617 towns) | **0** |
| mid-sentence capital "The" ("from The Guard") | 1,802 | **0** |
| full name twice in one sentence | 12,054 (9,804 sentences, 584 towns) | **0** |
| a string with a pronoun and no one named | 0 | 0 |

Render (120 rendered towns, the builders' runs). dmPowerLines.js: 2,159 → 0. Power state prose: 225 → 13. The 13 are all "the
whole {seat}", which reads correctly but the detector flags. **Left by the chair's ruling:** crisisHooks.js, which still composes
92 bare-label sentences on the 120; crisisCast.js composes none itself. tonightSheet.js was not touched. "Governed by X · Stable"
is a label and was left.

## The mechanism (as ruled)

- **CN1.** The body lives in `data/people/powerSentenceName.js :: powerNameWithArticle`. `governanceAccount.js :: powerNameInProse`
  returns it under its own name and in its own home. Every site fills through it: "The" where the name opens a sentence,
  `powerNameAfterArticle` after a template's own "the". `factionRename.js :: substituteName` moves the article forms first.
- **CN2.** `data/people/personMention.js :: secondMentions` is applied in `npcData.js :: pairProse` and `goals.js :: cellCandidates`.
  A later mention becomes a pronoun from the card's own gender, else the role, else the surname, else the given name.
- **The census of sites changed:** goals.js, npcData.js, factionDynamics.js, factionStanding.js, governingStressVignettes.js,
  conflicts.js, hookLines.js, crossSettlementConflicts.js, narrativeText.js, governanceNarrative.js, settlementNarrative.js,
  npcGenerator.js (three fills), narrativeGenerator.js, dmPowerLines.js, powerStateProse.js. Found to need nothing:
  conflictIssues.js, historyData.js, powerSupport.js, powerSiblings.js, stressInstitutionEffects.js, roleClass.js,
  safetyLineTruth.js.

## CN3

- **Measure:** every prose field naming a person or a power is ONE string, often of several sentences. The only list of
  strings is `conflicts[].plotHooks[]`, and it names powers only.
- **The walker:** `tests/lint/namesInSentences.walker.test.js`. It is red first at the base on its 36-birth pool: 852 bare
  labels, 109 mid-sentence capitals, 584 repeated names. It is 13/13 green at d0549419b. Its arms:
  - CN3 (i): no hideable power's or house's prose form drops its name's fold.
  - CN3 (ii): no prose string speaks of a person by a gendered pronoun, or by half a name, without naming them in full.
  - Both CN3 arms were green at the base and stay green.
  - The CONTROLS plant each defect and prove each detector catches it.
  - Its mutation-manifest row is a rationale.
- **Gap:** the walker reads stored prose only. The render composers are held by their own tests (dmPowerLines.test.js and
  others), not by a render arm.

## Red and green at d0549419b

- GREEN (executed):
  - the walker, 13/13;
  - the mutation manifest;
  - `npm run typecheck:ratchet` 167/167 and `typecheck:domain:strict` 1113/1113;
  - lint, 0 errors (the pre-push hook);
  - every re-pinned test file, and the files that import the changed composers (the builders' and my runs: 1,376 tests in
    the first 103 files; the rename, voice and leaf tests).
- **RED, OURS, NOT CURED:** `tests/lint/presumedThings.walker.test.js` and `tests/lint/presumptionClasses.walker.test.js`. They
  key banked source lines by their literal text, so five rewritten lines read as new:
  - `dmPowerLines.js`: "still works the streets" (size);
  - `governanceNarrative.js`: the occupied protest line (office, sovereign; a comment rides on the line);
  - `settlementNarrative.js`: the occupation-legacy line (market, streets).
  The cure, per line: restore the line byte-identical by moving the article into the value rather than the template, as
  factionDynamics did. Failing that, declare the line, then shrink the stale rows by their doors. **This is the first thing
  left.**
- **NOT RUN:** `tests/lint` WHOLE. Only the walker, manifest, voice and presumption files were run.

## Stored figures that move (NAMED, none re-frozen; CN4)

- `tests/property/generatorGoldenMaster.test.js` "every config produces byte-identical output to the golden master"
- `tests/generators/generationForkCensus.test.js` A1: control-row hash 71ea4d5f… → ab25dcdf… (the value after e8304992a;
  later commits move it again)
- `tests/generators/pipelinePinnedChoosers.test.js` A1 and `rosterFinalUnderHeldRoster.test.js` A1 (37 golden-corpus rows each)
- `tests/domain/worldFactRederive.test.js` A7; `tests/generators/powerEconomyFreshness.test.js` A4 (F1 saw it red before its change)
- `docs/content/wiring-census.json`: powerStateProse.js's stamp re-stamped (--dry: 0 rows move)
- The page census and the pool-dominance registers were not run; their counted lines likely move (PLAUSIBLE)

## Told apart

- CONFIRMED by execution: the counts, the walker, the gates listed green, the presumption reds.
- PLAUSIBLE: the page census and pool-dominance moves. One hall rung on the Power tab drew another line after F4's change;
  its fill admits exactly what it did before, so the cause is unmeasured.
- NOT DONE: the chair's whole-page DM read of one town. The before/after strings of three towns were scanned instead: 121
  changed strings, 0 "the the", 0 mid-sentence capital "The". An older verb-agreement slip remains ("the Merchant Guilds
  wants", "stronger than they found it").

## Before and after (three born towns, stored)

## r2r-town-0
- powerStructure.factionRelationships.0.narrative
  before: Corrupt Council needs the taxes and loans of Merchant Guilds, and Merchant Guilds need Corrupt Council to enforce their contracts and keep the law. Neither can afford to ruin the other.
  after:  The Corrupt Council needs the taxes and loans of the Merchant Guilds, and the Merchant Guilds need the Corrupt Council to enforce their contracts and keep the law. Neither can afford to ruin the other.
- powerStructure.factionRelationships.1.dmNote
  before: Ask: which specific officials have arrangements with Thieves' Guild? The answer drives dozens of plot hooks.
  after:  Ask: which specific officials have arrangements with the Thieves' Guild? The answer drives dozens of plot hooks.
- powerStructure.conflicts.0.desc
  before: Corrupt Council and Thieves' Guild are in moderate conflict over stolen goods sold openly. The stakes are reputation and profit.
  after:  The Corrupt Council and the Thieves' Guild are in moderate conflict over stolen goods sold openly. The stakes are reputation and profit.
- npcs.0.goal.short
  before: Make sure no one can trace the arrangement between Corrupt Council and Thieves' Guild back to them.
  after:  Make sure no one can trace the arrangement between the Corrupt Council and the Thieves' Guild back to them.
- npcs.2.goal.long
  before: Leave Merchant Guilds stronger than they found it, with Pompeia Scipio still second and content.
  after:  Leave the Merchant Guilds stronger than they found it, with Pompeia Scipio still second and content.
- relationships.0.tension
  before: Drusilla Cato has begun teaching Laevinus Scipio's methods as Drusilla Cato's own.
  after:  Drusilla Cato has begun teaching Laevinus Scipio's methods as her own.
- relationships.4.description
  before: Plinius Moderatus made Laevinus Scipio's career, and Laevinus Scipio rarely says so.
  after:  Plinius Moderatus made Laevinus Scipio's career, and the mayor rarely says so.
- pressureSentence
  before: Farosaltus's ruler is old and the succession is disputed; Corrupt Council already has its candidate ready.
  after:  Farosaltus's ruler is old and the succession is disputed; the Corrupt Council already has its candidate ready.
## r2s-occupied-city-1
- powerStructure.factions.0.desc
  before: Merchant oligarchy keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval. The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.
  after:  The Merchant oligarchy keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval. The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.
- powerStructure.recentConflict
  before: An occupying officer arrested a local elder for "seditious speech". Merchant oligarchy filed a formal protest. The protest was returned unread.
  after:  An occupying officer arrested a local elder for "seditious speech". The Merchant oligarchy filed a formal protest. The protest was returned unread.
- powerStructure.factionRelationships.0.narrative
  before: Merchant oligarchy carries out what Occupation Authority decides.
  after:  The Merchant oligarchy carries out what the Occupation Authority decides.
- powerStructure.conflicts.0.desc
  before: Merchant oligarchy and Craft Guilds are in high conflict over weights and measures used in trade. The stakes are honest dealing.
  after:  The Merchant oligarchy and the Craft Guilds are in high conflict over weights and measures used in trade. The stakes are honest dealing.
- npcs.0.goal.short
  before: Settle one quarrel inside Occupation Authority before Jebe Geniges can settle it and take the credit.
  after:  Settle one quarrel inside the Occupation Authority before Jebe Geniges can settle it and take the credit.
- npcs.2.goal.long
  before: Build Craft Guilds up until it is beyond the reach of Merchant Guilds.
  after:  Build the Craft Guilds up until it is beyond the reach of the Merchant Guilds.
- npcs.26.secret.stakes
  before: Merchant oligarchy would pay well. So would the occupation authority, to suppress it
  after:  The Merchant oligarchy would pay well. So would the occupation authority, to suppress it
- relationships.1.tension
  before: Jelme Ongirad has begun teaching Purevdulam Oirat's methods as Jelme Ongirad's own.
  after:  Jelme Ongirad has begun teaching Purevdulam Oirat's methods as his own.
- relationships.2.description
  before: Bochak Uighur has put money into Bayasgalan Merkit's affairs for years and takes a share of everything Bayasgalan Merkit earns. No contract exists, and neither of them wants one.
  after:  Bochak Uighur has put money into Bayasgalan Merkit's affairs for years and takes a share of everything the senior craft-guild master earns. No contract exists, and neither of them wants one.
- pressureSentence
  before: The occupiers of Qaranuur are careful to leave the forms of local rule in place (Merchant oligarchy still meets, still signs, still presides) which fools no one and is not meant to.
  after:  The occupiers of Qaranuur are careful to leave the forms of local rule in place: the Merchant oligarchy still meets, still signs, still presides, which fools no one and is not meant to.
## r2r-village-8
- powerStructure.factionRelationships.0.narrative
  before: The Guard is now about as strong as Elder Council. The hall asks for The Guard's agreement instead of giving orders, and less and less is decided without it.
  after:  The Guard is now about as strong as the Elder Council. The hall asks for the Guard's agreement instead of giving orders, and less and less is decided without it.
- npcs.0.goal.short
  before: Find out which members of Elder Council are still friendly with The Guard, and why.
  after:  Find out which members of the Elder Council are still friendly with the Guard, and why.
- npcs.0.goal.long
  before: Leave Elder Council stronger than they found it, with Noyans Tayichi'ud still second and content.
  after:  Leave the Elder Council stronger than they found it, with Noyans Tayichi'ud still second and content.
- relationships.0.description
  before: Years ago Otgontuya Suldus did Arslankhan Jalayir a favour too large to repay, and Arslankhan Jalayir has been paying it back in small ways ever since.
  after:  Years ago Otgontuya Suldus did Arslankhan Jalayir a favour too large to repay, and he has been paying it back in small ways ever since.
- relationships.5.tension
  before: Someone else has learned what favour Enkhjargal Qonggirad owes Arslankhan Jalayir, and now has a hold on Enkhjargal Qonggirad too.
  after:  Someone else has learned what favour Enkhjargal Qonggirad owes Arslankhan Jalayir, and now has a hold on her too.
