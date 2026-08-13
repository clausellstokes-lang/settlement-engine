import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  PACKET_AUTHORITY_NOTICE,
  buildCodingCapsule,
  canonicalSerialize,
  capsuleDigestOf,
  extractSymbolExcerpt,
  packetPathProblem,
  parseIndexPacketStatuses,
  parsePacketHeader,
  runImplementationPacketsCli,
  validatePacketManifest,
  verifyCodingCapsule,
} from '../../scripts/implementation-packets.mjs';

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

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'settlementforge-packets-'));
    manifest = canonicalManifest();
    materializeFixture(root, manifest);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
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
});
