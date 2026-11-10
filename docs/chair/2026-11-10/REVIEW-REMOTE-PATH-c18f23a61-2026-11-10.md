# Review — lane REMOTE-PATH at c18f23a61 (base 877811895), for the chair

Read-only review, 2026-11-10 08:58–09:26 UTC, on file exports of the tip and the base
(`/tmp/claude-0/-home-user-settlement-engine/492715f5-49ba-5ccc-8d60-452885571b1d/scratchpad/review-remote-path/tip` and `/base`).
Nothing was changed in `/home/user/settlement-engine` or the two worktrees (`git status --porcelain` on the checkout printed nothing at 09:18).
Every claim is labelled CONFIRMED (I executed it; output quoted) or PLAUSIBLE (traced by reading, not observed).

## Verdict: CLEAR to merge onto the integration line

No HIGH finding. The lane does what its record says on the paths the release cares about:
a signed-out and a free-account forge reach the function, the function's record is byte-identical
to the local core's record for the store's own request, local (unflagged) generation is untouched,
and nothing loses data. One MEDIUM is a ruling the chair or owner owes **before the function is
deployed with the flag on** (F1, the cost of one hostile `generate` body at the new cap). The rest
are LOW, three of them small cures on premium-only paths.

## Findings

| # | Rank | Label | Finding | Suggested act |
|---|---|---|---|---|
| F1 | MEDIUM | CONFIRMED | The function validates nothing inside `config`, so the body cap is the only bound on the work one call can ask for, and R4 raised it 8×. A hostile `generate` body at the new cap (`config.nearbyResources` = a long list) cost 4.2–8.8 s wall and answered 7.5–19.7 MB; the same shape at the old 32 KB cap cost 1.3–1.6 s and 1.3–2.8 MB. The rate guard bounds calls (6/min, 200/day per IP), not the work per call. | Rule before deploy. Cheapest cure: keep 256 KB for the four toggle bags only and hold the rest of `config` to the old 32 KB, or cap list lengths. |
| F2 | LOW (premium path) | CONFIRMED | R3c: a failed section reroll records an UNKEYED refusal that the next successful reroll does not clear. "Forge limit reached" then stands over a reroll that worked, and every surface that renders `lastRefusal` says it until the next forge. New with the lane. | `regenSectionAction` clears `lastRefusal` at its start, as the generate action does. |
| F3 | LOW (premium, legacy state) | CONFIRMED | The pre-flight does not read `provenance.scope`. An active campaign with no content binding yields `{ scope: 'campaign', vanilla, bindingHash: null }`, which is now admitted; the function stamps `standalone`. Two paths differ: `/customContentProvenance/scope` and `/receiptHash`. Not in the lane's record. | Refuse `scope === 'campaign'` in `remoteUnsupportedInputs` (one condition). |
| F4 | LOW | CONFIRMED | The lane's lighting-census refreeze silently parks an existing credited test file: the lane's edit to `tests/components/refusalNotice.test.jsx` moves that file from credited to parked, taking 16 titles out of the census (the cause is PLAUSIBLY its two `for … of` loops that register tests). The register's note names only "five new test files … and their titles". | Write the four arms without the `for` loops, or say so in the note; the merge re-measures either way. |
| F5 | LOW | CONFIRMED | The `generate` cap line also governs `stepMeta` (every non-record op): a 40,000-byte `stepMeta` body is 413 at base and 200 at tip, unmetered and outside the rate guard. Cost is negligible (any body up to 1 MiB was always parsed before the op is known). | None needed; say "non-record ops" in the comment. |
| F6 | LOW (pre-existing) | CONFIRMED | The bot guard does not refuse stock headless Chromium: `/\bheadless\b/i` does not match `HeadlessChrome/…`. A `HeadlessChrome` user agent was served on base and tip; `Playwright/1.60` was refused 403. The spec's stated reason for overriding its user agent is therefore not what the guard does. | Inbox item for the abuse-defence area; not this lane's. |
| F7 | LOW | CONFIRMED / PLAUSIBLE | Refusal wording. (a) CONFIRMED: on a reroll, `engine_refused` (413, 422) still records nothing. (b) PLAUSIBLE: `engine_unavailable` also carries every 5xx and an unconfigured build, where "Check your connection" is false advice; a limiter fault answers 429 (fail closed) and reads "Nothing went wrong". (c) PLAUSIBLE: `engine_refused` (413, 401 session superseded, 403 inactive account) and `engine_remote_unsupported` keep "Try once more", which cannot help. | Owner's sentence veto; (a) to the reroll area's inbox. |
| F8 | LOW | PLAUSIBLE | `playwright.config.js` boots the third dev server for EVERY Playwright run (CI's chromium step and its mobile step). It adds four tests with a 90 s budget each (360 s, 720 s with CI's one retry) to a job capped at 25 minutes whose own comment budgets 1,335 s. The full e2e suite with three servers was run by nobody; CI has never run on this branch. | Read CI's chromium job on the merged tip before trusting the cap. |
| F9 | LOW | PLAUSIBLE | "Nothing you had was lost": true for the draft on every surface I read, with the lane's own stated edge (an anonymous draft past 24 hours is cleared before the forge). One more edge the record does not state: the three fork surfaces overwrite the stored dials before they forge, so after a failed Visit the stored config is the sample's. Pre-existing behaviour, newly described by the sentence. | Chair's call on the sentence; no code change needed. |
| F10 | INFO | PLAUSIBLE | Deploy order. The production client pins no engine version (`defaultRemoteTransport` passes only `signal`), so a flagged client against the function as deployed today gets unstamped records and 413 above 32 KB, silently. | Function first, then the flag. |
| F11 | INFO | CONFIRMED | The three vitest parity suites compare the local SOURCE core with the committed BUNDLE (a real comparison, not the bundle with itself), but each re-implements the function's stamp rule by hand; none executes `index.ts`. Only the Deno suite and the e2e spec do. | None; my probe ran the real handler (section 2). |

## 1. The function

**(a) What the stamp adds, and who controls it.** CONFIRMED on the real `handleEngineGenerate` of both trees,
bundled by esbuild with the two URL imports stubbed (my loader, the lane's own shape), same request to both:

```
tip customContentProvenance = {"schemaVersion":1,"scope":"standalone","environment":{"environmentId":"system:vanilla","environmentRevisionId":"system:vanilla:v1","environmentHash":"aeb02a6f…c73bb3","source":"vanilla"},"bindingHash":null,"materializedDefinitions":[],"receiptHash":"719f8137…9a02c8"}
base customContentProvenance = undefined
top-level keys only on tip: [ 'customContentProvenance' ] | only on base: []
tip settlement minus the stamp === base settlement (bytes): true | sha tip-minus-stamp 1c510cf31f827cb7 sha base 1c510cf31f827cb7
pipelineHistory equal base/tip: true
stamp bytes added: 393
```

The stamp is one top-level key of 393 bytes, a constant. The caller controls only its presence, by
`config.useCustomContent === false` (strict). Ten hostile variants, each answered 200:

| body | stamped | stamp is the constant |
|---|---|---|
| `useCustomContent: false` | no | — |
| `useCustomContent: "false"`, `0`, `null`, `true` | yes | yes |
| `config.customContentProvenance` forged (campaign scope, another environment, a binding hash) | yes | yes |
| `config.contentProvenance` forged | yes | yes |
| `config.customContent` + `config.contentTunables` | yes | yes |
| top-level `contentRuntime`, `contentProvenance`, `customContent`, `neighbour` | yes | yes; the settlement is byte-identical to the plain request's |
| `config.__proto__` carrying `useCustomContent: false` | yes | yes |

A caller cannot make the function write a provenance the local engine would not write for a
standalone vanilla run. The new code sits after every guard: PLAUSIBLE by reading that it cannot
touch the rate guard, the bot guard, the pin or the caps (it reads one config key, inside the
`generate` branch), and CONFIRMED that the order still holds at tip with a 200 KB body:
`retiredPin_200KB: 409 engine_version_retired rpc=0 log=0`;
`rateLimited_200KB: 429 rate_limited rpc=ingest_check_rate:engm:u:ip:203.0.113.9 log=1 outcome=rate_limited ms=1.0`;
`playwrightUA: 403 rpc=0`.

**(b) The caps.** CONFIRMED, base against tip, bodies sized to the byte:

```
generate, 32768 B exactly   base 200                              tip 200
generate, 32769 B           base 413 payload_too_large max=32768  tip 200
generate, 262144 B exactly  base 413 …max=32768                   tip 200
generate, 262145 B          base 413 …max=32768                   tip 413 payload_too_large max=262144
stepMeta, 40000 B           base 413 …max=32768                   tip 200 rpc=0 log=0
stepMeta, 262145 B          base 413                              tip 413 max=262144
derive, 1048576 B exactly   base 200                              tip 200
derive, 1048577 B           base 413 max=1048576                  tip 413 max=1048576
regenSection, 1048577 B     base 413 max=1048576                  tip 413 max=1048576
NOT JSON, 1048577 B         base 413 max=1048576                  tip 413 max=1048576
NOT JSON, 300000 B          base 400 invalid_json                 tip 400 invalid_json
unknown op, 300000 B        base 400 invalid_op                   tip 400 invalid_op
```

The 256 KB applies to `generate` and to `stepMeta` (F5). The record ops keep 1 MiB. The order is
unchanged: only a body over 1 MiB is refused before parsing, on both trees; a body between an op's
cap and 1 MiB was always parsed first (the op is inside the JSON). Every 413 made no limiter call
and no log row.

**Cost of one maximal `generate` body.** CONFIRMED on the tip handler under Node 22 on this box
(load average 5 on 4 cores; not Deno, not the hosted runtime):

- Parse alone: the wizard's exclude-all body (231,449 B) 1.1 ms median; 256 KB of the worst shapes
  I tried 8.5 ms (tiny objects) and 16.5 ms (nested arrays); 32 KB 1.2 ms; 1 MiB (the unchanged
  ceiling for any op) 43 ms median, 87 ms max.
- The whole call, bodies the wizard itself builds, metropolis:
  `empty bags: request 903 B → response 472585 B | wall ms 862, 492, 438`;
  `exclude-all (max): 231449 B → 629989 B | 126, 162, 97 | institutions 16`;
  `force-all (max): 226943 B → 1457682 B | 2102, 2019, 2041 | institutions 247 | npcs 226`.
- The whole call, a body the wizard cannot build (F1):

```
nearbyResources, 2747 "item-N" strings, OLD 32 KB cap:  response 1338963 B (40.9× the request), wall 1548 ms
nearbyResources, 20949 "item-N" strings, NEW 256 KB cap: response 7502487 B (28.6×), wall 4158 ms
nearbyResources, 7965 1-char strings, OLD cap:           response 2773403 B (84.7×), wall 1279 ms
nearbyResources, 65309 1-char strings, NEW cap:          response 19745352 B (75.3×), wall 5383 ms
nearbyResources, 5310 distinct 3-char strings, OLD cap:  response 2043494 B, wall 1617 ms
nearbyResources, 43539 distinct 3-char strings, NEW cap: response 13774544 B, wall 8842 ms
```

  Also at the new cap: a 256 KB `customName` answered 1.48 MB in 0.4 s; 256 KB of forced
  institution names in no catalog, 2.0 MB in 0.55 s. I tried six shapes; a worse one may exist.
  The force-all figure matters separately: about 2 s of work for a request the wizard can send is
  PLAUSIBLY near a hosted per-request CPU limit, which nobody has measured (the lane says so too).

**(c) Logging and metering.** CONFIRMED unchanged: for the same `generate` call base and tip made
the same two limiter calls (`engm:u:ip:…` max 6 / 60 s, `engd:u:ip:…` max 200 / 86400 s) and one
`analytics_events` insert with the same row keys and the same props keys
(`caller,caller_hash,duration_ms,engine_version,op,outcome,staff`).

## 2. The pre-flight

**Enumeration.** CONFIRMED, tip's `remoteUnsupportedInputs` beside base's (imported from the base
export), the first row and the last two built from the REAL store:

| payload | base | tip |
|---|---|---|
| the real store's default runtime | `["contentEnvironment"]` | `[]` |
| vanilla, wrong `environmentId` / `environmentRevisionId` / `environmentHash` / `source` (one each), `source` missing | refused | `["contentEnvironment"]` each |
| vanilla + a binding hash; + an empty-string binding hash | refused | `["contentEnvironment"]` |
| vanilla + homebrew entries | refused | `["customContent"]` |
| vanilla + tunables (a number; zero) | refused | `["contentTunables"]` |
| vanilla + a neighbour | refused | `["neighbour"]` |
| environment a string | refused | `["contentEnvironment"]` |
| real store: active campaign with a legacy (vanilla, empty) binding | refused | `["contentEnvironment"]` |
| **vanilla, `scope: 'campaign'`, no binding hash; and the real store with an active campaign and NO binding** | refused | **`[]`** (F3) |
| vanilla identity, other fields differ (tunables, packVersions, revisionNumber) | refused | `[]` — harmless: only the four checked fields are written |
| vanilla + tunables whose only values are `false` or `''` | refused | `[]` — `holdsEntries` reads those as empty (pre-existing); the store cannot build it, a vanilla environment has no tunables |
| `explicitConfigFields` set, no tunables | refused | `[]` — inert without tunables (PLAUSIBLE by reading `resolveConfigWithUserContentTunables`) |
| environment null, no binding hash | `[]` | `[]` — the real store never sends it |
| provenance null (`useCustomContent` off) | `[]` | `[]` |

So what is newly admitted is the vanilla identity with no binding hash, in either scope. A premium
account with a bound campaign active is refused on every forge, with the generic sentence; the
lane's R6 table lists that class under "neighbours and homebrew" without naming the campaign.

**Equivalence.** The lane's suites: `tests/build/engineServiceStoreParity.test.js` and
`engineBundleReplay.test.js` passed (batch B below). What they compare: the local SOURCE core over
the request the real store built, against the committed BUNDLE running a hand copy of the
function's rule (F11). My own case, CONFIRMED: five requests built by the REAL store (captured at
the generation client), each wire body `{ seed, config }` posted to the REAL tip handler, the reply
compared with the local source core's record for the same request, as JSON strings:

```
anon-default | tier town | seed review-anon-1 | preflight [] | BYTE-IDENTICAL: true | pipelineHistory identical: true   (157236 B)
free-village | tier village | seed review-free-village-7 | previousSettlement rode: true | BYTE-IDENTICAL: true          (68080 B)
free-city | tier city | seed review-free-city-11 | previousSettlement rode: true | BYTE-IDENTICAL: true                 (219769 B)
anon-stored-off | tier town | provenance sent: null | BYTE-IDENTICAL: false
   /customContentProvenance: ABSENT locally, remote={"schemaVersion":1,"scope":"standalone",…
premium-campaign-nobinding | tier hamlet | preflight [] | provenance sent: campaign/system:vanilla:v1 | BYTE-IDENTICAL: false
   /customContentProvenance/scope: local="campaign" remote="standalone"
   /customContentProvenance/receiptHash: local="dd78d57f…" remote="719f8137…"
```

Village and city are sizes the lane's parity suite does not use. The fourth row is the lane's
known, ruled divergence, confirmed as exactly one key. The fifth is F3. For a signed-out or
free-account request the claim holds in every case I ran.

## 3. The refusals

Lane's tests, batch A: passed. Read whole: `engineRefusal.js`, the two reasons and sentences,
`RefusalNotice.jsx`, HomeHero's handler, the generate and regen actions, and the catch of every
caller of `generateSettlement`.

- **Prints nothing?** On the generation path, no (PLAUSIBLE by reading): engine codes are minted
  only in `postEngine`, the only remote call inside the generate action is `runGeneration`, and
  that call sits inside the catch that records before rethrowing; HomeHero's early return is
  reached only by the three mapped codes. The wizard's two branches show the notice or the generic
  line, never both; the five other surfaces whose catch I read (Founding Worlds, §02's forge, the seed
  field, the how-to demo, the Library's fork) print only the notice. I did not read the editor's
  forge beyond its notice mount. On the reroll path the unmapped
  codes still print nothing: CONFIRMED `engine_refused(413)` and `(422)` leave `lastRefusal: null`.
- **Mislabelled?** No unrelated LOCAL failure can be: the three codes are spelled nowhere in `src`
  outside the remote leaf and the map (CONFIRMED by search). F7 lists what the two new sentences
  cover beyond their words.
- **A stale notice (F2).** CONFIRMED:
  `afterFailure {"reason":"engineRateLimited","vars":null,"at":null}`, `worldUntouchedAfterFailure true`,
  `rerollSucceeded true`, `afterSuccess {"reason":"engineRateLimited",…}`, and `raisedHere` true for
  all six surfaces.
- **"Nothing you had was lost."** Before the engine runs the generate action writes only
  `lastRefusal`, the expired-anonymous-draft clear, and the two gate refusals (CONFIRMED by listing
  every `set(` before the call). Regenerate-draft therefore keeps the draft (PLAUSIBLE; the lane
  pins the forge case). A failed reroll leaves the world byte-identical (CONFIRMED above). F9 has
  the two edges.

## 4. The browser pin

CONFIRMED, run from the export with its own Vite cache:

```
✓ (a) a visitor's forge produces a dossier, made by the function (15.6s)
✓ (b) a signed-in account's metropolis produces a dossier, made by the function (14.3s)
✓ (c) a founding-world "Visit" produces a dossier, made by the function (11.9s)
✓ (d) a 429 from the function prints the limit's own sentence, not "Try once more" (4.7s)
4 passed (59.1s)        [gate-tail] exit: 0
```

One caveat: the repo's `@playwright/test` 1.60.0 wants Chromium build 1223 and the machine holds
1243, so my first run failed at launch (`Executable doesn't exist at …chromium_headless_shell-1223`,
exit 1); the passing run used a private browsers directory that names the 1243 build as 1223.

By reading: the spec executes the function's own handler. `e2e/support/engineFunction.js` bundles
`supabase/functions/engine-generate/index.ts` itself; stubbed are `serve`, `createClient` and
`Deno.env` (empty), and the service-role client is a double (no user resolves, so every caller is
anonymous; the limiter answers a fixed boolean; the log insert succeeds). Not exercised: CORS (the
URL is same-origin), the gateway, the Deno runtime, the real limiter, the signed-in spine. The bot
guard is side-stepped by an ordinary user agent, which F6 shows was not needed for headless Chromium.

No arm can pass vacuously. Each of (a)–(c) needs the dossier's meta line and exactly one
`generate` 200 recorded from the handler before the assertion; the meta regex is the one flow-a to
flow-d use, and the create page's sample cards read `tier · terrain`, not `tier · pop.` (b) must
show a metropolis. (d) needs an alert carrying the rate sentence, the absence of the generic one,
and `replies` equal to exactly one 429.

Config side effects: the `env` block is per server, so `VITE_ENGINE_REMOTE` does not leak into
:5173 or :5174 (PLAUSIBLE; all three booted and the spec passed). The flag plugin is present under
one name on every server, so the three PLAUSIBLY share one dependency-cache hash. See F8 for cost.

## 5. Pins and goldens

- CONFIRMED no generator moved: the 31 changed paths include none under `src/generators`,
  `src/domain`, `src/workers` or `src/data`, no golden and no snapshot. `package.json`,
  `package-lock.json` and `.github` are untouched. The bundle's diff is the constants leaf and one
  export name.
- `settlementGenerateAction.js` changes only which reason the catch records; it cannot alter a
  local generation (PLAUSIBLE by reading the whole diff; the three codes do not occur locally).
- Changed existing tests, each read in its diff: `engineBundleReplay` (both sides stamped, the local
  side now the store's whole runtime, plus a new pin that the fixture is the store's value: tighter),
  `engineServiceCore` (same stamp both sides, still bundle against source), `engineRemoteTransport`
  (the request now built with the store's real getter; the service double stamps by the function's
  rule), `engineRemoteRegenSection` and `refusalNotice` (arms added), the fixture (keys added; config
  and seeds unchanged), the Deno suite (413 pins moved to the new cap; one stamped and one
  unstamped replay). None loosened, except the census effect in F4.
- F4, CONFIRMED: the walker passes at base (frozen 3183 / 395 / 2788 / 29028 / 7843) and at tip
  (3188 / 397 / 2791 / 29026 / 7844), so titles FELL by 2 while files rose by 5. Putting the base
  version of each changed test back, one at a time, in the scratch export under `CENSUS_STASIS=1`:

```
[tip-as-is]                               files=3188 parked=397 credited=2791 titles=29026 suiteTitles=7844
[base-version-of-refusalNotice.test.jsx]  files=3188 parked=396 credited=2792 titles=29042 suiteTitles=7847
[the other four]                          unchanged from tip-as-is
```

  Its tests still run and pass. The register's `measuredAtSha` 734f35fa is not an object in this clone.

## 6. Anything else

- No data-loss path found. A LOCAL record's shape is unchanged: the store already stamped every
  standalone generation (CONFIRMED: the local records of my three default cases carry the stamp).
- Flagged against unflagged for a signed-out or free reader: generation works and matches; new are
  the rate guard, the need for a connection, and the sentences of F7. I did not test a stored
  config large enough to pass 256 KB (for example after "Apply Saved Configuration").

## What I ran (each through `sh scripts/gate-tail.sh`, from the tip export, `--maxWorkers=2` or 1)

| run | result |
|---|---|
| A: `engineRemoteStorePreflight`, `engineRefusal`, `engineRemoteRegenSection`, `refusalNotice`, `homeHeroEngineRefusal`, `engineRemoteTransport` | `Test Files 6 passed (6) · Tests 56 passed (56)` · exit 0 |
| B: `engineServiceStoreParity`, `engineBundleReplay`, `engineGenerateBodyCap`, `engineServiceCore` | `Test Files 4 passed (4) · Tests 14 passed (14)` · exit 0 · `derived bound 233119 B … × 1.1 = 256431 B; cap 262144 B` |
| my vitest probe (pre-flight table, five store-built requests, the wizard's two maximal bodies) | 3 passed · exit 0 |
| my reroll probe + `tests/lint/refusalNoticeCoverage.walker.test.js` | `Test Files 2 passed (2) · Tests 14 passed (14)` · exit 0 |
| `tests/lint/sovereigntyLightingContract.walker.test.js`, tip and base | 34 passed each · exit 0 |
| the e2e spec, chromium, one worker | first run exit 1 (browser build missing), second `4 passed (59.1s)` · exit 0 |
| Node probes on the real handler (`fnProbe`, `parityProbe`, `timeProbe`, `scaleProbe`) | exit 0 each |

## What I did not run

- The function's Deno suite (the lane reports 23/23 under a local Deno; not repeated).
- CI: GitHub lists 0 workflow runs for `lane/remote-path-2026-11-10` (CONFIRMED by the API), so
  CI's Deno job and its chromium job have never seen this tip.
- A deployed edge runtime: the gateway's body limit, the CPU and memory limits, CORS from the
  production origin, the real limiter, the signed-in spine from a browser.
- The full e2e suite with three servers; the mobile-safari project.
- `npm run build`, the first-paint byte ceilings (R3 adds two sentences to `src/copy/en.js`; the
  record states a byte measure for R1 only), the flagged-dist arms, typecheck, lint, the rest of
  `tests/lint`, `npm run check`, and the scratch merge onto 90774f2fa.
- `derive` and `regenSection` against the real handler beyond the cap rows; a metropolis parity
  case of my own (town, village, city only).

## Files

Everything is under `/tmp/claude-0/-home-user-settlement-engine/492715f5-49ba-5ccc-8d60-452885571b1d/scratchpad/review-remote-path/work/`:
the probes (`loadFn.mjs`, `fnProbe.mjs`, `parityProbe.mjs`, `timeProbe.mjs`, `scaleProbe.mjs`,
`probes/reviewProbe.test.js`, `probes/staleRefusalProbe.test.js`) and their outputs (`fnProbe.out`,
`parityProbe.out`, `timeProbe.out`, `scaleProbe.out`, `preflight.json`, `staleRefusal.json`,
`cases/`, `bodies/`, `runA.out`, `runB.out`, `runV1.out`, `runV2.out`, `runE2E.out`, `runE2E2.out`,
`runCensus.out`, `runCensusBase.out`, `census-*.log`). The two vitest probes ran from
`tip/tests/_review/` and were moved out afterwards; the tip export's `node_modules` is now a
directory of links with its own `.vite` cache.
