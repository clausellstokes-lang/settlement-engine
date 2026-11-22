# V33-Q HAND-BACK (VEIL-33's builder; worktree `/home/user/wt/q`, branch `v33-q`, from 76fa9431b)

## PARKED (by the seat, the chair's order: the owner's word, fewer children at once)
Nothing was run. No birth, no vitest, no gate, no probe: the seat's green chain had not reached END when the order came.
The detached launcher that would have started my measures at END (pid 9412, my own) was stopped before it started anything.
The WIP commit is 85584d03d ("WIP (unrun, unproven): V33-Q parked by the seat"). The hooks ran and passed. Nothing is pushed.

### What I read (whole, as the brief names)
CLAUDE.md; V33-Q-BRIEF.md; R3-TELL-5-BRIEF.md; R3-TELL-4-BRIEF.md; PART 30 rulings 4, 9, 10, 28, 42, 47, 53, 54, 58, 62, 72, 73, 74;
PART 32 rulings 79-82; out/v31/tell5b/TELL5B-HANDBACK.md and u3-gate2-failing.txt; 212's `_gallery_veil_roster_choices`
(lines 2120-2667) and the twin `galleryRosterChoices.js`; every test file I touched (galleryRosterChoices.pglite, galleryVeilTell4,
and galleryVeilTell5 as the harness's precedent). I also read the instruments I meant to run: tell2.sh, pool.sh, verify.sh,
tell2.probe.jsx, tell2-signature.mjs, tell-common.mjs, tell-surface.mjs, capform.probe.jsx/.sh, twins.probe.jsx. Read only:
safetyLineTruth.js / safetyProfile.js around the Very Safe gates clause, and scripts/gate-mutex.sh.

### What each file holds, and which unit it is for (ALL UNTESTED: never executed)
- `measure/q.probe.jsx` (units (iv), (v)): a read-only probe. For each served page it records the relation rows (pair, type,
  direction, captureState, and each end's class: gov-crim, crim-served, served, withheld-crim, withheld-other, hidden-house or
  unknown, plus any field naming a withheld power or house), the safetyDesc state with the two gates clauses, the current tensions
  (type, factions, end classes), the criminal-worded imports, criminalCaptureState and the served crime signal (212's own
  definition). It has three modes:
  - `towns`: the gate's 140 births, twin + server, each hidden-house town's house-free twin B.
  - `pool`: the cached pool re-born, part A every setting, part B showAll.
  - `insurg`: 300 new nothing-hidden town births in the insurgency crisis, with rejection (unit (v)(3)).
- `measure/q.sh` (iv, v): the four-shard runner (towns uses template `t33q`, databases `q33m_<n>`).
- `measure/q-an.mjs` (iv, v): the analyzer. It prints sections (iv) relations (the failing towns' served rows against B's, and the
  pool's criminal-governing pages with relations), (v)(1) the clause count by size, (v)(2) the crime_wave factions forms, the
  pages with no served signal and the crimeWave rule's interaction, (v)(3) the import counts, and (v)(4) ccs on signal-false pages
  by engine and setting, with the twins.
- `measure/q-chain.sh` (all): the run order, each heavy step inside `gate-mutex.sh --run` (re-asked, never killing a holder):
  1. Template t33q.
  2. A smoke run on two towns (it stops the chain on failure).
  3. verify.sh (it STOPs on exit 1).
  4. The gate: `TELL_DB=q33 tell2.sh ... gates t33q`.
  5. The probe's three modes.
  6. The analyzer, to `q-an.txt`.
- `tests/security/galleryVeilTell6.pglite.test.js` (iv, v): a SKELETON. It has Tell5's harness (readAll, every setting, both
  engines) and births of BORN_SEEDS in beforeAll. NO ARMS YET: the `//@@PLANTS@@` and `//@@ARMS@@` markers are left, and
  `BORN_SEEDS` is undefined. As committed it fails at load and would red. Its `hidesOf` should use cardVeil's isHideableHouse.
  The planned arms are:
  - (v)(1): the beneath clause served as " Everyone comes in by the gates, where the guard sees them." (plant + r3m-city-none-1-113,
    r3m-metropolis-infiltrated-0-62).
  - (v)(4): ccs 'none' where the served signal is false (a plant with Tell5's capTown teeth + the measured towns).
  - (v)(2) and (v)(3) after their measures; (iv) only if its verdict is (a).
- `tests/security/galleryRosterChoices.pglite.test.js` (vi): the hand-fold shown-power goal tooth is UNCONDITIONAL. It is judged
  wherever the read's own projection (galleryPayloadFor at the read's Reveal; the map and the link read Reveal off) holds
  npc.eli's goal. Withheld or unserved there is a fault; a goal served where the projection holds none is a fault. It also counts
  the no-goal reads. NOT RUN: whether it is green at the tip is unknown (a red is a STOP).
- `tests/security/galleryVeilTell4.pglite.test.js` (vi): unit 1 now asserts `keptServed > 0`. NOT RUN.

### Not done
- No measure.
- No verdict for (iv).
- No form measured for (v).
- No manifest entry for galleryVeilTell6.
- No tests/lint, no typecheck, no eslint.
- (vi) is not split into its own commits yet: both teeth sit in the WIP commit.

### The exact next step
After the seat says go:
1. Run `sh docs/chair/2026-11-20/veil/out/v33/q/measure/q-chain.sh` (in the background; it waits for nothing, so start it only
   when the machine is free).
2. Read `q-an.txt` and the gate table at `out/v33/q/gates/tell2-table.txt`.
3. Rule (iv) (a)/(b) with the counts.
4. Fill Tell6's arms per the measures, run it red, and name its failing titles.
5. Run the two teeth green.
6. Make the manifest commit, then tests/lint whole, the typecheck and eslint.
