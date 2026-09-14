import re, json, os
ANNEX='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
PK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/rewrite/DS-DEF-2'
VAR=re.compile(r'^(\d+)\.\s+`\[')
FACE=re.compile(r'^\s+-\s+`\[face\]`')
res=json.load(open('work/ext.json'))
lines=open(ANNEX,encoding='utf-8').read().split('\n')
def block(key):
    for i,l in enumerate(lines):
        m=re.match(r'^\*\*(.+)\*\*\s*$', l)
        if m and m.group(1).replace('`','')==key:
            j=i+1
            while j<len(lines) and (VAR.match(lines[j]) or FACE.match(lines[j])): j+=1
            return lines[i+1:j]
    raise SystemExit('not found '+key)
for d,v in sorted(res.items()):
    rows=block(v['key'])
    assert len(rows)==12, (d,len(rows))
    open(os.path.join(PK,d,'kept.md'),'w',encoding='utf-8').write('\n'.join(rows)+'\n')
    print('wrote', d, len(rows))
