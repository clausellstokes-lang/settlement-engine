import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  PACKET_AUTHORITY_NOTICE,
  ROW_KEYED_REGISTERS,
  SEAL_ENVELOPE_SCHEMA_VERSION,
  buildCodingCapsule,
  canonicalSerialize,
  capsuleDigestOf,
  couplingRegistrationGaps,
  couplingRegistrationLegacyIds,
  extractSymbolExcerpt,
  isCouplingRegistrationLegacy,
  loadPacketManifest,
  packetPathProblem,
  parseIndexPacketStatuses,
  parsePacketHeader,
  readDispatchSeal,
  runImplementationPacketsCli,
  sha256,
  validatePacketManifest,
  verifyCodingCapsule,
} from '../../scripts/implementation-packets.mjs';
import {
  SESSION_SCHEMA_VERSION,
  createImplementationSession,
} from '../../scripts/implementation-session.mjs';

const COUPLING_LEAF = 'src/domain/certification/couplingRegistryEspionage.js';
const COUPLING_HEAD = 'src/domain/certification/couplingRegistry.js';
const COUPLING_PIN = 'tests/domain/couplingRegistry.test.js';

const BASE = 'a'.repeat(40);
const INDEX_PATH = 'docs/implementation/INDEX.md';
const MANIFEST_PATH = 'docs/implementation/PACKET_MANIFEST.json';

/** @param {unknown} value */
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** @param {string} root @param {string} repositoryPath @param {string} value */
function write(root, repositoryPath, value) {
  const target = join(root, repositoryPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, value);
}

/** @param {string} id @param {string} status */
function packetMarkdown(id, status, base = BASE) {
  return [
    `# Fixture / ${id} — implementation contract`,
    '',
    `- **Status:** \`${status}\``,
    `- **Verified base:** fixture at \`${base}\``,
    '',
  ].join('\n');
}

function canonicalManifest() {
  return {
    schemaVersion: 1,
    indexPath: INDEX_PATH,
    packets: [
      {
        id: 'P-1',
        status: 'READY',
        packetPath: 'docs/implementation/packets/P-1.md',
        verifiedBase: BASE,
        changeManifest: [{ action: 'MODIFY', path: 'src/alpha.js' }],
        requiredSymbols: [{ path: 'src/alpha.js', symbol: 'alphaFeature' }],
        acceptanceCases: [
          { id: 'A1', case: 'The alpha feature remains reachable.' },
          { id: 'A2', case: 'The disabled path remains absent.' },
        ],
        checks: [
          ['npx', 'vitest', 'run', 'tests/alpha.test.js'],
          ['npx', 'eslint', 'src/alpha.js'],
        ],
      },
      {
        id: 'P-2',
        status: 'BLOCKED',
        packetPath: 'docs/implementation/packets/P-2.md',
        verifiedBase: BASE,
        changeManifest: [],
        requiredSymbols: [],
        acceptanceCases: [],
        checks: [],
      },
    ],
  };
}

/** @param {string} root @param {ReturnType<typeof canonicalManifest>} manifest */
function materializeFixture(root, manifest) {
  write(root, INDEX_PATH, [
    '# Implementation packet index',
    '',
    '| Packet | Status |',
    '|---|---|',
    '| [Display P-1](./packets/P-1.md) | **READY** at the verified base |',
    '| [Different P-2 label](./packets/P-2.md) | **BLOCKED** pending decision |',
    '',
  ].join('\n'));
  write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'READY'));
  write(root, 'docs/implementation/packets/P-2.md', packetMarkdown('P-2', 'BLOCKED'));
  write(root, 'src/alpha.js', [
    'const before = 1;',
    'export function alphaFeature(value) {',
    '  return value + before;',
    '}',
    'const after = 2;',
    '',
  ].join('\n'));
  write(root, 'tests/alpha.test.js', 'export const alphaTestFixture = true;\n');
  write(root, MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

/** @param {{ errors:string[] }} result */
function errorText(result) {
  return result.errors.join('\n');
}

describe('IA-1 implementation packet manifest and capsule', () => {
  /** @type {string} */
  let root;
  /** @type {ReturnType<typeof canonicalManifest>} */
  let manifest;
  /** The §7.4 arm's SECOND fixture: a real Git worktree, so a real seal can be minted. */
  /** @type {string|null} */
  let sealRoot;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'settlementforge-packets-'));
    sealRoot = null;
    manifest = canonicalManifest();
    materializeFixture(root, manifest);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    if (sealRoot) rmSync(sealRoot, { recursive: true, force: true });
    sealRoot = null;
  });

  it('accepts the canonical fixture and exposes pure header/index/path helpers', () => {
    expect(validatePacketManifest(manifest, { rootDir: root })).toEqual({ ok: true, errors: [] });
    expect(packetPathProblem('src/domain/alpha.js')).toBeNull();
    expect(packetPathProblem('src/**/*.js')).toContain('glob');
    expect(parsePacketHeader(packetMarkdown('P-1', 'READY'))).toEqual({
      heading: 'Fixture / P-1 — implementation contract',
      status: 'READY',
      verifiedBase: BASE,
      verifiedBranch: 'fixture',
    });
    expect(parsePacketHeader([
      '# Fixture / P-1',
      '- **Status:** READY',
      `- **Verified base:** prior \`${BASE}\`; fixture at \`${'b'.repeat(40)}\``,
    ].join('\n'))).toMatchObject({ verifiedBase: null, verifiedBranch: null });
    expect(parsePacketHeader(`${packetMarkdown('P-1', 'READY')}- **Status:** READY\n`).status)
      .toBeNull();
    const index = parseIndexPacketStatuses(
      '# Index\n| Packet | Status |\n|---|---|\n| [Alias](./packets/P-1.md) | READY |\n',
      INDEX_PATH,
    );
    expect([...index.statuses]).toEqual([['docs/implementation/packets/P-1.md', 'READY']]);
    expect(index.duplicates).toEqual([]);

    // ── THE OMITTED-FIELD CONTROL FOR `retiredSymbols` ────────────────────────────────
    // The field is optional, and its ABSENCE is what keeps every already-landed manifest
    // row valid — none of them declares a retirement, and none of them ever will. The
    // canonical fixture names no retirement at all, so it must stay clean at a terminal
    // status exactly as it does at READY. This row is the backward-compatibility proof.
    expect(Object.hasOwn(manifest.packets[0], 'retiredSymbols')).toBe(false);
    const landedWithoutRetirements = clone(manifest);
    landedWithoutRetirements.packets[0].status = 'LANDED';
    write(root, INDEX_PATH, [
      '| Packet | Status |',
      '|---|---|',
      '| [P-1](./packets/P-1.md) | LANDED |',
      '| [P-2](./packets/P-2.md) | BLOCKED |',
    ].join('\n'));
    write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'LANDED'));
    expect(validatePacketManifest(landedWithoutRetirements, { rootDir: root }))
      .toEqual({ ok: true, errors: [] });
  });

  it('reds a packet that mints a coupling row without naming the head re-export and the registry pin', () => {
    for (const path of [COUPLING_LEAF, COUPLING_HEAD, COUPLING_PIN]) {
      write(root, path, 'export const fixture = true;\n');
    }
    /** @param {string[]} paths */
    const withChanges = (paths) => {
      const candidate = clone(manifest);
      candidate.packets[0].changeManifest = paths.map((path) => ({ action: 'MODIFY', path }));
      return validatePacketManifest(candidate, { rootDir: root });
    };

    // Leaf alone — the shape all five recorded instances shipped.
    const leafOnly = errorText(withChanges([COUPLING_LEAF]));
    expect(leafOnly).toContain('P-1 mints a coupling row in src/domain/certification/couplingRegistryEspionage.js');
    expect(leafOnly).toContain(COUPLING_HEAD);
    expect(leafOnly).toContain(COUPLING_PIN);

    // Leaf + head — instance FIVE's shape, which a head-only check would have passed.
    const noPin = errorText(withChanges([COUPLING_LEAF, COUPLING_HEAD]));
    expect(noPin).toContain(`does not name ${COUPLING_PIN}`);
    expect(noPin).toContain('P-1');

    // Leaf + head + pin — the complete registration passes.
    expect(withChanges([COUPLING_LEAF, COUPLING_HEAD, COUPLING_PIN]))
      .toEqual({ ok: true, errors: [] });

    // The head itself and the SCHEMA leaf are not row-carrying leaves and never trigger.
    // couplingRegistrySchema.js exports the row FACTORY and no `*_COUPLINGS` aggregate, so
    // a packet touching only it mints no row — excluded on that reading, not on its name.
    expect(couplingRegistrationGaps([COUPLING_HEAD]).leaves).toEqual([]);
    expect(couplingRegistrationGaps(['src/domain/certification/couplingRegistrySchema.js']).leaves)
      .toEqual([]);
    expect(withChanges([COUPLING_HEAD])).toEqual({ ok: true, errors: [] });
  });

  it('⛔ the coupling-registration legacy inventory is EXACT — an un-banked cure reds too', () => {
    const live = loadPacketManifest();
    /** @param {Record<string, any>} packet */
    const gapsOf = (packet) => couplingRegistrationGaps(
      (packet.changeManifest ?? []).map((row) => row.path),
    );
    const triggering = live.packets.filter((packet) => gapsOf(packet).leaves.length > 0);
    const passing = triggering.filter((packet) => gapsOf(packet).missing.length === 0);
    const failing = triggering.filter((packet) => gapsOf(packet).missing.length > 0);

    // ⚠⚠ THE ANTI-VACUITY LEGS, AND THEY ARE THE POINT. An empty inventory over zero
    // triggering packets would satisfy every other assertion here while proving nothing —
    // the empty-population class. A trigger regex narrowed to match nothing is the failure
    // mode a green suite cannot otherwise see, and it is the exact shape of the class this
    // check exists to end, so the live population is pinned as a FLOOR in both parts.
    expect(triggering.length, 'no packet triggers the coupling check — the trigger is dead')
      .toBeGreaterThanOrEqual(7);
    expect(passing.length, 'no packet passes the check on its own — the check is unsatisfiable')
      .toBeGreaterThanOrEqual(3);
    expect(couplingRegistrationLegacyIds().length, 'the inventory emptied — if that is real, '
      + 'delete it and this arm together').toBeGreaterThan(0);

    // Both directions, exactly as the ruin-filter quarantine audits its own list.
    const stale = [];
    for (const id of couplingRegistrationLegacyIds()) {
      const packet = live.packets.find((row) => String(row.id).toUpperCase() === id);
      if (!packet) { stale.push(`${id}: absent from the manifest — a stale legacy row`); continue; }
      const gaps = gapsOf(packet);
      if (gaps.leaves.length === 0) stale.push(`${id}: no longer mints a coupling row — delete its legacy row`);
      else if (gaps.missing.length === 0) stale.push(`${id}: now names both companions — delete its legacy row (bank the win)`);
    }
    expect(stale, 'the legacy inventory drifted from the manifest it exempts').toEqual([]);

    // …and the inventory is EXACTLY the failing set: an id may never be added to buy a pass.
    expect([...couplingRegistrationLegacyIds()].sort())
      .toEqual(failing.map((packet) => String(packet.id).toUpperCase()).sort());
    expect(failing.every((packet) => isCouplingRegistrationLegacy(packet.id))).toBe(true);
    expect(passing.some((packet) => isCouplingRegistrationLegacy(packet.id))).toBe(false);
  });

  it('rejects an indexed packet omitted from the manifest', () => {
    const broken = clone(manifest);
    broken.packets = broken.packets.filter((packet) => packet.id !== 'P-2');
    const result = validatePacketManifest(broken, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain(
      'index packet path is absent from manifest: docs/implementation/packets/P-2.md',
    );
  });

  it('fails closed on unknown status and duplicate packet identity or paths', () => {
    const broken = clone(manifest);
    broken.packets[0].status = 'MAYBE';
    broken.packets[1].id = 'P-1';
    broken.packets[1].packetPath = broken.packets[0].packetPath;
    broken.packets[1].changeManifest = [{ action: 'TEST', path: 'src/alpha.js' }];
    const result = validatePacketManifest(broken, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain('status is unknown');
    expect(errorText(result)).toContain('duplicate packet id');
    expect(errorText(result)).toContain('duplicate packet path');
    expect(errorText(result)).toContain('duplicate change path across packets');
  });

  it('allows historical path reuse but preserves every nonterminal collision', () => {
    const reused = clone(manifest);
    reused.packets[1].status = 'READY';
    reused.packets[1].changeManifest = [{ action: 'MODIFY', path: 'src/alpha.js' }];
    reused.packets[1].requiredSymbols = [{ path: 'src/alpha.js', symbol: 'alphaFeature' }];
    reused.packets[1].acceptanceCases = [{ id: 'A1', case: 'Successor remains bounded.' }];
    reused.packets[1].checks = [['node', '--check', 'src/alpha.js']];
    write(root, 'docs/implementation/packets/P-2.md', packetMarkdown('P-2', 'READY'));

    for (const terminalStatus of ['LANDED', 'SUPERSEDED']) {
      reused.packets[0].status = terminalStatus;
      write(root, INDEX_PATH, [
        '| Packet | Status |',
        '|---|---|',
        `| [P-1](./packets/P-1.md) | ${terminalStatus} |`,
        '| [P-2](./packets/P-2.md) | READY |',
      ].join('\n'));
      write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', terminalStatus));
      expect(validatePacketManifest(reused, { rootDir: root })).toEqual({ ok: true, errors: [] });
    }

    reused.packets[0].status = 'STALE';
    write(root, INDEX_PATH, [
      '| Packet | Status |',
      '|---|---|',
      '| [P-1](./packets/P-1.md) | STALE |',
      '| [P-2](./packets/P-2.md) | READY |',
    ].join('\n'));
    write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'STALE'));
    expect(errorText(validatePacketManifest(reused, { rootDir: root })))
      .toContain('duplicate change path across packets: src/alpha.js (P-1, P-2)');

    // ── AND A LANDED PACKET'S `CREATE` ROWS MUST NAME FILES THAT REALLY EXIST ──────────
    // `CREATE` used to be exempt from every existence check at EVERY status, so a landed
    // packet's manifest row could name a file nobody ever wrote and validation still
    // reported `valid` — a disabled guard, and the one that let TC-5A carry three fictional
    // paths from its landing onward. LANDED is the only status at which existence is
    // assertable, which is why this lives beside the terminal-status cases above rather than
    // beside the path checks: a nonterminal packet's CREATE target is REQUIRED to be absent,
    // and a SUPERSEDED packet may have been replaced before it ever built anything. Both
    // controls are asserted, so the arm cannot quietly widen to a status where reddening it
    // would break every ordinary pre-landing dispatch.
    const created = clone(manifest);
    created.packets[0].changeManifest.push({ action: 'CREATE', path: 'src/never-written.js' });
    write(root, 'docs/implementation/packets/P-2.md', packetMarkdown('P-2', 'BLOCKED'));
    /** @param {string} status */
    const validateAtStatus = (status) => {
      created.packets[0].status = status;
      write(root, INDEX_PATH, [
        '| Packet | Status |',
        '|---|---|',
        `| [P-1](./packets/P-1.md) | ${status} |`,
        '| [P-2](./packets/P-2.md) | BLOCKED |',
      ].join('\n'));
      write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', status));
      return validatePacketManifest(created, { rootDir: root });
    };
    expect(errorText(validateAtStatus('LANDED')))
      .toContain('changeManifest[1].path does not exist for LANDED CREATE: src/never-written.js');
    expect(validateAtStatus('SUPERSEDED')).toEqual({ ok: true, errors: [] });
    expect(validateAtStatus('READY')).toEqual({ ok: true, errors: [] });
  });

  it('rejects index, packet status, heading, and verified-base disagreement', () => {
    write(root, INDEX_PATH, [
      '| Packet | Status |',
      '|---|---|',
      '| [P-1](./packets/P-1.md) | BLOCKED |',
      '| [P-2](./packets/P-2.md) | BLOCKED |',
    ].join('\n'));
    write(root, 'docs/implementation/packets/P-1.md', [
      '# Fixture with the wrong identity',
      '',
      '- **Status:** BLOCKED',
      `- **Verified base:** ${'b'.repeat(40)}`,
    ].join('\n'));
    const result = validatePacketManifest(manifest, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain('heading does not name packet id P-1');
    expect(errorText(result)).toContain('status disagrees with packet Markdown');
    expect(errorText(result)).toContain('verifiedBase disagrees with packet Markdown');
    expect(errorText(result)).toContain('status disagrees with index');
  });

  // ── THE ROW-KEYED REGISTER EXEMPTION (TOOL-27; chair ruling PACKET-PARALLEL 4) ────────
  // The reservation above is a whole-FILE claim, which is right for code and wrong for a
  // register keyed by ROW. This arm holds all four fences at once, and the fourth is the
  // negative control that keeps the other three honest: every path OUTSIDE the frozen
  // roster must still produce the byte-for-byte sentence pinned at the head of this file.
  //
  // MEASURED at the cure, on the real waiting estate rather than on these fixtures: EM-A1
  // and EM-B1h refused together with `duplicate change path across packets:
  // scripts/mutation-coverage-manifest.json (EM-A1, EM-B1h)`, and pass together once each
  // declares the one `invariants[…]` row its own enforcer-directory CREATE earns.
  it('reserves a ROW-KEYED REGISTER by its row key, and refuses a row that declares none', () => {
    const REGISTER = 'scripts/mutation-coverage-manifest.json';
    const KEY_A = "invariants['tests/lint/alpha.walker.test.js']";
    const KEY_B = "invariants['tests/lint/beta.walker.test.js']";
    // The roster is DRIVEN from the module, never re-spelled, so a future member added
    // there is exercised here instead of silently escaping this arm.
    expect(ROW_KEYED_REGISTERS).toContain(REGISTER);
    // ⛔ AND THE FREEZE IS A REAL FREEZE. `Object.freeze(new Set(…))` leaves `.add()`
    // working, because a Set's members are not own properties; a frozen ARRAY is the only
    // spelling of this roster that a later edit cannot widen at runtime.
    // ⚠ The ARRAY arm is not decoration: `Object.isFrozen(undefined)` is `true` and
    // `undefined.push()` throws TypeError, so both assertions below pass VACUOUSLY against a
    // module that exports no roster at all. This is what makes them mean something.
    expect(Array.isArray(ROW_KEYED_REGISTERS)).toBe(true);
    expect(Object.isFrozen(ROW_KEYED_REGISTERS)).toBe(true);
    expect(() => ROW_KEYED_REGISTERS.push('scripts/invented.json')).toThrow(TypeError);

    // A REGISTER row is not a CREATE, so the register must exist to be named at all.
    write(root, REGISTER, '{\n  "invariants": {}\n}\n');

    // Both fixture packets are NON-TERMINAL — P-1 READY, P-2 BLOCKED — so both reserve.
    /** @param {string|null} first @param {string|null} second */
    const bothNaming = (first, second) => {
      const next = clone(manifest);
      const row = (key) => (key === null
        ? { action: 'REGISTER', path: REGISTER }
        : { action: 'REGISTER', path: REGISTER, rowKey: key });
      next.packets[0].changeManifest = [row(first)];
      next.packets[1].changeManifest = [row(second)];
      return validatePacketManifest(next, { rootDir: root });
    };

    // (1) TWO packets, ONE register, DIFFERENT rows — the whole point of the exemption.
    expect(bothNaming(KEY_A, KEY_B)).toEqual({ ok: true, errors: [] });

    // (2) THE SAME ROW claimed twice is still a genuine collision, and the refusal names
    //     the ROW, because the path alone no longer identifies what is contended.
    expect(errorText(bothNaming(KEY_A, KEY_A))).toContain(
      `duplicate register row key across packets: ${REGISTER} :: ${KEY_A} (P-1, P-2)`,
    );

    // (3) THE EXEMPTION IS NEVER A BLANK CHEQUE. A register row with no key — or a blank
    //     one — reserves nothing, so it is refused rather than waved through.
    for (const missing of [null, '   ']) {
      expect(errorText(bothNaming(missing, KEY_B))).toContain(
        `P-1.changeManifest[0].rowKey must name the ONE row this packet adds to the`
        + ` row-keyed register ${REGISTER}`,
      );
    }

    // (4) ⛔ THE NEGATIVE CONTROL: a path outside the roster keeps the exact sentence it
    //     has always had. Without this arm the exemption could widen to every path and
    //     three of the four assertions above would still pass.
    const ordinary = clone(manifest);
    ordinary.packets[1].changeManifest = [{ action: 'MODIFY', path: 'src/alpha.js' }];
    expect(errorText(validatePacketManifest(ordinary, { rootDir: root })))
      .toContain('duplicate change path across packets: src/alpha.js (P-1, P-2)');
  });

  it('requires a non-blank verified branch in every READY packet header', () => {
    write(root, 'docs/implementation/packets/P-1.md', [
      '# Fixture / P-1 — implementation contract',
      '',
      '- **Status:** `READY`',
      `- **Verified base:** \`\` at \`${BASE}\``,
      '',
    ].join('\n'));
    const result = validatePacketManifest(manifest, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain(
      'P-1.packetPath READY header must name a non-blank verified branch',
    );
  });

  it('rejects glob paths and missing non-CREATE manifest or symbol files', () => {
    const broken = clone(manifest);
    broken.packets[0].changeManifest = [
      { action: 'MODIFY', path: 'src/*.js' },
      { action: 'TEST', path: 'tests/missing.test.js' },
    ];
    broken.packets[0].requiredSymbols = [{ path: 'src/missing.js', symbol: 'missingFeature' }];
    const result = validatePacketManifest(broken, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain('must not contain glob');
    expect(errorText(result)).toContain('does not exist for TEST');
    expect(errorText(result)).toContain('requiredSymbols[0].path does not exist');
  });

  it('enforces the eight-case ceiling and argv-form checks for READY packets', () => {
    const broken = clone(manifest);
    broken.packets[0].acceptanceCases = Array.from({ length: 9 }, (_, index) => ({
      id: `A${index + 1}`,
      case: `Case ${index + 1}`,
    }));
    broken.packets[0].checks = ['npx vitest run'];
    const result = validatePacketManifest(broken, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain('9 acceptance cases; maximum is 8');
    expect(errorText(result)).toContain('must be a non-blank argv string array');

    const noChecks = clone(manifest);
    noChecks.packets[0].checks = [];
    expect(errorText(validatePacketManifest(noChecks, { rootDir: root })))
      .toContain('READY packet has no checks');

    const whitespaceArg = clone(manifest);
    whitespaceArg.packets[0].checks = [['npx', '   ']];
    expect(errorText(validatePacketManifest(whitespaceArg, { rootDir: root })))
      .toContain('must be a non-blank argv string array');
  });

  it('rejects a required symbol absent from an existing source file', () => {
    const broken = clone(manifest);
    broken.packets[0].requiredSymbols[0].symbol = 'notActuallyExported';
    const result = validatePacketManifest(broken, { rootDir: root });
    expect(result.ok).toBe(false);
    expect(errorText(result)).toContain('symbol is missing from src/alpha.js');

    const whitespaceSymbol = clone(manifest);
    whitespaceSymbol.packets[0].requiredSymbols[0].symbol = '   ';
    expect(errorText(validatePacketManifest(whitespaceSymbol, { rootDir: root })))
      .toContain('symbol must be a non-blank string');

    // ── AND A PACKET MAY DECLARE WHAT ITS DELIVERABLE RETIRES ─────────────────────────
    // The `requiredSymbols` check above is total and status-blind, which is correct: a
    // required symbol must exist at every status, and that is what catches a typo the day
    // it is written. But it left the manifest with no way to say "this packet retired X",
    // so a packet that retired a symbol and honestly named the retiree reddened from its
    // landing onward — the defect CR-IN1B-9 had to cure by hand, by re-pointing a row at a
    // successor. `retiredSymbols` is the opposite-signed declaration, asserted at the one
    // status where absence is assertable, exactly as the LANDED CREATE arm is. Both
    // controls travel with it: SUPERSEDED asserts in NEITHER direction, and a non-terminal
    // packet's retiree MUST still be present, because the packet is written against it.
    const retireePath = 'src/retiree.js';
    const retireeSymbol = 'export const retireMe';
    const retireeSource = `${retireeSymbol} = true;\n`;
    /** @param {ReturnType<typeof canonicalManifest>} candidate @param {string} status */
    const retireAtStatus = (candidate, status) => {
      candidate.packets[0].status = status;
      write(root, INDEX_PATH, [
        '| Packet | Status |',
        '|---|---|',
        `| [P-1](./packets/P-1.md) | ${status} |`,
        '| [P-2](./packets/P-2.md) | BLOCKED |',
      ].join('\n'));
      write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', status));
      return validatePacketManifest(candidate, { rootDir: root });
    };

    const retiring = clone(manifest);
    retiring.packets[0].retiredSymbols = [{ path: retireePath, symbol: retireeSymbol }];
    write(root, retireePath, retireeSource);
    expect(errorText(retireAtStatus(retiring, 'LANDED'))).toContain(
      `retiredSymbols[0].symbol survives in ${retireePath} for LANDED retirement: ${retireeSymbol}`,
    );
    write(root, retireePath, 'export const successor = true;\n');
    expect(retireAtStatus(retiring, 'LANDED')).toEqual({ ok: true, errors: [] });
    rmSync(join(root, retireePath));
    expect(retireAtStatus(retiring, 'LANDED')).toEqual({ ok: true, errors: [] });

    // Before landing, the sign reverses: the retiree must still be there. These READY
    // assertions are also the mutant control for the LANDED guard — widening that arm
    // makes the surviving-symbol observation below flip from green to red.
    write(root, retireePath, retireeSource);
    expect(retireAtStatus(retiring, 'READY')).toEqual({ ok: true, errors: [] });
    write(root, retireePath, 'export const successor = true;\n');
    expect(errorText(retireAtStatus(retiring, 'READY'))).toContain(
      `retiredSymbols[0].symbol is already absent from ${retireePath} before READY: ${retireeSymbol}`,
    );
    rmSync(join(root, retireePath));
    expect(errorText(retireAtStatus(retiring, 'READY'))).toContain(
      `retiredSymbols[0].path does not exist: ${retireePath}`,
    );

    // SUPERSEDED asserts in neither direction: the replacement may have removed the
    // symbol, preserved it, or deleted its entire file before this packet did anything.
    write(root, retireePath, retireeSource);
    expect(retireAtStatus(retiring, 'SUPERSEDED')).toEqual({ ok: true, errors: [] });
    write(root, retireePath, 'export const successor = true;\n');
    expect(retireAtStatus(retiring, 'SUPERSEDED')).toEqual({ ok: true, errors: [] });
    rmSync(join(root, retireePath));
    expect(retireAtStatus(retiring, 'SUPERSEDED')).toEqual({ ok: true, errors: [] });

    // Malformed declarations report once and never throw or cascade into a status check.
    const malformedRows = [
      ['not-an-array', 'P-1.retiredSymbols must be an array when present'],
      [[null], 'P-1.retiredSymbols[0] must be an object'],
      [[{ path: 'src/*.js', symbol: retireeSymbol }],
        'P-1.retiredSymbols[0].path must not contain glob or NUL characters'],
      [[{ path: '/tmp/retiree.js', symbol: retireeSymbol }],
        'P-1.retiredSymbols[0].path must be repository-relative'],
      [[{ path: retireePath, symbol: '   ' }],
        'P-1.retiredSymbols[0].symbol must be a non-blank string'],
      [[{ path: retireePath, symbol: 7 }],
        'P-1.retiredSymbols[0].symbol must be a non-blank string'],
    ];
    for (const [rows, expectedError] of malformedRows) {
      const malformed = clone(manifest);
      malformed.packets[0].retiredSymbols = rows;
      expect(retireAtStatus(malformed, 'READY').errors).toEqual([expectedError]);
    }

    write(root, retireePath, retireeSource);
    const duplicate = clone(manifest);
    duplicate.packets[0].retiredSymbols = [
      { path: retireePath, symbol: retireeSymbol },
      { path: retireePath, symbol: retireeSymbol },
    ];
    expect(retireAtStatus(duplicate, 'READY').errors).toEqual([
      `P-1 contains duplicate retired symbol: ${retireePath} :: ${retireeSymbol}`,
    ]);

    // The two declarations are disjoint at every status, and the contradiction is the
    // row's sole error because it is not then also evaluated as a retirement assertion.
    const contradictory = clone(manifest);
    contradictory.packets[0].retiredSymbols = [{
      path: 'src/alpha.js',
      symbol: 'alphaFeature',
    }];
    for (const status of ['DRAFT', 'READY', 'BLOCKED', 'LANDED', 'STALE', 'SUPERSEDED']) {
      expect(retireAtStatus(contradictory, status).errors).toEqual([
        'P-1 names src/alpha.js :: alphaFeature as BOTH required and retired',
      ]);
    }
  });

  it('discharges an earlier required symbol only when a LANDED packet retires that exact pair', () => {
    // ── THE FIRST CROSS-PACKET RETIREMENT COLLISION, PLANTED (ODQ §379 / §379.2) ──────
    // Four LANDED packets pinned `FIXED_SURVEY_LIGHT_V1` in requiredSymbols — enforced at
    // EVERY status by deliberate design — while MF-T2G was authorized to retire it. The
    // required/retired cross-check is WITHIN one packet only, so read literally
    // retiredSymbols was unusable for any symbol a landed packet had ever named, and the
    // first collision had to be cured by surgery on the older rows. The pair below is that
    // collision by name; what it pins is that the rows may now STAY and be discharged.
    const LIGHT_PATH = 'src/domain/townMap/fabric/projection.js';
    const RETIRED = 'FIXED_SURVEY_LIGHT_V1';
    const SURVIVOR = 'export function firstSliceScreenDrawOps';
    const NEVER_RETIRED = 'FIXED_SURVEY_LIGHT_V2';
    // The tree AFTER the authorized retirement: the retiree is gone, its siblings remain.
    write(root, LIGHT_PATH, `${SURVIVOR}() { return []; }\n`);

    /**
     * P-1 is the OLDER LANDED packet whose requiredSymbols named the retiree; P-2 is the
     * retiring packet, whose status is the variable under test.
     * @param {string} retirerStatus @param {Array<{path:string,symbol:string}>} extraRequired
     */
    const planted = (retirerStatus, extraRequired = []) => {
      const candidate = clone(manifest);
      candidate.packets[0].status = 'LANDED';
      candidate.packets[0].requiredSymbols.push(
        { path: LIGHT_PATH, symbol: RETIRED },
        { path: LIGHT_PATH, symbol: SURVIVOR },
        ...extraRequired,
      );
      candidate.packets[1].status = retirerStatus;
      candidate.packets[1].retiredSymbols = [{ path: LIGHT_PATH, symbol: RETIRED }];
      write(root, INDEX_PATH, [
        '| Packet | Status |',
        '|---|---|',
        '| [P-1](./packets/P-1.md) | LANDED |',
        `| [P-2](./packets/P-2.md) | ${retirerStatus} |`,
      ].join('\n'));
      write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'LANDED'));
      write(root, 'docs/implementation/packets/P-2.md', packetMarkdown('P-2', retirerStatus));
      return validatePacketManifest(candidate, { rootDir: root });
    };

    // DIRECTION 1 — the discharge fires: the older packet's row survives its own retirement.
    expect(planted('LANDED')).toEqual({ ok: true, errors: [] });

    // DIRECTION 2 — existence enforcement is NOT weakened. A symbol nobody retired still
    // reds from the same packet, in the same run, alongside the discharged row.
    const undischarged = planted('LANDED', [{ path: LIGHT_PATH, symbol: NEVER_RETIRED }]);
    expect(undischarged.ok).toBe(false);
    expect(undischarged.errors).toEqual([
      `P-1.requiredSymbols[3].symbol is missing from ${LIGHT_PATH}: ${NEVER_RETIRED}`,
    ]);

    // DIRECTION 3 — only LANDED discharges. SUPERSEDED is the clean discriminator: it is
    // terminal, so it asserts in NEITHER direction and contributes no error of its own,
    // yet it is not the authorized removal, so the older row reds exactly as before.
    expect(planted('SUPERSEDED').errors).toEqual([
      `P-1.requiredSymbols[1].symbol is missing from ${LIGHT_PATH}: ${RETIRED}`,
    ]);

    // A retirement that deleted the whole file discharges too — otherwise the row stays
    // permanently red under a different message and the law is half a law.
    const fileDeleted = clone(manifest);
    fileDeleted.packets[0].status = 'LANDED';
    fileDeleted.packets[0].requiredSymbols.push({ path: LIGHT_PATH, symbol: RETIRED });
    fileDeleted.packets[1].status = 'LANDED';
    fileDeleted.packets[1].retiredSymbols = [{ path: LIGHT_PATH, symbol: RETIRED }];
    write(root, INDEX_PATH, [
      '| Packet | Status |', '|---|---|',
      '| [P-1](./packets/P-1.md) | LANDED |', '| [P-2](./packets/P-2.md) | LANDED |',
    ].join('\n'));
    write(root, 'docs/implementation/packets/P-2.md', packetMarkdown('P-2', 'LANDED'));
    rmSync(join(root, LIGHT_PATH));
    expect(validatePacketManifest(fileDeleted, { rootDir: root })).toEqual({ ok: true, errors: [] });

    // A packet that names one pair as BOTH required and retired contributes NO discharge:
    // the contradiction is its own error, and a red manifest may not silence a live guard
    // in a different packet. P-2 self-contradicts; P-1's identical row must still red.
    write(root, LIGHT_PATH, `${SURVIVOR}() { return []; }\n`);
    const selfContradicting = clone(manifest);
    selfContradicting.packets[0].status = 'LANDED';
    selfContradicting.packets[0].requiredSymbols.push({ path: LIGHT_PATH, symbol: RETIRED });
    selfContradicting.packets[1].status = 'LANDED';
    selfContradicting.packets[1].requiredSymbols = [{ path: LIGHT_PATH, symbol: RETIRED }];
    selfContradicting.packets[1].retiredSymbols = [{ path: LIGHT_PATH, symbol: RETIRED }];
    expect(validatePacketManifest(selfContradicting, { rootDir: root }).errors).toEqual([
      `P-1.requiredSymbols[1].symbol is missing from ${LIGHT_PATH}: ${RETIRED}`,
      `P-2 names ${LIGHT_PATH} :: ${RETIRED} as BOTH required and retired`,
      `P-2.requiredSymbols[0].symbol is missing from ${LIGHT_PATH}: ${RETIRED}`,
    ]);

    // ROW STYLE IS IRRELEVANT BY CONSTRUCTION, asserted rather than assumed: the manifest
    // carries the retirement rows in an expanded multi-line form in the thousands and a
    // one-line compact form in the hundreds. Serialized both ways through the real file
    // reader, the verdict is identical — the discharge reads PARSED rows, so a future
    // text-level tool is the only place style can bite, and such a tool must refuse rather
    // than guess on a form it cannot parse.
    write(root, LIGHT_PATH, `${SURVIVOR}() { return []; }\n`);
    const both = clone(manifest);
    both.packets[0].status = 'LANDED';
    both.packets[0].requiredSymbols.push({ path: LIGHT_PATH, symbol: RETIRED });
    both.packets[1].status = 'LANDED';
    both.packets[1].retiredSymbols = [{ path: LIGHT_PATH, symbol: RETIRED }];
    const expanded = JSON.stringify(both, null, 2);
    const compact = expanded.replace(
      /\{\n\s+"path": "([^"]+)",\n\s+"symbol": "([^"]+)"\n\s+\}/g,
      (_all, p, s) => `{ "path": "${p}", "symbol": "${s}" }`,
    );
    expect(compact).not.toBe(expanded);
    for (const serialized of [expanded, compact]) {
      write(root, MANIFEST_PATH, `${serialized}\n`);
      const loaded = loadPacketManifest({ rootDir: root });
      expect(validatePacketManifest(loaded, { rootDir: root })).toEqual({ ok: true, errors: [] });
    }
  });

  it('emits a deterministic hash-bearing READY capsule with exact symbol evidence', () => {
    manifest.packets[0].changeManifest.push({ action: 'CREATE', path: 'src/future.js' });
    const first = buildCodingCapsule(manifest, 'P-1', { rootDir: root });
    const second = buildCodingCapsule(manifest, 'P-1', { rootDir: root });
    const exactPacketText = packetMarkdown('P-1', 'READY');
    const exactPacketBytes = Buffer.from(exactPacketText, 'utf8');
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    // The toMatchObject immediately below pins `first` field by field (schemaVersion,
    // id, packetMarkdown bytes, changeManifest…), so this serialization cannot be the
    // empty or undefined string the absence would otherwise accept.
    // anchored: `first` is pinned field-by-field by the toMatchObject below
    expect(JSON.stringify(first)).not.toMatch(/timestamp|generatedAt|createdAt/i);
    expect(first).toMatchObject({
      schemaVersion: 1,
      id: 'P-1',
      status: 'READY',
      packetPath: 'docs/implementation/packets/P-1.md',
      verifiedBase: BASE,
      verifiedBranch: 'fixture',
      authorityNotice: PACKET_AUTHORITY_NOTICE,
      packetMarkdown: {
        text: exactPacketText,
        byteLength: exactPacketBytes.length,
        sha256: createHash('sha256').update(exactPacketBytes).digest('hex'),
      },
      changeManifest: manifest.packets[0].changeManifest,
      acceptanceCases: manifest.packets[0].acceptanceCases,
      checks: manifest.packets[0].checks,
    });
    const alphaHash = first.fileHashes.find((row) => row.path === 'src/alpha.js');
    const expectedHash = createHash('sha256')
      .update('const before = 1;\nexport function alphaFeature(value) {\n  return value + before;\n}\nconst after = 2;\n')
      .digest('hex');
    expect(alphaHash).toEqual({ path: 'src/alpha.js', exists: true, sha256: expectedHash });
    expect(first.fileHashes.find((row) => row.path === 'src/future.js'))
      .toEqual({ path: 'src/future.js', exists: false, sha256: null });
    expect(first.requiredSymbols[0]).toMatchObject({
      path: 'src/alpha.js',
      symbol: 'alphaFeature',
      line: 2,
      startLine: 1,
      endLine: 4,
    });
    expect(first.requiredSymbols[0].text).toContain('export function alphaFeature');
    expect(first.retiredSymbols).toEqual([]);
    const { capsuleDigest, ...digestFree } = first;
    expect(capsuleDigest).toBe(
      createHash('sha256').update(canonicalSerialize(digestFree)).digest('hex'),
    );
    expect(capsuleDigestOf(first)).toBe(capsuleDigest);
    expect(verifyCodingCapsule(first)).toBe(true);
    expect(canonicalSerialize({ z: 1, a: { y: 2, x: 3 } }))
      .toBe('{"a":{"x":3,"y":2},"z":1}');
    expect(extractSymbolExcerpt('one\ntarget\nthree', 'target', 1)).toEqual({
      line: 2,
      startLine: 1,
      endLine: 3,
      text: 'one\ntarget\nthree',
    });
  });

  it('rejects digest tampering and non-blank-field repair by re-digesting', () => {
    const original = buildCodingCapsule(manifest, 'P-1', { rootDir: root });

    const digestTamper = clone(original);
    digestTamper.acceptanceCases[0].case = 'Silently broadened behavior.';
    expect(() => verifyCodingCapsule(digestTamper)).toThrow(/capsule digest/);

    const blankBranch = { ...clone(original), verifiedBranch: '   ' };
    blankBranch.capsuleDigest = capsuleDigestOf(blankBranch);
    expect(() => verifyCodingCapsule(blankBranch)).toThrow(/verifiedBranch.*non-blank/);

    const alteredNotice = { ...clone(original), authorityNotice: 'Design files may expand scope.' };
    alteredNotice.capsuleDigest = capsuleDigestOf(alteredNotice);
    expect(() => verifyCodingCapsule(alteredNotice)).toThrow(/authority notice/);

    const alteredPacket = clone(original);
    alteredPacket.packetMarkdown.text += '\nUnauthorized instruction.\n';
    alteredPacket.capsuleDigest = capsuleDigestOf(alteredPacket);
    expect(() => verifyCodingCapsule(alteredPacket)).toThrow(/byte length|SHA-256/);

    const wrongHeading = clone(original);
    wrongHeading.packetMarkdown.text = wrongHeading.packetMarkdown.text.replace('P-1', 'Z-9');
    wrongHeading.packetMarkdown.byteLength = Buffer.byteLength(wrongHeading.packetMarkdown.text);
    wrongHeading.packetMarkdown.sha256 = createHash('sha256').update(wrongHeading.packetMarkdown.text).digest('hex');
    wrongHeading.fileHashes.find(({ path }) => path === wrongHeading.packetPath).sha256 = wrongHeading.packetMarkdown.sha256;
    wrongHeading.capsuleDigest = capsuleDigestOf(wrongHeading);
    expect(() => verifyCodingCapsule(wrongHeading)).toThrow(/authority disagrees/);
  });

  it('refuses BLOCKED capsules and exposes validate/capsule CLI modes without process mutation', () => {
    expect(() => buildCodingCapsule(manifest, 'P-2', { rootDir: root }))
      .toThrow('packet P-2 is not READY');
    let stdout = '';
    let stderr = '';
    const streams = {
      stdout: { write: (chunk) => { stdout += String(chunk); } },
      stderr: { write: (chunk) => { stderr += String(chunk); } },
    };
    expect(runImplementationPacketsCli(['validate'], { rootDir: root, ...streams })).toBe(0);
    expect(stdout).toContain('2 packets (1 READY)');
    expect(stderr).toBe('');
    stdout = '';
    expect(runImplementationPacketsCli(['capsule', 'P-1'], { rootDir: root, ...streams })).toBe(0);
    expect(JSON.parse(stdout)).toMatchObject({ id: 'P-1', status: 'READY' });
    stdout = '';
    expect(runImplementationPacketsCli(['capsule', 'P-2'], { rootDir: root, ...streams })).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toContain('packet P-2 is not READY');
  });

  // ── HK-3 (chair ruling, ODQ §455) — THE MOVING-HEAD REFUSAL ───────────────────────────
  // WEB-1 pinned `docs/DEPLOY.md` :: `197_consent_person_adjacent_default.sql` — the
  // CURRENT migration head, quoted in a doc, inside a LANDED packet. The row was true on the
  // day it was written and became a trap the moment the next migration landed: WEB-2 hit it.
  // The estate already carried the general law (never put a re-recorded FIGURE in
  // requiredSymbols); this arm is the machinery for the one shape that has actually bitten.
  it('reds a requiredSymbols row that pins a migration FILENAME in a doc, and only that shape', () => {
    write(root, 'docs/DEPLOY.md', [
      '# Deploy runbook',
      '',
      '**Current migration head: `197_consent_person_adjacent_default.sql`** (this moves).',
      '',
      'The stable anchor a packet may pin instead: Current migration head',
      '',
    ].join('\n'));
    write(root, 'supabase/migrations/197_consent_person_adjacent_default.sql',
      '-- @rollback: documented-manual-reversal\nalter table consent_change_records add column v int;\n');

    /** @param {{ path: string, symbol: string }} extraRow */
    const withRow = (extraRow) => {
      const candidate = clone(manifest);
      candidate.packets[0].requiredSymbols.push(extraRow);
      return validatePacketManifest(candidate, { rootDir: root });
    };

    // THE CLEAN CONTROL FIRST — without it a refusal proves nothing about this arm, only
    // that the fixture is broken somewhere.
    expect(validatePacketManifest(manifest, { rootDir: root })).toEqual({ ok: true, errors: [] });

    // THE POSITIVE CONTROL: the exact row HK-3 deleted from WEB-1, replanted.
    const planted = withRow({ path: 'docs/DEPLOY.md', symbol: '197_consent_person_adjacent_default.sql' });
    expect(planted.ok).toBe(false);
    expect(errorText(planted)).toContain('pins a MIGRATION FILENAME in a doc');
    expect(errorText(planted)).toContain('197_consent_person_adjacent_default.sql');
    // …and the refusal is about the ROW'S SHAPE, so it fires even though the doc really does
    // contain the string today. That is the whole point: the row was wrong when it was true.
    expect(readFileSync(join(root, 'docs/DEPLOY.md'), 'utf8'))
      .toContain('197_consent_person_adjacent_default.sql');

    // THE THREE NEGATIVE CONTROLS, so the arm cannot be a blanket refusal of anything .sql:
    //   a) the migration FILE pinned at its own path is the correct, stable spelling;
    //   b) a stable doc anchor in the same doc is untouched;
    //   c) a migration filename quoted inside a longer symbol against a NON-docs path — the
    //      live estate's one instance of the shape (TM-2A's frozen SIM_METRIC_MIGRATIONS
    //      roster) — is a correct pin and must stay green.
    write(root, 'tests/lint/engineTelemetryWall.walker.test.js',
      "const SIM_METRIC_MIGRATIONS = Object.freeze(['supabase/migrations/196_world_sim_metrics.sql']);\n");
    for (const row of [
      { path: 'supabase/migrations/197_consent_person_adjacent_default.sql', symbol: 'consent_change_records' },
      { path: 'docs/DEPLOY.md', symbol: 'Current migration head' },
      {
        path: 'tests/lint/engineTelemetryWall.walker.test.js',
        symbol: "const SIM_METRIC_MIGRATIONS = Object.freeze(['supabase/migrations/196_world_sim_metrics.sql']);",
      },
    ]) {
      expect(withRow(row), `${row.path} :: ${row.symbol} must NOT be refused`)
        .toEqual({ ok: true, errors: [] });
    }

    // AND THE LIVE MANIFEST, which is the claim the deletion actually makes: no estate row
    // carries this shape any more. Read from the repository rather than from the fixture.
    const live = loadPacketManifest();
    expect(validatePacketManifest(live, {}).errors
      .filter((message) => message.includes('pins a MIGRATION FILENAME in a doc')))
      .toEqual([]);
    // …and the population this arm governs is pinned as a FLOOR, because a refusal over an
    // empty subject proves nothing (the empty-population class): the estate really does
    // carry docs-path requiredSymbols rows for this guard to be silent ABOUT.
    const docRows = live.packets.flatMap((packet) => (packet.requiredSymbols ?? [])
      .filter((symbolRow) => String(symbolRow.path).startsWith('docs/')));
    expect(docRows.length, 'no packet pins a docs path at all — the guard has no live subject')
      .toBeGreaterThan(0);
  });

  // ── HK-5 (ODQ §879.11 R4; §479.2 read PACKET-scoped) — THE MOVING-HEAD REFUSAL, FIGURE FORM ─
  // HK-3 above catches the head spelled as a FILENAME. The same defect has a second spelling
  // it cannot see: the head quoted as a bare FIGURE. Both specimens are live in the estate's
  // own documents right now — docs/CURRENT_STATE.md:5 "migrations are contiguous to 200" and
  // ARCHITECTURE.md:269 "**migrations/** (200)" — and a packet that pinned either would trap
  // every later migration member exactly as WEB-1's filename row trapped WEB-2.
  // ⚠ THE TABLES BELOW ARE `for` LOOPS INSIDE ONE `it` BODY, DELIBERATELY. A negative-controls
  // table is the ordinary shape a per-row vitest table is written in, and the lighting walker
  // PARKS a whole file on that shape: this file would lose all seventeen of its credited
  // titles and move the literal-table park ceiling off its zero headroom. This file's own idiom
  // (:187, :245, :294, and HK-3's arm above) is the loop in the body; it is kept.
  it('reds a requiredSymbols row that pins a migration HEAD FIGURE on a §479.2 path, and only that shape', () => {
    write(root, 'docs/CURRENT_STATE.md', [
      '# Current state',
      '',
      '> Migrations are contiguous to 198 at the repository head.',
      '',
      'The stable anchor a packet may pin instead: Migrations are contiguous at the repository head',
      '',
      'Unrelated prose that carries a three-digit figure: 311 static route documents.',
      '',
    ].join('\n'));
    write(root, 'ARCHITECTURE.md', [
      '# Architecture',
      '',
      '- **migrations/** (198) — prod applied head tracked in `supabase/applied-head.json`.',
      '',
    ].join('\n'));
    write(root, 'tests/lint/migrationTrainWall.walker.test.js',
      'const MIGRATION_TRAIN_REPO_HEAD = 198;\n');

    /** @param {{ path: string, symbol: string }} extraRow */
    const withRow = (extraRow) => {
      const candidate = clone(manifest);
      candidate.packets[0].requiredSymbols.push(extraRow);
      return validatePacketManifest(candidate, { rootDir: root });
    };

    // THE CLEAN CONTROL FIRST — without it a refusal proves nothing about this arm, only that
    // the fixture is broken somewhere.
    expect(validatePacketManifest(manifest, { rootDir: root })).toEqual({ ok: true, errors: [] });

    // THE POSITIVE CONTROL HK-5 EXISTS FOR: the contiguity claim, replanted against the doc
    // that really carries it. Note the doc DOES contain the string — the refusal is about the
    // row's shape, so it fires while the figure is still current, which is the whole point.
    const planted = withRow({ path: 'docs/CURRENT_STATE.md', symbol: 'contiguous to 198' });
    expect(planted.ok).toBe(false);
    expect(errorText(planted)).toContain('pins a MIGRATION HEAD FIGURE');
    expect(errorText(planted)).toContain('contiguous to 198');
    expect(errorText(planted)).toContain('docs/CURRENT_STATE.md');
    expect(readFileSync(join(root, 'docs/CURRENT_STATE.md'), 'utf8')).toContain('contiguous to 198');

    // EVERY SHAPE IN THE ROSTER, each on a §479.2 path, each refused and each naming its row.
    for (const row of [
      { path: 'docs/CURRENT_STATE.md', symbol: '198' },
      { path: 'docs/CURRENT_STATE.md', symbol: 'Migrations are contiguous to 198 at the repository head.' },
      { path: 'ARCHITECTURE.md', symbol: '**migrations/** (198)' },
      { path: 'docs/DEPLOY.md', symbol: 'MIGRATION_TRAIN_REPO_HEAD = 198' },
      { path: 'docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md', symbol: 'rehearse against head 198' },
      { path: 'scripts/ops/migrationRehearsalCore.mjs', symbol: 'MIGRATION_TRAIN_REPO_HEAD = 198' },
    ]) {
      const result = withRow(row);
      expect(result.ok, `${row.path} :: ${row.symbol} must be refused`).toBe(false);
      expect(errorText(result)).toContain('pins a MIGRATION HEAD FIGURE');
      expect(errorText(result), 'the refusal must name the offending row').toContain(row.symbol);
    }

    // THE NEGATIVE CONTROLS, so the arm cannot be a blanket refusal of anything with digits:
    //   a) a real stable anchor in the same doc, which is the spelling the message prescribes;
    //   b) a three-digit figure in prose that is not a migration head at all;
    //   c) the frozen head constant pinned at a path OUTSIDE the four — in scope for HK-3's
    //      sibling rule and correct here, because §479.2 is packet-scoped, not doc-scoped;
    //   d) the migration FILE pinned at its own path, which is the correct stable spelling and
    //      is HK-3's business, not this arm's.
    write(root, 'supabase/migrations/198_referral_funnel_report.sql',
      '-- @rollback: documented-manual-reversal\nalter table referrals add column v int;\n');
    for (const row of [
      { path: 'docs/CURRENT_STATE.md', symbol: 'Migrations are contiguous at the repository head' },
      { path: 'docs/CURRENT_STATE.md', symbol: 'Unrelated prose that carries a three-digit figure: 311 static route documents.' },
      { path: 'tests/lint/migrationTrainWall.walker.test.js', symbol: 'const MIGRATION_TRAIN_REPO_HEAD = 198;' },
      { path: 'supabase/migrations/198_referral_funnel_report.sql', symbol: 'referrals' },
    ]) {
      expect(withRow(row), `${row.path} :: ${row.symbol} must NOT be refused`)
        .toEqual({ ok: true, errors: [] });
    }

    // AND THE LIVE MANIFEST — the claim the guard actually makes about the estate. Read from
    // the repository, not from the fixture.
    const live = loadPacketManifest();
    expect(validatePacketManifest(live, {}).errors
      .filter((message) => message.includes('pins a MIGRATION HEAD FIGURE')))
      .toEqual([]);
    // …with the population pinned as a FLOOR, because a refusal over an empty subject proves
    // nothing: the estate really does pin rows on these four paths for this guard to be silent
    // ABOUT, and it really does carry docs-path rows besides.
    const governed = live.packets.flatMap((packet) => (packet.requiredSymbols ?? [])
      .filter((symbolRow) => [
        'docs/DEPLOY.md',
        'ARCHITECTURE.md',
        'docs/CURRENT_STATE.md',
        'scripts/ops/migrationRehearsalCore.mjs',
        'docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md',
      ].includes(String(symbolRow.path))));
    expect(governed.length, 'no packet pins any §479.2 path — the guard has no live subject')
      .toBeGreaterThan(0);
  });

  // ── §731.3 (owner ruling ODQ §731, charter §11.5) — THE RETIREMENT PATH ───────────────
  // Every existence and verbatim assertion in this validator was written on a premise
  // nobody had stated: that the codebase only ever GROWS. The owner's order to strip the
  // legacy settlement map (ODQ §725) was the first authorized REMOVAL large enough to break
  // it — six LANDED packets went red across 22 rows naming files the deletion had removed,
  // and not one was a defect the packet's author could repair. `retiredBy` discharges
  // exactly those assertions, one declared row at a time, and is REFUSED unless it cites the
  // ledger § that authorized the removal.
  it('discharges a row whose subject an authorized ruling removed, and refuses an uncited retirement', () => {
    const GONE = 'src/deletedByRuling.js';
    const REF = '§725/§731';

    /** @param {(candidate: ReturnType<typeof canonicalManifest>) => void} mutate */
    const withManifest = (mutate) => {
      const candidate = clone(manifest);
      mutate(candidate);
      return validatePacketManifest(candidate, { rootDir: root });
    };

    /**
     * The same, with P-1 flipped to LANDED in all three places the status lives — and put
     * BACK before returning. The restore is load-bearing rather than tidy: the status lives
     * in two on-disk fixture files as well as in the manifest object, so a LANDED probe that
     * left them behind would red every later READY probe in this test with a status
     * disagreement that has nothing to do with retirement. (It did, on the first run.)
     */
    const withLandedManifest = (mutate) => {
      const indexRow = (status) => [
        '| Packet | Status |', '|---|---|',
        `| [P-1](./packets/P-1.md) | ${status} |`, '| [P-2](./packets/P-2.md) | BLOCKED |',
      ].join('\n');
      write(root, INDEX_PATH, indexRow('LANDED'));
      write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'LANDED'));
      try {
        return withManifest((candidate) => { candidate.packets[0].status = 'LANDED'; mutate(candidate); });
      } finally {
        write(root, INDEX_PATH, indexRow('READY'));
        write(root, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'READY'));
      }
    };

    // THE CLEAN CONTROL FIRST — without it a refusal below proves only that the fixture broke.
    expect(validatePacketManifest(manifest, { rootDir: root })).toEqual({ ok: true, errors: [] });

    // ⭐ NEGATIVE CONTROL 1 — a deleted-path row WITHOUT `retiredBy` must STILL red. This is
    // what stops the annotation becoming a blanket amnesty: rows are discharged one declared
    // row at a time, never wholesale, and an undeclared deletion is still a defect.
    const unannotated = withManifest((candidate) => {
      candidate.packets[0].changeManifest.push({ action: 'MODIFY', path: GONE });
      candidate.packets[0].requiredSymbols.push({ path: GONE, symbol: 'goneFeature' });
    });
    expect(unannotated.ok).toBe(false);
    expect(errorText(unannotated)).toContain(`does not exist for MODIFY: ${GONE}`);
    expect(errorText(unannotated)).toContain(`requiredSymbols[1].path does not exist: ${GONE}`);

    // …and the SAME two rows, annotated, pass. Only the existence assertions moved.
    expect(withManifest((candidate) => {
      candidate.packets[0].changeManifest.push({ action: 'MODIFY', path: GONE, retiredBy: REF });
      candidate.packets[0].requiredSymbols.push({ path: GONE, symbol: 'goneFeature', retiredBy: REF });
    })).toEqual({ ok: true, errors: [] });

    // BOTH other discharged assertions, each proved against its own un-annotated control:
    //   a) the LANDED CREATE arm (a landed promise whose file the ruling later removed);
    //   b) the VERBATIM arm (the file survives, the pinned symbol did not) — the AO-6/GVF-1
    //      shape, where a shrink-only ratchet pinned by a landed packet could never shrink.
    const landedCreate = { action: 'CREATE', path: GONE };
    expect(errorText(withLandedManifest((candidate) => {
      candidate.packets[0].changeManifest.push({ ...landedCreate });
    }))).toContain(`does not exist for LANDED CREATE: ${GONE}`);
    expect(withLandedManifest((candidate) => {
      candidate.packets[0].changeManifest.push({ ...landedCreate, retiredBy: REF });
    })).toEqual({ ok: true, errors: [] });

    const movedFigure = { path: 'src/alpha.js', symbol: 'const before = 1;' };
    expect(errorText(withManifest((candidate) => {
      candidate.packets[0].requiredSymbols.push({ ...movedFigure, symbol: 'const before = 99;' });
    }))).toContain('symbol is missing from src/alpha.js');
    expect(withManifest((candidate) => {
      candidate.packets[0].requiredSymbols.push({ ...movedFigure, symbol: 'const before = 99;', retiredBy: REF });
    })).toEqual({ ok: true, errors: [] });
    // Anchored: the row above really is a live pin when it is NOT retired — the same symbol,
    // spelled as the file actually carries it, is green with no annotation at all.
    expect(withManifest((candidate) => {
      candidate.packets[0].requiredSymbols.push({ ...movedFigure });
    })).toEqual({ ok: true, errors: [] });

    // ⭐ NEGATIVE CONTROL 2 — a retirement that cites NO ledger § is REFUSED, and, because an
    // uncited retirement must never buy the silence it was refused for, the existence check
    // it tried to discharge STILL fires. Half-formed annotations discharge nothing.
    for (const uncited of ['the map strip', 'section 731', '§', 'ODQ 731']) {
      const refused = withManifest((candidate) => {
        candidate.packets[0].changeManifest.push({ action: 'MODIFY', path: GONE, retiredBy: uncited });
      });
      expect(refused.ok, `retiredBy ${JSON.stringify(uncited)} must be refused`).toBe(false);
      expect(errorText(refused)).toContain('cites no ledger section');
      expect(errorText(refused), 'an uncited retirement must not discharge the check')
        .toContain(`does not exist for MODIFY: ${GONE}`);
    }
    // The malformed-shape half of the same fence, on both row kinds.
    for (const malformed of [{ retiredBy: '' }, { retiredBy: '   ' }, { retiredBy: 731 }, { retiredBy: null }]) {
      const bad = withManifest((candidate) => {
        candidate.packets[0].changeManifest.push({ action: 'MODIFY', path: GONE, ...malformed });
        candidate.packets[0].requiredSymbols.push({ path: GONE, symbol: 'goneFeature', ...malformed });
      });
      expect(bad.ok, `retiredBy ${JSON.stringify(malformed.retiredBy)} must be refused`).toBe(false);
      expect(errorText(bad)).toContain('.retiredBy must be a non-blank string');
      expect(errorText(bad)).toContain(`does not exist for MODIFY: ${GONE}`);
      expect(errorText(bad)).toContain(`requiredSymbols[1].path does not exist: ${GONE}`);
    }

    // ⛔ AND THE ROW'S OWN SHAPE IS NOT RETIRABLE. A retirement is a statement about the
    // TREE; a malformed row is wrong on every tree, so glob paths, unknown actions,
    // duplicate keys and the HK-3 moving-head refusal all survive the annotation.
    const shapeStillRed = withManifest((candidate) => {
      candidate.packets[0].changeManifest.push(
        { action: 'MODIFY', path: 'src/*.js', retiredBy: REF },
        { action: 'NONSENSE', path: GONE, retiredBy: REF },
      );
      candidate.packets[0].requiredSymbols.push(
        { path: GONE, symbol: 'goneFeature', retiredBy: REF },
        { path: GONE, symbol: 'goneFeature', retiredBy: REF },
        { path: 'docs/DEPLOY.md', symbol: '197_consent_person_adjacent_default.sql', retiredBy: REF },
      );
    });
    expect(shapeStillRed.ok).toBe(false);
    expect(errorText(shapeStillRed)).toContain('must not contain glob');
    expect(errorText(shapeStillRed)).toContain('action is unknown: NONSENSE');
    expect(errorText(shapeStillRed)).toContain('contains duplicate required symbol');
    expect(errorText(shapeStillRed)).toContain('pins a MIGRATION FILENAME in a doc');

    // THE LIVE MANIFEST — the claim this lane actually makes. The estate is green, and the
    // population the path governs is pinned as a FLOOR, because a discharge over an empty
    // subject proves nothing (the empty-population class): real rows really are annotated.
    const live = loadPacketManifest();
    expect(validatePacketManifest(live, {})).toEqual({ ok: true, errors: [] });
    const retiredRows = live.packets.flatMap((packet) => [
      ...(packet.changeManifest ?? []), ...(packet.requiredSymbols ?? []),
    ].filter((row) => row.retiredBy !== undefined));
    expect(retiredRows.length, 'no estate row is annotated — the path has no live subject')
      .toBeGreaterThan(0);
    // Every live annotation cites a §; none is a bare truthy string that slipped past.
    expect(retiredRows.filter((row) => !/§\d+/.test(String(row.retiredBy)))).toEqual([]);
  });

  // ── §7.4 (chair ruling, ODQ §934.47 addendum 84) — THE SEALED-BURN EXEMPTION ─────────
  // The non-terminal retiree rule assumed the retiree survives until the packet lands. It
  // does not, in the one case the estate actually ships: a packet whose change manifest
  // orders its own retiree burned, while `validate` sits inside that same packet's sealed
  // `checks`. EM-B1f proved the manifest and the packet's own gate mutually unsatisfiable
  // while READY, three ways, and stopped rather than improvise.
  //
  // THE DISCRIMINATOR IS THE SEAL, AND THIS ARM MINTS A REAL ONE. The seal is written by
  // `createImplementationSession`, which refuses to write anything until this very
  // validator is green — so the seal cannot exist unless the retiree was PRESENT at
  // dispatch. Hand-rolling the envelope here would have proved only that the reader agrees
  // with the test's idea of the writer; minting it through the shipped writer is what pins
  // the two halves together, and it is why this arm carries a Git worktree of its own.
  //
  // ⚠ THE TABLE BELOW IS A `for` LOOP INSIDE ONE `it` BODY, for this file's standing reason
  // (see the HK-5 arm above): a per-row vitest table would PARK the whole file in the
  // lighting walker and cost it every credited title it has.
  it('⭐ lets one live seal license the burn of the retiree its own packet ordered burned', () => {
    const RETIREE_PATH = 'src/retiree.js';
    const RETIREE_SYMBOL = 'const UNDISPOSITIONED_CEILING = 7';
    const BURNED = 'const UNDISPOSITIONED_CEILING = 6;\n';

    // THE CONSTANT AGREEMENT, PINNED RATHER THAN ASSUMED. The envelope version belongs to
    // implementation-session.mjs, which imports FROM the validator and so cannot be
    // imported back without a cycle. The duplicate is therefore held honest here: if the
    // session ever bumps its schema, this reds instead of the reader silently going blind
    // and every sealed burn quietly turning back into a refusal.
    expect(SEAL_ENVELOPE_SCHEMA_VERSION).toBe(SESSION_SCHEMA_VERSION);

    // A tree that is not a Git worktree at all has no seal, and fails CLOSED.
    expect(readDispatchSeal(root, 'P-1')).toBeNull();

    sealRoot = realpathSync(mkdtempSync(join(tmpdir(), 'settlementforge-seal-')));
    const repo = sealRoot;
    /** @param {string[]} args */
    const git = (args) => execFileSync('git', args, {
      cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();

    git(['init', '-q', '-b', 'fixture']);
    git(['config', 'user.email', 'fixture@example.test']);
    git(['config', 'user.name', 'Fixture']);
    git(['config', 'commit.gpgsign', 'false']);
    write(repo, 'src/alpha.js', 'export function alphaFeature() { return 1; }\n');
    write(repo, RETIREE_PATH, `${RETIREE_SYMBOL};\n`);
    git(['add', '.']);
    git(['commit', '-q', '-m', 'fixture base']);
    const base = git(['rev-parse', 'HEAD']);

    /** @param {string} status */
    const sealedManifest = (status) => ({
      schemaVersion: 1,
      indexPath: INDEX_PATH,
      packets: [{
        id: 'P-1',
        status,
        packetPath: 'docs/implementation/packets/P-1.md',
        verifiedBase: base,
        changeManifest: [{ action: 'MODIFY', path: RETIREE_PATH }],
        requiredSymbols: [{ path: 'src/alpha.js', symbol: 'alphaFeature' }],
        retiredSymbols: [{ path: RETIREE_PATH, symbol: RETIREE_SYMBOL }],
        acceptanceCases: [{ id: 'A1', case: 'The ceiling is burned, never padded.' }],
        checks: [['node', 'scripts/implementation-packets.mjs', 'validate']],
      }],
    });

    const sealed = sealedManifest('READY');
    write(repo, INDEX_PATH, [
      '| Packet | Status |', '|---|---|', '| [P-1](./packets/P-1.md) | **READY** |', '',
    ].join('\n'));
    write(repo, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'READY', base));
    write(repo, MANIFEST_PATH, `${JSON.stringify(sealed, null, 2)}\n`);
    git(['add', '.']);
    git(['commit', '-q', '-m', 'packet authority']);
    const head = git(['rev-parse', 'HEAD']);

    /** @param {ReturnType<typeof sealedManifest>} candidate */
    const validateSealed = (candidate) => {
      /** @type {string[]} */
      const notes = [];
      const result = validatePacketManifest(candidate, {
        rootDir: repo, onNote: (note) => { notes.push(note); },
      });
      return { ...result, notes };
    };

    // ── STATE (a) — the retiree is PRESENT and there is no seal at all: valid. This is the
    // clean control; without it every refusal below would prove only that the fixture broke.
    expect(readDispatchSeal(repo, 'P-1')).toBeNull();
    expect(validateSealed(sealed)).toEqual({ ok: true, errors: [], notes: [] });

    // ── STATE (b) — the retiree is BURNED with nothing licensing it. The placement is
    // stale, and the refusal is the one the estate already shipped, spelled EXACTLY as
    // before: this arm is also the pin that the cure did not quietly reword state (b).
    write(repo, RETIREE_PATH, BURNED);
    const unlicensed = validateSealed(sealed);
    expect(unlicensed.errors).toEqual([
      `P-1.retiredSymbols[0].symbol is already absent from ${RETIREE_PATH} before READY: ${RETIREE_SYMBOL}`,
    ]);
    expect(unlicensed.notes).toEqual([]);

    // ── THE SEAL IS MINTED BY THE SHIPPED WRITER, and it can only be minted because the
    // retiree is put back first: `createImplementationSession` runs this validator and
    // refuses to write a seal over a red manifest. That refusal IS the receipt the
    // exemption rests on, so it is asserted rather than described.
    write(repo, RETIREE_PATH, `${RETIREE_SYMBOL};\n`);
    const session = createImplementationSession({ rootDir: repo, packetId: 'P-1' });
    const sealFile = session.sealPath;
    const sealBytes = readFileSync(sealFile);
    expect(session.seal.head).toBe(head);
    expect(readDispatchSeal(repo, 'P-1'))
      .toEqual({ digest: session.sealDigest, head, gitDir: session.gitDir });

    // …and with the retiree still standing, the live seal changes NOTHING: no note, no
    // error. The exemption speaks only where the refusal was about to be raised.
    expect(validateSealed(sealed)).toEqual({ ok: true, errors: [], notes: [] });

    // ── STATE (c) — THE CURE. The sealed build burns its own retiree, exactly as its change
    // manifest ordered, and the manifest is VALID with a note naming the real seal.
    write(repo, RETIREE_PATH, BURNED);
    const licensed = validateSealed(sealed);
    expect(licensed.ok).toBe(true);
    expect(licensed.errors).toEqual([]);
    expect(licensed.notes).toEqual([
      `P-1.retiredSymbols[0].symbol: retiree burned under seal ${session.sealDigest}`
      + ` (bound HEAD ${head}): ${RETIREE_SYMBOL}`,
    ]);
    // The CLI is what an operator and the gate actually read, so the note must reach stdout
    // on a run that exits 0 — a note nobody prints is a silence, not an exemption.
    let stdout = '';
    let stderr = '';
    expect(runImplementationPacketsCli(['validate'], {
      rootDir: repo,
      stdout: { write: (chunk) => { stdout += String(chunk); } },
      stderr: { write: (chunk) => { stderr += String(chunk); } },
    })).toBe(0);
    expect(stdout).toContain(`note: P-1.retiredSymbols[0].symbol: retiree burned under seal ${session.sealDigest}`);
    expect(stdout).toContain('valid: 1 packets (1 READY)');
    expect(stderr).toBe('');

    // ── THE COUNTERFORCES. Each rewrites the seal on disk, validates, and puts the exact
    // bytes back. A seal that is not THIS packet's, not THIS worktree's, not the payload
    // its digest was taken over, or not bound to a commit this tree ever reached licenses
    // NOTHING — and only the stale-HEAD row is still a readable seal, which is why it alone
    // gets to name itself in the refusal instead of vanishing into the ordinary message.
    const orphan = git(['commit-tree', git(['hash-object', '-t', 'tree', '/dev/null']), '-m', 'orphan']);
    const plainRefusal = `P-1.retiredSymbols[0].symbol is already absent from ${RETIREE_PATH} before READY: ${RETIREE_SYMBOL}`;
    const counterforces = [
      {
        what: 'a HEAD forged to a real commit this tree never reached',
        mutate: (payload) => { payload.head = orphan; },
        recompute: true,
        readable: true,
        message: `${plainRefusal} — dispatch seal `,
        alsoNames: orphan,
      },
      {
        what: 'a HEAD that names no object at all',
        mutate: (payload) => { payload.head = 'f'.repeat(40); },
        recompute: true,
        readable: true,
        message: `${plainRefusal} — dispatch seal `,
        alsoNames: 'is not an ancestor',
      },
      {
        what: 'a payload edited AFTER the digest was taken',
        mutate: (payload) => { payload.verifiedBase = 'b'.repeat(40); },
        recompute: false,
        readable: false,
        message: plainRefusal,
        alsoNames: null,
      },
      {
        what: 'a well-formed seal belonging to a different packet',
        mutate: (payload) => { payload.id = 'P-9'; },
        recompute: true,
        readable: false,
        message: plainRefusal,
        alsoNames: null,
      },
      {
        what: 'a seal copied in from another worktree',
        mutate: (payload) => { payload.gitDir = join(repo, 'elsewhere', '.git'); },
        recompute: true,
        readable: false,
        message: plainRefusal,
        alsoNames: null,
      },
    ];
    for (const counterforce of counterforces) {
      const envelope = JSON.parse(readFileSync(sealFile, 'utf8'));
      counterforce.mutate(envelope.payload);
      if (counterforce.recompute) {
        envelope.integrityDigest = sha256(canonicalSerialize({
          schemaVersion: envelope.schemaVersion, payload: envelope.payload,
        }));
      }
      writeFileSync(sealFile, `${JSON.stringify(envelope, null, 2)}\n`);
      const refused = validateSealed(sealed);
      expect(refused.ok, `${counterforce.what} must license nothing`).toBe(false);
      expect(refused.notes, `${counterforce.what} must emit no note`).toEqual([]);
      expect(refused.errors.length, `${counterforce.what} must red exactly once`).toBe(1);
      expect(refused.errors[0], counterforce.what).toContain(counterforce.message);
      if (counterforce.alsoNames) expect(refused.errors[0]).toContain(counterforce.alsoNames);
      expect(Boolean(readDispatchSeal(repo, 'P-1')), `${counterforce.what} readability`)
        .toBe(counterforce.readable);
      writeFileSync(sealFile, sealBytes);
    }

    // The restore is load-bearing, not tidy: the exact original bytes must still license
    // the burn, which proves the loop above measured the mutations and not a broken seal.
    expect(validateSealed(sealed).ok).toBe(true);

    // ⛔ AND THE EXEMPTION IS SCOPED TO THE ONE ARM IT WAS RULED FOR. A seal does not
    // discharge a missing FILE, a missing requiredSymbol, or a LANDED retirement whose
    // symbol survived; each of those reds with the seal sitting right there, live.
    const missingFile = sealedManifest('READY');
    missingFile.packets[0].retiredSymbols[0].path = 'src/never-written.js';
    expect(validateSealed(missingFile).errors).toEqual([
      'P-1.retiredSymbols[0].path does not exist: src/never-written.js',
    ]);
    const missingSymbol = sealedManifest('READY');
    missingSymbol.packets[0].requiredSymbols[0].symbol = 'notActuallyExported';
    expect(validateSealed(missingSymbol).errors).toEqual([
      'P-1.requiredSymbols[0].symbol is missing from src/alpha.js: notActuallyExported',
    ]);
    write(repo, RETIREE_PATH, `${RETIREE_SYMBOL};\n`);
    const landed = sealedManifest('LANDED');
    write(repo, INDEX_PATH, [
      '| Packet | Status |', '|---|---|', '| [P-1](./packets/P-1.md) | **LANDED** |', '',
    ].join('\n'));
    write(repo, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', 'LANDED', base));
    const survived = validateSealed(landed);
    expect(survived.notes).toEqual([]);
    expect(survived.errors).toEqual([
      `P-1.retiredSymbols[0].symbol survives in ${RETIREE_PATH} for LANDED retirement: ${RETIREE_SYMBOL}`,
    ]);
  });

  // ── §379.2b (chair ruling, judgment 88; TOOL-29) — THE SEAL-AWARE CROSS-PACKET DISCHARGE ──
  // TOOL-19 above taught the OWN-retiree rule the seal. Nothing taught §379.2's CROSS-PACKET
  // discharge the same lesson: its loop opens `rawPacket.status !== 'LANDED'`, so only a LANDED
  // retirement answers ANOTHER packet's requiredSymbols rows. A sealed build that moves a symbol
  // a LANDED packet requires therefore cannot pass `validate`, `check:packet` or `resume` after
  // its own edits — measured on EM-P4's estate: with a VALID seal live, the packet's own half
  // went quiet and SIX cross-packet errors survived, which is the whole distance between a
  // buildable packet and an unbuildable one.
  //
  // THE FIXTURE IS THAT COLLISION IN MINIATURE. P-0 is the older LANDED packet whose
  // requiredSymbols names the retiree; P-1 is the READY packet that retires it and whose sealed
  // build burns it. Both halves must go quiet for the tree to be valid, and every fence that
  // licenses the first must license the second — which is why the counterforces below assert the
  // CROSS-PACKET refusal exactly, and the own-retiree refusal only as its companion.
  //
  // ⚠ ONE `it` WITH `for` LOOPS INSIDE, for this file's standing reason (see TOOL-19's arm
  // above): a per-row vitest table would PARK the whole file in the lighting walker and cost it
  // every credited title it has.
  it('⭐ lets one live seal discharge the requiredSymbols row ANOTHER packet holds on its retiree', () => {
    const RETIREE_PATH = 'src/retiree.js';
    const RETIREE_SYMBOL = 'const UNDISPOSITIONED_CEILING = 7';
    const STANDING = `${RETIREE_SYMBOL};\n`;
    const BURNED = 'const UNDISPOSITIONED_CEILING = 6;\n';
    const NEVER_RETIRED = 'const UNDISPOSITIONED_FLOOR = 1';

    sealRoot = realpathSync(mkdtempSync(join(tmpdir(), 'settlementforge-cross-')));
    const repo = sealRoot;
    /** @param {string[]} args */
    const git = (args) => execFileSync('git', args, {
      cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();

    git(['init', '-q', '-b', 'fixture']);
    git(['config', 'user.email', 'fixture@example.test']);
    git(['config', 'user.name', 'Fixture']);
    git(['config', 'commit.gpgsign', 'false']);
    write(repo, 'src/alpha.js', 'export function alphaFeature() { return 1; }\n');
    write(repo, RETIREE_PATH, STANDING);
    git(['add', '.']);
    git(['commit', '-q', '-m', 'fixture base']);
    const base = git(['rev-parse', 'HEAD']);

    /**
     * @param {string} retirerStatus P-1's status, the variable under test
     * @param {Array<{path:string,symbol:string}>} [extraRequired] rows added to P-0
     */
    const crossManifest = (retirerStatus, extraRequired = []) => ({
      schemaVersion: 1,
      indexPath: INDEX_PATH,
      packets: [
        {
          id: 'P-0',
          status: 'LANDED',
          packetPath: 'docs/implementation/packets/P-0.md',
          verifiedBase: base,
          changeManifest: [{ action: 'MODIFY', path: RETIREE_PATH }],
          requiredSymbols: [{ path: RETIREE_PATH, symbol: RETIREE_SYMBOL }, ...extraRequired],
          acceptanceCases: [{ id: 'A1', case: 'The ceiling was readable when this landed.' }],
          checks: [['node', 'scripts/implementation-packets.mjs', 'validate']],
        },
        {
          id: 'P-1',
          status: retirerStatus,
          packetPath: 'docs/implementation/packets/P-1.md',
          verifiedBase: base,
          changeManifest: [{ action: 'MODIFY', path: RETIREE_PATH }],
          requiredSymbols: [{ path: 'src/alpha.js', symbol: 'alphaFeature' }],
          retiredSymbols: [{ path: RETIREE_PATH, symbol: RETIREE_SYMBOL }],
          acceptanceCases: [{ id: 'A1', case: 'The ceiling is burned, never padded.' }],
          checks: [['node', 'scripts/implementation-packets.mjs', 'validate']],
        },
      ],
    });

    /** The index and P-1's own Markdown must agree with the status under test. */
    const placeStatus = (retirerStatus) => {
      write(repo, INDEX_PATH, [
        '| Packet | Status |', '|---|---|',
        '| [P-0](./packets/P-0.md) | **LANDED** |',
        `| [P-1](./packets/P-1.md) | **${retirerStatus}** |`, '',
      ].join('\n'));
      write(repo, 'docs/implementation/packets/P-0.md', packetMarkdown('P-0', 'LANDED', base));
      write(repo, 'docs/implementation/packets/P-1.md', packetMarkdown('P-1', retirerStatus, base));
    };

    placeStatus('READY');
    write(repo, MANIFEST_PATH, `${JSON.stringify(crossManifest('READY'), null, 2)}\n`);
    git(['add', '.']);
    git(['commit', '-q', '-m', 'packet authority']);
    const head = git(['rev-parse', 'HEAD']);

    /** @param {ReturnType<typeof crossManifest>} candidate */
    const validateCross = (candidate) => {
      /** @type {string[]} */
      const notes = [];
      const result = validatePacketManifest(candidate, {
        rootDir: repo, onNote: (note) => { notes.push(note); },
      });
      return { ...result, notes };
    };

    const crossed = crossManifest('READY');
    const crossRefusal = `P-0.requiredSymbols[0].symbol is missing from ${RETIREE_PATH}: ${RETIREE_SYMBOL}`;
    const ownRefusal = `P-1.retiredSymbols[0].symbol is already absent from ${RETIREE_PATH} before READY: ${RETIREE_SYMBOL}`;

    // ── STATE (a) — the retiree STANDS and there is no seal: valid. The clean control, without
    // which every refusal below would prove only that the fixture broke.
    expect(readDispatchSeal(repo, 'P-1')).toBeNull();
    expect(validateCross(crossed)).toEqual({ ok: true, errors: [], notes: [] });

    // ── STATE (b) — the retiree is BURNED with nothing licensing it, and BOTH halves refuse,
    // spelled EXACTLY as the estate already spells them. This is also the pin that the cure
    // reworded neither sentence.
    write(repo, RETIREE_PATH, BURNED);
    const unlicensed = validateCross(crossed);
    expect(unlicensed.errors).toEqual([crossRefusal, ownRefusal]);
    expect(unlicensed.notes).toEqual([]);

    // ── THE SEAL IS MINTED BY THE SHIPPED WRITER, which runs this very validator and refuses to
    // write over a red manifest — so the retiree is put back first, and that refusal is the
    // receipt the whole exemption rests on.
    write(repo, RETIREE_PATH, STANDING);
    const session = createImplementationSession({ rootDir: repo, packetId: 'P-1' });
    const sealFile = session.sealPath;
    const sealBytes = readFileSync(sealFile);
    expect(session.seal.head).toBe(head);

    // …and with the retiree still standing, the live seal changes NOTHING in either half.
    expect(validateCross(crossed)).toEqual({ ok: true, errors: [], notes: [] });

    // ── STATE (c) — THE CURE, AND EM-P4'S SCENARIO IN MINIATURE. The sealed build burns the
    // retiree its own change manifest ordered burned; P-0's row is answered as a NOTE that names
    // the sealing packet and says what it becomes at the flip; the tree is VALID.
    write(repo, RETIREE_PATH, BURNED);
    const crossNote = `P-0.requiredSymbols[0].symbol: discharged by P-1's SEALED READY retirement`
      + ` under seal ${session.sealDigest} (bound HEAD ${head}): ${RETIREE_SYMBOL}`
      + ' — an ordinary §379.2 LANDED discharge the moment P-1 flips.';
    const ownNote = `P-1.retiredSymbols[0].symbol: retiree burned under seal ${session.sealDigest}`
      + ` (bound HEAD ${head}): ${RETIREE_SYMBOL}`;
    const licensed = validateCross(crossed);
    expect(licensed.errors).toEqual([]);
    expect(licensed.ok).toBe(true);
    // Emission order is the packet loop's order — P-0's requiredSymbols before P-1's
    // retiredSymbols — and it is asserted rather than sorted so a silent reorder is visible.
    expect(licensed.notes).toEqual([crossNote, ownNote]);

    // The CLI is what an operator and the gate actually read, so BOTH notes must reach stdout on
    // a run that exits 0: a note nobody prints is a silence, not a discharge.
    let stdout = '';
    let stderr = '';
    expect(runImplementationPacketsCli(['validate'], {
      rootDir: repo,
      stdout: { write: (chunk) => { stdout += String(chunk); } },
      stderr: { write: (chunk) => { stderr += String(chunk); } },
    })).toBe(0);
    expect(stdout).toContain(`note: ${crossNote}`);
    expect(stdout).toContain(`note: ${ownNote}`);
    expect(stdout).toContain('valid: 2 packets (1 READY)');
    expect(stderr).toBe('');

    // ── THE FIVE COUNTERFORCES, each by the name the ruling gives it. Every one puts the
    // CROSS-PACKET refusal back verbatim and emits no note at all; the own-retiree refusal rides
    // along as its companion, and only the stale-HEAD row gets to name its seal in the sentence.
    const orphan = git(['commit-tree', git(['hash-object', '-t', 'tree', '/dev/null']), '-m', 'orphan']);
    const counterforces = [
      {
        what: 'READY with NO seal at all',
        mutate: null,
        recompute: false,
        companion: ownRefusal,
        alsoNames: null,
      },
      {
        what: 'a STALE seal whose payload was edited after its digest was taken',
        mutate: (payload) => { payload.verifiedBase = 'b'.repeat(40); },
        recompute: false,
        companion: ownRefusal,
        alsoNames: null,
      },
      {
        what: "a FOREIGN packet's seal",
        mutate: (payload) => { payload.id = 'P-9'; },
        recompute: true,
        companion: ownRefusal,
        alsoNames: null,
      },
      {
        what: "ANOTHER worktree's git dir",
        mutate: (payload) => { payload.gitDir = join(repo, 'elsewhere', '.git'); },
        recompute: true,
        companion: ownRefusal,
        alsoNames: null,
      },
      {
        what: 'a sealed head that is NOT an ancestor of this tree HEAD',
        mutate: (payload) => { payload.head = orphan; },
        recompute: true,
        companion: `${ownRefusal} — dispatch seal `,
        alsoNames: orphan,
      },
    ];
    for (const counterforce of counterforces) {
      if (counterforce.mutate) {
        const envelope = JSON.parse(readFileSync(sealFile, 'utf8'));
        counterforce.mutate(envelope.payload);
        if (counterforce.recompute) {
          envelope.integrityDigest = sha256(canonicalSerialize({
            schemaVersion: envelope.schemaVersion, payload: envelope.payload,
          }));
        }
        writeFileSync(sealFile, `${JSON.stringify(envelope, null, 2)}\n`);
      } else rmSync(sealFile);
      const refused = validateCross(crossed);
      expect(refused.ok, `${counterforce.what} must license nothing`).toBe(false);
      expect(refused.notes, `${counterforce.what} must emit no note`).toEqual([]);
      expect(refused.errors.length, `${counterforce.what} reds both halves`).toBe(2);
      expect(refused.errors[0], `${counterforce.what} — the cross-packet row`).toBe(crossRefusal);
      expect(refused.errors[1], `${counterforce.what} — the own-retiree row`)
        .toContain(counterforce.companion);
      if (counterforce.alsoNames) expect(refused.errors[1]).toContain(counterforce.alsoNames);
      writeFileSync(sealFile, sealBytes);
    }

    // The restore is load-bearing, not tidy: the exact original bytes must still license both
    // halves, which proves the loop measured the mutations and not a broken seal.
    expect(validateCross(crossed)).toEqual({ ok: true, errors: [], notes: [crossNote, ownNote] });

    // ── ⛔ DRAFT NEVER DISCHARGES, and it is the sharpest discriminator the estate has: §7.4 is
    // blind to which non-terminal status a packet holds, so the live seal still licenses P-1's
    // OWN burn at DRAFT — while the cross-packet row comes straight back. A promise may not
    // silence another packet's live guard, and only the READY promise is a dispatchable one.
    placeStatus('DRAFT');
    const drafted = validateCross(crossManifest('DRAFT'));
    expect(drafted.errors).toEqual([crossRefusal]);
    expect(drafted.notes).toEqual([ownNote]);
    placeStatus('READY');

    // ── ⛔ A PACKET NAMING ONE PAIR AS BOTH REQUIRED AND RETIRED CONTRIBUTES NO DISCHARGE, seal
    // or no seal. The contradiction is convicted BY NAME, and a red manifest may not go on to
    // silence a live guard in a different packet.
    const contradictory = crossManifest('READY');
    contradictory.packets[1].requiredSymbols.push({ path: RETIREE_PATH, symbol: RETIREE_SYMBOL });
    const selfConvicted = validateCross(contradictory);
    expect(selfConvicted.notes).toEqual([]);
    expect(selfConvicted.errors).toEqual([
      crossRefusal,
      `P-1 names ${RETIREE_PATH} :: ${RETIREE_SYMBOL} as BOTH required and retired`,
      `P-1.requiredSymbols[1].symbol is missing from ${RETIREE_PATH}: ${RETIREE_SYMBOL}`,
    ]);

    // ── ⛔ EXISTENCE ENFORCEMENT IS NOT WEAKENED. A symbol NOBODY retired still reds from the
    // same packet, in the same run, beside the row the seal discharged.
    const undischarged = validateCross(crossManifest('READY', [
      { path: RETIREE_PATH, symbol: NEVER_RETIRED },
    ]));
    expect(undischarged.errors).toEqual([
      `P-0.requiredSymbols[1].symbol is missing from ${RETIREE_PATH}: ${NEVER_RETIRED}`,
    ]);
    expect(undischarged.notes).toEqual([crossNote, ownNote]);

    // ── ⛔ LANDED BEHAVIOUR IS BYTE-IDENTICAL. At the flip the discharge is the ordinary §379.2
    // one: valid, and NO note, because a landed retirement needs no seal and makes no promise.
    placeStatus('LANDED');
    expect(validateCross(crossManifest('LANDED')))
      .toEqual({ ok: true, errors: [], notes: [] });
  });
});
