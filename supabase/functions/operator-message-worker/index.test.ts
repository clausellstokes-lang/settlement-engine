// deno-lint-ignore-file no-import-prefix
/** Execution contract for the disabled-by-default Operator Messages courier. */
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import type { MailAdapter, MailMessage } from "../_shared/mailAdapter.ts";

Deno.env.set("SUPABASE_URL", "https://stub.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "service-role-stub");
Deno.env.set("CLIENT_URL", "https://settlementforge.example");

const { handleOperatorMessageWorker } = await import("./index.ts");
const SECRET = "operator-courier-secret";

function request(method = "POST", secret: string | null = SECRET) {
  const headers = new Headers();
  if (secret !== null) headers.set("x-cron-secret", secret);
  return new Request("https://edge/operator-message-worker", { method, headers });
}

const JOB = {
  job_id: "job-1",
  message_id: "message-1",
  lease_token: "lease-1",
  message_class: "announcement",
  subject: "A product letter",
  body: "The operator-authored body.",
  cursor_created_at: null,
  cursor_user_id: null,
};

function makeAdmin(options: {
  config?: Record<string, unknown>;
  configError?: boolean;
  jobs?: Array<Record<string, unknown>>;
  recipients?: Array<Record<string, unknown>>;
  claims?: Record<string, Record<string, unknown>>;
  pageError?: boolean;
  renewErrorAt?: number;
  resultError?: boolean;
} = {}) {
  const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const upserts: unknown[] = [];
  let renewalCount = 0;
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => {
      if (table !== "system_config") throw new Error(`unexpected table ${table}`);
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve(options.configError
              ? { data: null, error: { message: "config unavailable" } }
              : {
                data: {
                  value: options.config ?? {
                    enabled: true,
                    url: "https://stub.supabase.co/functions/v1/operator-message-worker",
                    secret: SECRET,
                    maxJobsPerRun: 3,
                    recipientBatchSize: 10,
                    leaseSeconds: 180,
                  },
                },
                error: null,
              }),
          }),
        }),
        upsert: (rows: unknown) => {
          upserts.push(rows);
          return Promise.resolve({ error: null });
        },
      };
    },
    rpc: (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      if (fn === "claim_operator_message_delivery_jobs") {
        return Promise.resolve({ data: options.jobs ?? [], error: null });
      }
      if (fn === "page_operator_message_recipients") {
        return Promise.resolve(options.pageError
          ? { data: null, error: { message: "lease lost" } }
          : { data: options.recipients ?? [], error: null });
      }
      if (fn === "renew_operator_message_delivery_job_lease") {
        renewalCount += 1;
        if (options.renewErrorAt === renewalCount) {
          return Promise.resolve({ data: null, error: { message: "lease expired" } });
        }
        return Promise.resolve({
          data: {
            job_id: args.p_job_id,
            lease_token: args.p_lease_token,
            lease_expires_at: "2026-08-02T12:04:00.000Z",
          },
          error: null,
        });
      }
      if (fn === "claim_operator_message_recipient") {
        const userId = String(args.p_user_id);
        const explicit = options.claims?.[userId];
        if (explicit) return Promise.resolve({ data: [explicit], error: null });
        const recipient = options.recipients?.find((row) => row.user_id === userId);
        if (!recipient?.email_eligible || typeof recipient.email !== "string") {
          return Promise.resolve({ data: [{ claimed: false }], error: null });
        }
        return Promise.resolve({
          data: [{
            claimed: true,
            attempt_token: `attempt-${userId}`,
            email: recipient.email,
            unsubscribe_token: recipient.unsubscribe_token ?? null,
            email_idempotency_key: `idempotency-${userId}`,
          }],
          error: null,
        });
      }
      if (fn === "record_operator_message_delivery_result") {
        return Promise.resolve(options.resultError
          ? { data: null, error: { message: "attempt token no longer owns receipt" } }
          : { data: { recorded: true }, error: null });
      }
      return Promise.resolve({ data: true, error: null });
    },
  };
  return { client, calls, upserts };
}

function makeMailer(options: { fail?: boolean } = {}) {
  const messages: MailMessage[] = [];
  const adapter: MailAdapter = {
    id: "test-provider",
    configured: true,
    from: "operator@example.com",
    token: "not-a-real-secret",
    supportsIdempotency: true,
    send: (message) => {
      messages.push(message);
      if (options.fail) return Promise.reject(new Error("provider echoed someone@example.com"));
      return Promise.resolve({ id: "provider-1" });
    },
  };
  return { adapter, messages };
}

Deno.test("operator courier is POST-only and fails closed on secret or disabled config", async () => {
  let response = await handleOperatorMessageWorker(request("GET"), {
    envSecret: () => SECRET,
  });
  assertEquals(response.status, 405);

  response = await handleOperatorMessageWorker(request(), {
    envSecret: () => undefined,
  });
  assertEquals(response.status, 503);

  response = await handleOperatorMessageWorker(request("POST", "wrong"), {
    envSecret: () => SECRET,
  });
  assertEquals(response.status, 403);

  const admin = makeAdmin({ config: { enabled: false } });
  response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
  });
  assertEquals(response.status, 200);
  assertEquals((await response.json()).skipped, "disabled");
  assertEquals(admin.calls.length, 0);
});

Deno.test("announcement page validates the active lease, honors opt-out, and advances one stable cursor", async () => {
  const admin = makeAdmin({
    jobs: [JOB],
    recipients: [
      { user_id: "user-opted-out", email: "out@example.com", created_at: "2026-01-01T00:00:00Z", email_eligible: false, unsubscribe_token: null },
      { user_id: "user-consented", email: "stale@example.com", created_at: "2026-01-02T00:00:00Z", email_eligible: true, unsubscribe_token: "11111111-1111-4111-8111-111111111111" },
      { user_id: "user-no-email", email: null, created_at: "2026-01-03T00:00:00Z", email_eligible: true, unsubscribe_token: "22222222-2222-4222-8222-222222222222" },
    ],
    claims: {
      "user-consented": {
        claimed: true,
        attempt_token: "attempt-consented",
        email: "fresh@example.com",
        unsubscribe_token: "33333333-3333-4333-8333-333333333333",
        email_idempotency_key: "44444444-4444-4444-8444-444444444444",
      },
    },
  });
  const mailer = makeMailer();
  const response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => mailer.adapter,
    now: () => "2026-08-02T12:00:00.000Z",
  });
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body, {
    ok: true,
    claimed: 1,
    sent: 1,
    failed: 0,
    skipped: 2,
    completed: 1,
    jobErrors: 0,
  });

  const page = admin.calls.find((call) => call.fn === "page_operator_message_recipients");
  assertEquals(page?.args, {
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_after_created_at: null,
    p_after_user_id: null,
    p_limit: 10,
  });
  assertEquals("p_message_id" in (page?.args ?? {}), false);

  assertEquals(mailer.messages.length, 1);
  // Send-critical data comes from the CAS claim, never the stale discovery page.
  assertEquals(mailer.messages[0].to, "fresh@example.com");
  assertEquals(mailer.messages[0].headers?.["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
  assert(mailer.messages[0].text.includes("token=33333333-3333-4333-8333-333333333333"));
  assertEquals(
    mailer.messages[0].idempotencyKey,
    "operator-message/44444444-4444-4444-8444-444444444444",
  );

  const statuses = admin.calls
    .filter((call) => call.fn === "record_operator_message_delivery_result")
    .map((call) => call.args.p_status);
  assertEquals(statuses, ["sent"]);
  const result = admin.calls.find((call) =>
    call.fn === "record_operator_message_delivery_result"
  );
  assertEquals(result?.args, {
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_user_id: "user-consented",
    p_attempt_token: "attempt-consented",
    p_status: "sent",
    p_provider: "test-provider",
    p_provider_id: "provider-1",
    p_failure_reason: null,
  });
  const renewals = admin.calls.filter((call) =>
    call.fn === "renew_operator_message_delivery_job_lease"
  );
  assertEquals(renewals.length, 4); // before page, each eligible claim, and advance
  assertEquals(renewals[1].args, {
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_lease_seconds: 180,
  });
  const claims = admin.calls.filter((call) =>
    call.fn === "claim_operator_message_recipient"
  );
  assertEquals(claims.map((call) => call.args.p_user_id), [
    "user-consented",
    "user-no-email",
  ]);
  const advance = admin.calls.find((call) => call.fn === "advance_operator_message_delivery_job");
  assertEquals(advance?.args, {
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_cursor_created_at: "2026-01-03T00:00:00Z",
    p_cursor_user_id: "user-no-email",
    p_done: true,
  });
  assertEquals(admin.upserts.length, 1);
});

Deno.test("service broadcast ignores marketing eligibility and carries no unsubscribe header", async () => {
  const admin = makeAdmin({
    jobs: [{ ...JOB, message_class: "service" }],
    recipients: [{
      user_id: "user-1",
      email: "user@example.com",
      created_at: "2026-01-01T00:00:00Z",
      email_eligible: true,
      unsubscribe_token: null,
    }],
  });
  const mailer = makeMailer();
  const response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => mailer.adapter,
  });
  assertEquals(response.status, 200);
  assertEquals(mailer.messages.length, 1);
  assertEquals(mailer.messages[0].headers, undefined);
});

Deno.test("an ineligible service row is a terminal replay and is neither sent nor rewritten", async () => {
  const admin = makeAdmin({
    jobs: [{ ...JOB, message_class: "service" }],
    recipients: [{
      user_id: "user-already-terminal",
      email: "user@example.com",
      created_at: "2026-01-01T00:00:00Z",
      email_eligible: false,
      unsubscribe_token: null,
    }],
  });
  const mailer = makeMailer();
  const response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => mailer.adapter,
  });
  assertEquals(response.status, 200);
  assertEquals(mailer.messages.length, 0);
  assertEquals(admin.calls.some((call) =>
    call.fn === "claim_operator_message_recipient"
  ), false);
  assertEquals(admin.calls.some((call) =>
    call.fn === "record_operator_message_delivery_result"
  ), false);
  assertEquals(admin.calls.some((call) =>
    call.fn === "advance_operator_message_delivery_job"
  ), true);
});

Deno.test("an eligible discovery row lost to another worker's recipient CAS is never sent", async () => {
  const admin = makeAdmin({
    jobs: [{ ...JOB, message_class: "service" }],
    recipients: [{
      user_id: "user-concurrent",
      email: "stale@example.com",
      created_at: "2026-01-01T00:00:00Z",
      email_eligible: true,
    }],
    claims: { "user-concurrent": { claimed: false } },
  });
  const mailer = makeMailer();
  const response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => mailer.adapter,
  });
  assertEquals(response.status, 200);
  assertEquals(mailer.messages.length, 0);
  assertEquals(admin.calls.some((call) =>
    call.fn === "claim_operator_message_recipient"
  ), true);
  assertEquals(admin.calls.some((call) =>
    call.fn === "record_operator_message_delivery_result"
  ), false);
  assertEquals(admin.calls.some((call) =>
    call.fn === "advance_operator_message_delivery_job"
  ), true);
});

Deno.test("lease expiry before recipient CAS fails closed without starting provider delivery", async () => {
  const admin = makeAdmin({
    jobs: [{ ...JOB, message_class: "service" }],
    recipients: [{
      user_id: "user-1",
      email: "user@example.com",
      created_at: "2026-01-01T00:00:00Z",
      email_eligible: true,
    }],
    // First heartbeat protects discovery; the pre-recipient heartbeat observes
    // expiry/reclaim and prevents both claim and send.
    renewErrorAt: 2,
  });
  const mailer = makeMailer();
  const response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => mailer.adapter,
  });
  assertEquals(response.status, 502);
  assertEquals(mailer.messages.length, 0);
  assertEquals(admin.calls.some((call) =>
    call.fn === "claim_operator_message_recipient"
  ), false);
  assertEquals(admin.calls.some((call) =>
    call.fn === "fail_operator_message_delivery_job"
  ), true);
});

Deno.test("an ambiguous provider-success orphan is terminal on reclaim and never resent", async () => {
  const mailer = makeMailer();
  const eligible = [{
    user_id: "user-1",
    email: "user@example.com",
    created_at: "2026-01-01T00:00:00Z",
    email_eligible: true,
  }];
  const firstWorker = makeAdmin({
    jobs: [{ ...JOB, message_class: "service" }],
    recipients: eligible,
    // Models provider acceptance followed by loss of receipt ownership before
    // the terminal write. fail_job/reclaim terminalizes it as outcome unknown.
    resultError: true,
  });
  let response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => firstWorker.client,
    mailAdapter: () => mailer.adapter,
  });
  assertEquals(response.status, 502);
  assertEquals(mailer.messages.length, 1);
  const terminalAttempts = firstWorker.calls.filter((call) =>
    call.fn === "record_operator_message_delivery_result"
  );
  assertEquals(terminalAttempts.length, 1);
  assertEquals(terminalAttempts[0].args.p_status, "sent");
  assertEquals(firstWorker.calls.some((call) =>
    call.fn === "fail_operator_message_delivery_job"
  ), true);

  const secondWorker = makeAdmin({
    jobs: [{ ...JOB, lease_token: "lease-2", message_class: "service" }],
    recipients: [{ ...eligible[0], email_eligible: false }],
  });
  response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => secondWorker.client,
    mailAdapter: () => mailer.adapter,
  });
  assertEquals(response.status, 200);
  assertEquals(mailer.messages.length, 1);
  assertEquals(secondWorker.calls.some((call) =>
    call.fn === "claim_operator_message_recipient"
  ), false);
});

Deno.test("provider details are redacted from receipts and a lost lease fails the job", async () => {
  let admin = makeAdmin({
    jobs: [{ ...JOB, message_class: "service" }],
    recipients: [{
      user_id: "user-1",
      email: "user@example.com",
      created_at: "2026-01-01T00:00:00Z",
      email_eligible: true,
    }],
  });
  let response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => makeMailer({ fail: true }).adapter,
  });
  assertEquals(response.status, 200);
  const failedReceipt = admin.calls.find((call) =>
    call.fn === "record_operator_message_delivery_result"
  );
  assertEquals(failedReceipt?.args.p_failure_reason, "provider_error");
  assertEquals(failedReceipt?.args.p_attempt_token, "attempt-user-1");

  admin = makeAdmin({ jobs: [JOB], pageError: true });
  response = await handleOperatorMessageWorker(request(), {
    envSecret: () => SECRET,
    adminClient: () => admin.client,
    mailAdapter: () => makeMailer().adapter,
  });
  assertEquals(response.status, 502);
  assertEquals(admin.calls.some((call) => call.fn === "fail_operator_message_delivery_job"), true);
  assertEquals(admin.calls.some((call) => call.fn === "advance_operator_message_delivery_job"), false);
});
