# R3-CURE-8 HAND-BACK (VEIL-27's builder; ruling 55; worktree `/home/user/wt/r3c8`, branch `v27-r3c8`, from 5f45144ae)

## STOPS AND FIRST LINES

1. **STOP (a finding, BOTH engines alike, not cured here: not a parity break, so not this brief's to cure).** In every family but
   `criminal`, a services row whose `institution` holds a hidden house's name in another spelling (the hand plant's
   `'(street gang)'` beside the hidden "Street gang") is SERVED by both engines with the `institution` key taken off by the
   name sweep: a key-level husk (ruling 42's class; ruling 47's "leave the key off" covers only `contestsNiche` and a person's
   affiliation keys). CONFIRMED on the plant (walker table below: 10 families plus the custom one, 25 of 25 reads, both
   engines). PLAUSIBLE that no born town reaches it: every synthetic `'(…)'` provider the generator writes is in the criminal
   family (servicesGenerator.js), and a catalogue row carries its house's exact name, which the apply's services pass removes
   (both engines); not measured over the born pool. The seat rules whether a non-criminal swept row leaves whole.
2. **212 CHANGED, BEHAVIOUR NOT.** 212's roster pass already withheld a criminal row with no `institution` key, by SQL's null
   (`e -> 'institution'` is null where the key is absent; `not (true and null)` is null; a null WHERE drops the row). The cure
   STATES it (`not (e ? 'institution') or …`) so a later reader cannot "fix" the null toward sending. Truth table, old and new
   predicate, eight values (object without the key, `institution` null / '(covert)' / 'x' / 7, a string, JSON null, an array):
   kept identically (only the keyless object and '(covert)' leave). The seat may drop the 212 hunk and keep 212 at
   `6260803d…0218`: the twin's cure alone turns the red green (m2 measure: 212 at the tip already serves `[]`). No new helper
   (VR27 not engaged).
3. The R3 describe's boot hook stands at its deadlock guard (900 s): my first red run added the reads there and timed out
   under the box's load (the other builder's four shards, load 7 to 9 on 4 cores). The R3-CURE-8 arms have their OWN describe
   and pglite chain in the same file; the hook boots and births only, each town's reads run in its own arm.

## UNIT 1: MEASURE FIRST (the rule for a row with no `institution` key, family by family, both engines)

Instruments: `measure/m1.probe.jsx` (the ten towns, twin and server, five settings, Reveal off and on; `m1-ten-towns.txt`),
`measure/m2.probe.jsx` (212 stage by stage on the twin's own projection; `m2-stages.txt`). Where each engine decides:

| stage | families | 212 | twin | differ |
|---|---|---|---|---|
| the apply's services pass (`_gallery_veil_apply` / `galleryVeil.js :: applyVeil`) | every | row kept (`_gallery_veil_str(null)` = '', never a house name) | kept (`str(undefined)` = '') | no |
| the name sweep (`_gallery_veil_name_sweep` / `gallerySecondHomes.js :: sweepHiddenNames`) | every | takes a key whose string holds a hidden name; a row left keyless | the same | no |
| `block:services.criminal` shut (211 grouping / `GROUPING_REMOVERS`) | criminal | the family leaves whole | the same | no |
| the roster pass, a house hidden whole (`_gallery_veil_roster_choices` / `galleryRosterChoices.js :: applyRosterChoices`) | criminal | **withheld** (null WHERE) | **served** | **YES: the twin sent more** |
| the roster pass | every other | untouched | untouched | no |
| the unmarked path (nothing hidden whole: `whole` false) | every | untouched | untouched | no |
| withhold-always (`_gallery_veil_withhold_always` / `galleryWithholdAlways.js`) | every | untouched | untouched | no |

Grouping open and shut: with `block:services.criminal` shut the family is absent in both; open (own, g:1xx, show-everything),
the roster-pass difference shows. The rows that reach the roster pass keyless at birth: the sweep's work on `'(street gang)'`
("Muscle for hire", "Protection racket") and `'(thieves guild)'` ("Fence (stolen goods)"). 212 never sent more anywhere.

## UNIT 2: THE READS THAT SEND THROUGH THE TWIN

| surface | audience | engine deciding the rows | file :: symbol |
|---|---|---|---|
| gallery page, a share the server did NOT veil (no 211 marker in the response: a server without 211/212 deployed) | anyone | **TWIN** | `src/lib/gallery.js :: sanitizeDossier` → `galleryVeil.js :: projectServedVeil` → `projectShareVeil` |
| party link (unlisted), no 211 marker (same condition) | the players | **TWIN** (the default veil written client-side) | `gallery.js :: fetchPublicDossier` (unlisted branch) → `sanitizeDossier({partyLink})` → `projectShareVeil` |
| gallery page / party link, server veiled (211 marker `v: 2`) | anyone / players | server; the twin re-runs groupings only (removal; `applyRosterChoices` sees nothing hidden whole) | `projectServedVeil` → `applyVeil(body, groupings)` |
| gallery page, unmarked share on a 211 server | anyone | both, alike (no house hidden whole) | `projectShareVeil` unmarked path; 212 `_gallery_veil` res null |
| import | the importer | server body (`import_gallery_dossier`); client strips the seed only | `gallery.js :: fetchDossierForImport`, `store/galleryImportSettlement.js` |
| campaign map member | anyone | server body (`get_gallery_map`); client re-derives only | `gallery.js :: fetchGalleryMap` → `rederiveForPage` |
| og card, page meta | crawlers | server (`get_gallery_dossier`, `get_unlisted_dossier`) | `supabase/functions/og-image/index.ts`, `api/gallery-meta.js`, `api/meta-shell.js` |
| curate screen, share controls, the switch | the OWNER | twin (owner's preview, not a non-owner read) | `CurateMode.jsx`, `useGalleryShareControls.js` (`galleryPayloadFor`), `criminalVeilSwitch.js` (`applyVeil`) |

CONFIRMED by reading the code. PLAUSIBLE (not measured): which servers lack 211/212 today (the deploy is the owner's
hand); on such a server the import and the map member carry NO veil at all (the server's sanitizer only), a wider gap 211
closes, not the twin's.

## UNIT 3: RED FIRST (committed 9a7ec395c)

`tests/security/galleryRosterChoices.pglite.test.js`, describe "R3-CURE-8 (ruling 55)": one arm per town of the ten, one for
the hand plant (`handSvcOf`: per family a row born keyless, a row the sweep leaves keyless, a served house's row, the hidden
house's row). Ten settings (own, g:000..g:110, allOpen, off) x Reveal off/on; gallery at each, link/import/map at own: 25
reads per town. VR45: `canon` (keys sorted), arrays exact. At 5f45144ae: **11 of 11 arms RED**, 15 differing reads per town
(every setting with the criminal grouping open), every one "twin more" criminal keyless rows, server more none
(`red.full.txt`, `red-measures.txt`).

## UNIT 4: THE CURE (6ab434b2c)

- Twin `src/domain/display/galleryRosterChoices.js :: applyRosterChoices`: a criminal row that is an object without an own
  `institution` key is withheld, beside '(covert)'.
- 212 `_gallery_veil_roster_choices`: the same rule stated (STOP 2).
- GREEN: 12 of 12 R3-CURE-8 arms (`green.full.txt`): 0 differing reads; keyless criminal rows served: server 0, twin 0.

## UNIT 5: THE PARITY WALKER (8cdd37e7d)

Families from `servicesGenerator.js :: generateAvailableServices` at all four sizes: lodging, food, equipment, magic,
information, healing, transport, legal, employment, entertainment, criminal; plus a custom family (`curiosities`,
economyReconcilePass.js writes `availableServices[typeKey]`). The ten born towns' families are all in the list. Per family,
reads where server/twin serve the keyless rows: every non-criminal family 25/25 served by both (born keyless and swept);
criminal 15 reads served by neither (10 reads: the family shut). Faults 0.
TEETH (`walker-scratch.diff`, never committed: the twin's rule taken back out): RED, 45 faults, criminal alone
(`walker-scratch-red.txt`, `walker-scratch-red-measures.txt`); the cure restored by hand, `git diff` empty after.

## UNIT 6: GREEN

Every vitest run one file set, `--maxWorkers=1`, through `scripts/gate-tail.sh`, GIT_* unset; files under `out/v27/r3c8/`.
- R3's born test WHOLE: 37 of 37 (`born-green.full.txt`, `born-green-measures.txt`; 1,179 s).
- `galleryServerVeil` + `galleryVeilHandRows`: 43 of 43 (`green-sv-handrows.txt`).
- The three harnesses (as read; PLAUSIBLE below): shareRenderTwice + rosterChoiceInversion 8 of 8
  (`green-harnesses.txt`); `rosterChoiceRegistry.mjs --check` exit 0 (`registry-check.txt`); the registry and pools walkers
  17 of 17 (`green-walkers.txt`).
- THE GATE (`out/v25/r3c5/measure/gate.sh`, template `c8_gtpl` = v27x211 + this 212, N=2): EXIT 0; 140 births, 92 with a
  hidden house; HIGHER 0, EQUAL 79, LOWER 13, every engine and Reveal setting, the same thirteen towns as the seat's
  16:57 re-run (`gate-table.txt`, `gate-run.txt`).
- THE ACCEPTANCE RUN (run-all-v27.sh, last, no other job on v27x211/v27x212): EXIT 0, 40 PASS, 0 FAIL (`acceptance.txt`;
  responses `/var/tmp/v18/out/v27/c8acc`).
- eslint on the touched source and test: exit 0 (`eslint.txt`).
- sha256 (`hashes.txt`): 211 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (unchanged);
  212 `1c15e3acf2d45ab71d59ffa31290de9faf4ce115b20a34c8b4b3250fd8a2ebc7` (was `6260803d…0218`); no new 212 helper, so
  VR27 has nothing to revoke; the rollback is untouched (no function added).

## CONFIRMED vs PLAUSIBLE
- CONFIRMED (executed): the rule and the place (m2: 212's roster pass); the red (11/11) and the green (12/12); the walker and
  its teeth; the truth table; eslint; the hashes; GREEN rows above as listed.
- PLAUSIBLE: no born town reaches STOP 1's non-criminal husk; which servers lack 211/212 today; "the three harnesses" read
  as shareRenderTwice, rosterChoiceInversion and the registry check with its walker (the brief does not name them).

COMMITS: 9a7ec395c (red: tests/security/galleryRosterChoices.pglite.test.js; out/v27/r3c8/red.full.txt, red-measures.txt,
measure/m1.probe.jsx, m2.probe.jsx, m1-ten-towns.txt, m2-stages.txt); 6ab434b2c (the cure:
src/domain/display/galleryRosterChoices.js, supabase/migrations/212_share_veil_later_cures.sql); 8cdd37e7d (the walker:
the test file; out/v27/r3c8/green*.txt, walker-scratch*); the hand-back commit (this file and the green records:
born-green*, green-sv-handrows.txt, green-harnesses.txt, green-walkers.txt, registry-check.txt, gate-table.txt,
gate-run.txt, acceptance.txt, eslint.txt, hashes.txt). 212 sha256 `1c15e3acf2d45ab71d59ffa31290de9faf4ce115b20a34c8b4b3250fd8a2ebc7`.
