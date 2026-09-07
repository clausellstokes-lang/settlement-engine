import json,re
chunk=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/wolfe-23.json'))
m={"faithandsciencefiction":"stewart.txt","confounding":"wright.txt","lupine":"wowra.txt","posthistory":"posthistory.txt","homage":"cooney.txt","reactormag":"keeley.txt"}
def pick(u):
    for k,v in m.items():
        if k in u: return v
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
    return re.sub(r'\s+',' ',s).strip().lower()
for c in chunk['claims']:
    t=norm(open(pick(c['url']),encoding='utf-8').read())
    q=norm(c['quote'])
    print(c['index'], "EXACT" if q in t else "MISS", repr(c['quote'][:60]))
