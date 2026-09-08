import re,sys
lines=open('scripts/mutation-sweep.sh',encoding='utf8').read().split('\n')
targets=[1117,1172,1205,1219,1232,1246,1260,1274,1290]
srcs={}
def load(p):
    if p not in srcs: srcs[p]=open(p,encoding='utf8').read()
    return srcs[p]
for ln in targets:
    L=lines[ln-1]
    # extract the file at the end
    m=re.search(r"(src/\S+\.js|scripts/\S+\.(?:mjs|js))\s*$",L)
    f=m.group(1) if m else '?'
    # extract the perl s/// pattern
    m2=re.search(r"-e\s+(['\"])s/(.*?)/(.*?)/'?\1?\s*(?:\1)?\s*"+re.escape(f),L)
    print(f"line {ln} file={f}")
