import json,sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
reps=json.load(open(sys.argv[1],encoding='utf-8'))
s=open(p,encoding='utf-8').read()
for i,(a,b) in enumerate(reps):
    n=s.count(a)
    if n!=1:
        print(f"FAIL #{i}: count={n}: {a[:120]!r}"); sys.exit(1)
    s=s.replace(a,b)
open(p,'w',encoding='utf-8').write(s)
print(f"applied {len(reps)}")
