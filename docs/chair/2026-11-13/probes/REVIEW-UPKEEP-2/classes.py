# Counts each false-sentence class over a page dump directory (base or tip), joined with the scan record.
import sys,re,json,os,collections
D=sys.argv[1]; scan={o['seed']:o for o in map(json.loads,open(sys.argv[2]))}
BARS=['Beasts & Monsters','Invasion & War','Internal Security','Economic Survival','Disasters & Famine']
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
NOBODY=re.compile(r'walls and nobody|nobody on them|meet nobody on them|walls and nobody to put on them|long stretches in good repair with nobody')
NOFORCE=re.compile(r'has no line and no force')
PAYOK=re.compile(r'can pay its way through it|accounts have money in hand|could go through a bad season with its arrangements intact|Money enough to ride out a long crisis')
THREAT=re.compile(r'would take real effort to threaten|does not spend much time thinking about being attacked')
ALLBUT=re.compile(r'is all but undefended\. Nothing in the')
NORAID=re.compile(r'could not hold off a raid')
C=collections.defaultdict(list)
for f in sorted(os.listdir(D)):
    seed=f[:-4]; s=scan[seed]; p=parse(os.path.join(D,f)); d=p.get('tab:defense',[])
    bar={}
    for k in BARS:
        if k in d: j=d.index(k); bar[k]=(d[j+1].replace(' ▼',''), d[j+2] if j+2<len(d) else '')
    inv=bar.get('Invasion & War',('',''))
    forces=bool(s['gar'] or s['watch'] or s['mili'] or s['merc'])
    crisis=seed.split('-')[1]; struggling=s['pros'] in ('Struggling','Poor','Destitute')
    tabtxt='\n'.join(d); pdf='\n'.join(p.get('pdf',[]))
    if NOBODY.search(inv[1]) and forces: C['A nobody-on-walls with a force present'].append((seed,inv[0]))
    if NOBODY.search(inv[1]) and inv[0] in ('Strong',): C['A1 nobody-on-walls beside a Strong invasion bar'].append((seed,inv[0]))
    if NOFORCE.search(inv[1]) and forces: C['B no-line-no-force with a force present'].append((seed,inv[0]))
    if NOFORCE.search(inv[1]) and inv[0] in ('Strong','Adequate'): C['B1 no-line-no-force beside Adequate/Strong'].append((seed,inv[0]))
    if (PAYOK.search(tabtxt) or PAYOK.search(pdf)) and s['pros'] in ('Struggling','Poor','Destitute'): C['C can-pay line beside a printed Struggling/Poor label'].append((seed,s['pros'],s.get('stand')))
    if THREAT.search(tabtxt) and crisis in ('under_siege','wartime'): C['D untroubled-posture under siege/war'].append((seed,s['rl']))
    if ALLBUT.search(tabtxt) and s['walls'] and forces: C['E all-but-undefended beside walls and a force'].append((seed,s['rl']))
    if NORAID.search(tabtxt) and inv[0]=='Strong': C['F could-not-hold-off-a-raid beside Strong invasion'].append((seed,s['rl']))
    if 'Hired swords' in tabtxt and not s['merc']: C['G hired swords with no contracted force'].append((seed,))
    if 'hunger leaves' in tabtxt and crisis=='under_siege': C['H hunger line in a siege (F4)'].append((seed,))
    if re.search(r'hunger leaves|when the purse allows|as far as the purse runs|coin to keep it runs short',tabtxt) and (PAYOK.search(tabtxt) or PAYOK.search(pdf)): C['J short-purse guard line beside a can-pay line'].append((seed,s['pros'],s.get('stand')))
    if 38<=s['rs']<40 and re.search(r'could not hold off a raid|could not survive a serious attack|all but undefended',tabtxt): C['K Defensible label beside a cannot-hold posture line (two ladders)'].append((seed,s['rs']))
    if re.search(r'(walls|fortifications|earthworks|gates) is earning its keep',tabtxt): C['I walls-is grammar'].append((seed,))
json.dump({k:v for k,v in C.items()},open(sys.argv[3],'w'))
for k in sorted(C): print(f'{k:60s} {len(C[k]):4d}  e.g. {C[k][:3]}')
