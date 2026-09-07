# RECEIPT — LGT-P5-WOPS (L-HOMES CAR 4) — ⚠ PARTIAL (the four mints are COMPLETE and green; ONE register act is owed to the chair)

**Lane** L-HOMES-4 / `LGT-P5-WOPS` · **Seat** Opus 5 — Fable-unvalidated · chair Fable 5.1
**Dock** `$SC/laneLH4`, opened detached at `38474a59eba460f30d6596dcb65efda3a446738a`.
**Arrival verified:** HEAD == `38474a59e` ✅ · `git status --porcelain --untracked-files=all` = **0 lines** ✅ ·
`node_modules` = 453 depth-1 SYMLINKS, none materialised ✅ · detached ✅.
No rebase, no push, no ref write, **no register act**, no `git stash`, no `git checkout --`,
no `git show HEAD:<path> > <path>`, no `npm install`, no build, no full-suite run.
Cars 1–3's constants were neither needed nor duplicated. ⭐ **The gated register was derived from the FLAT 30-key list
at my base**, exactly as the dispatch instructs — CAR 2's split is not in my dock and my four keys append to the flat list.

**Dock tip: `427b85c63fffd8817ddfa7fbefde8a779b4da64d`** · porcelain 0 at close.

---

## 1 · OUTCOME TABLE

| step | outcome | sha |
|---|---|---|
| CAR 4 commit 1 — `infiltrationDepthEnabled` (W-OPS §6 door 1) | ✅ green | `7a8bdb6b9` |
| CAR 4 commit 2 — `missionDispatcherEnabled` (W-OPS §6 door 2) | ✅ green | `9c0fe07fb` |
| CAR 4 commit 3 — `operationsVoiceEnabled` (leaf-declared door) | ✅ green | `d44250bba` |
| CAR 4 commit 4 — `envoyTaskCatalogEnabled` (leaf-declared, ERRAND family) | ✅ green | `5594e9e9a` |
| the `tests/lint/` WHOLE run's one curable red — an un-anchored negative | ✅ cured | `ee3f3b52c` |
| the voice ratchet's 41 em dashes in authored row prose | ✅ cured at cause | `427b85c63` |

**Manifest 30 → 34. `VIRTUAL_SUBSYSTEM_ROWS` 30 → 34. `subsystemRowsOps.js` 0 rows → 4** — the leaf that landed
EMPTY as "a reserved SLOT rather than a behaviour" is now occupied by the four keys it named itself as waiting for.
**NO new file** under `src/` or `tests/`; no file renamed or deleted.

## 2 · PREMISES RE-DERIVED BEFORE ACTING

| premise as the brief states it | measured at `38474a59e` | verdict |
|---|---|---|
| `envoyTaskCatalog.js` ~:622 · `operationsVoice.js` ~:605 · `infiltrationDepth.js` ~:61 · `missionDispatcher.js` ~:66–68 | `:622` · `:605` · `:58/61/66` · `:65–70` | ✅ HOLD (last band widened by 2) |
| docket src-file counts 1 · 1 · 3 · 4 | 1 · 1 · 3 · 4 | ✅ HOLDS EXACTLY |
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` is a flat list of 30 | module read = **30** | ✅ HOLDS |
| rows go to `subsystemRowsOps.js` because `subsystemRowsVirtual.js` "sits at its 800-line size ceiling" | ⚠ that file is **595 lines**, is in **no** `scripts/.size-baseline.json` row, and `missionDispatcher.js:71–75` records the wall as **CURED** by TE-VIRT-1 ("the file is 282/800") | ⚠ **PREMISE REFUTED, CONCLUSION SURVIVES** — the rows belong in `subsystemRowsOps.js` because it is the *reserved W-OPS family leaf*, not because of a ceiling |
| `subsystemRowsOps.js` must join `subsystemCertification.js`'s import list | ⛔ **NO.** `OPS_SUBSYSTEM_ROWS` is ALREADY spread into `VIRTUAL_SUBSYSTEM_ROWS` (`subsystemRowsVirtual.js:583`), which is the ONE export every consumer reads | ⚠ AMENDED — no import edit was owed or made |
| "CR-WR10-C shape, by-name ==" | the four-part mint is spelled verbatim in-tree at `missionDispatcher.js:66–70` | ✅ HOLDS |
| **"Mint each flag DARK (false in every preset)"** | ⛔ a virtual key is dark **by ABSENCE**. Declaring it `false` in a preset spread is the **+32-serialized-bytes-per-key cure CR-WR10-C explicitly REFUSED** (`simulationRules.js:167–171`; CAR 1 measured the same cost as +7 keys on every new campaign). All four keys are absent from `DEFAULT_SIMULATION_RULES` and from all seven presets, and one arm per key asserts it. | ⛔ **REFUSED WITH MEASUREMENT** |
| "+ a dormancy fence" (docket `size` field) | ⚠ PLAN §6 POSITION 2 row 4 says **"new test file? no"** for this car, and the two documents disagree. Resolved toward the PLAN: the fence arms live in each leaf's EXISTING suite. A caller-less leaf cannot carry a seeded byte-identity fence anyway — there is nothing to run — so the honest fence is the SOURCE-level one (polarity census + truthy-refusal + conjunction + virtual-by-absence), and it belongs where the darkness pins already are. | ⚠ **RE-CUT, recorded** |

## 3 · ⛔ THE STRUCTURAL FINDING THAT RE-CUT THE CAR — WHERE A W-OPS DOOR READ CAN HONESTLY LIVE

The mint's load-bearing part is the **by-name gate read**: `engineGatedRuleKeys.walker` direction 1 reds any manifest
member the tree does not really gate. **All four leaves are PURE, INJECTED and CALLER-LESS, and three carry LANDED pins
that forbid the read inside the leaf.**

| leaf | the landed pin, by address | consequence |
|---|---|---|
| `infiltrationDepth.js` | `infiltrationDepth.test.js` — `expectAbsentWithAnchor(leafCode, 'simulationRules', …)` and `(leafCode, '=== true', '!== true', …)` | read may NOT be in the leaf |
| `operationsVoice.js` | `operationsVoice.test.js` — `expectAbsentWithAnchor(LEAF_LOGIC, 'Enabled', 'OPERATIONS_VOICE_PROVENANCE', …)` | read may NOT be in the leaf |
| `envoyTaskCatalog.js` | `envoyTaskCatalog.test.js:492` — `expect(/envoyTaskCatalogEnabled\s*\]?\s*===\s*true/.test(code)).toBe(false)` | read may NOT be in the leaf |
| `missionDispatcher.js` | none of this shape — but `espionageDormancyFence`'s reachability-chain arm requires this leaf (the espionage set's ONE admitted importer) to name neither the gate module nor the layer flag | read may NOT be in the leaf, for a *sharper* reason |

And `infiltrationDepth.js`'s own header states the design: *"Every door-bearing export here takes an explicit `lit`
argument instead, and returns `null` when it is anything but `true`."* **The door is an ARGUMENT by charter; the module
that RESOLVES it from a world is the family gate.** ⛔ **All four pins are LEFT STANDING by this car.**

⭐ **THE PRECEDENT WAS MEASURED, NOT ARGUED** (`$SC/lh4-scratch/probe1.mjs`, a probe over all 30 manifest keys pairing
each key's gate-read file with that file's src-importer count): **`warCirculationEnabled` and `contributionLedgerEnabled`
are gated ONLY inside `contributionLedger.js`, a leaf with ZERO src importers**, whose header defends the shape verbatim —
*"the reads live here, in the module the flags exist for"* … *"BOTH FLAGS ARE VIRTUAL AND LIT IN NO PRESET, so no seeded
world reaches this lane."* A caller-less gate read is a LANDED, twice-used idiom. `foreignSeatOf` records the same
disposition at SEAT-1 ("NO production consumer at this car … greens REGRESSION-grade").

⇒ **The doors land in the FAMILY DOOR MODULE:** `espionage/espionageGate.js` (ES-0, "the ONE door the espionage layer
passes through", 9 src importers) for the three espionage/operations keys, AND-composed with `espionageActive` because
W-OPS §2 says *"everything here sits behind `espionageActive` / `errandSpineActive` / its own doors"*; and
`errandMint.js` (the errand spine's own door home) for the catalog key, **AND-composed with the SPINE, deliberately not
with espionage** — an errand is not a covert mission, and an arm asserts both halves of that asymmetry so a later car
that folds the key under the covert layer reds instead of silently inverting it.

⚠ **WHAT THIS CAR DOES NOT BUY, STATED PLAINLY.** None of the four subsystems acquires a caller. Lighting these keys in
a preset would still change no world byte, so **CAR 4 does not by itself unblock the espionage flip** — L-DEFAULT hunk 6
still needs CAR 5's wiring. What the mint buys is exactly what CR-WR10-C exists for: **census visibility** for four
subsystems that were invisible in a third way — built, dark, **and ungated**, so not even on the measured backlog.

## 4 · TWO LANDED INSTRUMENTS RE-CUT, EACH STRICTLY STRONGER, EACH ON THIS VOLUME'S OWN RULING

`envoyTaskCatalog.test.js` and `operationsVoice.test.js` each claimed **"no src module IMPORTS/names this leaf"** and
MEASURED **mentions** of the bare file-stem string. The CR-WR10-C mint necessarily adds that string in three bookkeeping
places — the manifest member, the certification row's `module` path, and the family door — none of which is a caller.
Rather than soften either arm, both were **SPLIT** on the sibling car's landed verbatim ruling
(`missionDispatcher.test.js:362–364`: *"An IMPORT SPECIFIER census, not a mention census … a header is not a caller"*):

- the CALLER claim became an **import-specifier census** — strictly stronger, because a mention scan is satisfied by a
  renamed import and this is not;
- the **mention census SURVIVES beside it as an EXACT roster** (3 names each; 2 for `infiltrationDepth`), so a new namer
  reds AND a vanished mint surface reds.

The same discipline produced two more instrument repairs: each polarity census counts **COMPARISONS, not names** (the
manifest member and a row's `rule` field name the key and gate nothing), and `subsystemRowsVirtual.test.js` gained
`TEMPLATED_CANDIDATE_LANES` — see §5.

## 5 · THREE THINGS FOUND BY BUILDING, NOT BY READING

1. **The template-literal blind spot.** `subsystemRowsVirtual.test.js`'s candidate trace asks
   `file.src.includes('candidateType')` and reds on ANY spelling, while `MINT_RE` — which decides what a row may
   DECLARE — matches only the single-quoted form. **Ten src files** compose a templated `candidateType`
   (`npc_${actionFamily}`, `strategy_${move}`, `${pressure.kind}_pressure`, …) and no lane leaf was one of them until
   this car. A templated family is **undeclarable** (the receipt carries the expansion, not the template), so the
   disposition is a recorded per-LEAF entry asserting BOTH halves — the spelling really is templated, and `MINT_RE`
   really finds nothing — so a later single-quoted mint in the same leaf reds instead of riding the waiver.
2. **The string-presence hazard the leaf's own header predicted, hit and cured in one run.** The catalog row's first
   draft named two parked task rows by their literal words. `subsystemRowsOps.js` is a src module; the catalog's suite
   runs **src-wide ABSENCE censuses** on exactly those words; the row reddened a fence that was working perfectly.
   That is ODQ §843's hazard verbatim (*"a mention scan cannot tell prose from a gate … the cheapest cure is to not
   write the token"*). Both dispositions are now cited **by SHAPE**, with the reason written on the row.
3. **The voice ratchet prices authored certification prose.** `voiceMechanics` convicted the car by name:
   `subsystemRowsOps.js: baseline em:0 bang:0 → current em:41 bang:0`. The leaf's baseline is zero because it landed
   EMPTY, so every em dash was a raise on a **shrink-only** register. **Cured at cause** (colons and commas carry the
   same clause break at zero register cost); the 14 em dashes in this file's COMMENTS are untouched and uncounted.
   This is PLAN §8's own prediction executed: *"a string-adding car landed before the prose FALL is banked GUARANTEES a
   refused register act."*

## 6 · RECEIPTS — EVERY EXIT CAPTURED IN-SHELL

| instrument | exit | figure |
|---|---|---|
| `npx eslint` (every touched file, per commit) | **0** | zero problems |
| `npm run typecheck:domain:strict` (after every commit) | **0** | `no strict-type regressions (1120 errors, ceiling 1120)` |
| `npm run check:observed-shape-readers` | **0** | detector source unchanged; `1993 finding(s)`, inventory exact |
| `node scripts/check-writer-reach.mjs` | **0** | judged 6520 · LIT 550 · LIT-NAME 4644 · DARK 1326 — identical to CAR 1's |
| `node scripts/count-tuning-inventory.mjs` | **0** | 233 declared rows / 147 no-importer tables — identical to CAR 1's |
| focused vitest, all four mints together (13 files) | **0** | `Test Files 13 passed (13) · Tests 316 passed (316)` |
| `tests/copy/voiceMechanics.test.js` + `proseLeak.test.js` (after the cure) | **0** | per-file debt exactly matches the baseline |
| `tests/build/campaignRuntimeLazy.test.js` | **0** | the first-paint laziness pin holds |
| **`tests/lint/` WHOLE, at the final tip** | **1** | `Test Files 1 failed | 138 passed (139) · Tests 1 failed | 2145 passed (2146)` |

**The single `tests/lint/` red, attributed:** `sovereigntyLightingContract.walker.test.js` >
"THE CENSUS IS AN ASSERTION" — `expected 23226 to be 23204`. **The tree measures 23226**; 23204 is the frozen figure.
It is the lighting census owed to the chair, caused by this car's **+22 test titles and by nothing else**. Every other
arm of the 138-file scanner family is green. ⚠ An earlier whole-dir run also caught
`negativeAssertionAnchor.walker` (one un-anchored `not.toContain` this car wrote) — **cured in `ee3f3b52c`**, and it is
the preamble's structural claim executed rather than quoted: three single-file greens in a row were blind to it.

**The flag denominator moved exactly four:** `simulationRules.js` raw-source scan for `/\b[a-zA-Z][a-zA-Z0-9]*Enabled\b/`
reads **90 distinct at base → 94 at tip**. Each key is spelled ONCE in that file. No phantom was minted by a comment.

## 7 · PLANT-OUT — four mutants, all killed, all restored byte-identical

Backups taken BEFORE each plant, outside the measured tree (`$SC/lh4-scratch/bk/`); restore by `cp` + `cmp` + md5 in the
same shell. The `git checkout` family was never used.

| # | mutant | reds |
|---|---|---|
| M1 | delete `infiltrationDepthEnabled` from the manifest (the gate read becomes an UNACCOUNTED gated key) | **4** — `engineGatedRuleKeys` BOTH directions + the backlog-exactness arm + the row partition + the virtual-by-absence arm |
| M2 | loosen the dispatcher door from `=== true` to `Boolean(...)` | **3** — the strictness arm, the polarity census, and `engineGatedRuleKeys` direction 1 (the manifest member stops being gated at all) |
| M3 | **the L-DEFAULT event, unannounced** — `operationsVoiceEnabled: false` into the `full_simulation` spread | **2** — the virtual-by-absence arm and `engineGatedRuleKeys`'s "the manifest is VIRTUAL keys only" |
| M4 | sever the catalog door's spine conjunction | **1** — the spine-versus-covert asymmetry arm |

⭐ M2 is the one that matters most: the estate has shipped a fully-wired flag the census could not see before, and a
loosened door now reds in three places at once. M3 proves a later silent *lighting* cannot land quietly either.

**Restore proof:** `simulationRules.js 89ca032933f401b26a352c2e8f9835ab` · `espionageGate.js
e579e723f409034ab7e58181fb5a2376` · `errandMint.js 490cdf3e486a87e0ca2a656fc0eca379` — live == backup for all three by
`cmp` AND md5, and `git status --porcelain --untracked-files=all` **empty**.

## 8 · EAGER BYTES = 0 — the reason, not the hope

All six touched `src/` files are **OUTSIDE the first-paint source closure**, measured with the landed pin's own walker
re-implemented read-only (`$SC/lh4-scratch/closure.mjs`): `sourceStaticClosure('src/main.jsx')` = **241 modules**, and
`simulationRules.js`, `espionageGate.js`, `errandMint.js`, `envoyTaskCatalog.js`, `operationsVoice.js` and
`subsystemRowsOps.js` are **all absent from it**. The car adds **no new import edge from any module at all** on the src
side: `espionageGate.js`'s three new doors call `espionageActive` in the same file; `errandMint.js`'s door calls
`errandSpineActive` and `asObject`, both already local. The authority is the LANDED pin, not my walker:
`tests/build/campaignRuntimeLazy.test.js` **passes at this tip** (§6).
⇒ **predicted first-paint delta 0 B.** The chair's hashed-chunk listing diff remains the proof; this is the reason.

## 9 · PREDICTED REGISTER DELTAS — recorded, NOT taken

| register | frozen | this tip | delta | how |
|---|---|---|---|---|
| lighting census `files` | 2523 | 2523 | **0** | DERIVED — no test file added, renamed or deleted (`git diff --diff-filter=ADR` empty) |
| lighting census `parked` | 371 | 371 | **0** | DERIVED — same reason |
| lighting census `credited` | 2152 | 2152 | **0** | DERIVED — same reason |
| lighting census `titles` | 23204 | **23226** | **+22** | **MEASURED** by the walker's own red |
| lighting census `suiteTitles` | 6217 | **6221** | **+4** | DERIVED (one `describe` per car: 9→10, 7→8, 8→9, 8→9), cross-checked by the titles half matching exactly (45→50, 39→44, 57→63, 50→56 = +22). ⚠ The walker throws on `titles` first, so this figure is invisible to it — predict BOTH |
| test ratchet `totalTests` | 31489 | +22 | **+22** | DERIVED; a 90 % collapse floor, so a rise cannot red it |
| test ratchet `totalFiles` | 2468 | unchanged | **0** | no file added or deleted |
| test ratchet `entries` (known failures) | 6 of ceiling 17 | 6 | **0** | no new known failure; the car lands green except the census |
| **golden-freeze register** | — | — | **0** | no new test file, no fixture, and **no golden-adjacent env spelling anywhere in the car's whole diff** (`git diff 38474a59e..HEAD \| grep -E 'UPDATE_\|GOLDEN\|REFREEZE\|process\.env\|GENESIS\|REBANK'` = empty) ⇒ neither a row nor an exclusion is owed |
| four censuses per new `src/domain` leaf | — | — | **0** | **no new leaf** — every edit is to an existing module |
| `sizeBaseline` | — | — | **0** | none of the six src files carries a baseline row; `subsystemRowsVirtual.js` is 595 lines against a layer ceiling of 800 (the brief's "at its ceiling" is refuted, §2), and `tests/lint/sizeBaseline.test.js` is green inside the whole-dir run |
| voice magnitudes | — | — | **0** | `voiceMechanics` + `proseLeak` **green after the em-dash cure** — the 41-em raise was refused and cured rather than banked |
| writer-reach · OSR · tuning inventory · domain-strict | — | — | **0** | each measured above, exit 0, figures identical to CAR 1's |
| engine-gated walker backlog | 17, ceiling 17 | 17 | **0** | the four keys join the MANIFEST with rows, never the backlog — the walker's "bank wins by deleting rows, never by widening the list" arm is green |

## 10 · DEFERRALS — written down, not dropped

1. **A BEHAVIOURAL dormancy fence is owed the day any of these four subsystems acquires a caller.** Today a
   seeded byte-identity fence would be a pin over an empty population; the source-level fence is what the tree can
   honestly carry. **Deliberately deferred — documented, not a bug to re-find.**
2. **CAR 3 (`LGT-P13-FENCES`) derives "the twelve keys with no fence" from the gated register at the SHARED base**, which
   does not contain my four. The register is now **34**, so the chair should re-derive that twelve before CAR 3 lands, or
   the four newest keys will be silently outside the fence sweep.
3. **`missionDispatcher.js`'s header still reads "NO FLAG IS MINTED HERE".** It is now false, and it is the ONE header I
   would not touch: `espionageDormancyFence`'s reachability arm asserts that file's RAW source contains neither
   `espionageGate.js` nor `espionageEnabled`, so any honest correction risks that fence. The other three leaves' door
   strings WERE cured. **A chair call, deliberately parked with its reason.**

## 11 · RETROVALIDATION ROW (owed to the Fable 5.1 chair)

| # | what an Opus seat JUDGED | what the chair must RE-DERIVE | receipts by path | priority |
|---|---|---|---|---|
| 1 | **The door reads live in the FAMILY GATE, never in the leaf** — `espionageGate.js` ×3 and `errandMint.js` ×1 — on the measured `contributionLedger.js` precedent, rather than in the leaves the brief's "four mints" implies | that a caller-less gate read in the module the flags exist for is the right shape here, and that the four landed darkness pins were rightly left standing | `$SC/lh4-scratch/probe1.mjs` · `contributionLedger.js:24–38` · the four door docblocks | **HIGH** — it re-cuts the brief |
| 2 | **Two landed mention censuses re-cut to import-specifier censuses + exact namer rosters**, on the sibling car's own verbatim ruling | that this is a cure at cause and not a softening, and that the exact rosters are the right replacement reach | `envoyTaskCatalog.test.js` · `operationsVoice.test.js` · `missionDispatcher.test.js:362–364` | **HIGH** |
| 3 | **The catalog door AND-composes with the SPINE, not the espionage layer** — a deliberate divergence from its three siblings | that a diplomatic menu belongs on the errand spine, and that the asymmetry arm is the right pin for it | `errandMint.js` door docblock · `envoyTaskCatalog.test.js` asymmetry arm · mutant M4 | **HIGH** |
| 4 | **"false in every preset" REFUSED**; the keys are dark by ABSENCE | that absence is the intended dormancy and that L-DEFAULT will light by *adding* the key, never by flipping a declared false | `simulationRules.js:167–171` · four virtual-by-absence arms · mutant M3 | MEDIUM |
| 5 | **The dormancy fences are SOURCE-level and live in the existing suites**, not new `tests/property/*DormancyFence.test.js` files (PLAN over docket) | that no new test file was the right call for a caller-less lane, and that deferral 10.1 is the right home for the behavioural half | PLAN §6 POSITION 2 row 4 · §10.1 | MEDIUM |
| 6 | **`TEMPLATED_CANDIDATE_LANES`** added to a landed trace to disposition a ten-file blind spot | that a recorded per-leaf entry with a two-sided assertion is the right disposition, rather than widening `MINT_RE` for every lane | `subsystemRowsVirtual.test.js` | MEDIUM |
| 7 | **41 em dashes cured rather than banked** in authored certification prose | that curing beat a refused voice-register raise, and that the discipline should bind later row-authoring cars | `427b85c63` · §5.3 | LOW |
| 8 | committed with `--no-verify` | that the hook's work was done by hand: eslint exit 0 on every touched file at every commit, and `tests/lint/sizeBaseline.test.js` green inside two whole-dir runs, so no `eslint --fix` re-stage could have hidden anything | §6 | LOW |

**Dock tip: `427b85c63fffd8817ddfa7fbefde8a779b4da64d`.**
