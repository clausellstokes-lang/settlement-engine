import sys,re
path, pat = sys.argv[1], sys.argv[2]
w = int(sys.argv[3]) if len(sys.argv)>3 else 250
for i,l in enumerate(open(path,encoding='utf-8'),1):
    for m in re.finditer(pat,l):
        s=max(0,m.start()-w); e=min(len(l),m.end()+w)
        print(f"{i}:{m.start()}: ...{l[s:e].strip()}...")
