# -*- coding: utf-8 -*-
# build-payload-902.py — fills payload-902.template.json's ROW/CARD/TAIL placeholders and msg-902.txt from texts-902.draft.md
# (derived from build-payload-900.py; run AFTER the last car and AFTER the final kit re-stamp — a re-stamp regenerates the template).
# Leaves __CAS_SHA__ and __TESTS__ for after-cas-902.sh (the CAS step). Refuses on any other surviving placeholder.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
d=io.open(SC+'texts-902.draft.md',encoding='utf-8').read().split('\n')
def section(start_prefix, end_prefix):
    i=[n for n,l in enumerate(d) if l.startswith(start_prefix)]; assert len(i)==1,(start_prefix,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end_prefix)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]
assert row[0].startswith('§902 · **'), row[0][:60]
m=re.match(r'§902 · \*\*(.+?)\*\*\s*(.*)$', row[0]); assert m, row[0][:80]
ROW='**'+m.group(1).strip()+'**'
ROW_BODY=(m.group(2).strip()+'\n\n' if m.group(2).strip() else '')+'\n\n'.join(row[1:])
card=[l for l in section('## CARD','## TAIL')]
h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §902')]; assert len(h)==1
m=re.match(r'## ⭐⭐⭐⭐⭐ PICKUP AT §902 — \*\*(.+?)\*\*\s*(.*)$', h[0]); assert m, h[0][:80]
CARD=m.group(1).strip(); rest=m.group(2).strip()
body=card[card.index(h[0])+1:]; CARD_BODY=(rest+'\n\n' if rest else '')+'\n'.join(body).strip()+'\n'
tail=section('## TAIL','## NEVER-MATCH')
th=[l for l in tail if l.startswith('## §902 — ')]; assert len(th)==1
m=re.match(r'## §902 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]); assert m, th[0]
TAIL=m.group(1).strip(); TAIL_BODY='\n'.join(tail[tail.index(th[0])+1:]).strip()
t=io.open(SC+'payload-902.template.json',encoding='utf-8').read()
for k,v in {'__ROW__':ROW,'__ROW_BODY__':ROW_BODY,'__CARD__':CARD,'__CARD_BODY__':CARD_BODY,'__TAIL__':TAIL,'__TAIL_BODY__':TAIL_BODY}.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k, json.dumps(v,ensure_ascii=False)[1:-1])
p=json.loads(t)
left=sorted(set(re.findall(r'__[A-Z0-9_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-902.template.json','w',encoding='utf-8').write(t)
print('payload-902.template.json filled; row %d chars, card %d, tail %d; remaining placeholders %s'%(len(p['odq_rows'][0]),len(p['card_new_block']),len(p['frq_tail']),left))
msg=io.open(SC+'msg-902.txt',encoding='utf-8').read()
subject="the OSR rung-18 landing lands at 8 cars — the observed-shape register is re-anchored inside the product lineage with a subject commit of its own, the CLI door is open again, the two writer-reach census rows banked at §900 retire with their ledger entries, and the base-state capsule regenerates for the first time since August; the lane corrected the brief twice and refused the rename with measurement"
bodytxt=("Lane OSR-SCHEMA18 (Opus) re-executed the governed schema 17 -> 18 migration in laneOSR18 with the SUBJECT COMMIT INSIDE THE LINEAGE (the rung f20d5dd48; the genesis a05a4646e): validateBaselineHistory reconstructs, the CLI exits 0, corpusMeta.simulationFlagsLit reads 81 on both walkers, rows minted 0 / cleared 0 by digest, _doc cured. "
 "The proof at a05a4646e: three reds, all banked; both writer-reach arms green. Registers re-taken at the tip with every figure unchanged (provenance and the writer-reach detector digest moved, the observed-shape register being one of its inputs); the ratchet retired the two writer-reach rows by a remove-only update and their WALKER_ROWS_OWED entries and OWED_CEILING 5 -> 3 left in one car; the capsule regenerated with this ratchet's totalTests. Landed by fast-forward — a replay would have re-darkened the register. "
 "Owner row: the ninth exemption's retirement never landed at §900 and now costs rung 19 (a detector-source change). Next: L-DEFAULT.")
for k,v in {'__SUBJECT__':subject,'__BODY__':bodytxt,'__ENROLS__':'R65 (OSR-SCHEMA18) — OWED a Fable walk; the chair\'s register cars, the totals car, the retirement car and the capsule car are Fable-validated acts and enrol nothing'}.items():
    assert msg.count(k)==1,k; msg=msg.replace(k,v)
left_msg=re.findall(r'__[A-Z0-9_]+__',msg); assert not left_msg, left_msg
io.open(SC+'msg-902.txt','w',encoding='utf-8').write(msg); print('msg-902.txt filled (%d lines); subject %d chars'%(msg.count('\n'),len(subject)))
