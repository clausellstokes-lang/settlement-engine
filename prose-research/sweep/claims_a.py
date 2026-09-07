# -*- coding: utf-8 -*-
from build import *

RAW="raw curl with browser user agent"

# --- 1. Looping Wor(l)d
u="https://loopingworld.com/2025/09/22/assassins-apprentice-robin-hobb/"
S("Assassin's Apprentice – Robin Hobb (Looping Wor(l)d blog review)",u,"analysis",True,"2025-09-22",RAW)
C("point of view and distance",
  "The blogger argues Hobb's first person in Assassin's Apprentice is less closely restricted to the child narrator than he expected, citing the phrase 'brackish iodine smell' on page 21 as a perception the six-year-old Fitz could not have had.",
  "Abalieno, Looping Wor(l)d blog, 22 September 2025",u,
  "at that early point Fitz had no exposure to the world",
  page="P.S. section at end of post",kind="analysis",polarity="disputes",date="2025-09-22",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("adjective and adverb discipline",
  "The blogger observes that Hobb renders dramatic events without melodrama: no character screams in pain or is shown in shock.",
  "Abalieno, Looping Wor(l)d blog, 22 September 2025",u,
  "You don’t see melodrama, you don’t see the character screaming in pain",
  page="body, paragraph on time jumps and Fitz's voice",kind="analysis",polarity="asserts",date="2025-09-22",
  routeHint=RAW,registerHint="chronicle-line",confidence="high")
C("point of view and distance",
  "The blogger characterises Fitz's narrating voice as understated rather than strongly defined, and credits that understatement with bringing the surrounding characters and places forward.",
  "Abalieno, Looping Wor(l)d blog, 22 September 2025",u,
  "But I think Fitz voice is actually understated",
  page="body, paragraph on time jumps",kind="analysis",polarity="asserts",date="2025-09-22",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("plainness and economy",
  "The blogger says the book is carried by prose rather than dialogue, with direct dialogue taking a secondary place.",
  "Abalieno, Looping Wor(l)d blog, 22 September 2025",u,
  "it is prose first and foremost, with direct dialogue taking a backseat",
  page="body, paragraph beginning 'This was the romantic view'",kind="analysis",polarity="asserts",date="2025-09-22",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("consequence on a household",
  "The blogger complains that in the final chapters some actions of Assassin's Apprentice appear to carry no consequence, the aftermath being shrugged off by the characters.",
  "Abalieno, Looping Wor(l)d blog, 22 September 2025",u,
  "some actions don’t seem to have any other consequence",
  page="body, paragraph beginning 'Even here it’s not all “perfect.”'",kind="analysis",polarity="disputes",date="2025-09-22",
  routeHint=RAW,registerHint="none",confidence="high")
C("other: pacing as the site of value",
  "The blogger argues the slow pacing of Assassin's Apprentice is not a defect to be endured but where the book's value lies, and that the reading method it demands is staying in the present of the page rather than anticipating.",
  "Abalieno, Looping Wor(l)d blog, 22 September 2025",u,
  "the slow pacing here isn’t a weak point to overcome",
  page="body, paragraph after the quoted reader review",kind="analysis",polarity="asserts",date="2025-09-22",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 2. Fantasy-Hive
u="https://fantasy-hive.co.uk/2017/12/assassins-apprentice-robin-hobb/"
S("Assassin's Apprentice by Robin Hobb, reviewed by Laura M. Hughes (Fantasy-Hive)",u,"reception",True,"2017-12-08",RAW)
C("point of view and distance",
  "Reviewer Laura M. Hughes names the narrative voice, not plot or worldbuilding, as the novel's main strength.",
  "Laura M. Hughes, Fantasy-Hive, 8 December 2017",u,
  "the novel’s main strength is its narrative voice",
  page="final body paragraph",kind="reception",polarity="asserts",date="2017-12-08",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("withheld information and inference",
  "Hughes contrasts Fitz with Rothfuss's Kvothe, arguing Fitz's self-deprecating narration reports the damning facts about his own actions rather than flattering him.",
  "Laura M. Hughes, Fantasy-Hive, 8 December 2017",u,
  "unlike Kvothe, Fitz is brutally honest",
  page="final body paragraph",kind="reception",polarity="asserts",date="2017-12-08",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 3. Natasha Pulley, Reactor (Golden Fool)
u="https://reactormag.com/character-is-in-the-details-robin-hobbs-golden-fool/"
S("Character is in the Details: Robin Hobb's Golden Fool, by Natasha Pulley (Tor.com/Reactor, 'That Was Awesome! Writers on Writing')",u,"analysis",True,"2015-07-10",RAW)
C("naming and forms of address",
  "Novelist Natasha Pulley points out that Hobb declines the efficient move of simply naming the garden maid, and instead has two characters work out between them who she is.",
  "Natasha Pulley, Tor.com / Reactor, 10 July 2015",u,
  "which would have been the narratively efficient thing to do",
  page="paragraph 3, 'There’s an unobtrusive moment'",kind="analysis",polarity="asserts",date="2015-07-10",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("concrete sensory noun",
  "Pulley's close reading turns on one concrete noun: Fitz disputes the Fool's simile 'hair the colour of clean straw' because straw belongs to his stable upbringing and not to the Fool's.",
  "Natasha Pulley, Tor.com / Reactor, 10 July 2015",u,
  "What’s brilliant, though, is that he does it over straw",
  page="paragraph 5, after the quoted dialogue",kind="analysis",polarity="asserts",date="2015-07-10",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("withheld information and inference",
  "Pulley reads a passing quarrel over a minor descriptive detail as carrying, without statement, the class histories of both speakers.",
  "Natasha Pulley, Tor.com / Reactor, 10 July 2015",u,
  "It says volumes about both of them",
  page="paragraph 5, last sentence",kind="analysis",polarity="asserts",date="2015-07-10",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("other: small-scale detail beside large-scale spectacle",
  "Pulley contrasts the trilogy's dragons, prophets and sweeping landscapes with what she calls its pin-sharp moments.",
  "Natasha Pulley, Tor.com / Reactor, 10 July 2015",u,
  "but it has these pin-sharp moments too",
  page="final body paragraph",kind="analysis",polarity="asserts",date="2015-07-10",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 4. Steven Erikson, Reactor
u="https://reactormag.com/how-robin-hobbs-assassins-apprentice-pulls-the-rug-out-from-under-you/"
S("How Robin Hobb's Assassin's Apprentice Pulls the Rug Out From Under You, by Steven Erikson (Tor.com/Reactor)",u,"analysis",True,"2016-04-27",RAW)
C("point of view and distance",
  "Novelist Steven Erikson says what he admired on first reading Assassin's Apprentice was the controlled point of view and the leisurely pace.",
  "Steven Erikson, Tor.com / Reactor, 27 April 2016",u,
  "admired the controlled point of view, the leisurely pace",
  page="paragraph 4, 'Started reading'",kind="analysis",polarity="asserts",date="2016-04-27",
  routeHint=RAW,registerHint="none",confidence="high")
C("withheld information and inference",
  "Erikson reports that after the book's turning scene he reread the preceding pages line by line to find the hints Hobb had planted that he had missed.",
  "Steven Erikson, Tor.com / Reactor, 27 April 2016",u,
  "deconstructing, line by line, to catch every subtle tell",
  page="paragraph 6, 'Back to that scene'",kind="analysis",polarity="asserts",date="2016-04-27",
  routeHint=RAW,registerHint="none",confidence="high")
C("point of view and distance",
  "Erikson says he sets the opening chapters of Assassin's Apprentice as required reading on point of view in the writing workshops he teaches.",
  "Steven Erikson, Tor.com / Reactor, 27 April 2016",u,
  "I cite the opening chapters of Assassin’s Apprentice as required reading",
  page="paragraph beginning 'To this day in the workshops'",kind="analysis",polarity="asserts",date="2016-04-27",
  routeHint=RAW,registerHint="none",confidence="high")
C("withheld information and inference",
  "Erikson describes the child point of view in fantasy as a device that delivers knowledge to the reader piecemeal at the child's rate of comprehension, in an essay whose worked example is Hobb's Fitz.",
  "Steven Erikson, Tor.com / Reactor, 27 April 2016",u,
  "Knowledge is fed piecemeal, at a child’s pace of comprehension",
  page="paragraph beginning 'It’s no accident the child POV'",kind="analysis",polarity="asserts",date="2016-04-27",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 5. The Wertzone
u="https://thewertzone.blogspot.com/2016/08/assassins-apprentice-by-robin-hobb.html"
S("Assassin's Apprentice by Robin Hobb, reviewed by Adam Whitehead (The Wertzone)",u,"analysis",True,"2016-08-28",RAW)
C("point of view and distance",
  "Critic Adam Whitehead states the rule governing reliability in the Farseer narration: the further an event lies from Fitz's own perspective, the less reliable the account of it is.",
  "Adam Whitehead, The Wertzone, 28 August 2016",u,
  "the further things and events are from Fitz's perspective",
  page="paragraph beginning 'Much of your enjoyment'",kind="analysis",polarity="asserts",date="2016-08-28",
  routeHint=RAW,registerHint="chronicle-line",confidence="high")
C("place and institution description",
  "Whitehead names a naturalistic manner of presenting the world, alongside characterisation, as Hobb's greatest strength.",
  "Adam Whitehead, The Wertzone, 28 August 2016",u,
  "her naturalistic way of presenting the world",
  page="paragraph beginning 'Robin Hobb’s greatest strength'",kind="analysis",polarity="asserts",date="2016-08-28",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("plainness and economy",
  "Whitehead names as Hobb's greatest weakness a tendency to meander, with characters sitting and talking about the plot at length.",
  "Adam Whitehead, The Wertzone, 28 August 2016",u,
  "a tendency to meander, to have characters sitting around talking",
  page="paragraph beginning 'Robin Hobb’s greatest strength'",kind="analysis",polarity="disputes",date="2016-08-28",
  routeHint=RAW,registerHint="none",confidence="high")
C("other: emotion and atmosphere",
  "Whitehead calls Hobb a superior prose writer and a gifted communicator of emotions and atmosphere.",
  "Adam Whitehead, The Wertzone, 28 August 2016",u,
  "Hobb is a superior prose writer and a gifted communicator",
  page="paragraph beginning 'Hobb is a superior prose writer'",kind="reception",polarity="asserts",date="2016-08-28",
  routeHint=RAW,registerHint="none",confidence="high")

# --- 6. Writing Excuses transcript (Hobb's own transcribed speech)
u="https://writingexcuses.com/11-bonus-01-characterization-and-differentiation-with-robin-hobb/"
S("Writing Excuses 11.Bonus-01: Characterization and Differentiation, with Robin Hobb (transcript, recorded at GenCon Indy)",u,"own-words",True,"2016",RAW)
C("per-speaker register",
  "Hobb, in her own transcribed words, says a farmer and a character from a sailing-ship background will choose different vocabulary for the same things, and gives her own house as the example, where the same rooms are galley, head and deck to her sailor husband and kitchen, bathroom and floor to her.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "we have a galley, we have a head, we have a deck",
  page="second half, 'Well, again, it’s knowing the character’s background'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="herald-pools",confidence="high")
C("dialogue register",
  "Hobb gives a test for per-speaker register: read a passage of dialogue and you should be able to tell who is speaking without the attribution tags.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "you should be able to tell who is talking without",
  page="second half, 'If you want to do a double check, read your dialogue'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="herald-pools",confidence="high")
C("sentence length variation",
  "Hobb names sentence length as one of the carriers of per-speaker difference, saying some characters speak in longer sentences and some in shorter ones, using The Lord of the Rings as her example.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "Some characters speak in longer sentences, some speak in shorter sentences",
  page="second half, 'If you have two farmers'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="herald-pools",confidence="high")
C("point of view and distance",
  "Hobb says she writes a great deal in first person because she regards it as the natural storytelling voice, likening it to a person recounting their day at home.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "first person is the natural storytelling voice",
  page="first half, 'I write… a tremendous amount of my work is first person'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("point of view and distance",
  "Hobb says what a first-person narrator notices on entering a room is determined by who he is, contrasting an assassin entering a room with three people in it against a child looking for a lost toy.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "what he notices is going to be very different",
  page="second half, 'If you’re writing from the first person'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("consequence on a household",
  "Hobb derives a character's personality from household economy, explaining a pennypinching character by a childhood family on a very tight budget in which every choice was consequential.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "Charlotte grew up in a family with a very tight budget",
  page="first half, 'Why is she so pennypinching?'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("other: character generated by setting",
  "Hobb says that for her the character has to be generated by the world, and that she could not believably insert a twenty-first century person into a fantasy.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "the character has to be generated by the world",
  page="first half, answer to the opening question",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="none",confidence="high")
C("other: reaction to a minor character as characterisation",
  "Hobb offers an inn scene as a characterisation test: a late serving boy, and whether the viewpoint character fails to notice, is annoyed at someone else's shouting, is embarrassed, or quietly tips the boy.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (transcript)",u,
  "whether you quietly tip the kid",
  page="second half, 'How a character treats a secondary character'",kind="own-words",polarity="asserts",date="2016",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")

# --- 7. The Huntress and the Wolf substack
u="https://thehuntressandthewolf.substack.com/p/how-robin-hobb-created-a-legendary"
S("How Robin Hobb Created a Legendary Hero in Fitzchivalry Farseer (The Huntress And The Wolf, Substack)",u,"analysis",True,"2026-02-15",RAW)
C("point of view and distance",
  "The essayist argues Hobb's method is to place the reader inside Fitz's perspective and leave them there, supplying no outside witness to frame him.",
  "The Huntress And The Wolf, Substack, 15 February 2026",u,
  "Hobb places you inside Fitz’s perspective and leaves you there",
  page="opening section, 'Robin Hobb’s great trick'",kind="analysis",polarity="asserts",date="2026-02-15",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("omission as information",
  "The essayist argues that Fitz's competence is legible only by inference because he almost never narrates his own power, reporting instead his doubts, failures, grief and shame.",
  "The Huntress And The Wolf, Substack, 15 February 2026",u,
  "he almost never narrates his own power",
  page="section 'A Wild Soul'",kind="analysis",polarity="asserts",date="2026-02-15",
  registerHint="dossier-archivist",routeHint=RAW,confidence="high")
C("concrete sensory noun",
  "The essayist shows Hobb rendering a character's training as an inventory of ordinary objects in a room, listing medicinal unguents on the mantel, two pens at the ready and a Stones puzzle on the table.",
  "The Huntress And The Wolf, Substack, 15 February 2026",u,
  "the medicinal unguents on the mantel, the two pens",
  page="section 'A Master of His Craft'",kind="analysis",polarity="asserts",date="2026-02-15",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("civic record register",
  "The essayist argues that Fitz-as-chronicler records what official chroniclers could not, and that history in Hobb is made in bedrooms, kitchens, stables and sickrooms as well as in councils and battles.",
  "The Huntress And The Wolf, Substack, 15 February 2026",u,
  "history is not made only in councils and battles",
  page="section 'A Writer, Historian, and Chronicler of His Age'",kind="analysis",polarity="asserts",date="2026-02-15",
  routeHint=RAW,registerHint="chronicle-line",confidence="high")
C("plainness and economy",
  "The essayist warns that the intimacy of Fitz's prose should not be mistaken for simplicity, crediting it with clear rendering of character, politics, landscape, memory and moral conflict.",
  "The Huntress And The Wolf, Substack, 15 February 2026",u,
  "intimacy should not be mistaken for simplicity",
  page="section 'A Writer, Historian, and Chronicler of His Age'",kind="analysis",polarity="asserts",date="2026-02-15",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
C("withheld information and inference",
  "The essayist says Hobb hides her protagonist's magnificence in plain sight, leaving it to the reader whether to see past his harsh self-assessment.",
  "The Huntress And The Wolf, Substack, 15 February 2026",u,
  "She hides his magnificence in plain sight",
  page="opening section",kind="analysis",polarity="asserts",date="2026-02-15",
  routeHint=RAW,registerHint="dossier-archivist",confidence="high")
