import re,json
D='/Users/cstokes/Desktop/settlement-engine/docs/'
FL=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read().split('\n')
rows=json.load(open('s5rows.json'))
res=json.load(open('s5tok.json'))
OUT_OF_SCOPE={706,713,715,719,731,732,736,758,759}
manual={745:'PL (deference, 40 plain hits)',757:'RN·CH·ST·PR (C0.5 named); every volume\'s chain line',802:'RN·CH·PT·PS (`u:` keys)',818:'CH §18 (the nine kinds; §3.4)',832:'PL (X\'s ring) · RN',835:'MN §3.3 (four feeders) · BD',859:'ST · PR (force band)',880:'PR·PS·ST·PT·MN·CH·BD (`stretch:<a|b>`)',893:'BD·PR·PS·CH (`trail:<a|b>`)',897:'RN (OD-RN-48) · BD'}
lines=[];n=0;tsv=['token\tfold_lines\tnine_volume_counts\tother_fp_counts']
for t,r in res.items():
    tsv.append(f"{t}\t{','.join(map(str,r['lines']))}\t{' '.join(f'{k}:{v}' for k,v in r['nine'].items())}\t{' '.join(f'{k}:{v}' for k,v in r['others'].items())}")
open('s5tok.tsv','w').write('\n'.join(tsv)+'\n')
for o in rows:
    if o['line'] in OUT_OF_SCOPE: continue
    n+=1
    name=o['name'].replace('`','').replace('|','/')
    name=re.sub(r'\s+',' ',name)[:58]
    tag=re.findall(r'\(([A-Z]{2}(?:, ?[A-Z]{2})*)\)',o['name'])
    writer=tag[0].replace(' ','') if tag else ('pre-fp-final (10-16)' if not o['fp'] else 'fold (P4/r-lanes)')
    if o['vols']:
        readers='·'.join(f'{k}' for k,_ in sorted(o['vols'].items(),key=lambda x:-x[1]))
    else:
        readers=manual.get(o['line'],'—')
    extra=[u for u in o['unused'] if u not in ('Harried','Besieged','party_revealed_site','abandoned_by')]
    note=f"{o['ntok']} token(s); per-token counts in WC-FOLD-probe/s5tok.tsv"
    if o['line']==779: note+='; `Harried`/`Besieged` superseded by the ↳ r1 row (nouns), not a finding'
    if o['line'] in (842,843): note+='; `party_revealed_site` is the renamed-away word (↳ r3), not a finding'
    if o['line']==795: note+='; `abandoned_by` unused → WC-FOLD-T25'
    cls='OK'
    lines.append(f"| WC-FOLD-V{n} | token | {name} | §5 L{o['line']} | {writer} | {readers} | — | — | — | {cls} | {note} |")
open('vrows.md','w').write('\n'.join(lines)+'\n')
print(n,'vocab rows')
