import json,sys
from importlib.machinery import SourceFileLoader
m=SourceFileLoader('b','lgc-build.py').load_module()
U={
 'plotz-pb':'https://www.publicbooks.org/john-plotz-on-earthsea-anarchism-and-ursula-k-le-guin/',
 'tomlinson':'https://www.rob-tomlinson.com/a-good-read/dispossessed',
 'goss':'https://theodoragoss.com/2015/02/28/stonecoast-wizard-of-earthsea/',
 'booknut':'https://thebooknut.com/2018/03/30/a-wizard-of-earthsea/',
 'frumious':'https://www.thefrumiousconsortium.net/2018/03/19/the-dispossessed-by-ursula-k-le-guin/',
 'cannonball':'https://cannonballread.com/2014/02/bright-the-hawks-flight-on-the-empty-sky/',
 'wetbroken':'https://wetbrokenthings.wordpress.com/2025/05/25/book-review-tehanu/',
 'modaoda':'https://modaodaradosti.blogspot.com/2024/08/tehanu-novel-by-ursula-k-le-guin-book.html',
}
C=[]
R='curl with browser user agent (live URL)'
def add(f,feature,claim,source,quote,page,kind,polarity,date,reg,conf=None):
    d=dict(feature=feature,claim=claim,source=source,url=U[f],quote=quote,page=page,kind=kind,
           polarity=polarity,date=date,routeHint=R,registerHint=reg)
    if conf: d['confidence']=conf
    d['_file']=f; C.append(d)

add('plotz-pb','register modulation',
 'John Plotz says the Earthsea books, written for young adults, tip two different registers at once.',
 'John Plotz, in conversation with Elizabeth Ferry, Public Books, 21 February 2024',
 'young adults can tip two different registers at once','opening exchange','analysis','asserts','2024-02-21','chronicle-line')

# Tomlinson — The Dispossessed
add('tomlinson','place and institution description',
 'Rob Tomlinson says Le Guin’s style is spot-on for describing unfamiliar places and cultures.',
 'Rob Tomlinson, "The Dispossessed", A Good Read (rob-tomlinson.com)',
 'a style that is spot-on for describing unfamiliar places and cultures','second paragraph','analysis','asserts','2020s','dossier-archivist')
add('tomlinson','withheld information and inference',
 'Tomlinson says the reader can rely on Le Guin explaining a noted difference in due course rather than at once.',
 'Rob Tomlinson, A Good Read (rob-tomlinson.com)',
 'rely on her explaining that difference in due course','second paragraph','analysis','asserts','2020s','dossier-archivist')
add('tomlinson','concrete sensory noun',
 'Tomlinson quotes the opening of The Dispossessed, which describes the wall as built of uncut rocks roughly mortared.',
 'Ursula K. Le Guin (The Dispossessed), quoted by Rob Tomlinson',
 'It was built of uncut rocks roughly mortared','quoted opening paragraph','own-words','applies','1974','dossier-archivist')
add('tomlinson','place and institution description',
 'Tomlinson says Le Guin depicts the under-belly of a dazzling society in just a few pages of dense, carefully-worked text.',
 'Rob Tomlinson, A Good Read (rob-tomlinson.com)',
 'In just a few pages of dense, carefully-worked text','Nio Old Town paragraph','analysis','asserts','2020s','dossier-archivist')
add('tomlinson','concrete sensory noun',
 'Tomlinson renders the poor quarter of Nio as broken street lights, shuttered windows and shop fronts gutted by fire.',
 'Rob Tomlinson, A Good Read (rob-tomlinson.com), paraphrasing The Dispossessed',
 'Street lights were broken, windows shuttered, shop fronts gutted by fire','Nio Old Town paragraph','analysis','applies','2020s','dossier-archivist')

# Goss — the opening of A Wizard of Earthsea as a place description
add('goss','place and institution description',
 'Theodora Goss reads the opening of A Wizard of Earthsea as a camera that swoops down over the island from its high peak.',
 'Theodora Goss, "Stonecoast: Wizard of Earthsea", theodoragoss.com, 28 February 2015',
 'we swoop down over the island, from its high peak','analysis following the quoted opening','analysis','asserts','2015-02-28','dossier-archivist')
add('goss','other: general-to-particular descent',
 'Goss says the opening moves from a grander, larger view toward a smaller, more intimate one.',
 'Theodora Goss, theodoragoss.com, 28 February 2015',
 'moves from a grander, larger view toward a smaller, more intimate','analysis section','analysis','asserts','2015-02-28','dossier-archivist')
add('goss','naming and forms of address',
 'Goss notes the opening names its subject in descending order, Sparrowhawk to Ged to Duny.',
 'Theodora Goss, theodoragoss.com, 28 February 2015',
 'Sparrowhawk to Ged to Duny','analysis section','analysis','asserts','2015-02-28','dossier-archivist')
add('goss','opening sentence',
 'Goss argues the opening scene is structured by oppositions between boy and man, village and world.',
 'Theodora Goss, theodoragoss.com, 28 February 2015',
 'structured by the oppositions between boy and man, village and world','analysis section','analysis','asserts','2015-02-28','none')

# Frumious — the opening paragraph of The Dispossessed
add('frumious','place and institution description',
 'Doug Merrill observes that no people appear in the first paragraph of The Dispossessed.',
 'Doug Merrill, "The Dispossessed by Ursula K. Le Guin", The Frumious Consortium, 19 March 2018',
 'No people appear in the first paragraph','close reading of the opening','analysis','asserts','2018-03-19','dossier-archivist')
add('frumious','naming and forms of address',
 'Merrill notes no names are mentioned in the novel until the seventh page.',
 'Doug Merrill, The Frumious Consortium, 19 March 2018',
 'no names are mentioned until the seventh','close reading of the opening','analysis','asserts','2018-03-19','dossier-archivist')
add('frumious','concrete sensory noun',
 'Merrill says the opening paragraph establishes the rough and improvised nature of a key setting.',
 'Doug Merrill, The Frumious Consortium, 19 March 2018',
 'the rough and improvised nature of a key setting','close reading of the opening','analysis','asserts','2018-03-19','dossier-archivist')
add('frumious','omission as information',
 'Merrill lists among the opening paragraph’s subjects things that do not look important but are.',
 'Doug Merrill, The Frumious Consortium, 19 March 2018',
 'things that do not look important but are','close reading of the opening','analysis','asserts','2018-03-19','dossier-archivist')
add('frumious','withheld information and inference',
 'Merrill says Le Guin’s sketches of incidental characters hint at full lives lived off the page.',
 'Doug Merrill, The Frumious Consortium, 19 March 2018',
 'hint at the full lives they have lived off the page','later section on smaller bits','analysis','asserts','2018-03-19','dossier-archivist')

# Cannonball Read
add('cannonball','plainness and economy',
 'A Cannonball Read reviewer calls Le Guin’s writing spare and lyrical, begging to be read aloud.',
 'alannaofdoom, "Bright the hawk’s flight on the empty sky", Cannonball Read, 13 February 2014',
 'Her writing is spare and lyrical, just begging to be read aloud','review body, second point','reader','asserts','2014-02','none')
add('cannonball','annalist voice and deep time',
 'The same reviewer says the first lines have the feel of an old legend told and retold around hearth fires.',
 'alannaofdoom, Cannonball Read, 13 February 2014',
 'the feel of an old legend, told and retold around hearth','review body, second point','reader','asserts','2014-02','chronicle-line')
add('cannonball','cadence and rhythm',
 'The reviewer says Le Guin’s ear for rhythm turns the description of the midsummer Long Dance into a dance.',
 'alannaofdoom, Cannonball Read, 13 February 2014',
 'her ear for rhythm turns a description of the midsummer Long','review body, second point','reader','asserts','2014-02','herald-pools')
add('cannonball','other: alliteration',
 'The reviewer credits Le Guin with a gift for alliteration in short phrases.',
 'alannaofdoom, Cannonball Read, 13 February 2014',
 'gift for alliteration brings us beautiful little phrases','review body, second point','reader','asserts','2014-02','herald-pools')
add('cannonball','place and institution description',
 'The reviewer says the book teaches its systems of trade and government along the way.',
 'alannaofdoom, Cannonball Read, 13 February 2014',
 'its systems of trade and government','review body, first point','reader','asserts','2014-02','dossier-archivist')
add('cannonball','place and institution description',
 'The reviewer says Le Guin doles out world detail so skillfully that the narrative flow is never interrupted.',
 'alannaofdoom, Cannonball Read, 13 February 2014',
 'doles it out so skillfully that the flow of the narrative','review body, first point','reader','asserts','2014-02','dossier-archivist')

# Book Nut — dissent and its comment thread
add('booknut','point of view and distance',
 'A reviewer who reread A Wizard of Earthsea reports it feels all surface and no depth.',
 'The Book Nut blog (reviewer not named on the page), 30 March 2018',
 'It just feels all surface and no depth','review body','reception','disputes','2018-03-30','none')
add('booknut','point of view and distance',
 'A commenter says the book has a lot of narrative that tells instead of showing.',
 'Reader comment on The Book Nut, 30 March 2018',
 'It has a lot of narrative that tells instead of showing','comment thread','reader','asserts','2018','dossier-archivist')
add('booknut','omission as information',
 'The same commenter argues telling lets the reader use their imagination more.',
 'Reader comment on The Book Nut, 30 March 2018',
 'It lets the reader use their imagination more','comment thread','reader','asserts','2018','dossier-archivist')
add('booknut','plainness and economy',
 'Another commenter praises the spare, beautiful prose and the mythic feel of the narrative.',
 'Reader comment on The Book Nut, 30 March 2018',
 'the spare, beautiful prose and the inevitable, mythic feel','comment thread','reader','asserts','2018','chronicle-line')

# Tehanu reviews
add('wetbroken','consequence on a household',
 'A reviewer says Tehanu centres the story not on the grand and powerful but on the small and ordinary.',
 'Wet Broken Things blog, "Book review - Tehanu", 25 May 2025',
 'not on the grand and powerful, but the small, the powerless','opening paragraphs','reception','asserts','2025-05-25','dossier-archivist')
add('wetbroken','concrete sensory noun',
 'The same reviewer lists the book’s subject matter as the harvest, cooking and cleaning, and conversations amongst women.',
 'Wet Broken Things blog, 25 May 2025',
 'the harvest, cooking and cleaning, conversations amongst women','closing paragraph','reception','asserts','2025-05-25','dossier-archivist')
add('modaoda','plainness and economy',
 'A book blogger reports the Earthsea novels are neither long nor wordy.',
 'Moda od Radosti (Croatian book and fashion blog; reviewer not named on the page), review of Tehanu, August 2024',
 'the novels in Earthsea Cycle are neither long nor wordy','review section on Tehanu','reader','asserts','2024-08','none')
add('modaoda','plainness and economy',
 'The same blogger says the language is precise and descriptive.',
 'Moda od Radosti (reviewer not named on the page), August 2024',
 'The language is precise and descriptive','review section on Tehanu','reader','asserts','2024-08','dossier-archivist')
add('modaoda','omission as information',
 'The blogger says the natural laws and mythology of Earthsea are more hinted on than explained.',
 'Moda od Radosti (reviewer not named on the page), August 2024',
 'is more hinted on than explained','review section on Tehanu','reader','asserts','2024-08','dossier-archivist')
add('modaoda','place and institution description',
 'The blogger concludes Le Guin proves worldbuilding can succeed without going into detail.',
 'Moda od Radosti (reviewer not named on the page), August 2024',
 'you can do successful worldbuilding without going into detail','review section on Tehanu','reader','asserts','2024-08','dossier-archivist')

bad=m.check(C)
print("UNVERIFIED:",len(bad))
for b in bad: print(b)
json.dump(C,open('lgc-claims2.json','w'),indent=1)
print("total",len(C))
