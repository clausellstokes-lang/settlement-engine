import re, os, sys
RW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/rewrite/DS-DEF-2'
ANNEX='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
lines=open(ANNEX).read().split('\n')
heads={}
for i,l in enumerate(lines):
    m=re.match(r'^\*\*(.+)\*\*\s*$', l)
    if m:
        norm=m.group(1).replace('`','')
        heads.setdefault(norm,[]).append(i)
dirs=sorted(d for d in os.listdir(RW) if os.path.isdir(os.path.join(RW,d)))
for d in dirs:
    sk=open(os.path.join(RW,d,'skeleton.md')).readline()
    m=re.search(r'`([^`]+)`', sk)
    key=m.group(1)
    hit=heads.get(key)
    print(f"{d}\t{key}\t{hit}")
