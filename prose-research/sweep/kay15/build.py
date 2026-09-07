import json
claims = json.load(open('kay15/claims-in.json'))
verdicts = json.load(open('kay15/verdicts-in.json'))
assert len(claims)==15 and len(verdicts)==15
ci=[c['index'] for c in claims]; vi=[v['index'] for v in verdicts]
assert ci==vi, (ci,vi)
for v in verdicts:
    n=len(v['trueWording'].split())
    assert n<=12, (v['index'],n,v['trueWording'])
out={"name":"kay","chunk":15,"claims":claims,"verdicts":verdicts}
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-kay-i1082-1096.json'
json.dump(out,open(p,'w'),indent=1,ensure_ascii=False)
print('wrote',p,len(open(p).read()),'bytes')
print('max trueWording words:',max(len(v['trueWording'].split()) for v in verdicts))
