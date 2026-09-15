#!/usr/bin/env python3
"""finish-931.py <cas-sha> <stamp HH:MM> <inflight-text> — fill the last placeholders from the gate log and chair-verify output,
append the §931 entry to the ODQ copy (pure append), and fill the handoff. Refuses on any placeholder left."""
import sys,re,os
MY='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad'
cas,stamp,inflight=sys.argv[1],sys.argv[2],sys.argv[3]
extra=dict(a.split('=',1) for a in sys.argv[4:])  # RUN4=… TOTALS=… CAPSULE=… TIP=… NFINAL=…
gate=open(MY+'/c931/gate-931.log',encoding='utf-8',errors='replace').read()
def g(pat,default='?'):
    m=re.findall(pat,gate); return m[-1] if m else default
tests=g(r'known failure\(s\) of (\d+)')
known=g(r'\((\d+) known failure\(s\) of')
quiet=g(r'QUIET CONFIRMED after (\d+)s'); gs=g(r'(GATE_START=\S+)'); ge=g(r'(GATE_END=\S+)')
tc=g(r'typecheck-ratchet\] OK — no type regressions \((\d+) error'); tcc=g(r'no type regressions \(\d+ error\(s\), ceiling (\d+)\)')
ds=g(r'domain-strict\] ✓ no strict-type regressions \((\d+) errors'); dsc=g(r'no strict-type regressions \(\d+ errors, ceiling (\d+)\)')
built=g(r'(✓ built in [0-9.]+s)'); sd='OK' if 'STRICT DIST OK' in gate else 'REFUSED'; sdd=g(r'STRICT DIST OK — (\d+ discovered/reported file\(s\), \d+ test\(s\))','')
te=g(r'TRUE_EXIT=(\d+)'); pp=g(r'GATE_PORCELAIN_POST=\[(\d+)\]')
gl=(('quiet after %s s; GATE_CARS '+extra.get('NFINAL','?')+'; %s → %s; typecheck %s/%s · domain-strict %s/%s · the ratchet `%s known failure(s) of %s` (ceiling 1) · `%s` · STRICT DIST %s (%s) · TRUE_EXIT %s · porcelain post [%s] (`<f6ac0d98>/c931/gate-931.log`; the first gate\'s log kept as `gate-931.run1.log`)') % (quiet,gs,ge,tc,tcc,ds,dsc,known,tests,built,sd,sdd,te,pp))
cv=open(MY+'/c931/chair-verify-931.out',encoding='utf-8',errors='replace').read().strip().split('\n')
cvline=cv[-1]+' — %d PASS · %d SKIP · %d FAIL (`chair-verify-931.out`)' % (sum(1 for l in cv if l.startswith('PASS')),sum(1 for l in cv if l.startswith('SKIP')),sum(1 for l in cv if l.startswith('FAIL')))
E=MY+'/c931/odq-931.entry.md'; s=open(E).read()
s=s.replace('__GATE__',gl).replace('__CHAIRVERIFY__',cvline).replace('__CAS__',cas).replace('__STAMP__',stamp)
for k,v in extra.items(): s=s.replace('__'+k+'__',v)
left=sorted(set(re.findall(r'__[A-Z0-9_]+__',s)))
if left: print('ENTRY PLACEHOLDERS LEFT',left); sys.exit(1)
open(E,'w').write(s)
L=MY+'/c931/ledger'
odq=open(L+'/OWNER_DECISION_QUEUE.md').read()
if '## §931 ' in odq: print('§931 already in the ODQ copy'); sys.exit(1)
open(L+'/OWNER_DECISION_QUEUE.md','w').write(odq.rstrip('\n')+'\n\n'+s.strip('\n')+'\n')
h=open(L+'/HANDOFF_CURRENT.md').read().replace('__GATE__',gl.split(' (`<f6ac0d98>')[0]).replace('__CAS__',cas).replace('__STAMP__',stamp).replace('__INFLIGHT__',inflight)
for k,v in extra.items(): h=h.replace('__'+k+'__',v)
left=sorted(x for x in set(re.findall(r'__[A-Z0-9_]+__',h)) if x!='__LANEROWS__')
if left: print('HANDOFF PLACEHOLDERS LEFT',left); sys.exit(1)
open(L+'/HANDOFF_CURRENT.md','w').write(h)
m=open(MY+'/c931/msg-931.txt').read().replace('__CAS__',cas); open(MY+'/c931/msg-931.txt','w').write(m)
print('finish-931: entry appended to the ODQ copy; handoff and message filled; tests',tests)
