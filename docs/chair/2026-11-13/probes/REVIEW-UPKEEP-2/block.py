import sys,re,json
B={o['seed']:o for o in map(json.loads,open('scan.base.ndjson'))}
T={o['seed']:o for o in map(json.loads,open('scan.tip.ndjson'))}
DEF=re.compile(r'defen|wall|garrison|watch|militia|levy|guard|store|granar|ration|readi|fortif|palisade|siege|mercenar|hired|sword|soldier|army|armed|ward|fortress|vulnerab|defensible|undefended|well-defended|lightly defended|hold out|hold against|man the|military|paid|pay |purse|month',re.I)
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
for seed in sys.argv[1].split(','):
    t,b=T[seed],B[seed]
    print(f"######## {seed}  base {b['rs']} {b['rl']} -> tip {t['rs']} {t['rl']} | pros {t['pros']} standing {t['stand']} | stress {t['stress']} | mil {b['mil']}->{t['mil']} mon {b['mon']}->{t['mon']} int {b['int']}->{t['int']} eco {b['eco']}->{t['eco']} dis {b['dis']}->{t['dis']} | W[{t['walls']}] G[{t['gar']}] watch[{t['watch']}] mil[{t['mili']}] merc[{t['merc']}] charter[{t['charter']}] | months {b['months']}->{t['months']}")
    pt=parse(f'pages/tip/{seed}.txt'); pb=parse(f'pages/base/{seed}.txt')
    dl=pt['tab:defense']; out=[]; skip=False
    for l in dl:
        if l.startswith('Active criminal operations') or l.startswith('Active crime patterns'): skip=True; continue
        if l.startswith('Armed Forces'): skip=False
        if l.startswith('Criminal structure'): skip=True
        if skip: continue
        mark='+' if l not in set(pb['tab:defense']) else ' '
        out.append(f'{mark} {l[:420]}')
    print('\n'.join(out))
    for v in pt:
        if v in ('tab:defense','world-export-player','world-export-dm','ai-grounding') : continue
        bs=set(pb.get(v,[])); ts=set(pt[v])
        new=[l for l in pt[v] if l not in bs and DEF.search(l)]; gone=[l for l in pb.get(v,[]) if l not in ts and DEF.search(l)]
        if new or gone:
            print(f'  ~~ {v}')
            for l in gone[:8]: print('     -',l[:300])
            for l in new[:8]: print('     +',l[:300])
