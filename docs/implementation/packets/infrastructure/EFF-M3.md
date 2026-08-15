# EFF-M3 — the family preambles: caps, stamps, and the standing battery templates

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `954b4e0f7cfcc18426da352d6dda34ece6c2a53b`
- **Train:** `eff-1a`, member 4 of 4 — the train's terminal member
- **Preamble:** ⚠ this member EDITS all five family preambles, including
  `INFRA-PREAMBLE.md`, so it cannot cite one as unchanged authority. Its input SHA-256s,
  measured at base, are recorded in §2; its own edit re-stamps every citing packet, which is
  the mechanism working rather than a defect.
- **Authorities:** `OWNER_DECISION_QUEUE.md` §70.4 (the stamp precondition), §74.2 (the caps),
  §81.3 (the proof-shape templates), §85.4 (the registry-mint obligations), §93.3 (the INT
  preamble refresh, ruled "now, while it costs zero"), §96.4 (the seven-round enumeration) ·
  the `laneP81` template draft, non-authoritative, re-verified line by line here per §63
- **Compiled and executed by:** Lane TE16

---

## §1 Scope and boundary

**This member edits FIVE files — the five family preambles — and nothing else.** Each gains ONE
new section carrying estate-wide law, identical byte-for-byte across all five except for a
single family-measured stamp line. `INT-PREAMBLE.md` additionally takes the §93.3 refresh.

⛔ **M3 and `eff-1b`'s docs-debt member share these paths.** The split of the original `eff-1`
charter into `eff-1a` and `eff-1b` exists precisely so the two are never concurrently
non-terminal, because a change path is reserved at every non-terminal status. `eff-1b` compiles
only after this train's terminal is exposed.

**Explicit non-goals.** No per-wave figure enters any preamble — the standard forbids it and
this section carries none. No renumbering of an existing section. No edit to the volumes, the
standard (member 3 owns it), or any packet.

---

## §2 Required verified tree contract

| Role | Path | SHA-256 at base (EXECUTED) |
|---|---|---|
| Target | `docs/implementation/preambles/GR-PREAMBLE.md` | `d2715a7b0a0cfe6859127fb69339019ceccdc860dd24602faf2bb07bc02095d9` |
| Target | `docs/implementation/preambles/HB-PREAMBLE.md` | `84fc1a6b8177aaaa26983f8ccb86003adb56f70dc6789213030ede947ddeb388` |
| Target | `docs/implementation/preambles/IN-PREAMBLE.md` | `e284353f17252a84fd3de4f581678cd86edd3370fea60ebfb29efd02068dc609` |
| Target | `docs/implementation/preambles/INFRA-PREAMBLE.md` | `c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce` |
| Target | `docs/implementation/preambles/INT-PREAMBLE.md` | `cb86055e8db99c17c3f7da2aff5acede57f49fb15b33edb17727c54bf31b7809` |
| The §93.3 anchor | `INT-PREAMBLE.md` §P8.6 | reads ``of `kindPoolFloorsRegistries` off **9**`` |
| The refreshed figure | `docs/implementation/BASE_STATE.json` | `kindPoolFloorsRegistries: 10` |
| The zero-cost window | `node scripts/implementation-packets.mjs validate` | **50 packets / 0 READY** at base |
| Last section numbers | GR `§P9` · HB `§P11` · IN `§I13` · INFRA `§P9` · INT `§P9` | the new sections take `§P10 / §P12 / §I14 / §P10 / §P10` |

⚠ **Navigate by quoted text, never by line number.**

**Forbidden files:** everything not in §4.

---

## §3 Exact contracts this member settles

### 3.1 The section is an estate-wide LIFT, recorded as one

`PACKET_STANDARD.md` permits lifting genuinely estate-wide law verbatim between preambles and
requires the lift to be recorded as such. The new section opens with that record, so a reader
knows the five copies are one text and a future edit knows it must move all five.

### 3.2 The cap line is family-MEASURED, and two families are not stamped

The §70 program closed at seven rounds stamping WC · WF · EP · POP · INT · WY · TR/IN/CW/ES.
**GR and HB are not among them**, and no §70.4 acceptance for either volume appears in the
queue; INFRA is the build-machinery family and has no design volume or annex for a round to
stamp. Those three therefore record **FOUR**, with the door named. IN records the tails-round
stamp; INT records §93.1. ⚠ The §96.4 summary sentence "every family stamped" is NOT read as
covering GR or HB: the parenthetical enumeration in that same ruling is what binds, and writing
8 into an unstamped family's preamble would manufacture the authority the stamp exists to
gate.

### 3.3 The §81.3 templates land with their provenance INTACT

Receipt-tagged lines were re-verified against the named receipts and law-tagged lines against
the named law texts (§5 A3). T-PROSE states in its own header that **no landed train receipt
exists for its class** and names the law texts it derives from instead. No line claims a
receipt that does not exist.

### 3.4 The §93.3 refresh

`INT-PREAMBLE.md` §P8.6's registries STOP figure rotted lawfully in-window (9 → 10 at IN-1C-A)
and would fire a FALSE STOP on the next INT compile. The refresh costs zero only while no
packet is non-terminal, which is why §93.3 ruled it NOW; the re-stamp window is verified in A5
and is a STOP condition if it has closed.

### 3.5 The §85.4 preamble line rides HERE

§85.4 assigned its preamble line to "eff-1b's M3", a designator written before the charter was
split. `eff-1b` is now a single docs-DEBT member; the preamble member is this one, so the
registry-mint two obligations land in T-REGISTRY here. Recorded rather than assumed.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| DOC | `docs/implementation/preambles/GR-PREAMBLE.md` | one new `§P10` section appended | 0 production | per §3 |
| DOC | `docs/implementation/preambles/HB-PREAMBLE.md` | one new `§P12` section appended | 0 production | per §3 |
| DOC | `docs/implementation/preambles/IN-PREAMBLE.md` | one new `§I14` section appended | 0 production | per §3 |
| DOC | `docs/implementation/preambles/INFRA-PREAMBLE.md` | one new `§P10` section appended | 0 production | per §3 |
| DOC | `docs/implementation/preambles/INT-PREAMBLE.md` | one new `§P10` section appended; §P8.6's registries figure | 0 production | per §3, plus §3.4 |

**Five handwritten files**, zero production lines, zero census motion. `retiredSymbols`:
**NONE.**

---

## §5 Acceptance matrix — closed at 7 cases

| id | Case |
|---|---|
| **A1** | the enforcement-claims pin stays green and no `FROZEN_NAKED` key grows |
| **A2** | the five new sections are byte-identical to one another apart from the section number and the one stamp line — proved by diffing the extracted blocks pairwise |
| **A3** | every `[receipt: …]` line resolves in the named receipt and every `[law: …]` / `[practice: …]` line in the named law text; T-PROSE claims no receipt |
| **A4** | no preamble gains a per-wave figure; the cap table is law and the stamp line is the only measured cell |
| **A5** | the §93.3 window still holds — `validate:packets` reads 50 packets with ZERO non-terminal at base, so the re-stamp is free; §P8.6 reads `10` after |
| **A6** | the lighting census is unmoved — the walker's corpus is a walk of the `tests` tree |
| **A7** | `validate:packets` exits 0 with every join closed |

---

## §6 Mandatory implementation order

0. Preflight, including the §93.3 window check. 1. Baseline: A1 and A6 at base with exits
recorded. 2. — (inapplicable: absence of motion is the claim). 3-6. Apply the shared section
and the INT refresh. 7. Focused verification A1-A7. 8. This is the train's LAST member; the
terminal gate follows the flip and the capsule.

---

## §7 Focused checks (argv form, expected exit 0)

```
npx vitest run tests/docs/enforcement-claims.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
node scripts/implementation-packets.mjs validate
```

⛔ Bare, with `; echo TRUE_EXIT=$?`.

---

## §8 Mutants

**NONE** — no assertion, no branch, no executable byte. Trust comes from A2's pairwise
byte-diff, A3's citation re-verification and A6's unmoved census, all exact-equality reads.

---

## §9 STOP conditions

1. The claims pin reds or a `FROZEN_NAKED` key grows.
2. The lighting census moves.
3. `validate:packets` shows ANY non-terminal packet at base — the §93.3 re-stamp is then no
   longer free and the refresh must be re-ruled, not performed.
4. A cap of 8 or 10 would have to be written into a family whose stamp cannot be cited.
5. A template line would have to cite a receipt that does not contain it.
6. A per-wave figure would have to enter a preamble.

---

## §10 Completion receipt

Verified base and final tree state · the five changed files with their before and after
SHA-256s · A1-A7 with exact argv and exits · the claim count before and after · the census
tuple unchanged · deviations `NONE` or a STOP · judgment calls in the train receipt.
