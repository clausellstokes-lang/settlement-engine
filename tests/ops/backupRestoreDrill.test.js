import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SCRIPT = path.join(ROOT, 'scripts', 'backup-restore-drill.mjs');
const temporaryDirectories = [];

function temporaryDump() {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'sf-restore-drill-'),
  );
  temporaryDirectories.push(directory);
  const file = path.join(directory, 'backup.sql');
  fs.writeFileSync(file, 'select 1;\n');
  return file;
}

function run(args, env = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('backup/restore drill safety boundary', () => {
  it('keeps every backup artifact outside git', () => {
    expect(() => execFileSync(
      'git',
      ['check-ignore', '-q', 'backups/example.sql'],
      { cwd: ROOT },
    )).not.toThrow();
  });

  it('rejects every Supabase-hosted restore target before invoking psql', () => {
    const dump = temporaryDump();
    const result = run([
      '--restore', dump,
      '--allow-unmanifested',
      '--target',
      'postgresql://postgres:secret@db.project.supabase.co:5432/postgres',
    ]);
    expect(result.status).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(
      /Supabase-hosted targets are never valid/i,
    );
    expect(`${result.stdout}${result.stderr}`).not.toContain('secret');
  });

  it('requires positive admission for a non-local scratch hostname', () => {
    const dump = temporaryDump();
    const result = run([
      '--restore', dump,
      '--allow-unmanifested',
      '--target',
      'postgresql://operator:secret@drill.internal:5432/postgres',
    ], {
      SF_RESTORE_DRILL_ALLOWED_HOSTS: '',
    });
    expect(result.status).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(
      /not in SF_RESTORE_DRILL_ALLOWED_HOSTS/i,
    );
    expect(`${result.stdout}${result.stderr}`).not.toContain('operator:secret');
  });

  it('verifies the manifest checksum before a local restore can start', () => {
    const dump = temporaryDump();
    const manifest = {
      schemaVersion: 1,
      kind: 'settlementforge_logical_backup',
      createdAt: '2026-07-24T00:00:00.000Z',
      fileName: path.basename(dump),
      sizeBytes: fs.statSync(dump).size,
      sha256: createHash('sha256').update('different bytes').digest('hex'),
    };
    fs.writeFileSync(
      `${dump}.manifest.json`,
      `${JSON.stringify(manifest)}\n`,
    );

    const result = run([
      '--restore', dump,
      '--target',
      'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
    ]);
    expect(result.status).toBe(1);
    expect(`${result.stdout}${result.stderr}`).toMatch(
      /SHA-256 does not match/i,
    );
    expect(`${result.stdout}${result.stderr}`).not.toContain(
      'Restoring backup.sql',
    );
  });

  it('uses argument-array child processes rather than shell command strings', () => {
    const source = fs.readFileSync(SCRIPT, 'utf8');
    expect(source).toContain("import { execFileSync } from 'node:child_process'");
    expect(source).not.toMatch(/\bexecSync\s*\(/);
    expect(source).not.toMatch(/\bspawnSync\s*\(/);
  });
});
