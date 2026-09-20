# EM-B1f — STOP: §7.4's trap has a THIRD shape, and it is EM-B1f's OWN `retiredSymbols` row

**Lane:** Opus sealed build, slot-2, `fixes-2026-09-18-consist` @ `c33446830`.
**Seal:** `22c09c9d8278412bc397761f7e1606da675d4e3aab4a20447a3fbea1d8214f39` (dispatch EXIT=0).
**Tree:** UNCOMMITTED, all six handwritten §7 edits in place, `git status --short` exactly the six.

## The smallest measured contradiction

`scripts/implementation-packets.mjs:844-848` — for a **non-terminal** packet, a `retiredSymbols`
row's symbol **must still be PRESENT** in the file. Quoted from the source at `:834-838`:

> *"The mirror of the LANDED CREATE arm above, and for the same reason. Before a packet lands the
> retiree MUST still be present — the packet is written against it."*

EM-B1f is `READY`. Its `retiredSymbols[0]` is `const UNDISPOSITIONED_CEILING = 7` at
`tests/domain/roadsParticipation.test.js`. **§7 orders the lane to burn that exact text to `6`**
(`UNDISPOSITIONED_CEILING` 7 → 6, addendum 61 item 5, STOP condition 13). The moment the burn
lands, `validate` reds — and `validate` is **check index 11 of this packet's own sealed `checks`**.

⇒ **§7's change manifest and `checks[11]` are mutually unsatisfiable while the packet is READY.**

## Measured three ways, at this tip

| # | ceiling | `EM-B1f.retiredSymbols` | `node scripts/implementation-packets.mjs validate` |
|---|---:|---|---|
| 1 | `7` (base, at placement) | present | **EXIT 0** — `valid: 194 packets (1 READY)` |
| 2 | **`6`** (§7 as written) | present | ⛔ **EXIT 1** — `[implementation-packets] EM-B1f.retiredSymbols[0].symbol is already absent from tests/domain/roadsParticipation.test.js before READY: const UNDISPOSITIONED_CEILING = 7` |
| 3 | **`6`** | **removed** | ⭐ **EXIT 0** — `valid: 194 packets (1 READY)` |

State 2 was measured with every other edit of this build already in the tree, so **the burn is the
SOLE cause** and nothing else in the six handwritten files reds `validate`.
State 3 was measured by a TRANSIENT, REVERSIBLE manifest edit: `PACKET_MANIFEST.json` sha-256
`cc50c4b5ecaf4efa04f30fee5e170c9d51defa6803dba468bb2b6405365d2c07` **before and after**, restored
from `git show HEAD:` and re-hashed identical; `git status --short` back to exactly the six §7 paths.

## Why route B did not cure it

⭐ **Route B WAS done and it IS correct** — EM-B1k2's landed `requiredSymbols` row now reads the
figure-free `const UNDISPOSITIONED_CEILING` (verified: no packet in the register requires the
figure text any more), so STOP condition 14 is CLEAR. But route B cured the **cross-packet**
`requiredSymbols` error (*"is missing from"*). This is a **different** error on a **different
row** — EM-B1f's own `retiredSymbols` row, under EM-B1f's own READY status, reding with
*"is already absent … before READY"*. §7.4 analysed only the EM-B1k2 direction; the packet's
sentence *"route A … leaves `validate` red for the whole build. Carried anyway, in the manifest"*
is the fact, and route B does not reach it.

The row only becomes lawful at `LANDED` (`:840-843` asserts the symbol is ABSENT for a LANDED
retirement — exactly the post-burn state). There is no ordering of lane acts that makes it green
while READY.

## The routes — recommendation is the first

| route | act | verdict |
|---|---|---|
| ⭐ **B′** | **Delete EM-B1f's `retiredSymbols` row.** Route B already removed the thing it existed to discharge: EM-B1k2's guard is now figure-free and is satisfied by the constant continuing to EXIST at value 6, so the row is pure residue from route A. | ⭐ **RECOMMENDED — CONFIRMED green by execution (state 3).** Smallest edit; nothing is silenced (the guard stays live); the burn the charter ordered lands. A manifest edit ⇒ **the chair's**, not a lane's. |
| C | Leave the ceiling at `7`, bank only the disposition. | **FALLBACK.** Lawful (six rows under a ceiling of seven) but disobeys addendum 61's explicit *"burns the ceiling 7 → 6"*, trips STOP 13, and leaves the ceiling padded above its population — which the block's own comment forbids: *"You may burn it; you may never pad it."* One-line change to the tree as it stands. |
| D | Drop `validate` from `checks` for this packet. | ⛔ **REFUSED as a recommendation** — it removes a guard to green a packet (§P7: never raise a baseline, budget, timeout or ceiling to finish a packet). Named only for completeness. |

## The standing-law finding this makes

TE-26 (*"never put a re-recorded FIGURE in requiredSymbols"*, quoted at
`implementation-packets.mjs:94`) has a **sibling the estate has not written down**: *a
`retiredSymbols` row whose symbol is a FIGURE the same packet's §7 orders changed cannot pass its
own `validate` while READY.* TOOL-15 was chartered for the unpoliced figure-in-a-symbol shape;
this is the second bite and the first on `retiredSymbols`. ⚠ **A third is already loaded:**
EM-B1k2's `requiredSymbols` still carries `"uncoveredBaseline": 186` at
`scripts/mutation-coverage-manifest.json` — the next packet that moves that baseline hits this
same wall.

## What is ready the moment this is ruled

Every ungated act of the build is DONE and measured (see `EM-B1f.receipt-partial.md`). The gated
batch is written out in `EM-B1f.lane-resume.md` and runs straight through on "the gate is yours".
