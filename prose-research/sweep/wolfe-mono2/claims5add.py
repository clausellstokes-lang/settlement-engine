# -*- coding: utf-8 -*-
import json
d=json.load(open('claims2.json')); U=d['U']; LOC=d['LOC']; C=d['claims']
U['eht']='https://ultan.org.uk/everything-has-to-be-true-somehow/'; LOC['eht']='u/eht.txt'
RH='live page fetched with a browser user agent'
EHT="Marc Aramini, interviewed by Nigel Price, 'Everything has to be true somehow', Ultan's Library, 8 June 2020"
def c(feature,claim,quote,kind='analysis',polarity='asserts',reg='none',conf='high',source=EHT):
    C.append(dict(feature=feature,claim=claim,source=source,url=U['eht'],quote=quote,page='interview',
                  kind=kind,polarity=polarity,date='2020-06-08',routeHint=RH,registerHint=reg,confidence=conf))
c('sentence length variation',"Aramini says Wolfe abandons the baroque and long sentences after The Book of the New Sun.","he abandons the baroque and long sentences and often strives",'analysis','asserts','dossier-archivist')
c('register modulation',"Aramini says Wolfe's later work strives for a more minimalistic surface text.","strives for a more minimalistic surface text",'analysis','asserts','dossier-archivist')
c('withheld information and inference',"Aramini says the subtext tends to replace the text in Wolfe's late novels.","The subtext tends to replace the text",'analysis','asserts','dossier-archivist')
c('withheld information and inference',"Aramini's working assumption is that something is true about almost every detail included in the text.","something is true about almost every detail which is included",'analysis','asserts','dossier-archivist')
c('plainness and economy',"Aramini's starting principle is that Wolfe writes with the precision of an engineer.","Wolfe writes with the precision of an engineer",'analysis','asserts','dossier-archivist')
c('metaphor discipline',"Aramini says Wolfe creates symbols and metaphors that produce concrete plot conclusions.","creates symbols and metaphors to produce concrete plot conclusions",'analysis','asserts','dossier-archivist')
c('other: reference-guide register',"Aramini's own entries open with a summary of mostly objective details before any analysis.","I provide a summary with “mostly” objective details",'analysis','applies','dossier-archivist')
c('other: monograph form',"Aramini judges Andre-Driussi's approach sound and says Borski takes too many leaps to follow logically.","Robert Borski takes too many leaps to follow logically",'analysis','disputes','none')
c('other: monograph form',"Aramini says Wright stops at a secular reading of The Book of the New Sun.","He stops at a secular reading of The Book of the New Sun",'analysis','disputes','none')
c('sentence length variation',"Aramini found his own earlier write-ups too brief for readers to follow logically.","my earlier work was too brief for people to follow logically",'analysis','disputes','dossier-archivist')
c('stylometry',"Aramini gives the total word count of his Wolfe commentary as over 1.2 million words.","the total word count is over 1.2 million words",'measurement','asserts','none')
c('stylometry',"Aramini counts about 220 Wolfe short stories that are not excerpts from larger works.","about 220 short stories which were not excerpts from larger",'measurement','asserts','none')
json.dump({'U':U,'LOC':LOC,'claims':C},open('claims2.json','w'),ensure_ascii=False)
print(len(C))
