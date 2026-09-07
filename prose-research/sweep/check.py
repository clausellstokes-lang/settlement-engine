import re,sys
def norm(s): return re.sub(r'\s+',' ',s).strip()
def check(fn, quotes):
    t=norm(open(fn,encoding='utf-8',errors='replace').read())
    lines=[l for l in open(fn,encoding='utf-8',errors='replace')]
    for q in quotes:
        nq=norm(q)
        inline=any(nq in norm(l) for l in lines)
        print(('OK ' if nq in t else 'MISS')+(' [1line]' if inline else ' [wrap] ')+f' ({len(nq.split())}w) '+q)
if __name__=='__main__':
    fn=sys.argv[1]
    for q in sys.argv[2:]: check(fn,[q])
