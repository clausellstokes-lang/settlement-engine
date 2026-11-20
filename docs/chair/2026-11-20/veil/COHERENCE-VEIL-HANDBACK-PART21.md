# COHERENCE-VEIL — hand-back, part 21: the twentieth seat (R1 merged; VR25's derivers; then R2 to R7 and E)

Seat: VEIL-20, branch `lane/veil-20-2026-11-20`. Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-20.txt` (the seventh chair is session_019yED1SUxGVHyjQnoqoFvQ8). Every
database is a scratch native PostgreSQL 16.15 cluster in this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth,
unix socket `/var/tmp/rv7` only, `listen_addresses = ''`) or in-process. No hosted database, no production credential,
no `supabase` command, no deploy, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

PART 20 section 0, PART 19 section 0 and PART 18 sections 0 and 4 stand whole (VR1 to VR17, THE CLEARANCE STANDARD,
SV1). The laws and the push paragraph of `prompts/VEIL-17.txt` and the split, staff, hand-back and push paragraphs of
`prompts/VEIL-19.txt` bind word for word. The seventh chair's rulings VR18 to VR27, SV7 and SV8 as written in
`CHAIR-HANDOFF-SEVENTH.md` section 5 (read at the seat's start). This seat's mark is 450,000 used tokens (SV8).

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at the cut) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at the cut) |
| 212 at the cut | `dae0ae6c344daab243af4136a6932ebd7da8cfceabce6df3d95bddf75e19e247` / down `45da09eb5c8ab2e134d613d56afa0cbc700f14a66233f77520e6cd67cf30a1c9` |

212 is NOT final. This seat has not opened 212, its rollback or the twin's rule files (VEIL-19 holds them until it
hands back "B/C/D <commit>").

## 2. The cut, measured first (01:24 to 01:32 UTC)

THE CUT: the checkout held origin/lane/veil-19-2026-11-20 at dd20c0f08, two commits above 72e8a855d (9cbc2fa9f,
dd20c0f08); `git diff --stat 72e8a855d HEAD` touches only `docs/chair/` (PART 20 and a receipt), and `git diff --stat
bedd5a392 HEAD -- . ':!docs'` is empty: the code is bedd5a392's. So the branch is cut from dd20c0f08, as the chair's
note allows. All three readings of the base REPRODUCED on `git archive` of the cut (`/var/tmp/v18/base`):
- THE ACCEPTANCE RUN (REVIEW-VEIL-7 `run-all.sh`): exit 1; checks 37 | PASS 35 | FAIL 2; a07 and d06 the only FAIL rows;
  server against twin "(all 15 equal)" (the library's hand rows, not born towns: VR15 (c)). `out/v20/acceptance-at-cut.txt`.
- THE READER'S DIFFER, the twin (N=2, four shards): towns 140, with a hideable house 91, B kept a hideable house 0, threw
  0; every eye shut: 235 differ A/B in two towns or more, **IN THE CLASS 130** (CRIME-WORDED 28, OTHER 40, NUMBER/BOOLEAN
  49, HISTORY RE-DRAW 13), re-roll 94; the default veil 138 (29, 43, 49, 17). `out/v20/differ-twin-*-at-cut.txt`.
- THE SAME DIFFER THROUGH THE SERVER (a chain 001..212 of the cut, the gallery read): the reader's gate (empty registry,
  the VR13 rng ruling) **`registered 0 | diffuse 0 | rng-only 20 | UNREGISTERED 124`**. `out/v20/differS-gate-at-cut.txt`.

## 3. R1 MERGED AND READ (item 2)

`git merge --no-ff` of origin/lane/veil-r1-2026-11-20 at 8943ce807 (three commits, new files only, no conflict): merge
commit 3c3e458b6. READ LINE BY LINE: the module (651 lines, 147 rows), the export (`--check`, `--all` refused inside the
tree), the walker (arms A to F and the census's own control), the manifest row. At the merged tree, executed:
`--check` exit 0 (`out/v20/r1-check-at-merge.txt`); the walker and the manifest test 2 files, 21 of 21
(`out/v20/r1-walker-at-merge.txt`). THE GATE on the cut's server shards (R1 changes no behaviour, so the shards stand):
committed export `registered 0 | diffuse 0 | rng-only 13 | UNREGISTERED 131` (R1's 131 and 13, exactly); every row
exported (`--all`, outside the tree) `registered 108 | diffuse 23 | rng-only 13 | UNREGISTERED 0` (R1's figures,
exactly). `out/v20/r1-gate-new-gallery-{committed,all}.txt`. The link and master's shape: running.

WHAT THE READ FOUND FOR THE STAGES (no row is changed here; each is the stage's to build):
1. `economy.prosperity` is a `diffuse` row in R1's module; the chair's ruling of 01:20 UTC (PART 20 section 0 (5))
   withholds it on every non-owner read under VR19 and `history.founding.overcoming` follows it: R2 re-classes both
   (and `tile.prosperity`, a copy, follows by construction).
2. The hosts `_gallery_veil_tile_columns` and `_gallery_veil_chronicle` (rows `tile.*`, `chronicle`) are VEIL-DOORS's by
   SV7; this seat builds neither and will re-point those rows to DOORS's symbols at its merge.

## 4. The list (the assignment's, in order), as it stands

| Item | State |
|---|---|
| 1. First act, measured | DONE (section 2) |
| 2. Merge R1, read it, its gate | DONE (section 3): all four runs reproduced |
| 3a. VR25, the import's derivers | BUILT (section 5); two walker rows wait on the chair |
| 3b. R2's render-twice harness | BUILT, green 4 of 4 (section 5b); FIVE ROWS CALLED UNDRAWN ARE DRAWN: R2's |
| 3c. VR26's inversion harness | BUILT, green 4 of 4 (section 5c); SEVEN ROWS INVERT, `safetyLabel` among them: to the chair |
| 4. "B/C/D <commit>" | waiting on the chair |
| 5. R2 to R7 | not started |
| 6. VR17, DOORS | waiting on the chair |
| 7. E | not started |

## 5. VR25, the import (02:08 UTC)

MEASURED FIRST (`measure/vr25/derivers.probe.jsx`; `out/v20/vr25/derivers-72-default-veil.json`, 72 born towns, 27
with a hideable house, the default veil, every withhold-always path and prosperity deleted; and
`derivers-36-magic-off.json`). Per field: a recorder notes every read of a withheld path; FIDELITY is the deriver on the
full stored town against the stored value; SERVED-TOWN is the deriver on the served document of a town with nothing
hidden against the stored value.

| Field | Deriver (the engine's own) | Withheld reads | Fidelity | Served-town |
|---|---|---|---|---|
| compound (both copies) | `getInstFlags(config, institutions)` | 0 | 72/72 | 45/45 |
| safetyRatio | `generateSafetyProfile`'s rule over that compound | 0 | 72/72 | 45/45 |
| storageMonths | `foodSecurity.foodRecord.storageMonths` | 0 | 72/72 | 45/45 |
| prosperity (VR19) | `computeBaseProsperity` + `deriveProsperityLabel` | 0 | 59/72 | 32/45: the 13 Subsistence bases take a birth draw (Struggling or Poor) |
| readiness.score | `defenceExactOf` (the probe read it through `generateDefenseProfile`, whose economic cap reads prosperity) | 0 in the build | 72/72 | 45/45 |
| conditions' severity | `promoteStressorsToConditions` | through prosperity only | 72/72 | 35/45: the 10 are Subsistence towns, and both outcomes give the same modifier |
| legitimacy breakdown | `computePublicLegitimacy` | through prosperity only | 72/72 | 32/45 (prosperity's cause in the 13) |
| quarters | `generateSpatialLayout` (draw-free) | 0 | 72/72 | 45/45 |
| the cast's role and reason | none: the occasional roles take the seed | — | — | — |

THE BUILD: `src/domain/veil/importRederive.js :: rederiveServed` (and `rederiveInPlace`), called by
`src/store/galleryImportSettlement.js :: importGallerySettlementImpl` on the served document before the save. Each field
re-derived from the served document; an input the document cannot give (a Subsistence town's prosperity) is tried at
every value it can take and a field derived from it is kept only where all agree; else the field is left out: prosperity
and its legitimacy cause in Subsistence towns; the crisis cast's roles, absences and stakes on every import (a name with
no role would draw ": Name ·"). No config: every field left out.
THE TEST `tests/store/galleryImportRederive.test.js` (nine born towns through the tree's own import, the share withheld
by the registry's own withhold-always rows plus the chair's prosperity ruling): RED at the unwired import, 3 of 5 (the
ten absent on the importer's record; `out/v20/vr25/test-red.txt`); GREEN 5 of 5 (`test-green.txt`); arm 2's power by a
planted read of `blackMarketCapture`, red on every town, the file restored byte-identical (`test-plant-arm2.txt`).
GATES: eslint 0; `typecheck:domain:strict` 1113 of 1113; `typecheck:ratchet` 167 of 167 (`typecheck.txt`); the registry
walker 11 of 11; the import's neighbours 6 files, 46 of 46. THE `tests/lint` DIRECTORY (`lint-dir-summary.txt`): the
base's ten reds as R1 named them, and five of mine: three cured (`deepCloneHotPath`: the clone seam; the any-cast
baseline: zero `any` holes; `seedLoopTotality`: one loop asserting inline), TWO LEFT FOR THE CHAIR (`lint5-after-cures.txt`):
1. `ruinFilterRoster`: the module reads the served `.institutions` raw, as the birth derivers read it (the stamped
   roster, ruins included: `economicState.js`'s own note); proposed a `RUIN_AGNOSTIC_EXEMPT` row ("the import's
   re-derivation hands the engine's birth derivers the roster they read at birth") and the pin 116 -> 117, VR2's form.
2. `observedShapeReaders`: violations 1 at the cut (`osr-at-cut.txt`, criminalVeilSwitch's, not mine) -> 4
   (`osr-at-vr25.txt`): "magicExists on config" in `prosperity.js`, `foodGenerator.js`, `priorityHelpers.js`, because the
   scanner now grounds their `config` parameter from the import's call through the served document's config, which its
   corpus never saw carry `magicExists`. MEASURED: born and served configs carry `magicExists` (true, and false with magic
   off), and fidelity holds with magic off (36 of 36). A false finding of the heuristic; the inventory is never raised by a
   seat: for the chair (an explained-writer row, or another ruling).
THE SURPRISE SENT (02:0x UTC, before the build): the served `publicLegitimacy.score` gives back the withheld prosperity
(one contribution class fits the score in 72 of 72 towns, always the stored label's; 9 towns where the hidden house moved
prosperity told). Proposed: the score, label and colours re-classed under VR19 with prosperity. Awaiting the chair.

## 5b. R2's RENDER-TWICE HARNESS, VR16 (1) (02:30 UTC)

`tests/security/shareRenderTwice.pglite.test.jsx` (helper `tests/security/veilChain.shared.mjs`, shared with 5c): three
born towns stored with the DEFAULT veil on a pglite chain of every migration, read as anon by the CLIENT'S OWN
`src/lib/gallery.js :: fetchPublicDossier` (its sanitiser and veil seam; the party link through its unlisted slug), the
rpc routed to the chain; rendered by `PublicDossierView` (the player view), every group, sub-tab and disclosure, desktop
and phone; each panel's HTML compared, React's generated ids normalised. A = the served document with every
withhold-always row of the registry removed (the rows not marked drawn); B = A with each such path's STORED value grafted
back. ARMS: CONTROL (A twice byte-equal); RED (the safety band removed and grafted: B differs); MAIN (every row but the
known drawn ones grafted back: byte-equal on every surface, width and town); DRAWN (shrink-only). THE FIRST RUN FOUND
(`out/v20/rt/run1-first-measure.txt`), each row alone moving a byte on the visitor's page: **`conditions.severity`**
(Summary/Foundations' chips), **`defence.readiness.score`**, **`power.relation.direction`** (Systems/Power),
**`cast.stakes`** (the Plot Hooks tab draws the crisis hooks on the public page), **`cast.roles`** (one metropolis).
They are `KNOWN_DRAWN`: R2 classes each (a) or (b) and strikes it. GREEN 4 of 4 at the second run
(`out/v20/rt/run2-green.txt`, `render-twice-run2.json`). NOT REACHED (named in the file for R2): the campaign map's
member dossier; there is no export a non-owner can trigger (VR4 section 2b). The graft aligns arrays by length, else by
id, name or archetype; the unaligned counts are in the json (a row whose stored array the veil reshaped is grafted only
where it aligns: R2 should read them before it relies on the MAIN arm for an array row).

## 5c. VR26's INVERSION HARNESS (02:30 UTC)

`tests/security/rosterChoiceInversion.pglite.test.js`: eight born towns, the default veil, Reveal DM off and on, read as
anon by `get_gallery_dossier`. The visitor's re-derivation over the SERVED document: prosperity and the standing label
(`servedProsperityOutcomes`; a Subsistence base is not re-derivable, its town set aside), then `generateDefenseProfile`,
`generateSafetyProfile`'s band, `computePublicLegitimacy`, `composePublicProse`. ARMS: TOTAL (every diffuse row
re-derived or naming what is not served: food's two rows, the compositions, the conflicts, overcoming, DOORS's three
tile columns); FIDELITY (on the stored town every deriver reproduces the stored value: 0 unfaithful); RED (a served
score moved by hand is caught); MAIN (frozen, shrink-only). MEASURED (`out/v20/vr26/inverting-run2.json`): rows a visitor
re-derives otherwise ONLY where a house is hidden: **`defence.scores.internal`, `economy.prosperity`,
`economy.prosperityStanding`, `legitimacy.score`, `legitimacy.label`, `legitimacy.colours`, `safety.safetyLabel`** (VR8's
diffuse band: sent to the chair for a ruling). Six composed prose rows differ even where nothing is hidden (the composer
reads what the projection does not serve: "cannot be re-derived", R5's by VR12). GREEN 4 of 4 (`run2-green.txt`).
Both new pglite files took the manifest's `pglite-executed` rationale (VR1's form); the manifest test 10 of 10.

## 5e. THE CHAIR'S RULINGS RECEIVED (read 02:33 UTC; sent 01:35 to 02:29 UTC; each vetoable by the owner). THEY GOVERN THE SECTIONS ABOVE WHERE THEY DIFFER

- **VR28, THE TIERS (01:35; amends VR26).** TIER 1, blocking: no name, person, tie, sentence, crime-worded label or cause,
  sequence gap, door beside `data`, and no PRECISE figure carrying a hidden house's term reaches a non-owner read; the
  inversion test blocks these. TIER 2, recorded, not blocking: a COARSE BAND every town shows from a closed ordered
  vocabulary (safety band, prosperity band, stability word, readiness label) is sent as stored (VR8); the inversion test
  RECORDS its count. So `economy.prosperity` and `history.founding.overcoming` are DIFFUSE AGAIN; `compound.economyOutput`
  stays withheld on every read; the stability cause stays withheld on every read.
- **01:40: the legitimacy surprise is moot under VR28** (the prosperity band is served): `legitimacy.score/.label/.colours`
  are NOT re-classed. KEPT AS R5'S LAW, to be written into `derivedRule`: a served value composed from a withheld one is
  withheld or recomposed with it, NUMBERS INCLUDED; every composed row lists its numeric inputs (`legitimacy.score` its four
  labels, `breakdown.prosperity` prosperity); R6's inversion arm checks that no served composed value pins down a value
  withheld on every read. VR25 ACCEPTED as measured; THE CAST: "not known" accepted, recorded for the owner's list in plain
  words: AN IMPORTED CRISIS TOWN ARRIVES WITHOUT ITS CAST OF THREE. The chair's question, "on a Reveal-DM share does any
  non-owner page draw the cast?", is ANSWERED BY 5b, MORE STRONGLY: `cast.stakes` (and `cast.roles` in one metropolis)
  are drawn on the visitor's page with Reveal DM OFF (the Plot Hooks tab). So the cast is a DRAWN field, not
  withhold-always under VR16: BACK TO THE CHAIR (sent with the hand-back). For DOORS's merge: its section stands
  immediately before 212's "[212: RESTATED] public.get_gallery_dossier"; two in-place hunks inside that read (the chronicle
  line; the seven tile columns) are DOORS's: keep this lane's edits away from them.
- **01:55, then 02:09, then VR33 (02:14) for the defence row, FINAL:** `defence.scores.*` (ALL SIX) AND
  `defence.economicGates` are withheld on EVERY non-owner read on BOTH stored shapes, one rule (master's shape fails all
  six: internal 78, economic 52, disaster 37, magical 33, military 31, monster 28 of 86, control 0; gates 38 and 0); the page
  re-derives them (VR19 (c)). `defence.readiness.label`/colours: tier 2. **VR29, THE EVIDENCE KEYS:** R3's withholding of
  a `crimeTypes` or `criminalInstitutions` entry leaves each key an ARRAY (empty where nothing is left); ONLY the shut
  grouping `block:defense.criminalStructure` deletes the keys; R3's born test holds both arms; if an empty array tells
  more than a town with no crime, say so first. **VR31, SHARES SUM OVER WHAT IS SERVED:** income percentages and faction
  power recomposed whenever ANY member is withheld (house hidden, grouping shut, row withheld always); FINAL holds 100 on
  the control too (the old tip: 6 of 50 control towns short). **VR32:** a figure that EQUALS its re-derivation from served
  values passes (storageMonths, resilienceScore, legitimacy.score). As registered, R2's and R5's: `conditions.severity` and
  `severityBand` are served raw at the base though registered withhold-always.
- **02:14, four answers:** VR25 at db97168dd TAKEN. `ruinFilterRoster`: GRANTED in VR2's form: APPLIED in this push (the
  row, the pin 116 -> 117; the walker 12 of 12). OWED WITH IT: a born town given a RUINED house, imported: for each of the
  ten, does the re-derived value mis-draw against that town's own recomputed one; where it does, left out, not drawn wrong;
  the count to the chair. `observedShapeReaders`: NO RAISE and no exemption for a false positive: cure BY OBSERVATION (show
  the scanner's corpus a served config carrying `magicExists`, true and false); only if the walker has no door for that,
  an explained-writer row naming the writer and the measure (36 of 36). The count stays 1. NOT DONE BY THIS SEAT.
- **02:20, VR27 AMENDED:** 212 revokes by name ONLY the helpers 211 and 212 create (`_gallery_veil_*`, `_gallery_doors_*`)
  and `_gallery_public_tile_rows()`; the eight older invoker helpers go to SEC-GRANTS's migration 213. A helper this lane
  adds, called only inside the definer reads, is revoked from public, anon and authenticated by name in the commit that
  adds it. VEIL-DOORS handed back PARTIAL (cca49cb8d): NOT merged; VEIL-DOORS-2 (`lane/veil-doors-2-2026-11-20`) finishes
  it; merge "DOORS <commit>" only from that branch, on the chair's word.
- **02:25, "VR17 81dd06d7e"** (supersedes efca35fd6; no file of src/ or scripts/ beyond efca35fd6's): merge it `--no-ff`
  AFTER B/C/D. Its stored figure: the lighting census +2 files. V10-2 has its own seat (VEIL-V102); merge "V10-2 <commit>"
  after VR17 on the chair's word.
- **02:29, "B/C/D e62fabb2e"** (origin/lane/veil-19-2026-11-20; 212 sha256 fec111c2…4acea3; the six guard files 127 of
  127; the acceptance run EXIT 0, 37 of 37): NOT MERGED BY THIS SEAT (the mark). With it, ruled: (1) eight reds not this
  lane's, `criminalVeilSwitch.test.js` VS1 (b) and (c): VEIL-V102's, named, not touched; (2) VR35, V10-5's positive account
  REFINED: a catalogue hideable name is accounted for by a served house OR A SERVED POWER whose folded name equals it;
  RE-MEASURE first (what is dropped must only name a hidden or absent house), the count and five examples to the chair
  before building; MED, after R2; (3) VR36, THE COST LAW's named rows gain the Reveal-DM gallery read of the largest born
  town (Albaorum, 499 KB), bound: twice 211's Reveal-OFF read of the same town (570 ms on that box; 1.6 times now): every
  stage touching 212 times it; (4) `incomeWeight` is R5's (VR12); (5) VR31: D re-derives where ANY row went (confirm 100
  on the control towns); FACTION POWER is not in D: this lane's.

WHAT THE RULINGS CHANGE IN THIS SEAT'S PUSHED WORK (for the successor, before R2):
1. `src/domain/veil/importRederive.js` step 4 RE-DERIVES prosperity and drops it where a Subsistence base leaves it
   unknown. Under VR28 the prosperity band is SERVED: the import should keep the served band where present and fall to
   the re-derivation only where it is absent (the dependent steps then read the served band; `underEachOutcome` keeps
   working with one outcome). `history.founding.overcoming` likewise is served. A small change with its own red first.
2. `tests/security/rosterChoiceInversion.pglite.test.js`: its KNOWN_INVERTING list is now TIER 2's recorded residual for
   the bands (prosperity, prosperityStanding, safetyLabel, legitimacy label/colours) and TIER 1 for the numbers
   (`defence.scores.internal`, `legitimacy.score` passes by VR32 per the reader; this seat's harness counted it inverting
   because its re-derivation used the RE-DERIVED prosperity: with the served band it is equal). R6 splits the arm by tier.
3. `tests/security/shareRenderTwice.pglite.test.jsx`: KNOWN_DRAWN stands as measured; `cast.stakes`/`cast.roles` drawn
   is the answer to the chair's cast question (above).

## 5d. HANDED BACK AT THE MARK (02:3x UTC)

THE MARK: `get_session` reads `used_tokens 0` in this container (the field is not reported); by the seat's own count
it stands near 400,000 of SV8's 450,000, so the seat hands back after this push. Nothing is running. Every commit is
pushed (the tip: the commit carrying this file). 211's two files untouched (proved at the cut and at the last commit);
212, its rollback and the twin's rule files NOT OPENED by this seat.
DONE: items 1, 2, 3a, 3b, 3c. THE CHAIR ANSWERED (i) and (ii) and sent (iii) before this seat's hand-back reached it: SECTION 5e. LEFT FOR THE
SUCCESSOR from it: item 4 ("B/C/D e62fabb2e", then "VR17 81dd06d7e"); the cast question back to the chair (drawn on
Reveal-off pages); the ruined-house import measure; `observedShapeReaders` cured by observation; the import's
prosperity kept as served (5e point 1).
FOR THE SUCCESSOR, in order: item 4 (merge VEIL-19's final tip on "B/C/D <commit>", the acceptance run must exit 0);
item 5 R2, which now has its proof machinery: build the withhold-always rows in 212 and the twin; class the five
KNOWN_DRAWN rows (a)/(b) and strike them; re-class prosperity and overcoming (the chair's 01:20 ruling) and whatever the
chair rules on the seven inverting rows; the gate's count before and after. The stored figures this seat's files move
(the lighting census +4 files: R1's walker, the import test, the two pglite tests; the test ratchet) are taken ONCE at
the merged tree (item 6).

## 6. How the instruments are re-made

PART 20 section 4, at the same paths: the cluster `/var/tmp/v18pg` (socket `/var/tmp/rv7`, `fsync = off`); `pg@8.13.1`
in `/var/tmp/v18/pgmod`; the readers' library `git archive 72a3bb24f …REVIEW-VEIL-6 …-7 …-8` (fetch
`lane/review-veil-3-2026-11-12` first) and `git archive origin/lane/review-veil-9-2026-11-19 …REVIEW-VEIL-9`, both into
`/var/tmp/v18/lib`; the reader's probes copied flat into `/var/tmp/v18/rv9` with the three `/var/tmp/v16/rv9/` imports
re-pointed; the base `/var/tmp/v18/base` = `git archive` of the cut, `node_modules` linked; master
`/home/user/wt/master` (a detached worktree at db832c892, `node_modules` by `cp -al`); R1's runner
`run-differ-server2.sh` copied to `/var/tmp/v18/`. Outputs under `/var/tmp/v18/out/v20/`.
