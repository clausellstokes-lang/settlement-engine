/**
 * tests/lint/scribeFiniteSemantics.walker.test.js — THE FINITE-SEMANTICS PIN (ruling 12).
 *
 * FINITE-SEMANTICS says the engine speaks in typed buckets and the model is a clerk, never a
 * writer. The Scribe writes PROSE, and prose is an OUTPUT: the moment a generator or a domain
 * rule read `settlement.prose` back, text would become an input to the world, a seeded advance
 * would depend on what a model once wrote, and THE PROMISE (same seed, same world, forever)
 * would be broken by a path nobody could see. So the law is structural rather than advisory:
 *
 *   ⛔ NOTHING under `src/domain/` (except `src/domain/display/`, whose whole job is to draw it)
 *      and NOTHING under `src/generators/` may read or write the `prose` key of a settlement.
 *
 * WHY AN AST WALK AND NOT A GREP. The word `prose` is all over both trees in legitimate
 * spellings — `stateProse`, `eventProse.js`, `kind: 'prose'` tags in the faction rename census,
 * `pickLineWithFamily(..., 'prose')`. A text scan would either drown in those or be tuned until
 * it saw nothing. Parsing and looking only at MEMBER ACCESS (`x.prose`, `x?.prose`, `x['prose']`)
 * asks the exact question the law asks, and the base tree answers it with zero hits, so this pin
 * needs no allowlist at all. An allowlist is where a law like this usually dies.
 *
 * THE SECOND ARM is the SINGLE-WRITER rule, and it is scoped to WRITES rather than reads for the
 * same reason: over the whole of `src/`, a module is listed if it can CHANGE the artefact — an
 * assignment, a delete, or a `{...settlement, prose}` literal, through the plain key or through
 * the module's own exported constant. Reading a member called `prose` is not on that list
 * because chronicle entries, style tokens and edit tallies all legitimately have one. The
 * artefact's whole blast radius is therefore two tables: who may write it, and who imports the
 * writer.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'espree';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The settlement key the law is about. One spelling, stated once. */
const KEY = 'prose';

/** The trees the law binds, and the one subtree inside them that is exempt. */
const SCANNED = ['src/domain', 'src/generators'];
const EXEMPT = ['src/domain/display'];

/**
 * ⭐ THE ENUMERATED WRITE SITES. A module is on this list if it ASSIGNS, DELETES, or spreads a
 * settlement with a literal `prose` key — that is, if it can change what the artefact is. Reads
 * are not listed: the word `prose` is a legitimate member all over the product (chronicle entry
 * prose, a `type.prose` style token, a `counts.prose` tally), and a list that tried to cover
 * reads would be a list of unrelated files nobody would keep honest.
 */
const DECLARED_WRITE_SITES = Object.freeze({
  'src/lib/scribeArtefact.js': 'THE WRITER. Constructs, lands, retires and strips the artefact. The only module that builds one.',
  'src/store/settlementSliceHelpers.js': 'snapshotSettlement deletes the key so fifty version-history clones do not each carry the prose.',
  'src/domain/display/publicSafe.js': 'The FULL (gallery_share_dm) projection deletes the key. DEFAULT mode drops it through the fail-closed top-level allowlist, which prose is deliberately absent from (ruling 3); FULL mode skips that gate and is a denylist, so the drop has to be spelled. Its SQL twin is the _gallery_dm_full_json recreate in migration 201.',
});

/**
 * ⭐ THE ENUMERATED IMPORTERS of the writer. Everything that touches the artefact goes through
 * the one module, so this list IS the artefact's blast radius, stated in one place.
 */
const DECLARED_IMPORTERS = Object.freeze({
  'src/lib/scribeGround.js': 'The locked carry across a full generate. Calls the writer; constructs nothing itself.',
  'src/lib/pendingDossier.js': 'The Stripe round-trip stash strips the key, against the localStorage origin quota.',
  'src/store/campaignPulseHelpers.js': 'capturePulseSnapshot strips the key from every clone, so an undo cannot restore the prose as it stood before the advance and delete the epoch the owner said must be saved.',
  'src/store/scribeEpochLane.js': 'The past lane. Moves a render off `current` on the two verbs that retire one (undo, redo) and reads the tier cap; constructs nothing itself.',
  'src/store/campaignWorldPulseDeferred.js': 'The shared restore chokepoint re-attaches the moved artefact to the restored settlement and to the live view.',
  'src/store/scribeOpenTrigger.js': 'THE OPEN. Reads staleness to decide whether a render is owed; writes nothing.',
  'src/store/scribeTransport.js': 'THE TRANSPORT. Lands each tab answer through the writer and persists the settlement through the ordinary save outbox.',
});

/** Every .js/.jsx file under a tree. */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      if (entry === 'node_modules') continue;
      walk(abs, out);
    } else if (/\.(js|jsx)$/.test(entry)) {
      out.push(abs);
    }
  }
  return out;
}

/** Walk an espree AST, calling `visit` on every node. */
function visitAll(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) visitAll(child, visit);
    return;
  }
  if (typeof node.type === 'string') visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'parent') continue;
    visitAll(node[key], visit);
  }
}

/**
 * Every MEMBER ACCESS of `KEY` in one file: `x.prose`, `x?.prose`, `x['prose']`, and the
 * matching delete/assignment forms (which are member expressions too). Object LITERAL keys and
 * bare string literals are deliberately NOT counted: `{ kind: 'prose' }` asserts nothing about
 * a settlement.
 */
function memberReadsOf(abs) {
  const code = readFileSync(abs, 'utf8');
  const ast = parse(code, {
    ecmaVersion: 'latest', sourceType: 'module', loc: true, ecmaFeatures: { jsx: true },
  });
  /** @type {number[]} */
  const lines = [];
  visitAll(ast, (node) => {
    if (node.type !== 'MemberExpression') return;
    const property = node.property;
    const name = node.computed
      ? (property?.type === 'Literal' ? property.value : null)
      : property?.name;
    if (name === KEY) lines.push(node.loc.start.line);
  });
  return lines;
}

/**
 * Every WRITE of `KEY` in one file: an assignment whose target is `x.prose`, a `delete x.prose`,
 * and an object literal that spreads something and then names a literal `prose` key (the
 * hand-rolled `{...settlement, prose}` a future author might reach for).
 */
function writeSitesOf(abs) {
  const code = readFileSync(abs, 'utf8');
  const ast = parse(code, {
    ecmaVersion: 'latest', sourceType: 'module', loc: true, ecmaFeatures: { jsx: true },
  });
  /** @type {number[]} */
  const lines = [];
  // A computed access through the module's own exported constant counts too: `s[KEY] = x` is
  // the same write as `s.prose = x`, and a pin that could not see it would be evaded by the
  // first author who reached for the constant.
  const KEY_CONST = 'SCRIBE_SETTLEMENT_KEY';
  const nameOf = (node, computed) => {
    if (computed) {
      if (node?.type === 'Literal') return node.value;
      if (node?.type === 'Identifier' && node.name === KEY_CONST) return KEY;
      return null;
    }
    return node?.name ?? null;
  };
  const isKeyMember = (node) => node
    && node.type === 'MemberExpression'
    && nameOf(node.property, node.computed) === KEY;
  visitAll(ast, (node) => {
    if (node.type === 'AssignmentExpression' && isKeyMember(node.left)) lines.push(node.loc.start.line);
    if (node.type === 'UnaryExpression' && node.operator === 'delete' && isKeyMember(node.argument)) {
      lines.push(node.loc.start.line);
    }
    if (node.type === 'ObjectExpression') {
      const spreads = node.properties.some((p) => p.type === 'SpreadElement');
      if (!spreads) return;
      for (const property of node.properties) {
        if (property.type !== 'Property') continue;
        const name = property.computed
          ? nameOf(property.key, true)
          : (property.key?.name ?? property.key?.value);
        if (name === KEY) lines.push(property.loc.start.line);
      }
    }
  });
  return lines;
}

describe('THE FINITE-SEMANTICS PIN — prose is an output', () => {
  const scanned = SCANNED.flatMap((tree) => walk(join(ROOT, tree)))
    .map((abs) => relative(ROOT, abs).split('\\').join('/'))
    .filter((rel) => !EXEMPT.some((ex) => rel.startsWith(`${ex}/`)))
    .sort();

  it('scans a real population (the pin is not vacuously green)', () => {
    // A walker that found no files would pass every arm below. Name the floor so a broken
    // path reds here rather than reading as a clean bill of health.
    expect(scanned.length).toBeGreaterThan(200);
    expect(scanned.some((f) => f.startsWith('src/generators/'))).toBe(true);
    expect(scanned.some((f) => f.startsWith('src/domain/'))).toBe(true);
    expect(scanned.some((f) => f.startsWith('src/domain/display/'))).toBe(false);
  });

  it('no module under src/domain (outside display/) or src/generators touches settlement.prose', () => {
    /** @type {string[]} */
    const offenders = [];
    for (const rel of scanned) {
      const lines = memberReadsOf(join(ROOT, rel));
      for (const line of lines) offenders.push(`${rel}:${line}`);
    }
    expect(offenders, `\n${offenders.join('\n')}\n`).toEqual([]);
  });

  it('the display subtree is exempt BY NAME, and the exemption is narrow', () => {
    // The exemption is one directory, not a list that can grow quietly. If a second tree ever
    // needs to draw prose, it argues with this assertion first.
    expect(EXEMPT).toEqual(['src/domain/display']);
  });

  it('the artefact is WRITTEN in exactly one module, and its importers are declared', () => {
    const all = walk(join(ROOT, 'src'))
      .map((abs) => relative(ROOT, abs).split('\\').join('/'))
      .sort();
    /** @type {string[]} */
    const writers = [];
    /** @type {string[]} */
    const importers = [];
    for (const rel of all) {
      const code = readFileSync(join(ROOT, rel), 'utf8');
      // An IMPORT, not a mention: three files name the module in a comment explaining why
      // they do not import it, and a comment is documentation rather than a dependency.
      if (/from\s+['"][^'"]*scribeArtefact\.js['"]/.test(code) || /import\(\s*['"][^'"]*scribeArtefact\.js['"]/.test(code)) {
        if (rel !== 'src/lib/scribeArtefact.js') importers.push(rel);
      }
      if (writeSitesOf(join(ROOT, rel)).length > 0) writers.push(rel);
    }
    expect(writers.filter((f) => !(f in DECLARED_WRITE_SITES)), `\n${writers.join('\n')}\n`).toEqual([]);
    expect(importers.filter((f) => !(f in DECLARED_IMPORTERS)), `\n${importers.join('\n')}\n`).toEqual([]);
    // And the writer is present: a pin that passed because the feature vanished is not a pin.
    expect(writers).toContain('src/lib/scribeArtefact.js');
  });

  it('NEGATIVE CONTROL — the walker convicts a planted read', () => {
    // Proof the AST arm can see. A member read of the key in a scanned-tree shape is found;
    // a string literal and an unrelated member are not.
    const planted = `
      export function f(settlement) { return settlement.prose.current; }
      export const tag = { kind: 'prose' };
      export function g(x) { return x.stateProse; }
    `;
    const ast = parse(planted, { ecmaVersion: 'latest', sourceType: 'module', loc: true });
    /** @type {number[]} */
    const hits = [];
    visitAll(ast, (node) => {
      if (node.type !== 'MemberExpression') return;
      const name = node.computed
        ? (node.property?.type === 'Literal' ? node.property.value : null)
        : node.property?.name;
      if (name === KEY) hits.push(node.loc.start.line);
    });
    expect(hits.length).toBe(1);
  });
});
