# INFRA / EST-B — two security-adjacent suites re-enter the evidence layer

**Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` at SHA-256
`c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce`.

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `3be4736f0119bdbedb627e9bf862782e21c9dc0a`
- **Train:** `est-1`, member **2 of 3** (E-3 in the `OWNER_DECISION_QUEUE.md` §56 charter's
  lettering). Promoted alone under the §60.3 staged-promotion law, after EST-A flipped
  LANDED in the same commit that promotes this member.
- **Authority:** `OWNER_DECISION_QUEUE.md` §56.1 (E-3) — ⛔ **REFUSED IN PART**, and §60.2
  **SIGNS the corrected E-3**: *"the chartered rewrite measured ZERO — the parks are
  TEST_CONTEXT_PARAM, and credit is remove-only; the SP-D spell-out + roster-totality guard
  replacement adopted."* Compile evidence: `laneTC15-report.md` §F-3.
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`,
  branch `claude/composite-r4`.
- **⚠ ONE PREMISE OF THE COMPILED SHAPE IS REFUTED HERE, AND IT IS NOT BASE DRIFT.** The
  compiled roster-totality guard spells **three** tier-blind modules and asserts the
  discovery equals them. The discovery yields **FOUR**: `src/store/fogEditSlice.js` also
  matches `^fogEdit.*\.js$`, and it existed at the compile base `fc8451c4` too. The packet's
  own §4 pre-ruled this branch — *"that is the guard working on its first run — spell the
  fourth case, do not weaken the discovery"* — and §9 STOP 3 repeats it. **Executed here:
  `fogEditSlice.js` carries no FORBIDDEN token, so the fourth case is honest as well as
  required.** Every figure this moves is corrected in §8, not smoothed over.

---

## §1 · ⛔⛔ READ THIS FIRST — THE CHARTER'S CURE DOES NOT WORK, AND IT WAS EXECUTED TO PROVE IT

§56.1 directs that the two suites be *"re-pointed from static `.each` tables to live tables
(the aiFallbackTotality pattern)"*. Measured with the lighting walker's **own**
`parkReasonsFor` — its own espree parse, its own rules — the two suites do **not** park for
their tables. They park for **`TEST_CONTEXT_PARAM`**: the `.each` callback takes a parameter.

Three premises fail at once:

1. The park reason is the callback parameter, **not the table**.
2. **A static literal table is what EARNS credit.** The walker's credit predicate requires a
   non-empty `ArrayExpression`, and the walker states its own monotonicity: *"this predicate
   never widens credit, it only ever removes it."* ⇒ **no live-table rewrite can un-park
   anything, ever.**
3. The named exemplar `aiFallbackTotality` parks for a **different** reason
   (`TEST_TABLE_UNPROVEN`) — the shape the rewrite would *import*, not escape.

The precedent is already written into the walker: a file rewritten **to** use `test.each()`
*"trips this walker's own TEST_CONTEXT_PARAM park rule … flipped CREDITED → PARKED."*

## §2 · What this member does instead — and it keeps BOTH halves of the charter's intent

The charter asked for one thing and meant two. The **stated goal** is visibility (un-parking).
The **unstated intent** behind "live tables" is anti-drift — a table that cannot silently fall
out of step with what it covers.

⇒ **Spell the cases out as straight-line `test()` calls** — the SP-D idiom, *loop inside a
named test, never generate tests from a loop* — **and add ONE named totality guard** that pins
the spelled roster against a discovered source.

**Visibility from the spell-out; anti-drift from the guard.** And the guard earned its keep
before it landed: it is what found the fourth module.

## §3 · The change manifest (4 rows)

| # | Action | Path |
|---:|---|---|
| 1 | `MODIFY` | `tests/components/fogTierGate.test.jsx` — spell out the **four** tier-blind module cases; add the roster totality guard |
| 2 | `MODIFY` | `tests/application/commands/executeCommand.test.js` — spell out the 3 stale-context refusals |
| 3 | `MODIFY` | `tests/lint/negativeAssertionAnchor.walker.test.js` — **bank the win**: `fogTierGate`'s frozen row drops |
| 4 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` — the census re-recorded WHOLE |

⛔ **No `CREATE` row, no `src/` file, no product behaviour.** This member cannot move a golden,
a flag, a hot file, an OSR finding or a typecheck ratchet, and it says so affirmatively rather
than by silence. ⭐ **§85.4 preflight: both registry-mint obligations have EMPTY subjects** —
no seeded chooser, no pool module, no `src/` file at all.

### 3.1 ⚠ ROW 3 IS A DOOR THE COMPILE DID NOT PRICE, AND IT IS PRICED HERE

`tests/lint/negativeAssertionAnchor.walker.test.js` freezes un-anchored
`not.toContain/not.toMatch/not.toHaveProperty` sites **per file, at an exact count**, and
`fogTierGate.test.jsx` sits in that inventory at **1** — the single `.not.toMatch(FORBIDDEN)`
inside the `.each` callback. Spelling the cases out turns that one site into **four**, which
`4 > 1` reds outright.

**The cure is to anchor all four and delete the row, which is a SHRINK.** Each spelled case
routes its read through a helper that throws on absence and refuses an empty read, and each
carries the walker's own one-line `// anchored:` escape immediately above the assertion — the
only position the scanner accepts. The frozen row then reads 0 and the walker's own inventory
arm demands it be deleted: *"a site was anchored; LOWER the row to N (delete it at 0) to bank
the win"*. ⛔ The tempting alternative — anchor three and leave one un-anchored so the count
still reads 1 — was **refused**: four identical assertions with one deliberately left
un-anchored is bookkeeping dressed as a guard.

⚠ `executeCommand.test.js` needs no row: `.not.toHaveBeenCalled()` is **not** one of the three
scanned matchers, and that file holds zero sites before and after.

## §4 · `fogTierGate.test.jsx` — the edit

The `test.each` block becomes a frozen four-entry roster, four straight-line cases, a reading
helper that refuses an empty read, and the roster totality guard. The guard discovers
`src/domain/townMap/fog*.js` and `src/store/fogEdit*.js` and requires the discovery to equal
the spelled roster exactly, with its own non-emptiness arm so a discovery that found nothing
could not pass.

## §5 · `executeCommand.test.js` — the edit

The `test.each` block becomes three straight-line cases carrying the same three
`[reason, change]` rows verbatim.

⚠ **No totality guard is authored here, and the omission is deliberate.** The three refusal
reasons are the executor's own freshness triple (`ownerId` / `saveId` / `revision`), a *closed*
set fixed by the command-context shape rather than an open discovered roster. A guard over a
closed three-key literal would be the recorded **self-referential-pin** class (list == list).
⇒ **Docketed instead as `CR-EST-FRESHTRIPLE`**: if a fourth freshness dimension is ever added
to the command context, this suite must gain a fourth case — a real obligation recorded where
it will be found rather than faked with a vacuous assertion.

## §6 · ⭐ PREFLIGHT — EXECUTED, classified by the walker's own reader

```
tests/components/fogTierGate.test.jsx
  A · AT HEAD (static .each)      PARKED    titles=  0 suites= 0   TEST_CONTEXT_PARAM:test.each()
  C · SPELLED OUT (4 cases)       CREDITED  titles=  9 suites= 3

tests/application/commands/executeCommand.test.js
  A · AT HEAD (static .each)      PARKED    titles=  0 suites= 0   TEST_CONTEXT_PARAM:test.each()
  C · SPELLED OUT (3 cases)       CREDITED  titles=  7 suites= 1

  DELTA   files+0 · parked-2 · credited+2 · titles+16 · suites+4
```

⭐ Both rewritten sources return an **empty** reason list, not merely a different one.

## §7 · §48 RE-SWEEP ON THIS CURE'S OWN PREMISES

| Premise | Re-swept how | Verdict |
|---|---|---|
| "these two files are parked" | the walker's own `parkReasonsFor` at this base | ✅ **HOLDS** — and the *reason* the audit and charter give is wrong (§1) |
| "spelling out un-parks them" | executed re-classification | ✅ **HOLDS** — both flip to CREDITED |
| "no other park rule bites the rewritten files" | `parkReasonsFor` returns `[]` for both | ✅ **HOLDS** — empty, not merely different |
| "the spelled roster IS the whole fog derivation" | the discovery executed at this base | ⛔ **REFUTED AS COMPILED** — four modules, not three. The guard found it before it landed; the fourth case is spelled (§-header) |
| "the fourth module is honest to add" | `FORBIDDEN` executed against `fogEditSlice.js` | ✅ **HOLDS** — no match, so the case passes on its merits rather than by exemption |
| "the spell-out is runtime-neutral" | case count by hand, both files | ⚠ **CORRECTED** — exec is neutral; fog gains **two** (the roster guard *and* the fourth module), not one |
| "no walker other than the census is touched" | the anchor walker's per-file inventory | ⛔ **REFUTED** — §3.1 prices the fourth path |
| "the two suites are security-adjacent" | read in full | ✅ **HOLDS** — fog is a premium tier-gate negative source contract; executeCommand guards stale-context refusal |

## §8 · Declared terminals (BY FIGURE), with EST-A landed

| Figure | after EST-A | at EST-B | Δ | Cause |
|---|---|---|---|---|
| Lighting census | `2431/366/2065/20132/5656` | **`2431/364/2067/20148/5660`** | parked **−2** · credited **+2** · titles **+16** · suites **+4** | two files leave the parked pool and their titles re-enter the evidence layer |
| Runtime tests | 28155 | **28157** | **+2** | ⭐ **NOT +16.** The `.each` rows already ran. The two genuinely new cases are fog's roster totality guard and fog's fourth module case |
| Frozen known failures | 15 | **15** | 0 | nothing repairs, nothing regresses; **no `--update` is owed by this member** |
| `validate:packets` | 48 / 0 | 49 / 1 → **49 / 0** at flip | +1 | staged promotion |
| anchor-walker inventory | `fogTierGate: 1` | **row deleted** | −1 | four sites anchored; the walker's own arm demands the deletion |
| everything else | — | unchanged | 0 | no `src/`, no flag, no golden, no OSR, no hot file, no typecheck ratchet |

⚠ **THE TITLES/RUNTIME SPLIT IS THE FIGURE MOST LIKELY TO BE MIS-PREDICTED.** Titles move
because *parked titles become visible*; runtime moves only for genuinely new cases.

## §9 · ⛔ MANDATORY STOPS

1. **Either file still reports a park reason after the rewrite** → STOP. Re-run
   `parkReasonsFor`; never adjust the census literal to match.
2. ⛔⛔ **NEVER "just census it".** The lighting census sits at its pinned ceiling; the
   admissible moves are lock-the-win / re-point / cure. Note the arithmetic
   (`parked + credited == files`) **still closes** under a silent mis-park, which is why the
   reason list is the evidence here and not the sum.
3. **The roster totality guard reds** → **that is the guard working.** Spell the new case;
   never weaken the discovery. (It already fired once, before landing — see the header.)
4. **A newly spelled module DOES match `FORBIDDEN`** → STOP and report it as a tier-leak
   finding. It would mean the fog derivation learned about auth, which is the defect this
   describe exists to catch — never an exemption entry.
5. **Any temptation to re-point either suite at a live/dynamic table** → STOP. Measured: it
   re-parks the file (§1).
6. **The anchor-walker row lowered rather than deleted, or left at 1 by anchoring only some
   sites** → STOP. §3.1.

## §10 · Acceptance cases

| id | case |
|---|---|
| A1 | `tests/components/fogTierGate.test.jsx` — 9 tests pass, including four spelled tier-blind scans and the roster totality guard |
| A2 | `tests/application/commands/executeCommand.test.js` — 7 tests pass, the three spelled refusals carrying the same three reasons verbatim |
| A3 | the walker's `parkReasonsFor` returns `[]` for **both** files |
| A4 | the CENSUS literal reads `2431/364/2067/20148/5660` and the walker is **green in this same commit** |
| A5 | the negative-assertion anchor walker is green with `fogTierGate`'s frozen row **deleted**, its inventory-honesty arm satisfied by the deletion rather than a lowered number |
| A6 | `npm run test:ratchet` exits 0 with **15** known failures and **no** `RATCHET DOWN` line |

## §11 · Checks

```
npx vitest run tests/components/fogTierGate.test.jsx
npx vitest run tests/application/commands/executeCommand.test.js
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
node scripts/implementation-packets.mjs validate
```
