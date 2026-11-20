# VEIL-VR17 — hand-back: the shut grouping's signal survives a copy

Seat: VEIL-VR17 (the seventh chair, session_019yED1SUxGVHyjQnoqoFvQ8), branch `lane/veil-vr17-2026-11-20`, cut from
origin/lane/veil-18-2026-11-19 at **bedd5a392** (read back from origin first: equal). Assignment:
`lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-VR17.txt`. Every database is an in-process pglite
(the chain 001..212 on disk); no hosted database, no production credential, no `supabase` command, no deploy, no pull
request. Written 2026-11-20T01:39Z (read from `date -u`).

**RULING VR17** (the sixth chair, 2026-11-19 09:42 UTC, vetoable by the owner): the shut-grouping signal survives a copy
on every non-owner surface; a walker over every copy site; a born test through the server's payload.

## 1. The first act, measured (at bedd5a392, before any change)

**(a) REPRODUCED, and wider than the brief.** Born towns stored on the pglite chain, read by the tree's own client
(`src/lib/gallery.js :: fetchPublicDossier`) as an anonymous visitor, drawn by `PublicDossierView` and walked by
`tests/components/pageCensusWalk.shared.mjs :: walkDossier`. With `block:defense.criminalStructure` shut alone, the plain
gallery page and party link draw none of its derived lines, but SIX surfaces draw them ("Criminal structure: Organized
syndicate", the ring note, "Underworld: Corrupt Council"), on two towns in both stored shapes:
- a structuredClone, a JSON round trip, a spread of the page model (the reader's finding);
- **the gallery page AND the party link whenever the civility mask rewrites ANY string in the payload**, with no copy by
  the visitor: `src/lib/gallery.js :: sanitizeDossier` returns through `publicSafe.js :: veilPublicPayload`, whose
  `civility.js :: veilDeep` REBUILDS every object above a changed string, the page model included, so the WeakMap mark
  is gone (one flagged word in the town's own name suffices);
- **the public campaign map's member dossier** (`CampaignWorldView` over `get_gallery_map`): the server veils each member
  by its own listing's veil but sends no grouping list, and the client never marked it.
The importer's own copy draws them too (section 6). The other two family groupings (criminal services, the capture
reading) carry no derived block: every line they remove is data, gone on every surface. Receipts:
`out/first-act-1town.txt` (the probe, `measure/first-act.probe.jsx`, every surface incl. the import),
`out/born-red-at-bedd5a392.txt` (the born test at the base's bytes). The surprise went to the chair at 00:18 UTC.

**(b) WHERE THE SIGNAL COMES FROM.** Two places, both already in the bytes: the gallery read and the party link return
`gallery_member_overrides.$veil = {v: 2, mode, at, groupings}` (211 :: `_gallery_veil_served`: the sorted shut
groupings, defaults included; printed per case in `out/first-act-1town.txt`); and THE REMOVAL ITSELF: shutting
`block:defense.criminalStructure` deletes `economicState.safetyProfile.criminalInstitutions` and `.crimeTypes` (211's
applier, `- array['criminalInstitutions', 'crimeTypes']`; the client's `GROUPING_REMOVERS`), keys the generator writes on
every town (`generators/safetyProfile.js` returns both arrays). `get_gallery_map` and `import_gallery_dossier` send no
list, but carry the removal. A visitor can read both today.

## 2. The census of copy sites (ONE table)

The walker's register (`tests/lint/veilCopySites.walker.test.js :: REGISTER`, 23 keys / 25 sites over the surface
modules) is the full list; the rows that carry a page model, with who reaches them:

| Site (`path :: symbol`) | Surface | Who reaches it | Signal at bedd5a392 | Signal now |
|---|---|---|---|---|
| `src/lib/gallery.js :: sanitizeDossier` (veilPublicPayload -> veilDeep rebuild) | gallery detail page, party link | any visitor (the link: anyone holding it) | LOST whenever the mask rewrites a string | KEPT: the evidence is the data (executed) |
| `src/components/gallery/CampaignWorldView.jsx :: CampaignWorldView` (the member, never marked) | public campaign map | any visitor | ABSENT | KEPT: the server's removal reaches the member; it follows the DM's eyes |
| a structuredClone / JSON round trip / spread of the page model | the reader's probe; no such site in the surface modules today | — | LOST | KEPT by construction (executed) |
| `src/components/PartyLinkView.jsx :: PartyLinkView` `{ ...dossier }` | party link | visitor | kept (a wrapper copy, the same page model) | kept |
| `src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab` `{ ...s }` x2 | the shared page's Economics tab | visitor | lost on the copy; its two readers draw no veiled grouping | kept |
| `src/lib/gallery.js :: fetchDossierForImport`, `:: stripImportConfidential` | the import's SEND | a premium signed-in visitor, on an importable share | the removal travels | unchanged |
| `src/store/galleryImportSettlement.js :: importGallerySettlementImpl`; `src/store/galleryImportMap.js :: importGalleryMapWithCampaignImpl` | the import's SAVE | that importer | the importer's own copy draws the derived block | unchanged: section 6 |
| `src/utils/generateSettlementPDF.js`, `src/foundry/generateFoundryModule.js` (+ journal pages), SettlementDetail's print/PDF/journal/Foundry, Session Mode | the viewer's OWN saved record | the owner, or an importer on its own copy; NOT reachable from a shared page (OutputContainer read-only without a saveId draws no action band; no `window.print` on the public tree) | no page model | unchanged |
| `src/lib/gallery.js :: sanitizeDossier` (toPublicSafe), `galleryVeil.js :: applyVeil` (deepClone), `:: galleryPayloadFor` (toPublicSafe) | before the veil | — | n/a | n/a |

## 3. The mechanism, and why

**THE EVIDENCE IN THE DATA.** `src/domain/display/galleryVeil.js :: GROUPING_OPEN_EVIDENCE` names, for a grouping whose
block a renderer DERIVES from facts the veil keeps, the keys that PROVE it open: the keys its remover deletes and the
generator always writes (Defense's criminal architecture: `safetyProfile.criminalInstitutions` and `.crimeTypes`, both
arrays). `isVeiled(settlement, address, { publicDossier })` reads, on a VISITOR's page, the list beside the object OR the
absence of that proof: where the page model does not prove the grouping open, the block is withheld. The one reader,
`src/components/new/tabs/DefenseTab.jsx :: DefenseTab`, passes its `publicDossier` (OutputContainer's `readOnly &&
!saveId`: the shared page, the party link, the campaign map's member). The owner's own reads are unchanged
(`publicDossier` false: the list alone, as before).
**Why it survives by construction:** the signal IS the served data (211's applier and the client's remover delete the
same pair), so a structuredClone, a JSON round trip, a spread, the civility rebuild all keep it, and the campaign map's
member, which the server veils but sends no list for, now follows the DM's eyes exactly.
**The three things it must not do:** (1) it tells a visitor nothing: no byte is added; (2) no key on any record or
save; (3) 212, its rollback, `gallerySecondHomes.js`, `CurateMode.jsx`, `criminalVeilSwitch.js`, 211: untouched.
**Measured and withdrawn (told to the chair):** a page-model key `$veilGroupings` carrying the marker's list. It
survived every copy, but the program's server-equals-twin law and the page pins compare the client's page model with
the server's document: `tests/security` went 26 red (`galleryVeilHandRows` 16, `galleryServerVeil` 9,
`galleryVeilCures` 1: "`$.$veilGroupings` | server undefined | twin [...]"), and the server cannot carry it without 212.
Also weighed: re-marking the WeakMap after each copy (every future copy a hole until registered); a list per map member
from `get_gallery_map` (212: VEIL-19's).
**The guard against its one weakness:** a copy that RE-FILLS the removed keys (a normalizer's defaults) and is then drawn
on a visitor's page would prove "open" falsely. No visitor path normalizes a page model today (the register: every
`normalizeSettlement` site is an import save or the viewer's own record), and the walker reds a new copy site until it is
registered with its verdict, and reds any `isVeiled` reader whose address has no evidence row or which does not say its
audience.

## 4. Red and green, with counts (every run to a file, read by its count lines)

| Run | At | Result |
|---|---|---|
| the born test `tests/security/galleryVeilSignalCopies.pglite.test.js` (two born towns x both stored shapes; each family grouping shut alone; 8 surfaces at a desktop's width, 4 at a phone's; arms (C) and (D), section 8) | the base's bytes (git archive of bedd5a392) | **RED: 4 failed, 1 passed (5)**; the offences, 4 town-shapes each: the six copying surfaces (the gallery page civility-masked, the party link civility-masked, the campaign map member, a structuredClone, a JSON round trip, a spread), their three phone-width twins, and arm (C) for each withheld key (`out/born-red-at-bedd5a392.txt`); the plain page and plain link held |
| the same | the tip | **GREEN: 5 passed (5)**, the open-grouping control included on every surface |
| the walker `tests/lint/veilCopySites.walker.test.js` | the tip | **6 passed (6)** |
| its plant 1: an unregistered `structuredClone` of the page model in `PublicDossierView` | the tip, planted | **1 failed, 5 passed**: the registration arm, naming `src/components/PublicDossierView.jsx :: PublicDossierView :: structuredClone`; restored by cp, cmp equal, 6 passed |
| its plant 2: `DefenseTab`'s `isVeiled` read without its audience | the tip, planted | **1 failed, 5 passed**: the reader arm, naming `DefenseTab.jsx:208`; restored, cmp equal, 6 passed |
| the mutation manifest's test (two rows entered: the walker, inline rationale with the plants; the born test, `pglite-executed`) | the tip | 10 passed (10) |
| `tests/security` whole | the tip | **157 files passed, 1 skipped** (`customContentLockOrder.postgres`, a live PostgreSQL); **1,995 tests passed**, 1 skipped. The switch's and the twin's guards (`galleryVeilHandRows`, `gallerySecondHomes`, `galleryVeilCures`, `galleryServerVeil`) among them |
| the governing suites of the two changed modules (every test file naming `galleryVeil`, `DefenseTab`, `lib/gallery`, the gallery imports, `CampaignWorldView`, outside tests/security: 107 files, the switch's two among them) | the tip | 106 files passed, 1 failed; 1,640 tests passed, 1 failed: `tests/components/phoneChromeFloor.census.test.js` ("A `floored` number that FELL ... /create floored 621 -> 623, /settlements 864 -> 866, /gallery 666 -> 668"), **RED IDENTICALLY AT THE BASE**: not this seat's, named, not touched |
| `npm run typecheck:ratchet` / `npm run typecheck:domain:strict` / `npm run lint` | the tip | exit 0 (167, ceiling 167) / exit 0 (1113, ceiling 1113) / exit 0 (0 errors, 38 warnings, none in a file this seat touched) |
| 211 and its rollback, sha256 | base and tip | `eface6d0…0be01` / `ce8474ff…49712f`, both unchanged; 212 `dae0ae6c…19e247` / down `45da09eb…30a1c9`, untouched |
| the measurement (a), `measure/first-act.probe.jsx` | the base | `out/first-act-1town.txt` (Uxmalek: the derived Defense block drawn by CLONE, CIVIL, MAP and IMPORT, not by LINK) |

## 5. What a visitor's bytes tell, before and after

The same bytes: 212 untouched, no key added on either side. On the visitor's page the derived Defense block is now drawn
only where the response itself carries `criminalInstitutions` and `crimeTypes`; it was always derivable that a page
lacking them had the block shut (the removal ships today, section 1 (b)).

## 6. The stored figures, and what stays for the chair

Each measured at the base's bytes (a git archive of bedd5a392) and at the tip; VEIL-19 takes each door once at the
merged tree.
- **The lighting census** (`tests/lint/.lighting-census-baseline.json`): MOVED by this seat: the estate's files 3707 at
  the base -> 3709 at the tip (+2: the walker and the born test; the frozen figure is 3705, so the base was already +2,
  not this seat's). Door: `LIGHTING_CENSUS_REFREEZE='<seat>' LIGHTING_CENSUS_NOTE='<why>' npx vitest run
  tests/lint/sovereigntyLightingContract.walker.test.js` (a clean tree). Expected from this seat: files +2, titles +11
  (6 + 5), suite titles +2 (PLAUSIBLE: the door was not run).
- **The writers' reach**: `node scripts/check-writer-reach.mjs` exit 0 at the base and the tip; its walker
  (`writerReach.walker`) red at BOTH with the same message ("weight on contenders is missing from the frozen
  surfaceReach"): not moved by this seat.
- **The wiring census**: regenerated (`node scripts/wiring-census.mjs`) in scratch copies of the base and of the tip:
  byte-identical, so not moved by this seat; `--check` is stale at the base already.
- **The tuning inventory**: `tuningRegister.walker` 76 of 76 at the tip: not moved.
- Not on the brief's list, measured: the observed-shape ratchet (`observedShapeReaders.walker`) red at the base and the
  tip with IDENTICAL figures (2,215 reads, 1,553 identities, 445 files against the frozen 2,214 / 1,552 / 444): not this
  seat's; `phoneChromeFloor.census` likewise (section 4).
- The mutation manifest: +2 rows, this seat's own (entered).

**THE IMPORTER'S OWN COPY (residual, for the chair's or the owner's veto):** an import is the importer's own record
(SettlementDetail, `publicDossier` false), so its Defense tab derives the block from the facts the import carries (the
shown criminal power, the house names): "Criminal structure: Organized syndicate" on Uxmalek with the block shut
(`out/first-act-1town.txt`, IMPORT). The reader judged the same lines "from open data, the shown criminal powers, so no
leak". Withholding them there would change an owner's read of its own record (the importer's), or put a mark on the
saved record (the ruling's condition (2)): not built.

## 7. Executed or plausible

EXECUTED (logs read by their count lines): every row of section 4; the base-against-tip readings of section 6; the
census of section 2 (the walker's scan of the surface modules, and the probe and born test for every surface marked
LOST, ABSENT or KEPT); the generator's two arrays (read in `generators/safetyProfile.js`'s return, and present on every
open page of the born test: its control). PLAUSIBLE: the lighting census's title figures (the door not run); that the
importer's own library draws the derived block (measured at the base with the import drawn as a page; in SettlementDetail
the tab reads with `publicDossier` false, by reading the code, not drawn); that no record a visitor reaches lacks
`safetyProfile` while its grouping is open (where one did, the block would be withheld: the safe direction, executed on a
bare page model in the walker).

## 8. RULING VR18, AS AMENDED (the seventh chair, 01:15 UTC; vetoable by the owner): what stayed owed, answered (written 2026-11-20T01:59Z)

The chair approved the evidence mechanism in place of the key. Each item, measured:

1. **The real pipeline, end to end.** The born test's surfaces "the gallery page, civility-masked" and "the party link,
   civility-masked" run the real client (sanitizeDossier -> veilPublicPayload -> veilDeep, the town's own name carrying a
   word the mask rewrites; the test asserts the rewrite happened): with Defense's grouping OPEN they draw its derived
   lines (the control, arm (B)), with it SHUT they draw none (arm (A)). Green at the tip.
2. **A derived block found by what a surface DRAWS.** The born test reads lines drawn, never who calls isVeiled: every
   tab walked (every group, sub-tab and disclosure) on the gallery page, the party link, the campaign map's member, both
   civility-masked pages and three copies, at a desktop's width, and at a phone's (375 px: MobileTabStrip and the phone
   prose floor) for the page, the civility-masked page, the map member and a clone, each grouping shut and open, each
   width against its own reference. Print, the PDF, the journal and Foundry: arm (D) asserts no shared page offers a
   print, PDF, journal, Foundry or download control (the pattern executed against the owner's own labels: "Export PDF",
   "PDF Dossier", "Foundry VTT Module", "Print" all match; the Economics "Exports(3)" disclosure does not): those run on
   the viewer's own saved record only (SettlementDetail). Green at the tip (5 of 5); the base: section 4.
3. **Master's stored shape.** origin/master (db832c892)'s generator returns both arrays
   (`generators/safetyProfile.js`); born from master's own generator, 60 towns over the six tiers: **60 of 60 carry
   both** (`out/arrays-master-db832c892.txt`; the tip's generator: 60 of 60, `out/arrays-tip.txt`;
   `measure/arrays.probe.jsx`). So a record of master's shape draws the block for a visitor exactly as before where open;
   a record lacking either array would never draw it for a visitor (none found).
4. **The registry withholding an evidence key for a hidden house.** Arm (C): on the OPEN page, `criminalInstitutions`
   or `crimeTypes` deleted as the registry would withhold it: the derived block is not drawn. Green at the tip. (At the
   base 212 never deletes either key for a hidden house: the open control passed with the default veil's houses hidden
   whole, so the arrays survive house hiding today.)
5. **The map member.** It now follows the DM's eyes (the server's removal reaches it). V10-4 (a never-listed member
   served through the sanitiser only) is not worked round on the client.

**The chair's measure: is any OTHER identity-keyed mark lost the same way on a non-owner path? NO.** The estate's 70
`new WeakMap()` / `new WeakSet()` registers in src (`grep -rnE "new Weak(Map|Set)\(" src`), read by pattern: every
display-side one (crisisStoppedRow x5, stateProseKernel :: FACT_DECLARATION, houseInputAtHand x4, supplyStory ::
ON_RECORD, warReach :: READ, drawDeclared :: DECLARED_POOL, causalState x2, houseScale :: LADDERS, linkMentions, the
spatial and world-pulse memos, the PDF's two) is a MEMO: get, else compute, then set, so a copy recomputes the same
value. The three RECEIPTS (allegiance.js, goals.js, rareSecrets.js) are birth-time traces set by the generator, never
present on a page model that arrives as JSON, so identical on the served page and any copy. No `Symbol(` key on the
display, dossier, gallery or civility path. VEILED_GROUPINGS was the one identity-keyed mark carrying a veil decision.
(EXECUTED: the grep and the set/get sites read; PLAUSIBLE: that every memo's compute is pure, read from the pattern, not
each body.)

THE GIT HAZARD (the chair's 00:11 and 01:08 messages): checked before the push and after: `core.bare` false, user
"Claude", every commit of this seat authored by the harness identity, no repository variable (GIT_DIR, GIT_WORK_TREE,
...) in the environment; tests run from a plain shell; no push without something to send.
