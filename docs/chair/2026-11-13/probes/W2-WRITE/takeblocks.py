# takeblocks.py <final.md> <block-id>... : copy the named blocks' text from final into the lane doc
import sys,re
P='docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'
final=open(sys.argv[1]).read(); cur=open(P).read()
def span(t,bid):
    m=re.search(r'^### '+re.escape(bid)+r'\b.*$',t,re.M); assert m,bid
    n=re.search(r'^#{2,3} ',t[m.end():],re.M)
    return m.start(), m.end()+(n.start() if n else len(t)-m.end())
for bid in sys.argv[2:]:
    a,b=span(final,bid); c,d=span(cur,bid)
    cur=cur[:c]+final[a:b]+cur[d:]
open(P,'w').write(cur)
