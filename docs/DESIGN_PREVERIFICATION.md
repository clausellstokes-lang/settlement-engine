# DESIGN — SUBSTRATE PRE-VERIFICATION (SPV) AND TRAIN-TOPOLOGY SIMULATION (TTS)

- **Status:** ARCHITECTED 2026-08-15 (Fable chair) under OWNER_DECISION_QUEUE
  §45 and the owner's implement order. Lands on the ledger branch (the build
  branch is under the hb-2b train); **fold obligation:** to the build branch,
  CLAIM_RE-checked, with the infra-3 train.
- **What each measure is:** SPV moves the verification that today happens at
  execution time (six HB-era refutations, three stop-cycles) to a wholesale
  read-only sweep before a volume's family opens. TTS converts the R35 class
  (train plans asserting validator behavior) into an executed compile step.
  Both are rigor relocations; neither weakens any gate, census, or stop.

## §1 · SPV — THE SUBSTRATE PRE-VERIFICATION PROTOCOL

**1.1 Scope of a substrate claim.** Any factual assertion a volume makes about
the live tree: module/export existence and names, cited line sites, constant
names and values, counts and denominators, flag/manifest states, walker and
census states, byte/size figures, "X landed/exists/is absent" statements.
Design LAW is out of scope — a conflict in design law remains STOP-and-report
to the chair, never a sweep verdict (the GR compile's own §-rule).

**1.2 Method law** (each rule earned by a recorded incident):
- Claims are extracted by ENUMERATION over the volume's text, not sampled;
  the sweep reports its claim denominator.
- Each claim grades **MEASURED-TRUE** (executed evidence, quoted),
  **REFUTED** (the corrected fact, with evidence), or
  **UNVERIFIABLE-AT-BASE** (what would make it verifiable). No fourth grade.
- Landed-state claims need module+manifest evidence, never commit subjects or
  module-name presence (the ES-4/EP false-positive law).
- Reader/consumer claims are grounded by receiver, through `codeOnly()` where
  scanning source (both directions of the §40 string/comment class).
- Any delete/retire instruction in the volume gets its §38.4 consumer census
  PRE-EXECUTED here, so compiles inherit the verdict.
- The sweep NEVER edits the volume. Corrections live in the annex; volume-text
  cleanup remains its own micro-act class (the CR-HB1′-VOL pattern), because
  a `docs/**.md` edit is a naked-claim gate risk.

**1.3 The annex artifact.** One file per volume,
`docs/implementation/preverification/<VOL>-SUBSTRATE.md` (build branch, landed
by the family's first train; until then the sweep's scratchpad deliverable is
canonical and the hand note points at it). Header carries: the sweep sha, the
claim denominator, the grade tally, and the CONSUMPTION LAW mirrored from the
base-state capsule: *citable as executed by a compiler whose verified base is
the sweep sha or its docs-only descendant; any claim whose subject files moved
since the sweep is re-verified by the consumer; a compiler citing a stale
annex row inherits a STOP, not an excuse.*

**1.4 Staleness.** A sweep is stamped at a sha. It VOIDS for a family the
moment a wave of that family lands (the family's own landings are exactly the
moves that rot it); cross-family landings void only the rows whose subject
files they touched (derivable from the landing's path list). The re-sweep is
incremental: re-verify voided rows, inherit the rest.

**1.5 Staffing and cost.** One read-only lane per volume, lawful beside a
running executor (commits nothing, takes no slot). Expected cost roughly one
lane-hour per volume; expected saving, from the HB measurement, five-plus
stop-cycles per large volume.

**1.6 First applications, in order:** WC (17 waves, before WC-0's compile —
dispatched with this volume's landing), then WF, then EP (whose §7a parked
rows and single-member law the sweep must respect), then the GR/TR/IN tails,
then WY/POP/INT as their turns approach. HB continues on its accumulated
per-wave refutation record (R19–R35) rather than a fresh sweep — its rot is
already better mapped than a sweep would produce.

## §2 · TTS — THE TRAIN-TOPOLOGY SIMULATION

**2.1 The tool.** `scripts/validate-train-topology.mjs` (build branch, lands
with infra-3): given a train plan's declared sequence of per-packet statuses
at each commit boundary, it builds the synthetic manifest for each state and
runs THE REAL VALIDATOR against it — importing `implementation-packets.mjs`'s
own validation entry, never re-implementing its rules (one canonical truth;
a re-implementation would rot exactly like the volumes). Output: the observed
validator verdict per state, quoted. Seed implementation: Lane TE10's probes,
preserved verbatim as `docs/preverification-tools/laneTE10-probe2.mjs.txt`
and `laneTE10-probe3.mjs.txt` beside this volume (the `.txt` suffix per the
archive convention — workflow scripts red the eslint hook as `.js`).

**2.2 The mandatory compile step.** Every train plan's validator-sequence
table is EXECUTED at compile, outputs quoted in the plan — the compile-stage
analog of the B13 executed-figures law. A plan asserting an unexecuted
validator sequence is DEFECTIVE at promotion (a chair STOP). The preambles
gain one line saying exactly that (rides infra-3's docs member).

**2.3 The rule inventory the simulator must exercise** (the banked TE10/TE7
findings, so they are never re-discovered): reservation at EVERY non-terminal
status including DRAFT (no demotion escape); duplicate change paths across
any two non-terminal packets; CREATE rows existence-checked only at LANDED;
`requiredSymbols` existence-checked at EVERY status (which is what makes a
retirement pin unusable on a READY packet); the READY completeness
requirements (nonempty manifest/symbols/cases/checks; the 8-case cap).

**2.4 Refusal.** The simulator never patches, widens, or wraps the validator.
If a lawful train shape cannot pass (the R35 discovery), the cure is a
topology ruling (the Road-A split-promotion precedent), never a validator
edit smuggled as tooling.

## §3 · Sequencing and implementation state

| Piece | Where | When |
|---|---|---|
| This volume + preserved probes | ledger branch | NOW (this landing) |
| WC substrate sweep (SPV first execution) | read-only lane | NOW (dispatched with this landing) |
| infra-3: the TTS script + PACKET_STANDARD/preamble amendments + this volume's fold + the CR-HB0B-BANDGAP regex fix + the JSDoc-vacuity cure | build branch | first train after hb-2b lands |
| WC-0 compile citing the WC annex | compile lane | after the sweep + infra-3 |

## §4 · What this volume deliberately does not change

No gate step, census law, stop semantics, worktree law, or chair-signature
requirement moves. SPV and TTS relocate verification earlier; every
verification they relocate still also binds at its original site (an executor
still stops on a refuted premise — SPV just makes that rare).
