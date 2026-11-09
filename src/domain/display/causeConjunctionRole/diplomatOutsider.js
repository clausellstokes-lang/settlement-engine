/**
 * causeConjunctionRole/diplomatOutsider.js — the ROLE-TIER conjunction lines for
 * diplomat_outsider — the envoy (dispatches, patrons abroad, protocol).
 *
 * One authored leaf of the role table assembled in ../causeConjunctionRoleContent.js;
 * see that file for the tier contract, the stage semantics, and the SIDE-CAR LAW
 * (generation never imports this; it is read only through the lazy dossier NPC card).
 * Keyed causeClass → lifecycleStage → lines. Pure data: no imports, no slots, no rng.
 * Deliberately NOT frozen here — the assembled table takes the single shallow
 * Object.freeze, exactly as before the split, so the read surface is unchanged.
 *
 * @type {Record<string, Record<string, ReadonlyArray<string>>>}
 */
export const DIPLOMAT_OUTSIDER_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The mission\'s money stopped coming, and the envoy found other buyers for the dispatches. The reports still go home, and copies go to whoever pays the envoy.',
      'With the embassy unfunded, the envoy sells the dispatches by the page, and the buyers are never the people they are addressed to.',
    ],
    're-caused': [
      'Whatever first drew the envoy in is over, but now the mission\'s money has run short, and the envoy calls the sold dispatches keeping the embassy open.',
    ],
    reformed: [
      'The funding resumed and the envoy stopped the copies; the buyers were named in the next dispatch home, above the envoy\'s own confession.',
      'With the mission funded again, the envoy came clean; the sold pages were listed, and the retainers returned through channels everyone could see.',
    ],
    historicized: [
      'The mission has its money again, but copies of the dispatches still go out to the same buyers.',
    ],
    'exposed-public': [
      'It is public that the envoy\'s dispatches had subscribers, and every government that read them is re-reading its decisions.',
      'It is out that the envoy sold what the mission saw, and the town now knows who was reading its reports.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now the mission\'s money runs short, and the envoy sells the dispatches to whoever will pay.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The courier lines are cut, so the envoy\'s letters travel with smugglers, who read them on the way. The envoy knows, and is paid well not to mind.',
      'Letters still move because the envoy hired the only carriers left. The seals arrive broken and pressed again, and the envoy is paid every month to say nothing.',
    ],
    're-caused': [
      "The envoy's first reason is gone, but now the courier lines are cut, and the carriers keep paying to read the letters.",
    ],
    reformed: [
      'The courier lines were restored and the envoy dropped the smuggler carriers; the read letters were re-sent sealed, with an accounting of what had leaked.',
      'With honest couriers riding again, the envoy came clean; the not-minding fees were surrendered, and the correspondents warned of every broken seal.',
    ],
    historicized: [
      'The courier lines are open again, but the envoy still sends the letters with the smugglers, who still pay to read them.',
    ],
    'exposed-public': [
      'It is now known that the envoy let the mission\'s letters be read on the road for pay, and everyone who wrote to the mission is wondering what was seen.',
      'It is out that the envoy sold the reading of the mail to its carriers, and the town is guessing what went through unsealed.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now the courier lines are cut, and whoever carries the letters pays the envoy to read them.',
    ],
  },
  depleted: {
    attributed: [
      'The mission has nothing left to give, so the envoy promises concessions no one authorized and keeps what people pay for them.',
      'The mission\'s gift chest is empty, so the envoy trades in promises instead and pockets what they fetch, knowing none will be kept.',
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now the gift chest is empty, and the envoy keeps selling promises no one will keep.",
    ],
    reformed: [
      'The mission was resupplied and the envoy recalled the false promises, each with its compensation; the fetched consideration was returned first.',
      'With the gift chest refilled, the envoy came clean; the unauthorized concessions were disavowed by the envoy before any injured party asked.',
    ],
    historicized: [
      'The mission is supplied again, but the envoy still sells false promises to anyone who will pay.',
    ],
    'exposed-public': [
      'It is public that the envoy sold concessions no one authorized, and the holders of those promises are presenting them for payment.',
      'It is out that the envoy took payment for promises that were never going to be kept, and the people who paid are at the door.',
    ],
    're-adjudicated': [
      "Whoever paid the envoy before is gone, but the mission's stores have run dry, and the envoy goes on selling promises no one will keep.",
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo terms cross the envoy\'s desk before they are announced, and certain merchants are never caught out. The envoy sells them the news before every proclamation.',
      'The envoy sells word of trade policy: who will be embargoed, when, and for what, quietly, to those whose fortunes turn on knowing first.',
    ],
    're-caused': [
      'What first drew the envoy in has passed, but now an embargo chokes the trade, and the envoy sells its terms before they are announced.',
    ],
    reformed: [
      'The embargo lifted and the envoy disclosed the advance sales; the forewarned merchants were named to the ones who were not.',
      'When the trade war ended, the envoy came clean; the timing fees were surrendered, and the desk sealed against the habit.',
    ],
    historicized: [
      'The embargo is over, but the envoy still sells word of trade policy to the same merchants before it is announced.',
    ],
    'exposed-public': [
      'It is public that the embargo\'s terms were sold in advance from the envoy\'s desk, and the ruined are matching their losses to the forewarned\'s gains.',
      'It is out that the envoy sold the town\'s trade news in advance, and the buyers\' sudden fortunes show when each sale was made.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now an embargo strangles the trade, and the envoy sells its terms in advance to whoever pays.',
    ],
  },
  'levied-away': {
    attributed: [
      "With the town's fighters away at war, the envoy's reports home decide what help comes and when. The envoy cuts them now, paid by those who want the help to come late.",
      "While the town's fighters are away, the envoy's dispatches are the town's voice abroad, and someone has bought it; what home hears is chosen by whoever pays the envoy.",
    ],
    're-caused': [
      'Whatever first drew the envoy in is over, but now the fighters are away at war, and the envoy keeps taking pay to cut the dispatches.',
    ],
    reformed: [
      'The companies came home and the envoy sent the uncut record after the cut one, with the differences marked and the fees enclosed.',
      'When the strength returned, the envoy came clean; the curated dispatches were confessed, and the curators named to both capitals.',
    ],
    historicized: [
      'The fighters are home, but the envoy still cuts the dispatches for whoever pays.',
    ],
    'exposed-public': [
      'It is public that the town\'s voice abroad was edited for pay while its men fought, and the withheld paragraphs are being read aloud.',
      'It is out that the envoy was paid to leave things out of the dispatches, and the town knows now why help never came.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now the fighters are levied away to war, and the envoy cuts the dispatches for whoever pays.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'Buyers abroad pay the envoy for honest reports, and the honest report is that this town cannot defend itself. The envoy sends it abroad every month, with the gate watches attached.',
      'The envoy sells word of the emptied garrison abroad; the weakness goes out in polite language, and the envoy\'s fee comes back.',
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now the garrison is hollowed out, and the envoy is paid for reports on its weakness.",
    ],
    reformed: [
      'The garrison was refilled and the envoy corrected the record abroad; the weakness reports were retracted, and the retraction cost the fees.',
      'With the ranks restored, the envoy came clean; the exported assessments were confessed to the council with the patrons\' names.',
    ],
    historicized: [
      'The garrison is back to strength, but the envoy still sends reports of its weakness abroad to the same buyers.',
    ],
    'exposed-public': [
      'It is public that the envoy exported the town\'s weakness with the gate rotations attached, and the town is changing the rotations first and the locks second.',
      'It is out that the envoy sold reports on the emptied garrison abroad every month, and the town is worried about who bought them.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but the garrison stands hollow now, and the envoy sells reports on it to whoever pays.',
    ],
  },
  'siege-scarred': {
    attributed: [
      "The envoy carries peace terms between the camps and sells each camp an early look at the other's terms.",
      'The war\'s talks go through the envoy\'s satchel, and each side pays to read it, so both bargain against terms they have bought.',
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now the war presses in, and the envoy sells looks inside the satchel.",
    ],
    reformed: [
      'The war receded and the envoy confessed the pre-readings to both camps at once, which is the only safe order to do it in.',
      'With the pressure lifted, the envoy came clean; the leak fees were surrendered, and the satchel carried its last terms sealed.',
    ],
    historicized: [
      'The war has moved on, but the envoy still sells looks inside the satchel to anyone who pays.',
    ],
    'exposed-public': [
      'It is public that both camps bought each other\'s terms from the envoy\'s satchel, and the peace they signed is being re-read for what the leaking bought.',
      'It is out that the envoy sold each side the other\'s terms, and both sides want their money back.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now the war presses close, and whoever pays can read the satchel.',
    ],
  },
  occupation: {
    attributed: [
      'The envoy now answers to the occupier. The protests the envoy files are empty by agreement, and townsfolk who ask the envoy for help are reported for asking.',
      "The mission survives the occupation by serving it. The envoy's complaints are softened before they are sent, the occupier's answers are agreed beforehand, and the town believes the protests are real.",
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now the mission stands by the occupier's leave, and the empty protests keep it that way.",
    ],
    reformed: [
      'The occupier withdrew and the envoy published the agreement that had hollowed the protests, with every reported name and an unsoftened apology.',
      'With the occupation ended, the envoy came clean; the pre-approved theater was confessed, and the reported petitioners sought out one by one.',
    ],
    historicized: [
      'The occupier is gone, but the envoy still files protests as if the occupier were reading them.',
    ],
    'exposed-public': [
      'It is public that the envoy\'s protests were theater by agreement, and the petitioners who were reported for asking help are the first to speak.',
      'It is out that the envoy bought the occupier\'s favor with empty complaints and the names of those who asked for help.',
    ],
    're-adjudicated': [
      "Whoever paid the envoy before is gone, but now the occupier holds sway, and the envoy files the same empty protests for it.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron rewards betrayal above all, and the envoy\'s work is full of trusts to betray. Each broken confidence brings the envoy favor, and the envoy has had a great deal of it.',
      'A patron that rewards betrayed trust pays for the envoy\'s treacheries, and the mission\'s pouch is full of other people\'s secrets.',
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now a dark patron rewards the betrayals, and its favor keeps them coming.",
    ],
    reformed: [
      "The patron's shadow lifted and the envoy stopped the betrayals; the broken confidences were confessed to their owners, unprompted and complete.",
      'With the rewarding patron gone, the envoy came clean; the sponsored treacheries lost their wages, and the envoy found nothing else in them.',
    ],
    historicized: [
      'The patron is gone, but the envoy still betrays whoever trusts the mission.',
    ],
    'exposed-public': [
      'It is now known that the envoy\'s betrayals were offerings to a dark patron, and everyone the envoy betrayed is telling their story again.',
      'It is out that a dark patron paid for the envoy\'s betrayals, and the governments that trusted the envoy have been told.',
    ],
    're-adjudicated': [
      "Whoever paid the envoy before is gone, but now a dark patron rewards betrayal, and the envoy betrays trusts for its favor.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays the mission\'s expenses now, and its missionaries travel in the envoy\'s train as clerks and translators, on real papers the envoy signs.',
      'The rival faith moves its preachers and its money through the envoy\'s immunity, and its payments keep the embassy running.',
    ],
    're-caused': [
      "The envoy's first reason is gone, but now a rival faith presses in and pays, and its missionaries travel on the envoy's papers.",
    ],
    reformed: [
      'The rival faith withdrew and the envoy voided the false credentials; the corridor closed, and the funded expenses were repaid.',
      'When the conversion pressure broke, the envoy came clean; the baggage-clerks were named as preachers, and the immunity restored to its purpose.',
    ],
    historicized: [
      'The rival faith has given up on the town, but its people still travel on the envoy\'s papers.',
    ],
    'exposed-public': [
      'It is public that the mission\'s baggage carried the rival faith\'s preachers under real credentials, and the signing hand is known.',
      'It is out that the envoy lent the mission\'s immunity to the rival faith for pay, and both congregations are checking the clerks.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now a rival faith presses in, and its money buys passage for its people on the envoy\'s papers.',
    ],
  },
  secularization: {
    attributed: [
      'The mission\'s oaths were sworn to a faith gone cold, and the envoy no longer keeps them: sealed letters are opened, and sworn safe-conducts are sold twice.',
      'With the faith gone cold, the envoy\'s sworn papers mean nothing. Safe-conducts are sold again to second buyers, and the first holders find out at the gate.',
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now the faith has gone cold, the oaths mean nothing, and the envoy sells safe-conducts twice.",
    ],
    reformed: [
      'The faith revived and the envoy re-swore the office\'s oaths; the double-issued safe-conducts were honored twice over at the mission\'s cost.',
      'When belief returned, the envoy came clean; the opened seals were confessed, and the instruments made single and sacred again.',
    ],
    historicized: [
      'The faith has warmed again, but the envoy still sells safe-conducts twice, and the first holders still find out at the gate.',
    ],
    'exposed-public': [
      'It is public that the envoy resold sworn safe-conducts while the oaths meant nothing, and the stranded holders are presenting both copies.',
      'It is out that the envoy opened sealed letters while the faith was cold, and the returning faithful are going through them.',
    ],
    're-adjudicated': [
      "Whoever paid the envoy before is gone, but now the faith has gone cold, and no oath stops the envoy selling the papers twice.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The temple\'s disgrace must not reach foreign courts, and the temple pays the envoy well to see it does not. Each month the envoy knows more of the temple\'s secrets.',
      'Abroad, the clergy scandal is only a rumor, and the envoy keeps it that way: dispatches are cut, questions are sent the wrong way, and the temple pays well for it.',
    ],
    're-caused': [
      "The envoy's first reason is gone, but now the priesthood is tainted, and the priests pay the envoy to keep the scandal quiet abroad.",
    ],
    reformed: [
      'The priesthood was cleansed and the envoy ended the containment; the trimmed dispatches were completed and re-sent, with the retainer returned.',
      "With the clergy's scandal resolved, the envoy came clean; the misdirected inquiries were answered honestly, however late.",
    ],
    historicized: [
      'The temple has been set in order, but the envoy still trims the dispatches about it, and the temple still pays.',
    ],
    'exposed-public': [
      'It is now known that the envoy kept the scandal from the foreign courts, and they are reading the full reports at last.',
      'It is out that the envoy hid the temple\'s disgrace abroad for pay, and the envoy signed for every coin.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now the priesthood is tainted, and the temple pays the envoy to keep it quiet abroad.',
    ],
  },
  captured: {
    attributed: [
      'The underworld has learned that diplomatic baggage is never searched. Its goods travel under the mission\'s seals, and the envoy is paid by the weight.',
      'The underworld holds the offices, and it uses the mission\'s immunity most of all. The envoy\'s pouches ride heavy, and not with letters.',
    ],
    're-caused': [
      "Whatever first drew the envoy in is over, but now the underworld holds the offices, and it uses the envoy's immunity.",
    ],
    reformed: [
      'The capture was broken and the envoy opened the baggage to the magistrates; the tonnage records were produced from the envoy\'s own files.',
      "With the syndicate's grip broken, the envoy came clean; the heavy pouches were confessed, and the immunity surrendered until trust returned.",
    ],
    historicized: [
      'The underworld\'s hold on the offices is broken, but the envoy\'s pouches still ride heavy with goods no one searches.',
    ],
    'exposed-public': [
      'It is now known that the mission\'s baggage carried the underworld\'s goods, and every unsearched crossing is being checked again.',
      'It is out that the envoy rented the mission\'s seals to the underworld by weight, and the envoy took a fee on every load.',
    ],
    're-adjudicated': [
      "Whoever filled the pouches before is gone, but now the underworld holds the offices, and its goods travel the same route under the envoy's seal.",
    ],
  },
  scandal: {
    attributed: [
      'The town\'s scandal is worth money abroad, and the envoy sells it: names go out in the dispatches, priced one by one, and foreign buyers keep them for later.',
      'Every foreign government wants to know whose hands are dirty in this town, and the envoy sells the answer. The scandal\'s details leave in the dispatch case, and the fees come back in it.',
    ],
    're-caused': [
      "The envoy's first reason is gone, but now a scandal has broken, and the envoy sells its details abroad.",
    ],
    reformed: [
      'The scandal burned out and the envoy recalled the briefs where recalling was possible, and confessed the rest to the council by name.',
      'When the scandal settled, the envoy came clean; the export fees were surrendered, and the buyers\' identities filed with the magistrates.',
    ],
    historicized: [
      'The scandal has died down at home, but the envoy still sells its details to buyers abroad.',
    ],
    'exposed-public': [
      'It is public that the envoy sold the town\'s disgrace abroad by the name, and the named are learning which capitals hold their files.',
      'It is out that the envoy sold the scandal\'s details abroad, and foreign governments now hold the town\'s shame.',
    ],
    're-adjudicated': [
      'Whoever paid the envoy before is gone, but now a scandal has broken, and the envoy sells the names in it to whoever pays abroad.',
    ],
  },
};
