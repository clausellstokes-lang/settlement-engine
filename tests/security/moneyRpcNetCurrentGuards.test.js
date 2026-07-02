/**
 * moneyRpcNetCurrentGuards.test.js — fork-discipline guard for the money RPCs.
 *
 * spend_credits and refund_credits are each recreated across several migrations
 * (the documented "net-current rule": every fork must copy the highest-numbered
 * body verbatim). Correctness has rested ONLY on header prose — nothing failed
 * the gate if a future migration forked from a stale ancestor and silently dropped
 * a guard (the account_is_active gate, the FOR UPDATE serialization, the
 * service-role refund awareness). This test removes that gap: it finds the
 * LEXICALLY-HIGHEST migration that defines each function (= the live body after a
 * lexical-order apply) and asserts the load-bearing guards are present in it.
 *
 * It is intentionally version-agnostic: a legitimate future recreate (095, 096…)
 * just becomes the new net-current and passes AS LONG AS it keeps the guards. A
 * fork that drops one fails here instead of in production.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const migrationFiles = readdirSync(MIG_DIR)
  .filter((f) => /^\d{3}_.*\.sql$/.test(f))
  .sort();

/** The lexically-highest migration file that defines `public.<name>`, or null. */
function netCurrentFileFor(name) {
  const re = new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b`, 'i');
  let found = null;
  for (const f of migrationFiles) {
    if (re.test(readFileSync(join(MIG_DIR, f), 'utf-8'))) found = f; // keep the highest
  }
  return found;
}

/** Extract a single function's body (dollar-quote aware: handles $$ and $body$). */
function extractFunction(src, name) {
  const startM = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b`, 'i'));
  if (!startM) return null;
  const from = startM.index;
  const tagM = src.slice(from).match(/as\s+(\$[a-z_]*\$)/i);
  if (!tagM) return null;
  const tag = tagM[1];
  const bodyStart = from + tagM.index + tagM[0].length;
  const endIdx = src.indexOf(tag, bodyStart);
  if (endIdx === -1) return null;
  return src.slice(from, endIdx + tag.length).toLowerCase();
}

describe('money RPC net-current fork discipline', () => {
  it('a spend_credits and a refund_credits definition exist on disk', () => {
    expect(netCurrentFileFor('spend_credits'), 'no migration defines spend_credits').not.toBeNull();
    expect(netCurrentFileFor('refund_credits'), 'no migration defines refund_credits').not.toBeNull();
  });

  it('net-current spend_credits keeps the account-status gate AND the per-user FOR UPDATE serialization', () => {
    const file = netCurrentFileFor('spend_credits');
    const body = extractFunction(readFileSync(join(MIG_DIR, file), 'utf-8'), 'spend_credits');
    expect(body, `could not extract spend_credits body from ${file}`).toBeTruthy();
    // Dropping either of these reintroduces a real money bug (spend while banned /
    // concurrent double-spend). If a future fork loses one, this fails naming the file.
    expect(body, `${file}: spend_credits lost the account_is_active gate`).toContain('account_is_active');
    expect(body, `${file}: spend_credits lost the FOR UPDATE balance serialization`).toMatch(/for\s+update/);
  });

  it('net-current refund_credits keeps the service-role awareness AND the FOR UPDATE serialization', () => {
    const file = netCurrentFileFor('refund_credits');
    const body = extractFunction(readFileSync(join(MIG_DIR, file), 'utf-8'), 'refund_credits');
    expect(body, `could not extract refund_credits body from ${file}`).toBeTruthy();
    // 085 made the auth gate service-role-aware (the edge refunds via service_role);
    // 087 added FOR UPDATE on the spend row. A fork from 009/033 silently drops both
    // and charges-without-refunding again.
    expect(body, `${file}: refund_credits lost service-role awareness (085 regression)`).toContain('service_role');
    expect(body, `${file}: refund_credits lost the FOR UPDATE serialization (087 regression)`).toMatch(/for\s+update/);
  });
});
