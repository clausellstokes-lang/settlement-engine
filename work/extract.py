import re, os, json
RW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/rewrite/DS-DEF-2'
ANNEX='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
VAR=re.compile(r'^(\d+)\.\s+`\[')
FACE=re.compile(r'^\s+-\s+`\[face\]`')
alines=open(ANNEX).read().split('\n')
heads={}
for i,l in enumerate(alines):
    m=re.match(r'^\*\*(.+)\*\*\s*$', l)
    if m: heads.setdefault(m.group(1).replace('`',''),[]).append(i)
def annex_block(key):
    i=heads[key][0]; j=i+1; rows=[]
    while j<len(alines) and (VAR.match(alines[j]) or FACE.match(alines[j])):
        rows.append(alines[j]); j+=1
    return i,j,rows
def runs(lines):
    out=[]; cur=[]; start=None
    for i,l in enumerate(lines):
        if VAR.match(l) or FACE.match(l):
            if not cur: start=i
            cur.append(l)
        elif l.strip()=='' and cur:
            cur.append(None)   # placeholder, dropped later
        else:
            if cur: out.append((start,[x for x in cur if x is not None])); cur=[]
    if cur: out.append((start,[x for x in cur if x is not None]))
    return out
dirs=sorted(d for d in os.listdir(RW) if os.path.isdir(os.path.join(RW,d)))
res={}
for d in dirs:
    key=re.search(r'`([^`]+)`', open(os.path.join(RW,d,'skeleton.md')).readline()).group(1)
    hi,hj,arows=annex_block(key)
    avars=[x for x in arows if VAR.match(x)]; afaces=[x for x in arows if FACE.match(x)]
    txt=open(os.path.join(RW,d,'refine.md')).read().split('\n')
    cands=[]
    for start,run in runs(txt):
        nums=[int(VAR.match(x).group(1)) for x in run if VAR.match(x)]
        nf=sum(1 for x in run if FACE.match(x))
        if nums==list(range(1,len(avars)+1)) and nf==len(afaces) and VAR.match(run[0]):
            cands.append((start,run))
    res[d]={'key':key,'hi':hi,'hj':hj,'annex':arows,'cands':[[c[0],c[1]] for c in cands]}
    print(f"{d}\tk={len(avars)} f={len(afaces)}\tcands={len(cands)}\tat={[c[0]+1 for c in cands]}")
json.dump(res, open('work/ext.json','w'))
