# Implementation packet index

- **Status:** CANONICAL
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`
- **Measured branch/SHA:** `claude/composite-r4` at
  `e1e9fd6a62b851dcce92a2fb4f84d9d76d1b238d`
- **Measured:** 2026-08-11 — re-derived at the TC-5b promotion. ⚠ The header had carried
  `7699e367` while the body listed landings through `ES-6a`; TC-5A.md's base note recorded
  that staleness and asked the coordinator to re-derive it at the next flip. Done here.
- **Packet law:** [`PACKET_STANDARD.md`](./PACKET_STANDARD.md)

## Dispatch rule

Only a row marked **READY** may be dispatched, and only after its packet's
preflight still matches the verified base. A design document, queue row, commit
subject, stale progress block, or old brief is not a coding assignment.

This index deliberately exposes only the next bounded product slices plus any
explicitly owner-authorized infrastructure packet. It is not a transcription of
every designed wave. TC-3a and SC-1 are independent lanes; TC-3b depends on TC-3a
and is not a parallel lane; the blocked
foreign-policy rows do not hold them. When a packet lands, the coordinator
re-derives that lane and decides whether to compile its immediate dependent.

## Current packet set

| Dispatch | Packet | Status | Why this is the boundary | Explicitly excluded |
|---:|---|---|---|---|
| LANDED-1 | [`TC-3a`](./packets/town-cartography/TC-3A.md) | **LANDED** at `5066c34b`; do not redispatch | Adds named streets and wards at schema v2 and moves the naming pools off the bounded chunk by injection | parcels, carving, institution binding, byte band, TC-4..8, buildings, promotion, 3D defaulting, visual soak |
| LANDED-6 | [`TC-3b`](./packets/town-cartography/TC-3B.md) | **LANDED** at `a45c969d`; do not redispatch | Adds bounded contained parcels and the pure institution-to-parcel binding receipt for TC-4 | naming, schema changes, TC-4..8, buildings, promotion, 3D defaulting, visual soak |
| LANDED-2 | [`SC-1A+B`](./packets/surveyor-chat/SC-1.md) | **LANDED** at `455a29b5`; do not redispatch | Ephemeral text-intent shell and typed-op card extraction landed; SC-2+ remain excluded | direct chat proposals, audience/provenance decisions, uploads, SC-2/3, migrations, pricing/legal |
| LANDED-3 | [`GR-3B-ORIENT`](./packets/foreign-policy/GR-3B-ORIENT.md) | **LANDED** at `d56d944c`; do not redispatch | Adds the per-term obligation reader (CR-GR3B-3-R1) that GR-3b and IN-0c's transfer semantics consume | GR-3b producers, IN-0c, any persisted-shape change, treatyOrientationOf edits |
| LANDED-5 | [`GR-3b`](./packets/foreign-policy/GR-3B.md) | **LANDED** at `40afbdd6`; do not redispatch | Finishes the producer half of GR-3: the frozen rung ladders, selection function, and the composable-pair exception | GR-4+, later grammar, tuning, lighting, orientation edits |
| LANDED-4 | [`IN-0c`](./packets/foreign-policy/IN-0C.md) | **LANDED** at `29e2dc3c`; do not redispatch | Finishes the sole missing IN-0 slice: next-tick derived signing credit through the provenTrue seam | IN-1+, broader disclosure redesign, pulseKernel edits, any new persisted family |
| LANDED-7 | [`TC-4`](./packets/town-cartography/TC-4.md) | **LANDED** at `5a6f76fe`; do not redispatch | Fills the reserved v2 buildings layer: A-8 multiplicity, footprint packing inside parcels, dwelling fill, and dress — dark path byte-identical | any schema/contract change, per-class cohesion, TC-5..8, painter/labels, persistence, lit-surface tuning, soak |
| LANDED-8 | [`ES-5b`](./packets/foreign-policy/ES-5B.md) | **LANDED** at `6c0238ad`; do not redispatch | Espionage absence discounts a faction's council weight and contest power — the bench grain, with its disclosed one-time bloc-math shift | the career grain (ES-5c), ES-6/7, chooser edits, a second bloc-weight spelling, tuning of ABSENT_W, any receipt or audience surface |
| LANDED-9 | [`ES-5c`](./packets/foreign-policy/ES-5C.md) | **LANDED** at `c0447b8f`; do not redispatch | The espionage career register: absence discounts a defender's ladder standing, plus the vacuous ladder-writer guard it repairs | arm B (split to ES-5d), ES-6/7, contest-margin edits, `challengeScore`, tuning DEFENSE_WHEN_ABSENT, any ladder state write |
| LANDED-10 | [`ES-5d`](./packets/foreign-policy/ES-5D.md) | **LANDED** at `954592c0`; do not redispatch. ⚠ Deviation **D7**: the handoff is SAME-TICK, not one-tick-lagged — measured at `pulseKernel.js`, where the espionage pass and the ladder chain run unconditionally in that order, in one function, on one `worldState.tick`, so a `tick - 1` window would be silently dead. The sovereignty lighting census was re-derived WHOLE and re-recorded to `2392/365/2027/19659/5552 (19656 at that landing, +3 folded at `58436804`)`, repairing two pre-existing foreign deltas it had been red on | The career CREDIT: a graded mission deposits into the ladder's maintenance road via a one-tick ledger | architecture α, a persisted consume-once marker, ladder-dark writes, debits, tuning MISSION_CREDIT_MET, ES-6/7 |
| LANDED-11 | [`TC-5a`](./packets/town-cartography/TC-5A.md) | **LANDED** at `41b39220`; do not redispatch | The cartography painter's headless half: a pure draw-list plus palette ROLES, no colour, no mount | colour binding + the sub-tab (TC-5b), PNG goldens (TC-5c), skins (TC-5d), AI controls, the lynch-rubric gate (its own synthesis slice) |
| LANDED-12 | [`ES-6a`](./packets/foreign-policy/ES-6A.md) | **LANDED** at `53d538b4`; do not redispatch | The double agent's leak: a compromised operative's mission reaches the enemy court while succeeding silently. ⚠ **ES-6 was refused as chartered and split three ways** — ES-6a (this) is the leak; ES-6b (vetting quality) waits on a DISPATCHER wave nobody has chartered, because its only consumer has zero production callers; ES-6c (the retroactive Herald clause) folds into ES-7. ⛔⛔ **CORRECTED 2026-08-11 per chair order, session `c42c8924` — THE ESPIONAGE TAIL IS PARKED BY OWNER GATE, and the two forward pointers in this cell are HISTORY, not dispatch.** ES-7 was REFUSED on measurement: five of the six espionage Herald kinds have no reachable producer, because the DISPATCHER that would fire them was never chartered. The dispatcher slice ES-D was then REFUSED too — `envoyErrandRecords.js:590` forces a covert row's endpoints to the peace offer's own, so a court can only spy on the court it is suing, and no autonomous per-tick stage can mint a covert mission. The one compilable slice, **ES-Da** (covert cargo riding an already-accepted peace envoy), is OWNER-GATED at `docs/OWNER_DECISION_QUEUE.md` §16 — **which lives on the LEDGER branch `review-fixes-2026-07-08` and is NOT present on this build branch**. ES-6b is not released by any of this: its vetting band still has zero producers. ES-6c re-files OUT of espionage entirely, as a corruption-volume same-tick wave. **A build-branch-only reader must not read "folds into ES-7" or "rides the dispatcher" as live work — there is no dispatchable espionage row at this HEAD.** ⛔ **The sovereignty lighting census is NOT folded by this packet**: TC-5a holds that file's reservation as first claimant, so ES-6a's re-derivation is a CHAIR POST-LANDING STEP — the implementer reports all five figures and its isolated delta and never touches the walker. ⚠ This cell is prose, and the packet validator reads the STATUS column literally: keep status words out of it | vetting quality (ES-6b, rides the dispatcher), the retroactive Herald clause (folds into ES-7), any new belief key, rumor-reach predicates, the lighting census file |
| LANDED-15 | [`TC-5b-i`](./packets/town-cartography/TC-5B-I.md) | **LANDED** at `9183d52c`; do not redispatch | The producer half of the ruled TC-5b split: one lazily-imported main-thread transport plus one lifecycle hook that compile a settlement's cartography block headlessly and answer presence — no mount, no render, zero production importers, expected bundle delta ZERO. ✅ O-5 is RULED (CR-TC5BI-6): the lighting-census walker is the packet's FIFTH reserved path and the implementer re-records the census in-change per the serialization law, subject to the foreign-title STOP. ⚠ This cell is prose, and the packet validator reads the STATUS column literally: keep status words out of it | the painter component, the sub-tab seat, the shell mount, the ROLE→colour binding and the A-4 notice (all TC-5b-ii), PNG goldens (TC-5c), skins (TC-5d), any worker-protocol or cache change, any persisted change, the TC-5a leaves, `mapTabShellLazy.test.js` and the rest of TC-5b-ii's nine reserved paths |
| BLOCKED-14 | [`TC-5b-ii`](./packets/town-cartography/TC-5B-II.md) | **BLOCKED** | The painter's mount: the `cartography` sub-tab seat, the token→colour binding, the SVG render and the A-4 degraded state — the first production importer of TC-5a's leaf and the only user-facing surface of the TC-5 lane. It consumes TC-5b-i's seam and cannot dispatch until that seam is in history. ⚠ Its own open item is the A-4 notice copy, deferred by CR-TC5B-4 to this packet's promotion; the mount/seat question is settled and is NOT owner-gated. ⚠ This cell is prose, and the packet validator reads the STATUS column literally: keep status words out of it | the manifest seam (TC-5b-i, whose four reserved paths are forbidden here), PNG goldens (TC-5c), skins (TC-5d), AI editing controls, the lynch-rubric gate (TC-2r), `TOWN_MAP_VIEW_IDS` / `PRESENTATION_SUB_TAB_IDS` / `displayPrefsSlice.js`, `townScene3dLazy.test.js`, any colour literal or entitlement-bearing import |

## Authorized implementation infrastructure

| Dispatch | Packet | Status | Why this is bounded | Explicitly excluded |
|---:|---|---|---|---|
| LANDED-I1 | [`IA-1`](./packets/infrastructure/IA-1.md) | **LANDED** at `d7ec3885dbcd7e09ff3bcd28d6f55a51bb1ae78b`; do not redispatch | Automates packet enforcement and feedback topology without changing simulation behavior | event bus, pulse reorder, persistence, automatic worktree deletion, product-scope changes |
| STALE-I2 | [`IA-2`](./packets/infrastructure/IA-2.md) | **STALE** — substrate drifted since `f1895e60` (measured by its own dispatcher); revalidation folds the IA-3 docket | Seals one packet dispatch, proves diff scope, and checkpoints resumable evidence | test sharding, affected-test inference, auto worktree/commit/merge/cleanup, product code |

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
- **Town Cartography:** TC-0 through TC-2 are landed, and TC-3a plus TC-3b have
  now landed in order (TC-3 itself stays SUPERSEDED; its preserved implementation
  was their raw material). TC-4 has LANDED at `5a6f76fe` — the buildings layer is
  filled at schema v2. TC-5 was refused as one packet and split four ways; TC-5a has
  LANDED at `41b39220`, and TC-5b was itself refused and split producer-first at
  CR-TC5B-1 into TC-5b-i (the manifest seam) and TC-5b-ii (the painter mount). TC-5c,
  TC-5d and TC-6 through TC-8 remain designed but intentionally uncompiled.
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

- **FP:** ES-5b LANDED at `6c0238ad` (its blocker was three claims; one dissolved, the other two were closed by CR-ES5B-1..7). ES-5c was promoted READY at `ca94438d` (its seven open items closed by CR-ES5C-1..6 plus two chair-authored values) and is BUILT: the promotion-risk register, composed at `npcLadderChallenge.js#defenseScore` rather than the `npcLadderContest.js` the design names. ES-5d (the career CREDIT) is compiled just-in-time after ES-5c lands and must BUILD four things — a persisted carrier, an identity bridge, a ladder-owned `stock` writer, and a coupling row. HB and EP lack a
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
