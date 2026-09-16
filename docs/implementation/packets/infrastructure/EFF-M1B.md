# EFF-M1B — the §77 premise-map tool

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `954b4e0f7cfcc18426da352d6dda34ece6c2a53b`
- **Train:** `eff-1a`, member 2 of 4
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce`
- **Authorities:** `OWNER_DECISION_QUEUE.md` §77 (R1/R2/R3), §79 (the coded machinery and its
  seven-invocation proof), §83.1-83.2 (R-M1 and R-M2 ruled cured as architected), §86.2
  (J-REFF-6: dependents of a FORKED member STOP by default) · `DESIGN_BUILD_EFFICIENCY.md`
  §2.4-R1/R2/R3 as amended (canonical law text, ledger branch) · the `laneP77` draft and the
  `laneREFF` cure-pass addendum, both non-authoritative and re-derived here per §63
- **Compiled and executed by:** Lane TE16

---

## §1 Scope and boundary

**This member lands ONE new script, `scripts/premise-map.mjs`, and nothing else.** Three
subcommands, one per §77 mechanism: `validate` (R2/R3 shape law), `scope` (R2's truncation
calculus with the R-M1 transitive closure), `queue-check` (R1's dual-family invariant).

The tool is **pure file-in / file-out**: it touches no git state, no network and no test
runner, which is why — unlike the pre-proof harness — it is lawful to execute beside a live
executor, and why its proof is a fixture battery rather than a process probe.

**Explicit non-goals.** No test file (same two-census reasoning as EFF-M1A). No npm wiring. No
law text: DBE §2.4's amendment is the chair's own act on the ledger branch, and this member
lands only the machinery that makes the law checkable.

---

## §2 Required verified tree contract

| Role | Path and symbol | State at base (EXECUTED) |
|---|---|---|
| The deliverable | `scripts/premise-map.mjs` | **absent** at base |
| The law it implements | `review-fixes-2026-07-08:docs/DESIGN_BUILD_EFFICIENCY.md` §2.4 | carries R1, R2 (as amended by §83.1) and R3 |
| Sibling machinery | `scripts/preproof-train.mjs` | landed by this train's member 1 |
| The lint scope | `eslint.config.js`, the `scripts/**/*.{js,mjs,cjs}` block | node globals, `sourceType: module` |
| The typecheck scope | `tsconfig.full.json`, `tsconfig.domain-strict.json` | neither includes `scripts/` |

**Forbidden files:** everything not in §4.

---

## §3 Exact contracts this member settles

### 3.1 Exit semantics

**0** = valid, or a scope computed with a surviving tail · **1** = a violation or a FULL-STOP
verdict · **2** = usage, parse or read failure, implying no verdict at all. The three classes
are separated deliberately: an unreadable annex must never read as a clean map.

### 3.2 The row-id law (R-M2)

After NFC normalization a row id matches `/^[A-Z0-9][A-Z0-9._-]*$/` — ASCII, no whitespace, no
unicode dashes, never leading `-`. Corruption is convicted through TWO distinct doors, and the
distinction is load-bearing: a corrupted id in the PLAN convicts at `validate` (and `scope`
then FULL-STOPs through the invalid-plan door), while corruption of the REFUTED id — the
command-line side — is caught by the NEAR-MISS door, which FULL-STOPs rather than silently
reporting a NO-OP. A silent NO-OP is exactly how a member built on a refuted premise would land
while the receipt told the chair the train was unaffected.

### 3.3 Grades and contradiction

`MEASURED-TRUE | UNVERIFIABLE-AT-BASE | LAW`. One row id carries ONE grade plan-wide;
contradictory grades are convicted (R-D12), because a fork signed on a row the same member also
grades LAW is a signed promise that can never fire.

### 3.4 The dependency law (R-M1) and the FORKED bucket (R-D15, J-REFF-6)

`dependsOn` names EARLIER members only — declaration order is build order, so no self edges and
no forward edges. A plan with `flagMember` is a §2.5-shaped train: every other member must
declare `dependsOn` on it, and `scope` treats the slice→flag edge as present regardless.
Dependents of a STOPPED member stop transitively. Dependents of a FORKED member ALSO stop, by
default and conservatively — continuing them is a chair act, never this tool's default
(J-REFF-6, signed). A FORKED member is its own output bucket and is never listed under STOP:
the chair pre-signed that it lands as M′.

### 3.5 The conservative defaults are STRUCTURAL

A LAW-graded citation, an invalid or absent plan, a near-miss row id, and a truncation that
leaves nothing to continue all yield FULL-STOP exit 1 — including the whole-train-cited case
(R-D13), which previously exited 0 with an empty CONTINUE and read backwards to any automation.

### 3.6 `queue-check` binds to its own train (R-D14)

The first two slots need non-empty string families and `ttsSimulated: true`, the families must
differ, and `queue[0].train` must equal `plan.train` — a plan may not satisfy R1 with a queue
naming neither its own family nor any real one.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| CREATE | `scripts/premise-map.mjs` | whole file | 0 production (a workflow script, not a production leaf) | author per §3 |

**One handwritten file.** Zero production leaves, zero modified production files, zero
registrations, zero test files, zero generated artifacts. `retiredSymbols`: **NONE.**

---

## §5 Acceptance matrix — closed at 8 cases

| id | Case |
|---|---|
| **A1** | the seven §79.2 proofs reproduce at this base: `0 / 1 / 0 / 1 / 0 / 0 / 1` |
| **A2** | the signed fork surfaces as its own FORKED bucket and is absent from STOP |
| **A3** | R-M2 both doors: whitespace and homoglyph ids in the PLAN convict at `validate`; a trimmed or unicode-dashed REFUTED id FULL-STOPs as a NEAR-MISS instead of reporting NO-OP |
| **A4** | R-M1 closure: a `dependsOn` chain stops transitively with reasons named; a refuted flag member is a FULL-STOP; a forked member's dependent STOPS while a premise-disjoint member continues |
| **A5** | R-D12/13/14 convict: contradictory duplicate grades, whole-train citation, family-less queue |
| **A6** | `--annex` separates all three classes: present `0`, missing row `1`, unreadable annex `2` |
| **A7** | the structural defaults hold: an invalid plan cannot scope, a missing row id is a usage error, an unknown subcommand is a usage error |
| **A8** | the script is lint-clean under the repo's own eslint and `node --check` exits 0 |

---

## §6 Mandatory implementation order

0. Preflight. 1. Baseline: re-read §77/§83/§86 and DBE §2.4 so every law comment in the file is
verified against the text it cites rather than inherited from the draft. 2. — (inapplicable:
the proof is a fixture battery.) 3. Author the script. 7. Focused verification A1-A8. 8. **No
wave-end full gate** — under a train it moves to the terminal.

---

## §7 Focused checks (argv form, expected exit 0)

```
node --check scripts/premise-map.mjs
npx eslint scripts/premise-map.mjs
node scripts/implementation-packets.mjs validate
```

⛔ Bare, with `; echo TRUE_EXIT=$?`. The fixture battery is an executed receipt quoted in the
train receipt, with its non-zero expectations named per probe.

---

## §8 Mutants

**NONE as source mutants**, and for the same recorded reason as EFF-M1A: there is no in-repo
suite to convict. The substitute is a battery in which every conviction is paired with the
adjacent lawful case that must NOT convict — a near-miss beside an exact match, a family-less
queue beside a lawful one, a forked member beside a stopped one — so a tool that convicted
everything would red the battery just as loudly as one that convicted nothing.

---

## §9 STOP conditions

1. Any subcommand would need git state, network, or a test runner.
2. A conviction cannot be paired with a lawful case that stays accepted.
3. Any census, ratchet, or walker baseline moves.
4. The tool would have to soften a conservative default to make a plan pass.

---

## §10 Completion receipt

Verified base and final tree state · the one changed file · A1-A8 with exact argv and exits ·
the full battery table · deviations `NONE` or a STOP · judgment calls in the train receipt.

---

## §11 Landing receipt

**LANDED at the `eff-1a` train's I2 commit `93e3904a`.** One script, zero production lines,
zero census motion.

- **A1** — the seven §79.2 proofs reproduce EXACTLY at this base: `0 / 1 / 0 / 1 / 0 / 0 / 1`.
- **A2** — R3's output surfaces the fork as its own bucket:
  `FORKED: SYN-A lands as → SYN-A': narrowed to the surviving shape`, with `STOP: (none)` and
  `CONTINUE: SYN-B, SYN-C, SYN-D`.
- **A3** — both doors convict: a whitespace row id in the plan reds `validate` (1) and its
  `scope` FULL-STOPs through the invalid-plan door (1); a homoglyph id reds `validate` (1); and
  a REFUTED id corrupted by a trailing space or a U+2011 dash FULL-STOPs as a NEAR-MISS (1/1)
  naming the citation it nearly matched.
- **A4** — closure both ways: `STOP: A, B (depends on A), C (depends on B)` with `CONTINUE: D`;
  a refuted flag member is a FULL-STOP (1); a forked member's dependent stops while the
  disjoint member continues — `FORKED: A · STOP: B (depends on A) · CONTINUE: C` (0).
- **A5** — contradictory grades (1), whole-train citation (1, FULL-STOP where the pre-cure
  draft exited 0 with an empty CONTINUE), family-less queue (1).
- **A6** — `--annex` separates all three classes: `0 / 1 / 2`.
- **A7** — an invalid plan cannot scope (1), a missing row id is usage (2), an unknown
  subcommand is usage (2).
- **A8** — `node --check` 0 and `npx eslint scripts/premise-map.mjs` 0.
- ⭐ **SELF-APPLICATION.** The tool was run against `eff-1a`'s OWN premise map: `validate
  --annex` 0 over 24 cited rows; `scope` on a row cited only by M3 stops M3 alone; `scope` on a
  row M1A cites stops M1A **and** M2 and M3 through their `dependsOn` edges while M1B
  continues; a LAW row FULL-STOPs; a trailing-space refutation is convicted as a near-miss.
- ⚠ **`queue-check` CONVICTED THE ESTATE, CORRECTLY, ON ITS FIRST APPLICATION** — reported to
  the chair rather than smoothed: `R1 VIOLATION: not TTS-simulated: wc-0`. The next
  distinct-family slot after the `eff-1a`→`eff-1b` staged pair is not compiled, so R1 does not
  hold today. The identical plan with that one field true reports `R1 HOLDS`, so the conviction
  is the estate's state and not the tool's.

**Deviations:** NONE. **Judgment calls:** in the train receipt.
