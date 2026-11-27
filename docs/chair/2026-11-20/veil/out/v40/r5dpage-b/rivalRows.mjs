// R5D-PAGE-B (VEIL-40), item 5b's MEASURE: T12's rows, COPIED AS DATA from src/generators/density/applyDensityLaw.js ::
// RIVAL_DESC_OF_HOST at 74afc8219 (read by symbol; the table is not exported, and an export is a STOP for the seat's word:
// ruling 105). Each row: the host's opening line (recognised) and the minted rival's whole description (T12). The probe checks the
// copy against every born rival: a rival whose base is a row's text must have a host whose stored base matches that row's
// pattern, and a host whose base matches a row must have a rival carrying that row's text (a drift reds as `t12-copy-drift`).
export const A_SECOND_WATCH = 'A second armed company that wants a share of keeping order here, and of the say that goes with it.';
export const T12_ROWS = Object.freeze([
  [/^(City|Town) watch; |^Standing army with genuine political weight;/, A_SECOND_WATCH],
  [/^Emergency committee with authority over rationing, conscription, and defence spending;/,
    "A rival bloc that wants a say over rationing, conscription and defence spending, and disputes the emergency committee's hold on them."],
  [/^(Crown-appointed emergency|Emergency) body coordinating supply, conscription, and military contracting\./,
    "A rival bloc that wants a say over supply, conscription and the army's contracts, and disputes the emergency body's hold on them."],
  [/^(Crown-appointed emergency|Emergency) body with powers over requisition, conscription, and price controls\./,
    "A rival bloc that wants a say over requisition, conscription and prices, and disputes the emergency body's powers over them."],
  [/^Organised criminal network controls the black market and several informal revenue streams;/,
    'A rival criminal network that wants a share of the black market and its takings, and contests them with the established one.'],
  [/^External administrative body; all significant decisions require approval or reversal\./,
    "A rival bloc that wants a say over the decisions made here, and disputes the outside administration's hold on them."],
  [/^External or crown-appointed body with authority to verify compliance with the conversion order\./,
    'A rival body that wants a say in enforcing the conversion order, and disputes who should decide who complies.'],
]);
/** The T12 row a rival's base is (its index), or -1. */
export const t12RowOfText = (base) => T12_ROWS.findIndex(([, text]) => base === text);
/** The T12 row a host's base opens with (its index), or -1. */
export const t12RowOfHost = (base) => T12_ROWS.findIndex(([re]) => re.test(String(base ?? '')));
