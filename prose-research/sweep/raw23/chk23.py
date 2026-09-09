import re,json
files={'pon':'pon.txt','dos':'dos.txt','idle':'idle.txt','sly':'sly.txt','merric':'merric.txt'}
txt={k:open(v,encoding='utf-8').read() for k,v in files.items()}
norm={k:re.sub(r'\s+',' ',v.lower()) for k,v in txt.items()}
claims=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/dnd-23.json'))['claims']
m={499:'pon',500:'pon',501:'dos',502:'dos',503:'dos',504:'dos',505:'dos',506:'dos',507:'idle',508:'idle',509:'sly',510:'merric',511:'merric',512:'merric',513:'merric'}
for c in claims:
    k=m[c['index']]
    q=re.sub(r'\s+',' ',c['quote'].lower().replace('’',"'").replace('“','"').replace('”','"'))
    hit = q in norm[k]
    print(c['index'], k, 'VERBATIM' if hit else 'NO', '|', c['quote'])
    if hit:
        i=norm[k].find(q)
        print('   CTX:', norm[k][max(0,i-220):i+len(q)+220].replace('\n',' '))
