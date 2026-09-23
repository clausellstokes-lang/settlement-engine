# Settlement editor / EM-C2 — THE GUARD ENGINE: a pure fold over the pending registry that judges nothing itself, guarantees `proceed` on every guard it returns, and reads the op DECLARATION rather than the flattened `Op`

- **Status:** `READY`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line and takes
  `status` only when exactly one row matches. Every stamp, caveat and date goes on these
  continuation lines, never on the row. The same law binds **Verified base**.
  ⭐ MEMBER of WAVE 2 (the charter's Wave 2 table: EM-C1 the registry · **EM-C2 the guard
  engine** · EM-C3 the rules · EM-C4b the slice's registry actions). Compiled to the SIXTH
  preamble amendment, which is LANDED at this packet's read tip. Every citation is
  `path :: symbol` (§P2.22); no line address is carried anywhere.
  ⛔ EM-C1 IS NOT COMPILED — the per-tick registry cap is the owner's decision point and the
  charter holds EM-C1 behind it. This packet therefore DECLARES the decree ENTRY shape it reads
  (§5, §6) and EM-C1 produces it; nothing here imports `registry.js`.
- **Packet version:** 3
  - **Version 3 (2026-09-23, the Opus PRE-PROOF seat for train EM-T17 stage 1) re-measures
    version 2 against the train's base `a545899ff` and changes only FACTS THAT WERE STALE OR
    UNSTATED. No contract moved, no acceptance case changed, no path was added or removed, the
    §5 clause was not touched (its SHA-256 is unchanged and still byte-identical to EM-C3's),
    and the effective-line figure is still 164.** What changed: (a) the voice walker's own
    literal count read **36**, not the 35 version 2 stated in two places — the `em 0 / bang 0`
    figures the walker actually reds on were and are correct, and the three empty-string
    literals version 2's enumeration omitted are now named; (b) §6 now DECLARES ALL SIX
    TYPEDEFS BY NAME (`ProjectFn`, `GuardContext`, `GuardFinding`, `GuardRule`, `Guard`,
    `GuardVerdict`) and PINS the two vocabulary spellings verbatim, because EM-C3 names four of
    those typedefs type-only and carries the two spellings as `_pendingRequiredSymbols` — of
    the four, version 2's text named only `GuardFinding` and `GuardRule`, so `GuardContext` and
    `ProjectFn` were names EM-C3 imported from a contract that never declared them; (c) the
    TYPE FLOOR's two configs are read and each path is assigned to the one that governs it;
    (d) judgment 196's title law is stated for both test files with its measurement; (e) the
    preamble hash, the register absolutes and the whole J-T1 window are re-measured at
    `a545899ff`. ⛔ ONE THING IS NOT REPAIRED HERE AND IS THE CHAIR'S: EM-C3 v2 states that
    EM-C2 adds `'src/domain/edit/guards.js'` to `tests/build/vendorPdfLazy.test.js`'s
    `editorTrain` roster and leaves a TWELVE-row array. This packet carries no such row and the
    roster is ELEVEN rows at `a545899ff` (§7's note below).
  - **Version 2 (2026-09-23, the same Opus COMPILE seat, resumed) installs THE ONE TEXT of the
    shared §5 rules-interface clause and the mechanics the chair's JUDGMENT 236 adopted with
    it.** Version 1's clause and EM-C3's did not agree byte for byte; the chair ruled the three
    deltas item by item and landed one text. What changed here, and nothing else: (a) §5 carries
    the ONE TEXT verbatim, SHA-256
    `20ff767bc6a53ff5b3f178932017eab9af721b03bc98f65bbd62d100a8576aae` (8,288 bytes), which
    `EM-C3.md` §5 carries byte for byte; (b) a rule declares `needs`, the rule set carries
    `deps`, a rule the caller under-supplied is NOT RUN and its id comes back in `unevaluated`,
    and the RETURN becomes `{ guards, unevaluated }` (§6, and A5 and A8 re-derived); (c)
    `GUARD_KINDS`, `GUARD_OFFERS` and the typedefs stay in `guards.js` — the chair decided
    Delta 3 for the ENGINE on the executed closure measurement — so **EM-C2 LANDS BEFORE
    EM-C3**, which carries `Depends on: EM-C2`. Every instrument was re-run over the version-2
    planted text and the effective-line figure re-measured 151 → **164**. No acceptance case
    was dropped, no non-goal moved, and the three rulings version 1 owed the chair are recorded
    as DECIDED in §12.
  - Version 1 was the first cut at the same tip. It refutes no clause of the charter's row. It
    EXTENDS ARCH §5's three-argument spelling of `evaluateGuards` by one argument, and it
    declines ARCH §5's sentence that guard coverage is "declared per op type in
    `OP_TYPES[type].guards`": both are forced by measurements quoted in §1 and §5, and the
    second was carried to the chair as a ruling rather than decided in the lane.
- **Verified base:** `em-t17-c2-2026-09-23` at `a545899ff55b7e4c3f219b3ca58cd86ddcf0f3cd`
  - The row is already in `parsePacketHeader`'s own shape — `` `<branch>` at `<40-hex sha>` `` —
    so the chair's placement is a one-token substitution of `__BASE__` with the train base's
    SHA, and the lane-branch token follows §P10.1's pattern `em-t<train>-<id lower-case>-<date>`
    (the chair renames it at the placement if the train number or the date moves). Until that
    substitution the header parses `verifiedBase: null`, which is the ONE placement-only error
    the dry validator reports against this packet. REVALIDATION SENTENCE the chair uses: *"Re-measured at `__BASE__`:
    the three CREATE targets are absent, `compareCodepoint`, `OP_TYPES`, `makeOp` and the
    `OpTypeDeclaration.requires` row are each present verbatim at count 1, the lighting
    baseline and `stamp.producerIndexFiles` are re-read live, and `git diff --stat
    1b073009f __BASE__ -- src/domain/edit src/domain/deterministicSort.js tests/domain
    tests/property` is quoted."*
  - ⭐ THE PRE-PROOF EXECUTED THAT SENTENCE AT `a545899ff` (train EM-T17's base = EM-T16's
    landed tip `1b073009f` plus the hygiene commit `d44159dc0`), and every clause of it holds:
    `git diff --stat 1b073009f a545899ff` over EVERY change-manifest path AND EVERY
    `requiredSymbols` path is **EMPTY** — not one path of this packet moved in the window, and
    none of the window's 24 files is an instrument, a config or a register this packet reads.
    The three CREATE targets are ABSENT; the four required symbols read `count=1` verbatim;
    the lighting baseline reads `2697 · 359 · 2338 · 25820 · 6855` and
    `stamp.producerIndexFiles` reads `1190`, both as-of `a545899ff` and neither one this
    packet's prediction. `node scripts/implementation-packets.mjs validate` at `a545899ff`
    prints `valid: 230 packets (0 READY)` and exits 0, so no path of this packet collides with
    a READY member's.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` at SHA-256
  `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d`
  — MEASURED with `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md`, never copied
  from a brief or a sibling packet (§P3.5). Measured first at the compile read tip `1b073009f`
  and RE-MEASURED by the pre-proof at train EM-T17's base `a545899ff`: the same digest, and
  `git diff --stat 1b073009f a545899ff -- docs/implementation/preambles/EM-PREAMBLE.md` is
  EMPTY, so the SIXTH amendment is the law this packet is measured against at its placement.
- **Last revalidated:** `a545899ff55b7e4c3f219b3ca58cd86ddcf0f3cd` — the chair's third stamp, re-written at every re-placement.
- **Depends on:** `NONE`
  - `src/domain/edit/guards.js` imports exactly ONE module, `src/domain/deterministicSort.js`,
    which has been landed since long before this train. EM-C3's rules arrive as this function's
    fourth ARGUMENT and EM-C1's entries as DATA, so neither is a build-time dependency and this
    member can land first, last or alone.
- **Collision group:** `EM-C3` (the shared §5 rules-interface clause, byte-identical in both
  packets) and `EM-C1` (the entry shape §5 declares). NO FILE PATH IS SHARED with either: this
  member's three paths are all CREATEs no sibling names.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Measured at `1b073009f` and RE-MEASURED UNCHANGED at
  `a545899ff`: `tsconfig.full.json` and `tsconfig.domain-strict.json` both report ZERO errors
  on the planted leaf; the voice walker's own counter reads `{em: 0, bang: 0}` over 36 string
  literals; the tuning inventory's own `countUnregisteredNamed` and `countBareDecimals` both
  read `{}`; the any-cast counter reads `{any: 0, suppress: 0}`; the entropy census's
  `createPRNG(` site count and `rngSeed` read count are both 0; the ruin-filter roster's
  `READER_RE` finds no `.institutions` in the planted CODE.
  - ⭐ THE TYPE FLOOR'S TWO CONFIGS, AND WHICH GOVERNS WHICH PATH (measured at `a545899ff` by
    reading both configs, not by running `tsc`): `tsconfig.full.json` includes
    `src/domain/**/*.js`, and `tsconfig.domain-strict.json` (`strict: true`,
    `noImplicitAny: true`) EXTENDS `tsconfig.json`, whose include is also `src/domain/**/*.js`
    — so **BOTH configs govern `src/domain/edit/guards.js`**, and **NEITHER governs this
    member's two test files**, because both configs exclude `tests`. The strict side is a
    per-file ratchet over `scripts/.domain-strict-baseline.json` (total 1113 across 75 files);
    **no `src/domain/edit/` path carries a row there**, so a ZERO-error new leaf owes the
    baseline no row and the file is never a change-manifest path.

## 1. Reconciled authority

1. THE OWNER, ODQ §934.36–§934.42 — the editor is built now; guards come before the surfaces
   (design §7: *"Build C before D: the guards are the game"*).
2. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` — **§12 GOVERNS**. §12.8 is this member's charter in
   one sentence: the initial kinds are prerequisite · totality · contradiction · contention ·
   connection, the range rule is DROPPED, and *"`evaluateGuards` FOLDS: each entry is judged
   against the world with every earlier entry applied (a synthesized post-op world), which is
   also what makes the property test non-vacuous on queues longer than one."* §12's product
   rulings add *"Guards judge folded worlds, so a queue of one and a queue of ten are judged
   alike."* §2.7 (three offers, never refusing), §2.7a (connection and the follows-from link),
   §11 (contention on one field; scheduling orders by `when` then `orderIndex`), §18 (an op's
   `requires` has TWO KINDS and the two are handled by different parts of the editor).
3. `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1, §2 (the `Guard` typedef), §5 (the guard engine),
   §6 (the property: any registry the guards accept applies without contradiction, and
   `proceed` always applies).
4. `docs/implementation/charters/EDIT-MODE-TRAIN.md`, the Wave 2 row for EM-C2 (identical on
   the read tip and on the ledger branch's live copy, measured).
5. `docs/implementation/preambles/EM-PREAMBLE.md` (the SIXTH), above all §P2.21 (the instrument
   list a new `src/domain` leaf meets), §P2.13 (the wiring census), §P2.1 (the lighting census),
   §P4 (coupling and the reader law), §P8 (the STOP conditions), §P9 (the effective-line
   instrument, the six capsule-shape rules, the count prover).
6. THE CODE AT `1b073009f`: `src/domain/edit/operations.js`, `src/domain/edit/types.js`,
   `src/domain/deterministicSort.js`, `tests/lint/opGuardCoverage.walker.test.js`,
   `tests/lint/flavorFields.census.test.js`.

Resolved contradictions:

- **ARCH §5 — "Coverage is declared per op type in `OP_TYPES[type].guards` and stated when
  empty"** -> MEASURED FALSE OF WAVE 2, and the sentence is not acted on here.
  `tests/lint/opGuardCoverage.walker.test.js` case C7 pins BOTH that
  `Object.keys(OP_TYPES).filter((t) => OP_TYPES[t].guards.length > 0)` is empty AND that every
  row's `guardsStated` still matches `/\bno guard\b/i`; every one of the catalogue's 22 rows
  reads `guards: []` with a non-empty statement (executed, §measure-catalogue.log:
  `ROWS_WITH_GUARDS=0`, `ROWS_WITHOUT_STATEMENT=0`). Populating that array is therefore a MODIFY
  of `src/domain/edit/operations.js` PLUS a widen of that walker, and the charter's Wave 2 rows
  for EM-C2 and EM-C3 name neither file. The rules reach the engine as its fourth argument
  instead (§5's shared clause item 1). The population itself is §12's ruling 1 for the chair.
- **ARCH §5 — `evaluateGuards(registry, world, catalogue)`** -> EXTENDED BY ONE ARGUMENT,
  `ruleSet`, for the same measurement. The three named arguments keep their names, their order
  and their meanings; nothing is renamed.
- **Design §2.7 — `evaluateGuards(queue, world) -> [{ entryId, kind: 'prerequisite' |
  'contradiction' | 'duration' | 'range', ... }]`** -> SUPERSEDED BY §12.8, which GOVERNS: the
  kinds are the five, and `duration` and `range` are dropped until a count table exists.
- **Design §2.7 — `evaluateGuards(queue, world) -> [ … ]`, a bare array** -> SUPERSEDED by the
  §5 clause, deliberately and in BOTH packets (the chair's judgment 236 adopting EM-C3's items
  10 and 11): the return is `{ guards, unevaluated }`, because ARCH §5's "coverage is stated
  when empty" is worth nothing at run time if a rule the caller under-supplied simply vanishes.
- **ARCH §5 — the rules reach the engine somehow** -> they reach it, with their injected
  dependencies, on the fourth argument: `{ rules, project, deps }`. The two generator writers
  are INJECTED because `tests/build/domainGeneratorsBoundary.test.js` is a landed shrink-only
  ratchet that a `src/domain/edit -> src/generators` specifier reds, static or dynamic
  (measured by the EM-C3 seat; adopted here by the chair's judgment 236).
- **Design §2.7 — offers `['fulfil','self','proceed']`** -> WIDENED BY §2.7a and §11, which add
  `reorder` (connection) and `keepFirst`/`keepLast`/`keepBoth` (contention). ARCH §2's `Guard`
  typedef already carries all seven; this packet freezes exactly those seven as `GUARD_OFFERS`.
- **ARCH §2's `Guard` typedef** -> EXTENDED by three fields with their reasons in §6: `id`
  (an entry's `overrode` records guard IDS, so something must mint them), `ruleId` (the
  op-coverage instrument and the registry page both want to know which rule spoke) and
  `overridden` (the registry page's badge). Nothing is removed. This is the same deliberate
  extension EM-A1's `types.js` already records against ARCH §2.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** `src/domain/edit/guards.js` exports `evaluateGuards(registry, world,
catalogue, ruleSet)`, which returns a frozen `{ guards, unevaluated }` for a decree registry's
PENDING entries: `guards` is the ordered list, each entry judged against the world with every
earlier pending entry applied, every guard carrying a stable id and the `proceed` offer, and
every guard whose id the entry already recorded in `overrode` marked `overridden: true`;
`unevaluated` names the rules the caller under-supplied, so unfinished coverage is stated at
run time instead of vanishing.

**Definition of done:** the engine, its eight acceptance cases and its two new test files are
green; the leaf imports one module, reads no settlement field, mints no stream, moves no
register but the two the terminal re-derives, and lands with ZERO importers behind the tier
gate's dark door.

In scope:

1. THE FOLD, THE ORDER AND THE DISPATCH — pending entries only, in `when` → `orderIndex` →
   season → id order; one folded world per entry; the rules that apply to each entry's op type,
   run in codepoint order of their ids.
2. THE GUARD's SHAPE AND ITS IDENTITY — the closed `GUARD_KINDS` and `GUARD_OFFERS`
   vocabularies, the minted stable guard id, the `proceed` guarantee, the override mark.
3. THE PREVENTION — the two new test files, whose arms hold the engine to the measured
   behaviour and, above all, to reading `ctx.decl.requires.registry` rather than
   `ctx.op.requires` (§5, the measurement in §0 below).

Explicit non-goals:

- **THE RULES.** No prerequisite, totality, contradiction, contention or connection LOGIC is
  written here. `checkStructuralValidity`, `GATE_FEATURES`, `renormalizeFactionPower`,
  `conflictsWith` and `relatedTo` are EM-C3's; this packet imports none of them and names none
  of them as a required symbol.
- **THE REGISTRY.** No `stage` / `reorder` / `withdraw` / `reopen` / `markApplied` /
  `revertTick` / `resolveDecree`, and no persisted key: EM-C1's, behind the owner's decision
  point.
- **THE STORE AND THE SURFACES.** No `selectGuards`, no memoization, no `editSlice` edit, no
  component: EM-C4b's and wave 4's.
- **THE TICK.** No application, no chronicle line, no `overrode` WRITE: the engine reads
  `overrode` and never writes it (EM-C1 and EM-E1 own the write).
- **`OP_TYPES[type].guards`.** Not populated, not read, not widened. §12 ruling 1.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | This packet |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0 or 1` | 0 |
| Named state writers | `0 or 1` | 0 |
| Feature flags | `0 or 1` | 0 |
| User-facing surfaces | `0 or 1` | 0 |
| Direct consumers | `<=2` | 0 |
| New logic-bearing production leaves | `<=2` | 1 |
| Existing logic-bearing production files modified | `<=3` | 0 |
| Additional registration-only files | `<=3` | 0 |
| Handwritten files total | `<=12` | 3 |
| New/changed effective production lines | `<=400` | 164 |
| Effective lines per new leaf | `<=250` | 164 |
| Delta in a shared/hot file | `<=15` | 0 |
| Acceptance cases | `<=8` | 8 |

Overrides approved before dispatch: `NONE`.

THE EFFECTIVE-LINE INSTRUMENT IS ESLINT'S OWN `Linter` under `max-lines` with `skipBlankLines`
and `skipComments` (§P9), run in plain node over the planted text: **164** effective lines from
365 raw. Never `wc -l`, never a hand convention.

Exceeding any limit is a STOP and split, not an invitation to renegotiate.

## 4. Sealed dispatch and preflight

Run from the packet's worktree before any edit:

```sh
npm run implementation:dispatch -- EM-C2
```

Expected:

- exact packet Markdown and structured capsule are emitted;
- verified-base ancestry and unchanged declared substrate are proven before the seal pins exact
  HEAD;
- **all three targets are CREATEs and all three are ABSENT** (measured at `1b073009f`:
  `src/domain/edit/guards.js`, `tests/domain/editGuards.test.js` and
  `tests/property/guardsAcceptApplies.test.js` each `ABSENT`), and the four required symbols
  resolve verbatim;
- Git-visible foreign dirt is fingerprinted without target overlap, and the seal lives outside
  project files in Git administrative storage.

Any mismatch makes this packet STALE. Stop before coding.

Edit only exact-manifest paths.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| State authority | `src/domain/edit/operations.js` | `OP_TYPES` | 22 frozen rows at the tip; each carries `requires: { world, registry }`, `enables`, `relatedTo`, `conflictsWith`, `duration`, `guards: []` and a non-empty `guardsStated` (executed: `ROWS=22`, `ROWS_WITH_GUARDS=0`) | The CATALOGUE argument. Read rows, never written, never imported by the leaf |
| Sole writer | (none) | (none) | This member writes no state at all | No mutation path exists to abuse |
| Reader | `src/domain/edit/operations.js` | `makeOp` | FLATTENS `requires` — `makeOp('promote-phantom', …).requires` reads `["found-phantom"]` and `makeOp('remove-npc', …).requires` reads `["npcPresent"]` (executed) | The tests build ops with it; the ENGINE never reads `op.requires` |
| Normalizer/absence | `src/domain/deterministicSort.js` | `compareCodepoint` | `export const compareCodepoint = (a, b) => {`, count 1 | The ONLY import. Every string order in this leaf is its order |
| Lifecycle | `src/domain/edit/types.js` | `Op` | The rigid ten-field `Op` typedef EM-A1 landed; `requires` on it is `readonly string[]`, the FLAT form | Named type-only in the engine's JSDoc; the file is NOT modified |
| Receipt/audience | `tests/lint/opGuardCoverage.walker.test.js` | case C7 | Pins the empty `guards` roster AND the `no guard` sentence on every row | Must stay GREEN: this member populates neither |
| Test precedent | `tests/domain/editOperations.test.js` | `describe('EM-B1a — the fourteen home ops, one constructor, one validator', …)` | A `tests/domain` battery over a frozen `src/domain/edit` catalogue: straight-line literal `it`s under ONE literal `describe`, its own `vitest` import | Copy this proof shape for `tests/domain/editGuards.test.js` |
| Test precedent | `tests/property/dmLayerGoldenIsolation.test.js` | its `describe` | A `tests/property` file over `src/domain/edit`; collects over a corpus and asserts ONCE (the `seedLoopTotality` law) | Copy this proof shape for `tests/property/guardsAcceptApplies.test.js` |

Forbidden alternatives:

- no second graph, ledger, classifier, time source, PRNG stream, or writer;
- no new top-level `worldState` key;
- no direct edits to `src/domain/edit/operations.js`, `src/domain/edit/types.js`,
  `src/domain/edit/fieldDeclarations.js`, `tests/lint/opGuardCoverage.walker.test.js`, or any
  register baseline;
- no import of `src/generators/**` from this leaf (`tests/build/domainGeneratorsBoundary.test.js`
  is a landed shrink-only ratchet whose live count is 5 of 5 — a static OR dynamic generator
  specifier from `src/domain/edit/**` reds it);
- no files outside the manifest.

### THE DECREE ENTRY SHAPE THIS MEMBER READS (EM-C1 produces it)

EM-C1 is not compiled, so the engine declares the entry fields it READS and treats everything
else as opaque. From design §2.5 / §2.5a, ARCH §2's `Decree` typedef and ARCH §1's registry row:

```js
/** The fields of ONE decree entry that the guard engine reads. EM-C1's `Decree` carries more
 *  (`addedBy`, `orderedAt`, `appliedAt`, `tickRef`, `chronicleRef`, `followsFrom`,
 *  `surveyorCredit`, `withdrawnReason`); the engine neither reads nor forwards them. */
{
  id: string,                       // non-empty; half of every guard id minted for this entry
  op: Op,                           // `makeOp`'s output; only `op.type` is read by the engine
  status: 'pending'|'applied'|'withdrawn',   // ONLY 'pending' is judged
  orderIndex: number,               // the registry's own order; absent or non-finite reads 0
  when?: { tick?: number, season?: string }, // absent means the next advance (design §11)
  overrode?: string[],              // guard ids the DM already proceeded past
}
```

An entry that is not a plain object, or that lacks a non-empty string `id`, or whose `op` is not
a plain object with a string `type`, is NOT JUDGED. Design §9 is the tie-break: *"a false
warning costs more trust than a missing one."*

### THE RULES INTERFACE (EM-C2 · EM-C3, one clause in both packets)

⛔ The fenced block below is THE ONE TEXT the chair landed (judgment 236) and it is
BYTE-IDENTICAL in `EM-C3.md` §5. Its SHA-256 is
`20ff767bc6a53ff5b3f178932017eab9af721b03bc98f65bbd62d100a8576aae` (8,288 bytes), printed by
this packet's count prover so the chair can compare the two copies without reading either; the
same text stands alone in the kit as `SHARED-CLAUSE.final.md`. **A byte that differs between
the two packets is a STOP at either placement and at either build (§11).**

Its history, for a reader who finds only one packet: version 1's draft
(`80f9dcf3…3f721`, 5,515 B) and EM-C3's (`5eb6aa67…14d64`, 7,643 B) agreed on items 1, 2, 3,
6, 7 and 8 and differed in three places. The chair ruled them item by item — Delta 1 (`needs`)
and Delta 2 (`deps`, the skipped-rule report, the pair return) ADOPTED from EM-C3's wording
verbatim as items 4, 5, 10 and 11; Delta 3 (where the vocabularies live) decided for the
ENGINE on the executed closure measurement, which is why item 9 carries the value half and why
EM-C2 lands before EM-C3.

```text
THE RULES INTERFACE (EM-C2 · EM-C3, one clause in both packets).

1. THE ENGINE TAKES ITS RULES AS AN ARGUMENT AND IMPORTS NO RULE.
   `evaluateGuards(registry, world, catalogue, ruleSet)` — ARCH §5's three-argument spelling
   EXTENDED BY ONE, because the rules cannot reach the engine any other way that measurement
   allows: `src/domain/edit/guards.js` imports only `../deterministicSort.js`, so EM-C2 lands
   with no edge to EM-C3 and each member's battery is provable alone.
   `EMPTY_RULE_SET` (exported by `guards.js`) is the absence value:
   `{ rules: [], project: null, deps: {} }` — the three keys of item 7's projector, item
   10's injected dependencies and the rule list itself.

2. THE CATALOGUE IS ALSO AN ARGUMENT, AND IT IS `OP_TYPES` (`src/domain/edit/operations.js`).
   The engine passes it through to each rule as `ctx.catalogue` and passes the row for the
   entry's own op type as `ctx.decl`. Neither member reads the catalogue's `guards` array:
   `tests/lint/opGuardCoverage.walker.test.js` C7 pins every row's `guards: []` AND its "no
   guard is wired here" sentence, so a population of `OP_TYPES[type].guards` is a MODIFY of
   `operations.js` plus a widen of that walker, and neither is in either member's charter row.
   Guard COVERAGE therefore stays declared where the walker already reads it, and EM-C3's own
   suite proves its rule roster's op-type keys are a SUBSET of `Object.keys(OP_TYPES)`.

3. ⛔ A RULE READS `ctx.decl.requires.registry`, NEVER `ctx.op.requires`.
   `makeOp` FLATTENS the declaration's `{ world, registry }` pair into one array, so
   `op.requires` of `remove-npc` and of `set-npc-status` reads `['npcPresent']` — a WORLD
   predicate that design §18 rules is not a guard's business at all (it decides which seals a
   card OFFERS). MEASURED at the tip through the planted engine: a rule reading `op.requires`
   emits 5 prerequisite guards over the 22-row catalogue where a rule reading
   `decl.requires.registry` emits 3, and the 2 extra are exactly `remove-npc` and
   `set-npc-status`.

4. ONE RULE.
   `{ id: string, appliesTo: readonly string[]|null, needs: readonly string[], evaluate: (ctx)
   => GuardFinding|readonly GuardFinding[]|null }`. Every field is REQUIRED on every rule
   (EM-B1a's law for the catalogue's rows, kept here): `appliesTo` is a list of op types or
   `null` for every type, `needs` is the list of item 10's dependency names the rule uses (`[]`
   when it uses none), and an OMITTED key is not an absence value — its rule is skipped. `id`
   is unique across the rule set, stable across versions, and is half of a guard's id, so
   renaming one orphans an override the DM already recorded. Rules run in `compareCodepoint`
   order of their ids.

5. ONE CONTEXT (`ctx`), frozen, built by the engine:
   `{ entry, op, decl, index, world, folded, priorEntries, laterEntries, entries, catalogue,
   deps }`. `world` is the world as it stands; `folded` is §12.8's world with every EARLIER
   pending entry applied; `priorEntries` / `laterEntries` / `entries` are the pending entries in
   the engine's own order. A rule reads and returns; it writes nothing it was handed.

6. ONE FINDING.
   `{ kind, message, offers?, fulfil?, relatedEntryId?, facet? }`. `kind` is one of
   `GUARD_KINDS` = connection · contention · contradiction · prerequisite · totality (design
   §12.8: the range rule is DROPPED). `message` is a non-empty string in the herald's voice.
   `offers` are members of `GUARD_OFFERS` = fulfil · keepBoth · keepFirst · keepLast · proceed
   · reorder · self, in the order a reader should see them; the engine dedupes them, drops any
   member outside the vocabulary and APPENDS `proceed` when the rule left it out, so no rule
   can mint a refusal. `fulfil` is an `Op` (built by `makeOp`) or absent. `relatedEntryId`
   names the other entry in a two-entry finding. `facet` is the rule's own discriminator when
   it yields more than one finding for one (entry, related) pair; the guard's id is
   `<ruleId>:<entryId>:<relatedEntryId or ->:<facet or ->`, so a rule that omits a needed
   facet gets an ordinal rather than a collision, and every finding survives.
   A finding that is not a plain object, or whose `kind` is outside `GUARD_KINDS`, or whose
   `message` is not a non-empty string, is SKIPPED: design §9 rules that a false warning costs
   more trust than a missing one, and a guard is a suggestion either way.

7. `project` IS THE FOLD, AND IT IS THE RULE SET'S.
   `ruleSet.project(world, op, catalogue) => world` is pure and returns a NEW world; returning
   `undefined` or `null` leaves the world where it was, and a rule set with `project: null` is
   judged against the world as it stands for every entry (measured: `ctx.folded === world`
   identically). The engine never synthesises a post-op world itself — only a rule knows what
   an op does to the fact it judges, and a world the engine invented would be a fiction every
   rule then read as truth.

8. NEITHER MEMBER THROWS, AND THE ENGINE DOES NOT CATCH.
   `evaluate` and `project` are contracted TOTAL: no throw, no clock, no PRNG, no locale, no
   store, no I/O. The engine wraps neither in a `try`, because a swallowed throw is a guard
   that silently stopped guarding; EM-C3's suite proves totality over the whole catalogue.

9. THE TYPEDEFS LIVE IN `guards.js`, AND `guardRules.js` NAMES THEM TYPE-ONLY.
   `/** @typedef {import('./guards.js').GuardRule} GuardRule */` and its kin erase at emit and
   create no runtime edge, which is the same idiom `operationsOffStage.js` already uses to
   name `operations.js`'s types without an import cycle. `src/domain/edit/types.js` is NOT
   modified by either member: a second member's rows on a landed leaf buy nothing here.
   ⭐ AND THE TWO VALUE VOCABULARIES LIVE THERE TOO, WHICH FIXES THE ORDER. `GUARD_KINDS`
   and `GUARD_OFFERS` are VALUE exports of `guards.js` and `guardRules.js` IMPORTS them at
   run time (judgment 236, from the executed closure measurement): on the engine its whole
   static closure is itself plus `deterministicSort.js`, two modules, provable alone and
   landable on any train; on the rules the engine would pull `guardRules.js` and the
   22,393-byte `src/data/spatialData.js` leaf it reads `GATE_FEATURES` from, and be
   unbuildable until EM-C3 lands. The engine defines the interface and a rule set
   implements it, so EM-C2 LANDS BEFORE EM-C3, which carries `Depends on: EM-C2`.

10. ⛔ THE TWO GENERATOR WRITERS ARE INJECTED, AND THAT IS MEASURED RATHER THAN CHOSEN.
   `ctx.deps` is `{ checkStructuralValidity, renormalizeFactionPower }`, frozen, supplied by
   the engine's CALLER from OUTSIDE `src/domain/**`. `GUARD_RULE_DEPENDENCIES` (exported by
   `guardRules.js`) names them in `compareCodepoint` order. WHY: `tests/build/
   domainGeneratorsBoundary.test.js` freezes four domain-to-generators edges and pins their
   count at five, and it matches a DYNAMIC specifier as well as a static one; a planted
   `guardRules.js` that imports either writer takes its arm 1 to `NEW importer:
   src/domain/edit/guardRules.js -> ...` and its arm 3 to 7 (static) or 6 (dynamic), while the
   injected plant leaves both arms exactly where the tip has them. The instrument's own message
   names the cure, and design §22.3 item 6 ruled the principle for the band ladders: invert, do
   not widen. `GATE_FEATURES` is NOT injected — it already lives in `src/data`.

11. A RULE WHOSE `needs` ARE UNMET IS NOT RUN, AND THE ABSENCE IS REPORTED.
   The engine checks `rule.needs` against `Object.keys(deps)` before calling `evaluate`, skips
   the rule when a name is missing, and returns the skipped ids as `unevaluated`, sorted by
   `compareCodepoint`. It never substitutes a stub, never throws and never reports a guard the
   rule did not make: ARCH §5's "coverage is stated when empty" is a RUNTIME statement here as
   well as a catalogue one, so a mis-wired caller is visible rather than silently guard-free.
   The engine's return is therefore `{ guards, unevaluated }`, both frozen: `guards` in the
   fold order, `unevaluated` the skipped rule ids in `compareCodepoint` order. Design
   §2.7's bare array spelling is superseded by this clause, deliberately and in both
   packets.
```

## 6. Exact contracts

### Inputs and outputs

```js
/**
 * @param {unknown} registry  the decree registry (EM-C1's array). A non-array yields no guards.
 * @param {unknown} world     the world as it stands, with everything already applied applied.
 * @param {unknown} catalogue the op catalogue (`OP_TYPES`). A non-object yields `decl: null`
 *                            on every entry; an unknown op type yields `decl: null` on that one.
 * @param {unknown} ruleSet   `{ rules, project, deps }`. Absent, or not a plain object, reads
 *                            as `EMPTY_RULE_SET`; a non-array `rules` reads as `[]`; a
 *                            `project` that is not a function reads as `null`; a `deps` that
 *                            is not a plain object reads as `{}`.
 * @returns {GuardVerdict} `{ guards, unevaluated }`, the pair FROZEN and each half frozen.
 *                            `guards` is ordered by the fold, then by rule id in codepoint
 *                            order, then by the order the rule yielded its findings.
 *                            `unevaluated` is the ids of the rules whose `needs` the caller
 *                            did not supply, DEDUPED and in codepoint order.
 */
export function evaluateGuards(registry, world, catalogue, ruleSet)

export const GUARD_KINDS   // frozen: connection, contention, contradiction, prerequisite, totality
export const GUARD_OFFERS  // frozen: fulfil, keepBoth, keepFirst, keepLast, proceed, reorder, self
export const EMPTY_RULE_SET // frozen: { rules: [], project: null, deps: {} }
```

⛔ **THE TWO VALUE VOCABULARIES ARE SPELLED VERBATIM, BECAUSE A SIBLING'S `requiredSymbols`
ROW IS RE-MEASURED AGAINST THE CODE AND NOT AGAINST THIS CONTRACT (judgment 151).** The leaf
spells them, character for character:

```js
export const GUARD_KINDS = Object.freeze(
export const GUARD_OFFERS = Object.freeze(
```

EM-C3's capsule carries exactly those two strings as `_pendingRequiredSymbols` rows against
`src/domain/edit/guards.js`, to be discharged into `requiredSymbols` and re-measured with
`grep -c -F` at ITS placement. Measured against the planted text: `count=1` each. A member that
wrote `export const GUARD_KINDS = /** @type {const} */ (Object.freeze(` instead would satisfy
this packet's prose and REFUSE EM-C3's discharge, which is the whole shape of judgment 151.

⛔ **THE SIX TYPEDEFS THE LEAF DECLARES, BY NAME**, because `guardRules.js` names FOUR of them
type-only (`/** @typedef {import('./guards.js').GuardRule} GuardRule */` and its kin, §5 clause
item 9) and a type-only import of a name this leaf never declared is a `tsc` error under BOTH
configs at EM-C3's build, not at its placement:

| typedef | what it names | named type-only by `guardRules.js` |
|---|---|:-:|
| `ProjectFn` | `(world, op, catalogue) => unknown`, the rule set's fold (§5 clause item 7) | YES |
| `GuardContext` | the frozen `ctx` of §5 clause item 5; `decl` is `Record<string, unknown>\|null` and `folded` is `unknown`, so a rule narrows them through its own predicate rather than casting | YES |
| `GuardFinding` | what a rule returns (§5 clause item 6) | YES |
| `GuardRule` | one rule (§5 clause item 4) | YES |
| `Guard` | the normalised guard of the state schema below | no |
| `GuardVerdict` | `{ guards, unevaluated }`, this function's return | no |

`Op` is re-exported by neither: the leaf names it `/** @typedef {import('./types.js').Op} Op */`,
type-only, and `src/domain/edit/types.js` is NOT modified by this member.

⭐ **THE `needs` CHECK IS ON THE WIRING, NOT ON THE QUEUE, AND THAT IS DELIBERATE.** It runs
once over the rule set before the fold, so a rule the caller under-supplied is reported whether
or not this particular registry would have reached it — what is wrong is the CALLER, and an
empty registry must not hide it (measured: with no `deps` and an empty registry, `guards` is
empty and `unevaluated` still reads `["also","wired"]`). A rule that OMITS `needs` entirely is
a different thing: it is malformed, `isRule` refuses it, and it appears in NEITHER half.

### State schema

```js
/** ONE guard. Frozen. ARCH §2's typedef plus `id`, `ruleId` and `overridden`. */
{
  id: string,               // `<ruleId>:<entryId>:<relatedEntryId or ->:<facet or ->`, plus
                            // `:<n>` for the nth finding under one identity beyond the first
  entryId: string,          // the pending entry this guard is about
  ruleId: string,           // which rule spoke
  kind: string,             // a member of GUARD_KINDS
  message: string,          // non-empty, the herald's voice; the rule authored it
  offers: readonly string[],// non-empty, deduped, members of GUARD_OFFERS, ALWAYS incl. 'proceed'
  fulfil: Op|null,          // the op "fulfil it for me" would stage, or null
  relatedEntryId: string|null, // the other entry, or null
  overridden: boolean,      // this guard's id is in the entry's `overrode`
}

/** THE VERDICT. Frozen, and both halves frozen. */
{
  guards: readonly Guard[],      // the fold order, then rule id, then the rule's own order
  unevaluated: readonly string[],// the ids of rules whose `needs` the caller did not supply,
                                 // deduped and in `compareCodepoint` order
}
```

Absence rules:

- **absent `when`**: the entry is due at the next advance and sorts FIRST (design §11).
- **absent `orderIndex`, or a non-finite one**: reads `0`.
- **absent `overrode`, or a non-array one**: reads `[]`; no guard is `overridden`.
- **absent `offers` on a finding**: the guard offers exactly `['proceed']`.
- **absent `fulfil` on a finding**: the guard's `fulfil` is `null`, never omitted.
- **absent `relatedEntryId` / `facet`**: the id carries `-` in that position.
- **`null` `appliesTo` on a rule**: the rule applies to EVERY op type. An OMITTED `appliesTo`
  is not an absence value: the rule is malformed and is skipped silently.
- **empty `needs` on a rule (`[]`)**: the rule uses no injected dependency and always runs. An
  OMITTED `needs` is not an absence value either: the rule is malformed and is skipped
  silently, appearing in NEITHER `guards` nor `unevaluated`.
- **absent `deps` on the rule set, or a non-object one**: reads `{}`, so every rule with a
  non-empty `needs` lands in `unevaluated` and none of them runs.
- **empty `rules`**: no guards and no `unevaluated`, and that is the honest answer design §9
  asks for ("no rule, no guard, and the absence is stated").
- **invalid legacy input**: never throws. A malformed registry, entry, rule or finding is
  skipped at the narrowest scope that can skip it.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| a registry | an entry with `status: 'pending'` | well-formed (`id`, `op.type`) | judged at its fold position | zero or more `Guard`s |
| a registry | an entry with `status: 'applied'` or `'withdrawn'` | — | NOT judged, NOT folded | none |
| a pending entry | a rule whose `appliesTo` covers `op.type` | `evaluate` returns a well-formed finding | a `Guard` is minted | the guard's id |
| a pending entry | a rule's finding with no `proceed` | — | the offer is APPENDED | `offers` ends `proceed` |
| a pending entry | a finding whose identity is already taken | — | an ordinal is appended to the id | both guards survive |
| a pending entry | its `overrode` holds this guard's id | — | the guard is still returned | `overridden: true` |
| a rule set | a well-formed rule whose `needs` are all keys of `deps` | — | the rule runs on every entry it applies to | its guards |
| a rule set | a well-formed rule with a `needs` name `deps` lacks | — | the rule is NOT RUN, on any entry | its id in `unevaluated` |
| a rule set | a rule with no `needs` key at all | — | malformed: refused by `isRule` | neither half |

### Ordering and precedence

- **Pipeline/tick position:** NONE. This is a pure function with no host; EM-C4b's
  `selectGuards` and wave 4's registry page are its callers.
- **Fold order (design §11):** `when` class ascending (0 absent, 1 tick-scheduled, 2
  season-only), then `when.tick` ascending, then `when.season` by `compareCodepoint`, then
  `orderIndex` ascending, then `id` by `compareCodepoint`. Executed over a shuffled five-entry
  fixture: `["v","z","w","x","y"]`.
- **Same-entry visibility:** entry `i` is judged against the world with entries `0..i-1`
  projected; entry `0` is judged against `world` itself.
- **Merge/replace/deduplicate:** offers are deduped, keeping the rule's first occurrence.
  Guards are never deduped: two findings under one identity take an ordinal.
- **Tie-break:** rules by `id` in `compareCodepoint` order; within one rule, the order it
  yielded its findings.

### Determinism

- **Hash/fork key:** NONE. This leaf mints no stream and takes no draw (executed:
  `createPRNG(` site count 0, `hash01(` 0, `fnv1a32(` 0, `rngSeed` reads 0).
- **Stable enumeration:** `compareCodepoint` everywhere a string orders; numbers compare
  numerically.
- **Rounding/clamping:** NONE.
- **No-draw behavior:** the whole leaf. Two evaluations of one registry return equal guard ids
  (executed: `STABLE=true`).

### Flag and dormancy

- **Flag:** NONE. The leaf lands DARK by having ZERO importers, which is stronger than a flag:
  no reachable code path calls it until EM-C4b wires it behind
  `TIER_GATE[tier].settlementEditor` and its staff conjunct (§P11.1).
- **Gate / Absent / False / True:** not applicable; no flag is read.
- **Golden posture:** UNCHANGED. `tests/property/generatorGoldenMaster.test.js` and
  `tests/property/dossierProseManifest.test.js` cannot move: the leaf is not in any generation
  path and nothing imports it.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| the engine creates NOTHING; guards are values, never records | reads only what it is handed | persists NOTHING; a guard is recomputed, never stored | re-running on a reloaded registry yields the same ids (the id is derived, never counted) | regeneration does not call it | a rewind returns entries to `pending` and the engine judges them again; ids are unchanged | the two persisted keys never travel, and this member adds no key to carry | guards never cross the veil: nothing here writes to a record, and `overrode` (EM-C1's field) is the only persisted trace |

### Receipts and privacy

- **Closed kinds:** `GUARD_KINDS` (five) and `GUARD_OFFERS` (seven), both frozen and exported.
- **Address chain:** `guard.id` → `ruleId` + `entryId` (+ `relatedEntryId`, `facet`); an
  entry's `overrode` holds exactly these ids.
- **Numeric-to-word bands:** NONE; this leaf renders no number and owes prose-numerics nothing.
- **DM-only fields:** NONE.
- **Player/public projection:** not reached; guards are computed inside edit mode only.

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: the engine reads no actor and no alignment; the rules do.`
- **Edit story:** `ENGINE-ONLY: this leaf is the machinery behind an existing DM verb (staging
  a decree). It adds no verb and no proposal path.`

### User-facing copy

`NONE.` Every `message` a reader sees is authored by a RULE (EM-C3) or by the surfaces; this
packet spells no user-facing word. Its **36** string literals are the two closed vocabularies,
the `'pending'` status, the `'-'` id absence, the `':'` join, the three EMPTY strings the season
reader and the id template contribute, the type-predicate `typeof` words and its one import
specifier. MEASURED with the voice walker's OWN counter (its `stringLiteralContents` over
espree, template quasis included) at `a545899ff`: `36 literals, {em: 0, bang: 0}`.
⭐ THE WALKER'S SCOPE, MEASURED: tier 2 scans `src/data/*.js` and `src/domain/**/*.js`, so this
member's ONE scanned path is the leaf; its two test files are outside every tier. And the
`src/generators` em budget — 28 of 28 in `tests/copy/.voice-mechanics-generators-baseline.json`,
with zero headroom — is UNTOUCHED: this member spells no literal in any `src/generators` file,
because it creates and modifies none. **This member's `src/generators` em-dash count is 0.**

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/guards.js` | `evaluateGuards`, `GUARD_KINDS`, `GUARD_OFFERS`, `EMPTY_RULE_SET` | `164 eff` | The engine exactly as §6 contracts it, returning `{ guards, unevaluated }` and checking each rule's `needs` against `ruleSet.deps` ONCE, before the fold. ONE import, `../deterministicSort.js`. No generator import (the boundary ratchet), no `.institutions` read, no `createPRNG`, no top-level `UPPER_SNAKE = <number>`, no bare decimal in code, no em dash or exclamation point in any string literal, and ZERO `@type {any}` or `{*}` (the any-cast ratchet holds a new file at zero). Every door is `unknown` narrowed by a TYPE PREDICATE. ⛔ **TWO SPELLINGS ARE VERBATIM, NOT PARAPHRASABLE** (§6, judgment 151): the file spells `export const GUARD_KINDS = Object.freeze(` and `export const GUARD_OFFERS = Object.freeze(`, which are EM-C3's two `_pendingRequiredSymbols` rows, re-measured with `grep -c -F` at ITS placement. ⛔ **IT DECLARES ALL SIX TYPEDEFS BY NAME** — `ProjectFn`, `GuardContext`, `GuardFinding`, `GuardRule`, `Guard`, `GuardVerdict` — because `guardRules.js` names four of them type-only and a missing one is a `tsc` error under both configs at EM-C3's build. All six are JSDoc, so `max-lines` with `skipComments` counts none of them and the `164 eff` figure does not move. |
| `CREATE` | `tests/domain/editGuards.test.js` | A1 to A7 | `n/a` | Adds exactly SEVEN literal `it`s, one per sealed case A1 to A7, under ONE literal `describe`. Straight-line registration, its own `vitest` import, and no variable or parameter named `it`, `test` or `describe` (the `OPENER_UNRESOLVED` park reason). It imports the real `OP_TYPES` and `makeOp` and synthesises its own rules; it imports no rules module. ⭐ **JUDGMENT 196's TITLE LAW, MEASURED:** every `it` title BEGINS `A<n> - EM-C2: ` so it is UNIQUE in `tests/` — at `a545899ff`, `git grep -c -F` over `tests` returns **0** for `EM-C2`, **0** for `editGuards` and **0** for `guardsAcceptApplies`; the only two hits for the phrase "the guard engine" are an assertion message in `tests/domain/editOperations.test.js` and one in `tests/domain/recordMerge.test.js`, neither a title. `vitest -t` is a REGEX, so a hyphen is used rather than an em dash. |
| `CREATE` | `tests/property/guardsAcceptApplies.test.js` | A8 | `n/a` | Adds exactly ONE literal `it` under ONE literal `describe`. Queues of 1 to 10, COLLECTED into rows and asserted ONCE (`seedLoopTotality` convicts a bare `for (…) { expect(…) }`). Every new negative assertion carries its `// anchored:` marker on the line immediately above the `expect` itself, with the positive control that anchors it. ⭐ Its one title BEGINS `A8 - EM-C2: `, unique in `tests/` by the same measurement. |

Generated artifacts: `NONE`. This packet runs no generator; it names no command that writes.

**The two DEFERRED register rows** (the chair's terminal acts, §P2.1 and §P2.13; neither path
appears in this table, in the capsule or in `checks`):

- `tests/lint/.lighting-census-baseline.json` — the delta this member causes, ALL FIVE FIGURES
  in the register's own order: **files +2 · parked +0 · credited +2 · titles +8 · suiteTitles
  +2**. The interior red is the lighting walker's own message at this member's tip, stopping at
  its FIRST moved figure (shape: `expected <N+2> to be <N>` on `files`).
- `docs/content/wiring-census.json` — `stamp.producerIndexFiles` **+1**, the one new leaf named:
  `src/domain/edit/guards.js`. `stamp.files` and `stamp.candidateLeaves` UNMOVED (this member
  touches no `src/domain/display/stateProse/` path); `totals.*` UNMOVED (it produces no pool,
  variant or relation). The prediction is measured against the two roots the census walks
  (`src/generators` and `src/domain`): 1190 files at the tip. `tests/lint/proseWiringCensus.walker.test.js`
  is RED ON EXACTLY TWO ARMS until that regeneration and is therefore EXCLUDED from the build
  lane's whole-directory run and run ALONE, expected NONZERO (§10).

**The instrument dispositions this CREATE owes (§P2.21), each measured by running the
instrument's OWN logic in plain node over the planted text — every one is ZERO, so none is a
change row:**

| instrument | disposition | measured |
|---|---|---|
| `tests/lint/entropyRootCensus.walker.test.js` | NOT OWED, both arms | `createPRNG(` sites 0, `hash01(` 0, `fnv1a32(` 0; the walker's own `READ_RE` finds 0 `rngSeed` reads |
| `tests/lint/ruinFilterRoster.walker.test.js` | NOT OWED | the walker's `READER_RE` (`/\.institutions\b/`) over the planted CODE (comments blanked with the walker's own `commentsOnly`): no match |
| `tests/build/vendorPdfLazy.test.js` ST-2 goods roster | NOT OWED | the leaf's whole import list is `["../deterministicSort.js"]`; no goods identity half-table |
| `tests/copy/voiceMechanics.test.js` | held at ZERO, and it is | the walker's own espree literal scan at `a545899ff`: **36** literals, `em 0`, `bang 0`. Tier 2 scans `src/data/*.js` and `src/domain/**/*.js`, so the leaf is the one scanned path and the two test files are outside every tier; the zero-headroom `src/generators` em budget (28 of 28) is untouched because this member spells no `src/generators` literal |
| `scripts/lib/tuning-inventory.mjs` + `tests/lint/tuningRegister.walker.test.js` | NOT OWED | the library's OWN `countUnregisteredNamed` and `countBareDecimals` over the planted tree: `{}` and `{}` |
| `tests/lint/domainAnyCastBaseline.test.js` (the any-cast ratchet) | held at ZERO, and it is | the ratchet's own `countText`: `{any: 0, suppress: 0}` |
| `tests/lint/couplingInclusion.walker.test.js` | OUT OF SCOPE | its roster covers `src/domain/worldPulse` and `src/domain/spatial` only; `grep -c 'src/domain/edit'` = 0 |
| `tests/build/domainGeneratorsBoundary.test.js` | UNMOVED at 5 of 5 | the leaf imports no `src/generators/**` specifier, static or dynamic |
| `tests/lint/flavorFields.census.test.js` | UNMOVED — with a finding | `SCAN_ROOTS` is three hard-coded roots; the fourth (`src/domain/edit/guards*`) is a WRITTEN-DOWN absence in that file's own comment, not a walked root. This CREATE makes the stated pattern match one file for the first time and NOTHING reds. §12 ruling 2 carries it to the chair |
| `scripts/mutation-coverage-manifest.json` | NOT OWED | `ENFORCER_DIRS` read at this tip is lint · design · docs · data · copy · security · edgeFunctions · generators; neither `tests/domain` nor `tests/property` is one, and `NAME_PATTERN` matches neither new basename |
| observed-shape `EXPLAINED_WRITER_EXEMPTIONS` (§P2.3) | NOT OWED | the engine takes the registry as an ARGUMENT; it reads no `record.decrees` and no `record.dmLayer`. ARCH §3 gives `decrees on settlement` to EM-C1 |
| `scripts/check-writer-reach.mjs` (§P2.4) | UNMOVED | the leaf reads no settlement field |
| `tests/lint/proseNumerics.test.js` (line-addressed) | `none found` | `git grep -n -F 'src/domain/edit/guards.js' -- tests/lint scripts` prints nothing, and this member MODIFIES no file, so it shifts no line anywhere |
| `tests/lint/sourceCitationIntegrity.walker.test.js` | UNMOVED | this packet's own `requiredSymbols` `_note`s carry no line address (§P2.22), and it shifts no cited line |
| the edge-shared bundles (§P2.10) | NOT OWED | `src/domain/edit/guards.js` is a NEW file and is an input of no bundle meta; the member edits no existing input |
| the byte budgets (§P2.11) | +0 B in every emitted chunk | the leaf has ZERO importers at its landing, so it enters no closure: not the generation worker (`WORKER_BUNDLE_CEILING_BYTES`, zero slack), not the lazy engine, not the eager first-paint set. This member is NOT the train's byte-arm holder and carries no budget test row |
| `e2e/` (§P2.15) | NONE, and it is said | this member touches no `src/components/**`, no route, no `data-testid` and no accessible name |

This table and the JSON `changeManifest` are SET-EQUAL on paths and on actions.

**⛔ ONE CONTRADICTION WITH EM-C3 v2, MEASURED AND NOT REPAIRED HERE (the chair's, §11.9's
sibling).** `EM-C3.md`'s §7 row for `tests/build/vendorPdfLazy.test.js` reads: *"EM-C2 adds
`'src/domain/edit/guards.js'` to the SAME array and lands FIRST, so this row is written against
the twelve-row array EM-C2 leaves, never against the eleven-row one measured here."* **This
packet carries no `tests/build/vendorPdfLazy.test.js` row**, and its collision group, its §3
budget and its `_byteNote` all say so. Measured at `a545899ff`: the `editorTrain` array in that
file holds **ELEVEN** rows, and the arm's own logic is `expect(present).toEqual(editorTrain)`
over `existsSync` plus `expect(present.filter(inEager)).toEqual([])` — it asserts that every
LISTED module exists and that none is eager, and it **has no totality arm over
`src/domain/edit/`**, so an unlisted CREATE reds NOTHING. This member is therefore not FORCED
to carry the row, and EM-C3's premise about it is false as the two packets stand. Only the
chair may close this, because adding the row would give stage 1 and stage 2 of one train a
SHARED PATH (judgment 239's measurement), would move this packet's collision group off "no
file path is shared", and would need this packet's own count prover corrected — its `testFiles`
counter increments on EVERY `tests/` row, so a `TEST` row on an existing file would break the
`files`/`credited`/`suiteTitles` laws that are currently green (EM-C3's prover keys arms by
path instead and does not have this defect).

**WHAT MOVES ABOUT THIS MEMBER'S PATHS AFTER IT LANDS (stage 2, measured from
`packets-waiting/`):** EM-C3 CREATEs `src/domain/edit/guardRules.js`, which becomes the FIRST
importer of this leaf — the leaf stops being import-dark, though EM-C3 itself lands dark, so no
emitted chunk is reached and the `+0 B` prediction survives both landings. EM-C3 also re-adds
the flavour census's dropped fourth root as TWO FILE roots, the first of which is
`'src/domain/edit/guards.js'`, so this member's leaf becomes a WALKED root of
`tests/lint/flavorFields.census.test.js` at EM-C3's landing and not before (§12 ruling 2). No
path of this member is MODIFIED or CREATEd by EM-R1c, EM-R7 or EM-B2b: the intersection with
each of the three is EMPTY, measured over their capsules' `changeManifest` rows.

No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch.
1. Capture the baseline: the lighting tuple and `stamp.producerIndexFiles` read live; the
   planted-text instrument figures re-run at the sealed HEAD.
2. Add the failing tests for A1 to A8 (red-first; read the COUNT LINE before claiming any red).
3. Implement `src/domain/edit/guards.js` exactly as §6 contracts it.
4. (no writer to extend; no consumer to wire — this member has neither)
5. (no registration file — every disposition in §7 is ZERO)
6. Run focused verification (§10), then the build lane's whole-directory instruments.
7. Write the completion receipt.

Bounded algorithm:

```text
0. declaredRules := the rule set's rows that are plain objects with a non-empty string `id`,
   a callable `evaluate`, an `appliesTo` that is `null` or an array, and an array `needs`.
   deps := the rule set's `deps` when it is a plain object, else {}.
   rules        := those whose every `needs` name is an own key of deps.
   unevaluated  := the ids of the rest, deduped, sorted by compareCodepoint.
1. entries := the registry's rows that are plain objects with a non-empty string `id`, an
   `op` that is a plain object with a string `type`, and `status === 'pending'`; sorted by
   whenClass, tick, season (codepoint), orderIndex, id (codepoint).
2. worlds[0] := world. For i in 0..entries.length-2:
     next := project ? project(worlds[i], entries[i].op, catalogue) : undefined
     worlds[i+1] := (next is undefined or null) ? worlds[i] : next
3. For each entry at index i:
     decl := catalogue own-property `entries[i].op.type`, else null
     ctx  := frozen { entry, op, decl, index: i, world, folded: worlds[i],
                      priorEntries, laterEntries, entries, catalogue, deps }
     For each rule whose id and evaluate are well formed and whose appliesTo covers the type,
     in compareCodepoint order of id:
       findings := rule.evaluate(ctx), wrapped to an array
       For each finding that is a plain object with a kind in GUARD_KINDS and a non-empty
       string message:
         base := [ruleId, entryId, relatedEntryId or '-', facet or '-'].join(':')
         id   := base, or base + ':' + n for the nth use of base beyond the first
         push frozen { id, entryId, ruleId, kind, message,
                       offers: dedupe(declared offers) + 'proceed' if absent,
                       fulfil: finding.fulfil if a plain object else null,
                       relatedEntryId, overridden: entry.overrode includes id }
4. Return frozen { guards: frozen(guards), unevaluated: frozen(unevaluated) }.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | **THE FOLD IS WHAT MAKES IT NON-VACUOUS.** A queue of two over the real catalogue: `found-phantom` then `promote-phantom` (whose `requires.registry` is `['found-phantom']`), and the same two reversed | the real `OP_TYPES`; one synthetic prerequisite rule that reads `ctx.decl.requires.registry` against `ctx.priorEntries` | IN ORDER: **0** guards. OUT OF ORDER: **1** guard, kind `prerequisite`, on the `promote-phantom` entry. A queue of one is judged exactly as a queue of ten (§12's product ruling) | `tests/domain/editGuards.test.js` |
| A2 | **THE DECLARATION, NEVER THE FLATTENED `Op` — the member's whole reason.** All 22 catalogue rows staged as one queue, judged twice: once by a rule reading `ctx.decl.requires.registry`, once by the same rule reading `ctx.op.requires` | the real `OP_TYPES` and `makeOp` | DECLARATION: **3** prerequisite guards. FLATTENED: **5**, and the **2** extra are exactly the entries for `remove-npc` and `set-npc-status` — the two rows whose `requires.world` is `['npcPresent']`, a §18 world-state condition that is not a guard at all. THE ANTI-VACUITY ARM, both directions: the arm names the two op types, so a member that silently read `op.requires` reds by name | `tests/domain/editGuards.test.js` |
| A3 | **PROCEED ALWAYS, AND ONLY DECLARED OFFERS.** One entry, one rule offering `['reorder','nonsense','reorder','fulfil']`, and a second rule offering nothing at all | a synthetic catalogue row | `['reorder','fulfil','proceed']` — deduped in the RULE's order, the undeclared member dropped, `proceed` appended. The offer-less rule's guard reads exactly `['proceed']`. No returned guard anywhere in this file has an empty `offers` or lacks `proceed` | `tests/domain/editGuards.test.js` |
| A4 | **THE ORDER IS DESIGN §11's, AND IT IS TOTAL.** Five entries shuffled: `orderIndex` 2 with no `when`; `orderIndex` 9 with no `when`; `when.tick` 1; `when.tick` 3; `when.season` `'winter'` | one rule that fires on every entry | the guards come back `["v","z","w","x","y"]`: absent `when` first (by `orderIndex`), then ticks ascending, then the season-only entry. Shuffling the input does not move the output | `tests/domain/editGuards.test.js` |
| A5 | **ONLY PENDING, ONLY WELL-FORMED, AND ONLY WIRED** (re-derived at version 2). A registry holding one `applied`, one `withdrawn` and one `pending` entry; a rule yielding `null`, `42`, a bad `kind`, an empty `message` and one good finding; and a rule set of three — one `needs: ['checkStructuralValidity']`, one `needs: ['renormalizeFactionPower']`, one with NO `needs` key — run against three `deps` bags (both, one, none) and once against an EMPTY registry | the real `OP_TYPES` | exactly ONE entry is judged and exactly ONE finding survives the malformed five (`['kept']`). With both deps: `unevaluated` is `[]` and `ctx.deps` carries both names. With one: `guards` holds `also` alone and `unevaluated` reads `["wired"]`. With none: `guards` is empty and `unevaluated` reads `["also","wired"]` — deduped and codepoint-sorted. On an EMPTY registry the wiring is STILL reported (`["also","wired"]`), because what is wrong is the caller. The `needs`-less rule appears in NEITHER half. A non-array registry, an absent `ruleSet`: both halves empty; the verdict and both halves are FROZEN | `tests/domain/editGuards.test.js` |
| A6 | **THE ID IS STABLE, AND AN OVERRIDE MARKS ITS GUARD.** The out-of-order queue of A1, evaluated twice; then the same queue with the first guard's id written into the entry's `overrode` | the real `OP_TYPES` | both evaluations mint `prereq-from-decl:p:-:found-phantom`; with the id in `overrode` the guard is STILL RETURNED and reads `overridden: true` (suppression would make the guard set depend on history a rewind cannot reproduce). Two findings under one identity come back `['twin:t:-:-','twin:t:-:-:2']` — an ordinal, never a collision, never a lost finding | `tests/domain/editGuards.test.js` |
| A7 | **PURE: NOTHING THE ENGINE WAS HANDED MOVES, AND `project` IS THE ONLY FOLD.** A deeply frozen world and a frozen registry; a projector appending each op type to a new array; then the same run with `project: null` | a two-entry queue | with the projector, entry 0 sees `""` and entry 1 sees `"promote-phantom"`; the registry JSON is byte-identical before and after and the frozen world's array is still empty. With NO projector, `ctx.folded === world` by IDENTITY for every entry. THE WRITTEN-CONTRACT COUNTERFORCE (§P6): the same arm against a planted engine that mutated its world argument reds by name | `tests/domain/editGuards.test.js` |
| A8 | **THE PROPERTY, OVER QUEUES OF 1 TO 10 (ARCH §6, design §7 C)** (re-derived at version 2). Ten queues, lengths 1 to 10, alternating `found-phantom` and `promote-phantom`, judged TWICE: by a prerequisite rule and a fires-always rule, and again with a THIRD rule that declares `needs: ['checkStructuralValidity']` against a fully supplied `deps`. Every row COLLECTED, then asserted ONCE (`seedLoopTotality`) | the real `OP_TYPES` | for every length, in both runs: every guard offers `proceed`; every guard id is unique within the run; the guards are ordered by entry then by rule id; and no guard anywhere is a refusal, because there is no refusal value to return. Measured guard counts 1 to 10 in the first run and 2 to 20 in the second, and `unevaluated` is EMPTY at every length when the rule set is fully wired — the property's other half, since a silently unrun rule would otherwise read as clean coverage | `tests/property/guardsAcceptApplies.test.js` |

This table is the entire edge-case budget.

Every case names the FILE that holds it and the §7 row that authorizes that file's edit: A1 to
A7 are homed in the `CREATE` row for `tests/domain/editGuards.test.js` (which declares exactly
SEVEN `it`s), A8 in the `CREATE` row for `tests/property/guardsAcceptApplies.test.js` (which
declares exactly ONE `it`). §7's declared arm counts, this matrix's homes and §10/§12's title
delta all state **7 + 1 = 8**.

## 10. Verification commands

```sh
# PRE-SEAL, before anything else: the count prover that ships beside this packet in the kit.
node EM-C2.count-prover.mjs EM-C2.md EM-C2.manifest.json

# Focused static checks
npx eslint src/domain/edit/guards.js tests/domain/editGuards.test.js tests/property/guardsAcceptApplies.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# PRE-REPORT, no gate slot: the TypeScript compiler API over this packet's own src/ path,
# under BOTH configurations. eslint alone is not enough (EM-B3f's red).
node <scratch>/typecheck-paths.mjs src/domain/edit/guards.js

# Focused tests: acquire the one test slot in the same command
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editGuards.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/guardsAcceptApplies.test.js

# The walkers that govern this member's three paths (the computed set; TOOL-26 has NOT landed
# at this tip, so the set is derived by `git grep -l -F` per changed file and per governed
# directory). MINUS the lighting walker and MINUS the wiring-census walker, both of which red
# by design under a train and would make `check:packet` unpassable.
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/opGuardCoverage.walker.test.js tests/lint/editMutationPath.walker.test.js \
  tests/lint/editDeclarations.walker.test.js tests/lint/flavorFields.census.test.js \
  tests/lint/entropyRootCensus.walker.test.js tests/lint/ruinFilterRoster.walker.test.js \
  tests/lint/tuningRegister.walker.test.js tests/lint/domainAnyCastBaseline.test.js \
  tests/lint/recordRegisterTotality.walker.test.js tests/lint/heldKeyWriterCensus.walker.test.js \
  tests/lint/transientChooserRegistry.walker.test.js tests/lint/localeCompareGuard.test.js \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/seedLoopTotality.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/sourceCitationIntegrity.walker.test.js \
  tests/lint/mutationCoverageManifest.test.js tests/lint/proseNumerics.test.js \
  tests/lint/testRatchet.test.js

# The landed batteries over the modules this member's tests import (the governing-set law)
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editOperations.test.js tests/domain/deterministicSort.test.js

# The boundary ratchet and the voice walker
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/build/domainGeneratorsBoundary.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js

# The goldens, which this member cannot move
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

# THE BUILD LANE'S OWN INSTRUMENTS, never sealed checks (§P7):
#   the excluded whole-directory run, which MUST EXIT 0 --
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint \
  --exclude=tests/lint/sovereigntyLightingContract.walker.test.js \
  --exclude=tests/lint/proseWiringCensus.walker.test.js
#   the lighting walker ALONE, expected NONZERO, its message naming the FIRST moved figure --
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
#   the wiring-census walker ALONE, expected NONZERO on EXACTLY TWO arms (judgment 87) --
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/proseWiringCensus.walker.test.js
#   and the CREATE directories WHOLE, once (the 2026-09-20 addendum: a new test file opts into
#   every walker that governs its directory)
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/property

# The browser suite: NOT OWED. This member touches no src/components/**, no route, no
# data-testid and no accessible name, and it names no e2e spec.

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- EM-C2
npm run implementation:resume -- EM-C2

# Wave-end presentation-safe invocation of the authoritative gate; never pipe
npm run check:tail
```

Expected: every command exits `0`, except the two named interior reds (the lighting walker and
the wiring-census walker, each run ALONE and each expected NONZERO). Report actual counts; do
not copy historical counts.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

1. the dispatch seal is missing, invalid, or belongs to another worktree state;
2. any governing walker reds with a figure this packet did not predict — the arm's own message
   decides, and a figure adopted by hand is the failure;
3. **the engine would read `op.requires`** instead of `catalogue[op.type].requires.registry`,
   or would otherwise treat a `requires.world` id as a guard's business (design §18);
4. **any guard could be returned without `proceed` in its offers**, or any code path could
   return a refusal (design §2.7, §P8);
5. the engine would SYNTHESISE a folded world itself rather than take `project` from the rule
   set, or would mutate the world, the registry, an entry or a rule it was handed;
6. `src/domain/edit/guards.js` would import anything but `../deterministicSort.js` — above all
   `guardRules.js`, `registry.js`, `operations.js`, any `src/generators/**` module or anything
   under `src/components` (§P4, and the landed boundary ratchet);
7. the leaf would gain a `@type {any}` or `{*}`, a top-level `UPPER_SNAKE = <number>`, a bare
   decimal in code, a `createPRNG` site, a `.institutions` read, an em dash or an exclamation
   point in a string literal;
8. `tests/lint/opGuardCoverage.walker.test.js` would need widening, or `OP_TYPES[type].guards`
   would need populating, to make this member pass (the chair closed it: EM-C2b, later);
9. **the §5 rules-interface clause in this packet and in `EM-C3.md` differ by one byte** — the
   chair landed ONE text (judgment 236) and its SHA-256 is printed by each packet's own count
   prover; a divergence here is a STOP at the placement AND at the build;
10. the engine would RUN a rule whose `needs` the caller did not supply, or would substitute a
    stub for a missing dependency, or would drop an under-supplied rule from `unevaluated`
    instead of naming it, or would import either injected writer rather than taking it on
    `deps` (the landed domain-to-generators boundary ratchet);
11. a sealed acceptance case has no file and no §7 row authorizing that file's edit, or the
    row's arm count, the matrix's homes and the title delta disagree;
12. a red-first's log prints no test count, or `Tests no tests` — the file did not load, so
    nothing was proved and no red may be claimed;
13. resume reports authority, HEAD, foreign-work, or receipt-integrity drift.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into
the next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (predicted: `src/domain/edit/guards.js` **164**
  effective, the two test files `n/a`):
- Acceptance cases A1 to A8, each with its executed figure:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations (predicted ZERO errors on `src/domain/edit/guards.js` under
  each; measured so at compile over the planted text):
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result (predicted UNMOVED: the leaf has zero importers):
- Bundle/first-paint result (predicted **+0 B** in every emitted chunk; this member is NOT the
  train's byte-arm holder):
- The two interior reds, each quoted with its own message: the lighting walker (predicted
  `files +2 · parked +0 · credited +2 · titles +8 · suiteTitles +2`, stopping at `files`) and
  the wiring-census walker (predicted TWO arms, `stamp.producerIndexFiles +1`):
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls:

**THE RULINGS, DECIDED BY THE CHAIR (judgment 236, 2026-09-23; version 1 owed four, none is
open):**

1. **`OP_TYPES[type].guards` stays EMPTY for wave 2.** The population is its own slot, EM-C2b,
   after both the engine and the rules land (the chair's 235b priced it: +2 modules / 25,445 B
   under the injected shape against +77 modules / 1,395,639 B under the imported one, which is
   refused outright). `tests/lint/opGuardCoverage.walker.test.js` C7 therefore stays green
   under this member with no widening, and §5's clause item 2 is the standing law.
2. **The flavour census's dropped fourth root is re-added by EM-C3 version 2**, not here. This
   member's CREATE makes `flavorFields.census.test.js`'s recorded pattern
   (`/(^|\/)guard[A-Za-z]*\.js$/`) match one file for the first time and nothing reds — the
   pattern lives only in that file's comment — and the RULES are the readers the instrument
   was written for, so the root follows them.
3. **An overridden guard is MARKED, never suppressed** (ratified). `Guard.overridden` stands,
   and a surface may hide a marked guard; it could not recover a suppressed one.
4. **The shared §5 clause is ONE TEXT**, SHA-256
   `20ff767bc6a53ff5b3f178932017eab9af721b03bc98f65bbd62d100a8576aae` (8,288 bytes): version
   1's items 1 to 9 with Delta 1 (`needs`) and Delta 2 (`deps`, the skipped-rule report, the
   `{ guards, unevaluated }` return) folded in from EM-C3's wording verbatim, and Delta 3
   decided for the ENGINE on the executed closure measurement — `GUARD_KINDS`, `GUARD_OFFERS`
   and the typedefs live in `guards.js`, `guardRules.js` names the types type-only and imports
   the two value vocabularies, and **EM-C2 LANDS BEFORE EM-C3**, which carries
   `Depends on: EM-C2`. A divergence at either placement or either build is a STOP (§11.9).
