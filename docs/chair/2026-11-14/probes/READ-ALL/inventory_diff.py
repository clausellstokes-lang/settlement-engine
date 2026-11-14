#!/usr/bin/env python3
# READ-ALL: what a batch of cures did, by the inventories before and after (inventory.py on two census runs of the SAME seeds).
# usage: inventory_diff.py <before.json> <after.json> [<worklist.json>]
#  - every sentence whose set of towns changed: gone / fewer / more / new (counts; the widest printed);
#  - for a worklist (rows with "fold" and "town"): each row's towns before -> after, and whether it still prints in the town it was read in;
#  - THE INHERITORS: in the towns where a sentence stopped printing, the sentences that print there now and did not before
#    (these are read where they print: a re-gate reads the line that inherits its towns).
import io,json,sys,collections
B=json.load(io.open(sys.argv[1],encoding='utf-8')); A=json.load(io.open(sys.argv[2],encoding='utf-8'))
WL=json.load(io.open(sys.argv[3],encoding='utf-8')) if len(sys.argv)>3 else []
bt={f:set(v['towns']) for f,v in B.items()}; at={f:set(v['towns']) for f,v in A.items()}
gone=[f for f in bt if f not in at]; new=[f for f in at if f not in bt]
fewer=[f for f in bt if f in at and at[f]<bt[f]]; more=[f for f in bt if f in at and at[f]>bt[f]]; moved=[f for f in bt if f in at and at[f]!=bt[f] and not (at[f]<bt[f] or at[f]>bt[f])]
print('sentences: before %d after %d · gone %d · new %d · in fewer towns %d · in more towns %d · moved %d' % (len(bt),len(at),len(gone),len(new),len(fewer),len(more),len(moved)))
def top(lst,key,n=12):
    for f in sorted(lst,key=key,reverse=True)[:n]: print('   %4d -> %4d  %s' % (len(bt.get(f,())),len(at.get(f,())),f[:170]))
print(' GONE (widest):'); top(gone,lambda f:len(bt[f]))
print(' IN FEWER TOWNS (largest loss):'); top(fewer,lambda f:len(bt[f])-len(at[f]))
print(' NEW (widest):'); top(new,lambda f:len(at[f]))
print(' IN MORE TOWNS (largest gain):'); top(more,lambda f:len(at[f])-len(bt[f]))
lost=collections.defaultdict(set)   # town -> sentences that stopped printing there
for f in bt:
    for t in bt[f]-at.get(f,set()): lost[t].add(f)
gain=collections.Counter(); where=collections.defaultdict(set)
for f in at:
    for t in at[f]-bt.get(f,set()):
        if t in lost: gain[f]+=1; where[f].add(t)
print(' THE INHERITORS (print now, and did not, in a town that lost a sentence): %d sentences' % len(gain))
for f,n in gain.most_common(25): print('   +%3d towns (e.g. %s)  %s' % (n,sorted(where[f])[0],f[:170]))
if WL:
    c=collections.Counter()
    print(' THE WORKLIST ROWS:')
    for r in WL:
        f=r.get('fold'); 
        if not f: continue
        b=len(bt.get(f,())); a=len(at.get(f,())); here=r.get('town') in at.get(f,set())
        st='GONE' if a==0 else ('still in the town read' if here else 'fewer' if a<b else 'unchanged' if a==b else 'more')
        c[st]+=1
        if st!='unchanged': print('   %s %4d -> %4d  %-22s %s' % (r.get('id'),b,a,st,f[:120]))
    print('  rows:',dict(c))
