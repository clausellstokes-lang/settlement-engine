import re
def load_pages(path):
    t=open(path,encoding='utf-8').read()
    parts=re.split(r'<<<PAGE (\d+)>>>\n?',t)
    return {int(parts[i]):parts[i+1] for i in range(1,len(parts),2)}
def unwrap51(raw):
    s=raw.replace('\t\n \xa0',' ').replace('\t\n\xa0',' ').replace('\t\n',' ')
    s=s.replace('\xa0',' ')
    s=s.replace('‐','-').replace('‑','-').replace('­','')
    s=re.sub(r'-\s*-\s*-','-',s)
    s=re.sub(r'[ ]+',' ',s)
    return s
def paras(s):
    out=[]
    for p in re.split(r'\n\s*\n', s):
        p=re.sub(r'\s+',' ',p).strip()
        if p: out.append(p)
    return out
RUNHEAD=re.compile(r'^(System\s*Reference\s*Document\s*5\.[0-9.]*\s*[0-9]*|\d{1,3})$')
def dropcruft(ps):
    keep=[]
    for p in ps:
        q=p.strip()
        if RUNHEAD.match(q): continue
        if re.fullmatch(r'System Reference Document 5\.[0-9.]+', q): continue
        keep.append(q)
    return keep

def unwrap52(raw):
    s=raw.replace('\xa0',' ')
    s=re.sub(r'(?m)^System Reference Document 5\.2\.1\s*$','',s)
    s=re.sub(r'(?m)^\s*\d{1,3}\s*$','',s)
    s=re.sub(r'(\w)-\s*\n(\w)', r'\1\2', s)   # hyphenated line-break rejoin
    s=re.sub(r'(?<![\n])\n(?![\n])',' ',s)     # join wrapped lines inside a paragraph
    s=re.sub(r'[ \t]+',' ',s)
    return s
