/**
 * accountActionsSupportWrite.test.js — the support-ticket write path's ceilings.
 *
 * create_ticket / reply_ticket were the last authed WRITE surface with neither a
 * request-size cap nor a rate limit: `await req.json()` destructured an uncapped
 * body, the 055 RPC only btrims, no support column carries a char_length check, and
 * `rg ingest_check_rate` over this function returned exactly one hit — the dossier
 * claim. create_ticket also fires a Resend email, so an unmetered caller bought a
 * row AND a third-party send per request.
 *
 * account-actions/index.ts imports deno.land/esm.sh and cannot be executed here (its
 * behavioural pins are the Deno suite next to it), so these are ORDERING contracts:
 * each ceiling must sit BEFORE the thing it protects. A refactor that keeps the cap
 * but moves it after the limiter, or the limiter after the write, reds here.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const SRC = readFileSync(
  join(resolve(process.cwd()), 'supabase/functions/account-actions/index.ts'),
  'utf8',
);

/** First index of a needle, asserted to exist so an ordering test is never vacuous. */
const at = (needle) => {
  const i = SRC.indexOf(needle);
  expect(i, `account-actions/index.ts no longer contains ${JSON.stringify(needle)}`).toBeGreaterThan(-1);
  return i;
};
/**
 * A ceiling's declared value, read from source. The shape assertion is part of the
 * contract: these are fixed literals, never env-overridable, so a deploy cannot
 * quietly widen or close the caps.
 */
const constant = (name) => {
  const m = SRC.match(new RegExp(`const ${name} = ([^;]+);`));
  expect(m, `${name} is not declared`).toBeTruthy();
  const expr = m[1].replace(/_/g, '').trim();
  expect(expr, `${name} must stay a plain numeric literal`).toMatch(/^\d+(\s*\*\s*\d+)*$/);
  return expr.split('*').reduce((product, part) => product * Number(part.trim()), 1);
};

describe('account-actions — the request envelope is capped in BYTES', () => {
  it('measures encoded bytes, not UTF-16 code units, and answers 413', () => {
    expect(SRC).toContain('const MAX_BODY_BYTES');
    expect(SRC).toMatch(/new TextEncoder\(\)\.encode\(rawBody\)\.length > MAX_BODY_BYTES/);
    expect(SRC).toMatch(/MAX_BODY_BYTES[\s\S]{0,200}413\)/);
    // the byte cap is the whole point — a `rawBody.length` cap would let ~3x through
    expect(SRC).not.toMatch(/rawBody\.length > MAX_BODY_BYTES/);
  });

  it('the cap runs before the account gate, the limiter and every ticket write', () => {
    const cap = at('new TextEncoder().encode(rawBody).length');
    expect(cap).toBeLessThan(at('rpc("account_is_active"'));
    expect(cap).toBeLessThan(at('rpc("ingest_check_rate"'));
    expect(cap).toBeLessThan(at('rpc("create_ticket"'));
    expect(cap).toBeLessThan(at('rpc("post_ticket_reply"'));
  });

  it('an unparseable body is a client fault (400), not a swallowed 500', () => {
    expect(SRC).toMatch(/payload = rawBody \? JSON\.parse\(rawBody\) : \{\};[\s\S]{0,120}400\)/);
  });
});

describe('account-actions — support writes are rate limited, fail CLOSED', () => {
  it('ONE limiter covers both write actions, inside the shared gate block', () => {
    const gate = at('const TICKET_WRITE_ACTIONS');
    const limiter = at('rpc("ingest_check_rate"');
    const dispatch = at('switch (action)');
    expect(limiter).toBeGreaterThan(gate);
    expect(limiter).toBeLessThan(dispatch); // metered before either case is reachable
    // exactly one keyed-limiter call site per action family: the support bucket and
    // the pre-existing dossier claim, and no third un-namespaced one
    expect(SRC.match(/rpc\("ingest_check_rate"/g)).toHaveLength(2);
  });

  it('the bucket key is function-namespaced, never a bare ingest-events key', () => {
    expect(SRC).toMatch(/p_key: `support_write:\$\{callingUser\.id\}`/);
    expect(SRC).toMatch(/p_max: SUPPORT_WRITE_MAX_PER_HOUR/);
    expect(SRC).toMatch(/p_window_seconds: 3600/);
    // `u:`/`d:`/`ip:` are ingest-events' bare keys — reusing one would cross-meter
    for (const bare of ['p_key: `u:', 'p_key: `d:', 'p_key: `ip:']) {
      expect(SRC).not.toContain(bare);
    }
  });

  it('a limiter error is 429, never a silent pass', () => {
    const block = SRC.slice(at('rpc("ingest_check_rate"'), at('switch (action)'));
    expect(block).toMatch(/if \(rateErr \|\| underRate === false\)/);
    expect(block).toMatch(/429\)/);
    expect(block, 'a limiter error must not be treated as under-rate').not.toMatch(/if \(!rateErr && underRate/);
  });
});

describe('account-actions — free-text fields are capped before they are written', () => {
  it('create_ticket caps the TRIMMED subject and message ahead of the RPC', () => {
    const rpc = at('rpc("create_ticket"');
    expect(at('subject.trim().length > MAX_SUBJECT_CHARS')).toBeLessThan(rpc);
    expect(at('message.trim().length > MAX_MESSAGE_CHARS')).toBeLessThan(rpc);
  });

  it('reply_ticket caps the TRIMMED body ahead of the RPC', () => {
    expect(at('body.trim().length > MAX_MESSAGE_CHARS')).toBeLessThan(at('rpc("post_ticket_reply"'));
  });

  it('the ceilings are generous enough that no genuine support message is refused', () => {
    // Guard-the-guard in the other direction: these caps exist to bound abuse, and a
    // later "hardening" that shrinks them into a UX defect should red here.
    expect(constant('MAX_BODY_BYTES')).toBeGreaterThanOrEqual(16 * 1024);
    expect(constant('MAX_SUBJECT_CHARS')).toBeGreaterThanOrEqual(120);
    expect(constant('MAX_MESSAGE_CHARS')).toBeGreaterThanOrEqual(2000);
    expect(constant('SUPPORT_WRITE_MAX_PER_HOUR')).toBeGreaterThanOrEqual(10);
    // and the field cap must fit inside the envelope, or it could never be reached
    expect(constant('MAX_MESSAGE_CHARS')).toBeLessThan(constant('MAX_BODY_BYTES'));
  });
});
