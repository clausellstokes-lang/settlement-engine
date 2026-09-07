# -*- coding: utf-8 -*-
# build-payload-903.py — fills payload-903.template.json's ROW/CARD/TAIL placeholders and msg-903.txt from texts-903.draft.md
# (derived from build-payload-900.py; run AFTER the last car and AFTER the final kit re-stamp — a re-stamp regenerates the template).
# Leaves __CAS_SHA__ and __TESTS__ for after-cas-903.sh (the CAS step). Refuses on any other surviving placeholder.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
d=io.open(SC+'texts-903.draft.md',encoding='utf-8').read().split('\n')
def section(start_prefix, end_prefix):
    i=[n for n,l in enumerate(d) if l.startswith(start_prefix)]; assert len(i)==1,(start_prefix,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end_prefix)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]
assert row[0].startswith('§903 · **'), row[0][:60]
m=re.match(r'§903 · \*\*(.+?)\*\*\s*(.*)$', row[0]); assert m, row[0][:80]
ROW='**'+m.group(1).strip()+'**'
ROW_BODY=(m.group(2).strip()+'\n\n' if m.group(2).strip() else '')+'\n\n'.join(row[1:])
card=[l for l in section('## CARD','## TAIL')]
h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §903')]; assert len(h)==1
m=re.match(r'## ⭐⭐⭐⭐⭐ PICKUP AT §903 — \*\*(.+?)\*\*\s*(.*)$', h[0]); assert m, h[0][:80]
CARD=m.group(1).strip(); rest=m.group(2).strip()
body=card[card.index(h[0])+1:]; CARD_BODY=(rest+'\n\n' if rest else '')+'\n'.join(body).strip()+'\n'
tail=section('## TAIL','## NEVER-MATCH')
th=[l for l in tail if l.startswith('## §903 — ')]; assert len(th)==1
m=re.match(r'## §903 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]); assert m, th[0]
TAIL=m.group(1).strip(); TAIL_BODY='\n'.join(tail[tail.index(th[0])+1:]).strip()
t=io.open(SC+'payload-903.template.json',encoding='utf-8').read()
for k,v in {'__ROW__':ROW,'__ROW_BODY__':ROW_BODY,'__CARD__':CARD,'__CARD_BODY__':CARD_BODY,'__TAIL__':TAIL,'__TAIL_BODY__':TAIL_BODY}.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k, json.dumps(v,ensure_ascii=False)[1:-1])
p=json.loads(t)
left=sorted(set(re.findall(r'__[A-Z0-9_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-903.template.json','w',encoding='utf-8').write(t)
print('payload-903.template.json filled; row %d chars, card %d, tail %d; remaining placeholders %s'%(len(p['odq_rows'][0]),len(p['card_new_block']),len(p['frq_tail']),left))
msg=io.open(SC+'msg-903.txt',encoding='utf-8').read()
subject="the lit default lands at 9 cars — the default preset takes the wave's class C+D (twenty-one virtual keys) so a new realm runs the world-alive stack from its first tick and no installed campaign is re-labelled; hunks 2–7 are refused with measurement and become three owner rows and the rung-20 migration"
bodytxt=("Lane L-DEFAULT (Opus) landed hunk 1 in four cars over the §902 CAS: the twenty-one virtual keys into realistic_regional with identity held three ways; the witness re-recorded for one row with its cause in the shift ledger (__birth_default__ unmoved); the Compendium artifact regenerated and the lived-experience preset census 3 -> 4 (two reds the brief's list never named, the class closed by scan). "
 "Hunks 2-7 refused with measurement: the successor preset id is persisted and public (owner), infoMode on the premium gate is a paid surface (owner), class E is IMPOSSIBLE on the legacy id (eleven keys re-infer custom, seasonsEnabled re-infers living_realm; the chair re-executed the proof), classes F+G grow the observed-shape register (rung 20), the 25-key re-key rides the same rung. "
 "The proof at 6ff3249b9: nine arms in nine files under the research burst: three banked, the lawful observed-shape input drift, the edge-shared bundle family (cured by the re-mint car), and two load timeouts re-executed green singly on the quiet machine. Registers re-taken at the tip to written predictions (the OSR shrink re-freeze absorbs the compendium input drift); the ratchet held at totalTests 31970, totalFiles 2489, entries 3; the capsule regenerated with this ratchet's totalTests. Landed by fast-forward. "
 "Owner rows: the lit successor id and label; infoMode on the paid surface; the Compendium's copy against nineteen lit systems. Ratified, vetoable: the +28 birth price. Next: the owner's rulings, the quiet-machine jobs, the prose program's round 3, the walk.")
for k,v in {'__SUBJECT__':subject,'__BODY__':bodytxt,'__ENROLS__':'R66 (L-DEFAULT) — enrolled; (b), (c) and the hunk-5 proof ruled by the chair at this landing, the +28 declaration vetoable; the register, totals and capsule cars are Fable-validated acts and enrol nothing'}.items():
    assert msg.count(k)==1,k; msg=msg.replace(k,v)
left_msg=re.findall(r'__[A-Z0-9_]+__',msg); assert not left_msg, left_msg
io.open(SC+'msg-903.txt','w',encoding='utf-8').write(msg); print('msg-903.txt filled (%d lines); subject %d chars'%(msg.count('\n'),len(subject)))
