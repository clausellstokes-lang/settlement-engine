#!/usr/bin/env node
/**
 * env-shim.mjs — the ONE seam that lets a plain `node` process import the product's
 * STORE layer. Registered with `node --import <this file> <script>`.
 *
 * ⛔⛔ WHY THIS FILE EXISTS AT ALL — MEASURED, NOT ASSUMED.
 * The REAL birth path (`src/store/campaignImportedCreation.js`) statically imports
 * `../lib/campaigns.js`, which statically imports `./supabase.js`, whose line 17 reads
 *
 *     const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
 *
 * Under bare `node`, `import.meta.env` is `undefined`, so the import throws
 * `TypeError: Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')` before a
 * single line of birth code runs. Every existing audit script in `scripts/audit/` reaches
 * only `src/domain/**` and `src/generators/**`, which is why nothing in the tree has hit
 * this before: THE STORE LAYER HAS NEVER BEEN DRIVEN FROM A PLAIN NODE SCRIPT HERE.
 *
 * ⭐ WHAT IT DOES, AND WHY IT IS A SHIM AND NOT A MOCK.
 * A `load` hook prepends ONE line — `import.meta.env ??= {…};` — to source files under the
 * tree that literally contain `import.meta.env`. It supplies an EMPTY env by default, which
 * drives the product's OWN documented unconfigured arm: `supabaseUrl`/`supabaseAnon` fall to
 * `''`, `isConfigured` is `false`, and `campaigns.js` takes the local-cache authority — the
 * same arm the file's own header describes as "local dev without Supabase configured".
 * Nothing is replaced, no export is redefined, no behaviour is stubbed. If the shim ever
 * has to supply a VALUE, pass it in `LPROBE_VITE_ENV` as JSON and it is echoed to stderr,
 * so a probe can never quietly run against a configured cloud.
 *
 * ⚠ IT TOUCHES NOTHING ON DISK. The rewrite happens in the loader, in memory. The tree
 * receives zero writes; there is no farm and no temp copy.
 *
 * ⚠ ONE LINE OF STACK OFFSET. The prepended line shifts every rewritten module's reported
 * line numbers by exactly 1. Recorded here rather than discovered in a traceback.
 *
 * A REFUSAL, NOT A FALLBACK: if `LPROBE_VITE_ENV` is set and does not parse, the process
 * exits 2. It never falls back to an empty env while claiming it used the supplied one.
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

let injected = {};
if (process.env.LPROBE_VITE_ENV) {
  try {
    injected = JSON.parse(process.env.LPROBE_VITE_ENV);
  } catch (error) {
    process.stderr.write(`env-shim: LPROBE_VITE_ENV is not valid JSON — REFUSING to run with an env`
      + ` different from the one that was asked for. ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(2);
  }
  process.stderr.write(`env-shim: injecting a NON-EMPTY import.meta.env: ${JSON.stringify(Object.keys(injected).sort())}\n`);
} else {
  process.stderr.write('env-shim: injecting an EMPTY import.meta.env (the product\'s unconfigured arm).\n');
}

register('./env-shim-hooks.mjs', {
  parentURL: pathToFileURL(`${import.meta.dirname}/`),
  data: { env: injected },
});
