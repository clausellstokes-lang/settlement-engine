# Settlement editor / EM-B1d — `NpcStatus` gains `jailed`, AVAILABILITY splits from the HOUSE ROSTER, and a walker refuses every foreign spelling but the declared unions'

- **Status:** `LANDED`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:294-300`) anchors the status row at end-of-line and
  requires EXACTLY ONE such row in the preamble (J-TEWF1B-1).
  ⭐⭐ **THE BLOCK IS RULED (ODQ §934.47 addenda 6 AND 7) AND THE PACKET IS THE `NpcStatus` HALF.**
  **`EntityStatus` is NOT widened** — the two vocabularies stay apart as `rosterProvenance.js:210`
  rules — and the institution-state contract moves into **EM-B1a** (§2a), its shared ruin writer
  into **EM-B1e**. `jailed` **joins `NpcStatus`** under option **J1**: a verdict handed down and
  the status it leaves are the same word *by design*, so the walker's second arm **declares the
  verdict union's exemption by name**.
  ⭐⭐ **VERSION 5 SPLITS TWO READINGS THAT VERSION 4 CONFLATED (§0).** `jailed` does **NOT** join
  `ROSTER_ABSENT_STATUSES`; it joins a **new** availability vocabulary.
  ⭐ **THE OVERRIDE NARROWS, IT DOES NOT LAPSE** (add. 7): five existing logic files at ≤3
  effective lines each, plus one walker.
- **Landed at:** `95e494bdb9c9481a5cf866188b322a75213d1551` — `jailed` joins `NpcStatus`; AVAILABILITY splits from the HOUSE ROSTER — `NPC_UNAVAILABLE_STATUSES` (`dead · exiled · jailed · removed`) in `src/domain/entities/npcs.js` is what the successor and envoy readers use, while `ROSTER_ABSENT_STATUSES` stays byte-identical because a verdict ends and a reversible status must never dissolve a house (pinned: a house whose only figure is jailed reads `crewed`); the union-totality walker red, red, then 4/4 green; SIX mutants convicted, M1′ reddening both density-law arms; the edge battery 67/67 including the committed-tree pin; first paint +32 B of 60; the zero-slack generation worker byte-identical; goldens unmoved; sixteen paths, seven of them the artifacts ONE edge-shared rebuild writes. Version 4 had been built green and stopped uncommitted, correctly; version 5 landed under two ruled exceptions (below).
  ⚠ **TWO FIGURES OF THIS PACKET WERE WRONG AND WERE CORRECTED AT THE LANDED FLIP (ODQ §934.47 addendum 30), under the chair's ruled exceptions:** (1) the lighting delta is `+1 / +0 / +1 / +4 / +1` — the draft priced a fifth title for the new `it` in `tests/generators/densityLaw.test.js`, a file the census PARKS for eleven unregistered-registration and three non-straight-line reasons (measured by the cure lane at `e5bdfd031` with the walker's own `parkReasonsFor`; ⛔ the cause first recorded here — 'vitest globals, `OPENER_UNRESOLVED`' — was FALSE and is RETRACTED: 0 of the estate's 2,649 test files lack the `'vitest'` import, executed by the chair; ODQ §934.47 addendum 32; crediting that file is FIX-L2's): its titles count nowhere (measured live `2649 · 384 · 2265 · 25015 · 6675` → `2650 · 384 · 2266 · 25019 · 6676`); (2) the manifest's `checks` ran `npm run build:edge-shared` MID-CHAIN, which re-stamps declared paths so the packet gate invalidated every step after it — `focused-9..13` were executed BY HAND at the landing tree, all green, quoted in the landing commit; the generator is now LAST in `checks`. Wherever the text below still says `+5 titles` or lists the generator mid-order, this note governs.
- **Packet version:** 5
- **Verified base:** `fixes-2026-09-18-consist` at `50e1f237b985d9288d9a7cabcf2f8467f23c5e48`
- **Last revalidated:** 2026-09-19 at `50e1f237b985d9288d9a7cabcf2f8467f23c5e48` — stamped by the chair at the placement of version 5, the packet's own six checks EXECUTED in the same command as the stamp: (a) `58fcfe614` is an ancestor of HEAD; (b) over every change-manifest and `requiredSymbols` path `git diff --stat 58fcfe614 HEAD` printed NOTHING — since the build lane's tree the branch gained only the EM preamble's §P2 row 12 (`e68d913e6`), the fourth docs fold (`fa931e508`), EM-B1e's placement, its landing (`src/domain/worldPulse/calamityKernel.js` and a new `tests/domain/ruinInstitution.test.js` — neither is a path of this packet) and its LANDED flip; (c) all SIXTEEN `requiredSymbols` rows resolve verbatim; (d) the CREATE target is absent and untracked; (e) the two mutation-coverage anchors are file-adjacent in order; (f) THE LIGHTING TUPLE: live `2649 · 383 · 2266 · 25022 · 6676 (the file count measured by EM-B1e's build; the other four derived from its shape)` after EM-B1e's landing (un-refrozen; the frozen baseline still reads `2646 · 383 · 2263 · 25005 · 6671`), and this packet's delta is `+1 / +0 / +1 / +5 / +1` — measure the whole tuple once in an out-of-tree probe; any other delta is a STOP. ⛔ THE CHAIR'S ONE CUT AT PLACEMENT: the draft's seventeenth `requiredSymbols` row named the fixture token `status: 'imprisoned'` in `tests/domain/espionageMission.test.js`, which THIS PACKET RE-SPELLS — `requiredSymbols` is asserted verbatim at every status, so `check:packet`'s first step would have red the moment the cure was made (the EM-P3 lesson, pre-proof step 10), and a READY retirement must still be present, so it cannot be a `retiredSymbols` row either. The row is dropped; §7's TEST row carries the one-token instruction, and the token not being found EXACTLY ONCE is a STOP. ⓘ The version-4 base `32f1ba048…` and every figure stamped against it are superseded: the build lane executed version 4 at `58fcfe614` and its measurements, quoted throughout below, are that tree's.
- **Depends on:** `NONE`. ⭐ This packet lands **FIRST** in train **T3** (with EM-P2, EM-P3,
  EM-B3a and EM-B1e), before **EM-B1a**, whose `set-npc-status` row spells the post-this-packet
  seven (ODQ §934.47 add. 5, ruling 3). **EM-B3b and EM-P0 are LANDED; EM-P2 is STALE** — none is
  a dependency of this packet.
- **Collision group:** `scripts/mutation-coverage-manifest.json` — **MEASURED FREE at `58fcfe614`**:
  `node scripts/implementation-packets.mjs validate` exits 0 at `valid: 188 packets (1 READY)`, so
  the chair's withdrawal of the STALE EM-P2 version 2 has landed and no non-terminal packet reserves
  the path. ⚠ Two paths are **newly** shared with the estate and must be re-checked at placement:
  `tests/generators/densityLaw.test.js` and `tests/domain/espionageMission.test.js`. Second shared
  path with the train: `tests/lint/.lighting-census-baseline.json` (the terminal's; **never this
  packet's** — see §7's closing prose).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** **EXECUTED at `58fcfe614` by the version-4 build lane**, not inherited: the
  five files' effective lines, the goldens' digests, the writer-reach and observed-shape registers,
  a real `npm run build` of both the base and the wave, `verify:dist`, and the whole lighting tuple.
  Every figure below that says *measured* was printed by a command whose output is in
  `EM-B1d.v5.evidence.md` or the version-4 receipt.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1 — stamped by the chair at placement; the preamble gained §P2 row 12 at `e68d913e6`, which is this packet's own STOP-1 written as law)

---

## 0. WHAT VERSION 5 CHANGES, AND WHY

**Version 4 conflated two questions that the tree keeps apart, and the build lane's execution
exposed it.** `ROSTER_ABSENT_STATUSES` answers exactly one: *is this figure off their HOUSE'S
roster, such that an empty roster DISSOLVES the house?* Its own header states the law it is built
on — *"an IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE causes"* — which is
precisely why `missing` and `retired` are PRESENT on the roster. Version 4 put `jailed` on that
absent line, so **a house whose last figure was jailed would have dissolved permanently on a
reversible verdict**, and then spread the conflation by re-pointing `successors.js` and
`envoyCasting.js` at the roster constant as their availability test.

Design §15's sentence — *"a jailed or exiled holder cannot keep a seat"* — is about **AVAILABILITY**:
who may act, hold a place, or succeed. That is a different question from house membership, and
status-based absence from *participation* is **EM-B1f's** arm at `isOffStage`, not this packet's.

**Version 5 gives the two readings two names.**

1. `ROSTER_ABSENT_STATUSES` stays **EXACTLY** `['dead','exiled','removed']` — **the array is
   UNTOUCHED**. Only its header moves: the judgment list gains `jailed — REVERSIBLE (a verdict
   ends). PRESENT.` and the vocabulary sentence names seven members. ⇒ the exact-equality pin at
   `tests/generators/densityLaw.test.js:1005` **stays as committed**, and that file instead gains
   ONE new `it` pinning the near-miss as law.
2. **NEW:** `NPC_UNAVAILABLE_STATUSES = Object.freeze(['dead','exiled','jailed','removed'])` — *cannot
   act, hold a place, or succeed; NOT the house-roster reading.* `successors.js` and
   `envoyCasting.js` read **it**.

**Three other things version 4 got wrong, each corrected on an executed measurement:**

- ⛔ **The edge-shared artifact set is SEVEN, not four.** `npm run build:edge-shared` re-stamps
  `generatedAt` in **all five** metas; the estate pins that
  (`edgeSharedBundleReproducibility.test.js` → *"all bundles share a single build window"*), and
  committing four left a 25,614.1 s spread and a red. Both sealed verbs refused on it.
- ⛔ **§7's table carried a word outside the validator's vocabulary and a row for a file the packet
  must not touch.** `REGENERATE` is not in `PACKET_ACTIONS`
  (`['CREATE','DOC','MODIFY','REGISTER','TEST']`); a regenerated artifact is `MODIFY` on both sides.
  The deferred `tests/lint/.lighting-census-baseline.json` row is deleted — §P2 row 1 forbids a
  member from editing that file at all, so it is PROSE, never a row.
- ⓘ **Housekeeping:** the worker ceiling is `1401208` (version 4 wrote `1401128`, a transposition);
  the first-paint reading is `1,039,235` at the base, not the stale `1,047,205`.

**What version 5 does NOT change:** the ruled R6′ matcher, the J1 ruling, the narrowed override, the
golden posture, and the walker's two arms. The trigger set is **re-derived under the new shape and
is still exactly `{dead, exiled, retired}`** (§6, measured).

---

## 1. Reconciled authority

1. **ODQ §934.47 addendum 5** (ledger `8f2e7b699`): **ONE SPELLING: `jailed`** — `envoyCasting.js`'s
   `'imprisoned'` and `'killed'` are foreign spellings, replaced by the union's own members and made
   to **READ a union** rather than spell literals. **This packet lands BEFORE EM-B1a**, in train T3.
2. **ODQ §934.47 addendum 6** (ledger `427aa5f00`): **`EntityStatus` is NOT widened**; `jailed`
   **JOINS `NpcStatus`** under **J1**; the walker **declares the verdict union's exemption by name**;
   **no surface renders either word until wave 4.**
3. **ODQ §934.47 addendum 7**: the override **NARROWS** — five existing logic files at ≤3 effective
   lines each plus one walker; **B1d's first arm pins `EntityStatus` unchanged at five**.
4. ⭐ **THE VERSION-5 RULING (the chair, on the build lane's finding):** `jailed` does not join
   `ROSTER_ABSENT_STATUSES`; availability is a separate, named vocabulary; participation is EM-B1f's.
5. **Design §15** (`docs/DESIGN_EDIT_MODE_AND_DECREES.md`): NPC status ∈
   **{active, exiled, jailed, dead, missing, retired, removed}**; *"A jailed or exiled holder cannot
   keep a seat: the holder guard offers a successor (`fulfil`) or `proceed`; an exile may return by a
   later decree."* And `:313`: captivity is **NOT** a new `NpcStatus` value — a per-layer fact,
   *"distinct from `jailed`, which is the DM's own act (EM-B1d) and the court's verdict."*
6. ⭐ **`factionLifecycle.js`'s own R18 law**, quoted because version 5 turns on it: *"an
   IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE causes."*
7. **THE PROMISE** — lived history is immutable; no golden moves on this packet.
8. **`EM-PREAMBLE.md`** §P2 (registration costs), §P3 (the census law), §P6 (mutant hygiene),
   §P7 (gate-reading; *"under a train both move to the terminal"*), §P8 — cited by hash.
9. **`PACKET_STANDARD.md`** — the budget, the override clause, the hot-file law, the STOP conditions,
   and `PACKET_ACTIONS`.

---

## 2. Outcome

**Observable result:** `NpcStatus` carries seven members; the estate has ONE named vocabulary for
*unavailability* and a separate, unchanged one for *house membership*; every place in `src/` that
enumerates the union enumerates all of it; `envoyCasting.js` speaks the union's own words instead of
two foreign ones; and a walker asserts all of it so the next consumer cannot under-enumerate,
invent a spelling, or re-conflate the two readings without a red.

**Definition of done:** the typedef carries `jailed`; `NPC_UNAVAILABLE_STATUSES` exists and is read
by the two availability consumers; `ROSTER_ABSENT_STATUSES` is **byte-identical**; the practitioner
set enumerates all six non-`active` members; `envoyCasting.js` reads a union; the walker's arms are
green; `EntityStatus` is pinned unchanged at five; the mutation-coverage row is appended surgically;
the seven edge-shared artifacts are regenerated in ONE build window; **no golden moves.**

In scope: (1) **one behaviour family** — one typed union widens and every enumerator follows;
(2) the one required integration — `envoyCasting.js` re-pointed off its foreign spellings;
(3) the prevention guard — `tests/lint/statusUnionTotality.walker.test.js`;
(4) the registration costs those three incur.

Explicit non-goals: the ops that WRITE these values (**EM-B1a's**); the participation chokepoint arm
(**EM-B1f's**, at `isOffStage`); the pulse's shared ruin writer (**EM-B1e's**); any widening of
`EntityStatus`; the pool vocabularies (**EM-A2a's**); the `impairments[]` ledger; any new derivation
that *reacts* to `jailed`; any golden, tuning, migration or paid-surface behaviour; any surface that
renders the word (wave 4). Record adjacent discoveries in the receipt; do not investigate them.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — no new caller | ≤2 |
| New logic-bearing production leaves | `0` — the vocabulary is minted **beside the typedef it belongs to** (§3.2) | ≤2 |
| New TEST leaves | `1` walker | n/a |
| **Existing logic-bearing production files modified** | **`5`** | ⭐ **≤5 — the NARROWED override (add. 7)** |
| **Maximum delta per modified file** | **`3` effective** | ⭐ **≤3 — the NARROWED override (add. 7)** |
| Existing TEST files modified | `2` (both one-token-class edits, §7) | n/a |
| Additional registration-only files | `1` (`scripts/mutation-coverage-manifest.json`) | ≤3 |
| Handwritten files total | **`9`** (5 MODIFY + walker + 2 TEST + the manifest row) | ≤12 |
| Effective lines in the new walker leaf | **~235 projected** (v4's executed 232 + the roster change) | ≤250 |
| Generated artifacts (regenerated, not handwritten) | **`7`** — two bundles + **five** sidecar metas | n/a |
| New/changed effective production lines | **+3 measured** (§7) of ≤15 | ≤400 |
| Delta in a shared/hot file | `0` — **no roster file is hot** (§3.1) | ≤15 |
| Acceptance cases | `7` | ≤8 |

⛔ **THE NARROWED FIGURES ARE A CEILING, NOT A FLOOR TO RENEGOTIATE.** A sixth production file, a
delta above three effective lines in any row, or a second walker is a **STOP** (§11).

### §3.1 · Hot files — measured, and the one that is hot is NOT in the roster

**No file in the roster is on the standing hot list (`PACKET_STANDARD.md:468`) and none carries a
`scripts/.size-baseline.json` entry.** Measured with eslint's own `Linter` at `58fcfe614`: the five
are **138, 61, 52, 92 and 70** effective lines against an 800-line domain ceiling. No headroom
measurement is owed. ⚠ `EconomicsTab.jsx` (600/600) enumerates supply-chain status and
`convergence.js` (798/800) belonged to the withdrawn `ruined` roster — **neither is a roster row.**

### §3.2 · ⭐⭐ THE PLACEMENT, MEASURED AGAINST ALL FOUR BUDGETS — AND THE ANSWER IS `npcs.js`

The new vocabulary is an exported runtime constant, so it lands bytes wherever its home is bundled.
Measured at `58fcfe614` by walking each entry's static closure with `importsOf`/`resolveRel`
**copied verbatim from `vite.config.js`'s `computeEagerModuleGraph`**, and by querying the config's
own exported `EAGER_FIRST_PAINT_MODULES` (evidence §1):

| candidate home | generation worker (**ceiling 1,401,208, EXACT, zero slack**) | eager first paint (margin **8,770 B**, measured) | lazy engine (`< 679_000`, at 677,935) | `advanceInterval.worker` (**no byte ceiling exists**) |
|---|---|---|---|---|
| **`src/domain/entities/npcs.js`** ⭐ | **NO** — absent from the 220-module closure | YES | **NO** (`id.includes('/src/generators/')`) | YES |
| `src/domain/entities/status.js` | **NO** | YES | **NO** | YES |
| a new leaf `src/domain/entities/npcAvailability.js` | **NO** | YES (imported by `successors.js`) | **NO** | YES (imported by `envoyCasting.js`) |

⭐ **THE ZERO-SLACK BUDGET IS UNTOUCHABLE BY ANY OF THE THREE**, and that is a membership fact, not
an estimate: `npcs.js` is **not in the generation worker's closure**, and — measured separately —
**not one module inside that closure imports it**. ⇒ **THE TREE-SHAKING QUESTION IS MOOT BY
PLACEMENT**, which is the strongest form of the answer: a module that is not in the chunk cannot
contribute bytes whether or not rollup would shake an unused export. (The weaker question — *would
the worker's build drop an unused export?* — is never asked, and no packet should have to rely on
the answer. ⛔ If a later lane moves `npcs.js` INTO the worker's closure, this reasoning dies with
it and the constant must move; that is why the membership is asserted, not remembered — §9 A1.)

**All three candidates are budget-identical, so the choice is made on coupling, and `npcs.js` wins
outright:**

- It is **the typedef's own home**. The vocabulary is a projection of the union; they belong together
  and are read together.
- **`envoyCasting.js` ALREADY imports `npcs.js`** (`import { importanceWeight } from
  '../entities/npcs.js'` — verified live), so row 4 adds **NO new import edge at all**: it extends an
  existing import clause. Version 4 had to add `worldPulse → density`.
- `successors.js` sits in the same directory and already type-imports `./npcs.js`, so its one new
  runtime edge is same-directory and **closure-neutral by construction**: both modules are already in
  `EAGER_FIRST_PAINT_MODULES` (measured), and that set is a transitive-closure fixpoint, so the edge
  can add **zero** modules to first paint.
- The `entities → density` edge version 4 was forced to add **disappears**.
- A new leaf would cost a file and a module node to buy nothing measurable.

**The first-paint cost, priced.** The constant minifies to roughly 50 B; `successors.js` gives back
more than it costs (version 4 measured the same substitution at a **net −5 B** for the whole
closure). ⭐ **The bound this packet carries is ≤ 60 B of first-paint growth against 8,770 B of
measured margin**, and §8 step 8 makes the build lane measure it rather than assume it.

⛔ **No re-mint is owed and none is permitted here.** Should the terminal's build show growth beyond
60 B attributable to this member's modules, or any movement at all in the generation worker, that is
a **STOP for the chair** (§P7: *"Never raise a baseline, budget, timeout or ceiling to finish a
packet"*).

### §3.3 · ⛔⛔ THE EDGE-SHARED OBLIGATION — SEVEN ARTIFACTS, ONE BUILD WINDOW

`scripts/build-edge-shared.mjs:79-80` hashes **every input's RAW SOURCE TEXT**, comments included,
and the freshness arms recompute exactly that over the live tree. **Entry-hood is irrelevant; INPUT
membership is the test.** `src/domain/entities/npcs.js` is an input of **two** committed bundles
(114 and 115 inputs), so row 1 — a comment-only edit would suffice — stales both.

⭐ **AND THE COMMAND RE-STAMPS ALL FIVE METAS.** Measured: the three bundles that do not list
`npcs.js` keep their `sourceHash` (`9788abb8fdb7287e`, `0a6ba64ce0b8d5e2`, `9136e063f280d77f`)
**unmoved**, and their only changed bytes are `generatedAt`. They are **not optional**, because the
estate pins the single window:

```
tests/edgeFunctions/edgeSharedBundleReproducibility.test.js
  > all bundles share a single build window — no stale siblings left behind
AssertionError: generatedAt spread is 25614.1s across the bundles … expected 25614114 to be <= 600000
```

⇒ **SEVEN artifacts, from ONE `npm run build:edge-shared` run, in ONE commit.** Precedent: every
prior regeneration landing carried seven `_shared` paths (`ddcfb1f59`: *"three siblings
byte-identical, five metas re-stamped in one build window"*; also `ee8ac6c3c`, `58b466afc`,
`167887d38`). ⚠ **The sealed verbs enforce it**: `check:packet` and `implementation:resume` each run
`build:edge-shared` themselves and refuse with `sealed foreign work drifted` while any re-stamped
meta is undeclared. ⛔ **A pin against the predicted `sourceHash` VALUES is forbidden** — they hash
the gloss bytes, so they differ per author. The claim is *staleness*, never a literal.

---

## 4. Sealed dispatch and preflight

```sh
git rev-parse HEAD && npm run implementation:dispatch -- EM-B1d
```

| # | check | verdict |
|---|---|---|
| 1 | `dispatch branch mismatch` (`:353`) | the worktree must sit on the verified branch (one build lane holds it; the chair detaches) |
| 2 | `verified base is not an ancestor of HEAD` (`:182`) | passes while the base is the tip or a proved-non-interfering ancestor |
| 3 | `verified-base descendant changed declared substrate` (`:195`) | passes when `50e1f237b` is the tip; otherwise the chair's re-measurement (b) answers it |
| 4 | `capsule omitted declared substrate` (`:199`) | passes; the capsule is built from the same list |
| 5 | `CREATE target must be absent and Git-clean` (`:210`) | the walker must be absent and untracked |
| 6 | `non-CREATE target must be Git-clean` (`:213`) | passes on a clean tree |

⚠ **THE WORKTREE IS SHARED.** Re-read `git rev-parse HEAD` in the same command as the dispatch.
⚠ **THE VERSION-4 SEAL IS DEAD** the moment these bytes change; the lane withdraws its staged work
and re-dispatches.

---

## 5. Verified tree contract

Every row re-found BY SYMBOL at `58fcfe614` (`grep -cF` counts in evidence §3).

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The union** | `src/domain/entities/npcs.js` | `NpcStatus` (typedef) | `'active'\|'dead'\|'missing'\|'exiled'\|'retired'\|'removed'` — six | **+ `jailed`** → seven, in codepoint order |
| ⭐ **The new vocabulary's home** | `src/domain/entities/npcs.js` | `IMPORTANCE_WEIGHT` (the first runtime statement) | the module-scope anchor the mint sits above | **MINT `NPC_UNAVAILABLE_STATUSES`** here (§3.2) |
| ⛔ **UNTOUCHED — the house roster** | `src/domain/density/factionLifecycle.js` | `ROSTER_ABSENT_STATUSES` | `Object.freeze(['dead','exiled','removed'])`, consumed at `:77` as `ABSENT` | ⛔ **NO CHANGE TO THE ARRAY.** Its header's judgment list gains the `jailed` row |
| **Successor eligibility** | `src/domain/entities/successors.js` | `inferSuccessors`; the filter at `:63` | `n.status !== 'dead' && !== 'removed' && !== 'exiled'` — three literals | **READ `NPC_UNAVAILABLE_STATUSES`** |
| ⛔ **The foreign spellings** | `src/domain/worldPulse/envoyCasting.js` | `rosterPersonAvailable` (`:95`) | `:98` — `['dead','killed','missing','exiled','imprisoned'].includes(status)`; **`killed` and `imprisoned` are NOT `NpcStatus` members** | ⛔ **READ `NPC_UNAVAILABLE_STATUSES` plus `'missing'`** (add. 5) |
| **Practitioner loss** | `src/domain/worldPulse/magicFormsPractitioner.js` | `LOST_NPC_STATUS` (`:79`) | `new Set(['dead','removed','exiled','missing','retired'])` | **+ `jailed`** — stays a LITERAL set, total over the six non-`active` members |
| ⭐ **Pinned UNCHANGED** | `src/domain/entities/status.js` | `EntityStatus` (typedef) | five members | ⛔ **NO EDIT.** A1 asserts it still parses to exactly five |
| **The verdict union (exempt BY STRUCTURE)** | `src/domain/worldPulse/npcVerdictTable.js` | `HOLDING_VERDICT` (`:104`) | `= 'jailed'`; siblings `npcLedgerFacets.js:123`, `warAuthorityVerdict.js:22` | T2 names these three and asserts they are **unflagged because `jailed` is a homonym** |
| ⭐ **ROSTER ROW — NOT EDITED** | `src/domain/worldPulse/warSeatBooks.js` | `rosterNpcById` (the seat read at `:102`) | `=== 'dead'` paired with `isOffStage(npc)` | ⛔ **NO EDIT — reasoned omission:** *the ONE participation chokepoint; status-based absence joins it in **EM-B1f***  |
| ⭐ **ROSTER ROW — NOT EDITED** | `src/domain/worldPulse/npcLadderState.js` | `eligibleMembersOf` (the rung filter at `:206`) | `excludeDead && … === 'dead'`, paired with `isOffStage(n)` | ⛔ **NO EDIT — same reasoned omission** |
| ⭐ **ROSTER ROW — NOT EDITED** | `src/domain/worldPulse/npcLadderKernel.js` | `advanceLitLadder` (the eligibility walk at `:660`) | `… === 'dead' \|\| isOffStage(member)` | ⛔ **NO EDIT — same reasoned omission** |
| ⚠ **Two further live unions** | `src/domain/npc/npcOps.js`; `src/domain/worldPulse/envoyErrandVocabulary.js` | `STASIS_REASONS`, `ENVOY_LOSS_CAUSES` | `['journey','imprisoned','missing','sequestered']` and `['killed','route_lost','dm_removed']` | ⛔ **NO EDIT** — design §15 `:313`. T2's matcher must not convict them |
| ⭐ **The pin version 5 PRESERVES** | `tests/generators/densityLaw.test.js` | `the absent-status line is EXACT in both directions` (`:1005`) | `expect(ROSTER_ABSENT_STATUSES).toEqual(['dead','exiled','removed'])` | ⛔ **UNCHANGED.** The file gains ONE new `it` beside it (§7) |
| ⭐ **The fixture the cure re-spells** | `tests/domain/espionageMission.test.js` | `THE DISPATCH-REFUSAL SEAM is ONE predicate` (fixture `:559`) | `{ ...ROSTER[2], status: 'imprisoned' }`, asserted refused | **`'imprisoned'` → `'jailed'`**, one token; the assertion is unchanged |
| **Test precedent** | `tests/lint/chooserTotality.walker.test.js` | `SCAN_ROOTS` (`:64`) | a register walker asserts its table SET-EQUAL to the live scan in BOTH directions | **Copy this shape** |
| **Enforcer-dir law** | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` (`:36`) | `tests/lint` is the FIRST entry | The row this packet appends |
| **Register shape** | `scripts/mutation-coverage-manifest.json` | `invariants` | **705** rows at `58fcfe614` | **705 → 706** |
| ⛔ **Edge-shared inputs** | the five `supabase/functions/_shared/*.meta.json` | `inputs` | two list `npcs.js`; all five are re-stamped per run | ⛔ **Seven artifacts, one window (§3.3)** |

**Forbidden alternatives:** ⛔ no widening of `EntityStatus`; ⛔ **no change to the
`ROSTER_ABSENT_STATUSES` array**; ⛔ no renaming or removal of an existing member; ⛔ no edit to
`SummaryTab.jsx`, `EconomicsTab.jsx`, `npcOps.js`, `pendingEditIntents.js`,
`settlementPendingEditWriters.js`, `envoyErrandVocabulary.js`, `envoyErrand.js`, `npcDmVerbs.js`, or
any supply-chain status site; ⛔ no arm at `isOffStage` (EM-B1f's); ⛔ no new derivation reacting to
`jailed`; ⛔ no whole-file re-serialisation of the mutation-coverage manifest; ⛔ no hand-edit of
`tests/lint/.lighting-census-baseline.json` or of any generated artifact.

---

## 6. Exact contracts

### The union, after this packet

```js
/** @typedef {'active'|'dead'|'exiled'|'jailed'|'missing'|'removed'|'retired'} NpcStatus */
```

⛔ **Exactly one member is added. No member is renamed, removed or re-glossed.** Members are
authored in codepoint order so a future addition is a one-token diff. ⛔ **`EntityStatus` is
untouched and A1 pins it at five.**

### ⭐ The new vocabulary, and the sentence that keeps it apart from the roster

```js
export const NPC_UNAVAILABLE_STATUSES = Object.freeze(['dead', 'exiled', 'jailed', 'removed']);
```

Its comment **must say both sentences**, because the pair is the whole point of version 5:

> *These statuses mean the figure cannot act, hold a place, or succeed (design §15: "a jailed or
> exiled holder cannot keep a seat").* **This is NOT the house-roster reading.**
> *`ROSTER_ABSENT_STATUSES` (`density/factionLifecycle.js`) answers a different question — is the
> figure off their house's roster, so that an empty roster DISSOLVES the house — and R18 admits only
> IRREVERSIBLE causes to that irreversible consequence. A verdict ends, so `jailed` is UNAVAILABLE
> but still ON the roster. Participation is a third question, cured once at `isOffStage` by EM-B1f.*

⛔ `'missing'` and `'retired'` are deliberately **absent**: a missing figure may walk back through
the gate and a retired elder may still be named a successor. `envoyCasting.js` adds `'missing'` for
its own reading and says why.

### Per-file contract, with the exact delta

| # | file | exact edit | measured delta |
|---|---|---|---:|
| 1 | `src/domain/entities/npcs.js` | `jailed` joins the typedef (a JSDoc comment, **zero effective**); `NPC_UNAVAILABLE_STATUSES` is minted above `IMPORTANCE_WEIGHT` with the two-sentence comment | **+1** of ≤3 |
| 2 | `src/domain/density/factionLifecycle.js` | ⛔ **COMMENT ONLY.** The judgment list gains `jailed — REVERSIBLE (a verdict ends). PRESENT.` naming design §15 and EM-B1f; the vocabulary sentence names seven members | **+0** of ≤3 |
| 3 | `src/domain/entities/successors.js` | the `:63` filter becomes `!NPC_UNAVAILABLE_STATUSES.includes(n.status)` — one read replacing three literals | **+1** of ≤3 |
| 4 | `src/domain/worldPulse/envoyCasting.js` | a module-scope `UNAVAILABLE_STATUSES = new Set([...NPC_UNAVAILABLE_STATUSES, 'missing'])`; `:98` reads it. ⭐ **Extend the EXISTING `../entities/npcs.js` import clause — add no import line** | **+1** of ≤3 |
| 5 | `src/domain/worldPulse/magicFormsPractitioner.js` | `LOST_NPC_STATUS` gains `'jailed'` — it becomes total over all six non-`active` members, and its header says so | **+0** of ≤3 |

**Total: +3 effective production lines of ≤15.** ⛔ A delta above three in ANY row is a STOP.

### ⭐ T2's MATCHER — ONE SENTENCE, NO DISCRETIONARY WORD (ODQ ruling **R6′**, unchanged by version 5)

> **T2 strips block and line comments from every file under `src/` excluding `**/*.test.*`, flags
> each file whose remaining source contains any of the quoted literals `'dead'`, `'exiled'` or
> `'retired'` — the TRIGGER SET, being the members of the live `NpcStatus` typedef that are members
> of no other declared vocabulary in the tree — and REDS unless every flagged file is either a row
> of the declared consumer roster, whose enumeration must contain every non-`active` member of the
> live typedef or carry a one-line reasoned omission naming the members it leaves out, or a row of
> the declared exemption register naming the foreign vocabulary it belongs to.**

⭐ **THE `spelling` FIELD IS CONTRACT (the build lane's accepted judgment call).** Every roster row
declares `spelling: 'literals' | 'union-read'`, and the walker CHECKS it against the tree rather than
trusting it: a `literals` row **must be flagged**; a `union-read` row **must be unflagged, must
import the named vocabulary `NPC_UNAVAILABLE_STATUSES`, and must spell no retired foreign word**.
The set-equality then runs between the flagged set and the roster's **literal** rows ∪ the register,
which keeps both directions live while letting a cured consumer stay on the roster as the record
that it is cured. Without it, curing a consumer would silently drop it from the table.

⭐ **ONE DERIVATION RULE THE BUILD LANE CORRECTED, AND IT IS CONTRACT:** *a vocabulary declared
inside a declared consumer-roster file is this union's OWN, never foreign.* Without it
`envoyCasting.js`'s own `UNAVAILABLE_STATUSES` counts itself as a foreign vocabulary spelling
`'missing'`. With it, the foreign-vocabulary table reproduces the original measurement exactly.

⛔ **THE HOMONYMS AND THE CANNOT-CATCH — RE-DERIVED UNDER THE VERSION-5 SHAPE** (evidence §2, from
the base blobs with the v5 edits applied in memory):

| member | foreign declared vocabularies (name × file) | verdict |
|---|---:|---|
| `'active'` | **11** — `ACTIVE_STAGES` ×4, `ACTIVE_STRESSOR_STAGES` ×2, `ACTIVE_UI_STAGES`, `ACTIVE_FLOW_STAGES`, `ACTIVE_SYNERGY_STAGES`, `STRESSOR_LIFECYCLE_STAGES`, `THREAT_STAGES` | ⛔ HOMONYM |
| `'removed'` | **8** — `INACTIVE_STATUS`, `RUIN_STATUS`, `INACTIVE_STATUSES`, `NONSTANDING_STATUS`, `DEAD_ENDPOINT_STATUS`, `TRANSPORT_DOWN_STATUSES`, `RUINED_STATUS`, `DEAD_EDGE_STATUSES` | ⛔ HOMONYM |
| `'missing'` | **3** — `STASIS_REASONS`, in three files | ⛔ HOMONYM |
| `'jailed'` | **3** — `VERDICTS`, `VERDICT_CAUSES`, `AUTHORITY_VERDICTS` | ⛔ HOMONYM |
| `'dead'` · `'exiled'` · `'retired'` | **0** each | ⭐ **TRIGGER** |

⇒ **TRIGGER = `{dead, exiled, retired}`, unchanged by version 5.** The declared CANNOT-CATCH stays
as ruled: a consumer enumerating ONLY homonym members is invisible to this walker, because
triggering on them would cost ~60 exemption rows that say only *"this is `ACTIVE_STAGES`, not
`NpcStatus`"*. **Measured: no such site exists** (`crisisLifecycle.js`'s `n.status === 'active'`
reads a STRESSOR and is a single positive test — total by construction).

⭐ **THE SETS, RE-DERIVED FOR VERSION 5 (evidence §2):**

| set | version 4 | **version 5** | why it moved |
|---|---:|---:|---|
| FLAGGED files | 6 | **6** | the same six; `npcs.js` now spells five members rather than two |
| declared roster rows | 8 | **8** | unchanged — 5 edited + 3 found |
| of which `literals` (must equal FLAGGED) | 6 | **6** | ✓ set-equal, both directions |
| of which `union-read` | 2 | **2** | `successors.js`, `envoyCasting.js` |
| discovered ENUMERATORS (≥2 non-`active` members) | 2 | **3** | ⭐ `npcs.js` JOINS, as the vocabulary's home |
| exemption register rows | 0 | **0** | empty, inline, and proved on a planted row |

`npcs.js`'s roster row therefore declares `enumerator: true`, enumerates `dead, exiled, jailed,
removed`, and carries the reasoned omission *"`missing` and `retired` are not unavailability: a
missing figure may return and a retired elder may still be named a successor"*.
`factionLifecycle.js`'s row enumerates `dead, exiled, removed` with the reasoned omission naming
**`active`, `jailed`, `missing` and `retired` as PRESENT BY R18** (the machine-checked `omits` array
carries the three non-`active` words; the `why` names all four).

### ⛔ The behaviour changes, stated so they can be refused

Rows 3–5 widen predicates that **gate** behaviour. **Measured at `58fcfe614`: no writer in `src/`
produces `'jailed'` as a STATUS** — every live site is the verdict union's — so on every world that
exists the widening is **inert by construction**, and A7 proves it with the matcher shown live on a
planted writer.

Two readings do change, and both are ratified on measurement:

1. An NPC stored as `'imprisoned'` or `'killed'` becomes AVAILABLE. **No writer assigns either
   spelling to `.status`** (every live use is a stasis reason, an errand loss cause, a label, a
   comment or rendered prose), so no world changes. ⭐ ONE committed FIXTURE does — §7's
   `espionageMission.js` row re-spells it, which is the only honest cure.
2. `'removed'` joins the envoy dispatch refusal (it was absent from the old list). **Measured: no
   writer in `src/` assigns `'removed'` to an NPC's `.status`** — the two `status: 'removed'` writers
   (`settlementLifecycleFirstClass.js:601`, `tierOutcomeApply.js:143`) both target institutions — so
   this too is inert on existing data.

⛔ **AND ONE READING DELIBERATELY DOES NOT CHANGE, which is version 5's whole point:** a jailed
figure stays ON the house roster, so an all-jailed house reads `crewed` and never dissolves. §7's
`densityLaw.test.js` row pins it.

### Absence, ordering, determinism, flag, dormancy, golden posture

**Absence:** unchanged (`npcs.js:133` — `input.status || 'active'`). **Ordering:** codepoint; no
runtime order changes. **Determinism:** no PRNG, no clock, no locale comparison; three files ride
`advanceInterval.worker`, whose structured-clone pin is named in `checks`. **Flag:** `NONE`.
**Dormancy:** the new member is unreachable until EM-B1a's ops can write it. **Golden posture:**
⛔ **UNCHANGED** — `UPDATE_GOLDEN` and `GOLDEN_SHIFT_SIGNED` are forbidden; **motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Typedef member + a frozen vocabulary, both at load | the enumerators | the value persists on NPC records **as it already does** — no new key | unchanged | unchanged | unchanged | ⭐ **NO MIGRATION OWED**: widening a union adds no key and rewrites no stored record | unchanged |

**Receipts** `NONE`. **Alignment:** `DECLARED EMPTY`. **Edit story:** `ENGINE-ONLY — the DM's verbs
that write this value are EM-B1a's ops, which land after this packet.`

---

## 7. Exact change manifest

⚠ **ONE FULL REPO-RELATIVE PATH PER ROW; the `action` word is a member of `PACKET_ACTIONS`
(`CREATE`, `DOC`, `MODIFY`, `REGISTER`, `TEST`) and is IDENTICAL to that path's `action` in
`EM-B1d.manifest.json`'s `changeManifest`.** The (action, path) pairs below and the JSON's are
asserted SET-EQUAL in both directions — executed, evidence §4.

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/entities/npcs.js` | `NpcStatus`; `NPC_UNAVAILABLE_STATUSES` above `IMPORTANCE_WEIGHT` | **+3 eff** | Add `jailed` to the typedef in codepoint order with its gloss, and mint the frozen availability vocabulary with §6's TWO-sentence comment. ⛔ This edit alone stales two edge bundles — see the seven generated rows. |
| `MODIFY` | `src/domain/density/factionLifecycle.js` | the `ROSTER_ABSENT_STATUSES` docblock | **+0 eff** | ⛔ **COMMENT ONLY — the frozen array is byte-identical.** Add the `jailed — REVERSIBLE (a verdict ends). PRESENT.` judgment row and name seven members. |
| `MODIFY` | `src/domain/entities/successors.js` | the eligibility filter (`:63`) | **+3 eff** | Read `NPC_UNAVAILABLE_STATUSES` instead of three literals. |
| `MODIFY` | `src/domain/worldPulse/envoyCasting.js` | `rosterPersonAvailable` (`:95`, list at `:98`) | **+3 eff** | Derive `UNAVAILABLE_STATUSES` from the vocabulary plus `'missing'` and read it. ⭐ Extend the existing `../entities/npcs.js` import clause. |
| `MODIFY` | `src/domain/worldPulse/magicFormsPractitioner.js` | `LOST_NPC_STATUS` (`:79`) | **+3 eff** | Add `'jailed'`; note in its header that it is now total over the six non-`active` members. |
| `CREATE` | `tests/lint/statusUnionTotality.walker.test.js` | arms **T1** and **T2** | **≤250 eff** | The walker of §6/§8: the R6′ matcher verbatim, the derived trigger, the derived homonym table, the **8-row roster with its checked `spelling` field**, the empty inline register, the CANNOT-CATCH header, the three arms. ONE literal `describe`, FOUR straight-line `it`. ⛔ `.each`, looped, conditional and nested registration forbidden (§P3.4). |
| `TEST` | `tests/generators/densityLaw.test.js` | a new `it` beside `the absent-status line is EXACT in both directions` | `+1 title` | ⛔ **The existing exact pin is UNCHANGED.** Add ONE `it`: a `jailed` figure is ON the roster (`isOnRoster` true) and a house whose only figure is jailed reads `crewed` with no reaction. Pair the `not.toContain('jailed')` negative with a one-line `// anchored:` reason. |
| `TEST` | `tests/domain/espionageMission.test.js` | the `busy` fixture (`:559`) | `+0 titles` | ⛔ **ONE TOKEN:** `status: 'imprisoned'` → `status: 'jailed'`. The refusal assertion is unchanged and is still reached through `UNAVAILABLE_STATUSES`. |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | one `invariants` row keyed the walker | `+1 row` | ⛔ **SURGICALLY, never re-serialised. 705 → 706.** Insert the complete four-line block immediately before the `"tests/lint/stepPresentationEngineFence.walker.test.js"` key and immediately after the close of `"tests/lint/dossierMountRegistry.walker.test.js"` — a pure **+4 / −0** diff. Kind `rationale`, inline, ≥40 chars, carrying the EXECUTED mutant account. Anchor on the key NAMES, never line numbers. |
| `MODIFY` | `supabase/functions/_shared/aiCharterBundle.js` | the whole artifact | `n/a` | Generated by `npm run build:edge-shared`; **never hand-edited.** `sourceHash` moves. |
| `MODIFY` | `supabase/functions/_shared/aiCharterBundle.meta.json` | the whole artifact | `n/a` | Generated in the same run; never hand-edited. `sourceHash` moves. |
| `MODIFY` | `supabase/functions/_shared/aiOutputSchemaBundle.js` | the whole artifact | `n/a` | Generated in the same run; never hand-edited. `sourceHash` moves. |
| `MODIFY` | `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` | the whole artifact | `n/a` | Generated in the same run; never hand-edited. `sourceHash` moves. |
| `MODIFY` | `supabase/functions/_shared/aiGroundingBundle.meta.json` | `generatedAt` | `n/a` | Generated in the same run; never hand-edited. ⭐ **`sourceHash` UNMOVED** — re-stamped in one build window (§3.3). |
| `MODIFY` | `supabase/functions/_shared/analyticsEventsBundle.meta.json` | `generatedAt` | `n/a` | Generated in the same run; never hand-edited. ⭐ **`sourceHash` UNMOVED** — re-stamped in one build window (§3.3). |
| `MODIFY` | `supabase/functions/_shared/intentAtlasBundle.meta.json` | `generatedAt` | `n/a` | Generated in the same run; never hand-edited. ⭐ **`sourceHash` UNMOVED** — re-stamped in one build window (§3.3). |

**Sixteen rows: 9 handwritten (of ≤12) and 7 generated.**

⛔ **`tests/lint/.lighting-census-baseline.json` IS NOT A ROW, AND THAT IS DELIBERATE.** This packet
moves the census (§7's registration ledger predicts the delta), but `EM-PREAMBLE.md` §P2 row 1
forbids a member from editing that file at all: the re-derivation is the **train's terminal act and
the chair's**. A row here would be an instruction to break that law, so the obligation is stated in
prose and the path appears in neither the table nor the JSON.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — INTERIOR RED** | This packet quotes **no absolute**, only the delta it causes: **`+1 files / +0 parked / +1 credited / +4 titles / +1 suiteTitles`** — one new test file (one `describe`, four `it`) **plus one new `it` in `densityLaw.test.js`**. ⭐ Measured whole at `58fcfe614` with these edits: **`2649 · 383 · 2266 · 25019 · 6676`** for the four-title shape; version 5's extra `it` makes it **`2650 · 384 · 2266 · 25019 · 6676`**. Re-derived at the terminal, **by the chair, never inside this packet**. |
| P2.2 | mutation-coverage row | ⛔ **OWED** | `tests/lint` is the first ENFORCER DIR. **705 → 706**, surgical, anchors named in §7. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key is read. `node scripts/check-observed-shape-readers.mjs` is in `checks`; **motion is a STOP**. Measured unmoved at `58fcfe614`: `1964 finding(s), exactly matching the frozen inventory`. |
| P2.4 | writer-reach | **MEASURED UNMOVED** | The lane RECORDS the verdict and **never writes a baseline**; a shrink is the chair's to bank, **growth is a STOP**. Measured byte-identical before and after: `WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294`. |
| P2.5 | decision-fork / mechanism-coverage | **NOT OWED** | No seeded chooser, no pool, no draw. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |
| **P2.10** | **edge-shared bundle freshness** | ⛔ **OWED — SEVEN artifacts** | §3.3. `npcs.js` is an input of two bundles; all five metas are re-stamped in one window. |
| **P2.11** | **byte budgets priced at pre-proof** | **PRICED — §3.2** | The zero-slack generation worker takes **nothing** (membership measured, not assumed); the lazy engine takes nothing; first paint carries a **≤ 60 B** bound against **8,770 B** of measured margin. |

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command.
1. **Capture the baselines:** `sha256` of both goldens; the `invariants` row count (**705**);
   `node scripts/check-writer-reach.mjs`; `node scripts/check-observed-shape-readers.mjs`.
2. Add `tests/lint/statusUnionTotality.walker.test.js` **failing**, and quote the red.
3. Row 1 (the typedef **and** the vocabulary). ⛔ **Then immediately `npm run build:edge-shared`**,
   confirm **seven** artifacts moved and no eighth, and that the two freshness suites go green.
4. Rows 2–5 in order, **`envoyCasting.js` last** — it is the only row that replaces rather than
   adds, so the walker's second arm stays red until exactly that edit, which is its own proof.
5. The two TEST rows: `densityLaw.test.js`'s new `it` **written failing first** (it reds before row 1
   exists, because `isOnRoster({status:'jailed'})` is already true — so instead prove it by the
   MUTANT in step 6, and say so in the receipt); `espionageMission.test.js`'s one token.
6. Plant the mutants (§P6), convict, restore digest-exact — **then** write the
   `mutation-coverage-manifest.json` row, whose `rationale` carries the executed account.
7. Run focused verification (§10), including the writer-reach and observed-shape comparisons.
8. ⭐ **THE BUILD LANE READS THE CLOSURE:** a real `npm run build`, then quote the first-paint
   figure, the generation worker's size and the engine's. **Growth beyond 60 B, or ANY movement in
   the generation worker, is a STOP for the chair** — no edit, no re-mint. Then `npm run verify:dist`
   BARE and quote its STRICT DIST line.
9. Hand the terminal the census re-derivation; write the receipt. ⛔ **Never refreeze the census.**

```text
The walker, both arms:
T1  DECLARED EQUALS DISCOVERED, both directions:
    parse NpcStatus's members from its typedef SOURCE (a comment, read on purpose);
    every roster row resolves live at path+symbol;
    the DISCOVERED enumerators (a file spelling >= 2 distinct non-active members)
      equal the roster's literal enumerator rows, both directions;
    every literal row carries every non-active member or its reasoned omission;
    every union-read row is unflagged, imports NPC_UNAVAILABLE_STATUSES, and
      spells no retired foreign word;
    EntityStatus still parses to exactly its five, UNCHANGED;
    report a FULL offender list, never a first failure.
T2  NO FOREIGN SPELLING, tree-wide:
    derive the trigger from the live typedef minus the measured homonyms;
    assert it is exactly {dead, exiled, retired} and reds if it empties or halves;
    FLAGGED set-equal, both directions, to the literal roster rows u the register;
    the verdict union's three files still spell 'jailed' and are still unflagged;
    a literal outside the union and outside the roster REDS with its file:line.
```

---

## 9. Acceptance matrix

`tests/lint/statusUnionTotality.walker.test.js` — ONE literal `describe`, FOUR straight-line `it` —
plus the two declared TEST rows and the focused suites of the files it guards.

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Guard-the-guard; the union exact; `EntityStatus` pinned; the placement asserted** | The walk is asserted non-empty first. `NpcStatus` parses to exactly **seven**, an exact sorted list, from its typedef SOURCE. `EntityStatus` is asserted **UNCHANGED at its five**. The strip and the parser are each proved in both directions. ⭐ **The vocabulary's HOME is asserted**: `NPC_UNAVAILABLE_STATUSES` is exported from `src/domain/entities/npcs.js`, so a later lane that moves it into the generation worker's closure must re-price §3.2 rather than discover the zero-slack ceiling at a terminal. |
| **A2** | **T1 — declared equals discovered, both directions** | Every roster row is found live at its declared path+symbol. The **three** discovered enumerators equal the roster's literal enumerator rows, both directions. Every literal row's enumeration is total or carries its named omission; every union-read row is unflagged, imports the vocabulary, and spells no retired foreign word. Full offender lists. |
| **A3** | **T2 — the R6′ trigger, the set-equality, and the empty register** | The trigger is **DERIVED** and asserted exactly `{dead, exiled, retired}`, with a floor arm that reds on one token or none. Each homonym must name ≥1 foreign vocabulary. FLAGGED is **SET-EQUAL, BOTH DIRECTIONS**, to the literal rows ∪ the register. The register is empty and its checker is proved on a planted row. The verdict union's three files still spell `'jailed'` and are still unflagged. Planting `'imprisoned'` or `'killed'` back into a cured row **REDS with its file:line**. |
| **A4** | **A consumer that under-enumerates is convicted** | Removing `'jailed'` from `NPC_UNAVAILABLE_STATUSES` or from `LOST_NPC_STATUS` reds T1 **by name** — proved on synthetic sources so the green is not a snapshot of itself, and by the planted mutants of §P6. |
| **A5** | ⭐⭐ **THE TWO READINGS ARE SEPARATE, EXECUTED** | **Availability** (in the walker, through the real functions): a `jailed` NPC is ineligible in `inferSuccessors` and refused by `rosterPersonAvailable`, anchored by an `active` figure who IS eligible and IS castable. **House membership** (in `densityLaw.test.js`'s new `it`): the same `jailed` figure is **ON the roster** (`isOnRoster` true), a house whose only figure is jailed reads **`crewed`**, and `readFactionLifecycle` raises **no reaction**. ⛔ The two halves are the ruling made machinery: neither file alone can express it. |
| **A6** | **`envoyCasting.js` reads the union and spells nothing** | `rosterPersonAvailable` refuses a `jailed` NPC and a `dead` one and admits an `active` one; a source scan proves the **function body contains no status string literal**. The behaviour for the two retired spellings is stated: an NPC stored as `'imprisoned'` or `'killed'` is now **admitted**, the correct reading of a value the vocabulary never contained. |
| **A7** | **⛔ NOTHING MOVES: goldens, prose manifest, and the inertness claim** | `generatorGoldenMaster` and `dossierProseManifest` are bytewise unchanged (digests before and at the tip). The inertness is proved rather than argued: **no writer in `src/` assigns `'jailed'` to a `.status`**, with the matcher proved live on a planted writer first. |

**7 of ≤8.** One slot is deliberately left unspent.

⚠ **THE STRICT-TYPECHECK EXHAUSTIVENESS CASE IS DECLARED EMPTY:** no `switch` branches over
`NpcStatus` (`git grep -n "switch" -- 'src/domain/entities/**'` returns one hit, over
`npc?.importance`). `npm run typecheck:domain:strict` is in `checks` regardless.

### The mutants (§P6) — SIX, each with its named target

⭐ Version 5 replaces version 4's M1 with **its inverse**, which is the ruling made machinery, and
adds M2′ for the new constant. M6 is retained because it convicted under version 4 and dropping it
would leave `magicFormsPractitioner.js` unplanted; six plants, not five, is the lane's call and is
recorded here for veto.

| # | plant | must red |
|---|---|---|
| **M1′** | ⭐ `ROSTER_ABSENT_STATUSES` **GAINS** `'jailed'` | `tests/generators/densityLaw.test.js` — **both** the exact-equality pin and version 5's new `it` |
| **M2′** | `NPC_UNAVAILABLE_STATUSES` loses `'jailed'` | the walker's T1 totality arm **by name**, and A5's availability half |
| **M3** | `envoyCasting.js` regains `'imprisoned'` | the walker's union-read guard, **with its file:line** |
| **M4** | a fifth enumerator planted as a new `src/` file | the walker's discovery arm **and** the flagged set-equality |
| **M5** | the typedef gains a member (`'banished'`) | A1's exact list **and** every roster row that does not list it |
| **M6** | `LOST_NPC_STATUS` loses `'jailed'` | the walker's T1 totality arm by name |

Each: prove the bytes moved (a no-op plant is a STOP), require a nonzero exit AND the named title
red, restore the exact pre-mutant SHA-256 **by `cp` from a backup taken before the plant** (never the
checkout family), rerun focused green.

---

## 10. Verification commands

```sh
npx eslint src/domain/entities/npcs.js src/domain/density/factionLifecycle.js \
  src/domain/entities/successors.js src/domain/worldPulse/envoyCasting.js \
  src/domain/worldPulse/magicFormsPractitioner.js \
  tests/lint/statusUnionTotality.walker.test.js \
  tests/generators/densityLaw.test.js tests/domain/espionageMission.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

npm run build:edge-shared        # AFTER row 1 — SEVEN artifacts, ONE window (§3.3)

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/statusUnionTotality.walker.test.js tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js

GATE_MUTEX_TIER=shared … -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/edgeFunctions/aiCharterBundle.freshness.test.js \
  tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js \
  tests/edgeFunctions/edgeSharedBundleReproducibility.test.js
  #  ⚠ STAGE the input and the seven artifacts TOGETHER before this battery: the
  #  reproducibility pin reads the METAS from the worktree and the INPUTS from the
  #  INDEX, so an unstaged input reds it by design (its header's "dirty-build class").

GATE_MUTEX_TIER=shared … -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js \
  tests/property/npcs.property.test.js

GATE_MUTEX_TIER=shared … -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/advanceWorkerByteIdentity.test.js tests/domain/entities.test.js \
  tests/domain/successors.test.js tests/domain/magicFormsPractitioner.test.js \
  tests/domain/espionageMission.test.js tests/domain/roadsParticipation.test.js \
  tests/domain/envoyDiplomacy.test.js tests/domain/assignNpcPreservesSheet.test.js \
  tests/domain/statusImpairmentSeverity.test.js tests/domain/factionRefContract.test.js \
  tests/domain/warSeatBooks.test.js tests/domain/npcLadderKernel.test.js

GATE_MUTEX_TIER=shared … -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/generators/densityLaw.test.js tests/generators/roleCategory.test.js

GATE_MUTEX_TIER=shared … -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js

# ONCE, separately: EXPECTED RED until the terminal, with the predicted tuple of §7.
GATE_MUTEX_TIER=shared … -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js

node scripts/check-observed-shape-readers.mjs     # motion is a STOP
node scripts/check-writer-reach.mjs               # compare against step 1; growth is a STOP
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1d
npm run implementation:resume -- EM-B1d
```

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe. A member never runs `npm run check`.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; HEAD is not the
verified base or a descendant proved non-interfering; **a sixth production file appears necessary**;
**any file's delta exceeds three effective lines**; **a second walker appears necessary**; a golden
or the prose manifest moves **by one byte**; `check-writer-reach` shows **growth**;
`check-observed-shape-readers` moves; an existing union member would have to be **renamed or
removed**; `EntityStatus` would have to be widened; ⭐ **the `ROSTER_ABSENT_STATUSES` array would
have to change** (version 5's ruling — availability is not house membership); a new derivation
reacting to `jailed` appears necessary; an arm at `isOffStage` appears necessary (EM-B1f's); the
`impairments[]` ledger would have to change; `SummaryTab.jsx`, `EconomicsTab.jsx`, `npcOps.js`,
`pendingEditIntents.js`, `settlementPendingEditWriters.js` or any envoy-loss-cause site appears to
need editing; the mutation-coverage manifest would need re-serialising whole, or is dirty from
another lane; the mutation-coverage path is reserved by a non-terminal packet at dispatch;
⭐ **`npm run build:edge-shared` changes any artifact other than the SEVEN named in §7**;
`tests/lint/.lighting-census-baseline.json` would have to be edited here.

⭐ **The four STOPs the rulings added:**
- ⛔ **`check-writer-reach` shows GROWTH.** The lane RECORDS the verdict and never writes a baseline.
- ⛔ **The real `npm run build` shows first-paint growth beyond 60 B attributable to this member's
  modules, or ANY movement in the generation worker's byte count.** STOP here, for the chair — do not
  let the terminal discover it. No edit, no re-mint, quote the figure.
- ⛔ **T2's trigger set comes out EMPTY or a single token**, or **the exemption register would have
  to gain a row**. Either means the homonym measurement has moved and R6′ must be re-ruled.
- ⛔ **A flagged file would have to be EDITED to satisfy the roster** — that is a sixth production
  file against the narrowed override of five.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas, **each
of the five measured with eslint's `Linter` (`skipBlankLines`, `skipComments`) and each proved ≤3**
· **proof that `ROSTER_ABSENT_STATUSES`'s array is byte-identical** · acceptance A1–A7 executed ·
the **six** mutants planted, convicted and restored digest-exact, **with the account copied verbatim
into the manifest row** · `invariants` count before and after (705 → 706) with the `+4 / −0` diff
shape quoted · **the SEVEN edge-shared artifacts named, with the two moved `sourceHash` values and
the three proved UNMOVED, and proof that no eighth artifact moved** · the writer-reach and
observed-shape comparisons · focused commands, exits and counts · sealed `check:packet` and `resume`
statuses · both typecheck configurations · base-versus-wave failure identity diff · golden digests
before and at the tip · the no-writer inertness proof · **the first-paint, generation-worker and
engine figures from a real build, with the delta against the base** · the STRICT DIST line · the
measured census tuple with the interior red quoted verbatim · generated artifacts **SEVEN, named** ·
deviations `NONE | STOP` · out-of-scope observations without investigation · **judgment calls**.

### §12.1 · Recorded follow-ups (carried forward, not investigated here)

| follow-up | status |
|---|---|
| ⭐ **EM-B1f — the status-based arm at the ONE participation chokepoint** (`isOffStage`, `src/domain/roads/state.js` §8 `:146-161`): a `jailed` or `exiled` NPC is off-stage for **every** participation read, cured ONCE at the chokepoint rather than in the three consumers that pair `=== 'dead'` with it. ⓘ The chokepoint's own law already points this way — *"TRAVELERS … are NEVER off-stage — travel is narrative, **captivity is mechanical**"*. | **CHARTERED 2026-09-19.** Ordered AFTER EM-B1d and ⛔ **BLOCKS EM-B1a'S PROMOTION** — a producible `jailed` without the chokepoint arm is a jailed mayor who still governs. |
| ⚠ **`EM-PREAMBLE.md` §P2 owes a row 12**: the edge-shared generator re-stamps EVERY sibling meta's `generatedAt`, and the estate pins a single build window, so the artifact set is always the two-per-staled-bundle **plus all five metas**. | The chair's, in its own commit (version 5 §3.3 states it locally meanwhile). |
| ⓘ **Design `:217` drift**: it still reads *"added to the typedef by EM-B1a"*; addendum 5 moved it here. `:313` already spells EM-B1d. | The chair corrects it on the ledger; nothing for the lane. |
