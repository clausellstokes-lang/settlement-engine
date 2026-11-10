/**
 * engineRemote.js — THE ENGINE SERVICE'S CLIENT HALF: the `remote` generation transport.
 *
 * docs/DESIGN_ENGINE_SERVICE.md "The client switch": generation is a THIRD transport beside
 * the in-thread core and the Web Worker, chosen by the build flag `VITE_ENGINE_REMOTE`. The
 * request goes to the `engine-generate` edge function and the reply is turned into the SAME
 * result packet the worker posts (`{ settlement, preservation, pipelineHistory,
 * resolvedConfig }`, `src/workers/generationRequest.js :: runGenerationRequest`), so the
 * generate action's phase B cannot tell which transport ran.
 *
 * CLOSED UNLESS EXPLICITLY OPENED, exactly as `launchGate.js :: purchasesOpen`: only the
 * literal string 'true' opens it; a missing, empty or misspelled value keeps generation
 * local, so a forgotten environment variable can never route towns to a service that is
 * not deployed.
 *
 * ⛔ NO SILENT FALLBACK. Every failure here REJECTS with a typed code
 * (`ENGINE_REMOTE_ERROR_CODES`) and the local engine is never run instead: a town the
 * service did not make, handed over as if it had, is the "silently different town" the
 * design's version pin exists to prevent, and it would also defeat the protection the
 * flag is for. The generate action's existing catch records the refusal and rethrows.
 *
 * ⛔ A REQUEST THE SERVICE CANNOT REPRODUCE IS REFUSED BEFORE ANY FETCH. The service's
 * contract is `{ seed, config }` and it generates with no imported neighbour and no custom
 * content (`supabase/functions/engine-generate/index.ts`). A request carrying a neighbour,
 * reviewed homebrew, content tunables or a content environment would come back as a
 * DIFFERENT town for the same seed, so it is refused with `engine_remote_unsupported`
 * naming the inputs, rather than sent and quietly approximated.
 *
 * THE ONE ENVIRONMENT IT TAKES IS VANILLA. The store stamps EVERY standalone generation with
 * the account's content environment, and an account with none is stamped with
 * `VANILLA_CONTENT_ENVIRONMENT` (`customContentSlice.js :: getActiveCustomContentRuntime`). The
 * service stamps its own birth with that same environment, so that stamp — with no binding hash
 * — is the one environment the pre-flight admits. Any other environment, or any binding hash,
 * is refused as `contentEnvironment`.
 *
 * Its one module-scope import is that identity, from `contentEnvironmentDefaults.js`: a leaf of
 * constants with no imports, already in the store's first paint (customContentSlice.js reads
 * it), so the wire-lean law holds — the environment compiler is never reached from here. The
 * auth client is fetched lazily, only when a remote request is actually made.
 */
import { VANILLA_CONTENT_ENVIRONMENT } from '../domain/content/contentEnvironmentDefaults.js';

/** The error code a pinned version the service no longer serves arrives as (HTTP 409). */
export const ENGINE_VERSION_RETIRED_CODE = 'engine_version_retired';

/**
 * The closed vocabulary of remote failures. A code is read as a fact; the message is not.
 *   engine_version_retired    — 409: the pinned version is not the one deployed.
 *   engine_remote_unsupported — the request carries inputs the service does not take.
 *   engine_rate_limited       — 429: the service's rate guard refused.
 *   engine_refused            — any other 4xx (bot guard, session, inactive account, shape).
 *   engine_unavailable        — not configured, a network failure, a 5xx.
 *   engine_reply_invalid      — a 200 whose body is not the contract's reply.
 * @type {ReadonlyArray<string>}
 */
export const ENGINE_REMOTE_ERROR_CODES = Object.freeze([
  ENGINE_VERSION_RETIRED_CODE,
  'engine_remote_unsupported',
  'engine_rate_limited',
  'engine_refused',
  'engine_unavailable',
  'engine_reply_invalid',
]);

/**
 * @typedef {{
 *   VITE_ENGINE_REMOTE?: unknown,
 *   VITE_ENGINE_GENERATE_URL?: unknown,
 *   VITE_ENGINE_ADVANCE_URL?: unknown,
 *   VITE_SUPABASE_URL?: unknown,
 * }} EngineEnv
 */

/**
 * Whether this build generates through the engine service.
 * @param {unknown} [env] the build env, import.meta.env by default (a seam for tests)
 * @returns {boolean}
 */
export function engineRemoteOpen(env = import.meta.env) {
  const flags = /** @type {EngineEnv | null | undefined} */ (env);
  return Boolean(flags) && flags?.VITE_ENGINE_REMOTE === 'true';
}

/**
 * The URL of one engine function: its own override when set, else the project's functions
 * base (`VITE_SUPABASE_URL` + `/functions/v1/<name>`, the convention every other client
 * call uses). Null when neither is configured.
 * @param {'engine-generate'|'engine-advance'} name
 * @param {unknown} [env]
 * @returns {string|null}
 */
export function engineFunctionUrl(name, env = import.meta.env) {
  const flags = /** @type {EngineEnv | null | undefined} */ (env) || {};
  const override = name === 'engine-generate' ? flags.VITE_ENGINE_GENERATE_URL : flags.VITE_ENGINE_ADVANCE_URL;
  if (typeof override === 'string' && override.trim()) return override.trim();
  const base = flags.VITE_SUPABASE_URL;
  if (typeof base === 'string' && base.trim()) return `${base.trim().replace(/\/$/, '')}/functions/v1/${name}`;
  return null;
}

/**
 * One typed remote failure.
 * @param {string} code a member of ENGINE_REMOTE_ERROR_CODES
 * @param {string} message
 * @param {Record<string, unknown>} [extra]
 * @returns {Error & { code: string }}
 */
export function engineRemoteError(code, message, extra = {}) {
  return /** @type {Error & { code: string }} */ (Object.assign(new Error(message), extra, { code }));
}

/**
 * Does a value hold anything? An empty array, an empty object, null and undefined do not;
 * an object holds something when any of its values does.
 * @param {unknown} value
 * @returns {boolean}
 */
function holdsEntries(value) {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value).some(holdsEntries);
  return value !== false && value !== '';
}

/**
 * Is this environment reference the built-in vanilla environment, by the constant's own
 * identity (id, revision, hash and source all equal)? A look-alike is not.
 * @param {unknown} environment
 * @returns {boolean}
 */
function isVanillaEnvironment(environment) {
  if (!environment || typeof environment !== 'object') return false;
  const env = /** @type {Record<string, unknown>} */ (environment);
  return env.environmentId === VANILLA_CONTENT_ENVIRONMENT.environmentId
    && env.environmentRevisionId === VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId
    && env.environmentHash === VANILLA_CONTENT_ENVIRONMENT.environmentHash
    && env.source === VANILLA_CONTENT_ENVIRONMENT.source;
}

/**
 * The inputs of a generation request the service would NOT honour, by name. Empty means
 * the service's `{ seed, config }` birth reproduces the local core's run. The standalone
 * vanilla stamp with no binding hash is the service's own stamp, so it is not named.
 * @param {any} payload the protocol request's payload
 * @returns {string[]}
 */
export function remoteUnsupportedInputs(payload) {
  const runtime = payload?.contentRuntime || {};
  /** @type {string[]} */
  const unsupported = [];
  if (payload?.neighbour != null) unsupported.push('neighbour');
  if (holdsEntries(runtime.customContent)) unsupported.push('customContent');
  if (holdsEntries(runtime.contentTunables)) unsupported.push('contentTunables');
  const provenance = runtime.contentProvenance;
  if (provenance && (
    provenance.bindingHash != null
    || (provenance.environment != null && !isVanillaEnvironment(provenance.environment))
  )) {
    unsupported.push('contentEnvironment');
  }
  return unsupported;
}

/**
 * The caller's session token, or null (the service then serves the request anonymously,
 * metered per IP). Lazy: the auth client is only fetched on a remote request.
 * @returns {Promise<string|null>}
 */
async function defaultAccessToken() {
  /** @type {ReturnType<typeof setTimeout>|undefined} */
  let timer;
  try {
    const { supabase } = await import('./supabase.js');
    const session = await Promise.race([
      supabase.auth.getSession(),
      new Promise((resolve) => { timer = setTimeout(() => resolve(null), 2000); }),
    ]);
    const token = /** @type {{ data?: { session?: { access_token?: unknown } | null } } | null} */ (session)
      ?.data?.session?.access_token;
    return typeof token === 'string' && token ? token : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @typedef {{
 *   fetchImpl?: (url: string, init: Record<string, unknown>) => Promise<{ ok: boolean, status: number, json: () => Promise<unknown> }>,
 *   url?: string|null,
 *   getAccessToken?: () => Promise<string|null>,
 *   engineVersion?: string|null,
 *   signal?: any,
 * }} RemoteOptions
 */

/**
 * POST a body to an engine function and return its parsed 200 reply, or reject typed.
 * @param {Record<string, unknown>} body
 * @param {RemoteOptions & { url: string|null }} opts
 * @returns {Promise<Record<string, any>>}
 */
async function postEngine(body, { fetchImpl, url, getAccessToken = defaultAccessToken, signal }) {
  if (!url) throw engineRemoteError('engine_unavailable', 'The engine service is not configured in this build.');
  const doFetch = fetchImpl || /** @type {NonNullable<RemoteOptions['fetchImpl']>} */ (
    /** @type {unknown} */ (globalThis.fetch?.bind(globalThis)));
  if (typeof doFetch !== 'function') throw engineRemoteError('engine_unavailable', 'No fetch in this runtime.');
  const token = await getAccessToken();
  /** @type {Record<string, string>} */
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await doFetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal });
  } catch (error) {
    if (/** @type {{ name?: unknown }} */ (error)?.name === 'AbortError') throw error;
    throw engineRemoteError('engine_unavailable', 'The engine service could not be reached.', { cause: error });
  }
  /** @type {any} */
  let reply;
  try { reply = await response.json(); } catch { reply = null; }
  if (response.status === 409 && reply?.error === ENGINE_VERSION_RETIRED_CODE) {
    throw engineRemoteError(ENGINE_VERSION_RETIRED_CODE,
      'The engine version this request pinned is no longer served.',
      { status: 409, requested: reply.requested ?? null, servedVersion: reply.engineVersion ?? null });
  }
  if (response.status === 429) {
    throw engineRemoteError('engine_rate_limited', 'The engine service is rate limiting this caller.', { status: 429 });
  }
  if (response.status >= 400 && response.status < 500) {
    throw engineRemoteError('engine_refused', 'The engine service refused the request.',
      { status: response.status, serverError: typeof reply?.error === 'string' ? reply.error : null });
  }
  if (!response.ok) {
    throw engineRemoteError('engine_unavailable', 'The engine service failed.', { status: response.status });
  }
  if (!reply || typeof reply !== 'object' || typeof reply.engineVersion !== 'string') {
    throw engineRemoteError('engine_reply_invalid', 'The engine service answered outside its contract.');
  }
  return reply;
}

/**
 * The `remote` transport: one generation request → the worker's result packet, from the
 * engine service.
 *
 * @param {any} request the plain-data protocol request (`settlementGenerateAction.js`)
 * @param {RemoteOptions} [opts]
 * @returns {Promise<{ settlement: any, preservation: null, pipelineHistory: Array<{ id: string, summary: any }>, resolvedConfig: any }>}
 */
export async function runRemoteGeneration(request, opts = {}) {
  const payload = request?.payload || {};
  const unsupported = remoteUnsupportedInputs(payload);
  if (unsupported.length > 0) {
    throw engineRemoteError('engine_remote_unsupported',
      `The engine service does not take ${unsupported.join(', ')}; this generation was not made.`,
      { inputs: unsupported });
  }
  const pin = opts.engineVersion ?? null;
  const reply = await postEngine(
    { seed: payload.seed, config: payload.fullConfig, ...(pin ? { engineVersion: pin } : {}) },
    { ...opts, url: opts.url !== undefined ? opts.url : engineFunctionUrl('engine-generate') },
  );
  if (!reply.settlement || typeof reply.settlement !== 'object' || Array.isArray(reply.settlement)) {
    throw engineRemoteError('engine_reply_invalid', 'The engine service answered without a settlement.');
  }
  return {
    // THE STAMP is the version the service ANSWERED, not the one this build carries: the
    // record says which engine made it. Same shape as the local transports' stamp
    // (`generationClient.js :: stampEngineVersion`): the key appended last.
    settlement: { ...reply.settlement, engineVersion: reply.engineVersion },
    // The locked-roster carry is dormant (owner order 2026-09-17 retired every lock
    // control; `domain/locksPreservation.js :: normalizeLocks` honours nothing), so the
    // local core's report is null on every request and the service's is the same.
    preservation: null,
    pipelineHistory: Array.isArray(reply.pipelineHistory) ? reply.pipelineHistory : [],
    // The config the run was born from, as the local core returns it.
    resolvedConfig: payload.fullConfig,
  };
}

/**
 * THE `derive` OP (ENGINE-4 unit 1): the client's own non-birth pipeline call,
 * `generateSettlementPipeline(config, null, { seed, pins? })`, served by engine-generate
 * verbatim (no `birthConfig`, no custom content). Its callers re-run an existing world (the
 * DM layer's re-derivation) or preview a config (the surveyor's construction preview), so the
 * settlement comes back UNSTAMPED, exactly as the local pipeline returns it: the caller's
 * record keeps the engineVersion it was made with.
 *
 * @param {{ seed: unknown, config: unknown, pins?: unknown }} call
 * @param {RemoteOptions} [opts]
 * @returns {Promise<Record<string, any>>} the settlement
 */
export async function runRemoteDerive({ seed, config, pins }, opts = {}) {
  if (typeof seed !== 'string' || !seed) {
    throw engineRemoteError('engine_remote_unsupported',
      'The engine service re-derives only a world with a string seed; this one was not re-derived.',
      { inputs: ['seed'] });
  }
  const pin = opts.engineVersion ?? null;
  const reply = await postEngine(
    { op: 'derive', seed, config, ...(pins === undefined ? {} : { pins }), ...(pin ? { engineVersion: pin } : {}) },
    { ...opts, url: opts.url !== undefined ? opts.url : engineFunctionUrl('engine-generate') },
  );
  if (!reply.settlement || typeof reply.settlement !== 'object' || Array.isArray(reply.settlement)) {
    throw engineRemoteError('engine_reply_invalid', 'The engine service answered without a settlement.');
  }
  return reply.settlement;
}

/**
 * THE `stepMeta` OP (ENGINE-4 unit 1): the pipeline step registry's `getStepMeta()` rows, the
 * static metadata the DM layer's re-derivation builds its pins bag from.
 *
 * @param {RemoteOptions} [opts]
 * @returns {Promise<Array<Record<string, any>>>}
 */
export async function fetchRemoteStepMeta(opts = {}) {
  const pin = opts.engineVersion ?? null;
  const reply = await postEngine(
    { op: 'stepMeta', ...(pin ? { engineVersion: pin } : {}) },
    { ...opts, url: opts.url !== undefined ? opts.url : engineFunctionUrl('engine-generate') },
  );
  if (!Array.isArray(reply.stepMeta)) {
    throw engineRemoteError('engine_reply_invalid', 'The engine service answered without step metadata.');
  }
  return reply.stepMeta;
}

/** The two sections the `regenSection` op regenerates. @type {ReadonlyArray<string>} */
export const REMOTE_REGEN_SECTIONS = Object.freeze(['npcs', 'history']);

/**
 * THE `regenSection` OP (ENGINE-5 unit 1): a section regeneration's pass, served by
 * engine-generate from the engine bundle — `regenNPCsPipeline(settlement, config, { locks })` for
 * 'npcs', `regenHistoryPipeline(settlement, config)` for 'history', the very calls
 * `src/store/settlementRegenAction.js` makes locally — and its return value answered verbatim
 * (the parts, `_regenSeed`, and the out-of-band `_preservation` report when the pass made one).
 * The request carries the whole settlement, so it rides the 1 MiB cap `derive` rides. `seed`
 * replays a prior reroll exactly as the pass's own `options.seed` does; omitted, the service
 * mints one as the pass does locally.
 *
 * @param {{ section: unknown, settlement: unknown, config: unknown, locks?: unknown, seed?: unknown }} call
 * @param {RemoteOptions} [opts]
 * @returns {Promise<Record<string, unknown>>} the pass's return value
 */
export async function runRemoteRegenSection({ section, settlement, config, locks, seed }, opts = {}) {
  if (typeof section !== 'string' || !REMOTE_REGEN_SECTIONS.includes(section)) {
    throw engineRemoteError('engine_remote_unsupported',
      'The engine service regenerates only the npcs and history sections; this section was not regenerated.',
      { inputs: ['section'] });
  }
  const pin = opts.engineVersion ?? null;
  const reply = await postEngine(
    {
      op: 'regenSection', section, settlement, config,
      ...(locks == null ? {} : { locks }),
      ...(seed === undefined ? {} : { seed }),
      ...(pin ? { engineVersion: pin } : {}),
    },
    { ...opts, url: opts.url !== undefined ? opts.url : engineFunctionUrl('engine-generate') },
  );
  if (!reply.parts || typeof reply.parts !== 'object' || Array.isArray(reply.parts)) {
    throw engineRemoteError('engine_reply_invalid', 'The engine service answered without the regenerated section.');
  }
  return /** @type {Record<string, unknown>} */ (reply.parts);
}
