// Which function reads each top-level field of the record inside derivePowerStrata (the powersList leaf), lit.
const T = process.argv[2];
const sh = await import(`${T}/tests/lint/factLayers.shared.mjs`);
const { derivePowerStrata } = await import(`${T}/src/domain/dossier/powerStrata.js`);
const births = await sh.gridBirths();
const WATCH = new Set(['npcs', 'economicState', 'stress', 'stressors', 'tier']);
const seen = new Map();
for (const [, rec] of births) {
  const proxy = new Proxy(rec, { get(t, k, r) {
    if (typeof k === 'string' && WATCH.has(k)) {
      const frames = new Error().stack.split('\n').slice(2).map((l) => l.trim().replace(/^at /, '')).filter((l) => !/node:internal|path-probe/.test(l));
      const where = frames.slice(0, 4).map((f) => f.replace(/\(?file:\/\/[^)]*\/src\//, 'src/').replace(/\)$/, '')).join(' <- ');
      const key = `${k}\t${where}`; seen.set(key, (seen.get(key) || 0) + 1);
    }
    return Reflect.get(t, k, r);
  } });
  try { derivePowerStrata(proxy); } catch (e) { seen.set(`ERROR\t${e.message}`, 1); }
}
for (const [k, n] of [...seen].sort()) console.log(`${n}\t${k}`);
