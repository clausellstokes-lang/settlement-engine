# -*- coding: utf-8 -*-
import json,re
U={
 'gri':'https://www.fantasy-animation.org/current-posts/review-matthew-oliver-magic-words-magic-worlds-form-and-style-in-epic-fantasy-2022',
 'bor':'https://api.openalex.org/works/doi:10.3828/extr.2019.2',
 'ridd':'https://www.youtube.com/watch?v=EYT3NeS_mVQ',
 'jd':'https://www.youtube.com/watch?v=H02ZPoR3tlI',
 'bb':'https://www.youtube.com/watch?v=-9T-BlR5io0',
 'anr':'https://www.youtube.com/watch?v=jfhl1jnaAPY',
 'ali':'https://www.youtube.com/watch?v=fIw6lHNEwcc',
}
FILE={'gri':'dr/fanani.txt','bor':None,
 'ridd':'dr/yt-EYT3NeS_mVQ.txt','jd':'dr/yt-H02ZPoR3tlI.txt','bb':'dr/yt--9T-BlR5io0.txt',
 'anr':'dr/yt-jfhl1jnaAPY.txt','ali':'dr/yt-fIw6lHNEwcc.txt'}
SRC={
 'gri':"Marinette Grimbeek, review of Matthew Oliver's Magic Words, Magic Worlds, Fantasy/Animation, 2 December 2022",
 'bor':"Sylwia Borowska-Szerszun, Extrapolation 60.1 (2019), abstract as held by OpenAlex",
 'ridd':"riddbook (video essayist), 'Robin Hobb is a literary genius. Here's why.', YouTube",
 'jd':"JD (video essayist), 'Robin Hobb: Writing Lessons', YouTube",
 'bb':"Robin Hobb interviewed by blinkbox Books, 'Robin Hobb explains how writing is like chasing butterflies', YouTube",
 'anr':"A Novel Review - Book Podcast, 'Assassin's Apprentice by Robin Hobb | Fitz and the cost of identity, duty and honour', YouTube",
 'ali':"Allison Annotated, 'Robin Hobb Doesn't Write \"Morally Grey\" Characters (And Other Farseer Musings)', YouTube",
}
DATE={'gri':'2022-12-02','bor':'2019-04-01','ridd':'','jd':'','bb':'','anr':'','ali':''}
YTR=("auto-generated YouTube caption track pulled with youtube-transcript-api; the transcript is "
     "lower-cased, unpunctuated and carries ASR mishearings (Jane Eyre as 'Janeire', Hobb's as 'hubs', "
     "Farseer as 'Far Seers'). Quotes are verbatim from that caption text, not from the spoken audio.")
RH={
 'gri':'live page, browser user agent; the review is the only open-access chapter-by-chapter account of Oliver 2022 that could be reached (the Fafnir review is behind an Anubis bot challenge and the McFarland page carries only marketing copy)',
 'bor':'article is closed access (Unpaywall and OpenAlex both report oa_status "closed", no repository copy). Abstract reached through the OpenAlex work record: it is stored as abstract_inverted_index and must be reconstructed by ordering the word positions before the quote will match.',
 'ridd':YTR,'jd':YTR,'bb':YTR,'anr':YTR,'ali':YTR,
}
KIND={'gri':'analysis','bor':'analysis','ridd':'reader','jd':'reader','bb':'own-words','anr':'reader','ali':'reader'}
C=[]
def c(k,feature,claim,quote,page,polarity,registerHint='none',confidence='high',kind=None):
    C.append(dict(feature=feature,claim=claim,source=SRC[k],url=U[k],quote=quote,page=page,
        kind=kind or KIND[k],polarity=polarity,date=DATE[k],routeHint=RH[k],
        registerHint=registerHint,confidence=confidence))

# ---- Grimbeek on Oliver 2022 (the brief's "Oliver epigraph chapter" route) ----
c('gri','civic record register',
 "Grimbeek reports that Oliver's chapter on paratexts treats maps, epigraphs, glossaries and appendices as calling attention to the constructedness of the fantasy world rather than mediating access to it.",
 "call attention to the constructedness of the fantasy world itself","review of Section IV, Chapter 7","asserts",'dossier-archivist')
c('gri','point of view and distance',
 "Grimbeek quotes Oliver arguing that epic fantasy undermines epic essentialism by presenting epic subject matter subjectively through the first person.",
 "epic subject matter in a subjective fashion through the first-person","review of Chapter 4, quoting Oliver p. 145","asserts",'none')
c('gri','plainness and economy',
 "Grimbeek reports that Oliver contrasts the stylistically excessive language of Erikson, Donaldson and Martin with what he calls the sparse, editorial style of Kuang and Le Guin.",
 "the sparse, editorial style of R. F. Kuang","review of Section I, Chapters 1-2","asserts",'none')
c('gri','concrete sensory noun',
 "Grimbeek reports that Oliver's counterexamples chapter sheds light on the mundane foundations needed for the creation of a sense of wonder.",
 "the mundane foundations needed for the creation of a sense","review of Chapter 6","asserts",'dossier-archivist')
c('gri','other: coverage - Hobb absent from the epic-fantasy style monograph',
 "Grimbeek's chapter-by-chapter review of Oliver's Magic Words, Magic Worlds names Erikson, Donaldson, Martin, Kuang, Le Guin, Bakker, Cook, Jemisin, Sanderson, Moorcock, Gemmell, Leiber and Jordan as its examples and never names Robin Hobb.",
 "","whole review","mentions",'none','medium')

# ---- Borowska-Szerszun 2019 (abstract only) ----
c('bor','consequence on a household',
 "Borowska-Szerszun argues that Hobb's Liveship Traders reframes the traditional rape script by shifting emphasis to the survivor.",
 "shifting emphasis to the survivor and actually redefining what rape","abstract","asserts",'none','medium')
c('bor','point of view and distance',
 "Borowska-Szerszun finds that Martin's narrative adheres to a rape script focused on brutal violence and the perpetrator's perspective, against which she sets Hobb.",
 "that focuses on brutal violence and the perspective of the","abstract","asserts",'none','medium')

# ---- riddbook video essay ----
c('ridd','civic record register',
 "The video essayist notes that Assassin's Apprentice opens not on a scene but on an epigraph, and quotes it as a proposition about what a history of the realm must be.",
 "A history of the Six Duchies is of necessity a","opening comparison of first chapters","asserts",'dossier-archivist')
c('ridd','opening sentence',
 "The essayist reads Hobb's choice to open the book with an attempt at a history rather than with the narrator's abandonment as itself characterising the narrator.",
 "begin the book with an attempt at a history","opening comparison of first chapters","asserts",'dossier-archivist')
c('ridd','point of view and distance',
 "The essayist attributes the immediate intimacy between character and reader in both Jane Eyre and Assassin's Apprentice to the first-person telling.",
 "the first person, creating immediate intimacy between character and reader","opening comparison of first chapters","asserts",'none')
c('ridd','point of view and distance',
 "The essayist calls Hobb's introduction of a second first-person narrator in the final trilogy her crowning achievement, and says the new voice reads as immediately distinct.",
 "a second first person narrator in the final trilogy","spoiler section","asserts",'none')
c('ridd','other: register compared to literary domestic fiction',
 "The essayist claims Hobb bridges epic fantasy world-building with the sentence-level work and narrative scope of literary craft.",
 "beautiful sentence level work and narrative scope of literary craft","introduction","asserts",'none')

# ---- JD, Writing Lessons ----
c('jd','other: pacing and slow consequence',
 "The video essayist argues that the beginnings of Hobb's books are not material to be got through on the way to an inciting incident but part of the story.",
 "aren't something we need to get through to reach the","lesson five","asserts",'none')
c('jd','withheld information and inference',
 "The essayist identifies Hobb's method as using the narrator's bias as a device, letting the reader infer the narrator's feelings from the gap between his self-account and how others react to him.",
 "use your narrator's bias to your advantage","lesson four","asserts",'chronicle-line')
c('jd','naming and forms of address',
 "The essayist notes that Farseer royalty carry names such as Regal, Verity and Chivalry, and that those names work as a self-fulfilling prophecy for the character.",
 "their names are a self-fulfilling prophecy for their character","lesson three","asserts",'dossier-archivist')
c('jd','naming and forms of address',
 "The essayist notes that the protagonist is known only as boy for the first years of his life, against a naming convention that assigns royal virtues.",
 "who is only known as boy in the first few","lesson three","asserts",'dossier-archivist')
c('jd','concrete sensory noun',
 "The essayist says Hobb goes so deeply into a character's trade that the reader is convinced she has herself been a candle maker, wood carver, shepherd or stable master.",
 "a Candle Maker wood carver Shepherd or even a stable","lesson two","asserts",'dossier-archivist')
c('jd','concrete sensory noun',
 "The essayist reports having read that Hobb starts her research from children's picture books about a trade because those books cover the basics.",
 "children picture books about things like working as a blacksmith","lesson two","asserts",'dossier-archivist','medium')
c('jd','per-speaker register',
 "The essayist argues that a character's class has a direct impact on the kind of language that character uses.",
 "an impact on the kind of language that they use","lesson one","asserts",'none')
c('jd','point of view and distance',
 "The essayist contrasts what two Hobb viewpoints notice on entering a room, the trained assassin reading the people and the spoiled adolescent attending to what everyone is wearing.",
 "focus instead on what everyone is wearing","lesson one","applies",'dossier-archivist')

# ---- Hobb's own words, blinkbox ----
c('bb','concrete sensory noun',
 "Hobb names her own recurring first-draft failure as writing that a character walked into a room without having bothered to slow down and describe it.",
 "i haven't bothered to slow down and describe it","interview answer on revision","asserts",'dossier-archivist')
c('bb','other: composition method',
 "Hobb says she enjoys rewriting more than first drafts, and describes the rewrite partly as removing the paragraphs that did not work.",
 "it's taking off the paragraphs that didn't work","interview answer on revision","asserts",'none')

# ---- counter-evidence from readers ----
c('anr','withheld information and inference',
 "A reviewer disputes the unreliable-narrator reading of Fitz, saying he is not unreliable in the traditional sense of trying to mislead the reader.",
 "I don't think he's an unreliable narrator in the traditional","podcast discussion of narration","disputes",'chronicle-line')
c('anr','other: pacing and slow consequence',
 "The reviewer concedes the novel is quite a slow book to get started, in the course of asking whether it would be published today.",
 "It is, you know, quite a slow book to get","podcast discussion of the market","asserts",'none')
c('ali','point of view and distance',
 "A reader reports that little happens in the Farseer books and puts the share of the conflict that is internal at eighty per cent.",
 "80% of the conflict is internal","closing remarks","asserts",'none')
c('ali','other: moral legibility',
 "A reader disputes the common description of Hobb's characters as morally grey, saying she knows exactly who the good guys and the bad guys are.",
 "I know exactly who the good guys and the bad","opening argument","disputes",'none')

def norm(s): return re.sub(r'\s+',' ',s)
texts={}
for k,v in FILE.items():
    if v: texts[k]=norm(open(v,encoding='utf-8',errors='replace').read())
texts['bor']=("Noting that the motif of rape frequently appears in fantasy literature, this essay investigates its use "
 "in A Song of Ice and Fire by George R. R. Martin and The Liveship Traders by Robin Hobb. Reading these narratives "
 "within the context of the feminist writing on the representation of rape, a comparative analysis is carried out to "
 "determine whether they conform or subvert the “traditional” rape script. While Martin’s narrative, despite featuring "
 "strong female characters, adheres to the “traditional” rape script that focuses on brutal violence and the perspective "
 "of the perpetrator, Hobb’s novels seem to reframe this pattern by shifting emphasis to the survivor and actually "
 "redefining what rape is.")
inv={v:k for k,v in U.items()}
bad=0
for cl in C:
    k=inv[cl['url']]; q=cl['quote']
    if not q: continue
    t=texts[k]
    if q in t: continue
    if q.replace("'","’") in t: cl['quote']=q.replace("'","’"); continue
    print("BLANKED:",k,repr(q)); cl['quote']=''; bad+=1
print("claims2:",len(C),"blanked:",bad)
json.dump(C,open('.dr-claims-2.json','w'),ensure_ascii=False,indent=1)
