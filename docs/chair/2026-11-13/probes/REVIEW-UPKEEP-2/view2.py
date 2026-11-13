import sys,re,os,json
D=sys.argv[1]; S={json.loads(l)['seed']:json.loads(l) for l in open(sys.argv[2])}
BARS=['Beasts & Monsters','Invasion & War','Internal Security','Economic Survival','Disasters & Famine']
for f in sorted(os.listdir(D)):
    t=open(os.path.join(D,f)).read(); d=t.split('== tab:defense ==\n')[1].split('\n== ')[0].split('\n'); s=S[f[:-4]]
    print(f"## {f[:-4]} {s['rs']} {s['rl']} | {s['pros']}/{s.get('stand')} | W[{s['walls']}] G[{s['gar']}] watch[{s['watch']}] mili[{s['mili']}] merc[{s['merc']}]")
    i=d.index('Guard assessment'); print('  POSTURE',d[1],'|',d[i+2][:200])
    for k in BARS:
        if k in d: j=d.index(k); print(f'   {k.split()[0]}={d[j+1][:-2]}: {d[j+2][:170]}')
    a=d.index([x for x in d if x.startswith('Armed Forces')][0]); 
    for x in d[a:a+14]:
        if len(x)>60 and not x.startswith(('Unfortified','No organized','Part-time','Watchmen','Citizens','Household','Guarded','Organised','Organized','A body','Inner','The inner')): print('   •',x[:200])
