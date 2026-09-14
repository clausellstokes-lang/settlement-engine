# -*- coding: utf-8 -*-
# fill-template-920.py — fills __ROW__/__ROW_BODY__/__CARD__/__CARD_BODY__/__TAIL__/__TAIL_BODY__ in payload-920.template.json and
# __SUBJECT__/__BODY__/__ENROLS__ in msg-920.txt from texts-920.draft.md, leaving __CAS_SHA__/__TESTS__ for after-cas-920.sh.
# Refuses on any ⟦token⟧ left in the draft. Idempotent on the template (works from a pristine copy kept as *.pristine).
import io,json,re,os,shutil
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/'
raw=io.open(SC+'texts-920.draft.md',encoding='utf-8').read()
toks=sorted(set(re.findall('⟦[^⟧]*⟧',raw))); assert not toks, 'unfilled token(s): '+str(toks)
d=raw.split('\n')
def section(start):
    i=[n for n,l in enumerate(d) if l.startswith('## '+start)]; assert len(i)==1,(start,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith('## ')]; j=j[0] if j else len(d)
    return '\n'.join(d[i+1:j]).strip()
ROW=section('ROW_HEAD'); ROWB=section('ROW_BODY'); CARD=section('CARD_HEAD'); CARDB=section('CARD_BODY'); TAIL=section('TAIL_HEAD'); TAILB=section('TAIL_BODY')
assert ROW.startswith('**') and ROW.endswith('**') and '\n' not in ROW, 'ROW_HEAD must be one bold line'
assert '\n' not in ROWB, 'ROW_BODY must be one paragraph'
assert '\n' not in CARD and '\n' not in TAIL
for f in ('payload-920.template.json','msg-920.txt'):
    if not os.path.exists(SC+f+'.pristine'): shutil.copy(SC+f, SC+f+'.pristine')
t=io.open(SC+'payload-920.template.json.pristine',encoding='utf-8').read()
t=t.replace('__ROW__',json.dumps(ROW,ensure_ascii=False)[1:-1]).replace('__ROW_BODY__',json.dumps(ROWB,ensure_ascii=False)[1:-1])
t=t.replace('__CARD__',json.dumps(CARD,ensure_ascii=False)[1:-1]).replace('__CARD_BODY__',json.dumps(CARDB,ensure_ascii=False)[1:-1])
t=t.replace('__TAIL__',json.dumps(TAIL,ensure_ascii=False)[1:-1]).replace('__TAIL_BODY__',json.dumps(TAILB,ensure_ascii=False)[1:-1])
json.loads(t)  # must still parse
left=sorted(set(re.findall(r'__[A-Z_]+__',t))); assert left==['__CAS_SHA__','__TESTS__'], left
io.open(SC+'payload-920.template.json','w',encoding='utf-8').write(t)
m=io.open(SC+'msg-920.txt.pristine',encoding='utf-8').read()
subj=section('MSG_SUBJECT'); body=section('MSG_BODY'); enrols=section('MSG_ENROLS')
m=m.replace('__SUBJECT__',subj).replace('__BODY__',body).replace('__ENROLS__',enrols)
assert not re.search(r'__[A-Z_]+__',m); io.open(SC+'msg-920.txt','w',encoding='utf-8').write(m)
print('template filled (CAS_SHA/TESTS left for after-cas); msg filled; row', len(ROW)+len(ROWB), 'chars; card', len(CARDB), '; tail', len(TAILB))
