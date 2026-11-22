# Settlement editor / EM-R4 — THE SETTLEMENT NAME IS HELD THROUGH ASSEMBLY: the mint RUNS at its exact draw position, spends its two draws on the shared ambient stream, and its result is DISCARDED under a held name

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line and takes `status`
  only when exactly one row matches. Every stamp, caveat and date goes on these continuation
  lines, never on the row.
  ⭐ MEMBER 4 of the re-entry family EM-R (design §22.2's build order: R0a · R0b · R1 · R2 ·
  R3 · **R4** · R5 · R0c · R6 · R7). It is compiled to the SIXTH amendment, which is
  LANDED (train EM-T13's first commit `7bc14e003`) and IS what the preamble line below
  measures at this version's read tip. Every citation in this packet is `path :: symbol` (§P2.22); no line address is
  carried anywhere but in the two places the TREE ITSELF addresses by line, and both are quoted
  as the register's own data rather than as this packet's citation.
- **Landed at:** `dcfe24f018364f94204de186ab313e6ef723f785` — the name held through assembly (version 3): the held name survives assembleSettlement's re-derivation; the writer-census row inherited from EM-R2 never re-added (207d); the line it rewrites retired on its own capsule row (227); built at dcfe24f01 on train EM-T16 stage 3
- **Packet version:** 3
  - ⭐ Version 3 is the CAPSULE repair only (2026-09-23, the chair, judgment 227; the build lane's STOP at `02e66ed63` after its seal): the capsule's `requiredSymbols[4]` — the one `assembleSettlement.js` line this member rewrites in place (`settlementName` → `settlement.name`) — now carries `retiredBy` citing ODQ §934.47 addendum 132 (§731.3's idiom, 948 landed rows), so `validate` (sealed check 8) discharges its absence after the edit; the deferred `_retiredSymbolsAtLanding` idiom (unprecedented in the estate) is retired as inert. ⛔ No contract, budget, acceptance case, change row or non-goal moved; the built bytes are re-applied byte-identical under the new seal.
  - Version 1 was the first cut, compiled against train EM-T12's landed tip `91cc9ef5a` by an
    Opus COMPILE seat (session cce01f87, 2026-09-22). It refutes NO clause of the charter's row.
    It narrows the charter's older wording by MEASUREMENT in one place — the "world facts" half
    of §22's R4 is not a packet (charter `:137` already reduced R4 to the NAME; the eight-edit
    table shows terrain and culture edits flowing through `config′` with no pin at all) — and it
    makes ONE design choice the design does not make: WHERE the consult sits. §0.C is the
    measurement that forces it.
  - **Version 2 (the FULL pre-proof at train EM-T16's stage-2a placement tip `5412caf7a`,
    2026-09-23) changes NO behaviour and SIX classes of fact, every one forced by a measurement
    and none by an opinion.** (a) **THE `pins` BINDING.** EM-R2 version 5 LANDED
    `const pins = ctx.__pins || null;` as the step callback's first statement, so the consult
    now REUSES that binding instead of re-spelling `ctx.__pins || null` — the narrowing version 1
    named as BUY-BACK-LEDGER row 2 is CONSUMED INTO THE BASELINE, not owed (§6 C1, §11 item 9;
    EM-R3's C3 makes a second binding of that name a STOP and this member obeys the same rule).
    (b) **THE IMPORT HUNK IS GONE.** The same landing widened
    `import { chooseOrPin, registerStep } from '../pipeline.js';`, so the member's three hunks
    are now TWO, the conditional `_retiredSymbolsAtLanding` row version 1 carried for the import
    is RESOLVED AND REMOVED, and the widened line joins `requiredSymbols` as the twelfth row.
    (c) **ONE NEW GOVERNING WALKER.** `tests/lint/heldKeyWriterCensus.walker.test.js` did not
    exist at `91cc9ef5a`; it landed with EM-R1 on train EM-T15 and it READS this member's ONE
    MODIFY path by name. It is now a sealed check, computed by §P7's interim rule (§10 item 2).
    (d) **EVERY ABSOLUTE RE-MEASURED:** the preamble hash, the effective-line figures
    (163 → **167** at the base, 164 → **168** after), the worker ceiling (`1396015` → **1392364**),
    `stamp.producerIndexFiles` (1,181 → **1,185**), the first-paint set (**270**), the three
    `cite:` addresses EM-R2 re-addressed (`:100 :119 :120` → **`:110 :129 :130`**, all three still
    ABOVE the insert) and the waiting-manifest population (36 → **54 files**).
    (e) **THE INSTRUMENT LIST WAS EXECUTED, NOT REASONED** (§7's delta table): the lighting
    classifier over the planted CREATE, the voice walker's own counter over the planted MODIFY,
    the entropy census's two arms, the eslint `Linter` with two controls, the worker-closure
    membership probe and the dry packet validator. (f) **JUDGMENT 196's TITLE LAW** is now a
    contract clause: every new `it` title begins `A<n> — EM-R4: ` and `EM-R4` was measured absent
    from every title in `tests/` (§9a).
- **Verified base:** `em-t16-r4-2026-09-23` at `63d046e758e220fbe45190763d044c6182016357`
  ⚠ Left for the chair's promotion stamp. **The revalidation sentence the chair will use:**
  *"Re-measured at `5412caf7a1dbd3a67f26feb369de0f07d550c58e` (read tip `read-tip-em-t15`,
  DETACHED, `git status --short` EMPTY before and after): the CREATE target
  `tests/generators/nameHeldThroughAssembly.test.js` ABSENT (`git ls-files --error-unmatch`
  `did not match any file(s) known to git`); the ONE MODIFY target present
  (`src/generators/steps/assembleSettlement.js`, 345 raw / 167 effective lines by eslint's own
  `Linter`); the REGISTER target present; all TWELVE `requiredSymbols` present VERBATIM at
  count 1 each; `retiredSymbols` EMPTY at DRAFT, with ONE row owed at the LANDED flip
  (`e.summary = renderStressSummary(e.type, settlementName, e.summaryRoll);` — the import row
  version 1 carried conditionally is RESOLVED AWAY, EM-R2 having landed the widening); the
  preamble measured `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d`, the
  SIXTH amendment. ⚠ RE-RUN `EM-R4.remeasure.sh` AT EM-R3's FLIP before placing: EM-R3
  version 2 MODIFIES the same file below this member's anchors."*
  ⛔ A `__BASE__` packet can NEVER pass `validate:packets`; validation is downstream of this
  stamp, never a precondition of it. The chair's placement replaces `__BASE__` with the form
  `parsePacketHeader` parses into BOTH fields — ``- **Verified base:** `em-t16-em-r4-<date>` at
  `<the train base's 40-char sha>` `` — with the value ALONE on its line (§P9(c)).
- **Last revalidated:** `1b073009f003c6d0bdf4a12de719ca54f0f8cc98` — stamped by the chair at train EM-T16's landing (the member landed at 36d82a469; judgment 231).
- **Depends on:**
  - **EM-R3** (version 2, READY on train EM-T16's stage 2a) — ⛔ **THE ONE LIVE ORDERING
    DEPENDENCY.** It is the ONLY other non-landed packet that MODIFIES
    `src/generators/steps/assembleSettlement.js` (MEASURED at this version's read tip by the dry
    packet validator, which reports exactly that one duplicate and no other), and two non-landed
    packets may not name the same change path. This member is placed on EM-R3's FLIP, where the
    duplicate clears (judgment 206a). ⚠ **A PACKET, NOT LANDED CODE** — its §7 restricts it to
    the two `assertPowerEconomyFreshness` calls and the one `reconcilePowerStructure` call, all
    of which sit BELOW every anchor of this member and below its insert point, and its own row
    says "not `generateSettlementName` (EM-R4's), not the stress re-render". Judgment 134 binds:
    `EM-R4.remeasure.sh` re-proves all twelve required symbols at the LANDED flip.
  - **EM-R2 — LANDED** (version 5, train EM-T16 stage 1, at `16c7346c1`, flipped `17fcf092b`).
    It is no longer a dependency but a SUBSTRATE: it carries the widened pipeline import, the
    `const pins = ctx.__pins || null;` binding this member reuses, and the `chooseOrPin`
    `DISCOVERY_EXEMPT` row that pays the writer census for this member too (judgment 207d — this
    member adds NO second row).
  - **EM-R1 — LANDED** (train EM-T15) — pins cloned on entry at the runner, per channel (design
    §22 ruling 6; judgment 170b). The reason this member declares NO local clone: a record-built
    bag handed to `runPipeline` used to be written through into the caller's record in 42 of 63
    rows. MEASURED landed at this read tip: `src/generators/pipeline.js` carries the entry clone,
    the context clone and the merge re-clone.
  - **EM-B2a4 — LANDED** (packet version 4, train EM-T13) —
    `generateSettlementPipeline :: generateSettlementPipeline` forwards `pins`. A REACHABILITY
    dependency: it is the caller path by which `rederive` reaches this consult. It is not a
    change path of this member.
  - **LANDED:** EM-P0 (the runner's pins channel and the ambient binding), EM-B2a2
    (`src/generators/pipeline.js :: chooseOrPin` and `:: _PINS_KEY`), EM-B2a3 (the two landed
    step consults whose shape this one copies), EM-R0a
    (`src/domain/edit/recordRegister.js :: RECORD_CLASSES`, which classes `name` HELD).
- **Collision group:** `src/generators/steps/assembleSettlement.js` — shared with **EM-R3**
  alone (MEASURED: the dry validator over a scratch copy of the estate manifest with this
  capsule appended reports exactly
  `duplicate change path across packets: src/generators/steps/assembleSettlement.js (EM-R3, EM-R4)`
  and nothing else; EM-R2's and EM-R5's reservations cleared when they LANDED). It is EXPECTED,
  it is the reason this member is stage 3, and it clears at EM-R3's flip (judgment 206a).
  `scripts/mutation-coverage-manifest.json` is ROW-KEYED (TOOL-27, §P10.8) and is shared with
  EM-R1b under a DISTINCT `rowKey`, which is why the validator reports no duplicate there.
  This member takes NO other change path:
  `src/domain/prose/holderTable.js` is deliberately avoided (§0.C and §6 C3) and
  `src/generators/pipeline.js` is deliberately avoided (no new primitive is minted, §6 C4).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Version 1's figures were produced over the read tip
  `read-tip-em-t12` at `91cc9ef5a`; **VERSION 2 RE-PRODUCED EVERY ONE over `read-tip-em-t15`,
  DETACHED at `5412caf7a`** — plain `git`, `grep`, `shasum` and plain `node` probes, each harness
  given its tree through an explicit environment variable and NO default, every output written
  through an absolute path under the lane's own scratch, and `git status --short` in the read
  tree EMPTY (0 paths) before and after. No vitest, no `eslint --fix`, no `tsc`, no build, no
  playwright, no npm script, no gate mutex. The commands and their outputs are in
  `EM-R4.preproof.report.md` (§1–§7) and the delta from version 1 in `EM-R4.SEMANTIC-DIFF.md`.
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE
  CHAIR). MEASURED at this version's read tip with `shasum -a 256`:
  `125c693214235a81bf4f2b38506b621859a35e0325ff2ea58d335b4e0681a99d` — **the SIXTH amendment,
  LANDED** (its own §P0 line reads "THE SIXTH AMENDMENT (2026-09-22) IS WRITTEN IN PLACE"), which
  is the law this packet is written to. ⚠ The fifth's hash
  `fdecd426…dacc9e7c`, which version 1 carried, is superseded.

---

## §0 · THE MEASUREMENT — the charter's row read against the tree

The charter's row is one line: **EM-R4 | the settlement NAME held through assembly**
(`docs/implementation/charters/EDIT-MODE-TRAIN.md`, the amendments of 2026-09-19 17:25 EDT, the
EM-R family's build-order table), reduced there from §22's wider row by the amendments of
2026-09-19 16:5x EDT: *"**EM-R4** is reduced to the settlement NAME held through assembly (world
facts already flow as `config′`)"*. Nothing in the tree refutes it. Four measurements shape the
contract.

### §0.A — THE MINT, ITS DRAWS AND ITS POSITION · CONFIRMED

`src/generators/npcGenerator.js :: generateSettlementName` takes exactly **two** draws — a prefix
index and a suffix index, both `Math.floor(_rng() * …)` over `NAMING_DATA`'s
`settlementPrefixes` / `settlementSuffixes`. It is called from exactly one place in the estate:
`src/generators/steps/assembleSettlement.js :: registerStep('assembleSettlement'`, inside the
expression `const settlementName = (effectiveConfig.customName?.trim()) || generateSettlementName(culture);`.
Measured on the 63-row structured sample through the recon's own counting root:

    draws taken INSIDE generateSettlementName: 2 draws × 63 rows
    calls to the mint per generation:          1 call  × 63 rows

Those two draws land on the **assembly step's own ambient stream**, which
`generatePressureSentence` and `generateArrivalScene` read one to three draws later
(`src/generators/steps/assembleSettlement.js` calls both immediately after the F8 re-render).
The step's `inAssemblySubstream` fork exists precisely to isolate the coherence enrichment from
that stream; the mint is NOT inside it.

### §0.B — SKIP versus CONSUME, PRICED · CONFIRMED, and it is the member's whole subject

§22 ruling 1 says a writer of a held key "leaves it as it is". §22.1 correction 1 rules that a
held writer on a SHARED stream **consumes its draws and discards the result**. Measured with a
bag holding **only** `name` — so nothing else in the seam can account for the difference:

| arm | bag | reproduces the record |
|---|---|---|
| control | `{}` | **63/63** |
| CONSUME | `{ name: <the record's own name> }` | **63/63** |
| SKIP | `{ name: <the record's own name> }` | **0/63** — `pressureSentence` ×63 and `arrivalScene` ×63, one leaf each |

⭐ And the damage is **not bounded by the two draws**. With the same name returned either way,
the assembly step's TOTAL draw count matches the unpinned run in 63/63 rows under CONSUME and in
**0/63** under SKIP — and in 9 of the 63 rows the deficit is 9 to 24 draws, not 2, because the
re-phased shared stream sends later assembly writers down different variable-draw branches. The
estate has not recorded that figure before; it is this compile's own contribution to correction 1.

### §0.C — ⭐ WHERE THE CONSULT SITS, DECIDED BY MEASUREMENT (the one choice the design leaves open)

Three placements are possible. Two are wrong, and the tree says why.

1. **Inside `generateSettlementName`.** Refuted twice. (a) The mint takes no pin argument and no
   ambient pin channel exists — the bag reaches a STEP, under `src/generators/pipeline.js :: _PINS_KEY`.
   (b) Decisive: the call site short-circuits on a custom name, so on that path the mint is never
   called. Measured on three tiers — with `customName` set, mint calls = 0 and the step's draw
   total falls by exactly 2 (46→44, 63→61, 99→97). A consult inside the mint therefore **loses
   the held name** whenever the record was generated with a custom name; executed against the
   real pins channel, the pin was lost 3/3.
2. **Wrapping the mint expression in `chooseOrPin`.** This is the SKIP of §0.B: `chooseOrPin`
   does not advance the stream when a pin is present, so the two draws are never taken.
   Executed: the record reproduces 0/63.
3. **After the settlement literal, over the already-computed value.** The mint runs first,
   unconditionally, at its exact position; `chooseOrPin` is then handed the minted value as a
   **no-draw thunk**. This IS consume-and-discard, expressed in the estate's own landed
   primitive, with no new export and no runner edit. Executed: inert 63/63, reproduces 63/63,
   the pin taken 63/63, and the pin wins over a custom name 3/3.

⭐ Placement 3 has a second, independent virtue that decides it over any variant placed above the
literal. `src/domain/prose/holderTable.js :: HOLDER_SOURCES` carries THREE live `cite:` rows that
address `src/generators/steps/assembleSettlement.js` **by line**, and
`tests/lint/proseWiringCensus.walker.test.js` reads them against the live tree. Every line this
member inserts sits BELOW all three cited lines, so none of them moves, `holderTable.js` is **not
a change path of this member**, and the member does not collide with EM-R0d there. An
edit placed above the literal would owe the re-address EM-R2 already paid, on the same rows,
in the same file.

⭐ **RE-MEASURED AT VERSION 2's READ TIP, AND THE REGISTER'S OWN DATA IS QUOTED AS DATA.** EM-R2
version 5's landing re-addressed all three rows — `:100 :119 :120` became **`:110 :129 :130`**
(`git diff 91cc9ef5a 5412caf7a -- src/domain/prose/holderTable.js`, the only lines that moved
naming this file). Version 1's placement re-measurement PREDICTED `:111 :130 :131`; the landed
fence is one lower on each, which is exactly why judgment 134 forbids measuring a sibling's
predicted fence. The rule is unchanged and now has more margin: the settlement literal's closing
`};` is at raw line 181 and the insert goes beneath it, so all three cited lines stand more than
fifty lines ABOVE the first inserted line.

### §0.D — WHAT A HELD NAME BUYS, AND WHAT IT TOUCHES · CONFIRMED

With the name held and a culture change applied (§22.1's "what held": *a culture change KEEPS THE
TOWN'S NAME*), measured on village, town and city: the held name is kept 3/3, **0** leaves speak
the freely-minted name, and exactly five leaf paths carry the held one — `name`,
`stress[].summary`, `stressors[].summary`, `pressureSentence`, `arrivalScene`. The first recon's
`summaryRoll` hazard is neutralised: `src/generators/stressNarrative.js :: renderStressSummary`
re-renders each summary at assembly, so it must be handed the HELD name, which is the member's
second hunk.

With a deliberately altered name in the bag the same five keys move and **no other record key
does** — 36 other top-level keys byte-identical on every corpus row (name 63/63, arrivalScene
63/63, stress and stressors 54/63, pressureSentence 51/63; the short figures are the rows whose
records carry no stress entry or whose pressure line does not name the town).

### §0.E — WHAT THIS MEMBER DOES NOT COVER, AND WHOSE IT IS

- The **world-fact half** of §22's original R4 row is NOT a packet: world facts reach the
  re-derivation as `config′` through `src/generators/steps/resolveConfig.js`, and the recon's
  eight-edit table shows terrain and culture edits flowing with no pin at all. The charter
  already reduced the row (`:137`); this packet records the reduction and takes the name alone.
- The **runner's clone** is EM-R1's. The **roster** is EM-R2's. The **power replay and the
  freshness assert** are EM-R3's. The **trace partition** is EM-R5's. The **merge** is EM-R0c's.
  A **rename** is not re-derivation at all — it goes through the cascade (§12.3) and EM-R6.
- `stress` is RE-DERIVED, never held (§22.1 correction 5). This member does not hold it; it only
  makes the re-render speak the held name, which is what makes held and re-derived `stress`
  agree 126/126.

---

## §1 · Reconciled authority

| source | what it rules here |
|---|---|
| `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22, ruling 1 | HELD FACTS ARE FINAL; the held set names **the settlement's NAME**, and every writer of a held key — "the name mint" is listed by name — consults the pin FIRST. |
| §22.1 correction 1 | A held writer on a SHARED stream **consumes its draws and discards the result**; only a writer inside its own named child stream is skipped. This member is correction 1's only instance outside `enrichNpcCoherence`. |
| §22.1 correction 5 | `stress` is re-derived, not held; held and re-derived agree only BECAUSE the name is held. |
| §22.2 ruling 11 | The family's first cut CONSUMES AND DISCARDS at every held writer outside `enrichNpcCoherence`; a draw-SKIP is a later, measured optimisation that lands only after the trace partition (EM-R5). This member is the first cut. |
| §22 ruling 2 | Re-derivation recomputes READINGS only; a reading may move more than the edit strictly implies. `pressureSentence` and `arrivalScene` are readings that read a held fact. |
| §22 ruling 6 | Pins are deep-cloned on entry, always — EM-R1's, not this member's. |
| §22 ruling 9 | With NO edit, re-derivation reproduces every record key. This member's A3 is that criterion, restricted to its own key: with the record's own name held, 63/63. |
| charter, amendments of 2026-09-19 16:5x and 17:25 EDT | EM-R4 is the settlement NAME held through assembly; each EM-R member is golden-sensitive (no pins ⇒ byte-identical on the full 525-row master) and prices its bytes at pre-proof. |
| judgment 170a (`findings/COMPILE-EM-R1-2026-09-22/CHAIR-RULING.md`) | A registered STEP's `rng` is a named child fork, so a held STEP is skipped at its fork; CONSUME-AND-DISCARD applies to a FUNCTION-LEVEL writer inside a step that shares that step's stream — "the name mint's two draws on the assembly step's ambient stream" is the ruling's own example, and this is the member that builds it. |
| `PACKET_STANDARD.md` | statuses; the hard scope budget; exact contracts; `requiredSymbols` naming only what exists now; registration obligations priced at compile; the STOP conditions; the completion receipt. |

---

## §2 · Outcome

When this member has landed, the generation pipeline honours a held settlement name without
moving one byte of unpinned output:

1. `src/generators/steps/assembleSettlement.js` mints the name exactly as it does today —
   the same expression, in the same place, spending the same two draws on the same shared stream,
   with the same `customName` short-circuit.
2. Immediately after the settlement literal it consults the runner's pin channel for `name`
   through `src/generators/pipeline.js :: chooseOrPin`, handing the ALREADY-MINTED value in as a
   thunk that draws nothing. With no pin the consult returns that value and the record is
   unchanged; with a pin the minted value is **discarded** and the held name stands.
3. The F8 stress re-render speaks `settlement.name`, so a held name reaches
   `src/generators/stressNarrative.js :: renderStressSummary` and no persisted summary can speak
   a name the record does not carry.
4. A seven-case battery proves all of it over the golden corpus, including the two negative
   controls that convict the two wrong placements.

---

## §3 · Hard scope budget

| dimension | this packet | cap |
|---|---|---|
| Handwritten files | **2** (1 MODIFY + 1 CREATE) | ≤12 |
| New logic-bearing leaves | **0** | ≤2 |
| Existing logic files modified | **1** | ≤3 |
| New/changed effective production lines | **+1, MEASURED AT VERSION 2's READ TIP** — `src/generators/steps/assembleSettlement.js` **167 → 168** effective (**345 → 351** raw: one statement, four comment lines and one blank), eslint's own `Linter` under `max-lines` with `skipBlankLines` + `skipComments` (§P9), with its two controls EXECUTED: the base re-linted gives **167** again, and a five-comment-line edit moves it by **0** | ≤400 |
| Each new leaf | n/a (no new leaf) | ≤250 |
| Acceptance cases | **7** | ≤8 |
| Hot files | **none** — `assembleSettlement.js` at 167 effective lines is far under any ceiling, and this member adds one line | — |

Measured headroom after the edit: `assembleSettlement.js` **168** effective lines. ⚠ The
absolutes 163/164 and 325/331 version 1 carried were measured at `91cc9ef5a`, before EM-R2's
landing; the DELTA is unmoved and it is the delta the standard binds (§P2 row 5).

---

## §4 · Sealed dispatch, preflight, and THE BLOCK

Check by check, against `scripts/implementation-session.mjs`, at the train base the chair sets:

| check | verdict |
|---|---|
| branch name matches the packet's `Verified base` branch | the chair stamps `em-t16-em-r4-<date>`; the value stands ALONE on its line. |
| ancestry: the branch's base is the packet's verified sha | the chair cuts the lane branch from the train base. |
| substrate unchanged since the verified base | the ONE MODIFY target and the REGISTER target must be byte-identical to the base; the CREATE target ABSENT. Re-measured at placement (`_placementReMeasurement`). |
| CREATE targets absent | `tests/generators/nameHeldThroughAssembly.test.js` — measured ABSENT at `5412caf7a` (`git ls-files --error-unmatch` → `did not match any file(s) known to git`; no file on disk). MEASURED over the chair's 54 waiting manifest files: EM-R4's is the ONLY one that names it. |
| git-clean | the lane worktree is never moved or committed to after its dispatch. |

**THE BLOCK.** This member is BLOCKED from being non-terminal at the same time as any other
non-landed packet that MODIFIES `src/generators/steps/assembleSettlement.js`. Measured today that
is EM-R2 alone; EM-R3's compile may add itself. The block lifts the moment those packets are
LANDED — it is a sequencing fact, not a defect in either packet.

### §4a · THE QUESTIONS ONLY THE CHAIR CAN ANSWER (version 2)

⭐ Version 1's Q1 and Q2 are ANSWERED by the chair's own judgments and are recorded here as
settled, not re-asked: **judgment 206** places EM-R4 as train EM-T16's STAGE 3, on stage 2a's
flip, and **judgment 182b**'s "EM-R3 first" is exactly what that placement does. Version 1's Q4 is
answered by MEASUREMENT (§0.C's re-measured addresses: the three `cite:` rows stand at `:110
`:129` `:130`, all above the insert, so the member owes nothing in `holderTable.js`). What is
left:

1. **Is the `retiredSymbols` row at the LANDED flip accepted as written** (the F8 re-render line
   retired, its `settlement.name` successor promoted)? *Recommendation: yes* — RE-MEASURED at
   `5412caf7a`: the text is quoted by no entry of the estate's 228-packet
   `docs/implementation/PACKET_MANIFEST.json` and by none of the chair's 54 waiting manifest
   files. The import row version 1 carried beside it is RESOLVED AWAY (EM-R2 landed the
   widening), so exactly ONE row is owed at the flip.
2. **Is `tests/lint/heldKeyWriterCensus.walker.test.js` accepted into the SEALED `checks`?**
   *Recommendation: yes* — it landed with EM-R1 after this packet was compiled, it names this
   member's ONE MODIFY path as `ASSEMBLY_FILE` and reads its source, and §P7's interim computed
   rule (`git grep -l -F 'assembleSettlement' -- tests`) returns it. It reads SOURCE only, runs
   no generation and reads no `dist`, so it costs the sealed gate seconds. MEASURED GREEN under
   this member's edit: its A3(b) discovery equality is over the set of imported symbols CALLED,
   and this member adds no import and calls only `chooseOrPin` (a landed `DISCOVERY_EXEMPT` row)
   and `renderStressSummary` (likewise), both already called; its A5 already declares
   `generateSettlementName`'s stream `SHARED` and names this member's law in its own comment.
3. **Is `tests/generators/rosterFinalUnderHeldRoster.test.js` correctly left OUT of the sealed
   `checks` and named in §10 as a NON-SEALED read instead?** *Recommendation: yes* — it is
   EM-R2's landed battery over the same step's pin seam and its A1 is the nearest landed twin of
   this member's inertness claim, so the build lane must run and quote it; but §P7's computed
   rule does not return it (it spells neither `assembleSettlement` nor any symbol whose call
   shape this member changes), and it carries seven arms at 600,000–900,000 ms timeouts, which a
   SEALED array would pay again at every re-seal.
4. **Is the member still NOT the train's byte-arm holder?** *Recommendation: yes* — judgment 206d
   names **EM-R1b** the holder of train EM-T16. This member states its membership proof and its
   predicted delta under the holder's bound (§7's byte row) and carries no row on
   `tests/build/generationWorkerLazy.test.js`. ⚠ Version 1's named buy-back (BUY-BACK-LEDGER
   row 2: narrowing `ctx.__pins || null` to `pins`) is CONSUMED — EM-R2 landed the binding, so
   the narrowing is in this version's baseline and this member holds NO buy-back of its own. The
   train's cover is the EARLY BUY-BACK lane (ledger row 9, judgment 214c), whose brief names
   "small rises from EM-R3/EM-R4" in the sum it is buying back.

---

## §5 · Verified tree contract

Every row was RE-FOUND BY SYMBOL at `5412caf7a` and proved by a quoted command in
`EM-R4.preproof.report.md` §2; every `requiredSymbols` text was re-run VERBATIM with `grep -c -F`
and read **count 1**, all twelve.

| # | path :: symbol | the fact | how proved |
|---|---|---|---|
| 1 | `src/generators/npcGenerator.js :: generateSettlementName` | the mint; exactly two `_rng()` draws; one call per generation, 63/63 | `git grep -n -P 'generateSettlementName'`; the counting-root probe |
| 2 | `src/generators/steps/assembleSettlement.js :: registerStep('assembleSettlement'` | the ONE call site; the `customName` short-circuit; `provides: ['settlement']`, `mutates: ['powerStructure','stress']` | the file read whole |
| 3 | `src/generators/pipeline.js :: chooseOrPin` | `(pins, key, draw)`; returns `pins[key]` when the key is an OWN property, else `draw()`; **does not advance the stream when a pin is present** | the file read whole |
| 4 | `src/generators/pipeline.js :: _PINS_KEY` | `'__pins'`; the runner seeds `ctx.__pins` and DELETES it at the end; exempt BY NAME from the undeclared-write scan | the file read whole |
| 5 | `src/generators/pipeline.js :: runPipeline` | the partial-pin guard fires only when SOME of a step's `provides` are pinned; `name` is no step's `provides`, so a `{ name }` bag throws nowhere — 0 throws in 63/63 | the file read whole; executed |
| 6 | `src/domain/edit/recordRegister.js :: RECORD_CLASSES` | classes `name: 'HELD'` | `git grep -n -P "HELD'" -- src/domain/edit/recordRegister.js` |
| 7 | `src/generators/stressNarrative.js :: renderStressSummary` | `(type, name, roll)` — the summary embeds the settlement name | `git grep -n -P 'export (const\|function) renderStressSummary'` |
| 8 | `src/domain/prose/holderTable.js :: HOLDER_SOURCES` | THREE live `cite:` rows address `assembleSettlement.js` by line — at version 2's read tip they read `:110`, `:129` and `:130`, quoted here as the REGISTER'S OWN DATA and not as this packet's citation; `tests/lint/proseWiringCensus.walker.test.js` reads them live, and `tests/lint/sourceCitationIntegrity.walker.test.js`'s ARM 1 reds only on a PAST-EOF address, which a file that GROWS cannot produce | `git grep -n -F 'steps/assembleSettlement.js:'` |
| 9 | `tests/generators/pipelinePinnedChoosers.test.js :: A5` | EM-B2a3's landed fence: `ASSEMBLE_TOTAL = ['stress','name','population']`. Its bag is `assembleInstitutions`'s own `provides` and contains no `name`, so this member's consult returns the minted value there and the fence is unmoved | the file read at its A5 and A7 |
| 10 | `tests/generators/stressSummaryName.test.js :: F8` | asserts every summary contains `s.name`; unpinned, `settlement.name === settlementName`, so the argument swap is behaviour-neutral and this test is its proof | the file read |
| 11 | `tests/build/generationWorkerLazy.test.js :: WORKER_BUNDLE_CEILING_BYTES` | **`1392364`** at version 2's read tip, zero slack (the ceiling was LOWERED twice since version 1's `1396015` — judgments 187 and 203 — and is never raised); this member is NOT the holder and carries no row on this file | `git grep -n -P 'WORKER_BUNDLE_CEILING_BYTES'` |
| 12 | `src/generators/steps/assembleSettlement.js :: import { chooseOrPin, registerStep } from '../pipeline.js';` | ⭐ **NEW AT VERSION 2.** EM-R2 LANDED the widening, so the post-edit state of C1's import clause is already the tree's state: this member PRESERVES it byte-identical and changes it by ZERO bytes. The conditional `_retiredSymbolsAtLanding` row version 1 carried for this line is RESOLVED AND REMOVED | `grep -c -F` → 1; the pre-EM-R2 form `import { registerStep } from '../pipeline.js';` reads **0** |

### §5a · PATH DISJOINTNESS, RE-MEASURED AT VERSION 2's READ TIP

⭐ **THE INSTRUMENT IS THE VALIDATOR ITSELF, RUN DRY ON A SCRATCH COPY** (nothing in the tree
written): the estate manifest at `5412caf7a` holds **228** entries and validates with **0 errors,
0 warnings**; appending this member's capsule adds exactly **two** errors and no warning —

    EM-R4.packetPath does not exist: docs/implementation/packets/settlement-editor/EM-R4.md
    duplicate change path across packets: src/generators/steps/assembleSettlement.js (EM-R3, EM-R4)

The first is the body not yet being in the tree (the chair's placement writes it). The second is
the MEASURED, EXPECTED, stage-3 collision that clears at EM-R3's flip (judgment 206a). **There is
no other duplicate**, which is the positive proof that:

- **EM-R1b** (READY, stage 2a) shares only `scripts/mutation-coverage-manifest.json`, ROW-KEYED
  (TOOL-27, §P10.8) under a DISTINCT `rowKey`
  (`invariants['tests/lint/transientChooserRegistry.walker.test.js']` against this member's
  `invariants['tests/generators/nameHeldThroughAssembly.test.js']`); its own §0.2 states the same
  disjointness from the other side. Its `src/generators/pipeline.js` edit is a file this member
  only READS by symbol (rows 3, 4, 12), and its `_TRANSIENT_CHOOSERS` filter narrows the
  partial-pin rule's `choosers` list, which is still keyed on `step.provides` — where `name` does
  not appear at all.
- **EM-R0b** (READY) shares NOTHING: its four paths are three CREATEs under `src/domain/edit/`
  and one under `tests/domain/`.
- **THE EARLY BUY-BACK LANE** (ledger row 9, judgment 214c) is disjoint by its own brief, which
  forbids `steps/assembleSettlement.js`, `scripts/mutation-coverage-manifest.json` and any
  `tests/generators/*` a member CREATEs. Its four files resolve at this tip to
  `src/generators/servicesGenerator.js`, `src/data/institutionalCatalog.js`,
  `src/generators/power/rulingStructure.js` and `src/domain/activeConditions.js`: **none is a
  `requiredSymbols` path of this member** and none is a change path.
- No waiting packet CREATEs `tests/generators/nameHeldThroughAssembly.test.js` (measured over the
  chair's **54** waiting manifest files: only EM-R4's names it).

---

## §6 · Exact contracts

### C1 — `assembleSettlement`'s step callback: the held-name consult

**The mint is untouched.** The expression
`const settlementName = (effectiveConfig.customName?.trim()) || generateSettlementName(culture);`
keeps its exact text and its exact position. It runs on every path, pinned or not, so its two
draws are spent where they are spent today. This is the whole of §22.1 correction 1.

**One statement is inserted, immediately after the settlement literal's closing `};` and before
the F8 re-render closure.** It reads exactly:

```js
  // §22 ruling 1 + §22.1 correction 1: the settlement's NAME is a HELD fact. The mint above
  // RUNS at its exact draw position and its result is DISCARDED when the name is held - the two
  // draws it spends are on the assembly step's SHARED ambient stream, which the pressure
  // sentence and the arrival scene read 1-3 draws later. Skipping them moves both in 63/63.
  settlement.name = chooseOrPin(pins, 'name', () => settlementName);
```

- The pin key is the RECORD PATH `name`, exactly as `src/generators/pipeline.js`'s `Pins` typedef
  requires; it is the key `src/domain/edit/recordRegister.js :: RECORD_CLASSES` classes `HELD`.
- ⭐ **`pins` IS EM-R2's LANDED BINDING AND IS REUSED, NEVER RE-SPELLED.** At version 2's read tip
  `src/generators/steps/assembleSettlement.js` opens its step callback with
  `const pins = ctx.__pins || null;` (count 1) and the file's two landed consults —
  `generateCoherence(settlement, coherenceRng, pins)` and
  `chooseOrPin(pins, 'npcs', () => UNPINNED)` — already read it. **A SECOND BINDING OF THAT NAME
  IS A STOP** (§11 item 9), the identical rule EM-R3's C3 carries for the same file. ⛔ This
  REPLACES version 1's `ctx.__pins || null` spelling, compiled before EM-R2 landed; the narrowing
  version 1 held in reserve as BUY-BACK-LEDGER row 2 is now CONSUMED INTO THE BASELINE rather
  than owed, and this member holds no buy-back of its own.
- The thunk `() => settlementName` **draws nothing**: the draw already happened. `chooseOrPin`'s
  no-advance property is therefore harmless here and the consume is exact.
- ABSENT, NULL and UNDEFINED: `chooseOrPin` consults `Object.prototype.hasOwnProperty`, so a bag
  carrying `name: null` or `name: undefined` yields exactly that value — the record's own value,
  including its absence, is what a held bag means. The member adds no coalescing of its own.
- ⛔ The comment text carries NO em dash and NO exclamation point:
  `src/generators/steps/assembleSettlement.js` holds **count 0** in
  `tests/copy/.voice-mechanics-generators-baseline.json`, and tier 5 is shrink-only from zero.

**One existing line is rewritten in place**, inside the `rerenderStressSummary` closure:

```js
        e.summary = renderStressSummary(e.type, settlement.name, e.summaryRoll);
```

so the F8 re-render speaks the HELD name. Unpinned this is the same string it is today.

**The import at the top of the file ALREADY reads the post-state and is PRESERVED byte-identical:**

```js
import { chooseOrPin, registerStep } from '../pipeline.js';
```

⭐ **RESOLVED AT THE PRE-PROOF (version 2).** MEASURED at `5412caf7a`: that exact line is present
at count 1 and the pre-EM-R2 form `import { registerStep } from '../pipeline.js';` is present at
count **0** — EM-R2 version 5 landed the widening. So this member performs **no import hunk at
all**, changes that line by **zero bytes**, and the conditional `_retiredSymbolsAtLanding` row
version 1 carried for it is REMOVED; the line is now `requiredSymbols` row 12 instead (§5).
⛔ NEVER ADD A SECOND `from '../pipeline.js'` IMPORT (§11 item 3): the member's edit is TWO
hunks, not three.

### C2 — What the step does NOT change

`deps`, `reads`, `readsVersion`, `provides`, `mutates` and `phase` are untouched. `__pins` is the
runner's reserved channel, exempt from the undeclared-write scan BY NAME in
`src/generators/pipeline.js :: _PINS_KEY`, so reading it declares nothing and
`tests/generators/dataFlowContract.test.js` and `tests/generators/stepMetadataSync.test.js` cannot
move. The settlement literal is byte-identical, including `name: settlementName`.

### C3 — `holderTable.js`: NOT a change path, and the rule that keeps it so

`src/domain/prose/holderTable.js :: HOLDER_SOURCES` carries three `cite:` rows addressing
`src/generators/steps/assembleSettlement.js` by line. **Every line this member inserts is below
all three.** The member therefore owes no re-address and takes no row in that file. §11 STOP 2 is
the rule stated as a stop; §10 runs
`tests/lint/proseWiringCensus.walker.test.js` and
`tests/lint/sourceCitationIntegrity.walker.test.js` as its proof.

### C4 — What the member REFUSES

- It mints **no new primitive**. A `consumeOrPin` export on the runner would be a second way to
  say what `chooseOrPin` plus an already-computed value already says, and it would put this
  member on `src/generators/pipeline.js`, which is EM-R1's.
- It takes **no local clone** of the bag (EM-R1's rule) and **no ambient pin channel**.
- It does **not** hold `stress` (§22.1 correction 5) and does not touch `summaryRoll`'s deletion.
- It does **not** skip any draw. The 3,324 + 985-draw skip inside `assembleInstitutions` and
  `cascadePass` is a later optimisation that §22.2 ruling 11 gates behind EM-R5's trace partition.
- It does **not** edit `src/generators/npcGenerator.js`. The mint stays a pure name function.

---

## §7 · Exact change manifest

| action | path | what changes | eff Δ | contract |
|---|---|---|---|---|
| `MODIFY` | `src/generators/steps/assembleSettlement.js` | the `registerStep('assembleSettlement', …)` callback, **TWO hunks** (version 1's third, the import widening, is DONE — EM-R2 landed it): ONE consult statement inserted below the settlement literal, reusing EM-R2's landed `pins` binding, and the F8 re-render's second argument changed in place to `settlement.name`. ⛔⛔ **EVERY INSERTED LINE SITS BELOW THE LITERAL'S CLOSING `};`**; ⛔⛔ **NEVER ADD A SECOND `from '../pipeline.js'` IMPORT AND NEVER A SECOND `pins` BINDING**; ⛔ no em dash and no exclamation point in any inserted line (EXECUTED: the planted text reads em 0 · bang 0 through the voice walker's own `countFile`) | **+1 eff (MEASURED 167 → 168)** | C1 · C2 · C3 |
| `CREATE` | `tests/generators/nameHeldThroughAssembly.test.js` | the battery; adds exactly 7 literal `it`s under ONE literal `describe`, straight-line, with its own `vitest` import and no identifier named `it`, `test` or `describe` | n/a (test) | §9 |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | ONE row, `invariants['tests/generators/nameHeldThroughAssembly.test.js'] = { "kind": "rationale", "ref": "generators-tree-admitted-subject-coupled-2026-08-30" }` — the ADMITTED_TREE_REF shape `tests/generators/pipelinePinnedChoosers.test.js` already carries. No other row, no other key; `uncoveredBaseline` UNMOVED | n/a | — |

**Not change-manifest rows, and why (each measured):**

- `src/domain/prose/holderTable.js` — no cited line moves (C3).
- `src/generators/pipeline.js` — read by symbol only; no new export (C4).
- `src/generators/npcGenerator.js` — the mint is preserved, not edited (C4).
- `docs/content/wiring-census.json` — RE-MEASURED at `5412caf7a`: `stamp.files` has **7** entries
  (all under `src/domain/display/stateProse/`) and names no file this member modifies, so the
  `stale-bytes` arm cannot fire; `stamp.producerIndexFiles` is **1,185** (a NUMBER, read from the
  census, not a list — the step-15 correction) and moves **+0**, this member creating no `src/`
  module. The path appears in NEITHER §7 NOR the manifest NOR `checks`, and no lane runs
  `node scripts/wiring-census.mjs` for this member. ⚠ The 1,181 version 1 quoted was the figure at
  `91cc9ef5a`; the delta is what binds (§P2 row 5).
- `tests/lint/.lighting-census-baseline.json` — an interior red; the member states the DELTA and
  the train's terminal refreeze is the chair's (§P2 row 1).
- `tests/lint/.prose-numerics-baseline.json` — RE-MEASURED at `5412caf7a`: it carries **no** row
  addressing `src/generators/steps/assembleSettlement.js` (`grep -c` → 0), so the line-addressed
  baseline cannot be shifted by this member.
- `tests/build/generationWorkerLazy.test.js` — ⛔ **NOT A ROW: THIS MEMBER IS NOT TRAIN EM-T16's
  BYTE-ARM HOLDER** (judgment 206d names EM-R1b, and §P2.11 gives a budget's TEST row to exactly
  one member of a train). Its membership proof and predicted delta are the byte row below.
- `tests/lint/heldKeyWriterCensus.walker.test.js` — a GOVERNING WALKER, not a change path: it
  READS this member's MODIFY path and is a sealed check (§10 item 2), and this member moves none
  of its rosters (the byte row's neighbour, below).

**Registration obligations, priced as DELTAS — EVERY ROW EXECUTED AT `5412caf7a`, NOT REASONED
(§P2.19–21):**

| register | this member's delta | the measurement |
|---|---|---|
| sovereignty-lighting census | `files +1 · parked +0 · credited +1 · titles +7 · suiteTitles +1` | ⭐ **EXECUTED, through the walker's OWN `parkReasonsFor` / `liveTitlesIn` / `liveSuiteTitlesIn`** over the planted CREATE (own `vitest` import widened with `vi`, a `vi.hoisted` recorder, ONE literal `describe`, SEVEN straight-line literal `it`s, no identifier named `it`/`test`/`describe`): `parkReasons=[] titles=7 suiteTitles=1` ⇒ **CREDITED**. The controls, same run: `tests/generators/pipelinePinnedChoosers.test.js` `parkReasons=[] titles=7 suiteTitles=1` and `tests/generators/stressSummaryName.test.js` `parkReasons=[] titles=4 suiteTitles=1`. The predicted red MESSAGE has the shape `expected <N+1> to be <N>`; NO refreeze is run here and the register's live tuple is the chair's terminal input, never asserted (§P2 row 1) |
| `scripts/mutation-coverage-manifest.json` | **+1 row**, ROW-KEYED; `uncoveredBaseline` **UNMOVED** | `ENFORCER_DIRS` READ at this tip from `tests/lint/mutationCoverage.shared.mjs` holds EIGHT directories INCLUDING `tests/generators`, so the CREATE owes its row; `ADMITTED_TREE_REF` read from the same producer is `generators-tree-admitted-subject-coupled-2026-08-30`, the exact `ref` the row carries and the exact row `tests/generators/pipelinePinnedChoosers.test.js` already holds. `invariants` reads **728** rows at this tip and this member's `rowKey` is ABSENT |
| entropy root census — `createPRNG(` site counts | `src/domain` **+0** (36) · whole-`src` **+0** (47) | EXECUTED: `git grep -o -F 'createPRNG(' -- src/domain` → 36, `-- src` → 47; `assembleSettlement.js` holds **0** before and after (a consume-and-discard uses the EXISTING stream) |
| entropy root census — `WORLD_ROOTS` read sites | **+0** | the member reads no world root |
| ruin-filter roster | **+0 — OUT OF THE DISCOVERY SET** | EXECUTED through the estate's own `tests/helpers/codeOnlySource.js :: codeOnly`: `/\.institutions\b/` over the CODE-ONLY text of `assembleSettlement.js` returns **0** hits before, and the planted text adds no such read |
| `tests/build/vendorPdfLazy.test.js` ST-2 goods roster | **+0** | the member imports no goods identity half-table (`GOODS_IDENTITY_SURFACE` / `GOODS_CHAINS_SURFACE` are `src/data/goods/*`, unreachable from this member), and the file is not in the eager set the arm polices |
| voice-mechanics tier 5 (`src/generators/**`) | **+0 · the directory is AT its budget, 28 of 28** | ⭐ **EXECUTED through the walker's own `countFile`**: live `src/generators` totals `{em:28,bang:0}` over 114 files, EQUAL to `tests/copy/.voice-mechanics-generators-baseline.json`'s 7-row totals `{em:28,bang:0}`; `assembleSettlement.js` reads `{em:0,bang:0}` at the base (no baseline row) and the PLANTED file reads `{em:0,bang:0}` too. ⛔ One em dash in an inserted line reds the directory by name |
| tuning inventory / `tests/lint/tuningRegister.walker.test.js` | **UNMOVED** | the member adds no numeric literal and no named numeric constant to any `src/` file; the only numerals it plants are inside a comment |
| first-paint eager set (`vite.config.js :: EAGER_FIRST_PAINT_MODULES`) | **+0**, and the set is **270** at this tip | EXECUTED by IMPORTING the exported set (never a hand list, never a replica): `assembleSettlement.js` and `pipeline.js` are both OUT of it, so no first-paint byte moves and `CLOSURE_BUDGET_BYTES` is untouched |
| generation-worker closure (`WORKER_BUNDLE_CEILING_BYTES` **1392364**, zero slack) | ⭐ **MEMBERSHIP: IN. Predicted delta +30 B, stated ×2 = +60 B upper bound, PLAUSIBLE** | EXECUTED membership probe (reads no `dist`, so it cannot skip): walking `from`, dynamic and side-effect specifiers from `src/workers/generation.worker.js` gives a **230**-module closure that CONTAINS `src/generators/steps/assembleSettlement.js`. The cost is one minified statement plus one mangled-local-to-property change; the comment block costs nothing (minifiers strip comments). ⛔ **THIS MEMBER CARRIES NO ROW ON THE ARM** — EM-R1b is the train's byte-arm holder (judgment 206d) and its bound covers the SUM; the EARLY BUY-BACK lane (ledger row 9, judgment 214c) is buying ≥ 1,600 B back against a worst sum its own brief prices as "EM-R2 +161 B, EM-R1b +400…700 B, small rises from EM-R3/EM-R4". A RISE BEYOND THE HOLDER'S BOUND IS THE OWNER's (§P11.2) |
| `tests/lint/heldKeyWriterCensus.walker.test.js` (EM-R1's landed writer census) | **+0 on every roster** | READ WHOLE at this tip. Its A3(b) equality is over IMPORTED symbols CALLED in the assembly body; this member adds no import and calls only `chooseOrPin` and `renderStressSummary`, both already called and both already `DISCOVERY_EXEMPT` rows (judgment 207d: **NO second row is added**). Its A2 step roster keys on `provides`/`mutates`, which C2 leaves byte-identical. Its A5 already declares `generateSettlementName`'s stream `SHARED` and states this member's own law in its comment |
| `tests/lint/moduleScopeCwdRatchet.test.js` | **+0 — OUT OF SCOPE** | its `GUARDED_DIRS` read at this tip are `tests/build` and `tests/lint` ONLY; this member CREATEs under `tests/generators` |
| the `src/domain` any-cast and strict ratchets (`tests/lint/domainAnyCastBaseline.test.js`, `domainStrictBaseline.test.js`, `tsconfig.domain-strict.json`) | **+0 — NEITHER GOVERNS** | this member creates NO `src/` file at all (judgment 213's "a new file is held at zero" has no purchase) and modifies no `src/domain` file. The TYPE FLOOR config that governs its one MODIFY path is `tsconfig.full.json`, whose `include` names `src/generators/**/*.js` |
| observed-shape register / writer-reach | **+0** | the member adds no domain reader of a save-time key and no new settlement-field reader under `src/domain/edit/**` |
| prose-numerics | **+0** | the member renders no number, and the baseline carries no row addressing its MODIFY path |

---

## §8 · Ordered coding sequence

1. **K-GATE, BEFORE THE FIRST EDIT.** At the lane's base, run the golden and prose pins
   (`tests/property/generatorGoldenMaster.test.js`, `tests/property/dossierProseManifest.test.js`)
   and record the exit lines. A red here is the train's, not the member's.
2. **The battery FIRST, RED.** Write `tests/generators/nameHeldThroughAssembly.test.js` whole and
   run it against the UNEDITED step. A1 and A7 pass (they are true of the base tree); A2, A3, A4,
   A5 and A6 must FAIL. Quote the five failures — that is the member's red-first proof, and A3's
   failure is the one that separates this member from a no-op.
3. **MEASURE, DO NOT WIDEN, THE IMPORT.** `grep -c -F "import { chooseOrPin, registerStep } from '../pipeline.js';"`
   in `src/generators/steps/assembleSettlement.js` must read **1** and
   `grep -c -F "import { registerStep } from '../pipeline.js';"` must read **0**. EM-R2 landed the
   widening; if either reads otherwise the lane's base is not the one this version was proved at
   and that is a STOP. Likewise `grep -c -F 'const pins = ctx.__pins || null;'` must read **1**.
4. **Insert the consult statement** immediately after the settlement literal's closing `};`,
   spelling `pins` and never `ctx.__pins || null`. Verify by reading the diff that the FIRST
   changed line in the file is BELOW the literal.
5. **Change the F8 re-render's second argument** to `settlement.name`.
6. **Run the battery.** All seven green.
7. **Add the mutation-coverage row.**
8. Run §10's commands in order. The validator LAST; no generator is among them.

---

## §9 · Acceptance matrix

| # | Case | Home | Authorised by |
|---|---|---|---|
| **A1** | INERT WITH NO PINS: no bag and `pins: {}` leave a ≥40-row stride of the golden corpus byte-identical to the committed fixture. Counterforce: the same arm with a planted `name` pin reds. | `tests/generators/nameHeldThroughAssembly.test.js` | §7's `CREATE` row |
| **A2** | THE DRAWS ARE CONSUMED: under `{ name }` the assembly step's own stream takes the same number of draws as the unpinned run, every row. Anti-vacuity: a skip reads 2 fewer at the mint and 9–24 fewer over the step in 9 of 63 rows. | same | §7's `CREATE` row |
| **A3** | THE RECORD REPRODUCES under its own name, 63/63 — the arm that convicts BOTH wrong placements (skip 0/63, in-mint 0/63) where a naive golden arm passes for all three. | same | §7's `CREATE` row |
| **A4** | THE PIN IS TAKEN and only what speaks the name moves: five leaf paths, 36 other record keys byte-identical. | same | §7's `CREATE` row |
| **A5** | THE `customName` SHORT-CIRCUIT keeps the held name; the anchored negative is the in-mint placement, which loses the pin 3/3. | same | §7's `CREATE` row |
| **A6** | THE CLASS REGISTER IS THE SOURCE: `RECORD_CLASSES.name === 'HELD'` by import, the pin key never re-typed. | same | §7's `CREATE` row |
| **A7** | NO NEW STREAM AND NO NEW FORK: zero `createPRNG(` in the file, and the step's fork labels under a pin are set-equal to the unpinned run's. | same | §7's `CREATE` row |

### §9a · ⭐ THE NEGATIVE CONTROLS THIS BATTERY MUST CARRY

Measured at this compile by applying each candidate implementation in memory and running the real
pins channel over the 63-row sample:

| implementation | A1 (goldens) | A3 (reproduces) | A5 (customName) |
|---|---|---|---|
| **the contract** (consult after the literal) | 63/63 | **63/63** | pin wins 3/3 |
| SKIP (consult wraps the mint expression) | 63/63 | **0/63** | pin wins 3/3 |
| IN-MINT (consult wraps only the mint call) | 63/63 | **0/63** | **pin LOST 3/3** |

⛔ A1 passes for all three. A battery that tested only golden-neutrality would pass a member that
does the wrong thing in two different ways. A3 is the convicting arm and A5 is the discriminator.

### §9b · ⭐ THE TITLE LAW (judgment 196), MEASURED

**Every one of the seven `it` titles BEGINS `A<n> — EM-R4: `**, so each is UNIQUE in `tests/` and
a `vitest -t` run (which takes a REGEX, not a literal) selects exactly the intended arm. MEASURED
at `5412caf7a` over the whole `tests/` tree: the string `EM-R4` occurs in **zero** test titles and
in **zero** files at all, while the bare ids `A1`…`A7` are carried by many landed suites
(`pipelinePinnedChoosers.test.js` alone holds seven). ⛔ The battery's arms run under the runner
before the seal (judgment 196): all seven live in the ONE file `§7`'s CREATE row names,
`tests/generators/nameHeldThroughAssembly.test.js`, whose `describe` is
`'EM-R4 — the settlement name is held through assembly'` — also measured absent from `tests/`.

⛔ Construction rules the CREATE obeys, each with the instrument that convicts its breach:
its own `import { … } from 'vitest'`; **`it`, `test` and `describe` each bound EXACTLY ONCE** —
never as a variable or an arrow parameter (`OPENER_UNRESOLVED` parks the whole file and costs the
promised `credited +1`); ONE literal `describe` with straight-line literal `it`s, no `.each`, no
loop, no conditional registration, no nested describe; **no bare seed loop** — collect over the
corpus rows, then assert once (`tests/lint/seedLoopTotality.walker.test.js`); every set an arm
iterates IMPORTED from its producer, never re-typed (`tests/lint/contractTestAntiVacuity.walker.test.js`
Rule 2, which is exactly what A6 exists to satisfy); every negative carrying `// anchored:` on the
line IMMEDIATELY above the `expect` itself, never above a wrapped `expect`'s first line; and a
`vi.hoisted` recorder if A2/A5/A7 need one, because `vi.mock` is hoisted above this file's static
imports and a plain module-scope `const` recorder dies at load with
`Cannot access '…' before initialization` (the idiom is in `tests/generators/pipelinePinnedChoosers.test.js`).

---

## §10 · Verification commands

Run in this order; the validator last. Exit lines quoted in §12; never read a gate through a pipe
(`npm run check:tail`, or `sh scripts/gate-tail.sh <command…>`).

1. `npx vitest run --pool=threads --maxWorkers=2 tests/generators/nameHeldThroughAssembly.test.js tests/generators/stressSummaryName.test.js tests/generators/pipelinePinnedMode.test.js tests/generators/pipelinePinnedChoosers.test.js tests/generators/pipelineContract.test.js tests/generators/pipelineStrictMode.test.js tests/generators/dataFlowContract.test.js tests/generators/stepMetadataSync.test.js tests/generators/configPatchAllowlistWalker.test.js tests/generators/ghostFamine.test.js tests/generators/legitimacyBgConsistency.test.js tests/generators/tuningBatchE2.test.js`
2. `npx vitest run --pool=threads --maxWorkers=2 tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/seedLoopTotality.walker.test.js tests/lint/mutationCoverageManifest.test.js tests/lint/recordRegisterTotality.walker.test.js tests/lint/entropyRootCensus.walker.test.js tests/lint/ruinFilterRoster.walker.test.js tests/lint/tuningRegister.walker.test.js tests/lint/proseNumerics.test.js tests/lint/proseWiringCensus.walker.test.js tests/lint/sourceCitationIntegrity.walker.test.js tests/lint/generationForkRegistry.contract.test.js tests/lint/editDeclarations.walker.test.js tests/lint/worldGenerationClockSeam.walker.test.js tests/lint/noPremadeDeityPool.walker.test.js tests/lint/heldKeyWriterCensus.walker.test.js`
   ⭐ **`heldKeyWriterCensus.walker.test.js` IS NEW AT VERSION 2** and is a COMPUTED addition, not
   a hand-picked one: TOOL-26 (`scripts/governing-tests.mjs`) has still NOT landed at this read
   tip, so §P7's interim rule governs, and `git grep -l -F 'assembleSettlement' -- tests` returns
   EIGHTEEN paths of which this is the ONE absent from version 1's arrays — it did not exist at
   `91cc9ef5a` and landed with EM-R1 on train EM-T15. It names this member's ONE MODIFY path as
   `ASSEMBLY_FILE` and reads its source. It reads SOURCE and the live registry only, runs no
   generation and reads no `dist`, so it cannot skip and it costs the sealed gate seconds.
3. `npx vitest run --pool=threads --maxWorkers=2 tests/domain/distribution.test.js tests/domain/eventBatch.test.js tests/domain/schemaCanonicalShape.test.js tests/domain/simulationSpine.test.js tests/domain/stressorsStateProseDesk.test.js tests/domain/trace.coverage.test.js`
4. `npx vitest run --pool=threads --maxWorkers=2 tests/joins/conflictsSeam.test.js tests/joins/crisisTripleSync.test.js tests/joins/eventConditions.test.js`
5. `npx vitest run --pool=threads --maxWorkers=2 tests/pdf/exportDateSeam.test.js`
6. `npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js`
7. `npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js`
8. `npx vitest run --pool=threads --maxWorkers=2 tests/lint` — WHOLE, once, because this member
   CREATEs a test file and a CREATE opts into every walker governing its directory. Not a sealed
   `checks` array (the lighting walker reds by design under a train, and §P7 forbids a directory
   in a sealed array); run it and read it.
9. ⭐ **NAMED NON-SEALED READ (version 2):**
   `npx vitest run --pool=threads --maxWorkers=2 tests/generators/rosterFinalUnderHeldRoster.test.js`
   — EM-R2's landed battery over THIS step's pin seam, whose A1 ("inert with no pins: the golden
   corpus and the coherence tail are byte-unmoved") is the nearest landed twin of this member's
   own inertness claim. §P7's computed rule does NOT return it (the file spells neither
   `assembleSettlement` nor any symbol whose call shape this member changes), and its seven arms
   carry 600,000–900,000 ms timeouts, so it stays OUT of the sealed array and the build lane runs
   it once and QUOTES its exit line in §12. Judgment 148's law is satisfied by reading it whole
   here: this member becomes the first importer of nothing, and adds no import at all.
10. `node scripts/implementation-packets.mjs validate`

---

## §11 · Mandatory STOP conditions

1. ⛔ **The mint's expression is not byte-identical.** If the edit moves, wraps, gates or
   re-indents
   `const settlementName = (effectiveConfig.customName?.trim()) || generateSettlementName(culture);`,
   STOP. That expression IS the consume; a member that changes it is building the skip §0.B
   prices at 63/63 rows.
2. ⛔ **Any inserted line sits at or above the settlement literal's closing `};`.** STOP: three
   `cite:` rows in `src/domain/prose/holderTable.js` address this file by line and the member
   would owe a re-address it does not carry.
3. ⛔ **A second `from '../pipeline.js'` import appears.** STOP; widen the existing one.
4. ⛔ **A1 is green before the edit and A3 is ALSO green before the edit.** STOP: the battery is
   vacuous, because A3 must be red against the unedited step.
5. ⛔ **The golden or prose pins move** (`tests/property/generatorGoldenMaster.test.js`,
   `tests/property/dossierProseManifest.test.js`). STOP: no-pin behaviour must be byte-identical
   and a move means the consult is reached without a bag.
6. ⛔ **`tests/generators/pipelinePinnedChoosers.test.js` A5 reds.** STOP and report: that is
   EM-B2a3's landed fence (`ASSEMBLE_TOTAL = ['stress', 'name', 'population']`) and this member
   was compiled to leave it standing.
7. ⛔ **A new `createPRNG(` site appears anywhere.** STOP: the member uses the existing stream.
8. ⛔ **The real build reads a worker RISE beyond the byte-arm holder's stated bound.** STOP and
   hand it to the chair: a ceiling RISE, and any re-mint of that ceiling, is the OWNER's (§P11.2).
   This member is NOT the holder (EM-R1b is, judgment 206d) and holds no buy-back of its own.
9. ⛔ **A SECOND `pins` BINDING APPEARS IN THE STEP.** STOP: `const pins = ctx.__pins || null;` is
   EM-R2's landed binding, the consult REUSES it, and re-spelling `ctx.__pins || null` at the
   consult site both duplicates a landed expression and spends bytes in a zero-slack closure. The
   identical rule is EM-R3's C3 on the same file.
10. ⛔ **`tests/lint/heldKeyWriterCensus.walker.test.js` REDS.** STOP and report which arm: A3(b)
   means the edit added an imported symbol that no roster or `DISCOVERY_EXEMPT` row names (this
   member adds none); A2 means the step's `provides`/`mutates` moved, which C2 forbids; A5 means
   the mint's stream classification moved, which is the member's own subject. ⛔ Never add a
   second `DISCOVERY_EXEMPT` row for `chooseOrPin` — EM-R2's landed row already pays it
   (judgment 207d).

---

## §12 · Completion receipt

The build lane's receipt quotes, verbatim:

1. The K-gate's two exit lines, before the first edit.
2. The battery's RED run at step 2 of §8 — the five failing case ids and their messages.
3. The TEN §10 commands' exit lines, in order, never through a pipe (§10 gained item 9, the
   NAMED NON-SEALED read, at version 2; the validator stays last).
4. `tests/lint` whole: the run's own summary, with the lighting walker's interior red named as
   the expected one and every other file green.
5. The effective-line figure for `src/generators/steps/assembleSettlement.js` from eslint's own
   `Linter` with `skipBlankLines` + `skipComments` — **predicted 168 against a base of 167 at
   `5412caf7a`, re-measured at the lane's own base first** — the diff's line count, and the
   sentence *"every inserted line is below the settlement literal"* with the diff's FIRST changed
   line number, which must be below the literal's closing `};`.
6. The lighting census DELTA actually observed, against the predicted
   `files +1 · parked +0 · credited +1 · titles +7 · suiteTitles +1`.
7. `git diff --stat` naming exactly three paths.
8. ⛔ **THIS LANE IS NOT THE BYTE-ARM HOLDER** (EM-R1b is, judgment 206d): the receipt states the
   MEMBERSHIP fact instead — `src/generators/steps/assembleSettlement.js` is in the generation
   worker's source import closure (230 modules from `src/workers/generation.worker.js` at
   `5412caf7a`, measured by a probe that reads no `dist`) — with this member's predicted delta
   (+30 B, stated ×2 = +60 B upper bound, PLAUSIBLE) named for the holder's sum, and runs NO
   build and NO `dist`-reading arm of its own.
9. ⭐ **RESOLVED-AT-PRE-PROOF RECEIPTS (version 2), each a one-line `grep -c -F`:** the widened
   pipeline import present (1) and the pre-EM-R2 form absent (0); `const pins = ctx.__pins || null;`
   present (1) and present exactly once after the edit; `chooseOrPin` occurrences in the file
   4 → 5; and the voice walker's own `countFile` over the edited file reading `{em:0,bang:0}`.
10. The exit line of §10's NAMED NON-SEALED read
   (`tests/generators/rosterFinalUnderHeldRoster.test.js`), quoted, with its arm count.
