/**
 * commandRegistry.walker.test.js — THE COMMAND-REGISTRATION WALKER.
 *
 * THE LAW: a command kind that any production path can build MUST be registered
 * in standardCommandRegistry. Runtime already refuses an unknown kind
 * (executeCommand.js returns a FAILED receipt with reason `unknown_command`),
 * and checkedSpec() already refuses a MALFORMED spec — but nothing refused an
 * UNREGISTERED capability at build time. A new adapter, or a seventh value added
 * to a dynamic kind vocabulary, shipped invisibly and failed only when a user
 * triggered it. This walker is that missing gate.
 *
 * Modeled on tests/store/operationRegistry.walker.test.js (source-scan
 * denominator / covered ⊆ denominator / non-vacuity floor) and on
 * tests/domain/npc/npcFacetConsumer.walker.test.js (prove the evidence, do not
 * take its word).
 *
 * WHAT THIS IS NOT. It is deliberately NOT a store-action census. Per
 * standardCommandRegistry.js's header, keeping the command surface separate from
 * operationRegistry's 172 store actions is what "prevents the 172-action store
 * census from becoming an accidental permission or AI-tool surface". The
 * denominator here is command-kind USAGE — what can actually be built into a
 * command envelope — not "everything that mutates state".
 *
 * THE DENOMINATOR (how usage is discovered):
 *   Every command envelope is built by makeCommandEnvelope (commandEnvelope.js);
 *   the executor only ever dispatches on `command.kind`. So the census scans all
 *   of src/ for makeCommandEnvelope call sites and resolves the `kind:` each one
 *   supplies:
 *     - a string literal                  → that kind;
 *     - a bare identifier (CANON_EVENT_APPLY) → resolved through the file's own
 *       `const NAME = '…'`, or followed one hop through a relative import;
 *     - anything else (`kind: plan.kind`, or an envelope built from a helper's
 *       return value) → DYNAMIC: the site must be declared in
 *       DYNAMIC_KIND_SOURCES below, naming the real vocabulary that feeds it.
 *       That vocabulary is then IMPORTED and its values join the denominator.
 *   An unresolvable, undeclared site is a hard failure — that is what makes a
 *   brand-new adapter impossible to ship silently.
 *
 * THE SECOND ANCHOR (why makeCommandEnvelope alone is not enough). The executor
 * does NOT require a makeCommandEnvelope product: executeCommand.js validates
 * whatever object it is handed with validateCommandEnvelope(). One production
 * path exploits this — recoverCanonEventCommand (canonEventCommandRecovery.js)
 * re-validates a caller-supplied raw command and executes it. It is safe today
 * only because it hard-pins `kind !== CANON_EVENT_APPLY` as a refusal, and a
 * makeCommandEnvelope-anchored census would never visit it. So this walker also
 * ratchets the DISPATCH SURFACE: the frozen set of files that may reach the
 * executor at all. A new execution entry point fails until someone declares it.
 *
 * CANNOT-CATCH (documented evasion gaps — accepted costs of a source gate):
 *   1. A hand-built envelope object passed straight to executeSessionCommand
 *      from one of the ALREADY-frozen dispatch files. The kind census cannot see
 *      it; only the dispatch-surface ratchet's review gate would. Catching it
 *      generally would require dataflow analysis, not a source scan.
 *   2. A kind assembled at runtime by string concatenation. The envelope grammar
 *      (/^[a-z][a-z0-9.-]*$/) permits it; nothing in src/ does it.
 *   3. A constant re-exported through more than one hop of relative imports. One
 *      hop is followed; a second hop degrades the site to DYNAMIC, which fails
 *      loudly rather than silently — the safe direction.
 *   4. A regex literal that itself contains a comment-opening sequence would
 *      confuse the comment stripper. No scanned file contains one; the
 *      non-vacuity floor below catches the collapse-to-zero it would cause.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { standardCommandRegistry } from '../../../src/application/commands/standardCommandRegistry.js';
import {
  IMPORT_CAMPAIGN_ATTACH_EXISTING,
  IMPORT_SETTLEMENT_CREATE_AND_ATTACH,
} from '../../../src/application/commands/adapters/importReconciliationApply.js';
import { CUSTOM_CONTENT_COMMAND_KIND } from '../../../src/domain/content/customContentCommands.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const SRC_DIR = join(REPO_ROOT, 'src');
const ENVELOPE_FACTORY = 'makeCommandEnvelope';

/**
 * The declared dynamic kind sources: sites where `kind` is not a static
 * expression, each mapped to the REAL vocabulary that supplies it.
 *
 * Adding a dynamic site without a row here fails the totality test below. That
 * is the point: a new dynamic command family forces an explicit declaration of
 * what kinds it can mint, and those kinds are then held to registration.
 */
const DYNAMIC_KIND_SOURCES = Object.freeze({
  'src/application/commands/adapters/customContentApply.js': Object.freeze({
    reason: 'makeCommandEnvelope({ kind: plan.kind }) — the reviewed preview plan carries the kind.',
    vocabularySource: 'src/domain/content/customContentCommands.js CUSTOM_CONTENT_COMMAND_KIND',
    kinds: () => Object.values(CUSTOM_CONTENT_COMMAND_KIND),
  }),
  'src/application/commands/adapters/importReconciliationApply.js': Object.freeze({
    reason: 'makeCommandEnvelope(reconciliationDraftToCommandFields(draft, context)) — draft.kind.',
    vocabularySource: 'src/application/commands/adapters/importReconciliationApply.js IMPORT_* kind constants',
    kinds: () => [IMPORT_SETTLEMENT_CREATE_AND_ATTACH, IMPORT_CAMPAIGN_ATTACH_EXISTING],
  }),
});

/**
 * THE DISPATCH SURFACE, frozen 2026-07-26 (hand-audited).
 *
 * Every src/ file that may reach the command executor. This is a review gate,
 * not a ban: a new entry point is legal, but it must be added here deliberately,
 * which is the moment someone checks whether it can smuggle an unregistered or
 * hand-built envelope past the kind census above.
 *
 * canonEventCommandRecovery.js is the reason this list exists — it executes a
 * caller-supplied raw object (pinned to CANON_EVENT_APPLY at its line 234) and
 * is invisible to a makeCommandEnvelope-anchored scan.
 */
const DISPATCH_SURFACE = Object.freeze([
  'src/application/commands/canonEventCommandRecovery.js',
  'src/application/commands/importReconciliationCommandRuntime.js',
  'src/application/commands/pendingEditCommitRuntime.js',
  'src/lib/intent/interpretApply.js',
  'src/store/customContentSliceRuntime.js',
  // W-D directive 3 (CREATE_ROUTE): the charter store verb dispatches a
  // canonEventCommand (canonEventApply adapter) through executeSessionCommand — it
  // builds its envelope with makeCommandEnvelope via that adapter, so its kind
  // (settlement.canon-event.apply) is already visible to the kind census above and
  // is registered. It reaches the executor legitimately; it hand-builds no raw
  // envelope. Frozen here so a future second route verb is a deliberate addition.
  'src/store/userRouteCharter.js',
]);

/** The single legal executor construction site. A second executor would mean a
 *  second registry — an entire capability surface outside this walker. */
const EXECUTOR_CONSTRUCTION_SITES = Object.freeze([
  'src/application/commands/sessionCommandRuntime.js',
]);

/**
 * Dotted kinds that share the command grammar but are NOT application commands:
 * reviewed-supply-chain RPC payload kinds and campaign content-binding change /
 * CAS kinds, each with its own schema version and its own writer. Pinned so that
 * a future "it is already dotted, just register it" move fails loudly.
 */
const NOT_COMMANDS = Object.freeze([
  'content.reviewed-supply-chain.confirm',
  'content.reviewed-supply-chain.remove',
  'campaign.content-binding.rollback',
  'campaign.content-binding.migrate',
  'campaign.content-binding.cas',
]);

// ── The scanner ─────────────────────────────────────────────────────────────
// Build-time only; never imported by runtime code.

/**
 * Drop comments while PRESERVING string and template literals — the kind values
 * live inside those literals, so operationRegistry.walker's strip-everything
 * variant would erase exactly what this census reads.
 * @param {string} src @returns {string}
 */
function stripComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];
    if (c === '/' && c2 === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && c2 === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      out += c;
      i++;
      while (i < n) {
        if (src[i] === '\\') { out += src.slice(i, i + 2); i += 2; continue; }
        out += src[i];
        i++;
        if (src[i - 1] === c) break;
      }
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Every .js/.jsx file under src/, repo-relative with forward slashes. */
function sourceFiles() {
  const found = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.jsx?$/.test(entry.name)) {
        found.push(relative(REPO_ROOT, full).split('\\').join('/'));
      }
    }
  })(SRC_DIR);
  return found.sort();
}

/**
 * Span of the balanced call argument beginning at `open` (the `(` index),
 * skipping string literals so a bracket inside a string cannot unbalance it.
 * @returns {{text:string, end:number}}
 */
function callArgumentSpan(code, open) {
  let depth = 0;
  let i = open;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    if (c === "'" || c === '"' || c === '`') {
      i++;
      while (i < n) {
        if (code[i] === '\\') { i += 2; continue; }
        if (code[i] === c) break;
        i++;
      }
      i++;
      continue;
    }
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') {
      depth--;
      if (depth === 0) return { text: code.slice(open + 1, i), end: i };
    }
    i++;
  }
  return { text: '', end: n };
}

/**
 * The `kind:` value expression of an object-literal argument, or null when the
 * argument is not an object literal (an indirect helper call) or carries no
 * top-level `kind`.
 * @param {string} argText @returns {string|null}
 */
function kindExpression(argText) {
  const trimmed = argText.trim();
  if (!trimmed.startsWith('{')) return null;
  const start = argText.indexOf('{');
  let depth = 0;
  let i = start;
  const n = argText.length;
  while (i < n) {
    const c = argText[i];
    if (c === "'" || c === '"' || c === '`') {
      i++;
      while (i < n) {
        if (argText[i] === '\\') { i += 2; continue; }
        if (argText[i] === c) break;
        i++;
      }
      i++;
      continue;
    }
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') depth--;
    else if (
      depth === 1
      && argText.startsWith('kind', i)
      && /[^\w$]/.test(argText[i - 1] || ' ')
    ) {
      let k = i + 4;
      while (/\s/.test(argText[k])) k++;
      if (argText[k] === ':') {
        let vdepth = 0;
        let j = k + 1;
        for (; j < n; j++) {
          const cc = argText[j];
          if (cc === '(' || cc === '{' || cc === '[') vdepth++;
          else if (cc === ')' || cc === '}' || cc === ']') { if (vdepth === 0) break; vdepth--; }
          else if (cc === ',' && vdepth === 0) break;
        }
        return argText.slice(k + 1, j).trim();
      }
    }
    i++;
  }
  return null;
}

/** A module-level `const NAME = '<kind>'` in `code`, or null. */
function constantValue(code, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(
    `(?:export\\s+)?const\\s+${escaped}\\s*=\\s*(['"])([^'"]*)\\1`,
  ).exec(code);
  return match ? match[2] : null;
}

/** Relative-import source module for a named import, repo-relative, or null. */
function importedFrom(code, name, file) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = /import\s*\{([^}]*)\}\s*from\s*['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = pattern.exec(code)) !== null) {
    const names = match[1]
      .split(',')
      .map((entry) => entry.trim().split(/\s+as\s+/).pop().trim());
    if (names.some((candidate) => new RegExp(`^${escaped}$`).test(candidate))) {
      return relative(REPO_ROOT, resolve(dirname(join(REPO_ROOT, file)), match[2]))
        .split('\\')
        .join('/');
    }
  }
  return null;
}

/**
 * Resolve a `kind:` expression to a literal kind, or null when it is dynamic.
 * A bare identifier is resolved in-file, then one hop through a relative import.
 */
function resolveKind(expression, code, file) {
  if (expression == null) return null;
  const literal = /^(['"])([^'"]*)\1$/.exec(expression);
  if (literal) return literal[2];
  if (!/^[A-Za-z_$][\w$]*$/.test(expression)) return null;
  const own = constantValue(code, expression);
  if (own != null) return own;
  const source = importedFrom(code, expression, file);
  if (!source) return null;
  try {
    return constantValue(stripComments(readFileSync(join(REPO_ROOT, source), 'utf8')), expression);
  } catch {
    return null;
  }
}

/** Census every makeCommandEnvelope site in src/. */
function censusEnvelopeSites() {
  const sites = [];
  for (const file of sourceFiles()) {
    const raw = readFileSync(join(REPO_ROOT, file), 'utf8');
    if (!raw.includes(ENVELOPE_FACTORY)) continue;
    const code = stripComments(raw);
    const pattern = new RegExp(`(?<![\\w$.])${ENVELOPE_FACTORY}\\s*\\(`, 'g');
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const open = code.indexOf('(', match.index);
      const { text, end } = callArgumentSpan(code, open);
      // The factory's own `export function makeCommandEnvelope(fields)` is a
      // declaration, not a call site; it mints no kind.
      if (!/\bfunction\s+$/.test(code.slice(0, match.index))) {
        sites.push({
          file,
          kind: resolveKind(kindExpression(text), code, file),
        });
      }
      pattern.lastIndex = end;
    }
  }
  return sites;
}

/**
 * Files under src/ that reference `identifier` as a real code token (comments
 * and string literals excluded), minus the module that defines it.
 * @param {string} identifier @param {string} definedIn @returns {string[]}
 */
function filesReferencing(identifier, definedIn) {
  const pattern = new RegExp(`(?<![\\w$.])${identifier}(?![\\w$])`);
  return sourceFiles()
    .filter((file) => file !== definedIn)
    .filter((file) => {
      const raw = readFileSync(join(REPO_ROOT, file), 'utf8');
      if (!raw.includes(identifier)) return false;
      return pattern.test(stripComments(raw));
    })
    .sort();
}

/** The COMMAND_DRAFT_KINDS admission set, source-scanned. It is module-private
 *  in importReconciliationSession.js, so it cannot be imported — only read. */
function reconciliationAdmissionKinds() {
  const code = stripComments(
    readFileSync(join(REPO_ROOT, 'src/lib/importReconciliationSession.js'), 'utf8'),
  );
  const block = /const\s+COMMAND_DRAFT_KINDS\s*=\s*new Set\(\[([^\]]*)\]\)/.exec(code);
  if (!block) return null;
  return [...block[1].matchAll(/'([^']+)'/g)].map((match) => match[1]).sort();
}

describe('THE COMMAND-REGISTRATION WALKER (no unregistered capability)', () => {
  const sites = censusEnvelopeSites();
  const registered = standardCommandRegistry.list().map((spec) => spec.kind);
  const staticKinds = sites.map((site) => site.kind).filter(Boolean);
  const dynamicKinds = Object.values(DYNAMIC_KIND_SOURCES)
    .flatMap((source) => source.kinds());
  const denominator = [...new Set([...staticKinds, ...dynamicKinds])].sort();

  test('the census finds the envelope sites (scanner did not silently break)', () => {
    // A floor guard. If a refactor breaks callArgumentSpan the census collapses
    // to ~0 and every other assertion here passes vacuously.
    expect(sites.length).toBeGreaterThanOrEqual(5);
    // 2026-07-27: content.definition.mass-update retired per R-5b #6; floor
    // re-baselined 11 -> 10. The exact 10-kind toEqual in commandRegistry.test.js
    // is the stronger pin; this stays a scanner-collapse floor only.
    expect(denominator.length).toBeGreaterThanOrEqual(10);
  });

  test('every envelope site resolves to a kind OR is a declared dynamic source', () => {
    const undeclared = sites
      .filter((site) => !site.kind && !DYNAMIC_KIND_SOURCES[site.file])
      .map((site) => site.file)
      .sort();
    // A NEW adapter whose kind the scanner cannot resolve statically lands here.
    // Either pass a literal/constant kind at the makeCommandEnvelope call, or add
    // a DYNAMIC_KIND_SOURCES row in this file naming the vocabulary it draws from.
    // Never delete the site from the scan — that is not a legal move.
    expect(
      undeclared,
      `\nUnresolved makeCommandEnvelope sites with no DYNAMIC_KIND_SOURCES row:\n  ${undeclared.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('every command kind a production path can build IS registered', () => {
    const unregistered = denominator.filter((kind) => !standardCommandRegistry.has(kind));
    // A capability reachable from src/ but absent from standardCommandRegistry
    // lands here. The executor would refuse it at runtime with `unknown_command`
    // — a user-visible failure this test exists to prevent. Register its
    // CommandSpec in src/application/commands/standardCommandRegistry.js.
    // Widening this test is not a legal move.
    expect(
      unregistered,
      `\nCommand kinds built in src/ but NOT registered:\n  ${unregistered.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('the registry carries NO ghost specs — every registered kind is reachable', () => {
    const reachable = new Set(denominator);
    const ghosts = registered.filter((kind) => !reachable.has(kind)).sort();
    // A registered spec no production path can build lands here: dead permission
    // surface. Either wire the capability up, or delete its spec. This is the
    // monotone half of the walker idiom (covered ⊆ denominator).
    expect(
      ghosts,
      `\nRegistered command kinds nothing in src/ can build:\n  ${ghosts.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('DYNAMIC_KIND_SOURCES carries no stale rows', () => {
    const dynamicFiles = new Set(
      sites.filter((site) => !site.kind).map((site) => site.file),
    );
    const stale = Object.keys(DYNAMIC_KIND_SOURCES)
      .filter((file) => !dynamicFiles.has(file))
      .sort();
    // A row whose site became static, moved, or was deleted lands here. Remove
    // the row; leaving it would silently widen the denominator forever.
    expect(
      stale,
      `\nDYNAMIC_KIND_SOURCES rows with no matching dynamic site:\n  ${stale.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('positive control — the resolver really reads kinds, and discriminates', () => {
    // Proves the census is not passing by returning empty/garbage: the three
    // statically-resolved adapter kinds must be present by value.
    expect(staticKinds).toContain('settlement.canon-event.apply');
    expect(staticKinds).toContain('campaign.party-impact.record');
    expect(staticKinds).toContain('settlement.pending-edits.commit');
    // And the dynamic vocabularies really contributed their families.
    expect(denominator).toContain('content.environment.migrate');
    expect(denominator).toContain('import.campaign.attach-existing');
  });

  test('the dotted LOOKALIKE kinds are neither in the denominator nor registered', () => {
    const leaked = NOT_COMMANDS.filter(
      (kind) => denominator.includes(kind) || standardCommandRegistry.has(kind),
    );
    // These belong to other writers with their own schema versions. Registering
    // one would hand the command executor a capability it does not implement.
    expect(
      leaked,
      `\nNon-command kinds that leaked into the command surface:\n  ${leaked.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('the declared import vocabulary MATCHES the real admission gate', () => {
    // DYNAMIC_KIND_SOURCES declares the import family from the adapter constants,
    // but the value that actually reaches makeCommandEnvelope is `draft.kind`,
    // gated two modules away by COMMAND_DRAFT_KINDS in importReconciliationSession.js.
    // If those two drift apart, the declaration above is fiction.
    const admitted = reconciliationAdmissionKinds();
    expect(admitted, 'COMMAND_DRAFT_KINDS could not be read — the scan broke').not.toBeNull();
    expect(admitted).toEqual(
      [...DYNAMIC_KIND_SOURCES['src/application/commands/adapters/importReconciliationApply.js'].kinds()].sort(),
    );
  });
});

describe('THE DISPATCH SURFACE (no undeclared way to reach the executor)', () => {
  test('only the frozen files may reach the command executor', () => {
    const actual = filesReferencing(
      'executeSessionCommand',
      'src/application/commands/sessionCommandRuntime.js',
    );
    // A NEW file dispatching commands lands here. Add it to DISPATCH_SURFACE
    // above — and while doing so, check whether it can hand the executor a
    // hand-built envelope whose kind the makeCommandEnvelope census cannot see
    // (canonEventCommandRecovery.js is exactly that shape). Removing a file from
    // the list because it no longer dispatches is the other legal move.
    expect(actual).toEqual([...DISPATCH_SURFACE]);
  });

  test('exactly one command executor exists — no second registry', () => {
    const actual = filesReferencing(
      'createCommandExecutor',
      'src/application/commands/executeCommand.js',
    );
    // A second createCommandExecutor means a second registry: an entire command
    // vocabulary this walker does not police. Register capabilities in
    // standardCommandRegistry instead of standing up a parallel executor.
    expect(actual).toEqual([...EXECUTOR_CONSTRUCTION_SITES]);
  });

  test('the registry is built in exactly one place', () => {
    const actual = filesReferencing(
      'createCommandRegistry',
      'src/application/commands/commandRegistry.js',
    );
    expect(actual).toEqual(['src/application/commands/standardCommandRegistry.js']);
  });
});
