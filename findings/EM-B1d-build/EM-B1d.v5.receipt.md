# EM-B1d version 5 — §12 completion receipt, filled BY EXECUTION

**LANDED. Commit `95e494bdb`** on `fixes-2026-09-18-consist`, parent `ad7ddf2c9`,
16 files changed, 556 insertions(+), 23 deletions(-). `git status --short` **empty**.
`git show --stat HEAD` names **exactly the sixteen** §7 paths and nothing else.

- **Lane:** Opus build lane, session 7d3418f8, 2026-09-19. **Slot:** `$SP/slot-2`.
- **Seal:** `implementation:dispatch -- EM-B1d` exit **0**,
  `sealDigest 5486771f0174aed10581313a98d1f401c0deb1818f34c13126c6dc64b5afd2d6`,
  verifiedBase `50e1f237b985d9288d9a7cabcf2f8467f23c5e48`, branch matched, HEAD `ad7ddf2c9` descended.
- **Preamble:** `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` — re-computed and
  equal to the packet header's. (§P2 row 12 is this lane's own version-4 STOP, landed as law.)
- **Pre-edit precondition:** `grep -cF "status: 'imprisoned'" tests/domain/espionageMission.test.js`
  = **1** (the chair's exactly-once STOP precondition, satisfied); after the cure, **0**.

## 1 · Changed files and effective-line deltas (eslint `Linter`, skipBlankLines + skipComments)

| file | before | after | delta | ≤3 |
|---|---:|---:|---:|---|
| `src/domain/entities/npcs.js` | 138 | 139 | **+1** | ✓ |
| `src/domain/density/factionLifecycle.js` | 61 | 61 | **+0** | ✓ COMMENT ONLY |
| `src/domain/entities/successors.js` | 52 | 53 | **+1** | ✓ |
| `src/domain/worldPulse/envoyCasting.js` | 92 | 93 | **+1** | ✓ (the existing `npcs.js` import clause was EXTENDED — no new import line, no new module edge) |
| `src/domain/worldPulse/magicFormsPractitioner.js` | 70 | 70 | **+0** | ✓ |
| **total production** | | | **+3 of ≤15** | ✓ |
| `tests/lint/statusUnionTotality.walker.test.js` (CREATE) | — | **240** | of ≤250 | ✓ |

Five production files of the narrowed override's five; handwritten **9 of ≤12**; generated **7**.

⭐ **`ROSTER_ABSENT_STATUSES` IS BYTE-IDENTICAL** — proved, not asserted: `git diff` carries no
`+`/`−` on its line; only its docblock gained the `jailed — REVERSIBLE (a verdict ends). PRESENT.`
judgment row.

## 2 · Acceptance A1–A7, executed

`tests/lint/statusUnionTotality.walker.test.js` — ONE literal `describe`, FOUR straight-line
`test`; no `.each`, no looped/conditional/nested registration.

- **RED 1** (walker written, `src` at base): `Tests 4 failed (4)`, exit 1 — the union at six, the
  roster's `NPC_UNAVAILABLE_STATUSES` row unresolved, the jailed NPC still eligible.
- **RED 2** (after row 1 alone): `Tests 3 failed | 1 passed (4)`, exit 1 — A1 GREEN (seven members,
  `EntityStatus` pinned at five, the placement asserted), A2/A4, A3 and A5 convicting the un-cured
  consumers by name. This is the red that proves coupling; RED 1 alone would only have proved a
  missing export.
- **GREEN**: `Tests 4 passed (4)`, exit 0.
- **A1** exact sorted seven, distinct, parsed from the typedef SOURCE; `EntityStatus` UNCHANGED at
  five; ⭐ the vocabulary's HOME asserted, so a later relocation must re-price §3.2 against the
  zero-slack worker rather than discover it at a terminal. **A2** all eight roster rows resolve;
  the THREE discovered enumerators equal the declared literal enumerator rows both directions.
  **A3** trigger DERIVED and exactly `{dead, exiled, retired}`; FLAGGED SET-EQUAL both directions;
  register empty and its checker proved on a planted row; the verdict union's three files still
  spell `'jailed'` and are still unflagged. **A4** proved on synthetic sources and by M2′/M6.
  **A5** the two readings, executed in two files (below). **A6** `rosterPersonAvailable` admits
  active, refuses jailed and dead; its body carries no status literal. **A7** goldens unmoved and
  no writer in `src/` assigns `'jailed'` to a `.status`, the matcher proved live on a planted writer.

⭐ **A5 is the version-5 ruling, and neither file alone can express it.** Availability lives in the
walker (a jailed NPC ineligible in `inferSuccessors`, refused by `rosterPersonAvailable`, anchored
by an active figure who is both). House membership lives in `tests/generators/densityLaw.test.js`'s
new `it`: the same jailed figure is ON the roster, the house reads `crewed`, no reaction is raised.

## 3 · The six mutants (§P6)

Each: `cp` backup taken before the plant, byte-change proved, run under the mutex, nonzero exit with
the NAMED title red, restored by `cp` and verified byte-identical by `cmp` + sha256 in the same
shell. ⛔ Never the checkout family. Focused green after every restore: `Tests 4 passed (4)`, exit 0.

| # | plant | TRUE_EXIT | counts | convicted |
|---|---|---:|---|---|
| **M1′** | `ROSTER_ABSENT_STATUSES` **GAINS** `'jailed'` | 1 | `2 failed \| 149 passed (151)` | **BOTH** densityLaw arms — the exact-equality pin *and* this packet's new arm |
| **M2′** | `NPC_UNAVAILABLE_STATUSES` loses `'jailed'` | 1 | `3 failed \| 1 passed (4)` | T1 by name + A5's availability half |
| **M3** | `envoyCasting.js` regains `'imprisoned'` | 1 | `2 failed \| 2 passed (4)` | the union-read guard: `spells imprisoned at 111:imprisoned` |
| **M4** | a fifth enumerator planted (new `src/` file) | 1 | `2 failed \| 2 passed (4)` | the discovery arm **and** the flagged set-equality |
| **M5** | the typedef gains `'banished'` | 1 | `2 failed \| 2 passed (4)` | A1's exact list + every roster row |
| **M6** | `LOST_NPC_STATUS` loses `'jailed'` | 1 | `1 failed \| 3 passed (4)` | T1 by name |

The account above is copied verbatim into the manifest row.

## 4 · Registration

**Mutation coverage 705 → 706**, inserted SURGICALLY between
`"tests/lint/dossierMountRegistry.walker.test.js"` and
`"tests/lint/stepPresentationEngineFence.walker.test.js"`, anchored on the key NAMES — a pure
**`+4 / −0`** diff; the file was not re-serialised. `kind: rationale`, inline, 2,534 chars.

**Lighting census — NOT refrozen** (the terminal's act, the chair's). Measured WHOLE twice in
throwaway out-of-tree `git archive` probes, both deleted:

| | files | parked | credited | titles | suiteTitles |
|---|---:|---:|---:|---:|---:|
| live at `ad7ddf2c9` | 2649 | 384 | 2265 | 25015 | 6675 |
| with this packet | **2650** | **384** | **2266** | **25019** | **6676** |
| **delta** | **+1** | **+0** | **+1** | **+4** | **+1** |

## 5 · Gate results, every count line

| command | exit | counts |
|---|---:|---|
| `tests/lint` **WHOLE** | 1 | `Test Files 3 failed \| 169 passed (172)` · `Tests 5 failed \| 2769 passed (2774)` |
| edgeFunctions (2 freshness + committed-tree pin) | **0** | `3 passed (3)` · `67 passed (67)` |
| property (goldenMaster, proseManifest, npcs.property) | **0** | `3 passed (3)` · `22 passed (22)` |
| domain (9 files) | **0** | `9 passed (9)` · `125 passed (125)` |
| generators (densityLaw, roleCategory) | **0** | `2 passed (2)` · `193 passed (193)` |
| copy (voiceMechanics) | **0** | `1 passed (1)` · `30 passed (30)` |
| `npx eslint` (eight touched files) | **0** | no output |
| `typecheck:ratchet` (`tsconfig.full.json`) | **0** | `167 error(s), ceiling 167` |
| `typecheck:domain:strict` (`tsconfig.domain-strict.json`) | **0** | `1113 errors, ceiling 1113` |
| `check-observed-shape-readers` | **0** | `1964 finding(s), exactly matching the frozen inventory` |
| `check-writer-reach` | **0** | byte-identical to baseline — **NO movement**, no baseline written |
| `implementation-packets validate` | **0** | `valid: 189 packets (1 READY)` |
| `npm run build` (exclusive mutex) | **0** | `✓ built`; 304 prerendered routes |
| `npm run verify:dist` (BARE) | **0** | `STRICT DIST OK — 59 file(s), 538 test(s)` |
| `check:packet` / `implementation:resume` | 1 / 1 | ruled exception 2 — see §7 |

### `tests/lint` whole — base-versus-wave failure identity diff

Run at **PRISTINE HEAD out of tree, with none of my edits**, and compared:

| file | at pristine HEAD | in the wave | verdict |
|---|---|---|---|
| `proseNumerics.test.js` | `1 failed \| 28 passed (29)` — `worldSnapshotPublic.js` (committed 615, scans 628) | identical | pre-existing, lawful — EM-B3a's debt, CURE-B's |
| `proseWiringCensus.walker.test.js` | `3 failed \| 75 passed (78)` — `stale-bytes`, `tradeRouteAccess/terrainType/monsterThreat -> src/generators/steps/resolveConfig.js:195/198/203` | identical | pre-existing — EM-P3's debt |
| `sovereigntyLightingContract.walker.test.js` | — | 1 failed | **mine, declared** (the census delta) |

**REDS OF MINE: NONE beyond the declared census red.** Zero offenders name any of the five edited
files (`grep` for `(npcs|factionLifecycle|successors|envoyCasting|magicFormsPractitioner)\.js:[0-9]+`
over the whole run returns nothing). ⭐ The whole-directory rule earned its keep on its first run:
`proseWiringCensus` was an unknown second pre-existing red.

## 6 · Generated artifacts — SEVEN, named, one window, one run

| artifact | `sourceHash` |
|---|---|
| `aiCharterBundle.js` + `.meta.json` | `237061fd5e0b3d71` → **`577116ea20da66f5`** MOVED |
| `aiOutputSchemaBundle.js` + `.meta.json` | `bac86bfd077b5b43` → **`556608bff80c94a6`** MOVED |
| `aiGroundingBundle.meta.json` | `9788abb8fdb7287e` **UNMOVED** (`generatedAt` re-stamped) |
| `analyticsEventsBundle.meta.json` | `0a6ba64ce0b8d5e2` **UNMOVED** (`generatedAt` re-stamped) |
| `intentAtlasBundle.meta.json` | `9136e063f280d77f` **UNMOVED** (`generatedAt` re-stamped) |

**No eighth artifact moved.** Recorded inputs are repo-internal — `ESCAPING: 0`, quoted:
`node_modules/immer/dist/immer.mjs`. ⚠ **The five metas' sha256 digests were identical immediately
before and immediately after the commit** — the pre-commit hook did NOT re-stamp anything, so the
single build window is intact in the landed tree.

## 7 · Budgets, measured against a probe build of this same base

| figure | base `ad7ddf2c9` | wave | verdict |
|---|---:|---:|---|
| first-paint static closure | 1,039,235 | **1,039,267** | **+32 B** against the ≤60 B bound; 8,733 B of margin remain (budget 1,048,000) |
| generation worker | 1,401,208 | **1,401,208** | ⭐ **BYTE-IDENTICAL, same content hash** — the EXACT zero-slack ceiling untouched, as §3.2's placement measurement predicted |
| lazy engine | — | **677,935** | against `< 679,000` |

## 8 · The two ruled exceptions (the chair, 2026-09-19)

Both were raised by this lane as STOPs, uncommitted, and ruled before the commit. Both are defects
in the packet's own figures, outside the sixteen declared paths.

1. **§7 P2.1 declares `+5 titles`; the measured delta is `+4`.**
   `tests/generators/densityLaw.test.js` imports no opener from `'vitest'`
   (`grep -c "from 'vitest'"` → **0**) and so is parked `OPENER_UNRESOLVED`; the `it` this packet
   adds there counts nowhere. The version-5 draft — mine — priced a title in a file that was never
   credited. The chair corrects P2.1 at the LANDED flip, where no seal is live.
2. **`check:packet` and `implementation:resume` both exit 1**, identically:
   `validate-packets: exit 0 · typecheck-full: exit 0 · typecheck-domain: exit 0 · lint-manifest:
   exit 0 · focused-1..8: all exit 0 · focused-9: exit null, 0 ms · focused-10..13: exit null,
   0 ms`. `focused-8` is `npm run build:edge-shared`, which re-stamps five DECLARED paths mid-chain
   and the gate invalidates every step after it — an ORDER defect in the `checks` array I authored.
   **CONFIRMED:** steps 9–13 did not run. **PLAUSIBLE:** the mid-chain rewrite is the mechanism (I
   did not instrument the gate). Under the exception the landing rests on the gate's own green
   `focused-1..8` plus those five steps EXECUTED BY HAND at the same tree, all green and quoted in
   §5. ⚠ `resume` was deliberately **not re-run after the commit**: it would re-stamp the five
   metas and break the single build window now pinned in the landed tree.

## 9 · Deviations and judgment calls

**Deviations:** `NONE` beyond the two ruled exceptions above. **Judgment calls: FOUR, all recorded
and all accepted by the chair** — the roster's checked `spelling` field (now §6 contract); the
roster-FILE own-vocabulary rule (its own failure proved it: keyed on symbols, `envoyCasting`'s
derived set counted itself a foreign vocabulary spelling `'missing'`); six mutants rather than five;
and withdrawing the symlink-poisoned artifacts rather than committing or hand-fixing them.

## 10 · ⚠ For both shared briefs — a zsh trap that produced a SILENT non-run

```sh
M="GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20"
env $M sh scripts/gate-mutex.sh --run -- npx vitest run …      # → EXIT=2, no count line
```
**zsh does not word-split unquoted parameter expansions** (unlike bash), so `env` receives the whole
string as ONE argument and never runs the command. Four batteries reported `EXIT=2` with no count
line and were re-run with explicit `export`s. ⭐ Only the estate's law — *a gate line with no
printed test count DID NOT RUN* — caught it; the exit code alone would have been read as a red to
diagnose rather than a run that never happened. **Never collapse the mutex exports into a variable:
export them, or write them inline on the command.**

## 11 · Noticed and not touched — specific enough to slot

1. ⭐ **`tests/generators/densityLaw.test.js` is parked `OPENER_UNRESOLVED` with 112 `it`s that have
   never counted as evidence.** One line — `import { describe, it, expect } from 'vitest'` — would
   credit all 112 and move the census by a large, deliberate amount. Chair-slotted as a parallel
   lane over every file parked ONLY for an unresolved opener.
2. ⭐ **EM-B1e's `tests/domain/ruinInstitution.test.js` is parked too** (`+1 files / +1 parked /
   +0 credited / +0 titles / +0 suiteTitles` at its landing) — the same class, found when the
   derived live tuple missed by four figures.
3. ⭐ **`proseWiringCensus.walker.test.js` is red at the branch tip** with `stale-bytes` and three
   mis-addressed producer citations at `src/generators/steps/resolveConfig.js:195/198/203`. Proved
   pre-existing at pristine HEAD. It wants the same cure lane as `proseNumerics`'s row.
4. ⭐ **A generator among a packet's `checks` must be the LAST entry** — otherwise it rewrites
   declared paths mid-chain and every later step is invalidated. Worth a line in the pre-proof brief.
5. **`preserveSymlinks: true` in `scripts/build-edge-shared.mjs`** would make a symlinked worktree
   structurally incapable of poisoning an artifact; the chair has slotted it as a tooling packet.
6. `factionLifecycle.js`'s R18 header now names the near-miss explicitly, so the next reader cannot
   re-merge availability with house membership without reading why it was split.
