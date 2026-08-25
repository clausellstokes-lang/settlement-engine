---
name: implementation-packet-dispatch-system
description: "⭐⭐ THE PACKET SYSTEM IS THE ONLY CURRENT DISPATCH SURFACE (landed 2026-08-09): docs/implementation/INDEX.md + PACKET_STANDARD.md on the BUILD branch govern all coding dispatch — only READY rows dispatch, sealed via `npm run implementation:dispatch -- <ID>` / check:packet / implementation:resume; design docs, SOL_QUEUE, queue rows, old briefs are NOT coding assignments; ⚠ commit authority is per-packet ('edits only; manager commits' for TC-3) and a mid-session HEAD move INVALIDATES a sealed session — hold all landings until the packet lane reports"
metadata:
  type: project
  date: 2026-08-09
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-13T00:39:36.801Z
---

Built by the 2026-08-09 sessions (commits d7ec3885 tooling, f1895e60 IA-1 record,
1ca709aa sealed resumable sessions); its 8-file docs reconciliation was left orphaned
and landed by the Fable chair at `4a2e0556` per §3k (backed up, verified, plumbing+CAS).

## How dispatch works now

- `docs/implementation/INDEX.md` (build branch) is CANONICAL: only a **READY** row may be
  dispatched, only after its packet preflight still matches the verified base. Statuses:
  DRAFT/READY/BLOCKED/LANDED/STALE/SUPERSEDED — "READY except for" is not a status.
- Sealed lifecycle: `npm run implementation:dispatch -- <ID>` (validates, emits capsule +
  worktree-local git-administration seal, pins HEAD + foreign-dirt fingerprints) →
  coding agent edits ONLY the packet §7 manifest → `npm run check:packet -- <ID>` (atomic
  receipts per step) → `npm run implementation:resume -- <ID>` (reuses evidence only when
  exact state matches). `npm run validate:packets` fails closed on disagreement.
- ⚠⚠ **"Authority, HEAD, or foreign-work drift invalidates the session"** — landing ANY
  commit while a sealed packet session is editing breaks its seal. Sequence landings
  AFTER the lane reports.
- Hard scope budgets bind by default (≤400 production lines, ≤12 files, ≤8 acceptance
  cases…); exceeding = STOP + split. The coordinator (chair), never the coding agent,
  changes packet status; after landing, re-derive the program, compile at most the next
  dependent. Packets live in the BUILD worktree.

## State at 2026-08-09 (verify with git)

- READY: TC-3 (town cartography wards/parcels; commit authority "edits only; manager
  commits"; owner-eye/soak/promotion gates held — the 2026-08-01 external-implementer
  order supersedes the earlier TC hold, reconciled in the packet + design header),
  SC-1A+B (surveyor chat shell), IA-2 (seals dispatch; infrastructure). LANDED: IA-1
  @ d7ec3885.
- BLOCKED: GR-3b + IN-0c — the chair issued unblock rulings CR-GR3B-1..4 and
  CR-IN0C-1..3 on 2026-08-09 (recorded in the FABLE_VALIDATION_QUEUE survey row); the
  packets still need coordinator RECOMPILE to READY citing those rulings, including the
  GR-3B orientation prerequisite verification (does the negotiated instrument's persisted
  from/to survive round-trip — if yes the orientation fix is derivational in
  `treatyOrientationOf`, no persisted-shape widening).
- "Complete; do not create greenfield packets" census in INDEX names ~30 realized
  programs — treat as code/history, not open work.

Related: [[fable-build-era-takeover]] · [[concurrency-law-ruled]] ·
[[queue-rows-list-specs-not-open-work]].

## ⚠⚠ THE REGISTRATION MANIFEST TEMPLATE HAS A TWO-FILE GAP (measured 2026-08-11)

**ES-5b, ES-5c, ES-5d and ES-6a EACH needed the SAME two files beyond their manifests** to
complete a chair-mandated coupling registration: the **head re-export**
(`couplingRegistry.js`) and the **registry pin's exact list** (`couplingRegistry.test.js`).
**Without both, the new row imports as `undefined`** — the registration silently does
nothing.

**Four packets needing the identical pair is a TEMPLATE GAP, not four oversights.** Any
packet that mints a coupling row must carry those two paths in its own manifest from the
start; a compiler that omits them hands the implementer a guaranteed out-of-manifest edit
and a deviation row to write.

## ⚠⚠ THE CAPSULE SUBSTRATE IS A FOUR-SITE COUPLING, NOT A MIRROR PAIR (MX-1 promotion, 2026-08-12)

Widening what the coding capsule carries (e.g. adding a path family like `retiredSymbols`
to the substrate) touches **FOUR** coupled sites in `scripts/implementation-session.mjs`,
not two: `capsuleAuthority.filePaths` is **DERIVED** from the capsule's own `fileHashes`,
`manifestAuthority.filePaths` is **HAND-BUILT** from the packet, the two are compared
byte-for-byte, and `assertAncestorAndSubstrate` separately asserts every declared substrate
path is present in `fileHashes`. **A two-site "mirror pair" edit ships a dispatch that
throws `capsule omitted declared substrate`.** Trace the whole chain by execution before
editing any of it — an instruction is not a trace. (Found when the MX-1 promotion executed
Lane AR's two-site design; recorded as the packet's deviation 1.)

## ⚠⚠ A SYMBOL-RETIRING PACKET CAN NEVER BE GATE-GREEN (found by Lane AM, 2026-08-12)

`validate:packets`' `requiredSymbols` existence check is **STATUS-BLIND**
(`scripts/implementation-packets.mjs` ~487-493): it demands every listed symbol exist in
its file regardless of packet status. **A packet whose DELIVERABLE is retiring/renaming a
symbol therefore reds the gate the moment the work is done, and the LANDED flip does NOT
clear it.** IN-1B hit this exactly: its manifest row required the old invariant name
`dormancy_is_total_in_both_flag_states` while the packet's own C7 pins that name's
absence. Cure = re-point the manifest row to the successor symbol (chair act,
CR-IN1B-9). **Compilers: when a packet retires a symbol, its manifest row must name the
SUCCESSOR, never the retiree.** Machinery fix (retiredSymbols support or status-aware
check) chartered but not built.

⚠ **AND THE INDEX STATUS-CELL TRAP FIRED FOR THE SECOND TIME:** a lane put prose containing
the word **BLOCKED** inside an INDEX status cell and `validate:packets` parsed it AS the
status. ⚠⚠ The chair misdiagnosed the resulting failure as a *mid-write race* against a
live lane and "confirmed" it by re-running after the lane had quietly fixed it — **a false
diagnosis that the re-run appeared to support.** The recorded law stands and is now
twice-proven: **a status cell carries EXACTLY ONE status token and no prose that contains
another.** When a validator fails against a shared tree, check whether a lane FIXED it
before concluding it was transient.
