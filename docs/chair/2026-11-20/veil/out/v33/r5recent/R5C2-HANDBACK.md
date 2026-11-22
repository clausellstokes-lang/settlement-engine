# R5C2 hand-back: R5-RECENT's cure under E92 (VEIL-33's V33-R5C2, 2026-11-22)

Worktree `/home/user/wt/r5c`, branch `v33-r5cure`, cut at 42640f37d (the brief with the chair's E92). The only commit is
this file and its receipts (the probes and their outputs, in this folder). Nothing pushed, no pull request. Not one line of
212, the rollback, the twin, the registry, `src/` or `tests/` is written. 210 and 211 are untouched.

## STOPS
**ONE STOP, the one E92 (4) pre-rules: MEASURE (3)(i) IS NOT REPRODUCED ON ALL. 286 of 287 nothing-hidden pages.**
It fell before the first edit, so the read-whole law's files were not all read and nothing was built (212 was read through
line 1,059 of 3,180; the twin `galleryWithholdAlways.js` whole; the registry through its row specs' first half).

- **The best reader measured** (variant B below: the engine's own power generator, `rulingStructure.js ::
  generatePowerStructure`, which calls the writer `buildGovernanceLabels`, run over the SERVED document, the key itself
  withheld) gives the stored sentence on **286 of 287** nothing-hidden pages, both Reveal DM settings alike, over two samples
  of 240 births each.
- **The one it misses** (`r5c2-m3-hamlet-8`, nothing hidden; famine and politically_fractured): stored "The last harvest
  failed badly. What remains is being rationed by whoever holds the stores...", the reader "Food is short, and every quarrel
  in the settlement has grown sharper for it...". The famine sentence takes its first branch where a military, civic or
  market house stands. The served roster holds a **Citizen militia** that the coherence repair added AFTER the power step
  wrote the sentence (`source: 'coherence_repair'`).
- **WHAT IS MISSING: the power step's own house roster.** The power step writes `recentConflict` once, over the houses that
  stand at that step (`economyReconciliation.js :: reconcilePowerStructure` replays the powers, the stability and the
  relations at the end, and NOT the sentence). The record keeps only the final roster. No served field says which houses
  came later: the marker `source: 'coherence_repair'` is written both before the power step
  (`assembleInstitutions.js`) and after it (`coherenceRepairPass.js`), so dropping those houses is WORSE (variant C,
  135 of 141).
- **There is no draw to seed.** The power step is draw-free on every born town (its one draw, `stressFactions.js`, fires
  only where no power governs). So "by seed" cannot help. The input is what is missing, not the seed.
- **The same class on a hiding town, PLAUSIBLY:** the full record's two misses under variant B (`hamlet-8` above and
  `town-32`, which hides a house) are the only misses over 480 births. On `town-32` the reader takes the merchant-army branch
  where the stored sentence took the rival guilds' one. That fits a house added after the power step raising `merchantArmy`.
  I did not trace it.

**The options, weighed with numbers, for the chair:**
| | Option | Nothing-hidden pages whose page sentence equals the stored one | Cost |
|---|---|---|---|
| R1 | **Build variant B as is** (accept the miss) | 286 / 287 (99.65%) | On the miss class the page prints the sentence the SERVED roster implies. It is the writer's sentence over served facts, so it carries no hidden name, and the differential holds by construction (the reader reads served facts only). It reads differently from the owner's page on about 1 page in 287. The plant's tooth "page = stored on a read that hides nothing" must admit it (or be stated over the measured set). |
| R2 | Variant A: the writer alone, over the SERVED powers | 264 / 282 (132 of 141, twice) | Worse. The density law (`rulerKin.js :: settleHouselessPowers`) drops a houseless power AFTER the sentence named it, so the served powers are not the writer's (9 misses of 141: "noble landholdings" where no noble power is left). |
| R3 | Carry the power step's facts on the record (a key the generator writes) | 287 / 287, PLAUSIBLY | A generator change and a new stored key, outside this lane and this unit; old records still lack it, so they need R1 or R4 as well. |
| R4 | None, everywhere (the chair's last resort) | 0 / 287 (the line leaves every shared page) | The Summary's prose and the Power tab's vignette lose the line on every shared page, nothing-hidden ones included. Nothing to measure; nothing can name anyone. |

My read, for the chair to take or leave: R1. The miss is not a leak. It is the reader writing over the facts the page
actually shows, and those facts disagree with the record's own sentence on that page (a famine line that says no one
stands where the page shows a militia). The pre-ruled law asked for ALL, and the figure is 286, so I stopped.

## MEASURE (3), SPLIT BY THE TWO WRITERS
Probe: `R5C2-measure3.probe.mjs` (this folder); output `R5C2-measure3.out`. The lane's birth dials (`BIRTH_DIALS`), 40
births a size, seeds `r5c2-m3-<size>-<i>` (sample 1) and `r5c2-m3b-<size>-<i>` (sample 2). "Nothing-hidden": no hideable
house and no `hidden: true` power. The served document: the twin, `projectShareVeil(galleryPayloadFor(t, { shareDm }), null)`,
`recentConflict` deleted before the reader runs. Each run waited for the pool's END, under the gate mutex, through
`gate-tail.sh`, GIT_* unset, to a log (exits below).

The three readers:
- **A**: `buildGovernanceLabels` over the served powers, houses, config, stress entries, neighbour and food record, then
  `boycottReadsRelation` over the served relations (the writer alone).
- **B**: `generatePowerStructure(tier, economicState, neighbour, config, served houses, { stressEntries })` and its
  `recentConflict` (the writer through its own generator).
- **C**: B over the served houses less those marked `source: 'coherence_repair'`.

### Table (i): the BASELINE writer's places (`governanceNarrative.js :: buildGovernanceLabels`)
Every one of the 480 births is the baseline writer's (no `previousGovernments`). Reproduced / births. "Served" is identical
on Reveal DM off and on, in every cell.

| Size | Sample 1: full record, A | B | C | Sample 1: nothing-hidden served, A | B | C | Sample 2: full record, B | Sample 2: nothing-hidden served, B |
|---|---|---|---|---|---|---|---|---|
| thorp | 40/40 | 40/40 | 40/40 | 38/38 | 38/38 | 38/38 | 40/40 | 40/40 |
| hamlet | 39/40 | 39/40 | 39/40 | 37/38 | **37/38** | 37/38 | 40/40 | 36/36 |
| village | 36/40 | 40/40 | 35/40 | 34/37 | 37/37 | 32/37 | 40/40 | 39/39 |
| town | 36/40 | 39/40 | 40/40 | 19/22 | 22/22 | 22/22 | 40/40 | 26/26 |
| city | 34/40 | 40/40 | 40/40 | 4/5 | 5/5 | 5/5 | 40/40 | 5/5 |
| metropolis | 36/40 | 40/40 | 40/40 | 0/1 | 1/1 | 1/1 | 40/40 | 0/0 |
| **all** | **221/240** | **238/240** | **234/240** | **132/141** | **140/141** | **135/141** | **240/240** | **146/146** |

**B over both samples: nothing-hidden 286 / 287; full record 478 / 480.** Not all: the STOP above.

### Table (ii): the TRANSFER's places (`rulingPower.js :: transferRulingPower`)
| | Count | What the served document carries |
|---|---|---|
| Born transfers, dark pool | **0 of 480** births (no `previousGovernments` on any) | n/a. CONFIRMED on these 480; that none is ever born is PLAUSIBLE (every caller is play: `worldPulse`, `mutateWorld`). |
| A transfer made at play (probe `R5C2-transfer.probe.mjs`, output `R5C2-transfer.out`: a born city's seat taken by its strongest other power, as a coup and by election; the twin, Reveal off) | 2 probe reads | `powerStructure.previousGovernments` [{ label: the old government, cause, tick }]; `governingName` and `government` (the new government); the seat's row with `seized_power` (or the cause) in `modifiers`; the WINNER's row with `ascendant`; under a lawful passage the deposed row with `fell_from_power`. |

So a transfer's sentence can be composed from served facts exactly where the winner's row (the one marked `ascendant`) is
served. Where the read withholds the winner (the witness, jp6-metropolis-0: the Thieves' Guild), that row is gone and the
sentence cannot be composed without the withheld name. E92 (4) then rules the baseline sentence over the served facts.
Reader B gives that baseline on such a place. PLAUSIBLE: on a transfer place it names the generator's own seat (the old
government), not the served new one. Not built, not measured on a served transfer.

## THE RULE AS BUILT, IN BOTH ENGINES
**None.** STOP before the first edit. The registry row `power.recentConflict` stays COMPOSED on the planned host. Its writer
attribution is still wrong (`conflicts.js :: generateConflicts` writes no `recentConflict`; the writers are
`governanceNarrative.js :: buildGovernanceLabels` through `rulingStructure.js :: generatePowerStructure`, and
`rulingPower.js :: transferRulingPower`), as R5C found.

What the build would be, if the chair rules R1 (designed, not written):
- 212 `_gallery_veil_withhold_always`: `-- registry: power.recentConflict`, then `public._gallery_veil_minus_at(s,
  '{powerStructure}', array['recentConflict'])`. The twin `withholdAlways`: `// registry: power.recentConflict` and
  `minusAt(s, ['powerStructure'], ['recentConflict'])`. No new helper, so VR27 is not engaged and the rollback is untouched.
- `pageRederive.js :: rederiveRecentConflict(doc, { authoritative })`: reader B, in place, wrapped so a document the engine
  cannot read draws nothing. Called by `rederiveForPage` and by `importRederive.js :: rederiveInPlace` (authoritative), and
  nowhere else.
- A walker in `crimeTypesReaders.walker`'s shape over `\brecentConflict\b` in `src/`. At the cut 23 files under `src/` hold
  the word (comment lines included; the walker counts code lines only), among them the readers in `SummaryTab.jsx`, `RelationshipsTab.jsx`, `governanceAccount.js`, `guardLineUnderTheLaw.js`,
  `powerStateProse.js`, `narrativeGenerator.js`, `historyGenerator.js`, `factionRename.js`, `gallerySecondHomes.js`,
  `pdf/lib/viewModel.js` and the writers.
- The registry row: writer corrected, `rule: 'withhold'`, `when: 'always'`, `page: 're-derive'`, `server: H.sAlways`,
  `twin: H.tAlways`, `built: true`, its `inputs` emptied (it leaves the composed form, as `safety.crimeTypes` did).
- **Two things the build must weigh that the brief does not name:**
  1. The generator hands the sentence to the history and the narrative (`historyGenerator.js:101`,
     `narrativeGenerator.js:544`). On one born town (`r5c2-hist-0`, a scratch probe) the sentence's only home, stored and
     served, is `powerStructure.recentConflict`: no second copy there. That no born town keeps a copy is PLAUSIBLE, and the
     build's walker must still register those two readers.
  2. `gallerySecondHomes.js:891` reads `powerStructure.recentConflict` to decide the pressure sentence's account (the key
     must be read there BEFORE the always-pass removes it). That holds, because the always-pass runs last.

## RED AND GREEN
No change, so no re-run of the instruments. At this cut (42640f37d) the code under test is the code R5C ran at cbaa8d540;
only docs changed between them (`git log cbaa8d540..42640f37d`: the brief and R5C's hand-back). So R5C's figures stand,
not re-executed by me: the plant `galleryVeilRecent.pglite` RED 6 of 6 plants (Tests 6 failed | 3 passed (9)), teeth
green; the composed-hosts walker RED 27 rows (Tests 27 failed | 6 passed (33)). No RED commit and no CURE commit, because
of the STOP.

## THE DIFFERENTIAL
Not built and not run (STOP). By construction reader B reads only served facts, so a hiding read and the same place with
the withheld power never there serve the same document and give the same page sentence. That is PLAUSIBLE until executed.

## EVERY RE-RUN, WITH ITS EXIT
| Run | Command (each under `sh scripts/gate-mutex.sh --run --`, through `sh scripts/gate-tail.sh`, GIT_* unset, to a log) | Exit |
|---|---|---|
| m3A | `R5C2_VARIANT=A node R5C2-measure3.probe.mjs` | 0 (15:22:38) |
| m3B | `R5C2_VARIANT=B node R5C2-measure3.probe.mjs` | 0 (15:23:20) |
| m3C | `R5C2_VARIANT=C node R5C2-measure3.probe.mjs` | 0 (15:24:33) |
| m3B2 | `R5C2_VARIANT=B R5C2_PREFIX=r5c2-m3b node R5C2-measure3.probe.mjs` | 0 (15:25:55) |
| transfer probe | `node R5C2-transfer.probe.mjs` (two births' worth; light, not under the mutex) | 0 |

Not run, since nothing changed: the plant, the walkers, `tests/lint` whole, typecheck, eslint, the build.

## FIRST PAINT
Not measured: nothing was built. Reader B, as designed, would sit only in `pageRederive.js`, which the page reaches through
the lazy page path, as `rederiveCrimeTypes` does. Its imports (`rulingStructure.js` and its graph) would weigh in that lazy
chunk, not in first paint. PLAUSIBLE until the build measures it.

## 212 AND THE ROLLBACK (unchanged)
- `supabase/migrations/212_share_veil_later_cures.sql`: `0352a5028544cce06c7bd9f610c23c60bc6fda5413528467fb4e478792bbb278`
- `supabase/rollback/212_share_veil_later_cures.down.sql`: `8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0`
- 211, byte-frozen: `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`
- 210: `9118c235c15d4ed434e192fb60e49dacd2040d52b7b8c28b3acc262494358a60`

## CONFIRMED vs PLAUSIBLE
**CONFIRMED** (executed):
- Table (i): A 132/141, B 140/141 then 146/146 (286/287), C 135/141 on nothing-hidden served pages, Reveal DM off and on alike.
  The full record: A 221/240, B 238/240 then 240/240, C 234/240.
- The one nothing-hidden miss and its cause: a militia added by the coherence repair after the power step wrote the famine
  sentence. Read off the record's houses; the branch read off `buildStressNarratives`.
- The power step draws nothing on these births. Read: its one draw needs a town with no governing power.
- The reconcile replays stability and not `recentConflict`. Read: `reconcilePowerStructure`.
- The marker `coherence_repair` is written before and after the power step. Read, and measured by C.
- 0 born transfers in 480 births. What a played transfer serves (the probe).
- 212, the rollback, 211 and 210 unchanged (sha256).

**PLAUSIBLE:**
- That no born town is ever a transfer's.
- That `town-32`'s full-record miss is the same class.
- That R1's differential holds and its first paint is +0. Neither was executed.
- That no born town keeps a second copy of the sentence. Measured on one town only.
- The instruments' red at this cut. R5C's run at cbaa8d540, the same code; I did not re-run it.

## FOR THE OWNER, IN PLAIN WORDS
The chair's new rule is to drop the "recent conflict" line from every shared page and let the page write it again from
what the page shows. That way no page can name a hidden power, and a missing line tells nobody anything. I was told to
build that only if the page could rebuild the line exactly on every page that hides nothing, and to stop otherwise.

It can on 286 pages out of 287. On the one it cannot, the line was written early in the town's making, before a later step
added a militia. The page sees the militia, so it writes the slightly different line that fits what it shows. That line
names no one hidden. It just isn't word for word what your own copy says.

Because the rule said "all", I stopped and built nothing. Nothing is live, so nothing leaks today. The chair now picks:
accept the 1-in-287 difference and build, or drop the line from shared pages altogether.

R5C2 STOP (this commit, over 42640f37d): measure (3)(i) reproduced 286 of 287, not all (the power step's own house roster is not served)
