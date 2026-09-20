/**
 * efflines.mjs — eslint `max-lines` arithmetic (skipBlankLines + skipComments)
 * reproduced in plain node, with a CONTROL against scripts/.size-baseline.json
 * so the count is a measurement and not an estimate. (EM-B1e's method.)
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TREE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/read-tip-ad7ddf2c9';

/**
 * eslint's max-lines with skipComments blanks comment TEXT and then drops lines
 * that are empty after the blanking; skipBlankLines drops whitespace-only lines.
 * Comments are found by a scanner that skips string and template literals and
 * regex literals, so a `//` inside a string is not a comment.
 */
function effectiveLines(src) {
  const out = [];
  let i = 0; const n = src.length;
  let line = '';
  const push = () => { out.push(line); line = ''; };
  // A `/` starts a REGEX (not a comment, not division) when the last significant
  // token cannot end an expression. Without this, `/\/\//` reads as a comment and
  // the rest of the line vanishes — the measured under-count in the first control.
  const regexAllowed = () => {
    const t = line.replace(/\s+$/, '');
    if (t === '') return true;
    const last = t[t.length - 1];
    if ('([{,;:=!?&|+-*%~^<>'.includes(last)) return true;
    return /\b(return|typeof|instanceof|in|of|new|delete|void|case|do|else|yield|await)$/.test(t);
  };
  while (i < n) {
    const c = src[i];
    if (c === '\n') { push(); i += 1; continue; }
    if (c === '/' && src[i + 1] !== '/' && src[i + 1] !== '*' && regexAllowed()) {
      // regex literal: consume to the unescaped closing `/`, skipping classes
      line += c; i += 1; let inClass = false;
      while (i < n && src[i] !== '\n') {
        if (src[i] === '\\') { line += src[i] + (src[i + 1] ?? ''); i += 2; continue; }
        if (src[i] === '[') inClass = true;
        else if (src[i] === ']') inClass = false;
        else if (src[i] === '/' && !inClass) { line += '/'; i += 1; break; }
        line += src[i]; i += 1;
      }
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') push(); i += 1; }
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; line += c; i += 1;
      while (i < n) {
        if (src[i] === '\\') { line += src[i] + (src[i + 1] ?? ''); i += 2; continue; }
        if (src[i] === q) { line += q; i += 1; break; }
        if (src[i] === '\n') { push(); i += 1; continue; }
        line += src[i]; i += 1;
      }
      continue;
    }
    line += c; i += 1;
  }
  push();
  return out.filter(l => l.trim() !== '').length;
}

const files = process.argv.slice(2);
const baselinePath = join(TREE, 'scripts/.size-baseline.json');
if (existsSync(baselinePath)) {
  const base = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const entries = Object.entries(base).filter(([, v]) => typeof v === 'number' || (v && typeof v.max === 'number'));
  console.log(`CONTROL — scripts/.size-baseline.json has ${entries.length} entries; checking the first 6 against this counter:`);
  let ok = 0, tot = 0;
  for (const [p, v] of entries.slice(0, 6)) {
    const want = typeof v === 'number' ? v : v.max;
    const abs = join(TREE, p);
    if (!existsSync(abs)) { console.log(`  ${p}: FILE ABSENT`); continue; }
    const got = effectiveLines(readFileSync(abs, 'utf8'));
    tot += 1; if (got === want) ok += 1;
    console.log(`  ${p}: baseline ${want}  counted ${got}  ${got === want ? 'EXACT' : 'MISMATCH'}`);
  }
  console.log(`  CONTROL RESULT: ${ok}/${tot} exact`);
  const fr = base['src/domain/factionRename.js'];
  console.log(`  src/domain/factionRename.js baseline entry: ${fr === undefined ? 'NONE' : JSON.stringify(fr)}`);
}
console.log('');
for (const f of files) {
  const abs = join(TREE, f);
  if (!existsSync(abs)) { console.log(`${f}: ABSENT`); continue; }
  const src = readFileSync(abs, 'utf8');
  console.log(`${f}: raw ${src.split('\n').length}  EFFECTIVE ${effectiveLines(src)}`);
}
