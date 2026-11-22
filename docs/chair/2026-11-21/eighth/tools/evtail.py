# READ A SEAT'S LAST STEPS from a saved list_events result (the eighth chair's). A seat's record (E109) is read
# another way: list_events, kinds ["result"], the newest main-loop result, usage.iterations' LAST element:
# input_tokens + cache_read_input_tokens + cache_creation_input_tokens.
import json,sys
# usage: evtail.py <saved list_events file> [n]
raw=open(sys.argv[1]).read()
n=int(sys.argv[2]) if len(sys.argv)>2 else 12
d=None
for line in raw.splitlines():
    try: j=json.loads(line)
    except Exception: continue
    if isinstance(j,dict) and 'ccr' in j: d=j['ccr']
ev=(d or {}).get('data') or []
print('events',len(ev),'has_more',(d or {}).get('has_more'))
out=[]
for e in ev:
    ts=e.get('created_at','')[11:19]
    a=e.get('assistant') or {}
    c0=a.get('internal_anthropic_catchall') or a
    agent=c0.get('agent_id') or ''
    msg=c0.get('message') or a.get('message') or {}
    for c in msg.get('content',[]) or []:
        if c.get('type')=='text' and c.get('text','').strip():
            out.append((ts,agent,'TEXT',c['text'].strip()[:900]))
        elif c.get('type')=='tool_use':
            inp=c.get('input',{})
            s=inp.get('message') or inp.get('command') or inp.get('description') or json.dumps(inp)[:200]
            out.append((ts,agent,'TOOL '+c.get('name',''),str(s)[:400]))
for o in out[-n:]:
    print('---',o[0],('sub:'+o[1][:6]) if o[1] else 'MAIN',o[2]); print(o[3])
