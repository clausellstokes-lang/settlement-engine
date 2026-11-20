# magicside.py <dirA> <dirB> <keys>: the Defense tab's arcane lines and the Magic tab's reading, side by side
import sys,re
A,B,K=sys.argv[1:4]
def sec(t,name):
    return t.split(f'== tab:{name} ==')[1].split('\n== ')[0]
def defense(t):
    d=sec(t,'defense'); o=sec(t,'overview')
    af=re.search(r'Armed Forces & Fortifications[^\n]*',d); mc=re.search(r'Magical Capability \w+',o)
    arc=[l for l in d.split('\n') if re.search(r'arcane|magic|wizard|alchem|ward|spell',l,re.I) and len(l)<200]
    return (af.group(0) if af else '-', mc.group(0) if mc else '-', arc[:6])
def magic(t):
    m=sec(t,'magic').split('\n')
    g=lambda k: next((l for l in m if l.startswith(k)),'-')
    return (m[2] if len(m)>2 else '-', g('Military role'), g('Reliance on magic:'), [l for l in m if re.search(r'alchem|practi',l,re.I)][:3])
for k in open(K).read().split():
    a=open(f'{A}/{k}.txt').read(); b=open(f'{B}/{k}.txt').read()
    da,db=defense(a),defense(b); mb=magic(b)
    print(f'## {k}\n  DEFENSE before: {da[0]} | {da[1]}\n  DEFENSE after:  {db[0]} | {db[1]}\n    arcane lines after: {db[2]}\n  MAGIC tab after: {mb[0]} | {mb[1]} | {mb[2]}\n    {mb[3]}')
