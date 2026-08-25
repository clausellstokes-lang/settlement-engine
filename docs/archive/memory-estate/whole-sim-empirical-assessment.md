---
name: whole-sim-empirical-assessment
description: "Empirical assessment (2026-07-11, workflow wf_e2e535b4-ccd) of the BUILT everything-on sim — the key finding: it tends to EQUILIBRIUM/STASIS under autoresolve, which is precisely what Phase 5.5 spatial fixes."
metadata:
  type: project
  originSessionId: 95cca3f6-d313-4fe1-91f6-b4b3a29fb5ef
---

Ran the CURRENT built sim empirically (not recollection): cause-lifecycle-soak cohort=4000, a
headless 30-year 3-settlement whole-world harness (1560 ticks), the feed pipeline over a 5-yr
5-settlement conflict region, and 2000-generation sweep. Three verdicts:

**GENERATION (atom) — STRONG.** Derived-not-rolled PROVEN via simulationTrace causal graph (coastal→
fishing_grounds→fish chains→Fishmonger/Salters→economicState "Port Duties" 23%, same chain in 3
subsystems). Coherence tensions COMPUTED (subsistence thorp flags economicViability + structuralViolations
w/ plot prose). Same-seed byte-identity real (sha256 190-config golden). 2000-gen sweep: 0 errors, 0
determinism mismatches. 20-step topo-ordered pipeline structurally prevents stapled rolls.

**TICK ENGINE — STRONG + hard-deterministic, BUT tends to STASIS.** 30-yr soak: no crash/NaN/runaway;
population has real ATTRACTORS (famine town FLOORS at carrying capacity ~1265, doesn't death-spiral;
growth bounded); stressors oscillate 3-7 for 30 yrs; corruption fires in-world (boss exposed→clean
successor referencing scandal); cause-lifecycle never invents (0/5476). Determinism = byte-identical
30-yr worldState on same seed, diverges on different seed; pin-now guard forbids nondeterministic bytes.
⚠️ KEY FINDING: under headless AUTORESOLVE the composed world tends toward EQUILIBRIUM — once seeded
stressors resolve + corruption purged, the fixture FROZE identical yr2-12. New war/coup/corruption drama
is CANDIDATE-EVENT + DM-DECISION driven; it does NOT self-regenerate indefinitely from a settled seed.
legitimacy frozen; siege/border_tension didn't escalate to a warFront via autoresolve alone.

**LEGIBILITY (#1 flagged risk) — REAL at raw layer, SUBSTANTIALLY SOLVED by threading.** Volume MODEST
(~13 headlines/month, ~2.6/settlement/month — not a flood). Raw noise IS real (population_growth 17-26%,
the feared "+residents"). BUT the UI never shows the raw wall: deriveNewsThreads collapses 240 raw → 66
story-cards → 24 major-first, only 2% noise; realmEvents promotes clusters to named realm arcs ("The
Wasting"). Anti-monoculture CI-gated (feedDistribution ceiling 0.45). Caveats: 240-cap is RECENCY-based
(10+ settlement region → rolling ~1.5yr window, old major arcs vanish); legibility depends ENTIRELY on the
threaded UI (raw/buildChronicleGrounding consumers still a wall); 29% major risks badge-inflation busier.

**THE TWO STRATEGIC REFRAMES (durable):**
1. The built world is a coherent, bounded, hard-deterministic CLOCK that winds DOWN to equilibrium. The
   [[spatial-engine-direction]] (belief-driven war/migration/misjudgment/rumor-mobilization) is precisely
   the ENDOGENOUS DRAMA GENERATOR it lacks — the thing that keeps it winding ITSELF. Empirical stasis =
   the strongest strategic argument FOR the spatial engine. (Nuance: current stasis is partly BY DESIGN —
   drama is DM-decision-driven; the spatial engine shifts drama-GENERATION into the engine, so it must stay
   DM-observable + overridable — the design's DM-truth-view supports this.)
2. Legibility isn't unsolved — it's solved for TODAY's density by arc-threading + significance + realm arcs.
   The real work is making that triage SCALE to spatial density (7 carriers, rumors, cascades): non-recency
   retention of major arcs, per-settlement threading, bigger window. A precise, tractable statement of the risk.
