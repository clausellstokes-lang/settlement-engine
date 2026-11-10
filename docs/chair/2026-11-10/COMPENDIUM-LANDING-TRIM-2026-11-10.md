# COMPENDIUM-LANDING-TRIM — the landing's intro block removed, 2026-11-10

Seat COMPENDIUM-2, a UI seat and child of the chair session session_01FbPLbejcfwX5nii12VM673. Branch
`lane/compendium-landing-trim-2-2026-11-10` cut from the integration line's tip ef3142ff3
(`lane/integration-2026-11-07`), where the landing is already merged. One cause commit; this record carries the
roster bump and the before/after pictures.

**The owner's words (2026-11-10, verbatim):** "remove the everything here is rednedered by the deteremistic.... all
the way to the sample world cnocby..."

## Old → gone

| was on the landing (`/compendium`) | now |
|---|---|
| "Everything here is rendered by the deterministic engine from its own registries, the same code that builds your worlds. It cannot drift from what the simulator actually does." | gone |
| "The sample world is Cnocby (seed lf-033)." | gone |

Both lived in `CompendiumIntro` (`src/components/compendium/CompendiumDashboard.jsx`, the `#overview` block),
mounted only by the landing in `src/components/CompendiumPanel.jsx`. The component is removed and the panel no
longer mounts it. Nothing is written in its place. The tiles now sit under the search, inside the frame's own
14 px padding, with no empty band. The block printed nowhere else in the Compendium (a grep of `src/` for both
sentences and for `CompendiumIntro`).

**Not touched:** `CD.meta.demoWorld` and every example rendered from the sample world (the About page still
prints it; `tests/ui/aboutManifesto.test.jsx` pins it there). The SEO meta description in
`src/lib/seoCompendium.js` ("Every entry renders from the deterministic engine's own registries, so the reference
cannot drift from what the simulator does.") is a sentence of the same family. It is not on the page, and the
owner did not point at it, so it stays.

## The pins, re-keyed by identity to anchored negatives

- `tests/ui/compendiumPanel.smoke.test.jsx`: the two `getByText(/rendered by the deterministic engine…/)` pins
  became `expectLandingWithoutIntro()`. The positive anchor is the "Compendium sections" nav with its twelve
  links. The negatives are: neither sentence, no "The sample world is", and no `#overview`.
- `tests/ui/compendiumHubs.test.jsx`: `toContain(CD.meta.demoWorld.name)` on the landing became an anchored
  negative. The positive anchors are that the name is still in the data and the operations count is still on the
  landing. The negatives are no "The sample world is" and no sample-world name. The lens-redirect test's
  `#overview` presence check became `toBeNull()`, with the landing-grid check beside it as the anchor.
- **Red first:** with the base's two source files restored, those tests fail (4 failed, 8 passed). With the
  cause, `tests/ui/compendium*` is green: 17 files and 83 tests.

## What I saw

`vite --mode e2e`, Chromium (`/opt/pw-browsers/chromium`), 1440x900 and the iPhone 13 profile, measured in the
page:

| | first tile row ends (desktop) | first tile row ends (iPhone 13) | `#overview` / either sentence |
|---|---|---|---|
| before | 528 px | 518 px (the brief's 517; sub-pixel rounding) | present |
| after | 442 px | 388 px | absent |

The tiles run straight on from the search box at both sizes. The phone shows the first two rows whole and
the third row's names above the fold. Pictures (desktop on the left, phone on the right):
`docs/chair/2026-11-10/compendium-trim/before.webp`, `docs/chair/2026-11-10/compendium-trim/after.webp`.

## Gates

| gate | result |
|---|---|
| `tests/ui/compendium*` | 17 files, 83 tests, green |
| eslint on the touched files | 0 |
| `npm run typecheck:ratchet` | 167, ceiling 167 |
| `npm run typecheck:domain:strict` | red at the base with the same file list; this lane touches no file under `src/domain` |
| the sweep `tests/lint tests/scripts tests/components tests/ui` | 759 files. Two reds were this lane's and are cured here: the citation roster (`dated` 219 -> 220, through the Edit tool) and the anchored-negative walker (the new negatives go through `expectAbsentWithAnchor`, anchored on the first tile's name). Every other red is red at the base ef3142ff3, measured in a base worktree with the same counts: observedShapeReaders (4), proseFamilyContract (3), newsHeadlineContract (2), publicProseEquality (2), readerValidationOnPage (1), domainAnyCastBaseline (1), heraldForecast (1), proseRegisterLoaders (1), ledgerCitationIntegrity and provenanceMap (0 tests, load errors) |
| lighting census | green, unchanged (no test title added) |
| Chromium: `e2e/arrow-header`, `e2e/pinned-footer`, `e2e/phone-horizontal-overflow` (`--trace off`, the repo's config through a scratch wrapper that changes only `executablePath`) | 90 passed, 4 skipped. The mobile-safari project is WebKit, which has no build in this container, so it was not run. |

## What stays

- The SEO description (above), for the owner to rule on if they want it.
- The branch is `lane/compendium-landing-trim-2-2026-11-10` because the name `lane/compendium-landing-trim-2026-11-10`
  was already on the remote. It holds the predecessor's trim of the same cause (be677cfdc and d854ad4bb), cut from
  the hub tip 445390e90 rather than the integration tip, with no pictures, and with its roster at `dated` 216 -> 217.
  That trim is already merged into `lane/compendium-institutions-2026-11-10` (13fdafa47). It was not overwritten.
  Its source change is the same as this one apart from comments. The chair rules which one merges.
- Both records have the same path, `docs/chair/2026-11-10/COMPENDIUM-LANDING-TRIM-2026-11-10.md`. If both branches
  reach the integration line, the merge seat keeps this one, the later record, which is a superset of the other.
