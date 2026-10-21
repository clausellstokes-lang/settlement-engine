import sys,glob,re,os
D='/Users/cstokes/Desktop/settlement-engine/docs/'
files=sorted(glob.glob(D+'DESIGN_FP_*.md')+glob.glob(D+'DESIGN_W_*.md'))
n=int(os.environ.get('N','2')); w=int(os.environ.get('W','150'))
for term in sys.argv[1:]:
    print('#####',term)
    for f in files:
        b=os.path.basename(f)
        if b=='DESIGN_FP_ARCH_RN.md': continue
        s=open(f,encoding='utf8').read()
        ms=[m.start() for m in re.finditer(re.escape(term),s)]
        if not ms: continue
        print(f'  {b} ({len(ms)})')
        for st in ms[:n]:
            ln=s.count('\n',0,st)+1
            print('    L%d: %s'%(ln, s[max(0,st-w):st+w].replace('\n',' ')))
