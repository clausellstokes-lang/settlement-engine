import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { installScopedTestEnv } from "../_shared/scopedTestEnv.ts";

const scopedEnv = installScopedTestEnv({
  SUPABASE_URL: "https://stub.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-stub",
});

const { handleUnsubscribe } = await import("./index.ts");
// The import above has read the stubs at module scope; hand the ambient environment
// back so nothing this suite supplied is visible while any OTHER suite runs.
scopedEnv.release();
const TOKEN = "11111111-1111-4111-8111-111111111111";

function request(method: string, suffix = `?token=${TOKEN}&category=product_updates`) {
  return new Request(`https://edge/unsubscribe${suffix}`, { method });
}

function client(result = true, error: { message: string } | null = null) {
  const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  return {
    calls,
    // deno-lint-ignore no-explicit-any
    value: { rpc: (fn: string, args: Record<string, unknown>): any => {
      calls.push({ fn, args });
      return Promise.resolve({ data: result, error });
    } },
  };
}

scopedEnv.test("GET renders confirmation and never mutates", async () => {
  const stub = client();
  const response = await handleUnsubscribe(request("GET"), { client: () => stub.value as never });
  assertEquals(response.status, 200);
  assertEquals((await response.text()).includes("Confirm"), true);
  assertEquals(stub.calls.length, 0);
});

scopedEnv.test("POST invokes the opt-out-only token RPC with fixed arguments", async () => {
  const stub = client();
  const response = await handleUnsubscribe(request("POST"), { client: () => stub.value as never });
  assertEquals(response.status, 200);
  assertEquals(stub.calls, [{
    fn: "unsubscribe_via_token",
    args: { p_token: TOKEN, p_category: "product_updates" },
  }]);
});

scopedEnv.test("bad token/category and non-POST mutation attempts fail before RPC", async () => {
  const stub = client();
  let response = await handleUnsubscribe(request("POST", "?token=nope&category=product_updates"), { client: () => stub.value as never });
  assertEquals(response.status, 400);
  response = await handleUnsubscribe(request("POST", `?token=${TOKEN}&category=spam`), { client: () => stub.value as never });
  assertEquals(response.status, 400);
  response = await handleUnsubscribe(request("DELETE"), { client: () => stub.value as never });
  assertEquals(response.status, 405);
  assertEquals(stub.calls.length, 0);
});

scopedEnv.test("unknown bearer is not reported as success; RPC outage is retryable", async () => {
  let stub = client(false);
  let response = await handleUnsubscribe(request("POST"), { client: () => stub.value as never });
  assertEquals(response.status, 404);

  stub = client(false, { message: "db unavailable" });
  response = await handleUnsubscribe(request("POST"), { client: () => stub.value as never });
  assertEquals(response.status, 503);
});
