# The old golden master: what moved (seat CLOSE-2, measured 2026-11-22, read-only)

**Record commit: `a7a25bd39`** (2026-11-19 01:06, "LASTCLOSE-SIGN B1: ... 222 of 525 ...; d08ae44c -> 079bfce6"), written at its parent 1b2cb89f4. The manifest's content has not changed since: its blob is `5a9bc7022` at a7a25bd39, at every later commit that touches the path (all merges or docs commits), and at c110dd85b. The parent's blob was 4a3675894. It reached the line at point 72 (`13e1cf034`), whose src moves no row.
**Proof:** dark births at a7a25bd39 (an archive tree; `generateSettlementPipeline(cfg, null, {seed, customContent:{}})`, the 525 `goldenCorpus()` rows, sha256 of JSON.stringify) reproduce the manifest in **525 of 525** rows. At c110dd85b they reproduce it in **0 of 525** (thorp 84, hamlet 84, village 84, town 105, city 84, metropolis 84). The old tree loaded on today's node_modules without trouble: package.json and package-lock.json are the same at both commits.

## Top-level fields that differ, then vs now (rows; 10 of 40 fields moved)
| field | all | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|---|
| arrivalScene | 517 | 84 | 84 | 83 | 98 | 84 | 84 |
| npcs | 501 | 60 | 84 | 84 | 105 | 84 | 84 |
| economicState (safetyProfile.safetyDesc only) | 489 | 72 | 72 | 72 | 105 | 84 | 84 |
| pressureSentence | 487 | 72 | 72 | 72 | 103 | 84 | 84 |
| relationships | 468 | 46 | 68 | 81 | 105 | 84 | 84 |
| powerStructure | 465 | 24 | 84 | 84 | 105 | 84 | 84 |
| conflicts | 443 | 24 | 84 | 84 | 83 | 84 | 84 |
| history | 422 | 36 | 84 | 36 | 98 | 84 | 84 |
| generationCoherenceReceipt | 258 | 24 | 84 | 54 | 96 | 0 | 0 |
| prominentRelationship | 198 | 22 | 15 | 37 | 43 | 45 | 36 |

The other 30 top-level fields are byte-identical in all 525 rows: name, population, institutions, config, services, culture, resources, defence, economy apart from that one line, and so on. **No plain fact moved in any row:** name, size, population, prosperity, the powers and their power, the governing power, the number of people and the crisis type are all the same. No array changed length (people, ties, conflicts). Every changed leaf is text or a prose-variant index, except the receipt, which lost findings. By leaf: safetyDesc 489, conflicts desc 443, faction-tie narratives 441, tie description 418 / tension 416, history hooks 350 + 188, goals long 345 / short 333, power card desc 291, recentConflict 272, npc constraint 259 / position 201, tie proseVariant 168, npc secret 167.

## Three places, then and now (all three are named Schwarzwalde and are under the "infiltrated" crisis)
- **Small: the hamlet (germanic, riverside, river; 54 people, poor, under the Feudal Stewardship).** The people, houses and numbers are the same, and the sentences are new. Safety then read "The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of"; now it reads "A wrong done here is a wrong done to neighbours, and it is not soon forgotten." Powers now take "the": "the Military Party carries out what the Feudal Stewardship decides". The second mention of a person is now a role or a pronoun: "the steward needs the bloc's speaker's silence", "he holds enough to finish her". The steward's constraint was "cannot pay for the repairs" and is now "can promise little and pay for less". The arrival's street scene was two neighbours arguing over a boundary stone; now a craftsman shows off his work. The corruption tension's hook was a death threat; now someone offers to buy the evidence.
- **Middle: the town (germanic, plains, road; 1,242 people, prosperous, under the Town Council; the base row).** Every power is now "the Town Council" and "the Merchant Guilds". The safety line is reworded with the same meaning ("Locals can tell a newcomer which places to steer clear of"). The council head's secret was a protection racket on the merchants; now his legitimate business is a front for contraband. Some goals are new ("keep the accounts of the weavers balanced"). The crime-wave hooks are new and smaller ("a boy who runs errands ... carrying more coin than any errand pays"). The receipt's "walls without walls" finding about the walled-apart quarters is gone, and that judgment now passes. **NEW FAULT:** the tie line now reads "to back a candidate *her* distrusts".
- **Large: the city (germanic, coastal, port; 7,564 people, prosperous, under the Merchant Guild Council).** All 9 powers take "the" in every narrative and conflict. The safety line was "Crime is a persistent and visible problem ... garrison overwhelmed or corrupt"; now it reads "Crime here is common, and nobody pretends otherwise ... the trouble is already inside". The guild tension's hooks are now about the docks ("a boat's cargo sits unloaded ... who may sell it"). Several ties draw other prose variants. **NEW FAULT:** "asked Dominik Schäfer for something *him* cannot give".

**The fault, measured:** 237 of 525 rows now contain "him" or "her" followed by a verb, as in "her distrusts" and "him cannot": tie tension 388, tie description 143, prominentRelationship 41+41+5. There were 0 such rows at the record commit. This is a crude regex scan, but the samples are real faults. Plausible source: point 77, "a person's second mention is a pronoun".

## The cause, step by step
These are births at each landed point on lane/join-2026-11-14 that touches src, in archive trees, through the mutex. The first-parent walk stops at 9dd697392 because the clone is shallow, so points 72 to 85 were taken from their landing commits. Each figure is the number of rows moved at that step.
- **CONFIRMED, point 77 NAMES (60075eaf5): a power takes its article; a person's second mention is a pronoun, a role or a surname.** 521 rows: pressureSentence 487, conflicts desc 443, faction narratives 441, tie description 418 / tension 416, goals 357, power card desc 291, recentConflict 272, prominentRelationship 183, receipt evidence 40.
- **CONFIRMED, point 82 NAMES-4 (43ab0f5eb): verb number, "it" of a plural power, the possessive.** 242 rows: goals 242 ("run *them*"), ties 7.
- **CONFIRMED, points 83 to 85 together (43ab0f5eb to 062504aa8).** These could not be split: the lane tips are not in the clone and the files interleave. 525 rows: arrivalScene 517, goals 325, tie description, tension and proseVariant 168, npc secret 167, prominentRelationship 19. By file, all PLAUSIBLE:
  - point 83 KERNEL-MIX (proseHash.js) probably moves none of these;
  - point 84 GOALS-3 (goals.js, goalFamilies, goalSecretRefusals, relationshipArchetypes) moves goals and ties;
  - point 85 PAGE-6 moves the arrival (L2, arrivalProse.js and narrativeData.js pools deepened) and the secrets (S9, factionLeaderSecret.js and npcData.js).
- **CONFIRMED, point 89 PROSE-3 (e7096fe96): src/domain/coherence/defenseWordsFindings.js.** 252 rows, receipt only. The "walls without walls" findings are removed, and 132 judgments go from needs_review to pass.
- **CONFIRMED, point 91 PLACE-3 (822d514b6): safetyDescLines.js and safetyProfile.js, the safety line.** 489 rows, safetyDesc only.
- **CONFIRMED, point 93 PEOPLE-3 (bd7933433): npcStructure.js and npcStructureVariants.js, the position line and the constraint.** 273 rows: constraint 259, position 201.
- **CONFIRMED, point 96 PAGE-12 (c35847792): troubleHooks.js and tensionCauses.js, the hooks drawn from a pool by need.** 422 rows: tension hooks 350, event hooks 188, tension descriptions 74.
- **CONFIRMED to move nothing:** points 72, 78 to 81 (titles; NAMES-2 at 79), 86, 88, 90, 94, 95, 97 and 98. All of 97 and 98 is built dark. No step moved any field outside the families named above.
- The endpoints agree: the ladder's first tree equals the record in 525 of 525 rows, and its last tree equals c110dd85b in 525 of 525.

Scripts and data (kept in this directory): birth.mjs, compare.mjs, leafdiff.mjs, fingerprint.mjs, ladder.sh, ladcmp.mjs, pronscan.mjs; then.json, now.json, leaf.json, fp/*.json.
