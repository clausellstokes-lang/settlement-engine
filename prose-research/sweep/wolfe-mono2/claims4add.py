# -*- coding: utf-8 -*-
import json
d=json.load(open('claims2.json')); U=d['U']; LOC=d['LOC']; C=d['claims']
U['clute01']='https://gwern.net/doc/fiction/gene-wolfe/2001-01-29-johnclute-excessivecandorv7no5issue197-itisbecomingtograpplewiththisbook.html'
LOC['clute01']='g/2001-01-29-johnclute-excessivecandorv7no5issue197-itisbecomingtograpplewiththisbook.txt'
U['clute09']='https://gwern.net/doc/fiction/gene-wolfe/2009-04-06-johnclute-thebestofgenewolfe-review.html'
LOC['clute09']='g/2009-04-06-johnclute-thebestofgenewolfe-review.txt'
U['diss']='https://gwern.net/doc/fiction/gene-wolfe/2019-aramini.pdf'; LOC['diss']='g/2019-aramini.txt'
RH1="gwern.net mirror of the defunct scifi.com Excessive Candour column, fetched live"
RH2="gwern.net mirror of the defunct SCI FI Wire review, fetched live"
RH3="PDF fetched from gwern.net, text extracted with pdftotext -layout"
def c(k,feature,claim,source,quote,page,kind,polarity,date,reg='none',conf='high',route='live page fetched with a browser user agent'):
    C.append(dict(feature=feature,claim=claim,source=source,url=U[k],quote=quote,page=page,kind=kind,
                  polarity=polarity,date=date,routeHint=route,registerHint=reg,confidence=conf))

CL1="John Clute, 'It Is Becoming to Grapple with This Book', Excessive Candour column, Science Fiction Weekly issue 197, 29 January 2001"
c('clute01','per-speaker register',"Clute praises the dozens of dialects and accents of the Short Sun cast as meticulously rendered.",
  CL1,"dialects and accents spoken by the huge cast, all meticulously rendered","body of column","analysis","asserts","2001",'herald-pools','high',RH1)
c('clute01','withheld information and inference',"Clute names Wolfe's refusal to unpack in easy terms a tale that is inherently difficult to tell.",
  CL1,"refusal to unpack in easy terms a tale which is","body of column","analysis","asserts","2001",'dossier-archivist','high',RH1)
c('clute01','concrete sensory noun',"Clute registers the return of concrete particulars as salt and seawrack and flowering gardens.",
  CL1,"salt and seawrack and flowering gardens","body of column","analysis","applies","2001",'dossier-archivist','high',RH1)
c('clute01','withheld information and inference',"Clute says long stretches of the book only become intelligible on a second or third reading.",
  CL1,"on a second or third reading","body of column","analysis","asserts","2001",'none','high',RH1)
c('clute01','per-speaker register',"Wolfe gives a child narrator, Hoof, a plain declarative voice for the hardest matter in the book.",
  "Gene Wolfe, Return to the Whorl, quoted in "+CL1,"Father was good. That is the hard part to explain","quoted in the column","own-words","applies","2001",'chronicle-line','high',RH1)

CL2="John Clute, review of The Best of Gene Wolfe, SCI FI Wire, 6 April 2009"
c('clute09','withheld information and inference',"Clute says the door to the inner rooms of a Wolfe story is never open.",
  CL2,"the door to the inner rooms is never open","opening of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','plainness and economy',"Clute held that every word Wolfe wrote was meant, leaving no sentence to be slurred over.",
  CL2,"every word he wrote was meant","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','metaphor discipline',"Clute asserts Wolfe did not create metaphors in his text, or only ones with a literal meaning attached.",
  CL2,"metaphors to which a literal meaning, a literal architectonic, could","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','metaphor discipline',"Clute says the closest Wolfe normally gets to metaphor is letting a protagonist tell a lie.",
  CL2,"the closest Wolfe normally gets to metaphor is when he","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','concrete sensory noun',"Clute asserts Wolfe wrote neither thematics nor allegory but the thing itself.",
  CL2,"he did not write allegory, he wrote the thing itself","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','plainness and economy',"Clute describes 'The Fifth Head of Cerberus' as written in a fluent, seemingly translucent style.",
  CL2,"a fluent, seemingly translucent style","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','withheld information and inference',"Clute says the story can only be understood when every word is adhered to literally.",
  CL2,"understood when every word is adhered to literally","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','civic record register',"Clute notes the opening tells us the tale is a memoir we are meant to understand was written down.",
  CL2,"we are meant to understand has actually been written down","body of review","analysis","asserts","2009",'chronicle-line','high',RH2)
c('clute09','place and institution description',"Clute says the home of a Wolfe narrator tends to combine prison, pleasure garden and tomb.",
  CL2,"the features of a prison, a “pleasure garden,” and a tomb","body of review","analysis","asserts","2009",'dossier-archivist','high',RH2)
c('clute09','other: critical neglect',"Clute says academics have notoriously tended to shun Wolfe for decades.",
  CL2,"academics have notoriously tended to shun him for decades","body of review","analysis","asserts","2009",'none','high',RH2)

DIS="Marc A. Aramini, '...Does It Mean? Gene Wolfe: Perverse Puzzle Maker', PhD dissertation, University of Nevada Las Vegas, May 2019"
c('diss','omission as information',"Aramini states it is generally accepted that Wolfe's style leaves out conclusions most genre work would include.",
  DIS,"leaving out conclusions that most genre work would definitely include","ch. 1","analysis","asserts","2019",'dossier-archivist','high',RH3)
c('diss','withheld information and inference',"Aramini reports a general consensus that Wolfe leaves resolutions for the reader to infer.",
  DIS,"which are left to the reader to infer","ch. 1","analysis","asserts","2019",'dossier-archivist','high',RH3)
c('diss','withheld information and inference',"Aramini reports Wright's counter-claim that Wolfe's allusions are distractions and misdirections.",
  DIS,"are actually distractions and misdirections","ch. 1","analysis","disputes","2019",'none','high',RH3)
c('diss','withheld information and inference',"Peter Wright wrote that Wolfe's allusions are of little use to an understanding of the narrative.",
  "Peter Wright, Attending Daedalus, quoted in "+DIS,"of little use to an understanding of the narrative","quoted in ch. 1","relay","disputes","2019",'none','medium',RH3)
c('diss','archaism',"Peter Wright wrote that the diction of Wolfe's translated texts is suggestive rather than definitive.",
  "Peter Wright, Attending Daedalus, p. 188, quoted in "+DIS,"the diction of each text is ‘suggestive rather than definitive’","quoted in ch. 1, citing AD p. 188","relay","asserts","2003",'dossier-archivist','high',RH3)
c('diss','archaism',"Adam Roberts reports that some readers find Wolfe's deliberately mannered and archaic idiom a deterrent.",
  "Adam Roberts, The History of Science Fiction, quoted in "+DIS,"archaic idiom a deterrent","quoted in ch. 1","relay","disputes","2019",'dossier-archivist','medium',RH3)
c('diss','dialogue register',"Adam Roberts faults Wolfe's later books for relying too much on over-lengthy and expository dialogue.",
  "Adam Roberts, quoted in "+DIS,"rely too much on over-lengthy and","quoted in ch. 1","relay","disputes","2019",'herald-pools','medium',RH3)
c('diss','register modulation',"A reader faulted The Wizard Knight for a high archaic register that lapses into slang.",
  "The reader 'Frug', quoted in "+DIS,"Usually in a high and archaic register, it would lapse","quoted in the Wizard Knight chapter","reader","disputes","2019",'dossier-archivist','medium',RH3)
c('diss','register modulation',"The same reader calls the mixture of slang into unbroken pages of high-register speech awkward.",
  "The reader 'Frug', quoted in "+DIS,"the mixture of slang into","quoted in the Wizard Knight chapter","reader","disputes","2019",'dossier-archivist','medium',RH3)
c('diss','other: symbol discipline',"Aramini holds that Wolfe's symbols are rigorous and logical though their meaning is not immediately obvious.",
  DIS,"their meaning is not always immediately obvious","ch. 1","analysis","asserts","2019",'dossier-archivist','high',RH3)

json.dump({'U':U,'LOC':LOC,'claims':C},open('claims2.json','w'),ensure_ascii=False)
print(len(C))
