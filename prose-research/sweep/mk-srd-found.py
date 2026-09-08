import json, os
D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
U51='https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf'
U52='https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf'
UWEB='https://dnd.wizards.com/resources/systems-reference-document'
UCONV='https://media.dndbeyond.com/compendium-images/srd/guide/converting-to-srd-5.2.1.pdf'
UBR='https://media.wizards.com/2018/dnd/downloads/DnD_BasicRules_2018.pdf'
M51='Finder measurement over SRD 5.1 (Wizards of the Coast, CC-BY-4.0, 403 pp.), pdftotext extraction'
M52='Finder measurement over SRD 5.2.1 (Wizards of the Coast, CC-BY-4.0, 364 pp.), pdftotext extraction'
MBR='Finder measurement over D&D Basic Rules v1.0 (Wizards of the Coast, Nov 2018), pdftotext extraction'
VEN='Wizards of the Coast / D&D Beyond, "System Reference Document" page, last updated March 02, 2026'
CONV='Wizards of the Coast, "Converting to System Reference Document 5.2.1" (published May 27, 2025)'
R='pdftotext -enc UTF-8 on the PDF fetched with a browser user agent'
RW='curl with a browser user agent; dnd.wizards.com/resources/systems-reference-document redirects to www.dndbeyond.com/srd'

def c(feature,claim,source,url,quote,page,kind,polarity,date,routeHint,registerHint,confidence,modelEra=''):
    d=dict(feature=feature,claim=claim,source=source,url=url,quote=quote,page=page,kind=kind,
           polarity=polarity,date=date,routeHint=routeHint,registerHint=registerHint,confidence=confidence)
    if modelEra: d['modelEra']=modelEra
    return d

claims=[]
A=claims.append

# ---------- the place corpus itself ----------
A(c('place and institution description',
 'SRD 5.1 Appendix PH-C "The Planes of Existence" (pp. 363-365) is the only sustained place-describing prose in the document, and measures 1,530 words across 9 paragraphs and 72 sentences.',
 M51,U51,'Appendix PH-C: The Planes of Existence','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('sentence length variation',
 'Across SRD 5.1 Appendix PH-C the mean sentence length is 21.2 words with a population standard deviation of 7.5 words.',
 M51,U51,'','pp. 363-365 (72 sentences, 1,530 words)','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('sentence length variation',
 'No sentence in SRD 5.1 Appendix PH-C is shorter than 8 words (shortest 8, longest 41; p10 11, p50 21, p90 30).',
 M51,U51,'','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('sentence length variation',
 '11.11 percent of the sentences in SRD 5.1 Appendix PH-C exceed 30 words.',
 M51,U51,'','pp. 363-365 (8 of 72 sentences)','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: digits in prose',
 'SRD 5.1 Appendix PH-C contains zero digit characters across its 1,530 words.',
 M51,U51,'','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: digits in prose',
 'Every number in SRD 5.1 Appendix PH-C is spelled in words, including "sixteen planes" and "from the first layer to the ninth".',
 M51,U51,'from the first layer to the ninth','p. 364, Outer Planes','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: paragraph length',
 'SRD 5.1 Appendix PH-C averages 8.00 sentences per paragraph (72 sentences in 9 paragraphs).',
 M51,U51,'','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('point of view and distance',
 'Exactly one of the 72 sentences of SRD 5.1 Appendix PH-C uses the second person, and it stands in the opening paragraph.',
 M51,U51,'you might walk on streets made of solid fire','p. 363, opening','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('point of view and distance',
 'The second-person token rate of SRD 5.1 Appendix PH-C is 1.96 per 1,000 words against 38.50 per 1,000 words in the SRD 5.1 rules pages 77-85 measured the same way.',
 M51,U51,'','pp. 363-365 vs pp. 77-85','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('punctuation tics',
 'SRD 5.1 Appendix PH-C contains 7 em dashes, a rate of 4.58 per 1,000 words, against 2.23 per 1,000 words in the SRD 5.1 rules pages 77-85.',
 M51,U51,'','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: contractions',
 'SRD 5.1 Appendix PH-C contains 3 contractions in 1,530 words (They’re, doesn’t, don’t), a rate of 1.96 per 1,000 words.',
 M51,U51,'','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: tense',
 'SRD 5.1 Appendix PH-C is written in the present tense: is/are occur 24.84 times per 1,000 words and was/were 0.65 times per 1,000 words, the single past clause being "from which all the worlds were made".',
 M51,U51,'from which all the worlds were made','p. 364, Inner Planes','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('punctuation tics',
 'SRD 5.1 Appendix PH-C contains no semicolon, no question mark and no exclamation mark across its 72 sentences.',
 M51,U51,'','pp. 363-365','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))

# ---------- the rules baselines ----------
A(c('dm-facing sentence',
 'The SRD 5.1 section "The Environment" (pp. 86-87) uses no second-person pronoun at all across its 56 sentences.',
 M51,U51,'By its nature, adventuring involves delving into places','p. 86','measurement','asserts','2026-09-06',R,'dm-page','high'))
A(c('dm-facing sentence',
 'The SRD 5.1 section "The Environment" carries 15.96 numerals per 1,000 words against zero in the place-describing Appendix PH-C.',
 M51,U51,'','pp. 86-87 (1,065 words)','measurement','asserts','2026-09-06',R,'dm-page','high'))
A(c('edition and house style',
 'The SRD 5.2.1 rules pages 5-18 carry 44.12 second-person tokens per 1,000 words, the highest second-person density of any segment measured in either SRD.',
 M52,U52,'','pp. 5-18 (8,024 words)','measurement','asserts','2026-09-06',R,'dm-page','high'))
A(c('place and institution description',
 'The one dwelling the SRD describes at length, the Magnificent Mansion spell, is written in the second person and carries 26.72 numerals per 1,000 words in SRD 5.1.',
 M51,U51,'a magnificent foyer with numerous chambers beyond','SRD 5.1, spell "Magnificent Mansion"','measurement','asserts','2026-09-06',R,'dm-page','high'))

# ---------- absence ----------
A(c('boxed text form',
 'Neither SRD contains any read-aloud or boxed text: a case-insensitive search for "read aloud", "read-aloud", "read the following", "boxed text" and "aloud to the players" returns zero matches across all 403 pages of SRD 5.1 and all 364 pages of SRD 5.2.1.',
 M51+' and '+M52,U52,'','whole of both documents','measurement','asserts','2026-09-06',R,'none','high'))
A(c('place and institution description',
 'Neither SRD contains a settlement table; the word "settlement" occurs twice in the whole of SRD 5.1 and once in SRD 5.2.1, always as a rules noun.',
 M51+' and '+M52,U52,'','whole of both documents','measurement','asserts','2026-09-06',R,'none','high'))
A(c('place and institution description',
 'In SRD 5.2.1 the only occurrence of the phrase "Village, town, or city" is a row label in the Spellcasting-services price table.',
 M52,U52,'Village, town, or city','SRD 5.2.1 Equipment, Spellcasting services table','measurement','asserts','2026-09-06',R,'none','high'))
A(c('civic record register',
 'The strings "gazetteer", "chronicle", "annal", "archive" and "ledger" occur zero times in the full text of SRD 5.1 and zero times in the full text of SRD 5.2.1.',
 M51+' and '+M52,U52,'','whole of both documents','measurement','asserts','2026-09-06',R,'chronicle-line','high'))
A(c('place and institution description',
 'SRD 5.1 monster entries carry no habitat or lair description: the Aboleth entry on p. 261 is a stat block with no descriptive paragraph.',
 M51,U51,'','SRD 5.1 p. 261','measurement','asserts','2026-09-06',R,'none','high'))
A(c('edition and house style',
 'SRD 5.2.1 contains no Planes of Existence section; the phrase survives only inside spell text, the Amulet of the Planes item and the creature-type note on Elementals.',
 M52,U52,'Elementals are beings from the Elemental Planes','SRD 5.2.1, Monsters front matter','measurement','asserts','2026-09-06',R,'none','high'))

# ---------- vendor ----------
A(c('edition and house style',
 'Wizards of the Coast states that it removed the appendices "Fantasy-Historical Pantheons" and "The Planes of Existence" from SRD 5.2 because they are not rules-bearing.',
 VEN,UWEB,'as those are not rules-bearing to play fifth edition','SRD page, SRD 5.2 FAQ, Appendix row','vendor','asserts','2026-03-02',RW,'none','high'))
A(c('edition and house style',
 'Wizards of the Coast states that SRD 5.2 is meant to give creators a foundation for original material rather than to reproduce the D&D setting.',
 VEN,UWEB,'not to replicate every element of the D&D brand or setting','SRD page, SRD 5.2 FAQ','vendor','asserts','2026-03-02',RW,'none','high'))
A(c('edition and house style',
 'Wizards of the Coast states that it removed the "Between Adventures" section from SRD 5.2 because it is not in the 2024 core rules.',
 VEN,UWEB,'Removed: “Between Adventures” section as that is not featured','SRD page, Game Rules row','vendor','asserts','2026-03-02',RW,'none','high'))
A(c('edition and house style',
 'The English SRD v5.2.1 was published on May 01, 2025, following SRD v5.2.0 on April 22, 2025.',
 VEN,UWEB,'English SRD v5.2.1 (Published: May 01, 2025)','SRD page, English Downloads','vendor','asserts','2026-03-02',RW,'none','high'))
A(c('terminology consistency',
 'Wizards of the Coast tells creators that many more game terms are capitalized in SRD 5.2.1 than in SRD 5.1.',
 CONV,UCONV,'Many more game terms are capitalized in SRD 5.2.1','Converting to SRD 5.2.1, "Using This Guide", step 3','vendor','asserts','2025-05-27',R,'none','high'))
A(c('terminology consistency',
 'The conversion guide states that game objects are more rigorously capitalized in SRD 5.2.1.',
 CONV,UCONV,'Game objects are more rigorously capitalized.','Converting to SRD 5.2.1, "Capitalization"','vendor','asserts','2025-05-27',R,'none','high'))
A(c('terminology consistency',
 'The Capitalization section of the conversion guide lists 75 bulleted categories of terms that are capitalized in SRD 5.2.1.',
 CONV,UCONV,'The following terms are capitalized:','Converting to SRD 5.2.1, "Capitalization"','measurement','asserts','2026-09-06',R,'none','high'))

# ---------- the capitalisation shift, measured ----------
A(c('terminology consistency',
 'The phrase "difficult terrain" appears in lower case 48 times in SRD 5.1 and zero times in SRD 5.2.1, where it appears capitalized 52 times.',
 M51+' and '+M52,U52,'','whole of both documents','measurement','asserts','2026-09-06',R,'none','high'))
A(c('terminology consistency',
 'The phrase "bright light" appears in lower case 54 times in SRD 5.1 and zero times in SRD 5.2.1, where it appears capitalized 50 times.',
 M51+' and '+M52,U52,'','whole of both documents','measurement','asserts','2026-09-06',R,'none','high'))
A(c('terminology consistency',
 'The phrase "temporary hit points" appears in lower case 27 times in SRD 5.1 and zero times in SRD 5.2.1, where it appears capitalized 72 times.',
 M51+' and '+M52,U52,'','whole of both documents','measurement','asserts','2026-09-06',R,'none','high'))

# ---------- the 2014 -> 2024 rewrite ----------
A(c('edition and house style',
 'SRD 5.2.1 rewrites the SRD 5.1 environment opener from 19 words to 12, dropping the adjective "dark" and singularising "mysteries" to "mystery".',
 M52,U52,'Exploration involves delving into places that are dangerous and full of mystery.','SRD 5.2.1 p. 11 against SRD 5.1 p. 86','measurement','asserts','2026-09-06',R,'dm-page','high'))
A(c('edition and house style',
 'The second sentence of the same section shrinks from 22 words in SRD 5.1 to 18 in SRD 5.2.1, "cover some of the most important ways in which" becoming "detail some of the ways".',
 M52,U52,'detail some of the ways adventurers interact with the environment','SRD 5.2.1 p. 11 against SRD 5.1 p. 86','measurement','asserts','2026-09-06',R,'dm-page','high'))
A(c('edition and house style',
 'The Rod of Security’s destination is called "a paradise that exists in an extraplanar space" in SRD 5.1 and simply "a demiplane" in SRD 5.2.1.',
 M52,U52,'transports you and up to 199 other willing creatures','SRD 5.2.1, Magic Items, Rod of Security','measurement','asserts','2026-09-06',R,'none','high'))

# ---------- the read-aloud form, measured where it does exist ----------
A(c('boxed text form',
 'The D&D Basic Rules v1.0 (November 2018) opens with a 127-word place description spoken by the Dungeon Master, the read-aloud form that appears nowhere in either SRD.',
 MBR,UBR,'Dungeon Master (DM): After passing through the craggy peaks','Basic Rules v1.0, p. 2, Introduction','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('sentence length variation',
 'That Castle Ravenloft description runs 9 sentences with a mean length of 14.1 words and a population standard deviation of 4.4 words (shortest 5, longest 21).',
 MBR,UBR,'','Basic Rules v1.0, p. 2','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: digits in prose',
 'That Castle Ravenloft description contains zero digits across its 127 words.',
 MBR,UBR,'','Basic Rules v1.0, p. 2','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('punctuation tics',
 'That Castle Ravenloft description contains zero em dashes and zero contractions.',
 MBR,UBR,'','Basic Rules v1.0, p. 2','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('other: tense',
 'That Castle Ravenloft description contains no finite form of "to be": across its 9 sentences the verbs are towers, keep, look, gapes, spans, creak, stare, grin, hangs and stand.',
 MBR,UBR,'stone gargoyles stare at you from hollow sockets','Basic Rules v1.0, p. 2','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))
A(c('point of view and distance',
 'That Castle Ravenloft description addresses the players in the second person at a rate of 15.75 tokens per 1,000 words, in 2 of its 9 sentences.',
 MBR,UBR,'Castle Ravenloft towers before you','Basic Rules v1.0, p. 2','measurement','asserts','2026-09-06',R,'dossier-archivist','high'))

sources=[
 dict(title='System Reference Document 5.1 (CC-BY-4.0 edition), Wizards of the Coast',url=U51,kind='primary',substantive=True,date='2023',route='direct PDF download, browser UA; 403 pages'),
 dict(title='System Reference Document 5.2.1 (CC-BY-4.0), Wizards of the Coast',url=U52,kind='primary',substantive=True,date='2025-05-01',route='direct PDF download, browser UA; 364 pages'),
 dict(title='System Reference Document (SRD) page, Wizards of the Coast / D&D Beyond',url=UWEB,kind='vendor',substantive=True,date='2026-03-02',route='curl browser UA; redirects to www.dndbeyond.com/srd'),
 dict(title='Converting to System Reference Document 5.2.1, Wizards of the Coast',url=UCONV,kind='vendor',substantive=True,date='2025-05-27',route='direct PDF download, browser UA'),
 dict(title='D&D Basic Rules v1.0 (November 2018), Wizards of the Coast',url=UBR,kind='primary',substantive=True,date='2018-11',route='direct PDF download, browser UA'),
]
out=dict(complete=False,
 coverage='in progress',
 sourcesRead=sources, claims=claims)
json.dump(out,open(os.path.join(D,'found-dnd-place-srd-measure.json'),'w'),indent=1)
print('claims',len(claims),'sources',len(sources))
