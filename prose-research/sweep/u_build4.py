import json,os
D=os.path.dirname(os.path.abspath(__file__))
p=os.path.join(D,'found-dnd-usability-school.json')
o=json.load(open(p)); S=o['sourcesRead']; C=o['claims']
DIR="direct curl, browser UA"
S.append(dict(title="Bullet Points vs Prose (Luke Gearing)",url="https://lukegearing.blot.im/bullet-points-vs-prose",kind="craft-criticism",substantive=True,date="2023-03-23",route=DIR))
S.append(dict(title="Techniques to Write Adventures (Luke Gearing)",url="https://lukegearing.blot.im/techniques-to-write-adventures",kind="craft-criticism",substantive=True,date="2021-09-14",route=DIR))
def mk(feature,claim,source,url,quote,page="",kind="analysis",polarity="asserts",date="",routeHint="direct curl (browser UA)",registerHint="dm-page",confidence="high"):
    C.append(dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,polarity=polarity,date=date,routeHint=routeHint,registerHint=registerHint,confidence=confidence))
BP="https://lukegearing.blot.im/bullet-points-vs-prose"; TQ="https://lukegearing.blot.im/techniques-to-write-adventures"
LG="Luke Gearing, 'Bullet Points vs Prose', lukegearing.blot.im, 2023"
mk("other: key format","Luke Gearing's rewrite of his own adventure consisted largely of turning its bullet points back into prose.",LG,BP,"A lot of this involves de-bullet pointing the text.","Bullet Points vs Prose, opening",kind="own-words",date="2023-03-23",polarity="rejects")
mk("other: key format","Luke Gearing says his own bullet points were already more prose-based than most, which worsens rather than eases his objection to them.",LG,BP,"I find this only exacerbates my issue with them.","Bullet Points vs Prose, opening",kind="own-words",date="2023-03-23",polarity="rejects")
mk("place and institution description","Luke Gearing's model prose keys a room in the present tense from a single dominant smell or object outward.","Luke Gearing's own demonstration passage, 'Bullet Points vs Prose', 2023",BP,"The smell of cold grease fills the air","Bullet Points vs Prose, room 4 Kitchen, prose version",kind="own-words",date="2023-03-23",registerHint="dossier-archivist")
mk("opening sentence","Luke Gearing opens a room in his prose version with a one-word sentence naming the room's character before any inventory.","Luke Gearing's own demonstration passage, 'Bullet Points vs Prose', 2023",BP,"Austere. Uncurtained windows let the gloomy light","Bullet Points vs Prose, room 10 Study, prose version",kind="own-words",date="2023-03-23",registerHint="dossier-archivist")
LT="Luke Gearing, 'Techniques to Write Adventures', lukegearing.blot.im, 2021"
mk("place and institution description","Luke Gearing's method for writing a place is to close his eyes and imagine standing in it.",LT,TQ,"I often just close my eyes and imagine being there","Techniques to Write Adventures, 'Mental Dig/Exploration'",kind="own-words",date="2021-09-14",registerHint="dossier-archivist")
mk("concrete sensory noun","Luke Gearing says that mental walk-through is for finding the touchstones that communicate a place's tone.",LT,TQ,"finding those touchstones which communicate the tone","Techniques to Write Adventures, 'Mental Dig/Exploration'",kind="own-words",date="2021-09-14",registerHint="dossier-archivist")
mk("other: composition method","Luke Gearing writes headings first as a skeleton and treats the words themselves as the meat hung on it.",LT,TQ,"Use your outline (that is, your headings) to build a skeleton","Techniques to Write Adventures, 'Outline To Fuck'",kind="own-words",date="2021-09-14")
o['sourcesRead']=S; o['claims']=C
json.dump(o,open(p,'w'),indent=1,ensure_ascii=False)
print(len(C),'claims',len(S),'sources')
