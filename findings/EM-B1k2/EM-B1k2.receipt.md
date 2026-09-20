# EM-B1k2 — COMPLETION RECEIPT (§12), filled BY EXECUTION

**Commit:** `e96a1c33e578502d249d3004f8b022b020199ece` on `fixes-2026-09-18-consist`
**Verified base:** `154bd7c07a2e4f6bf900fd8a7572050b9692c79e` (HEAD descended from it via `5a3380e8d`)
**Seal:** `implementation:dispatch -- EM-B1k2` exit **0**, sealDigest `bdcc83339407b91b6b260deaa22e686a67d9655fff08f845cc0391d158ea2399`, capsuleDigest `ea62e4b13861da387850d6723b1d567f3b176f0261cf7eb48e2af12462547596`
**Preamble SHA-256:** computed `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` — equals the header. CONFIRMED.
**Final state:** `git status --short` EMPTY; `git show --stat HEAD` names exactly the eight §7 paths; the pre-commit hook rewrote nothing (`git diff HEAD --stat` empty).

---

## 1. The four reds before, and their greens after — CONFIRMED

| arm | before the cure | after |
|---|---|---|
| **A1** | RED — `the law was handed ["faction_dissolved::The Weavers","faction_dissolved::The Chandlers"]`; the dissolution is PROPOSED for a house whose one member is merely shelved | GREEN |
| **A4** | RED — `["faction_dissolved.ashford.the_chandlers.4", "faction_dissolved.ashford.the_weavers.4"]` where one address is owed; the `fresh` fallback dissolves the house | GREEN |
| **A2** | GREEN (regression arm; §9 states `n/a`) | GREEN |
| **A5** | GREEN, counterforce MEASURED: `roster out 2 \| dispersed stamps 2 \| the shelved soul present: false` against `3 / 3 / present` raw | GREEN |
| **A6** | GREEN, counterforce MEASURED: `roster out 2 \| the ousted replaced: true \| the shelved soul present: false` against `3 / true / true` raw | GREEN |

Red-first count line: `Tests 2 failed | 3 passed (5)`. Green count line: `Tests 5 passed (5)`.
⚠ A5 and A6 are structurally green from birth — they pin COMMENT-ONLY files whose code this packet does not touch. §9's "today's RED" column for them is the COUNTERFORCE FIGURE, and both reproduce it exactly. §11.9 is satisfied for all four on that reading; flagged for the chair because §8 step 2's wording implies four failing arms.

## 2. Effective lines — CONFIRMED (eslint `Linter`, `max-lines {skipBlankLines, skipComments}`)

| file | before | after |
|---|---:|---:|
| `factionDensityKernel.js` | 395 | **395** |
| `settlementLifecycleFirstClass.js` | 462 | **462** |
| `successorNpc.js` | 50 | **50** |
| `roadsKernel.js` | 838 | **838** |

New CREATE suite: **226** effective lines (cap 250). The three comment-only files show `+16 / +19 / +9` insertions and **zero deletions**; an executed scan found **0** non-comment added lines across them. The only production code change in the packet is one line for one line.

## 3. `foundReaders()` 41 -> 44 — CONFIRMED

New members exactly `src/domain/density/factionLifecycle.js`, `src/generators/density/applyDensityLaw.js`, `src/generators/density/titularSuccession.js`. EXPECTED 37 + quarantine 7 = 44 = live scan, exact match in both directions (convicted-but-unlisted `[]`, listed-but-not-found `[]`). `UNDISPOSITIONED_NPCS_READERS` and `UNDISPOSITIONED_CEILING = 7` byte-identical. Measured under `grep (BSD grep, GNU compatible) 2.6.0-FreeBSD`, the engine `execFileSync('grep', …)` resolves to.

## 4. Every golden — CONFIRMED, UNMOVED

`shasum -a 256` before the first edit and after the last, identical:
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```
`tests/property/generatorGoldenMaster.test.js` + `dossierProseManifest.test.js` + `roadsDormancyGolden.test.js`: `Tests 25 passed (25)`. No `UPDATE_*` door was touched.

## 5. writer-reach and observed-shape — CONFIRMED, UNMOVED

- `node scripts/check-observed-shape-readers.mjs` exit **0**, before and after: `observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.`
- `node scripts/check-writer-reach.mjs` exit **0**, before and after: `WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294 (reviewable 495)`.

## 6. The plant — CONFIRMED, three legs, cp discipline

`md5 9e05e7e19eb149f46d39eaf307b68a22` before and after (`cmp` byte-identical).
- LEG 1 clean: `Tests 5 passed (5)`
- LEG 2 planted: `Tests 2 failed | 3 passed (5)`, **`title_matches=1`** (`check_caught` reds on 0 or >=2)
- LEG 3 restored: `Tests 5 passed (5)`

⛔ `scripts/mutation-sweep.sh` was NEVER executed as a whole. Its `check_caught` reverts with `git checkout -- <file>`, which on this SHARED tree would have discarded this lane's own uncommitted work in the target. The plant was proved by hand with a cp backup and a cp restore, which is the discipline every neighbouring plant records.

## 7. The registers — CONFIRMED

`enumerateInvariants` 708 -> **709**; manifest invariants 708 -> **709**; kinds `rationale 432 / mutation 90 -> 91 / uncovered 186`; **`uncoveredBaseline` UNMOVED at 186**. Sweep labels 123 -> **124**, all unique; zero phantom claims, zero orphan labels, zero doubled labels. `MUTATED_FILES` 84 -> **85**; mutation targets 112 -> **113**; zero unguarded, zero stale guards. `tests/lint/mutationCoverageManifest.test.js` green.

## 8. Lighting — the DELTA, never an absolute

Frozen `2652 · 383 · 2269 · 25043 · 6679`. Measured: **files +1 · parked +0 · credited +1 · titles +5 · suiteTitles +1** — the packet's stated delta **EXACTLY**. Walker run ONCE, separately; it is this packet's ONE named interior red. ⛔ NOT refrozen.

⚠ **The walker's census arm FAILS FAST on the first figure**, so a lane running it plainly can only ever see `files`. The other four were measured through the walker's OWN assertions by importing it under a scratch-only `vitest` stub that records instead of throwing — no re-implementation, no refreeze door, nothing written into the worktree. Worth a chair note: the only in-tree way to see the full tuple today is the refreeze door a lane is forbidden to use.

## 9. Commands and exits — all CONFIRMED

| command | exit | count line |
|---|---:|---|
| `npx eslint` (all six touched files) | 0 | — |
| `npm run typecheck:ratchet` | 0 | `167 error(s), ceiling 167` |
| `npm run typecheck:domain:strict` | 0 | `1113 errors, ceiling 1113` |
| vitest `tests/domain` (7 files) | 0 | `Tests 99 passed (99)` |
| vitest `tests/generators/densityLaw.test.js` | 0 | `Tests 151 passed (151)` |
| vitest `tests/property` (3 goldens) | 0 | `Tests 25 passed (25)` |
| vitest `tests/lint` named arms (4) | 0 | `Tests 37 passed (37)` |
| vitest `tests/copy/voiceMechanics.test.js` | 0 | `Tests 30 passed (30)` |
| vitest anti-vacuity + negative-anchor walkers | 0 | `Tests 24 passed (24)` |
| vitest **`tests/lint` WHOLE** | 1 | `Tests 1 failed | 2775 passed (2776)` — the lighting census only |
| `node scripts/implementation-packets.mjs validate` | 0 | `valid: 192 packets (1 READY)` |
| `npm run check:packet -- EM-B1k2` | 0 | all 16 steps exit 0 |
| `npm run implementation:resume -- EM-B1k2` | 0 | all 16 steps exit 0 |

**Base-versus-wave failure identity:** the chair's run 19 was red by one test outside this packet (EM-B3c's synthetic sort fixtures read by the SS4 meta walker). It is not in `tests/lint` and did not appear in any run above. This packet's only red anywhere is the lighting census.

**Generated artifact delta: NONE.** No edge-shared bundle, no generator in `checks`.

## 10. Deviations / judgment calls — THREE, each vetoable

1. ⭐ **§6.1's VERBATIM expression reds BOTH typecheck ratchets.** `asObject(item.save?.settlement || item.settlement)` produced `TS2339: Property 'settlement' does not exist on type 'unknown'` (full) and `… on type '{}'` (domain-strict) at `factionDensityKernel.js:711`, **+1 against a baseline of 0 in both**. Cause, measured: `itemById` is declared `Map<string, Record<string, unknown>>`, so `item.save` is `unknown`; EM-B1k's sister line at `buildSettlementMap` survives only because that function takes untyped parameters and its `item` is implicitly `any`. LANDED SHAPE: `asObject(asObject(item.save).settlement || item.settlement)` — the module's own narrowing helper, already imported and already applied to the next term. It agrees with the optional chain on EVERY input (missing, null, primitive and array `save` all yield `{}` and fall through to `item.settlement`), so the behaviour contract in §6.1 is unchanged. Still ONE line, no helper, no import, no reformat. The mutation plant's perl program is written against the landed text.
2. ⭐ **NO `npm run build` was run by this lane.** §3.2, §7.1 P2.11 and §12 each rule the byte proof is the chair's build + `verify:dist` at the landing, and §12 says in terms that the attribution "belongs to the chair's landing measurement, not to this receipt"; §8 step 9 reads the other way. The zero-byte claim for the EAGER `successorNpc.js` is therefore **PLAUSIBLE, not CONFIRMED**, supported structurally: comment-only, zero code bytes, zero deletions, and an executed grep showing **0** occurrences of `/*!`, `@license` or `@preserve` across all four production files. The lazy-engine cost is bounded by the added source text: the replaced expression grew by **34 bytes**, well inside §3.2's stated <=200 B.
3. ⭐ **Two hand-keyed `pulseKernel.js:<n>` citations reddened a walker and were re-spelled.** `tests/lint/pulseKernelLineAddress.walker.test.js` (frozen at zero, no allowlist) convicted `factionDensityKernel.js — pulseKernel.js:184` and `roadsParticipation.test.js — pulseKernel.js:617`. Both became the estate's sanctioned CONTENT anchors and both were executed as RESOLVING against the live kernel under that walker's RULE 2. The packet's own §5/§6.2/§6.3 prose uses line addresses for this module, so a future EM packet will hit the same wall.

## 11. NOTICED, NOT TOUCHED — each specific enough to slot

1. ⭐ **A PRODUCTION PROSE DEFECT: the dissolution beat renders a DOUBLED ARTICLE.** `dissolvedBeat` composes `headline: \`${townName}: the ${houseName} is no more\`` over a `seatKey` that already carries its article, so a real tick narrates **"Ashford: the The Chandlers is no more"**. Executed, visible in this packet's own red output. The same `the ${…}` shape appears in `interregnumBeat` ("the ruling seat stands empty" summary), `emergenceBeat` and `foldBeat` in `src/domain/worldPulse/factionDensityKernel.js`. This reaches the player as Wizard News. **Slot: a one-file prose cure lane (strip a leading article, or stop prefixing), owner-visible copy.** This packet deliberately did NOT pin the rendering — the new suite keys its liveness anchor on `sourceEventId` instead, so the cure will not red it.
2. ⚠ **The lighting walker cannot be fully measured by a lane.** Its census arm is a sequence of `expect().toBe()` calls that fails fast at `files`, and the only in-tree path to the remaining four figures is `LIGHTING_CENSUS_REFREEZE`, which a build lane is forbidden to use. Every lane that must report a delta therefore either guesses four fifths of it or reaches outside the harness. **Slot: either a read-only `LIGHTING_CENSUS_REPORT=1` door that prints the tuple and exits non-zero without writing, or an explicit chair ruling that lanes report `files` only.**
3. ⚠ **`tests/lint/pulseKernelLineAddress.walker.test.js`'s own header documents a DELIBERATELY DEFERRED sibling class:** `<module>.js:<n>` addresses are live across the estate for `seasons.js`, `candidateEvents.js`, `warDeployment.js`, `navalKernel.js`, `roadsKernel.js`, `informationStatecraft.js` and others (~45 mixed markers), and `MODULES` already takes a set. This packet's own dispositions add several such addresses for `applyWorldPulse.js`, `npcVerdictPulse.js`, `successorNpc.js` and `factionLifecycle.js`. **Slot: the widening lane the walker's header already names — it is chartered in prose, not in the queue.**
4. ⚠ **`scripts/mutation-sweep.sh` can no longer be run whole on this tree by anybody**, and the reason is structural rather than incidental: its revert is `git checkout -- <file>` over a shared worktree that permanently carries lanes' uncommitted work. The register already records this for three plants as a `rationale`. The sweep now has 124 labels whose proofs are all by-hand cp records. **Slot: a chair question — either a `MUTATION_SWEEP_RESTORE=cp` mode, or a dedicated single-owner checkout the sweep runs in.**
5. ⚠ **`npcVerdictPulse.js` sits in the census QUARANTINE (undispositioned) while being permanent writer 2's direct caller.** This packet dispositioned the writer but could not bank its caller's row — that debt is not this packet's to bank, and the ceiling stays at 7. The evidence for its disposition is now written one file away. **Slot: a quarantine-burn lane; it is the cheapest of the seven to retire now.**
6. ⚠ **A5 and A6 cannot be red-first by construction** — they pin comment-only files. Any future packet whose acceptance cases are written contracts rather than code changes will hit the same wording problem in §8 step 2. **Slot: an EM-PREAMBLE sentence distinguishing a "red-first arm" from a "counterforce measurement".**
7. ⚠ **`tests/lint` WHOLE takes ~2 minutes and is not in the packet's `checks`.** It caught the `pulseKernelLineAddress` red that the packet's twelve sealed steps did not. **Slot: the chair's standing-instruments list already mandates it; worth promoting into `check:packet`'s step set so a lane cannot skip it.**
8. ⛔ **CLOSED, recorded:** the legacy save shape (§12.1 item 1), the name join (item 2, re-proved in A6 over this packet's own fixture), and the two already-raw proposal maps (item 10) remain closed by the pre-proof's measurement; nothing this lane executed contradicts them.
