import re
Q=[
(887,'seed','d10 Sigil adventure hooks, d6 Faction Missions, d8 Sigil Calamities'),
(888,'seed','3 pages covering 18 sites with a single paragraph each'),
(889,'seed','46 pages on Sigil and 36 pages on the Outlands'),
(890,'expo','Duchess Zelza Zurkbane (lawful evil succubus) and her senators'),
(891,'expo','true for pretty much all of the special traits listed'),
(892,'expo','brief blurbs, 1-2 paragraphs each, on the following'),
(893,'strange','Descriptions are presented from the point of view of various'),
(894,'strange','general guides to the character of a place, not an'),
(895,'writer','Each location is given details that include history, potential lore'),
(896,'writer','firsthand accounts from the researchers and loremasters from whose'),
(897,'writer','has 53 pages dedicated to the city of Baldur'),
(898,'ddb','Read or paraphrase the following to set the scene'),
(899,'ddb','Just past midday, you come across a smashed cart'),
(900,'ddb','Just past midday, you come across a smashed cart'),
(901,'ddb','Investigating the Cart. This cart is a simple wooden carriage'),
]
T={f:open(f+'.txt',encoding='utf-8').read() for f in ['seed','expo','strange','writer','ddb']}
def norm(s): return re.sub(r'\s+',' ',s).replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','--')
for i,f,q in Q:
    t=norm(T[f]); nq=norm(q)
    hit = nq.lower() in t.lower()
    print('='*70)
    print(i,f,'EXACT' if hit else 'NO-EXACT', '|', q)
    if hit:
        p=t.lower().index(nq.lower())
        print('CTX:', t[max(0,p-320):p+420])
    else:
        # fuzzy: try distinctive substrings
        words=nq.split()
        for n in (5,4,3):
            found=False
            for s in range(len(words)-n+1):
                frag=' '.join(words[s:s+n])
                if frag.lower() in t.lower():
                    p=t.lower().index(frag.lower())
                    print(f'  frag[{n}] "{frag}" -> ', t[max(0,p-300):p+400])
                    found=True; break
            if found: break
