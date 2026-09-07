import json,os,sys
D=os.path.dirname(os.path.abspath(__file__))
OUT="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-hobb-craft.json"
def txt(f):
    return open(os.path.join(D,f),encoding='utf-8',errors='replace').read()
CLAIMS=[]
def C(local,feature,claim,source,url,quote,page="",kind="analysis",polarity="asserts",date="",routeHint="curl browser-UA on live URL",registerHint="none",confidence="high"):
    CLAIMS.append(dict(local=local,feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,polarity=polarity,date=date,routeHint=routeHint,registerHint=registerHint,confidence=confidence))
exec(open(os.path.join(D,'claims.py'),encoding='utf-8').read())
bad=[]
for c in CLAIMS:
    q=c.pop('local_quote_check',None)
    f=c.pop('local')
    if c['quote']:
        t=txt(f)
        if c['quote'] not in t:
            bad.append((f,c['quote']))
        if len(c['quote'].split())>12:
            bad.append((f,"TOO LONG: "+c['quote']))
if bad:
    print("QUOTE PROBLEMS:")
    for b in bad: print("  ",b)
    sys.exit(1)
data={"complete":COMPLETE,"coverage":COVERAGE,"sourcesRead":SOURCES,"claims":CLAIMS}
json.dump(data,open(OUT,'w',encoding='utf-8'),indent=1,ensure_ascii=False)
print("wrote",OUT,"claims:",len(CLAIMS),"sources:",len(SOURCES))
