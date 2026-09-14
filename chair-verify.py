#!/usr/bin/env python3
"""chair-verify.py <dock> <base-sha> <gate-log> <expected-cars>
Independent verification of a consist before its CAS. Rebuilt 2026-09-05 after the
scratchpad cull. ⚠ Run with python3, never through a shell loop: zsh's no-split
behaviour silently mangles multi-word check names.
Every check PRINTS its evidence; a register whose file this consist did not move is
SKIPped with the sha it still cites, so an untouched register can never look verified."""
import json, subprocess, sys, os

dock, base, log, want = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
def git(*a): return subprocess.run(['git','-C',dock,*a],capture_output=True,text=True).stdout.strip()
fails=[]
def chk(ok,label,ev):
    print(('PASS ' if ok else 'FAIL ')+label+' — '+str(ev))
    if not ok: fails.append(label)

txt=open(log,encoding='utf-8',errors='replace').read()
te=[l for l in txt.split('\n') if l.startswith('TRUE_EXIT=')]
chk(bool(te) and te[-1]=='TRUE_EXIT=0','gate TRUE_EXIT is 0 (read from the LOG, never a notification)',te[-1] if te else 'ABSENT')
chk('SCOPE SENTINEL' not in txt,'no scope sentinel','clean')
chk('update REFUSED' not in txt,'no ratchet refusal','clean')

tip=git('rev-parse','HEAD')
chk(git('status','--porcelain')=='','dock porcelain 0',repr(git('status','--porcelain')))
anc=subprocess.run(['git','-C',dock,'merge-base','--is-ancestor',base,tip]).returncode==0
chk(anc,'base is an ancestor of the tip',(base,tip[:9]))
cars=int(git('rev-list','--count',base+'..'+tip) or 0)
chk(cars==want,'car count',cars)
par=[len(git('rev-list','--parents','-n','1',c).split())-1 for c in git('rev-list',base+'..'+tip).split()]
chk(all(p==1 for p in par),'every car single-parent',par)
import re as _re
_SEAT=_re.compile(r'^Seat: (Opus 5 — Fable-unvalidated|Fable 5\.1 — validated)$', _re.M)
_cars=git('rev-list',base+'..'+tip).split()
_bodies=[git('log','-1','--format=%B',c) for c in _cars]
seats=[len(_SEAT.findall(b)) for b in _bodies]
chk(all(s==1 for s in seats),'exactly one strict Seat trailer per car (Opus-unvalidated or Fable-validated)',seats)
_bad=[c[:9] for c,b in zip(_cars,_bodies) if 'Seat: Fable 5.1 — validated' in b and _re.search(r'^Lane:',b,_re.M)]
chk(not _bad,'a Fable-validated car is a CHAIR act — carries no Lane: trailer',_bad)

REGS={'tests/lint/.lighting-census-baseline.json':'measuredAtSha',
      'scripts/.test-ratchet-baseline.json':'measuredAtSha',
      'scripts/.writer-reach-baseline.json':'frozenAtSha',
      'tests/lint/.tuning-inventory.json':'measuredAtSha'}
for path,key in REGS.items():
    if not os.path.exists(os.path.join(dock,path)): continue
    moved=subprocess.run(['git','-C',dock,'diff','--quiet',base,tip,'--',path]).returncode!=0
    try: sha=str(json.load(open(os.path.join(dock,path))).get(key,''))[:9]
    except Exception: sha='(unreadable)'
    if not moved:
        print('SKIP '+path+' '+key+' — untouched by this consist; cites '+sha); continue
    inside = sha and subprocess.run(['git','-C',dock,'merge-base','--is-ancestor',sha,tip]).returncode==0 \
             and subprocess.run(['git','-C',dock,'merge-base','--is-ancestor',sha,base]).returncode!=0
    chk(bool(inside),path+' '+key+' measured INSIDE this consist',sha)

try:
    rb=json.load(open(os.path.join(dock,'scripts/.test-ratchet-baseline.json')))
    print('INFO ratchet register totalTests=%s totalFiles=%s entries=%s'%(rb.get('totalTests'),rb.get('totalFiles'),len(rb.get('entries',{}))))
    line=[l for l in txt.split('\n') if 'known failure(s) of' in l]
    if line:
        n=line[-1].split('known failure(s) of ')[1].split()[0]
        chk(str(rb.get('totalTests'))==n,'ratchet register totalTests == the gate line',(rb.get('totalTests'),n))
except Exception as e: print('INFO ratchet register unreadable: %s'%e)

print('CHAIR-VERIFY '+('GREEN' if not fails else 'RED: '+', '.join(fails)))
sys.exit(1 if fails else 0)
