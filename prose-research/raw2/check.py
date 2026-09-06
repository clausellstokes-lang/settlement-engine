import sys,json
pairs=json.load(open(sys.argv[1]))
for f,q in pairs:
    t=open(f).read()
    print(("OK " if q in t else "MISS "), f, "|", q)
