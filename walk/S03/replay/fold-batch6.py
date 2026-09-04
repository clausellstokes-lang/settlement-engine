"""BATCH 6 — §14 THE EPISTEMIC LEDGER: every row the five G0 probes settled, marked with its figure
and its receipt line; the rows left PLAUSIBLE keep their act. Marks G0-74 … G0-92.
"""
import foldlib

RR = '`$SP/laneG0RR-receipt.md`'
CV = '`$SP/laneG0COV-receipt.md`'
WK = '`$SP/laneG0WORKER-receipt.md`'
f = foldlib.Folder()

# ── READERREVIEW rows ────────────────────────────────────────────────────────
f.rep(
    '| E15 | `npx vite-node` imports `SettlementPDF.jsx` and `renderToBuffer` runs under node with font re-registration (§5.5 P0.1) | READERREVIEW Car 0; fallback = a vitest-run renderer file (+1 file, three censuses) |',
    '| E15 | ~~`npx vite-node` imports `SettlementPDF.jsx` and `renderToBuffer` runs under node with font re-registration (§5.5 P0.1)~~ ⟦G0-74⟧ **SETTLED, CONFIRMED** (RR Car 0 §2, ' + RR + ', at C′): `renderToBuffer` runs OUTSIDE vitest on all four variants — `canon_dossier` **347,870 B / 38 pages** against a floor of 12, `draft_brief` 345,061/37, `timeline_packet` 45,398/4, `campaign_state` 135,481/15, 3.46 s for all four — font re-registration needed and working (the live sources are the browser paths, the documented ENOENT trap), plain `node` the convicting negative control. **The fallback is NOT owed: no amendment, no extra file, no three censuses.** ⚠ One caveat cured by JUDGMENT and RATIFIED (§882.8): `vite-node` is absent from `package.json`, the lock and `node_modules` — the runner is `vite.createServer().ssrLoadModule()`, in-lock, zero `package.json` bytes, byte-identical output (⟦G0-59⟧) | none owed; Car 1 inherits the runner, not the CLI |',
)
f.rep(
    "| E16 | the `PREVIEW_OVERLAY` reaches each key's ledger; `characterDriftEnabled` reads through a rules overlay (§5.1) | P0.3: one lit MONTH per key + a receipt grep |",
    "| E16 | ~~the `PREVIEW_OVERLAY` reaches each key's ledger; `characterDriftEnabled` reads through a rules overlay (§5.1)~~ ⟦G0-75⟧ ⛔ **REFUTED IN THREE PARTS, PLUS ITS METHOD** (RR Car 0 §6, " + RR + "): (a) **`espionageEnabled` does NOT reach** — its gate is a three-part conjunction needing `errandSpineEnabled`, and even with the whole conjunction lit and `espionageActive === true` the belief maps read **268 lit = 268 dark over thirty years**; (b) **`neutralNeighbourEdges` is not a ledger** — the reach lands in `regionalGraph.edges[].evidence[]`, so a name grep gets a false negative; (c) **`characterDriftEnabled` is read by NO gate in `src/`** — five hits, not one a read. Only `demographicsEnabled` behaves exactly as the row assumes; `warMemoryEnabled` reaches but not within a month. **AND THE METHOD IS REFUTED: 'one lit MONTH per key' is measured INSUFFICIENT** — `warMemoryEnabled` is silent at a month and reaches at a YEAR with 102 new paths, because a war must CONCLUDE before there is a concluded war to remember (⟦G0-60⟧⟦G0-61⟧⟦G0-62⟧) | the METHOD is re-cut to **one lit YEAR minimum**; `PREVIEW_OVERLAY` is the four-key form and needs `errandSpineEnabled`; the OPERATIONS consequence is an owner row (§19 RR-10) |",
)
f.rep(
    "| E17 | the soak's `yearlyHashes` hash the same object as the runner's `sha(worldState)` (§5.1 the control campaign) | P0.5; a second control hash is added if they differ |",
    "| E17 | ~~the soak's `yearlyHashes` hash the same object as the runner's `sha(worldState)` (§5.1 the control campaign)~~ ⟦G0-76⟧ ⛔ **REFUTED AS WRITTEN — AND THE REMEDY IS UNNECESSARY** (RR Car 0 §4, " + RR + "): the soak hashes `sha256(JSON.stringify({worldState, regionalGraph, settlements}))` with `settlements` post-thread, NOT `sha(worldState)` — measured, `sha(worldState)` alone is `da2d4a3c…` and `yearlyHashes[0]` is `2409ea4ec9a9f788ecca243d2ea480909463b0ec859a1bf4a5c9a08347dc8daf` (five candidates tried, exactly one matches). **No second hash is needed: the runner hashes the SAME three-key composite, and the real soak at `--years 1` reproduces it EXACTLY** — cheaper and stronger than the row's own remedy (⟦G0-64⟧) | none owed; Car 1's equality proof is PRE-PAID and the composite is pinned |",
)
f.rep(
    '| E18 | no `tests/lint` walker enumerates `scripts/lib/*.mjs` or `scripts/review/*`; no `tests/docs/*` scanner reads `docs/review/` (§5.2) | P0.6: `tests/lint` WHOLE with the six new files present |',
    '| E18 | ~~no `tests/lint` walker enumerates `scripts/lib/*.mjs` or `scripts/review/*`; no `tests/docs/*` scanner reads `docs/review/` (§5.2)~~ ⟦G0-77⟧ ✅ **SETTLED, CONFIRMED ON ALL THREE CLAUSES** (RR Car 0 §7, ' + RR + '): two full `tests/lint` runs in the dock — base **5 reds, all frozen known failures in `scripts/.test-ratchet-baseline.json`**; with the eight design files present **6 reds, and the single new one is `sovereigntyLightingContract.walker`, the refreeze the design already bills for**. No other walker moved, `observedShapeReaders.walker` included; `grep -rln \'docs/review\' tests/ scripts/` returns nothing. **§5.2\'s bill for Cars 0–2 is complete as written; no unnamed census exists** (⟦G0-69⟧) | none owed |',
)
f.rep(
    "| E19 | one 30-year 4-settlement campaign ≈ 14–19 min; the one-month determinism smoke ≤ 10 s (§5.1, §5.2) | P0.4; Car 1's smoke run |",
    "| E19 | ~~one 30-year 4-settlement campaign ≈ 14–19 min~~; the one-month determinism smoke ≤ 10 s (§5.1, §5.2) | ⟦G0-78⟧ **FIRST CLAUSE REFUTED — 61.88 s, a 14–19× over-price** (peak RSS 787 MB, heap 450 MB; per-year cost FALLS 2,673 → 1,851 ms); **SECOND CLAUSE CONFIRMED WITH MARGIN — 0.74 s wall, byte-identical across two fresh processes** (`4b231dfe…`), so the determinism bit executes too (RR Car 0 §3, " + RR + "; ⟦G0-63⟧). ⚠ Scope: the 61.88 s is ADVANCE + composite hashing only; the PDF render is a separate 3.46 s for four variants |",
)
f.rep(
    '| E42 | ⟦A52 L2⟧ `renderToStaticMarkup` of `FaithTab`/`WarTab`/the power tab runs under `vite-node` with the store stubbed, so the three tabs can be SURFACE documents (§5.1) | READERREVIEW Car 0 P0.9; if it fails the tabs are declared UNREAD by the protocol and handed to the walk — never scored `shown` from a model dump |',
    '| E42 | ~~⟦A52 L2⟧ `renderToStaticMarkup` of `FaithTab`/`WarTab`/the power tab runs under `vite-node` with the store stubbed, so the three tabs can be SURFACE documents (§5.1)~~ ⟦G0-79⟧ ✅ **SETTLED, CONFIRMED — all three render** (Faith 347 B, War 372 B, Power 88 B; TRUE_EXIT 0; RR Car 0 §8, ' + RR + '): **the tabs are NOT handed to the walk and CAN be SURFACE documents**, which keeps §1.7\'s `surface_citation_required` refusal meaningful for the three systems that reach them. ⚠ **Mechanism proven, surface NOT: all three produced their honest-absence shell** because the stub carried no live `campaign`/`worldState` — a real surface document needs the threaded campaign wired into the stub, which is Car 2\'s and is not proven here (⟦G0-70⟧) | none owed for the mechanism; Car 2 owes the live-campaign stub before a tab fact is scored `shown` |',
)
f.rep(
    "the TUNEREG / COVERAGE / READERREVIEW halves still owed to each car's run |",
    "⟦G0-80⟧ **the READERREVIEW half CONFIRMED BY EXECUTION** (RR Car 0 §7, " + RR + "): six new `scripts/**` files — five under a brand-new `scripts/review/` and one under the OSR-bearing `scripts/lib/` — moved `observedShapeReaders.walker` not at all in a WHOLE `tests/lint` run; the TUNEREG / COVERAGE halves still owed to each car's run |",
)

# ── COVERAGE rows ────────────────────────────────────────────────────────────
f.rep(
    '| E20 | Wealthy is reachable ONLY through `priorityEconomy ≥ 70-effective` (dial-gated, never seed-gated) (§6.1 row 1) | COVERAGE Car 0 (e): the 6×7 base grid at `priorityEconomy: 95`; STOP rewrites `gatedBy` |',
    '| E20 | ~~Wealthy is reachable ONLY through `priorityEconomy ≥ 70-effective` (dial-gated, never seed-gated) (§6.1 row 1)~~ ⟦G0-81⟧ ✅ **SETTLED, CONFIRMED** (COVERAGE Car 0 §3(e), ' + CV + '): **Wealthy 0/42 on the 6×7 base grid at the corpus default, 21/42 at `priorityEconomy: 95`, and 0 in a 300-seed sweep at the default dial** (a negative control the charter did not ask for, and the one the universal "never seed-gated" actually needs). `gatedBy` STANDS; the §6.5 STOP does not fire; the `Wealthy` exemption is `dial-gated` with a `key-extension` classification | none owed |',
)
f.rep(
    '| E21 | `factions[].resources.*` is written by a generator; `scars[].severity` is banded; `isolationSupport.status` reads `connected` on non-isolated rows; `magicProfile.js:464-467` exports its band lists (§6.1 rows 4/12/13/D1) | COVERAGE Car 0 (a)–(d) |',
    '| E21 | ~~`factions[].resources.*` is written by a generator; `scars[].severity` is banded; `isolationSupport.status` reads `connected` on non-isolated rows; `magicProfile.js:464-467` exports its band lists (§6.1 rows 4/12/13/D1)~~ ⟦G0-82⟧ **SETTLED — a COMPOUND row, and it is 1 TRUE, 2 FALSE, 1 PARTIAL** (COVERAGE Car 0 §3(a)–(d), ' + CV + '): (a) **REFUTED** — no writer, 0 of 1,323 factions (0/1,226 on carto); (b) **REFUTED** — `scars` does not exist, the real field is `severity on historicalEvents` under `settlement.history`, banded but emitting `catastrophic` (267 rows) outside `MAGNITUDE_BANDS` with `moderate` at 0; (c) **CONFIRMED** — `connected` on 452/525, the 73 isolated rows splitting `viable` 36 · `untenable` 24 · `precarious` 13; (d) **PARTIAL** — the exports are at `:468-471`, there are FOUR not six, and each is a `+absent` SUPERSET of its schema union (⟦G0-36⟧⟦G0-37⟧) | none owed; the roster corrections are Car 1\'s inheritance (⟦G0-39⟧) |',
)
f.rep(
    '| E22 | the 525 regeneration + derivation tier ≈ 9 s solo / 60 s parallel (§6.7 R1) | Car 0 (f); the fallback design switches at > 60 s solo |',
    '| E22 | the 525 regeneration + derivation tier ≈ 9 s solo / 60 s parallel (§6.7 R1) | ⟦G0-83⟧ **THE SOLO LEG IS SETTLED AND CONFIRMED — 8,927 ms in-process (8,276 generation at 15.8 ms/row + 575 derivation), 9.33 s wall** (COVERAGE Car 0 §3(f), ' + CV + '), held to the tenth of a second, so the > 60 s switch does NOT fire and §6.7 R1\'s executed design + J7 stand. **The PARALLEL leg stays PLAUSIBLE and says why: ≈ 60 s is a property of a 558-file vitest run and Car 0 names no suite, so this probe cannot and does not settle it** — owed to Car 1\'s first in-gate run |',
)
f.rep(
    "| E23 | the first widening set's shape (2–3 rows each for the three route bands; `heartland` ×3; `Struggling` ×3; …) (COV-5) | COVERAGE Car 3's real run |",
    "| E23 | the first widening set's shape ~~(2–3 rows each for the three route bands; `heartland` ×3; `Struggling` ×3; …)~~ (COV-5) | ⟦G0-84⟧ **LEFT OPEN BY DESIGN (Car 3's real run) — but Car 0 REFUTES TWO OF ITS THREE NAMED CLAUSES** (COVERAGE Car 0 §5/§4 C10–C11, " + CV + "): the route bands under floor are **TWO** (`mountain_pass` 2, `none` 1) because `crossroads` measures **3** and is already at the floor (`random_trade` resolves before persistence); **`Struggling` ×3 is DELETED — the band has 36 rows**. `heartland` ×3 stands as a target but is a **`config-cure`, not a `seed-row`**: 523 rows carry `civilized`/`safe` verbatim and no seed reaches `heartland` while the corpus spells the token that way. The row's SHAPE was wrong on its own first clause |",
)

# ── WORKER rows ──────────────────────────────────────────────────────────────
f.rep(
    "| E32 | WORKER's extraction closure delta is NEGATIVE (−4…−7 KB) and the extra eager cost ≈ +60 B (flag key + mapDeps) (§9.2) | Car 0's probe build; S0.3 drops the extraction shape on a positive delta beyond (margin − 100 B) |",
    "| E32 | ~~WORKER's extraction closure delta is NEGATIVE (−4…−7 KB) and the extra eager cost ≈ +60 B (flag key + mapDeps) (§9.2)~~ ⟦G0-85⟧ ✅ **SETTLED, CONFIRMED — the design's SIGN holds**: net RAW **−6,366 B** (entry −6,148, kernel −218), gzip −2,140, Brotli −1,624; **S0.3 does not fire against either ceiling** (threshold > +238 B unraised / > +1,238 B banked), so **Car 1 takes the FULL EXTRACTION shape** and the closure ends **6,704 B under the unraised 1,047,000** (was 338 B). The '+~60 B eager cost' is real but swamped and sits inside the entry's net figure — its mapDeps half is **+125 B over 3 filenames, not ~40 B over one** (WORKER Car 0 §9.5(b), " + WK + "; ⟦G0-47⟧⟦G0-49⟧⟦G0-55⟧) | none owed; whether to BANK the −6,366 B by lowering `CLOSURE_BUDGET_BYTES` is an owner row (§19) |",
)
f.rep(
    '| E33 | every settlement over the 525 rows + the locked reroll + the instant worlds is structured-cloneable with an identical key census; `fullConfig` is (or is not) resolved in place (§9.2 P4) | Car 0\'s clone census (`rows=527 …`) |',
    "| E33 | ~~every settlement over the 525 rows + the locked reroll + the instant worlds is structured-cloneable with an identical key census; `fullConfig` is (or is not) resolved in place (§9.2 P4)~~ ⟦G0-86⟧ ✅ **SETTLED, CONFIRMED**: `rows=529 cloneable=529 jsonLossless=529 keyCensusEqual=529 functions=0 classes=0 mapsSets=0 undefinedInArrays=0 mutatesConfigInPlace=false` (plus symbols/bigints/Dates/RegExps/non-finite all 0; 41,919 frozen objects reported). **The row's 527 is corrected to 529** — `REALM_SIZES` has three keys. `fullConfig` is **NOT** mutated, and the resolved config DIFFERS from it, so `resolvedConfig` must be read off the result — an instruction that is now load-bearing, not defensive (WORKER Car 0 §9.5(a)/(c), " + WK + "; ⟦G0-51⟧⟦G0-53⟧) | none owed; ⚠ `jsonLossless` is blind to Map/Set — WK-9 is discharged by `mapsSets=0`, never by the JSON check |",
)
f.rep(
    "| E34 | the worker bundle is ≈ 1.0–1.6 MB raw / 300–450 KB gz and has exactly two chunks at the coupled tip (§9.2) | Car 0's `ls dist/assets`; S0.5 names any extra chunk |",
    "| E34 | ~~the worker bundle is ≈ 1.0–1.6 MB raw / 300–450 KB gz and has exactly two chunks at the coupled tip (§9.2)~~ ⟦G0-87⟧ **SETTLED · PARTLY REFUTED**: raw **1,404,723 B** ✅ in band · gzip **452,384 B** at the band edge · Brotli **355,591 B** · **chunks 1, NOT 2** — Vite inlines dynamic imports in a worker entry, so the living-content seam's payload is statically folded in; `customContentPreview.worker` at the same tip is likewise one chunk with zero `import(`. **S0.5 is unreachable by construction while `vite.config.js:412-414` sets `worker.format` only** (WORKER Car 0 §9.5(b), " + WK + "; ⟦G0-50⟧) | none owed; Car 1's chunk-count pin is written as **1**, with the reason stated in the test |",
)
f.rep(
    '| E35 | construct→first-step latency (warm) ≤ ~500 ms, so one-worker-per-request holds (§9.1 JUDGMENT) | Car 0 (d): 5 DEV runs, medians; above ~500 ms the pooled factory follow-up is priced |',
    "| E35 | ~~construct→first-step latency (warm) ≤ ~500 ms, so one-worker-per-request holds (§9.1 JUDGMENT)~~ ⟦G0-88⟧ ✅ **SETTLED, CONFIRMED — median 41.5 ms over 5 runs, 12× inside the bound** (construct→ready 40.3 ms, construct→result 136.5 ms, ready→result 96.1 ms; 22 step events and 11 NPCs on every run). Constructing a fresh isolate and parsing the whole 1.4 MB bundle costs under HALF the generation it wraps ⇒ **the pooled/keep-alive follow-up is NOT owed**. ⚠ Method: the BUILT bundle in a Node `worker_threads` isolate, not a browser — it includes spawn and parse and excludes the wire fetch, reported separately at 452,384 B gzipped (WORKER Car 0 §9.5(d), " + WK + "; ⟦G0-57⟧) | none owed; a browser re-measure rides Car 1's Playwright spec |",
)
f.rep(
    "| E36 | the PipelineReveal dwell (3–10 s) dominates perceived generate time on desktop today (§9.7 R5) | Car 0's DEV timing beside the reveal's signed pacing |",
    "| E36 | ~~the PipelineReveal dwell (3–10 s) dominates perceived generate time on desktop today (§9.7 R5)~~ ⟦G0-89⟧ ✅ **SETTLED, CONFIRMED on this machine**: end-to-end construct→result **136.5 ms** against the reveal's owner-signed 3–10 s pacing (`PipelineReveal.jsx:29-33`, `a52a88b1`) — the dwell dominates by **22× to 73×**. ⇒ removing the freeze is a correctness and responsiveness win, not a perceived-speed one, and **nothing in WORKER justifies touching the signed pacing** (WORKER Car 0, " + WK + "; ⟦G0-57⟧) | none owed |",
)
f.rep(
    "| E37 | `regenNPCsPipeline`'s `parts` and `foldRegeneratedRoster`'s inputs are cloneable (§9.5 Car 3) | Car 0's census extension; S3.1 drops `regen-npcs` |",
    "| E37 | `regenNPCsPipeline`'s `parts` and `foldRegeneratedRoster`'s inputs are cloneable (§9.5 Car 3) | ⟦G0-90⟧ ⛔ **NOT SETTLED, AND SAID SO** (WORKER Car 0, " + WK + "): §9.5 calls this 'Car 0's census extension', the extension is **not in Car 0's own act list (a)–(e)** and was not run; the census covers the settlement-op result and the carry's `_preservation` report, not the regen ops' intermediate `parts`. **S3.1 stays ARMED and unpriced — the one WORKER-tagged row this wave leaves open**; Car 3 runs the extension first or is dropped |",
)
f.rep(
    "| E43 | ⟦A1 B1⟧ the worker bundle's raw size and chunk count at the coupled tip (≈ 1.0–1.6 MB; 2 chunks) — the figures Car 1's ceiling and count pin are cut from | WORKER Car 0's `ls dist/assets`; the pin is written from the measurement, never from this row |",
    "| E43 | ⟦A1 B1⟧ the worker bundle's raw size and chunk count ~~at the coupled tip (≈ 1.0–1.6 MB; 2 chunks)~~ — the figures Car 1's ceiling and count pin are cut from | ⟦G0-91⟧ **SETTLED · MEASURED at C′** (WORKER Car 0, " + WK + "): `WORKER_BUNDLE_CEILING_BYTES` is cut from **1,404,723 B + a declared margin** (monotone-down, a raise owner-signed), and **the chunk-count pin is 1**, each chunk named `generation.worker-<hash>.js`. The row's own law held — the pin is written from the measurement, never from the row |",
)
f.rep(
    "| E45 | ⟦A2 B2⟧ `PIPELINE_REACHERS` (an exported `Object.freeze` literal imported only by the walker) is tree-shaken out of the ENTRY chunk, so the EXECUTOR/`reachesVia` rows cost 0 product bytes | WORKER Car 0's why-string grep of the entry chunk; if the rows ship, they move to a test-side fixture BEFORE Car 1 is cut |",
    "| E45 | ~~⟦A2 B2⟧ `PIPELINE_REACHERS` … is tree-shaken out of the ENTRY chunk, so the EXECUTOR/`reachesVia` rows cost 0 product bytes~~ ⟦G0-92⟧ ✅ **SETTLED, CONFIRMED — STRONGER THAN PRICED** (WORKER Car 0, " + WK + ", settled at the BASE before any wiring): the real why-string `mints a brand-new town` (`densityCreateBoundary.js:39`, verified against source) is absent from the entry chunk, **from all EIGHT files of the eager closure, and from EVERY `dist/assets/*.js` chunk in the whole build**. The EXECUTOR/`reachesVia` rows cost 0 product bytes on every chunk and the test-side-fixture contingency does NOT fire (⟦G0-58⟧) | none owed; ⚠ the ≥ 40-char why string is still a `src/domain` literal under `voiceMechanics` Tier 2 at zero headroom — the em-dash and `!` bans bind |",
)
f.rep(
    "| E38 | the 58th COUPLED commit (`fab576aba`, the em-dash voice cure) moved no closure byte and no test title (§0 header, C25) | the HORIZON-DARK probe build's base listing; the landing tuple probe |",
    "| E38 | the 58th COUPLED commit (`fab576aba`, the em-dash voice cure) moved no closure byte and no test title (§0 header, C25) | ⟦G0-91⟧ ⚠ **STILL OPEN, and the instrument it named cannot settle it**: WORKER Car 0's base listing is at **C′ `9a0584f0f`, two landings past the COUPLED tip**, so it measures a different base — but it SUPPLIES the listing this row's owner needs (`$SP/worker-car0-listing-base.txt`, 488 files, `CLOSURE_RAW 1,046,662`) " + WK + "; the landing tuple probe still owes the title half |",
)

# ── two claims §14 never carried, refuted by execution — entered now ─────────
f.rep(
    '| E46 | ⟦A20 E4⟧ the src-wide scanner roster in §1.13 is COMPLETE',
    '''| E47 | ⟦G0-34⟧ **ENTERED AND CLOSED IN ONE ACT — a claim §14 never carried:** §6.1 row 3 asserted the live vocabulary of `status on activeChains` is `CANONICAL_STATUSES` (7) | **REFUTED BY EXECUTION** (COVERAGE Car 0 §5, ''' + CV + '''): 0 of 7 canonical tokens over 1,029 rows; the generator persists the LEGACY seven and `canonicalSupplyChainStatus` maps at READ time. It was the roster's largest error and it was NOT in the ledger — *the lesson banked: a draft roster row is a HYPOTHESIS and belongs in §14 the day it is written* |
| E48 | ⟦G0-35⟧ **ENTERED AND CLOSED IN ONE ACT — the second unledgered claim:** §6.1 row 11 asserted `severityBand on activeConditions` is 0 "by construction" because `corpus()` sets no stress | **REFUTED BY EXECUTION** (COVERAGE Car 0 §5, ''' + CV + '''): **516 of 525 rows carry a condition** — `resolveConfig` ROLLS a stress the corpus never sets (`infiltrated` 480, `famine` 36, empty 9) — so four drafted exemptions and a `gatedBy` are struck and only `low` is an honest zero |
| E46 | ⟦A20 E4⟧ the src-wide scanner roster in §1.13 is COMPLETE''',
)

f.checkpoint(92, 96)
f.save('batch6 EPISTEMIC LEDGER')
foldlib.fold_json(
    folded=[f'G0-{n}' for n in range(74, 93)],
    settled14=[
        'E15 (CONFIRMED)', 'E16 (REFUTED in three parts plus its method)',
        'E17 (REFUTED; remedy unnecessary)', 'E18 (CONFIRMED on all three clauses)',
        'E19 (first clause REFUTED, second CONFIRMED)', 'E42 (CONFIRMED)',
        'E5 (READERREVIEW half CONFIRMED)', 'E20 (CONFIRMED)',
        'E21 (compound: 1 true / 2 false / 1 partial)', 'E22 (solo leg CONFIRMED; parallel PLAUSIBLE)',
        'E23 (two of three clauses REFUTED; Car 3 keeps the row)', 'E32 (CONFIRMED)',
        'E33 (CONFIRMED; 527 -> 529)', 'E34 (PARTLY REFUTED — 1 chunk, not 2)',
        'E35 (CONFIRMED)', 'E36 (CONFIRMED)', 'E37 (NOT SETTLED — S3.1 stays ARMED)',
        'E43 (MEASURED)', 'E45 (CONFIRMED, stronger than priced)',
        'E38 (still open; its named instrument measures a different base)',
        'E47 + E48 (two unledgered claims entered and refuted in one act)',
    ],
)
