import json, os
claims = json.loads(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/claims-in.json',encoding='utf-8').read())
verdicts = json.loads(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-in.json',encoding='utf-8').read())
out = {"name":"hobb","chunk":3,"claims":claims,"verdicts":verdicts}
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-hobb-i431-445.json'
open(p,'w',encoding='utf-8').write(json.dumps(out,ensure_ascii=False,indent=1))
print('wrote',p,os.path.getsize(p),'bytes; claims',len(claims),'verdicts',len(verdicts))
for v in verdicts:
    n=len(v['trueWording'].split())
    print(v['index'],v['verdict'],'words=',n,'OK' if n<=12 else 'TOO LONG')
