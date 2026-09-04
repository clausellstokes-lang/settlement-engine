import re,sys
pat=re.compile(r'W[-_]ARMS',re.I)
before=int(sys.argv[1]); after=int(sys.argv[2])
for path in sys.argv[3:]:
    try: txt=open(path,encoding='utf-8',errors='replace').read()
    except Exception as e: print(path,'ERR',e); continue
    lines=txt.split('\n')
    for i,l in enumerate(lines,1):
        for m in pat.finditer(l):
            a=max(0,m.start()-before); b=min(len(l),m.end()+after)
            print(f'>>> {path}:{i} col{m.start()}')
            print(('…' if a>0 else '')+l[a:b]+('…' if b<len(l) else ''))
            print()
