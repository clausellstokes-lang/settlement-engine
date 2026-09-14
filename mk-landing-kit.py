# -*- coding: utf-8 -*-
"""mk-landing-kit.py <N> <dock-name> <base-sha-full> <seal-name> <cars> [--prev-pickup 'PICKUP AT §M'] [--out DIR]
Stamps a landing kit for ledger act §N from the §897 templates: after-cas-N.sh, collect-N.sh, payload-N.template.json
(with __ROW__ / __CARD__ / __TAIL__ text placeholders for the chair, plus __CAS_SHA__ / __TESTS__ for the CAS step),
msg-N.txt (subject placeholder). Nothing is run. The chair fills the three texts, then runs after-cas-N.sh after a green gate."""
import sys, io, json, re, os, argparse
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit'
ap=argparse.ArgumentParser(); ap.add_argument('n'); ap.add_argument('dock'); ap.add_argument('base'); ap.add_argument('seal'); ap.add_argument('cars')
ap.add_argument('--prev-pickup', default=None); ap.add_argument('--out', default=SC); a=ap.parse_args()
assert re.fullmatch(r'[0-9a-f]{40}', a.base), 'base must be the FULL sha'; assert a.cars.isdigit()
n=a.n; out=a.out; os.makedirs(out, exist_ok=True)
# --- after-cas
s=io.open(SC+'/after-cas-897.sh',encoding='utf-8').read(); assert SC in s
s=s.replace('after-cas-897.sh — ONE command from a green ANCHORS gate log to the §897 ledger act.','after-cas-%s.sh — ONE command from a green gate log to the §%s ledger act (stamped by mk-landing-kit.py).'%(n,n))
s=s.replace('D=$SC/laneANCH2','D=$SC/'+a.dock).replace('BASE=df7cdd37e11bde8365c0322f0c882f61988865d5; LOG=$SC/gate-anch.log','BASE=%s; LOG=$SC/gate-%s.log'%(a.base,n))
s=s.replace("grep -q '^GATE_CARS=4$'","grep -q '^GATE_CARS=%s$'"%a.cars).replace('did not run over 4 cars','did not run over %s cars'%a.cars).replace('"$LOG" 4 >','"$LOG" %s >'%a.cars)
s=s.replace('§897 did not land','§%s did not land'%n).replace('chair-verify-897','chair-verify-'+n).replace('landing-anchors-2026-09-05',a.seal).replace('cas-897','cas-'+n).replace('payload-897','payload-'+n).replace('collect-897','collect-'+n).replace("'^§897:'","'^§%s:'"%n)
assert '897' not in s.replace('mk-landing-kit','') or n=='897', [l for l in s.split('\n') if '897' in l]
io.open(os.path.join(out,'after-cas-%s.sh'%n),'w',encoding='utf-8').write(s)
# --- collect
c=io.open(SC+'/collect-897.sh',encoding='utf-8').read()
c=c.replace(SC,'__SC__').replace('897',n).replace('__SC__',SC).replace('landing-anchors-2026-09-05',a.seal).replace('ANCHORS landing collection','landing collection')  # the session id contains digits: shield the path
assert SC in c and c.count(SC)>=1
c=re.sub(r'\(R37 = .*?\)\"', '(new R-rows: $(git show HEAD:docs/FABLE_RETROVALIDATION_QUEUE.md | grep -cE \'^### R[0-9]+ \'))"', c)
io.open(os.path.join(out,'collect-%s.sh'%n),'w',encoding='utf-8').write(c)
# --- payload
prev=a.prev_pickup or ('PICKUP AT §%d'%(int(float(n))-1) if n.isdigit() else '__PREV_PICKUP__')
p={'odq_marker':'\n§%s '%n,'odq_rows':['§%s · __ROW__ `%s` -> `__CAS_SHA__`, sealed `refs/preserve/%s`; gate green (`TRUE_EXIT=0`, __TESTS__ tests). __ROW_BODY__\n'%(n,a.base[:9],a.seal)],
   'card_top_heading_prefix':'## ⭐⭐⭐⭐⭐ '+prev,'card_demote_from':'## ⭐⭐⭐⭐⭐ '+prev+' — ','card_demote_to':'## (superseded) '+prev+' — ',
   'card_new_block':'## ⭐⭐⭐⭐⭐ PICKUP AT §%s — **__CARD__** (`%s` -> `__CAS_SHA__`).\n\n__CARD_BODY__'%(n,a.base[:9]),
   'frq_in':SC+'/frq.head.%s'%n,'frq_tail':'## §%s — __TAIL__ (SEAT: Fable 5.1 — validated)\n\n__TAIL_BODY__\n'%n,'frq_out':SC+'/queue-%s.md'%n}
io.open(os.path.join(out,'payload-%s.template.json'%n),'w',encoding='utf-8').write(json.dumps(p,ensure_ascii=False,indent=1))
# --- msg
m='§%s: __SUBJECT__\n\n__BODY__\n\nEnrols: __ENROLS__\n\nSeat: Fable 5.1 — validated\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\n'%n
io.open(os.path.join(out,'msg-%s.txt'%n),'w',encoding='utf-8').write(m)

# --- the two runners (quiet-window law; last line `exit $TRUE_EXIT`), from the ANCHORS pair
g=io.open(SC+'/run-gate-anch.sh',encoding='utf-8').read()
g=g.replace('run-gate-anch.sh — the ANCHORS consist\'s bare gate (npm run check) on laneANCH-tree,','run-gate-%s.sh — the §%s consist\'s bare gate (npm run check), stamped by mk-landing-kit.py;'%(n,n))
g=g.replace('/laneANCH2','/'+a.dock)
g=re.sub(r'BASE=[0-9a-f]{7,40}[^\n]*', 'BASE=%s   # the declared base; the guards below refuse to run unless the product tip IS this sha'%a.base, g, count=1)
g=g.replace('git rev-parse df7cdd37e','git rev-parse %s'%a.base).replace('is not the clamp tip df7cdd37e — CAS §896 first','is not the declared base %s — land the previous consist first'%a.base[:9])
g=g.replace('[ "$CARS" = "4" ]','[ "$CARS" = "%s" ]'%a.cars).replace('expected 4 cars over $BASE (3 replayed + the register car)','expected %s cars over $BASE'%a.cars)
g=re.sub(r'base 90702c3e9\. Quiet-window law', 'base %s. Quiet-window law'%a.base[:9], g)
g=g.replace('df7cdd37e', a.base[:9])  # any remaining short-form mention of the old base becomes the new base
_res=[l for l in g.split('\n') if 'laneANCH' in l or '90702c3e9' in l]
assert not _res, ('gate runner residue', _res)
io.open(os.path.join(out,'run-gate-%s.sh'%n),'w',encoding='utf-8').write(g)
r=io.open(SC+'/run-ratchet-anch.sh',encoding='utf-8').read().replace('/laneANCH2','/'+a.dock).replace('run-ratchet-anch.sh — census totals at the ANCHORS consist tip.','run-ratchet-%s.sh — census totals at the §%s consist tip (stamped).'%(n,n))
r=re.sub(r'echo "PREDICTED[^\n]*', 'echo "PREDICTED: __PREDICTION__ (derive EVERY figure before this runs — E4; totalTests is REFUSED in advance, this run is the derivation)"', r, count=1)
assert 'laneANCH' not in r and '__PREDICTION__' in r
io.open(os.path.join(out,'run-ratchet-%s.sh'%n),'w',encoding='utf-8').write(r)
print('  + run-gate-%s.sh run-ratchet-%s.sh (fill __PREDICTION__)'%(n,n))
print('kit §%s stamped in %s: after-cas-%s.sh collect-%s.sh payload-%s.template.json msg-%s.txt · dock=%s base=%s seal=%s cars=%s · fill __ROW__/__ROW_BODY__/__CARD__/__CARD_BODY__/__TAIL__/__TAIL_BODY__/__SUBJECT__/__BODY__/__ENROLS__'%(n,out,n,n,n,n,a.dock,a.base[:9],a.seal,a.cars))
