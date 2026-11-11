# Review — lane GEN-SPEED at 5efe58416 (base 90774f2fa), for the chair

## How this report was made

An independent reviewer (in-process, read-only) worked on this lane from 10:30 to 11:36 UTC on 2026-11-10
and was cut off by the account's weekly usage limit while it was writing its report. Its exports of the
three commits, its scripts and every result file survived under the chair's scratchpad
(`review-gen-speed/{base,tip,tip2,work,out}`). On 2026-11-11 the chair completed the report by RE-RUNNING
THE REVIEWER'S OWN COMPARISON SCRIPTS over its saved outputs and reading its result files, and by reading
the three cures' source changes itself. So: the executions are the reviewer's, the comparisons were re-run
by the chair, and the verdict and the wording of the findings are the chair's. Nothing here comes from the
lane's author. What the reviewer never wrote (its prose on the random stream and on other callers) is not
reconstructed; the section "Not done" says what that leaves open.

## Verdict: CLEAR TO MERGE

The claim under attack was the lane's law: NO BYTE OF ANY GENERATED SETTLEMENT MOVES. In every executed
comparison no output moved.

## The evidence (CONFIRMED: executed; the comparison lines below were printed by `work/compare.mjs` on 2026-11-11)

| What was run | Result |
|---|---|
| 626 generation cases in 21 groups (listed below), base against the lane at 6dd046646, in forward order | 626 of 626 identical; 620 distinct outputs among them |
| the same 626, the lane run in REVERSE order and in a SHUFFLED order (state carried between requests would show here) | 626 of 626, both |
| the same 626 against the FINAL tip 5efe58416 (the late commit d0def261c included), forward and shuffled | 626 of 626, both |
| the same 626 against the lane's COMMITTED engine bundle (`supabase/functions/_shared/engineBundle.js` at 5efe58416) | 626 of 626 |
| 179 cases each in its OWN FRESH PROCESS at the final tip | 179 of 179 identical to the base |
| the landing fixture's emitter (`--seed lf-033 --emit --out`: five settlements and twelve world pulses) at base and tip | byte-identical, 8,618 bytes |
| differential fuzz, base against tip, of the three cured functions | 0 differences in 125,731 calls: 58,602 rosters through the defence partition; 37,129 `generateCrimeLevel` calls over revisited and interleaved rosters; 30,000 `spareHookLine` walks with 1,042,215 ledger rows compared |
| the lane's six pins with each cure REVERTED in turn | cure 1 reverted: 2 pins red; cure 2: 1; cure 3: 1 (each pin is live) |
| `tests/build/engineBundleReplay.test.js` at the final tip | vitest exit 0 |

The 21 case groups, in the reviewer's own words (`work/cases.mjs`):

- G1 — plain, every size, many seeds
- G1b — the wizard's full default config (random priorities, random stresses), every size
- G1c — settType random
- G2 — one press of "Force all" on each tier (its own tier's keys), several seeds
- G2b — the metropolis keys pressed on another tier (out-of-tier forced rows), as the chair's own harness does
- G3 — "Exclude all" on each tier
- G4 — the two six-tier max bodies (all toggles: institutions, categories, goods, services), on every tier
- G5 — partial toggle bags: a seeded share forced, a share excluded, a share allow-only, per tier
- G6 — every stress type alone, several at once, all at once
- G7 — magic off (the hard world fact, and the slider at zero), every size
- G8 — extreme dials
- G9 — custom names (a name with the frame's own mask character, with regex characters, a very long one,
- G10 — routes, terrains, cultures, threats, populations, ages
- G11 — generation WITH A NEIGHBOUR (a generated settlement handed in), every relationship type
- G12 — section regeneration, NPCs, on generated records with fresh seeds; every mode; with locks
- G13 — section regeneration, history
- G14 — derive (no birth laws), with and without a pins bag cut from the record
- G15 — a full generate that carries locked people from a previous settlement
- G16 — a custom-content runtime with homebrew institutions (essential, so they always roll)
- G17 — ONE SEED, ONE ROSTER OF HOUSES, MANY CONFIGS BACK TO BACK (the framer's slot may meet the same names

## Findings

| # | Rank | Finding | Act |
|---|---|---|---|
| F1 | MEDIUM (test strength, not a defect in the lane's code) | THE PINS GUARD THE WORK COUNT, NOT THE EXACTNESS. The reviewer built deliberately wrong variants of the cures and ran the tests against them. Its result files show: an identity-keyed slot, an unordered key, an untrimmed key (cure 2) and a module-level memo and memoised functions (cure 3) each pass all six of the lane's pins; the single-alternation-regex mask (the rewrite the chair forbade, because it differs where names overlap) passes 164 related tests; an identity-keyed memo and an index drift in the partition (cure 1) pass a wider set of 433. So a later "optimisation" that breaks exactness in a rare case would be caught only if a corpus hash happened to move. | After the deploy, with the next generator item: differential exactness pins (overlapping names; a roster changed between two calls; name order; the trim). |
| F2 | LOW | The frame slot is bounded to one roster but not by the number of distinct texts framed within it: 100,000 distinct texts over one two-name roster held 208 MB; one call over another roster released it to 4 MB; after a real generation of another city 3.4 MB was retained. Generation frames a few hundred texts per roster, and a request cannot hold the roster fixed while varying the texts without bound. | After the deploy: a cap on the slot's map makes the bound provable. |
| F3 | INFO | The late commit's `for…of` spelling of the mask and the `reduce` spelling it replaced differ in exactly one contrived case: a list member whose own `Symbol.split` appends to the list while it is being masked. Names are strings; four ordinary edge cases (a hole in the list, the word "undefined", an empty list, duplicate names and the mask character as a name) are equal at base, 6dd046646 and 5efe58416. | None. |
| F4 | INFO | Two contracts the lane states are real: a name getter that changes its answer between two reads, and an `accept` callback that writes the roster in the middle of a walk, each make base and tip answer differently (the second in 114 of 120 positions tried). Neither exists in the code; the second is what the lane's frozen-walk pin guards. | None. |
| F5 | INFO for the deploy | The COLD first request (a fresh process, so module load and warm-up are inside the figure) for one press of "Force all": base 2.2 to 2.6 s of CPU, tip 1.4 to 1.6 s (three runs each). Warm, the lane measured 0.54 to 0.80 s. The host's published ceiling is 2 s; the owner's pre-flag check is the measure of the host. | In the deploy step already (the heavy half of the pre-flag check). |

## What the chair read itself

`src/generators/npc/rosterFrame.js` at the final tip, whole: one module-level slot keyed by the JSON of the
ordered name list, replaced when another roster arrives; the mask is the same sequential longest-first
`split(name).join('@')` then `trim()`; a list holding a non-string is masked afresh and never remembered.
Cure 1's change (`partitionDefenseInstitutions` lowercases each name once before the buckets and filters by
index over the same list) and cure 3's (`spareHookLine` builds one `factsOf` and reads it through a frozen
memo object created in the call; a property that is a function is remembered as the function, whose calls
still read live; `accept` is documented as a pure text test).

## Not done

- The reviewer's sections on the random stream and on other callers of the changed functions were never
  written. The executed comparisons cover the generation, neighbour, regeneration, derive, locked-people and
  custom-content paths and twelve world pulses, which is where a moved draw would show; no reading-based
  proof is offered beyond that.
- Nothing was run on the hosted function. `npm run check` was not run by the reviewer; the lane's own
  before/after comparison of failing titles (30 = 30 over five directories) is the lane's.
- The typecheck and architecture comparisons the brief listed under hygiene were not found among the result
  files; the merge point's gate covers them.
