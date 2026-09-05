# -*- coding: utf-8 -*-
# build-payload-899.py — fills payload-899.template.json's ROW/CARD/TAIL placeholders and msg-899.txt from texts-899.draft.md.
# Leaves __CAS_SHA__ and __TESTS__ for after-cas-899.sh (the CAS step). Refuses on any other surviving placeholder.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/'
d=io.open(SC+'texts-899.draft.md',encoding='utf-8').read().split('\n')
def section(start_prefix, end_prefix):
    i=[n for n,l in enumerate(d) if l.startswith(start_prefix)]; assert len(i)==1,(start_prefix,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end_prefix)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]
assert row[0].startswith('§899 · **'), row[0][:60]
m=re.match(r'§899 · \*\*(.+?)\*\*\s*(.*)$', row[0]); assert m, row[0][:80]
ROW=m.group(1).strip()+'**'; ROW='**'+ROW           # keep the bold headline as the row's lead
ROW_BODY=(m.group(2).strip()+'\n\n' if m.group(2).strip() else '')+'\n\n'.join(row[1:])
card=[l for l in section('## CARD','## TAIL')]
h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §899')]; assert len(h)==1
m=re.match(r'## ⭐⭐⭐⭐⭐ PICKUP AT §899 — \*\*(.+?)\*\*\s*(.*)$', h[0]); assert m, h[0][:80]
CARD=m.group(1).strip(); rest=m.group(2).strip()
body=card[card.index(h[0])+1:]; CARD_BODY=(rest+'\n\n' if rest else '')+'\n'.join(body).strip()+'\n'
tail=section('## TAIL','## NEVER-MATCH')
th=[l for l in tail if l.startswith('## §899 — ')]; assert len(th)==1
m=re.match(r'## §899 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]); assert m, th[0]
TAIL=m.group(1).strip(); TAIL_BODY='\n'.join(tail[tail.index(th[0])+1:]).strip()
t=io.open(SC+'payload-899.template.json',encoding='utf-8').read()
for k,v in {'__ROW__':ROW,'__ROW_BODY__':ROW_BODY,'__CARD__':CARD,'__CARD_BODY__':CARD_BODY,'__TAIL__':TAIL,'__TAIL_BODY__':TAIL_BODY}.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k, json.dumps(v,ensure_ascii=False)[1:-1])
p=json.loads(t)  # must still parse
left=sorted(set(re.findall(r'__[A-Z_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-899.template.json','w',encoding='utf-8').write(t)
print('payload-899.template.json filled; row %d chars, card %d, tail %d; remaining placeholders %s'%(len(p['odq_rows'][0]),len(p['card_new_block']),len(p['frq_tail']),left))
msg=io.open(SC+'msg-899.txt',encoding='utf-8').read()
subject="the composed consist lands at 29 cars — the clamp program closes at 69, the JSX voice debt is cured, the chance meeting reaches the Herald, and the docket's three items land"
bodytxt=("CLAMP-W2 (3 cars) + the edge-shared re-mint + CLAMP-W3's ceiling car (62 -> 69, the measured residual) + VOICE-JSX (34/34 mainline dashes cured, Tier-3 green with no refreeze)\n"
 "+ ENC-4 (9 cars, ROAD B: the chance meeting's Herald line under the chair's sealed sentences) + DOCKET (4 cars: the soak takes --preset, the clamp detector states its reach,\n"
 "the paid-rights floor is machinery) + six chair cars (the hash01 pin, the bare 0.56 registered as CHANCE_MEETING_NEWS_TUNING, the manifest rationale row, pantheon A5's\n"
 "pins and the EXPECTED_VOICE row ENC-4 never moved, SK-0's retired literal) + two register cars + the totals car (entries 5 -> 2, files 2470, tests 31511) + the owed-ledger\n"
 "retirement (three rows, OWED_CEILING 5 -> 2). The whole-tree proof at the composed tip found five reds before the gate; the first totals run refused on a sixth in\n"
 "tests/scripts/ the three-directory proof had not covered. Every lane's brief was corrected by measurement at least once; the corrections are in the queue and the plan.")
for k,v in {'__SUBJECT__':subject,'__BODY__':bodytxt,'__ENROLS__':'R41–R45 (CLAMP-W2, VOICE-JSX, ENC-4, CLAMP-W3, DOCKET) — OWED a Fable walk; the chair cars are Fable-validated acts'}.items():
    assert msg.count(k)==1,k; msg=msg.replace(k,v)
assert not re.findall(r'__[A-Z_]+__',msg)
io.open(SC+'msg-899.txt','w',encoding='utf-8').write(msg); print('msg-899.txt filled (%d lines); subject %d chars'%(msg.count('\n'),len(subject)))
