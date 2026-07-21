/**
 * aiMeteringCensus.test.js — THE COGS METERING CENSUS (bar-7 AI-cost, C4).
 *
 * A structural-prevention manifest, the metering twin of sessionGateCensus. Every
 * credit-spending AI edge surface MUST write an ai_usage_events row (the per-call
 * COGS ledger the economics readouts + the global spend cap sum over). Metering was
 * present-in-fact on all surfaces but structurally UN-enforced: a 12th AI function
 * could ship with a spend_credits call and NO ai_usage_events insert, burning spend
 * with zero COGS rows and escaping every economics sum — with a green suite.
 *
 * THE WALL (derived, not hardcoded, so it cannot silently go N-1): the spending set
 * is DISCOVERED from source — every function whose index.ts calls
 * `rpc('spend_credits', …)`. Each such surface must also insert into ai_usage_events.
 * Add a new credit-spending function without the meter and THIS test reds loudly.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');
const read = (name) => {
  const p = join(FN_DIR, name, 'index.ts');
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
};

const functionDirs = readdirSync(FN_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_shared')
  .map((d) => d.name)
  .sort();

const spendsCredits = (src) => /rpc\(\s*['"]spend_credits['"]/.test(src);
const metersUsage = (src) => /from\(\s*['"]ai_usage_events['"]\s*\)\s*\.insert\(/.test(src);

// The credit-spending surfaces, DISCOVERED from source (never a hand-list that can
// drift). These are the paid AI surfaces whose spend the COGS ledger must capture.
const SPENDING = functionDirs.filter((name) => spendsCredits(read(name)));

describe('AI metering census — every credit-spending surface writes ai_usage_events', () => {
  it('the discovered spending set is non-empty (the scan actually found the surfaces)', () => {
    // Guard-the-guard: if this ever hits 0, the spend_credits detector broke and the
    // census below would vacuously pass. Today the set is the 11 paid AI surfaces.
    expect(SPENDING.length).toBeGreaterThanOrEqual(11);
  });

  it.each(SPENDING)('%s meters its spend into ai_usage_events (COGS row per call)', (name) => {
    const src = read(name);
    expect(spendsCredits(src), `${name} spends credits`).toBe(true);
    expect(
      metersUsage(src),
      `${name} spends credits but writes NO ai_usage_events row — its COGS escape the `
      + `economics readouts and the global spend-cap sums. Add the best-effort meter() insert.`,
    ).toBe(true);
  });

  it('the metering detector rejects a non-metering surface (self-check)', () => {
    // Prove the regex means "clean", not "scanner broke": a source with a spend but no
    // insert must fail metersUsage; the real insert shape must pass.
    expect(metersUsage("supabaseUser.rpc('spend_credits', { feature: 'x' })")).toBe(false);
    expect(metersUsage("await supabaseAdmin.from('ai_usage_events').insert({ user_id })")).toBe(true);
  });
});
