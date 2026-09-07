import json,re,sys
FILES={
 'roll20':'dnd-roll20-settlements-2024.txt',
 'tracker':'settlement-tracker.txt',
 'dmg14':'dmg2014-ia.txt',
 'srd51':'srd51.txt',
 'srd521':'srd521.txt',
 'sly':'d-2631c0b695f5f151fb6fb8ac640db644.txt',
 'oak':'d-dad07efa4f1ca8cc6173890354d6ae32.txt',
 'pcg':'d-d20d9b4c563f7498dbafc21bc5e3e71c.txt',
 'warg':'d-aec8261cdeab45ae20ed1cb3dca8e1df.txt',
 'd20d':'d-c783a7ff56fc8949131c134fe4e0e4a3.txt',
 'jeth':'d-48235bcccffbb9008dc43ea88ddc0226.txt',
}
T={k:open(v,encoding='utf-8',errors='replace').read() for k,v in FILES.items()}
N={k:re.sub(r'\s+',' ',v) for k,v in T.items()}
QUOTES=json.load(open('quotes.json'))
bad=0
for k,q in QUOTES:
    if not q: print('BLANK   ', k); continue
    nq=re.sub(r'\s+',' ',q).strip()
    exact = q in T[k]
    norm  = nq in N[k]
    w=len(nq.split())
    flag='OK ' if norm else 'FAIL'
    if not norm: bad+=1
    if w>12: flag+=' >12W'; bad+=1
    print(f'{flag} [{k}] ({w}w) exact={exact} :: {q}')
print('BAD:',bad)
