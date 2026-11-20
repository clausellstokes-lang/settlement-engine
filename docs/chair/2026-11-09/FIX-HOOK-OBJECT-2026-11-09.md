# FIX-HOOK-OBJECT — the record (2026-11-09, 01:05 UTC)

**Seat:** FIX-HOOK-OBJECT, a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`). **Brief:** `docs/chair/2026-11-09/BRIEF-FIX-HOOK-OBJECT-2026-11-09.md` (on `lane/chair-2026-11-08`). **Branch:** `lane/fix-hook-object-2026-11-09`, cut from `lane/integration-2026-11-07` at `46f7525cc` (it contains b7e32deed). **Merged by:** MERGE-TRAIN. This seat signs nothing.

## 1. The defect, and the one cause

In soak1k-10 (Olympambelos), the Plot Hooks › Relationships block printed "[object Object]" under "Religious Authorities vs Merchant Guilds". The same line reached the screen, the PDF and the Foundry journal. All three read `collectPlotHooks`.

- **The line.** `src/domain/dossier/hookLines.js :: PROPERTY_LINES[0]` is the declared form `{ text: (a, b, issue) => …, needs: ['guardPresence'] }` around a template (CENSUS-2c).
- **The reader.** `src/domain/facts/drawDeclared.js :: lineText` unwrapped `.text` only when it was a string. For this line it handed back the row itself.
- **The print.** `hookLines.js :: spoken` already branches on `typeof v === 'function'`. It got the row instead of the template, so its `String(v)` printed "[object Object]".

The bad line was drawn only where a guard stands, because `guardPresence` admits it. Where no guard stands, the line is refused and the draw resolves elsewhere. That is why the unguarded pin (`hookLinePoolsDeclared.test.js`, "no property conflict prints 'posted guards' …") stayed green.

## 2. The rate, before and after (1,000 towns at this tip)

| Measure | Before (46f7525cc) | After (the cure) |
|---|---|---|
| The brief's soak (`soak-review.mjs --count 1000 --workers 4`): `sample/*.txt` (60 dossiers), "[object Object]" / `undefined` / `NaN` | 0 / 0 / 0 | 0 / 0 / 0 |
| The same soak: `findings.jsonl`, `settlements.jsonl`, 60 samples | 702 findings, 0 errors | byte-identical (`cmp`) |
| **Full hook probe: `birth(i)` for soak1k-0..999, every `collectPlotHooks` hook scanned** | **8 of 1,000 towns; 8 of 40,808 hooks print "[object Object]"**; 0 `undefined`; 0 `NaN` | **0 of 1,000; 0 of 40,808**; 0; 0 |

**The soak can't see this defect.** It prints only 60 dossiers, and soak1k-10 isn't among them. `sentences.json` is not written at this tip; it is named only in the script's header. The one "[object Object]" in its output is `aggregates/fields.json :: chain.religiousFaction`, where the soak's own aggregator stringifies a categorical object. That is an instrument artifact, not printed text; it is listed for the chair and not touched here. The full probe (the seat's own script) is what measures the class.

**Before**, the eight towns were soak1k-10 Olympambelos, 83 Edznachihua, 123 Yekekhand, 124 Dharmagiri, 413 Varabagh, 508 Gankhuuüüd, 544 Itzatitlan and 815 Dzibac. **After**, each prints the sentence. For example: "Religious Authorities has posted guards on what it says is its own, and Merchant Guilds says allocation of housing and resources between established residents and newcomers was never Religious Authorities's to hold."

## 3. The class (measured first; sent to the chair before the cure)

A runtime walk covered the exports of the 56 `src` modules that write a declaration key. It found 577 declared lines: 292 with string `text`, 285 with function `text`, 0 with any other type.

| Pool | Function-valued declared lines | Reader | Handles a function? | In the class |
|---|---|---|---|---|
| `hookLines.js` HOOK_LINE_POOLS.conflict.property[0] | 1 | `drawDeclared` → `lineText` → `spoken` | `spoken` does; `lineText` handed back the row | **YES: the defect** |
| `arrivalProse.js` ARRIVAL_SENSES / PEOPLE / TENSIONS / MEMORIES | 58 / 30 / 4 / 12 | `arrivalScene.js :: drawAdmitted(...)` returns `.line`, read by `textOf(l)(name)` | yes (`textOf` unwraps any `text`) | no |
| `narrativeData.js` ARRIVAL_SCENES / STRESS_DESCS | 11 / 72 | `arrivalScene.js` through `textOf`, then `typeof === 'function'` | yes | no |
| `narrativeText.js` POLITICAL_FLAVOR | 25 | `historyCoherence.js :: flavorOf(...)` returns `.line`, read by `textOf(...)(subset)` | yes | no |
| Every other `lineText` / `String(lineText(…))` caller (npc, history, foodways, market prices, rumours, traditions, crisis, …) | 0 | — | n/a | no |

That is one reader in the class and no second cause. The chair's `text: (` counts match the census: 104 in arrivalProse once its typedef line is dropped, 25, 12 (11 ARRIVAL_SCENES + 1; the walk counts STRESS_DESCS whole) and 1. The five other `text: (` grep hits under `src/application`, `src/store` and `src/lib` are `readContext:` and `protectedContext:` and are not lines.

## 4. The cure (one cause; red-first)

`lineText` now gives back a declared line's `text` when it is a string **or a function**. The `LineText` typedef follows. Callers are affected as follows:

- **Callers that already branch on a function** (`spoken`) now get the template and apply it.
- **String-text pools** get the same bytes as before.
- **The twin compare and the default `heldKey`** (`String(lineText(l))`) now read a function-text row as its source text, the same way a bare template already reads. Neither can match a string, before or after.

PROPERTY_LINES[0] is NOT re-shaped. No declared-pool contract stood in the way.

**Red-first** (`tests/domain/dossier/hookLinePoolsDeclared.test.js`, "FIX-HOOK-OBJECT … prints the sentence, never '[object Object]'"): 40 GUARDED property conflicts. **Red at the base**, with 10 of the 40 lines reading "[object Object]". **Green after the cure**, where every "posted guards" line matches the full sentence.

## 5. The invariant: `tests/lint/declaredLineShape.test.js`

1. **Anti-vacuity, red-first by construction.** A planted pool of five declared lines (string, function, object, number, array) is classified exactly: the three bad shapes are flagged.
2. **The shape arm.** Every declared line reachable from the exports of every `src` module that writes a declaration key carries a string or function `text`. The module set is a `git grep`, so a new declaring module is walked the day it lands. **BASELINE is `[]`, and it only shrinks:** a new violation reds, and a cured one must leave the list in the same commit. The walk must reach more than 40 modules and more than 500 lines, including `HOOK_LINE_POOLS.conflict.property.0` as a function. **Scope:** a pool a module keeps private (not exported) is out of the walk's reach.
3. **The reader probe.** `lineText` of a function-valued declared line returns that function. It also covers string, bare-template and null lines. **Red at the base** ("expected { text: [Function template], … } to be [Function template]"), green after.

## 6. Proof

- **Hook and declared-draw suites:** `tests/domain/dossier`, `tests/domain/facts`, the new walker, `npcLoyaltyGuardRows`, `personHooks`, `hookThemeTotality.walker` and `drawDeclaredKeys.walker`. 63 files, 396 tests, exit 0, through `scripts/gate-tail.sh`.
- **eslint** on the three touched source and test files: exit 0.
- **Type checks:** `tsc -p tsconfig.json` 189 errors and `tsc -p tsconfig.domain-strict.json` 1,891 errors, the same counts as the clean base worktree. None of them are in a touched file.
- **Signed-record deltas.** The six suites ran in a clean worktree at the parent (46f7525cc) and at this tip: gm /525 `generatorGoldenMaster`, fence /360 `espionageDormancyFence`, herald `heraldKnowledgeDeskGolden`, prose /1,050 `dossierProseManifest`, witness `presetLightingWitness` and pdf `goldenViewModel`. The two full logs are **byte-identical** apart from the checkout path and the timings: the same 8 failing tests, with the same actual digests.
  - **Every cell moved: 0.** No fixture holds a cured town's hook text.
  - **The base's own reds, recorded and not touched:** fence "THE DRIVEN GOLDEN: 360 settlements …"; gm "every config produces byte-identical output …"; herald "THE REFILE MOVES NO CONTENT BYTE …"; and five prose-manifest arms (REFUSAL 2, THE DRIFT ARM, THE MIXED-POOL AUDIENCE ARM, THE PROVENANCE …, THE DRIFT CORPUS CARRIES FOUR SEEDS).
  - **Why gm and fence cannot move:** the generator path reaches the hook collector only through `structuralFingerprint.js :: hook_count`, a count the cure leaves unchanged.
- **The three record walkers.**
  - `testRatchet`: green.
  - `ledgerCitationIntegrity`: green once the local ref `review-fixes-2026-07-08` is created from origin.
  - `sourceCitationIntegrity`: the `tree` arm is **red at the base and at this tip: 145 vs 139** (MERGE-WAVE's cause; the brief's 140 predates later records). `tree` was not touched. `dated` is 168 at the tip, and 169 with this record.

## 7. Noticed, not this seat's (for the intake rule)

- The hook templates read a plural faction name with a singular verb and a doubled possessive: "Religious Authorities has", "Merchant Guilds's". This holds in every family's lines, not just the cured one. It is a voice item for the hooks area.
- `soak-review.mjs` names `sentences.json` in its header but does not write it, and its 60-dossier sample cannot see a 0.8% hook defect. A full hook scan would be an instrument item.
- The soak aggregator stringifies `chain.religiousFaction` as "[object Object]" in `aggregates/fields.json`.

## 8. CONFIRMED against PLAUSIBLE

**CONFIRMED** (each claim executed, with its receipt above):

- The cause.
- The 8 → 0 of 1,000 rate.
- The pin red at the base and green after.
- The walker's probe red at the base and green after.
- The shape baseline of 0 over 577 declared lines.
- The class table's readers.
- The six signed records unchanged, against the clean parent.

**PLAUSIBLE:**

- That no unexported pool holds a non-string, non-function `text`. The walk cannot reach private pools, but the source grep found no `text:` of another shape.
- That nothing outside the walked pools hands `lineText` an undeclared `{ text: fn }` expecting the row back. No caller does at this tip, and the prose manifest and the soak are byte-identical.
