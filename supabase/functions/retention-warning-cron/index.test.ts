/**
 * index.test.ts — EXECUTION test of the retention-warning-cron trust boundary + sweep.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * The endpoint emails accounts, so it is triple-gated like pricing-resync-cron. This
 * RUNS the real handler with injected deps and asserts:
 *   - GET (any non-POST) → 405
 *   - env secret unset → 503 (fail closed)
 *   - wrong / missing x-cron-secret → 403 (constant-time compare)
 *   - config enabled:false → 200 { skipped: 'disabled' }
 *   - config read error → 503 { skipped: 'config_unavailable' } (fail closed)
 *   - happy path → sweeps both asset tables, groups by (owner, expiry), claims the
 *     dedup slot, resolves the email, sends once, and reports the summary; a second
 *     run over an already-claimed slot SKIPS (at-most-once)
 *   - send failure → counted as failed and the dedup claim is RELEASED (retry)
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.env.set("SUPABASE_URL", "https://stub.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "service_role_dummy");

const { handleRetentionWarningCron } = await import("./index.ts");

const SECRET = "correct-horse-battery-staple";

interface AssetRow { user_id: string; retention_expires_at: string }

/**
 * Recording admin-client stub. Routes the exact call chains the handler uses:
 * system_config read/upsert, the two asset-table sweeps, the dedup ledger
 * claim/release, and write_audit. `preClaimed` seeds already-warned slots.
 */
function makeAdminClient(opts: {
  cfg?: Record<string, unknown> | null;
  cfgError?: boolean;
  assets?: Partial<Record<"settlements" | "saved_maps", AssetRow[]>>;
  preClaimed?: string[]; // "account|YYYY-MM-DD"
} = {}) {
  const upserts: Array<{ table: string; rows: Array<Record<string, unknown>> }> = [];
  const audits: Array<unknown> = [];
  const deletes: Array<{ account: string; date: string }> = [];
  const claimed = new Set<string>(opts.preClaimed ?? []);

  const thenable = (result: unknown) => {
    const b: Record<string, unknown> = {};
    for (const m of ["select", "eq", "not", "gt", "lte"]) b[m] = () => b;
    // deno-lint-ignore no-explicit-any
    (b as any).then = (res: (v: unknown) => void, rej?: (e: unknown) => void) =>
      Promise.resolve(result).then(res, rej);
    return b;
  };

  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => {
      if (table === "system_config") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                opts.cfgError
                  ? Promise.resolve({ data: null, error: { message: "boom" } })
                  : Promise.resolve({ data: { value: opts.cfg }, error: null }),
            }),
          }),
          upsert: (rows: Array<Record<string, unknown>>) => {
            upserts.push({ table, rows });
            return Promise.resolve({ error: null });
          },
        };
      }
      if (table === "settlements" || table === "saved_maps") {
        return thenable({ data: opts.assets?.[table] ?? [], error: null });
      }
      if (table === "retention_warning_dispatch") {
        return {
          upsert: (rows: Array<{ account_id: string; warn_for_date: string }>) => ({
            select: () => {
              const fresh: Array<Record<string, unknown>> = [];
              for (const r of rows) {
                const k = `${r.account_id}|${r.warn_for_date}`;
                if (!claimed.has(k)) { claimed.add(k); fresh.push(r); }
              }
              return Promise.resolve({ data: fresh, error: null });
            },
          }),
          delete: () => ({
            eq: (_c1: string, account: string) => ({
              eq: (_c2: string, date: string) => {
                deletes.push({ account, date });
                claimed.delete(`${account}|${date}`);
                return Promise.resolve({ error: null });
              },
            }),
          }),
        };
      }
      throw new Error(`unexpected table ${table}`);
    },
    rpc: (fn: string, args: unknown) => {
      if (fn === "write_audit") audits.push(args);
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { client, upserts, audits, deletes, claimed };
}

const NOW = () => "2026-07-01T00:00:00.000Z";
const enabledCfg = { enabled: true, url: "u", secret: "s", warnWindowDays: 14 };

function req(method = "POST", secret: string | null = SECRET) {
  const headers = new Headers();
  if (secret !== null) headers.set("x-cron-secret", secret);
  return new Request("https://x/retention-warning-cron", { method, headers });
}

Deno.test("non-POST → 405", async () => {
  const res = await handleRetentionWarningCron(req("GET"), { envSecret: () => SECRET });
  assertEquals(res.status, 405);
});

Deno.test("env secret unset → 503 (fail closed)", async () => {
  const res = await handleRetentionWarningCron(req(), { envSecret: () => undefined });
  assertEquals(res.status, 503);
});

Deno.test("wrong x-cron-secret → 403", async () => {
  const res = await handleRetentionWarningCron(req("POST", "nope"), { envSecret: () => SECRET });
  assertEquals(res.status, 403);
});

Deno.test("config enabled:false → skipped:disabled", async () => {
  const { client } = makeAdminClient({ cfg: { enabled: false, url: "u", secret: "s" } });
  const res = await handleRetentionWarningCron(req(), { envSecret: () => SECRET, adminClient: () => client });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).skipped, "disabled");
});

Deno.test("config read error → 503 config_unavailable (fail closed)", async () => {
  const { client } = makeAdminClient({ cfgError: true });
  const res = await handleRetentionWarningCron(req(), { envSecret: () => SECRET, adminClient: () => client });
  assertEquals(res.status, 503);
  assertEquals((await res.json()).skipped, "config_unavailable");
});

Deno.test("happy path — sweeps, groups, claims, sends once", async () => {
  // Two rows for the same owner+expiry (one settlement, one map) → ONE warning.
  const { client, audits, upserts } = makeAdminClient({
    cfg: enabledCfg,
    assets: {
      settlements: [{ user_id: "u1", retention_expires_at: "2026-07-10T00:00:00Z" }],
      saved_maps: [{ user_id: "u1", retention_expires_at: "2026-07-10T12:00:00Z" }],
    },
  });
  const sends: Array<{ to: string; payload: Record<string, unknown> }> = [];
  const res = await handleRetentionWarningCron(req(), {
    envSecret: () => SECRET,
    adminClient: () => client,
    now: NOW,
    resolveEmail: () => Promise.resolve("dm@example.com"),
    sendWarning: (to, payload) => { sends.push({ to, payload }); return Promise.resolve({ ok: true }); },
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.candidates, 1); // grouped to one (owner, expiry-date)
  assertEquals(body.claimed, 1);
  assertEquals(body.sent, 1);
  assertEquals(sends.length, 1);
  assertEquals(sends[0].to, "dm@example.com");
  assertEquals(sends[0].payload.count, 2); // both assets counted
  // an audit row + a last-run summary were written
  assertEquals(audits.length, 1);
  assertEquals(upserts.some((u) => u.rows[0].key === "retention_warning_last_run"), true);
});

Deno.test("already-warned slot is SKIPPED (at-most-once)", async () => {
  const { client } = makeAdminClient({
    cfg: enabledCfg,
    assets: { settlements: [{ user_id: "u1", retention_expires_at: "2026-07-10T00:00:00Z" }] },
    preClaimed: ["u1|2026-07-10"],
  });
  let sent = 0;
  const res = await handleRetentionWarningCron(req(), {
    envSecret: () => SECRET,
    adminClient: () => client,
    now: NOW,
    resolveEmail: () => Promise.resolve("dm@example.com"),
    sendWarning: () => { sent += 1; return Promise.resolve({ ok: true }); },
  });
  const body = await res.json();
  assertEquals(body.skipped, 1);
  assertEquals(body.sent, 0);
  assertEquals(sent, 0);
});

Deno.test("send failure releases the claim (retry next night)", async () => {
  const { client, deletes } = makeAdminClient({
    cfg: enabledCfg,
    assets: { settlements: [{ user_id: "u2", retention_expires_at: "2026-07-11T00:00:00Z" }] },
  });
  const res = await handleRetentionWarningCron(req(), {
    envSecret: () => SECRET,
    adminClient: () => client,
    now: NOW,
    resolveEmail: () => Promise.resolve("dm@example.com"),
    sendWarning: () => Promise.resolve({ ok: false, reason: "unknown_template" }),
  });
  const body = await res.json();
  assertEquals(body.failed, 1);
  assertEquals(body.sent, 0);
  assertEquals(deletes.length, 1); // the claim was released
  assertEquals(deletes[0].account, "u2");
});
