# EM-B1f — PRE-PROOF REPORT (Opus PRE-PROOF lane, 2026-09-20, read tip `141a1d775`)

## VERDICT

⭐ **READY-able at `141a1d775` — WITH ONE CHAIR ACT OWED BEFORE DISPATCH (Q1).**

Every verified-fact row re-found by symbol at the tip; every stale absolute rewritten as a delta;
the promotion measurement re-executed against both landed cures instead of modelled; two chartered
obligations banked; and one trap found that would have stopped the build at its own seal.

**The packet is not BLOCKED.** No premise is refuted. The single precondition — §7.4 / Q1 — is a
two-word edit to a landed packet's manifest row, which only the chair may make.

**The three files** (copies; nothing was written to the kit, any worktree, or any `docs/`):

- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-B1f-scratch/EM-B1f.md`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-B1f-scratch/EM-B1f.manifest.json`
- `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-B1f-scratch/EM-B1f.v4.evidence.md` (§1–§14 v3's, verbatim; §15–§22 appended)

Status stays `DRAFT`, header stamped **READY-able at `141a1d775`**, version `4`. `verifiedBase`
and `lastRevalidated` left as `__BASE__` for the chair; the revalidation sentence is written in the
header with the measured window facts.

**Lane hygiene:** `git status --short` in `$SP/read-tip-141a1d775` was EMPTY at the start
(07:18 EDT) and EMPTY at the end; `rev-parse --short HEAD` = `141a1d775` both times. No tracked
file was edited anywhere. No gated command was run — every figure below comes from plain `node`,
`git`, `grep`, `shasum` or eslint's/vite's/esbuild's own libraries. `npm run build:edge-shared` was
READ, never executed, and its write set established by generator AND by precedent as step 11
requires.

---

## THE J-T1 WINDOW, QUOTED

```
$ git diff --stat 19c4cb853 141a1d775 -- <all 12 v3 change paths> <all 7 v3 requiredSymbols paths>
 tests/domain/roadsParticipation.test.js | 92 +++++++++++++++++++++++++++++++--
 1 file changed, 89 insertions(+), 3 deletions(-)
```

⛔ **And the window was BLIND to the two files §13's premise rests on**, both of which moved inside
it:

```
$ git diff --stat 19c4cb853 141a1d775 -- src/domain/worldPulse/pulseKernel.js src/domain/worldPulse/factionDensityKernel.js
 src/domain/worldPulse/factionDensityKernel.js | 22 +++++++++++++++++++++-
 src/domain/worldPulse/pulseKernel.js          |  2 +-
```

`pulseKernel.js:579` was re-spelled by **CURE-F (`96036427f`)** after v3's probes ran;
`factionDensityKernel.js:719` was rewritten by **EM-B1k2 (`e96a1c33e`)**. Neither was a change path
or a `requiredSymbols` path, so v3's "the window is EMPTY" was true of the paths it named and
silent about the two that carried its claim. **Both are `requiredSymbols` rows in v4.**

---

## EVERY VERIFIED-FACT ROW: VERDICT, COMMAND, RESULT

All **CONFIRMED** unless labelled. Commands run inside `$SP/read-tip-141a1d775`.

| # | claim (v3) | command | verdict at `141a1d775` |
|---|---|---|---|
| 1 | preamble SHA `b90a95b7…caa5e1` | `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` | ⛔ **MOVED → `16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195`** (the 2nd amendment, `e5f53ae95`); matches the dispatch stamp. Corrected. |
| 2 | eight `requiredSymbols` at 157·151·105·92·618·94·113·124 | `grep -cF` per row | ✓ **all eight = 1 at exactly those lines.** Not one moved. |
| 3 | `NPC_UNAVAILABLE_STATUSES = ['dead','exiled','jailed','removed']`, frozen | `grep -n -B14 -A6` + walker A1 | ✓ CONFIRMED at `npcs.js:105`; header still names EM-B1f as the participation cure. |
| 4 | `isOffStage` reads no `.status`; body at `:157-161` | whole-file read | ✓ CONFIRMED. |
| 5 | `rosterNpcById:102` pairs `=== 'dead'` with `isOffStage`; `readWarSeatBooks` calls it at `:633` | `sed -n '92,106p'`, `'618,640p'` | ✓ CONFIRMED, both addresses exact. |
| 6 | `worldSnapshot.js:127-129` is the filter | `sed -n '120,132p'` | ✓ CONFIRMED. |
| 7 | `ROSTER_ABSENT_STATUSES:87`, `isOnRoster:96-99`, `factionRosterOf:113`, filter `:117`, dissolve `:130` | `sed -n '85,100p;110,132p'` | ✓ CONFIRMED except the last: `:130` is the **crewed** return; the dissolve is `:131`. Corrected in §5. |
| 8 | `isInStasis:151`, vocabulary `STASIS_REASONS` not `NpcStatus` | `sed`, `grep` | ✓ CONFIRMED; `STASIS_REASONS` at `npcOps.js:116` = `['journey','imprisoned','missing','sequestered']`. |
| 9 | FORM B precedent `envoyCasting.js:50` | `grep -n NPC_UNAVAILABLE_STATUSES` | ✓ CONFIRMED byte for byte. |
| 10 | `PACKET_ACTIONS:30`, `TERMINAL:43`, `reservesChangePaths:676`, dup error `:694` | `grep -n` | ✓ CONFIRMED, all four. |
| 11 | bytes: base 7,727 / FORM A 7,885 (+158) / FORM B 7,911 (+184); base SHA `23ffc63b…676481` | esbuild 0.28.1 `transformSync` | ✓ **REPRODUCES EXACTLY**, all four figures and the hash. |
| 12 | worker ceiling `1401208` at `:159`; engine `< 679_000` at `:787` | `grep -n` | ✓ CONFIRMED, both at the quoted lines. |
| 13 | no `advanceInterval.worker` ceiling today | `grep -rn advanceInterval tests/build/` | ✓ CONFIRMED — no output. |
| 14 | `roads/state.js` NOT eager; `entities/npcs.js` IS | `vite.config.js`'s own `EAGER_FIRST_PAINT_MODULES` | ✓ CONFIRMED at **268 modules**; `density/factionLifecycle.js` is a member too (the preamble's 2nd amendment, re-executed). |
| 15 | `roads/state.js` not in the generation worker; in `advanceInterval.worker` | static closure walk | ✓ **MEMBERSHIP CONFIRMED** (two independent methods agree). ⚠ counts differ by method: 544 vs v3's 549, 145 vs 220; `townSceneExport` 125 matches exactly. No price depends on a count. |
| 16 | edge-shared: 114/115 inputs, member of both; 74/2/2 not | `node` over the five `*.meta.json` | ✓ CONFIRMED, every count and every membership. |
| 17 | SEVEN `_shared` paths, generator + precedent | `grep` on `build-edge-shared.mjs`; `git show --stat 95e494bdb` / `ee8ac6c3c` | ✓ CONFIRMED both ways; the seven named in §3.3. |
| 18 | lighting: four homes CREDITED, `+4 titles` | the walker's own `parkReasonsFor`, live | ✓ **CONFIRMED and widened to FIVE homes**, all `[]`. `TEST_FILES.length = 2653` = the frozen `files` figure. Delta **`+0/+0/+0/+4/+0`** stands. |
| 19 | prose-numerics does not name the file | `grep -c` | ✓ CONFIRMED → **0**. |
| 20 | wiring census `stamp.files` = 7, none this file | `node` over the JSON | ✓ CONFIRMED, all seven under `stateProse/`. |
| 21 | tuning inventory `:967`, `line: 222`; walker keys on `spanDigest` | `grep -n -A4`; `tuningRegister.walker.test.js:406`, `:428` | ✓ CONFIRMED; `:222` is still `export const ROADS_TUNING`'s live address. |
| 22 | **nine** `docs/**` line citations | `git grep -nE "src/domain/roads/state\.js:[0-9]+" -- src docs tests` | ⛔ **TEN, not nine.** All in `docs/**`; ZERO under `src/`/`tests/`; `state.js` has 0 `cite:`. Corrected. Six spell `:319` for `riskToleranceOf`, whose live address is `:320` — **already stale before this packet**. |
| 23 | two `src/` writers of `'removed'`, both institutions | `git grep -nE "status:[[:space:]]*'(exiled\|jailed\|removed)'" -- src` | ✓ **CONFIRMED EXACTLY** — `settlementLifecycleFirstClass.js:601`, `tierOutcomeApply.js:143`, both `inst`. Zero writers of `exiled`/`jailed`. |
| 24 | `'remnant'` in `tierOutcomeApply.js`, six of seven branches | same, POSIX-safe | ⛔ **WIDER: NINE sites in THREE files** — `tierOutcomeApply ×6`, `institutionLifecycle.js:1016,1058`, `magicRegimeLifecycle.js:354`. Corrected in §12.1 for EM-B1j's slot. |
| 25 | register: 191 entries, EM-B3c the only non-terminal | `node` over `PACKET_MANIFEST.json` | ⛔ **MOVED → 193 entries, 190 LANDED, 2 SUPERSEDED, 1 READY (EM-P2)**, sharing none of the thirteen. **Placement is FREE; Q3 closed.** |
| 26 | §13: the arm erases nobody and dissolves no house | `simulateCampaignWorldPulse({commit:true})`, overlay vs control | ✓ **RE-CONFIRMED BY EXECUTION AT THE TIP, arm ON and arm OFF, identical row for row**, with a liveness anchor in both runs. See below. |
| 27 | the ninth row is lawful with `omits: ALL_BUT_DEAD` | the walker's own `offencesOf` | ✓ CONFIRMED → `[]`. |
| 28 | *"nothing else in the walker is touched"* (+2 eff) | the walker's own `FLAGGED`/`DECLARED_FLAGGABLE` | ⛔ **REFUTED for the RULED spelling.** See the headline below. |

**PLAUSIBLE, not confirmed (labelled as such in the packet):** the 525-row golden posture (5,171
NPCs, zero of the three) is v3's measurement, inherited and re-proved at the build by the two
golden suites in `checks`; the lazy-`engine` chunk membership rests on the file's own FIRST-PAINT
LAW header plus its measured absence from the eager set, not on a Rollup run; EM-B1k2's "0
duplicate display names across 5,171 NPCs" is inherited.

---

## ⛔⛔ THE HEADLINE — TWO FINDINGS THAT WOULD HAVE STOPPED THE BUILD

### 1. The chair's Q5 ruling cannot be carried by a row. It needs machinery. (§0 item 1, §7, evidence §17)

ODQ §934.47 addendum 46 (Q5) ruled *"the union-totality walker's roster rows gain
`spelling: 'derived'` … in EM-B1f's own packet"*. v3 carried `spelling: 'literals'` and called
`derived` a tooling question. **Executed through the walker's own derivations:**

| cell | A3 `FLAGGED === DECLARED_FLAGGABLE` | ninth-row `offencesOf` |
|---|---|---|
| arm ON, no row | ⛔ **FALSE** — `["src/domain/roads/state.js"]` | — (A7's red, proved) |
| arm ON, row `literals` | ✓ true | `[]` |
| ⛔ arm ON, row **`derived`** | ⛔ **FALSE** — `["src/domain/roads/state.js"]` | `[]` |

`DECLARED_FLAGGABLE` (`:264`) is built from `LITERAL_ROWS` (`:263`), which selects
`spelling === 'literals'` only — so a `derived` row never enters it while post-edit `state.js`
does enter `FLAGGED`. **And `offencesOf` branches on `'union-read'` and nothing else, so a
`derived` row checks NOTHING** — measured identical to a `literals` row.

**The measured cure, green in every direction:** `FLAGGABLE_SPELLINGS = ['literals','derived']`
widening `LITERAL_ROWS` (renamed `FLAGGABLE_ROWS`), plus a six-line `derived` branch in
`offencesOf` that convicts a file spelling a retired foreign word (with `file:line`) or not
reading `NPC_UNAVAILABLE_STATUSES`, plus two planted probes **inside the existing A2/A4 `test`**
so the lighting delta stays `+0` there. Regression-checked: the cured walker is green at the live
tree, green with a `literals` row, and **A7's red-on-delete survives**. `TRIGGER` is
`['dead','exiled','retired']` in all four cells — adding `state.js` to `ROSTER_FILES` removes no
homonym's foreign claim (its four SCREAMING_SNAKE vocabularies spell no union member).

**Cost:** the walker row goes from **+2 to +12 effective lines**. The packet stays inside every
budget.

### 2. ⛔⛔ The ceiling burn the charter ordered is TRAPPED by a LANDED `requiredSymbols` row (§7.4, evidence §19)

**EM-B1k2 is `LANDED` and requires the verbatim text `const UNDISPOSITIONED_CEILING = 7`** at
`tests/domain/roadsParticipation.test.js`. Its own `_note` says why: *"quoted WITH its value so the
no-raise is provable verbatim rather than by inspection."*

Addendum 61 item 5 orders this packet to **burn that ceiling 7 → 6**, which deletes the exact text.
`scripts/implementation-packets.mjs:801` runs a total, status-blind existence check on every
`requiredSymbols` row of every packet, and the §379.2 discharge has an explicit fence, verbatim
from the source: *"**ONLY LANDED discharges. A DRAFT or READY retirement is a promise, and a
promise may not silence a live guard.**"*

⇒ **A `retiredSymbols` row in EM-B1f does not unblock the build.** It discharges only at EM-B1f's
own flip. Between the edit and the flip,
`node scripts/implementation-packets.mjs validate` — **which is in this packet's own sealed
`checks`** — reds, and the packet cannot pass its own seal. That is EM-B1d's build STOP in a new
costume, caught here.

⚠ **And the trapped row breaks a standing law**, quoted from `implementation-packets.mjs:94`:
*"the estate already carries the general law (**"never put a re-recorded FIGURE in
requiredSymbols"**, ODQ TE-26)"*. The validator machine-enforces that law only for migration
filenames and heads; a **ratchet figure** slips through, and this is its first bite. A row written
to prove a ceiling never RISES has made the only permitted direction impossible.

---

## §13 RE-EXECUTED — THE LAUNCH'S STANDING QUESTION, ANSWERED BY THE TREE

The launch asked whether an IRREVERSIBLE consumer still reads the FILTERED participation view.
**Re-found in the tree, not re-argued:**

- **EM-B1k (`19c4cb853`)** made the WRITE base raw (`pulseKernel.js:184`, `:579`).
- **EM-B1k2 (`e96a1c33e`)** made the IRREVERSIBLE READ raw **by construction**:
  `factionDensityKernel.js:719`'s `tickStart` is `asObject(asObject(item.save).settlement || item.settlement)`.
- `tests/domain/irreversibleRawRoster.contract.test.js` (386 lines, five arms, every arm driving a
  shipped entry) is the standing guard; `roadsParticipation.test.js`'s widened census dispositions
  `factionLifecycle.js` in writing as *"PARTICIPATION-INDEPENDENT BY CONSTRUCTION AND REQUIRED TO BE"*.

**Re-executed at `141a1d775`** through `simulateCampaignWorldPulse({ commit: true })` over the A3
fixture, with §6's post-edit `state.js` supplied as a real file in a symlink overlay under
`--preserve-symlinks` (no loader, no in-memory override; the transform's two anchors throw if they
stop matching), against a control run on the unmodified tree:

| sole Weaver | houses (off / **on**) | roster | lifecycle | dissolution beat |
|---|---|---|---|---|
| `active` | `[Crown, Weavers]` / **identical** | 2 of 2 | crewed | no |
| **`jailed`** | `[Crown, Weavers]` / ⭐ **identical** | **2 of 2** | **crewed** | **no** |
| `exiled` | `[Crown, Weavers]` / **identical** | 2 of 2 | dissolved (reader) | no |
| `removed` | `[Crown, Weavers]` / **identical** | 2 of 2 | dissolved (reader) | no |
| shelved | `[Crown, Weavers]` / **identical** | 2 of 2 | crewed | no |

⭐⭐ **Identical row for row.** The liveness anchor differs by design —
`isOffStage({status:'jailed'})` is `true` in the arm run and `false` in the control — so the
identity is a measurement, not a vacuous pass. **Nobody is erased from any roster; no house leaves
`powerStructure.factions` in any cell; no dissolution beat fires.**

⚠ **This is STRONGER than v3's §13.2 reported**, and the improvement is EM-B1k2's: at v3's modelled
tree the `exiled`/`removed` rows read *"dissolved, person kept"*; at `141a1d775` the house is not
swept at all and only `factionLifecycleStateOf` reports `dissolved` — the pre-existing
`ROSTER_ABSENT_STATUSES` reading, identical with the arm absent. v3's table is kept as history and
marked superseded.

---

## DELTAS: MANIFEST, SYMBOLS, BUDGETS

**Change manifest 12 → 13.** Added `TEST tests/property/npcs.property.test.js`. Two existing rows
restated: the walker row (four edits, +12 eff) and the participation row (the census banking,
which **reverses v3's "do not touch this block"**).

**`requiredSymbols` 8 → 10**, none removed:
`src/domain/worldPulse/pulseKernel.js :: function buildSettlementMap` and
`src/domain/worldPulse/factionDensityKernel.js :: export function advanceFactionDensity` — §13's
two premises, so the next revalidation window cannot be blind to them.

**`retiredSymbols` 0 → 1:** `tests/domain/roadsParticipation.test.js :: const UNDISPOSITIONED_CEILING = 7`
(correct bookkeeping; see §7.4 — it does not unblock the build).

**`checks` 11 → 12:** gained
`npx vitest run … tests/domain/irreversibleRawRoster.contract.test.js tests/property/npcs.property.test.js`;
the eslint row gained the property file; ⛔ **`npm run build:edge-shared` is still ABSOLUTELY LAST**
(asserted programmatically when the manifest was written). `tests/lint` WHOLE is carried as an
INSTRUMENT step in §10, not a sealed check, per addendum 61 item 7.

**Budget table:**

| row | limit | v3 | **v4, measured** |
|---|---:|---:|---:|
| behavior families | 1 | 1 | 1 |
| existing logic files modified | ≤3 | 1 | 1 |
| registration-only files | ≤3 | 1 | 1 |
| handwritten files | ≤12 | 5 | **6** |
| new/changed effective production lines | ≤400 (packet ≤6) | ≤6 | **+5 MEASURED** (288 → 293) |
| hot-file delta | ≤15 | n/a | n/a — 507 lines of headroom after the edit |
| acceptance cases | ≤8 | 7 | **7** (the property observation folds into A2) |

**Step 5 (bundle budgets):** `roads/state.js` lands in the **lazy engine chunk (+184 B, bound
≤370 B)** and in `advanceInterval.worker` (**no ceiling today**; a delta against TOOL-3's 4 KB
per-train headroom, no per-packet re-mint per addendum 22). **Zero** into the zero-slack generation
worker, the three other workers and first paint. Because it lands in a budgeted chunk the packet
already carries §8's byte step and the STOP at 370 B; **nothing was added for this** beyond the
§P2-row-11 second-amendment sentence in §12 (a skipped `skipIf(!requireDistRead)` arm is not a
pass).

---

## NINE QUESTIONS FOR THE CHAIR, EACH WITH A RECOMMENDATION

1. ⛔⛔ **EM-B1k2's landed row traps the ceiling burn — a PRECONDITION OF DISPATCH.**
   **Recommend: re-spell EM-B1k2's `requiredSymbols` row as the figure-free
   `const UNDISPOSITIONED_CEILING`** in the sitting that promotes this packet. Smallest edit; the
   guard stays LIVE; it cures the TE-26 breach rather than routing around it. (`retiredBy: "§934.47"`
   would also parse but DISCHARGES the guard instead of fixing it; leaving the ceiling at 7
   disobeys addendum 61 and pads a ratchet.) This is surgery on a landed row — a chair act.
2. ⛔ **Carry the `derived` machinery, or reverse the Q5 ruling?**
   **Recommend: CARRY IT.** The ruling assigned the kind to this packet; a row without the
   machinery reds A3, and the machinery without meaning would be a decorative value. Measured green
   in every direction, +12 eff, A7 preserved. If the chair prefers the smaller packet,
   `spelling: 'literals'` is green today — but that reverses a ruling.
3. **`tests/property/npcs.property.test.js` as a sixth handwritten file?**
   **Recommend: KEEP THE ROW.** Addendum 46 left the call here, it fits (6 of ≤12), and the defect
   is real rather than cosmetic: `createNpc` **does** forward a caller's status, so the five-word
   pin would fail to catch a `jailed` or `removed` NPC the day EM-B1a makes one constructible.
4. **Eighth acceptance case, or fold into A2?**
   **Recommend: FOLD INTO A2** and keep 7 of ≤8. An eighth leaves the matrix with zero slack, and
   A2 already owns *"the arm, exact and derived"*.
5. **Should `pulseKernel.js` and `factionDensityKernel.js` be `requiredSymbols` rows?**
   **Recommend: YES, as written.** They are §13's premise, they both moved inside a window that
   reported "empty", and the standard's own test (a fact the deliverable must find unchanged)
   covers them. Cost: two rows and a slightly wider window.
6. **The census disposition's wording** (§7.3) — it names an honest residual (`npcId`'s
   `npc_${index}` fallback) that EM-B1k2's measurement makes unreachable today.
   **Recommend: KEEP THE RESIDUAL IN THE TEXT.** A disposition that omits its own weak edge is
   the kind of blanket EM-B1k2 had to narrow.
7. **`'remnant'` is nine sites in three files, not six in one.**
   **Recommend: widen EM-B1j's compile slot** (addendum 46's fate) to
   `tierOutcomeApply.js` + `institutionLifecycle.js` + `magicRegimeLifecycle.js` before it is
   dispatched, so it does not start from the narrow figure.
8. **The `docs/**` citation count is TEN, and six are already stale by one** (`:319` vs the live
   `:320`) before this packet touches anything.
   **Recommend: correct the figure where FIX-C2's docs-live baseline records it**, so FIX-C2 does
   not inherit "nine, two going stale".
9. **`git grep -E` does not honour `\s` and returns a silent empty** (it nearly refuted a true
   claim in this lane).
   **Recommend: one line in the compile brief's measurement rules** — POSIX classes in
   `git grep -E`, never `\s`/`\d`/`\w`; or `-P`. Same family as EM-B1k2's BSD-vs-GNU `-e` ruling.

---

## THE SEALED DISPATCH, CHECK BY CHECK (pre-proof step 8)

Read dry against `scripts/implementation-session.mjs` and `implementation-packets.mjs`, at a base
set to the tip:

- **branch / ancestry** — `head === verifiedBase`, so the substrate arm returns early. ✓
- **substrate unchanged since the verified base** — no `REGISTER` row is declared, so no
  declared-substrate file sits in the window. ✓
- **CREATE targets absent** — there is no CREATE row; the check is vacuous. ✓
- **non-CREATE targets clean** — all thirteen paths exist at `141a1d775` and the tree is clean. ✓
- **required symbols resolve** — all ten `grep -cF` = 1, executed (evidence §15). ✓
- **`validate`** — ✓ **at dispatch**, ⛔ **RED during the build unless Q1 is done first**: the
  ceiling burn deletes EM-B1k2's pinned text and only a LANDED retirement discharges it.
- **`checks` order** — the generator is last (asserted programmatically). ✓

## ⛔ NOTICED AND NOT TOUCHED — every item specific enough to slot

All eleven live in the packet's §12.1 so they cannot be lost; the ones that are genuinely new here:

1. ⛔ **EM-B1k2's `const UNDISPOSITIONED_CEILING = 7` row breaks ODQ TE-26** (a re-recorded figure
   in `requiredSymbols`). Beyond this packet, the general shape is unpoliced: the validator enforces
   TE-26 only for migration filenames and heads. **Slot: a TOOL lane** — extend the moving-head
   refusal to any `requiredSymbols` symbol ending in `= <number>` or `= <number>;`, and sweep the
   register for existing instances. (A cheap first measurement: the register already carries
   `UNMARKED_CEILING`, `ARGUED_ROSTER_CEILING`, `UNLAYERED_BASELINE_CEILING` and
   `WORKER_BUNDLE_CEILING_BYTES` rows — those are figure-free spellings and are the model.)
2. ⚠ **EM-B1k2's three `_note` line addresses for `roadsParticipation.test.js` are already stale**
   (`:409`/`:422`/`:425` vs the live `:480`/`:493`/`:511`). Harmless (the rows are symbol-pinned)
   but the same habit as item 1. **Slot: whoever performs Q1's edit** re-addresses the notes in the
   same touch.
3. ⛔ **`status: 'remnant'` is written at NINE sites in THREE `src/` files** and is not a member of
   the five-word `EntityStatus` typedef the walker's A1 pins. **Slot: EM-B1j's compile**, starting
   from the corrected census; **EM-B1l** if it proves to be a separate vocabulary.
4. ⚠ **Six of the ten `docs/**` citations into `state.js` are stale by one TODAY** (`:319` for
   `riskToleranceOf`, live at `:320`), before this packet inserts anything. **Slot: FIX-C2's
   docs-live baseline**, with the corrected count.
5. ⛔ **`git grep -E` silently ignores `\s`.** **Slot: the compile brief's measurement rules.**
6. ⚠ **Three of the six remaining quarantine rows — `envoyCasting.js`, `warSeatBooks.js`,
   `sovereigntyNews.js` — are files this packet's own §5 contract reads or names.** **Slot:
   EM-B1a's compile**, which will be in `warSeatBooks.js`'s neighbourhood: recommend it
   disposition `warSeatBooks.js` and `envoyCasting.js` and burn the ceiling again (6 → 4).
7. ⚠ **`tests/lint` WHOLE (~2 min) catches reds the sealed `checks` cannot**, but cannot join
   `checks` while the lighting walker reds by design. ✓ Already slotted: **the third
   preamble/standard amendment, owed at this packet's placement sitting** (addendum 61 item 7).
   Carried here as an INSTRUMENT step in §10.
8. ⚠ **v3's worker closure counts (549 / 220) and this lane's (544 / 145) disagree** while the
   membership verdicts agree and `townSceneExport` matches exactly at 125. The difference is
   dynamic-import treatment. Nothing depends on it. **Slot: TOOL-3**, which will mint the
   `advanceInterval.worker` ceiling and needs one agreed closure method.
