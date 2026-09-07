import json
C=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/hobb-24.json'))
m={'jeffreydavidoutcalt':'a-substack.txt','thequaintbooknook':'b-nook.txt','sassideeee':'c-omni.txt','robinhobb.com':'d-hobb.txt','vacuouswastrel':'e-wastrel.txt'}
cache={}
for c in C['claims']:
    f=[v for k,v in m.items() if k in c['url']][0]
    if f not in cache: cache[f]=open(f,encoding='utf-8').read()
    t=cache[f]; q=c['quote']
    exact = q in t
    # normalised: curly->straight, collapse ws
    def n(s):
        s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
        return ' '.join(s.split())
    norm = n(q) in n(t)
    print(c['index'], 'EXACT' if exact else ('NORM_ONLY' if norm else '*** MISS ***'))
