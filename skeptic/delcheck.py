import sys, difflib
a=open(sys.argv[1]).read().split('\n'); b=open(sys.argv[2]).read().split('\n')
sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal' or tag=='insert': continue
    old=' '.join(a[i1:i2]).split(); new=' '.join(b[j1:j2]).split()
    s2=difflib.SequenceMatcher(None,old,new,autojunk=False)
    dels=[]
    for t,x1,x2,y1,y2 in s2.get_opcodes():
        if t in('delete','replace'): dels.append((' '.join(old[x1:x2]), ' '.join(new[y1:y2])[:200]))
    if dels:
        print(f"--- old {i1+1}-{i2} new {j1+1}-{j2}")
        for d,r in dels: print("   DEL:",d[:300]); print("   NEW:",r)
