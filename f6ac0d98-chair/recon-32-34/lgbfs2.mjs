import fs from 'fs'; import path from 'path';
const root = process.cwd();
const seen = new Set(); const q = ['src/workers/generation.worker.js'];
const resolve = (from, spec) => {
  if (!spec.startsWith('.')) return null;
  let p = path.normalize(path.join(path.dirname(from), spec));
  for (const c of [p, p + '.js', p + '.jsx', path.join(p, 'index.js')]) {
    if (fs.existsSync(path.join(root, c)) && fs.statSync(path.join(root, c)).isFile()) return c;
  }
  return null;
};
while (q.length) {
  const f = q.shift(); if (seen.has(f)) continue; seen.add(f);
  let src; try { src = fs.readFileSync(path.join(root, f), 'utf8'); } catch { continue; }
  for (const m of src.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
    const r = resolve(f, m[1]); if (r) q.push(r);
  }
}
const arr = [...seen].sort();
console.log('modules:', arr.length);
console.log('spatial/:', arr.filter(x=>x.includes('/spatial/')).length, arr.filter(x=>x.includes('/spatial/')).join(','));
console.log('worldPulse/:', arr.filter(x=>x.includes('/worldPulse/')).length, arr.filter(x=>x.includes('/worldPulse/')).slice(0,6).join(','));
