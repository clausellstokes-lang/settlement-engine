# -*- coding: utf-8 -*-
# build-payload-904.py — fills payload-904.template.json's ROW/CARD/TAIL placeholders and msg-904.txt from texts-904.draft.md
# (derived from build-payload-903.py; run AFTER the last car and AFTER the final kit re-stamp — a re-stamp regenerates the template).
# Leaves __CAS_SHA__ and __TESTS__ for after-cas-904.sh (the CAS step). Refuses on any other surviving placeholder.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
raw=io.open(SC+'texts-904.draft.md',encoding='utf-8').read(); assert '\u27e6' not in raw, 'unfilled token in texts-904.draft.md: '+str(sorted(set(re.findall('\u27e6[A-Z]+\u27e7',raw)))); d=raw.split('\n')
def section(start_prefix, end_prefix):
    i=[n for n,l in enumerate(d) if l.startswith(start_prefix)]; assert len(i)==1,(start_prefix,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end_prefix)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]
assert row[0].startswith('§904 · **'), row[0][:60]
m=re.match(r'§904 · \*\*(.+?)\*\*\s*(.*)$', row[0]); assert m, row[0][:80]
ROW='**'+m.group(1).strip()+'**'
ROW_BODY=(m.group(2).strip()+'\n\n' if m.group(2).strip() else '')+'\n\n'.join(row[1:])
card=[l for l in section('## CARD','## TAIL')]
h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §904')]; assert len(h)==1
m=re.match(r'## ⭐⭐⭐⭐⭐ PICKUP AT §904 — \*\*(.+?)\*\*\s*(.*)$', h[0]); assert m, h[0][:80]
CARD=m.group(1).strip(); rest=m.group(2).strip()
body=card[card.index(h[0])+1:]; CARD_BODY=(rest+'\n\n' if rest else '')+'\n'.join(body).strip()+'\n'
tail=section('## TAIL','## NEVER-MATCH')
th=[l for l in tail if l.startswith('## §904 — ')]; assert len(th)==1
m=re.match(r'## §904 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]); assert m, th[0]
TAIL=m.group(1).strip(); TAIL_BODY='\n'.join(tail[tail.index(th[0])+1:]).strip()
t=io.open(SC+'payload-904.template.json',encoding='utf-8').read()
for k,v in {'__ROW__':ROW,'__ROW_BODY__':ROW_BODY,'__CARD__':CARD,'__CARD_BODY__':CARD_BODY,'__TAIL__':TAIL,'__TAIL_BODY__':TAIL_BODY}.items():
    assert t.count(k)==1,(k,t.count(k)); t=t.replace(k, json.dumps(v,ensure_ascii=False)[1:-1])
p=json.loads(t)
left=sorted(set(re.findall(r'__[A-Z0-9_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-904.template.json','w',encoding='utf-8').write(t)
print('payload-904.template.json filled; row %d chars, card %d, tail %d; remaining placeholders %s'%(len(p['odq_rows'][0]),len(p['card_new_block']),len(p['frq_tail']),left))
msg=io.open(SC+'msg-904.txt',encoding='utf-8').read()
m=io.open(SC+'texts-904.msg.md',encoding='utf-8').read(); assert '\u27e6' not in m, 'unfilled token in texts-904.msg.md'
def part(name):
    mm=re.search(r'^## '+name+r'\n(.*?)(?=^## |\Z)', m, re.S|re.M); assert mm, name; return mm.group(1).strip()
subject=part('SUBJECT'); bodytxt=part('BODY'); enrols=part('ENROLS')
assert '\n' not in subject and len(subject)<420, len(subject)
for k,v in {'__SUBJECT__':subject,'__BODY__':bodytxt,'__ENROLS__':enrols}.items():
    assert msg.count(k)==1,k; msg=msg.replace(k,v)
assert not re.findall(r'__[A-Z0-9_]+__',msg), re.findall(r'__[A-Z0-9_]+__',msg)
io.open(SC+'msg-904.txt','w',encoding='utf-8').write(msg)
print('msg-904.txt filled: subject %d chars, body %d chars'%(len(subject),len(bodytxt)))
