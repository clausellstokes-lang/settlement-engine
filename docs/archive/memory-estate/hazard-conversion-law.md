---
name: hazard-conversion-law
description: "⭐⭐ THE HAZARD CONVERSION LAW (owner-directed 2026-08-07): every confirmed hazard class becomes MACHINERY or is EXPLICITLY ACCEPTED with a reason. A recorded hazard is a DOCUMENT and documents do not prevent recurrence — proven by three classes that bit the same day they were already written down."
metadata:
  node_type: memory
  type: feedback
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T20:37:48.117Z
---

# Documents do not prevent recurrence. Machinery does.

**THE OWNER'S OBSERVATION, 2026-08-07, and it was correct:** *"if you recognize that they are
recurring pattern then that means that we're not already solving them. And they keep creeping
up."* Errors kept recurring **despite being recorded with their cures**, so recording was not
working.

## The evidence, all from a single day

- The **config-slot trap** is recorded WITH its exact cure ("assert `_seed` arrived") — a lane
  walked straight into it.
- The **piped-exit-code** hazard is recorded and has a complete cure (`scripts/gate-tail.sh`) —
  it fired FOUR times that day, twice by the chair, while the chair was briefing others against it.
- The **edge-bundle law** is recorded — the chair broke it by reading "touching bundled inputs"
  as not covering a pure `git mv`.

⭐ **WHY: a recorded hazard requires someone to read it at exactly the right moment, while doing
something else.** The estate is 406 memory files / 191 carrying a cure. Nobody holds that in
working memory during a refactor. Vigilance does not scale; a failing build does.

## The law

**EVERY CONFIRMED HAZARD CLASS EITHER BECOMES MACHINERY, OR IS EXPLICITLY ACCEPTED AS A DOCUMENT
WITH A STATED REASON.** Documents were the default and machinery the exception — that inverts the
actual value. Writing a walker costs one wave; re-finding a class costs a wave EVERY TIME, forever.

**FOUR STATUSES**, and the third is the one that hides:
- **MACHINERY** — an enforcer file exists and the class cannot recur silently. ⚠ Verify the file
  EXISTS and RUNS; a class claiming machinery whose enforcer is absent is the worst kind of
  document, one that looks solved.
- **PARTIAL** — ⚠⚠ **a cure exists but is OPTIONAL.** `gate-tail.sh` fully solves the exit-code
  class and the chair routed around it by hand-rolling a pipeline. **A cure you can bypass is a
  document wearing a tool's clothes.**
- **DOCUMENT** — no enforcer, no acceptance. The owed pile, and it is SHRINK-ONLY.
- **ACCEPTED** — deliberately left as prose, with a written reason.

## ⭐⭐ THE CENSUS, MEASURED 2026-08-07 — 83 CLASSES

**MACHINERY 14 · PARTIAL 15 · DOCUMENT 52 · ACCEPTED 2**, and the honest size of the treadmill
is **87 instances carried by DOCUMENT-status classes.** Build order = instance count descending:

| n | status | class |
|---|---|---|
| **11** | DOCUMENT | `HZ-WRONGLINEAGE` — a task lands on the wrong lineage/worktree. **THE #1 TREADMILL, ZERO machinery.** ⭐ "The recorded cure IS effective when applied — the failure is that applying it is VOLUNTARY." |
| 7 | PARTIAL | `HZ-PIPEEXIT` — the canonical PARTIAL; `gate-tail.sh` solves it completely and gets routed around |
| 7 | MACHINERY | `HZ-NUL` — ⭐ **detects but does not prevent**, which is why 7 instances became 0 shipped defects |
| 5 | MACHINERY | `HZ-FACTIONKEY` (closed) · 5 `HZ-SEARCHPATH` |
| 4 | PARTIAL | `HZ-EPISTEMIC` · `HZ-LINEADDR` (walker scoped to ONE file) · `HZ-CONFIGSLOT` · `HZ-EDGEBUNDLE` |
| 4 | DOCUMENT | `HZ-DERIVERESTATE` |

## ⚠⚠⚠ BASELINING A FAILING **WALKER** TURNS A GUARD OFF — AND WE DID IT

**The sharpest finding of the census.** `HZ-EPISTEMIC` is recorded as SHIPPED machinery — the
anchored-negative and seed-loop walkers EXIST and RUN. But **FOUR of their rows are frozen in
`scripts/.test-ratchet-baseline.json`** (the step-12 census landed the same day), including *"no
NEW un-anchored negative assertion"* and *"the four generation-facing trees stay at EXACT zero"*.
**So a NEW violation does not redden the gate — the failing row is already tolerated.**

⭐ **THE LAW: a failing TEST is debt; a failing WALKER is a DISABLED GUARD.** They must never be
frozen by the same mechanism. Any test-ratchet census entry whose test is an enforcement walker
is a hole, not debt, and must be burned down rather than banked.
⚠ Compounded by the recorded red-ratchet hazard: a red-both-sides ratchet's inventory grows
behind an EMPTY row diff.

## The metric that answers "are we on a treadmill"

**NOT errors-per-round — that never goes to zero. It is INSTANCES PER CLASS OVER TIME.** The
first instance of a class is unpreventable; nothing predicts a shape that has never appeared. The
only question is whether the SECOND is prevented. A class with one instance and a walker is
CLOSED; a class with four instances and no walker IS the treadmill.

## The second half: predict by SHAPE, before the wave

You cannot predict which bug you will write. You CAN ask **"which recorded classes does this
wave's shape expose?"** — a relocation wave exposes bundled-input paths; a new-file wave exposes
zero-ceiling rules; a corpus-builder wave exposes the config-slot trap. Built as
`scripts/premortem.mjs` (advisory, never blocking — a noisy blocker gets disabled).
⭐ Its acceptance test is the same shape that made the reader-without-a-writer walker real: **it
must retro-warn on the commits that ALREADY tripped each class.** An instrument that cannot
rediscover known history is decoration.

⚠⚠ **THE TRAP THIS LAW MUST NOT FALL INTO: the law is itself a document.** Its integrity is
therefore GATE-ENFORCED by `scripts/check-hazard-registry.mjs` over `scripts/hazard-registry.json`
— a statusless class REDS, an ACCEPTED entry without a reason REDS, and the DOCUMENT count is
shrink-only. Without that, this file is one more thing nobody reads at the right moment.

**How to apply:** at the close of any round that confirms a hazard class, do not stop at writing
it down — assign a status and, if MACHINERY is owed, queue the walker. Rank the build order by
INSTANCE COUNT: the classes that have bitten most are the ones still costing waves.
Related: [[structural-prevention]] · [[epistemic-prevention-shipped]] ·
[[observed-shape-readers-walker-landed]] · [[receipt-vacuity-and-shared-ratchet-rules]].
