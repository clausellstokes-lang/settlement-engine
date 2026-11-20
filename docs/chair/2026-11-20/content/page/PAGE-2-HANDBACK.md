# PAGE-2's hand-back (written 2026-11-20 12:45 UTC by `date -u`; handed over on the chair's order of 12:44: the token mark passed)

PAGE-2 integrates; builders build (the Agent tool, each briefed by a committed file). Read this, then the briefs in
`briefs/` (BUILDER-RULES.md first). Base: the working line `lane/join-2026-11-14` at **0c9069489**; my lane
`lane/page-2-2026-11-20` holds briefs and docs only. **NOTHING IS MERGED YET**: no code is on my lane.

## 1. Every ruling in force (the chair's messages of 11:24 through 12:36; where a brief differs, THIS list governs)

1. **S6** (brief `briefs/T1.md`): anchored tensions (description = the template's canonical) rotate among canonical + the two
   spares by `pickVariant` on `${config._seed}::tension::${type}`, no draw. The spares are PAST tense: unanchored forms are
   untouched. The dead 'overwhelms' branch: NOT mended, accepted (crime_wave can never be on the timeline:
   `TIMELINE_CATEGORY_TYPES` holds it in no category, so that branch's text never survives `tensionByMemory`). The legitimacy
   tension keeps its canonical (its held twin is keyed by those words).
2. **L1** (brief `briefs/T2.md`, amended): NEW present-tense wordings for the UNANCHORED form, THREE a kind first, for the eight
   kinds that repeat most (by share of word-for-word pairs: crime_wave 47.9%, guild_conflict 25.8%, external_threat 2.8%,
   outside_debt 2.6%, corruption_scandal 2.2%, wild_magic 2.0%, great_flood 1.7%, tyranny 1.7%); two a kind for the rest only
   if the measure still says so. TARGET: three same-size forges in a row share a tension text UNDER 10% (39.9% at base; by size
   below). Each a way to SAY the same tension (never a new tension, fact, secret, crime). The chair reads every line in
   batches of about fifteen, each beside its kind's existing sentence, before merge. Builds ON S6's tip (same files).
3. **L2 / PART A** (brief `briefs/L2.md`): the arrival paragraph's thin pools deepened, about 80 lines, APPENDED only; a
   culture custom must be true of the culture as its card describes it; to the chair before merge.
4. **THE SIDES ARE DISPLAY, NOT STORED** (11:58, 12:10): NO stored side changes (`history.currentTensions[*].factions` keeps
   the template words: the session sheet's `troubleCast.js :: templateLabelOf` on origin/lane/frame-5-2026-11-20 matches them).
   Data only: `src/data/tensionSideMeanings.js` (brief `briefs/S7.md` SECOND CUT), keyed by a side's own WORDS, each row
   listing every (kind, form, slot), with `means` / `presumes` / `without`; ALSO an index BY SLOT (kind → form → slot → row)
   for the slots the generator writes a power's name into; totality over all 147 slot occurrences. The two generator faults
   ("Wealthy merchants" after a non-economic power: 4 of 7 economic_disparity; "the criminal network" with no criminal power:
   19 of 77 crime waves, all 19 with none) JOIN THE TABLE AS ROWS, not generator cures. The DISPLAY seat (PAGE-1) builds the
   reader. S8 (naming generic sides from powers) is the display seat's now. The chair wants, in ONE message: the table as plain
   text + the side-reader census (`SIDE-READERS.md`, committed 837394d8f), then the data file's commit.
5. **L4** (brief `briefs/S-v2.md`): the secret draw EXACTLY as today (the held set keeps the drawn text); THEN, draw-free, an
   office card takes a row of the NEW `src/data/people/officeSecrets.js` by `pickVariant(rows, `${name}::officeSecret::${title}`)`
   (the card's drawn name + title: ACCEPTED; the town seed is not reachable there without breaking replay). ROTATION TOOTH: the
   pick walks past a row another card of the town shows; rows exhausted: keep the drawn secret if admitted, else the last row,
   COUNTED. `TITLE_SECRETS` and its two 147-pins untouched. 11 titles (the magistrate shares the chief magistrate's rows, the
   captain of the watch the watch captain's; the watch commander already has TITLE_SECRETS rows). COUNTED CLASS ACCEPTED
   (12:31): 48 other cards in 29 towns, "re-dealt after an office secret by a town-level coupling": the seam mints' held set
   of printed texts (12; `src/generators/people/castPowers.js`, its CarriedSecrets) and the override pass's one shared stream
   (26 presentations, 11 secrets; `src/generators/narrativeGenerator.js`, the roster walk). CONDITIONS: the confinement traces
   each of the 48 to one coupling (else a finding); each of the 11 re-dealt secrets is an ADMITTED line for its card (S9's walk
   runs on every card: give the count); both couplings listed as survivors (section 6).
6. **S9** (S-v2): the role-free pool's office/trade lines tagged by holder class, beside the table (never on the row); a misfit
   card walks to the next admitted row, draw-free, by a CARD-LEVEL `admits` that also refuses a VENAL row (the
   `incorruptible` money words of `SECRETS_DENIED_BY_TEMPERAMENT`) to a `principled` card (PAGE-1: 1,014 of 5,452); the guard
   table is NOT edited. Then **S3**: the census guard (S.md section S3, "own rows" = TITLE_SECRETS or OFFICE_SECRETS).
7. **PART K (L3)** (ruled 11:36 and 11:48; NO BRIEF WRITTEN YET): ONE unit, a PLAIN correction in `npcGenerator.js ::
   powerBandOfRole` (the keywords matched with '_' and ' ' folded: Guild Master 221 cards and Thieves Guild Master 34 to high,
   Council Member 18 to moderate: 273 cards in 151 towns). NO old-band alignment; `createTieProseDraw`'s town rotation NOT
   re-keyed (another seat is in it). Confinement in FIVE CLASSES, nothing outside: (1) corrected cards' `influence`, `power`,
   `structuralPosition`; (2) ties touching a corrected card (archetype, strength, prose, stored index) and goals reading them;
   (3) other ties of the town: `description`, `tension`, `proseVariant` ONLY (2,754 on the 300), and `prominentRelationship`'s
   quoted strings where they quote a moved tie; (4) the crisis cast where card power broke a tie (`crisisCast.js ::
   exploiterCandidates`, `collaboratorCandidates`, `smallNameBacked`) with its twin and receipt; (5) goals of cards dealt
   AFTER a moved goal, re-dealt by the goals deal's town held set (`goals.js :: cellCandidates`; 12 on the 300, two change
   kind/target: the metropolis woodcarver enter/Craft Guilds → tense/Merchant Guilds, the pawnbroker's rival_enemy wording),
   reported apart. TRIAL through the two-tree tool on the golden 525 and census 720 before the build. THEN the WEALTHIEST
   MERCHANT as its OWN commit (a new stem, to the band of "wealthy_merchant": moderate), its counts apart. A GUARD: every band
   keyword matches ≥1 pool role, every pool role's band in one census. THE OWNER'S COUNTS in plain words (cards by band before
   and after; firsts of a power reading low before and after; towns where a crisis role changes hands, two examples; that the
   session sheet, quick guide and PDF will now name guild masters) and the chair's sentence: "the world's pulse reads a
   FACTION's influence, not a card's: the correction does not change the simulation in play; it changes who the pages call
   important, a tie's kind where the weights are far apart, and a crisis role where power breaks a tie", with the example of
   the senior craft-guild master from low and 2 to high and 9. `npcGenerator.js` is ALSO touched by L4 (its call site): one
   builder at a time; K after L4 commits. Readers census: in this file's section 5.
8. **Every unit CONFINED** by the two-tree tool (`git show origin/lane/names-3-2026-11-20:docs/chair/2026-11-20/content/tools/confinement/<file>`
   into a scratch folder; `node trees.mjs <before> <after> <workdir> [--words=…]`) on the golden 525 and census 720; anything
   outside the unit's classes goes to the chair at once. Base births are cached for 0c9069489 / 6cb2766c4 (0 differences
   between them) in the scratch workdir below, if the container survives.
9. **Heavy gates serialized** through `scripts/gate-mutex.sh` (the container ran out of memory with three builders at once).
10. **Another seat reads secret rows by text**: tell the chair the same hour if any EXISTING secret row is reworded or re-keyed
   (none so far).

## 2. Each unit: state, branch, commit, what is owed

| unit | state | branch / worktree (this container) | commit | owed |
|---|---|---|---|---|
| S6 | BUILT, diff READ by PAGE-2, red (2 failed on base) and green (5/5) RE-RUN by PAGE-2; a follow-up OUT | `page2/t1`, /home/user/wt-page2-t1 (LOCAL, not pushed) | 12dc0f96c | the builder's follow-up commit (re-anchor `bar4HistoryOneTelling` (b) by computing, not quoting; the mutation-manifest row; ledgerCitationIntegrity re-run after fetching review-fixes-2026-07-08), then the integrator's merge: the lighting census and wiring census by their own doors, the confinement run, the measure after (by size). 17 of 107 tensions moved on 60 towns. |
| L1 | NOT DISPATCHED | (cut from S6's tip) | | dispatch after S6 merges; brief `briefs/T2.md` |
| L2 | BUILDER OUT, uncommitted | `page2/l2`, /home/user/wt-page2-l2 | | hand-back; read its diff; lines to the chair (snapshot below, UNREAD) |
| sides table (S7 second cut) | BUILDER OUT, uncommitted | `page2/s7`, /home/user/wt-page2-s7 | | hand-back (incl. the BY-SLOT index sent 12:2x); the table + `SIDE-READERS.md` to the chair in ONE message, then commit |
| L4 | BUILT, uncommitted; ruled; seven lines being reworded; then commit | `page2/s`, /home/user/wt-page2-s | | its commit with the 48 traced; the seven reworked lines to the chair in one short message |
| S9, S3 | after L4, same builder | `page2/s` | | as rulings 5 and 6 |
| K | RULED, NOT BRIEFED | | | a brief (ruling 7), the trial, then build after L4 |
| S8 | the display seat's | | | |

## 3. Builders still out (Agent tool, this session; a successor resumes none of them: their hand-backs return here)

- the S6 builder: `briefs/BUILDER-RULES.md` + `briefs/T1.md`, worktree /home/user/wt-page2-t1 (follow-up in flight)
- the L4/S9/S3 builder: `briefs/S-v2.md` (+ S.md), worktree /home/user/wt-page2-s
- the sides-table builder: `briefs/S7.md` (second cut), worktree /home/user/wt-page2-s7
- the L2 builder: `briefs/L2.md`, worktree /home/user/wt-page2-l2

## 4. The measures: one command each (from the repository root; outputs beside them in `measures/page-2/`)

- `node docs/chair/2026-11-20/content/page/measures/page-2/measure.mjs "$PWD" 50 <out.txt>`: T (kinds by share; forms
  printed; three-forge repeat by size; lacking sides), S (misfit secrets by calling and size), K (influence). Base output:
  `measure.before.out.txt`. AT BASE: P(two of three same-size forges share a tension text) 39.9% (thorp 2.1, hamlet 6.3,
  village 22.9, town 43.8, city 83.3, metropolis 81.3); random triples 30.7%; forms: unanchored 71.3%, canonical 16.5%,
  written for the town 6.2%, spare 4.5%, dated 1.6%. Misfit secrets (a FLOOR, hand-tagged): clergy 9.8%, justice 9.9%, watch
  1.1%. Influence: low 88.6%. (Its legal-side regex was corrected after the base run: "advocate" removed.)
- `node …/pairs.mjs "$PWD"`: each kind's share of word-for-word pairs (picks L1's kinds).
- `node …/subst.mjs "$PWD"`: the two generator side faults, counted.
- `node …/kTiesTrial.mjs <base-tree> <patched-tree>` (G12=<out.json>): K's tie/goal classes on PAGE-1's patched copy
  (`origin/lane/page-1-2026-11-20 :: docs/chair/2026-11-20/content/page/measures/C/patchBand.mjs` makes it); output
  `kTwelveGoals.json`. Result: 3,357 ties moved, 603 touching a corrected card, 2,754 others in description/tension/
  proseVariant only; 323 goals moved, 12 on cards neither corrected nor tied to one.
- PAGE-1's own scripts (A, C/f5, C/patchBand) reproduce EXACTLY at 0c9069489 (re-run by PAGE-2, outputs diffed empty).

## 5. K's readers of `influence` / `power` (EXECUTED census, key rows spot-read)

AT BIRTH: `castPowers.js :: raiseToBand` (leaves a card at or above the office band alone); `npcStructure.js ::
positionForStanding` (low head → the "word counts for little" twin); `crisisCast.js :: exploiterCandidates`,
`collaboratorCandidates` (power breaks ties), `smallNameBacked` (power 1–3 reason text); `relationshipArchetypes.js ::
computeRelTension` (|power gap| ≥ 4 → mentor_legacy/old_debt, a coin on the from-card's own tie fork). AT PLAY: top-N sorts
(`settlementQuickGuide.js :: selectImportantPeople`, `tonightAtTheTable.js`, `tonightSheet.js :: peopleOf`, SummaryTab top 6,
SessionMode top 8, `warResolve.js :: readLeadership`), the PDF (`viewModel.js` sort, `NotableNPCs.jsx` major tier at power ≥ 8,
`headlines.js :: npcsHeadline`), `plotHooks.js :: collectPlotHooks` priority, `dossierSearch.js` prominence, the people page's
counts and filter (`NPCsTab.jsx`, `npcComponents.jsx`), `generateCampaignPDF.js` key NPCs, `aiLayer.js` keyNPCs; telemetry
(`structuralFingerprint.js` influence_dist). The world's pulse reads FACTION influence only. PINS: `tests/generators/roleCategory.test.js`
mirrors the keyword arrays verbatim; the generator golden master; seed rows in `bar5PowersStanding` and `bar2Places2Rows` (C3396).

## 6. Survivors for after the deploy: one family (a town-level set or stream that makes one card's change reach another)

- `src/generators/power/relationshipArchetypes.js :: createTieProseDraw`: each archetype's lines rotate through a TOWN
  counter; one tie that changes kind re-deals every later tie of that kind (K's class 3).
- `src/generators/people/goals.js :: cellCandidates`: the town's held goal texts are filtered BEFORE the draw, so a moved goal
  re-deals later cards (K's class 5; the goals seat's own rotation unit may cure it).
- `src/generators/people/castPowers.js` (the seam mints' CarriedSecrets held set, built from PRINTED texts): a freed text is
  taken by a mint (L4's 12).
- `src/generators/narrativeGenerator.js` (the roster's override pass on ONE shared stream; a card's draw count depends on its
  secret's words through `getStressHistory`, `generateCrimeLevel`, `rareSecrets`): one card's new secret re-deals later
  cards' presentations and secrets (L4's 37).

## 7. The seven office secrets sent back (L4), each with its reason

1. the senior abbot, third ("Has kept a sickness in one of the houses quiet…"): an illness the record does not hold (PAGE-2).
2. the garrison commander, third (a sentry's death written up as a fall): next to the murder the brief bars (PAGE-2).
3. the dean, third ("Has lost faith in what they preach…"): repeats the meaning of the clergy row "Lost their faith completely
   but maintains the role" (PAGE-2).
4. the bishop, third (the relic in a yearly procession; "saint"): a public rite the town's traditions may not hold, and a faith
   with saints. The chair's wording: "Knows the church's most venerated relic was bought from a peddler and is not what the
   faithful are told, and has it shown to them all the same."
5. the priest, second ("confession"): one faith's rite. The chair's: "Repeats what people tell them in confidence, a little at
   a time, to the household that pays for the church roof." (stakes: those who confided would never speak to them again)
6. the militia captain, second: parses two ways. The chair's: "Keeps the grown sons and daughters of paying families off the
   muster roll, and has others drill in their place."
7. the watch captain, third ("the lock-up" presumes a gaol). The chair's: "Let a prisoner in the watch's keeping walk free
   because they were kin, and wrote it down as an escape."
The other 23 are APPROVED as written (the chair, 12:36).

## 8. Authored lines not yet sent to the chair (files under `lines/`, snapshots taken at hand-over, UNREAD by PAGE-2)

- `lines/L2-LINES-UNSENT-snapshot.md`: the L2 builder's arrival lines, mid-build.
- `lines/S7-TABLE-UNSENT-snapshot.txt`: the sides table, mid-build (before the by-slot index).
- `lines/L4-LINES-current-snapshot.md`: L4's lines as the builder holds them now (the seven may be mid-rewrite).
- Sent and read: `lines/L4-LINES-batch1.md` (with PAGE-2's read).

## 9. Executed vs plausible

EXECUTED: every figure in sections 2, 4 and 5 except where marked; S6's red and green (re-run by PAGE-2); PAGE-1's scripts
reproducing. FROM BUILDERS' REPORTS, NOT RE-RUN BY PAGE-2: L4's counts (542/34/6, the 48 and their causes), S6's gate counts
(importer suites "2 failed | 617 passed" with the golden master red at base and bar4 (b) red by S6; tests/lint "3 failed"
before the follow-up; typecheck:ratchet 167/167; domain-strict 1113/1113; lint 0). NO STORED FIGURE IS MOVED ON MY LANE: none
merged; when S6, L1, L2, L4, S9 and K land, the generator golden master moves (owner-signed at the close).
