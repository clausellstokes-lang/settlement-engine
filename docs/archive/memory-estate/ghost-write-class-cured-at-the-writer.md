---
name: ghost-write-class-cured-at-the-writer
description: applyRelationshipPatch edge-carry cure — leaked channel_inferred as landed, REPAIRED @ 1b7c1eac (membership-after-normalization, CR-WZ5-A); two persisting populations, only the writer was the bug
metadata: 
  node_type: memory
  created: 2026-08-04
  tags: 
    - hazard
    - worldPulse
    - relationships
    - structural-prevention
    - wr8
    - cured
  commits: 
    - 19dd07e2
    - db779d5e
    - e36588c7
  supersedes: "the WZ-4 note that the ghost guard lives at the razing's call site"
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T09:10:45.326Z
---

# The ghost-write class is cured AT THE WRITER — `applyRelationshipPatch` takes the edge

## ⚠️⚠️ REJECTED AS LANDED — the cure leaked a graph-only token (chair correction 2026-08-04)

As committed @ `db779d5e` the cure let the edge speak in the GRAPH's vocabulary:
`ensureRegionalGraph` mints `relationshipType: 'channel_inferred'` for every inferred
channel (region/graph.js:310), `normalizeRelationshipType` passes unknown tokens
through, and post-cure an absent record persisted **`channel_inferred`** where base
persisted `neutral` — same-seed worlds MOVED (3/6 cells, 53 fields), a persisted shape
changed, and the raw token rendered into DM-facing headlines. THE PROMISE + LEGIBILITY
LAW violations; the lane's own 3-settlement fixture never minted an inferred channel,
so its byte-identity claim was VACUOUS for the moved path.

**CR-WZ5-A (chair, vetoable): vocabulary closure at the writer boundary** — the edge
may speak only in the relationship plane's own vocabulary:
`const edgeType = normalizeRelationshipType(edge?.relationshipType);`
`const typedEdge = edge && RELATIONSHIP_DEFAULTS[edgeType] ? edge : {};`
Aliasing `channel_inferred → neutral` inside `normalizeRelationshipType` is REJECTED —
that imports a graph-plane token into the relationship plane's alias table.
**CR-WZ5-B: the strict fix lands at the CALLERS** (type their `edge?: unknown` params
structurally), never by widening the writer's typed 4th-param contract.

## ✅ REPAIRED @ 1b7c1eac (WZ-5r, verified ACCEPT 2026-08-04)

The landed guard normalizes FIRST, then tests MEMBERSHIP:
`edgeType = normalizeRelationshipType(String(edge?.relationshipType || edge?.type || edge?.relation || ''))`;
`typedEdge = edge && RELATIONSHIP_DEFAULTS[edgeType] ? edge : {}`. Order matters —
membership BEFORE normalization kills all 8 aliases (verified both ways).
J-WZ5R-1: three spellings, not one — `normalizeRelationshipEdge` (the consumer)
resolves all three; guarding a different field than the guarded code reads is the
recorded vacuity class. Strict superset, byte-identity unaffected.

⚠️⚠️ **TWO POPULATIONS PERSIST relationshipStates — ONLY ONE WAS THE BUG.**
The WRITER (applyRelationshipPatch) must stay in-vocabulary. The MATERIALIZER
(ensureAllRelationshipStates) legitimately carries `channel_inferred` for
pre-existing inferred edges — base-identical, pinned at tradeWar.test.js:484.
Do NOT "fix" the materializer; that moves same-seed hashes (J-WZ5R-2). Its
DM-prose exposure is a separate OWNER-GATED item (see the WR-8 file's F1).

⚠️⚠️ **A fixture that hand-authors its edges NEVER MINTS.** Minting needs ≥4
settlements AND a channel running against an authored edge's direction or
across an unconnected pair — `ensureRegionalGraph` keys its lookup
DIRECTIONALLY on `from->to`. Any byte-identity claim over the relationship
plane must include an EXECUTED mint-and-materialize count (mint tick + key
names) or it is vacuous for the only path that can move.

⚠️ **Cross-harness combined hashes are unverifiable BY CONSTRUCTION** — an
acceptance constant hashed over one harness's six cells can never be matched by
an independently built harness. Acceptance rows quote PER-CELL base-to-HEAD
equality + the executed non-vacuity ledger instead (F4).

⚠️ Temp worktrees under .claude/worktrees have NO node_modules — symlink the
parent's in for build controls, and `rm` the symlink before `git worktree
remove` (an `ln -s` into an existing dir NESTS instead of replacing).

## What it was

`applyRelationshipPatch` (src/domain/worldPulse/relationshipEvolution.js) rebuilt its
baseline with `ensureRelationshipState({}, existing)` — an **EMPTY edge**. For a
`relationshipKey` whose state record had never been written, the type resolved to
`neutral` and every axis to NEUTRAL's defaults, so the write silently **RE-TYPED an
authored hostile or allied edge**. It works perfectly at runtime; it just quietly
lies about one relationship in a corner of one save.

## Why the measurement mattered more than the fix

WZ-4 found it at ONE call site (the razing) and cured it there by carrying five axes
by hand. WZ-5 **probed the writer** instead of assuming the shape: instrument
`applyRelationshipPatch` to log when `worldState.relationshipStates[key] == null`,
run the whole `tests/domain/` suite plus the same-seed harness.

**Result: 36 absent-record writes across SEVEN sites** — the brief had named five.
The three the brief missed were the important ones, above all
`applyWorldPulse.js:767` (`applyWorldPulseOutcomes`), the **mainline** relationship
applier, reached through the real `simulateCampaignWorldPulse`. It was never a
razing-shaped bug.

⚠️ Do this before every "sweep the siblings" brief: the reported instances are a
sample, not the denominator. The probe cost one instrumented line and one suite run.

## The cure

`applyRelationshipPatch(worldState, outcome, now, edge)` — a **fourth positional
argument**, not a field on the outcome (outcomes are persisted into pulse history;
a graph edge has no business riding into a save record).

**It is a no-op for every materialized record, by construction.**
`ensureRelationshipState` resolves the type as `existing.relationshipType ||
edge.relationshipType` and every axis as `existing.x ?? defaults.x`, so an existing
record wins at every field — and inside a pulse that is *every* graph edge, because
`ensureAllRelationshipStates` materializes them all at pulseKernel.js:306. The edge
speaks only where the record is silent. **Same-seed hash byte-identical, twice.**

## How to apply

- **Every new `applyRelationshipPatch` call site MUST pass the edge.**
  `tests/lint/relationshipPatchEdgeCarry.walker.test.js` censuses this; its exemption
  registry is EMPTY and a stale exemption also reds.
- The shared resolver is **`edgeBetween(edges, a, b)`** in `relationshipState.js`.
  FOUR modules had each hand-rolled a private `edgeKeyBetween` over that walk and every
  one kept the key and **discarded the edge** — that discard is what made the class
  possible. Two forks were deleted; two delegate. Do not write a fifth.
- Nearly every caller already held the edge and was throwing it away
  (`applyWorldPulse` resolves `beforeEdge` on the line above;
  `warCoalitionSettlement` proved the pair was in the graph and kept only the boolean).
  Look for that shape before adding a lookup.

## Traps this lane hit (all fixed, all cheap to re-hit)

- ⚠️⚠️ **A source-scan walker that counts call arguments must skip COMMENTS and handle
  NESTED TEMPLATE LITERALS.** Both defects produced the *same* false positive on the
  razing's call: its `id` is a template containing a template inside `${...}`, and its
  argument list carries prose that quotes identifiers in backticks. Same
  comment-blindness class as the prose-counting detectors (task #104).
- ⚠️ **`param = null` types the parameter as `null` under strict.** Every caller passing
  a real value then errors. Annotate structurally
  (`{ from?: unknown, to?: unknown, id?: unknown }`), never `{any}` — the any-cast
  ratchet catches `{any}` and it is right to.
- ⚠️ **A JSDoc `@param {any}` that merely restates an inline `/** @type {any} *​/` cast
  is a NEW any-hole for zero information.** Four of my ten new holes were exactly that.
