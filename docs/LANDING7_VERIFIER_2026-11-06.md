# LANDING-7 — the verifier's read (2026-11-06)

Seat: the rule-31 VERIFIER (Opus 5.5) under the cloud chair (Fable 5.1, session 01FE9mEvGxnFx6WTBkEC6ie9).
Range read: `3d8a74e4b..b274cccb5` on `lane/landing-rung1-2026-11-04` (twelve first-parent commits: lanes B, C, D, F, G, G3, F2-4, A merged,
plus the chair's docs). **Lane E is NOT in the tip read** — `lane/landing7-l7e-2026-11-06` stands at `1ac118cd0`, unmerged; its record
`docs/LANDING7_E_2026-11-06.md` and signed record 30 are on that branch only. This seat changed no source or test.

Method. `npm ci` exit 0; the local `review-fixes-2026-07-08` ref created. Every touched test file (72) plus fifteen neighbours ran at the
tip, ONE FILE PER vitest run, `--maxWorkers=2`, each log to a scratch file, the exit code and the `Tests` line read from it (76 files green,
11 red). Fourteen files re-run at the base `3d8a74e4b` (a scratch worktree) for the red-firsts. Two suites bisected over the first-parent
merge stages (scratch worktrees). Scratch probes: the golden-master hasher (`scripts/audit/golden-master-stage.mjs`, 525 configs, base vs tip),
a food-sign and record-invariant probe over the 525, a town-site probe over `soak1k-0..999`, a vacancy probe over `rulers-thorp-0..999`,
and a Village-watch governance probe over `soak1k-0..999`.

## The tip's reds (b274cccb5), each attributed

| file | tip | base | attribution |
|---|---|---|---|
| `tests/property/generatorGoldenMaster` | 1 red (17 rows) | green | lane D's food-view cure, not re-recorded (no record 29/31 on the tip) — STOP-1 / FIX-4 |
| `tests/generators/nameHeldThroughAssembly` A1 | 1 red | — | same 17 rows (2 sampled) |
| `tests/generators/pipelinePinnedChoosers` A1 | 1 red | — | same 17 rows (2 sampled) |
| `tests/property/editCorpusRatchet` A8 | 1 red (V-FOOD-PCT on 2 corpus rows) | A7 red, **A8 green** | lane D's cure — STOP-1 |
| `tests/lint/writerReach.walker` | 7 red | (red, lane A's #17–18) | stale on composition: green at lane A's tip `00be15b78`, red from the lane-B merge `103b1db81` on — FIX-1 |
| `tests/lint/observedShapeReaders.walker` | 4 red | **green** | lane B merge (3 arms), lane F merge (+1, input drift) — FIX-2 |
| `tests/lint/sourceCitationIntegrity.walker` | 1 red (archival roster dated 29 → 54) | (red, lane A's #12) | docs landed after lane A's refreeze — FIX-3 |
| `tests/property/demographicsLifecycleGolden` | 1 red | **green** | lane B R-B3 (the charter at 88), the signed re-record is lane E's (record 30) — FIX-5 |
| `tests/domain/tierResourceDynamics` / `demographicsFloor` / `settlementLifecycleKernel` | 3 / 9 / 2 red | red | pre-X-46 band fixtures; lane E's — FIX-5 |
| `tests/lint/tuningRegister.walker` | 1 red | 2 red | the KNOWN red, "the three signature records read unsigned while their tables are draft" — the only red in that file (1 failed / 74 passed) |

## Lane A (`2fa94ba8e`, record `docs/LANDING7_A_2026-11-06.md`)

| spot-check | parent / base | tip |
|---|---|---|
| `townLayoutV2` site kind, base siteGenesis vs tip, same settlement, `soak1k-0..999` | — | 28 sites change, every one a mill exporter (0 non-mill), of 108 mill exporters — **matches 28 and 80 of 108** |
| `faithFieldDormancyFence` | 2 red (FENCE 4) | green 13/13 |
| `editCorpusRatchet` | A7 red | A7 green (A8 red — lane D's, below) |
| `recordRegisterTotality.walker` | 2 red | green 7/7 |
| `sizeBaseline` | 1 red | green; `npcGenerator.js` 1288 → 1287, a lowering |
| `siteCoherenceRatchet` | — | green 9/9 |
| `tuningRegister.walker` | 2 red | 1 red, the signature arm only |
| `writerReach.walker` | — | 7 red at the tip; GREEN at `00be15b78` (lane A's own tip) — see FIX-1 |

No `.skip`/`.todo`/`.only` added anywhere in the range (grep of every `+` line under `tests/`). Faith fence re-recorded only under record 02
as the record says; no other golden fixture JSON changed in the range (`git diff --stat` of `tests/fixtures`: only the envelope manifest and `tasteTowns.js`).

## Lane B (`103b1db81`, record `docs/LANDING7_L7B_2026-11-06.md`)

| spot-check | parent | tip |
|---|---|---|
| `popToTier(800)`, `popToTier(200)` at `433289899^` / `433289899` (git-archive trees) | village, hamlet | town, village — **#9's bisect holds** |
| `nextTierStampReaders` (red-first, file copied onto the base) | 5 red / 6 | 11/11 |
| `tierInertiaEnvelope` | 2 red (town ceiling, TIER-FLAT) | 17/17 (re-stated control) |
| `demographicsLifecycleGolden` | green | **red** (R-B3's named side effect) |
| generator golden master | — | lane B moved 0 rows (the 17 that moved are all lane D's, below) |

## Lane C (`8e60cb2a5`, record `docs/LANDING7_PDF_2026-11-06.md`)

| spot-check | parent | tip |
|---|---|---|
| `pageChromeFixedLeading` (red-first, file copied onto the base) | 2 red / 2 | green |
| `renderedFontEmbedding` (neighbour, one of the six) | — | 8/8 |

The cure drops only the footer's `lineHeight` (`PageChrome.jsx :: FOOTER_TEXT`); no assertion touched.

## Lane D (`b37bbf395`, record `docs/LANDING7_D_2026-11-06.md`)

| spot-check | base | tip |
|---|---|---|
| `pipelineContract` / `undoLastEvent` / `foodModelSingleWriter` / `factionNamePrecedenceScan` | 8 / 1 / 2 / 1 red | 22 / 14 / 13 / 6 green |
| golden-master hasher, 525 configs | sha `26a02855…` (= the committed fixture) | sha `a607b848…`; **17 rows move**, all `thorp|*|hills|road` (12) and `thorp|*|coastal|port` (5) |
| food-sign contradictions (`fb.deficit > 0` ≠ `fs.deficitPct > 0`) over the 525 | 17, exactly the 17 moved | 0 — **the record's "17 = the carriers" holds** |
| `recordInvariants` V-FOOD-* over the 525 | **0** | **V-FOOD-PCT 17**, the same 17 rows (e.g. `deficitPercent 1`, `deficit 1`, `dailyNeed 32`: the share reads 3) |

## Lane F (`3da1104da`, `f93c69938`, record `docs/LANDING7_F_2026-11-06.md`)

| spot-check | base | tip |
|---|---|---|
| `compendiumDataFreshness`, `edgeSharedBundleReproducibility`, `aiCharterBundle.freshness` | — | 10/10, 25/25, 19/19 |
| `serviceCategoryTables.js` lines (wc) | 802 | 798 (under the 800 ceiling) |
| `proseComposed.walker` | — | 87/87 (ceiling 1,282 + 26 OWED, the cause written) |
| `observedShapeReaders.walker` | green (base, and lane A tip) | 3 red at the B merge → 4 at the F merge (input drift: `defense.generated.js`, `economy.generated.js`, `compendiumData.generated.js`) |
| Village watch governance, `soak1k-0..999` | — | 14 villages hold the watch: Headman's Authority 7, Elected Reeve 2, Feudal Stewardship 2, Elder Council 1, Priestly Guidance 1, Household Council 1 |

## Lane G (`64ad4fe47`, `5fbb339be`, record `docs/LANDING7_G_2026-11-06.md`)

| spot-check | base | tip |
|---|---|---|
| `rulers-thorp-0..999`: governing faction carries `vacant` / `rulingChainOf` says the missing seat | 20 / 0 | 20 / 20 — **holds** |
| `powerSeatRender` | 4 red / 5 | 5/5 |
| `foundingSeeds.probe` (crown-3, links beside facts) | — | 20/20 |
| generator golden master | — | lane G moved 0 rows |

## The rows

| # | class | finding | evidence | mark |
|---|---|---|---|---|
| STOP-1 | STOP | Lane D's food-view cure (`foodBalance.js :: deriveFoodBalanceAnalysis`, the 1 lb floor) trades the sign contradiction for an ARITHMETIC one: on all 17 moved rows the view now publishes `deficit 1` beside `deficitPercent 1` on a `dailyNeed` of ~32, which the record's own invariant `V-FOOD-PCT` refuses (the share reads 3). Re-recording the 17 rows (the brief's "re-recorded at the landing") would bank 17 invariant violations. The cure must hold both laws (sign and share) before the golden moves. | invariant probe: base 0, tip 17 (= the 17 moved); `editCorpusRatchet` A8 green at base, red at tip on `V-FOOD-PCT` for `thorp|germanic|hills|road` and `thorp|germanic|coastal|port` | CONFIRMED |
| FIX-1 | FIX | `writerReach.walker` is red 7 at the tip: lane A re-froze `shapesDigest` (`5a696b9d`) on its own branch; the lane-B merge moved the executed corpus (`ed187a3e`; shapes 6,574 → 6,592). Re-derive through its door at the composed tip. | green at `00be15b78`; red at `103b1db81` and every later stage | CONFIRMED (stage), mover inside lane B PLAUSIBLY R-B1/R-B3 |
| FIX-2 | FIX | `observedShapeReaders.walker` red 4 at the tip (green at base): the lane-B merge grows the heuristic inventory (reads 2,045 → 2,057, identities 1,450 → 1,459) and the UNREVIEWED-UI cohort (126 → 129); the lane-F merge adds input drift (three generated files). A growth is not a shrink-only refreeze: the new reads want their reviews. No lane record names this suite. | base 47/47; `00be15b78` 47/47; `103b1db81` 3 red; `3da1104da` 4 red | CONFIRMED |
| FIX-3 | FIX | `sourceCitationIntegrity` "the archival exclusion is still the set" red: dated 29 (lane A's refreeze) → 54 at the tip, the chair's and lanes' dated docs landing after it. Refreeze once, last, at the final tip (this record and lane E's add to it). | tip log | CONFIRMED |
| FIX-4 | FIX | The generator golden master and its two identity arms (`nameHeldThroughAssembly` A1, `pipelinePinnedChoosers` A1) are red on the 17 food rows; no signed record for them is on the tip (`docs/shift-records/2026-11-06-*` absent). Owed after STOP-1. | hasher; tip logs | CONFIRMED |
| FIX-5 | FIX | Lane E is not merged: `demographicsLifecycleGolden` (green at base, red at tip by R-B3), `tierResourceDynamics` 3, `demographicsFloor` 9, `settlementLifecycleKernel` 2 stay red at the tip read. Lane E's branch carries record 30 and the re-keys; it was not read here. | tip and base logs | CONFIRMED (reds); lane E's cures UNREAD |
| FIX-6 | FIX | The Village watch's two desc variants (lane F, the owner's veto class) say "the headman holds the rota" / "Whose turn it is, the headman decides." The record governs 7 of the 14 watch villages by something other than a headman (reeve, steward, elders, priests, household council). The identity line makes no such claim. (The catalogue's own desc already says "the headman keeps the rota" — pre-window; the variants repeat it.) | governance probe | CONFIRMED |
| NOTE-1 | NOTE | Three loosenings by re-derivation, each with its stage cause written in the test (lane B): tier-inertia town ceiling 17 → 43; statecraft scandal floor 20 → 12 (ceiling 38 → 29, a tightening) and mobilization floor 71 → 18. The record's own warning stands: the seeded run is one realm's draw. | diff | CONFIRMED |
| NOTE-2 | NOTE | Lane F's under-claim ceiling 1,282 → 1,308 is written as base + 26 OWED with the cause; the assertion is `≤`, so a buy-back below 1,308 is silent unless OWED is lowered by hand. | diff | CONFIRMED |
| NOTE-3 | NOTE | R-B2 re-states the TIER-FLAT control as convergence + per-tier drift band; the record's "every one of them" qualification (support-eligible only) and the severity-ratio exemption await the chair's confirmation. | record, 17/17 green | CONFIRMED |
| NOTE-4 | NOTE | Removed `expect`s: 104 lines removed, 202 added; every removed line in the equal-count files was re-pinned (a re-keyed literal) or re-added with an `// anchored:` comment; none deleted outright. | per-file diff | CONFIRMED |
| NOTE-5 | NOTE | crown-3's `firstDecade` keeps "a failing crown" in a Guild Council town; the probe proves the synopsis's links, not this phrase. | text read | PLAUSIBLE |
| NOTE-6 | NOTE | Lane G says the soak records carrying a vacant birth are re-recorded "at the landing"; none is on the tip. | `git diff --stat` | CONFIRMED (absent) |
| NOTE-7 | NOTE | Lane C's cure changes the footer's leading (font default, was 1.35 × 8); body-text leading still compounds upstream (`@react-pdf/layout` 4.6.1), unpainted — the record names it. | diff, record | PLAUSIBLE |

Count: **1 STOP, 6 FIX, 7 NOTE.**
