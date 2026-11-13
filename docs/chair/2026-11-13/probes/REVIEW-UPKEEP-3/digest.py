# The defence/economy digest of one seed's pages, for the eye: every line of the Defense tab, every Overview,
# Economics, Summary-ish, Tonight, PDF and Foundry line that speaks of money, prosperity, defence, guards,
# walls, swords, crisis; and the realm register's line. usage: python3 digest.py <dir> <seed> [<basedir>]
import sys,re,json
D,seed=sys.argv[1],sys.argv[2]; BD=sys.argv[3] if len(sys.argv)>3 else None
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
K=re.compile(r'(?i)prosper|poor|struggl|comfortable|wealthy|moderate|destitute|money|purse|coin|pay|paid|afford|reserve|treasur|crisis|siege|famine|war\b|hired|sword|mercenar|garrison|militia|levy|watch|wall|palisade|fortif|defen|guard|safety|undefended|fortress|vulnerable|readiness|hunger|food|starv|attack|raid|threat|survival|ride out')
d=parse(f'{D}/{seed}.txt'); b=parse(f'{BD}/{seed}.txt') if BD else None
for v,ls in d.items():
    if v.startswith('world-export') or v.startswith('ai-') : continue
    if v=='register-player' or v=='register-owner':
        for l in ls:
            if '"line"' in l: print(f'[{v}]', l.strip()[:500])
        continue
    bs=set(b.get(v,[])) if b else None
    rows=ls if v=='tab:defense' else [l for l in ls if K.search(l)]
    for l in rows:
        mark='' if bs is None else ('  ' if l in bs else '+ ')
        print(f'{mark}[{v}] {l[:500]}')
    if b:
        ts=set(ls); gone=[l for l in b.get(v,[]) if l not in ts and (v=='tab:defense' or K.search(l))]
        for l in gone: print(f'- [{v}] {l[:500]}')
