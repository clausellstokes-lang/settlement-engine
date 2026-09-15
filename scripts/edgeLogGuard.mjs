/**
 * edgeLogGuard.mjs — [security-2 / A+ backend.3] the CI guards for edge-function logging PII.
 *
 * TWO ARMS, because backend.3 asked for two and only the first was ever built.
 *
 *   ARM 1 — consolePiiLiteralOffenders (unchanged, 2026-07): a console.* call must never
 *   embed a hardcoded email LITERAL. Narrow by design and kept exactly as it was.
 *
 *   ARM 2 — consolePiiValueOffenders (LT36 car 2): a console.* call must never carry a PII
 *   VALUE. This is the shape of the defect backend.1 actually fixed — the leak was
 *   `console.log(\`… email=${session.customer_email}\`)`, an INTERPOLATION, and arm 1 returns
 *   [] for it (executed negative control, recorded in the LT36 brief). Re-added tomorrow the
 *   original leak would have shipped green. Arm 2 closes that.
 *
 * ── WHY ARM 2 IS VALUE-SHAPED AND NOT A TOKEN GREP ───────────────────────────────────────
 * backend.3's spec names the tokens `customer_email|\.email|\bemail\b|customer_details|
 * x-forwarded-for`. Taken literally — a substring grep over console.* lines — that rule
 * flags FIFTEEN lines in this tree and ALL FIFTEEN ARE PROSE:
 *     console.warn("[auth-recovery] reset email not sent: mailer unconfigured …")
 *     console.warn("[account-actions] email send failed:", errorMessage(e))
 * …and every one of the eleven `x-forwarded-for` occurrences under supabase/functions/ sits
 * in a COMMENT explaining that the header is spoofable. A baseline seeded with fifteen false
 * positives is a rule with no teeth: the next real leak lands inside the noise and nobody
 * looks. So arm 2 asks the question the token list was a proxy for — DOES THIS LOG LINE
 * CARRY A PII VALUE — by reading only the EXPRESSION positions of the call:
 *
 *   · the text of every `${…}` interpolation inside a template-literal argument;
 *   · every argument position that is not a string literal (bare identifiers, member
 *     expressions, call results);
 *   · plus one targeted literal rule for `…get('x-forwarded-for' | 'user-agent' |
 *     'cf-connecting-ip' | 'x-real-ip')`, where the string IS the value-fetch.
 *
 * String-literal CONTENT — the prose half of every log line — is dropped before matching, and
 * comments are blanked first. Both directions are proven in
 * tests/security/edgeLogRedaction.test.js; the estate has been bitten TWICE by a source-text
 * detector counting a docstring (tests/lint/rawButtonBaseline.test.js, LANE VT and LANE PW),
 * so comment-blanking is built in from birth rather than retrofitted after the second bite.
 *
 * ── THE BASELINE ─────────────────────────────────────────────────────────────────────────
 * scripts/.edge-pii-log-baseline.json grandfathers the files that still carry a PII-valued
 * console line, in the estate's proven shape (scripts/.raw-button-baseline.json): a FILE list
 * plus an occurrence ceiling, shrink-only, pinned in tests/security/edgeLogRedaction.test.js.
 * A NEW offending file is an ERROR immediately; adding an offence to a grandfathered file
 * pushes the count over the ceiling. Filtering is the VALIDATOR's job
 * (scripts/validate-edge-functions.mjs) — this module stays pure so both arms are unit-
 * testable without the validator's top-level scan.
 *
 * @enforced-by scripts/validate-edge-functions.mjs + tests/security/edgeLogRedaction.test.js
 */

// ── ARM 1: the literal-email rule (UNCHANGED) ────────────────────────────────
// A console.* call whose argument text contains a literal email address. Single-line by
// design (a literal email sits on the line with the string); interpolated variables
// (`console.error(err.message)`) are NOT matched — those are arm 2's job.
const EMAIL_LITERAL_LOG_RE =
  /console\.\w+\([^)]*?[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

/**
 * @param {string} source  an edge-function .ts source
 * @param {string} rel     a label for messages (relative path)
 * @returns {string[]} one message per offending line (empty = clean)
 */
export function consolePiiLiteralOffenders(source, rel = '<source>') {
  const out = [];
  const lines = String(source).split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (EMAIL_LITERAL_LOG_RE.test(lines[i])) {
      out.push(
        `${rel}:${i + 1}: a console.* call embeds a literal email — route PII through redact() in supabase/functions/_shared/log.ts`,
      );
    }
  }
  return out;
}

// ── ARM 2: the PII-VALUE rule ────────────────────────────────────────────────

/**
 * The PII identifiers, NORMALISED: lowercased with `_` removed. An identifier offends when
 * its whole normalised form is in this set, OR when its LAST camel/underscore segment is.
 *
 * The last-segment rule is what keeps `data.ip_count` (a COUNT, normalised `ipcount`, last
 * segment `count`) out while keeping `session.customer_email` (normalised `customeremail`)
 * and `payload.recipientEmail` (last segment `email`) in. Every entry below is a value a
 * log drain must never receive in the clear.
 */
export const PII_VALUE_IDENTIFIERS = new Set([
  'customeremail',
  'customerdetails',
  'email',
  'emailaddress',
  'ip',
  'ipaddress',
  'clientip',
  'remoteip',
  'ua',
  'useragent',
  'xforwardedfor',
]);

/** A string literal that is itself a PII value-fetch: `h.get('x-forwarded-for')`. */
const PII_HEADER_FETCH_RE =
  /\.\s*get\s*\(\s*(['"`])(x-forwarded-for|x-real-ip|cf-connecting-ip|user-agent)\1/i;

/** The one file allowed to console.* a value: the redactor itself emits the redacted line. */
const PII_VALUE_EXEMPT = new Set(['_shared/log.ts', 'supabase/functions/_shared/log.ts']);

/**
 * Blank every comment, preserving byte offsets and newlines so line numbers survive.
 * String-aware, so a `//` inside a string literal is not mistaken for a comment.
 * @param {string} src
 * @returns {string}
 */
export function blankComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let state = 'code'; // code | line | block | sq | dq | tpl
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (state === 'code') {
      if (c === '/' && d === '/') { state = 'line'; out += '  '; i += 2; continue; }
      if (c === '/' && d === '*') { state = 'block'; out += '  '; i += 2; continue; }
      if (c === "'") { state = 'sq'; out += c; i += 1; continue; }
      if (c === '"') { state = 'dq'; out += c; i += 1; continue; }
      if (c === '`') { state = 'tpl'; out += c; i += 1; continue; }
      out += c; i += 1; continue;
    }
    if (state === 'line') {
      if (c === '\n') { state = 'code'; out += c; } else out += ' ';
      i += 1; continue;
    }
    if (state === 'block') {
      if (c === '*' && d === '/') { state = 'code'; out += '  '; i += 2; continue; }
      out += (c === '\n' ? '\n' : ' ');
      i += 1; continue;
    }
    // inside a string literal: copy verbatim, honouring escapes
    if (c === '\\') { out += c + (d ?? ''); i += 2; continue; }
    if ((state === 'sq' && c === "'") || (state === 'dq' && c === '"') || (state === 'tpl' && c === '`')) {
      state = 'code';
    }
    out += c; i += 1;
  }
  return out;
}

/**
 * Index of the `)` matching the `(` at `open`, or -1. String-literal aware so a paren
 * inside a message ("…(sic)…") never closes the call early.
 * @param {string} src
 * @param {number} open index of the opening paren
 */
function matchingParen(src, open) {
  let depth = 0;
  let i = open;
  const n = src.length;
  let state = 'code';
  while (i < n) {
    const c = src[i];
    if (state === 'code') {
      if (c === "'") { state = 'sq'; i += 1; continue; }
      if (c === '"') { state = 'dq'; i += 1; continue; }
      if (c === '`') { state = 'tpl'; i += 1; continue; }
      if (c === '(') depth += 1;
      else if (c === ')') { depth -= 1; if (depth === 0) return i; }
      i += 1; continue;
    }
    if (c === '\\') { i += 2; continue; }
    if ((state === 'sq' && c === "'") || (state === 'dq' && c === '"') || (state === 'tpl' && c === '`')) {
      state = 'code';
    }
    i += 1;
  }
  return -1;
}

const CONSOLE_CALL_RE = /console\s*\.\s*(?:log|info|warn|error|debug|trace)\s*\(/g;

/**
 * Every console.* call in a comment-blanked source, with its full argument text (which may
 * span lines) and the 1-based line of the `console` token.
 * @param {string} src comment-blanked source
 * @returns {{line:number, argText:string}[]}
 */
function consoleCalls(src) {
  const out = [];
  const re = new RegExp(CONSOLE_CALL_RE.source, 'g');
  let m;
  while ((m = re.exec(src)) !== null) {
    const open = m.index + m[0].length - 1;
    const close = matchingParen(src, open);
    const end = close === -1 ? src.length : close;
    out.push({
      line: src.slice(0, m.index).split('\n').length,
      argText: src.slice(open + 1, end),
    });
    if (close !== -1) re.lastIndex = close;
  }
  return out;
}

/**
 * Reduce an argument text to its EXPRESSION positions: string-literal content is dropped,
 * `${…}` interpolation bodies are kept, everything outside a literal is kept. Brace depth is
 * tracked inside an interpolation so `${JSON.stringify({a:1})}` closes at the right `}`.
 * @param {string} argText
 * @returns {string}
 */
export function valueExpressionText(argText) {
  let out = '';
  let i = 0;
  const n = argText.length;
  // frames: {kind:'code'|'sq'|'dq'|'tpl', depth:number}
  const frames = [{ kind: 'code', depth: 0 }];
  while (i < n) {
    const top = frames[frames.length - 1];
    const c = argText[i];
    if (top.kind === 'code') {
      if (c === "'") { frames.push({ kind: 'sq', depth: 0 }); out += ' '; i += 1; continue; }
      if (c === '"') { frames.push({ kind: 'dq', depth: 0 }); out += ' '; i += 1; continue; }
      if (c === '`') { frames.push({ kind: 'tpl', depth: 0 }); out += ' '; i += 1; continue; }
      if (c === '{') { top.depth += 1; out += c; i += 1; continue; }
      if (c === '}') {
        if (top.depth > 0) { top.depth -= 1; out += c; } else if (frames.length > 1) { frames.pop(); out += ' '; } else out += c;
        i += 1; continue;
      }
      out += c; i += 1; continue;
    }
    if (c === '\\') { i += 2; continue; }
    if (top.kind === 'sq' || top.kind === 'dq') {
      if ((top.kind === 'sq' && c === "'") || (top.kind === 'dq' && c === '"')) { frames.pop(); out += ' '; }
      i += 1; continue;
    }
    // template-literal chunk text: dropped, but `${` re-enters code
    if (c === '`') { frames.pop(); out += ' '; i += 1; continue; }
    if (c === '$' && argText[i + 1] === '{') { frames.push({ kind: 'code', depth: 0 }); out += ' '; i += 2; continue; }
    i += 1;
  }
  return out;
}

/** Split an identifier into lowercased camelCase / underscore segments. */
function segmentsOf(identifier) {
  return identifier
    .replace(/[_$]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * The PII identifiers appearing in an expression text, in source order (deduped).
 * @param {string} exprText
 * @returns {string[]}
 */
export function piiIdentifiersIn(exprText) {
  const hits = [];
  for (const m of String(exprText).matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)) {
    const id = m[0];
    const norm = id.replace(/_/g, '').toLowerCase();
    const segs = segmentsOf(id);
    const last = segs[segs.length - 1] ?? '';
    if (PII_VALUE_IDENTIFIERS.has(norm) || PII_VALUE_IDENTIFIERS.has(last)) {
      if (!hits.includes(id)) hits.push(id);
    }
  }
  return hits;
}

/**
 * ARM 2 — every console.* call that carries a PII VALUE.
 *
 * @param {string} source  an edge-function .ts source
 * @param {string} rel     a label for messages (relative path); `_shared/log.ts` is exempt
 * @returns {string[]} one message per offending call (empty = clean)
 */
export function consolePiiValueOffenders(source, rel = '<source>') {
  if (PII_VALUE_EXEMPT.has(rel)) return [];
  const out = [];
  for (const call of consoleCalls(blankComments(String(source)))) {
    const reasons = [];
    if (PII_HEADER_FETCH_RE.test(call.argText)) {
      const header = call.argText.match(PII_HEADER_FETCH_RE)[2];
      reasons.push(`the '${header}' header value`);
    }
    for (const id of piiIdentifiersIn(valueExpressionText(call.argText))) {
      reasons.push(`\`${id}\``);
    }
    if (reasons.length) {
      out.push(
        `${rel}:${call.line}: a console.* call carries a PII value (${[...new Set(reasons)].join(', ')}) `
        + '— route it through logSafe()/redact() in supabase/functions/_shared/log.ts '
        + '(mask an IP with maskIp()), or grandfather the file in scripts/.edge-pii-log-baseline.json.',
      );
    }
  }
  return out;
}
