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
import { isolateFromHostRepo } from '../helpers/fixtureGit.js';

// git runs in throwaway folders here, and so do the library and CLIs under test: none may inherit the
// hook's GIT_DIR (tests/helpers/fixtureGit.js).
isolateFromHostRepo();

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
    // the second seat's 0b measure died on `${prev:+$prev/gm.json}${prev:-<fixture>}`, which concatenates both paths
    // when prev is set (ENOTDIR); the comparison base is chosen by an if/else now.
    expect(/\$\{prev:\+[^}]*\}\$\{prev:-/.test(block), 'no concatenated ${prev:+..}${prev:-..} base').toBe(false); // anchored: the planted control below proves this pattern fires
    expect(/\$\{prev:\+[^}]*\}\$\{prev:-/.test('--against "${prev:+$prev/gm.json}${prev:-$stage/x.json}"'), 'the planted control: the old form fires').toBe(true);
  });
});

/**
 * THE BUILD'S DOOR-PATH GUARD COMPARES CONTENT, NOT PATHS (the chair's ruling on PEOPLE-LAND's STOP at record 0b,
 * 2026-11-07). The W0 merge fc834a6bd touched ten door paths (its own five signed records' writes), each byte-identical
 * at the step and at the carry; the path-only guard STOPPED on them although the carry could hide nothing. The paired
 * controls run the live `guard` arm in a throwaway repository: identical touched paths are carried with one receipt
 * line each (NEGATIVE); a one-byte difference on one touched door path still STOPs with that path named (POSITIVE).
 * The chair's second ruling (the forward stack's first merge step whose door paths a landing record has since moved):
 * a later move of a touched door path is carried when the step's bytes went forward unchanged until it and every later
 * toucher carries `Owner-Signed:` (control d, the W0 case after record 0a); an unsigned later edit STOPs naming that
 * commit (control c).
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
    expect(r.stderr).not.toMatch(/STOP/); // anchored: the same stderr carries the two receipt lines asserted below
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
    expect(r.stderr).toMatch(/STOP: step \S+ touched door paths; the carry would overwrite them:\ntests\/fixtures\/h\.json \(first unsigned toucher [0-9a-f]{9}\)\n/);
    expect(r.stderr, 'the equal path is carried, not listed').toMatch(/carried: tests\/fixtures\/g\.json/);
    expect(r.stderr.split('STOP')[1]).not.toMatch(/g\.json/); // anchored: the STOP list names only the differing path
  });

  test('control (c): an unsigned later edit of a touched door path STOPs, naming that commit', () => {
    const { dir, git, step } = repo();
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":9}\n');
    git('commit', '-qam', 'an unsigned edit of g');
    const bad = git('rev-parse', '--short=9', 'HEAD');
    const r = run('sh', [script, 'guard', step], dir);
    rmSync(dir, { recursive: true, force: true });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(`tests/fixtures/g.json (first unsigned toucher ${bad})`);
  });

  test('control (d): a signed later move of a touched door path carries with the receipt line (the W0 case)', () => {
    const { dir, git, step } = repo();
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":3}\n');
    git('commit', '-qam', 'record 0a act\n\nOwner-Signed: §934.105');
    const signed = git('rev-parse', '--short=9', 'HEAD');
    const r = run('sh', [script, 'guard', step], dir);
    rmSync(dir, { recursive: true, force: true });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stderr).toContain(`door path touched by the step, moved after it only by signed records — carried: tests/fixtures/g.json (${signed})`);
    expect(r.stderr).toContain('door path touched by the step, equal to the carry — carried: tests/fixtures/h.json');
  });

  // THE INTEGRATION MERGE'S ARM (the chair's ruling on MERGE-CAR's STOP at 572c15018, 2026-11-08): LANDING_STAGE_MERGE_SIDE
  // names ONE merge on the first-parent line; a door path moved after the step only by signed first-parent commits and by
  // that merge — which took its SECOND parent's bytes whole — is carried; a merge that hand-edits the path STOPs.
  function mergeRepo({ handEdit = false } = {}) {
    const r0 = repo();
    const { dir, git, step } = r0;
    git('checkout', '-q', '-b', 'side');
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":5}\n'); // the side lane's own (unsigned) move of g
    git('commit', '-qam', 'a lane move of g');
    const side = git('rev-parse', 'HEAD');
    git('checkout', '-q', '-'); // back to the first-parent line
    git('commit', '-q', '--allow-empty', '-m', 'the line moves on');
    git('merge', '-q', '--no-ff', '--no-commit', 'side');
    if (handEdit) writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":6}\n'); // the merge hand-edits the door path
    git('add', '-A');
    git('commit', '-q', '-m', 'merge(integration): the side lane, its door paths taken whole');
    return { ...r0, side, merge: git('rev-parse', 'HEAD') };
  }

  test('merge arm, red-first: without the arm a door path moved behind a merge STOPs; named, a one-side-whole merge carries', () => {
    const { dir, step, merge, side } = mergeRepo();
    const before = run('sh', [script, 'guard', step], dir);
    const after = spawnSync('sh', [script, 'guard', step], { cwd: dir, encoding: 'utf8', env: { ...process.env, LANDING_STAGE_MERGE_SIDE: merge } });
    rmSync(dir, { recursive: true, force: true });
    expect(before.status).toBe(1);
    expect(before.stderr).toMatch(/STOP: step \S+ touched door paths/);
    expect(after.status, after.stderr).toBe(0);
    expect(after.stderr).toContain(`door path touched by the step, moved after it only by signed records and the integration merge ${merge.slice(0, 9)} (took its second parent ${side.slice(0, 9)}'s side whole) — carried: tests/fixtures/g.json`);
    expect(after.stderr).toContain('door path touched by the step, equal to the carry — carried: tests/fixtures/h.json'); // anchored: the equal path keeps its own receipt
  });

  test('merge arm NEGATIVE: a named merge that hand-edits the door path STOPs, naming the merge', () => {
    const { dir, step, merge } = mergeRepo({ handEdit: true });
    const r = spawnSync('sh', [script, 'guard', step], { cwd: dir, encoding: 'utf8', env: { ...process.env, LANDING_STAGE_MERGE_SIDE: merge } });
    rmSync(dir, { recursive: true, force: true });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(`tests/fixtures/g.json (the named merge ${merge.slice(0, 9)} hand-edits it: its bytes differ from its second parent's)`);
  });

  // TOOLING vs GOLDEN door paths (the chair's ruling on MERGE-CAR's STOP at record B, 2026-11-08): a tooling path (the
  // explicit list in landing-stage.sh :: is_tooling_path) is ALWAYS carried from the carry with a receipt naming every
  // commit that moved it since the step; a golden path keeps the signed rule.
  function toolingRepo() {
    const r0 = repo();
    const { dir, git } = r0;
    mkdirSync(join(dir, 'scripts'), { recursive: true });
    writeFileSync(join(dir, 'scripts/prose-manifest-cells.mjs'), 'export const V = 1;\n');
    git('add', '-A');
    git('commit', '-q', '-m', 'the tool arrives');
    writeFileSync(join(dir, 'scripts/prose-manifest-cells.mjs'), 'export const V = 2;\n');
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":7}\n');
    git('commit', '-qam', 'the step: a door write that also touches the tool');
    return { ...r0, step: git('rev-parse', 'HEAD') };
  }

  test('POSITIVE: a tooling path moved after the step by an UNSIGNED commit is carried, the receipt naming that commit', () => {
    const { dir, git, step } = toolingRepo();
    writeFileSync(join(dir, 'scripts/prose-manifest-cells.mjs'), 'export const V = 3;\n');
    git('commit', '-qam', 'an unsigned tooling commit');
    const tool = git('rev-parse', '--short=9', 'HEAD');
    const r = run('sh', [script, 'guard', step], dir);
    rmSync(dir, { recursive: true, force: true });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stderr).toContain(`tooling path carried from the carry — moved since the step by ${tool}: scripts/prose-manifest-cells.mjs`);
    expect(r.stderr).toContain('door path touched by the step, equal to the carry — carried: tests/fixtures/g.json'); // anchored: the golden path took its own rule
  });

  test('NEGATIVE: a GOLDEN path with an unsigned later toucher still STOPs beside a carried tooling path', () => {
    const { dir, git, step } = toolingRepo();
    writeFileSync(join(dir, 'scripts/prose-manifest-cells.mjs'), 'export const V = 3;\n');
    writeFileSync(join(dir, 'tests/fixtures/g.json'), '{"a":8}\n');
    git('commit', '-qam', 'an unsigned commit moving the tool and a golden');
    const bad = git('rev-parse', '--short=9', 'HEAD');
    const r = run('sh', [script, 'guard', step], dir);
    rmSync(dir, { recursive: true, force: true });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(`tests/fixtures/g.json (first unsigned toucher ${bad})`);
    expect(r.stderr).toContain(`tooling path carried from the carry — moved since the step by ${bad}: scripts/prose-manifest-cells.mjs`);
    expect(r.stderr.split('STOP')[1]).not.toMatch(/prose-manifest-cells/); // anchored: the tool is not on the STOP list
  });

  test('merge arm: a name that is not one merge on the first-parent line between the step and the carry STOPs', () => {
    const { dir, step, side } = mergeRepo();
    const notMerge = spawnSync('sh', [script, 'guard', step], { cwd: dir, encoding: 'utf8', env: { ...process.env, LANDING_STAGE_MERGE_SIDE: side } });
    const pattern = spawnSync('sh', [script, 'guard', step], { cwd: dir, encoding: 'utf8', env: { ...process.env, LANDING_STAGE_MERGE_SIDE: 'merge*' } });
    rmSync(dir, { recursive: true, force: true });
    expect(notMerge.status).toBe(1);
    expect(notMerge.stderr).toContain('does not name one merge commit');
    expect(pattern.status).toBe(1);
    expect(pattern.stderr).toContain('does not name one merge commit');
  });
});
