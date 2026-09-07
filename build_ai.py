import json, re, os, subprocess, datetime

BASE='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research'
CRITIC=os.path.join(BASE,'sweep/critic-ai.md')
critic=open(CRITIC).read()
lines=critic.split('\n')
i2=next(n for n,l in enumerate(lines) if l.startswith('## 2.'))
i3=next(n for n,l in enumerate(lines) if l.startswith('## 3.'))
sec2='\n'.join(lines[i2:i3])
secA=next(l for l in lines if l.startswith('- **A. SKIPPED_TRIAGE'))

RANGE=re.compile(r'\[(\d+)\]\s*[–—-]\s*\[(\d+)\]')
SINGLE=re.compile(r'\[(\d+)\]')
def expand(text):
    out=[]
    rspans=[m.span() for m in RANGE.finditer(text)]
    for m in RANGE.finditer(text):
        a,b=int(m.group(1)),int(m.group(2))
        out+=list(range(min(a,b),max(a,b)+1))
    for m in SINGLE.finditer(text):
        if any(s<=m.start() and m.end()<=e for s,e in rspans): continue
        out.append(int(m.group(1)))
    return out

# ---- groups: (feature, index-bearing critic substring, why) -----------------
# Every substring below is copied verbatim out of the critic; expand() reads the
# brackets out of it, so no index is typed by hand.
G=[]
def g(feature, span, why):
    assert span in critic, span[:60]
    G.append((feature, span, why, expand(span)))

# ---------- section 2 (feature 37) ----------
S2='sec2 study fetched then triaged out, still uncited: '
g('37','Herbold et al. 2023 ([1294]–[1298]',
  S2+"Herbold et al. 2023 — the teacher ratings, the words-per-sentence and sentences-per-essay figures, the 'In conclusion' opening")
g('37','HC3 ([1299], [1300], [1302]',
  S2+"HC3, the human-ChatGPT comparison corpus; the critic marks only [1301] verified")
g('37','Jentzsch and Kersting ([1303]',
  S2+"Jentzsch and Kersting on joke diversity — 90 per cent of 1,008 jokes were 25 jokes")
g('37','Naous et al. ([1304])',S2+"Naous et al., the cultural-bias study feature 37's table lists uncited")
g('37','Mohammadi ([1305], [1306])',S2+"Mohammadi, a named round-2 study whose rows carry feature 37's table")
g('37','Yakura et al. ([1307], [1308])',
  S2+"Yakura et al., the primary behind the relay [916] the section still counts as support")
g('37','Chambers and Kelley ([1340]–[1343])',
  S2+"Chambers and Kelley — fetched, four rows triaged; §5.L says one verification closes it")
g('37','the German "Anzeichen für KI-generierte Inhalte" page ([1328]–[1332]',
  S2+"the German 'Anzeichen für KI-generierte Inhalte' catalogue — the third catalogue, zero verified rows")
g('37','the live G15 policy text ([1280]–[1283])',
  S2+"the live G15 policy text; §5.C: the record-register enforcement rule has no verified row while feature 21 cites a draft")
g('37','its RfC closes ([1317]–[1320])',
  S2+"the G15 RfC closes, the community record behind the live policy text")
g('37','the Observatoire report ([1322]–[1325], [1327])',
  S2+"the Observatoire report, a named round-2 source fetched then skipped")
g('37','Triedman and Mantzarlis ([1314], [1315])',
  S2+"Triedman and Mantzarlis, a named round-2 study fetched then skipped")
g('37','Kobak at the PDF ([1351]–[1353])',
  S2+"Kobak read at the PDF — the primary for the excess-word vocabulary finding")
g('37','Reinhart at the PDF ([1345]–[1350])',
  S2+"Reinhart read at the PDF — the register/corpus primary")
g('37',"Huang's Table 1 ([1309]–[1312])",
  S2+"Huang's Table 1, a measurement table feature 37 quotes figures from")
g('37','Brooks re-verified ([1354], [1355])',
  S2+"Brooks re-verified at the source")
g('37','the Russell, Karpinska and Iyyer primary ([1356]–[1359])',
  S2+"the Russell, Karpinska and Iyyer primary, behind a relay the section counts")
g('37',"Wiki Education's other rows ([1336], [1339])",
  S2+"Wiki Education's other rows; §3/§5.I flag the 178-of-3,078 scope the section should carry")

# ---------- section 5.A ----------
A='sec5.A SKIPPED_TRIAGE on a row a rule depends on: '
g('31,32','Nguyen et al. min-p ([1061]–[1066]',
  A+"Nguyen et al. min-p, the ICLR 2025 peer-reviewed counter to 'temperature adds nothing'; zero verified")
g('31,32','Schaeffer et al. "Min-p, Max Exaggeration" ([1080]–[1086]',
  A+"Schaeffer et al. 'Min-p, Max Exaggeration', the rebuttal; zero verified, so neither side of the dispute is held")
g('31,32','Antislop ([1087]–[1093])',A+"Antislop, a sampler the features 31/32 rules rest on")
g('31,32','the antislop README ([1095], [1096])',A+"the antislop README, the tool's own text")
g('31,32','Slop Score ([1097], [1098])',A+"Slop Score, a named slop measurement")
g('31,32',"Zhang's Verbalized Sampling ([1124]–[1127])",A+"Zhang's Verbalized Sampling, a diversity method the rule cites")
g('31,32','Hewitt ([1106], [1107], [1109])',A+"Hewitt, a truncation-sampling primary")
g('31,32','Shi et al. ([1118]–[1120])',A+"Shi et al., a decoding-diversity primary")
g('31,32','DivEye ([1128]–[1131])',A+"DivEye, a diversity measurement")
g('31,32','Wiher ([1101]–[1104])',A+"Wiher, the decoding-strategy comparison")
g('31,32','typical sampling ([1056]–[1059])',A+"typical sampling, one of the decoding methods the rule ranks")
g('31,32','Mirostat ([1069]–[1072]',
  A+"Mirostat, including the model-era drift row the section itself names 'not citable'")
g('31,32','Su ([1075]–[1079])',A+"Su, a contrastive-decoding primary")
g('31,32',"Holtzman's Table 1 figures ([1044]–[1053]",
  A+"Holtzman's Table 1 figures, the nucleus-sampling measurement the rule quotes; the three verified rows excluded")
g('38',"r/worldbuilding's rule [1361]",A+"r/worldbuilding's rule, a community policy text feature 38 depends on")
g('38','Obsidian Portal [1390]',A+"Obsidian Portal, a community AI-policy text")
g('38','Tabletop Sentinel [1391]',A+"Tabletop Sentinel, a community AI-policy text")
g('38','EN World [1392]',A+"EN World, a community reception source")
g('38','the itch.io jam policy [1393]',A+"the itch.io jam policy, a policy text")
g('38','Furze [1387]',A+"Furze, a named reception source")
g('38','Shea [1385]',A+"Shea, a named practitioner source")
g('38','the Three Witches review [1395], [1396], [1398]',A+"the Three Witches review, a reception primary")
g('38','Peltast [1377], [1380], [1381]',A+"Peltast, a named critique source")
g('38','Appelcline [1363]',A+"Appelcline, a named history source")
g('38','Codega [1365], [1369]',A+"Codega, a named reporting source")
g('35',"LPfi's draft [1152]–[1155]",A+"LPfi's draft, a policy text feature 35 rests on")
g('35',"WhatamIdoing's false positive [1149], [1150]",A+"WhatamIdoing's false positive, the counter-evidence row")
g('35','Which? [1167], [1170]–[1173]',A+"Which?, a named measurement/reporting source")
g('35',"Rettberg's mechanism and retraction [1185], [1186]",
  A+"Rettberg's mechanism and the retraction — §5.B: the withdrawn NYT example, triaged and unmentioned in the section")
g('35','Koehlert and Governing [1189], [1190]',A+"Koehlert and Governing, reporting the rule relies on")
g('35','Ghani [1194]',A+"Ghani, a named source")
g('35','the survey [1195], [1196]',A+"the survey behind the rule's figure")
g('35','the September 2025 deletion vote [1197], [1199], [1200]',A+"the September 2025 deletion vote, a record the rule cites")
g('35','Zhao [1204], [1205], [1208]',A+"Zhao, a primary the rule leans on")
g('35','Gao [1209], [1210]',A+"Gao, a primary the rule leans on")
g('36','HiST-LLM [1214], [1216], [1218]',A+"HiST-LLM, the historical-accuracy benchmark feature 36 depends on")
g('36','the reporting [1219]–[1225]',A+"the reporting on HiST-LLM")
g('36','ASIC [1228]–[1231], [1234], [1235], [1239], [1240]',A+"ASIC, the regulator's summarisation trial")
g('36','BBC [1244], [1245], [1248], [1249]',A+"the BBC study of assistant answers")
g('36','SimpleQA [1260], [1261]',A+"SimpleQA, a factuality benchmark the rule quotes")
g('36',"Dahl's temporal gradient [1252]–[1257]",A+"Dahl's temporal gradient, the measurement behind the rule's age limb")
g('36','the Lexis vendor claim [1264], [1265]',A+"the Lexis vendor claim the rule weighs")
g('36','Tow [1270], [1271], [1273]',A+"the Tow Center measurement")
g('36','ProHist [1274], [1277]–[1279]',A+"ProHist, a historical-prompting primary")
g('34,15','Sato\'s "indelible mark" and "untimely demise" ([941], [943]–[945], [949], [951]',
  A+"Sato's 'indelible mark' and 'untimely demise'; [944] is the obituary's own word list, needed by feature 15's biographical lexicon")
g('34,15','McGreevy [1001]–[1003]',A+"McGreevy, a named source feature 34 rests on")
g('34,15','Treadway [999]',A+"Treadway, a named source")
g('34,15','Raicu [1005]',A+"Raicu, a named source")
g('34,15','Ward [963]',A+"Ward, a named source")
g('34,15','Cole on steerability [964]',A+"Cole on steerability, the counter-limb the rule needs")
g('34,15','Crow [978]',A+"Crow, a named source")
g('34,15',"Dyer's counter-evidence [980], [981]",A+"Dyer's counter-evidence, a row that is the only support for its limb")
g('34,15','Seife [1037], [1038]',A+"Seife, a named source")
g('34,15','Min [1032]',A+"Min, a named source")
g('34,15','the guide [982], [983], [990]',A+"the guide rows behind the feature's practice claim")
g('r5','the ten r5 skips ([571], [591], [661], [670], [817], [832], [842], [881], [890], [891])',
  A+"one of the ten r5 skips; the critic names no source for these, only that a rule depends on them")

# ---- rule 2 exclusions: indices the critic itself calls verified -------------
state=json.load(open(os.path.join(BASE,'sweep/state-ai.json')))
V=state['verdicts']
def verdict(i):
    e=V.get(str(i))
    return e.get('verdict') if e else None

explicit_verified={1301}                       # "only [1301] verified"
holtz=[x for x in expand("Holtzman's Table 1 figures ([1044]–[1053]")]
holtz_verified={i for i in holtz if (verdict(i) or '').startswith('VERIFIED_')}   # "except the three verified"
print('Holtzman 1044-1053 verdicts:', {i: verdict(i) for i in holtz})
print('excluded as verified (Holtzman):', sorted(holtz_verified))
excluded_verified = explicit_verified | holtz_verified

# ---- assemble candidates ----------------------------------------------------
cand={}   # index -> (feature, why)  first attribution wins; collisions reported
collisions=[]
order=[]
for feature,span,why,idxs in G:
    for i in idxs:
        if i in excluded_verified: continue
        if i in cand:
            if cand[i]!=(feature,why): collisions.append((i,cand[i],(feature,why)))
            continue
        cand[i]=(feature,why); order.append(i)
print('collisions:',collisions)

manual=set(cand)|excluded_verified
auto=set(json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/auto.json'))['sec2'])|set(json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/auto.json'))['secA'])
print('AUTO-vs-MANUAL  missing from manual:',sorted(auto-manual),' extra in manual:',sorted(manual-auto))
print('raw candidate count (after removing critic-verified):',len(cand))
print('raw bracket count incl. critic-verified:',len(manual))

# ---- state check ------------------------------------------------------------
rows=[]; notSkipped=[]
for i in sorted(cand):
    f,w=cand[i]
    vd=verdict(i)
    if vd=='SKIPPED_TRIAGE':
        assert len(w)<=200, (i,len(w))
        rows.append({'index':i,'feature':f,'why':w})
    else:
        notSkipped.append({'index':i,'verdict':vd if vd else 'NO_VERDICT'})
from collections import Counter
print('included:',len(rows),'notSkipped:',len(notSkipped))
print('notSkipped verdict tally:',Counter(x['verdict'] for x in notSkipped))
print('feature tally:',Counter(r['feature'] for r in rows))
print('max why len:',max(len(r['why']) for r in rows))

now=subprocess.run(['date'],capture_output=True,text=True).stdout.strip()
mt=subprocess.run(['stat','-f','%Sm','-t','%Y-%m-%dT%H:%M:%S%z',CRITIC],capture_output=True,text=True).stdout.strip()
out={
 'name':'ai',
 'writtenAt':now,
 'critic':f'{CRITIC} (mtime {mt})',
 'rows':rows,
 'count':len(rows),
 'notes':("Reader 1, independent. Candidates were expanded by script from exactly two spans of critic-ai.md: "
          "section 2 in full and the section 5 item A bullet; ranges [a]-[b] expanded inclusive, comma lists taken as singles. "
          f"Rule-2 exclusions (critic says verified): [1301] and the three verified of Holtzman's [1044]-[1053] = {sorted(holtz_verified)}. "
          f"Raw candidates after those exclusions: {len(cand)} ({len(manual)} distinct brackets before them); "
          f"of those {len(rows)} are SKIPPED_TRIAGE in state-ai.json and {len(notSkipped)} are not, listed in notSkipped. "
          "Feature attribution is the critic's own grouping; why is per-source within the group.")
}
p=os.path.join(BASE,'sweep/untriage-ai.reader1.json')
json.dump(out,open(p,'w'),indent=1,ensure_ascii=False)
print('WROTE',p)
json.dump({'indices':sorted(r['index'] for r in rows),'notSkipped':notSkipped,'count':len(rows),'notes':out['notes'],'file':p},
          open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/structured.json','w'),indent=1)
