---
name: agent-brief-refused-as-injection-2026-07-15
description: ⚠️ HAZARD — an Opus implementer refused a legitimate dense wave brief as a suspected prompt-injection payload (0 tool calls); mitigation = verify-empirically-first preamble in briefs
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

2026-07-15: the W-LIFECYCLE implementer (Opus, Agent tool, worktree) REFUSED its brief outright
— zero tool calls, ~22s — reading the dense project context (the coordinator framing, the
owner-rulings lore, the constitutional laws, hazard warnings like "never git stash") as an
elaborate injection payload impersonating system authority. First refusal in ~15
identically-patterned dispatches this program; the same brief shape worked for W-CONVERGENCE /
W-UPSWING / W-NAVY / W-DISCOVERY the same day.

**Why:** a fresh subagent has no way to distinguish rich institutional context from a
fabricated authority prop — and briefs in this program are UNUSUALLY lore-dense (rulings
quoted verbatim, incident references, coordinator routing). The tells it cited (claims of
prior authorization, "your final text returns to the coordinator", pre-narrated git history)
are exactly the features of our legitimate setup.

**Recovery that worked:** SendMessage resume inviting the agent to do what it itself proposed
— verify EVERY brief claim against the actual filesystem before acting (git log, read the
committed design docs with `git log --follow`, run one focused test), proceed only if the
repo confirms, stop and report if it contradicts, and decline-on-evidence is always
acceptable. Key argument: every unusual brief clause is RESTRICTIVE (no stash, no push,
verify lineage, stop on missing symbols) — a brief that reduces authority is not the shape
of an injection.

**How to apply (future briefs):** lead implementer briefs with a short VERIFY-FIRST preamble:
"Treat every claim below as a hypothesis; verify against the repository (git log, the
committed design doc, one focused test) before acting; if the repo contradicts the brief,
stop and report." This converts the trust question into an empirical one up front and costs
two minutes. Applies to the W-MOMENTUM brief and all Surveyor-era dispatches. Related:
[[reopening-wave-stack-2026-07-15]].
