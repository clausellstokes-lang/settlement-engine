# REMOTE-PATH — the flagged build's generation path (lane `lane/remote-path-2026-11-10`, 2026-11-10)

The seat dispatched by the chair (ODQ-934.105 draft on `lane/chair-2026-11-08`) to cure what the chair's walk of the FLAGGED build (`VITE_ENGINE_REMOTE=true`) measured: D1 every generation refused in the browser before any request; D2 the service's record missing the content stamp; D3 untruthful refusals; D4 the body cap below what the wizard builds; D5 no browser pin. Cut from `lane/integration-2026-11-07` at 8778118. Pushed with `--no-verify` by the chair's ruling (the line's full check is red by design until the merge seat's closing acts); the gates owed are run by name below.

## Commits, each one cause, each red first

| commit | cause | red-first proof |
|---|---|---|
| R1 `68e4fda63` | `engineRemote.js :: remoteUnsupportedInputs` admits the standalone vanilla environment (by the constant's own identity, no binding hash); every other environment, a look-alike, any binding hash, a neighbour, homebrew and tunables stay refused | `tests/lib/engineRemoteStorePreflight.test.js` (the REAL store's default runtime): 2 of 6 red before, 6/6 after |
| R2 `f8d2115f2` | engine-generate stamps its birth with the store's standalone vanilla provenance (unless the config turned custom content off), so `buildSettlementContentProvenance` writes the record on both sides; `serviceEntry.js` re-exports `VANILLA_CONTENT_ENVIRONMENT` (the bundle's one new input, a constants leaf) | the Deno REPLAY arm re-expected to the LOCAL birth under the store's provenance, on the real handler under a local Deno: 21 passed / 1 failed before, 22 / 0 after; `tests/build/engineServiceStoreParity.test.js` |
| R3 `e578446db` | two refusal reasons (`engineRateLimited`, `engineUnavailable`), their sentences, and `src/lib/engineRefusal.js` (the one code → reason map); the generation lane records them | the two lane arms of `tests/components/refusalNotice.test.jsx` |
| R3b `3fcf73245` | HomeHero's own catch no longer prints `errors.forgeStart` over a recorded engine refusal (the retired version was hit too) | `tests/ui/homeHeroEngineRefusal.test.jsx`, two arms red, the control green |
| R3c `16e518690` | a section reroll records the service's named failures (it printed nothing before) | the new arm of `tests/lib/engineRemoteRegenSection.test.js` |
| R4 `3828381a6` | the `generate` body cap 32 KB → 256 KB, derived by `tests/build/engineGenerateBodyCap.test.js` | red at 32 KB ("expected 32768 to be greater than or equal to …") |
| R5 `e3ac328a4` | `e2e/engine-remote-flagged.spec.js`: the flagged client in Chromium against the REAL `handleEngineGenerate` | the same spec on the base tip 8778118: 4 failed, (a)–(c) showing "The forge stalled … Try once more" |
| `3daa6e83c` | the new tests meet the anchored-negative, seed-loop and mutation-coverage walkers | the three walkers red on the new files, green after |
| `a5bee1b35` | the lighting census refrozen through `LIGHTING_CENSUS_REFREEZE` | the refreeze run fails by design; the plain run 34/34 |
| `a69dfac6c` | the chair's wording of the limit's sentence; "nothing you had was lost" pinned | negative control: a planted draft clear reddened both new arms |
| `5e9fd42fd` | the no-stamp arm proves `useCustomContent` travels on the wire and survives `birthConfig` | — (asserts a property the R2 arm relies on) |

## The two sentences (old → new, for the owner's veto)

- `refusals.engineRateLimited`, rubric "Forge limit reached" — new reason. Seat's draft: "You have reached the limit on new settlements for now. Nothing went wrong; wait a while, then forge again." → the chair's wording, in the build: "The forge has made as many settlements from here as it allows for now. Nothing went wrong; wait a while, then forge again." (a signed-out reader is metered by address; "from here" is true for an account and an address, and for both windows).
- `refusals.engineUnavailable`, rubric "Forge unreachable" — new reason. Seat's draft, accepted at first: "The forge could not be reached, so no settlement was made and nothing you had was lost. Check your connection, then forge again." → FU-4 (the review's F9: the fork surfaces overwrite the stored dials before a forge that may fail), in the build: "The forge could not be reached, so no settlement was made. Check your connection, then forge again." The pin that a failed forge leaves the draft in place is kept (`refusalNotice.test.jsx`), and a failed reroll leaves the world untouched (`engineRemoteRegenSection.test.js`).
- `refusals.engineUnsupported`, rubric "Not in this build yet" — new reason (FU-3), the seat's DRAFT, sent to the chair for the final word: "This build’s forge cannot yet make a settlement {what}, so no settlement was made." `{what}` from the refusal's own inputs and scope: "beside an imported neighbour", "with your own content", "inside a campaign", joined by " and ". Old: the generic "The forge stalled before your settlement took shape. Try once more."

## The body cap

Derived bound 233,119 bytes (1,622 institution, 77 category, 874 service, 61 goods keys; a 25-character name and a 256-character seed of a six-byte-escape character; a pinned version), the body the transport itself posts. Cap 256 KB = 262,144 bytes, 1.12× the bound; the test holds cap ≥ 1.1× bound and ≤ the chair's 256 KB ceiling. A 1.5× margin would need 342 KB. The 1 MiB record cap is untouched.

## `_shared` files and stamps moved

`supabase/functions/_shared/engineBundle.js` and `engineBundle.meta.json` (GENERATED; the merge seat re-emits): `engineVersion` 08c31364686731a2 → 287936e9c62b6f1f, `sourceHash` 4847400d87c5e75c → 52ce2b5492312d48, one new input `src/domain/content/contentEnvironmentDefaults.js`. No other `_shared` bundle moved on the lane. At the scratch merge onto integration 90774f2fa, `build:edge-shared` re-emits `engineVersion` a70879a6b15156e9 AND moves `aiCharterBundle.js` and `aiOutputSchemaBundle.js` — not this lane's: the integration tip's AI bundles read as stale for its own sources. The function also changed: `supabase/functions/engine-generate/index.ts` (the stamp; `MAX_BODY_BYTES` 256 KB; FU-1's 32 KB bound on the rest). The merge seat's "bundles once" act supersedes this lane's committed `engineBundle.js` and `engineBundle.meta.json` bytes; the source edits (`src/engine/serviceEntry.js`, `index.ts`) stand.

## Known, ruled

- THE ANONYMOUS DIVERGENCE (ruled by the chair 2026-11-10: accepted as reported, not cured here; to the post-deploy list). An anonymous forge sends `DEFAULT_CONFIG` on the wire, while `settlementContentRuntime.js` reads the STORED `config.useCustomContent`. For a signed-out reader whose stored config holds `useCustomContent: false`, ONE key differs: `/customContentProvenance` is absent from the local record and is the standalone vanilla stamp on the service's. The service's is the truthful record of the town that reader can forge; the content runtime should read the same config the forge sends.
- R1's chunk measure: the transport chunk 5,795 → 6,230 bytes; its new static imports are the entry chunk and the seven chunks `index.html` already preloads; the entry +49 bytes; the environment compiler is absent from the entry before and after.

## The follow-up (the independent review, ruled by the chair 2026-11-10)

- FU-1 (F1, MEDIUM): the 256 KB `generate` cap admits only the four toggle bags; the rest of the body, serialised without them, stays under 32 KB (413), checked on bytes before any work. Executed on the real handler: a ~250 KB `nearbyResources` body was served 200 after 8.7 s before the cure, 413 with no client after; the wizard's force-all and exclude-all bodies still 200. The reviewer's figures for the hostile list at 256 KB: 4.2–8.8 s and 7.5–19.7 MB of reply (1.3–1.6 s and 1.3–2.8 MB at the old 32 KB).
- **THE FIRST HARDENING ITEM AFTER THE DEPLOY: a real shape validator for `config`** in engine-generate (known keys, bounded lists and strings), the durable cure of F1; the byte bound is the interim guard.
- FU-2 (F2): a successful reroll clears the unkeyed engine refusal a failed one recorded.
- FU-3: a third typed reason for `engine_remote_unsupported` (above).
- FU-4 (F9): the unreachable sentence lost "nothing you had was lost" (above).
- FU-5 (a, F8): the flagged dev server boots for every Playwright run. MEASURED, not restructured (Playwright's `webServer` list is global; scoping it to the spec means starting Vite inside the spec): `e2e/arrow-header.spec.js` cold under `CI=1`, twice each — with the flagged server 59.2 s and 54.1 s wall, without it 52.5 s and 51.0 s: about +5 s per Playwright invocation, so about +10 s across CI's two e2e steps, not the review's estimate of +360 s.
- FU-5 (b, F4): R3 had registered `refusalNotice.test.jsx`'s new arms in a for-loop the lighting census cannot read, which parked the whole file and its titles; the arms are literal titles now (FU-1's two likewise) and the census is refrozen with a note saying so.
- RECORD ONLY: F5 — `stepMeta` rides the new cap (a 40,000-byte body is now 200 where it was 413). F6, older than this lane — the bot guard's `\bheadless\b` cannot match "HeadlessChrome", so the default headless agent is NOT refused. F7 — the rerolls print nothing for a 413 or a 422, and "check your connection" also covers a 5xx.

## R6 — what the flag turns off, and for whom

Every importer of `localEngine.js`, `localPipeline.js`, `generateSettlementPipeline.js` and `lib/instantWorld/composeInstantWorld.js`, read in the flagged build (`localEngine.absent.js` answers each).

| path | importer | outcome when flagged | anonymous | free | premium | staff |
|---|---|---|---|---|---|---|
| Generation (hero, wizard, regenerate draft, founding worlds, §02's forge, seed field, the editor's forge) | `settlementGenerateAction.js`, `generationClient.js` | ROUTED to the service (`generate`) | yes | yes | yes | yes |
| Section rerolls (npcs, history) | `settlementRegenAction.js` | ROUTED (`regenSection`); failures now said | — | — | yes | yes |
| DM-layer re-derivation (edits, an advance's newcomers) | `settlementRederiveAction.js` (via `editSlice.js`) | ROUTED (`stepMeta` + `derive`); a failure mints nothing, silently, as locally | — | — | yes | yes |
| Surveyor construction: settlement preview | `ConstructionPanel.jsx` | ROUTED (`derive`) | — | — | Surveyor / founder | yes |
| Surveyor construction: realm preview | `ConstructionPanel.jsx` (`composeInstantWorld`) | REFUSED with a sentence ("Realm previews are not available in this build. Settlement previews still are."); the realm commit (the `instantWorld` store action) is not reachable, its button renders only under a successful preview | — | — | Surveyor / founder | yes |
| Instant world (the Realm's empty state) | `InstantWorldEntry.jsx` → `instantWorldBody.js` | REFUSED with a sentence ("Instant worlds are not available in this build.") | — | — | yes | yes |
| A shared world's page `/world/<code>` | `WorldPage.jsx` | REFUSED with the same sentence | yes | yes | yes | yes |
| Custom-content samples (compendium, editor, Surveyor panel) | `customContentPreviewClient.js` → `customContentPreview.worker.js` | REFUSED with a sentence ("Custom content samples are not available in this build.") | — | — | yes | yes |
| Content change reviews (campaign binding) | `campaignContentBindingSession.js` | REFUSED, typed (`engine_local_absent` → "Content change reviews are not available in this build.") | — | — | yes | yes |
| Neighbours and homebrew in a generation | `engineRemote.js :: remoteUnsupportedInputs` | REFUSED before any request, typed (`engine_remote_unsupported`); since FU-3 its own sentence naming what was asked for | — | — | yes | yes |
| Generating while a campaign is active | `engineRemote.js :: remoteUnsupportedInputs` (the binding hash) | REFUSED before any request (FU-3's sentence: "… a settlement inside a campaign …"), even for a plain vanilla campaign — the binding hash is not a constant; a free account cannot create a campaign. The review's F3, RECORDED NOT CURED: a legacy campaign with no binding is admitted and stamped standalone, where the local core says campaign | — | — | yes | yes |
| The world pulse (advance) | `src/domain/worldPulse/` | UNCHANGED — stays in the browser (not one of the four modules) | — | — | yes | yes |

No path crashes. Note: an anonymous forge's record carries the vanilla stamp from the service where a stray stored `useCustomContent: false` would have left it unstamped locally (Known, ruled, above).

## Gates (each through `scripts/gate-tail.sh`; exit codes)

On the lane: `typecheck:ratchet` 0 (167/167); `typecheck:domain:strict` 0 (1113/1113); `lint` 0 (37 warnings, none in this lane's files); the record walkers 0 (114/114, with the ledger branch fetched to a local ref); the `tests/lint` sweep 1 — 10 failed in 4 files (newsHeadlineContract, observedShapeReaders, proseFamilyContract, proseRegisterLoaders), the SAME 10 titles red on the base tip 8778118, unmoved; the new and touched suites with `engineAbsentWhenRemote`, `engineBundleReplay`, `engineCoreLazyEdge` 0 (31 files, 272 passed, the 4 dist arms skipped without a flagged dist), and `engineAbsentWhenRemote` with `VERIFY_ENGINE_REMOTE_DIST=1` over a flagged dist 0 (10/10); `npm run build` 0 and `smoke:boot` 0 (597 chunks); the FLAGGED build 0 and its boot smoke 0 (594 chunks); the e2e spec 0 (4/4; 58 s wall at one worker). The function's Deno suite: NOT run on CI's Deno here (`deno.land/std` unreachable); run on the real handler under a local Deno with an import map stubbing the three URL imports: 23/23.

The scratch merge onto integration 90774f2fa (not pushed): one conflict, the census register, taken from the integration side and refrozen; build 0, boot smoke 0, the lazy-edge guard and this lane's suites 0 (128/128), the e2e spec 0 (4/4), Deno 23/23.

## Not verified

CI's own Deno job; a deployed Supabase edge runtime (its gateway's body limit against the 256 KB cap, real CPU); the service's signed-in path from a browser (the spec's signed-in account is the client's mock auth, so the handler saw an anonymous caller); the mobile-safari project; the full `npm run check` (the chair's act at the end).
