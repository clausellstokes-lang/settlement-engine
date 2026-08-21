/**
 * Thin first-paint trampoline for the account-data importer.
 *
 * Parsing, hardening, cleanup, and analytics are only needed after the user
 * chooses an export file. Keep that cold graph behind the action boundary so
 * anonymous visitors do not download it with the initial store.
 */
export const createAccountImportSlice = (set, get) => ({
  importAccountData: async text => {
    const { createAccountImportSlice: createImportBody } = await import('./accountImportBody.js');
    return createImportBody(set, get).importAccountData(text);
  },
});
