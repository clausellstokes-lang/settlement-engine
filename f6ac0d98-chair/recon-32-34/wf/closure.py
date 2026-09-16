import os,re,sys
ROOT=sys.argv[1]; entry=sys.argv[2]
seen=set(); stack=[os.path.normpath(os.path.join(ROOT,entry))]
imp=re.compile(r"""(?:^|\n)\s*(?:import|export)[^;\n]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)""")
lazy=set()
while stack:
    f=stack.pop()
    if f in seen or not os.path.isfile(f): continue
    seen.add(f)
    src=open(f,encoding='utf-8',errors='replace').read()
    for m in imp.finditer(src):
        spec=m.group(1) or m.group(2)
        if not spec.startswith('.'): continue
        t=os.path.normpath(os.path.join(os.path.dirname(f),spec))
        for cand in (t, t+'.js', t+'.jsx', os.path.join(t,'index.js')):
            if os.path.isfile(cand):
                if m.group(2): lazy.add(cand)
                stack.append(cand); break
print("modules in closure:",len(seen))
for pat in sys.argv[3:]:
    hits=[p for p in sorted(seen) if pat in p]
    print(f"  {pat}: {len(hits)}", hits[:5])
