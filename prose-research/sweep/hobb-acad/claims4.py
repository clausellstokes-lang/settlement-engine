# -*- coding: utf-8 -*-
DU_URL="https://studenttheses.uu.nl/server/api/core/bitstreams/f473796a-a2a2-4791-95bd-f039a6c27af8/content"
DU_SRC="Iris Duits, 'Translating Robin Hobb's Assassin's Apprentice', BA thesis, Utrecht University, 2012"
DU_ROUTE="Utrecht DSpace REST API: discover search -> item bundles -> ORIGINAL bitstream content; the studenttheses.uu.nl web UI is a JS app that returns no text"
KO_URL="https://studenttheses.uu.nl/server/api/core/bitstreams/232bf1b5-ecab-49c6-9f70-39f67fb9c119/content"
KO_SRC="Marlies Kok, 'The Boundaries of Imagination: Important Aspects of Fantasy Translation', MA thesis, Utrecht University, 2012"
FED_URL="https://elliottrwi.com/research/hobb-bibliography/"

CLAIMS=[
 dict(feature='civic record register',
   claim="Duits observes that the opening stretch of Assassin's Apprentice's first chapter reads almost like an encyclopaedia offering factual information on the Six Duchies.",
   source=DU_SRC,url=DU_URL,quote="this part almost reads like an encyclopaedia, offering factual information",
   page="ch. 3 (translation problems), p. 14-15",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='dossier-archivist',confidence='high',_file='duits.txt'),
 dict(feature='archaism',
   claim="Duits says that in that encyclopaedic opening the English itself seems a bit archaic and runs to long, complex sentences.",
   source=DU_SRC,url=DU_URL,quote="Even in English, the language seems a bit archaic, and long",
   page="ch. 3, p. 15",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='dossier-archivist',confidence='high',_file='duits.txt'),
 dict(feature='plainness and economy',
   claim="Judging Hobb's own sentence against its Dutch rendering, Duits calls the English clear and to the point where the Dutch is formal and wordy.",
   source=DU_SRC,url=DU_URL,quote="The English sentence is clear and to the point",
   page="ch. 3, p. 15",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='none',confidence='high',_file='duits.txt'),
 dict(feature='naming and forms of address',
   claim="Duits treats proper names as carrying an important role in Assassin's Apprentice, making their translation a central problem.",
   source=DU_SRC,url=DU_URL,quote="Proper names have an important role in this novel",
   page="Introduction, p. 3",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='dossier-archivist',confidence='high',_file='duits.txt'),
 dict(feature='naming and forms of address',
   claim="Kok describes the Six Duchies nobility as having a custom of naming children after virtues or traits in hope the child will emulate the name.",
   source=KO_SRC,url=KO_URL,quote="have the custom to name their children after virtues or traits",
   page="ch. on proper names, p. 27",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='dossier-archivist',confidence='high',_file='kok.txt'),
 dict(feature='diction (native vs latinate)',
   claim="Kok points out that Hobb's noble names are not fantastical-sounding but ordinary English words.",
   source=KO_SRC,url=KO_URL,quote="the names are not fantastical-sounding but English words",
   page="ch. on proper names, p. 27",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='dossier-archivist',confidence='high',_file='kok.txt'),
 dict(feature='naming and forms of address',
   claim="Kok argues that translating only half the virtue names loses the underlying cultural habit of naming noble children after virtues, because it no longer looks frequent enough to signify in the setting's culture.",
   source=KO_SRC,url=KO_URL,quote="the underlying cultural habit of naming noble children after virtues is",
   page="ch. on proper names, p. 28",kind='analysis',polarity='asserts',date='2012',
   routeHint=DU_ROUTE,registerHint='dossier-archivist',confidence='high',_file='kok.txt'),
 dict(feature='other: prose cited as attested usage',
   claim="Elliott's annotation records that Bruening's syntax paper drew a specimen of native-speaker English from Hobb's Royal Assassin, the only novel it references.",
   source="Geoffrey B. Elliott, annotating Benjamin Bruening, 'Word Formation Is Syntactic: Adjectival Passives in English', Natural Language & Linguistic Theory 32.2 (2014) 363-422, in The Fedwren Project",
   url=FED_URL,quote="among which is a selection from Hobb's",
   page="entry: Bruening, Benjamin",kind='relay',polarity='applies',date='2026-05-18',
   routeHint="live elliottrwi.com fetch; the NLLT article is paywalled and the lingbuzz id in circulation resolves to a different paper",
   registerHint='none',confidence='medium: relay, primary not reached',_file='fedwren.txt'),
]
