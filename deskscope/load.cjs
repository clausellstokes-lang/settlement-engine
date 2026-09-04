const fs = require('fs');
function loadLeaf(path) {
  let s = fs.readFileSync(path, 'utf8');
  const i = s.indexOf('Object.freeze(');
  s = s.slice(i + 'Object.freeze('.length);
  s = s.slice(0, s.lastIndexOf(')'));
  // Neutralise LIVE_STRING_BINDINGS: bare JS identifiers used as values.
  s = s.replace(/:\s*[A-Z_][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)*\s*(?=[,}\]\n])/g, ': "<LIVE_STRING>"');
  return JSON.parse(s);
}
module.exports = { loadLeaf };
