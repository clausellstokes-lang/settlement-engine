# W-R2-SEAMS — the cross-wave engine seams wave
## Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST. Branch: `claude/w-r2-seams`.
## Base symbols to verify: src/domain/worldPulse/navalKernel.js exists; upswingKernel.js has freshSettlement (~line 358); settlementLifecycleFirstClass.js exists.

**CHARGE:** close the verified cross-wave composition seams in the engine kernels. Nearly all
targets are DARK kernels (virtual flags) — fixes there are byte-neutral by dormancy; PROVE it
(dormancy goldens stay green). Generosity + calamity paths are partially LIT: per-fix golden
proof required; a fix that legitimately shifts lit bytes STOPs → record as Track-G2 material.

**FENCE:** src/domain/worldPulse/** + their tests. Nothing in components/store/pdf/data.

**THE FIXES** (finding ids — extract records + verdict corrections per the protocol; verdict
corrections BIND):

Engine lifecycle seams:
1. `worldpulse-war-military-1` — naval records never retire. ROLE-AWARE per verdict: convoys
   retire on arrival (+ optional return leg) / on escorted-deployment-gone / on owner-or-target
   leaving snapshot.byId; do NOT blanket-rebuild from deployments (blockades are port-keyed by
   design). Pin: convoy arrives → record retires → navy can re-operate (organic AND via verb).
2. `worldpulse-war-military-4` — blockades gain their organic end: retire when owner–target
   hostility ends or the momentum course cracked; lift news beat; pin: peace → blockade lifts.
3. `worldpulse-economy-upswing-1` — ONE shared remnant predicate (export from
   settlementLifecycleFirstClass; consume at every mover enumeration: upswing B1/B2/B3, calamity
   annual loop, resourceDynamics, generosity orientation). Verdict strengthens: recon-on-corpse
   is arithmetically certain (dwell 104 < window 156). Pin: die-then-advance fixture — zero
   mover activity on the remnant.
4. `worldpulse-economy-upswing-5` — terminal death with live steadings: run the abandonment
   path per steading (population conserved through the migration ledger), receipted.
5. `worldpulse-economy-upswing-6` — terminal death also clears config.eventConditions (+ _config
   twin) per the expiry-helper pattern. Pin: die-with-condition → regen → zero conditions.
6. `determinism-constitution-1` — upswing freshSettlement reads nextUpdates (the lifecycle-kernel
   idiom; one-word fix) + the same-tick composition pin (recon-completes + boom-busts same tick;
   no write lost). Consider extracting the shared helper so the two kernels cannot diverge.

Conservation seams:
7. `worldpulse-economy-upswing-2` — same-tick multi-receiver overdraw: per-giver remaining-
   headroom map (or wire the built triageAllocation). Pin: two claimants, one granary — floor
   never crossed.
8. `worldpulse-economy-upswing-4` — repayment fold passes decayPerTick: 0 (single-decay law);
   two-fold same-tick magnitude pin.
9. `worldpulse-economy-upswing-3` (verdict PARTIAL→low; OPTIONAL but cheap) — boom cooling
   branch (throughput < BOOM_EXIT_THROUGHPUT ∧ not severed ⇒ boom_cooled receipt, no bust
   penalty). Read the verdict's correction first; if it argues the current behavior is
   acceptable, record the deferral instead.

Psychology/politics seams:
10. `worldpulse-politics-psychology-1` — alignmentAxes parses the categorical alignment strings
    npcStates actually carries + parenthesize the misparsed ternary. Pin both kinship poles.
11. `worldpulse-politics-psychology-2` — settlementUnderThreat reads the real sources
    (worldState.warPosture[cid] + the war_front/besieged predicate), defensive field reads kept
    as fallback. Pin: live war_front → threat-glue bloc forms.
12. `worldpulse-politics-psychology-4` — ENTRY_ONLY descriptors excluded from cliff aggregation
    + consumed on the deposit side. Pin both directions.
13. `worldpulse-politics-psychology-5` — crack window widened (recalled.tick === now || now-1)
    with chargedTick idempotence. Pin: proposal-lane peace pays exactly once.
14. `sim-cohesion-counterparts-1` — interventions-ledger read in commitmentDepositsFor (course
    contest:<target>|<side>, LOUD_INTERVENTION); delete the unreachable role==='intervene'
    ternary. Pin: live intervention accrues stock.
15. `sim-cohesion-counterparts-2` — thread evidenceClass into the commitment discount via
    counterEvidenceEffectiveness (the conscience door). Land the paired good/evil fixture pin.
16. `sim-cohesion-counterparts-3` — peace01Of returns 0 under activeBlockadeTargets (+ live
    campaignPlans targeting id). Pin: blockade lands → flourishing gate closes.

Tick-core seams:
17. `worldpulse-tick-core-1` — the three consequence readers (moral drift, misjudgment news,
    tempo fold) iterate the dismissal-FILTERED set; pulseRecord's full-set recording untouched.
    Add moralDrift/tempo to the residue-guard checkers or its documented allowlist.
18. `worldpulse-war-military-2` — one-army bidirectional: warDeployment step 4 skips fromId
    when interventionActive ∧ the interventions ledger holds interId===fromId (lazy read,
    0-when-dark — honors the recorded isolated-ledger JUDGMENT). Pin it.
19. `worldpulse-war-military-5` — DECLARE_CASUS decree carries through the fold with explicit
    decay (decreedUntilTick or ~8-tick ramp, max-merged with state-derived score). Pin: decree
    survives ≥2 ticks, decays visibly, never immortal.

**EXCLUDED (REFUTED — do not fix; read the verdicts if curious):** worldpulse-war-military-3
(occupation-on-overstay), worldpulse-politics-psychology-3 (politics receipts display).

**ORDERING NOTE:** fix 3 (remnant predicate) before 1/2 (naval reads it for owner-vanished);
fix 6 before 7-9 (the composition pin needs the corrected freshSettlement).
