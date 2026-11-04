# Hooks under stress: the lane's report (2026-11-04)

> A dated archival record of the HOOKS-UNDER-STRESS lane, built on `lane/crisis-2026-11-03` at
> `c2747eab` (the crisis car). The brief: SOAK-1000 §3's chain "Stress → the number of plot
> hooks is absent (η 0.09)". The evidence (the three measuring scripts and every figure below) is
> in `docs/evidence/hooks-under-stress-2026-11-04/`. Branch `lane/hooks-under-stress-2026-11-04`;
> no pull request was opened, and no golden or register was re-recorded.

## 1. Outcome

Each active crisis now adds up to two plot hooks, read off its cast and collected ahead of the
place's own hooks. The first names the holder of a line role, with the role's reason as its fact;
the second names the lever house, its holder, and the faction that loses. A calm place is
byte-identical. The added hooks raise zero truth findings, on the record and on the page. The
catalog `crisisHook` names its holder in four of the fifteen kinds.

**STOP on the η promise.** The brief promised η(stress, hooks) above 0.4. SOAK's own chain C4c
(η of the primary stress kind against the hook count, over the whole tier-balanced corpus) moves
only from **0.081 to 0.111**. The cause is arithmetic, not a defect: tier explains nearly all of the
variance in the hook count (thorp 10, metropolis 41). The table below adds k hooks per crisis
uniformly on top of the base corpus:

| added hooks per crisis | 2 (this lane) | 4 | 8 | 12 | 15 | 20 |
|---|---|---|---|---|---|---|
| η C4c (600 soak seeds) | 0.111 | 0.160 | 0.264 | 0.354 | 0.409 | 0.480 |

η above 0.4 needs about fifteen hooks per crisis, which is more than a thorp's whole list. The
chair should rule on one of two options:

- **(a) Read C4c within tier.** C1a–C1c already carry `withinTier: true`. Measured within tier,
  C4c moves from 0.241 to 0.309, which clears the battery's "present" bar (0.2).
- **(b) More hooks per crisis.** One hook per cast row would add about five per crisis, which
  still gives η of about 0.2. That count of hooks is a content decision, not a repair.

The lane recommended (a). **The chair ruled (a), 2026-11-04** (the owner may veto): C4c is read within tier, and both figures are recorded. No more hooks per crisis.

## 2. Units

| unit | commit | what |
|---|---|---|
| 1 | `88663a24` | `src/domain/crisis/crisisHooks.js`: `crisisHooksOf`, `slotCrisisHook` (pure; no rng) |
| 2 | `6ade1585` | the collector reads crisis hooks first; the record check reads them (stored shape, superseded by unit 3) |
| 3 | `4ad86802` | the hooks are derived from the cast where they are read (through `effectiveCastOf`); the cast step fills the `{holder}` slot |
| 4 | `19890373` | this report and its evidence |
| 5 | the ruling-4 commit | the `{holder}` fill moves to read time (below) |

**Unit 3 replaced unit 2's stored list, and the measurement is why.** With the hooks stored on the
entry, four suites moved:

- the faction-rename denominator gained four undeclared name-bearing paths
  (`stress|stressors.plotHooks[].text`, `.link.id`, `.link.label`);
- the person-rename denominator gained four as well;
- the observed-shape erasure guard lost a frozen row (`src/lib/proseSeams.js / text on plotHooks`),
  because a writer now existed;
- a DM's cast edit would have left stale names in the stored hooks.

With the hooks derived, all four of those suites read exactly as they do at `c2747eab`. The
"own keyed fork" in rule 4 is met by something stronger: nothing draws at all. Each choice is the
first fit in the cast's own order.

**Unit 5: the chair's ruling 4.** The `crisisHook` slot is filled where the hook is read, never
stored filled. The entry keeps the catalog's sentence as its template. `crisisHookFor(settlement,
entry)` fills it from `effectiveCastOf`, so a DM's cast edit renames the holder everywhere it is
printed:

- the Crisis page (the tab, the print chapter and the journal);
- the print view model's three crisis sites;
- the Overview and Summary tabs;
- the quick guide's fallback.

`resolveCrisisCast.js` is back to the base's code. Its red-first applies a DM cast edit and asserts
the printed hook names the new holder; at `19890373` it read the engine's holder.

## 3. Figures (CONFIRMED: executed; receipts in `summary.json`)

- **Calm identity, 60 seeds** (`calm-hooks-<i>`, every tier, stress off). All 60 records and all
  60 hook lists are byte-identical to `c2747eab`; the combined hash is `78a22f8b…` both times, and
  the base replayed identically.
- **120 seeds** (`tonight-cast-<i>`, the CRISIS-1 corpus: 81 crisis towns, 137 crises).
  - Hooks per crisis town: 24.84 → 27.91; calm towns unchanged at 20.56.
  - 128 of 137 crises carry a cast-bound hook, and 121 a lever-bound one. The 9 without a cast
    hook are wartime (5, no defender) and infiltrated (4, an outside hand): their casts hold no
    line role to name.
  - The first hook is a crisis hook in 80 of 81 crisis towns.
  - Record truth findings 93 → 93 and page findings 0 → 0, so the added hooks contribute 0 on both.
- **600 soak seeds** (`soak1k-<i>`, SOAK's own corpus re-spelled from `corpus.mjs`).
  - 1,111 hooks added.
  - Record findings 210 → 210, page 0 → 0, so 0 on the added hooks.

Hooks by tier, calm against crisis, on the 600 soak seeds (calm *n* is 7–8 a tier):

| tier | calm | crisis before | crisis after |
|---|---|---|---|
| thorp | 10.0 | 11.27 | 12.74 |
| hamlet | 11.5 | 14.28 | 16.11 |
| village | 16.71 | 18.25 | 20.13 |
| town | 22.88 | 24.66 | 26.93 |
| city | 35.43 | 32.90 | 35.22 |
| metropolis | 40.88 | 37.27 | 39.54 |

**A finding, noticed and not this lane's to chase.** At `c2747eab`, city and metropolis crisis
towns already carry fewer hooks than calm ones (32.9 against 35.4, and 37.3 against 40.9). This is
PLAUSIBLE: the calm sample is small, and the cause is unmeasured.

## 4. Proposed sentences (new prose; every one is the chair's to accept)

- **N1** (`CRISIS_NOUN`), how each kind is spoken of: siege, famine, occupation, factional split,
  debt crisis, betrayal, infiltration, outbreak, succession crisis, raids, insurgency, conversion,
  revolt, war, migration. "crisis" is used where the record contradicts the kind's own noun.
- **C1**, the cast hook: "In the {noun}, {clause}: {the role's reason}." The clauses:
  - brunt: "the brunt falls on {h}"
  - lever: "the lever is held by {h}"
  - instigator: "the hand stirring it is {h}"
  - target: "it is aimed at {h}"
  - defender: "the defence is led by {h}"
  - treater: "the one who would come to terms is {h}"
  - face: "the occupier's local face is {h}"

  {h} is the person "of {house}", the house's own name, or "the {institution}".
- **L1**, the lever hook with a loser: "In the {noun}, the players can push on the {house}[, run by
  {holder}]; {faction} loses most if it gives, because {the stake's reason}."
- **L2**, the lever hook with no loser: "…; whoever moves it moves the crisis."
- **S1**, the `{holder}` slots held back: insurgency's and slave revolt's "The governing faction".
  A faction name stored in prose needs a row in `src/domain/factionRename.js`, ruled with the
  cast's own open rows.

The six slot edits that **were** made replace the sentence's own words for the role with the name;
no new sentence was authored. They cover under siege (two slots), famine, occupation and plague.
They filled 30 times on the 120 seeds.

## 5. Red suites at the composed tip, predicted

Every red below is already red at `c2747eab`. This lane moves the CONTENT of only those named.

- **`tests/property/espionageDormancyFence.test.js`.** After unit 5 it reads exactly as at base.
  The stored slot was the only thing that moved it, and nothing is stored filled now.
- **`tests/lint/sourceCitationIntegrity.walker.test.js`.** Green at base. This report is a dated
  archival document, so the archival roster moves from 8 to 9 "dated" documents; the landing
  re-measures it.
- **`tests/lint/sovereigntyLightingContract.walker.test.js`.** Green at base; 2854 → 2855 files
  (the new `tests/domain/crisisHooks.test.js`). The remaining figures need re-measuring at the
  composed tip.
- **Generator goldens and structural fingerprints** (`generatorGoldenMaster` and the dormancy
  goldens). The same failing rows as the base. After unit 5 the stored record is the base's; only
  read-time counts (`hook_count`) differ, and only in crisis rows. No calm row moves.
- **No change from base.** The Tonight sheet and the hook goldens stayed green in the governing
  run. Its top three hooks now lead with the crisis hooks in crisis towns, by design.
- **No manifest change.** No catalog sentence changed: `src/data/stressTypes.js` is untouched.

Inherited and unchanged (noted for the chair):

- `ruinFilterRoster.walker` names `src/domain/crisis/crisisCast.js` (98 readers against 97);
- the two rename denominators name the crisis car's own `stress.cast.*` paths.

## 6. CONFIRMED and PLAUSIBLE

CONFIRMED (executed):

- every figure in §3;
- the red-firsts (unit 1: module absent; unit 2: 3 failed; unit 3: 6 failed);
- the 25 governing reds, compared file by file against the base;
- the espionage attribution.

PLAUSIBLE:

- the lighting census's other four figures;
- the cause of the city and metropolis deficit;
- `writerReach.walker`: the same 11 reds as base, but its first-reported name differs
  ("capacity" against "deficit"), which reads as iteration order.

The stale-slot item listed here before unit 5 is cured and CONFIRMED by its red-first.
