# R2 HAND-BACK (VEIL-21's R2 builder, branch `v21-r2`, base cfd77fdef)

**STATUS: NOT GREEN. Stopped at the context mark. Guard reds below are R2's own and UNRESOLVED; do not merge as is.**

CONFIRMED = executed here, output kept in this folder. PLAUSIBLE = inferred, not executed.

## Measure first (CONFIRMED; scratch probes, the table in the session, both stored shapes via `/home/user/wt/master`)
- At the base every R2 row was present on every non-owner read (gallery, link, import, map member; marked and unmarked;
  Reveal DM off and on; new and master's shape), except `safety.blackMarketCapture` (withheld by the default veil's
  grouping, sent unmarked) and `npcs.stressNote` (stored on none of the probe's towns). `income.weight` (D's) was SENT on the
  campaign map's UNMARKED member (D reached the gallery read and the import only): R2's rule covers it.
- Drawn on the visitor's page (render probe, three born towns, desktop and phone): `conditions.severity`, `defence.readiness.score`
  (Summary/Foundations chips: the chip vanishes when absent), `power.relation.direction` (Systems/Power chip), `cast.stakes`
  (Plot Hooks: a fallback sentence takes its place), `cast.roles` (Plot Hooks, one metropolis), five of the six
  `defence.scores.*` (Overview bars, Foundations, Defense tab: absent draws **"Critical" / 0%**, a WRONG figure, not a blank),
  `compound.economyOutput` (Economics header tile), `power.stability` (Power: blank when absent). Not moved: `scores.disaster`,
  `economicGates`, `safetyRatio`, `blackMarketCapture`, `severityBand`. `economicGates` IS drawn on the soak corpus
  (publicProseEquality soak1k-3, -9: the Defense tab's law and guard lines).
- THE IMPORT (VR16 (2)): the importer's own app draws the scores everywhere (DefenseTab `scores.x||0`, OverviewTab bars,
  `guardPayOf` reads `economicGates.military`): without them it would draw 0s. COVERED by the import's re-derivation:
  `importRederive.js` step 5b, `generateDefenseProfile` over the served document under each prosperity outcome, left out
  ("not known") where the outcomes disagree. No field came to the seat uncovered.

## Built
212 :: `_gallery_veil_withhold_always` (+ `_gallery_veil_minus_at`, `_each_minus_at`, `_cast`, each revoked by name),
run by 211's `_gallery_veil` RESTATED in 212: last on every veiled body, and on an UNMARKED listing's projection returned as
`body` (so the map's member, whose expression takes `body`, gets it without touching `get_gallery_map`). Rollback restores
211's `_gallery_veil` verbatim and drops the four. Twin: `src/domain/display/galleryWithholdAlways.js :: withholdAlways`
(called by `applyVeil` last and `projectShareVeil`'s unmarked path) and `gallerySecondHomes.js :: withholdCastByServed`.
Page: `src/domain/veil/pageRederive.js :: rederiveForPage` (called by `gallery.js :: fetchPublicDossier`, `fetchGalleryMap`).
Rows built (57 at `public._gallery_veil_withhold_always`): every row hosted there (see the registry), with
`defence.scores.*` (6) and `defence.economicGates` RE-CLASSED from diffuse (VR33), `income.weight` (D's, now also the map),
`power.stability` (the band word stays), `cast.stakes`/`cast.roles` (per entry). The five BAND_CONDITION rows built, so
every diffuse row is exported (25 of 25). `power.relation.direction` NOT built (it follows R3's `power.relation.entry`).

## VR37 table
| row | class | what the page shows after |
|---|---|---|
| conditions.severity | withheld always; `severityBand` tier 2 (diffuse, as stored) | the chips from the band (`defaultSeverityForBand`) |
| defence.readiness.score | withheld always, page re-derives | the engine's score over the served document (= stored where nothing hidden) |
| cast.stakes | (b) per entry: stays where its `factionId` is a served power | as before on every town measured (no power withheld before R3) |
| cast.roles | (b) per entry: stays where it names a served person/power/house | as before on every town measured |
| power.relation.direction | (b) with its relation (R3's `power.relation.entry`): not (a), because it is chosen by the legitimacy flags, withheld always, so no served field re-derives it; the word left is a closed vocabulary (VR28 tier 2) | as before |

## Receipts
- RED (`red.txt`, base cfd77fdef as a git-archive copy): MAIN 2,470 rows sent; GREEN (`green.txt`): 7 of 7.
- Render-twice: `KNOWN_DRAWN` empty, 4 of 4. Inversion 4 of 4; `KNOWN_INVERTING` lost `defence.scores.internal`; left:
  `economy.prosperity`, `economy.prosperityStanding`, `safety.safetyLabel`, `legitimacy.label`, `legitimacy.colours` (tier 2
  bands) and `legitimacy.score` (a number: per PART 21 5e it passes by VR32 once the visitor uses the served band; R6).
  The harness's visitor now reads the stores' months from the served food record (as the page does).
- Registry `--check` 0; walker 11 of 11. Acceptance: EXIT 0, 0 FAIL (`acceptance/run.txt`). typecheck domain-strict
  1113/1113, ratchet 167/167; eslint 0 (`eslint.txt`).
- Guards (`guards-pglite.txt` + `.full.log`): 12 of 14 files green (VeilCures, SecondHomes, Sanitizer, MapMemberCount,
  SignalCopies, both harnesses, the born test, allegiance, seed leak, saved maps, totality); **RED, R2's, NOT DIAGNOSED:**
  `galleryServerVeil.pglite.test.js` 11 (each town's "nothing the page hides is sent" arm, and "a share past the client's
  clamp") and `galleryVeilHandRows.pglite.test.js` 1 (V7-2 "no event, no tie: an annotation…": PLAUSIBLY because
  `history.legacyAnnotations` now leaves whole on every read, so the arm finds nothing to judge). Probable for ServerVeil:
  its twin-vs-server or unmarked-equals-projection expectation meets the new unmarked `body` (PLAUSIBLE).
- **RED, R2's:** `publicProseEquality` defense soak1k-3 and -9: two Defense threat-row lines ("a court to hear it and a
  cell…", "would struggle to hold against … raiders") are missing on the shared page. The page's re-derived scores,
  readiness and gates EQUAL the stored on those towns (CONFIRMED, scratch probe), so the line reads another withheld input
  (not found: `defenseStateProse.js :: defenseThreatProse`, DS-DEF-2).
- Non-pglite neighbours (`guards-nonpglite.txt`, rerun files): 74 files, the rest green.

## Reds left, attributed
- `criminalVeilSwitch.test.js` VS1 (b)/(c): KNOWN (VEIL-V102's); its (b) now ALSO lists "safety blackMarketCapture" on
  every birth (withheld on every read by VR19 ruling 2): the switch's seat's expectation should follow the ruling.
- `ruinFilterRoster` exempt-honesty on gallerySecondHomes.js: at the base already. NEW ROW for the chair's grant:
  `pageRederive.js` RUIN_AGNOSTIC_EXEMPT, pin 117 -> 118.
- `tuningRegister`: KEEP_TUNING / KEEP_SCALE_TUNING "dependents moved" (pageRederive.js and importRederive.js import
  keep.js; no value moved). The refreeze ritual refuses a dirty tree: OWED at the clean tip (the seat).
- Test expectations changed by the ruling: publicSafe.test.js (`rawPower`), publicProseEquality (the black market's panel
  is not drawn on a shared page: VR19 ruling 2; the shared page now runs the page's re-derivation).

## R5's law (named, not built)
Served composed values from a withheld number: `prose.threat.economic` (its sentence chosen by `scores.economic`'s band),
`prose.conditionSeverity` (from the severities), `prose.wall.rationale` (readiness label: tier 2). The page's re-derived
scores equal the served town's own, so none pins a HIDDEN term beyond what the served document implies (PLAUSIBLE).

## Not done (PLAUSIBLE / owed)
- THE COST (CONFIRMED, `cost.txt`, medians of 5, x211 | base | after): V8-3 row 5395 | 6474 | 6157 ms; 50/500/500
  100 | 175 | 172; 300 KB rows 314 | 357 | 341 and 1111 | 1227 | 1198: every row within twice 211, after <= base.
  The Albaorum big-town row NOT RUN (`/var/tmp/v18/out/b2/r5-big.json` is not in this container).
- The twin's cast wording differs from the server's at the base already (a twin-laxer class, R7's); the born test compares
  the cast by the keys R2 decides.
- 212 sha256 after: 05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10; rollback 1454f8f3fa53943130a22d412152e0eddcf3e05684b3cf01f62e77c069e2a66e. 211 and its rollback unchanged (eface6d0…0be01, ce8474ff…712f). The rollback pin (galleryVeilCures) green.
