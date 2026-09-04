function stringLiteralContents(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2; continue;
    }
    if (c === "'" || c === '"') {
      const q = c; let buf = ''; i++;
      while (i < n && src[i] !== q) {
        if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; }
        buf += src[i]; i++;
      }
      i++; out.push(buf); continue;
    }
    if (c === '`') {
      let buf = ''; i++;
      while (i < n && src[i] !== '`') {
        if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; }
        if (src[i] === '$' && src[i + 1] === '{') {
          i += 2; let depth = 1;
          while (i < n && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            i++;
          }
          buf += ' '; continue;
        }
        buf += src[i]; i++;
      }
      i++; out.push(buf); continue;
    }
    i++;
  }
  return out;
}
function countFile(abs) {
  let em = 0, bang = 0;
  for (const text of stringLiteralContents(readFileSync(abs, 'utf8'))) {
    em += (text.match(/—/g) || []).length;
    bang += (text.match(/!/g) || []).length;
  }
  return { em, bang };
}
