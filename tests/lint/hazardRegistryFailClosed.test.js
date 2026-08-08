/**
 * hazardRegistryFailClosed.test.js — the hazard registry gate must FAIL CLOSED.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * scripts/check-hazard-registry.mjs enforces the rule that every confirmed hazard
 * class is either MACHINERY or an EXPLICITLY ACCEPTED document with a stated
 * reason. That rule was previously a document, and the whole diagnosis behind
 * this round is that documents do not hold.
 *
 * SO THE REGISTRY'S OWN INTEGRITY CANNOT BE ASSERTED — IT HAS TO BE EXERCISED.
 * A gate whose failure paths never RUN is a gate nobody has proven works, and a
 * registry gate that greened on an empty file would commit the exact defect the
 * registry exists to diagnose: something that looks solved and enforces nothing.
 * Every arm below drives the real script through the HAZARD_REGISTRY_PATH and
 * HAZARD_REGISTRY_PACKAGE_JSON seams with a deliberately broken input and
 * asserts a non-zero exit.
 *
 * ── THE ATTRIBUTION CONTROL, WHICH IS THE HALF THAT IS EASY TO SKIP ─────────
 * "Exits non-zero on a bad input" is worth nothing if the script exits non-zero
 * on EVERYTHING — a script that always fails also "fails closed" and protects
 * nothing. So each failure arm is paired against `validRegistry()`, a fixture
 * that differs from the broken one in exactly the field under test and MUST exit
 * zero. That pairing is what makes each red attributable to its own cause rather
 * than to the fixture being malformed in some unrelated way.
 *
 * ── AND THE ONE THAT MATTERS MOST ───────────────────────────────────────────
 * `an EMPTY registry FAILS CLOSED rather than reading as "no violations"`. A
 * registry of zero classes satisfies every other assertion vacuously: no
 * MACHINERY entry to check, no ACCEPTED entry missing a reason, a DOCUMENT count
 * of 0 that is trivially under baseline. That green is the failure this entire
 * round exists to prevent.
 *
 * NOTE ON THE ACCEPTED ARM: the committed registry carries ZERO ACCEPTED entries
 * today, so that rule would be VACUOUS in production — it governs a population of
 * none. It is exercised here by injection instead, which is the same posture
 * tests/lint/contractTestAntiVacuity.walker.test.js takes with allowlists that are
 * empty at birth: the rule is proven to bite before it has anything to bite.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { afterAll, describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/check-hazard-registry.mjs');

const workdir = mkdtempSync(join(tmpdir(), 'hazard-registry-'));
afterAll(() => rmSync(workdir, { recursive: true, force: true }));

let seq = 0;
/** Write `body` to a fresh temp file and return its path. */
function fixture(body, ext = 'json') {
  const p = join(workdir, `fx-${seq++}.${ext}`);
  writeFileSync(p, typeof body === 'string' ? body : JSON.stringify(body, null, 2));
  return p;
}

/** Run the real gate against an injected registry (and optionally package.json). */
function run(registryPath, packageJsonPath) {
  return spawnSync('node', [SCRIPT], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      HAZARD_REGISTRY_PATH: registryPath,
      ...(packageJsonPath ? { HAZARD_REGISTRY_PACKAGE_JSON: packageJsonPath } : {}),
    },
  });
}
const out = (r) => `${r.stdout}${r.stderr}`;

/**
 * A minimal registry that PASSES every arm. Enforcer paths are real files in this
 * repo so the existence check is satisfied honestly rather than by stubbing it.
 * `overrides` mutates one thing at a time — the attribution control.
 */
function validRegistry(overrides = {}) {
  return {
    _doc: 'fixture',
    documentBaseline: 1,
    owedBaseline: 1,
    machineryFloor: 1,
    classFloor: 2,
    classes: [
      {
        id: 'HZ-ALPHA',
        title: 'a machinery class',
        status: 'MACHINERY',
        acceptedReason: null,
        memory: ['some-memory.md'],
        // Under tests/, and the chain runs the full suite -> derives inChain true.
        enforcer: { paths: ['tests/lint/controlBytes.test.js'], inChain: true, note: '' },
        instances: 2,
        instanceEvidence: 'measured',
        triggers: ['some trigger'],
      },
      {
        id: 'HZ-BETA',
        title: 'a document class',
        status: 'DOCUMENT',
        acceptedReason: null,
        memory: ['other-memory.md'],
        enforcer: { paths: [], inChain: false, note: '' },
        instances: 1,
        instanceEvidence: 'measured',
        triggers: ['another trigger'],
      },
    ],
    ...overrides,
  };
}
/** Deep-ish clone so an arm's mutation cannot leak into the next arm. */
const clone = (o) => JSON.parse(JSON.stringify(o));

describe('the hazard registry gate — the ATTRIBUTION CONTROL', () => {
  it('exits ZERO on a well-formed registry (so every red below is attributable)', () => {
    const r = run(fixture(validRegistry()));
    expect(out(r)).toMatch(/OK — 2 class\(es\)/);
    expect(r.status).toBe(0);
  });

  it('exits ZERO on the COMMITTED registry — the gate passes what it ships', () => {
    const r = spawnSync('node', [SCRIPT], { cwd: ROOT, encoding: 'utf8' });
    expect(out(r)).toMatch(/OK — \d+ class\(es\)/);
    expect(r.status).toBe(0);
  });
});

describe('the hazard registry gate — ANTI-VACUITY (a registry that verifies nothing must not read as clean)', () => {
  it('FAILS CLOSED on an EMPTY registry — the failure this whole round exists to prevent', () => {
    const r = run(fixture('', 'json'));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/ANTI-VACUITY/);
    expect(out(r)).toMatch(/EMPTY/);
  });

  it('FAILS CLOSED on a registry declaring ZERO classes (passes every other arm vacuously)', () => {
    const reg = clone(validRegistry());
    reg.classes = [];
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/ZERO hazard classes/);
    // The point stated in the output, not just the exit code: a green here would
    // be indistinguishable from a registry that governs everything.
    expect(out(r)).toMatch(/vacuously|verified NOTHING/i);
  });

  it('FAILS CLOSED on unparseable JSON', () => {
    const r = run(fixture('{ "classes": [ oops', 'json'));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/UNPARSEABLE/);
  });

  it('FAILS CLOSED when the registry file is absent', () => {
    const r = run(join(workdir, 'does-not-exist.json'));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/no registry at|failing closed/i);
  });

  it('FAILS CLOSED when classes is not an array', () => {
    const reg = clone(validRegistry());
    reg.classes = { 'HZ-ALPHA': {} };
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/not an array/);
  });
});

describe('the hazard registry gate — MACHINERY must be backed by a file that EXISTS', () => {
  it('REDS when a MACHINERY entry names an enforcer that is not on disk', () => {
    const reg = clone(validRegistry());
    reg.classes[0].enforcer.paths = ['tests/lint/thisWalkerWasDeleted.test.js'];
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/DOES NOT EXIST on disk/);
    expect(out(r)).toMatch(/status MACHINERY/);
  });

  it('REDS on a missing enforcer at NON-machinery status too (a deleted PARTIAL guard is the same lie)', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'PARTIAL';
    reg.classes[1].enforcer = { paths: ['scripts/deletedGuard.mjs'], inChain: false, note: '' };
    reg.documentBaseline = 0; // no DOCUMENT entries left; keeps this arm single-cause
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/DOES NOT EXIST on disk: scripts\/deletedGuard\.mjs/);
  });

  it('REDS when a MACHINERY entry names NO enforcer at all', () => {
    const reg = clone(validRegistry());
    reg.classes[0].enforcer = { paths: [], inChain: false, note: '' };
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/MACHINERY but enforcer\.paths is EMPTY/);
  });

  it('REDS when a PARTIAL entry names NO enforcer at all (that is DOCUMENT under another name)', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'PARTIAL';
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/PARTIAL but enforcer\.paths is EMPTY/);
    expect(out(r)).toMatch(/use DOCUMENT/);
  });
});

describe('the hazard registry gate — ACCEPTED without a reason is a SILENT SURRENDER', () => {
  it('REDS when an ACCEPTED entry carries no reason', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'ACCEPTED';
    reg.classes[1].acceptedReason = null;
    reg.documentBaseline = 0;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/ACCEPTED with no stated reason/);
    expect(out(r)).toMatch(/SILENT SURRENDER/);
  });

  it('REDS on an empty-string / whitespace reason (a field filled in to silence the gate)', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'ACCEPTED';
    reg.classes[1].acceptedReason = '   ';
    reg.documentBaseline = 0;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/ACCEPTED with no stated reason/);
  });

  it('PASSES when an ACCEPTED entry states a real reason — the acceptance arm is a door, not a wall', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'ACCEPTED';
    reg.classes[1].acceptedReason =
      'Deliberately left as a document: the trigger surface is outside this repo, so no '
      + 'repo-side guard can observe it. Revisit if a repo-side vector appears.';
    reg.documentBaseline = 0;
    const r = run(fixture(reg));
    expect(out(r)).toMatch(/ACCEPTED 1/);
    expect(r.status).toBe(0);
  });
});

describe('the hazard registry gate — a class with NO STATUS REDS (the arm that keeps the registry alive)', () => {
  it('REDS when a newly added class carries no status at all', () => {
    const reg = clone(validRegistry());
    reg.classFloor = 2;
    reg.classes.push({
      id: 'HZ-GAMMA',
      title: 'a class somebody appended without triaging it',
      memory: ['new-memory.md'],
      enforcer: { paths: [], inChain: false, note: '' },
      instances: 1,
      instanceEvidence: 'measured',
      triggers: ['t'],
    });
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/status is undefined/);
    expect(out(r)).toMatch(/must be triaged, not parked/);
  });

  it('REDS on a status outside the closed set', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'MOSTLY_FINE';
    reg.documentBaseline = 0;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/MOSTLY_FINE/);
    expect(out(r)).toMatch(/must be one of MACHINERY, PARTIAL, DOCUMENT, ACCEPTED/);
  });

  it('REDS on a duplicate id — a shadowed entry is an invisible class', () => {
    const reg = clone(validRegistry());
    reg.classes[1].id = 'HZ-ALPHA';
    reg.documentBaseline = 1;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/DUPLICATE id/);
  });

  it('REDS on an entry with no triggers — an unroutable hazard cannot be applied', () => {
    const reg = clone(validRegistry());
    reg.classes[1].triggers = [];
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/triggers must be a non-empty array/);
  });
});

describe('the hazard registry gate — the DOCUMENT pile is SHRINK-ONLY (the ratchet on the treadmill)', () => {
  it('REDS when the DOCUMENT count grows past the frozen baseline', () => {
    const reg = clone(validRegistry());
    reg.classes.push({
      id: 'HZ-DELTA',
      title: 'another undefended document',
      status: 'DOCUMENT',
      acceptedReason: null,
      memory: ['m.md'],
      enforcer: { paths: [], inChain: false, note: '' },
      instances: 1,
      instanceEvidence: 'measured',
      triggers: ['t'],
    });
    const r = run(fixture(reg)); // baseline 1, now 2 DOCUMENT entries
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/DOCUMENT COUNT GREW: 2 > baseline 1/);
    expect(out(r)).toMatch(/SHRINK-ONLY/);
  });

  it('PASSES when the DOCUMENT count SHRINKS (upgrading a class must never red)', () => {
    const reg = clone(validRegistry());
    reg.classes[1].status = 'PARTIAL';
    reg.classes[1].enforcer = { paths: ['scripts/gate-mutex.sh'], inChain: false, note: '' };
    const r = run(fixture(reg)); // baseline 1, now 0 DOCUMENT entries
    expect(out(r)).toMatch(/DOCUMENT 0\/1/);
    expect(r.status).toBe(0);
  });
});

describe('the hazard registry gate — DOCUMENT + PARTIAL is the whole OWED pile', () => {
  it('REDS when a new undefended class claims PARTIAL with an unrelated existing path', () => {
    const reg = clone(validRegistry());
    reg.classes.push({
      id: 'HZ-DELTA',
      title: 'an undefended class routed around the document ratchet',
      status: 'PARTIAL',
      acceptedReason: null,
      memory: ['m.md'],
      // The old gate checked only that this path existed and accepted the lie.
      enforcer: { paths: ['package.json'], inChain: false, note: 'unrelated existing file' },
      instances: 1,
      instanceEvidence: 'measured',
      triggers: ['t'],
    });
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/OWED COUNT GREW: 2 > baseline 1/);
    expect(out(r)).toMatch(/labelling an\s+undefended class PARTIAL cannot route around/);
  });

  it('REDS when a MACHINERY class silently downgrades to PARTIAL', () => {
    const reg = clone(validRegistry());
    reg.classes[0].status = 'PARTIAL';
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/OWED COUNT GREW: 2 > baseline 1/);
    expect(out(r)).toMatch(/MACHINERY COUNT FELL: 0 < floor 1/);
  });
});

describe('the hazard registry gate — SCOPE SENTINEL', () => {
  it('REDS when the class count collapses below the frozen floor', () => {
    const reg = clone(validRegistry());
    reg.classes = [reg.classes[0]]; // 1 class, floor 2
    reg.documentBaseline = 0;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/SCOPE SENTINEL/);
    expect(out(r)).toMatch(/COLLAPSED to 1, below the frozen floor of 2/);
  });

  it('FAILS CLOSED when classFloor is missing entirely', () => {
    const reg = clone(validRegistry());
    delete reg.classFloor;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/classFloor is missing/);
  });

  it('FAILS CLOSED when documentBaseline is missing entirely', () => {
    const reg = clone(validRegistry());
    delete reg.documentBaseline;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/documentBaseline is missing/);
  });

  it('FAILS CLOSED when owedBaseline is missing entirely', () => {
    const reg = clone(validRegistry());
    delete reg.owedBaseline;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/owedBaseline is missing/);
  });

  it('FAILS CLOSED when machineryFloor is missing entirely', () => {
    const reg = clone(validRegistry());
    delete reg.machineryFloor;
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/machineryFloor is missing/);
  });
});

describe('the hazard registry gate — inChain is DERIVED, never restated', () => {
  it('REDS when an entry CLAIMS in-chain but the check chain does not run it', () => {
    const reg = clone(validRegistry());
    // gate-mutex.sh is real but deliberately NOT wired into `npm run check`.
    reg.classes[0].enforcer = { paths: ['scripts/gate-mutex.sh'], inChain: true, note: '' };
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/inChain claims true but the `check` chain says false/);
    expect(out(r)).toMatch(/DERIVE-DONT-RESTATE/);
  });

  it('REDS when an entry UNDER-claims — a wired enforcer recorded as not in chain', () => {
    const reg = clone(validRegistry());
    reg.classes[0].enforcer.inChain = false; // real path under tests/, chain runs it
    const r = run(fixture(reg));
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/inChain claims false but the `check` chain says true/);
  });

  it('FAILS CLOSED when package.json has no `check` script (nothing to derive against)', () => {
    const pkg = fixture({ scripts: { test: 'vitest run' } });
    const r = run(fixture(validRegistry()), pkg);
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/no `check` script/);
  });

  it('FAILS CLOSED when the chain contains no vitest runner at all (would silently flip every tests/ claim)', () => {
    const pkg = fixture({ scripts: { check: 'npm run lint', lint: 'eslint src/' } });
    const r = run(fixture(validRegistry()), pkg);
    expect(r.status).not.toBe(0);
    expect(out(r)).toMatch(/no vitest runner found anywhere in the `check` chain/);
  });

  it('derives in-chain through NESTED npm run indirection, not just top-level steps', () => {
    // `check` -> `gate` -> `test:ratchet` -> the full-suite runner. A derivation
    // that only read the top level would call the tests/ enforcer out-of-chain
    // and red the valid fixture; this proves the recursion is real.
    const pkg = fixture({
      scripts: {
        check: 'npm run gate',
        gate: 'npm run test:ratchet',
        'test:ratchet': 'node scripts/check-test-ratchet.mjs',
      },
    });
    const r = run(fixture(validRegistry()), pkg);
    expect(out(r)).toMatch(/OK — 2 class\(es\)/);
    expect(r.status).toBe(0);
  });

  it('survives a CYCLE in the npm script graph instead of hanging', () => {
    const pkg = fixture({
      scripts: {
        check: 'npm run a',
        a: 'npm run b',
        b: 'npm run a && node scripts/check-test-ratchet.mjs',
      },
    });
    const r = run(fixture(validRegistry()), pkg);
    expect(r.status).toBe(0);
  });
});
