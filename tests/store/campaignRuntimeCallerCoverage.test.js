/**
 * Exhaustive campaign-delegate caller census.
 *
 * Route declarations are derived, not listed: every UI module whose transitive
 * component/hook graph names a runtime-gated action must live below a
 * campaignLazy root. Non-UI callers are then classified exhaustively as cold
 * runtime internals, explicit preload owners, or a small manifest of store
 * actions whose only product triggers are those derived guarded roots.
 */
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import {
  dirname,
  extname,
  join,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { CAMPAIGN_CORE_ACTIONS } from '../../src/store/campaignSliceEntry.js';
import { CAMPAIGN_REGIONAL_ACTIONS } from '../../src/store/campaignRegionalSliceEntry.js';
import { CAMPAIGN_PULSE_ACTIONS } from '../../src/store/campaignWorldPulseSliceEntry.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

const GATED_ACTIONS = Object.freeze([
  ...CAMPAIGN_CORE_ACTIONS.filter(name => name !== 'retryOutbox'),
  ...CAMPAIGN_REGIONAL_ACTIONS,
  ...CAMPAIGN_PULSE_ACTIONS,
]);
const ACTION_NAMES = `(?:${GATED_ACTIONS.join('|')})`;
const ACTION_RE = new RegExp(
  `(?:\\?\\.|\\.)\\s*${ACTION_NAMES}\\b|\\b${ACTION_NAMES}\\s*\\(`,
);
const ACTION_DECLARATION_RE = new RegExp(
  `\\bfunction\\s+${ACTION_NAMES}\\s*\\(`,
  'g',
);

const BACKGROUND_CALLERS = Object.freeze({
  'src/application/commands/adapters/partyImpactRecord.js': ['InterpretApplyPanel'],
  'src/store/accountImportBody.js': ['AccountPage'],
  'src/store/aiSlice.js': ['GenerateWizard', 'SettlementsPanel'],
  'src/store/campaignMapSharePersist.js': ['WorldMap'],
  'src/store/canonEventCommandTransaction.js': ['GenerateWizard', 'SettlementsPanel'],
  'src/store/roadsRescueInflame.js': ['WorldMap', 'DmScreen'],
  'src/store/settlementLifecycleHelpers.js': ['GenerateWizard', 'SettlementsPanel'],
  'src/store/settlementSlice.js': ['GenerateWizard', 'SettlementsPanel', 'AccountPage'],
});

// Store actions can be triggered from more than one UI surface. Derive every
// caller of the public action instead of assigning its body to one convenient
// route by hand (the global Surveyor construction panel is the control case).
const ACTION_TRIGGERED_BACKGROUND = Object.freeze({
  'src/store/instantWorldBody.js': Object.freeze({
    action: 'instantWorld',
    entry: 'src/store/instantWorldSlice.js',
  }),
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const absolute = join(dir, entry);
    if (statSync(absolute).isDirectory()) walk(absolute, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(absolute);
  }
  return out;
}

function codeOnly(source) {
  let out = '';
  let state = 'code';
  for (let i = 0; i < source.length;) {
    const char = source[i];
    const next = source[i + 1];
    if (state === 'code') {
      if (char === '/' && next === '/') { state = 'line'; i += 2; continue; }
      if (char === '/' && next === '*') { state = 'block'; i += 2; continue; }
      if (char === "'") { state = 'single'; i += 1; continue; }
      if (char === '"') { state = 'double'; i += 1; continue; }
      if (char === '`') { state = 'template'; i += 1; continue; }
      out += char;
      i += 1;
      continue;
    }
    if (state === 'line' && char === '\n') { state = 'code'; out += '\n'; }
    else if (state === 'block' && char === '*' && next === '/') { state = 'code'; i += 2; continue; }
    else if (['single', 'double', 'template'].includes(state) && char === '\\') { i += 2; continue; }
    else if (state === 'single' && char === "'") state = 'code';
    else if (state === 'double' && char === '"') state = 'code';
    else if (state === 'template' && char === '`') state = 'code';
    i += 1;
  }
  return out;
}

function importSpecifiers(source, { dynamic = true } = {}) {
  // codeOnly removes literals, so parse specifiers from comment-stripped source
  // and use code only for the caller census itself.
  const executable = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const specs = new Set();
  for (const match of executable.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)) specs.add(match[1]);
  for (const match of executable.matchAll(/(?:^|[;\n])\s*import\s*['"]([^'"]+)['"]/g)) {
    specs.add(match[1]);
  }
  if (dynamic) {
    for (const match of executable.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      specs.add(match[1]);
    }
  }
  return [...specs];
}

function resolveImport(importer, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = resolve(dirname(importer), specifier);
  const extension = extname(base);
  if (extension && !/\.(?:js|jsx|mjs)$/.test(extension)) return null;
  const candidates = extension
    ? [base]
    : [`${base}.js`, `${base}.jsx`, `${base}.mjs`, join(base, 'index.js')];
  return candidates.find(candidate => existsSync(candidate) && candidate.startsWith(SRC)) || null;
}

function walkGraph(roots, dependenciesFor, stop = () => false) {
  const seen = new Set(roots);
  const queue = [...roots];
  while (queue.length > 0) {
    const importer = queue.shift();
    for (const dependency of dependenciesFor(importer)) {
      if (!stop(dependency) && !seen.has(dependency)) {
        seen.add(dependency);
        queue.push(dependency);
      }
    }
  }
  return seen;
}

function closure(root, {
  dynamic = true,
  include = () => true,
  stop = () => false,
} = {}) {
  return walkGraph([root], importer => (
    importSpecifiers(readFileSync(importer, 'utf8'), { dynamic })
      .map(specifier => resolveImport(importer, specifier))
      .filter(dependency => dependency && include(dependency))
  ), stop);
}

function lazyRoots(relativeFile) {
  const absolute = join(ROOT, relativeFile);
  const source = readFileSync(absolute, 'utf8');
  const roots = [];
  const pattern = /const\s+(\w+)\s*=\s*(campaignLazy|lazy)\(\s*\(\)\s*=>\s*import\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g;
  for (const match of source.matchAll(pattern)) {
    roots.push({
      name: match[1],
      guarded: match[2] === 'campaignLazy',
      module: resolveImport(absolute, match[3]),
    });
  }
  return roots;
}

const toRelative = absolute => relative(ROOT, absolute).replace(/\\/g, '/');
const callerCode = source => codeOnly(source).replace(ACTION_DECLARATION_RE, '');

describe('campaign runtime caller coverage', () => {
  const uiOnly = absolute => {
    const path = toRelative(absolute);
    return path.startsWith('src/components/') || path.startsWith('src/hooks/');
  };
  const uiGraphModule = absolute => (
    uiOnly(absolute)
    || ['src/App.jsx', 'src/AppViews.jsx'].includes(toRelative(absolute))
  );
  const roots = [join(SRC, 'App.jsx'), join(SRC, 'AppViews.jsx'), ...walk(SRC).filter(uiOnly)]
    .flatMap(module => lazyRoots(toRelative(module)));
  const guardedRootList = roots.filter(root => root.guarded);
  const guardedRoots = new Map(guardedRootList.map(root => [root.name, root]));
  const guardedTargets = new Set(guardedRootList.map(root => root.module));
  const guardedUi = new Set();
  for (const root of guardedRootList) {
    for (const module of closure(root.module, { include: uiGraphModule })) guardedUi.add(module);
  }
  const unarmedUi = closure(join(SRC, 'App.jsx'), {
    include: uiGraphModule,
    stop: module => guardedTargets.has(module),
  });

  const callers = walk(SRC).filter(module => (
    ACTION_RE.test(callerCode(readFileSync(module, 'utf8')))
  ));
  const runtimeClosure = closure(join(SRC, 'store/campaignRuntime.js'));
  const eagerClosure = closure(join(SRC, 'main.jsx'), { dynamic: false });

  test('the census detects a substantial live caller estate', () => {
    expect(roots.filter(root => !root.module)).toEqual([]);
    expect(guardedRootList.length).toBeGreaterThan(8);
    expect(GATED_ACTIONS.length).toBeGreaterThan(60);
    expect(callers.length).toBeGreaterThan(30);
    expect(ACTION_RE.test(callerCode('state.createCampaign(name)'))).toBe(true);
    expect(ACTION_RE.test(callerCode('// state.createCampaign(name)'))).toBe(false);
    expect(ACTION_RE.test(callerCode('function createCampaign(name) {}'))).toBe(false);
  });

  test('the unarmed app graph reaches no runtime-gated UI caller', () => {
    const unguarded = callers
      .filter(uiOnly)
      .filter(module => unarmedUi.has(module))
      .map(toRelative)
      .sort();
    expect(unguarded).toEqual([]);
  });

  test('every UI caller is live below at least one derived campaignLazy boundary', () => {
    const deadOrUnowned = callers
      .filter(uiOnly)
      .filter(module => !guardedUi.has(module))
      .map(toRelative)
      .sort();
    expect(deadOrUnowned).toEqual([]);
  });

  test('a guarded path cannot hide the same caller on an ordinary path', () => {
    const edges = new Map([
      ['ordinary', ['shared-caller']],
      ['guarded', ['shared-caller']],
      ['shared-caller', []],
    ]);
    const armed = walkGraph(['guarded'], node => edges.get(node) || []);
    const unarmed = walkGraph(
      ['ordinary'],
      node => edges.get(node) || [],
      node => node === 'guarded',
    );

    expect(armed.has('shared-caller')).toBe(true);
    expect(unarmed.has('shared-caller')).toBe(true);
    expect(['shared-caller'].filter(caller => unarmed.has(caller)))
      .toEqual(['shared-caller']);
  });

  test('the Compendium path stops at its nested campaign lifecycle gate', () => {
    const compendium = roots.find(root => root.name === 'CompendiumPanel')?.module;
    const lifecycle = guardedRoots.get('CampaignContentBindingLifecycle')?.module;
    expect(unarmedUi.has(compendium)).toBe(true);
    expect(guardedTargets.has(lifecycle)).toBe(true);
    expect(unarmedUi.has(lifecycle)).toBe(false);
  });

  test('every non-UI caller has a cold-runtime, explicit-preload, or guarded-trigger owner', () => {
    const unexplained = [];
    for (const module of callers.filter(candidate => !uiOnly(candidate))) {
      const path = toRelative(module);
      const runtimeOnly = runtimeClosure.has(module) && !eagerClosure.has(module);
      const explicitPreload = readFileSync(module, 'utf8').includes('preloadCampaignRuntime');
      const triggerRoots = BACKGROUND_CALLERS[path];
      const actionTrigger = ACTION_TRIGGERED_BACKGROUND[path];
      if (runtimeOnly || explicitPreload) continue;
      if (actionTrigger) {
        const entry = join(ROOT, actionTrigger.entry);
        const entryOwnsBody = closure(entry).has(module);
        const entryPreloads = readFileSync(entry, 'utf8').includes('preloadCampaignRuntime');
        if (entryOwnsBody && entryPreloads) continue;
      }
      if (triggerRoots?.every(name => guardedRoots.has(name))) continue;
      unexplained.push(path);
    }
    expect(unexplained.sort()).toEqual([]);
  });

  test('the background manifest has no stale or unguarded trigger entries', () => {
    const callerPaths = new Set(callers.map(toRelative));
    const stale = Object.entries(BACKGROUND_CALLERS).flatMap(([path, triggerRoots]) => {
      if (!callerPaths.has(path)) return [`${path}: no longer a caller`];
      return triggerRoots
        .filter(name => !guardedRoots.has(name))
        .map(name => `${path}: ${name} is not campaignLazy`);
    });
    expect(stale).toEqual([]);
  });

  test('action-triggered background callers derive every armed and unarmed UI trigger', () => {
    for (const [backgroundPath, { action, entry: entryPath }] of Object.entries(
      ACTION_TRIGGERED_BACKGROUND,
    )) {
      const background = join(ROOT, backgroundPath);
      const entry = join(ROOT, entryPath);
      expect(closure(entry).has(background)).toBe(true);

      const actionRead = new RegExp(`(?:\\.|\\?\\.)\\s*${action}\\b`);
      const uiCallers = walk(SRC).filter(module => (
        uiOnly(module) && actionRead.test(callerCode(readFileSync(module, 'utf8')))
      ));
      const unarmedCallers = uiCallers.filter(module => unarmedUi.has(module));

      expect(uiCallers.map(toRelative)).toEqual(expect.arrayContaining([
        'src/components/instant/InstantWorldEntry.jsx',
        'src/components/surveyor/ConstructionPanel.jsx',
      ]));
      expect(unarmedCallers.map(toRelative)).toContain(
        'src/components/surveyor/ConstructionPanel.jsx',
      );
      expect(
        readFileSync(entry, 'utf8'),
        `${entryPath} must preload campaign runtime before ${action} reaches ${backgroundPath}`,
      ).toContain('preloadCampaignRuntime');
    }
  });
});
