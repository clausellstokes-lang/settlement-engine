CL=[]
def C(**k):
    k.setdefault('confidence','high'); k.setdefault('registerHint','none'); k.setdefault('kind','reader')
    k.setdefault('routeHint','reddit RSS route: append /.rss?limit=100 to the thread URL'); CL.append(k)
P='https://www.reddit.com/r/genewolfe/comments/rpsv1l/i_think_im_getting_better_at_writing_in_wolfes/'
C(feature='cadence and rhythm',url=P,source="u/5777777777, r/genewolfe, 'I think I'm getting better at writing in Wolfe's style', 2021-12-27",
  date='2021-12-27',page='opening post',
  claim="A reader who spent a year reverse-engineering the style names its targets as a contemplative, digressive manner with a fondness for jokes and little stories.",
  quote="contemplative, digressive style, and the same fondness for jokes", polarity='applies', registerHint='dossier-archivist')
C(feature='withheld information and inference',url=P,source="u/5777777777, r/genewolfe, 2021-12-27",date='2021-12-27',page='reply to u/wertion',
  claim="The same reader judges his own pastiche a failure because there is little below its obvious surface meaning, so it is not worth rereading.",
  quote="not a lot on this page below the obvious surface meaning", polarity='asserts', registerHint='dossier-archivist')
C(feature='per-speaker register',url=P,source="u/capn_flume, r/genewolfe, comment on 'I think I'm getting better at writing in Wolfe's style', 2021-12-27",
  date='2021-12-27',page='comment',
  claim="A reader judges the imitation mannered and arch, and contrasts it with the ring of authenticity Wolfe gets in each character.",
  quote="It comes across as very mannered and arch", polarity='disputes', registerHint='herald-pools')
C(feature='adjective and adverb discipline',url=P,source="u/Mummelpuffin, r/genewolfe, comment on the same thread, 2021-12-27",
  date='2021-12-27',page='comment with a rewritten passage',
  claim="A reader rewriting the pastiche names unnecessary adjectives and commas as the worst offenders in first drafts.",
  quote="The worst offenders in first drafts are usually adjectives and commas", polarity='asserts')
C(feature='archaism',url=P,source="u/5777777777, r/genewolfe, 2021-12-27",date='2021-12-27',page='reply to u/Mummelpuffin',
  claim="The pastiche writer names his own failure mode as bland modern writing wearing a superficial old-fashioned sound, and plans to read early memoir-form books instead.",
  quote="into just bland modern writing with a superficial", polarity='asserts', registerHint='dossier-archivist')
T='https://www.reddit.com/r/genewolfe/comments/frv3k7/a_touching_moment_in_chapter_13_of_the_shadow_of/'
C(feature='place and institution description',url=T,source="u/thecomicguybook, r/genewolfe, 'A touching moment in Chapter 13 of The Shadow of the Torturer', 2020-03-30",
  date='2020-03-30',page='opening post',
  claim="A first-time reader reports the torturers' guild behaving like any other bureaucratic institution when it closes ranks over a scandal.",
  quote="guild act like any other bureaucratic institution", polarity='asserts', registerHint='dossier-archivist')
C(feature='civic record register',url=T,source="u/thecomicguybook, r/genewolfe, 2020-04-03",date='2020-04-03',page='comment',
  claim="The same reader describes the guild as matter of fact about servicing its clients.",
  quote="matter of fact about servicing their clients", polarity='asserts', registerHint='dossier-archivist')
C(feature='withheld information and inference',url=T,source="u/mummifiedstalin, a host of the ReReading Wolfe podcast, r/genewolfe, 2020-03-31",
  date='2020-03-31',page='comment',
  claim="A host of the ReReading Wolfe podcast says a first reader has already passed things he did not know were important, which is why the podcast is built on rereading.",
  quote="even know were important and have probably", polarity='asserts', registerHint='dossier-archivist')
C(feature='point of view and distance',url=T,source="u/mummifiedstalin, a host of the ReReading Wolfe podcast, r/genewolfe, 2020-03-30",
  date='2020-03-30',page='comment',
  claim="The same host describes the Alzabo Soup podcast's method as holding that the reader should be skeptical of the narration.",
  quote="you should be skeptical of his narration", polarity='asserts')
I='https://www.reddit.com/r/genewolfe/comments/kscbvl/interlibrary_loanthe_case_against_the_out_of/'
C(feature='counter-evidence',url=I,source="u/Holly-Crystal-Hawks, r/genewolfe, 'Interlibrary Loan--The Case Against the Out of Order Theory', 2021-01-07",
  date='2021-01-07',page='opening post',
  claim="A close reader argues against reading every anomaly in a late novel as a plant, proposing instead that some clues fell behind the desk in a rushed production.",
  quote="let a few clues fall behind the desk", polarity='disputes')
C(feature='other: falsification test for a planted clue',url=I,source="u/Holly-Crystal-Hawks, r/genewolfe, 2021-01-07",
  date='2021-01-07',page='opening post',
  claim="She proposes a test: a genuine planted clue would be present in every edition, so a discrepancy that appears only in the audiobook is a production error.",
  quote="they would be universal across all versions", polarity='applies')
C(feature='other: physical object as evidence',url=I,source="Marc Aramini (u/aramini), r/genewolfe, comment on the same thread, 2021-01-08",
  date='2021-01-08',page='comment',
  claim="Aramini reads a physical detail — a map torn from one book and pushed into another the wrong way round — as evidence in the puzzle.",
  quote="The map was torn out of a book and shoved into another", polarity='applies', registerHint='dossier-archivist')
N='https://www.reddit.com/r/genewolfe/comments/oof804/names_corridors_windows_and_doors_the_sorcerers/'
C(feature='naming and forms of address',url=N,source="u/Holly-Crystal-Hawks, r/genewolfe, 'Names, Corridors, Windows, and Doors', 2021-07-26",
  date='2021-07-26',page='comment listing four quoted passages with page numbers',
  claim="A reader tracks a repeated self-introduction formula about the spelling of a name across four late novels, and notes that only in the last is the letter capitalised.",
  quote="always capitalizes his use", polarity='applies', registerHint='dossier-archivist')
NO='https://www.reddit.com/r/genewolfe/comments/1et7cug/notes_toward_an_analysis_of_the_book_of_the_new/'
C(feature='point of view and distance',url=NO,source="u/WaysofReading, r/genewolfe, 'Notes Toward an Analysis of the Book of The New Sun', 2024-08-15",
  date='2024-08-15',page='opening post',
  claim="A reader places Severian in the line of unreliable narrative voices running through Moby-Dick, Ulysses and Lolita.",
  quote="unreliable narrative voices and characters in Moby-Dick, Ulysses, and Lolita", polarity='asserts')
C(feature='per-speaker register',url=NO,source="u/PatrickMcEvoyHalston, r/genewolfe, comment, 2024-08-19",date='2024-08-19',page='comment',
  claim="A reader argues that the absorbed personalities never produce a hybrid voice; the reader senses only the one narrator.",
  quote="We never sense a hybrid; just Severian", polarity='disputes')
C(feature='place and institution description',url=NO,source="u/kuenjato, r/genewolfe, comment, 2024-08-18",date='2024-08-18',page='comment',
  claim="A reader likens the structure to games whose story is carried by clues found in architecture and in brief item descriptions.",
  quote="with clues found in architecture, visual clues as well as brief item descriptions", polarity='asserts',
  registerHint='dossier-archivist')
