import sys,re,json
B={o['seed']:o for o in map(json.loads,open('scan.base.ndjson'))}
T={o['seed']:o for o in map(json.loads,open('scan.tip.ndjson'))}
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
BARS=['Beasts & Monsters','Invasion & War','Internal Security','Economic Survival','Disasters & Famine']
for seed in sys.argv[1].split(','):
    t,b=T[seed],B[seed]
    print(f"#### {seed} {b['rs']} {b['rl']} -> {t['rs']} {t['rl']} | {t['pros']}/{t['stand']} | W[{t['walls'][:20]}] G[{t['gar'][:25]}] watch[{t['watch'][:20]}] mili[{t['mili'][:16]}] merc[{t['merc'][:10]}]")
    pt=parse(f'{sys.argv[2] if len(sys.argv)>2 else "pages"}/tip/{seed}.txt'); pb=parse(f'{sys.argv[2] if len(sys.argv)>2 else "pages"}/base/{seed}.txt')
    d=pt['tab:defense']; bs=set(pb['tab:defense'])
    # posture + state line
    i=d.index('Guard assessment') if 'Guard assessment' in d else 0
    print('  POSTURE',d[1],'|',d[i+2][:260] if i else '')
    bars=[]
    for k in BARS:
        if k in d: j=d.index(k); bars.append(f"{k.split()[0]}={d[j+1].replace(' ▼','')}{'*' if d[j+1] not in bs else ''}: {d[j+2][:200]}")
    for x in bars: print('   ',x)
    for l in d:
        if l not in bs and not any(l.startswith(k) for k in BARS) and l!=d[1]: print('  +',l[:260])
