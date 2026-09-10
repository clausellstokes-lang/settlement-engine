# -*- coding: utf-8 -*-
"""dry-check.py <name> [--prev <section file>] — S-BOUND (owner 2026-09-06): a sweep is DRY when a round adds NO NEW numbered feature to its
section. Compares the numbered feature headings of sweep/section-<name>.md against the previous round's section (default: the newest
sweep/section-<name>.r*.md snapshot, else none) and prints {new, dropped, total, dry}. Snapshot a section before a round with
`cp section-<name>.md section-<name>.r<N>.md` so the next check has a baseline. Also reports per-feature verified-source counts from
kept-<name>.json (three distinct sources settle a feature)."""
import json,re,sys,os,glob,collections
S=os.path.dirname(os.path.abspath(__file__)); name=sys.argv[1]; a=sys.argv[2:]
def feats(path):
    out=[]
    for l in open(path,encoding='utf-8'):
        m=re.match(r'^#{2,4}\s*(\d+)[.)]\s*(.+?)\s*$',l)
        if m: out.append(re.sub(r'[^a-z0-9 ]','',m.group(2).lower()).strip())
    return out
cur=os.path.join(S,'section-%s.md'%name)
if not os.path.exists(cur): print(json.dumps({'name':name,'error':'no section yet'})); sys.exit(0)
prev=a[a.index('--prev')+1] if '--prev' in a else (sorted(glob.glob(os.path.join(S,'section-%s.r*.md'%name)))[-1:] or [None])[0]
c=feats(cur); p=feats(prev) if prev else []
def key(t): return set(t.split()[:4])   # a feature is "the same" when its first four words match (headings get reworded between rounds)
new=[t for t in c if not any(key(t)==key(q) or (len(key(t)&key(q))>=3) for q in p)] if p else c
dropped=[q for q in p if not any(key(t)==key(q) or (len(key(t)&key(q))>=3) for t in c)]
# per-feature verified sources from kept-<name>.json
kp=os.path.join(S,'kept-%s.json'%name); per=collections.defaultdict(set)
if os.path.exists(kp):
    for r in json.load(open(kp)): per[str(r.get('feature','')).lower()].add(str(r.get('source','')).lower())
thin=sorted([f for f,srcs in per.items() if len(srcs)<3])
print(json.dumps({'name':name,'section':cur,'prev':prev,'features':len(c),'prevFeatures':len(p),'new':new,'dropped':dropped,'dry':(prev is not None and len(new)==0),'featuresWithUnder3Sources':len(thin),'featureKeys':len(per)},ensure_ascii=False))
