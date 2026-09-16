---
name: gr3b-in0c-chair-rulings
description: "⭐⭐ CHAIR RULINGS CR-GR3B-1..4 + CR-IN0C-1..3 (Fable, 2026-08-09, vetoable; LANDED in F-SURVEY-1 @ 2340497d; packet recompile still owed, orientation prerequisite FIRST): GR-3b rung ladders per trigger with explicit frozen bounds; proposer-as-obligor orientation via a DERIVATIONAL prerequisite in treatyOrientationOf (verify persisted from/to first); composable exception = exactly {non_aggression, mutual_defense}; IN-0c signing credit = NEXT-TICK DERIVED from treaty signedTick===T-1 through the existing provenTrue seam (no stage move, no deposit, no new persisted family); disclosure_expired REFUSED; strained fidelity = RELAY_KEEP by import"
metadata:
  type: project
  date: 2026-08-09
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T02:07:01.312Z
---

Issued under the standing delegation + the 2026-08-05 blanket queue grant; each vetoable.
The packets' "owner ruling" phrasing is answered by chair authority per the delegation;
recorded here until the FABLE_VALIDATION_QUEUE survey row lands them. Packets still need
coordinator RECOMPILE to READY citing these.

## CR-GR3B-1 — candidate sets (rung ladders, explicit frozen data, non-cumulative)

`PACT_DRAFT_LENS` becomes per-trigger rung ladders; each rung `{ min, terms }`, inclusive
lower bound on clamped `score01`, select the HIGHEST rung whose `min <= s`; ladders start
at 0 so a crossed trigger always drafts (preserves current always-draft behavior):

- `faith_communion`: 0 → [shared_rite] · 0.45 → [pilgrimage_right, tolerance_guarantee] ·
  0.7 → [missionary_access] · 0.9 → [temple_restitution]
- `migration_pressure`: 0 → [migration_right] · 0.6 → [labor_compact] ·
  0.85 → [settlement_provision]
- `shared_threat`: 0 → [non_aggression] · 0.75 → [non_aggression, mutual_defense] (the
  frozen composable pair, both in one sheet at the top rung)
- `trade_demand`: 0 → [resource_share] (unchanged, confirmed)
- `renewal`: [] (empty until GR-5, which owns renewal terms — confirmed)

Bounds are AUTHORED literals, not derived from catalog weights (the packet forbids
weight-as-threshold). The drafted set feeds `orderTermsByAsk` (GR-3a's shipped, deliberately
unconsumed ladder primitive — this is its intended consumer).

## CR-GR3B-2 — selection function exactness

Input: the crossing's own `score01`. `s = clamp(Number(score01), 0, 1)`; non-finite → 0.
Boundaries inclusive at `min`; ties impossible (distinct literals); output cardinality =
exactly the rung's term list; beneficiary expansion AFTER rung selection (per-term at mint).

## CR-GR3B-3 — negotiated orientation (the two transfer terms)

For beneficiary-bearing terms from a peacetime crossing: OBLIGOR = the PROPOSING party
(`proposal.from`), OBLIGEE = counterparty. Transfer payer = obligor, payee = obligee;
compliance capacity subject = obligor; monitor = obligee; `defaultedBy` = obligor.
Mechanism: a SEPARATE ORIENTATION PREREQUISITE micro-wave extending `treatyOrientationOf`
to resolve negotiated instruments DERIVATIONALLY from the instrument's persisted parties
(`signPactProposal` mints from `proposal.from/to` — pactFormation.js:367). VERIFY-AT-COMPILE
that from/to survive the instrument round-trip; if they do NOT, the fix needs a persisted
field → park to OWNER_DECISION_QUEUE (persisted-shape widening not covered by the blanket).

## CR-GR3B-4 — composable pair exception

`amendPactInstrument` gains a CLOSED exception: exactly `{non_aggression, mutual_defense}`
may co-occupy `security|<same beneficiary>` — a frozen pair constant, both arrival orders,
including both-in-one-draft. Duplicate of a live member: refused (existing law). A third
security term (e.g. demilitarization): refused. No general stacking rule.

## CR-IN0C-1 — signing-credit transport: NEXT-TICK DERIVED, nothing moves

At tick T the pulse caller (pulseKernel, at the existing statecraft call site) derives
`provenTrue` CredibilityDelta[] from PERSISTED treaty state: every disclosure-family term
with `signedTick === T - 1` (peaceTerms.js:250 persists signedTick) credits the disclosing
obligor once. Consumer: the existing `provenTrue` seam (informationStatecraft.js:1403 fold).
NO stage move, NO second pass, NO pending-credit deposit, NO new persisted family, NO
direct credibility write. Replay-safe and exactly-once by construction (pure predicate on
persisted state). Pipeline order unchanged: beliefs → statecraft (consuming last tick's
signings) → treaties. The design's "same-tick" language binds only the expiry lift.

## CR-IN0C-2 — closed kinds/audience

`treaty_disclosure_opened` = ENGINE EVENT, registered, minted at treaty PASS 1 via the
existing beat machinery. `disclosure_feed` = RESERVED CONTENT HANDLE (pool only).
`disclosure_strained` = DM PROJECTION ONLY (derived from observed compliance; no engine
kind). `disclosure_expired` = EXCLUDED — expiry uses the existing standard lapse kind
(`treatyLapsedBeats`); the chair-flagged inferred token is REFUSED. Honored stays quiet;
default uses the existing standard default kind.

## CR-IN0C-3 — compliance fidelity

Feed multiplier by observed compliance: honored = 1.0; strained = `RELAY_KEEP` BY IMPORT
(0.95 — semantic law: a strained compelled feed degrades to ally-relay fidelity, never a
second spelling); defaulted/lapsed = feed stops. Multiply then clamp [0,1]; no rounding.
Merge = the existing strongest-confidence precedent UNCHANGED; no third merge law.

Related: [[implementation-packet-dispatch-system]] · [[owner-blanket-queue-signoff]].

## REVISIONS AND SECOND-ROUND RULINGS (chair, 2026-08-10, after the gb- author lane's
## execution probes; each vetoable; these SUPERSEDE the matching clauses above)

⚠⚠ **CR-GR3B-3 IS REVISED TWICE — its premise was measured FALSE and its direction was
BACKWARDS.** (1) Proposer identity NEVER reaches persistence: `signPactProposal` sorts
`[from,to]` by codepoint before building the record (swapped-proposer mint = byte-identical
ledger key, parties, and receipt; round-trip byte-identical; the proposal row carrying
from/to is pruned the same tick). (2) The shipped receipt semantics make the COUNTERPARTY
the promiser ("bravo_court promises resource share to alpha_court") — my obligor=proposer
ruling would have made the asking court PAY the restitution it asked for.

- **CR-GR3B-3-R1 (supersedes CR-GR3B-3):** the obligation axis is PER-TERM and it IS the
  existing persisted `beneficiary` (option C — ZERO persisted-shape change, so the park
  clause does not fire and the chair may rule): obligee = the term's beneficiary; obligor =
  the counterparty; payer = obligor, payee = beneficiary; capacity subject = obligor;
  monitor = obligee; defaultedBy = obligor. Symmetric beneficiaries ('both' / reciprocal)
  = MUTUAL obligation, no transfer direction — and the CR-GR3B-1 ladder never drafts a
  transfer term symmetric. v1 §6's "never derive from beneficiary" prohibition guarded an
  UNRULED choice; this ruling DEFINES the axis, which is a different act. Recorded to the
  owner as EP-s (active-with-veto, not parked).
- **CR-IN0C-1-R1:** the next-tick derivation does NOT live in pulseKernel (1580/1580,
  zero headroom — R-BLD-10 + the never-raise-to-finish law). It lives as the CONSUMER'S
  OWN DEFAULT: advanceInformationStatecraft computes provenTrue's disclosure-credit
  default from persisted state when the caller passes none (explicit provenTrue still
  wins; substance of CR-IN0C-1 unchanged — next-tick, derived, no stage moves, no
  deposits). The recompile measures the consumer file's own ceiling; if it too lacks
  headroom, escalate back.
- **CR-IN0C-1-R2:** the exactly-once predicate reads the TERM's own mintedTick
  (disclosure-family term rows, mintedTick === T-1) — TOTAL across every mint door;
  treaty-level signedTick has one writer of five and FAILS OPEN (the recorded
  credit-side-enumeration class).
- **CR-IN0C-2-R1:** `treaty_disclosure_opened` registers by MIRRORING `treaty_lapsed`'s
  registration row exactly (same section/desk/audience/significance values) — a treaty
  lifecycle beat takes the treaty desk; the 6-file registration footprint is accepted.
- **CR-IN0C-ENVELOPE:** the third logic file (treatyLifecycleVoice.js) is an
  explicitly-approved named budget override — beats never get a second home.
- CR-IN0C-3 vocabulary corrected: 'expired' (the live complianceState word), not 'lapsed'.

## Durable findings folded from the gb- author lane (each independently load-bearing)

- ⚠⚠ `pulseKernel.js` = 1580/1580 ZERO headroom — blocks ANY packet naming it as an edit
  site; every future FP wave touching the pulse caller must route around it.
- ⚠⚠ Treaty-level `signedTick` has ONE writer of five registered treaty-ledger writers —
  any predicate over it fails open; term-level `mintedTick` is the total alternative.
- A registered grammar kind costs 3 production files at `section: null` and 6 with a
  Herald desk (`GRAMMAR_HERALD_KINDS` derives from `section !== null`).
- ⚠ `grep provenTrue tests/` = ZERO hits repo-wide — the seam had no test anywhere; v1's
  "Credit test" row was wrong. First coverage arrives with IN-0C's A1.
- ⚠ `peaceTerms.js` = 790/800 (10 lines headroom) — the PASS 1 host is nearly at ceiling.
- `producedTypes()` stringifies the lens values — the ladder shape silently breaks that
  census; its repair is a required GR-3B edit.

## Final-pass findings + the ordering ruling (chair, 2026-08-10, post gb-pass-2)

- **CR-FP-ORDER (chair):** ORIENT lands FIRST (+1 of peaceTerms.js's 10 free lines),
  IN-0C second (+2), GR-3B third (on ORIENT's SHA) — strictly serial; the shared
  790/800 peaceTerms.js and the validator's exclusive change-path reservation force a
  real order and this is it. IN-0C's manifest omits peaceTerms.js until ORIENT lands
  (its §7a records the deferred row — the TC-3B pattern).
- ⚠⚠ The predecessor's "byte-invariant under proposer swap" headline was OVER-BROAD:
  key/parties/receipts are invariant but the per-term `beneficiary` MOVES with the
  asker (pass-2 probe) — which is exactly why CR-GR3B-3-R1 is implementable with zero
  persisted-shape change. The ORIENT cure: a NEW per-term reader in treatyOrientation.js
  (0 existing consumers change, vs 9 for extending treatyOrientationOf); PASS 2's S1-S5
  go per-term, S0/S6-S9 stay instrument-level with reasons.
- ⚠⚠ VALIDATOR LAWS (bit twice tonight): packet headers are MACHINE-PARSED — `**Status:**`
  one word + EOL, `**Verified base:**` branch+full-hex on ONE line; and validate:packets
  reserves every change path EXCLUSIVELY across non-terminal packets — two live packets
  cannot both list one file, and the documentation commit itself reds.
- `grammarKindRow('treaty_lapsed','notable','public','trade',…)` are the pinned literals
  for CR-IN0C-2-R1; ⚠ the builder's 5th param is `requiredSlots` NOT `contexts` (a
  pass-1 signature mis-statement, corrected).
- `informationStatecraft.js` = 773/800 (27 free); term `mintedTick` written at all five
  term-mint doors (peaceTermsDrafting:59, peaceTerms:209, pactFormation:257+:385,
  peaceTermsSale:153) — the exactly-once predicate is TOTAL.

## ✅✅ THE CHAIN CLOSED WHOLE (2026-08-10): ORIENT d56d944c → IN-0c 29e2dc3c → GR-3b 40afbdd6

The IN-0 family is COMPLETE and the nine PRODUCER_OWED rows are DISCHARGED (the CHAIR
reparations row survives byte-unchanged — its seam-declaration is still F-S1-E2's item).
Three packets crossed one shared hot file (peaceTerms.js, final 794/800) by explicit
serial order, zero collisions, zero raised ceilings. ⚠⚠ THE ERA'S LESSON, three bites:
CW-0w keys on (importer, imported) PAIRS — reachability arguments are ALWAYS wrong, a
new module is always a new importer, and the cures in order of preference are (1) invert
the dependency so the licensed side supplies a closure (CR-ORIENT-C), (2) mint the
registry row when the cross-port edge is intrinsic (CR-IN0C-CPL), never (3) baseline it.
The sealed inner loop is BLIND to this class (check:packet green on coupling-red trees,
demonstrated live twice) — IA-3 docket. The one declared lit-path shift of the chain:
a decisive shared-threat crossing (measured 0.8645) now drafts the NAP+mutual-defense
pair; controlled, recorded in 40afbdd6's body.
