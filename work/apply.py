import re, json, sys, os
ANNEX='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
VAR=re.compile(r'^(\d+)\.\s+`\[')
FACE=re.compile(r'^\s+-\s+`\[face\]`')
res=json.load(open('work/ext.json'))
only=set(sys.argv[1:]) if len(sys.argv)>1 else None
txt=open(ANNEX,encoding='utf-8').read()
lines=txt.split('\n')
# locate heads freshly
def head_index(key):
    for i,l in enumerate(lines):
        m=re.match(r'^\*\*(.+)\*\*\s*$', l)
        if m and m.group(1).replace('`','')==key: return i
    raise SystemExit('heading not found: '+key)
applied=0
for d,v in sorted(res.items()):
    if only is not None and d not in only: continue
    key=v['key']; i=head_index(key); j=i+1
    while j<len(lines) and (VAR.match(lines[j]) or FACE.match(lines[j])): j+=1
    new=v['cands'][0][1]
    lines[i+1:j]=new
    applied+=1
open(ANNEX,'w',encoding='utf-8').write('\n'.join(lines))
print('applied', applied, 'pools')
