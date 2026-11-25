# SNAP-CHRONICLE hand-back (VEIL-52's builder, unit 3 part (1)): STOPPED at 05:04 UTC by the owner's ruling (outside this release)

## STOPS
- STOP received while (c)+(d) were in flight. The run was let finish and its result recorded. No new run was started after that.
- NOT RUN: (iii) the existing tests that name the changed files; (iv) `tests/copy` whole and `tests/lint` whole; (v) the typecheck; (d)'s scratch-edit tooth (adding `chronicle` to WORLD_SECTIONS by hand, then restoring it).
- The walker (d) was written BEFORE the STOP reached me. It is committed as WIP only so it does not live in the working tree alone. The chair may drop it.

## Built (branch `lane/veil-52-2026-11-24-doors-wip`, from dbd4cd9e5; not pushed)
| commit | what | state |
| --- | --- | --- |
| e22528cfe | `tests/security/mapShareChronicle.pglite.test.jsx` (c) + its manifest row (pglite-executed) | RED at this commit, as intended |
| 2841a39e5 | the cure: `WorldSectionToggles.jsx` drops the chronicle section and its copy and adds `worldSnapshotShareOpts`; `MapShareEditor.jsx` buildShareOpts uses it; `galleryMapsUtils.js` kind copy no longer names the chronicle | (c) GREEN |
| 9ee09d58c | WIP: `tests/security/shareSnapshotDenyPattern.walker.test.js` (d) + its manifest row (rationale) | passed 4/4 in the in-flight run; otherwise unproved |

Where the fix lives, and why: in the share path's options only (`worldSnapshotShareOpts`, which MapShareEditor is the only caller of). It builds one opt per offered section. Without the chronicle section, a stored selection naming `chronicle` cannot switch it on. `lib/gallery.js` is untouched: its `WORLD_SECTION_KEYS` still contains `chronicle`, but section names are stored as plain string values, and the scanner checks keys, not values. The serializer is untouched too, so `worldExport` still receives the chronicle. No migration, and nothing under supabase/ was touched. The copy catalogue (`src/copy`) had no key for this section, because its copy was written inline in the component.

## Proof (CONFIRMED = executed by me)
- CONFIRMED (i) RED, before the cure: `/var/tmp/v52/builder2/c-red.log`. 2 failed and 1 passed (3 tests). Both failures read: "World snapshot contains a forbidden private key and cannot be shared".
- CONFIRMED (ii) GREEN, after the cure: `/var/tmp/v52/builder2/cd-green.log`. 2 files passed, 7 tests passed: (c) 3/3 and (d) 4/4.
- PLAUSIBLE (read, not run): `tests/lib/galleryPublishMapContract.test.js` stays green, because `publishMapParams` did not change.
