import os, re, sys
M='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963'
L='/Users/cstokes/Desktop/settlement-engine/docs'
roots={'MASTER/src':M+'/src','MASTER/tests':M+'/tests','LEDGER-docs':L}
toks=['body_ended','party_made_known_trail','bodyId','passed','reaches_party']
for t in toks:
    pat=re.compile(r"""['"`]"""+re.escape(t)+r"""['"`]""")
    for name,root in roots.items():
        hits=[]
        for dp,dn,fn in os.walk(root):
            if 'node_modules' in dp: continue
            for f in fn:
                p=os.path.join(dp,f)
                try: s=open(p,encoding='utf-8',errors='ignore').read()
                except Exception: continue
                if pat.search(s): hits.append(p.replace(root,name))
        print(f"{t}\t{name}\tquoted-literal-files={len(hits)}\t{hits[:4]}")
