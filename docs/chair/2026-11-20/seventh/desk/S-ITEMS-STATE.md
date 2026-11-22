# The 2026-11-15 veto list's open entries (S112 to S147): their state on 2026-11-20

Read-only desk work. "Executed" = I read or ran it myself; "plausible" = inferred. The line = origin/lane/join-2026-11-14 at 29ec255fe. FIFTH = `docs/chair/2026-11-14/CHAIR-HANDOFF-FIFTH.md`, SIXTH = `docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md`, SEVENTH = `docs/chair/2026-11-20/seventh/CHAIR-HANDOFF-SEVENTH.md`, BAR7 = `docs/chair/2026-11-17/bar7/RULINGS.md` (all on lane/chair-2026-11-08). Open entries counted: 23 (S112, 113, 115, 117-126, 128, 131-134, 140, 141, 143, 144, 146).

| Entry | Question | Class | Settling citation / recommendation |
|---|---|---|---|
| S112 | 3 reference files refreshed? | SETTLED SINCE | Owner "Yes refresh the reference" 2026-11-15 20:27 (FIFTH log 20:29); both checks green in BAR4-CLOSE-DOORS-1 |
| S113 | Size budgets over | SETTLED SINCE | Owner "i defer all of hte waiting on me's to you" 11-15 07:50; chair chose; B3, CL3, CL12; 799 limit holds (file is 799 lines) |
| S115 | Two statistical envelopes | SETTLED SINCE | Same 07:50 deferral; re-derived with cause 08:53 (floor 372 to 300) and 09:05 (ceiling 43 to 59) |
| S117 | Coastal salt via a Salt works | SETTLED SINCE (in substance) | BR2: "on a coast the sea is the salt works' ground"; code keeps it; record one ratifying line |
| S118 | Vintner line under siege | SETTLED SINCE | Owner's words in BR3 (3) and ruling BR3 (c); BIRTH-1/2 writes the import under a siege |
| S119 | Parked pilgrimage/healing/fortification rows | JUDGEMENT | Keep parked through the deploy; put on the eighth read |
| S120 | Dragon tribute line | JUDGEMENT | Keep (magic-gated); the owner's own RS1 words want dragons under magic |
| S121 | Crisis stand-in hook | JUDGEMENT | No hook; same question as S144; rule both together |
| S122 | "The ruling three of" heading | JUDGEMENT | Keep as is |
| S123 | Bargain line beside a conflict | SETTLED SINCE | Chair's P3 (BAR3-POWERS): bargain kept, twin names the quarrel at any intensity |
| S124 | 90% gap rule | JUDGEMENT | Ratify; table is empty, so no page moves either way |
| S125 | Crisis marking rule | SETTLED SINCE (in substance) | Owner's BR3 (3) "Rather than reworked"; built in every round since |
| S126 | Title law | JUDGEMENT | Ratify, with BR14 (b) and FR10 (no female form for one-string office titles) |
| S128 | Pool-and-family set-aside | SETTLED SINCE | Chair's K31 (2026-11-15), built as SET_ASIDE_CELLS |
| S131 | Acts kept for the owner | SETTLED SINCE | OPERATING_STANDARD §6 rule 17; restated in SIXTH §1 and SEVENTH §1. The acts themselves are the owner's |
| S132 | Migrations 211 and 212 | OWNER'S HAND | Owner: "Yes get 211 and 212 in there" (11-19 05:0x); applying them stays the owner's |
| S133 | Earlier accounts' scheduled task | OWNER'S HAND | Pause or archive by the owner; deadline 2026-11-20 09:00 UTC (today) |
| S134 | Add usage | OWNER'S HAND | Billing; probably overtaken by the owner's account changes |
| S140 | Quarry with no stone | SETTLED SINCE | Owner's question in BR4 (4); ruling BR4 (b) "the house proves the ground"; built (impliedGroundsOnPage) |
| S141 | 'Fixture' commits | SETTLED SINCE (action owed) | V15: no history rewrite; 07:50 (3): fixture card after the close. No fix found on the line |
| S143 | Ruined criminal house in the crime key | JUDGEMENT | Keep as is for the deploy; measure, then decide after the eighth read |
| S144 | Crisis helper's hook | JUDGEMENT | No: new text is held by the owner's "no new text until the fixes are done" |
| S146 | Automate the close | JUDGEMENT | Yes, after the deploy, as tooling (not the tabled clean-up) |

## Evidence, entry by entry

**S112.** The question: may the town-map calibration (504 rows), the dossier text list (2) and the preset lighting witness (15) be refreshed? Items 1346 and 1370 say both permission checks refused it, so it waited for the owner's explicit words. Executed: FIFTH, log 20:29 UTC 11-15, quotes the owner at 20:27:16, "Yes refresh the reference", which answers the ask for "Yes, refresh the reference files." covering "the three reference files left pending at the last close". `docs/chair/2026-11-16/bar4/BAR4-CLOSE-DOORS-1-HANDBACK.md` (on the line), section "FOR PART 2", says "townCartographyCalibration 32/32 and presetLightingWitness 7/7 are GREEN." The dossier manifest was signed again at the last close (CLOSES-ACCOUNT, LS B3). Settled.

**S113.** The question: re-record the first-paint and engine budgets or trim, and keep the 799-line limit? Items 1477, 1478, 1540-1543 and 1516. Executed: FIFTH, log 07:50 UTC 11-15, quotes the owner, "i defer all of hte waiting on me's to you", given in answer to "the engine size ceiling; the start-up size limit A, B or C". The chair decided: engine raised to its measured size; first paint, option A (the trim, then a re-record of the remainder). Later ceilings follow B3 (FIFTH 09:37 UTC 11-16) and CL3 and CL12 (SIXTH §6). Executed: `src/generators/power/rulingStructure.js` on the line is exactly 799 lines, so the limit held. Settled, and still vetoable.

**S115.** The question: accept the criminal-capture floor (326 against 372) and the tier-inertia ceiling (45 against 43)? The same 07:50 word: "the two statistical envelopes ... each traced to its cause ... or its envelope re-derived ... on the veto list". At FIFTH 08:53 the capture floor went 372 to 300 (739062206), caused by the declared defence rebuild 82c639b44. At FIFTH 09:05 the tier ceiling went 43 to 59 (4712d06e4), noted as "about 35 in 100 ... against about 22 before". Settled under the deferral. That behaviour change is the vetoable part.

**S117.** The question: keep the coast's salt in the data, with a Salt works asking for it, and depart from D34's letter? Item 1360: 25 towns as built against 61 by the letter, which would print 14 false lines. Executed: BAR7's BR2 part one says "on a coast the sea is the salt works' ground". BR4 adds "the salt works off the coast proves no ground and buys its salt". The code (`computeActiveChains.js`, LAND_GOOD_HOUSES) keeps exactly the seat's form, and point 68 adds "a river's fishing ground gives no salt". Later rulings build on the deviation. The chair need only record "ratified". A veto would also unwind part of BR2.

**S118.** The question: keep "Vintner exists but lacks access to grapes" in the 6 besieged towns? The owner's own words are recorded in BAR7 BR3 (3): "just make sure that it doesn't exclude if a town is under siege that those failings are simply true because in normal times it would be bought in ... Rather than reworked." Ruling BR3 (c): "a siege excludes nothing ... the house carries the siege's mark". Executed: `resourceGenerator.js :: importsBroughtAtBirth` writes the import "under a siege too", and a house on an imported input reads "Curtailed by the siege." (SIXTH line on bar3ServicesRows: the vintner "Curtailed by the siege."). Plausible, not executed: the 6 towns now print "runs on imported grapes" plus the siege mark, not the old line. Settled by the owner's words.

**S119.** The question: leave the pilgrimage (60 towns), blessed stores (7), impaired pilgrimage (4) and divine healing (1) rows parked? Item 1355, ruling H4. I found no later ruling. Executed: `supplyChainData.js` still holds the rows. Plausible: the crisis leaf (`crisisDependence.js`, "pilgrimage": TRAVELLERS) now marks the plague-and-pilgrimage pair; BAR7-AUDIT-H shows pilgrimage chain cards reading "Stopped by the siege." Recommendation: keep them parked through the deploy and put the four rows on the eighth read's list. The other answer means a data change that moves up to 72 towns' chain cards, the golden and the stored figures again before the veil's close.

**S120.** The question: keep "Collect the tribute the dragon demands ..." (6 cards)? Item 1362 says the owner's 11-08 design ("purely fantasy aesthetic ... magic on only as the gate") would strike it. Executed: the line now sits in `src/data/people/goalFamilies.js` under `commission`, with `needs: ['magic']`, beside five more dragon lines. The owner's later words (BAR7 RS1, 11-17 about 08:59) ask for "the bloodline of a god or dragon (magic only)". So the owner treats dragons as magic-gated flavour. Recommendation: keep. Striking it moves about 6 cards and the dossier manifest and golden rows, and would invite striking the five siblings.

**S121 and S144.** The question: should a crisis stand-in (the minted temporary healer or grain warden) carry a personal hook? Items 1364 and 1440: 2 of 2,149 people. Executed: `tests/generators/clerkHookSmallPlace.test.js` (T27) exempts `temporary: true` by identity, and `hookThemeDraws.test.js` pins the stand-ins as `['npc_temp_grain','npc_temp_healer']` (HK1). I found no later ruling. Recommendation: no hook. A hook is new text, and the owner's standing directive (SIXTH §1, "no new text until the fixes are done"; the only exceptions are the failed venture and the rare secrets) holds it. A yes means new hook lines, the two pins moving, and the golden and manifest moving in crisis towns.

**S122.** The question: keep the heading "The ruling three of <power>"? Item 1358: 45, 22, 20 and 20 towns. Executed: `dmPowerLines.js :: rulingHeadOf` prints "The ruling three/two of X", "Who leads X" and "No one stands at the head of X". It appears only on the DM panel and in the PDF's DM chapter. I found no later ruling. Recommendation: keep. It counts what it heads and reads as "the three who rule X". A change moves two outside checks (`pageCensusFindings.js` P16three, `registeredWords.js` rulingFaces) and about 107 towns' DM text.

**S123.** The question: may a structural-bargain relation line stand beside the same pair's conflict? Item 1521 left them. Executed: `factionDynamics.js :: withConflictRelations` carries the chair's P3 (BAR3-POWERS): "a bargain ... is false beside an open conflict of the same pair at ANY intensity ... every such row names the quarrel". `tests/generators/bar3PowersLines.test.js` (C51168) expects "each needs the other to stay strong." followed by "Even so, the two are now at odds over". Settled by P3, and the answer differs from item 1521's.

**S124.** The question: adopt the 90% rule (a gap held in 90% or more of a house's towns is the data's fault and is left unmarked)? Items 1357, 1522, 1524 and 1526. Executed: `src/data/crisisDependence.js` holds `INPUT_GAP_HELD_EVERYWHERE = {}`. Its comment says that since BAR3-SERVICES "the record no longer holds either gap everywhere: Vintner 184 · 11 ... Glassblower 13 · 1 ... The table stays, empty". The hedge forms (C21, C22) and S5's "Short of" marks are live. Recommendation: ratify. Today the rule excludes nothing, so neither answer moves a page. A veto deletes a dormant guard.

**S125.** The question: under a crisis, mark rows from one shared list with one head line per tab, give the PDF no wording of its own, and add houses only once verified? Items 1407, 1523, 1525, 1527 and 1530. Executed: `crisisStoppedRow.js` prints "The descriptions here are of ordinary times. While ... lasts, a row it touches is marked." and InstitutionsTab and ServicesTab cite S1. BAR3 to BAR8 (CM1, BR3 (c), BR10, MARKS-2, point 56) all build on it. The owner's BR3 (3), "Rather than reworked", is that rule in the owner's words. Settled in substance. Record a ratification.

**S126.** The question: keep the title law (a plain neutral word, one word per face; midwife and priest kept) and treat a gendered title against its holder as the data's question? Items 1532 and 1546 (TAIL-TITLES). Later: BR14 (b) (SIXTH §6, 18:16 UTC 11-17) adds "Emira" and leaves "whether the owner wants any of them paired" open. FR10 (06:38 UTC 11-18) decides "the offices' one-string titles take no female form". Recommendation: ratify the law as built. The other answer changes the title words on every page that prints a midwife, a priest or an office for a woman.

**S128.** The question: approve a set-aside keyed by pool and crisis family, each entry naming its commit? Item 1448. Executed: `tests/domain/crisisBlindDossierProse.test.js` holds `SET_ASIDE_CELLS`, "the chair's ruling K31, 2026-11-15", with five `:: threat` cells, each naming its commit. A stale entry reds the check. Settled by K31 and built.

**S131.** The question: do the merge, the deploy and every migration stay the owner's? Items 1371 and 1437. Executed: OPERATING_STANDARD §6 "WHAT STAYS THE OWNER'S", rule 17, plus "The PR, the merge, the Redeploy click and every migration remain the owner's hand." SIXTH §1 and SEVENTH §1 restate it, adding production credentials. The size budgets were deferred at 07:50. The veto lists are on the line. Settled as a rule. The acts themselves remain the owner's.

**S132.** The question: will the owner apply 211, and 212 only after a fresh security reader clears it? Item 1372. SIXTH log 05:0x UTC 11-19: "Yes get 211 and 212 in there" (into PR #75 before the deploy). SEVENTH §0 item 1: 212 is not final, and "212 is not applied until CLEAR". The owner's hand: apply 211, and apply 212 only after the reader's CLEAR. A chair can only report the clearance.

**S133.** The question: pause or archive the earlier account's scheduled task (trig_01XAPp2Tvsunxp5QGqaqPgHx) and its stopped sessions before 2026-11-20 09:00 UTC, and allow a check-in? Items 1356, 1373 and 1375. SIXTH 05:10 UTC 11-19: "URGENT ... Both put to the owner." SEVENTH §4 says it again and adds the sixth chair's account (a self-check armed for 10:13 UTC 11-19 and stopped seats on `lane/veil-18-2026-11-19`, `lane/chair-2026-11-08` and the line). The owner must open each earlier account and pause or delete the task and archive the sessions. The deadline is today. The check-in half is overtaken: the sixth chair armed its own check-ins (chair-lane commit 4558fa66).

**S134.** The question: will the owner add usage? Item 1429. This is billing and the owner's alone. SIXTH 05:10 UTC 11-19 says it was put to the owner. Plausibly overtaken, since the owner has twice moved the work to a fresh account. The owner would need to say yes or no, or add usage in the account settings.

**S140.** The question: may a stone quarry stand where the country lists no stone? Item 1354. BAR7 BR4 quotes the owner (about 04:55 UTC 11-17): "Doesn't the stone quary here in and of itself stipulate that there is stone in the ground?" Ruling (b): "THE HOUSE PROVES THE GROUND: the town's land gains the ground the house implies". Executed: built as `impliedGroundsOnPage` (ResourcesTab, `houseInputAtHand.js`, BIRTH-2), widened by FR21 and point 68. Settled.

**S141.** The question: what to do about commits under the author 'Fixture'? Item 1435. Chair ruling V15 (FIFTH 06:44 UTC 11-15): history is not rewritten. FIFTH 07:50 (3): "THE FIXTURE CARD: after the close, as its own small change". Executed: the fixtures (`implementationSession.test.js`, `soakRegister.test.js`) set `user.name Fixture` in temporary repositories. I found no scrub of GIT_DIR or other GIT_* variables in tests or scripts, so the hook hazard plausibly remains. Settled by ruling, but the fix is still owed. I could not count Fixture commits: this clone is shallow.

**S143.** The question: should a ruined criminal house count in the crime key? Item 1366. Executed: `src/domain/facts/criminalStructureKey.js` still matches every roster name, ruins included. Its comment says "the one behaviour question named for the owner on this leaf, never answered twice". I found no later ruling. Elsewhere the program filters ruins ("a ruined quarry quarries nothing"). Recommendation: keep as is for the deploy, measure how many towns are keyed only by a ruin, then rule "ruins do not key" after the eighth read. Ruling it now moves crime labels, ring notes, hooks and the veil's criminal switch input before the security reader's FINAL.

**S146.** The question: automate the close with one script? Item 1442. The owner never answered. SIXTH added `tools/durations.mjs` and a three-part whole check (01:40 UTC 11-19), so part of it exists. Recommendation: yes, after the deploy, as tooling that sits outside the owner's tabled code clean-up. No page changes. A no keeps closes as a chain of seats, each costing hours.

---

# The sixth chair's own questions to the owner (SIXTH), their state

| # | Question | Class | Citation / recommendation |
|---|---|---|---|
| Q1 | BR13: may a house's network be run by another house's boss? | SETTLED SINCE | FR10 (06:38 UTC 11-18): "the one-way deal stays"; swap cured (points 50, 58) |
| Q2 | BR14 (b): female forms of titles (Emira; Sheikh, Wali, Imam, Qaid) | SETTLED SINCE | FR10: "the offices' one-string titles take no female form"; Emira built |
| Q3 | Worker-bundle ceiling | SETTLED SINCE | Owner "accept the worker size" 03:42:43 11-18; CL12 |
| Q4 | Stored reference files (golden signing) | SETTLED for the last close; OWNER'S HAND for the next | "Yes to both" 19:07 11-18, used 01:04 11-19 (point 72); a new plain yes is needed if the veil's join moves the golden |
| Q5 | Saved towns' re-deal (PEOPLE-2's stop) | SETTLED SINCE | Chair's call ALLOWED under the 04:39:24 deferral (entry 05:14 UTC 11-18); PEOPLE-2 landed (point 58) |
| Q6 | Chain card saying it runs on bought iron (BR18) | SETTLED SINCE | FR10: nothing built (a new word, not a fix) |
| Q7 | A gate held at night read as a day's round (READ's LOW 3) | SETTLED SINCE | FR9; built in point 66 |
| Q8 | The host's (Vercel) allowance | SETTLED SINCE | Owner "I defer these to you" 03:42:43; CL13 |
| Q9 | "commit their work yourself" / "add it" (CLAUDE.md line) | SETTLED SINCE | Owner "Do both" (entry 00:55 UTC 11-18) |
| Q10 | "read" or "fixes" before the deploy | SETTLED SINCE | Owner 05:13:00 11-18: everything but the read is pre-deploy |
| Q11 | Earlier accounts' sessions and scheduled task | OWNER'S HAND | = S133; urgent today |
| Q12 | 211 and 212 in the PR; applying them | OWNER'S HAND (applying) | = S132 |

**Q1.** Seat K counted 106 one-way networks (56 towns) and 20 swaps (11 towns). BR13 (18:16 UTC 11-17) cured the swap and kept the one-way deal, "The owner may reopen it". FR10 records "(the owner's questions 2 to 4): NOTHING BUILT: the one-way deal stays (BR13)". The residue (12 pairs in 11 of the 180) "STAYS" (SIXTH §6, after BR29). A yes to reopening would re-deal handlers in about 56 towns and in saved towns. Decided under the owner's 04:39:24 deferral, still vetoable.

**Q2.** BR14 (b) gave "Emira". The open part was whether other one-string office titles get pairs (SIXTH log line on Sheikh, Wali, Imam and Qaid, "the owner's question"). FR10: "the offices' one-string titles take no female form". A yes means new title words on every woman holding those offices. Settled under the deferral.

**Q3.** CL12 (03:46 UTC 11-18) quotes the owner at 03:42:43: "I defer these to you: ... "accept the worker size"". The ceiling was accepted at +168,907 B and re-recorded once. The last close measured a further +54,680, under CL3's stop of 60,000. Settled.

**Q4.** The owner's "Yes to both" (SIXTH §6, 19:07 UTC 11-18) covered the last close only, and was announced and used at 01:04 UTC 11-19. SEVENTH §4: "At the close: the owner's plain yes on the stored reference files if the join moves the golden." That yes is the owner's alone (OPERATING_STANDARD rule 17: a signing is confirmed in the current chat).

**Q5.** PEOPLE-2 stopped (05:08 UTC 11-18): the swap's cure changes a saved town's re-deal in 9 of 208 constructed cases and a v2 record's first deal in 1 of 38. No stored handler is rewritten (0 of 568). The chair's call (05:14 entry): "ALLOWED ... (the owner told, a 'no' reverses it)". PEOPLE-2 landed as point 58. Settled. A no would reverse the swap cure on saved towns only.

**Q6 and Q7.** These are the "five questions" of the 05:10 UTC 11-18 entry (questions 2 to 5 decided by the chair). FR9 (question 5): "a gate held is a post, not a round"; it moved bar0-town-calm-rand-36, -37 and -40 and landed in point 66. FR10 (question 4): no "bought iron" wording on chain cards (BR18).

**Q8 to Q10.** Answered by the owner's own words, quoted with their hours in SIXTH §6 (CL13) and in the 00:55 UTC 11-18 entry ("Do both"), and in SIXTH §1 (05:13:00).

**Q11 and Q12.** These are the same as S133 and S132 above. Nothing in section 7 after 05:10 UTC 11-19 answers them.

Not counted as owner questions: the Kickstarter side-by-side (SEVENTH §1, which "rides THE EIGHTH READ ... sooner on the owner's word") is a slot, not an open question. The POST-DEPLOY LIST adds (SIXTH 00:30-01:10 UTC 11-19) are work, not questions.
