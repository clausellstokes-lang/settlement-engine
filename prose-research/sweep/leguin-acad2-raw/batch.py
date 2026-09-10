import si, json, sys
from concurrent.futures import ThreadPoolExecutor
IDS=['understandingurs0000cumm','approachestofict0000bitt','farthestshoresof0000slus','ursulakleguin00bloo',
     'ursulakleguinsle0000unse','ursulakleguinbey0000cadd','dancingwithdrago0000whit','ursulakleguin00olan',
     'ursulakleguin0453spiv','ursulakleguin00buck','fantasytradition0000atte','ursulakleguinvoy0000unse']
TERMS=sys.argv[1].split('|')
jobs=[(i,t) for i in IDS for t in TERMS]
def run(j):
    i,t=j
    try:
        tot,o=si.q('identifier:%s AND %s'%(i,t))
        return (i,t,tot,o)
    except Exception as e:
        return (i,t,'ERR '+str(e),[])
with ThreadPoolExecutor(6) as ex:
    for i,t,tot,o in ex.map(run,jobs):
        if not o: continue
        for r in o:
            print('=== [%s] %s | p.%s | q=%s'%(i, si.ROSTER.get(i,'')[:45], r['page'], t))
            for h in r['hl']:
                print('   >',h.replace('\n',' '))
