#!/usr/bin/env node
/**
 * scripts/audit/landing-act.mjs — THE ACTS OF ONE SIGNED RECORD, RUN INSIDE ITS STAGE, THEN TRANSPLANTED TO THE BRANCH.
 *
 * THE METHOD (LANDING-3, proven; LANDING-4 put it on the tree). One signed shift record per moving first-parent step;
 * each surface it moves is one ACT. Inside the stage (scripts/audit/landing-stage.sh build), every act is a real door
 * run — the capture arm, or scripts/audit/door-write.mjs for the three surfaces with none — committed in the stage at
 * once, so the next act's dirty-tree check passes. The suite-file readings the write moves (the herald length, the
 * calibration suite's DUPLICATES and W8 ceilings, the SHIFT RECORD rows) are then edited BY HAND in the stage and
 * committed there; the plain re-run of every moved suite and the freeze walker at the stage is the receipt.
 * `transplant` then writes one branch commit per act: the act's manifest and register FROM ITS OWN STAGE COMMIT (so the
 * register sha at each commit is the door's), the act's suite file from the stage's final commit, and the message.
 *
 * ⛔ IT ADDS NO AUTHORITY. Every write is the door's (tests/helpers/goldenRecordDoor.js) with the signed record named;
 * a prediction miss writes nothing and this driver stops.
 *
 *   node scripts/audit/landing-act.mjs run        <config.json> [<surface> ...]   # door runs inside the stage
 *   node scripts/audit/landing-act.mjs figures    <config.json>                   # rows moved per logged act
 *   node scripts/audit/landing-act.mjs transplant <config.json>                   # one branch commit per act
 *
 * config.json: { n, stage, step, stepSubject, label, cause, record, carry, seat, session, receipt, receiptFiles,
 *   surfaces: [{ surface, rowsText, extra?: [lines] }], log }   (`log` is a scratch path the runs append to)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [mode, configPath, ...only] = process.argv.slice(2);
if (!mode || !configPath) {
  console.error('usage: landing-act.mjs run|transplant <config.json> [surface ...]');
  process.exit(2);
}
const cfg = JSON.parse(readFileSync(configPath, 'utf8'));
const here = process.cwd();
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
const git = (cwd, ...args) => sh('git', args, { cwd }).trim();
const register = (root) => JSON.parse(readFileSync(join(root, 'tests/fixtures/.golden-freeze-register.json'), 'utf8'));
const rowOf = (root, surface) => register(root).surfaces.find((s) => s.surface === surface);
const log = existsSync(cfg.log) ? JSON.parse(readFileSync(cfg.log, 'utf8')) : {};
const saveLog = () => writeFileSync(cfg.log, `${JSON.stringify(log, null, 2)}\n`);
const env = { ...process.env, GOLDEN_SHIFT_SIGNED: cfg.record };

/** Run a command that MUST fail by design with the door's RE-RECORDED line; return that line. */
function doorRun(cwd, cmd, args, extraEnv = {}) {
  let out;
  try {
    out = sh(cmd, args, { cwd, env: { ...env, ...extraEnv }, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    out = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  }
  const hit = out.match(/golden RE-RECORDED through the signed door[^\n]*?sha256 (\S+) -> ([0-9a-f]{64}); rows (\S+) -> (\S+?)\./);
  if (!hit) {
    console.error(out.split('\n').filter((l) => /REFUSED|Error|error/.test(l)).slice(0, 12).join('\n') || out.slice(-3000));
    throw new Error('the door did not report a re-record; nothing is committed for this act');
  }
  return { from: hit[1], to: hit[2], rowsFrom: hit[3], rowsTo: hit[4] };
}

function runAct(s) {
  const { stage } = cfg;
  const row = rowOf(stage, s.surface);
  let door;
  if (s.surface === 'espionage-dormancy-fence') {
    const block = join(cfg.scratch, `fence-block-${cfg.n}.txt`);
    const produced = join(cfg.scratch, `fence-${cfg.n}.js`);
    if (!existsSync(block)) throw new Error(`write the fence's movement block first: ${block}`);
    sh('node', [join(here, 'scripts/audit/refence.mjs'), stage, '--produce', produced, '--header', block]);
    door = doorRun(stage, 'node', ['scripts/audit/door-write.mjs', '--surface', s.surface, '--from', produced]);
  } else if (s.surface === 'preset-lighting-witness') {
    const produced = join(cfg.scratch, `witness-${cfg.n}.json`);
    sh('node', [join(here, 'scripts/audit/witness-stage.mjs'), stage, '--out', produced], { cwd: stage });
    door = doorRun(stage, 'node', ['scripts/audit/door-write.mjs', '--surface', s.surface, '--from', produced]);
  } else if (s.surface === 'pdf-golden-view-model-snapshot') {
    const snap = row.path;
    const produced = join(cfg.scratch, `pdf-${cfg.n}.snap`);
    try { sh('npx', ['vitest', 'run', row.suite, '--update'], { cwd: stage }); } catch { /* the matcher writes even when red */ }
    writeFileSync(produced, readFileSync(join(stage, snap), 'utf8'));
    git(stage, 'checkout', '--', snap);
    door = doorRun(stage, 'node', ['scripts/audit/door-write.mjs', '--surface', s.surface, '--from', produced]);
  } else if (s.surface === 'dossier-prose-manifest') {
    door = doorRun(stage, 'node', ['scripts/prose-manifest-cells.mjs', '--record']);
  } else {
    const flag = row.recordEnv ?? 'UPDATE_GOLDEN';
    door = doorRun(stage, 'npx', ['vitest', 'run', row.suite], { [flag]: '1' });
  }
  git(stage, 'add', '--', row.path, 'tests/fixtures/.golden-freeze-register.json', cfg.record);
  git(stage, '-c', 'user.name=stage', '-c', 'user.email=stage@local', 'commit', '-q', '--no-verify', '-m', `act: ${s.surface}`);
  log[s.surface] = { ...door, stageCommit: git(stage, 'rev-parse', 'HEAD'), path: row.path, suite: row.suite };
  saveLog();
  console.log(JSON.stringify({ surface: s.surface, ...door }));
}

const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
const TOTAL = { 'generator-golden-master': 525, 'cartography-calibration-corpus': 504, 'dossier-prose-manifest': 1050, 'espionage-dormancy-fence': 360 };
const NAMES = {
  'herald-knowledge-desk-golden': 'Herald knowledge-desk golden',
  'cartography-calibration-corpus': 'Cartography calibration corpus',
  'dossier-prose-manifest': 'Dossier prose manifest',
  'espionage-dormancy-fence': 'Espionage dormancy fence',
  'pdf-golden-view-model-snapshot': 'PDF golden view-model snapshot',
  'preset-lighting-witness': 'Preset lighting witness',
};

function transplant() {
  const step9 = cfg.step.slice(0, 9);
  const carry9 = cfg.carry.slice(0, 9);
  const stageFinal = git(cfg.stage, 'rev-parse', 'HEAD');
  const acts = cfg.surfaces;
  const k = acts.length + (cfg.provenance ? 1 : 0);
  let i = 0;
  const trailer = [
    '',
    'Owner-Signed: §934.105',
    `Seat: ${cfg.seat}`,
    'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
    `Claude-Session: ${cfg.session}`,
  ].join('\n');
  for (const s of acts) {
    if (s.surface === 'dossier-prose-manifest' && cfg.provenance) {
      // The provenance sentence lands ahead of its door, as the door demands a clean tree (precedent 29a4e541).
      git(here, 'checkout', stageFinal, '--', 'scripts/prose-manifest-cells.mjs');
      git(here, 'add', '--', 'scripts/prose-manifest-cells.mjs');
      const msg = [
        `The prose manifest's provenance declares ${cfg.label}'s re-record before it (§934.105)`,
        '',
        `scripts/prose-manifest-cells.mjs :: MANIFEST_PROVENANCE gains the sentence for ${cfg.record}`,
        '(RUNG 1 OF THE SOAK LADDER), committed ahead of the door because the door refuses a tree dirty beyond the fixture,',
        'the register and the record (precedent 29a4e541). The recorder identity does not move: this file is not one of',
        'MANIFEST_RECORDER_FILES.',
        '',
        // signed (the chair's ruling of 2026-11-08, MERGE-CAR): the provenance sentence is part of the record's acts
        `Owner-Signed: §934.105 (${cfg.record})`,
        `Seat: ${cfg.seat}`,
        'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
        `Claude-Session: ${cfg.session}`,
      ].join('\n');
      git(here, 'commit', '-q', '--no-verify', '-m', msg);
      i += 1;
    }
    const d = log[s.surface];
    if (!d) throw new Error(`no logged act for ${s.surface}`);
    const files = [d.path, 'tests/fixtures/.golden-freeze-register.json'];
    if (i === 0) files.push(cfg.record);
    git(here, 'checkout', d.stageCommit, '--', ...files);
    const extraFiles = [];
    if (d.suite && d.suite !== d.path) {
      const differs = git(here, 'diff', '--name-only', 'HEAD', stageFinal, '--', d.suite);
      if (differs) { git(here, 'checkout', stageFinal, '--', d.suite); extraFiles.push(d.suite); }
    }
    if (s.calibration) {
      // CARTOGRAPHY_CALIBRATION by hand: its block alone, from the stage's final tree (the file's other blocks are the lanes').
      sh('node', [join(here, 'scripts/audit/carry-calibration.mjs'), cfg.stage, here]);
      extraFiles.push('src/domain/townCartography/cartographyTuning.js');
    }
    for (const extra of s.extraPaths ?? []) {
      git(here, 'checkout', stageFinal, '--', extra);
      extraFiles.push(extra);
    }
    git(here, 'add', '--', ...files, ...extraFiles);
    const total = TOTAL[s.surface];
    const tail = s.surface === 'pdf-golden-view-model-snapshot' ? 'its one snapshot' : `${s.moved} of ${total ?? s.of} rows`;
    const title = s.surface === 'generator-golden-master'
      ? `golden master re-recorded through the signed door: ${cfg.label}, ${tail}, from the stage at ${step9}`
      : `${NAMES[s.surface] ?? s.surface} re-recorded through the signed door for ${cfg.label} (§934.105): ${tail}, from the stage at ${step9}`;
    const last = i === k - 1;
    const short = (h) => (h === '(unset)' ? h : `${h.slice(0, 8)}..`);
    const body = [
      title,
      '',
      `${ORDINALS[i]} ${last && k > 1 ? 'and last ' : ''}act of ${k} under ${cfg.record} (ODQ §934.105, RUNG 1 OF THE SOAK LADDER;`,
      `the chair signs by the owner's delegation, vetoable). Cause: "${cfg.cause}".`,
      '',
      `HOW: the staged-tree method (DOORS-2 ruling 1). Stage S${cfg.n} = the tree of ${step9} ("${cfg.stepSubject}")`,
      `with the door paths carried from this branch at ${carry9}, committed in the scratch stage (scripts/audit/landing-stage.sh build).`,
      '',
      `- ${d.path}: ${s.surface} ${s.rowsText}; predicted before the write. Register ${short(d.from)} -> ${short(d.to)},`,
      `  rows ${d.rowsFrom} -> ${d.rowsTo}, ownerRow §934.105.`,
      ...(s.extra ?? []).map((line) => `- ${line}`),
      '',
      `Receipt (stage S${cfg.n}): the door run fails by design ("sha256 ${short(d.from)} -> ${short(d.to)}; rows ${d.rowsFrom} -> ${d.rowsTo}");`,
      `the plain re-run of ${cfg.receiptFiles}: ${cfg.receipt}.`,
      ...(s.receiptExtra ?? []),
      trailer,
    ].join('\n');
    git(here, 'commit', '-q', '--no-verify', '-m', body);
    console.log(`${git(here, 'rev-parse', '--short=9', 'HEAD')} ${title}`);
    i += 1;
  }
}

/** Rows moved by each logged act, diffed between the act's stage commit and its parent (the DRY pass's figures). */
function figures() {
  const rowsOf = (text) => {
    let parsed;
    try { parsed = JSON.parse(text); } catch { return null; }
    const body = parsed && typeof parsed.rows === 'object' && !Array.isArray(parsed.rows) ? parsed.rows : parsed;
    return Object.fromEntries(Object.entries(body).filter(([key]) => !key.startsWith('_')));
  };
  const out = {};
  for (const [surface, d] of Object.entries(log)) {
    const before = rowsOf(git(cfg.stage, 'show', `${d.stageCommit}^:${d.path}`));
    const after = rowsOf(git(cfg.stage, 'show', `${d.stageCommit}:${d.path}`));
    if (!before || !after) { out[surface] = { note: 'not a JSON row manifest' }; continue; }
    const byTier = {};
    let moved = 0;
    for (const [key, value] of Object.entries(after)) {
      if (key in before && JSON.stringify(before[key]) !== JSON.stringify(value)) {
        moved += 1;
        const tier = key.split('|')[0];
        byTier[tier] = (byTier[tier] ?? 0) + 1;
      }
    }
    const added = Object.keys(after).filter((key) => !(key in before)).length;
    const removed = Object.keys(before).filter((key) => !(key in after)).length;
    out[surface] = { rows: Object.keys(after).length, moved, added, removed, byTier };
  }
  console.log(JSON.stringify(out, null, 1));
}

if (mode === 'figures') {
  figures();
} else if (mode === 'run') {
  for (const s of cfg.surfaces) {
    if (only.length && !only.includes(s.surface)) continue;
    runAct(s);
  }
} else if (mode === 'transplant') {
  transplant();
} else {
  console.error(`unknown mode ${mode}`);
  process.exit(2);
}
