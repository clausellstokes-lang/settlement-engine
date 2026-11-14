// REVIEW-W2-FIX-DATA-3: every new or reworded line of the stage 4114cf5a6..a1481aaf7 (and lines whose declaration the
// stage changed), with the conditions it is declared under. re: matched against one dumped page line.
// cond: the declaration as written ({needs, excludes, crisis}); the judge reads it against the town's own record.
const L = [];
const add = (id, file, fn, re, cond = {}, kind = 'reworded') => L.push({ id, file, fn, re: new RegExp(re), cond, kind });
const T = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// ── arrivalProse.js :: ARRIVAL_SENSES (iron dominant; arms dominant; faith; timber) and ARRIVAL_PEOPLE ──
const AS='src/data/arrivalProse.js'; const AF='arrivalScene.js :: composeArrivalScene (senses/people)';
add('A01',AS,AF,'The hammering echoes through all of .+, and the place plainly lives by its forges',{needs:['tier: ≥ town']},'declared');
add('A02',AS,AF,T('Forge smoke hangs over everything here, and the ring of the anvils never quite stops'),{needs:['tier: ≥ town']},'declared');
add('A03',AS,AF,T('Racks of new ironwork stand outside the workshops, waiting for the carts'),{needs:['tier: ≥ town'],excludes:['crisis: under_siege']},'declared');
add('A04',AS,AF,'.+ lives by its forges: the clang of iron is in every lane',{needs:['tier: ≥ town']},'declared');
add('A05',AS,AF,'The hammering echoes throughout .+, and most of it is the sound of blades being made',{needs:['institution: smith','tier: ≥ town']},'declared');
add('A06',AS,AF,T('Racks of spearheads and helms stand outside the workshops, waiting for the carts'),{needs:['institution: smith','tier: ≥ town']},'declared');
add('A07',AS,AF,T('Every forge you pass is making something meant for a war'),{needs:['institution: smith','tier: ≥ town'],excludes:['crisis: under_siege'],crisis:['wartime','insurgency']},'declared');
add('A08',AS,AF,T('A smith tests a new blade against a post, frowns'),{needs:['institution: smith']},'declared');
add('A09',AS,AF,'The bells of .+ answer one another across the roofs',{needs:['church','tier: ≥ town']},'declared');
add('A10',AS,AF,T('Pilgrims in travel-stained cloaks queue patiently'),{needs:['church'],excludes:['crisis: threat','crisis: unrest']},'declared');
add('A11',AS,AF,T('Stacks of seasoning planks line the road in'),{excludes:['crisis: under_siege']},'declared');
add('A12',AS,AF,T('People argue politics in the open, loudly'),{excludes:['crisis: occupied','crisis: under_siege']},'declared');
add('A13',AS,AF,T('A merchant swears an oath on his scales'),{needs:['market']},'declared');
add('A14',AS,AF,T('People argue law in the open as freely as they trade'),{excludes:['crisis: occupied','crisis: under_siege']},'declared');
add('A15',AS,AF,T('Tea is poured for a merchant before the bargaining begins'),{needs:['market']},'declared');
add('A16',AS,AF,T('Each lane seems to keep to its own trade'),{needs:['tier: ≥ town']},'declared');
add('A17',AS,AF,T('Craftspeople sit in rows, each row a different trade'),{needs:['market']},'declared');
// ── cultureProfiles.js :: CULTURE_PROFILES (declared) and CULTURE_LINE_SIBLINGS (twins), via materializeCulturalIdentity ──
const CP='src/data/cultureProfiles.js'; const CF='resolveConfig.js -> cultureProfiles.js :: materializeCulturalIdentity (culturalIdentity.*); arrival sight beat';
const C=[ // [id, text, needs(original), twin, twinNeeds]
 ['C01','steep roofs, enclosed craft yards, and carved lintels mark the older wards',['tier: ≥ town'],'steep roofs, enclosed yards, and carved lintels mark the older houses',['tier: ≤ village']],
 ['C02','arcaded market fronts define the principal square',['market','tier: ≥ village'],'deep eaves shade the open ground between the houses',['tier: ≤ hamlet']],
 ['C03','warm tile roofs and enclosed courtyards break up the stone streets',['tier: ≥ town'],'warm tile roofs and enclosed yards keep close together',['tier: ≤ village']],
 ['C04','fountains, steps, and reused columns give the civic center a layered age',['tier: ≥ village'],'a well, worn steps, and an old carved stone give the houses a layered age',['tier: ≤ hamlet']],
 ['C05','shaded arcades and latticed upper windows soften the market streets',['market','tier: ≥ village'],'latticed windows look out on the lane between the houses',['tier: ≤ hamlet']],
 ['C06','caravan courts and covered lanes make movement through the merchant quarter deliberate',['market','tier: ≥ town'],'covered lanes and shaded gateways make movement between the houses deliberate',['tier: ≤ village']],
 ['C07','carved roof beams and long hall ridges dominate the older quarter',['tier: ≥ town'],'carved roof beams and a long hall ridge stand above the other roofs',['tier: ≤ village']],
 ['C08','palisade lines and river stairs reveal successive stages of expansion',['palisade','river','tier: ≥ town'],'painted gables and fenced garden plots face the lane',['tier: ≤ village']],
 ['C09','ward gates, shop fronts, and planted courtyards divide public from household space',['tier: ≥ town'],'gates, low walls, and planted courtyards divide public from household space',['tier: ≤ village']],
 ['C10','the main street ends at the administrative precinct',['tier: ≥ town'],'a straight lane runs between the houses to the oldest courtyard',['tier: ≤ village']],
 ['C11','a raised ceremonial precinct overlooks a broad and busy open plaza',['tier: ≥ town'],'plastered house platforms face one another across a swept open yard',['tier: ≤ village']],
 ['C12','causeways and managed water divide the settlement into organized neighborhoods',['tier: ≥ village'],'a raised path and a water channel run between the house compounds',['tier: ≤ hamlet']],
 ['C13','carved stone, plastered courtyards, and workshop lanes layer sacred and commercial space',['market','tier: ≥ village'],'plastered courtyards and shaded doorways stand among the houses',['tier: ≤ hamlet']],
 ['C14','occupational quarters cluster around shared wells and water channels',['tier: ≥ town'],'households cluster around shared wells and water channels',['tier: ≤ village']],
 ['C15','a colonnaded market edge frames the busiest civic ground',['market','tier: ≥ village'],'a low wall and a shade tree mark the open ground between the houses',['tier: ≤ hamlet']],
 ['C16','workshops, shrines, and meeting halls crowd the approaches to the agora',['market','institution: temple','tier: ≥ village'],'a shade tree and a worn bench mark the ground where people meet',['tier: ≤ hamlet']],
 ['C17','Stone and plaster courtyard houses rise around an agora, stoas, shrines, and steep connecting lanes.',['market','tier: ≥ town'],'Stone and plaster houses with whitewashed courts stand close together.',['tier: ≤ village']],
 ['C18','A fortified high precinct overlooks the market, theater, and workshops; where geography permits, it also overlooks a working harbor.',['market','tier: ≥ town'],'Whitewashed stone and plaster houses look out over the fields around them.',['tier: ≤ village']],
];
for (const [id,t,n,tw,tn] of C){ const ci=(s)=>'(?i:'+T(s.replace(/\.$/,''))+')'; add(id,CP,CF,T(t.replace(/\.$/,'')).replace(/^./,(c)=>`[${c}${c.toUpperCase()}]`),{needs:n},'declared'); add(id+'t',CP,CF,T(tw.replace(/\.$/,'')).replace(/^./,(c)=>`[${c}${c.toUpperCase()}]`),{needs:tn},'new twin'); }
add('C19',CP,CF,'[Ww]hitewashed courts and stone steps catch the light between the houses',{},'reworded');
add('C20',CP,CF,T('Public ovens, market vendors, and shared dining customs make food distribution visibly civic'),{needs:['market']},'reworded');
add('C21',CP,CF,T('Herds and field grain set a strongly seasonal food calendar'),{},'reworded');
add('C22',CP,CF,T('Fermentation, careful use of water, and intensive garden plots shape the food supply'),{},'reworded');
// ── economicData.js :: TRADE_DEPENDENCY_NEEDS (Mages' guild ley lines) ──
add('E01','src/data/economicData.js','TRADE_DEPENDENCY_NEEDS svcs (the shortage chip)','[Ll]ey lines|arcane energy for guild operations',{},'reworded');
// ── historyData.js / historyGenerator.js ──
const HD='src/data/historyData.js'; const HG='historyGenerator.js';
add('H01',HD,HG+' :: tension/timeline hooks',T('The ailing ruler wants a final errand completed before naming a successor'),{excludes:['ruler: council','ruler: elder','crisis: succession_void']},'declared');
add('H02',HD,HG+' :: tension/timeline hooks',T('Someone is poisoning the ruler slowly'),{excludes:['ruler: council','ruler: elder','crisis: succession_void']},'declared');
add('H03',HD,HG+' :: hooks',T('A store of the scarce goods is being kept off the market on purpose'),{needs:['market']},'reworded');
add('H04',HD,HG+' :: hooks',T('A former occupier officer has returned under a false identity'),{excludes:['crisis: occupied']},'declared');
add('H05',HD,HG+' :: hooks',T('A healer who profited enormously during the plague'),{needs:['healer']},'declared');
add('H06',HD,HG+' :: hooks',T('The affected district is slowly spreading its strangeness'),{needs:['tier: ≥ town']},'declared');
add('H07',HD,HG+' :: generateEventNarrative {quarter} (HISTORY_QUARTER_WORDS)',"the merchants' quarter|the residential district|the temple district|\\bthe waterfront\\b",{},'declared');
add('H08',HD,HG+' :: {quarter}/{location} small-place words','the low ground|(?<!lead from |seen at )the edge of the fields|the yards behind the houses|the houses nearest the (shore|river)',{needs:['tier: ≤ village']},'new twin');
add('H09',HD,HG+' :: sizedHistoryText (fire twins)','burned through the houses and their outbuildings|spread from roof to roof before anyone|took house after house before it was put out',{needs:['tier: ≤ village']},'new twin');
add('H10',HD,HG+' :: fire originals','across whole districts before it could be checked|across entire districts before anyone|street by street until whole quarters were gone',{needs:['tier: ≥ town']},'declared');
add('H11',HD,HG+' :: sizedResourceEvent (Great Construction)','ambitious stone (construction|building) transformed the settlement',{},'reworded');
add('H12',HD,HG+' :: sizedResourceEvent',"[Qq]uarrymen's (guild|families) retain",{},'new twin');
add('H13',HD,HG+' :: Harvest Compact','the major farming families (and the guilds negotiated|agreed) a formal compact',{},'reworded');
add('H14',HD,HG+' :: Arcane Incident','permanently altering (a district|part) of the settlement|[Aa]ffected (district|ground) retains residual|Arcane regulatory body established',{},'new twin');
add('H15',HD,HG+' :: Iron Dispute','shaped who (controls extraction|holds those rights) to this day|cheated out of the original (mining contract|rights to the deposits)|Fortified extraction sites',{},'new twin');
add('H16',HD,HG+' :: livelihoodLead','Among the trades the place lives by, the .+ trade is under strain|trade is the largest the place lives by, and it is under strain|Life here runs mostly on the .+ trade, and that trade is under strain',{},'reworded');
// ── inlandDescriptions.js ──
const ID='src/data/inlandDescriptions.js'; const IF='assembleInstitutions.js inst.desc (inland)';
add('D01',ID,IF,T('An open stall or small roofed shed selling salted and smoked fish. Packed in barrels, it keeps for months'),{},'reworded');
add('D02',ID,IF,T("and now and then a whole household's goods"),{},'reworded');
// ── institutionalCatalog.js / institutionDescVariants.js / institutionDescColour.js (inst.desc) ──
const IC='src/data/institutionalCatalog.js + institutionDescVariants.js'; const DF='assembleInstitutions.js / cascadePass.js inst.desc';
add('I01',IC,DF,T('Nets, traps, and drying racks, kept by the households that fish the water'),{},'reworded');
add('I02',IC,DF,T('Nets, traps, and racks for drying. Whoever fishes the water here keeps them'),{},'reworded');
add('I03',IC,DF,T('The nets, the traps, the drying racks: what the water gives, the fishing households take'),{},'reworded');
add('I04',IC,DF,T("A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured"),{needs:['tier: ≤ hamlet']},'reworded');
add('I05',IC,DF,T('Felling crews and a stacking yard at the forest edge, cutting timber and charcoal wood and carting both'),{},'reworded');
add('I06',IC,DF,'A mine of shafts and adits, with (its )?winding gear and ore carts|A shaft driven into the deposits, with winding gear and ore carts at the pithead',{},'reworded');
add('I07',IC,DF,"A stone quarry with yards for dressing the stone. Much of the region's building stone|A stone quarry, with yards beside it for dressing the stone|Yards for dressing stone stand beside the quarry face",{},'reworded');
add('I08',IC,DF,'A stone quarry, opened by quarrymen with picks and wedges|A stone quarry, its blocks cut and dressed by a gang of quarrymen|A quarry opened with picks and wedges, its stone cut',{},'reworded');
add('I09',IC,DF,'A quarry of building stone, laid out in ordered workings|A building-stone quarry laid out in an ordered working|A quarry for building stone, opened with method',{},'reworded');
add('I10',IC,DF,T('Where the bulk trade is loaded and unloaded, and the cargoes are tallied in and out'),{},'reworded');
add('I11',IC,DF,'Sells herbal medicines, poultices, and common remedies. No magical compounds|Herbal medicines, poultices, and everyday remedies for sale. Nothing magical here|Magical compounds and acid are no part of this trade',{},'reworded');
add('I12',IC,DF,'Scores of parishes, from fifty to a hundred and more|Parishes by the score, anywhere from fifty',{needs:['tier: = metropolis']},'reworded');
add('I13',IC,DF,"council of senior druids who govern their circle's relationship with the settlement|Senior druids who govern how their circle deals with the town|charged with their circle's standing in the town",{},'reworded');
add('I14',IC,DF,T('Turns malted grain into ale by the barrel. Only bread takes more of the grain'),{},'reworded');
add('I15',IC,DF,'Supplies the households\\.|It supplies the homes hereabouts|The households are stocked from here',{},'new twin');
add('I16',IC,DF,'Builds and repairs flat-bottomed craft for shallow water|Builds and mends flat-bottomed boats for shallow water|Shallow-water boats, all flat-bottomed',{excludes:['river']},'new twin');
add('I17',IC,DF,'A flat-bottomed ferry across the water|A flat-bottomed ferry over the water|The water is crossed here by a flat-bottomed ferry',{excludes:['river']},'new twin');
add('I18',IC,DF,'None can reach it while the roads are held|cut off while the siege holds the roads|though none can come while the roads are held',{crisis:['under_siege']},'new twin');
add('I19',IC,DF,'With the roads held, no one crosses and nothing is taken|no one has crossed since the roads were cut|Since the siege closed the roads, there are none to gather',{crisis:['under_siege']},'new twin');
add('I20',IC,DF,'A priest says the words when one can be brought in time|A priest speaks when one can be fetched in time|The rites wait for a priest when one can be fetched',{needs:['church access']},'new twin');
add('I21',IC,DF,'No clergy lives near enough to speak over anyone|No clergy is near enough to speak|The rites are said by neighbours because there is nobody else',{excludes:['church access']},'declared');
add('I22',IC,DF,'Regional merchants\\. Luxury goods available|Merchants from across the region, and luxuries to be had|A yearly draw for regional traders, with fine goods',{excludes:['crisis: under_siege']},'declared');
add('I23',IC,DF,'Minor but steady revenue|The income is small but never fails|Modest revenue, but steady',{excludes:['crisis: under_siege']},'declared');
// ── institutionServices.js :: INSTITUTION_SERVICES + SERVICE_DESC_SIBLINGS ──
const IS='src/data/institutionServices.js'; const SF='services (availableServices / institution cards)';
add('S01',IS,SF,T('Ale by the barrel, for households laying in a stock'),{},'new twin');
add('S02',IS,SF,T('Bulk supply to alehouses. Priced by barrel'),{needs:['institution: tavern']},'declared');
add('S03',IS,SF,T('The yearly fair that draws merchants from across the region. None can reach it'),{crisis:['under_siege']},'new twin');
add('S04',IS,SF,T('Once-a-year market drawing merchants from across the region'),{excludes:['crisis: under_siege']},'declared');
add('S05',IS,SF,T('Ore cut underground by the crews and brought out by cart for sorting'),{needs:['tier: ≥ town']},'new twin');
add('S06',IS,SF,T('Surface-level ore extraction. Lower yield than shaft mining'),{excludes:['tier: ≥ town']},'declared');
add('S07',IS,SF,'Flat-bottomed cargo boats for shallow water|Small boats in the shallows take constant punishment',{excludes:['river']},'new twin');
add('S08',IS,SF,'Flat-bottomed cargo barges for river transport|River traffic takes constant punishment',{needs:['river']},'declared');
add('S09',IS,SF,T('though with the roads held the rooms stand mostly empty'),{crisis:['under_siege']},'new twin');
add('S10',IS,SF,T('while the siege holds the roads, none go out'),{crisis:['under_siege']},'new twin');
add('S11',IS,SF,T('Beds, meals, and stabling for travelers on the road')+'|'+T('Fresh relay horses for coaches and dispatch riders'),{excludes:['crisis: under_siege']},'declared');
add('S12',IS,SF,'Transport foot travelers and small goods across the water|Move small amounts of cargo across the water',{excludes:['river']},'new twin');
add('S13',IS,SF,'Transport foot travelers and small goods across the river|Move small amounts of cargo across the river',{needs:['river']},'declared');
// ── stressTypes.js :: STRESS_TYPE_SIBLINGS (famine hook) via assembleSettlement ──
add('K01','src/data/stressTypes.js','assembleSettlement.js crisisHook',T('Someone here still has food put by, enough to matter'),{crisis:['famine'],excludes:['institution: mill']},'new twin');
add('K02','src/data/stressTypes.js','assembleSettlement.js crisisHook',T('A grain merchant has food, enough to matter'),{crisis:['famine'],needs:['institution: mill']},'declared');

add('K03','src/data/stressTypes.js (table at base; wired by the stage)','assembleSettlement.js crisisHook',T('The first person to name the outbreak has gone quiet'),{crisis:['plague_onset'],excludes:['healer']},'reached twin');
add('K04','src/data/stressTypes.js (table at base; wired by the stage)','assembleSettlement.js crisisHook',T('The healer who identified the outbreak first has gone quiet'),{crisis:['plague_onset'],needs:['healer']},'declared');
add('K05','src/data/stressTypes.js (table at base; wired by the stage)','assembleSettlement.js viabilityNote',T('Travel is discouraged, and some goods stop arriving')+'(?<!Fewer people come to market, travel is discouraged, and some goods stop arriving)',{excludes:['market']},'reached twin');
add('K06','src/data/stressTypes.js (table at base; wired by the stage)','assembleSettlement.js viabilityNote',T('Fewer people come to market, travel is discouraged, and some goods stop arriving'),{needs:['market']},'declared');
add('K07','src/data/stressTypes.js (table at base; wired by the stage)','assembleSettlement.js viabilityNote',T("The tithe is split, and the old house's property has no clear owner"),{crisis:['religious_conversion'],needs:['institution: temple'],excludes:['market']},'reached twin');
add('K08','src/data/stressTypes.js (table at base; wired by the stage)','assembleSettlement.js viabilityNote',T('The contested religious authority has left a gap in the institutions'),{needs:['institution: temple']},'declared');
// ── the last read's findings (F1-F4), each row checked cured ──
const PRIOR = [
 ['F1a','src/data/institutionDescVariants.js','granary original under famine','prevents famine|hold off famine',{excludes:['crisis: famine']},'prior F1'],
 ['F1b','src/data/institutionDescVariants.js','granary famine twin','meant to carry the town through bad harvests|The famine is drawing them down',{crisis:['famine']},'prior F1 twin'],
 ['F1c','src/data/institutionDescVariants.js','charnel originals (carts out)','Carts go out at dusk to ground bought beyond the walls|the carts that go out at dus',{excludes:['crisis: under_siege']},'prior F1'],
 ['F1d','src/data/institutionDescVariants.js','charnel siege twins','no cart goes out to the new ground|with the roads cut it now holds the newly dead',{crisis:['under_siege']},'prior F1 twin'],
 ['F2','src/data/institutionDescVariants.js','customs house port line (cascade)','passing through the port or the main roads|by road or harbour',{needs:['institution: docks']},'prior F2'],
 ['F4','src/data/institutionDescVariants.js','Elder Grove city word',"relationship with the city|deals with the city|standing in the city|the city's spread",{needs:['tier: ≥ city']},'prior F4'],
];
for (const [id,file,fn,re,cond,kind] of PRIOR) L.push({ id, file, fn, re: new RegExp(re), cond, kind });
export default L;
