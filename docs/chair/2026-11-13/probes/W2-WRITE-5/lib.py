import sys
P='docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
s=open(P).read()
def after(anchor, lines, start):
    global s
    assert s.count(anchor)==1, anchor
    s=s.replace(anchor, anchor+''.join(f"{start+i}. {t}\n" for i,t in enumerate(lines)))
def inline_after(anchor, items, start):
    """compact pools: anchor ends a ' · N. ...' run; anchor must end with newline"""
    global s
    assert s.count(anchor)==1, anchor
    add=''.join(f" · {start+i}. {t}" for i,t in enumerate(items))
    s=s.replace(anchor, anchor[:-1]+add+"\n")
def rep(old,new):
    global s
    assert s.count(old)==1, old
    s=s.replace(old,new)
def save():
    open(P,'w').write(s)
