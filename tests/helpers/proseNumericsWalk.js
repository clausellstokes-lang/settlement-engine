/**
 * Static reader-prose numeric-leak walker (review addendum A-1).
 *
 * There are two deliberately different source scopes:
 *   - `.js`: only authored headline/summary/reason/receipt surfaces. The walker
 *     follows object fields, prose-named registries/bindings, `.push(...)`
 *     calls on prose-named arrays, and return values of prose-named functions.
 *     Numeric ledger fields such as `severity: 0.55` are therefore not prose.
 *   - `.jsx`: the whole E-E component string/expression corpus, matching the
 *     breadth of tests/helpers/jsxLiteralWalk.js. JSX often separates an
 *     expression from its `%` or `×` text sibling, so the AST relationship is
 *     retained rather than flattening the file into string literals.
 *
 * Every result carries path + line + the exact normalized source snippet. The
 * live ratchet can freeze legacy debt without turning it into an anonymous
 * count that a move or replacement could silently preserve.
 */
import { parse } from 'espree';

const PROSE_KEYS = new Set([
  'headline', 'headlines', 'summary', 'summaries', 'reason', 'reasons',
  // A receipt is the persisted reason sentence in the war/peace authoring
  // registries (eventProse.js and its callers), not a separate reader surface.
  'receipt', 'receipts',
]);

const HUMAN_WORD_SUFFIX_RE = /(?:band|label|name|id|kind|type|status|word|text|line|sentence|display|url|email|structure|note)$/i;
const FLOAT_TOKENS = new Set([
  'score', 'chance', 'roll', 'rate', 'ratio', 'fraction', 'percent', 'percentage',
  'pct', 'probability', 'confidence', 'severity', 'pressure', 'margin',
  'multiplier', 'mult', 'strength', 'salience', 'tension', 'resentment', 'trust',
  'memory', 'exhaustion', 'readiness', 'resistance', 'burden', 'support',
  'capacity', 'progress', 'share', 'relief', 'stock', 'cliff', 'depth', 'standing',
  'power', 'budget', 'decay', 'exposure', 'quality', 'bias', 'flow', 'accum',
]);

/** @param {any} node */
function staticKey(node) {
  if (!node) return '';
  if (node.type === 'Identifier' || node.type === 'JSXIdentifier') return node.name || '';
  if (node.type === 'Literal') return typeof node.value === 'string' ? node.value : '';
  return '';
}

/** @param {any} node */
function bindingName(node) {
  if (!node) return '';
  if (node.type === 'Identifier') return node.name || '';
  if (node.type === 'MemberExpression') return staticKey(node.property);
  return '';
}

/** @param {any} node */
function functionName(node, parent) {
  if (!node) return '';
  if (node.id?.type === 'Identifier') return node.id.name;
  if (parent?.type === 'VariableDeclarator') return bindingName(parent.id);
  if (parent?.type === 'Property' || parent?.type === 'MethodDefinition') return staticKey(parent.key);
  if (parent?.type === 'AssignmentExpression') return bindingName(parent.left);
  return '';
}

/** Deterministic child-node iteration without attaching parent pointers. */
function childrenOf(node) {
  const out = [];
  for (const key of Object.keys(node || {})) {
    if (key === 'loc' || key === 'range' || key === 'parent') continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) if (child && typeof child.type === 'string') out.push(child);
    } else if (value && typeof value.type === 'string') out.push(value);
  }
  return out;
}

/** @param {any} node @param {(node:any,parent:any,ancestors:any[])=>void} visit */
function walk(node, visit, parent = null, ancestors = []) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, parent, ancestors);
  const next = [...ancestors, node];
  for (const child of childrenOf(node)) walk(child, visit, node, next);
}

function isFunctionNode(node) {
  return node?.type === 'FunctionDeclaration'
    || node?.type === 'FunctionExpression'
    || node?.type === 'ArrowFunctionExpression';
}

function isLexicalScope(node) {
  return node?.type === 'Program' || node?.type === 'BlockStatement' || isFunctionNode(node);
}

function lexicalScopes(ancestors) {
  return ancestors.filter(isLexicalScope);
}

function declarationScope(ancestors, declarationKind = 'const') {
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const candidate = ancestors[i];
    if (declarationKind === 'var') {
      if (candidate.type === 'Program' || isFunctionNode(candidate)) return candidate;
    } else if (isLexicalScope(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Same-file symbols used by the bounded W-A1b resolver. Every declaration is
 * retained so a nearer `let`/`var`, duplicate, or shadow makes resolution opaque
 * instead of accidentally falling through to an outer `const`.
 */
function collectLocalSymbols(ast) {
  /** @type {Map<any, Map<string, any[]>>} */
  const byScope = new Map();
  const add = (scope, name, entry) => {
    if (!scope || !name) return;
    if (!byScope.has(scope)) byScope.set(scope, new Map());
    const names = byScope.get(scope);
    if (!names.has(name)) names.set(name, []);
    names.get(name).push(entry);
  };

  const bindingIdentifiers = (node, out = []) => {
    if (!node) return out;
    if (node.type === 'Identifier') out.push(node.name);
    else if (node.type === 'RestElement') bindingIdentifiers(node.argument, out);
    else if (node.type === 'AssignmentPattern') bindingIdentifiers(node.left, out);
    else if (node.type === 'ArrayPattern') {
      for (const element of node.elements || []) bindingIdentifiers(element, out);
    } else if (node.type === 'ObjectPattern') {
      for (const property of node.properties || []) {
        bindingIdentifiers(property.type === 'RestElement' ? property.argument : property.value, out);
      }
    }
    return out;
  };

  walk(ast, (node, parent, ancestors) => {
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') {
      const declarationKind = parent?.type === 'VariableDeclaration' ? parent.kind : 'var';
      add(declarationScope(ancestors, declarationKind), node.id.name, {
        kind: 'binding',
        declarationKind,
        init: node.init,
        start: node.range?.[0] ?? Number.POSITIVE_INFINITY,
      });
    } else if (node.type === 'FunctionDeclaration' && node.id?.type === 'Identifier') {
      add(declarationScope(ancestors), node.id.name, {
        kind: 'function',
        node,
        start: node.range?.[0] ?? 0,
      });
    }
    if (isFunctionNode(node)) {
      for (const parameter of node.params || []) {
        for (const name of bindingIdentifiers(parameter)) {
          add(node, name, { kind: 'opaque-parameter', start: node.range?.[0] ?? 0 });
        }
      }
    } else if (node.type === 'ImportDeclaration') {
      const scope = declarationScope(ancestors);
      for (const specifier of node.specifiers || []) {
        if (specifier.local?.name) add(scope, specifier.local.name, {
          kind: 'opaque-import',
          start: node.range?.[0] ?? 0,
        });
      }
    }
  });
  return byScope;
}

function resolveLocalSymbol(name, { position, scopes, symbols }) {
  if (!name) return null;
  for (let i = scopes.length - 1; i >= 0; i -= 1) {
    const declarations = symbols.get(scopes[i])?.get(name);
    if (!declarations) continue;
    if (declarations.length !== 1) return null;
    const declaration = declarations[0];
    if (declaration.kind === 'function') return declaration;
    if (declaration.declarationKind !== 'const' || !declaration.init || declaration.start >= position) {
      return null;
    }
    return declaration;
  }
  return null;
}

/** Return only this function's own returns; nested closures are another hop. */
function directFunctionReturns(fn) {
  if (fn?.type === 'ArrowFunctionExpression' && fn.body?.type !== 'BlockStatement') {
    return [fn.body];
  }
  const out = [];
  const visit = (node, root = false) => {
    if (!node?.type) return;
    if (!root && isFunctionNode(node)) return;
    if (node.type === 'ReturnStatement') {
      if (node.argument) out.push(node.argument);
      return;
    }
    for (const child of childrenOf(node)) visit(child);
  };
  visit(fn?.body, true);
  return out;
}

function functionNodeForSymbol(symbol) {
  if (symbol?.kind === 'function') return symbol.node;
  return isFunctionNode(symbol?.init) ? symbol.init : null;
}

function isStringLikeProseValue(node) {
  if (!node) return false;
  if (node.type === 'Literal') return typeof node.value === 'string';
  if (node.type === 'TemplateLiteral' || isStringConcatenation(node)) return true;
  if (node.type === 'ConditionalExpression') {
    return isStringLikeProseValue(node.consequent) && isStringLikeProseValue(node.alternate);
  }
  if (node.type === 'LogicalExpression') {
    return isStringLikeProseValue(node.left) || isStringLikeProseValue(node.right);
  }
  return false;
}

/**
 * Index `.push(...)` writes by the exact const-array binding they target. This
 * closes the common `const parts=[]; parts.push(sentence); reason: parts` hop
 * without treating arbitrary mutable arrays as reader prose.
 */
function collectArrayPushes(ast, symbols) {
  /** @type {Map<any, Array<{start:number, arguments:any[]}>>} */
  const pushes = new Map();
  walk(ast, (node, _parent, ancestors) => {
    if (node.type !== 'CallExpression'
      || node.callee?.type !== 'MemberExpression'
      || node.callee.computed
      || staticKey(node.callee.property) !== 'push'
      || node.callee.object?.type !== 'Identifier') return;
    const symbol = resolveLocalSymbol(node.callee.object.name, {
      position: node.range?.[0] ?? Number.POSITIVE_INFINITY,
      scopes: lexicalScopes(ancestors),
      symbols,
    });
    if (symbol?.kind !== 'binding'
      || symbol.init?.type !== 'ArrayExpression'
      || symbol.declarationKind !== 'const') return;
    if (!pushes.has(symbol)) pushes.set(symbol, []);
    pushes.get(symbol).push({
      start: node.range?.[0] ?? Number.POSITIVE_INFINITY,
      arguments: node.arguments || [],
    });
  });
  return pushes;
}

function collectOneHopProse(node, context, add, { allowFunctionReturns = true } = {}) {
  if (!node) return;
  let symbol = null;
  if (node.type === 'Identifier') {
    // Existing human-word suffixes are the detector's explicit authored-output
    // contract (`severityLabel`, `calendarText`, etc.), not opaque value flow.
    if (HUMAN_WORD_SUFFIX_RE.test(node.name)) return;
    symbol = resolveLocalSymbol(node.name, context);
  } else if (node.type === 'CallExpression' && node.callee?.type === 'Identifier') {
    if (!allowFunctionReturns) return;
    symbol = resolveLocalSymbol(node.callee.name, context);
    const fn = functionNodeForSymbol(symbol);
    if (fn) {
      for (const returned of directFunctionReturns(fn)) {
        if (isStringLikeProseValue(returned)) collectProseDescendants(returned, add);
      }
    }
    return;
  } else if (node.type === 'CallExpression'
    && node.callee?.type === 'MemberExpression'
    && !node.callee.computed
    && staticKey(node.callee.property) === 'join'
    && node.callee.object?.type === 'Identifier') {
    symbol = resolveLocalSymbol(node.callee.object.name, context);
  }

  if (symbol?.kind !== 'binding') return;
  if (symbol.init?.type === 'ArrayExpression') {
    collectProseDescendants(symbol.init, add);
    for (const push of context.arrayPushes.get(symbol) || []) {
      if (push.start >= context.position) continue;
      for (const argument of push.arguments) {
        if (isStringLikeProseValue(argument)) collectProseDescendants(argument, add);
      }
    }
  } else if (isStringLikeProseValue(symbol.init)) {
    collectProseDescendants(symbol.init, add);
  }
}

/** @param {any} node */
function isToFixedCall(node) {
  return node?.type === 'CallExpression'
    && node.callee?.type === 'MemberExpression'
    && staticKey(node.callee.property) === 'toFixed';
}

/** @param {any} node */
function isNumericFormattingCall(node) {
  if (isToFixedCall(node)) return true;
  if (node?.type !== 'CallExpression') return false;
  const callee = node.callee;
  if (callee?.type === 'MemberExpression'
      && bindingName(callee.object) === 'Math'
      && /^(?:round|floor|ceil|trunc)$/.test(staticKey(callee.property))) return true;
  return /^(?:percent|formatPercent|formatPercentage|pct)$/.test(bindingName(callee));
}

function isStringConcatenation(node) {
  if (node?.type !== 'BinaryExpression' || node.operator !== '+') return false;
  let stringSurface = false;
  walk(node, (child) => {
    if ((child.type === 'Literal' && typeof child.value === 'string')
      || child.type === 'TemplateLiteral') stringSurface = true;
  });
  return stringSurface;
}

/**
 * Add string/template nodes and formatting calls reachable from a prose value.
 * The latter covers `receipt: peaceReceipt(..., { score: score.toFixed(2) })`,
 * where formatting sits at the caller and the template in a registry.
 */
function collectProseDescendants(node, add) {
  walk(node, (child, parent, ancestors) => {
    const insideConcat = ancestors.some(isStringConcatenation);
    if (child.type === 'Literal' && typeof child.value === 'string' && !insideConcat) add(child, 'prose');
    else if (child.type === 'TemplateLiteral' && !insideConcat) add(child, 'prose');
    else if (isStringConcatenation(child)
      && !isStringConcatenation(parent)
      && !ancestors.some((ancestor) => ancestor.type === 'TemplateLiteral')) add(child, 'prose-concat');
    else if (isNumericFormattingCall(child)
      && !insideConcat
      && !ancestors.some((ancestor) => ancestor.type === 'TemplateLiteral')) add(child, 'prose-format');
  });
}

/** @param {string} text */
function hasPercentToken(text) {
  return /(?:[+-]?\d+(?:\.\d+)?|<expr>)\s*%/.test(text)
    || /(?:[+-]?\d+(?:\.\d+)?|<expr>)\s+percent(?:age)?\b/i.test(text);
}

/** @param {string} text */
function hasMultiplierToken(text) {
  return /(?:[+-]?\d+(?:\.\d+)?|<expr>)\s*×/.test(text)
    || /×\s*(?:[+-]?\d+(?:\.\d+)?|<expr>)/.test(text);
}

/** @param {string} text */
function hasTwoDecimalToken(text) {
  if (!/(?:^|[^\d.])[+-]?\d+\.\d{2}(?!\d)/.test(text)) return false;
  // This class is two-decimal ENGINE SCORES, not prices, versions, opacity,
  // timing or typography. Static decimals therefore need score vocabulary;
  // dynamic `.toFixed(2)` is handled separately and always bites.
  return /\b(?:chance|roll|score|pressure|confidence|severity|resentment|memory|exhaustion|margin|budget|commitment|cliff|readiness|resistance|strength|ratio|multiplier|piety|weight|salience|tension|support|capacity|progress|relief|standing|power)\b|×/i.test(text);
}

/** Split an identifier by camelCase / underscores; never substring-match it. */
function identifierTokens(name) {
  return String(name || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());
}

function isProseBindingName(name) {
  const tokens = identifierTokens(name);
  if (!tokens.some((token) => /^(?:headline|headlines|summary|summaries|reason|reasons|receipt|receipts)$/.test(token))) return false;
  return !/^(?:style|styles|styling|css|class|classes|layout|theme)$/.test(tokens.at(-1));
}

/** @param {any} expression */
function looksLikeFloatExpression(expression) {
  if (!expression) return false;
  if (expression.type === 'CallExpression') {
    if (isNumericFormattingCall(expression)) return true;
    const calleeName = bindingName(expression.callee);
    if (HUMAN_WORD_SUFFIX_RE.test(calleeName)) return false;
    const calleeTokens = identifierTokens(calleeName);
    // Unknown functions are type-opaque in a static walker: do not call their
    // prose arguments floats (`t('generate.title')`, `humanizeToken(score)`).
    // Only a numerically named call or a known formatter is admissible here.
    if (!(FLOAT_TOKENS.has(calleeTokens.at(-1)) || calleeTokens.some((token) => /01$/.test(token)))) return false;
  }
  if (expression.type === 'MemberExpression') {
    const finalName = bindingName(expression);
    if (HUMAN_WORD_SUFFIX_RE.test(finalName)) return false;
    if (expression.computed && HUMAN_WORD_SUFFIX_RE.test(bindingName(expression.object))) return false;
  }
  let numericFormat = false;
  let arithmetic = false;
  let semantic = false;
  walk(expression, (node, parent, ancestors) => {
    if (isToFixedCall(node)) numericFormat = true;
    if (node.type === 'CallExpression'
      && /^(?:percent|formatPercent|formatPercentage|pct)$/.test(bindingName(node.callee))) {
      numericFormat = true;
    }
    if (node.type === 'BinaryExpression' && /^(?:\*|\/)$/.test(node.operator)) arithmetic = true;
    if (node.type === 'Identifier') {
      // A non-computed member key is the semantic token (`entry.severity`), but
      // the object name (`entry`) contributes nothing. Ordinary identifiers and
      // computed keys remain eligible.
      if (parent?.type === 'MemberExpression' && parent.object === node && !parent.computed) return;
      if (HUMAN_WORD_SUFFIX_RE.test(node.name)) return;
      if (ancestors.some((ancestor) => ancestor.type === 'MemberExpression'
        && HUMAN_WORD_SUFFIX_RE.test(bindingName(ancestor)))) return;
      const tokens = identifierTokens(node.name);
      if (FLOAT_TOKENS.has(tokens.at(-1)) || tokens.some((token) => /01$/.test(token))) {
        semantic = true;
      }
    }
  });
  return numericFormat || arithmetic || semantic;
}

/** @param {any} template */
function flattenedTemplate(template) {
  let text = '';
  for (let i = 0; i < template.quasis.length; i += 1) {
    text += template.quasis[i]?.value?.cooked ?? template.quasis[i]?.value?.raw ?? '';
    if (i < template.expressions.length) text += '<expr>';
  }
  return {
    text,
    expressions: template.expressions,
  };
}

function flattenedConcatenation(expression) {
  let text = '';
  const expressions = [];
  const append = (node) => {
    if (node?.type === 'BinaryExpression' && node.operator === '+') {
      append(node.left);
      append(node.right);
    } else if (node?.type === 'Literal' && typeof node.value === 'string') {
      text += node.value;
    } else if (node?.type === 'TemplateLiteral') {
      const flat = flattenedTemplate(node);
      text += flat.text;
      expressions.push(...flat.expressions);
    } else {
      text += '<expr>';
      expressions.push(node);
    }
  };
  append(expression);
  return { text, expressions };
}

/** @param {string} raw */
function oneLine(raw) {
  return raw.replace(/\s+/g, ' ').trim();
}

/** @param {any} node @param {string} source */
function snippetOf(node, source) {
  const raw = oneLine(source.slice(node.range[0], node.range[1]));
  return raw.length <= 240 ? raw : `${raw.slice(0, 237)}...`;
}

/** @param {any} node @param {string} source */
function categoriesForStringNode(node, source) {
  let text;
  let expressions;
  if (node.type === 'TemplateLiteral') {
    ({ text, expressions } = flattenedTemplate(node));
  } else {
    text = String(node.value ?? '');
    expressions = [];
  }

  const categories = [];
  if (expressions.some(looksLikeFloatExpression)) categories.push('floatInterpolation');
  if (hasPercentToken(text)) categories.push('percentToken');
  if (hasMultiplierToken(text)) categories.push('multiplier');
  if (hasTwoDecimalToken(text)
      || expressions.some((expr) => isTwoDecimalFormat(expr))) {
    categories.push('twoDecimalScore');
  }
  return categories;
}

function categoriesForConcatenation(node) {
  const { text, expressions } = flattenedConcatenation(node);
  const categories = [];
  if (expressions.some(looksLikeFloatExpression)) categories.push('floatInterpolation');
  if (hasPercentToken(text)) categories.push('percentToken');
  if (hasMultiplierToken(text)) categories.push('multiplier');
  if (hasTwoDecimalToken(text) || expressions.some(isTwoDecimalFormat)) categories.push('twoDecimalScore');
  return categories;
}

/** @param {any} node @param {string} source */
function categoriesForFormattingCall(node, source) {
  const raw = source.slice(node.range[0], node.range[1]);
  const out = [];
  if (looksLikeFloatExpression(node)) out.push('floatInterpolation');
  if (/\.toFixed\s*\(\s*2\s*\)/.test(raw)) out.push('twoDecimalScore');
  if (/\b(?:percent|formatPercent|formatPercentage|pct)\s*\(/.test(raw)) out.push('percentToken');
  return out;
}

/** @param {any} container @param {any} parent @param {string} source */
function categoriesForJsxExpression(container, parent, source) {
  const expr = container.expression;
  if (!expr || expr.type === 'JSXEmptyExpression' || expr.type === 'TemplateLiteral') return [];
  // `{condition && <Panel />}`, `{rows.map(x => <Row />)}` and `style={{…}}`
  // are JSX/control structure, not one rendered scalar. Their nested reader
  // nodes are walked independently; treating the whole outer expression as an
  // interpolation both duplicates them and makes every CSS number look prose.
  let structural = false;
  walk(expr, (node) => {
    if (node.type === 'JSXElement' || node.type === 'JSXFragment'
        || node.type === 'ObjectExpression' || /Function/.test(node.type)) structural = true;
  });
  if (structural) return [];
  const raw = source.slice(expr.range[0], expr.range[1]);
  const out = [];
  if (looksLikeFloatExpression(expr)) out.push('floatInterpolation');
  if (/\.toFixed\s*\(\s*2\s*\)/.test(raw)) out.push('twoDecimalScore');
  if (/\b(?:percent|formatPercent|formatPercentage|pct)\s*\(/.test(raw)) out.push('percentToken');

  if (parent?.type === 'JSXElement' || parent?.type === 'JSXFragment') {
    const siblings = parent.children || [];
    const index = siblings.indexOf(container);
    const before = index > 0 && siblings[index - 1]?.type === 'JSXText' ? siblings[index - 1].value : '';
    const after = index + 1 < siblings.length && siblings[index + 1]?.type === 'JSXText' ? siblings[index + 1].value : '';
    if ((/%\s*$/.test(before) || /^\s*%/.test(after)
        || /\bpercent(?:age)?\s*$/i.test(before) || /^\s*percent(?:age)?\b/i.test(after))) {
      if (scalarExpressionShape(expr)) out.push('percentToken');
    }
    if ((/×\s*$/.test(before) || /^\s*×/.test(after)) && scalarExpressionShape(expr)) out.push('multiplier');
  }
  return [...new Set(out)];
}

function compareText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

const READER_TEXT_JSX_ATTRIBUTES = new Set([
  'title', 'aria-label', 'alt', 'placeholder', 'label', 'headline', 'summary',
  'reason', 'reasons', 'description', 'caption', 'helpertext', 'emptytext',
  'message', 'text', 'subtitle', 'eyebrow', 'tooltip', 'content', 'details',
]);

/** JSX attributes that can carry words a reader or assistive technology sees. */
function readerFacingJsxAttribute(attribute) {
  if (attribute?.type !== 'JSXAttribute') return false;
  const name = staticKey(attribute.name).toLowerCase();
  return READER_TEXT_JSX_ATTRIBUTES.has(name);
}

function jsxElementName(element) {
  return staticKey(element?.openingElement?.name).toLowerCase();
}

function isStyleOrScriptElement(element) {
  return element?.type === 'JSXElement' && /^(?:style|script)$/.test(jsxElementName(element));
}

/** @param {any} container @param {any} parent */
function readerFacingJsxContainer(container, parent) {
  if (container?.type !== 'JSXExpressionContainer') return false;
  if (parent?.type === 'JSXElement' || parent?.type === 'JSXFragment') return !isStyleOrScriptElement(parent);
  return readerFacingJsxAttribute(parent);
}

function scalarExpressionShape(expression) {
  if (!expression) return false;
  if (['Identifier', 'MemberExpression', 'BinaryExpression', 'UnaryExpression', 'ConditionalExpression'].includes(expression.type)) return true;
  return expression.type === 'CallExpression' && isNumericFormattingCall(expression);
}

function isTwoDecimalFormat(expression) {
  let found = false;
  walk(expression, (node) => {
    if (isToFixedCall(node)
      && node.arguments?.[0]?.type === 'Literal'
      && Number(node.arguments[0].value) === 2) found = true;
  });
  return found;
}

/**
 * Scan one JS/JSX source file.
 * @param {{source:string, path:string}} input
 * @returns {{hits:Array<{path:string,line:number,category:string,snippet:string}>, parseError:string|null}}
 */
export function scanProseNumericsSource({ source, path }) {
  let ast;
  try {
    ast = parse(source, {
      ecmaVersion: 2024,
      sourceType: 'module',
      ecmaFeatures: { jsx: /\.jsx$/.test(path) },
      loc: true,
      range: true,
    });
  } catch (error) {
    return { hits: [], parseError: String(error?.message || error) };
  }

  const symbols = collectLocalSymbols(ast);
  const arrayPushes = collectArrayPushes(ast, symbols);

  /** @type {Map<any, Set<string>>} */
  const candidates = new Map();
  /** @type {Map<any, any>} */
  const parents = new Map();
  const add = (node, origin) => {
    if (!node?.range || !node?.loc) return;
    if (!candidates.has(node)) candidates.set(node, new Set());
    candidates.get(node).add(origin);
  };

  const jsx = /\.jsx$/.test(path);
  walk(ast, (node, parent, ancestors) => {
    if (parent) parents.set(node, parent);
    const flowContext = {
      position: node.range?.[0] ?? Number.POSITIVE_INFINITY,
      scopes: lexicalScopes(ancestors),
      symbols,
      arrayPushes,
    };
    if (jsx) {
      if (node.type === 'JSXText' && !isStyleOrScriptElement(parent)) add(node, 'jsx-text');
      else if (node.type === 'JSXExpressionContainer' && readerFacingJsxContainer(node, parent)) {
        add(node, 'jsx-expression');
        collectOneHopProse(node.expression, flowContext, add, { allowFunctionReturns: false });
      } else if (node.type === 'Literal' && typeof node.value === 'string'
        && readerFacingJsxAttribute(parent)) {
        add(node, 'jsx-attribute-string');
      } else if ((node.type === 'Literal' && typeof node.value === 'string')
        || node.type === 'TemplateLiteral') {
        const container = [...ancestors].reverse()
          .find((ancestor) => ancestor.type === 'JSXExpressionContainer');
        if (container) {
          const index = ancestors.lastIndexOf(container);
          const containerParent = index > 0 ? ancestors[index - 1] : null;
          if (readerFacingJsxContainer(container, containerParent)) add(node, 'jsx-expression-string');
        }
      }
    }

    if (node.type === 'Property' && PROSE_KEYS.has(staticKey(node.key).toLowerCase())) {
      collectProseDescendants(node.value, add);
      collectOneHopProse(node.value, flowContext, add);
    } else if (node.type === 'VariableDeclarator'
      && isProseBindingName(bindingName(node.id))
      && !/Function/.test(node.init?.type || '')) {
      collectProseDescendants(node.init, add);
      collectOneHopProse(node.init, flowContext, add);
    } else if (node.type === 'AssignmentExpression'
      && isProseBindingName(bindingName(node.left))
      && !/Function/.test(node.right?.type || '')) {
      collectProseDescendants(node.right, add);
      collectOneHopProse(node.right, flowContext, add);
    } else if (node.type === 'CallExpression'
      && node.callee?.type === 'MemberExpression'
      && staticKey(node.callee.property) === 'push'
      && isProseBindingName(bindingName(node.callee.object))) {
      for (const arg of node.arguments || []) {
        collectProseDescendants(arg, add);
        collectOneHopProse(arg, flowContext, add);
      }
    } else if (node.type === 'ReturnStatement') {
      const fn = [...ancestors].reverse().find((ancestor) => /Function/.test(ancestor.type));
      if (fn) {
        const index = ancestors.lastIndexOf(fn);
        const fnParent = index > 0 ? ancestors[index - 1] : null;
        if (isProseBindingName(functionName(fn, fnParent))
          && node.argument?.type !== 'JSXElement'
          && node.argument?.type !== 'JSXFragment') {
          collectProseDescendants(node.argument, add);
          collectOneHopProse(node.argument, flowContext, add);
        }
      }
    }
  });

  const hits = [];
  const seen = new Set();
  for (const [node] of candidates) {
    let categories = [];
    if (node.type === 'Literal' || node.type === 'JSXText' || node.type === 'TemplateLiteral') {
      categories = categoriesForStringNode(node, source);
    } else if (isStringConcatenation(node)) {
      categories = categoriesForConcatenation(node);
    } else if (node.type === 'JSXExpressionContainer') {
      categories = categoriesForJsxExpression(node, parents.get(node), source);
    } else if (isNumericFormattingCall(node)) {
      categories = categoriesForFormattingCall(node, source);
    }
    for (const category of categories) {
      const hit = { path, line: node.loc.start.line, category, snippet: snippetOf(node, source) };
      const key = `${hit.path}\u0000${hit.line}\u0000${hit.category}\u0000${hit.snippet}`;
      if (!seen.has(key)) { seen.add(key); hits.push(hit); }
    }
  }
  hits.sort((a, b) => compareText(a.path, b.path)
    || a.line - b.line
    || compareText(a.category, b.category)
    || compareText(a.snippet, b.snippet));
  return { hits, parseError: null };
}
