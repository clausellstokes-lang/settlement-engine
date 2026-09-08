import si,sys,re
from concurrent.futures import ThreadPoolExecutor
def clean(h): return re.sub(r'\{\{\{|\}\}\}','',h).replace('\n',' ')
def go(args):
    ident,phrase=args
    try:
        tot,o=si.q('identifier:%s AND "%s"'%(ident,phrase))
        return ident,phrase,[clean(h) for r in o for h in r['hl']]
    except Exception as e: return ident,phrase,['ERR '+str(e)]
jobs=[tuple(l.split('\t')) for l in sys.stdin.read().strip().split('\n') if l.strip()]
with ThreadPoolExecutor(6) as ex:
    for ident,phrase,hs in ex.map(go,jobs):
        print('### %s <<%s>>'%(ident,phrase))
        for h in hs: print('   >',h)
