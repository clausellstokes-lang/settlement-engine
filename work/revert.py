import re, json, sys
ANNEX='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
DRAFT='work/annex-draft.md'
VAR=re.compile(r'^(\d+)\.\s+`\[')
FACE=re.compile(r'^\s+-\s+`\[face\]`')
res=json.load(open('work/ext.json'))
targets=sys.argv[1:]
cur=open(ANNEX,encoding='utf-8').read().split('\n')
dr=open(DRAFT,encoding='utf-8').read().split('\n')
def block(lines,key):
    for i,l in enumerate(lines):
        m=re.match(r'^\*\*(.+)\*\*\s*$', l)
        if m and m.group(1).replace('`','')==key:
            j=i+1
            while j<len(lines) and (VAR.match(lines[j]) or FACE.match(lines[j])): j+=1
            return i,j
    raise SystemExit('not found '+key)
for d in targets:
    key=res[d]['key']
    di,dj=block(dr,key)
    ci,cj=block(cur,key)
    cur[ci+1:cj]=dr[di+1:dj]
    print('reverted', d, dj-di-1, 'rows')
open(ANNEX,'w',encoding='utf-8').write('\n'.join(cur))
