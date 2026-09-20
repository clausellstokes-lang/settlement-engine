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
import { readFileSync } from 'node:fs';
for (const f of process.argv.slice(2)) {
  const src = readFileSync(f, 'utf8');
  console.log(`${f}\n  raw ${src.split('\n').length}  EFFECTIVE ${effectiveLines(src)}`);
}
