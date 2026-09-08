import re
def exact(fn,q):
    """Return the substring of fn matching q up to quote-style/whitespace, byte-exact as fetched."""
    raw=open(fn,encoding='utf-8',errors='replace').read()
    def norm(s):
        s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
        return re.sub(r'\s+',' ',s)
    # build map from normalised index -> raw index
    idx=[]; out=[]
    i=0
    prev_ws=False
    while i<len(raw):
        c=raw[i]
        if c in '’‘': c="'"
        elif c in '“”': c='"'
        if c.isspace():
            if not prev_ws:
                out.append(' '); idx.append(i)
            prev_ws=True
        else:
            out.append(c); idx.append(i); prev_ws=False
        i+=1
    N=''.join(out); qn=norm(q).strip()
    p=N.lower().find(qn.lower())
    if p<0: return None
    start=idx[p]; end=idx[p+len(qn)-1]+1
    return raw[start:end]
