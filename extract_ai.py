import json, re, subprocess, os

BASE='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research'
critic=open(os.path.join(BASE,'sweep/critic-ai.md')).read()

lines=critic.split('\n')
# section 2 body: from the "## 2." header to the "## 3." header
i2=next(n for n,l in enumerate(lines) if l.startswith('## 2.'))
i3=next(n for n,l in enumerate(lines) if l.startswith('## 3.'))
sec2='\n'.join(lines[i2:i3])
# section 5 item A: the bullet starting "- **A. SKIPPED_TRIAGE"
i5=next(n for n,l in enumerate(lines) if l.startswith('- **A. SKIPPED_TRIAGE'))
secA=lines[i5]
assert secA.startswith('- **A.')
print('sec2 chars',len(sec2),'secA chars',len(secA))

RANGE=re.compile(r'\[(\d+)\]\s*[–—-]\s*\[(\d+)\]')
SINGLE=re.compile(r'\[(\d+)\]')

def expand(text):
    """every bracketed number, ranges [a]-[b] expanded inclusive, in order of appearance"""
    out=[]
    pos=0
    # first mark ranges
    consumed=set()
    for m in RANGE.finditer(text):
        a,b=int(m.group(1)),int(m.group(2))
        for x in range(min(a,b),max(a,b)+1): out.append(x)
        consumed.add(m.span())
    # singles not inside a range span
    rspans=[m.span() for m in RANGE.finditer(text)]
    for m in SINGLE.finditer(text):
        if any(s<=m.start() and m.end()<=e for s,e in rspans): continue
        out.append(int(m.group(1)))
    return out

all2=sorted(set(expand(sec2)))
allA=sorted(set(expand(secA)))
print('sec2 raw distinct',len(all2))
print('secA raw distinct',len(allA))
json.dump({'sec2':all2,'secA':allA},open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/auto.json','w'))
