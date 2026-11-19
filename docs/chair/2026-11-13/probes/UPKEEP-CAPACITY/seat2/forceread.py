# forceread.py <dir> <keys>: per place, the Defense tab's posture word, the Invasion row, the force card and the guard lines
import sys,re
for k in open(sys.argv[2]).read().split():
    t=open(f'{sys.argv[1]}/{k}.txt').read()
    d=t.split('== tab:defense ==')[1].split('\n== ')[0].split('\n')
    i=d.index('Invasion & War')
    sf=d.index('Standing forces') if 'Standing forces' in d else None
    forces=[]
    if sf:
        j=sf+1
        while j<len(d) and d[j] and not d[j].startswith('Supporting'): forces.append(d[j]); j+=1
    ga=d[d.index('Guard assessment')+1:d.index('Threat Assessment')]
    print(f'## {k}: posture {d[d.index("Defensive posture")+1]} | invasion {d[i+1]} | {d[i+2]}')
    print('   guard:', ' / '.join(ga))
    print('   card:', [x for x in forces if len(x)<40 and x not in ('FORCED','REQ')], '| posture-para:', (forces[-1][:200] if forces else 'NO STANDING FORCES SECTION'))
