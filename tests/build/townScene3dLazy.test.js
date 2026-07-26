/**
 * Production boundary and promotion-honesty contract for the 3D settlement
 * portrait.
 *
 * The portrait is a selectable, lazy projection over canonical settlement
 * truth. It is intentionally not the shipped default yet. This file proves:
 *
 *   1. availability and default promotion use separate flags;
 *   2. the map presentation reaches the viewer through import(), never a static
 *      edge;
 *   3. Three.js is confined to that lazy view directory;
 *   4. a stable scene sentinel is absent from first paint and modulepreloads;
 *   5. a fresh production build contains the sentinel somewhere, so the
 *      absence proof cannot pass on an implementation that was never shipped;
 *   6. persisted `portrait3d` ids remain backward-compatible; and
 *   7. local proof cannot silently satisfy the external promotion gates.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  buildTownSceneCertificationReceipt,
  evaluateTownSceneGate,
  fingerprintTownSceneSource,
} from '../../scripts/audit/town-scene-certification.mjs';
import { FLAG_DEFAULTS } from '../../src/lib/flagRegistry.js';
import {
  normalizeTownMapView,
  TOWN_MAP_VIEW_IDS,
} from '../../src/lib/lastMapView.js';

const ROOT = resolve(process.cwd());
const SRC_ROOT = join(ROOT, 'src');
const DIST_ROOT = join(ROOT, 'dist');
const ASSETS_ROOT = join(DIST_ROOT, 'assets');
const DIST_EXISTS = existsSync(DIST_ROOT) && existsSync(ASSETS_ROOT);
const REQUIRE_DIST = process.env.VERIFY_DIST === '1';
const SCENE_SENTINEL = 'settlementforge:town-scene-3d:lazy-v1';
const EXPORT_SENTINEL = 'settlementforge:town-scene-export:lazy-v1';
const THREE_CHUNK_RE = /^three\.module-[A-Za-z0-9_-]+\.js$/;
const SCENE_WORKER_RE = /^townScene\.worker-[A-Za-z0-9_-]+\.js$/;
const MANIFEST_COMPILER_RE =
  /^compileTownSceneManifest-[A-Za-z0-9_-]+\.js$/;
const EXPORT_WORKER_RE = /^townSceneExport\.worker-[A-Za-z0-9_-]+\.js$/;
const PRESENTATION_PATH = join(
  SRC_ROOT,
  'components/townMap/SettlementMapPresentation.jsx',
);
const PANE_PATH = join(
  SRC_ROOT,
  'components/townMap/SettlementMapPane.jsx',
);
const EXPORT_MENU_PATH = join(
  SRC_ROOT,
  'components/townMap/SettlementMapExportMenu.jsx',
);
const EXPORT_CLIENT_PATH = join(
  SRC_ROOT,
  'lib/townScene/townSceneExport.js',
);
const VIEWER_PATH = join(
  SRC_ROOT,
  'components/townMap/scene3d/SettlementScene3D.jsx',
);
const VIEW_DIRECTORY = 'src/components/townMap/scene3d/';
const CONTRACT_PATH = join(
  ROOT,
  'docs/TOWN_SCENE_PROMOTION_CONTRACT.json',
);
const CERTIFICATION_AUDIT_PATH = join(
  ROOT,
  'scripts/audit/town-scene-certification.mjs',
);

function codeWithoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function walkJavaScript(directory, out = []) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      walkJavaScript(path, out);
    } else if (/\.(js|jsx|mjs)$/.test(entry)) {
      out.push(path);
    }
  }
  return out;
}

function findEntryChunk() {
  const html = readFileSync(join(DIST_ROOT, 'index.html'), 'utf8');
  const match = html.match(
    /<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/,
  );
  if (!match) {
    throw new Error(
      'Could not locate the production entry module in dist/index.html.',
    );
  }
  return match[1];
}

function staticImportSpecifiers(source) {
  const specifiers = new Set();
  const from = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bare = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let match;
  while ((match = from.exec(source)) !== null) {
    specifiers.add(match[1].replace('./', ''));
  }
  while ((match = bare.exec(source)) !== null) {
    specifiers.add(match[1].replace('./', ''));
  }
  return [...specifiers];
}

function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    const source = readFileSync(join(ASSETS_ROOT, file), 'utf8');
    for (const dependency of staticImportSpecifiers(source)) {
      if (!seen.has(dependency)) {
        seen.add(dependency);
        queue.push(dependency);
      }
    }
  }
  return [...seen];
}

function sentinelCarriers(sentinel) {
  return readdirSync(ASSETS_ROOT)
    .filter((file) => file.endsWith('.js'))
    .filter((file) => (
      readFileSync(join(ASSETS_ROOT, file), 'utf8').includes(sentinel)
    ));
}

describe('town-scene 3D source boundary', () => {
  it('ships availability on while withholding default promotion', () => {
    expect(FLAG_DEFAULTS.settlementScene3d).toBe(true);
    expect(FLAG_DEFAULTS.settlementScene3dDefault).toBe(false);
  });

  it('keeps portrait3d as a stable, shape-guarded persisted view id', () => {
    expect(TOWN_MAP_VIEW_IDS).toEqual([
      'plan',
      'panorama',
      'portrait3d',
    ]);
    expect(normalizeTownMapView('portrait3d')).toBe('portrait3d');
    expect(normalizeTownMapView('panorama')).toBe('panorama');
    expect(normalizeTownMapView('future-or-corrupt')).toBe('plan');
    expect(normalizeTownMapView(null)).toBe('plan');
  });

  it('loads the public scene viewer only through React.lazy + import()', () => {
    expect(existsSync(PRESENTATION_PATH)).toBe(true);
    expect(existsSync(VIEWER_PATH)).toBe(true);
    const source = codeWithoutComments(
      readFileSync(PRESENTATION_PATH, 'utf8'),
    );
    expect(source).toMatch(
      /lazy\s*\(\s*\(\)\s*=>\s*import\s*\(\s*['"]\.\/scene3d\/SettlementScene3D\.jsx['"]\s*\)\s*\)/,
    );
    expect(source).not.toMatch(
      /\bfrom\s+['"]\.\/scene3d\/SettlementScene3D\.jsx['"]/,
    );
  });

  it('returns fallback focus to Plan and keeps every scene failure on that path', () => {
    const source = codeWithoutComments(
      readFileSync(PRESENTATION_PATH, 'utf8'),
    );
    expect(source).toMatch(
      /const\s+handleSceneFallback\s*=\s*\(detail\)\s*=>\s*\{/,
    );
    expect(source).toMatch(/onSceneFallback\?\.\(detail\)/);
    expect(source).toMatch(
      /querySelector\(\s*['"]button['"]\s*\)\?\.\s*focus\(\)/,
    );
    expect(source).toMatch(/requestAnimationFrame\(focusPlan\)/);
    expect(source).toMatch(
      /<SceneBoundary\s+onFallback=\{handleSceneFallback\}>/,
    );
    expect(source).toMatch(
      /<SettlementScene3D\s+\{\.\.\.sceneProps\}\s+onFallback=\{handleSceneFallback\}/,
    );
  });

  it('keeps the mounted plan inert in Portrait while retaining shared export', () => {
    const source = codeWithoutComments(readFileSync(PANE_PATH, 'utf8'));
    expect(source).toContain(
      "const portraitActive = presentedViewMode === 'portrait3d';",
    );
    expect(source).toMatch(
      /<svg[\s\S]*aria-hidden=\{portraitActive\s*\?\s*['"]true['"]\s*:\s*undefined\}/,
    );
    expect(source).toMatch(
      /<svg[\s\S]*inert=\{portraitActive\s*\?\s*true\s*:\s*undefined\}/,
    );
    expect(source).toContain(
      "visibility: portraitActive ? 'hidden' : 'visible'",
    );
    expect(source).toContain(
      "pointerEvents: portraitActive ? 'none' : 'auto'",
    );
    expect(source).toMatch(
      /<div\s+data-town-plan-chrome\s+hidden=\{portraitActive\}\s+inert=\{portraitActive\s*\?\s*true\s*:\s*undefined\}>/,
    );

    const exportIndex = source.indexOf('<SettlementMapExportMenu');
    const planChromeIndex = source.indexOf('<div data-town-plan-chrome');
    expect(exportIndex).toBeGreaterThan(-1);
    expect(planChromeIndex).toBeGreaterThan(exportIndex);
  });

  it('places the stable minification-safe sentinel inside the lazy viewer', () => {
    const source = readFileSync(VIEWER_PATH, 'utf8');
    expect(source).toContain(SCENE_SENTINEL);
  });

  it('confines every Three.js import to the lazy scene view directory', () => {
    const users = [];
    for (const path of walkJavaScript(SRC_ROOT)) {
      const source = codeWithoutComments(readFileSync(path, 'utf8'));
      const importsThree = (
        /\bfrom\s+['"]three(?:\/[^'"]*)?['"]/.test(source)
        || /\bimport\s*\(\s*['"]three(?:\/[^'"]*)?['"]\s*\)/.test(source)
      );
      if (importsThree) {
        users.push(path.slice(ROOT.length + 1));
      }
    }

    expect(
      users.length,
      'The production portrait exists, so at least one lazy view module must load Three.',
    ).toBeGreaterThan(0);
    for (const path of users) {
      expect(
        path,
        `${path} imports Three outside the certified lazy-view boundary`,
      ).toMatch(new RegExp(`^${VIEW_DIRECTORY}`));
    }
  });

  it('uses an explicit worker URL rather than compiling the full scene in UI code', () => {
    const client = readFileSync(
      join(SRC_ROOT, 'lib/townScene/townSceneWorkerClient.js'),
      'utf8',
    );
    const viewer = codeWithoutComments(readFileSync(VIEWER_PATH, 'utf8'));
    const worker = codeWithoutComments(readFileSync(
      join(SRC_ROOT, 'workers/townScene.worker.js'),
      'utf8',
    ));
    expect(client).toMatch(
      /new\s+Worker\s*\(\s*new\s+URL\s*\(\s*['"][^'"]*townScene\.worker\.js['"]\s*,\s*import\.meta\.url\s*\)/,
    );
    expect(client).toMatch(/generationId/);
    expect(client).toMatch(/terminate\s*\(/);
    expect(viewer).toContain('prepareTownSceneCompileInput');
    expect(viewer).toMatch(/workerClient\.compile\(\s*compileInput/);
    expect(viewer).not.toContain('compileTownSceneManifest');
    expect(worker).toContain('compileTownSceneManifestFromAuthorizedInput');
    expect(worker).toMatch(
      /import\s*\(\s*['"]\.\.\/domain\/townScene\/compileTownSceneManifest\.js['"]\s*\)/,
    );
    expect(worker.indexOf("type: 'manifest'"))
      .toBeLessThan(worker.indexOf('compileTownSceneGeometry(manifest'));
  });

  it('keeps deterministic PNG/GLB export behind click-lazy module and worker boundaries', () => {
    const menu = codeWithoutComments(
      readFileSync(EXPORT_MENU_PATH, 'utf8'),
    );
    expect(menu).toMatch(
      /import\s*\(\s*['"]\.\.\/\.\.\/lib\/townScene\/townSceneExport\.js['"]\s*\)/,
    );
    expect(menu).not.toMatch(
      /\bfrom\s+['"]\.\.\/\.\.\/lib\/townScene\/townSceneExport\.js['"]/,
    );

    const client = readFileSync(EXPORT_CLIENT_PATH, 'utf8');
    expect(client).toContain(EXPORT_SENTINEL);
    expect(client).toMatch(
      /new\s+Worker\s*\(\s*new\s+URL\s*\(\s*['"][^'"]*townSceneExport\.worker\.js['"]\s*,\s*import\.meta\.url\s*\)/,
    );
    expect(client).toMatch(/requestId/);
    expect(client).toMatch(/terminate\s*\(/);
  });
});

describe('town-scene promotion contract distinguishes proof classes', () => {
  const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));

  it('agrees with the shipped flags and retains explicit external gates', () => {
    expect(contract.feature).toMatchObject({
      implementationStatus: 'capability_implemented_available_opt_in',
      promotionStatus: 'withheld_pending_current_receipts',
      availabilityFlag: 'settlementScene3d',
      availabilityShippedDefault: true,
      defaultFlag: 'settlementScene3dDefault',
      defaultShippedDefault: false,
      currentDecision: 'withheld_pending_evidence',
      fallbackView: 'plan',
      persisted3dView: 'portrait3d',
    });
    expect(contract.localGates.length).toBeGreaterThan(0);
    expect(contract.externalGates.length).toBeGreaterThan(0);
    const ids = [
      ...contract.localGates.map((gate) => gate.id),
      ...contract.externalGates.map((gate) => gate.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('emits an honest withhold receipt when no evidence exists', () => {
    const receipt = buildTownSceneCertificationReceipt(
      contract,
      null,
      null,
    );
    expect(receipt.local.passed).toBe(0);
    expect(receipt.external.passed).toBe(0);
    expect(receipt.eligibleForDefault).toBe(false);
    expect(receipt.decision).toBe('withhold_default');
    expect(receipt.contract).toMatchObject({
      implementationStatus: 'capability_implemented_available_opt_in',
      promotionStatus: 'withheld_pending_current_receipts',
    });
    expect(receipt.flags).toEqual({
      settlementScene3d: true,
      settlementScene3dDefault: false,
    });
  });

  it('fingerprints the complete local dependency closure, not only curated entries', () => {
    const source = fingerprintTownSceneSource(contract);
    expect(source.files.length).toBeGreaterThan(source.entryFiles.length);
    expect(source.files).toEqual(expect.arrayContaining([
      'src/components/townMap/scene3d/threeSceneRuntime.js',
      'src/domain/spatial/spatialSubstrate.js',
      'src/lib/townScene/townSceneExport.js',
      'src/workers/townScene.worker.js',
      'src/workers/townSceneExport.worker.js',
    ]));
  });

  it('tracks transitive, lazy, and worker dependencies and fails on a broken edge', () => {
    const fixtureDirectory = join(
      ROOT,
      'artifacts/town-scene/test-fixtures',
      `dependency-closure-${process.pid}`,
    );
    const nestedDirectory = join(fixtureDirectory, 'nested');
    const seedPath = join(fixtureDirectory, 'entry.mjs');
    const dependencyPath = join(nestedDirectory, 'dependency.js');
    const leafPath = join(nestedDirectory, 'leaf.js');
    const lazyPath = join(fixtureDirectory, 'lazy.js');
    const workerPath = join(fixtureDirectory, 'worker.js');
    const fixturePaths = [
      seedPath,
      dependencyPath,
      leafPath,
      lazyPath,
      workerPath,
    ];
    mkdirSync(nestedDirectory, { recursive: true });
    writeFileSync(seedPath, [
      "import './nested/dependency.js';",
      "import('./lazy.js');",
      "new URL('./worker.js', import.meta.url);",
      '',
    ].join('\n'));
    writeFileSync(
      dependencyPath,
      "export { leaf } from './leaf.js';\n",
    );
    writeFileSync(leafPath, "export const leaf = 'first';\n");
    writeFileSync(lazyPath, "export const lazy = true;\n");
    writeFileSync(workerPath, "self.onmessage = () => {};\n");

    const fixtureContract = {
      sourceRoots: [{
        path: seedPath.slice(ROOT.length + 1),
        required: true,
      }],
    };

    try {
      const first = fingerprintTownSceneSource(fixtureContract);
      expect(first.entryFiles).toEqual([
        seedPath.slice(ROOT.length + 1),
      ]);
      expect(first.files).toEqual(
        fixturePaths.map((path) => path.slice(ROOT.length + 1)).sort(),
      );

      writeFileSync(leafPath, "export const leaf = 'second';\n");
      const changed = fingerprintTownSceneSource(fixtureContract);
      expect(changed.value).not.toBe(first.value);

      writeFileSync(
        dependencyPath,
        "export { missing } from './missing.js';\n",
      );
      expect(
        () => fingerprintTownSceneSource(fixtureContract),
      ).toThrow(/Unresolved local fingerprint dependency/);
    } finally {
      for (const path of fixturePaths) {
        if (existsSync(path)) unlinkSync(path);
      }
      if (existsSync(nestedDirectory)) rmdirSync(nestedDirectory);
      if (existsSync(fixtureDirectory)) rmdirSync(fixtureDirectory);
    }
  });

  it('keeps the CLI non-destructive while making promotion enforcement fail closed', () => {
    const missingEvidence = (
      `artifacts/town-scene/test-fixtures/missing-${process.pid}.json`
    );
    const baseline = spawnSync(process.execPath, [
      CERTIFICATION_AUDIT_PATH,
      '--evidence',
      missingEvidence,
      '--no-write',
    ], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(baseline.status).toBe(0);
    expect(JSON.parse(baseline.stdout)).toMatchObject({
      decision: 'withhold_default',
      eligibleForDefault: false,
      evidenceSupplied: false,
    });

    const required = spawnSync(process.execPath, [
      CERTIFICATION_AUDIT_PATH,
      '--evidence',
      missingEvidence,
      '--require-promotion',
      '--no-write',
    ], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(required.status).not.toBe(0);
    expect(required.stderr).toContain('default promotion is withheld');

    const escapedOutput = spawnSync(process.execPath, [
      CERTIFICATION_AUDIT_PATH,
      '--out',
      'package.json',
      '--no-write',
    ], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(escapedOutput.status).not.toBe(0);
    expect(escapedOutput.stderr).toContain(
      'receipt path must remain below artifacts/town-scene',
    );
  });

  it('rejects boolean-only and stale evidence instead of treating it as proof', () => {
    const source = fingerprintTownSceneSource(contract);
    const gate = contract.externalGates[0];
    expect(
      evaluateTownSceneGate(gate, true, source.value),
    ).toMatchObject({ status: 'malformed' });
    expect(
      evaluateTownSceneGate(gate, {
        passed: true,
        gateId: gate.id,
        evidenceKind: gate.evidenceKind,
        producer: 'device-lab-workflow',
        summary: 'Representative devices completed the required matrix.',
        capturedAt: '2026-07-24T12:00:00.000Z',
        evidenceRefs: ['device-lab/receipt.json'],
        sourceFingerprint: 'stale-source',
      }, source.value, Date.parse('2026-07-24T13:00:00.000Z')),
    ).toMatchObject({ status: 'stale' });
  });

  it('enforces proof class, accountability, clock sanity, and freshness', () => {
    const source = fingerprintTownSceneSource(contract);
    const gate = contract.externalGates[0];
    const base = {
      passed: true,
      gateId: gate.id,
      evidenceKind: gate.evidenceKind,
      producer: 'physical-device-lab',
      summary: 'The declared browser and device matrix completed.',
      capturedAt: '2026-07-24T12:00:00.000Z',
      evidenceRefs: [{ path: 'not-reached', sha256: '0'.repeat(64) }],
      sourceFingerprint: source.value,
    };
    const evaluatedAt = Date.parse('2026-07-24T13:00:00.000Z');

    expect(evaluateTownSceneGate(
      gate,
      { ...base, evidenceKind: 'automated' },
      source.value,
      evaluatedAt,
    )).toMatchObject({ status: 'malformed' });
    expect(evaluateTownSceneGate(
      gate,
      { ...base, producer: '' },
      source.value,
      evaluatedAt,
    )).toMatchObject({ status: 'malformed' });
    expect(evaluateTownSceneGate(
      gate,
      { ...base, capturedAt: '2026-07-24T13:06:00.000Z' },
      source.value,
      evaluatedAt,
    )).toMatchObject({ status: 'malformed' });
    expect(evaluateTownSceneGate(
      gate,
      { ...base, capturedAt: '2026-06-23T12:00:00.000Z' },
      source.value,
      evaluatedAt,
    )).toMatchObject({
      status: 'stale',
      maxAgeDays: 30,
    });
  });

  it('accepts a current record only after verifying its referenced artifact digest', () => {
    const source = fingerprintTownSceneSource(contract);
    const gate = contract.localGates[0];
    const artifactDirectory = join(
      ROOT,
      'artifacts/town-scene/test-fixtures',
    );
    const artifactPath = join(
      artifactDirectory,
      `audit-evidence-${process.pid}.json`,
    );
    const artifactBody = '{"observed":true}\n';
    mkdirSync(artifactDirectory, { recursive: true });
    writeFileSync(artifactPath, artifactBody, 'utf8');

    try {
      const result = evaluateTownSceneGate(gate, {
        passed: true,
        gateId: gate.id,
        evidenceKind: gate.evidenceKind,
        producer: 'vitest town-scene certification fixture',
        summary: 'The audit verified a real artifact and its digest.',
        capturedAt: '2026-07-24T12:00:00.000Z',
        evidenceRefs: [{
          path: artifactPath.slice(ROOT.length + 1),
          sha256: createHash('sha256').update(artifactBody).digest('hex'),
        }],
        sourceFingerprint: source.value,
      }, source.value);
      expect(result).toMatchObject({
        id: gate.id,
        status: 'passed',
      });
    } finally {
      if (existsSync(artifactPath)) unlinkSync(artifactPath);
      if (
        existsSync(artifactDirectory)
        && readdirSync(artifactDirectory).length === 0
      ) {
        rmdirSync(artifactDirectory);
      }
    }
  });
});

describe('town-scene 3D production lazy boundary', () => {
  it('does not let VERIFY_DIST pass without a production build', () => {
    expect(
      !REQUIRE_DIST || DIST_EXISTS,
      'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first.',
    ).toBe(true);
  });
});

describe.runIf(DIST_EXISTS)('town-scene 3D production lazy boundary', () => {
  it('keeps the scene sentinel out of the entry transitive static closure', () => {
    const closure = entryStaticClosure();
    const leaked = closure.filter((file) => (
      [SCENE_SENTINEL, EXPORT_SENTINEL].some((sentinel) => (
        readFileSync(join(ASSETS_ROOT, file), 'utf8').includes(sentinel)
      ))
    ));
    expect(
      leaked,
      `The 3D settlement viewer reached first paint through: ${leaked.join(', ')}`,
    ).toEqual([]);
  });

  it('keeps the Three runtime out of the entry transitive static closure', () => {
    const closure = entryStaticClosure();
    const threeChunks = readdirSync(ASSETS_ROOT).filter(
      (file) => THREE_CHUNK_RE.test(file),
    );
    expect(
      closure.filter((file) => threeChunks.includes(file)),
      'The Three runtime entered the first-paint static closure.',
    ).toEqual([]);
  });

  it.skipIf(!REQUIRE_DIST)(
    'contains the scene sentinel somewhere in a fresh build (anti-vacuity)',
    () => {
      expect(
        sentinelCarriers(SCENE_SENTINEL),
        'No built chunk contains the lazy-view sentinel.',
      ).not.toEqual([]);
      expect(
        sentinelCarriers(EXPORT_SENTINEL),
        'No built chunk contains the click-lazy Portrait-export sentinel.',
      ).not.toEqual([]);
    },
  );

  it.skipIf(!REQUIRE_DIST)(
    'emits bounded Three, worker, manifest-compiler, and export payloads',
    () => {
      const assets = readdirSync(ASSETS_ROOT);
      const threeChunks = assets.filter((file) => THREE_CHUNK_RE.test(file));
      const sceneWorkers = assets.filter((file) => SCENE_WORKER_RE.test(file));
      const manifestCompilers = assets.filter(
        (file) => MANIFEST_COMPILER_RE.test(file),
      );
      const exportWorkers = assets.filter((file) => EXPORT_WORKER_RE.test(file));
      expect(threeChunks).toHaveLength(1);
      expect(sceneWorkers).toHaveLength(1);
      expect(manifestCompilers).toHaveLength(1);
      expect(exportWorkers).toHaveLength(1);

      const threeBytes = statSync(join(ASSETS_ROOT, threeChunks[0])).size;
      const workerBytes = statSync(join(ASSETS_ROOT, sceneWorkers[0])).size;
      const manifestCompilerBytes = statSync(
        join(ASSETS_ROOT, manifestCompilers[0]),
      ).size;
      const exportWorkerBytes = statSync(
        join(ASSETS_ROOT, exportWorkers[0]),
      ).size;
      // The low guards catch an empty/placeholder artifact without penalizing
      // future tree-shaking. The upper guards catch accidental dependency or
      // compiler growth; reducing either payload is always allowed.
      expect(threeBytes).toBeGreaterThan(10_000);
      expect(threeBytes).toBeLessThan(1_100_000);
      expect(workerBytes).toBeGreaterThan(1_000);
      expect(workerBytes).toBeLessThan(300_000);
      expect(manifestCompilerBytes).toBeGreaterThan(10_000);
      expect(manifestCompilerBytes).toBeLessThan(350_000);
      expect(workerBytes + manifestCompilerBytes).toBeLessThan(400_000);
      expect(exportWorkerBytes).toBeGreaterThan(5_000);
      expect(exportWorkerBytes).toBeLessThan(1_500_000);
    },
  );

  it.skipIf(!REQUIRE_DIST)(
    'does not modulepreload the scene, Three runtime, or worker from index.html',
    () => {
      const html = readFileSync(join(DIST_ROOT, 'index.html'), 'utf8');
      const protectedAssets = [
        ...sentinelCarriers(SCENE_SENTINEL),
        ...sentinelCarriers(EXPORT_SENTINEL),
        ...readdirSync(ASSETS_ROOT).filter(
          (file) => (
            THREE_CHUNK_RE.test(file)
            || SCENE_WORKER_RE.test(file)
            || MANIFEST_COMPILER_RE.test(file)
            || EXPORT_WORKER_RE.test(file)
          ),
        ),
      ];
      const preloaded = protectedAssets.filter((file) => (
        new RegExp(
          `<link\\s+rel="modulepreload"[^>]*href="[^"]*${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
        ).test(html)
      ));
      expect(
        preloaded,
        `Lazy 3D scene chunks were first-paint modulepreloaded: ${preloaded.join(', ')}`,
      ).toEqual([]);
    },
  );
});
