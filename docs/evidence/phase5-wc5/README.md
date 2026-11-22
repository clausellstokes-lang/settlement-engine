# Phase 5 W-C5 — Cause-Resolution Lifecycle: evidence

The last simulation mechanic. A compromise (the guard captain is corrupt) exists
BECAUSE of a cause (the garrison is underfunded); when the cause RESOLVES, the
compromise evolves by one of three character-derived paths, or is overridden by one
of two terminals — never silently persisting with a stale story.

## What the engine does

- **Lazy, byte-inert attribution.** Generation schemas are unchanged; a compromise
  carries no cause field. On first worldPulse touch the lifecycle attributes the
  most role-coherent **real** cause (from the settlement's actual concurrent state,
  via the closed 14-class cause vocabulary), stored only in
  `worldState.causeLifecycle` (conditionally materialized). A never-advanced
  settlement is byte-identical; a world whose causes never resolve is exact prior
  bytes (the dormancy law). The three goldens hold byte-identical.
- **Resolution with hysteresis.** A cause resolves only when its underlying
  condition genuinely clears AND holds `RESOLUTION_HOLD_TICKS = 4` (one month at the
  weekly tick), so a one-week blip in the pay cannot reform a captain.
- **Three covert paths, chosen by trait plane + seeded fork + reform climate:**
  RE-CAUSE (adopt a new REAL cause), REFORM (the sole-cause corruption ends; the tag
  clears, undo-clean), HISTORICIZE (the compromise persists, its origin past-tense).
- **Two terminals:** EXPOSURE (covert→revealed crossing → the public arc supersedes
  the quiet lifecycle; rides the existing scandal/legitimacy machinery),
  INFRASTRUCTURE DEATH (the sustaining criminal institution destroyed → re-adjudicate
  from scratch: resolve vs re-catch to a live patron).
- **Age bands + conjunction key.** Every event stamps origin / resolution /
  historicization ticks and emits the conjunction key `{role, situation, causeClass,
  lifecycleStage}` W2 multiplies content against; the shared `ageBands` helper derives
  the temporal register ("the lean years" only at years-past).

## Soak (`scripts/audit/cause-lifecycle-soak.mjs`)

Deterministic, seeded cohorts, tunes nothing. `soak-output.txt` (readable panels) +
`soak-evidence.json` (machine JSON), cohort 4000. Reproduce:

```
node scripts/audit/cause-lifecycle-soak.mjs --cohort 4000
```

### Envelopes (cohort 2000 shown; 4000 in the JSON)

**A — outcome distribution by trait plane** (climate held constant, alternative cause
available): the character gradient lands as designed.

| plane | reform | re-cause | historicize |
|---|---|---|---|
| principled-good | 53.3% | 8.8% | 37.9% |
| dutiful-lawful | 38.0% | 11.9% | 50.1% |
| steady-neutral | 18.2% | 16.8% | 65.0% |
| greedy-corrupt | 11.4% | 52.4% | 36.2% |
| ruthless-dark | 11.7% | 53.3% | 35.1% |

Conscience reforms; appetite re-causes; steady habit historicizes.

**B — reform climate gradient** (a fixed dutiful bearer across climates): rotten
cities rarely reform (captured+evil-patron ⇒ 19.6% reform), a devout-good high-order
purge climate invites it (47.5%).

**C — re-cause coherence audit:** 2757 re-cause events across the cohort, **0
invented** — every adopted cause was a live in-state condition at adoption (re-cause
draws only from `presentCauseClasses`).

**D — terminal frequencies:** EXPOSURE stamps `exposed-public` on the covert→revealed
crossing (quiet lifecycle stops). RE-ADJUDICATION resolve-vs-re-catch splits by plane
(principled 90.5% resolve, ruthless-dark 48.6% resolve / 51.4% re-catch) — the dark
reach for a new patron, the principled let it die.

**E — age-band distribution:** the historicize register the display derives — "the
lean years" language is impossible below the years threshold (>52wk, the committed
4-4-5 calendar's 52-week year); a freshly resolved cause reads fresh.

## Byte-identity (the STOP gate)

`generatorGoldenMaster`, `worldpulseDeityGolden`, and `religionDormancy.byteIdentity`
are all byte-identical after this wave: the ledger key is absent from every hashed
projection, the pass emits no candidates/rolls, attribution is passive, and the
deity golden's corruptions are patron-caused (conduct-drift, non-resolving) so no
reform mutation fires in-window.
