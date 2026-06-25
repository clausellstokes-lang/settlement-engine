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

// Recursively enumerate every shippable script under libs/, as forward-slash
// paths relative to libsRoot (matching the manifest's `file` convention). The
// manifest pins .js (the executable supply-chain surface), so the on-disk set
// we hold it to is the .js files — a new lib drops in as a .js file and must be
// consciously pinned, never shipped un-verified.
async function enumerateShippable(dir = libsRoot, prefix = '') {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      found.push(...(await enumerateShippable(join(dir, entry.name), rel)));
    } else if (extname(entry.name) === '.js') {
      found.push(rel);
    }
  }
  return found;
}

// A missing/empty `libs` array must FAIL the validation, not silently skip the
// whole supply-chain block. The old `if (manifest?.libs)` gate failed OPEN: a
// manifest with no `libs` (or a truncated/empty one) sailed past with zero
// integrity checks while ~5.7 MB of vendored blobs ship to the payment+auth
// origin un-verified. `--update-manifest` is exempt — that mode BUILDS the set.
// (A wholly unreadable manifest already pushed its own failure above; only add
// the "no libs" failure when the manifest parsed but the array is missing/empty.)
if (!updateManifest && manifest && (!Array.isArray(manifest.libs) || manifest.libs.length === 0)) {
  failures.push(
    'VENDOR-MANIFEST.json has no `libs` to verify — refusing to pass with the ' +
      'supply-chain check vacuous. Re-pin the vendored libs: ' +
      'node scripts/validate-map-fork.mjs --update-manifest',
  );
}

if (Array.isArray(manifest?.libs)) {
  if (updateManifest) {
    // Re-hash every pinned file, AND fold in any shippable file on disk that
    // isn't pinned yet — so a single --update-manifest re-pins the WHOLE set the
    // exact-set verify below will hold us to (no hand-editing 90+ tinymce blobs).
    const byFile = new Map(manifest.libs.map((lib) => [lib.file, lib]));
    for (const file of await enumerateShippable()) {
      if (!byFile.has(file)) {
        const entry = { file, name: file, version: 'unknown', byteSize: 0, sha256: '', knownAdvisories: [] };
        manifest.libs.push(entry);
        byFile.set(file, entry);
      }
    }
    manifest.libs.sort((a, b) => a.file.localeCompare(b.file));
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
    // Exact-set contract (like the other ratchets): the on-disk shippable set and
    // the pinned set must be identical. A new .js file on disk that nobody pinned
    // would otherwise ship to the payment+auth origin completely unverified — the
    // original blind spot. A pinned entry with no file on disk is dead pin debt.
    const onDisk = new Set(await enumerateShippable());
    const pinned = new Set(manifest.libs.map((lib) => lib.file));
    for (const file of onDisk) {
      if (!pinned.has(file)) {
        failures.push(
          `vendored lib ${file} ships under public/map/libs/ but is NOT pinned in ` +
            `VENDOR-MANIFEST.json — it would reach production un-verified. Audit the ` +
            `bytes for advisories, add a manifest entry, then re-pin: ` +
            `node scripts/validate-map-fork.mjs --update-manifest`,
        );
      }
    }
    for (const lib of manifest.libs) {
      if (!onDisk.has(lib.file)) {
        failures.push(`vendored lib pinned in manifest is missing on disk: ${lib.file}`);
        continue;
      }
      const actual = await hashLib(lib.file);
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
