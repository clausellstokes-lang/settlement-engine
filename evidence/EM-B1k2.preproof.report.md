# EM-B1k2 — PRE-PROOF REPORT (Opus pre-proof lane, read-only, 2026-09-20 03:10–03:4x EDT)

**Tree:** `$SP/read-tip-63e40fe57`, detached at `63e40fe5708c1459fe303442c38e66fa8e9b388b`.
`rev-parse HEAD` printed that sha and `status --short` was EMPTY at start and at end.
**Wrote only** under `$SP/lane-preproof-EM-B1k2-scratch/`. No gate, no vitest, no eslint CLI, no npm
script, no estate check script. The two probes are plain `node` reads of the tree's own modules.

## VERDICT — ⭐ READY-able, with TWO PLACEMENT GATES and ONE CHAIR DECISION

**Not BLOCKED.** Every verified fact in the packet re-found by symbol at the tip; the packet's central
premise is now EXECUTED FACT rather than a model (§15 below). Three things the chair must decide or
wait for:

1. ✔ **GATE 1 DISCHARGED** — EM-B1k is LANDED at `19c4cb853`, flipped at `63e40fe57`; both seam
   lines quoted. The `roadsParticipation.test.js` reservation is gone.
2. ⛔ **GATE 2, NEW AND MEASURED** — the chair's `contract`-token rename forces a
   `scripts/mutation-coverage-manifest.json` row, and **EM-B3c (READY) reserves that exact path**.
   Two non-terminal packets on one path red `validate:packets` by construction. ⇒ place EM-B1k2
   after EM-B3c is terminal (it is building in the slot beside this train), or move one row. **Q2.**
3. ⛔ **THE SMALLEST MEASURED CONTRADICTION** — the chair's brief says the fourth root
   `src/generators/density` gives `titularSuccession.js` its disposition row. **It does not.** That
   root convicts `applyDensityLaw.js`; `titularSuccession.js` never spells the literal `.npcs`
   (it reads the roster only through `factionRosterOf`), and an `EXPECTED` row for a file the scan
   does not return REDS the exactness arm. Delivering the chair's intent costs one more `-e`
   pattern on the scan. Priced both ways. **Q1.**

**The three files:**
`$SP/lane-preproof-EM-B1k2-scratch/EM-B1k2.md` (version 2, `__BASE__` left for the chair) ·
`…/EM-B1k2.manifest.json` (8 change rows, 21 requiredSymbols, 8 acceptance cases, 11 checks) ·
`…/EM-B1k2.evidence.md` (the compile's §1–§12 untouched; §13–§21 appended).
§7's table and the JSON are **SET-EQUAL, proved by command** (8 = 8, no path on one side only).

## THE J-T1 WINDOW — quoted

```sh
$ git -C $SP/read-tip-63e40fe57 diff --stat 32602dc60 63e40fe57 -- <all 14 manifest + requiredSymbols paths>
 src/domain/worldPulse/pulseKernel.js    |   4 +-
 tests/domain/roadsParticipation.test.js | 118 ++++++++++++++++++++++++++++++++
 2 files changed, 120 insertions(+), 2 deletions(-)

$ git log --oneline 32602dc60..63e40fe57
63e40fe57 PACKETS: EM-B1k LANDED at 19c4cb853 (version 2) …
19c4cb853 EM-B1k: the tick's settlement is born from the raw save roster …
07cc2efb6 PACKETS: EM-B1k's §7 change table made set-equal with its JSON manifest …
1e5bcf83d REGISTER: the lighting census re-derived at train EM-T3's terminal …
1b381485f PACKETS: EM-B1k placed and READY at c740ded8b (version 2) …
c740ded8b DOC: the chair's owed corrections on the branch …
```

⇒ **no production file of this packet moved in the window.** CREATE target absent in both spellings.
Preamble re-hashed `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` — identical.

## FACTS CHANGED (old → new), each with its proving command

| # | fact at the compile base | at `63e40fe57` | command |
|---|---|---|---|
| 1 | `foundReaders` at `:308`, the grep at `:308` | **`:425`**, grep at **`:426`** | `grep -n "function foundReaders\|execFileSync('grep'" tests/domain/roadsParticipation.test.js` |
| 2 | quarantine/ceiling addresses unstated | `UNDISPOSITIONED_NPCS_READERS` **`:409`**, `UNDISPOSITIONED_CEILING = 7` **`:422`**, exactness arm **`:430`** | same grep |
| 3 | the via-snapshot blanket at `:73` | **`:191`** (EM-B1k's +118 moved it) | `grep -n "everything else is via-snapshot" …` |
| 4 | `EXPECTED` rows unaddressed | factionDensityKernel **`:257`** (TE-DENSITY-1 at `:246-256`), roadsKernel **`:366`**, settlementLifecycleFirstClass **`:367`**, successorNpc **`:368`** | same grep |
| 5 | worldSnapshot by-reference identity at `:131` | **`:132`** (`settlement = _s`); the view is `:127-129`, the block `:124-133` | `grep -n "const _s = saveSettlement\|settlement = _s;" src/domain/worldPulse/worldSnapshot.js` |
| 6 | writer 1's caller = `applyWorldPulse.js:733` | still `:733`, and the **direct** call of the writer is **`:155`** inside `applyOutcomeToSettlement`; `entry.settlement` at `:717` | `grep -n "applySettlementLifecycleOutcomeToSettlement" src/domain/worldPulse/applyWorldPulse.js` |
| 7 | EM-B1k's seam "will land" | **LANDED and quoted**: `:184` and `:579` | `grep -n "save?.settlement" src/domain/worldPulse/pulseKernel.js` |
| 8 | the widened root convicts **one** file | ⭐ **it convicts `applyDensityLaw.js`, not `titularSuccession.js`**; three new convictions under root+pattern | `grep -rl` at 2 / 3 / 4 roots and with `-e factionRosterOf`: **41 / 42 / 43 / 44**, both BSD grep and ugrep |
| 9 | eager closure "251 modules" (evidence §8) | ⭐ **268**, re-derived through `vite.config.js`'s own `EAGER_FIRST_PAINT_MODULES` | `node -e "import('./vite.config.js')…"` |
| 10 | mutation-coverage **NOT OWED** | ⭐ **OWED** — `NAME_PATTERN.test('irreversibleRawRoster.contract.test.js')` → **true** | `node -e "import('./tests/lint/mutationCoverage.shared.mjs')…"` |
| 11 | name-join risk "0 duplicates on a 7-town sample" | ⭐ **0 duplicates across 525 rows / 5,171 NPCs** | `node name-census.mjs` |
| 12 | legacy save shape "unmeasured" | ⭐ **CLOSED**: no writer can hide a roster behind a missing `.settlement` | the save-writer read, evidence §17 |
| 13 | 7/7 vs 0/7 measured with B1k **modelled** | ⭐ **reproduced at the real tip**, same 7 towns, same 6-beat control | `node tickstart-reprobe.mjs 75 7` |

Unchanged and re-confirmed: `:699` / `:698` / `:704` / `:714` / `:721-723` / `:732` / `:262` / `:287`;
`applySettlementLifecycleOutcomeToSettlement` `:578` and its dispersal `:611-614`; `replaceOustedNpcs`
`:64` / `:66` / `:69-76` (the join at `:65`, `:70`); `npcVerdictPulse` `:79` / `:99` / `:133`;
`pulseKernel` `:388` / `:617-618` / `:660`; `roadsKernel` `:425` and `:1094-1096`; `isOffStage` `:157`;
`factionLifecycle` `:87` / `:113` / `:155`; `densityLaw.test.js` `snapOf` `:1412` / `:1571`, 13 drives;
effective lines **395 / 462 / 50 / 838** and `pulseKernel` 1581.

## requiredSymbols DELTA — 16 → 21, none removed

All sixteen original rows `grep -cF` = **1** at the tip. **Five added, each measured = 1:**

| path | symbol | why it is owed |
|---|---|---|
| `src/generators/density/applyDensityLaw.js` | `export function disperseNamedRoster` | the fourth root's real conviction — the census row is about this symbol |
| `src/generators/density/titularSuccession.js` | `import { factionRosterOf } from '../../domain/density/factionLifecycle.js';` | the dark caller; its disposition asserts exactly this edge |
| `scripts/mutation-sweep.sh` | `MUTATED_FILES=(` | the array the plant must join; quoted so the insertion point is unambiguous |
| `scripts/mutation-coverage-manifest.json` | `"uncoveredBaseline": 186` | quoted WITH its value: a raise would be the register's first ever |
| `tests/domain/roadsParticipation.test.js` | `const UNDISPOSITIONED_CEILING = 7` | the no-raise made provable verbatim (the quarantine row stays as well) |

`retiredSymbols`: **NONE**, and the post-edit simulation proves it — the packet replaces the
INITIALIZER of `const tickStart`, never a named symbol; `function foundReaders` survives its body
change verbatim; no other packet holds a row on the replaced text.

## STEP 5 — THE CHUNK MEASUREMENT, AND WHAT IT ADDED

| budget | ceiling (re-read at the tip) | this packet's members | cost |
|---|---:|---|---:|
| generation worker | `1,401,208` (`generationWorkerLazy.test.js:159`) — zero slack | none of the four | **0 B** |
| eager first paint | `1,048,000` (`vendorPdfLazy.test.js:565`), last 1,047,205 (`:539`) | ⭐ `successorNpc.js` only — **re-derived through vite's own export, 268 modules**; `factionLifecycle.js` is also eager but is not edited | **0 B required** (comment-only, no `/*!`) |
| lazy engine | `< 679_000` (`:787`), last 678,131 (`:776`) | `factionDensityKernel.js` | **≤200 B**, bounded and stated as source×2 |
| advanceInterval worker | none yet (TOOL-3) | all four | a DELTA, no re-mint |
| edge-shared | five metas' `inputs` | **0 hits** (114/74/115/2/2) | no rebuild, **no generator in `checks`** |

**What it added:** nothing to `checks` — the opposite. Under the chair's Q7 ruling the two
dist-gated `tests/build` rows LEFT the sealed `checks` (they are `skipIf(!requireDistRead)` and
would read as a pass; TOOL-2's guard would refuse them), and the byte proof is the chair's build +
`verify:dist` at the landing, with §3.2 keeping the measurement as the build lane's narrative.
`tests/lint/mutationCoverageManifest.test.js` took the slot, because version 2 moves that register.

## REGISTER MOVES — every one as a DELTA

| register | verdict | delta |
|---|---|---|
| lighting census | **OWED** | `+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles`. ⭐ Unaffected by the rename: `parkReasonsFor` = `classify(src).reasons` (`:1670`) reads SOURCE, never a path |
| mutation-coverage | ⭐ **OWED (new)** | `invariants` **+1** row (`kind: "mutation"`), `uncoveredBaseline` **unmoved at 186**, enumeration **706 → 707** (708 once CURE-G's rename lands) |
| mutation sweep | ⭐ **OWED (new)** | `MUTATED_FILES` **+1** (84 → 85), plants **135 → 136** |
| participation census | **OWED** | `foundReaders()` **41 → 44** (or 43), `EXPECTED` **+3** rows (or +2) and 3 rewrites, quarantine and ceiling **+0** |
| size baseline | not owed | `roadsKernel.js` 838 → 838, tolerance-zero both ways |
| writer-reach · observed-shape | measure, motion is a STOP | 0 rows today for all four paths |
| prose-numerics · wiring-census `stamp.files` · tuning-inventory · `path:line` citations | **NOT A RED** | 0 / 0 (7 rows, all `stateProse/`) / digest-keyed with the two comment pins verbatim at `:212` and `:428` / 0 hits across six paths |
| enumeration floor (`baseStateCapsule.test.js:369`) | not a red | `> 440` is a FLOOR; this packet moves it UP by one |

## THE WINDOW THE CHAIR MUST RE-RUN

This pre-proof is pinned at `63e40fe57`. A cure lane is committing on the branch right now, and
**two of its three commits land in files this packet touches**:

- **CURE-E** — two test files (`humanizeEngineTokens`, `faithPanelModel`): no overlap.
- **CURE-F** — `pulseKernel.js:579`'s comparand: no overlap with this packet's paths, but it changes
  a line this packet QUOTES in §5 and in the revalidation sentence.
- ⛔ **CURE-G** — renames `tests/store/participationWriteBase.test.js` → `…contract.test.js` **and
  writes its mutation row + plant**, i.e. it lands in **BOTH** register files this packet now names
  (`scripts/mutation-coverage-manifest.json`, `scripts/mutation-sweep.sh`) and raises the
  enumeration floor at `tests/scripts/baseStateCapsule.test.js:369`.
- Then **the chair's lighting refreeze** (B1k's +6 and CURE-F's +1 titles) moves the census tuple
  this packet prices as a delta — harmless by construction, since nothing here quotes an absolute.

**Re-run at the promotion tip:** `foundReaders()` = 41 · the four effective-line figures ·
`enumerateInvariants` (706 + CURE-G's +1) · the twenty-one `grep -cF` · the CREATE target's absence ·
and **the EM-B3c reservation on `scripts/mutation-coverage-manifest.json`**.

## CHAIR QUESTIONS (numbered; the lane does not wait)

1. ⛔ **Q1 — the fourth root does not convict `titularSuccession.js`.** (a) *Recommended:* widen the
   scan by one `-e 'factionRosterOf'` → 41 → **44**, three dispositioned convictions, the chair's
   fate for `titularSuccession.js` delivered as ordered, cost one array token. (b) Roots only →
   **43**, two rows, `titularSuccession.js`'s disposition as prose — honest, but the file stays
   invisible to the ratchet. The packet is written for (a) and states exactly what changes under (b).
2. ⛔ **Q2 — the `contract` rename costs two register files and collides with EM-B3c.** Recommended:
   keep the rename and the row as ruled and place EM-B1k2 after EM-B3c lands. The alternative
   (EM-B3c carrying B1k2's row) is the drift TOOL-1's arm exists to find.
3. **Q3 — the plant is a BUILD-LANE act.** The `check_caught` line runs a real vitest under the
   sweep's restore discipline; the convicting mutant IS A1's red. Confirm the build lane owns it.
4. **Q4 — the uniqueness assertion's home.** Addendum 39 says A5; the name join lives in A6's
   function. Placed in **A6**, anchored on 525 / 5,171 / 0. One word moves it.
5. **Q5 — CLOSED, reported.** No raw-fallback token and no fourth production file are owed. Veto if
   the chair wants the token anyway.
6. **Q6 / Q7 — ruled and applied** (`EXPECTED` with dispositions; the dist-gated pair out of `checks`).
7. **Q8 — a NEW question the measurement raised:** the pulse's member list is **unfiltered by access
   state** (`campaignSliceShared.js:167-178`; `isSaveActive` appears nowhere in `src/store/`), so an
   INACTIVE save that is a campaign member is handed to `buildWorldSnapshot` as a bare envelope.
   Harmless for this packet (no roster ⇒ no filter). Does the chair want a slot?

## ⛔ NOTICED, NOT TOUCHED — each specific enough to slot

1. **The pulse walks INACTIVE saves.** `campaignSettlements` (`src/store/campaignSliceShared.js:167-178`)
   selects members by id alone; `grep -rn "isSaveActive" src/store/` → zero hits, while
   `src/lib/saves.js:280` materialises an inactive save as `settlement: null`. A tick can therefore
   walk a save the library considers inaccessible. **Slot: a one-line measurement lane over the
   advance path, or a chair question.**
2. **`execFileSync('grep', …)` resolves through `PATH`,** and this machine's interactive `grep` is
   `ugrep 7.8.4` while node resolves BSD grep 2.6.0-FreeBSD (CI has GNU grep). The census's verdict
   therefore depends on the host's grep dialect. Both agree on these patterns — measured — which is
   why §6.3 uses two `-e` flags rather than a BRE `\|`. **Slot: TOOL-7's silent-failure-idiom lint
   (a scan whose result depends on the host's tool dialect).**
3. **Two further already-raw settlement maps the compile did not name:** `applyWorldPulse.js:1209`
   (`applyWorldPulseProposal`) and **`:1308`** (`mintRealmVerbProposal`), both
   `{ saveId, save, settlement: save.settlement || save }`. **Slot: CLOSED — measured, both raw.**
4. **`npcVerdictPulse.js` sits in the ratchet's QUARANTINE** (`:409-421`) while this packet names it
   as the provable base of permanent writer 2. Banking that row is a real, small win and is **not**
   this packet's (it would move the quarantine, which §5 forbids). **Slot: the next packet that
   edits `npcVerdictPulse.js`, or a cure lane — the disposition is already written in this packet's
   §6.2 and §6.3 prose.**
5. **The evidence's eager figure (251) was a replica walk.** `vite.config.js`'s own comment forbids
   replicas of `computeEagerModuleGraph`, and the replica was 17 modules light. Retired here (268).
   **Slot: CLOSED — recorded, and the packet now cites the export.**
6. **`applyDensityLaw.js:319` is a roster reader with no disposition anywhere today** and will
   acquire its first one through this packet. Its neighbours in `src/generators/density`
   (`densityAscension.js`, `densityRoll.js`, `successionGrammar.js`) read no roster — measured.
   **Slot: CLOSED — measured, only two files in that tree read a roster at all.**
7. **The first-paint closure's live margin is still a three-week-old figure** (1,047,205 at `:539`).
   **Slot: TOOL-3's resume, as the chair already fated.**
8. **`tests/domain` holds 44 enumerated invariant files, 26 of them `uncovered`.** This packet adds
   the 45th (as a `mutation`). No action owed; recorded because TOOL-6b's admission design will meet
   the same ratio question one tree over. **Slot: TOOL-6b's brief.**

## HONESTY LEDGER

**CONFIRMED (command + output quoted in evidence §13–§21):** the tip and its clean status; the J-T1
window; the preamble hash; EM-B1k's two seam lines; every §5 address; the four effective-line
figures; all twenty-one `grep -cF`; the census figures at 2/3/4 roots and with the second pattern,
under two grep engines; the 525-row name census; every save writer and the absence of `isSaveActive`
in `src/store/`; the `NAME_PATTERN` predicate and the 706-file enumeration; the register shapes and
baselines; the EM-B3c reservation and the validator's rule; the eager closure through vite's own
export; the edge-shared input membership; the 7/7 vs 0/7 core measurement at the landed tip.
**PLAUSIBLE (reasoning, flagged as such in the packet):** that `check-observed-shape-readers` and
`check-writer-reach` do not move (a lane runs no estate script — both are in `checks`, and motion is
a STOP); that the lazy-engine growth is ≤200 B (a source-text×2 bound, to be proven by attribution at
the build); that A5/A6's exact red strings reproduce (the compile executed them; this lane did not
re-drive them).
