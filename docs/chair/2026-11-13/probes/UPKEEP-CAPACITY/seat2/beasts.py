# beasts.py <dirA> <dirB> <keys>: the Beasts & Monsters row on the Defense tab and in the PDF, before and after;
# and every line on any surface that speaks of clergy, a priest, a church's help, divine or blessing, after
import sys,re
A,B,K=sys.argv[1:4]
CL=re.compile(r'\b(clergy|cleric|priest|priests|divine|blessing|holy|faithful|turn(?:ing)? the dead|chaplain|temple|church)\b',re.I)
def tab(t):
    d=t.split('== tab:defense ==')[1].split('\n== ')[0].split('\n'); i=d.index('Beasts & Monsters'); return d[i+1]+' | '+d[i+2]
def pdf(t):
    p=t.split('== pdf ==')[1].split('\n== ')[0].split('\n')
    for i,l in enumerate(p):
        if l.strip().startswith('Beasts & Monsters') or l.strip()=='Beasts & Monsters': return ' | '.join(p[i:i+3])
    return '?'
for k in open(K).read().split():
    a=open(f'{A}/{k}.txt').read(); b=open(f'{B}/{k}.txt').read()
    print(f'## {k}\n  tab before: {tab(a)}\n  tab after:  {tab(b)}\n  pdf after:  {pdf(b)[:300]}')
    na=set(l for l in a.split('\n') if CL.search(l)); nb=[l for l in b.split('\n') if CL.search(l) and l not in na]
    for l in nb[:6]: print('  NEW faith line:', l[:240])
