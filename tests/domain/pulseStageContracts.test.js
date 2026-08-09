import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import {
  PULSE_STAGE_RESULT_KIND,
  normalizePulseStageResult,
  unchangedPulseStageResult,
} from '../../src/domain/worldPulse/pulseStageResult.js';
import {
  PULSE_SUBSTAGE_CONTRACTS,
  PULSE_SUBSTAGE_MANIFEST_VERSION,
} from '../../src/domain/worldPulse/pulseStageManifest.js';
import {
  LEDGER_OWNERSHIP_MANIFEST,
  LEDGER_OWNERSHIP_MANIFEST_VERSION,
} from '../../src/domain/worldPulse/ledgerOwnershipManifest.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

function walkSourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkSourceFiles(path, out);
    else if (/\.(?:[cm]?[jt]sx?)$/.test(entry.name)) out.push(path);
  }
  return out;
}

const SOURCES = walkSourceFiles(join(ROOT, 'src')).map((path) => ({
  rel: relative(ROOT, path).replace(/\\/g, '/'),
  source: readFileSync(path, 'utf8'),
}));

function scriptKind(rel) {
  if (rel.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (rel.endsWith('.ts')) return ts.ScriptKind.TS;
  if (rel.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function parse(rel, source) {
  return ts.createSourceFile(rel, source, ts.ScriptTarget.Latest, true, scriptKind(rel));
}

function namedFunction(node) {
  if (ts.isFunctionDeclaration(node) && node.name) return node.name.text;
  if ((ts.isFunctionExpression(node) || ts.isArrowFunction(node))
    && ts.isVariableDeclaration(node.parent) && ts.isIdentifier(node.parent.name)) {
    return node.parent.name.text;
  }
  if (ts.isMethodDeclaration(node) && node.name && ts.isIdentifier(node.name)) return node.name.text;
  return null;
}

/** Discover direct persistence owners from executable syntax, never comments or strings. */
function spatialLedgerWritersOf(sources, ledger) {
  const writers = new Set();
  for (const { rel, source } of sources) {
    if (!source.includes(ledger)) continue;
    const sourceFile = parse(rel, source);
    const persistenceCalls = new Set(['setSpatialLedger', 'dropSpatialLedger']);
    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings
        || !ts.isNamedImports(statement.importClause.namedBindings)) continue;
      for (const specifier of statement.importClause.namedBindings.elements) {
        const imported = specifier.propertyName?.text || specifier.name.text;
        if (persistenceCalls.has(imported)) persistenceCalls.add(specifier.name.text);
      }
    }
    const visit = (node, owner = null) => {
      const nextOwner = namedFunction(node) || owner;
      const directCall = ts.isCallExpression(node) && (
        (ts.isIdentifier(node.expression) && persistenceCalls.has(node.expression.text))
        || (ts.isPropertyAccessExpression(node.expression)
          && persistenceCalls.has(node.expression.name.text))
      );
      if (directCall && ts.isCallExpression(node)) {
        const key = node.arguments[1];
        if (key && (ts.isStringLiteral(key) || ts.isNoSubstitutionTemplateLiteral(key)) && key.text === ledger) {
          writers.add(`${rel}#${nextOwner || '<module>'}`);
        }
      }
      ts.forEachChild(node, (child) => visit(child, nextOwner));
    };
    visit(sourceFile);
  }
  return [...writers].sort();
}

function propertyNamesLedger(name, ledger, constantName) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text === ledger;
  if (!ts.isComputedPropertyName(name)) return false;
  const expression = name.expression;
  return (ts.isIdentifier(expression) && expression.text === constantName)
    || (ts.isStringLiteral(expression) && expression.text === ledger);
}

function memberNamesLedger(node, ledger, constantName) {
  if (ts.isPropertyAccessExpression(node)) return node.name.text === ledger;
  if (!ts.isElementAccessExpression(node) || !node.argumentExpression) return false;
  const argument = node.argumentExpression;
  return (ts.isIdentifier(argument) && argument.text === constantName)
    || (ts.isStringLiteral(argument) && argument.text === ledger);
}

function objectLedgerWritersOf(sources, ledger, constantName) {
  const writers = new Set();
  for (const { rel, source } of sources) {
    if (!source.includes(ledger) && !source.includes(constantName)) continue;
    const sourceFile = parse(rel, source);
    const visit = (node, owner = null) => {
      const nextOwner = namedFunction(node) || owner;
      const propertyWrite = ts.isPropertyAssignment(node)
        && propertyNamesLedger(node.name, ledger, constantName);
      const assignmentWrite = ts.isBinaryExpression(node)
        && node.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && memberNamesLedger(node.left, ledger, constantName);
      const deleteWrite = ts.isDeleteExpression(node)
        && memberNamesLedger(node.expression, ledger, constantName);
      if (propertyWrite || assignmentWrite || deleteWrite) {
        writers.add(`${rel}#${nextOwner || '<module>'}`);
      }
      ts.forEachChild(node, (child) => visit(child, nextOwner));
    };
    visit(sourceFile);
  }
  return [...writers].sort();
}

function callBindings(host, callSymbol) {
  const source = read(host.module);
  const sourceFile = parse(host.module, source);
  /** @type {import('typescript').FunctionDeclaration | null} */
  let hostFunction = null;
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === host.symbol) hostFunction = node;
  });
  expect(hostFunction, `${host.module}:${host.symbol} must remain a function`).toBeTruthy();
  const calls = [];
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === callSymbol) {
      calls.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(/** @type {import('typescript').FunctionDeclaration} */ (hostFunction));
  expect(calls, `${callSymbol} must have one live host call`).toHaveLength(1);
  const argument = calls[0].arguments[0];
  expect(ts.isObjectLiteralExpression(argument), `${callSymbol} must receive one object contract`).toBe(true);
  return /** @type {import('typescript').ObjectLiteralExpression} */ (argument).properties.map((property) => {
    if (ts.isShorthandPropertyAssignment(property)) {
      return { port: property.name.text, expression: property.name.text };
    }
    expect(ts.isPropertyAssignment(property), `${callSymbol} inputs cannot be spread`).toBe(true);
    const assignment = /** @type {import('typescript').PropertyAssignment} */ (property);
    const name = assignment.name;
    expect(ts.isIdentifier(name) || ts.isStringLiteral(name), `${callSymbol} input must have a static name`).toBe(true);
    return {
      port: /** @type {import('typescript').Identifier | import('typescript').StringLiteral} */ (name).text,
      expression: assignment.initializer.getText(sourceFile),
    };
  });
}

function functionBody(source, symbol) {
  const declaration = new RegExp(`export\\s+(?:async\\s+)?function\\s+${symbol}\\s*\\(`);
  const match = declaration.exec(source);
  expect(match, `${symbol} must be an exported function`).toBeTruthy();
  let cursor = source.indexOf('(', /** @type {RegExpExecArray} */ (match).index);
  let parens = 0;
  for (; cursor < source.length; cursor += 1) {
    if (source[cursor] === '(') parens += 1;
    else if (source[cursor] === ')' && --parens === 0) break;
  }
  const open = source.indexOf('{', cursor);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}' && --depth === 0) return source.slice(open, i + 1);
  }
  throw new Error(`unbalanced body for ${symbol}`);
}

function expectRef(ref) {
  const source = read(ref.module);
  const body = functionBody(source, ref.symbol);
  expect(body.length, `${ref.module}:${ref.symbol}`).toBeGreaterThan(2);
  if (ref.evidence) expect(body, `${ref.module}:${ref.symbol} evidence`).toContain(ref.evidence);
}

describe('common pulse-stage result envelope', () => {
  it('preserves the original world reference on a no-op and freezes copied arrays', () => {
    const prior = { tick: 7 };
    const accidentalFreshState = { tick: 7 };
    const newsEntries = [{ kind: 'test' }];
    const result = normalizePulseStageResult({
      changed: false,
      worldState: accidentalFreshState,
      newsEntries,
      effects: ['one'],
    }, prior);

    expect(result.kind).toBe(PULSE_STAGE_RESULT_KIND);
    expect(result.worldState).toBe(prior);
    expect(result.worldState).not.toBe(accidentalFreshState);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.newsEntries)).toBe(true);
    expect(Object.isFrozen(result.effects)).toBe(true);
    expect(result.newsEntries).not.toBe(newsEntries);
    newsEntries.push({ kind: 'late_mutation' });
    expect(result.newsEntries).toEqual([{ kind: 'test' }]);
  });

  it('keeps a changed world reference and provides a canonical unchanged constructor', () => {
    const prior = { tick: 1 };
    const next = { tick: 2 };
    expect(normalizePulseStageResult({ changed: true, worldState: next }, prior).worldState).toBe(next);
    const inert = unchangedPulseStageResult(prior, { evidence: ['dark'] });
    expect(inert).toEqual({
      kind: PULSE_STAGE_RESULT_KIND,
      changed: false,
      worldState: prior,
      evidence: ['dark'],
    });
    expect(Object.isFrozen(inert.evidence)).toBe(true);
  });
});

describe('declarative pulse substage contracts', () => {
  it('names the live belief -> information-statecraft -> treaty order and exact host bindings', () => {
    expect(PULSE_SUBSTAGE_MANIFEST_VERSION).toBe(2);
    expect(PULSE_SUBSTAGE_CONTRACTS.map((row) => row.id)).toEqual([
      'belief_maps', 'information_statecraft', 'treaties',
    ]);
    expect(PULSE_SUBSTAGE_CONTRACTS.map((row) => row.after)).toEqual([
      [], ['belief_maps'], ['information_statecraft'],
    ]);
    expect(PULSE_SUBSTAGE_CONTRACTS.map((row) => row.gates.map((gate) => gate.id))).toEqual([
      ['belief_activation'],
      ['information_statecraft_activation'],
      ['peace_causality', 'disposition_channels'],
    ]);
    const kernel = read('src/domain/worldPulse/pulseKernel.js');
    let priorCall = -1;
    for (const row of PULSE_SUBSTAGE_CONTRACTS) {
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.reads)).toBe(true);
      expect(Object.isFrozen(row.writes)).toBe(true);
      expect(Object.isFrozen(row.gates)).toBe(true);
      expect(row.reads.length).toBeGreaterThan(0);
      expect(row.writes.length).toBeGreaterThan(0);
      expectRef(row.host);
      expectRef(row.call);
      const bindings = callBindings(row.host, row.call.symbol);
      expect(bindings.map((binding) => binding.port), `${row.id} input ports`).toEqual(
        row.reads.map((input) => input.port),
      );
      for (const input of row.reads) {
        expect(Object.isFrozen(input)).toBe(true);
        expect(Object.isFrozen(input.sources)).toBe(true);
        expect(input.sources.length).toBeGreaterThan(0);
        const binding = bindings.find((candidate) => candidate.port === input.port);
        for (const source of input.sources) {
          expect(binding?.expression, `${row.id}.${input.port} must read ${source}`).toContain(source);
        }
      }
      const hostBody = functionBody(kernel, row.host.symbol);
      for (const output of row.writes) {
        expect(Object.isFrozen(output)).toBe(true);
        expect(Object.isFrozen(output.evidence)).toBe(true);
        expect(output.evidence.length).toBeGreaterThan(0);
        for (const evidence of output.evidence) {
          expect(hostBody, `${row.id} host write ${output.target}`).toContain(evidence);
        }
      }
      for (const gate of row.gates) {
        expect(Object.isFrozen(gate)).toBe(true);
        expect(Object.isFrozen(gate.checks)).toBe(true);
        if (gate.predicate) {
          expect(Object.isFrozen(gate.predicate)).toBe(true);
          expectRef(gate.predicate);
        }
        for (const gateCheck of gate.checks) {
          expect(Object.isFrozen(gateCheck)).toBe(true);
          expectRef(gateCheck);
        }
      }
      const callIndex = kernel.indexOf(`${row.call.symbol}({`);
      expect(callIndex, `${row.call.symbol} must remain in pulseKernel`).toBeGreaterThan(priorCall);
      priorCall = callIndex;
    }
  });

  it('is metadata only: no mover imports, dynamic imports, or execution wiring', () => {
    const manifest = read('src/domain/worldPulse/pulseStageManifest.js');
    const kernel = read('src/domain/worldPulse/pulseKernel.js');
    expect(manifest).not.toMatch(/^\s*import\s/m);
    expect(manifest).not.toContain('import(');
    expect(kernel).not.toContain('PULSE_SUBSTAGE_CONTRACTS');
    expect(kernel).not.toContain('normalizePulseStageResult');
    for (const row of PULSE_SUBSTAGE_CONTRACTS) {
      expect(typeof row.call.symbol).toBe('string');
      expect(row.gates.every((gate) => gate.predicate === null
        || typeof gate.predicate.symbol === 'string')).toBe(true);
    }
  });
});

describe('ledger ownership certification manifest', () => {
  it('discovers executable set/drop writers and ignores prose-shaped noise', () => {
    const synthetic = [
      { rel: 'set.js', source: "export function setOne(ws) { return setSpatialLedger(ws, 'beliefMaps', {}); }" },
      { rel: 'drop.js', source: "export function dropOne(ws) { return dropSpatialLedger(ws, 'beliefMaps'); }" },
      { rel: 'noise.js', source: "// setSpatialLedger(ws, 'beliefMaps', {})\nconst prose = \"dropSpatialLedger(ws, 'beliefMaps')\";" },
    ];
    expect(spatialLedgerWritersOf(synthetic, 'beliefMaps')).toEqual([
      'drop.js#dropOne', 'set.js#setOne',
    ]);
  });

  it('records the honest ownership modes and resolves every declared symbol/evidence', () => {
    expect(LEDGER_OWNERSHIP_MANIFEST_VERSION).toBe(2);
    const byId = new Map(LEDGER_OWNERSHIP_MANIFEST.map((row) => [row.id, row]));
    expect([...byId.keys()]).toEqual(['envoy_errands', 'treaties', 'belief_maps']);
    expect(byId.get('envoy_errands')?.ownership).toBe('single_writer');
    expect(byId.get('envoy_errands')?.writers).toHaveLength(1);
    expect(byId.get('treaties')?.ownership).toBe('allowed_writer_family');
    expect(byId.get('treaties')?.writers.length).toBeGreaterThan(1);
    expect(byId.get('belief_maps')?.ownership).toBe('ordered_multi_writer');
    expect(byId.get('belief_maps')?.writers.length).toBeGreaterThan(2);

    const declared = (id) => byId.get(id).writers
      .map((writer) => `${writer.module}#${writer.symbol}`).sort();
    expect(objectLedgerWritersOf(SOURCES, 'envoyErrands', 'ENVOY_ERRAND_LEDGER_KEY'))
      .toEqual(declared('envoy_errands'));
    expect(spatialLedgerWritersOf(SOURCES, 'treaties')).toEqual(declared('treaties'));
    expect(spatialLedgerWritersOf(SOURCES, 'beliefMaps')).toEqual(declared('belief_maps'));

    for (const row of LEDGER_OWNERSHIP_MANIFEST) {
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.readers)).toBe(true);
      expect(Object.isFrozen(row.writers)).toBe(true);
      expect(Object.isFrozen(row.normalizers)).toBe(true);
      expect(Object.isFrozen(row.lifecycle)).toBe(true);
      expect(Object.isFrozen(row.orderEvidence)).toBe(true);
      for (const ref of [...row.readers, ...row.writers, ...row.normalizers, ...row.lifecycle]) {
        expect(Object.isFrozen(ref)).toBe(true);
        expectRef(ref);
      }
      for (const sequence of row.orderEvidence) {
        expect(Object.isFrozen(sequence)).toBe(true);
        expect(Object.isFrozen(sequence.tokens)).toBe(true);
        const body = functionBody(read(sequence.module), sequence.symbol);
        let prior = -1;
        for (const token of sequence.tokens) {
          const index = body.indexOf(token);
          expect(index, `${row.id} order evidence ${token}`).toBeGreaterThan(prior);
          prior = index;
        }
      }
    }
  });

  it('is independent certification data and cannot drive a runtime writer', () => {
    const manifest = read('src/domain/worldPulse/ledgerOwnershipManifest.js');
    const kernel = read('src/domain/worldPulse/pulseKernel.js');
    expect(manifest).not.toMatch(/^\s*import\s/m);
    expect(manifest).not.toContain('import(');
    expect(kernel).not.toContain('LEDGER_OWNERSHIP_MANIFEST');
    for (const row of LEDGER_OWNERSHIP_MANIFEST) {
      expect(row.writers.every((writer) => typeof writer.symbol === 'string')).toBe(true);
    }
  });
});
