/**
 * e2e/support/engineFunction.js — THE REAL engine-generate HANDLER, served inside the Playwright
 * process (remote-path R5, 2026-11-10).
 *
 * The flagged browser spec (`e2e/engine-remote-flagged.spec.js`) must be answered by the
 * function's OWN code, not a hand-written JSON. The function is Deno TypeScript with two URL
 * imports (`serve` from deno.land/std, `createClient` from esm.sh) that neither Node nor CI's
 * e2e job can fetch. So `supabase/functions/engine-generate/index.ts` is bundled here by esbuild
 * — the same bundler `npm run build:edge-shared` uses — with exactly those two imports replaced
 * by inert stubs; everything else (`_shared/requestMeta.ts`, `cors.ts`, `rateLimit.ts`,
 * `sessionGate.ts`, the committed `_shared/engineBundle.js` and its meta) is the function's own
 * source. `handleEngineGenerate(req, { adminClient })` then runs with a service-role double in
 * the shape the function's own Deno suite (`index.test.ts :: makeAdmin`) uses.
 *
 * Not a spec file: Playwright's default testMatch (`*.spec.*` / `*.test.*`) does not collect it.
 */
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ENTRY = join(ROOT, 'supabase', 'functions', 'engine-generate', 'index.ts');

/** The function's two URL imports, and what each becomes in Node. */
const URL_STUBS = {
  'https://deno.land/std@0.177.0/http/server.ts':
    'export function serve() { throw new Error("serve is not used in the e2e harness"); }',
  'https://esm.sh/@supabase/supabase-js@2.108.2':
    'export function createClient() { throw new Error("the e2e harness passes its own adminClient"); }',
};

/** @type {Promise<{ handleEngineGenerate: (req: Request, deps?: object) => Promise<Response>, ENGINE_VERSION: string }>|null} */
let loaded = null;

/**
 * Bundle and import the real handler once per worker.
 * @returns {Promise<{ handleEngineGenerate: (req: Request, deps?: object) => Promise<Response>, ENGINE_VERSION: string }>}
 */
export function loadEngineFunction() {
  loaded ??= (async () => {
    // The module reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY through Deno.env at load.
    globalThis.Deno ??= /** @type {any} */ ({ env: { get: () => '' } });
    const dir = mkdtempSync(join(tmpdir(), 'engine-generate-e2e-'));
    const outfile = join(dir, 'engineGenerate.mjs');
    try {
      await build({
        entryPoints: [ENTRY],
        outfile,
        bundle: true,
        format: 'esm',
        platform: 'node',
        target: 'node20',
        logLevel: 'silent',
        plugins: [{
          name: 'deno-url-stubs',
          setup(b) {
            b.onResolve({ filter: /^https:\/\// }, (args) => {
              if (!(args.path in URL_STUBS)) throw new Error(`unexpected URL import in the function: ${args.path}`);
              return { path: args.path, namespace: 'deno-url-stub' };
            });
            b.onLoad({ filter: /.*/, namespace: 'deno-url-stub' }, (args) => ({ contents: URL_STUBS[args.path], loader: 'js' }));
          },
        }],
      });
      return await import(pathToFileURL(outfile).href);
    } finally {
      // The module is loaded; its file is no longer needed.
      rmSync(dir, { recursive: true, force: true });
    }
  })();
  return loaded;
}

/**
 * A service-role double (the shape of `index.test.ts :: makeAdmin`): no user resolves, so every
 * caller is anonymous and metered per IP; the cost log's insert succeeds; the rate limiter
 * answers `underRate`.
 * @param {{ underRate?: boolean }} [opts]
 */
export function adminDouble({ underRate = true } = {}) {
  const client = {
    auth: { getUser: async () => ({ data: { user: null }, error: { message: 'no session in e2e' } }) },
    from() {
      const q = {
        select: () => q,
        eq: () => q,
        maybeSingle: async () => ({ data: null, error: null }),
        upsert: async () => ({ error: null }),
        insert: async () => ({ error: null }),
      };
      return q;
    },
    rpc: async (fn) => (fn === 'account_is_active'
      ? { data: true, error: null }
      : { data: underRate, error: null }),
  };
  return () => client;
}

/**
 * Answer a Playwright route with the real handler's response.
 * @param {import('@playwright/test').Route} route
 * @param {{ underRate?: boolean, onReply?: (r: { status: number, op: string }) => void }} [opts]
 */
export async function answerWithEngineFunction(route, { underRate = true, onReply } = {}) {
  const { handleEngineGenerate } = await loadEngineFunction();
  const request = route.request();
  const body = request.postData();
  const req = new Request(request.url(), {
    method: request.method(),
    headers: await request.allHeaders(),
    ...(body == null || request.method() === 'GET' ? {} : { body }),
  });
  const res = await handleEngineGenerate(req, { adminClient: adminDouble({ underRate }) });
  const text = await res.text();
  let op = 'generate';
  try { op = JSON.parse(body || '{}').op || 'generate'; } catch { /* not JSON */ }
  onReply?.({ status: res.status, op });
  await route.fulfill({ status: res.status, headers: Object.fromEntries(res.headers.entries()), body: text });
}
