# PRONOUN (CLOSE-2 unit 3c) — builder's report

Worktree `/home/user/wt/pronoun`, branch `lane/close-2-2026-11-22-pronoun-wip`, cut at c1144ba18.

## STATE (kept current; read this first after a PAUSE)
- measure: DONE (scratch `measure.mjs`, `measure.json`, `table.mjs`, `table.md`).
- red-first: DONE (`red-first.log`: personMention.test.js 1 failed | 8 passed on the tip; `walker-red.log`: the walker on the tip's case reading in an archive, 4 failed | 10 passed).
- cure + walker: written, green (`green1.log`: 14 passed); eslint clean on the three files.
- commits: 2904f0475 (cure + leaf tests + walker), 076a7816c (lighting census, by its door, measured on a clean scratch
  clone), fda719adf (mutation manifest row). Nothing pushed.
- STOPPED by the owner's order (CLOSE-2's STOP, for a handoff to another account), after a PAUSE for the final census;
  nothing of this unit in flight, nothing pushed. NOT DONE: the four runs below. Before the pause: At the pause: tests/generators/people was in flight and finished: 38 files, 211 passed, exit 0
  (people.log); the queued chain (typecheck:ratchet, typecheck:domain:strict, build, VERIFY_DIST) was STOPPED before it
  took the mutex (nothing of it ran). TO FINISH, run in this order, each through the mutex:
  1. npm run typecheck:ratchet  2. npm run typecheck:domain:strict  3. npm run build
  4. VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js --maxWorkers=3
- gate so far: tests/lint whole (lint2.log) 3 failed | 3366 passed (224 files: 2 failed), all 3 ON the chair's list
  (proseComposed.walker "THE SHIPPED CORPUS READING"; proseCorpusBytes RAW and GZIP, whose moved rows are six
  dossierStateProse/*.generated.js files, none of mine). Named set (named.log: 23 files naming personMention /
  secondMentions / the ties' and wants' tables, + generatorGoldenMaster): 5 failed | 204 passed (4 of 24 files), all 5 ON
  the list (colourMarks4h; generationForkCensus A1; narrativeQualityCorpus x2; generatorGoldenMaster). 0 new reds.
  tests/ naming an old wrong form (23 forms): 0 files, so 0 named and 0 kept.

## THE MEASURE (CONFIRMED)
Both callers of `secondMentions`, walked from the tables: ties `npcData.js :: STRESS_ECONOMIC_EFFECTS` and
`HANDLER_TIE_ARCHETYPES` (every line and twin of desc and tension, drawn and reserve, through `pairProse`'s `lines`),
wants `goalFamilies.js :: GOAL_FAMILY_LINES` and `GOAL_RESERVE_LINES` (569 templates, 152 with a person slot).
132 distinct (template, later mention) pairs: 130 ties, 2 wants. The leaf's case at the tip: 48 subject, 37 possessive,
47 object; of the 47 objects, **24 are WRONG** (a clause's subject printed as the object: 23 ties, 1 want), 23 right.
No template of the wants has two distinct person slots (the "two slots bind one person" case: 0 pairs).
The chair's read of the cause holds: every wrong row is a subject with no opener before it (the word before is a noun,
"what", "which", "whatever", "sure"); the cross-check of the copied case logic against the leaf: 0 mismatches.
One follower both classes hold: "would" ("an introduction he would rather keep", subject; "nobody who knows her would
believe it", object): read with the word before it (`FOLLOWER_BY_BEFORE`), the only per-context entry.

## THE CLASSES (personMention.js, exported; classed by hand from the measure)
- SUBJECT_FOLLOWERS: finite verbs, and the adverb before one (never, once, rarely, still): acts asked asks calls can cannot
  controls could decides did distrusts does earns gets has holds is keeps knows makes means moves names needs never once
  owes pays rarely refused remembers sends stands still stops survives uses vouches wants was will.
- OBJECT_FOLLOWERS: , . ; : ! ? about everything gone in money questions something standing that to too two without.
- FOLLOWER_BY_BEFORE: would: and/that/introduction -> subject; knows -> object ("nobody who knows her would believe it").
- A follower in none of them keeps the tip's clause-head reading (text the census never wrote: a stored town's, a custom line).

## THE TABLE (every pair; case at the tip vs case by class)
| caller | template | mention | word before | word after | case at tip | case by class | verdict |
|---|---|---|---|---|---|---|---|
| ties | `STRESS_ECONOMIC_EFFECTS.econ_crim_blur.desc[0].line` | s | and | gets | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_crim_blur.desc[0].line` | r | gets | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_crim_blur.desc[2].line` | s | and | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation.desc[1].line` | s | to | . | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation.desc[2].line` | s | that | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[0].line` | r | where | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[1].line` | r | where | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[2].line` | s | and | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[3].line` | s | when | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[5].line` | r | before | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[5].line` | s | competitors | names | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.desc[7].line` | r | where | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.tension[6].line` | s | someone | wants | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_corruption.tension[7].line` | r | what | is | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[1].line` | s | week; | keeps | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[1].line` | r | on | that | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[5].line` | r | and | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[5].line` | s | taverns | uses | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[6].line` | s | costs | money | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[6].line` | s | month | survives | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[6].line` | r | costs | standing | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.desc[7].line` | s | and | moves | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.tension[6].line` | r | what | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mil_crim_suppression.tension[7].line` | r | someone | cannot | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_mil_contract.desc[0].line` | r | guard | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_mil_contract.desc[4].line` | s | and | is | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_mil_contract.desc[4].line` | r | is | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_mil_contract.desc[5].line` | r | take | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.econ_mil_contract.tension[4].line` | r | and | has | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.rel_mil_crusader.desc[7].line` | s | by | . | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.rel_crim_fraud.desc[1].line` | r | checks | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.rel_crim_fraud.desc[5].line` | r | and | vouches | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.rel_crim_fraud.desc[5].line` | s | for | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.rel_crim_fraud.desc[7].line` | s | keeps | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.rel_crim_fraud.tension[3].line` | r | asked | about | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mag_crim_market.desc[4].line` | r | and | asks | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_econ_dependence.desc[0].line` | s | and | makes | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_econ_dependence.desc[0].line` | r | sure | remembers | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_econ_dependence.desc[1].line` | s | so | decides | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_econ_dependence.desc[1].line` | r | what | can | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_mil_friction.desc[0].line` | r | where | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_mil_friction.desc[0].line` | s | and | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_mil_friction.desc[1].line` | s | and | acts | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.gov_mil_friction.desc[1].line` | r | ways | calls | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.peer_rivalry.desc[5].line` | s | and | wants | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.peer_rivalry.desc[5].line` | r | wants | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc[0].line` | s | and | rarely | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc[2].line` | r | of | . | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc[6].line` | r | and | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc[6].twin` | r | and | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc[8].line` | s | and | still | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.desc[9].line` | r | which | never | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension[4].line` | s | things | never | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension[7].line` | s | as | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mentor_legacy.tension[8].line` | s | though | still | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[1].line` | s | and | holds | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[1].line` | r | finish | , | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[4].line` | s | and | controls | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[4].line` | r | supply | needs | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[4].twin` | s | and | controls | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[4].twin` | r | supply | needs | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[6].line` | r | papers; | needs | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[6].line` | s | needs | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[8].line` | s | and | cannot | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[8].line` | r | without | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[9].line` | s | and | will | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[9].line` | r | need | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[12].line` | s | that | could | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[12].line` | s | and | does | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.desc[12].line` | r | for | in | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension[3].line` | r | put | two | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension[5].line` | r | and | has | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension[5].twin` | r | and | has | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension[12].line` | s | introduction | would | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.wary_alliance.tension[2].line` | s | that | was | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.wary_alliance.tension[4].line` | s | take | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.wary_alliance.tension[7].line` | r | candidate | distrusts | object | subject | **WRONG today** |
| ties | `STRESS_ECONOMIC_EFFECTS.wary_alliance.tension[8].line` | r | and | has | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.genuine_respect.desc[3].line` | s | and | sends | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.genuine_respect.desc[5].line` | s | and | was | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.genuine_respect.tension[3].line` | s | that | does | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.genuine_respect.tension[4].line` | r | want | gone | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.desc[1].line` | r | and | has | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.desc[8].line` | s | cost | something | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.desc[9].line` | r | and | has | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.desc[9].line` | s | that | would | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[2].line` | r | on | too | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[3].line` | r | against | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[3].twin` | r | against | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[7].line` | s | among | 's | possessive | possessive | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[8].line` | s | as | once | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[8].line` | r | for | . | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.old_debt.tension[9].line` | s | and | would | subject | subject | right |
| ties | `STRESS_ECONOMIC_EFFECTS.family_complication.tension[4].line` | r | expects | to | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.family_complication.tension[6].line` | s | asking | questions | object | object | right |
| ties | `STRESS_ECONOMIC_EFFECTS.bitter_history.desc[6].line` | r | in | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.desc[0].line` | s | and | pays | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.desc[1].line` | r | everything | earns | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.desc[2].line` | s | whatever | needs | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.desc[3].line` | r | where | stands | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.desc[5].line` | s | and | keeps | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.desc[5].line` | r | keeps | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_partnership.tension[2].line` | r | something | cannot | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_patron.desc[0].line` | r | knows | would | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_patron.desc[4].line` | r | day | stops | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_patron.desc[5].line` | s | takes | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_patron.tension[4].line` | r | protect | without | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_cause.desc[1].line` | r | livelihood, | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_cause.tension[1].line` | r | begged | to | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_cause.tension[2].line` | r | cost | everything | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_cause.tension[2].line` | r | everything | has | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_debt.desc[0].line` | r | than | could | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_debt.desc[0].line` | s | money; | asks | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_debt.desc[3].line` | r | ruin | . | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_secret.desc[0].line` | r | end | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_secret.desc[1].line` | r | in | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_secret.tension[1].line` | s | to | . | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_secret.tension[3].line` | r | and | knows | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_secret.tension[3].line` | s | what | means | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_crime.desc[0].line` | s | because | knows | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_crime.desc[1].line` | r | in | 's | possessive | possessive | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_crime.desc[3].line` | r | before | was | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_crime.tension[0].line` | r | and | has | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_crime.tension[2].line` | r | and | has | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_crime.tension[3].line` | r | and | knows | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_loved.desc[1].line` | r | if | refused | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_loved.desc[2].line` | s | for | . | object | object | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_loved.tension[0].line` | r | once | has | subject | subject | right |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_loved.tension[2].line` | r | what | owes | object | subject | **WRONG today** |
| ties | `HANDLER_TIE_ARCHETYPES.handler_leverage_loved.tension[3].line` | s | what | asked | object | subject | **WRONG today** |
| wants | `GOAL_FAMILY_LINES.RANK.climb.long[1]` | above | than | did | subject | subject | right |
| wants | `GOAL_FAMILY_LINES.ALLEGIANCE.keep_leverage.short[1]` | agent | somewhere | cannot | object | subject | **WRONG today** |

## NOT DONE / OPEN
- typecheck:ratchet and typecheck:domain:strict on the leaf's new exports (JSDoc'd; eslint clean): UNRUN.
- npm run build + VERIFY_DIST=1 vendorPdfLazy/generationWorkerLazy, the five figures against the line's at point 102
  (1,184,741 / 376,987 / 316,646; 2,709,263; 932,369): UNRUN. The leaf grew by ~2 KB of source (the class sets and two
  helpers); it is in the engine/worker closure, so a small rise there is PLAUSIBLE, first paint likely unmoved (UNMEASURED).
- Which golden configurations move (generatorGoldenMaster is already red on the chair's list): UNMEASURED; the cure moves
  births in words only (24 template pairs; no draw, no pool choice), PLAUSIBLE by construction (the leaf has no draw).
