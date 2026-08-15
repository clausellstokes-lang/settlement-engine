# INFRA / RN-A0 — the three name-collision renames

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `cf12c9768bea3619a71574cafdd4c4b820922f63`
- **Train:** `rn-1`, member **1 of 4** — the ladder's first rung and the train's green prefix
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c691af9fe6ade05097857699829771062058b289e55e0445aba2eee9498e64fa`, measured at this
  packet's verified base. ⚠ RN has **no family preamble** and PACKET_STANDARD forbids
  inheriting another volume's; this packet's home is `packets/infrastructure/`, the same
  home as `EST-A/B/C` and the `EFF-M*` machinery, so the INFRA preamble is this packet's
  OWN home preamble rather than a borrowed one.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§64.1** (the five-arm ladder adopted;
  `FRIENDLY_LABELS` is **RENAMED not merged**) · **§64.5** (`BOND_KINDS` joins A0 as a
  sibling rename row) · **§64.4** (the census question is RULED RE-POINT) · **§74.2** (an
  un-stamped family stays at four members) · **§101** (the `rn-1` compile ACCEPTED, door 1
  opened) · **§103.4** (TE18 dispatched on `rn-1` at this base).
- **Compile of record:** `laneTC18-RN1-PLAN.md` §4.1, §5.1, transcribed here.
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`,
  branch `claude/composite-r4`.

---

## §1 · THE DEFECT CLASS, AND WHY IT HAS NO RUNTIME SYMPTOM

Three module-private identifiers under `src/domain` are each declared in more than one
module with **different membership**, so a reader who learns one meaning carries it to the
other site and is wrong. Nothing reds: both modules are internally consistent, every gate is
green, and the damage lands later, on the reader.

Measured at this base (`laneTC18-probe4.mjs`, re-executed by lane TE18 against a
`git archive` of this exact base):

| Name | Declared in | This packet renames |
|---|---:|---|
| `HOSTILE_LABELS` | **3** files | **ONE** — `conquestDoctrineStage.js` only |
| `FRIENDLY_LABELS` | **2** files | **ONE** — `conquestDoctrineStage.js` only |
| `BOND_KINDS` | **2** files | **ONE** — `intelActs.js` only |

**The renamed bindings are `const` and NOT exported**, so the change is unobservable from
any importer and from any test. That is precisely why this member is provably
output-neutral and why its manifest carries no fixture edit and no golden.

## §2 · THE EXACT CONTRACT

| File | Region | Change | Δ eff. lines |
|---|---|---|---:|
| `src/domain/worldPulse/conquestDoctrineStage.js` | `:88` | `const FRIENDLY_LABELS` → `const COALITION_FRIENDLY_LABELS`, and its one in-module read | 0 |
| `src/domain/worldPulse/conquestDoctrineStage.js` | `:89` | `const HOSTILE_LABELS` → `const COALITION_HOSTILE_LABELS`, and its one in-module read | 0 |
| `src/domain/spatial/intelActs.js` | `:42` | `const BOND_KINDS` → `const INTEL_BOND_KINDS`, and its one in-module read | 0 |
| `tests/lint/postureNameCollision.walker.test.js` | new arm | the three names each resolve to exactly ONE definition under `src/domain`, and the survivors keep theirs | +N titles |

**Every in-module read is enumerated**, so the rename is total and mechanical:
`conquestDoctrineStage.js` reads both sets at `:158` and `:159` and nowhere else;
`intelActs.js` reads `BOND_KINDS` at `:233` and nowhere else.

## §3 · ⛔ THE BOUNDARY THAT MATTERS MOST — THE SWEEP THAT IS FORBIDDEN BY NAME

`HOSTILE_LABELS` is declared in **THREE** files. **This packet renames ONLY
`conquestDoctrineStage.js`'s.**

- `src/domain/worldPulse/informationStatecraft.js` is a **HOT FILE** (780/800, headroom 20)
  and is **NOT** in this manifest.
- `src/domain/worldPulse/brokerageServicesRules.js` is out of scope entirely.

**A sweep-style rename across all three is the single most likely implementer error here and
is FORBIDDEN.** The residual two-file `HOSTILE_LABELS` collision is left standing
DELIBERATELY, and §4's walker arm pins it at exactly two so the non-cure is recorded rather
than forgotten.

Likewise:
- `BOND_KINDS`: `npcLadderState.js:406` holds the **exported** one and **KEEPS THE NAME**.
  Only `intelActs.js`'s module-private one moves.
- `FRIENDLY_LABELS`: `beliefMap.js:940` **KEEPS THE NAME**. Only
  `conquestDoctrineStage.js`'s moves.

## §4 · §64.4 DISCHARGED — AN HONEST RE-POINT, ZERO NEW TEST FILES

§64.4 rules the guard **RE-POINTS an existing lint suite** and requires this packet to name
which, with evidence.

**`tests/lint/postureNameCollision.walker.test.js`** is the host, and its own charter names
this packet's class verbatim: *"Two exports of one name in one domain tree is a defect with
no runtime symptom: both modules are internally consistent, every gate is green, and the
damage lands later, on the reader."*

It already ships a **pure, reusable scanner** — `definers(name)` / `exporters(name)` over a
`codeOnly`-blanked walk of `src/domain` — with guard-the-guard fixtures for definition
spellings, export spellings including `as` renames, and negative controls proving blindness
to calls, imports and prose. It already asserts *"resolves to exactly ONE definition under
`src/domain`."* **The new arm adds three names to an existing mechanism; it builds nothing.**

⭐ **What the re-point buys, measured at this base:** a new `tests/lint/` file would move the
lighting census's `files` and `credited` figures (exact-equality, sequenced), enter
`contractTestAntiVacuity`'s fail-closed scan, take a `negativeAssertionAnchor` ceiling of
**ZERO**, move the ratchet's `totalFiles`, and — since §102.3 — owe a
`scripts/mutation-coverage-manifest.json` row. **The re-point incurs none of them:** the host
is already enumerated, already carries its manifest row
(`kind:'rationale'`, ref `sp-c-posture-controls-executed-2026-08-06`), and the arm is a
widening of the invariant that row already documents rather than a second independent one.

## §5 · The change manifest (4 rows)

| # | Action | Path |
|---:|---|---|
| 1 | `MODIFY` | `src/domain/worldPulse/conquestDoctrineStage.js` — two module-private renames + their two reads |
| 2 | `MODIFY` | `src/domain/spatial/intelActs.js` — one module-private rename + its one read |
| 3 | `TEST` | `tests/lint/postureNameCollision.walker.test.js` — the RN-A0 arm |
| 4 | `TEST` | `tests/domain/intelActs.test.js` — no edit; named so the battery's own suite is on the record |

⛔ **No `CREATE` row** ⇒ the `validate:packets` LANDED-CREATE existence hazard cannot fire.

### 5.1 Scope budget

**2 existing logic-bearing production files modified — WITHIN the default hard budget of
three.** This member does not draw on §101.2's recorded wider budget; arms C and B1 do.

### 5.2 Prices measured NOT INCURRED

- **§92.2** certification-pattern: no file under `src/domain/certification/` is named.
- **§49/§50** flag mint: no flag; `simulationRules.js` untouched.
- **§85.4** registry mint: scanned both production files for
  `decisionFork|registerChooser|seededPick|makeChooser|forkRegistry` — **0 hits in each**.
- **§95.2** census burn: no ratchet entry paid off, no frozen inventory row removed.
- **§102.3** mutation-coverage row: the host file already carries its row (§4).
- **Coupling registry:** no import is added or moved; `couplingRegistrationGaps` is
  `leaves=0 missing=[]` for this member.

## §6 · Declared terminals

| Figure | Expectation | Why |
|---|---|---|
| Same-seed goldens | **UNMOVED** | the renamed bindings are module-private `const`s; no exported surface and no value changes |
| Lighting census | `titles` +N, `files`/`credited`/`parked` **UNMOVED** | new `it()` blocks in an already-CREDITED file; **no new test file** |
| `typecheck:ratchet` · `:domain:strict` | **UNMOVED at their exact floors** | a rename inside two modules; both ratchets sit at EXACT floors, any movement is a STOP |
| Hot files | **UNTOUCHED** | none of the four standing hot files is in this manifest (§3) |
| `negativeAssertionAnchor` | **UNMOVED** | the host is at ceiling **0** unanchored; this arm writes no bare negative |
| `validate:packets` | +1 packet, READY 1 → 0 at flip | this member's own promotion |

## §7 · ⛔ MANDATORY STOPS

1. **Any edit to `informationStatecraft.js` or `brokerageServicesRules.js`** → STOP. That is
   the forbidden sweep (§3).
2. **Any rename of `npcLadderState.js`'s exported `BOND_KINDS` or `beliefMap.js`'s
   `FRIENDLY_LABELS`** → STOP. Both keep their names by contract.
3. **Either typecheck ratchet moves off its floor** → STOP.
4. **A new OSR finding** → STOP. Never `--write`; a detector change requires a schema mint.
5. **Any membership change to either renamed Set** → STOP. This member renames; it does not
   re-derive. The coalition set's membership is **arm C's** row (§67.4).
6. **The lighting census `files` figure moves** → STOP. It means a new test file was created,
   which §4 forbids.

## §8 · Acceptance cases

| id | case |
|---|---|
| A1 | `tests/lint/postureNameCollision.walker.test.js` passes whole, including the new RN-A0 arm |
| A2 | each of `COALITION_FRIENDLY_LABELS`, `COALITION_HOSTILE_LABELS`, `INTEL_BOND_KINDS` resolves to exactly ONE definition under `src/domain` |
| A3 | `FRIENDLY_LABELS` now resolves to exactly ONE definition (`beliefMap.js`) and `BOND_KINDS` to exactly ONE (`npcLadderState.js`) |
| A4 | `HOSTILE_LABELS` still resolves to exactly TWO definitions — the deliberate residual, pinned so the non-cure is visible |
| A5 | `tests/domain/intelActs.test.js` and `tests/domain/espionageDoctrine.test.js` pass unchanged |
| A6 | `tests/domain/conquestExecutionWr8.test.js` and `tests/domain/razingExecutionWr8.test.js` pass unchanged |
| A7 | `tests/lint/seatVocabularyUnification.walker.test.js` passes unchanged |
| A8 | `npm run typecheck:ratchet` and `npm run typecheck:domain:strict` sit at their exact floors |

## §9 · Checks

```
npx vitest run tests/lint/postureNameCollision.walker.test.js
npx vitest run tests/domain/intelActs.test.js tests/domain/espionageDoctrine.test.js
npx vitest run tests/domain/conquestExecutionWr8.test.js tests/domain/razingExecutionWr8.test.js
npx vitest run tests/lint/seatVocabularyUnification.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
node scripts/implementation-packets.mjs validate
```
