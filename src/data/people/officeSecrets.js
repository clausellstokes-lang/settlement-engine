/**
 * src/data/people/officeSecrets.js — L4 (PAGE-2, 2026-11-20; the brief docs/chair/2026-11-20/content/page/briefs/S-v2.md,
 * the chair's routing of 11:24/11:26): AN OFFICE FACE'S SECRET, BY TITLE, as DATA. Every line is listed for the owner's
 * veto in docs/chair/2026-11-20/content/page/S1-LINES.md, beside the line each title's cards drew most before it.
 *
 * THE FAULT. The titles here hold goal pools of their own, so the title table (titleSecretsPresentations.js, the 147
 * fallback titles) does not write them, and their cards draw from the role-free pool (`npc/factionLeaderSecret.js`), whose
 * lines presume a trade or an office the holder may not have: a dean ran "a protection scheme targeting the very merchants
 * they're supposed to serve", a chief magistrate's "legitimate business" fronted contraband.
 *
 * THE WIRING (npcGenerator.js :: generateSingleNPC, through `factionLeaderSecret.js :: settleOfficeSecret`). The secret draw
 * is UNCHANGED: the card draws exactly as before and the held set receives the DRAWN text, so every later card's refusals
 * are what they were. THEN, draw-free, a card whose title has rows here takes one (`kernel/proseHash.js :: pickVariant`,
 * keyed on the card's own drawn name and its title), walking in row order past a row the roster already holds, and that
 * text is held too. No draw is added, removed or moved.
 *
 * THE TITLES are keyed by the title the draw reads (the face's title, `options.title`): the gendered form is applied after
 * every draw (data/holderTitleForms.js), so an abbess draws as "the abbot" and a senior abbess as "the senior abbot". Every
 * POOL_BY_TITLE title of the same pool roles is here (people/poolMap.js), except a title the title table already writes.
 * Two titles of one office share one set of rows, which reads true of both: the magistrate and the chief magistrate (one
 * docket, one bench); the watch captain and the captain of the watch (one roster, one set of keys). The rest hold their own.
 *
 * THE LAW (titleSecretsPresentations.js's, the same voice): small, human, true to the calling; every line presumes no fact
 * but the face's own office and house (the tithe, the church's seal and land, the parish register, the bell, a confidence kept or broken, the relic, the rota, the book of visits; the
 * docket and its fees; the roster, the night keys and the prisoners in the watch's keeping; the muster and the arms; the garrison's stores, drills and leave)
 * and names no other institution, no person, no power, no tier word and no magic. A secret says what is hidden and what
 * exposure would cost; no murder. The row shape is `npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER`'s `{ secret, stakes }`
 * (sentence-cased fragments, no closing stop), the record the secret draw returns and the card stores as `{ what, stakes }`.
 */

/** @typedef {Readonly<{ secret: string, stakes: string }>} OfficeSecret */

/** @param {string} secret @param {string} stakes @returns {OfficeSecret} */
const S = (secret, stakes) => Object.freeze({ secret, stakes });

const BENCH = Object.freeze([
  S("Takes a little extra from those who want their hearing brought forward on the docket, and keeps it off the books",
    "Those who waited their turn would see how the order was really set, and every judgment since would be questioned"),
  S("Let a case drop quietly because the accused once lent them money and has never asked for it back",
    "If the loan came out, the injured party would say the bench had been bought, and would not be wrong"),
  S("Gave a judgment in a hurry without reading the last of the evidence, and has never dared read it since",
    "Anyone who reads that evidence now will see the wrong party was made to pay"),
]);

const WATCH = Object.freeze([
  S("Lets an old friend borrow the night keys, and never asks where they go",
    "Whatever was done with those keys after dark would be laid at the watch, and at its captain first"),
  S("Changes the roster so the night round never passes one street on certain nights, for a gift each time",
    "When something is found to have happened on that street, the roster will show who kept the watch away"),
  S("Let a prisoner in the watch's keeping walk free because they were kin, and wrote it down as an escape",
    "The watchman blamed for the escape lost their place over it, and still wants to know how it happened"),
]);

/** title → its three office secrets (`{ secret, stakes }`). @type {Readonly<Record<string, readonly OfficeSecret[]>>} */
export const OFFICE_SECRETS = Object.freeze({
  'the dean': Object.freeze([
    S("Takes a share of the tithe before it is counted, and writes the shortfall down as a poor harvest",
      "The households who paid in full would see the count was false, and would want every year of it back"),
    S("Sold the graves nearest the altar to families who could pay, and moved older burials to make room",
      "The families whose dead were moved have never been told, and would not forgive it"),
    S("Has set the church's seal to leases of its land for a gift, without putting them before those who should agree",
      "Every lease sealed that way could be undone, and the tenants who paid for them would want their gifts back"),
  ]),
  'the bishop': Object.freeze([
    S("Has been selling the church's old silver plate a piece at a time and putting gilt copies on the altar",
      "Anyone who looked closely on a feast day would see the difference, and ask where the silver went"),
    S("Gives the best livings to kin and to those who bring gifts, and the poorest to those who ask questions",
      "The priests passed over would speak up together, and every gift would be named"),
    S("Knows the church's most venerated relic was bought from a peddler and is not what the faithful are told, and has it shown to them all the same",
      "The faithful who prayed before it would feel cheated, and every offering it drew would have to be answered for"),
  ]),
  'the priest': Object.freeze([
    S("Has written false entries in the parish register for a fee, so that children born out of wedlock read as born within it",
      "If the register were ever read against what the families remember, every entry in that hand would be doubted"),
    S("Repeats what people tell them in confidence, a little at a time, to the household that pays for the church roof",
      "Those who confided in them would never speak to them again"),
    S("Spent the money gathered to recast the cracked bell, and tells everyone the work is only delayed",
      "The bell still sounds cracked every morning, and the families who gave would want their coin back"),
  ]),
  'the abbot': Object.freeze([
    S("Keeps a second purse from the sale of the house's honey and candle wax, outside its accounts",
      "Those who keep the hives would see where their work had gone, and the house would want a reckoning"),
    S("Gives the easy duties in the rota to those whose families send gifts, and the night watches and the fields to the rest",
      "Those who carried the heavy work for years would turn on the abbey's head together"),
    S("Took in a novice who was running from a debt, and has hidden them from the people who came asking",
      "If the debt is traced to the house, it will be called a hiding place for anyone who owes"),
  ]),
  'the senior abbot': Object.freeze([
    S("Has been moving gifts left to the poorer houses of the order into the house where they live, and calling it good stewardship",
      "The poorer houses have gone short for years, and their heads would not stay quiet once they knew why"),
    S("Signs off each house's accounts without reading them, in return for a quiet share from the two that cheat",
      "When the cheating is found, their own signature will be on every page of it"),
    S("Signs the book of visits to the poorer houses each year without having gone to them",
      "The heads of those houses know no one came, and one of them has started keeping a count"),
  ]),
  'the magistrate': BENCH,
  'the chief magistrate': BENCH,
  'the watch captain': WATCH,
  'the captain of the watch': WATCH,
  'the militia captain': Object.freeze([
    S("Sold some of the militia's spears and kept the coin, and counts the rest twice at every muster",
      "The first time the militia is called out in earnest, there will not be enough to go round"),
    S("Keeps the grown sons and daughters of paying families off the muster roll, and has others drill in their place",
      "The families whose children drill every week in their stead would not forgive it"),
    S("Has never stood in a real fight, and has told the militia stories of one for years",
      "If they ever do, everyone will learn the truth at the worst moment"),
  ]),
  'the garrison commander': Object.freeze([
    S("Sells part of the garrison's stores out of the back gate and writes them down as spoiled",
      "If the garrison is ever shut in, the stores will run out long before the count says they should"),
    S("Writes up drills that never took place, and hires the soldiers out as labour on those days",
      "If the garrison is ever tested, it will be found out of practice, and the hire money will be traced"),
    S("Sells leave to the soldiers who can pay for it, and gives their night watches to those who cannot",
      "The soldiers who stand the extra watches keep their own count, and would not stay quiet if asked"),
  ]),
});
