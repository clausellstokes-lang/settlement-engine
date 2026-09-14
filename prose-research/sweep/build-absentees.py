import json, re, io
S = {
 'mirowski': ("Mirowski, Mathewson, Pittman, Evans — 'A Robot Walks into a Bar: Can Language Models Serve as Creativity Support Tools for Comedy?' (FAccT 2024)", "https://arxiv.org/html/2405.20956", "peer-reviewed conference (ACM FAccT 2024), read at arXiv HTML", "stand-up comedy writing; 20 professional comedians (Edinburgh Fringe + online), ChatGPT-3.5/4 and Bard, 45-min exercise + focus groups; Creativity Support Index mediocre"),
 'subbiah': ("Subbiah, Zhang, Chilton, McKeown — 'Reading Subtext: Evaluating Large Language Models on Short Story Summarization with Writers' (TACL 2024)", "https://arxiv.org/html/2403.01061", "peer-reviewed journal (TACL 2024), read at arXiv HTML", "literary short fiction (25 unpublished stories by 9 skilled writers, 8/9 with writing degrees) summarised by GPT-4, Claude-2.1, Llama-2-70B; writer-rated coverage/faithfulness/coherence/analysis + span errors"),
 'ippolito22': ("Ippolito, Yuan, Coenen, Burnam — 'Creative Writing with an AI-Powered Writing Assistant: Perspectives from Professional Writers' (arXiv 2022)", "https://arxiv.org/html/2211.05030", "arXiv preprint 2022 (Google Wordcraft study), read at arXiv HTML", "literary short fiction 1,000–1,500 words; 13 published writers, 8 weeks, Wordcraft on LaMDA, journals + interviews"),
 'chakrabarty': ("Chakrabarty, Padmakumar, Brahman, Muresan — 'Creativity Support in the Age of Large Language Models: An Empirical Study Involving Emerging Writers' (arXiv 2023)", "https://arxiv.org/html/2309.12570", "arXiv preprint 2023, read at arXiv HTML", "literary fiction across genres; 17 MFA writers, 30 stories of 1,000–4,000 words, GPT-3.5 in a logged interface; planning/translation/reviewing stages"),
 'agarwal': ("Agarwal, Naaman, Vashistha — 'AI Suggestions Homogenize Writing Toward Western Styles and Diminish Cultural Nuances' (CHI 2025)", "https://arxiv.org/html/2409.11360", "peer-reviewed conference (ACM CHI 2025), read at arXiv HTML", "short personal essays (favourite food, public figure, festival, leave email); 118 Indian and American participants, GPT-4o inline autocomplete, 2x2 design"),
 'walshg': ("Walsh, Preus, Gronski — 'Does ChatGPT Have a Poetic Style?' (CHR 2024, CEUR Vol-3834 paper122)", "https://arxiv.org/html/2410.15299", "peer-reviewed conference (Computational Humanities Research 2024), read at arXiv HTML v2", "English poetry in 24 forms x 40 subjects x 3 templates; 5,760 GPT-3.5/GPT-4 poems vs 3,874 Poetry Foundation / Academy of American Poets poem-form pairs"),
 'walsha': ("Walsh, Preus, Antoniak — 'Sonnet or Not, Bot? Poetry Evaluation for Large Models and Datasets' (Findings of EMNLP 2024)", "https://arxiv.org/html/2406.18906", "peer-reviewed (Findings of EMNLP 2024), read at arXiv HTML", "poetic-form classification over 4,197 poem/form pairs; GPT-3.5/4/4o, Claude 3 Sonnet, Llama 3, Mixtral; 15 literary scholars as human baseline; Dolma contamination + memorisation checks"),
 'dugan': ("Dugan, Ippolito, Kirubarajan, Shi, Callison-Burch — 'Real or Fake Text?: Investigating Human Ability to Detect Boundaries Between Human-Written and Machine-Generated Text' (AAAI 2023)", "https://arxiv.org/abs/2212.12672", "peer-reviewed conference (AAAI 2023), read at arXiv HTML v1", "news (NYT), recipes, Reddit short stories, presidential speeches; GPT-2 small/XL, CTRL, GPT-3 Davinci; 21,646 boundary annotations by 241 students with error reasons"),
 'ippolito20': ("Ippolito, Duckworth, Callison-Burch, Eck — 'Automatic Detection of Generated Text is Easiest when Humans are Fooled' (ACL 2020)", "https://aclanthology.org/2020.acl-main.164/", "peer-reviewed conference (ACL 2020), read from cached ACL PDF text", "open-web text from GPT-2 Large under top-k, nucleus and untruncated sampling; BERT discriminators vs AMT and trained 'expert' raters at 16–192 tokens"),
 'benderkoller': ("Bender, Koller — 'Climbing towards NLU: On Meaning, Form, and Understanding in the Age of Data' (ACL 2020)", "https://aclanthology.org/2020.acl-main.463/", "peer-reviewed conference (ACL 2020), read from cached ACL PDF text", "general language use (position paper; octopus, Java and bear thought experiments; GPT-2 probes in appendix) — not fiction"),
 'parrots': ("Bender, Gebru, McMillan-Major, Shmitchell — 'On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?' (FAccT 2021)", "https://doi.org/10.1145/3442188.3445922", "peer-reviewed conference (ACM FAccT 2021), read from cached ACM PDF text", "general LM-generated text and training data (position/risk paper) — not fiction"),
 'kobis': ("Köbis, Mossink — 'Artificial intelligence versus Maya Angelou: Experimental evidence that people cannot differentiate AI-generated from human-written poetry' (Computers in Human Behavior 114:106553, 2021)", "https://doi.org/10.1016/j.chb.2020.106553", "peer-reviewed journal (CHB 2021), read from cached author manuscript (arXiv 2005.09980)", "short poems (8+ lines) continued from two human opening lines; GPT-2 345M/XL vs novices (Study 1) and professional poets incl. Maya Angelou, Hermann Hesse (Study 2); N=830 incentivised judges"),
 'moon': ("Moon, Green, Kushlev — 'Homogenizing Effect of Large Language Models (LLMs) on Creative Diversity: An Empirical Comparison of Human and ChatGPT Writing' (Computers in Human Behavior: Artificial Humans, 2025; preprint 2024)", "https://doi.org/10.1016/j.chbah.2025.100207", "peer-reviewed journal (accepted manuscript), read from cached PDF text", "college admissions essays (~650 words); 2,200 essays across three preregistered studies, human applicants vs GPT-4 (base, naive-prompt, parameter-modified, chain-of-thought); Divergent Semantic Integration + diversity growth rate"),
 'weberwulff': ("Weber-Wulff, Anohina-Naumeca, Bjelobaba, Foltýnek, Guerrero-Dib, Popoola, Šigut, Waddington — 'Testing of detection tools for AI-generated text' (International Journal for Educational Integrity 19:26, 2023)", "https://doi.org/10.1007/s40979-023-00146-z", "peer-reviewed journal (IJEI 2023), read from cached PDF text; abstract confirmed at arXiv 2306.15666", "undergraduate-level academic English essays; 54 test cases (human, machine-translated human, ChatGPT, human-edited ChatGPT, Quillbot-paraphrased ChatGPT) x 14 detectors = 756 tests"),
 'liang': ("Liang, Yuksekgonul, Mao, Wu, Zou — 'GPT detectors are biased against non-native English writers' (Patterns 2023)", "https://arxiv.org/abs/2304.02819", "peer-reviewed journal (Cell Patterns 2023), read at arXiv HTML v3", "91 TOEFL essays (non-native) vs 88 US 8th-grade essays; seven GPT detectors; perplexity analysis; nearest peer-reviewed evidence to the neurodivergent-false-positive claim"),
 'perkins': ("Perkins, Roe, Vu, Postma, Hickerson, McGaughran, Khuat — 'GenAI Detection Tools, Adversarial Techniques and Implications for Inclusivity in Higher Education' (IJEI 2024; preprint March 2024)", "https://arxiv.org/abs/2403.19148", "peer-reviewed journal (International Journal for Educational Integrity 2024), read from cached preprint text", "short essays, blog posts, cover letters, magazine articles (~500 words) from GPT-4, Claude 2, Bard, plus six adversarial rewrites; 7 detectors, 805 tests, 10 human controls"),
}
C = [
 # Mirowski
 ('mirowski',"blandness / genericity","Professional comedians found LLM comedy output generic and bland, lacking the incisiveness of human-written language.","the words seem very generic. They lack that incisiveness"),
 ('mirowski',"no point of view; cannot punch up or down","Without a perspective the model cannot calibrate who a joke targets, so it takes no comedic risks.","It had no perspective, so it couldn’t take any risks"),
 ('mirowski',"dated, biased comedy tropes","Outputs read as stale mid-century material, described by participants as bland and biased tropes.","cruise ship comedy material from the 1950s"),
 ('mirowski',"setup without punchline","Comedians used the model only for setup and structure because it could not land a punchline.","just consistently bad"),
 ('mirowski',"regurgitated tropes; no surprise","Humour depends on surprise, and a predictive model that regurgitates tropes cannot supply it.","AI is only adept at regurgitating tropes"),
 ('mirowski',"unspoken subtext missing","Comedy runs on unspoken subtext that a text-only model neither carries nor reads.","comedy is all about subtext"),
 ('mirowski',"placeless voice; no audience or location","LLM material has no sense of where or to whom it is spoken.","everywhere and nowhere all at once"),
 ('mirowski',"moderation flattens dark and minority-coded material","Safety filters refused dark material and stripped out gay-coded language, which comedians read as censorship of their own identities.","taking out the gay language of it"),
 ('mirowski',"cultural defaults survive a language switch","Switching the conversation into Indian languages left the character names un-localised.","it didn’t automatically change the names"),
 ('mirowski',"no pride or uniqueness in AI-assisted material","Most participants felt neither pride nor uniqueness in material co-written with the model; the Creativity Support Index was mediocre.","did not feel pride in the material written with AI"),
 ('mirowski',"delivery and surprise absent from a text-only medium","The paper names delivery and surprise as critical comedic elements a text-only model cannot provide.","delivery and surprise"),
 # Subbiah
 ('subbiah',"subtext missing or misread","Models reproduce what is on the surface of a literary story while the subtext is absent or wrongly interpreted.","Subtext is missing entirely"),
 ('subbiah',"unreliable narrator taken at face value","All three models score lower on stories with unreliable narrators and repeat the narrator's self-description as fact.","the narrator is not really to be trusted"),
 ('subbiah',"vague stock phrases instead of specifics","Weak summaries substitute stock phrases for the specific content of the story (64 'vague' span errors across models).","stock phrases or stand-ins rather than accurate, specific summary"),
 ('subbiah',"schoolroom over-analysis that misses the feeling","Summaries pile on interpretive claims in a classroom register while missing the story's larger emotional point.","like a high school english class"),
 ('subbiah',"hypernormative interpretation","Claude imposed a heteronormative monogamous reading of an interaction over what the text actually says.","assumes a heteronormative monogamous interpretation"),
 ('subbiah',"implication read literally","An implied death was rendered as a deliberate choice to stay at the summit.","The cold settled into me"),
 ('subbiah',"errors cluster in what characters did and felt","Most faithfulness errors fall in Action and Feeling, the categories requiring interpretation of characters' deeds and reactions.","most faithfulness errors across the models are in Action and Feeling"),
 ('subbiah',"unsupported analysis even in top-rated summaries","Summaries rated 4/4 for analysis still contained on average at least one analysis error (104 unsupported-analysis spans in total).","at least one error in analysis on average"),
 ('subbiah',"excellence only about half the time","GPT-4 and Claude can produce excellent literary summaries, but only about half the time.","excellent summaries, but only about half the time"),
 # Ippolito 2022
 ('ippolito22',"default bland, elementary voice","Nearly all writers noticed a single default voice in the generations, bland and elementary in its language.","bland and somewhat elementary in its use of language"),
 ('ippolito22',"novice fan-fiction register","Several writers compared the suggestions to those of a novice fan-fiction writer, pitched at an implicit audience of internet users.","novice fan fiction writer"),
 ('ippolito22',"genre collapses to its most worn trope","The model pushed a fantasy story toward warrior-hero-versus-invaders and treated genre as its dominant trope.","fantasy is high fantasy, science fiction is robots and spaceships"),
 ('ippolito22',"heteronormative and male defaults","A lesbian romance kept receiving suggestions to add a male character; unspecified gender defaulted to a male voice.","kept suggesting that she insert a male character"),
 ('ippolito22',"characters are not allowed to be mean","Safety tuning made the system reluctant to generate people doing mean things, flattening conflict.","seemed very reluctant to generate people doing mean things"),
 ('ippolito22',"exemplar names leak into every story","Prompt exemplars containing 'Sarah' caused the system to try inserting a Sarah into every participant's story.","into every single participant’s story"),
 ('ippolito22',"shallow memory of the story","All participants complained that the model's understanding of their story was superficial, worsening with length.","understanding seemed superficial if not entirely absent"),
 ('ippolito22',"metaphors too simple and sensible","The model offered only simple, sensible metaphors where writers wanted complex or not-quite-sensible ones.","sometimes one wants metaphors to be complex, or not quite sensible"),
 ('ippolito22',"reversion to trope and repetition","Suggestions slid easily back into tropes and repetition, a named system limitation.","Suggestions too Easily Revert to Tropes and Repetition"),
 # Chakrabarty
 ('chakrabarty',"one narrative in many skins","Writers reported the model writing the same story over and over with a new surface, regardless of prompt.","writes exactly the same story over and over again"),
 ('chakrabarty',"most-obvious autocomplete","The system autocompletes toward the most obvious version of any request, the opposite of good fiction.","autocompletes with the most obvious version of whatever you ask for"),
 ('chakrabarty',"telling over showing","The model tells rather than shows and cannot write real scenes with realistic dialogue and detail.","much better at telling than showing"),
 ('chakrabarty',"moralising, didactic endings","Every ending arrived as a stated lesson, uplifting and didactic whether or not the story wanted it.","Here is the lesson learnt"),
 ('chakrabarty',"binary tone; no nuance between happy and fatalistic","The model resists ambiguity and treats any story that is neither happy nor wholly fatalistic as flawed.","The story must be either happy or entirely fatalistic"),
 ('chakrabarty',"homogenising toward dominant narratives","Writers saw a violent homogenising pull toward the narratives of dominant powers and voices.","a weird and violent kind of homogenizing"),
 ('chakrabarty',"weak similes and metaphors","Figurative language was judged poor in the little the writers tested.","Its similes and metaphors aren’t very good"),
 ('chakrabarty',"style mimicry is shallow imitation","Asked to mimic an author, the model produced a campy facsimile rather than the author's actual wit.","less ‘artificial intelligence’ and more ‘automatic imitation’"),
 ('chakrabarty',"derivative plotting shaped by alignment","Plot instincts were boring or carried a particular ethical perspective the writers attributed to alignment.","The AI’s creative impulses are the definition of derivative"),
 ('chakrabarty',"formulaic and too literal","Dialogue and description came out formulaic and the model read craft too literally.","is too literal"),
 ('chakrabarty',"writer fights the tool","One writer described the session as fighting the model to get what they wanted rather than being helped.","fighting against the AI to produce what I wanted"),
 # Agarwal
 ('agarwal',"Western default suggestions","The first suggested food was always pizza or sushi and the first festival invariably Christmas, for Indian writers too.","always pizza or sushi"),
 ('agarwal',"Western gaze on the writer's own culture","With suggestions on, Indians described their own food and festivals from a Western, exoticising gaze.","describe their own food and festivals from a Western gaze"),
 ('agarwal',"cross-cultural convergence","Indian–American essay similarity rose from 0.48 to 0.54 and nationality-prediction accuracy fell from 90.6% to 83.5% with AI.","rose to 0.54"),
 ('agarwal',"specific detail replaced by generic tropes","Regional preparation details gave way to 'rich', 'flavorful', 'aromatic' phrasing that subtly exoticised the dish.","subtly exoticizing Indian food"),
 ('agarwal',"extra editing burden on non-Western writers","Indians modified suggestions in 63.5% of tasks versus 59.4% for Americans and gained less per suggestion.","Indians lose cultural nuance"),
 ('agarwal',"Western public figures suggested","Initial celebrity suggestions for Indian writers were almost exclusively Western figures and never matched the final choice.","almost exclusively Western figures"),
 # Walsh Gronski
 ('walshg',"a single default poetic mode","GPT poetry is far more constrained and uniform than human poetry, defaulting to rhymed iambic quatrains.","much more constrained and uniform than human poetry"),
 ('walshg',"quatrain dominance","66.8% of GPT-3.5 and 59.6% of GPT-4 stanzas are quatrains against 16.7% of human stanzas.","a whopping 66.8% of all GPT-3.5 stanzas"),
 ('walshg',"rhyme even where the form does not ask for it","About 90% of GPT poems rhyme versus 65% of human poems, including forms like aubade and pastoral.","Around 90% of the poems generated by both"),
 ('walshg',"iambic default","Over 60% of GPT poems carry a dominant iambic meter against under 40% of human poems.","had a dominant iambic meter"),
 ('walshg',"first-person plural 'we/us/our'","GPT poems over-use first-person plural and under-use first-person singular relative to human poets.","curiously dominant first-person plural perspective"),
 ('walshg',"signature vocabulary (echo, whisper, embrace, grace, heart)","Echo or whisper appears in 75% of GPT-4 poems; embrace/grace/dance/dreams in 87% of GPT-3.5 poems.","either “echo” or “whisper” shows up in 75% of the poems"),
 ('walshg',"stock iambic openers ('In', 'Upon', 'Beneath')","The most distinctive opening word is 'In', with 'Upon', 'Beneath', 'Behold' seeding iambic lines in GPT-4.","The most distinctive opening word"),
 ('walshg',"does not know when to stop","Limericks and sonnets get bundled in multiples (median limerick 25 lines) because the model does not stop.","don’t know when to stop"),
 ('walshg',"default breaks through contrary prompts","Even when prompted for other forms the iambic/quatrain/end-rhyme default resurfaces.","the persistent iambic/quatrain/end rhyme style still breaks through"),
 ('walshg',"'we' as trained inclusivity","The authors attribute the plural voice partly to pre-programmed inclusivity and the model's lack of first-person experience.","pre-programmed attitudes toward inclusivity"),
 # Walsh Antoniak
 ('walsha',"unfixed, topic-based and visual forms unrecognised","Models struggle with unfixed forms and those defined by topic or visual layout (ode, elegy, concrete poetry).","struggle to identify unfixed poetic forms"),
 ('walsha',"canon memorised","41% of the benchmark poems are memorised by GPT-4, and memorisation may inflate form recognition.","41% of poems are memorized by GPT-4"),
 ('walsha',"repetition-based forms confused","Models handle whole-line repetition (pantoum) better than word-level repetition (ghazal).","pantoums than ghazals"),
 # Dugan
 ('dugan',"genre-specific error signature","Generated stories draw 'irrelevant' flags, news 'generic', recipes 'common sense' — the failure mode follows the genre.","more “irrelevant” errors on stories"),
 ('dugan',"grammar is the least reliable tell","Readers who flag grammar are least often right; common-sense, irrelevance and contradiction are the reliable cues.","conditioning on bad grammar is by far the least reliable way"),
 ('dugan',"the human-to-machine boundary is hard to see","Annotators found the exact transition sentence only 23.4% of the time (chance 10%).","correctly selecting the boundary sentence 23.4% of the time"),
 ('dugan',"diversity trades against quality","Pure random sampling was easiest to catch, confirming models cannot match human diversity without noise.","LMs struggle to generate high-quality text with similar diversity"),
 ('dugan',"detection is a trainable skill","Incentivised, instructed annotators improved over time; reading the guide was the strongest predictor of skill.","detection is a skill and that annotators can be trained"),
 ('dugan',"style cues are not what readers use","Topic control codes did not change detectability, so readers' cues were not stylistic.","may not be related to stylistic details"),
 # Ippolito 2020
 ('ippolito20',"decoding tuned to fool humans, not to write well","Truncated sampling optimises for fooling readers while introducing statistical anomalies machines catch.","improvements in decoding methods have primarily optimized for fooling humans"),
 ('ippolito20',"humans catch semantic errors, machines catch statistics","Humans notice contradictions and nonsense; discriminators notice unigram-distribution artefacts.","humans more easily noticing semantic errors"),
 ('ippolito20',"no dips into low-probability language","Human writing dips in and out of low-probability zones; generation cannot mimic that cadence without bad word choices.","dips in and out of low probability zones"),
 ('ippolito20',"fluency masks emptiness","Fluent generated excerpts fooled raters who could otherwise catch topic drift and falsehoods.","the high level of fluency left human raters fooled"),
 ('ippolito20',"even trained readers fail a quarter of the time","Trained raters reached only 71.4% on 192-token excerpts; untrained AMT raters hovered near chance.","human performance is only at 71.4%"),
 ('ippolito20',"top-k narrows vocabulary yet reads most human","Top-k text is hardest for raters and easiest for classifiers because it over-samples common tokens.","Top-k produces the text that is hardest for raters"),
 # Bender Koller
 ('benderkoller',"form without meaning","A system trained only on linguistic form has no route to meaning or communicative intent.","has a priori no way to learn meaning"),
 ('benderkoller',"the reader supplies the meaning","Octopus text seems meaningful only because the human reader does all the work of attributing meaning.","A does all the work in attributing meaning"),
 ('benderkoller',"social chat succeeds, grounded novelty fails","Internally coherent text suffices for phatic exchange but breaks at the coconut catapult and the bear.","It is sufficient to produce text that is internally coherent"),
 ('benderkoller',"co-occurrence instead of help","GPT-2 knows which words go with bears and sticks, and none of its completions would help.","none of these completions would be helpful to A"),
 ('benderkoller',"apparent reasoning is artefact leverage","BERT's 'reasoning' successes collapse under adversarial data, a mirage built on dataset artefacts.","a mirage built on leveraging artifacts in the training data"),
 # Parrots
 ('parrots',"stochastic parrot","An LM haphazardly stitches together observed forms by probability, with no reference to meaning.","haphazardly stitching together sequences of linguistic forms"),
 ('parrots',"no communicative intent or reader model","Generated text is grounded in no intent, no world model and no model of the reader's mind.","not grounded in communicative intent"),
 ('parrots',"coherence lives in the reader","Seeming coherence is in the eye of the beholder, who imputes meaning where there is none.","coherence is in fact in the eye of the beholder"),
 ('parrots',"hegemonic voices over-represented","Web crawling, participation and filtering all favour those who hew to the hegemonic viewpoint.","most likely to hew to a hegemonic viewpoint"),
 ('parrots',"value-lock on static data","Static training data reifies older, less-inclusive framings as language moves on.","reifies older, less-inclusive understandings"),
 ('parrots',"filtering strips marginalised voices","Bad-word filtering attenuates the online spaces built by and for LGBTQ people.","online spaces built by and for LGBTQ people"),
 ('parrots',"bias amplification","LMs producing text reproduce and even amplify the biases in their input.","reproduce and even amplify the biases in their input"),
 # Kobis
 ('kobis',"cherry-picked output passes; random output fails","Judges could not detect human-selected GPT-2 poems but did detect randomly sampled ones.","failed to reliably detect the algorithmically-generated poems"),
 ('kobis',"human poems still preferred","Against professional poets, human poems won 64.90% of pairwise preferences; against novices 56.97%.","Human writers overall won 64.90% of the comparisons"),
 ('kobis',"failure to detect is ability, not effort","Incentivised judges still scored 50.21% in Study 1, so detection is a matter of ability not motivation.","not a matter of incentives but ability"),
 ('kobis',"no deep emotion","The authors state the results do not show machine creativity, which requires expression of deep emotion.","a feat that machines lack"),
 ('kobis',"selection is the capability","Only experimenter-selected poems passed as human, so human curation is doing the passing.","only poems selected by the experimenters successfully passed as human"),
 # Moon
 ('moon',"collective homogenisation","Each additional human essay adds more new ideas than each additional GPT-4 essay, and the gap widens with volume.","contributed more new ideas than did each additional GPT-4 essay"),
 ('moon',"diversity growth rate 31% then 11% of human","Base GPT-4's diversity growth rate was about 31% of human in Studies 1–2 and about 11% in Study 3.","only about 11% of the rate for the human-written essays"),
 ('moon',"newer model more homogenised","gpt-4-0125-preview homogenised more than gpt-4-0613, so the drift is not curing with versions.","actually yielded higher homogenization than the previous model"),
 ('moon',"diversity knobs cost coherence","Presence/frequency penalties raised individual diversity above human but at the expense of coherence and readability.","at the expense of coherence and readability"),
 ('moon',"homogenisation inherent to next-token plus RLHF","The authors attribute persistent homogenisation to most-probable-token selection and RLHF safety tuning.","homogenization may be an inherent feature of current LLMs"),
 # Weber-Wulff
 ('weberwulff',"detectors neither accurate nor reliable","Fourteen detectors all scored below 80% accuracy, biased toward calling text human.","neither accurate nor reliable"),
 ('weberwulff',"machine paraphrase defeats detection","Quillbot-paraphrased ChatGPT text was detected with only 26% accuracy.","The overall accuracy for this case was 26%"),
 ('weberwulff',"machine-translated human text flagged","Human essays machine-translated into English lost 20 points of accuracy, leaving traces read as AI.","machine translation leaves some traces of AI in the output"),
 ('weberwulff',"false accusations from GPTZero","For GPTZero half of positive classifications would be false accusations.","half of the positive classifications would be false accusations"),
 ('weberwulff',"L2 writers at risk","Translation-driven false positives put second-language students and researchers at risk of false accusation.","leaving L2 students (and researchers) at risk of being falsely accused"),
 # Liang
 ('liang',"non-native writers flagged as AI","Seven detectors misclassified TOEFL essays at an average 61.22% false-positive rate while US essays passed.","average false positive rate: 61.22%"),
 ('liang',"constrained expression reads as machine","Low-perplexity, low-variability human prose is what perplexity detectors penalise.","penalize writers with constrained linguistic expressions"),
 ('liang',"literary-language prompt evades detection","A self-edit prompt to use literary language cut detection of GPT essays from 100% to 13%.","detection rates from 100% to 13%"),
 # Perkins
 ('perkins',"baseline accuracy 39.5%; human controls only 67%","Detectors caught 39.5% of unmanipulated AI text and mislabelled a third of human controls.","only 67% of the tests were accurate"),
 ('perkins',"spelling errors and burstiness evade detection","Adding spelling errors (12.9%) or varying sentence length (15.9%) made AI text nearly undetectable.","highly effective in evading detection"),
 ('perkins',"15% false-accusation rate","Across detectors the false-accusation ratio was 15%, up to 50% for the most sensitive tool.","the rate of false accusations at 15%"),
 ('perkins',"atypical-perplexity writers penalised","The authors warn detectors may unfairly penalise students whose perplexity profile differs, including lower-proficiency writers.","write at a higher level of perplexity"),
 # gap
 ('gap',"neurodivergent-writer false positives — NOT FOUND in peer-reviewed literature","No peer-reviewed empirical study measuring detector false positives on autistic, ADHD or dyslexic writers was located (arXiv search, two Crossref queries dry; Semantic Scholar refused); nearest peer-reviewed evidence is Liang 2023 (non-native), Weber-Wulff 2023 (machine-translated L2) and Perkins 2024; Bender et al. 2021 names neurodivergent people only among groups harassed off the platforms that feed training data.",""),
]
S['gap'] = ("Sweep note (this run)", "", "search record", "n/a")
claims=[]; bad=[]
for k,f,c,q in C:
    if q and len(q.split())>=12: bad.append((k,q,len(q.split())))
    claims.append({"feature":f,"claim":c,"source":S[k][0],"url":S[k][1],"quote":q})
srcs=[{"title":S[k][0],"url":S[k][1],"kind":S[k][2],"substantive":True} for k in S if k!='gap']
srcs += [
 {"title":"arXiv listing: 2412.15299 (LAMA-UT, speech recognition) — wrong id given in brief for Walsh/Preus/Gronski","url":"https://arxiv.org/html/2412.15299","kind":"arXiv HTML (mis-cited id)","substantive":False},
 {"title":"arXiv title search 'Does ChatGPT Have a Poetic Style' (resolved correct id 2410.15299)","url":"https://arxiv.org/search/?query=Does+ChatGPT+Have+a+Poetic+Style&searchtype=title","kind":"search page","substantive":False},
 {"title":"CEUR-WS Vol-3834 (CHR 2024 proceedings table of contents; paper122.pdf pp.1201–1219)","url":"https://ceur-ws.org/Vol-3834/","kind":"proceedings ToC","substantive":False},
 {"title":"Weber-Wulff et al. 2023 arXiv mirror (abstract confirmation)","url":"https://arxiv.org/abs/2306.15666","kind":"arXiv abstract","substantive":False},
 {"title":"Köbis & Mossink arXiv mirror (abstract confirmation)","url":"https://arxiv.org/abs/2005.09980","kind":"arXiv abstract","substantive":False},
 {"title":"arXiv search 'neurodivergent AI detector' — no results","url":"https://arxiv.org/search/?query=neurodivergent+AI+detector&searchtype=all","kind":"search page (dry)","substantive":False},
 {"title":"Crossref query: AI detector neurodivergent students false positives — only Angelier 2026 SSRN essay, no empirical study","url":"https://api.crossref.org/works?query=AI+generated+text+detector+neurodivergent+students+false+positives&rows=15","kind":"API search (dry)","substantive":False},
 {"title":"Crossref query: AI detection autistic/autism writers false positive — no match","url":"https://api.crossref.org/works?query.bibliographic=AI+generated+text+detection+autistic+autism+writers+false+positive&rows=12","kind":"API search (dry)","substantive":False},
 {"title":"Semantic Scholar paper search (neurodivergent detector) — HTTP 429 twice","url":"https://api.semanticscholar.org/graph/v1/paper/search?query=AI+detector+neurodivergent+writing&limit=10","kind":"API search (refused)","substantive":False},
 {"title":"link.springer.com IJEI article page — redirect/IdP loop, not fetchable; cached PDF text used","url":"https://link.springer.com/article/10.1007/s40979-023-00146-z","kind":"publisher page (blocked)","substantive":False},
 {"title":"ACM DL Stochastic Parrots PDF — HTTP 403; cached ACM PDF text used","url":"https://dl.acm.org/doi/pdf/10.1145/3442188.3445922","kind":"publisher page (blocked)","substantive":False},
]
out={"claims":claims,"sourcesRead":srcs}
json.dump(out, io.open('found-ai-peer-reviewed-absentees.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
print("claims",len(claims),"sources",len(srcs),"bad-quote-length",bad)
# notes markdown
L=["# Sweep: peer-reviewed absentees — where LLM prose fails skilled human fiction/game writing","",
"Angle: the peer-reviewed studies the first sweep missed, read at the primary (arXiv HTML, ACL/ACM PDF text cached under peer-raw/). Every quotation below was grep-verified verbatim against the cached primary text (verify-absentees.py, 217/222 candidates matched; the five misses were replaced or dropped).","",
"## Corrections to the brief","- 'Does ChatGPT Have a Poetic Style?' is arXiv **2410.15299** (CHR 2024, CEUR Vol-3834 paper122), not 2412.15299 (which is LAMA-UT, a speech paper).","- Moon, Green & Kushlev is published in *Computers in Human Behavior: Artificial Humans* (2025, doi 10.1016/j.chbah.2025.100207); the 2024 date is the preprint.","- The neurodivergent-writer false-positive study could not be located in peer-reviewed literature (arXiv dry, two Crossref queries dry, Semantic Scholar 429 twice). Recorded as a gap; nearest evidence is Liang 2023 (non-native, Patterns), Weber-Wulff 2023 (machine-translated L2 text) and Perkins 2024 (IJEI).","- WebSearch budget for the session was exhausted at the start of this sweep (200/200); all discovery went through WebFetch on known ids, the arXiv search page, CEUR, Crossref and Semantic Scholar APIs, plus the first sweep's peer-raw cache.","",
"## Sources and the register each measured",""]
for k in S:
    if k=='gap': continue
    t,u,kind,reg=S[k]; L += [f"### {t}",f"- url: {u}",f"- kind: {kind}",f"- register measured: {reg}",""]
L += ["## Claims (feature — claim — quote)",""]
cur=None
for k,f,c,q in C:
    if k!=cur: L.append(f"### {S[k][0]}"); cur=k
    L.append(f"- **{f}** — {c}" + (f" — \"{q}\"" if q else ""))
L += ["","## Cross-cutting failure families (for the prose program)",
"1. Default mode that breaks through instruction: rhymed iambic quatrains (Walsh/Gronski), one narrative in new skins (Chakrabarty), bland default voice (Ippolito 2022), pizza/sushi/Christmas (Agarwal).",
"2. Subtext, unreliable narration and implication read literally (Subbiah; Mirowski 'comedy is all about subtext'; Chakrabarty 'too literal').",
"3. Safety/alignment flattening: no mean characters (Ippolito 2022), moralising endings and binary tone (Chakrabarty), refusal of dark or minority-coded comedy (Mirowski), 'we' as trained inclusivity (Walsh/Gronski), RLHF named as a homogenisation driver (Moon).",
"4. Hegemonic/Western default and homogenisation: Parrots (training data), Agarwal (measured convergence), Chakrabarty (writer-reported), Moon (collective diversity growth rate 31% then 11% of human).",
"5. Vocabulary signatures: echo/whisper/embrace/grace/heart/dance/dreams and openers In/Upon/Beneath (Walsh/Gronski) — lexical tells DO exist in verse even where the first sweep found none in prose.",
"6. Statistical cadence: human text dips into low-probability zones; generation cannot without bad word choices (Ippolito 2020); grammar is the least reliable tell, common-sense/irrelevance/contradiction the reliable ones (Dugan).",
"7. Selection is the capability: curated GPT-2 poems pass, random ones fail (Köbis & Mossink) — any human-curated sample overstates the generator.",
"8. Detection is unreliable and biased: below 80% (Weber-Wulff), 39.5% (Perkins), 61% false positives on non-native writers (Liang), paraphrase/spelling-error/burstiness evasion; therefore a detector cannot be the arbiter of prose quality or origin.",
"9. Meaning is imputed by the reader (Bender & Koller; Parrots): a fluent surface earns coherence credit it did not generate; the failure surfaces only when the text must be grounded (bear, catapult).",
]
io.open('find-ai-peer-reviewed-absentees.md','w',encoding='utf-8').write("\n".join(L)+"\n")
print("md bytes", len("\n".join(L)))
