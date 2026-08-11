# Implementation packet standard

**Status:** CANONICAL

**Scope:** instructions compiled for coding agents from SettlementForge design law

**Measured tree:** `claude/composite-r4` at
`f1895e6004eb512a5c7b4c9b4caaf79604bccea6` on 2026-08-09

## Purpose

An implementation packet is the only document that may tell a coding agent to
implement a not-yet-built subsystem slice. Architecture documents explain the
durable system and product intent. Program queues explain dependency order.
Receipts explain what landed. A packet compiles those sources against live code
into one bounded instruction set for one micro-wave.

The target is **zero architectural discretion and bounded coding discretion**.
The implementer chooses ordinary local expression. The implementer does not
choose state ownership, persistence shape, feature semantics, integration
ordering, test scope, product behavior, or which contradictory source wins.

More detail is not automatically better. A packet is successful when every
load-bearing choice is settled and every adjacent choice is excluded.

## Authority order

Packet authors reconcile sources in this order before marking a packet READY:

1. Live git state decides what exists and what has already landed.
2. The newest owner ruling decides intended product behavior.
3. `CONTRIBUTING.md`, `ARCHITECTURE.md`, canonical contracts, and repository
   agent instructions define system invariants and operating law.
4. A READY packet is authoritative only at its named branch and verified base,
   or an unchanged descendant admitted and pinned by sealed dispatch.
5. `DESIGN_*.md` files supply intent and rationale after reconciliation.
6. `SOL_QUEUE.md`, ledger-only bootstrap documents, resume snapshots, old
   roadmaps, and `docs/briefs/` never prove that work is open.

If two higher authorities still disagree, the packet is BLOCKED. A coding agent
never adjudicates the disagreement.

## Packet statuses

Only these statuses are valid:

- **DRAFT** — incomplete or not fully reconciled; never dispatch.
- **READY** — reconciled against the exact verified base; may dispatch only
  when the preflight still matches.
- **BLOCKED** — instructions are intentionally withheld pending a named
  dependency, ruling, attestation, or substrate decision.
- **LANDED** — the packet's work is present at a named commit and must not be
  re-dispatched.
- **STALE** — the verified base or a load-bearing symbol changed; coordinator
  revalidation is required.
- **SUPERSEDED** — a newer packet or implementation made this packet obsolete.

`READY except for`, `mostly ready`, and `ready after the implementer decides`
are not statuses. They mean DRAFT or BLOCKED.

## Machine-readable packet manifest

[`PACKET_MANIFEST.json`](./PACKET_MANIFEST.json) is the structured projection of
the dispatch surface. It records each packet's status, verified base, exact change
manifest, required live symbols, closed acceptance denominator, and argv-form
focused checks. It does not outrank this standard, the packet, the index, or live
code; disagreement makes the packet non-dispatchable.

`npm run validate:packets` fails closed on manifest/index/packet disagreement,
invalid or duplicate paths, missing required symbols, unbounded acceptance cases,
and READY packets without executable checks. `npm run implementation:capsule --
<ID>` emits a deterministic READY-only coding capsule containing hashes and symbol
evidence. It is the structured component of the sealed dispatch bundle below;
architecture and queue documents remain coordinator inputs, not coding authority.

## Sealed dispatch and handoff lifecycle

The operator order for a READY packet is fixed:

1. `npm run implementation:dispatch -- <ID>` validates the packet and emits one
   bundle with exact packet Markdown and a worktree-local Git-administration seal;
   the seal is handoff evidence, not a project file or permission to edit.
2. A verified-base descendant is admissible only when ancestry succeeds and every
   declared substrate fingerprint remains unchanged. Dispatch pins exact HEAD and
   fingerprints pre-existing Git-visible foreign dirt without
   staging, restoring, or attributing it.
3. The coding model edits only paths in the packet's exact change manifest.
   Authority, HEAD, or foreign-work drift invalidates the session. A declared
   target edit is permitted coding work, but it makes earlier check evidence stale.
4. `npm run check:packet -- <ID>` requires the seal and writes an atomic receipt
   per step with exact argv, status, exit, elapsed time, and state. A heartbeat
   is liveness only and never claims that a command passed.
5. `npm run implementation:resume -- <ID>` reads that same worktree's seal and
   receipt. It reuses completed evidence only when the recorded exact state still
   matches; otherwise it reports stale, incomplete, or invalid work and requires
   the affected command to run again.

Dispatch and resume do not create/delete worktrees, stage, commit, merge, restore,
clean files, infer affected tests, or interpret or waive semantic line budgets.
Those remain operator decisions; only the complete `npm run check` chain is landing authority.

## Dispatch unit

One packet owns one behavior family and one micro-wave. It should normally map
to one reviewable commit, although edit and commit authority remain separate:
the dispatch message must say whether the coding agent may stage or commit.
Absent explicit authority, the agent leaves its changes unstaged and uncommitted.

A packet may include:

1. one primary behavior;
2. one necessary integration path; and
3. one prevention guard that keeps that behavior from regressing.

It may not combine independent lanes, a cleanup sweep, a tuning pass, a soak
program, or opportunistic repairs.

## Default hard scope budget

Unless the packet records a smaller or explicitly approved larger budget before
dispatch, all of these limits bind:

- one behavior family;
- at most one new persisted record family;
- exactly one named writer for any ONE state that changes (PER STATE, not per packet —
  a handoff wave legitimately writes one state while reading another's);
- at most one feature flag;
- at most one user-facing surface;
- at most two direct production consumers;
- at most two new logic-bearing production leaves;
- at most three existing logic-bearing production files modified;
- at most three additional registration-only production files touched;
- at most twelve handwritten files total, including tests and guards;
- at most 400 new or changed effective production lines;
- each new production leaf at most 250 effective lines;
- each shared or hot-file delta at most 15 effective lines;
- at most eight named acceptance cases.

Generated artifacts do not count as handwritten files, but the packet must name
their generator and expected artifact set. Documentation receipts do not count
as production lines.

If the work cannot fit, the agent stops and proposes the smallest split. The
agent may not quietly renegotiate the budget or convert a registration file
into a second logic home.

## Edge-case budget

The acceptance matrix is a closed denominator, not a starting point for an
exhaustive hunt. It contains no more than eight cases:

1. the main reachable behavior;
2. absent or disabled behavior;
3. one counterforce or negative case;
4. one sparse, boundary, or malformed-but-supported case;
5. duplicate or idempotent behavior when state is written;
6. lifecycle round trip when persistence is involved;
7. one real writer-to-reader integration; and
8. one privacy boundary or named historical regression.

Cases that do not apply are omitted, not replaced with speculative cases. A
newly discovered edge case is recorded in the completion receipt without
investigation unless it disproves a packet premise. If it disproves a premise,
the packet stops. If it merely suggests additional product behavior, it belongs
to a later packet.

## Required verified tree contract

Every READY packet names, by current path and symbol:

- the state authority;
- the sole writer;
- direct readers and projections;
- the normalizer or absence rule;
- persistence, reload, regeneration, undo, import, and migration seams when
  applicable;
- receipt and audience-projection homes;
- one or more tests whose shape should be copied;
- forbidden alternative homes and forbidden files.

Navigate by symbol, never by inherited line number. A line number may be a
human hint but cannot be a preflight or coding instruction.

## Exact contracts a packet must settle

Where applicable, the packet defines:

- function inputs, outputs, optionality, and failure result;
- persisted or transient state shape;
- absence versus empty versus null semantics;
- bounds, clamping, rounding, tie-breaking, and stable enumeration order;
- prior-state/input/guard/next-state/receipt transitions;
- same-tick visibility and pipeline ordering;
- merge, replace, deduplicate, and idempotency rules;
- deterministic hash/fork keys and no-draw behavior;
- strict feature-flag spelling and absent/false/lit behavior;
- complete lifecycle behavior;
- closed receipt vocabulary, address chain, and audience projection;
- alignment engagement and the DM edit/proposal story, or an explicit
  engine-only ruling.

Phrases such as `if useful`, `where natural`, `as appropriate`, `support edge
cases`, `make robust`, or `choose the best approach` are forbidden in operative
instructions. The packet author must make the choice or block the packet.

## Change manifest

Every handwritten file appears in the packet before dispatch with:

- `CREATE`, `MODIFY`, `TEST`, `REGISTER`, or `DOC` action;
- exact file path;
- exact symbol or region;
- maximum effective-line delta for production edits; and
- one-sentence coding instruction.

Broad fences such as `src/domain/**`, `src/components/**`, or `tests/**` are not
allowed. A target outside the manifest is out of scope even when the full gate
finds an adjacent defect.

## Mandatory implementation order

Unless a packet states why a step is inapplicable, the agent works in this
order:

0. Run preflight and prove branch, base ancestry, status, clean target files,
   and required symbols.
1. Capture the named pre-wiring golden, dormancy, or baseline evidence.
2. Add the smallest failing focused test for the named behavior.
3. Implement the pure leaf or data contract.
4. Extend the sole writer and required lifecycle seam.
5. Wire only the named consumers in the stated order.
6. Add registrations and the named prevention guard.
7. Run focused verification.
8. Run the packet's wave-end gate and produce the completion receipt.

The agent must not start by changing a golden, baseline, budget, or persisted
shape.

## Gate and attribution law

- Never read a gate through a shell pipe. Use `npm run check:tail` or
  `sh scripts/gate-tail.sh <command...>`.
- Hold the test slot for the complete process with
  `sh scripts/gate-mutex.sh --run -- npx vitest ...`. An observational preflight
  followed by a separate command is not ownership.
- `npm run check` is a 17-step `&&` chain. A red step blacks out every later
  step; the receipt must say which steps actually ran.
- Report both typecheck configurations when relevant:
  `typecheck:ratchet` (`tsconfig.full.json`) and
  `typecheck:domain:strict` (`tsconfig.domain-strict.json`).
- A ratchet being green is evidence only about that ratchet.
- A failing enforcement walker is never banked as ordinary test debt.
- If a full gate is red, compare failure identities with a committed-base run
  or an integrity-counted archive. Do not repair unrelated rows.
- Never raise a baseline, budget, timeout, or ceiling to finish a packet.

Focused commands and expected exit codes belong in each packet. `Run relevant
tests` is not an instruction.

During implementation, `npm run check:packet -- <ID>` is the sealed packet inner
loop and `npm run check:quick` is a non-authoritative changed-file static loop.
`npm run check:diagnose` collects all gate-group failures and timings after a red.
An unsealed packet check is non-dispatchable. None replaces the final `npm run check` landing gate.

## Golden and behavior-shift law

A coding agent never regenerates a golden unless the packet names the exact
golden, the expected semantic shift, the owner/manager authorization, and the
update command. Unexpected motion is always a STOP.

Tuning, lighting, soak-driven band changes, production migration, deployment,
pushes, marketplace activation, paid policy, and legal copy are never implied
by an implementation packet. They require their own explicit authority.

## Mandatory STOP conditions

The agent stops without expanding or repairing when:

- packet status is not READY;
- HEAD is not the verified base or an explicitly accepted descendant;
- a target file is dirty, changed concurrently, or outside the manifest;
- a required symbol is missing or materially different;
- live code refutes state ownership, lifecycle, or ordering;
- another writer, persisted family, flag, graph, migration, or coupling is
  needed;
- any hard scope limit would be exceeded;
- a golden moves unexpectedly;
- entry bytes grow outside the stated posture;
- a ratchet or baseline would need raising;
- a new gate failure lies outside the named acceptance surface;
- an owner decision or authority contradiction remains;
- an additional edge case requires new product behavior.

The STOP report contains the smallest measured contradiction, evidence, and a
proposed packet split. It contains no speculative repair.

## Completion receipt

The coding agent reports:

- verified base SHA and final working-tree or commit state;
- exact changed files and effective-line deltas;
- acceptance cases executed and passed;
- commands, exits, test counts, ratchet results, and bundle results;
- base-versus-wave failure identity diff;
- dormant/golden result;
- generated artifact delta, or `NONE`;
- deviations: `NONE` or a STOP;
- out-of-scope observations without investigation;
- judgment calls: `NONE`.

Any non-none architectural judgment invalidates READY status and returns the
packet to the coordinator.

## Packet maintenance

The coordinator, not the coding agent, changes packet status. Any load-bearing
HEAD or symbol change makes a READY packet STALE until revalidated. When work
lands, the coordinator records the landing SHA, changes the packet to LANDED,
and updates `INDEX.md` before opening the next dependent packet.

Do not pre-author the entire program. Compile the next packet only when its
dependencies are landed and its live substrate is measurable. This is the
primary scope-control rule.
