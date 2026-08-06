---
name: ""
metadata: 
  node_type: memory
  title: W-UPSWING shipped — calamity bucket + reconstruction/boom/flourishing arcs + motive integration
  date: 2026-07-15
  tags: 
    - upswing
    - spatial-engine
    - calamity
    - reconstruction
    - boom-bust
    - flourishing
    - dormancy
    - first-paint-budget
    - drama-class
  status: BUILT + full-gate green; COMMITTED on claude/w-upswing (off review-fixes-2026-07-08 @ 1a0b868e); NOT pushed/merged
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-UPSWING — the same variables, running up

## Why this matters
The engine's write traffic ran mostly DOWNWARD (the stasis finding). W-UPSWING completes the SIGN:
booms, rebuilds, and golden ages are emergent READOUTS over the SAME ledger the downswings write —
conserved (every upswing debits a typed source), limited, regional-or-local, gated dormant. Binding
spec: docs/DESIGN_UPSWING.md (constitution + §4 pins) + DESIGN_UPSWING_RELATIONSHIP_FLOWS.md §3 (Part B).

## What shipped (branch claude/w-upswing, 6 commits off 1a0b868e)
- **Stage 0 — THE CALAMITY BUCKET** `45eb5387`. The M11b mechanics were ALREADY type-blind; this
  constitutionalizes it WITHOUT kernel rework. (a) Flavor demotion — DISASTER_TYPE_BY_TERRAIN's output
  is a COSMETIC flavorHint under the SAME persisted stamp key `type`; engine title/news/receipts speak
  the BUCKET ("The Great Calamity of {name}, year {year}"); `stampTitle(name, year)` is type-agnostic;
  newsVoice calamity lines lost flood/fire/waters/smoke (fixed the recon-found quake-draws-flood mismatch).
  (b) Exposure loading — uniform 1/(15·N) hazard now redistributed by a bounded [0.75,1.5] terrain+dwell
  multiplier NORMALIZED so the realm-MEAN hazard == annualHazard exactly (pinned); `disaster:*` fork order
  UNCHANGED (pure pre-pass). (c) FORCE_CALAMITY — registrable-shape verb (forceCalamityEntry/
  forceCalamityStrike) resolving through the SHARED resolveStrikeOnSettlement helper; force ≡ organic at
  the 'moderate' band (pinned byte-identical); NOT registered (W-COMPOSER-2 lift). (d) display-lazy
  calamityLedger.js reads the previously-unread calamityHistory. ⚠️ THE ONE-TIME SHIFT was contained:
  NO hash-golden runs lit (only calamity.test.js + calamity.kernel.integration.test.js light disasters),
  so NO isolated golden re-derivation commit was needed — the two calamity assertions were updated in
  place. Dark worlds byte-identical throughout.
- **Stage 1 — B1 RECONSTRUCTION** `3309e11b`. THE NEW MOVER src/domain/worldPulse/upswingKernel.js (lazy
  leaf) at the advanceGenerosity pulse seam, behind virtual `upswingArcsEnabled` (ABSENT from
  DEFAULT_SIMULATION_RULES). Positive-polarity `reconstruction` condition (registered LIFT in
  archetypeCatalog.UPSWING_LIFT_CONDITIONS + causalState.LIFT_ARCHETYPES + a CONDITION_ARCHETYPE_TEMPLATES
  entry). Armed by a recent UNRECONSTRUCTED calamity stamp OR a siege/occupation-clearing condition
  (consumed on arming; the stamp is marked `reconstructedAt` on completion — prevents the perpetual re-arm
  bug). Progress = f(prosperity, builder roster, inbound ally credit, peace), regressing on new shocks.
  CONSERVATION: ally acceleration MATURES (debits) the obligation ledger (foldObligations repayment).
  ABSORPTION CAP binds + is deferral-visible. Completion: history beat + legitimacy dividend + institution
  UPGRADE up the lattice (new export calamityKernel.promotesTo — the demote lattice read in reverse) + the
  reconstruction SKIM (funds × low conscience via computeMalice mints a corruption-pressure condition).
- **Stage 2 — B2 BOOM→BUST** `d7c153f9`. Sustained M6d tradeFlow throughput + entrepôt centrality mint a
  `boom` with HYSTERESIS (building dwell → boom); records its OWN FRAGILE EDGES (<2 arteries) + typed
  source set; prosperity DRIFTS up (accrued fractionally, band-step at accrual≥1.0). Severance
  (embattlement OR throughput collapse) flips boom→bust: prosperity retreat + legitimacy knock + receipt
  NAMING the severed artery. Emigration EMERGENT (M4 reads prosperity). ⚠️ W-DISCOVERY SEAM in-file: a
  resource-removal event rides the SAME bust flip + joins the boom source taxonomy.
- **Stage 3 — B3 FLOURISHING** `a4d2c311`. THE PEACE-DWELL COUNTER (none existed — derived from
  warFrontsInto/From + a dwell stamp in the ledger). High prosperity + legitimacy + PEACE for N ticks →
  bounded `flourishing` LIFT + a cultural founding bias (ONE Academy if none) + a chronicle beat. NEVER
  SNOWBALLS (no prosperity/army/economic_capacity touch — pinned). Capped duration + cooldown. Registered
  the producer under the PRE-DECLARED `boom_flourishing` drama class (decisionTier.upswing_flourishing,
  wired:false; the walker enforces it — the 7th class was declared-but-empty before this).
- **Stage 4 — MOTIVE INTEGRATION** `122dd18c`. The DEPLOY score (settlementStrategy.enumerateMoves) gains a
  bounded signed EXTRACTION-UPSWING EV term (economicStrength01 minus a flat burden, scaled DOWN by
  foreignGripOf — the conqueror's corruption leak). Wired via the W-PEACE-1 `causal` injection idiom;
  0-when-dark (gate inlined at the caller). ⚠️ JUDGMENT (vetoable): foreignGripOf is the corruption-leak
  proxy (the exported read the brief named).
- **Soak** `80ba4e3b`. The 8-settlement RECEIPTED RECOVERY acceptance test (verbatim): a devastated realm
  rebuilds itself endogenously (recon arc completes + chronicle beat) + conservation + same-seed determinism.

## State / ledger shape
Sparse, drop-when-empty `upswing` spatial ledger with sub-maps `{ reconstruction, boom, flourishing }`.
Dormancy proven by tests/property/upswingDormancyGolden.test.js (captured PRE-WIRE; holds wired-but-dormant).

## Gates + budget
Full gate green: typecheck (full + domain-strict) + eslint (0 errors) + the full suite
(**9509 passed / 1 skipped / 1 failed = the guidanceRegistry title= ratchet, PRE-EXISTING at
base 1a0b868e — base .jsx already carries 477 native title= vs the 476 baseline; W-UPSWING
touched 0 .jsx / 0 title=, so it is inherited, not caused**). ⚠️ Full-suite ratchets tripped by
the new arcs + had to be reconciled (commit 7ed60013): faction-impact 1:1 (30→33), the
domain any-cast baseline (settlementStrategy re-typed to hold at 30), the aiGrounding
edge-shared bundle hash (regenerated — activeConditions/causalState are inputs). first-paint
closure **1,143,443** (+948 B eager over the stage-0 baseline, ALL from the stage-1 catalog registration —
the mover + stages 2-4 are ZERO-eager lazy) → **5,813 B under the 1,149,256 budget** (no raise; the ratchet
holds). Pins: dormancy byte-identity; TYPE-BLIND-stays-type-blind; exposure normalization; force≡organic;
conservation receipts + ally maturation; absorption cap; regress-on-shock; skim-only-low-conscience; bust
names artery; flourishing-never-snowballs; the extraction-leak pin; the recovery soak.

## Deferrals (documented, not bugs to re-find)
- W-DISCOVERY resource-removal → bust flip (seam-noted in-file, both directions).
- FORCE_CALAMITY manifest registration (W-COMPOSER-2 lift) — the SHAPE ships, not the registration.
- calamityLedger wiring into the live dossier view (built + tested; live-surface wiring deferred — eager risk).
- B3 founding bias is a direct single-Academy found, not the moralInstitutionPressure cadence integration.
