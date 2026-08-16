/**
 * Lightweight freshness guard for ARCHITECTURE.md.
 *
 * The doc is the cheapest onboarding artifact in the repo, so it's also the
 * easiest to let rot. This doesn't try to verify every claim — it pins a couple
 * of facts that have already drifted (or easily could), so the same drift can't
 * silently come back.
 *
 * @enforcement-walker Open filesystem populations are compared with documented
 * claims. If one of those claims drifts, its debt belongs here, not in the
 * per-test failure census where further drift would become invisible.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(resolve(here, rel), 'utf8');
const archMd = read('../../ARCHITECTURE.md');

describe('ARCHITECTURE.md freshness', () => {
  it('does not reference nav constants that no longer exist in App.jsx', () => {
    // NAV_BASE / NAV_WITH_WORKSHOP were collapsed into a single NAV array when
    // Workshop became the Create "Custom Generate" mode. If the doc mentions
    // them again, it has drifted from App.jsx.
    expect(archMd).not.toMatch(/NAV_BASE|NAV_WITH_WORKSHOP/);
  });

  it('states the same store-slice count that store/index.js composes', () => {
    const storeIdx = read('../../src/store/index.js');
    const sliceCount = [...storeIdx.matchAll(/\.\.\.create\w+Slice\(/g)].length;
    const claim = archMd.match(/(\d+)\s+slices/);
    expect(claim, 'ARCHITECTURE.md should state the store-slice count').toBeTruthy();
    expect(Number(claim[1])).toBe(sliceCount);
  });
});

describe('ARCHITECTURE.md facts derive from the filesystem (F33)', () => {
  // The doc understated its own suite by half and described a 14-step pipeline
  // while 19 steps were registered — number drift is the exact rot class the
  // meta-pin (claim vocabulary) cannot see. These pins derive the numbers from
  // the artifacts themselves, so the doc can only be wrong loudly.

  it('lists the exact registered step order from steps/index.js', () => {
    const stepsIdx = read('../../src/generators/steps/index.js');
    const steps = [...stepsIdx.matchAll(/import '\.\/(\w+)\.js';/g)].map((m) => m[1]);
    expect(steps.length).toBeGreaterThan(0);
    // The doc claims the count…
    expect(archMd).toMatch(new RegExp(`${steps.length}-step pipeline`));
    // …and the Order list must name every registered step, in order.
    const orderBlock = archMd.match(/Order \(\d+ steps\): `([^`]+)`/);
    expect(orderBlock, 'ARCHITECTURE.md must carry the Order list').toBeTruthy();
    const docSteps = orderBlock[1].split('→').map((s) => s.trim());
    expect(docSteps).toEqual(steps);
  });

  it('states the real migration count', () => {
    const { readdirSync } = require('node:fs');
    const n = readdirSync(resolve(here, '../../supabase/migrations')).filter((f) => f.endsWith('.sql')).length;
    const claim = archMd.match(/\*\*migrations\/\*\* \((\d+)\)/);
    expect(claim, 'ARCHITECTURE.md should state the migration count').toBeTruthy();
    expect(Number(claim[1])).toBe(n);
  });

  // ── THE SUITE-SIZE PAIR IS DELETED, NOT RE-TYPED (dom-1, ODQ §115.1) ────────
  // This arm used to REQUIRE a `~N tests / ~N files` pair and check only the
  // FILES half, inside a ±25% band. That is why a ~7,800-test understatement
  // survived: the tests half was never read at all, and the files half had 159
  // files of margin to rot into. A band chosen wide enough to tolerate drift is a
  // band that cannot see drift. So the figure is GONE from the doc and this arm
  // now enforces its absence — the executable output is the only count.
  it('carries no hand-typed suite-size figure (the count lives in the suite, not the doc)', () => {
    const stale = [...archMd.matchAll(/~?([\d,]+)\s+tests\s*\/\s*~?([\d,]+)\s+files/g)]
      .map((m) => m[0]);
    expect(
      stale,
      'ARCHITECTURE.md re-typed a suite-size pair. The pair it used to carry understated'
      + ' the suite by roughly a third and the pin could not see it. Point at `npm run test`'
      + ` and scripts/.test-ratchet-baseline.json instead:\n${stale.join('\n')}\n`,
    ).toEqual([]);
  });

  it('points at the executable count instead (the absence arm above is not vacuous)', () => {
    // Without this, deleting the whole `test` bullet would green the arm above.
    const bullet = archMd.match(/- \*\*test\*\* — Vitest[\s\S]*?\n(?=- \*\*)/);
    expect(bullet, "ARCHITECTURE.md must keep a `- **test** — Vitest` gate bullet").toBeTruthy();
    expect(bullet[0]).toMatch(/npm run test/);
    expect(bullet[0]).toMatch(/\.test-ratchet-baseline\.json/);
  });
});

// ── dom-1: EVERY MACHINE FIGURE IS DERIVED OR DELETED (ODQ §115.1, J-TC22-2) ───
// The audit that opened this member recommended replacing a stale census figure
// with a fresh one. That fresh number died within a day: the baseline moved twice
// while the member was being compiled. So no figure below is transcribed — each is
// read off the artifact it describes, and prose that cannot be derived is deleted
// rather than refreshed.
describe('the onboarding docs carry no hand-kept machine figure (dom-1)', () => {
  const readmeMd = read('../../README.md');
  const currentStateMd = read('../../docs/CURRENT_STATE.md');
  const routesJs = read('../../src/lib/routes.js');
  const pkg = JSON.parse(read('../../package.json'));

  const WORD_NUMBERS = Object.freeze({
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
    nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
    fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20,
  });

  /** Every gate-stage count a doc states, numeric or spelled out. */
  const statedStageCounts = (doc) => [...doc.matchAll(/([A-Za-z]+|[\d,]+)[ -](?:stage|step)s?\b/g)]
    .map((m) => {
      const token = m[1].toLowerCase().replace(/,/g, '');
      if (/^\d+$/.test(token)) return Number(token);
      return WORD_NUMBERS[token] ?? null;
    })
    .filter((n) => n !== null);

  const gateStepCount = pkg.scripts.check.split('&&').length;

  it('CONTROL: the stage-count reader sees both spellings (so its silence means something)', () => {
    // A detector that finds nothing is indistinguishable from a detector that is
    // broken. Feed it the exact prose that was wrong and prove it reads it.
    expect(statedStageCounts('`npm run check` runs fourteen stages: data-key,')).toEqual([14]);
    expect(statedStageCounts('the full 14-stage gate')).toEqual([14]);
    expect(statedStageCounts('Locally the 17-step chain remains fail-fast.')).toEqual([17]);
  });

  it('README states no gate-stage count of its own, or states the derived one', () => {
    expect(gateStepCount, 'the check chain parsed to nothing — the reader broke').toBeGreaterThan(4);
    const wrong = statedStageCounts(readmeMd).filter((n) => n !== gateStepCount);
    expect(
      wrong,
      `README.md states a gate-stage count that is not the ${gateStepCount} steps`
      + ' package.json actually chains. Name the stages and let package.json carry the'
      + ` number: ${wrong.join(', ')}`,
    ).toEqual([]);
  });

  it('README still names the gate and points at package.json (the arm above is not vacuous)', () => {
    expect(readmeMd).toMatch(/## The gate/);
    expect(readmeMd).toMatch(/`npm run check` runs the whole `&&` chain declared by the `check` script in\n`package\.json`/);
  });

  it("ARCHITECTURE's NAV list is exactly the labels lib/routes.js derives, in order", () => {
    // THE CLASS THAT ROTTED UNDER AN EXPLICIT OWNER DIRECTIVE: home lost its `nav`
    // block on 2026-08-03 (THE FLETCHED RIBBON) and the doc kept listing Welcome.
    const derived = [...routesJs.matchAll(/nav:\s*\{\s*label:\s*'([^']+)',\s*order:\s*(\d+)\s*\}/g)]
      .map((m) => ({ label: m[1], order: Number(m[2]) }))
      .sort((a, b) => a.order - b.order)
      .map((r) => r.label);
    expect(derived.length, 'lib/routes.js should declare nav labels').toBeGreaterThan(3);
    const listed = archMd.match(/`NAV` is derived from the `ROUTES` table\*\*\s*\(([^)]+)\)/);
    expect(listed, 'ARCHITECTURE.md must carry the derived NAV list in parentheses').toBeTruthy();
    const docLabels = listed[1].split('·').map((s) => s.replace(/\s+/g, ' ').trim());
    expect(docLabels).toEqual(derived);
  });

  it('CURRENT_STATE.md states the real migration head and the real applied-head gap', () => {
    const { readdirSync } = require('node:fs');
    const numbers = readdirSync(resolve(here, '../../supabase/migrations'))
      .filter((f) => /^\d+_.*\.sql$/.test(f))
      .map((f) => parseInt(f, 10));
    const repoHead = Math.max(...numbers);
    const appliedHead = JSON.parse(read('../../supabase/applied-head.json')).appliedHead;
    expect(repoHead).toBeGreaterThan(0);

    const contiguous = currentStateMd.match(/migrations are contiguous to (\d+)/);
    expect(contiguous, 'CURRENT_STATE.md must state the contiguous migration head').toBeTruthy();
    expect(Number(contiguous[1])).toBe(repoHead);

    const blocker = currentStateMd.match(
      /migration head (\d+) is (\d+) migrations ahead\s+of the live-verified production head (\d+)/,
    );
    expect(blocker, 'CURRENT_STATE.md must state the migration-train blocker figures').toBeTruthy();
    expect(Number(blocker[1])).toBe(repoHead);
    expect(Number(blocker[3])).toBe(appliedHead);
    expect(Number(blocker[2])).toBe(repoHead - appliedHead);
  });
});

describe('ARCHITECTURE.md carries the spatial engine + the real gate (docs-knowledge-2)', () => {
  // The doc is the second-contributor map for a bus-factor-one repo; for 15 waves
  // it omitted the entire Phase-5.5 spatial engine and described a 5-step gate
  // while package.json ran 10. These pins derive both from the filesystem so the
  // onboarding map can only be wrong loudly.

  const { readdirSync, statSync } = require('node:fs');
  const walkJs = (d, out = []) => {
    for (const e of readdirSync(d)) {
      const p = resolve(d, e);
      if (statSync(p).isDirectory()) walkJs(p, out);
      else if (/\.js$/.test(e)) out.push(p);
    }
    return out;
  };

  it('mentions the spatial-canon engine at its real path', () => {
    // src/domain/spatial/ is a live engine (imported across the tree); the doc
    // must name it or a new contributor cannot find the realm-map engine.
    const dir = resolve(here, '../../src/domain/spatial');
    expect(readdirSync(dir).length, 'src/domain/spatial should exist').toBeGreaterThan(0);
    expect(archMd, 'ARCHITECTURE.md must mention src/domain/spatial').toMatch(/src\/domain\/spatial/);
  });

  it('states the worldPulse module count within drift tolerance', () => {
    const n = walkJs(resolve(here, '../../src/domain/worldPulse')).length;
    const claim = archMd.match(/`worldPulse\/`[^~]*~(\d+)\s*modules/);
    expect(claim, 'ARCHITECTURE.md should state the worldPulse module count').toBeTruthy();
    // The drift that shipped was "~74" vs 126 (0.59×). A 20% band catches that
    // while tolerating a handful of new modules.
    expect(Number(claim[1])).toBeGreaterThan(n * 0.8);
    expect(Number(claim[1])).toBeLessThan(n * 1.2);
  });

  it("names every sub-step of package.json's check chain in 'The gate'", () => {
    const pkg = JSON.parse(read('../../package.json'));
    // The check script is a `&&`-joined list of `npm run <sub-step>` calls.
    const subSteps = [...pkg.scripts.check.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
    expect(subSteps.length, 'check chain should have sub-steps').toBeGreaterThan(4);
    const missing = subSteps.filter((s) => !archMd.includes(s));
    expect(
      missing,
      `ARCHITECTURE.md 'The gate' omits check sub-step(s): ${missing.join(', ')}`,
    ).toEqual([]);
  });
});
