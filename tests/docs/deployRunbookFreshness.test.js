/**
 * Freshness walker for docs/DEPLOY.md — the first-cutover runbook.
 *
 * DEPLOY.md is on the pre-authorized launch path, and its two volatile facts —
 * the edge-function deploy list and the current migration head — do NOT
 * self-correct: a stale function list ships a cutover missing whole endpoints
 * (this is exactly how the doc rotted to "10 functions" while disk had 16, and
 * omitted checkout verification, account operations, and auth recovery). The
 * architectureFreshness idiom applied here: derive both facts from the
 * filesystem and fail the gate the moment the runbook drifts, so the prose can
 * only ever be wrong loudly.
 *
 * Mirrors scripts/deploy.sh's discovery rule: a deployable function is any
 * supabase/functions/<name> dir that is not _shared and has an index.ts entry.
 */
import { describe, it, expect } from 'vitest';
import {
  readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const deployMd = readFileSync(resolve(repoRoot, 'docs/DEPLOY.md'), 'utf8');
const deploySh = readFileSync(resolve(repoRoot, 'scripts/deploy.sh'), 'utf8');
const deployConfig = readFileSync(
  resolve(repoRoot, 'scripts/deploy-config.mjs'),
  'utf8',
);
const webhookLeaseMigration = readFileSync(
  resolve(
    repoRoot,
    'supabase/migrations/181_leased_stripe_webhook_events.sql',
  ),
  'utf8',
);
const stripeWebhook = readFileSync(
  resolve(repoRoot, 'supabase/functions/stripe-webhook/index.ts'),
  'utf8',
);
const stripeWebhookLease = readFileSync(
  resolve(repoRoot, 'supabase/functions/_shared/stripeWebhookLease.ts'),
  'utf8',
);

const MAINTAINED_STRIPE_WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'checkout.session.expired',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'refund.created',
  'refund.updated',
  'refund.failed',
  'invoice.paid',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'charge.refunded',
  'charge.dispute.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
].sort();

/** Deployable function dirs, by the same rule scripts/deploy.sh uses. */
function deployableFunctions() {
  const dir = resolve(repoRoot, 'supabase/functions');
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !name.startsWith('_'))
    .filter((name) => existsSync(resolve(dir, name, 'index.ts')))
    .sort();
}

/** The highest-numbered migration file's basename (the current head). */
function migrationHeadFile() {
  const dir = resolve(repoRoot, 'supabase/migrations');
  const files = readdirSync(dir).filter((f) => /^\d+_.*\.sql$/.test(f));
  files.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  return files[files.length - 1];
}

function shellArrayValues(source, name) {
  const match = source.match(
    new RegExp(`${name}=\\(\\n([\\s\\S]*?)\\n\\)`),
  );
  expect(match, `expected ${name} shell array`).toBeTruthy();
  return [...match[1].matchAll(/^\s*"([^"]+)"\s*$/gm)]
    .map((entry) => entry[1]);
}

function documentedStripeEvents() {
  const match = deployMd.match(/Events:\s*([\s\S]*?)\n```/);
  expect(match, 'expected Stripe Events block in DEPLOY.md').toBeTruthy();
  return match[1].match(/[a-z_]+(?:\.[a-z_]+)+/g) ?? [];
}

describe('DEPLOY.md freshness — the runbook derives from the filesystem', () => {
  it('names every deployable edge function (a first cutover deploys all of them)', () => {
    const functions = deployableFunctions();
    expect(functions.length, 'expected to discover edge functions').toBeGreaterThan(0);
    const missing = functions.filter((fn) => !deployMd.includes(fn));
    expect(
      missing,
      `docs/DEPLOY.md omits function dir(s): ${missing.join(', ')} — a first cutover ` +
        `following the runbook would ship without them. Add each to the deploy list.`,
    ).toEqual([]);
  });

  it('states the correct function count', () => {
    const n = deployableFunctions().length;
    // The runbook asserts a "<N> deployable functions" total; it must match disk.
    const claim = deployMd.match(/\*\*(\d+) deployable functions\*\*/);
    expect(claim, 'docs/DEPLOY.md should state the deployable-function count').toBeTruthy();
    expect(Number(claim[1])).toBe(n);
  });

  it('names the current migration head file', () => {
    const head = migrationHeadFile();
    expect(head, 'expected to find a migration head').toBeTruthy();
    expect(
      deployMd.includes(head),
      `docs/DEPLOY.md must name the current migration head (\`${head}\`). ` +
        `When a migration is added, update the "Current migration head" line.`,
    ).toBe(true);
  });
});

describe('canonical deploy safety — durable work and Stripe cutover', () => {
  it('bootstraps both durable workers before migrations and activates both rows afterward', () => {
    const criticalSecretSet = deploySh.indexOf(
      'ACCOUNT_DELETION_CRON_SECRET="$ACCOUNT_DELETION_CRON_SECRET"',
    );
    const accountWorkerDeploy = deploySh.indexOf(
      '\ndeploy_function "account-deletion-worker"\n',
    );
    const refundWorkerDeploy = deploySh.indexOf(
      '\ndeploy_function "payment-refund-worker"\n',
    );
    const accountWorkerReady = deploySh.indexOf(
      '\nwait_for_edge_function_route "account-deletion-worker"\n',
    );
    const refundWorkerReady = deploySh.indexOf(
      '\nwait_for_edge_function_route "payment-refund-worker"\n',
    );
    const migrationPush = deploySh.indexOf('npx supabase db push');
    const accountActivation = deploySh.indexOf(
      '\nconfigure_worker_dispatcher \\\n  "account_deletion_cron"',
    );
    const refundActivation = deploySh.indexOf(
      '\nconfigure_worker_dispatcher \\\n  "payment_refund_recovery_cron"',
    );

    for (const index of [
      criticalSecretSet,
      accountWorkerDeploy,
      refundWorkerDeploy,
      accountWorkerReady,
      refundWorkerReady,
      migrationPush,
      accountActivation,
      refundActivation,
    ]) {
      expect(index).toBeGreaterThan(-1);
    }
    expect(criticalSecretSet).toBeLessThan(accountWorkerDeploy);
    expect(accountWorkerDeploy).toBeLessThan(accountWorkerReady);
    expect(refundWorkerDeploy).toBeLessThan(refundWorkerReady);
    expect(accountWorkerReady).toBeLessThan(migrationPush);
    expect(refundWorkerReady).toBeLessThan(migrationPush);
    expect(migrationPush).toBeLessThan(accountActivation);
    expect(migrationPush).toBeLessThan(refundActivation);

    expect(deploySh).toContain('read_dispatcher_secret');
    expect(deploySh).toContain('openssl rand -hex 32');
    expect(deploySh).toContain('Prefer: return=representation');
    // Shell owns HTTP/order; the companion helper owns structured JSON checks.
    expect(deploySh).toContain('deploy-config.mjs" verify-dispatcher');
    expect(deployConfig).toContain('value?.enabled === true');
    expect(deployConfig).toContain(
      'value?.secret === process.env.DEPLOY_WORKER_SECRET',
    );
  });

  it('registers the complete maintained Stripe event set in script and runbook', () => {
    expect(shellArrayValues(deploySh, 'STRIPE_WEBHOOK_EVENTS').sort())
      .toEqual(MAINTAINED_STRIPE_WEBHOOK_EVENTS);
    expect(documentedStripeEvents().sort())
      .toEqual(MAINTAINED_STRIPE_WEBHOOK_EVENTS);
    expect(deploySh).toContain(
      'STRIPE_WEBHOOK_CURL_ARGS+=(-d "enabled_events[]=$event_type")',
    );
  });

  it('proves the migration-181 lease RPC is visible before webhook creation and deploy', () => {
    const migrationPush = deploySh.indexOf('npx supabase db push');
    const readinessCall = deploySh.lastIndexOf(
      '\nwait_for_stripe_webhook_lease_rpc\n',
    );
    const endpointCreation = deploySh.indexOf(
      'WEBHOOK_RESULT="$(curl "${STRIPE_WEBHOOK_CURL_ARGS[@]}")"',
    );
    const webhookDeploy = deploySh.lastIndexOf(
      '\ndeploy_function "stripe-webhook"\n',
    );
    expect(readinessCall).toBeGreaterThan(migrationPush);
    expect(endpointCreation).toBeGreaterThan(readinessCall);
    expect(webhookDeploy).toBeGreaterThan(endpointCreation);

    expect(deploySh).toContain('/rpc/claim_stripe_webhook_event');
    expect(deploySh).toContain('{"p_event_id":""');
    expect(deploySh).toContain('deploy-config.mjs" verify-lease-probe');
    expect(deployConfig).toContain("result?.code !== 'P0001'");
    expect(deploySh).toContain('schema cache still returns PGRST202');

    const validation = webhookLeaseMigration.indexOf(
      'if v_event_id is null then',
    );
    const insert = webhookLeaseMigration.indexOf(
      'insert into public.processed_webhook_events',
      validation,
    );
    expect(validation).toBeGreaterThan(-1);
    expect(insert).toBeGreaterThan(validation);
    expect(webhookLeaseMigration).toMatch(/transitional[\s\S]*rolling compatibility/i);
    expect(stripeWebhook).toContain('claimStripeWebhookEvent');
    expect(stripeWebhookLease).toMatch(
      /legacy table[\s\S]*rolling deploy/i,
    );
    expect(deployMd).toMatch(
      /direct-table claim only as transitional compatibility/,
    );
  });
});

// ── THE CONSUMED-SECRET CENSUS (dom-2, ODQ §87.2 / §115.1 / §120.3) ───────────
// A secret the deployed code reads and the runbook never names is a cutover that
// looks complete and is not: the operator sets what the doc lists, the function
// reads '' , and the failure surfaces at the first real user. So the required set
// is DERIVED from the functions themselves rather than kept by hand.
//
// ⚠ THE SCAN NEEDS THREE ARMS BECAUSE THE CODE HAS THREE SPELLINGS, and a
// literal-only scan is the vacuity this pin exists to refuse — it reports a
// complete-looking subset while missing every durable-worker cron secret and the
// whole mail seam. It also could not express the ONE deliberate exclusion this
// runbook records, because it never sees that name at all.
//
//   arm 1  Deno.env.get('NAME')                      — the obvious spelling
//   arm 2  const IDENT = 'NAME'; Deno.env.get(IDENT) — all three worker secrets
//   arm 3  env('NAME') through an injected getter    — the mail adapter
describe('DEPLOY.md documents every environment name the functions consume', () => {
  const FUNCTIONS_DIR = resolve(repoRoot, 'supabase/functions');

  /**
   * Every environment name the sources under `dir` actually read, by all three
   * spellings. Returned per-arm so the arms can be shown to be non-redundant.
   * @param {string} dir
   */
  function scanConsumedEnvNames(dir) {
    /** @type {Set<string>} */ const literal = new Set();
    /** @type {Set<string>} */ const viaConst = new Set();
    /** @type {Set<string>} */ const viaGetter = new Set();
    const walk = (d) => {
      for (const entry of readdirSync(d, { withFileTypes: true })) {
        const p = resolve(d, entry.name);
        if (entry.isDirectory()) { walk(p); continue; }
        if (!/\.(?:ts|js)$/.test(entry.name)) continue;
        if (entry.name.includes('.test.')) continue; // test doubles are not deployed code
        const src = readFileSync(p, 'utf8');
        for (const m of src.matchAll(/Deno\.env\.get\(\s*['"]([A-Z0-9_]+)['"]/g)) {
          literal.add(m[1]);
        }
        const consts = new Map(
          [...src.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*['"]([A-Z0-9_]+)['"]/g)]
            .map((m) => [m[1], m[2]]),
        );
        for (const m of src.matchAll(/Deno\.env\.get\(\s*([A-Za-z_$][\w$]*)\s*\)/g)) {
          const name = consts.get(m[1]);
          if (name) viaConst.add(name);
        }
        for (const m of src.matchAll(/\benv\(\s*['"]([A-Z0-9_]+)['"]\s*\)/g)) {
          viaGetter.add(m[1]);
        }
      }
    };
    walk(dir);
    return {
      literal,
      viaConst,
      viaGetter,
      all: new Set([...literal, ...viaConst, ...viaGetter]),
    };
  }

  /** The names written inside the fenced blocks of the runbook's secrets section. */
  function documentedSecretNames() {
    const start = deployMd.indexOf('Functions → Secrets');
    const end = deployMd.indexOf('### Activate the durable account-deletion worker');
    expect(start, 'DEPLOY.md must carry a "Functions → Secrets" section').toBeGreaterThan(-1);
    expect(end, 'the secrets section must end at the deletion-worker activation').toBeGreaterThan(start);
    const section = deployMd.slice(start, end);
    /** @type {Set<string>} */ const names = new Set();
    let inFence = false;
    for (const line of section.split('\n')) {
      if (line.startsWith('```')) { inFence = !inFence; continue; }
      if (!inFence) continue;
      const declared = line.match(/^([A-Z][A-Z0-9_]{2,})\b/);
      if (declared) names.add(declared[1]);
    }
    return names;
  }

  // Every row here is a CONSUMED name the runbook deliberately does not require.
  // A row without a stated reason is not a row — it is a hole with a name on it.
  const DOCUMENTATION_ALLOWLIST = Object.freeze({
    OPERATOR_MESSAGE_CRON_SECRET:
      'Deliberately unset for this release. The broadcast courier ships dormant behind three'
      + ' independent gates and DEPLOY.md says so in prose; listing it as a required secret'
      + ' would tell an operator to arm the thing the release is choosing not to arm.',
  });

  it('CONTROL: the scanner finds a planted secret in all three spellings', () => {
    // A census that reports zero and a census that is broken look identical from
    // the outside. Plant one name in each spelling in a throwaway tree and prove
    // every arm reads it — including the two a literal-only scan cannot see.
    const tmp = mkdtempSync(join(tmpdir(), 'deploy-env-census-'));
    const nested = resolve(tmp, 'nested');
    mkdirSync(nested);
    writeFileSync(resolve(tmp, 'literal.ts'), "const a = Deno.env.get('PLANTED_LITERAL_SECRET');\n");
    writeFileSync(
      resolve(nested, 'viaConst.ts'),
      "const KEY = 'PLANTED_CONST_SECRET';\nconst b = Deno.env.get(KEY);\n",
    );
    writeFileSync(resolve(nested, 'viaGetter.ts'), "const c = env('PLANTED_GETTER_SECRET');\n");
    // …and a test double, which is NOT deployed code and must not enter the census.
    writeFileSync(resolve(tmp, 'thing.test.ts'), "Deno.env.get('PLANTED_TEST_ONLY_SECRET');\n");

    const found = scanConsumedEnvNames(tmp);
    expect(found.literal).toContain('PLANTED_LITERAL_SECRET');
    expect(found.viaConst).toContain('PLANTED_CONST_SECRET');
    expect(found.viaGetter).toContain('PLANTED_GETTER_SECRET');
    expect([...found.all].sort()).toEqual([
      'PLANTED_CONST_SECRET', 'PLANTED_GETTER_SECRET', 'PLANTED_LITERAL_SECRET',
    ]);
    expect(found.all.has('PLANTED_TEST_ONLY_SECRET')).toBe(false);
    rmSync(tmp, { recursive: true, force: true });
  });

  it('CONTROL: arms 2 and 3 are not redundant — each sees live names arm 1 cannot', () => {
    // If this ever passes trivially the extra arms have stopped earning their
    // keep, and a future lane should be told so rather than left guessing.
    const found = scanConsumedEnvNames(FUNCTIONS_DIR);
    const constOnly = [...found.viaConst].filter((n) => !found.literal.has(n)).sort();
    const getterOnly = [...found.viaGetter]
      .filter((n) => !found.literal.has(n) && !found.viaConst.has(n)).sort();
    expect(
      constOnly,
      'the const-resolved arm no longer finds anything the literal arm misses',
    ).not.toEqual([]);
    expect(
      getterOnly,
      'the injected-getter arm no longer finds anything the other two miss',
    ).not.toEqual([]);
    // The durable-worker cron secrets are the reason arm 2 exists.
    expect(constOnly).toContain('OPERATOR_MESSAGE_CRON_SECRET');
  });

  it('every consumed environment name is documented or allowlisted with a reason', () => {
    const consumed = [...scanConsumedEnvNames(FUNCTIONS_DIR).all].sort();
    expect(consumed.length, 'the env scan found nothing — the scan broke').toBeGreaterThan(20);
    // anchored: the assertion above proves `consumed` is a populated census
    const documented = documentedSecretNames();
    expect(documented.size, 'the secrets section parsed to no names').toBeGreaterThan(10);
    const undocumented = consumed
      .filter((n) => !documented.has(n) && !(n in DOCUMENTATION_ALLOWLIST));
    expect(
      undocumented,
      '\nThese environment names are READ by deployed edge functions and named nowhere in'
      + " DEPLOY.md's secrets section. An operator following the runbook deploys code that"
      + ' reads them as empty strings. Add each to the secrets section with its failure mode,'
      + ` or add an allowlist row stating why it is deliberately not required:\n  ${undocumented.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('every allowlist row names a real consumed secret and states a reason', () => {
    const consumed = scanConsumedEnvNames(FUNCTIONS_DIR).all;
    for (const [name, reason] of Object.entries(DOCUMENTATION_ALLOWLIST)) {
      expect(
        consumed.has(name),
        `${name} is allowlisted but nothing consumes it — retire the row`,
      ).toBe(true);
      expect(reason.trim().length, `${name}'s allowlist row states no reason`).toBeGreaterThan(40);
      expect(
        deployMd.includes(name),
        `DEPLOY.md must still explain why ${name} is deliberately not required`,
      ).toBe(true);
    }
  });

  it('the pre-deploy sanity check states the gate length package.json actually chains', () => {
    const pkg = JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
    const steps = pkg.scripts.check.split('&&').length;
    expect(steps).toBeGreaterThan(4);
    // anchored: the assertion above proves the chain parsed before its length is used
    const claim = deployMd.match(/the full (\d+)-stage gate/);
    expect(claim, 'DEPLOY.md must state the gate length in the pre-deploy sanity check').toBeTruthy();
    expect(Number(claim[1])).toBe(steps);
  });

  it('the build command it names is the one vercel.json actually runs', () => {
    const vercel = JSON.parse(readFileSync(resolve(repoRoot, 'vercel.json'), 'utf8'));
    expect(vercel.buildCommand, 'vercel.json must declare a buildCommand').toBeTruthy();
    expect(
      deployMd.includes(`\`${vercel.buildCommand}\``),
      `DEPLOY.md must name vercel.json's real buildCommand (\`${vercel.buildCommand}\`);`
      + ' naming a bare `npx vite build` hides the prebuild/postbuild scripts the'
      + ' sitemap and prerender sections of this runbook depend on.',
    ).toBe(true);
  });
});
