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
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseContentJson,
} from '../src/domain/content/contentFingerprint.js';
import { sanitizeJsPdfText } from '../src/utils/jsPdfText.js';
import { BOOK_DRAWABLE_RANGES, BOOK_FACES, BOOK_FAMILY } from '../src/utils/jsPdfBookFont.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'schema/custom-content.manifest.json');
const clientPath = resolve(root, 'src/domain/content/customContentManifest.generated.js');
const clientAdmissionPath = resolve(
  root,
  'src/domain/content/customContentAdmission.generated.js',
);
const edgePath = resolve(root, 'supabase/functions/_shared/customContentManifest.generated.ts');
const charsetClientPath = resolve(root, 'src/domain/content/customContentCharset.generated.js');
const charsetEdgePath = resolve(root, 'supabase/functions/_shared/customContentCharset.generated.ts');
const themePath = resolve(root, 'src/pdf/theme.js');
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
      // `surfaces` is a CHARSET input, not runtime vocabulary: it is read by
      // deriveCharsetTable straight off the JSON source and emitted into the
      // charset table. Stripping it here keeps the runtime manifest artifact
      // byte-identical, so declaring a field's surfaces costs no product bytes.
    }).map(({ schema: _schema, surfaces: _surfaces, ...field }) => field);

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
 *
 * The `/* eslint-disable *\/` header matches the one `generatedSource` already emits
 * for the sibling artifacts, and it is load-bearing rather than cosmetic. Without it
 * this file was the ONLY generated artifact the per-file size ratchet measured, so a
 * vocabulary addition ANYWHERE in the manifest grew an undecomposable projection
 * toward `src/domain`'s 800-line ceiling — with no legal remedy, since the ratchet's
 * three cures (decompose, lower the number, delete the entry) all assume hand-written
 * code. The W-FAITH F1c deity fields landed it at exactly 800/800, which is how the
 * asymmetry was found. The projection is byte-checked by `--check` in the gate, so
 * lint bought nothing here that regeneration does not already prove.
 */
function generatedClientAdmissionSource(manifest) {
  const json = JSON.stringify({
    manifestVersion: manifest.manifestVersion,
    buckets: admissionValidationManifest(manifest),
  }, null, 2);
  return `/* eslint-disable */\n`
    + `// GENERATED by scripts/generate-custom-content-manifest.mjs. Do not edit by hand.\n`
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

// ── The charset table: DERIVED from the renderers, never typed ──────────────
//
// Every figure below is an output of a measurement. The dossier's set is the
// intersection of the font faces theme.js actually registers, read through
// fontkit. The two jsPDF books' set is what the EMBEDDED book roster
// (src/utils/jsPdfBookFont.js) can actually DRAW, narrowed by EXECUTING the one
// text pass over it. Nothing here is a hand-typed list, so a font swap, a jsPDF
// bump or an edit to the text pass moves the table and reds the gate instead of
// silently moving a paid surface.
//
// ⚠ THE BOOK SET USED TO BE jsPDF's WinAnsiEncoding MAP, and it was 190 codepoints
// while the dossier drew 759 — the asymmetry namingDataCharset.test.js calls "the
// defect", and the reason 41 shipped pool names could not be printed on a paid page.
// The books now embed Lora, so the honest bound is the FONT, not an encoder table.
// ⭐ AND IT IS READ THROUGH jsPDF's OWN LOADED cmap, NOT THROUGH fontkit: fontkit
// reports the format-4 sentinel U+FFFF as covered, jsPDF maps it to glyph 0, and a
// .notdef is not a drawable glyph. Measured: fontkit 779 vs jsPDF 778 per face.

const CHARSET_SURFACES = [
  'web-display',
  'dossier-pdf',
  'campaign-pdf',
  'world-book',
  'foundry',
  'json-export',
];
const CHARSET_ENFORCEMENTS = ['report', 'refuse'];
const NON_LATIN_POLICIES = ['undecided', 'embed', 'transliterate', 'keep_and_mark'];
// The buckets whose fields materialize as engine keys and therefore carry an
// observed-shape identity. The rest stay null until a surface roster lights them.
const OSR_IDENTITY_BUCKETS = ['institutions', 'services', 'resources', 'tradeGoods'];
const MULTILINE_SCHEMAS = ['text', 'shortText'];

/** A field is free text when its schema admits an author's own string. */
function isFreeTextSchema(schema) {
  if (!schema || schema.values) return false;
  return schema.type === 'string' || schema.type === 'string-or-string-list';
}

function toRangeString(codepoints) {
  const sorted = [...codepoints].sort((a, b) => a - b);
  const hex = (cp) => cp.toString(16).toUpperCase();
  const out = [];
  let start = null;
  let prev = null;
  for (const cp of sorted) {
    if (start === null) { start = cp; prev = cp; continue; }
    if (cp === prev + 1) { prev = cp; continue; }
    out.push(start === prev ? hex(start) : `${hex(start)}-${hex(prev)}`);
    start = cp;
    prev = cp;
  }
  if (start !== null) out.push(start === prev ? hex(start) : `${hex(start)}-${hex(prev)}`);
  return out.join(' ');
}

function sha256Of(parts) {
  const hash = createHash('sha256');
  for (const part of parts) hash.update(part);
  return hash.digest('hex');
}

/**
 * Read the registered face roster from theme.js source.
 *
 * Comments are stripped before the match and the `src:` string literals are kept:
 * the literals ARE the registration, so reading them is a measurement of the code,
 * while a commented-out face is not a registration. Do NOT remove the stripper as
 * unnecessary -- it is a no-op on today's theme.js by luck, not by construction.
 */
function readFaceRoster(themeSource) {
  const stripped = themeSource
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  const faces = [...stripped.matchAll(/src:\s*'(\/fonts\/[^'?]+\.ttf)(?:\?[^']*)?'/g)]
    .map((match) => match[1]);
  invariant(faces.length > 0, 'theme.js registers no font faces');
  invariant(new Set(faces).size === faces.length, 'theme.js registers a face twice');
  return faces;
}

async function deriveCharsetTable(manifest, source) {
  const policy = source.charsetPolicy;
  invariant(policy && typeof policy === 'object', 'charsetPolicy is required');
  invariant(
    CHARSET_ENFORCEMENTS.includes(policy.enforcement),
    `charsetPolicy.enforcement must be one of ${CHARSET_ENFORCEMENTS.join('|')}`,
  );
  invariant(
    NON_LATIN_POLICIES.includes(policy.nonLatin),
    `charsetPolicy.nonLatin must be one of ${NON_LATIN_POLICIES.join('|')}`,
  );
  invariant(
    policy.embeddedFont === null || typeof policy.embeddedFont === 'string',
    'charsetPolicy.embeddedFont must be a string or null',
  );
  invariant(
    Array.isArray(source.surfaceClasses)
      && source.surfaceClasses.length === CHARSET_SURFACES.length
      && source.surfaceClasses.every((entry, index) => entry === CHARSET_SURFACES[index]),
    'surfaceClasses must mirror the charset surface vocabulary exactly',
  );

  // dossier-pdf: the intersection of every registered face, read from the TTFs.
  const fontkit = await import('fontkit');
  const themeSource = await readFile(themePath, 'utf8');
  const faces = readFaceRoster(themeSource);
  const faceBytes = [];
  let dossier = null;
  for (const face of faces) {
    const path = resolve(root, 'public', face.replace(/^\//, ''));
    faceBytes.push(await readFile(path));
    const set = new Set(fontkit.openSync(path).characterSet);
    dossier = dossier === null ? set : new Set([...dossier].filter((cp) => set.has(cp)));
  }

  // campaign-pdf / world-book: load the EMBEDDED roster the two painters register
  // and ask jsPDF itself which codepoints it can draw, then narrow by EXECUTING the
  // one text pass. The context anchor matters: a bare codepoint would read one
  // lower, because a lone space trims to empty.
  const { jsPDF } = await import('jspdf');
  const probe = new jsPDF();
  const rosterBytes = [];
  let drawable = null;
  for (const face of BOOK_FACES) {
    const facePath = resolve(root, 'public/fonts', face.file);
    const bytes = await readFile(facePath);
    rosterBytes.push(bytes);
    probe.addFileToVFS(face.file, bytes.toString('base64'));
    probe.addFont(face.file, BOOK_FAMILY, face.style);
    probe.setFont(BOOK_FAMILY, face.style);
    const { metadata } = probe.getFont(BOOK_FAMILY, face.style);
    invariant(
      metadata?.cmap?.unicode?.codeMap,
      `jsPDF exposes no loaded cmap for ${face.file}; the derivation cannot proceed`,
    );
    // glyph id 0 is .notdef — present in the cmap, not drawable.
    const set = new Set(
      Object.keys(metadata.cmap.unicode.codeMap)
        .map(Number)
        .filter((cp) => metadata.characterToGlyph(cp) !== 0),
    );
    drawable = drawable === null ? set : new Set([...drawable].filter((cp) => set.has(cp)));
  }
  invariant(drawable && drawable.size > 0, 'the embedded book roster draws nothing');
  // The pass admits only what the roster declares, so this narrowing is the
  // whitespace collapse showing up: U+000D and U+00A0 are drawable but cannot
  // survive `\s+ -> ' '`, so the derived set sits two below the drawable one.
  const textPass = new Set([...drawable].filter((cp) => {
    const anchored = `a${String.fromCodePoint(cp)}a`;
    return sanitizeJsPdfText(anchored) === anchored;
  }));

  const passSource = sanitizeJsPdfText.toString();
  const surfaces = {
    'web-display': { ranges: '', count: 0, method: 'unbounded', inputs: [], inputsSha256: '' },
    'dossier-pdf': {
      ranges: toRangeString(dossier),
      count: dossier.size,
      method: 'fontkit-intersection',
      inputs: faces.map((face) => `public${face}`),
      inputsSha256: sha256Of(faceBytes),
    },
    'campaign-pdf': {
      ranges: toRangeString(textPass),
      count: textPass.size,
      method: 'embedded-roster-and-textpass',
      inputs: [
        ...BOOK_FACES.map((face) => `public/fonts/${face.file}`),
        'src/utils/jsPdfBookFont.js',
        'src/utils/jsPdfText.js',
      ],
      // The roster BYTES plus the two things that can narrow them: the declared
      // drawable ranges the pass reads, and the pass body itself. Comments in
      // either module deliberately do not move it.
      inputsSha256: sha256Of([...rosterBytes, BOOK_DRAWABLE_RANGES, passSource]),
    },
    foundry: { ranges: '', count: 0, method: 'unbounded', inputs: [], inputsSha256: '' },
    'json-export': { ranges: '', count: 0, method: 'unbounded', inputs: [], inputsSha256: '' },
  };
  surfaces['world-book'] = { ...surfaces['campaign-pdf'] };

  // The bans apply on EVERY surface, web included: none of these is a character a
  // reader sees, and a bidi override in a name is an attack, not an accent.
  // U+00A0 is here because both jsPDF passes silently collapse it to a space --
  // a silent rewrite is exactly what this wall exists to make visible.
  // `control` is C0 WHOLE plus DEL plus C1. TAB/LF/CR are NOT carved out here:
  // the protocol exempts them per-field for multiline classes, which is the only
  // place the distinction is knowable. Carving them out of the STORED set instead
  // lets a newline in a single-line, web-only field produce no finding at all,
  // because no bounded surface is left to catch it (measured, before the cure).
  const bans = {
    control: '0-1F 7F-9F',
    bidi: '61C 200E-200F 202A-202E 2066-2069',
    invisible: 'A0 AD 180E 200B-200D 2060-2064 FEFF FFF9-FFFB',
    noncharacter: toRangeString([
      ...Array.from({ length: 0xfdef - 0xfdd0 + 1 }, (_, i) => 0xfdd0 + i),
      ...Array.from({ length: 17 }, (_, plane) => [
        plane * 0x10000 + 0xfffe,
        plane * 0x10000 + 0xffff,
      ]).flat(),
    ]),
  };

  const fields = {};
  for (const bucket of manifest.authorableBuckets) {
    const category = manifest.categories.find((candidate) => candidate.key === bucket);
    invariant(category, `charset table cannot find authorable category ${bucket}`);
    const sourceCategory = source.categories.find((candidate) => candidate.key === bucket);
    const bucketFields = {};
    for (const field of category.fields) {
      const schema = source.schemas[
        sourceCategory.fields.find((candidate) => candidate.key === field.key).schema
      ];
      if (!isFreeTextSchema(schema)) continue;
      const declared = sourceCategory.fields.find((candidate) => candidate.key === field.key)
        .surfaces;
      invariant(
        Array.isArray(declared) && declared.length > 0,
        `${bucket}.${field.key} is free text and needs a surfaces declaration`,
      );
      for (const surface of declared) {
        invariant(
          CHARSET_SURFACES.includes(surface),
          `${bucket}.${field.key} declares unknown surface ${surface}`,
        );
      }
      invariant(
        new Set(declared).size === declared.length,
        `${bucket}.${field.key}.surfaces must be unique`,
      );
      const isList = schema.type === 'string-or-string-list';
      bucketFields[field.key] = {
        surfaces: [...declared].sort(
          (a, b) => CHARSET_SURFACES.indexOf(a) - CHARSET_SURFACES.indexOf(b),
        ),
        multiline: MULTILINE_SCHEMAS.includes(
          sourceCategory.fields.find((candidate) => candidate.key === field.key).schema,
        ),
        maxCodepoints: (isList ? schema.itemMaxLength : schema.maxLength) ?? null,
        osrIdentity: OSR_IDENTITY_BUCKETS.includes(bucket) ? `${field.key} on ${bucket}` : null,
      };
    }
    fields[bucket] = bucketFields;
  }

  return {
    manifestVersion: manifest.manifestVersion,
    policy: {
      enforcement: policy.enforcement,
      nonLatin: policy.nonLatin,
      embeddedFont: policy.embeddedFont,
    },
    surfaces,
    bans,
    fields,
  };
}

function generatedCharsetSource(table, typescript) {
  const json = JSON.stringify(table, null, 2);
  const cast = typescript ? ' as const' : '';
  const freezeDeclaration = typescript
    ? 'function deepFreeze<T>(value: T): T {'
    : '/** @template T @param {T} value @returns {T} */\nfunction deepFreeze(value) {';
  const objectValues = typescript
    ? 'Object.values(value as object)'
    : 'Object.values(value)';
  return `/* eslint-disable */\n`
    + `// GENERATED by scripts/generate-custom-content-manifest.mjs. Do not edit by hand.\n`
    + `// Every set below is DERIVED by measuring a renderer, never hand-typed.\n\n`
    + `${freezeDeclaration}\n`
    + `  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;\n`
    + `  Object.freeze(value);\n`
    + `  for (const child of ${objectValues}) deepFreeze(child);\n`
    + `  return value;\n`
    + `}\n\n`
    + `export const CUSTOM_CONTENT_CHARSET = deepFreeze(${json}${cast});\n`;
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
const charsetTable = await deriveCharsetTable(manifest, source);
const outputs = [
  [clientPath, generatedSource(manifest, false)],
  [clientAdmissionPath, generatedClientAdmissionSource(manifest)],
  [edgePath, generatedSource(manifest, true)],
  [charsetClientPath, generatedCharsetSource(charsetTable, false)],
  [charsetEdgePath, generatedCharsetSource(charsetTable, true)],
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
