import json, os, sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
exec(open('mk-srd-found.py').read().split("sources=[")[0])   # reuse claim builder + first 42 claims

U1717='https://www.dndbeyond.com/posts/1717-2024-core-rulebooks-to-expand-the-srd'
U1949='https://www.dndbeyond.com/posts/1949-you-can-now-publish-your-own-creations-using-the'
UMERWIN='https://www.dndbeyond.com/posts/625-lets-design-an-adventure-boxed-text'
USR='https://screenrant.com/dnd-2024-dungeon-master-guide-interview-perkins-wyatt/'
UDMSW='https://dmsworkshop.com/2019/09/27/dm-101-boxed-text-mastering/'
UFORUM='https://www.dndbeyond.com/forums/d-d-beyond-general/general-discussion/219273-official-srd-5-2-discussion-thread-srd-5-2-1-now?page=3'
U5TH='https://5thsrd.org/adventuring/planes_of_existence/'
UTRIB='https://www.tribality.com/2025/04/23/dd-system-reference-document-v5-2/'
RC='curl with a browser user agent; body present in the served HTML'

A=claims.append
# --- the 2024 replacement for environment description
A(c('place and institution description',
 'The "Environmental Effects" section added to SRD 5.2.1 (p. 195) describes environments only as numeric thresholds: it carries 44.92 numerals per 1,000 words and 44.44 percent of its sentences contain a digit.',
 M52,U52,'When the temperature is 0 degrees Fahrenheit or lower','SRD 5.2.1 p. 195 (512 words, 27 sentences)','measurement','asserts','2026-09-06',R,'dm-page','high'))
A(c('other: digits in prose',
 'Numeral density separates the two kinds of SRD place text by a factor with no overlap: 0.00 per 1,000 words in the deleted place appendix of SRD 5.1 against 44.92 per 1,000 words in the Environmental Effects section of SRD 5.2.1.',
 M51+' and '+M52,U52,'','SRD 5.1 pp. 363-365 against SRD 5.2.1 p. 195','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('dm-facing sentence',
 'The Environmental Effects section of SRD 5.2.1 uses no second-person pronoun and no em dash across its 27 sentences.',
 M52,U52,'','SRD 5.2.1 p. 195','measurement','asserts','2026-09-06',R,'dm-page','high'))

# --- the pantheon prose (institutions)
A(c('place and institution description',
 'SRD 5.1 Appendix PH-B carries 550 words of institution-describing prose about four pantheons, in 5 paragraphs and 22 sentences, the only institutional prose in either SRD.',
 M51,U51,'Appendix PH-B: Fantasy-Historical Pantheons','SRD 5.1 p. 360','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('sentence length variation',
 'That pantheon prose has a mean sentence length of 25.0 words with a population standard deviation of 12.0 words, its longest sentence running 54 words.',
 M51,U51,'','SRD 5.1 p. 360','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('sentence length variation',
 '27.27 percent of the sentences in the SRD 5.1 pantheon prose exceed 30 words, against 11.11 percent in the planes appendix.',
 M51,U51,'','SRD 5.1 p. 360 against pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('point of view and distance',
 'The SRD 5.1 pantheon prose contains no second-person pronoun and no digit across its 550 words.',
 M51,U51,'','SRD 5.1 p. 360','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('place and institution description',
 'The SRD 5.1 pantheon prose describes a people by its landscape, opening the Norse entry on a place clause rather than on a deity.',
 M51,U51,'Where the land plummets from the snowy hills into the icy fjords','SRD 5.1 p. 360, The Norse Pantheon','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))

# --- vendor: lore excluded by policy
A(c('edition and house style',
 'Wizards of the Coast announced a year before release that SRD 5.2 would not include lore references.',
 'Wizards of the Coast / DND Staff, "2024 Core Rulebooks to Expand the SRD", D&D Beyond',U1717,
 'It will not, however, include lore references.','post of May 6, 2024','vendor','asserts','2024-05-06',RC,'none','high'))
A(c('edition and house style',
 'Wizards of the Coast directs creators who want to write inside a D&D setting to DMsGuild rather than to the SRD.',
 'Wizards of the Coast / DND Staff, "2024 Core Rulebooks to Expand the SRD", D&D Beyond',U1717,
 'If you want to create content within the settings of Dungeons','post of May 6, 2024','vendor','asserts','2024-05-06',RC,'none','high'))
A(c('edition and house style',
 'Wizards of the Coast describes the SRD as containing the base game rules, naming the rules glossary, weapon mastery properties and exploration mechanics as its content.',
 'Wizards of the Coast / DND Staff, "You Can Now Publish Your Own Creations Using the New Core Rules", D&D Beyond',U1949,
 'such as the rules glossary, weapon mastery properties, and exploration mechanics','post of May 27, 2025','vendor','asserts','2025-05-27',RC,'none','high'))

# --- the read-aloud form belongs elsewhere
A(c('boxed text form',
 'James Wyatt says the 2024 Dungeon Master’s Guide now defines boxed text, so published adventures need not keep doing so.',
 'James Wyatt, quoted by Ben Brosofsky, ScreenRant interview with Christopher Perkins and James Wyatt',USR,
 'Now the DMG tells you what boxed text is','ScreenRant, 25 October 2024','own-words','asserts','2024-10-25',RC,'dossier-archivist','high'))
A(c('boxed text form',
 'Dungeon Master’s Workshop dates the introduction of boxed text to the 1979 module The Hidden Shrine of Tamoachan, written so that competing tables received identical room descriptions.',
 'The Archmage, "Dungeon Mastering 101: Mastering the Boxed Text", Dungeon Master’s Workshop',UDMSW,
 'ever since boxed text was introduced in The Hidden Shrine of Tamoachan','post of 27 September 2019','analysis','asserts','2019-09-27',RC,'dossier-archivist','medium; a community history, not a primary bibliographic source'))
A(c('terminology consistency',
 'Shawn Merwin tells adventure writers to avoid using D&D’s mechanical terms in their ordinary senses inside boxed text.',
 'Shawn Merwin, "Let’s Design an Adventure: Boxed Text", D&D Beyond',UMERWIN,
 'Avoid game mechanical terms used in a non-mechanical way','tip 6, article of 6 November 2019','analysis','asserts','2019-11-06',RC,'dossier-archivist','high'))

# --- reception / control
A(c('edition and house style',
 'A reader on the official D&D Beyond forum states that the planes-of-existence section has been removed from SRD 5.2 while the plane names survive inside the rules.',
 'Forum user SteelfistBrave1, "Official SRD 5.2 Discussion Thread", D&D Beyond forums',UFORUM,
 'the section about the planes of existence has been removed','post #51, 24 April 2025','reader','asserts','2025-04-24',RC,'none','medium; one reader post, cited only as corroboration'))
A(c('stylometry',
 'The independent Creative Commons rendering of SRD 5.1 at 5thsrd.org carries the planes-appendix sentences word for word as extracted from the PDF, confirming the extraction the figures rest on.',
 '5thSRD, "The Planes of Existence" (community CC-BY rendering of SRD 5.1)',U5TH,
 'It is a great, silvery sea, the same above and below','The Planes of Existence, Transitive Planes','relay','asserts','2026-09-06',RC,'none','high'))

sources=[
 dict(title='System Reference Document 5.1 (CC-BY-4.0 edition), Wizards of the Coast',url=U51,kind='primary',substantive=True,date='2023',route='direct PDF download with a browser UA; 403 pages; pdftotext extraction'),
 dict(title='System Reference Document 5.2.1 (CC-BY-4.0), Wizards of the Coast',url=U52,kind='primary',substantive=True,date='2025-05-01',route='direct PDF download with a browser UA; 364 pages; pdftotext extraction'),
 dict(title='System Reference Document (SRD) page, Wizards of the Coast / D&D Beyond (SRD 5.2 FAQ)',url=UWEB,kind='vendor',substantive=True,date='2026-03-02',route='curl browser UA; dnd.wizards.com redirects to www.dndbeyond.com/srd'),
 dict(title='Converting to System Reference Document 5.2.1, Wizards of the Coast',url=UCONV,kind='vendor',substantive=True,date='2025-05-27',route='direct PDF download with a browser UA'),
 dict(title='D&D Basic Rules v1.0 (November 2018), Wizards of the Coast',url=UBR,kind='primary',substantive=True,date='2018-11',route='direct PDF download with a browser UA'),
 dict(title='2024 Core Rulebooks to Expand the SRD — DND Staff, D&D Beyond',url=U1717,kind='vendor',substantive=True,date='2024-05-06',route='curl browser UA; body in served HTML'),
 dict(title='You Can Now Publish Your Own Creations Using the New Core Rules — DND Staff, D&D Beyond',url=U1949,kind='vendor',substantive=True,date='2025-05-27',route='curl browser UA; body in served HTML'),
 dict(title='Let’s Design an Adventure: Boxed Text — Shawn Merwin, D&D Beyond',url=UMERWIN,kind='analysis',substantive=True,date='2019-11-06',route='curl browser UA; body in served HTML'),
 dict(title='“Everything In There Better Be Cracking On Topic”: D&D Designers Talk The 2024 Dungeon Master’s Guide — Ben Brosofsky, ScreenRant',url=USR,kind='own-words',substantive=True,date='2024-10-25',route='curl browser UA'),
 dict(title='Dungeon Mastering 101: Mastering the Boxed Text — The Archmage, Dungeon Master’s Workshop',url=UDMSW,kind='analysis',substantive=True,date='2019-09-27',route='curl browser UA'),
 dict(title='Official SRD 5.2 Discussion Thread, page 3 — D&D Beyond forums',url=UFORUM,kind='reader',substantive=True,date='2025-04-24',route='curl browser UA'),
 dict(title='The Planes of Existence — 5thSRD community rendering of SRD 5.1',url=U5TH,kind='relay',substantive=True,date='2026-09-06',route='curl browser UA; used only as an extraction control'),
 dict(title='D&D — System Reference Document v5.2 — Tribality',url=UTRIB,kind='relay',substantive=False,date='2025-04-23',route='curl browser UA; reprints the WotC FAQ verbatim, adds no independent analysis'),
]
cov=('Named roster (SRD 5.1 and SRD 5.2.1) fetched raw as PDFs and measured in full; nothing in the named roster '
 'was not found or blocked. 13 sources read, 12 substantive: 5 primaries/vendor documents fetched direct '
 '(both SRD PDFs, the WotC SRD page and its 5.2 FAQ, the official conversion guide, the 2018 Basic Rules PDF), '
 '4 by bibliography chasing off the SRD page and its FAQ (the two D&D Beyond studio posts, the conversion '
 'guide, the forum thread), 3 by lateral search (Merwin on boxed text, the ScreenRant designer interview, '
 'Dungeon Master’s Workshop), 1 as an extraction control (5thsrd.org); Tribality read and rejected as a '
 'verbatim reprint of the WotC FAQ. The SRD contains no read-aloud text, no settlement tables and no civic-record '
 'vocabulary, so the measured place corpus is small by nature: 1,530 words in SRD 5.1 Appendix PH-C plus 550 '
 'words of pantheon prose, both of which SRD 5.2.1 deletes.')
out=dict(complete=True, coverage=cov, sourcesRead=sources, claims=claims)
json.dump(out,open(os.path.join(D,'found-dnd-place-srd-measure.json'),'w'),indent=1)
print('claims',len(claims),'sources',len(sources))
