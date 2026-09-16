/**
 * Freshness walker for CONTRIBUTING.md (docs-knowledge-4).
 *
 * CONTRIBUTING is the documented second-contributor / AI-successor path. It taught
 * a constitution-free workflow: no mention of golden byte-identity, owner-gated
 * regens, the first-paint ratchet, or the any-cast ceiling — and its gate list
 * had drifted to a 5-step summary while `npm run check` runs 10. A well-meaning
 * contributor following it would regenerate goldens to green a red gate — the exact
 * constitutional violation. These pins derive the gate chain from package.json and
 * assert the constitution pointer exists, so the doc can only be wrong loudly.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(resolve(here, rel), 'utf8');
const contributing = read('../../CONTRIBUTING.md');

describe('CONTRIBUTING.md freshness (docs-knowledge-4)', () => {
  it("names every sub-step of package.json's check chain", () => {
    const pkg = JSON.parse(read('../../package.json'));
    const subSteps = [...pkg.scripts.check.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
    expect(subSteps.length, 'check chain should have sub-steps').toBeGreaterThan(4);
    const missing = subSteps.filter((s) => !contributing.includes(s));
    expect(
      missing,
      `CONTRIBUTING.md 'The gate' omits check sub-step(s): ${missing.join(', ')} — ` +
        `a contributor can't run a gate they can't see.`,
    ).toEqual([]);
  });

  it('teaches the engine constitution (golden byte-identity + owner-gated regen)', () => {
    // The load-bearing omission: the doc must route contributors to the
    // constitution and forbid silent golden regens, or the ratchet/byte-identity
    // laws are unreachable from the documented path.
    expect(contributing, 'CONTRIBUTING.md must link the playbook constitution (§0.2)').toMatch(
      /PHASE55_EXECUTION_PLAYBOOK\.md/,
    );
    expect(
      /golden/i.test(contributing) && /byte-identical/i.test(contributing),
      'CONTRIBUTING.md must mention golden byte-identity',
    ).toBe(true);
    expect(
      /verify:dist|first-paint ratchet/i.test(contributing),
      'CONTRIBUTING.md must mention the first-paint ratchet',
    ).toBe(true);
  });
});
