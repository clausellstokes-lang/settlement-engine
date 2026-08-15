/**
 * corpusFactorySlice — THE CORPUS FACTORY staging catalog (V-5, VISION WAVE).
 *
 * The runtime side of the corpus factory: AI-drafted candidates are STAGED here with full
 * provenance, reviewed (approve / reject / revise), and — once approved — folded into canon
 * by the owner through gen:compendium-data (domain/compendium/corpusStaging.js). This slice
 * NEVER writes canon; it only holds candidates. Persisted to a localStorage mirror (the
 * customContentSlice idiom) so an authoring session survives a reload.
 *
 * Every mutating action here is registered in operationRegistry.js (the registry lifecycle
 * law) — the walker fails if one is added without a row.
 */

const LOCAL_KEY = 'sf_corpus_candidates';

/** @returns {any[]} */
function loadStaged() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

/** @param {any[]} list */
function writeStaged(list) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch { /* storage may be unavailable */ }
}

/** A short, stable-ish id for a candidate (no crypto needed — a staging ref). */
function makeCandidateId() {
  return `cand_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const VALID_STATUS = new Set(['staged', 'approved', 'rejected']);

/**
 * @param {(fn: (s: any) => void) => void} set
 * @param {() => any} get
 */
export const createCorpusFactorySlice = (set, get) => ({
  /** The staging catalog: an array of candidate records (each carries provenance). */
  corpusCandidates: loadStaged(),

  /**
   * Stage AI-drafted candidates. Each item = { kind, target, text }; provenance
   * (model / promptFamily / date / source) is stamped here so EVERY candidate is
   * attributable. Returns the count staged.
   * @param {Array<{kind?: string, target?: string, text?: string}>} items
   * @param {{ model?: string, promptFamily?: string }} [provenance]
   */
  stageCorpusCandidates: (items, provenance = {}) => {
    const now = new Date().toISOString();
    const prov = {
      model: typeof provenance.model === 'string' && provenance.model ? provenance.model : 'unknown',
      promptFamily: typeof provenance.promptFamily === 'string' && provenance.promptFamily ? provenance.promptFamily : 'unknown',
      date: now,
      source: 'ai-draft',
    };
    const staged = (Array.isArray(items) ? items : [])
      .filter((it) => it && typeof it.text === 'string' && it.text.trim())
      .map((it) => ({
        id: makeCandidateId(),
        kind: typeof it.kind === 'string' ? it.kind : 'institutionDesc',
        target: typeof it.target === 'string' ? it.target : '',
        text: it.text.trim(),
        status: 'staged',
        provenance: { ...prov },
        createdAt: now,
        updatedAt: now,
      }));
    if (staged.length === 0) return 0;
    set((s) => { s.corpusCandidates = [...staged, ...(Array.isArray(s.corpusCandidates) ? s.corpusCandidates : [])]; });
    writeStaged(get().corpusCandidates);
    return staged.length;
  },

  /**
   * Review a staged candidate: approve / reject / revise-back-to-staged. Approval marks it
   * eligible for the canon fold (but does NOT itself write canon — that stays an owner
   * commit + regen). An unknown status is ignored.
   * @param {string} id @param {'approved'|'rejected'|'staged'} status
   */
  reviewCorpusCandidate: (id, status) => {
    if (!VALID_STATUS.has(status)) return;
    const now = new Date().toISOString();
    set((s) => {
      const list = Array.isArray(s.corpusCandidates) ? s.corpusCandidates : [];
      s.corpusCandidates = list.map((c) => (c && c.id === id ? { ...c, status, updatedAt: now } : c));
    });
    writeStaged(get().corpusCandidates);
  },

  /** Remove a candidate from the staging catalog entirely. @param {string} id */
  removeCorpusCandidate: (id) => {
    set((s) => {
      const list = Array.isArray(s.corpusCandidates) ? s.corpusCandidates : [];
      s.corpusCandidates = list.filter((c) => c && c.id !== id);
    });
    writeStaged(get().corpusCandidates);
  },
});
