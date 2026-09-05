# -*- coding: utf-8 -*-
"""wizard-resign.py <walker-log> <baseline.json> [--write]
The wizard-news ledger is exact and location-bound; when a cure re-punctuates text INSIDE an entry literal, the row's
SIGNATURE moves at the SAME address. The walker's failure output carries the received rows. This copies the received
signature onto the baseline row with the same path:line:column — and ONLY that (no add, no delete, no address change)."""
import json,re,sys,io
log,base=sys.argv[1],sys.argv[2]; WRITE='--write' in sys.argv
txt=io.open(log,encoding='utf-8',errors='replace').read()
# vitest prints the received array in the diff; pull every {path,line,column,signature} it shows
rows=[]
for m in re.finditer(r'"path":\s*"([^"]+)",\s*"line":\s*(\d+),\s*"column":\s*(\d+),\s*"signature":\s*"([0-9a-f]{16})"', txt.replace('\n',' ')):
    rows.append((m.group(1),int(m.group(2)),int(m.group(3)),m.group(4)))
d=json.load(io.open(base,encoding='utf-8')); ent=d['entries']
byaddr={}
for p,l,c,s in rows: byaddr.setdefault((p,l,c),set()).add(s)
changed=[]
for e in ent:
    k=(e['path'],e['line'],e['column']); sigs=byaddr.get(k,set())-{e['signature']}
    if len(sigs)==1: changed.append((k,e['signature'],next(iter(sigs))))
    elif len(sigs)>1: print('AMBIGUOUS',k,sigs); sys.exit(1)
print('rows in log:',len(rows),'· baseline rows:',len(ent),'· re-sign candidates:',len(changed))
for k,a,b in changed: print('  RESIGN %s:%d:%d  %s -> %s'%(k[0],k[1],k[2],a,b))
if WRITE and changed:
    for e in ent:
        for k,a,b in changed:
            if (e['path'],e['line'],e['column'])==k and e['signature']==a: e['signature']=b
    io.open(base,'w',encoding='utf-8').write(json.dumps(d,indent=2,ensure_ascii=False)+'\n'); print('  written (signatures only)')
