/**
 * tests/scripts/landingStageMeasure.test.js — THE STAGE DRIVER'S `measure` READS ALL FIVE MOVED SURFACES.
 *
 * GOLDEN-REHEARSAL 2026-11-07 finding 2: `scripts/audit/landing-stage.sh measure` read 3 of the 5 surfaces the people
 * car moves (the 525, the herald desk, the fence) and the rehearsal measured the prose manifest, the witness and the
 * PDF snapshot by hand. The landing applied the rehearsal's proposed diff. This arm reads the live `measure` block and
 * counts the surfaces it measures; the planted control is the pre-landing block's three calls, which must count three.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const SURFACE_READERS = {
  'generator master (525)': /golden-master-stage\.mjs/,
  'herald desk': /herald-stage\.mjs/,
  'espionage fence': /refence\.mjs/,
  'prose manifest': /prose-manifest-cells\.mjs --out/,
  'PDF view-model snapshot': /goldenViewModel\.test\.js --update/,
};
const WITNESS = /witness-stage\.mjs/;

const surfacesRead = (block) => Object.entries(SURFACE_READERS).filter(([, re]) => re.test(block)).map(([name]) => name);

function measureBlock(text) {
  const from = text.indexOf('  measure)\n');
  const to = text.indexOf('  suites)\n');
  if (from === -1 || to === -1) throw new Error('landing-stage.sh carries no measure)/suites) arms');
  return text.slice(from, to);
}

describe('landing-stage.sh measure', () => {
  test('the planted control: the pre-landing measure block reads three surfaces, not five', () => {
    const before = [
      '  measure)',
      '    node "$here/scripts/audit/golden-master-stage.mjs" "$stage" --out "$out/gm.json"',
      '    node "$here/scripts/audit/herald-stage.mjs" "$stage" --out "$out/herald.json"',
      '    node "$here/scripts/audit/refence.mjs" "$stage" --rows-out "$out/fence.tsv"',
    ].join('\n');
    expect(surfacesRead(before)).toEqual(['generator master (525)', 'herald desk', 'espionage fence']);
  });

  test('the live block reads all five moved surfaces, the witness beside them, and chains stage to stage', () => {
    const block = measureBlock(readFileSync('scripts/audit/landing-stage.sh', 'utf8'));
    expect(surfacesRead(block)).toEqual(Object.keys(SURFACE_READERS));
    expect(WITNESS.test(block), 'the preset lighting witness is measured too').toBe(true);
    expect(/stage-chain\.mjs/.test(block), 'with a previous stage, every surface is compared stage to stage').toBe(true);
    expect(/\$prev\/gm\.json/.test(block), 'the 525 compares against the PREVIOUS stage, not the committed fixture').toBe(true);
  });
});

/**
 * THE BUILD'S DOOR-PATH GUARD COMPARES CONTENT, NOT PATHS (the chair's ruling on PEOPLE-LAND's STOP at record 0b,
 * 2026-11-07). The W0 merge fc834a6bd touched ten door paths (its own five signed records' writes), each byte-identical
 * at the step and at the carry; the path-only guard STOPPED on them although the carry could hide nothing. The paired
 * controls run the live `guard` arm in a throwaway repository: identical touched paths are carried with one receipt
 * line each (NEGATIVE); a one-byte difference on one touched door path still STOPs with that path named (POSITIVE).
 */
describe('landing-stage.sh build guard', () => {
  const run = (cmd, args, cwd) => spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  const script = resolve('scripts/audit/landing-stage.sh');

  function repo() {
    const dir = mkdtempSync(join(tmpdir(), 'stage-guard-'));
    const git = (...args) => { const r = run('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], dir); if (r.status !== 0) throw new Error(r.stderr); return r.stdout.trim(); };
    mkdirSync(join(dir, 'tests/fixtures'), { recursive: true });
    writeFileSync(join(dir, 'tests/fixtures/.golden-freeze-register.json'), JSON.stringify({ surfaces: [
      { surface: 'g', path: 'tests/fixtures/g.json', suite: 'tests/g.test.js' },
      { surface: 'h', path: 'tests/fixtures/h.json' },
    ] }));
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":1}\n');
    writeFileSync(join(dir, 'tests/fixtures/h.json'), '{"b":1}\n');
    git('init', '-q');
    git('add', '-A');
    git('commit', '-q', '-m', 'base');
    // the step: a signed door write on two door paths
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":2}\n');
    writeFileSync(join(dir, 'tests/fixtures/h.json'), '{"b":2}\n');
    git('commit', '-qam', 'step');
    return { dir, git, step: git('rev-parse', 'HEAD') };
  }

  test('NEGATIVE control: touched door paths equal to the carry are carried, one receipt line each, exit 0', () => {
    const { dir, git, step } = repo();
    git('commit', '-q', '--allow-empty', '-m', 'carry');
    const r = run('sh', [script, 'guard', step], dir);
    rmSync(dir, { recursive: true, force: true });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stderr).not.toMatch(/STOP/);
    expect(r.stderr.split('\n').filter((l) => l.startsWith('door path touched by the step, equal to the carry — carried: ')).sort())
      .toEqual([
        'door path touched by the step, equal to the carry — carried: tests/fixtures/g.json',
        'door path touched by the step, equal to the carry — carried: tests/fixtures/h.json',
      ]);
  });

  test('POSITIVE control: a planted one-byte difference on one touched door path still STOPs, that path named', () => {
    const { dir, git, step } = repo();
    writeFileSync(join(dir, 'tests/fixtures/h.json'), '{"b":3}\n');
    git('commit', '-qam', 'carry differs on h');
    const r = run('sh', [script, 'guard', step], dir);
    rmSync(dir, { recursive: true, force: true });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/STOP: step \S+ touched door paths; the carry would overwrite them:\ntests\/fixtures\/h\.json\n/);
    expect(r.stderr, 'the equal path is carried, not listed').toMatch(/carried: tests\/fixtures\/g\.json/);
    expect(r.stderr.split('STOP')[1]).not.toMatch(/g\.json/); // anchored: the STOP list names only the differing path
  });
});
