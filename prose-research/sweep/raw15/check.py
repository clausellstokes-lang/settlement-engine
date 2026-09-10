import re,sys,json
def norm(t):
    t=t.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    t=t.replace('—','--').replace('–','-')
    return re.sub(r'\s+',' ',t)
claims=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/kay-15.json'))['claims']
files={'reactormag.com':'reactor.txt','thequilltolive.com':'quill.txt','onelastsketch':'sketch.txt','some-writing-advice':'lithub-advice.txt','5-books':'lithub-5books.txt','substack.com':'substack.txt'}
cache={}
for c in claims:
    f=None
    for k,v in files.items():
        if k in c['url'] and (k not in ('some-writing-advice','5-books') or k in c['url']): f=v
    if 'lithub.com' in c['url']:
        f='lithub-advice.txt' if 'some-writing-advice' in c['url'] else 'lithub-5books.txt'
    if f not in cache: cache[f]=norm(open(f,encoding='utf-8').read())
    body=cache[f]
    q=norm(c['quote'])
    hit=q.lower() in body.lower()
    print('---',c['index'],f,'EXACT' if hit else 'MISS','|',c['quote'])
    if hit:
        i=body.lower().index(q.lower())
        print('   CTX:',body[max(0,i-260):i+260].strip())
