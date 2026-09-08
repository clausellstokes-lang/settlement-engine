# -*- coding: utf-8 -*-
# build-payload-912r.py — builds payload-912r.json for apply-892.py from texts-912r.draft.md (a LEDGER-ONLY act: no CAS, no TESTS placeholders).
# Composition mirrors payload-908.json byte-for-byte in shape: odq_rows[0] = the ROW line + "\n\n\n"; card_new_block = heading line + "\n" + body + "\n";
# frq_tail = "## §912 — …" heading + "\n\n" + body + "\n". Refuses on any ⟦token⟧ or __PLACEHOLDER__.
import io,json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
raw=io.open(SC+'texts-912r.draft.md',encoding='utf-8').read()
assert '⟦' not in raw, 'unfilled token: '+str(sorted(set(re.findall('⟦[^⟧]*⟧',raw))))
assert not re.search(r'__[A-Z0-9_]+__',raw), 'placeholder left'
d=raw.split('\n')
def section(start,end):
    i=[n for n,l in enumerate(d) if l.startswith(start)]; assert len(i)==1,(start,len(i)); i=i[0]
    j=[n for n,l in enumerate(d) if n>i and l.startswith(end)]; j=j[0] if j else len(d)
    return d[i+1:j]
row=[l for l in section('## ROW','## CARD') if l.strip()]; assert len(row)==1 and row[0].startswith('§912 · **'), (len(row), row[0][:40])
ROW=row[0]+'\n\n\n'
card=[l for l in section('## CARD','## TAIL')]; h=[l for l in card if l.startswith('## ⭐⭐⭐⭐⭐ PICKUP AT §912 — **')]; assert len(h)==1
body='\n'.join(card[card.index(h[0])+1:]).strip(); CARD=h[0]+'\n'+body+'\n'
tail=section('## TAIL','## NEVER-MATCH'); th=[l for l in tail if l.startswith('## §912 — ')]; assert len(th)==1
assert re.match(r'## §912 — (.+?) \(SEAT: Fable 5\.1 — validated\)\s*$', th[0]), th[0]
TAIL=th[0]+'\n\n'+'\n'.join(tail[tail.index(th[0])+1:]).strip()+'\n'
p={'odq_marker':'\n§912 ','odq_rows':[ROW],'card_top_heading_prefix':'## ⭐⭐⭐⭐⭐ PICKUP AT §911','card_demote_from':'## ⭐⭐⭐⭐⭐ PICKUP AT §911 — ','card_demote_to':'## (superseded) PICKUP AT §911 — ',
   'card_new_block':CARD,'frq_in':SC+'frq.head.912r','frq_tail':TAIL,'frq_out':SC+'queue-912r.md'}
io.open(SC+'payload-912r.json','w',encoding='utf-8').write(json.dumps(p,ensure_ascii=False,indent=1))
print('payload-912r.json: row',len(ROW),'chars; card',len(CARD),'chars,',CARD.count('\n'),'newlines; tail',len(TAIL),'chars')
print('row head:',repr(ROW[:90])); print('card head:',repr(CARD[:100])); print('tail head:',repr(TAIL[:80]))
