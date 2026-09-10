import json
from importlib.machinery import SourceFileLoader
m=SourceFileLoader('b','lgc-build.py').load_module()
U={
 'chabon-wb':'https://www.theparisreview.org/blog/2019/11/20/leguins-subversive-imagination/',
 'commonreader':'https://commonreader.wustl.edu/c/the-re-possessed/',
 'granta-wb':'https://granta.com/her-left-hand-the-darkness/',
 'fivebooks':'https://fivebooks.com/best-books/best-ursula-le-guin-books-sherryl-vint/',
 'reread':'https://reactormag.com/introducing-the-ursula-k-le-guin-reread/',
 'set11':'https://efanzines.com/SFC/SteamEngineTime/SET11.pdf',
}
C=[]
def add(f,feature,claim,source,quote,page,kind,polarity,date,route,reg,conf=None):
    d=dict(feature=feature,claim=claim,source=source,url=U[f],quote=quote,page=page,kind=kind,
           polarity=polarity,date=date,routeHint=route,registerHint=reg)
    if conf: d['confidence']=conf
    d['_file']=f; C.append(d)
R='curl with browser user agent (live URL)'
WB='live URL 403; read at the Wayback raw capture https://web.archive.org/web/<ts>id_/<url>'
PDF='curl the PDF binary, then decompress its streams and pull the text-show operators'

add('chabon-wb','place and institution description',
 'Michael Chabon lists the ingredients of the Earthsea world as its flora, its weather, and the dialects and ceremonies of its inhabitants.',
 'Michael Chabon, "Le Guin’s Subversive Imagination", The Paris Review Daily, 20 November 2019',
 'from its flora to its weather to the dialects and ceremonies','middle of the essay','analysis','asserts','2019-11-20',WB,'dossier-archivist')
add('chabon-wb','place and institution description',
 'Chabon says Le Guin conjured an entire planet into vivid existence with nothing but lines on paper.',
 'Michael Chabon, The Paris Review Daily, 20 November 2019',
 'conjured an entire planet into vivid existence','middle of the essay','analysis','asserts','2019-11-20',WB,'dossier-archivist')

add('commonreader','place and institution description',
 'Jason P. Vest says Le Guin weaves each place’s contradictions, tensions, mores and rites into detailed portraits.',
 'Jason P. Vest, "The Re-Possessed", The Common Reader (Washington University), 30 May 2021',
 'each place’s contradictions, tensions, mores, and rites into satisfyingly detailed','early section on the Hainish novels','analysis','asserts','2021-05-30',R,'dossier-archivist')
add('commonreader','place and institution description',
 'Vest says Le Guin’s invented worlds convince readers they are real places rife with complex histories, cultures and characters.',
 'Jason P. Vest, The Common Reader, 30 May 2021',
 'real places rife with complex histories, cultures, and characters','early section on the Hainish novels','analysis','asserts','2021-05-30',R,'dossier-archivist')
add('commonreader','sentence length variation',
 'Vest identifies the most famous sentence of The Left Hand of Darkness as the four-word line The king was pregnant.',
 'Jason P. Vest, The Common Reader, 30 May 2021, quoting Le Guin',
 'The king was pregnant','section on The Left Hand of Darkness','analysis','asserts','2021-05-30',R,'chronicle-line')

add('granta-wb','plainness and economy',
 'Alison Smith calls Le Guin’s prose in Very Far Away From Anywhere Else spare and clarifying.',
 'Alison Smith, "Her Left Hand, The Darkness", Granta, 3 January 2019',
 'too taboo for her spare, clarifying prose','memoir, middle section','reception','asserts','2019-01-03',WB,'none')
add('granta-wb','plainness and economy',
 'Smith describes Le Guin’s genius as an amalgam of vivid prose, straight talk and revolutionary engagement.',
 'Alison Smith, Granta, 3 January 2019',
 'vivid prose, straight talk and revolutionary engagement','memoir, later section','reception','asserts','2019-01-03',WB,'none')

add('fivebooks','other: language encodes ideology',
 'Sherryl Vint says Le Guin is sensitive to the notion that ideologies and values are embedded in the language and metaphors we use.',
 'Sherryl Vint, interviewed by Cal Flyn, Five Books, 7 May 2021',
 'our ideologies and values are embedded in the language and metaphors','interview, on The Word for World is Forest','analysis','asserts','2021-05-07',R,'dossier-archivist')

add('reread','plainness and economy',
 'A commenter on the Reactor Le Guin reread picks out a five-word Le Guin sentence and calls it lovely.',
 'Reader comment on "Introducing the Ursula K. Le Guin Reread", Reactor comment thread',
 'He is done with doing.','comment thread','reader','asserts','2020',R,'chronicle-line')

add('set11','place and institution description',
 'Terry Morris faults the Ghibli Earthsea film for giving no sense of islands in a lonely ocean.',
 'Terry Morris, "Earthsea and Tales from Earthsea", Steam Engine Time No. 11 (fanzine), February 2009',
 'no sense of islands in a lonely ocean','article on the Ghibli adaptation, p. 31','reception','asserts','2009-02',PDF,'dossier-archivist',
 'medium: read from PDF stream text extracted by hand, so spacing and apostrophes in the source may differ from my extraction')

bad=m.check(C)
print("UNVERIFIED:",len(bad))
for b in bad: print(b)
json.dump(C,open('lgc-claims3.json','w'),indent=1)
print("total",len(C))
