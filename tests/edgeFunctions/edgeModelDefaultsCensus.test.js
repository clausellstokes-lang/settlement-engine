/**
 * edgeModelDefaultsCensus.test.js — THE MODEL-DEFAULT DRIFT WALL (bar-7 AI-cost, C4).
 *
 * Model ids are duplicated across ~15 env-overridable edge constants of the shape
 *   Deno.env.get('ANTHROPIC_CLAUDE_<FAMILY>_<VER>_MODEL') || '<default id>'
 * with nothing binding a constant's NAME to its DEFAULT. A copy-paste that pairs the
 * SONNET env name with an 'claude-opus-…' default (or vice-versa) silently misroutes
 * the tier — a costlier model resolves while the ledger's hardcoded price + the cost
 * estimate keep assuming the cheaper class. aiTaskConfig.test.js pins only the CLIENT
 * routing table; the edge defaults had no census at all.
 *
 * THE WALL: enumerate every ANTHROPIC_CLAUDE_<FAMILY>_…_MODEL default across the edge
 * tree and require the default id's family to MATCH the env-var name's family
 * (SONNET name ⇒ 'claude-sonnet-…' default). Catches source-level tier drift.
 *
 * SCOPE (honest): this binds the SOURCE DEFAULTS. A runtime env override to a wrong
 * snapshot, and logging the provider-RESOLVED data.model rather than the requested
 * alias, are a deeper operational concern (flagged in the C4 report) — a source census
 * cannot observe a deploy-time env value.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');

function walkTs(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkTs(p, out);
    else if (/\.ts$/.test(e) && !/\.test\.ts$/.test(e)) out.push(p);
  }
  return out;
}

const KNOWN_FAMILIES = new Set(['opus', 'sonnet', 'haiku']);

// Match: Deno.env.get('ANTHROPIC_CLAUDE_<FAMILY>_<ver>_MODEL') || '<default>'
const RE = /ANTHROPIC_CLAUDE_([A-Z]+)_[0-9A-Z_]*MODEL'\)\s*\|\|\s*'([^']+)'/g;

function collectDefaults() {
  const found = [];
  for (const file of walkTs(FN_DIR)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(RE)) {
      found.push({ file: file.replace(FN_DIR + '/', ''), family: m[1].toLowerCase(), def: m[2] });
    }
  }
  return found;
}

const DEFAULTS = collectDefaults();

describe('edge model-default census — env-var family must match its default id', () => {
  it('the scan found the model constants (guard-the-guard: not a vacuous pass)', () => {
    // ~15 constants today across ai-analyst/construct-*/generate-narrative/etc.
    expect(DEFAULTS.length).toBeGreaterThanOrEqual(10);
  });

  it.each(DEFAULTS.map((d) => [`${d.file} :: ${d.family}`, d]))(
    '%s — default resolves to its own family',
    (_label, d) => {
      expect(KNOWN_FAMILIES.has(d.family), `${d.file}: unknown model family '${d.family}'`).toBe(true);
      expect(
        d.def.startsWith(`claude-${d.family}`),
        `${d.file}: ANTHROPIC_CLAUDE_${d.family.toUpperCase()}_*_MODEL defaults to '${d.def}', which is `
        + `NOT a claude-${d.family} id — the env name and its default disagree (tier misroute).`,
      ).toBe(true);
    },
  );

  it('the family/default matcher rejects a mismatch (self-check)', () => {
    const sample = "const M = Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_5_MODEL') || 'claude-opus-4-8';";
    RE.lastIndex = 0;
    const m = [...sample.matchAll(RE)][0];
    expect(m[1].toLowerCase()).toBe('sonnet');
    expect(m[2]).toBe('claude-opus-4-8');
    expect(m[2].startsWith('claude-sonnet')).toBe(false); // the wall would red this
  });
});
