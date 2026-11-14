# REVIEW-UPKEEP-CAPACITY step 1: every line a tip page prints that the same birth's DEF page does not (multiset), page surfaces only
# (the JSON exports, grounding and register are field-diffed in step 3), with its family. usage: python3 plus.py <def> <tip> <out.ndjson>
import sys,os,re,gzip,json,collections
B,T,OUT=sys.argv[1:4]
def parse(p):
    d={};cur=None
    for l in gzip.open(p,'rt'):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
SKIP=('world-export','ai-grounding','register')
FAM=[('F3-count',r'^Armed Forces & Fortifications'),('F1-readiness',r'^(\*|- \*\*Readiness)|^(Fortress|Well-defended|Well-Defended|Defensible|Lightly defended|Lightly Defended|Vulnerable|Undefended)$|^Defense: |^Defense posture:|^(Fortress|Well-[Dd]efended|Defensible|Lightly [Dd]efended|Vulnerable|Undefended):'),
 ('F2-band',r'^(Critical|Weak|Adequate|Strong|Exceptional|Collapsed|Strained|Surplus)( ▼| ▲)?$|^(Monster Defense|Military Strength|Internal Security|Economic Resilience|Magical Capability|Law & order|Defense readiness|Public legitimacy|Social trust|Infrastructure condition|Strength of the powers|Economic|Military|Monster|Internal|Magical)\b.*\b(Critical|Weak|Adequate|Strong|Exceptional|Collapsed|Strained|Surplus)$|^Defense [+-]?#?\d*$|^[-+]?\d+ Defense$|^\d+ (Legitimacy Crisis|Contested|Tolerated|Approved|Beloved|Legitimate)'),
 ('F4-forcelist',r'^Defence |^Arcane defense$|^(Alchemist shop|Alchemist quarter)$'),
 ('F0-number',r'^[#\d/ .%:+-]*$')]
out=open(OUT,'w'); cnt=collections.Counter()
for f in sorted(x for x in os.listdir(T) if x.endswith('.txt.gz')):
    seed=f[:-7]; b=parse(os.path.join(B,f)); t=parse(os.path.join(T,f))
    for v,tl in t.items():
        if v.startswith(SKIP): continue
        bl=b.get(v,[])
        if bl==tl: continue
        for l,k in (collections.Counter(tl)-collections.Counter(bl)).items():
            s=l.strip()
            if not s: continue
            fam=next((n for n,rx in FAM if re.search(rx,s)),None)
            if not fam: fam={'tab:power':'F6-power','tab:relationships':'F6-power','tab:npcs':'F6-power','tab:plot_hooks':'F6-power','tab:institutions':'F6-power','tab:magic':'F6-power'}.get(v,'F5-prose')
            cnt[fam]+=1; out.write(json.dumps({'seed':seed,'surface':v,'fam':fam,'line':s})+'\n')
print(dict(cnt))
