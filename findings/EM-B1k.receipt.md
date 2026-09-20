# EM-B1k — COMPLETION RECEIPT (Opus BUILD lane, slot-2, 2026-09-20)

**LANDED** on `fixes-2026-09-18-consist` as **`19c4cb85393e73404caa3bac1fe7800a48bfd39e`**.
Verified base `c740ded8b4b5d02a7a360b370c2d3f6df4c75763`; built at HEAD `07cc2efb6` (a descendant;
ancestry confirmed). Seal `fef9fd0e4ada6ae778c0f3d39d269b797a078d1082f58cdb83c91ec6d8eeec1a`,
capsule `86733d95f0804710d1098f16848c7989f9e5eeaf85fa3f20219a305b7b999da8`.
Preamble SHA-256 `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1` — matches the
packet header. Every claim below is **CONFIRMED (executed)** unless marked PLAUSIBLE.

## Changed files and effective-line deltas — CONFIRMED

| path | action | delta |
|---|---|---|
| `src/domain/worldPulse/pulseKernel.js` | MODIFY | **+0 effective** (2 insertions, 2 deletions — two single-line replacements) |
| `tests/store/participationWriteBase.test.js` | CREATE | 298 lines |
| `tests/domain/roadsParticipation.test.js` | TEST | 118 lines added |

`git show --stat HEAD` names exactly those three. `git status --short` empty; `--untracked-files=all`
empty, so no foreign WIP was swept. The pre-commit hook rewrote nothing (`git diff HEAD --stat` empty).

## Acceptance cases — 8 of 8, executed

| ID | result | evidence |
|---|---|---|
| **A1** | RED → GREEN | red: `store 6 of 7 / DB 6 of 7; un-shelve afterwards -> {"ok":false,"status":"failed","reason":"npc_target_missing"}`; green: all seven in both homes, `return-npc` applied |
| **A2** | RED → GREEN | red: hostage erased, 6 of 7; green: hostage persisted AND still `whereabouts.state === 'hostage'` |
| **A3** | RED → GREEN | red: `houses ["The Crown"], lifecycle 'dissolved', beats ["faction_dissolved",…]`; green: `["The Crown","The Weavers"]`, `crewed`, no dissolution beat, anchored on a live `faction_service_bolster` sibling |
| **A4** | RED → GREEN | red: the off-stage person dropped while the tick's death and arrival survived; green: all three at once; `npcId` positional fallback unreached for every member |
| **A5** | RED → GREEN | red: the post-time save excluded the shelved person; green: four participation reads unchanged (each with a live anchor), dormancy reference held, post-time save INCLUDES / view EXCLUDES, frozen clause `movedKeys === []` |
| **A6** | GREEN | goldens byte-identical (hashes below); roads dormancy golden + `advanceWorkerByteIdentity` green; the by-reference pass-through pinned by the file's own dormancy `it` and by A8 |
| **A7** | GREEN | **1581 → 1581**, eslint `Linter`, `max-lines` + `skipBlankLines` + `skipComments`; `sizeBaseline.test.js` green |
| **A8** | GREEN (both before and after — it pins a premise, not the cure) | 6 towns · 46 roster rows · 288 steps · 0 by-reference breaks |

## Commands, exits and counts — CONFIRMED, every line through the shared-tier mutex, worker-capped

```
RED-FIRST
  tests/store/participationWriteBase.test.js      EXIT 1   Test Files 1 failed (1) | Tests 3 failed | 1 passed (4)
  tests/domain/roadsParticipation.test.js         EXIT 1   Test Files 1 failed (1) | Tests 2 failed | 6 passed (8)
GREEN
  tests/store/participationWriteBase.test.js      EXIT 0   Test Files 1 passed (1) | Tests 4 passed (4)
  roadsParticipation+roadsState+warSeatBooks+advanceWorkerByteIdentity
                                                  EXIT 0   Test Files 4 passed (4) | Tests 52 passed (52)
  tests/generators/densityLaw.test.js             EXIT 0   Test Files 1 passed (1) | Tests 151 passed (151)
  generatorGoldenMaster+dossierProseManifest+roadsDormancyGolden
                                                  EXIT 0   Test Files 3 passed (3) | Tests 25 passed (25)
  sizeBaseline+negativeAssertionAnchor+mutationCoverageManifest
                                                  EXIT 0   Test Files 3 passed (3) | Tests 22 passed (22)
  tests/copy/voiceMechanics.test.js               EXIT 0   Test Files 1 passed (1) | Tests 30 passed (30)
  tests/lint WHOLE, once                          EXIT 1   Test Files 1 failed | 171 passed (172)
                                                           Tests 1 failed | 2775 passed (2776)
  npx eslint (all three files)                    EXIT 0   no output
  npm run typecheck:ratchet                       EXIT 0   no type regressions (167 errors, ceiling 167)
  npm run typecheck:domain:strict                 EXIT 0   no strict regressions (1113 errors, ceiling 1113)
  npm run check:packet -- EM-B1k                  EXIT 0   14/14 steps exit 0, real elapsed times
  npm run implementation:resume -- EM-B1k         EXIT 0
  node scripts/implementation-packets.mjs validate EXIT 0  valid: 191 packets (2 READY)
```

Every gate line printed a count. `tests/lint`'s single red is the lighting census — the lawful one.
**No prose-numerics red**: this packet moves no line, so no baseline row's address shifted.
`npm run check`, `npm run test` and `test:ratchet` were never run.

## Base-versus-wave failure identity diff — CONFIRMED

Before the edit: A1/A2/A3/A4/A5 red for the defect, everything else green. After: only the lighting
census red, and only by this packet's own predicted delta. No failure identity appeared that this
packet did not create and then close.

## Goldens, dormancy and registers — CONFIRMED

- `tests/fixtures/generator-golden-master.json` `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` — identical before the first edit and at HEAD.
- `tests/fixtures/dossier-prose-manifest-golden.json` `921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41` — identical before the first edit and at HEAD.
- `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED`: never set.
- **Dormancy, measured ahead of the suites:** 12 corpus towns ticked through the shipped entry, cured vs today — 3,692,164 bytes of `settlementUpdates` + `worldState` + `wizardNews`, identical SHA-256 `5aadeac9ab5ee55858b3876d44d3a5b7f48c681f42431d9df7be2422886801b4`.
- `check-observed-shape-readers.mjs` exit 0, output **byte-identical** before and after — "1964 finding(s), exactly matching the frozen inventory". No motion.
- `check-writer-reach.mjs` exit 0, output **byte-identical** before and after — "judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294 (reviewable 495)". No growth.
- Domain any-cast debt for `pulseKernel.js`: **21 at HEAD, 21 after**. Unchanged.

## The lighting census — EXPECTED RED, NOT REFROZEN

Frozen `2650 · 383 · 2267 · 25028 · 6677` at `1e5bcf83d`.
**Measured `2651 · 383 · 2268 · 25034 · 6678`** ⇒ delta **`+1 files / +0 parked / +1 credited / +6 titles / +1 suiteTitles`** — the packet's predicted delta exactly.

The walker's assertion short-circuits at `files`, and its only full-tuple mode is the refreeze, which
writes the baseline and additionally refuses on a dirty tree. The remaining four figures were
therefore read from the walker's **own `measureCensus`** through a read-only harness that stubs
`vitest` and records `expect` calls instead of throwing — no edit to the walker, no refreeze, no tree
change. The refreeze remains the train's terminal act and the chair's.

## Generated artifacts

**NONE.** `pulseKernel.js` is an input of neither edge-shared bundle, of neither the generation
worker nor first paint, so no build was owed and none was run.

## Deviations

**ONE, and it is the judgment call below.** No STOP condition was met.

## Judgment calls — ONE, recorded so it can be vetoed

The packet's §6 `:579` line, written verbatim, **does not typecheck**: `advanceTreasury` declares its
settlement as `TreasurySettlement`, which has no `npcs` member, so `vaulted.settlement?.npcs` raised
`pulseKernel.js` to 5 errors against its baseline of 4 (`typecheck:ratchet` EXIT 1,
`TS2339 Property 'npcs' does not exist on type 'TreasurySettlement'` at `pulseKernel.js(579,124)`).

All three obvious alternatives were **refused**: widening the ratchet is forbidden and the ratchet
says so in its own message ("fix them; do not widen the baseline"); an `/** @type {any} */` cast
would breach the monotone-down `domainAnyCastBaseline` (and `treasury.js`'s own typedef comment
records that the any-cast ratchet was right to refuse exactly this shortcut); editing `treasury.js`'s
typedef is a **second file**, which §11.5 forbids.

**Resolved** with a concrete, non-`any` inline JSDoc cast:
`item.save.settlement.npcs !== /** @type {{npcs?: unknown}} */ (vaulted.settlement)?.npcs`.
JSDoc is erased at runtime, so the contracted runtime expression is unchanged character-for-character
(re-verified by re-running every acceptance arm after the cast); it is still ONE line; effective
lines stayed 1581; any-debt stayed 21. The chair may veto the spelling.

⚠ **One thing the chair should know, PLAUSIBLE and deliberately not acted on.** Because the
settlement-clock chain never writes `npcs` (A8, 288 steps), comparing against `item.settlement?.npcs`
instead of `vaulted.settlement?.npcs` would be equivalent today AND strictly safer tomorrow: if a
future clock step ever wrote a roster while nobody was off-stage, the `item.settlement` comparand
would let that write SURVIVE, whereas the contracted comparand drops it. That is an architectural
choice at the chair's own cut, not a lane's, so the contracted comparand was built as written and
A8's failure message carries the warning instead.

## ⛔ NOTICED, NOT TOUCHED — each specific enough to slot

1. **EM-B1k2 (cures 2 and 3), slot: immediately after this packet, same train.**
   `factionDensityKernel`'s `tickStart` (`:704`) still READS the filtered view, so the reaction is
   still *produced* and merely refused — the class's habitat is intact. `settlementLifecycleFirstClass:611`
   (dispersal must carry the off-stage soul) and `successorNpc:66` want curing before either is lit.
   The `.npcs` ratchet widens to `src/domain/density` (measured: convicts exactly one new file,
   `factionLifecycle.js`), and `factionDensityKernel.js`'s census row gains a real
   **irreversible ⇒ RAW** disposition in place of the inherited blanket.
2. **`roadsKernel`'s `fullRoster` compensation (`:1094-1102`) is now redundant.** Harmless and
   self-consistent — but its comment should be re-pointed at this packet so the next reader does not
   think it is the estate's only defence. Slot: EM-B1k2.
3. **`successorNpc.js` is in the EAGER first-paint graph** while every sibling is not; any packet
   touching it prices a first-paint delta. Named for EM-B1k2's compile.
4. **Damaged saves already hold dangling relationship edges.** No repair is built; §12.2 says exactly
   what could be recovered — a NAME and re-hung edges, never the person. The chair decides whether a
   repair is wanted. Slot: an owner's decision point.
5. **`tests/store` is not an `ENFORCER_DIR`** and `NAME_PATTERN` does not match
   `participationWriteBase`, so the estate's most load-bearing new regression suite owes no
   mutation-coverage row. Worth a chair look at whether `tests/store` should join `ENFORCER_DIRS`.
   Slot: the packet's own §13 Q3, still open.
6. ⚠ **ZERO of the golden corpus's 525 configurations generates an airship institution** (all 525
   generated and scanned against the blockade mover's own `/airship/i` test). Over corpus towns alone
   `applyBlockadeTransportImpairment` is a pure pass-through, so any corpus-driven test of it is
   anchored by nothing it did. A8 works around it with a dock-bearing variant named in the test as a
   construction; the estate may want a corpus row that really carries a dock. Slot: a corpus question
   for the chair, not EM-B1k2.
7. **Prose only:** the A3 assertion message reads "the estate own lifecycle reader"; it wants
   "estate's". Left rather than re-seal the packet evidence for a cosmetic. Slot: EM-B1k2, which
   touches this file for the ratchet widening.
8. ⚠ **`tests/lint` takes ~2,776 assertions across 172 files to run whole**, and a lane's focused runs
   never reach it — this run was the first thing that would have caught an estate walker reddened by
   this packet. Nothing to fix; recorded because the brief's "then `tests/lint` WHOLE once" step
   earned its place again here.
