# -*- coding: utf-8 -*-
# build-payload-901.py — fills payload-901.template.json's ROW/CARD/TAIL placeholders and msg-901.txt from texts-901.draft.md
# (derived from build-payload-900.py; run AFTER the last car and AFTER the final kit re-stamp — a re-stamp regenerates the template).
# Leaves __CAS_SHA__ and __TESTS__ for after-cas-901.sh (the CAS step). Refuses on any other surviving placeholder.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
d=io.open(SC+'texts-901.draft.md',encoding='utf-8').read().split('\n')
def section(start_prefix, end_prefix):
    i=[n for n,l in enumerate(d) if l.startswith(start_prefix)]; assert len(i)==1,(start_prefix,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end_prefix)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]
assert row[0].startswith('§901 · **'), row[0][:60]
m=re.match(r'§901 · \*\*(.+?)\*\*\s*(.*)$', row[0]); assert m, row[0][:80]
ROW='**'+m.group(1).strip()+'**'
ROW_BODY=(m.group(2).strip()+'\n\n' if m.group(2).strip() else '')+'\n\n'.join(row[1:])
card=[l for l in section('## CARD','## TAIL')]
h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §901')]; assert len(h)==1
m=re.match(r'## ⭐⭐⭐⭐⭐ PICKUP AT §901 — \*\*(.+?)\*\*\s*(.*)$', h[0]); assert m, h[0][:80]
CARD=m.group(1).strip(); rest=m.group(2).strip()
body=card[card.index(h[0])+1:]; CARD_BODY=(rest+'\n\n' if rest else '')+'\n'.join(body).strip()+'\n'
tail=section('## TAIL','## NEVER-MATCH')
th=[l for l in tail if l.startswith('## §901 — ')]; assert len(th)==1
m=re.match(r'## §901 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]); assert m, th[0]
TAIL=m.group(1).strip(); TAIL_BODY='\n'.join(tail[tail.index(th[0])+1:]).strip()
t=io.open(SC+'payload-901.template.json',encoding='utf-8').read()
for k,v in {'__ROW__':ROW,'__ROW_BODY__':ROW_BODY,'__CARD__':CARD,'__CARD_BODY__':CARD_BODY,'__TAIL__':TAIL,'__TAIL_BODY__':TAIL_BODY}.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k, json.dumps(v,ensure_ascii=False)[1:-1])
p=json.loads(t)
left=sorted(set(re.findall(r'__[A-Z0-9_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-901.template.json','w',encoding='utf-8').write(t)
print('payload-901.template.json filled; row %d chars, card %d, tail %d; remaining placeholders %s'%(len(p['odq_rows'][0]),len(p['card_new_block']),len(p['frq_tail']),left))
msg=io.open(SC+'msg-901.txt',encoding='utf-8').read()
subject="the lighting consist lands at 25 cars — seven L-HOMES cars, the stripper sweep and the chair's eight items compose on the §900 tip; the birth door, the manifest split, four dormancy fences, four W-OPS doors, the Remembrance reader, the generation-law register and the preset witness land dark; two of the wave's cars were refused with measurement as owner rows; the proof's two lane-class reds were cured by chair cars and every register was re-taken to a written prediction"
bodytxt=("The lighting consist (L-HOMES-1/2/3/4/6/8/9, STRIPPER-UNIFY, L-CHAIR-901; L-HOMES-5 and 7 refused with measurement) composed on the §900 CAS 04bb92d19 in laneLIGHTINT: 18 replayed lane cars + the chair's edge re-mint, fix cars A and B, register cars 1 and 2, and the totals car = 25. "
 "The whole-suite proof at the composed tip (32,429 tests; 9 reds in 7 files): five banked known failures byte-identical to §900's rows, two register doors, and two lane-class reds — the chair's own L-CHAIR-901 comment naming the operations-voice leaf by path, and the W-OPS mint's fifth unpaid surface in the soak-harness covering-array census (31 → 35, measured out of band before any literal moved). "
 "Registers LAST with every figure predicted in writing before the doors ran: the lighting census 2537 → 2543 files (probe = door to the digit), the writer-reach refresh (31 rows gain the world-book term, cohort 1322, simulationFlagsLit 81 so the banked rows keep magnitude 81 ≤ 81), mounts / prose-numerics / tuning unchanged, OSR skipped by ruling; the ratchet at 47aed9eb4: totalTests 31872 → 31970, totalFiles 2483 → 2489, entries 5 → 5. "
 "Owner rows opened: the espionage sentences and custody schema; the drift flag's manifest home; the +7-key birth cost of a lit preset; applyTonePreset's third birth path. Next: OSR rung 18, then L-DEFAULT.")
for k,v in {'__SUBJECT__':subject,'__BODY__':bodytxt,'__ENROLS__':'R55–R64 (seven L-HOMES lanes, STRIPPER-UNIFY, L-CHAIR-901, the two measured refusals) — OWED a Fable walk; the chair\'s re-mint, fix cars A/B, register cars 1/2 and the totals car are Fable-validated acts and enrol nothing'}.items():
    assert msg.count(k)==1,k; msg=msg.replace(k,v)
left_msg=re.findall(r'__[A-Z0-9_]+__',msg); assert not left_msg, left_msg
io.open(SC+'msg-901.txt','w',encoding='utf-8').write(msg); print('msg-901.txt filled (%d lines); subject %d chars'%(msg.count('\n'),len(subject)))
