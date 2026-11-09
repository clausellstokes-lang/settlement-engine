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

1. **`src/domain/display/publicProse.js` (NEW, a leaf):** `PUBLIC_PROSE_VERSION`, and `publicProseOf(settlement, site)`, which returns the shipped desk object for a call site or null. Sites are keyed by the call site, not the desk, because the hosts pass different arguments: `economy:economics`, `economy:services`, `economy:resources`, `economy:daily_life`, `general:<tab>`, `stressors:overview`, `defense:state`, `defense:criminal`, `power:desk`, `warFaith:<tab>`, `magic`, `viability`. Keep each rung's `glance`, `sentence` and `detail` (and `provenance` if a tab renders it). Name keys away from every `PRIVATE_KEY_RE` token (`hook`, `chronicle`, `notes`, `seed`, `dm`, …) or they are stripped.
2. **`src/components/new/publicProseCompose.js` (NEW, loaded lazily so the zero-slack ceiling holds):** `composePublicProse(settlement)` calls each site's ONE caller with `playerView: true, publicDossier: false` on the owner's record, so the seed is read here and never shipped. Each host's computed arguments are EXTRACTED from the tab into an exported pure helper that the tab and this composer both call (never a second derivation): `EconomicsTab.jsx`'s `fbal` / `granary` / `flowDrift`; `ServicesTab.jsx`'s `impairedInstitution` (its `computeChainSets` read); `PowerTab.jsx`'s `deskReadings`; `WarFaithDesk.jsx`'s `readings`; `DefenseTab.jsx`'s `deskOpts` and `crimStructure`; `OverviewTab.jsx`'s `stresses` and `populationTrendBand`.
3. **The readers' public branches (SILENT retired, the paid-gate idiom kept IN the read's statement for the mount registry's ARM 3):** `src/components/new/economyDeskRead.js`, `src/components/new/generalDeskRead.js`, `src/components/new/tabs/WarFaithDesk.jsx`, and the direct calls in `OverviewTab.jsx` (`stressorProse`), `DefenseTab.jsx` (`stateProse`, `criminalProse`) and `PowerTab.jsx` (`powerStateProse`). Each becomes `publicDossier ? publicProseOf(r, site) ?? SILENT : <desk>(…)`. `tests/lint/dossierMountRegistry.walker.test.js` ARM 2/3 is re-keyed by cause if it reads the statement.
4. **The writer:** `src/lib/saves.js`, at the payload boundary of `supabaseSave` / `supabaseUpsert` / `supabaseUpdate` (async; `mutationRow` is sync, so the lazy import is awaited before it). It stamps `data.publicProse = composePublicProse(settlement)` on every save, and the same into `ai_data.aiSettlement` when that object exists, so a narrated share keeps it. `writerReach.walker`'s `publicProse on settlement` row then leaves the unwritten report (re-keyed by cause), and the writer-reach register moves through its door.
5. **The veil on strings:** `src/domain/display/galleryVeil.js :: applyVeil` drops a site's rung where its block address is hidden (map each site's rungs to the `block:` addresses `isHideable` knows). Hidden power names are masked already by `publicSafe.js :: maskHiddenNames` over the whole projection, and by the SQL's text-level twin.
6. **The four fallbacks leave, each in its desk's cause:** `EconomicsGlance.jsx`'s `eco.situationDesc` fallback (with the economy desk), `ResourcesTab.jsx`'s `res.strategicValue` (with the economy desk, DS-ECO-11), `DefenseTab.jsx`'s T2-20 static line (with the defense desk), and the Overview crisis card's `v.summary` beside the stressor desk (with the stressors desk). Each is red-first: "the public page never reaches it" on a town whose `publicProse` is stamped.
7. **`src/domain/dossier/dossierSearch.js`:** the player-view enumeration indexes the shipped strings (`publicProse`) so a search finds what the page prints.
8. **The red-first, on the twelve:** for each site, the text of the public render (`projectShareVeil(toPublicSafe(stamped))`, `publicDossier`) equals the owner's player-view render, minus the veiled rows, byte for byte. The leak arm: no `npcs[].secret` or `goal` substring, no hidden power name, and no `_seed` in any projected record (PUBLIC-VEIL's law; extend `tests/security/publicPayloadVeilTotality.test.js`). The bytes per town are measured again (§1's table: 4.2–7.1 KB).
9. **The deploy step's terms (for the record at the deploy):** the owner runs `supabase db push` with 208, 209 and 210 in order. The public page lights for a town at its first save after the client ships. A town never re-saved stays silent where its desk is silent, and keeps the fallbacks only until its desk's cause lands. So one save per shared town is owed; name it to the owner, and never script it.
