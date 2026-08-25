---
name: opus-era-marking-directive
description: "OWNER DIRECTIVE (2026-08-06): run EVERY operation on Opus 5, and mark anything not architected, managed AND validated by Fable 5 for survey at the next free Fable weekly credit — the marking covers all three verbs, so an Opus-ARCHITECTED volume is owed a survey even where an Opus verifier passed it; the debt is retroactive and NEVER gating. Build pause LIFTED same day."
metadata:
  node_type: memory
  type: project
  created: 2026-08-06
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-06T10:28:25.476Z
---

# The Opus-era marking directive (owner, 2026-08-06)

**Owner's words (verbatim intent):** "use opus 5 for everything. anything that is
not validated, managed, and architected by fable five must be labeled as such and
marked for validation from fable at the next time that we have fable 5 weekly
usage credit free."

This restates and WIDENS the Fable-debt clause of 2026-08-05 recorded in
[[opus-succession-active]]. The widening is the part worth not re-deriving.

## The operative rules

1. **Every operation runs on Opus 5.** No operation waits for Fable; nothing
   pauses. Full standing authority, per [[opus-succession-active]] rule 1.
2. **Every ledger row this era carries `⏳ OPUS-ERA — FABLE SURVEY OWED`** in its
   heading line in `docs/FABLE_VALIDATION_QUEUE.md`.
3. **Every chair-grade judgment is itemized as a `J-*` entry** inside its row, so
   Fable can re-rule cheaply without reconstructing the reasoning.
4. ⭐ **THE MARKING COVERS ALL THREE VERBS — architected, managed, validated.**
   The debt is owed unless Fable did *all three*. In particular: **an
   Opus-ARCHITECTED volume is owed a Fable survey even where an Opus verifier
   already passed it.** An Opus verifier discharges the *validated* verb only, and
   one verb is not the set. This is the clause most likely to be lost, because a
   green verifier feels like completion.
5. **The debt is RETROACTIVE and NEVER GATING.** Work proceeds at full speed and
   the survey happens later; a marked row is a bookmark, not a blocker. On the
   next Fable-available session — from WHICHEVER Claude discovers it — the survey
   and validate pass over all owed rows is Fable's FIRST work, before new
   Fable-era chair work.

## Two standing facts recorded the same day

- **THE BUILD PAUSE WAS LIFTED on 2026-08-06.** The stream had been paused at
  SP-C while the owner focused on the ontology review ahead of an account switch;
  that pause is over. Do not carry the paused-at-SP-C state forward as current.
- **THE RISK DIRECTIVE GOVERNS ENGINEERING CHOICE:** where the maximally-safe
  option and the objectively-better-but-riskier option diverge, **take the better
  option every time.** It governs choices *inside* delegated scope only and does
  NOT unlock the owner-gated classes (pushes/deploys, migrations, schema or
  persistence shape, public-API surface, data deletion, security posture, paid
  surfaces, owner-parked items) — those stay gated. See
  [[owner-risk-appetite-directive]] for the original 2026-07-27 statement.

**Why:** the model split ([[fable-build-era-takeover]]) makes Fable the
architect/manager/validator and Opus the implementer+verifier. When Fable is
absent, work must not stall — but neither may the era quietly accumulate
unreviewed chair-grade decisions that *look* reviewed because a competent verifier
passed them. The three-verb rule is what keeps "Opus verified it" from being
mistaken for "Fable validated it". Marking is cheap; reconstructing which of a
hundred rows had chair-grade judgment in it, months later, is not.

**How to apply:** while working as Opus, append the marked row in the SAME commit
as the judgment it records — never batch the marking to the end of a wave. Put the
`⏳ OPUS-ERA — FABLE SURVEY OWED` marker in the heading, list each chair-grade call
as its own `J-*` line with the evidence that decided it, and name explicitly what
Fable should re-examine. When you architect anything as Opus, say so in the row —
that is the case rule 4 exists for. Never treat a recorded past authorization as
present permission: pushes, deploys and publishes still need fresh owner approval
in the current session, every session.

Related: [[opus-succession-active]] (the 2026-08-05 Fable-debt clause this widens)
· [[fable-build-era-takeover]] (the chair/implementer split) ·
[[owner-risk-appetite-directive]] · [[owner-blanket-queue-signoff]] ·
[[fable-budget-workflow-staffing]] (the role split and model assignment).
