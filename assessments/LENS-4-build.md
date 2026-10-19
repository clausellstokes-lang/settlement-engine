# LENS 4: THE BUILD (implementability and risk of the FP simulation as designed)

LENS 4 (Opus 5.5), 2026-10-18, written for the owner. I read the BOARD's owner lines; the spine §1 and §5; the fold §0, §2, §3.4, §4, §6, selected rows of §7, and §9.6; the build sections and §0 of the nine new volumes; EC, WC, EP and the generals design by header; the r3 verifiers' first lines. No code read, nothing run. "Judgment" marks my view; the rest is the design's claim, cited.

## Verdict

As an engineering specification, this is as build-ready as a document-only design can be. Every wave names its leaves and hosts, with effective line counts against the 800 ceiling, a measure-first car-0 and stop conditions. Every persisted shape has a ten-path lifecycle; every flag a dark-identity golden, lit-mutant pins and a declared same-seed shift.

The risk lies elsewhere, in four places:

1. **The corpus is written far ahead of the code.** Only 37 of 111 compiled units have landed (fold §2). The nine new volumes have no code at all, and none of their felt chains is lit in the preset a newly created campaign actually runs.
2. **The text of record is a palimpsest.** About 2,000 insertion-only cure brackets sit across eight volumes, and cures written in parallel already contradict each other.
3. **The critical path runs through things FP does not own:** the release deploy, the birth-door change, the map's birth canon (H22), and the person substrate.
4. **The real test, the soak, cannot run yet.** Nearly nothing it would test is built, and several hundred DRAFT constants are UNMEASURED.

It should be built. What it needs now is a freeze, consolidation into one packet per wave, and a short first train whose experience read decides the rest. It does not need a fifth review round.

## What the build starts from

The lit core is pact formation and the faith unseating. Most of the rest is built but dark, or unbuilt.

The "one lit chain" holds only for a world created through the composer. A plain new campaign is named `realistic_regional` but carries none of the twenty-three switches that preset turns on (fold §2 bracket; OD-FC-62, executed). The fix grew from +7 keys to +30 and awaits the owner's re-confirmation.

Two of the new volumes do nothing in the default preset:

- THE PASSAGE does nothing there because the war layer is dark (PS §10).
- THE CHAMPIONS waits on `npcConsequencesEnabled`, which is lit in no preset (CH §19).

Judgment: the felt-proof law (requirement 19) puts lighting decisions on the critical path. A chain that cannot fire in a lit preset is not done.

## The chain order and its prerequisites

THE ORDER NOTE (fold §6) sets the default: C0 → C0.5 → C1 → C11 → C13 → C12 → C14 · C15 · C16 → C9 · C10 → C2..C8. OD-FC-19 adds that each next chain is chosen at the previous chain's experience read, which is the right discipline. C0 (aspatial, built on the landed majors docket) and C0.5 (without which no experience read can test "coherent on scrutiny") are the right head.

Judgment, on the "early" placement of C14 · C15 · C16: C14 should wait. THE PASSAGE's land gates rest on THE CANON ROOT. The map document says "Nothing is scheduled to be built on the host side yet" (fold §6, THE MAP PREREQUISITES), its milestones M-W0..M-W5 are 37–45 person-weeks, and PS also needs the war layer lit. C15's fort (ST-1) can go early, because its record (ST-0) does not need the map.

The person tier lights only with C1's unit (CH §19 TIER). So "party before champions" is not only the default but the only order the substrate allows.

## The mount rule and the leaf-first cars

The discipline is real:

- Line counts are eslint's effective count.
- Frozen kernels take zero new lines: `pulseKernel.js` 1581, `applyWorldPulse.js` 907, `warTermination.js` 818 (RN §10).
- A host already at its ceiling first gets a car that moves code out into a leaf (EC §1c). Examples: PS-0's extraction from `armyTransitKernel.js` at 798/800 (PS §11), the `generosityKernel.js` car before PL-9 (PL §9).

The price of "no new stage" (MN §9 car-0: "It is not a plugin registry") is concentration in two borrowed hosts:

- `calamityKernel.js :: advanceCalamity` carries the menace, site, patrol and body leaves ("461 + 4 × 3 ≤ 800"). ST-0, PR-0 and BD-0 inherit MN-0's four stop conditions (BD §14).
- `envoyPulse.js` carries THE ONE PERSON STAGE for RN, CH and PT (RN §10).

Six or more shared leaves are "built by the first to land": the presence composer (fold §3.1.30), the hold helper (PS §11), the polity verdict channel (PL §8), the chooser's shared-signal car, `reliefAnswerOf` (PL-4) and the transit leaf stage. Judgment: this makes the owner of each shared contract an accident of build order, and it is exactly where the r3 cross-volume failures cluster. Cut these leaves as their own small units, each owned once, as soon as the first train is fixed.

## Persisted shapes and lifecycles

The nine new volumes declare about twenty shapes or sub-shapes (PL §10, OD-FC-46, RN §14, CH §21, BD §15). This is the corpus's strongest engineering. All ten paths of requirement 22a are filled in. Undo means the snapshot ring plus each verb's inverse. Dark-after-lit means "kept, unread," and where that was false the cure is specific: PL's fealty-record families each got their own owner flag (PL §8).

Two risks remain:

- **Deed growth.** RN keeps deed facts forever: "a century is ~20,000 records — several megabytes unchecked". Compaction drops only `reach` (RN §14). The owner's advance by N years (OD-FC-51) makes long spans the expected use, so this needs a measured blob budget.
- **The undo safety net is unbuilt.** The owner's safety net ("the DM can undo any advance", fold requirement 16) rests on an undo ring that today lives only for the session, capped at 10. Persisting its newest two entries is ruled (OD-FC-32) but not built. Judgment: that change belongs in the first train.

## Same-seed discipline, flags, dark arms

About 36 new virtual flags (PL 9 · MN 4 · RN 2 · CH 6 · PT 3 · PS 2 · ST 4 · PR 2 · BD 4). Each is absent when dark, with its certification row and lit-mutant pins. Where a volume adds a ledger, lighting its flag with that ledger empty must leave every output byte-identical (MN §8, RN §12, BD §13). Label-keyed PRNG forks keep a new leaf from stealing another stage's random stream (PS §0, `prng.js :: fork`).

The burden is signatures, not engineering:

- the hearing week shifts every climax one tick (requirement 24(f));
- BD's re-feed is "the biggest signed shift" (BOARD 19:5x);
- lighting the epoch ends same-seed replay of the future (OD-FC-34);
- the birth-door switches change every new world (OD-FC-62).

Judgment: the pins prove single flags and named combinations. The combination space cannot be pinned exhaustively; only a soak across the preset matrix guards it.

## Per-tick cost

Each program pins a small-scale DRAFT cost:

- PL: ≤ 2 ms per tick at 14 settlements (PL §2).
- CH: ≤ 5 ms for 25 paragons on 60 settlements (CH §17), against R1's measured 1.7 ms when memoized.
- BD: ≤ 2 ms at fifteen towns (BD §14).

All of these are UNMEASURED. No volume states an aggregate budget across stages at continent scale. The BOARD (18:56) calls continent-scale body cost a stop condition, but no volume carries the number. Judgment, by arithmetic: a 25-year advance is 1,300 ticks, so 20 ms more per tick adds 26 seconds. The owner's only hard limit on long advances is "a MEASURED cost ceiling" (OD-FC-51), so this measurement gates a feature he asked for.

## Drift against master

The volumes are measured against four different bases:

| Base | Volumes measured there |
|---|---|
| `81f1cd963` | the nine new volumes |
| `00b648c9d` | EC and the fold's status table |
| `cbd348a5` | WC, whose header says it is "MANY COMMITS STALE" |
| `f5105fb6f` | the generals design |

With hosts at 798/800 and 800/800, a single line landed by another program breaks a car's arithmetic. The design anticipates this: every car-0 re-measures, and stop conditions name fallbacks.

Judgment: what will not survive contact with master:

- every line count;
- every "first to land" assumption;
- the map's H-rows, which another program owns and has not scheduled;
- the bracketed prose itself. PT and CH cured the same leaf's `enemy_in_service` in parallel, one reading belief and the other truth (PT-r3-verify, CH-r3-verify), and the fold names a read that the leaf's owner does not use (FOLD-r3-verify). A builder handed these volumes as they stand would have to arbitrate.

## Tuning and the soak

"DRAFT" occurs about 350 times in the nine new volumes, 82 of them in BD. These are occurrences, not distinct constants. They sit on top of the spine's ~270 bands and ~70 envelope shapes (spine §5). Requirement 18 lets the owner sign only measured rows.

The instrument exists: `scripts/audit/whole-world-soak.mjs` runs 30 deterministic years, and the ages standard asks for 100 (CHAIR-NOTES item 17). Judgment: runaways, dead loops and proportion are found by the soak, not by review rounds, and no new program can enter the soak until it is built.

## The push budget

The budget is ≤ 8 lines per week-advance and ≤ 20 per age receipt, both DRAFT (OD-FC-52). The docket shows a count and the top three by stakes.

It is measurable, but unallocated. Each chain measures only its own share, while the registry grows from 70 kinds (fold §3.4) to about 84 once PS, ST, PR and BD register. Judgment: measure the budget with all lit chains together, or each chain will pass alone and the table will drown.

## Review convergence

The BOARD's counts:

- **Round 1:** first attacks found 3–4 BLOCKING and 13–18 MAJOR per slice.
- **Round 2b:** 0 BLOCKING, 20 new MAJOR, 11 failed cures.
- **Round 3b:** 1 BLOCKING (the cult word, SEAMS-r3-1), 13 new MAJOR, about 17 fails, 13 of them ROUTED-UNAPPLIED.

That is real convergence on the first eight volumes. Two cautions:

- What remains is cross-volume coordination, which a parallel build will reproduce.
- The target still moves. BD was compiled after "stop adding from the top" (BOARD 18:56), items 29–49 arrived after its compile, and its skeptic has not run.

Everything the reviews CONFIRMED is consistency, between documents and against master's substrate. None of it is behaviour, because none of the design is built.

## Build first, and what waits

Judgment.

**Build first:**

1. The birth door, at its re-confirmed size.
2. Persisting the undo ring (OD-FC-32).
3. An aggregate tick-cost and push-budget harness on the whole-world soak.
4. C0, then C0.5.
5. RN-0 + PT-0, with zero-click marks.
6. MN-0..MN-3: DM-authored only, and byte-identical while the ledger is empty.
7. ST-1, the fort.

**Wait:**

- THE PASSAGE, for H22 and war-layer lighting.
- BD's re-feed and spill, for its own skeptic round and a measured shift.
- PR's grouping and the hunt.
- EC, for its dispatch gate.
- WC Arc B–D, HB-6..9 and C8's long spans, for a century soak.

## The three decisions that cost most if wrong

1. **Requirement 24's universality.** About 84 engagement kinds become held docket cards, each resolving one tick late and premium only, and every later chain is felt through them. If the docket burden fails at the table, unwinding it touches every volume.
2. **No new stage.** New actors are stacked into `calamityKernel` and `envoyPulse`, and the shared leaves go to whoever lands first. Stage order and stream identity hang on positions chosen to avoid a manifest change.
3. **Keep the gauge, replace the engine.** BD re-feeds the landed raider, criminal-power and presence math that MN, ST, PR and PS all compose into (BD §8, BD-2). A wrong balance there leaks into every danger read in the world.

## Missing

1. An aggregate per-tick budget at continent scale.
2. A consolidated, bracket-free text of record per wave (the packet), verified against the latest cures.
3. One law for when a shared leaf reads belief and when it reads truth.
4. A combined push-budget measurement across all lit chains.
5. A frozen scope line: new owner ideas queue for the next program instead of entering these volumes.
