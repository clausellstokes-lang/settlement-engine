# MB / MB-1 — the forecast leaves the main thread (member 1 of `mb`, T-ENGINE)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `752b1bbc36672bc54e6bbed67284f8a0ba5e0a32`
  (the `gvf` terminal; the micro-batch's fourth train base)
- **Train:** `mb`, family **MB**, member **1** of 3 (MB-3 dropped — see §1).
- **Preamble:** none — MB is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§137** · **§142**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.4, annex row `MB.M11`; fork `J-TC21-1`.

---

## §1 · THE TRAIN'S SHAPE, AND THE MEMBER THAT DIED

`MB.M17` (G4, the delete-side back-link scrub) was graded MEASURED-TRUE by the compile and is
**REFUTED at this train's base** — both Library delete paths already scrub survivors and persist
through `mutate_settlement_batch`, and all seven delete sites were enumerated. **MB-3 is a premise
death.** `src/store/settlementSlice.js` is never opened and the signed 994/994 ceiling fork — the
batch's single most likely death — is never reached. The train is MB-1, MB-2, MB-4.

## §2 · THE DEFECT

The realm forecast runs a full multi-tick interval through `simulateCampaignWorldInterval` ON THE
MAIN THREAD. The estate already owns the transport that fixes this — `advanceWorkerClient`
`runAdvanceInterval`, used by the committed advance — but the forecast never adopted it, so the
one operation a user runs *speculatively and repeatedly* is the one that freezes the UI.

## §3 · THE CURE

`simulatePendingFuture` gains an injected `runInterval` **defaulting to
`simulateCampaignWorldInterval`**. The default parameter is what makes Node, vitest, SSR and every
existing caller byte-identical BY CONSTRUCTION rather than by assertion. No new worker file — a
Vite worker is a separate rollup build, and the work already lives in one.

**⚠ THE DOUBLE-INTERNAL-CALLER TRAP (`MB.M11`).** `runRealmForecast` calls `simulatePendingFuture`
**twice** — baseline and counterfactual. Threading only the baseline leaves the candidate run on
the main thread, and **nothing about the returned value would show it**: both paths compute the
same bytes. Only counting the runner's invocations can see it, which is what §5's second pin does.

**The transport is INJECTED, not imported.** `workerBackedRunner(runAdvanceInterval)` takes the
transport as a parameter, so `forecastRun.js` gains no static edge to `src/lib/` — the slice's
"no top-level worldPulse edge" invariant holds and the coupling registry stays NOT INCURRED. The
two UI panes dynamic-import both halves inside their handlers, so neither joins first paint and
`AUSPICE_FINGERPRINT` still holds.

## §4 · SCOPE AND BOUNDARY

Three call sites take the seam: `runRealmForecast` (both internal calls) and `readAuspices`. Two
UI panes wire it. It does not change the forecast's compute, its no-commit discipline, its drain
order, or the omen framing.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | `runInterval` defaults to the in-thread orchestrator, so existing callers are unchanged |
| A2 | an injected runner that clones across the boundary yields a byte-identical forecast |
| A3 | `runRealmForecast` threads the runner through BOTH internal calls |
| A4 | `readAuspices` threads it too |
| A5 | the transport is injected, so the domain module gains no `src/lib/` edge |
| A6 | both UI panes wire it through lazy imports only |

## §6 · CHECKS

```
npx vitest run tests/domain/advanceWorkerByteIdentity.test.js \
  tests/components/realmForecastHonesty.test.jsx \
  tests/domain/forecastRun.test.js tests/domain/auspice.test.js
```

## §7 · MUTANTS AND HAZARDS

- **Estate mutant.** Dropping `runInterval` from the counterfactual call in the REAL
  `forecastRun.js` reds the call-count pin (`expected 1 to be 2`) and NOTHING else — which is the
  executed proof that byte comparison alone could not have caught it. Restored `cmp` exit 0.
- ⚠ **`tests/components/realmForecastHonesty.test.jsx` MOCKS `forecastRun.js`** and therefore
  proves NOTHING about this seam. It is in the battery as the epistemic-boundary regression guard
  and may NEVER be cited as evidence for the transport. Its mock gains the new export because the
  pane would otherwise throw before rendering; the returned runner is never exercised.
- ⚠ **Same-seed: NEUTRAL, and proven by BYTES rather than architecture** — the one claim in this
  batch that must be. The forecast is NO-COMMIT (clone-and-discard) and the worker runs the same
  function.
- ⚠ **Census:** no test FILE is created or deleted. `titles` moves by two.
