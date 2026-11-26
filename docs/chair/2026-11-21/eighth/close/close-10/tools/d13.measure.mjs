import { test, vi } from 'vitest';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
const TREE = process.env.TREE, DIR = process.env.DIR, OUT = process.env.OUT, LINE = process.env.NORM === '1';
const calls = [];
const idOf = (x) => (x && typeof x === 'object' ? String(x.id ?? x.vid ?? x.text ?? JSON.stringify(x).slice(0, 80)) : String(x));
vi.doMock(`${TREE}/src/kernel/proseHash.js`, async () => {
  const orig = await vi.importActual(`${TREE}/src/kernel/proseHash.js`);
  return { ...orig,
    pickVariantMixed: (pool, seed) => { const r = orig.pickVariantMixed(pool, seed); calls.push({ fn: 'mixed', key: String(seed), cand: (pool || []).map(idOf), texts: (pool || []).map((x) => (x && typeof x === 'object' ? String(x.text ?? '') : String(x))), picked: r === undefined ? null : idOf(r) }); return r; },
    pickVariant: (pool, seed) => { const r = orig.pickVariant(pool, seed); calls.push({ fn: 'variant', key: String(seed), cand: (pool || []).map(idOf), texts: (pool || []).map((x) => (x && typeof x === 'object' ? String(x.text ?? '') : String(x))), picked: r === undefined ? null : idOf(r) }); return r; },
  };
});
const prov = (o, path, out, seen = new Set(), d = 0) => {
  if (!o || typeof o !== 'object' || seen.has(o) || d > 12) return; seen.add(o);
  if (o.provenance && typeof o.provenance === 'object' && Array.isArray(o.provenance.pieces)) out.push({ path, blockId: o.provenance.blockId, poolKey: o.provenance.poolKey, vids: o.provenance.pieces.map((p) => p.vid), sentence: o.sentence ?? o.text ?? null });
  for (const [k, v] of Object.entries(o)) prov(v, `${path}.${k}`, out, seen, d + 1);
};
test('d13', async () => {
  const dl = await import(`${TREE}/src/domain/dailyLife.js`);
  const vm = await import(`${TREE}/src/domain/display/dossierViewModel.js`);
  const desks = {};
  for (const d of ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']) desks[d] = (await import(`${TREE}/src/domain/display/stateProse/${d}StateProse.js`))[`${d}StateProse`];
  const norm = LINE ? (await import(`${TREE}/src/domain/normalizeSettlement.js`)).normalizeSettlement : (x) => x;
  const out = {};
  for (const f of readdirSync(DIR).sort()) {
    const rec = norm(JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')));
    const seed = f.replace(/\.json$/, '');
    calls.length = 0;
    let d; try { d = dl.deriveDailyLife(rec); } catch (e) { d = { err: String(e) }; }
    const dlCalls = calls.filter((c) => c.key.includes('dailyLife.')).map((c) => ({ ...c }));
    const dlText = Object.fromEntries(Object.entries(d.slots || {}).map(([k, v]) => [k, v?.text ?? null]));
    let via = null; try { via = vm.deriveViability(rec).summary; } catch (e) { via = 'ERR ' + e; }
    const sp = [];
    for (const [k, fn] of Object.entries(desks)) { try { prov(fn(rec), k, sp); } catch (e) { sp.push({ path: k, err: String(e).slice(0, 200) }); } }
    out[seed] = { dlText, dlCalls, via, sp };
  }
  writeFileSync(OUT, JSON.stringify(out));
}, 3600000);
