import re, sys, difflib
old = open(sys.argv[1], encoding='utf-8').read().split('\n')
new = open(sys.argv[2], encoding='utf-8').read().split('\n')
sm = difflib.SequenceMatcher(a=old, b=new, autojunk=False)
def cells(l):
    # count unescaped pipes outside nothing (code spans count too in GFM tables unless escaped)
    return len(re.findall(r'(?<!\\)\|', l))
bad = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal': continue
    if tag != 'insert': print("NON-INSERT OPCODE", tag, i1, i2, j1, j2); bad += 1; continue
    for j in range(j1, j2):
        l = new[j]
        if not l.startswith('|'): continue
        # find the table header above: nearest previous line that is a separator |---
        k = j - 1
        while k >= 0 and not re.match(r'^\|[-| ]+\|$', new[k]): k -= 1
        hdr = cells(new[k]) if k >= 0 else None
        c = cells(l)
        ok = (c == hdr)
        print(f"l.{j+1}: pipes {c} vs table {hdr} {'OK' if ok else 'MISMATCH'} :: {l[:70]}")
        if not ok: bad += 1
print("BAD", bad)
