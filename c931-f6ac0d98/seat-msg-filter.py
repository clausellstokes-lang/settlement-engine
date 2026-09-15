import sys,re,os
msg=sys.stdin.read()
if re.search(r'^Seat: ',msg,re.M):
    sys.stdout.write(msg); sys.exit(0)
subj=msg.split('\n',1)[0]
m=re.search(r'LT(\d+)',subj) or re.search(r'LONG TAIL #(\d+)',subj)
lane='LT'+m.group(1) if m else os.environ.get('SEAT_DEFAULT_LANE','')
if not lane:
    sys.stderr.write('NO LANE FOR: '+subj+'\n'); sys.stdout.write(msg); sys.exit(0)
trailer='Seat: Opus 5 — Fable-unvalidated\nLane: '+lane+'\n'
lines=msg.rstrip('\n').split('\n')
# insert before the Co-Authored-By line if present, else append
idx=next((i for i,l in enumerate(lines) if l.startswith('Co-Authored-By:')),None)
if idx is None:
    out='\n'.join(lines)+'\n\n'+trailer
else:
    out='\n'.join(lines[:idx]).rstrip('\n')+'\n\n'+trailer+'\n'+'\n'.join(lines[idx:])+'\n'
sys.stdout.write(out)
