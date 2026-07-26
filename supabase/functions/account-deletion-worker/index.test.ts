// deno-lint-ignore-file no-import-prefix
/**
 * Execution contract for the account-deletion cron entrypoint.
 *
 * Production surface: pg_net invokes this service-role worker, which first
 * enqueues due requests and then drains the shared durable cleanup queue.
 * Failure class: authentication/config drift must fail closed, while enqueue
 * failure must not strand previously durable work. Negative controls assert
 * that no queue or RPC runs behind a disabled or unreadable kill switch.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.env.set("SUPABASE_URL", "https://stub.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "service-role-stub");

const { handleAccountDeletionWorker } = await import("./index.ts");
const SECRET = "correct-horse-battery-staple";

function workerRequest(method = "POST", secret: string | null = SECRET) {
  const headers = new Headers({ "user-agent": "Supabase pg_net/0.7" });
  if (secret !== null) headers.set("x-cron-secret", secret);
  return new Request("https://edge/account-deletion-worker", {
    method,
    headers,
  });
}

function makeAdmin(options: {
  cfg?: Record<string, unknown> | null;
  configError?: boolean;
  enqueueError?: boolean;
} = {}) {
  const rpc: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const upserts: Array<unknown> = [];
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
                        url: "https://stub.supabase.co/functions/v1/account-deletion-worker",
                        secret: SECRET,
                        graceDays: 7,
                        enqueueLimit: 321,
                        claimBatchSize: 17,
                        maxJobsPerRun: 456,
                        staleAfterMinutes: 44,
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
    rpc: (fn: string, args: Record<string, unknown>) => {
      rpc.push({ fn, args });
      if (fn !== "process_account_deletions") {
        throw new Error(`unexpected rpc ${fn}`);
      }
      return Promise.resolve(
        options.enqueueError
          ? { data: null, error: { message: "enqueue failed" } }
          : { data: { queued: 2, ids: ["r1", "r2"] }, error: null },
      );
    },
  };
  return { client, rpc, upserts };
}

const EMPTY_CLEANUP_SUMMARY = {
  claimed: 0,
  completed: 0,
  failed: 0,
  leaseLost: 0,
  sessionsRevoked: 0,
  subscriptionsCanceled: 0,
  customersDeleted: 0,
  pages: 1,
  capped: false,
};

Deno.test("worker is POST-only and refuses an unconfigured secret", async () => {
  let res = await handleAccountDeletionWorker(workerRequest("GET"), {
    envSecret: () => SECRET,
  });
  assertEquals(res.status, 405);

  res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => undefined,
  });
  assertEquals(res.status, 503);
});

Deno.test("worker rejects a wrong or missing cron secret", async () => {
  let res = await handleAccountDeletionWorker(
    workerRequest("POST", "wrong"),
    {
      envSecret: () => SECRET,
    },
  );
  assertEquals(res.status, 403);
  res = await handleAccountDeletionWorker(workerRequest("POST", null), {
    envSecret: () => SECRET,
  });
  assertEquals(res.status, 403);
});

Deno.test("database kill switch fails closed before enqueue/claim", async () => {
  const admin = makeAdmin({ cfg: { enabled: false } });
  let queueCalls = 0;
  const res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    processQueue: () => {
      queueCalls += 1;
      return Promise.resolve(EMPTY_CLEANUP_SUMMARY);
    },
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).skipped, "disabled");
  assertEquals(queueCalls, 0);
  assertEquals(admin.rpc.length, 0);
});

Deno.test("config read failure is 503 and never defaults enabled", async () => {
  const admin = makeAdmin({ configError: true });
  const res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(res.status, 503);
  assertEquals((await res.json()).skipped, "config_unavailable");
});

Deno.test("enabled config remains inert until URL + matching secret are present", async () => {
  let admin = makeAdmin({
    cfg: { enabled: true, url: null, secret: null },
  });
  let res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(res.status, 503);
  assertEquals((await res.json()).skipped, "not_configured");

  admin = makeAdmin({
    cfg: {
      enabled: true,
      url: "https://stub/functions/v1/account-deletion-worker",
      secret: "different",
    },
  });
  res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(res.status, 503);
  assertEquals((await res.json()).skipped, "config_secret_mismatch");
});

Deno.test("happy path enqueues due rows then passes bounded config to the shared queue", async () => {
  const admin = makeAdmin();
  let queueOptions: Record<string, unknown> | null = null;
  const res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    stripeClient: () => null,
    now: () => "2026-07-24T12:00:00.000Z",
    processQueue: (_client, options) => {
      queueOptions = options as unknown as Record<string, unknown>;
      return Promise.resolve({
        ...EMPTY_CLEANUP_SUMMARY,
        claimed: 2,
        completed: 2,
      });
    },
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).ok, true);
  assertEquals(admin.rpc[0].fn, "process_account_deletions");
  assertEquals(admin.rpc[0].args.p_actor, null);
  assertEquals(admin.rpc[0].args.p_limit, 321);
  assertEquals(queueOptions?.claimBatchSize, 17);
  assertEquals(queueOptions?.maxJobs, 456);
  assertEquals(queueOptions?.staleAfterMinutes, 44);
  assertEquals(admin.upserts.length, 1);
});

Deno.test("enqueue failure still drains durable jobs and returns non-success", async () => {
  const admin = makeAdmin({ enqueueError: true });
  let queueCalls = 0;
  const res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    processQueue: () => {
      queueCalls += 1;
      return Promise.resolve({
        ...EMPTY_CLEANUP_SUMMARY,
        claimed: 1,
        completed: 1,
      });
    },
  });
  assertEquals(queueCalls, 1);
  assertEquals(res.status, 502);
  assertEquals((await res.json()).ok, false);
});

Deno.test("partial external failure is queued for retry and never reported done", async () => {
  const admin = makeAdmin();
  const res = await handleAccountDeletionWorker(workerRequest(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    processQueue: () =>
      Promise.resolve({
        ...EMPTY_CLEANUP_SUMMARY,
        claimed: 1,
        failed: 1,
      }),
  });
  assertEquals(res.status, 502);
  assertEquals((await res.json()).queued, true);
});
