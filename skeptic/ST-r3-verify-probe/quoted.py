import os,re,sys
root=sys.argv[1]; toks=sys.argv[2:]
for t in toks:
    pat=re.compile(r"""['"`]"""+re.escape(t)+r"""['"`]""")
    files=[]
    for d in ('src','tests'):
        for dp,dn,fn in os.walk(os.path.join(root,d)):
            for f in fn:
                if not f.endswith(('.js','.jsx','.ts','.tsx','.mjs','.json')): continue
                p=os.path.join(dp,f)
                try: s=open(p,encoding='utf-8',errors='ignore').read()
                except: continue
                if pat.search(s): files.append(os.path.relpath(p,root))
    print(f"{t}: {len(files)} quoted files", files[:6])
