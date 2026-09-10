# -*- coding: utf-8 -*-
"""wizard-resign.py <walker-log> <baseline.json> [--write]
The wizard-news ledger is exact and location-bound; when a cure re-punctuates text INSIDE an entry literal, the row's
SIGNATURE moves at the SAME address. vitest prints the diff of the received vs expected row objects (keys alphabetical,
'-' = expected/baseline, '+' = received/live). This copies the received signature onto the baseline row with the same
path:line:column whose current signature equals the expected one — and ONLY that (no add, no delete, no address change)."""
import json,re,sys,io
log,base=sys.argv[1],sys.argv[2]; WRITE='--write' in sys.argv
raw=io.open(log,encoding='utf-8',errors='replace').read(); raw=re.sub(r'\x1b\[[0-9;]*m','',raw)
blocks=[]; cur=None
for line in raw.split('\n'):
    m=re.match(r'^\s*([+\-]?)\s*"(path|line|column|signature)":\s*("?)([^",]+)\3,?\s*$', line)
    if m:
        if cur is None: cur={}
        mark,key,_,val=m.groups()
        if key=='signature': cur['sig_'+('new' if mark=='+' else 'old' if mark=='-' else 'same')]=val
        elif key=='line' or key=='column': cur[key]=int(val)
        else: cur[key]=val
    elif re.match(r'^\s*[+\-]?\s*\}', line) and cur:
        blocks.append(cur); cur=None
# a vitest hunk may cut the object before its 'column' line; path + line + the OLD signature identify the baseline row uniquely
cands=[b for b in blocks if b.get('path') and b.get('line') is not None and b.get('sig_old') and b.get('sig_new')]
d=json.load(io.open(base,encoding='utf-8')); ent=d['entries']; changed=[]
for e in ent:
    for b in cands:
        if (e['path'],e['line'])==(b['path'],b['line']) and e['signature']==b['sig_old'] and (b.get('column') is None or b['column']==e['column']):
            changed.append((e,b['sig_old'],b['sig_new']))
print('diff blocks parsed:',len(blocks),'· re-sign candidates:',len(cands),'· matched baseline rows:',len(changed))
for e,a,b in changed: print('  RESIGN %s:%d:%d  %s -> %s'%(e['path'],e['line'],e['column'],a,b))
if WRITE and changed:
    for e,a,b in changed: e['signature']=b
    io.open(base,'w',encoding='utf-8').write(json.dumps(d,indent=2,ensure_ascii=False)+'\n'); print('  written (signatures only)')
