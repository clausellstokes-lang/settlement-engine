/**
 * lib/svg.mjs — REG-I0 · SVG tokenizer + path-`d` reading.
 *
 * ⭐ LIFTED VERBATIM IN BEHAVIOUR from the REG-0 specimen workspace's `svgLib.mjs` (tokenize,
 * parseD, subpaths, pointsOf, ARITY/ABSPAIRS). REG-0's classifier and frontage metric were
 * measured through these exact functions, so re-deriving them would silently move every
 * baseline this lane records. Only the export surface is trimmed to what the instruments use.
 */

const TAG = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:.-]+="[^"]*")*)\s*(\/?)>/g;
const ATTR = /([\w:.-]+)="([^"]*)"/g;

export function tokenize(svg) {
  const out = [];
  let last = 0, m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(svg))) {
    if (m.index > last) out.push({ kind: 'text', raw: svg.slice(last, m.index) });
    const attrs = {};
    let a; ATTR.lastIndex = 0;
    while ((a = ATTR.exec(m[3] || ''))) attrs[a[1]] = a[2];
    out.push({ kind: m[1] === '/' ? 'close' : (m[4] === '/' ? 'self' : 'open'), tag: m[2], attrs, raw: m[0] });
    last = m.index + m[0].length;
  }
  if (last < svg.length) out.push({ kind: 'text', raw: svg.slice(last) });
  return out;
}

const CMD = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
const NUM = /-?\d*\.?\d+(?:[eE][-+]?\d+)?/g;

export function parseD(d) {
  const out = []; let m; CMD.lastIndex = 0;
  while ((m = CMD.exec(d))) out.push({ cmd: m[1], nums: (m[2].match(NUM) || []).map(Number), rawArgs: m[2] });
  return out;
}

const ARITY = { M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0 };
const ABSPAIRS = { M: [[0, 1]], L: [[0, 1]], T: [[0, 1]], C: [[0, 1], [2, 3], [4, 5]], S: [[0, 1], [2, 3]], Q: [[0, 1], [2, 3]], A: [[5, 6]] };

/** every absolute endpoint in a `d` (relative commands skipped, as in REG-0) */
export function pointsOf(d) {
  const pts = [];
  for (const s of parseD(d)) {
    const up = s.cmd.toUpperCase();
    if (s.cmd !== up || up === 'Z') continue;
    const n = ARITY[up]; const pairs = ABSPAIRS[up];
    if (!n || !pairs) continue;
    const last = pairs[pairs.length - 1];
    for (let base = 0; base + n <= s.nums.length; base += n) pts.push([s.nums[base + last[0]], s.nums[base + last[1]]]);
  }
  return pts;
}

/** split a `d` into subpaths, each {d, poly} — absolute commands only */
export function subpaths(d) {
  const out = [];
  let cur = null;
  for (const s of parseD(d)) {
    const up = s.cmd.toUpperCase();
    if (up === 'M') { if (cur && cur.poly.length > 1) out.push(cur); cur = { d: '', poly: [] }; }
    if (!cur) continue;
    cur.d += s.cmd + (up === 'Z' ? '' : s.rawArgs);
    if (s.cmd === up && up !== 'Z' && ABSPAIRS[up]) {
      const n = ARITY[up], pairs = ABSPAIRS[up], last = pairs[pairs.length - 1];
      for (let base = 0; base + n <= s.nums.length; base += n) cur.poly.push([s.nums[base + last[0]], s.nums[base + last[1]]]);
    }
  }
  if (cur && cur.poly.length > 1) out.push(cur);
  return out;
}

export const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
