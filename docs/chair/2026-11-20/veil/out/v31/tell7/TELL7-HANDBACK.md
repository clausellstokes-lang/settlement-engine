# R3-TELL-7 HAND-BACK (VEIL-31's builder; worktree `/home/user/wt/r3tell7`, branch `v31-r3tell7`, from 5d664d585)

This sitting: unit (vii) alone. Steps 1 and 2 done; STEP 3 NOT STARTED (the STOP below). Nothing in `src/` or `supabase/` changed.

## STOPS (first)
1. **STOP AFTER STEP 2 (the brief's own: "more than three distinct causes"). The class is 26 of the 92 towns and SIX distinct
   causes** (`step1-causes.txt`, BY MECHANISM): every one of the 26 is the VEIL'S (the record owes the entry), none the draw's.
   (a) threshold types withheld by the map's `hasCriminalInst` (Survival crime 4, Magical crime 7: the engine writes them on
   criminalEffective's thresholds, which the served houses still meet): 10 towns; (b) Magical crime suppressed in the record by
   the withheld 'Arcane black market' (`!stress.arcaneBlackMarket`): 4; (c) the fallback 'Background crime' / 'Lawlessness'
   (the withheld rows were the only ones): 6; (d) a crisis's type ('black market food', 'black market passage', map `[]`)
   withheld though VR39 keeps a crisis's types (4 by the hidden "Black market"'s name; 2 hiding "Black market bazaar",
   mechanism UNTRACED): 6; (e) 'desperation theft' settled away in the record beside the network's Survival crime line, which
   the veil then took: 2; (f) the plot hook "The merchant guild's private security force..." attributed to `hasGangInfra`
   (the engine raises it on `stress.merchantArmy`): 1 (Reveal DM). A cure is one rule per cause, both engines; (a)-(c) need
   criminalEffective and the stress flags RE-DERIVED over the served houses (`getInstFlags`/`getStressFlags`, not in 212).
   No red written, no cure built.
2. **GATE-1 CANNOT SEE THIS CLASS** (step 2): it reds none of the 26 for it. The arm is PROPOSED below (the chair's 04:23
   ruling), not built.

## PROGRESS
- (vii) safety lists vs twin, red none, cure none (STOP 1): GATE-1 4/92 (7 LOWER BY RULE), GATE-2 20/40 red (the seat's gates
  at f98c39ec4; this tree is byte-equal outside `docs/`); families left: the class above (crimeTypes 25 towns, plotHooks 1;
  sp.ops 0), and as at unit (iii): inst.criminal 6, chains.criminal 6, powers.capture 5 (VR42), powers.criminal 3 (VR42),
  powers.relations 2, sp.ops 2 (ruled, stays), imports.criminal 1, tensions.crime 1, sp.crimeTypes 1 (ruled, stays).

## STEP 1, THE MEASURE (`measure/lists.probe.jsx`, `measure/lists.sh`, `measure/lists-an.mjs`; `step1-table.txt`)
The R3 gate's 140 births (tell-common.mjs, byte for byte), its 92 hidden-house towns; A and the house-free twin B (every
hideable house cut after every step), each read by the SERVER (`get_gallery_dossier` on `t7tpl` = v27x211 + 212 8688ddb6) and
the TWIN, at every gated setting (own, g:000..g:110, allOpen, off), Reveal off and DM: 1,840 pages per engine per birth side
(window 04:23:54-04:33:07). The safety profile has three lists (safetyProfile.js returns no other): crimeTypes, criminalInstitutions
(sp.ops), plotHooks. ENGINE PARITY: server = twin on every page, A and B.

| family | size | EQ | PART (served a strict part of twin) | HOLDS | BOTH |
|---|---|---|---|---|---|
| crimeTypes | village | 1 | 0 | 0 | 0 |
| crimeTypes | town | 14 | 3 (0-28, 0-17, 0-14) | 0 | 0 |
| crimeTypes | city | 24 | 12 (0-48, 1-104, 1-108, 1-109, 1-117, 0-42, 1-102, 1-110, 1-114, 1-118, 0-31, 1-103) | 0 | 0 |
| crimeTypes | metropolis | 28 | 10 (0-68, 1-124, 1-128, 1-136, 1-137, 0-58, 0-66, 0-59, 1-127, 1-139) | 0 | 0 |
| sp.ops | all | 92 | 0 | 0 | 0 |
| plotHooks | metropolis | 37 | 1 (occupied-0-65, Reveal DM) | 0 | 0 |
| plotHooks | others | 54 | 0 | 0 | 0 |

The crimeTypes shortfall shows at the five settings where the types grouping is open (own, g:010, g:011, g:110, allOpen), both
readings; the other five serve the key absent on both sides. No page serves what its twin lacks (HOLDS 0).

THE CAUSES, BY THE RECORD (the chair's 04:23 ruling (3); `measure/ref.probe.jsx`, `measure/causes-an.mjs`, `step1-causes.txt`):
the served page's own facts re-run through the engine's writer, `src/generators/safetyProfile.js :: generateSafetyProfile`
(served `config`, `tier`, `institutions`) then `src/generators/safetyProfile.js :: settleCrimeLinesToSignal` (served seats,
houses, tensions, services), at the own setting. FAITHFUL: on the stored config and ALL stored houses it gives the stored
crimeTypes and criminalInstitutions on 184 of 184 readings. RESULT: every entry the twin shows and the page lacks IS OWED by the
record (DRAW: 0 entries); the record owes nothing the twin lacks (0); the gate's 48 controls: reference = served on every page
(0). Per town, entry and mechanism: `step1-causes.txt` PER TOWN.

## STEP 2, THE GATE-1 QUESTION
**GATE-1 cannot see a served list that is a strict part of its twin's.** By execution: its run at this code (the seat's,
`out/v31/u3/tell2-table-f98c39ec4.txt`; `git diff --name-only f98c39ec4 HEAD` outside `docs/` is empty) reds four towns (113, 62,
14, 23) for safetyDesc, imports.criminal and currentTensions; NONE of the 26 for a safety list (r3m-town-insurgency-0-14 is red
for `r.imports.criminal` alone). Why (`step2-buckets.txt`): the signature reads a list only as presence, a count bucket (0, 1,
several) and `typesNoHouse`, each held to the POOL, never to the town's record: on 20 of the 51 short readings (own) the bucket
is the same as the twin's, on 31 it moves to a value nothing-hidden pages of the size show (`[]` included).

## THE PROPOSED ARM (for the chair's ruling on its form; NOT built)
REFERENCE, THE RECORD: per gated reading of a hidden-house town, `ref = settleCrimeLinesToSignal(generateSafetyProfile(served
config, served tier, served houses))` (as `src/generators/steps/assembleSettlement.js :: registerStep(assembleSettlement)` calls the
second); the arm reds where a list the reading serves (the key present) lacks an entry `ref` holds. A FALLBACK stands for
"nothing" and is owed only where `ref` itself writes it (it does so only where no other non-crisis type is owed). Items, each with
the served fact, the engine code and its reach today:
- a CRISIS's types (served fact `config.stressTypes`; `safetyProfile.js :: generateSafetyProfile` :: `addCrimeIfMissing`):
  'black market food' 5 towns (city-none-0-31, city-under_siege-0-48, city-under_siege-1-118, metropolis-under_siege-0-68,
  metropolis-none-1-137), 'black market passage' 1 (city-none-1-103), 'desperation theft' 2 (town-under_siege-0-28,
  metropolis-none-1-137; the settlement `settleCrimeLinesOnly` keeps it where no network line prints).
- the THRESHOLD types (served facts: `config` priorities and the served houses; `src/generators/priorityHelpers.js ::
  getInstFlags` (criminalEffective), `:: getStressFlags` (arcaneBlackMarket); the branches in `generateSafetyProfile`):
  'Survival crime' 4 (city-insurgency-1-104, -1-114, city-none-1-117, city-under_siege-1-108); 'Magical crime' 11 (city-infiltrated-0-42,
  city-none-1-117, city-politically_fractured-1-110, city-under_siege-0-48, -1-118, metropolis-under_siege-0-58, -1-128;
  and where 'Arcane black market' is not re-raised: city-wartime-1-109, metropolis-indebted-0-66, metropolis-wartime-0-59,
  metropolis-none-1-127).
- the FALLBACK (the same writer's "Fallback if safety is bad but no specific crime type" branch; served facts: the label
  `generateSafetyProfile` derives and criminalEffective over the served houses): 'Background crime' 4 (metropolis-indebted-1-136,
  metropolis-wartime-1-139, town-insurgency-0-14, town-none-0-17), 'Lawlessness' 2 (city-infiltrated-1-102, metropolis-insurgency-1-124).
- the PLOT HOOKS (served fact `config` + houses via `getStressFlags` :: merchantArmy; `generateSafetyProfile`'s hooks): 1
  (metropolis-occupied-0-65, Reveal DM, every gated setting). The smuggling hook draws by seed: the arm must run the reference
  with the birth's seed in `src/kernel/rngContext.js` (without it 102 of 184 stored hook lists differ).
- `sp.ops` (`generateSafetyProfile` :: `CRIMINAL_INST_LABELS` over the served houses): 0 towns.
COST TODAY: it would red 26 of 92 towns (crimeTypes 25 at own, g:010, g:011, g:110 and allOpen, Reveal off and DM; plotHooks 1
at Reveal DM, all 10 settings), ALL BY VEIL CAUSE, 0 BY DRAW CAUSE; controls 0 of 48 (crimeTypes, ops; hooks not run on the
controls). WALL TIME: the reference alone, single process, births included: 3 min 18 s for the 92 (04:40:50-04:44:08), 1 min 16 s
for the 48; inside tell2.sh's towns pass (births already made, 4 shards) two engine calls per reading: PLAUSIBLY under a minute,
not measured.

## RECEIPTS
- No red, no cure (STOP 1). 212 unchanged: `8688ddb6148e84baaeee6f9cdcd89fec40a382c390f44133affa15ae66cc5a3a`; t7tpl made from it
  (`t7tpl-212.txt`, rc 0).
- `tests/lint` WHOLE (`u7-lint-whole.txt`, `u7-lint-failing.txt`; 04:46:31-05:00:10): 16 files / 22 tests failed of 3,264, ALL
  PRE-EXISTING, none mine: PART 32 section 2b's twelve and PART 30 ruling 27's four (observedShapeReaders, presumedThings,
  presumptionClasses, writerReach), the same 16 as at the unit (iii) merge.
- `node scripts/check-full-typecheck.mjs` (`u7-typecheck.txt`, GIT_* unset): exit 0 ("no type regressions", 167, ceiling 167).
- eslint (`u7-eslint.txt`) on the four files I wrote: exit 0, 0 errors (the two `.jsx` under `docs/` match no eslint
  configuration: warned as ignored). No new test file, so no manifest entry.

## CONFIRMED vs PLAUSIBLE
- CONFIRMED (executed): the step-1 table (both engines, every gated setting, both readings); engine parity; the record
  reference's faithfulness (184/184), its 0 draw entries and its 0 control differences; the six mechanisms of 24 towns; the
  bucket check; the gate's verdicts by byte identity of the code.
- PLAUSIBLE: the mechanism of 'black market food' in metropolis-under_siege-0-68 and metropolis-none-1-137 (both hide "Black market
  bazaar"; no map row raises the type; the step that takes it is not traced); the arm's in-gate wall time; the hook item on the
  controls (not run).

## FOR THE OWNER, in plain words
On a shared page with a criminal house hidden, the "crime" list can come up short of what an ordinary town in the same state
shows: a siege town with no "black market food", a lawless town with no "lawlessness", a magic-rich city with no magical crime.
A reader who knows the game could guess that something was taken away. 26 of the 92 test towns do this, for six different
reasons in the hiding rules; the existing security gate does not notice it. Nothing was changed this sitting: the fix is six
rules, more than this unit was allowed to build, so it goes back to your chair with a proposed check that would catch it.

COMMITS: one, the measure and this file (`docs/chair/2026-11-20/veil/out/v31/tell7/`); 212 sha256 above, unchanged.
