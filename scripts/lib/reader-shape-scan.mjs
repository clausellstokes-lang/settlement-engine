/**
 * reader-shape-scan.mjs — THE READER SIDE of the reader-with-no-writer walker.
 *
 * Given the EXECUTED key census (scripts/lib/observed-shape-corpus.mjs), this
 * resolves each property read in `src/` to the record SHAPE its receiver holds,
 * and reports every read whose key no run of the real producers ever wrote.
 *
 * ── WHY A RESOLVER AND NOT A REGEX ─────────────────────────────────────────
 * The class needs SHAPE attribution, and the three ground-truth defects prove a
 * name-matching scanner cannot supply it. `faction?.id` (rulingPower.js) names
 * its shape; `governing.id` (warSeatBooks.js) does not — `governing` comes back
 * from `governingFactionOf`, two modules away; `satellite.foundingTier`
 * (lineageMemberBirth.js) is a DESTRUCTURED PARAMETER whose only shape evidence
 * is its call site, one module away, through an array the ledger reader built.
 * Anything less than a resolver misses two of the three.
 *
 * Resolution is DELIBERATELY PARTIAL AND SILENT. A receiver that does not
 * resolve yields no finding: this walker never guesses. That is the honest
 * trade — coverage is bounded by the resolver, and the resolver's reach is
 * measured (`stats.resolved` / `stats.unresolved`) rather than claimed.
 *
 * ── THE RULES, AND WHERE EACH ONE IS LOAD-BEARING ───────────────────────────
 *   member access `X.p`      → shape `p` when `p` names an observed container
 *   element access `X[e]`    → X's element shape (arrays and id-keyed maps alike)
 *   alias `const y = <e>`    → e's shape
 *   `a ? b : c`, `||`,`&&`,`??` → the union of the arms (this is what carries
 *                              `Array.isArray(ps.factions) ? ps.factions : []`)
 *   `[a, b, c]`              → the union of the elements (TCD-2's three probed
 *                              containers arrive as one array literal)
 *   `{...x, k: v, ...y}`     → per-key last-writer fold in exact source order
 *   `arr.find/filter/at/…`   → arr's element shape
 *   `arr.map(cb)`            → cb's return shape
 *   callback / for-of params → the receiver's element shape
 *   `f(...)`                 → f's return shape, resolved by Program/checker
 *                              symbol identity across imports and re-exports to
 *                              a fixed point. Identity wrappers (`asObject`)
 *                              fall out automatically via param sentinels.
 *   parameters               → the union of the arguments at f's CALL SITES,
 *                              including one property of a destructured object
 *                              parameter. This is the hop TCD-3 needs.
 *
 * ── ARRAYNESS IS TRACKED, AND THAT IS NOT COSMETIC ──────────────────────────
 * A shape token carries `[]` when the corpus observed that container as an
 * array. Reads on an ARRAY token are never findings — otherwise every
 * `factions.map(...)` and `.length` in the estate would be reported as a key no
 * writer produces, which is precisely the false-positive flood that gets a
 * walker turned off.
 *
 * ── KNOWN EVASIONS, RECORDED RATHER THAN HIDDEN ─────────────────────────────
 * These are accepted costs of a bounded resolver, not oversights:
 *   • an unconstrained computed read traverses every executed fixed and dynamic
 *     value facet, but cannot identify which one the runtime key selected;
 *     literal/constant/parameter key domains remain exact through calls;
 *   • a receiver crossing a boundary the rules above do not model (a Map value,
 *     a JSON round trip, or a native/host callback) stays unresolved and is
 *     silently skipped;
 *   • a function whose parameters have NO call site in `src/` (an entry point
 *     called only from tests or the app shell) cannot have its params resolved;
 *   • the builtin-member list below is language surface, not domain data: a
 *     domain key that collides with it (`name`… no; `length`, `map`, `filter`…)
 *     would be skipped. Nothing in the measured corpus collides.
 */
import { createHash } from 'node:crypto';
import ts from 'typescript';

/** Object/array/string/function surface — skipped so array and prototype reads
 *  are never mistaken for domain keys. Language surface, not domain data. */
const BUILTIN_MEMBERS = new Set([
  'length', 'map', 'filter', 'find', 'findIndex', 'findLast', 'findLastIndex', 'forEach',
  'reduce', 'reduceRight', 'some', 'every', 'slice', 'splice', 'concat', 'join', 'sort',
  'reverse', 'includes', 'indexOf', 'lastIndexOf', 'flat', 'flatMap', 'push', 'pop',
  'shift', 'unshift', 'at', 'fill', 'keys', 'values', 'entries', 'toString', 'valueOf',
  'hasOwnProperty', 'constructor', 'then', 'catch', 'finally', 'call', 'apply', 'bind',
  'trim', 'split', 'replace', 'replaceAll', 'toLowerCase', 'toUpperCase', 'startsWith',
  'endsWith', 'padStart', 'padEnd', 'repeat', 'match', 'matchAll', 'charAt', 'charCodeAt',
  'codePointAt', 'normalize', 'localeCompare', 'substring', 'substr', 'size', 'get', 'set',
  'has', 'add', 'delete', 'clear', 'add', 'toFixed', 'prototype', 'default',
]);

/** Array methods that hand the callback ONE ELEMENT of the receiver. */
const ELEMENT_CB_METHODS = new Set(['map', 'filter', 'find', 'findLast', 'forEach', 'some', 'every', 'flatMap', 'sort']);
/** Array methods whose RESULT is the receiver's element. */
const ELEMENT_RESULT_METHODS = new Set(['find', 'findLast', 'at', 'pop', 'shift']);
/** Array methods whose RESULT is the receiver itself (still an array). */
const ARRAY_RESULT_METHODS = new Set(['filter', 'sort', 'slice', 'reverse']);
/** Default-library array methods that always allocate a distinct array result. */
const FRESH_ARRAY_RESULT_METHODS = new Set([
  'map', 'filter', 'slice', 'concat', 'flat', 'flatMap',
]);

const RECORD = 'record:';
const ARRAY = 'array:';
const DICTIONARY = 'dictionary:';
const LOCAL = 'local:';
const FLOW = 'flow:';
const PROMISE = 'promise:';
const REFERENCE = 'reference:';
const ARRAY_PRODUCT = 'array-product:';
const ARRAY_PLUS = 'array-plus:';
const PARAM = '@param';

// A malformed abstract transfer must fail loudly before it can consume the
// process. These are state-space limits, never semantic truncation: crossing
// one throws at the exact reader instead of returning a partial (green) result.
const READ_ABSTRACT_TOKEN_BUDGET = 8192;
const READ_TOKEN_LENGTH_BUDGET = 4096;
const READ_STATE_GROWTH_BUDGET = 16384;

const recordToken = (origin) => `${RECORD}${origin}`;
// Array tokens encode their ELEMENT TOKEN, not an origin id. This keeps nested
// arrays explicit (`array:array:record:…`) and lets syntax-created arrays share
// the same representation as executed array descriptors without inventing a
// graph origin. URI encoding makes the nesting injective.
const arrayToken = (elementToken) => `${ARRAY}${encodeURIComponent(elementToken)}`;
const dictionaryToken = (origin) => `${DICTIONARY}${origin}`;
const flowParts = (token) => {
  if (!token.startsWith(FLOW)) return null;
  const separator = token.indexOf(':', FLOW.length);
  if (separator < 0) return null;
  return {
    hash: token.slice(FLOW.length, separator),
    base: decodeURIComponent(token.slice(separator + 1)),
  };
};
const flowToken = (base, hash) => `${FLOW}${hash}:${encodeURIComponent(base)}`;
const unflowToken = (token) => flowParts(token)?.base || token;
const referenceToken = (identity, value, multiplicity = 'one') => (
  `${REFERENCE}${encodeURIComponent(identity)}:${multiplicity}:${encodeURIComponent(value)}`
);
const referenceParts = (token) => {
  const flow = flowParts(token);
  const base = flow?.base || token;
  if (!base.startsWith(REFERENCE)) return null;
  const identityEnd = base.indexOf(':', REFERENCE.length);
  const multiplicityEnd = base.indexOf(':', identityEnd + 1);
  if (identityEnd < 0 || multiplicityEnd < 0) return null;
  const value = decodeURIComponent(base.slice(multiplicityEnd + 1));
  return {
    identity: decodeURIComponent(base.slice(REFERENCE.length, identityEnd)),
    multiplicity: base.slice(identityEnd + 1, multiplicityEnd),
    value: flow ? flowToken(value, flow.hash) : value,
  };
};
const structuralToken = (token) => referenceParts(token)?.value || token;
const isRecordToken = (token) => unflowToken(structuralToken(token)).startsWith(RECORD);
const isArrayProductToken = (token) => unflowToken(token).startsWith(ARRAY_PRODUCT);
const isArrayToken = (token) => (
  unflowToken(token).startsWith(ARRAY) || isArrayProductToken(token)
);
const isArrayPlusToken = (token) => unflowToken(token).startsWith(ARRAY_PLUS);
const isArrayLikeToken = (token) => isArrayToken(token) || isArrayPlusToken(token);
const isDictionaryToken = (token) => unflowToken(token).startsWith(DICTIONARY);
const isLocalToken = (token) => unflowToken(token).startsWith(LOCAL);
const promiseToken = (value) => `${PROMISE}${encodeURIComponent(value)}`;
const promiseParts = (token) => {
  const flow = flowParts(token);
  const base = flow?.base || token;
  if (!base.startsWith(PROMISE)) return null;
  const value = decodeURIComponent(base.slice(PROMISE.length));
  return { value: flow ? flowToken(value, flow.hash) : value };
};
const isPromiseToken = (token) => Boolean(promiseParts(token));
const isSymbolicToken = (token) => token.startsWith(PARAM);
const originOf = (token) => {
  const base = unflowToken(structuralToken(token));
  return base.slice(base.indexOf(':') + 1);
};
const taggedArrayToken = (prefix, producer, leaf) => (
  `${prefix}${producer}:${encodeURIComponent(leaf)}`
);
const taggedArrayParts = (prefix, token) => {
  const flow = flowParts(token);
  const base = flow?.base || token;
  if (!base.startsWith(prefix)) return null;
  const separator = base.indexOf(':', prefix.length);
  if (separator < 0) return null;
  const leaf = decodeURIComponent(base.slice(separator + 1));
  return {
    producer: base.slice(prefix.length, separator),
    leaf: flow ? flowToken(leaf, flow.hash) : leaf,
  };
};
const arrayProductToken = (producer, leaf) => (
  taggedArrayToken(ARRAY_PRODUCT, producer, leaf)
);
const arrayProductParts = (token) => taggedArrayParts(ARRAY_PRODUCT, token);
const arrayPlusToken = (producer, leaf) => (
  taggedArrayToken(ARRAY_PLUS, producer, leaf)
);
const arrayPlusParts = (token) => taggedArrayParts(ARRAY_PLUS, token);
const canonicalArrayPlusToken = (producer, leaf) => {
  const nested = arrayPlusParts(leaf);
  return nested ? leaf : arrayPlusToken(producer, leaf);
};
const arrayElementToken = (token) => {
  const flow = flowParts(token);
  const base = flow?.base || token;
  const product = base.startsWith(ARRAY_PRODUCT)
    ? arrayProductParts(base)
    : null;
  const element = product?.leaf ?? decodeURIComponent(base.slice(ARRAY.length));
  return flow ? flowToken(element, flow.hash) : element;
};

/** Symbolic parameters survive function-return analysis until the exact call
 * site supplies an origin. Property/element steps are encoded, not guessed. */
const symbolicProperty = (token, key) => `${token}|p:${encodeURIComponent(key)}`;
// At shape-provenance level `a` (wrap one array layer) and `e` (consume one
// proven layer) are inverse edges. Keep their path domain reduced in both
// directions. This makes structure-preserving recursive maps finite without a
// cap: `e|a` is identity, while a genuinely nesting map is `e|a|a` and reduces
// to one net `a`. Encoded property/key payloads contain no raw `|`, so only an
// adjacent array edge can cancel.
const appendSymbolicArrayOp = (token, operation) => {
  const separator = token.lastIndexOf('|');
  const prior = separator < 0 ? '' : token.slice(separator + 1);
  if ((prior === 'a' && operation === 'e') || (prior === 'e' && operation === 'a')) {
    return token.slice(0, separator);
  }
  return `${token}|${operation}`;
};
const symbolicElement = (token) => appendSymbolicArrayOp(token, 'e');
const symbolicArray = (token) => appendSymbolicArrayOp(token, 'a');
// Scalar-or-array normalization (used by flatMap and concat arguments) is
// idempotent: once a value is known to be an array result, applying the same
// transfer cannot add another layer. Keeping that law in the symbolic syntax
// prevents recursive helpers from growing `|f|f|...` forever.
const symbolicFlatArray = (token) => (token.endsWith('|f') ? token : `${token}|f`);
const symbolicFlatten = (token, depth) => {
  if (depth === 0) return token;
  const separator = token.lastIndexOf('|');
  const prior = separator < 0 ? '' : token.slice(separator + 1);
  if (typeof depth === 'number' && prior.startsWith('d:')
    && /^d:\d+$/.test(prior)) {
    const combined = Math.min(
      Number.MAX_SAFE_INTEGER,
      Number(prior.slice(2)) + depth,
    );
    return `${token.slice(0, separator)}|d:${combined}`;
  }
  return `${token}|d:${depth}`;
};
// Object.values is not an array element edge in the symbolic domain: for an
// arbitrary object it selects every enumerable value and then creates a new
// array. Keeping the value-selection edge distinct prevents the `e|a`
// normalizer from erasing the entire operation before the exact argument is
// available at a call site.
const symbolicValues = (token) => `${token}|v`;
const symbolicKey = (token, keyDomain) => `${token}|k:${keyDomain}`;

const KEY_LITERAL = 'l:';
const KEY_PARAM = 'p:';
const KEY_UNKNOWN = 'u';
const literalKeyDomain = (key) => `${KEY_LITERAL}${encodeURIComponent(String(key))}`;
const paramKeyDomain = (index) => `${KEY_PARAM}${index}`;

/** Treat a concrete RECORD as an array element shape. Used only when syntax has
 * proved an array constructor/result; arbitrary element access never calls it. */
const asArray = (token) => {
  const flow = flowParts(token);
  if (flow) {
    const array = asArray(flow.base);
    return array ? flowToken(array, flow.hash) : null;
  }
  if (isSymbolicToken(token)) return symbolicArray(token);
  if (isArrayPlusToken(token)) return token;
  if (isRecordToken(token) || isArrayToken(token) || isDictionaryToken(token)
    || isLocalToken(token) || isPromiseToken(token)) {
    return arrayToken(token);
  }
  return null;
};

/** `flatMap` wraps record returns but removes one array layer from array returns. */
const asFlatMapResult = (token) => {
  const flow = flowParts(token);
  if (flow) {
    const flattened = asFlatMapResult(flow.base);
    return flattened ? flowToken(flattened, flow.hash) : null;
  }
  if (isSymbolicToken(token)) return symbolicFlatArray(token);
  if (isArrayLikeToken(token)) return token;
  return asArray(token);
};

/** Extract an element only from a proven array or dictionary. The old spelling
 * returned a record receiver unchanged for `record[dynamicKey]`, which is the
 * systemic false-attribution class this provenance model exists to remove. */
const asElem = (token) => {
  const flow = flowParts(token);
  if (flow) {
    const element = asElem(flow.base);
    return element ? flowToken(element, flow.hash) : null;
  }
  if (isArrayToken(token)) return arrayElementToken(token);
  if (isDictionaryToken(token)) return recordToken(originOf(token));
  if (isSymbolicToken(token)) return symbolicElement(token);
  return null;
};

/** Element extraction is set-valued for a recursive array language. If
 * Plus_p(L) denotes every positive array depth over L, consuming one proven
 * layer can expose either L (depth one) or Plus_p(L) (depth two or greater).
 * Keep that equation here rather than making scalar `asElem` silently discard
 * either alternative. */
const arrayElementTokens = (token) => {
  const plus = arrayPlusParts(token);
  if (plus) return new Set([plus.leaf, token]);
  const element = asElem(token);
  return element ? new Set([element]) : new Set();
};

const flattenArrayToken = (token, levels) => {
  if (isArrayPlusToken(token) || levels <= 0) return token;
  if (!isArrayToken(token)) return null;
  let flattened = token;
  for (let level = 0; level < levels; level += 1) {
    const element = asElem(flattened);
    if (!element || !isArrayLikeToken(element)) break;
    flattened = element;
  }
  return flattened;
};

const flattenArrayAlternatives = (token) => {
  const out = new Set();
  let current = token;
  for (;;) {
    if (current) out.add(current);
    const next = current ? flattenArrayToken(current, 1) : null;
    if (!next || next === current) return out;
    current = next;
  }
};

const staticNumericValue = (node) => {
  if (!node) return null;
  const value = unwrap(node);
  if (ts.isNumericLiteral(value)) return Number(value.text);
  if (ts.isPrefixUnaryExpression(value) && ts.isNumericLiteral(unwrap(value.operand))) {
    const number = Number(unwrap(value.operand).text);
    if (value.operator === ts.SyntaxKind.MinusToken) return -number;
    if (value.operator === ts.SyntaxKind.PlusToken) return number;
  }
  return null;
};

const normalizedFlatDepth = (value) => {
  if (Number.isNaN(value) || value <= 0) return 0;
  if (!Number.isFinite(value)) return Number.POSITIVE_INFINITY;
  return Math.floor(value);
};

const unwrap = (n) => {
  let cur = n;
  for (;;) {
    if (!cur) return cur;
    if (ts.isParenthesizedExpression(cur) || ts.isAsExpression(cur) || ts.isNonNullExpression(cur)
      || ts.isTypeAssertionExpression?.(cur) || ts.isSatisfiesExpression?.(cur)) { cur = cur.expression; continue; }
    return cur;
  }
};

/** Exact JavaScript property spelling for static bracket syntax. Numeric keys
 * use ToPropertyKey's canonical number string, including signed forms. */
const staticElementKey = (node) => {
  if (!node) return null;
  const value = unwrap(node);
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
    return value.text;
  }
  if (ts.isNumericLiteral(value)) return String(Number(value.text));
  if (ts.isPrefixUnaryExpression(value) && ts.isNumericLiteral(unwrap(value.operand))
    && (value.operator === ts.SyntaxKind.MinusToken
      || value.operator === ts.SyntaxKind.PlusToken)) {
    const number = Number(unwrap(value.operand).text);
    return String(value.operator === ts.SyntaxKind.MinusToken ? -number : number);
  }
  return null;
};

const staticPropertyKey = (name) => {
  if (!name) return null;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)
    || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  if (ts.isNumericLiteral(name)) return String(Number(name.text));
  if (ts.isComputedPropertyName(name)) return staticElementKey(name.expression);
  return null;
};

const flowOwnerOf = (node) => {
  for (let current = node; current; current = current.parent) {
    if (ts.isFunctionLike(current) || ts.isSourceFile(current)) return current;
  }
  return null;
};

const ZERO_DELAY = Object.freeze({ min: 0, max: 0 });
const PROMPT_PROMISE_RESOLVE_CALLS = new WeakSet();
const addDelayRanges = (left = ZERO_DELAY, right = ZERO_DELAY) => ({
  min: left.min + right.min,
  max: left.max === Number.POSITIVE_INFINITY || right.max === Number.POSITIVE_INFINITY
    ? Number.POSITIVE_INFINITY
    : left.max + right.max,
});
const staticBooleanSyntax = (expression) => {
  const value = unwrap(expression);
  if (!value) return null;
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (value.kind === ts.SyntaxKind.FalseKeyword || value.kind === ts.SyntaxKind.NullKeyword) {
    return false;
  }
  if (ts.isNumericLiteral(value)) return Number(value.text) !== 0;
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
    return value.text.length > 0;
  }
  return null;
};
const directChildWithin = (ancestor, node) => {
  let current = node;
  while (current?.parent && current.parent !== ancestor) current = current.parent;
  return current?.parent === ancestor ? current : null;
};
const branchRoleWithin = (ancestor, node) => {
  const child = directChildWithin(ancestor, node);
  if (!child) return null;
  if (ts.isIfStatement(ancestor)) {
    if (child === ancestor.thenStatement) return 'then';
    if (child === ancestor.elseStatement) return 'else';
    return 'condition';
  }
  if (ts.isConditionalExpression(ancestor)) {
    if (child === ancestor.whenTrue) return 'then';
    if (child === ancestor.whenFalse) return 'else';
    return 'condition';
  }
  if (ts.isBinaryExpression(ancestor)
    && (ancestor.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
      || ancestor.operatorToken.kind === ts.SyntaxKind.BarBarToken
      || ancestor.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)) {
    return child === ancestor.right ? 'right' : 'left';
  }
  return null;
};
const promptAwaitOperand = (expression) => {
  const value = unwrap(expression);
  if (ts.isNumericLiteral(value) || ts.isStringLiteral(value)
    || ts.isNoSubstitutionTemplateLiteral(value)
    || value.kind === ts.SyntaxKind.TrueKeyword
    || value.kind === ts.SyntaxKind.FalseKeyword
    || value.kind === ts.SyntaxKind.NullKeyword) return true;
  return ts.isCallExpression(value)
    && PROMPT_PROMISE_RESOLVE_CALLS.has(value);
};
const staticYieldStarElements = (expression) => {
  const value = unwrap(expression);
  if (!ts.isArrayLiteralExpression(value)
    || value.elements.some((element) => ts.isSpreadElement(element))) return null;
  return [...value.elements];
};

/** Count suspension checkpoints on paths that can reach one operation point.
 * This is deliberately control-relative rather than source-text-relative:
 * mutually exclusive and statically unreachable branches cannot lend a phase,
 * while an unknown conditional checkpoint widens the range. */
const suspensionRangeAt = (node, kind = 'await') => {
  const owner = flowOwnerOf(node);
  if (!owner || !ts.isFunctionLike(owner) || !owner.body) return ZERO_DELAY;
  let range = ZERO_DELAY;
  const visit = (current) => {
    if (ts.isFunctionLike(current) && current !== owner) return;
    const checkpoint = kind === 'yield'
      ? ts.isYieldExpression(current)
      : ts.isAwaitExpression(current);
    if (checkpoint && current.end <= node.end) {
      let optional = false;
      let repeated = false;
      let reachable = true;
      for (let ancestor = current.parent; ancestor && ancestor !== owner; ancestor = ancestor.parent) {
        if (ts.isIfStatement(ancestor) || ts.isConditionalExpression(ancestor)) {
          const checkpointRole = branchRoleWithin(ancestor, current);
          if (checkpointRole !== 'then' && checkpointRole !== 'else') continue;
          const condition = staticBooleanSyntax(
            ts.isIfStatement(ancestor) ? ancestor.expression : ancestor.condition,
          );
          const chosen = condition == null ? null : (condition ? 'then' : 'else');
          if (chosen && checkpointRole !== chosen) { reachable = false; break; }
          const targetRole = ancestor.pos <= node.pos && node.end <= ancestor.end
            ? branchRoleWithin(ancestor, node)
            : null;
          if (targetRole === 'then' || targetRole === 'else') {
            if (targetRole !== checkpointRole) { reachable = false; break; }
          } else if (!chosen) optional = true;
        } else if (ts.isBinaryExpression(ancestor)
          && (ancestor.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
            || ancestor.operatorToken.kind === ts.SyntaxKind.BarBarToken
            || ancestor.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)
          && branchRoleWithin(ancestor, current) === 'right') {
          const targetRole = ancestor.pos <= node.pos && node.end <= ancestor.end
            ? branchRoleWithin(ancestor, node)
            : null;
          if (targetRole !== 'right') optional = true;
        } else if (ts.isForStatement(ancestor) || ts.isForInStatement(ancestor)
          || ts.isForOfStatement(ancestor) || ts.isWhileStatement(ancestor)
          || ts.isDoStatement(ancestor)) {
          repeated = true;
          if (!(ancestor.statement.pos <= node.pos && node.end <= ancestor.statement.end)) {
            optional = true;
          }
        }
      }
      if (!reachable) return;
      let unit;
      if (kind === 'yield' && current.asteriskToken) {
        const elements = staticYieldStarElements(current.expression);
        unit = elements
          ? { min: elements.length, max: elements.length }
          : { min: 0, max: Number.POSITIVE_INFINITY };
      } else {
        unit = kind === 'await' && !promptAwaitOperand(current.expression)
          ? { min: 1, max: Number.POSITIVE_INFINITY }
          : { min: 1, max: 1 };
      }
      range = {
        min: range.min + (optional ? 0 : unit.min),
        max: repeated || range.max === Number.POSITIVE_INFINITY
          || unit.max === Number.POSITIVE_INFINITY
          ? Number.POSITIVE_INFINITY
          : range.max + unit.max,
      };
      return;
    }
    ts.forEachChild(current, visit);
  };
  visit(owner.body);
  return range;
};

const callIsAwaited = (call) => {
  let current = call.parent;
  while (current && (ts.isParenthesizedExpression(current)
    || ts.isAsExpression(current) || ts.isNonNullExpression(current))) {
    current = current.parent;
  }
  return Boolean(current && ts.isAwaitExpression(current));
};

const functionHasModifier = (fn, kind) => (
  (ts.canHaveModifiers(fn) ? ts.getModifiers(fn) || [] : [])
    .some((modifier) => modifier.kind === kind)
);
const isAsyncFunction = (fn) => functionHasModifier(fn, ts.SyntaxKind.AsyncKeyword);
const isGeneratorFunction = (fn) => Boolean(fn?.asteriskToken);

const loopOwnerOf = (node) => {
  for (let current = node?.parent; current; current = current.parent) {
    if (ts.isFunctionLike(current) || ts.isSourceFile(current)) return null;
    if (ts.isForStatement(current) || ts.isForInStatement(current)
      || ts.isForOfStatement(current) || ts.isWhileStatement(current)
      || ts.isDoStatement(current)) return current;
  }
  return null;
};

/**
 * Build one TypeScript Program for symbol identity and the call graph. The
 * checker is NOT shape authority — executed producers remain the only source of
 * keys — but it is the correct authority for lexical shadowing, aliases,
 * default/namespace imports, and re-export chains. A handwritten file-level
 * `Map<name, fn>` attached nested same-name calls to whichever declaration was
 * visited last and silently stopped after six re-export hops.
 * @param {string[]} files absolute paths
 */
export function buildIndex(files) {
  const options = {
    allowJs: true,
    checkJs: false,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
  };
  const program = ts.createProgram({ rootNames: files, options });
  const checker = program.getTypeChecker();
  /** @type {Map<string, ts.SourceFile>} */
  const sources = new Map();
  for (const file of files) {
    const source = program.getSourceFile(file);
    if (source) sources.set(file, source);
  }

  /** @type {Map<ts.Symbol, object>} */
  const bindings = new Map();
  const allBindings = new Set();
  const functions = new Set();
  const escapedFunctions = new Set();
  /** @type {Map<ts.Node, {file:string, args:ts.Node[]}[]>} */
  const callSites = new Map();
  /** Named array callbacks are semantic calls whose first argument is one
   * element of the receiver, even though no CallExpression spells that
   * argument. Keep that call context separate from ordinary argument sites. */
  const elementCallSites = new Map();
  const generatorResumeByCall = new Map();
  const callGraph = new Map();
  const indexStats = {
    unresolvedCallees: 0,
    indexedCallSites: 0,
    indexedElementCallSites: 0,
    indexedBindings: 0,
  };

  const canonicalSymbol = (symbol) => {
    let current = symbol || null;
    const seen = new Set();
    while (current && (current.flags & ts.SymbolFlags.Alias) && !seen.has(current)) {
      seen.add(current);
      const next = checker.getAliasedSymbol(current);
      if (!next || next === current) break;
      current = next;
    }
    return current;
  };

  const symbolAt = (node) => canonicalSymbol(checker.getSymbolAtLocation(node));

  const isDefaultLibrarySymbol = (node) => {
    const symbol = symbolAt(node);
    return Boolean(symbol && (symbol.declarations || []).some(
      (declaration) => program.isSourceFileDefaultLibrary(declaration.getSourceFile()),
    ));
  };

  const isIntrinsicGlobal = (node, name) => {
    const value = unwrap(node);
    if (!ts.isIdentifier(value) || value.text !== name) return false;
    return isDefaultLibrarySymbol(value);
  };
  const classifyCall = (node) => {
    const call = unwrap(node);
    if (!ts.isCallExpression(call)) return { kind: 'unknown', target: null };
    const callee = unwrap(call.expression);
    const target = functionOf(callee);
    if (target) return { kind: 'source', target };
    if (!ts.isPropertyAccessExpression(callee)) return { kind: 'unknown', target: null };
    const method = callee.name.text;
    if (isIntrinsicGlobal(callee.expression, 'Object')) {
      return { kind: `Object.${method}`, target: null };
    }
    if (isIntrinsicGlobal(callee.expression, 'Promise')) {
      return { kind: `Promise.${method}`, target: null };
    }
    return { kind: 'candidate-method', target: null };
  };

  // Timing analysis is syntax-tree based and intentionally checker-agnostic.
  // Seed its weak identity set from this Program once so only the actual
  // default-library Promise.resolve intrinsic is considered promptly settled.
  for (const source of sources.values()) {
    const visit = (node) => {
      if (ts.isCallExpression(node)
        && ts.isPropertyAccessExpression(unwrap(node.expression))
        && unwrap(node.expression).name.text === 'resolve'
        && isIntrinsicGlobal(unwrap(node.expression).expression, 'Promise')) {
        PROMPT_PROMISE_RESOLVE_CALLS.add(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  /** Resolve a symbol to a local function-like declaration, following ordinary
   * identifier aliases without guessing through calls or object mutation. */
  const functionOfSymbol = (symbol, seen = new Set()) => {
    const current = canonicalSymbol(symbol);
    if (!current || seen.has(current)) return null;
    seen.add(current);
    for (const declaration of current.declarations || []) {
      if (ts.isFunctionDeclaration(declaration) || ts.isFunctionExpression(declaration)
        || ts.isArrowFunction(declaration) || ts.isMethodDeclaration(declaration)) {
        return declaration;
      }
      if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
        const initializer = unwrap(declaration.initializer);
        if (ts.isFunctionExpression(initializer) || ts.isArrowFunction(initializer)) return initializer;
        if (ts.isIdentifier(initializer) || ts.isPropertyAccessExpression(initializer)) {
          const target = functionOfSymbol(symbolAt(
            ts.isPropertyAccessExpression(initializer) ? initializer.name : initializer,
          ), seen);
          if (target) return target;
        }
      }
      if (ts.isPropertyAssignment(declaration)) {
        const initializer = unwrap(declaration.initializer);
        if (ts.isFunctionExpression(initializer) || ts.isArrowFunction(initializer)) return initializer;
        if (ts.isIdentifier(initializer) || ts.isPropertyAccessExpression(initializer)) {
          const target = functionOfSymbol(symbolAt(
            ts.isPropertyAccessExpression(initializer) ? initializer.name : initializer,
          ), seen);
          if (target) return target;
        }
      }
    }
    return null;
  };

  const functionOf = (callee) => {
    const targetNode = ts.isPropertyAccessExpression(callee) ? callee.name : callee;
    const fn = functionOfSymbol(symbolAt(targetNode));
    if (!fn) return null;
    const file = fn.getSourceFile().fileName;
    return sources.has(file) ? { fn, file } : null;
  };

  const bind = (nameNode, info) => {
    const symbol = symbolAt(nameNode);
    if (!symbol || bindings.has(symbol)) return;
    bindings.set(symbol, info);
    allBindings.add(info);
    indexStats.indexedBindings += 1;
  };
  const boundValueOf = (identifier) => {
    const direct = bindings.get(symbolAt(identifier));
    if (direct) return direct;
    const parent = identifier.parent;
    if (parent && ts.isShorthandPropertyAssignment(parent) && parent.name === identifier) {
      const valueSymbol = canonicalSymbol(checker.getShorthandAssignmentValueSymbol(parent));
      return bindings.get(valueSymbol) || null;
    }
    return null;
  };

  const propertyNameOf = (element) => {
    const name = element.propertyName || element.name;
    return staticPropertyKey(name);
  };

  const containsAbruptCompletion = (node, root = node) => {
    if (ts.isFunctionLike(node)) return false;
    if (ts.isReturnStatement(node) || ts.isThrowStatement(node)
      || ts.isBreakStatement(node) || ts.isContinueStatement(node)) return true;
    let found = false;
    ts.forEachChild(node, (child) => {
      if (!found && containsAbruptCompletion(child, root)) found = true;
    });
    return found;
  };
  const hasPrecedingAbruptCompletion = (node) => {
    let current = node;
    for (let parent = node?.parent; parent; current = parent, parent = parent.parent) {
      if (ts.isFunctionLike(parent) || ts.isSourceFile(parent)) return false;
      const statements = (ts.isBlock(parent) || ts.isCaseClause(parent)
        || ts.isDefaultClause(parent)) ? parent.statements : null;
      if (!statements) continue;
      for (const statement of statements) {
        if (statement.end > current.pos) break;
        if (containsAbruptCompletion(statement)) return true;
      }
    }
    return false;
  };
  const maySkipAtRuntime = (node) => {
    if (hasPrecedingAbruptCompletion(node)) return true;
    for (let current = node?.parent; current; current = current.parent) {
      if (ts.isFunctionLike(current) || ts.isSourceFile(current)) return false;
      if (ts.isIfStatement(current) || ts.isConditionalExpression(current)
        || ts.isSwitchStatement(current) || ts.isCaseClause(current)
        || ts.isDefaultClause(current) || ts.isTryStatement(current)
        || ts.isCatchClause(current) || ts.isForStatement(current)
        || ts.isForInStatement(current) || ts.isForOfStatement(current)
        || ts.isWhileStatement(current) || ts.isDoStatement(current)) return true;
      if (ts.isBinaryExpression(current)
        && (current.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
          || current.operatorToken.kind === ts.SyntaxKind.BarBarToken
          || current.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)
        && current.right.pos <= node.pos) return true;
    }
    return false;
  };
  const executionSiteOf = (node, file) => ({
    file,
    pos: node.pos,
    end: node.end,
    owner: flowOwnerOf(node),
    loop: loopOwnerOf(node),
    optional: maySkipAtRuntime(node),
    delay: suspensionRangeAt(node),
    resume: suspensionRangeAt(node, 'yield'),
  });

  const bindVariablePattern = (
    pattern,
    initializer,
    file,
    projection = [],
    definitionNode = pattern.parent,
    fallbacks = [],
    additionalInitializers = [],
  ) => {
    if (ts.isIdentifier(pattern)) {
      const value = initializer ? unwrap(initializer) : null;
      if (!projection.length && value
        && (ts.isArrowFunction(value) || ts.isFunctionExpression(value))) return;
      bind(pattern, {
        k: 'expr',
        node: initializer || null,
        additionalInitializers,
        projection,
        fallbacks,
        file,
        declarationOwner: flowOwnerOf(definitionNode),
        writes: [],
        definitionSite: (initializer || additionalInitializers.length)
          ? executionSiteOf(definitionNode, file)
          : null,
        emptyObject: Boolean(
          !projection.length && value
          && ts.isObjectLiteralExpression(value) && value.properties.length === 0
        ),
      });
      return;
    }
    if (ts.isObjectBindingPattern(pattern)) {
      for (const element of pattern.elements) {
        if (!element.name) continue;
        const prop = propertyNameOf(element);
        if (!element.dotDotDotToken && prop == null) continue;
        bindVariablePattern(
          element.name,
          initializer,
          file,
          element.dotDotDotToken ? projection : [...projection, { kind: 'property', key: prop }],
          definitionNode,
          element.initializer ? [...fallbacks, element.initializer] : fallbacks,
          additionalInitializers,
        );
      }
      return;
    }
    if (ts.isArrayBindingPattern(pattern)) {
      pattern.elements.forEach((element) => {
        if (!ts.isBindingElement(element)) return;
        bindVariablePattern(
          element.name,
          initializer,
          file,
          element.dotDotDotToken ? projection : [...projection, { kind: 'element' }],
          definitionNode,
          element.initializer ? [...fallbacks, element.initializer] : fallbacks,
          additionalInitializers,
        );
      });
    }
  };

  const thrownExpressionsIn = (block) => {
    const expressions = [];
    const visit = (node) => {
      if (ts.isFunctionLike(node)) return;
      if (ts.isThrowStatement(node) && node.expression) expressions.push(node.expression);
      ts.forEachChild(node, visit);
    };
    visit(block);
    return expressions;
  };
  const isExportedFunction = (fn) => {
    for (let current = fn; current && !ts.isSourceFile(current); current = current.parent) {
      // Export belongs to this function only. A nested helper/accessor inside
      // an exported function is not itself an external entry point.
      if (ts.isFunctionLike(current) && current !== fn) return false;
      const modifiers = ts.canHaveModifiers(current) ? ts.getModifiers(current) || [] : [];
      if (modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        || modifier.kind === ts.SyntaxKind.DefaultKeyword)) return true;
    }
    return false;
  };

  for (const [file, source] of sources) {
    const visit = (node) => {
      if (ts.isVariableDeclaration(node)) {
        const declarationList = ts.isVariableDeclarationList(node.parent) ? node.parent : null;
        const forOf = declarationList && ts.isForOfStatement(declarationList.parent)
          ? declarationList.parent
          : null;
        if (forOf) {
          bindVariablePattern(
            node.name,
            forOf.expression,
            file,
            [{ kind: 'element' }],
            node,
          );
        } else {
          bindVariablePattern(node.name, node.initializer, file, [], node);
        }
      }
      if (ts.isCatchClause(node) && node.variableDeclaration) {
        const thrown = thrownExpressionsIn(node.parent.tryBlock);
        bindVariablePattern(
          node.variableDeclaration.name,
          thrown[0] || null,
          file,
          [],
          node.variableDeclaration,
          [],
          thrown.slice(1),
        );
      }
      if (ts.isFunctionLike(node) && node.parameters) {
        functions.add(node);
        if (isExportedFunction(node)) escapedFunctions.add(node);
        let callbackArray = null;
        const parent = node.parent;
        if (parent && ts.isCallExpression(parent) && parent.arguments[0] === node
          && ts.isPropertyAccessExpression(parent.expression)
          && classifyCall(parent).kind !== 'source'
          && ELEMENT_CB_METHODS.has(parent.expression.name.text)) {
          callbackArray = parent.expression.expression;
        }
        node.parameters.forEach((parameter, index) => {
          if (ts.isIdentifier(parameter.name)) {
            if (callbackArray && index === 0) {
              bind(parameter.name, {
                k: 'elem', node: callbackArray, call: parent, file, writes: [],
              });
            } else {
              bind(parameter.name, {
                k: 'param', fn: node, index, file, writes: [],
              });
            }
          } else if (ts.isObjectBindingPattern(parameter.name)) {
            for (const element of parameter.name.elements) {
              if (element.dotDotDotToken || !ts.isIdentifier(element.name)) continue;
              const prop = propertyNameOf(element);
              if (prop != null) {
                bind(element.name, {
                  k: 'param', fn: node, index, prop, file, writes: [],
                });
              }
            }
          }
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  /** Direct aliases of one syntax-created object share mutation identity.
   * Associate writes with the constructor node itself, so reads through either
   * alias resolve to the same ordered local record instead of promoting one
   * spelling to a dictionary and leaving the other stale. */
  const aliasParent = new Map([...allBindings].map((binding) => [binding, binding]));
  const aliasRoot = (binding) => {
    let root = binding;
    while (aliasParent.get(root) !== root) root = aliasParent.get(root);
    let current = binding;
    while (aliasParent.get(current) !== current) {
      const next = aliasParent.get(current);
      aliasParent.set(current, root);
      current = next;
    }
    return root;
  };
  const unionAliases = (left, right) => {
    const a = aliasRoot(left);
    const b = aliasRoot(right);
    if (a !== b) aliasParent.set(b, a);
  };
  const isObjectAssignCall = (node) => {
    const value = unwrap(node);
    return ts.isCallExpression(value) && classifyCall(value).kind === 'Object.assign';
  };
  for (const binding of allBindings) {
    if (binding.k !== 'expr' || !binding.node || binding.projection?.length) continue;
    const value = unwrap(binding.node);
    const aliasExpression = isObjectAssignCall(value)
      ? unwrap(value.arguments[0])
      : value;
    if (!ts.isIdentifier(aliasExpression)) continue;
    const target = bindings.get(symbolAt(aliasExpression));
    if (target) unionAliases(binding, target);
  }
  const anchorsByAliasRoot = new Map();
  for (const binding of allBindings) {
    if (binding.k !== 'expr' || !binding.node || binding.projection?.length) continue;
    const value = unwrap(binding.node);
    if (!ts.isObjectLiteralExpression(value) && !isObjectAssignCall(value)) continue;
    if (isObjectAssignCall(value)) {
      const target = unwrap(value.arguments[0]);
      if (ts.isIdentifier(target) && bindings.get(symbolAt(target))) continue;
    }
    const root = aliasRoot(binding);
    let anchors = anchorsByAliasRoot.get(root);
    if (!anchors) { anchors = new Set(); anchorsByAliasRoot.set(root, anchors); }
    const assignTarget = isObjectAssignCall(value) ? unwrap(value.arguments[0]) : null;
    anchors.add(assignTarget && ts.isObjectLiteralExpression(assignTarget) ? assignTarget : value);
  }
  const localMutations = new Map();
  const heapEffects = [];
  let mutationSequence = 0;
  const immutableInitializerOf = (expression, seen = new Set()) => {
    const value = unwrap(expression);
    if (!ts.isIdentifier(value)) return value;
    const binding = bindings.get(symbolAt(value));
    if (!binding || binding.k !== 'expr' || !binding.node || binding.projection?.length
      || seen.has(binding)) return value;
    const declaration = binding.node.parent;
    const list = declaration && ts.isVariableDeclaration(declaration)
      && ts.isVariableDeclarationList(declaration.parent)
      ? declaration.parent
      : null;
    if (!list || !(list.flags & ts.NodeFlags.Const)) return value;
    return immutableInitializerOf(binding.node, new Set(seen).add(binding));
  };
  const staticKeyOfExpression = (expression) => {
    const value = immutableInitializerOf(expression);
    if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)
      || ts.isNumericLiteral(value)) return value.text;
    return null;
  };
  const descriptorPropertyKey = (name) => {
    const direct = staticPropertyKey(name);
    if (direct != null) return direct;
    return ts.isComputedPropertyName(name)
      ? staticKeyOfExpression(name.expression)
      : null;
  };
  const localConstructorOf = (expression) => {
    if (!expression) return null;
    const value = unwrap(expression);
    if (ts.isObjectLiteralExpression(value) || isObjectAssignCall(value)) return value;
    if (!ts.isIdentifier(value)) return null;
    const binding = bindings.get(symbolAt(value));
    const anchors = binding ? anchorsByAliasRoot.get(aliasRoot(binding)) : null;
    return anchors?.size === 1 ? [...anchors][0] : null;
  };
  const directFieldExpression = (constructor, key) => {
    const value = unwrap(constructor);
    if (ts.isObjectLiteralExpression(value)) {
      let selected = null;
      let uncertain = false;
      for (const property of value.properties) {
        if (ts.isSpreadAssignment(property)) {
          selected = null;
          uncertain = true;
          continue;
        }
        if (staticPropertyKey(property.name) !== key) continue;
        if (ts.isPropertyAssignment(property)) selected = property.initializer;
        else if (ts.isShorthandPropertyAssignment(property)) selected = property.name;
        else selected = null;
        uncertain = false;
      }
      return uncertain ? null : selected;
    }
    return null;
  };
  const constructorAtPath = (constructor, path) => {
    let current = constructor;
    for (const key of path) {
      current = localConstructorOf(directFieldExpression(current, key));
      if (!current) return null;
    }
    return current;
  };
  const initialPropertyDescriptorFor = (constructor, key) => {
    const value = unwrap(constructor);
    if (!ts.isObjectLiteralExpression(value)) return { kind: 'unknown' };
    let descriptor = { kind: 'absent' };
    let exact = true;
    for (const property of value.properties) {
      if (ts.isSpreadAssignment(property)) {
        descriptor = null;
        exact = false;
        continue;
      }
      const propertyKey = descriptorPropertyKey(property.name);
      if (propertyKey == null) {
        descriptor = null;
        exact = false;
        continue;
      }
      if (propertyKey !== key) continue;
      if (ts.isGetAccessorDeclaration(property)) {
        descriptor = descriptor?.kind === 'accessor'
          ? { ...descriptor, getter: property }
          : { kind: 'accessor', getter: property, setter: null };
      } else if (ts.isSetAccessorDeclaration(property)) {
        descriptor = descriptor?.kind === 'accessor'
          ? { ...descriptor, setter: property }
          : { kind: 'accessor', getter: null, setter: property };
      } else {
        descriptor = { kind: 'data' };
      }
      exact = true;
    }
    return exact ? descriptor : { kind: 'unknown' };
  };
  const descriptorStates = new Map();
  const descriptorStateFor = (constructor, key) => {
    let states = descriptorStates.get(constructor);
    if (!states) { states = new Map(); descriptorStates.set(constructor, states); }
    if (!states.has(key)) states.set(key, initialPropertyDescriptorFor(constructor, key));
    return states.get(key);
  };
  const setDescriptorState = (constructor, key, state) => {
    let states = descriptorStates.get(constructor);
    if (!states) { states = new Map(); descriptorStates.set(constructor, states); }
    states.set(key, state);
  };
  const knownStaticKeysOf = (constructor) => {
    const value = unwrap(constructor);
    const keys = new Set();
    if (ts.isObjectLiteralExpression(value)) for (const property of value.properties) {
      const key = ts.isSpreadAssignment(property) ? null : descriptorPropertyKey(property.name);
      if (key != null) keys.add(key);
    }
    for (const key of descriptorStates.get(constructor)?.keys() || []) keys.add(key);
    return keys;
  };
  const returnExpressionsOf = (fn) => {
    const expressions = [];
    const visit = (node) => {
      if (ts.isFunctionLike(node) && node !== fn) return;
      if (ts.isReturnStatement(node) && node.expression) expressions.push(node.expression);
      ts.forEachChild(node, visit);
    };
    if (fn.body) visit(fn.body);
    return expressions;
  };
  const staticObjectEntries = (expression) => {
    const value = immutableInitializerOf(expression);
    if (!ts.isObjectLiteralExpression(value)) return null;
    const entries = new Map();
    for (const property of value.properties) {
      if (ts.isSpreadAssignment(property)) return null;
      const key = descriptorPropertyKey(property.name);
      if (key == null) return null;
      if (ts.isPropertyAssignment(property)) entries.set(key, {
        sources: [property.initializer], getter: null,
      });
      else if (ts.isShorthandPropertyAssignment(property)) entries.set(key, {
        sources: [property.name], getter: null,
      });
      else if (ts.isGetAccessorDeclaration(property)) entries.set(key, {
        sources: returnExpressionsOf(property), getter: property,
      });
      else entries.delete(key);
    }
    return entries;
  };
  const implicitCallIds = new Set();
  const registerImplicitCall = (
    fn,
    argumentSources,
    call,
    file,
    site,
    reason,
    optional = false,
    thisSource = null,
  ) => {
    if (!fn || !call) return;
    const sources = Array.isArray(argumentSources)
      ? argumentSources.filter(Boolean)
      : (argumentSources ? [argumentSources] : []);
    const id = `${reason}:${file}:${call.pos}:${call.end}:${fn.pos}:${fn.end}`;
    if (implicitCallIds.has(id)) return;
    implicitCallIds.add(id);
    let sites = callSites.get(fn);
    if (!sites) { sites = []; callSites.set(fn, sites); }
    sites.push({
      file,
      args: sources.slice(0, 1),
      argumentSources: new Map([[0, sources]]),
      call,
      site: optional ? { ...site, optional: true } : site,
      implicit: reason,
      thisSource,
      awaited: false,
    });
    indexStats.indexedCallSites += 1;
    const owner = site.owner;
    if (owner && ts.isFunctionLike(owner)) {
      let edges = callGraph.get(owner);
      if (!edges) { edges = new Set(); callGraph.set(owner, edges); }
      edges.add(fn);
    }
  };
  const accessorAlternativesOf = (descriptor) => {
    if (descriptor?.kind === 'accessor') return [descriptor];
    if (descriptor?.kind === 'mixed' && descriptor.accessor) return [descriptor.accessor];
    return [];
  };
  const descriptorMayBeData = (descriptor) => (
    !descriptor || descriptor.kind !== 'accessor'
  );
  const knownLiteralValue = (expression) => {
    const value = immutableInitializerOf(expression);
    if (ts.isIdentifier(value) && value.text === 'undefined' && !bindings.get(symbolAt(value))) {
      return { known: true, value: undefined };
    }
    if (value.kind === ts.SyntaxKind.NullKeyword) return { known: true, value: null };
    if (value.kind === ts.SyntaxKind.TrueKeyword) return { known: true, value: true };
    if (value.kind === ts.SyntaxKind.FalseKeyword) return { known: true, value: false };
    if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
      return { known: true, value: value.text };
    }
    const numeric = staticNumericValue(value);
    if (numeric != null) return { known: true, value: numeric };
    if (ts.isVoidExpression(value)) return { known: true, value: undefined };
    return { known: false, value: undefined };
  };
  const accessorSetterMode = (getter, assignment) => {
    if (assignment !== 'or' && assignment !== 'coalesce' && assignment !== 'and') {
      return 'always';
    }
    if (!getter) return assignment === 'and' ? 'never' : 'always';
    const returns = returnExpressionsOf(getter);
    if (!returns.length) return assignment === 'and' ? 'never' : 'always';
    const decisions = returns.map((expression) => {
      const literal = knownLiteralValue(expression);
      if (!literal.known) {
        // The scanner's tracked values are object/container provenance. A
        // non-literal getter result is therefore treated as the object path;
        // exact falsy/nullish literals above retain the opposite path.
        return assignment === 'and' ? true : false;
      }
      if (assignment === 'coalesce') return literal.value == null;
      if (assignment === 'or') return !literal.value;
      return Boolean(literal.value);
    });
    if (decisions.every(Boolean)) return 'always';
    if (decisions.every((decision) => !decision)) return 'never';
    return 'maybe';
  };
  const recordLocalMutation = (binding, targetPath, mutation) => {
    const anchors = anchorsByAliasRoot.get(aliasRoot(binding));
    if (!anchors?.size) return false;
    let recorded = false;
    for (const anchor of anchors) {
      const target = constructorAtPath(anchor, targetPath);
      if (!target) continue;
      let entry = { ...mutation, receiverBinding: binding, sequence: mutationSequence };
      mutationSequence += 1;
      if (entry.kind === 'field') {
        const descriptor = descriptorStateFor(target, entry.key);
        const accessors = accessorAlternativesOf(descriptor);
        for (const accessor of accessors) {
          const setterMode = accessorSetterMode(accessor.getter, entry.assignment);
          if (accessor.setter && setterMode !== 'never') registerImplicitCall(
            accessor.setter,
            entry.node,
            entry.callNode || entry.node,
            entry.file,
            entry.mutationSite,
            'setter-assignment',
            descriptor.kind === 'mixed' || setterMode === 'maybe',
            target,
          );
        }
        if (!descriptorMayBeData(descriptor)) {
          recorded = true;
          continue;
        }
        if (accessors.length) {
          entry = {
            ...entry,
            // Every descriptor alternative remains present: the accessor path
            // consumes the Set through its setter, while the non-accessor path
            // defines a data property. This is an optional value replacement,
            // but a definite presence transfer.
            preservesPresence: true,
            mutationSite: { ...entry.mutationSite, optional: true },
          };
          setDescriptorState(target, entry.key, {
            kind: 'mixed', accessor: accessors[0], data: true,
          });
        } else setDescriptorState(target, entry.key, { kind: 'data' });
      }
      if (entry.kind === 'spread') {
        const preservedAccessorKeys = new Set();
        const sourceEntries = staticObjectEntries(entry.node);
        let propertyIndex = 0;
        if (sourceEntries) for (const [key, source] of sourceEntries) {
          const descriptor = descriptorStateFor(target, key);
          const accessors = accessorAlternativesOf(descriptor);
          if (!descriptorMayBeData(descriptor)) {
            preservedAccessorKeys.add(key);
          }
          for (const accessor of accessors) {
            if (accessor.setter) registerImplicitCall(
              accessor.setter,
              source.sources,
              entry.callNode || entry.node,
              entry.file,
              {
                ...entry.mutationSite,
                orderPath: [1, entry.sourceIndex ?? 0, propertyIndex, 1],
              },
              `setter-object-assign:${entry.id}:${key}`,
              descriptor.kind === 'mixed',
              target,
            );
          }
          propertyIndex += 1;
          if (accessors.length && descriptorMayBeData(descriptor)) {
            setDescriptorState(target, key, {
              kind: 'mixed', accessor: accessors[0], data: true,
            });
          } else if (!accessors.length) setDescriptorState(target, key, { kind: 'data' });
        }
        // Even an opaque source must use [[Set]] on every accessor already
        // present on the target. The value effect may remain unknown, but the
        // descriptor can never be replaced by Object.assign.
        if (!sourceEntries) {
          for (const key of knownStaticKeysOf(target)) {
            if (descriptorStateFor(target, key).kind === 'accessor') {
              preservedAccessorKeys.add(key);
            }
          }
        }
        entry.preservedAccessorKeys = preservedAccessorKeys;
      }
      let mutations = localMutations.get(target);
      if (!mutations) { mutations = []; localMutations.set(target, mutations); }
      mutations.push(entry);
      if (entry.kind === 'delete' && entry.key != null) {
        const prior = descriptorStateFor(target, entry.key);
        const sameOwner = entry.mutationSite.owner === flowOwnerOf(target);
        if (sameOwner && !entry.mutationSite.optional) {
          setDescriptorState(target, entry.key, { kind: 'absent' });
        } else if (sameOwner && accessorAlternativesOf(prior).length) {
          setDescriptorState(target, entry.key, {
            kind: 'mixed', accessor: accessorAlternativesOf(prior)[0], absent: true,
          });
        }
      } else if (entry.kind === 'dynamic' || entry.kind === 'dynamicDelete') {
        const sameOwner = entry.mutationSite.owner === flowOwnerOf(target);
        for (const key of knownStaticKeysOf(target)) {
          const state = descriptorStateFor(target, key);
          const accessors = accessorAlternativesOf(state);
          if (!sameOwner || !accessors.length) continue;
          if (entry.kind === 'dynamic' && !descriptorMayBeData(state)) {
            entry.preservedAccessorKeys ||= new Set();
            entry.preservedAccessorKeys.add(key);
          }
          for (const accessor of accessors) {
            if (entry.kind === 'dynamic' && accessor.setter) registerImplicitCall(
              accessor.setter,
              entry.node,
              entry.callNode || entry.node,
              entry.file,
              entry.mutationSite,
              'setter-computed-assignment',
              true,
              target,
            );
          }
          if (state.kind === 'accessor' || state.kind === 'mixed') {
            setDescriptorState(target, key, {
              kind: 'mixed', accessor: accessors[0],
              ...(entry.kind === 'dynamicDelete' ? { absent: true } : { data: true }),
            });
          }
        }
      }
      recorded = true;
    }
    return recorded;
  };
  const accessRootAndPath = (expression) => {
    let current = unwrap(expression);
    const path = [];
    for (;;) {
      if (ts.isPropertyAccessExpression(current)) {
        path.unshift(current.name.text);
        current = unwrap(current.expression);
        continue;
      }
      if (ts.isElementAccessExpression(current)) {
        const key = staticElementKey(current.argumentExpression);
        if (key == null) return null;
        path.unshift(key);
        current = unwrap(current.expression);
        continue;
      }
      break;
    }
    if (current.kind === ts.SyntaxKind.ThisKeyword) {
      return { binding: null, path, thisReceiver: current };
    }
    if (!ts.isIdentifier(current)) return null;
    const binding = bindings.get(symbolAt(current));
    return binding ? { binding, path } : null;
  };
  const propertyMutationTarget = (left) => {
    if (ts.isPropertyAccessExpression(left)) {
      const receiver = accessRootAndPath(left.expression);
      return receiver ? { ...receiver, key: left.name.text } : null;
    }
    if (ts.isElementAccessExpression(left)) {
      const receiver = accessRootAndPath(left.expression);
      return receiver ? {
        ...receiver,
        key: staticElementKey(left.argumentExpression)
          ?? staticKeyOfExpression(left.argumentExpression),
        keyNode: left.argumentExpression,
      } : null;
    }
    return null;
  };
  /** Prove the narrow loop form whose destination keyset is exactly the
   * snapshotted own-key surface of `Object.entries(source)`. This is a semantic
   * relation, not a spelling heuristic: any guard, abrupt completion,
   * reassigned key, shadowed intrinsic, or ambiguous target rejects the proof
   * and leaves the write in the ordinary conservative dynamic-cell model. */
  const completeEntriesCopyOf = (target, assignment) => {
    if (!target.binding || target.key != null || !ts.isIdentifier(target.keyNode)) return null;
    const statement = assignment.parent;
    if (!statement || !ts.isExpressionStatement(statement)
      || statement.expression !== assignment) return null;
    let body = statement;
    let loop = statement.parent;
    if (ts.isBlock(loop)) {
      if (loop.statements.length !== 1 || loop.statements[0] !== statement) return null;
      body = loop;
      loop = loop.parent;
    }
    if (!ts.isForOfStatement(loop) || loop.awaitModifier
      || loop.statement !== body) return null;
    if (!ts.isVariableDeclarationList(loop.initializer)
      || !(loop.initializer.flags & ts.NodeFlags.Const)
      || loop.initializer.declarations.length !== 1) return null;
    const declaration = loop.initializer.declarations[0];
    if (!ts.isArrayBindingPattern(declaration.name)) return null;
    const first = declaration.name.elements[0];
    if (!first || !ts.isBindingElement(first) || first.dotDotDotToken
      || first.initializer || first.propertyName || !ts.isIdentifier(first.name)
      || symbolAt(first.name) !== symbolAt(target.keyNode)) return null;
    const keyBinding = bindings.get(symbolAt(first.name));
    if (!keyBinding || keyBinding.writes?.length) return null;
    const second = declaration.name.elements[1];
    const rhs = unwrap(assignment.right);
    const identityValue = Boolean(
      second && ts.isBindingElement(second) && !second.dotDotDotToken
      && !second.initializer && !second.propertyName && ts.isIdentifier(second.name)
      && ts.isIdentifier(rhs) && symbolAt(second.name) === symbolAt(rhs),
    );

    const entriesCall = unwrap(loop.expression);
    if (!ts.isCallExpression(entriesCall) || entriesCall.arguments.length !== 1) return null;
    const callee = unwrap(entriesCall.expression);
    if (!ts.isPropertyAccessExpression(callee) || callee.name.text !== 'entries') return null;
    const object = unwrap(callee.expression);
    if (!isIntrinsicGlobal(object, 'Object')) return null;

    const anchors = anchorsByAliasRoot.get(aliasRoot(target.binding));
    if (anchors?.size !== 1) return null;
    const anchor = constructorAtPath([...anchors][0], target.path);
    if (!anchor || !ts.isObjectLiteralExpression(unwrap(anchor))
      || anchor.end > loop.pos || flowOwnerOf(anchor) !== flowOwnerOf(loop)
      || unwrap(anchor).properties.some((property) => (
        ts.isGetAccessorDeclaration(property) || ts.isSetAccessorDeclaration(property)
      ))) return null;

    return {
      sourceNode: entriesCall.arguments[0],
      sourceFile: target.binding.file,
      entriesCall,
      loop,
      identityValue,
      coverageSite: {
        ...executionSiteOf(loop, target.binding.file),
        pos: loop.pos,
        end: loop.end,
        loop: null,
        optional: maySkipAtRuntime(loop),
      },
    };
  };
  const assignmentMode = (operator) => {
    if (operator === ts.SyntaxKind.EqualsToken) return 'replace';
    if (operator === ts.SyntaxKind.QuestionQuestionEqualsToken) return 'coalesce';
    if (operator === ts.SyntaxKind.BarBarEqualsToken) return 'or';
    if (operator === ts.SyntaxKind.AmpersandAmpersandEqualsToken) return 'and';
    return 'compound';
  };
  const assignmentPatternTargets = (
    pattern,
    projection = [],
    fallbacks = [],
    out = [],
  ) => {
    const value = unwrap(pattern);
    if (ts.isIdentifier(value)) {
      const binding = boundValueOf(value);
      if (binding) out.push({ binding, projection, fallbacks });
      return out;
    }
    if (ts.isBinaryExpression(value)
      && value.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      return assignmentPatternTargets(
        value.left,
        projection,
        [...fallbacks, value.right],
        out,
      );
    }
    if (ts.isObjectLiteralExpression(value)) {
      for (const property of value.properties) {
        if (ts.isSpreadAssignment(property)) {
          assignmentPatternTargets(property.expression, projection, fallbacks, out);
          continue;
        }
        const key = staticPropertyKey(property.name);
        if (key == null) continue;
        const next = [...projection, { kind: 'property', key }];
        if (ts.isShorthandPropertyAssignment(property)) {
          assignmentPatternTargets(
            property.name,
            next,
            property.objectAssignmentInitializer
              ? [...fallbacks, property.objectAssignmentInitializer]
              : fallbacks,
            out,
          );
        } else if (ts.isPropertyAssignment(property)) {
          assignmentPatternTargets(property.initializer, next, fallbacks, out);
        }
      }
      return out;
    }
    if (ts.isArrayLiteralExpression(value)) {
      for (const element of value.elements) {
        if (ts.isOmittedExpression(element)) continue;
        if (ts.isSpreadElement(element)) {
          assignmentPatternTargets(element.expression, projection, fallbacks, out);
        } else {
          assignmentPatternTargets(
            element,
            [...projection, { kind: 'element' }],
            fallbacks,
            out,
          );
        }
      }
    }
    return out;
  };
  const nestedInAssignmentTarget = (node) => {
    for (let current = node.parent; current; current = current.parent) {
      if (ts.isFunctionLike(current) || ts.isSourceFile(current)) return false;
      if (ts.isBinaryExpression(current)
        && current.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && current.left.pos <= node.pos && node.end <= current.left.end) return true;
    }
    return false;
  };
  const recordBindingWrite = (
    target,
    sourceNode,
    file,
    site,
    transfer = 'replace',
  ) => target.binding.writes.push({
    id: `binding-write:${file}:${site.pos}:${site.end}:${target.binding.writes.length}`,
    kind: 'assign',
    transfer,
    node: sourceNode,
    file,
    projection: target.projection || [],
    fallbacks: target.fallbacks || [],
    site,
  });
  const propertyExpressionIsWriteTarget = (node) => {
    const parent = node.parent;
    if (!parent) return false;
    if (ts.isBinaryExpression(parent) && parent.left === node) {
      const operator = parent.operatorToken.kind;
      return operator === ts.SyntaxKind.EqualsToken
        || (operator >= ts.SyntaxKind.FirstCompoundAssignment
          && operator <= ts.SyntaxKind.LastCompoundAssignment);
    }
    if (ts.isDeleteExpression(parent) && parent.expression === node) return true;
    return (ts.isPrefixUnaryExpression(parent) || ts.isPostfixUnaryExpression(parent))
      && parent.operand === node;
  };
  const registerGetterCallsForExpression = (
    expression,
    operation,
    file,
    site,
    reason,
    selectedKey = null,
    orderPrefix = null,
  ) => {
    const constructor = localConstructorOf(expression);
    if (!constructor) return;
    const keys = selectedKey == null ? knownStaticKeysOf(constructor) : [selectedKey];
    keys.forEach((key, keyIndex) => {
      const descriptor = descriptorStateFor(constructor, key);
      for (const accessor of accessorAlternativesOf(descriptor)) {
        if (!accessor.getter) continue;
        registerImplicitCall(
          accessor.getter,
          [],
          operation,
          file,
          orderPrefix
            ? { ...site, orderPath: [...orderPrefix, keyIndex, 0] }
            : site,
          `${reason}:${key}`,
          descriptor.kind === 'mixed',
          expression,
        );
      }
    });
  };

  // Index writes after declarations so local mutation and genuinely dynamic
  // dictionary construction contribute provenance to the binding they mutate.
  for (const [file, source] of sources) {
    const visit = (node) => {
      if (ts.isBinaryExpression(node)
        && (node.operatorToken.kind === ts.SyntaxKind.EqualsToken
          || (node.operatorToken.kind >= ts.SyntaxKind.FirstCompoundAssignment
            && node.operatorToken.kind <= ts.SyntaxKind.LastCompoundAssignment))
        && !nestedInAssignmentTarget(node)) {
        const left = unwrap(node.left);
        if (ts.isIdentifier(left)) {
          const binding = bindings.get(symbolAt(left));
          if (binding) binding.writes.push({
            id: `binding-write:${file}:${node.pos}:${node.end}`,
            kind: 'assign',
            transfer: node.operatorToken.kind === ts.SyntaxKind.EqualsToken
              ? 'replace'
              : (node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionEqualsToken
                || node.operatorToken.kind === ts.SyntaxKind.BarBarEqualsToken
                || node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandEqualsToken)
                ? 'logical'
                : 'primitive',
            node: node.right,
            file,
            site: executionSiteOf(node, file),
          });
        } else if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken
          && (ts.isObjectLiteralExpression(left) || ts.isArrayLiteralExpression(left))) {
          const site = executionSiteOf(node, file);
          for (const target of assignmentPatternTargets(left)) {
            recordBindingWrite(target, node.right, file, site);
          }
        } else {
          const target = propertyMutationTarget(left);
          if (target) {
            const assignment = assignmentMode(node.operatorToken.kind);
            const entriesCopy = assignment === 'replace'
              ? completeEntriesCopyOf(target, node)
              : null;
            const mutation = {
              id: `mutation:${entriesCopy ? 'mapped-spread' : (target.key == null ? 'dynamic' : 'field')}:${file}:${left.pos}:${left.end}`,
              kind: entriesCopy ? 'mappedSpread' : (target.key == null ? 'dynamic' : 'field'),
              key: target.key,
              keyNode: target.keyNode || null,
              assignment,
              node: node.right,
              callNode: node,
              file,
              mutationSite: executionSiteOf(node, file),
              entriesCopy,
            };
            const local = target.binding && (target.binding.writes || []).length
              ? false
              : (target.binding
                ? recordLocalMutation(target.binding, target.path, mutation)
                : false);
            if (!local) heapEffects.push({
              ...mutation,
              receiver: ts.isPropertyAccessExpression(left)
                || ts.isElementAccessExpression(left)
                ? left.expression
                : null,
            });
            if (!local && target.binding?.k === 'expr'
              && target.key == null && target.path.length === 0) {
              target.binding.writes.push({
                id: `binding-write:${file}:${node.pos}:${node.end}`,
                kind: 'dictionary',
                node: node.right,
                file,
                site: executionSiteOf(node, file),
              });
            }
          }
        }
      }
      if ((ts.isForOfStatement(node) || ts.isForInStatement(node))
        && !ts.isVariableDeclarationList(node.initializer)) {
        const site = {
          ...executionSiteOf(node, file),
          end: node.statement.pos,
          loop: node,
          optional: true,
        };
        const projection = ts.isForOfStatement(node) ? [{ kind: 'element' }] : [];
        for (const target of assignmentPatternTargets(node.initializer, projection)) {
          recordBindingWrite(
            target,
            ts.isForOfStatement(node) ? node.expression : null,
            file,
            site,
            ts.isForOfStatement(node) ? 'replace' : 'primitive',
          );
        }
      }
      if ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node))
        && (node.operator === ts.SyntaxKind.PlusPlusToken
          || node.operator === ts.SyntaxKind.MinusMinusToken)) {
        const operand = unwrap(node.operand);
        if (ts.isIdentifier(operand)) {
          const binding = bindings.get(symbolAt(operand));
          if (binding) binding.writes.push({
            id: `binding-write:${file}:${node.pos}:${node.end}`,
            kind: 'assign',
            transfer: 'primitive',
            node: null,
            file,
            site: executionSiteOf(node, file),
          });
        } else {
          const target = propertyMutationTarget(operand);
          if (target) {
            const mutation = {
              id: `mutation:${target.key == null ? 'dynamic' : 'field'}:${file}:${node.pos}:${node.end}`,
              kind: target.key == null ? 'dynamic' : 'field',
              key: target.key,
              keyNode: target.keyNode || null,
              assignment: 'compound',
              // Compound cells never consume RHS provenance, but the common
              // deferred-field record still requires a stable syntax node.
              node: operand,
              callNode: node,
              file,
              mutationSite: executionSiteOf(node, file),
            };
            const local = target.binding && (target.binding.writes || []).length
              ? false
              : (target.binding
                ? recordLocalMutation(target.binding, target.path, mutation)
                : false);
            if (!local) heapEffects.push({ ...mutation, receiver: operand.expression });
          }
        }
      }
      if (ts.isDeleteExpression(node)) {
        const target = propertyMutationTarget(unwrap(node.expression));
        if (target) {
          const expression = unwrap(node.expression);
          const mutation = {
            id: `mutation:${target.key == null ? 'dynamic-delete' : 'delete'}:${file}:${node.pos}:${node.end}`,
            kind: target.key == null ? 'dynamicDelete' : 'delete',
            key: target.key,
            keyNode: target.keyNode || null,
            file,
            mutationSite: executionSiteOf(node, file),
          };
          const local = target.binding && (target.binding.writes || []).length
            ? false
            : (target.binding
              ? recordLocalMutation(target.binding, target.path, mutation)
              : false);
          if (!local) heapEffects.push({ ...mutation, receiver: expression.expression });
        }
      }
      if (ts.isCallExpression(node) && isObjectAssignCall(node) && node.arguments.length) {
        const target = unwrap(node.arguments[0]);
        const receiver = accessRootAndPath(target);
        node.arguments.slice(1).forEach((argument, index) => {
          const mutation = {
            id: `mutation:assign:${file}:${node.pos}:${index}`,
            kind: 'spread',
            node: argument,
            callNode: node,
            file,
            mutationSite: executionSiteOf(node, file),
            sourceIndex: index,
          };
          const local = receiver?.binding && !(receiver.binding.writes || []).length
            ? recordLocalMutation(receiver.binding, receiver.path, mutation)
            : false;
          if (!local) heapEffects.push({ ...mutation, receiver: target });
        });
        node.arguments.slice(1).forEach((argument, index) => {
          registerGetterCallsForExpression(
            argument,
            node,
            file,
            executionSiteOf(node, file),
            `getter-object-assign-source:${index}`,
            null,
            [1, index],
          );
        });
      }
      if (ts.isCallExpression(node)
        && ts.isPropertyAccessExpression(unwrap(node.expression))
        && classifyCall(node).kind === 'Object.values'
        && unwrap(node.expression).name.text === 'values'
        && node.arguments[0]) {
        registerGetterCallsForExpression(
          node.arguments[0],
          node,
          file,
          executionSiteOf(node, file),
          'getter-object-values',
        );
      }
      if (ts.isSpreadAssignment(node)) {
        registerGetterCallsForExpression(
          node.expression,
          node,
          file,
          executionSiteOf(node, file),
          'getter-object-spread',
        );
      }
      if ((ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node))
        && !propertyExpressionIsWriteTarget(node)) {
        const key = ts.isPropertyAccessExpression(node)
          ? node.name.text
          : (staticElementKey(node.argumentExpression)
            ?? staticKeyOfExpression(node.argumentExpression));
        if (key != null) registerGetterCallsForExpression(
          node.expression,
          node,
          file,
          executionSiteOf(node, file),
          'getter-property-read',
          key,
        );
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  // Symbol-resolved, uncapped call-site index.
  const generatorCreationOf = (expression) => {
    const value = immutableInitializerOf(expression);
    if (!ts.isCallExpression(value)) return null;
    const target = functionOf(unwrap(value.expression));
    return target && isGeneratorFunction(target.fn)
      ? { ...target, createCall: value }
      : null;
  };
  const priorResumesByGeneratorCreation = new Map();
  for (const [file, source] of sources) {
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const callee = unwrap(node.expression);
        if (ts.isPropertyAccessExpression(callee) && callee.name.text === 'next') {
          const generator = generatorCreationOf(callee.expression);
          if (generator) {
            const priorResumes = priorResumesByGeneratorCreation.get(generator.createCall) || [];
            let resumeMin = 0;
            let resumeMax = 0;
            for (const priorResume of priorResumes) {
              if (!priorResume.optional) resumeMin += 1;
              resumeMax = priorResume.loop || resumeMax === Number.POSITIVE_INFINITY
                ? Number.POSITIVE_INFINITY
                : resumeMax + 1;
            }
            const resumeRange = { min: resumeMin, max: resumeMax };
            const resumeOrdinal = resumeMin === resumeMax ? resumeMin : null;
            const resumeExecution = executionSiteOf(node, file);
            const resumeSite = {
              file,
              args: [...generator.createCall.arguments],
              call: node,
              argumentCall: generator.createCall,
              site: resumeExecution,
              awaited: callIsAwaited(node),
              generatorResume: true,
              resumeOrdinal,
              resumeRange,
            };
            priorResumes.push(resumeExecution);
            priorResumesByGeneratorCreation.set(generator.createCall, priorResumes);
            let sites = callSites.get(generator.fn);
            if (!sites) { sites = []; callSites.set(generator.fn, sites); }
            sites.push(resumeSite);
            generatorResumeByCall.set(node, { ...generator, callSite: resumeSite });
            indexStats.indexedCallSites += 1;
            const owner = flowOwnerOf(node);
            if (owner && ts.isFunctionLike(owner)) {
              let edges = callGraph.get(owner);
              if (!edges) { edges = new Set(); callGraph.set(owner, edges); }
              edges.add(generator.fn);
            }
          }
        }
        if (ts.isPropertyAccessExpression(callee) && classifyCall(node).kind !== 'source'
          && ELEMENT_CB_METHODS.has(callee.name.text) && node.arguments[0]) {
          const callbackNode = unwrap(node.arguments[0]);
          const callback = (ts.isArrowFunction(callbackNode) || ts.isFunctionExpression(callbackNode))
            ? { fn: callbackNode, file }
            : functionOf(callbackNode);
          if (callback) {
            let elementSites = elementCallSites.get(callback.fn);
            if (!elementSites) { elementSites = []; elementCallSites.set(callback.fn, elementSites); }
            elementSites.push({
              file,
              receiver: callee.expression,
              call: node,
              // A callback-capable array operation may execute its callback
              // zero times even when the operation itself is unconditional.
              // Its effects therefore join the pre-call heap state; treating
              // the implicit call as definite turns `[].forEach(set)` into a
              // strong write that never happened.
              site: { ...executionSiteOf(node, file), optional: true },
              awaited: false,
              repeated: true,
            });
            indexStats.indexedElementCallSites += 1;
            // Array methods invoke their callback synchronously. This implicit
            // edge is part of the executable call graph: without owner ->
            // callback, `deep(value) -> value.map(child => deep(child))` looks
            // acyclic even though callback -> deep is indexed explicitly.
            let owner = node.parent;
            while (owner && !ts.isSourceFile(owner) && !ts.isFunctionLike(owner)) {
              owner = owner.parent;
            }
            if (owner && ts.isFunctionLike(owner)) {
              let edges = callGraph.get(owner);
              if (!edges) { edges = new Set(); callGraph.set(owner, edges); }
              edges.add(callback.fn);
            }
          }
        }
        const target = functionOf(unwrap(node.expression));
        if (target && !isGeneratorFunction(target.fn)) {
          let sites = callSites.get(target.fn);
          if (!sites) { sites = []; callSites.set(target.fn, sites); }
          sites.push({
            file,
            args: [...node.arguments],
            call: node,
            site: executionSiteOf(node, file),
            thisSource: ts.isPropertyAccessExpression(callee)
              || ts.isElementAccessExpression(callee)
              ? callee.expression
              : null,
            awaited: callIsAwaited(node),
          });
          indexStats.indexedCallSites += 1;
          let owner = node.parent;
          while (owner && !ts.isSourceFile(owner) && !ts.isFunctionLike(owner)) owner = owner.parent;
          if (owner && ts.isFunctionLike(owner)) {
            let edges = callGraph.get(owner);
            if (!edges) { edges = new Set(); callGraph.set(owner, edges); }
            edges.add(target.fn);
          }
        } else {
          indexStats.unresolvedCallees += 1;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  // Tarjan SCCs over symbol-resolved calls. Recursive return summaries need a
  // call-context fixed point; expanding symbolic property strings through an
  // SCC creates an infinite `|p:next|p:next…` language instead.
  const recursiveFunctions = new Set();
  const recursiveComponentOf = new Map();
  const tarjanIndex = new Map();
  const lowLink = new Map();
  const stack = [];
  const onStack = new Set();
  let nextIndex = 0;
  const strongConnect = (fn) => {
    tarjanIndex.set(fn, nextIndex);
    lowLink.set(fn, nextIndex);
    nextIndex += 1;
    stack.push(fn);
    onStack.add(fn);
    for (const target of callGraph.get(fn) || []) {
      if (!tarjanIndex.has(target)) {
        strongConnect(target);
        lowLink.set(fn, Math.min(lowLink.get(fn), lowLink.get(target)));
      } else if (onStack.has(target)) {
        lowLink.set(fn, Math.min(lowLink.get(fn), tarjanIndex.get(target)));
      }
    }
    if (lowLink.get(fn) !== tarjanIndex.get(fn)) return;
    const component = [];
    let member;
    do {
      member = stack.pop();
      onStack.delete(member);
      component.push(member);
    } while (member !== fn);
    if (component.length > 1 || (callGraph.get(fn) || new Set()).has(fn)) {
      const componentId = component
        .map((recursive) => (
          `${recursive.getSourceFile().fileName}:${recursive.pos}:${recursive.end}`
        ))
        .sort()
        .join('|');
      for (const recursive of component) {
        recursiveFunctions.add(recursive);
        recursiveComponentOf.set(recursive, componentId);
      }
    }
  };
  for (const fn of functions) if (!tarjanIndex.has(fn)) strongConnect(fn);
  // A non-recursive forwarding helper must enter the same concrete resolver
  // as the recursive SCC it reaches. Summarizing the wrapper symbolically
  // first reintroduces the infinite path language the SCC solver exists to
  // avoid (`@param0|e|e|e...`). Reverse reachability keeps the whole finite
  // call prefix in concrete executed-origin space.
  const recursiveContextFunctions = new Set(
    [...recursiveFunctions].filter((fn) => heapEffects.some(
      (effect) => effect.mutationSite?.owner === fn,
    )),
  );
  let recursiveContextGrew = true;
  while (recursiveContextGrew) {
    recursiveContextGrew = false;
    for (const fn of functions) {
      if (recursiveContextFunctions.has(fn)) continue;
      if (![...(callGraph.get(fn) || [])]
        .some((target) => recursiveContextFunctions.has(target))) continue;
      recursiveContextFunctions.add(fn);
      recursiveContextGrew = true;
    }
  }
  for (const fn of recursiveFunctions) recursiveContextFunctions.add(fn);

  const bindingOf = (identifier) => {
    // `checker.getSymbolAtLocation` names the object-literal PROPERTY for a
    // shorthand (`{ value }`), not the lexical value binding it reads.
    return boundValueOf(identifier);
  };

  return {
    sources,
    checker,
    callSites,
    elementCallSites,
    generatorResumeByCall,
    indexStats,
    allBindings,
    functions,
    callGraph,
    recursiveFunctions,
    recursiveComponentOf,
    recursiveContextFunctions,
    escapedFunctions,
    localMutations,
    heapEffects,
    bindingOf,
    functionOf,
    classifyCall,
    isIntrinsicGlobal,
    isDefaultLibrarySymbol,
  };
}

/**
 * Build the provenance-preserving resolver over corpus schema 2.
 *
 * A token names an exact observed ORIGIN, not a globally pooled leaf name.
 * Record property transitions are read only from that origin's executed field
 * graph; array/dictionary element reads are legal only on proven containers.
 * @param {object} idx from buildIndex
 * @param {object} graph executed corpus provenance graph
 * @param {number} minRows an origin seen fewer times than this is too thin to judge
 * @param {Record<string, number>} diagnostics mutable counters surfaced in scan stats
 */
export function makeResolver(idx, graph, minRows, diagnostics = {}) {
  if (!graph || graph.schema !== 2 || !graph.origins || !graph.roots) {
    throw new Error('reader-shape resolver requires executed corpus graph schema 2; refusing a leaf-name fallback');
  }
  const origins = graph.origins;
  const judgeableOrigins = new Set(
    Object.values(origins)
      .filter((origin) => origin.rows >= minRows)
      .map((origin) => origin.id),
  );
  const EMPTY = new Set();
  const awaitTokens = (tokens) => {
    let out = EMPTY;
    const pending = [...tokens];
    const seen = new Set();
    while (pending.length) {
      const token = pending.pop();
      if (seen.has(token)) continue;
      seen.add(token);
      const promise = isPromiseToken(token) ? promiseParts(token) : null;
      if (promise) pending.push(promise.value);
      else out = union(out, new Set([token]));
    }
    return out;
  };
  const asPromiseTokens = (tokens) => {
    const out = new Set();
    for (const token of awaitTokens(tokens)) out.add(promiseToken(token));
    return out;
  };
  let approximationVersion = 0;
  let evaluationEpoch = 0;
  let currentReadContext = null;
  let currentReaderOwner = null;
  // Immutable snapshot of the exact caller cutoffs currently in force, keyed
  // by lexical owner. Nested helpers retain their callers' cutoffs and add the
  // call site in their own owner; this is what makes closed-over mutable reads
  // flow-sensitive across more than one function boundary.
  let activeCutoffs = new Map();
  let currentReadBudget = null;
  let activeNonEscapingProducerOwners = null;
  let activeExecutionOwners = null;
  let activeHeapEffectDiagnostic = null;
  let activeEffectCallChain = [];
  let heapEffectsResolvingReceiver = new Set();
  const nonEscapingBindingCache = new WeakMap();
  const producerOwnerCache = new WeakMap();
  const reachableOwnerCache = new WeakMap();
  const diagnosticSites = new Map();
  const siteOf = (node, file) => (node ? `${file}:${node.pos}:${node.end}` : null);
  const safeIdentityUse = (identifier) => {
    let current = identifier;
    while (current.parent && (ts.isParenthesizedExpression(current.parent)
      || ts.isAsExpression(current.parent)
      || ts.isNonNullExpression(current.parent)
      || ts.isSatisfiesExpression?.(current.parent))) current = current.parent;
    const parent = current.parent;
    if (!parent) return false;
    if ((ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent))
      && parent.expression === current) return !isWriteTarget(parent);
    if ((ts.isIfStatement(parent) || ts.isWhileStatement(parent)
      || ts.isDoStatement(parent)) && parent.expression === current) return true;
    if (ts.isConditionalExpression(parent) && parent.condition === current) return true;
    if (ts.isTypeOfExpression(parent) && parent.expression === current) return true;
    return ts.isPrefixUnaryExpression(parent)
      && parent.operand === current
      && parent.operator === ts.SyntaxKind.ExclamationToken;
  };
  const bindingDoesNotEscape = (binding) => {
    if (nonEscapingBindingCache.has(binding)) return nonEscapingBindingCache.get(binding);
    if (binding.k !== 'expr' || binding.projection?.length || binding.fallbacks?.length
      || binding.additionalInitializers?.length || binding.writes?.length) {
      nonEscapingBindingCache.set(binding, false);
      return false;
    }
    const source = idx.sources.get(binding.file);
    if (!source) return false;
    let safe = true;
    const visit = (node) => {
      if (!safe) return;
      if (ts.isIdentifier(node) && idx.bindingOf(node) === binding) {
        const declaration = node.parent;
        if (!(ts.isVariableDeclaration(declaration) && declaration.name === node)
          && !safeIdentityUse(node)) safe = false;
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    nonEscapingBindingCache.set(binding, safe);
    return safe;
  };
  const producerOwnersForReceiver = (receiver) => {
    const value = unwrap(receiver);
    let call = ts.isCallExpression(value) ? value : null;
    if (ts.isIdentifier(value)) {
      const binding = idx.bindingOf(value);
      const initializer = binding?.node ? unwrap(binding.node) : null;
      if (!binding || !bindingDoesNotEscape(binding)
        || !initializer || !ts.isCallExpression(initializer)) return null;
      call = initializer;
    }
    if (!call) return null;
    if (producerOwnerCache.has(call)) return producerOwnerCache.get(call);
    const target = idx.functionOf(unwrap(call.expression));
    if (!target) return null;
    const owners = new Set();
    const pending = [target.fn];
    while (pending.length) {
      const owner = pending.pop();
      if (owners.has(owner)) continue;
      owners.add(owner);
      for (const called of idx.callGraph.get(owner) || []) pending.push(called);
    }
    producerOwnerCache.set(call, owners);
    return owners;
  };
  const reachableOwnersFrom = (rootOwner) => {
    if (!rootOwner) return EMPTY;
    if (reachableOwnerCache.has(rootOwner)) return reachableOwnerCache.get(rootOwner);
    const owners = new Set();
    const pending = [rootOwner];
    while (pending.length) {
      const owner = pending.pop();
      if (!owner || owners.has(owner)) continue;
      owners.add(owner);
      if (ts.isFunctionLike(owner)) owners.add(owner.getSourceFile());
      for (const called of idx.callGraph.get(owner) || []) pending.push(called);
    }
    reachableOwnerCache.set(rootOwner, owners);
    return owners;
  };
  const ownersExecutingBefore = (owner, cutoff) => {
    if (!owner) return EMPTY;
    let owners = new Set([owner]);
    if (ts.isFunctionLike(owner)) owners.add(owner.getSourceFile());
    for (const target of idx.callGraph.get(owner) || []) {
      const completed = [
        ...(idx.callSites.get(target) || []),
        ...(idx.elementCallSites.get(target) || []),
      ].some((callSite) => {
        const site = callSite.site || {
          end: callSite.call.end,
          owner: flowOwnerOf(callSite.call),
        };
        return site.owner === owner && site.end <= cutoff;
      });
      if (completed) owners = union(owners, reachableOwnersFrom(target));
    }
    if (ts.isFunctionLike(owner)) {
      owners = union(
        owners,
        ownersExecutingBefore(owner.getSourceFile(), Number.POSITIVE_INFINITY),
      );
    }
    return owners;
  };
  const executionOwnersForRead = (owner, events, cutoff) => {
    let owners = new Set(ownersExecutingBefore(owner, cutoff));
    for (const event of events) {
      for (const entry of event.callChain || []) {
        const caller = entry.callSite?.site?.owner
          || flowOwnerOf(entry.callSite?.call);
        const callerCutoff = entry.callSite?.site?.end
          ?? entry.callSite?.call?.end
          ?? Number.POSITIVE_INFINITY;
        owners = union(owners, ownersExecutingBefore(caller, callerCutoff));
      }
    }
    return owners;
  };
  const bump = (key, site = null) => {
    if (site) {
      let sites = diagnosticSites.get(key);
      if (!sites) { sites = new Set(); diagnosticSites.set(key, sites); }
      if (sites.has(site)) return;
      sites.add(site);
    }
    diagnostics[key] = (diagnostics[key] || 0) + 1;
  };
  const budgetFailure = (kind, value, limit, reason, detail = '') => {
    diagnostics.abstractStateBudgetFailures = (diagnostics.abstractStateBudgetFailures || 0) + 1;
    throw new Error(
      `reader-shape abstract-state budget exceeded at ${currentReadBudget?.site || 'unknown reader'}: `
      + `${kind} ${value} > ${limit} while ${reason}${detail}`
      + (activeHeapEffectDiagnostic
        ? `; heap effect ${activeHeapEffectDiagnostic}`
        : '')
      + '; refusing partial provenance',
    );
  };
  const tokenStructureDiagnostic = (token) => {
    let current = token;
    let arrayDepth = 0;
    while (isArrayToken(current) && arrayDepth < 256) {
      current = arrayElementToken(current);
      arrayDepth += 1;
    }
    const plus = arrayPlusParts(current);
    if (plus) {
      current = plus.leaf;
    }
    const leaf = current.length > 256
      ? `${current.slice(0, 160)}…${current.slice(-96)}`
      : current;
    return ` arrayDepth=${arrayDepth}${plus ? ` arrayPlus=${plus.producer}` : ''}`
      + ` leaf=${JSON.stringify(leaf)}`;
  };
  const observeAbstractTokens = (tokens, reason) => {
    if (!currentReadBudget || !tokens?.size) return;
    for (const token of tokens) {
      if (token.length > READ_TOKEN_LENGTH_BUDGET) {
        const head = token.slice(0, 160);
        const tail = token.slice(-96);
        budgetFailure(
          'token length',
          token.length,
          READ_TOKEN_LENGTH_BUDGET,
          reason,
          `; token sha256=${sha256(token)} preview=${JSON.stringify(`${head}…${tail}`)}`
            + tokenStructureDiagnostic(token),
        );
      }
      currentReadBudget.maxTokenLength = Math.max(
        currentReadBudget.maxTokenLength,
        token.length,
      );
      currentReadBudget.tokens.add(token);
      if (currentReadBudget.tokens.size > READ_ABSTRACT_TOKEN_BUDGET) {
        budgetFailure(
          'unique abstract tokens',
          currentReadBudget.tokens.size,
          READ_ABSTRACT_TOKEN_BUDGET,
          reason,
        );
      }
    }
  };
  const noteApproximationGrowth = (tokens = EMPTY, reason = 'growing an approximation') => {
    approximationVersion += 1;
    if (!currentReadBudget) return;
    currentReadBudget.stateGrowth += 1;
    if (currentReadBudget.stateGrowth > READ_STATE_GROWTH_BUDGET) {
      budgetFailure(
        'abstract-state growth steps',
        currentReadBudget.stateGrowth,
        READ_STATE_GROWTH_BUDGET,
        reason,
      );
    }
    observeAbstractTokens(tokens, reason);
  };
  const finishReadBudget = (budget) => {
    diagnostics.maxReadAbstractTokens = Math.max(
      diagnostics.maxReadAbstractTokens || 0,
      budget.tokens.size,
    );
    diagnostics.maxReadTokenLength = Math.max(
      diagnostics.maxReadTokenLength || 0,
      budget.maxTokenLength,
    );
    diagnostics.maxReadStateGrowth = Math.max(
      diagnostics.maxReadStateGrowth || 0,
      budget.stateGrowth,
    );
  };

  const arrays = graph.arrays || {};
  const flowContextId = ({ file, owner }) => (
    `${file}:${owner?.pos ?? 'none'}:${owner?.end ?? 'none'}`
  );
  const cutoffSignatureOf = (contexts = activeCutoffs) => JSON.stringify(
    [...contexts]
      .map(([id, context]) => [
        id,
        context.pos,
        context.delay?.min ?? 0,
        context.delay?.max ?? 0,
        context.resume?.min ?? 0,
        context.resume?.max ?? 0,
      ])
      .sort(([left], [right]) => left.localeCompare(right)),
  );
  const withAddedCutoff = (contexts, context) => {
    const next = new Map(contexts);
    next.set(flowContextId(context), context);
    return next;
  };
  const strongerExecution = (left, right) => {
    if (left === 'definite' || right === 'definite') return 'definite';
    if (left === 'maybe' || right === 'maybe') return 'maybe';
    return 'none';
  };
  const invocationEventCache = new Map();
  const semanticSiteOrder = (site) => [site.end, ...(site.orderPath || [])];
  const semanticSiteId = (site) => (
    `${site.file}:${site.pos}:${site.end}:${(site.orderPath || []).join('.')}`
  );
  const invocationEventsBefore = (fn, seen = new Set()) => {
    if (!fn || seen.has(fn)) return [];
    const cacheable = seen.size === 0;
    const signature = cutoffSignatureOf();
    let versions = invocationEventCache.get(fn);
    if (cacheable && versions?.has(signature)) return versions.get(signature);
    const nextSeen = new Set(seen).add(fn);
    const events = [];
    const sites = [
      ...(idx.callSites.get(fn) || []),
      ...(idx.elementCallSites.get(fn) || []),
    ];
    for (const callSite of sites) {
      const site = callSite.site || {
        file: callSite.file,
        pos: callSite.call.pos,
        end: callSite.call.end,
        owner: flowOwnerOf(callSite.call),
        optional: true,
      };
      const callerCutoff = activeCutoffs.get(flowContextId(site));
      if (callerCutoff) {
        if (site.end <= callerCutoff.pos) {
          const callContext = {
            file: site.file,
            pos: site.end,
            owner: site.owner,
            delay: site.delay || ZERO_DELAY,
            resume: site.resume || ZERO_DELAY,
          };
          events.push({
            id: semanticSiteId(site),
            order: semanticSiteOrder(site),
            optional: Boolean(site.optional),
            delay: site.delay || ZERO_DELAY,
            cutoffs: withAddedCutoff(activeCutoffs, callContext),
            callChain: [{ fn, callSite }],
          });
        }
      } else if (ts.isFunctionLike(site.owner)) {
        const parentEvents = invocationEventsBefore(site.owner, nextSeen);
        for (const parentEvent of parentEvents) {
          const callContext = {
            file: site.file,
            pos: site.end,
            owner: site.owner,
            delay: site.delay || ZERO_DELAY,
            resume: site.resume || ZERO_DELAY,
          };
          events.push({
            id: `${parentEvent.id}>${semanticSiteId(site)}`,
            order: [...parentEvent.order, ...semanticSiteOrder(site)],
            optional: parentEvent.optional || Boolean(site.optional),
            delay: addDelayRanges(parentEvent.delay, site.delay || ZERO_DELAY),
            cutoffs: withAddedCutoff(parentEvent.cutoffs, callContext),
            callChain: [...parentEvent.callChain, { fn, callSite }],
          });
        }
        const parentSites = [
          ...(idx.callSites.get(site.owner) || []),
          ...(idx.elementCallSites.get(site.owner) || []),
        ];
        // A function with no in-estate caller is an external entry boundary.
        // Its nested call sites still execute when that entry is invoked, so
        // seed the first static edge instead of dropping the entire closure
        // invocation chain. Deeper edges extend this event recursively.
        if (!parentEvents.length && !parentSites.length) {
          const callContext = {
            file: site.file,
            pos: site.end,
            owner: site.owner,
            delay: site.delay || ZERO_DELAY,
            resume: site.resume || ZERO_DELAY,
          };
          events.push({
            id: `entry:${semanticSiteId(site)}`,
            order: semanticSiteOrder(site),
            optional: Boolean(site.optional),
            delay: site.delay || ZERO_DELAY,
            cutoffs: withAddedCutoff(activeCutoffs, callContext),
            callChain: [{ fn, callSite }],
          });
        }
      } else {
        const callContext = {
          file: site.file,
          pos: site.end,
          owner: site.owner,
          delay: site.delay || ZERO_DELAY,
          resume: site.resume || ZERO_DELAY,
        };
        events.push({
          id: `module:${semanticSiteId(site)}`,
          order: semanticSiteOrder(site),
          optional: Boolean(site.optional),
          delay: site.delay || ZERO_DELAY,
          cutoffs: withAddedCutoff(activeCutoffs, callContext),
          callChain: [{ fn, callSite }],
        });
      }
    }
    if (cacheable) {
      if (!versions) { versions = new Map(); invocationEventCache.set(fn, versions); }
      versions.set(signature, events);
    }
    return events;
  };
  const invocationBefore = (fn) => {
    let result = 'none';
    for (const event of invocationEventsBefore(fn)) {
      result = strongerExecution(result, event.optional ? 'maybe' : 'definite');
    }
    return result;
  };
  const suspendedEffectVisibility = (effectSite, event) => {
    if (!effectSite) return 'definite';
    const invocation = event.callChain?.at(-1)?.callSite;
    if (invocation?.generatorResume) {
      const resume = effectSite.resume || ZERO_DELAY;
      const invoked = invocation.resumeRange || {
        min: invocation.resumeOrdinal,
        max: invocation.resumeOrdinal,
      };
      if (invoked.max < resume.min || invoked.min > resume.max) return 'none';
      if (invoked.min !== invoked.max
        || invoked.min < resume.min || invoked.max > resume.max
        || resume.min !== resume.max) return 'maybe';
    }
    if (invocation?.awaited) return 'definite';
    const effect = addDelayRanges(event.delay, effectSite.delay || ZERO_DELAY);
    const read = currentReadContext?.delay || ZERO_DELAY;
    if (effect.min > read.max) return 'none';
    if (effect.max <= read.min) return 'definite';
    return 'maybe';
  };
  const mutationOccurrences = (step, flowContexts = null) => {
    const mutation = step.mutationSite;
    if (!mutation) return [{
      ...step,
      executionVisibility: 'definite',
      executionOrder: [mutation?.end ?? 0],
    }];
    const inherited = flowContexts?.get(flowContextId(mutation));
    const active = activeCutoffs.get(flowContextId(mutation));
    const cutoff = inherited || active;
    if (cutoff) {
      const directlyVisible = mutation.loop
        ? cutoff.pos >= mutation.loop.pos
        : mutation.end <= cutoff.pos;
      const recursiveBackedge = !directlyVisible && recursiveBackedgeAfter(mutation);
      if (!directlyVisible && !recursiveBackedge) return [];
      return [{
        ...step,
        executionVisibility: mutation.optional || recursiveBackedge ? 'maybe' : 'definite',
        executionOrder: [mutation.end],
        executionId: `${step.id}:${recursiveBackedge ? 'recursive' : 'direct'}:${cutoff.pos}`,
        executionCutoffs: withAddedCutoff(activeCutoffs, {
          file: mutation.file,
          pos: mutation.pos,
          owner: mutation.owner,
        }),
      }];
    }
    if (ts.isFunctionLike(mutation.owner)) {
      const events = invocationEventsBefore(mutation.owner);
      if (events.length) return events.flatMap((event) => {
        const timing = suspendedEffectVisibility(mutation, event);
        return timing === 'none' ? [] : [{
          ...step,
          executionVisibility: mutation.optional || event.optional || timing === 'maybe'
            ? 'maybe'
            : 'definite',
          executionOrder: [...event.order, mutation.end],
          executionId: `${step.id}:call:${event.id}`,
          executionCallChain: event.callChain,
          executionCutoffs: withAddedCutoff(event.cutoffs, {
            file: mutation.file,
            pos: mutation.pos,
            owner: mutation.owner,
          }),
        }];
      });
      const indexedSites = [
        ...(idx.callSites.get(mutation.owner) || []),
        ...(idx.elementCallSites.get(mutation.owner) || []),
      ];
      if (indexedSites.length) return [];
      if (!idx.escapedFunctions.has(mutation.owner)) return [];
      // Accessors and externally-invoked callbacks have no explicit
      // CallExpression in the estate. Their effects are still reachable, but
      // without a program point that can make them definite. Retain one
      // optional occurrence instead of silently erasing the mutation.
      return [{
        ...step,
        executionVisibility: 'maybe',
        executionOrder: [mutation.end],
        executionId: `${step.id}:escaped`,
        executionCutoffs: withAddedCutoff(activeCutoffs, {
          file: mutation.file,
          pos: mutation.pos,
          owner: mutation.owner,
        }),
      }];
    }
    return [];
  };
  const orderedOverlaySteps = (source, flowContexts) => source.overlaySteps
    .flatMap((step, index) => (
      step.mutation
        ? mutationOccurrences(step, flowContexts)
        : [{ ...step, executionVisibility: 'definite', executionOrder: [-1, index] }]
    ))
    .sort((left, right) => compareExecutionOrder(
      left.executionOrder,
      right.executionOrder,
    ));
  const mutationVisibility = (step, flowContexts = null) => {
    if (step.executionVisibility) return step.executionVisibility;
    const mutation = step.mutationSite;
    if (!mutation) return 'definite';
    const inherited = flowContexts?.get(flowContextId(mutation));
    if (inherited) {
      if (mutation.end > inherited.pos) return 'none';
      return mutation.optional ? 'maybe' : 'definite';
    }
    const active = activeCutoffs.get(flowContextId(mutation));
    if (active) {
      if (mutation.end > active.pos) return 'none';
      return mutation.optional ? 'maybe' : 'definite';
    }
    if (currentReadContext && mutation.file === currentReadContext.file
      && mutation.owner === currentReadContext.owner) {
      if (mutation.end > currentReadContext.pos) return 'none';
      return mutation.optional ? 'maybe' : 'definite';
    }
    const invocation = ts.isFunctionLike(mutation.owner)
      ? invocationBefore(mutation.owner)
      : 'none';
    if (invocation === 'none') return 'none';
    return invocation === 'definite' && !mutation.optional ? 'definite' : 'maybe';
  };

  /** Convert one executed field/root descriptor into exact container tokens.
   * Schema-2's explicit array nodes make arrays-of-arrays navigable; legacy
   * `elements:[origin]` descriptors remain readable only for governed migration
   * probes and are emitted into the same nested token representation. */
  const tokensOfDescriptor = (descriptor, resolvingArrays = new Set()) => {
    const out = new Set();
    if (descriptor.kind === 'record') {
      for (const origin of descriptor.origins || []) if (origins[origin]) out.add(recordToken(origin));
    } else if (descriptor.kind === 'array') {
      for (const origin of descriptor.elements || []) {
        if (origins[origin]) out.add(asArray(recordToken(origin)));
      }
      for (const arrayId of descriptor.arrays || []) {
        const array = arrays[arrayId];
        if (!array) continue;
        if (resolvingArrays.has(arrayId)) {
          bump('cycleCuts', `descriptor-array:${arrayId}`);
          continue;
        }
        const nextSeen = new Set(resolvingArrays).add(arrayId);
        for (const element of array.elements || []) {
          for (const token of tokensOfDescriptor(element, nextSeen)) {
            const wrapped = asArray(token);
            if (wrapped) out.add(wrapped);
          }
        }
      }
    } else if (descriptor.kind === 'dictionary') {
      for (const origin of descriptor.values || []) if (origins[origin]) out.add(dictionaryToken(origin));
    }
    return out;
  };

  const rootTokens = new Map();
  for (const [name, descriptors] of Object.entries(graph.roots)) {
    let out = EMPTY;
    for (const descriptor of descriptors) out = union(out, tokensOfDescriptor(descriptor));
    rootTokens.set(name, new Set([...out].map((token) => (
      isRecordToken(token)
        ? referenceToken(`root:${name}`, token, 'one')
        : token
    ))));
  }

  /** Locally constructed object overlays are writers too. Their token keeps
   * executed base provenance while recording syntax-owned fields, so
   * `Object.assign({}, settlement, { localOnly: 1 }).localOnly` is not blamed on
   * the settlement producer and unshadowed reads still judge the settlement. */
  const localRecords = new Map();
  const localPropertyDemands = new Set();
  const localElementDemands = new Set();
  const localRecordDemands = new Set();
  const localPropertyFacetApprox = new Map();
  const localPropertyFacetCache = new Map();
  const localRecordFacetCache = new Map();
  const localRecordFacetApprox = new Map();
  let localRecordFacetPass = 0;
  const localViewApprox = new Map();
  const localViewsEvaluating = new Map();
  const localViewEpoch = new Map();
  const localFieldsEvaluating = new Map();
  const localFieldEpoch = new Map();
  const localContextIds = new Map();
  const internLocalContext = (signature) => {
    let id = localContextIds.get(signature);
    if (id == null) {
      id = localContextIds.size;
      localContextIds.set(signature, id);
    }
    return id;
  };
  const localContextId = () => internLocalContext(cutoffSignatureOf());
  const ownerLocalContextId = (node, file) => {
    const ownerId = flowContextId({ file, owner: flowOwnerOf(node) });
    const ownerCutoff = activeCutoffs.get(ownerId);
    const signature = cutoffSignatureOf(
      ownerCutoff ? new Map([[ownerId, ownerCutoff]]) : new Map(),
    );
    return internLocalContext(`owner:${signature}`);
  };
  const localTokenOf = (node, file) => (
    `${LOCAL}${encodeURIComponent(file)}:${node.pos}:c${localContextId()}`
  );
  const ownerLocalTokenOf = (node, file) => (
    `${LOCAL}${encodeURIComponent(file)}:${node.pos}:c${ownerLocalContextId(node, file)}`
  );
  // Shallow heap-alias checks need only the allocation family. Registering a
  // context-qualified local here would mutate the fixed point merely to prove
  // that two families differ, and repeated call contexts could manufacture an
  // otherwise unbounded set of records that are immediately discarded.
  const shallowLocalFamilyTokenOf = (node, file) => (
    `${LOCAL}${encodeURIComponent(file)}:${node.pos}:c*`
  );
  const registerLocalToken = (
    token,
    bases,
    written,
    fields,
    sourceToken = token,
    fieldSources = new Map(),
    overlaySteps = [],
    allocationOwner = null,
  ) => {
    let record = localRecords.get(token);
    if (!record) {
      record = {
        bases: new Set(),
        written: new Set(),
        fields: new Map(),
        fieldSources: new Map(),
        overlaySteps: [],
        overlayStepById: new Map(),
        hasDeferredFields: false,
        hasMutations: false,
        hasFlowSensitiveMutations: false,
        intrinsicKeys: new Set(),
        multiplicity: 'one',
        sourceToken,
        view: null,
        allocationOwner,
      };
      localRecords.set(token, record);
    }
    let grew = false;
    if (!record.allocationOwner && allocationOwner) {
      record.allocationOwner = allocationOwner;
      grew = true;
    }
    for (const base of bases) {
      // A spread/overlay that is fed back into the same call site can resolve
      // to its own abstract local. The local already retains every base seen in
      // prior rounds; storing itself adds no provenance and creates an
      // unbounded traversal cycle.
      if (base === token) continue;
      if (!record.bases.has(base)) { record.bases.add(base); grew = true; }
    }
    for (const key of written) {
      if (!record.written.has(key)) { record.written.add(key); grew = true; }
    }
    for (const [key, values] of fields) {
      const prior = record.fields.get(key) || EMPTY;
      const next = union(prior, values);
      if (next.size !== prior.size) {
        record.fields.set(key, next);
        grew = true;
      }
    }
    for (const [key, sources] of fieldSources) {
      let registered = record.fieldSources.get(key);
      if (!registered) {
        registered = new Map();
        record.fieldSources.set(key, registered);
      }
      for (const [sourceKey, source] of sources) {
        if (registered.has(sourceKey)) continue;
        registered.set(sourceKey, source);
        record.hasDeferredFields = true;
        grew = true;
      }
    }
    for (const step of overlaySteps) {
      if (step.mutation && !record.hasMutations) {
        record.hasMutations = true;
        grew = true;
      }
      if (step.mutation && step.kind !== 'dynamic' && step.kind !== 'dynamicDelete'
        && !record.hasFlowSensitiveMutations) {
        record.hasFlowSensitiveMutations = true;
        grew = true;
      }
      const registered = record.overlayStepById.get(step.id);
      if (!registered) {
        const copyStep = step.kind === 'spread' || step.kind === 'mappedSpread';
        const next = copyStep
          ? { ...step, tokens: new Set([...step.tokens].filter((base) => base !== token)) }
          : { ...step };
        record.overlaySteps.push(next);
        record.overlayStepById.set(step.id, next);
        grew = true;
        continue;
      }
      const copyStep = step.kind === 'spread' || step.kind === 'mappedSpread';
      if (!copyStep || registered.kind !== step.kind) continue;
      if (step.unknownSource && !registered.unknownSource) {
        registered.unknownSource = true;
        grew = true;
      }
      for (const base of step.tokens) {
        if (base === token || registered.tokens.has(base)) continue;
        registered.tokens.add(base);
        grew = true;
      }
    }
    if (grew) noteApproximationGrowth(new Set([token]), 'registering a local record');
    return token;
  };
  const registerLocal = (
    node, file, bases, written, fields, fieldSources = new Map(), overlaySteps = [],
  ) => {
    // An empty, baseless allocation shell has no declaration-time value to
    // capture; all of its contents arrive through separately contextualized
    // heap effects. Caller combinations therefore belong in finite call views,
    // not in the raw source token. Rich literals retain the complete cutoff
    // identity required to isolate deferred closure fields between callers.
    const token = !bases.size && !fields.size && !fieldSources.size
      ? ownerLocalTokenOf(node, file)
      : localTokenOf(node, file);
    return registerLocalToken(
      token,
      bases,
      written,
      fields,
      token,
      fieldSources,
      overlaySteps,
      flowOwnerOf(node),
    );
  };
  const callEntriesOfView = (view) => view?.kind === 'call'
    ? (view.calls || [{ call: view.call, file: view.file, target: view.target }])
    : [];
  const indexedCallSiteOf = ({ call, target }) => {
    if (!target?.fn) return null;
    return [
      ...(idx.callSites.get(target.fn) || []),
      ...(idx.elementCallSites.get(target.fn) || []),
    ].find((candidate) => candidate.call === call) || null;
  };
  const callFlowsDirectlyToReturn = (call, owner) => {
    let current = call;
    while (current?.parent && current.parent !== owner) {
      const parent = current.parent;
      if ((ts.isParenthesizedExpression(parent)
        || ts.isAsExpression(parent)
        || ts.isNonNullExpression(parent)
        || ts.isTypeAssertionExpression?.(parent)
        || ts.isSatisfiesExpression?.(parent)
        || ts.isAwaitExpression(parent))
        && parent.expression === current) {
        current = parent;
        continue;
      }
      if (ts.isConditionalExpression(parent)
        && (parent.whenTrue === current || parent.whenFalse === current)) {
        current = parent;
        continue;
      }
      if (ts.isBinaryExpression(parent)
        && (parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
          || parent.operatorToken.kind === ts.SyntaxKind.BarBarToken
          || parent.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)
        && (parent.left === current || parent.right === current)) {
        current = parent;
        continue;
      }
      if (ts.isReturnStatement(parent) && parent.expression === current) return true;
      return false;
    }
    return false;
  };
  const nestedCallOwnsInvocationAllocation = (entry, owner) => {
    const callSite = indexedCallSiteOf(entry);
    if (!callSite || flowOwnerOf(entry.call) !== owner) return false;
    // An unconditional inner call creates the invocation's product. If the
    // call can be skipped, qualify it only when its value itself leaves through
    // that invocation's return. Otherwise a memoized module/closure binding
    // can replay one earlier allocation at several outer call sites, and
    // adding those sites would unsoundly split one runtime singleton.
    return !callSite.site?.optional
      || callFlowsDirectlyToReturn(entry.call, owner);
  };
  /** Instantiating a symbolic object literal at a call site must not eagerly
   * clone its entire local graph. A view retains the exact declaration + call
   * context and instantiates only the property path a reader actually asks
   * for. Besides being demand-linear, this keeps feedback (`next = f(next)`)
   * finite: one runtime allocation site is one abstract view, not an infinite
   * family of copied local terms. */
  const registerLocalView = (token, sourceToken, view) => {
    let record = localRecords.get(token);
    if (!record) {
      record = {
        bases: new Set(),
        written: new Set(),
        fields: new Map(),
        fieldSources: new Map(),
        overlaySteps: [],
        overlayStepById: new Map(),
        hasDeferredFields: false,
        hasMutations: false,
        hasFlowSensitiveMutations: false,
        intrinsicKeys: new Set(),
        multiplicity: view.kind === 'callback'
          || callEntriesOfView(view).some(({ call }) => loopOwnerOf(call))
          ? 'many'
          : 'one',
        sourceToken,
        view,
        allocationOwner: null,
      };
      localRecords.set(token, record);
      noteApproximationGrowth(new Set([token]), 'registering a local view');
      return token;
    }
    if (record.view?.kind === 'callback' && view.kind === 'callback') {
      const priorSize = record.view.elementTokens.size;
      record.view.elementTokens = union(record.view.elementTokens, view.elementTokens);
      if (record.view.elementTokens.size !== priorSize) {
        noteApproximationGrowth(record.view.elementTokens, 'growing a callback local view');
      }
    }
    if ((view.kind === 'callback'
      || callEntriesOfView(view).some(({ call }) => loopOwnerOf(call)))
      && record.multiplicity !== 'many') {
      record.multiplicity = 'many';
    }
    return token;
  };

  function withViewCallFrames(entries, evaluate) {
    const priorFrames = [];
    try {
      // View entries are stored allocation-first. Install wrapper frames from
      // the outside in so each inner wrapper argument resolves under its
      // concrete caller before the allocation's symbolic fields are replayed.
      for (const entry of [...entries].reverse()) {
        const fn = entry.target?.fn;
        if (!fn) continue;
        priorFrames.push([fn, sentinelFrames.get(fn)]);
        sentinelFrames.set(fn, invocationFrameFor({
          fn,
          callSite: {
            file: entry.file,
            args: [...entry.call.arguments],
            call: entry.call,
            awaited: false,
          },
        }, 0));
      }
      return evaluate();
    } finally {
      for (const [fn, frame] of priorFrames.reverse()) {
        if (frame) sentinelFrames.set(fn, frame);
        else sentinelFrames.delete(fn);
      }
    }
  }

  const instantiateViewTokens = (record, tokens) => {
    if (!record.view) return tokens;
    let approximations = localViewApprox.get(record);
    if (!approximations) {
      approximations = new Map();
      localViewApprox.set(record, approximations);
    }
    let evaluating = localViewsEvaluating.get(record);
    if (!evaluating) {
      evaluating = new Set();
      localViewsEvaluating.set(record, evaluating);
    }
    let epochs = localViewEpoch.get(record);
    if (!epochs) {
      epochs = new Map();
      localViewEpoch.set(record, epochs);
    }
    let out = EMPTY;
    for (const token of tokens) {
      const prior = approximations.get(token) || EMPTY;
      if (evaluating.has(token)) {
        out = union(out, prior);
        continue;
      }
      if (epochs.get(token) === evaluationEpoch) {
        out = union(out, prior);
        continue;
      }
      epochs.set(token, evaluationEpoch);
      evaluating.add(token);
      try {
        let addition;
        if (record.view.kind === 'call') {
          const entries = callEntriesOfView(record.view);
          const allocation = entries[0];
          addition = withViewCallFrames(entries.slice(1), () => instantiateSymbolic(
            token,
            allocation.call,
            allocation.file,
            0,
            allocation.target,
          ));
        } else {
          addition = instantiateCallbackSymbolic(
            token,
            record.view.elementTokens,
            record.view.diagnosticSite,
          );
        }
        const next = union(prior, addition);
        if (next.size !== prior.size) {
          approximations.set(token, next);
          noteApproximationGrowth(next, 'instantiating a local view');
        }
        out = union(out, next);
      } finally {
        evaluating.delete(token);
      }
    }
    return out;
  };

  /** A local can cross more than one function boundary before a property is
   * demanded. Retain one cutoff per lexical owner: the outermost/current call
   * supersedes an older cutoff in the same owner, while cutoffs from callers
   * higher in the stack remain available for mutations declared there. */
  const localEvaluationOf = (record) => {
    let source = record;
    let instantiator = record.view ? record : null;
    const seen = new Set();
    while (source && !seen.has(source)) {
      seen.add(source);
      if (!instantiator && source.view) instantiator = source;
      if (!source.view || source.sourceToken == null) break;
      const parent = localRecords.get(source.sourceToken);
      if (!parent || parent === source) break;
      source = parent;
    }
    return { source, instantiator: instantiator || source };
  };

  const flowLocalTokens = new Map();
  const flowContextsByHash = new Map();
  const relevantFlowContextIds = new WeakMap();
  const flowContextIdsForSource = (source) => {
    const cached = relevantFlowContextIds.get(source);
    if (cached?.stepCount === source.overlaySteps.length) return cached.ids;
    const ids = new Set(
      source.overlaySteps
        .filter((step) => step.mutation && step.mutationSite)
        .map((step) => flowContextId(step.mutationSite)),
    );
    // Local records grow monotonically during the fixed point. Key the cache
    // by the current step count so a mutation registered after an earlier
    // demand cannot be projected out by stale context metadata.
    relevantFlowContextIds.set(source, {
      stepCount: source.overlaySteps.length,
      ids,
    });
    return ids;
  };
  const flowContextsOf = (token) => {
    const flow = flowParts(token);
    return flow ? flowContextsByHash.get(flow.hash) || new Map() : new Map();
  };
  const sameFlowContexts = (left, right) => (
    left.size === right.size
    && [...left].every(([id, context]) => {
      const candidate = right.get(id);
      return candidate?.pos === context.pos
        && (candidate.delay?.min ?? 0) === (context.delay?.min ?? 0)
        && (candidate.delay?.max ?? 0) === (context.delay?.max ?? 0)
        && (candidate.resume?.min ?? 0) === (context.resume?.min ?? 0)
        && (candidate.resume?.max ?? 0) === (context.resume?.max ?? 0);
    })
  );
  const contextualizeTokens = (tokens, inheritedContexts) => {
    if (!inheritedContexts?.size || !tokens.size) return tokens;
    const out = new Set();
    for (const token of tokens) {
      const reference = referenceParts(token);
      if (reference) {
        for (const value of contextualizeTokens(
          new Set([reference.value]), inheritedContexts,
        )) out.add(referenceToken(reference.identity, value, reference.multiplicity));
        continue;
      }
      const promise = promiseParts(token);
      if (promise) {
        for (const value of contextualizeTokens(
          new Set([promise.value]),
          inheritedContexts,
        )) out.add(promiseToken(value));
        continue;
      }
      const plus = arrayPlusParts(token);
      if (plus) {
        const leaves = contextualizeTokens(new Set([plus.leaf]), inheritedContexts);
        for (const leaf of leaves) out.add(canonicalArrayPlusToken(plus.producer, leaf));
        continue;
      }
      const product = arrayProductParts(token);
      if (product) {
        const leaves = contextualizeTokens(new Set([product.leaf]), inheritedContexts);
        for (const leaf of leaves) {
          const rebuilt = asProducedArray(leaf, product.producer);
          if (rebuilt) out.add(rebuilt);
        }
        continue;
      }
      if (isArrayToken(token)) {
        const elements = contextualizeTokens(
          new Set([arrayElementToken(token)]),
          inheritedContexts,
        );
        for (const element of elements) {
          const array = asArray(element);
          if (array) out.add(array);
        }
        continue;
      }
      if (!isLocalToken(token)) {
        out.add(token);
        continue;
      }
      const existingFlow = flowParts(token);
      const baseToken = existingFlow?.base || token;
      const local = localRecords.get(baseToken);
      if (!local) continue;
      const evaluation = localEvaluationOf(local);
      // Every mutation needs its lexical-owner cutoff across a call boundary.
      // The context identity is a finite map of static owner/call sites, so
      // dynamic-key writes no longer need an unsound cross-owner visibility
      // default to converge.
      if (!evaluation.source?.hasMutations) {
        out.add(token);
        continue;
      }
      // A local mutation queries flow context only by its own lexical owner.
      // Carrying every caller cutoff into the token cannot affect visibility,
      // but recursively nested helpers multiply those dead dimensions into an
      // unbounded state family. Canonicalize the identity to the exact owner
      // IDs that this source's mutation steps can observe.
      const relevantIds = flowContextIdsForSource(evaluation.source);
      const existing = existingFlow
        ? flowContextsByHash.get(existingFlow.hash) || new Map()
        : new Map();
      const combined = new Map(
        [...existing].filter(([id]) => relevantIds.has(id)),
      );
      for (const [id, context] of inheritedContexts) {
        if (relevantIds.has(id)) combined.set(id, context);
      }
      if (!combined.size) {
        out.add(baseToken);
        continue;
      }
      if (sameFlowContexts(existing, combined) && existingFlow) {
        out.add(token);
        continue;
      }
      const identity = JSON.stringify([
        baseToken,
        [...combined]
          .map(([id, context]) => [
            id,
            context.pos,
            context.delay?.min ?? 0,
            context.delay?.max ?? 0,
            context.resume?.min ?? 0,
            context.resume?.max ?? 0,
          ])
          .sort(([a], [b]) => a.localeCompare(b)),
      ]);
      let destination = flowLocalTokens.get(identity);
      if (!destination) {
        const hash = sha256(identity);
        destination = flowToken(baseToken, hash);
        flowLocalTokens.set(identity, destination);
        flowContextsByHash.set(hash, combined);
        noteApproximationGrowth(
          new Set([destination]),
          `creating a flow-sensitive local token for ${heapTargetFamily(baseToken)}`
            + ` across ${combined.size} owner cutoff(s)`,
        );
      }
      out.add(destination);
    }
    return out;
  };
  const flowContextsAt = (node, file) => {
    const context = {
      file,
      pos: node.end,
      owner: flowOwnerOf(node),
      delay: suspensionRangeAt(node),
      resume: suspensionRangeAt(node, 'yield'),
    };
    return new Map([[flowContextId(context), context]]);
  };

  // Every modeled array allocation carries its exact syntax-site identity.
  // Product_p(L) is still exactly one array layer; only seeing producer p again
  // in its own unary lineage closes the infinite language as Plus(L). Raw
  // allocation ids acquire one immediate static call-site context when a
  // symbolic helper summary is instantiated, so `wrap(wrap(x))` stays two
  // exact layers while recursive reuse of the same call site repeats and
  // closes. Any later array wrapper is subsumed by an existing Plus language.
  const contextualArrayProducer = (producer, invocationSite) => {
    const source = typeof producer === 'string' ? { id: producer } : producer;
    const invocationId = sha256(invocationSite || 'unknown-array-invocation');
    const [, ...callString] = source.id.split('@');
    // A finite, no-repeat static call string distinguishes separate helper
    // invocations (`pass(pass(x))`) without allowing recursion to grow context
    // forever. Re-entering a site preserves the producer identity, so the
    // repeated Product in its unary lineage closes to Plus.
    if (callString.includes(invocationId)) return source;
    return {
      ...source,
      id: `${source.id}@${invocationId}`,
    };
  };
  const asProducedArray = (token, producer = null) => {
    if (!producer) return asArray(token);
    const source = typeof producer === 'string' ? { id: producer } : producer;
    const { id: producerId, kind = 'reconstruction' } = source;
    let current = token;
    const seen = new Set();
    while (!seen.has(current)) {
      seen.add(current);
      const plus = arrayPlusParts(current);
      if (plus) {
        const liftedLeaf = isSymbolicToken(plus.leaf) && plus.leaf.endsWith('|e')
          ? asArray(plus.leaf)
          : plus.leaf;
        return canonicalArrayPlusToken(plus.producer, liftedLeaf || plus.leaf);
      }
      const product = arrayProductParts(current);
      if (product) {
        if (product.producer === producerId) {
          const plusKey = sha256(JSON.stringify(['array-plus-v2', producerId]));
          bump('recursiveArrayPlusClosures', `${plusKey}:${producerId}`);
          return canonicalArrayPlusToken(plusKey, product.leaf);
        }
        current = product.leaf;
        continue;
      }
      if (isArrayToken(current)) {
        current = arrayElementToken(current);
        continue;
      }
      break;
    }
    const wrapped = asArray(token);
    if (!wrapped) return null;
    bump('recursiveArrayProducts', `${kind}:${producerId}`);
    return arrayProductToken(producerId, token);
  };
  const asMappedArray = (token, producer = null) => {
    // A map callback receives one element, so its exact symbolic `e` followed
    // by the map's `a` cancels before producer closure is necessary. Other
    // symbolic products (for example a captured parameter) retain a Product
    // tag and therefore still close if recursively nested.
    if (producer && isSymbolicToken(token) && token.endsWith('|e')) {
      return asArray(token);
    }
    return asProducedArray(token, producer);
  };
  const withReadContext = (context, evaluate) => {
    const prior = currentReadContext;
    const priorCutoffs = activeCutoffs;
    currentReadContext = context;
    activeCutoffs = withAddedCutoff(priorCutoffs, context);
    try {
      return evaluate();
    } finally {
      activeCutoffs = priorCutoffs;
      currentReadContext = prior;
    }
  };
  const tokenNeedsInstantiation = (token, seen = new Set()) => {
    if (isSymbolicToken(token)) return true;
    const flow = flowParts(token);
    if (flow) return tokenNeedsInstantiation(flow.base, seen);
    const reference = referenceParts(token);
    if (reference) return tokenNeedsInstantiation(reference.value, seen);
    const promise = promiseParts(token);
    if (promise) return tokenNeedsInstantiation(promise.value, seen);
    const plus = arrayPlusParts(token);
    if (plus) return tokenNeedsInstantiation(plus.leaf, seen);
    if (isArrayToken(token)) return tokenNeedsInstantiation(arrayElementToken(token), seen);
    if (!isLocalToken(token)) return false;
    if (seen.has(token)) {
      // This is an exact graph-reachability visited edge, not a provenance cut:
      // a cycle by itself cannot introduce a symbolic parameter. Other bases
      // and fields on the current local are still traversed by their callers.
      return false;
    }
    const local = localRecords.get(token);
    if (!local) return false;
    if (local.view) return false;
    // A deferred initializer may carry a symbolic parameter even before its
    // property is demanded. Conservatively create the call-site view now; the
    // field itself remains lazy and is instantiated only if read.
    if (local.hasDeferredFields) return true;
    const nextSeen = new Set(seen).add(token);
    for (const base of local.bases) {
      if (tokenNeedsInstantiation(base, nextSeen)) return true;
    }
    for (const values of local.fields.values()) {
      for (const value of values) {
        if (tokenNeedsInstantiation(value, nextSeen)) return true;
      }
    }
    return false;
  };

  const emptyPropertyFacet = () => ({
    values: EMPTY,
    presentRecords: EMPTY,
    absentRecords: EMPTY,
    missingLocal: false,
    locallyWritten: false,
    mayPresent: false,
    mayAbsent: true,
  });
  const samePropertyFacet = (left, right) => (
    left.values.size === right.values.size
    && [...left.values].every((value) => right.values.has(value))
    && left.presentRecords.size === right.presentRecords.size
    && [...left.presentRecords].every((value) => right.presentRecords.has(value))
    && left.absentRecords.size === right.absentRecords.size
    && [...left.absentRecords].every((value) => right.absentRecords.has(value))
    && left.missingLocal === right.missingLocal
    && left.locallyWritten === right.locallyWritten
    && left.mayPresent === right.mayPresent
    && left.mayAbsent === right.mayAbsent
  );

  /** Object spread and Object.assign source reads execute at the copy
   * operation, not when a later consumer asks for the copied field. Replay the
   * source expression and every getter/property facet under that frozen
   * lexical program point, while retaining the enclosing call frame. */
  function withSpreadTokens(step, evaluation, flowContexts, evaluate) {
    const temporalLocal = (tokens) => [...tokens].some((token) => {
      if (!isLocalToken(token)) return false;
      const local = localRecords.get(unflowToken(token));
      const source = local ? localEvaluationOf(local).source : null;
      if (!source) return false;
      return source.hasMutations || [...source.fieldSources.values()].some((sources) => (
        [...sources.values()].some((fieldSource) => fieldSource.kind === 'getter')
      ));
    });
    // Contextual heap steps have already resolved their source under the
    // concrete invocation that matched the target. Reapplying the target
    // local's instantiator here conflates two different call frames and can
    // erase the source fields of `Object.assign(makeTarget(), makeSource())`.
    const tokensFrom = (raw) => contextualizeTokens(
      !step.heapEffect && evaluation?.instantiator
        ? instantiateViewTokens(evaluation.instantiator, raw)
        : raw,
      flowContexts,
    );
    if (!step.mutation) {
      const tokens = tokensFrom(step.tokens);
      if (!step.context || !temporalLocal(tokens)) return evaluate(tokens);
      return withLocalFieldContext(
        step.context,
        () => evaluate(tokens),
        step.context.cutoffs,
      );
    }
    const run = () => {
      const raw = step.sourceNode
        ? resolve(step.sourceNode, step.sourceFile || step.file, 0)
        : step.tokens;
      return evaluate(tokensFrom(raw));
    };
    if (!step.context) return run();
    return withLocalFieldContext(
      step.context,
      () => (step.mutation ? withEffectExecution(step, 0, run) : run()),
      step.executionCutoffs || step.context.cutoffs,
    );
  }

  const heapStepApprox = new Map();
  const heapStepsEvaluating = new Set();
  const heapTargetFamily = (token) => {
    let base = unflowToken(token);
    if (!isLocalToken(base)) return base;
    const record = localRecords.get(base);
    if (record) base = localEvaluationOf(record).source?.sourceToken || base;
    return base
      .replace(/:c\d+/g, ':c*')
      .replace(/%3Ac\d+/gi, '%3Ac*');
  };
  const heapTargetIdentity = (token) => {
    const base = unflowToken(token);
    if (!isLocalToken(base)) return base;
    const record = localRecords.get(base);
    if (!record?.view) return heapTargetFamily(base);
    const source = heapTargetFamily(record.sourceToken || base);
    if (record.view.kind === 'call') {
      const chain = callEntriesOfView(record.view).map(({ call, file }) => (
        `${file}:${call.pos}:${call.end}`
      )).join('>');
      return `call:${chain}:${source}`;
    }
    return `callback:${record.view.diagnosticSite || 'unknown'}:${source}`;
  };
  const callSequenceContains = (executedCalls, requiredCalls) => {
    let cursor = 0;
    for (const required of requiredCalls) {
      const index = executedCalls.indexOf(required, cursor);
      if (index < 0) return false;
      cursor = index + 1;
    }
    return true;
  };
  const sameHeapTarget = (left, right, execution = null) => {
    if (left === right || heapTargetIdentity(left) === heapTargetIdentity(right)) return true;
    if (heapTargetFamily(left) !== heapTargetFamily(right)) return false;
    const leftRecord = isLocalToken(unflowToken(left))
      ? localRecords.get(unflowToken(left))
      : null;
    const rightRecord = isLocalToken(unflowToken(right))
      ? localRecords.get(unflowToken(right))
      : null;
    const views = [leftRecord?.view, rightRecord?.view].filter(Boolean);
    if (views.length !== 1 || views[0].kind !== 'call') return false;
    // A heap effect evaluated inside a helper sees the raw allocation token,
    // while the helper's return value is a call-qualified local view. Relate
    // those only through the exact invocation edge; two independent calls to
    // the same allocation site must never alias strongly by family alone.
    const executedCalls = (execution?.executionCallChain || []).map(
      ({ callSite }) => callSite.call,
    );
    const requiredCalls = [...callEntriesOfView(views[0])]
      .reverse()
      .map(({ call }) => call);
    return callSequenceContains(executedCalls, requiredCalls);
  };
  const heapTokenIsSingleton = (token) => {
    const reference = referenceParts(token);
    if (reference) return reference.multiplicity === 'one';
    if (!isLocalToken(token)) return false;
    return localRecords.get(unflowToken(token))?.multiplicity === 'one';
  };

  const shallowHeapCallFrames = new Map();
  const expressionReadsBinding = (expression, binding) => {
    const value = unwrap(expression);
    return ts.isIdentifier(value) && idx.bindingOf(value) === binding;
  };
  /** A deliberately closed primitive refinement. The proof is target-relative:
   * record/array/local provenance can never be returned by one of these strict
   * branches. Loose equality, truthiness, negative typeof tests, and mutated
   * bindings remain unknown. */
  const truthyConditionReturnsPrimitiveBinding = (condition, binding) => {
    const value = unwrap(condition);
    if (!ts.isBinaryExpression(value)) return false;
    const operator = value.operatorToken.kind;
    if (operator === ts.SyntaxKind.BarBarToken) {
      return truthyConditionReturnsPrimitiveBinding(value.left, binding)
        && truthyConditionReturnsPrimitiveBinding(value.right, binding);
    }
    if (operator === ts.SyntaxKind.AmpersandAmpersandToken) {
      return truthyConditionReturnsPrimitiveBinding(value.left, binding)
        || truthyConditionReturnsPrimitiveBinding(value.right, binding);
    }
    if (operator !== ts.SyntaxKind.EqualsEqualsEqualsToken) return false;
    const sides = [
      [unwrap(value.left), unwrap(value.right)],
      [unwrap(value.right), unwrap(value.left)],
    ];
    for (const [subject, comparison] of sides) {
      if (expressionReadsBinding(subject, binding)
        && comparison.kind === ts.SyntaxKind.NullKeyword) return true;
      if (!ts.isTypeOfExpression(subject)
        || !expressionReadsBinding(subject.expression, binding)
        || !ts.isStringLiteral(comparison)) continue;
      if ([
        'undefined', 'boolean', 'number', 'bigint', 'string', 'symbol',
      ].includes(comparison.text)) return true;
    }
    return false;
  };
  const returnIsStrictlyGuardedPrimitive = (statement, binding) => {
    if ((binding.writes || []).length) return false;
    let child = statement;
    for (let parent = statement.parent; parent; child = parent, parent = parent.parent) {
      if (ts.isFunctionLike(parent)) return false;
      if (ts.isIfStatement(parent) && parent.thenStatement === child
        && truthyConditionReturnsPrimitiveBinding(parent.expression, binding)) return true;
    }
    return false;
  };

  const shallowHeapReceiverTokens = (
    expression,
    file,
    targetToken,
    seenBindings = new Set(),
    seenCalls = new Set(),
    familiesOnly = false,
  ) => {
    const value = unwrap(expression);
    if (!value) return { known: true, tokens: EMPTY };
    if (ts.isObjectLiteralExpression(value)) {
      return {
        known: true,
        tokens: new Set([familiesOnly
          ? shallowLocalFamilyTokenOf(value, file)
          : registerLocal(value, file, EMPTY, EMPTY, new Map())]),
      };
    }
    if (ts.isArrayLiteralExpression(value)) {
      return isArrayLikeToken(targetToken)
        ? { known: false, tokens: EMPTY }
        : { known: true, tokens: EMPTY };
    }
    if (ts.isIdentifier(value)) {
      const binding = idx.bindingOf(value);
      if (!binding) return { known: false, tokens: EMPTY };
      const shallowFrame = shallowHeapCallFrames.get(binding.fn);
      if (binding.k === 'param' && shallowFrame?.has(binding)) {
        return shallowFrame.get(binding);
      }
      if (binding.k === 'param' && sentinelFrames.has(binding.fn)) {
        return {
          known: true,
          tokens: sentinelFrames.get(binding.fn).get(binding)?.objects || EMPTY,
        };
      }
      if (binding.k !== 'expr' || binding.projection?.length
        || seenBindings.has(binding)) return { known: false, tokens: EMPTY };
      const version = bindingVersionOf(binding, value, file);
      const nextSeen = new Set(seenBindings).add(binding);
      const resolveSource = (node, sourceFile, fallbacks = []) => {
        let resolved = node
          ? shallowHeapReceiverTokens(
            node,
            sourceFile,
            targetToken,
            nextSeen,
            seenCalls,
            familiesOnly,
          )
          : { known: true, tokens: EMPTY };
        if (!resolved.known) return resolved;
        let tokens = resolved.tokens;
        for (const fallback of fallbacks) {
          const alternative = shallowHeapReceiverTokens(
            fallback,
            sourceFile,
            targetToken,
            nextSeen,
            seenCalls,
            familiesOnly,
          );
          if (!alternative.known) return alternative;
          tokens = union(tokens, alternative.tokens);
        }
        return { known: true, tokens };
      };
      let tokens = EMPTY;
      if (version.initialVisible) {
        for (const node of [binding.node, ...(binding.additionalInitializers || [])]) {
          if (!node) continue;
          const resolved = resolveSource(node, binding.file, binding.fallbacks || []);
          if (!resolved.known) return resolved;
          tokens = union(tokens, resolved.tokens);
        }
      }
      for (const write of version.writes) {
        // A property/dictionary write changes the receiver's contents, not the
        // identity held by its lexical binding. Following its RHS here would
        // recursively materialize the very heap effect whose receiver we are
        // trying to disambiguate.
        if (write.kind !== 'assign') continue;
        if (write.transfer === 'primitive') {
          if (!write.site?.optional) tokens = EMPTY;
          continue;
        }
        const resolved = resolveSource(
          write.node,
          write.file || binding.file,
          write.fallbacks || [],
        );
        if (!resolved.known) return resolved;
        tokens = write.transfer === 'replace' && !write.site?.optional
          ? resolved.tokens
          : union(tokens, resolved.tokens);
      }
      return { known: true, tokens };
    }
    if (ts.isConditionalExpression(value)) {
      const whenTrue = shallowHeapReceiverTokens(
        value.whenTrue, file, targetToken, seenBindings, seenCalls, familiesOnly,
      );
      const whenFalse = shallowHeapReceiverTokens(
        value.whenFalse, file, targetToken, seenBindings, seenCalls, familiesOnly,
      );
      return whenTrue.known && whenFalse.known
        ? { known: true, tokens: union(whenTrue.tokens, whenFalse.tokens) }
        : { known: false, tokens: EMPTY };
    }
    if (ts.isBinaryExpression(value)
      && (value.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
        || value.operatorToken.kind === ts.SyntaxKind.BarBarToken
        || value.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)) {
      const left = shallowHeapReceiverTokens(
        value.left, file, targetToken, seenBindings, seenCalls, familiesOnly,
      );
      const right = shallowHeapReceiverTokens(
        value.right, file, targetToken, seenBindings, seenCalls, familiesOnly,
      );
      return left.known && right.known
        ? { known: true, tokens: union(left.tokens, right.tokens) }
        : { known: false, tokens: EMPTY };
    }
    if (ts.isCallExpression(value)) {
      const callee = unwrap(value.expression);
      if (idx.classifyCall(value).kind === 'Object.assign' && value.arguments[0]) {
        return shallowHeapReceiverTokens(
          value.arguments[0], file, targetToken, seenBindings, seenCalls, familiesOnly,
        );
      }
      const classification = idx.classifyCall(value);
      if (classification.kind === 'source' && classification.target) {
        const target = classification.target;
        if (isAsyncFunction(target.fn) || isGeneratorFunction(target.fn)
          || seenCalls.has(target.fn)) return { known: false, tokens: EMPTY };
        const frame = new Map();
        target.fn.parameters?.forEach((parameter, index) => {
          if (!ts.isIdentifier(parameter.name)) return;
          const binding = idx.bindingOf(parameter.name);
          if (!binding) return;
          const effective = effectiveArgument(
            value.arguments,
            index,
            parameter,
            file,
            target.file,
          );
          frame.set(binding, effective
            ? shallowHeapReceiverTokens(
              effective.expression,
              effective.file,
              targetToken,
              seenBindings,
              seenCalls,
              familiesOnly,
            )
            : { known: true, tokens: EMPTY });
        });
        const priorFrame = shallowHeapCallFrames.get(target.fn);
        shallowHeapCallFrames.set(target.fn, frame);
        const nextCalls = new Set(seenCalls).add(target.fn);
        let tokens = EMPTY;
        let known = true;
        const inspectReturn = (statement) => {
          if (!statement.expression) return;
          const returned = unwrap(statement.expression);
          if (ts.isIdentifier(returned)) {
            const binding = idx.bindingOf(returned);
            if (binding?.k === 'param'
              && returnIsStrictlyGuardedPrimitive(statement, binding)) return;
          }
          const resolved = shallowHeapReceiverTokens(
            statement.expression,
            target.file,
            targetToken,
            seenBindings,
            nextCalls,
            familiesOnly,
          );
          if (!resolved.known) known = false;
          else tokens = union(tokens, resolved.tokens);
        };
        const visit = (node) => {
          if (ts.isFunctionLike(node) && node !== target.fn) return;
          if (ts.isReturnStatement(node)) {
            inspectReturn(node);
            return;
          }
          ts.forEachChild(node, visit);
        };
        try {
          if (target.fn.body && ts.isBlock(target.fn.body)) visit(target.fn.body);
          else if (target.fn.body) {
            const resolved = shallowHeapReceiverTokens(
              target.fn.body,
              target.file,
              targetToken,
              seenBindings,
              nextCalls,
              familiesOnly,
            );
            known = resolved.known;
            tokens = resolved.tokens;
          }
        } finally {
          if (priorFrame) shallowHeapCallFrames.set(target.fn, priorFrame);
          else shallowHeapCallFrames.delete(target.fn);
        }
        // Return raw allocation families. Call qualification would overstate
        // singleton identity across nested wrappers; family comparison is the
        // only fact the context-free preflight consumes.
        return known ? { known: true, tokens } : { known: false, tokens: EMPTY };
      }
      if (classification.kind !== 'source'
        && ts.isPropertyAccessExpression(callee)
        && ['map', 'filter', 'slice', 'concat', 'flat', 'flatMap'].includes(callee.name.text)
        && !isArrayLikeToken(targetToken)) return { known: true, tokens: EMPTY };
      return { known: false, tokens: EMPTY };
    }
    if (ts.isAwaitExpression(value)) {
      return shallowHeapReceiverTokens(
        value.expression, file, targetToken, seenBindings, seenCalls, familiesOnly,
      );
    }
    if (value.kind === ts.SyntaxKind.NullKeyword
      || value.kind === ts.SyntaxKind.TrueKeyword
      || value.kind === ts.SyntaxKind.FalseKeyword
      || ts.isStringLiteral(value) || ts.isNumericLiteral(value)
      || ts.isNoSubstitutionTemplateLiteral(value)) {
      return { known: true, tokens: EMPTY };
    }
    return { known: false, tokens: EMPTY };
  };
  const shallowHeapReceiverFamilies = (expression, file, targetToken) => (
    shallowHeapReceiverTokens(
      expression,
      file,
      targetToken,
      new Set(),
      new Set(),
      true,
    )
  );
  const invocationOwnedReceiverCache = new Map();
  const primitiveIdentitySource = (expression) => {
    const value = unwrap(expression);
    if (!value) return true;
    if (value.kind === ts.SyntaxKind.NullKeyword
      || value.kind === ts.SyntaxKind.TrueKeyword
      || value.kind === ts.SyntaxKind.FalseKeyword
      || ts.isStringLiteral(value) || ts.isNumericLiteral(value)
      || ts.isNoSubstitutionTemplateLiteral(value)
      || ts.isVoidExpression(value)) return true;
    return ts.isIdentifier(value) && value.text === 'undefined' && !idx.bindingOf(value);
  };
  /**
   * Prove the narrow condition under which an effect receiver cannot carry an
   * allocation from a different invocation. This is intentionally stronger
   * than ordinary alias resolution: the receiver must be a same-owner lexical
   * binding, and every object-valued identity source must be a fresh allocation
   * in that owner. Parameters, captures, aliases, logical transfers, and
   * unproven calls fail closed so later invocations can still mutate objects
   * created by earlier ones.
   *
   * The proof is target-relative. A default-library array producer cannot be
   * the non-array local target currently demanded, but it is not treated as a
   * general freshness proof for array targets.
   */
  const invocationOwnsReceiverForTarget = (effect, targetToken) => {
    const targetFamily = heapTargetFamily(targetToken);
    const cacheKey = `${effect.id}\u0000${targetFamily}`;
    if (invocationOwnedReceiverCache.has(cacheKey)) {
      return invocationOwnedReceiverCache.get(cacheKey);
    }
    const owner = effect.mutationSite?.owner;
    const receiver = unwrap(effect.receiver);
    const binding = receiver && ts.isIdentifier(receiver) ? idx.bindingOf(receiver) : null;
    if (!owner || !binding || binding.k !== 'expr' || binding.projection?.length
      || binding.fallbacks?.length || binding.declarationOwner !== owner) {
      invocationOwnedReceiverCache.set(cacheKey, false);
      return false;
    }

    let matchesTargetFreshAllocation = false;
    const sourceIsInvocationOwnedOrDisjoint = (expression, file) => {
      if (primitiveIdentitySource(expression)) return true;
      const value = unwrap(expression);
      if (ts.isObjectLiteralExpression(value)) {
        if (flowOwnerOf(value) !== owner) return false;
        const family = heapTargetFamily(shallowLocalFamilyTokenOf(value, file));
        if (family === targetFamily) matchesTargetFreshAllocation = true;
        return true;
      }
      if (ts.isArrayLiteralExpression(value)) {
        return flowOwnerOf(value) === owner && !isArrayLikeToken(targetToken);
      }
      if (ts.isCallExpression(value)) {
        const callee = unwrap(value.expression);
        return !isArrayLikeToken(targetToken)
          && idx.classifyCall(value).kind !== 'source'
          && ts.isPropertyAccessExpression(callee)
          && FRESH_ARRAY_RESULT_METHODS.has(callee.name.text)
          && idx.isDefaultLibrarySymbol(callee.name);
      }
      return false;
    };

    let proven = true;
    for (const initializer of [binding.node, ...(binding.additionalInitializers || [])]) {
      if (initializer && !sourceIsInvocationOwnedOrDisjoint(initializer, binding.file)) {
        proven = false;
        break;
      }
    }
    if (proven) for (const write of binding.writes || []) {
      // Dictionary/property writes alter contents without replacing identity.
      if (write.kind === 'dictionary' || write.transfer === 'primitive') continue;
      if (write.kind !== 'assign' || write.transfer !== 'replace'
        || write.projection?.length || write.fallbacks?.length
        || !sourceIsInvocationOwnedOrDisjoint(write.node, write.file || binding.file)) {
        proven = false;
        break;
      }
    }
    const result = proven && matchesTargetFreshAllocation;
    invocationOwnedReceiverCache.set(cacheKey, result);
    return result;
  };
  const keyDomainRefinements = new Map();
  const ownKeyEnumerationSourceOf = (binding) => {
    if (!binding || binding.k !== 'expr' || (binding.writes || []).length
      || binding.fallbacks?.length || binding.additionalInitializers?.length
      || binding.projection?.length !== 1
      || binding.projection[0].kind !== 'element' || !binding.node) return null;
    const call = unwrap(binding.node);
    if (!ts.isCallExpression(call) || call.arguments.length !== 1) return null;
    const callee = unwrap(call.expression);
    if (!ts.isPropertyAccessExpression(callee) || callee.name.text !== 'keys'
      || !idx.isIntrinsicGlobal(callee.expression, 'Object')) return null;
    return call.arguments[0];
  };
  const withKeyDomainRefinement = (binding, domains, evaluate) => {
    const prior = keyDomainRefinements.get(binding);
    keyDomainRefinements.set(binding, domains);
    try {
      return evaluate();
    } finally {
      if (prior) keyDomainRefinements.set(binding, prior);
      else keyDomainRefinements.delete(binding);
    }
  };

  function contextualHeapStepsFor(targetToken, demandedKey = null) {
    const demand = `${heapTargetIdentity(targetToken)}:${demandedKey ?? '*'}:${cutoffSignatureOf()}`;
    const prior = heapStepApprox.get(demand) || new Map();
    if (heapStepsEvaluating.has(demand)) return [...prior.values()];
    const targetLocal = isLocalToken(unflowToken(targetToken))
      ? localRecords.get(unflowToken(targetToken))
      : null;
    const targetSourceOwner = targetLocal
      ? localEvaluationOf(targetLocal).source?.allocationOwner
      : null;
    const viewInvocationChain = targetLocal?.view?.kind === 'call'
      ? [...callEntriesOfView(targetLocal.view)].reverse().flatMap((entry) => (
        entry.target?.fn
          ? [{
            fn: entry.target.fn,
            callSite: {
              file: entry.file,
              args: [...entry.call.arguments],
              call: entry.call,
              site: indexedCallSiteOf(entry)?.site,
              awaited: false,
            },
          }]
          : []
      ))
      : [];
    let activeOwnerIndex = -1;
    if (targetLocal && !viewInvocationChain.length && targetSourceOwner) {
      for (let index = 0; index < activeEffectCallChain.length; index += 1) {
        if (activeEffectCallChain[index].fn === targetSourceOwner) activeOwnerIndex = index;
      }
    }
    // A raw owner-local allocation can be demanded while resolving an effect
    // inside its concrete invocation, before the function return has wrapped it
    // in a call view. Inherit that active outer-to-inner chain through the
    // allocation owner; otherwise every estate caller would be replayed while
    // evaluating one already-selected invocation.
    const targetInvocationChain = viewInvocationChain.length
      ? viewInvocationChain
      : (activeOwnerIndex >= 0
        ? activeEffectCallChain.slice(0, activeOwnerIndex + 1)
        : []);
    const targetInvocationCalls = targetInvocationChain.map(
      ({ callSite }) => callSite.call,
    );
    const producerOwnedNonEscape = Boolean(
      targetSourceOwner && activeNonEscapingProducerOwners?.has(targetSourceOwner),
    );
    heapStepsEvaluating.add(demand);
    try {
      for (const effect of idx.heapEffects || []) {
        if (heapEffectsResolvingReceiver.has(effect.id)) continue;
        const effectOwner = effect.mutationSite?.owner;
        if (activeExecutionOwners && !activeExecutionOwners.has(effectOwner)) continue;
        if (producerOwnedNonEscape
          && !activeNonEscapingProducerOwners.has(effectOwner)) continue;
        if (demandedKey != null && effect.kind !== 'spread'
          && effect.key != null && effect.key !== demandedKey) continue;
        // Reject syntactically provable non-aliases before expanding execution
        // occurrences. Occurrence construction installs complete invocation
        // frames and can itself demand recursive object contents; allocation
        // family is the only context-free identity fact strong enough here.
        // Same-family call views continue to the invocation-aware comparison.
        if (effect.receiver) {
          const preflight = shallowHeapReceiverFamilies(
            effect.receiver,
            effect.file,
            targetToken,
          );
          if (preflight.known && [...preflight.tokens].every(
            (candidate) => heapTargetFamily(candidate) !== heapTargetFamily(targetToken),
          )) continue;
        }
        const receiverInvocationOwned = effectOwner === targetSourceOwner
          && invocationOwnsReceiverForTarget(effect, targetToken);
        const invocationOwnedReceiver = Boolean(
          targetInvocationCalls.length && receiverInvocationOwned,
        );
        const template = {
          ...effect,
          mutation: true,
          context: captureLocalFieldContext(),
        };
        for (const occurrence of mutationOccurrences(template)) {
          const occurrenceChain = occurrence.executionCallChain || [];
          if (invocationOwnedReceiver && occurrenceChain.length
            && !callSequenceContains(
              occurrenceChain.map(({ callSite }) => callSite.call),
              targetInvocationCalls,
            )) continue;
          const execution = {
            ...occurrence,
            executionVisibility: occurrence.executionVisibility || 'definite',
            // A direct cutoff inside the allocation owner proves when the
            // effect runs but carries no parameter frame. Replay the exact
            // target view's outer-to-inner calls so a recursive producer reads
            // this allocation's argument rather than joining every estate
            // caller. Caller-side effects keep their own occurrence chain (or
            // the narrow exact-receiver fallback below).
            executionCallChain: invocationOwnedReceiver && !occurrenceChain.length
              ? targetInvocationChain
              : occurrenceChain,
          };
          const priorEffectDiagnostic = activeHeapEffectDiagnostic;
          activeHeapEffectDiagnostic = `${effect.id} at ${effect.file}:${effect.mutationSite?.pos}:${effect.mutationSite?.end}`;
          let instantiated;
          try {
            instantiated = withEffectExecution(execution, 0, () => {
            const priorReceiverEffects = heapEffectsResolvingReceiver;
            heapEffectsResolvingReceiver = new Set(priorReceiverEffects).add(effect.id);
            let targets;
            try {
              const shallow = effect.receiver
                ? shallowHeapReceiverTokens(
                  effect.receiver,
                  effect.file,
                  targetToken,
                )
                : { known: true, tokens: EMPTY };
              targets = shallow.known
                ? shallow.tokens
                : resolve(effect.receiver, effect.file, 0);
            } finally {
              heapEffectsResolvingReceiver = priorReceiverEffects;
            }
            let matchingTargets = [...targets].filter(
              (candidate) => sameHeapTarget(candidate, targetToken, execution),
            );
            const receiverRoot = unwrap(effect.receiver);
            const receiverBinding = receiverRoot && ts.isIdentifier(receiverRoot)
              ? idx.bindingOf(receiverRoot)
              : null;
            const capturedLexicalReceiver = receiverBinding?.k === 'expr'
              && receiverBinding.declarationOwner !== effectOwner;
            if (!matchingTargets.length && effect.receiver
              && targetLocal?.view?.kind === 'call'
              && (capturedLexicalReceiver
                || (!(execution.executionCallChain || []).length
                  && effect.mutationSite?.owner === currentReaderOwner))) {
              // The shallow resolver intentionally returns allocation-family
              // locals without constructing call views. That is sufficient for
              // rejection and for effects executing inside a modeled call
              // chain. Two cases still require exact receiver materialization:
              // a caller-side alias has no execution chain to relate its raw
              // family to the returned object, while a captured/module binding
              // can replay one memoized allocation in a later invocation whose
              // chain does not contain the original factory call. Both execute
              // under a concrete cutoff here; same-owner helper receivers stay
              // shallow so they cannot recursively enumerate every caller.
              const priorReceiverEffects = heapEffectsResolvingReceiver;
              heapEffectsResolvingReceiver = new Set(priorReceiverEffects).add(effect.id);
              try {
                targets = resolve(effect.receiver, effect.file, 0);
              } finally {
                heapEffectsResolvingReceiver = priorReceiverEffects;
              }
              matchingTargets = [...targets].filter(
                (candidate) => sameHeapTarget(candidate, targetToken, execution),
              );
            }
            if (!matchingTargets.length) {
              return null;
            }
            const resolvedKeyDomains = effect.key != null
              ? new Set([literalKeyDomain(effect.key)])
              : resolveKeyDomain(effect.keyNode, effect.file, 0);
            let valueTokens = EMPTY;
            if (effect.node && effect.kind !== 'delete'
              && effect.kind !== 'dynamicDelete' && effect.assignment !== 'compound') {
              const keyNode = effect.keyNode ? unwrap(effect.keyNode) : null;
              const keyBinding = demandedKey != null && keyNode && ts.isIdentifier(keyNode)
                ? idx.bindingOf(keyNode)
                : null;
              const evaluateValue = () => resolve(effect.node, effect.file, 0);
              valueTokens = keyBinding && ownKeyEnumerationSourceOf(keyBinding)
                ? withKeyDomainRefinement(
                  keyBinding,
                  new Set([literalKeyDomain(demandedKey)]),
                  evaluateValue,
                )
                : evaluateValue();
            }
            return {
              ...execution,
              heapEffect: true,
              valueTokens,
              tokens: effect.kind === 'spread' ? valueTokens : effect.tokens,
              sourceNode: null,
              sourceFile: effect.file,
              resolvedKeyDomains,
              context: captureLocalFieldContext(),
              executionVisibility: targets.size > 1
                || matchingTargets.some((candidate) => !heapTokenIsSingleton(candidate))
                ? 'maybe'
                : execution.executionVisibility,
            };
            });
          } finally {
            activeHeapEffectDiagnostic = priorEffectDiagnostic;
          }
          if (!instantiated) continue;
          const id = instantiated.executionId || instantiated.id;
          const existing = prior.get(id);
          if (!existing) {
            prior.set(id, instantiated);
            noteApproximationGrowth(
              instantiated.valueTokens,
              'instantiating a contextual heap effect',
            );
          } else {
            const values = union(existing.valueTokens, instantiated.valueTokens);
            if (values.size !== existing.valueTokens.size) {
              existing.valueTokens = values;
              noteApproximationGrowth(values, 'growing a contextual heap effect');
            }
          }
        }
      }
      heapStepApprox.set(demand, prior);
      return [...prior.values()].sort((left, right) => compareExecutionOrder(
        left.executionOrder,
        right.executionOrder,
      ));
    } finally {
      heapStepsEvaluating.delete(demand);
    }
  }

  function applyContextualHeapFacet(token, key, initial, includeValues) {
    let state = initial;
    const targetDomain = literalKeyDomain(key);
    const strongTarget = heapTokenIsSingleton(token);
    for (const step of contextualHeapStepsFor(token, key)) {
      // Bare corpus origins and repeated allocation sites are shape summaries,
      // not runtime identities. Their updates are weak even when the source
      // statement itself is unconditional. Only an identity-qualified root or
      // a non-repeated local allocation can kill the prior cell.
      const optional = step.executionVisibility === 'maybe' || !strongTarget;
      if (step.kind === 'delete' && step.key === key) {
        state = optional
          ? { ...state, mayAbsent: true, missingLocal: true, locallyWritten: true }
          : { ...emptyPropertyFacet(), missingLocal: true, locallyWritten: true };
        continue;
      }
      if (step.kind === 'field' && step.key === key) {
        const incoming = {
          ...emptyPropertyFacet(),
          values: includeValues && step.assignment !== 'compound'
            ? step.valueTokens
            : EMPTY,
          locallyWritten: true,
          mayPresent: true,
          mayAbsent: false,
        };
        if (step.assignment === 'and') {
          state = { ...state, values: union(state.values, incoming.values), locallyWritten: true };
        } else if (step.assignment === 'or' || step.assignment === 'coalesce') {
          state = state.mayPresent ? state : incoming;
        } else if (optional) {
          state = {
            values: union(state.values, incoming.values),
            presentRecords: state.presentRecords,
            absentRecords: state.absentRecords,
            missingLocal: state.missingLocal,
            locallyWritten: true,
            mayPresent: true,
            mayAbsent: state.mayAbsent,
          };
        } else state = incoming;
        continue;
      }
      if (step.kind === 'dynamic' || step.kind === 'dynamicDelete') {
        const { domains, definite } = mutationKeyDomains(step);
        if (!domains.has(targetDomain)
          && ![...domains].some((domain) => domain === KEY_UNKNOWN
            || domain.startsWith(KEY_PARAM) || domain.startsWith('binding:')
            || domain.startsWith('family:') || domain.startsWith('unknown:'))) continue;
        const exact = definite && domains.size === 1 && domains.has(targetDomain) && !optional;
        if (step.kind === 'dynamicDelete') {
          state = exact
            ? { ...emptyPropertyFacet(), missingLocal: true, locallyWritten: true }
            : { ...state, mayAbsent: true, missingLocal: true, locallyWritten: true };
        } else {
          const values = includeValues && step.assignment !== 'compound'
            ? step.valueTokens
            : EMPTY;
          if (exact) state = {
            ...emptyPropertyFacet(), values, locallyWritten: true, mayPresent: true, mayAbsent: false,
          };
          else state = {
            ...state,
            values: union(state.values, values),
            locallyWritten: true,
            mayPresent: true,
          };
        }
        continue;
      }
      if (step.kind === 'spread') {
        const incoming = withSpreadTokens(
          step,
          null,
          new Map(),
          (tokens) => propertyFacetForTokens(tokens, key, new Set(), includeValues, false),
        );
        if (!incoming.mayPresent) continue;
        state = optional || incoming.mayAbsent
          ? {
            ...incoming,
            values: union(state.values, incoming.values),
            presentRecords: union(state.presentRecords, incoming.presentRecords),
            absentRecords: union(state.absentRecords, incoming.absentRecords),
            missingLocal: state.missingLocal || incoming.missingLocal,
            locallyWritten: true,
            mayPresent: true,
            mayAbsent: state.mayAbsent || incoming.mayAbsent,
          }
          : { ...incoming, locallyWritten: true };
      }
    }
    return state;
  }

  /** Every object-spread/Object.assign operand is an alternative runtime
   * source, while the operands themselves apply in source order. `keys` means
   * an executed origin MAY carry a key; only `requiredKeys` proves that every
   * instance carries it and can therefore erase the prior writer. Legacy
   * graphs have no required-key proof and conservatively retain the fallback. */
  function propertyFacetForToken(
    token,
    key,
    seenLocals,
    includeValues,
    includeDynamicCells = true,
  ) {
    if (isSymbolicToken(token)) {
      return {
        ...emptyPropertyFacet(),
        values: includeValues ? new Set([symbolicProperty(token, key)]) : EMPTY,
        mayPresent: true,
      };
    }
    if (isDictionaryToken(token)) {
      const value = asElem(token);
      return {
        ...emptyPropertyFacet(),
        values: includeValues && value ? new Set([value]) : EMPTY,
        mayPresent: true,
      };
    }
    if (isArrayLikeToken(token)) {
      const numeric = /^(?:0|[1-9]\d*)$/.test(key) && Number(key) < 0xffff_ffff;
      const values = numeric && includeValues ? arrayElementTokens(token) : EMPTY;
      return {
        ...emptyPropertyFacet(),
        values,
        mayPresent: numeric,
      };
    }
    if (isLocalToken(token)) {
      const local = localRecords.get(unflowToken(token));
      const evaluation = local ? localEvaluationOf(local) : null;
      const source = evaluation?.source || null;
      const flowContexts = flowContextsOf(token);
      if (!local || !source) return emptyPropertyFacet();
      const demands = includeValues ? localPropertyDemands : localRecordDemands;
      const hasGetter = [...source.fieldSources.values()].some((sources) => (
        [...sources.values()].some((fieldSource) => fieldSource.kind === 'getter')
      ));
      const demand = `${token}|${includeValues ? 'p' : 'r'}:${encodeURIComponent(key)}`
        + (hasGetter ? `@cutoff:${sha256(cutoffSignatureOf())}` : '');
      const cached = includeValues
        ? localPropertyFacetCache.get(demand)
        : localRecordFacetCache.get(demand);
      if ((includeValues && cached?.epoch === evaluationEpoch)
        || (!includeValues && cached?.pass === localRecordFacetPass)) return cached.facet;
      const approximations = includeValues ? localPropertyFacetApprox : localRecordFacetApprox;
      if (seenLocals.has(token)) {
        if (includeValues) bump('resolvedSccBackEdges', demand);
        return approximations.get(demand) || emptyPropertyFacet();
      }
      if (demands.has(demand)) {
        if (includeValues) bump('resolvedSccBackEdges', demand);
        return approximations.get(demand) || emptyPropertyFacet();
      }
      demands.add(demand);
      try {
        let state = source.intrinsicKeys?.has(key)
          ? {
            ...emptyPropertyFacet(),
            locallyWritten: true,
            mayPresent: true,
            mayAbsent: false,
          }
          : emptyPropertyFacet();
        const nextSeen = new Set(seenLocals).add(token);
        const steps = [
          ...orderedOverlaySteps(source, flowContexts),
          ...contextualHeapStepsFor(token, key),
        ].sort((left, right) => compareExecutionOrder(
          left.executionOrder,
          right.executionOrder,
        ));
        for (const step of steps) {
          const visibility = step.mutation
            ? mutationVisibility(step, flowContexts)
            : 'definite';
          if (visibility === 'none') continue;
          const optionalMutation = visibility === 'maybe';
          if (step.kind === 'delete') {
            if (step.key === key) {
              state = optionalMutation
                ? { ...state, mayAbsent: true, missingLocal: true }
                : emptyPropertyFacet();
            }
            continue;
          }
          if (step.kind === 'dynamicDelete') {
            // Computed cells are folded once below so repeated writes/deletes
            // retain their key correlation instead of acting as independent
            // optional aliases to every named property.
            continue;
          }
          let incoming;
          if (step.kind === 'field') {
            if (step.key !== key) continue;
            const values = includeValues
              ? (step.heapEffect
                ? step.valueTokens
                : contextualizeTokens(
                  instantiateViewTokens(
                    evaluation.instantiator,
                    materializeLocalField(source, step.fieldId, step, new Set([token])),
                  ),
                  flowContexts,
                ))
              : EMPTY;
            if (step.assignment === 'coalesce' || step.assignment === 'or') {
              const priorState = state;
              state = {
                values: union(state.values, values),
                presentRecords: state.presentRecords,
                absentRecords: EMPTY,
                missingLocal: false,
                locallyWritten: true,
                mayPresent: true,
                mayAbsent: false,
              };
              if (optionalMutation) state = {
                ...state,
                absentRecords: priorState.absentRecords,
                missingLocal: priorState.missingLocal || priorState.mayAbsent,
                mayAbsent: priorState.mayAbsent,
              };
              continue;
            }
            if (step.assignment === 'and') {
              state = {
                ...state,
                values: union(state.values, values),
                locallyWritten: true,
              };
              continue;
            }
            incoming = {
              ...emptyPropertyFacet(),
              values: step.assignment === 'compound' ? EMPTY : values,
              locallyWritten: true,
              mayPresent: true,
              mayAbsent: false,
            };
          } else if (step.kind === 'dynamic') {
            continue;
          } else if (step.kind === 'mappedSpread') {
            const presence = withSpreadTokens(
              step,
              evaluation,
              flowContexts,
              (spreadTokens) => propertyFacetForTokens(
                spreadTokens,
                key,
                nextSeen,
                includeValues && step.identityValue,
                false,
              ),
            );
            const mappedValues = includeValues && presence.mayPresent
              ? (step.identityValue
                ? presence.values
                : contextualizeTokens(
                  instantiateViewTokens(
                    evaluation.instantiator,
                    materializeLocalField(source, step.fieldId, step),
                  ),
                  flowContexts,
                ))
              : EMPTY;
            incoming = {
              ...presence,
              values: mappedValues,
              // Each source-present key is definitely written, but source
              // absence remains attributed to the enumerated source facet.
              locallyWritten: presence.mayPresent,
            };
          } else {
            if (step.preservedAccessorKeys?.has(key)) continue;
            incoming = withSpreadTokens(
              step,
              evaluation,
              flowContexts,
              (spreadTokens) => propertyFacetForTokens(
                  spreadTokens,
                  key,
                  nextSeen,
                  includeValues,
                  false,
                ),
            );
            if (step.unknownSource) {
              incoming = { ...incoming, mayPresent: true, mayAbsent: true };
            }
          }

          if (optionalMutation) incoming = {
            ...incoming,
            missingLocal: step.kind === 'dynamic' ? incoming.missingLocal : true,
            mayAbsent: true,
          };

          const retainPrior = incoming.mayAbsent;
          const priorMayAbsent = state.mayAbsent;
          state = {
            values: union(incoming.values, retainPrior ? state.values : EMPTY),
            presentRecords: union(
              incoming.presentRecords,
              retainPrior ? state.presentRecords : EMPTY,
            ),
            absentRecords: retainPrior && priorMayAbsent
              ? union(state.absentRecords, incoming.absentRecords)
              : EMPTY,
            missingLocal: retainPrior && priorMayAbsent
              ? state.missingLocal || incoming.missingLocal
              : false,
            locallyWritten: incoming.locallyWritten
              || (retainPrior && state.locallyWritten),
            mayPresent: incoming.mayPresent || (retainPrior && state.mayPresent),
            mayAbsent: retainPrior && priorMayAbsent,
          };
        }
        const targetDomain = literalKeyDomain(key);
        const cells = includeDynamicCells
          ? dynamicMutationCells(
            source,
            evaluation,
            flowContexts,
            new Set(),
            targetDomain,
            includeValues,
            steps.filter((step) => step.heapEffect),
            new Set([token]),
          )
          : new Map();
        const literalCell = cells.get(targetDomain);
        if (literalCell) {
          const mixed = literalCell.kind === 'mixed';
          const absent = literalCell.kind === 'absent';
          state = {
            ...state,
            values: includeValues ? literalCell.values : state.values,
            presentRecords: mixed ? state.presentRecords : EMPTY,
            absentRecords: mixed ? state.absentRecords : EMPTY,
            missingLocal: absent ? true : (mixed ? state.missingLocal : false),
            locallyWritten: true,
            mayPresent: !absent,
            mayAbsent: absent || mixed,
          };
        }
        for (const [domain, cell] of cells) {
          if (domain === targetDomain) continue;
          const mayNameTarget = domain === targetDomain
            || domain.startsWith('binding:') || domain.startsWith('family:')
            || domain.startsWith('unknown:');
          if (!mayNameTarget || cell.exclusions.has(targetDomain)) continue;
          const mayBeAbsent = cell.kind === 'absent' || cell.kind === 'mixed';
          state = {
            ...state,
            values: includeValues ? union(state.values, cell.values) : state.values,
            locallyWritten: true,
            mayPresent: state.mayPresent || cell.kind !== 'absent',
            mayAbsent: state.mayAbsent || mayBeAbsent,
            missingLocal: state.missingLocal || mayBeAbsent,
          };
        }
        // A concrete executed origin is the more precise writer identity for a
        // spread-derived miss. Keep syntax/local-object for genuinely local
        // absence, but do not duplicate the same miss against the empty target
        // of `Object.assign({}, executedRecord)`.
        if (state.absentRecords.size && !state.locallyWritten) {
          state.missingLocal = false;
        } else if (!state.mayPresent) {
          state.missingLocal = true;
        }
        const priorFacet = approximations.get(demand);
        if (!priorFacet || !samePropertyFacet(priorFacet, state)) {
          approximations.set(demand, state);
          const newestValue = [...state.values].at(-1);
          const newestPresent = [...state.presentRecords].at(-1);
          const newestAbsent = [...state.absentRecords].at(-1);
          noteApproximationGrowth(
            state.values,
            `growing a demanded local-property facet for ${heapTargetFamily(token)}.${key}`
              + ` with ${state.values.size} value token(s)`
              + `, ${state.presentRecords.size} present record(s)`
              + `, ${state.absentRecords.size} absent record(s)`
              + `, flags=${JSON.stringify([
                state.missingLocal,
                state.locallyWritten,
                state.mayPresent,
                state.mayAbsent,
              ])}`
              + (newestValue ? tokenStructureDiagnostic(newestValue) : '')
              + (newestPresent ? ` newestPresent:${tokenStructureDiagnostic(newestPresent)}` : '')
              + (newestAbsent ? ` newestAbsent:${tokenStructureDiagnostic(newestAbsent)}` : ''),
          );
        }
        if (includeValues) {
          localPropertyFacetCache.set(demand, { epoch: evaluationEpoch, facet: state });
        } else {
          localRecordFacetCache.set(demand, { pass: localRecordFacetPass, facet: state });
        }
        return state;
      } finally {
        demands.delete(demand);
      }
    }
    if (!isRecordToken(token)) return emptyPropertyFacet();
    const origin = origins[originOf(token)];
    const observed = Boolean(origin?.keys?.includes(key));
    const required = Boolean(origin?.requiredKeys?.includes(key));
    let values = EMPTY;
    if (includeValues && observed) {
      for (const descriptor of origin?.fields?.[key] || []) {
        values = union(values, tokensOfDescriptor(descriptor));
      }
    }
    return applyContextualHeapFacet(token, key, {
      values,
      presentRecords: observed ? new Set([token]) : EMPTY,
      absentRecords: required ? EMPTY : new Set([token]),
      missingLocal: false,
      locallyWritten: false,
      mayPresent: observed,
      mayAbsent: !required,
    }, includeValues);
  }

  function propertyFacetForTokens(
    tokens,
    key,
    seenLocals,
    includeValues,
    includeDynamicCells = true,
  ) {
    if (!tokens.size) return emptyPropertyFacet();
    const out = {
      values: EMPTY,
      presentRecords: EMPTY,
      absentRecords: EMPTY,
      missingLocal: false,
      locallyWritten: false,
      mayPresent: false,
      mayAbsent: false,
    };
    for (const token of tokens) {
      const facet = propertyFacetForToken(
        token,
        key,
        seenLocals,
        includeValues,
        includeDynamicCells,
      );
      out.values = union(out.values, facet.values);
      out.presentRecords = union(out.presentRecords, facet.presentRecords);
      out.absentRecords = union(out.absentRecords, facet.absentRecords);
      out.missingLocal ||= facet.missingLocal;
      out.locallyWritten ||= facet.locallyWritten;
      out.mayPresent ||= facet.mayPresent;
      out.mayAbsent ||= facet.mayAbsent;
    }
    return out;
  }

  /** Follow a named property on concrete origins or retain the operation on a
   * symbolic function parameter. A dictionary property is an id lookup, so it
   * yields the dictionary's value record rather than pretending the id is a
   * writer-owned schema key. */
  function readProperty(tokens, key, seenLocals = new Set()) {
    return propertyFacetForTokens(tokens, key, seenLocals, true).values;
  }

  /** Enumerate the finite part of an object's own-key surface. Unknown/dynamic
   * cells remain separate; fixed keys flow through the ordinary property facet
   * so spread/field overwrites use one ordered source of truth. */
  function enumerableKeysOfTokens(tokens, seen = new Set()) {
    const keys = new Set();
    const includeStepKeys = (steps, evaluation, flowContexts, nextSeen) => {
      for (const step of steps) {
        if (step.mutation && mutationVisibility(step, flowContexts) === 'none') continue;
        if ((step.kind === 'field' || step.kind === 'delete') && step.key != null) {
          keys.add(step.key);
          continue;
        }
        if (step.kind === 'dynamic' || step.kind === 'dynamicDelete') {
          for (const domain of mutationKeyDomains(step).domains) {
            if (domain.startsWith(KEY_LITERAL)) {
              keys.add(decodeURIComponent(domain.slice(KEY_LITERAL.length)));
            }
          }
          continue;
        }
        if (step.kind !== 'spread' && step.kind !== 'mappedSpread') continue;
        const spreadKeys = withSpreadTokens(
          step,
          evaluation,
          flowContexts,
          (spreadTokens) => enumerableKeysOfTokens(spreadTokens, nextSeen),
        );
        for (const key of spreadKeys) keys.add(key);
      }
    };
    for (const token of tokens) {
      if (isRecordToken(token)) {
        for (const key of origins[originOf(token)]?.keys || []) keys.add(key);
        includeStepKeys(contextualHeapStepsFor(token), null, new Map(), seen);
        continue;
      }
      if (!isLocalToken(token)) continue;
      const base = unflowToken(token);
      if (seen.has(base)) continue;
      const local = localRecords.get(base);
      const evaluation = local ? localEvaluationOf(local) : null;
      const source = evaluation?.source;
      if (!source) continue;
      const nextSeen = new Set(seen).add(base);
      for (const key of source.written) keys.add(key);
      const flowContexts = flowContextsOf(token);
      includeStepKeys([
        ...orderedOverlaySteps(source, flowContexts),
        ...contextualHeapStepsFor(token),
      ], evaluation, flowContexts, nextSeen);
    }
    return keys;
  }

  function unknownEnumerableValuesOfTokens(
    tokens,
    diagnosticSite = null,
    seen = new Set(),
  ) {
    let out = EMPTY;
    for (const token of tokens) {
      if (isSymbolicToken(token)) {
        out = union(out, new Set([symbolicValues(token)]));
        continue;
      }
      if (isArrayLikeToken(token)) {
        out = union(out, arrayElementTokens(token));
        continue;
      }
      if (isDictionaryToken(token)) {
        const value = asElem(token);
        if (value) out = union(out, new Set([value]));
        continue;
      }
      if (isRecordToken(token)) {
        const nextSeen = new Set(seen).add(token);
        for (const key of enumerableKeysOfTokens(new Set([token]), nextSeen)) {
          out = union(out, readProperty(new Set([token]), key));
        }
        for (const descriptor of origins[originOf(token)]?.dynamicValues || []) {
          out = union(out, tokensOfDescriptor(descriptor));
        }
        continue;
      }
      if (!isLocalToken(token)) continue;
      const base = unflowToken(token);
      if (seen.has(base)) continue;
      const local = localRecords.get(base);
      const evaluation = local ? localEvaluationOf(local) : null;
      const source = evaluation?.source;
      if (!source) continue;
      const nextSeen = new Set(seen).add(base);
      const flowContexts = flowContextsOf(token);
      for (const step of orderedOverlaySteps(source, flowContexts)) {
        if (step.mutation && mutationVisibility(step, flowContexts) === 'none') continue;
        if (step.kind !== 'spread' && step.kind !== 'mappedSpread') continue;
        if (step.kind === 'mappedSpread') {
          out = union(out, withSpreadTokens(
            step,
            evaluation,
            flowContexts,
            (spreadTokens) => (unknownEnumerableValuesOfTokens(
              spreadTokens,
              diagnosticSite,
              nextSeen,
            ).size
              ? contextualizeTokens(
                instantiateViewTokens(
                  evaluation.instantiator,
                  materializeLocalField(source, step.fieldId, step),
                ),
                flowContexts,
              )
              : EMPTY),
          ));
          continue;
        }
        out = union(out, withSpreadTokens(
          step,
          evaluation,
          flowContexts,
          (spreadTokens) => unknownEnumerableValuesOfTokens(
            spreadTokens,
            diagnosticSite,
            nextSeen,
          ),
        ));
      }
    }
    return out;
  }

  const cellState = (kind = 'absent', values = EMPTY, exclusions = new Set()) => ({
    kind,
    values,
    exclusions,
  });
  const cloneCellState = (state) => cellState(
    state.kind,
    new Set(state.values),
    new Set(state.exclusions),
  );
  const intersect = (left, right) => new Set([...left].filter((value) => right.has(value)));
  const joinCellStates = (left, right) => {
    if (!left) return cloneCellState(right);
    if (!right) return cloneCellState(left);
    const kind = left.kind === right.kind
      ? left.kind
      : (left.kind === 'absent' && right.kind === 'absent' ? 'absent' : 'mixed');
    return cellState(
      kind,
      union(left.values, right.values),
      intersect(left.exclusions, right.exclusions),
    );
  };
  const assignedCellState = (values) => cellState(
    values.size ? 'object' : 'primitive',
    values,
    new Set(),
  );
  const logicalCellState = (prior, assignment, values) => {
    const rhs = assignedCellState(values);
    if (assignment === 'and') {
      if (prior.kind === 'object') return rhs;
      if (prior.kind === 'absent') return prior;
      return joinCellStates(prior, rhs);
    }
    if (prior.kind === 'object') return prior;
    if (prior.kind === 'absent') return rhs;
    return joinCellStates(prior, rhs);
  };

  function dynamicCellsOfTokens(
    tokens,
    seen = new Set(),
    targetDomain = null,
    trackValues = true,
  ) {
    const cells = new Map();
    for (const token of tokens) {
      if (!isLocalToken(token)) continue;
      const base = unflowToken(token);
      if (seen.has(base)) continue;
      const local = localRecords.get(base);
      const evaluation = local ? localEvaluationOf(local) : null;
      const source = evaluation?.source;
      if (!source) continue;
      const additions = dynamicMutationCells(
        source,
        evaluation,
        flowContextsOf(token),
        seen,
        targetDomain,
        trackValues,
        [],
        new Set([token]),
      );
      for (const [domain, state] of additions) {
        cells.set(domain, joinCellStates(cells.get(domain), state));
      }
    }
    return cells;
  }

  function dynamicMutationCells(
    source,
    evaluation,
    flowContexts,
    seen = new Set(),
    targetDomain = null,
    trackValues = true,
    extraSteps = [],
    receiverTokens = EMPTY,
  ) {
    const sourceId = source.sourceToken || source;
    if (seen.has(sourceId)) return new Map();
    const nextSeen = new Set(seen).add(sourceId);
    const cells = new Map();
    const steps = [
      ...orderedOverlaySteps(source, flowContexts),
      ...extraSteps,
    ].sort((left, right) => compareExecutionOrder(
      left.executionOrder,
      right.executionOrder,
    ));
    for (const step of steps) {
      const visibility = mutationVisibility(step, flowContexts);
      if (visibility === 'none') continue;
      if (step.kind === 'field' || step.kind === 'delete') {
        const domain = literalKeyDomain(step.key);
        const definitelyWrites = visibility === 'definite' && (
          step.kind === 'delete'
          || step.assignment == null
          || step.assignment === 'replace'
          || step.assignment === 'compound'
        ) || Boolean(step.preservesPresence);
        if (definitelyWrites) for (const [cellDomain, state] of cells) {
          if (cellDomain !== domain && !cellDomain.startsWith(KEY_LITERAL)) {
            const exclusions = new Set(state.exclusions).add(domain);
            cells.set(cellDomain, cellState(state.kind, state.values, exclusions));
          }
        }
        if (targetDomain && domain !== targetDomain && !cells.has(domain)) continue;
        const prior = cells.get(domain) || cellState();
        let incoming;
        if (step.kind === 'delete') {
          incoming = cellState();
        } else if (step.assignment === 'compound') {
          incoming = cellState('primitive', EMPTY, new Set());
        } else {
          const values = trackValues
            ? (step.heapEffect ? step.valueTokens : contextualizeTokens(
              instantiateViewTokens(
                evaluation.instantiator,
                materializeLocalField(
                  source,
                  step.fieldId,
                  step.mutation ? step : null,
                  receiverTokens,
                ),
              ),
              flowContexts,
            ))
            : EMPTY;
          incoming = step.assignment === 'coalesce' || step.assignment === 'or'
            || step.assignment === 'and'
            ? logicalCellState(prior, step.assignment, values)
            : assignedCellState(values);
        }
        cells.set(domain, visibility === 'maybe'
          ? joinCellStates(prior, incoming)
          : incoming);
        continue;
      }
      if (step.kind === 'spread') {
        withSpreadTokens(step, evaluation, flowContexts, (spreadTokens) => {
          if (visibility === 'definite') for (const [domain, state] of cells) {
          if (!domain.startsWith(KEY_LITERAL)) continue;
          const key = decodeURIComponent(domain.slice(KEY_LITERAL.length));
          if (step.preservedAccessorKeys?.has(key)) continue;
          const facet = propertyFacetForTokens(
            spreadTokens,
            key,
            new Set(),
            false,
            false,
          );
          if (facet.mayPresent && !facet.mayAbsent) cells.set(domain, cellState());
          else cells.set(domain, state);
          }
          const spreadKeys = enumerableKeysOfTokens(spreadTokens);
          if (visibility === 'definite') {
          for (const key of spreadKeys) {
            if (step.preservedAccessorKeys?.has(key)) continue;
            const domain = literalKeyDomain(key);
            const facet = propertyFacetForTokens(
              spreadTokens,
              key,
              new Set(),
              false,
              false,
            );
            if (!facet.mayPresent || facet.mayAbsent) continue;
            for (const [cellDomain, state] of cells) {
              if (!cellDomain.startsWith(KEY_LITERAL)) {
                cells.set(cellDomain, cellState(
                  state.kind,
                  state.values,
                  new Set(state.exclusions).add(domain),
                ));
              }
            }
          }
          }
          for (const key of spreadKeys) {
          if (step.preservedAccessorKeys?.has(key)) continue;
          const domain = literalKeyDomain(key);
          if (targetDomain && domain !== targetDomain) continue;
          const facet = propertyFacetForTokens(
            spreadTokens,
            key,
            new Set(),
            trackValues,
            false,
          );
          if (!facet.mayPresent) continue;
          const incoming = assignedCellState(facet.values);
          const prior = cells.get(domain) || cellState();
          cells.set(domain, visibility === 'definite' && !facet.mayAbsent
            ? incoming
            : joinCellStates(prior, incoming));
          }
          for (const [domain, incoming] of dynamicCellsOfTokens(
            spreadTokens,
            nextSeen,
            targetDomain,
            trackValues,
          )) {
          if (domain.startsWith(KEY_LITERAL)) {
            const key = decodeURIComponent(domain.slice(KEY_LITERAL.length));
            if (step.preservedAccessorKeys?.has(key)) continue;
          }
          // Object spread/Object.assign copy only enumerable properties. An
          // absent source cell is a no-op, not a deletion of the destination;
          // a mixed cell may also be absent and therefore retains the prior.
          if (incoming.kind === 'absent') continue;
          const prior = cells.get(domain) || cellState();
          cells.set(domain, visibility === 'definite' && incoming.kind !== 'mixed'
            ? cloneCellState(incoming)
            : joinCellStates(prior, incoming));
          }
        });
        continue;
      }
      if (step.kind !== 'dynamic' && step.kind !== 'dynamicDelete') continue;
      const { domains, definite } = mutationKeyDomains(step);
      const optional = visibility === 'maybe' || !definite;
      let values = EMPTY;
      if (trackValues && step.kind === 'dynamic' && step.assignment !== 'compound') {
        values = step.heapEffect ? step.valueTokens : contextualizeTokens(
          instantiateViewTokens(
            evaluation.instantiator,
            materializeLocalField(
              source,
              step.fieldId,
              step.mutation ? step : null,
              receiverTokens,
            ),
          ),
          flowContexts,
        );
      }
      for (const domain of domains) {
        if (targetDomain && domain.startsWith(KEY_LITERAL) && domain !== targetDomain) continue;
        const prior = cells.get(domain) || cellState();
        let next;
        if (step.kind === 'dynamicDelete') {
          next = optional ? joinCellStates(prior, cellState()) : cellState();
        } else if (step.assignment === 'compound') {
          const primitive = cellState('primitive', EMPTY, new Set());
          next = optional ? joinCellStates(prior, primitive) : primitive;
        } else if (step.assignment === 'replace') {
          const assigned = assignedCellState(values);
          next = optional ? joinCellStates(prior, assigned) : assigned;
        } else {
          const logical = logicalCellState(prior, step.assignment, values);
          next = optional ? joinCellStates(prior, logical) : logical;
        }
        cells.set(domain, next);
      }
    }
    return cells;
  }

  function dynamicMutationValues(
    source,
    evaluation,
    flowContexts,
    extraSteps = [],
    receiverTokens = EMPTY,
  ) {
    let out = EMPTY;
    for (const state of dynamicMutationCells(
      source,
      evaluation,
      flowContexts,
      new Set(),
      null,
      true,
      extraSteps,
      receiverTokens,
    ).values()) {
      out = union(out, state.values);
    }
    return out;
  }

  /** A literal string on a record is a property transition. Every other record
   * element access is unknown; only proven arrays/dictionaries yield elements. */
  function readElement(tokens, literalKey = null, diagnosticSite = null, seenLocals = new Set()) {
    let out = EMPTY;
    for (const token of tokens) {
      if (isSymbolicToken(token)) {
        out = union(out, new Set([
          literalKey == null ? symbolicElement(token) : symbolicProperty(token, literalKey),
        ]));
        continue;
      }
      if (isRecordToken(token)) {
        if (literalKey != null) out = union(out, readProperty(new Set([token]), literalKey));
        else {
          const dynamic = unknownEnumerableValuesOfTokens(
            new Set([token]), diagnosticSite, seenLocals,
          );
          if (dynamic.size) out = union(out, dynamic);
          else bump('computedRecordUnknown', diagnosticSite);
        }
        continue;
      }
      if (isArrayLikeToken(token)) {
        out = union(out, literalKey == null
          ? arrayElementTokens(token)
          : readProperty(new Set([token]), literalKey));
        continue;
      }
      if (isLocalToken(token)) {
        if (seenLocals.has(token)) {
          bump('cycleCuts', `local-element:${token}:${literalKey ?? '*'}`);
          continue;
        }
        const local = localRecords.get(unflowToken(token));
        if (!local) continue;
        const evaluation = localEvaluationOf(local);
        const source = evaluation.source;
        const flowContexts = flowContextsOf(token);
        if (!source) continue;
        const demand = `${token}|e:${literalKey == null ? '*' : encodeURIComponent(literalKey)}`;
        if (localElementDemands.has(demand)) {
          bump('cycleCuts', demand);
          continue;
        }
        localElementDemands.add(demand);
        try {
          if (literalKey != null) {
            out = union(out, readProperty(
              new Set([token]), literalKey, seenLocals,
            ));
          } else {
            const nextSeen = new Set(seenLocals).add(token);
            // An unknown key can select any explicit syntax-owned field, any
            // unknown-key mutation, or any traversable field supplied by a
            // spread. Resolve each statically known key through the same
            // ordered overlay facet as a named property read so a definite
            // replacement/delete does not leak the constructor's stale value
            // into Object.values or a dynamic-key traversal.
            const steps = [
              ...orderedOverlaySteps(source, flowContexts),
              ...contextualHeapStepsFor(token),
            ].sort((left, right) => compareExecutionOrder(
              left.executionOrder,
              right.executionOrder,
            ));
            const knownKeys = new Set(source.written);
            for (const step of steps) {
              if (step.kind === 'field' && step.key != null) knownKeys.add(step.key);
            }
            for (const step of steps) {
              if (step.kind !== 'spread' && step.kind !== 'mappedSpread'
                || (step.mutation && mutationVisibility(step, flowContexts) === 'none')) continue;
              const spreadKeys = withSpreadTokens(
                step,
                evaluation,
                flowContexts,
                (spreadTokens) => enumerableKeysOfTokens(spreadTokens),
              );
              for (const key of spreadKeys) knownKeys.add(key);
            }
            for (const key of knownKeys) {
              out = union(out, readProperty(new Set([token]), key));
            }
            out = union(out, dynamicMutationValues(
              source,
              evaluation,
              flowContexts,
              contextualHeapStepsFor(token),
              new Set([token]),
            ));
            for (const step of steps) {
              if (step.mutation && mutationVisibility(step, flowContexts) === 'none') continue;
              if (step.kind === 'spread' || step.kind === 'mappedSpread') {
                if (step.kind === 'mappedSpread') {
                  out = union(out, withSpreadTokens(
                    step,
                    evaluation,
                    flowContexts,
                    (spreadTokens) => (unknownEnumerableValuesOfTokens(
                      spreadTokens,
                      diagnosticSite,
                      nextSeen,
                    ).size
                      ? contextualizeTokens(
                        instantiateViewTokens(
                          evaluation.instantiator,
                          materializeLocalField(source, step.fieldId, step),
                        ),
                        flowContexts,
                      )
                      : EMPTY),
                  ));
                  continue;
                }
                out = union(out, withSpreadTokens(
                  step,
                  evaluation,
                  flowContexts,
                  (spreadTokens) => unknownEnumerableValuesOfTokens(
                    spreadTokens,
                    diagnosticSite,
                    nextSeen,
                  ),
                ));
              }
            }
          }
        } finally {
          localElementDemands.delete(demand);
        }
        continue;
      }
      const element = asElem(token);
      if (element) out = union(out, new Set([element]));
    }
    return out;
  }

  function recordsForReadOnce(tokens, key, seen) {
    const records = new Set();
    let knownContainer = false;
    let locallyWritten = false;
    let missingLocal = false;
    for (const token of tokens) {
      if (isRecordToken(token)) {
        knownContainer = true;
        const facet = propertyFacetForToken(token, key, seen, false);
        for (const record of facet.presentRecords) records.add(record);
        for (const record of facet.absentRecords) records.add(record);
        locallyWritten ||= facet.locallyWritten;
        missingLocal ||= facet.missingLocal;
      } else if (isLocalToken(token)) {
        knownContainer = true;
        const facet = propertyFacetForToken(token, key, seen, false);
        for (const record of facet.presentRecords) records.add(record);
        for (const record of facet.absentRecords) records.add(record);
        locallyWritten ||= facet.locallyWritten;
        missingLocal ||= facet.missingLocal;
      } else if (isArrayLikeToken(token) || isDictionaryToken(token)) {
        knownContainer = true;
      }
    }
    return { records, knownContainer, locallyWritten, missingLocal };
  }

  /** Local views form a graph, not a tree: mutation pipelines can feed an
   * overlay back through many call sites before reaching the same executed
   * origin. Memoize one demanded-key facet per token/pass so classification is
   * linear in that graph. Instantiating a previously unseen call view is itself
   * monotone state growth, so replay the pass until no view approximation grows. */
  function recordsForRead(tokens, key, seen = new Set()) {
    for (let pass = 1; pass <= 128; pass += 1) {
      evaluationEpoch += 1;
      localRecordFacetPass += 1;
      const before = approximationVersion;
      const out = recordsForReadOnce(tokens, key, seen);
      if (approximationVersion === before) return out;
    }
    throw new Error(`reader-shape record facets did not stabilize for ${key} in 128 passes`);
  }

  const functionApprox = new Map();
  const functionsEvaluating = new Set();
  const functionEpoch = new Map();
  const functionVersionIntern = new Map();
  const bindingApprox = new Map();
  const bindingsEvaluating = new Set();
  const bindingEpoch = new Map();
  const paramApprox = new Map();
  const paramsEvaluating = new Set();
  const paramEpoch = new Map();
  const keyBindingApprox = new Map();
  const keyBindingsEvaluating = new Set();
  const keyBindingEpoch = new Map();
  const keyParamApprox = new Map();
  const keyParamsEvaluating = new Set();
  const keyParamEpoch = new Map();
  const recursiveCallApprox = new Map();
  const recursiveCallsEvaluating = new Map();
  const recursiveCallEpoch = new Map();
  /** Functions whose RETURN is currently being analysed, mapped from exact
   * parameter bindings to their symbolic roots. Binding identity (not spelling)
   * preserves destructured parameters and nested same-name functions. Callers
   * instantiate the full path afterwards, so one caller never lends another its
   * origin. */
  const sentinelFrames = new Map();
  const THIS_SENTINEL = Symbol('reader-shape-this');

  const arrayProducerOf = (node, file, kind) => ({
    kind,
    id: sha256(JSON.stringify([
      'array-allocation-product-v2',
      kind,
      file,
      node.pos,
      node.end,
    ])),
  });

  /** Object.values can read a literal precisely through a lexical alias only
   * when that alias denotes exactly one immutable constructor. Any projection,
   * fallback, alternate initializer, binding write, alias cycle, or property
   * mutation returns to the ordinary flow-sensitive local resolver. */
  const immutableObjectLiteralOf = (expression, seen = new Set()) => {
    const value = unwrap(expression);
    if (ts.isObjectLiteralExpression(value)) {
      if ((idx.localMutations.get(value) || []).length) return null;
      return { literal: value, file: value.getSourceFile().fileName };
    }
    if (!ts.isIdentifier(value)) return null;
    const binding = idx.bindingOf(value);
    if (!binding || seen.has(binding)
      || binding.k !== 'expr'
      || binding.projection?.length
      || binding.writes?.length
      || binding.fallbacks?.length
      || binding.additionalInitializers?.length
      || !binding.node) return null;
    const nextSeen = new Set(seen);
    nextSeen.add(binding);
    return immutableObjectLiteralOf(binding.node, nextSeen);
  };

  const lookupBinding = (identifier) => idx.bindingOf(identifier);
  const isUnshadowedGlobal = (expression, name) => {
    return idx.isIntrinsicGlobal(expression, name);
  };
  const isRuntimeUndefined = (expression) => {
    if (!expression) return true;
    const value = unwrap(expression);
    if (ts.isVoidExpression(value)) return true;
    return ts.isIdentifier(value) && value.text === 'undefined' && !lookupBinding(value);
  };
  /** JavaScript applies a parameter initializer to omission and to an actual
   * undefined value. Keep this one decision shared by symbolic instantiation,
   * recursive frames, and direct object/key parameter inference. A lexically
   * shadowed identifier named `undefined` remains an ordinary argument. */
  const effectiveArgument = (args, index, parameter, callFile, declarationFile) => {
    const supplied = args[index];
    if (supplied && !isRuntimeUndefined(supplied)) {
      return { expression: supplied, file: callFile };
    }
    if (parameter?.initializer) {
      return { expression: parameter.initializer, file: declarationFile };
    }
    return null;
  };
  const flatDepthDescriptor = (expression) => {
    if (!expression || isRuntimeUndefined(expression)) return 1;
    const expressionValue = unwrap(expression);
    if (ts.isIdentifier(expressionValue) && expressionValue.text === 'Infinity'
      && !lookupBinding(expressionValue)) return Number.POSITIVE_INFINITY;
    const literal = staticNumericValue(expression);
    if (literal != null) return normalizedFlatDepth(literal);
    const value = unwrap(expression);
    if (ts.isIdentifier(value)) {
      const binding = lookupBinding(value);
      if (binding?.k === 'param' && !(binding.writes || []).length) {
        return `p:${binding.index}`;
      }
      if (binding?.k === 'expr' && binding.node && !(binding.writes || []).length
        && !binding.projection?.length && !binding.fallbacks?.length
        && !binding.additionalInitializers?.length) {
        const bound = staticNumericValue(binding.node);
        if (bound != null) return normalizedFlatDepth(bound);
      }
    }
    return 'u';
  };
  const flatDepthAtCall = (descriptor, call, file, target) => {
    if (typeof descriptor === 'number') return descriptor;
    if (!descriptor.startsWith('p:')) return null;
    const index = Number(descriptor.slice(2));
    const effective = effectiveArgument(
      call.arguments,
      index,
      target?.fn?.parameters?.[index],
      file,
      target?.file || file,
    );
    if (!effective) return 1;
    const value = staticNumericValue(effective.expression);
    return value == null ? null : normalizedFlatDepth(value);
  };
  const applyFlatDepth = (tokens, levels) => {
    let out = EMPTY;
    for (const token of tokens) {
      if (levels == null) out = union(out, flattenArrayAlternatives(token));
      else {
        const flattened = flattenArrayToken(token, levels);
        if (flattened) out = union(out, new Set([flattened]));
      }
    }
    return out;
  };
  const mergeApproximation = (map, subject, addition) => {
    const prior = map.get(subject) || EMPTY;
    const next = union(prior, addition);
    if (next.size !== prior.size) {
      map.set(subject, next);
      noteApproximationGrowth(addition, 'merging an abstract resolver state');
    }
    return next;
  };

  const functionContextId = (fn) => (
    `${fn.getSourceFile().fileName}:${fn.pos}:${fn.end}`
  );
  const functionVersionOf = (fn) => {
    const signature = cutoffSignatureOf();
    let versions = functionVersionIntern.get(fn);
    if (!versions) { versions = new Map(); functionVersionIntern.set(fn, versions); }
    let version = versions.get(signature);
    if (!version) {
      version = { fn, signature };
      versions.set(signature, version);
    }
    return version;
  };
  const functionVersionContextId = (version) => (
    `${functionContextId(version.fn)}:${version.signature}`
  );
  const bindingContextId = (binding) => JSON.stringify([
    binding.k,
    binding.file,
    binding.index ?? null,
    binding.prop ?? null,
    binding.node?.pos ?? null,
  ]);

  /**
   * One mutable identifier is a sequence of program-point versions, not one
   * whole-function bag. A read sees ordinary writes that completed before it;
   * a write inside a loop is also visible earlier in that loop body because a
   * prior iteration may have executed it. The visible-write signature interns
   * equivalent cutoffs so caches stay proportional to actual versions rather
   * than identifier count.
   */
  const bindingVersionIntern = new Map();
  const contextAt = (node, file) => ({
    file,
    pos: node.pos,
    owner: flowOwnerOf(node),
    delay: suspensionRangeAt(node),
    resume: suspensionRangeAt(node, 'yield'),
  });
  const cutoffForWrite = (write, context) => {
    if (write.site?.file === context.file && write.site.owner === context.owner) return context;
    const inherited = write.site ? activeCutoffs.get(flowContextId(write.site)) : null;
    if (inherited) return inherited;
    return null;
  };
  const writeVisibleAt = (write, context) => {
    if (!write.site) return true;
    const cutoff = cutoffForWrite(write, context);
    if (!cutoff) return true; // Escaped/externally invoked owners remain conservative.
    if (write.site.loop) return cutoff.pos >= write.site.loop.pos;
    return write.site.end <= cutoff.pos;
  };
  const recursiveBackedgeAfter = (site) => {
    const owner = site?.owner;
    const component = owner ? idx.recursiveComponentOf.get(owner) : null;
    if (!component) return false;
    for (const target of idx.callGraph.get(owner) || []) {
      if (idx.recursiveComponentOf.get(target) !== component) continue;
      const sites = [
        ...(idx.callSites.get(target) || []),
        ...(idx.elementCallSites.get(target) || []),
      ];
      if (sites.some((callSite) => {
        const call = callSite.site || {
          end: callSite.call.end,
          owner: flowOwnerOf(callSite.call),
        };
        return call.owner === owner && call.end > site.end;
      })) return true;
    }
    return false;
  };
  const compareExecutionOrder = (left, right) => {
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      if (left[index] == null) return -1;
      if (right[index] == null) return 1;
      if (left[index] !== right[index]) return left[index] - right[index];
    }
    return 0;
  };
  const writeOccurrencesAt = (write, context) => {
    if (!write.site) return [{
      ...write,
      executionId: `${write.id}:unknown`,
      executionOrder: [write.node?.pos ?? 0],
      executionCutoffs: activeCutoffs,
    }];
    const cutoff = cutoffForWrite(write, context);
    if (cutoff) {
      const directlyVisible = writeVisibleAt(write, context);
      const recursiveBackedge = !directlyVisible
        && write.site.owner === context.owner
        && recursiveBackedgeAfter(write.site);
      if (!directlyVisible && !recursiveBackedge) return [];
      const executionContext = {
        file: write.site.file,
        pos: write.site.pos,
        owner: write.site.owner,
      };
      return [{
        ...write,
        site: recursiveBackedge
          ? { ...write.site, optional: true, recursiveBackedge: true }
          : write.site,
        executionId: `${write.id}:${recursiveBackedge ? 'recursive' : 'direct'}:${cutoff.pos}`,
        executionOrder: [write.site.end],
        executionCutoffs: withAddedCutoff(activeCutoffs, executionContext),
      }];
    }
    if (ts.isFunctionLike(write.site.owner)) {
      const events = invocationEventsBefore(write.site.owner);
      if (!events.length) {
        const indexedSites = [
          ...(idx.callSites.get(write.site.owner) || []),
          ...(idx.elementCallSites.get(write.site.owner) || []),
        ];
        if (indexedSites.length) return [];
        if (!idx.escapedFunctions.has(write.site.owner)) return [];
        const executionContext = {
          file: write.site.file,
          pos: write.site.pos,
          owner: write.site.owner,
        };
        // Getter/setter bodies and escaped callbacks can execute without a
        // source-level call site. Model that boundary as an optional write so
        // the resolver remains sound without pretending to know its order.
        return [{
          ...write,
          site: { ...write.site, optional: true, escapedInvocation: true },
          executionId: `${write.id}:escaped`,
          executionOrder: [write.site.end],
          executionCutoffs: withAddedCutoff(activeCutoffs, executionContext),
        }];
      }
      return events.flatMap((event) => {
        const timing = suspendedEffectVisibility(write.site, event);
        if (timing === 'none') return [];
        const executionContext = {
          file: write.site.file,
          pos: write.site.pos,
          owner: write.site.owner,
        };
        return [{
          ...write,
          site: {
            ...write.site,
            optional: Boolean(
              write.site.optional || event.optional || timing === 'maybe'
            ),
          },
          executionId: `${write.id}:call:${event.id}`,
          executionOrder: [...event.order, write.site.end],
          executionCutoffs: withAddedCutoff(event.cutoffs, executionContext),
          executionCallChain: event.callChain,
        }];
      });
    }
    // Module/source-owner writes execute during module evaluation before entry
    // helpers can be called. Unknown non-function owners remain an optional
    // alternative rather than an unconditional replacement.
    return [{
      ...write,
      site: { ...write.site, optional: true },
      executionId: `${write.id}:module`,
      executionOrder: [write.site.end],
      executionCutoffs: activeCutoffs,
    }];
  };
  const invocationFrameFor = (entry, depth) => {
    const { fn, callSite } = entry;
    const frame = new Map();
    const isElementSite = Boolean(callSite.receiver);
    let callbackElements = EMPTY;
    if (isElementSite) {
      callbackElements = readElement(
        resolve(callSite.receiver, callSite.file, depth + 1),
        null,
        siteOf(callSite.call, callSite.file),
      );
    }
    if (callSite.thisSource) {
      frame.set(THIS_SENTINEL, {
        objects: resolve(callSite.thisSource, callSite.file, depth + 1),
        keys: new Set([KEY_UNKNOWN]),
      });
    }
    fn.parameters?.forEach((parameter, index) => {
      const explicitSources = !isElementSite
        ? callSite.argumentSources?.get(index)
        : null;
      const effective = isElementSite || explicitSources
        ? null
        : effectiveArgument(
          callSite.args || [],
          index,
          parameter,
          callSite.file,
          fn.getSourceFile().fileName,
        );
      const expression = effective?.expression;
      const argumentFile = effective?.file || callSite.file;
      let objects = isElementSite
        ? (index === 0 ? callbackElements : EMPTY)
        : EMPTY;
      let keys = !isElementSite && expression
        ? resolveKeyDomain(expression, argumentFile, depth + 1)
        : new Set([KEY_UNKNOWN]);
      if (explicitSources) {
        keys = EMPTY;
        for (const source of explicitSources) {
          objects = union(objects, resolve(source, callSite.file, depth + 1));
          keys = union(keys, resolveKeyDomain(source, callSite.file, depth + 1));
        }
        if (!keys.size) keys = new Set([KEY_UNKNOWN]);
      } else if (!isElementSite && expression) {
        objects = resolve(expression, argumentFile, depth + 1);
      }
      if (ts.isIdentifier(parameter.name)) {
        const binding = lookupBinding(parameter.name);
        if (binding) frame.set(binding, { objects, keys });
      } else if (ts.isObjectBindingPattern(parameter.name)) {
        for (const element of parameter.name.elements) {
          if (element.dotDotDotToken || !ts.isIdentifier(element.name)) continue;
          const binding = lookupBinding(element.name);
          const propNode = element.propertyName || element.name;
          if (!binding || !(ts.isIdentifier(propNode) || ts.isStringLiteral(propNode)
            || ts.isNumericLiteral(propNode))) continue;
          const prop = propNode.text;
          frame.set(binding, {
            objects: readProperty(objects, prop),
            keys: expression
              ? objectLiteralKeyDomain(expression, prop, argumentFile, depth + 1)
              : new Set([KEY_UNKNOWN]),
          });
        }
      } else if (ts.isArrayBindingPattern(parameter.name)) {
        for (const element of parameter.name.elements) {
          if (!ts.isBindingElement(element) || !ts.isIdentifier(element.name)) continue;
          const binding = lookupBinding(element.name);
          if (binding) frame.set(binding, {
            objects: readElement(objects, null, siteOf(callSite.call, callSite.file)),
            keys: new Set([KEY_UNKNOWN]),
          });
        }
      }
    });
    return frame;
  };
  const withEffectExecution = (effect, depth, evaluate) => {
    const priorContext = currentReadContext;
    const priorCutoffs = activeCutoffs;
    const priorEffectCallChain = activeEffectCallChain;
    const priorFrames = [];
    const effectSite = effect.site || effect.mutationSite;
    currentReadContext = {
      file: effectSite?.file || effect.file,
      pos: effectSite?.pos ?? effect.node?.pos ?? 0,
      owner: effectSite?.owner || flowOwnerOf(effect.node),
      delay: effectSite?.delay || ZERO_DELAY,
      resume: effectSite?.resume || ZERO_DELAY,
    };
    activeCutoffs = effect.executionCutoffs || priorCutoffs;
    activeEffectCallChain = effect.executionCallChain?.length
      ? effect.executionCallChain
      : priorEffectCallChain;
    try {
      for (const entry of effect.executionCallChain || []) {
        priorFrames.push([entry.fn, sentinelFrames.get(entry.fn)]);
        sentinelFrames.set(entry.fn, invocationFrameFor(entry, depth + 1));
      }
      return evaluate();
    } finally {
      for (const [fn, frame] of priorFrames.reverse()) {
        if (frame) sentinelFrames.set(fn, frame);
        else sentinelFrames.delete(fn);
      }
      activeCutoffs = priorCutoffs;
      activeEffectCallChain = priorEffectCallChain;
      currentReadContext = priorContext;
    }
  };
  const bindingVersionOf = (binding, node, file) => {
    const context = contextAt(node, file);
    const initialVisible = Boolean(
      (binding.node || binding.additionalInitializers?.length)
      && (!binding.definitionSite || writeVisibleAt({ site: binding.definitionSite }, context))
    );
    const writes = (binding.writes || [])
      .flatMap((write) => writeOccurrencesAt(write, context))
      .sort((left, right) => (
        compareExecutionOrder(left.executionOrder, right.executionOrder)
        || left.file.localeCompare(right.file)
        || (left.site?.pos ?? 0) - (right.site?.pos ?? 0)
      ));
    const cutoffSignature = cutoffSignatureOf();
    const signature = JSON.stringify([
      cutoffSignature,
      initialVisible,
      writes.map((write) => write.executionId || write.id || `${write.file}:${write.node?.pos}`),
    ]);
    let versions = bindingVersionIntern.get(binding);
    if (!versions) { versions = new Map(); bindingVersionIntern.set(binding, versions); }
    let version = versions.get(signature);
    if (!version) {
      version = {
        binding,
        initialVisible,
        writes,
        signature,
        cutoffSignature,
        hasLoopBackEdge: writes.some((write) => Boolean(
          write.site?.loop || write.site?.recursiveBackedge,
        )),
      };
      versions.set(signature, version);
    }
    return version;
  };
  const noteMutableBindingScc = (version, kind) => {
    if (!version.hasLoopBackEdge) return;
    bump(
      'mutableBindingSccBackEdges',
      `${kind}:${bindingContextId(version.binding)}:${version.signature}`,
    );
    if (currentReadBudget) currentReadBudget.sawMutableBindingScc = true;
  };

  const applyProjection = (tokens, projection, diagnosticSite = null) => {
    let out = tokens;
    for (const step of projection || []) {
      out = step.kind === 'property'
        ? readProperty(out, step.key)
        : readElement(out, null, diagnosticSite);
      if (!out.size) break;
    }
    return out;
  };
  const resolveProjectedValue = (node, file, projection, fallbacks, depth) => {
    let out = node
      ? applyProjection(resolve(node, file, depth + 1), projection, siteOf(node, file))
      : EMPTY;
    for (const fallback of fallbacks || []) {
      out = union(out, resolve(fallback, file, depth + 1));
    }
    return out;
  };
  const resolveProjectedKey = (node, file, projection, fallbacks, depth) => {
    let out = !projection?.length && node
      ? resolveKeyDomain(node, file, depth + 1)
      : EMPTY;
    for (const fallback of fallbacks || []) {
      out = union(out, resolveKeyDomain(fallback, file, depth + 1));
    }
    return out.size ? out : new Set([KEY_UNKNOWN]);
  };

  /** Capture the exact symbolic/concrete parameter frame in which an object
   * literal was declared. Field initializers are evaluated only on demand, so
   * replaying this frame is what prevents a later caller from lending the field
   * a different parameter origin. The JSON key deduplicates identical frames
   * across fixed-point rounds; the cloned sets remain immutable snapshots. */
  function captureLocalFieldContext(cutoffs = activeCutoffs) {
    const frames = new Map();
    const frameRows = [];
    for (const [fn, frame] of sentinelFrames) {
      const cloned = new Map();
      const bindings = [];
      for (const [binding, state] of frame) {
        const objects = new Set(state.objects || EMPTY);
        const keys = new Set(state.keys || EMPTY);
        cloned.set(binding, { objects, keys });
        bindings.push([
          bindingContextId(binding),
          [...objects].sort(),
          [...keys].sort(),
        ]);
      }
      bindings.sort(([a], [b]) => a.localeCompare(b));
      frames.set(fn, cloned);
      frameRows.push([functionContextId(fn), bindings]);
    }
    frameRows.sort(([a], [b]) => a.localeCompare(b));
    const evaluatingFunctions = new Set(functionsEvaluating);
    const evaluatingRows = [...evaluatingFunctions].map(functionVersionContextId).sort();
    return {
      key: JSON.stringify([frameRows, evaluatingRows, cutoffSignatureOf(cutoffs)]),
      frames,
      evaluatingFunctions,
      cutoffs,
    };
  }

  function captureLocalFieldContextAt(node, file) {
    const operation = {
      file,
      pos: node.end,
      owner: flowOwnerOf(node),
      delay: suspensionRangeAt(node),
      resume: suspensionRangeAt(node, 'yield'),
    };
    return captureLocalFieldContext(withAddedCutoff(activeCutoffs, operation));
  }

  function withLocalFieldContext(context, evaluate, cutoffs = context.cutoffs) {
    const priorFrames = [...sentinelFrames];
    const priorFunctions = [...functionsEvaluating];
    const priorCutoffs = activeCutoffs;
    sentinelFrames.clear();
    functionsEvaluating.clear();
    for (const [fn, frame] of context.frames) sentinelFrames.set(fn, frame);
    for (const version of context.evaluatingFunctions) functionsEvaluating.add(version);
    activeCutoffs = cutoffs;
    try {
      return evaluate();
    } finally {
      activeCutoffs = priorCutoffs;
      sentinelFrames.clear();
      functionsEvaluating.clear();
      for (const [fn, frame] of priorFrames) sentinelFrames.set(fn, frame);
      for (const version of priorFunctions) functionsEvaluating.add(version);
    }
  }

  /** Resolve one syntax-owned field only when a consumer asks for its value.
   * Written-key ownership itself never calls this function. Approximations are
   * monotone and epoch-memoized exactly like function/binding summaries. */
  function materializeLocalField(
    record,
    fieldId,
    execution = null,
    receiverTokens = EMPTY,
  ) {
    const sources = record.fieldSources.get(fieldId);
    const hasGetter = [...(sources?.values() || [])]
      .some((source) => source.kind === 'getter');
    const cutoffSuffix = hasGetter
      ? `@getter:${sha256(cutoffSignatureOf())}`
      : '';
    const receiverSuffix = hasGetter && receiverTokens.size
      ? `@this:${sha256([...receiverTokens].sort().join('|'))}`
      : '';
    const demandId = `${execution?.executionId
      ? `${fieldId}@${execution.executionId}`
      : fieldId}${cutoffSuffix}${receiverSuffix}`;
    const prior = record.fields.get(demandId) || EMPTY;
    if (!sources?.size) return prior;
    let evaluating = localFieldsEvaluating.get(record);
    if (!evaluating) {
      evaluating = new Set();
      localFieldsEvaluating.set(record, evaluating);
    }
    if (evaluating.has(demandId)) return prior;
    let epochs = localFieldEpoch.get(record);
    if (!epochs) {
      epochs = new Map();
      localFieldEpoch.set(record, epochs);
    }
    if (epochs.get(demandId) === evaluationEpoch) return prior;
    epochs.set(demandId, evaluationEpoch);
    evaluating.add(demandId);
    bump('materializedLocalFields', `${record.sourceToken}:${demandId}`);
    let addition = EMPTY;
    const demandCutoffs = activeCutoffs;
    try {
      for (const source of sources.values()) {
        let values = EMPTY;
        if (source.kind === 'expression') {
          values = withLocalFieldContext(
            source.context,
            () => execution
              ? withEffectExecution(
                execution,
                0,
                () => resolve(source.node, source.file, 0),
              )
              : resolve(source.node, source.file, 0),
          );
        } else if (source.kind === 'getter') {
          values = withLocalFieldContext(
            source.context,
            () => {
              const priorFrame = sentinelFrames.get(source.node);
              const getterFrame = new Map(priorFrame || []);
              getterFrame.set(THIS_SENTINEL, {
                objects: receiverTokens,
                keys: new Set([KEY_UNKNOWN]),
              });
              sentinelFrames.set(source.node, getterFrame);
              try {
                const returned = returnsOf(source.node, source.file, 0);
                return returned;
              } finally {
                if (priorFrame) sentinelFrames.set(source.node, priorFrame);
                else sentinelFrames.delete(source.node);
              }
            },
            demandCutoffs,
          );
        }
        addition = union(addition, values);
      }
      const next = union(prior, addition);
      if (next.size !== prior.size) {
        record.fields.set(demandId, next);
        noteApproximationGrowth(next, 'materializing a deferred local field');
      }
      return next;
    } finally {
      evaluating.delete(demandId);
    }
  }

  function appendIndexedLocalMutations(
    constructor,
    depth,
    context,
    bases,
    written,
    fieldSources,
    overlaySteps,
  ) {
    let nextBases = bases;
    const mutations = [...(idx.localMutations.get(constructor) || [])]
      .sort((a, b) => a.sequence - b.sequence);
    for (const mutation of mutations) {
      if (mutation.kind === 'mappedSpread') {
        const sourceContext = captureLocalFieldContextAt(
          mutation.entriesCopy.entriesCall,
          mutation.entriesCopy.sourceFile,
        );
        const tokens = withLocalFieldContext(
          sourceContext,
          () => resolve(
            mutation.entriesCopy.sourceNode,
            mutation.entriesCopy.sourceFile,
            depth + 1,
          ),
        );
        overlaySteps.push({
          id: mutation.id,
          kind: 'mappedSpread',
          tokens,
          sourceNode: mutation.entriesCopy.sourceNode,
          sourceFile: mutation.entriesCopy.sourceFile,
          unknownSource: !tokens.size,
          fieldId: mutation.id,
          identityValue: mutation.entriesCopy.identityValue,
          mutation: true,
          file: mutation.file,
          // The whole-keyset transfer becomes observable after the loop. An
          // empty loop means an empty source, not an optional copy; only
          // control surrounding the loop can make the transfer optional.
          mutationSite: mutation.entriesCopy.coverageSite,
          context: sourceContext,
        });
        let sources = fieldSources.get(mutation.id);
        if (!sources) {
          sources = new Map();
          fieldSources.set(mutation.id, sources);
        }
        const sourceKey = `expression:${context.key}:${mutation.file}:${mutation.node.pos}:${mutation.node.end}`;
        sources.set(sourceKey, {
          kind: 'expression',
          node: mutation.node,
          file: mutation.file,
          context,
        });
        continue;
      }
      if (mutation.kind === 'spread') {
        const tokens = resolve(mutation.node, mutation.file, depth + 1);
        nextBases = union(nextBases, tokens);
        overlaySteps.push({
          id: mutation.id,
          kind: 'spread',
          tokens,
          sourceNode: mutation.node,
          sourceFile: mutation.file,
          unknownSource: !tokens.size && !(
            ts.isObjectLiteralExpression(unwrap(mutation.node))
            && unwrap(mutation.node).properties.length === 0
          ),
          mutation: true,
          file: mutation.file,
          mutationSite: mutation.mutationSite,
          context,
          preservedAccessorKeys: mutation.preservedAccessorKeys || new Set(),
        });
        continue;
      }
      if (mutation.kind === 'delete' || mutation.kind === 'dynamicDelete') {
        overlaySteps.push({
          id: mutation.id,
          kind: mutation.kind,
          key: mutation.key,
          keyNode: mutation.keyNode || null,
          mutation: true,
          file: mutation.file,
          mutationSite: mutation.mutationSite,
          context,
        });
        continue;
      }
      const fieldId = mutation.id;
      if (mutation.kind === 'field') written.add(mutation.key);
      overlaySteps.push({
        id: mutation.id,
        kind: mutation.kind,
        key: mutation.key,
        keyNode: mutation.keyNode || null,
        fieldId,
        assignment: mutation.assignment,
        preservesPresence: Boolean(mutation.preservesPresence),
        preservedAccessorKeys: mutation.preservedAccessorKeys || new Set(),
        mutation: true,
        file: mutation.file,
        mutationSite: mutation.mutationSite,
        context,
      });
      let sources = fieldSources.get(fieldId);
      if (!sources) {
        sources = new Map();
        fieldSources.set(fieldId, sources);
      }
      const sourceKey = `expression:${context.key}:${mutation.file}:${mutation.node.pos}:${mutation.node.end}`;
      sources.set(sourceKey, {
        kind: 'expression',
        node: mutation.node,
        file: mutation.file,
        context,
      });
    }
    return nextBases;
  }

  /** Resolve the finite string-key domain of a computed access. The domain is
   * deliberately independent from object provenance: it can flow through const
   * aliases and call parameters even when the string itself names no corpus
   * root. Unknown remains explicit so a proven dynamic-value facet can still be
   * traversed without pretending an arbitrary record is a dictionary. */
  function resolveKeyDomain(node, file, depth = 0) {
    if (!node) return new Set([KEY_UNKNOWN]);
    if (depth > 64) { bump('depthTruncations', siteOf(node, file)); return new Set([KEY_UNKNOWN]); }
    const n = unwrap(node);
    const staticKey = staticElementKey(n);
    if (staticKey != null) return new Set([literalKeyDomain(staticKey)]);
    if (ts.isConditionalExpression(n)) {
      return union(
        resolveKeyDomain(n.whenTrue, file, depth + 1),
        resolveKeyDomain(n.whenFalse, file, depth + 1),
      );
    }
    if (ts.isBinaryExpression(n)) {
      const op = n.operatorToken.kind;
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.AmpersandAmpersandToken
        || op === ts.SyntaxKind.QuestionQuestionToken) {
        return union(
          resolveKeyDomain(n.left, file, depth + 1),
          resolveKeyDomain(n.right, file, depth + 1),
        );
      }
      return new Set([KEY_UNKNOWN]);
    }
    if (!ts.isIdentifier(n)) return new Set([KEY_UNKNOWN]);
    const binding = lookupBinding(n);
    if (!binding) return new Set([KEY_UNKNOWN]);
    const refined = keyDomainRefinements.get(binding);
    if (refined) return refined;
    if (binding.k === 'param' && sentinelFrames.has(binding.fn)) {
      return sentinelFrames.get(binding.fn).get(binding)?.keys || EMPTY;
    }
    return resolveKeyBinding(bindingVersionOf(binding, n, file), depth + 1);
  }

  /** Resolve the abstract property cell targeted by one computed mutation.
   * A stable, unwritten lexical binding names the same runtime key throughout
   * one invocation even when its concrete string is unknown. Other unknown
   * expressions receive occurrence-local identities and therefore cannot
   * unsafely kill one another. */
  const canonicalStableKeyBinding = (initial) => {
    let binding = initial;
    const seen = new Set();
    for (;;) {
      if (!binding || seen.has(binding) || (binding.writes || []).length
        || binding.projection?.length || binding.fallbacks?.length
        || binding.additionalInitializers?.length) return null;
      seen.add(binding);
      if (binding.k !== 'expr' || !binding.node) return binding;
      const initializer = unwrap(binding.node);
      if (!ts.isIdentifier(initializer)) return binding;
      const target = lookupBinding(initializer);
      if (!target) return binding;
      binding = target;
    }
  };

  function mutationKeyDomains(step) {
    if (step.resolvedKeyDomains?.size) {
      return {
        domains: step.resolvedKeyDomains,
        definite: step.resolvedKeyDomains.size === 1
          && ![...step.resolvedKeyDomains][0].startsWith(KEY_UNKNOWN),
      };
    }
    if (step.key != null) {
      return { domains: new Set([literalKeyDomain(step.key)]), definite: true };
    }
    let domains = step.keyNode
      ? withLocalFieldContext(
        step.context,
        () => step.mutation
          ? withEffectExecution(
            step,
            0,
            () => resolveKeyDomain(step.keyNode, step.file, 0),
          )
          : resolveKeyDomain(step.keyNode, step.file, 0),
      )
      : new Set([KEY_UNKNOWN]);
    if (!domains.size) domains = new Set([KEY_UNKNOWN]);

    const keyNode = step.keyNode ? unwrap(step.keyNode) : null;
    const binding = keyNode && ts.isIdentifier(keyNode) ? lookupBinding(keyNode) : null;
    const stableBinding = canonicalStableKeyBinding(binding);
    const familyBinding = stableBinding && (
      step.mutationSite?.loop
      || (stableBinding.k === 'param'
        && (idx.elementCallSites.get(stableBinding.fn) || []).length > 0)
    );
    const invocationIdentity = step.executionCallChain?.length
      ? step.executionCallChain.map(({ callSite }) => (
        `${callSite.file}:${callSite.call.pos}:${callSite.call.end}`
      )).join('>')
      : `${currentReadContext?.file || step.file}:owner:`
        + `${currentReadContext?.owner?.pos ?? 'none'}:${currentReadContext?.owner?.end ?? 'none'}`;
    const normalized = new Set();
    for (const domain of domains) {
      if ((domain === KEY_UNKNOWN || domain.startsWith(KEY_PARAM)) && stableBinding) {
        normalized.add(`${familyBinding ? 'family' : 'binding'}:${sha256(JSON.stringify([
          bindingContextId(stableBinding),
          invocationIdentity,
        ]))}`);
      } else if (domain === KEY_UNKNOWN) {
        normalized.add(`unknown:${sha256(step.id)}`);
      } else {
        normalized.add(domain);
      }
    }
    const only = normalized.size === 1 ? [...normalized][0] : null;
    return {
      domains: normalized,
      definite: Boolean(
        only && !only.startsWith('unknown:') && !only.startsWith('family:'),
      ),
    };
  }

  function computeKeyBinding(version, depth) {
    const { binding, initialVisible, writes } = version;
    let out = EMPTY;
    if (binding.k === 'expr' && initialVisible) {
      const initializers = [binding.node, ...(binding.additionalInitializers || [])]
        .filter(Boolean);
      for (const initializer of initializers) {
        const evaluate = () => resolveProjectedKey(
          initializer,
          binding.file,
          binding.projection,
          binding.fallbacks,
          depth + 1,
        );
        out = union(out, binding.definitionSite
          ? withReadContext({
            file: binding.definitionSite.file,
            pos: binding.definitionSite.end,
            owner: binding.definitionSite.owner,
          }, evaluate)
          : evaluate());
      }
    }
    else if (binding.k === 'param') out = resolveParamKey(binding, depth + 1);
    for (const write of writes) {
      if (write.kind === 'assign') {
        if (write.transfer === 'primitive') {
          if (!write.site?.optional) out = EMPTY;
          continue;
        }
        const value = withEffectExecution(write, depth, () => resolveProjectedKey(
          write.node,
          write.file,
          write.projection,
          write.fallbacks,
          depth + 1,
        ));
        out = write.transfer === 'replace' && !write.site?.optional
          ? value
          : union(out, value);
      }
    }
    return out;
  }

  function resolveKeyBinding(version, depth) {
    const prior = keyBindingApprox.get(version) || EMPTY;
    noteMutableBindingScc(version, 'key');
    if (keyBindingsEvaluating.has(version)) {
      // Lazy local fields and function summaries can revisit the same exact
      // program-point version without making the source writes cyclic. Read the
      // current monotone approximation; the outer fixed point will replay it.
      // Budgets and the 128-round guard fail closed if that state is infinite.
      bump(
        'resolvedBindingVersionBackEdges',
        `key:${bindingContextId(version.binding)}:${version.signature}`,
      );
      return prior;
    }
    const cacheable = sentinelFrames.size === 0;
    if (cacheable && keyBindingEpoch.get(version) === evaluationEpoch) return prior;
    if (cacheable) keyBindingEpoch.set(version, evaluationEpoch);
    keyBindingsEvaluating.add(version);
    try {
      return mergeApproximation(
        keyBindingApprox,
        version,
        computeKeyBinding(version, depth + 1),
      );
    } finally {
      keyBindingsEvaluating.delete(version);
    }
  }

  function applyKeyDomains(tokens, domains, diagnosticSite = null) {
    let out = EMPTY;
    const effectiveDomains = domains?.size ? domains : EMPTY;
    for (const token of tokens) {
      for (const domain of effectiveDomains) {
        if (isSymbolicToken(token)) {
          out = union(out, new Set([symbolicKey(token, domain)]));
          continue;
        }
        if (domain.startsWith(KEY_LITERAL)) {
          out = union(out, readElement(
            new Set([token]),
            decodeURIComponent(domain.slice(KEY_LITERAL.length)),
            diagnosticSite,
          ));
        } else {
          out = union(out, readElement(new Set([token]), null, diagnosticSite));
        }
      }
    }
    return out;
  }

  function computeBinding(version, depth) {
    const { binding, initialVisible, writes } = version;
    let out = EMPTY;
    if (binding.k === 'expr' && initialVisible) {
      const initializers = [binding.node, ...(binding.additionalInitializers || [])]
        .filter(Boolean);
      for (const initializer of initializers) {
        const evaluate = () => resolveProjectedValue(
          initializer,
          binding.file,
          binding.projection,
          binding.fallbacks,
          depth + 1,
        );
        out = union(out, binding.definitionSite
          ? withReadContext({
            file: binding.definitionSite.file,
            pos: binding.definitionSite.end,
            owner: binding.definitionSite.owner,
          }, evaluate)
          : evaluate());
      }
    }
    else if (binding.k === 'elem') {
      if (binding.call) {
        const callContext = {
          file: binding.file,
          pos: binding.call.end,
          owner: flowOwnerOf(binding.call),
        };
        out = withReadContext(callContext, () => {
          const receivers = contextualizeTokens(
            resolve(binding.node, binding.file, depth + 1),
            flowContextsAt(binding.call, binding.file),
          );
          return readElement(
            new Set([...receivers].filter(
              (token) => isArrayLikeToken(token) || isSymbolicToken(token),
            )),
            null,
            siteOf(binding.node, binding.file),
          );
        });
      } else {
        out = readElement(
          resolve(binding.node, binding.file, depth + 1),
          null,
          siteOf(binding.node, binding.file),
        );
      }
    }
    else if (binding.k === 'property') {
      out = readProperty(resolve(binding.node, binding.file, depth + 1), binding.prop);
    } else if (binding.k === 'param') out = resolveParam(binding, depth + 1);

    for (const write of writes) {
      if (write.kind === 'assign') {
        if (write.transfer === 'primitive') {
          if (!write.site?.optional) out = EMPTY;
          continue;
        }
        const value = withEffectExecution(write, depth, () => resolveProjectedValue(
          write.node,
          write.file,
          write.projection,
          write.fallbacks,
          depth + 1,
        ));
        out = write.transfer === 'replace' && !write.site?.optional
          ? value
          : union(out, value);
      } else if (write.kind === 'dictionary') {
        const value = withEffectExecution(
          write,
          depth,
          () => resolve(write.node, write.file, depth + 1),
        );
        const dictionaries = new Set();
        for (const token of value) {
          if (isRecordToken(token)) dictionaries.add(dictionaryToken(originOf(token)));
        }
        out = union(out, dictionaries);
      }
    }
    return out;
  }

  function resolveBinding(version, depth) {
    const prior = bindingApprox.get(version) || EMPTY;
    noteMutableBindingScc(version, 'object');
    if (bindingsEvaluating.has(version)) {
      bump(
        'resolvedBindingVersionBackEdges',
        `object:${bindingContextId(version.binding)}:${version.signature}`,
      );
      return prior;
    }
    const cacheable = sentinelFrames.size === 0;
    if (cacheable && bindingEpoch.get(version) === evaluationEpoch) return prior;
    if (cacheable) bindingEpoch.set(version, evaluationEpoch);
    bindingsEvaluating.add(version);
    try {
      return mergeApproximation(bindingApprox, version, computeBinding(version, depth + 1));
    } finally {
      bindingsEvaluating.delete(version);
    }
  }

  /** @returns {Set<string>} exact origin/container tokens */
  function resolve(node, file, depth = 0) {
    if (!node) return EMPTY;
    if (depth > 64) { bump('depthTruncations', siteOf(node, file)); return EMPTY; }
    const n = unwrap(node);

    if (ts.isAwaitExpression(n)) {
      // Await adopts modeled Promises and is a pass-through for non-Promise
      // records/containers, exactly like the language operation.
      return awaitTokens(resolve(n.expression, file, depth + 1));
    }

    if (n.kind === ts.SyntaxKind.ThisKeyword) {
      for (let owner = n.parent; owner; owner = owner.parent) {
        if (!ts.isFunctionLike(owner) || ts.isArrowFunction(owner)) continue;
        return sentinelFrames.get(owner)?.get(THIS_SENTINEL)?.objects || EMPTY;
      }
      return EMPTY;
    }

    if (ts.isIdentifier(n)) {
      const binding = lookupBinding(n);
      let viaBinding = EMPTY;
      if (binding && binding.k === 'param' && sentinelFrames.has(binding.fn)) {
        return sentinelFrames.get(binding.fn).get(binding)?.objects || EMPTY;
      }
      if (binding) {
        viaBinding = resolveBinding(bindingVersionOf(binding, n, file), depth + 1);
      }
      if (binding) {
        // Exported functions remain callable from outside this indexed estate
        // even when they also have internal callers. Preserve both worlds: an
        // internal argument is one concrete invocation alternative, while the
        // identically named executed root is the external-entry alternative.
        // Restrict the union to an explicitly escaped parameter so a failed
        // local binding/cycle can never be retyped by name.
        const root = rootTokens.get(n.text);
        if (binding.k === 'param' && idx.escapedFunctions.has(binding.fn) && root?.size) {
          bump('rootHeuristicUses', siteOf(n, file));
          viaBinding = union(viaBinding, new Set(root));
        }
        return viaBinding;
      }
      // Exact executed-root fallback only. There is deliberately NO singleHome
      // container-name prior: that heuristic grounded unrelated `entries`,
      // `members`, `raw`, `plan`, and `edges` records across the whole estate.
      const root = rootTokens.get(n.text);
      if (root?.size) { bump('rootHeuristicUses', siteOf(n, file)); return new Set(root); }
      return EMPTY;
    }

    if (ts.isPropertyAccessExpression(n)) {
      return readProperty(resolve(n.expression, file, depth + 1), n.name.text);
    }

    if (ts.isElementAccessExpression(n)) {
      return applyKeyDomains(
        resolve(n.expression, file, depth + 1),
        resolveKeyDomain(n.argumentExpression, file, depth + 1),
        siteOf(n, file),
      );
    }

    if (ts.isBinaryExpression(n)) {
      const op = n.operatorToken.kind;
      if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.AmpersandAmpersandToken
        || op === ts.SyntaxKind.QuestionQuestionToken) {
        return union(resolve(n.left, file, depth + 1), resolve(n.right, file, depth + 1));
      }
      return EMPTY;
    }

    if (ts.isConditionalExpression(n)) {
      return union(resolve(n.whenTrue, file, depth + 1), resolve(n.whenFalse, file, depth + 1));
    }

    if (ts.isArrayLiteralExpression(n)) {
      let elements = EMPTY;
      for (const element of n.elements) {
        if (ts.isSpreadElement(element)) {
          const iterable = new Set([...resolve(element.expression, file, depth + 1)]
            .filter((token) => isArrayLikeToken(token) || isSymbolicToken(token)));
          elements = union(elements, readElement(
            iterable,
            null,
            siteOf(n, file),
          ));
        } else {
          elements = union(elements, resolve(element, file, depth + 1));
        }
      }
      const producer = arrayProducerOf(n, file, 'array-literal');
      const out = new Set();
      for (const token of elements) {
        const array = asProducedArray(token, producer);
        if (array) out.add(array);
      }
      return out;
    }

    if (ts.isObjectLiteralExpression(n)) {
      let bases = EMPTY;
      const written = new Set();
      const fields = new Map();
      const fieldSources = new Map();
      const overlaySteps = [];
      const fieldContext = captureLocalFieldContextAt(n, file);
      const accessorGetterByKey = new Map();
      for (const property of n.properties) {
        if (ts.isSpreadAssignment(property)) {
          const spreadContext = captureLocalFieldContextAt(property, file);
          const tokens = resolve(property.expression, file, depth + 1);
          bases = union(bases, tokens);
          overlaySteps.push({
            id: `spread:${property.pos}:${property.end}`,
            kind: 'spread',
            tokens,
            sourceNode: property.expression,
            sourceFile: file,
            context: spreadContext,
            unknownSource: !tokens.size && !(
              ts.isObjectLiteralExpression(unwrap(property.expression))
              && unwrap(property.expression).properties.length === 0
            ),
          });
          const spreadKeys = enumerableKeysOfTokens(tokens);
          if (!spreadKeys.size || unknownEnumerableValuesOfTokens(tokens).size) {
            accessorGetterByKey.clear();
          } else {
            for (const spreadKey of spreadKeys) {
              accessorGetterByKey.delete(`literal:${spreadKey}`);
            }
          }
          continue;
        }
        const key = staticPropertyKey(property.name);
        const computed = key == null && ts.isComputedPropertyName(property.name)
          ? property.name.expression
          : null;
        if (key == null && !computed) continue;
        const propertyContext = captureLocalFieldContextAt(property, file);
        const computedNode = computed ? unwrap(computed) : null;
        const computedBinding = computedNode && ts.isIdentifier(computedNode)
          ? canonicalStableKeyBinding(lookupBinding(computedNode))
          : null;
        const descriptorKey = key != null
          ? `literal:${key}`
          : (computedBinding
            ? `binding:${bindingContextId(computedBinding)}`
            : `occurrence:${property.pos}:${property.end}`);
        const priorGetter = ts.isSetAccessorDeclaration(property)
          ? accessorGetterByKey.get(descriptorKey)
          : null;
        const fieldId = priorGetter || `field:${property.pos}:${property.end}`;
        if (key != null) {
          written.add(key);
          overlaySteps.push({
            id: `overlay:${property.pos}:${property.end}`,
            kind: 'field',
            key,
            fieldId,
          });
        } else {
          overlaySteps.push({
            id: `overlay:${property.pos}:${property.end}`,
            kind: 'dynamic',
            key: null,
            keyNode: computed,
            fieldId,
            assignment: 'replace',
            mutation: false,
            file,
            context: propertyContext,
          });
        }
        let initializer = null;
        let getter = null;
        if (ts.isPropertyAssignment(property)) {
          initializer = property.initializer;
        } else if (ts.isShorthandPropertyAssignment(property)) {
          initializer = property.name;
        } else if (ts.isGetAccessorDeclaration(property)) {
          getter = property;
        }
        if (getter) accessorGetterByKey.set(descriptorKey, fieldId);
        else if (!ts.isSetAccessorDeclaration(property) || !priorGetter) {
          accessorGetterByKey.delete(descriptorKey);
        }
        if (initializer || getter) {
          let sources = fieldSources.get(fieldId);
          if (!sources) {
            sources = new Map();
            fieldSources.set(fieldId, sources);
          }
          const source = initializer || getter;
          const sourceKind = getter ? 'getter' : 'expression';
          const sourceKey = `${sourceKind}:${propertyContext.key}:${file}:${source.pos}:${source.end}`;
          sources.set(sourceKey, {
            kind: sourceKind,
            node: source,
            file,
            context: propertyContext,
          });
        }
      }
      bases = appendIndexedLocalMutations(
        n,
        depth,
        fieldContext,
        bases,
        written,
        fieldSources,
        overlaySteps,
      );
      return new Set([
        registerLocal(n, file, bases, written, fields, fieldSources, overlaySteps),
      ]);
    }

    if (ts.isCallExpression(n)) return resolveCall(n, file, depth + 1);

    return EMPTY;
  }

  function instantiateSymbolic(token, call, file, depth, target = null, localMap = new Map()) {
    if (depth > 64) { bump('depthTruncations', siteOf(call, file)); return EMPTY; }
    const flow = flowParts(token);
    if (flow) {
      return contextualizeTokens(
        instantiateSymbolic(flow.base, call, file, depth + 1, target, localMap),
        flowContextsOf(token),
      );
    }
    const reference = referenceParts(token);
    if (reference) {
      const out = new Set();
      for (const value of instantiateSymbolic(
        reference.value,
        call,
        file,
        depth + 1,
        target,
        localMap,
      )) out.add(referenceToken(reference.identity, value, reference.multiplicity));
      return out;
    }
    const promise = promiseParts(token);
    if (promise) {
      const out = new Set();
      for (const value of instantiateSymbolic(
        promise.value,
        call,
        file,
        depth + 1,
        target,
        localMap,
      )) out.add(promiseToken(value));
      return out;
    }
    const plus = arrayPlusParts(token);
    if (plus && tokenNeedsInstantiation(plus.leaf)) {
      const out = new Set();
      for (const leaf of instantiateSymbolic(
        plus.leaf, call, file, depth + 1, target, localMap,
      )) out.add(canonicalArrayPlusToken(plus.producer, leaf));
      return out;
    }
    const product = arrayProductParts(token);
    if (product) {
      const producer = contextualArrayProducer(
        { id: product.producer, kind: 'call-reconstruction' },
        siteOf(call, file),
      );
      const leaves = tokenNeedsInstantiation(product.leaf)
        ? instantiateSymbolic(product.leaf, call, file, depth + 1, target, localMap)
        : new Set([product.leaf]);
      const out = new Set();
      for (const leaf of leaves) {
        const rebuilt = asProducedArray(leaf, producer);
        if (rebuilt) out.add(rebuilt);
      }
      return out;
    }
    if (isArrayToken(token) && tokenNeedsInstantiation(token)) {
      const out = new Set();
      for (const element of instantiateSymbolic(
        arrayElementToken(token), call, file, depth + 1, target, localMap,
      )) {
        const array = asArray(element);
        if (array) out.add(array);
      }
      return out;
    }
    if (isLocalToken(token)) {
      const local = localRecords.get(token);
      if (!local) return EMPTY;
      const source = localEvaluationOf(local).source || local;
      const existingCalls = callEntriesOfView(local.view);
      const extendsNestedAllocation = Boolean(
        target?.fn && existingCalls.length
        && nestedCallOwnsInvocationAllocation(existingCalls.at(-1), target.fn),
      );
      const repeatsStaticCall = extendsNestedAllocation
        && existingCalls.some((entry) => entry.call === call);
      if (repeatsStaticCall) {
        if (local.multiplicity !== 'many') {
          local.multiplicity = 'many';
          noteApproximationGrowth(
            new Set([token]),
            'closing a recursive call-qualified allocation',
          );
        }
        return new Set([token]);
      }
      // A direct allocation is qualified by the callee invocation that creates
      // it. When that allocation is returned through one or more wrappers,
      // compose each outer call as well: the inner static call alone is shared
      // by every wrapper invocation and therefore is not a runtime identity.
      // Captured locals have no allocation-owned call view and remain aliases.
      const createsOwnedAllocation = Boolean(
        target?.fn && source.allocationOwner === target.fn
        && tokenNeedsInstantiation(token),
      );
      if (!createsOwnedAllocation && !extendsNestedAllocation) return new Set([token]);
      const calls = extendsNestedAllocation
        ? [...existingCalls, { call, file, target }]
        : [{ call, file, target }];
      const sourceToken = source.sourceToken || local.sourceToken || token;
      const callIdentity = calls.map((entry) => [
        entry.file,
        entry.call.pos,
        entry.call.end,
        entry.target?.fn?.pos ?? null,
        entry.target?.fn?.end ?? null,
      ]);
      const destination = `${LOCAL}inst:${sha256(JSON.stringify(callIdentity))}:${encodeURIComponent(sourceToken)}`;
      const priorToken = localMap.get(token);
      if (priorToken) return new Set([priorToken]);
      localMap.set(token, destination);
      registerLocalView(destination, sourceToken, {
        kind: 'call', call, file, target, calls,
      });
      return new Set([destination]);
    }
    const match = /^@param(\d+)(.*)$/.exec(token);
    if (!match) return new Set([token]);
    const paramIndex = Number(match[1]);
    const defaultParameter = target?.fn?.parameters?.[paramIndex];
    const effective = effectiveArgument(
      call.arguments,
      paramIndex,
      defaultParameter,
      file,
      target?.file || file,
    );
    if (!effective) return EMPTY;
    const { expression: arg, file: argumentFile } = effective;
    const operations = match[2].split('|').filter(Boolean);
    let out = operations.length ? null : resolve(arg, argumentFile, depth + 1);
    for (const operation of operations) {
      if (operation.startsWith('p:')) {
        const key = decodeURIComponent(operation.slice(2));
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        out = readProperty(out, key);
      } else if (operation === 'e') {
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        out = readElement(out, null, siteOf(call, file));
      } else if (operation === 'v') {
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        out = readElement(out, null, siteOf(call, file));
      } else if (operation === 'a') {
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        const arrays = new Set();
        for (const value of out) {
          const array = asArray(value);
          if (array) arrays.add(array);
        }
        out = arrays;
      } else if (operation === 'f') {
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        const arrays = new Set();
        for (const value of out) {
          const array = asFlatMapResult(value);
          if (array) arrays.add(array);
        }
        out = arrays;
      } else if (operation.startsWith('d:')) {
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        const payload = operation.slice(2);
        const descriptor = payload.startsWith('p:') || payload === 'u'
          ? payload
          : Number(payload);
        out = applyFlatDepth(out, flatDepthAtCall(descriptor, call, file, target));
      } else if (operation.startsWith('k:')) {
        if (out === null) out = resolve(arg, argumentFile, depth + 1);
        const encodedDomain = operation.slice(2);
        let domains;
        if (encodedDomain.startsWith(KEY_PARAM)) {
          const keyIndex = Number(encodedDomain.slice(KEY_PARAM.length));
          const defaultKeyParameter = target?.fn?.parameters?.[keyIndex];
          const effectiveKey = effectiveArgument(
            call.arguments,
            keyIndex,
            defaultKeyParameter,
            file,
            target?.file || file,
          );
          domains = effectiveKey
            ? resolveKeyDomain(effectiveKey.expression, effectiveKey.file, depth + 1)
            : new Set([KEY_UNKNOWN]);
        } else {
          domains = new Set([encodedDomain]);
        }
        out = applyKeyDomains(out, domains, siteOf(call, file));
      }
      if (out !== null && !out.size) break;
    }
    return out || EMPTY;
  }

  function instantiateCallbackSymbolic(
    token,
    elementTokens,
    diagnosticSite,
    localMap = new Map(),
  ) {
    if (localMap.size > 64) {
      bump('depthTruncations', diagnosticSite);
      return EMPTY;
    }
    const flow = flowParts(token);
    if (flow) {
      return contextualizeTokens(
        instantiateCallbackSymbolic(
          flow.base,
          elementTokens,
          diagnosticSite,
          localMap,
        ),
        flowContextsOf(token),
      );
    }
    const reference = referenceParts(token);
    if (reference) {
      const out = new Set();
      for (const value of instantiateCallbackSymbolic(
        reference.value,
        elementTokens,
        diagnosticSite,
        localMap,
      )) out.add(referenceToken(reference.identity, value, reference.multiplicity));
      return out;
    }
    const promise = promiseParts(token);
    if (promise) {
      const out = new Set();
      for (const value of instantiateCallbackSymbolic(
        promise.value,
        elementTokens,
        diagnosticSite,
        localMap,
      )) out.add(promiseToken(value));
      return out;
    }
    const plus = arrayPlusParts(token);
    if (plus && tokenNeedsInstantiation(plus.leaf)) {
      const out = new Set();
      for (const leaf of instantiateCallbackSymbolic(
        plus.leaf, elementTokens, diagnosticSite, localMap,
      )) out.add(canonicalArrayPlusToken(plus.producer, leaf));
      return out;
    }
    const product = arrayProductParts(token);
    if (product) {
      const producer = contextualArrayProducer(
        { id: product.producer, kind: 'callback-reconstruction' },
        diagnosticSite,
      );
      const leaves = tokenNeedsInstantiation(product.leaf)
        ? instantiateCallbackSymbolic(
          product.leaf,
          elementTokens,
          diagnosticSite,
          localMap,
        )
        : new Set([product.leaf]);
      const out = new Set();
      for (const leaf of leaves) {
        const rebuilt = asProducedArray(leaf, producer);
        if (rebuilt) out.add(rebuilt);
      }
      return out;
    }
    if (isArrayToken(token) && tokenNeedsInstantiation(token)) {
      const out = new Set();
      for (const element of instantiateCallbackSymbolic(
        arrayElementToken(token), elementTokens, diagnosticSite, localMap,
      )) {
        const array = asArray(element);
        if (array) out.add(array);
      }
      return out;
    }
    if (isLocalToken(token)) {
      if (!tokenNeedsInstantiation(token)) return new Set([token]);
      const local = localRecords.get(token);
      if (!local) return EMPTY;
      const sourceToken = local.sourceToken || token;
      const callbackToken = `${LOCAL}callback:${encodeURIComponent(diagnosticSite || 'unknown')}:${encodeURIComponent(sourceToken)}`;
      const priorToken = localMap.get(token);
      if (priorToken) return new Set([priorToken]);
      localMap.set(token, callbackToken);
      registerLocalView(callbackToken, sourceToken, {
        kind: 'callback', elementTokens, diagnosticSite,
      });
      return new Set([callbackToken]);
    }
    const match = /^@param(\d+)(.*)$/.exec(token);
    if (!match) return new Set([token]);
    // Array callback parameter zero is the element. Later parameters are the
    // numeric index and the source array; neither is an element record.
    if (Number(match[1]) !== 0) return EMPTY;
    let out = elementTokens;
    const operations = match[2].split('|').filter(Boolean);
    for (const operation of operations) {
      if (operation.startsWith('p:')) {
        out = readProperty(out, decodeURIComponent(operation.slice(2)));
      } else if (operation === 'e') {
        out = readElement(out, null, diagnosticSite);
      } else if (operation === 'v') {
        out = readElement(out, null, diagnosticSite);
      } else if (operation === 'a') {
        const arrays = new Set();
        for (const value of out) {
          const array = asArray(value);
          if (array) arrays.add(array);
        }
        out = arrays;
      } else if (operation === 'f') {
        const arrays = new Set();
        for (const value of out) {
          const array = asFlatMapResult(value);
          if (array) arrays.add(array);
        }
        out = arrays;
      } else if (operation.startsWith('d:')) {
        const payload = operation.slice(2);
        const levels = /^\d+$/.test(payload) ? Number(payload) : null;
        out = applyFlatDepth(out, levels);
      } else if (operation.startsWith('k:')) {
        const encodedDomain = operation.slice(2);
        const domains = encodedDomain.startsWith(KEY_PARAM)
          ? new Set([KEY_UNKNOWN])
          : new Set([encodedDomain]);
        out = applyKeyDomains(out, domains, diagnosticSite);
      }
      if (!out.size) break;
    }
    return out;
  }

  function objectLiteralKeyDomain(expression, key, file, depth) {
    const value = unwrap(expression);
    if (!ts.isObjectLiteralExpression(value)) return new Set([KEY_UNKNOWN]);
    let out = EMPTY;
    for (const property of value.properties) {
      if (ts.isPropertyAssignment(property)
        && ((ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
          || ts.isNumericLiteral(property.name)) && property.name.text === key)) {
        out = union(out, resolveKeyDomain(property.initializer, file, depth + 1));
      } else if (ts.isShorthandPropertyAssignment(property) && property.name.text === key) {
        out = union(out, resolveKeyDomain(property.name, file, depth + 1));
      }
    }
    return out.size ? out : new Set([KEY_UNKNOWN]);
  }

  /** Evaluate a recursive SCC in concrete call context. Symbolic path expansion
   * cannot represent recursion finitely (`row.next` grows forever); concrete
   * executed origins can. The memo key is the complete object + key-domain
   * argument abstraction, so self and mutual recursion reach a finite monotone
   * fixed point over the graph instead of being cut or depth-capped. */
  function resolveRecursiveCall(target, call, file, depth) {
    if (depth > 64) { bump('depthTruncations', siteOf(call, file)); return EMPTY; }
    const frame = new Map();
    const signatureParts = [];
    target.fn.parameters?.forEach((parameter, index) => {
      const effective = effectiveArgument(call.arguments, index, parameter, file, target.file);
      const expression = effective?.expression;
      const argumentFile = effective?.file || target.file;
      const objects = expression ? resolve(expression, argumentFile, depth + 1) : EMPTY;
      const keys = expression
        ? resolveKeyDomain(expression, argumentFile, depth + 1)
        : new Set([KEY_UNKNOWN]);
      signatureParts.push(
        `${index}:o=${[...objects].sort().join(',')}:k=${[...keys].sort().join(',')}`,
      );
      if (ts.isIdentifier(parameter.name)) {
        const binding = lookupBinding(parameter.name);
        if (binding) frame.set(binding, { objects, keys });
      } else if (ts.isObjectBindingPattern(parameter.name)) {
        for (const element of parameter.name.elements) {
          if (element.dotDotDotToken || !ts.isIdentifier(element.name)) continue;
          const binding = lookupBinding(element.name);
          const propNode = element.propertyName || element.name;
          if (!binding || !(ts.isIdentifier(propNode) || ts.isStringLiteral(propNode)
            || ts.isNumericLiteral(propNode))) continue;
          const prop = propNode.text;
          frame.set(binding, {
            objects: readProperty(objects, prop),
            keys: expression
              ? objectLiteralKeyDomain(expression, prop, argumentFile, depth + 1)
              : new Set([KEY_UNKNOWN]),
          });
        }
      } else if (ts.isArrayBindingPattern(parameter.name)) {
        for (const element of parameter.name.elements) {
          if (!ts.isBindingElement(element) || !ts.isIdentifier(element.name)) continue;
          const binding = lookupBinding(element.name);
          if (binding) frame.set(binding, {
            objects: readElement(objects, null, siteOf(call, file)),
            keys: new Set([KEY_UNKNOWN]),
          });
        }
      }
    });
    const signature = `${cutoffSignatureOf()}|${signatureParts.join('|')}`;
    let approximations = recursiveCallApprox.get(target.fn);
    if (!approximations) {
      approximations = new Map();
      recursiveCallApprox.set(target.fn, approximations);
    }
    let evaluating = recursiveCallsEvaluating.get(target.fn);
    if (!evaluating) {
      evaluating = new Set();
      recursiveCallsEvaluating.set(target.fn, evaluating);
    }
    const prior = approximations.get(signature) || EMPTY;
    if (evaluating.has(signature)) return prior;
    let epochs = recursiveCallEpoch.get(target.fn);
    if (!epochs) {
      epochs = new Map();
      recursiveCallEpoch.set(target.fn, epochs);
    }
    if (epochs.get(signature) === evaluationEpoch) return prior;
    epochs.set(signature, evaluationEpoch);
    evaluating.add(signature);
    const priorFrame = sentinelFrames.get(target.fn);
    sentinelFrames.set(target.fn, frame);
    try {
      const next = union(prior, returnsOf(target.fn, target.file, depth + 1));
      if (next.size !== prior.size) {
        approximations.set(signature, next);
        noteApproximationGrowth(next, 'growing a recursive call summary');
      }
      return next;
    } finally {
      if (priorFrame) sentinelFrames.set(target.fn, priorFrame);
      else sentinelFrames.delete(target.fn);
      evaluating.delete(signature);
    }
  }

  function resolveGeneratorResume(resume, depth) {
    const { fn, file: generatorFile, callSite } = resume;
    const invokedRange = callSite.resumeRange || {
      min: callSite.resumeOrdinal,
      max: callSite.resumeOrdinal,
    };
    const expressions = [];
    const visit = (node) => {
      if (ts.isFunctionLike(node) && node !== fn) return;
      if (ts.isYieldExpression(node)) {
        if (node.expression) {
          const crossed = suspensionRangeAt(node, 'yield');
          const delegatedElements = node.asteriskToken
            ? staticYieldStarElements(node.expression)
            : null;
          if (node.asteriskToken && delegatedElements) {
            const start = {
              min: Math.max(0, crossed.min - delegatedElements.length),
              max: crossed.max === Number.POSITIVE_INFINITY
                ? Number.POSITIVE_INFINITY
                : Math.max(0, crossed.max - delegatedElements.length),
            };
            delegatedElements.forEach((element, index) => {
              if (ts.isOmittedExpression(element)) return;
              expressions.push({
                node: element,
                range: {
                  min: start.min + index,
                  max: start.max === Number.POSITIVE_INFINITY
                    ? Number.POSITIVE_INFINITY
                    : start.max + index,
                },
              });
            });
          } else {
            expressions.push({
              node: node.expression,
              delegated: Boolean(node.asteriskToken),
              range: node.asteriskToken
                ? { min: crossed.min, max: Number.POSITIVE_INFINITY }
                : {
                  min: Math.max(0, crossed.min - 1),
                  max: crossed.max === Number.POSITIVE_INFINITY
                    ? Number.POSITIVE_INFINITY
                    : Math.max(0, crossed.max - 1),
                },
            });
          }
        }
        return;
      }
      if (ts.isReturnStatement(node) && node.expression) {
        expressions.push({ node: node.expression, range: suspensionRangeAt(node, 'yield') });
        return;
      }
      ts.forEachChild(node, visit);
    };
    if (fn.body) visit(fn.body);
    const priorFrame = sentinelFrames.get(fn);
    const priorContext = currentReadContext;
    const priorCutoffs = activeCutoffs;
    const operation = callSite.site || {
      file: callSite.file,
      pos: callSite.call.pos,
      end: callSite.call.end,
      owner: flowOwnerOf(callSite.call),
      delay: suspensionRangeAt(callSite.call),
      resume: suspensionRangeAt(callSite.call, 'yield'),
    };
    sentinelFrames.set(fn, invocationFrameFor({ fn, callSite }, depth + 1));
    currentReadContext = {
      file: operation.file,
      pos: operation.pos,
      owner: operation.owner,
      delay: operation.delay || ZERO_DELAY,
      resume: operation.resume || ZERO_DELAY,
    };
    activeCutoffs = withAddedCutoff(priorCutoffs, currentReadContext);
    try {
      let values = EMPTY;
      for (const expression of expressions) {
        if (invokedRange.max < expression.range.min
          || invokedRange.min > expression.range.max) continue;
        const resolved = resolve(expression.node, generatorFile, depth + 1);
        values = union(values, expression.delegated
          ? readElement(
            new Set([...resolved].filter(
              (token) => isArrayLikeToken(token) || isSymbolicToken(token),
            )),
            null,
            siteOf(expression.node, generatorFile),
          )
          : resolved);
      }
      const rangeId = `${invokedRange.min}:${invokedRange.max}`;
      const fieldId = `generator-value:${generatorFile}:${fn.pos}:${rangeId}`;
      const token = localTokenOf(callSite.call, callSite.file);
      registerLocalToken(
        token,
        EMPTY,
        new Set(['value']),
        new Map([[fieldId, values]]),
        token,
        new Map(),
        [{
          id: `generator-result:${callSite.file}:${callSite.call.pos}:${rangeId}`,
          kind: 'field',
          key: 'value',
          fieldId,
        }],
      );
      const result = new Set([token]);
      return isAsyncFunction(fn) ? asPromiseTokens(result) : result;
    } finally {
      if (priorFrame) sentinelFrames.set(fn, priorFrame);
      else sentinelFrames.delete(fn);
      activeCutoffs = priorCutoffs;
      currentReadContext = priorContext;
    }
  }

  function resolveCall(call, file, depth) {
    const callee = unwrap(call.expression);
    if (ts.isPropertyAccessExpression(callee)) {
      const method = callee.name.text;
      const userTarget = idx.functionOf(callee);
      if (!userTarget && method === 'next') {
        const resume = idx.generatorResumeByCall?.get(call);
        return resume ? resolveGeneratorResume(resume, depth + 1) : EMPTY;
      }
      if (!userTarget && (method === 'map' || method === 'flatMap')) {
        const receivers = resolve(callee.expression, file, depth);
        const containers = new Set([...receivers].filter(
          (token) => isArrayLikeToken(token) || isSymbolicToken(token),
        ));
        if (!containers.size) return EMPTY;
        const callback = call.arguments[0] ? unwrap(call.arguments[0]) : null;
        const producer = method === 'map'
          ? arrayProducerOf(call, file, 'map')
          : null;
        const callContext = { file, pos: call.end, owner: flowOwnerOf(call) };
        const mapped = withReadContext(callContext, () => {
          let contextual = EMPTY;
          let callbackIsAsync = false;
          if (callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) {
            contextual = returnsOf(callback, file, depth);
            callbackIsAsync = isAsyncFunction(callback);
          } else if (callback) {
            const target = idx.functionOf(callback);
            if (target) {
              callbackIsAsync = isAsyncFunction(target.fn);
              const elements = readElement(
                containers,
                null,
                siteOf(call, file),
              );
              for (const token of fnReturns(target.fn, target.file, depth)) {
                contextual = union(contextual, instantiateCallbackSymbolic(
                  token,
                  elements,
                  siteOf(call, file),
                ));
              }
            }
          }
          // Array combinators do not await callbacks. An async callback puts
          // its Promise object in the result array (including flatMap, whose
          // one-level flattening cannot flatten a Promise).
          return callbackIsAsync ? asPromiseTokens(contextual) : contextual;
        });
        const out = new Set();
        for (const token of mapped) {
          const array = method === 'flatMap'
            ? asFlatMapResult(token)
            : asMappedArray(token, producer);
          if (array) out.add(array);
        }
        return out;
      }
      if (!userTarget && ELEMENT_RESULT_METHODS.has(method)) {
        return readElement(resolve(callee.expression, file, depth));
      }
      if (!userTarget && method === 'concat') {
        const out = new Set([...resolve(callee.expression, file, depth)]
          .filter((token) => isArrayLikeToken(token) || isSymbolicToken(token)));
        for (const arg of call.arguments) {
          for (const token of resolve(arg, file, depth)) {
            const array = asFlatMapResult(token);
            if (array) out.add(array);
          }
        }
        return out;
      }
      if (!userTarget && method === 'flat') {
        const depthArg = call.arguments[0] ? unwrap(call.arguments[0]) : null;
        const descriptor = flatDepthDescriptor(depthArg);
        let out = EMPTY;
        for (const token of resolve(callee.expression, file, depth)) {
          if (isSymbolicToken(token)) {
            out = union(out, new Set([symbolicFlatten(token, descriptor)]));
            continue;
          }
          out = union(out, applyFlatDepth(
            new Set([token]),
            typeof descriptor === 'number' ? descriptor : null,
          ));
        }
        return out;
      }
      if (!userTarget && ARRAY_RESULT_METHODS.has(method)) {
        // filter/sort/slice/concat/reverse/flat preserve the proven receiver
        // container for shape attribution; they do not turn a record into one.
        const containers = resolve(callee.expression, file, depth);
        return new Set([...containers].filter(
          (token) => isArrayLikeToken(token) || isSymbolicToken(token),
        ));
      }
      if (!userTarget && isUnshadowedGlobal(callee.expression, 'Object')) {
        if (method === 'values') {
          const arg = call.arguments[0];
          if (!arg) return EMPTY;
          const producer = arrayProducerOf(call, file, 'object-values');
          const wrapValues = (values) => {
            const arrays = new Set();
            for (const value of values) {
              const array = asProducedArray(value, producer);
              if (array) arrays.add(array);
            }
            return arrays;
          };
          const callContext = { file, pos: call.end, owner: flowOwnerOf(call) };
          return withReadContext(callContext, () => {
            let out = EMPTY;
            const literalSource = immutableObjectLiteralOf(arg);
            const argument = literalSource?.literal || arg;
            const argumentFile = literalSource?.file || file;
            for (const token of resolve(argument, argumentFile, depth)) {
              if (isDictionaryToken(token)) {
                const value = asElem(token);
                const array = value ? asProducedArray(value, producer) : null;
                if (array) out = union(out, new Set([array]));
              } else if (isSymbolicToken(token)) {
                const array = asProducedArray(symbolicValues(token), producer);
                if (array) out = union(out, new Set([array]));
              } else if (isArrayLikeToken(token)) {
                // Object.values(array) preserves its element language and one
                // outer array layer, including Product and Plus summaries.
                out = union(out, new Set([token]));
              } else if (isLocalToken(token) || isRecordToken(token)) {
                const values = readElement(
                  new Set([token]),
                  null,
                  siteOf(call, file),
                );
                out = union(out, wrapValues(values));
              }
            }
            return out;
          });
        }
        if (method === 'assign') {
          const targetExpression = call.arguments[0];
          if (!targetExpression) return EMPTY;
          // Object.assign returns the exact target object. Its ordered source
          // effects are attached to that identity by the direct/contextual
          // heap overlay, including setters, nested targets, and later aliases.
          return resolve(targetExpression, file, depth);
        }
      }
      if (!userTarget && isUnshadowedGlobal(callee.expression, 'Promise')
        && method === 'resolve') {
        const value = call.arguments[0]
          ? resolve(call.arguments[0], file, depth + 1)
          : EMPTY;
        return asPromiseTokens(value);
      }
      if (!userTarget) return EMPTY;
    }
    const target = idx.functionOf(callee);
    if (!target) return EMPTY;
    if (isGeneratorFunction(target.fn)) {
      const token = localTokenOf(call, file);
      registerLocalToken(token, EMPTY, EMPTY, new Map());
      const iterator = localRecords.get(token);
      for (const key of ['next', 'return', 'throw']) iterator.intrinsicKeys.add(key);
      return new Set([token]);
    }
    const callContext = { file, pos: call.end, owner: flowOwnerOf(call) };
    // A recursive call reached while building a symbolic function summary must
    // stay in that function-summary SCC. Sending symbolic `@param` paths through
    // the concrete call solver creates an unbounded family of fake concrete
    // contexts (`p`, `p|e`, `p|e|e`, ...), and its local-binding summaries can
    // then lend a parent context to a child. `fnReturns` supplies the current SCC
    // approximation and the ordinary instantiator composes it at this exact call
    // site. Concrete outer reads still use the origin-bounded call solver below.
    if (idx.recursiveContextFunctions.has(target.fn) && functionsEvaluating.size === 0) {
      return withReadContext(
        callContext,
        () => {
          const values = resolveRecursiveCall(target, call, file, depth);
          return isAsyncFunction(target.fn) ? asPromiseTokens(values) : values;
        },
      );
    }
    return withReadContext(callContext, () => {
      // A nested read/call cutoff can replace the current owner's cutoff while
      // the same recursive SCC is still being evaluated. That does not create
      // a new recursion root: use the innermost active version's approximation
      // so deferred local fields participate in the same monotone backedge.
      const activeVersion = [...functionsEvaluating]
        .reverse()
        .find((version) => version.fn === target.fn);
      const raw = activeVersion
        ? functionApprox.get(activeVersion) || EMPTY
        : fnReturns(target.fn, target.file, depth);
      let out = EMPTY;
      for (const token of raw) {
        out = union(out, instantiateSymbolic(token, call, file, depth, target));
      }
      return isAsyncFunction(target.fn) ? asPromiseTokens(out) : out;
    });
  }

  /** All shapes a function-like node's returns resolve to, with symbolic
   * parameter paths preserved until each caller instantiates them. */
  function fnReturns(fn, file, depth) {
    const version = functionVersionOf(fn);
    const prior = functionApprox.get(version) || EMPTY;
    if (functionsEvaluating.has(version)) return prior;
    if (functionEpoch.get(version) === evaluationEpoch) return prior;
    functionEpoch.set(version, evaluationEpoch);
    const priorFrame = sentinelFrames.get(fn);
    functionsEvaluating.add(version);
    try {
      const sentinels = new Map();
      fn.parameters?.forEach((parameter, index) => {
        const root = `@param${index}`;
        if (ts.isIdentifier(parameter.name)) {
          const binding = lookupBinding(parameter.name);
          if (binding) sentinels.set(binding, {
            objects: new Set([root]),
            keys: new Set([paramKeyDomain(index)]),
          });
        } else if (ts.isObjectBindingPattern(parameter.name)) {
          for (const element of parameter.name.elements) {
            if (element.dotDotDotToken || !ts.isIdentifier(element.name)) continue;
            const binding = lookupBinding(element.name);
            const prop = element.propertyName || element.name;
            if (binding && (ts.isIdentifier(prop) || ts.isStringLiteral(prop)
              || ts.isNumericLiteral(prop))) {
              sentinels.set(binding, {
                objects: new Set([symbolicProperty(root, prop.text)]),
                keys: new Set([KEY_UNKNOWN]),
              });
            }
          }
        } else if (ts.isArrayBindingPattern(parameter.name)) {
          for (const element of parameter.name.elements) {
            if (!ts.isBindingElement(element) || !ts.isIdentifier(element.name)) continue;
            const binding = lookupBinding(element.name);
            if (binding) sentinels.set(binding, {
              objects: new Set([symbolicElement(root)]),
              keys: new Set([KEY_UNKNOWN]),
            });
          }
        }
      });
      sentinelFrames.set(fn, sentinels);
      return mergeApproximation(
        functionApprox,
        version,
        returnsOf(fn, file, depth),
      );
    } finally {
      functionsEvaluating.delete(version);
      if (priorFrame) sentinelFrames.set(fn, priorFrame);
      else sentinelFrames.delete(fn);
    }
  }

  function returnsOf(fn, file, depth) {
    const expressions = [];
    if (ts.isArrowFunction(fn) && fn.body && !ts.isBlock(fn.body)) expressions.push(fn.body);
    else {
      const visit = (node) => {
        if (ts.isFunctionLike(node) && node !== fn) return;
        if (ts.isReturnStatement(node) && node.expression) expressions.push(node.expression);
        ts.forEachChild(node, visit);
      };
      if (fn.body) visit(fn.body);
    }
    let out = EMPTY;
    for (const expression of expressions) {
      const boundary = ts.isReturnStatement(expression.parent)
        ? expression.parent
        : expression;
      const context = { file, pos: boundary.end, owner: fn };
      out = union(out, withReadContext(context, () => contextualizeTokens(
        resolve(expression, file, depth + 1),
        new Map([[flowContextId(context), context]]),
      )));
    }
    return out;
  }

  /** Resolve every call-site alternative. There are no silent 40-site, four-
   * shape, or six-return caps: all observed contexts remain distinct tokens. */
  function resolveParam(binding, depth) {
    const prior = paramApprox.get(binding) || EMPTY;
    if (paramsEvaluating.has(binding)) return prior;
    const cacheable = sentinelFrames.size === 0;
    if (cacheable && paramEpoch.get(binding) === evaluationEpoch) return prior;
    if (cacheable) paramEpoch.set(binding, evaluationEpoch);
    paramsEvaluating.add(binding);
    const sites = idx.callSites.get(binding.fn) || [];
    let out = prior;
    try {
      if (binding.index === 0) {
        for (const site of idx.elementCallSites.get(binding.fn) || []) {
          const callContext = {
            file: site.file,
            pos: site.call.end,
            owner: flowOwnerOf(site.call),
          };
          let elements = withReadContext(callContext, () => readElement(
            contextualizeTokens(
              resolve(site.receiver, site.file, depth + 1),
              flowContextsAt(site.call, site.file),
            ),
            null,
            siteOf(site.receiver, site.file),
          ));
          if (binding.prop) elements = readProperty(elements, binding.prop);
          out = union(out, elements);
        }
      }
      for (const site of sites) {
        const explicitSources = site.argumentSources?.get(binding.index);
        if (explicitSources) {
          let argumentTokens = EMPTY;
          for (const source of explicitSources) {
            argumentTokens = union(
              argumentTokens,
              withReadContext({
                file: site.file,
                pos: site.call.end,
                owner: flowOwnerOf(site.call),
              }, () => contextualizeTokens(
                resolve(source, site.file, depth + 1),
                flowContextsAt(site.call, site.file),
              )),
            );
          }
          out = binding.prop
            ? union(out, readProperty(argumentTokens, binding.prop))
            : union(out, argumentTokens);
          continue;
        }
        const effective = effectiveArgument(
          site.args,
          binding.index,
          binding.fn.parameters?.[binding.index],
          site.file,
          binding.file,
        );
        if (!effective) continue;
        const { expression: arg, file: argumentFile } = effective;
        const callContext = {
          file: site.file,
          pos: site.call.end,
          owner: flowOwnerOf(site.call),
        };
        const argumentTokens = withReadContext(callContext, () => contextualizeTokens(
          resolve(arg, argumentFile, depth + 1),
          flowContextsAt(site.call, site.file),
        ));
        if (!binding.prop) {
          out = union(out, argumentTokens);
          continue;
        }
        out = union(out, withReadContext(
          callContext,
          () => readProperty(argumentTokens, binding.prop),
        ));
      }
      return mergeApproximation(paramApprox, binding, out);
    } finally {
      paramsEvaluating.delete(binding);
    }
  }

  function resolveParamKey(binding, depth) {
    const prior = keyParamApprox.get(binding) || EMPTY;
    if (keyParamsEvaluating.has(binding)) return prior;
    const cacheable = sentinelFrames.size === 0;
    if (cacheable && keyParamEpoch.get(binding) === evaluationEpoch) return prior;
    if (cacheable) keyParamEpoch.set(binding, evaluationEpoch);
    keyParamsEvaluating.add(binding);
    const sites = idx.callSites.get(binding.fn) || [];
    let out = prior;
    try {
      for (const site of sites) {
        const effective = effectiveArgument(
          site.args,
          binding.index,
          binding.fn.parameters?.[binding.index],
          site.file,
          binding.file,
        );
        if (!effective) continue;
        const { expression: arg, file: argumentFile } = effective;
        if (!binding.prop) {
          out = union(out, resolveKeyDomain(arg, argumentFile, depth + 1));
          continue;
        }
        const value = unwrap(arg);
        let foundLiteral = false;
        if (ts.isObjectLiteralExpression(value)) {
          for (const property of value.properties) {
            if (ts.isPropertyAssignment(property)
              && ((ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
                && property.name.text === binding.prop)) {
              out = union(out, resolveKeyDomain(property.initializer, argumentFile, depth + 1));
              foundLiteral = true;
            } else if (ts.isShorthandPropertyAssignment(property)
              && property.name.text === binding.prop) {
              out = union(out, resolveKeyDomain(property.name, argumentFile, depth + 1));
              foundLiteral = true;
            }
          }
        }
        if (!foundLiteral) out = union(out, new Set([KEY_UNKNOWN]));
      }
      if (!out.size) out = new Set([KEY_UNKNOWN]);
      return mergeApproximation(keyParamApprox, binding, out);
    } finally {
      keyParamsEvaluating.delete(binding);
    }
  }

  /** Stabilize only the dependency slice demanded by this read. The former
   * eager whole-program sweep reevaluated every binding and every function on
   * every round (minutes on the live estate), even though most declarations
   * cannot contribute to any domain read. These monotone summaries are still a
   * joint least fixed point: recursive edges read the current approximation and
   * the query is replayed until no object OR key-domain approximation grows.
  * The difference is a demand worklist, not a semantic shortcut. */
  function resolveStable(node, file) {
    for (let iteration = 1; iteration <= 128; iteration += 1) {
      evaluationEpoch += 1;
      const before = approximationVersion;
      const out = resolve(node, file, 0);
      observeAbstractTokens(out, 'resolving the reader receiver');
      diagnostics.fixedPointIterations = Math.max(
        diagnostics.fixedPointIterations || 0,
        iteration,
      );
      if (approximationVersion === before) return out;
    }
    if (currentReadBudget?.sawMutableBindingScc) {
      throw new Error(
        `reader-shape mutable binding SCC did not reach a provenance fixed point for ${siteOf(node, file)} in 128 iterations; refusing partial provenance`,
      );
    }
    throw new Error(`reader-shape resolver did not reach a provenance fixed point for ${siteOf(node, file)} in 128 iterations`);
  }

  function inspectNodeRead(receiver, file, key, readNode) {
    const prior = currentReadContext;
    const priorReaderOwner = currentReaderOwner;
    const priorCutoffs = activeCutoffs;
    const priorBudget = currentReadBudget;
    const priorProducerOwners = activeNonEscapingProducerOwners;
    const priorExecutionOwners = activeExecutionOwners;
    const budget = {
      site: siteOf(readNode, file),
      tokens: new Set(),
      maxTokenLength: 0,
      stateGrowth: 0,
      sawMutableBindingScc: false,
    };
    currentReadContext = {
      file,
      // JavaScript evaluates the receiver before performing the property Get.
      // A PropertyAccessExpression's `pos` is the receiver's start, so using
      // it here incorrectly hides calls and heap effects inside chained
      // receivers such as `Object.assign({}, source).field`.
      pos: receiver.end,
      owner: flowOwnerOf(readNode),
      delay: suspensionRangeAt(readNode),
      resume: suspensionRangeAt(readNode, 'yield'),
    };
    currentReaderOwner = currentReadContext.owner;
    activeCutoffs = withAddedCutoff(priorCutoffs, currentReadContext);
    currentReadBudget = budget;
    activeNonEscapingProducerOwners = producerOwnersForReceiver(receiver);
    try {
      const ownerEvents = ts.isFunctionLike(currentReadContext.owner)
        ? invocationEventsBefore(currentReadContext.owner)
        : [];
      activeExecutionOwners = executionOwnersForRead(
        currentReadContext.owner,
        ownerEvents,
        currentReadContext.pos,
      );
      const contexts = ownerEvents.length
        ? ownerEvents.map((event) => withAddedCutoff(event.cutoffs, currentReadContext))
        : [activeCutoffs];
      const uniqueContexts = new Map(
        contexts.map((context) => [cutoffSignatureOf(context), context]),
      );
      let tokens = EMPTY;
      const concrete = {
        records: new Set(),
        knownContainer: false,
        locallyWritten: false,
        missingLocal: false,
      };
      for (const context of uniqueContexts.values()) {
        activeCutoffs = context;
        const resolved = resolveStable(receiver, file);
        tokens = union(tokens, resolved);
        const observed = recordsForRead(resolved, key);
        concrete.records = union(concrete.records, observed.records);
        concrete.knownContainer ||= observed.knownContainer;
        concrete.locallyWritten ||= observed.locallyWritten;
        concrete.missingLocal ||= observed.missingLocal;
      }
      return { tokens, concrete };
    } finally {
      finishReadBudget(budget);
      currentReadBudget = priorBudget;
      activeNonEscapingProducerOwners = priorProducerOwners;
      activeExecutionOwners = priorExecutionOwners;
      activeCutoffs = priorCutoffs;
      currentReaderOwner = priorReaderOwner;
      currentReadContext = prior;
    }
  }

  return {
    resolve: resolveStable,
    readProperty,
    readElement,
    recordsForRead,
    inspectNodeRead,
    origins,
    judgeableOrigins,
    diagnostics,
  };
}

function union(a, b) {
  if (!a.size) return b;
  if (!b.size) return a;
  const out = new Set(a);
  for (const x of b) out.add(x);
  return out;
}

/** True when this property access is the TARGET of a write, not a read. */
function isWriteTarget(node) {
  const p = node.parent;
  if (!p) return false;
  if (ts.isBinaryExpression(p) && p.left === node) {
    const k = p.operatorToken.kind;
    return k === ts.SyntaxKind.EqualsToken || (k >= ts.SyntaxKind.FirstCompoundAssignment && k <= ts.SyntaxKind.LastCompoundAssignment);
  }
  if (ts.isDeleteExpression(p)) return true;
  if ((ts.isPrefixUnaryExpression(p) || ts.isPostfixUnaryExpression(p)) && p.operand === node) return true;
  return false;
}

const staticNodeName = (name) => (
  name && (ts.isIdentifier(name) || ts.isStringLiteral(name)
    || ts.isNumericLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name))
    ? name.text
    : '<computed>'
);

const semanticPrinter = ts.createPrinter({ removeComments: true });
const semanticTextOf = (node, sourceFile) => semanticPrinter
  .printNode(ts.EmitHint.Unspecified, node, sourceFile)
  .replace(/\s+/g, ' ')
  .trim();
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

/** A content-addressed AST site: trivia, line motion, and unrelated statements
 * do not churn identity. The ordinal discriminates only genuinely identical
 * reads inside the same lexical owner; distinct content needs no position salt. */
function semanticSiteOf(node, key, kind, sourceFile) {
  const ownerPart = (candidate) => {
    if (ts.isFunctionDeclaration(candidate) && candidate.name) {
      return `function:${candidate.name.text}`;
    }
    if (ts.isFunctionExpression(candidate) && candidate.name) {
      return `function:${candidate.name.text}`;
    }
    if (ts.isClassDeclaration(candidate) && candidate.name) {
      return `class:${candidate.name.text}`;
    }
    if (ts.isClassExpression(candidate) && candidate.name) {
      return `class:${candidate.name.text}`;
    }
    if (ts.isMethodDeclaration(candidate)) {
      return `method:${staticNodeName(candidate.name)}`;
    }
    if (ts.isGetAccessorDeclaration(candidate)) {
      return `get:${staticNodeName(candidate.name)}`;
    }
    if (ts.isSetAccessorDeclaration(candidate)) {
      return `set:${staticNodeName(candidate.name)}`;
    }
    if (ts.isConstructorDeclaration(candidate)) return 'constructor';
    if (ts.isVariableDeclaration(candidate) && ts.isIdentifier(candidate.name)) {
      const initializer = candidate.initializer ? unwrap(candidate.initializer) : null;
      if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)
        || ts.isClassExpression(initializer))) return `binding:${candidate.name.text}`;
      if (initializer && ts.isObjectLiteralExpression(initializer)) {
        return `object-binding:${candidate.name.text}`;
      }
    }
    if (ts.isPropertyAssignment(candidate)) {
      const initializer = unwrap(candidate.initializer);
      if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)
        || ts.isClassExpression(initializer)) {
        return `property:${staticNodeName(candidate.name)}`;
      }
      if (ts.isObjectLiteralExpression(initializer)) {
        return `object-property:${staticNodeName(candidate.name)}`;
      }
    }
    return null;
  };

  const ownerOrdinal = (candidate) => {
    const part = ownerPart(candidate);
    let scope = candidate.parent;
    while (scope && scope !== sourceFile && !ownerPart(scope)) scope = scope.parent;
    if (!scope) scope = sourceFile;
    let ordinal = 0;
    let found = false;
    const visit = (current) => {
      if (found) return;
      if (current === candidate) {
        found = true;
        return;
      }
      if (current !== scope && ownerPart(current)) {
        if (ownerPart(current) === part) ordinal += 1;
        return;
      }
      ts.forEachChild(current, visit);
    };
    visit(scope);
    return ordinal;
  };

  let anchor = sourceFile;
  for (let current = node.parent; current && current !== sourceFile; current = current.parent) {
    if (ownerPart(current)) { anchor = current; break; }
  }
  const qualified = [];
  for (let current = anchor; current && current !== sourceFile; current = current.parent) {
    const part = ownerPart(current);
    if (part) qualified.push(`${part}#${ownerOrdinal(current)}`);
  }
  qualified.reverse();
  const owner = qualified.length ? qualified.join('/') : 'module';

  const contextOf = (read) => {
    let expression = read;
    for (let current = read; current && current !== anchor; current = current.parent) {
      if (ts.isStatement(current)) return current;
      if (ts.isExpression(current)) expression = current;
    }
    return expression;
  };
  const boundaryOf = (parent, child) => {
    const text = (value) => (value ? semanticTextOf(value, sourceFile) : '');
    if (ts.isIfStatement(parent)) {
      const arm = child === parent.thenStatement ? 'then'
        : child === parent.elseStatement ? 'else' : 'condition';
      return `if:${text(parent.expression)}:${arm}`;
    }
    if (ts.isSwitchStatement(parent)) return `switch:${text(parent.expression)}`;
    if (ts.isCaseClause(parent)) return `case:${text(parent.expression)}`;
    if (ts.isDefaultClause(parent)) return 'case:default';
    if (ts.isForStatement(parent)) {
      const arm = child === parent.statement ? 'body' : 'header';
      return `for:${text(parent.initializer)};${text(parent.condition)};${text(parent.incrementor)}:${arm}`;
    }
    if (ts.isForInStatement(parent) || ts.isForOfStatement(parent)) {
      const arm = child === parent.statement ? 'body' : 'header';
      return `${ts.isForOfStatement(parent) ? 'for-of' : 'for-in'}:${text(parent.initializer)}:${text(parent.expression)}:${arm}`;
    }
    if (ts.isWhileStatement(parent) || ts.isDoStatement(parent)) {
      const arm = child === parent.statement ? 'body' : 'condition';
      return `${ts.isWhileStatement(parent) ? 'while' : 'do'}:${text(parent.expression)}:${arm}`;
    }
    if (ts.isTryStatement(parent)) {
      const arm = child === parent.tryBlock ? 'try'
        : child === parent.catchClause ? 'catch' : 'finally';
      return `try:${arm}`;
    }
    if (ts.isCatchClause(parent)) {
      return `catch:${text(parent.variableDeclaration?.name)}:${child === parent.block ? 'body' : 'binding'}`;
    }
    if (ts.isConditionalExpression(parent)) {
      const arm = child === parent.whenTrue ? 'true'
        : child === parent.whenFalse ? 'false' : 'condition';
      return `conditional:${text(parent.condition)}:${arm}`;
    }
    if (ts.isBinaryExpression(parent)
      && (parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
        || parent.operatorToken.kind === ts.SyntaxKind.BarBarToken
        || parent.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)) {
      const side = child === parent.left ? 'left' : child === parent.right ? 'right' : 'nested';
      const predicate = side === 'right' ? text(parent.left) : text(parent.right);
      return `logical:${parent.operatorToken.getText(sourceFile)}:${side}:${predicate}`;
    }
    if (ts.isPropertyAssignment(parent)) {
      return `property:${staticNodeName(parent.name)}`;
    }
    if (ts.isPropertyDeclaration(parent)) {
      return `class-field:${staticNodeName(parent.name)}`;
    }
    return null;
  };
  const contextHashOf = (read) => {
    const ancestry = [];
    for (let current = read; current && current !== anchor; current = current.parent) {
      const parent = current.parent;
      if (!parent) break;
      const boundary = boundaryOf(parent, current);
      if (boundary) ancestry.push(boundary);
    }
    return sha256(JSON.stringify([
      semanticTextOf(contextOf(read), sourceFile),
      ancestry,
    ]));
  };
  const contextHash = contextHashOf(node);
  const expressionHash = sha256(semanticTextOf(node, sourceFile));
  let ordinal = 0;
  let found = false;
  const visit = (candidate) => {
    if (found) return;
    if (candidate === node) { found = true; return; }
    if (candidate !== anchor && ownerPart(candidate)) return;
    let candidateKind = null;
    let candidateKey = null;
    if (ts.isPropertyAccessExpression(candidate) && ts.isIdentifier(candidate.name)) {
      candidateKind = 'dot';
      candidateKey = candidate.name.text;
    } else if (ts.isElementAccessExpression(candidate)) {
      const staticKey = staticElementKey(candidate.argumentExpression);
      if (staticKey != null) {
        candidateKind = 'element';
        candidateKey = staticKey;
      }
    }
    if (candidateKind === kind && candidateKey === key
      && contextHashOf(candidate) === contextHash
      && sha256(semanticTextOf(candidate, sourceFile)) === expressionHash) {
      ordinal += 1;
    }
    ts.forEachChild(candidate, visit);
  };
  visit(anchor);
  return `v2|owner=${encodeURIComponent(owner)}|context=${contextHash}|expr=${expressionHash}|ordinal=${ordinal}|kind=${kind}|key=${encodeURIComponent(key)}`;
}

/**
 * Scan every property read in `files` against the executed corpus.
 * @returns {{ findings: object[], stats: object }}
 */
export function scanReaders({ files, graph, minRows = 8, root }) {
  const idx = buildIndex(files);
  const diagnostics = {
    computedRecordUnknown: 0,
    objectValuesRecordUnknown: 0,
    depthTruncations: 0,
    cycleCuts: 0,
    resolvedSccBackEdges: 0,
    resolvedBindingVersionBackEdges: 0,
    mutableBindingSccBackEdges: 0,
    rootHeuristicUses: 0,
    materializedLocalFields: 0,
    recursiveArrayProducts: 0,
    recursiveArrayPlusClosures: 0,
    abstractStateBudgetFailures: 0,
    maxReadAbstractTokens: 0,
    maxReadTokenLength: 0,
    maxReadStateGrowth: 0,
  };
  const {
    inspectNodeRead, origins, judgeableOrigins,
  } = makeResolver(idx, graph, minRows, diagnostics);
  const findings = [];
  let reads = 0;
  let resolved = 0;
  let resolvedOrigins = 0;

  for (const [file, sf] of idx.sources) {
    const rel = file.startsWith(root) ? file.slice(root.length + 1).split('\\').join('/') : file;
    const inspectRead = (node, receiver, key, keyNode, kind) => {
      if (BUILTIN_MEMBERS.has(key) || isWriteTarget(node)) return;
      reads += 1;
      const { concrete } = inspectNodeRead(receiver, file, key, node);
      if (!concrete.knownContainer) return;
      resolved += 1;
      const objectOrigins = [...new Set([...concrete.records]
        .map(originOf)
        .filter((origin) => judgeableOrigins.has(origin)))];
      resolvedOrigins += objectOrigins.length;
      const missing = objectOrigins
        .filter((origin) => !origins[origin].keys.includes(key))
        .sort();
      if (!missing.length && !concrete.missingLocal) return;
      const { line } = sf.getLineAndCharacterOfPosition(keyNode.getStart(sf));
      const site = semanticSiteOf(node, key, kind, sf);
      // One row per exact missing origin. Combining caller alternatives into one
      // identity made an unrelated new caller rewrite the old caller's baseline
      // address; separate rows preserve context and let a valid origin coexist
      // with a bad one without suppressing either fact.
      for (const origin of missing) {
        findings.push({
          file: rel,
          line: line + 1,
          pos: keyNode.getStart(sf),
          site,
          key,
          shapes: [origins[origin].label],
          origins: [origin],
          text: node.getText(sf).slice(0, 80).replace(/\s+/g, ' '),
        });
      }
      if (concrete.missingLocal) {
        findings.push({
          file: rel,
          line: line + 1,
          pos: keyNode.getStart(sf),
          site,
          key,
          shapes: ['localObject'],
          origins: ['syntax/local-object'],
          text: node.getText(sf).slice(0, 80).replace(/\s+/g, ' '),
        });
      }
    };
    const visit = (node) => {
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
        inspectRead(node, node.expression, node.name.text, node.name, 'dot');
      } else if (ts.isElementAccessExpression(node)) {
        const key = staticElementKey(node.argumentExpression);
        if (key != null) {
          inspectRead(node, node.expression, key, node.argumentExpression, 'element');
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  findings.sort((a, b) => (
    a.file.localeCompare(b.file) || a.pos - b.pos || a.key.localeCompare(b.key)
  ));
  return {
    findings,
    stats: {
      files: idx.sources.size,
      reads,
      resolved,
      resolvedOrigins,
      unresolved: reads - resolved,
      ...idx.indexStats,
      ...diagnostics,
    },
  };
}
