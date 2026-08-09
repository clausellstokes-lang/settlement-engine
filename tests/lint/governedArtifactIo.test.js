import {
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

import {
  parseExactFlags,
  planExternalArtifactOutputs,
  publishJsonExclusive,
  publishTextExclusive,
} from '../../scripts/lib/governed-artifact-io.mjs';

const temporaryRoots = [];

function fixture() {
  const base = mkdtempSync(join(tmpdir(), 'governed-artifact-io-'));
  temporaryRoots.push(base);
  const root = join(base, 'repo');
  const external = join(base, 'external');
  mkdirSync(join(root, 'scripts'), { recursive: true });
  mkdirSync(join(external, 'nested'), { recursive: true });
  const input = join(external, 'input.json');
  const protectedPath = join(root, 'scripts', 'baseline.json');
  writeFileSync(input, 'input\n');
  writeFileSync(protectedPath, 'baseline\n');
  return { base, root, external, input, protectedPath };
}

function plan(paths, pathsFixture, overrides = {}) {
  return planExternalArtifactOutputs({
    root: pathsFixture.root,
    outputs: paths,
    inputs: [pathsFixture.input],
    protectedPaths: [pathsFixture.protectedPath],
    cwd: pathsFixture.root,
    ...overrides,
  });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('governed artifact output planning', () => {
  test('requires nonempty, distinct outputs outside the real repository root', () => {
    const paths = fixture();
    expect(() => planExternalArtifactOutputs({ root: paths.root, outputs: [] }))
      .toThrow(/at least one output/);
    expect(() => plan([''], paths)).toThrow(/nonempty filesystem path/);
    expect(() => plan([join(paths.root, 'report.json')], paths)).toThrow(/outside the repository/);
    expect(() => plan([
      join(paths.external, 'report.json'),
      join(paths.external, 'nested', '..', 'report.json'),
    ], paths)).toThrow(/duplicate normalized path/);
  });

  test('resolves parent symlinks before enforcing the repository boundary', () => {
    const paths = fixture();
    const externalLinkIntoRepo = join(paths.external, 'repo-link');
    symlinkSync(paths.root, externalLinkIntoRepo, 'dir');
    expect(() => plan([join(externalLinkIntoRepo, 'report.json')], paths))
      .toThrow(/outside the repository/);

    const repoLinkOutside = join(paths.root, 'outside-link');
    symlinkSync(paths.external, repoLinkOutside, 'dir');
    const [output] = plan([join(repoLinkOutside, 'allowed.json')], paths);
    expect(output.path).toBe(join(realpathSync(paths.external), 'allowed.json'));
  });

  test('rejects direct, normalized, symlink, and hardlink aliases', () => {
    const paths = fixture();
    expect(() => plan([paths.input], paths)).toThrow(/aliases a governed input/);
    expect(() => plan([join(dirname(paths.input), 'nested', '..', 'input.json')], paths))
      .toThrow(/aliases a governed input/);

    const symlinkOutput = join(paths.external, 'symlink-output.json');
    symlinkSync(paths.input, symlinkOutput);
    expect(() => plan([symlinkOutput], paths)).toThrow(/must not be an existing symlink/);

    const hardlinkOutput = join(paths.external, 'hardlink-output.json');
    linkSync(paths.protectedPath, hardlinkOutput);
    expect(() => plan([hardlinkOutput], paths)).toThrow(/hardlink alias/);
  });

  test('rejects existing regular and nonregular targets and missing parents', () => {
    const paths = fixture();
    const regular = join(paths.external, 'existing.json');
    const directory = join(paths.external, 'directory-output');
    writeFileSync(regular, 'held\n');
    mkdirSync(directory);
    expect(() => plan([regular], paths)).toThrow(/never overwrites/);
    expect(() => plan([directory], paths)).toThrow(/nonregular target/);
    expect(() => plan([join(paths.external, 'missing', 'out.json')], paths))
      .toThrow(/parent directory does not exist/);
  });
});

describe('governed artifact exclusive publication', () => {
  test('publishes complete text and JSON without leaving temporary files', () => {
    const paths = fixture();
    const textPath = join(paths.external, 'report.txt');
    const jsonPath = join(paths.external, 'report.json');
    const [textPlan, jsonPlan] = plan([textPath, jsonPath], paths);

    expect(publishTextExclusive(textPlan, 'complete evidence\n'))
      .toBe(join(realpathSync(paths.external), 'report.txt'));
    expect(publishJsonExclusive(jsonPlan, { z: 2, a: 1 }, {
      stringify: (value) => JSON.stringify(value),
    })).toBe(join(realpathSync(paths.external), 'report.json'));
    expect(readFileSync(textPath, 'utf8')).toBe('complete evidence\n');
    expect(readFileSync(jsonPath, 'utf8')).toBe('{"z":2,"a":1}\n');
    expect(readdirSync(paths.external).filter((name) => name.includes('.tmp-'))).toEqual([]);
  });

  test('refuses a target created after planning and preserves its bytes', () => {
    const paths = fixture();
    const outputPath = join(paths.external, 'raced.json');
    const [outputPlan] = plan([outputPath], paths);
    writeFileSync(outputPath, 'winner\n');

    expect(() => publishTextExclusive(outputPlan, 'loser\n')).toThrow(/refusing to overwrite/);
    expect(readFileSync(outputPath, 'utf8')).toBe('winner\n');
    expect(readdirSync(paths.external).filter((name) => name.includes('.tmp-'))).toEqual([]);
  });

  test('requires an opaque validated plan and never overwrites a published target', () => {
    const paths = fixture();
    const outputPath = join(paths.external, 'once.txt');
    const [outputPlan] = plan([outputPath], paths);
    expect(() => publishTextExclusive({ path: outputPath }, 'nope'))
      .toThrow(/requires a plan returned/);
    publishTextExclusive(outputPlan, 'first\n');
    expect(() => publishTextExclusive(outputPlan, 'second\n')).toThrow(/refusing to overwrite/);
    expect(readFileSync(outputPath, 'utf8')).toBe('first\n');
  });
});

describe('strict exact governed CLI parsing', () => {
  const definitions = {
    '--scan-only': { kind: 'flag', name: 'scanOnly' },
    '--write': { kind: 'flag', name: 'write' },
    '--report': { kind: 'flag', name: 'report' },
    '--migrate-schema=3': { kind: 'flag', name: 'migrateSchema3' },
    '--json': { kind: 'value', name: 'jsonPath' },
  };

  test('parses only exact declared spellings, including literal equals flags', () => {
    expect(parseExactFlags(['--scan-only', '--json=/tmp/a=b.json'], definitions)).toEqual({
      scanOnly: true,
      write: false,
      report: false,
      migrateSchema3: false,
      jsonPath: '/tmp/a=b.json',
    });
    expect(parseExactFlags(['--write', '--migrate-schema=3'], definitions)).toMatchObject({
      write: true,
      migrateSchema3: true,
    });
  });

  test('rejects unknown, missing, empty, valued-boolean, and duplicate flags', () => {
    expect(() => parseExactFlags(['--scan-onli'], definitions)).toThrow(/unknown/);
    expect(() => parseExactFlags(['--json'], definitions)).toThrow(/requires --name=value/);
    expect(() => parseExactFlags(['--json='], definitions)).toThrow(/nonempty value/);
    expect(() => parseExactFlags(['--json=   '], definitions)).toThrow(/nonempty value/);
    expect(() => parseExactFlags(['--scan-only=yes'], definitions)).toThrow(/does not accept a value/);
    expect(() => parseExactFlags(['--json=a', '--json=b'], definitions)).toThrow(/duplicate/);
    expect(() => parseExactFlags(['--write', '--write'], definitions)).toThrow(/duplicate/);
    expect(() => parseExactFlags(['--migrate-schema=2'], definitions)).toThrow(/unknown/);
  });

  test('rejects declared conflict groups', () => {
    expect(() => parseExactFlags(['--scan-only', '--write'], definitions, {
      conflicts: [['--scan-only', '--write', '--report']],
    })).toThrow(/conflicting/);
  });
});
