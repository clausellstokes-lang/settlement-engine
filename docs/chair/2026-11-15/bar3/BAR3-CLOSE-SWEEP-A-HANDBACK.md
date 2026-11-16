# BAR3-CLOSE-SWEEP-A · hand-back (2026-11-15)

A repair seat of the close of the content round BAR3. It worked from the joined line's tip 98363cb84 (`lane/join-2026-11-14`) on its own branch `lane/bar3-close-sweep-a-2026-11-15`, in a scratch worktree with its own `npm ci`. Its brief was the five composed or un-re-keyed reds in four test files named in `docs/chair/2026-11-14/JOIN-14-HANDBACK.md` §3 and §4. One commit a letter.

## The table

| file | arm | cause (branches, commits) | cure | before → after (the file alone) |
|---|---|---|---|---|
| `tests/components/bar3LabelWords2.test.jsx` | L3 NOT, `r2s-under_siege-village-0` tavern_social ("operational", not "impaired") | labels' L3 (`economicsCrisisMarks.js :: chainCardUnderSiege`, read "stopped" only) × services' SV7/SV7b/SV8 (`crisisStoppedRow.js`, 0eb81fe2c: a house with a row on offer reads `under_siege:curtailed`) | **SW1** in the labels' leaf `src/domain/display/economicsCrisisMarks.js`: a house carries the siege's mark when the leaf's `rowStoppedBy` gives `under_siege` OR its partial kind, read through the leaf's own `crisisOfMarkKind` (called, no table copied). The guard is green as written (not re-keyed) | 1 failed / 4 passed (5) → 5 passed (5) |
| `tests/generators/bar3People2Rows.test.js` | LIVENESS ANCHOR `r2s-famine-village-3`; KEEP `r2r-village-24` | places b7bf413a7 (H1: "made worse by decisions taken by {faction}", declared in BAR3-PLACES-HANDBACK's table of new words, r2r-village-24 among its towns) × people a2f332ec (P4: the `{faction}` slot reads `powerSentenceName`) | re-keyed in the file's form beside a dated note: refused "decisions taken by Military/Guard", anchor "decisions taken by The Guard"; KEEP "decisions taken by Elder Council". Both cures show; the law (a secret names a power by its sentence name, never the roster label) holds | 2 failed / 11 passed (13) → 13 passed (13) |
| `tests/generators/power/conflictLadderReadsRoster.test.js` | the twins, `r2r-town-4` | powers c0d013098, declared cure C27440 (`factionDynamics.js :: boycottReadsRelation`: the boycott's twin where the seat's relation row with a merchant power is settled) | the twin row reads a new literal `LEVIES_SETTLED` ("…has been debating market levies for three months. The merchants have argued against every one of them, and nothing has been settled yet."). The guard towns' `LEVIES` is untouched. Law holds: the town has a market (`factsOf(s).market` true), Town Mayor ↔ Merchant Guilds `subordinate`, `stable`, and the line naming the market prints | 1 failed / 1 passed (2) → 2 passed (2) |
| `tests/generators/power/sovereignNoCrown.test.js` | `rw3-city-wartime-2` | powers c0d013098, declared cure C9941 (`stressFactions.js :: WARTIME_SOVEREIGN_MILITARY`, no rank) | LAW FIRST: the city (a City-state government) prints "…Authority over the war flows through military channels now."; no power's line and no account of the war names crown, kingdom, king or royal (probe, 0 hits). Re-keyed by identity beside a dated note | 1 failed / 1 passed (2) → 2 passed (2) |
| `tests/lint/domainAnyCastBaseline.test.js` (e, sent by the chair 23:12 UTC) | "any-cast debt grew": `src/domain/display/economicsCrisisMarks.js`, 3 any-holes, allowance 0 | labels db78c76bd (`fullCardWordUnderSiege`: `/** @type {any} */` on the town for `resourceWorkReading` and on the chain and town for `chainAsShown`) | CURED AT THE CAUSE: the town is cast to `validationOnPage.js`'s own `PageRecord` typedef; the working chain is read once as the `Record<string, unknown>` `chainCardUnderSiege` already takes, and `chainAsShown` accepts it too (its record parameter is `unknown`, so the town needs no cast). No allowance; the baseline is untouched | 3 any in the file → 0; the test 19 passed (19) after |
| `tests/generators/bar3PlacesRows.test.js` (f, sent by the chair 23:12 UTC) | [21] "C18651 no power over the seat", r2r-town-8 (the anchor /has a say the official seat must reck…/ gone) | defecon 7a4b48a84, declared cure (BAR3-DEFECON-HANDBACK row `flags.theocraticEconomy`, `settleTheocraticFlag`): the flag stands only where the tithes row is the income record's largest and a religious power stands Strong or Dominant. In r2r-town-8 the tithes row is 12% and the shadow economy 33%, so the whole note is withdrawn where its claim is false (not lost where true) | re-keyed by identity beside a dated note to **r2r-town-54**, the one town of the 720 that still prints the note (BAR3-DEFECON-2-HANDBACK: 16 → 1; my scan of the 720 at 98363cb84 finds exactly that one). It has a Strong Feudal Appointee beside Strong Religious Authorities, the anchor prints there, and the refused claim of power over the seat prints nowhere in the 720. The row's law holds | 1 failed / 10 passed (11) → 11 passed (11) |
| `tests/build/bootSmoke.test.js` via `npm run verify:dist` (g, sent by the chair 00:40 UTC 2026-11-16; red at 98363cb84 itself) | `scripts/boot-smoke.mjs` STAGE 1: "the chunk graph has a CYCLE": coherence-lazy ↔ data-lazy (and the build's own "Circular chunk: coherence-lazy -> data-lazy -> coherence-lazy") | people aef83b4b5 (BAR3-PEOPLE batch 1): `src/data/npcData.js` (data-lazy) imports `sharesPower` from `src/domain/facts/sharedPower.js`, which was excised by TAIL-TIES-8 (`ENGINE_SHARED_DOMAIN_EXCISIONS`) and so rode coherence-lazy with `factsOf.js`; coherence-lazy already imports data-lazy | `vite.config.js` ONLY, in its own form: the leaf leaves the excision list and STAYS in engine-core, as `facts/textOf.js` does, with a dated note naming aef83b4b5. The leaf has no `import` line. Its three importers (`generators/people/ties.js`, `data/npcData.js`, `domain/facts/factsOf.js`; `factVocabulary.js` does not import it) reach a sink in eager engine-core, so there is no edge back. No guard names the leaf by list. Nothing under src/ | boot-smoke stage 1 RED (9,219 static chunk edges) → PASS at every stage (9,186 edges, 604/604 chunks initialised, shell mounted); `bootSmoke` under VERIFY_DIST 10 passed, 1 skipped (the engine-remote-dist stage, run only under VERIFY_ENGINE_REMOTE_DIST=1) |

Commits: (a) 049e5be5, (b) b6ea79f9, (c) 5dd6e180, (d) dc7e5b1a, (e) c26bb240d, (f) e93af30f2, SW1b 640266f64, (g) the commit that carries this row.

## SW1 (copied as given; vetoable by the owner)

> THE CHAIR'S RULING SW1 (2026-11-15 22:55 UTC; vetoable by the owner): A CHAIN IS NOT "operational" WHILE EVERY HOUSE OF IT CARRIES THE CRISIS'S MARK: the chain's working word reads "impaired" where every house of the chain is STOPPED OR CURTAILED by the crisis, read from THE ONE LEAF the houses' marks come from (`src/domain/display/crisisStoppedRow.js`: CALL it; do not copy its table).

**The measure.** The leaf was run over the census 720 (r2r-{size}-0..59; r2s-{15 crises}-{size}-0..3, the census's seed configuration) at 98363cb84 and again after the cure. The count is chain cards under a siege that print a working word (running, operational, entrepôt) while every live house carries the siege's mark (stopped or curtailed):
- before: **1**, after: **0**;
- every chain card of the 720 compared, before against after: **1 of 9,586 moved**, `r2s-under_siege-village-0::tavern_social` operational → impaired. Nothing else moved.
- the Resources tab's `fullCardWordUnderSiege`, the cured function's only other caller: in that town, the same words before and after.

**The new word's towns (the veto list): ONE town, not three.** `r2s-under_siege-village-0`: its tavern trade now reads "Impaired" beside its "Travelers' inn", which the siege curtails. The brief expected three; the measure finds one.

## SW1b (copied as given; vetoable by the owner)

> RULING SW1b (the chair, 2026-11-15 23:41 UTC; vetoable): SW1 HOLDS FOR EVERY CRISIS THAT MARKS HOUSES, not the siege alone: the 14 chain cards in 11 towns that read a working word under an outbreak or a famine while every live house of the chain carries THAT crisis's mark (stopped or curtailed, by the one leaf) print "impaired" too.

**The cure.** `economicsCrisisMarks.js :: chainCardUnderCrisis`, the general form, sits beside the siege's function. For each crisis in force that marks rows (`stoppingCrisesOf`), the leaf's `rowStoppedBy` is asked of that crisis alone, and its partial kind is read through `crisisOfMarkKind`. No table is copied. The siege's own chain mark (L3) is kept. `chainCardUnderSiege`, which the Economics and Resources tabs call, is now its caller, so no component changed. The leaf CAN tell one crisis's mark from another's for a house: asked of one crisis, it answers only for that crisis.

**The measure** (the 720 at 661f08aee against the cure, every card compared): cards whose every live house carries one crisis's mark and that print a working word: **14 cards in 11 towns before, 0 after**. **14 of 9,586 chain cards moved, exactly those 14.** None of the 990 Resources-tab cards (`fullCardWordUnderSiege`) moved. A card with one unmarked house keeps its word: 14 such cards are in the 720 (e.g. r2s-famine-city-3 wine_spirits, its Vintner unmarked).

**The guard** (`bar3LabelWords2.test.jsx`, its own form; arm "SW1b NOT"). Cured rows: r2s-plague_onset-village-3 tavern_social operational → impaired, and r2s-famine-thorp-3 forage running → impaired. KEEP rows: r2s-famine-city-3 wine_spirits entrepot, and r2s-plague_onset-city-1 tavern_social operational, each with an unmarked house. The arm is red at 661f08aee (2 of 2) and green after.

**The veto list: the new word "impaired" under each crisis.**
- Under the siege (SW1): **r2s-under_siege-village-0** (tavern_social). The only one.
- Under an outbreak (all 5): **r2s-plague_onset-village-3** (tavern_social), **r2s-plague_onset-city-0** (warehouse_logistics, caravan_trade, crossroads_trade, camel_caravan), **r2s-plague_onset-metropolis-3** (warehouse_logistics), r2s-plague_onset-town-1 (crossroads_trade), r2s-plague_onset-city-3 (tavern_social).
- Under a famine (all 6): **r2s-famine-thorp-3** (forage), **r2s-famine-town-0** (wine_spirits), **r2r-thorp-38** (forage), r2s-famine-town-1 (wine_spirits), r2s-succession_void-thorp-0 (forage), r2s-wartime-hamlet-3 (forage).

The three named first under each crisis are the veto list asked for; the rest complete the measure.

## Stopped on / for the chair (nothing changed for these)

- **Outside the siege (asked, then RULED: SW1b).** The labels' leaf read the siege alone, by L3's own scope, and this seat first kept that scope. Under the outbreak or the famine, **14 chain cards in 11 towns** of the 720 print a working word while every live house carries that crisis's mark: `plague_onset` "Curtailed" (r2s-plague_onset-village-3 tavern_social; -town-1 crossroads_trade; -city-0 warehouse_logistics, caravan_trade, crossroads_trade, camel_caravan; -city-3 tavern_social; -metropolis-3 warehouse_logistics) and `famine` "Scarce" (r2r-thorp-38, r2s-famine-thorp-3, r2s-succession_void-thorp-0 and r2s-wartime-hamlet-3 forage; r2s-famine-town-0 and -town-1 wine_spirits). The chair ruled SW1b at 23:41 UTC; see the SW1b section. Cured there.

## The closing battery (each alone, at the SW1b commit)

Each run went through `sh scripts/gate-tail.sh` (shared tier, `--maxWorkers=2`), never a pipe.

| run | result |
|---|---|
| (a) `bar3LabelWords2` (with SW1b's arm) | 6 passed (6) |
| (b) `bar3People2Rows` | 13 passed (13) |
| (c) `conflictLadderReadsRoster` | 2 passed (2) |
| (d) `sovereignNoCrown` | 2 passed (2) |
| (e) `domainAnyCastBaseline` | 19 passed (19) |
| (f) `bar3PlacesRows` | 11 passed (11) |
| guards `bar3LabelWords` / `2` / `3` | 3 / 6 / 3 passed |
| guards `bar3ServicesRows`, `crisisStoppedRows` | 8 / 11 passed |
| `tests/generators/power` (the filter takes in `powerEconomyFreshness`) | 160 passed, 1 failed: `powerEconomyFreshness` A4, the golden arm allowed red until the round's door |
| `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors` walkers | 9 / 9 / 6 passed |
| `factLayers`, `layerBoundaries`, `engineCoreLazyEdge`, `chainPrintSites` | 15 / 8 / 3 / 6 passed |
| `sourceCitationIntegrity`, `ledgerCitationIntegrity` (local `review-fixes-2026-07-08` fetched) | 18 / 10 passed |
| `npx eslint` on the six files changed | 0 |
| `npm run typecheck:domain:strict` | 0 (1113, ceiling 1113) |
| `npm run typecheck:ratchet` | 0 (167, ceiling 167) |

## (g) the receipt (each run to a file through `sh scripts/gate-tail.sh`; the build output removed afterwards)

- `npm run build`: exit 0, and no "Circular chunk" warning, which the base build printed. Chunks, base 640266f64 → cure: engine-core 267.19 → 267.70 kB; coherence-lazy 180.80 → 180.31 kB; data-lazy 1,695.55 → 1,695.51 kB; engine-core-lazy 25.88 kB unchanged.
- `npm run verify:dist` WHOLE: red on 5 files, the same 5 red at the base (built and run in a worktree at 640266f64):
  - `vendorPdfLazy`, 3 of 55 (a CEILING, the doors' seat's 1g; named, not touched):
    - first-paint static closure: base 1,131,858 B → cure **1,132,308 B** (+450), budget 1,131,667;
    - first-paint gzip: 360,582 → **360,744 B** (+162), budget 360,516;
    - the engine chunk: 878,204 B both, ceiling 872,758.

    The cure's own cost is the leaf's few hundred bytes in eager engine-core, on a ceiling already exceeded at the base.
  - `generationWorkerLazy`, 1 of 11 (a CEILING): 2,322,103 B both, ceiling 2,312,179.
  - `engineBundleReplay` 3 of 7, `engineServiceCore` 1 of 1, `engineServiceStoreParity` 4 of 4: the committed edge bundle (`supabase/functions/_shared/engineBundle.js`, built by `scripts/build-edge-shared.mjs`, which does not read `vite.config.js`) is stale against the round's src. That is a stored figure (a bundle), the doors' seat's. The base reds are the same.
- `tests/architecture/engineCoreLazyEdge.test.js`: plain 3 passed; under VERIFY_DIST=1 3 passed.
- `tests/build/` each file alone under VERIFY_DIST=1: 62 of 67 green; the five above red.
- `tests/architecture/` whole: 344 passed. `npx eslint vite.config.js`: 0.

## Not touched

Every stored figure (goldens, digests, counts, register rows, bundles) is the doors' seat's (BAR3-CLOSE-DOORS-1). No src file other than the one display leaf (a, e, SW1b) changed; (g) changed `vite.config.js` alone.
