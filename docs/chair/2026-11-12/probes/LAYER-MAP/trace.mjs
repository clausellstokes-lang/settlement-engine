// LAYER-MAP trace.mjs — an EXECUTED read-tracer: which record paths a function reads.
// traceReads(record, fn) runs fn on a Proxy of the record and returns the set of paths read
// (array indices collapsed to [], depth capped at 3). Absent keys count: reading a missing field is a read.
const SKIP = new Set([...Object.getOwnPropertyNames(Array.prototype), ...Object.getOwnPropertyNames(Object.prototype), 'toJSON', 'then', 'constructor']);
export function traceReads(record, fn, depth = 3) {
  const paths = new Set(); const cache = new WeakMap();
  const wrap = (obj, path) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Object.isFrozen(obj)) return obj; // a frozen target forbids a different value from get (proxy invariant)
    let byPath = cache.get(obj); if (!byPath) { byPath = new Map(); cache.set(obj, byPath); }
    if (byPath.has(path)) return byPath.get(path);
    const p = new Proxy(obj, { get(t, k, r) {
      const v = Reflect.get(t, k, r);
      if (typeof k !== 'string') return v;
      const isIdx = Array.isArray(t) && /^\d+$/.test(k);
      if (!isIdx && SKIP.has(k)) return v;
      const seg = isIdx ? '[]' : k; const np = path ? (isIdx ? path + '[]' : path + '.' + seg) : seg;
      const parts = np.replace(/\[\]/g, '').split('.');
      paths.add(parts.slice(0, depth).join('.'));
      return wrap(v, np);
    }, has(t, k) { if (typeof k === 'string' && !SKIP.has(k)) { const isIdx = Array.isArray(t) && /^\d+$/.test(k); const np = isIdx ? path : (path ? path + '.' + k : k); if (np) paths.add(np.replace(/\[\]/g, '').split('.').slice(0, depth).join('.')); } return Reflect.has(t, k); },
      ownKeys(t) { if (path) paths.add(path.replace(/\[\]/g, '').split('.').slice(0, depth).join('.')); return Reflect.ownKeys(t); } });
    byPath.set(path, p); return p;
  };
  let err = null; try { fn(wrap(record, '')); } catch (e) { err = e.message; }
  return { paths, err };
}
