# GOALS-1 hand-back (HANDED OVER, the chair's word of 11:52 UTC)

Written 2026-11-20 11:55 UTC. Lane `lane/goals-1-2026-11-20`, cut from `origin/lane/names-3-2026-11-20` at **835fabd2d** (the confinement's "before"). Briefs, measures and scripts: `docs/chair/2026-11-20/content/goals/` (BUILDER-1…5 briefs with their amendments; `measures/`). Every claim below is EXECUTED unless marked PLAUSIBLE.

## 1. The rulings in force (the chair's, each vetoable by the owner)
1. **GR1 at the TEMPLATE's level** (10:28): a wording = the cell template with every NAME slot (person, power, house) masked and every other slot (resource, import, issue, chain) its value. The chair's first count ("12 wordings") counted agreement forms and unmasked house nouns; withdrawn.
2. **Two passes, draw-free** (unit 1): pass one is the old deal byte for byte; a holding is a REPEAT iff an earlier holding of pass one holds its wording; a non-repeater never moves; a repeat rotates through its own cellCandidates call (one family, kind, target: the intent never moves).
3. **The rungs** (10:28): (i) a wording nobody holds; (ii) one held once by someone not of its house, not tied to it, sharing no power; (iii) one held once by someone not of its house and not tied; (iv) the drawn one stands, counted (`receipt.repeat[v]` names the rung).
4. **The mirror** (10:58): a sentence and its mirror are one: rungs (ii)/(iii) never take a wording whose one holder filled the name slots with the same values in either order.
5. **Reserve lines for goals** (`GOAL_RESERVE_LINES`): built like a cell's but kept OUT of the draw, reached only by rotation (appending to a cell would change `fork.pick`'s modulus).
6. **The frozen head for ties** (unit 3): `pairProse`'s fifth argument is the reserve; the cycle, the two-name lines and the resolution pool are the head's only; a repeat takes (i) a free admitted reserve index, (ii) else an index printed once by a tie sharing no card, (iii) else stands; same trust as today's index.
7. **Depth T1** (10:28 rule (d): T2 = 110 lines > 90): no template more than twice in any town → **25 goal lines, 13 tie pairs**, every line a different want; final wording approved 10:48 + 10:58 (`goals/GOALS-1-NEW-LINES-DRAFT.md`, current), plus the CN2 rewording approved 11:29: "Quietly learn one thing this season from watching {other} at work." replaces "Learn one thing from {other} this season, without letting {other} see it."
8. **The harsh-tie guard** (10:58): "Earn {other}'s respect…" and "Keep the rivalry… a fair one…" are refused on an enemy tie at serious/mortal or a rival at bitter (`GOAL_LINE_NOT_ON_TIES`); marked refused, reserve-only, no draw moves.
9. **GR4 amended** (11:29): for a repeat tie, `description`, `tension` AND `proseVariant` move together; `prominentRelationship.{phrasing,full,tension}` in scope as strings derived from a moved tie. Two proofs owed (builder 5 built them): (c) a pre-change save re-renders unchanged; (d) a reserve index resolves at every reader (`npcData.js :: pairProse`, `generateSettlementPipeline.js :: refreshRelationshipProjections`, `ties.js :: temperOfTie`, `relationshipArchetypes.js :: createTieProseDraw`; plus the generated supabase bundle, not this lane's).
10. **The refusal** (owner, 11:15: "Do all of these, every last one predeploy"; chair 11:28): a want of the PERSONALITY `conviction` or `duty` cluster (short and long) is refused for a card whose own secret is a row of the CLOSED LIST (`goals/measures/venal-betrayal-rows.closed-list.txt`: 119 of 184 candidate rows, read one by one; the 65 out are in `venal-betrayal-rows.select.mjs`'s EXCLUDE, to be listed BY CLASS in the leaf's comment); draw-free (marked refused; the floor must not hand the cluster back); a leaf of its own with a test that every row still exists. NOT refused: law wants beside venal secrets (the corrupt officer is the design's figure); kindness/conviction beside a secret that only KNOWS of a killing; "Change the way this place thinks…" beside "slowly poisoning a rival" STANDS.
11. **The rare-deal guard** (11:32): `dealRareSecrets` runs AFTER `dealGoals` and replaces a card's secret; the refusal is read once more after it, through ONE function at both sites (A9 seam, `generateCoherence`), only for a card whose secret it changed to `thumbOnScale`, `paidToForget`, `sellsSecrets` or `deserter`; THE TOOTH: same target where the cell allows, else skip a candidate aimed at the person the rare secret names. Count today 0 (1 of 113 rare secrets is of the four; beside conviction/duty 0); it rises only with a new rare row of that kind (the leaf's test names the four).

## 2. The units
| unit | state | commit / branch |
|---|---|---|
| 1 GR1 goals (rotation, reserve mechanism, empty reserve) | LANDED, pushed, confinement proven | 84a8606b9 on the lane |
| 3 GR3 ties (frozen head, rung (ii), no content) | LANDED, pushed, confinement proven | 94493d1fd on the lane |
| 4 the 25 lines + harsh guard + mirror + CN2 line + refusal (amend. 2) + rare guard (amend. 3) | UNFINISHED: snapshot pushed UNVERIFIED; the builder was still at work on amendments 2–3 at the hand-over | `lane/goals-1-2026-11-20-b4` at 9de0e3a2b |
| 5 the 13 tie pairs + proofs (c)/(d) + tieDrawUnprinted reads the head | BUILT by builder 5 (its report: red at 94493d1fd 3 failed/6 passed; green 12/12); diff READ by GOALS-1, NOT re-run, NO confinement | `lane/goals-1-2026-11-20-b5` at 3e1eb04c4 |

Builder 4's snapshot (9de0e3a2b) holds: the 25 reserve lines (the CN2 line NOT yet reworded), `GOAL_LINE_NOT_ON_TIES`, the mirror rule, tests (f)(g)(h) and the reserve shape tests. Its earlier state was reported: red at 84a8606b9 8 failed/30 passed; green 236 + CN2 red (that line); guard (i) 25 of 110 gentle holders on a harsh tie with the map emptied, (ii) 0 of 101 with it; (f) repeats gr1-city-1 5→0, gr1-metropolis-0 29→20; mirrored holders 306 (835fabd2d) / 311 (84a8606b9) / 84 after, all 84 at rung (iv). NOT in it: the leaf `src/data/people/goalSecretRefusals.js`, the refusal, the rare guard, tests (i)–(l).

## 3. The measure (GR5), on the chair's 300 towns (`hxd-<size>-<i>`, 50 a size)
One command: `node docs/chair/2026-11-20/content/goals/measures/goals-ties-depth.mjs <tree> 50 <out>`. Share of towns with a repeat / mean repeats a town:

| size | goal short (masker) | goal long (masker) | goal template (short+long) | tie desc | tie tension | tie index |
|---|---|---|---|---|---|---|
| | 835fabd2d → 94493d1fd | | | | | |
| thorp | 0%/0.00 → 0%/0.00 | 2%/0.02 → 0%/0.00 | 2%/0.02 → 0%/0.00 | 0 → 0 | 0 → 0 | 0 → 0 |
| hamlet | 4%/0.04 → 0%/0.00 | 2%/0.02 → 0%/0.00 | 12%/0.12 → 0%/0.00 | 0 → 0 | 0 → 0 | 0 → 0 |
| village | 14%/0.16 → 0%/0.00 | 14%/0.14 → 0%/0.00 | 44%/0.58 → 0%/0.00 | 2%/0.02 → same | 2%/0.02 → same | 2%/0.02 → same |
| town | 78%/2.10 → 18%/0.28 | 70%/1.90 → 6%/0.08 | 96%/5.42 → 42%/0.80 | 22%/0.40 → 20%/0.44 | 20%/0.52 → 22%/0.50 | 22%/0.56 → same |
| city | 100%/10.06 → 82%/4.98 | 100%/9.82 → 82%/5.68 | 100%/29.54 → 96%/16.46 | 94%/11.12 → same | 96%/11.80 → 96%/11.82 | 96%/13.64 → same |
| metropolis | 100%/18.46 → 100%/12.68 | 100%/18.42 → 100%/13.00 | 100%/52.16 → 100%/37.58 | 100%/22.04 → 21.86 | 100%/22.86 → 22.74 | 100%/26.84 → same |

The tie index repeats do not fall at 94493d1fd: unit 3 only re-seats repeats (rung (ii)); the fall comes with builder 5's reserve pairs. The goal survivors are the forced ones: 2,636 of 17,992 holdings (14.7%) need more templates than the cells hold (before the 25 lines); identical sentences (level (a)) remain 0 (the exact-text `held` sets). The "template more than twice" and "twice" levels are NOT yet measured at a tip: owed after units 4–5 land.

## 4. The confinement (GR4), `trees.mjs` (NAMES-3's tool, scratch copy) + `goals/measures/only-repeaters.mjs` + `tie-repeaters.mjs`
| step | golden 525 | census 720 | non-string | only repeaters |
|---|---|---|---|---|
| control 835fabd2d→835fabd2d | 525 identical | 720 identical | 0 | — |
| 835fabd2d → 84a8606b9 | 323 towns, 3,615 strings, only `npcs[].goal.short/.long` | 428 towns, 5,740 strings, same fields | 0 | every changed holding a base repeat (0 exceptions); no town without a base repeat moved |
| 84a8606b9 → 94493d1fd | 79 towns: 252 ties' description+tension; 7 prominentRelationship ×3 | 174 towns: 1,075 ties; 11 prominentRelationship ×3 | proseVariant only (ruled in scope 11:29) | every changed tie a base repeat (0 exceptions); no other tie field; every prominentRelationship move traceable to a moved tie |

## 5. Stored figures moved (named, signed by nobody)
- `tests/generators/generationForkCensus.test.js` A1: red at 835fabd2d (control hash 26932f67…, pinned 71ea4d5f…); unit 1 moves it to 7c466b88…; unit 3 leaves it there. Units 4–5 will move it again (not read).
- `tests/property/generatorGoldenMaster.test.js` and the tests reading its manifest (NAMES-3's list): not run; units 1 and 3 move 323 and 79 golden towns' strings (above).
- The server bundles' freshness (`edgeSharedBundleReproducibility`): `npcData.js` is bundled; unit 5 makes the bundle stale again; not this lane's.

## 6. Gates (what was run, by GOALS-1)
Unit 1: new test red on the base 6 failed / 1 passed, green; `tests/generators/people` + goalFamilies + the two walkers 34 files / 215 tests green. Unit 3: new test red 4/1, green; the tie tests + people + walkers + fork census 39 files, 231 passed, 1 failed (A1, above). typecheck:ratchet 167/167, domain:strict 1113/1113, lint 0 errors at each push (the hooks). NOT run by GOALS-1: `tests/lint` WHOLE, the lighting and wiring censuses.

## 7. NOT done (for the successor)
1. Builder 4's unit: finish amendments 2–3 (the leaf, the refusal, the rare guard, tests (i)–(l)), apply the CN2 rewording, re-run its red and green, confinement 94493d1fd→it, land.
2. Builder 5's unit: re-run its red and green, confinement, land.
3. The merge of the names seat's tip (NAMES-4) when the chair says it moved (`git merge --no-ff`; in a wording, ITS number and OUR line both stand).
4. The measure at the merged tip, all three levels (identical sentences; a template more than twice; a template twice), and the refusal's count before/after by size (before: conviction 9 + duty 14 holdings on 9,012 cards, by a broad regex; to be re-counted with the closed list), with the sentence for the owner ("this removes the accidental hypocrite, about N a hundred towns").
5. The file for the owner: `goals/GOALS-1-NEW-LINES-DRAFT.md` is current except the CN2 rewording (rule 7).
6. Two existing lines carry the CN2 latent fault (a person named twice where two cards print one name): builder 4 named them as goalFamilies.js lines 239 and 931 at its base; name them by text and count them.
7. `tests/lint` whole, the lighting and wiring censuses, at the last commit.
