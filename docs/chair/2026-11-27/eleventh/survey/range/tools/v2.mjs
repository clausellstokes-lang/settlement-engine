// The script's one correction after the hand read (v2): see A-variants.md.
globalThis.__V2 = ({ meanO, coreShare, n }) => {
  if (meanO < 0.10 && coreShare <= 0.5) return 'DISTINCT';
  if (meanO >= 0.30) return 'PARAPHRASE';
  if (coreShare >= 0.99 && n <= 3) return 'PARAPHRASE';
  if (meanO >= 0.18 && coreShare >= 0.66 && n <= 3) return 'PARAPHRASE';
  if (meanO < 0.10) return 'DISTINCT';
  return 'ANGLES';
};
