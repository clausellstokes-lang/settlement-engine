import re,sys
pat=re.compile(r'W[-_]ARMS',re.I)
for path in sys.argv[1:]:
    try: lines=open(path,encoding='utf-8',errors='replace').read().split('\n')
    except Exception as e: print(path,'ERR',e); continue
    for i,l in enumerate(lines,1):
        if pat.search(l):
            print(f'--- {path}:{i}')
            print(l[:2400])
