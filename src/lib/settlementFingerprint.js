function stableStringify(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (seen.has(value)) return '"[Circular]"';
  seen.add(value);
  if (Array.isArray(value)) {
    const out = `[${value.map(item => stableStringify(item, seen)).join(',')}]`;
    seen.delete(value);
    return out;
  }
  const keys = Object.keys(value)
    .filter(key => typeof value[key] !== 'function' && value[key] !== undefined)
    .sort();
  const out = `{${keys.map(key => `${JSON.stringify(key)}:${stableStringify(value[key], seen)}`).join(',')}}`;
  seen.delete(value);
  return out;
}

export function settlementFingerprint(settlement) {
  if (!settlement) return null;
  return stableStringify(settlement);
}
