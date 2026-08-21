/**
 * components/organic/samples/fixtures.js — the taste-veto sample content.
 *
 * Real-SHAPED content (the field names the live surfaces render — settlement
 * identity + crisis + NPCs + hooks; deity catalog rows; pricing tiers; library
 * rows) in the surveyor's voice, so the sample screens typeset ACTUAL strings, not
 * lorem. Deliberately decoupled from the generated artifacts (compendiumData,
 * pricing config) so the byte-stable sample golden never drifts when those regen —
 * these are authored fixtures whose only job is to exercise the composition. Pure
 * data; used only by the sample components + their drift-guarded generator.
 */

export const dossierFixture = Object.freeze({
  name: 'Thornwall',
  tier: 'Town',
  population: 2400,
  tradeAccess: 'On the coast road; a tidal harbour',
  age: 210,
  terrain: 'Coastal, walled',
  character: 'A wall town that learned to trade with the sea it once feared.',
  emblemKind: 'watch',
  arrival:
    'You come to Thornwall by the coast road, and the wall shows first — grey stone the height of four men, salt-stained on its seaward face. The gate stands open in daylight; a toll-clerk keeps a ledger you are welcome to read and unwelcome to argue with. Beyond, the town falls toward a tidal harbour where the fishing fleet lies careened at low water and the warehouses smell of pitch and drying cod.',
  situation: [
    { label: 'Power', score: 62, note: 'A merchant council, lately at odds with the harbour guild.' },
    { label: 'Economy', score: 71, note: 'Salt, salt-cod, and the toll on the coast road.' },
    { label: 'Defense', score: 68, note: 'The wall is sound; the garrison is thin and underpaid.' },
  ],
  crisis: {
    label: 'The harbour silts',
    summary: 'A winter of storms has pushed the bar across the harbour mouth; deep-keeled ships now wait for the tide or unload offshore.',
    hook: 'The council will pay well for a survey of the bar — and better for anyone who can move it.',
  },
  npcs: [
    { name: 'Alderman Coss Rell', role: 'Head of the merchant council', trait: 'Reads every ledger; trusts none of them.' },
    { name: 'Mother Vane', role: 'Keeper of the sea-shrine', trait: 'Buried three husbands to the tide; blesses the fleet anyway.' },
    { name: 'Dovey Ash', role: 'Harbour-guild boss', trait: 'Would rather dredge than be dredged out of business.' },
  ],
  hooks: [
    'The toll-clerk’s ledger shows a barge that pays the road toll but is never seen on the road.',
    'Mother Vane wants the old sea-shrine on the bar re-consecrated before the dredging disturbs it.',
    'A Redwater factor is quietly buying up silted-harbour warehouses at a loss — or an investment.',
  ],
  institutions: ['The Merchant Council', 'The Harbour Guild', 'The Sea-Shrine of the Vane', 'The Coast-Road Toll'],
  provenance: [
    'Population from the tier band (Town: 1,000–5,000), settled near the median.',
    'The harbour crisis is this settlement’s active stressor — it will resolve, worsen, or spread as the region advances.',
    'The Redwater factor is a live relationship edge to a neighbouring settlement.',
  ],
});

export const deitiesFixture = Object.freeze({
  count: 12,
  intro: 'The twelve deities of the core pantheon, as a surveyor records them: the name a town swears by, the portfolio it prays over, and the temper the clergy will admit to.',
  entries: [
    { name: 'Maru of the Tide', rank: 'Major', alignment: 'Neutral', portfolio: 'The sea, safe harbour, and the toll of drowning', temperament: 'Patient', domain: 'Water' },
    { name: 'Bael Anvil-Hand', rank: 'Major', alignment: 'Good', portfolio: 'Smithing, honest weights, and the guild oath', temperament: 'Steady', domain: 'Craft' },
    { name: 'The Grey Sister', rank: 'Minor', alignment: 'Neutral', portfolio: 'Roads, thresholds, and the traveller’s luck', temperament: 'Watchful', domain: 'Passage' },
    { name: 'Verrin of the Sheaf', rank: 'Major', alignment: 'Good', portfolio: 'Harvest, stored grain, and the lean winter', temperament: 'Generous', domain: 'Field' },
    { name: 'Osk the Unpaid', rank: 'Cult', alignment: 'Evil', portfolio: 'Debt, spite, and the collector at the door', temperament: 'Relentless', domain: 'Coin' },
    { name: 'Lantern-in-the-Deep', rank: 'Minor', alignment: 'Neutral', portfolio: 'Mines, the dark, and what is found in it', temperament: 'Secretive', domain: 'Stone' },
  ],
});

export const pricingFixture = Object.freeze({
  noHiddenFees: 'The price on this page is the price at checkout. No setup fees, no seat math, no surprise renewals.',
  tiers: [
    { name: 'Wanderer', price: 'Free', cadence: 'forever', tagline: 'For the curious DM trying things out.', cta: 'Start free', featured: false,
      features: ['Generate any size, from hamlet to metropolis', 'Three saved settlements', 'Share settlements to the community Gallery', 'Keep any dossier’s PDF for $2.99, yours to re-download'] },
    { name: 'Cartographer', price: '$5.99', cadence: 'per month', tagline: 'For the DM running a campaign.', cta: 'Subscribe', featured: true,
      features: ['Advance time and run the region for years', 'Campaigns: link settlements into one living world', 'The self-ending war layer + the living pantheon', 'Unlimited saves, cloud sync, and export', '30 narrative credits every month, then pay-per-use'] },
    { name: 'Founder Charter', price: '$99', cadence: 'one-time', tagline: 'The first thirty supporters keep Cartographer forever.', cta: 'Claim a founder seat', featured: false,
      features: ['Everything Cartographer runs, forever', 'A founder’s mark on your dossiers', 'A direct line to the maker', 'Early access to new simulators'] },
  ],
  bundle: { name: 'The settlement bundle', price: '$2.99', body: 'One settlement’s complete export bundle. Pay for the thing, own the thing — it downloads, it prints, it survives cancellation. No account required.' },
  serviceLine: 'Cartographer is a service, not a feature key: your realm keeps living — wars resolve, prices move, chronicles write — and every month of simulation is a month of our servers doing it.',
});

export const libraryFixture = Object.freeze({
  quota: { tier: 'Cartographer', used: 6, max: '∞' },
  rows: [
    { name: 'Thornwall', tier: 'Town', phase: 'Canon', health: 'strained', signal: 'The harbour silts', campaign: 'The Salt Coast' },
    { name: 'Redwater Ford', tier: 'Village', phase: 'Canon', health: 'steady', signal: 'Buying Thornwall warehouses', campaign: 'The Salt Coast' },
    { name: 'Kingsbarrow', tier: 'City', phase: 'Canon', health: 'thriving', signal: 'Grain surplus; a new mint', campaign: 'The Salt Coast' },
    { name: 'Ashen Reach', tier: 'Hamlet', phase: 'Draft', health: 'embattled', signal: 'Raiders on the upland road', campaign: null },
    { name: 'Gull’s Watch', tier: 'Thorp', phase: 'Draft', health: 'steady', signal: 'A lighthouse, half-built', campaign: null },
  ],
});
