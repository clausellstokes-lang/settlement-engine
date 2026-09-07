/**
 * twoKey.test.ts — unit tests for the pure two-key guard core (Deno test, runs
 * under the `deno-tests` CI job / `deno task test:edge`, alongside the other
 * _shared/*.test.ts). Mirrors sessionGate.test.ts's shape.
 *
 * The guard is the cryptographic teeth of the account-level destructive-action
 * rule: retype-the-target-id AND a fresh GoTrue password amr. These pin every
 * reject/accept branch of the pure core so a refactor cannot quietly weaken it.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  BROADCAST_ACTION_SET,
  BROADCAST_CONFIRMATION_PHRASE,
  checkBroadcastTwoKey,
  checkTwoKey,
  decodeJwtAmr,
  FRESHNESS_WINDOW_S,
  isProtectedAction,
  isBroadcastAction,
  latestPasswordAmrTs,
  PROTECTED_ACTION_SET,
} from "./twoKey.ts";

const NOW = 1_800_000_000; // fixed "now" in unix seconds
// A UUID WITH hex letters so .toUpperCase() actually differs (the no-case-fold pin).
const TARGET = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

/** Build an amr array whose password entry is `ageS` seconds old (relative to NOW). */
function amrAged(ageS: number, method = "password") {
  return [{ method, timestamp: NOW - ageS }];
}

Deno.test("fresh password amr + matching typed id → PASS", () => {
  const r = checkTwoKey({
    action: "set_account_banned",
    targetUserId: TARGET,
    typedTargetId: TARGET,
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(r.ok, true);
  assertEquals(r.reason, "ok");
  assertEquals(r.amrAgeS, 10);
});

Deno.test("broadcast two-key accepts only exact SEND TO ALL plus fresh password", () => {
  const pass = checkBroadcastTwoKey({
    action: "queue_operator_broadcast",
    typedBroadcastPhrase: BROADCAST_CONFIRMATION_PHRASE,
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(pass.ok, true);
  assertEquals(pass.amrAgeS, 10);

  const wrongCase = checkBroadcastTwoKey({
    action: "queue_operator_broadcast",
    typedBroadcastPhrase: "send to all",
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(wrongCase.reason, "typed_phrase_mismatch");

  const missing = checkBroadcastTwoKey({
    action: "queue_operator_broadcast",
    typedBroadcastPhrase: null,
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(missing.reason, "missing_typed_phrase");
});

Deno.test("broadcast two-key trims paste whitespace but rejects stale/no password AMR", () => {
  const trimmed = checkBroadcastTwoKey({
    action: "queue_operator_broadcast",
    typedBroadcastPhrase: `  ${BROADCAST_CONFIRMATION_PHRASE}\n`,
    amr: amrAged(0),
    nowS: NOW,
  });
  assertEquals(trimmed.ok, true);

  const stale = checkBroadcastTwoKey({
    action: "queue_operator_broadcast",
    typedBroadcastPhrase: BROADCAST_CONFIRMATION_PHRASE,
    amr: amrAged(FRESHNESS_WINDOW_S + 1),
    nowS: NOW,
  });
  assertEquals(stale.reason, "amr_stale");

  const none = checkBroadcastTwoKey({
    action: "queue_operator_broadcast",
    typedBroadcastPhrase: BROADCAST_CONFIRMATION_PHRASE,
    amr: null,
    nowS: NOW,
  });
  assertEquals(none.reason, "no_password_amr");
});

Deno.test("typed id MISMATCH → reject (no case-folding, exact compare)", () => {
  const r = checkTwoKey({
    action: "set_account_banned",
    targetUserId: TARGET,
    typedTargetId: TARGET.toUpperCase(),
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(r.ok, false);
  assertEquals(r.reason, "typed_id_mismatch");
});

Deno.test("typed id matches after TRIM (paste with whitespace is fine)", () => {
  const r = checkTwoKey({
    action: "grant_credits",
    targetUserId: TARGET,
    typedTargetId: `  ${TARGET}\n`,
    amr: amrAged(0),
    nowS: NOW,
  });
  assertEquals(r.ok, true);
});

Deno.test("missing confirm.typedTargetId → reject", () => {
  const r = checkTwoKey({
    action: "set_account_disabled",
    targetUserId: TARGET,
    typedTargetId: undefined,
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(r.ok, false);
  assertEquals(r.reason, "missing_typed_id");
});

Deno.test("missing target user id → reject (fail closed)", () => {
  const r = checkTwoKey({
    action: "set_account_banned",
    targetUserId: null,
    typedTargetId: TARGET,
    amr: amrAged(10),
    nowS: NOW,
  });
  assertEquals(r.ok, false);
  assertEquals(r.reason, "missing_target");
});

Deno.test("amr exactly at the window edge (300s) → PASS; one second past (301s) → reject", () => {
  const edge = checkTwoKey({
    action: "set_account_banned",
    targetUserId: TARGET,
    typedTargetId: TARGET,
    amr: amrAged(FRESHNESS_WINDOW_S),
    nowS: NOW,
  });
  assertEquals(edge.ok, true);

  const stale = checkTwoKey({
    action: "set_account_banned",
    targetUserId: TARGET,
    typedTargetId: TARGET,
    amr: amrAged(FRESHNESS_WINDOW_S + 1),
    nowS: NOW,
  });
  assertEquals(stale.ok, false);
  assertEquals(stale.reason, "amr_stale");
  assertEquals(stale.amrAgeS, FRESHNESS_WINDOW_S + 1);
});

Deno.test("refresh-preserved OLD password timestamp → reject (the anti-replay teeth)", () => {
  // A token refreshed an hour after login keeps the ORIGINAL password amr ts.
  const r = checkTwoKey({
    action: "update_user_credits",
    targetUserId: TARGET,
    typedTargetId: TARGET,
    amr: amrAged(3600),
    nowS: NOW,
  });
  assertEquals(r.ok, false);
  assertEquals(r.reason, "amr_stale");
});

Deno.test("amr ABSENT / no password entry → reject (fail closed)", () => {
  const none = checkTwoKey({
    action: "set_account_banned",
    targetUserId: TARGET,
    typedTargetId: TARGET,
    amr: null,
    nowS: NOW,
  });
  assertEquals(none.ok, false);
  assertEquals(none.reason, "no_password_amr");

  // An amr that only carries a non-password method (e.g. oauth) also fails.
  const oauthOnly = checkTwoKey({
    action: "set_account_banned",
    targetUserId: TARGET,
    typedTargetId: TARGET,
    amr: amrAged(5, "oauth"),
    nowS: NOW,
  });
  assertEquals(oauthOnly.ok, false);
  assertEquals(oauthOnly.reason, "no_password_amr");
});

Deno.test("latestPasswordAmrTs picks the FRESHEST password entry", () => {
  const amr = [
    { method: "password", timestamp: NOW - 1000 },
    { method: "oauth", timestamp: NOW - 5 },
    { method: "password", timestamp: NOW - 20 },
  ];
  assertEquals(latestPasswordAmrTs(amr), NOW - 20);
  assertEquals(latestPasswordAmrTs("not-an-array"), null);
  assertEquals(latestPasswordAmrTs([]), null);
});

Deno.test("decodeJwtAmr reads the amr claim from a base64url JWT payload", () => {
  const payload = { sub: TARGET, amr: [{ method: "password", timestamp: NOW }] };
  const b64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const token = `header.${b64}.sig`;
  const amr = decodeJwtAmr(token);
  assertEquals(Array.isArray(amr), true);
  assertEquals(amr?.[0].method, "password");
  assertEquals(amr?.[0].timestamp, NOW);

  assertEquals(decodeJwtAmr("garbage"), null);
  assertEquals(decodeJwtAmr(null), null);
});

Deno.test("PROTECTED_ACTION_SET membership: the seven account-destructive actions", () => {
  for (
    const a of [
      "update_user_metadata",
      "update_user_credits",
      "grant_credits",
      "set_account_disabled",
      "set_account_banned",
      "grant_surveyor",
      "revoke_surveyor",
    ]
  ) {
    assertEquals(isProtectedAction(a), true);
  }
  assertEquals(PROTECTED_ACTION_SET.size, 7);
  // Moderation + read actions are NOT two-key protected.
  assertEquals(isProtectedAction("soft_delete_settlement"), false);
  assertEquals(isProtectedAction("list_users"), false);
  assertEquals(isProtectedAction("issue_warning"), false);
  assertEquals(isProtectedAction(undefined), false);
});

Deno.test("BROADCAST_ACTION_SET contains only queue_operator_broadcast", () => {
  assertEquals(BROADCAST_ACTION_SET.size, 1);
  assertEquals(isBroadcastAction("queue_operator_broadcast"), true);
  assertEquals(isBroadcastAction("cancel_operator_broadcast"), false);
  assertEquals(isBroadcastAction(undefined), false);
});
