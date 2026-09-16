# Phase 5 W-C3 — Institutional Ecology + Moral Founding Lane (evidence)

Deterministic soak for the W-C3 mechanics. Regenerate:

```
node scripts/audit/institution-ecology-soak.mjs > docs/evidence/phase5-wc3/institution-ecology-soak.txt
```

The soak measures landed dynamics from the shipped constants; it tunes nothing. Tick = 1 week
(temporal constitution); 52 weeks/year.

## Founding seam (where new institutions enter)

The founding seam is the worldPulse INSTITUTION LIFECYCLE lane. Two evaluators emit
`institutionPatch` candidates that flow through `rollCandidates` → the apply router
(`applyWorldPulse` → `applyInstitutionLifecycleOutcome`):

- `evaluateInstitutionLifecycle` (economic build/close of supply-chain institutions, action
  `build`/`close`) — the pre-existing lane.
- `evaluateMoralInstitutionPressure` (abolition of standing morally-loaded institutions,
  action `abolish`) — W-F8.
- **`evaluateMoralInstitutionFounding` (NEW, W-C3 item 1)** — raises new benevolent/
  exploitative institutions, action `found`. It is the mirror of the abolition lane: an
  integrator that tracks a patron *embracing* (rather than rejecting) a catalog institution
  the settlement lacks.

Entries enter via the golden-inert **founding catalog** (`domain/worldPulse/foundingCatalog.js`),
a worldPulse leaf **generation never imports** — so the catalog is byte-inert to
`generatorGoldenMaster` **by construction** (the "golden-inert like W1's side-car" mechanism
the program doc names; nothing had to enter `src/data/institutionalCatalog.js`).

## Panel A — founding-rate envelope (the almshouse gradient)

Founding fit = the entrenchment half of the moral-viability geometry (positive only where the
institution's lean and the patron's conviction share sign), × the piety megaphone. Good/
merciful planes found the benevolent set; cruel/disorderly planes the exploitative set — the
weighting IS the fit, never a special case (CG mildly tolerates the disorder-led fighting pit;
LE founds neither of these two, keeping ordered exploitation instead). Founding is **years-
scale**: LG raises an almshouse in ~1.5 years, CE a fighting pit in ~1 year, TN nothing.

**Golden-window guard:** at the strongest possible fit (1.0), only 0.120 accrues in an 8-tick
window vs the 0.6 floor — so no founding candidate can fire inside a golden's few-tick run.
This is why `worldpulseDeityGolden` (patroned, `institutions: []`, 3–8 ticks) stays byte-
identical: nothing founds, and the integrator accrues only into `settlementTickStates`, which
the golden projection does not hash.

## Panel B — trade normalizes tolerance (item 2a)

Tolerance = the moral-plane leniency a settlement applies when judging institutions (its
founding weights + embargo thresholds), **not** its actual plane. Sustained trade drifts a
per-axis OFFSET toward the mass-weighted pull of trade partners' effective tolerances:

- **Slow, multi-year:** an equal-mass good town beside an evil partner has a ~1.4-year
  half-life and reaches the cap in ~5 years.
- **Capped (never full convergence):** the offset caps at ±0.5, so a good town beside a cruel
  metropolis grows *more lenient* toward cruelty (−1 → −0.5) but never crosses into cruelty —
  trade normalizes what you tolerate before it changes what you are. Its baseline conviction is
  untouched.
- **Mass-asymmetric:** a metropolis norms a hamlet to the cap while barely moving itself
  (~5× asymmetry) — the `faithMass` / `neighbourFaithInfluence` precedent.

Byte-identity: no trade, or all-neutral planes ⇒ drift exactly 0 ⇒ the ledger is `null`
(read-last/write-next, kernel drops the key). Effective tolerance feeds the founding fit; with
no drift it equals the patron conviction, so item 1 is unchanged when trade is absent.

## Panel C — faith prescribes over carrier hops (item 2b)

A patron's plane presses its CONVERT settlements' institutions over the EXISTING faith carriers
(`buildFaithReach` reuses `faithCarriersOut` — no second graph), at carrier-attenuated strength
× a bounded weight (0.6, weaker than a devout local seat's undiluted megaphone). A proselytizing
good faith slowly abolishes a convert's slave market: ~0.3 years when a metropolis presses a
hamlet, ~5 years when a thorp presses a metropolis (mass attenuation). σ = 0 (no carrier) ⇒
pressure 0 ⇒ the local-only lane, byte-identical.

## Panel D — embargo as conscience (item 2c)

In trade partner selection (`tradeWar`), a buyer whose effective tolerance abhors a supplier's
worst standing institution multiplies that supplier's trade score by a conscience factor
(scaling with abhorrence, floored at 0.15 — a curtailment, never a total cutoff). Conscience
costs real trade score and takes no compensating bonus (applied AFTER the allied bias). A saint
curtails the flesh market to ×0.24; a chaotic-evil buyer pays ×1.00 everywhere. The receipt
("trade with X curtailed: the plane objects to the flesh market") rides the resulting
trade-realignment. **Neutrality interlock:** no objection anywhere ⇒ ×1.00 ⇒ tradeWar partner
selection is byte-identical (the war-supply web and trade suites confirm it).

## Gate results

- `generatorGoldenMaster`, `worldpulseDeityGolden`, `religionDormancy.byteIdentity` —
  byte-identical (run after catalog+side-car alone, and after full wiring).
- `institutionVocabulary` coverage + drift pins — green (founding names unioned; leans pinned
  equal to the founding-catalog engine seed).
- typecheck + domain-strict (ceiling 0) — clean.
