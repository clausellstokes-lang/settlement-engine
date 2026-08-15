/**
 * Shared AST machinery for the Wizard News authoring-site census.
 *
 * The census denominator is intentionally syntactic and broad: every object literal
 * under src/domain or src/store that co-locates `kind` and `headline` is a candidate
 * authoring site. That catches the kind-only producers the older
 * impactKind/candidateType walkers could not see, including store-local inline
 * authors. Read-model projections and intermediate records remain in the
 * denominator; the standing walker may exempt only their exact, frozen
 * path/location/signature rows. A separately identified exact exclusion keeps the
 * proposal undo snapshot visible without misclassifying it as authored news.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'acorn';
import { ancestor } from 'acorn-walk';

const REQUIRED_FIELDS = Object.freeze(['id', 'settlementIds', 'severity']);

// EXACT RE-PIN 2026-08-03 (shrink-only spirit: the row is re-anchored at measured
// truth, never widened). The snapshot moved 779 → 852 with its SIGNATURE UNCHANGED
// (`f4ac01180f8aaf35`), which is the proof this is a pure relocation and not a new
// or edited site: the bytes of the object literal are identical. CAUSE, named and
// measured — commit `526c5e31` ("WR-3 LINEAGE CLAIM: graduate living members and
// receipt both signs") grew the file 1030 → 1103 lines above this site; every other
// commit touching the file left it at 779 (018e4119 779, 68d14324 769, b0a137db 744).
// A line-bound exclusion is the point: it can only ever be re-anchored to a site
// whose bytes still hash the same, so a relocation is cheap and an EDIT is not.
const NON_AUTHORING_SITE_EXCLUSIONS = Object.freeze([
  Object.freeze({
    path: 'src/store/campaignWorldPulseDeferred.js',
    line: 852,
    column: 23,
    signature: 'f4ac01180f8aaf35',
    reason: 'proposal-undo-snapshot',
  }),
]);

/** @param {string} dir @param {string[]} [out] @returns {string[]} */
export function walkJavaScript(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walkJavaScript(path, out);
    else if (/\.js$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
  }
  return out;
}

/** @param {import('estree').Property | import('estree').SpreadElement} property */
function propertyName(property) {
  if (property.type !== 'Property') return null;
  if (!property.computed && property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal' && typeof property.key.value === 'string') {
    return property.key.value;
  }
  return null;
}

/** @param {import('estree').ObjectExpression} node */
function propertiesOf(node) {
  const properties = new Map();
  for (const property of node.properties) {
    const name = propertyName(property);
    if (name) properties.set(name, property);
  }
  return properties;
}

/** @param {import('estree').Node} node */
function isFunctionScope(node) {
  return node.type === 'FunctionDeclaration'
    || node.type === 'FunctionExpression'
    || node.type === 'ArrowFunctionExpression';
}

/** @param {import('estree').Node} node */
function isLexicalScope(node) {
  return node.type === 'Program' || node.type === 'BlockStatement' || isFunctionScope(node);
}

/** @param {import('estree').Node[]} ancestors */
function scopeChain(ancestors) {
  return ancestors.filter(isLexicalScope);
}

/** @param {import('estree').Node[]} ancestors @param {'var'|'let'|'const'} declarationKind */
function declarationScope(ancestors, declarationKind) {
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const candidate = ancestors[i];
    if (declarationKind === 'var') {
      if (candidate.type === 'Program' || isFunctionScope(candidate)) return candidate;
    } else if (isLexicalScope(candidate)) {
      return candidate;
    }
  }
  return ancestors[0];
}

/**
 * Bind local string choices closely enough to prove the house idiom
 * `const kind = flag ? 'registered_a' : 'registered_b'; return { kind, headline }`.
 * Unbound parameters/member expressions remain deliberately unresolved.
 *
 * @param {import('estree').Program} ast
 */
function collectBindings(ast) {
  /** @type {Map<import('estree').Node, Map<string, Array<{ start:number, init:import('estree').Expression|null, scopes:import('estree').Node[] }>>>} */
  const byScope = new Map();
  ancestor(ast, {
    VariableDeclarator(node, _state, ancestors) {
      if (node.id.type !== 'Identifier') return;
      let declaration = null;
      for (let i = ancestors.length - 2; i >= 0; i -= 1) {
        if (ancestors[i].type === 'VariableDeclaration') {
          declaration = ancestors[i];
          break;
        }
      }
      if (!declaration) return;
      const surrounding = ancestors.slice(0, -1);
      const scope = declarationScope(surrounding, declaration.kind);
      if (!scope) return;
      if (!byScope.has(scope)) byScope.set(scope, new Map());
      const names = byScope.get(scope);
      if (!names.has(node.id.name)) names.set(node.id.name, []);
      names.get(node.id.name).push({
        start: node.start,
        init: node.init,
        scopes: scopeChain(surrounding),
      });
    },
  });
  return byScope;
}

/** @param {Array<{ values:string[], complete:boolean }>} parts */
function unionStaticStrings(parts) {
  return {
    values: [...new Set(parts.flatMap((part) => part.values))].sort(),
    complete: parts.every((part) => part.complete),
  };
}

/**
 * Resolve a closed set of string values without evaluating source code.
 *
 * @param {import('estree').Expression | import('estree').PrivateIdentifier | null | undefined} node
 * @param {{ position:number, scopes:import('estree').Node[], bindings:ReturnType<typeof collectBindings>, seen:Set<string> }} context
 * @returns {{ values:string[], complete:boolean }}
 */
function staticStrings(node, context) {
  if (!node) return { values: [], complete: false };
  if (node.type === 'Literal') {
    return typeof node.value === 'string'
      ? { values: [node.value], complete: true }
      : { values: [], complete: false };
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return { values: [node.quasis[0]?.value?.cooked ?? ''], complete: true };
  }
  if (node.type === 'ConditionalExpression') {
    return unionStaticStrings([
      staticStrings(node.consequent, context),
      staticStrings(node.alternate, context),
    ]);
  }
  if (node.type === 'LogicalExpression') {
    return unionStaticStrings([
      staticStrings(node.left, context),
      staticStrings(node.right, context),
    ]);
  }
  if (node.type !== 'Identifier') return { values: [], complete: false };

  for (let i = context.scopes.length - 1; i >= 0; i -= 1) {
    const declarations = context.bindings.get(context.scopes[i])?.get(node.name) || [];
    const prior = declarations.filter((declaration) => declaration.start < context.position);
    const declaration = prior[prior.length - 1];
    if (!declaration?.init) continue;
    const bindingKey = `${declaration.start}:${node.name}`;
    if (context.seen.has(bindingKey)) return { values: [], complete: false };
    return staticStrings(declaration.init, {
      position: declaration.start,
      scopes: declaration.scopes,
      bindings: context.bindings,
      seen: new Set([...context.seen, bindingKey]),
    });
  }
  return { values: [], complete: false };
}

/** @param {string} source @param {import('estree').ObjectExpression} node */
function sourceSignature(source, node) {
  const normalized = source.slice(node.start, node.end).replace(/\s+/g, ' ').trim();
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/**
 * Inspect one source file. `isRegistered` is injected so the helper remains a test
 * leaf; the standing test supplies heraldRouting.isExplicitlyRouted.
 *
 * Dynamic impactKind/candidateType expressions stay delegated to the older closed-
 * vocabulary routing walkers. A dynamic BARE kind has no such companion denominator,
 * so it is a violation unless this scanner can resolve its local closed string set.
 *
 * @param {string} source
 * @param {string} path repo-relative label (or mutant label)
 * @param {(token:string)=>boolean} isRegistered
 * @returns {Array<{ path:string, line:number, column:number, signature:string, routeField:string, routeTokens:string[], issues:string[] }>}
 */
export function scanNewsAuthoringSource(source, path, isRegistered) {
  const ast = parse(source, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true,
    ranges: true,
  });
  const bindings = collectBindings(ast);
  const sites = [];

  ancestor(ast, {
    ObjectExpression(node, _state, ancestors) {
      const properties = propertiesOf(node);
      if (!properties.has('kind') || !properties.has('headline')) return;

      const issues = REQUIRED_FIELDS
        .filter((field) => !properties.has(field))
        .map((field) => `missing-field:${field}`);
      const routeField = properties.has('impactKind')
        ? 'impactKind'
        : properties.has('candidateType')
          ? 'candidateType'
          : 'kind';
      const routeProperty = properties.get(routeField);
      const resolved = staticStrings(routeProperty?.value, {
        position: node.start,
        scopes: scopeChain(ancestors.slice(0, -1)),
        bindings,
        seen: new Set(),
      });
      const routeTokens = resolved.values.filter(Boolean).sort();
      for (const token of routeTokens) {
        if (!isRegistered(token)) issues.push(`missing-registration:unrouted:${token}`);
      }
      if (resolved.complete && routeTokens.length === 0) {
        issues.push('missing-registration:empty-route');
      }
      if (routeField === 'kind' && !resolved.complete) {
        issues.push('missing-registration:dynamic-bare-kind');
      }

      sites.push({
        path,
        line: node.loc.start.line,
        column: node.loc.start.column + 1,
        signature: sourceSignature(source, node),
        routeField,
        routeTokens,
        issues: [...new Set(issues)].sort(),
      });
    },
  });
  return sites.sort((a, b) => a.line - b.line || a.column - b.column);
}

/**
 * @param {string} root repository root
 * @param {(token:string)=>boolean} isRegistered
 */
export function censusNewsAuthoringSites(root, isRegistered) {
  const files = [
    ...walkJavaScript(join(root, 'src', 'domain')),
    ...walkJavaScript(join(root, 'src', 'store')),
  ];
  const candidateSites = files.flatMap((absolutePath) => {
    const path = relative(root, absolutePath).split(/[\\/]/).join('/');
    return scanNewsAuthoringSource(readFileSync(absolutePath, 'utf8'), path, isRegistered);
  }).sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.column - b.column);
  const excludedSites = [];
  const sites = [];
  for (const site of candidateSites) {
    const exclusion = NON_AUTHORING_SITE_EXCLUSIONS.find((row) => (
      row.path === site.path
      && row.line === site.line
      && row.column === site.column
      && row.signature === site.signature
    ));
    if (exclusion) excludedSites.push({ ...site, exclusionReason: exclusion.reason });
    else sites.push(site);
  }
  return {
    files,
    candidateSites,
    excludedSites,
    sites,
  };
}

/** The exact fields persisted in the legacy exception ledger. */
export function debtLedgerRows(sites) {
  return sites
    .filter((site) => site.issues.length > 0)
    .map(({ path, line, column, signature, issues }) => ({ path, line, column, signature, issues }));
}
