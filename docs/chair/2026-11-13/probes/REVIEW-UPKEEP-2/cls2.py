import sys,re,os,json,collections
def run(D,scan):
    S={json.loads(l)['seed']:json.loads(l) for l in open(scan)}; C=collections.defaultdict(set)
    for f in os.listdir(D):
        k=f[:-4]; s=S[k]; t=open(os.path.join(D,f)).read(); d=t.split('== tab:defense ==\n')[1].split('\n== ')[0]
        inv=re.search(r'Invasion & War\n(\w+) ▼\n(.*)',d); invb,invs=(inv.group(1),inv.group(2)) if inv else ('','')
        forces=bool(s['gar'] or s['watch'] or s['mili'] or s['merc'])
        if re.search(r'all but undefended\. Nothing in the|without being stopped, challenged or counted|could not survive a serious attack',d) and s['walls'] and forces: C['M5 cannot-hold posture beside walls and a force'].add(k)
        if re.search(r'all but undefended|without being stopped|could not survive a serious attack|could not hold off a raid',d) and invb in ('Adequate','Strong'): C['posture cannot-hold beside Invasion Adequate/Strong'].add(k)
        if re.search(r'walls and nobody|nobody on them',invs) and forces: C['M2 nobody-on-walls with a force'].add(k)
        if re.search(r'Money enough to ride out|can pay its way|money in hand|arrangements intact',t) and re.search(r'war takes most of the money|every coin goes on food|has given up several ordinary things for the war',d): C['war/famine drain beside can-pay'].add(k)
        if re.search(r'defences is the reason|walls and gates is|fortifications is|earthworks is earning',t): C['agreement slip'].add(k)
    return C
a=run(sys.argv[1],sys.argv[3]); b=run(sys.argv[2],sys.argv[4])
for k in sorted(set(a)|set(b)): print(f'{k:55s} before {len(a[k]):3d} after {len(b[k]):3d} new {sorted(b[k]-a[k])[:4]}')
