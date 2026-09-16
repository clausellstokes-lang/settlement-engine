#!/usr/bin/env node
/**
 * reader-corpus.mjs — THE CORPUS RUNNER. Renders the roster, or verifies a manifest.
 *
 * USAGE
 *   node scripts/review/reader-corpus.mjs --out artifacts/review/<runId>
 *        [--years 30] [--only <campaignId>[,<campaignId>...]]
 *        [--posture launch|preview|both] [--no-tabs] [--verify <manifest.json>]
 *
 * EXITS  0 rendered or verified · 1 a hash mismatch · 2 usage · 3 a PAUSED campaign or a
 *        non-finite number (the soak's own fail-fast, inherited deliberately).
 *
 * ⛔ THE RUNNER IS VITE'S OWN SSR MODULE LOADER, NOT `vite-node`, AND THE REASON IS A
 * SUPPLY-CHAIN ONE. A JSX transform is genuinely required — plain node is the negative
 * control and it convicts with `ERR_UNKNOWN_FILE_EXTENSION: Unknown file extension ".jsx"`.
 * But `vite-node` is NOT a dependency of this repo: it is absent from `package.json` AND from
 * the lock, and `npx vite-node` resolves only from a machine's npx cache, so on CI, a fresh
 * clone, or offline it is an UNPINNED NETWORK INSTALL — a false-green habitat of exactly the
 * kind this program hunts. `vite` is already a declared devDependency and already in the
 * lock, and `vite-node` is a thin CLI wrapper over the very API used below, so this path
 * costs ZERO new dependencies and ZERO `package.json` bytes (any byte change there is a mint
 * trigger).
 *
 * ⚠ `react` AND `react-dom/server` ARE IMPORTED NORMALLY, NEVER THROUGH `ssrLoadModule`.
 * They are CJS and SSR-external; routing them through the transformer throws
 * `ERR_AMBIGUOUS_MODULE_SYNTAX`. Importing them normally is also what makes the tab render
 * VALID rather than merely successful — the runner and the components must share ONE React
 * instance.
 *
 * ⚠ THE STORE ALIAS IS THE WHOLE TAB HARNESS. The three tab components are the only modules
 * in the graph that reach `src/store/index.js` (measured: no producer imports it), so
 * aliasing it to the reader stub affects the tabs and nothing else.
 *
 * DETERMINISM IS NOT ENFORCED BY LINT HERE, AND THAT IS RECORDED RATHER THAN ASSUMED. The
 * `no-restricted-syntax` determinism ban covers `src/domain/**` and five sibling layers; it
 * does NOT cover `scripts/**`. So nothing but this runner's own `--verify` bit stops a
 * producer reading a wall clock. That bit is a post-hoc instrument, and it is the one we
 * have: `--verify` re-renders in a fresh process and exits non-zero on the FIRST differing
 * hash, naming campaign and document.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '../..');

const argv = process.argv.slice(2);
const flag = (name, dflt = null) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(`--${name}`);

const OUT = flag('out', null);
const YEARS = flag('years', null);
const ONLY = flag('only', null);
const POSTURE = flag('posture', 'both');
const VERIFY = flag('verify', null);
const WANT_TABS = !has('no-tabs');

if (!OUT && !VERIFY) {
  console.error('usage: reader-corpus.mjs --out artifacts/review/<runId> [--years 30] [--only <id>] [--posture launch|preview|both] [--no-tabs]');
  console.error('       reader-corpus.mjs --verify <manifest.json> [--only <id>]');
  process.exit(2);
}
if (!['launch', 'preview', 'both'].includes(POSTURE)) {
  console.error(`--posture must be launch|preview|both, got: ${POSTURE}`);
  process.exit(2);
}

/**
 * The source sha of the tree being rendered. Read from git here — unlike the soak, this
 * runner always runs inside a real checkout — but fail-SOFT: an unknown sha is recorded as
 * `'unknown'` rather than aborting a three-hour render, and it never enters a hashed document.
 */
function sourceSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

/** Boot Vite in middleware mode and hand back its SSR module loader. */
async function bootRunner() {
  const { createServer } = await import('vite');
  const server = await createServer({
    configFile: false,
    root: REPO_ROOT,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, watch: null },
    // ⛔ THE JSX RUNTIME IS THE REPO'S OWN, READ FROM `vite.config.js` RATHER THAN ASSUMED.
    // This tree is on rolldown-vite, whose JSX lowering is configured under `oxc`, and the
    // config sets `jsx: 'automatic'`. With `configFile: false` there is no React plugin, so
    // the default CLASSIC transform emits bare `React.createElement` into files that never
    // import React — and `SettlementPDF.jsx` is one, so every dossier render threw
    // `ReferenceError: React is not defined` and was recorded as a producer error rather than
    // a page. `esbuild` is set alongside so the runner keeps working if the tree moves back
    // off rolldown; whichever key is live wins and the other is inert.
    oxc: { jsx: 'automatic' },
    esbuild: { jsx: 'automatic' },
    // ⛔ `import.meta.env` IS FROZEN TO A LITERAL, AND THIS IS A CORRECTNESS FIX RATHER THAN
    // A CONVENIENCE. Vite's SSR module runner REFUSES dynamic member access on
    // `import.meta.env` ("Dynamic access of import.meta.env is not supported"), and
    // `src/lib/flagRegistry.js:139` reads `import.meta.env[key]` — a computed key, by design,
    // because that is how a flag is looked up by name. Defining the whole object as a literal
    // makes the computed read legal again AND pins what it reads: every VITE_ flag resolves
    // to undefined, so the corpus renders the world with NO env-forced flag overrides. A
    // runner that let the ambient environment reach `flagRegistry` would render a world whose
    // lighting depended on the operator's shell, and no two lanes would agree.
    define: {
      'import.meta.env': JSON.stringify({ MODE: 'production', DEV: false, PROD: true, SSR: true, BASE_URL: '/' }),
    },
    resolve: {
      alias: [
        // The tab harness. Matches the three tabs' own specifier shape.
        { find: /^(.*)\/store\/index\.js$/, replacement: join(HERE, 'readerStoreStub.mjs') },
      ],
    },
  });
  return {
    server,
    load: (relative) => server.ssrLoadModule(`/${relative}`),
  };
}

/**
 * Build the tab renderer. Injected into `renderReaderDocuments` rather than imported by it,
 * so a run WITHOUT this harness records the absence instead of shipping a corpus three
 * surfaces short.
 */
async function buildTabRenderer(load) {
  const [React, ReactDOMServer] = await Promise.all([
    import('react'),
    import('react-dom/server'),
  ]);
  const stub = await load('scripts/review/readerStoreStub.mjs');
  const [faith, war, power] = await Promise.all([
    load('src/components/new/tabs/FaithTab.jsx'),
    load('src/components/new/tabs/WarTab.jsx'),
    load('src/components/new/tabs/PowerTab.jsx'),
  ]);

  // ⚠ `PowerTab`'s DEFAULT export is an OBJECT (a `React.memo` wrapper), not a function. A
  // detector written as `typeof x === 'function'` MISSES it and reports NO_COMPONENT_EXPORT —
  // a failed run's worth of confusion, recorded here so the next reader does not repeat it.
  const componentOf = (mod, named) => mod[named] ?? mod.default;

  return async function renderTabs({ save, campaign, saves }) {
    const out = {};
    const specs = [
      ['faith', componentOf(faith, 'FaithTab'), { settlement: save.settlement, saveId: save.id }],
      ['war', componentOf(war, 'WarTab'), { settlement: save.settlement, saveId: save.id }],
      ['power', componentOf(power, 'PowerTab'), { settlement: save.settlement, powerStructure: save.settlement?.powerStructure ?? null }],
    ];
    for (const [name, Component, props] of specs) {
      // The campaign the tab must see. This is the half the probe did not have, and without
      // it every tab renders its honest-absence shell.
      stub.setReaderStoreState({
        auth: { tier: 'premium_dm' },
        isElevated: () => true,
        campaigns: [campaign],
        savedSettlements: saves,
        focusedEntity: null,
      });
      try {
        const markup = ReactDOMServer.renderToStaticMarkup(React.default.createElement(Component, props));
        out[name] = { ...stub.tabSurfaceIsShell(markup), markup };
      } catch (error) {
        out[name] = { shell: true, bytes: 0, reason: `render threw: ${String(error?.message ?? error)}`, markup: '' };
      }
    }
    return out;
  };
}

/** The roster rows this invocation runs. */
function selectRows(roster) {
  let rows = roster;
  if (POSTURE !== 'both') rows = rows.filter((row) => row.posture === POSTURE);
  if (ONLY) {
    const wanted = new Set(ONLY.split(',').map((s) => s.trim()).filter(Boolean));
    const unknown = [...wanted].filter((id) => !roster.some((row) => row.campaignId === id));
    if (unknown.length) {
      console.error(`--only names campaigns the roster does not carry: ${unknown.join(', ')}`);
      process.exit(2);
    }
    rows = rows.filter((row) => wanted.has(row.campaignId));
  }
  return rows;
}

async function main() {
  const { server, load } = await bootRunner();
  let exitCode = 0;
  try {
    const corpus = await load('scripts/review/readerCorpus.mjs');
    const tabRenderer = WANT_TABS ? await buildTabRenderer(load) : null;
    const rows = selectRows(corpus.READER_CORPUS_ROSTER);
    if (rows.length === 0) {
      console.error('no roster rows selected');
      return 2;
    }

    const posture = corpus.launchPostureIsDark();
    if (!posture.ok) {
      // Not a STOP — a stated finding. A roster that lost the default preset would review a
      // world most customers never see, and saying so beats rendering it silently.
      console.error(`[reader-corpus] LAUNCH POSTURE WARNING: unknown=${posture.unknown.join(',') || '-'} unreadPresets=${posture.missing.join(',') || '-'}`);
    }

    const verifying = Boolean(VERIFY);
    const expected = verifying ? JSON.parse(readFileSync(resolve(VERIFY), 'utf-8')) : null;
    const outDir = OUT ? resolve(REPO_ROOT, OUT) : null;
    const runId = outDir ? outDir.split('/').pop() : 'verify';

    const entries = [];
    const mismatches = [];
    const t0 = Date.now();

    for (const row of rows) {
      const started = Date.now();
      process.stderr.write(`[reader-corpus] ${row.campaignId} (${row.posture}/${row.preset}) …\n`);
      let entry;
      try {
        entry = await corpus.renderReaderCampaign({
          row,
          // ⛔ A VERIFY RUN WRITES NOTHING. It re-renders into memory and compares. Writing
          // would let a verify silently repair the very corpus it is checking.
          outDir: verifying ? null : join(outDir, row.campaignId),
          tabRenderer,
          years: YEARS == null ? null : Number(YEARS),
        });
      } catch (error) {
        console.error(`[reader-corpus] STOP on ${row.campaignId}: ${String(error?.message ?? error)}`);
        return 3;
      }
      const seconds = ((Date.now() - started) / 1000).toFixed(2);
      const docCount = Object.keys(entry.documents).length;
      process.stderr.write(`[reader-corpus] ${row.campaignId}: ${entry.years}y, ${docCount} documents, ${seconds}s\n`);
      entries.push(entry);

      if (verifying) {
        const before = expected.campaigns.find((c) => c.campaignId === row.campaignId);
        if (!before) {
          mismatches.push(`${row.campaignId}: absent from the manifest`);
        } else {
          for (let y = 0; y < entry.yearlyWorldHashes.length; y += 1) {
            if (entry.yearlyWorldHashes[y] !== before.yearlyWorldHashes?.[y]) {
              mismatches.push(`${row.campaignId}: world hash differs at year ${y + 1}`);
              break;
            }
          }
          for (const [id, receipt] of Object.entries(entry.documents)) {
            const was = before.documents?.[id];
            if (!was) { mismatches.push(`${row.campaignId}/${id}: absent from the manifest`); continue; }
            if (was.sha256 !== receipt.sha256) {
              mismatches.push(`${row.campaignId}/${id}: sha256 ${was.sha256.slice(0, 12)} → ${receipt.sha256.slice(0, 12)}`);
            }
          }
        }
        if (mismatches.length) {
          // STOP ON THE FIRST DIFFERING HASH, as chartered: a fork or a volatile field is to
          // be named and cured, never averaged over the rest of the roster.
          console.error('[reader-corpus] VERIFY FAILED:');
          for (const line of mismatches.slice(0, 20)) console.error(`  ${line}`);
          return 1;
        }
      }
    }

    const manifest = corpus.readerCorpusManifest({ runId, sourceSha: sourceSha(), campaigns: entries });
    if (!verifying) {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
      // The receipt is printed FROM the writer and read back, never asserted beside it.
      const readBack = JSON.parse(readFileSync(join(outDir, 'manifest.json'), 'utf-8'));
      const campaignCount = readBack.campaigns.length;
      const documentCount = readBack.campaigns.reduce((n, c) => n + Object.keys(c.documents).length, 0);
      process.stderr.write(`[reader-corpus] wrote ${join(outDir, 'manifest.json')}: ${campaignCount} campaigns, ${documentCount} documents, ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
    } else {
      process.stderr.write(`[reader-corpus] VERIFY OK: ${entries.length} campaigns, every hash reproduced\n`);
    }
  } finally {
    await server.close();
  }
  return exitCode;
}

main().then((code) => process.exit(code)).catch((error) => {
  console.error(error?.stack ?? String(error));
  process.exit(3);
});
