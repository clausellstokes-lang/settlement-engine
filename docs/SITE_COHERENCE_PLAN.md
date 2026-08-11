# Site Coherence & Walker Banking — Plan

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - 2026-08-07 — **Wave 9 SIGNED by the owner** ("I permit it"); blocker `B4` cleared. All 9 waves are now authorized. Still **0 of 9 landed** — every wave remains blocked on `B1`/`B3` (the shared worktree and the single vitest slot).
> - 2026-08-07 — program opened at HEAD `2c1ec70f` (branch `claude/composite-r4`), plan+audit committed at `2e6d872f`. 22 confirmed findings across 5 lenses. 0 of 9 waves landed.

## Sources

- **Audit** — `docs/SITE_COHERENCE_AUDIT.md` (companion doc; finding ids `H1–H4`, `M1–M16`, `C1`).

> **Owner sign-off #1, 2026-08-07 (verbatim scope):** the owner authorized ITEM B — the
> site-coherence question as reported: *substring false positives* and *the missing
> biome-contradiction guard*. Waves 3–5 execute exactly that.
>
> **Owner sign-off #2, 2026-08-07 — WAVE 9 IS SIGNED.** Put to the owner as the single
> open call ("Wave 9 — upstream gating — **Owner-gated** — Your call"), answered
> *"I permit it"*. Wave 9 is therefore authorized and its blocker `B4` is CLEARED.
> **Scope of this grant is Wave 9 only** — queue rows #2 (Option D, new capability) and
> #3 (the `coast` arm) were NOT put to the owner in that exchange and are unchanged;
> #2 remains DEFER-to-after-the-tail, #3 remains ACCEPT-as-is. Row #4 proceeds on the
> chair's recommendation as a vetoable judgment call, not under this grant: it reverts
> cleanly with a code change, so by this plan's own reversibility test it was never an
> owner gate.
>
> ⚠ Wave 9 being signed does NOT unblock it. It stays behind `B1`/`B3` (the shared
> worktree and the single vitest slot) like every other wave, and it is still sequenced
> after Wave 4 — its measured 47→13 figure is the COMBINED effect, not Wave 9 alone.
>
> **Correction to the opening brief:** an earlier session summary claimed the walker
> ceilings were never banked after TCD-1..TCD-4, so a revert of *any* of the four would
> stay green. That is wrong and is superseded by finding `M12`. TCD-1/TCD-2/TCD-3 were
> already banked by the `ec525a59` re-freeze; **only TCD-4's row is stale** (measured:
> HEAD scans `violations 0 stale 0 bankable 1`). Wave 1's scope is one row, not four.
- **Commits** — TCD-1 `9ecec2a2` · TCD-2 `b19038ec` · TCD-3 `3800bcb6` · walker freeze `1d3cdf73` · re-freeze `ec525a59`/`bd5e49f6` · **TCD-4 `2c1ec70f`** (the trigger) · pre-TCD-4 tree `94962c17`.
- **Reusable probes** (outside the repo, read-only) — `/tmp/sca-probes/lens1-*.mjs` (predicate collisions, 1008-settlement blast), `lens2-*.mjs` (462-settlement corpus + attribution + cure simulation), `lens3_*.mjs` (law surface, resource compatibility, option A/B/C/D measurement), `lens4-*.mjs` (substrate, scene, fixtures), `lens5/scan-head.mjs` + `lens5/bank-sim.mjs` with saved scans `out.json` / `out-head.json` / `out-pre.json`.
- **Governing text** — `docs/DESIGN_SETTLEMENT_MAP.md:356-361` (§12b, the REALM-COHERENCE law and the `mines⇒slopes / fisheries⇒water / peat⇒marsh / salt⇒flats` licence) · `docs/DESIGN_TOWN_CARTOGRAPHY.md:29-31` · `src/domain/townMap/siteGenesis.js:8-11`. Repo-wide grep for `realm-coherence` returns **7 hits in 3 files** — that is the entire declared law surface.
- **Memory** — `hazard-conversion-law` · `concurrency-law-ruled` · `two-lane-commit-shared-index-race` · `the-promise-ratified` · `owner-blanket-queue-signoff` · `observed-shape-readers-walker-landed` · `dark-wave-display-surface-escapes-the-flag`.

## Method

**Gates** (real commands, read from `package.json`):

| Tier | Command | Contents / cost |
|---|---|---|
| **fast** | `npx eslint <changed files> && sh scripts/gate-mutex.sh && npx vitest run <target test files>` | Per-edit. `gate-mutex.sh` is mandatory — this machine runs **one** vitest lane; concurrent runs produce fake reds, and the naive `ps aux \| grep -c '[v]itest'` idiom self-matches. |
| **quick** | `sh scripts/gate-mutex.sh && sh scripts/gate-tail.sh npm run check:quick` | `check:quick` = `lint && test` (the whole vitest suite). Exceeds the 10-minute tool cap — **always** via `gate-tail.sh`, never a bare `\| tail`. |
| **full** | `sh scripts/gate-mutex.sh && npm run check:tail` | `check:tail` = `gate-tail.sh npm run check`, a 16-step `&&` chain: `validate:hazard-registry → validate:premortem → validate:data → validate:custom-content-manifest → validate:migration-head → validate:edge → validate:map → validate:tuning-bands → validate:foundry-module → validate:mcp-server → typecheck:ratchet → typecheck:domain:strict → lint → test:ratchet → build → verify:dist`. Add `npm run check:full` for `check:edge-behavior`. |

**Three gate facts that must be stated in every wave report, or the receipt is vacuous:**
1. `check` runs `test:ratchet` (`scripts/check-test-ratchet.mjs`), **not** bare `vitest run` — the plain suite lives only in `check:quick`. Quote both.
2. `check:observed-shape-readers` is **not** in the chain. The walker reaches the gate as a *vitest test* (`tests/lint/observedShapeReaders.walker.test.js`); the npm script is the diagnostic. Wave 1's receipt must therefore be a materialized-tree CLI scan **and** the walker test.
3. `check` runs **two** tsconfigs that disagree (`typecheck:ratchet` = `tsconfig.full.json`, `typecheck:domain:strict`). Name the config and the window in any typecheck claim.

**Shared-tree discipline** — one landing lane, one gate, one worktree. Never `git add -A/-u/.`; stage explicit files and verify every staged hunk. Commit by plumbing when another lane holds the index. Re-read any file before editing (the tree is live). Never `git stash`.

**Corpus spec** (fixed for the whole program so every wave's numbers are comparable): **462 settlements** = (6 settTypes × 7 `terrainOverride` × 5 seeds @ `tradeRouteAccess:'road'`) + (6 × 7 × 6 route values × 1 seed), culture rotated over all 11 `CULTURE_PROFILES` keys, `customContent: {}`.

**Contradiction metric** (identity-keyed, never a bare count — a count-keyed ratchet passes an identity swap, which is exactly the `HZ-READERNOWRITER` soft spot): rows keyed `(terrain, siteKind, decisive-token)`.

## Owner decisions honored throughout

- **THE PROMISE** — a seed is a starting world forever; lived history is immutable; tuning is owner-**signed** and versioned. Waves 0–8 change only **view-time projection** from an unchanged dossier, so no lived history moves. Wave 9 changes what the generator emits — it needed a signature and now HAS one (2026-08-07). THE PROMISE is not waived by that signature: worlds already generated keep their economies, so Wave 9 changes only seeds rolled after it lands, and its one-time shift is declared, never silent.
- **Owner sign-offs, both 2026-08-07** — #1 covers ITEM B (*substring false positives* + *the missing biome-contradiction guard*, Waves 3–5); #2 covers **Wave 9** (upstream resource terrain gating). Neither extends to **Option D** (new landform vocabulary — queue #2, still DEFER) or to the `coast` arm (queue #3, ACCEPT as-is).
- **Fix philosophy — bold architecture over patches.** The cure is a single-writer export-semantics module, not eight regex tweaks in two files. `/coal/` currently lives in two homes (`siteGenesis.js:247`, `asymmetrySources.js:70`) — that duplication is the mechanism.
- **Risk appetite** — take the best option even with risk; gated classes stay gated.
- **Hazard-conversion law** — every class becomes MACHINERY or is ACCEPTED with a written reason. *PARTIAL — a cure you can bypass — is the status that hides.* The metric is **instances per class**.
- **Legibility / game-grade UX** — provenance must be honest. *"the river (river trade / fishery)"* may not appear because a town exports `Milled flour`.
- **Reporting** — the remaining-work table after every commit report.

## Wave 0 — Enforcement layer

**Purpose** Mint the measuring instruments **before** any behaviour moves, so every later wave has a receipt. Inventory-freezing only — **no correctness assertion** (that is Wave 8).

- **Findings** `M6` (dead tokens), `C1` (stale registry), plus the instrumentation that makes `H1–H3`, `M1–M4` measurable.
- **Deliverables**
  1. `tests/lint/siteCoherenceRatchet.test.js` + `tests/fixtures/.site-coherence-baseline.json` — generates the 462-settlement corpus, classifies every contradiction, and freezes an **identity-keyed** inventory `(terrain, siteKind, decisive-token) → count`. Only-shrinks; a new key is a violation.
  2. `tests/lint/exportTokenCoverage.test.js` — every alternative in every export-matching predicate must be exercised by ≥1 string in the live generated vocabulary. Reds today on `/pearl/`, `/whal/`, `/ferry/`, `/barge/`, `/silver/`, `/gold/` and the shadowed `/salt/` dunes leg → those are quarantined into an explicit `KNOWN_INERT` list with a written reason, which the test also pins as non-growing.
  3. `scripts/hazard-registry.json` — fix `HZ-READERNOWRITER`'s note and `upgradePath` (the count-only ratchet was retired at `53029151`; baseline is `"schema": 2` and `rowOf()` throws on a bare number), raise `instances` 3 → 4, and add `HZ-SITECOHERENCE` (status `MACHINERY`, enforcer = the two new tests).
- **Gate** fast, then `npm run validate:hazard-registry` (exit 0), then quick.
- **Verify** Mutant receipt: delete the guard-free `/coal/` alternative → the coverage test still passes (it only checks *liveness*), but the coherence ratchet's `(plains, mountain-flank, coal)` row **must move**. Run it and quote the row.
- **Exit criteria** `.site-coherence-baseline.json` exists and its totals reproduce the audit's measured baseline exactly: `water-on-dry 80`, `marsh-on-dry 33`, `flank-on-flat 23`, `dunes-on-wet 0`, `any-contradiction 103`, over 462 settlements with 0 generation errors. `validate:hazard-registry` exits 0 with `HZ-READERNOWRITER.instances = 4` and `HZ-SITECOHERENCE` present.
- **Golden churn** none (new fixture minted, no existing manifest touched).
- **Risk** low. The corpus build costs wall-clock inside vitest; if it exceeds the per-test budget, dump the corpus once to a fixture and read it (the pattern `OSR_CORPUS` already uses).

## Wave 1 — Bank the stale reader-walker row (ITEM A) — **BLOCKED**

**Purpose** Close the revert door that `M11` proves is open.

- **Findings** `M11`, `M12`, `M13`, `M14`, `M16`.
- **Deliverable** A **three-value hand edit of `scripts/.observed-shape-readers-baseline.json` only.** No `--write`, no other file:
  1. `:1356` — delete the line `"exports on economicState": 2,` (the row becomes `{"biome on config": 2, "severity on scars": 2}`; both are still live).
  2. `:38` — `"total": 3261` → `3259`.
  3. `:39` — `"identities": 2168` → `2167`.

  ⛔⛔ **THE THREE LITERAL ADDRESSES AND FIGURES ABOVE ARE STALE — corrected 2026-08-11 per chair order, session `c42c8924`. DO NOT APPLY THEM.** They are SCHEMA-2-era values. The live baseline at this HEAD is `"schema": 5`, `"total": 1977`, `"identities": 1396`, `"frozen": "2026-08-11"`, `"frozenAtSha": "aed0fc0e4a060d076c3e6e68b199fc22aa7aa06a"` — measured in `scripts/.observed-shape-readers-baseline.json` — and every line address above has rotted with the schema-3/4/5 mints. Applying the literals would corrupt the envelope and red the walker.
  ⭐ **A Wave-1 lane MUST RE-DERIVE the row address, the row's multiplicity, and both totals from the live file AT COMPILE TIME.** Only the SHAPE of the edit survives: delete the one bankable identity row; decrement `total` by exactly that row's multiplicity; decrement `identities` by exactly one; leave `schema`, `frozen`, `frozenAtSha`, `minRows`, `corpusMeta`, `scanStats` and `sentinel` untouched. Re-confirm the row is still the only bankable one before editing — the sentinel and drift figures below are schema-2 measurements too and must be re-measured, not inherited.
  ⭐ **Wave 0 is UNAFFECTED by this correction.** Its deliverables (`tests/lint/siteCoherenceRatchet.test.js`, `tests/fixtures/.site-coherence-baseline.json`, `tests/lint/exportTokenCoverage.test.js`, `scripts/hazard-registry.json`) carry no observed-shape figure, so its exit criteria stand exactly as written.

  Leave `schema`, `frozen` (`"2026-08-07"`), `frozenAtSha` (`"ec525a59"`), `minRows`, `corpusMeta`, `scanStats` and `sentinel` **untouched**. The sentinel's 90% floors absorb the `resolvedReads` drift (12433 frozen vs 12429 at HEAD; floor 11189). ⚠ *(This sentence's parenthesised values are the schema-2 measurement superseded by the correction above.)*
  Also: add the two missing sentences to `check-observed-shape-readers.mjs:144-146` and the baseline `_doc` — that a shrink requires adjusting `total` and `identities`, and that `--write` requires `OSR_FREEZE_SHA` or it writes `frozenAtSha: null` and reds the walker.
- **⛔ Do NOT run `--write`.** On this worktree it would add 2 files and 3 identities belonging to other lanes, re-baseline the anti-vacuity sentinel, and rewrite the freeze provenance (`M13`).
- **Gate** fast (`npx vitest run tests/lint/observedShapeReaders.walker.test.js`) — **only after the blocker clears**, see the ledger. Then full.
- **Verify (the mutant, both directions)**
  - Materialized HEAD `2c1ec70f`: `node scripts/check-observed-shape-readers.mjs` → `violations 0 stale 0 bankable 0`.
  - Materialized `94962c17` (pre-TCD-4) against the banked baseline: exit 1 naming `NEW exports on economicState — 2 read(s); this file has no frozen row for it (ceiling 0)`.
- **Exit criteria** Both scans above produce exactly those strings, quoted verbatim in the wave report. A `git revert 2c1ec70f` on a materialized tree **reds** the walker where today it is green.
- **Golden churn** none.
- **Risk** low, but note: `node scripts/check-observed-shape-readers.mjs` on the *live* tree will still exit 1 on the three foreign-lane violations (`M15`). That is **not** this edit. The clean receipt is a materialized-tree scan.

## Wave 2 — Single-writer export semantics (data layer; byte-identical)

**Purpose** Give the token vocabulary exactly one home before anyone edits it. Pure extraction — **zero behaviour change** is the exit criterion.

- **Findings** structural precondition for `H1`, `H2`, `H3`, `M1`, `M2`, `M6`.
- **Deliverable** `src/domain/townMap/exportSemantics.js` — one exported classifier per semantic class (`waterEconomy`, `extractiveMineral`, `wetlandProduce`, `evaporite`, `tannery`, `quarry`, `mill`, `salthouse`, `weavers`, `marketFarms`, `reagents`), each carrying its token list, a written rationale per token, and a `KNOWN_INERT` quarantine. `siteGenesis.js:48,247,250` and `asymmetrySources.js:67-76` import from it and spell **no** raw export-token regex of their own. Plus `tests/lint/exportTokenSingleWriter.test.js`: a source scan asserting that no file outside the module spells an export-token pattern (module SET + non-empty + a negative control, per the filename-anchored-pin-vacuity cure).
- **Gate** fast, then quick.
- **Verify** The Wave 0 coherence ratchet must be **byte-identical** across the extraction; the 1008-settlement provenance-string census must reproduce the same four `mine (…)` counts (139/69/37/16) and `tannery (Sulfur export)` 84.
- **Exit criteria** `git status --porcelain tests/fixtures/` shows **no** golden modified; `.site-coherence-baseline.json` unchanged; the single-writer scan reds when a token regex is planted back into `siteGenesis.js`.
- **Golden churn** **none — that is the point.** Any churn here means the extraction was not faithful.
- **Risk** low. The one trap: `EXPORT_RULES` order is load-bearing (`.find` is first-match) — preserve index order exactly and pin it.

## Wave 3 — The biome-contradiction guard (the missing guard, owner-signed)

**Purpose** Close the gap the law declares but the code never implemented: the mountain-flank and dunes arms have **no** biome check at all, and the dry-biome water suppression at `:217` is disabled by `!waterEconomy` — inert since exports started arriving.

- **Findings** `H1` (desert half), `H2` (the flank-on-flat half), `M4` (desert marshes), `M7`.
- **Deliverable** In `siteGenesis.js`: an export-derived `mountain-flank` requires a mountainous-or-broken biome; an export-derived river/marsh on a `DRY_BIOME_RE` biome requires a coastal/river trade lane; the licensed inland-fishery channel (`DESIGN_SETTLEMENT_MAP.md:359`) is **preserved** on non-dry biomes. Arm-ordering fixed so a suppressed arm falls through deterministically rather than redistributing onto the next first-match branch. **The `coast` arm is not touched** — it is lane-derived, not export-derived (see owner queue #3).
- **Gate** fast, then quick, then full.
- **Verify** Re-run the corpus. Mutant: remove the guard → the ratchet rows return to the frozen baseline.
- **Exit criteria** Ratchet rows `(plains, mountain-flank, *)`, `(desert, mountain-flank, *)` and `(forest, mountain-flank, *)` all reach **0**. Rows `(desert, river, *)` and `(desert, marsh, *)` reach **0** (today 17 + 5 = 22 of 462). No row grows. Named receipt: *Cerrofundus* (`thorp/plains/road`, exports `Coal`) returns `plain`, and *Aristoikon* (`thorp/desert/road`) no longer returns `marsh`.
- **Golden churn** **0 expected.** All 20 `V2_GOLDEN_CONFIGS` have `canonExports() === []`, so the export arms are unreachable for the entire golden corpus (`M8`); the `LANDFORM_FIXTURES` marsh fixture is `riverside` (a wet biome) and survives. If any golden moves, stop — the guard leaked into the biome-derived path.
- **Risk** medium. This wave **must** precede Wave 4: Option B measured alone moved flank-on-flat **15 → 19**, because narrowing the water predicate makes the mountain arm reachable for settlements the water arm was shadowing. Landing them in the wrong order reds the ratchet for a reason that is not a regression.

## Wave 4 — Token de-collision (word boundaries, negative list, dead-token retirement)

**Purpose** Fix the substring false positives — the other half of the owner-signed scope.

- **Findings** `H1`, `H2`, `H3`, `M6`.
- **Deliverable** In `exportSemantics.js`: word-anchored alternatives plus an explicit negative list. Concretely — `/preserved/`, `/mill/`, `/timber/`, `/lumber/` leave the water class (a mill is *"Water or windmill"*, `institutionalCatalog.js:535`; `resourceChains.js:280` lists `['Windmill','Horse mill']`); `Charcoal` and `Charcoal supply` leave the mineral class; bare `/coal/`, `/ore/`, `/stone/`, `/gold/`, `/silver/`, `/tin/`, `/fur/`, `/hide/` are anchored or replaced by explicit strings; the `KNOWN_INERT` quarantine from Wave 0 is emptied by deletion or by a written acceptance.
- **Gate** fast, then quick, then full.
- **Verify** Mutant: restore one retired token → its ratchet row reappears. Re-run the 910-name catalog scan — the mountain class must match only mining names.
- **Exit criteria** The **47/462 purely-false-positive water cases reach 0** (decisive strings `Preserved foods` 28, `Milled flour` 21, `Milled timber` 6, `Hewn timber` 2). `generateSite({terrain:'forest', exports:['Charcoal']})` returns `plain`, not `mountain-flank`. The catalog scan reports **0** substring accidents in the mountain class (today 7 of 11: `Charcoal`, `Charcoal supply`, `Foreign merchants`, `Laborer hire`, `Monster lore`, `Weather forecasting`, `Millstone cutting`). Every retained token is exercised by ≥1 live vocabulary string.
- **Golden churn** **0 expected** (same reason as Wave 3).
- **Risk** medium — this is the wave that changes the most site derivations. Every change must land as a ratchet **shrink**; a single new key is a stop.

## Wave 5 — Asymmetry rules + structured causes

**Purpose** Stop shipping nonsense provenance to the player, and stop a downstream predicate re-parsing a prose string the code itself built.

- **Findings** `M1`, `M2`, `M3`.
- **Deliverable** `asymmetrySources.js` consumes the Wave-4 vocabulary (killing `/tin/`→`enchanting` and `/fur/`→`Sulfur`). The `cause` becomes a **structured object** `{ label, token, export }`; `townLayoutV2.js:624` renders it; `siteGenesis.js:333/335/386` read the structured field instead of pattern-matching prose with `/waterfront|harbou?r|trade|market|quay/`. Rule ordering is pinned explicitly rather than relying on array index.
- **Gate** fast, then quick, then full.
- **Verify** Re-run `lens1-blast.mjs` and `lens1-recon.mjs` against the new code.
- **Exit criteria** Over 1008 settlements: `mine (Spellcasting (1st-3rd level) export)` 139 → **0**, `mine (Hunting trophies export)` 69 → **0**, `mine (Arcane services (identification, enchanting) export)` 37 → **0**, `mine (Coin minting export)` 16 → **0**, `tannery (Sulfur export)` 84 → **0**; the 27 suppressed real mine/ore sites → **0**; total nonsense-provenance settlements 347/1008 → **0**. `reconciliationDisplacement` with `Alchemical trade (potions, reagents)` returns `dx=14, effect='reconcile-planned'` (today `dx=0, 'reconcile-hold'`), and `market-farms (Grain surplus export)` likewise no longer holds.
- **Golden churn** **0 expected** for the town-map manifests (`canonExports() === []` on all 20). ⚠ `resourcePoint` is keyed on `codeDigit(ex)`, so if the cause refactor changes what string is hashed, attractor points move for any *export-bearing* fixture — there is exactly one (`townMapFixtures.js:245`) and it is legacy-spelled. Keep `codeDigit` reading the raw export text.
- **Risk** medium. The cause string is user-visible; check the Herald / realm-inspector renderers for anything that string-matches on it before changing the shape.

## Wave 6 — Persisted substrate invalidation

**Purpose** `H4` is **already live from `2c1ec70f`** — the fix is overdue independent of this program.

- **Findings** `H4`.
- **Deliverable** Extend `substrateSignatureOf` (`src/lib/spatialSubstrateDerive.js:60`) with a **site fingerprint** — `siteKind` plus a hash of the district centroid set — so a changed derivation invalidates the reuse short-circuit at `:84`. **Deliberately not** a `SUBSTRATE_VERSION` bump: extending the signature is revertable (a revert produces one more one-time re-derivation and self-heals), whereas reverting a version bump leaves rows whose sig *matches* the reverted code while their content matches the reverted-away derivation — a stuck-stale state no code revert clears. See owner queue #5.
- **Gate** fast (`npx vitest run tests/domain/spatialSubstrate.test.js`), then quick, then full.
- **Verify** Re-run `/tmp/sca-probes/lens4-substrate.mjs` on the same `SUB-1` A/B pair.
- **Exit criteria** The probe reports `SIGNATURES EQUAL? false` and `REUSE GATE: re-derived? YES` where today it reports `true` / `NO (stale subA reused)`. A new pin in `tests/domain/spatialSubstrate.test.js` (alongside the existing roster and v1→v2 pins at `:152-164`) reds when the site fingerprint is removed.
- **Declared one-time behaviour shift** every already-canonized campaign's `spatialLedgers.spatialSubstrate` is re-derived once on next canonize. Record it; do not let it ride silently.
- **Golden churn** `spatial-consequence-dormancy-golden.json` builds with `buildTownMapModel(city, null)` (v1) and should not move — **confirm at wave time**; if it does, the fingerprint leaked into the v1 path.
- **Risk** medium-high — this touches persisted `worldState`. Not owner-gated under the revert test, but flagged to the owner (queue #5).

## Wave 7 — View-time consumers

- **Findings** `M9`, `M10`.
- **Deliverable** One shared `resolveSceneProfileSource(meta)` used by **both** `sceneTerrainNetwork.js:130` and `compileTownSceneManifest.js:282`, ending the opposite-precedence split and making `woodland` reachable on v2. `tests/helpers/townCartographyFixture.js:21` `FIXTURE_SITES` corrected to the strings `generateSite` actually emits (add `mountain-flank`, `dunes`; drop `mountain`, `desert`, `woodland`), with a pin asserting `FIXTURE_SITES ⊆ the emitted set`. An annotation-orphan report for `mapEdits.annotations` (mirroring `sceneOverrideOrphans.js:44-79`) that surfaces markers whose nearest district moved beyond a threshold — surfacing only; **no** silent relocation, since the coordinate exception at `mapEdits.js:94` is deliberate law.
- **Gate** fast, then quick, then full.
- **Exit criteria** A v2 forest town yields `profileId='woodland'` (today `plain`). The `FIXTURE_SITES` pin reds when a non-emitted string is added. The orphan report names the marker in the H4/M10 scenario (a 354-unit district shift) and names **zero** markers when the site is unchanged (the anchored negative).
- **Golden churn** **0 expected** — no committed scene golden consumes a v2 model (`townCartographyDormancyGolden.test.js` compiles with `mapEdits:null`). ⚠ Check `tests/domain/townSceneManifest.test.js` at wave time: if it pins a digest, the `woodland` fix moves it, and that is a legitimate declared shift.
- **Risk** medium. `profileId` drives the entire quantized heightfield (1085/1089 cells differ on a kind flip), so any v2 town whose profile changes changes its whole 3D scene.

## Wave 8 — Live-spelling coverage + the correctness-asserting pins **(prevention LAST)**

**Purpose** Make the law assertable. Until this wave, every prior wave is proven only by the inventory ratchet — which freezes what *is*, never what *ought to be*.

- **Findings** `M7`, `M8`.
- **Why this wave exists** The town-map goldens' single export-bearing fixture (`tests/fixtures/townMapFixtures.js:245`) writes the **legacy** `exports` alias with two strings the generator never emits, so it resolves through `canonExports`'s fallback and is byte-identical either way. **Waves 0 and 8 are the two that add live-spelling coverage** — Wave 0 by construction (its corpus is pipeline-generated, hence `primaryExports`), Wave 8 explicitly.
- **Deliverable**
  1. Re-anchor `tests/domain/townGenesisPipeline.test.js:43-48` off `['salt','copper ore']` onto the **live** desert list `['Rock salt','Draft camels','Camel leather','Camel wool','Raw wool','Livestock','Transit trade','Toll revenue','Preserved foods']` (seed `lens3-desert-hamlet-0`) at the `primaryExports` spelling. This assertion **fails today** — that is the retro-detection receipt.
  2. The missing negative pin: *an export may not create geography the terrain denies*. No such assertion exists anywhere in `tests/` today.
  3. A dedicated `SITE_COHERENCE_FIXTURES` array + one new golden manifest, **added** rather than appended to `V2_GOLDEN_CONFIGS` (appending re-mints five shared manifests: `town-map-v2`, `illustrated-town`, `illustrated-town-season`, `town-panorama`, `town-panorama-season`).
- **Gate** fast, then quick, then **full** — this is the program's landing gate.
- **Verify (mutant-driven, per the door-3 polarity rule — the instrument must be shown to ASSERT, not merely to run)** Deleting the Wave-3 guard reds ≥1 pin. Deleting each retained token from `exportSemantics.js` reds ≥1 pin (this is what kills `M6` recurrence). Reverting `2c1ec70f` reds ≥1 pin *and* the walker (Wave 1).
- **Exit criteria** Every mutant above produces a named red, quoted. The new pins pass on HEAD.
- **Golden churn** **1 new manifest minted**, 0 re-mints. Mint command: `UPDATE_GOLDEN=1 npx vitest run tests/property/<new>.test.js`. If the shared corpus is used instead, the re-mint set is the five files above, via `UPDATE_GOLDEN=1` / `UPDATE_ILLUSTRATED_GOLDEN=1` / `UPDATE_PANORAMA_GOLDEN=1`.
- **Risk** low.

## Wave 9 — Upstream resource terrain gating — **OWNER-SIGNED 2026-08-07**

- **Findings** `M4`, `M5`.
- **Why it WAS gated (and why the sign-off was required)** It changes what the generator emits — every future seed's economy, and therefore the PDF, the journal pages and the economics tab, not only the map. Under THE PROMISE, campaigns generated in the interval keep those economies permanently: **a veto cannot be honoured by a plain code revert.** That is why it needed a signature rather than a judgment blockquote. **SIGNED 2026-08-07** ("I permit it"); blocker `B4` cleared. The irreversibility itself does not go away — it is now an accepted, recorded consequence, so this wave lands with the one-time generator shift declared explicitly and never re-mints a golden silently.
- **Deliverable** Give `marshlands` (`resourceData.js:271-280`) and `coal_deposits` (`:218-230`) `terrainRequired` lists, using the machinery that already exists and already works for `fishing_grounds` (`:22`). Suggested: marshlands → `['riverside','coastal','plains','forest']`; coal → `['hills','mountain']`.
- **Measured effect** Option C alone: flagged 47 → 30 of 126. Combined with Wave 4: **47 → 13**, the best measured ratio of coherence gained to variety lost; the 13 residual are export-implied slopes on plains/forest, the class Option D would absorb.
- **Exit criteria** `getCompatibleResources('road','desert')` returns `marshlands.compatible=false` **and** `coal_deposits.compatible=false` (today both `true`). The `(desert, marsh, *)` and `(mountain, marsh, *)` ratchet rows reach 0 from the *data* side. A desert town's dossier no longer lists `Waterfowl` as a primary export.
- **Golden churn** **`generator-golden-master.json` re-mints** (`UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`), plus any dormancy golden whose corpus includes an affected settlement. Declare the one-time shift explicitly; never re-mint silently.
- **Risk** high blast radius, low technical risk.

## Sequencing rationale

1. **Wave 0 first** because every later exit criterion is a *number*, and there is no instrument today. The audit measured the baseline with throwaway probes outside the repo; that evidence dies with the session unless it is banked as a ratchet.
2. **Wave 1 early** because it is independent of everything else, is a three-value JSON edit, and closes a door that is provably open right now — a `git revert 2c1ec70f` is green on today's gate.
3. **Data before consumers**: Wave 2 (the vocabulary module) precedes Waves 3–5 (its consumers), which precede Waves 6–7 (consumers of the *site*), which precede Wave 8 (the assertions about all of it).
4. **Wave 3 before Wave 4 — this is the non-obvious one.** `EXPORT_RULES` and the site arms are **first-match chains**. Measured: narrowing the water predicate alone moved 9/168 settlements `river → mountain-flank`, and Option B as a whole made flank-on-flat **worse** (15 → 19), because suppressing an earlier arm makes a later arm reachable. Land the guard first and the redistribution has nowhere incoherent to go.
5. **Correctness assertions last (Wave 8)** per the program rule. An assertion written before the behaviour is right is an assertion written to the wrong shape, and the pin-vacuity family in this estate is entirely populated by pins authored ahead of their subject.
6. **Wave 9 is out of dependency order by necessity** — it is the most upstream data change and it is gated, so it cannot block. This is safe because the coherence ratchet only shrinks: a later data fix is a further shrink, never a re-open. Measured monotone (B alone 47→33, C alone 47→30, B+C 47→13).

## Blocked-on ledger

| # | Wave | Blocked on | Exact check that clears it |
|---|---|---|---|
| B1 | **Wave 1** | The concurrent lane editing `tests/lint/observedShapeReaders.walker.test.js` (currently `M`, +129/−51, a scan-budget refactor that adds `expect(scansRun).toBe(2)`). Wave 1 touches only the JSON so there is no textual collision, but the walker must not be run under vitest while that lane is live. | `git status --porcelain tests/lint/observedShapeReaders.walker.test.js` returns **empty** **AND** `git log --oneline -1 -- tests/lint/observedShapeReaders.walker.test.js` names a commit newer than `2c1ec70f`. Then re-scan a materialized tree and confirm `townLayoutV2.js "exports on economicState"` is still the **only** bankable row before editing. |
| B2 | **Wave 1 verification** (not the edit) | Foreign lanes holding `src/domain/worldPulse/commercialReasons.js` (`M` +11/−1) and `src/lib/spatialUsage.js` (`M` +43) — they produce 3 walker violations on the live tree (`M15`). | `node scripts/check-observed-shape-readers.mjs` on the **live** tree prints `violations 0`. Until then the only valid receipt is a materialized-tree scan (`/tmp/sca-probes/lens5/scan-head.mjs`, edit the `R` constant). Do **not** interpret the live red as your own. |
| B3 | **Every wave's `quick`/`full` gate** | The single vitest slot. | `sh scripts/gate-mutex.sh` exits 0, `&&`-chained to the run in the same command. Never spell the check by hand — the `ps aux \| grep -c '[v]itest'` idiom self-matches and burns up to 40 minutes per gate. |
| ~~B4~~ | ~~**Wave 9**~~ | ~~Owner signature (queue #1).~~ | ✅ **CLEARED 2026-08-07** — signed explicitly ("I permit it") in direct answer to the wave being put as the single open call. No blanket-sign-off carve-out reasoning was needed or used. Wave 9 remains blocked by `B1`/`B3` like every other wave. |

## Deferred (documented, NOT bugs to re-find)

- **The four `/ore/` catalog accidents** — `Foreign merchants`, `Laborer hire`, `Monster lore`, `Weather forecasting` (`src/data/institutionServices.js`). Catalog-reachable and confirmed to produce `mountain-flank` when injected, but **not observed** in `primaryExports` across 1008 + 126 sampled settlements. Wave 4's word-boundary + negative-list cure kills them anyway. Latent, not live — do not re-hunt as a shipping defect.
- **Latent-but-unfired fragments in `asymmetrySources`** — `/ale/` (whALE, wholesALE, scALE), `/hop/` (sHOP, bisHOP), `/hide/`, `/meat/`, `/ore/`. Unfired against the stock 158-string vocabulary but **armed by `customTradeEndpointIntegration.js`**, which pushes arbitrary user strings into `primaryExports`. Covered by Wave 4/5's anchoring; the custom-content path itself was exercised by no probe in this audit. Recorded as an open question, not a finding.
- **`townLayoutV2.js:269` tests `tradeAccess === 'coastal'`**, but `ConfigurationPanel.jsx:310-316` offers only `random_trade/road/river/port/crossroads/isolated/mountain_pass` — no UI path writes `'coastal'`, so the disjunct never fires for wizard-generated settlements. Dead-value observation, out of scope, deliberately not fixed here.
- **Every v1-driven golden is structurally blind to this surface** — `buildTownMapModel(x, null)` never reaches `generateSite`. Not a defect; recorded so nobody expects `town-map-golden.json`, `town-map-style-golden.json`, `age-overlay-golden.json`, `town-cartography-dormancy-golden.json` or `spatial-consequence-dormancy-golden.json` to move in any wave.
- **`bankable` is a report-only channel** (`check-observed-shape-readers.mjs:275`): the CLI prints *"1 row(s) bankable"* and returns **0**. This is why TCD-4's row sat unbanked. The structural cure is queued (owner queue #4); until it is signed, this is the ACCEPTED-with-a-reason status, and the reason is the one written in the source at `:193-197` — a ratchet that reds because another lane's fix landed is a ratchet people delete.
- **Option D (bounded local features)** — millpond/spring/cistern/wadi instead of a realm-scale river; quarry scar instead of a mountain flank. Genuinely new capability, requiring new mark vocabulary in `generateLandform` (`:109-198`). Queued, not deferred (owner queue #2).

## Owner-decision queue

Recorded per the judgment-ledger rule: each row carries a recommendation so a veto is a one-word answer. Per the 2026-08-05 blanket queue sign-off, a queued item carrying a chair recommendation is signed unless it falls in one of the four carve-outs — **confirm the carve-outs before treating any row below as signed.**

| # | Decision | Why it is owner's | Recommendation |
|---|---|---|---|
| 1 ✅ | **Wave 9** — gate `marshlands` and `coal_deposits` by terrain. **SIGNED 2026-08-07.** | Changed every future seed's economy (dossier, PDF, journal, economics tab), un-revertable for campaigns generated in the window. | ~~SIGN.~~ **ACCEPTED by the owner.** Measured 47→30 alone, 47→13 with Wave 4; the only fix that makes the *dossier* coherent, not just the map, reusing the `fishing_grounds` machinery. Now an execution item, no longer a question. |
| 2 | **Option D** — export-implied water becomes a bounded local feature (millpond/spring/cistern/wadi); export-implied slope becomes a quarry scar; provenance names the export that justified it. | New capability, not repair. | **DEFER to after the tail.** It is the only option that preserves the design's actual intent ("the economy should be visible in the stone") while keeping the site a zoom-in of the realm — but it is a feature, and TUNING IS LAST. |
| 3 | **The `coast` arm** — `sm1-8` (town/hills) and `sm1-17` (town/forest) resolve `siteKind='coast'` on non-coastal biomes via `water:true` + `tradeRouteAccess:'coastal'`. A guard here would move 2/20 golden configs and re-mint five manifests. | Golden churn on the shared v2 corpus + a judgment about whether a trade lane may override a biome. | **ACCEPT as-is.** A declared coastal trade lane is a dossier fact, not an export accident; the realm-coherence law licenses lane-derived water. Record the acceptance so it is not re-found. |
| 4 | **Make `bankable` fail the gate** (or assert `bankable` is empty in the walker test). | Machinery-vs-document call under the hazard-conversion law; changes gate behaviour for every lane. | **SIGN.** Today a landed fix's ceiling stands forever while the gate prints the words and returns 0 — this is exactly the PARTIAL status that hides. Pair it with a `--bank` flag so the cure does not push people toward `--write`. |
| 5 | **FYI, not a gate** — Wave 6 extends `substrateSignatureOf` rather than bumping `SUBSTRATE_VERSION`. One-time re-derivation of every canonized campaign's persisted substrate; revertable in both directions. The version-bump alternative is **not** revertable (reverted code would reuse rows written under the bumped sig). | Persisted `worldState`. | **Proceed with the signature extension.** Flagging the one-time shift per the behaviour-shift rule. |
