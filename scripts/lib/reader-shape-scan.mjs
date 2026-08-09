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

const RECORD = 'record:';
const ARRAY = 'array:';
const DICTIONARY = 'dictionary:';
const LOCAL = 'local:';
const FLOW = 'flow:';
const PARAM = '@param';

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
const isRecordToken = (token) => unflowToken(token).startsWith(RECORD);
const isArrayToken = (token) => unflowToken(token).startsWith(ARRAY);
const isDictionaryToken = (token) => unflowToken(token).startsWith(DICTIONARY);
const isLocalToken = (token) => unflowToken(token).startsWith(LOCAL);
const isSymbolicToken = (token) => token.startsWith(PARAM);
const originOf = (token) => {
  const base = unflowToken(token);
  return base.slice(base.indexOf(':') + 1);
};
const arrayElementToken = (token) => {
  const flow = flowParts(token);
  const base = flow?.base || token;
  const element = decodeURIComponent(base.slice(ARRAY.length));
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
const symbolicFlatArray = (token) => `${token}|f`;
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
  if (isRecordToken(token) || isArrayToken(token) || isDictionaryToken(token)
    || isLocalToken(token)) {
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
  if (isArrayToken(token)) return token;
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

const unwrap = (n) => {
  let cur = n;
  for (;;) {
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
  /** @type {Map<ts.Node, {file:string, args:ts.Node[]}[]>} */
  const callSites = new Map();
  /** Named array callbacks are semantic calls whose first argument is one
   * element of the receiver, even though no CallExpression spells that
   * argument. Keep that call context separate from ordinary argument sites. */
  const elementCallSites = new Map();
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

  const propertyNameOf = (element) => {
    const name = element.propertyName || element.name;
    return staticPropertyKey(name);
  };

  const bindVariablePattern = (pattern, initializer, file) => {
    if (ts.isIdentifier(pattern)) {
      const value = initializer ? unwrap(initializer) : null;
      if (value && (ts.isArrowFunction(value) || ts.isFunctionExpression(value))) return;
      if (initializer) {
        bind(pattern, {
          k: 'expr',
          node: initializer,
          file,
          writes: [],
          emptyObject: ts.isObjectLiteralExpression(value) && value.properties.length === 0,
        });
      }
      return;
    }
    if (ts.isObjectBindingPattern(pattern)) {
      for (const element of pattern.elements) {
        if (element.dotDotDotToken || !ts.isIdentifier(element.name)) continue;
        const prop = propertyNameOf(element);
        if (prop != null && initializer) {
          bind(element.name, {
            k: 'property', node: initializer, prop, file, writes: [],
          });
        }
      }
      return;
    }
    if (ts.isArrayBindingPattern(pattern)) {
      pattern.elements.forEach((element) => {
        if (!ts.isBindingElement(element) || !ts.isIdentifier(element.name) || !initializer) return;
        bind(element.name, { k: 'elem', node: initializer, file, writes: [] });
      });
    }
  };

  for (const [file, source] of sources) {
    const visit = (node) => {
      if (ts.isVariableDeclaration(node) && node.initializer) {
        bindVariablePattern(node.name, node.initializer, file);
      }
      if (ts.isForOfStatement(node)) {
        const declarationList = node.initializer;
        if (ts.isVariableDeclarationList(declarationList)) {
          for (const declaration of declarationList.declarations) {
            if (ts.isIdentifier(declaration.name)) {
              bind(declaration.name, {
                k: 'elem', node: node.expression, file, writes: [],
              });
            }
          }
        }
      }
      if (ts.isFunctionLike(node) && node.parameters) {
        functions.add(node);
        let callbackArray = null;
        const parent = node.parent;
        if (parent && ts.isCallExpression(parent) && parent.arguments[0] === node
          && ts.isPropertyAccessExpression(parent.expression)
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
  for (const binding of allBindings) {
    if (binding.k !== 'expr') continue;
    const value = unwrap(binding.node);
    if (!ts.isIdentifier(value)) continue;
    const target = bindings.get(symbolAt(value));
    if (target) unionAliases(binding, target);
  }
  const isObjectAssignCall = (node) => {
    const value = unwrap(node);
    return ts.isCallExpression(value)
      && ts.isPropertyAccessExpression(unwrap(value.expression))
      && ts.isIdentifier(unwrap(value.expression).expression)
      && unwrap(value.expression).expression.text === 'Object'
      && unwrap(value.expression).name.text === 'assign';
  };
  const anchorsByAliasRoot = new Map();
  for (const binding of allBindings) {
    if (binding.k !== 'expr') continue;
    const value = unwrap(binding.node);
    if (!ts.isObjectLiteralExpression(value) && !isObjectAssignCall(value)) continue;
    const root = aliasRoot(binding);
    let anchors = anchorsByAliasRoot.get(root);
    if (!anchors) { anchors = new Set(); anchorsByAliasRoot.set(root, anchors); }
    anchors.add(value);
  }
  const localMutations = new Map();
  let mutationSequence = 0;
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
  const recordLocalMutation = (binding, targetPath, mutation) => {
    const anchors = anchorsByAliasRoot.get(aliasRoot(binding));
    if (!anchors?.size) return false;
    const entry = { ...mutation, sequence: mutationSequence };
    mutationSequence += 1;
    let recorded = false;
    for (const anchor of anchors) {
      const target = constructorAtPath(anchor, targetPath);
      if (!target) continue;
      let mutations = localMutations.get(target);
      if (!mutations) { mutations = []; localMutations.set(target, mutations); }
      mutations.push(entry);
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
      return receiver ? { ...receiver, key: staticElementKey(left.argumentExpression) } : null;
    }
    return null;
  };
  const assignmentMode = (operator) => {
    if (operator === ts.SyntaxKind.EqualsToken) return 'replace';
    if (operator === ts.SyntaxKind.QuestionQuestionEqualsToken) return 'coalesce';
    if (operator === ts.SyntaxKind.BarBarEqualsToken) return 'or';
    if (operator === ts.SyntaxKind.AmpersandAmpersandEqualsToken) return 'and';
    return 'compound';
  };

  // Index writes after declarations so local mutation and genuinely dynamic
  // dictionary construction contribute provenance to the binding they mutate.
  for (const [file, source] of sources) {
    const visit = (node) => {
      if (ts.isBinaryExpression(node)
        && (node.operatorToken.kind === ts.SyntaxKind.EqualsToken
          || (node.operatorToken.kind >= ts.SyntaxKind.FirstCompoundAssignment
            && node.operatorToken.kind <= ts.SyntaxKind.LastCompoundAssignment))) {
        const left = unwrap(node.left);
        if (ts.isIdentifier(left) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
          const binding = bindings.get(symbolAt(left));
          if (binding) binding.writes.push({ kind: 'assign', node: node.right, file });
        } else {
          const target = propertyMutationTarget(left);
          if (target) {
            const local = recordLocalMutation(target.binding, target.path, {
              id: `mutation:${target.key == null ? 'dynamic' : 'field'}:${file}:${left.pos}:${left.end}`,
              kind: target.key == null ? 'dynamic' : 'field',
              key: target.key,
              assignment: assignmentMode(node.operatorToken.kind),
              node: node.right,
              file,
              mutationSite: {
                file, pos: node.pos, end: node.end, owner: flowOwnerOf(node),
              },
            });
            if (!local && target.key == null && target.path.length === 0) {
              target.binding.writes.push({ kind: 'dictionary', node: node.right, file });
            }
          }
        }
      }
      if (ts.isDeleteExpression(node)) {
        const target = propertyMutationTarget(unwrap(node.expression));
        if (target) recordLocalMutation(target.binding, target.path, {
          id: `mutation:${target.key == null ? 'dynamic-delete' : 'delete'}:${file}:${node.pos}:${node.end}`,
          kind: target.key == null ? 'dynamicDelete' : 'delete',
          key: target.key,
          file,
          mutationSite: {
            file, pos: node.pos, end: node.end, owner: flowOwnerOf(node),
          },
        });
      }
      if (ts.isCallExpression(node) && isObjectAssignCall(node) && node.arguments.length) {
        const target = unwrap(node.arguments[0]);
        const receiver = accessRootAndPath(target);
        if (receiver) {
            node.arguments.slice(1).forEach((argument, index) => {
              recordLocalMutation(receiver.binding, receiver.path, {
                id: `mutation:assign:${file}:${node.pos}:${index}`,
                kind: 'spread',
                node: argument,
                file,
                mutationSite: {
                  file, pos: node.pos, end: node.end, owner: flowOwnerOf(node),
                },
              });
            });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  // Symbol-resolved, uncapped call-site index.
  for (const [file, source] of sources) {
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const callee = unwrap(node.expression);
        if (ts.isPropertyAccessExpression(callee)
          && ELEMENT_CB_METHODS.has(callee.name.text) && node.arguments[0]) {
          const callback = functionOf(unwrap(node.arguments[0]));
          if (callback) {
            let elementSites = elementCallSites.get(callback.fn);
            if (!elementSites) { elementSites = []; elementCallSites.set(callback.fn, elementSites); }
            elementSites.push({ file, receiver: callee.expression, call: node });
            indexStats.indexedElementCallSites += 1;
          }
        }
        const target = functionOf(unwrap(node.expression));
        if (target) {
          let sites = callSites.get(target.fn);
          if (!sites) { sites = []; callSites.set(target.fn, sites); }
          sites.push({ file, args: [...node.arguments], call: node });
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
      for (const recursive of component) recursiveFunctions.add(recursive);
    }
  };
  for (const fn of functions) if (!tarjanIndex.has(fn)) strongConnect(fn);

  const bindingOf = (identifier) => {
    const direct = bindings.get(symbolAt(identifier));
    if (direct) return direct;
    // `checker.getSymbolAtLocation` names the object-literal PROPERTY for a
    // shorthand (`{ value }`), not the lexical value binding it reads. Ask the
    // checker for that value symbol explicitly so lazy and eager field reads
    // both retain parameter/local provenance.
    const parent = identifier.parent;
    if (parent && ts.isShorthandPropertyAssignment(parent) && parent.name === identifier) {
      const valueSymbol = canonicalSymbol(checker.getShorthandAssignmentValueSymbol(parent));
      return bindings.get(valueSymbol) || null;
    }
    return null;
  };

  return {
    sources,
    checker,
    callSites,
    elementCallSites,
    indexStats,
    allBindings,
    functions,
    recursiveFunctions,
    localMutations,
    bindingOf,
    functionOf,
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
  let approximationVersion = 0;
  let evaluationEpoch = 0;
  let currentReadContext = null;
  const diagnosticSites = new Map();
  const siteOf = (node, file) => (node ? `${file}:${node.pos}:${node.end}` : null);
  const bump = (key, site = null) => {
    if (site) {
      let sites = diagnosticSites.get(key);
      if (!sites) { sites = new Set(); diagnosticSites.set(key, sites); }
      if (sites.has(site)) return;
      sites.add(site);
    }
    diagnostics[key] = (diagnostics[key] || 0) + 1;
  };

  const arrays = graph.arrays || {};
  const flowContextId = ({ file, owner }) => (
    `${file}:${owner?.pos ?? 'none'}:${owner?.end ?? 'none'}`
  );
  const mutationVisible = (step, flowContexts = null) => {
    const mutation = step.mutationSite;
    if (!mutation) return true;
    const inherited = flowContexts?.get(flowContextId(mutation));
    if (inherited) return mutation.end <= inherited.pos;
    if (!currentReadContext || mutation.file !== currentReadContext.file
      || mutation.owner !== currentReadContext.owner) return true;
    return mutation.end <= currentReadContext.pos;
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

  /** Unknown-key traversal and Object.values must cover the complete
   * traversable value surface of an impure ledger. `dynamicValues` describes
   * its id-keyed subset; fixed metadata/summary fields remain real alternatives
   * and are retained from the ordinary field graph. */
  const tokensOfRecordValues = (origin) => {
    let out = EMPTY;
    for (const descriptors of Object.values(origin?.fields || {})) {
      for (const descriptor of descriptors) out = union(out, tokensOfDescriptor(descriptor));
    }
    for (const descriptor of origin?.dynamicValues || []) {
      out = union(out, tokensOfDescriptor(descriptor));
    }
    return out;
  };

  const rootTokens = new Map();
  for (const [name, descriptors] of Object.entries(graph.roots)) {
    let out = EMPTY;
    for (const descriptor of descriptors) out = union(out, tokensOfDescriptor(descriptor));
    rootTokens.set(name, out);
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
  const localTokenOf = (node, file) => `${LOCAL}${encodeURIComponent(file)}:${node.pos}`;
  const registerLocalToken = (
    token,
    bases,
    written,
    fields,
    sourceToken = token,
    fieldSources = new Map(),
    overlaySteps = [],
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
        sourceToken,
        view: null,
      };
      localRecords.set(token, record);
    }
    let grew = false;
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
        const next = step.kind === 'spread'
          ? { ...step, tokens: new Set([...step.tokens].filter((base) => base !== token)) }
          : { ...step };
        record.overlaySteps.push(next);
        record.overlayStepById.set(step.id, next);
        grew = true;
        continue;
      }
      if (step.kind !== 'spread' || registered.kind !== 'spread') continue;
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
    if (grew) approximationVersion += 1;
    return token;
  };
  const registerLocal = (
    node, file, bases, written, fields, fieldSources = new Map(), overlaySteps = [],
  ) => registerLocalToken(
    localTokenOf(node, file), bases, written, fields, localTokenOf(node, file), fieldSources,
    overlaySteps,
  );
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
        sourceToken,
        view,
      };
      localRecords.set(token, record);
      approximationVersion += 1;
      return token;
    }
    if (record.view?.kind === 'callback' && view.kind === 'callback') {
      const priorSize = record.view.elementTokens.size;
      record.view.elementTokens = union(record.view.elementTokens, view.elementTokens);
      if (record.view.elementTokens.size !== priorSize) approximationVersion += 1;
    }
    return token;
  };

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
        const addition = record.view.kind === 'call'
          ? instantiateSymbolic(
            token,
            record.view.call,
            record.view.file,
            0,
            record.view.target,
          )
          : instantiateCallbackSymbolic(
            token,
            record.view.elementTokens,
            record.view.diagnosticSite,
          );
        const next = union(prior, addition);
        if (next.size !== prior.size) {
          approximations.set(token, next);
          approximationVersion += 1;
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
  const flowContextsOf = (token) => {
    const flow = flowParts(token);
    return flow ? flowContextsByHash.get(flow.hash) || new Map() : new Map();
  };
  const sameFlowContexts = (left, right) => (
    left.size === right.size
    && [...left].every(([id, context]) => right.get(id)?.pos === context.pos)
  );
  const contextualizeTokens = (tokens, inheritedContexts) => {
    if (!inheritedContexts?.size || !tokens.size) return tokens;
    const out = new Set();
    for (const token of tokens) {
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
      // Only writes to a statically identifiable property can transfer exact
      // named-field state across a call boundary. Unknown-key mutations remain
      // conservative alternatives and must not turn structure-preserving
      // recursive copies into an unbounded cross-product of call-stack tokens.
      if (!evaluation.source?.hasFlowSensitiveMutations) {
        out.add(token);
        continue;
      }
      const existing = existingFlow
        ? flowContextsByHash.get(existingFlow.hash) || new Map()
        : new Map();
      const combined = new Map(existing);
      for (const [id, context] of inheritedContexts) combined.set(id, context);
      if (sameFlowContexts(existing, combined) && existingFlow) {
        out.add(token);
        continue;
      }
      const identity = JSON.stringify([
        baseToken,
        [...combined]
          .map(([id, context]) => [id, context.pos])
          .sort(([a], [b]) => a.localeCompare(b)),
      ]);
      let destination = flowLocalTokens.get(identity);
      if (!destination) {
        const hash = sha256(identity);
        destination = flowToken(baseToken, hash);
        flowLocalTokens.set(identity, destination);
        flowContextsByHash.set(hash, combined);
        approximationVersion += 1;
      }
      out.add(destination);
    }
    return out;
  };
  const flowContextsAt = (node, file) => {
    const context = { file, pos: node.end, owner: flowOwnerOf(node) };
    return new Map([[flowContextId(context), context]]);
  };

  /** A recursive map over a dynamic-key object clone has the regular shape
   * `array+(local)`. Replaying a monotone function summary used to spell that
   * regular language as an infinite family (`array:local`,
   * `array:array:local`, ...). Preserve the first concrete array layer and make
   * only the SAME producer site idempotent when it receives its own prior
   * product. The dynamic local remains traversable, while distinct syntax sites
   * still retain exact nesting depth. Source-position filtering is load-bearing:
   * a future computed write cannot justify the widening for an earlier read. */
  const mappedArrayProducerSites = new Map();
  const hasPureDynamicLocalLeaf = (token) => {
    let leaf = token;
    while (isArrayToken(leaf)) leaf = arrayElementToken(leaf);
    if (!isLocalToken(leaf)) return false;
    const local = localRecords.get(unflowToken(leaf));
    const source = local ? localEvaluationOf(local).source : null;
    if (!source || source.bases.size) return false;
    const flowContexts = flowContextsOf(leaf);
    let sawDynamicWrite = false;
    for (const step of source.overlaySteps) {
      if (step.mutation && !mutationVisible(step, flowContexts)) continue;
      if (step.kind === 'dynamic') {
        sawDynamicWrite = true;
        continue;
      }
      if (step.kind === 'dynamicDelete') continue;
      return false;
    }
    return sawDynamicWrite;
  };
  const asMappedArray = (token, producerSite) => {
    const repeated = mappedArrayProducerSites.get(token)?.has(producerSite) || false;
    const pureDynamic = repeated && hasPureDynamicLocalLeaf(token);
    if (pureDynamic) return token;
    const array = asArray(token);
    if (!array) return null;
    let sites = mappedArrayProducerSites.get(array);
    if (!sites) {
      sites = new Set();
      mappedArrayProducerSites.set(array, sites);
    }
    sites.add(producerSite);
    return array;
  };
  const withReadContext = (context, evaluate) => {
    const prior = currentReadContext;
    currentReadContext = context;
    try {
      return evaluate();
    } finally {
      currentReadContext = prior;
    }
  };
  const tokenNeedsInstantiation = (token, seen = new Set()) => {
    if (isSymbolicToken(token)) return true;
    const flow = flowParts(token);
    if (flow) return tokenNeedsInstantiation(flow.base, seen);
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

  /** Every object-spread/Object.assign operand is an alternative runtime
   * source, while the operands themselves apply in source order. `keys` means
   * an executed origin MAY carry a key; only `requiredKeys` proves that every
   * instance carries it and can therefore erase the prior writer. Legacy
   * graphs have no required-key proof and conservatively retain the fallback. */
  function propertyFacetForToken(token, key, seenLocals, includeValues) {
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
    if (isArrayToken(token)) {
      const numeric = /^(?:0|[1-9]\d*)$/.test(key) && Number(key) < 0xffff_ffff;
      const value = numeric ? asElem(token) : null;
      return {
        ...emptyPropertyFacet(),
        values: includeValues && value ? new Set([value]) : EMPTY,
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
      const demand = `${token}|${includeValues ? 'p' : 'r'}:${encodeURIComponent(key)}`;
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
        let state = emptyPropertyFacet();
        const nextSeen = new Set(seenLocals).add(token);
        for (const step of source.overlaySteps) {
          if (step.mutation && !mutationVisible(step, flowContexts)) continue;
          if (step.kind === 'delete') {
            if (step.key === key) state = emptyPropertyFacet();
            continue;
          }
          if (step.kind === 'dynamicDelete') {
            state = { ...state, mayAbsent: true };
            continue;
          }
          let incoming;
          if (step.kind === 'field') {
            if (step.key !== key) continue;
            const values = includeValues
              ? contextualizeTokens(
                instantiateViewTokens(
                  evaluation.instantiator,
                  materializeLocalField(source, step.fieldId),
                ),
                flowContexts,
              )
              : EMPTY;
            if (step.assignment === 'coalesce' || step.assignment === 'or') {
              state = {
                values: union(state.values, values),
                presentRecords: state.presentRecords,
                absentRecords: EMPTY,
                missingLocal: false,
                locallyWritten: true,
                mayPresent: true,
                mayAbsent: false,
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
            incoming = {
              ...emptyPropertyFacet(),
              values: includeValues
                ? contextualizeTokens(
                  instantiateViewTokens(
                    evaluation.instantiator,
                    materializeLocalField(source, step.fieldId),
                  ),
                  flowContexts,
                )
                : EMPTY,
              locallyWritten: true,
              mayPresent: true,
            };
          } else {
            incoming = propertyFacetForTokens(
              contextualizeTokens(
                instantiateViewTokens(evaluation.instantiator, step.tokens),
                flowContexts,
              ),
              key,
              nextSeen,
              includeValues,
            );
            if (step.unknownSource) {
              incoming = { ...incoming, mayPresent: true, mayAbsent: true };
            }
          }

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
        // A concrete executed origin is the more precise writer identity for a
        // spread-derived miss. Keep syntax/local-object for genuinely local
        // absence, but do not duplicate the same miss against the empty target
        // of `Object.assign({}, executedRecord)`.
        if (state.absentRecords.size) {
          state.missingLocal = false;
        } else if (!state.mayPresent) {
          state.missingLocal = true;
        }
        const priorFacet = approximations.get(demand);
        if (!priorFacet || !samePropertyFacet(priorFacet, state)) {
          approximations.set(demand, state);
          approximationVersion += 1;
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
    return {
      values,
      presentRecords: observed ? new Set([token]) : EMPTY,
      absentRecords: required ? EMPTY : new Set([token]),
      missingLocal: false,
      locallyWritten: false,
      mayPresent: observed,
      mayAbsent: !required,
    };
  }

  function propertyFacetForTokens(tokens, key, seenLocals, includeValues) {
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
      const facet = propertyFacetForToken(token, key, seenLocals, includeValues);
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
          const origin = origins[originOf(token)];
          const dynamic = tokensOfRecordValues(origin);
          if (dynamic.size) out = union(out, dynamic);
          else bump('computedRecordUnknown', diagnosticSite);
        }
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
            // spread. Preserve all alternatives without retyping the object as
            // a homogeneous dictionary.
            for (const step of source.overlaySteps) {
              if (step.mutation && !mutationVisible(step, flowContexts)) continue;
              if (step.kind === 'field' || step.kind === 'dynamic') {
                if (step.kind === 'field' && step.assignment === 'compound') continue;
                out = union(out, contextualizeTokens(
                  instantiateViewTokens(
                    evaluation.instantiator,
                    materializeLocalField(source, step.fieldId),
                  ),
                  flowContexts,
                ));
              } else if (step.kind === 'spread') {
                out = union(out, readElement(
                  contextualizeTokens(
                    instantiateViewTokens(evaluation.instantiator, step.tokens),
                    flowContexts,
                  ),
                  null,
                  diagnosticSite,
                  nextSeen,
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
        records.add(token);
        knownContainer = true;
      } else if (isLocalToken(token)) {
        knownContainer = true;
        const facet = propertyFacetForToken(token, key, seen, false);
        for (const record of facet.presentRecords) records.add(record);
        for (const record of facet.absentRecords) records.add(record);
        locallyWritten ||= facet.locallyWritten;
        missingLocal ||= facet.missingLocal;
      } else if (isArrayToken(token) || isDictionaryToken(token)) {
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

  const lookupBinding = (identifier) => idx.bindingOf(identifier);
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
  const mergeApproximation = (map, subject, addition) => {
    const prior = map.get(subject) || EMPTY;
    const next = union(prior, addition);
    if (next.size !== prior.size) {
      map.set(subject, next);
      approximationVersion += 1;
    }
    return next;
  };

  const functionContextId = (fn) => (
    `${fn.getSourceFile().fileName}:${fn.pos}:${fn.end}`
  );
  const bindingContextId = (binding) => JSON.stringify([
    binding.k,
    binding.file,
    binding.index ?? null,
    binding.prop ?? null,
    binding.node?.pos ?? null,
  ]);

  /** Capture the exact symbolic/concrete parameter frame in which an object
   * literal was declared. Field initializers are evaluated only on demand, so
   * replaying this frame is what prevents a later caller from lending the field
   * a different parameter origin. The JSON key deduplicates identical frames
   * across fixed-point rounds; the cloned sets remain immutable snapshots. */
  function captureLocalFieldContext() {
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
    const evaluatingRows = [...evaluatingFunctions].map(functionContextId).sort();
    return {
      key: JSON.stringify([frameRows, evaluatingRows]),
      frames,
      evaluatingFunctions,
    };
  }

  function withLocalFieldContext(context, evaluate) {
    const priorFrames = [...sentinelFrames];
    const priorFunctions = [...functionsEvaluating];
    sentinelFrames.clear();
    functionsEvaluating.clear();
    for (const [fn, frame] of context.frames) sentinelFrames.set(fn, frame);
    for (const fn of context.evaluatingFunctions) functionsEvaluating.add(fn);
    try {
      return evaluate();
    } finally {
      sentinelFrames.clear();
      functionsEvaluating.clear();
      for (const [fn, frame] of priorFrames) sentinelFrames.set(fn, frame);
      for (const fn of priorFunctions) functionsEvaluating.add(fn);
    }
  }

  /** Resolve one syntax-owned field only when a consumer asks for its value.
   * Written-key ownership itself never calls this function. Approximations are
   * monotone and epoch-memoized exactly like function/binding summaries. */
  function materializeLocalField(record, fieldId) {
    const prior = record.fields.get(fieldId) || EMPTY;
    const sources = record.fieldSources.get(fieldId);
    if (!sources?.size) return prior;
    let evaluating = localFieldsEvaluating.get(record);
    if (!evaluating) {
      evaluating = new Set();
      localFieldsEvaluating.set(record, evaluating);
    }
    if (evaluating.has(fieldId)) return prior;
    let epochs = localFieldEpoch.get(record);
    if (!epochs) {
      epochs = new Map();
      localFieldEpoch.set(record, epochs);
    }
    if (epochs.get(fieldId) === evaluationEpoch) return prior;
    epochs.set(fieldId, evaluationEpoch);
    evaluating.add(fieldId);
    bump('materializedLocalFields', `${record.sourceToken}:${fieldId}`);
    let addition = EMPTY;
    try {
      for (const source of sources.values()) {
        let values = EMPTY;
        if (source.kind === 'expression') {
          values = withLocalFieldContext(
            source.context,
            () => resolve(source.node, source.file, 0),
          );
        }
        addition = union(addition, values);
      }
      const next = union(prior, addition);
      if (next.size !== prior.size) {
        record.fields.set(fieldId, next);
        approximationVersion += 1;
      }
      return next;
    } finally {
      evaluating.delete(fieldId);
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
      if (mutation.kind === 'spread') {
        const tokens = resolve(mutation.node, mutation.file, depth + 1);
        nextBases = union(nextBases, tokens);
        overlaySteps.push({
          id: mutation.id,
          kind: 'spread',
          tokens,
          unknownSource: !tokens.size && !(
            ts.isObjectLiteralExpression(unwrap(mutation.node))
            && unwrap(mutation.node).properties.length === 0
          ),
          mutation: true,
          mutationSite: mutation.mutationSite,
        });
        continue;
      }
      if (mutation.kind === 'delete' || mutation.kind === 'dynamicDelete') {
        overlaySteps.push({
          id: mutation.id,
          kind: mutation.kind,
          key: mutation.key,
          mutation: true,
          mutationSite: mutation.mutationSite,
        });
        continue;
      }
      const fieldId = mutation.id;
      if (mutation.kind === 'field') written.add(mutation.key);
      overlaySteps.push({
        id: mutation.id,
        kind: mutation.kind,
        key: mutation.key,
        fieldId,
        assignment: mutation.assignment,
        mutation: true,
        mutationSite: mutation.mutationSite,
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
    if (binding.k === 'param' && sentinelFrames.has(binding.fn)) {
      return sentinelFrames.get(binding.fn).get(binding)?.keys || EMPTY;
    }
    return resolveKeyBinding(binding, depth + 1);
  }

  function computeKeyBinding(binding, depth) {
    let out = EMPTY;
    if (binding.k === 'expr') out = resolveKeyDomain(binding.node, binding.file, depth + 1);
    else if (binding.k === 'param') out = resolveParamKey(binding, depth + 1);
    for (const write of binding.writes || []) {
      if (write.kind === 'assign') {
        out = union(out, resolveKeyDomain(write.node, write.file, depth + 1));
      }
    }
    return out;
  }

  function resolveKeyBinding(binding, depth) {
    const prior = keyBindingApprox.get(binding) || EMPTY;
    if (keyBindingsEvaluating.has(binding)) return prior;
    const cacheable = sentinelFrames.size === 0;
    if (cacheable && keyBindingEpoch.get(binding) === evaluationEpoch) return prior;
    if (cacheable) keyBindingEpoch.set(binding, evaluationEpoch);
    keyBindingsEvaluating.add(binding);
    try {
      return mergeApproximation(keyBindingApprox, binding, computeKeyBinding(binding, depth + 1));
    } finally {
      keyBindingsEvaluating.delete(binding);
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

  function computeBinding(binding, depth) {
    let out = EMPTY;
    if (binding.k === 'expr') out = resolve(binding.node, binding.file, depth + 1);
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
              (token) => isArrayToken(token) || isSymbolicToken(token),
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

    for (const write of binding.writes || []) {
      const value = resolve(write.node, write.file, depth + 1);
      if (write.kind === 'assign') {
        out = union(out, value);
      } else if (write.kind === 'dictionary') {
        const dictionaries = new Set();
        for (const token of value) {
          if (isRecordToken(token)) dictionaries.add(dictionaryToken(originOf(token)));
        }
        out = union(out, dictionaries);
      }
    }
    return out;
  }

  function resolveBinding(binding, depth) {
    const prior = bindingApprox.get(binding) || EMPTY;
    if (bindingsEvaluating.has(binding)) return prior;
    const cacheable = sentinelFrames.size === 0;
    if (cacheable && bindingEpoch.get(binding) === evaluationEpoch) return prior;
    if (cacheable) bindingEpoch.set(binding, evaluationEpoch);
    bindingsEvaluating.add(binding);
    try {
      return mergeApproximation(bindingApprox, binding, computeBinding(binding, depth + 1));
    } finally {
      bindingsEvaluating.delete(binding);
    }
  }

  /** @returns {Set<string>} exact origin/container tokens */
  function resolve(node, file, depth = 0) {
    if (!node) return EMPTY;
    if (depth > 64) { bump('depthTruncations', siteOf(node, file)); return EMPTY; }
    const n = unwrap(node);

    if (ts.isIdentifier(n)) {
      const binding = lookupBinding(n);
      let viaBinding = EMPTY;
      if (binding && binding.k === 'param' && sentinelFrames.has(binding.fn)) {
        return sentinelFrames.get(binding.fn).get(binding)?.objects || EMPTY;
      }
      if (binding) {
        viaBinding = resolveBinding(binding, depth + 1);
      }
      if (viaBinding.size) return viaBinding;
      if (binding) {
        // An exported/entry helper can have no in-estate caller. Seed only that
        // explicit boundary parameter when its identifier exactly names an
        // executed root. Never use the root heuristic to recover from a failed
        // local binding/cycle: that was retyping locals precisely where
        // provenance had been lost.
        const sites = binding.k === 'param' ? (idx.callSites.get(binding.fn) || []) : [];
        const root = rootTokens.get(n.text);
        if (binding.k === 'param' && sites.length === 0 && root?.size) {
          bump('rootHeuristicUses', siteOf(n, file));
          return new Set(root);
        }
        return EMPTY;
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
      for (const element of n.elements) elements = union(elements, resolve(element, file, depth + 1));
      const out = new Set();
      for (const token of elements) {
        const array = asArray(token);
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
      const fieldContext = captureLocalFieldContext();
      for (const property of n.properties) {
        if (ts.isSpreadAssignment(property)) {
          const tokens = resolve(property.expression, file, depth + 1);
          bases = union(bases, tokens);
          overlaySteps.push({
            id: `spread:${property.pos}:${property.end}`,
            kind: 'spread',
            tokens,
            unknownSource: !tokens.size && !(
              ts.isObjectLiteralExpression(unwrap(property.expression))
              && unwrap(property.expression).properties.length === 0
            ),
          });
          continue;
        }
        const key = staticPropertyKey(property.name);
        if (key == null) continue;
        written.add(key);
        const fieldId = `field:${property.pos}:${property.end}`;
        overlaySteps.push({
          id: fieldId,
          kind: 'field',
          key,
          fieldId,
        });
        let initializer = null;
        if (ts.isPropertyAssignment(property)) {
          initializer = property.initializer;
        } else if (ts.isShorthandPropertyAssignment(property)) {
          initializer = property.name;
        }
        if (initializer) {
          let sources = fieldSources.get(fieldId);
          if (!sources) {
            sources = new Map();
            fieldSources.set(fieldId, sources);
          }
          const sourceKey = `expression:${fieldContext.key}:${file}:${initializer.pos}:${initializer.end}`;
          sources.set(sourceKey, {
            kind: 'expression',
            node: initializer,
            file,
            context: fieldContext,
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
      if (!tokenNeedsInstantiation(token)) return new Set([token]);
      const local = localRecords.get(token);
      if (!local) return EMPTY;
      const sourceToken = local.sourceToken || token;
      const destination = `${LOCAL}inst:${encodeURIComponent(file)}:${call.pos}:${encodeURIComponent(sourceToken)}`;
      const priorToken = localMap.get(token);
      if (priorToken) return new Set([priorToken]);
      localMap.set(token, destination);
      registerLocalView(destination, sourceToken, {
        kind: 'call', call, file, target,
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
    const signature = signatureParts.join('|');
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
        approximationVersion += 1;
      }
      return next;
    } finally {
      if (priorFrame) sentinelFrames.set(target.fn, priorFrame);
      else sentinelFrames.delete(target.fn);
      evaluating.delete(signature);
    }
  }

  function resolveCall(call, file, depth) {
    const callee = unwrap(call.expression);
    if (ts.isPropertyAccessExpression(callee)) {
      const method = callee.name.text;
      if (method === 'map' || method === 'flatMap') {
        const receivers = resolve(callee.expression, file, depth);
        const containers = new Set([...receivers].filter(
          (token) => isArrayToken(token) || isSymbolicToken(token),
        ));
        if (!containers.size) return EMPTY;
        const callback = call.arguments[0] ? unwrap(call.arguments[0]) : null;
        let mapped = EMPTY;
        if (callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) {
          mapped = returnsOf(callback, file, depth);
        } else if (callback) {
          const target = idx.functionOf(callback);
          if (target) {
            const elements = readElement(
              containers,
              null,
              siteOf(call, file),
            );
            for (const token of fnReturns(target.fn, target.file, depth)) {
              mapped = union(mapped, instantiateCallbackSymbolic(
                token,
                elements,
                siteOf(call, file),
              ));
            }
          }
        }
        const out = new Set();
        for (const token of mapped) {
          const array = method === 'flatMap'
            ? asFlatMapResult(token)
            : asMappedArray(token, siteOf(call, file));
          if (array) out.add(array);
        }
        return out;
      }
      if (ELEMENT_RESULT_METHODS.has(method)) {
        return readElement(resolve(callee.expression, file, depth));
      }
      if (method === 'concat') {
        const out = new Set([...resolve(callee.expression, file, depth)]
          .filter((token) => isArrayToken(token) || isSymbolicToken(token)));
        for (const arg of call.arguments) {
          for (const token of resolve(arg, file, depth)) {
            if (isArrayToken(token) || isSymbolicToken(token)) out.add(token);
            else {
              const array = asArray(token);
              if (array) out.add(array);
            }
          }
        }
        return out;
      }
      if (method === 'flat') {
        const depthArg = call.arguments[0] ? unwrap(call.arguments[0]) : null;
        const levels = depthArg && ts.isNumericLiteral(depthArg)
          ? Math.max(0, Math.min(16, Math.floor(Number(depthArg.text))))
          : 1;
        const out = new Set();
        for (const token of resolve(callee.expression, file, depth)) {
          if (!isArrayToken(token)) { if (isSymbolicToken(token)) out.add(token); continue; }
          let flattened = token;
          for (let level = 0; level < levels; level += 1) {
            const element = asElem(flattened);
            if (!element || !isArrayToken(element)) break;
            flattened = element;
          }
          out.add(flattened);
        }
        return out;
      }
      if (ARRAY_RESULT_METHODS.has(method)) {
        // filter/sort/slice/concat/reverse/flat preserve the proven receiver
        // container for shape attribution; they do not turn a record into one.
        const containers = resolve(callee.expression, file, depth);
        return new Set([...containers].filter(
          (token) => isArrayToken(token) || isSymbolicToken(token),
        ));
      }
      if (ts.isIdentifier(callee.expression) && callee.expression.text === 'Object') {
        if (method === 'values') {
          let out = EMPTY;
          for (const arg of call.arguments) {
            for (const token of resolve(arg, file, depth)) {
              if (isDictionaryToken(token)) {
                const value = asElem(token);
                const array = value ? asArray(value) : null;
                if (array) out = union(out, new Set([array]));
              } else if (isSymbolicToken(token)) {
                out = union(out, new Set([symbolicArray(symbolicElement(token))]));
              } else if (isLocalToken(token)) {
                const arrays = new Set();
                for (const value of readElement(
                  new Set([token]),
                  null,
                  siteOf(call, file),
                )) {
                  const array = asArray(value);
                  if (array) arrays.add(array);
                }
                out = union(out, arrays);
              } else {
                const origin = isRecordToken(token) ? origins[originOf(token)] : null;
                const values = tokensOfRecordValues(origin);
                if (values.size) {
                  const arrays = new Set();
                  for (const value of values) {
                    const array = asArray(value);
                    if (array) arrays.add(array);
                  }
                  out = union(out, arrays);
                } else {
                  bump('objectValuesRecordUnknown', siteOf(call, file));
                }
              }
            }
          }
          return out;
        }
        if (method === 'assign') {
          let bases = EMPTY;
          const written = new Set();
          const fields = new Map();
          const fieldSources = new Map();
          const overlaySteps = [];
          const fieldContext = captureLocalFieldContext();
          for (const [index, arg] of call.arguments.entries()) {
            const tokens = resolve(arg, file, depth);
            bases = union(bases, tokens);
            overlaySteps.push({
              id: `assign:${index}:${arg.pos}:${arg.end}`,
              kind: 'spread',
              tokens,
              unknownSource: !tokens.size && !(
                ts.isObjectLiteralExpression(unwrap(arg))
                && unwrap(arg).properties.length === 0
              ),
            });
          }
          bases = appendIndexedLocalMutations(
            call,
            depth,
            fieldContext,
            bases,
            written,
            fieldSources,
            overlaySteps,
          );
          return new Set([
            registerLocal(call, file, bases, written, fields, fieldSources, overlaySteps),
          ]);
        }
      }
      return EMPTY;
    }
    const target = idx.functionOf(callee);
    if (!target) return EMPTY;
    // A recursive call reached while building a symbolic function summary must
    // stay in that function-summary SCC. Sending symbolic `@param` paths through
    // the concrete call solver creates an unbounded family of fake concrete
    // contexts (`p`, `p|e`, `p|e|e`, ...), and its local-binding summaries can
    // then lend a parent context to a child. `fnReturns` supplies the current SCC
    // approximation and the ordinary instantiator composes it at this exact call
    // site. Concrete outer reads still use the origin-bounded call solver below.
    if (idx.recursiveFunctions.has(target.fn) && functionsEvaluating.size === 0) {
      return resolveRecursiveCall(target, call, file, depth);
    }
    const raw = fnReturns(target.fn, target.file, depth);
    let out = EMPTY;
    for (const token of raw) {
      out = union(out, instantiateSymbolic(token, call, file, depth, target));
    }
    return out;
  }

  /** All shapes a function-like node's returns resolve to, with symbolic
   * parameter paths preserved until each caller instantiates them. */
  function fnReturns(fn, file, depth) {
    const prior = functionApprox.get(fn) || EMPTY;
    if (functionsEvaluating.has(fn)) return prior;
    if (functionEpoch.get(fn) === evaluationEpoch) return prior;
    functionEpoch.set(fn, evaluationEpoch);
    const priorFrame = sentinelFrames.get(fn);
    functionsEvaluating.add(fn);
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
        fn,
        returnsOf(fn, file, depth),
      );
    } finally {
      functionsEvaluating.delete(fn);
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
      out = union(out, resolve(expression, file, depth + 1));
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
      diagnostics.fixedPointIterations = Math.max(
        diagnostics.fixedPointIterations || 0,
        iteration,
      );
      if (approximationVersion === before) return out;
    }
    throw new Error(`reader-shape resolver did not reach a provenance fixed point for ${siteOf(node, file)} in 128 iterations`);
  }

  function inspectNodeRead(receiver, file, key, readNode) {
    const prior = currentReadContext;
    currentReadContext = {
      file,
      pos: readNode.pos,
      owner: flowOwnerOf(readNode),
    };
    try {
      const tokens = resolveStable(receiver, file);
      return { tokens, concrete: recordsForRead(tokens, key) };
    } finally {
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
    rootHeuristicUses: 0,
    materializedLocalFields: 0,
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
