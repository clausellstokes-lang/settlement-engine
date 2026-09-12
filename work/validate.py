import re, json
VAR=re.compile(r'^(\d+)\.\s+`\[')
FACE=re.compile(r'^\s+-\s+`\[face\]`')
res=json.load(open('work/ext.json'))
BAD=re.compile(r'[—–!0-9]')
problems={}
for d,v in sorted(res.items()):
    arows=v['annex']; rrows=v['cands'][0][1]
    probs=[]
    if len(arows)!=len(rrows): probs.append(f'row count {len(arows)} -> {len(rrows)}')
    # group
    def group(rows):
        g=[]
        for r in rows:
            if VAR.match(r): g.append([r,[]])
            else: g[-1][1].append(r)
        return g
    ga,gr=group(arows),group(rrows)
    if len(ga)!=len(gr): probs.append('variant count differs')
    else:
        for i,(a,r) in enumerate(zip(ga,gr)):
            ta=re.findall(r'`\[([a-z]+)\]`', a[0]); tr=re.findall(r'`\[([a-z]+)\]`', r[0])
            if ta!=tr: probs.append(f'v{i+1} tag {ta} -> {tr}')
            if len(tr)!=1: probs.append(f'v{i+1} tag count {len(tr)}')
            if len(a[1])!=len(r[1]): probs.append(f'v{i+1} faces {len(a[1])} -> {len(r[1])}')
            for f in r[1]:
                tf=re.findall(r'`\[([a-z]+)\]`', f)
                if tf!=['face']: probs.append(f'v{i+1} face tag {tf}')
    for r in rrows:
        body=re.sub(r'^\d+\.\s+`\[[a-z]+\]`\s*','',r); body=re.sub(r'^\s+-\s+`\[face\]`\s*','',body)
        m=BAD.search(body)
        if m: probs.append(f'wall char {m.group(0)!r} in: {body[:60]}')
        if '  ' in body.strip(): probs.append(f'double space: {body[:60]}')
    if probs: problems[d]=probs
    print(f"{d}\t{'OK' if not probs else 'PROBLEMS'}")
    for p in probs: print('   ', p)
