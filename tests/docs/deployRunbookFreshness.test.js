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
// ⚠ THE SCAN NEEDS FOUR ARMS BECAUSE THE CODE HAS FOUR SPELLINGS, and a
// literal-only scan is the vacuity this pin exists to refuse — it reports a
// complete-looking subset while missing every durable-worker cron secret and the
// whole mail seam. It also could not express the ONE deliberate exclusion this
// runbook records, because it never sees that name at all.
//
//   arm 1  Deno.env.get('NAME')                      — the obvious spelling
//   arm 2  const IDENT = 'NAME'; Deno.env.get(IDENT) — all three worker secrets
//   arm 3  env('NAME') through an injected getter    — the mail adapter
//   arm 4  alias.env.get('NAME') / readEnv('NAME')   — the runtime-guarded seams
//
// Arm 4 is not a hypothetical. A module that vitest imports under NODE cannot
// name `Deno` directly — the global does not exist there — so it reads through
// `const deno = (globalThis as any).Deno` or a `readEnv(name)` helper, and the
// three ruled arms return [] on those lines. `_shared/verifyTurnstile.ts` is
// written that way and its TURNSTILE_SECRET_KEY was consumed by two live money-
// path doors while being invisible to this census. The cure belongs in the
// SCANNER: `_shared/cors.ts:74-80` documents the guard on purpose and
// tests/edgeFunctions/cors.test.js imports the module from Node, so normalizing
// those sources to a bare `Deno.env.get` would break the Node suite and turn a
// docs pin into an edge-behavior change.
//
// ⚠ Arm 4's alias pattern MATCHES ARM 1'S OWN SPELLING by construction (`Deno`
// is itself a valid identifier), so its non-redundancy control is written on set
// DIFFERENCE, never on set size — a size comparison would pass vacuously.
//
// THE PIN RUNS IN BOTH DIRECTIONS. Every CONSUMED name must be documented, and
// every DOCUMENTED name must still be consumed. The reverse arm was DOM-2's
// RECORDED DEFERRAL and it is now DISCHARGED, not open — see the REVERSE_ALLOWLIST
// block below for the sections that closed it (ODQ §118, §134.1, §473).
describe('DEPLOY.md documents every environment name the functions consume', () => {
  const FUNCTIONS_DIR = resolve(repoRoot, 'supabase/functions');

  /**
   * Every environment name the sources under `dir` actually read, by all four
   * spellings. Returned per-arm so the arms can be shown to be non-redundant.
   * @param {string} dir
   */
  function scanConsumedEnvNames(dir) {
    /** @type {Set<string>} */ const literal = new Set();
    /** @type {Set<string>} */ const viaConst = new Set();
    /** @type {Set<string>} */ const viaGetter = new Set();
    /** @type {Set<string>} */ const viaAlias = new Set();
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
        // arm 4a: an ALIASED Deno global — `const deno = (globalThis as any).Deno;`
        // then `deno.env.get('NAME')`. Deliberately a superset of arm 1.
        for (const m of src.matchAll(/[A-Za-z_$][\w$]*\.env\.get\(\s*['"]([A-Z0-9_]+)['"]/g)) {
          viaAlias.add(m[1]);
        }
        // arm 4b: a NAMED getter whose identifier ends in Env — `readEnv('NAME')`.
        for (const m of src.matchAll(/[A-Za-z_$][\w$]*[Ee]nv\(\s*['"]([A-Z0-9_]+)['"]\s*\)/g)) {
          viaAlias.add(m[1]);
        }
      }
    };
    walk(dir);
    return {
      literal,
      viaConst,
      viaGetter,
      viaAlias,
      all: new Set([...literal, ...viaConst, ...viaGetter, ...viaAlias]),
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

  // ── THE REVERSE DIRECTION (a recorded deferral, now DISCHARGED) ─────────────
  // DOM-2 shipped this pin in ONE direction — consumed ⊆ documented — and wrote
  // the reason down rather than leaving a hole: DOM-3 had not yet landed, so the
  // founder purchase path still existed with its price id listed in the runbook,
  // and STRIPE_PRICE_FOUNDER_LIFETIME would have redded a bidirectional pin on
  // that one line. The condition is CLOSED. DOM-3 landed (ODQ §118, §134.1 — the
  // ABOLISHED_PRODUCTS set in create-checkout) and WEB-8 struck the orphaned name
  // from the runbook (ODQ §473, "52 → 51 secrets"). The reverse direction measures
  // zero at this base, so the arm below lands GREEN and the deferral is discharged
  // rather than re-recorded.
  //
  // Why the reverse direction is worth a pin at all: a documented secret nobody
  // reads is a standing instruction to an operator to set something that does
  // nothing, and an operator who finds one stale row trusts the next one less —
  // which is precisely the trust the forward arm exists to protect.
  const REVERSE_ALLOWLIST = Object.freeze({
    // EMPTY AT LANDING. The ONLY lawful row is a secret documented AHEAD of the
    // code that will read it, and the row must NAME the car/packet that will
    // consume it, e.g.
    //   STRIPE_PRICE_SOMETHING:
    //     'Documented ahead of the code that reads it: WEB-12 lands the SKU next
    //      wave and the operator must have the price set before that deploy.',
    // A row without a named consuming car is not a row — it is a stale
    // instruction to an operator with an excuse attached. DELETE THE ROW IN THE
    // SAME COMMIT that lands the consuming code.
  });

  /**
   * Every way a reverse-allowlist row can be wrong, as sorted complaint strings.
   * EXTRACTED ON PURPOSE: REVERSE_ALLOWLIST is empty at landing, and a loop over
   * an empty object is an assertion that cannot fail. The rule is therefore also
   * exercised against fabricated rows by the control below.
   * @param {Record<string, string>} rows
   * @param {Set<string>} documented
   * @param {Set<string>} consumed
   */
  function reverseAllowlistComplaints(rows, documented, consumed) {
    /** @type {string[]} */ const out = [];
    for (const [name, reason] of Object.entries(rows)) {
      if (!documented.has(name)) {
        out.push(`${name}: reverse-allowlisted but DEPLOY.md does not document it — retire the row`);
      }
      if (consumed.has(name)) {
        out.push(`${name}: IS consumed now — delete the row, the forward arm covers it`);
      }
      if (String(reason).trim().length <= 40) {
        out.push(`${name}: states no reason`);
      } else if (!/\b[A-Z]{2,}-\d+\b/.test(String(reason))) {
        out.push(`${name}: names no consuming car — a row must name the car that will read it`);
      }
    }
    return out.sort();
  }

  it('CONTROL: the scanner finds a planted secret in all four spellings', () => {
    // A census that reports zero and a census that is broken look identical from
    // the outside. Plant one name in each spelling in a throwaway tree and prove
    // every arm reads it — including the three a literal-only scan cannot see.
    const tmp = mkdtempSync(join(tmpdir(), 'deploy-env-census-'));
    const nested = resolve(tmp, 'nested');
    mkdirSync(nested);
    writeFileSync(resolve(tmp, 'literal.ts'), "const a = Deno.env.get('PLANTED_LITERAL_SECRET');\n");
    writeFileSync(
      resolve(nested, 'viaConst.ts'),
      "const KEY = 'PLANTED_CONST_SECRET';\nconst b = Deno.env.get(KEY);\n",
    );
    writeFileSync(resolve(nested, 'viaGetter.ts'), "const c = env('PLANTED_GETTER_SECRET');\n");
    // Arm 4's TWO shapes, both live in this tree and both invisible to arms 1-3:
    // a runtime-guarded alias of the Deno global, and a named `…Env(name)` helper.
    writeFileSync(
      resolve(nested, 'viaAlias.ts'),
      'const deno = (globalThis as any).Deno;\n'
      + "const d = deno.env.get('PLANTED_ALIAS_SECRET');\n"
      + "const e = readEnv('PLANTED_NAMED_GETTER_SECRET');\n",
    );
    // …and a test double, which is NOT deployed code and must not enter the census.
    writeFileSync(resolve(tmp, 'thing.test.ts'), "Deno.env.get('PLANTED_TEST_ONLY_SECRET');\n");

    const found = scanConsumedEnvNames(tmp);
    expect(found.literal).toContain('PLANTED_LITERAL_SECRET');
    expect(found.viaConst).toContain('PLANTED_CONST_SECRET');
    expect(found.viaGetter).toContain('PLANTED_GETTER_SECRET');
    expect(found.viaAlias).toContain('PLANTED_ALIAS_SECRET');
    expect(found.viaAlias).toContain('PLANTED_NAMED_GETTER_SECRET');
    // Arm 4a is a SUPERSET of arm 1 by construction — it reads `Deno.env.get` too.
    // Stated here as an assertion so the overlap is a measured fact, and so the
    // non-redundancy control below is visibly forced onto set DIFFERENCE.
    expect(found.viaAlias).toContain('PLANTED_LITERAL_SECRET');
    expect([...found.all].sort()).toEqual([
      'PLANTED_ALIAS_SECRET', 'PLANTED_CONST_SECRET', 'PLANTED_GETTER_SECRET',
      'PLANTED_LITERAL_SECRET', 'PLANTED_NAMED_GETTER_SECRET',
    ]);
    expect(found.all.has('PLANTED_TEST_ONLY_SECRET')).toBe(false);
    rmSync(tmp, { recursive: true, force: true });
  });

  it('CONTROL: arms 2, 3 and 4 are not redundant — each sees live names the earlier arms cannot', () => {
    // If this ever passes trivially the extra arms have stopped earning their
    // keep, and a future lane should be told so rather than left guessing.
    const found = scanConsumedEnvNames(FUNCTIONS_DIR);
    const constOnly = [...found.viaConst].filter((n) => !found.literal.has(n)).sort();
    const getterOnly = [...found.viaGetter]
      .filter((n) => !found.literal.has(n) && !found.viaConst.has(n)).sort();
    const aliasOnly = [...found.viaAlias]
      .filter((n) => !found.literal.has(n) && !found.viaConst.has(n) && !found.viaGetter.has(n))
      .sort();
    expect(
      constOnly,
      'the const-resolved arm no longer finds anything the literal arm misses',
    ).not.toEqual([]);
    expect(
      getterOnly,
      'the injected-getter arm no longer finds anything the other two miss',
    ).not.toEqual([]);
    expect(
      aliasOnly,
      '\nThe runtime-guarded-alias arm (arm 4) no longer finds any name the three ruled arms'
      + ' miss. Arm 4a matches arm 1\'s own spelling by construction, so this control is'
      + ' written on set DIFFERENCE and an empty difference means the arm has stopped earning'
      + ' its keep — NOT that it is fine. WHAT TO DO, in order:\n'
      + '  1. If a source normalized its guarded alias back to a bare `Deno.env.get`, check'
      + ' first that the module is not imported by vitest under Node (where `Deno` is'
      + ' undefined) — see supabase/functions/_shared/cors.ts and tests/edgeFunctions/cors.test.js.'
      + ' If the normalization is legitimate and no guarded reader remains, RETIRE arm 4 and'
      + ' this clause together, in one commit, with the census re-measured.\n'
      + '  2. If a different name now carries the arm, RE-POINT the expectation below at it.\n'
      + 'Do not delete the assertion to make the gate green.\n',
    ).not.toEqual([]);
    // The durable-worker cron secrets are the reason arm 2 exists.
    expect(constOnly).toContain('OPERATOR_MESSAGE_CRON_SECRET');
    // The Turnstile seam is the reason arm 4 exists: _shared/verifyTurnstile.ts reads
    // its secret through `(globalThis as any).Deno` so the module stays importable under
    // Node, and it gates two live money-path doors (create-checkout, verify-single-dossier).
    expect(aliasOnly).toContain('TURNSTILE_SECRET_KEY');
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

  it('every documented secret is still consumed — the reverse direction (ODQ §118 / §134.1 / §473)', () => {
    const consumed = scanConsumedEnvNames(FUNCTIONS_DIR).all;
    expect(consumed.size, 'the env scan found nothing — the scan broke').toBeGreaterThan(20);
    // anchored: the assertion above proves `consumed` is a populated census
    const documented = [...documentedSecretNames()].sort();
    expect(documented.length, 'the secrets section parsed to no names').toBeGreaterThan(10);
    const orphaned = documented.filter((n) => !consumed.has(n) && !(n in REVERSE_ALLOWLIST));
    expect(
      orphaned,
      '\nThese names are listed as REQUIRED SECRETS in DEPLOY.md and are read by NO deployed'
      + ' edge function. Each one tells an operator on a first cutover to go and set something'
      + ' that does nothing — and a runbook with one stale row is trusted less on the next one.'
      + ' Either the code that reads the name was deleted (strike the runbook line, as WEB-8'
      + ' did for STRIPE_PRICE_FOUNDER_LIFETIME), or the name is documented AHEAD of the code'
      + ' that will read it (add a REVERSE_ALLOWLIST row NAMING THE CAR that will consume it,'
      + ` and delete that row in the same commit that lands it):\n  ${orphaned.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('every reverse-allowlist row is documented, unconsumed, and names its consuming car', () => {
    const consumed = scanConsumedEnvNames(FUNCTIONS_DIR).all;
    const documented = documentedSecretNames();
    expect(
      reverseAllowlistComplaints(REVERSE_ALLOWLIST, documented, consumed),
      'a reverse-allowlist row is not carrying its own weight',
    ).toEqual([]);
  });

  it('CONTROL: the reverse-allowlist rule rejects every way a row can be wrong', () => {
    // REVERSE_ALLOWLIST is EMPTY at landing, so the test above loops over nothing
    // and would pass however broken the rule were. Exercise the rule itself.
    const documented = new Set(['DOCUMENTED_PLANNED', 'DOCUMENTED_AND_READ', 'DOCUMENTED_NO_CAR']);
    const consumed = new Set(['DOCUMENTED_AND_READ']);
    const goodReason = 'Documented ahead of the code that reads it: WEB-12 lands the SKU next wave.';

    // A lawful row raises nothing.
    expect(reverseAllowlistComplaints(
      { DOCUMENTED_PLANNED: goodReason }, documented, consumed,
    )).toEqual([]);

    // …and each unlawful shape raises exactly its own complaint.
    expect(reverseAllowlistComplaints({
      NEVER_DOCUMENTED: goodReason,
      DOCUMENTED_AND_READ: goodReason,
      DOCUMENTED_PLANNED: 'because.',
      DOCUMENTED_NO_CAR: 'documented ahead of the code that will eventually read it, one day.',
    }, documented, consumed)).toEqual([
      'DOCUMENTED_AND_READ: IS consumed now — delete the row, the forward arm covers it',
      'DOCUMENTED_NO_CAR: names no consuming car — a row must name the car that will read it',
      'DOCUMENTED_PLANNED: states no reason',
      'NEVER_DOCUMENTED: reverse-allowlisted but DEPLOY.md does not document it — retire the row',
    ]);
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
