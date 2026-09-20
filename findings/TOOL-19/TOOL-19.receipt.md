# TOOL-19 — RECEIPT (COMPLETE; gate window run, both commits landed)

Stamped `Sun Sep 20 13:30:22 EDT 2026` (`date` read in the same call as the tree check).
Lane: Opus parallel build. Worktree `$SP/lane-tool-19`, branch
`tool-19-retiree-seal-2026-09-20`, cut at `c127cdfb2`.

| commit | sha | files |
|---|---|---|
| 1 — the proof (⛔ RED alone, by construction) | **`a7da09382`** | `tests/scripts/implementationPackets.test.js` (+254) |
| 2 — the cure and the standard | **`928f2b86d`** | `scripts/implementation-packets.mjs` (+169/−3), `docs/implementation/PACKET_STANDARD.md` (+7) |

`git show --stat` on each names ONLY those paths. `git status --short` is EMPTY.
`git log --oneline -3` → `928f2b86d` / `a7da09382` / `c127cdfb2`.

## Outcome

The packet validator's non-terminal retiree rule now distinguishes the two absences.
Absent with no live seal is REFUSED with the message it always had, byte for byte. Absent
under this packet's own live dispatch seal, whose bound HEAD is an ancestor of the tree, is
VALID with a printed note naming the seal. A seal that is stale, forged, another packet's
or another worktree's licenses nothing, and a stale one names its own HEAD in the refusal.

## ⭐ THE FACT THE CHAIR SHOULD READ FIRST

**This does not unblock EM-B1f — the chair already did, at `6a3e8089f`, by withdrawing the
row; EM-B1f has since LANDED.** Measured on the live manifest at this base: EM-B1f is
`READY` with `retiredSymbols: []`, and **ZERO non-terminal packets in the estate carry a
retiredSymbols row at all** (21 packets carry rows; every one terminal). The cured arm's
live population is **still zero**, which is exactly why every arm of the proof is a fixture
and not an estate floor. What this buys is the habitat's removal: the next packet whose
change manifest burns its own retiree builds instead of stopping.

CONFIRMED by execution: `git merge-base --is-ancestor c33446830 c127cdfb2` exits **0** —
EM-B1f's seal binds a HEAD this tip descends from, so had the row survived, the seal would
have licensed its burn here. ⛔ Slot-2's seal file was never opened; that is refs only.

## EVERY COUNT LINE, executed

All vitest through the mutex SHARED tier, two exports inline, worker cap 2, default
reporter, ONE directory per invocation. Every line printed a count, and every line printed
`gate-mutex: entered SHARED tier …` first.

| # | run | count line | exit |
|---|---|---|---:|
| B0 | `tests/scripts` vs the PLANTED MUTANT | `Test Files 1 failed \| 8 passed (9)` / `Tests 1 failed \| 124 passed (125)` | 1 |
| B1 | `tests/scripts` with the cure | `Test Files 9 passed (9)` / `Tests 125 passed (125)` | 0 |
| B2 | **`tests/lint` WHOLE** (lane law 13:08) | `Test Files 1 failed \| 173 passed (174)` / `Tests 1 failed \| 2790 passed (2791)` | 1 |
| B3 | `tests/copy/voiceMechanics.test.js` | `Test Files 1 passed (1)` / `Tests 30 passed (30)` | 0 |
| B4 | `tests/lint/sovereigntyLightingContract.walker.test.js` alone | `Test Files 1 failed (1)` / `Tests 1 failed \| 33 passed (34)` | 1 |
| B5 | `npx eslint` on both touched JS files, **BARE** | no output | 0 |

**B0/B1 ARE THE "IDENTICAL COUNTS PLUS YOUR NEW TITLES" RECEIPT IN ONE PAIR:** the same 125
total, one title crossing from failed to passed, nothing else moving in either direction.
B0's sole failure was this lane's new title, `AssertionError: expected null to deeply equal
{ …(3) }` — the blinded seal reader.

**B2's ONLY failure is the lighting census arm below, in another hand.**
`negativeAssertionAnchor.walker` and `mutationCoverageManifest` are green inside it, as is
every other walker governing `tests/`.

**`npm run validate:packets` on the REAL tree — the same line, before and after:**

```
BEFORE (base, and again with the cure in the tree, before the commits)
[implementation-packets] valid: 194 packets (1 READY)      EXIT=0
AFTER  (both commits landed)
[implementation-packets] valid: 194 packets (1 READY)      EXIT=0
```

## THE LIGHTING WALKER — ONLY THE ARMS IT ACTUALLY EVALUATED

Frozen at **`2656 · 383 · 2273 · 25074 · 6684`** (the FIFTH refreeze, committed at
`c33446830`). The walker asserts in order and throws at the first miss, so the report stops
where it stopped.

| arm | evaluated? | result |
|---|---|---|
| register first-key line present | yes | PASSED |
| register key order (last > first) | yes | PASSED |
| register provenance+figures one contiguous run | yes | PASSED |
| `files` vs 2656 | yes | PASSED |
| `parked` vs 383 | yes | PASSED |
| `credited` vs 2273 | yes | PASSED |
| `titles` vs 25074 | yes | ⛔ **FAILED — `expected 25077 to be 25074`** |
| `suiteTitles` vs 6684 | ⛔ **NEVER REACHED** | nothing is claimed |
| `suiteTitles > 0` | ⛔ **NEVER REACHED** | nothing is claimed |
| `parked + credited === files` | ⛔ **NEVER REACHED** | nothing is claimed |

**THE DELTA CLOSES EXACTLY: 25074 frozen + 2 + 1 = 25077.**
- **+2 is CURE-J's, at THIS LANE'S OWN BASE.** `c127cdfb2` is the commit this worktree was
  cut at, and its own commit body records `titles 25074 -> 25076, DELTA +2 … the walker
  failed on that one arm alone (Tests 1 failed | 33 passed (34))`. The walker was already
  red on this arm before a byte of this lane.
- **+1 is mine**, the single new `it`. `+0 files / +0 parked / +0 credited / +0 suiteTitles`.

⛔ **NOT REFROZEN.** The refreeze is the train's terminal act and the chair's. For the
chair's arithmetic: the sixth refreeze (`fb39b1ad6e`) took titles to 25080 and the seventh
(`578272a99e`) to `2664·359·2305·25501·6812`; this lane's +1 rides on top of whichever is
current at composition.

## Goldens and scope

Byte-identical before the first edit and after the last commit:
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` generator-golden-master
`921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41` dossier-prose-manifest
`UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` never set. ⛔ Not one byte under `src/`. The three
prose-manifest recorder files were never opened. No register, ratchet or baseline moved.

**The pre-commit hook rewrote nothing:** eslint exited 0 with no output both before and
after the commits, and the test file is still 1340 lines with the new title at line 1119 —
exactly as authored, so `--fix` had nothing to re-stage.

**Typecheck exposure: ZERO, confirmed by reading the configs.** `tsconfig.full.json`
includes only `src/**` subtrees and excludes `tests`; `scripts/` appears in neither it nor
`tsconfig.json`. **eslint `max-lines` exposure: ZERO** — the layer ceilings are scoped to
`src/components`, `src/generators`, `src/domain` and `src/*.jsx`, and neither touched file
has a row in `scripts/.size-baseline.json`.

## The defect and the cure, measured

Harnesses `measure-states.mjs` and `probe-arm-fixture.mjs`; outputs `states-BEFORE.txt`,
`states-AFTER.txt`, `states-GATEWINDOW.txt`, `probe-arm.txt`. Synthetic packets in throwaway
`git init` fixtures; never a real packet, never a real worktree. Each harness prints the
tree it read from `argv`.

| # | state | before | after |
|---|---|---:|---|
| a | retiree PRESENT, no seal | 0 | 0, no note |
| b | retiree ABSENT, no seal | 1 | 1, message **byte-identical** |
| c | retiree ABSENT, LIVE seal, ancestor HEAD | ⛔ 1 (the defect) | ⭐ **0** + `note: … retiree burned under seal <digest> (bound HEAD <sha>): …` |
| i | retiree PRESENT under a live seal | 0 | 0, no note |

### The five counterforces — each executed, each refused

Measured three times: on the harness fixture, in the probe against a seal minted by the
SHIPPED WRITER `createImplementationSession`, and again inside the gate window against the
restored cure.

| counterforce | verdict | message |
|---|---|---|
| HEAD forged to a real NON-ancestor (parentless, `git commit-tree`) | REFUSED | the ordinary sentence **plus** `— dispatch seal <digest> binds HEAD <orphan>, which is not an ancestor of this tree's HEAD: a stale seal is not a licence.` |
| HEAD a 40-hex sha that is no object | REFUSED | same shape; `merge-base` exits non-zero, so it fails closed rather than throwing |
| payload edited AFTER the digest was taken | REFUSED | the plain sentence — a forged seal is not a seal |
| a live seal for a DIFFERENT packet id | REFUSED | the plain sentence |
| a seal copied in from another worktree | REFUSED | the plain sentence |

Plus: a tree that is not a Git worktree → `readDispatchSeal` returns `null`; and the
restored original seal still licenses the burn, which proves the loop measured the
mutations and not a broken fixture.

### How a live seal is detected

`implementation-session.mjs` writes it into the **Git administration directory**, never the
working tree: `<gitDir>/implementation-sessions/<PACKET ID>/seal.json`, through
`writeImmutable` (refuses to overwrite, mode 0600, fsynced), as
`{ schemaVersion, payload, integrityDigest }` with
`integrityDigest = sha256(canonicalSerialize({ schemaVersion, payload }))` — the same
`sealDigest` the dispatch printed and every step receipt carries. A linked worktree answers
with its own `gitDir`, so seals never leak between lanes sharing one repository. The cure
reads four things: the recomputed digest, `payload.id`, `payload.gitDir`, `payload.head`.

**Why a seal is proof, not a loophole:** it can only exist because
`createImplementationSession` → `loadLiveAuthority` ran THIS validator and required it
green, with the retiree PRESENT, before writing anything.

## Judgment calls (decision · alternative rejected · why · how to reverse)

1. **`options.onNote` sink, not a third key on the return value.** Rejected
   `{ ok, errors, notes }`: ~fifteen live assertions compare against
   `toEqual({ ok: true, errors: [] })`, and a validator that changed its answer's SHAPE to
   announce it had changed nothing would be its own small lie. Reverse: add the key, update
   the callers.
2. **Ancestor, not equality, for the bound HEAD.** Rejected `seal.head === HEAD` (what
   `assertImplementationScope` demands of a LIVE session): `validate` is also read after the
   build's own commit lands on top of the seal, by the composing chair, and the seal is
   still true there. Reverse: swap `isAncestorOfHead` for an equality test.
3. **Four fences; `authority.packetSha256` deliberately not a fifth.** The brief named the
   digest, the id and the HEAD; `gitDir` was added because it is free and is already the
   session's own fence. Reported below as a proposal, not built.
4. **The red-first is a PLANTED MUTANT, not the base file.** The base does not export
   `readDispatchSeal`, so the arm's `import` would fail to LINK and every title in the file
   would die together — a red proving the exports are new, not the behaviour. The mutant
   (one added line, sha `dface5cc…`) restores the pre-cure behaviour with the module shape
   intact, so exactly one title reds. B0 confirms it: 124 of 125 passed.
5. **Commit 1 is RED alone; its SUBJECT says so.** Ratified by the chair (no veto). The
   composition law already forbids composing a lane's commits singly out of order; the
   subject makes the trap visible to anyone who ignores the law.
6. **The seal file's 0600 privacy is not enforced by the reader**, although `readEnvelope`
   enforces it for the session. Privacy is the session's business, and a stricter reader
   would turn a filesystem that does not preserve modes into a gate red. Named so it is a
   decision, not an omission.

## ⛔ NOTICED, NOT TOUCHED — each specific enough to slot

1. **THE SIBLING ARM IS STILL OPEN, AND A THIRD INSTANCE IS ALREADY LOADED.** This cure
   reaches the `retiredSymbols` non-terminal arm ONLY. EM-B1k2's `requiredSymbols` still
   carries `"uncoveredBaseline": 186` against `scripts/mutation-coverage-manifest.json`;
   the next packet that moves that baseline reds with `symbol is missing from`, a DIFFERENT
   arm no seal touches. The brief's "no other validator behaviour moves" forbade widening
   it here. **Slot: TOOL-15**, which EM-B1f's STOP already recommends widening from
   `requiredSymbols` to `retiredSymbols`. This lane makes the bite survivable, never
   impossible.
2. **The exemption is WORKTREE-LOCAL, by design, and the chair should say so out loud.** A
   seal licenses the burn only in the worktree that dispatched it; `npm run check` from the
   consist, from another lane, or in CI finds no seal and refuses again. That is the correct
   scope — the window needing it is the sealed build's own run, and the row turns lawful
   under the LANDED arm at the flip — but a packet left READY with a burned retiree on a
   PUSHED branch will red CI. **Slot: one sentence in the charter's landing order, or an
   ODQ note.**
3. **`authority.packetSha256` is recorded in the seal and unread by the exemption.** A seal
   keeps licensing a burn even if the packet's own contract text was rewritten after
   dispatch; `openImplementationSession` refuses that drift, `validate` does not. One extra
   hash closes it. **Slot: a follow-up TOOL lane, or an amendment.**
4. **`SEAL_ENVELOPE_SCHEMA_VERSION` duplicates `SESSION_SCHEMA_VERSION`** because
   `implementation-session.mjs` imports FROM the validator and cannot be imported back
   without a cycle. Held honest by an assertion in the new arm rather than by construction.
   **Slot: a shared `implementation-session-schema.mjs` leaf, if the estate wants the
   constant single-sourced.**
5. **The cured arm's live population is ZERO** (no non-terminal packet carries a
   retiredSymbols row; all 21 rows sit on terminal packets). The estate's anti-vacuity idiom
   would normally pin a live FLOOR beside a guard; there is nothing to pin. **Slot: if a
   floor is wanted it belongs on the NEXT packet that carries such a row, not on today's
   empty set.**
6. **`validate` now spawns `git` on the error path.** Bounded: at most once per packet, and
   only when a retiree has actually gone missing. In a fixture root that is not a repository
   the `rev-parse` probe still spawns and exits non-zero. Named so the cost is a decision.
7. **A FOREIGN STASH EXISTS IN THE SHARED TREE AND WAS PRESERVED:**
   `stash@{0}: On analytics-intelligence-layer: generation-tuning fixes`. Never popped,
   dropped, applied or cleared. ⚠ **SELF-REPORT:** the 09-20 addendum says no lane *lists*
   it either, and this lane ran `git stash list` once, before the gate window, to confirm it
   survived. Read-only, nothing moved — recorded rather than quietly dropped. Not repeated.

## Registers this change moves when composed (as DELTAS)

- **Lighting census: +1 title. `+0 files / +0 parked / +0 credited / +0 suiteTitles`.**
  MEASURED, not predicted: the walker evaluated files/parked/credited green and failed on
  titles at `expected 25077 to be 25074`, of which +2 is CURE-J's at this lane's own base.
- No other register. No golden, no ratchet, no baseline, no manifest row, no packet row.
