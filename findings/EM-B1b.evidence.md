# EM-B1b — compile evidence

Every fact `EM-B1b.md` and `EM-B1b.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`. **Read only** in `$SP/consist`;
**wrote only** under `$SP/lane-em-b-scratch/`. No vitest, no eslint, no writing script.

---

## §0 · The base

As `EM-A2a.evidence.md` §0 and not restated: `d31af2cee` confirmed at 11:01:32 EDT before any
measurement; ten commits moved the branch to `7aa769830` by 11:33:21; `d31af2cee` **IS an
ancestor**; the window is four docs plus `.gitignore` plus one edit to an existing test file.
**Every path this packet measures is blob-identical across the window:**

```
IDENTICAL  scripts/mutation-coverage-manifest.json   IDENTICAL  tests/lint/mutationCoverage.shared.mjs
IDENTICAL  tests/lint/chooserTotality.walker.test.js IDENTICAL  src/domain/deterministicSort.js
IDENTICAL  tests/lint/sovereigntyLightingContract.walker.test.js
IDENTICAL  tests/lint/.lighting-census-baseline.json IDENTICAL  scripts/lib/writer-reach-scan.mjs
IDENTICAL  docs/implementation/PACKET_MANIFEST.json
```

Worktree clean. Base held at `d31af2cee` per the chair's ruling (6).

---

## §0a · Design §13 and the chair's split, read at their source

Taken **on the tree, not on the message**:

```
$ sed -n '<§13>,+14p' docs/DESIGN_EDIT_MODE_AND_DECREES.md
## 13. The phantom consequence rule (the owner, ODQ §934.43; 2026-09-19)
**The rule.** A phantom counterparty can absorb an act but never return one. What leaves comes
back by the estate's own procedures; what is declared is recorded; nothing from outside comes home.
**What a phantom act produces — exactly two things.**
1. **The home procedures.** A force sent against a phantom resolves won or lost … and returns
   through the existing muster, casualty and upkeep mechanics exactly as any returning force does.
   An envoy returns. A caravan returns with neither loss nor gain. …
2. **The record.** The chronicle carries the declaration or the outcome …, marked off-stage.
**What it never produces.** No war state, no treaty, no trade route, no envoy state, no
faction-power or legitimacy shift derived from the phantom. Phantoms never enter the world pulse …
**Consequence is the DM's, as a decree.** … the registry may OFFER it as a follows-from suggestion
(a connection guard with `fulfil`); it never applies it on its own.
**What this simplifies.** … the op catalogue (EM-B1) carries one `consequence` policy per
off-stage op — `home-procedures+record` for a phantom target, `world` for a real save — decided at
apply time by the target's reality; the tick hook (EM-E1) applies that policy and nothing else.
```

```
$ grep -n "Op types" docs/ARCH_EDIT_MODE_AND_DECREES.md
105: … OFF-STAGE (EM-B1b, §13): declare-war, make-peace, open-trade, close-trade, send-force,
recall-force, resolve-outcome (victory/defeat/stalemate/truce). `set-state` is STRUCK …

$ git diff d31af2cee...HEAD -- docs/ARCH_EDIT_MODE_AND_DECREES.md | grep "^+.*stage"
+ *   duration?: number, stage?: 'home'|'off-stage' }} Op */
+// An off-stage op's CONSEQUENCE is decided at apply time by the target's reality (§13):
+// a phantom → the home procedures + the record; a real save → the campaign's machinery.
+ … `consequenceFor(target) → 'home-procedures+record' \| 'world'`      (the phantoms row)
```

⇒ exactly seven off-stage types; the resolver belongs to `phantoms.js` (EM-F1), which is why this
packet declares the policy as data and authors nothing.

**The preamble's amended hazard and STOP, which bind this packet:**

```
$ git diff 02968876b..HEAD -- docs/implementation/preambles/EM-PREAMBLE.md | grep "^+.*PHANTOM\|^+.*phantom-side"
+| HZ-PHANTOM | … a phantom act yields the HOME PROCEDURES … and the RECORD … and never world
+  state; consequence the DM wants is a separate home decree the registry may offer but never
+  applies; a real save routes through the campaign's machinery; …
+…; a phantom-side world state (a war state, a treaty, a route) would appear necessary; or the
+ tier gate would be spelled …
```

---

## §1 · `requiredSymbols` — every row proved present, verbatim

```
1  tests/lint/mutationCoverage.shared.mjs    :: export const ENFORCER_DIRS
1  tests/lint/chooserTotality.walker.test.js :: const SCAN_ROOTS
1  src/domain/deterministicSort.js           :: export const compareCodepoint
```

⚠ **Only three rows, and that is correct rather than thin.** This packet appends rows to a leaf
**EM-B1a creates**, so the machinery it extends (`OP_TYPES`, `makeOp`, `validateOp`) **does not
exist at this base** and cannot be named — the standard refuses a `requiredSymbols` row for a
symbol that is not present at the packet's current status. The dependency is carried by
`Depends on: EM-B1a` and by the preflight's clean non-CREATE target check instead.

---

## §2 · ⛔ THE MUTATION-COVERAGE OBLIGATION, and why it is THIS packet's

```
$ grep -n "ENFORCER_DIRS" -A 2 tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37:  'tests/lint',

$ sed -n '3,8p' tests/lint/mutationCoverage.shared.mjs
 * shared between tests/lint/mutationCoverageManifest.test.js (the meta-test) and …
 *   1. EVERY *.test.js / *.test.jsx under the EIGHT ENFORCER DIRS — those trees …
```

⇒ `tests/lint` is the **first** enforcer dir, and the meta-test asserts every enumerated file owns
an `invariants` entry. This packet adds `tests/lint/opGuardCoverage.walker.test.js`, so it owes
exactly one row — **at compile, in its own change manifest.** ⭐ The chair's split moved the
obligation **with the file that incurs it**: EM-B1a owes nothing.

**The register's measured shape:**

```
$ node -e '<load scripts/mutation-coverage-manifest.json>'
top keys: [ '_doc', 'uncoveredBaseline', 'rationales', 'invariants', 'meta' ]
invariants rows: 704
kinds: rationale,mutation,uncovered

$ ls -la scripts/mutation-coverage-manifest.json
-rw-r--r--  1 cstokes  wheel  471932 … scripts/mutation-coverage-manifest.json
```

**A live `rationale` row, the shape this packet's REGISTER row copies:**

```
"tests/lint/customContentCharsetWiring.test.js": {
  "kind": "rationale",
  "rationale": "THE CHARSET WIRING WALKER (CHARSET Car 2). Its catching power is EXECUTED, not
   claimed, and it was executed as FOUR planted mutations on 2026-09-05, each planted, run under
   the gate mutex, restored by inverse edit and cmp-verified byte-identical against a backup taken
   BEFORE the plant, with the tree left at porcelain 0. (1) Deleting `authoring: false` … reddened
   'the account-import pack lane asks prepareImport for a restore' (TRUE_EXIT 1, 1 failed / 14
   passed). …"
}
```

⇒ **704 → 705**, surgical, and the rationale carries the **executed** account — which is why §8
writes it after the mutants, never before. At ~472 kB a whole-file re-serialisation would bury the
one row that matters, which `PACKET_STANDARD.md` forbids by name.

---

## §3 · The walker shape this packet copies

```
$ grep -n "SCAN_ROOTS" -A 8 tests/lint/chooserTotality.walker.test.js
64:const SCAN_ROOTS = Object.freeze([ 'src/domain/worldPulse', 'src/domain/spatial',
   'src/domain/traditions', 'src/domain/region' ]);
72:const IDIOM_SIGNATURES = Object.freeze({ SOFTMAX_SAMPLE: …, KEYED_RACE: … });
179:const IN_ROOTS = DOMAIN_FILES.filter((rel) => SCAN_ROOTS.some((r) => rel.startsWith(`${r}/`)));
182:function scanIdiomForks(files) { … }
```

⇒ the declared-equals-discovered, both-directions, full-offender-list shape (HB-1's A7/A8) that
B6 copies.

⚠ **The same measurement carries a separate finding:** `SCAN_ROOTS` excludes `src/domain/edit`, so
the decision-fork register does not reach the editor at all. That is EM-A2a's R2, raised there and
not re-raised here.

---

## §4 · The registration ledger

**P2.1 — one new test file plus appended arms:**

```
$ sed -n '515,518p;612p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p))…
      files: TEST_FILES.length,

$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

⇒ `+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles` — four titles from the
appended arms and four from the new walker.

**P2.4 cannot move** (`SURFACE_CLOSURE_STOP` includes `'src/store/'`). **P2.5 not owed** — no
chooser, no pool, no draw. **P2.3 not owed** — no save-time key read.

**Collision:**

```
$ node -e '<load PACKET_MANIFEST.json>; per path …>'
src/domain/edit/operations.js             | holders: 0  | NON-TERMINAL: 0
tests/domain/editOperations.test.js       | holders: 0  | NON-TERMINAL: 0
tests/lint/opGuardCoverage.walker.test.js | holders: 0  | NON-TERMINAL: 0
scripts/mutation-coverage-manifest.json   | holders: 26 | NON-TERMINAL: 0
--- statuses present across all 182 packets: LANDED,SUPERSEDED

ABSENT tests/lint/opGuardCoverage.walker.test.js
```

⭐ All 26 holders of the mutation-coverage manifest are TERMINAL, which is why this packet may
claim its REGISTER row outright. ⚠ The live collision is with **EM-B1a**, which creates the two
shared files.

---

## §5 · ⛔⛔ THE COMBINED-FILE ARITHMETIC — the split did not divide the file

| part | effective |
|---|---:|
| EM-B1a (machinery + eighteen home rows) | 231–249 |
| EM-B1b (seven off-stage rows + policy + imports) | ≈83 |
| **combined `src/domain/edit/operations.js`** | **≈314–332 against a 250 cap** |

`max-lines` is measured **per FILE**, and both packets write the same file. The chair's split
divided the *packets* — which fixed the review surface and the family boundary, and moved the
mutation-coverage obligation cleanly — but it does **not** fix the leaf ceiling.

Three options are costed at the packet's §3: **O1** B1b writes its own leaf
`src/domain/edit/operationsOffStage.js` and B1a composes (**the lane's reading** — the only one
that fits without compressing a row, and it follows the boundary the chair already drew); **O2**
EM-B1c as well, which leaves ≈278–296 and is insufficient alone; **O3** a compact row form, which
is the squeeze the chair forbade and is **recorded to be refused**. **O1 changes EM-B1a's manifest,
so it is the chair's call. RAISED R1.**

---

## §6 · What this lane did NOT do

- Ran **no** vitest, eslint, `npm run check`, or any writing script.
- Wrote **nothing** in `$SP/consist` or `/Users/cstokes/Desktop/settlement-engine`.
- Named **no** symbol it did not prove present (§1), and named **none** of EM-B1a's future symbols.
- Took design §13, the ARCH's amended `Op` typedef and the preamble's amended HZ-PHANTOM **on the
  tree** (§0a).
- **Did not stamp the preamble's hash** (ruling 6).
- Raised **no** budget and invented **no** figure. It **did not squeeze** a row to make the
  combined file fit — it reported the overage and costed the options.
- Adjudicated **nothing**: R1–R3 are listed in the packet's §13 for the chair.

---

## §7 · REVISION 3 — option O1 as the chair shaped it (ruling 2), and just-in-time placement (ruling 3)

**The file cap is resolved.** The lane reported the combined `operations.js` at ≈314–332 against a
250 per-file cap and costed three options. The chair took **O1**, shaped so EM-B1a's manifest does
not move:

| file | packet | effective |
|---|---|---:|
| `src/domain/edit/operations.js` | EM-B1a authors it | 231–249 |
| `src/domain/edit/operationsOffStage.js` | **EM-B1b CREATES it** | ≈83 |
| the composition edit in `operations.js` | EM-B1b | **+2** |

⇒ both leaves inside the cap; the overage is retired; **EM-B1a's change manifest is unchanged.**
O3 (a compact row form) stays recorded as **refused** — it was the squeeze the chair forbade.

⚠ **One consequence the lane names rather than assumes:** `Object.freeze({ ...A, ...B })` freezes
the OUTER map only. B1 therefore asserts the composition AND asserts **both source maps frozen**,
or a row could be mutated through `OFF_STAGE_OP_TYPES` while `OP_TYPES` reported frozen.
**RAISED R2.**

**Placement (ruling 3), re-measured at `e02bf0f26`:**

```
$ node -e '<load PACKET_MANIFEST.json>; holders of the mutation-coverage manifest'
scripts/mutation-coverage-manifest.json | holders 27 | NON-TERMINAL 1  EM-A1:DRAFT
--- statuses present across 187 packets: LANDED,SUPERSEDED,DRAFT,READY
```

⇒ `EM-A1` at DRAFT holds the path, and DRAFT reserves exactly as READY does, so placing this
packet now would red `validate:packets` on the duplicate. **It waits in the chair kit until the
path is free.** Nothing in the contract changes — only the moment of placement.
