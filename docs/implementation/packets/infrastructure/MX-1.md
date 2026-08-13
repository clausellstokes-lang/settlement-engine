# Infrastructure / MX-1 — machinery: retirement becomes machine-visible

- **Status:** READY
- **Packet version:** `1`
- **Compiled by:** Lane AR (read-only design lane) 2026-08-12; **promoted by Lane AT** 2026-08-12 with every §15 figure executed at the base below — see §15.
- **Verified base:** `claude/composite-r4` at `41732a516c72364e9b01be8959d98df1fdd68fb9`
- **Base note:** ⚠⚠ **A MID-PROMOTION BASE MOVE HAPPENED, IT WAS FOREIGN, AND IT IS RECORDED RATHER THAN PAPERED OVER.** MX-1 was compiled and every figure first executed at `c73c17ef`. A concurrent lane then landed `41732a51` (`AO-1` — one file, `tests/lint/wizardNewsAuthoring.walker.test.js`) while this promotion was in flight. The packet is **re-pinned to `41732a51`, with every load-bearing figure re-executed there**, so the base named here is the tree an implementer will actually find. Proved at the re-pin: ancestry via `git merge-base --is-ancestor`; the substrate diff `c73c17ef..41732a51` over all six declared paths **EMPTY**; the defect shape unchanged (zero `status` references in the `symbolKeys` loop, `TERMINAL_PACKET_STATUSES` unchanged at `:43`); all five effective-line figures **identical**; the lighting census **unmoved** because the foreign commit added no test title. ⭐ **A base move is not a reason to re-stamp a number — it is a reason to re-execute it**, and §15 marks which figures were re-executed at `41732a51` and which were measured once at `c73c17ef` over provably unchanged bytes.
- **Depends on:** IA-1 at `d7ec3885` (the validator and capsule tool this packet extends); IA-2's machinery at `f1895e60`, now folded and re-statused SUPERSEDED by CR-AR-1.
- **Collision group:** `implementation-dispatch-surface` — serialize against any lane touching `scripts/implementation-*.mjs`.
- **Census-holder:** ⛔ **MX-1 does NOT hold the estate-wide lighting-census row and must NOT name it.** MX-1 adds zero test titles, zero suite titles and zero test files, so none of the census five-tuple can move (§8 item 1). The row is FREE at this base with zero holders, and it stays free for the next dispatch that actually needs it.
- **Commit authority:** the promotion is a docs-only plumbing commit by the chair's lane. The IMPLEMENTER receives edit authority for the five manifest paths in §7 and no commit authority absent an explicit dispatch statement.

## -1. THE COMPILABILITY VERDICT — COMPILABLE, ADDITIVE, AND THE COLLISION THAT BLOCKED IT IS DISCHARGED

MX-1 is the general machinery chartered but not built at the IN-1b landing. **CR-IN1B-9** was a hand-written chair cure: `requiredSymbols[10]` had to be re-pointed to a successor invariant because the validator's existence check is status-blind, so a packet that retires a symbol and honestly names the retiree reds forever from its landing onward. The rule *"a symbol-retiring packet names its SUCCESSOR, never the retiree"* was recorded in prose and given no enforcer.

**The design lane's blocking door is discharged at this base.** Lane AR measured, at `d7b7d225`, that `IA-2` was `STALE`, that `STALE` is not terminal, and that IA-2 therefore reserved seven of the paths this fix needs — proved by simulation. **CR-AR-1 re-statused IA-2 `SUPERSEDED` at `c73c17ef`**, the immediate ancestor of this packet's verified base. Re-simulated at `41732a51` with MX-1's exact five paths against the live manifest: **`DUPLICATE_CHANGE_PATH_ERRORS = 0`** (§15). The packet is dispatchable.

What MX-1 must **not** become: a status-aware skip for terminal packets. That was the design lane's Option A and it is refused on a measured number — see §2.2.

## 0. Why this packet exists

The manifest has no vocabulary for retirement. `requiredSymbols` answers *"which live symbols must this packet's deliverable find?"* and its existence check is total and status-blind (§3.1). There is no field that answers *"which live symbols does this packet's deliverable remove?"*, so the manifest cannot distinguish **"this packet retired X"** from **"this packet forgot X"**, and a packet that retires anything must either lie by omission or red at every future validation.

**Observable result:** a packet may declare a retirement in structured data; a `LANDED` packet whose declared retiree still survives in the tree reds; a packet naming one `path :: symbol` in both lists reds; and the successor-naming rule CR-IN1B-9 wrote in prose acquires an enforcer that costs no new detector and no prose parser.

## 2. Outcome and non-goals

### 2.1 One behavior family

A packet declares the symbols its deliverable retires, and the validator asserts that declaration at the one status where absence is assertable.

### 2.2 Non-goals

| Excluded | Why | Where |
|---|---|---|
| A status-aware skip that exempts terminal packets from the `requiredSymbols` existence check | ⛔ **REFUSED on a measured number.** At this base **174 of 174** `requiredSymbols` rows sit on terminal packets (§3.2). Skipping them switches off the manifest's only standing join back to live source, entirely. It also grants symbols the exemption that `CREATE` paths just lost — the disabled-guard class that let TC-5A carry three fictional paths from its landing onward | never |
| A lint that parses a packet's free-prose §6 to infer retirements | a prose-derived detector, the fragile class this estate has been bitten by. The disjointness arm is the same lint expressed against structured data | never |
| Bumping `PACKET_MANIFEST_SCHEMA_VERSION` | the field is optional and additive; no existing row is invalidated and no consumer enumerates keys (§3.3). A bump is a persistence-shape decision and is chair-gated | STOP door 2 |
| Editing any LANDED packet's manifest row, including IN-1B's cured `requiredSymbols[10]` | a chair act; the cure already landed and MX-1 does not re-litigate it | chair |
| Retro-declaring retirements on landed packets | every landed row would need its own historical measurement; the field is optional precisely so absence stays legal | a later docket, if ever |
| Adding a `retiredSymbols` row to MX-1's own manifest entry | MX-1 retires nothing; the absence is the backward-compatibility control A2 exercises | never |
| Any new test title, suite title, or test file | the census five-tuple must not move (§8 item 1) | never here |

## 3. Verified tree contract

*Every line number is a hint; every symbol is the instruction.*

### 3.1 ⛔ THE DEFECT, RE-LOCATED BY SYMBOL AND QUOTED AT THIS HEAD

`scripts/implementation-packets.mjs`, the `symbolKeys` loop — **`:471-496` at `41732a51`**. The status-blind arm is `:488-495`:

```js
      if (!fileExists(rootDir, row.path)) {
        addError(errors, `${at}.path does not exist: ${row.path}`);
        continue;
      }
      const source = readRepositoryFile(rootDir, row.path);
      if (!source.includes(row.symbol)) {
        addError(errors, `${at}.symbol is missing from ${row.path}: ${row.symbol}`);
      }
```

**No `status` appears anywhere in that loop.** Contrast the `changeManifest` loop, which *is* status-aware at `:466-468` and carries a nine-line rationale comment at `:460-465` — the argument MX-1 transplants one level down with the sign flipped.

⚠ **The status-blind check is CORRECT and MX-1 does not weaken it.** A required symbol must exist at every status; that is what makes a typo'd symbol catchable the day it is written. MX-1 adds an opposite-signed assertion beside it. **The validator gains an arm; it loses none.**

### 3.2 The number that decides the design — EXECUTED at this base

| Fact | Value at `41732a51` | How |
|---|---|---|
| `requiredSymbols` rows, total | **174** | computed over the live manifest |
| …on terminal packets (`LANDED` ∪ `SUPERSEDED`) | **174 (100.0%)** | computed |
| …on `READY` packets | **0** | computed |
| Manifest packets / statuses | **23** — `LANDED 22`, `SUPERSEDED 1` | computed |
| Non-terminal packets | **ZERO** | computed |

⚠ **The design lane measured 174 / 161 / 10 at `d7b7d225`, where GR-4c was still `READY`.** GR-4c's landing moved its ten rows terminal. The percentage moved from 92.5% to **100%**, which strengthens the Option A refusal rather than weakening it: at this base, a terminal-status skip would switch off **every single** standing join back to live source.

### 3.3 The additive premise — CONFIRMED by a whole-consumer census

**No consumer exact-key-validates a packet object or a capsule.** Executed at this base:

- `validatePacketManifest` reads named fields only — `rawPacket.id`, `.status`, `.packetPath`, `.verifiedBase`, `.changeManifest`, `.requiredSymbols`, `.acceptanceCases`, `.checks`. It never enumerates a packet's keys and never rejects an extra one.
- `buildCodingCapsule` composes `digestFreeCapsule` from a fixed object literal, so an extra packet key is invisible unless the literal names it.
- `scripts/implementation-gate.mjs` never touches `requiredSymbols` at all.
- `scripts/implementation-session.mjs` reads it at `:187`, `:226`, `:247`, `:254` — four sites, all fixed-key projections.
- The only `Object.keys` / `Object.entries` in the three consumers are inside `canonicalSerialize` (`:213`) and `capsuleDigestOf` (`:234`), both of which operate on the capsule the tool itself just built.
- The three test suites assert the capsule with `toMatchObject` (`implementationPackets.test.js:344`, a subset match) and recompute the digest from the capsule's own remainder (`:376-380`), never against a stored literal. `expect(JSON.stringify(second)).toBe(JSON.stringify(first))` (`:338`) pins determinism, not shape.

⇒ **An additive optional field is invisible to every packet that omits it, and an always-present capsule field is absorbed by every existing assertion.** ⛔ If any of this is refuted at dispatch, that is STOP door 3.

### 3.4 ⚠⚠ THE CAPSULE AND SUBSTRATE EDIT IS FOUR SITES ON TWO COUPLING CHAINS, NOT TWO

This is the sharpest hazard in the packet and it is the one an implementer will get wrong.

**Chain 1 — the authority projections must carry the same fields.** `assertCapsuleMatchesManifest` (`session.mjs:258-262`) canonical-serializes `capsuleAuthority` (`:216-231`) and `manifestAuthority` (`:232-257`) and compares them as strings. Both are fixed key lists. Adding `retiredSymbols` to one without the other makes **every dispatch throw**.

**Chain 2 — the two `filePaths` projections are mirrors and one of them is hand-built.** `capsuleAuthority.filePaths` is *derived* — `capsule.fileHashes.map((row) => row.path).sort()` (`:229`) — and `capsule.fileHashes` comes from `buildCodingCapsule`'s `filePaths` Set (`packets.mjs:604-609`). `manifestAuthority.filePaths` is *hand-built* from `indexPath` + `packetPath` + `changeManifest` + `requiredSymbols` (`:250-255`). **Widening one without the other makes every dispatch throw**, through the same string comparison.

**And the substrate check depends on Chain 2.** `assertAncestorAndSubstrate` (`:175-200`) ends by asserting that every declared substrate path is present in the capsule's `fileHashes`:

```js
  const capsulePaths = new Set(capsule.fileHashes.map((row) => row.path));
  for (const path of substrate) {
    if (!capsulePaths.has(path)) throw new Error(`capsule omitted declared substrate: ${path}`);
  }
```

⇒ Widening `substrate` (`:185-188`) with retirement paths **requires** `buildCodingCapsule`'s `filePaths` to carry them, or a descendant dispatch throws `capsule omitted declared substrate`.

⛔ **CR-AR-4 — ALL FOUR SITES MOVE IN ONE EDIT, OR NONE DOES.** They are listed exactly in §6.2. A partial application is STOP door 5.

### 3.5 The status asymmetries — deliberate, and each has a reason

| Status | File missing | Symbol still present | Symbol absent |
|---|---|---|---|
| `LANDED` | **ok** — a retirement may delete the whole file | **reds** — the declared retirement did not happen | **ok** — the claim is kept |
| `SUPERSEDED` | not asserted | not asserted | not asserted |
| every non-terminal status | **reds** — the retiree must exist to be retired | **ok** — the packet is written against it | **reds** — already gone; the packet's premise is stale |

This is the `LANDED`-`CREATE` arm's argument with the sign flipped, and the reason is the same one its comment states at `packets.mjs:460-465`: before a packet lands the retiree **must** still be present, because the packet is written against it; a `SUPERSEDED` packet may have been replaced before it retired anything; **`LANDED` is therefore the only status at which absence is assertable, and so the only status at which a fictional retirement is catchable.**

⚠ **The `SUPERSEDED` control is load-bearing, not decoration.** Without it the arm can quietly widen to a status where reddening it would break ordinary pre-landing dispatch — which is precisely the control the `CREATE` arm's own comment names at `implementationPackets.test.js:222-224`.

### 3.6 The census constraint — and why MX-1 owns no walker row

The lighting census is a five-tuple, read at `tests/lint/sovereigntyLightingContract.walker.test.js:4015`:

```
files: 2409, parked: 365, credited: 2044, titles: 19960, suiteTitles: 5635
```

**MX-1 creates no test file** (`files`, `parked`, `credited` cannot move) **and adds no `it()` or `describe()` title** (`titles`, `suiteTitles` cannot move). All five figures are structurally unmovable by this packet's manifest.

⇒ ⛔ **MX-1 must NOT name `tests/lint/sovereigntyLightingContract.walker.test.js` in its change manifest, and the implementer must NOT re-record the census.** Naming it would take a reservation this packet does not need and deny it to a packet that does. The row is FREE at this base with zero holders. **If the implementer finds a new test title unavoidable, that is STOP door 1 — not a census re-record.**

### 3.7 What is NOT owed — measured, so nobody "helpfully" edits it

- **No `max-lines` ceiling exists for either target.** EXECUTED via `npx eslint --print-config` at this base: `max-lines` is **undefined** for `scripts/implementation-packets.mjs`, `scripts/implementation-session.mjs` and `tests/scripts/implementationPackets.test.js`. Neither target is a hot file and neither is near a door.
- **No `scripts/.size-baseline.json` entry** — its ten file entries are all `src/**`; no target is among them.
- **No coupling-registry row.** The coupling census's scope regex covers `src/**`; `scripts/**` and `tests/scripts/**` are outside it. No layer claim, no cross-layer pair, no registry row.
- **No observed-shape mint.** The four governed observed-shape files are untouched, and `package.json` / `package-lock.json` — themselves governed paths, and therefore mint triggers — are **not** in this manifest. MX-1 adds no dependency.
- **No golden, no baseline, no ratchet, no ceiling, no tuning key, no flag, no persisted family, no user-facing surface, no new production leaf.**

## 5. Preflight — prove these before the first edit

0. `git rev-parse HEAD` = `41732a516c72364e9b01be8959d98df1fdd68fb9` or an accepted descendant; branch `claude/composite-r4`; the five manifest targets Git-clean.
1. **P1 — the pre-edit validator exit.** `npm run validate:packets`, capturing `TRUE_EXIT` yourself. Expect **24 packets (1 READY)**, `TRUE_EXIT=0`. ⚠ See the recursive hazard below.
2. **P2 — the three focused suites at base**, through the mutex. Expect **34 tests passing**, `TRUE_EXIT=0`.
3. **P3 — the reservation census.** Re-read the live manifest and confirm MX-1 is the only non-terminal packet, or that any second non-terminal packet's change paths intersect MX-1's five at ZERO. A collision is STOP door 7.
4. **P4 — the defect still has the measured shape.** The `symbolKeys` loop still carries no `status` reference, and `TERMINAL_PACKET_STATUSES` is still `new Set(['LANDED', 'SUPERSEDED'])`.
5. **P5 — the three hot-file figures**, re-executed for the §6.3 table (see §5b B5). A figure that does not reproduce is STOP door 10.

### ⚠⚠ THE RECURSIVE HAZARD — THIS PACKET EDITS ITS OWN VALIDATOR

`scripts/implementation-packets.mjs` is both the target of this packet and the tool that validates it. **The implementer captures the validator's exit BOTH pre-edit and post-edit, and reports both figures separately.**

- The **pre-edit** run (P1) is the base receipt. It is taken with the old validator against the new manifest entry, and it must be green **before** the first character is edited.
- The **post-edit** run is the wave-end receipt. It is taken with the new validator against the same manifest entry, and it must also be green.
- ⛔ **A post-edit green does not retroactively establish the pre-edit figure**, and a pre-edit green does not survive the edit. Two runs, two captured exits, both quoted in the completion receipt. Reporting one where two are owed is a STOP.

### 5b. Baselines — EVERY ROW EXECUTED AT PROMOTION AT `41732a51`

⭐ **The B13 law applies to this table: every row below was executed by Lane AT at this base, with `TRUE_EXIT` captured in-shell. No load-bearing figure in this packet is delegated, and none is inherited from the design lane's `d7b7d225`.**

| # | Premise | Command | Status |
|---|---|---|---|
| B1 | Validator green at base | `npm run validate:packets` | ✅ **EXECUTED — `23 packets (0 READY)`, `TRUE_EXIT=0`** |
| B2 | The three dispatch-surface suites green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/scripts/implementationPackets.test.js tests/scripts/implementationSession.test.js tests/scripts/implementationGate.test.js` | ✅ **EXECUTED — 3 files, 34 tests passing, `TRUE_EXIT=0`** |
| B3 | Reservation census / IA-2 terminal | live-manifest simulation of MX-1's five paths | ✅ **EXECUTED — `DUPLICATE_CHANGE_PATH_ERRORS = 0`; IA-2 `SUPERSEDED`; zero non-terminal packets** |
| B4 | Target effective lines | `npx eslint --rule '{"max-lines":["error",{"max":1,…}]}'` | ✅ **EXECUTED — `implementation-packets.mjs` 540, `implementation-session.mjs` 645. No ceiling configured for either (`--print-config` → undefined)** |
| B5 | The three hot-file figures for §6.3 | same rule, same three files | ✅ **EXECUTED at THIS head — `OutputContainer.jsx` 599, `peaceTerms.js` 797, `informationStatecraft.js` 780. All three reproduce the design lane's figures exactly** |
| B6 | All thirteen `requiredSymbols` rows present | substring probe per row against its named file | ✅ **EXECUTED — `MISSING=0`** |
| B7 | `retiredSymbols` is a genuinely new token | `git grep -n retiredSymbols` | ✅ **EXECUTED — no matches; no collision with any live identifier** |
| B8 | The census five-tuple | read the file at `:4015` | ✅ **EXECUTED — `2409/365/2044/19960/5635`.** ⛔ MX-1 cannot move any of the five (§3.6); do not re-record |
| B9 | Typecheck posture, both windows named | `npm run typecheck:ratchet` (`tsconfig.full.json`), then `npm run typecheck:domain:strict` (`tsconfig.domain-strict.json`) | ⚠ **NOT RUN at promotion — the implementer's act.** ⚠ `tsconfig.domain-strict.json` declares no `include` of its own and inherits `tsconfig.json`'s `src/domain/**/*.js` + `src/domain/**/*.ts`; **no MX-1 target is inside that window**, so the strict checker is expected unmoved |
| B10 | Pre-existing gate reds | committed-base run, capturing `$?` yourself | ⚠ **NOT RUN — the full gate is the implementer's wave-end act.** ⛔ Derive the pre-existing-red list from `scripts/.test-ratchet-baseline.json` **whole**, never from memory or from a prior packet's list |

## 6. Exact contracts

### 6.1 The validator arm — `scripts/implementation-packets.mjs`

**Home: inside the per-packet loop of `validatePacketManifest`, immediately after the `symbolKeys` loop closes (after `:496`).** `symbolKeys` must be in scope; that is what makes the disjointness arm possible without a second pass.

```js
    const retiredSymbols = rawPacket.retiredSymbols;
    if (retiredSymbols !== undefined && !Array.isArray(retiredSymbols)) {
      addError(errors, `${idLabel}.retiredSymbols must be an array when present`);
    }
    const retired = Array.isArray(retiredSymbols) ? retiredSymbols : [];
    const retiredKeys = new Set();
    for (let index = 0; index < retired.length; index += 1) {
      const row = retired[index];
      const at = `${idLabel}.retiredSymbols[${index}]`;
      if (!isRecord(row)) { addError(errors, `${at} must be an object`); continue; }
      const problem = packetPathProblem(row.path);
      if (problem) addError(errors, `${at}.path ${problem}`);
      if (typeof row.symbol !== 'string' || row.symbol.trim().length === 0) {
        addError(errors, `${at}.symbol must be a non-blank string`);
      }
      if (problem || typeof row.symbol !== 'string' || row.symbol.trim().length === 0) continue;
      const key = `${row.path}\0${row.symbol}`;
      if (retiredKeys.has(key)) addError(errors, `${idLabel} contains duplicate retired symbol: ${row.path} :: ${row.symbol}`);
      retiredKeys.add(key);
      // THE ARM CR-IN1B-9 CURED BY HAND: a symbol cannot be both preserved and retired.
      if (symbolKeys.has(key)) {
        addError(errors, `${idLabel} names ${row.path} :: ${row.symbol} as BOTH required and retired`);
        continue;
      }
      // The mirror of the LANDED CREATE arm above, and for the same reason. Before a packet
      // lands the retiree MUST still be present — the packet is written against it. A
      // SUPERSEDED packet may have been replaced before it retired anything. LANDED is
      // therefore the only status under which absence is assertable, and so the only status
      // under which a fictional retirement is catchable.
      const exists = fileExists(rootDir, row.path);
      if (status === 'LANDED') {
        if (exists && readRepositoryFile(rootDir, row.path).includes(row.symbol)) {
          addError(errors, `${at}.symbol survives in ${row.path} for LANDED retirement: ${row.symbol}`);
        }
      } else if (!TERMINAL_PACKET_STATUSES.has(String(status))) {
        if (!exists) addError(errors, `${at}.path does not exist: ${row.path}`);
        else if (!readRepositoryFile(rootDir, row.path).includes(row.symbol)) {
          addError(errors, `${at}.symbol is already absent from ${row.path} before ${String(status)}: ${row.symbol}`);
        }
      }
    }
```

- **Optional.** `undefined` is legal at every status and produces no error and no behavior change. This is what keeps all 23 landed rows valid.
- **The declaration order is fixed:** the non-array guard runs before the coercion, so a malformed field reds *and* is then treated as empty rather than throwing.
- **The disjointness arm `continue`s** after reporting, so a contradictory row is not then also status-asserted — one row, one error.
- ⛔ **`READY` does not require a non-empty `retiredSymbols`.** Most packets retire nothing; MX-1 itself retires nothing.
- ⛔ **The arm must not weaken, reorder, or skip the existing `symbolKeys` loop.** Its status-blindness is correct (§3.1).

### 6.2 ⛔⛔ The capsule and substrate — CR-AR-4, ALL FOUR SITES IN ONE EDIT

**(i) `packets.mjs` — `buildCodingCapsule`.** Read the field once; widen `filePaths`; add the always-present projection to `digestFreeCapsule`:

```js
  const retiredSymbols = Array.isArray(packet.retiredSymbols) ? packet.retiredSymbols : [];
```
— `...retiredSymbols.map((row) => row.path)` joins the `filePaths` Set (`:604-609`), and
— `retiredSymbols: retiredSymbols.map(({ path, symbol }) => ({ path, symbol })),` joins `digestFreeCapsule` (`:628-647`).

**(ii) `session.mjs` — `capsuleAuthority` (`:216-231`):** add
`retiredSymbols: capsule.retiredSymbols.map(({ path, symbol }) => ({ path, symbol })),`

**(iii) `session.mjs` — `manifestAuthority` (`:232-257`):** add the same field from the packet, **and** widen its hand-built `filePaths`:
`retiredSymbols: (packet.retiredSymbols ?? []).map(({ path, symbol }) => ({ path, symbol })),`
`...(packet.retiredSymbols ?? []).map((row) => row.path),`

**(iv) `session.mjs` — `assertAncestorAndSubstrate` (`:185-188`):** add
`...(packet.retiredSymbols ?? []).map((row) => row.path),` to the `substrate` Set.

- ⭐ **CR-AR-3 — the capsule field is ALWAYS PRESENT, `[]` when empty.** Capsules are built on demand and never committed, so the digest shift costs nothing, and an always-present field keeps canonical serialization uniform across every packet.
- ⚠ **CR-AR-4 declares a behavior shift, and the packet declares it rather than discovering it:** widening the substrate set **narrows which verified-base descendants are admissible for dispatch**. A retirement target that moved between verified base and HEAD now invalidates the packet exactly as a required-symbol file does. That is the correct direction and it is a real change in dispatch behavior.
- ⛔ **A partial application is STOP door 5**, and it fails loudly rather than silently: three of the four sites throw on the next dispatch (§3.4).

### 6.3 `docs/implementation/PACKET_STANDARD.md` — three edits, docs only

**(a) The successor-naming rule**, appended to the existing `## Change manifest` section — this is Option C's prose riding as the authoring rule for Option B's machinery:

> A `requiredSymbols` row names a symbol the packet's deliverable preserves or creates, never one it retires. A retirement is recorded as a `retiredSymbols` row naming the retiree, and the packet's `requiredSymbols` names the **successor** instead. A packet that names one symbol in both lists is refused.

**(b) A new `## Hot files` section**, placed immediately after `## Default hard scope budget` and before `## Edge-case budget` — CR-AR-9. Transcribe verbatim:

> ## Hot files
>
> A hot file sits within a handful of effective lines of a ceiling that will not be raised, carries no `scripts/.size-baseline.json` entry, and has no door. The standing list, every figure executed under eslint `max-lines` with `skipBlankLines` and `skipComments`:
>
> | File | Effective | Ceiling | Headroom |
> |---|---:|---:|---:|
> | `src/components/OutputContainer.jsx` | 599 | 600 | 1 |
> | `src/domain/worldPulse/peaceTerms.js` | 797 | 800 | 3 |
> | `src/domain/worldPulse/informationStatecraft.js` | 780 | 800 | 20 |
>
> Three rules bind every packet:
>
> 1. A packet whose change manifest names a hot file **opens with an executed headroom measurement** of that file, taken at the packet's verified base with eslint's own `Linter` or `npx eslint --rule` under `max-lines` with `skipBlankLines` and `skipComments`. Never `wc -l`, never an inherited figure, never a delegated one.
> 2. The edit into a hot file is **shaped to net zero effective lines** — props inline on an existing line, one-line-for-one-line replacement, or an offsetting combine. A packet that cannot express its edit at net zero STOPS and returns to the coordinator.
> 3. Never add a size-baseline entry for a hot file, never raise its ceiling, and never decompose it to make room for a feature.
>
> Adding a file to this list is a coordinator act with an executed measurement behind it. A row leaves the list only when the file's measured headroom grows.
>
> This rule exists because a delegated effective-line figure for `OutputContainer.jsx` was wrong by seventeen lines in the dangerous direction and would have authorized a six-line edit into one line of room.

⚠ **The three figures were re-executed at this base and reproduce exactly (§5b B5).** The implementer re-executes them once more at dispatch HEAD before transcribing; a figure that does not reproduce is STOP door 10, because the table would be authored false.

**(c) The header restamp.** `PACKET_STANDARD.md`'s stamp currently reads `claude/composite-r4` at `f1895e6004eb512a5c7b4c9b4caaf79604bccea6` on 2026-08-09, which is stale by eleven commits. Restamp it to the landing commit's own branch and SHA, dated 2026-08-12, in this same change.

⛔ **No other section of `PACKET_STANDARD.md` is edited.** In particular the status list, the authority order and the scope-budget numbers are untouched.

## 7. Exact change manifest

| Action | File | Symbol / region | Max Δ | Instruction |
|---|---|---|---:|---|
| `MODIFY` | `scripts/implementation-packets.mjs` | after the `symbolKeys` loop in `validatePacketManifest`; plus `buildCodingCapsule` | **`55`** | §6.1 verbatim + §6.2 site (i). ⛔ Do not weaken or reorder the existing `symbolKeys` loop. ⛔ Do not change `PACKET_MANIFEST_SCHEMA_VERSION`. |
| `MODIFY` | `scripts/implementation-session.mjs` | `capsuleAuthority`, `manifestAuthority`, `assertAncestorAndSubstrate` | **`12`** | §6.2 sites (ii)(iii)(iv). ⛔⛔ All three land with site (i) or none does — §3.4. |
| `TEST` | `tests/scripts/implementationPackets.test.js` | inside two EXISTING `it()` bodies — see §8 item 1 | `n/a` | A1–A7. ⛔ **Zero new `it()` or `describe()` titles.** Use a `validateAtStatus`-shaped local helper; the existing one at `:229` is scoped to a different test and may not be hoisted. |
| `TEST` | `tests/scripts/implementationSession.test.js` | inside EXISTING `it()` bodies | `n/a` | A8. ⛔ **Zero new titles.** |
| `DOC` | `docs/implementation/PACKET_STANDARD.md` | `## Change manifest`; a new `## Hot files` section; the header stamp | `n/a` | §6.3 (a)(b)(c). Documentation lines are not production lines. ⛔ Touch no other section. |

**Named do-not-touch:** `scripts/implementation-gate.mjs`, `tests/scripts/implementationGate.test.js`, `docs/implementation/INDEX.md`, `docs/implementation/PACKET_MANIFEST.json`, `docs/implementation/PACKET_TEMPLATE.md`, every packet under `docs/implementation/packets/` **including this one**, `tests/lint/sovereigntyLightingContract.walker.test.js`, `package.json`, `package-lock.json`, all four observed-shape files, every baseline (`.size-baseline.json`, `.test-ratchet-baseline.json`, `.observed-shape-readers-baseline.json`, `.coupling-inclusion-baseline.json`, `mutation-coverage-manifest.json`), `eslint.config.js`, and every file outside the table above. **Generated artifacts: `NONE`.**

⚠ **`INDEX.md` and `PACKET_MANIFEST.json` are coordinator acts**, on the TC-5b / IN-1b / GR-4c precedent. The implementer never edits them, and never flips this packet's own status.

**`requiredSymbols` — thirteen rows, all SUCCESSOR symbols; MX-1 retires nothing, so CR-IN1B-9's rule is satisfied trivially and this packet says so.** All thirteen confirmed present by executed probe at `41732a51` (§5b B6): `implementation-packets.mjs#validatePacketManifest`, `#buildCodingCapsule`, `#packetPathProblem`, `#TERMINAL_PACKET_STATUSES`, `#PACKET_MANIFEST_SCHEMA_VERSION`; `implementation-session.mjs#assertAncestorAndSubstrate`, `#capsuleAuthority`, `#manifestAuthority`, `#assertCapsuleMatchesManifest`; the two extended test titles in `implementationPackets.test.js` and the one in `implementationSession.test.js`; and `PACKET_STANDARD.md#"## Change manifest"`.

⭐ **The three test titles are named as required symbols deliberately.** They are the census constraint expressed as structured data: the deliverable must *extend* those tests, and renaming one reds the validator. The estate's recorded hazard is that a test title **is** a census key, and that a banked identity absorbs later instances — so pinning the titles a packet promises to preserve is the cheapest possible guard against a silent rename.

### 7b. Reservations — EXECUTED at `41732a51`

**23 packets; ZERO non-terminal rows; `IA-2` re-statused `SUPERSEDED` by CR-AR-1 and therefore reserving nothing.** MX-1's five paths simulated against the live manifest: **`DUPLICATE_CHANGE_PATH_ERRORS = 0`**. ⛔ MX-1 must not name `INDEX.md` or `PACKET_MANIFEST.json` — not because they are reserved, but because they are coordinator acts.

## 8. Landing discipline this manifest incurs — FIVE obligations

1. ⛔⛔ **ZERO NEW TEST TITLES — THIS IS THE HARD ONE.** Every row goes **inside** an existing `it()` body. The homes are fixed:

   | Home (existing title — do not rename) | Rows |
   |---|---|
   | `implementationPackets.test.js:134` — `'accepts the canonical fixture and exposes pure header/index/path helpers'` | **A2**, the omitted-field control: the canonical fixture with **no** `retiredSymbols` still returns `{ ok: true, errors: [] }` |
   | `implementationPackets.test.js:319` — `'rejects a required symbol absent from an existing source file'` | **A1, A3, A4, A5, A6, A7** — the status arms through a local `validateAtStatus`-shaped helper, plus disjointness, malformed input, and the mutant control |
   | `implementationSession.test.js:198` — `'accepts an unchanged descendant but rejects descendant substrate changes'` | **A8**, the capsule/substrate integration |

   ⚠ The in-file precedent is the `── AND A LANDED PACKET'S CREATE ROWS…` block at `implementationPackets.test.js:215-244`, which added a whole status matrix inside an existing title. Copy that shape. ⚠ **`validateAtStatus` at `:229` is a `const` local to the `it()` at `:183` — it cannot be reached from `:319`.** Declare a sibling helper inside the destination test; do not hoist the existing one to module scope, because hoisting changes the first test's fixture lifetime.

2. ⚠ **THE PARKED-SUITE TRAP.** A `test(`/`it(` registered inside a loop is `TEST_UNREGISTERED` and the **whole file parks**; `.each()` parks via `TEST_TABLE_UNPROVEN`. MX-1 adds no registrations at all, so the risk is that a helper loop is written at file scope rather than inside a test body. **Loops go inside an `it`.** If either target file parks, its titles vanish from the census and the arithmetic still closes — check `credited`, not just `files`.

3. ⚠ **ANCHORED NEGATIVES.** `negativeAssertionAnchor.walker.test.js` counts `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`, and accepts the `// anchored:` escape on the assertion line or the **single** line immediately above — ⚠ a multi-line note counts only if its **last** line carries the marker. `implementationPackets.test.js` already carries an anchored negative at `:342-343`; do not disturb it. Prefer positive assertions; route any new negative through `tests/helpers/anchoredNegatives.js`.

4. ⛔ **THE MUTANT CONTROL IS MANDATORY, NOT OPTIONAL (A7).** Delete the `status === 'LANDED'` guard from the §6.1 block and prove the non-terminal arm flips. Without it the status-awareness is untested and the arm joins the recorded unreachable-arm vacuity class — an arm no test can distinguish from its absence. ⚠ Equally, prove the **`SUPERSEDED` control** (A4): a redundant second guard can make a deleted first guard undetectable, and the `SUPERSEDED` row is what stops the arm widening silently.

5. ⛔⛔ **THE DOC GATE — this packet's own prose is in-corpus.** `tests/docs/enforcement-claims.test.js` freezes naked claims **per claim**, keyed `${file} :: ${match}` with a frozen count of zero for a new key, so one untagged occurrence in `MX-1.md` or in the `PACKET_STANDARD.md` edit reds a **green** test the ratchet cannot absorb. A claim counts as naked when it is untagged **or** carries no resolvable target, so a placeholder tag is no escape.
   ⛔ **DO NOT TRANSCRIBE THE FORBIDDEN VOCABULARY INTO ANY DOC — transcribing it IS an occurrence.** Read the `CLAIM_RE` literal at its one home, `tests/docs/enforcement-claims.test.js`, and check your prose against it with a throwaway script. In substance it forbids self-congratulatory enforcement assertions — claims that a rule was raised to an error level, that a count was driven to nothing, that something is enforced by machine, that the gate has newly acquired coverage, or that a condition breaks the gate or the build. Fenced code and quoted prose still count in `.md`. Either tag with `@enforced-by` naming a target that genuinely resolves within ±3 lines, or paraphrase — *"reds the gate"* is safe. **This packet and its drafted `PACKET_STANDARD.md` prose were scanned against the live `CLAIM_RE` at promotion: 0 hits.**

## 9. Acceptance matrix — the closed denominator (8 of 8)

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Main reachable behavior** | A `LANDED` packet declaring a `retiredSymbols` row whose symbol **still survives** in its named file reds with `symbol survives in … for LANDED retirement`. The same row with the symbol **absent** returns `{ ok: true, errors: [] }`, and so does the same row whose **file** is entirely missing — a retirement may delete the whole file. |
| **A2** | **Absent behavior — the backward-compatibility proof** | The canonical fixture with **no `retiredSymbols` key at all** still returns `{ ok: true, errors: [] }` at every status it is already exercised at. This is the row that proves all 23 landed manifest entries stay valid. |
| **A3** | **Counterforce — the non-terminal arm** | At a non-terminal status the assertion inverts: a retiree **already absent** reds with `already absent from … before <STATUS>`, a **missing file** reds with `path does not exist`, and a retiree **still present** is ok — because a pre-landing packet is written against a symbol that must still be there. |
| **A4** | **The `SUPERSEDED` control — the arm cannot quietly widen** | At `SUPERSEDED` the retirement is asserted in **neither** direction: symbol present ⇒ ok, symbol absent ⇒ ok, file missing ⇒ ok. ⛔ Load-bearing, exactly as the `CREATE` arm's own control is: without it the arm can widen to a status where reddening it would break ordinary pre-landing dispatch. |
| **A5** | **Malformed-but-supported, and duplicates** | `retiredSymbols` as a non-array reds with `must be an array when present`; a non-object row reds; a glob or absolute path reds through `packetPathProblem`; a blank or non-string `symbol` reds; and the same `path :: symbol` twice reds with `duplicate retired symbol`. Each is reported once, and a malformed row does not throw. |
| **A6** | **The disjointness arm — CR-IN1B-9 mechanized** | One `path :: symbol` named in **both** `requiredSymbols` and `retiredSymbols` reds with `names … as BOTH required and retired`, at every status, and the row is not then also status-asserted. This is the compile error the chair fixed by hand at the IN-1b landing. |
| **A7** | **The mutant control — the status-awareness is real** | With the `status === 'LANDED'` guard deleted from the §6.1 block, the **non-terminal** arm's expected result flips. ⛔ Mandatory: the guard must be shown to be load-bearing, or the arm is indistinguishable from its own absence. |
| **A8** | **Writer-to-reader integration and lifecycle round trip** | A real dispatch of a packet carrying a `retiredSymbols` row: the capsule carries `retiredSymbols` **always present, `[]` when empty**; `verifyCodingCapsule` and the recomputed `capsuleDigest` stay self-consistent; `assertCapsuleMatchesManifest` stays green through the `capsuleAuthority` / `manifestAuthority` comparison; the retirement path appears in `fileHashes`; and a descendant that **moved a retirement target** is refused by `assertAncestorAndSubstrate` while an unchanged descendant is still admitted. |

**No ninth case.** A privacy-boundary case is OMITTED, not replaced — MX-1 mints no audience projection, no receipt and no user-facing surface.

### 9b. OUTPUT POSTURE — declared, not discovered

> **Simulation behavior: ZERO motion, and that is structural.** MX-1 touches no file under `src/`. No golden, no seed, no distribution, no persisted world shape, no tuning constant and no flag is reachable from this manifest. Any motion in any simulation golden is a premise refutation and a STOP, never a golden to re-record.
>
> **Dispatch behavior: ONE DECLARED SHIFT.** Widening `assertAncestorAndSubstrate`'s substrate set narrows which verified-base descendants are admissible (§6.2, CR-AR-4). No packet in the live manifest carries a `retiredSymbols` row, so the shift is inert at this base and becomes live for the first packet that declares a retirement. It is declared here rather than discovered later.
>
> **Validator behavior: STRICTLY ADDITIVE.** Every existing manifest row validates exactly as before; the new errors are reachable only through the new field. ⚠ **Figures permitted to move: NONE.** ⛔ Everything moving is a STOP.

## 10. Verification commands

```sh
# P1 — the PRE-EDIT validator exit. Capture it BEFORE the first edit (recursive hazard, §5).
npm run validate:packets ; echo "PRE_EDIT_TRUE_EXIT=$?"

# P2 — the three dispatch-surface suites at base. The slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/scripts/implementationPackets.test.js \
  tests/scripts/implementationSession.test.js \
  tests/scripts/implementationGate.test.js

# Focused behavior — A1..A8, after the edit.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/scripts/implementationPackets.test.js \
  tests/scripts/implementationSession.test.js \
  tests/scripts/implementationGate.test.js

# The POST-EDIT validator exit — the same command, the new tool. Both figures are owed.
npm run validate:packets ; echo "POST_EDIT_TRUE_EXIT=$?"

# Static and type posture.
npx eslint scripts/implementation-packets.mjs scripts/implementation-session.mjs \
  tests/scripts/implementationPackets.test.js tests/scripts/implementationSession.test.js
npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# The doc gate this packet's own prose is in-corpus for.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/docs/enforcement-claims.test.js tests/lint/proseNumerics.test.js

# The landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — use `npm run check:tail` or `sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status. **`npm run check` is a 17-step `&&` chain**: a red step blacks out every later step, so the receipt must say **which steps actually ran**. **Trust no exit status you did not capture yourself.**
⛔ **Never wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and self-deadlocks (exit 3 is the mutex giving up, not a red). Run `check:tail` bare from a fresh shell with `; echo TRUE_EXIT=$?`.
⚠ **Budget the wall clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to 900 s because it measures ~264 s contended. A timeout there skips all 27 tests and then trips the ratchet's skip sentinel — a cascade that looks like a defect and is not.
⚠ `tests/lint/proseNumerics.test.js` carries its own banked ratchet entry and may be red at base independently of this packet. Derive the pre-existing-red list from `scripts/.test-ratchet-baseline.json` **whole** (§5b B10) and attribute rather than repair.

## 11. Ordered coding sequence

0. Run §5 preflight P0–P5. **Capture the PRE-EDIT validator exit before touching anything** (the recursive hazard). Stop on any mismatch.
1. Capture P2's three-suite baseline **before the first edit**.
2. Add the smallest failing focused rows — **A1**'s `LANDED` + surviving-symbol case — inside the existing title at `implementationPackets.test.js:319`, before the validator arm exists.
3. Implement §6.1's block in `validatePacketManifest`. Make A1 green.
4. Write A2–A6 in their fixed homes (§8 item 1).
5. Execute **A7**, the mutant control: delete the `status === 'LANDED'` guard, prove the non-terminal arm flips, restore the guard.
6. Apply §6.2's **four sites in one edit** — capsule projection, both authority projections, both `filePaths` widenings, and the substrate widening. Write A8.
7. Apply §6.3's three `PACKET_STANDARD.md` edits, re-executing the three hot-file figures first.
8. Scan every authored `.md` sentence against the live `CLAIM_RE` (§8 item 5). Expect no hits.
9. Run §10's focused checks, then the **POST-EDIT** validator exit.
10. Run the wave-end gate and produce the completion receipt: exact effective-line deltas per file, **both validator exits**, **both typecheck windows named with their configs**, which of the 17 steps actually ran, the base-versus-wave failure identity diff, confirmation that the census five-tuple is unmoved, and `deviations: NONE` or a STOP.

⛔ **Do not start by changing a golden, baseline, budget, or persisted shape.**

## 13. Recorded deviations from the design lane's prose (each vetoable)

| # | Design lane said | Measured at `41732a51` | Resolution |
|---|---|---|---|
| **E1** | `IA-2` is `STALE`, reserves seven of the needed paths, and Batch 1 "cannot be dispatched as a packet at this HEAD" | `IA-2` is `SUPERSEDED`; zero non-terminal packets; MX-1's five paths simulate to `DUPLICATE_CHANGE_PATH_ERRORS = 0` | **DISCHARGED by CR-AR-1.** The blocking door is gone; the packet is dispatchable. |
| **E2** | `requiredSymbols` 174 total, **161** terminal (92.5%), 10 on `READY` | **174 total, 174 terminal (100%), 0 on `READY`** — GR-4c's landing moved its ten rows | **Figure re-derived at this base.** The Option A refusal is strengthened, not weakened. |
| **E3** | the capsule propagation is a **two**-site edit (`capsuleAuthority` + `manifestAuthority`) or none at all | it is a **four**-site edit on **two** independent coupling chains: the authority field pair, and the derived-versus-hand-built `filePaths` pair that `assertAncestorAndSubstrate` then depends on (§3.4) | ⛔ **SHARPENED.** The two-site instruction would have shipped a dispatch that throws `capsule omitted declared substrate`. |
| **E4** | the test-row plan names the homes but not the reachability of `validateAtStatus` | `validateAtStatus` is a `const` local to the `it()` at `:183` and cannot be reached from `:319` | **Instruction made exact** (§8 item 1): declare a sibling helper; do not hoist. |
| **E5** | item (g)'s hot-file figures measured at `d7b7d225` | re-executed at `41732a51`: **599 / 797 / 780** — all three reproduce exactly | **Confirmed at this base**, not inherited. |
| **E6** | Batch 2's items (a)–(f) travel with this work | only item (g) rides MX-1; (a) is a schema-mint trigger and (b)–(f) are a separate prose batch | **Split upheld.** MX-1 carries the machinery plus (g) only. |
| **E7** | *(the promotion's own premise)* the verified base is `c73c17ef`, measured over a still tree | a concurrent lane landed `41732a51` **mid-promotion** — `AO-1`, one file, `tests/lint/wizardNewsAuthoring.walker.test.js` | ⚠ **RE-PINNED to `41732a51`, not re-stamped.** Ancestry proved; the substrate diff over all six declared paths is EMPTY; the defect shape, all five effective-line figures and the census five-tuple were **re-executed and are identical**. The foreign commit is outside MX-1's substrate and adds no test title, so nothing this packet asserts depends on the older base. |

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", stop — without expanding or repairing — when:

1. ⛔ **A new test title becomes unavoidable.** The census row is FREE and is **not** MX-1's; taking it is an unreserved edit to a shared enforcer. Report and stop.
2. ⛔ **`PACKET_MANIFEST_SCHEMA_VERSION` would need bumping.** It is checked exactly at `packets.mjs:344` and a bump is a persistence-shape decision, which is chair-gated.
3. ⛔ **Any consumer turns out to exact-key-validate a packet object or a capsule.** The additive premise (§3.3) is refuted and the design must return to the coordinator.
4. ⛔ **`validate:packets` is red at base for any cause other than this defect.** Attribute it; do not repair it.
5. ⛔ **Only part of §6.2's four-site edit can be made.** A partial application throws on the next dispatch; there is no safe intermediate state.
6. ⛔ **Any LANDED packet's manifest row would need editing**, including IN-1B's cured `requiredSymbols[10]`. That is a chair act, never the implementer's.
7. ⛔ **A reservation collision appears at dispatch** — a second non-terminal packet has claimed one of MX-1's five paths since promotion.
8. ⛔ **The pre-edit validator exit was not captured before the first edit.** The recursive hazard cannot be repaired after the fact; the base receipt is unrecoverable once the tool has changed.
9. ⛔ **The three hot-file figures do not reproduce at dispatch HEAD.** Transcribing a stale figure into the standard would author the exact defect the section exists to prevent.
10. ⛔ **The mutant control (A7) cannot be shown to flip the non-terminal arm**, or the `SUPERSEDED` control (A4) cannot be shown to hold. An arm no test distinguishes from its absence is the recorded vacuity class.
11. ⛔ **Any simulation golden, seed, distribution or persisted shape moves at all.** MX-1 touches no `src/` file; motion is a premise refutation.
12. ⛔ **A ratchet, baseline, budget, timeout or ceiling would need raising**, or the census five-tuple would move.
13. **Any packet premise here is refuted by live code. The code wins; the packet stops.**

## 15. Figures ledger — EXECUTED AT PROMOTION, AT `41732a51`

⭐ **Lane AT executed every load-bearing figure itself. Nothing below is inherited from the design lane's `d7b7d225`, and where a figure moved between the two bases it is recorded as a deviation in §13.**

⚠ **PROVENANCE, STATED EXACTLY (see E7).** Every figure was first executed at `c73c17ef`. After the foreign `41732a51` landed mid-promotion, the figures marked **⟳** below were **re-executed at `41732a51`** and are identical; the rest were measured once at `c73c17ef` over bytes the substrate diff proves unchanged between the two commits. **No figure in this packet is a figure nobody ran at a base this packet names.**

**EXECUTED BY LANE AT (promotion), each exit captured in-shell:**

- ⟳ **The defect, re-located by symbol at this head** — the `symbolKeys` loop at `:471-496`, status-blind arm at `:488-495`, quoted verbatim in §3.1. **Zero `status` references in the loop**; `TERMINAL_PACKET_STATUSES` unchanged at `:43`.
- ⟳ **`validate:packets`** — at base, before the manifest entry: `valid: 23 packets (0 READY)`, `TRUE_EXIT=0`. With MX-1's entry live: **`valid: 24 packets (1 READY)`, `TRUE_EXIT=0`**.
- ⟳ **The three dispatch-surface suites**, through `gate-mutex.sh --run` — **3 files, 34 tests passing**, `TRUE_EXIT=0`, at base and again with the promotion in the tree.
- ⟳ **`requiredSymbols` census** — 174 total, 174 on terminal packets, 0 on `READY`; 23 packets, `LANDED 22` / `SUPERSEDED 1`; **zero non-terminal packets** before this promotion.
- ⟳ **The reservation simulation** — MX-1's exact five paths against the live manifest: **`DUPLICATE_CHANGE_PATH_ERRORS = 0`**, first as a simulated row and again with the entry actually written.
- ⟳ **`IA-2` terminal** — `SUPERSEDED` in both `PACKET_MANIFEST.json` and `INDEX.md`, re-confirmed through the validator's own index/manifest join.
- ⟳ **Target effective lines** — `implementation-packets.mjs` **540**, `implementation-session.mjs` **645**; `max-lines` **undefined** for both and for `tests/scripts/**` by `npx eslint --print-config`. Neither is a hot file; neither has a door.
- ⟳ **The three hot-file figures** — `OutputContainer.jsx` **599** of 600, `peaceTerms.js` **797** of 800, `informationStatecraft.js` **780** of 800, executed under the enforcer's own rule with `skipBlankLines` and `skipComments`. Identical at both bases.
- ⟳ **All thirteen `requiredSymbols` rows** — substring probe against each named file: `MISSING=0`.
- ⟳ **`retiredSymbols` token collision** — searched across `scripts/`, `src/` and `tests/`: no matches. The token is genuinely new.
- ⟳ **The census five-tuple** — `2409/365/2044/19960/5635` at `:4015`, re-read after the foreign commit and **unmoved**, with all five shown structurally unmovable by this manifest (§3.6).
- ⟳ **The `CLAIM_RE` scan** over this packet's own prose, the drafted `PACKET_STANDARD.md` sections, and the index row — **0 hits** against the live literal at its one home, with `INDEX.md` measured before and after to prove the promotion mints no new claim key.
- **The consumer census** *(source read; bytes proved unchanged across the base move)* — all four `requiredSymbols` read sites in `implementation-session.mjs`, zero in `implementation-gate.mjs`, and every `Object.keys`/`Object.entries` in the three consumers accounted for as capsule-internal. No exact-key validation anywhere.
- **The fixture census** *(source read; bytes proved unchanged across the base move)* — the capsule is asserted by `toMatchObject` and by a digest recomputed from its own remainder, never against a stored literal; no existing test would red on an added capsule field.
- ⚠ **One pre-existing red, proven foreign and banked:** `tests/docs/enforcement-claims.test.js` reds at this base on **six** naked claims, all in files this promotion does not touch — four in `docs/FABLE_VALIDATION_QUEUE.md`, one in `docs/GOLDEN_SHIFT_LEDGER.md`, one in `docs/implementation/packets/foreign-policy/IN-0C.md`. Its exact failure identity is **banked** in `scripts/.test-ratchet-baseline.json` (16 entries), so it does not red the ratchet. ⛔ **Not this packet's to repair**, and the implementer must not repair it either. ⚠ `tests/lint/proseNumerics.test.js` carries its own banked entry and walks `src/` only, so no docs change in this promotion can reach it.

**EXECUTED BY LANE AR (design), re-runnable:** the option comparison and its rejection grounds; the `d7b7d225` collision simulation that produced CR-AR-1; the drafted validator block; the hot-file measurement at that base.

**NOT RUN, and deliberately the implementer's:** **B9** — both typecheck windows. **B10** — the full 17-step gate. Both are wave-end acts, not promotion acts.
