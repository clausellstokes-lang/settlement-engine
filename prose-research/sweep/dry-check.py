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
        # 09-06 22:00 (chair): a section may number its features as HEADINGS (`## 12. …`) or as BOLD LINES (`**12. …**`, the dnd/hobb/kay
        # shape) — both are features; the old heading-only regex read 0 on a bold-numbered section and printed a FALSE 'dry'.
        m=re.match(r'^#{2,4}\s*(\d+)[.)]\s*(.+?)\s*$',l) or re.match(r'^\*\*\s*(\d+)[.)]\s*(.+?)\*\*',l)
        if m: out.append(re.sub(r'[^a-z0-9 ]','',m.group(2).lower()).strip())
    return out
cur=os.path.join(S,'section-%s.md'%name)
if not os.path.exists(cur): print(json.dumps({'name':name,'error':'no section yet'})); sys.exit(0)
def _rnum(f):
    m=re.search(r'\.r(\d+)[a-z]?(?:-[^.]*)?\.md$',f); return int(m.group(1)) if m else -1
# 09-07 04:16 (chair): the newest snapshot by NUMERIC round tag — a lexical sort ranked r8 above r11 and compared round 12 against round 8
prev=a[a.index('--prev')+1] if '--prev' in a else (sorted(glob.glob(os.path.join(S,'section-%s.r*.md'%name)),key=_rnum)[-1:] or [None])[0]
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
