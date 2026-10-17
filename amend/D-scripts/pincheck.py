import re,sys
def norm(t): return re.sub(r'\s+',' ',t)
def occ(h,n): return h.count(n)
tr=open(sys.argv[1]).read(); T=norm(tr)
checks={'TR-2 ⇒ TR-1;':1,'TR-3 ⇒ SP-2 landed + TR-1;':1,'TR-4 ⇒ `commodityFlowEnabled` + `demographicsEnabled` (':1,'TR-5 ⇒ SP-3 landed + TR-1 (':1,'TR-6 ⇒ TR-2 + TR-3 + TR-4 + `commonsVoiceEnabled` (':1,'TR-7 ⇒ TR-2 + TR-3 (the venture is CHOSEN on believed bands) + `commodityFlowEnabled` (':1,'TR-8 ⇒ SP-1 landed + TR-5 + TR-7 (':1,'TR-1 ⇒':0,'TRADE_ENDING_KEYS = {fortune, ruin, monopoly, collapse, severance, cornered}':1,'an HONEST PERMANENT ZERO while `routeLifecycleEnabled` is dark':1,'a flag lit out of order is an invalid config the TR-9 certification walker reds':1}
bad=0
for k,v in checks.items():
    n=occ(T,k)
    if n!=v: print('FAIL',n,k); bad=1
print('bundle composes', len(re.findall(r'bundle composes ([a-z/ ]+?) only',T)), re.search(r'bundle composes ([a-z/ ]+?) only',T).group(1))
lines=tr.split('\n'); hdr=[i for i,l in enumerate(lines) if re.match(r'^### TR-\d',l)]
for w,e in [('TR-1','severance'),('TR-2','fortune'),('TR-2','ruin'),('TR-4','collapse'),('TR-6','cornered'),('TR-6','monopoly')]:
    mine=[i for i in hdr if lines[i].startswith(f'### {w} ')]
    s=mine[0]; end=next((i for i in hdr if i>s),len(lines)); body=lines[s:end]
    b=[i for i,l in enumerate(body) if '**Endings wired:**' in l]
    st=b[0]+1
    while st<len(body) and not re.match(r'^- \*\*',body[st]): st+=1
    txt=norm(' '.join(body[b[0]:st]))
    ok = len(mine)==1 and len(b)==1 and f'`{e}`' in txt
    if not ok: print('FAIL endings',w,e); bad=1
for k in ['machine-enforced','fails the gate','fails the build','zero violations',' 0 problems','burned to zero']:
    if k in tr: print('CLAIM_RE hit',k); bad=1
print('PINS', 'RED' if bad else 'GREEN')
