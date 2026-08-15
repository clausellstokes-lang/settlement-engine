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
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
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
