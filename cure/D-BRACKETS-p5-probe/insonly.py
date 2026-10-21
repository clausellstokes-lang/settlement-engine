import difflib, sys
D='/Users/cstokes/Desktop/settlement-engine/docs/'
P='/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-BRACKETS-p5-probe/'
files={'WC':'DESIGN_FP_ARCH_WC.md','WY':'DESIGN_FP_ARCH_WY.md','EP':'DESIGN_FP_ARCH_EP.md','ES':'DESIGN_FP_ARCH_ES.md','IN':'DESIGN_FP_ARCH_IN.md','INT':'DESIGN_FP_ARCH_INT.md','HB':'DESIGN_FP_ARCH_HB.md','PG':'DESIGN_FP_ARCH_PG.md','WF':'DESIGN_FP_ARCH_WF.md','GR':'DESIGN_FP_ARCH_GR.md','POP':'DESIGN_FP_ARCH_POP.md','GENERALS':'DESIGN_FP_GENERALS.md'}
ok=True
for k,f in files.items():
    a=open(P+k+'.pre-p5.md',encoding='utf-8').read().splitlines()
    b=open(D+f,encoding='utf-8').read().splitlines()
    sm=difflib.SequenceMatcher(None,a,b,autojunk=False)
    ins=0; bad=[]
    for tag,i1,i2,j1,j2 in sm.get_opcodes():
        if tag=='equal': continue
        if tag=='insert': ins+=j2-j1; continue
        if tag=='delete': bad.append(('delete',i1,i2)); continue
        # replace: old lines must survive as char-subsequences (only insertions) of new block
        old='\n'.join(a[i1:i2]); new='\n'.join(b[j1:j2])
        cm=difflib.SequenceMatcher(None,old,new,autojunk=False)
        for t,x1,x2,y1,y2 in cm.get_opcodes():
            if t in ('delete','replace'): bad.append((t,i1,old[x1:x2][:60]))
        ins+=1
    print(k, 'inserted-blocks', ins, 'NON-INSERT EDITS', len(bad), bad[:3])
    ok = ok and not bad
print('ALL INSERTIONS-ONLY' if ok else 'VIOLATION')
