/**
 * Compile the human-authored custom-content manifest into byte-identical client and
 * Supabase Edge artifacts, plus the frozen admission-schema snapshot embedded in
 * the migration that introduces versioned custom content.
 *
 * The JSON source deliberately contains no icons, colors, imports, or executable
 * validators. This compiler resolves reusable field schemas, rejects semantic drift,
 * and emits plain frozen data for each runtime. The SQL artifact is only the compact
 * field-validation projection its database function consumes; it is generated from
 * the same normalized manifest and is never an independent authority.
 *
 * Run with --check in CI-style gates.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseContentJson,
} from '../src/domain/content/contentFingerprint.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'schema/custom-content.manifest.json');
const clientPath = resolve(root, 'src/domain/content/customContentManifest.generated.js');
const clientAdmissionPath = resolve(
  root,
  'src/domain/content/customContentAdmission.generated.js',
);
const edgePath = resolve(root, 'supabase/functions/_shared/customContentManifest.generated.ts');
const versionedContentMigrationPath = resolve(root, 'supabase/migrations/185_custom_content_versions.sql');
const checkOnly = process.argv.includes('--check');

const SQL_MANIFEST_BEGIN = '  -- BEGIN GENERATED CUSTOM-CONTENT VALIDATION MANIFEST';
const SQL_MANIFEST_END = '  -- END GENERATED CUSTOM-CONTENT VALIDATION MANIFEST';

function invariant(condition, message) {
  if (!condition) throw new Error(`custom-content manifest: ${message}`);
}

function assertIconFree(value, path = 'manifest') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertIconFree(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    invariant(!['icon', 'Icon', 'color', 'colour'].includes(key), `${path}.${key} is UI decoration`);
    assertIconFree(child, `${path}.${key}`);
  }
}

function normalizeManifest(source) {
  invariant(typeof source.manifestVersion === 'string' && source.manifestVersion, 'manifestVersion is required');
  invariant(Array.isArray(source.categories) && source.categories.length > 0, 'categories are required');
  invariant(source.schemas && typeof source.schemas === 'object', 'schemas are required');
  assertIconFree(source);

  const effectKinds = new Set(source.effectKinds);
  const activationKinds = new Set(source.activationKinds);
  invariant(effectKinds.size === source.effectKinds.length, 'effectKinds must be unique');
  invariant(
    activationKinds.size === source.activationKinds.length,
    'activationKinds must be unique',
  );
  for (const [schemaKey, schema] of Object.entries(source.schemas)) {
    if (!Array.isArray(schema.values)) continue;
    invariant(
      new Set(schema.values).size === schema.values.length,
      `schema ${schemaKey}.values must be unique`,
    );
  }
  const categoryKeys = new Set(source.categories.map((category) => category.key));
  invariant(categoryKeys.size === source.categories.length, 'category keys must be unique');
  invariant(Array.isArray(source.authorableBuckets), 'authorableBuckets must be an array');
  invariant(new Set(source.authorableBuckets).size === source.authorableBuckets.length, 'authorableBuckets must be unique');

  const categories = source.categories.map((category) => {
    invariant(typeof category.key === 'string' && category.key, 'every category needs a key');
    invariant(typeof category.label === 'string' && category.label, `${category.key} needs a label`);
    invariant(Array.isArray(category.fields), `${category.key}.fields must be an array`);

    const fieldKeys = new Set();
    const fields = category.fields.map((field) => {
      invariant(typeof field.key === 'string' && field.key, `${category.key} has a field without a key`);
      invariant(!fieldKeys.has(field.key), `${category.key}.${field.key} is duplicated`);
      fieldKeys.add(field.key);

      const schema = source.schemas[field.schema];
      invariant(schema, `${category.key}.${field.key} references unknown schema ${field.schema}`);
      invariant(effectKinds.has(field.effect), `${category.key}.${field.key} has unknown effect ${field.effect}`);
      invariant(activationKinds.has(field.activation), `${category.key}.${field.key} has unknown activation ${field.activation}`);
      invariant(Array.isArray(field.consumers) && field.consumers.length > 0, `${category.key}.${field.key} needs consumer evidence`);
      invariant(
        new Set(field.consumers).size === field.consumers.length,
        `${category.key}.${field.key}.consumers must be unique`,
      );
      if (field.mechanicalValues) {
        invariant(
          field.effect === 'mechanical' && field.fallbackEffect === 'presentation',
          `${category.key}.${field.key} dynamic mechanics need presentation fallback`,
        );
        invariant(
          Array.isArray(field.mechanicalValues) && field.mechanicalValues.length > 0,
          `${category.key}.${field.key}.mechanicalValues must be non-empty`,
        );
        invariant(
          new Set(field.mechanicalValues).size === field.mechanicalValues.length,
          `${category.key}.${field.key}.mechanicalValues must be unique`,
        );
        if (field.mechanicalValueAliases) {
          invariant(
            field.mechanicalValueAliases
              && typeof field.mechanicalValueAliases === 'object'
              && !Array.isArray(field.mechanicalValueAliases),
            `${category.key}.${field.key}.mechanicalValueAliases must be an object`,
          );
          for (const [alias, target] of Object.entries(
            field.mechanicalValueAliases,
          )) {
            invariant(
              alias === alias.trim().toLowerCase() && alias.length > 0,
              `${category.key}.${field.key} alias keys must be normalized`,
            );
            invariant(
              field.mechanicalValues.includes(target),
              `${category.key}.${field.key} alias ${alias} targets an unknown mechanical value`,
            );
          }
        }
      } else {
        invariant(
          field.mechanicalValueAliases === undefined,
          `${category.key}.${field.key}.mechanicalValueAliases requires mechanicalValues`,
        );
      }
      if (field.activation === 'conditional') {
        invariant(typeof field.condition === 'string' && field.condition, `${category.key}.${field.key} needs an activation condition`);
      }
      if (field.category) invariant(categoryKeys.has(field.category), `${category.key}.${field.key} targets unknown ${field.category}`);
      for (const target of field.categories || []) {
        invariant(categoryKeys.has(target), `${category.key}.${field.key} targets unknown ${target}`);
      }

      return {
        ...schema,
        ...field,
        effectKind: field.effect,
        activationMode: field.activation,
        ...(field.condition ? { explanation: field.condition } : {}),
        schema: undefined,
      };
    }).map(({ schema: _schema, ...field }) => field);

    const dependencies = fields
      .filter((field) => field.placement === 'dependency')
      .map((field) => ({
        field: field.key,
        targetBuckets: field.categories
          ? [...field.categories]
          : field.category ? [field.category] : [],
        cardinality: field.single === true ? 'one' : 'many',
      }));

    return { ...category, fields, dependencies };
  });

  const laneKeys = new Set();
  for (const lane of source.lanes || []) {
    invariant(typeof lane.key === 'string' && lane.key, 'every lane needs a key');
    invariant(!laneKeys.has(lane.key), `lane ${lane.key} is duplicated`);
    laneKeys.add(lane.key);
    invariant(
      new Set(lane.buckets || []).size === (lane.buckets || []).length,
      `lane ${lane.key} buckets must be unique`,
    );
    for (const bucket of lane.buckets || []) {
      invariant(categoryKeys.has(bucket), `lane ${lane.key} references unknown ${bucket}`);
    }
  }
  for (const bucket of source.authorableBuckets) {
    const category = categories.find((candidate) => candidate.key === bucket);
    invariant(category?.authorable === true, `authorableBuckets references non-authorable ${bucket}`);
  }
  invariant(
    categories.filter((category) => category.authorable === true).every(
      (category) => source.authorableBuckets.includes(category.key),
    ),
    'every authorable category must appear in authorableBuckets',
  );

  return {
    manifestVersion: source.manifestVersion,
    purpose: source.purpose,
    effectKinds: source.effectKinds,
    activationKinds: source.activationKinds,
    authorableBuckets: source.authorableBuckets,
    lanes: source.lanes,
    categories,
  };
}

function generatedSource(manifest, typescript) {
  const json = JSON.stringify(manifest, null, 2);
  const cast = typescript ? ' as const' : '';
  const freezeDeclaration = typescript
    ? 'function deepFreeze<T>(value: T): T {'
    : '/** @template T @param {T} value @returns {T} */\nfunction deepFreeze(value) {';
  const objectValues = typescript
    ? 'Object.values(value as object)'
    : 'Object.values(value)';
  return `/* eslint-disable */\n`
    + `// GENERATED by scripts/generate-custom-content-manifest.mjs. Do not edit by hand.\n\n`
    + `${freezeDeclaration}\n`
    + `  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;\n`
    + `  Object.freeze(value);\n`
    + `  for (const child of ${objectValues}) deepFreeze(child);\n`
    + `  return value;\n`
    + `}\n\n`
    + `export const CUSTOM_CONTENT_MANIFEST = deepFreeze(${json}${cast});\n`
    + `export const CUSTOM_CONTENT_MANIFEST_VERSION = CUSTOM_CONTENT_MANIFEST.manifestVersion;\n`;
}

/**
 * Emit the small validation contract needed at eager persistence boundaries.
 *
 * The richer authoring manifest carries labels, effect semantics, consumer
 * evidence, dependency metadata, and review copy. Campaign hydration needs
 * none of that: it needs only the field shapes that decide whether a binding
 * is safe to admit. Keeping this projection generated preserves one schema
 * authority without putting the complete authoring vocabulary on first paint.
 */
function generatedClientAdmissionSource(manifest) {
  const json = JSON.stringify({
    manifestVersion: manifest.manifestVersion,
    buckets: admissionValidationManifest(manifest),
  }, null, 2);
  return `// GENERATED by scripts/generate-custom-content-manifest.mjs. Do not edit by hand.\n`
    + `// Compact keys: t=type, r=required, n=minLength, x=maxLength,\n`
    + `// m=maxItems, i=itemMaxLength, v=allowed values.\n\n`
    + `/** @template T @param {T} value @returns {T} */\n`
    + `function deepFreeze(value) {\n`
    + `  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;\n`
    + `  Object.freeze(value);\n`
    + `  for (const child of Object.values(value)) deepFreeze(child);\n`
    + `  return value;\n`
    + `}\n\n`
    + `export const CUSTOM_CONTENT_ADMISSION_MANIFEST = deepFreeze(${json});\n`
    + `export const CUSTOM_CONTENT_ADMISSION_MANIFEST_VERSION =\n`
    + `  CUSTOM_CONTENT_ADMISSION_MANIFEST.manifestVersion;\n`;
}

/**
 * Project the canonical authoring manifest onto the field constraints shared by
 * client and database admission.
 *
 * Keeping this projection here matters: generated clients and migration SQL may
 * freeze the result, but neither may become a second hand-authored schema. Field
 * and category order remain deterministic so review diffs stay attributable to
 * the canonical JSON source.
 */
function admissionValidationManifest(manifest) {
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
    invariant(category, `SQL validation projection cannot find authorable category ${bucket}`);

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

function generatedSqlManifestBlock(manifest) {
  const compactManifest = JSON.stringify(admissionValidationManifest(manifest), null, 2)
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');

  return `${SQL_MANIFEST_BEGIN}\n`
    + `  -- Source: schema/custom-content.manifest.json @ ${manifest.manifestVersion}.\n`
    + `  -- Frozen migration snapshot; generated validation projection, not a third authority.\n`
    + `  v_manifest jsonb := $manifest$\n`
    + `${compactManifest}\n`
    + `  $manifest$::jsonb;\n`
    + `${SQL_MANIFEST_END}`;
}

function generatedBlockBounds(sourceText, pathLabel) {
  const begin = sourceText.indexOf(SQL_MANIFEST_BEGIN);
  const end = sourceText.indexOf(SQL_MANIFEST_END);
  invariant(begin !== -1, `${pathLabel} is missing the SQL manifest begin marker`);
  invariant(end !== -1, `${pathLabel} is missing the SQL manifest end marker`);
  invariant(
    sourceText.indexOf(SQL_MANIFEST_BEGIN, begin + SQL_MANIFEST_BEGIN.length) === -1,
    `${pathLabel} has more than one SQL manifest begin marker`,
  );
  invariant(
    sourceText.indexOf(SQL_MANIFEST_END, end + SQL_MANIFEST_END.length) === -1,
    `${pathLabel} has more than one SQL manifest end marker`,
  );
  invariant(begin < end, `${pathLabel} has reversed SQL manifest markers`);
  return { begin, end: end + SQL_MANIFEST_END.length };
}

const sourceText = await readFile(sourcePath, 'utf8');
const source = parseContentJson(sourceText);
const manifest = normalizeManifest(source);
const outputs = [
  [clientPath, generatedSource(manifest, false)],
  [clientAdmissionPath, generatedClientAdmissionSource(manifest)],
  [edgePath, generatedSource(manifest, true)],
];

for (const [path, next] of outputs) {
  if (checkOnly) {
    const current = await readFile(path, 'utf8').catch(() => '');
    invariant(current === next, `${path.slice(root.length + 1)} is stale; run npm run gen:custom-content-manifest`);
  } else {
    await writeFile(path, next);
  }
}

const migrationLabel = versionedContentMigrationPath.slice(root.length + 1);
const migrationSource = await readFile(versionedContentMigrationPath, 'utf8');
const migrationBounds = generatedBlockBounds(migrationSource, migrationLabel);
const currentSqlBlock = migrationSource.slice(migrationBounds.begin, migrationBounds.end);
const nextSqlBlock = generatedSqlManifestBlock(manifest);
if (checkOnly) {
  invariant(
    currentSqlBlock === nextSqlBlock,
    `${migrationLabel} has a stale SQL validation snapshot; run npm run gen:custom-content-manifest`,
  );
} else if (currentSqlBlock !== nextSqlBlock) {
  await writeFile(
    versionedContentMigrationPath,
    migrationSource.slice(0, migrationBounds.begin)
      + nextSqlBlock
      + migrationSource.slice(migrationBounds.end),
  );
}

console.log(checkOnly ? 'custom-content manifest artifacts are current' : 'generated custom-content manifest artifacts');
