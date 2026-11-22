# R3-TELL-8b HAND-BACK (VEIL-32's second builder; worktree `/home/user/wt/r3tell8b`, branch `v32-r3tell8b`, from b6b6b723e)

This sitting: unit (viii), steps 2 and 3 assigned. **NO RED AND NO CURE WRITTEN** (the STOP below). Nothing in `src/`,
`supabase/` or `tests/` changed. This file is the only thing committed.

## STOPS (first)
1. **THE MARK, REACHED BY THE READ-WHOLE LAW ALONE (the brief's "more than this brief names ... say so and stop", and its
   "if the cure outgrows it").** The law's three files are 389 KB together: 212 274 KB (3,170 lines), the registry 76 KB, the
   twin 39 KB. Read WHOLE, as the law binds, they took about four fifths of the 250,000-token mark before any edit was
   allowed. What was left could not build the three reds (an arm over 140 births on both engines, a pglite test over seven
   causes and a control, a census walker) and a two-engine cure with its own reds, the build figures and `tests/lint` whole,
   to this lane's standard. A half-built red in a security lane is worse than none, so I wrote none.
   **THE SEAT'S CALL, PROPOSED:** split unit (viii) across sittings. Sitting A: the reds (i), (ii) and (iii), committed red.
   Sitting B: the cure (1) to (4) with galleryVeil.js's red and its converse. Each sitting reads the law's three files whole.
   The map below lets sitting B go straight to the edit points.

## READ-WHOLE LAW, SAID PLAINLY
- READ WHOLE, every line: `supabase/migrations/212_share_veil_later_cures.sql` (lines 1-3170, the character tables
  `_gallery_veil_name_bound`, `_name_pad`, `_name_case` and `_name_prep`'s skew map included), `src/domain/veil/rosterChoiceRegistry.js`
  (1-662), `src/domain/display/galleryRosterChoices.js` (1-494). Also read whole: the brief, `briefs/R3-TELL-5-BRIEF.md`,
  `out/v31/tell7/TELL7-HANDBACK.md`, `out/v32/tell8/TELL8-HANDBACK.md`.
- NOT READ (no edit was made, so the law did not yet bind them): `galleryWithholdAlways.js`, `safetyProfile.js`,
  `pageRederive.js`, `importRederive.js`, `galleryVeil.js` (only its `GROUPING_OPEN_EVIDENCE` row, 863-869), PART 30/32/33's
  rulings, the step-1 probes, the door walker. Sitting B must read each one it changes WHOLE.

## THE CURE'S EDIT POINTS (read from the files at b6b6b723e; for sitting B, PLAUSIBLE until built)
- **(1) 212, the always-rule.** `_gallery_veil_withhold_always` (1943-2071): add
  `-- registry: safety.crimeTypes` and `economicState,safetyProfile` minus `crimeTypes` beside the existing
  `safety.blackMarketCapture`/`safety.safetyRatio` line (1988-1990). It runs last on every body, and on the unmarked
  projection too (`_gallery_veil` 2698-2701, 2712), so the gallery read, the import, the link and the map's member all lose the key.
  No new function, so the rollback is unchanged. The twin's `withholdAlways` gets the same rule with `// registry: safety.crimeTypes`.
- **(1) 212, the attribution block LEAVES.** `_gallery_veil_roster_choices` 2597-2605 (the `-- registry: safety.crimeTypes`
  filter); twin `applyRosterChoices` 298-303. The `raisers` map (2185-2199) and the twin's `CRIME_TYPE_RAISERS` (33-46) STAY:
  the services rule's `acc_types` (2504-2507; twin 231-233) reads `pub`'s list by them. `pub` is the projection before the
  veil, so it still holds the stored list after the cure, and the services rule moves no byte. TO CHECK IN SITTING B:
  `tests/lint/rosterChoiceRegistry.walker.test.js` binds each built row to its host's `registry:` marker. The row's host
  changes (H.sChoice/tChoice to H.sAlways/tAlways). The `-- registry: safety.crimeTypes` comment at 2185 (above `raisers`)
  may then name the row in a host that no longer hosts it. Read the walker before deciding whether that marker stays.
- **(1) The registry row** (rosterChoiceRegistry.js 324-325): `rule: 'withhold', when: 'always', page: 're-derive'`,
  `server: H.sAlways, twin: H.tAlways`, scope rewritten with ruling (b). `REGISTRY_SITES` rows naming `safety.crimeTypes`
  (597, 609-611, 652, 654, 655, 659) stay valid: the writer is unchanged.
- **(2) The grouping evidence** (galleryVeil.js 863-869): today it needs BOTH `criminalInstitutions` and `crimeTypes` to be
  arrays. Once the key leaves, it reads false on every shared page, and DefenseTab's `crimeVeiled` shuts the block. Narrow it to
  `criminalInstitutions` alone (TELL8 1e: proven on 6,528 of 6,528 pages). Red first: a page with the grouping open must not
  read shut once the key is gone. Converse: a shut grouping stays shut.
- **(4) The merchant-army hook, both engines.** 212's `hooks` map 2210 and 2212, and twin `SAFETY_HOOK_RAISERS` 58 and 60, both map
  it to `hasGangInfra`. The engine raises it on `merchantArmy = (economy >= 68 && military <= 38) && (hasMerchantGuild ||
  hasBank) && (hasMercenary || hasGangInfra) && fires(55)` (priorityHelpers.js 564-567). The priorities and `fires(55)` read
  the config alone, not the houses, so a SQL form needs no hash (INFERRED; not executed): "raised by a hidden house" =
  `pub`'s stored `safetyProfile.flags.merchantArmy` is true (or unsure) AND the served flags (`sfl`, recomposed by item C)
  no longer give `(hasMerchantGuild or hasBank) and (hasMercenary or hasGangInfra)`. The hook map then names
  `merchantArmy`, and `raised` carries it in both engines. `pub` keeps the stored flag because withhold-always runs on `doc`
  only. Measure it on the pool before building: TELL8 1f found the stored flag true on every page of occupied-0-65.
- **(2)/(3) The reader:** pageRederive.js and importRederive.js are not read this sitting. TELL8's first-paint note
  (gallery.js already imports pageRederive.js, which already imports `generateSafetyProfile` statically) must be measured by
  `npm run build` and `VERIFY_DIST=1` before and after.

## PROGRESS
- RESUMED by VEIL-32 (mark raised to 600,000; STOP 1 above is answered: sitting A then sitting B in this same session).
- (viii) crimeTypes withheld always, the page re-derives, measure ebdeb3f30, reds: (iii) walker c325d9e59; (i) the arm <this commit>
  (tip: HALF 1 3,728/6,528 pages, HALF 2 644 pages = 32 gated towns by [type, desc], 25 by type, 1 control; hook 20
  shortfall pages on metropolis-occupied-0-65; parity 0; ruling 88: 4 pages, all at g:010, village-under_siege-0-8;
  `out/v32/tell8b/arm-tip/`, `gunzip -k` the shards before `node measure/arm-an.mjs arm-tip`); (ii) the pglite test <this commit> (tip: 1 failed of 1 in
  311 s; HALF 1 272, HALF 2 184, hook 22; the anti-vacuity and teeth arms hold); (iv) the evidence red and its converse <this commit> (tip: 1 failed, the
  converse 1 passed); cure not started.

## RECEIPTS
- 212 unchanged: `8688ddb6148e84baaeee6f9cdcd89fec40a382c390f44133affa15ae66cc5a3a`. No template made, no database touched, no
  heavy run, no test run (no test file changed, so `tests/lint` was not owed), nothing pushed.
- Ruling 88's question (how many of the 6,528 pages change by the reader-over-the-served-page ruling alone, by setting) is
  not answered. TELL8's measure gives 4 pages (r3m-village-under_siege-0-8, g:010, off and DM, both engines) by TYPE.
  Re-count it by [type, desc] and by setting, from `out/v32/tell8/m1/`, in sitting A.

## CONFIRMED vs PLAUSIBLE
- CONFIRMED: the three files read whole; 212's sha256; the line anchors above (read off the files at b6b6b723e); the
  evidence row's two-array test; the merchantArmy rule's text.
- PLAUSIBLE: every edit point's effect (nothing built or run); that the services rule moves no byte (it reads `pub`, by the code);
  the hash-free SQL form of the merchant-army raise.

## FOR THE OWNER, in plain words
The new builder was asked to write the tests that fail first, then the fix. The lane's rule says the builder must first read
three long files from start to finish. One of them is the 3,170-line database change. That reading used up most of the
builder's working budget before any edit was allowed. Rather than leave a half-made security test, the builder wrote down
exactly where each part of the fix goes and stopped. The seat should split this unit into two sittings: one for the failing
tests and one for the fix.

COMMITS: one, this file (`docs/chair/2026-11-20/veil/out/v32/tell8b/TELL8B-HANDBACK.md`); 212 sha256 above, unchanged.
