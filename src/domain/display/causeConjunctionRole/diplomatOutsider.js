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
      'The mission\'s funding stopped arriving, and the envoy found other readers for the dispatches; the reports still go home, but copies go wherever the retainer comes from.',
      'An unfunded embassy is a stall in a market, and the envoy has learned to trade; the dispatches are sold by the page, and the buyers are never the addressee.',
    ],
    're-caused': [
      'What first bent the envoy has passed; the unfunded mission bends them now, and the sold dispatches are called keeping the embassy open.',
    ],
    reformed: [
      'The funding resumed and the envoy stopped the copies; the buyers were named in the next dispatch home, above the envoy\'s own confession.',
      'With the mission funded again, the envoy came clean; the sold pages were listed, and the retainers returned through channels everyone could see.',
    ],
    historicized: [
      'The funding recovered, but the copies still go out; the poverty that excused them is old accounting.',
    ],
    'exposed-public': [
      'It is public that the envoy\'s dispatches had subscribers, and every government that read them is re-reading its decisions.',
      'The subscription list is out: the envoy retailed the mission\'s eyes, and the town has learned who watched through them.',
    ],
    're-adjudicated': [
      'The syndicate paying the envoy is destroyed, but the mission is still unfunded, and the dispatch trade has found new subscribers already.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The courier lines are cut, so the envoy\'s letters travel with smugglers, and the smugglers read as they carry; the envoy knows, and is paid handsomely for the not-minding.',
      'Correspondence still moves because the envoy hired the only carriers left; the seals arrive broken and re-pressed, and the envoy\'s silence about it has a monthly rate.',
    ],
    're-caused': [
      "The envoy's first reason is gone; the dead courier lines reason for them now, and the read-in-transit letters keep paying the rate.",
    ],
    reformed: [
      'The courier lines were restored and the envoy dropped the smuggler carriers; the read letters were re-sent sealed, with an accounting of what had leaked.',
      'With honest couriers riding again, the envoy came clean; the not-minding fees were surrendered, and the correspondents warned of every broken seal.',
    ],
    historicized: [
      'The courier lines are mended, but the letters still ride with the quiet carriers; the necessity that hired them is over.',
    ],
    'exposed-public': [
      'It is public that the mission\'s letters were read in transit with the envoy\'s paid consent, and every correspondent is burning old assumptions.',
      'The broken seals are out: the envoy sold the mail\'s privacy to its carriers, and the town is guessing what traveled unsealed.',
    ],
    're-adjudicated': [
      'The old carriers are destroyed, but the courier lines are still cut, and whoever moves letters now inherited the envoy\'s rate.',
    ],
  },
  depleted: {
    attributed: [
      'The mission has nothing left to offer, so the envoy offers what does not exist; concessions are promised that no one authorized, and the consideration for them stays with the promiser.',
      'Diplomacy runs on gifts, and the gift chest is empty; the envoy trades in promises instead, and pockets what the promises fetch, knowing none will ever be honored.',
    ],
    're-caused': [
      "The envoy's first cause has passed; the empty gift chest reasons for them now, and the unauthorized promises keep fetching their price.",
    ],
    reformed: [
      'The mission was resupplied and the envoy recalled the false promises, each with its compensation; the fetched consideration was returned first.',
      'With the gift chest refilled, the envoy came clean; the unauthorized concessions were disavowed by the envoy before any injured party asked.',
    ],
    historicized: [
      'The mission recovered, but the false promises still circulate; the emptiness that coined them has been resupplied.',
    ],
    'exposed-public': [
      'It is public that the envoy sold concessions no one authorized, and the holders of those promises are presenting them for payment.',
      'The promise trade is out: the envoy pocketed the consideration for a future that was never coming, and the buyers have arrived in it.',
    ],
    're-adjudicated': [
      'The syndicate is gone, but the mission is still empty-handed, and the promise trade has new brokers holding the envoy\'s signature.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo terms pass across the envoy\'s desk before they are announced, and certain merchants are never surprised; foreknowledge has a price, and the envoy collects it in advance of every proclamation.',
      'Trade policy is the envoy\'s trade now; who will be embargoed, when, and for what, sold quietly to those whose fortunes turn on the timing.',
    ],
    're-caused': [
      'What first held the envoy has passed; the embargo holds them now, and each advance sale of its terms renews the arrangement.',
    ],
    reformed: [
      'The embargo lifted and the envoy disclosed the advance sales; the forewarned merchants were named to the ones who were not.',
      'When the trade war ended, the envoy came clean; the timing fees were surrendered, and the desk sealed against the habit.',
    ],
    historicized: [
      'The embargo is lifted, but the desk still leaks; the terms that made the leaking valuable are repealed.',
    ],
    'exposed-public': [
      'It is public that the embargo\'s terms were sold in advance from the envoy\'s desk, and the ruined are matching their losses to the forewarned\'s gains.',
      'The advance sales are out: the envoy retailed the future of the town\'s trade, and the buyers\' fortunes date the deliveries.',
    ],
    're-adjudicated': [
      'The old buyers are destroyed, but the trade is still strangled, and the foreknowledge trade continues to new subscribers.',
    ],
  },
  'levied-away': {
    attributed: [
      'With the town\'s strength at war, the reports the envoy sends home decide what help comes and when; the reports are edited now, and the editor is paid by those who prefer the help delayed.',
      'The envoy\'s dispatches are the town\'s voice abroad while its men are away fighting, and the voice has been bought; what home hears is curated by interests home has never met.',
    ],
    're-caused': [
      "The envoy's first cause resolved, but the levy made the dispatches decisive, and the editing fees now sustain the arrangement.",
    ],
    reformed: [
      'The companies came home and the envoy sent the uncut record after the cut one, with the differences marked and the fees enclosed.',
      'When the strength returned, the envoy came clean; the curated dispatches were confessed, and the curators named to both capitals.',
    ],
    historicized: [
      'The strength is home, but the dispatches are still curated; the war that made them decisive is over.',
    ],
    'exposed-public': [
      'It is public that the town\'s voice abroad was edited for pay while its men fought, and the withheld paragraphs are being read aloud.',
      'The editing is out: the envoy sold silence in the dispatches, and the help that never came now has an explanation.',
    ],
    're-adjudicated': [
      'The syndicate fell, but the strength is still levied away, and the dispatch-editing has been re-commissioned by new interests.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The envoy\'s foreign patrons pay well for honest assessments, and the honest assessment is that this town cannot defend itself; the envoy files it abroad monthly, itemized, with the gate rotations attached.',
      'A hollow garrison is valuable intelligence, and the envoy is its exporter; the weakness travels abroad in diplomatic language, and the finder\'s fee travels back.',
    ],
    're-caused': [
      "The envoy's first reason passed, but the garrison hollowed after, and the weakness reports now earn the arrangement's keep.",
    ],
    reformed: [
      'The garrison was refilled and the envoy corrected the record abroad; the weakness reports were retracted, and the retraction cost the fees.',
      'With the ranks restored, the envoy came clean; the exported assessments were confessed to the council with the patrons\' names.',
    ],
    historicized: [
      'The garrison stands full again, but the assessments still go abroad; the weakness they described has been repaired without their notice.',
    ],
    'exposed-public': [
      'It is public that the envoy exported the town\'s weakness with the gate rotations attached, and the town is changing the rotations first and the locks second.',
      'The weakness reports are out: the envoy sold the hollow garrison abroad by the month, and the buyers are the town\'s new anxiety.',
    ],
    're-adjudicated': [
      'The old patrons are destroyed, but the garrison is still drained, and the weakness trade has found the envoy new readers.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The envoy carries the peace terms between the camps, and each camp reads the other\'s first; the carrying is the office, the pre-reading is the income.',
      'War diplomacy runs through the envoy\'s satchel, and the satchel leaks by appointment; both sides negotiate against terms they have already bought.',
    ],
    're-caused': [
      "The envoy's old cause cleared, but the war pressed in, and the satchel's leaks now finance the arrangement.",
    ],
    reformed: [
      'The war receded and the envoy confessed the pre-readings to both camps at once, which is the only safe order to do it in.',
      'With the pressure lifted, the envoy came clean; the leak fees were surrendered, and the satchel carried its last terms sealed.',
    ],
    historicized: [
      'The war moved on, but the satchel still leaks by appointment; the negotiations that priced it have concluded.',
    ],
    'exposed-public': [
      'It is public that both camps bought each other\'s terms from the envoy\'s satchel, and the peace they signed is being re-read for what the leaking bought.',
      'The pre-readings are out: the envoy sold the negotiation to itself, and both signatories want the difference refunded.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the satchel\'s appointments have been rebooked by new clients.',
    ],
  },
  occupation: {
    attributed: [
      'The envoy is accredited to the occupier now, and the accreditation is earned; the protests filed are hollow by agreement, and the townsfolk who ask for intercession are reported for asking.',
      'The mission survives the occupation by serving it; the envoy\'s official complaints arrive pre-softened, and the occupier\'s answers arrive pre-approved, and the theater fools only the town.',
    ],
    're-caused': [
      "What first compromised the envoy is gone; the occupier's accreditation sustains the mission now, and the hollow protests keep the accreditation.",
    ],
    reformed: [
      'The occupier withdrew and the envoy published the agreement that had hollowed the protests, with every reported name and an unsoftened apology.',
      'With the occupation ended, the envoy came clean; the pre-approved theater was confessed, and the reported petitioners sought out one by one.',
    ],
    historicized: [
      'The occupier is gone, but the envoy still files protests shaped for a censor; the agreement that shaped them expired with the occupation.',
    ],
    'exposed-public': [
      'It is public that the envoy\'s protests were theater by agreement, and the petitioners who were reported for asking help are the first to speak.',
      'The accreditation\'s price is out: hollow complaints and reported names, and the envoy\'s signature on the arrangement.',
    ],
    're-adjudicated': [
      "The envoy's old paymaster is destroyed, but the occupier remains, and the accreditation has been renewed on the standing terms.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron prizes betrayal above all offerings, and the envoy\'s office is made of trusts to betray; each broken confidence returns as favor, and the envoy has grown rich in favor.',
      'The envoy\'s treacheries have acquired a theology; a patron that rewards the betrayed trust sponsors them, and the diplomatic pouch has become a reliquary of other people\'s secrets.',
    ],
    're-caused': [
      "The envoy's first cause resolved, but a patron that rewards the deed adopted the treacheries, and its favor now retains them.",
    ],
    reformed: [
      "The patron's shadow lifted and the envoy stopped the betrayals; the broken confidences were confessed to their owners, unprompted and complete.",
      'With the rewarding patron gone, the envoy came clean; the sponsored treacheries lost their wages, and the envoy found nothing else in them.',
    ],
    historicized: [
      'The patron is gone, but the envoy still breaks confidences by habit; the sponsorship that trained the hand is over.',
    ],
    'exposed-public': [
      'It is public that the envoy\'s betrayals were devotions to a dark patron, and every broken trust is being recounted as an offering.',
      'The sponsorship is out: treachery from this mission was paid worship, and the capitals that trusted the envoy have been told.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the envoy's treacheries passed into its service whole.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith funds the mission\'s expenses now, and the mission carries their people; missionaries travel in the envoy\'s baggage as clerks and translators, and the credentials are real because the envoy signs them.',
      'The envoy\'s diplomatic immunity has become a corridor; the rival faith moves its preachers and its purse through it, and the tolls fund the embassy.',
    ],
    're-caused': [
      "The envoy's first reason passed; the rival faith's funding replaced it, and the credentialed missionaries keep the corridor open.",
    ],
    reformed: [
      'The rival faith withdrew and the envoy voided the false credentials; the corridor closed, and the funded expenses were repaid.',
      'When the conversion pressure broke, the envoy came clean; the baggage-clerks were named as preachers, and the immunity restored to its purpose.',
    ],
    historicized: [
      'The rival faith gave up the town, but the corridor is still open; the mission it carried has stopped sending.',
    ],
    'exposed-public': [
      'It is public that the mission\'s baggage carried the rival faith\'s preachers under real credentials, and the signing hand is known.',
      'The corridor is out: the envoy rented diplomatic immunity to the conversion, and both congregations are auditing the clerks.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and the corridor\'s tolls have been re-funded by its successors.',
    ],
  },
  secularization: {
    attributed: [
      'A diplomatic seal is only as sacred as the oath under it, and the oaths here died with the faith; the envoy opens what should stay sealed and resells safe-conducts that were sworn, once, before a god.',
      'With the faith gone cold, the envoy\'s sworn instruments became paper; safe-conducts are reissued to second buyers, and the original holders learn at the gate.',
    ],
    're-caused': [
      "The envoy's first cause resolved, but the faith went cold behind it, and with the oaths dead, the resold instruments simply multiplied.",
    ],
    reformed: [
      'The faith revived and the envoy re-swore the office\'s oaths; the double-issued safe-conducts were honored twice over at the mission\'s cost.',
      'When belief returned, the envoy came clean; the opened seals were confessed, and the instruments made single and sacred again.',
    ],
    historicized: [
      'The faith warmed again, but the instruments still ride double; the cold season that loosened the seals is past.',
    ],
    'exposed-public': [
      'It is public that the envoy resold sworn safe-conducts while the oaths meant nothing, and the stranded holders are presenting both copies.',
      'The opened seals are out: the envoy treated the sacred instruments as stationery, and the reviving faith is reading the wax.',
    ],
    're-adjudicated': [
      "The envoy's paymaster fell, but the faith is still cold, and no revived oath seals the instruments against the habit.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The temple\'s disgrace must not reach the foreign courts, and the envoy is paid to see it does not; the containment is professional, the retainer is generous, and the leverage compounds monthly.',
      'Abroad, the clergy\'s scandal is a rumor, and the envoy keeps it one; dispatches are trimmed, inquiries misdirected, and the temple pays the mission\'s best salary for the service.',
    ],
    're-caused': [
      "The envoy's first reason resolved, but the tainted priesthood needed containment abroad, and the retainer now carries the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the envoy ended the containment; the trimmed dispatches were completed and re-sent, with the retainer returned.',
      "With the clergy's scandal resolved, the envoy came clean; the misdirected inquiries were answered honestly, however late.",
    ],
    historicized: [
      'The temple was set in order, but the containment retainer still arrives; the scandal it suppresses is already absolved.',
    ],
    'exposed-public': [
      'It is public that the envoy was the scandal\'s customs officer, and the foreign courts are reading the untrimmed record at last.',
      'The containment is out: the temple\'s disgrace was managed abroad for a retainer, and the manager\'s name is on the receipts.',
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the containment retainer has been assumed by new principals.",
    ],
  },
  captured: {
    attributed: [
      'The syndicate discovered what the envoy always knew: diplomatic baggage is never searched; their goods travel under the mission\'s seals now, and the envoy\'s allowance reflects the tonnage.',
      'The underworld holds the offices, and the mission\'s immunity is its favorite; the envoy\'s pouches ride heavy, and the weight is never diplomatic.',
    ],
    're-caused': [
      "The envoy's old cause resolved, but the underworld holds the offices now, and an immunity it uses is not returned to its owner.",
    ],
    reformed: [
      'The capture was broken and the envoy opened the baggage to the magistrates; the tonnage records were produced from the envoy\'s own files.',
      "With the syndicate's grip broken, the envoy came clean; the heavy pouches were confessed, and the immunity surrendered until trust returned.",
    ],
    historicized: [
      'The capture was broken, but the pouches still ride heavy; the customer is gone and the route remembers itself.',
    ],
    'exposed-public': [
      'It is public that the mission\'s baggage moved the syndicate\'s goods, and every unsearched crossing is being reweighed from the records.',
      'The tonnage is out: the envoy rented the seals to the underworld by weight, and the allowance books kept honest track of the dishonesty.',
    ],
    're-adjudicated': [
      'The syndicate that filled the pouches is destroyed, but the offices are still captured, and the new holders have re-booked the route.',
    ],
  },
  scandal: {
    attributed: [
      'The town\'s scandal is valuable abroad, and the envoy is its exporter; the disgrace travels out as intelligence briefs, priced by the name, and the foreign buyers file it for later.',
      'Every capital wants to know which of this town\'s hands are dirty, and the envoy sells the manicure records; the scandal\'s details leave in the dispatch case and the fees come back in it.',
    ],
    're-caused': [
      "The envoy's first cause cleared, but the scandal broke behind it, and exporting its details now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the envoy recalled the briefs where recalling was possible, and confessed the rest to the council by name.',
      'When the scandal settled, the envoy came clean; the export fees were surrendered, and the buyers\' identities filed with the magistrates.',
    ],
    historicized: [
      'The scandal is old news at home, but the envoy still exports it; the foreign appetite outlived the local one.',
    ],
    'exposed-public': [
      'It is public that the envoy sold the town\'s disgrace abroad by the name, and the named are learning which capitals hold their files.',
      'The export trade is out: the scandal\'s details crossed the border in the dispatch case, and the town\'s shame has foreign shareholders now.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the export trade has been re-brokered to new buyers.",
    ],
  },
};
