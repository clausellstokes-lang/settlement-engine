# PEOPLE-2 CAST-DERIVED — the crisis cast, the seat rows, the crisis hooks' party and the structural standing re-derived from the powers' people (2026-11-07)

Seat: PEOPLE-2 CAST-DERIVED, lane 2 of the people car, a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's full delegation of 2026-11-06 ("I also now give all permissions required now and in the future. I also defer all judgement to you."). Branch `lane/people-2-cast-2026-11-07`, cut from lane 1's pushed tip `8fa9de5b8` (`origin/lane/people-1-cast-2026-11-07`). Brief: `docs/chair/2026-11-07/BRIEF-PEOPLE-2-CAST-DERIVED-2026-11-07.md` with the common part, the rulings `PEOPLE-RULINGS-2026-11-07.md` (M-1b, M-2, M-3, M-6), PEOPLE-0 §5 and PEOPLE-5-PREP §1's PEOPLE-2 rows (all read at the integration branch with `git show`; nothing merged), and the chair's one ruling in the dispatch: `structuralRank` is KEPT as a real field, written by this lane from the first-rank power's standing. Every commit pushed with the bypass in the plain-commands form.

## 1. What was built, by ruling, with the file manifest as it ended

| step · commit | ruling | what | files |
|---|---|---|---|
| 1 · `0efc296fa` | M-1b, M-2 | THE CRISIS CAST READS MEMBERSHIPS. `crisisCast.js :: membersOf` = the faces holding a membership in the power, ORDERED BY RANK (1, 2, 3, then the unranked in roster order), used at the instigator, brunt, defender, treater, waverer and face draws; the exploiter and the collaborator drawn from cards holding a membership in a power that gains; the scapegoat's house loses when any power the card holds a membership in loses; the brunt → instigator pairing reads the brunt's FIRST-RANK power. THE LEVER: the lever house's FACE (the card born for it) is the holder in place of the role-regex office table, which is deleted with the faction roles. The temporary crisis person carries `memberships: []`; the self-check reads a person's stake through every power it holds. The shim's `factionAffiliation` is read nowhere in `crisis/` (the shim itself untouched). New pure reader `src/domain/people/membership.js` (membersByRank, holdsMembership, rankIn, powersByRankOf, firstRankMembershipOf, powerOrderOf, structuralStandingOf). | `src/domain/crisis/crisisCast.js`, `src/domain/coherence/crisisCastFindings.js`, `src/generators/steps/resolveCrisisCast.js`, `src/domain/people/membership.js`, `tests/domain/crisisCastFindings.test.js`, `docs/chair/2026-11-07/people-2/measure.mjs` |
| 2 · `aafc99a54` | M-6 | THE SEAT ROWS. `worldPulse/npcLadderFactionMembership.js :: npcInFaction` gets ONE input arm with a one-line comment (a card holding a membership in the power is its member); nothing else under `worldPulse/` moves. `dossier/seatHolder.js :: seatCandidatesOf` seats the governing power's RANK-1 FACE first (lane 1's floor 1: the seat house's face or the minted seat), title or none; the title read follows for a record with no memberships and as the line behind an ousting. `seatHolderFindings.js`: `seat_contested` also fires for a second rank 1 in the governing power. | `src/domain/worldPulse/npcLadderFactionMembership.js` (2 lines), `src/domain/dossier/seatHolder.js`, `src/domain/coherence/seatHolderFindings.js`, `tests/generators/people/castDerived.test.js` (new), `tests/domain/crisisCast.test.js`, `tests/domain/dossier/seatHolder.test.js` |
| 3 · `07e027b0c` | the chair's ruling (structuralRank kept) | THE HOOKS' PARTY AND THE STANDING. `crisisHooks.js :: holderWords` — "X of <power>" names the card's FIRST-RANK power (the hook text is lane 3's, untouched). `npcStructure.js` — `structuralRank` written on EVERY card from its first-rank power's standing (rank 1 `head`, 2–3 `inner_circle`, unranked `member`, none `unaffiliated`); the template's rank axis `dominant` only where the card heads its first-rank power and that power leads its category within reach of the governing power (the old power test); the TOP_N significant NPCs are the powers' heads first, then their inner circles, by power figure. The shim never wrote `structuralRank` (lane 1's list: none), so no shim line is removed. `npcProfile.js` — the one reader the new vocabulary would collapse to `minor`: `head → dominant`, `inner_circle → secondary`. | `src/domain/crisis/crisisHooks.js`, `src/generators/npcStructure.js`, `src/domain/npcProfile.js` (1 line), `tests/domain/crisisHooks.test.js`, `tests/data/foundingSeeds.probe.test.js`, `tests/generators/people/castDerived.test.js`, `docs/chair/2026-11-07/people-2/aggregate.mjs` |
| 4a–4d · `6e44459c1` `887154f5c` `d1ece15e3` `ad08bf7b8` | M-3 | the proofs' aggregates; the registers (§3) | `docs/chair/2026-11-07/people-2/aggregate-{soak-1000,golden-525}.md`, `docs/content/wiring-census.json`, `tests/lint/observedShapeReaders.walker.test.js`, `tests/lint/.lighting-census-baseline.json`, `scripts/.writer-reach-baseline.json` |

**`src/data/foundingSeeds.js`, the contested crown's link row** (PEOPLE-5-PREP's PEOPLE-2 row) needed no edit: its link field `npcs[].structuralRank` is a real field still; the probe that proves it was re-keyed (§4).

### The cast-role table (soak 1,000; faces named, thorp / hamlet / village / town / city / metropolis, base → tip)

| role | how it is drawn now | faces named at the base | faces named at the tip |
|---|---|---|---|
| brunt | the losing power's members by rank, reversed (the least first), the role-touching first | 46/59/37/44/46/43 | 46/59/37/44/46/43 |
| lever | the lever house's FACE, else the house | 0/16/26/30/38/35 | 0/6/43/46/52/47 |
| instigator | the outranking rival's / a gaining power's members by rank; the brunt's first-rank power's next member (linked) | 3/11/60/74/57/61 | 3/11/60/74/57/61 |
| target | the seat row (the governing power's rank-1 face), else the governing house | 22/12/21/6/21/23 | 56/57/56/59/51/52 |
| exploiter / profiteer | cards holding a membership in a gaining power; corrupt, grasping, then power | 0/4/7/14/9/9 · 0/2/6/12/12/11 | 0/3/7/14/9/9 · 0/2/6/12/12/11 |
| scapegoat | the seat row / the lever's face, where any of its powers loses | 6/6/11/0/9/8 | 18/21/19/1/12/10 |
| defender | the military power's members by rank; the garrison office; the house | 0/11/13/25/24/23 | 0/11/13/25/24/23 |
| treater | the merchant power's members by rank (contested), else the seat row | 11/5/7/15/18/14 | 29/22/22/22/21/22 |
| collaborator | corrupt with ties; else a gaining power's ambitious member | 0/1/5/11/6/12 | 0/1/5/11/6/12 |
| waverer | the split power's members by rank | 2/4/26/31/32/46 | 2/4/26/31/32/46 |
| face | the occupying power's members by rank | 0/2/4/9/11/17 | 0/2/4/9/11/17 |

The hamlet's levers fall 16 → 6: the role regex named a non-lever house's card (a steward, a merchant) as the famine's lever; the face rule names only a lever house's face, and a hamlet's lever houses (markets, the granary's absence) rarely bear one — those crises mint their temporary person as before, or read the house.

## 2. The measurement, before → after, per tier

The soak 1,000 (`docs/chair/2026-11-07/people-2/aggregate-soak-1000.md`; the base `8fa9de5b8` beside step 3, the instrument `people-2/measure.mjs` + `aggregate.mjs`):

| tier | cast roles filled | of them people | lever holders (of levers) | holders that are the lever house's face | seat row filled (rank 1) |
|---|---|---|---|---|---|
| thorp | 212 → 224 | 100 → 164 | 0 → 0 (of 60) | 0 → 0 | 68 → 167 (68 → 167) |
| hamlet | 264 → 278 | 139 → 205 | 37 → 27 (of 102) | 10 → 27 | 30 → 167 (30 → 167) |
| village | 319 → 327 | 229 → 305 | 55 → 88 (of 103) | 26 → 88 | 54 → 167 (54 → 167) |
| town | 361 → 362 | 271 → 348 | 262 → 352 (of 425) | 67 → 352 | 23 → 167 (18 → 167) |
| city | 342 → 345 | 283 → 333 | 360 → 503 (of 606) | 53 → 503 | 64 → 166 (45 → 166) |
| metropolis | 368 → 370 | 302 → 353 | 432 → 546 (of 675) | 61 → 546 | 76 → 166 (39 → 166) |
| all | 1,866 → 1,906 | 1,324 → 1,708 | 1,146 → 1,516 (of 1,971) | 217 → 1,516 | 315 → 1,000 (254 → 1,000) |

Every lever house with a face is held by it (1,516 = 1,516); the seat row names the governing power's rank-1 face on every settlement. The golden 525 (`aggregate-golden-525.md`): seat 94 → 525 (rank 1 40 → 525); lever holders 599 → 724 of 748, the face 157 → 724; cast roles 489 → 489 (the hamlet's 12 office-held levers fall to the house, 24 → 12 people).

**The Tonight sheet (step 4's proof).** Diffed line by line, per settlement, base → tip, every moved line classified (the classifier is `aggregate.mjs`'s own header):

| corpus | sheets moved | lines moved | NAME (a name) | NAME (the moved person's own role/want/secret/source) | NAME (a person named where none was) | TITLE | OTHER |
|---|---|---|---|---|---|---|---|
| soak, first 300 | 258 / 300 | 3,185 / 11,637 | 784 | 1,102 | 994 | 0 | 305 |
| golden 525 | 489 / 525 | 5,168 / 18,688 | 1,345 | 1,924 | 1,474 | 0 | 425 |

OTHER, each named with its cause — soak / golden: **ORDER** 218 / 344 (the same values in another order: the roster's order IS the structural pass's relevance order — `enrichNPCsWithStructure` returns the cast in score order — and step 3 scores the powers' heads first; 810 of the 1,000 rosters are re-ordered, 0 change membership of the roster except one temporary person; the sheet's person hooks follow the roster); **GOAL** 45 / 69 (the same person's want: the structural template now chosen from the standing, step 3); **LEVER** 32 / 0 (the lever hook names the first lever house that has a holder: now its face, step 1); **CAST** 10 / 12 (a crisis hook's cast row moved, its person, first-rank power and the cast's own reason travelling together, steps 1–2). **STRUCTURE 0, UNEXPLAINED 0**: the sheet's structure is unchanged — every path present on one side only is a person slot (`people[i]`, `crisis.persons[i]`) filled where it was empty, counted under NAME (a person named where none was).

## 3. The registers re-derived, each with its cause and its commit

- **The wiring census** (`node scripts/wiring-census.mjs`, `887154f5c`): `--dry` read 0 rows and 0 bytes moved, the STAMP only (the stamped composer files this lane touched).
- **The observed-shape register** (`887154f5c`): `node scripts/check-observed-shape-readers.mjs` exits 0 at the tip ("2068 finding(s), exactly matching the frozen inventory") — NO new row, NO schema rung. The walker's executed-corpus pin "the producers ran" re-measured per commit: step 1 holds 378/2394/379/80; step 2 (npcInFaction reads memberships; the seat is rank 1) 417/2626/418/80; step 3 (the roster's order, heads first) 399/2518/400/81 — recorded with both causes. Not cross-recorded in news-voice / news-headline / prose-family (red at the base, lane 1's list).
- **The lighting census** (`d1ece15e3`): the refreeze ritual on a clean tree, files 2967 → 2968 (castDerived.test.js), credited 2595 → 2596, titles 27986 → 27993, suiteTitles 7452 → 7455; the plain run green (34/34).
- **Writer reach** (`ad08bf7b8`): `--rebank --charter='§934.105'`, cohort 1416 → 1399, 38 stale folded out, 0 registered rows lit; the check exits 0. Cause: the simulation's per-NPC ledgers (FPZ's) re-deal over this lane's roster (npcInFaction's membership arm; the roster's order). The check was red at the base (53 rows, lane 1's residue): closed in the same act. No identity is a field this lane writes.
- **The fork census**: no new fork (this lane draws nothing). `generationForkCensus.test.js` A1/A6 are red at base and tip alike on the golden control row's hash (the golden door's, M-3).
- **The tuning inventory**: no table this lane did not sign moved; `densityBands.js` byte-identical (M-5). `tuningRegister.walker` P3 is red at base and tip alike on `castPowers.js: 0 -> 1` (lane 1's file).
- **Two lint cures at cause** (`887154f5c`): the arcane-classifier census is line-keyed — the npcProfile alias comment rides the alias's own line, so the classifier stays at 334; the domain any-cast ratchet — `membership.js`'s four `any` casts replaced by a typed `recordOf` (a new file starts at zero).
- **The source-citation roster**: `dated` 94 → 95 for this record (`_rosterGrowth2026-11-07-people-2`).

## 4. The red list

Every suite below was run at this lane's tip AND at the base `8fa9de5b8` with the same command; **no red is new at the tip.**

**The goldens (M-3, red by construction, banked, not re-recorded)** — `tests/property` whole plus the witness and prose-manifest suites, run once: 13 red in 8 files at the tip, the SAME 13 at the base: `generatorGoldenMaster` 1 (the 525), `espionageDormancyFence` 1 (the driven fence 360), `dossierProseManifest` 2 (the drift corpus), `dmLayerGoldenIsolation` 1 (the golden isolation), `heraldKnowledgeDeskGolden` 1, `worldFactRederive` A4/A7 2 (golden byte pins), and two non-golden suites red at the base on lane 1's cast — `institutionRename` A1/A3 2 (the NPC home paths), `editCorpusRatchet` A3/A5/A7 3 (the 63-row edit corpus). The dormancy goldens that hash a roster are green at the tip. Not this lane's: each was red before its first commit.

**`tests/lint` + `tests/scripts` whole** (`sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts`): base 34 red → the lane's first tip run 44 (ten new, every one the lane's, cured at cause in §3) → **the final tip 28 red, 0 new, 6 of the base's cured** (the writer-reach re-bank). The 28, all red at the base: writerReach 8 (the shared corpus pins with the observed-shape register, lane 1's rung), proseFamilyContract 5, newsVoice 1, newsHeadline 1 (the AO-0 year re-dealt by the cast; lane 1's list, not cross-recorded), tuningRegister 4 (`castPowers.js: 0 -> 1`, lane 1's file), heldKeyWriterCensus 2, institutionTable 2, negativeAssertionAnchor 2, generationForkRegistry.contract 1, recordRegisterTotality 1 (`npcs[].memberships` and the grouping's `members[].memberships` undeclared in the record register: PEOPLE-5's, the edit layer), proseWiringCensus 1 (the holder citation `narrativeGenerator.js` line 1037), ledgerCitationIntegrity 1, mutationCoverageManifest 1, implementationPackets 1, provenanceMap 1.

**The 77 related suites** (every test file naming the crisis cast, the hooks, the seat, the ruling chain, `npcInFaction`, `npcStructure`, `structuralRank`, the Tonight sheet or the NPC profile, goldens excluded): base 27 red → tip 16, 0 new, 11 cured (the seat-holder suite whole, the founding-seed probe whole, the soak small-guild check, the Tonight sheet's no-invented-fallback arm). The 16 left, every one red at the base on lane 1's cast (fixture premises the new roster no longer carries — a city holding Mayor and Governor, a thorp's contenders, soak seeds re-dealt): `powerSeatRender` 2, `crisisPageTierNoun` 1 (soak1k-85's hamlet now casts no defender reading "the hamlet's defence"), `tonightSheetCast` 1 (tonight-cast-5: the journal page misses one cast name the print block shows — a journal-page defect for PEOPLE-5's Foundry row, reproduced at the base), `repeatOnceTonightTraditions` 1 (soak1k-12's shared want premise), `terrainPoolsSeat` 1 (a hand-built council expects role "Mayor"; the seat is "the head of Ecclesiastical Council", the mint's fallback title for a power the R-P2 table does not name), `npcCrimeSignalWriters` 3, `rosterDuplicateDraws` 1, `pipelinePinnedChoosers` 1 and `generationForkCensus` 2 (golden control hashes), `worldFactRederive` 2, `phoneChromeFloor` 1. Not this lane's to re-key: none was caused here, and each names a premise lane 1's cast moved (lane 1's step 4 holds the red list).

**The soak 1,000** (`node scripts/audit/soak-review.mjs --count 1000 --workers 4`), at the tip and at the base: **0 errors** both; 2,669 findings → 1,844. Every `cert:*` kind HOLDS (receipt_check_failed 174, receipt_judgment_failed 174, receipt_needs_review 169, relationship_endpoint_name_drift 6). The movers, each with its cause: `coh:seat-holder` 641 → **0** (step 2: the seat row is the governing power's rank-1 face on every settlement); `info:battery-would-not-vouch` 891 → 707 (the battery's seat refusals gone with it); `reader:hook-pools` 156 → 155 (the roster's order, step 3); `reader:tonight-wants` 115 → 221 — a "Wants to" label over a SECRET line: where the sheet's cast or seat person is also the crisis secret-keeper, `tonightSheet.js :: peopleOf` replaces the want with the secret and the print keeps the want's label; the seat row now filled on every settlement puts the seat-holder on the sheet far more often, so the existing defect fires more (the base carries it 115 times, soak1k-0 among them). A label defect in the sheet's print for PEOPLE-5 / the writing wave; not re-worded here (the sheet INHERITS, the brief's step 4).

## 5. FPZ's files, broken by design at birth (M-6)

Nothing under `src/domain/worldPulse/` was rewritten; `npcInFaction` got its one input arm. Files there that read a field this lane changed, listed, not fixed:
- `worldPulse/npcLadderState.js :: structuralRankScore` reads `structuralRank` as `'dominant'` / `'subordinate'` / `'secondary'`; the field now reads `head` / `inner_circle` / `member` / `unaffiliated`, so every card scores 0 there (the ladder's order falls to importance and id, which lane 1's rank band already writes). FPZ re-reads the standing.
- `worldPulse/npcVerdictApply.js` (clears `structuralRank` to `''` on a verdict) and `events/mutateEntities.js :: NPC_STANDING_FIELDS` (writes it): they write the old vocabulary into a field whose reader (`npcProfile.js`) now also takes the new; FPZ's.
- `npcInFaction`'s consumers in the simulation (`assizeKernel.js`, `factionDensityKernel.js`, the ladder) now see a card in EVERY power it holds a membership in, not only its first — the input the car gives (the brief's step 2); the observed-shape and writer-reach corpora moved by it (§3).

## 6. What the writing wave must author (M-4)

No new prose and no pool this lane could not reach: the cast's reasons, the hooks' clauses and the structural templates are today's. Two wordings the writing wave may re-key now that the role is the title: the lever reason "holds the office the crisis turns on" now names a house's face (a miller, a granary reeve), and the structural templates' `dominant` / `subordinate` rows are chosen by standing (head / not) — W4 PEOPLE may author `inner_circle` and `member` rows.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED: every figure in §1–§3 (measured by the committed instrument `people-2/measure.mjs` + `aggregate.mjs` at the base and the tip, the suites' own pins, the doors' printed figures, the per-commit observed-shape corpus builds at `0efc296fa` and `aafc99a54`); the tests/lint + tests/scripts comparison base → tip (34 → 44 red at the first tip run, the ten new cured in §3) and the 77 related suites (27 red at the base → 16 at the tip, 0 new). PLAUSIBLE: the attribution of the observed-shape step-2 movement to the `npcInFaction` arm rather than the seat row (both landed in one commit, not bisected apart); the writer-reach delta's attribution to the same two causes is by its identities' families (simulation ledgers keyed by card id), not by a line trace.

## 8. The tip

The lane's tip is the commit that carries this record (its parent `ad08bf7b8`), pushed to `origin/lane/people-2-cast-2026-11-07` with the bypass; the sha is in the hand-back message. Linear on lane 1's `8fa9de5b8`; nothing merged. Lane 1 may push register or test commits after this base (it changes no card shape); the registers this lane re-derived (§3) are re-taken by the chair's landing after the merge, in its fixed order. The scratch worktree used to measure the base is removed.
