// deno-lint-ignore-file no-import-prefix
/**
 * Execution contract for the payment-refund cron entrypoint.
 *
 * Production surface: pg_net invokes this service-role worker, which delegates
 * every obligation to the shared leased reconciler. Failure class: secret or
 * dispatcher drift must fail closed, and transient or terminal refund failures
 * must never look like a clean run. Negative controls assert that no claim runs
 * behind a disabled or unreadable database kill switch.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.env.set("SUPABASE_URL", "https://stub.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "service-role-stub");

const { handlePaymentRefundWorker } = await import("./index.ts");
const SECRET = "correct-horse-battery-staple";

function workerRequest(method = "POST", secret: string | null = SECRET) {
  const headers = new Headers();
  if (secret !== null) headers.set("x-cron-secret", secret);
  return new Request("https://edge/payment-refund-worker", {
    method,
    headers,
  });
}

function makeAdmin(options: {
  cfg?: Record<string, unknown> | null;
  configError?: boolean;
} = {}) {
  const upserts: unknown[] = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => {
      if (table !== "system_config") {
        throw new Error(`unexpected table ${table}`);
      }
      return {
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve(
                options.configError
                  ? { data: null, error: { message: "config unavailable" } }
                  : {
                    data: {
                      value: options.cfg ?? {
                        enabled: true,
                        url:
                          "https://stub.supabase.co/functions/v1/payment-refund-worker",
                        secret: SECRET,
                        claimBatchSize: 7,
                        maxJobsPerRun: 19,
                        leaseSeconds: 240,
                        retryBaseSeconds: 90,
                      },
                    },
                    error: null,
                  },
              ),
          }),
        }),
        upsert: (rows: unknown) => {
          upserts.push(rows);
          return Promise.resolve({ error: null });
        },
      };
    },
  };
  return { client, upserts };
}

const EMPTY_RECOVERY_SUMMARY = {
  claimed: 0,
  reconciled: 0,
  succeeded: 0,
  nonterminal: 0,
  manualAction: 0,
  failed: 0,
  retryScheduled: 0,
  leaseLost: 0,
  moneyEventsMirrored: 0,
  pages: 1,
  capped: false,
};

Deno.test("refund worker is POST-only and fail-closed on its environment secret", async () => {
  let response = await handlePaymentRefundWorker(workerRequest("GET"), {
    envSecret: () => SECRET,
  });
  assertEquals(response.status, 405);

  response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => undefined,
  });
  assertEquals(response.status, 503);

  response = await handlePaymentRefundWorker(
    workerRequest("POST", "wrong"),
    {
      envSecret: () => SECRET,
    },
  );
  assertEquals(response.status, 403);
});

Deno.test("database kill switch and config reads fail closed before claims", async () => {
  let admin = makeAdmin({ cfg: { enabled: false } });
  let queueCalls = 0;
  let response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    processQueue: () => {
      queueCalls += 1;
      return Promise.resolve(EMPTY_RECOVERY_SUMMARY);
    },
  });
  assertEquals(response.status, 200);
  assertEquals((await response.json()).skipped, "disabled");
  assertEquals(queueCalls, 0);

  admin = makeAdmin({ configError: true });
  response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(response.status, 503);
  assertEquals((await response.json()).skipped, "config_unavailable");
});

Deno.test("enabled config remains inert until URL and matching secret are present", async () => {
  let admin = makeAdmin({
    cfg: { enabled: true, url: null, secret: null },
  });
  let response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(response.status, 503);
  assertEquals((await response.json()).skipped, "not_configured");

  admin = makeAdmin({
    cfg: {
      enabled: true,
      url: "https://stub/functions/v1/payment-refund-worker",
      secret: "different",
    },
  });
  response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(response.status, 503);
  assertEquals((await response.json()).skipped, "config_secret_mismatch");
});

Deno.test("happy path passes bounded database config into the leased reconciler", async () => {
  const admin = makeAdmin();
  let queueOptions: Record<string, unknown> | null = null;
  const response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    stripeClient: () => null,
    now: () => "2026-07-24T12:00:00.000Z",
    processQueue: (_client, options) => {
      queueOptions = options as unknown as Record<string, unknown>;
      return Promise.resolve({
        ...EMPTY_RECOVERY_SUMMARY,
        claimed: 2,
        reconciled: 2,
        succeeded: 2,
      });
    },
  });
  assertEquals(response.status, 200);
  assertEquals((await response.json()).ok, true);
  assertEquals(queueOptions?.claimBatchSize, 7);
  assertEquals(queueOptions?.maxJobs, 19);
  assertEquals(queueOptions?.leaseSeconds, 240);
  assertEquals(queueOptions?.retryBaseSeconds, 90);
  assertEquals(admin.upserts.length, 1);
});

Deno.test("transient and terminal refund failures are never reported as a clean run", async () => {
  const admin = makeAdmin();
  const response = await handlePaymentRefundWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    processQueue: () =>
      Promise.resolve({
        ...EMPTY_RECOVERY_SUMMARY,
        claimed: 2,
        failed: 1,
        retryScheduled: 1,
        manualAction: 1,
      }),
  });
  const body = await response.json();
  assertEquals(response.status, 502);
  assertEquals(body.ok, false);
  assertEquals(body.retryScheduled, true);
  assertEquals(body.manualActionRequired, true);
});
