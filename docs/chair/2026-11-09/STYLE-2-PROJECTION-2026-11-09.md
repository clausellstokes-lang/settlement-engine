# STYLE-2-PROJECTION (SW-B7b) — the lane record, 2026-11-09

**Seat:** SW-B7b PROJECTION, an Opus 5.5 build seat, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). Session `session_01FbPLbdv5BoGUynY8ainpA5`.
**Lane:** `lane/style-2-projection-2026-11-09`, cut from MERGE-TRAIN's final tip `bd07005b9` (verified as `origin/lane/integration-2026-11-07`).
**The row:** STYLE-RULINGS-2 B10(a), as written in SW-B7's row of `BRIEF-STYLE-2-WAVE-2026-11-09.md`.

## 0. Outcome (the lane stop, rule 14: pushed what is cured, the remainder BY FILE below)

- **Two STOPs, both ruled.** (1) 12:4x: B10(a) as written met two of the owner's carve-outs. The first is the paid-surface gate (§885.3, with §892's O2GATE car: `publicDossier ⇒ no state prose`). The only product `playerView` is `PublicDossierView.jsx`, which has `readOnly` and no `saveId`, so `OutputContainer.jsx :: publicDossier` is true there, and every desk returns SILENT by design. The second is the seed posture (099/121): every desk draws on `String(s._seed ?? s.id)`, so keeping `_seed` public would let anyone regenerate the private town. The ruling: the seed stays stripped, and "the seed kept for the draw" is WITHDRAWN. (2) 12:5x, on the owner's word: the gate is LIFTED as a TEXT PROJECTION (§1). The shape STOP (13:0x) was sent with the default this lane built.
- **Landed, two causes:** `b58d7b659`, the public crisis card's bare "Hook:" (§2); `047f16047`, the projection's SHAPE, which lights nothing (§2).
- **The four legacy fallbacks are LIVE until the desks ship their text** (§3). Their removal is each desk's own cause in the remainder.
- **The players' page** (SW-B7a's `PartyLinkView.jsx`, closed at `17d78d842`, merged by STYLE-2-MERGE) mounts `OutputContainer` with `readOnly` and the player view, so it is `publicDossier` exactly as the gallery page is. It rides the same projection: when a desk's public branch reads `publicProse`, both pages print it, with no change to `PartyLinkView.jsx`.

## 1. The mechanism chosen, and why (the measure written as "If the owner lifts §885.3")

**THE RULING (the chair, 12:5x, on the owner's word "I leave all judgement to you for any decision you deferred to me since my last prompt"):** §885.3's gate is LIFTED for the gallery page and the players' link, as a TEXT PROJECTION. The gate lift and the projection are ONE cause. The seed stays stripped. **CHOSEN:** a JSON field `data.publicProse` (no column), migration 210 adding one allowlist token, and the save path's one row builder as the hook (the STOP sent 13:0x with this default). The two alternatives were each measured and refused. Lighting the desk on the projection: 386 lines differ. Re-keying the draw to the public `id`: 166 lines still differ, and the owner view re-draws. **THE LAW PINNED:** public = the owner's PLAYER view minus the veiled rows, byte for byte. The owner's DM view is not the target, because the player audience has its own authored pools: on the twelve, 1–3 economics or power lines per town draw a different sentence for the player than for the DM (for example, the DM reads "There is some thieving and some selling without a licence. Every hamlet this size has both."; the player reads "Some petty theft goes on here, and some trading without a licence. It is a nuisance, nothing more.").

The chair asked what a TEXT projection would take: the composed blocks computed owner-side and shipped as strings in the public and party record, with the veiled rows removed.

**What would be shipped, measured.** For each of the twelve, the lane's scratch `textproj.mjs` boots the soak's own render harness (`renderHarness.mjs :: bootHarness`). It renders the player-visible tabs (all but Plot Hooks, Guidance, Substrate, Institutions and Traditions) three ways: A, the owner's record with the player audience and the desk lit; B, the public page today (the projection, `publicDossier`); C, the projection with the desk lit. The lines of six or more words that are in A and not in B are what a text projection must carry. The NPC and relationship lines among them are the veil's private rows, not corpus, and are excluded from the corpus bytes.

| town | corpus lines (A−B) | corpus bytes (UTF-8) | private-row bytes (excluded) | public record bytes | corpus / record |
|---|---|---|---|---|---|
| soak1k-0 Albamunicipium | 28 | 4,195 | 0 | 24,347 | 17.2% |
| soak1k-1 Lundey | 30 | 4,630 | 0 | 44,153 | 10.5% |
| soak1k-2 Copanucan | 30 | 4,704 | 0 | 40,285 | 11.7% |
| soak1k-3 Al-karez | 35 | 5,765 | 757 | 130,462 | 4.4% |
| soak1k-4 Portaminus | 37 | 6,465 | 491 | 164,092 | 3.9% |
| soak1k-5 Suryanagar | 39 | 6,824 | 1,696 | 263,848 | 2.6% |
| soak1k-6 Becanchihua | 29 | 4,326 | 0 | 27,031 | 16.0% |
| soak1k-7 Haifeng | 29 | 4,229 | 0 | 47,191 | 9.0% |
| soak1k-8 Achileia | 30 | 4,634 | 0 | 53,965 | 8.6% |
| soak1k-9 Shangjin | 35 | 5,289 | 1,370 | 107,923 | 4.9% |
| soak1k-10 Olympambelos | 37 | 7,118 | 637 | 237,487 | 3.0% |
| soak1k-11 Gankhuushari | 31 | 6,012 | 645 | 269,066 | 2.2% |

The corpus per town is 4.2–7.1 KB (mean 5.3 KB; 64.2 KB over the twelve), spread over Overview 2–6 lines, Economics 5–6, Power 4–10, Defense 8–11, and History, Resources, Viability, Daily Life, Magic and Faith 1–2 each. ("corpus lines" here is A−B less the NPC and relationship rows.)

**Why lighting the desk on the projection alone would not do (G5, measured).** 386 owner lines over the twelve differ from the same desk run on the projection (A−C). Of these, **228 are the seed alone**: rendering the owner's record with `_seed` removed (keyed on `id`) reproduces them. **166 follow from the fields the projection strips**: about 3 per small town, and up to 41 in the large towns, mostly the NPC and tie rows. So the audit's PLAUSIBLE G5 cause is CONFIRMED and split: about 60% seed, 40% stripped fields.

**Which record carries the strings.** The gallery serves the LIVE row, not a snapshot. `get_gallery_dossier` (147, 093's model) projects `settlements.data`, or `ai_data.aiSettlement` when `gallery_share_narrated` is on, through `_gallery_sanitize_public_json` / `_gallery_dm_full_json`, then `_gallery_apply_member_overrides`. The party link's `get_unlisted_dossier` reads the same row (208 makes it build `dossier` exactly as 147 builds `data`). So the strings would be a field of `settlements.data`, written owner-side at every save. Two consequences: (1) **a persisted shape change** (the owner's; launch shape, no preserved data); (2) **staleness**: a town edited or advanced after its last save prints old strings until the next save, and the narrated base (`ai_data.aiSettlement`) needs the same field or its pages fall back to silence.

**Whether a migration FILE is needed: yes, migration 210 (never applied).** The client's `PUBLIC_TOPLEVEL_KEYS` and the SQL `public_toplevel` array in `_gallery_sanitize_public_json` are pinned character-identical (`tests/security/gallerySanitizeAllowlist.contract.test.js`), so a new top-level key travels only with 210. The key must avoid every `PRIVATE_KEY_RE` token (`hook`, `notes`, `seed`, `chronicle`, `dm`, …), so a name such as `publicProse` would pass. `_gallery_world_snapshot_is_safe` must accept it, and `gallerySanitize.pglite` pins client = server.

**The veil on strings.** Hidden power names are masked string-wise already (`publicSafe.js :: maskHiddenNames` and its SQL twin), so masked names survive. A veiled BLOCK (`galleryVeil.js` addresses such as `block:defense.criminalStructure`) can be dropped only if each string is keyed by its block address, so `applyVeil` and the server's overrides can remove it. The owner's later veil toggles then work without a re-save. Composing per address with the `player` audience keeps DM-only lines out at the source.

**Readers that would change.** On the write side: the save path (`src/lib/saves.js` / `saveAdmission.js`) and the desk readers (`generalDeskRead.js`, `economyDeskRead.js`, `WarFaithDesk.jsx`, `PowerTab.jsx`, `DefenseTab.jsx`, `OverviewTab.jsx`'s stressor desk, `MagicTab.jsx`, `ViabilityTab.jsx`), each gaining a "read the shipped string when `publicDossier`" branch in place of SILENT. On the projection: `publicSafe.js` (allowlist), `galleryVeil.js` (per-address drop), and `dossierSearch.js` (search over the shipped strings). The mount registry's ARM 2 (one caller per desk) must admit the shipped-string read as the same position. The four fallbacks of §3 then become dead and leave, one cause each.

**The cheaper alternative, for the owner's comparison.** Re-key every desk's draw from `_seed ?? id` to the public `id` (`normalizeSettlement.js :: idFromSeed`, a one-way FNV of the seed, already public). Then lighting the desk on the projection reproduces 228 of the 386 differing lines with no migration and no stored strings. The other 166 still differ, and the owner view's text re-draws once (an UNSIGNED cause on every desk-bearing surface). This route still needs §885.3 lifted.

## 2. The causes landed

| commit | file | OLD | NEW | red-first | goldens |
|---|---|---|---|---|---|
| `b58d7b659` | `src/components/new/tabs/OverviewTab.jsx`, the `!crisisDoor` crisis card | "Hook: " + `crisisHookFor(r, v)`, always | the hook is read once; its paragraph prints only when the line is not empty | `tests/components/publicCrisisHookLabel.test.jsx`: the public towns soak1k-0 and soak1k-4 red at the parent (1 and 2 bare labels), green here; the DM-full control green on both sides | none: the owner view takes the pointer branch (`crisisDoor`) and never reaches this card |
| `047f16047` | `supabase/migrations/210_public_prose_text_projection.sql` (a FILE, never applied), `src/domain/display/publicSafe.js :: PUBLIC_TOPLEVEL_KEYS` | no `publicProse` key on any public projection | 207's `_gallery_sanitize_public_json` restated verbatim plus ONE token, 'publicProse', in `public_toplevel`; the client twin gains the same; deeper keys keep the denylist | the pins re-keyed by cause: `gallerySanitizeAllowlist.contract` (the canonical set) and `writerReach.walker`'s unwritten-allowlist report (+ `publicProse on settlement`, the shape before its writer) | none; it lights nothing |

**The measure (12 fixture towns, soak1k-0..11, at `bd07005b9`):** 12 of 12 public crisis entries, in 11 towns, printed a bare "Hook:"; the owner view 0 of 12. The cause is that `toPublicSafe` strips `crisisHook` (the `hook` token of `PRIVATE_KEY_RE`). On 300 soak towns: 330 of 330 public crisis entries were bare; after the cure, 0 print the label. The DM-full share (`gallery_share_dm`) keeps the hook, and its label stands over it.

No new prose was written, so the census law has nothing to strike.

## 3. The four legacy fallbacks, by name, under the gate

Reach is measured on the public projection, `projectShareVeil(toPublicSafe(s))`, over soak1k-0..299 (300 towns). This is the lane's scratch `reach.mjs`, which uses the tabs' own predicates.

| fallback | its last caller (the public position) | public reach (300) | verdict |
|---|---|---|---|
| `prosperity.js :: deriveEconomicSituationDesc` → `economicState.situationDesc` (the famine line "…in a technical sense…") | `EconomicsGlance.jsx` `headerProse = header?.sentence \|\| eco.situationDesc` | 300 (famine variant 27) | LIVE: the Economics lead wherever DS-ECO-1 is silent (every public page) |
| `stressGenerator.js` summary + the "Hook:" label | `OverviewTab.jsx`, the `!crisisDoor` crisis card | 330 entries | LIVE: the summary stays; the empty label is CURED (§2) |
| `geographyData.js`'s rated line → `resourceAnalysis.strategicValue` ("High - defensible position…") | `ResourcesTab.jsx` `{!deskWorth && res.strategicValue && …}` | 300 | LIVE: it stands where DS-ECO-11 is silent |
| `DefenseTab.jsx`'s static "No organized criminal infrastructure detected…" | `DefenseTab.jsx`, the T2-20 block (`!crimeVeiled && !crimStructure && criminalLines.length===0 && !criminalDenialListed`) | 61 (first at soak1k-6) | LIVE: on public, `criminalLines` is always empty (the desk is silent) |

None is dead, so none is removed: on the chair's rule a fallback comes out only where the gate makes it dead. Once the owner lifts §885.3 they become dead, and each one's removal is one cause, red-first: "the public page never reaches it" planted on the lit projection. The machinery wording of the rated line and the static line ("High -", "detected", "infrastructure") belongs to their writers' lanes, not to the projection.

## 4. Gates and receipts

- **`b58d7b659`:** the pin is red-first (2 of 3 red at the parent). The 44 suites that name `OverviewTab` plus the pin: 621/622. The one red is `readerValidationOnPage` soak1k-24 (the verdict count); it is red at the parent with the edit withdrawn, so it is inherited. eslint is clean. `tsc --noEmit` gives 167, the base figure, with none in the touched files.
- **`047f16047`:** `tests/security` (the whole directory) plus the writer-reach walker: 1,911 passed, 1 skipped, 1 red. The red is `migrationSequenceAll`'s GAPLESS arm ("migration 208 present exactly once"). 208 is on `lane/style-2-party-link-2026-11-09` and 209 on `lane/tier-parity-fix-2026-11-09`, both closed and merged by STYLE-2-MERGE, so the chain closes at the merge (a DECLARED composition red). The same suite's parse arm applies 210 in sequence green. eslint is clean.
- **The three record walkers** (`sourceCitationIntegrity`, `ledgerCitationIntegrity` with `review-fixes-2026-07-08` fetched, `testRatchet`): 3 files, 111 tests green before the push. The roster: `dated` 189 → 190 through its door (`_rosterGrowth2026-11-09-style-2-projection`, the walker header line).
- **The deploy runbook:** `testRatchet`'s owner-gated pin and `deployRunbookFreshness` require `docs/DEPLOY.md` to name the migration head. Its head line is now 210, with one paragraph in the deploy step's terms (additive; 208 and 209 first; one save per shared town is owed, named to the owner and never scripted). FOR STYLE-2-MERGE: SW-B7a's 208 and TIER-PARITY-FIX's 209 lanes edit the same head line, so take 210's line at the last point.
- **Golden surfaces:** none moved by either cause (no generator file; the owner view never reaches the cured branch). The public snapshot does not move yet, because nothing is lit.
- **The full vitest:** it was started at the base in the background early, but did not conclude inside the lane, and it overlapped the first edit, so it is not counted. STYLE-2-MERGE's full run in a clean worktree is the receipt.
- **The 1,000:** not run. Neither cause is frame-bearing: no pool text changes, and the dark "Hook:" label is a chrome label, not a frame.

## 5. CONFIRMED against PLAUSIBLE

CONFIRMED by executed measurement: the bare "Hook:" (12/12 and 330/330) and its cure; the four fallbacks' public reach; the corpus bytes per town; G5's split, 228 seed and 166 field. PLAUSIBLE: the list of readers a text projection would change (read from the code, not built), and the staleness behaviour (by reading 147/208, not by a pglite run).

## What stays — BY FILE, for the next seat (the lane stop, rule 14)

The design is fixed by the chair's 12:5x ruling and the 13:0x shape default. It is ONE cause per DESK FAMILY: each lights the public branch and ships its text in the same commit, never a seedless re-draw.

**THE SHAPE STOP, RULED (the chair, 12:5x; delivered after the hand-back):** the default is accepted whole. The law is public = the owner's PLAYER-audience view minus the veiled rows, byte for byte (the party link and the gallery are both player audiences). The shape is `data.publicProse = {v, blocks: {address: sentence}}`, stamped by `saves.js :: mutationRow`, the one row builder, so every persisting path carries it. If the composer's async load cannot sit inside the sync builder, the await goes at its callers and the builder still writes the field; that is a STOP to the chair if it cannot. It is also stamped into `ai_data.aiSettlement`. Migration 210 is the one token. The composer is lazy, and its bytes are measured and written. **Two rules to pin, red-first:** (1) an ABSENT `publicProse` (a save not yet re-published) renders every block SILENT, never a seedless re-draw, so no wrong text ever prints; the backfill is the owner's next save or open through the row builder, never a data migration; (2) `v` is checked on read, and a mismatched version is SILENT too. The second seat continues on THIS lane.

1. **`src/domain/display/publicProse.js` (NEW, a leaf):** `PUBLIC_PROSE_VERSION`, and `publicProseOf(settlement, site)`, which returns the shipped desk object for a call site or null. Sites are keyed by the call site, not the desk, because the hosts pass different arguments: `economy:economics`, `economy:services`, `economy:resources`, `economy:daily_life`, `general:<tab>`, `stressors:overview`, `defense:state`, `defense:criminal`, `power:desk`, `warFaith:<tab>`, `magic`, `viability`. Keep each rung's `glance`, `sentence` and `detail` (and `provenance` if a tab renders it). Name keys away from every `PRIVATE_KEY_RE` token (`hook`, `chronicle`, `notes`, `seed`, `dm`, …) or they are stripped.
2. **`src/components/new/publicProseCompose.js` (NEW, loaded lazily so the zero-slack ceiling holds):** `composePublicProse(settlement)` calls each site's ONE caller with `playerView: true, publicDossier: false` on the owner's record, so the seed is read here and never shipped. Each host's computed arguments are EXTRACTED from the tab into an exported pure helper that the tab and this composer both call (never a second derivation): `EconomicsTab.jsx`'s `fbal` / `granary` / `flowDrift`; `ServicesTab.jsx`'s `impairedInstitution` (its `computeChainSets` read); `PowerTab.jsx`'s `deskReadings`; `WarFaithDesk.jsx`'s `readings`; `DefenseTab.jsx`'s `deskOpts` and `crimStructure`; `OverviewTab.jsx`'s `stresses` and `populationTrendBand`.
3. **The readers' public branches (SILENT retired, the paid-gate idiom kept IN the read's statement for the mount registry's ARM 3):** `src/components/new/economyDeskRead.js`, `src/components/new/generalDeskRead.js`, `src/components/new/tabs/WarFaithDesk.jsx`, and the direct calls in `OverviewTab.jsx` (`stressorProse`), `DefenseTab.jsx` (`stateProse`, `criminalProse`) and `PowerTab.jsx` (`powerStateProse`). Each becomes `publicDossier ? publicProseOf(r, site) ?? SILENT : <desk>(…)`. `tests/lint/dossierMountRegistry.walker.test.js` ARM 2/3 is re-keyed by cause if it reads the statement.
4. **The writer:** `src/lib/saves.js`, at the payload boundary of `supabaseSave` / `supabaseUpsert` / `supabaseUpdate` (async; `mutationRow` is sync, so the lazy import is awaited before it). It stamps `data.publicProse = composePublicProse(settlement)` on every save, and the same into `ai_data.aiSettlement` when that object exists, so a narrated share keeps it. `writerReach.walker`'s `publicProse on settlement` row then leaves the unwritten report (re-keyed by cause), and the writer-reach register moves through its door.
5. **The veil on strings:** `src/domain/display/galleryVeil.js :: applyVeil` drops a site's rung where its block address is hidden (map each site's rungs to the `block:` addresses `isHideable` knows). Hidden power names are masked already by `publicSafe.js :: maskHiddenNames` over the whole projection, and by the SQL's text-level twin.
6. **The four fallbacks leave, each in its desk's cause:** `EconomicsGlance.jsx`'s `eco.situationDesc` fallback (with the economy desk), `ResourcesTab.jsx`'s `res.strategicValue` (with the economy desk, DS-ECO-11), `DefenseTab.jsx`'s T2-20 static line (with the defense desk), and the Overview crisis card's `v.summary` beside the stressor desk (with the stressors desk). Each is red-first: "the public page never reaches it" on a town whose `publicProse` is stamped.
7. **`src/domain/dossier/dossierSearch.js`:** the player-view enumeration indexes the shipped strings (`publicProse`) so a search finds what the page prints.
8. **The red-first, on the twelve:** for each site, the text of the public render (`projectShareVeil(toPublicSafe(stamped))`, `publicDossier`) equals the owner's player-view render, minus the veiled rows, byte for byte. The leak arm: no `npcs[].secret` or `goal` substring, no hidden power name, and no `_seed` in any projected record (PUBLIC-VEIL's law; extend `tests/security/publicPayloadVeilTotality.test.js`). The bytes per town are measured again (§1's table: 4.2–7.1 KB).
9. **The deploy step's terms (for the record at the deploy):** the owner runs `supabase db push` with 208, 209 and 210 in order. The public page lights for a town at its first save after the client ships. A town never re-saved stays silent where its desk is silent, and keeps the fallbacks only until its desk's cause lands. So one save per shared town is owed; name it to the owner, and never script it.

## 6. The second seat

**Seat:** SW-B7b PROJECTION, the second seat (session `session_01FbPLbcncw6KYofjRhJYEkC`), on this lane from `e33c77f94`. The lane stop, rule 14: what is landed is pushed; the remainder is listed BY FILE in §6.5.

### 6.1 The causes landed

| commit | cause | sites | public before → after | pins (red at the parent) |
|---|---|---|---|---|
| `4b6d182b0` | items 1–2: `src/domain/display/publicProse.js` (NEW leaf: `PUBLIC_PROSE_VERSION` = `'pp-1'`, a tag, so the tuning register's named-numeric count does not move; `publicProseOf`; `shippedProseOf`, which drops the recorder's `provenance`; `withPublicProse`) and `src/components/new/publicProseCompose.js` (NEW, empty `PUBLIC_PROSE_SITES`, fail-closed per site) | none | lights nothing | `tests/domain/publicProse.test.js`: rule 1 (absent ⇒ null), rule 2 (mismatched `v` ⇒ null), the save never fails on the projection, the site keys survive `toPublicSafe` (the module is absent at the parent) |
| `6c3fbbb32` | the economy desk (items 3, 6, 8): `economyDeskRead.js`'s public branch in the read's own statement (ARM 3); `deskHostArgs.js` (NEW: `flowDriftOf` and `economicsDeskArgs` from EconomicsTab, `impairedInstitutionOf` from ServicesTab, one derivation for the tab and the composer); a per-rung alias (a rung drawn identically at an earlier site is stored once: economy 9.6–13.9 → 5.1–6.6 KB a town); two fallbacks LEFT | `economy:economics`, `economy:services`, `economy:resources`, `economy:daily_life` | SILENT → the owner's player-view draw. The legacy `situationDesc` lead and the rated `strategicValue` line → gone (the owner's reach was measured first: 0 of 300 towns, DM and player, so the owner view does not move) | `tests/components/publicProseEquality.test.jsx`: 49 of 60 red at the parent; rule 1 rendered; the two fallbacks on neither page (24 arms) |
| `a2a2eb54b` | the general desk (items 3, 8): `generalDeskLines`'s public branch at the return (the desk call keeps its own gated statement); each site ships ONE group; `overviewStressesOf` extracted from OverviewTab | `general:overview`, `general:history`, `general:viability`, `general:economics` | SILENT → the owner's player-view lines | the equality suite re-keyed by identity: COMPLETE tabs pin owner − shared = [] (economics, services, resources, daily_life, history); every lit site pins "what the owner's player view prints from it, the shared page prints", with an anti-vacuity arm; 23 of 181 red at the parent |
| `8976fd6e2` | item 8's leak arm (`tests/security/publicPayloadVeilTotality.test.js`) | — | — | a GUARD, green at the parent too: no `_seed` key or value, no `npcs[].secret` or `goal` substring, no hidden power's name in the stamped projection on the twelve; a direct arm shows the whole-projection mask covers `publicProse` |

**Registers through their doors (in `6c3fbbb32`):** `writer-dark-register.mjs` +1 row, `situationDesc on economicState` (engine-internal: `narrativeGenerator.js`'s church-controls read, behind the closure STOP), with the walker's 34 → 35; the writer-reach `--write` re-freeze; prose-numerics: 18 rows re-addressed (line moves only, identities unchanged, regenerated by the test's own scanner); `economyReadModelCoverage`: the two non-rendering modules FROZEN_DEFERRED with their reasons; the wiring census by its writer (`producerIndexFiles` 1314 → 1315, in `4b6d182b0`). The writer-reach register's `publicProse on settlement` row does NOT leave the unwritten report: the register is judged on generated worlds, and the save path is not run there (the same as `neighbourNetwork on settlement`).

**Re-keyed by cause:** `tests/ui/economicsTabFlow.test.js` (3 arms: the legacy lead and the rated line now print on no page); `tests/components/dossierPhoneFloorAllViews.test.jsx`. That walk IS a shared page (`readOnly` with no `saveId`), so its fixture is now stamped as its save stamps it. Its two baselines were re-recorded at each family: Economics 42 → 46 → 47, Daily Life 0 → 1, Overview 11/10 → 12/11, Outlook 2 → 3, History 13 → 15. No token moved, and sub12 stayed zero. The walk found ONE real floor defect: the economics food-security line was set at `FS.sm` with no phone floor. It now takes `proseFontSize`, as the tab's other prose lines do; desktop is unchanged.

**Golden surfaces:** the owner view moved by 0 text. The only owner-visible change is that the food-security line takes the phone prose floor (style, phone only). No generator file was touched, so gm, fence, herald, manifest, witness and pdf do not move. No rendered public snapshot exists in the estate, so none moved; the walk's counts above are this lane's measured public deltas, UNSIGNED, for STYLE-2-MERGE.

### 6.2 The bytes (item 8, against §1's table)

Measured at `a2a2eb54b`: `JSON.stringify(composePublicProse(owner))` on the twelve, with economy and general lit, and the compose time in node.

| town | projection bytes | public record bytes | share | compose | leak |
|---|---|---|---|---|---|
| soak1k-0 Albamunicipium | 5,934 | 24,347 | 24.4% | 23 ms | none |
| soak1k-1 Lundey | 6,419 | 44,153 | 14.5% | 16 ms | none |
| soak1k-2 Copanucan | 6,614 | 40,285 | 16.4% | 18 ms | none |
| soak1k-3 Al-karez | 6,968 | 130,462 | 5.3% | 8 ms | none |
| soak1k-4 Portaminus | 7,172 | 164,092 | 4.4% | 23 ms | none |
| soak1k-5 Suryanagar | 7,042 | 263,848 | 2.7% | 24 ms | none |
| soak1k-6 Becanchihua | 6,156 | 27,031 | 22.8% | 15 ms | none |
| soak1k-7 Haifeng | 6,472 | 47,191 | 13.7% | 13 ms | none |
| soak1k-8 Achileia | 6,440 | 53,965 | 11.9% | 13 ms | none |
| soak1k-9 Shangjin | 6,534 | 107,923 | 6.1% | 9 ms | none |
| soak1k-10 Olympambelos | 7,791 | 237,487 | 3.3% | 37 ms | none |
| soak1k-11 Gankhuushari | 7,428 | 269,066 | 2.8% | 23 ms | none |

The total is 81.0 KB; the mean is 6.7 KB per town (§1 measured the rendered corpus at 4.2–7.1 KB for ALL families). The shipped rung carries each lens's `glance`, `sentence` and `detail`, so it is larger than the lines a page prints. When the defense, power, stressor and faith families land, expect about 10–14 KB a town. If that is too much, the lever is to ship only the rungs a site's mounts draw. That needs the mount registry's depth read in the composer, which is a design call for the chair.

### 6.3 Findings outside the item list (measured on the twelve; for the chair)

1. **`deriveViability`'s verdict variants are seeded** (`dossierViewModel.js :: viabilitySeed`, W2 DEF #36). This is a seeded pick outside every desk, so the shared page draws a different variant than the owner's. It is a thirteenth drawer for the projection, the `viewModel:viability` site, and is not on the item list.
2. **The Overview's culture/"Governed by" line** (`cultureScopeLine` / `governsLine`) reads fields the projection strips. It belongs to the 166 stripped-field class of §1, not to any desk.
3. **The crisis "Hook:" lines** print on the owner's PLAYER view, while the projection strips `crisisHook` (the `hook` denylist token). They count as veiled rows under the law, so the equality pins treat them as stripped, not missing.
4. **Arguments the save boundary cannot hold** (PLAUSIBLE: the twelve have no campaign, so the gap does not show there). The economics flow drift (`flowDriftOf`) needs the store's campaigns, the power desk's `politicsBlocsOf` needs a worldState, and SteadingsSection's steadings need the campaign ledger. On a campaign town the composer draws without them, so those lenses can differ from the owner's view. A cure is either to hand the composer the campaign at the save, or to rule that campaign readings are owner-only.

### 6.4 The STOPs and their rulings

- **STOP 1 (13:4x), the writer:** the canon commands compare-and-swap on `data` and `ai_data` (193: `v_locked_data is distinct from p_expected_data`) against the store's in-memory record, which never carries what the save path stamps. With the writer in the tree, `tests/lib/saves.smoke.test.js` ("save shapes the row") and `tests/store/phantomCloudId.test.js` go red; both are green without it. **RULED 13:5x: GRANTED** (the default): `src/store/outbox.js` and the create path in `src/store/settlementSlice.js` adopt the persisted `publicProse` (and the `ai_data.aiSettlement` stamp) into the saved entry on ack, in ONE cause with the writer. The pin, red-first: a canon command issued after a save is NOT refused as stale. Measure once that no other persisting path bypasses the adoption; that is a STOP if one does. **NOT LANDED:** the writer is written but held. Its diff against `a2a2eb54b`'s `src/lib/saves.js` is reproduced in §6.5, item 1.
- **STOP 2, the observed-shape read:** the leaf's `settlement?.publicProse` is ONE new identity, `publicProse on settlement`, and `observedShapeReaders` stays red on it. That red is declared in every commit message. **RULED 13:5x: GRANTED:** the M9 save-time-writer admission, through the GOVERNED door only: the OSR migration in two acts as the train did, with the review json carrying the admission and the cause named. **NOT LANDED.**

### 6.5 What stays — BY FILE, for the next seat (in this order)

1. **The writer, with the store's adoption, as ONE cause (STOP 1, granted).**
   - `src/lib/saves.js`. The held design is a lazy `loadPublicProseCompose()` beside `loadNeighbourBackLink`, and an async `publicProseForRow(entry)` that returns `{data, ai}` (null when the composer cannot load or throws). `mutationRow(entry, includeId, publicProse)` writes `withPublicProse(entry.settlement, publicProse?.data)`, and `aiDataWithPublicProse` writes the same into `ai_data.aiSettlement`. The row is awaited at `supabaseSave` (its own row literal), `supabaseUpsert`, `supabaseUpdate` (its own `updates`) and `supabaseMutateBatch` (`Promise.all` over updates and creates).
   - `src/store/outbox.js` and `src/store/settlementSlice.js`: adopt the stamp on ack.
   - `src/lib/canonEventCommandPersistence.js` also writes `data` and `ai_data` (`p_next_data` / `p_next_ai_data`): measure it under the "no bypass" clause.
   - Pins: the canon-command-after-save arm; re-key `tests/lib/saves.smoke.test.js` ("save shapes the row") and `tests/store/phantomCloudId.test.js` by cause.
   - The "one save per shared town" backfill (item 9) starts here.
2. **The OSR admission (STOP 2, granted):** `scripts/check-observed-shape-readers.mjs :: EXPLAINED_WRITER_EXEMPTIONS` (`publicProse on settlement`, `save-time-writer`, writer `src/lib/saves.js`; gate 0 finds the key there once item 1 lands), with its two-act migration, `tests/lint/observedShapeBank.literal.js` and the sentinel/walker pins on the roster count (ten).
3. **The remaining desk families**, each ONE cause, in the economy idiom: a `<desk>DeskRead` one-caller module for direct-call sites (ARM 2 re-keyed by cause), the hosts' arguments in `deskHostArgs.js`, sites in `publicProseCompose.js`, and its tab added to the equality suite's `SITES` (and to `COMPLETE` when every family on the tab is lit).
   - `OverviewTab.jsx :: stressorProse` (`stressors:overview`), with the crisis card's `v.summary` fallback.
   - `DefenseTab.jsx`'s eight calls (`defense:state`, `defense:criminal`, and the threat, forces, posture, status, wall and supporting lenses), with the T2-20 static line.
   - `PowerTab.jsx :: powerStateProse` plus `deskReadings` (`power:desk`), and the ladder rows and `governanceAccountOf`, which are also gated on `publicDossier`.
   - `WarFaithDesk.jsx :: warFaithDeskRungs` from FaithTab (`warFaith:faith`); WarTab needs a campaign, see §6.3 item 4.
   - `MagicTab.jsx` (`magic`).
   - `ViabilityTab.jsx :: isolationProse` (`viability`).
   - `SteadingsSection.jsx` (`general:steadings`; its `lifecycleStatus` reads are held by the observed-shape register against that file).
   - §6.3 item 1's `deriveViability`, if the chair rules it a site.
4. **The veil on strings (item 5):** `src/domain/display/galleryVeil.js :: applyVeil` drops a site's rung where its block address is hidden. Hidden power names are already masked over the whole projection, and §6.1's leak arm pins that.
5. **`src/domain/dossier/dossierSearch.js` (item 7):** index `publicProseOf` strings on the player-view enumeration.
6. **The bytes, again (item 8):** at the last family, against §6.2.

### 6.6 The deploy step's terms (item 9, for the chair's record at the deploy)

The owner runs `supabase db push` with 208, 209 and 210 in that order. None is applied by any lane, and 210 is a one-token allowlist. The shared page lights for a town at its FIRST SAVE after the client ships the writer (§6.5 item 1). A town never re-saved prints SILENT wherever a desk speaks: rule 1, never a re-draw. Its legacy fallbacks are already gone for the economy family (§6.1) and stay only until each remaining family's cause lands. **One save per shared town is owed.** Name it to the owner; never script it.

### 6.7 Gates and receipts

- **The full vitest at the base** (`e33c77f94`, in a clean worktree, started before the first edit and concluded): 21 files and 35 tests red, the inherited set. Each cause was then compared against that set, file by file.
- **Each cause:** the touched tabs' and libs' own suites (67 files at `a2a2eb54b`, 4,330 tests), `tests/lint` and `tests/architecture` in full, and `tests/security` with the economy cause. The ONLY reds new against the base were the declared `observedShapeReaders` identity (STOP 2), plus, while the held writer sat uncommitted in the tree, its two (STOP 1). Both of those were green with the writer parked.
- eslint is clean on every touched file. `tsc --noEmit` gives 167 at every cause, the base figure.
- The three record walkers were green (111) before each push.
- Not run: the 1,000. No cause is frame-bearing: no pool text was written, and the shared page prints the owner's own lines.

### 6.8 CONFIRMED against PLAUSIBLE

CONFIRMED by executed measurement:
- On the twelve, every economy and general line the owner's player view prints, the shared page prints, character for character. Owner minus shared is empty on the five complete tabs.
- The fallbacks' owner reach: 0 of 300.
- The red-first counts: 49/60 and 23/181.
- The bytes and the leak arm.
- The writer's two reds: present with it, gone without it.

PLAUSIBLE:
- The canon-command stale refusal (read from 193's SQL, not executed).
- §6.3 item 4's campaign-town divergence (read from the code; the twelve carry no campaign).

## 7. The third seat

**Seat:** SW-B7b PROJECTION, the third seat (session `session_01FbPLbbpYzd8XKBiTgAuZuQ`), on this lane from `bf6575d95`. The lane stop, rule 14: what is landed is pushed; the remainder is listed BY FILE in §7.5. The writer and the admission landed first, so a town's shared page lights at its first save after the client ships.

### 7.1 The causes landed

| commit | cause | public before → after | pins (red at the parent) |
|---|---|---|---|
| `adbd413a6` | item 1: the writer, with the store's adoption, as one cause | an unstamped record (SILENT at every lit site) → `data.publicProse` (and `ai_data.aiSettlement.publicProse`) written at every cloud save | `tests/store/publicProseAdoption.test.js` (NEW, 5 arms): 5/5 red at the parent, and the two stale arms red with only the adopter disabled. Re-keyed by cause: `saves.smoke` "save shapes the row"; `phantomPromotion` C7 (the composer is the discriminant's fourth reader, by addition, and writes no row); `snapshotPromotion.census` (+1 FORWARD row, `adoptPublicProseAck`) |
| `8ad1df506` | item 2, act 1: the observed-shape rung 39 → 40, one save-time-writer declaration `publicProse on settlement` (writer `src/lib/saves.js`), roster 14 → 15, bank 76/50 → 77/51 | — | the four rung suites 128/128; the walker declared red until act 2 |
| `840e40d92` | item 2, act 2: the governed re-mint (scan → migrate → review → bundle → `--write`) | — | New 1 · Same 1,531 · nothing else; review `docs/chair/2026-11-09/osr-rung40-public-prose-review.json` (a builder that refuses anything but the one row; negative control refused); froze 2,191 findings / 1,532 identities, bank 77/51; walker 47/47; the gate exits 0 |

**The writer, as built.** `src/lib/saves.js` has five pieces. `loadPublicProseCompose()` is lazy, a dynamic import beside `loadNeighbourBackLink`. `publicProseForRow(entry)` returns `{data, ai}`, composed from `entry.settlement` and from `entry.aiData.aiSettlement`, each from its own record; it returns null when neither is a record, or when the composer cannot load or throws. `mutationRow(entry, includeId, publicProse)` stays SYNC and writes `withPublicProse(…)` and `aiDataWithPublicProse(…)`. The stamp is awaited at `supabaseSave` (its own row literal), `supabaseUpsert`, `supabaseUpdate` (its own `updates`) and `supabaseMutateBatch` (`Promise.all` over updates and creates, with the owner/session fence re-asserted after that await). The local backend is untouched: it has no gallery and no CAS. A phantom stub composes null (`isPhantomRecord`), so EM-F1's five keys persist as minted, and `phantomCloudId` stays green and unmoved.

**The adoption, as measured, and the STOP sent.** `outbox.js` is store-agnostic by its own contract, and ten `save()` callers sit outside the slice's create path. So the ack is ONE seam: every confirmed cloud write calls the `saves.onPublicProseAck` listeners. `settlementSlice.js :: adoptPublicProseAck` writes the stamp into the cached row (`settlement`, `aiData.aiSettlement`) and into the live record, but ONLY where they are byte-equal, less the stamp, to the record written. So an older write's ack never lands on a newer edit, and the newer edit's own write stamps it. It is wired by one line in `src/store/index.js`, a file beyond the grant's list; this was the STOP, sent with this default. `outbox.js` is unchanged, because the acks it drains reach the same seam.

**`canonEventCommandPersistence.js`: measured, and NOT stamped.** Migration 183's envelope (`CUT_TRADE_ROUTE changed an unrelated settlement field`) and 193's `create_route_envelope_violation` refuse any top-level change to `data` outside their named keys. A restamp of `p_next_data` would therefore be refused. The command's next record carries the adopted stamp forward unchanged, and the store adopts the server's returned row through the command's own projection. **The limit, written plainly:** after a canon command the shared text is the pre-command text until the owner's next save. This is §1's staleness, and it is never a wrong re-draw.

**Campaign readings are OWNER-ONLY in this wave (the chair's ruling on §6.3).** The composer draws from what the save holds. A lens that needs the campaign (flow drift, the politics blocs, the steadings' campaign ledger, WarTab) prints NOTHING on the shared page; it never prints a different reading. The equality law reads against the SAVED record's player view, not against the live campaign overlay. A campaign-aware projection is a named post-deploy follow-up.

### 7.2 Gates and receipts

- **The governing suites of item 1** (every test file naming `saves.js`, `settlementSlice`, `store/index` or the composer, 475 files): 471 green. Four files were red. Two of them were this cause's pins (C7 and the census), now re-keyed above. The other two are INHERITED: they are red at `bf6575d95` too, run in a clean worktree at the parent. They are `readerValidationOnPage` soak1k-24 and `architectureFreshness`'s migration count/head, the lane's 208/209 composition gap that §4 declares.
- eslint is clean on every touched file. `tsc --noEmit` gives 167, the base figure, with none in the touched files.
- **The observed-shape register:** the rung suites 128/128 at act 1; walker 47/47 and the checker's gate exit 0 at act 2.
- **The wide run at the tip** (`tests/lint`, `tests/architecture`, `tests/security`, the equality suite, the leaf suite): see §7.4.
- **Golden surfaces:** no generator file was touched. The owner view moves by 0 text: the adopter changes no line a page prints, only the hidden `publicProse` key on the store's record. The public snapshot does not move in these causes, because no new site is lit; the writer makes the already-lit families' text reach a real saved row.
- **The full vitest at the base** was started in a clean worktree before the first edit (`--maxWorkers=2`). Its figure is in §7.4 if it concluded inside the lane.

### 7.3 The STOPs (sent; the defaults are recorded)

1. **The adoption seam.** The default is built as above: one ack seam, one wiring line in `src/store/index.js`, and `outbox.js` unchanged.
2. **The stressors family.** `OverviewTab.jsx :: crisisDoor` is `!publicDossier && !playerView && …`, so the `!crisisDoor` crisis card prints `v.summary` on the owner's PLAYER view as well as on the shared page. Under the law, removing it from the shared page alone breaks byte-equality, and removing it from the player view moves an owner surface. DEFAULT, not built: ship `stressorsStateProse`'s rungs as `stressors:overview`, and KEEP `v.summary` on both views (it is the datum, not a desk line) until the chair rules.

**RULED (the chair, 15:1x and 15:2x; both reached this seat after its hand-back):**
- **STOP 1: the default is accepted whole.** The one wiring line in `src/store/index.js` is GRANTED outside the list. The byte-equal guard is pinned red-first. The arm "an ack for an OLDER write never lands on a newer edit" was vacuous as first written, because the newer edit already carried an equal stamp. It is re-cut so that the newer edit carries no stamp. With the guard removed (`heldIsWritten` ⇒ true) it reds, 1 of 5; with the guard it is green, 5/5. **The staleness limit, as the rule:** the shared text is the owner's text as of the last SAVE, stale by at most the canon commands since, until the next save. This sits beside the absent-field and version pins (rules 1 and 2 of `publicProse.js`), and it is within the law, because the law reads the saved record.
- **STOP 2: the default is accepted. THE RECLASSIFICATION, with its cause.** A datum that prints on the owner's PLAYER view is the player view's own content, not a public-only "legacy fallback". B10(a)'s removal applies to compositions the shared page printed INSTEAD of the owner's text. The crisis card's `v.summary` prints identically on both pages, so there is nothing to cure, and byte-equality is kept by LEAVING it. The same test applies to the remaining three fallbacks: one that prints on the player view too STAYS on both; one that prints on the shared page only GOES, red-first. `situationDesc` and `strategicValue` already left at `6c3fbbb32`, where their owner reach was measured 0 of 300, so they were shared-page-only. The T2-20 static line is to be measured by the same test in the defense family's cause. **Building `stressors:overview` is the next seat's FIRST cause** (§7.5 item 1, first row): ship the rungs, keep `v.summary` on both pages, and ship `worldStressor` as null (campaign-only).

### 7.4 Measured at the tip

The wide run at `840e40d92` covered `tests/lint`, `tests/architecture`, `tests/security`, `tests/components/publicProseEquality.test.jsx` and `tests/domain/publicProse.test.js`: 378 files, 5,463 tests passed, 4 red. **All four reds are INHERITED**: each was run red at the parent `bf6575d95` in a clean worktree.
- `migrationSequenceAll`'s gapless arm (208 is absent on this lane; the declared composition red of §4).
- `layerBoundaries`' cycle set, the SAME extra cycle at the parent (`generators/foodGenerator.js | generators/isolationSupport.js`, not this lane's).
- `sovereigntyLightingContract`'s each-family park debt (109 against 108 at the parent and the tip alike).
- The same walker's estate file count (3,138 pinned; **3,141 at the parent, 3,142 here**). The +1 is this seat's new suite `tests/store/publicProseAdoption.test.js`, an UNSIGNED census delta for STYLE-2-MERGE's re-measure. The pin is not re-worded here.

The three record walkers: 111/111 (`review-fixes-2026-07-08` fetched). The full vitest at the base did not conclude inside the lane, so it is not counted, as at the first seat.

### 7.5 What stays — BY FILE, for the next seat (in this order)

1. **The remaining desk families**, each ONE cause in the economy idiom (`economyDeskRead.js` / `deskHostArgs.js` / `publicProseCompose.js :: PUBLIC_PROSE_SITES` / the equality suite's `SITES`, plus `COMPLETE` when every family on the tab is lit; ARM 2 of `tests/lint/dossierMountRegistry.walker.test.js` re-keyed by cause where a desk's one caller moves into a `<desk>DeskRead` module):
   - `src/components/new/tabs/OverviewTab.jsx :: stressorProse` → `stressors:overview`, pending §7.3 STOP 2. `worldStressor` is campaign-only and ships null, by the owner-only ruling.
   - `src/components/new/tabs/DefenseTab.jsx`, its eight calls (`defense:state`, `defense:criminal`, and the threat, forces, posture, status, wall and supporting lenses), with the T2-20 static line out. The line prints on the owner's player view whenever `criminalLines` is empty; measure its owner reach first, as the economy fallbacks were measured.
   - `src/components/new/tabs/PowerTab.jsx :: powerStateProse` with `deskReadings` (`power:desk`); the ladder rows and `governanceAccountOf` gated on `publicDossier`. `politicsBlocsOf` needs a worldState, so it is owner-only and ships nothing.
   - `src/components/new/tabs/WarFaithDesk.jsx :: warFaithDeskRungs` from FaithTab (`warFaith:faith`). WarTab is owner-only.
   - `src/components/new/tabs/MagicTab.jsx` (`magic`).
   - `src/components/new/tabs/ViabilityTab.jsx`, as two sites. The first is `isolationProse` → `viability`: `defenseIsolationSupportProse`'s callers are ViabilityTab and `printProse.js`, the PDF, which is not public. The second is `deriveViability`'s seeded verdict → `viewModel:viability`, shipped as text (`vmViability.summary`, behind `canonicalViewModel`).
   - `src/components/new/tabs/SteadingsSection.jsx` (`general:steadings`). The campaign ledger is owner-only.
   - The Overview's culture / "Governed by" line (`settlementQuickGuide.js :: cultureScopeLine` / `governsLine`), a site composed owner-side and shipped, never read from stripped fields in public.
   - The crisis "Hook:" lines are veiled rows; the pins treat them as stripped.
2. **`src/domain/display/galleryVeil.js :: applyVeil`**: drop a site's rung where its block address is hidden.
3. **`src/domain/dossier/dossierSearch.js`**: index `publicProseOf`'s strings on the player-view enumeration.
4. **The bytes, again**, at the last family, against §6.2 (mean 6.7 KB with economy and general lit).

### 7.6 The deploy step's terms (unchanged from §6.6)

The owner runs `supabase db push` with 208, 209 and 210 in that order; no lane applies any of them. The shared page lights for a town at its FIRST SAVE after the client ships the writer (`adbd413a6`). One save per shared town is owed. Name it to the owner, and never script it.

### 7.7 CONFIRMED against PLAUSIBLE

CONFIRMED by executed measurement:
- The writer stamps both records.
- After a save and after an update, the live record, the cache and the stored row are one record: the store's entry check and the CAS's compare are both equal, on a modelled table.
- An older ack never lands on a newer edit.
- A failed composer writes no stamp and the page reads null.
- The canon envelopes refuse a restamp, read from 183's and 193's SQL text.
- The rung's reconciliation is exactly one row.

PLAUSIBLE:
- That the real RPC compares equal end to end: the CAS was modelled as deep jsonb equality, not run under pglite.
- That no save path outside `saves.js` writes `data`: grep-measured. `canonEventCommandPersistence.js` is the one other writer and is handled above.

## 8. The fourth seat

**Seat:** SW-B7b PROJECTION, the fourth seat (session `session_01FbPLbf29LDqJ5uVkGtYKUr`), on this lane from `3307d8673` (one ruling commit past `26c41ed3c`, as the chair confirmed at 16:0x). The lane stop, rule 14: what is landed is pushed, and the remainder is listed BY FILE in §8.5. Hand-back at 18:3x UTC.

### 8.1 The causes landed (§7.5 in order)

| commit | family · sites | measured on the twelve: owner player view minus shared page (prose lines) | pins, red at the parent |
|---|---|---|---|
| `94906a722` | stressors · `stressors:overview` (NEW `stressorsDeskRead.js`; `worldStressor` ships null) | Overview 36 → 24 | the equality suite's new DRAWN arm (the owner's own draw through the family's one caller, against the shared page): 11/13 |
| `ed60842de` | the tuning inventory refrozen through its ritual (`WIND_DOWN_FRACTION`'s dependent moved; no value) | — | the ordinary run green after |
| `aa04ec19c` | defense · `defense:state`, `:threat`, `:forces`, `:posture`, `:status`, `:wall`, `:supporting`, `:criminal` (NEW `defenseDeskRead.js`; `deskHostArgs.js :: criminalStructureOf`); T2-20's static line LEAVES | Defense 114 → 0; COMPLETE | 85 red (DRAWN ×8 lenses + the fallback arm) |
| `ad98f7f02` | power · `power:desk` (bloc rungs nulled: owner-only), `power:governance` (`{text}`), `power:ladder` (`[{faction, rung}]`) (NEW `powerDeskRead.js` with `powerDeskReadings`, `powerLadderRowsOf`, `governanceAccountRead`) | Power 44 → 4 (the 4: `factionDynamics.js` relationship narratives the projection strips — veiled rows) | 24/26 |
| `0df619ac6` | the tuning inventory refrozen (powerStateProse.js's six constants' dependent moved; no value) | — | green after |
| `f913f8b28` | faith · `warFaith:faith` (`WarFaithDesk.jsx`: the public branch for a named `publicSite`, the gate still defaults closed; `faithDeskReadings` extracted); WarTab names no site (owner-only) | Faith 1 → 0 (not in COMPLETE: eleven towns print no faith prose, and the arm needs one per town) | 1/13 |
| `a9201e298` | magic · `magic` (NEW `magicDeskRead.js`); the static "resilience relies…" explanation STAYS (it prints on the owner's player view where the lens is silent: 15:2x's test) | Magic 5 → 0, B−A 1 → 0; COMPLETE | 5/13 |
| `2a2065d52` | viability, site 1 · `viability` (NEW `viabilityDeskRead.js :: isolationDeskRead`) | (soak1k-9's line) | 1/13 |
| `aa6bcc722` | viability, site 2 · `viewModel:viability` (`viabilityVerdictRead`, `{summary}`; an unstamped page prints an empty summary) | Viability 9 → 0, B−A 8 → 0; COMPLETE | COMPLETE += viability: 12/12 |
| `a9d227f46` | the phone-chrome census re-recorded FOR `f913f8b28` (a pin that cause owed and did not carry; bisected ad98f7f02 green → f913f8b28 red) | — | the census green |
| `8a3783611` | the Overview's identity line · `overview:identity` (NEW `overviewIdentity.js`: culture scope + "Governed by", composed owner-side) | Overview 24 → 12 (the 12: the crisis "Hook:" rows, VEILED); B−A 12 → 0; COMPLETE with the suite's new `VEILED` per-tab predicate | COMPLETE += overview: 12/12 |
| `9ca3902d4` | item 2 · `galleryVeil.js :: VEILED_PUBLIC_PROSE` + `applyVeil` drops the shipped rungs of a hidden block (`block:defense.criminalStructure` → `defense:criminal`; `block:power.criminalUnderside` → `power:desk`'s four underside rungs) | — | the leak suite's veil arm: 2/2 |

**THE TEST OF 15:2x, applied.** The T2-20 static line was measured on 300 towns (`projectShareVeil(toPublicSafe(.))`, soak1k-0..299) BEFORE the edit: owner reach 0 (player view 0, DM 0), shared page 37 (first soak1k-6). It printed on the shared page alone, so it LEFT; after the cause it prints on no page, stamped or unstamped. The magic tab's static explanation and the crisis card's `v.summary` print on the owner's player view, so they STAY on both pages.

**Re-keyed by cause (each in its cause's commit):** `dossierPhoneFloorAllViews` (the walk is a shared page): Overview desktop 12/11 → 13/12 and mobile 11 → 12; Defense 25/25 → 35/35 and 23 → 33; Power 29/28 → 33/32 and 28 → 32; Faith 1/1 → 2/2 and 1 → 2. No token moved; sub12 stayed zero. `defenseStateProseDesk`'s importer list: `DefenseTab.jsx`, `MagicTab.jsx` and `ViabilityTab.jsx` → `defenseDeskRead.js`, `magicDeskRead.js` and `viabilityDeskRead.js`. `economyReadModelCoverage`: FaithTab's FROZEN_DEFERRED entry moved to `WarFaithDesk.jsx` with its one read. `generalDeskTabFlow`'s identity-strip arm: the fixture is stamped as its save stamps it. Prose-numerics: 4 rows re-addressed (PowerTab line moves; regenerated by the test's own scanner, identities identical). The observed-shape checker read `desk.criminal`'s rung `.sentence` as `sentence on criminal`; bound by destructuring, the register is exact (2,191, exit 0) with no row moved.

**Golden surfaces:** the owner view moved by 0 text in every cause (the same producers, the same bags). No generator file was touched, so gm, fence, herald, manifest, witness and pdf do not move. No rendered public snapshot exists in the estate; the phone-floor and census deltas above are this seat's measured public deltas, UNSIGNED, for STYLE-2-MERGE.

### 8.2 The bytes (item 4, against §6.2's 6.7 KB)

`JSON.stringify(composePublicProse(owner))` at `9ca3902d4`, compose time in vitest's node (second call):

| town | projection bytes | public record bytes | share | compose |
|---|---|---|---|---|
| soak1k-0 Albamunicipium | 14,570 | 24,347 | 59.8% | 43 ms |
| soak1k-1 Lundey | 14,555 | 44,153 | 33.0% | 54 ms |
| soak1k-2 Copanucan | 14,403 | 40,285 | 35.8% | 50 ms |
| soak1k-3 Al-karez | 15,229 | 130,462 | 11.7% | 44 ms |
| soak1k-4 Portaminus | 17,297 | 164,092 | 10.5% | 78 ms |
| soak1k-5 Suryanagar | 16,880 | 263,848 | 6.4% | 110 ms |
| soak1k-6 Becanchihua | 13,445 | 27,031 | 49.7% | 30 ms |
| soak1k-7 Haifeng | 13,988 | 47,191 | 29.6% | 39 ms |
| soak1k-8 Achileia | 14,696 | 53,965 | 27.2% | 40 ms |
| soak1k-9 Shangjin | 16,047 | 107,923 | 14.9% | 31 ms |
| soak1k-10 Olympambelos | 17,426 | 237,487 | 7.3% | 111 ms |
| soak1k-11 Gankhuushari | 17,700 | 269,066 | 6.6% | 117 ms |

Total 186.2 KB; mean **15.2 KB** a town (6.7 KB at §6.2; §6.2 forecast 10–14 KB). Per site, mean KB: economy:economics 2.95, power:desk 1.73, defense:posture 1.18, defense:state 0.96, economy:services/resources/daily_life 0.85 each, defense:forces 0.76, defense:threat 0.72, warFaith:faith 0.63, stressors:overview 0.51, power:governance 0.49, defense:criminal 0.40, the rest under 0.40. The shipped rung keeps each lens's glance, sentence and detail; the lever stays §6.2's (ship only the rungs a site's mounts draw; it needs the mount registry's depth read in the composer), a design call for the chair. Compose time rose from 8–37 ms to 30–117 ms a save.

**The equality suite at the tip:** COMPLETE = economics, services, resources, daily_life, history, defense, magic, viability, overview (with `VEILED`: the overview's "Hook:" rows). Power is complete but for its 4 veiled relationship narratives; Faith is complete but cannot meet COMPLETE's per-town anchor. DRAWN covers every later family's site that prints on the twelve.

### 8.3 The STOPs (sent; defaults recorded)

1. **`general:steadings` (sent before the identity cause).** Dark at birth: 0 of 300 towns carry a lifecycle grade or an ancient ruin. A planted pin was red-first 3/3 and the site lit both lines, BUT the composer must read `lifecycleStatus` / `history.ancientRuin`: reading them there adds observed-shape rows (OSR red, "never add a file"), and importing SteadingsSection's one-read helper closes a store cycle (layerBoundaries red). DEFAULT: left UNLIT (the work is parked in the seat's scratch). A cure is an OSR admission, or SteadingsSection taking the owning world from its host instead of the store. The grade itself needs no shipping: the pulse writes `config.lifecycleStatus`, and `config` is on the public allowlist.
2. **Item 3, `dossierSearch.js`.** Results render through `DossierSearchResults.jsx :: RENDERERS` by object type; a `prose` family indexed in `dossierSearch.js` alone would count a hit and render nothing. DEFAULT: one cause touching both files (a `prose` object per shipped site on the player-view enumeration, tabbed to the site's tab, with a one-paragraph renderer). Needs `DossierSearchResults.jsx` granted. NOT built.
3. **Named, not a STOP (outside the lane):** the server's member-override veil (`_gallery_apply_member_overrides`, SQL) does not drop the shipped strings from the wire payload; the client's `applyVeil` drops them before any render (`9ca3902d4`).

### 8.4 Gates and receipts

- **The full vitest at the base** `3307d8673` (a clean worktree, `--maxWorkers=2`, started before the first edit and CONCLUDED): 24 files and 38 tests red out of 3,142 files / 38,159 tests — the inherited set (among them `layerBoundaries`' foodGenerator|isolationSupport cycle, `sovereigntyLightingContract` ×2, `composeStateProse` 60/72, `readerValidationOnPage` soak1k-24, `migrationSequenceAll`'s gapless arm, the docs-count and migration-contiguity arms of the 208/209 gap). Every cause's run was compared against it, file by file.
- **Each cause:** every suite naming its touched modules (28–75 files), with `tests/lint` and `tests/architecture` in full, and `tests/security` with item 2. New reds beyond the inherited set were only the pins re-keyed above. One was MISSED and found later: the faith cause's phone-chrome census (its governing set did not name that census); re-recorded at `a9d227f46` with the cause named.
- eslint is clean on every touched file; `tsc --noEmit` gives 167 at every cause, the base figure.
- The three record walkers were green before each push (with `review-fixes-2026-07-08` fetched to a local branch ref).
- Not run: the 1,000 (no cause is frame-bearing: no pool text was written; the shared page prints the owner's own lines). The production build and its byte ceiling were not run in this seat: the composer's new imports (the tabs' read modules, `WarFaithDesk.jsx`, `rulingPowerCoup` through `powerDeskRead.js`) ride its lazy chunk, which is PLAUSIBLE, not measured.

### 8.5 What stays — BY FILE, for the next seat

1. **`src/components/new/tabs/SteadingsSection.jsx`, `src/components/new/publicProseCompose.js`, `src/components/new/generalDeskRead.js`** (`general:steadings`): per §8.3 STOP 1's ruling. The parked work: `PUBLIC_SITE_GROUP` += `'general:steadings': 'steadings'`, SteadingsSection passes `publicSite`, the composer's site with `steadings: []`, and the planted three-town pin.
2. **`src/domain/dossier/dossierSearch.js` + `src/components/dossier/DossierSearchResults.jsx`** (item 3): per §8.3 STOP 2's ruling.
3. **The bytes lever** (§8.2): the chair's call.
4. **The SQL twin of item 2** (§8.3 note 3): the SQL lane's, at the deploy.

### 8.6 The deploy step's terms (unchanged from §7.6)

The owner runs `supabase db push` with 208, 209 and 210 in that order; no lane applies any of them. The shared page lights for a town at its FIRST SAVE after the client ships. One save per shared town is owed. Name it to the owner; never script it.

### 8.7 CONFIRMED against PLAUSIBLE

CONFIRMED by executed measurement: on the twelve, every stressor, defense, power-desk, governance, faith, magic, viability and identity line the owner's player view prints, the shared page prints, character for character, with the veiled rows named; the red-first counts in §8.1; T2-20's reach (owner 0/300, shared 37 → 0); the bytes; the veil arm; the census bisection. PLAUSIBLE: `power:ladder` (the ladder is dark on the twelve: read, not rendered); the lazy chunk's bytes (no build was run); the steadings site (lit on a planted record only, then parked).
