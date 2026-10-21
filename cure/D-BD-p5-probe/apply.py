import sys, importlib.util, hashlib
VOL='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_BD.md'
def run(path):
    spec=importlib.util.spec_from_file_location('g',path); g=importlib.util.module_from_spec(spec); spec.loader.exec_module(g)
    s=open(VOL,encoding='utf-8').read()
    errs=[]
    for i,(old,new) in enumerate(g.EDITS):
        n=s.count(old)
        if n!=1: errs.append((i,n,old[:120]))
    if errs:
        for e in errs: print('FAIL edit',e)
        sys.exit(1)
    for old,new in g.EDITS:
        s=s.replace(old,new,1)
    open(VOL,'w',encoding='utf-8').write(s)
    print('applied',len(g.EDITS),'edits from',path,'sha',hashlib.sha256(s.encode()).hexdigest()[:12])
run(sys.argv[1])
