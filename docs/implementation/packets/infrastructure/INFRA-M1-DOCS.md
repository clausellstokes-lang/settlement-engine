# INFRA-M1-DOCS — the §28 documentary substrate

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `600831749908e340444087df734d18c27046980d`
- **Train:** `infra-1`, member 1 of 3 — **the lawful truncation boundary**
- **Preamble:** ⚠ this member AUTHORS `docs/implementation/preambles/INFRA-PREAMBLE.md`, so it is
  the one member that cannot cite it. M2 and M3 cite the SHA-256 this member lands.
- **Authorities:** `PACKET_STANDARD.md` · `DESIGN_BUILD_EFFICIENCY.md` §2/§3/§4/§8 and
  `DESIGN_IP_PROTECTION.md` §3 (both read from `review-fixes-2026-07-08` — this member folds them)
  · `docs/implementation/INDEX.md` · `OWNER_DECISION_QUEUE.md` §28 and §30
- **Compiled by:** Lane TC3. **Executed by:** Lane TE3.

---

## §1 Scope and boundary

**This member lands the documentary substrate the rest of the §28 program stands on, and cures the
three dispatch-surface contradictions a reader of that substrate would otherwise trip over. It
changes no code, no test, no script, no configuration, and moves no census figure.**

In scope, exactly nine files:

1. Fold `DESIGN_BUILD_EFFICIENCY.md` from the ledger branch to `docs/`, **verbatim**.
2. Fold `DESIGN_IP_PROTECTION.md` from the ledger branch to `docs/`, **verbatim**.
3. Author `docs/implementation/preambles/INFRA-PREAMBLE.md`.
4. Amend `PACKET_STANDARD.md` with three §28 sections.
5. Cure INDEX.md's stale blocked-prose (FPC contradiction 3).
6. Cure the FP spine's self-disagreeing wave count (FPC contradiction 1).
7. 8. 9. Add a dated warning banner to the HB, WC and EP volume headers (FPC contradiction 4).

**Explicit non-goals.** No `src/`, `tests/`, `scripts/`, `package.json`, `vite.config.js`,
`eslint.config.js` or CI edit. No new packet beyond this one, no status change to an existing
packet, no census re-record (M1 moves nothing). **No rewrite of any FP volume's substance** —
items 6-9 change *status prose about the code*, never a wave spec, a section number, a ruling, or
a seam row. No edit to `docs/content/RECEIPT_POOLS_GRAMMAR.md`.

### 1.1 The recorded scope override

`PACKET_STANDARD.md` §"Default hard scope budget" permits *"a smaller or explicitly approved
larger budget before dispatch."* This member records one:

> **OVERRIDE INFRA-M1-A — nine handwritten DOC files against a default that assumes one behavior
> family.** Granted on the grounds that (a) all nine are `DOC`/`CREATE` actions carrying **zero
> production lines** — the standard's own words: *"Documentation receipts do not count as
> production lines"*; (b) the census motion is provably `+0/+0/+0/+0/+0` because the lighting
> walker's corpus is `walk(join(ROOT, 'tests'))` and no `docs/` path can enter it; (c) items 5-9
> were measured this session by lane FPC and deferring them re-pays that measurement cost later.
> ⛔ The override is for THIS member and **does not transfer** to M2, M3, or any later INFRA wave.

---

## §2 Required verified tree contract

| Role | Path and symbol | State at base (EXECUTED) |
|---|---|---|
| Fold source A | `review-fixes-2026-07-08:docs/DESIGN_BUILD_EFFICIENCY.md` | 213 lines; **absent** from `claude/composite-r4` |
| Fold source B | `review-fixes-2026-07-08:docs/DESIGN_IP_PROTECTION.md` | 261 lines; **absent** from `claude/composite-r4` |
| Preamble idiom | `docs/implementation/preambles/GR-PREAMBLE.md` | present — **structure only** |
| Standard | `docs/implementation/PACKET_STANDARD.md` | present; `## Dispatch unit` and `## Default hard scope budget` are the insertion anchors |
| Dispatch surface | `docs/implementation/INDEX.md` | the stale sentence begins `GR-3b and IN-0c are the only partial-slice closers` |
| FP spine | `docs/DESIGN_FP_ARCHITECTURE.md` | `## §5 THE WAVES (109 waves`; `109 waves ordered`; the `= **108**` arithmetic |
| Volume headers | `docs/DESIGN_FP_ARCH_{HB,WC,EP}.md` | each opens `## LANDED 2026-08-07 as a member of the docs/DESIGN_FP_ARCH_* family` |
| The claims pin | `tests/docs/enforcement-claims.test.js` | `CLAIM_RE`, `WINDOW = 3`, `FROZEN_NAKED` (4 keys) |

⚠ **Navigate by the quoted TEXT, never by a line number.** Lane FPC recorded the INDEX prose at
one address and it had already moved by this base — the hand-keyed-address-rot class.

**Forbidden files:** everything not in §4. **Forbidden alternative homes:** the FPC cures do not
move to a new doc, a changelog, or a ledger row — each is cured **in the file that carries it**.

---

## §3 Exact contracts this member settles

### 3.1 The two folds are VERBATIM

Byte-for-byte from `git show review-fixes-2026-07-08:docs/<name>` with **one** permitted
transformation each: the `Fold obligation` clause in the Status block is rewritten to record that
the fold has happened, naming this member. Nothing else moves — not a heading, not a table row,
not a refusal.

⛔ **Any `until then, the ledger copy is canonical` clause must be REMOVED, not left standing.**
Two canonical copies of one volume is the drift this fold exists to end.

### 3.2 `INFRA-PREAMBLE.md` — the exact section set

Mirrors GR-PREAMBLE's structure (`§P1..§P9`) and its four framing rules: the
**no-per-wave-figure law**, the **citation-by-SHA-256 law**, the statement that
`validate:packets` needs no change, and the "what every member still carries itself" closer.

| § | Contents |
|---|---|
| §P1 | Binding authorities for INFRA. Explicitly **not** the FP grammar volumes. |
| §P2 | **The governed-input cost** — ⛔⛔ `package.json` and `package-lock.json` are two of the eleven `scannerToolFiles()` paths; a byte change to either moves `detectorTree.digest` and reds `check:observed-shape-readers` with a message saying an ordinary gate or write cannot migrate the instrument. The cure is a schema mint. **An INFRA member that needs a `package.json` row STOPS.** |
| §P3 | **The census law under INFRA** — re-derived WHOLE inside the train; INFRA has **no** standing shape. |
| §P4 | **The enumeration law** — `enumerateInvariants()`: seven enforcer dirs plus the `NAME_PATTERN` basename regex. |
| §P5 | Standing hazard dispositions for INFRA. |
| §P6 | Mutant hygiene — **lifted verbatim from GR-PREAMBLE §P6**. |
| §P7 | Gate-reading law — **lifted verbatim from GR-PREAMBLE §P7**. |
| §P8 | Standing STOP conditions for INFRA. |
| §P9 | What every INFRA member still carries itself. |

⛔ **§P3 must state, in terms, that INFRA has no standing tuple shape.** GR-PREAMBLE §P3 names
`+1/+0/+1/+8/+1` as a family invariant; M3 lawfully moves `+1/+1/+0/+0/+0`.

### 3.3 `PACKET_STANDARD.md` — the three §28 sections

Inserted as three new top-level sections **after `## Dispatch unit` and before
`## Default hard scope budget`**, so a reader meets the train before the per-wave budget it
re-scopes.

1. **`## Train landings`** — cites `DESIGN_BUILD_EFFICIENCY.md` §2.
2. **`## Family packet preambles`** — cites §4.
3. **`## The base-state capsule and its consumption law`** — cites §3, and records the
   docs-only-descendant clause as the chair's adopted judgment **J-T1**.

⚠ **The third section must not restate any capsule FIGURE.** It describes the law; the artifact
holds the numbers.

### 3.4 FPC contradiction 3 — INDEX.md

Replace the sentence beginning `GR-3b and IN-0c are the only partial-slice closers` with a
sentence recording that **both have LANDED** — GR-3b at `40afbdd6`, IN-0c at `29e2dc3c` — and that
the "Minimum decisions needed to unblock" section below is retained as a worked example, not as
open work.

⭐ **The highest-value cure in the member.** INDEX.md is the only current dispatch surface.

### 3.5 FPC contradiction 1 — the FP spine's wave count

Three sites, and the correction is **111 with the derivation stated**: the `§5 THE WAVES (109
waves` heading, the `109 waves ordered` clause, and a new note below the §5 heading recording all
three figures and the exact split.

⛔ **The `= **108**` arithmetic line is LEFT EXACTLY AS IT STANDS.** It correctly states the
2026-08-07 fold's own arithmetic under its own ES-5 convention; the new note explains it rather
than overwriting it. Rewriting it would destroy the evidence that reconciles the three figures.

### 3.6 FPC contradiction 4 — the HB / WC / EP banners

Each volume gains **one dated warning banner** immediately after its `# ` title line and before
the existing `## LANDED 2026-08-07 …` block, recording that "LANDED" names the DOCUMENT and not
the code, with the measured evidence at `60083174`.

⛔ **Not a rewrite.** Every existing block, wave spec, section number, ruling and seam row stays
byte-identical. The banner is additive.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| CREATE | `docs/DESIGN_BUILD_EFFICIENCY.md` | whole file | 0 production | verbatim fold per §3.1 |
| CREATE | `docs/DESIGN_IP_PROTECTION.md` | whole file | 0 production | verbatim fold per §3.1 |
| CREATE | `docs/implementation/preambles/INFRA-PREAMBLE.md` | whole file | 0 production | author §P1..§P9 per §3.2 |
| DOC | `docs/implementation/PACKET_STANDARD.md` | three new sections between `## Dispatch unit` and `## Default hard scope budget`; the `**Measured tree:**` header line | 0 production | per §3.3 |
| DOC | `docs/implementation/INDEX.md` | the `GR-3b and IN-0c are the only partial-slice closers` sentence | 0 production | per §3.4 |
| DOC | `docs/DESIGN_FP_ARCHITECTURE.md` | the `§5 THE WAVES` heading; the `109 waves ordered` clause; a new note below the §5 heading | 0 production | per §3.5. ⛔ do NOT touch the `= **108**` arithmetic |
| DOC | `docs/DESIGN_FP_ARCH_HB.md` | one banner after the `# ` title | 0 production | per §3.6 |
| DOC | `docs/DESIGN_FP_ARCH_WC.md` | one banner after the `# ` title | 0 production | per §3.6 |
| DOC | `docs/DESIGN_FP_ARCH_EP.md` | one banner after the `# ` title | 0 production | per §3.6 |

**Nine handwritten files** (override INFRA-M1-A), **zero** production leaves, **zero** modified
production files, **zero** registration files, **zero** effective production lines, **zero** new
persisted families, **zero** flags, **zero** user-facing surfaces.

`retiredSymbols`: **NONE.**

---

## §5 The hazard that dominates this member

⛔⛔ **WRITING ANY `docs/**.md` IS A GATE RISK. The naked-claim debt is frozen PER CLAIM, and a new
untagged claim REDS A TEST THAT IS GREEN TODAY** — a regression the test ratchet refuses to absorb.

`tests/docs/enforcement-claims.test.js` builds its corpus as *every root-level `*.md` plus every
`docs/**/*.md*` minus a five-row `EXEMPT_DOCS` frozen list*. **All nine files this member touches
are in that corpus, and so is this packet.** Any line matching `CLAIM_RE` without an
`@enforced-by <resolvable-target>` within **±3 lines** mints a new `<file> :: <matched vocabulary>`
key, and the per-claim pin at `FROZEN_NAKED` reds.

**PREFLIGHT RECEIPT, RE-EXECUTED BY LANE TE3 AT `60083174`:** `TOTAL_CLAIM_HITS=0` across both
fold sources ⇒ the folds add nothing to `FROZEN_NAKED` (4 keys today).

⚠ **The risk is in the text this member AUTHORS.** Three traps: *reds the gate* is safe and the
`fails …` spelling is not; a bare two-digit problem count can match inside a longer number; and
this packet file itself joins the corpus once it lands.

---

## §6 Acceptance matrix — closed at 6 cases

| id | Case |
|---|---|
| **A1** | the enforcement-claims pin is green at the I-commit and no `FROZEN_NAKED` key grows |
| **A2** | both folds are verbatim apart from the §3.1 Status-clause rewrite |
| **A3** | the lighting census is unmoved at `2416/365/2051/20016/5642` — the `+0/+0/+0/+0/+0` proof |
| **A4** | the three FPC cures are present and correct, and the `= **108**` arithmetic is byte-identical to base |
| **A5** | `PACKET_STANDARD.md` gains exactly three new top-level sections in the stated position, carrying no capsule figure; `INFRA-PREAMBLE.md` §P3 states that INFRA has no standing census tuple |
| **A6** | `validate:packets` exits 0 with every manifest/index/packet join closed |

Cases 5-8 of the standard's edge-case budget are **omitted, not replaced**: this member writes no
state, has no lifecycle, has no writer and no reader.

---

## §7 Mandatory implementation order

0. Preflight: branch, ancestry, porcelain-clean targets, both fold sources resolvable.
1. Baseline evidence: run A1's and A3's commands at base and record both exits.
2. — (inapplicable: this member asserts ABSENCE of motion; A1 and A3 are already green and the new
   evidence is that they stay green across nine docs edits.)
3. The two folds (§3.1).
4. `INFRA-PREAMBLE.md` (§3.2).
5. `PACKET_STANDARD.md`'s three sections (§3.3).
6. The three FPC cures (§3.4-§3.6).
7. Focused verification: A1-A6.
8. **No wave-end full gate** — under a train it moves to the terminal.

---

## §8 Focused checks (argv form, expected exit 0)

```
npx vitest run tests/docs/enforcement-claims.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
node scripts/implementation-packets.mjs validate
```

⛔ Every command runs bare with `; echo TRUE_EXIT=$?`. ⛔ Never wrapped in `gate-mutex.sh --run`.

---

## §9 Mutants

**NONE, and the reason is recorded rather than omitted.** This member adds no assertion, no branch
and no executable byte; there is nothing a source mutant could convict. Its trust comes from A2's
byte-diff and A3's unmoved census, both exact-equality reads that fail closed. ⚠ Recorded
explicitly so a reviewer does not read the absence as a skipped step.

---

## §10 STOP conditions

1. The enforcement-claims pin reds, or any `FROZEN_NAKED` key grows.
2. The lighting census moves by any amount.
3. Either fold source differs from the 213-line / 261-line files measured here, or either volume is
   already present on `claude/composite-r4`.
4. Any edit to a file outside §4 appears necessary — **including** a fourth FP volume whose header
   carries the same `LANDED` confusion. Report it; do not extend the sweep.
5. The `= **108**` arithmetic line would have to move.
6. A `CLAIM_RE` hit appears in authored text and cannot be reworded without changing meaning.
7. A foreign lane holds any of the nine targets dirty at dispatch.

---

## §11 Completion receipt

Verified base sha and final tree state · the nine changed files · A1-A6 with exact argv and exits ·
**the claim count before and after, quoted** · the lighting census tuple quoted unchanged ·
`validate:packets` output quoted · deviations `NONE` or a STOP · judgment calls `NONE`.

---

## §12 Landing receipt

**LANDED at the `infra-1` train's I1 commit `e6eb4c5d`.** Nine docs files, zero production lines.

- **A1** — the enforcement-claims pin was re-executed over the whole corpus. The naked-claim list
  is **byte-identical to base** at its six pre-existing entries, none in a file this member touches,
  so **no `FROZEN_NAKED` key grew**. The one red arm is the banked known failure and was proven
  identically red at `60083174` by re-execution in a temp worktree at base
  (`1 failed | 20 passed`, both runs).
- **A2** — both folds verbatim: `git show review-fixes-2026-07-08:docs/<name> | diff -` reports
  **only** the §3.1 Status-clause lines, for both volumes.
- **A3** — the lighting census stood **unmoved** at `2416/365/2051/20016/5642`, `TRUE_EXIT=0`,
  33/33. This is the `+0/+0/+0/+0/+0` proof that made this member the truncation boundary.
- **A4** — the three FPC cures landed; the `= **108**` arithmetic line and all three
  `## LANDED 2026-08-07` blocks are **byte-identical to base** (verified by diff).
  ⚠ One compile claim was REFUTED and the banner does not repeat it: "all charter modules absent"
  does not survive measurement (many named modules are pre-existing MODIFY targets). Each banner
  instead carries the flag measurement, which is decisive: 11 of 18, 7 of 9 and 14 of 17 named
  flags unminted for HB, WC and EP.
  ⚠ The wave count 111 was independently re-derived rather than transcribed: extraction over §5's
  own charter blocks gives ES 11, HB 10, WC 17, EP 6, WY-engine 7, and `60 + 11 + 7 + 33 = 111`.
- **A5** — exactly three new top-level sections between `## Dispatch unit` and
  `## Default hard scope budget`, carrying no capsule figure; §P3 states that INFRA has no standing
  census tuple.
- **A6** — `validate:packets` read **37 packets (1 READY)** at promotion and **39 packets
  (0 READY)** at the terminal.

⚠ **One promotion correction, made while the chain was unexposed.** The compile's `requiredSymbols`
named two prose fragments this member's own cure DELETES. The validator checks `requiredSymbols` at
**every** status, so a READY packet may only name symbols it preserves; `retiredSymbols` is no
escape, because it requires the retiree to still be PRESENT until LANDED. The promotion therefore
carries only preserved symbols, and the five symbols this member CREATES were added to the manifest
at the flip — the one status at which a CREATE claim first becomes machine-checkable.

**Deviations:** the two above, both recorded. **Judgment calls:** in the train receipt.
