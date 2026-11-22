import json,sys
# usage: osr-rung46-review-builder.py <review-template.json> <report.json> <out-review.json>
# REFUSES unless the report is exactly the rung's declaration: one NEW row, nothing else moved.
t=json.load(open(sys.argv[1]))
r=json.load(open(sys.argv[2]))
RUL="the chair's ruling of 22:18 UTC 2026-11-20 on the fortune lane (FORTUNE U5a-CURE item 2, route B); schema 46, the fortune merits writer's admission"
KEY=("src/domain/fortune/fortuneMerits.js","merits on breakdown")
NOTE=(f"ADMITTED TAGGED ({RUL}): `merits on breakdown` x1 in src/domain/fortune/fortuneMerits.js (baseScoreOf, "
      "`legitimacy.breakdown?.merits`), 0 -> 1, under the ONE declaration of the conditional-generator-branch class; its writer "
      "is the same file's meritedLegitimacy (`breakdown: { ...terms, merits: added }`), reached from settleMeritsOfRule at the "
      "assembly step's tail only under the fortune law (_fortuneLawVersion: 2). Every corpus birth is law 1 (CONFIGS carry no "
      "_fortuneLawVersion), so the corpus never observes the write. Once the laws are lit by default, the corpus should observe "
      "lit births (one governed migration adding lit configs) and this row is retired.")
TRANS=(f"ACCEPTED ({RUL}): the scanner transition schema-45-to-46-fortune-merits-writer-v1 modifies EXACTLY the three "
       "bookkeeping paths (the checker, carrying the one declaration; the baseline library; the migration tool), act 1 at "
       "8bf91a7e0 and its precisions at 7541f4c87; no other detector source or input moved since the register was frozen at "
       "a83749b35 (package.json, package-lock.json, the corpus builder, the scanners and the fixture unchanged); the unscanned "
       "input digest did not move; the corpus did not move (every execution and observation key equal).")
rows={p['rowId']:p for p in r['predecessorRows']}
used=0; out=[]
for d in t['decisions']:
    d=dict(d)
    if d['subject']=='scanner-transition':
        st=r['scannerTransition']
        assert st['modifiedPaths']==['scripts/check-observed-shape-readers.mjs','scripts/lib/observed-shape-baseline.mjs','scripts/migrate-observed-shape-readers.mjs'], st['modifiedPaths']
        assert st['policy']=='schema-45-to-46-fortune-merits-writer-v1', st['policy']
        assert st['current']['unscannedInputDigest']==st['predecessor']['unscannedInputDigest']
        d['decision']='accept'; d['note']=TRANS
    else:
        p=rows[d['rowId']]; key=(p['address']['file'],p['address']['identity'])
        if p['reconciliation']=='same':
            assert key!=KEY
            d['decision']='accept'; d['note']=f"SAME against the committed schema-45 register: {p['legacyCount']} read(s)."
        else:
            assert key==KEY,(key,p)
            assert (p['reconciliation'],p['predecessorCount'],p['legacyCount'])==('new',0,1),p
            used+=1; d['decision']='accept'; d['note']=NOTE
    out.append(d)
assert used==1, used
assert sum(1 for d in out if d['subject']=='scanner-transition')==1
s=r['summary']; assert s=={'predecessorDecreased':0,'predecessorGone':0,'predecessorIncreased':0,'predecessorNew':1,'predecessorSame':1552}, s
assert r['corpusCompatibility']['moved']==[], r['corpusCompatibility']['moved']
rev=dict(t); rev['decisions']=out
open(sys.argv[3],'w').write(json.dumps(rev,indent=2,ensure_ascii=False)+'\n')
print('review written:', len(out), 'decisions')
