---
name: owner-fix-philosophy
description: "Owner's standing instruction — prefer objectively-better/bolder architecture over safe minimal patches; maturing code to perfection"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 95cca3f6-d313-4fe1-91f6-b4b3a29fb5ef
  modified: 2026-07-27T09:32:38.233Z
---

When choosing between maximal safety of the current architecture and something objectively better that carries risk or requires overhauling architecture, the owner wants the latter **every time**, with cleanup. Verbatim intent: "I am trying to mature my code to absolute perfection... not simply fix it cleanly where it is at."

**Why:** The owner treats the codebase as a long-term product being matured to A+ (see `docs/A_PLUS_ROADMAP.md`); local patches that preserve suboptimal structure are counter to that goal.

**How to apply:** In fix work, prefer structural convergence (one source per fact, shared view models, decomposition) over point patches — but keep the repo's own invariants: gate green (`npm run check`), same-seed byte-identical engine output, pins updated rather than deleted. Related: [[exhaustive-review-in-flight]].

**⬛⬛ THE MODEL SPLIT — CURRENT STANDING ORDER (owner, 2026-07-27 ~05:30 mid-remediation-resume, "use Fable to manage and architect and validate and survey, with opus as the verifier and implementer"):** FABLE = MANAGER, ARCHITECT, VALIDATOR (gate-running/checking), SURVEYOR. OPUS = VERIFIER **and** IMPLEMENTER — pin `model:'opus'` on every implementation AND verification agent. This RESTORES the 2026-07-09 shape below and SUPERSEDES the same-morning "verify with opus, everything else fable" order (which had Fable implementing; R-0..R-3 fix lanes ran under that order — done, not to be redone). The 2026-07-09 machinery below is LIVE again, not history: escalation clause (case-by-case Fable implementer/verifier for judgment-dense slices), dual-use routing, ARCHITECT-EVERYTHING-AS-FABLE (Opus implements from Fable-authored specs), session-drift pinning.

**THE MODEL SPLIT (RESTORED as current by the 2026-07-27 order above; text from the owner's 2026-07-09 restatement — "for all parts of this work and beyond"):** Fable 5 = SURVEYOR, ARCHITECT, MANAGER (surveys AND re-grades/grade-checks — owner explicitly corrected 2026-07-09 that RE-GRADERS ARE FABLE, `model: 'fable'` on grading agents; designs specs, decomposes work, sequences, reviews reports, makes commit decisions). Opus 4.8 = VERIFIER and IMPLEMENTER (all implementation agents AND all verification agents — adversarial finding verification, post-fix verification passes, isolated-worktree proofs when agent-run). Every spawned implementation OR verification agent MUST carry `model: 'opus'`; every spawned survey/grading agent carries `model: 'fable'`. Fable's inline test-running/diff-reading before a commit is managing (allowed).

**Mandate expansion (owner, 2026-07-09):** After the F1–F47 program completes, "do whatever it takes to get everything to A+ in all dimensions, to your best judgment and the standards we have set." This puts previously owner-scope/deferred items IN scope: Track K north-star architecture, product-coherence consolidation, strict-typecheck burn-down, sim-eval fixtures, content-coverage gaps. Fable = architect + verifier of fixes; Opus = implementer (and optional pre-fix finding verifier). See the A+ CLOSURE PROGRAM in [[exhaustive-review-in-flight]].

**Overnight/autonomous mandate (owner, 2026-07-09, going to bed):** Full best-judgment authority on everything in sequence, including permission to RESEQUENCE phases. **THE A+ MAINTENANCE INVARIANT (standing, highest priority):** once A+ is reached, every owner-requested change (Phases 4 faith / 5 content-identity / 6 data layer, and anything after) must KEEP the A+ rating. Operationalized: every new-phase workstream must (a) land full-gate green, (b) follow golden discipline (reviewed regens only, evidence-first), (c) carry its OWN enforcement pins at authorship time (claims-carry-enforcement applies to new features, not just fixes), (d) never regress any ratchet (first-paint budget, strict baseline/zero, cycle baseline, button/color budgets, coverage floors), and (e) each phase closes with a grade-check pass (mini re-review of affected dimensions) before the next phase opens. New features are born at A+, not brought there later.

**RULE-OF-THUMB restated by owner 2026-07-12 ("whenever starting an action") — the standing action loop:**
(1) FABLE 5 runs the survey + dimension surveys FIRST. (2) Only after that, for each finding, OPUS 4.8
ULTRACODE both VERIFIES the finding and IMPLEMENTS the fix — "comprehensively, coherently, seamlessly,
carefully, cohesively, and exhaustively with the utmost fidelity." (3) Safety-vs-better: when choosing
between maximal safety of the current architecture/code and something OBJECTIVELY BETTER that carries
risk or requires overhaul — choose the latter EVERY TIME, and clean up. "Maturing to absolute perfection,
not fixing cleanly where it is." (4) FABLE 5 as architect, manager, and CHECKER after each fix.
**The operational synthesis (how boldness coexists with the constitution):** the byte-identity/dormancy
laws are themselves owner constitution — so boldness applies WITHIN them: overhaul the architecture,
PROVE the bytes (the CL-0 worldState 9-triplet consolidation is the exemplar: a structural rewrite,
goldens proving byte-identity). Bold structure + byte-proof harness = maturity without regression.
Briefs should prefer the REAL architecture over the minimal touch whenever both satisfy the gates
(FP-1: the real registry split, not byte-shaving; SEASONS-A: the real granary model on foodStockpile,
not bolt-on modifiers; Keystone: port the router properly, never wrap the iframe).

**⬛ THE ESCALATION CLAUSE (owner, 2026-07-19, amending THE MODEL SPLIT):** "where you
deem it necessary, but not the default, implementation for difficult tasks can upgrade
to fable before going back to opus. Judge on each case by case." + same day: "that
also goes to verification." Opus 4.8 remains the STANDING implementer AND verifier
tier; the manager may staff a Fable implementer OR Fable verifier for a specific
difficult task, case-by-case, recording the reason in the brief/ledger, and the
next task reverts to Opus. Manager's recorded criteria: escalate when the task is
judgment-dense with high blast radius or architectural ambiguity (fold conflict
reconciliation, the master merge execution, ROUND 3 adversarial verification of
subtle engine findings, C13 ONE DOOR consolidation, soak-harness matrix design);
never for mechanical conversions, spec-clear slices, or test reconciliation.

**⬛ THE DUAL-USE ROUTING CLAUSE (owner, 2026-07-20 — "flag future tasks, preassign which parts can safely work with Fable vs Opus"):** EXPLOIT-SHAPED tasks route to OPUS regardless of the implementer/architect split — payload construction, ATO/attack-chain reasoning, secrets-seam/info-leak fixes, RLS/auth/SECURITY-DEFINER SQL, offensive-security analysis, security-finding refuters. Reason: the work is authorized DEFENSIVE security on the owner's own repo (permitted on both tiers), but Fable adds dual-use friction on payload/attack shape → Opus flows clean; this is calibration-fit, NOT safety evasion (a genuinely off-limits task would be declined on Opus too). JUDGMENT-DENSE non-security work — voice/immersion/register, a11y/UX craft, narrative-quality instruments (story census, spell-break gate), AND all architecture/checking/commit — stays FABLE. The SESSION need not flip: the manager sets each subagent's model, so Fable-session + Opus-routed-security-subagents is the steady state. Per-cycle routing table lives in scratchpad/CYCLE2_FIX_PLAN.md.

**⬛ ARCHITECT-EVERYTHING-AS-FABLE (owner refinement 2026-07-20):** the exploit-shaped→Opus routing is for IMPLEMENTATION + PAYLOAD-BEARING PINS + exploit-shaped VERIFICATION only. FABLE ARCHITECTS EVERY FIX, security ones INCLUDED — defensive design (enumerate the sinks, name the chokepoint, specify the enforcer/pin CONTRACT) requires no exploit construction and carries no dual-use friction. The Opus implementer receives a Fable-authored defensive spec and builds the attack payloads / reproducing exploit tests. Proven on wave 1: Fable wrote "route untrusted .map content through one scrub helper at these 4 sink types + mirror the F6 rule across both import paths + pin no-breakout"; Opus built the onerror= vectors. The seam is DESIGN (Fable, always) vs PAYLOAD-CONSTRUCTION (Opus). This keeps architecture unified under Fable while honoring the caution profile at the layer that actually needs it.

**⬛ INTRA-TASK SLICE ESCALATION (owner 2026-07-20, "switch that part to Opus, then back to Fable for the rest"):** the manager CANNOT flip its own session model (owner-only /model), but achieves the same effect at SUB-TASK granularity: if a single slice of a Fable-architected task genuinely can't be designed without exploit-shaped reasoning, Fable spawns a ONE-SHOT Opus micro-agent scoped to THAT slice only, integrates the returned answer, and resumes architecting the rest as Fable. Session never changes; it is a delegated scoped sub-call (clean hand-off-and-return, not an in-place reasoning-stream swap), so "back to Fable for the rest" is automatic. Granularity ladder: (1) whole-task routing table; (2) design-vs-payload seam; (3) this — a single stuck slice mid-architecture. Kept rare: Fable architects the vast majority of defensive fixes with no exploit construction; this is the exception hatch.

**⬛ SESSION-DRIFT-PROOF PINNING (owner 2026-07-20, "even now we just got switched to opus"):** the session model DRIFTS (fast-mode / harness / stray flip) and the manager can neither prevent nor reliably detect it in-turn. RESOLUTION: do NOT depend on the session model for anything that matters. Pin `model` EXPLICITLY on every subagent that cares — security/mechanical → `model:'opus'` (already standing); narrative/immersion/UX/judgment WAVES → spawn as explicit `model:'fable'` SUBAGENTS rather than doing them inline, so they get Fable even when the session drifted to Opus. Only the thin orchestration layer (read reports, run gate, stage, commit, ledger) inherits the drifting session — and that layer is genuinely model-agnostic (Opus 4.8 and Fable both do it well; all artifacts identical). Bonus: during the SECURITY-heavy stretch (wave 5, FMG remainder, COGS SQL) an Opus session is the FRICTIONLESS place to be — the drift helps there. Stop babysitting /model; pin per-subagent.

**Model-swap continuity (owner-set policy):** The main-loop model may temporarily switch (harness flags / owner's /model). The assistant CANNOT switch itself back — the owner runs `/model claude-fable-5` when they notice. Whatever model is running: continue the exact same plan from [[exhaustive-review-in-flight]] without re-litigating; keep launching implementer subagents with `model: 'opus'` explicitly; architect/checker work inherits the session model. All state (this memory, task list, commits, workflow journals) is model-agnostic by design.
