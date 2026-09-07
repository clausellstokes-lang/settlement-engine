U='http://lists.urth.net/pipermail/urth-urth.net/2006-September/%s.html'
WB='Wayback raw capture (web.archive.org/web/2021id_/)'
_u=[('002913','Jon Capps',False),('002914',"'nastler'",False),('002916','powens',False),('002917',"'HHR'",True),
 ('002918','Rex Lycanthrosaurus',True),('002919',"'b sharp'",True),('002920','Tony Ellis',True),('002921','Rex Lycanthrosaurus',True),
 ('002923',"Dan'l Danehy-Oakes",False),('002924',"Dan'l Danehy-Oakes",False),('002925',"Dan'l Danehy-Oakes",True),
 ('002926','Roy C. Lackey',True),('002927','Roy C. Lackey',True),('002929',"Dan'l Danehy-Oakes",False),
 ('002932','Jon Capps',False),('002936',"'nastler'",True),('002937','Roy C. Lackey',False),('002938',"'nastler'",True),
 ('002945',"Dan'l Danehy-Oakes",False),('002950','Tony Ellis',False),('002954',"Dan'l Danehy-Oakes",False),
 ('002972',"Dan'l Danehy-Oakes",True),('002977','Sarah Dorrance-Minch',True),('002983','Roy C. Lackey',True),
 ('002985',"'stilskin' (Paul)",True),('002986','Mo Holkar',False),('002988','Daniel D Jones',True),
 ('002989','David Duffy',False),('002993','Chris Mulder',False),('002995','Robin Hankin',True),
 ('003008',"'b sharp'",True),('003009',"Dan'l Danehy-Oakes",True),('058579','Wesley Parsons',False),('058600','Jack Redelfs',True)]
SOURCES=[dict(title="(urth) Close Reading: Torturer — %s, Urth mailing list, September 2006 (message %s)"%(who,n),
              url=U%n, kind="reader", substantive=sub, date="2006-09", route=WB) for n,who,sub in _u]
SOURCES += [
 dict(title="Basic analysis of word and sentence structure in The Shadow of the Torturer, chapter 1 — u/5777777777, r/genewolfe",
      url="https://www.reddit.com/r/genewolfe/comments/lq6c8t/basic_analysis_of_word_and_sentence_structure_in/",
      kind="measurement", substantive=True, date="2021-02-23",
      route="reddit search RSS (www.reddit.com HTML and .json are 403 from here)"),
 dict(title="Anyone else notice an abrupt shift in style from The Sword of Lictor onwards? — u/MelancholyNightmare, r/genewolfe",
      url="https://www.reddit.com/r/genewolfe/comments/1hsijpa/anyone_else_notice_an_abrupt_shift_in_style_from/",
      kind="reader", substantive=True, date="2025-01-03", route="reddit search RSS"),
 dict(title="Notes Toward an Analysis of the Book of The New Sun — u/WaysofReading, r/genewolfe",
      url="https://www.reddit.com/r/genewolfe/comments/1et7cug/notes_toward_an_analysis_of_the_book_of_the_new/",
      kind="analysis", substantive=True, date="2024-08-15", route="reddit search RSS"),
 dict(title="r/genewolfe top posts of all time (Atom feed)", url="https://www.reddit.com/r/genewolfe/top/.rss?t=all",
      kind="reader", substantive=False, date="2026-09-06", route="reddit RSS"),
 dict(title="The Book of the New Sun is the Dark Souls of Books — C.W. Howell", url="https://www.cwhowell.com/the-book-of-the-new-sun-is-the-dark-souls-of-books/",
      kind="analysis", substantive=True, date="2023", route="live site, browser user agent"),
 dict(title="The Fifth Head of Cerberus: Notes on a Neglected Masterpiece — C.W. Howell", url="https://www.cwhowell.com/the-fifth-head-of-cerberus-notes-on-a-neglected-masterpiece/",
      kind="analysis", substantive=True, date="2024", route="live site, browser user agent"),
]
