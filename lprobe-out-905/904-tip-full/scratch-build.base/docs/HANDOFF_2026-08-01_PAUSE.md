# ⛔ PAUSE HANDOFF — 2026-08-01, owner transitioning to a Fable-capable account

**READ THIS BEFORE TOUCHING THE TREE.** The owner paused all work mid-flight to move
accounts. Two programs were building simultaneously and **the working tree is dirty in
two places at once**. Nothing here is broken, but nothing here is finished either, and
the two programs must be told apart before anything is committed.

---

## 1. WHERE THINGS STAND, EXACTLY

- **Branch:** `claude/composite-r4` (minifold worktree). **HEAD: `99e2d54f`** — clean,
  gated, committed. Everything at or below HEAD is green and trustworthy.
- **Working tree: DIRTY with TWO UNRELATED PROGRAMS mixed together.** Do not
  `git add -A`. Do not commit as one unit. They are separable by path (§2).
- **Ledger/design corpus: fully current.** Every ruling made today is written down; the
  transcript is not required to continue.

## 2. THE TWO DIRTY PROGRAMS — SEPARATE THEM BY PATH

### (A) WAVE W1 — the three war joins. COMPLETE, GATE-RED, NEEDS DIAGNOSIS.
All three implementers finished and self-reported green on focused suites.

Files: `src/domain/worldPulse/{warIntent,treatyEnforcement,treatyTransfer}.js` (new) ·
`warDeployment.js` · `settlementStrategy.js` · `applyWorldPulse.js` · `peaceTerms.js` ·
`mobilization.js` · `occupation.js` · `warReasons.js` · `pulseKernel.js` ·
`src/domain/spatial/armyTransit.js` · `src/lib/spatialUsage.js` ·
`scripts/.size-baseline.json` (ratcheted DOWN, do not revert) ·
`tests/domain/{warIntentJoin,siegeArrivalGate,treatyEnforcement,peaceTerms}.test.js` ·
`tests/store/lifecycleRoundTrip.test.js`

What it does: (1) the strategy chooser can finally OPEN a war — it deposits an ORDER in a
new `spatialLedgers.warIntents` ledger (conditional, 2-tick TTL, zero RNG) and the war
layer remains the ONE opener; (2) sieges now WAIT FOR ARRIVAL when the transit layer is
active (byte-identical when spatial is dark); (3) treaty terms finally BITE — readiness
cap, war block, occupation hold all wired, and tribute/reparations/restitution move REAL
grain instead of writing accumulators nobody read. A genuine bug was found while wiring:
`demilitarizationCapFor` returned the term MAGNITUDE as the readiness ceiling, but
magnitude means SEVERITY everywhere else, so a harsher clause would have set a HIGHER
cap. Inverted meaning in code that had never run.

### (B) CARTOGRAPHY TC-0/TC-1/TC-2 — **STOPPED MID-BUILD. ASSUME PARTIAL EDITS.**
⚠️ These agents were killed by the pause, not finished. The recorded hazard applies:
**killed agents leave partial edits — survey before resuming.**

Files: `src/lib/mapSubTabs.js` · `src/components/townMap/{MapTabShell.jsx,subtabs/}` ·
`src/components/townMap/{SettlementMapPane,SettlementMapPresentation,useTownMapPresentation}` ·
`src/components/OutputContainer.jsx` · `src/store/displayPrefsSlice.js` ·
`src/store/operationRegistry.js` + `compendiumData.generated.js` ·
`src/domain/townScene/{cartographyContract.js,manifestContract.js,compileTownSceneManifest.js,index.js,sceneCompileInput.js}` ·
`src/domain/townCartography/` (whole dir) · `tests/domain/townCartography*.test.js` ·
`tests/property/townCartographyDormancyGolden.test.js` ·
`tests/fixtures/town-cartography-dormancy-golden.json` ·
`tests/{ui/mapTabShell,ui/mapPresentationControlledSeam,lib/mapSubTabs,build/mapTabShellLazy}.test*`

## 3. ⚠️ THE OPEN QUESTION — TWO GOLDENS MOVED, CAUSE UNPROVEN

W1's gate returned **3 reds**: `domainAnyCastBaseline`, `beliefMapGolden`,
`momentumDormancyGolden` (2,095 files passed).

**I cannot tell you whether those goldens are real.** I made a process error: I launched
the W1 gate and THEN launched three cartography agents into the same tree, so the gate
tested a moving target. The golden failures may be a genuine behaviour change from the
war joins touching `pulseKernel`/`applyWorldPulse` in a LIT path, or they may be churn
artifacts. **Do not re-record either golden on this evidence.**

**THE CORRECT NEXT ACTION, in order:**
1. Survey the cartography files for partial edits (§2B) and either finish or revert them
   — do not gate over them.
2. Re-gate a SETTLED tree (`nohup sh scripts/gate-tail.sh npm run check`, never a bare pipe).
3. If the two goldens still move, diagnose the cause in the war joins and treat it as a
   DISCLOSED behaviour shift needing a signed re-record — never a quiet one.
4. Fix the any-cast red properly (real types; the baseline is 0 for new domain files).

## 4. WHAT IS UNDER THE OWNER'S STOP ORDER (do not start)

The release soak grid · the 300-year research rerun · the subsystem-certification sweep ·
**the tuning pass**. Owner's words: "Stop before the soak grid." Building was later
authorized on top of that; proving was not.

Also still owner-gated: the 122→193 migration train deploy, any push, the walk, legal.

## 5. WHAT WAS ACCOMPLISHED TODAY (all committed, all gated)

Waves C, D, E, F, G landed; the four big programs (H, I, J, K) completed; **wave P —
the demographic engine — built in five slices (P1, P1a, P2, P3, P4)** curing the
300-year population runaway AND the frozen floor, which verification proved were ONE
defect (an uncapped rate read through an integer deadband, reproduced at pressure
0.68–0.70). Two missing war causes landed (predation on weakness, the holy war).

**28 owner rulings on the war system are recorded in
`docs/DESIGN_REALM_DIRECTIVES.md`** (amendments A through Q) — causes, coherence,
targeting, termination, succession, coalitions, the envoy system, convergence, conquest,
and the compromised envoy. They are designs, not code. Only two of the fourteen causes
are built.

## 6. FOR THE FABLE-CAPABLE SUCCESSOR

`docs/FABLE_VALIDATION_QUEUE.md` holds every Opus-era judgment with its evidence and what
to re-examine, priority-ordered. **Start with the wave-P row** — it is the largest body of
Opus-era work and the owner flagged it explicitly for re-validation.

The three things I would want re-derived first: the §0 grounded defect anatomy in
`docs/DESIGN_DEMOGRAPHIC_ENGINE.md` (runaway and floor are ONE defect); every raw-authored
band in that document's §10, none of which has seen a soak; and the delegated rulings —
migration 193 authorized, the I1 golden re-record, wave E's satellite cap standing over a
prose example, and the fourteen-claim acceptance contract.
