# PAGE-4's brief: SAFETY-MOUNT (the chair's ruling of 15:58 UTC: the Safety line's audience fails closed AT THE MOUNT)

Written by PAGE-4, 2026-11-20 16:41 UTC (`date -u`). ONE builder under the common law of `BUILD.md` beside this file
(render only, born documents hashed equal at base and tip, red first, gates to files, ONE commit, no push, no pull
request). Base: `lane/page-4-2026-11-20` (SAFETY merged: `src/domain/display/safetyShown.js`).

## The chair's ruling, verbatim (15:58 UTC)

"THE AUDIENCE MUST FAIL CLOSED AT THE MOUNT, AND TODAY IT FAILS OPEN: `safetyAudienceOf` gives the owner's line only where
both props are SAID and false, but OverviewTab and DefenseTab DEFAULT both to false, so a caller that passes neither gets
the owner's line. RULED, a small cure now, red first: in those two tabs the audience is read from the props AS PASSED,
before any default (an omitted prop is a reader); red: each tab mounted with no audience props prints no owner's line;
and a census of every mount of the two tabs showing each passes both props or gets the reader's page. Other behaviour that
leans on the same defaults is NOT changed: only what the Safety line reads."

## The unit

1. In `OverviewTab.jsx` and `DefenseTab.jsx`: the value handed to `safetyAudienceOf` is the props object AS PASSED (e.g.
   destructure the tab's props into a rest object first, or read `props.publicDossier` / `props.playerView` before the
   defaults apply). Every other use of `publicDossier` / `playerView` in the two tabs keeps today's defaults.
2. RED FIRST: each tab mounted with a town whose owner's line exists and NO audience props prints no
   `overview-safety-beside-law` / `defense-safety-beside-law` (and the same with only one of the two props passed).
   Green: both props passed as false still prints the line (the owner's page is unchanged).
3. THE MOUNT CENSUS (a test, source scan or render walk): every place in `src/` that mounts `OverviewTab` or
   `DefenseTab` (JSX or a component map), listed with whether it passes BOTH props; the test fails if a mount passes
   neither or one (unless that mount is a reader page, which now gets the reader's line anyway: say which). Write the
   list into your report.
4. Files: the two tabs, `safetyShown.js` only if needed, and tests. Nothing under `src/domain/veil/`, `gallery*.js`,
   `publicSafe.js`, `supabase/`, `tests/security/`.
5. SAFETY's reader-bytes pin (`tests/ui/safetyReaderBytes.test.jsx`) must stay green untouched.

## The report (at most 350 words)

Branch and commit; surfaces changed (file :: symbol); the mount census's list; red-then-green receipts under
`docs/chair/2026-11-20/content/page/build/SAFETY-MOUNT/`; born-hash counts (`build/CARD/bornHash.mjs`); each gate's count
line (a new test file reds the lighting census by one: report it, do not refreeze).
