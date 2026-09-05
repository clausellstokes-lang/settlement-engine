# -*- coding: utf-8 -*-
# build-payload-900.py — fills payload-900.template.json's ROW/CARD/TAIL placeholders and msg-900.txt from texts-900.draft.md.
# Leaves __CAS_SHA__ and __TESTS__ for after-cas-900.sh (the CAS step). Refuses on any other surviving placeholder.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/'
d=io.open(SC+'texts-900.draft.md',encoding='utf-8').read().split('\n')
def section(start_prefix, end_prefix):
    i=[n for n,l in enumerate(d) if l.startswith(start_prefix)]; assert len(i)==1,(start_prefix,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end_prefix)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]
assert row[0].startswith('§900 · **'), row[0][:60]
m=re.match(r'§900 · \*\*(.+?)\*\*\s*(.*)$', row[0]); assert m, row[0][:80]
ROW=m.group(1).strip()+'**'; ROW='**'+ROW           # keep the bold headline as the row's lead
ROW_BODY=(m.group(2).strip()+'\n\n' if m.group(2).strip() else '')+'\n\n'.join(row[1:])
card=[l for l in section('## CARD','## TAIL')]
h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §900')]; assert len(h)==1
m=re.match(r'## ⭐⭐⭐⭐⭐ PICKUP AT §900 — \*\*(.+?)\*\*\s*(.*)$', h[0]); assert m, h[0][:80]
CARD=m.group(1).strip(); rest=m.group(2).strip()
body=card[card.index(h[0])+1:]; CARD_BODY=(rest+'\n\n' if rest else '')+'\n'.join(body).strip()+'\n'
tail=section('## TAIL','## NEVER-MATCH')
th=[l for l in tail if l.startswith('## §900 — ')]; assert len(th)==1
m=re.match(r'## §900 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]); assert m, th[0]
TAIL=m.group(1).strip(); TAIL_BODY='\n'.join(tail[tail.index(th[0])+1:]).strip()
t=io.open(SC+'payload-900.template.json',encoding='utf-8').read()
for k,v in {'__ROW__':ROW,'__ROW_BODY__':ROW_BODY,'__CARD__':CARD,'__CARD_BODY__':CARD_BODY,'__TAIL__':TAIL,'__TAIL_BODY__':TAIL_BODY}.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k, json.dumps(v,ensure_ascii=False)[1:-1])
p=json.loads(t)  # must still parse
left=sorted(set(re.findall(r'__[A-Z0-9_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-900.template.json','w',encoding='utf-8').write(t)
print('payload-900.template.json filled; row %d chars, card %d, tail %d; remaining placeholders %s'%(len(p['odq_rows'][0]),len(p['card_new_block']),len(p['frq_tail']),left))
msg=io.open(SC+'msg-900.txt',encoding='utf-8').read()
subject="the desk consist lands at 109 cars — the four desks light fifty-two blocks with a sentence rung, the chance meeting's withheld half speaks, the charset wall and the worker lane land dark, the OSR reaches rung 17 by topology, and every register is re-taken with two rows ledgered to rung 18"
bodytxt=("The desk consist (DESK-WARFAITH, GEN2/GEN3, DEF2, ECON2, DESK-9, DOCKET-2/3, TIMEBAND/-2, HOLDSAFE, the 900-CARS/REDS/TAIL/VISIBILITY lanes, VIS-RESOLVER) + the late docks (OSR-SCHEMA17, ENC-4b/4c, HORIZON-B1/B2, SEAT-78, PANTHEON-ROSTER)\n+ twelve chair cars (the two-band tuning row, presentationFor and its docblock, the coupling roster 7 -> 8, IRREGULAR_TUNING as a draft row, the OSR door reads 4 -> 5, the soak banner, the edge-shared re-mint by the ritual, the worker bundle ceiling arm, the viability verdict\nrestored after a whole-file --ours had discarded GEN2's wiring, the steadings double name, the Tier-2 voice row banked as debt) + four register cars (lighting 2523 -> 2537 files / 23555 titles; mounts dark 64 -> 15; writer-reach through the governed growth door for\nforcedByConfig on stress/stressors; tuning 237 tables; prose-numerics 26 relocations + 4 by hand; the JSX voice fall banked) + two fix cars (the dial roster 31 -> 30 by measurement; the two writer-reach <-> OSR one-flag arms as declared debt, OWED_CEILING 3 -> 5)\n+ the totals car (tests 31511 -> 31872, files 2470 -> 2483, entries 3 -> 5). NOT taken: the OSR --write and the capsule (the schema-17 receipt's subjectSha lies outside the composed lineage after the replay; rung 18 re-anchors both) and the wizard re-sign (green, unchanged).")
for k,v in {'__SUBJECT__':subject,'__BODY__':bodytxt,'__ENROLS__':'R46–R68 (the desk consist, the late docks, VIS-RESOLVER; twenty-three lanes) — OWED a Fable walk; the chair cars, the register cars, the fix cars and the totals car are Fable-validated acts'}.items():
    assert msg.count(k)==1,k; msg=msg.replace(k,v)
left_msg=re.findall(r'__[A-Z0-9_]+__',msg); assert not left_msg, left_msg
io.open(SC+'msg-900.txt','w',encoding='utf-8').write(msg); print('msg-900.txt filled (%d lines); subject %d chars'%(msg.count('\n'),len(subject)))
