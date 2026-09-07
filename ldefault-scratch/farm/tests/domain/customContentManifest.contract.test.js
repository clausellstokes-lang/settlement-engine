/**
 * Generation and portability contract for the canonical custom-content manifest.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CUSTOM_CONTENT_MANIFEST as CLIENT_MANIFEST,
  CUSTOM_CONTENT_MANIFEST_VERSION as CLIENT_VERSION,
} from '../../src/domain/content/customContentManifest.generated.js';
import {
  CUSTOM_CONTENT_ADMISSION_MANIFEST,
  CUSTOM_CONTENT_ADMISSION_MANIFEST_VERSION,
} from '../../src/domain/content/customContentAdmission.generated.js';
import {
  CUSTOM_CONTENT_MANIFEST as EDGE_MANIFEST,
  CUSTOM_CONTENT_MANIFEST_VERSION as EDGE_VERSION,
} from '../../supabase/functions/_shared/customContentManifest.generated.ts';

const root = resolve(import.meta.dirname, '../..');
const SQL_MANIFEST_BEGIN = '-- BEGIN GENERATED CUSTOM-CONTENT VALIDATION MANIFEST';
const SQL_MANIFEST_END = '-- END GENERATED CUSTOM-CONTENT VALIDATION MANIFEST';

function forbiddenDecorationPaths(value, path = 'manifest', found = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => forbiddenDecorationPaths(item, `${path}[${index}]`, found));
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  for (const [key, child] of Object.entries(value)) {
    if (['icon', 'Icon', 'color', 'colour'].includes(key)) found.push(`${path}.${key}`);
    forbiddenDecorationPaths(child, `${path}.${key}`, found);
  }
  return found;
}

function expectedSqlValidationManifest(manifest) {
  const propertyMap = [
    ['type', 't'],
    ['required', 'r'],
    ['minLength', 'n'],
    ['maxLength', 'x'],
    ['maxItems', 'm'],
    ['itemMaxLength', 'i'],
    ['values', 'v'],
  ];

  return Object.fromEntries(manifest.authorableBuckets.map((bucket) => {
    const category = manifest.categories.find((candidate) => candidate.key === bucket);
    const fields = Object.fromEntries(category.fields.map((field) => {
      const rule = {};
      for (const [sourceKey, sqlKey] of propertyMap) {
        if (sourceKey === 'required') {
          if (field.required === true) rule[sqlKey] = 1;
        } else if (field[sourceKey] !== undefined) {
          rule[sqlKey] = field[sourceKey];
        }
      }
      return [field.key, rule];
    }));
    return [bucket, fields];
  }));
}

function embeddedSqlValidationManifest() {
  const migration = readFileSync(
    resolve(root, 'supabase/migrations/185_custom_content_versions.sql'),
    'utf8',
  );
  const begin = migration.indexOf(SQL_MANIFEST_BEGIN);
  const end = migration.indexOf(SQL_MANIFEST_END);
  expect(begin).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(begin);
  expect(migration.indexOf(SQL_MANIFEST_BEGIN, begin + SQL_MANIFEST_BEGIN.length)).toBe(-1);
  expect(migration.indexOf(SQL_MANIFEST_END, end + SQL_MANIFEST_END.length)).toBe(-1);

  const frozenBlock = migration.slice(begin, end);
  const json = frozenBlock.match(/\$manifest\$\s*([\s\S]*?)\s*\$manifest\$::jsonb;/)?.[1];
  expect(json).toBeTruthy();
  return { frozenBlock, manifest: JSON.parse(json) };
}

describe('custom-content manifest generation contract', () => {
  it('keeps generated client and edge data byte-semantically identical', () => {
    expect(EDGE_VERSION).toBe(CLIENT_VERSION);
    expect(EDGE_MANIFEST).toEqual(CLIENT_MANIFEST);
  });

  it('derives the eager client admission contract from the same authority', () => {
    expect(CUSTOM_CONTENT_ADMISSION_MANIFEST_VERSION).toBe(CLIENT_VERSION);
    expect(CUSTOM_CONTENT_ADMISSION_MANIFEST).toEqual({
      manifestVersion: CLIENT_VERSION,
      buckets: expectedSqlValidationManifest(CLIENT_MANIFEST),
    });
  });

  it('keeps the canonical semantic source free of UI decoration', () => {
    const source = JSON.parse(readFileSync(
      resolve(root, 'schema/custom-content.manifest.json'),
      'utf8',
    ));
    expect(forbiddenDecorationPaths(source)).toEqual([]);
  });

  it('pins migration 185 to the canonical SQL admission projection', () => {
    const sql = embeddedSqlValidationManifest();

    expect(sql.frozenBlock).toContain(
      `Source: schema/custom-content.manifest.json @ ${CLIENT_VERSION}.`,
    );
    expect(sql.frozenBlock).toContain(
      'Frozen migration snapshot; generated validation projection, not a third authority.',
    );
    expect(Object.keys(sql.manifest)).toEqual(CLIENT_MANIFEST.authorableBuckets);
    expect(sql.manifest).toEqual(expectedSqlValidationManifest(CLIENT_MANIFEST));
  });

  it('has no stale generated artifact', () => {
    expect(() => execFileSync(
      process.execPath,
      ['scripts/generate-custom-content-manifest.mjs', '--check'],
      { cwd: root, stdio: 'pipe' },
    )).not.toThrow();
  });
});
