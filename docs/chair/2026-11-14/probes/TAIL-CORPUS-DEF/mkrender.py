import sys
p=sys.argv[1]; s=open(p+'/render.census3.jsx').read()
a="const mocks = vi.hoisted(() => ({ store: {} }));"
assert a in s
s=s.replace(a, """const mocks = vi.hoisted(() => ({ store: {}, rec: null }));
vi.mock('__TREE__/src/domain/display/stateProse/stateProseKernel.js', async (orig) => { const m = await orig(); return { ...m, drawVariant: (el, b, k, sd) => { const v = m.drawVariant(el, b, k, sd); if (mocks.rec) { const o = mocks.rec[`${b}::${k}`] ||= { e: [], d: [] }; for (const x of el || []) if (!o.e.includes(x.vid)) o.e.push(x.vid); if (v && !o.d.includes(v.vid)) o.d.push(v.vid); } return v; } }; });""",1)
b="    mocks.store = store(town);\n"; assert b in s
s=s.replace(b,b+"    mocks.rec = {};\n",1)
c="    if (SURF) {\n      cleanup();"; assert c in s
s=s.replace(c,"""    { const drawsRec = mocks.rec; mocks.rec = null; fs.mkdirSync(`${OUT}/../draws`, { recursive: true }); fs.mkdirSync(`${OUT}/../records`, { recursive: true });
      fs.writeFileSync(`${OUT}/../draws/${seed}.draws.json`, JSON.stringify(drawsRec)); fs.writeFileSync(`${OUT}/../records/${seed}.json`, JSON.stringify(town)); }
"""+c,1)
open(p+'/render.census3d.jsx','w').write(s); print('ok')
