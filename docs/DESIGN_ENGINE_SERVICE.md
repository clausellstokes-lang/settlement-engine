# THE ENGINE SERVICE — generation and the world pulse behind the edge, the browser a viewer

**Status:** DESIGN, written at the owner's ask on 2026-11-03 ("I meant for users to protect my code" · "How do I set it up?"). Queued behind the coherence window's landing and before launch, as its own program of lanes and its own pull request(s). Every rule below is the owner's to veto before a seat builds it.

## Why

Today the generator (`src/generators/generateSettlementPipeline.js :: generateSettlementPipeline`), the world pulse (`src/domain/worldPulse/`, the advance interval) and the prose composition all run in the user's browser. That is why a town takes milliseconds and works offline, and it is also why the engine ships, minified, to every visitor, where it can be read and lifted. A license deters, obfuscation delays, only a server stops it. Once the engine has shipped to a browser it is out, so this lands before launch or it does not protect anything.

## What moves, what stays

- MOVES: generation (seed + configuration → the settlement record) and the pulse (a saved settlement + ticks → the advanced record and its events). Both are plain JavaScript with no browser dependency; the certification soak (`scripts/audit/generation-certification-soak.mjs`) already runs the pipeline in Node, and `scripts/build-edge-shared.mjs` already bundles `src/domain` modules into `supabase/functions/_shared/*Bundle.js` with a `.meta.json` stamp for the AI functions, which is the exact precedent for an engine bundle.
- STAYS: rendering (the dossier readers only need the record), the DM edit layer, the PDF (`src/pdf/`) and the Foundry export (`src/foundry/`), saved settlements (offline-readable). The display prose pools and the reader logic therefore remain in the client: a KNOWN EXPOSURE, recorded here, for a later step (server-rendered dossiers behind a thin viewer) if the owner wants the voice protected too. Not this program.

## The contract

Two edge functions on the existing Supabase spine (bot guard → auth → account_is_active → rate guard → the work → the log; the same `_shared` helpers `construct-settlement` uses: `requestMeta.ts :: botGuard`, `rateLimit.ts`, `sessionGate.ts`, `cors.ts`, `logError.ts`):

- `POST /functions/v1/engine-generate` — body `{ seed, config, engineVersion? }`; reply `{ settlement, engineVersion, generatedAt }`. `engineVersion` is the engine bundle's content hash from its `.meta.json`. A caller that pins an `engineVersion` the server no longer serves gets `409 engine_version_retired` with the served version, never a silently different town.
- `POST /functions/v1/engine-advance` — body `{ settlement | saveId, ticks, engineVersion? }`; reply `{ settlement, events, engineVersion }`.
- `GET /functions/v1/engine-version` — `{ engineVersion, builtFromCommit, deployedAt }`: the live-functions ledger DEPLOY.md says does not exist today, made real for the engine.

Callers: signed-in and anonymous alike under the rate limit (the free account is the only account until launch, X-54); staff accounts (`src/store/authSlice.js :: isElevated`) unlimited. Rate limit proposal (the owner's dials): 6 generations a minute and 200 a day per account or IP for the free tier; advance 30 a minute. Every call logged with its cost; a daily total on the admin analytics panel (`src/components/admin/AdminAnalyticsPanel.jsx`).

## The replay guarantee (same seed, same town, on the server as in the browser)

1. ONE engine bundle, `supabase/functions/_shared/engineBundle.js` + `engineBundle.meta.json`, built by `scripts/build-edge-shared.mjs` from the same sources the client builds from (entry: the pipeline and the pulse), committed like the other `_shared` bundles.
2. A build test, `tests/build/engineBundleReplay.test.js`: the bundle, loaded in Node, reproduces every row of the generator golden master (`tests/property/generatorGoldenMaster.test.js`'s fixture) and the espionage fence constant byte for byte. The golden discipline (docs/shift-records/README.md) is what makes this provable: a signed re-record moves the client, the bundle and the fixture together, in one commit.
3. The record carries `engineVersion`; a saved settlement advanced on a newer engine is advanced on the newer engine and says so (the pulse is additive; generation is never re-run on a saved town).
4. The Deno behavioural suite (`npm run check:edge-behavior`, CI's `deno-tests` job) gains the two functions' contract tests; DEPLOY.md's rule stands: deploy only from a clean tree at a pushed, CI-green commit, and `engine-version` now records which.

## The client switch

`src/lib/generationClient.js :: runGeneration` already abstracts the transport (in-thread or Web Worker, chosen by the `generationWorker` flag, every caller unchanged). The engine service is a THIRD transport, `remote`, chosen by a build flag `VITE_ENGINE_REMOTE=true` (closed unless explicitly opened, like `launchGate.js :: purchasesOpen`): the request goes to `engine-generate`; the result packet is the same shape the worker returns (`src/store/settlementGenerateAction.js` keeps its five phases untouched). The advance path (`src/store/campaignWorldPulseDeferred.js` and the advance interval callers) gets the same switch to `engine-advance`. Migration order: (1) the bundle and its replay test; (2) `engine-generate` with contract tests; (3) the client's `remote` transport behind the flag, the local engine kept as the fallback until the owner has used the service; (4) `engine-advance`; (5) THE PROTECTION STEP: the engine chunks (`engine`, `engine-core`, the generation worker) leave the client build when the flag is on — the first-paint closure and the worker budget (`tests/build/vendorPdfLazy.test.js`, `generationWorkerLazy.test.js`) shrink and are re-recorded as wins; (6) the rate limit, the cost log and the dashboard line; (7) the records.

## The advance, amended by measurement (ENGINE-2, 2026-11-03; the chair's ruling)

The design above moved the world pulse "the same way" as generation. ENGINE-2 measured before building and stopped, rightly: the client advances a whole CAMPAIGN through `src/domain/worldPulse/` (`simulateCampaignWorldInterval({ campaign, saves, interval, now, resume, advanceEpoch, … })`), not one settlement; each member save is about 155 KB of JSON against the 32 KB request body the functions accept; a year of 52 ticks costs 0.9–1.2 s of CPU for one town, 2.0–2.1 s for three and 4.8–5.5 s for eight on Node, against the edge runtime's 2 s of CPU per request; and an interval collapses its history into one record, so splitting a call into chunks is not equivalent to one call. RULED: the pulse STAYS IN THE BROWSER for this program. The generation service lands as designed; the protection step removes the GENERATOR chunks from the client only, and the pulse code remains in the client as a RECORDED EXPOSURE beside the display pools. The advance service is a follow-up design with these facts as its premises: saves loaded server-side by id, never in the body; a campaign-scoped contract; and either a bounded-ticks cursor that preserves the one-record collapse (the pause/resume cursor the client already carries) or a background worker rather than an edge request. Also ruled: the `engine-generate` reply carries `pipelineHistory` (the reveal needs it; additive); the remote transport sends no version by default (the stamp records what the server answered; the 409 stays for explicit pins); a one-sentence refusal for `engine_version_retired` in the generate action.

## What the owner does

1. In Supabase: confirm edge functions are enabled on the project and read the plan's invocation allowance before launch (the free allowance covers hundreds of thousands of generations a month as of the chair's knowledge; the plan page is the authority).
2. In the repository's GitHub secrets: the Supabase access token for the deploy job, so the functions ship from CI at a green commit rather than by hand (DEPLOY.md's gap), with `engine-version` as the ledger.
3. In Vercel: `VITE_ENGINE_REMOTE`, off until the service is proven, on at launch; launch stays an environment change plus the Redeploy click.
4. The rate-limit dials above, and the veto on any rule here.

## Costs stated plainly

Latency: a few hundred milliseconds per generation instead of a few milliseconds; the generation rail already shows progress. Offline: new generation needs a connection; saved towns still open. Money: tens of milliseconds of compute per generation, so the plan's allowance covers it until the ladder's scale; free users cost compute, hence the limit. Scope: a program of two or three lanes, weeks not days. The exposure that remains: the display pools and the readers, in the client, until a later server-rendering step.

## Open for the owner's veto

The rate-limit dials; whether anonymous callers may generate at all before launch or only signed-in free accounts; whether the local engine stays as a fallback after launch (it defeats the protection if it ships, so the proposal is no); whether the voice pools get the later server-rendering step.
