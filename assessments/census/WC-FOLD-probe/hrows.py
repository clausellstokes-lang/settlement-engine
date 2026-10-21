import re,json
D='/Users/cstokes/Desktop/settlement-engine/docs/'
F=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read().split('\n')
h=json.load(open('hearings.json'))
# volume table index
vt={}
for v,o in h.items():
    for r in o['rows']:
        for k in r['kinds']:
            vt.setdefault(k,[]).append((v,r['line'],r['where'],r['default']))
# fold base row line + owner + class (latest non-'as above')
fold={}
for i in range(503,641):
    l=F[i]
    if not l.startswith('|'): continue
    cells=[c.strip() for c in l.strip().strip('|').split('|')]
    head=cells[0].split('[')[0]
    ks=re.findall(r'`([a-z_]+)`',head)
    for k in ks:
        d=fold.setdefault(k,{'lines':[],'owner':None,'cls':None})
        d['lines'].append(i+1)
        if d['owner'] is None or not cells[0].startswith('↳'):
            d['owner']=cells[1][:70]
        cl=cells[-1]
        if 'as above' not in cl and cl!='—': d['cls']=cl[:40]
# renames
ren={'polity_fallen':'crown_fallen','polity_claim':'crown_claim','polity_war':'crown_war','polity_arbitration':'crown_arbitration','fealty_break':'fealty_broken','menace_siege':'menace_strikes'}
old_bracket={'GR':['pact_acceptance','mediation_offer','succession_reaffirmation','tribute_demand','trade_rights_demand','negotiation'],
 'IN':['lure_sprung','plant_taken'],'ES':['spy_at_target'],'WC':['armies_meet','call_in_answer','contribution_dispatch','occupation_contest'],
 'WY':['caravan_seized'],'POP':['column_at_the_wall'],'WF':['legate_received','pilgrims_received'],'EC':['caravan_seized','factor_parlay']}
landed={'siege':'EditModeShell.jsx seal 6 `letSiegeFall`','armies_meet':'worldPulse/armyTransitKernel.js','coalition_join':'worldPulse :: warCoalitionDecision','intervention':'worldPulse/seatIntervention.js','treaty_breach':'`treatyBreach` (treatySuccession.js)','pact_renewal':'worldPulse/pactRenewal.js','chance_meeting':'worldPulse/envoyChanceMeetingReceiptPools.js','ratification':'conquestFeasibility.js:61 "the live ratification vote"','sovereignty_conveyance':'WR-10 conveyance (heraldRouting.js)','peace_offer':'the peace table (subsystemRowsWar peace rows)','war_declaration':'the chooser (strategy) — symbol not named by the fold','raid':'border incidents (subsystemRowsPeople)','supply_raid':'supplyRaid (heraldRouting.js)','blockade':'blockade (supplyWebWarfare)','ransom':'ransom (settlementPendingEditWriters.js)','envoy_intercepted':'IN-0b LANDED (`brokerageServicesRules.js`)','envoy_held':'ES foreign-guest hold (subsystemRowsWar)','embargo':"'embargo' lever (settlementStrategy.js)",'occupation_contest':'occupation records (occupationRecordMode.js)','spy_at_target':'ES landed `caught · uncaught`','succession_reaffirmation':'landed `reaffirmed · disavowed_by_succession` (heraldRouting.js)','pact_acceptance':'SP-D errand arrival (envoyErrandVocabulary.js)'}
rows=[];n=0
for line in open('kinds.txt'):
    k,o=line.split()
    n+=1
    f=fold.get(k) or fold.get(ren.get(k,''),{'lines':[],'owner':'?','cls':'?'})
    if k in ren and ren[k] in fold:
        f2=fold[ren[k]]; f={'lines':f2['lines']+(fold.get(k,{}).get('lines',[])),'owner':(fold.get(k) or f2)['owner'],'cls':(fold.get(k) or f2)['cls']}
    where='§3.4 L'+str(min(f['lines'])) if f['lines'] else '§3.4 ?'
    own=f['owner'].replace('|','/')
    vrows=[x for x in vt.get(k,[]) if x[0]==o]
    if o in ('PL','MN','CH','PT','PS','ST','PR','BD'):
        if vrows:
            v,l,w,d=vrows[0]
            ok=bool(w.strip() and w.strip()!='—') and bool(d.strip() and d.strip()!='—')
            wshort=re.sub(r'[`|]','',w)[:38]
            readers=f'{o} hearings table L{l} (WHERE ✓ · default ✓) · SP-9 docket (C0)' if ok else f'{o} L{l} WHERE/default MISSING'
            seam=wshort
            cls='OK' if ok else 'SHELL'
            note=f'default: {re.sub(r"[`|]","",d)[:60]}'
        else:
            readers=f'{o} table: ABSENT'; seam='—'; cls='INAPPROPRIATE'; note='owner table lacks the kind'
    else:
        br=k in old_bracket.get(o,[])
        ld=landed.get(k)
        readers=f'no owner table ({o}, pre-fp-final); owner bracket names it: {"yes" if br else "no"} · SP-9 docket (C0)'
        seam=('LANDED: '+ld) if ld else ('unbuilt wave' )
        cls='OK' if (br or ld) else 'SHELL'
        note='WHERE = fold WHERE table; default = '+('the landed decider' if ld else 'the building wave\'s')
    rows.append(f'| WC-FOLD-H{n} | hearing | `{k}` | {where} | {own} | {readers} | {seam} | hearingWeekEnabled | {o} | {cls} | {note} |')
open('hrows.md','w').write('\n'.join(rows)+'\n')
print(len(rows)); 
import collections; print(collections.Counter(r.split('|')[10].strip() for r in rows))
