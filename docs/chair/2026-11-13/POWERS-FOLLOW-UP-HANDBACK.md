# COHERENCE-POWERS-6 — the powers follow-up seat's hand-back (2026-11-13)

Lane `lane/powers-follow-up-2026-11-13`, cut from the tip of `lane/integration-2026-11-07` at **e969a75b7**
(read back from origin; the chair read e969a75b7 at 11:34 UTC). Builder: COHERENCE-POWERS-6, session
`session_01FE9mEwQVzTLz7KHawf39CC`. Scratch worktree, `npm ci` there, plain pushes. Every commit touching
`src/` ran the three gates through `sh scripts/gate-tail.sh`, never a pipe. Final code/test tip before the edge
bundles: **7b3f3b692**.

## The chair's rulings this seat worked to (copied in; the chair's messages are not on the branch)

- **Item 1 — A NOBLE POWER IS FACED BY A NOBLE (ruled 2026-11-13, standing, vetoable):** in every town, and not
  only under a succession, a noble power is faced by the head of a landed house on the roster where there is one,
  and otherwise by a lord of that body, minted and named, who is styled a claimant only where the power itself
  claims. Count first over all 4,305. The face reads at that body's standing, not at a keyword's band; a minted
  claimant takes the band of the seat it claims. Minting on its own registered fork; the fork census proves no
  existing draw moves. Declare who is minted and which cards change.
- **Item 2 — KEEPERS WHO HEAD A CONTENDER (ruled, vetoable):** the keeper of a vacant seat heads no contender;
  the lane already drops a keeper's party memberships by rule, and this is the same rule one step on. The
  contender is headed by its own next person, minted and named where the roster has none.
- **Item 3 — THE SIX TRUE HOUSE LINES the enrichment cut drops when a claimant is added:** restore them, and
  prove that none of the 56 false lines the lane removed comes back.
- **Item 4 — THE PAGE GUARD misses a planted subordinating clause:** plant it red first, then widen the guard;
  each plant reddens its own check alone.
- **Item 5 — A MINTED PERSON'S GENERATED FACTS:** do they reach any surface? The kinds whose unshown count rose
  at point 46 (weakness, the two last-targeted fields, an elected reeve among the leaders' ids). For each: where
  written, every surface that can print it, the count. A fact shown nowhere is reported, not cured; the ceiling
  of zero on a NEW unshown fact is never loosened. Cure only where a false sentence prints.
- **Item 6 — THE TAUTOLOGICAL ARM of the restored pin (castPowers.test.js, the zero arm):** make it test what
  its name says, proved by a plant. A pin is made stricter, never looser.
- **Item 7 — THE TWO MEASURES the merge seat left as plausible at point 46:** the corpus ratchet's two new
  non-commuting towns, traced leaf by leaf; the exposure band's mutant, re-run. Confirm or refute by execution.
- **Item 8 — "the craft guilds's standing":** a plural power's name given a singular possessive (the preset
  witness's full-simulation row and the news). Its cure belongs in the possessive leaf
  (src/domain/display/powerSentenceName.js): red first, then every surface that prints a power's possessive.
- **THE LAWS:** the same person holds every seat unless item 1 or 2 names the change; no label, band or score
  moves outside what those two declare; a fact has one home; new words obey the owner's style law and are
  declared; THE PAGE SHOWS RATINGS, NEVER THE MACHINERY; a count falling is not a cure; a claim of zero names the
  instrument that looked everywhere the words can print; stored data is tested as the deployed client stored it;
  a register moves only through its own door, and where the door is the chair's or the merge seat's, name the row
  and go on; a red is classed against the lane's reviewed base as well as the line.

## The corpora

The review's **720** (the census's `births.mjs`, DEFAULT_CONFIG + the browser's dials) and the lane's **4,305**
(R the reviewer's 1,845 with the golden's 525; S the second seat's 2,460), every birth before (e969a75b7) and
after (the final tip), plus fresh `pfu-*` births this seat did not tune on. Probes in the seat's scratchpad
(mirrors of COHERENCE-POWERS-4/5's `whole.mjs`, `corpus.mjs`, `sameseat.mjs`, plus `nob1/nob2/keeper/rankdiff/
infl/lostlines/inplace` and the two item-7 probes and `twinband/pace`).

## Per item (before → after; executed, not claimed)

### Item 1 — a noble power is faced by a noble, at its standing (9fae351e1; `tests/generators/people/nobleFaces.test.js`)
`castPowers.js`: `NOBLE_BODY_FACE` (the lord's own houses — Lord's steward / appointee / Noble governor, Lord's
reeve, Royal seat, whose face heads the body where the house's largest loyalty lands on it; the standing → band
table from `powerLabel`); `landMemberships` mints the lord (CLAIMANT_FACE's row, "the lord") on the existing
keyed family `people-powers::mint::<slug>`, AFTER every existing mint; `rankPowers` takes the landed head first
where no mint stands; `nobleFacesAtStanding` raises (never lowers) the first to its standing's band and a minted
claimant to the seat's (`raiseToBand`, draw-free).
- **Non-governing noble powers faced by a miller / college master / impresario / mine captain / theatre manager
  / peat-reeve / no one: 856 → 0 (4,305; succession births 53 → 0); the 720: 126 → 0 (12 → 0).**
- Minted: 856 lords (791 roster bodies calm + 53 in succession births + 12 stress-row noble blocs). No card
  removed. Bands: the 856 new lords read at their body's standing (low 423 / moderate 420 / high 13); the old
  families' minted claimants low → high 114 (10 stay low: thorp/hamlet, the Elder's seat band); 51 hamlet
  stewards heading a noble body low → moderate. **No other card's influence moved.** The 23 minted claimants on
  the 720 read at their seat's band (22 high, 1 hamlet low).
- The seat's person: **the same in 4,305 of 4,305**. No label moves (coup, capture, government, power labels,
  stability, legitimacy): 0 births. Births differing: 938 of 4,305 (golden's 525: 320).
- **THE FORK CENSUS (base vs tip, A1's draw figures by seed):** +5 streams, every one keyed to a new lord
  (`people-powers::mint::landed_gentry` and its hook, allegiance, ties and goals forks on the minted id); no
  stream lost; 5 existing streams change their call count (the displaced miller's ties and goals, the baker's
  ties, the prominent relationship, faction conflicts), each a reader of the re-ranked cast. **No existing draw
  moves to a NEW carrier beyond the new lords.** generationForkCensus A1 (control hash; mints 139 vs 138) and A6
  (external fnv1a32 16 → 15, one conflict pair no longer drawn) are the merge seat's named rows, moved further.

### Item 2 — the keeper of a vacant seat heads no contender (535b58fce; `seatKeeperContender.test.js`; oracle ripple 28e740b34)
`castPowers.js`: `keeperLeavesTheContest` (after the ranks): the keeper's rank-1 in a power `coupContenders`
names a challenger passes to the contender's next member; the keeper stays a member, unranked. `keeperHouseKeyOf`
names the keeper's house at the land so a contending noble body whose only landed head is the keeper mints its
lord (item 1). Draw-free outside that mint.
- **Keepers first of a contender: 25 → 0 of 194 vacancies (4,305); the 720: 7 → 0 of 31.** Minted: 6 lords. Ranks
  moved only inside the five contending powers; no existing card's influence moved; the seat's person the same in
  4,305 of 4,305; no label moves. Births differing from item 1's tree: 25.
- **SEEN, NOT CURED (outside the ruling's word "contender"):** keepers first of a power the page does NOT list as
  contesting the seat — 10 of 194 (Merchant Guilds 6, The Commercial Circle 2, The Merchant Bloc, The Trade
  Compact); the 720: 2 of 31. With the 7 cured they are the review's "9 of 31".
- **The ripple (28e740b34):** item 2 broke `castPowers.test.js`'s I-5 floor oracle (a re-implementation of the
  floors that did not mirror the keeper re-deal). Owed from item 2's landing (rule 40 addendum (b)); the oracle
  now treats a floor pick equal to the keeper, on a vacancy contender/succession power, as legitimately re-dealt.
  (Note: I committed item 2 before running the module's governing suite; the oracle fix landed one commit later.)

### Item 3 — a minted lord pushes no true line off a card (7c6373e80; `mintedLordKeepsLines.test.js`)
`npcStructure.js :: enrichNPCsWithStructure`: the TOP_N cut is taken over the cast LESS the minted lords
(`isMintedLord`), so each dealt card keeps its place among the cards the cast was dealt; a minted lord keeps the
lines it reads within the whole cast's cut. No line is new.
- **The review's six true lines are on their cards again, 6 of 6** (two now read the line of the rank behind the
  lord, which heads the old families' body since point 46).
- **None of the 56 false lines the lane removed comes back: 56 of 56 still gone** (e86d069be → tip).
- Cards gaining a line (item-2 tree → here): 52 on the 720, 234 on the 4,305; none says "Holds the seat"; **no
  card loses a line.** Against the line base, the 720's 44 lost lines are all a card whose noble body is now
  headed by its minted lord (the card stands second; its line is its rank's).

### Item 4 — the page guard reads every structural line (eadd1de72; `tests/components/seatHolderOnThePage.test.jsx`)
G1 (LOW): check (2) read only the first card paragraph; a subordinating constraint/goal/clause beyond the
position passed. Widened: `holderStructuralLines` reads the position, the "Constraint:" line and the "Wants" goal;
`SUBORDINATE` gains the pool's subordinate-tail markers and the plants' clauses. **Red first (a new G1 arm, three
plants — a position clause, a constraint, a goal — written over a real holder's field, rendered):** under the old
narrow detection all three pass undetected; widened, each is caught and the control is clean. The two live arms
stay green (the real pages carry no subordinating holder line). Test-only; no generator output moves.

### Item 5 — a minted person's generated facts (REPORT ONLY, no cure)
The four kinds — **weakness, lastTargetedTick, lastTargetedBy** (written in `src/domain/worldPulse/npcAgency.js`
on `npcStates`, per NPC id) and **elected_reeve on leaderNpcIds** (`powerStructure.leaderNpcIds`, the leader id
per power slug) — are all ALREADY-BANKED kinds/shapes in the writer-reach register
(`scripts/.writer-reach-baseline.json :: darkUnregistered`): weakness 219 members, lastTargeted* 9 each,
`<id> on npcs` 22, `elected_reeve on leaderNpcIds` already banked. **They reach NO surface** — they are in the
writer-with-no-reader register by construction (the walker scans every surface root: components, display read
models, PDF, world book, Foundry, Herald). **No false sentence prints → no cure.** This seat writes none of these
fields (grep of the touched files is clean); the pulse (`npcAgency.js`) deals them to the cards that exist, and
this lane only re-deals which cards exist (the new lords) and their ranks — a **carrier swap of banked kinds onto
re-dealt ids**, the merge seat's governed-growth door (point 46 record 09:41). **writerReach is red at the tip**
(21 new dark members: weakness/proud/lastTargeted* on `npc_power_landed_gentry`, `npc_power_noble_families`,
`npc_mill`, `npc_barracks`, …; 9 stale banked members), every member a banked kind on a new/re-dealt carrier —
**NAMED here as the merge seat's re-key, not banked by this seat.** The ceiling of zero on a NEW unshown kind is
untouched (no new kind). RECOMMENDATION to the merge seat: re-key the writerReach baseline at the merge as at
point 46.

### Item 6 — the share arm's +0 check (7e01adea4; `castPowers.test.js` N8)
The old arm `Object.is(m.share, 0)` INSIDE `m.share === 0` was a tautology (falsifiable only by -0, which the else
arm also rejects). Rewritten to the invariant the name claims: `if (Object.is(m.share, 0)) expect(office)` — a
clean +0 is the dual-hat office's signature and no one else's. Behaviour identical on every input (not loosened);
the +0 case now carries a live assertion. **Proved by a plant:** a +0 over a positive non-office membership makes
assertPowers throw; a -0 on the office throws; the control passes; with the arm neutered the plant fails to throw.

### Item 7 — the two measures (EXECUTED; no code)
- **7.1 CONFIRMED — the corpus ratchet's two new non-commuting towns, leaf by leaf.** editCorpusRatchet A5's seat
  pairs (4 → 6 at point 46) traced: all 24 ordered pairs (6 towns × E1|E6, E2|E6, E6|E1, E6|E2) differ in EXACTLY
  one leaf family — `simulationTrace[].causes[].effect` ("N npcs", the population step's trace count) — every
  world field identical in both orders. **Trace-only, as the merge seat conjectured.** (editCorpusRatchet A3/A7
  move further at my tip — 711/289/2182 and the instrument-idle 330; the merge seat's named rows, generator
  output re-dealt.)
- **7.2 — the exposure band's mutant, re-run (SIGHT_TUNING is frozen at import, so planted at the source; the
  merge book's own `twinband.mjs` could not set it).** At the tip: live scandals 27, mobilizations 10, dark twin
  9; the **0.06 mutant** → scandals 41, mobilizations 15; U1 headless pace → 140 falls (ceiling 40), lives 14–18
  weeks (floor 52). **CONFIRMED the U1 arm still catches the mutant (140 vs 40; lives under the floor).
  REFUTED the implicit claim that the scandal ceiling catches it: the mutant's 41 sits INSIDE the band [27, 57],
  so that arm no longer separates it.** The guard stays sound (U1 catches); statecraftExposureBand is GREEN at
  the tip (live 27 ≥ 27; scandals ≤ 57; mob 10 ≥ 2). RECOMMENDATION to the merge seat: if the second arm's catch
  is wanted back, re-key the scandal ceiling to ~39 (mutant − 2) by the test's own method.

### Item 8 — a power's (and a suppressed institution's) possessive through the leaf (7b3f3b692)
`factionCompetition.js`: the `faction_institution_suppression` line read a `{targetS}` formed by `powerPossessive`
(the leaf), not a literal "'s". `powerSentenceName.js`: the leaf's plural rule widened — a plural bares (-ies, or
any -s) except the singular endings -us/-ss/-is; the old rule MISSED a vowel+s plural ("Noble Houses's", "market
squares's") and WRONGLY bared a singular -ss ("duchess'"). **Red first:** the leaf arm reds on "Noble Houses's",
the real-run arm (lf-003/-007/-014, whose "working to break …" is a QUEUED proposal) reds on "…s's standing".
**No birth record moves (0 of 4,305; the leaf's only reader is the pulse kernel). The preset lighting witness's
full_simulation row MOVES by this cure** — named red at the tip for the merge seat's golden door (the merge book's
§2g charge). The file held at its 800 code-line ceiling (the possessive folded into the fill literal, no line
bought).

## The whole-lane field diff (base e969a75b7 → final tip, both corpora, `wholediff.mjs`)
**953 of 4,305 births differ** (rvw 126/600, rvf 123/720, golden 320/525, critique 81/660, l2 303/1,800).
**16 families, every one the cast and its readers:** npcs, relationships, prominentRelationship (6 leaves),
generationCoherenceReceipt.judgments, powerStructure.conflicts / conflicts, pressureSentence, simulationTrace,
stress.cast / stressors.cast. **No label moves** (coup, capture, government, power labels, stability, legitimacy).
**No economy, institution, service, economicViability, historicalEvents, publicLegitimacy or settlementReason
family moves** (this lane changes no government, unlike point 46). The seat's person is the same in 4,305 of
4,305.

## The final statement (at the final tip)

### Counts before → after (e969a75b7 → the tip; same seeds; fresh `pfu-*` births in the pins)
| class | 4,305 | the review's 720 | fresh births |
|---|---|---|---|
| non-governing noble power faced by a non-noble (item 1) | 856 → 0 | 126 → 0 | nobleFaces: 78 fresh births (6 sizes × 13), 0 misses |
| minted claimants below their seat's band (item 1) | 124 of 124 low → 10 (thorp/hamlet, the Elder's band is low) | 23 of 23 → 1 (hamlet) | — |
| keeper first of a contender (item 2) | 25 of 194 → 0 | 7 of 31 → 0 | seatKeeperContender: 48 fresh succession births, 0 |
| the review's six true house lines (item 3) | — | 0 of 6 → 6 of 6 on their cards; the 56 false: 56 of 56 still gone | mintedLordKeepsLines property arm, 36 fresh births, 0 |
| subordinating holder line caught by the page guard (item 4) | — | plants: 0 of 3 caught → 3 of 3 | — |
| "…s's" plural possessive in the pulse's power-move lines (item 8) | — | lf-003/-007/-014: 3 seeds red → 0 | — |

### The census counter (SECOND-WAVE-CENSUS, `origin/lane/second-wave-census-2026-11-12`, both trees rendered, 720 each)
**Every row equal, base against tip: no row rises, none falls, none is new** (GLANCE towns 713 → 713; median rows
per town unchanged). The comparison is filed beside this hand-back (`POWERS-FOLLOW-UP-census-compare.txt`). So no
row is origin, a stop or exposure. (Item 1 adds cards and item 3 lines, but none prints any pattern the counter
counts.)

### The six golden surfaces, and every row of the register (`POWERS-FOLLOW-UP-shift-record.DRAFT.json`)
The register holds **51** surfaces. **MOVED 6, UNMOVED 45, each by measure.** No golden door was run.
| surface | state | measure at the tip |
|---|---|---|
| generator golden master | MOVED | 320 of 525 configurations (items 1–3) |
| espionage dormancy fence | MOVED | the driven 360's hash 47f29d1c… against f3f4be91… |
| Herald knowledge desk | MOVED | hash 86075798… against 3e0c6d3a… |
| PDF golden (pdf.6) | MOVED | its one snapshot (the canon town's cast) |
| dossier prose manifest | MOVED (further; red at base) | drift cells 73,388 → 73,324, drift rows past the 1,000 cap (998 at base); audience 204 at both |
| preset lighting witness | MOVED | ONE row, full_simulation, by item 8 alone (green at the item-3 tree) |
| the other 45 | UNMOVED | their 45 suites run together at the tip: 45 files, 328 tests passed, none skipped |

### The whole suite (`npx vitest run --maxWorkers=2 tests` at 7b3f3b692, the ledger fetched first; to a file)
3,227 files (35 failed, 3,184 passed, 8 skipped); 38,974 tests: **55 failed** + the two file-level news walkers =
**57 failing titles**. The 35 failing files run again at the base e969a75b7: **12 of the 57 are red there too**
(landingFixtureFreshness 2, foundingWorldBones 1, newsHeadlineContract and newsVoiceContract file-level,
proseFamilyContract 4, dossierProseManifest 3: the line's carried set, unchanged in kind; the manifest moved
further, above). **The 45 red at the tip only, every one classed:**
| class | titles | whose |
|---|---|---|
| the goldens | generatorGoldenMaster, espionageDormancyFence, heraldKnowledgeDeskGolden, pdf goldenViewModel, presetLightingWitness (5) | the merge seat's door, under the draft record |
| the golden null-change pins | dmLayerGoldenIsolation A7, worldFactRederive A7, editWorldFactResources A2 A6, nameHeldThroughAssembly A1, pipelinePinnedChoosers A1, pipelinePinnedMode A1 A2 A5, rosterFinalUnderHeldRoster A1, powerEconomyFreshness A4 (11) | green when the goldens re-record |
| digests re-taken by their writers | x46NpcBand, institutionBudgetPromise, intentAtlasSoakDistiller (3) | the merge seat |
| measured figures moving with the cast | hookThemeDraws, generationForkCensus A1 A6, editCorpusRatchet A3 A7, mergeLadderHeldKeys A3 (6) | the merge seat (point 46's class) |
| registers | writerReach 9, observedShapeReaders 1 (10) | the merge seat's growth door (item 5) |
| composed prose | proseFamilyContract A6 (1) | the merge seat (point 46's A2 class) |
| the edge bundles | engineBundleReplay 2, engineServiceStoreParity 1, edgeSharedBundleReproducibility 1 (4) | leave with the last commit (re-emitted, below) |
| THE LANE'S OWN, PARKED (files other lanes change) | mutationCoverageManifest TOTALITY, dossierPhoneFloorAllViews 2, sovereigntyLightingContract (4) | see "Parked" |
| THE LANE'S OWN, CURED | locksEngine (1) | 05f1ca96c, re-keyed by identity |
11 + 5 + 3 + 6 + 10 + 1 + 4 + 4 + 1 = 45. **No unclassed red.** Refs and local config compared before and after
every suite and push: unchanged but for this lane's own branch and the fetched refs.

### Gates
At every commit touching `src/`: domain-strict 1,113 (ceiling 1,113) exit 0; typecheck:ratchet 167 (167) exit 0;
eslint on the touched files exit 0. Both pushes ran the hook's three gates, plain: exit 0.

## Parked (one list, sent once with the hand-back; each a register on a file another lane in flight changes)
1. **`scripts/mutation-coverage-manifest.json`** (changed on all six lanes in flight): TOTALITY wants rows for the
   three new tests. Ready to paste, kind `rationale`, each EXECUTED red first in this lane:
   `tests/generators/people/nobleFaces.test.js` (3 of 3 red at e969a75b7, green at 9fae351e1; literal titles and
   bands, an independent oracle); `tests/generators/people/seatKeeperContender.test.js` (3 of 3 red at
   9fae351e1, green at 535b58fce); `tests/generators/people/mintedLordKeepsLines.test.js` (2 of 2 red at
   535b58fce, green at 7c6373e80; its property arm re-runs the enrichment with and without the lords).
   RECOMMENDATION: the merge seat adds the three rows at the merge (row-keyed; no conflict).
2. **`tests/components/dossierPhoneFloorAllViews.test.jsx`** (changed on w2-a-leaves, w2-write, w2-fix-data):
   every move at 9fae351e1 (item 1's minted lord in the fixture city), none later. MOBILE: Summary/Plot Hooks prose
   86 → 87; World/NPCs prose 281 → 286; World/Relationships chrome 36 → 35, prose 138 → 140, sub14 36 → 35.
   DESKTOP: Summary/Plot Hooks 87 → 88 (measured and sub14); World/NPCs 282 → 287; World/Relationships measured
   174 → 175, sub14 172 → 173. No token moved; sub12 0 everywhere. RECOMMENDATION: re-measured at the merge with
   this cause.
3. **`tests/lint/.lighting-census-baseline.json`** (changed on five lanes): the estate's test-file count 3,224 →
   3,227 (the three new tests). RECOMMENDATION: re-frozen by its own door at the merged tree, as at every point.

## Seen, not chased
- Keepers first of a power the page does not list as contesting the seat: 10 of 194 (the 720: 2 of 31). Outside
  the ruled word; with the 7 cured they are the review's 9. RECOMMENDATION: the chair rules whether the rule
  extends to every non-governing power.
- The noble pool's "Belongs to a lesser old family, behind the leading one." reaches tradespeople through their
  own category (6 of the 52 lines item 3 brought back: a sage, a weaver, a carpenter, an innkeeper, a ferryman,
  a bowyer; and 26 of thirty read of the 44 lines item 1's re-ranking removed). The pool's keying is not this
  lane's.
- statecraftExposureBand's scandal ceiling no longer separates the 0.06 mutant (41 inside 27–57; U1 still does).
- The census's GLANCE row 16a stays 184 (the counter's window, as point 46 said).

## New words for the owner's veto
- **"the lord"** now faces every non-claiming noble body that has no landed head (an existing title, F3's claimant
  mint; no new pool row, no honorific or hook register gains a row). It is styled a claimant nowhere: the seat
  row lists only the claimant powers.
- **The possessive "…s'"** where "…s's" printed ("the craft guilds' standing"; the leaf now bares "Noble Houses'" too): a spelling
  rule, no new line.
- No other printed word is new. Items 3, 4 and 6 print nothing new; item 2 moves ranks only.

## Honesty notes
- I ran an unintended `git stash` once in the scratch worktree after item 2 and popped it at once; and a bisect loop
  for I-5 stashed four times. All five were dropped after checking that src matched the commits; the real
  repository's stash list is empty and its refs and config are unchanged.
- I committed item 2 before running its module's governing suite; the I-5 oracle it broke was cured one commit
  later (28e740b34).
