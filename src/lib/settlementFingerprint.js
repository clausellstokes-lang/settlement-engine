// INTENTIONAL TWIN — do NOT unify with structuralFingerprint.js's stableStringify
// (code-quality-architecture-5, verdict PARTIAL→low). The two share a name but serve
// DISJOINT domains and never compare against each other: THIS one both mints and is
// the sole comparator of aiSourceFingerprint (a full prose settlement, PII-bearing by
// design — A_PLUS_ROADMAP.md lib.7), and its edge semantics are load-bearing here
// (functions + undefined are FILTERED OUT of object keys; circular → "[Circular]").
// structuralFingerprint's twin is a STALENESS serializer over an extractReducedFingerprint
// PROJECTION with different circular/undefined handling (circular → null); the name
// deliberately avoids clashing (simulation-intelligence-layer.md §"staleness serializer").
// Merging them would silently change one domain's hashes for zero benefit — they take
// different inputs and never share a comparison, so the divergence cannot manifest as a
// mismatch. Local (unexported) on purpose.
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
