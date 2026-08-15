# EFF-M2 — the packet-standard omnibus

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `954b4e0f7cfcc18426da352d6dda34ece6c2a53b`
- **Train:** `eff-1a`, member 3 of 4 — the first of the two docs members
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce`
- **Authorities:** `OWNER_DECISION_QUEUE.md` §45.2 (validator status-sequence simulation),
  §49/§50.2/§53.6 (the three flag-mint obligations), §74.2/§74.3 (caps and pre-proof),
  §77 with §83/§86 (the three redundancies as amended), §85.4 (the registry-mint two
  obligations), §95.2 with §97.2 (the census-burn law) · `DESIGN_BUILD_EFFICIENCY.md`
  §§2.4/2.6/2.7 (ledger branch)
- **Compiled and executed by:** Lane TE16

---

## §1 Scope and boundary

**This member amends ONE file, `docs/implementation/PACKET_STANDARD.md`, with six new
top-level sections and one header correction.** It changes no code, no test, no script, no
configuration, and moves no census figure.

The six sections are the standing law a compiler needs BEFORE it writes a train plan, and every
one of them exists today only in the decision queue or on the ledger branch — which is to say,
nowhere a coding-authority document points at. §53.6 recorded that the three-obligation flag
law was document-only and promoted the prose act; §85.4 assigned its packet-standard line to
this member by name; §95.2's census-burn law is confirmed at three measured instances.

**Explicit non-goals.** No law text is authored here — the sections RESTATE ruled law and cite
it. No edit to `INDEX.md` beyond this train's own status rows (which ride the promotion
commits, not this member's manifest). No preamble edit (member 4 owns those paths). No re-fold
of `DESIGN_BUILD_EFFICIENCY.md`: that volume's build-branch copy is stale against the chair's
ledger amendments, which is **recorded in the header as owed** rather than silently repaired by
an executor.

---

## §2 Required verified tree contract

| Role | Path and symbol | State at base (EXECUTED) |
|---|---|---|
| The target | `docs/implementation/PACKET_STANDARD.md` | present; `## Train landings` and `## Family packet preambles` are the insertion anchors |
| The claims pin | `tests/docs/enforcement-claims.test.js` | `CLAIM_RE`, `WINDOW = 3`, `FROZEN_NAKED` at **4** keys, none in this file |
| The canonical law | `review-fixes-2026-07-08:docs/DESIGN_BUILD_EFFICIENCY.md` §§2.4/2.6/2.7 | present on the LEDGER branch |
| The folded copy | `docs/DESIGN_BUILD_EFFICIENCY.md` | present but **without** §2.6, §2.7 and the §2.4-R2 amendment — the divergence this member records rather than cures |
| The validator | `scripts/implementation-packets.mjs`, `validatePacketManifest` | reserves change paths at every NON-TERMINAL status, DRAFT included |

⚠ **Navigate by the quoted heading text, never by a line number** — the hand-keyed-address-rot
class has bitten this file before.

**Forbidden files:** everything not in §4.

---

## §3 Exact contracts this member settles

Six sections, inserted between `## Train landings` and `## Family packet preambles` so a reader
meets the train, then the caps that widen it, then the machinery that stops it safely.

1. **`## Differential member caps`** — the 8 / 10 / 4 table with the stamp as a PRECONDITION,
   the STOP a compile inherits by citing an unstamped annex, and the statement that a family's
   own preamble is where its stamp status is read. It carries no per-family figure.
2. **`## Parallel pre-proof`** — the option line, the exit vocabulary 0 / 1 / 2, and the
   sentence the whole mechanism turns on: a pre-proof green is never landing proof.
3. **`## Premise maps and scoped truncation`** — R1 with the staged-promotion exemption, R2
   with the schema-v2 plan shape and the transitive-closure and re-chain semantics, R3's
   conditional-fork template, and the four structural FULL-STOP defaults.
4. **`## Validator status-sequence simulation`** — §45.2's compile-stage step, with the reason
   it cannot be checked at the endpoints: a change path is reserved at EVERY non-terminal
   status, DRAFT included.
5. **`## Registration obligations a wave prices at compile`** — the three flag-mint obligations
   and the two registry-mint obligations, each with the reason it was missed.
6. **`## Burning a census row`** — the law verbatim in spirit, plus the two shapes that follow:
   a floor under an emptied population is DELETED rather than zeroed, and a control over an
   emptied population CONVERTS to the victory assertion.

The header's `**Measured tree:**` line is re-stamped to this train's base, and gains the
recorded divergence note naming the ledger-branch citations.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| DOC | `docs/implementation/PACKET_STANDARD.md` | six new top-level sections between `## Train landings` and `## Family packet preambles`; the `**Measured tree:**` header line | 0 production | per §3 |

**One handwritten file**, zero production lines, zero census motion, zero new persisted
families, zero flags. `retiredSymbols`: **NONE.**

---

## §5 Acceptance matrix — closed at 6 cases

| id | Case |
|---|---|
| **A1** | the enforcement-claims pin stays green and no `FROZEN_NAKED` key grows — `CLAIM_RE` at zero over the authored bytes, measured before and after |
| **A2** | exactly six new top-level sections exist in the stated position, and the surrounding sections are byte-identical to base |
| **A3** | no section carries a per-family or per-wave figure: the caps table is the law, the family's stamp lives in its preamble, and no census tuple, seal or denominator appears |
| **A4** | every authority citation resolves — the queue sections by number, and the ledger-branch volume with its divergence recorded in the header rather than assumed |
| **A5** | `validate:packets` exits 0 with every manifest / index / packet join closed |
| **A6** | the lighting census is unmoved: the walker's corpus is a walk of the `tests` tree, so no `docs/` path can enter it |

Cases 5-8 of the standard's edge-case budget are omitted, not replaced: this member writes no
state, has no lifecycle, no writer and no reader.

---

## §6 Mandatory implementation order

0. Preflight. 1. Baseline: run A1 and A6 at base and record both exits. 2. — (inapplicable:
this member asserts ABSENCE of motion). 3-6. Author the six sections and the header line.
7. Focused verification A1-A6. 8. **No wave-end full gate** — under a train it moves to the
terminal.

---

## §7 Focused checks (argv form, expected exit 0)

```
npx vitest run tests/docs/enforcement-claims.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
node scripts/implementation-packets.mjs validate
```

⛔ Bare, with `; echo TRUE_EXIT=$?`. ⛔ Never wrapped in `gate-mutex.sh --run`.

---

## §8 Mutants

**NONE, and the reason is recorded rather than omitted.** This member adds no assertion, no
branch and no executable byte. Its trust comes from A1's before-and-after claim count and A6's
unmoved census — both exact-equality reads that fail closed.

---

## §9 STOP conditions

1. The claims pin reds, or any `FROZEN_NAKED` key grows.
2. The lighting census moves by any amount.
3. A section would have to author law rather than restate a ruled one.
4. A per-family or per-wave figure would have to enter the standard to make a section
   intelligible.
5. Curing the stale `DESIGN_BUILD_EFFICIENCY.md` fold starts to look necessary — it is a chair
   act; record it, do not perform it.
6. A `CLAIM_RE` hit appears in authored text and cannot be reworded without changing meaning.

---

## §10 Completion receipt

Verified base and final tree state · the one changed file · A1-A6 with exact argv and exits ·
the claim count quoted before and after · the census tuple quoted unchanged · deviations `NONE`
or a STOP · judgment calls in the train receipt.
