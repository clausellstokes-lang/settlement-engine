# -*- coding: utf-8 -*-
import json
d=json.load(open('claims2.json')); U=d['U']; LOC=d['LOC']; C=d['claims']
U['jordan']='https://gwern.net/doc/fiction/gene-wolfe/1992-jordan.pdf'; LOC['jordan']='x/jordan.txt'
U['mad']='https://web.archive.org/web/20090406143511id_/http://www.irosf.com/q/zine/article/10536'; LOC['mad']='x/mad-expects.txt'
U['gbsolar']='https://books.google.com/books/about/Solar_Labyrinth.html?id=xGjSBAAAQBAJ'; LOC['gbsolar']='x/gb-solar.txt'
U['gblong']='https://books.google.com/books/about/THE_LONG_AND_THE_SHORT_OF_IT.html?id=7y1jBrpx4loC'; LOC['gblong']='x/gb-long.txt'
U['cold']='https://www.coldtonnage.com/product/599089/Lexicon-Urthus-A-Dictionary-For-The-Urth-Cycle-Wolfe--Gene-by-Michael-Andre-Driussi'; LOC['cold']='x/coldtonnage.txt'
U['wikib']='https://en.wikipedia.org/wiki/The_Book_of_the_New_Sun'; LOC['wikib']='x/wiki-botns.txt'
RHl="live page fetched with a browser user agent"
RHp="PDF fetched from gwern.net and text extracted with pdftotext -layout"
RHw="Wayback raw capture (id_ form) of the defunct irosf.com article"
def c(k,feature,claim,source,quote,page,kind,polarity,date,reg='none',conf='high',route=RHl):
    C.append(dict(feature=feature,claim=claim,source=source,url=U[k],quote=quote,page=page,kind=kind,
                  polarity=polarity,date=date,routeHint=route,registerHint=reg,confidence=conf))

JOR="Gene Wolfe, interview with James B. Jordan, conducted 1992 (published in Peter Wright (ed.), Shadows of the New Sun, Liverpool UP, 2007, at p. 109ff)"
c('jordan','withheld information and inference',"Wolfe said he tries not to leave a clue more than once.",
  JOR,"I try not to leave a clue more than once","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','repetition and refrain',"Wolfe said repeating a clue five times tells him the writer thinks the reader is dumber than he is.",
  JOR,"you are writing for somebody that is a lot dumber","interview transcript","own-words","rejects","1992",'dossier-archivist','high',RHp)
c('jordan','withheld information and inference',"Wolfe said he generally leaves all the clues he thinks the reader will require, sometimes more.",
  JOR,"leave all the clues that I think the reader","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','withheld information and inference',"Wolfe likened interpretation to police work, where most of the effort is finding more clues.",
  JOR,"the great majority of it consists of finding more clues","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','point of view and distance',"Wolfe said life seen superficially has very little pattern to it.",
  JOR,"Life seen superficially has very little pattern to it","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','civic record register',"Wolfe said he tried to write about the pagan world as the pagans themselves wrote about it.",
  JOR,"to write about that pagan world as the pagans themselves","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','other: modern framing rejected',"Wolfe said reading modern historians gives a very rationalistic viewpoint of the ancient religious world.",
  JOR,"we are reading a very rationalistic viewpoint","interview transcript","own-words","rejects","1992",'dossier-archivist','high',RHp)
c('jordan','place and institution description',"Wolfe said he made use of the memory palace system in the Soldier books.",
  JOR,"I have made use of the memory palace","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','civic record register',"Wolfe said he described the Spartan ceremony that killed the Helots in detail exactly as it was.",
  JOR,"a ceremony that I described in detail exactly as it was","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','compounds and coinages',"Wolfe denied making up any words, saying only that some are typos.",
  JOR,"No, but some of them are typos","interview transcript","own-words","rejects","1992",'dossier-archivist','high',RHp)
c('jordan','naming and forms of address',"Wolfe described Qabbalistic literature as a place he could steal ideas and names from.",
  JOR,"a place that I could steal ideas and names from","interview transcript","own-words","asserts","1992",'dossier-archivist','high',RHp)
c('jordan','place and institution description',"Wolfe said he was reacting against the idealization of the ancient world that many people hold.",
  JOR,"reacting against an ideali-","interview transcript","own-words","asserts","1992",'dossier-archivist','medium',RHp)

MAD="Michael Andre-Driussi, 'What Gene Wolfe Expects of His Readers: The Urth of the New Sun as an Answer to Mysteries in The Book of the New Sun', The Internet Review of Science Fiction, April 2009"
c('mad','withheld information and inference',"Andre-Driussi concludes enough clues were provided for the major mysteries to be solved in the tetralogy itself.",
  MAD,"enough clues were provided for such major mysteries to be solved","body of essay","analysis","asserts","2009",'dossier-archivist','high',RHw)
c('mad','omission as information',"Andre-Driussi says one major mystery was probably not even recognised as a mystery by most readers.",
  MAD,"probably not even recognized as a mystery by most readers","body of essay","analysis","asserts","2009",'dossier-archivist','high',RHw)
c('mad','repetition and refrain',"Andre-Driussi counts at least seven points at which Severian has intimations of the deluge.",
  MAD,"In at least seven points in TBOTNS, Severian has intimations","body of essay","measurement","asserts","2009",'chronicle-line','high',RHw)
c('mad','withheld information and inference',"Andre-Driussi shows a passage that reads as a joke turns out to be entirely true and real.",
  MAD,"turns out to be entirely true and real","body of essay","analysis","asserts","2009",'dossier-archivist','high',RHw)
c('mad','other: editorial pressure',"Wolfe recalled that his editor wanted one explanatory paragraph added to the tetralogy's ending.",
  "Gene Wolfe, 'Secrets of the Greeks' (1990), in Castle of Days, pp. 416-17, quoted in "+MAD,"David and I yelled at each other for a while","Castle of Days pp. 416-17","own-words","asserts","1990",'none','high',RHw)
c('mad','other: refusal to summarise',"Wolfe felt a single paragraph would not be enough to close the tetralogy's ending.",
  "Gene Wolfe, 'Secrets of the Greeks' (1990), quoted in "+MAD,"felt that a paragraph wasn't going to be enough","Castle of Days pp. 416-17","own-words","rejects","1990",'dossier-archivist','high',RHw)

c('gbsolar','other: monograph form',"Borski's publisher describes Solar Labyrinth as the first book-length investigation of Wolfe's puzzlebox.",
  "iUniverse publisher description for Robert Borski, Solar Labyrinth (iUniverse, 20 May 2004, 204 pages), on the Google Books record",
  "the first book-length investigation of Wolfe's literary puzzlebox","publisher description","vendor","asserts","2004",'none','medium')
c('gbsolar','edition and house style',"The Google Books record gives Solar Labyrinth as 204 pages, where a reviewer of the trade paperback counted 188.",
  "Google Books record for Robert Borski, Solar Labyrinth (iUniverse, 2004)","iUniverse , May 20, 2004 - Literary Criticism - 204 pages","bibliographic line","measurement","asserts","2004",'none','medium')
c('gblong','other: monograph form',"Borski's second collection ranges across Wolfe's work from short stories to novellas to book series.",
  "iUniverse publisher description for Robert Borski, The Long and the Short of It (iUniverse, 17 Feb 2006, 154 pages), on the Google Books record",
  "from short stories to novellas to mega-book series","publisher description","vendor","asserts","2006",'none','medium')
c('cold','other: reference apparatus',"The Lexicon Urthus first edition was compiled by Andre-Driussi with an introduction by Gene Wolfe.",
  "Cold Tonnage Books catalogue entry for Lexicon Urthus (Sirius Fiction, San Francisco, 1994), first edition",
  "compiled by Michael Andre-Driussi with an introduction by Gene Wolfe","catalogue description","vendor","asserts","1994",'dossier-archivist','medium')
c('cold','edition and house style',"The bookseller gives the 1994 Lexicon Urthus first edition as 282 pages.",
  "Cold Tonnage Books catalogue entry for Lexicon Urthus (Sirius Fiction, 1994)","282 pages, compiled by Michael Andre-Driussi","catalogue description","measurement","asserts","1994",'none','medium')

WK="Wikipedia relaying Gene Wolfe's appendix to The Shadow of the Torturer (1980)"
c('wikib','compounds and coinages',"Wolfe's appendix says he never had recourse to invented terms in rendering the book.",
  WK,"having recourse to invented terms; in no case have I done so","'Language: Vocabulary' section","relay","asserts","1980",'dossier-archivist','medium')
c('wikib','archaism',"Wolfe's appendix says he replaced undiscovered concepts with their closest twentieth-century equivalents.",
  WK,"replace yet undiscovered concepts by their closest twentieth-century equivalents","'Language: Vocabulary' section","relay","asserts","1980",'dossier-archivist','medium')
c('wikib','place and institution description',"Wikipedia relays that Ascian is derived from a Latin word meaning without shadow, matching the people's latitude.",
  "Wikipedia relaying Michael Andre-Driussi, Lexicon Urthus (2nd edn, 2008)","derived from a Latin word meaning 'without shadow'","'Language: Vocabulary' section","relay","asserts","2008",'dossier-archivist','medium')
c('wikib','other: institutional language',"Wikipedia relays that the Ascian language consists only of quotations from state propaganda called Correct Thought.",
  "Wikipedia relaying scholarship on the Ascian language in The Citadel of the Autarch","a set of quotations from government propaganda called 'Correct Thought'","'Ascian language' section","relay","asserts","1983",'dossier-archivist','medium')

json.dump({'U':U,'LOC':LOC,'claims':C},open('claims2.json','w'),ensure_ascii=False)
print(len(C))
