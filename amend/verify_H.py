import difflib
K='/Users/cstokes/Desktop/settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16/'
D='/Users/cstokes/Desktop/settlement-engine/docs/'
B={'DESIGN_FP_ARCHITECTURE.md':'volumes-master/','DESIGN_FP_ARCH_CN.md':'volumes/','DESIGN_FP_ARCH_LG.md':'volumes-master/','DESIGN_FP_ARCH_PG.md':'volumes/','DESIGN_FP_ARCH_MF.md':'volumes/'}
for f,sub in B.items():
    A=open(K+sub+f,encoding='utf-8').read(); Bt=open(D+f,encoding='utf-8').read()
    a=A.splitlines(True); b=Bt.splitlines(True)
    sm=difflib.SequenceMatcher(None,a,b,autojunk=False); bad=0; ins=0; rep=0
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op=='equal': continue
        if op=='insert': ins+=1; continue
        if op=='delete': bad+=1; continue
        rep+=1
        x=''.join(a[i1:i2]); y=''.join(b[j1:j2])
        cm=difflib.SequenceMatcher(None,x,y,autojunk=False)
        for o,_,_,_,_ in cm.get_opcodes():
            if o not in ('equal','insert'): bad+=1
    pipes=(A.count('|'),Bt.count('|'))
    print(f,'line-insert hunks',ins,'inline-insert hunks',rep,'NON-INSERTION ops',bad,'brackets',Bt.count('2026-10-16 (coherence fold'),'pipes',pipes,'NUL',Bt.count('\x00'),'lines',len(a),'->',len(b))
