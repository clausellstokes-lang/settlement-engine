# FRAME-5 · C1 — results: the dealer's reason is never said to the DM

Builder of C1 for FRAME-5, worktree `wt-c1` on `frame5-c1`, cut at `8b45003ef`. Brief: `frame5/C1-DEALER-REASON.md`, under
the common section of `frame4/FRAME4-BRIEFS-U0-P1B-P4A.md`. Scratch: `<scratchpad>/C1/` (`births.mjs`, the measure;
`base.json` / `tip.json`, the births; `base-tail-towns.json`, the 22 towns' stored records at base).

## 1. Measure first (taken before any edit)

**The pools**, born from this worktree's `src/` by `C1/births.mjs`: B7's crisis pool (`gen.mjs`'s own seeds and loop,
`b7-<kind>-<tier>-<i>`, 24 a kind: 360 towns), B2's calm pool (`pool.mjs 55`'s seeds, `frame-calm-<tier>-<i>`: 330
towns), and the generator golden master's 525 rows (`manifestRows`, as `goldens.mjs` reads them). For each town: every
stored cast row's reason, the stored record's sha256 (and the same with the dealer's tail cut out), and the sha256 of
every composed surface (the crisis page; `collectPlotHooks`; the Tonight sheet for the owner and for the player; each
entry's `crisisHookFor`).

**Stored reasons carrying `; next in line, the first choice already holding a role that contradicts this one`:**

| pool | cast rows | rows with the tail | towns with the tail |
|---|---|---|---|
| B7 crisis pool (360) | 690 | **22** | 22 |
| calm pool (330) | 0 | 0 | 0 |
| golden master (525) | 457 | **0** | 0 |

By kind and role (B7), every one a **brunt** row (the lever's holder barred from the brunt, R2-CODE-B-13, so the next
of the house takes it):

| kind | role | held by a person | held by a power |
|---|---|---|---|
| famine | brunt | 4 | 1 |
| plague_onset | brunt | 0 | 3 |
| monster_pressure | brunt | 10 | 1 |
| mass_migration | brunt | 0 | 3 |

Where the tail is stored: only `stress.cast.roles[i].reason` and its alias `stressors.cast.roles[i].reason` (walked over
the 22 records whole; no trace, no hook, no other path). Where it prints at base, of the 22 towns: the crisis page in
22, the plot hooks in 14, the Tonight sheet's hooks in 14 (owner) and 14 (player). Example (b7-monster_pressure-city-1,
the hook on the Open Tonight sheet): "In the raids, Yashodha Balan of the Guard takes the worst of it: her people stand
on the walls; next in line, the first choice already holding a role that contradicts this one."

**Every reader of the dealing today** (grep of `nextInLine`, the literal, `castReasonSentence`, every `.reason` read of a
cast row, every importer of the composers):

| # | file :: symbol | what it reads | needs to know the first choice was passed over? |
|---|---|---|---|
| 1 | `crisisCast.js :: deriveCrisisCast › take` | the WRITER: appends the tail when `pick !== list[0]` | — (the tail goes) |
| 2 | `crisisCast.js :: deriveCrisisCast`, brunt block (R2-CODE-B-13) | `passed` from the candidates' indices (never the text); `row.reason.startsWith(bruntLeast)` and keeps the remainder | no: it reads the order, not the tail |
| 3 | `crisisCast.js :: castReasonSentence` (FRAME-3 · B11) | the fold back; keeps any `"; "` tail | no: it keys a row by its vocabulary sentence; no `src/` reader (tests only: `castDerived`, `crisisCast`, `crisisCastSeatAndAccess`) |
| 4 | `crisisPage.js :: composeCrisisPage` | prints `r.reason` per cast row | no: it PRINTS it (Crisis tab `CrisisTab.jsx`; PDF `pdf/sections/CrisisSections.jsx`; Foundry `foundry/journalPages.js`) |
| 5 | `crisisHooks.js :: crisisHooksOf › castSentenceOf` | prints `holder.reason`; `CLAUSE_SAYS` / `PREDICATE_REASONS` by exact equality (a tail defeats both) | no: it PRINTS it (`plotHooks.js :: collectPlotHooks` → the dossier's hooks and `tonightSheet.js :: hooksOf`, the session sheet; `coherence/hookTruthRecord.js`) |
| 6 | `coherence/crisisCastFindings.js` | `reason === CAST_REASONS.dm`; `startsWith(collaboratorAmbition)` | no (the tail is never on those) |
| 7 | `tests/domain/crisisCast.test.js` "a person who would hold a contradictory pair is passed over and the reason says so" | `brunt.reason.endsWith(CAST_REASONS.nextInLine)` | it pins the dealer's reason: the pin moves (§4) |
| 8 | `tests/domain/crisisCastReaderRows.test.js` "GUARD: a brunt of a house that loses stays, in each of its three words" | `` `${bruntMember}; ${nextInLine}` `` | it pins the dealer's reason: the pin moves (§4) |
| 9 | `tests/generators/people/castDerived.test.js :: startsWithAny` | `reason === r` or `startsWith(r + '; ')` | no (both forms pass) |
| 10 | `docs/census/declarations/CRISIS_CAST_REASONS.json`, `crisisCast.CAST_REASONS.json` | the entry's text, as a ledger line | no (the entry stays, so they stay true) |
| 11 | `supabase/functions/_shared/engineBundle.js` | a built copy of the writer | not mine (the bundle's parity is on the line's known reds) |

"How this was simulated" (`explanation.js`, `SimulationDrawer.jsx`) reads `simulationTrace` causes; no cast reason is
written there (the 22 records walked whole). `tonightSheet.js` prints no cast reason of its own: its people read the
cast's names and roles; its hooks are `collectPlotHooks`'s (row 5).

**Verdict: the measure does not refute the brief.** No reader needs to know the first choice was passed over. The
`nextInLine` entry keeps ONE reader after C1: the render strip (`castReasonShown`), which must still recognise the
tail on a row saved before C1; so the entry is not deleted, and its own comment says it is never stored or printed.

## 2. What was built

1. **STORED.** `crisisCast.js :: deriveCrisisCast › take` stores `{ ...pick, role }`: the candidate's own reason,
   whichever candidate fits. The brunt block's word (`bruntLeast` → `bruntMember` where the lever's holder was passed
   over) is kept: it reads the candidates' order, and says a fact of the house, not of the dealing.
2. **THE RENDER STRIP.** `crisisCast.js :: castReasonShown(reason)`, beside `castReasonSentence`: cuts a trailing
   `` `; ${CAST_REASONS.nextInLine}` `` (the one copy of the words) and returns every other reason byte for byte. Read
   at the two places a cast reason is printed: `crisisPage.js :: composeCrisisPage` (each cast row: the Crisis tab, the
   PDF chapter `CrisisSections.jsx`, the Foundry journal) and `crisisHooks.js :: castSentenceOf` (the cast hook: the
   dossier's hooks and the Tonight sheet's, by `collectPlotHooks`; the hook-truth record). The session sheet prints no
   cast reason of its own, so `tonightSheet.js` is unchanged. The strip comes BEFORE the hook's `CLAUSE_SAYS` /
   `PREDICATE_REASONS` look-ups, so an old row's hook takes the form its fact takes.
3. **`nextInLine` is kept** (one reader: the strip; its comment says so). `castReasonSentence` is unchanged in
   behaviour (a fold for keying, it prints nothing); its comment names the strip.
4. **The census and its guard**: `tests/domain/crisis/crisisDealerReason.test.js` (6 tests).

## 3. Proofs

**(b) Red first, then green.** The new file against the tree WITHOUT the source change: **5 failed, 1 passed of 6**
(failing: "the brunt taken in the first choice's place stores its own reason alone (five towns of B7's pool)"; "GUARD:
no stored cast reason, in either home of the container, carries the dealer's clause"; "the one strip cuts the tail and
returns every other reason byte for byte"; "a STORED OLD ROW composes byte for byte as the row without the tail: the
crisis page, the hooks, the Tonight sheet"; "GUARD: the clause is read in src/ at exactly one site, the strip …"; the
census arm passes on both trees, as a census should). With the change: **6 passed of 6**.

**The guard, red by a plant, then restored** (each from a `cp` backup, `cmp`-identical after):
- the tail planted back in `take` (a stored row): **4 failed, 2 passed** (both STORED arms, the old-row arm, the
  one-site scan); restored, sha256 `dcc67d096b768826` before and after.
- the strip removed from `crisisHooks.js` alone: **1 failed** (the old-row arm); restored.
- the strip removed from `crisisPage.js` alone: **1 failed** (the old-row arm); restored.

**(a) Byte-identity, base `8b45003ef` against the tip** (`C1/births.mjs`, every town born twice):

| pool | towns | stored identical | composed identical | towns that differ |
|---|---|---|---|---|
| B7 crisis pool | 360 | 338 | 338 | 22: exactly the 22 with the tail; each one's tip record equals its base record with the tail cut (sha of the cut JSON, 22 of 22) |
| calm pool (B2, 55 a tier) | 330 | **330** | **330** | 0 |
| golden master | 525 | **525** | **525** | 0 |

Every town whose cast took no second choice is byte-identical, stored and composed (338 + 330 + 525 = 1,193 of 1,193).
In the 22, the composed surfaces that move: the crisis page in 22, the plot hooks in 14, the Tonight sheet's hooks in
14 (owner) and 14 (player); each composed text equals the base's with the tail cut (22 of 22).

**The STORED OLD ROW, every surface** (`C1/oldrows.mjs`): the 22 records as stored at base (tail and all), composed by
the tip's composers: 22 of 22 compose to the tip's own hash, 22 of 22 to the base's text with the tail cut, 0 print the
clause. One hook before and after (b7-famine-village-1): "In the famine, Shobha Ahuja of the Elected Reeve takes the worst
of it: one of a power that loses by the crisis; next in line, the first choice already holding a role that contradicts
this one." → "In the famine, Shobha Ahuja of the Elected Reeve takes the worst of it: one of a power that loses by the
crisis." The test's own old-row arm holds the same on five re-born towns (the tail planted on EVERY cast row, the
lever's predicate reason included).

**(c) The pins and stored figures that move, by file and title (unsigned; no fixture re-recorded):**
- `tests/domain/crisisCast.test.js` — "a person who would hold a contradictory pair is passed over and the reason says
  so" → "a person who would hold a contradictory pair is passed over, and the reason is the candidate's own (FRAME-5 · C1:
  never how it was dealt)"; `brunt.reason.endsWith(CAST_REASONS.nextInLine)` → `toBe(CAST_REASONS.bruntBase.healing_capacity)`.
- `tests/domain/crisisCastReaderRows.test.js` — "GUARD: a brunt of a house that loses stays, in each of its three
  words": the third word `` `${bruntMember}; ${nextInLine}` `` → `bruntMember`.
- No fixture carries the clause (grep of `tests/` and `tests/fixtures/` for the words and the key: these two files only).
- The golden rows: 0 of 525 move (none carries a tail). `institutionBudgetPromise`: red on base AND tip with the SAME
  50 of 60 seeds (1–11, 14–17, 19–23, 25–29, 31–41, 43–47, 50–53, 55–59): not mine. Pinned mode: A1, A2, A5 red on base
  and tip alike (the golden corpus's own movement; the line's known golden red): not mine. `tuningRegister` "the
  measured tree matches the committed inventory exactly": red on base and tip alike (`sideArchetypes.js#FRAME_TUNING:
  measured, not in the inventory`; `crisisCast.js#CRISIS_CAST_TUNING: dependents moved`): not mine; C1 adds no tuning.

**Gates** (to files under `C1/`, never through a pipe):
- `tests/domain/crisis` (vitest's path filter: every file under it and every `tests/domain/crisis*`), `tests/domain/tension`,
  `tests/security/frameShareVeil.test.jsx`: **26 files, 204 passed, 0 failed**.
- Every test file importing a changed file (35), the six registers' walkers (styleLaw, defenceFactReaders, factLayers,
  presumedThings + r3cRekeyedLinesTrue, presumptionClasses), `tuningRegister`, `tests/domain/dossier`,
  `hookTruthAtBirth`, `institutionBudgetPromise`, `pipelinePinnedMode`: **58 files, 716 passed, 1 expected fail, 5
  failed** — the 5 are the reds above, each red at base the same way (base run from `git archive 8b45003ef`).
- Per file (re-run with the JSON reporter, the slow pinned files apart; every count is passed, none failed): `w2FixData6Rows`
  9 · `crisisTab` 7 · `publicCrisisHookLabel` 2 · `tailCrisisK26` 1 · `tonightSheetOnce` 4 · `bar2Places2Rows` 5 ·
  `defenceTwinLines` 7 · `r3cRekeyedLinesTrue` 3 · `resolveCrisisCast` 10 · `restoredSubsections` 31 ·
  `defenceFactReaders.walker` 22 · `factLayers.walker` 15 · `presumedThings.walker` 43 · `presumptionClasses.walker` 16 ·
  `styleLaw.walker` 20 · `crisisCast` 31 · `crisisCastDefenceHome` 5 · `crisisCastEdit` 6 · `crisisCastFindings` 5 ·
  `crisisCastReaderRows` 7 · `crisisCastSeatAndAccess` 7 · `crisisHooks` 24 · `crisisLeverNotBrunt` 1 · `crisisPage` 9 ·
  `crisisPageTierNoun` 3 · `crisisStandInWords` 5 · `dmEditKeysFollowRename` 10 · `frame2NamesRule` 15 ·
  `tailCrisisBatch3` 2 · `tailCrisisBatch4` 2 · `tailCrisisBatch6` 2 · `tailCrisisBatch7` 5 · `tailCrisisBatch8` 58 ·
  `tonightSheetCast` 4 · `castDerived` 6 · `crisisDealerReason` 6 · `crisisSummaryVantage` 17 · `prosperityInCrisis` 14 ·
  `census2dTables` 11 · `crisisKind` 6 · `displayDrawSites` 8 · `dualHatReaders` 5: **42 files, 469 passed, 0 failed**.
- `npm run typecheck:ratchet`: OK (167, ceiling 167). `npm run typecheck:domain:strict`: OK (1113, ceiling 1113).
  `npm run lint`: **0 errors** (38 warnings, none in a changed file).
- A red of mine apart from the line's known reds: **none**.

**(d) For the security reader** (said, cured nowhere; I edit nothing of theirs):
- C1 adds **no new kind of holder and no new line**. It REMOVES one clause from one stored string (a brunt row's
  `stress[].cast.roles[].reason`, and its alias under `stressors`) and from the strings composed from it (the crisis page's
  cast row; the cast hook, "In the {crisis}, {name} takes the worst of it: {reason}.").
- A shared page withholding a cast entry whole (FRAME-3 ruling 16): C1 touches no projection, gate or veil, so that stays
  exactly as true as it was. What I read: the Crisis tab is mounted only for `!playerView && !publicDossier`
  (`OutputContainer.jsx:534`); `publicSafe.js` drops only hidden powers' STAKES from `stress[].cast` (the roles and their
  reasons stay in the shared JSON); the cast hook reaches every reader of `collectPlotHooks`, the player's Tonight sheet
  among them (the old-row arm composes it, and it prints no clause).
- What I would test: a shared projection (public dossier, party link, gallery) of a STORED OLD ROW (the tail planted on
  every cast row): no surface prints the dealer's clause, and whether `stress[].cast.roles` should leave the shared JSON
  whole, as the tab does.

**Not done:** B7's forced two-crisis pool and the confinement tool (FRAME-4's STORED law (b), (c)) are not in C1's brief
(law 3 only); C1 draws nothing, and its change is the one string cut wherever it stood, which the 1,215 towns above show.
The scratch base tree (`C1/basetree`, a `git archive` of `8b45003ef`) is deleted with this file's commit.
