---
name: fable-budget-workflow-staffing
description: "OWNER ROLE SPLIT (2026-08-04, directive): Fable = architect, manager, recon, surveyor, validator; Opus = managed implementer AND verifier. Subagents inherit the session model — set model:'opus' on every implementer/verifier"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T16:42:51.627Z
---

**THE ROLE SPLIT (owner directive, 2026-08-04, verbatim intent): "fable is
architect, manager, recon, surveyor, and validator. But opus is the managed
implementer and verifier."** Binding on every dispatch:

- **Fable-side (main loop, or subagents left to inherit the session model):**
  architecture (specs, rulings, wave briefs, design counsel), management
  (dispatch, protocol, heartbeats), recon (scouting, censuses, premise
  re-measurement), surveying (tree/WIP/state surveys), validation (ruling on
  lane returns, glance verdicts, queue rows).
- **Opus-side (`model: 'opus'`, always working under a chair brief with
  STOP-and-report):** implementation of any build lane, and the in-lane
  adversarial VERIFIER. This supersedes the older note below that reserved
  "adversarial verification" for inherit-Fable — build-lane verifiers are
  Opus, managed; what stays Fable is the chair's *validation* of what the
  implementer+verifier pair returns.
- Interpretation on design lanes (chair judgment, vetoable): a design COUNSEL
  authoring a spec is architecture (Fable); a design CRITIC pressure-testing
  it against owner directives is validation (Fable). Build-lane code verifiers
  are always Opus.

2026-08-02: the owner flagged that the FP correction pass consumed ~15%+ of the
weekly Fable allowance ("just making a comment", not a stop order — the run was
allowed to finish). Root cause: Workflow/Agent subagents INHERIT the session
model unless `model:` is set per-agent, so a Fable-chaired session fanning out
7-8 correctors runs them all on Fable.

**Why:** the owner's model split ([[owner-fix-philosophy]]) already assigns
implementation/verification to Opus (and external implementation to Sol);
Fable is for judgment, architecture, validation. Chair rulings made in the main
loop ARE the Fable-grade work — applying them is not. Weekly Fable capacity is
a real, watched budget.

**How to apply:** when authoring workflow scripts or Agent fan-outs from a
Fable session, set `model: 'opus'` (or lower per judgment density) on every
bulk corrector/implementer/sweeper agent; reserve inherit-Fable for judge
panels or adversarial verification the chair genuinely cannot tier down.
Retrofit note: fp-correction-pass-wf_55b17a80-9b8.js had no model overrides —
its 2026-08-02 completed run was all-Fable; future re-runs of that shape
should be restaffed.
