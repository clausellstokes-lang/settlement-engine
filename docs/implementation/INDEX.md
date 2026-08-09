# Implementation packet index

- **Status:** CANONICAL
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`
- **Measured branch/SHA:** `claude/composite-r4` at
  `f1895e6004eb512a5c7b4c9b4caaf79604bccea6`
- **Measured:** 2026-08-09
- **Packet law:** [`PACKET_STANDARD.md`](./PACKET_STANDARD.md)

## Dispatch rule

Only a row marked **READY** may be dispatched, and only after its packet's
preflight still matches the verified base. A design document, queue row, commit
subject, stale progress block, or old brief is not a coding assignment.

This index deliberately exposes only the next bounded product slices plus any
explicitly owner-authorized infrastructure packet. It is not a transcription of
every designed wave. TC-3 and SC-1 are independent lanes; the blocked
foreign-policy rows do not hold them. When a packet lands, the coordinator
re-derives that lane and decides whether to compile its immediate dependent.

## Current packet set

| Dispatch | Packet | Status | Why this is the boundary | Explicitly excluded |
|---:|---|---|---|---|
| READY-1 | [`TC-3`](./packets/town-cartography/TC-3.md) | **READY** at the verified base | Adds named wards, parcels, and a bounded binding seam over landed TC-0..2 | TC-4..8, buildings, promotion, 3D defaulting, visual soak |
| READY-2 | [`SC-1A+B`](./packets/surveyor-chat/SC-1.md) | **READY** at the verified base | Ephemeral text-intent shell and existing typed-op card extraction only | direct chat proposals, audience/provenance decisions, uploads, SC-2/3, migrations, pricing/legal |
| BLOCKED | [`GR-3b`](./packets/foreign-policy/GR-3B.md) | **BLOCKED** — producer eligibility and ladder selection are unruled | Would finish the already-split producer half of GR-3 | GR-4+, later grammar, tuning, lighting |
| BLOCKED | [`IN-0c`](./packets/foreign-policy/IN-0C.md) | **BLOCKED** — same-tick signing credit conflicts with pipeline order | Would finish the sole missing IN-0 slice | IN-1+, broader disclosure redesign |

## Authorized implementation infrastructure

| Dispatch | Packet | Status | Why this is bounded | Explicitly excluded |
|---:|---|---|---|---|
| LANDED-I1 | [`IA-1`](./packets/infrastructure/IA-1.md) | **LANDED** at `d7ec3885dbcd7e09ff3bcd28d6f55a51bb1ae78b`; do not redispatch | Automates packet enforcement and feedback topology without changing simulation behavior | event bus, pulse reorder, persistence, automatic worktree deletion, product-scope changes |
| READY-I2 | [`IA-2`](./packets/infrastructure/IA-2.md) | **READY** at `f1895e6004eb512a5c7b4c9b4caaf79604bccea6` | Seals one packet dispatch, proves diff scope, and checkpoints resumable evidence | test sharding, affected-test inference, auto worktree/commit/merge/cleanup, product code |

The status in this table and the status inside the packet must agree. A mismatch
means the less permissive status wins.

### Minimum decisions needed to unblock

- **GR-3b:** provide the exact trigger candidate sets, crossing-score selection
  function/cardinality, negotiated obligor/obligee and transfer direction, and
  the closed collision behavior for the composable security pair. Neither code
  nor binding design law settles those four choices.
- **IN-0c:** rule the exact pulse transport/tick semantics for the signing
  credit, the closed event-kind/audience set, and compliance-state fidelity
  values. Information statecraft currently advances before treaty minting, so
  an implementer may not silently make the credit next-tick or add a deposit.

## Reserved foreign work

At the measured SHA the shared build tree had unrelated changes in:

- `scripts/lib/reader-shape-scan.mjs`
- `tests/lint/readerShapeResolver.test.js`

No packet in this set may touch, stage, restore, or attribute those files. The
list is a snapshot, not permission to ignore new dirt: every dispatch re-runs
`git status` and reserves all foreign changes.

## Reconciled program state

The census below exists to prevent duplicate greenfield work. Git history and
live symbols were checked at the measured SHA.

### Partial programs

- **Foreign-policy corpus:** SP-A through SP-F, CW-0w, GR-0 through GR-2 plus
  GR-3a, IN-0a/0b/0d, TR-1, TR-9c, and ES-0 through ES-4 plus ES-5a are landed.
  GR-3b and IN-0c are the only partial-slice closers reconciled now, and both
  are blocked on the explicit decisions above.
- **Town Cartography:** TC-0 through TC-2 are landed. TC-3 is next. TC-4
  through TC-8 remain designed but intentionally uncompiled until TC-3 lands.
- **Surveyor Chat:** the old Workshop presentation is superseded. SC-1 is the
  next bounded surface packet; later ingestion and migration stages are excluded.

### Complete; do not create greenfield packets

The following designs are already materially implemented and must be treated as
code/history, not open work:

- War WR-1 through WR-10;
- Realm Directives H, I, J, and K;
- Demographic P1 through P5;
- Generosity, Supply-Web Warfare, Peace, Numeric Prices, Convergence,
  Corruption Web, Settlement Politics, Resource Dynamics, Settlement Lifecycle,
  Navy, Momentum, Upswing, Pacing Governor, NPC Lifecycle, NPC Consequences,
  Information Statecraft, Information Brokerages, Route Lifecycle, Magic
  Economy, The Ladder, Track K, Analytics V2, Event Composer V2, Guidance,
  Chronicle Legibility, Map Doors, the current Settlement Map V1/V2, and Hook
  Non-Redundancy HK-1 through HK-3.

A missing progress note in one of those design files does not reopen it.

### Designed but not dispatchable now

- **FP:** ES-5b waits on insertion/order reconciliation. HB and EP lack a
  sealed close/attestation. WC's old gate wording must be reconciled with the
  later owner grant. WY, WF, POP, INT, late CW, and later TR/GR/IN waves remain
  dependency-ordered behind nearer work.
- **War Convenience/Tribute/Statecraft:** CV/TB/XW remain at the Lane-A tail.
- **Realm Magic leak L2/L3:** a recorded blocker/design decision, not a coding
  detail for an implementer to invent.
- **Parked/evidence-gated:** tuning, lighting, soaks, pushes, marketplace,
  gallery showcase activation, deep scarred-map promotion, AI Intent Phase B,
  and custom-content promotion evidence.

No packet should be generated for these rows until its named blocker clears.

## Source roles

| Source | Safe role | Unsafe use |
|---|---|---|
| Live code and git log | Existence, landing, symbol, and behavior evidence | None; this is the existence authority |
| `CONTRIBUTING.md`, `ARCHITECTURE.md`, canonical contracts | Invariants and operating law | Open-work status |
| `DESIGN_*.md` | Product intent and durable architecture after reconciliation | Direct dispatch or proof that work is open |
| `FABLE_VALIDATION_QUEUE.md` | Later rulings and landing receipts | Sole proof that a symbol still has the recorded shape |
| `SOL_QUEUE.md` | Historical dependency/order evidence | Current build state |
| `docs/briefs/` | Historical implementation rationale | Current commands, branch, budgets, or dispatch |
| Ledger-only `START_HERE`, `RESUME_STATE`, `THE_REMAINING_ARCHITECTURE` | Recovery and decision provenance | Coding instructions |

## Reconciled legacy traps

- `DESIGN_FP_ARCHITECTURE.md`'s former `d9c7cae4` progress block omitted later
  waves. It is restamped in this documentation change as dated corroboration;
  this index still controls dispatch.
- `SOL_QUEUE.md` retains old F9 and CR-WC-9 gate strings inside historical
  rows. Its new top note records the later blanket grant and points here; do
  not dispatch from the embedded strings.
- `docs/README.md`'s stale design-file count was removed rather than replacing
  it with another count that would drift.
- The ledger root and the build worktree are different trees. Packets live in
  the build worktree.

## Packet opening protocol

Before changing a DRAFT/BLOCKED row to READY, the coordinator must:

1. re-run the open-work census against live git;
2. resolve all owner-ruling and design contradictions;
3. verify every manifest path and symbol;
4. confirm target files are clean and collision-free;
5. state baseline and golden posture;
6. close every operative choice in the packet;
7. keep the acceptance denominator at eight or fewer cases; and
8. update this index and the packet in the same documentation change.

## After a packet lands

1. Record the landing SHA and exact gate evidence in the packet.
2. Change the packet and this index to LANDED.
3. Re-derive the program rather than promoting the next historical queue row
   automatically.
4. Compile at most the next immediate dependent packet.

This just-in-time rule prevents the instruction project from becoming a second,
stale implementation backlog.
