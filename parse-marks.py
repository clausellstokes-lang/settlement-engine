#!/usr/bin/env python3
"""parse-marks.py — extract (id -> MARK, reason) from the validators' tables; dry-run by default.
usage: parse-marks.py <validation-*.md ...>   prints per-file tallies and writes marks.json"""
import re,sys,json,os
def cells(line):
    # split on unescaped pipes
    parts=re.split(r'(?<!\\)\|', line.strip())
    return [p.strip() for p in parts[1:-1]] if line.strip().startswith('|') else None
def norm_id(c):
    c=re.sub(r'[*`]','',c).strip()
    m=re.match(r'^([A-Za-z]{1,3}-?[A-Za-z0-9.\-′\']*[A-Za-z0-9′\'])',c)
    return m.group(1) if m else None
ID_RE=re.compile(r'^(R-(?:i|ii|iii|iv|v|vi|vii|viii)′?|W\d+[a-z]?(?:-[a-z]+)?|[DGEPS]-(?:R)?\d+[a-z]?|WF-(?:R)?\d+|L-\d+|A-\d+|RT2\.\d+R?-\d+|D-F\d+|G-F\d+|P-R\d+[a-z]?|P-W\d+|S-F\d+|W-\d+|OV-\d+|VIS-\d+|PS-\d+|E-F\d+|NF-\d+|D-\d\d)$')
MARK_RE=re.compile(r'\b(REVERSE|CHALLENGE|OK)\b')
out={}
for f in sys.argv[1:]:
    tally={'OK':0,'CHALLENGE':0,'REVERSE':0}; rows=0; unmarked=[]
    header=''
    for line in open(f):
        cs=cells(line)
        if not cs or len(cs)<3: continue
        if re.sub(r'[*`]','',cs[0]).strip().lower()=='id': header=' '.join(cs).lower(); continue
        i=norm_id(cs[0])
        if not i or not ID_RE.match(i) or i in('id',): continue
        # find the mark: prefer the LAST cell that starts with a mark word, else any cell with a bolded mark
        mark=None; reason=''
        for c in reversed(cs[1:]):
            c2=re.sub(r'[*`]','',c).strip()
            m=re.match(r'^(REVERSE|CHALLENGE|OK)\b',c2)
            if m: mark=m.group(1); reason=c2[:300]; break
        if mark is None:
            for c in reversed(cs[1:]):
                m=re.search(r'\*\*(REVERSE|CHALLENGE|OK)\b',c)
                if m: mark=m.group(1); reason=re.sub(r'[*`]','',c)[:300]; break
        if mark is None and 'should be' in header: mark='REVERSE'; reason=' | '.join(re.sub(r'[*`]','',c) for c in cs[1:4])[:300]
        rows+=1
        if mark is None: unmarked.append(i); continue
        # keep the strongest mark if an id appears in two tables (summary + body)
        rank={'OK':0,'CHALLENGE':1,'REVERSE':2}
        key=(os.path.basename(f),i)
        if key not in out or rank[mark]>rank[out[key]['mark']]:
            out[key]={'mark':mark,'reason':reason}
    t={'OK':0,'CHALLENGE':0,'REVERSE':0}
    for (ff,i),v in out.items():
        if ff==os.path.basename(f): t[v['mark']]+=1
    print(f"{os.path.basename(f):28s} rows {rows:4d} ids {sum(1 for k in out if k[0]==os.path.basename(f)):4d} {t} unmarked {len(unmarked)} {unmarked[:8]}")
json.dump({f'{k[0]}::{k[1]}':v for k,v in out.items()}, open(os.path.join(os.path.dirname(sys.argv[1]),'marks.json'),'w'), indent=1)
