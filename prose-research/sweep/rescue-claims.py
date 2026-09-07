COMPLETE=True
COVERAGE=("Named roster: FETCHED RAW - Cheryl Morgan's Emerald City 'Pieces of History' and her Emerald City review of The Last Light of the Sun (both BrightWeavings reprints); Mohanraj and Cobb's two Strange Horizons pieces of 13 Nov 2000 plus their 'History behind the Books' companion (live URL dead, recovered at the Wayback raw capture 20160319104019id_); Kirkus at the primary (seven reviews, Tigana 1990 through A Brightness Long Ago 2019); Publishers Weekly at the primary (six reviews, Tigana 1990 through A Brightness Long Ago); the Infinity Plus interview and three Infinity Plus reviews - which turn out to be by Sandy Auden and Simeon Shoul, NOT Nick Gevers, and are recorded under their true bylines; and Brian Attebery's Strategies of Fantasy, whose complete OCR text was downloaded from an open archive.org item and measured. NOT FOUND - John Clute's SFE entry (sf-encyclopedia.com/entry/kay_guy_gavriel and three variants all 404; SFE's own Canada entry names Kay without linking any entry, so SFE appears to carry none); the 1997 Encyclopedia of Fantasy entry (the /fe/ namespace is 404), survived only as a seven-word quotation relayed on BrightWeavings; Faren Miller's Locus reviews (the Locus September 1992 table of contents confirms her A Song for Arbonne review at page 17, but Locus print reviews of that era are not online and BrightWeavings reprints none); any New York Times review (nytimes.com/search returns 403 to this host, Wayback wildcard CDX requires authorization, and no Kay Wikipedia article cites one). BLOCKED - Farah Mendlesohn's Rhetorics of Fantasy (the only archive.org copy is lending-restricted: fulltext/inside.php returns Item not available, _djvu.txt 302s, HathiTrust 403s, Google Books API returns no totals); Booklist Online and Library Journal (both serve JavaScript shells, 67 characters of body text and 502 respectively); the session's web-search budget was exhausted mid-run and DuckDuckGo, Mojeek and lite endpoints returned captchas or nothing, so lateral searching was replaced by sitemap and Wikipedia-wikitext discovery. Substantive sources per route: 24 by direct fetch with a browser user agent (BrightWeavings, Strange Horizons, Infinity Plus, Kirkus, Publishers Weekly, Locus), 5 by Wayback raw id_ capture (the Strange Horizons companion and four SF Site reviews, sfsite.com being unreachable from this host), 1 by open archive.org full text (Attebery, measured to zero mentions of Kay), and 4 further BrightWeavings reprint pages found by diffing the site sitemap against the 153 distinct URLs already in state-kay.json - which yielded the run's richest register evidence: Jo Walton's 'veiled omniscient', Rob Kilheffer in F&SF on withheld information and off-stage action, Dave Langford in SFX, Michelle Sagara in Quill & Quire, and John H. Riskind in the Washington Post Book World.")

BW="https://brightweavings.com/pieces-of-history-2/"
S(title="Pieces of History - review by Cheryl Morgan for Emerald City (reprinted at BrightWeavings)",url=BW,kind="reception",substantive=True,date="reprint posted 2016-05-07; Emerald City review of the Sarantine Mosaic",route="direct fetch, browser user agent")
C(file='bw-pieces',feature="place and institution description",
  claim="Cheryl Morgan writes that Kay built the Sarantine Mosaic prologue as a patchwork of people and places meant to set the scene.",
  source="Cheryl Morgan, 'Pieces of History', Emerald City (reprinted BrightWeavings, posted 2016-05-07)",url=BW,
  quote="a patchwork of people and places designed to set the scene",page="body, third paragraph",kind="reception",polarity="asserts",date="2016-05-07 reprint",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw-pieces',feature="point of view and distance",
  claim="Morgan calls Crispin a literary device: a lowly but conveniently placed observer through whom Kay tells a much greater tale.",
  source="Cheryl Morgan, 'Pieces of History', Emerald City (reprinted BrightWeavings, posted 2016-05-07)",url=BW,
  quote="a lowly but conveniently placed observer",page="body, on Crispin",kind="reception",polarity="asserts",date="2016-05-07 reprint",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw-pieces',feature="other: unreliable chronicler inside the fiction",
  claim="Cheryl Morgan reports Kay's note that the historian Procopius is so unpleasant about Theodora that his testimony must be suspect.",
  source="Cheryl Morgan, 'Pieces of History', Emerald City (reprinted BrightWeavings), paraphrasing Kay",url=BW,
  quote="his testimony must be suspect",page="body, on the real history",kind="reception",polarity="asserts",date="2016-05-07 reprint",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="medium: Morgan paraphrases Kay rather than quoting him")
C(file='bw-pieces',feature="other: court politics rendered without dominating the book",
  claim="Morgan judges Kay's court politics believably subtle and devious without social nuance becoming the whole book.",
  source="Cheryl Morgan, 'Pieces of History', Emerald City (reprinted BrightWeavings, posted 2016-05-07)",url=BW,
  quote="believably subtle and devious without making social nuance",page="body, on the politics",kind="reception",polarity="asserts",date="2016-05-07 reprint",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

SHT="https://strangehorizons.com/wordpress/non-fiction/articles/from-tapestry-to-mosaic-the-fantasy-novels-of-guy-gavriel-kay/"
S(title="From Tapestry to Mosaic: The Fantasy Novels of Guy Gavriel Kay - Christopher Cobb and Mary Anne Mohanraj, Strange Horizons",url=SHT,kind="analysis",substantive=True,date="2000-11-13",route="direct fetch, browser user agent")
C(file='sh-tapestry',feature="withheld information and inference",
  claim="Christopher Cobb says Devin knows nothing of his land's true history, so the reader can learn that history as he learns it.",
  source="Christopher Cobb, in Cobb and Mohanraj, 'From Tapestry to Mosaic', Strange Horizons, 13 November 2000",url=SHT,
  quote="the reader can learn that history as he learns it",page="Tigana section, CC turn",kind="analysis",polarity="asserts",date="2000-11-13",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='sh-tapestry',feature="withheld information and inference",
  claim="Cobb objects that on rereading Tigana the set-up of Catriana's death and recovery felt like narratorial sleight-of-hand.",
  source="Christopher Cobb, in Cobb and Mohanraj, 'From Tapestry to Mosaic', Strange Horizons, 13 November 2000",url=SHT,
  quote="I was being set up by narratorial sleight-of-hand",page="Tigana section, CC turn",kind="analysis",polarity="disputes",date="2000-11-13",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='sh-tapestry',feature="other: characters repeat across books",
  claim="Cobb concedes that judged as realist fiction Kay's characters are not sufficiently differentiated from book to book.",
  source="Christopher Cobb, in Cobb and Mohanraj, 'From Tapestry to Mosaic', Strange Horizons, 13 November 2000",url=SHT,
  quote="his characters are not sufficiently differentiated from book to book",page="Tigana section, CC turn",kind="analysis",polarity="disputes",date="2000-11-13",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

SHB="https://strangehorizons.com/non-fiction/reviews/we-must-learn-to-bend-or-we-break-the-art-of-living-in-guy-gavriel-kays-sarantine-mosaic/"
S(title="'We must learn to bend, or we break': The Art of Living in Guy Gavriel Kay's Sarantine Mosaic - Cobb and Mohanraj, Strange Horizons",url=SHB,kind="analysis",substantive=True,date="2000-11-13",route="direct fetch, browser user agent")
C(file='sh-bend',feature="consequence on a household",
  claim="Cobb says Kay's plotting lets him treat the relations between ordinary people like Crispin and rulers like Valerius in a plausible way.",
  source="Christopher Cobb, in Cobb and Mohanraj, 'We must learn to bend, or we break', Strange Horizons, 13 November 2000",url=SHB,
  quote="ordinary people like Crispin, and rulers like Valerius",page="CC turn on plotting",kind="analysis",polarity="asserts",date="2000-11-13",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='sh-bend',feature="other: trajectory toward historical realism",
  claim="Cobb reads the Sarantine Mosaic as part of Kay's trajectory away from high fantasy towards historical realism.",
  source="Christopher Cobb, in Cobb and Mohanraj, 'We must learn to bend, or we break', Strange Horizons, 13 November 2000",url=SHB,
  quote="trajectory away from high fantasy towards historical realism",page="CC turn on history",kind="analysis",polarity="asserts",date="2000-11-13",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='sh-bend',feature="other: narrator as recorder of the world",
  claim="Cobb's closing judgment is that Kay makes the Mosaic with an unwearying spirit of love for the spectacle of the world that he records.",
  source="Christopher Cobb, in Cobb and Mohanraj, 'We must learn to bend, or we break', Strange Horizons, 13 November 2000",url=SHB,
  quote="love for the spectacle of the world that he records",page="CC's last word",kind="analysis",polarity="asserts",date="2000-11-13",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")

IPI="https://www.infinityplus.co.uk/nonfiction/intggk.htm"
S(title="Historical Significance: An Interview with Guy Gavriel Kay - by Sandy Auden, infinity plus",url=IPI,kind="own-words",substantive=True,date="2005-07-03",route="direct fetch, browser user agent")
C(file='ip-gevers',feature="place and institution description",
  claim="Kay says a researched detail is cut when it feels gratuitous or forced, or reads like the raw information dumps he dislikes in other people's books.",
  source="Guy Gavriel Kay, interviewed by Sandy Auden, infinity plus, 3 July 2005",url=IPI,
  quote="one of those raw information dumps I dislike in other",page="answer on selecting details",kind="own-words",polarity="asserts",date="2005-07-03",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='ip-gevers',feature="own words: fantasy as a prism on the past",
  claim="Kay says the fantasy method removes a level of presumption that one can know what Justinian and Theodora's marriage was like.",
  source="Guy Gavriel Kay, interviewed by Sandy Auden, infinity plus, 3 July 2005",url=IPI,
  quote="It removes a level of presumption",page="answer on similarities between past and present",kind="own-words",polarity="asserts",date="2005-07-03",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='ip-gevers',feature="other: the unimportance of great events to ordinary citizens",
  claim="Kay traces a motif of the Sarantine Mosaic to Auden's poem on Breughel and the relative unimportance of great events for ordinary citizens.",
  source="Guy Gavriel Kay, interviewed by Sandy Auden, infinity plus, 3 July 2005",url=IPI,
  quote="the relative un importance of great events",page="answer on the legacy theme",kind="own-words",polarity="asserts",date="2005-07-03",routeHint="direct fetch with browser user agent; page's own spacing preserved",registerHint="none",confidence="medium: the page renders 'unimportance' split as 'un importance'")

IPA="https://www.infinityplus.co.uk/nonfiction/alrassan.htm"
S(title="Guy Gavriel Kay: The Lions of Al-Rassan - review by Simeon Shoul, infinity plus",url=IPA,kind="reception",substantive=True,date="review of the 1996 Voyager paperback",route="direct fetch, browser user agent")
C(file='ip-alrassan',feature="plainness and economy",
  claim="Simeon Shoul says Kay's prose has always been quite mannered and quite deliberately styled.",
  source="Simeon Shoul, review of The Lions of Al-Rassan, infinity plus",url=IPA,
  quote="a prose that has always been quite mannered, quite deliberately styled",page="body, the problems section",kind="reception",polarity="disputes",date="undated page; reviews the 1996 Voyager edition",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='ip-alrassan',feature="withheld information and inference",
  claim="Shoul complains that Kay as narrator will directly inform the reader that his characters are brilliant.",
  source="Simeon Shoul, review of The Lions of Al-Rassan, infinity plus",url=IPA,
  quote="as narrator, will directly inform us that they are brilliant",page="body, the problems section",kind="reception",polarity="disputes",date="undated page; reviews the 1996 Voyager edition",registerHint="none",routeHint="direct fetch with browser user agent",confidence="high")
C(file='ip-alrassan',feature="annalist voice and deep time",
  claim="Shoul reports that Kay compresses a Reconquista that actually took about four hundred years into no more than thirty-five.",
  source="Simeon Shoul, review of The Lions of Al-Rassan, infinity plus",url=IPA,
  quote="Kay compresses it into no more than thirty-five",page="body, second paragraph",kind="reception",polarity="asserts",date="undated page; reviews the 1996 Voyager edition",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='ip-alrassan',feature="opening sentence",
  claim="Shoul notes Kay uses a brief prologue and epilogue to sketch the beginnings and ends of the historical process the novel compresses.",
  source="Simeon Shoul, review of The Lions of Al-Rassan, infinity plus",url=IPA,
  quote="sketch the beginnings and ends of the process",page="body, second paragraph",kind="reception",polarity="asserts",date="undated page; reviews the 1996 Voyager edition",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='ip-alrassan',feature="other: show rather than announce",
  claim="Shoul's advice to Kay is to talk about his characters less and show their actions more.",
  source="Simeon Shoul, review of The Lions of Al-Rassan, infinity plus",url=IPA,
  quote="talk about your characters less, show us their actions more",page="body, advice",kind="reception",polarity="asserts",date="undated page; reviews the 1996 Voyager edition",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

IPE="https://www.infinityplus.co.uk/nonfiction/lordofemperors.htm"
S(title="Guy Gavriel Kay: Lord of Emperors - review by Simeon Shoul, infinity plus",url=IPE,kind="reception",substantive=True,date="reviews the Earthlight paperback published 26 March 2001",route="direct fetch, browser user agent")
C(file='ip-lordofemperors',feature="point of view and distance",
  claim="Shoul says Crispin sees much, though not all, of the plots and affairs that drive the novel.",
  source="Simeon Shoul, review of Lord of Emperors, infinity plus",url=IPE,
  quote="Crispin sees much, though not all, of the varied",page="body, second paragraph",kind="reception",polarity="asserts",date="reviews the 26 March 2001 Earthlight paperback",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='ip-lordofemperors',feature="other: ordinary trades as the vantage on power",
  claim="Shoul says the book uses the experiences and perspective of a master artisan to explore the life of the greatest city on earth.",
  source="Simeon Shoul, review of Lord of Emperors, infinity plus",url=IPE,
  quote="the experiences and perspective of a master artisan",page="body, first paragraph",kind="reception",polarity="asserts",date="reviews the 26 March 2001 Earthlight paperback",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

IPL="https://www.infinityplus.co.uk/nonfiction/lastlightofthesun.htm"
S(title="The Last Light of the Sun by Guy Gavriel Kay - review by Sandy Auden, infinity plus",url=IPL,kind="reception",substantive=True,date="review of the 2004 novel",route="direct fetch, browser user agent")
C(file='ip-lastlightofthesun',feature="concrete sensory noun",
  claim="Sandy Auden says Kay delivers his historical detail with no dry technical facts.",
  source="Sandy Auden, review of The Last Light of the Sun, infinity plus",url=IPL,
  quote="There are no dry technical facts",page="body, on Kay's love of history",kind="reception",polarity="asserts",date="review of the 2004 novel",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='ip-lastlightofthesun',feature="naming and forms of address",
  claim="Auden says names like Halldr, Ceinion and Aeldred conjure their own ancient images.",
  source="Sandy Auden, review of The Last Light of the Sun, infinity plus",url=IPL,
  quote="conjure their own ancient images",page="body, on Kay's use of language",kind="reception",polarity="asserts",date="review of the 2004 novel",routeHint="direct fetch with browser user agent",registerHint="herald-pools",confidence="high")
C(file='ip-lastlightofthesun',feature="register modulation",
  claim="Auden says Kay blends the present tense with unusual cadences to demonstrate the strangeness of the faeries.",
  source="Sandy Auden, review of The Last Light of the Sun, infinity plus",url=IPL,
  quote="blends the present tense with unusual cadences",page="body, on prose style",kind="reception",polarity="asserts",date="review of the 2004 novel",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='ip-lastlightofthesun',feature="dialogue register",
  claim="Auden says Kay's use of speech drives the plot and illustrates his ninth-century world at the same time.",
  source="Sandy Auden, review of The Last Light of the Sun, infinity plus",url=IPL,
  quote="it drives the plot and illustrates his 9th Century",page="body, on Kay's use of language",kind="reception",polarity="asserts",date="review of the 2004 novel",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='ip-lastlightofthesun',feature="point of view and distance",
  claim="Auden describes the book as a prose spiral that starts with a wide vista of kingdoms and narrows until individual characters stand alone.",
  source="Sandy Auden, review of The Last Light of the Sun, infinity plus",url=IPL,
  quote="Starting with a wide vista concerning kingdoms",page="body, on story structure",kind="reception",polarity="asserts",date="review of the 2004 novel",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='ip-lastlightofthesun',feature="other: digressive potted histories of minor figures",
  claim="Auden says Kay spins off additional stories at tangents to show that side characters' stories are equally valid.",
  source="Sandy Auden, review of The Last Light of the Sun, infinity plus",url=IPL,
  quote="the stories of side characters are equally valid",page="body, on story structure",kind="reception",polarity="asserts",date="review of the 2004 novel",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")

KT="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/tigana/"
S(title="TIGANA - Kirkus Reviews",url=KT,kind="reception",substantive=True,date="Kirkus Reviews issue 15 August 1990; pub date 7 September 1990",route="direct fetch, browser user agent")
C(file='kirkus-tigana',feature="place and institution description",
  claim="Kirkus says Kay spun a richly sensuous fantasy world full of evocative history, religions, folklore, local customs and magical rites.",
  source="Kirkus Reviews, unsigned review of Tigana, issue of 15 August 1990",url=KT,
  quote="full of evocative history, religions, folklore, local customs, and magical rites",page="review body",kind="reception",polarity="asserts",date="1990-08-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='kirkus-tigana',feature="place and institution description",
  claim="Kirkus says the novel's colorful setting nearly steals the show from its plot threads.",
  source="Kirkus Reviews, unsigned review of Tigana, issue of 15 August 1990",url=KT,
  quote="the novel's colorful setting nearly steals the show",page="review body",kind="reception",polarity="asserts",date="1990-08-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

KA="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/a-song-for-arbonne/"
S(title="A SONG FOR ARBONNE - Kirkus Reviews",url=KA,kind="reception",substantive=True,date="Kirkus review of the 1992 novel",route="direct fetch, browser user agent")
C(file='kirkus-a-song-for-arbonne',feature="point of view and distance",
  claim="Kirkus says the reader sees Arbonne much of the time through the eyes of Blaise, an expatriate mercenary captain.",
  source="Kirkus Reviews, unsigned review of A Song for Arbonne",url=KA,
  quote="we see Arbonne through the eyes of Blaise",page="review body",kind="reception",polarity="asserts",date="Kirkus review of the 1992 novel",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='kirkus-a-song-for-arbonne',feature="other: history as material rather than subject",
  claim="Kirkus says Kay is less interested in re-creating history than in playing the changes on the epic themes of love, war and destiny.",
  source="Kirkus Reviews, unsigned review of A Song for Arbonne",url=KA,
  quote="Kay is less interested in re-creating history than in playing",page="review body",kind="reception",polarity="asserts",date="Kirkus review of the 1992 novel",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

KL="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/the-lion-of-al-rassan/"
S(title="THE LION[S] OF AL-RASSAN - Kirkus Reviews",url=KL,kind="reception",substantive=True,date="Kirkus review of the 1995 novel",route="direct fetch, browser user agent")
C(file='kirkus-the-lion-of-al-rassan',feature="closing sentence",
  claim="Kirkus says the final pages leave the reader with the impression that the novel's events have abruptly receded into some long-forgotten history.",
  source="Kirkus Reviews, unsigned review of The Lions of Al-Rassan",url=KL,
  quote="abruptly receded into some long-forgotten history",page="review body, near the end",kind="reception",polarity="asserts",date="Kirkus review of the 1995 novel",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='kirkus-the-lion-of-al-rassan',feature="place and institution description",
  claim="Kirkus says the complex characterization and richly detailed settings create an unusually full portrait of an exotic society.",
  source="Kirkus Reviews, unsigned review of The Lions of Al-Rassan",url=KL,
  quote="richly detailed settings create an unusually full portrait",page="review body",kind="reception",polarity="asserts",date="Kirkus review of the 1995 novel",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

KR="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/river-of-stars/"
S(title="RIVER OF STARS - Kirkus Reviews",url=KR,kind="reception",substantive=True,date="Kirkus review of the 2013 novel",route="direct fetch, browser user agent")
C(file='kirkus-river-of-stars',feature="annalist voice and deep time",
  claim="Kirkus says Kay narrates the empire's outcome drawing straight from the annals.",
  source="Kirkus Reviews, unsigned review of River of Stars",url=KR,
  quote="drawing straight from the annals",page="review body",kind="reception",polarity="asserts",date="Kirkus review of the 2013 novel",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='kirkus-river-of-stars',feature="plainness and economy",
  claim="Kirkus's verdict on River of Stars is that the book is lucid and lyrical, and skillfully written.",
  source="Kirkus Reviews, unsigned review of River of Stars",url=KR,
  quote="Lucid and lyrical, and skillfully written",page="verdict line",kind="reception",polarity="asserts",date="Kirkus review of the 2013 novel",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

KC="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/children-of-earth-and-sky/"
S(title="CHILDREN OF EARTH AND SKY - Kirkus Reviews",url=KC,kind="reception",substantive=True,date="Kirkus review of the 2016 novel",route="direct fetch, browser user agent")
C(file='kirkus-children-of-earth-and-sky',feature="point of view and distance",
  claim="Kirkus complains that Kay draws back from the crux of climactic moments to muse on how small individual lives are.",
  source="Kirkus Reviews, unsigned review of Children of Earth and Sky",url=KC,
  quote="drawing back from the crux of climactic moments",page="review body",kind="reception",polarity="disputes",date="Kirkus review of the 2016 novel",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='kirkus-children-of-earth-and-sky',feature="place and institution description",
  claim="Kirkus calls the historical setting of Children of Earth and Sky lush, well-researched and well-painted.",
  source="Kirkus Reviews, unsigned review of Children of Earth and Sky",url=KC,
  quote="The historical setting is lush, well-researched, and well-painted",page="verdict line",kind="reception",polarity="asserts",date="Kirkus review of the 2016 novel",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='kirkus-children-of-earth-and-sky',feature="place and institution description",
  claim="Kirkus warns that Kay risks readers finding the history to be his strongest character.",
  source="Kirkus Reviews, unsigned review of Children of Earth and Sky",url=KC,
  quote="readers finding the history to be his strongest character",page="verdict line",kind="reception",polarity="disputes",date="Kirkus review of the 2016 novel",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

KB="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/a-brightness-long-ago/"
S(title="A BRIGHTNESS LONG AGO - Kirkus Reviews",url=KB,kind="reception",substantive=True,date="Kirkus Reviews issue 15 March 2019; pub date 14 May 2019",route="direct fetch, browser user agent")
C(file='kirkus-brightness',feature="adjective and adverb discipline",
  claim="Kirkus says Kay's usual elements include prose that sometimes gets carried away with itself.",
  source="Kirkus Reviews, unsigned review of A Brightness Long Ago, issue of 15 March 2019",url=KB,
  quote="prose that sometimes gets carried away with itself",page="review body, last sentence",kind="reception",polarity="disputes",date="2019-03-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='kirkus-brightness',feature="withheld information and inference",
  claim="Kirkus says Danio's silence enables the assassination's success and sets in motion the events that carry him to the courts of the powerful.",
  source="Kirkus Reviews, unsigned review of A Brightness Long Ago, issue of 15 March 2019",url=KB,
  quote="Danio's silence enables the assassination's success",page="review body",kind="reception",polarity="asserts",date="2019-03-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

KLE="https://www.kirkusreviews.com/book-reviews/guy-gavriel-kay/lord-of-emperors/"
S(title="LORD OF EMPERORS - Kirkus Reviews",url=KLE,kind="reception",substantive=False,date="Kirkus review of the 2000 novel",route="direct fetch, browser user agent")

SFE="https://sf-encyclopedia.com/entry/kay_guy_gavriel"
S(title="SFE entry kay_guy_gavriel (named in the angle) - 404, no such entry",url=SFE,kind="analysis",substantive=False,date="checked 2026-09-06",route="direct fetch; 404")
SHK="https://strangehorizons.com/2000/20001113/kayhistory.html"
S(title="The History behind the Books (Cobb/Mohanraj companion, Strange Horizons 2000) - live URL redirects to modern front matter; Wayback offline this window",url=SHK,kind="analysis",substantive=False,date="checked 2026-09-06",route="direct fetch redirected; archive.org returned Temporarily Offline")

PW1="https://www.publishersweekly.com/9780451464972"
S(title="River of Stars by Guy Gavriel Kay - Publishers Weekly review",url=PW1,kind="reception",substantive=True,date="PW review of the Roc edition, April",route="direct fetch, browser user agent")
C(file='pw-9780451464972',feature="place and institution description",
  claim="Publishers Weekly says the culture of River of Stars is meticulously researched and recreated in powerful prose.",
  source="Publishers Weekly, unsigned review of River of Stars",url=PW1,
  quote="meticulously researched and recreated in powerful prose",page="review body, last sentence",kind="reception",polarity="asserts",date="PW review of the Roc hardcover",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

PW2="https://www.publishersweekly.com/9780451463302"
S(title="Under Heaven by Guy Gavriel Kay - Publishers Weekly review",url=PW2,kind="reception",substantive=True,date="PW review of the Roc edition, May",route="direct fetch, browser user agent")
C(file='pw-9780451463302',feature="place and institution description",
  claim="Publishers Weekly calls Under Heaven an exquisitely detailed vision of Kitan, a land much like Tang Dynasty China.",
  source="Publishers Weekly, unsigned review of Under Heaven",url=PW2,
  quote="an exquisitely detailed vision of Kitan",page="review body, first sentence",kind="reception",polarity="asserts",date="PW review of the Roc hardcover",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='pw-9780451463302',feature="place and institution description",
  claim="Publishers Weekly identifies the book's material as the complex intrigues of poets, prostitutes, ministers and soldiers.",
  source="Publishers Weekly, unsigned review of Under Heaven",url=PW2,
  quote="intrigues of poets, prostitutes, ministers, and soldiers",page="review body",kind="reception",polarity="asserts",date="PW review of the Roc hardcover",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

PW3="https://www.publishersweekly.com/978-0-451-47296-0"
S(title="Children of Earth and Sky by Guy Gavriel Kay - Publishers Weekly review",url=PW3,kind="reception",substantive=True,date="PW review of the NAL edition, May",route="direct fetch, browser user agent")
C(file='pw-978-0-451-47296-0',feature="withheld information and inference",
  claim="Publishers Weekly says Children of Earth and Sky is set in a world where nothing is as valuable as information.",
  source="Publishers Weekly, unsigned review of Children of Earth and Sky",url=PW3,
  quote="a world where nothing is as valuable as information",page="review body",kind="reception",polarity="asserts",date="PW review of the NAL hardcover",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='pw-978-0-451-47296-0',feature="place and institution description",
  claim="Publishers Weekly says the book offers an intricately detailed setting alongside marvelously believable characters.",
  source="Publishers Weekly, unsigned review of Children of Earth and Sky",url=PW3,
  quote="an intricately detailed setting, marvelously believable characters",page="review body, last sentence",kind="reception",polarity="asserts",date="PW review of the NAL hardcover",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

PW4="https://www.publishersweekly.com/9780451472984"
S(title="A Brightness Long Ago by Guy Gavriel Kay - Publishers Weekly review",url=PW4,kind="reception",substantive=True,date="PW review of the Berkley edition, May",route="direct fetch, browser user agent")
C(file='pw-9780451472984',feature="point of view and distance",
  claim="Publishers Weekly says A Brightness Long Ago is narrated primarily by Guidanio Cerra, a clever young scholar.",
  source="Publishers Weekly, unsigned review of A Brightness Long Ago",url=PW4,
  quote="Narrated primarily by Guidanio Cerra, a clever young scholar",page="review body",kind="reception",polarity="asserts",date="PW review of the Berkley hardcover",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

PW5="https://www.publishersweekly.com/978-0-451-45028-9"
S(title="Tigana by Guy Gavriel Kay - Publishers Weekly review",url=PW5,kind="reception",substantive=True,date="PW review of the Roc edition, September (1990)",route="direct fetch, browser user agent")
C(file='pw-978-0-451-45028-9',feature="place and institution description",
  claim="Publishers Weekly says Tigana brings to life a layered, pragmatic world of magic and difficult choices where brutality and beauty coexist.",
  source="Publishers Weekly, unsigned review of Tigana",url=PW5,
  quote="a layered, pragmatic world of magic and difficult choices",page="review body, first sentence",kind="reception",polarity="asserts",date="PW review of the 1990 Roc edition",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

PW6="https://www.publishersweekly.com/978-0-517-59312-7"
S(title="A Song for Arbonne by Guy Gavriel Kay - Publishers Weekly review",url=PW6,kind="reception",substantive=True,date="PW review of the Crown edition, January (1993)",route="direct fetch, browser user agent")
C(file='pw-978-0-517-59312-7',feature="other: a world a quarter-turn from ours",
  claim="Publishers Weekly says Kay creates a realm that resembles ours but is just different enough to enrich the fantasy genre.",
  source="Publishers Weekly, unsigned review of A Song for Arbonne",url=PW6,
  quote="a realm that resembles ours but is just different enough",page="review body, last sentence",kind="reception",polarity="asserts",date="PW review of the Crown edition",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

SHH="https://web.archive.org/web/20160319104019id_/http://www.strangehorizons.com/2000/20001113/kayhistory.html"
S(title="More about Guy Gavriel Kay's novels: the history behind each book - Strange Horizons companion to Cobb and Mohanraj",url=SHH,kind="analysis",substantive=True,date="published 13 November 2000; capture 19 March 2016",route="Wayback raw capture (id_), after the live URL redirected to modern front matter")
C(file='sh-kayhist-wb',feature="other: fidelity to sources with deliberate changes",
  claim="The Strange Horizons companion says Kay works closely with his historical sources but sometimes makes crucial changes in the course of events.",
  source="Christopher Cobb and Mary Anne Mohanraj (unsigned companion), 'More about Guy Gavriel Kay's novels', Strange Horizons, 13 November 2000",url=SHH,
  quote="he sometimes makes crucial changes in the course of events",page="History Intro",kind="analysis",polarity="asserts",date="2000-11-13",routeHint="Wayback raw capture 20160319104019id_",registerHint="none",confidence="high")
C(file='sh-kayhist-wb',feature="annalist voice and deep time",
  claim="The Strange Horizons companion says Kay's foreshadowings and Crispin's awareness of ruins make the Sarantine Empire at its height seem vulnerable and transitory.",
  source="Christopher Cobb and Mary Anne Mohanraj (unsigned companion), 'More about Guy Gavriel Kay's novels', Strange Horizons, 13 November 2000",url=SHH,
  quote="seem vulnerable and transitory",page="Roman Empire Background, last sentence",kind="analysis",polarity="asserts",date="2000-11-13",routeHint="Wayback raw capture 20160319104019id_",registerHint="chronicle-line",confidence="high")

ATT="https://archive.org/download/strategies-of-fantasy/strategies-of-fantasy_djvu.txt"
S(title="Brian Attebery, Strategies of Fantasy (Indiana University Press, 1992) - full OCR text",url=ATT,kind="measurement",substantive=True,date="1992 book; OCR text read 2026-09-06",route="archive.org open item, _djvu.txt downloaded whole (458,049 bytes)")
C(file=None,feature="stylometry",
  claim="Attebery's Strategies of Fantasy contains no occurrence of the string Gavriel, and none of Tigana, Fionavar, Arbonne or Al-Rassan, so the book does not discuss Guy Gavriel Kay.",
  source="Brian Attebery, Strategies of Fantasy (Indiana University Press, 1992), full OCR text counted by the finder",url=ATT,
  quote="",page="whole text, 458,049 bytes of OCR",kind="measurement",polarity="mentions",date="1992 edition, counted 2026-09-06",routeHint="archive.org open item _djvu.txt; grep -ic over the whole file",registerHint="none",confidence="high")
C(file=None,feature="stylometry",
  claim="The only occurrence of the surname Kay in Attebery's Strategies of Fantasy is an index entry for the folklorist Kay Stone at page ninety-three.",
  source="Brian Attebery, Strategies of Fantasy (Indiana University Press, 1992), index",url=ATT,
  quote="",page="index",kind="measurement",polarity="mentions",date="1992 edition, counted 2026-09-06",routeHint="archive.org open item _djvu.txt; grep -in 'Kay,'",registerHint="none",confidence="high")

SFU="http://www.sfsite.com/09b/uh328.htm"
S(title="The SF Site Featured Review: Under Heaven - a review by Dominic Cilli",url=SFU,kind="reception",substantive=True,date="copyright 2010",route="Wayback raw capture (id_) 20100927040518; sfsite.com unreachable directly from this host")
C(file='sfsite-uh-wb',feature="other: personalised history instead of names and dates",
  claim="Dominic Cilli says Under Heaven gives a history lesson where the names and dates are not tucked neatly in a row but a more personalized history.",
  source="Dominic Cilli, review of Under Heaven, SF Site, 2010",url=SFU,
  quote="names and dates are tucked neatly in a row",page="review body",kind="reception",polarity="asserts",date="2010",routeHint="Wayback raw capture 20100927040518id_",registerHint="chronicle-line",confidence="high")
C(file='sfsite-uh-wb',feature="cadence and rhythm",
  claim="Cilli says he was struck by the feel of Under Heaven, which had a very lyrical and poetic quality to it.",
  source="Dominic Cilli, review of Under Heaven, SF Site, 2010",url=SFU,
  quote="a very lyrical and poetic quality to it",page="review body, on the writing",kind="reception",polarity="asserts",date="2010",routeHint="Wayback raw capture 20100927040518id_",registerHint="none",confidence="high")

SFS="http://www.sfsite.com/02b/sail51.htm"
S(title="The SF Site: Sailing to Sarantium - a review by James Seidman",url=SFS,kind="reception",substantive=True,date="copyright 1999",route="Wayback raw capture (id_) 20241215155441")
C(file='sfs-sail',feature="place and institution description",
  claim="James Seidman says it is amazing how many varied aspects of the historical Byzantine Empire are represented in Kay's fictional Sarantine Empire.",
  source="James Seidman, review of Sailing to Sarantium, SF Site, 1999",url=SFS,
  quote="how many varied aspects of the Byzantine Empire are represented",page="review body",kind="reception",polarity="asserts",date="1999",routeHint="Wayback raw capture 20241215155441id_",registerHint="dossier-archivist",confidence="high")
C(file='sfs-sail',feature="place and institution description",
  claim="Seidman notes that among the obscure Byzantine features Kay carries over is a violent religious dispute mirroring the Arian heresy.",
  source="James Seidman, review of Sailing to Sarantium, SF Site, 1999",url=SFS,
  quote="a violent religious dispute that mirrors Christianity's Arian heresy",page="review body",kind="reception",polarity="asserts",date="1999",routeHint="Wayback raw capture 20241215155441id_",registerHint="dossier-archivist",confidence="high")

SFL="http://www.sfsite.com/05a/le80.htm"
S(title="The SF Site: Lord of Emperors - a review by Wayne MacLaurin",url=SFL,kind="reception",substantive=True,date="copyright 2000",route="Wayback raw capture (id_) 20241217193312")
C(file='sfs-le',feature="place and institution description",
  claim="Wayne MacLaurin says every character from lowliest foot-soldier to high priest is rich and complex and seldom flat or misplaced.",
  source="Wayne MacLaurin, review of Lord of Emperors, SF Site, 2000",url=SFL,
  quote="from lowliest foot-soldier to high priest",page="review body",kind="reception",polarity="asserts",date="2000",routeHint="Wayback raw capture 20241217193312id_",registerHint="dossier-archivist",confidence="high")
C(file='sfs-le',feature="place and institution description",
  claim="MacLaurin says Sarantium itself comes to life within the pages of the novel.",
  source="Wayne MacLaurin, review of Lord of Emperors, SF Site, 2000",url=SFL,
  quote="Sarantium itself comes to life within the pages",page="review body",kind="reception",polarity="asserts",date="2000",routeHint="Wayback raw capture 20241217193312id_",registerHint="dossier-archivist",confidence="high")

SFH="http://www.sfsite.com/03a/ll171.htm"
S(title="The SF Site: The Last Light of the Sun - a review by Alma A. Hromic",url=SFH,kind="reception",substantive=True,date="copyright 2004",route="Wayback raw capture (id_) 20251014060325")
C(file='sfs-ll171',feature="consequence on a household",
  claim="Alma Hromic says Kay's books convey that history is woven from the small things done by and to people who live under the cloak of great events.",
  source="Alma A. Hromic, review of The Last Light of the Sun, SF Site, 2004",url=SFH,
  quote="history is woven from the small things",page="review body",kind="reception",polarity="asserts",date="2004",routeHint="Wayback raw capture 20251014060325id_",registerHint="dossier-archivist",confidence="high")
C(file='sfs-ll171',feature="consequence on a household",
  claim="Hromic says Kay's minor characters pass through the book carrying some trace of events that have rolled across them.",
  source="Alma A. Hromic, review of The Last Light of the Sun, SF Site, 2004",url=SFH,
  quote="carry some trace of events that have rolled across them",page="review body",kind="reception",polarity="asserts",date="2004",routeHint="Wayback raw capture 20251014060325id_",registerHint="dossier-archivist",confidence="high")
C(file='sfs-ll171',feature="omission as information",
  claim="Hromic says the book gives the sense of glimpsing a few shining threads in a larger tapestry.",
  source="Alma A. Hromic, review of The Last Light of the Sun, SF Site, 2004",url=SFH,
  quote="glimpsing a few shining threads in a larger tapestry",page="review body, closing paragraph",kind="reception",polarity="asserts",date="2004",routeHint="Wayback raw capture 20251014060325id_",registerHint="dossier-archivist",confidence="high")
C(file='sfs-ll171',feature="withheld information and inference",
  claim="Hromic says there is the usual sense that more lies in the background of the story than the reader has been told.",
  source="Alma A. Hromic, review of The Last Light of the Sun, SF Site, 2004",url=SFH,
  quote="more, so much more, in the background",page="review body, closing paragraph",kind="reception",polarity="asserts",date="2004",routeHint="Wayback raw capture 20251014060325id_",registerHint="dossier-archivist",confidence="high")
C(file='sfs-ll171',feature="other: the north as a plainer register than the courts",
  claim="Hromic says Kay's northern novel visits a corner of his milieu far more raw and earthy than the rarefied decadence of Sarantium.",
  source="Alma A. Hromic, review of The Last Light of the Sun, SF Site, 2004",url=SFH,
  quote="far more raw and earthy than the rarefied decadence",page="review body",kind="reception",polarity="asserts",date="2004",routeHint="Wayback raw capture 20251014060325id_",registerHint="none",confidence="high")

LOC92="https://locusmag.com/1992/09/table-of-contents-september-1992/"
S(title="Table of Contents, September 1992 - Locus (confirms Faren Miller reviewed A Song for Arbonne, page 17)",url=LOC92,kind="relay",substantive=False,date="Locus, September 1992",route="direct fetch")

BLK="https://www.booklistonline.com/SearchResults?Keyword=Guy+Gavriel+Kay"
S(title="Booklist Online search for Guy Gavriel Kay - client-rendered, no review text served",url=BLK,kind="reception",substantive=False,date="checked 2026-09-06",route="direct fetch; page body is a JS shell (67 characters of text)")
LJK="https://www.libraryjournal.com/?searchTerm=Guy%20Gavriel%20Kay"
S(title="Library Journal search for Guy Gavriel Kay - client-rendered, no review text served",url=LJK,kind="reception",substantive=False,date="checked 2026-09-06",route="direct fetch; reviews.libraryjournal.com returns 502")
NYTS="https://www.nytimes.com/search?query=Guy%20Gavriel%20Kay"
S(title="New York Times search for Guy Gavriel Kay - 403 to this host; no NYT review cited by any Kay Wikipedia article",url=NYTS,kind="reception",substantive=False,date="checked 2026-09-06",route="direct fetch 403; Wayback CDX wildcard needs authorization; web search budget exhausted")
MEN="https://archive.org/details/rhetoricsoffanta0000mend"
S(title="Farah Mendlesohn, Rhetorics of Fantasy (2008) - lending-restricted at the Internet Archive; full text not readable",url=MEN,kind="analysis",substantive=False,date="checked 2026-09-06",route="archive.org metadata found the item; fulltext/inside.php returns Item not available; _djvu.txt 302; HathiTrust 403; Google Books API returned no totals")

RL="https://brightweavings.com/revlions/"
S(title="Reviews of The Lions of Al-Rassan - BrightWeavings reprint page (Quill & Quire, Edmonton Journal, Washington Post Book World, F&SF, SFX)",url=RL,kind="reception",substantive=True,date="page posted 2014-11-15; the five reviews date from 1995",route="direct fetch, browser user agent; found by diffing the BrightWeavings sitemap against the 153 urls already in state-kay.json")
C(file='bw2-revlions',feature="plainness and economy",
  claim="Michelle Sagara says Kay doesn't waste a word or a scene in The Lions of Al-Rassan and that there is no self-indulgent bloating.",
  source="Michelle Sagara (Michelle West), review of The Lions of Al-Rassan for Quill & Quire (reprinted BrightWeavings)",url=RL,
  quote="Kay doesn't waste a word or a scene",page="Quill & Quire review, penultimate paragraph",kind="reception",polarity="asserts",date="1995 review; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="annalist voice and deep time",
  claim="Sagara says the possibilities of civilization developed at the height of the great cities are echoed bitterly by their fall.",
  source="Michelle Sagara (Michelle West), review of The Lions of Al-Rassan for Quill & Quire (reprinted BrightWeavings)",url=RL,
  quote="are echoed bitterly by their fall",page="Quill & Quire review",kind="reception",polarity="asserts",date="1995 review; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw2-revlions',feature="withheld information and inference",
  claim="Doug Barbour says Kay creates rounded characters precisely by implying the social and psychological baggage they carry into every situation.",
  source="Doug Barbour, review of The Lions of Al-Rassan for The Edmonton Journal (reprinted BrightWeavings)",url=RL,
  quote="precisely by implying all the social, as well as psychological, baggage",page="Edmonton Journal review",kind="reception",polarity="asserts",date="1995 review; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="other: architecture of the whole narrative",
  claim="Barbour says the overarching plan of the narrative is grand but not grandiose, complex but not needlessly complicated.",
  source="Doug Barbour, review of The Lions of Al-Rassan for The Edmonton Journal (reprinted BrightWeavings)",url=RL,
  quote="grand but not grandiose, complex but not needlessly complicated",page="Edmonton Journal review",kind="reception",polarity="asserts",date="1995 review; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="place and institution description",
  claim="John H. Riskind says Kay's fantasy world has the ambience and sense of place of a fine historical novel.",
  source="John H. Riskind, 'History with a Fantasy Spin', The Washington Post Book World (reprinted BrightWeavings)",url=RL,
  quote="the ambience and sense of place of a fine historical novel",page="Washington Post Book World review",kind="reception",polarity="asserts",date="1995 review; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="metaphor discipline",
  claim="Riskind says that in Kay's recent novels the supernatural or fantastic is subdued and relatively subtle, merely providing a backdrop.",
  source="John H. Riskind, 'History with a Fantasy Spin', The Washington Post Book World (reprinted BrightWeavings)",url=RL,
  quote="subdued and relatively subtle, merely providing a backdrop",page="Washington Post Book World review",kind="reception",polarity="asserts",date="1995 review; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="civic record register",
  claim="In a passage Riskind quotes, Kay reports an event becoming legend by being retold among physicians, courts, military companies, universities, taverns and places of worship.",
  source="Guy Gavriel Kay, The Lions of Al-Rassan, quoted in John H. Riskind's Washington Post Book World review (reprinted BrightWeavings)",url=RL,
  quote="told so often among physicians, courts, military companies, in universities",page="Washington Post Book World review, quoted passage",kind="reception",polarity="asserts",date="1995 review of the 1995 novel",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw2-revlions',feature="diction (native vs latinate)",
  claim="Rob Kilheffer says Kay's contemporary outlook leads to some trouble with the tone of his prose.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="some trouble with the tone of Kay's prose",page="F&SF review",kind="reception",polarity="disputes",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="archaism",
  claim="Kilheffer names the sentence 'They had been dealt with' on the first page as a line with a distinctly contemporary feel.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="a line with a distinctly contemporary feel",page="F&SF review",kind="reception",polarity="disputes",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="diction (native vs latinate)",
  claim="Kilheffer says Kay mostly has the tone down well but every now and then his ear is a little off.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="every now and then his ear is a little off",page="F&SF review",kind="reception",polarity="disputes",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="civic record register",
  claim="Kilheffer praises a scene in which King Ramiro converts his role using a reliance on written law and formal court hearings, general taxation and building projects.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="a reliance on written law and formal court hearings",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="naming and forms of address",
  claim="Kilheffer notes Kay shows the characteristic mangling of Asharite names in the mouths of Jaddites, ibn Musa becoming Abenmuza.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="mangling of Arabic (Asharite) names in the mouths of Europeans",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="withheld information and inference",
  claim="Kilheffer says Kay is overly fond of withholding information from the reader longer than might seem natural.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="withholding information from the reader longer than might seem natural",page="F&SF review",kind="reception",polarity="disputes",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="omission as information",
  claim="Kilheffer says Kay leaves the show-duel off-stage and lets the reader glean what is known of it from scattered offhand references thereafter.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="glean what we know of it from scattered offhand references",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="omission as information",
  claim="Kilheffer says that by so conspicuously leaving the action out Kay draws the reader's attention to the event more strongly than showing it entire.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="by so conspicuously leaving the action out",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="dialogue register",
  claim="Kilheffer says Kay is exceedingly adept at staging taut verbal exchanges, from courtly politicking to flirtatious innuendo.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="exceedingly adept at staging taut verbal exchanges",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="point of view and distance",
  claim="Kilheffer says Kay handles the multiple viewpoints skilfully and uses them to add complexity to the world and the plot.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="Kay handles these multiple viewpoints skilfully",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw2-revlions',feature="consequence on a household",
  claim="Rob Kilheffer says there are no disposable people in The Lions of Al-Rassan, no fodder for the swords of the heroes.",
  source="Rob Kilheffer, review of The Lions of Al-Rassan for Fantasy & Science Fiction (reprinted BrightWeavings)",url=RL,
  quote="there are no disposable people here",page="F&SF review",kind="reception",polarity="asserts",date="copyright 1995 Mercury Press; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="plainness and economy",
  claim="Dave Langford says that instead of prolonged generalized battle scenes Kay indicates the horror of war and tyranny in short, sharp scenes of atrocity.",
  source="Dave Langford, review of The Lions of Al-Rassan for SFX Magazine (reprinted BrightWeavings)",url=RL,
  quote="in short, sharp scenes of atrocity",page="SFX review",kind="reception",polarity="asserts",date="copyright 1995 Dave Langford; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw2-revlions',feature="point of view and distance",
  claim="Langford says Kay's attention is always on individuals.",
  source="Dave Langford, review of The Lions of Al-Rassan for SFX Magazine (reprinted BrightWeavings)",url=RL,
  quote="His attention is always on individuals",page="SFX review",kind="reception",polarity="asserts",date="copyright 1995 Dave Langford; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")

LB="https://brightweavings.com/leatherboundtiganaintro/"
S(title="Tigana (leather bound intro) - BrightWeavings stub quoting The Encyclopedia of Fantasy on Kay",url=LB,kind="relay",substantive=True,date="page posted 2014-11-15; the introduction is to the Leather-Bound Masterpieces of Fantasy edition of Tigana",route="direct fetch, browser user agent; the only reachable trace of the Encyclopedia of Fantasy entry, the sf-encyclopedia.com /fe/ namespace being 404")
C(file='bw2-leatherboundtiganaintro',feature="other: apprenticeship on The Silmarillion",
  claim="The Encyclopedia of Fantasy, as quoted on this page, says of Kay's work on The Silmarillion that he seems to have learned from the experience.",
  source="Wikipedia-style relay: BrightWeavings quoting The Encyclopedia of Fantasy (attributed on the page to Peter Kuzca)",url=LB,
  quote="seems to have learned from the experience",page="introduction, first paragraph",kind="relay",polarity="asserts",date="quoted from the 1997 Encyclopedia of Fantasy; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="low: the page is a truncated stub and its attribution to 'Peter Kuzca' is unverified against the printed encyclopedia")

WOD="https://brightweavings.com/reviews-of-written-on-the-dark/"
S(title="Reviews of Written on the Dark - BrightWeavings link index",url=WOD,kind="reception",substantive=False,date="posted 2025-06-09",route="direct fetch")
BWSCH="https://brightweavings.com/faire-ladies-re-imagined-female-characters-in-guy-gavriel-kays-a-song-for-arbonne-by-sylwia-borowska-szerszun/"
S(title="Faire Ladies Re-imagined: Female Characters in Guy Gavriel Kay's A Song for Arbonne - Sylwia Borowska-Szerszun (BrightWeavings abstract)",url=BWSCH,kind="analysis",substantive=False,date="page posted on BrightWeavings",route="direct fetch; the page carries only an abstract, not the article")

RS="https://brightweavings.com/revsarantium/"
S(title="Reviews of the Sarantine Mosaic - BrightWeavings reprint page (includes Jo Walton's Tor.com reread and Bill Sheehan for Barnes & Noble)",url=RS,kind="reception",substantive=True,date="page posted 2014-11-15; Walton's review first appeared at tor.com",route="direct fetch, browser user agent; found by diffing the BrightWeavings sitemap against state-kay.json")
C(file='bw3-revsarantium',feature="point of view and distance",
  claim="Jo Walton calls the Sarantine Mosaic's style an odd, distanced, elegaic style that she wants to call veiled omniscient.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="an odd, distanced, elegaic style that I want to call",page="Walton review, paragraph beginning These are weird books",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revsarantium',feature="point of view and distance",
  claim="Walton says the omniscient narrator knows what will happen and what everyone thinks but does not like to approach too closely.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="but doesn't like to approach too closely",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revsarantium',feature="omission as information",
  claim="Walton says of Kay's narrator that he draws and lifts veils.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="He draws and lifts veils",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revsarantium',feature="withheld information and inference",
  claim="Walton dislikes Kay's trick of describing a character without saying who it is, and says she hates it when Dorothy Dunnett does it too.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="he described but doesn't say who is who",page="Walton review",kind="reception",polarity="disputes",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw3-revsarantium',feature="point of view and distance",
  claim="Walton says there is a sense that we are always looking through the wrong end of the telescope, that these people are far away.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="looking through the wrong end of the telescope",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revsarantium',feature="point of view and distance",
  claim="Walton says the distanced manner sometimes makes for very beautiful writing but that there is always a pulling back.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="but there's always a pulling back",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revsarantium',feature="concrete sensory noun",
  claim="Jo Walton says the physical details of the Sarantine Mosaic are all real enough to bite.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="The details are all real enough to bite",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw3-revsarantium',feature="place and institution description",
  claim="Walton says the details are right for sixth century Byzantium and that even where Kay has made them up they feel right.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="even where he's made them up they feel right",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw3-revsarantium',feature="place and institution description",
  claim="Walton says Kay mediates the world through the chariot races and the making of mosaics and often describes it in those terms.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="mediates the world through the chariot races and the making",page="Walton review",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw3-revsarantium',feature="other: pluperfect tense density",
  claim="Walton says there is more use of the pluperfect tense in these two books than in anything else she can think of.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="more use of the pluperfect tense in these than anything",page="Walton review, on pacing",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revsarantium',feature="point of view and distance",
  claim="Walton says a chariot race is seen from the point of view of a driver, someone in the crowd, and an undercook for the Blue faction making soup.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="an undercook for the Blue faction making soup",page="Walton review, on pacing",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw3-revsarantium',feature="metaphor discipline",
  claim="Walton says the small amount of magic runs glinting through everything else like the silver threads in shot silk.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="like the silver threads in shot silk",page="Walton review, closing",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
C(file='bw3-revsarantium',feature="other: naming that does not hide its original",
  claim="Walton says Kay is not trying to hide that Sarantium is Byzantium, Varena is Ravenna, Valerius is Justinian and Pertennius is Procopius.",
  source="Jo Walton, reread of the Sarantine Mosaic (originally Tor.com, reprinted BrightWeavings)",url=RS,
  quote="Kay isn't trying to hide the fact that Sarantium is Byzantium",page="Walton review, opening",kind="reception",polarity="asserts",date="page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")

RLL="https://brightweavings.com/revlastlight/"
S(title="Reviews of The Last Light of the Sun - BrightWeavings reprint page (Challenging Destiny; Cheryl Morgan for Emerald City)",url=RLL,kind="reception",substantive=True,date="page posted 2014-11-15; Morgan's review is of the 2004 novel",route="direct fetch, browser user agent")
C(file='bw3-revlastlight',feature="place and institution description",
  claim="Cheryl Morgan says the bulk of The Last Light of the Sun is about people and about a developing society.",
  source="Cheryl Morgan, review of The Last Light of the Sun, Emerald City (reprinted BrightWeavings)",url=RLL,
  quote="and about a developing society",page="Morgan review, later section",kind="reception",polarity="asserts",date="review of the 2004 novel; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="dossier-archivist",confidence="high")
C(file='bw3-revlastlight',feature="annalist voice and deep time",
  claim="Morgan says the title refers not only to the sun setting on the lands of the Cyngael but to the sun setting on a whole lifestyle.",
  source="Cheryl Morgan, review of The Last Light of the Sun, Emerald City (reprinted BrightWeavings)",url=RLL,
  quote="the sun setting on a whole lifestyle",page="Morgan review, later section",kind="reception",polarity="asserts",date="review of the 2004 novel; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="chronicle-line",confidence="high")
C(file='bw3-revlastlight',feature="per-speaker register",
  claim="In a passage Morgan reproduces, Kay marks a fairy's antiquity by having a character notice that she speaks Cyngael the way his grandfather had.",
  source="Guy Gavriel Kay, The Last Light of the Sun, quoted in Cheryl Morgan's Emerald City review (reprinted BrightWeavings)",url=RLL,
  quote="She spoke Cyngael the way his grandfather had",page="Morgan review, block quotation",kind="reception",polarity="asserts",date="2004 novel; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="herald-pools",confidence="high")

RAB="https://brightweavings.com/revarbonne/"
S(title="Reviews of A Song for Arbonne - BrightWeavings reprint page (Douglas Barbour, 'Fantasy from on High', Books in Canada)",url=RAB,kind="reception",substantive=True,date="page posted 2014-11-15; Barbour's review is of the 1992 novel",route="direct fetch, browser user agent")
C(file='bw3-revarbonne',feature="other: refusal to repeat a previous book",
  claim="Douglas Barbour says what makes Kay the most interesting writer of high fantasy is his willingness and ability to explore new territory in each new book.",
  source="Douglas Barbour, 'Fantasy from on High', Books in Canada (reprinted BrightWeavings)",url=RAB,
  quote="explore new territory in each new book",page="Books in Canada review, first sentence",kind="reception",polarity="asserts",date="review of the 1992 novel; page posted 2014-11-15",routeHint="direct fetch with browser user agent",registerHint="none",confidence="high")
