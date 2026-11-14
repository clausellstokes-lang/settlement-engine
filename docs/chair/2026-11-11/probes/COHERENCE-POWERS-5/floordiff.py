import sys,re
# print, per failing pin in one log, each view whose received field differs: view field expected->received
for f in sys.argv[1:]:
    t=open(f).read(); out=[]
    for blk in t.split('AssertionError')[1:]:
        arm='MOBILE' if 'MOBILE_BASELINE' in blk[:400] else 'DESKTOP' if 'DESKTOP' in blk[:400] else '?'
        view=None; exp={}
        for line in blk.split('\n'):
            m=re.match(r'^\s*[-+ ]\s*"([A-Z][A-Za-z &]+/[^"]+)": \{',line)
            if m: view=m.group(1); continue
            m=re.match(r'^\s*([-+])\s*"([A-Z][A-Za-z &]+/[^"]+)": (\d+)',line)
            if m: out.append(f'{arm} {m.group(2)} {m.group(1)}{m.group(3)}'); continue
            m=re.match(r'^\s*([-+])\s*"(prose|chrome|sub12|sub14)": (\d+)',line)
            if m and view:
                if m.group(1)=='-': exp[(view,m.group(2))]=m.group(3)
                else: out.append(f'{arm} {view} {m.group(2)} {exp.get((view,m.group(2)),"?")} -> {m.group(3)}')
            if line.startswith(' ❯') : break
    print(f.split('bis.')[-1].replace('.log',''), '|', '; '.join(dict.fromkeys(out)) or '(green)')
