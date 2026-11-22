/**
 * readerStoreStub.mjs — the store the three tab surfaces read, headless.
 *
 * WHY THIS EXISTS AT ALL. The Faith, War and Power tabs are the only place three rubric
 * systems become SURFACES rather than model dumps: `faithPanelModel` computes deity effects
 * the tab may or may not paint, `warStatus` computes fields the WarTab may or may not show,
 * and a reader scoring `shown` from the model dump instead of the painted tab is committing
 * exactly the failure the rubric's derived citation kind exists to refuse. To read the tabs a
 * runner must render them, and to render them it must satisfy `useStore`.
 *
 * WHY A STUB RATHER THAN THE REAL STORE. `src/store/index.js` builds a zustand store with
 * `persist` and `devtools` middleware over browser storage; instantiating it in node either
 * throws or silently invents a world. More importantly, the real store would let the tab read
 * state THIS RUNNER DID NOT PUT THERE — and a surface document must be a function of the
 * threaded campaign alone, or the corpus stops being reproducible.
 *
 * ⚠ THE HONEST-ABSENCE TRAP, MEASURED BEFORE IT BIT. A probe rendered all three tabs
 * successfully and got three HONEST-ABSENCE shells ("No power structure data.") because its
 * stub carried a settlement but no live campaign. A render that succeeds is NOT yet a
 * surface: the shells hash cleanly, verify cleanly, and say nothing. `tabSurfaceIsShell`
 * below exists so the corpus can say WHICH it got, per tab, rather than letting a reader
 * mistake a shell for a finding.
 *
 * The five selector reads the three tabs actually make, measured at this tip:
 *   FaithTab  `auth.tier`, `isElevated()`, `campaigns`
 *   WarTab    `auth.tier`, `isElevated()`, `campaigns`, `savedSettlements`
 *   PowerTab  `focusedEntity`
 *
 * PURE: no clock, no random, no persistence. The state is set by the caller before a render
 * and read back by the selector, and nothing else reaches it.
 */

/** @type {Record<string, any>} */
let state = {
  auth: { tier: 'free' },
  isElevated: () => false,
  campaigns: [],
  savedSettlements: [],
  focusedEntity: null,
};

/**
 * Install the world one tab render reads. Called by the corpus runner immediately before
 * `renderToStaticMarkup`, never by a component.
 * @param {Record<string, any>} next
 */
export function setReaderStoreState(next) {
  state = {
    auth: { tier: 'free' },
    isElevated: () => false,
    campaigns: [],
    savedSettlements: [],
    focusedEntity: null,
    ...next,
  };
}

/** The current state, for a caller that wants to assert what it installed. */
export function readerStoreState() {
  return state;
}

/**
 * The `useStore` the tabs import. A selector-taking read of the installed state, with the
 * bare (selector-less) form returning the whole state exactly as zustand's does.
 * @param {(s: Record<string, any>) => unknown} [selector]
 */
export function useStore(selector) {
  return typeof selector === 'function' ? selector(state) : state;
}

useStore.getState = () => state;
useStore.setState = (next) => setReaderStoreState({ ...state, ...next });
useStore.subscribe = () => () => {};

export default useStore;

/** The named selector hooks `store/index.js` also exports, so an importer of one resolves. */
export const useAuth = () => state.auth;
export const useConfig = () => state.config;
export const useSettlement = () => state.settlement;
export const useAi = () => state.aiSettlement;
export const useCredits = () => state.creditBalance;
export const useIsElevated = () => state.isElevated();

/**
 * Does a rendered tab say anything, or is it the honest-absence shell?
 *
 * The test is deliberately CRUDE and stated as such: a shell is short and carries one of the
 * tabs' own absence sentences. It is a REPORTED signal, not an assertion — the corpus records
 * `shell: true|false` per tab and the reader decides. Calling a shell a surface is the failure
 * this guards; calling a real surface a shell would merely under-claim.
 *
 * @param {string} markup
 * @returns {{ shell: boolean, bytes: number, reason: string | null }}
 */
export function tabSurfaceIsShell(markup) {
  const text = String(markup ?? '');
  const bytes = Buffer.byteLength(text, 'utf-8');
  const absenceTells = [
    'No power structure data',
    'No war data',
    'No faith data',
    'Nothing to show',
    'not available',
  ];
  const tell = absenceTells.find((phrase) => text.includes(phrase)) ?? null;
  if (tell) return { shell: true, bytes, reason: `carries the absence sentence: ${tell}` };
  if (bytes < 600) return { shell: true, bytes, reason: `only ${bytes} bytes of markup` };
  return { shell: false, bytes, reason: null };
}
