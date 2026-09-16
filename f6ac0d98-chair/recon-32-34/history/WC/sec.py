import sys
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad/ledger-a803dee7a/docs/OWNER_DECISION_QUEUE.md'
L=open(p).read().splitlines()
starts=[i for i,l in enumerate(L) if l.startswith('## §')]
want=sys.argv[1:]
for w in want:
    n=int(w)-1
    # find index of this start
    try:
        k=starts.index(n)
    except ValueError:
        # nearest
        k=max(i for i,s in enumerate(starts) if s<=n)
    end=starts[k+1] if k+1<len(starts) else len(L)
    for i in range(starts[k],end):
        print(f"{i+1}:{L[i]}")
    print("="*80)
