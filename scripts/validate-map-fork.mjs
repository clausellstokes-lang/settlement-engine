import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const root = fileURLToPath(new URL('../public/map/', import.meta.url));
const libsRoot = join(root, 'libs');
const manifestPath = join(libsRoot, 'VENDOR-MANIFEST.json');
const updateManifest = process.argv.includes('--update-manifest');
const failures = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['libs', 'node_modules'].includes(entry.name)) await walk(path);
    } else if (extname(entry.name) === '.js') {
      const source = await readFile(path, 'utf8');
      try {
        parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
      } catch (scriptError) {
        try {
          parse(source, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true });
        } catch (moduleError) {
          failures.push(`${path}: ${moduleError.message}; script parse: ${scriptError.message}`);
        }
      }
    }
  }
}

await walk(root);

// ── Supply-chain integrity: pin the vendored libs against VENDOR-MANIFEST.json ──
// The walk above deliberately skips libs/ (the 5.7 MB of minified third-party
// blobs would just be parse-noise). But those blobs ship to the same origin as
// the payment+auth app, so a silent swap/tamper is a real risk the gate must
// see. We hash each pinned file and compare to the manifest; a mismatch (or a
// pinned file gone missing) fails CI and forces a conscious re-pin.
//   - re-pin after a deliberate upgrade: `node scripts/validate-map-fork.mjs --update-manifest`
let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (err) {
  failures.push(`VENDOR-MANIFEST.json unreadable: ${err.message}`);
}

async function hashLib(file) {
  const buf = await readFile(join(libsRoot, file));
  return { sha256: createHash('sha256').update(buf).digest('hex'), byteSize: buf.length };
}

if (manifest?.libs) {
  if (updateManifest) {
    for (const lib of manifest.libs) {
      try {
        const { sha256, byteSize } = await hashLib(lib.file);
        lib.sha256 = sha256;
        lib.byteSize = byteSize;
      } catch (err) {
        failures.push(`manifest update: ${lib.file} unreadable: ${err.message}`);
      }
    }
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Updated VENDOR-MANIFEST.json (${manifest.libs.length} libs re-pinned).`);
  } else {
    for (const lib of manifest.libs) {
      let actual;
      try {
        actual = await hashLib(lib.file);
      } catch (err) {
        failures.push(`vendored lib pinned in manifest is missing: ${lib.file} (${err.message})`);
        continue;
      }
      if (actual.sha256 !== lib.sha256 || actual.byteSize !== lib.byteSize) {
        failures.push(
          `vendored lib ${lib.file} does not match VENDOR-MANIFEST.json — ` +
            `expected sha256 ${lib.sha256} (${lib.byteSize}B), got ${actual.sha256} (${actual.byteSize}B). ` +
            `If this change is intentional, audit the new bytes for advisories then re-pin: ` +
            `node scripts/validate-map-fork.mjs --update-manifest`,
        );
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
if (!updateManifest) {
  const libCount = manifest?.libs?.length ?? 0;
  console.log(`Map fork JavaScript parses successfully; ${libCount} vendored libs match the supply-chain manifest.`);
}
