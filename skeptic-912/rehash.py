import sys, collections, re
def load(p):
    rows=[]
    for line in open(p):
        s,m,path=line.rstrip('\n').split('\t'); rows.append((int(s),m,path))
    return rows
A=load(sys.argv[1]); B=load(sys.argv[2])
ma=collections.Counter(r[1] for r in A); mb=collections.Counter(r[1] for r in B)
onlyA=[r for r in A if ma[r[1]]>mb.get(r[1],0)]
# per-file classification of changed ones
ext=collections.Counter()
for s,m,p in onlyA:
    ext[p.rsplit('.',1)[-1]]+=1
print("files in A whose md5 absent from B:",sum((ma-mb).values()))
print("by extension:",dict(ext))
print("identical (md5 present in both):",len(A)-sum((ma-mb).values()))
