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
  buildCodingCapsule,
  extractSymbolExcerpt,
  packetPathProblem,
  parseIndexPacketStatuses,
  parsePacketHeader,
  runImplementationPacketsCli,
  validatePacketManifest,
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
    });
    const index = parseIndexPacketStatuses(
      '# Index\n| Packet | Status |\n|---|---|\n| [Alias](./packets/P-1.md) | READY |\n',
      INDEX_PATH,
    );
    expect([...index.statuses]).toEqual([['docs/implementation/packets/P-1.md', 'READY']]);
    expect(index.duplicates).toEqual([]);
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
  });

  it('emits a deterministic hash-bearing READY capsule with exact symbol evidence', () => {
    manifest.packets[0].changeManifest.push({ action: 'CREATE', path: 'src/future.js' });
    const first = buildCodingCapsule(manifest, 'P-1', { rootDir: root });
    const second = buildCodingCapsule(manifest, 'P-1', { rootDir: root });
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(JSON.stringify(first)).not.toMatch(/timestamp|generatedAt|createdAt/i);
    expect(first).toMatchObject({
      schemaVersion: 1,
      id: 'P-1',
      status: 'READY',
      packetPath: 'docs/implementation/packets/P-1.md',
      verifiedBase: BASE,
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
    expect(extractSymbolExcerpt('one\ntarget\nthree', 'target', 1)).toEqual({
      line: 2,
      startLine: 1,
      endLine: 3,
      text: 'one\ntarget\nthree',
    });
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
